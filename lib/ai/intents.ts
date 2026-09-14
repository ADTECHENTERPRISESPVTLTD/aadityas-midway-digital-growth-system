// Simple keyword-based intent classifier for the customer assistant (AI-02).
// Deliberately not an LLM call: it's cheap, has zero latency/cost, and its
// output is 100% predictable, which matters for a "must not invent
// information" assistant. See docs/AI-ARCHITECTURE.md for the swap path
// to a real NLU/LLM classifier later.

export type Intent =
  | 'greeting'
  | 'menu'
  | 'price'
  | 'offers'
  | 'timing'
  | 'location'
  | 'recommendation'
  | 'booking'
  | 'contact'
  | 'unknown'

const PATTERNS: Array<{ intent: Intent; keywords: RegExp }> = [
  { intent: 'greeting', keywords: /\b(hi|hello|hey|namaste)\b/i },
  { intent: 'booking', keywords: /\b(books?|bookings?|reserve|reserves|reservations?|tables?)\b/i },
  { intent: 'offers', keywords: /\b(offers?|discounts?|coupons?|deals?|promos?)\b/i },
  { intent: 'timing', keywords: /\b(times?|timings?|hours?|open|opens|opening|close|closes|closing)\b/i },
  { intent: 'location', keywords: /\b(where|locations?|address|directions?|map|sausar)\b/i },
  { intent: 'contact', keywords: /\b(calls?|phones?|numbers?|whatsapp|contact|reach)\b/i },
  { intent: 'recommendation', keywords: /\b(recommends?|suggests?|what else|goes well|pairs?|combos?|should i (get|order|try))\b/i },
  { intent: 'price', keywords: /\b(prices?|costs?|how much|rates?)\b/i },
  { intent: 'menu', keywords: /\b(menu|dishes?|food|categor(y|ies)|vegs?|non-?veg|bestsellers?)\b/i },
]

export function classifyIntent(message: string): Intent {
  for (const { intent, keywords } of PATTERNS) {
    if (keywords.test(message)) return intent
  }
  return 'unknown'
}
