import { segmentAllCustomers, segmentCounts } from '@/lib/ai/segmentation'
import { jsonOk, withErrorHandling } from '@/lib/ai/http'

export async function GET() {
  return withErrorHandling(async () =>
    jsonOk({ counts: segmentCounts(), customers: segmentAllCustomers() })
  )
}
