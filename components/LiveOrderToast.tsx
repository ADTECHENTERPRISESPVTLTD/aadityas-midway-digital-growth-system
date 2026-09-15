'use client'

import { useEffect, useState } from 'react'
import { Flame, X } from 'lucide-react'

const RECENT_ORDERS = [
  { item: 'Saffron Kabuli Pulao', area: 'Sausar', price: '₹859' },
  { item: 'Wood-Fired Baby Lamb Chops', area: 'Nagpur Highway', price: '₹2,149' },
  { item: 'Hong Kong Mango Pomelo Sago', area: 'Gokuldham', price: '₹687' },
  { item: 'Peshawari Beef Chapli Kebab', area: 'SH 19 Drive-In', price: '₹1,719' },
  { item: 'Paneer Loaded Fries', area: 'Sausar Local', price: '₹640' },
  { item: 'Thai Tom Yum Soup', area: 'Traveler Table 4', price: '₹687' },
]

export default function LiveOrderToast() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show toast after initial 3 seconds
    const timer1 = setTimeout(() => {
      setVisible(true)
    }, 3000)

    // Cycle through orders every 8 seconds
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ORDERS.length)
        setVisible(true)
      }, 600)
    }, 9000)

    return () => {
      clearTimeout(timer1)
      clearInterval(interval)
    }
  }, [])

  if (!visible) return null

  const currentOrder = RECENT_ORDERS[currentIndex]

  return (
    <div
      className="live-order-toast-container animate-bounce-subtle"
      role="status"
      aria-live="polite"
      aria-label="Live order notification"
    >
      <div className="live-toast-card">
        <Flame size={18} className="gold-icon toast-icon" aria-hidden="true" />
        <div className="toast-content">
          <span className="toast-headline">
            <Flame size={12} className="gold-icon inline mr-1" aria-hidden="true" /> Someone just ordered!
          </span>
          <strong className="toast-item-title">{currentOrder.item}</strong>
          <small className="toast-meta">{currentOrder.area} · {currentOrder.price}</small>
        </div>
        <button className="toast-close" onClick={() => setVisible(false)} aria-label="Dismiss toast">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
