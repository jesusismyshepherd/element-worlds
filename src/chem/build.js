// The Molecule Lab's chemistry: Atomlings join hands. A molecule being built is a graph
// { atoms: [{ el }], bonds: [[i, j, order]] }. Hands are bondCount (chem/atom.js); a bond of order n
// takes n hands from each atom. Known molecules are recognised by their formula and their pattern of
// bonds (so ethanol and dimethyl ether, with the same formula, are told apart).
// A metal's hands hold out electrons to give: joined to a non-metal it hands them over and both become
// ions, held by attraction (an ionic bond: salt, NaCl). Two metals do not join (metals share a sea of
// electrons among many atoms instead: that is for alloys). Ionic compounds are recognised by formula.
// Rings (benzene, glucose, the DNA bases) are recognised by formula and skeleton (RING_BUILDS, skeleton).
import { element } from '../data/elements.js'
import { bondCount, valenceElectrons } from './atom.js'

export const handsOf = sym => bondCount(element(sym))

const METALS = new Set(['alkali-metal', 'alkaline-earth-metal', 'transition-metal', 'post-transition-metal', 'lanthanide', 'actinide'])
export const isMetal = sym => METALS.has(element(sym).family)

/** A bond between a metal and a non-metal is ionic: the metal's electrons have gone over. */
export const ionicBond = (mol, [a, b]) => isMetal(mol.atoms[a].el) !== isMetal(mol.atoms[b].el)

/** Each atom's charge from its ionic bonds: + for the metal (an electron given per hand), - for the
 *  other (one taken per hand). */
export function ionCharges(mol) {
  const q = mol.atoms.map(() => 0)
  for (const bond of mol.bonds) {
    if (!ionicBond(mol, bond)) continue
    const [a, b, o] = bond
    const [m, x] = isMetal(mol.atoms[a].el) ? [a, b] : [b, a]
    q[m] += o
    q[x] -= o
  }
  return q
}

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
  if (isMetal(mol.atoms[i].el) && isMetal(mol.atoms[j].el)) return null
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

