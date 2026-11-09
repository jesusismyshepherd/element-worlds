// The Molecule Lab's electrons as clouds (the ☁ switch; the user's Sooner, 2026-11-09: "bonds as clouds
// overlapping: two atoms' clouds merging into the bond, hydrogen's two 1s clouds becoming H2, carbon's four
// clouds pointing to a tetrahedron"). Pure: which clouds a molecule has, where, and how each one's wave is
// made; bondCloud.js draws them. The model is the valence-bond picture chemists draw:
// - every free hand is a cloud with one electron in it (a half-filled orbital looking for a partner);
// - a bond is two hands' clouds merged: ψ = cA·hA + cB·hB, two electrons shared (σ, along the bond), and a
//   double or triple bond adds clouds side by side above and below it (π, from p orbitals);
// - a lone pair is a cloud with two electrons that belongs to one atom;
// - an ionic bond is a pair that has moved over to the non-metal entirely.
// Each atom's clouds are hybrids h = (s + λ·p) (Slater-type, nodeless): λ² = 3 with four clouds round the
// atom (sp³: methane's tetrahedron, water's two bonds and two lone pairs), 2 with three (sp², ethene), 1 with
// two (sp, carbon dioxide's carbon); hydrogen's is its plain 1s. Their size from Slater's Z_eff for the
// valence shell (sodium's 3s big and loose, fluorine's 2p small and tight). A shared cloud leans toward the
// atom with the higher electronegativity (Pauling's, from elements.json): water's bonds sit nearer the
// oxygen, which is why water is polar.
import { element } from '../../data/elements.js'
import { ionicBond, isMetal, freeHands } from '../../chem/build.js'
import { valenceElectrons } from '../../chem/atom.js'
import { electronsOf, N_STAR } from '../../chem/orbitals.js'

export const A0_M = 0.96 // one Bohr radius on the lab's table (its bonds are 2.3 m, about 2.4 a0)
export const MAXD = 48 // clouds drawn at most (glucose has 36)

/** How tightly an element holds its valence electrons: Slater's Z_eff / n* of its outermost s or p
 *  subshell, per metre on the table. */
