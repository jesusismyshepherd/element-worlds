// Treasure hunts (the studio's item `treasure-hunts`: "Hunts in order: each clue leads to the next hall,
// board or exhibit, on a theme"): a track is seven clues in order, each a riddle that leads to a real place
// in the game (a hall, a picture on its wall, its fact file, its specimen case, a station, a wing). A clue
// is reached by going there: entering its world, or opening its exhibit's panel there, as the store says
// (the world on show and `panelFrom`, the exhibit whose panel is open), so no world needs to know about
// hunts. A hall's picture is reached by stepping into it, since every picture has its room
// (picture-rooms.md). Pure: the words are src/content/hunts.js, the HUD ui/HuntHud.jsx (the plaza's
// sheet) and ui/HuntCard.jsx (the clue that follows the player), the state ui/useHunts.js, kept as the
// player's own state of the pseudo-world '/hunts' (engine/progress.js, so in the account too).
// docs/knowledge/hunts.md.
import { element } from '../data/elements.js'
import { pictureRoomId } from '../worlds/registry.js'

/** The pseudo-world whose own state holds the hunts (a world's state in name only: no page is there). */
export const HUNTS_PATH = '/hunts'

/** How long a clue is on show before its first hint is offered. */
export const HINT_AFTER_MS = 30000

// A clue: { id, w, panel?, year? }. w: a world as the store and telemetry key it ('atrium:Na' a hall,
// 'wing:C:allotropes' a wing, 'lab', 'forge', 'stars', 'plaza'); panel: an exhibit in it, as its panel's
// `panelFrom` says ('board:<id>' a picture on a hall's wall, 'facts' a hall's fact file, 'look' its
// specimen case, a station's id in a hall without pictures: stations.js). year: when it happened (the
// history track's timeline; negative before Christ). Two clues in a row are never in the same world, so
// each is reached by going somewhere new; none is on the plaza, where hunts start.
export const TRACKS = [
  {
    // who found what, and when: in the order it happened
    id: 'discoverers',
    icon: '📜',
    clues: [
      { id: 'meteorite', w: 'atrium:Fe', panel: 'board:meteorite', year: -1323 },
      { id: 'cavendish', w: 'atrium:H', panel: 'board:cavendish', year: 1766 },
      { id: 'priestley', w: 'atrium:O', panel: 'facts', year: 1774 },
      { id: 'davy', w: 'atrium:Na', panel: 'board:davy', year: 1807 },
      { id: 'hidden', w: 'atrium:Kr', panel: 'board:hidden', year: 1898 },
      { id: 'clock', w: 'atrium:C', panel: 'board:clock', year: 1949 },
      { id: 'valley', w: 'atrium:Si', panel: 'board:valley', year: 1971 },
    ],
  },
  {
    // where you meet the elements at home: the breakfast table to the bathroom
    id: 'home',
    icon: '🏠',
    clues: [
      { id: 'cereal', w: 'atrium:Fe', panel: 'board:cereal' },
      { id: 'salt', w: 'atrium:Na', panel: 'board:salt' },
      { id: 'foil', w: 'atrium:Al', panel: 'uses' },
      { id: 'mould', w: 'atrium:Si', panel: 'board:silicone' },
      { id: 'pencil', w: 'atrium:C', panel: 'board:twins' },
      { id: 'window', w: 'atrium:Kr', panel: 'board:windows' },
      { id: 'toothpaste', w: 'atrium:F', panel: 'uses' },
    ],
  },
  {
    // the most of everything, from element 1 to element 118
    id: 'records',
    icon: '🥇',
    clues: [
      { id: 'lightest', w: 'atrium:H', panel: 'board:bigbang' },
      { id: 'coldest', w: 'atrium:He', panel: 'state' },
      { id: 'hardest', w: 'wing:C:allotropes' },
      { id: 'commonest', w: 'atrium:O', panel: 'facts' },
      { id: 'densest', w: 'atrium:Os', panel: 'state' },
      { id: 'liquid', w: 'atrium:Hg', panel: 'look' },
      { id: 'heaviest', w: 'atrium:Og', panel: 'identity' },
    ],
  },
]

export const trackOf = id => TRACKS.find(t => t.id === id) ?? null

// ---- places ----

/** A world's key from the store's `world` ({ kind, symbol, wing }), as telemetry writes it. */
export const worldKeyOf = world => (world ? [world.kind, world.symbol, world.wing].filter(Boolean).join(':') : null)

