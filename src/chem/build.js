// The Molecule Lab's chemistry: Atomlings join hands. A molecule being built is a graph
// { atoms: [{ el }], bonds: [[i, j, order]] }. Hands are bondCount (chem/atom.js); a bond of order n
// takes n hands from each atom. Known molecules are recognised by their formula and their pattern of
// bonds (so ethanol and dimethyl ether, with the same formula, are told apart).
import { element } from '../data/elements.js'
import { bondCount, valenceElectrons } from './atom.js'

export const handsOf = sym => bondCount(element(sym))

/** Hands still free on atom i. */
export function freeHands(mol, i) {
  let used = 0
  for (const [a, b, o] of mol.bonds) if (a === i || b === i) used += o
  return handsOf(mol.atoms[i].el) - used
}

/** Join atoms i and j by one more hand each (single -> double -> triple). Returns a new molecule, or
 *  null when either has no free hand or the bond is already triple. */
export function join(mol, i, j) {
  if (i === j || freeHands(mol, i) < 1 || freeHands(mol, j) < 1) return null
  const k = mol.bonds.findIndex(([a, b]) => (a === i && b === j) || (a === j && b === i))
  if (k >= 0 && mol.bonds[k][2] >= 3) return null
  const bonds = mol.bonds.map(b => [...b])
  if (k >= 0) bonds[k][2]++
  else bonds.push([i, j, 1])
  return { atoms: mol.atoms, bonds }
}

/** Let go of the bond between i and j entirely. */
export function unjoin(mol, i, j) {
  return { atoms: mol.atoms, bonds: mol.bonds.filter(([a, b]) => !((a === i && b === j) || (a === j && b === i))) }
}

/** Remove atom i and its bonds. */
export function removeAtom(mol, i) {
  const atoms = mol.atoms.filter((_, k) => k !== i)
  const bonds = mol.bonds.filter(([a, b]) => a !== i && b !== i).map(([a, b, o]) => [a > i ? a - 1 : a, b > i ? b - 1 : b, o])
  return { atoms, bonds }
}

/** Hill order formula: C first, then H, then the rest alphabetically ("CH4", "H2O", "CO2"). */
export function formulaOf(mol) {
  const n = {}
  for (const a of mol.atoms) n[a.el] = (n[a.el] ?? 0) + 1
  const keys = Object.keys(n)
  const order = n.C ? ['C', 'H', ...keys.filter(k => k !== 'C' && k !== 'H').sort()] : keys.sort()
  return order.filter(k => n[k]).map(k => k + (n[k] > 1 ? n[k] : '')).join('')
}

/** The bonds as a sorted signature: "C-H1,C-H1,C=O..." (independent of atom order). */
export function bondPattern(mol) {
  return mol.bonds.map(([a, b, o]) => {
    const [x, y] = [mol.atoms[a].el, mol.atoms[b].el].sort()
    return `${x}${['', '-', '=', '#'][o]}${y}`
  }).sort().join(',')
}

/** Every atom connected to every other (one molecule, not two pieces). */
export function connected(mol) {
  if (mol.atoms.length <= 1) return true
  const seen = new Set([0])
  const todo = [0]
  while (todo.length) {
    const i = todo.pop()
    for (const [a, b] of mol.bonds) {
      const j = a === i ? b : b === i ? a : -1
      if (j >= 0 && !seen.has(j)) {
        seen.add(j)
        todo.push(j)
      }
    }
  }
  return seen.size === mol.atoms.length
}

/** Done: one piece, and every hand of every atom is held. */
export function complete(mol) {
  return mol.atoms.length > 1 && connected(mol) && mol.atoms.every((_, i) => freeHands(mol, i) === 0)
}

/** Lone pairs on atom i (main-group atoms): the outer electrons not used in its bonds, in pairs. They
 *  push the bonds apart like invisible hands (VSEPR): water is bent, ammonia a pyramid. */
export function lonePairs(mol, i) {
  const el = element(mol.atoms[i].el)
  if (!['s', 'p'].includes(el.block)) return 0
  let used = 0
  for (const [a, b, o] of mol.bonds) if (a === i || b === i) used += o
  return Math.max(0, Math.floor((valenceElectrons(el) - used) / 2))
}

