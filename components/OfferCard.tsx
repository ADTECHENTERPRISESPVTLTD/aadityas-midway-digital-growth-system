'use client'

import { useState } from 'react'
import { Copy, Gift, Percent, Sparkles } from 'lucide-react'

interface OfferCardProps {
  title: string
  description: string
  code: string
  kicker: string
  icon?: 'percent' | 'gift' | 'sparkles'
  bgGradient?: string
  onClaim?: () => void
}

export default function OfferCard({
  title,
  description,
  code,
  kicker,
  icon = 'percent',
  bgGradient = 'linear-gradient(135deg, #1f2738 0%, #121824 100%)',
  onClaim,
}: OfferCardProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
    onClaim?.()
  }

  return (
    <div
      className="luxury-food-card offer-card-motion"
      style={{
        background: bgGradient,
        border: '1px solid var(--border-gold)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="shimmer-gold-line" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="gold-eyebrow">{kicker}</span>
        {icon === 'gift' && <Gift size={28} className="gold-icon pulse-glow" />}
        {icon === 'sparkles' && <Sparkles size={28} className="gold-icon pulse-glow" />}
        {icon === 'percent' && <Percent size={28} className="gold-icon pulse-glow" />}
      </div>

      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', marginBottom: '12px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
        {description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <span className="code-pill-box">
          {code}
        </span>
        <button onClick={handleCopy} className="btn-luxury-gold">
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>
    </div>
  )
}
