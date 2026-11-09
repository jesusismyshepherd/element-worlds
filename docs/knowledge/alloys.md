# The Alloy Forge (`/lab/alloys`, 2026-11-09)

A bench of the Molecule Lab (`benches.md`). The studio's idea `alloys` ("Metals mixed into bronze, brass and
steel (iron with a little carbon)"), marked Sooner by the user on 2026-11-09. The lab tells the player that two
metals do not hold hands, because in a metal the electrons wander among all the atoms; this bench keeps that
promise. Files: `src/worlds/benches/alloys/` (its `README.md` maps them), the HUD `src/ui/benches/AlloysHud.jsx`.

## What the player does

- **The crew.** Ten metal Atomlings stand round the front of the table, each holding a lump of its metal: lead,
  tin, copper, zinc, nickel, iron, carbon, chromium, silver, gold (neighbours make alloys together). A tap
  throws one lump into the crucible (100 g; carbon goes in by the 1 g pinch, because steel holds a percent or
  two); holding one keeps them coming, faster and faster; a drag that starts on one turns the view and throws
  nothing (a throw is on release, or after 0.45 s held still). At most 30 lumps (3 kg) and 30 pinches.
- **The crucible's card** (top): the mix as a bar by mass, with each share written under it; the Scientist also
  sees it by atoms, and the lumps and grams. When the mix is in a real alloy's range it is named ("→ Bronze",
  the Scientist's grade: mild steel, 18/8 stainless (304), 18-carat rose gold, eutectic solder). A mix just out
  of range says what to add ("Almost sterling silver! Add more silver."); metals that do not dissolve in each
  other say so; carbon in anything but iron floats on top as soot and stays behind; carbon alone does not melt.
  Gold of other carats is named by its carats (22-carat gold) but is not in the book.
