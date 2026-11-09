// The Reactions bench's chemistry, pure (no three.js): the reactions, their molecules as graphs, the atoms
// counted on both sides, the energy of the equation as written, which atom goes where when it runs, and
// where the molecules stand on the bench. docs/knowledge/reactions.md (the science and its sources).
//
// A reaction is species on the left (reactants) and on the right (products), each with a coefficient the
// player sets (k, left first). It is balanced when every element's atoms are as many on both sides. Every
// reaction here is one reaction (its balanced coefficients are unique up to a whole multiple), so a balanced
// k is always m times the smallest answer, and the energy is m times the reaction's ΔH.
import { parseFormula, isMetal } from '../../../chem/build.js'
import { relax } from '../../../chem/layout.js'
import { element } from '../../../data/elements.js'
import { traitsOf } from '../../../characters/traits.js'

export const MAX_K = 9 // a coefficient is one digit
export const MAX_ATOMS = 48 // atoms on one side of the bench, at most (photosynthesis needs 36)
export const BOND = 1.55 // the distance between bonded Atomlings' centres at full size (the lab's is 2.3)

// ---- the reactions ----
// dH: kJ for the smallest balanced equation at 25 °C and 1 bar, from the standard enthalpies of formation
// (NIST-JANAF and CODATA via the NIST Chemistry WebBook) or measured enthalpies of combustion; { l, g }
// where water comes out and may be counted as a liquid or as vapour. needs: the energy an endothermic one
// takes in (light, heat, power). prefer: where the atoms really go (photosynthesis's oxygen comes from the
// water, Ruben and Kamen 1941; respiration's oxygen ends in the water). flame: the colour it burns with.
export const REACTIONS = [
  { id: 'hydrogen', icon: '🚀', left: ['H2', 'O2'], right: ['H2O'], answer: [2, 1, 2], dH: { l: -571.7, g: -483.7 }, flame: '#9fc8ff' },
  { id: 'water', icon: '⚡', left: ['H2O'], right: ['H2', 'O2'], answer: [2, 2, 1], dH: 571.7, needs: 'power' },
  { id: 'methane', icon: '🔥', left: ['CH4', 'O2'], right: ['CO2', 'H2O'], answer: [1, 2, 1, 2], dH: { l: -890.3, g: -802.3 }, flame: '#5aa8ff' },
  { id: 'salt', icon: '🧂', left: ['Na', 'Cl2'], right: ['NaCl'], answer: [2, 1, 2], dH: -822.2, flame: '#ffc23d' },
  { id: 'ammonia', icon: '🌾', left: ['N2', 'H2'], right: ['NH3'], answer: [1, 3, 2], dH: -91.9, flame: '#c9b3ff' },
  { id: 'limestone', icon: '🪨', left: ['CaCO3'], right: ['CaO', 'CO2'], answer: [1, 1, 1], dH: 178.3, needs: 'heat' },
  { id: 'rust', icon: '🔩', left: ['Fe', 'O2'], right: ['Fe2O3'], answer: [4, 3, 2], dH: -1651.0, flame: '#ff8a3d' },
  { id: 'ethanol', icon: '🪔', left: ['C2H5OH', 'O2'], right: ['CO2', 'H2O'], answer: [1, 3, 2, 3], dH: { l: -1367.6, g: -1235.6 }, flame: '#6fb4ff' },
  {
    id: 'photosynthesis', icon: '🌿', left: ['CO2', 'H2O'], right: ['C6H12O6', 'O2'], answer: [6, 6, 1, 6], dH: 2803.3, needs: 'light',
    prefer: [{ el: 'O', from: 'H2O', to: 'O2' }],
  },
  {
    id: 'respiration', icon: '🫁', left: ['C6H12O6', 'O2'], right: ['CO2', 'H2O'], answer: [1, 6, 6, 6], dH: -2803.3, flame: '#ffb06b',
    prefer: [{ el: 'O', from: 'O2', to: 'H2O' }],
  },
]
export const REACTION = Object.fromEntries(REACTIONS.map(r => [r.id, r]))

