'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, Clock, MapPin, Sparkles, Users, Utensils, X } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('07:30 PM')
  const [guests, setGuests] = useState('2 Guests')
  const [seating, setSeating] = useState('Indoor AC Dining')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleReset() {
    setSubmitted(false)
    setName('')
    setPhone('')
    setSpecialRequest('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="luxury-modal-card responsive-booking-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success-screen" style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div className="success-icon-badge mb-3">
              <CheckCircle2 size={54} className="gold-icon animate-bounce" />
            </div>
            <span className="gold-eyebrow">RESERVATION CONFIRMED</span>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '28px', margin: '8px 0 12px' }}>
              Table Reserved For You!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Dear <strong style={{ color: 'var(--gold-light)' }}>{name || 'Honored Guest'}</strong>, your luxury table for <strong style={{ color: '#fff' }}>{guests}</strong> at <strong style={{ color: 'var(--gold-light)' }}>{seating}</strong> on <strong style={{ color: '#fff' }}>{date || 'Today'}</strong> at <strong style={{ color: 'var(--gold-light)' }}>{time}</strong> is officially booked.
            </p>

            <div className="order-receipt-summary mb-4" style={{ background: '#0b0e14', border: '1px solid var(--border-gold)', borderRadius: '14px', padding: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                <strong style={{ color: '#fff' }}>Aaditya&apos;s Midway, SH 19, Sausar</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Booking Reference:</span>
                <strong style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>AM-TBL-{Math.floor(1000 + Math.random() * 9000)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contact Mobile:</span>
                <strong style={{ color: '#fff' }}>+91 {phone}</strong>
              </div>
            </div>

            <button className="btn-luxury-gold full-w" onClick={handleReset}>
              Done & Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="modal-head-section">
              <span className="gold-eyebrow">HIGHWAY HOSPITALITY</span>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: '28px' }}>Reserve Your Table</h2>
              <p className="subtext">Enjoy priority luxury seating & personalized dining on SH 19</p>
            </div>

            {/* Seating Preference Selector */}
            <div className="seating-selector-block my-4">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Utensils size={14} className="gold-icon" /> Preferred Seating Zone
              </label>
              <div className="seating-pills-grid">
                {['Indoor AC Dining', 'Outdoor Terrace', 'Family Private Booth'].map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSeating(zone)}
                    className={`seating-zone-btn ${seating === zone ? 'active' : ''}`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group-grid responsive-grid">
              <div className="form-field">
                <label><Calendar size={14} className="gold-icon" /> Preferred Date</label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label><Clock size={14} className="gold-icon" /> Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="12:00 PM">12:00 PM (Lunch)</option>
                  <option value="01:30 PM">01:30 PM (Lunch)</option>
                  <option value="04:00 PM">04:00 PM (Teatime & Snacks)</option>
                  <option value="07:00 PM">07:00 PM (Early Dinner)</option>
                  <option value="07:30 PM">07:30 PM (Dinner)</option>
                  <option value="08:30 PM">08:30 PM (Prime Dinner)</option>
                  <option value="09:30 PM">09:30 PM (Late Dinner)</option>
                </select>
              </div>

              <div className="form-field">
                <label><Users size={14} className="gold-icon" /> Party Size</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                  <option value="1 Guest">1 Guest (Solo Diner)</option>
                  <option value="2 Guests">2 Guests (Couple / Pair)</option>
                  <option value="4 Guests">4 Guests (Family Table)</option>
                  <option value="6 Guests">6 Guests (Group Celebration)</option>
                  <option value="8+ Guests">8+ Guests (Royal Feast Table)</option>
                </select>
              </div>

              <div className="form-field">
                <label>Guest Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-field full">
                <label>Mobile Number (For Confirmation SMS/WhatsApp)</label>
                <input
                  required
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-field full">
                <label>Special Requests or Dietary Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Anniversary celebration, High chair required, Jain food option"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-luxury-gold full-w mt-3" style={{ padding: '14px' }}>
              Confirm Instant Reservation <Sparkles size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
