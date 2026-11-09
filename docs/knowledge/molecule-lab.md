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
- Missions (`MISSIONS`): H2, H2O, O2, CO2, CH4, NH3, N2, HCl, C2H6, C2H4, C2H5OH, C2H2 (and the ionic and ring
  ones below). A completed one is
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

- Rings (2026-11-09, with the DNA bench, `dna.md`): benzene, glucose (its ring) and the four DNA bases are
  known by formula and skeleton (`RING_BUILDS`, `skeleton` in `chem/build.js`: any Kekulé arrangement that
  uses every hand counts), with facts and six missions (21 in all), each with its "show me". The layout
  starts a ring molecule from a flat drawing, shapes a ring closed by hand, keeps conjugated (flat) parts in
  one plane with their nitrogens flat, staggers single bonds (glucose a chair) and turns a flat molecule to
  face the view.

## Clouds (2026-11-09)

The user marked "bonds as clouds overlapping" Sooner in the family studio. The ☁ button (bottom row, kept on
the device as `ew-lab-clouds`, off by default) shows the valence electrons as clouds; the arms, clasps and
threads step aside while it is on (the Atomlings and the charges stay).

- The model (`src/worlds/lab/bondDomains.js`, pure, tested in `bondDomains.test.js`): the valence-bond picture.
  A free hand is a cloud with one electron (gold); a bond is the two hands' hybrids merged, ψ = cA·hA + cB·hB,
  two electrons (blue, each bond its own shade); a double or triple bond adds π clouds from side-by-side p
  orbitals (violet), at right angles to the plane of the atoms' other clouds (ethene's stands across its
  plane; nitrogen's two at right angles to each other); a lone pair belongs to one atom (pink); an ionic bond
  is a pair moved over to the non-metal (light blue). Hybrids are Slater-type s + λp, nodeless: λ² = 3 with
  four clouds round an atom, 2 with three, 1 with two; hydrogen and the metals' s electrons plain spheres.
  Their size from Slater's Z_eff of the valence shell over n* (one a0 is 0.96 m on the table: the lab's bonds
  are 2.3 m, about 2.4 a0). A shared cloud leans toward the more electronegative atom: cA² = (1 − p)/2 with
  p = tanh(0.55 Δχ) (Pauling's, `elements.json`). The test checks that every valence electron is in exactly one
  cloud, for whole molecules and half-built ones.
- Lone pairs: `build.js` `lonePairs` counts a free hand's electron into the pairs (a bare oxygen gets three
  "lone pairs" and two free hands, eight electrons). The clouds use `ownPairs`: valence electrons less bonds
  less free hands, halved. The layout still pushes with the larger count (harmless; bare atoms are brief).
- A bond just made: its two hands' clouds (one electron each) merge into the shared one over 0.9 s (`born`
  in lab.js, by the atoms' ids); "show me" builds a molecule with every bond merging at once.
- Drawing (`bondCloud.js`): a ray march through a sphere round all the clouds (88 steps, 60 in light mode;
  55 % of the pixels each way, 42 %), each cloud skipped outside its own sphere (`boundOf`), its light a mist
  inside its skin and a glowing skin as in the room inside the atom; the skin is where the density is 15 % of
  the cloud's brightest (`levelOf`, sampled on the CPU once per shape). The picture is laid over the lab by a
  card through the molecule's middle that faces the eye (`beforeRender` in lab.js draws the march).
- Words (`cloudWords.js`, four languages, both depths): the colours' key under the card, and one line, the most
  telling first: oxygen's paramagnetism (this picture pairs every electron; liquid O₂ sticks to a magnet: two
  unpaired π* electrons, molecular orbitals), an ionic pair, single electrons waiting, a polar bond (which atom
  pulls, its electronegativity), a π bond, else what a bond and a lone pair are.

Traps met: the picture laid on the near side of a big sphere round the molecule was cut by the table (the
sphere's lower part was behind the table top, so only a "dome" above the atoms showed): a card through the
middle instead. A skin at 9 % of the peak made clouds that swallowed the Atomlings and reached under the table;
at 24 % they nearly vanished; 15 % with a thin mist reads best.

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
- Reactions with energy (burning methane): the reactions bench (2026-11-09, `benches.md`); more molecules of life
  (amino acids, ATP).
- Clouds: molecular orbitals for oxygen (the two unpaired π* electrons), resonance in benzene's ring.