// Molecules the lab knows, by formula and bond pattern, with their names in every language.
const KNOWN_LIST = [
  { show: 'H2', p: 'H-H', name: { en: 'hydrogen gas', 'pt-pt': 'hidrogénio gasoso', pl: 'wodór gazowy', de: 'Wasserstoffgas' } },
  { show: 'O2', p: 'O=O', name: { en: 'oxygen gas (what we breathe)', 'pt-pt': 'oxigénio (o que respiramos)', pl: 'tlen (którym oddychamy)', de: 'Sauerstoff (den wir atmen)' } },
  { show: 'N2', p: 'N#N', name: { en: 'nitrogen gas (most of the air)', 'pt-pt': 'azoto (a maior parte do ar)', pl: 'azot (większość powietrza)', de: 'Stickstoff (der größte Teil der Luft)' } },
  { show: 'F2', p: 'F-F', name: { en: 'fluorine gas', 'pt-pt': 'flúor gasoso', pl: 'fluor gazowy', de: 'Fluorgas' } },
  { show: 'Cl2', p: 'Cl-Cl', name: { en: 'chlorine gas', 'pt-pt': 'cloro gasoso', pl: 'chlor gazowy', de: 'Chlorgas' } },
  { show: 'H2O', p: 'H-O,H-O', name: { en: 'water', 'pt-pt': 'água', pl: 'woda', de: 'Wasser' } },
  { show: 'H2O2', p: 'H-O,H-O,O-O', name: { en: 'hydrogen peroxide', 'pt-pt': 'água oxigenada', pl: 'nadtlenek wodoru', de: 'Wasserstoffperoxid' } },
  { show: 'CO2', p: 'C=O,C=O', name: { en: 'carbon dioxide', 'pt-pt': 'dióxido de carbono', pl: 'dwutlenek węgla', de: 'Kohlenstoffdioxid' } },
  { show: 'CH4', p: 'C-H,C-H,C-H,C-H', name: { en: 'methane (natural gas)', 'pt-pt': 'metano (gás natural)', pl: 'metan (gaz ziemny)', de: 'Methan (Erdgas)' } },
  { show: 'NH3', p: 'H-N,H-N,H-N', name: { en: 'ammonia', 'pt-pt': 'amoníaco', pl: 'amoniak', de: 'Ammoniak' } },
  { show: 'HCl', p: 'Cl-H', name: { en: 'hydrogen chloride', 'pt-pt': 'cloreto de hidrogénio', pl: 'chlorowodór', de: 'Chlorwasserstoff' } },
  { show: 'HF', p: 'F-H', name: { en: 'hydrogen fluoride', 'pt-pt': 'fluoreto de hidrogénio', pl: 'fluorowodór', de: 'Fluorwasserstoff' } },
  { show: 'H2S', p: 'H-S,H-S', name: { en: 'hydrogen sulfide (rotten eggs)', 'pt-pt': 'sulfureto de hidrogénio (ovos podres)', pl: 'siarkowodór (zgniłe jaja)', de: 'Schwefelwasserstoff (faule Eier)' } },
  { show: 'C2H6', p: 'C-C,C-H,C-H,C-H,C-H,C-H,C-H', name: { en: 'ethane', 'pt-pt': 'etano', pl: 'etan', de: 'Ethan' } },
  { show: 'C2H4', p: 'C-H,C-H,C-H,C-H,C=C', name: { en: 'ethene (it ripens fruit)', 'pt-pt': 'eteno (amadurece a fruta)', pl: 'eten (przyspiesza dojrzewanie owoców)', de: 'Ethen (lässt Obst reifen)' } },
  { show: 'C2H2', p: 'C#C,C-H,C-H', name: { en: 'ethyne (acetylene, for welding)', 'pt-pt': 'etino (acetileno, para soldar)', pl: 'etyn (acetylen, do spawania)', de: 'Ethin (Acetylen, zum Schweißen)' } },
  { show: 'CH3OH', p: 'C-H,C-H,C-H,C-O,H-O', name: { en: 'methanol', 'pt-pt': 'metanol', pl: 'metanol', de: 'Methanol' } },
  { show: 'C2H5OH', p: 'C-C,C-H,C-H,C-H,C-H,C-H,C-O,H-O', name: { en: 'ethanol', 'pt-pt': 'etanol', pl: 'etanol', de: 'Ethanol' } },
  { show: 'CH3OCH3', p: 'C-H,C-H,C-H,C-H,C-H,C-H,C-O,C-O', name: { en: 'dimethyl ether', 'pt-pt': 'éter dimetílico', pl: 'eter dimetylowy', de: 'Dimethylether' } },
  { show: 'CH2O', p: 'C-H,C-H,C=O', name: { en: 'formaldehyde', 'pt-pt': 'formaldeído', pl: 'formaldehyd', de: 'Formaldehyd' } },
  { show: 'HCN', p: 'C#N,C-H', name: { en: 'hydrogen cyanide', 'pt-pt': 'cianeto de hidrogénio', pl: 'cyjanowodór', de: 'Cyanwasserstoff' } },
  { show: 'C3H8', p: 'C-C,C-C,C-H,C-H,C-H,C-H,C-H,C-H,C-H,C-H', name: { en: 'propane (camping gas)', 'pt-pt': 'propano (gás de campismo)', pl: 'propan (gaz turystyczny)', de: 'Propan (Campinggas)' } },
  { show: 'CO(NH2)2', p: 'C-N,C-N,C=O,H-N,H-N,H-N,H-N', name: { en: 'urea', 'pt-pt': 'ureia', pl: 'mocznik', de: 'Harnstoff' } },
  { show: 'CH3Cl', p: 'C-Cl,C-H,C-H,C-H', name: { en: 'chloromethane', 'pt-pt': 'clorometano', pl: 'chlorometan', de: 'Chlormethan' } },
  { show: 'N2H4', p: 'H-N,H-N,H-N,H-N,N-N', name: { en: 'hydrazine (rocket fuel)', 'pt-pt': 'hidrazina (combustível de foguetões)', pl: 'hydrazyna (paliwo rakietowe)', de: 'Hydrazin (Raketentreibstoff)' } },
  { show: 'CO', p: 'C#O', name: { en: 'carbon monoxide', 'pt-pt': 'monóxido de carbono', pl: 'tlenek węgla', de: 'Kohlenstoffmonoxid' }, charged: true },
  { show: 'O3', p: 'O-O,O=O', name: { en: 'ozone', 'pt-pt': 'ozono', pl: 'ozon', de: 'Ozon' }, charged: true },
  // rings (2026-11-09, the lab's DNA bench): recognised by their skeleton, so any arrangement of the double
  // bonds that uses every hand counts (benzene's two Kekulé rings, the bases' other ways of writing them)
  { show: 'C6H6', ring: true, name: { en: 'benzene', 'pt-pt': 'benzeno', pl: 'benzen', de: 'Benzol' } },
  { show: 'C6H12O6', ring: true, name: { en: 'glucose (the ring)', 'pt-pt': 'glicose (o anel)', pl: 'glukoza (pierścień)', de: 'Glucose (der Ring)' } },
  { show: 'C5H5N5', ring: true, name: { en: 'adenine (the A of DNA)', 'pt-pt': 'adenina (o A do ADN)', pl: 'adenina (A w DNA)', de: 'Adenin (das A der DNA)' } },
  { show: 'C5H6N2O2', ring: true, name: { en: 'thymine (the T of DNA)', 'pt-pt': 'timina (o T do ADN)', pl: 'tymina (T w DNA)', de: 'Thymin (das T der DNA)' } },
  { show: 'C5H5N5O', ring: true, name: { en: 'guanine (the G of DNA)', 'pt-pt': 'guanina (o G do ADN)', pl: 'guanina (G w DNA)', de: 'Guanin (das G der DNA)' } },
  { show: 'C4H5N3O', ring: true, name: { en: 'cytosine (the C of DNA)', 'pt-pt': 'citosina (o C do ADN)', pl: 'cytozyna (C w DNA)', de: 'Cytosin (das C der DNA)' } },
]

