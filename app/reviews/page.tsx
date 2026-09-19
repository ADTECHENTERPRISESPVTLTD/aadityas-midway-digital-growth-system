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
import ReviewSection from '@/components/ReviewSection'
import { ArrowRight, Bot, Calendar, MessageSquare, Star } from 'lucide-react'

export default function ReviewsPage() {
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

      <section className="hero-section reviews-page-hero">
        <div className="hero-bg-overlay" style={{ opacity: 0.22 }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="gold-eyebrow">VOICES FROM THE MIDWAY</span>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', marginBottom: '18px' }}>
            Loved By Every Traveler
          </h1>
          <p className="hero-description" style={{ maxWidth: '680px', margin: '0 auto 28px' }}>
            Real moments, warm hospitality, and the flavors our guests remember long after they leave State Highway 19.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', fontFamily: 'Georgia, serif', fontSize: '28px' }}>
              4.9 <Star size={24} fill="currentColor" />
            </div>
            <div style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', color: 'var(--text-heading)', fontSize: '15px' }}>4,000+ guest ratings</strong>
              Across Google and dining platforms
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="#guest-reviews" className="btn-luxury-gold">
              Read Guest Stories <ArrowRight size={16} />
            </Link>
            <Link href="/gallery" className="btn-luxury-outline">
              <MessageSquare size={16} /> View The Gallery
            </Link>
          </div>
        </div>
      </section>

      <div id="guest-reviews">
        <ReviewSection />
      </div>

      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">COME SEE WHAT THEY MEAN</span>
          <h2>Taste The Midway For Yourself</h2>
          <p>Every review begins with a fresh plate, a warm welcome, and a place to slow down on the road.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link href="/menu" className="btn-luxury-gold">
            Explore The Menu <ArrowRight size={16} />
          </Link>
          <button onClick={() => setIsBookingOpen(true)} className="btn-luxury-outline">
            <Calendar size={16} /> Reserve A Table
          </button>
        </div>
      </section>

      <button
        onClick={() => setIsAssistantOpen(true)}
        className="floating-ai-fab"
        aria-label="Open AI Dining Assistant"
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
        cart={cart}
        allItems={ALL_MENU_ITEMS}
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
