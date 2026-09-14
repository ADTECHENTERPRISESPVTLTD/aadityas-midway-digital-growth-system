// Data-access layer for the AI module (AI-01: "Business Data" step).
//
// Every AI feature reads through this file instead of importing the JSON
// files directly. That's the seam: today it reads static JSON, but when
// the Full-Stack intern's real menu/orders/reviews API (FS-02, FS-03) is
// ready, only the bodies of these functions need to change to fetch from
// the database instead. Nothing in assistant.ts / recommend.ts / etc. has
// to change.

import menuData from './data/menu.json'
import businessData from './data/business.json'
import reviewsData from './data/reviews.json'
import customersData from './data/customers.json'
import type { BusinessInfo, Customer, MenuItem, Offer, Review } from './types'

export function getMenu(): MenuItem[] {
  return menuData as MenuItem[]
}

export function getMenuItemById(id: number): MenuItem | undefined {
  return getMenu().find((item) => item.id === id)
}

// Matches both ways on purpose: a short query like "shawarma" should find
// every item whose name contains it, and a full sentence like "how much
// is chicken shawarma" should find the item name contained in it.
// Longer name matches are ranked first (more specific match wins).
export function searchMenu(query: string): MenuItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getMenu()
    .filter((item) => {
      const name = item.name.toLowerCase()
      const category = item.category.toLowerCase()
      return name.includes(q) || q.includes(name) || category.includes(q) || q.includes(category)
    })
    .sort((a, b) => b.name.length - a.name.length)
}

export function getMenuByCategory(category: string): MenuItem[] {
  const c = category.trim().toLowerCase()
  return getMenu().filter((item) => item.category.toLowerCase() === c)
}

export function getBestsellers(limit = 5): MenuItem[] {
  return getMenu().filter((item) => item.bestseller).slice(0, limit)
}

export function getCategories(): string[] {
  return Array.from(new Set(getMenu().map((item) => item.category)))
}

export function getBusinessInfo(): BusinessInfo {
  return businessData as BusinessInfo
}

export function getOffers(): Offer[] {
  return getBusinessInfo().offers
}

export function getReviews(): Review[] {
  return reviewsData as Review[]
}

export function getCustomers(): Customer[] {
  return customersData as Customer[]
}
