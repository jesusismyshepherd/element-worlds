// The DNA bench's chemistry, pure and tested (dna.test.js): the four nucleotides as they sit in B-DNA,
// their hydrogens, which atoms hold hands across a base pair, and where each pair of a double helix goes.
//
// Coordinates (ångström) are 3DNA's standard B-DNA nucleotides (Lu & Olson 2003, x3dna-v2.4
// config/atomic/BDNA_<A|T|G|C>.pdb), in the standard base reference frame of Olson et al. (2001, J Mol Biol
// 313:229): z along the helix axis (the strand's 5' -> 3'), x towards the major groove, y towards the
// strand's backbone; the base lies flat in z = 0. The partner on the other strand is the same nucleotide of
// the complementary base turned half round the x axis: (x, y, z) -> (x, -y, -z), so the two strands run
// opposite ways (antiparallel). Each base pair's frame is the one before it turned by the twist about z and
// lifted by the rise: 360/10.5 = 34.3 degrees and 3.38 Å (B-DNA: 10.5 pairs a turn in solution, Wang 1979;
// the rise of Arnott's fibre model), which keeps every O3'-P link of the backbone at 1.6 Å (tested).
// Hydrogens are not in the source: those of the bases are placed here (in the plane, 1.08 Å from C,
// 1.01 Å from N); the backbone's are left out, as in most drawings of DNA.

export const TWIST = 360 / 10.5 // degrees per base pair
export const RISE = 3.38 // Å per base pair
export const PER_TURN = 10.5
export const MAX_PAIRS = 24
export const BASES = ['A', 'T', 'G', 'C']
const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' }
export const complement = b => PAIR[b]
export const isPurine = b => b === 'A' || b === 'G'

// the backbone and sugar (the same in all four, to a few thousandths of an ångström), then the base
const RAW = {
  A: [
    ['P', -0.299, 9.399, -1.529], ['OP1', -0.377, 10.734, -2.162], ['OP2', 0.714, 9.245, -0.46], ["O5'", -1.738, 8.985, -0.968],
    ["C5'", -2.674, 8.343, -1.855], ["C4'", -3.346, 7.182, -1.148], ["O4'", -2.596, 5.941, -1.284], ["C3'", -3.53, 7.338, 0.361],
    ["O3'", -4.771, 6.752, 0.737], ["C2'", -2.398, 6.514, 0.976], ["C1'", -2.479, 5.346, 0],
    ['N9', -1.291, 4.498, 0], ['C8', 0.024, 4.897, 0], ['N7', 0.877, 3.902, 0], ['C5', 0.071, 2.771, 0], ['C6', 0.369, 1.398, 0],
    ['N6', 1.611, 0.909, 0], ['N1', -0.668, 0.532, 0], ['C2', -1.912, 1.023, 0], ['N3', -2.32, 2.29, 0], ['C4', -1.267, 3.124, 0],
  ],
  T: [
    ['P', -0.3, 9.407, -1.526], ['OP1', -0.379, 10.743, -2.159], ['OP2', 0.712, 9.253, -0.458], ["O5'", -1.74, 8.993, -0.966],
    ["C5'", -2.676, 8.351, -1.853], ["C4'", -3.348, 7.19, -1.147], ["O4'", -2.597, 5.949, -1.283], ["C3'", -3.532, 7.346, 0.362],
    ["O3'", -4.773, 6.76, 0.737], ["C2'", -2.4, 6.521, 0.977], ["C1'", -2.481, 5.354, 0],
    ['N1', -1.284, 4.5, 0], ['C2', -1.462, 3.135, 0], ['O2', -2.562, 2.608, 0], ['N3', -0.298, 2.407, 0], ['C4', 0.994, 2.897, 0],
    ['O4', 1.944, 2.119, 0], ['C5', 1.106, 4.338, 0], ['C7', 2.466, 4.961, 0.001], ['C6', -0.024, 5.057, 0],
  ],
  G: [
    ['P', -0.296, 9.452, -1.527], ['OP1', -0.375, 10.788, -2.16], ['OP2', 0.716, 9.298, -0.458], ["O5'", -1.736, 9.038, -0.967],
    ["C5'", -2.672, 8.396, -1.854], ["C4'", -3.344, 7.235, -1.148], ["O4'", -2.593, 5.994, -1.284], ["C3'", -3.528, 7.391, 0.362],
    ["O3'", -4.769, 6.805, 0.737], ["C2'", -2.396, 6.566, 0.977], ["C1'", -2.477, 5.399, 0],
    ['N9', -1.289, 4.551, 0], ['C8', 0.023, 4.962, 0], ['N7', 0.87, 3.969, 0], ['C5', 0.071, 2.833, 0], ['C6', 0.424, 1.46, 0],
    ['O6', 1.554, 0.955, 0], ['N1', -0.7, 0.641, 0], ['C2', -1.999, 1.087, 0], ['N2', -2.949, 0.139, -0.001], ['N3', -2.342, 2.364, 0.001],
    ['C4', -1.265, 3.177, 0],
  ],
  C: [
    ['P', -0.275, 9.443, -1.528], ['OP1', -0.347, 10.779, -2.161], ['OP2', 0.736, 9.284, -0.459], ["O5'", -1.717, 9.036, -0.967],
    ["C5'", -2.657, 8.399, -1.854], ["C4'", -3.334, 7.242, -1.148], ["O4'", -2.59, 5.997, -1.284], ["C3'", -3.517, 7.399, 0.362],
    ["O3'", -4.762, 6.819, 0.737], ["C2'", -2.39, 6.569, 0.977], ["C1'", -2.477, 5.402, 0],
    ['N1', -1.285, 4.542, 0], ['C2', -1.472, 3.158, 0], ['O2', -2.628, 2.709, 0.001], ['N3', -0.391, 2.344, 0], ['C4', 0.837, 2.868, 0],
    ['N4', 1.875, 2.027, 0.001], ['C5', 1.056, 4.275, 0], ['C6', -0.023, 5.068, 0],
  ],
}

