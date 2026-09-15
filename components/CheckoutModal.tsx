'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ShieldCheck, X } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onSuccess: () => void
}

export default function CheckoutModal({ isOpen, onClose, totalAmount, onSuccess }: CheckoutModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'counter' | 'cod'>('upi')
  const [phoneError, setPhoneError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function validatePhone(value: string) {
    const digits = value.replace(/\D/g, '')
    if (value && digits.length !== 10) {
      return 'Enter a valid 10-digit mobile number'
    }
    return ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validatePhone(phone)
    if (err) {
      setPhoneError(err)
      return
    }
    setPhoneError('')
    setSubmitted(true)
    setTimeout(() => {
      onSuccess()
    }, 1800)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Checkout order">
      <div className="luxury-modal-card" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success-screen">
            <CheckCircle2 size={56} className="gold-icon animate-pulse" />
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, <strong>{name || 'Guest'}</strong>. Your delicious meal is now being freshly prepared by our chefs.</p>
            <div className="order-receipt-summary">
              <div><span>Total Paid / Payable:</span> <strong>₹{totalAmount.toLocaleString('en-IN')}</strong></div>
              <div><span>Order Type:</span> <strong>{orderType === 'pickup' ? 'Dine-In / Counter Pickup' : 'Express Home Delivery'}</strong></div>
              <div><span>Confirmation Code:</span> <strong>AM-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
            </div>
            <p className="subtext mt-3">We have sent the confirmation SMS to {phone || 'your phone number'}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="modal-head-section">
              <span className="gold-eyebrow">FINAL STEP</span>
              <h2>Complete Your Order</h2>
              <p className="subtext">Secure & instant order placement with Aaditya&apos;s Midway</p>
            </div>

            <div className="order-total-banner">
              <span>Total Payable Amount</span>
              <strong className="gold-price">₹{totalAmount.toLocaleString('en-IN')}</strong>
            </div>

            <div className="form-group-grid">
              <div className="form-field full">
                <label>Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Aaditya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-field full">
                <label>Phone Number (for SMS confirmation)</label>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (phoneError) setPhoneError('')
                  }}
                />
                {phoneError && (
                  <span style={{ color: 'var(--gold-light)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {phoneError}
                  </span>
                )}
              </div>

              <div className="form-field full">
                <label>Order Preference</label>
                <div className="radio-pill-group">
                  <button
                    type="button"
                    className={`pill-btn ${orderType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setOrderType('pickup')}
                  >
                    Dine-In / Counter Pickup
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${orderType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    Express Delivery
                  </button>
                </div>
              </div>

              {orderType === 'delivery' && (
                <div className="form-field full">
                  <label>Delivery Address / Landmark</label>
                  <input
                    required
                    type="text"
                    placeholder="House No., Street, Landmark in Sausar area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <div className="form-field full">
                <label>Select Payment Mode</label>
                <div className="payment-options-grid">
                  <button
                    type="button"
                    className={`payment-box ${paymentMethod === 'upi' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <strong>GPay / PhonePe / UPI</strong>
                    <small>Scan QR & pay instantly</small>
                  </button>
                  <button
                    type="button"
                    className={`payment-box ${paymentMethod === 'counter' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('counter')}
                  >
                    <strong>Pay at Counter</strong>
                    <small>Cash or card upon arrival</small>
                  </button>
                  <button
                    type="button"
                    className={`payment-box ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <strong>Credit / Debit Card</strong>
                    <small>All major cards accepted</small>
                  </button>
                  <button
                    type="button"
                    className={`payment-box ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <strong>Cash on Delivery</strong>
                    <small>Pay driver at doorstep</small>
                  </button>
                </div>
              </div>
            </div>

            <div className="security-note">
              <ShieldCheck size={16} className="gold-icon" /> Guaranteed 100% Fresh & Authentic Culinary Preparation
            </div>

            <button type="submit" className="btn-luxury-gold full-w mt-4">
              Confirm & Place Order (₹{totalAmount.toLocaleString('en-IN')})
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