/** Where the player is, from the store: { w, panel } (panel: the exhibit whose panel is open, else null),
 *  or null while a world is coming (the fade) or none is on show. */
export function placeOf(s) {
  if (!s?.world || s.fading) return null
  return { w: worldKeyOf(s.world), panel: s.panel ? (s.panelFrom ?? null) : null }
}

/** The keys a place stands for: its world, and its world with the exhibit open. */
export function keysOfPlace(p) {
  if (!p?.w) return []
  return p.panel ? [p.w, `${p.w}>${p.panel}`] : [p.w]
}

/** The keys that reach a target: its world (no exhibit), or its world with its exhibit open; a picture on a
 *  hall's wall also by its room (stepping into the picture: the room's address, registry.pictureRoomId). */
export function keysOfTarget(t) {
  if (!t.panel) return [t.w]
  const keys = [`${t.w}>${t.panel}`]
  const hall = /^atrium:([A-Z][a-z]?)$/.exec(t.w)
  const board = /^board:(.+)$/.exec(t.panel)
  if (hall && board) keys.push(`wing:${hall[1]}:${pictureRoomId(hall[1], board[1])}`)
  return keys
}

/** Does being at this place reach this target? */
export function reaches(t, place) {
  const here = keysOfPlace(place)
  return keysOfTarget(t).some(k => here.includes(k))
}

/** The element a target is about (its hall, its wing, a picture in its hall), or null (the lab, a forge,
 *  the plaza). */
export function targetElement(t) {
  const m = /^(?:atrium|wing):([A-Z][a-z]?)(?::|$)/.exec(t.w)
  return m ? (element(m[1]) ?? null) : null
}

/** What kind of place a target is: 'picture', 'facts', 'look', 'station' (in a hall), 'wing', 'hall', or
 *  the world's own kind ('lab', 'forge', 'stars', 'plaza'). */
export function targetKind(t) {
  if (/^atrium:/.test(t.w)) {
    if (!t.panel) return 'hall'
    if (/^board:/.test(t.panel)) return 'picture'
    if (t.panel === 'facts' || t.panel === 'look') return t.panel
    return 'station'
  }
  if (/^wing:/.test(t.w)) return 'wing'
  return t.w
}

/** The hints a clue offers, in order (descriptors the HUD words): the element's family and its row of the
 *  table, never its name; then, for the Explorer only, the element and the place in its hall. A place
 *  that is no element's (the lab, a forge) gets one hint, the place itself. */
export function hintsOf(t, level) {
  const el = targetElement(t)
  if (!el) return [{ kind: 'place', w: t.w }]
  const list = [{ kind: 'family', family: el.family, period: el.period }]
  if (level !== 'scientist') {
    const wing = /^wing:[A-Z][a-z]?:(.+)$/.exec(t.w)?.[1] ?? null
    list.push({ kind: 'name', symbol: el.symbol, place: targetKind(t), panel: t.panel ?? null, wing })
  }
  return list
}

// ---- the kept state ----
// { on: the track being played or null, at: when `on` last changed (ms), tracks: { <id>: { step, at,
// start, spent, done, best, last } } }: step is the clue to find next (the track's length once finished),
// at when the track last moved (its step, a start), start when this run began, spent the time it has been
// played (ms, counted while on show and in use: useHunts.js), done how many times it was finished, best the
// shortest finished run's time and last the latest's.

const num = (v, d = 0) => (Number.isFinite(v) ? v : d)
const time = v => (Number.isFinite(v) && v > 0 ? v : null)

/** The kept state made safe (unknown tracks dropped, steps within their track). */
export function normalHunts(raw) {
  const r = raw && typeof raw === 'object' ? raw : {}
  const tracks = {}
  for (const tr of TRACKS) {
    const t = r.tracks?.[tr.id]
    if (!t || typeof t !== 'object') continue
    tracks[tr.id] = {
      step: Math.max(0, Math.min(tr.clues.length, Math.floor(num(t.step)))),
      at: num(t.at),
      start: num(t.start),
      spent: Math.max(0, num(t.spent)),
      done: Math.max(0, Math.floor(num(t.done))),
      best: time(t.best),
      last: time(t.last),
    }
  }
  const on = trackOf(r.on) && tracks[r.on] && tracks[r.on].step < trackOf(r.on).clues.length ? r.on : null
  return { on, at: num(r.at), tracks }
}

