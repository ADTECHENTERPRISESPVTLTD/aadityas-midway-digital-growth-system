export type MenuItem = {
  id: number
  name: string
  category: string
  priceLabel: string
  description: string
  veg: boolean
  currency: '$' | 'TZS'
  bestseller: boolean
  available: boolean
}

export type Offer = {
  code: string
  title: string
  description: string
  type: 'dine-in' | 'first-order' | string
  discountPercent?: number
  discountFlatInr?: number
  minOrderInr?: number
  minGuests?: number
  validDays?: string[]
}

export type BusinessInfo = {
  name: string
  tagline: string
  address: string
  hours: { display: string; days: string; open: string; close: string }
  contact: { phones: string[]; whatsapp: string }
  social: { instagram: string }
  delivery: { freeDeliveryAboveInr: number }
  offers: Offer[]
  booking: { acceptsOnlineRequests: boolean; note: string }
}

export type Review = {
  id: string
  customerName: string
  rating: number
  date: string
  text: string
}

export type Customer = {
  id: string
  name: string
  firstOrderDate: string
  lastOrderDate: string
  totalOrders: number
  totalSpendInr: number
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type RecommendationCard = {
  itemId: number
  name: string
  reason: string
  priceLabel: string
}

export type AssistantResponse = {
  reply: string
  intent: string
  recommendations: RecommendationCard[]
  groundedInData: boolean
}

export type Sentiment = 'positive' | 'neutral' | 'negative'
export type ReviewTheme = 'food' | 'service' | 'ambience' | 'waiting_time'

export type SentimentResult = {
  reviewId: string
  sentiment: Sentiment
  score: number
  themes: ReviewTheme[]
}

export type CustomerSegment = 'new' | 'regular' | 'high_value' | 'inactive'
