# Germanium's picture rooms: a design per board

Germanium's seven boards (`src/content/boards/Ge.js`, pictures `public/boards/Ge/<id>.svg`, drawn by
`tools/boards/Ge/`; look at them with `py -3.11 tools/boards/lib/render.py Ge`). One room per picture, each at
`/e/Ge/<id>` (germanium has no wing, so no id clashes). Seven different places. Read `docs/knowledge/picture-rooms.md`
(scene contract, stages, traps) and `docs/knowledge/adding-a-wing.md` "Look and feel" (each step chosen by tapping
its thing, sliders for what varies smoothly, the prompt naming the next tap; E opens the panel whose buttons do the
same steps). Every room is the picture made into a place: the same things, the same colours. `room.js` gives every
room its frame back to the hall, the easel with the story, and germanium's Atomling.

Never repeat, in any of the seven:
- What germanium's hall already shows: the specimen case (a broken lump of germanium, a germanium lens in its black
  mount, a model of the 1947 point-contact transistor: `germanium` in `src/worlds/atrium/showpieces.js`; its drawn
  matcap `germaniumMatcap` is the look for solid germanium in every room); the Atomling's flag (named after Germany).
- Silicon's rooms, the nearest cousins: `valley` (a giant transistor whose gate you tap to let electrons through to a
  lamp, the Intel 4004, why silicon beat germanium: the transistor room here is about the 1947 device and amplifying
  sound, never a switch-and-lamp), `solar` (a panel on a hilltop and a giant cut-away cell where four coloured lamps
  fire photons: the space room here is about three junctions in series and current matching, with a filter wheel,
  not lamps firing photons), `glass` (sand to glass, the light bench whose fibre carries light round its coil: the
  fibre room here is about the germanium core and the cable on the sea floor).
- Krypton's `windows` (a heat camera looking at a test house's windows): the heat room uses its camera on people and
  animals in smoke and on the lens itself, never on windows or insulation.
- The built rooms in `picture-rooms.md` "Built", the near places above all: carbon's `football` and krypton's
  `hands` (`lab.js`, a 1980s and a 1963 lab: Bell Labs 1947 must look older, wood and black bakelite), hydrogen's
  `cavendish` (`townhouse.js`, Georgian London: Mendeleev's study is Russian, 1870s, a tiled stove and double
  windows), oxygen's `fire` (`laboratory.js`), sodium's `davy` (candlelit basement), radon's `draught` (`mcgill.js`,
  1900), iron's `compass` (a ship's deck: the fibre room stays on the sea floor), radon's `cave` and silver's mine (the
  Gran Sasso hall is a modern concrete cavern, lit, clean, no rock face), krypton's `thruster` (`orbit.js`, a platform
  in orbit: the space room is a clean room on the ground).
- The Atom Forge and the Star Forge: no room builds nuclei or steps through decays one by one (the deep room shows
  decays only as what a detector records).

The germanium look: germanium atoms are the pictures' teal-grey balls (`#6fa4a0`, highlight `#d8f2ee`, from Jmol's
`#668f8f`: `gGe` in `tools/boards/Ge/gekit.py`), electrons small blue balls (`#58a8ff`), gold `#ffc93a`, silver
`#b4bcc8`. A germanium lens is a dark grey mirror (drawn, as on the showpiece; a lit metal face only mirrors the room).

Numbers from `src/data/elements.json`: germanium melts at 1211.4 K (938 °C), boils at 3106 K (2833 °C), density
5.323 g/cm³, thermal conductivity 60.2 W/(m·K), 1.5 mg/kg of the crust, atomic mass 72.63, isotopes 74 (36.52%), 72
(27.45%), 70 (20.52%), 73 (7.76%), 76 (7.75%, double-beta decay, half-life 1.88 × 10²¹ years); band gap 0.67 eV (its
own words in `src/content/Ge.js`).

---

## predicted

