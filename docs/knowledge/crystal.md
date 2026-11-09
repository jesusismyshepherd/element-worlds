# Growing Crystals (`/lab/crystal`, 2026-11-09)

A bench of the Molecule Lab (`benches.md`). The studio's idea `crystals-grow` (the user: Sooner): "Ions stacking
into a salt crystal you can watch grow." The lab makes an ionic compound as two Atomlings held by a thread; its
note says a real crystal has no molecules. This bench shows that: every ion among ions of the other charge.

Code: `src/worlds/benches/crystal/` (its `README.md` maps the files), the HUD `src/ui/benches/CrystalHud.jsx`.

## What there is

- A wide glass dish of salt water on the lab's glowing table, lit from above (a spot light, its cone faint in the
  air, caustics on the dish's floor), a glass rod across it with a thread hanging down. Ions drift in the water
  (Brownian: a damped random walk), cations warm orange, anions cool blue, sized by their real radii.
- The compound's two Atomlings stand on the table by the dish with their charges (Na and Cl: `+`, `−`; Mg and O:
  `2+`, `2−`). Tapping one makes it wave; an ion of its kind tapped, it waves; a crystal done, both hop.
- The dish waits until it is tapped (the water's edge pulses; the card has a "Tap the water" chip): then the water
  evaporates (the level falls, wisps of vapour rise) and a seed crystal forms on the thread (a bell, "A seed
  crystal!"); ions leave the water, fly to their places and click in (a soft pentatonic tick, a flash).
- The evaporation slider (cooling, for a melt): slow, one big perfect cube on the thread; faster, the faces sink
  in and more crystals start; fast, a hopper crystal (hollow, stepped faces) and, on brine, salt boats floating at
  the surface (hollow pyramids upside down); in a melt, small crystals on the floor. Letting go of the slider
  starts a new dish at that speed.
- Fifteen compounds (the left column; a strip at the bottom of an upright phone): the lab's ionic compounds whose
  crystals are rock salt, fluorite or antifluorite. Water ones (💧): NaCl, KCl, NaF. The rest (🔥) grow from a hot
  melt in a crucible (glowing amber, dimming as it cools, its light on the ions from below), because water would
  destroy them or they hardly dissolve; the words say which and why. The other eight of the lab's ionic
  compounds are named in "About this crystal" as having more complicated crystals (with their structure types for
  the Scientist).
- Tap an ion: the camera glides to it, it and its nearest neighbours keep their size and glow (outlines seen
  through the others), every other ion shrinks to a dot (an X-ray of the lattice), golden threads ("hugs") join
  it to each neighbour; the Scientist also sees the coordination polyhedron (octahedron, cube or tetrahedron).
  The words: Explorer "This sodium ion hugs 6 chloride ions!" (a surface ion: "hugs 3... inside the crystal every
  sodium ion hugs 6"); Scientist: radius, coordination number, polyhedron, the distance and the lattice constant.
  Tap empty space to let go.
- "See inside": every ion shrunk to 40 % of its radius, the lattice open.
- "A real grain": a zoom out of powers of ten (a wire cube ten times wider at each step coming in and shrinking
  past, the HUD saying how wide the view is: 4 nm ... 300 µm) to a white grain 0.3 mm across where the crystal
  was, with how many ions it holds (NaCl: about 1.2 × 10¹⁸; the Scientist's line shows N = 8 (L/a)³).
- Discoveries `bench:crystal:<find>` (19): `neighbours` (a tap), `perfect` (a slow crystal finished), `hopper`
  (a fast one), `grain`, and each compound grown (`bench:crystal:NaCl`...). Shown as "✦ Discoveries n/19" in the
  right card; ticked ones keep their text readable (fainter, never struck through).
- Telemetry `track('bench', { id: 'crystal', op })`: `grow` (c, s), `grown` (c, habit), `neighbours`, `grain`,
  `inside`.
- Sound: `clink` and `nucleus` (`src/audio/sound.js`), `celebrate`, `select`, `enter`; the music bed `bench` (the
  lab's, added for every bench: the engine asks for the bed by the world's kind).

## The science and its sources

- Structures: rock salt (Fm3̄m, two interpenetrating fcc lattices, CN 6:6, 4 formula units a cell), fluorite (CaF2:
  cations fcc, anions in every tetrahedral hole, CN 8:4) and antifluorite (Li2O, Na2O, K2O, Na2S: the roles
  swapped, CN 4:8). The sites are integer points (`lattice.js`); a test checks every point has its coordination
  number of neighbours, all of the other kind, and the ions per cell (8, 12, 12).
- Which compound has which structure, and the lattice constants at room temperature (pm): NaCl 564.0, KCl 629.2,
  NaF 463.3, LiF 402.7, NaH 488.0, LiH 408.3, MgO 421.2, CaO 481.1, MgS 520.3, CaS 569.5 (rock salt); CaF2 546.3
  (fluorite); Li2O 461.1, Na2O 555.0, K2O 643.6, Na2S 653.9 (antifluorite). Sources: the tables of the Wikipedia
  articles "Lattice constant" and "Fluorite structure" (the latter citing the CRC Handbook), checked against
  Sci. Rep. 13 (2023), Table 1 (Li2O 4.6117 Å, Na2O 5.544 Å, K2O 6.436 Å at 298 K).
- Ionic radii: R. D. Shannon, Acta Cryst. A32 (1976) 751, for the coordination each ion has in its structure (Na⁺
  102 pm with six neighbours, Cl⁻ 181, Ca²⁺ 112 with eight, F⁻ 131 with four, Li⁺ 59 with four, O²⁻ 142 with
  eight...), read from the `mendeleev` package (`scripts/data/.venv`). S²⁻ has a Shannon value for six only (184
  pm); in Na2S (eight) the crystal itself shows the same distance. The hydride ion has no Shannon radius (it is
  soft): here half the cell less the cation's radius (LiH 128 pm, NaH 142 pm), said so in the code. A test checks
  every compound's two radii add up to its nearest-neighbour distance within 4 %.
- Water or melt: NaCl (36.0 g per 100 g of water), KCl (34.2), NaF (4.0) crystallise from water. LiF (0.13 g) and
  CaF2 (0.0016 g) hardly dissolve: their big crystals are grown from the melt (LiF 845 °C, CaF2 1418 °C; natural
  fluorite grew from hot water in rock). The oxides, hydrides and sulfides react with water (MgO + H2O →
  Mg(OH)2, NaH + H2O → NaOH + H2, MgS + 2 H2O → Mg(OH)2 + H2S...); Na2S from water crystallises as the hydrate
  Na2S·9H2O. Melting points are the standard handbook values (as on each compound's Wikipedia page: MgO 2852 °C, CaO 2613 °C, Li2O 1438 °C, Na2O
  1132 °C, Na2S 1176 °C, LiH 689 °C). The Scientist's words say growing these from a melt is a model: some are
  made other ways (NaH from molten sodium and hydrogen; K2O decomposes on heating).
- Habits: slow growth at low supersaturation is layer by layer and gives cubes (salt, sylvite, villiaumite,
  fluorite are cubic); fast growth at high supersaturation gives hopper (skeletal) crystals, edges and corners
  ahead because they reach further into the solution (the Berg effect), and floating salt "boats" on fast-drying
  brine (inverted hollow pyramids held up by surface tension); many nuclei at high supersaturation, few at low.
- A grain 0.3 mm across: N = ions per cell × (L/a)³; NaCl 8 × (0.3 mm / 564 pm)³ = 1.20 × 10¹⁸ ions, 6.0 × 10¹⁷
  NaCl; the test checks its mass from the count (0.0585 mg) against the density 2.165 g/cm³.

## The growth model (`grow.js`, `plan.js`)

A model of the shapes, not a simulation of the water:
- An ion sticks only on a free lattice place next to ions of the other charge; each candidate weighs B^(bonds)
  (bonds scaled to six, B = 400): a new layer starts rarely and then fills at once, so faces stay flat.
- Where the crystal may grow is an envelope that widens when it is full: a cube (slow); for a hopper its faces sink
  in towards their middles by `hollow`/16 of its size, the edges kept as ridges two ions wide (one ion wide they
  would touch nothing in rock salt, whose neighbours lie along the axes: the first try left whole edges
  unreachable); for a boat, square rings, each level one wider, two ions thick, the tip solid.
- The first try, an emergent model (a supply weight growing with the distance from the middle), grew cubes well
  but blobs and needles when fast (a feedback: the farthest tip always wins); the envelope gives the real hopper
  look every time. An envelope measured along the axes keeps the cube even (each face's layers in turn).
- The plan from (compound, speed, seed): `hollow` = 0 below a third of the slider, up to 7 at the top; extra
  crystals from 0.3 up (2 boats on brine, 3 on a melt's floor); durations 46 s (slow) to 14 s (fast); the count
  shown at time t follows a smoothstep from the crystal's start. Everything comes from a seeded generator
  (mulberry32) and arithmetic on whole numbers (the weights rounded to 1/4096), so every device grows the same.

## Drawing

- Each crystal is a group with two InstancedMeshes (cations, anions; capacity counted ahead with `capacity`),
  rotated about the upright by its plan's turn. The thread crystal hangs high enough to clear the floor when full;
  a boat floats with its top at the surface, sinking as it grows and resting on the floor once the water is low;
  a melt's extra crystals sit on the floor. One scale for all: 3.3 × 10⁻⁴ scene metres per pm, so LiF's ions are
  smaller than KCl's (NaCl's cube of 15 ions is 1.4 m across).
- Growing: a few ms of the model each frame, then the new ions fly from a drifting ion of their kind (respawned
  elsewhere) over 0.6 s with a little arc and a flash on landing. A newcomer's or a saved dish jumps (no flights).
- Light mode (phones): icosahedra for spheres, 70 drifting ions of each kind instead of 170, no caustics, cone,
  vapour or landing flashes. The crystal is the same (rooms grow the same one on every device).

## Shared in a room

`shared.dish`: `{ c, s, seed, age, by }` (`age` null while it waits for a tap). Starting, a compound picked, the
slider let go and "New dish" each make a new seed and call `ctx.share('dish')`; `set(st, live, ago)` checks it
(`cleanDish`), takes `age + ago`, and a different (c, s, seed) is a fresh dish. A tap, the camera, "See inside" and
the grain stay each one's own. Discoveries for a finished crystal go to whoever started the dish (`by`); the
others see "Started by Ana". `tools/shared_steps/crystal.json` drives `shared_probe.py --world /lab/crystal`;
`tools/crystal_probe.py` compares the grown crystals' fingerprints across two screens.

## Traps met

- The RoomEnvironment's studio light and the additive light cone washed every ion white (the first look): the
  world's `envIntensity` is 0.22, the cone fades as the camera comes into it, the water is a thin tint.
- The glass dish at metalness 0.55 mirrored the spot light into a glare beside the crystal: 0.15 now.
- A tapped ion's halo as a filled additive sphere was a white blob that hid its neighbours: halos are rim-lit
  outlines (a fresnel shader) drawn through the others, the hugs plain gold.
- On a phone on its side (690 × 265) a top card plus two columns covered 69 % of the screen: that screen has its
  own layout (a narrow compound column, everything else down the right).
- `shared_probe.py --world` reads `world.interactables` (a walking world's exhibits): the bench gives an empty
  list.

## Checking

- `npm test` (`lattice.test.js`, `grow.test.js`, `plan.test.js`, `words.test.js`: structures, radii, the grain,
  the lab's list covered, determinism, cubes, hoppers, boats, capacities, every sentence in four languages and both
  depths, Polish counts).
- `tools/shot.py /lab/crystal --steps "js:__ew.world.start(); wait:8; shot:a; js:__ew.world.skip(60); ..."`. The
  world's probe hooks: `start()`, `pick(c)`, `setSpeed(s)`, `skip(seconds)`, `view(d, up, around, y)` (the camera),
  `tapIon(k, i | 'inside')`, `zoomOut()`, `state()`, `fingerprint()`.
- `tools/hud_probe.py --scene crystal-tap` (six screens), `shared_probe.py --world /lab/crystal`,
  `crystal_probe.py`.

## Next

- Rutile (MgF2) and wurtzite (AlN) are simple enough to add as lattices (tetragonal and hexagonal, with `u`);
  Li3N too. CdCl2 layers, corundum and anti-bixbyite are bigger jobs.
- Dissolving: drop a crystal back into fresh water and watch the corners go first.
- A real salt grain under a magnifying glass (a photo) beside the 0.3 mm one.
- Seeds the player places (tap the dish's floor to drop a seed crystal) for many crystals by hand.
