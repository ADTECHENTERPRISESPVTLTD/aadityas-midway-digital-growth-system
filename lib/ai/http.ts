// Shared helpers for the /api/ai/* route handlers: consistent JSON
// shape, consistent error handling, and a couple of tiny input guards.
// See docs/AI-ARCHITECTURE.md for the full security/error-handling notes.

import { NextResponse } from 'next/server'

export function jsonOk<T>(data: T, init?: number) {
  return NextResponse.json({ ok: true, data }, { status: init ?? 200 })
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

// Every route wraps its logic in this so an unexpected exception never
// leaks a stack trace to the client — it becomes a generic 500 instead.
export async function withErrorHandling(handler: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await handler()
  } catch (error) {
    console.error('[ai-api-error]', error)
    return jsonError('Something went wrong processing that request.', 500)
  }
}

// A string field with a max length, so nobody can send a 5MB "message"
// and tie up the request. Returns null if invalid.
export function safeString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) return null
  return trimmed
}

export function safeNumber(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return value
}
