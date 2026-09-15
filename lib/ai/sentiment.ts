// AI-06: Review Sentiment
//
// Lexicon-based scoring: count positive vs negative words, classify by
// the net score. Simple, explainable, no external API needed. Swap point
// for later: replace `scoreText` with a real sentiment-analysis
// model/API call and keep the same `analyzeReview` signature.

import { getReviews } from './knowledge'
import type { Review, ReviewTheme, Sentiment, SentimentResult } from './types'

const POSITIVE_WORDS = [
  'amazing', 'great', 'excellent', 'best', 'perfect', 'loved', 'love', 'good', 'fresh',
  'warm', 'friendly', 'quick', 'fast', 'wonderful', 'fantastic', 'delicious', 'happy', 'awesome',
]

const NEGATIVE_WORDS = [
  'terrible', 'bad', 'cold', 'slow', 'wrong', 'disappointed', 'disappointing', 'rude',
  'dirty', 'worst', 'awful', 'poor', 'late', 'never', 'unacceptable',
]

const THEME_KEYWORDS: Record<ReviewTheme, RegExp> = {
  food: /\b(food|dish|taste|menu|shawarma|kebab|salad|soup|platter|meal|flavou?r)\b/i,
  service: /\b(staff|waiter|waitress|service|server|rude|friendly|attentive|distracted)\b/i,
  ambience: /\b(ambience|ambiance|lighting|music|decor|noisy|crowded|cosy|cozy|atmosphere)\b/i,
  waiting_time: /\b(wait|waited|waiting|minutes?|hour|slow|quick|fast)\b/i,
}

function scoreText(text: string): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const word of POSITIVE_WORDS) if (new RegExp(`\\b${word}\\b`).test(lower)) score += 1
  for (const word of NEGATIVE_WORDS) if (new RegExp(`\\b${word}\\b`).test(lower)) score -= 1
  return score
}

function classify(score: number): Sentiment {
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

function detectThemes(text: string): ReviewTheme[] {
  return (Object.keys(THEME_KEYWORDS) as ReviewTheme[]).filter((theme) => THEME_KEYWORDS[theme].test(text))
}

export function analyzeReview(review: Review): SentimentResult {
  const score = scoreText(review.text)
  return {
    reviewId: review.id,
    sentiment: classify(score),
    score,
    themes: detectThemes(review.text),
  }
}

export function analyzeAllReviews(): SentimentResult[] {
  return getReviews().map(analyzeReview)
}

export function sentimentSummary() {
  const results = analyzeAllReviews()
  const counts: Record<Sentiment, number> = { positive: 0, neutral: 0, negative: 0 }
  for (const r of results) counts[r.sentiment] += 1
  return { total: results.length, counts, results }
}
