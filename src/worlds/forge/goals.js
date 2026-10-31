// What a race in the forge asks for (src/game/race.js; docs/knowledge/atom-forge.md, "Together"): for each
// mission that can be raced, the atom to build (N a list when either of two isotopes does; E left out
// when the charge does not matter) and, for the missions that are a decay or a reaction, what to do with
// it once built: 'decay', 'chain' (decay all the way down), or the beam to fire. The mission's own check
// (words.js MISSIONS) says when a racer is done; this says how far each one is on the way. Pure.
import { MISSIONS } from './words.js'

export const GOALS = {
  H: { Z: 1, N: 0, E: 1 },
  D: { Z: 1, N: 1, E: 1 },
  He4: { Z: 2, N: 2, E: 2 },
  alpha: { Z: 2, N: 2, E: 0 },
  C12: { Z: 6, N: 6, E: 6 },
  C14: { Z: 6, N: 8, then: 'decay' },
  O16: { Z: 8, N: 8, E: 8 },
  'Na+': { Z: 11, N: 12, E: 10 },
  'Cl-': { Z: 17, N: [18, 20], E: 18 },
  Fe56: { Z: 26, N: 30, E: 26 },
  // any technetium seen will do; the way shown is technetium-99, the one hospitals use
  Tc: { Z: 43, N: 56 },
  U238: { Z: 92, N: 146, then: 'chain' },
  Og: { Z: 118, N: 176 },
  transmute: { Z: 7, N: 7, then: 'a' },
  neutronFound: { Z: 4, N: 5, then: 'a' },
  sun: { Z: 1, N: 0, then: 'p' },
  fusion: { Z: 1, N: 1, then: 't' },
  hoyle: { Z: 4, N: 4, then: 'a', hold: true },
  fission: { Z: 92, N: 143, then: 'n' },
  beamNew: { Z: 98, N: 151, then: 'Ca48' },
}

/** The missions a race can be run to, in the missions' order (all but the one with no fixed atom). */
export const RACES = MISSIONS.filter(m => GOALS[m.id])

const nearest = (list, n) => list.reduce((best, x) => (Math.abs(x - n) < Math.abs(best - n) ? x : best))

/**
 * How far a racer is toward goal `id`, from what they tell: at = { a: [Z, N, E], o: a chain's first
 * nucleus [Z, N] or null, done }. Returns { need: { p, n, e } (how many to add; negative, to take away),
 * built (the atom is right), then (what is left to do with it, or null), p (0 to 1) }.
 */
export function progress(id, at) {
  const g = GOALS[id]
  if (!g) return { need: { p: 0, n: 0, e: 0 }, built: false, then: null, p: 0 }
  const [Z, N, E] = Array.isArray(at?.a) ? at.a : [0, 0, 0]
  const nT = g.N == null ? N : nearest([].concat(g.N), N)
  const need = { p: g.Z - Z, n: nT - N, e: g.E == null ? 0 : g.E - E }
  const far = Math.abs(need.p) + Math.abs(need.n) + Math.abs(need.e)
  const total = g.Z + nT + (g.E ?? 0)
  let built = far === 0
  let p = Math.max(0, 1 - far / Math.max(1, total))
  if (g.then === 'chain') {
    // on the way down from uranium-238 to lead-206 (32 nucleons lighter): the decays are the second half
    if (at?.o && at.o[0] === g.Z && at.o[1] === g.N) {
      built = true
      p = 0.5 + 0.5 * Math.max(0, Math.min(1, (g.Z + g.N - Z - N) / 32))
    } else p *= 0.5
  } else if (g.then) p *= 0.85
  if (at?.done) p = 1
  return { need, built, then: g.then ?? null, hold: !!g.hold, p: Math.round(p * 1000) / 1000 }
}
