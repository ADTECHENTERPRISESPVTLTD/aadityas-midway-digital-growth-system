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
import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  Clock,
  Compass,
  Gift,
  Heart,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Utensils,
} from 'lucide-react'

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

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
            <span className="gold-eyebrow">A CULINARY HAVEN ON SH 19 · SAUSAR</span>
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

      {/* BRAND PHILOSOPHY / STORY TEASER */}
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

      {/* CHEF'S SIGNATURE SHOWCASE */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '32px' }}>
        <div className="section-head">
          <span className="gold-eyebrow">CHEF&apos;S MASTERPIECES</span>
          <h2>Signature Culinary Highlights</h2>
          <p>Hand-picked dishes that define the soul of Aaditya&apos;s Midway</p>
        </div>

        <div className="food-card-grid">
          {signatureDishes.map((item) => (
            <div key={item.id} className="luxury-food-card">
              <div className="food-card-img-wrap">
                <img src={item.image} alt={item.name} />
                {item.badge && <span className="item-badge-pill">{item.badge}</span>}
                <div className={`veg-indicator-dot ${item.veg ? 'veg' : 'non-veg'}`} title={item.veg ? 'Pure Veg' : 'Non-Veg'} />
              </div>
              <div className="food-card-body">
                <span className="food-card-category">{item.category}</span>
                <h3 className="food-card-title">{item.name}</h3>
                <p className="food-card-desc">{item.description}</p>
                <div className="food-card-meta-row">
                  <span className="rating-stars"><Star size={14} fill="currentColor" /> {item.rating}</span>
                  <span>({item.reviews} reviews)</span>
                </div>
                <div className="food-card-footer">
                  <div className="food-card-price-block">
                    <span className="price-main">₹{item.price}</span>
                    <span className="price-original">{item.priceLabel}</span>
                  </div>
                  <button onClick={() => addToCart(item)} className="add-to-cart-btn">
                    <Plus size={15} /> Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/menu" className="btn-luxury-gold">
            View Complete Menu (~80 Dishes) <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SPECIAL OFFERS BANNER */}
      <section className="luxury-section">
        <div
          style={{
            background: 'linear-gradient(135deg, #1b2333 0%, #0d121c 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: '24px',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="gold-eyebrow">MIDWEEK LUXURY OFFER</span>
            <h2 style={{ fontSize: '38px', color: '#fff', marginBottom: '16px' }}>
              Enjoy 20% Off Your Dine-In Bill
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Travelers and families dining Monday to Thursday receive an instant 20% savings on all platters and beverages.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px border-gold',
                  color: 'var(--gold-light)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                PROMO CODE: MIDWEEK20
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('MIDWEEK20')
                  alert('Coupon code MIDWEEK20 copied to clipboard!')
                }}
                className="btn-luxury-gold"
              >
                Copy Code
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
              alt="Special Meal Feast"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">VOICES OF OUR GUESTS</span>
          <h2>Loved By Travelers & Gourmands</h2>
          <p>Over 4,000 verified 5-star ratings across Google & dining platforms</p>
        </div>

        <div className="food-card-grid">
          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <div className="rating-stars mb-3"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <p style={{ color: '#e0e0e0', fontStyle: 'italic', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              “We stopped here on our drive from Nagpur and were completely blown away. The Kabuli Pulao and Mango Pomelo smoothie were divine. Truly world-class hospitality on SH 19.”
            </p>
            <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '14px' }}>— Major Rajesh Sharma</strong>
            <small style={{ color: 'var(--text-muted)' }}>Google Verified Review</small>
          </div>

          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <div className="rating-stars mb-3"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <p style={{ color: '#e0e0e0', fontStyle: 'italic', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              “The Baby Lamb Chops and Paneer Loaded Fries are incredible. 100% unique dish presentation and ultra clean atmosphere. Highly recommended for families!”
            </p>
            <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '14px' }}>— Dr. Ananya Deshmukh</strong>
            <small style={{ color: 'var(--text-muted)' }}>Food Critic & Traveler</small>
          </div>

          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <div className="rating-stars mb-3"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <p style={{ color: '#e0e0e0', fontStyle: 'italic', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              “Cleanest restaurant on the highway with authentic Mediterranean kebabs! Quick order placement and friendly staff. Will always stop here.”
            </p>
            <strong style={{ color: 'var(--gold-light)', display: 'block', fontSize: '14px' }}>— Vikramaditya Singh</strong>
            <small style={{ color: 'var(--text-muted)' }}>Frequent Highway Traveler</small>
          </div>
        </div>
      </section>

      {/* FLOATING AI ASSISTANT TRIGGER */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="floating-ai-fab"
        aria-label="Open AI Dining Assistant"
      >
        <Bot size={22} />
        <span>Ask Aaditya&apos;s Assistant</span>
      </button>

      {/* FOOTER */}
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
