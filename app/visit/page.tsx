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
  Car,
  Clock,
  Compass,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react'

export default function VisitPage() {
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

      {/* VISIT HERO */}
      <section className="hero-section" style={{ minHeight: '50vh', padding: '60px 24px' }}>
        <div className="hero-bg-overlay" style={{ opacity: 0.15 }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="gold-eyebrow">LOCATION & RESERVATIONS</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: '16px' }}>
            See You At The Midway
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Conveniently situated on State Highway 19, Sausar. We offer drive-in parking, clean luxury restrooms, and rapid takeaway service.
          </p>
        </div>
      </section>

      {/* LOCATION & DETAILS GRID */}
      <section className="luxury-section">
        <div className="hero-grid">
          <div>
            <span className="gold-eyebrow">REACH OUR HAVEN</span>
            <h2 style={{ fontSize: '40px', color: '#fff', marginBottom: '24px' }}>
              Coordinates & Contact
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <MapPin size={24} className="gold-icon" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '16px', display: 'block' }}>Address</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    State Highway 19, Gokuldham, Sausar, Madhya Pradesh
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <Clock size={24} className="gold-icon" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '16px', display: 'block' }}>Opening Hours</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Open Every Day · 11:00 AM – 11:00 PM
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <Phone size={24} className="gold-icon" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '16px', display: 'block' }}>Direct Inquiry & Booking</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    +91 74153 88571
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="tel:7415388571" className="btn-luxury-gold">
                <Phone size={16} /> Call Now
              </a>
              <a
                href="https://wa.me/917415388571"
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-outline"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                <MessageCircle size={16} /> WhatsApp Order
              </a>
              <button onClick={() => setIsBookingOpen(true)} className="btn-luxury-outline">
                <Calendar size={16} /> Reserve Table
              </button>
            </div>
          </div>

          {/* MAP CARD */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              minHeight: '380px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div>
              <span className="gold-eyebrow">NAVIGATION ASSIST</span>
              <h3 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '24px', marginBottom: '10px' }}>
                Aaditya&apos;s Midway Landmark
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Located right on State Highway 19 with ample parking for cars, tour buses, and motorcycles.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '24px 0' }}>
              <div style={{ background: '#0b0e14', padding: '12px', borderRadius: '10px', fontSize: '12px' }}>
                <Car size={18} className="gold-icon mb-1" />
                <strong style={{ color: '#fff', display: 'block' }}>Drive-In Parking</strong>
                <span style={{ color: 'var(--text-muted)' }}>Capacity 50+ Vehicles</span>
              </div>
              <div style={{ background: '#0b0e14', padding: '12px', borderRadius: '10px', fontSize: '12px' }}>
                <Wifi size={18} className="gold-icon mb-1" />
                <strong style={{ color: '#fff', display: 'block' }}>High-Speed Wi-Fi</strong>
                <span style={{ color: 'var(--text-muted)' }}>Free for all Guests</span>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Aaditya's+Midway+SH+19+Gokuldham+Sausar"
              target="_blank"
              rel="noreferrer"
              className="btn-luxury-gold full-w"
              style={{ textAlign: 'center' }}
            >
              Get Google Maps Directions <Navigation size={16} />
            </a>
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
