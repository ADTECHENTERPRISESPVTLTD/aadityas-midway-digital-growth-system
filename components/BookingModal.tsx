'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, Clock, Users, X } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('07:30 PM')
  const [guests, setGuests] = useState('2 Guests')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="luxury-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success-screen">
            <CheckCircle2 size={56} className="gold-icon animate-pulse" />
            <h2>Table Reserved!</h2>
            <p>Dear <strong>{name || 'Honored Guest'}</strong>, your table reservation for <strong>{guests}</strong> on <strong>{date || 'Today'}</strong> at <strong>{time}</strong> has been confirmed.</p>
            <div className="order-receipt-summary">
              <div><span>Location:</span> <strong>Aaditya&apos;s Midway, SH 19, Sausar</strong></div>
              <div><span>Reservation ID:</span> <strong>TBL-{Math.floor(1000 + Math.random() * 9000)}</strong></div>
            </div>
            <button className="btn-luxury-gold full-w mt-4" onClick={onClose}>
              Done & Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="modal-head-section">
              <span className="gold-eyebrow">A CULINARY EXPERIENCE</span>
              <h2>Reserve Your Table</h2>
              <p className="subtext">Enjoy priority luxury seating & personalized hospitality</p>
            </div>

            <div className="form-group-grid">
              <div className="form-field half">
                <label><Calendar size={14} className="gold-icon" /> Preferred Date</label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-field half">
                <label><Clock size={14} className="gold-icon" /> Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="12:00 PM">12:00 PM (Lunch)</option>
                  <option value="01:30 PM">01:30 PM (Lunch)</option>
                  <option value="04:00 PM">04:00 PM (Teatime & Snacks)</option>
                  <option value="07:00 PM">07:00 PM (Dinner)</option>
                  <option value="07:30 PM">07:30 PM (Dinner)</option>
                  <option value="08:30 PM">08:30 PM (Prime Dinner)</option>
                  <option value="09:30 PM">09:30 PM (Late Dinner)</option>
                </select>
              </div>

              <div className="form-field half">
                <label><Users size={14} className="gold-icon" /> Party Size</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                  <option value="1 Guest">1 Guest (Solo Traveler)</option>
                  <option value="2 Guests">2 Guests (Couple / Pair)</option>
                  <option value="4 Guests">4 Guests (Family Table)</option>
                  <option value="6 Guests">6 Guests (Group Celebration)</option>
                  <option value="8+ Guests">8+ Guests (Royal Feast Platter)</option>
                </select>
              </div>

              <div className="form-field half">
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
                <label>Mobile Number</label>
                <input
                  required
                  type="tel"
                  placeholder="10-digit mobile number for confirmation"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-field full">
                <label>Special Notes or Dietary Preferences (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday celebration, High chair needed, Outdoor terrace seating"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-luxury-gold full-w mt-4">
              Confirm Table Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
