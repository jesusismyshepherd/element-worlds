// The Atom Forge's physics: what a handful of protons, neutrons and electrons makes (which element,
// which isotope, which ion), whether its nucleus holds together (the chart of nuclides,
// src/data/nuclides.json, built by scripts/build-nuclides.mjs) and what flies out when it decays.
import { ELEMENTS } from '../data/elements.js'

let CHART = null

/** The chart of nuclides (loaded once, only where it is needed: 70 KB). */
export async function loadChart() {
  CHART ??= (await import('../data/nuclides.json')).default
  return CHART
}

/** For the tests, which read the JSON themselves. */
export const useChart = c => {
  CHART = c
}

// a free neutron lives about 15 minutes on average (PDG: 878.4 s), a half-life of 609 s, and
// turns into a proton, an electron and an antineutrino: a hydrogen atom
const FREE_NEUTRON = 878.4 * Math.LN2

/** The known isotopes of element Z: [[A, t, abundance, modes]] (see build-nuclides.mjs). */
export const isotopesOf = Z => CHART?.[Z] ?? []

/** The neutron numbers known for element Z: { min, max }. */
export function knownRange(Z) {
  const list = isotopesOf(Z)
  if (!list.length) return null
  return { min: list[0][0] - Z, max: list[list.length - 1][0] - Z }
}

/**
 * The nucleus with Z protons and N neutrons:
 * { Z, N, A, kind, t (seconds), abundance, modes: [] }, kind one of
 *   'empty'       nothing yet
 *   'neutron'     one neutron alone (radioactive, 609 s)
 *   'neutrons'    two or more neutrons and no proton: they do not stick together
 *   'stable'      it lasts for ever
 *   'radioactive' it decays, with half-life t
 *   'instant'     it falls apart at once (in under a millionth of a millionth of a second, or too fast to time)
 *   'unmeasured'  it has been made, but its half-life is not measured yet
 *   'unknown'     nobody has seen it: too far from the known ones (side: 'rich' or 'poor' in neutrons),
 *                 or not made yet (side: null)
 */
export function nuclide(Z, N) {
  const A = Z + N
  const base = { Z, N, A, t: null, abundance: 0, modes: [] }
  if (Z === 0) {
    if (N === 0) return { ...base, kind: 'empty' }
    if (N === 1) return { ...base, kind: 'neutron', t: FREE_NEUTRON, modes: ['B-'] }
    return { ...base, kind: 'neutrons', t: 0, modes: ['n'] }
  }
  const hit = isotopesOf(Z).find(n => n[0] === A)
  if (!hit) {
    const r = knownRange(Z)
    const side = !r ? null : N > r.max ? 'rich' : N < r.min ? 'poor' : null
    // a superheavy past the heaviest one made is "not made yet", not "impossible"
    const far = side === 'rich' ? N - r.max > (Z > 100 ? 4 : 0) : side === 'poor'
    return { ...base, kind: 'unknown', side: far ? side : null }
  }
  const [, t, abundance, modes] = hit
  const list = modes ? modes.split(',') : []
  if (t === null) return { ...base, kind: 'stable', abundance }
  // (helium-5 and beryllium-8 last 10^-22 to 10^-16 s: at once, for anyone watching)
  if (t === 0 || (t > 0 && t < 1e-12)) return { ...base, kind: 'instant', t, modes: list, abundance }
  if (t < 0) return { ...base, kind: 'unmeasured', t: null, modes: list, abundance }
  return { ...base, kind: 'radioactive', t, abundance, modes: list }
}

/** The isotope a world shows first: the commonest in nature, else the longest-lived. */
export function commonestN(Z) {
  const list = isotopesOf(Z)
  if (!list.length) return Math.round(Z * 1.5)
  const natural = list.filter(n => n[2] > 0).sort((a, b) => b[2] - a[2])[0]
  if (natural) return natural[0] - Z
  const lasting = list.filter(n => n[1] > 0).sort((a, b) => b[1] - a[1])[0]
  return (lasting ?? list[Math.floor(list.length / 2)])[0] - Z
}

