'use client'

import { useEffect, useState } from 'react'
import { ALL_MENU_ITEMS, MenuItem } from './menuData'
import { API_URL } from './apiUrl'
import { BackendMenuItem, mapBackendItems } from './liveMenuMapping'

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
        setItems(mapBackendItems(backendItems, ALL_MENU_ITEMS))
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
