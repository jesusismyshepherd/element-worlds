// Molecules as graphs: atoms (element symbol, position in ångström, optional formal charge) and bonds
// (atom indices and order: 1 single, 2 double, 3 triple). The seed of the molecule game (docs/design.md,
// "Molecules and alloys"): an atom holds as many bonds as it has hands (bondCount), plus one for each
// positive charge and minus one for each negative, so ozone's middle oxygen (+1) holds three.
import { element } from '../data/elements.js'
import { bondCount } from './atom.js'

const D = Math.PI / 180

/** Two atoms of `el` at distance d along x (O2, N2, H2...). */
function diatomic(id, el, d, order) {
  return { id, atoms: [{ el, p: [-d / 2, 0, 0] }, { el, p: [d / 2, 0, 0] }], bonds: [[0, 1, order]] }
}

/** A central atom with two others at distance d and an angle between them. */
function bent(id, centre, other, d, angle, orders = [1, 1], charges = []) {
  const h = (angle / 2) * D
  return {
    id,
    atoms: [
      { el: centre, p: [0, 0, 0], charge: charges[0] },
      { el: other, p: [-Math.sin(h) * d, -Math.cos(h) * d, 0], charge: charges[1] },
      { el: other, p: [Math.sin(h) * d, -Math.cos(h) * d, 0], charge: charges[2] },
    ],
    bonds: [[0, 1, orders[0]], [0, 2, orders[1]]],
  }
}

function tetrahedral(id, centre, other, d) {
  const k = d / Math.sqrt(3)
  return {
    id,
    atoms: [{ el: centre, p: [0, 0, 0] }, ...[[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => ({ el: other, p: v.map(x => x * k) }))],
    bonds: [1, 2, 3, 4].map(i => [0, i, 1]),
  }
}

function pyramidal(id, centre, other, d, angle) {
  // three bonds at `angle` to each other, the lone pair on top
  const a = angle * D
  const c = Math.cos(a)
  const z = Math.sqrt((1 + 2 * c) / 3) // the bonds' downward component (as a unit vector)
  const r = Math.sqrt(1 - z * z)
  const atoms = [{ el: centre, p: [0, 0, 0] }]
  for (let i = 0; i < 3; i++) {
    const t = (i / 3) * Math.PI * 2
    atoms.push({ el: other, p: [Math.cos(t) * r * d, -z * d, Math.sin(t) * r * d] })
  }
  return { id, atoms, bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] }
}

function benzene() {
  const atoms = []
  const bonds = []
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2
    atoms.push({ el: 'C', p: [Math.cos(t) * 1.39, Math.sin(t) * 1.39, 0] })
  }
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2
    atoms.push({ el: 'H', p: [Math.cos(t) * 2.48, Math.sin(t) * 2.48, 0] })
    bonds.push([i, (i + 1) % 6, i % 2 ? 1 : 2], [i, i + 6, 1])
  }
  return { id: 'C6H6', atoms, bonds }
}

export const MOLECULES = {
  H2: diatomic('H2', 'H', 0.74, 1),
  O2: diatomic('O2', 'O', 1.21, 2),
  N2: diatomic('N2', 'N', 1.1, 3),
  CO: { id: 'CO', atoms: [{ el: 'C', p: [-0.565, 0, 0], charge: -1 }, { el: 'O', p: [0.565, 0, 0], charge: 1 }], bonds: [[0, 1, 3]] },
  CO2: { id: 'CO2', atoms: [{ el: 'C', p: [0, 0, 0] }, { el: 'O', p: [-1.16, 0, 0] }, { el: 'O', p: [1.16, 0, 0] }], bonds: [[0, 1, 2], [0, 2, 2]] },
  H2O: bent('H2O', 'O', 'H', 0.96, 104.5),
  O3: bent('O3', 'O', 'O', 1.28, 116.8, [2, 1], [1, 0, -1]),
  CH4: tetrahedral('CH4', 'C', 'H', 1.09),
  NH3: pyramidal('NH3', 'N', 'H', 1.01, 107),
  C6H6: benzene(),
  Ar: { id: 'Ar', atoms: [{ el: 'Ar', p: [0, 0, 0] }], bonds: [] },
}

/** Subscript digits for formulas: CO2 -> CO₂. */
export const formula = id => id.replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d])

/** Every atom holds exactly its hands (bondCount + its charge). Returns the atoms that do not: [] when
 *  the molecule is right. The molecule game will use this to say "this hand is still free". */
export function checkHands(mol) {
  const held = mol.atoms.map(() => 0)
  for (const [i, j, order] of mol.bonds) {
    held[i] += order
    held[j] += order
  }
  return mol.atoms
    .map((a, i) => ({ i, el: a.el, held: held[i], hands: bondCount(element(a.el)) + (a.charge ?? 0) }))
    .filter(a => a.held !== a.hands)
}
