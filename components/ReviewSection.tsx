'use client'

import { useState } from 'react'
import ReviewCard from '@/components/ReviewCard'
import { CheckCircle2, MessageSquarePlus, Sparkles, Star, X } from 'lucide-react'

interface ReviewItem {
  id: number
  rating: number
  customerName: string
  review: string
  date: string
  tagline?: string
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    rating: 5,
    customerName: 'Major Rajesh Sharma',
    date: 'September 2026',
    review: 'We stopped here on our drive from Nagpur and were completely blown away. The Kabuli Pulao and Mango Pomelo smoothie were divine. Truly world-class hospitality on SH 19.',
  },
  {
    id: 2,
    rating: 5,
    customerName: 'Dr. Ananya Deshmukh',
    date: 'August 2026',
    review: 'The Baby Lamb Chops and Paneer Loaded Fries are incredible. 100% unique dish presentation and ultra clean atmosphere. Highly recommended for families!',
  },
  {
    id: 3,
    rating: 5,
    customerName: 'Vikramaditya Singh',
    date: 'July 2026',
    review: 'Cleanest restaurant on the highway with authentic Mediterranean kebabs! Quick order placement and friendly staff. Will always stop here.',
  },
]

export default function ReviewSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New review state
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !reviewText) return

    const newReview: ReviewItem = {
      id: Date.now(),
      rating,
      customerName: name,
      review: reviewText,
      date: 'Just now',
      tagline: 'Verified Visitor',
    }

    setReviews([newReview, ...reviews])
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setIsModalOpen(false)
      setName('')
      setReviewText('')
      setRating(5)
    }, 2000)
  }

  return (
    <section className="luxury-section">
      <div className="section-head">
        <span className="gold-eyebrow">VOICES OF OUR GUESTS</span>
        <h2>Loved By Travelers & Gourmands</h2>
        <p>Over 4,000 verified ratings across Google & dining platforms. Share your own Midway experience below!</p>
      </div>

      {/* Review Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="rating-stars" style={{ fontSize: '20px' }}>
            ★★★★★
          </span>
          <strong style={{ color: '#fff', fontSize: '18px', fontFamily: 'Georgia, serif' }}>
            4.9 / 5.0 Average Rating
          </strong>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({reviews.length + 4200} Reviews)</span>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-luxury-gold">
          <MessageSquarePlus size={16} /> Write A Review
        </button>
      </div>

      {/* Review Cards Grid */}
      <div className="food-card-grid">
        {reviews.map((rev) => (
          <ReviewCard
            key={rev.id}
            rating={rev.rating}
            customerName={rev.customerName}
            date={rev.date}
            review={rev.review}
            tagline={rev.tagline || 'Google Verified Review'}
          />
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="luxury-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsModalOpen(false)} aria-label="Close review modal">
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={54} className="gold-icon animate-bounce mb-3" />
                <h3 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '26px' }}>Thank You For Your Review!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                  Your feedback has been published live to our customer showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="booking-form">
                <div className="modal-head-section">
                  <span className="gold-eyebrow">SHARE YOUR FEEDBACK</span>
                  <h2 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '26px' }}>Rate Your Experience</h2>
                  <p className="subtext">Help fellow travelers discover the soul of Aaditya&apos;s Midway</p>
                </div>

                {/* Interactive Star Rating Selector */}
                <div className="my-4" style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '12px', color: 'var(--gold-light)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Select Star Rating
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: (hoverRating || rating) >= star ? '#d4af37' : 'rgba(255,255,255,0.2)',
                          fontSize: '28px',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group-grid responsive-grid">
                  <div className="form-field full">
                    <label>Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Siddharth Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-field full">
                    <label>Your Review</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the dishes you tried, ambient vibe, service speed, or hospitality..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      style={{
                        background: '#0b0e14',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '12px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        width: '100%',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-luxury-gold full-w mt-3" style={{ padding: '14px' }}>
                  Post Review Live <Sparkles size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