Title: "Can you predict a new element?" · Picture: `public/boards/Ge/predicted.svg` (`predicted.py`: Mendeleev's
table as a wall of cards by lamplight, only the elements known in 1871, no noble gases, a ball on each card and no
letters; under silicon an empty card with a glowing dashed edge and a ghost ball, the neighbours above, below and
beside it pointing in; gallium's place a faint empty gap, eka-aluminium; from a dark lump of argyrodite on the right,
its close-up showing silver, sulfur and one germanium, a real germanium ball arcing into the gap).

Place: Mendeleev's study in St Petersburg on a winter night about 1870 (a new stage `study.js`): wooden floor and
rugs, a tall green tiled stove in a corner, bookcases, double windows onto the snowy Neva and lit embankment lamps,
an oil lamp on a big writing table, a smaller table for his "patience" of element cards. One end of the room is a
second place behind a glazed door marked 1886: Winkler's analysis bench at the Freiberg Bergakademie (a balance in
its glass case, a gas burner, porcelain dishes, a window onto Freiberg's roofs). Not Cavendish's Georgian room, not
Lavoisier's: a Russian study, warmer, darker wood.

Station 1, "The patience game" (the picture's wall of cards, the cards as big as doors on a wall, or as tiles on the
floor to walk over). The 63 elements known in 1869 lie in a heap on the table.
- Tap a card from the heap (or "deal the next"): it flies to its place, in order of atomic weight, starting a new row
  when the behaviour repeats (lithium, sodium, potassium in one column; fluorine, chlorine, bromine in another).
- Slider: dealt so far, 0 to 63, for the visitor who wants to see it fill.
- When all are dealt three gaps glow: eka-boron, eka-aluminium and eka-silicon. Tap the gap under silicon: the
  Atomling says what belongs there. (Mendeleev also left others; keep to his three famous predictions.)
- Facts to check: 63 elements known in 1869 (the usual figure); the 1869 table and the 1871 short form (Wikipedia,
  "Mendeleev's predicted elements"); in 1871 gallium was not known, so eka-silicon's row neighbour on the left was a
  gap too.

Station 2, "Predict it" (the gap and its neighbours). The gap card under silicon, with silicon above, tin below and
arsenic to the right, each a big card with its numbers.
- Tap each neighbour: its atomic weight and density drop as coins onto a brass ledger; Si 28 and Sn 118 give their
  middle, about 73, and Mendeleev's own figure is shown beside it, 72.
- Then the prediction card fills line by line with each tap of the quill: atomic weight 72, density 5.5 g/cm³, a high
  melting point, dirty grey, a dioxide of density 4.7, a chloride boiling below 100 °C with density 1.9.
- Facts to check: Mendeleev's 1871 figures for eka-silicon (the board's numbers, Wikipedia "Mendeleev's predicted
  elements"); how he interpolated (from atomic volumes and the neighbours' properties, not a plain average: say "from
  its neighbours", never "he took the average").

Station 3, "The missing 7%" (behind the 1886 door; the picture's argyrodite). A lump of argyrodite (dark grey
crystals) on Winkler's bench.
- Tap the lump: it is ground and weighed; tap the dishes in turn: silver comes out (a bar on a chart grows to about
  three quarters), then sulfur (about a sixth): the bars stop at about 93%, a gap of about 7% stays open and glows.
- Tap the gap: the new element (a white germanium sulfide powder, then a grey bead), and the comparison board lights
  row by row: prediction (1871) against Winkler's measurement (1886), each row ticking green as it matches.
- Slider: a year rail from 1869 to 1886 on the wall; the three gaps fill in turn, gallium 1875, scandium 1879,
  germanium 1886.
- Facts to check: Winkler's measurements (atomic weight 72.32, density 5.35, GeO2 4.703, GeCl4 boiling at 86 °C,
  density 1.887: Wikipedia "Germanium", Winkler, Ber. 19, 210, 1886); argyrodite Ag8GeS6, which by formula is about
  76.5% silver, 17% sulfur and 6.4% germanium (the bars should follow those shares, the gap "about 7%" as Winkler's own
  account and `Ge.js` say); the name "neptunium" he thought of first.

