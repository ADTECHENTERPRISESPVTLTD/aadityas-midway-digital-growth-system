// AI-05: AI Offer Suggestions
//
// Rule-based: looks at which menu categories are bestsellers and which
// pairing rules connect them (same rules recommend.ts uses for
// cross-sell), then proposes a combo promotion with a plain-language
// reason. Once FS-09 analytics is live, `topSellingCategories` below is
// the function to point at real sales data instead of the `bestseller`
// flag.

import { getBestsellers, getMenu } from './knowledge'
import type { MenuItem } from './types'

export type OfferSuggestion = {
  title: string
  items: string[]
  reason: string
}

const DRINK_CATEGORIES = new Set(['Refreshers', 'Shakes', 'Smoothies', 'Mojitos'])
const MAIN_CATEGORIES = new Set([
  'Mediterranean Mix Grill', 'Beef Platter', 'Lamb Platter', 'Chicken Platter',
  'Grill Fish & Seafood', 'Sandwiches & Burgers', 'Combo', 'Wraps', 'Rice',
])

function topSellingCategories(): Record<string, MenuItem[]> {
  const bestsellers = getBestsellers(50)
  const grouped: Record<string, MenuItem[]> = {}
  for (const item of bestsellers) {
    grouped[item.category] = grouped[item.category] ?? []
    grouped[item.category].push(item)
  }
  return grouped
}

export function suggestOffers(limit = 3): OfferSuggestion[] {
  const grouped = topSellingCategories()
  const mainCategory = Object.keys(grouped).find((c) => MAIN_CATEGORIES.has(c))
  const drinkCategory = Object.keys(grouped).find((c) => DRINK_CATEGORIES.has(c))

  const suggestions: OfferSuggestion[] = []

  if (mainCategory && drinkCategory) {
    const main = grouped[mainCategory][0]
    const drink = grouped[drinkCategory][0]
    suggestions.push({
      title: `${main.name} + ${drink.name} combo`,
      items: [main.name, drink.name],
      reason: `Both ${main.name} (${mainCategory}) and ${drink.name} (${drinkCategory}) are current bestsellers, and customers already order this category pair together — bundling them this weekend could lift average order value.`,
    })
  }

  const totalMenu = getMenu().length
  const bestsellerCount = getBestsellers(500).length
  if (bestsellerCount / totalMenu < 0.3) {
    const underexposed = getMenu().find((item) => !item.bestseller && item.available)
    if (underexposed) {
      suggestions.push({
        title: `Feature ${underexposed.name}`,
        items: [underexposed.name],
        reason: `${underexposed.name} isn't a current bestseller but hasn't been promoted recently — a spotlight post or a small discount could test demand.`,
      })
    }
  }

  suggestions.push({
    title: 'Weekend dine-in combo',
    items: [],
    reason: 'Weekend footfall is typically higher — pairing two bestsellers into one visible combo card on the menu page tends to convert better than listing them separately.',
  })

  return suggestions.slice(0, limit)
}
