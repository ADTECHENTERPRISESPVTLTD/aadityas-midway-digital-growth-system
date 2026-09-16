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
  
  //  New Coupon States //
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)

  // Calculate final amount dynamically
  const finalAmount = Math.max(0, totalAmount - discount)

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

  // Coupon Logic Handler 
  function handleApplyCoupon() {
    const code = couponCode.toUpperCase().trim()
    if (code === 'MIDWEEK20') {
      setDiscount(totalAmount * 0.20) // 20% off
      setCouponMessage('🎉 20% discount applied successfully!')
    } else if (code === 'FIRSTBITE') {
      setDiscount(150) // Flat ₹150 off
      setCouponMessage('🎉 Flat ₹150 discount applied!')
    } else {
      setDiscount(0)
      setCouponMessage('❌ Invalid coupon code')
    }
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
              {/* Updated to show finalAmount */}
              <div><span>Total Paid / Payable:</span> <strong>₹{finalAmount.toLocaleString('en-IN')}</strong></div>
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
              <strong className="gold-price">₹{finalAmount.toLocaleString('en-IN')}</strong>
            </div>

            {/*  COUPON UI SECTION */}
            <div className="form-group-grid" style={{ marginBottom: '16px' }}>
              <div className="form-field full">
                <label>Apply Promo Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. MIDWEEK20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn-luxury-outline"
                    style={{ padding: '0 16px', whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <span style={{ 
                    fontSize: '12px', 
                    marginTop: '8px', 
                    display: 'block',
                    color: discount > 0 ? '#4ade80' : '#f87171' 
                  }}>
                    {couponMessage}
                  </span>
                )}
              </div>
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

            {/* Updated Button with finalAmount */}
            <button type="submit" className="btn-luxury-gold full-w mt-4">
              Confirm & Place Order (₹{finalAmount.toLocaleString('en-IN')})
            </button>
          </form>
        )}
      </div>
    </div>
  )
}