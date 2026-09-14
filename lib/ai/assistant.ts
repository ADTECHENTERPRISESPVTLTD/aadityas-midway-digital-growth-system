// AI-02: Customer AI Assistant
//
// Rule: every fact in a reply must come from lib/ai/knowledge.ts (menu,
// business info). If the lookup finds nothing, the assistant says so
// honestly instead of guessing — it must never invent restaurant
// information (prices, hours, dishes that don't exist, etc).

import { classifyIntent } from './intents'
import { getBusinessInfo, getBestsellers, formatPriceInr, searchMenu } from './knowledge'
import { recommendForQuery, trendingRecommendations } from './recommend'
import type { AssistantResponse, MenuItem, RecommendationCard } from './types'

function describeMenuItem(item: MenuItem, intent: AssistantResponse['intent']): AssistantResponse {
  return {
    reply: `${item.name} (${item.category}) — ${item.description} Priced at ${formatPriceInr(item.priceLabel, item.currency)}.${item.veg ? ' This is a vegetarian dish.' : ''}${item.bestseller ? ' It\'s one of our bestsellers.' : ''}`,
    intent,
    recommendations: [],
    groundedInData: true,
  }
}

// When the query matches a whole category (e.g. "tell me about your
// wraps"), list the category instead of arbitrarily describing one item
// out of several equally-valid matches.
function describeMenuMatches(matches: MenuItem[], intent: AssistantResponse['intent']): AssistantResponse {
  if (matches.length === 1) return describeMenuItem(matches[0], intent)

  const categories = new Set(matches.map((item) => item.category))
  if (categories.size === 1) {
    const [category] = categories
    const names = matches.map((item) => `${item.name} (${formatPriceInr(item.priceLabel, item.currency)})`).join(', ')
    return {
      reply: `Our ${category} options: ${names}. Ask me about any one of these for more detail.`,
      intent,
      recommendations: [],
      groundedInData: true,
    }
  }

  return describeMenuItem(matches[0], intent)
}

export function answerCustomerQuestion(message: string): AssistantResponse {
  const trimmed = message.trim()
  if (!trimmed) {
    return { reply: 'Could you type your question? I can help with the menu, prices, offers, timings, location or table booking.', intent: 'unknown', recommendations: [], groundedInData: true }
  }

  const intent = classifyIntent(trimmed)
  const business = getBusinessInfo()

  switch (intent) {
    case 'greeting':
      return {
        reply: `Hi! I'm the Aaditya's Midway assistant. Ask me about the menu, prices, today's offers, timings, location, or say "recommend something" and I'll suggest a pairing.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }

    case 'timing':
      return {
        reply: `We're open ${business.hours.display}.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }

    case 'location':
      return {
        reply: `You'll find us at ${business.address}. You can use the "Get directions" button on our Visit page to open this in Google Maps.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }

    case 'contact':
      return {
        reply: `You can call us at ${business.contact.phones.join(' or ')}, or message us on WhatsApp.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }

    case 'booking':
      return {
        reply: business.booking.acceptsOnlineRequests
          ? `You can request a table right on this site — tap "Book a table", pick your date, time and number of guests, and add your name and mobile number. The restaurant confirms each request.`
          : `Please call us at ${business.contact.phones[0]} to book a table.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }

    case 'offers': {
      if (business.offers.length === 0) {
        return { reply: `There are no active offers right now — please check back soon.`, intent, recommendations: [], groundedInData: true }
      }
      const list = business.offers.map((offer) => `• ${offer.title} (code ${offer.code}): ${offer.description}`).join('\n')
      return { reply: `Here's what's currently running:\n${list}`, intent, recommendations: [], groundedInData: true }
    }

    case 'price': {
      const matches = searchMenu(trimmed)
      if (matches.length === 0) {
        return { reply: `I couldn't find that item on our menu. Could you check the spelling, or tell me the category (e.g. "shawarma", "wraps", "breakfast")?`, intent, recommendations: [], groundedInData: false }
      }
      const item = matches[0]
      return { reply: `${item.name} is ${formatPriceInr(item.priceLabel, item.currency)}.`, intent, recommendations: [], groundedInData: true }
    }

    case 'menu': {
      const matches = searchMenu(trimmed)
      if (matches.length > 0) return describeMenuMatches(matches, intent)
      const bestsellers = getBestsellers(5).map((item) => item.name).join(', ')
      return {
        reply: `Our menu covers soups, salads, grills, platters, wraps, breakfast and drinks. Some bestsellers: ${bestsellers}. Ask me about a specific dish or category for more detail.`,
        intent,
        recommendations: [],
        groundedInData: true,
      }
    }

    case 'recommendation': {
      const { matchedItem, recommendations } = recommendForQuery(trimmed)
      if (matchedItem && recommendations.length > 0) {
        const names = recommendations.map((r) => r.name).join(' and ')
        return { reply: `Since you're getting ${matchedItem.name}, you can try our ${names}.`, intent, recommendations, groundedInData: true }
      }
      const trending: RecommendationCard[] = trendingRecommendations(3)
      return {
        reply: `Tell me a dish you're ordering and I'll suggest what goes well with it. Meanwhile, these are trending: ${trending.map((r) => r.name).join(', ')}.`,
        intent,
        recommendations: trending,
        groundedInData: true,
      }
    }

    default: {
      // The keyword list can't cover every dish/category name a customer
      // might type (e.g. "tell me about your wraps"). Before giving up,
      // check whether the message actually names something on the menu.
      const matches = searchMenu(trimmed)
      if (matches.length > 0) return describeMenuMatches(matches, 'menu')
      return {
        reply: `I can help with the menu, prices, today's offers, timings, location, or table booking guidance. Could you rephrase your question?`,
        intent: 'unknown',
        recommendations: [],
        groundedInData: true,
      }
    }
  }
}
