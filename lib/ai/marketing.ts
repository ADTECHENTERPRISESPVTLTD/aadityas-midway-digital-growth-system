// AI-04: AI Marketing Assistant
//
// Admin types something like "Paneer Pizza + Weekend Offer" and gets back
// ready-to-post social content. This is template-based generation, not a
// live LLM call — deterministic, free to run, and good enough for a
// prototype. Swap point for later: replace `fillTemplate` with a real
// LLM call (prompt = business info + item + offer, grounded the same way
// as assistant.ts) behind the same `generateMarketingContent` signature.

import { getBusinessInfo } from './knowledge'
import type { BusinessInfo } from './types'

export type MarketingContent = {
  caption: string
  reelHook: string
  storyIdea: string
  cta: string
  hashtags: string[]
}

function toHashtag(word: string) {
  return '#' + word.replace(/[^a-zA-Z0-9]/g, '')
}

function baseHashtags(business: BusinessInfo, subject: string): string[] {
  const place = toHashtag(business.name)
  const words = subject
    .split(/[+,-]/)
    .map((w) => w.trim())
    .filter(Boolean)
    .flatMap((phrase) => phrase.split(/\s+/))
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .map(toHashtag)

  return Array.from(new Set([place, '#AadityasMidway', '#Sausar', '#FoodieFinds', ...words]))
}

export function generateMarketingContent(subject: string, offerLabel?: string): MarketingContent {
  const business = getBusinessInfo()
  const item = subject.trim()
  const offer = offerLabel?.trim()

  const caption = offer
    ? `${item} is back on the menu — and this weekend it comes with ${offer}. Swing by ${business.name} on ${business.address.split(',')[0]} before it's gone.`
    : `${item} is calling your name at ${business.name}. Come taste why it's a favourite.`

  const reelHook = offer
    ? `POV: you just found out ${item} has ${offer} this weekend 👀`
    : `Wait till you see what's in our ${item} 🔥`

  const storyIdea = offer
    ? `Behind-the-scenes clip of ${item} being plated, ending on a text overlay: "${offer} — this weekend only".`
    : `Quick 3-second close-up shot of ${item} with a "Tap to order" sticker.`

  const cta = offer
    ? `Order now and grab ${offer} before it ends.`
    : `Order ${item} now — link in bio.`

  return {
    caption,
    reelHook,
    storyIdea,
    cta,
    hashtags: baseHashtags(business, `${item} ${offer ?? ''}`),
  }
}
