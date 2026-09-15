// AI-03: Food Recommendation
//
// Deliberately rule-based for now, per the task brief ("start with
// rule-based recommendations and keep the architecture ready for ML
// later"). The RecommendationEngine interface below is the swap point:
// a future ML-based engine (e.g. co-purchase data from FS-09 analytics)
// just needs to implement `recommend()` and can replace
// `ruleBasedEngine` in getRecommendationEngine() without touching any
// caller (assistant.ts, the /api/ai/recommend route, etc).

import { formatPriceInr, getBestsellers, getMenu, getMenuByCategory, getMenuItemById, searchMenu } from './knowledge'
import type { MenuItem, RecommendationCard } from './types'

export interface RecommendationEngine {
  recommend(item: MenuItem, limit?: number): RecommendationCard[]
}

// category -> categories that pair well with it, in priority order
const PAIRING_RULES: Record<string, { pairWith: string[]; reason: string }> = {
  'Fried Special': { pairWith: ['Refreshers', 'Mojitos'], reason: 'a cold drink balances the fried, spiced flavour' },
  'Sandwiches & Burgers': { pairWith: ['Fried Special', 'Refreshers'], reason: 'goes well as a side with your sandwich' },
  Combo: { pairWith: ['Refreshers', 'Smoothies'], reason: 'pairs nicely with your combo meal' },
  'Mediterranean Mix Grill': { pairWith: ['Salad', 'Mojitos'], reason: 'a fresh side balances a hearty grill platter' },
  'Beef Platter': { pairWith: ['Salad', 'Refreshers'], reason: 'cuts through the richness of the grilled beef' },
  'Lamb Platter': { pairWith: ['Salad', 'Mojitos'], reason: 'a fresh side works well with lamb' },
  'Chicken Platter': { pairWith: ['Salad', 'Refreshers'], reason: 'a light side pairs well with grilled chicken' },
  'Grill Fish & Seafood': { pairWith: ['Salad', 'Refreshers'], reason: 'a fresh side complements grilled seafood' },
  Rice: { pairWith: ['Salad', 'Fried Special'], reason: 'adds some crunch and freshness to a rice dish' },
  Soup: { pairWith: ['Sandwiches & Burgers'], reason: 'makes the soup into a fuller meal' },
  Salad: { pairWith: ['Fried Special', 'Sandwiches & Burgers'], reason: 'adds something warm alongside your salad' },
  Wraps: { pairWith: ['Refreshers', 'Smoothies'], reason: 'a cold drink goes well with a wrap' },
  Signature: { pairWith: ['Refreshers', 'Smoothies'], reason: 'a cold drink balances the loaded fries' },
  'Non-Veg Snacks': { pairWith: ['Refreshers'], reason: 'a refreshing drink pairs well with kebabs and samosas' },
  'Veg Snacks': { pairWith: ['Refreshers'], reason: 'a refreshing drink pairs well with fried snacks' },
  Breakfast: { pairWith: ['Breakfast Add-ons'], reason: 'a popular add-on to round out your breakfast' },
  Refreshers: { pairWith: ['Fried Special', 'Signature'], reason: 'a savoury bite goes well with your drink' },
  Shakes: { pairWith: ['Fried Special', 'Signature'], reason: 'a savoury bite balances a sweet shake' },
  Smoothies: { pairWith: ['Fried Special', 'Wraps'], reason: 'a savoury bite balances a fruity smoothie' },
  Mojitos: { pairWith: ['Fried Special', 'Mediterranean Mix Grill'], reason: 'a classic pairing with grilled food' },
}

function pickFromCategory(category: string, excludeId: number): MenuItem | undefined {
  const options = getMenuByCategory(category).filter((item) => item.available && item.id !== excludeId)
  return options.find((item) => item.bestseller) ?? options[0]
}

const ruleBasedEngine: RecommendationEngine = {
  recommend(item, limit = 2) {
    const rule = PAIRING_RULES[item.category]
    const cards: RecommendationCard[] = []

    if (rule) {
      for (const category of rule.pairWith) {
        if (cards.length >= limit) break
        const pick = pickFromCategory(category, item.id)
        if (pick) cards.push({ itemId: pick.id, name: pick.name, priceLabel: formatPriceInr(pick.priceLabel, pick.currency), reason: rule.reason })
      }
    }

    if (cards.length < limit) {
      for (const pick of getBestsellers(limit + 1)) {
        if (cards.length >= limit) break
        if (pick.id === item.id || cards.some((c) => c.itemId === pick.id)) continue
        cards.push({ itemId: pick.id, name: pick.name, priceLabel: formatPriceInr(pick.priceLabel, pick.currency), reason: 'one of our most-loved dishes' })
      }
    }

    return cards
  },
}

export function getRecommendationEngine(): RecommendationEngine {
  return ruleBasedEngine
}

export function recommendForItem(itemId: number, limit = 2): RecommendationCard[] {
  const item = getMenuItemById(itemId)
  if (!item) return []
  return getRecommendationEngine().recommend(item, limit)
}

// Used by the chat assistant: "I'm ordering shawarma, what else should I get?"
export function recommendForQuery(query: string, limit = 2): { matchedItem: MenuItem | null; recommendations: RecommendationCard[] } {
  const matches = searchMenu(query)
  const matchedItem = matches.find((item) => item.available) ?? matches[0] ?? null
  if (!matchedItem) return { matchedItem: null, recommendations: [] }
  return { matchedItem, recommendations: getRecommendationEngine().recommend(matchedItem, limit) }
}

export function trendingRecommendations(limit = 3): RecommendationCard[] {
  return getBestsellers(limit).map((item) => ({
    itemId: item.id,
    name: item.name,
    priceLabel: formatPriceInr(item.priceLabel, item.currency),
    reason: 'trending with other customers this week',
  }))
}

export function allMenuItems(): MenuItem[] {
  return getMenu()
}
