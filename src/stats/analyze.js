// The family dashboard's analysis (/stats, docs/knowledge/usage-data.md): the events that
// ew_admin('events') returns ({ at, kind, path, data, visit, device, label }, see src/net/telemetry.js)
// turned into visits, stays in each world, panels read or skimmed, and the rest the page shows. Pure
// functions of the events (analyze.test.js), and none may crash on a kind or a field it does not know:
// telemetry.js can send new kinds before the dashboard learns them.
//
// What the recording does that shapes this (seen in the events themselves, 2026-10-29):
// - a panel opened at an exhibit is first recorded under its title and a frame later under the exhibit's
//   id ('Fact file' then 'facts'): a "panel" closed within FLICKER_MS was only its id being corrected;
// - a world rebuilt where it stands (a change of language) is left and entered again at once: one stay;
// - a page closed or killed while put away (phones) may send no "leave": its stay is estimated from the
//   last thing recorded there, without the time it was hidden, and marked `est`.
import { element } from '../data/elements.js'
import { WING_PLACES } from './names.js'

export const QUICK_MS = 20000 // a world left with less active time than this: a quick exit
export const SKIM_MS = 3000 // a panel closed within this was skimmed, not read
export const FLICKER_MS = 300 // a panel closed within this was its id being corrected, not a reading
export const JOIN_MS = 3000 // a world left and entered again within this is one stay
const GAP_MS = 30 * 60000 // a pause this long ends an estimated stay or reading
export const LIMIT = 50000 // the most events ew_admin returns at once (the newest)

/** The kinds this dashboard knows; any other is listed as it came (othersOf). */
export const KINDS = new Set(['start', 'enter', 'leave', 'hide', 'show', 'sel', 'fact', 'panel', 'pclose', 'talk', 'tile', 'quizopen', 'quiz', 'drawer', 'find', 'forge', 'stars', 'mission', 'level', 'view', 'lang', 'err'])

/** The places that matter most for "never entered": the lab, the forge and every wing (registry.js). */
export const MAIN_PLACES = ['lab', 'forge', ...WING_PLACES]

export const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '180', label: '180 days' },
]

const num = v => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : 0)
const str = v => (v == null ? '' : String(v))
const bump = (m, k, by = 1) => m.set(k, (m.get(k) ?? 0) + by)
const ranked = m => [...m].map(([key, n]) => ({ key, n })).sort((a, b) => b.n - a.n || String(a.key).localeCompare(String(b.key)))
const avg = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** The first moment of a period in the viewer's time zone: today, or the last 7, 30 or 180 days
 *  (today included). */
export function periodStart(period, now = Date.now()) {
  const d = new Date(now)
  const days = period === 'today' ? 0 : (Number(period) || 7) - 1
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - days).getTime()
}

/** The world (or page) an address is in, named as telemetry.js names worlds. */
export function placeOfPath(path) {
  const p = str(path || '/').replace(/\/+$/, '') || '/'
  if (p === '/') return 'plaza'
  if (p === '/lab') return 'lab'
  if (p === '/forge') return 'forge'
  if (p === '/stars') return 'stars'
  const m = p.match(/^\/e\/([A-Za-z]{1,3})(?:\/([\w-]+))?$/)
  const el = m && element(m[1])
  if (el) return m[2] ? `wing:${el.symbol}:${m[2]}` : `atrium:${el.symbol}`
  return `page:${p}`
}

/** The events as the dashboard uses them: times in ms, data always an object, sorted by time; the
 *  dashboard's own page left out (telemetry.js starts on every page, /stats too). */
export function normalize(raw) {
  const out = []
  for (const e of Array.isArray(raw) ? raw : []) {
    if (!e || typeof e !== 'object') continue
    const at = Date.parse(e.at)
    if (!Number.isFinite(at)) continue
    const path = typeof e.path === 'string' ? e.path : ''
    if (/^\/stats(\/|$)/.test(path)) continue
    const data = e.data && typeof e.data === 'object' && !Array.isArray(e.data) ? e.data : {}
    out.push({ at, kind: str(e.kind) || '?', path, data, visit: str(e.visit), device: e.device ?? null, label: e.label ?? null })
  }
  return out.sort((a, b) => a.at - b.at)
}

