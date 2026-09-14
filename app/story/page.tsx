'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CheckoutModal from '@/components/CheckoutModal'
import BookingModal from '@/components/BookingModal'
import DiningAssistantModal from '@/components/DiningAssistantModal'
import { ALL_MENU_ITEMS, MenuItem } from '@/lib/menuData'
import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Utensils,
} from 'lucide-react'

export default function StoryPage() {
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

  return (
    <div className="main-wrapper">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* STORY HERO */}
      <section className="hero-section" style={{ minHeight: '60vh', padding: '60px 24px' }}>
        <div className="hero-bg-overlay" style={{ opacity: 0.18 }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="gold-eyebrow">OUR CULINARY GENESIS</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--text-heading)', marginBottom: '20px' }}>
            A Heaven for Travelers & Connoisseurs on SH 19
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: '1.7', maxWidth: '720px', margin: '0 auto 30px' }}>
            Some places feed you. Some places stay with you forever. Aaditya&apos;s Midway was born out of a passion to transform highway journeys into moments of warm hospitality, slow-cooked royal flavors, and timeless memories.
          </p>
          <button onClick={() => setIsBookingOpen(true)} className="btn-luxury-gold">
            <Calendar size={16} /> Reserve a Table at Midway
          </button>
        </div>
      </section>

      {/* STORY CHAPTER 1: THE FOUNDATION */}
      <section className="luxury-section">
        <div className="hero-grid">
          <div>
            <span className="gold-eyebrow">CHAPTER I: THE VISION</span>
            <h2 style={{ fontSize: '42px', color: 'var(--text-heading)', marginBottom: '20px' }}>
              Born on State Highway 19, Sausar
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
              In 2021, on the bustling stretch of State Highway 19 at Gokuldham, Sausar, we noticed a void in roadside dining: while fast food was common, true culinary craftsmanship and royal hospitality were rare.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              We set out to create a sanctuary where long-distance travelers, local food lovers, and families could pull up a chair, inhale the aroma of burning charcoal, and savor dishes prepared with uncompromising integrity.
            </p>

            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--gold-light)' }}>
                  2021
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Established in Sausar</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--gold-light)' }}>
                  100k+
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Meals Served with Love</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--gold-light)' }}>
                  ~80 Dishes
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Master Recipes</span>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"
              alt="Aaditya's Midway Restaurant Ambience"
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '20px', border: '1px solid var(--border-gold)' }}
            />
          </div>
        </div>
      </section>

      {/* STORY CHAPTER 2: CULINARY PHILOSOPHY */}
      <section className="luxury-section" style={{ background: 'var(--bg-card)', borderRadius: '32px' }}>
        <div className="section-head">
          <span className="gold-eyebrow">CHAPTER II: OUR CRAFT</span>
          <h2>The Pillars of Our Kitchen</h2>
          <p>Four golden rules that every chef at Aaditya&apos;s Midway strictly honors</p>
        </div>

        <div className="food-card-grid">
          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <Utensils size={32} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '20px', marginBottom: '8px' }}>
              Hand-Ground Spices
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              We roast and grind whole cardamom, mace, nutmeg, and kashmiri chilis in-house every morning. No commercial powders.
            </p>
          </div>

          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <ShieldCheck size={32} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '20px', marginBottom: '8px' }}>
              100% Fresh & Halal
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              All meats, seafood, and fresh farm produce are sourced directly from trusted ethical farms daily.
            </p>
          </div>

          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <Clock size={32} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '20px', marginBottom: '8px' }}>
              Slow Charcoal Cooking
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              Our Kabuli Pulao simmers slowly in heavy brass pots, while skewers roast over glowing hardwood coals.
            </p>
          </div>

          <div className="luxury-food-card" style={{ padding: '28px' }}>
            <Heart size={32} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '20px', marginBottom: '8px' }}>
              Heartfelt Service
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              We treat every traveler like an honored guest in our own home, ensuring comfort and delight.
            </p>
          </div>
        </div>
      </section>

      {/* AMBIENCE & GALLERY */}
      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">ATMOSPHERE SPOTLIGHT</span>
          <h2>Designed For Comfort & Elegance</h2>
          <p>Explore the inviting dining spaces created for your rest and dining pleasure</p>
        </div>

        <div className="food-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80"
            alt="Warm Dining Room"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80"
            alt="Family Table"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80"
            alt="Night Illumination"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
            alt="Grill Station"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
          />
        </div>
      </section>

      {/* FLOATING AI ASSISTANT TRIGGER */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="floating-ai-fab"
        aria-label="Open AI Assistant"
      >
        <Bot size={22} />
        <span>Ask Aaditya&apos;s Assistant</span>
      </button>

      <Footer />

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
          updateQuantity(item.id, 1)
          setIsAssistantOpen(false)
          setIsCartOpen(true)
        }}
        allItems={ALL_MENU_ITEMS}
      />
    </div>
  )
}
