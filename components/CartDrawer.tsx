'use client'

import { MenuItem } from '@/lib/menuData'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: Record<number, number>
  allItems: MenuItem[]
  onUpdateQuantity: (id: number, delta: number) => void
  onCheckout: () => void
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  allItems,
  onUpdateQuantity,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null

  const cartItems = allItems.filter((item) => cart[item.id] > 0)
  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0)
  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 99
  const grandTotal = subtotal + deliveryFee

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag className="gold-icon" size={22} />
            <div>
              <h3>Your Culinary Order</h3>
              <p className="subtext">{totalCount} item{totalCount === 1 ? '' : 's'} selected</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-icon-circle">
                <ShoppingBag size={36} />
              </div>
              <h4>Your cart is empty</h4>
              <p>Explore our menu of ~80 exquisite delicacies and select your culinary favorites.</p>
              <button className="btn-luxury-gold mt-4" onClick={onClose}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-item-list">
              {cartItems.map((item) => {
                const count = cart[item.id]
                return (
                  <div key={item.id} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div className="cart-item-head">
                        <span className="cart-item-title">{item.name}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, -count)}
                          className="remove-item-btn"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="cart-item-cat">{item.category}</span>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">₹{(item.price * count).toLocaleString('en-IN')}</span>
                        <div className="quantity-controls">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </button>
                          <span>{count}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="free-delivery-callout">
              {subtotal >= 999 ? (
                <span className="green-msg">✓ You unlocked FREE Express Delivery!</span>
              ) : (
                <span>Add ₹{999 - subtotal} more for FREE Express Delivery</span>
              )}
            </div>

            <div className="summary-lines">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="summary-row grand-total">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn-luxury-gold full-w mt-3" onClick={onCheckout}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
