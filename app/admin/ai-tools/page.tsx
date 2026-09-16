'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface MarketingResult {
  caption: string
  reelHook: string
  storyIdea: string
  cta: string
  hashtags: string[]
}

interface OfferSuggestion {
  title: string
  items: string[]
  reason: string
}

interface SentimentResult {
  reviewId: string
  sentiment: string
  themes: string[]
}

export default function AiToolsPage() {
  const [item, setItem] = useState('')
  const [offer, setOffer] = useState('')
  const [marketing, setMarketing] = useState<MarketingResult | null>(null)
  const [marketingLoading, setMarketingLoading] = useState(false)
  const [marketingError, setMarketingError] = useState('')

  const [offers, setOffers] = useState<OfferSuggestion[] | null>(null)
  const [offersLoading, setOffersLoading] = useState(false)

  const [sentiment, setSentiment] = useState<SentimentResult[] | null>(null)
  const [sentimentLoading, setSentimentLoading] = useState(false)

  async function generateMarketing() {
    if (!item.trim()) return
    setMarketingLoading(true)
    setMarketingError('')
    setMarketing(null)
    try {
      const res = await fetch('/api/ai/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, offer: offer || undefined }),
      })
      const body = await res.json()
      if (!body.ok) throw new Error(body.error || 'Something went wrong')
      setMarketing(body.data)
    } catch (e) {
      setMarketingError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setMarketingLoading(false)
    }
  }

  async function loadOfferSuggestions() {
    setOffersLoading(true)
    try {
      const res = await fetch('/api/ai/offer-suggestions')
      const body = await res.json()
      setOffers(body.data?.suggestions ?? [])
    } finally {
      setOffersLoading(false)
    }
  }

  async function loadSentiment() {
    setSentimentLoading(true)
    try {
      const res = await fetch('/api/ai/sentiment')
      const body = await res.json()
      setSentiment(body.data?.results ?? body.data ?? [])
    } finally {
      setSentimentLoading(false)
    }
  }

  return (
    <div className="main-wrapper" style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>
        ← Back to site
      </Link>

      <div className="section-head" style={{ marginTop: '20px', marginBottom: '32px' }}>
        <span className="gold-eyebrow">
          <Sparkles size={12} className="gold-icon inline mr-1" /> INTERNAL TEST PAGE
        </span>
        <h2>AI Tools</h2>
        <p>Quick way to see AI-04 Marketing, AI-05 Offer Suggestions, and AI-06 Review Sentiment working, without needing to run commands.</p>
      </div>

      {/* AI-04 Marketing Assistant */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '4px' }}>AI-04 · Marketing Assistant</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
          Enter a dish name (and optional offer), get an Instagram caption, reel hook, story idea, CTA, and hashtags.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="Dish name, e.g. Kabuli Pulao"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{ flex: '1 1 220px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-heading)' }}
          />
          <input
            type="text"
            placeholder="Offer (optional), e.g. 20% off this weekend"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            style={{ flex: '1 1 220px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-heading)' }}
          />
          <button onClick={generateMarketing} disabled={marketingLoading || !item.trim()} className="btn-luxury-gold">
            {marketingLoading ? 'Generating…' : 'Generate'} <ArrowRight size={14} />
          </button>
        </div>

        {marketingError && <p style={{ color: '#e0664d', fontSize: '13px' }}>{marketingError}</p>}

        {marketing && (
          <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
            <div><strong>Caption:</strong> {marketing.caption}</div>
            <div><strong>Reel hook:</strong> {marketing.reelHook}</div>
            <div><strong>Story idea:</strong> {marketing.storyIdea}</div>
            <div><strong>CTA:</strong> {marketing.cta}</div>
            <div><strong>Hashtags:</strong> {marketing.hashtags.join(' ')}</div>
          </div>
        )}
      </section>

      {/* AI-05 Offer Suggestions */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '4px' }}>AI-05 · Offer Suggestions</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
          Suggests a combo to promote, based on real bestseller/category data, with a plain-language reason.
        </p>

        <button onClick={loadOfferSuggestions} disabled={offersLoading} className="btn-luxury-gold" style={{ marginBottom: '14px' }}>
          {offersLoading ? 'Loading…' : 'Load Suggestions'}
        </button>

        {offers && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {offers.map((s, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <strong>{s.title}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '6px 0 0' }}>{s.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI-06 Review Sentiment */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '28px' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', marginBottom: '4px' }}>AI-06 · Review Sentiment</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
          Classifies each review as positive / neutral / negative, and tags themes (food, service, ambience, waiting time).
        </p>

        <button onClick={loadSentiment} disabled={sentimentLoading} className="btn-luxury-gold" style={{ marginBottom: '14px' }}>
          {sentimentLoading ? 'Loading…' : 'Load Sentiment'}
        </button>

        {sentiment && (
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 90px 1fr', padding: '0 14px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Review</span>
              <span>Sentiment</span>
              <span>Themes</span>
            </div>
            {sentiment.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 90px 1fr', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                <span>#{r.reviewId}</span>
                <span style={{ textTransform: 'capitalize' }}>{r.sentiment}</span>
                <span style={{ color: 'var(--text-muted)' }}>{r.themes.join(', ') || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
