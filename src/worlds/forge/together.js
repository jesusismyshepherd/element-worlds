// The Atom Forge's atom in a room (docs/knowledge/multiplayer.md, "The forge together"): everyone in the
// forge builds the same atom. Two players pressing + at the same moment must both count (Artur adding
// protons while his father adds neutrons), so the atom is not one value that the last writer wins: it is
// a base, set by whoever last changed the whole atom (a decay, the beam, the chart, starting again), and
// each player's additions and removals since, every one a count that only goes up. Two copies merge by
// taking the later base, or, on the same base, each count's larger value: the result is the same in
// whatever order the copies arrive, and taking a copy twice changes nothing. Pure (together.test.js).
//
// { k, by, b: [Z, N, E], d: { player: [p+, p-, n+, n-, e+, e-] }, ev, o }
//   k, by  when the base was set (ms, at least one more than the base before) and by whom: the later wins
//   b      the atom the base set
//   d      each player's counts on that base
//   ev     what set the base, for the others to play it: { t, f: [Z, N, E] the atom before, beam }, t one
//          of 'set' (the chart, the finder, the commonest, starting again), 'decay', 'fire', 'neutral',
//          'fold' (counts that went past what can be, folded)
//   o      the first nucleus of a decay chain [Z, N] (the uranium-to-lead mission), or null
// The world as built has k = 0, an empty table and no counts: the same for everyone (and what a room's
// world starts as; in a room the forge waits for the room's atom before showing an element asked for).

export const CAP = { Z: 118, N: 180 }
const KINDS = ['p', 'n', 'e']
const ZERO = [0, 0, 0, 0, 0, 0]

/** The atom as the forge is built, before anyone in the room has touched it. */
export const fresh = (Z = 0, N = 0, E = Z) => ({ k: 0, by: '', b: [Z, N, E], d: {}, ev: null, o: null })

/** The counts added up, before keeping them to what can be. */
export function raw(s) {
  let [Z, N, E] = s.b
  for (const c of Object.values(s.d)) {
    Z += c[0] - c[1]
    N += c[2] - c[3]
    E += c[4] - c[5]
  }
  return [Z, N, E]
}

/** What the forge allows: no electrons without protons, at most three extra (as forge.js). */
export function clampAtom(Z, N, E) {
  const z = Math.max(0, Math.min(CAP.Z, Z))
  const n = Math.max(0, Math.min(CAP.N, N))
  return { Z: z, N: n, E: z === 0 ? 0 : Math.max(0, Math.min(z + 3, E)) }
}

/** The atom on the table. */
export const atomOf = s => clampAtom(...raw(s))

/** Was base a set later than base b? (the time first, then who, so everyone picks the same) */
export const later = (a, b) => a.k > b.k || (a.k === b.k && a.by > b.by)
const sameBase = (a, b) => a.k === b.k && a.by === b.by

/** A new base: the whole atom set at once by `me`; `at` is the clock (ms). */
export function rebase(s, me, atom, ev = null, o = null, at = 0) {
  return { k: Math.max(s.k + 1, Math.floor(at)), by: me, b: [atom.Z, atom.N, atom.E], d: {}, ev, o }
}

/** One particle of `kind` added (sign 1) or taken away (-1) by `me`. Counts that went past what can be
 *  (two took the last proton at once) are first folded into a new base, so the next one added shows.
 *  (The first presses in a room count on the world as built, the same base for everyone: a new base
 *  there would make two first presses at once two bases, and one of them would be lost.) */
export function bump(s, me, kind, sign, at = 0) {
  const i = KINDS.indexOf(kind)
  if (i < 0) return s
  const r = raw(s)
  const a = atomOf(s)
  if (r[0] !== a.Z || r[1] !== a.N || r[2] !== a.E) s = rebase(s, me, a, { t: 'fold' }, null, at)
  const c = [...(s.d[me] ?? ZERO)]
  c[i * 2 + (sign > 0 ? 0 : 1)]++
  return { ...s, d: { ...s.d, [me]: c } }
}

/** The world as built, untouched (what net/shared.js sets when a room is joined or left): it replaces
 *  the atom instead of merging into it. */
export const untouched = s => s.k === 0 && !Object.keys(s.d).length

/** Two copies of the room's atom made one. */
export function merge(a, b) {
  if (!sameBase(a, b)) return later(b, a) ? b : a
  const d = { ...a.d }
  for (const [id, c] of Object.entries(b.d)) d[id] = d[id] ? d[id].map((x, i) => Math.max(x, c[i])) : c
  return { ...a, d }
}

/** Has copy a everything copy b has? (if not, a's holder has something to tell b's) */
export function covers(a, b) {
  if (!sameBase(a, b)) return later(a, b)
  return Object.entries(b.d).every(([id, c]) => a.d[id] && c.every((x, i) => a.d[id][i] >= x))
}

/** What happened between two copies: a new base (by whom, how), or each player's particles added (n > 0)
 *  and taken away (n < 0): { rebased, by, ev } or { rebased: false, list: [{ by, k, n }] }. */
export function changes(a, b) {
  if (!sameBase(a, b)) return { rebased: true, by: b.by, ev: b.ev }
  const list = []
  for (const [id, c] of Object.entries(b.d)) {
    const was = a.d[id] ?? ZERO
    KINDS.forEach((k, i) => {
      const add = c[i * 2] - was[i * 2]
      const take = c[i * 2 + 1] - was[i * 2 + 1]
      if (add > 0) list.push({ by: id, k, n: add })
      if (take > 0) list.push({ by: id, k, n: -take })
    })
  }
  return { rebased: false, list }
}

const int = (x, lo, hi) => (Number.isFinite(Number(x)) ? Math.max(lo, Math.min(hi, Math.round(Number(x)))) : null)
const EVENTS = ['set', 'decay', 'fire', 'neutral', 'fold']
const trio = (x, z = CAP.Z + 3) => (Array.isArray(x) && x.length === 3 ? [int(x[0], 0, CAP.Z), int(x[1], 0, CAP.N), int(x[2], 0, z)] : null)

/** A copy that came over the network, checked (null if it is not one). */
export function clean(s) {
  if (!s || typeof s !== 'object') return null
  const b = trio(s.b)
  if (!b || b.some(x => x == null)) return null
  const d = {}
  for (const [id, c] of Object.entries(s.d && typeof s.d === 'object' ? s.d : {}).slice(0, 24)) {
    if (Array.isArray(c) && c.length === 6) d[String(id).slice(0, 24)] = c.map(x => int(x, 0, 1e7) ?? 0)
  }
  let ev = null
  if (s.ev && EVENTS.includes(s.ev.t)) {
    ev = { t: s.ev.t }
    const f = trio(s.ev.f)
    if (f && f.every(x => x != null)) ev.f = f
    if (typeof s.ev.beam === 'string') ev.beam = s.ev.beam.slice(0, 8)
  }
  const o = Array.isArray(s.o) && s.o.length === 2 && s.o.every(x => int(x, 0, CAP.N) != null) ? [int(s.o[0], 0, CAP.Z), int(s.o[1], 0, CAP.N)] : null
  return { k: Math.max(0, Math.floor(Number(s.k) || 0)), by: String(s.by ?? '').slice(0, 24), b, d, ev, o }
}

/** The same copy always written the same way (the players' counts in one order). */
export function canon(s) {
  const d = {}
  for (const id of Object.keys(s.d).sort()) d[id] = s.d[id]
  return { k: s.k, by: s.by, b: s.b, d, ev: s.ev, o: s.o }
}