// [dZ, dN] of each decay mode (NUBASE codes)
const SHIFT = {
  A: [-2, -2], 'B-': [1, -1], 'B+': [-1, 1], EC: [-1, 1], 'e+': [-1, 1], 'EC+B+': [-1, 1],
  p: [-1, 0], '2p': [-2, 0], '3p': [-3, 0], n: [0, -1], '2n': [0, -2], '3n': [0, -3], '4n': [0, -4],
  'B-n': [1, -2], 'B-2n': [1, -3], 'B-p': [0, -1], 'B-d': [0, -2], 'B-t': [0, -3], 'B-A': [-1, -3],
  'B+p': [-2, 1], 'B+2p': [-3, 1], 'B+A': [-3, -1], '2B-': [2, -2], '2B+': [-2, 2],
}

/** What flies out of each decay mode, for the animation (and the words). */
const EMITTED = {
  A: ['alpha'], 'B-': ['electron', 'antineutrino'], 'B+': ['positron', 'neutrino'], 'e+': ['positron', 'neutrino'],
  'EC+B+': ['positron', 'neutrino'], EC: ['neutrino'], p: ['proton'], '2p': ['proton', 'proton'], '3p': ['proton', 'proton', 'proton'],
  n: ['neutron'], '2n': ['neutron', 'neutron'], '3n': ['neutron', 'neutron', 'neutron'], '4n': ['neutron', 'neutron', 'neutron', 'neutron'],
  'B-n': ['electron', 'antineutrino', 'neutron'], 'B-2n': ['electron', 'antineutrino', 'neutron', 'neutron'],
  'B-p': ['electron', 'antineutrino', 'proton'], 'B-d': ['electron', 'antineutrino', 'deuteron'], 'B-t': ['electron', 'antineutrino', 'triton'],
  'B-A': ['electron', 'antineutrino', 'alpha'], 'B+p': ['positron', 'neutrino', 'proton'], 'B+2p': ['positron', 'neutrino', 'proton', 'proton'],
  'B+A': ['positron', 'neutrino', 'alpha'], '2B-': ['electron', 'electron', 'antineutrino', 'antineutrino'], '2B+': ['positron', 'positron', 'neutrino', 'neutrino'],
}

/** The family a mode belongs to, for the words: alpha, beta-minus, beta-plus, capture, proton, neutron,
 *  fission, cluster. */
export function modeFamily(mode) {
  if (mode === 'A') return 'alpha'
  if (mode === 'SF' || /SF$/.test(mode)) return 'fission'
  if (mode === 'EC') return 'capture'
  if (/^(B\+|e\+|EC\+B\+|2B\+)/.test(mode)) return 'betaPlus'
  if (/^(B-|2B-)/.test(mode)) return 'betaMinus'
  if (/^\d*p$/.test(mode)) return 'proton'
  if (/^\d*n$/.test(mode)) return 'neutron'
  if (/^\d+[A-Z][a-z]?$/.test(mode)) return 'cluster'
  return null
}

const CLUSTER = /^(\d+)([A-Z][a-z]?)$/

/**
 * One decay of the nucleus (Z, N) by its strongest mode (or the one given): { mode, Z, N, emitted }.
 * Fission keeps the heavier piece (the other flies away, with two or three neutrons). Returns null
 * when it does not decay (stable, or unknown how).
 */