/** How far a track is: { step (the clue to find, from 0), of, finished, done, best, last, on }. */
export function progressOf(state, id) {
  const tr = trackOf(id)
  const t = state.tracks[id]
  const of = tr?.clues.length ?? 0
  const step = t?.step ?? 0
  return { step, of, started: !!t && (t.step > 0 || state.on === id), finished: !!t && step >= of, done: t?.done ?? 0, best: t?.best ?? null, last: t?.last ?? null, on: state.on === id }
}

/** The clue to find now in the hunt on (with its track and number), or null. */
export function currentClue(state) {
  const tr = trackOf(state.on)
  const t = tr && state.tracks[tr.id]
  if (!t || t.step >= tr.clues.length) return null
  return { track: tr, step: t.step, clue: tr.clues[t.step] }
}

/** Start a track, or go on with it where it was left; a finished one starts again from its first clue
 *  (its finishes and best time kept). Another track on is left where it is. */
export function startTrack(state, id, now) {
  const tr = trackOf(id)
  if (!tr) return state
  const old = state.tracks[id]
  const fresh = !old || old.step >= tr.clues.length
  const t = fresh
    ? { step: 0, at: now, start: now, spent: 0, done: old?.done ?? 0, best: old?.best ?? null, last: old?.last ?? null }
    : { ...old, at: now }
  return { on: id, at: now, tracks: { ...state.tracks, [id]: t } }
}

/** Leave the hunt on: it waits at its clue for the next time. */
export const stopHunt = (state, now) => (state.on ? { ...state, on: null, at: now } : state)

/** Time spent on the hunt on (ms). */
export function addTime(state, ms) {
  const t = state.on && state.tracks[state.on]
  if (!t || !(ms > 0)) return state
  return { ...state, tracks: { ...state.tracks, [state.on]: { ...t, spent: t.spent + ms } } }
}

/**
 * What a place does to the hunt on: { state, event }. Only the clue to find now counts (the hunt goes in
 * order). Reaching it moves the track on (event { kind: 'clue', track, step, clue }); reaching the last
 * one finishes it (event { kind: 'done', track, step, clue, spent }: the hunt is over, its time kept).
 */
export function advance(state, place, now) {
  const cur = currentClue(state)
  if (!cur || !place || !reaches(cur.clue, place)) return { state, event: null }
  const id = cur.track.id
  const t = state.tracks[id]
  const step = t.step + 1
  if (step < cur.track.clues.length) {
    return { state: { ...state, tracks: { ...state.tracks, [id]: { ...t, step, at: now } } }, event: { kind: 'clue', track: id, step: t.step, clue: cur.clue } }
  }
  const spent = t.spent
  const best = t.best == null ? spent : Math.min(t.best, spent)
  const done = { ...t, step, at: now, done: t.done + 1, best: best || null, last: spent || null }
  return {
    state: { on: null, at: now, tracks: { ...state.tracks, [id]: done } },
    event: { kind: 'done', track: id, step: t.step, clue: cur.clue, spent },
  }
}

/**
 * Two kept states as one (an account's that came in and this device's): each track the newer one (by its
 * `at`), its finishes the most of either and its best time the shorter; the track on from the newer state.
 * The account keeps each world's state whole, the newer by its `at` (ew_save_progress); this joins two
 * devices' tracks one by one.
 */
export function mergeHunts(mine, theirs) {
  const a = normalHunts(mine)
  const b = normalHunts(theirs)
  const tracks = {}
  for (const tr of TRACKS) {
    const x = a.tracks[tr.id]
    const y = b.tracks[tr.id]
    if (!x || !y) {
      if (x || y) tracks[tr.id] = x ?? y
      continue
    }
    const newer = y.at >= x.at ? y : x
    const bests = [x.best, y.best].filter(v => v != null)
    tracks[tr.id] = { ...newer, done: Math.max(x.done, y.done), best: bests.length ? Math.min(...bests) : null }
  }
  const head = b.at >= a.at ? b : a
  return normalHunts({ on: head.on, at: Math.max(a.at, b.at), tracks })
}

/** The tracks finished at least once (their badges in the passport). */
export const finishedTracks = state => TRACKS.filter(tr => (state.tracks[tr.id]?.done ?? 0) > 0).map(tr => tr.id)
