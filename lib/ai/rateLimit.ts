// Basic, in-memory, per-instance rate limiting for the customer-facing
// chat endpoint (the one most likely to get spammed/scraped). This is a
// stopgap for the prototype only: it resets whenever the server restarts
// and doesn't share state across serverless instances. The DevOps intern
// owns making this production-grade (DO-06 — Security / rate limiting),
// e.g. with a shared store like Upstash Redis.

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20

const hits = new Map<string, number[]>()

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  hits.set(key, timestamps)
  return timestamps.length > MAX_REQUESTS_PER_WINDOW
}
