'use client'

import { useEffect, useState } from 'react'
import { ALL_MENU_ITEMS, MenuItem } from './menuData'
import { API_URL } from './apiUrl'

interface BackendMenuItem {
  _id: string
  name: string
  description: string
  category: { _id: string; name: string } | string
  price: number
  image?: string
  available: boolean
  bestseller: boolean
  veg: boolean
  spicy: boolean
  rating: number
  reviews: number
  badge?: string
}

function toFrontendItem(item: BackendMenuItem, index: number): MenuItem {
  const categoryName = typeof item.category === 'string' ? item.category : item.category.name
  return {
    id: index + 1,
    backendId: item._id,
    name: item.name,
    category: categoryName,
    price: item.price,
    priceLabel: `₹${item.price}`,
    currency: 'INR',
    description: item.description,
    image:
      item.image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    rating: item.rating,
    reviews: item.reviews,
    badge: item.badge,
    veg: item.veg,
    spicy: item.spicy,
  }
}

// Starts with the static menu (so the page renders immediately and still
// works for anyone not running the backend locally), then swaps in real
// data from MongoDB if the backend answers with a non-empty menu. If the
// backend is unreachable or the database hasn't been seeded yet, it
// silently keeps the static fallback -- this must never break the page.
export function useLiveMenu(): { items: MenuItem[]; source: 'static' | 'live' } {
  const [items, setItems] = useState<MenuItem[]>(ALL_MENU_ITEMS)
  const [source, setSource] = useState<'static' | 'live'>('static')

  useEffect(() => {
    let cancelled = false

    fetch(`${API_URL}/api/menu`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((body: { data?: BackendMenuItem[] }) => {
        if (cancelled) return
        const backendItems = body.data ?? []
        if (backendItems.length === 0) return
        setItems(backendItems.map(toFrontendItem))
        setSource('live')
      })
      .catch(() => {
        // Backend not running / not reachable -- keep the static fallback.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { items, source }
}
