// Today's element (the user, 2026-11-09: "Artur already is hooked on duolingo's streaks"): one element a
// day, the same for the whole family, a lesson of about three minutes about it and two elements met
// before, a streak of days in a row with freezes for a day missed, and tomorrow's element as a mystery
// with two clues to guess from. Pure: the days are kept by engine/progress.js (ew-daily, in the account
// too), the HUD is ui/DailyHud.jsx, the words are the locale files' daily.* and the elements' own
// (src/content). docs/knowledge/daily.md.
import { ELEMENTS, FAMILIES, element, nameOf } from '../data/elements.js'
import { KID_POOL } from './quiz.js'
import { isMetal } from '../chem/atom.js'

// ---- days ----

const pad = n => String(n).padStart(2, '0')
const DAY_MS = 86400000

/** A day as the device's calendar has it, 'YYYY-MM-DD' (the family plays in one time zone). */
export const dayOf = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const isDay = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
const utc = day => Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))

export function addDays(day, n) {
  const t = new Date(utc(day) + n * DAY_MS)
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`
}

export const daysBetween = (a, b) => Math.round((utc(b) - utc(a)) / DAY_MS)

/** Monday 0 to Sunday 6. */
export const weekdayOf = day => (new Date(utc(day)).getUTCDay() + 6) % 7

// ---- chance, the same for everyone on a day ----

function hash(text) {
  let h = 2166136261
  for (const c of String(text)) h = Math.imul(h ^ c.codePointAt(0), 16777619)
  return h >>> 0
}

/** Random numbers that come out the same for the same words (mulberry32). */
export function seeded(text) {
  let a = hash(text) || 1
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, rng) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const pickOne = (list, rng) => list[Math.floor(rng() * list.length)]

// ---- which element on which day ----

/** The first day (the feature's), whose element is the first of the cycle. */
export const EPOCH = '2026-11-09'
/** The first week: the halls with picture boards and rooms, where "visit the hall" shows the most. */
export const FIRST_WEEK = ['C', 'Na', 'O', 'Fe', 'H', 'Si', 'Kr']

/** Lists merged so that each one's items are spread evenly through the whole ([offset] of each list
 *  says where in its share its first item falls: later for the superheavies). */
function spread(lists) {
  return lists
    .flatMap(([items, offset], g) => items.map((s, i) => ({ s, at: (i + offset) / items.length, g })))
    .sort((a, b) => a.at - b.at || a.g - b.g)
    .map(x => x.s)
}

/** The days' order, 151 long and then again: the first week, then the well-known elements (the quiz's
 *  Explorer pool) twice and every other element once, spread evenly, so about every other day is one a
 *  ten-year-old has heard of. A known element's second day is the first one's list turned by half, so
 *  the two are five weeks apart or more. The others are spread by kind (lanthanides, actinides, the
 *  superheavies, whose lessons have the least to tell, the rest), so no kind comes in a cluster. */
function buildCycle() {
  const rng = seeded('element-worlds:daily')
  const known = shuffle(KID_POOL.filter(s => !FIRST_WEEK.includes(s)), rng)
  const half = Math.floor(known.length / 2)
  const k = [...known, ...known.slice(half), ...known.slice(0, half)]
  const others = ELEMENTS.filter(e => !KID_POOL.includes(e.symbol))
  const kind = e => (e.z >= 104 ? 'super' : e.family === 'lanthanide' || e.family === 'actinide' ? e.family : 'rest')
  const group = id => shuffle(others.filter(e => kind(e) === id).map(e => e.symbol), rng)
  const o = spread([[group('rest'), 0.3], [group('lanthanide'), 0.5], [group('actinide'), 0.6], [group('super'), 0.85]])
  const total = k.length + o.length
  const rest = []
  let ki = 0
  let oi = 0
  for (let i = 0; i < total; i++) {
    const want = Math.round(((i + 1) * k.length) / total)
    if (ki < k.length && (ki < want || oi >= o.length)) rest.push(k[ki++])
    else rest.push(o[oi++])
  }
  return [...FIRST_WEEK, ...rest]
}
export const CYCLE = buildCycle()

/** The element of a day (its symbol): the same for everyone. */
export function elementOfDay(day) {
  const n = CYCLE.length
  return CYCLE[(((daysBetween(EPOCH, day)) % n) + n) % n]
}

// ---- the streak ----

export const START_FREEZES = 1 // given with the first lesson
export const MAX_FREEZES = 2
export const EARN_EVERY = 7 // a freeze more at every seventh day of a streak
export const MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 250, 300, 365, 500, 1000]

/** The days done before or on a day, as a set of 'YYYY-MM-DD'. */
const doneDays = (days, today) => new Set(Object.keys(days ?? {}).filter(d => isDay(d) && d <= today))

/**
 * The streak on a day, worked out again from the days a lesson was done (so two devices' days only need
 * joining): days in a row, a day missed kept by a freeze (spent), freezes held (one to start, one more
 * at every seventh day of a streak, two at most), the best streak, the days frozen, and the last streak
 * lost ({ n, on }).
 */
export function streakOf(days, today) {
  const done = doneDays(days, today)
  const sorted = [...done].sort()
  const out = { streak: 0, best: 0, freezes: START_FREEZES, frozen: [], doneToday: done.has(today), lost: null, total: done.size }
  if (!sorted.length) return out
  let { streak, freezes, best } = out
  for (let d = sorted[0]; d <= today; d = addDays(d, 1)) {
    if (done.has(d)) {
      streak++
      best = Math.max(best, streak)
      if (streak % EARN_EVERY === 0 && freezes < MAX_FREEZES) freezes++
    } else if (d === today) {
      // today is still open
    } else if (streak > 0 && freezes > 0) {
      freezes--
      out.frozen.push(d)
    } else if (streak > 0) {
      out.lost = { n: streak, on: d }
      streak = 0
    }
  }
  return { ...out, streak, best, freezes }
}

/** Whether a streak just reached is one to celebrate. */
export const isMilestone = n => MILESTONES.includes(n)

/** The week (Monday to Sunday) a day is in, each day with what happened: done (perfect when every first
 *  answer was right), frozen, missed, today, coming, or none (before the first lesson). */
export function weekOf(days, today) {
  const st = streakOf(days, today)
  const frozen = new Set(st.frozen)
  const first = Object.keys(days ?? {}).filter(isDay).sort()[0] ?? null
  const monday = addDays(today, -weekdayOf(today))
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i)
    const d = days?.[day]
    let state
    if (d && day <= today) state = 'done'
    else if (day === today) state = 'today'
    else if (day > today) state = 'coming'
    else if (frozen.has(day)) state = 'frozen'
    else if (first && day > first) state = 'missed'
    else state = 'none'
    return { day, state, perfect: !!d && d.n > 0 && d.r >= d.n }
  })
}

// ---- remembering: boxes that space the elements out ----

/** Days until an element comes back, by its box: right answers move it up a box, a wrong one to the first. */
export const INTERVALS = [1, 2, 4, 8, 16]

export function answered(boxes, symbol, ok, today, at = Date.now()) {
  const b = ok ? Math.min(INTERVALS.length, (boxes?.[symbol]?.b ?? 0) + 1) : 1
  return { ...boxes, [symbol]: { b, d: addDays(today, INTERVALS[b - 1]), at } }
}

/** The elements due on a day, the most overdue first. */
export function dueOn(boxes, today) {
  return Object.entries(boxes ?? {})
    .filter(([s, v]) => element(s) && isDay(v?.d) && v.d <= today)
    .sort(([, a], [, b]) => a.d.localeCompare(b.d) || a.b - b.b)
    .map(([s]) => s)
}

/** The elements a player has met: the halls with something discovered (discovery keys like "C:atom"). */
export function metFrom(found) {
  const out = []
  for (const k of found ?? []) {
    const s = String(k).split(':')[0]
    if (/^[A-Z][a-z]{0,2}$/.test(s) && element(s) && !out.includes(s)) out.push(s)
  }
  return out
}

/** The elements to go over again: those due first, then ones met but never asked about, then new ones
 *  from the level's pool. */
export function reviewsFor({ boxes, met, today, symbol, avoid = [], level, n = 2, rng = Math.random }) {
  const out = []
  const add = s => {
    if (out.length < n && s && s !== symbol && !avoid.includes(s) && !out.includes(s) && element(s)) out.push(s)
  }
  dueOn(boxes, today).forEach(add)
  const fresh = list => shuffle(list.filter(s => !(s in (boxes ?? {}))), rng)
  fresh(met ?? []).forEach(add)
  fresh(level === 'scientist' ? ELEMENTS.map(e => e.symbol) : KID_POOL).forEach(add)
  return out
}

// ---- the questions ----

const z0 = e => e.z
const known = el => !el.statePredicted
const neighbours = el =>
  [
    [el.period, el.group - 1], [el.period, el.group + 1], [el.period - 1, el.group], [el.period + 1, el.group],
    [el.period, el.group - 2], [el.period, el.group + 2],
  ]
    .map(([p, g]) => ELEMENTS.find(e => e.period === p && e.group === g && e.group))
    .filter(Boolean)
const meltOk = e => e.melt != null && e.sublimes == null && known(e)

/** The distractors for "which is its symbol?": letters of its name (accents off), real symbols that start
 *  like it among them (sodium: S, So, Sd, Na). */
function symbolOptions(el, name, rng) {
  const plain = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[łŁ]/g, 'l').replace(/[^A-Za-z]/g, '')
  const cap = s => s[0].toUpperCase() + s.slice(1).toLowerCase()
  const fakes = new Set()
  for (let i = 1; i < plain.length; i++) fakes.add(cap(plain[0] + plain[i]))
  fakes.add(cap(plain[0]))
  for (const e of ELEMENTS) if (e.symbol[0] === el.symbol[0] || e.symbol[0] === cap(plain[0])) fakes.add(e.symbol)
  fakes.delete(el.symbol)
  const real = shuffle([...fakes].filter(s => element(s)), rng)
  const made = shuffle([...fakes].filter(s => !element(s)), rng)
  const pick = [...real.slice(0, 1), ...made.slice(0, 2)]
  for (const s of [...real.slice(1), ...made.slice(2)]) if (pick.length < 3) pick.push(s)
  return shuffle([el.symbol, ...pick.slice(0, 3)], rng)
}

/** The era of an element's discovery. */
export function eraOf(el) {
  if (el.ancient) return 'ancient'
  const y = el.discovered
  if (y == null) return null
  return y < 1700 ? 'y1700' : y < 1800 ? 'y1700s' : y < 1900 ? 'y1800s' : y < 2000 ? 'y1900s' : 'y2000'
}
export const ERAS = ['ancient', 'y1700', 'y1700s', 'y1800s', 'y1900s', 'y2000']

/** The yes-or-no facts an element has, each with its answer. */
function truths(el) {
  const out = []
  if (el.state !== 'gas' && known(el) && el.density != null) out.push({ fact: 'dense', answer: el.density < 1 })
  if (el.family !== 'metalloid') out.push({ fact: 'metal', answer: isMetal(el) })
  out.push({ fact: 'radio', answer: !!el.radioactive })
  if (eraOf(el)) out.push({ fact: 'ancient', answer: !!el.ancient })
  return out
}

/** Two elements to compare by a measure: a neighbour in the table that has it too. */
function comparing(el, what, rng) {
  const has = {
    mass: e => e.mass != null,
    melt: meltOk,
    en: e => e.en != null,
    radius: e => e.radius?.atomic != null,
    density: e => e.density != null && e.state !== 'gas' && known(e),
  }[what]
  if (!has(el)) return null
  const value = { mass: e => e.mass, melt: e => e.melt, en: e => e.en, radius: e => e.radius.atomic, density: e => e.density }[what]
  const near = neighbours(el).filter(e => has(e) && value(e) !== value(el))
  if (!near.length) return null
  const other = pickOne(near, rng)
  const answer = value(other) > value(el) ? other.z : el.z
  return { kind: 'compare', what, options: shuffle([el.z, other.z], rng), answer, z: el.z, other: other.z, row: other.period === el.period }
}

const usesOf = (content, sci) => {
  const u = content?.uses?.en
  return (sci ? u?.sci : null) ?? u?.kid ?? []
}

const BUILD = {
  state: el => (known(el) && el.state ? { kind: 'state', z: el.z, options: ['solid', 'liquid', 'gas'], answer: el.state } : null),
  family: (el, { rng }) => {
    const others = shuffle(FAMILIES.map(f => f.id).filter(f => f !== el.family), rng).slice(0, 3)
    return { kind: 'family', z: el.z, options: shuffle([el.family, ...others], rng), answer: el.family }
  },
  protons: (el, { rng }) => {
    const near = shuffle([-2, -1, 1, 2, 3].map(d => el.z + d).filter(n => n >= 1 && n <= 118), rng).slice(0, 3)
    return { kind: 'protons', z: el.z, options: [el.z, ...near].sort((a, b) => a - b), answer: el.z }
  },
  symbol: (el, { rng, lang }) => ({ kind: 'symbol', z: el.z, options: symbolOptions(el, nameOf(el, lang), rng), answer: el.symbol }),
  // one of its uses among two of other families' (an option is "z:i", the i-th use of element z)
  use: (el, { rng, sci, contentOf, usesPool }) => {
    const mine = usesOf(contentOf(el.symbol), sci)
    if (!mine.length) return null
    const others = shuffle(usesPool.filter(s => s !== el.symbol && element(s).family !== el.family && usesOf(contentOf(s), sci).length), rng).slice(0, 2)
    if (others.length < 2) return null
    const answer = `${el.z}:${Math.floor(rng() * mine.length)}`
    const wrong = others.map(s => `${element(s).z}:${Math.floor(rng() * usesOf(contentOf(s), sci).length)}`)
    return { kind: 'use', z: el.z, options: shuffle([answer, ...wrong], rng), answer }
  },
  truth: (el, { rng }) => {
    const all = truths(el)
    const yes = all.filter(t => t.answer && t.fact !== 'metal')
    // the surprising "yes" when there is one (it floats, it is radioactive, it was known in antiquity), else any
    const t = yes.length && rng() < 0.6 ? pickOne(yes, rng) : pickOne(all, rng)
    return t ? { kind: 'truth', z: el.z, fact: t.fact, options: ['yes', 'no'], answer: t.answer ? 'yes' : 'no' } : null
  },
  compare: (el, { rng, sci }) => {
    for (const what of shuffle(sci ? ['en', 'radius', 'melt'] : ['mass', 'melt', 'density'], rng)) {
      const q = comparing(el, what, rng)
      if (q) return q
    }
    return null
  },
  year: (el, { rng }) => {
    const era = eraOf(el)
    if (!era) return null
    const others = shuffle(ERAS.filter(e => e !== era), rng).slice(0, 3)
    return { kind: 'year', z: el.z, options: ERAS.filter(e => e === era || others.includes(e)), answer: era }
  },
  config: (el, { rng }) => {
    if (el.configPredicted) return null
    const near = shuffle([el.z - 1, el.z + 1, el.z - 2, el.z + 2, ...neighbours(el).map(z0)].filter(z => z >= 1 && z <= 118 && z !== el.z && !ELEMENTS[z - 1].configPredicted && ELEMENTS[z - 1].config !== el.config), rng)
    const options = [...new Set(near)].slice(0, 3)
    if (options.length < 3) return null
    return { kind: 'config', z: el.z, options: shuffle([el.z, ...options], rng), answer: el.z }
  },
}

const KID_KINDS = ['state', 'family', 'truth', 'protons', 'symbol', 'use', 'compare']
const SCI_KINDS = ['config', 'year', 'compare', 'use', 'family', 'truth', 'state']

/** Four elements to choose from: the answer, one of its family when there is one, two from the pool. */
export function optionsFor(el, pool, rng) {
  const others = pool.map(s => element(s)).filter(e => e && e.z !== el.z)
  const kin = others.filter(e => e.family === el.family)
  const out = [el.z]
  if (kin.length) out.push(pickOne(kin, rng).z)
  for (const e of shuffle(others, rng)) if (out.length < 4 && !out.includes(e.z)) out.push(e.z)
  return shuffle(out, rng)
}

/** A question about an element met before: who it is from clues, where it lives, its symbol, its family. */
function reviewQuestion(el, ctx) {
  const { rng, sci, pool } = ctx
  const r = rng()
  if (r < 0.5) return { kind: 'who', z: el.z, seed: Math.floor(rng() * 1e6), options: optionsFor(el, pool, rng), answer: el.z }
  if (r < 0.75) return { kind: 'find', z: el.z, hint: !sci, answer: el.z }
  return (!sci && r < 0.88 ? BUILD.symbol(el, ctx) : BUILD.family(el, ctx))
}

/** The elements whose own words a lesson needs loaded (src/content): the day's, the reviews', tomorrow's
 *  and the pool the uses' distractors come from. */
export function lessonNeeds({ day, level, boxes, met, practice = false }) {
  const plan = planOf({ day, level, boxes, met, practice })
  return [...new Set([plan.symbol, ...plan.reviews, plan.tomorrow, ...plan.pool])]
}

function planOf({ day, level, boxes, met, practice }) {
  const rng = seeded(`${day}:${level}:${practice ? 'practice' : 'lesson'}`)
  const symbol = elementOfDay(day)
  const tomorrow = elementOfDay(addDays(day, 1))
  const sci = level === 'scientist'
  const pool = shuffle(sci ? ELEMENTS.map(e => e.symbol) : KID_POOL, seeded(`${day}:pool`)).filter(s => s !== symbol && s !== tomorrow).slice(0, 8)
  const reviews = reviewsFor({ boxes, met, today: day, symbol, avoid: [tomorrow], level, n: practice ? 5 : 2, rng })
  return { rng, symbol, tomorrow, sci, pool, reviews }
}

/**
 * The day's lesson: find the element in the table, three questions about it, then the elements to go
 * over again (practice: five of those and nothing else). Every step is { id, kind, z, options, answer,
 * today | review } and the HUD words it (DailyHud.jsx). contentOf(symbol) gives an element's own words
 * once loaded (lessonNeeds says which).
 */
export function makeLesson({ day, level, boxes = {}, met = [], lang = 'en', contentOf = () => null, practice = false }) {
  const { rng, symbol, tomorrow, sci, pool, reviews } = planOf({ day, level, boxes, met, practice })
  const el = element(symbol)
  const ctx = { rng, sci, lang, contentOf, pool: sci ? ELEMENTS.map(e => e.symbol) : KID_POOL, usesPool: pool }
  const steps = []
  if (!practice) {
    steps.push({ kind: 'find', z: el.z, hint: !sci, answer: el.z, today: true })
    for (const k of shuffle(sci ? SCI_KINDS : KID_KINDS, rng)) {
      if (steps.length >= 4) break
      const q = BUILD[k](el, ctx)
      if (q) steps.push({ ...q, today: true })
    }
  }
  for (const s of reviews) steps.push({ ...reviewQuestion(element(s), ctx), review: true })
  return { day, symbol, z: el.z, tomorrow, practice, steps: steps.map((s, id) => ({ id, ...s })), reviews }
}

/** Tomorrow's element as a mystery: the same clues and choices for everyone at a level (seeded by the
 *  day), so the family can argue about it before it comes. */
export function mysteryFor(day, level) {
  const tomorrow = addDays(day, 1)
  const symbol = elementOfDay(tomorrow)
  const el = element(symbol)
  const rng = seeded(`${tomorrow}:${level}:mystery`)
  const pool = level === 'scientist' ? ELEMENTS.map(e => e.symbol) : KID_POOL
  return { day: tomorrow, z: el.z, seed: Math.floor(rng() * 1e6), options: optionsFor(el, pool, rng), answer: el.z }
}

// ---- what is kept (ew-daily) ----

/** The kept state, made safe: { days: { day: { s, r, n, at } }, boxes: { symbol: { b, d, at } },
 *  guess: { day: z } } (the guess is for the mystery of that day). */
export function normalDaily(raw) {
  const out = { days: {}, boxes: {}, guess: {} }
  if (!raw || typeof raw !== 'object') return out
  for (const [d, v] of Object.entries(raw.days ?? {})) {
    if (isDay(d) && v && typeof v === 'object') out.days[d] = { s: String(v.s ?? ''), r: Number(v.r) || 0, n: Number(v.n) || 0, at: Number(v.at) || 0 }
  }
  for (const [s, v] of Object.entries(raw.boxes ?? {})) {
    if (element(s) && v && isDay(v.d)) out.boxes[s] = { b: Math.min(INTERVALS.length, Math.max(1, Number(v.b) || 1)), d: v.d, at: Number(v.at) || 0 }
  }
  for (const [d, z] of Object.entries(raw.guess ?? {})) if (isDay(d) && Number(z) >= 1 && Number(z) <= 118) out.guess[d] = Number(z)
  return out
}

/** A lesson done: the day counted (not for practice) with its right first answers, and every element in
 *  it moved up a box if all its first answers were right, else back to the first. */
export function finishLesson(state, { day, symbol, results, practice = false }, at = Date.now()) {
  const s = normalDaily(state)
  const per = new Map()
  for (const r of results) per.set(r.about, (per.get(r.about) ?? true) && !!r.ok)
  let boxes = s.boxes
  for (const [sym, ok] of per) boxes = answered(boxes, sym, ok, day, at)
  const days = practice || s.days[day] ? s.days : { ...s.days, [day]: { s: symbol, r: results.filter(r => r.ok).length, n: results.length, at } }
  return { ...s, days, boxes }
}

/** A guess at a day's mystery element (the guesses of the last 60 days are kept). */
export function guessMystery(state, day, z) {
  const s = normalDaily(state)
  const guess = Object.fromEntries(Object.entries({ ...s.guess, [day]: z }).sort(([a], [b]) => a.localeCompare(b)).slice(-60))
  return { ...s, guess }
}