const zetas = new Map()
export function zetaOf(sym) {
  if (!zetas.has(sym)) {
    const info = electronsOf(element(sym))
    const outer = info.subs.filter(s => s.l === 's' || s.l === 'p').sort((a, b) => b.n - a.n || (a.l === 'p' ? -1 : 1))[0]
    zetas.set(sym, outer.zeff / N_STAR[outer.n] / A0_M)
  }
  return zetas.get(sym)
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = a => Math.hypot(a[0], a[1], a[2])
const unit = a => {
  const l = len(a) || 1e-9
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** The share of a bond's shared cloud near each atom: cA² + cB² = 1, the more electronegative atom's
 *  bigger (a bond to an atom of the same kind is even). */
export function polarity(symA, symB) {
  const d = (element(symB).en ?? 2) - (element(symA).en ?? 2)
  const p = Math.tanh(0.55 * d)
  return { cA: Math.sqrt((1 - p) / 2), cB: Math.sqrt((1 + p) / 2), p }
}

/** The p share of an atom's hybrids: λ (s + λ p) for its number of σ clouds; hydrogen and the metals'
 *  outer s electrons none. */
export function lambdaOf(sym, around) {
  const el = element(sym)
  if (el.z === 1 || el.block === 's') return 0
  return around >= 4 ? Math.sqrt(3) : around === 3 ? Math.sqrt(2) : around === 2 ? 1 : Math.sqrt(3)
}

/** Electrons an atom keeps in pairs of its own: its valence electrons less those in its bonds and its
 *  free hands (build.js lonePairs counts a free hand's electron into the pairs). */
export function ownPairs(mol, i) {
  const el = element(mol.atoms[i].el)
  if (!['s', 'p'].includes(el.block) || isMetal(el.symbol)) return 0
  let used = 0
  for (const [a, b, o] of mol.bonds) if (a === i || b === i) used += o
  return Math.max(0, Math.floor((valenceElectrons(el) - used - Math.max(0, freeHands(mol, i))) / 2))
}

/**
 * The molecule's clouds. `pos` the atoms' places (metres, the molecule's own axes), `extra` the layout's
 * extra domains per atom ([{ kind: 'lone' | 'free', dir }], chem/layout.js), `age(i, j)` how long ago the
 * bond between atoms i and j was made (seconds; Infinity when long ago), for the merging of two hands'
 * clouds into one. Each cloud: { kind: 'sigma' | 'pi' | 'lone' | 'free' | 'ion', a, b (atom indices; b -1),
 * A, B (centres), dA, dB (axes: a hybrid's direction, or a π cloud's p axis), zA, zB, lA, lB (λ), cA, cB,
 * e (electrons), merge (0..1: 1 = a fully made bond) }.
 */
export function domainsOf(mol, pos, extra, age = () => Infinity) {
  const out = []
  const n = mol.atoms.length
  const nb = Array.from({ length: n }, () => [])
  mol.bonds.forEach(([a, b]) => {
    nb[a].push(b)
    nb[b].push(a)
  })
  const pairsOf = i => Math.min(ownPairs(mol, i), (extra[i] ?? []).filter(x => x.kind === 'lone').length)
  const freeOf = i => Math.max(0, freeHands(mol, i))
  const aroundOf = i => nb[i].length + pairsOf(i) + freeOf(i)
  const lam = i => lambdaOf(mol.atoms[i].el, aroundOf(i))
  const z = i => zetaOf(mol.atoms[i].el)
  // every σ direction round atom i but the one toward j: for a π cloud's plane
  const sigmaDirs = (i, j) => [
    ...nb[i].filter(k => k !== j).map(k => unit(sub(pos[k], pos[i]))),
    ...(extra[i] ?? []).map(x => unit(x.dir)),
  ]

  mol.bonds.forEach(bond => {
    const [a, b, order] = bond
    const ab = unit(sub(pos[b], pos[a]))
    const ba = [-ab[0], -ab[1], -ab[2]]
    if (ionicBond(mol, bond)) {
      // the metal's electrons went over: a pair (two per hand) on the non-metal, facing the metal ion
      const [m, x] = isMetal(mol.atoms[a].el) ? [a, b] : [b, a]
      const toward = unit(sub(pos[m], pos[x]))
      out.push({ kind: 'ion', a: x, b: m, A: pos[x], B: pos[m], dA: toward, dB: toward, zA: z(x), zB: z(x), lA: lam(x), lB: lam(x), cA: 1, cB: 0, e: 2 * order, merge: 1 })
      return
    }
    const { cA, cB } = polarity(mol.atoms[a].el, mol.atoms[b].el)
    const merge = Math.min(1, Math.max(0, age(a, b) / 0.9))
    out.push({ kind: 'sigma', a, b, A: pos[a], B: pos[b], dA: ab, dB: ba, zA: z(a), zB: z(b), lA: lam(a), lB: lam(b), cA, cB, e: 2, merge })
    if (order < 2) return
    // the π clouds: p orbitals at right angles to the σ clouds' plane, side by side
    const others = [...sigmaDirs(a, b), ...sigmaDirs(b, a)]
    let n1 = null
    for (const d of others) {
      const c = cross(ab, d)
      if (len(c) > 0.2) {
        n1 = unit(c)
        break
      }
    }
    if (!n1) n1 = unit(Math.abs(ab[1]) < 0.9 ? cross(ab, [0, 1, 0]) : cross(ab, [1, 0, 0]))
    const n2 = unit(cross(ab, n1))
    for (const nrm of order === 2 ? [n1] : [n1, n2]) {
      out.push({ kind: 'pi', a, b, A: pos[a], B: pos[b], dA: nrm, dB: nrm, zA: z(a), zB: z(b), lA: 0, lB: 0, cA, cB, e: 2, merge })
    }
  })
  for (let i = 0; i < n; i++) {
    const list = extra[i] ?? []
    let pairs = pairsOf(i)
    let free = freeOf(i)
    for (const x of list) {
      const d = unit(x.dir)
      if (x.kind === 'lone' && pairs > 0) {
        pairs--
        out.push({ kind: 'lone', a: i, b: -1, A: pos[i], B: pos[i], dA: d, dB: d, zA: z(i), zB: z(i), lA: lam(i), lB: lam(i), cA: 1, cB: 0, e: 2, merge: 1 })
      } else if (x.kind === 'free' && free > 0) {
        free--
        out.push({ kind: 'free', a: i, b: -1, A: pos[i], B: pos[i], dA: d, dB: d, zA: z(i), zB: z(i), lA: lam(i), lB: lam(i), cA: 1, cB: 0, e: 1, merge: 1 })
      }
    }
  }
  return out.slice(0, MAXD)
}

// ---- the waves, the same as the shader's (bondCloud.js), for each cloud's brightness ----

/** A hybrid (s + λ p) of exponent ζ along axis d, at r from its atom (Slater-type: ζ³/π normalised). */
export function hybrid(r, d, zeta, lam) {
  const l = len(r)
  return Math.sqrt((zeta ** 3) / Math.PI) * Math.exp(-zeta * l) * (1 + lam * zeta * dot(r, d)) / Math.sqrt(1 + lam * lam)
}
/** A p orbital along axis d. */
export function pOrbital(r, d, zeta) {
  return Math.sqrt((zeta ** 5) / Math.PI) * dot(r, d) * Math.exp(-zeta * len(r))
}
/** A cloud's electron density at point P (its electrons times its wave squared). */
export function density(c, P) {
  const rA = sub(P, c.A)
  const rB = sub(P, c.B)
  if (c.kind === 'pi') {
    const w = c.cA * pOrbital(rA, c.dA, c.zA) + c.cB * pOrbital(rB, c.dB, c.zB)
    return c.e * w * w
  }
  if (c.kind === 'sigma') {
    const w = c.cA * hybrid(rA, c.dA, c.zA, c.lA) + c.cB * hybrid(rB, c.dB, c.zB, c.lB)
    return c.e * w * w
  }
  const h = hybrid(rA, c.dA, c.zA, c.lA)
  return c.e * h * h
}

/** Where a cloud is and how far it reaches (metres): a sphere round it, for culling in the shader. */
export function boundOf(c) {
  const reach = 5.2 / Math.min(c.zA, c.zB)
  if (c.kind === 'sigma' || c.kind === 'pi') {
    const mid = [(c.A[0] + c.B[0]) / 2, (c.A[1] + c.B[1]) / 2, (c.A[2] + c.B[2]) / 2]
    return { at: mid, r: len(sub(c.B, c.A)) / 2 + reach }
  }
  const k = 1.2 / c.zA
  return { at: [c.A[0] + c.dA[0] * k, c.A[1] + c.dA[1] * k, c.A[2] + c.dA[2] * k], r: reach + k }
}

/** The density at a cloud's skin: its brightest point found by sampling round it, times a share. The
 *  drawing shows a mist inside the skin and a glowing skin, as the room inside the atom does. */
export function levelOf(c, share = 0.15) {
  let peak = 0
  const probe = (P) => {
    const d = density(c, P)
    if (d > peak) peak = d
  }
  const ax = c.kind === 'pi' ? c.dA : c.dA
  // along the cloud's own line and a ring round it, from its atom (or across its bond) outward
  const from = c.A
  const to = c.kind === 'sigma' || c.kind === 'pi' ? c.B : [c.A[0] + c.dA[0] * 4 / c.zA, c.A[1] + c.dA[1] * 4 / c.zA, c.A[2] + c.dA[2] * 4 / c.zA]
  const side = unit(Math.abs(ax[1]) < 0.9 ? cross(ax, [0, 1, 0]) : cross(ax, [1, 0, 0]))
  for (let i = 0; i <= 24; i++) {
    const f = i / 24
    const base = [from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f, from[2] + (to[2] - from[2]) * f]
    for (const o of [0, 0.25, 0.5, 0.9, 1.4]) {
      const k = o / Math.min(c.zA, c.zB)
      const off = c.kind === 'pi' ? ax : side
      probe([base[0] + off[0] * k, base[1] + off[1] * k, base[2] + off[2] * k])
      if (c.kind !== 'pi') probe([base[0] + c.dA[0] * k * 0.3, base[1] + c.dA[1] * k * 0.3, base[2] + c.dA[2] * k * 0.3])
    }
  }
  return Math.max(peak * share, 1e-9)
}

/** Every valence electron counted once: what the clouds hold together (a check for the tests). */
export const electronsIn = domains => domains.reduce((a, c) => a + c.e, 0)
