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
  const [isLightTheme, setIsLightTheme] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('aadityas-theme')
    const light = savedTheme === 'light'
    setIsLightTheme(light)
    document.documentElement.classList.toggle('light-theme', light)
  }, [])

  function toggleTheme() {
    const nextIsLight = !isLightTheme
    setIsLightTheme(nextIsLight)
    document.documentElement.classList.toggle('light-theme', nextIsLight)
    window.localStorage.setItem('aadityas-theme', nextIsLight ? 'light' : 'dark')
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
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="cart-trigger-btn"
              aria-label="Open Order Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
              title={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
            >
              {isLightTheme ? <Moon size={18} /> : <Sun size={18} />}
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-panel">
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
              <div className="mobile-nav-footer">
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
