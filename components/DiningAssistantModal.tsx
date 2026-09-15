'use client'

import { useEffect, useRef, useState } from 'react'
import { MenuItem } from '@/lib/menuData'
import { Bot, Plus, Send, Sparkles, X } from 'lucide-react'

interface DiningAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem) => void
  allItems: MenuItem[]
}

interface Message {
  from: 'ai' | 'user'
  text: string
  suggestedItem?: MenuItem
}

export default function DiningAssistantModal({
  isOpen,
  onClose,
  onAddToCart,
  allItems,
}: DiningAssistantModalProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    const fallback = allItems[0]
    if (!fallback) return []
    const found = allItems.find((i) => i.name.includes('Kabuli Pulao')) || fallback
    return [
      {
        from: 'ai',
        text: "Greetings! I am Aaditya's Sommelier & Dining Concierge. I can help you pick the best dish for your palate, recommend food pairings, or answer questions about our ~80 signature dishes!",
        suggestedItem: found,
      },
    ]
  })
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Wired to the AI Lead's real assistant (/api/ai/chat) — grounded in the
  // actual menu/business data, so it can't invent dishes or prices. This
  // replaces the earlier hardcoded reference implementation.
  async function handleSend() {
    if (!input.trim() || loading) return

    const userQuery = input.trim()
    setMessages((prev) => [...prev, { from: 'user', text: userQuery }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'AI request failed')

      const firstRecommendation = payload.data.recommendations?.[0]
      const suggestedItem = firstRecommendation
        ? allItems.find((item) => item.id === firstRecommendation.itemId)
        : undefined

      setMessages((prev) => [...prev, { from: 'ai', text: payload.data.reply, suggestedItem }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: "Sorry, I couldn't reach the assistant just now. Please try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Dining assistant">
      <div className="chat-modal-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-bot-avatar">
            <Bot size={20} className="gold-icon" />
          </div>
          <div>
            <h4>Aaditya&apos;s Sommelier AI</h4>
            <span className="live-status-sub"><Sparkles size={11} className="gold-icon" /> Instant Dining Advisor</span>
          </div>
          <button className="close-btn ms-auto" onClick={onClose} aria-label="Close assistant">
            <X size={18} />
          </button>
        </div>

        {/* Message Trajectory */}
        <div className="chat-messages-container">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble-row ${m.from}`}>
              <div className="chat-bubble">
                <p>{m.text}</p>
                {m.suggestedItem && (
                  <div className="chat-recommendation-card">
                    <img src={m.suggestedItem.image} alt={m.suggestedItem.name} />
                    <div className="card-info">
                      <span className="rec-badge">{m.suggestedItem.badge || 'Chef Pick'}</span>
                      <strong>{m.suggestedItem.name}</strong>
                      <span className="rec-price">₹{m.suggestedItem.price}</span>
                    </div>
                    <button
                      onClick={() => onAddToCart(m.suggestedItem!)}
                      className="chat-add-btn"
                      title="Add to order"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-row ai">
              <div className="chat-bubble">
                <p>Thinking…</p>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask e.g. What's the best lamb dish? Or vegetarian recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} className="chat-send-btn" aria-label="Send query" disabled={loading}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
