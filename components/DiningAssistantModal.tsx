'use client'

import { useState } from 'react'
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
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'ai',
      text: 'Greetings! I am Aaditya\'s Sommelier & Dining Concierge. I can help you pick the best dish for your palate, recommend food pairings, or answer questions about our ~80 signature dishes!',
      suggestedItem: allItems.find((i) => i.name.includes('Kabuli Pulao')) || allItems[0],
    },
  ])

  if (!isOpen) return null

  function handleSend() {
    if (!input.trim()) return

    const userQuery = input.trim()
    const newMsgs: Message[] = [...messages, { from: 'user', text: userQuery }]
    setInput('')

    // Match query to dish recommendations
    const queryLower = userQuery.toLowerCase()
    let replyText = 'Our master chefs take immense pride in every preparation on SH 19.'
    let recItem = allItems.find((i) => i.badge === 'Signature' || i.badge === 'Chef Special')

    if (queryLower.includes('soup') || queryLower.includes('starter')) {
      replyText = 'For a warming starter, our Thai Tom Yum or Nordic Salmon Soup are guest favorites!'
      recItem = allItems.find((i) => i.category === 'Soup' && i.badge === 'Chef Special')
    } else if (queryLower.includes('biryani') || queryLower.includes('pulao') || queryLower.includes('rice')) {
      replyText = 'You must experience our Royal Kabuli Pulao, cooked with tender braised lamb shank and caramelized carrots.'
      recItem = allItems.find((i) => i.name.includes('Kabuli Pulao'))
    } else if (queryLower.includes('drink') || queryLower.includes('shake') || queryLower.includes('refresher')) {
      replyText = 'Our Ocean Blue Lemonade and Hong Kong Mango Pomelo Sago are stunningly refreshing!'
      recItem = allItems.find((i) => i.name.includes('Mango Pomelo'))
    } else if (queryLower.includes('veg') || queryLower.includes('paneer')) {
      replyText = 'Our Paneer Loaded Fries and Maru Bhajias offer rich, crispy vegetarian indulgence!'
      recItem = allItems.find((i) => i.name.includes('Paneer Loaded Fries'))
    } else if (queryLower.includes('lamb') || queryLower.includes('chop') || queryLower.includes('steak')) {
      replyText = 'For a meat lover\'s dream, order our Wood-Fired Baby Lamb Chops or 14oz T-Bone Steak!'
      recItem = allItems.find((i) => i.name.includes('Baby Lamb Chop'))
    }

    setMessages([
      ...newMsgs,
      {
        from: 'ai',
        text: replyText,
        suggestedItem: recItem,
      },
    ])
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chat-modal-panel" onClick={(e) => e.stopPropagation()}>
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
        </div>

        {/* Input area */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask e.g. What's the best lamb dish? Or vegetarian recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="chat-send-btn" aria-label="Send query">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