// ---- visits: one page load each (telemetry.js gives every page load its own id) ----

/** The visits in the events, oldest first, each with its stays and panel readings. */
export function visitsOf(events) {
  const by = new Map()
  for (const e of events) {
    if (!by.has(e.visit)) by.set(e.visit, [])
    by.get(e.visit).push(e)
  }
  return [...by].map(([id, evs]) => visitOf(id, evs)).sort((a, b) => a.start - b.start)
}

function visitOf(id, evs) {
  // a marked device sends what an earlier page load could not with the next one: those come first
  const si = evs.findIndex(e => e.kind === 'start')
  const first = si >= 0 ? evs[si] : evs[0]
  const d = si >= 0 ? evs[si].data : {}
  const v = {
    id,
    device: evs.find(e => e.device)?.device ?? null,
    label: evs.find(e => e.label)?.label ?? null,
    kind: typeof d.kind === 'string' ? d.kind : null,
    browser: typeof d.browser === 'string' ? d.browser : null,
    size: num(d.w) && num(d.h) ? `${num(d.w)}×${num(d.h)}` : null,
    app: d.app === true,
    path: first.path,
    start: first.at,
    end: evs[evs.length - 1].at,
    carried: Math.max(0, si),
    events: evs,
  }
  v.stays = staysOf(v)
  v.readings = readingsOf(v)
  v.active = v.stays.reduce((a, s) => a + s.act, 0)
  v.errors = evs.filter(e => e.kind === 'err').length
  return v
}

/** The time of the last event recorded after evs[i] before the next world, page load or long pause. */
function lastAfter(evs, i) {
  let end = evs[i].at
  for (let j = i + 1; j < evs.length; j++) {
    const e = evs[j]
    if (e.kind === 'enter' || e.kind === 'start' || e.at - end > GAP_MS) break
    end = e.at
  }
  return end
}

/** The time between evs[i] and `end` that the page was on show (hide ... show taken out). */
function visibleTime(evs, i, end) {
  let t = evs[i].at
  let hidden = false
  let shown = 0
  for (let j = i + 1; j < evs.length && evs[j].at <= end; j++) {
    const e = evs[j]
    if (e.kind === 'hide' && !hidden) {
      shown += e.at - t
      hidden = true
    } else if (e.kind === 'show' && hidden) {
      hidden = false
      t = e.at
    }
  }
  if (!hidden) shown += end - t
  return Math.max(0, shown)
}

/** A visit's stays: each world from entering to leaving, with the time it was open (`ms`) and active
 *  (`act`: on show and touched in the last minute, as telemetry.js counts it). */
export function staysOf(v) {
  const evs = v.events
  const pieces = []
  const leaves = new Map()
  for (const e of evs) {
    if (e.kind !== 'leave' || typeof e.data.w !== 'string') continue
    const ms = Math.max(0, num(e.data.ms))
    pieces.push({ w: e.data.w, start: e.at - ms, end: e.at, ms, act: Math.max(0, Math.min(ms, num(e.data.act))), est: false })
    bump(leaves, e.data.w)
  }
  // the enters with no leave of their own (the last ones of each world): estimated
  const enters = new Map()
  evs.forEach((e, i) => {
    if (e.kind !== 'enter' || typeof e.data.w !== 'string') return
    if (!enters.has(e.data.w)) enters.set(e.data.w, [])
    enters.get(e.data.w).push(i)
  })
  for (const [w, idx] of enters) {
    const open = idx.length - (leaves.get(w) ?? 0)
    for (const i of open > 0 ? idx.slice(-open) : []) {
      const end = lastAfter(evs, i)
      pieces.push({ w, start: evs[i].at, end, ms: end - evs[i].at, act: visibleTime(evs, i, end), est: true })
    }
  }
  pieces.sort((a, b) => a.start - b.start || a.end - b.end)
  const stays = []
  for (const p of pieces) {
    const prev = stays[stays.length - 1]
    if (prev && prev.w === p.w && p.start - prev.end <= JOIN_MS) {
      prev.end = Math.max(prev.end, p.end)
      prev.ms += p.ms
      prev.act += p.act
      prev.est = prev.est || p.est
      continue
    }
    stays.push({ ...p, visit: v.id })
  }
  // left by the floor table: passing from hall to hall, not a quick exit
  for (const s of stays) s.byTile = evs.some(e => e.kind === 'tile' && e.at >= s.start - 50 && e.at <= s.end + 1000 && placeOfPath(e.path) === s.w)
  return stays
}

