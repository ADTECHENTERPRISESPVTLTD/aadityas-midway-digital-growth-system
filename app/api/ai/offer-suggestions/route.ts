import { suggestOffers } from '@/lib/ai/offerSuggestions'
import { jsonOk, withErrorHandling } from '@/lib/ai/http'

export async function GET() {
  return withErrorHandling(async () => jsonOk({ suggestions: suggestOffers() }))
}