// the bonds by atom names (a double bond as chemists draw one Kekulé structure: the lab's RING_BUILDS)
const BACKBONE = [['P', 'OP1', 2], ['P', 'OP2'], ['P', "O5'"], ["O5'", "C5'"], ["C5'", "C4'"], ["C4'", "O4'"], ["C4'", "C3'"], ["C3'", "O3'"], ["C3'", "C2'"], ["C2'", "C1'"], ["C1'", "O4'"]]
const BASE_BONDS = {
  A: [['C6', 'N1', 2], ['N1', 'C2'], ['C2', 'N3', 2], ['N3', 'C4'], ['C4', 'C5', 2], ['C5', 'C6'], ['C6', 'N6'], ['C5', 'N7'], ['N7', 'C8', 2], ['C8', 'N9'], ['N9', 'C4']],
  T: [['N1', 'C2'], ['C2', 'O2', 2], ['C2', 'N3'], ['N3', 'C4'], ['C4', 'O4', 2], ['C4', 'C5'], ['C5', 'C6', 2], ['C6', 'N1'], ['C5', 'C7']],
  G: [['N2', 'C2'], ['C2', 'N3', 2], ['N3', 'C4'], ['C4', 'C5', 2], ['C5', 'N7'], ['N7', 'C8', 2], ['C8', 'N9'], ['N9', 'C4'], ['C5', 'C6'], ['C6', 'O6', 2], ['C6', 'N1'], ['N1', 'C2']],
  C: [['N4', 'C4'], ['C4', 'N3', 2], ['N3', 'C2'], ['C2', 'O2', 2], ['C2', 'N1'], ['N1', 'C6'], ['C6', 'C5', 2], ['C5', 'C4']],
}
// where the sugar holds the base: N9 of a purine, N1 of a pyrimidine
export const GLYCOSIDIC = { A: 'N9', G: 'N9', T: 'N1', C: 'N1' }
// the base's hydrogens: [name, on, kind] (ring: on the bisector outwards; amino: two at 120 degrees in the
// plane; methyl: three round the bond)
const HYDROGENS = {
  A: [['H2', 'C2', 'ring'], ['H8', 'C8', 'ring'], ['H61', 'N6', 'amino', 1], ['H62', 'N6', 'amino', -1]],
  T: [['H3', 'N3', 'ring'], ['H6', 'C6', 'ring'], ['H71', 'C7', 'methyl', 0], ['H72', 'C7', 'methyl', 1], ['H73', 'C7', 'methyl', 2]],
  G: [['H1', 'N1', 'ring'], ['H21', 'N2', 'amino', 1], ['H22', 'N2', 'amino', -1], ['H8', 'C8', 'ring']],
  C: [['H41', 'N4', 'amino', 1], ['H42', 'N4', 'amino', -1], ['H5', 'C5', 'ring'], ['H6', 'C6', 'ring']],
}
// the rings of each base, in order round each (for the coloured slabs)
export const RINGS = {
  A: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6'], ['C4', 'C5', 'N7', 'C8', 'N9']],
  G: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6'], ['C4', 'C5', 'N7', 'C8', 'N9']],
  T: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6']],
  C: [['N1', 'C2', 'N3', 'C4', 'C5', 'C6']],
}
// the hydrogen bonds of a Watson-Crick pair: [donor base, donor atom, its hydrogen, acceptor base, acceptor]
export const HBONDS = {
  AT: [['A', 'N6', 'H6*', 'T', 'O4'], ['T', 'N3', 'H3', 'A', 'N1']],
  GC: [['C', 'N4', 'H4*', 'G', 'O6'], ['G', 'N1', 'H1', 'C', 'N3'], ['G', 'N2', 'H2*', 'C', 'O2']],
}
export const pairKey = b => (b === 'A' || b === 'T' ? 'AT' : 'GC')
export const hbondCount = b => HBONDS[pairKey(b)].length