/** All the species of a reaction, left then right, as k is ordered. */
export const speciesOf = r => [...r.left, ...r.right]
/** Where species i is: { side: 'L' | 'R', s: its index on that side }. */
export const sideOf = (r, i) => (i < r.left.length ? { side: 'L', s: i } : { side: 'R', s: i - r.left.length })
/** The index in k of species s on a side. */
export const indexOf = (r, side, s) => (side === 'L' ? s : r.left.length + s)

/** One of each: how every reaction starts. */
export const start = r => speciesOf(r).map(() => 1)

/** The atoms of a formula by element, in the order they first appear. */
export function atomCount(formula) {
  const n = {}
  for (const a of parseFormula(formula)) n[a.el] = (n[a.el] ?? 0) + 1
  return n
}
export const atomsIn = formula => parseFormula(formula).length

/** The atoms on one side: { el: count }. */
export function sideCount(r, k, side) {
  const list = side === 'L' ? r.left : r.right
  const n = {}
  list.forEach((f, s) => {
    for (const [el, c] of Object.entries(atomCount(f))) n[el] = (n[el] ?? 0) + c * k[indexOf(r, side, s)]
  })
  return n
}

/** Every element's atoms before and after: [{ el, left, right, ok }], in the order they first appear. */
export function tally(r, k) {
  const L = sideCount(r, k, 'L')
  const R = sideCount(r, k, 'R')
  const order = []
  for (const f of speciesOf(r)) for (const el of Object.keys(atomCount(f))) if (!order.includes(el)) order.push(el)
  return order.map(el => ({ el, left: L[el] ?? 0, right: R[el] ?? 0, ok: (L[el] ?? 0) === (R[el] ?? 0) }))
}

export const isBalanced = (r, k) => tally(r, k).every(t => t.ok)

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))
/** The greatest common divisor of the coefficients (1: the smallest whole numbers). */
export const divisor = k => k.reduce((g, x) => gcd(g, x), 0)

/** How many times the smallest balanced equation this k is (a whole number), or null when unbalanced. */
export function multipleOf(r, k) {
  if (!isBalanced(r, k)) return null
  const m = k[0] / r.answer[0]
  return Number.isInteger(m) && k.every((x, i) => x === r.answer[i] * m) ? m : null
}

/** The reaction's ΔH (kJ) for its smallest equation, with water liquid ('l') or vapour ('g'). */
export const baseEnthalpy = (r, water = 'l') => (typeof r.dH === 'number' ? r.dH : r.dH[water] ?? r.dH.l)
/** ΔH (kJ) for the equation as the player wrote it (null when not balanced). */
export function enthalpy(r, k, water = 'l') {
  const m = multipleOf(r, k)
  return m == null ? null : Math.round(baseEnthalpy(r, water) * m * 10) / 10
}
/** Does water come out (or go in) as a choice of liquid or vapour? */
export const waterChoice = r => typeof r.dH === 'object'

/** Litres of water from room temperature (20 °C) to the boil that this many kJ would heat (4.186 kJ/kg/K). */
export const boilLitres = kJ => Math.abs(kJ) / (4.186 * 80)

/** A molar mass (g/mol) from the elements' masses. */
export const molarMass = formula => parseFormula(formula).reduce((s, a) => s + element(a.el).mass, 0)

/** Atoms on a side. */
export const atomsOnSide = (r, k, side) => Object.values(sideCount(r, k, side)).reduce((s, x) => s + x, 0)

/** May another molecule of species i go on the bench? (one digit, and the side not over MAX_ATOMS) */
export function canAdd(r, k, i) {
  const { side } = sideOf(r, i)
  return k[i] < MAX_K && atomsOnSide(r, k, side) + atomsIn(speciesOf(r)[i]) <= MAX_ATOMS
}
export const canRemove = (r, k, i) => k[i] > 1

