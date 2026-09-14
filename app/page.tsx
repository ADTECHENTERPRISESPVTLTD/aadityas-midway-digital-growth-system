'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ALL_MENU_ITEMS, MenuItem } from '@/lib/menuData'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CheckoutModal from '@/components/CheckoutModal'
import BookingModal from '@/components/BookingModal'
import DiningAssistantModal from '@/components/DiningAssistantModal'
import FoodCard from '@/components/FoodCard'
import OfferCard from '@/components/OfferCard'
import ReviewCard from '@/components/ReviewCard'
import FoodGallery from '@/components/FoodGallery'
import LocationSection from '@/components/LocationSection'
import LiveOrderToast from '@/components/LiveOrderToast'
import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  Compass,
  Flame,
  Heart,
  ShieldCheck,
  Star,
  Sparkles,
  Utensils,
} from 'lucide-react'

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [customerReviews, setCustomerReviews] = useState([
    { rating: 5, customerName: 'Major Rajesh Sharma', date: 'September 2026', review: 'We stopped here on our drive from Nagpur and were completely blown away. The Kabuli Pulao and Mango Pomelo smoothie were divine. Truly world-class hospitality on SH 19.' },
    { rating: 5, customerName: 'Dr. Ananya Deshmukh', date: 'August 2026', review: 'The Baby Lamb Chops and Paneer Loaded Fries are incredible. 100% unique dish presentation and ultra clean atmosphere. Highly recommended for families!' },
    { rating: 5, customerName: 'Vikramaditya Singh', date: 'July 2026', review: 'Cleanest restaurant on the highway with authentic Mediterranean kebabs! Quick order placement and friendly staff. Will always stop here.' },
  ])

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = ALL_MENU_ITEMS.filter((item) => cart[item.id] > 0).reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  )

  const signatureDishes = ALL_MENU_ITEMS.filter(
    (item) => item.badge === 'Signature' || item.badge === 'Chef Special' || item.badge === 'Bestseller'
  ).slice(0, 6)

  function updateQuantity(id: number, delta: number) {
    setCart((prev) => {
      const current = prev[id] || 0
      const next = current + delta
      const copy = { ...prev }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  }

  function addToCart(item: MenuItem) {
    updateQuantity(item.id, 1)
  }

  return (
    <div className="main-wrapper">
      {/* Task L-01: Header */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />
        <div className="hero-grid">
          <div className="hero-content">
            <span className="gold-eyebrow">
              <Flame size={12} className="gold-icon inline mr-1 animate-bounce" /> A CULINARY HAVEN ON SH 19 · SAUSAR
            </span>
            <h1>
              Good Food.<br />
              <i>Good Mood.</i><br />
              Great Memories.
            </h1>
            <p className="hero-description">
              Welcome to Aaditya&apos;s Midway — where slow-cooked royal Afghan Kabuli pulao, wood-fired lamb chops, flame-grilled Mediterranean grills, and artisanal beverages unite under one roof.
            </p>
            <div className="hero-actions">
              <Link href="/menu" className="btn-luxury-gold">
                Explore Culinary Menu (~80 Dishes) <ArrowRight size={16} />
              </Link>
              <button onClick={() => setIsBookingOpen(true)} className="btn-luxury-outline">
                <Calendar size={16} /> Reserve a Table
              </button>
            </div>
            <div className="hero-stats-row">
              <div className="stat-item">
                <strong>4.9 ★★★★★</strong>
                <span>4,000+ Happy Travelers & Locals</span>
              </div>
              <div className="stat-item">
                <strong>~80 Dishes</strong>
                <span>100% Unique Prepared Fresh Daily</span>
              </div>
              <div className="stat-item">
                <strong>11 AM – 11 PM</strong>
                <span>Open Daily on SH 19</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"
              alt="Mediterranean Mix Grill Feast at Aaditya's Midway"
              className="hero-visual-img"
            />
            <div className="hero-floating-badge">
              <span className="badge-icon-star">✦</span>
              <div className="badge-text">
                <strong>Made with Heart</strong>
                <small>Served with Royal Soul on SH 19</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND PHILOSOPHY */}
      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">OUR CULINARY PHILOSOPHY</span>
          <h2>Not Just A Stop. <i>It&apos;s A Feeling.</i></h2>
          <p>
            Rooted in the rich culinary heritage of India and the Mediterranean, Aaditya&apos;s Midway was born out of a desire to create a heartwarming sanctuary for long road trips and family gatherings.
          </p>
        </div>

        <div className="food-card-grid">
          <div className="luxury-food-card" style={{ padding: '32px' }}>
            <Compass size={36} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '10px' }}>
              Organic & Fresh Daily
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Every spice is hand-ground, and every marinade is aged in small batches. We never use pre-frozen meats or artificial colors.
            </p>
          </div>

          <div className="luxury-food-card" style={{ padding: '32px' }}>
            <Award size={36} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '10px' }}>
              Master Chef Integrity
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              From charcoal-fired clay tandoors to wok-tossed jasmine rice, our chefs craft authentic recipes loved across borders.
            </p>
          </div>

          <div className="luxury-food-card" style={{ padding: '32px' }}>
            <Heart size={36} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '10px' }}>
              Warm Roadside Hospitality
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Generous seating, sparkling clean amenities, lush ambience, and friendly service make every visit memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Task L-03: CHEF'S SIGNATURE SHOWCASE (REUSABLE FOODCARDS) */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '32px' }}>
        <div className="section-head">
          <span className="gold-eyebrow">CHEF&apos;S MASTERPIECES</span>
          <h2>Signature Culinary Highlights</h2>
          <p>Hand-picked dishes that define the soul of Aaditya&apos;s Midway</p>
        </div>

        <div className="food-card-grid">
          {signatureDishes.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/menu" className="btn-luxury-gold">
            View Complete Menu (~80 Dishes) <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Task L-04: OFFERS SECTION (REUSABLE OFFERCARDS) */}
      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">EXCLUSIVE PRIVILEGES</span>
          <h2>Good Things Come In Offers</h2>
          <p>Claim digital discount passes for your dine-in and delivery orders</p>
        </div>

        <div className="food-card-grid">
          <OfferCard
            kicker="WEEKDAY SPECIAL"
            title="20% Off Dine-In Bill"
            description="Enjoy 20% off your total bill when you dine in Monday to Thursday with family or friends."
            code="MIDWEEK20"
            icon="percent"
          />

          <OfferCard
            kicker="ONLINE ORDER BONUS"
            title="₹150 Off First Order"
            description="Get ₹150 off your first online order above ₹699. Instant express delivery or pickup."
            code="FIRSTBITE"
            icon="gift"
            bgGradient="linear-gradient(135deg, #241d18 0%, #15100c 100%)"
          />

          <OfferCard
            kicker="ROYAL GROUP PASS"
            title="Complimentary Dessert"
            description="Complimentary signature chef dessert for dining groups of 6 or more."
            code="GROUPDESSERT"
            icon="sparkles"
            bgGradient="linear-gradient(135deg, #19251c 0%, #0e1710 100%)"
            onClaim={() => setIsBookingOpen(true)}
          />
        </div>
      </section>

      {/* Task L-06: FOOD GALLERY SECTION */}
      <FoodGallery />

      {/* Task L-05: REVIEWS SECTION (REUSABLE REVIEWCARDS) */}
      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">VOICES OF OUR GUESTS</span>
          <h2>Loved By Travelers & Gourmands</h2>
          <p>Over 4,000 verified 5-star ratings across Google & dining platforms</p>
        </div>

        <div className="food-card-grid">
          {customerReviews.map((review) => (
            <ReviewCard key={`${review.customerName}-${review.date}`} {...review} />
          ))}
        </div>

        {/* Review Submission Form */}
        <div className="review-form-card" style={{ marginTop: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px' }}>
          <div className="review-form-header" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '22px', marginBottom: '6px' }}>Share Your Experience</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>How was your meal at Aaditya&apos;s Midway?</p>
          </div>

          <form className="review-form" onSubmit={(e) => {
            e.preventDefault()
            setCustomerReviews((reviews) => [
              ...reviews,
              { rating: reviewRating, customerName: reviewName, date: 'Just now', review: reviewText },
            ])
            setReviewName('')
            setReviewText('')
            setReviewRating(5)
            setReviewSubmitted(true)
          }}>
            {/* Star Rating Input */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Your Rating</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= reviewRating ? 'var(--gold-primary)' : 'var(--border-subtle)', padding: '2px' }}
                  >
                    <Star size={24} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Your Name</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-obsidian)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Review Text */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Your Review</label>
              <textarea
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-obsidian)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                background: 'var(--gold-primary)',
                color: '#0b0e14',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Submit Review
            </button>

            {reviewSubmitted && (
              <p style={{ color: 'var(--gold-light)', marginTop: '16px', fontSize: '14px' }}>
                ✓ Thank you for your review! It will be published after moderation.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Task L-07: LOCATION SECTION */}
      <LocationSection onOpenBooking={() => setIsBookingOpen(true)} />

      {/* FLOATING AI ASSISTANT TRIGGER */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="floating-ai-fab"
        aria-label="Open AI Dining Assistant"
      >
        <Bot size={22} />
        <span>Ask Aaditya&apos;s Assistant</span>
      </button>

      {/* Mouth-Watering Live Order Toast */}
      <LiveOrderToast />

      {/* Task L-02: Footer */}
      <Footer />

      {/* MODALS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        allItems={ALL_MENU_ITEMS}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={subtotal > 999 ? subtotal : subtotal + (subtotal > 0 ? 99 : 0)}
        onSuccess={() => {
          setCart({})
          setIsCheckoutOpen(false)
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <DiningAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onAddToCart={(item) => {
          addToCart(item)
          setIsAssistantOpen(false)
          setIsCartOpen(true)
        }}
        allItems={ALL_MENU_ITEMS}
      />
    </div>
  )
}
