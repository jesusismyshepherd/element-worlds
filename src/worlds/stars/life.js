// A star's life by its mass, for the Star Forge (/stars, docs/knowledge/star-forge.md): which burnings its
// core goes through, how long each lasts, how hot the core is, what each makes and how the star ends.
// Pure and tested (life.test.js). Numbers and where they come from:
// - Core hydrogen burning (the main sequence), [mass in suns, years]: red dwarfs from Adams, Laughlin &
//   Graves 2004 (RMxAC 22, 46: 0.08 suns about 12 trillion years, 0.25 suns about one trillion); the Sun
//   10 billion (10 to 11, Schröder & Smith 2008); 3, 5 and 8 suns from Maeder & Meynet 1989 (A&A 210, 155,
//   as fitted in Romano et al. 2005); 15, 20 and 25 suns from Woosley, Heger & Weaver 2002 (Rev. Mod. Phys.
//   74, 1015), as listed in Paxton et al. 2011 (MESA, ApJS 192, 3, table 12). In between: straight lines
//   in log mass and log time.
// - A massive star's later burnings (helium, carbon, neon, oxygen, silicon): Woosley, Heger & Weaver 2002
//   for 15, 20 and 25 suns (the same table); stars of 10 to 15 suns take the 15-sun star's (approximate).
// - Core temperatures: the Sun's today 15.7 million K (the standard solar model); a 20-sun star's at each
//   burning from Heger, Woosley, Fryer & Langer 2003 (astro-ph/0211062, table 1): hydrogen 37 million K,
//   helium 190 million, carbon 0.87 billion, neon 1.6, oxygen 2.0, silicon 3.3 billion. Hydrogen between
//   1 and 25 suns: a power law through those two (approximate). Helium in a Sun-like star: ignition at
//   about 100 million K.
// - Stars like the Sun: helium burning in the core about 100 million years and the asymptotic giant
//   branch about 20 million (Schröder & Smith 2008, via Wikipedia's Sun); the red giant climb about a
//   tenth of the main sequence for the Sun. Other low masses are scaled from these (approximate, flagged
//   in the doc).
// - The products of each burning: Heger's lecture table (JINA, "Nuclear burning stages", a 20-sun star):
//   hydrogen -> helium (nitrogen-14 from the CNO cycle); helium -> carbon, oxygen; carbon -> neon,
//   magnesium, sodium; neon -> oxygen, magnesium (aluminium, phosphorus); oxygen -> silicon, sulfur
//   (chlorine, argon, potassium, calcium); silicon -> iron (titanium to nickel).
// - Fates: below about 0.5 suns no helium ever burns (a helium white dwarf, after trillions of years: none
//   yet); to about 8 suns a planetary nebula and a carbon-oxygen white dwarf; 8 to 10 suns carbon burns,
//   then an oxygen-neon white dwarf (or, for some, a faint supernova: still studied); above 10 suns an
//   iron core collapses, a supernova, leaving a neutron star (below about 20 suns) or often a black hole
//   (above: which one is still studied).

export const M_MIN = 0.1
export const M_MAX = 25
export const UNIVERSE_YEARS = 1.38e10

/** The stars of the nursery, to tap (mass in suns). */
export const NURSERY = [
  { id: 'red', m: 0.25, color: '#ff8a5c' },
  { id: 'sun', m: 1, color: '#ffd27a' },
  { id: 'three', m: 3, color: '#f4f1ff' },
  { id: 'fifteen', m: 15, color: '#bcd2ff' },
  { id: 'blue', m: 25, color: '#93b4ff' },
]

const H_LIFE = [[0.08, 1.2e13], [0.25, 1e12], [1, 1e10], [3, 3.84e8], [5, 1.04e8], [8, 3.65e7], [15, 1.11e7], [20, 8.13e6], [25, 6.71e6]]
const LATE = [
  [15, { he: 1.97e6, c: 2.03e3, ne: 0.732, o: 2.58, si: 5.01e-2 }],
  [20, { he: 1.17e6, c: 976, ne: 0.599, o: 1.25, si: 3.15e-2 }],
  [25, { he: 8.395e5, c: 522, ne: 0.891, o: 0.402, si: 2.01e-3 }],
]
const T20 = { h: 3.7e7, he: 1.9e8, c: 8.7e8, ne: 1.6e9, o: 2.0e9, si: 3.3e9 }
const T_SUN = 1.57e7

/** y at x on a broken line through [x, y] points, straight in log x and log y (ends held). */
function logLine(points, x) {
  const lx = Math.log(x)
  if (x <= points[0][0]) return points[0][1]
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i]
    if (x === x1) return y1
    if (x < x1) {
      const [x0, y0] = points[i - 1]
      const f = (lx - Math.log(x0)) / (Math.log(x1) - Math.log(x0))
      return Math.exp(Math.log(y0) + f * (Math.log(y1) - Math.log(y0)))
    }
  }
  return points[points.length - 1][1]
}

/** How long a star of m suns burns hydrogen in its core (years). */
export const hydrogenYears = m => logLine(H_LIFE, m)

const late = (m, k) => logLine(LATE.map(([x, v]) => [x, v[k]]), Math.max(15, m))

/** What kind of star: 'dwarf' (no helium burning), 'low' (white dwarf), 'super' (carbon burns, then a
 *  white dwarf), 'massive' (iron core, supernova). */
export function kindOf(m) {
  if (m < 0.5) return 'dwarf'
  if (m < 8) return 'low'
  if (m < 10) return 'super'
  return 'massive'
}

