import { sentimentSummary } from '@/lib/ai/sentiment'
import { jsonOk, withErrorHandling } from '@/lib/ai/http'

export async function GET() {
  return withErrorHandling(async () => jsonOk(sentimentSummary()))
}
