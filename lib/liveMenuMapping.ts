import type { MenuItem } from './menuData'

export interface BackendMenuItem {
  _id: string
  name: string
  description?: string
  category: { _id: string; name: string } | string
  price: number
  image?: string
  available?: boolean
  bestseller?: boolean
  veg?: boolean
  spicy?: boolean
  rating?: number
  reviews?: number
  badge?: string
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

const norm = (s: string) => s.trim().toLowerCase()

// The numeric `id` is what the cart, the AI assistant (lib/ai) and the page
// all key on. It must be the SAME id for the same dish whether the page is
// showing the built-in static menu or the live backend menu -- otherwise an
// item added to the cart before live data arrives silently turns into a
// different dish when it does, and AI recommendation cards point at the
// wrong dish. So live items reuse the static id of the dish with the same
// name (and price, to tell apart same-named dishes). Dishes that only exist
// in the database get fresh ids above the static range.
export function mapBackendItems(backend: BackendMenuItem[], staticItems: MenuItem[]): MenuItem[] {
  const byNamePrice = new Map<string, MenuItem[]>()
  const byName = new Map<string, MenuItem[]>()
  for (const s of staticItems) {
    const exact = `${norm(s.name)}|${s.price}`
    byNamePrice.set(exact, [...(byNamePrice.get(exact) ?? []), s])
    byName.set(norm(s.name), [...(byName.get(norm(s.name)) ?? []), s])
  }

  const used = new Set<number>()
  const take = (list: MenuItem[] | undefined) => {
    const hit = list?.find((s) => !used.has(s.id))
    if (hit) used.add(hit.id)
    return hit
  }

  // Pass 1: exact name + price. Pass 2: name only. Doing all exact matches
  // first stops a loose match from stealing an id a later exact match needs.
  const matches: (MenuItem | undefined)[] = backend.map((b) => take(byNamePrice.get(`${norm(b.name)}|${Number(b.price)}`)))
  backend.forEach((b, i) => {
    if (!matches[i]) matches[i] = take(byName.get(norm(b.name)))
  })

  // Pass 3 -- rename tolerance. The database is seeded from a snapshot of the
  // website menu, so a dish renamed on the website afterwards no longer
  // matches by name. Leftover dishes with the same category and price are
  // paired up, but only when both sides have exactly the same number of them
  // (anything else would be a guess). Pairs are ordered by static id / by
  // name so the result never depends on the order the API happens to return.
  const categoryOf = (b: BackendMenuItem) => norm(typeof b.category === 'string' ? b.category : b.category?.name ?? '')
  const leftoverBackend = new Map<string, number[]>()
  backend.forEach((b, i) => {
    if (matches[i]) return
    const key = `${categoryOf(b)}|${Number(b.price)}`
    leftoverBackend.set(key, [...(leftoverBackend.get(key) ?? []), i])
  })
  const leftoverStatic = new Map<string, MenuItem[]>()
  for (const s of staticItems) {
    if (used.has(s.id)) continue
    const key = `${norm(s.category)}|${s.price}`
    leftoverStatic.set(key, [...(leftoverStatic.get(key) ?? []), s])
  }
  for (const [key, indexes] of leftoverBackend) {
    const statics = leftoverStatic.get(key)
    if (!statics || statics.length !== indexes.length) continue
    const byNameOrder = [...indexes].sort((a, b) => backend[a].name.localeCompare(backend[b].name))
    const byIdOrder = [...statics].sort((a, b) => a.id - b.id)
    byNameOrder.forEach((backendIndex, n) => {
      matches[backendIndex] = byIdOrder[n]
      used.add(byIdOrder[n].id)
    })
  }

  let nextId = Math.max(0, ...staticItems.map((s) => s.id)) + 1
  const mapped = backend.map((b, i): MenuItem => {
    const match = matches[i]
    const price = Number(b.price)
    return {
      id: match ? match.id : nextId++,
      backendId: b._id,
      name: b.name,
      category: typeof b.category === 'string' ? b.category : b.category?.name ?? match?.category ?? 'Signature',
      price,
      priceLabel: `₹${price}`,
      currency: 'INR',
      description: b.description ?? match?.description ?? '',
      image: b.image || match?.image || FALLBACK_IMAGE,
      rating: b.rating ?? match?.rating ?? 4.5,
      reviews: b.reviews ?? match?.reviews ?? 0,
      badge: b.badge,
      veg: b.veg ?? false,
      spicy: b.spicy ?? false,
    }
  })

  return mapped.sort((a, b) => a.id - b.id)
}