// Molecules the lab knows, by formula and bond pattern, with their names.
const KNOWN_LIST = [
  { show: 'H2', p: 'H-H', name: { en: 'hydrogen gas', 'pt-pt': 'hidrogénio gasoso' } },
  { show: 'O2', p: 'O=O', name: { en: 'oxygen gas (what we breathe)', 'pt-pt': 'oxigénio (o que respiramos)' } },
  { show: 'N2', p: 'N#N', name: { en: 'nitrogen gas (most of the air)', 'pt-pt': 'azoto (a maior parte do ar)' } },
  { show: 'F2', p: 'F-F', name: { en: 'fluorine gas', 'pt-pt': 'flúor gasoso' } },
  { show: 'Cl2', p: 'Cl-Cl', name: { en: 'chlorine gas', 'pt-pt': 'cloro gasoso' } },
  { show: 'H2O', p: 'H-O,H-O', name: { en: 'water', 'pt-pt': 'água' } },
  { show: 'H2O2', p: 'H-O,H-O,O-O', name: { en: 'hydrogen peroxide', 'pt-pt': 'água oxigenada' } },
  { show: 'CO2', p: 'C=O,C=O', name: { en: 'carbon dioxide', 'pt-pt': 'dióxido de carbono' } },
  { show: 'CH4', p: 'C-H,C-H,C-H,C-H', name: { en: 'methane (natural gas)', 'pt-pt': 'metano (gás natural)' } },
  { show: 'NH3', p: 'H-N,H-N,H-N', name: { en: 'ammonia', 'pt-pt': 'amoníaco' } },
  { show: 'HCl', p: 'Cl-H', name: { en: 'hydrogen chloride', 'pt-pt': 'cloreto de hidrogénio' } },
  { show: 'HF', p: 'F-H', name: { en: 'hydrogen fluoride', 'pt-pt': 'fluoreto de hidrogénio' } },
  { show: 'H2S', p: 'H-S,H-S', name: { en: 'hydrogen sulfide (rotten eggs)', 'pt-pt': 'sulfureto de hidrogénio (ovos podres)' } },
  { show: 'C2H6', p: 'C-C,C-H,C-H,C-H,C-H,C-H,C-H', name: { en: 'ethane', 'pt-pt': 'etano' } },
  { show: 'C2H4', p: 'C-H,C-H,C-H,C-H,C=C', name: { en: 'ethene (it ripens fruit)', 'pt-pt': 'eteno (amadurece a fruta)' } },
  { show: 'C2H2', p: 'C#C,C-H,C-H', name: { en: 'ethyne (acetylene, for welding)', 'pt-pt': 'etino (acetileno, para soldar)' } },
  { show: 'CH3OH', p: 'C-H,C-H,C-H,C-O,H-O', name: { en: 'methanol', 'pt-pt': 'metanol' } },
  { show: 'C2H5OH', p: 'C-C,C-H,C-H,C-H,C-H,C-H,C-O,H-O', name: { en: 'ethanol', 'pt-pt': 'etanol' } },
  { show: 'CH3OCH3', p: 'C-H,C-H,C-H,C-H,C-H,C-H,C-O,C-O', name: { en: 'dimethyl ether', 'pt-pt': 'éter dimetílico' } },
  { show: 'CH2O', p: 'C-H,C-H,C=O', name: { en: 'formaldehyde', 'pt-pt': 'formaldeído' } },
  { show: 'HCN', p: 'C#N,C-H', name: { en: 'hydrogen cyanide', 'pt-pt': 'cianeto de hidrogénio' } },
  { show: 'C3H8', p: 'C-C,C-C,C-H,C-H,C-H,C-H,C-H,C-H,C-H,C-H', name: { en: 'propane (camping gas)', 'pt-pt': 'propano (gás de campismo)' } },
  { show: 'CO(NH2)2', p: 'C-N,C-N,C=O,H-N,H-N,H-N,H-N', name: { en: 'urea', 'pt-pt': 'ureia' } },
  { show: 'CH3Cl', p: 'C-Cl,C-H,C-H,C-H', name: { en: 'chloromethane', 'pt-pt': 'clorometano' } },
  { show: 'N2H4', p: 'H-N,H-N,H-N,H-N,N-N', name: { en: 'hydrazine (rocket fuel)', 'pt-pt': 'hidrazina (combustível de foguetões)' } },
  { show: 'CO', p: 'C#O', name: { en: 'carbon monoxide', 'pt-pt': 'monóxido de carbono' }, charged: true },
  { show: 'O3', p: 'O-O,O=O', name: { en: 'ozone', 'pt-pt': 'ozono' }, charged: true },
]

/** Atoms of a formula as people write it ("NH3", "C2H5OH", "CO(NH2)2"). */
export function parseFormula(text) {
  // write groups out: CO(NH2)2 -> CONH2NH2
  while (/\(/.test(text)) text = text.replace(/\(([^()]*)\)(\d*)/, (_, inner, n) => inner.repeat(Number(n || 1)))
  const atoms = []
  for (const [, el, n] of text.matchAll(/([A-Z][a-z]?)(\d*)/g)) for (let i = 0; i < Number(n || 1); i++) atoms.push({ el })
  return atoms
}

// matched by the Hill formula (C, H, then alphabetical; alphabetical without carbon: NH3 is H3N)
export const KNOWN = KNOWN_LIST.map(k => ({ ...k, hill: formulaOf({ atoms: parseFormula(k.show), bonds: [] }) }))

/** The known molecule this one is, or null. Ozone and carbon monoxide are known but cannot be closed
 *  with plain hands (they need charges), so they are recognised even with hands left over. */
export function recognise(mol) {
  const f = formulaOf(mol)
  const p = bondPattern(mol)
  return KNOWN.find(k => k.hill === f && k.p === p) ?? null
}

/** Missions for the lab, easiest first. */
export const MISSIONS = ['H2', 'H2O', 'O2', 'CO2', 'CH4', 'NH3', 'N2', 'HCl', 'C2H6', 'C2H4', 'C2H5OH', 'C2H2'].map(show => KNOWN.find(k => k.show === show || k.hill === formulaOf({ atoms: parseFormula(show), bonds: [] })))
