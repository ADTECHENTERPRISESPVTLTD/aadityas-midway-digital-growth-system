'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { MenuItem } from '@/lib/menuData'
import { API_URL, fetchWithTimeout } from '@/lib/apiUrl'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onSuccess: () => void
  cart: Record<number, number>
  allItems: MenuItem[]
}

export default function CheckoutModal({ isOpen, onClose, totalAmount, onSuccess, cart, allItems }: CheckoutModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'counter' | 'cod'>('upi')
  const [phoneError, setPhoneError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate final amount after discount
  const finalAmount = Math.max(0, totalAmount - discount)

  // This component stays mounted while closed, so its state survives between
  // orders. Without a reset, the next checkout would reopen on the old
  // "Order Placed" screen (and keep the old coupon) instead of a fresh form.
  useEffect(() => {
    if (isOpen || !submitted) return
    setSubmitted(false)
    setSubmitError('')
    setConfirmationCode('')
    setName('')
    setPhone('')
    setAddress('')
    setCouponCode('')
    setDiscount(0)
    setCouponMessage('')
    setAppliedCoupon('')
  }, [isOpen, submitted])

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current)
  }, [])

  // Closing the success screen early still completes the order (clears the
  // cart) instead of leaving a timer that could wipe a *new* cart later.
  function handleClose() {
    if (submitting) return
    if (submitted) {
      if (successTimer.current) clearTimeout(successTimer.current)
      onSuccess()
    } else {
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onSuccess, submitted, submitting])

  if (!isOpen) return null

  function validatePhone(value: string) {
    const digits = value.replace(/\D/g, '')
    if (value && digits.length !== 10) {
      return 'Enter a valid 10-digit mobile number'
    }
    return ''
  }

  function handleApplyCoupon() {
    const code = couponCode.toUpperCase().trim()
    if (code === 'MIDWEEK20') {
      const discountVal = Math.round(totalAmount * 0.20)
      setDiscount(discountVal)
      setAppliedCoupon('MIDWEEK20')
      setCouponMessage('🎉 20% discount applied successfully!')
    } else if (code === 'FIRSTBITE') {
      const discountVal = Math.min(150, totalAmount)
      setDiscount(discountVal)
      setAppliedCoupon('FIRSTBITE')
      setCouponMessage('🎉 Flat ₹150 discount applied!')

    }else if (code === 'GROUPDESSERT') {
      setDiscount(0)
      setAppliedCoupon('GROUPDESSERT')
      setCouponMessage('🍨 Complimentary Chef Dessert added to your order!')
    }
    else {
      setDiscount(0)
      setAppliedCoupon('')
      setCouponMessage('❌ Invalid coupon code')
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    const err = validatePhone(phone)
    if (err) {
      setPhoneError(err)
      return
    }
    setPhoneError('')
    setSubmitError('')

    // Items that came from the live backend carry a real database id. If the
    // menu never loaded from the backend (no item has one), the page is
    // running on the built-in demo menu -- there is nothing to save, so the
    // demo confirmation is shown. If the backend IS live, the order must
    // really be saved: any failure (including cart items the database no
    // longer has) is reported to the customer instead of showing a
    // confirmation for an order that never reached the restaurant.
    const backendLive = allItems.some((i) => Boolean(i.backendId))
    const rows = Object.entries(cart).map(([id, quantity]) => ({
      backendId: allItems.find((i) => i.id === Number(id))?.backendId,
      quantity,
    }))
    const items = rows
      .filter((r): r is { backendId: string; quantity: number } => Boolean(r.backendId))
      .map((r) => ({ menuItem: r.backendId, quantity: r.quantity }))

    let code = ''
    if (backendLive) {
      if (items.length === 0 || items.length < rows.length) {
        setSubmitError('Some items in your cart are no longer on the menu. Please review your cart and try again.')
        return
      }
      setSubmitting(true)
      try {
        const res = await fetchWithTimeout(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            customerPhone: phone,
            items,
            couponCode: appliedCoupon || undefined,
          }),
        })
        const body = await res.json().catch(() => null)
        if (!res.ok || !body?.success) {
          const serverMessage = typeof body?.message === 'string' ? body.message : ''
          setSubmitError(
            /coupon|minimum order/i.test(serverMessage)
              ? `${serverMessage}. Remove or change the coupon and try again.`
              : 'We could not place your order. Please try again.'
          )
          return
        }
        const id = String(body.data?._id ?? '')
        code = id ? `AM-${id.slice(-6).toUpperCase()}` : ''
      } catch {
        setSubmitError('We could not reach the restaurant right now. Please check your connection and try again.')
        return
      } finally {
        setSubmitting(false)
      }
    }

    setConfirmationCode(code || `AM-${Math.floor(100000 + Math.random() * 900000)}`)
    setSubmitted(true)
    successTimer.current = setTimeout(() => {
      onSuccess()
    }, 1800)
  }

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Checkout order">
      <div className="luxury-modal-card" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success-screen">
            <CheckCircle2 size={56} className="gold-icon animate-pulse" />
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, <strong>{name || 'Guest'}</strong>. Your delicious meal is now being freshly prepared by our chefs.</p>
            <div className="order-receipt-summary">
              <div><span>Total Paid / Payable:</span> <strong>₹{finalAmount.toLocaleString('en-IN')}</strong></div>
              {discount > 0 && (
                <div><span>Coupon Discount ({appliedCoupon}):</span> <strong style={{ color: '#4ade80' }}>-₹{discount.toLocaleString('en-IN')}</strong></div>
              )}
              <div><span>Order Type:</span> <strong>{orderType === 'pickup' ? 'Dine-In / Counter Pickup' : 'Express Home Delivery'}</strong></div>
              <div><span>Confirmation Code:</span> <strong>{confirmationCode}</strong></div>
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
              <div>
                <span>Total Payable Amount</span>
                {discount > 0 && (
                  <small style={{ display: 'block', color: '#4ade80', fontSize: '12px' }}>
                    Includes ₹{discount.toLocaleString('en-IN')} discount ({appliedCoupon})
                  </small>
                )}
              </div>
              <strong className="gold-price">₹{finalAmount.toLocaleString('en-IN')}</strong>
            </div>

            {/* COUPON INPUT SECTION */}
            <div className="form-group-grid" style={{ marginBottom: '16px' }}>
              <div className="form-field full">
                <label>Apply Promo / Coupon Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. MIDWEEK20, FIRSTBITE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="pill-btn active"
                    style={{ padding: '0 20px', whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <span style={{ 
                    fontSize: '12px', 
                    marginTop: '6px', 
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

            {submitError && (
              <div role="alert" style={{ color: '#f87171', fontSize: '13px', marginTop: '14px', lineHeight: '1.5' }}>
                {submitError}
              </div>
            )}

            <button type="submit" className="btn-luxury-gold full-w mt-4" disabled={submitting}>
              {submitting
                ? 'Placing your order…'
                : `Confirm & Place Order (₹${finalAmount.toLocaleString('en-IN')})`}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}