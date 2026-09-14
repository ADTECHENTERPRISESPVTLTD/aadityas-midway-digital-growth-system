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
  Bot,
  Calendar,
  CheckCircle2,
  Copy,
  Gift,
  Percent,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react'

export default function OffersPage() {
  const [cart, setCart] = useState<Record<number, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

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

  function handleCopy(code: string) {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div className="main-wrapper">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* OFFERS HERO */}
      <section className="hero-section" style={{ minHeight: '50vh', padding: '60px 24px' }}>
        <div className="hero-bg-overlay" style={{ opacity: 0.15 }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="gold-eyebrow">EXCLUSIVE PROMOTIONS</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: '16px' }}>
            Good Things Come In Offers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Because a memorable meal on SH 19 is even better when accompanied by exceptional privileges and rewards.
          </p>
        </div>
      </section>

      {/* OFFERS GRID */}
      <section className="luxury-section">
        <div className="food-card-grid">
          {/* Offer 1 */}
          <div
            className="luxury-food-card"
            style={{
              background: 'linear-gradient(135deg, #1f2738 0%, #121824 100%)',
              border: '1px solid var(--border-gold)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="gold-eyebrow">WEEKDAY EXCLUSIVE</span>
              <Percent size={28} className="gold-icon" />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', marginBottom: '12px' }}>
              20% Off Total Dine-In Bill
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Dine with us Monday through Thursday and enjoy an instant 20% discount on all culinary items and beverages.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--gold-light)', fontWeight: 700, fontSize: '14px' }}>
                MIDWEEK20
              </span>
              <button onClick={() => handleCopy('MIDWEEK20')} className="btn-luxury-gold">
                {copiedCode === 'MIDWEEK20' ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Offer 2 */}
          <div
            className="luxury-food-card"
            style={{
              background: 'linear-gradient(135deg, #241d18 0%, #15100c 100%)',
              border: '1px solid var(--border-gold)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="gold-eyebrow">ONLINE ORDER BONUS</span>
              <Gift size={28} className="gold-icon" />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', marginBottom: '12px' }}>
              ₹150 Off First Online Order
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Order through our digital menu for express pickup or delivery and claim ₹150 off on orders above ₹699.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--gold-light)', fontWeight: 700, fontSize: '14px' }}>
                FIRSTBITE
              </span>
              <button onClick={() => handleCopy('FIRSTBITE')} className="btn-luxury-gold">
                {copiedCode === 'FIRSTBITE' ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Offer 3 */}
          <div
            className="luxury-food-card"
            style={{
              background: 'linear-gradient(135deg, #19251c 0%, #0e1710 100%)',
              border: '1px solid var(--border-gold)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="gold-eyebrow">ROYAL GROUP PASS</span>
              <Users size={28} className="gold-icon" />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', marginBottom: '12px' }}>
              Complimentary Chef Dessert
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Dining in a group of 6 or more? Enjoy a round of signature desserts or artisanal cold drinks on the house!
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Applicable on Table Reservation</span>
              <button onClick={() => setIsBookingOpen(true)} className="btn-luxury-gold">
                Reserve Table
              </button>
            </div>
          </div>
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