/** The world a visit was in at time t (its stays), or the event's own address. */
function placeAt(v, t, e) {
  const s = v.stays.find(x => x.start - 50 <= t && t <= x.end + 50)
  return s ? s.w : placeOfPath(e.path)
}

/** A visit's panel readings: each panel opened, where, and how long it stayed open. Opens and closes
 *  are paired by id and time (a close says how long it was open), so the order of events recorded in
 *  the same millisecond does not matter. Flickers (FLICKER_MS) are left out. */
export function readingsOf(v) {
  const evs = v.events
  const opens = []
  const closes = []
  evs.forEach((e, i) => {
    if (e.kind === 'panel') opens.push({ e, i, id: str(e.data.id), used: false })
    else if (e.kind === 'pclose') closes.push({ e, id: str(e.data.id), ms: Math.max(0, num(e.data.ms)) })
  })
  const out = []
  for (const c of closes) {
    const from = c.e.at - c.ms
    let best = null
    for (const o of opens) {
      if (o.used || o.id !== c.id || Math.abs(o.e.at - from) > 1500) continue
      if (!best || Math.abs(o.e.at - from) < Math.abs(best.e.at - from)) best = o
    }
    if (best) best.used = true
    if (c.ms < FLICKER_MS) continue
    out.push({ id: c.id, visit: v.id, at: from, ms: c.ms, place: best ? placeOfPath(best.e.path) : placeAt(v, from, c.e), est: false })
  }
  for (const o of opens) {
    if (o.used) continue
    // never closed: the page was closed or put away with it open
    out.push({ id: o.id, visit: v.id, at: o.e.at, ms: lastAfter(evs, o.i) - o.e.at, place: placeOfPath(o.e.path), est: true })
  }
  return out.sort((a, b) => a.at - b.at)
}

export const isRead = r => r.ms >= SKIM_MS
export const isSkim = r => !r.est && r.ms < SKIM_MS
/** Left within QUICK_MS of active time: not the plaza (the way to everything), not by the floor table. */
export const isQuick = s => s.w !== 'plaza' && !s.byTile && s.act < QUICK_MS

// ---- what the page shows ----

/** Everything the dashboard shows, from the events of one period. `boards`: the elements whose halls
 *  have picture boards (src/content/boards/), for comparing them with the plain halls. */
export function analyze(raw, { period = '7', now = Date.now(), boards = [] } = {}) {
  const events = normalize(raw)
  const visits = visitsOf(events)
  const stays = visits.flatMap(v => v.stays)
  const readings = visits.flatMap(v => v.readings)
  return {
    period,
    now,
    events,
    visits,
    stays,
    readings,
    totals: totalsOf(visits, stays, readings),
    days: bucketsOf(visits, period, now),
    places: placesOf(visits),
    halls: hallsOf(visits, boards),
    panels: panelGroupsOf(readings),
    quick: quickExitsOf(stays),
    never: neverEnteredOf(visits),
    features: featuresOf(events),
    plaza: plazaOf(events, stays),
    quiz: quizOf(events),
    forge: forgeOf(events, stays),
    tools: toolsOf(events),
    errors: errorsOf(visits),
    others: othersOf(events),
    confusion: confusionOf(visits),
  }
}

export function totalsOf(visits, stays, readings) {
  const active = stays.reduce((a, s) => a + s.act, 0)
  const entered = new Set(stays.filter(s => s.w !== 'plaza').map(s => s.w))
  return {
    visits: visits.length,
    active,
    perVisit: visits.length ? active / visits.length : 0,
    places: entered.size,
    halls: [...entered].filter(w => w.startsWith('atrium:')).length,
    opened: readings.length,
    read: readings.filter(isRead).length,
    est: stays.filter(s => s.est).length,
    people: new Set(visits.map(v => v.label ?? '')).size,
    anon: visits.filter(v => !v.label).length,
  }
}

