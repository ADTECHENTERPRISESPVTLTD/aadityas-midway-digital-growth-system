# AI Module — Architecture & Documentation

Owner: AI Lead Intern (Soham). Covers tasks AI-01 through AI-09.

## AI-01: Architecture

```
Frontend  --->  AI API (app/api/ai/*)  --->  Business Data (lib/ai/data/*.json)  --->  AI Response
```

- **Frontend**: any client (currently the customer-facing chat widget in
  `app/page.tsx`, and eventually the admin dashboard) calls the `/api/ai/*`
  routes with `fetch`.
- **AI API**: Next.js Route Handlers under `app/api/ai/`. Each route does
  input validation, then delegates to a matching module in `lib/ai/`.
- **Business Data**: static JSON files in `lib/ai/data/` (menu, business
  info, reviews, customers), read exclusively through `lib/ai/knowledge.ts`.
- **AI Response**: a small, typed object (see `lib/ai/types.ts`) — never
  raw model output, so the frontend always knows what shape to expect.

### AI model/API

**Decision: rule-based / deterministic logic, not a hosted LLM.** Reasons:
- AI-02 explicitly forbids inventing restaurant information — a raw LLM
  call without strict grounding risks hallucinating prices/dishes.
- AI-03 explicitly asks to start rule-based and keep the door open for ML.
- No API key/budget exists yet for this prototype (DevOps hasn't
  provisioned one — see DO-02, "AI" env var category).

**Swap-in path for later**: every module in `lib/ai/` only talks to the
outside world through `lib/ai/knowledge.ts` (the data layer). To add a
real LLM/ML step later:
1. Add the provider call as a new function (e.g. `lib/ai/llm.ts`).
2. In `assistant.ts`, once intent + grounding facts are resolved, hand
   those facts (not the raw model) to the LLM only to phrase the final
   sentence — the LLM never gets to introduce facts of its own.
3. In `recommend.ts`, implement a second `RecommendationEngine` (e.g.
   trained on order co-occurrence from FS-09 analytics) and swap it in
   `getRecommendationEngine()`. No caller changes.
4. Store the new provider's key as `AI_PROVIDER_API_KEY` in `.env.local`
   (never commit it — see Security below).

### Prompt structure

Not applicable yet (no LLM calls). When one is added, the prompt must be
built as: `system prompt (persona + hard rule "only use the facts given,
never add facts") + grounded facts (from knowledge.ts) + user question`.
The system prompt is the enforcement point for "must not invent
information."

### Data retrieval

