// Catching neutrons, the two ways the universe makes the elements past iron (docs/knowledge/star-forge.md),
// on the Atom Forge's chart of nuclides and its decays (chem/nucleus.js). Pure and tested (neutrons.test.js).
//
// The slow way (the s-process), in the helium layer of an old giant star (the asymptotic giant branch):
// neutrons from 13C + 4He -> 16O + n come about once a century to each nucleus (1 / (n sigma v) with about
// 10^8 neutrons per cm^3 and a capture cross-section of 100 millibarn at 30 keV: 160 years). A nucleus that
// would decay sooner than that decays first; one that lasts longer catches the next neutron. So the path
// climbs along the valley of stability from iron to lead and bismuth, where it goes round for ever:
// bismuth-209 + n -> bismuth-210 -> polonium-210 -> alpha -> lead-206. (Real branch points, such as
// krypton-85 or samarium-151, split both ways with the temperature; here each goes one way.)
//
// The rapid way (the r-process), in the neutron-rich matter thrown out when two neutron stars merge
// (GW170817, 2017): a flood of neutrons, far more than any nucleus can wait for, so each one swells with
// neutrons until it can hold no more, beta-decays (a neutron turns into a proton) and swells again,
// climbing far out on the neutron-rich side of the chart in about a second. Here "can hold no more" is the
// most neutron-rich nucleus of that element ever made in a laboratory: the real path runs a little farther
// out still, through nuclei nobody has made yet. The heaviest ones split (fission), so the flood stops at
// plutonium. Then the neutrons run out and every nucleus on the path decays back toward stability, keeping
// its mass number in each beta decay: the stable (or very long-lived) nuclei they end as are what the
// r-process made: gold-197, platinum, europium, iodine, xenon, thorium-232, uranium-235 and -238.
import { nuclide, decay, knownRange } from '../../chem/nucleus.js'

export const YEAR = 3.15576e7
/** How long a nucleus in the giant's helium layer waits for its next neutron (years). */
export const S_WAIT_YEARS = 100
/** What lasts this long counts as made: it is still found on Earth, 4.5 billion years later (years). */
export const LONG_YEARS = 5e8
/** Where both captures start: iron-56, made by earlier stars (the seed). */
export const SEED = { Z: 26, N: 30 }
/** The flood stops here: heavier nuclei split. */
export const R_TOP = 94
/** The r-process makes little below the first peak (mass 80): products are counted from here. */
export const R_FROM_A = 70

const lasting = (Z, N, years) => {
  const nuc = nuclide(Z, N)
  return nuc.kind === 'stable' || (nuc.kind === 'radioactive' && nuc.t >= years * YEAR)
}

/** The slow capture: does (Z, N) decay before its next neutron? The decay ({ mode, Z, N, emitted }) or
 *  null (it waits for the neutron). */
export function sDecay(Z, N) {
  if (lasting(Z, N, S_WAIT_YEARS)) return null
  return decay(Z, N)
}

/** The slow capture run for `count` neutrons from (Z, N): every step, [{ op: 'n' | mode, Z, N }]. */
export function sRun(Z, N, count) {
  const steps = []
  let z = Z
  let n = N
  for (let k = 0; k < count; k++) {
    n++
    steps.push({ op: 'n', Z: z, N: n })
    for (let guard = 0; guard < 6; guard++) {
      const d = sDecay(z, n)
      if (!d) break
      z = d.Z
      n = d.N
      steps.push({ op: d.mode, Z: z, N: n })
    }
  }
  return steps
}

/** The most neutron-rich nucleus of element Z ever made (its neutron number). */
const edge = Z => knownRange(Z)?.max ?? null

/**
 * The rapid capture's path from the seed: every step [{ op: 'n' | 'beta' | 'drip', Z, N }], neutrons
 * caught until the element can hold no more, then a beta decay, until R_TOP.
 */
export function rPath(Z = SEED.Z, N = SEED.N) {
  const steps = [{ op: 'seed', Z, N }]
  let z = Z
  let n = N
  while (z < R_TOP) {
    const top = edge(z)
    if (top == null) break
    while (n < top) {
      n++
      steps.push({ op: 'n', Z: z, N: n })
    }
    z++
    n--
    steps.push({ op: 'beta', Z: z, N: n })
    // past what the next element can hold: neutrons drip off
    const next = edge(z)
    while (next != null && n > next) {
      n--
      steps.push({ op: 'drip', Z: z, N: n })
    }
  }
  return steps
}

/** A nucleus decayed until it is stable or lasts LONG_YEARS: its { Z, N }, and the decays on the way. */
export function settle(Z, N, max = 80) {
  let z = Z
  let n = N
  const way = []
  for (let k = 0; k < max && !lasting(z, n, LONG_YEARS); k++) {
    const d = decay(z, n)
    if (!d) break
    way.push(d.mode)
    z = d.Z
    n = d.N
  }
  return { Z: z, N: n, way }
}

/**
 * What the flood leaves once the neutrons run out: for each mass number on the path (from R_FROM_A), the
 * last nucleus the path had there, decayed back to stability. [{ A, from: { Z, N }, to: { Z, N } }].
 */
export function rProducts(path = rPath()) {
  const byA = new Map()
  for (const s of path) {
    const A = s.Z + s.N
    if (A >= R_FROM_A) byA.set(A, s)
  }
  return [...byA.entries()].sort((a, b) => a[0] - b[0]).map(([A, s]) => ({ A, from: { Z: s.Z, N: s.N }, to: settle(s.Z, s.N) }))
}

/** The elements the products are (atomic numbers, each once, in order). */
export const elementsOf = products => [...new Set(products.map(p => p.to.Z))].sort((a, b) => a - b)