/** Visits and active time per hour (today), day (7 and 30 days) or week (180 days). */
export function bucketsOf(visits, period, now = Date.now()) {
  const from = new Date(periodStart(period, now))
  const at = (y, m, d, h = 0) => new Date(y, m, d, h).getTime()
  const Y = from.getFullYear()
  const M = from.getMonth()
  const D = from.getDate()
  const buckets = []
  if (period === 'today') {
    for (let h = 0; h < 24; h++) buckets.push({ start: at(Y, M, D, h), end: at(Y, M, D, h + 1), unit: 'hour' })
  } else if (period === '180') {
    const back = (from.getDay() + 6) % 7 // weeks from Monday
    for (let d = D - back; at(Y, M, d) <= now; d += 7) buckets.push({ start: at(Y, M, d), end: at(Y, M, d + 7), unit: 'week' })
  } else {
    const n = Number(period) || 7
    for (let i = 0; i < n; i++) buckets.push({ start: at(Y, M, D + i), end: at(Y, M, D + i + 1), unit: 'day' })
  }
  for (const b of buckets) Object.assign(b, { visits: 0, active: 0 })
  const find = t => {
    if (!buckets.length || t >= buckets[buckets.length - 1].end) return null
    if (t < buckets[0].start) return buckets[0] // a stay begun before the period: its first bucket
    return buckets.find(b => t >= b.start && t < b.end) ?? null
  }
  for (const v of visits) {
    const b = find(v.start)
    if (b) b.visits++
    for (const s of v.stays) {
      const c = find(s.start)
      if (c) c.active += s.act
    }
  }
  return buckets
}

/** Where the time went: every world entered, with its active and open time, how many times and in how
 *  many visits it was entered, quick exits, talks. */
export function placesOf(visits) {
  const m = new Map()
  for (const v of visits) {
    for (const s of v.stays) {
      if (!m.has(s.w)) m.set(s.w, { w: s.w, active: 0, open: 0, entries: 0, visits: new Set(), quick: 0, est: 0, talks: 0 })
      const p = m.get(s.w)
      p.active += s.act
      p.open += s.ms
      p.entries++
      p.visits.add(v.id)
      if (isQuick(s)) p.quick++
      if (s.est) p.est++
    }
    for (const e of v.events) {
      if (e.kind !== 'talk') continue
      const p = m.get(placeOfPath(e.path))
      if (p) p.talks++
    }
  }
  return [...m.values()].map(p => ({ ...p, visits: p.visits.size })).sort((a, b) => b.active - a.active || b.entries - a.entries)
}

/** Per element's hall: time, visits, panels read and skimmed, the average reading, talks to its
 *  Atomling, floor-table jumps from it, and its wings entered. */
export function hallsOf(visits, boards = []) {
  const withBoards = new Set(boards)
  const m = new Map()
  const hall = symbol => {
    if (!m.has(symbol)) m.set(symbol, { symbol, boards: withBoards.has(symbol), active: 0, open: 0, entries: 0, visits: new Set(), quick: 0, est: 0, opened: 0, read: 0, skimmed: 0, readMs: 0, talks: 0, tiles: 0, wings: new Map() })
    return m.get(symbol)
  }
  for (const v of visits) {
    for (const s of v.stays) {
      const [kind, symbol, wing] = s.w.split(':')
      if (kind === 'atrium' && symbol) {
        const h = hall(symbol)
        h.active += s.act
        h.open += s.ms
        h.entries++
        h.visits.add(v.id)
        if (isQuick(s)) h.quick++
        if (s.est) h.est++
      } else if (kind === 'wing' && symbol && wing) bump(hall(symbol).wings, wing)
    }
    for (const r of v.readings) {
      const [kind, symbol] = r.place.split(':')
      if (kind !== 'atrium' || !symbol) continue
      const h = hall(symbol)
      h.opened++
      if (isRead(r)) {
        h.read++
        h.readMs += r.ms
      } else if (isSkim(r)) h.skimmed++
    }
    for (const e of v.events) {
      const place = placeOfPath(e.path)
      const here = place.startsWith('atrium:') ? place.slice(7) : null
      // talks in a wing belong to the wing (placesOf), not to the hall
      if (e.kind === 'talk' && here) hall(here).talks++
      else if (e.kind === 'tile') {
        const sym = element(e.data.from)?.symbol ?? here
        if (sym) hall(sym).tiles++
      }
    }
  }
  return [...m.values()]
    .map(h => ({ ...h, visits: h.visits.size, wings: ranked(h.wings).map(x => ({ id: x.key, n: x.n })), avgRead: h.read ? h.readMs / h.read : 0, idle: h.entries > 0 && h.opened === 0 && h.talks === 0 && h.tiles === 0 && h.wings.size === 0 }))
    .sort((a, b) => b.active - a.active || b.entries - a.entries)
}

