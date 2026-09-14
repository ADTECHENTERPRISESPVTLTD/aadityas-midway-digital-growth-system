// AI-08: Customer Segmentation
//
// Rule-based thresholds, checked in this order: New -> Inactive -> High
// Value -> Regular. Recency (New/Inactive) is checked before spend
// (High Value) because a lapsed big spender is more useful to a
// re-engagement campaign than to a loyalty one. Thresholds are guesses
// for a prototype and should be tuned once real order volume exists.

import { getCustomers } from './knowledge'
import type { Customer, CustomerSegment } from './types'

const NEW_CUSTOMER_WINDOW_DAYS = 30
const INACTIVE_WINDOW_DAYS = 90
const HIGH_VALUE_SPEND_INR = 15000
const HIGH_VALUE_ORDER_COUNT = 20

function daysSince(dateStr: string, now: Date): number {
  const then = new Date(dateStr).getTime()
  return Math.floor((now.getTime() - then) / (1000 * 60 * 60 * 24))
}

export function segmentCustomer(customer: Customer, now: Date = new Date()): CustomerSegment {
  const daysSinceFirstOrder = daysSince(customer.firstOrderDate, now)
  const daysSinceLastOrder = daysSince(customer.lastOrderDate, now)

  if (customer.totalOrders <= 1 || daysSinceFirstOrder <= NEW_CUSTOMER_WINDOW_DAYS) return 'new'
  if (daysSinceLastOrder > INACTIVE_WINDOW_DAYS) return 'inactive'
  if (customer.totalSpendInr >= HIGH_VALUE_SPEND_INR || customer.totalOrders >= HIGH_VALUE_ORDER_COUNT) return 'high_value'
  return 'regular'
}

export function segmentAllCustomers(now: Date = new Date()) {
  return getCustomers().map((customer) => ({ customer, segment: segmentCustomer(customer, now) }))
}

export function segmentCounts(now: Date = new Date()) {
  const results = segmentAllCustomers(now)
  const counts: Record<CustomerSegment, number> = { new: 0, regular: 0, high_value: 0, inactive: 0 }
  for (const r of results) counts[r.segment] += 1
  return counts
}
