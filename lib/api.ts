const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface BackendMenuItem {
  _id: string
  name: string
  description: string
  category: { _id: string; name: string } | string
  price: number
  image?: string
  currency?: string
  available: boolean
  bestseller: boolean
  rating: number
  reviews: number
  badge?: string
  veg: boolean
  spicy: boolean
}

export interface BackendCategory {
  _id: string
  name: string
  image?: string
  description?: string
  active?: boolean
}

export interface BackendBooking {
  _id: string
  name: string
  phone: string
  date: string
  time: string
  guests: number
  reference: string
  status: string
}

export interface BackendOrder {
  _id: string
  customerName: string
  customerPhone?: string
  items: { menuItem: string; name: string; price: number; quantity: number }[]
  subtotal: number
  discount: number
  total: number
  status: string
}

export interface BackendReview {
  _id: string
  customer?: string
  name: string
  rating: number
  comment: string
  approved: boolean
  createdAt: string
}

export interface ReviewFormData {
  id: string | number
  rating: number
  customerName: string
  review: string
  date: string
  tagline?: string
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<{ success: boolean; message: string; data: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `API error: ${res.status}`)
  }

  return res.json() as Promise<{ success: boolean; message: string; data: T }>
}

export async function apiFetchMenu(): Promise<BackendMenuItem[]> {
  const res = await apiFetch<BackendMenuItem[]>('/api/menu')
  if (!res.success) throw new Error(res.message || 'Failed to fetch menu')
  return res.data
}

export async function apiFetchCategories(): Promise<BackendCategory[]> {
  const res = await apiFetch<BackendCategory[]>('/api/menu/categories')
  if (!res.success) throw new Error(res.message || 'Failed to fetch categories')
  return res.data
}

export async function apiFetchReviews(): Promise<BackendReview[]> {
  const res = await apiFetch<BackendReview[]>('/api/reviews')
  if (!res.success) throw new Error(res.message || 'Failed to fetch reviews')
  return res.data
}

export interface BookingPayload {
  name: string
  phone: string
  email?: string
  date: string
  time: string
  guests: string
}

function convertTimeFormat(timeStr: string): string {
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(timeStr)) return timeStr
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (match) {
    let hours = parseInt(match[1], 10)
    const minutes = match[2]
    const ampm = match[3].toUpperCase()
    if (ampm === 'PM' && hours !== 12) hours += 12
    if (ampm === 'AM' && hours === 12) hours = 0
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }
  return timeStr
}

function parseGuestCount(guestsStr: string): number {
  const match = guestsStr.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 2
}

export async function apiSubmitBooking(booking: BookingPayload): Promise<BackendBooking> {
  const res = await apiFetch<BackendBooking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      date: booking.date,
      time: convertTimeFormat(booking.time),
      guests: parseGuestCount(booking.guests),
    }),
  })
  if (!res.success) throw new Error(res.message || 'Failed to submit booking')
  return res.data
}

export interface OrderItemInput {
  id: string | number
  price: number
  quantity: number
}

export interface OrderPayload {
  name: string
  phone: string
  items: OrderItemInput[]
  orderType?: string
  address?: string
  paymentMethod?: string
  couponCode?: string
  discount?: number
}

export async function apiSubmitOrder(payload: OrderPayload): Promise<BackendOrder> {
  const orderItems = payload.items.map((item) => ({
    menuItem: String(item.id),
    name: '',
    price: item.price,
    quantity: item.quantity,
  }))

  const res = await apiFetch<BackendOrder>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      customerName: payload.name,
      customerPhone: payload.phone,
      items: orderItems,
      orderType: payload.orderType,
      address: payload.address,
      paymentMethod: payload.paymentMethod,
      couponCode: payload.couponCode,
      discount: payload.discount,
    }),
  })
  if (!res.success) throw new Error(res.message || 'Failed to place order')
  return res.data
}

export interface ReviewPayload {
  name: string
  rating: number
  comment: string
}

export async function apiSubmitReview(payload: ReviewPayload): Promise<BackendReview> {
  const res = await apiFetch<BackendReview>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      rating: payload.rating,
      comment: payload.comment,
    }),
  })
  if (!res.success) throw new Error(res.message || 'Failed to submit review')
  return res.data
}

export async function apiTrackEvent(event: string, metadata?: Record<string, unknown>): Promise<void> {
  try {
    await apiFetch('/api/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ event, metadata }),
    })
  } catch {
    // Silently ignore analytics failures
  }
}