export function decay(Z, N, mode) {
  const nuc = nuclide(Z, N)
  if (nuc.kind === 'neutron') return { mode: 'B-', Z: 1, N: 0, emitted: EMITTED['B-'] }
  if (nuc.kind === 'neutrons') return { mode: 'n', Z: 0, N: 1, emitted: Array(N - 1).fill('neutron') }
  if (nuc.kind === 'unknown') return settleStep(Z, N, nuc)
  const m = mode ?? nuc.modes.find(x => SHIFT[x] || x === 'SF' || CLUSTER.test(x))
  if (!m) return null
  if (m === 'SF' || /SF$/.test(m)) {
    const light = Math.round(Z * 0.4)
    const Zh = Z - light
    const range = knownRange(Zh)
    // the pieces are rich in neutrons; two or three fly off free
    const Ah = Math.round((Z + N - 3) * 0.58)
    const Nh = range ? Math.min(range.max, Math.max(range.min, Ah - Zh)) : Ah - Zh
    const Nl = Math.max(0, N - Nh - 3)
    return { mode: 'SF', Z: Zh, N: Nh, emitted: ['fragment', 'neutron', 'neutron', 'neutron'], piece: { Z: light, N: Nl } }
  }
  const c = m.match(CLUSTER)
  if (c) {
    const Ac = Number(c[1])
    const Zc = ELEMENTS.findIndex(e => e.symbol === c[2]) + 1
    if (Zc < 1) return null
    return { mode: m, Z: Z - Zc, N: N - (Ac - Zc), emitted: ['cluster'], cluster: { Z: Zc, N: Ac - Zc } }
  }
  const [dZ, dN] = SHIFT[m]
  if (Z + dZ < 0 || N + dN < 0) return null
  return { mode: m, Z: Z + dZ, N: N + dN, emitted: EMITTED[m] ?? [] }
}

/** A nucleus nobody has seen falls toward the known ones: too many neutrons drip off as neutrons, too
 *  few and protons drip off. */
function settleStep(Z, N, nuc) {
  const r = knownRange(Z)
  if (!r || nuc.side === null) return null
  if (nuc.side === 'rich') return { mode: 'n', Z, N: N - 1, emitted: ['neutron'] }
  return { mode: 'p', Z: Z - 1, N, emitted: ['proton'] }
}

/** The whole chain from (Z, N) by the strongest modes, until something stable (or unknown): for the
 *  decay chains (uranium-238 to lead-206). */
export function chain(Z, N, max = 40) {
  const steps = []
  let z = Z
  let n = N
  for (let i = 0; i < max; i++) {
    const d = decay(z, n)
    if (!d) break
    steps.push(d)
    z = d.Z
    n = d.N
    if (nuclide(z, n).kind === 'stable') break
  }
  return steps
}

// ---- the beam: nuclear reactions ----

/** What the forge can fire at a nucleus: [Z, N] each. */
export const BEAMS = {
  n: [0, 1], p: [1, 0], d: [1, 1], t: [1, 2], a: [2, 2],
  C12: [6, 6], O16: [8, 8], Ca48: [20, 28], Fe58: [26, 32], Zn70: [30, 40],
}

// Famous reactions, as they happened: target [Z, N] + beam -> what flies out and what stays.
// (fragment: a second nucleus that flies away, { Z, N })
const REACTIONS = [
  { id: 'sun', target: [1, 0], beam: 'p', result: [1, 1], out: ['positron', 'neutrino'], year: 1938 },
  { id: 'fusion', target: [1, 1], beam: 't', result: [2, 2], out: ['neutron'], year: 1934 },
  { id: 'fusion', target: [1, 2], beam: 'd', result: [2, 2], out: ['neutron'], year: 1934 },
  { id: 'splitLi', target: [3, 4], beam: 'p', result: [2, 2], out: ['alpha'], year: 1932 },
  { id: 'neutron', target: [4, 5], beam: 'a', result: [6, 6], out: ['neutron'], year: 1932 },
  { id: 'hoyle', target: [4, 4], beam: 'a', result: [6, 6], out: [], year: 1953 },
  { id: 'c14', target: [7, 7], beam: 'n', result: [6, 8], out: ['proton'], year: 1946 },
  { id: 'transmute', target: [7, 7], beam: 'a', result: [8, 9], out: ['proton'], year: 1919 },
  { id: 'artificial', target: [13, 14], beam: 'a', result: [15, 15], out: ['neutron'], year: 1934 },
  { id: 'fission', target: [92, 143], beam: 'n', result: [56, 85], out: ['fragment', 'neutron', 'neutron', 'neutron'], fragment: [36, 56], year: 1938 },
]

