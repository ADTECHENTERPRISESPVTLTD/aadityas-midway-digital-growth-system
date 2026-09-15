// AI-09: AI Dashboard
//
// Pure aggregator — combines the other AI-0x modules into one payload for
// the admin dashboard. No new logic lives here on purpose, so each piece
// stays independently testable.

import { getBestsellers } from './knowledge'
import { generateMarketingContent } from './marketing'
import { suggestOffers } from './offerSuggestions'
import { sentimentSummary } from './sentiment'
import { trendingRecommendations } from './recommend'
import { segmentCounts } from './segmentation'

export function getDashboardInsights() {
  const bestsellers = getBestsellers(5)
  const topItem = bestsellers[0]
  const offers = suggestOffers(1)
  const sentiment = sentimentSummary()

  return {
    todaysRecommendation: trendingRecommendations(1)[0] ?? null,
    popularItems: bestsellers.map((item) => ({ id: item.id, name: item.name, category: item.category })),
    customerSentiment: {
      total: sentiment.total,
      counts: sentiment.counts,
    },
    suggestedOffer: offers[0] ?? null,
    suggestedContent: topItem ? generateMarketingContent(topItem.name) : null,
    customerSegments: segmentCounts(),
  }
}