/** Panels grouped by what they are and where: a hall's exhibit across every hall ('hall'), a wing's
 *  across the elements sharing that wing ('wing:<id>'), else the place itself. */
export const panelGroup = place => {
  const [kind, , wing] = String(place).split(':')
  return kind === 'atrium' ? 'hall' : kind === 'wing' ? `wing:${wing}` : place
}

export function panelGroupsOf(readings) {
  const m = new Map()
  for (const r of readings) {
    const where = panelGroup(r.place)
    const key = `${where}|${r.id}`
    if (!m.has(key)) m.set(key, { key, id: r.id, where, places: new Set(), opened: 0, read: 0, skimmed: 0, unknown: 0, readMs: 0 })
    const g = m.get(key)
    g.opened++
    g.places.add(r.place)
    if (isRead(r)) {
      g.read++
      g.readMs += r.ms
    } else if (isSkim(r)) g.skimmed++
    else g.unknown++
  }
  return [...m.values()].map(g => ({ ...g, places: [...g.places], avgRead: g.read ? g.readMs / g.read : 0 })).sort((a, b) => b.opened - a.opened || b.read - a.read)
}

/** Worlds left with under QUICK_MS of active time, by place. */
export function quickExitsOf(stays) {
  const m = new Map()
  let n = 0
  for (const s of stays) {
    if (!isQuick(s)) continue
    n++
    bump(m, s.w)
  }
  return { n, of: stays.filter(s => s.w !== 'plaza' && !s.byTile).length, places: ranked(m).map(x => ({ w: x.key, n: x.n })) }
}

/** The main places (lab, forge, every wing) never entered in the period, and whether the hall each
 *  wing is reached from was entered (the arch was there to see). */
export function neverEnteredOf(visits) {
  const seen = new Set()
  for (const v of visits) {
    for (const s of v.stays) seen.add(s.w)
    for (const e of v.events) if (e.kind === 'enter' && typeof e.data.w === 'string') seen.add(e.data.w)
  }
  return MAIN_PLACES.filter(w => !seen.has(w)).map(w => {
    const [kind, symbol] = w.split(':')
    return { w, hall: kind === 'wing' ? `atrium:${symbol}` : null, hallEntered: kind === 'wing' ? seen.has(`atrium:${symbol}`) : null }
  })
}

/** Things to find and use, each with how often it was used (names.js featureName names them). */
export const FEATURES = [
  ['quiz', e => e.kind === 'quizopen'],
  ['facts', e => e.kind === 'fact'],
  ['talk', e => e.kind === 'talk'],
  ['tile', e => e.kind === 'tile'],
  ['find', e => e.kind === 'find' || (e.kind === 'drawer' && e.data.id === 'find')],
  ['families', e => e.kind === 'drawer' && e.data.id === 'families'],
  ['time', e => e.kind === 'drawer' && e.data.id === 'time'],
  ['trends', e => e.kind === 'drawer' && e.data.id === 'trends'],
  ['scientist', e => e.kind === 'level' && e.data.v === 'scientist'],
  ['first', e => e.kind === 'view' && e.data.v === 'first'],
  ['beam', e => e.kind === 'forge' && e.data.op === 'fire'],
  ['passport', e => /^\/passport/.test(e.path)],
  ['atomlings', e => /^\/atomlings/.test(e.path)],
]

export function featuresOf(events) {
  return FEATURES.map(([id, test]) => ({ id, n: events.filter(test).length }))
}

/** The plaza: elements picked on the table (and whether their halls were then entered), found with the
 *  search, and the card's facts clicked through. */