// what each burning makes (atomic numbers): the main products, then the secondary ones
export const PRODUCTS = {
  h: [2],
  cno: [7],
  he: [6, 8],
  c: [10, 12, 11],
  ne: [8, 12, 13, 15],
  o: [14, 16, 17, 18, 19, 20],
  si: [26, 22, 23, 24, 25, 27, 28],
  // the supernova's blast and the star's helium layers (the weak slow neutron capture): fluorine,
  // scandium, copper to rubidium (Johnson's chart gives these mostly or wholly to exploding massive stars)
  sn: [9, 21, 29, 30, 31, 32, 33, 34, 35, 36, 37],
}

/**
 * The phases of a star of m suns, in order: { id, years, T (core temperature, K, or null), chain,
 * fuel, makes }. id: h (core hydrogen), rg (red giant: a hydrogen shell), he (core helium), agb (the
 * asymptotic giant branch: shells, thermal pulses, the slow neutron capture), c, ne, o, si.
 */
export function phasesOf(m) {
  const kind = kindOf(m)
  const h = hydrogenYears(m)
  const cno = m >= 1.3
  const out = [{ id: 'h', years: h, T: m >= 1 ? T_SUN * m ** 0.286 : null, chain: cno ? 'cno' : 'pp', fuel: 'H', makes: cno ? [...PRODUCTS.h, ...PRODUCTS.cno] : PRODUCTS.h }]
  if (kind === 'dwarf') return out
  const heYears = m >= 15 ? late(m, 'he') : Math.min(1e8, 0.19 * h)
  const heT = m >= 20 ? T20.he : logLine([[1, 1e8], [20, T20.he]], Math.max(1, m))
  if (kind === 'low') {
    // the red giant's climb: about a tenth of the main sequence for the Sun, less for heavier stars
    const rg = h * logLine([[1, 0.1], [3, 0.03], [5, 0.01]], Math.max(1, m))
    out.push({ id: 'rg', years: rg, T: null, chain: null, fuel: 'H', makes: [] })
    out.push({ id: 'he', years: heYears, T: heT, chain: 'alpha', fuel: 'He', makes: PRODUCTS.he })
    out.push({ id: 'agb', years: 0.2 * heYears, T: null, chain: null, fuel: 'He', makes: [] })
    return out
  }
  out.push({ id: 'he', years: heYears, T: heT, chain: 'alpha', fuel: 'He', makes: PRODUCTS.he })
  out.push({ id: 'c', years: late(m, 'c'), T: T20.c, chain: null, fuel: 'C', makes: PRODUCTS.c })
  if (kind === 'super') return out
  for (const id of ['ne', 'o', 'si']) out.push({ id, years: late(m, id), T: T20[id], chain: null, fuel: id === 'ne' ? 'Ne' : id === 'o' ? 'O' : 'Si', makes: PRODUCTS[id] })
  return out
}

/** How a star of m suns ends: { kind: 'fade' | 'pn' | 'one' | 'sn', remnant: 'heWD' | 'wd' | 'oneWD' |
 *  'ns' | 'bh', makes, notYet (no star like it has died yet: its life is longer than the universe's age) }. */
export function endOf(m) {
  const kind = kindOf(m)
  const total = phasesOf(m).reduce((s, p) => s + p.years, 0)
  const notYet = total > UNIVERSE_YEARS
  if (kind === 'dwarf') return { kind: 'fade', remnant: 'heWD', makes: [], notYet }
  if (kind === 'low') return { kind: 'pn', remnant: 'wd', makes: [], notYet }
  if (kind === 'super') return { kind: 'one', remnant: 'oneWD', makes: [], notYet }
  return { kind: 'sn', remnant: m < 20 ? 'ns' : 'bh', makes: PRODUCTS.sn, notYet }
}

/** The whole life in years. */
export const lifeYears = m => phasesOf(m).reduce((s, p) => s + p.years, 0)

/** The star's look at a phase, for the 3D: { radius (scene units, not to scale), color (surface) }. */
export function lookOf(m, phase, f = 0) {
  const ms = 1.05 + 0.42 * Math.log10(Math.max(0.1, m) / 0.1) / Math.log10(250)
  const hot = m < 0.5 ? '#ff8a5c' : m < 0.9 ? '#ffb86a' : m < 1.6 ? '#ffd27a' : m < 5 ? '#f4f1ff' : m < 18 ? '#bcd2ff' : '#93b4ff'
  if (phase === 'h') return { radius: ms * (1 + 0.12 * f), color: hot }
  if (phase === 'rg') return { radius: ms * (1.12 + 1.2 * f), color: '#ff9a52' }
  // (a heavy star swells into a red supergiant while its core burns helium)
  if (phase === 'he') return { radius: m >= 8 ? ms * (1.3 + 1.3 * f) : ms * 1.9, color: '#ff8a4a' }
  if (phase === 'agb') return { radius: ms * (2.1 + 0.6 * f), color: '#ff6a3a' }
  return { radius: ms * 2.7, color: '#ff7a46' }
}

/** Where the slider stands: the phase index and how far through it, from a place 0..1 along the whole
 *  life (each phase has the same share of the slider, however short it is). */
export function placeAt(m, x) {
  const n = phasesOf(m).length
  const v = Math.max(0, Math.min(1, x)) * n
  const i = Math.min(n - 1, Math.floor(v))
  return { i, f: Math.min(1, v - i) }
}

/** The star's age at phase i, f of the way through it (years since it began to shine). */
export function ageAt(m, i, f) {
  const ph = phasesOf(m)
  let s = 0
  for (let k = 0; k < i && k < ph.length; k++) s += ph[k].years
  return s + (ph[i]?.years ?? 0) * f
}
