// Regression check for lib/liveMenuMapping.ts -- run with: npm run test:mapping
//
// The cart, the AI assistant and the pages all key on a dish's numeric id.
// That id must stay the same whether the page is showing the built-in menu
// or the live database menu, otherwise a cart silently changes dishes when
// live data arrives. This runs a few hundred randomised scenarios (shuffled
// API order, dishes missing, database-only dishes, same-named dishes,
// price edits, renames) plus a check that every dish the AI can recommend
// resolves to the right dish. Uses only files in this repo -- no network.
import fs from 'node:fs'
import { mapBackendItems } from '../lib/liveMenuMapping.ts'
import { ALL_MENU_ITEMS } from '../lib/menuData.ts'

const AI = JSON.parse(fs.readFileSync('lib/ai/data/menu.json', 'utf8'))
// stands in for the database: what `npm run seed:menu` loads
const DB = JSON.parse(fs.readFileSync('backend/src/data/menuSeed.json', 'utf8')).map((x, i) => ({
  ...x,
  _id: `db${i}`,
  category: { name: x.category },
}))

const shuffled = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}
const maxStatic = Math.max(...ALL_MENU_ITEMS.map((s) => s.id))
const norm = (s) => s.trim().toLowerCase()
const staticIds = (name) => ALL_MENU_ITEMS.filter((s) => norm(s.name) === norm(name)).map((s) => s.id)

let pass = 0
let fail = 0
const bad = new Map()
const check = (name, ok, msg = '') => {
  if (ok) pass++
  else {
    fail++
    const k = `${name}: ${msg}`
    bad.set(k, (bad.get(k) || 0) + 1)
  }
}

for (let t = 0; t < 350; t++) {
  const mode = t % 7
  let payload = shuffled(DB).map((x) => ({ ...x }))
  let renamed = []
  let ambiguous = false

  if (mode === 1) payload = payload.slice(1 + Math.floor(Math.random() * 10)) // dishes missing from the DB
  if (mode === 2) payload = shuffled([...payload, { _id: 'new1', name: 'Brand New Dish', price: 99, category: { name: 'Signature' } }, { _id: 'new2', name: 'Another New Dish', price: 199, category: 'Signature' }])
  if (mode === 3) payload = shuffled([...payload, { ...payload[0], _id: 'dupe', price: payload[0].price + 50 }]) // same name, different price
  if (mode === 4) payload = payload.map((x, i) => (i % 7 === 0 ? { ...x, price: x.price + 10 } : i % 11 === 0 ? { ...x, name: `  ${x.name.toUpperCase()}  ` } : x))
  if (mode === 5) {
    // renamed on the website after the DB was seeded
    renamed = shuffled(payload).slice(0, 3).map((r) => ({ ref: r, key: `${r.category.name}|${r.price}` }))
    renamed.forEach((r, i) => { r.ref.name = `Renamed Dish ${t}-${i}` })
  }
  if (mode === 6) {
    // 2 dishes of a category+price group gone, 1 new one of the same category+price appears: counts differ -> don't guess
    const groups = new Map()
    payload.forEach((p) => { const k = `${p.category.name}|${p.price}`; groups.set(k, [...(groups.get(k) || []), p]) })
    const big = shuffled([...groups.values()].filter((g) => g.length >= 3))[0]
    payload = payload.filter((p) => !big.slice(0, 2).includes(p))
    payload.push({ _id: 'amb', name: `Ambiguous New ${t}`, price: big[0].price, category: { name: big[0].category.name } })
    ambiguous = true
  }

  const out = mapBackendItems(payload, ALL_MENU_ITEMS)
  const ids = out.map((o) => o.id)
  check('ids are unique', new Set(ids).size === ids.length, `mode ${mode}`)
  check('sorted by id, so the order matches the built-in menu', ids.every((v, i) => i === 0 || ids[i - 1] <= v), `mode ${mode}`)
  check('every item keeps its database id', out.every((o) => payload.some((p) => p._id === o.backendId)), `mode ${mode}`)
  check('nothing dropped or invented', out.length === payload.length, `mode ${mode}: ${out.length} vs ${payload.length}`)

  const wrong = out.filter((o) => {
    if (o.backendId === 'dupe') return false
    const ok = staticIds(o.name)
    return ok.length > 0 && !ok.includes(o.id)
  })
  check('a dish keeps the SAME id as on the website', wrong.length === 0, `mode ${mode}: ${wrong.map((w) => w.name).join(', ')}`)

  if (mode === 2) check('database-only dishes get ids above the website range', out.filter((o) => o.backendId.startsWith('new')).every((o) => o.id > maxStatic), 'id collision')
  if (mode === 3) {
    const original = out.find((o) => o.backendId === payload.find((p) => p._id !== 'dupe' && p.name === DB[0].name)._id)
    check('same-named dish with a different price gets its own id', original && staticIds(DB[0].name).includes(original.id) && out.find((o) => o.backendId === 'dupe').id > maxStatic, 'wrong handling')
  }
  for (const r of renamed) {
    const got = out.find((o) => o.backendId === r.ref._id)
    const twins = ALL_MENU_ITEMS.filter((s) => `${s.category}|${s.price}` === r.key).map((s) => s.id)
    check('renamed dish keeps continuity', twins.includes(got?.id), `${r.ref.name} -> id ${got?.id}`)
  }
  if (ambiguous) check('ambiguous rename: does not guess an identity', out.find((o) => o.backendId === 'amb').id > maxStatic, 'guessed')
}

// every dish the AI can recommend must resolve to that same dish on the live menu
for (let t = 0; t < 3; t++) {
  const out = mapBackendItems(shuffled(DB), ALL_MENU_ITEMS)
  for (const ai of AI) {
    const hit = out.find((o) => o.id === ai.id)
    check('AI recommendation id -> the right dish', hit?.name === ai.name, `AI id ${ai.id} "${ai.name}" -> "${hit?.name}"`)
  }
}

console.log(`live-menu id mapping: ${pass + fail} checks, ${pass} passed, ${fail} failed`)
for (const [m, c] of [...bad.entries()].slice(0, 10)) console.log(`  x${c} ${m}`)
process.exit(fail ? 1 : 0)
