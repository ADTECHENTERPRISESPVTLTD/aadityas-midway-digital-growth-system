'use client'

import { MenuItem } from '@/lib/menuData'
import { Flame, Plus, Star } from 'lucide-react'

interface FoodCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  onSelect?: (item: MenuItem) => void
}

export default function FoodCard({ item, onAddToCart, onSelect }: FoodCardProps) {
  return (
    <div className="luxury-food-card motion-card">
      {/* Image container with steam aura */}
      <div
        className="food-card-img-wrap"
        onClick={() => onSelect?.(item)}
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
      >
        <img src={item.image} alt={item.name} className="food-img-zoom" />
        <div className="steam-overlay-effect" />
        
        {item.badge && <span className="item-badge-pill motion-badge">{item.badge}</span>}
        <div
          className={`veg-indicator-dot ${item.veg ? 'veg' : 'non-veg'}`}
          title={item.veg ? 'Pure Veg' : 'Non-Veg'}
        />
      </div>

      {/* Card Content */}
      <div className="food-card-body">
        <span className="food-card-category">{item.category}</span>
        <h3
          className="food-card-title"
          onClick={() => onSelect?.(item)}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
        >
          {item.name}
        </h3>
        <p className="food-card-desc">{item.description}</p>

        {/* Rating & Spicy Tag */}
        <div className="food-card-meta-row">
          <span className="rating-stars">
            <Star size={14} fill="currentColor" /> {item.rating}
          </span>
          <span>({item.reviews} reviews)</span>
          {item.spicy && (
            <span className="spicy-tag-pulse">
              <Flame size={12} /> Spicy
            </span>
          )}
        </div>

        {/* Card Footer: Price & Add Button */}
        <div className="food-card-footer">
          <div className="food-card-price-block">
            <span className="price-main">₹{item.price}</span>
            <span className="price-original">{item.priceLabel}</span>
          </div>
          <button onClick={() => onAddToCart(item)} className="add-to-cart-btn ripple-btn">
            <Plus size={15} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