const elOf = name => (name.startsWith('OP') ? 'O' : name[0])
const v = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add: (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k],
  len: a => Math.hypot(a[0], a[1], a[2]),
  norm: a => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1
    return [a[0] / l, a[1] / l, a[2] / l]
  },
}
const dist = (a, b) => v.len(v.sub(a, b))

/** The base's hydrogens, from its heavy atoms (name -> position). `glyco`: also the one the sugar
 *  replaces in the free base (H9 or H1, along the bond to C1'). */
function hydrogensOf(b, at, glyco) {
  const bonded = name => [...BASE_BONDS[b], ["C1'", GLYCOSIDIC[b]]].flatMap(([x, y]) => (x === name ? [y] : y === name ? [x] : []))
  const out = []
  for (const [name, on, kind, k] of HYDROGENS[b]) {
    const p = at[on]
    const d = on[0] === 'N' ? 1.01 : 1.08
    const nbs = bonded(on).filter(n => at[n])
    if (kind === 'ring') {
      const dir = v.norm(nbs.reduce((s, n) => v.add(s, v.norm(v.sub(p, at[n]))), [0, 0, 0]))
      out.push([name, v.add(p, dir, d)])
    } else if (kind === 'amino') {
      // in the base's plane (z = 0), 120 degrees from the bond to the ring and from each other
      const u = v.norm(v.sub(p, at[nbs[0]]))
      const w = [-u[1], u[0], 0]
      out.push([name, v.add(v.add(p, u, d * 0.5), w, d * 0.866 * k)])
    } else {
      // the methyl: 109.5 degrees from the C5-C7 bond, one hydrogen in the plane
      const u = v.norm(v.sub(p, at[nbs[0]]))
      const w = [-u[1], u[0], 0]
      const z = [0, 0, 1]
      const a = (k * 2 * Math.PI) / 3
      const perp = v.add(v.add([0, 0, 0], w, Math.cos(a)), z, Math.sin(a))
      out.push([name, v.add(v.add(p, u, d * Math.cos((70.5 * Math.PI) / 180)), perp, d * Math.sin((70.5 * Math.PI) / 180))])
    }
  }
  if (glyco) {
    const n = GLYCOSIDIC[b]
    out.push([n === 'N9' ? 'H9' : 'H1', v.add(at[n], v.norm(v.sub(at["C1'"], at[n])), 1.01)])
  }
  return out
}

