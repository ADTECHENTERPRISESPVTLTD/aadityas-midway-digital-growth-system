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
//
// A name match always outranks a category-only match, even a longer one.
// Without this, "how much does salmon soup cost" would match every item
// in the "Soup" category (because the word "soup" is a substring of the
// query) and the *longest-named* soup would win the tie-break -- not the
// dish actually named in the question. Category-only matches exist so a
// generic question like "tell me about your wraps" still lists the
// category; they just must never outrank a specific dish name.
export function searchMenu(query: string): MenuItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored = getMenu()
    .map((item) => {
      const name = item.name.toLowerCase()
      const category = item.category.toLowerCase()
      const nameMatches = name.includes(q) || q.includes(name)
      const categoryMatches = category.includes(q) || q.includes(category)
      if (nameMatches) return { item, score: 1000 + name.length }
      if (categoryMatches) return { item, score: category.length }
      return null
    })
    .filter((x): x is { item: MenuItem; score: number } => x !== null)

  scored.sort((a, b) => b.score - a.score)
  return scored.map((x) => x.item)
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

// Mirrors formatInrPrice() in app/page.tsx exactly (same regex, same
// $/TZS -> INR rates). The website displays prices converted to rupees;
// the AI must say the same numbers, not the original $/TZS priceLabel.
// If the frontend's conversion ever changes, update it here too.
export function formatPriceInr(priceLabel: string, currency: string): string {
  if (currency === 'INR') return priceLabel
  const rate = currency === '$' ? 86 : 0.032
  const amounts = priceLabel.match(/\d[\d,]*(?:\.\d+)?/g) ?? []
  const converted = amounts.map((value) =>
    Math.round(Number(value.replace(/,/g, '')) * rate).toLocaleString('en-IN')
  )
  return `₹${converted.join(' / ₹')}`
}
