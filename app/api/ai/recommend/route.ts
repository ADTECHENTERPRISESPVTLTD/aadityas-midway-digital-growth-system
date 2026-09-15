import type { NextRequest } from 'next/server'
import { recommendForItem, recommendForQuery, trendingRecommendations } from '@/lib/ai/recommend'
import { jsonError, jsonOk, safeNumber, safeString, withErrorHandling } from '@/lib/ai/http'

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json().catch(() => null)
    const itemId = safeNumber(body?.itemId)
    const query = safeString(body?.query, 200)

    if (itemId !== null) {
      return jsonOk({ recommendations: recommendForItem(itemId) })
    }
    if (query) {
      return jsonOk(recommendForQuery(query))
    }
    return jsonOk({ recommendations: trendingRecommendations() })
  })
}

export async function GET() {
  return withErrorHandling(async () => jsonOk({ recommendations: trendingRecommendations() }))
}