export function plazaOf(events, stays) {
  const picks = new Map()
  const finds = new Map()
  const facts = new Map()
  for (const e of events) {
    if (e.kind === 'sel' || e.kind === 'find') {
      const s = element(e.data.z)?.symbol
      if (s) bump(e.kind === 'sel' ? picks : finds, s)
    } else if (e.kind === 'fact') {
      const s = element(e.data.s)?.symbol ?? (str(e.data.s) || '?')
      if (!facts.has(s)) facts.set(s, { symbol: s, clicks: 0, seen: new Set([0]), n: 0 })
      const f = facts.get(s)
      f.clicks++
      f.seen.add(num(e.data.i))
      f.n = Math.max(f.n, num(e.data.n))
    }
  }
  const entered = new Set(stays.filter(s => s.w.startsWith('atrium:')).map(s => s.w.slice(7)))
  const pickList = ranked(picks).map(x => ({ symbol: x.key, n: x.n, entered: entered.has(x.key) }))
  return {
    picks: pickList,
    picked: [...picks.values()].reduce((a, b) => a + b, 0),
    pickedEntered: pickList.filter(p => p.entered).length,
    finds: ranked(finds).map(x => ({ symbol: x.key, n: x.n })),
    facts: [...facts.values()].map(f => ({ symbol: f.symbol, clicks: f.clicks, seen: Math.min(f.seen.size, f.n || f.seen.size), n: f.n })).sort((a, b) => b.clicks - a.clicks),
    factClicks: [...facts.values()].reduce((a, f) => a + f.clicks, 0),
  }
}

/** "Who am I?": opened, answered, right and wrong, clues used, rounds finished, elements missed. */
export function quizOf(events) {
  const answers = events.filter(e => e.kind === 'quiz')
  const right = answers.filter(e => e.data.ok === true)
  const missed = new Map()
  for (const e of answers) {
    if (e.data.ok === true) continue
    const s = element(e.data.z)?.symbol
    if (s) bump(missed, s)
  }
  const shown = answers.filter(e => num(e.data.clues) > 0)
  return {
    opened: events.filter(e => e.kind === 'quizopen').length,
    answers: answers.length,
    right: right.length,
    wrong: answers.length - right.length,
    clues: avg(shown.map(e => num(e.data.clues))),
    of: avg(shown.filter(e => num(e.data.of) > 0).map(e => num(e.data.of))),
    firstClue: right.filter(e => num(e.data.clues) === 1).length,
    wrongAfterAll: answers.filter(e => e.data.ok !== true && num(e.data.of) > 0 && num(e.data.clues) >= num(e.data.of)).length,
    rounds: answers.filter(e => num(e.data.n) >= 10).length,
    missed: ranked(missed).map(x => ({ symbol: x.key, n: x.n })),
  }
}

/** The Atom Forge: particles added and removed, beams fired, the heaviest element on the table,
 *  missions completed (in the order they were done). */
export function forgeOf(events, stays = []) {
  const acts = events.filter(e => e.kind === 'forge')
  const ops = new Map()
  const parts = { p: 0, n: 0, e: 0 }
  const removed = { p: 0, n: 0, e: 0 }
  const beams = new Map()
  let maxZ = 0
  for (const e of acts) {
    const op = str(e.data.op) || '?'
    bump(ops, op)
    const k = str(e.data.k)
    if (op === 'add' && k in parts) parts[k]++
    if (op === 'remove' && k in removed) removed[k]++
    if (op === 'fire') bump(beams, str(e.data.beam) || '?')
    // the event says what was on the table before the click
    const z = num(e.data.z) + (op === 'add' && k === 'p' ? 1 : 0)
    maxZ = Math.max(maxZ, Math.min(118, z))
  }
  const missions = []
  for (const e of events) {
    if (e.kind !== 'mission') continue
    const id = str(e.data.id)
    if (id && !missions.includes(id)) missions.push(id)
  }
  const forgeStays = stays.filter(s => s.w === 'forge')
  return {
    actions: acts.length,
    add: ops.get('add') ?? 0,
    remove: ops.get('remove') ?? 0,
    fire: ops.get('fire') ?? 0,
    parts,
    removed,
    beams: ranked(beams).map(x => ({ id: x.key, n: x.n })),
    maxZ,
    missions,
    entries: forgeStays.length,
    active: forgeStays.reduce((a, s) => a + s.act, 0),
  }
}

