// Growing Crystals: a dish's plan, from what everyone in a room shares (the compound, the speed, a seed):
// how many crystals, where, how each grows and when (pure; plan.test.js). docs/knowledge/crystal.md.
//
// The speed is the evaporation (water) or the cooling (a melt), 0 to 1. Slow: one crystal on the thread,
// a perfect cube. Faster: the supply's Berg effect sinks the faces in (a hopper crystal), and more
// crystals start at once (at high supersaturation nucleation is quick: many small crystals instead of
// one big one). On brine, the extra crystals are salt boats floating at the surface; in a melt, small
// crystals on the dish's floor.
import { COMPOUND, STRUCTURES } from './lattice.js'
import { rng } from './grow.js'

export const SPEEDS = { slow: 0.12, fast: 0.85 }
// the habit's thresholds: faces sunk in this deep (sixteenths) make a hopper
export const HOPPER = 4

/** The size of a crystal's envelope in grid units: rock salt counts ions from the middle (a/2 each), the
 *  fluorites a/4. `n`: ions from the middle to a face in rock salt. */
const sizeOf = (structure, n) => (STRUCTURES[structure].div === 4 ? 2 * n - 2 : n)

/** The dish's plan. Every number in it comes from the seed and the speed, so every screen has the same.
 *  crystals: [{ id, mode: 'thread' | 'boat' | 'floor', grow: (options for Crystal), at: [x, z] (in the
 *  dish, as a share of its radius), turn (quarter turns are the same: an angle), start, dur (s) }]. */
export function planDish(compound, speed, seed) {
  const cmp = COMPOUND[compound] ?? COMPOUND.NaCl
  const s = Math.min(1, Math.max(0, Number(speed) || 0))
  const r = rng((seed >>> 0) ^ 0x5bd1e995)
  const structure = cmp.structure
  const water = cmp.medium === 'water'
  // how hollow the faces: none until a third of the way, then deeper with speed
  const hollow = Math.round(Math.max(0, (s - 0.3) / 0.7) * 7)
  // how long the thread crystal takes to grow (s), and when the first seed appears
  const dur = Math.round(46 - s * 32)
  const first = 2.6 - s * 1.4
  const crystals = [{
    id: 0,
    mode: 'thread',
    grow: { structure, seed: Math.floor(r() * 2 ** 31), mode: 'free', hollow, size: sizeOf(structure, hollow ? 8 : 7), beta: 400 },
    at: [0, 0],
    turn: r() * Math.PI * 0.5,
    start: first,
    dur,
  }]
  // more crystals at once, the faster it goes
  const extra = s < 0.3 ? 0 : Math.min(water ? 2 : 3, Math.floor((s - 0.3) * 5) + 1)
  const base = r() * Math.PI * 2
  for (let k = 0; k < extra; k++) {
    const angle = base + (k / extra) * Math.PI * 2 + (r() - 0.5) * 0.6
    const radius = 0.64 + r() * 0.1
    const boat = water
    crystals.push({
      id: k + 1,
      mode: boat ? 'boat' : 'floor',
      grow: boat
        ? { structure, seed: Math.floor(r() * 2 ** 31), mode: 'boat', size: 3 + Math.floor(r() * 2), wall: 2, beta: 400 }
        : { structure, seed: Math.floor(r() * 2 ** 31), mode: 'free', hollow, size: sizeOf(structure, 3 + Math.floor(r() * 2)), beta: 400 },
      at: [Math.cos(angle) * radius, Math.sin(angle) * radius],
      turn: r() * Math.PI * 0.5,
      start: first + 0.8 + r() * 2.5 + k * 0.6,
      dur: Math.round(dur * (0.55 + r() * 0.25)),
    })
  }
  const end = Math.max(...crystals.map(c => c.start + c.dur))
  return { compound: cmp.id, speed: s, seed, water, hollow, habit: hollow >= HOPPER ? 'hopper' : hollow ? 'between' : 'perfect', crystals, end }
}

/** How far a crystal has grown at time t (s from the dish's start): 0 to 1, slow at first (a seed must
 *  form), steady, then slowing as the last places fill. */
export function grown(c, t) {
  const u = (t - c.start) / c.dur
  if (u <= 0) return 0
  if (u >= 1) return 1
  return u * u * (3 - 2 * u)
}

/** The water's (or the melt's) share left at time t: the level falls (evaporation) or the glow fades
 *  (cooling) over the dish's growth. */
export function remaining(plan, t) {
  const u = Math.min(1, Math.max(0, t / plan.end))
  return 1 - u
}

// the bench's discoveries (bench:crystal:<find>): a neighbourhood seen, a perfect crystal grown slowly, a
// hopper grown fast, the grain of real salt, and each compound grown
export const FINDS = ['neighbours', 'perfect', 'hopper', 'grain', ...Object.keys(COMPOUND)]

/** A dish's state as it came from another device or a save, checked: a known compound, a speed from 0 to
 *  1, a whole seed, an age that is a number or null (waiting). Null when it makes no sense. */
export function cleanDish(st) {
  if (!st || typeof st !== 'object') return null
  const c = COMPOUND[st.c] ? st.c : null
  const s = Number(st.s)
  const seed = Number(st.seed)
  if (!c || !Number.isFinite(s) || !Number.isFinite(seed)) return null
  const age = st.age == null ? null : Number(st.age)
  if (age != null && (!Number.isFinite(age) || age < 0)) return null
  return {
    c,
    s: Math.round(Math.min(1, Math.max(0, s)) * 100) / 100,
    seed: Math.floor(Math.abs(seed)) >>> 0,
    age,
    by: typeof st.by === 'string' ? st.by.slice(0, 64) : null,
  }
}