/** How to build each ring molecule: its atoms, then the hands joined in order (a pair twice is a double
 *  bond). Benzene as one Kekulé ring; glucose as its ring (a pyranose: five carbons and an oxygen, the
 *  sixth carbon outside as CH2OH); the four DNA bases as chemists draw them (adenine 9H-purin-6-amine,
 *  thymine 5-methyluracil, guanine 2-amino-1,9-dihydropurin-6-one, cytosine 4-aminopyrimidin-2(1H)-one).
 *  The lab's "show me" (DEMOS in src/worlds/lab/lab.js) builds the same. */
export const RING_BUILDS = {
  // C0..C5 round the ring, double bonds 0=1, 2=3, 4=5; then a hydrogen on each carbon
  C6H6: {
    atoms: ['C', 'C', 'C', 'C', 'C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[0, 1], [0, 1], [1, 2], [2, 3], [2, 3], [3, 4], [4, 5], [4, 5], [5, 0], [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]],
  },
  // C1..C6 (0-5), the ring's O5 (6), the OH oxygens on C1, C2, C3, C4, C6 (7-11), the hydrogens on the
  // carbons (12-18: C6 has two) and on the oxygens (19-23)
  C6H12O6: {
    atoms: ['C', 'C', 'C', 'C', 'C', 'C', 'O', 'O', 'O', 'O', 'O', 'O', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [6, 0], [4, 5], [0, 7], [1, 8], [2, 9], [3, 10], [5, 11],
      [0, 12], [1, 13], [2, 14], [3, 15], [4, 16], [5, 17], [5, 18], [7, 19], [8, 20], [9, 21], [10, 22], [11, 23]],
  },
  // N1 C2 N3 C4 C5 C6 N6 N7 C8 N9 (0-9); H on C2, C8, N9 and two on N6
  C5H5N5: {
    atoms: ['N', 'C', 'N', 'C', 'C', 'C', 'N', 'N', 'C', 'N', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[5, 0], [5, 0], [0, 1], [1, 2], [1, 2], [2, 3], [3, 4], [3, 4], [4, 5], [5, 6], [4, 7], [7, 8], [7, 8], [8, 9], [9, 3],
      [1, 10], [8, 11], [9, 12], [6, 13], [6, 14]],
  },
  // N1 C2 O2 N3 C4 O4 C5 C7 (the methyl) C6 (0-8); H on N1, N3, C6 and three on the methyl
  C5H6N2O2: {
    atoms: ['N', 'C', 'O', 'N', 'C', 'O', 'C', 'C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[0, 1], [1, 2], [1, 2], [1, 3], [3, 4], [4, 5], [4, 5], [4, 6], [6, 8], [6, 8], [8, 0], [6, 7],
      [0, 9], [3, 10], [8, 11], [7, 12], [7, 13], [7, 14]],
  },
  // N1 C2 N2 N3 C4 C5 C6 O6 N7 C8 N9 (0-10); H on N1, two on N2, on C8 and on N9
  C5H5N5O: {
    atoms: ['N', 'C', 'N', 'N', 'C', 'C', 'C', 'O', 'N', 'C', 'N', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[1, 2], [1, 3], [1, 3], [3, 4], [4, 5], [4, 5], [5, 8], [8, 9], [8, 9], [9, 10], [10, 4], [5, 6], [6, 7], [6, 7], [6, 0], [0, 1],
      [0, 11], [2, 12], [2, 13], [9, 14], [10, 15]],
  },
  // N1 C2 O2 N3 C4 N4 C5 C6 (0-7); H on N1, two on N4, on C5 and on C6
  C4H5N3O: {
    atoms: ['N', 'C', 'O', 'N', 'C', 'N', 'C', 'C', 'H', 'H', 'H', 'H', 'H'],
    pairs: [[4, 5], [4, 3], [4, 3], [3, 1], [1, 2], [1, 2], [1, 0], [0, 7], [7, 6], [7, 6], [6, 4], [0, 8], [5, 9], [5, 10], [6, 11], [7, 12]],
  },
}

/** A molecule from a build: its atoms, then each pair joined in turn. */
export function fromBuild({ atoms, pairs }) {
  let mol = { atoms: atoms.map(el => ({ el })), bonds: [] }
  for (const [i, j] of pairs) mol = join(mol, i, j) ?? mol
  return mol
}

/** The molecule's skeleton as a string that does not depend on the order of its atoms nor on its bond
 *  orders: each atom's element refined by its neighbours', round after round (Weisfeiler-Lehman), sorted.
 *  Benzene's two Kekulé rings give the same skeleton; fulvene, with the same formula and bond pattern as
 *  benzene, does not. */
export function skeleton(mol) {
  const n = mol.atoms.length
  const nb = mol.atoms.map(() => [])
  for (const [a, b] of mol.bonds) {
    nb[a].push(b)
    nb[b].push(a)
  }
  // a short stable hash of a string (FNV-1a), so the labels stay small round after round
  const hash = s => {
    let h = 0x811c9dc5
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0
    return h.toString(36)
  }
  let label = mol.atoms.map(a => a.el)
  for (let round = 0; round < Math.min(8, n); round++) label = label.map((l, i) => hash(`${l}|${nb[i].map(j => label[j]).sort().join(',')}`))
  return label.sort().join('.')
}

// Ionic compounds the lab knows (recognised by formula, when every bond is ionic and every hand used)
const IONIC_LIST = [
  { show: 'NaCl', name: { en: 'sodium chloride (table salt)', 'pt-pt': 'cloreto de sódio (sal de cozinha)', pl: 'chlorek sodu (sól kuchenna)', de: 'Natriumchlorid (Kochsalz)' } },
  { show: 'KCl', name: { en: 'potassium chloride', 'pt-pt': 'cloreto de potássio', pl: 'chlorek potasu', de: 'Kaliumchlorid' } },
  { show: 'NaF', name: { en: 'sodium fluoride (in toothpaste)', 'pt-pt': 'fluoreto de sódio (na pasta de dentes)', pl: 'fluorek sodu (w paście do zębów)', de: 'Natriumfluorid (in Zahnpasta)' } },
  { show: 'LiF', name: { en: 'lithium fluoride', 'pt-pt': 'fluoreto de lítio', pl: 'fluorek litu', de: 'Lithiumfluorid' } },
  { show: 'NaH', name: { en: 'sodium hydride', 'pt-pt': 'hidreto de sódio', pl: 'wodorek sodu', de: 'Natriumhydrid' } },
  { show: 'LiH', name: { en: 'lithium hydride', 'pt-pt': 'hidreto de lítio', pl: 'wodorek litu', de: 'Lithiumhydrid' } },
  { show: 'MgO', name: { en: 'magnesium oxide', 'pt-pt': 'óxido de magnésio', pl: 'tlenek magnezu', de: 'Magnesiumoxid' } },
  { show: 'CaO', name: { en: 'calcium oxide (quicklime)', 'pt-pt': 'óxido de cálcio (cal viva)', pl: 'tlenek wapnia (wapno palone)', de: 'Calciumoxid (Branntkalk)' } },
  { show: 'MgCl2', name: { en: 'magnesium chloride', 'pt-pt': 'cloreto de magnésio', pl: 'chlorek magnezu', de: 'Magnesiumchlorid' } },
  { show: 'CaCl2', name: { en: 'calcium chloride (road salt)', 'pt-pt': 'cloreto de cálcio (sal das estradas)', pl: 'chlorek wapnia (sól drogowa)', de: 'Calciumchlorid (Streusalz)' } },
  { show: 'CaF2', name: { en: 'calcium fluoride (the mineral fluorite)', 'pt-pt': 'fluoreto de cálcio (o mineral fluorite)', pl: 'fluorek wapnia (minerał fluoryt)', de: 'Calciumfluorid (das Mineral Fluorit)' } },
  { show: 'MgF2', name: { en: 'magnesium fluoride', 'pt-pt': 'fluoreto de magnésio', pl: 'fluorek magnezu', de: 'Magnesiumfluorid' } },
  { show: 'Na2O', name: { en: 'sodium oxide', 'pt-pt': 'óxido de sódio', pl: 'tlenek sodu', de: 'Natriumoxid' } },
  { show: 'K2O', name: { en: 'potassium oxide', 'pt-pt': 'óxido de potássio', pl: 'tlenek potasu', de: 'Kaliumoxid' } },
  { show: 'Li2O', name: { en: 'lithium oxide', 'pt-pt': 'óxido de lítio', pl: 'tlenek litu', de: 'Lithiumoxid' } },
  { show: 'Na2S', name: { en: 'sodium sulfide', 'pt-pt': 'sulfureto de sódio', pl: 'siarczek sodu', de: 'Natriumsulfid' } },
  { show: 'MgS', name: { en: 'magnesium sulfide', 'pt-pt': 'sulfureto de magnésio', pl: 'siarczek magnezu', de: 'Magnesiumsulfid' } },
  { show: 'CaS', name: { en: 'calcium sulfide', 'pt-pt': 'sulfureto de cálcio', pl: 'siarczek wapnia', de: 'Calciumsulfid' } },
  { show: 'Li3N', name: { en: 'lithium nitride', 'pt-pt': 'nitreto de lítio', pl: 'azotek litu', de: 'Lithiumnitrid' } },
  { show: 'Mg3N2', name: { en: 'magnesium nitride', 'pt-pt': 'nitreto de magnésio', pl: 'azotek magnezu', de: 'Magnesiumnitrid' } },
  { show: 'Al2O3', name: { en: 'aluminium oxide (corundum: ruby and sapphire)', 'pt-pt': 'óxido de alumínio (corindo: rubi e safira)', pl: 'tlenek glinu (korund: rubin i szafir)', de: 'Aluminiumoxid (Korund: Rubin und Saphir)' } },
  { show: 'AlF3', name: { en: 'aluminium fluoride', 'pt-pt': 'fluoreto de alumínio', pl: 'fluorek glinu', de: 'Aluminiumfluorid' } },
  { show: 'AlN', name: { en: 'aluminium nitride', 'pt-pt': 'nitreto de alumínio', pl: 'azotek glinu', de: 'Aluminiumnitrid' } },
].map(k => ({ ...k, ionic: true }))

/** Atoms of a formula as people write it ("NH3", "C2H5OH", "CO(NH2)2"). */
export function parseFormula(text) {
  // write groups out: CO(NH2)2 -> CONH2NH2
  while (/\(/.test(text)) text = text.replace(/\(([^()]*)\)(\d*)/, (_, inner, n) => inner.repeat(Number(n || 1)))
  const atoms = []
  for (const [, el, n] of text.matchAll(/([A-Z][a-z]?)(\d*)/g)) for (let i = 0; i < Number(n || 1); i++) atoms.push({ el })
  return atoms
}

// matched by the Hill formula (C, H, then alphabetical; alphabetical without carbon: NH3 is H3N)
export const KNOWN = [...KNOWN_LIST, ...IONIC_LIST].map(k => {
  const hill = formulaOf({ atoms: parseFormula(k.show), bonds: [] })
  if (!k.ring) return { ...k, hill }
  // a ring molecule: its bond pattern and skeleton from how it is built
  const built = fromBuild(RING_BUILDS[k.show])
  return { ...k, hill, p: bondPattern(built), skel: skeleton(built) }
})

/** The known molecule this one is, or null. Ozone and carbon monoxide are known but cannot be closed
 *  with plain hands (they need charges), so they are recognised even with hands left over. A ring
 *  molecule is known by its skeleton once every hand is held (wherever its double bonds went). */
export function recognise(mol) {
  const f = formulaOf(mol)
  const p = bondPattern(mol)
  const molecule = KNOWN.find(k => !k.ionic && !k.ring && k.hill === f && k.p === p)
  if (molecule) return molecule
  const ring = KNOWN.filter(k => k.ring && k.hill === f)
  if (ring.length && complete(mol)) {
    const s = skeleton(mol)
    const known = ring.find(k => k.skel === s)
    if (known) return known
  }
  // an ionic compound is a crystal, not a molecule: any arrangement of its ions will do
  if (mol.bonds.length && mol.bonds.every(b => ionicBond(mol, b)) && complete(mol)) return KNOWN.find(k => k.ionic && k.hill === f) ?? null
  return null
}

/** Missions for the lab, easiest first. */
export const MISSIONS = ['H2', 'H2O', 'O2', 'CO2', 'CH4', 'NH3', 'N2', 'HCl', 'C2H6', 'C2H4', 'C2H5OH', 'C2H2', 'NaCl', 'MgO', 'CaCl2',
  // rings, then the four letters of DNA (2026-11-09)
  'C6H6', 'C6H12O6', 'C5H5N5', 'C5H6N2O2', 'C5H5N5O', 'C4H5N3O'].map(show => KNOWN.find(k => k.show === show || k.hill === formulaOf({ atoms: parseFormula(show), bonds: [] })))
