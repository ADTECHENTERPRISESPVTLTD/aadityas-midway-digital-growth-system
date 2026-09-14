import { Calendar, Car, Clock, MapPin, MessageCircle, Navigation, Phone, ShieldCheck, Wifi } from 'lucide-react'

interface LocationSectionProps {
  onOpenBooking?: () => void
}

export default function LocationSection({ onOpenBooking }: LocationSectionProps) {
  return (
    <section className="luxury-section">
      <div className="section-head">
        <span className="gold-eyebrow">HIGHWAY LANDMARK & DIRECTIONS</span>
        <h2>Visit Us On State Highway 19</h2>
        <p>Conveniently located at Gokuldham, Sausar. Easy drive-in access and ample parking.</p>
      </div>

      <div className="hero-grid">
        {/* Address & Contact Info */}
        <div>
          <span className="gold-eyebrow">LOCATION DETAILS</span>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: 'var(--text-heading)', marginBottom: '20px' }}>
            Aaditya&apos;s Midway
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
              <MapPin size={22} className="gold-icon" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ color: 'var(--text-heading)', fontSize: '15px', display: 'block' }}>Official Address</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                  Aaditya&apos;s Midway SH 19, Gokuldham, Sausar, Madhya Pradesh
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
              <Clock size={22} className="gold-icon" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ color: 'var(--text-heading)', fontSize: '15px', display: 'block' }}>Opening Hours</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Open Daily · 11:00 AM – 11:00 PM
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
              <Phone size={22} className="gold-icon" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ color: 'var(--text-heading)', fontSize: '15px', display: 'block' }}>Direct Reservations</strong>
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
            {onOpenBooking && (
              <button onClick={onOpenBooking} className="btn-luxury-outline">
                <Calendar size={16} /> Reserve Table
              </button>
            )}
          </div>
        </div>

        {/* Map Embed Container */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: '24px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '360px',
          }}
        >
          <div className="map-embed-placeholder">
            <div className="pulsing-map-pin">
              <MapPin size={32} className="gold-icon" />
              <div className="pin-pulse-wave" />
            </div>
            <div className="map-badge-card">
              <strong>Aaditya&apos;s Midway</strong>
              <small>SH 19 · Sausar</small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '20px 0', position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'var(--bg-obsidian)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px' }}>
              <Car size={16} className="gold-icon mb-1" />
              <strong style={{ color: 'var(--text-heading)', display: 'block' }}>Drive-In Parking</strong>
              <span style={{ color: 'var(--text-muted)' }}>Free 50+ slots</span>
            </div>
            <div style={{ background: 'var(--bg-obsidian)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px' }}>
              <Wifi size={16} className="gold-icon mb-1" />
              <strong style={{ color: 'var(--text-heading)', display: 'block' }}>Free Wi-Fi</strong>
              <span style={{ color: 'var(--text-muted)' }}>High Speed</span>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Aaditya's+Midway+SH+19+Gokuldham+Sausar"
            target="_blank"
            rel="noreferrer"
            className="btn-luxury-gold full-w"
            style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
          >
            Get Google Maps Directions <Navigation size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
