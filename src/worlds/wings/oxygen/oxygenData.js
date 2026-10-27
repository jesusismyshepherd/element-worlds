// The numbers oxygen's wings show, in one place (no three.js here, so the tests can read them).

/** 100 molecules of dry air, in the proportions by volume: N2 78.08%, O2 20.95%, Ar 0.93%. */
export const AIR_MIX = { N2: 78, O2: 21, Ar: 1 }

/** O2 in the air (% by volume) against time (billions of years ago): a simplified reading of the
 *  literature (Lyons, Reinhard and Planavsky 2014; Berner's models for the Phanerozoic), schematic. */
export const O2_HISTORY = [
  [4.6, 0], [2.5, 0], [2.43, 0.2], [2.33, 1.5], [2.2, 3.5], [2.06, 2], [1.85, 1], [0.85, 1], [0.75, 2.5],
  [0.6, 7], [0.54, 13], [0.45, 16], [0.4, 15], [0.36, 21], [0.3, 30], [0.27, 26], [0.25, 17], [0.2, 18],
  [0.12, 22], [0.05, 21], [0, 21],
]

/** O2 (%) at `ga` billion years ago, smoothly between the points above. */
export function o2At(ga) {
  for (let i = 1; i < O2_HISTORY.length; i++) {
    const [t0, v0] = O2_HISTORY[i - 1]
    const [t1, v1] = O2_HISTORY[i]
    if (ga <= t0 && ga >= t1) {
      const k = (t0 - ga) / (t0 - t1 || 1)
      const s = k * k * (3 - 2 * k)
      return v0 + (v1 - v0) * s
    }
  }
  return 21
}

/** How much of each UV band reaches the ground (WHO): all UV-A, about one UV-B in ten, no UV-C. */
export const UV_THROUGH = { A: 1, B: 0.1, C: 0 }

/** The candle under the jar: O2 at the start, and where the flame dies (about 15 to 16%). */
export const CANDLE_O2 = { start: 20.9, out: 15.9 }

/** Reactions as [formula, how many] on each side, the atoms of each formula spelled out. */
export const FORMULAS = {
  CH4: { C: 1, H: 4 },
  O2: { O: 2 },
  CO2: { C: 1, O: 2 },
  H2O: { H: 2, O: 1 },
  Fe: { Fe: 1 },
  Fe2O3: { Fe: 2, O: 3 },
}
export const REACTIONS = {
  methane: { left: [['CH4', 1], ['O2', 2]], right: [['CO2', 1], ['H2O', 2]] },
  rust: { left: [['Fe', 4], ['O2', 3]], right: [['Fe2O3', 2]] },
}

/** The atoms on one side of a reaction: { C: 1, H: 4, O: 4 }. */
export function atomsOf(side) {
  const out = {}
  for (const [f, n] of side) for (const [el, k] of Object.entries(FORMULAS[f])) out[el] = (out[el] ?? 0) + k * n
  return out
}
