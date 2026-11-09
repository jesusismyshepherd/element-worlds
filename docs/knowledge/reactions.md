# Reactions: the lab's bench for balancing and running reactions (`/lab/reactions`, 2026-11-09)

The studio's idea `reactions-game` (the user: Sooner, 2026-11-09): "Burning methane, rusting and photosynthesis
as a game, with the atoms counted on both sides." Methane and rust were already things to watch in oxygen's
fire wing and photosynthesis in carbon's tree; this bench is where they are balanced by hand and then run.
The frame every bench shares: `benches.md`. The files: `src/worlds/benches/reactions/README.md`.

## What there is

- A long bench of light under the lab's night sky: before (reactants) on the left, after (products) on the
  right, a glowing arrow between. On an upright phone the bench is in two tiers: before on a raised shelf at
  the back, after in front, the arrow pointing down from one to the other (on one level the tall molecules in
  front, glucose above all, hid the back row).
- Ten reactions, picked in the HUD (a column on the left; a strip of icons at the bottom of an upright phone),
  each ticked once run: hydrogen burning (the rocket), splitting water (electrolysis, needs the battery),
  methane burning (the gas stove), making salt, making ammonia (Haber-Bosch), heating limestone (needs the
  flame), rusting iron, ethanol burning (the spirit burner), photosynthesis (needs the sun lamp) and
  respiration. Each starts with one molecule of each kind, unbalanced (limestone is balanced from the start:
  its puzzle is the heat it needs).
- Balancing: tap a molecule (or its pad) to add another of it, the − before its formula to take one away (the
  last one stays; nine is the most; a side holds at most 48 atoms, so a second glucose does not fit). The
  numbers stand on the bench in front of each kind: the coefficient, the formula (`formulaText`), the name for
  the Explorer, the state ((g), (l), (s)) for the Scientist. The HUD counts each element's atoms before and
  after (green when they match) and says what to do: the first element that does not match ("Oxygen: 2
  before, 1 after"), "every number divides by 2" when it is balanced but not in the smallest numbers (it still
  runs, with twice the energy), the energy it needs, or "tap the arrow".
- Running it: tap the arrow (or "Run it"). The molecules on the left shake, their hands let go (the bonds
  shrink back into the Atomlings), and the very same Atomlings fly over the arrow in arcs, each into a place of
  its own element in the products, which waited as glowing outlines (ghosts); a molecule's hands join when
  its last atom lands. Nothing is created and nothing lost: the probe checks every Atomling by id before,
  during and after.
- The energy, the real ΔH of the equation as written: an exothermic run bursts in its flame's colour (pale
  blue for hydrogen, blue for methane and ethanol, sodium's yellow for salt, orange for rust, warm for
  respiration), warms the bench under the products and sends sparks up from them; an endothermic one needs its
  source switched on first (tap the sun lamp, the burner or the battery; the HUD has the same switch), whose
  light pours onto the left side, and afterwards the new bonds glow with what they took in. The card says it:
  Explorer "It gave out 890 kJ of heat and light: enough to boil 2.7 litres of cold water!", Scientist
  "ΔH = −890.3 kJ for the equation as written: exothermic. Water counted as liquid."; then the reaction's fact.
- The Scientist can count the water as liquid or vapour where water comes out of a burning (hydrogen, methane,
  ethanol): the equation's state and ΔH follow (methane −890.3 or −802.3 kJ).
- Again flies the same atoms back (the bench before the run); Next goes to the next reaction.
- Discoveries: `bench:reactions:<id>` for each reaction balanced and run by this player (a run someone else in
  the room started is not theirs); the first time, a celebration in the card and the `celebrate` sound.
- Sound (`audio/sound.js`): `join` when a molecule is added, `part` when one is taken away or bonds let go,
  `right` the moment it balances, `wrong` when the arrow cannot run it, `fly` for the flight, `release` (a warm
  burst, stronger for more energy) or `absorb` (a rising shimmer) at the end, `select` and `tap` for picks and
  switches. The benches have no music bed of their own yet (`ambience('bench')` finds none: see "Next").
- Telemetry: `track('bench', { id: 'reactions', op })` with `op` pick, add, remove, run (with `m`, the multiple),
  again, source, water, found.

## The science and its sources

Standard enthalpies at 25 °C and 1 bar, for the smallest balanced equation (`chemistry.js` `REACTIONS`); the
bench multiplies by the multiple the player wrote.