- **Pour** (tap the crucible, or the card's button): the crucible lifts out of the fire, flies over the anvil,
  tips, a glowing stream pours, the new ingot rises white-hot and cools through orange and red over six
  seconds. An alloy made for the first time is a discovery and a celebration. The crucible is then empty.
- **Inside the metal** (the glass case over the bench, turning to face the view): the ingot's atoms, magnified.
  Ions are spheres in their Atomlings' colours, sized by their metallic radii; carbon sits in the gaps between
  the rows; the misfits push their neighbours, so the rows go bumpy; the electron sea is a cloud of glowing
  dots drifting freely among the ions. A legend under the title names each kind.
- **Strike** (tap the hammer, the anvil, the ingot or the case; or the card's button): the hammer swings, sparks
  fly, the ingot dents (deep for soft metals, hardly at all for hard ones). Inside: in a pure metal the rows
  above a slip plane slide one place (the metal bends; the ingot also flattens and spreads a little; the
  electrons are carried along); in an alloy the rows start to slide and spring back while the misfit atoms that
  pinned them flash (the card says which: "Clonk! The tin atoms are a different size and jam the rows: bronze is
  harder."); a dilute alloy may still slip on a plane with no misfit in it; cast iron cracks along its flake of
  graphite (the ingot splits in two, the case's upper part breaks away, each half keeps its own electrons).
  Bell bronze rings like a bell. The Scientist sees the slip plane named, the hardness number and scale, the
  melting range, and the pure base metal's for comparison.
- **The alloy book** (right): the ten alloys, ticked when made; a tap shows the recipe in lumps (Explorer:
  "8 × copper + 1 × tin") or the range by mass (Scientist); once made, "Fill the crucible" throws the recipe in.
- Discoveries (`bench:alloys:<id>`, 12): the ten alloys (`bronze`, `bell`, `brass`, `cupronickel`, `stainless`,
  `steel`, `castIron`, `sterling`, `gold18`, `solder`), the first strike (`strike`), the crack of cast iron
  (`crack`). Telemetry: `track('bench', { id: 'alloys', op })`, ops `drop`, `empty`, `recipe`, `pour`, `made`,
  `strike`.
- **In a room** (`multiplayer.md`): `shared` has `crucible` (`{ mix, drops, last }`: each throw is a count, so
  the lump flies on every screen; a fill from the book flies all its lumps) and `ingot` (`{ mix, cast, strikes }`:
  a new `cast` plays the pour, one more strike plays it). The slab, its slips and its crack are computed from
  those (seeded), so every screen shows the same rows. Alone, the same two parts are the player's own and come
  back when the player does. Discoveries stay each one's own. The crucible's card says who forges with you.

## The science, and where each number comes from

Alloys are named by mass (as metallurgists and jewellers name them); the slab shows atoms, so the mix is turned
into atom fractions with each element's molar mass from `src/data/elements.json` (1% carbon by mass is about 4.5%
of the atoms, carbon being light; 12% tin is about 7% of bronze's atoms). The tests check both.

| alloy | range here (by mass) | hardness here | melting here (°C) | sources |
|---|---|---|---|---|
| bronze | Cu + 3 to 18% Sn | 102 HB (cast C90700) | 831 to 999 (C90700) | [Wikipedia: Bronze](https://en.wikipedia.org/wiki/Bronze) (modern bronze about 88/12; Bronze Age from about 3300 BC, [Bronze Age](https://en.wikipedia.org/wiki/Bronze_Age)); [Kupferinstitut](https://kupfer.de/kupferwerkstoffe/kupfer-legierungen/kupfer-zinn-legierungen-bronze/?lang=en) (wrought up to 8.5%, cast 9 to 12%); [Concast C90700](https://www.concast.com/c90700.php) |
| bell bronze | Cu + 18 to 26% Sn | 160 HB (C91300, minimum) | 818 to 889 (C91300) | [Bell metal](https://en.wikipedia.org/wiki/Bell_metal) (20 to 26%, typically 78/22); [Concast C91300](https://www.concast.com/c91300.php) (Cu 79-82, Sn 18-20, for bells); brittle: above about 15.4% Sn the hard δ phase forms ([NIST Cu-Sn](https://www.metallurgy.nist.gov/phase/solder/cusn.html), [Cambridge](https://www.phase-trans.msm.cam.ac.uk/2005/bell/bell.html)) |
| brass | Cu + 5 to 45% Zn | 65 HV (70/30 annealed) | 916 to 954 (C26000) | [Kupferinstitut](https://kupfer.de/kupferwerkstoffe/kupfer-legierungen/kupfer-zink-legierungen-messing/?lang=en) (5 to 45%; one phase up to about 37%); trumpets 70/30 "yellow brass" ([Yamaha](https://www.yamaha.com/en/musical_instrument_guide/trumpet/selection)); [Concast C26000](https://www.concast.com/c26000.php); hardness from Aurubis' C26000 softening curve (56 to 68 HV) |
| cupronickel | Cu + 10 to 30% Ni | 85 HV (CuNi25 soft: 70 to 100) | between 90/10 (1100 to 1145) and 70/30 (1170 to 1240), interpolated by nickel | [Cupronickel](https://en.wikipedia.org/wiki/Cupronickel); US 5-cent coin 75/25 since 1866 ([Nickel (US coin)](https://en.wikipedia.org/wiki/Nickel_(United_States_coin)); 1942-45 wartime coins excepted); UK 50p 75/25 ([Royal Mint](https://www.royalmint.com/discover/uk-coins/coin-design-and-specifications/fifty-pence-coin/)); euro €1 and €2 parts ([EU 975/98](https://eur-lex.europa.eu/eli/reg/1998/975/2012-07-19/eng)) |
| stainless steel | Fe + at least 10.5% Cr, at most 1.2% C (Fe at least half) | 165 HV (304 annealed, HRB 84) | 1399 to 1454 (304) | EN 10088-1 (from EN 10020: ≥ 10.5% Cr, ≤ 1.2% C); 304: Cr 18-20, Ni 8-10.5, C ≤ 0.08 ([AZoM](https://www.azom.com/article.aspx?ArticleID=965)); [Cleveland-Cliffs 304 bulletin](https://d1io3yog0oux5.cloudfront.net/_7ce3a04c09e74bf31ff5f89fc888db25/clevelandcliffs/db/1190/10510/file/CLF_ProductData_304-304LSS_052021.pdf); the passive chromium-oxide film, Harry Brearley, Sheffield 1913 ([Stainless steel](https://en.wikipedia.org/wiki/Stainless_steel), [Harry Brearley](https://en.wikipedia.org/wiki/Harry_Brearley)) |
| steel | Fe + 0.02 to 2.14% C | by carbon: pure iron 59, 1020 111, 1045 about 165, 1095 about 192 HB (annealed), straight between | the Fe-C diagram, straightened (below) | [Steel](https://en.wikipedia.org/wiki/Steel); [Callister lecture](https://courses.washington.edu/mse170/lecture_notes/rolandiF08/Lecture18-MR2008.pdf) (austenite holds at most 2.14%, ferrite 0.022%); grades: mild under 0.3%, medium to 0.6%, high above ([Carbon steel](https://en.wikipedia.org/wiki/Carbon_steel)); hardness: the ASM table (1020 annealed 111 HB) |
| cast iron | Fe + over 2.14% to about 4.5% C | 210 HB (grey iron class 30) | the Fe-C diagram (eutectic 4.3% at 1147) | [Cast iron](https://en.wikipedia.org/wiki/Cast_iron) (1.8 to 4% C); [Grey iron](https://en.wikipedia.org/wiki/Grey_iron) (2.5 to 4%; graphite flakes are where cracks start); [Ledeburite](https://en.wikipedia.org/wiki/Ledeburite) (4.3% C, 1147 °C); 6.67% C is cementite itself, not a cast iron |
| sterling silver | 92.5 to 99% Ag, the rest Cu | 60 HV (annealed 56 to 66) | about 810 to 892 | [Sterling silver](https://en.wikipedia.org/wiki/Sterling_silver); melting from a casting supplier ([Jets](https://jetsinc.com/casting-and-melting/metals-and-alloys/sterling-silver-casting-grain-925-sterling-for-casting-silver-jewelry-making-1-toz/)); hardness from jewellers' figures (a weaker source) |
| 18-carat gold | 75 to 79% Au, the rest Ag, Cu, Ni or Zn | yellow 140 HV, rose 160 HV; none for green or white here | yellow 885 to 905, rose 890 to 910 | [World Gold Council](https://www.gold.org/about-gold/about-gold-jewellery); Cookson-CLAL datasheets [3N yellow](https://www.cookson-clal.com/downloads/pdf/notes/F0860%2018K%20Jaune%203N%20751%20Mini%20FR.pdf), [4N rose](https://www.cookson-clal.com/downloads/pdf/notes/F0780%2018K%20Rose%204N%20751%20mini.pdf); colours: [Colored gold](https://en.wikipedia.org/wiki/Colored_gold) |
| solder (tin-lead) | Sn + Pb, 30 to 70% Sn | 15 HB (Sn63Pb37: 14 to 17) | the Sn-Pb diagram, straightened (below) | eutectic 61.9% Sn at 183 °C (NIST calculates 62.1% at 182.2, [NIST Pb-Sn](https://www.metallurgy.nist.gov/phase/solder/pbsn.html)); 63/37 at 183, 60/40 by 188 ([Solder](https://en.wikipedia.org/wiki/Solder)); RoHS from 1 July 2006; SAC305 solidus 217, liquidus 220 ([AIM datasheet](https://assets.testequity.com/te1/Documents/AIM_SAC305_TDS.pdf)) |

- **Grades** (`gradeOf` in `mix.js`): steel mild (< 0.3% C), medium (< 0.6%), high; stainless 304 when Cr 18 to 20% and
  Ni 8 to 10.5% (the recipe 7 Fe + 2 Cr + 1 Ni is 20/10, inside 304's range), chromium-nickel when Ni ≥ 8%, else
  chromium; solder eutectic for 60 to 64% Sn; 18-carat gold white (Ni or Zn ≥ 8%), rose (Cu at least twice Ag), green
  (Ag at least twice Cu), yellow.
- **The lines of the diagrams** (`ironMelt`, `solderMelt`): straight between their corners. Iron-carbon: pure iron 1538,
  the peritectic 1495 (0.09 to 0.53% C), austenite's most carbon 2.14% and the eutectic 4.3% at 1147 °C. Tin-lead: lead
  327, the eutectic 61.9% at 183, tin 232; the solidus is the eutectic line between 18.3% and 97.8% tin. Real liquidus
  lines curve; the card says "melts from ... to ..." and the numbers are near enough for a game.
- **Pure metals** (`PURE_HARD`): Wikipedia's [Hardnesses of the elements](https://en.wikipedia.org/wiki/Hardnesses_of_the_elements_(data_page))
  (from Samsonov 1968; MPa ÷ 9.807): Cu 37, Fe 62, Au 21, Ag 25, Cr 108, Ni 65 HV; Sn 6, Zn 35, Pb 5 HB (only Brinell
  there). Below about 300 the two scales read nearly alike; the card says which one each number is. Melting points:
  `elements.json`.
- **Atom sizes**: `elements.json`'s `radius.metallic`, mendeleev's single-bond metallic radius (Cu 118, Sn 142, Zn 121,
  Fe 117, Cr 119, Ni 115, Ag 134, Au 134, Pb 150 pm). With 12-neighbour radii (Greenwood and Earnshaw) tin is 27% bigger
  than copper, here 20%; the ratios are what the slab draws, so it uses the site's own data and says "about 20%".
  Carbon has no metallic radius: its covalent one (75 pm). It is about four times too big for iron's gaps (ferrite's
  octahedral hole takes about 19 pm, [Cottrell 2013](https://www.phase-trans.msm.cam.ac.uk/2013/Cottrell_2013.pdf)): why
  ferrite holds only 0.022% carbon, and why the drawing shows carbon pushing its neighbours apart.
- **The electron sea** (`SEA`): free electrons per atom in the free-electron model, from Ashcroft and Mermin's electron
  densities ([HyperPhysics table](https://hyperphysics.gsu.edu/hbase/Tables/fermi.html)): Cu, Ag, Au 1; Zn, Fe 2; Sn, Pb 4.
  Ni 2 and Cr 1 are not in the table (their outer 4s electrons; our convention). The slab draws about half of them
  (a light phone a third), at most 380.
- **Metals that do not mix** (`APART`, from the ASM assessments): Fe-Pb, Fe-Ag, Ag-Ni, Ag-Cr, Ni-Pb immiscible; Cu-Pb
  (as solids), Pb-Zn (two liquids, the [Parkes process](https://en.wikipedia.org/wiki/Parkes_process)), Cr-Cu nearly
  insoluble; Cu-Fe limited (iron in copper at most about 3%). Such a mix's slab draws grains of each. Fe-Sn and Fe-Zn
  form compounds (galvanising's layers) and are drawn as an ordinary mix.
- **What is a model, and said so**: the slab is the textbook picture (rows of ions, misfits that jam them). Real metals
  slip one dislocation at a time, not a whole plane (the Scientist's slip line says so). In real steel much of the
  carbon forms tiny iron carbide crystals rather than sitting in the gaps (the steel fact says so). Whether a strike
  slips or jams is a rule (`pinning` against `PIN`: the misfits in the plane's two rows, by how much their size differs,
  and the carbon in and beside the plane's gap), not mechanics; the hardness numbers come from datasheets, and the dent
  depth from them. Ions are drawn at 74% of the atom's size: an ion is smaller than its atom (it gave its outer
  electrons to the sea), and the sea shows between them.
- Facts in the words (both depths, all four languages): the Bronze Age (about 3300 BC), trumpets in 70/30 brass,
  cupronickel looking silver though three quarters copper (US 5-cent coins since 1866), stainless's passive film and
  Brearley (1913), steel's carbon and iron carbide, cast iron melting about 400 °C below iron, sterling's 925, 18 carats =
  18/24, solder's 183 °C and RoHS, pure tin's cry, galvanising, gold leaf (a gram beaten to about a square metre), the
  Romans' lead pipes (plumbum).

## How it is drawn

- `smithy.js`: the furnace is a stone hearth with a ring of rough stones (instanced dodecahedra), a bed of instanced
  coals whose colours flicker one by one past 1.0 (so they bloom), flame sprites (a teardrop drawn on a canvas), embers,
  a halo and a flickering point light that warms the crew and the case. The crucible is a lathe cup with a glowing lip;
  the melt is a disc whose colour is the mix's, its glow orange; a wandering glint; splashes (a ring and droplets);
  carbon specks. The pour moves the crucible along a path (lift, arc over, tip, a tube for the stream drawn by its draw
  range, back). The anvil (scaled 1.4) holds the ingot, a box with 32 x 12 segments on top whose top vertices are
  pushed down for each dent (normals recomputed), squashed and widened for each slip (volume kept), two halves for a
  crack; it glows white to orange to red as it cools. The hammer pivots at a wrist right of the anvil.
- `slab.js`: one InstancedMesh for the ions (252) and one for carbon; a Points cloud for the electrons, each bounced
  inside its row's extent (so they follow the staircase a slipped slab becomes) and on its own side of a crack; a faint
  glow box for the sea; the case's edges, its dark pane, the title and the legend above it (3D text). The case yaws to
  the camera.
- Slab size is the same on every device (12 x 7 x 3): a room's players must get the same strikes. Light mode changes
  the sphere detail, the coals, stones, flames, embers, sparks and electrons, never the slab.
- The crew's names lie on the table in front of their feet (3D text in the page's language).
- Camera: OrbitControls; the distance is eased to fit the bench across (and the case up) in the part of the screen
  the HUD leaves free (`engine.freeShare()`). An upright screen fits a wider half-width (the front row is nearer the
  camera than the target) and looks down from higher, so the table fills its height. The verse sits in the empty sky
  over the furnace on a wide screen and just above the case on an upright one (`skyVerse` hides it on a short screen).
- HUD (`AlloysHud.jsx`): computer: the crucible's card at the top, the anvil's card and the book on the right. Upright
  phone: the crucible's card at the top, a bar at the bottom (the ingot, the book, Strike) whose buttons open the
  ingot's card or the book as a sheet above it. Phone on its side: one column on the right. `tools/hud_probe.py
  --scene bench-alloys`: 19 to 38% covered on the six screens, nothing in the middle.

## Traps met

- The verse first stood behind the case at the top of the screen, under the crucible's card. Wide screens: the empty
  sky over the furnace; upright: above the case at the case's depth (higher in the sky it slid behind the card when the
  camera looked down from higher).
- Ions drawn at the atom's full size touch each other and hide the electron sea: drawn at 74%.
- The camera's fit only moved when the distance was outside 85 to 150% of the wanted one, so it settled 15% too near and
  the crew's ends were cut: 96%.
- `instanceColor` multiplies the material's colour: a carbon material tinted grey and an instance tinted grey came out
  nearly black. Instanced materials are white; the colour is the instance's.
- Same strikes on every screen: no random numbers inside a sort's comparator (engines call it in different orders), the
  seed from the mix and the pour's number, and the slab's size fixed for every device.
- A throw on `pointerdown` would throw a lump every time someone drags the view from an Atomling: it throws on release
  (or once held still for 0.45 s), and a move of 8 px cancels.
- A mix's mass percentages and the slab's atoms differ a lot for carbon (1% by mass, 4.5% of the atoms): the card shows
  both to the Scientist and says which is which.
- Python probes printing the cards' emoji need `sys.stdout.reconfigure(encoding='utf-8')` on the Windows console.
- `shared_probe.py --world /lab/alloys` in Git Bash needs `MSYS_NO_PATHCONV=1`, or the path becomes a Windows one.
- A `vite preview` started in a session survived the session's restart and kept port 5322; it serves the folder, so
  building into the same folder again was enough (stop it by matching `vite`, `preview` and `--port 5322`).

## Checking

- `npm test`: `mix.test.js` (every alloy by its recipe, the classic recipes and the edges, fractions, the crucible's
  room, hardness and melting, the slab, determinism, slip/jam/crack, the slab kept near the anvil) and `words.test.js`
  (every language has every key of the same kind, translated, no em dashes, the sentences for every alloy, metal,
  strike and line, decimal commas, Polish and German grammar).
- `py -3.11 tools/alloys_probe.py --port 5322`: by hand on a computer and a phone, every language at both depths (see
  `tools.md`). 2026-11-09: all ok.
- `MSYS_NO_PATHCONV=1 py -3.11 tools/hud_probe.py --port 5322 --scene bench-alloys`: all six screens ok.
- `MSYS_NO_PATHCONV=1 py -3.11 tools/shared_probe.py --world /lab/alloys --base http://localhost:5322`: every throw, pour
  and strike in step for Bob, the latecomer finds it as Ana has it (2026-11-09: all ok; `strike` right after a pour is
  quiet, as a strike waits for the pour to end). It leaves probe rooms `PRB...` in `ew_room_world`.
- Look: `MSYS_NO_PATHCONV=1 py -3.11 tools/shot.py /lab/alloys --port 5322 --steps "js:__ew.world.recipe('bronze');
  wait:1.4; js:__ew.world.pour(); wait:4.2; js:__ew.world.strike(); wait:0.45; shot:struck"`. The world's probe API:
  `drop(el)`, `pour()`, `strike()`, `empty()`, `recipe(id)`, `state()`, `points()`.

## Next

- Heat: the furnace's temperature by its bellows (a slider), each metal melting at its own point: why the Bronze Age
  came before iron (copper 1085 °C, iron 1538 °C).
- Quenching and tempering steel in a water bucket (martensite: carbon trapped, much harder, brittle).
- A rust test: steel and stainless side by side in salt spray.
- More alloys: pewter, electrum (the first coins), nickel brass and Nordic gold (the euro coins), lead-free solder
  (needs grams finer than a lump: a slider on each metal in the crucible).
- A coin press: stamp a coin from the cupronickel ingot, kept in the passport.
- Two players throwing at the same instant: the crucible is last-writer-wins, so one lump can be lost (rare; the
  forge's merging is the model if it matters).