All AI features read through `lib/ai/knowledge.ts`, which currently reads
static JSON in `lib/ai/data/`:
- `menu.json` — generated from the same menu rows used in the live
  frontend (`app/page.tsx`). Prices are stored as the *original* $/TZS
  label; `formatPriceInr()` in `knowledge.ts` converts them to rupees
  using the exact same formula the frontend uses, so a price the AI says
  out loud always matches the number on screen. (This wasn't true in an
  earlier version — the AI briefly quoted raw $/TZS prices instead of
  rupees; fixed before submission.) Includes a `bestseller` flag (derived
  from the menu's star ratings) and an `available` flag — **both are
  demo/seed values** until real order and inventory data exists.
- `business.json` — address, hours, contact numbers, offers.
- `reviews.json`, `customers.json` — sample data for AI-06/07/08/09,
  clearly synthetic, for demoing the sentiment/segmentation/dashboard
  logic before real review/order data exists.

When the Full-Stack intern's menu/orders/reviews APIs (FS-02, FS-03) are
live, only `knowledge.ts`'s function bodies need to change to fetch from
the real API/DB instead of `require`-ing JSON. Nothing else in `lib/ai/`
or `app/api/ai/` needs to change.

### Error handling

- Every route handler is wrapped in `withErrorHandling()`
  (`lib/ai/http.ts`), which catches any unexpected exception, logs it
  server-side, and returns a generic `{ ok: false, error }` 500 — no
  stack traces or internals ever reach the client.
- Input validation (`safeString`, `safeNumber`) rejects missing/oversized
  fields with a 400 before any logic runs.
- The assistant itself never throws for "I don't know" cases — it returns
  a normal 200 with an honest reply and `groundedInData: false`, so the
  UI can distinguish "found nothing" from "server broke."

### Security

- **No secrets required today** — the module is 100% rule-based, so there
  is nothing to leak. When an LLM key is added, it goes in `.env.local`
  (already covered by `.gitignore`) and is read via
  `process.env.AI_PROVIDER_API_KEY`, never hardcoded.
- **Input validation**: every route caps string length (`safeString`) to
  stop oversized payloads.
- **Basic rate limiting**: `lib/ai/rateLimit.ts` limits the chat endpoint
  to 20 requests/minute per IP. This is an in-memory, per-instance
  stopgap for the prototype — DevOps (DO-06) should replace it with a
  shared limiter (e.g. Redis-backed) before production.
- **No arbitrary code execution / no `eval`** — all responses are built
  from template strings using data straight from the JSON files.

## AI-02: Customer AI Assistant

`lib/ai/assistant.ts`. Classifies the message into an intent
(`lib/ai/intents.ts`, keyword/regex based — cheap, predictable, no
network call) and answers using only data resolved through
`knowledge.ts`. Handles: menu questions, price questions, offers, timing,
location, recommendations, and booking guidance (the booking flow itself
lives in the frontend; the assistant only explains how to use it).

**Frontend wiring:** `components/DiningAssistantModal.tsx` calls
`POST /api/ai/chat` and renders `reply` plus, if present, the first
`recommendations[]` entry as a suggested-item card (looked up by id in
`lib/menuData.ts`). An earlier version of that component had its own
hardcoded reply logic (a placeholder built before this API existed) —
replaced with the real call so there's exactly one source of truth for
what the assistant says.

If a lookup finds nothing (e.g. an item not on the menu), the assistant
says so honestly instead of guessing — `groundedInData: false` on the
response flags this case explicitly for the frontend/tests.

API: `POST /api/ai/chat` — `{ message: string }` → `AssistantResponse`.

## AI-03: Food Recommendation

`lib/ai/recommend.ts`. A category-pairing rule table
(`PAIRING_RULES`) plus a bestseller fallback. The `RecommendationEngine`
interface is the documented seam for swapping in a real ML model later
(see AI-01 above) without touching any caller.

API: `POST /api/ai/recommend` — `{ itemId }` or `{ query }` → recommendation cards.
Also used internally by the chat assistant for "what goes well with X" questions.

## AI-04: AI Marketing Assistant

`lib/ai/marketing.ts`. Template-based generator: given an item name and
optional offer label, produces a caption, reel hook, story idea, CTA and
hashtags. Deterministic (no external call), good enough for a prototype;
swap point noted in the file for a future real LLM call.

API: `POST /api/ai/marketing` — `{ item, offer? }`.

## AI-05: AI Offer Suggestions

`lib/ai/offerSuggestions.ts`. Looks at which menu categories currently
have bestsellers, cross-references the same pairing rules `recommend.ts`
uses, and proposes a combo with a plain-language reason. Once FS-09
analytics exists, only `topSellingCategories()` needs to change to use
real sales data instead of the `bestseller` flag.

API: `GET /api/ai/offer-suggestions`.

## AI-06: Review Sentiment

`lib/ai/sentiment.ts`. Lexicon-based scoring (positive/negative word
counts) classifies each review as positive/neutral/negative, and a
keyword map tags themes (food / service / ambience / waiting_time).

API: `GET /api/ai/sentiment`.

## AI-07: AI Review Reply

`lib/ai/reviewReply.ts`. Generates a **draft only** — the return shape is
literally `status: 'pending_approval'`. Nothing in this codebase sends or
publishes a reply automatically; the admin UI (not yet built) is
responsible for the Approve → Reply step.

API: `GET /api/ai/review-reply` (all drafts) or `POST { reviewId }` (one).

## AI-08: Customer Segmentation

`lib/ai/segmentation.ts`. Rule-based, checked in this order: **New** →
**Inactive** → **High Value** → **Regular**. Thresholds
(`NEW_CUSTOMER_WINDOW_DAYS`, `INACTIVE_WINDOW_DAYS`,
`HIGH_VALUE_SPEND_INR`, `HIGH_VALUE_ORDER_COUNT`) are prototype guesses —
tune them once real order volume exists.

API: `GET /api/ai/segmentation`.

## AI-09: AI Dashboard

`lib/ai/insights.ts` is a pure aggregator — it composes the outputs of
AI-03/04/05/06/08 into one payload for an admin "AI Insights" panel. No
new logic lives here on purpose.

API: `GET /api/ai/dashboard`.

## Testing the customer journey

`npm run test:e2e` drives the actual running site in a headless browser
(Playwright) and clicks through the main flow — nav pages, add to cart,
cart drawer, booking modal, and the AI chat itself (typing real
questions and checking the reply is grounded, e.g. contains a real ₹
price, not the same canned sentence every time). This is a smoke test,
not a full test suite — it proves the pieces are wired together, not
every edge case.

Usage: start the dev server first (`npm run dev`), then in a second
terminal run `npm run test:e2e`. Screenshots and a `results.json` land
in `scripts/e2e-screenshots/` (gitignored — regenerated each run, not
committed).

## Known limitations (by design, for a same-week prototype)

- **The menu content itself is placeholder, not Aaditya's Midway's real
  menu.** It was inherited as-is from the frontend scaffold (added in the
  project's first commit) and appears to originate from unrelated
  Instagram posts (one section's TZS pricing traces to a Tanzania-based
  cafe, not this restaurant). Flagged to the team lead; the decision was
  to launch with this placeholder menu for now and swap in the real menu
  later. No code change needed for that swap — everything reads through
  `lib/ai/knowledge.ts`, so replacing `lib/ai/data/menu.json` (and the
  matching array in `app/page.tsx`) with the real menu is enough.
- All data is static JSON, not a database — matches the current state of
  the rest of the project (no backend yet). See "Data retrieval" above
  for the swap path once FS-02/FS-03 land.
- `bestseller` flags and all of `reviews.json`/`customers.json` are seed
  data, clearly not real business records.
- The menu has two items literally both named "Chicken Shawarma" (one
  under Sandwiches & Burgers, one under Chicken Platter) — an existing
  ambiguity in the source menu data, not something the AI invents. Price
  lookups return the first match; this should be resolved by giving menu
  items distinct names when the real menu is finalized.
- Intent classification is keyword-based, not NLU — good enough for a
  prototype, but it will occasionally miss phrasing outside the patterns
  in `intents.ts`. The chat handler falls back to a direct menu search
  before giving up, which covers most of these gaps.
- Asking for the price of a whole category ("price of chicken platter")
  returns one arbitrary item from that category rather than clarifying
  which dish you mean — a category doesn't have a single price, and the
  assistant doesn't yet detect this case to ask a follow-up question.
- Typos beyond simple letter substitutions (e.g. "pulaoo" for "pulao")
  aren't corrected — the assistant honestly says it can't find the item
  rather than guessing, which is the right tradeoff given "must not
  invent information," but a real fuzzy-match (e.g. Levenshtein
  distance) would be friendlier. Not implemented, to keep matching
  100% predictable for a prototype.
- Stress-tested with ~100 varied/adversarial questions
  (misspellings, multi-intent, negation, off-topic, injection-style
  strings, empty/garbage input, unicode). Found and fixed two real bugs
  in the process: (1) `searchMenu` matched a hidden substring inside an
  unrelated word — "price" contains "rice", so any price question that
  didn't otherwise match a specific dish silently fell back to quoting
  a random Rice-category item; (2) very short queries (1-2 chars, e.g.
  a lone ".") matched almost any item via naive substring inclusion.
  Both fixed in `lib/ai/knowledge.ts` with whole-word matching and a
  minimum query length for loose substring matching. All security-probe
  and off-topic questions (script tags, SQL-injection-style strings,
  "ignore previous instructions", off-topic trivia) were correctly
  declined without crashing or leaking anything, since there's no
  database or LLM here for such strings to affect either way.