| reaction | equation | ΔH (kJ) | from |
|---|---|---|---|
| hydrogen | 2 H2 + O2 → 2 H2O | −571.7 (l), −483.7 (g) | ΔfH° H2O(l) −285.83, H2O(g) −241.826 (CODATA, Cox, Wagman and Medvedev 1989) |
| water | 2 H2O(l) → 2 H2 + O2 | +571.7 | the same; ΔG = +474.3 kJ (ΔfG° H2O(l) −237.13), so E° = 1.229 V |
| methane | CH4 + 2 O2 → CO2 + 2 H2O | −890.3 (l), −802.3 (g) | ΔfH° CH4 −74.87 (NIST-JANAF, Chase 1998), CO2 −393.51 (CODATA); measured ΔcH° −890.35 ± 0.30 (Prosen and Rossini 1945) |
| salt | 2 Na + Cl2 → 2 NaCl | −822.2 | ΔfH° NaCl(s) −411.12 (NIST-JANAF) |
| ammonia | N2 + 3 H2 → 2 NH3 | −91.9 | ΔfH° NH3(g) −45.94 ± 0.35 (CODATA) |
| limestone | CaCO3 → CaO + CO2 | +178.3 | 178.3 kJ/mol at 25 °C (cementkilns.co.uk, "Thermodynamics of clinker formation"; ΔfH° calcite −1207.6, CaO −634.9 give +179.2) |
| rust | 4 Fe + 3 O2 → 2 Fe2O3 | −1651.0 | ΔfH° Fe2O3 (haematite) −825.50 (NIST-JANAF) |
| ethanol | C2H5OH(l) + 3 O2 → 2 CO2 + 3 H2O | −1367.6 (l), −1235.6 (g) | ΔcH° −1367.6 ± 0.3 (Chao and Rossini 1965, NIST WebBook) |
| photosynthesis | 6 CO2 + 6 H2O(l) → C6H12O6(s) + 6 O2 | +2803.3 | ΔcH° α-D-glucose −2803.3 ± 0.4 (NIST WebBook) |
| respiration | C6H12O6 + 6 O2 → 6 CO2 + 6 H2O(l) | −2803.3 | the same |

- Vapour instead of liquid water: 44.0 kJ less per mole of water (−285.83 − (−241.826)); the tests check it.
- The Explorer's comparison: litres of water heated from 20 °C to the boil, |ΔH| / (4.186 kJ/kg/K × 80 K).
- Facts in the cards (four languages, both depths, `words.js`): the Space Shuttle's main engines burned liquid
  hydrogen and oxygen; hydrogen's 142 MJ/kg (571.66 kJ / 4.032 g); natural gas is mostly methane, the higher and
  lower heating values; sodium's yellow at 589 nm (the D lines, 589.0 and 589.6 nm); Haber (1909) and Bosch, an
  iron catalyst at about 400 to 450 °C and 150 to 300 bar, fertiliser feeding about half of humanity (Erisman
  et al., Nature Geoscience 2008: 48 %); a lime kiln at about 900 °C, cement about 8 % of the world's CO2
  (Chatham House 2018); rust modelled as dry haematite, real rust Fe2O3·nH2O, hand warmers; Brazil's cars on
  ethanol from sugar cane; photosynthesis's oxygen from the water (oxygen-18, Ruben and Kamen, 1941), written
  truly 6 CO2 + 12 H2O → C6H12O6 + 6 O2 + 6 H2O; respiration in the mitochondria, about a third kept as ATP
  (about 30 ATP per glucose).
- What is a model: metals (Na, Fe) stand as single Atomlings for a piece of metal; NaCl, CaO, Fe2O3 and CaCO3 are
  formula units of crystals (the card says so for salt), held by the lab's ionic threads (a metal next to a
  non-metal: `chem/build.js` `ionicBond`); Fe2O3's threads O=Fe-O-Fe=O are a drawing, not a structure. Rust is
  sped up (the card says so). The equations are the overall ones; photosynthesis and respiration really go in
  many steps.
- Where the atoms go when it runs (`pairAtoms`): each atom to the nearest free place of its own element along
  the bench, so flights do not cross; first the real paths: photosynthesis's O2 takes the water's oxygen,
  respiration's water takes the O2's (the net equations cannot say where the rest go).

## How it is drawn

