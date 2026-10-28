# The Molecule Lab

The seed of the molecule games (docs/design.md, "Molecules and alloys"): Atomlings join hands. Address
`/lab`; the world is `src/worlds/lab/lab.js`, its HUD `src/ui/LabHud.jsx`.

## How it works

- Chemistry (`src/chem/build.js`, pure, tested): a molecule being built is
  `{ atoms: [{ el }], bonds: [[i, j, order]] }`. Hands are `bondCount` (`chem/atom.js`): H 1, O 2, N 3,
  C 4, the halogens 1. `join(mol, i, j)` takes one free hand from each (a second join of the same pair
  makes a double bond, a third a triple); `complete(mol)`: one piece and every hand held.
- Recognition: `recognise(mol)` compares the Hill formula (C, H, then alphabetical; alphabetical without
  carbon, so ammonia is H3N) and the sorted bond pattern ("C-H,C-H,C=O"). Same formula, different
  pattern: isomers told apart (ethanol, dimethyl ether). `KNOWN` holds 27 molecules with `show`, the
  formula as people write it ("NH3", "C2H5OH", "CO(NH2)2"); `parseFormula` reads those (with groups).
  Ozone and carbon monoxide need formal charges, so they are recognised with hands left over.
- Shapes (`src/chem/layout.js`, tested): a force layout. Bonds are springs; round each atom its domains
  (bonded neighbours, lone pairs, free hands) push apart sideways on a sphere (VSEPR); lone pairs push a
  little harder, so water bends below 109.5 degrees. Every push on a neighbour has its reaction on the
  centre; a seeded jitter early on shakes the layout out of symmetric dead ends.
- Missions (`MISSIONS`): H2, H2O, O2, CO2, CH4, NH3, N2, HCl, C2H6, C2H4, C2H5OH, C2H2. A completed one is
  a discovery `lab:<show>` (`engine/progress.js`); facts for every known molecule in
  `src/content/molecules.js` (all four languages, both depths).
- Ionic compounds (2026-10-28): the metals Li, Na, K, Mg, Ca, Al are in the palette (their hands give
  electrons, 🤲). A metal joined to a non-metal is an ionic bond (`ionicBond`, `ionCharges` in
  `chem/build.js`): an electron flies across when it forms, the two show their charges (Na⁺, Cl⁻, Mg²⁺,
  O²⁻) and hold on by a glowing thread instead of hands. Two metals do not join (a note says why: metals
  share electrons among all their atoms, for the alloys to come). 23 ionic compounds are recognised by
  formula alone (a crystal, not a molecule: any arrangement will do), each with its facts; missions
  NaCl, MgO, CaCl2 (15 in all).
- A long molecule lies level, across the view (`level` in `chem/layout.js`, after every change).
- Drawing: each atom is its Atomling (`createAtomling(el, { arms: false, hoop: false })`, 0.62 of its
  size), turned to the camera; each bond is an arm from each atom meeting at a glowing clasp (two or three
  side by side for double and triple bonds); free hands reach out and wave; lone pairs show as electron
  pairs for the Scientist.

## Traps met

- The first layout made water straight: atoms sharing a neighbour also pushed each other apart and beat
  the lone pairs. Only atoms that share no neighbour get that general push.
- Then the hydrogens snapped apart before the slow lone pairs moved, and the layout froze in a saddle
  (a square instead of a tetrahedron). Faster lone pairs, reaction forces and an early jitter fixed it.
- Pushes with a part along the bond stretched every bond: only the sideways part is applied.
- Hill formulas: without carbon the order is alphabetical, so known molecules are matched by a Hill formula
  derived from their written one, never typed by hand.

- The layout shook itself at the start of every call, to escape symmetric dead ends; the lab calls it
  a few steps every frame, so the shaking added up: molecules drifted, turned and bent (calcium chloride
  to 119 degrees) over a minute. Only a fresh layout (20 steps or more) is shaken now; water then holds
  104.4 degrees for good.
- A three-atom row stood on end and sank into the table: `level` turns a clearly long layout so its
  principal axis lies along x (positions and lone-pair directions turn together; Atomlings stay upright).
- Every symbol is not a metal: `isMetal` reads the family (alkali, alkaline earth, transition,
  post-transition, lanthanide, actinide).

## Next

- Ionic compounds (a metal hands its electrons over: NaCl, MgO), alloys (metals in a sea of electrons).
- Reactions with energy (burning methane), rings (benzene), molecules of life (glucose, DNA bases).
