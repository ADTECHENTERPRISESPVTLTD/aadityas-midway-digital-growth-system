import { getDashboardInsights } from '@/lib/ai/insights'
import { jsonOk, withErrorHandling } from '@/lib/ai/http'

export async function GET() {
  return withErrorHandling(async () => jsonOk(getDashboardInsights()))
}
