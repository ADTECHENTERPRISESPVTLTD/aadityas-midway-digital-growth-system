import type { NextRequest } from 'next/server'
import { answerCustomerQuestion } from '@/lib/ai/assistant'
import { jsonError, jsonOk, safeString, withErrorHandling } from '@/lib/ai/http'
import { isRateLimited } from '@/lib/ai/rateLimit'

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (isRateLimited(`chat:${ip}`)) {
      return jsonError('Too many requests, please slow down.', 429)
    }

    const body = await request.json().catch(() => null)
    const message = safeString(body?.message, 500)
    if (!message) {
      return jsonError('Field "message" is required (1-500 characters).')
    }

    const response = answerCustomerQuestion(message)
    return jsonOk(response)
  })
}