const cache = new Map()

/** A nucleotide in its base pair's frame: strand 0 as stored (this strand runs 5' -> 3' up z), strand 1
 *  the partner's way, turned half round x. { atoms: [{ name, el, p, part: 'base' | 'sugar' | 'phosphate' }],
 *  bonds: [[i, j, order]], index: name -> i }. */
export function nucleotide(b, strand = 0) {
  const key = `${b}${strand}`
  if (cache.has(key)) return cache.get(key)
  const at = Object.fromEntries(RAW[b].map(([name, x, y, z]) => [name, [x, y, z]]))
  const heavy = RAW[b].map(([name, x, y, z]) => ({ name, el: elOf(name), p: [x, y, z] }))
  const hs = hydrogensOf(b, at, false).map(([name, p]) => ({ name, el: 'H', p }))
  const part = name => (['P', 'OP1', 'OP2'].includes(name) ? 'phosphate' : name.includes("'") ? 'sugar' : 'base')
  const atoms = [...heavy, ...hs].map(a => ({ ...a, part: part(a.name), p: strand ? [a.p[0], -a.p[1], -a.p[2]] : a.p }))
  const index = Object.fromEntries(atoms.map((a, i) => [a.name, i]))
  const parent = Object.fromEntries(HYDROGENS[b].map(([name, on]) => [name, on]))
  const bonds = [
    ...BACKBONE.map(([x, y, o = 1]) => [index[x], index[y], o]),
    [index["C1'"], index[GLYCOSIDIC[b]], 1],
    ...BASE_BONDS[b].map(([x, y, o = 1]) => [index[x], index[y], o]),
    ...hs.map(h => [index[parent[h.name]], index[h.name], 1]),
  ]
  const out = { base: b, strand, atoms, bonds, index }
  cache.set(key, out)
  return out
}

/** The free base (the palette's molecule): its heavy atoms and every hydrogen (H9 or H1 where the sugar
 *  would be), centred, flat in z = 0 (but for thymine's methyl hydrogens). { atoms: [{ name, el, p }], bonds: [[i, j, order]] } */
export function freeBase(b) {
  const at = Object.fromEntries(RAW[b].map(([name, x, y, z]) => [name, [x, y, z]]))
  const names = RAW[b].map(r => r[0]).filter(n => !n.includes("'") && !n.startsWith('P') && !n.startsWith('OP'))
  const hs = hydrogensOf(b, at, true)
  const atoms = [...names.map(name => ({ name, el: elOf(name), p: at[name] })), ...hs.map(([name, p]) => ({ name, el: 'H', p }))]
  const mid = atoms.reduce((s, a) => v.add(s, a.p, 1 / atoms.length), [0, 0, 0])
  for (const a of atoms) a.p = [a.p[0] - mid[0], a.p[1] - mid[1], a.p[2]]
  const index = Object.fromEntries(atoms.map((a, i) => [a.name, i]))
  const parent = Object.fromEntries(HYDROGENS[b].map(([name, on]) => [name, on]))
  parent[GLYCOSIDIC[b] === 'N9' ? 'H9' : 'H1'] = GLYCOSIDIC[b]
  const bonds = [
    ...BASE_BONDS[b].map(([x, y, o = 1]) => [index[x], index[y], o]),
    ...atoms.filter(a => a.el === 'H').map(h => [index[parent[h.name]], index[h.name], 1]),
  ]
  return { base: b, atoms, bonds, index }
}

/** The hydrogen of a donor that points at the acceptor (an amino group has two). */
function donorH(nuc, donor, hName, accP) {
  if (!hName.endsWith('*')) return hName
  const prefix = hName.slice(0, -1)
  const cands = nuc.atoms.filter(a => a.el === 'H' && a.name.startsWith(prefix))
  return cands.reduce((best, a) => (!best || dist(a.p, accP) < dist(best.p, accP) ? a : best), null).name
}

