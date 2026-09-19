// Base URL of the Express backend (backend/). Falls back to the local dev
// port since most teammates won't have NEXT_PUBLIC_API_URL set yet.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// fetch with a timeout, built on AbortController rather than
// AbortSignal.timeout() -- the latter is missing on iOS < 16.4 and older
// Android browsers, where it would make every order/booking fail. The
// generous default covers a free-tier backend waking from sleep.
export async function fetchWithTimeout(input: string, init: RequestInit = {}, ms = 60000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
