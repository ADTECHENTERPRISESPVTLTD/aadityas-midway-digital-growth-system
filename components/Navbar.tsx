'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  Home,
  Images,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  ShoppingBag,
  Sparkles,
  Sun,
  Tag,
  Utensils,
  X,
} from 'lucide-react'

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
  onOpenBooking: () => void
}

export default function Navbar({ cartCount, onOpenCart, onOpenBooking }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('am_theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode')
      }
    }
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    const focusable = mobileNavRef.current?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('am_theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode')
    } else {
      document.documentElement.classList.remove('light-mode')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Culinary Menu', href: '/menu', icon: Utensils },
    { name: 'Our Story', href: '/story', icon: BookOpen },
    { name: 'Gallery', href: '/gallery', icon: Images },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare },
    { name: 'Offers & Passes', href: '/offers', icon: Tag },
    { name: 'Visit Us & Maps', href: '/visit', icon: MapPin },
  ]

  return (
    <>
      {/* Announcement Top Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <span className="live-status">
            <span className="pulse-dot" /> OPEN DAILY · 11:00 AM – 11:00 PM
          </span>
          <span className="announcement-tag">
            <Sparkles size={14} className="gold-icon" /> Complimentary Chef Appetizer on Orders Over ₹999
          </span>
          <a href="tel:7415388571" className="phone-quick">
            ☎ 7415388571
          </a>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="luxury-navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link href="/" className="brand-logo">
            <div className="brand-emblem">AM</div>
            <div className="brand-text">
              <span className="brand-primary">AADITYA&apos;S</span>
              <span className="brand-sub">MIDWAY · SAUSAR</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                  {isActive && <span className="active-glow-indicator" />}
                </Link>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-pressed={theme === 'light'}
            >
              {theme === 'dark' ? <Sun size={18} className="gold-icon" /> : <Moon size={18} />}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="cart-trigger-btn"
              aria-label="Open Order Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>

            {/* Book Table Button */}
            <button onClick={onOpenBooking} className="btn-luxury-gold desk-only">
              <Calendar size={15} /> Book a Table
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle-btn"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Ultra Visible High-Contrast Panel */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="mobile-nav-panel luxury-mobile-drawer"
              ref={mobileNavRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-nav-header">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="brand-logo">
                  <div className="brand-emblem">AM</div>
                  <div className="brand-text">
                    <span className="brand-primary">AADITYA&apos;S</span>
                    <span className="brand-sub">MIDWAY · SAUSAR</span>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="close-btn" aria-label="Close navigation">
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-nav-body">
                <span className="mobile-nav-section-title">EXPLORE HEAVEN</span>
                <div className="mobile-nav-links">
                  {navLinks.map((link) => {
                    const IconComp = link.icon
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`mobile-nav-card-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="nav-card-icon-wrap">
                          <IconComp size={18} className="gold-icon" />
                        </div>
                        <span className="nav-card-label">{link.name}</span>
                        {isActive && <span className="nav-card-dot" />}
                      </Link>
                    )
                  })}
                </div>

                {/* Quick Phone & WhatsApp Actions */}
                <div className="mobile-quick-actions my-3">
                  <a href="tel:7415388571" className="mobile-action-pill">
                    <Phone size={14} className="gold-icon" /> Call 7415388571
                  </a>
                  <a href="https://wa.me/917415388571" target="_blank" rel="noreferrer" className="mobile-action-pill wa">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="mobile-nav-footer">
                <button
                  onClick={toggleTheme}
                  className="btn-luxury-outline full-w mb-2"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {theme === 'dark' ? <Sun size={16} className="gold-icon" /> : <Moon size={16} />}
                  <span>Switch to {theme === 'dark' ? 'Light Gourmet' : 'Dark Obsidian'} Mode</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenBooking()
                  }}
                  className="btn-luxury-gold full-w"
                >
                  <Calendar size={16} /> Reserve a Table
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