/** A state that came from another device made safe: a known reaction, coefficients in range, 'after' only
 *  when balanced. { r, k, ph, n, on, w } */
export function clean(s) {
  const r = REACTION[s?.r] ?? REACTIONS[0]
  let k = Array.isArray(s?.k) && s.k.length === speciesOf(r).length ? s.k.map(x => Math.round(Number(x))) : start(r)
  if (k.some(x => !(x >= 1 && x <= MAX_K)) || atomsOnSide(r, k, 'L') > MAX_ATOMS || atomsOnSide(r, k, 'R') > MAX_ATOMS) k = start(r)
  const ph = s?.ph === 'after' && isBalanced(r, k) ? 'after' : 'before'
  const n = Math.max(0, Math.round(Number(s?.n) || 0))
  return { r: r.id, k, ph, n, on: !!s?.on, w: s?.w === 'g' ? 'g' : 'l' }
}

// ---- which atom goes where ----

/** Pair the atoms leaving with the places waiting for them: the same element, nearest in order along the
 *  bench (so the flights do not cross), with the reaction's real paths first (prefer). from and to are
 *  [{ id, el, x, f }] (f: the formula of the molecule they are in). Returns [[fromId, toId]]; every atom
 *  of from paired once when the sides balance. */
export function pairAtoms(from, to, prefer = []) {
  const pairs = []
  const used = new Set()
  const taken = new Set()
  const byX = list => [...list].sort((a, b) => a.x - b.x || String(a.id).localeCompare(String(b.id)))
  const match = (fs, ts) => {
    const a = byX(fs.filter(x => !used.has(x.id)))
    const b = byX(ts.filter(x => !taken.has(x.id)))
    const n = Math.min(a.length, b.length)
    // spread evenly when the counts differ (the preferred paths fill only part of the places)
    for (let i = 0; i < n; i++) {
      const p = a[Math.floor(((i + 0.5) * a.length) / n)]
      const q = b[Math.floor(((i + 0.5) * b.length) / n)]
      if (used.has(p.id) || taken.has(q.id)) continue
      used.add(p.id)
      taken.add(q.id)
      pairs.push([p.id, q.id])
    }
  }
  for (const pr of prefer) match(from.filter(x => x.el === pr.el && x.f === pr.from), to.filter(x => x.el === pr.el && x.f === pr.to))
  const els = [...new Set(from.map(x => x.el))]
  for (const el of els) {
    // whatever is left, in order (twice: spreading may skip a few)
    for (let pass = 0; pass < 2; pass++) match(from.filter(x => x.el === el), to.filter(x => x.el === el))
  }
  return pairs
}

