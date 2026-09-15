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
import FoodGallery from '@/components/FoodGallery'
import { ArrowRight, Bot, Calendar, ShoppingBag } from 'lucide-react'

export default function GalleryPage() {
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

      <section className="hero-section gallery-page-hero">
        <div className="hero-bg-overlay" style={{ opacity: 0.28 }} />
        <div className="hero-grid">
          <div className="hero-content">
            <span className="gold-eyebrow">FOOD · AMBIENCE · MOMENTS</span>
            <h1>
              Every Plate.<br />
              <i>Every Corner.</i><br />
              Every Memory.
            </h1>
            <p className="hero-description">
              Step inside Aaditya&apos;s Midway and explore the flavors, spaces, and little details that make every stop on SH 19 feel special.
            </p>
            <div className="hero-actions">
              <Link href="/menu" className="btn-luxury-gold">
                Explore The Menu <ArrowRight size={16} />
              </Link>
              <Link href="/reviews" className="btn-luxury-outline">
                Read Guest Reviews
              </Link>
            </div>
            <div className="hero-stats-row">
              <div className="stat-item">
                <strong>6+</strong>
                <span>Signature Visual Stories</span>
              </div>
              <div className="stat-item">
                <strong>Daily</strong>
                <span>Freshly Prepared & Plated</span>
              </div>
              <div className="stat-item">
                <strong>SH 19</strong>
                <span>Made For The Journey</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
              alt="Warm dining space at Aaditya's Midway"
              className="hero-visual-img"
            />
            <div className="hero-floating-badge">
              <span className="badge-icon-star">✦</span>
              <div className="badge-text">
                <strong>Designed With Heart</strong>
                <small>Flavors, spaces & warm hospitality</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FoodGallery />

      <section className="luxury-section">
        <div className="section-head">
          <span className="gold-eyebrow">BRING THE MOMENT HOME</span>
          <h2>Your Table Is Waiting</h2>
          <p>From a quiet family meal to a celebratory feast, we are ready to make your next visit unforgettable.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link href="/menu" className="btn-luxury-gold">
            Order A Favorite <ShoppingBag size={16} />
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
