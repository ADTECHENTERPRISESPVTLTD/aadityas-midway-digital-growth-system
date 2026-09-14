import type { NextRequest } from 'next/server'
import { generateAllReplyDrafts, generateReplyDraft } from '@/lib/ai/reviewReply'
import { getReviews } from '@/lib/ai/knowledge'
import { jsonError, jsonOk, safeString, withErrorHandling } from '@/lib/ai/http'

export async function GET() {
  return withErrorHandling(async () => jsonOk({ drafts: generateAllReplyDrafts() }))
}

// Admin picks one review to (re)generate a draft reply for. This never
// publishes anything — see reviewReply.ts.
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json().catch(() => null)
    const reviewId = safeString(body?.reviewId, 50)
    if (!reviewId) return jsonError('Field "reviewId" is required.')

    const review = getReviews().find((r) => r.id === reviewId)
    if (!review) return jsonError('Review not found.', 404)

    return jsonOk(generateReplyDraft(review))
  })
}
