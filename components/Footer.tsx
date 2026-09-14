import Link from 'next/link'
import { Camera, Clock, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="footer-top-gold-line" />
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="brand-logo mb-4">
              <div className="brand-emblem">AM</div>
              <div className="brand-text">
                <span className="brand-primary">AADITYA&apos;S</span>
                <span className="brand-sub">MIDWAY · SAUSAR</span>
              </div>
            </div>
            <p className="footer-philosophy">
              A haven of fine culinary artistry on State Highway 19. Crafted for discerning travelers, gourmands, and families who seek authentic flavors and unforgettable dining memories.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/aadityasmidway"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-title">Explore Experience</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home & Highlights</Link></li>
              <li><Link href="/menu">Culinary Menu (~80 Dishes)</Link></li>
              <li><Link href="/story">Our Midway Story</Link></li>
              <li><Link href="/offers">VIP Passes & Offers</Link></li>
              <li><Link href="/visit">Location & Reservations</Link></li>
            </ul>
          </div>

          {/* Specialities */}
          <div className="footer-col">
            <h4 className="footer-title">Chef&apos;s Highlights</h4>
            <ul className="footer-links-list">
              <li><span>Saffron Kabuli Pulao</span></li>
              <li><span>Wood-Fired Baby Lamb Chops</span></li>
              <li><span>Char-Grilled Atlantic Salmon</span></li>
              <li><span>Peshawari Beef Chapli Kebab</span></li>
              <li><span>Hong Kong Mango Pomelo Sago</span></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer-col contact-col">
            <h4 className="footer-title">Reach Our Haven</h4>
            <div className="contact-info-item">
              <MapPin size={18} className="gold-icon" />
              <span>SH 19, Gokuldham, Sausar, Madhya Pradesh</span>
            </div>
            <div className="contact-info-item">
              <Clock size={18} className="gold-icon" />
              <span>Open Daily: 11:00 AM – 11:00 PM</span>
            </div>
            <div className="contact-info-item">
              <Phone size={18} className="gold-icon" />
              <span>Direct Reservations: +91 74153 88571</span>
            </div>
            <div className="safety-badge mt-4">
              <ShieldCheck size={16} className="gold-icon" /> 100% Halal & Fresh Daily Sourced Ingredients
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Aaditya&apos;s Midway. Designed with passion for culinary excellence.</p>
          <div className="bottom-meta">
            <span>SH 19 Sausar</span>
            <span className="dot">•</span>
            <span>Premium Dining & Drive-In</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
