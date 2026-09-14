// AI-07: AI Review Reply
//
// Generates a DRAFT reply only. Nothing here ever sends or publishes
// anything — the return shape includes status: 'pending_approval' as a
// reminder to whoever wires this into the admin UI that a human must
// click "Approve" before it goes out anywhere.

import { getBusinessInfo, getReviews } from './knowledge'
import { analyzeReview } from './sentiment'
import type { Review, ReviewTheme, Sentiment } from './types'

export type ReviewReplyDraft = {
  reviewId: string
  status: 'pending_approval'
  draft: string
}

const THEME_LABEL: Record<ReviewTheme, string> = {
  food: 'the food',
  service: 'our service',
  ambience: 'the ambience',
  waiting_time: 'the wait time',
}

function draftFor(review: Review, sentiment: Sentiment, themes: ReviewTheme[]): string {
  const business = getBusinessInfo()
  const name = review.customerName.split(' ')[0]

  if (sentiment === 'positive') {
    return `Hi ${name}, thank you so much for the kind words! We're thrilled you enjoyed your visit to ${business.name} and hope to see you again soon.`
  }

  const concern = themes.length > 0 ? THEME_LABEL[themes[0]] : 'your experience'
  if (sentiment === 'negative') {
    return `Hi ${name}, we're sorry to hear about ${concern} during your visit — this isn't the standard we aim for. Please reach out to us at ${business.contact.phones[0]} so we can make this right.`
  }

  return `Hi ${name}, thank you for sharing your feedback about ${concern}. We're always working to improve and would love to hear more — feel free to reach us at ${business.contact.phones[0]}.`
}

export function generateReplyDraft(review: Review): ReviewReplyDraft {
  const { sentiment, themes } = analyzeReview(review)
  return { reviewId: review.id, status: 'pending_approval', draft: draftFor(review, sentiment, themes) }
}

export function generateAllReplyDrafts(): ReviewReplyDraft[] {
  return getReviews().map(generateReplyDraft)
}