Must not repeat: hydrogen's `cavendish` (no Georgian room), oxygen's `fire` (no 1770s laboratory), the Star Forge's
table by origin (this is about prediction, not where elements came from).

---

## transistor

Title: "How was the first transistor made?" · Picture: `public/boards/Ge/transistor.svg` (`transistor.py`: a lab bench
at night; a clear plastic triangle on its point, gold foil down its two lower edges, slit at the tip, pressed by a bent
spring onto a grey germanium slab on a brass base; a wire to a 1940s microphone with small sound rings, another to
headphones with big ones; a dimmed vacuum tube glowing orange on the left; a close-up of the two gold points on the
germanium's atoms, a thin arrow in and a broad one out).

Place: Bell Labs at Murray Hill, New Jersey, on 23 December 1947, a snowy evening (a new stage `belllabs.js`): a 1940s
laboratory with wooden benches and black bakelite instruments, a glowing-tube oscilloscope, racks of tube amplifiers,
an oil-cloth floor, tall steel windows onto snow and the dark car park, a few paper chains for Christmas. Older than
`lab.js` (1980s) and later than `mcgill.js` (1900).

Station 1, "Build it" (the picture's device, ten times bigger than life or more, on a bench as tall as the visitor).
- Tap the gold foil: it wraps round the triangle's lower edge. Tap the razor blade: it slits the foil at the tip, two
  points now apart; a lens shows the gap beside a sheet of paper's edge, at the same scale (about 50 µm against about
  100 µm). Tap the spring: it presses the triangle onto the germanium.
- Out of order: pressing before slitting gives one point, and nothing happens when tried; the Atomling says why two.
- Facts to check: the polystyrene triangle, gold foil, razor slit, spring (Riordan and Hoddeson, "Crystal Fire", 1997;
  Computer History Museum, "1947: Invention of the Point-Contact Transistor"); the gap of about 50 µm (often given as
  "two thousandths of an inch"): say "about"; the spring is often said to be a bent paper clip: do not claim it.

Station 2, "Make it louder" (the picture's microphone and headphones). A 1940s microphone, the device, headphones and
a loudspeaker.
- Tap the microphone: a voice line (a recorded "hello", or the visitor's own if the microphone is allowed) draws a
  small wave on the oscilloscope. Tap the battery switch: the same wave comes out bigger on the second trace and
  louder from the speaker.
- Slider: the current into the emitter; the lens at the tip shows holes (pink balls with a plus) leaving the emitter
  point and drifting to the collector point; more of them, bigger output.
- Facts to check: first power gain 16 December, the demonstration of speech on 23 December 1947 (Riordan and
  Hoddeson); no gain figure is given on the board (sources disagree: show the waves, not a number).

Station 3, "A tube or a crystal?" (the picture's dimmed tube). A 1940s tube radio and a 1954 pocket radio side by side.
- Tap the tube radio: it hums while its heaters warm (seconds), its tubes glow orange and a heat shimmer rises; tap the
  pocket radio: it plays at once. A board compares size and power, as the visitor taps each.
- Facts to check: the Regency TR-1 (1954), the first pocket transistor radio sold, with four germanium transistors made
  by Texas Instruments (check); tube heaters' warm-up and power (typical 6.3 V, 0.3 A each: say "about").

Must not repeat: silicon's `valley` (no gate and lamp, no chip, no why-silicon-won), sodium's `davy` (no batteries of
troughs).

---

## heat

Title: "How can a camera see heat?" · Picture: `public/boards/Ge/heat.svg` (`heat.py`: a forest at night under a thin
moon; a fox sitting among dark ferns, almost invisible; a thermal camera, its germanium lens a dark grey mirror,
infrared rays wavy from the fox into the lens, moonlight bouncing off it; above, a round window with the fox glowing in
heat colours).

Place: a fire brigade's training house at night (a new stage `smokehouse.js`): a two-storey concrete house with
scorched walls, its ground floor a furnished room (sofa, table, a cat basket) filling with harmless training smoke;
outside its door the yard, a fire engine with its lights turning slowly, and the edge of a wood (the picture's fox
can be at the wood's edge).

Station 1, "See through smoke" (the picture's camera). A thermal camera on a stand, its screen big (a canvas at
station size), pointed into the smoky room.
- Tap the camera: the screen switches between the eye's view (grey smoke, nothing) and heat colours (the room by
  temperature: a training dummy warmed to body heat under the table, the cat behind the sofa, a radiator, a cold
  window). Tap what the screen shows (the dummy, the cat): it is found, the Atomling says how warm it is.
- Slider: the smoke, from clear to thick: the eye's view goes grey, the heat view barely changes.
- Facts to check: thermal cameras see through smoke but not through glass or water (both block long-wave infrared);
  firefighters' use (any fire service's description).

Station 2, "The lens bench" (the picture's lens). A warm kettle (or the visitor's own Atomling's hand) in front of a
heat camera on a rail; three windows to slide into the beam: ordinary glass, germanium, and nothing.
- Tap a window: it slides between kettle and camera. Glass: the eye sees through, the heat screen shows only the
  glass's own reflection, the kettle gone. Germanium: the eye sees a dark grey mirror, the heat screen shows the
  kettle. Nothing: both see it.
- Slider: warm the germanium window: past about 100 °C its infrared fades as it fills with free electrons (check the
  temperature); cool again and it clears.
- Facts to check: glass blocks infrared beyond a few micrometres; germanium transmits about 2 to 14 µm and reflects
  about 36% at a bare surface (n about 4.0), hence its coatings; the loss of transmission when hot (manufacturers'
  data sheets, e.g. Edmund Optics, say transmission falls above about 100 °C: check the figure).

Station 3, "Hotter shines shorter" (the picture's rays). A hot plate on a counter with a temperature slider from
20 °C to 1000 °C, the heat camera beside it and a wavelength ruler on the wall.
- Slider: the plate's temperature; the ruler's arrow moves to the wavelength where it shines most (2898 µm·K divided
  by the temperature in kelvin: 9.9 µm at 20 °C, 9.3 µm for your body, 2.3 µm at 1000 °C); from about 525 °C the eye
  too sees a dull red glow (the Draper point).
- Tap the visitor's own Atomling in the camera's view: its colour and number appear.
- Facts to check: Wien's law; body 310 K; the Draper point (about 798 K, 525 °C).

Must not repeat: krypton's `windows` (no windows, no house walls under the heat camera), oxygen's `fire` (nothing
burns: the smoke is training smoke), sodium's `lamps` (no colour rendering).

---

## fuzz

Title: "What makes a guitar go fuzzzz?" · Picture: `public/boards/Ge/fuzz.svg` (`fuzz.py`: a little stage at night,
magenta and violet spotlights; a red electric guitar on its stand, a cable to a bronze wedge-shaped fuzz pedal and on
to an amplifier with a glowing speaker; a smooth wave over the guitar, a squared one over the amplifier; a close-up of
three germanium transistors, small metal cans on three legs, on a green circuit board).

Place: a Nashville recording studio in 1961 (a new stage `nashville.js`): a live room with wooden walls and baffles, a
drum kit, microphones on booms, a big window into the control room with its mixing desk and two tape machines, a
small stage corner under coloured lights where the picture's guitar, pedal and amplifier stand. The room plays sound:
use `src/audio/sound.js` (a guitar note through a WebAudio waveshaper; `sound.md`).

Station 1, "The broken channel" (1961). The mixing desk in the control room.
- Tap the guitar: it plays a clean low note, the desk's meter moves, the oscilloscope above shows a smooth wave.
- Tap the faulty channel's transformer (a panel opens, a part glows wrong): the same note comes out rough and buzzy,
  its wave cut flat on top and bottom. The Atomling tells the story of the session and the song.
- Facts to check: Grady Martin's six-string bass solo on Marty Robbins's "Don't Worry" (1961), a faulty console channel
  (sources differ: a transformer or a preamp; say "part of the desk broke"); Glenn Snoddy, the engineer.

Station 2, "Inside the pedal" (the picture's close-up). The Fuzz-Tone opened, its board as big as a table, the three
germanium transistors as tall as the visitor.
- Slider: the gain (how hard the transistors push): the wave grows until its tops are cut off and it turns nearly
  square; the sound follows; a bar chart of harmonics (1, 3, 5, 7 times the note) grows with it.
- Tap a transistor: a lens on the germanium inside it (its atoms, a few dopant atoms), and why it starts to conduct at
  a lower voltage than silicon (about 0.2 to 0.3 V against 0.6 to 0.7 V).
- Facts to check: the Maestro FZ-1 (Gibson, 1962, Snoddy and Hobbs, US patent 3,213,181) used germanium transistors
  (Wikipedia "Germanium" lists it; the exact type is uncertain: do not name one); clipping adds odd harmonics for a
  symmetric clip.

Station 3, "Hot stage, cold stage" (the picture's stage). Two pedals side by side, a germanium one and a silicon one,
and the stage lights with a temperature slider (the stage from a cold hall to a hot summer night).
- Slider: the temperature; the germanium pedal's leakage meter climbs and its sound changes (softer, sagging), the
  silicon one stays the same. Tap either pedal to hear it.
- Tap the "Satisfaction" record on the wall: the Atomling says what it did to the Fuzz-Tone's sales (no music played:
  the song is not ours to play).
- Facts to check: germanium transistors leak more as they warm (any semiconductor text); Hendrix and the Dallas
  Arbiter Fuzz Face (1966); Keith Richards's FZ-1 on "(I Can't Get No) Satisfaction" (1965).

Must not repeat: nothing musical exists yet; keep the sound gentle and short (the family plays with sound on).

---

## deep

Title: "Why hide a crystal under a mountain?" · Picture: `public/boards/Ge/deep.svg` (`deep.py`: a mountain cut open
under a starry sky, particles from space raining down as streaks and stopping in the rock with small sparks; deep
under the peak a vaulted hall reached by a road tunnel, in it a tall tank glowing blue with liquid argon and strings of
grey germanium crystals; a close-up of a germanium-76 nucleus with two electrons flying out at once).

Place: Hall A of the Laboratori Nazionali del Gran Sasso (a new stage `gransasso.js`): a huge vaulted concrete cavern
under about 1400 m of rock, reached from the motorway tunnel; LED strips along the vault, painted steel stairs and
platforms, a cylindrical water tank with a white clean room on top (GERDA's and then LEGEND-200's), pipes, cable
trays, a few bicycles. Clean and bright, no bare rock face (silver's mine and radon's cave are rock).

Station 1, "The rain from space" (the picture's streaks). A cut-open model of the mountain, room-high, with a muon
counter and a depth slider.
- Slider: depth, from the summit to the hall; the counter's clicks slow from a rattle to almost nothing (about a
  million times fewer cosmic muons in the hall than at the surface); streaks in the model stop in the rock.
- Tap the counter: it clicks for the depth shown; tap the sky in the model: one particle falls and stops where the
  rock is thick enough.
- Facts to check: LNGS's 1400 m of rock (3800 m water equivalent), the muon flux reduced about a million times (LNGS
  pages give about 1 muon per m² per hour in the halls: check).

Station 2, "The purest crystal" (the picture's crystals). A germanium bar in a zone-refining furnace and an HPGe
detector in its cold cryostat, with a spectrum screen.
- Tap the heater ring: it travels along the bar, a molten zone carries the impurities to the end (drawn as coloured
  specks); slider: passes, the count of impurity atoms per cubic centimetre drops step by step to about 10¹⁰.
- Tap the cobalt-60 source: its gamma rays make two sharp lines on the germanium's screen (1173 and 1332 keV) and two
  blurred humps on a sodium iodide detector beside it (about 7% against about 0.15%).
- Facts to check: zone refining (Pfann, Bell Labs, 1951, invented to purify germanium for transistors); HPGe net
  impurities about 10¹⁰ per cm³; cobalt-60's lines; NaI(Tl) resolution about 7% at 662 keV (check what to quote).

Station 3, "The long wait" (the picture's tank and close-up). The array of crystal strings in liquid argon, a years
slider and the energy spectrum on a big screen.
- Slider: years of running; ordinary double-beta decays (two electrons and two antineutrinos) appear one by one as dots
  making a broad hump on the spectrum, about 8 a day for each kilogram of germanium-76 (worked out from the half-life:
  say "about"); a marked line at 2039 keV, where the decay with no neutrinos would sit, stays empty.
- Tap a crystal: a lens on one decay, two neutrons becoming protons at once and two electrons leaving.
- Facts to check: Qββ of germanium-76 is 2039 keV; GERDA's limit, more than 1.8 × 10²⁶ years (2020); LEGEND-200 running
  at LNGS with about 140 to 200 kg of enriched detectors (check what it has now); the 8 a day per kg is 1 kg of 76Ge,
  7.9 × 10²⁴ atoms, times ln 2 over 1.88 × 10²¹ years.

Must not repeat: silver's mine (no galleries, no fire-setting), radon's `cave` and `rock`, the Atom Forge (no building
or stepping through nuclei: the decay is only seen as the detector records it).

---

## fibre

Title: "How does the internet cross the sea?" · Picture: `public/boards/Ge/fibre.svg` (`fibre.py`: the ocean cut open,
a dusk sky and a cable ship above, the cable along the deep floor from one shore's slope to the other with a repeater
halfway and pulses of light; fish and a glowing jellyfish; a close-up of one glass thread lengthwise, a glowing core
with germanium atoms in pale cladding, a ray zigzagging inside; the cable cut through, its layers).

Place: the deep sea floor at about 3000 m (a new stage `abyss.js`): near darkness, marine snow drifting down, soft
sediment, a few sea cucumbers and a glowing jellyfish, the cable lying across the floor into the dark both ways, a
repeater the size of a car, lit by the lamps of a small yellow research submersible (ROV) that the room is entered
beside. Not the sunlit `water.js`, not a ship's deck.

Station 1, "Stay inside!" (the picture's close-up). A giant fibre lying along the floor, a metre thick, its core
glowing faintly, a laser at one end you aim.
- Slider: the laser's angle; at shallow angles the beam bounces along the core, steeper than the critical angle it
  leaks out into the cladding and the sea. Tap the fibre to bend it: the beam follows the bend while the angle stays
  under the limit.
- Slider (second): germanium in the core, from none to a few percent; the core's glow and its refractive index rise,
  and the critical angle on a dial moves (with none the core is the same as the cladding and the light leaks).
- Facts to check: refractive indices of core and cladding (about 1.450 and 1.445 at 1550 nm: check), the critical
  angle about 85°, GeO2 about 3 to 4 mol%; a single-mode fibre really guides one mode as a wave (the Scientist panel
  says so).

Station 2, "The cable cut open" (the picture's cut cable). A cut section of cable as tall as the visitor, and the
repeater.
- Tap each layer from outside in: polyethylene, steel wires, the copper tube that carries power to the repeaters, the
  gel tube, then the fibres, each named.
- Tap the repeater: it opens; a faded pulse comes in, a coil of erbium-doped fibre glows (pumped at 980 nm) and the
  pulse leaves bright again.
- Facts to check: a typical deep-sea cable's layers and diameter (about 17 to 20 mm in deep water, armoured near
  shore); repeaters every 50 to 100 km; erbium-doped amplifiers (since the 1990s; TAT-8 of 1988 still turned light
  into electricity and back).

Station 3, "Across the ocean" (the picture's cable from shore to shore). A map table of the Atlantic with Portugal's
landing stations.
- Tap Sines: a pulse runs along EllaLink to Fortaleza in Brazil (opened 2021), a clock counting the milliseconds it
  takes (light in glass covers about 200 km each millisecond); slider: the distance, and the light left without
  repeaters (0.2 dB per km: after 15 km half, after 100 km a hundredth).
- Facts to check: EllaLink (Sines to Fortaleza, about 6000 km, 2021: check), light in fibre at about 2/3 of c; more than
  a million kilometres of submarine cable (TeleGeography).

Must not repeat: silicon's `glass` (no light bench or coil of fibre, no sand to glass), iron's `compass` (no ship deck),
the `water.js` shallows.

---

## space

Title: "How do satellites catch sunlight?" · Picture: `public/boards/Ge/space.svg` (`space.py`: a satellite over the
curve of the Earth, its two solar wings deep blue-black in a grid, the Sun beyond; three rays, blue, red and dashed
infrared, into a close-up of one cell cut through: a violet-blue top layer, a red-brown middle and a thick grey
germanium slice on a metal back, each ray stopping in its own layer with a spark and a freed electron).

Place: a satellite clean room (a new stage `cleanroom.js`): a high bay in soft mid-grey and pale blue (never white:
the bloom), a gowning area with bunny suits on hooks, a satellite on its stand with its solar wings folded, a big sun
simulator lamp on a gantry, a window onto the control room. On the ground, not in orbit (`orbit.js` is krypton's).

Station 1, "The sun simulator" (the picture's satellite). The satellite's wing, a sun-simulator lamp and a filter
wheel.
- Tap the satellite: its wing unfolds panel by panel. Tap the lamp: it lights; tap the filter wheel to let through
  only blue, only red, only infrared, or all.
- Three ammeters, one per layer, and the cell's current: the layers are in series, so the current is the smallest of
  the three; with only red the top layer makes nothing and the whole cell stops. The Atomling says why they are
  designed to make the same current (current matching).
- Facts to check: series connection by tunnel junctions; current matching as the design rule (any review of III-V
  multi-junction cells).

Station 2, "The sandwich" (the picture's close-up). A walk-in cut-away of one cell, its three layers like floors.
- Slider: the light's wavelength from 300 to 1900 nm; the ray stops in the top layer below about 650 nm, in the middle
  one up to about 890 nm, in the germanium up to about 1800 nm, and passes through beyond.
- Tap the join between gallium arsenide and germanium: a lens shows the two crystals' atoms lining up almost exactly
  (0.5653 and 0.5658 nm), a zipper that closes; with silicon instead (0.5431 nm) it does not fit.
- Facts to check: band gaps (GaInP about 1.9 eV, GaInAs about 1.4 eV, Ge 0.67 eV) and their cut-off wavelengths; the
  lattice constants (GaAs 0.56533 nm, Ge 0.56579 nm, Si 0.54310 nm).

Station 3, "How far from the Sun?" (the picture's Sun). A model solar system along a wall, a little satellite on a
rail.
- Slider: the distance from the Sun; a light meter shows the sunlight per square metre (1361 W/m² at the Earth, about
  590 at Mars, about 50 at Jupiter) and the cell's power falls with it; tap Mars for Spirit and Opportunity on their
  triple-junction cells.
- Facts to check: the solar constant 1361 W/m²; Mars about 590, Jupiter about 50 W/m² (inverse square, from 1.52 and
  5.2 AU); Spirit and Opportunity's GaInP/GaAs/Ge cells (Wikipedia "Germanium").

Must not repeat: silicon's `solar` (no hilltop panel, no lamps firing photons into a giant cell, no Vanguard 1), iron's
`mars` (no Martian ground), krypton's `thruster` (no platform in orbit).

---

## Facts flagged while writing the boards (for whoever builds the rooms)

- Winkler's atomic weight 72.32 and GeO2 density 4.703 are from the tables of the 1886 paper as usually quoted; the
  board rounds them (72.3, 4.7). The "about 93%" analysis total is from `Ge.js`.
- The point-contact transistor's gap "about 50 µm" is the usual figure; no gain number is given (sources disagree).
- The fuzz story's faulty part (transformer or preamp channel) differs between sources: the board says "part of the
  mixing desk broke".
- "Germanium fuzz sounds warmer" is the players' view, said as such.
- HPGe purity "fewer than one atom in a million million" is from net impurities near 10¹⁰ per cm³ against 4.4 × 10²²
  germanium atoms per cm³.
- "Most of today's satellites" run on triple-junction cells on germanium: true of the large majority of commercial
  and scientific satellites; small cheap satellites may use silicon.
