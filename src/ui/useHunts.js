// The treasure hunts for the HUD (game/hunts.js; docs/knowledge/hunts.md): their state, kept as the player's
// own state of the pseudo-world '/hunts' (engine/progress.js keepWorldState: on the device, and in the account
// with every world's state, where ew_save_progress keeps the newer one); when an account's progress comes in
// it is joined with this device's track by track (mergeHunts), and a sign-out empties it. The watcher
// follows the store (the world on show, the exhibit whose panel is open) and moves the hunt on; the time a
// hunt takes is counted while the page is on show and in use. The card (HuntCard.jsx), the plaza's sheet
// (HuntHud.jsx), the dock and the passport read it all through useHunts().
import { useEffect, useState, useSyncExternalStore } from 'react'
import { worldState, keepWorldState, onRestore } from '../engine/progress.js'
import { TRACKS, HUNTS_PATH, normalHunts, mergeHunts, startTrack, stopHunt, advance, addTime, placeOf, keysOfPlace, currentClue } from '../game/hunts.js'
import { track } from '../net/telemetry.js'
import { account } from '../net/account.js'
import { play } from '../audio/sound.js'

const IDLE_MS = 60000 // no touch for this long: the hunt's clock waits
const FLUSH_MS = 60000 // the time counted is kept at least this often (and at each clue, a stop, the page hidden)

let state = normalHunts(worldState(HUNTS_PATH)?.parts)
// the last thing that happened, for the card: { kind: 'start' | 'clue' | 'done', track, step, at, spent?,
// best?, newBest?, first?, seen } (seen: the card has moved on from it to the next clue)
let news = null
let open = true // the card unfolded; folded it is its chip
let hintAt = Date.now() // when the clue on show came: its hints are offered HINT_AFTER_MS later
let snap = { state, news, open, hintAt }
const subs = new Set()
const emit = () => {
  snap = { state, news, open, hintAt }
  for (const f of subs) f()
}

function keep(next, n = news) {
  state = next
  news = n
  keepWorldState(HUNTS_PATH, state)
  emit()
}

// ---- the time a hunt takes: counted while it is on, the page is on show and someone touched it lately ----
let pending = 0
let lastInput = Date.now()
const takeTime = () => {
  const ms = pending
  pending = 0
  return ms
}
function flushTime() {
  const ms = takeTime()
  if (ms && state.on) keep(addTime(state, ms))
}
if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'keydown', 'wheel', 'touchstart']) addEventListener(ev, () => (lastInput = Date.now()), { passive: true, capture: true })
  setInterval(() => {
    if (!state.on || document.visibilityState !== 'visible' || Date.now() - lastInput > IDLE_MS) return
    pending += 1000
    if (pending >= FLUSH_MS) flushTime()
  }, 1000)
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flushTime())
}

// an account's progress came in (a sign-in), or the device was emptied (a sign-out)
onRestore(() => {
  const kept = worldState(HUNTS_PATH)?.parts
  if (!kept) {
    pending = 0
    state = normalHunts(null)
    news = null
    emit()
    return
  }
  const theirs = normalHunts(kept)
  const merged = mergeHunts(state, theirs)
  if (JSON.stringify(merged) === JSON.stringify(theirs)) {
    state = theirs
    emit()
  } else keep(merged) // this device had a track further on: the account gets it at its next save
})

// ---- the watcher ----
let watching = null

/** Follow the store: each new place (a world entered, an exhibit's panel opened) is tried on the clue to
 *  find now. A panel's exhibit is set a frame after the panel itself (player.keepReading), so the place is
 *  read a moment after the store last changed. Started once, by Hud.jsx. */
export function watchHunts(store) {
  if (watching) return watching
  let last = null
  let timer = null
  const check = () => {
    timer = null
    if (!state.on) {
      last = null
      return
    }
    const place = placeOf(store.get())
    const key = keysOfPlace(place).join('|')
    if (!place || key === last) return
    last = key
    const now = Date.now()
    if (!advance(state, place, now).event) return
    const before = state.tracks[state.on]
    const r = advance(addTime(state, takeTime()), place, now)
    const e = r.event
    const after = r.state.tracks[e.track]
    hintAt = now
    open = true
    keep(r.state, {
      ...e,
      at: now,
      seen: false,
      ...(e.kind === 'done' ? { best: after.best, newBest: before.best != null && e.spent > 0 && e.spent < before.best, first: after.done === 1 } : {}),
    })
    play(e.kind === 'done' ? 'celebrate' : 'right')
    track('hunt', { op: e.kind, id: e.track, step: e.step, ...(e.kind === 'done' ? { ms: e.spent } : {}) })
    // (the account saves its worlds every 15 s; a clue found goes now)
    account.save()
  }
  const unsubscribe = store.subscribe(() => {
    if (!timer) timer = setTimeout(check, 150)
  })
  check()
  watching = {
    unsubscribe,
    // a hunt (re)started: wherever the player stands counts again
    again: () => {
      last = null
      clearTimeout(timer)
      timer = setTimeout(check, 150)
    },
  }
  return watching
}

// ---- what the HUD does ----
export const hunts = {
  get state() {
    return state
  },
  tracks: TRACKS, // (the probes walk them)
  /** Start a track, or go on with it where it was left (a finished one starts again). */
  start(id) {
    flushTime()
    const now = Date.now()
    const next = startTrack(state, id, now)
    if (next === state) return
    hintAt = now
    open = true
    keep(next, { kind: 'start', track: id, step: next.tracks[id].step, at: now, seen: true })
    track('hunt', { op: 'start', id, step: next.tracks[id].step })
    watching?.again()
  },
  /** Leave the hunt on: it waits at its clue. */
  stop() {
    if (!state.on) return
    flushTime()
    const id = state.on
    const step = state.tracks[id].step
    keep(stopHunt(state, Date.now()), null)
    track('hunt', { op: 'stop', id, step })
  },
  /** The card moved on from a clue found to the next one (or closed the end of a hunt). */
  seen() {
    if (!news) return
    news = news.kind === 'done' ? null : { ...news, seen: true }
    emit()
  },
  setOpen(v) {
    if (open === v) return
    open = v
    emit()
  },
  /** A hint asked for (its number, from 1). */
  hint(n) {
    const cur = currentClue(state)
    if (cur) track('hunt', { op: 'hint', id: cur.track.id, step: cur.step, n })
  },
  /** For the probes: the hints at once. */
  hintsNow() {
    hintAt = 0
    emit()
  },
}
if (typeof window !== 'undefined') window.__ewHunts = hunts // for the probes

const subscribe = f => {
  subs.add(f)
  return () => subs.delete(f)
}

/** { state, news, open, hintAt }, kept up to date. */
export const useHunts = () => useSyncExternalStore(subscribe, () => snap, () => snap)

// ---- the words (src/content/hunts.js), loaded on demand ----
let words = null
let loading = null
const loadWords = () =>
  (loading ??= import('../content/hunts.js').then(m => {
    words = m
    return m
  }))

/** The hunts' words once loaded (null until then). */
export function useHuntWords() {
  const [w, setW] = useState(words)
  useEffect(() => {
    if (!w) loadWords().then(setW, () => {})
  }, [w])
  return w
}