// ---- the molecules ----
// Graphs as the lab's: atoms (element symbols) and bonds [i, j, order]; a bond between a metal and a
// non-metal is ionic (a glowing thread, as in the lab: chem/build.js ionicBond). Na and Fe stand alone for
// their metals (a metal is a crowd of atoms sharing electrons; one stands for each), NaCl, CaO, Fe2O3 and
// CaCO3 are formula units of crystals. state: as written in the Scientist's equation.
export const MOLECULES = {
  H2: { atoms: ['H', 'H'], bonds: [[0, 1, 1]], state: 'g' },
  O2: { atoms: ['O', 'O'], bonds: [[0, 1, 2]], state: 'g' },
  N2: { atoms: ['N', 'N'], bonds: [[0, 1, 3]], state: 'g' },
  Cl2: { atoms: ['Cl', 'Cl'], bonds: [[0, 1, 1]], state: 'g' },
  H2O: { atoms: ['O', 'H', 'H'], bonds: [[0, 1, 1], [0, 2, 1]], state: 'l' },
  CO2: { atoms: ['C', 'O', 'O'], bonds: [[0, 1, 2], [0, 2, 2]], state: 'g' },
  CH4: { atoms: ['C', 'H', 'H', 'H', 'H'], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], state: 'g' },
  NH3: { atoms: ['N', 'H', 'H', 'H'], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], state: 'g' },
  Na: { atoms: ['Na'], bonds: [], state: 's' },
  NaCl: { atoms: ['Na', 'Cl'], bonds: [[0, 1, 1]], state: 's' },
  Fe: { atoms: ['Fe'], bonds: [], state: 's' },
  // O=Fe-O-Fe=O as threads: each Fe3+ gives three electrons, each O2- takes two
  Fe2O3: { atoms: ['Fe', 'Fe', 'O', 'O', 'O'], bonds: [[0, 2, 2], [0, 3, 1], [1, 3, 1], [1, 4, 2]], state: 's' },
  CaO: { atoms: ['Ca', 'O'], bonds: [[0, 1, 2]], state: 's' },
  // Ca2+ held to the carbonate ion's two singly bonded oxygens
  CaCO3: { atoms: ['C', 'O', 'O', 'O', 'Ca'], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [4, 2, 1], [4, 3, 1]], state: 's' },
  // ethanol: CH3-CH2-O-H
  C2H5OH: {
    atoms: ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H'],
    bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1], [1, 7, 1], [1, 8, 1]],
    state: 'l',
  },
  // glucose as its ring (beta-D-glucopyranose, the form in a leaf's starch and cellulose chains): five
  // carbons and an oxygen in the ring, the sixth carbon (CH2OH) on carbon 5, an OH on carbons 1 to 4
  C6H12O6: {
    atoms: ['C', 'C', 'C', 'C', 'C', 'O', 'C', 'O', 'O', 'O', 'O', 'O', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    bonds: [
      [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1], [4, 6, 1],
      [0, 7, 1], [1, 8, 1], [2, 9, 1], [3, 10, 1], [6, 11, 1],
      [0, 12, 1], [1, 13, 1], [2, 14, 1], [3, 15, 1], [4, 16, 1], [6, 17, 1], [6, 18, 1],
      [7, 19, 1], [8, 20, 1], [9, 21, 1], [10, 22, 1], [11, 23, 1],
    ],
    state: 's',
  },
}

export const isIonic = (mol, [a, b]) => isMetal(mol.atoms[a]) !== isMetal(mol.atoms[b])

/** The state written after a formula in this reaction: water liquid or vapour as chosen. */
export const stateOf = (formula, water = 'l') => (formula === 'H2O' ? water : MOLECULES[formula].state)

// ---- shapes ----

/** The body radius of an element's Atomling at full size (atomling.js: max(0.22, W * 0.45)). */
export function bodyRadius(el) {
  const tr = traitsOf(element(el))
  return Math.max(0.22, tr.height * tr.width * 0.45)
}

/** The eigenvectors of a symmetric 3x3 matrix (Jacobi), sorted by eigenvalue, largest first. */
function principal(m) {
  const a = m.map(r => [...r])
  let v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  for (let sweep = 0; sweep < 30; sweep++) {
    let off = 0
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) off += a[p][q] * a[p][q]
    if (off < 1e-14) break
    for (let p = 0; p < 3; p++) {
      for (let q = p + 1; q < 3; q++) {
        if (Math.abs(a[p][q]) < 1e-12) continue
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c
        for (let k = 0; k < 3; k++) {
          const akp = a[k][p]
          const akq = a[k][q]
          a[k][p] = c * akp - s * akq
          a[k][q] = s * akp + c * akq
        }
        for (let k = 0; k < 3; k++) {
          const apk = a[p][k]
          const aqk = a[q][k]
          a[p][k] = c * apk - s * aqk
          a[q][k] = s * apk + c * aqk
        }
        for (let k = 0; k < 3; k++) {
          const vkp = v[k][p]
          const vkq = v[k][q]
          v[k][p] = c * vkp - s * vkq
          v[k][q] = s * vkp + c * vkq
        }
      }
    }
  }
  return [0, 1, 2].map(i => ({ val: a[i][i], vec: [v[0][i], v[1][i], v[2][i]] })).sort((x, y) => y.val - x.val)
}

