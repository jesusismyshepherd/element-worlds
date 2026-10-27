// The atom as the worlds and the Atomlings show it: subshells from the electron configuration, the
// shells, the outer (valence) electrons, the octet places, the hands (bonds it forms or electrons it
// gives away) and the nucleus of its commonest isotope. Pure functions over an element record
// (src/data/elements.json), so the tests can check them for all 118.

const L = { s: 0, p: 1, d: 2, f: 3 }
const CORE = {
  He: '1s2',
  Ne: '[He] 2s2 2p6',
  Ar: '[Ne] 3s2 3p6',
  Kr: '[Ar] 3d10 4s2 4p6',
  Xe: '[Kr] 4d10 5s2 5p6',
  Rn: '[Xe] 4f14 5d10 6s2 6p6',
}

/** "[He]2s2 2p2" -> [{ n: 1, l: 's', count: 2 }, { n: 2, l: 's', count: 2 }, { n: 2, l: 'p', count: 2 }],
 *  the noble-gas core written out, ordered by n then l. */
export function subshells(config) {
  const out = []
  const walk = text => {
    const core = text.match(/\[(\w+)\]/)
    if (core) walk(CORE[core[1]])
    for (const m of text.replace(/\[\w+\]/, '').matchAll(/(\d)([spdf])(\d+)/g)) {
      out.push({ n: Number(m[1]), l: m[2], count: Number(m[3]) })
    }
  }
  walk(config)
  return out.sort((a, b) => a.n - b.n || L[a.l] - L[b.l])
}

/** Electrons per shell (K, L, M, ...) from the configuration. */
export function shellsOf(config) {
  const shells = []
  for (const s of subshells(config)) shells[s.n - 1] = (shells[s.n - 1] ?? 0) + s.count
  return Array.from(shells, v => v ?? 0)
}

const MAIN = new Set(['s', 'p'])
const isMain = el => MAIN.has(el.block)

/** The outer electrons the hoop carries: for s- and p-block elements the whole outer shell; for d-
 *  and f-block elements only the s and p electrons beyond the noble-gas core (usually 2, copper 1,
 *  palladium none), since their d and f electrons sit in inner shells. */
export function valenceElectrons(el) {
  if (isMain(el)) {
    const subs = subshells(el.config)
    const top = Math.max(...subs.map(s => s.n))
    return subs.filter(s => s.n === top).reduce((a, s) => a + s.count, 0)
  }
  const own = subshells(el.config.replace(/\[\w+\]/, '')).filter(s => MAIN.has(s.l))
  const top = Math.max(0, ...own.map(s => s.n))
  return own.filter(s => s.n === top).reduce((a, s) => a + s.count, 0)
}

/** Places in the outer shell for main-group elements: 2 in the first period (the duet), else 8 (the
 *  octet). Null for d- and f-block elements, whose bonding the octet does not describe. */
export function octetPlaces(el) {
  if (!isMain(el)) return null
  return el.period === 1 ? 2 : 8
}

// The usual positive charge of metals outside the main groups (and the main-group metals that break
// the group rule by the inert-pair effect: thallium +1, lead +2); predicted for the superheavies.
const CHARGE = {
  Sc: 3, Ti: 4, V: 5, Cr: 3, Mn: 2, Fe: 3, Co: 2, Ni: 2, Cu: 2, Zn: 2,
  Y: 3, Zr: 4, Nb: 5, Mo: 6, Tc: 7, Ru: 3, Rh: 3, Pd: 2, Ag: 1, Cd: 2,
  Hf: 4, Ta: 5, W: 6, Re: 7, Os: 4, Ir: 3, Pt: 2, Au: 3, Hg: 2,
  Rf: 4, Db: 5, Sg: 6, Bh: 7, Hs: 8, Mt: 3, Ds: 2, Rg: 3, Cn: 2,
  La: 3, Ce: 3, Pr: 3, Nd: 3, Pm: 3, Sm: 3, Eu: 3, Gd: 3, Tb: 3, Dy: 3, Ho: 3, Er: 3, Tm: 3, Yb: 3, Lu: 3,
  Ac: 3, Th: 4, Pa: 5, U: 6, Np: 5, Pu: 4, Am: 3, Cm: 3, Bk: 3, Cf: 3, Es: 3, Fm: 3, Md: 3, No: 2, Lr: 3,
  Tl: 1, Pb: 2, Nh: 1, Fl: 2, Mc: 1, Lv: 2,
}

const METALS = new Set([
  'alkali-metal', 'alkaline-earth-metal', 'transition-metal', 'post-transition-metal', 'lanthanide', 'actinide',
])

export const isMetal = el => METALS.has(el.family)

/** How many bonds the element usually forms (non-metals, metalloids) or electrons it usually gives
 *  away (metals): main groups by the group (1, 2, 3 for groups 1, 2, 13; 8 minus the outer electrons
 *  from group 14 on: carbon 4, nitrogen 3, oxygen 2, the halogens 1, the noble gases none), other
 *  metals by their usual charge. */
export function bondCount(el) {
  if (CHARGE[el.symbol] != null) return CHARGE[el.symbol]
  if (el.z === 1) return 1
  if (el.family === 'noble-gas') return 0
  const g = el.group
  if (g === 1 || g === 2) return g
  if (g === 13) return 3
  if (g >= 14 && g <= 17) return 18 - g
  return 2
}

/** The Atomling's hands: the bonds (or electrons given), at most 4; a metal holds its electrons out
 *  in them (it gives), a non-metal or metalloid reaches with open hands (it shares or takes). */
export function hands(el) {
  return { count: Math.min(4, bondCount(el)), giving: isMetal(el) }
}

/** The nucleus of the commonest isotope (or the longest-lived when none occurs in nature). */
export function nucleus(el) {
  const iso = el.isotopes ?? []
  const natural = iso.filter(i => i.abundance).sort((a, b) => b.abundance - a.abundance)[0]
  const lasting = iso.filter(i => i.halfLifeSeconds).sort((a, b) => b.halfLifeSeconds - a.halfLifeSeconds)[0]
  const A = (natural ?? lasting)?.A ?? Math.round(el.mass)
  return { A, protons: el.z, neutrons: A - el.z }
}
