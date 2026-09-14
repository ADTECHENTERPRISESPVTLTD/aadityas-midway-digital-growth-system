'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Menu, Moon, ShoppingBag, Sparkles, Sun, X } from 'lucide-react'

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
  onOpenBooking: () => void
}

export default function Navbar({ cartCount, onOpenCart, onOpenBooking }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('am_theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode')
      }
    }
  }, [])

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
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Our Story', href: '/story' },
    { name: 'Offers & Passes', href: '/offers' },
    { name: 'Visit Us', href: '/visit' },
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
              aria-label="Toggle Theme"
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

        {/* Mobile Navigation Drawer - Solid Dark Background */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-nav-panel solid-dark-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="brand-logo">
                  <div className="brand-emblem">AM</div>
                  <div className="brand-text">
                    <span className="brand-primary">AADITYA&apos;S</span>
                    <span className="brand-sub">MIDWAY · SAUSAR</span>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-nav-item ${pathname === link.href ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mobile-nav-footer">
                <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '12px' }}>
                  <button
                    onClick={toggleTheme}
                    className="btn-luxury-outline full-w"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
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
