// What the player has discovered (a station read, an exhibit tried), kept on the device: keys like
// "C:identity" or "O:air:candle". A small game for Artur: every world counts its discoveries.
// With the quiz's records (ew-quiz-best) and the player's own state of each world (ew-world:<path>: the
// balloons let go, the word on the neon wall; src/net/shared.js) it is the player's progress, which a
// signed-in account keeps too (src/net/account.js): snapshot() gives it all, adopt() takes the
// account's back, clearProgress() empties the device at sign-out. The names once kept on their own
// (ew-neon-name:<Sym>) move into their workshop's world state. Today's element keeps its days, boxes and
// guesses in ew-daily (src/game/daily.js; the streak is worked out from the days).
import { play } from '../audio/sound.js'
import { normalDaily } from '../game/daily.js'

const KEY = 'ew-found'
const QUIZ = 'ew-quiz-best'
const NEON = 'ew-neon-name:'
const WORLD = 'ew-world:'
const DAILY = 'ew-daily'

const safe = (f, fallback = null) => {
  try {
    return f()
  } catch {
    return fallback
  }
}

function load() {
  return new Set(safe(() => JSON.parse(localStorage.getItem(KEY) ?? '[]'), []))
}

/** The player's own state of a world: { at (ms), parts: { id: state } }, or null. */
export function worldState(path) {
  return safe(() => {
    const v = JSON.parse(localStorage.getItem(WORLD + path) ?? 'null')
    return v && typeof v === 'object' && v.parts && typeof v.parts === 'object' ? v : null
  })
}

/** Keep the player's own state of a world. */
export function keepWorldState(path, parts) {
  safe(() => localStorage.setItem(WORLD + path, JSON.stringify({ at: Date.now(), parts })))
}

/** A neon name kept the old way (its own key, or an older account's `neon`): into its workshop's world
 *  state, unless that has a word already. */
function fromNeon(sym, raw) {
  const v = safe(() => JSON.parse(raw))
  if (!/^[A-Z][a-z]?$/.test(sym) || !v || typeof v.text !== 'string') return
  const path = `/e/${sym}/signs`
  const ws = worldState(path) ?? { at: 0, parts: {} }
  if (ws.parts.name) return
  ws.parts.name = { text: v.text, gas: v.gas }
  safe(() => localStorage.setItem(WORLD + path, JSON.stringify(ws)))
}

function migrateNeon() {
  safe(() => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(NEON)) keys.push(k)
    }
    for (const k of keys) {
      fromNeon(k.slice(NEON.length), localStorage.getItem(k))
      localStorage.removeItem(k)
    }
  })
}
migrateNeon()

let found = load()
const listeners = new Set()
const restored = new Set()

/** Called when the whole progress was replaced (an account's came in at a sign-in, or a sign-out
 *  emptied the device): the world on show and the passport redraw their marks and counts (the user,
 *  2026-10-29: signed in on a second phone, the score showed only after a reload). */
export function onRestore(f) {
  restored.add(f)
  return () => restored.delete(f)
}

const announce = () => {
  for (const f of restored) f()
}

export const isFound = key => found.has(key)

/** Every discovery key (the halls met: today's element goes over them again). */
export const foundKeys = () => [...found]

export function markFound(key) {
  if (found.has(key)) return false
  found.add(key)
  play('discover')
  safe(() => localStorage.setItem(KEY, JSON.stringify([...found])))
  for (const f of listeners) f(key)
  return true
}

/** How many of these keys are found. */
export const countFound = keys => keys.filter(k => found.has(k)).length

/** Called after each new discovery (the account saves it). */
export function onProgress(f) {
  listeners.add(f)
  return () => listeners.delete(f)
}

export function resetFound() {
  found = new Set()
  safe(() => localStorage.removeItem(KEY))
}

const dailyListeners = new Set()
const dailyChanged = () => {
  for (const f of dailyListeners) f()
}

/** Today's element's kept state: { days, boxes, guess } (game/daily.js normalDaily). */
export const dailyState = () => normalDaily(safe(() => JSON.parse(localStorage.getItem(DAILY) ?? 'null')))

/** Keep it, and let the account save it soon (as after a discovery). */
export function keepDaily(state) {
  safe(() => localStorage.setItem(DAILY, JSON.stringify(normalDaily(state))))
  dailyChanged()
  for (const f of listeners) f('daily')
}

/** Called when today's element's state changed (a lesson done, a guess, an account's days come in). */
export function onDaily(f) {
  dailyListeners.add(f)
  return () => dailyListeners.delete(f)
}

/** Everything the player has gathered on this device: discoveries, quiz records, their own worlds, the days
 *  of today's element. */
export function snapshot() {
  const quiz = safe(() => JSON.parse(localStorage.getItem(QUIZ) ?? '{}'), {}) ?? {}
  const worlds = {}
  safe(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(WORLD)) {
        const ws = worldState(k.slice(WORLD.length))
        if (ws) worlds[k.slice(WORLD.length)] = ws
      }
    }
  })
  const daily = dailyState()
  return {
    found: [...found].sort(),
    quiz: Object.fromEntries(Object.entries(quiz).filter(([, v]) => Number.isFinite(Number(v))).map(([k, v]) => [k, Number(v)])),
    worlds: Object.fromEntries(Object.keys(worlds).sort().map(k => [k, worlds[k]])),
    daily: {
      days: Object.fromEntries(Object.keys(daily.days).sort().map(k => [k, daily.days[k]])),
      boxes: Object.fromEntries(Object.keys(daily.boxes).sort().map(k => [k, daily.boxes[k]])),
      guess: Object.fromEntries(Object.keys(daily.guess).sort().map(k => [k, daily.guess[k]])),
    },
  }
}

/** Does this progress hold anything worth keeping? */
export const hasProgress = p =>
  !!p && (p.found?.length > 0 || Object.keys(p.quiz ?? {}).length > 0 || Object.keys(p.worlds ?? {}).length > 0 || Object.keys(p.daily?.days ?? {}).length > 0)

/** Take an account's progress as this device's (the account's is the device's and more, once merged). */
export function adopt(p) {
  if (!p) return
  const before = JSON.stringify(snapshot())
  found = new Set(Array.isArray(p.found) ? p.found : [])
  safe(() => localStorage.setItem(KEY, JSON.stringify([...found])))
  if (p.quiz && typeof p.quiz === 'object') safe(() => localStorage.setItem(QUIZ, JSON.stringify(p.quiz)))
  for (const [path, ws] of Object.entries(p.worlds ?? {})) {
    if (path.startsWith('/') && ws && typeof ws === 'object' && ws.parts && typeof ws.parts === 'object') safe(() => localStorage.setItem(WORLD + path, JSON.stringify(ws)))
  }
  for (const [sym, name] of Object.entries(p.neon ?? {})) if (typeof name === 'string') fromNeon(sym, name)
  // (an account saved by an older server has no daily: the device's stays)
  if (p.daily && typeof p.daily === 'object') safe(() => localStorage.setItem(DAILY, JSON.stringify(normalDaily(p.daily))))
  if (JSON.stringify(snapshot()) !== before) {
    announce()
    dailyChanged()
  }
}

/** Empty the device's progress (a sign-out: the account keeps it, the next player starts fresh). */
export function clearProgress() {
  found = new Set()
  safe(() => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k === KEY || k === QUIZ || k === DAILY || k?.startsWith(NEON) || k?.startsWith(WORLD)) keys.push(k)
    }
    keys.forEach(k => localStorage.removeItem(k))
  })
  announce()
  dailyChanged()
}