/** A shape turned to face the viewer: its widest spread across (x), the next up (y), the thinnest toward the
 *  viewer (z); a proper rotation (a mirror would make another molecule: L-glucose), its heaviest half up. */
export function face(pos, atoms) {
  const n = pos.length
  const c = [0, 1, 2].map(k => pos.reduce((s, p) => s + p[k], 0) / n)
  const d = pos.map(p => [p[0] - c[0], p[1] - c[1], p[2] - c[2]])
  if (n < 2) return d
  const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (const p of d) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) m[a][b] += p[a] * p[b]
  const [e1, e2] = principal(m).map(e => e.vec)
  const e3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  const dot = (p, e) => p[0] * e[0] + p[1] * e[1] + p[2] * e[2]
  let out = d.map(p => [dot(p, e1), dot(p, e2), dot(p, e3)])
  // the heavier atoms up (water's oxygen over its hydrogens): a half turn about x if not
  const w = atoms.map(el => element(el).mass)
  const up = out.reduce((s, p, i) => s + p[1] * w[i], 0)
  if (up < -1e-6) out = out.map(([x, y, z]) => [x, -y, -z])
  return out.map(p => p.map(x => Math.round(x * 1e4) / 1e4))
}

const SHAPES = {}
/** Where a molecule's atoms stand at full size (centred, facing the viewer): the lab's force layout (VSEPR
 *  shapes, chem/layout.js), the same on every device (it is seeded). */
export function shapeOf(formula) {
  if (SHAPES[formula]) return SHAPES[formula]
  const g = MOLECULES[formula]
  const mol = { atoms: g.atoms.map(el => ({ el })), bonds: g.bonds.map(b => [...b]) }
  let pos
  if (g.atoms.length === 1) pos = [[0, 0, 0]]
  else if (formula === 'C6H12O6') pos = glucoseFlat()
  else pos = relax(mol, {}, { steps: 600, bond: BOND }).pos
  SHAPES[formula] = face(pos, g.atoms)
  return SHAPES[formula]
}

/** Glucose drawn as chemists draw its ring (a Haworth projection): the ring flat toward the viewer, each ring
 *  carbon's OH a little in front and its H a little behind, carbon 6 (CH2OH) out past carbon 5. */
function glucoseFlat() {
  const b = BOND
  const pos = []
  const at = (deg, r = b) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r, 0]
  const from = (p, deg, z = 0, r = b) => [p[0] + Math.cos((deg * Math.PI) / 180) * r, p[1] + Math.sin((deg * Math.PI) / 180) * r, p[2] + z]
  // the ring: C1 right, then round clockwise C2, C3, C4, C5, with the ring oxygen O5 up on the right
  const ring = { 0: 0, 1: -60, 2: -120, 3: 180, 4: 120, 5: 60 }
  for (const [i, deg] of Object.entries(ring)) pos[i] = at(deg)
  // each ring carbon: the OH outward on one side (in front), the H on the other (behind)
  const subs = { 0: [7, 12, -30, 30], 1: [8, 13, -40, -90], 2: [9, 14, -140, -95], 3: [10, 15, 205, 155], 4: [6, 16, 145, 92] }
  for (const [c, [o, h, dO, dH]] of Object.entries(subs)) {
    pos[o] = from(pos[c], dO, 0.35 * b)
    pos[h] = from(pos[c], dH, -0.45 * b, b * 0.8)
  }
  // carbon 6: its oxygen further out, its two hydrogens either side
  pos[11] = from(pos[6], 165, 0.25 * b)
  pos[17] = from(pos[6], 80, -0.45 * b, b * 0.8)
  pos[18] = from(pos[6], 215, -0.55 * b, b * 0.8)
  // the hydroxyls' hydrogens
  const hy = { 7: [19, 15], 8: [20, -80], 9: [21, -100], 10: [22, 240], 11: [23, 120] }
  for (const [o, [h, deg]] of Object.entries(hy)) pos[h] = from(pos[o], deg, 0.15 * b, b * 0.8)
  return pos
}

