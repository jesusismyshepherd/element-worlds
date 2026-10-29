// What the player has discovered (a station read, an exhibit tried), kept on the device: keys like
// "C:identity" or "O:air:candle". A small game for Artur: every world counts its discoveries.
// With the quiz's records (ew-quiz-best) and the names written in the neon workshop (ew-neon-name:<Sym>)
// it is the player's progress, which a signed-in account keeps too (src/net/account.js): snapshot()
// gives it all, adopt() takes the account's back, clearProgress() empties the device at sign-out.
import { play } from '../audio/sound.js'

const KEY = 'ew-found'
const QUIZ = 'ew-quiz-best'
const NEON = 'ew-neon-name:'

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

let found = load()
const listeners = new Set()

export const isFound = key => found.has(key)

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

/** Everything the player has gathered on this device: discoveries, quiz records, neon names. */
export function snapshot() {
  const quiz = safe(() => JSON.parse(localStorage.getItem(QUIZ) ?? '{}'), {}) ?? {}
  const neon = {}
  safe(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(NEON)) neon[k.slice(NEON.length)] = localStorage.getItem(k)
    }
  })
  return {
    found: [...found].sort(),
    quiz: Object.fromEntries(Object.entries(quiz).filter(([, v]) => Number.isFinite(Number(v))).map(([k, v]) => [k, Number(v)])),
    neon,
  }
}

/** Does this progress hold anything worth keeping? */
export const hasProgress = p => !!p && (p.found?.length > 0 || Object.keys(p.quiz ?? {}).length > 0 || Object.keys(p.neon ?? {}).length > 0)

/** Take an account's progress as this device's (the account's is the device's and more, once merged). */
export function adopt(p) {
  if (!p) return
  found = new Set(Array.isArray(p.found) ? p.found : [])
  safe(() => localStorage.setItem(KEY, JSON.stringify([...found])))
  if (p.quiz && typeof p.quiz === 'object') safe(() => localStorage.setItem(QUIZ, JSON.stringify(p.quiz)))
  for (const [sym, name] of Object.entries(p.neon ?? {})) {
    if (typeof name === 'string') safe(() => localStorage.setItem(NEON + sym, name))
  }
}

/** Empty the device's progress (a sign-out: the account keeps it, the next player starts fresh). */
export function clearProgress() {
  found = new Set()
  safe(() => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k === KEY || k === QUIZ || k?.startsWith(NEON)) keys.push(k)
    }
    keys.forEach(k => localStorage.removeItem(k))
  })
}