/**
 * A beam particle fired at the nucleus (Z, N): { famous, compound, result: { Z, N }, out, fragment }.
 * The famous reactions go as history saw them; otherwise the two fuse, and a heavy compound nucleus,
 * hot from the hit, boils off neutrons (about three on an actinide target, one on lead or bismuth: hot
 * and cold fusion, as the superheavy elements were made), then as many more as it takes to reach a
 * nucleus that has been seen.
 */
export function collide(Z, N, beam) {
  const [bz, bn] = BEAMS[beam]
  const compound = { Z: Z + bz, N: N + bn }
  const famous = REACTIONS.find(r => r.target[0] === Z && r.target[1] === N && r.beam === beam)
  if (famous) {
    return {
      famous: famous.id, year: famous.year, compound, result: { Z: famous.result[0], N: famous.result[1] }, out: famous.out,
      fragment: famous.fragment ? { Z: famous.fragment[0], N: famous.fragment[1] } : null,
    }
  }
  let z = compound.Z
  let n = compound.N
  const out = []
  const boil = Z >= 89 && bz >= 6 ? 3 : Z >= 82 && bz >= 6 ? 1 : 0
  for (let i = 0; i < boil && n > 0; i++) {
    n--
    out.push('neutron')
  }
  const r = knownRange(z)
  for (let k = 0; k < 6 && r && nuclide(z, n).kind === 'unknown' && n > r.min; k++) {
    n--
    out.push('neutron')
  }
  return { famous: null, compound, result: { Z: z, N: n }, out, fragment: null }
}

/** Electrons in each shell of an atom with Z protons and E electrons: the neutral atom's shells, with
 *  electrons taken from the outside first (a cation) or added to the outer shell (an anion). */
export function ionShells(Z, E) {
  if (E <= 0 || Z < 1) return []
  const shells = ELEMENTS[Z - 1].shells.slice()
  let diff = E - Z
  let k = shells.length - 1
  while (diff < 0 && k >= 0) {
    if (shells[k] > 0) {
      shells[k]--
      diff++
    } else k--
  }
  while (shells.length && shells[shells.length - 1] === 0) shells.pop()
  if (diff > 0) {
    if (!shells.length) shells.push(0)
    shells[shells.length - 1] += diff
  }
  return shells
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export const sup = n => String(n).replace(/\d/g, d => SUP[d])

/** The charge as a superscript: '', '⁺', '²⁺', '⁻', '³⁻'. */
export const chargeText = q => (q === 0 ? '' : `${Math.abs(q) > 1 ? sup(Math.abs(q)) : ''}${q > 0 ? '⁺' : '⁻'}`)

/** The nuclide's symbol with its mass number up front and the ion's charge after: ¹⁴C, ²³Na⁺. */
export function nuclideSymbol(Z, N, E) {
  if (Z === 0) return N ? `${N > 1 ? N : ''}n` : ''
  return `${sup(Z + N)}${ELEMENTS[Z - 1].symbol}${chargeText(Z - E)}`
}

const YEAR = 3.15576e7

/** A half-life in words: { value, unit } with the unit a key of HALF_UNITS (the HUD's words). */
export function halfLifeParts(t) {
  if (t == null) return null
  const pick = (v, unit) => ({ value: Number(v.toPrecision(3)), unit })
  if (t >= YEAR * 1e12) return { value: Number((t / YEAR).toPrecision(2)), unit: 'yearsSci' }
  if (t >= YEAR * 1e9) return pick(t / YEAR / 1e9, 'billionYears')
  if (t >= YEAR * 1e6) return pick(t / YEAR / 1e6, 'millionYears')
  if (t >= YEAR) return pick(t / YEAR, 'years')
  if (t >= 86400) return pick(t / 86400, 'days')
  if (t >= 3600) return pick(t / 3600, 'hours')
  if (t >= 60) return pick(t / 60, 'minutes')
  if (t >= 1) return pick(t, 'seconds')
  if (t >= 1e-3) return pick(t * 1e3, 'ms')
  if (t >= 1e-6) return pick(t * 1e6, 'us')
  if (t >= 1e-9) return pick(t * 1e9, 'ns')
  return { value: t, unit: 'secondsSci' }
}