/** A molecule's size at full size: { w, d, h } (across, deep, high) with the Atomlings' bodies. */
export function footprint(formula) {
  const pos = shapeOf(formula)
  const r = MOLECULES[formula].atoms.map(bodyRadius)
  const ext = k => {
    let lo = Infinity
    let hi = -Infinity
    pos.forEach((p, i) => {
      lo = Math.min(lo, p[k] - r[i])
      hi = Math.max(hi, p[k] + r[i])
    })
    return hi - lo
  }
  return { w: ext(0), h: ext(1), d: ext(2) }
}

// ---- where the molecules stand ----

/** Lay a side's molecules out along a strip of the bench `width` across and `depth` deep, each species in a
 *  block of copies, side by side while there is room, then in up to three rows (back rows a little higher and
 *  offset), at the largest scale (up to maxScale) at which everything fits across. sizes: [{ w, d }] at full
 *  size; counts: copies of each. Returns { scale, blocks: [{ x0, x1, cells: [[x, y, z]] }] }, x centred on the
 *  strip, at that scale. */
export function arrange(sizes, counts, { width, depth, gap = 0.5, plus = 0.9, maxScale = 1 }) {
  const layout = (s, rows) => {
    let x = 0
    const blocks = sizes.map((sz, i) => {
      const cw = sz.w * s + gap * s
      const cd = sz.d * s + gap * s * 0.6
      const r = Math.max(1, Math.min(rows[i], counts[i]))
      const cols = Math.ceil(counts[i] / r)
      // rows behind stand higher, like seats in a stadium, and half a place aside: every one stays in view
      const stagger = r > 1 ? 0.35 * cw : 0
      const x0 = x
      const cells = []
      for (let c = 0; c < counts[i]; c++) {
        const col = Math.floor(c / r)
        const row = c % r
        cells.push([x0 + (col + 0.5) * cw + (row % 2 ? stagger : 0), row * cd * 0.6, ((r - 1) / 2 - row) * cd])
      }
      x += cols * cw + stagger + (i < sizes.length - 1 ? plus : 0)
      return { x0, x1: x0 + cols * cw + stagger, cells, deep: r * cd }
    })
    return { width: x, blocks }
  }
  // the largest scale at which a choice of rows fits across (and each block's rows fit in the depth)
  const fit = rows => {
    const ok = s => {
      const l = layout(s, rows)
      return l.width <= width && l.blocks.every(b => b.deep <= depth + 1e-9)
    }
    if (ok(maxScale)) return maxScale
    let lo = 0
    let hi = maxScale
    for (let it = 0; it < 30; it++) {
      const mid = (lo + hi) / 2
      if (ok(mid)) lo = mid
      else hi = mid
    }
    return lo
  }
  // every choice of rows (a side has at most three kinds of molecule): the biggest bench wins, side by side
  // preferred (each extra row must earn its place by a few per cent)
  let rows = sizes.map(() => 1)
  let best = fit(rows)
  let score = best
  const choices = sizes.map((_, i) => Array.from({ length: Math.min(6, Math.max(1, counts[i])) }, (_, r) => r + 1))
  const each = (i, cur) => {
    if (i === sizes.length) {
      const sc = fit(cur)
      const extra = cur.reduce((n, r) => n + r - 1, 0)
      const sco = sc * Math.pow(0.985, extra)
      if (sco > score + 1e-9) {
        score = sco
        best = sc
        rows = [...cur]
      }
      return
    }
    for (const r of choices[i]) each(i + 1, [...cur, r])
  }
  each(0, [])
  const scale = Math.max(0.05, best)
  const { width: used, blocks } = layout(scale, rows)
  const shift = -used / 2
  for (const b of blocks) {
    b.x0 += shift
    b.x1 += shift
    for (const c of b.cells) c[0] += shift
    delete b.deep
  }
  return { scale, blocks }
}