/** The hydrogen bonds of the pair with `b` on strand 0: [{ donor: { strand, atom, h }, acceptor: { strand,
 *  atom } }], strand 0 the base itself, 1 its partner. */
const bondCache = new Map()
export function hbonds(b) {
  if (bondCache.has(b)) return bondCache.get(b)
  const mine = nucleotide(b, 0)
  const theirs = nucleotide(complement(b), 1)
  const out = HBONDS[pairKey(b)].map(([db, datom, h, ab, aatom]) => {
    const dStrand = db === b ? 0 : 1
    const dn = dStrand ? theirs : mine
    const an = dStrand ? mine : theirs
    const accP = an.atoms[an.index[aatom]].p
    return { donor: { strand: dStrand, atom: datom, h: donorH(dn, datom, h, accP) }, acceptor: { strand: 1 - dStrand, atom: aatom } }
  })
  bondCache.set(b, out)
  return out
}

/** Where base pair k stands: turned by `angle` (degrees) about the axis and `z` (Å) up it. */
export const frameAt = (k, { twist = TWIST, rise = RISE } = {}) => ({ angle: k * twist, z: k * rise })

/** A point of a base pair's frame placed in the helix (angle in degrees). */
export function place(p, angle, z) {
  const a = (angle * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2] + z]
}

/** A sequence as the bench keeps it: the letters A, T, G, C only, at most MAX_PAIRS. */
export const cleanSeq = s => (typeof s === 'string' ? s.toUpperCase().replace(/[^ATGC]/g, '').slice(0, MAX_PAIRS) : '')
/** The partner strand, read 3' -> 5' under the first (each letter's partner). */
export const partnerOf = seq => [...seq].map(complement).join('')

/** The letters of both strands counted (Chargaff: A = T and G = C in a double strand). */
export function counts(seq) {
  const n = { A: 0, T: 0, G: 0, C: 0 }
  for (const b of seq) {
    n[b]++
    n[complement(b)]++
  }
  return n
}

/** What the bench says about a strand of n pairs: its turns, its length, G+C. */
export function measure(seq) {
  const n = seq.length
  const c = counts(seq)
  return {
    n,
    turns: n / PER_TURN,
    nm: (n * RISE) / 10,
    gc: n ? Math.round(((c.G + c.C) / (2 * n)) * 100) : 0,
    hbonds: [...seq].reduce((s, b) => s + hbondCount(b), 0),
    counts: c,
  }
}

// the copy (replication): the fork runs along the helix from pair 0, a new nucleotide comes to each half
// as it opens, and the two new double helices draw apart
export const FORK_SPEED = 0.32 // seconds per base pair
export const ARRIVE = 0.7 // seconds for a new nucleotide to fly in
/** How far the copy has gone `age` seconds after it began, for a strand of n pairs: the fork's place
 *  (pairs opened, a float), each pair's opening (0 joined .. 1 the halves apart) and whether a new
 *  partner has arrived, and done. */
export function copyAt(age, n) {
  const fork = Math.max(0, age - 0.4) / FORK_SPEED
  const open = k => Math.max(0, Math.min(1, (fork - k) / 3))
  const arrived = k => Math.max(0, Math.min(1, (age - 0.4 - k * FORK_SPEED - 0.25) / ARRIVE))
  const end = copyLength(n)
  return { fork: Math.min(fork, n + 3), open, arrived, done: age >= end, apart: Math.max(0, Math.min(1, (age - end + 1.2) / 1.2)) }
}
/** Seconds the whole copy takes. */
export const copyLength = n => 0.4 + (n + 3) * FORK_SPEED + 0.25 + ARRIVE + 0.6

// the bench's finds (bench:dna:<id>): a pair of each kind, the start signal, a full turn, a copy
export const FINDS = ['at', 'gc', 'atg', 'turn', 'copy']