- Molecules are the lab's: each atom its Atomling (`createAtomling(el, { arms: false, hoop: false })`), bonds
  as arms from each atom meeting at a glowing clasp (two or three for double and triple bonds), ionic bonds a
  glowing thread. Shapes come from the lab's force layout (`chem/layout.js` `relax`, VSEPR, seeded so every
  device draws the same), turned to face the viewer (`face`: widest across, then up, a proper rotation so the
  heavier half is up and no molecule is mirrored); glucose is drawn as its ring, flat toward the viewer (a
  Haworth drawing), its OH groups in front and its H behind. Bonds are 1.55 m at full size (the lab's 2.3):
  shorter arms let the characters be bigger on a bench that must fit the screen.
- Layout (`arrange`): each kind of molecule a block of copies, side by side while there is room, else in rows
  that stand higher and half a place aside the further back they are (a stadium: every one stays in view), at
  the largest size that fits (every choice of rows is tried; each extra row must earn about 1.5 %). Both sides
  share one size, so an atom keeps its size when it flies over. Adding a molecule eases everything smaller.
- The camera fits the bench's corners and the molecules' tops into the part of the screen the HUD leaves free
  (projected, binary search), from 29 degrees above; the player may orbit (±63 degrees) and zoom; a view far
  off the fit eases back.
- The products waiting are ghosts: translucent spheres in each Atomling's body colour, thin sticks for bonds,
  breathing softly; they fade as each molecule forms.
- The passage (Revelation 21:5, the bench's `reactions` id) is in the sky up on the right over a wide bench
  (the card has the top's middle), smaller behind the shelf on an upright phone.
- Light mode: Atomlings in their light materials, fewer sparks and flames, no point lights.

## Shared in a room

One part, `bench`: `{ r, k, ph, n, on, w }` (the reaction, the coefficients, before or after, the runs counted,
the source switched on, water liquid or vapour). A run in progress reports `after`, a return `before`. In
`set`: a different reaction is built anew; new coefficients pop in live (or stand at once); `after` with a
higher `n`, live, plays the whole run on that screen (not a discovery for its viewer); not live, the bench stands
as it is. `clean` (chemistry.js) makes a state from another device safe (a known reaction, coefficients 1 to 9,
both sides within 48 atoms, `after` only when balanced). Checked with `tools/shared_probe.py --world
/lab/reactions` and `tools/shared_steps/reactions.json`.

## Traps met

- A latecomer's bench stayed "Loading..." for ever: the room's state came in while the engine was still
  compiling the bench's shaders (`engine.warm`), the bench rebuilt its molecules and disposed their materials,
  and three.js, polling the materials of the compile in progress, failed ("reading 'isReady'"). Materials let
  go now wait in a trash until no compile is under way (`ctx.engine.compiles`); geometries may go at once.
- A sphere as the burst of light showed its rim as a glass dome; a soft sprite does not. Lerping the bench's
  blue toward a warm colour gave mud; an additive pool of warmth under the products reads as heat.
- Sparks spread through a large volume read as snow: they are born at the new molecules' atoms, few, and fade
  within two seconds.
- `formulaText` takes only element symbols, digits, brackets and charges: a state like "(l)" lost its letter,
  so the state is a text of its own under the formula.
- Two copies of a molecule in one column stood exactly behind each other: rows are staggered half a place and
  raised.
- Two Vite preview servers outlived their shell after a T3 restart (the known trap): they were reused and
  stopped by their exact command line at the end.
- A shared step that waits for the bench (a run takes about three seconds) must end whatever happens: one that
  waited for a phase already passed held the machine's GPU lock for half an hour with fourteen jobs behind it
  (another session noticed). Each wait in `tools/shared_steps/reactions.json` gives up after 12 s; a probe run
  through `heavy.py` is best bounded too (a small wrapper with `subprocess.run(cmd, timeout=...)`).

## Checking

- `npm test` (`chemistry.test.js`: every molecule its formula with every hand held, every answer balanced and
  the smallest, the tally, the energies and the vapour's 44 kJ, the caps, `clean`, every atom paired to its own
  element in every reaction and multiple, the water's oxygen to O2 in photosynthesis, shapes without touching
  bodies, the layout fitting; `words.test.js`: every text in every language at both depths, no holes, no em
  dash, the facts' numbers in every language, European Portuguese).
- `py -3.11 tools/reactions_probe.py --port <preview port>`: all ten played with real taps (see `tools.md`).
- `py -3.11 tools/hud_probe.py --scene reactions`: the scenes `reactions` and `reactions-after` on all six screens.
- `py -3.11 tools/shared_probe.py --world /lab/reactions`.
- Look: `MSYS_NO_PATHCONV=1 py -3.11 tools/shot.py /lab/reactions --steps "js:__ew.world.pick('methane'); js:__ew.world.solve(); wait:1; js:__ew.world.run(); wait:4; shot:x"`
  (`solve()` sets the answer, for probes and shots; the HUD has no such button). `--phone` for the two tiers.
- The world's API for probes: `pick(id)`, `add(i)`, `remove(i)`, `run()`, `again()`, `next()`, `toggleSource()`,
  `setWater('l' | 'g')`, `solve(m)`, `answer()`, `state()` (phase, coefficients, every Atomling by id and
  element), `screenOf('arrow' | 'source' | 'add:L:0' | 'minus:R:1')`.

## Next

- A bed of music for the benches: `ambience(target.kind)` gets `'bench'`, which `BEDS` in `sound.js` lacks, so the
  benches are silent between sounds; one line (`bench: [53, 60, 64, 69]`, the lab's chord) serves all four.
- Running an unbalanced equation on purpose: the atoms that have no place stand bewildered on the arrow, the
  places with no atom stay empty (a lesson in itself).
- An energy diagram for the Scientist (reactants' and products' levels, the activation hump, a catalyst for
  ammonia lowering it).
- More reactions: propane (camping gas), the thermite reaction, baking soda and vinegar (ions in water), the
  Haber process's equilibrium with a pressure slider.
- A race in a room: who balances first.
