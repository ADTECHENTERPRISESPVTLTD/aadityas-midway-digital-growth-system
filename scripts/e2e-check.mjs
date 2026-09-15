// Smoke test: drives the actual running site in a headless browser and
// clicks through the main customer journey (nav, cart, booking, and
// critically the AI chat) instead of just checking that the code
// compiles. Screenshots land in scripts/e2e-screenshots/ (gitignored)
// so you can see what actually rendered, not just pass/fail text.
//
// Usage: start the dev server first (`npm run dev`), then in another
// terminal run `npm run test:e2e`. See README section "Testing the
// customer journey" for details.

import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const shotsDir = join(__dirname, 'e2e-screenshots')
mkdirSync(shotsDir, { recursive: true })

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000'

const results = []
function log(step, ok, detail) {
  results.push({ step, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${step} | ${detail ?? ''}`)
}

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const consoleErrors = []
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message))

async function closeAnyOverlay() {
  try {
    await page.locator('button[aria-label*="close" i]').first().click({ timeout: 3000 })
  } catch {
    await page.mouse.click(10, 10).catch(() => {})
  }
  await page.waitForTimeout(400)
}

try {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: join(shotsDir, '01-homepage.png') })
  log('Homepage loads', true, await page.title())

  for (const [label, path] of [['Menu', '/menu'], ['Offers', '/offers'], ['Story', '/story'], ['Visit', '/visit'], ['Gallery', '/gallery'], ['Reviews', '/reviews']]) {
    try {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(600)
      const bodyText = await page.textContent('body')
      log(`Nav: ${label} (${path})`, !!(bodyText && bodyText.length > 200), `body length ${bodyText?.length ?? 0}`)
    } catch (e) {
      log(`Nav: ${label} (${path})`, false, String(e.message).slice(0, 200))
    }
  }

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(1000)

  try {
    const addButtons = page.locator('button:has-text("Add")')
    const count = await addButtons.count()
    if (count > 0) await addButtons.first().click({ timeout: 5000 })
    log('Add to cart', count > 0, `found ${count} add buttons`)
  } catch (e) {
    log('Add to cart', false, String(e.message).slice(0, 200))
  }

  try {
    const cartTrigger = page.locator('[aria-label*="cart" i], [class*="cart" i]').first()
    await cartTrigger.click({ timeout: 5000 })
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(shotsDir, '02-cart-drawer.png') })
    log('Cart drawer opens', true, '')
  } catch (e) {
    log('Cart drawer opens', false, String(e.message).slice(0, 200))
  }
  await closeAnyOverlay()

  try {
    await page.locator('button:has-text("Reserve"), button:has-text("Book")').first().click({ timeout: 5000 })
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(shotsDir, '03-booking-modal.png') })
    const modalVisible = await page.locator('input[type="date"], input[placeholder*="name" i]').first().isVisible().catch(() => false)
    log('Booking modal opens', modalVisible, modalVisible ? 'form fields visible' : 'no form fields detected')
  } catch (e) {
    log('Booking modal opens', false, String(e.message).slice(0, 200))
  }
  await closeAnyOverlay()

  try {
    await page.locator('button:has-text("Assistant"), button:has-text("Ask")').first().click({ timeout: 8000 })
    await page.waitForTimeout(800)
    log('Chat assistant opens', true, '')

    const questions = [
      { q: 'how much is chicken shawarma platter', expect: '₹' },
      { q: 'any offers today', expect: 'MIDWEEK20' },
    ]
    for (const { q, expect } of questions) {
      const input = page.locator('input[type="text"], input[placeholder*="Ask" i]').last()
      await input.fill(q)
      await input.press('Enter')
      await page.waitForTimeout(2500)
      const bubbles = await page.locator('.chat-bubble, [class*="message" i]').allTextContents()
      const lastReplies = bubbles.slice(-3).join(' | ')
      const noError = !lastReplies.toLowerCase().includes("couldn't reach") && !lastReplies.includes("Sorry, I couldn't reach")
      const hasExpect = lastReplies.includes(expect)
      const hasContent = bubbles.some((b) => b.length > 10)
      log(`Chat UI: "${q}"`, noError && hasExpect && hasContent, lastReplies.slice(0, 250))
    }
    await page.screenshot({ path: join(shotsDir, '04-chat.png') })

    try {
      const apiRes = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'what is chicken shawarma' }),
      })
      const apiData = await apiRes.json()
      const apiOk = apiRes.ok && apiData.ok === true && apiData.data
        && typeof apiData.data.reply === 'string'
        && apiData.data.reply.length > 5
        && typeof apiData.data.intent === 'string'
        && typeof apiData.data.groundedInData === 'boolean'
      log('API: /api/ai/chat', apiOk, `intent=${apiData.data?.intent} reply=${apiData.data?.reply?.slice(0, 80)}`)
    } catch (e) {
      log('API: /api/ai/chat', false, String(e.message).slice(0, 200))
    }
  } catch (e) {
    log('Chat assistant flow', false, String(e.message).slice(0, 300))
  }

  writeFileSync(join(shotsDir, 'results.json'), JSON.stringify({ results, consoleErrors }, null, 2))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`)
if (consoleErrors.length) console.log(`Console errors seen: ${consoleErrors.length}`)
if (failed.length > 0) process.exitCode = 1
