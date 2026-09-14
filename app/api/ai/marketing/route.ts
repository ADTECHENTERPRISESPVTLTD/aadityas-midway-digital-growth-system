import type { NextRequest } from 'next/server'
import { generateMarketingContent } from '@/lib/ai/marketing'
import { jsonError, jsonOk, safeString, withErrorHandling } from '@/lib/ai/http'

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json().catch(() => null)
    const item = safeString(body?.item, 120)
    const offer = safeString(body?.offer, 120) ?? undefined

    if (!item) {
      return jsonError('Field "item" is required, e.g. "Paneer Pizza".')
    }

    return jsonOk(generateMarketingContent(item, offer))
  })
}
