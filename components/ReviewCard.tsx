import { CheckCircle2, Star } from 'lucide-react'

interface ReviewCardProps {
  rating: number
  customerName: string
  review: string
  date: string
  avatarText?: string
  tagline?: string
}

export default function ReviewCard({
  rating,
  customerName,
  review,
  date,
  avatarText,
  tagline = 'Google Verified Review',
}: ReviewCardProps) {
  const initial = avatarText || customerName.charAt(0)

  return (
    <div className="luxury-food-card review-card-motion" style={{ padding: '28px' }}>
      {/* Rating Stars */}
      <div className="rating-stars mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>

      {/* Review Text */}
      <p style={{ color: '#e2e5eb', fontStyle: 'italic', fontSize: '15px', lineHeight: '1.65', marginBottom: '20px' }}>
        “{review}”
      </p>

      {/* Reviewer Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div className="reviewer-avatar-circle">
          {initial}
        </div>
        <div>
          <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '14px' }}>
            {customerName}
          </strong>
          <small style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <CheckCircle2 size={12} className="gold-icon" /> {tagline} · {date}
          </small>
        </div>
      </div>
    </div>
  )
}
