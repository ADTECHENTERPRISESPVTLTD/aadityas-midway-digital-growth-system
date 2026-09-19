'use client'

import { useMemo, useState } from 'react'
import { CATEGORIES, MenuItem } from '@/lib/menuData'
import { useLiveMenu } from '@/lib/useLiveMenu'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CheckoutModal from '@/components/CheckoutModal'
import BookingModal from '@/components/BookingModal'
import DiningAssistantModal from '@/components/DiningAssistantModal'
import FoodCard from '@/components/FoodCard'
import {
  ArrowRight,
  Bot,
  Flame,
  Info,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

export default function MenuPage() {
  const [cart, setCart] = useState<Record<number, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const { items: ALL_MENU_ITEMS } = useLiveMenu()

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = ALL_MENU_ITEMS.filter((item) => cart[item.id] > 0).reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  )

  const filteredItems = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchDiet =
        dietaryFilter === 'All' || (dietaryFilter === 'Veg' ? item.veg : !item.veg)
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchDiet && matchSearch
    })
  }, [ALL_MENU_ITEMS, selectedCategory, dietaryFilter, searchQuery])

  function updateQuantity(id: number, delta: number) {
    setCart((prev) => {
      const current = prev[id] || 0
      const next = current + delta
      const copy = { ...prev }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  }

  function addToCart(item: MenuItem) {
    updateQuantity(item.id, 1)
  }

  return (
    <div className="main-wrapper">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <section className="luxury-section" style={{ paddingTop: '40px' }}>
        {/* Page Heading */}
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <span className="gold-eyebrow">COMPLETE CULINARY MENU</span>
          <h2>Taste The Extraordinary</h2>
          <p>Every dish features 100% unique, freshly prepared ingredients. Prices shown in INR with original menu reference.</p>
        </div>

        {/* Toolbar: Category tabs, Search & Dietary */}
        <div className="menu-toolbar-wrapper">
          <div className="category-tabs-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="toolbar-controls-row">
            <div className="search-input-box">
              <Search size={16} className="gold-icon" />
              <input
                type="text"
                placeholder="Search dish by name or ingredient (e.g. Salmon, Lamb, Frankie)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="dietary-pills">
              {(['All', 'Veg', 'Non-Veg'] as const).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setDietaryFilter(pref)}
                  className={`diet-pill ${dietaryFilter === pref ? 'active' : ''}`}
                >
                  {pref === 'Veg' ? '☘ Pure Veg' : pref === 'Non-Veg' ? '🥩 Non-Veg' : 'All Items'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dish Count Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span>Showing <strong>{filteredItems.length}</strong> delicacies</span>
          <span>Category: <strong style={{ color: 'var(--gold-light)' }}>{selectedCategory}</strong></span>
        </div>

        {/* Food Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <Search size={40} className="gold-icon mb-3" />
            <h3 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '22px' }}>No Dishes Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>Try resetting your search query or switching dietary filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setDietaryFilter('All')
                setSearchQuery('')
              }}
              className="btn-luxury-gold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="food-card-grid">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onSelect={setDetailItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sticky Mobile Order Bar */}
      {cartCount > 0 && (
        <div className="sticky-mobile-order-bar">
          <div className="order-bar-info">
            <strong>{cartCount} Item{cartCount > 1 ? 's' : ''} Selected</strong>
            <small>Total: ₹{subtotal.toLocaleString('en-IN')}</small>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="btn-luxury-gold">
            View Cart & Checkout <ShoppingBag size={15} />
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {detailItem && (
        <div className="modal-backdrop" onClick={() => setDetailItem(null)}>
          <div className="luxury-modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
            <button className="close-btn" onClick={() => setDetailItem(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            <img src={detailItem.image} alt={detailItem.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
            <div style={{ padding: '28px' }}>
              <span className="food-card-category">{detailItem.category}</span>
              <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-heading)', fontSize: '28px', margin: '6px 0 12px' }}>
                {detailItem.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                {detailItem.description}
              </p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Converted Price</span>
                  <strong className="gold-price" style={{ fontSize: '24px' }}>₹{detailItem.price}</strong>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Menu Reference</span>
                  <strong style={{ color: 'var(--text-heading)', fontSize: '15px' }}>{detailItem.priceLabel}</strong>
                </div>
              </div>
              <button
                onClick={() => {
                  addToCart(detailItem)
                  setDetailItem(null)
                  setIsCartOpen(true)
                }}
                className="btn-luxury-gold full-w"
              >
                Add to Cart (₹{detailItem.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT TRIGGER */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="floating-ai-fab"
        aria-label="Open AI Assistant"
      >
        <Bot size={22} />
        <span>Ask Aaditya&apos;s Assistant</span>
      </button>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        allItems={ALL_MENU_ITEMS}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={subtotal > 999 ? subtotal : subtotal + (subtotal > 0 ? 99 : 0)}
        cart={cart}
        allItems={ALL_MENU_ITEMS}
        onSuccess={() => {
          setCart({})
          setIsCheckoutOpen(false)
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <DiningAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onAddToCart={(item) => {
          addToCart(item)
          setIsAssistantOpen(false)
          setIsCartOpen(true)
        }}
        allItems={ALL_MENU_ITEMS}
      />
    </div>
  )
}