/** The plaza's drawers, and changes of level, view and language. */
export function toolsOf(events) {
  const drawers = new Map()
  const level = []
  const view = []
  const lang = []
  for (const e of events) {
    if (e.kind === 'drawer') bump(drawers, str(e.data.id) || '?')
    else if (e.kind === 'level') level.push(str(e.data.v))
    else if (e.kind === 'view') view.push(str(e.data.v))
    else if (e.kind === 'lang') lang.push(str(e.data.v))
  }
  const count = xs => ranked(xs.reduce((m, x) => bump(m, x), new Map())).map(x => ({ v: x.key, n: x.n }))
  return { drawers: ranked(drawers).map(x => ({ id: x.key, n: x.n })), level: count(level), view: count(view), lang: count(lang), levels: level.length, views: view.length, langs: lang.length }
}

/** Errors, grouped by message and source: how often, when, where and on which devices. */
export function errorsOf(visits) {
  const groups = new Map()
  for (const v of visits) {
    for (const e of v.events) {
      if (e.kind !== 'err') continue
      const m = str(e.data.m) || '(no message)'
      const s = str(e.data.s)
      const key = `${m}|${s}`
      if (!groups.has(key)) groups.set(key, { m, s, n: 0, first: e.at, last: e.at, places: new Set(), list: [] })
      const g = groups.get(key)
      g.n++
      g.first = Math.min(g.first, e.at)
      g.last = Math.max(g.last, e.at)
      g.places.add(placeOfPath(e.path))
      g.list.push({ at: e.at, visit: v.id, place: placeOfPath(e.path), label: v.label, kind: v.kind, browser: v.browser })
    }
  }
  return [...groups.values()].map(g => ({ ...g, places: [...g.places], devices: new Set(g.list.map(x => `${x.label ?? ''}|${x.kind ?? ''}|${x.browser ?? ''}`)).size })).sort((a, b) => b.last - a.last)
}

/** Kinds this dashboard does not know yet (telemetry.js may add some): counted, with the latest data. */
export function othersOf(events) {
  const m = new Map()
  for (const e of events) {
    if (KINDS.has(e.kind)) continue
    if (!m.has(e.kind)) m.set(e.kind, { kind: e.kind, n: 0, last: 0, sample: null })
    const o = m.get(e.kind)
    o.n++
    if (e.at >= o.last) {
      o.last = e.at
      o.sample = e.data
    }
  }
  return [...m.values()].sort((a, b) => b.n - a.n)
}

/** Signs of confusion in the order things happened: the same panel opened again soon after it closed,
 *  the level switched and switched back within a minute. */
export function confusionOf(visits) {
  let reopened = 0
  let flipped = 0
  const panels = new Map()
  for (const v of visits) {
    const rs = v.readings
    for (let i = 1; i < rs.length; i++) {
      const a = rs[i - 1]
      const b = rs[i]
      if (a.id === b.id && a.place === b.place && !a.est && b.at - (a.at + a.ms) < 30000) {
        reopened++
        bump(panels, `${a.place}|${a.id}`)
      }
    }
    const levels = v.events.filter(e => e.kind === 'level')
    for (let i = 1; i < levels.length; i++) if (levels[i].at - levels[i - 1].at < 60000 && levels[i].data.v !== levels[i - 1].data.v) flipped++
  }
  return { reopened, flipped, panels: ranked(panels).map(x => ({ place: x.key.split('|')[0], id: x.key.split('|').slice(1).join('|'), n: x.n })) }
}

/** A visit in a line for the visits list: when, who, on what, how long, how much was active. */
export function visitSummary(v) {
  const places = new Set(v.stays.filter(s => s.w !== 'plaza').map(s => s.w))
  return { id: v.id, start: v.start, end: v.end, label: v.label, kind: v.kind, browser: v.browser, ms: Math.max(0, v.end - v.start), active: v.active, places: places.size, errors: v.errors, events: v.events.length }
}
