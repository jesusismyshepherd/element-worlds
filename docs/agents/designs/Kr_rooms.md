# Krypton's picture rooms: a design per board

Krypton's seven boards (`src/content/boards/Kr.js`, pictures `public/boards/Kr/<id>.svg`, drawn by
`tools/boards/Kr/`). One room per picture, each at `/e/Kr/<id>` (no id is also a wing's: Krypton's only wing is
`signs`). Seven different places. Read `docs/knowledge/picture-rooms.md` (scene contract, stages, traps) and
`docs/knowledge/adding-a-wing.md` "Look and feel" (each step chosen by tapping its thing, sliders for what
varies smoothly, the prompt naming the next tap; E opens the panel whose buttons do the same steps).

Never repeat, in any of the seven:
- the noble gases' neon sign workshop (`/e/Kr/signs`, `src/worlds/wings/noble/README.md`): the filling bench
  (pump, gas flasks, high voltage, tubes bent into letters), radon's lead box and the Geiger counter, your name
  in neon, the spectroscope with each gas's lines (the rack of tubes), the atom's energy ladder, the history
  board 1898 / 1910 / today, the balloons that float or sink. So: no spectroscope station, no balloons
  sinking, no energy-level ladder, no Geiger counter.
- the built rooms in `picture-rooms.md` "Built", the near ones above all: oxygen's `magnet` (liquid-air
  machine, the column boiling nitrogen off, the oxygen flask), carbon's `clock` (radiocarbon at a dig, the
  decay curve, the hourglass of atoms), silicon's `glass` (a glassblower's workshop) and `valley`
  (transistors, chip counts), sodium's `lamps` (spectroscope of a street lamp), silicon's `earth` and `solar`
  (the space deck, Vanguard 1), hydrogen's `jupiter` and `radio`.

Numbers: from `src/data/elements.json` where it has them (Kr boils at 119.93 K = −153.2 °C, melts at 115.79 K =
−157.4 °C; N −195.8 °C, Ar −185.9 °C, O −183.0 °C, Xe −108.1 °C; thermal conductivity Kr 0.0095, Ar 0.0177,
air (N) 0.026 W/(m·K); first ionisation energies He 24.59, Ne 21.56, Ar 15.76, Kr 14.00, Xe 12.13 eV;
Kr-81 half-life 229 000 years, Kr-85 10.728 years; prices per kg Ar 0.931, Kr 290, Xe 1800).

---

## hidden: "What was hiding in the air?"

Picture: `public/boards/Kr/hidden.svg` (a silvered flask of liquid air boiling on a gaslit bench, nitrogen,
oxygen and argon escaping; a close-up of the last drops with krypton atoms left behind; the residue glowing
white-lilac in a little sealed tube; a dark band with a yellow and a green line).

Place: University College London's chemistry laboratory, a night at the end of May 1898, by gaslight. A new
stage `gaslab.js` (worth having: Ramsay's neon, argon and xenon, Curie-era rooms can use it): a Victorian
teaching laboratory, glazed brick walls, long teak benches with brass gas taps, gas mantles on wall brackets
(warm pools of light), sash windows onto Gower Street's gas lamps and wet cobbles, shelves of reagent bottles,
a blackboard (no words, chalk sketches). `townhouse.js` (Georgian London at night: moonlit roofs, `candle()`,
`onWall`) has the outside to borrow. The board's link already points to the neon sign workshop: this room ends
where the workshop begins (the glow), it does not show the spectrum.

Station 1, "The last drops" (the picture's flask). Hampson's silvered flask on the bench, a clear strip down
its front showing the pale blue liquid, its level marked in cm³ (750 at the start).
- Slider: the flask's temperature, from −196 °C up to −150 °C (it warms as it boils away). The level falls with
  it from 750 cm³ towards 10 cm³; the vapour over the mouth carries molecules out, nitrogen (blue pairs) most
  of all, then argon (pale single atoms) and oxygen (red pairs).
- A jar beside it, "1 million molecules of air" as a glass cube full of tiny dots: tap it and every molecule
  that is not krypton fades away: one dot is left (1.14 per million). Its twin, "the last 10 cm³", is a small
  flask in which the krypton is much richer: the point that boiling away concentrates what boils last.
- Tap the stopcock when the level reaches 10 cm³: the gas of the last drops is caught in a glass gas holder
  over mercury (Station 2 takes it).
- Facts to check: the boiling points (elements.json). The real chemistry is fractional evaporation, not one gas
  at a time: the more volatile nitrogen leaves fastest, the residue grows richer in oxygen, argon, krypton and
  xenon; the last drops are still mostly oxygen. The Scientist panel says so (Raoult's law, in a line). Hampson
  supplied about 750 cm³ of liquid air in May 1898; Travers kept the gas from the last 10 cm³ (DSB, Travers'
  entry; Travers, "The Discovery of the Rare Gases", 1928).

Station 2, "Clean-up" (a glass train along the bench). The gas holder, then a tube of copper turnings over a
burner, then a tube of magnesium over a second burner, then a measuring tube (a eudiometer) at the end.
- Tap the first burner: the copper glows red and blackens as it takes the oxygen (2 Cu + O2 → 2 CuO).
- Tap the second burner: the hot magnesium takes the nitrogen (3 Mg + N2 → Mg3N2, a yellowish crust).
- Tap the gas holder's tap: the gas flows through, and the measuring tube fills with what is left: about 26 cm³
  (DSB), mostly argon with a little of something new; a lens shows argon atoms and a few bigger krypton atoms.
- Out of order, the Atomling says why (copper before the gas is hot: nothing happens; magnesium cold: the
  nitrogen goes through).
- Facts to check: copper and magnesium as the absorbents (standard practice of Ramsay's lab for O2 and N2;
  confirm in Travers 1928 or Ramsay and Travers, Proc. R. Soc. 63, 1898); "about 26 cc" of residue (DSB).

Station 3, "Seal it and light it" (the picture's little tube). A Plücker tube on a stand, a mercury pump
(Töpler type) and an induction coil with its battery.
- Slider (or tap the pump's reservoir for each stroke): pump the tube empty; a gauge's mercury column drops.
- Tap the gas holder's tap: a little of the residue goes into the tube. Tap the blowpipe flame: the tube's neck
  is sealed off.
- Tap the coil: the tube glows white-lilac. Travers' notebook on the bench opens on a page with two coloured
  strokes, yellow and green, drawn in his hand (no words). The Atomling: "Bright lines nobody had seen. A new
  gas! You can see all its lines in the neon sign workshop." (not a spectroscope here).
- Facts to check: the date (most sources and Kr.js say 30 May 1898; the DSB says the lines were seen on 31 May;
  say "the end of May 1898" as the board does); the name from kryptos, hidden; neon in June, xenon in July 1898.

---

## metre: "How long is a metre, really?"

Picture: `public/boards/Kr/metre.svg` (a krypton-86 lamp in its frosty cold bath sending one long orange-red
wave across, a ruler of its crests below; the X-section bar of platinum-iridium on two rollers in a velvet
case, its two lines lined up with two ticks; a close-up of the bar's X-shaped end and its engraved line).

Place: the BIPM at the Pavillon de Breteuil, Sèvres, in 1960: a quiet length laboratory below the pavilion,
kept at a steady temperature, with granite tables on isolated piers, a thick vault door at one end, a high
window onto the park of Saint-Cloud at dusk. A new stage `metrology.js` (calm, clean, pale stone and dark
wood, brass instruments; reusable for other measuring stories).

Station 1, "The old metre" (the bar in its case, as in the picture).
- Tap the case: the lid opens; tap the bar: a microscope swings over one end and the screen beside it shows
  the fine line on the neutral plane, magnified.
- Slider: the bar's temperature, from −10 °C to 40 °C. The bar grows and shrinks; a dial shows by how many
  micrometres it is longer than a metre (zero at 0 °C, about 8.6 µm more per degree).
- Tap the X-shaped end: the section lights up and the panel says why X (stiff and light, the lines on the
  middle plane so bending does not change the length; Tresca's design).
- Facts to check: 1889, Pt-Ir 90/10, the metre at 0 °C, the X (Tresca) section, two Airy-point supports; the
  expansion coefficient of Pt-Ir (about 8.6 × 10⁻⁶ per kelvin; check the BIPM figure).

Station 2, "Counting waves" (the picture's lamp and wave). On a granite table: the krypton-86 lamp in its
cryostat (liquid nitrogen at its triple point, about 63 K, frosty steel), a Michelson interferometer (a beam
splitter, a fixed mirror, a mirror on a long carriage), a screen with the fringes, a counter.
- Tap the cryostat: it frosts over (it is cold now); tap the lamp: it lights orange-red.
- Slider: the carriage's mirror moves; the fringes on the screen sweep past and the counter counts them; each
  fringe is half a wave (302.89 nm of mirror travel). A "fast" tap (the motor) runs the carriage the whole
  metre in a few seconds, the counter racing to 1 650 763.73 waves, the carriage's end meeting the bar's line.
- Facts to check: 605.780 nm (CIPM value 605 780 210.3 fm); 1 650 763.73 wavelengths (11th CGPM, 1960,
  resolution 6); the lamp's bath within 1 K of nitrogen's triple point (BIPM's recommended conditions); about
  4 parts in 10⁹ (17th CGPM, 1983, resolution 1).

Station 3, "Light's own ruler" (1983). A track one metre long with a pulsed laser at one end and a detector at
the other, and a big clock face whose hand moves in nanoseconds.
- Tap the laser: one pulse; the clock (slowed a billion times) shows it takes 3.34 ns to cross the metre.
- Slider: the time, from 1 ns to 1 s: the light's path, drawn round a little globe of the Earth, reaches
  299 792 458 m, about seven and a half times round the Earth.
- Facts to check: 1/299 792 458 s (17th CGPM, 1983); the redefinition of 2019 keeps that number fixed (say
  only if needed).

Must not repeat: the workshop's spectroscope (no prism, no line spectra here: one lamp and its waves) and
sodium's `lamps`.

---

## windows: "Why is there gas in your window?"

Picture: `public/boards/Kr/windows.svg` (a triple-glazed window cut through between a snowy night and a warm
room with an armchair, a sleeping cat and a mug; krypton atoms in both gaps; warm waves from the room bouncing
back; a close-up of a gap: big slow atoms, a warm wave dying out).

Place: a window factory at night, with snow falling past its big doors: a new stage `glazing.js` (a long hall,
a production line of rollers carrying glass, sputtering chamber, gas-filling press, racks of finished units,
forklifts parked, the doors open onto a snowy yard). One end of the hall holds a test house: a little room
with three windows in its wall, the cold side a snowy porch.

Station 1, "Fill it" (the production line).
- Tap a glass pane on the rollers: it goes into the coating chamber and comes out with its invisible coating
  (a faint gold shimmer when the light catches it).
- Tap the spacer frame: it is laid on, the second and third panes pressed on.
- Tap a gas bottle (air, argon, krypton): the press fills the gaps through a little hole; a gauge climbs to
  "90%" full; tap the plug to seal it. The finished unit slides onto the rack with its gas's colour on the
  spacer (air grey, argon pale cyan, krypton teal).
- Facts to check: gas filling through a hole in the spacer, fills of about 90% (a common spec); a low-e coating
  of silver (sputtered) or tin oxide (pyrolytic).

Station 2, "Which gas keeps warm?" (a giant gap, the picture's close-up made big). A cut-through unit on a
workbench, its gap blown up to a metre wide, a hot plate on the room's side and a cold one on the outside.
- Tap a bottle (air, argon, krypton, xenon): the gap fills with that gas's atoms, each at its true relative
  speed (mean speed goes as 1 over the square root of the mass): air's molecules dart, krypton's amble.
  A heat meter shows the flow: krypton about a third of air's (0.0095 against 0.026 W/(m·K)).
- Slider: the gap's width, 4 to 24 mm. Narrow: lots of heat by conduction. Wider: less, until the gas starts
  to roll in slow loops (convection cells appear and the meter climbs again). A marker shows each gas's best
  width (krypton about 8 to 12 mm, argon about 15 mm).
- Tap the coating: infrared arrows from the room bounce back off it instead of crossing.
- Facts to check: conductivities (elements.json); best widths (vendor tables differ: krypton 8 to 12 mm,
  argon 11 to 16 mm; say "about"); xenon conducts even less (0.0057) but is rarer still.

Station 3, "The test house" (the picture's window and room). The little room with three windows side by side:
one pane, two panes with air, three panes with krypton and coatings. Outside, the snowy porch.
- Slider: the outside temperature, 10 °C down to −30 °C. A heat meter under each window shows watts.
- Tap the thermal camera on its tripod: the view turns to false colour, the single pane bright yellow-red,
  the triple one dark blue; the cat on the windowsill shows warm.
- Tap the krypton window: a lens on its gap (the picture's close-up).
- Facts to check: U-values of about 5.8, 2.8 and 0.6 W/(m²·K) for the three windows (typical; say "about"),
  so a tenth of the single pane's loss.

Must not repeat: oxygen's `water` bathhouse (a frozen lake) and the workshop's balloons (no "heavy gas sinks").

---

## thruster: "What pushes a satellite along?"

Picture: `public/boards/Kr/thruster.svg` (a flat satellite with one long solar wing over the Earth's night
side, a soft blue-violet krypton plume, a row of sisters strung across the sky; a close-up of the thruster cut
through: anode, magnets, electrons circling, ions racing out, a cathode).

Place: a docking platform in low Earth orbit, about 550 km up, the Earth filling the lower half of the sky
(day side, terminator and night side with city lights as the platform turns), sunrise every 95 minutes,
satellites passing as moving stars. A new stage `orbit.js` (unlike `space.js`, whose round deck floats far
out with model planets: here the real Earth is under your feet).

Station 1, "Open the engine" (the picture's close-up, built big). A Hall thruster cut in half, its ring 3 m
across, standing on the platform.
- Tap the krypton valve: atoms drift into the ring from the anode at its back.
- Tap the magnet coils: field lines appear across the channel and electrons from the cathode get caught,
  whirling round the ring (a ring of cyan sparks).
- Slider: the voltage, 0 to 300 V: atoms that meet the whirling electrons lose one, become ions (the + on the
  ball) and race out; the plume brightens blue-violet; a speedometer reads up to about 16 km/s.
- Tap the cathode off: the satellite's charge builds up (a meter) and the ions are pulled back, the plume
  stalls; tap it on again: electrons stream after the ions and the plume runs.
- Facts to check: the Hall current, a few hundred volts, the cathode neutralising the beam, exhaust about 15 to
  20 km/s (Hall thrusters generally).

Station 2, "Climb to work" (the satellite of the picture). A model satellite at true size (flat body about 3 m,
one wing about 9 m: check Starlink's published figures and say "about") parked by the rail.
- Tap the thruster: a gentle push; a little scale beside it shows the push as the weight of a coin
  (about 70 mN, about 7 g; the krypton thruster's thrust as worked out from SpaceX's 2023 figures for the
  argon one: 170 mN, 2.4 times the older thrust: flag it as approximate).
- Slider: days since launch: a little globe beside the rail shows the orbit rising from where the rocket left
  it (Starlink deploys at about 300 km or below: check) to its working height of about 550 km.
- Tap the drifting space junk: the satellite steps aside. Tap "the end": it lowers itself and burns up as a
  shooting star.

Station 3, "Pick a propellant". Three bottles on a rack: xenon, krypton, argon.
- Tap a bottle: it fills the thruster on Station 1, and a board compares them: share of air (xenon 0.087 ppm,
  krypton 1.14 ppm, argon 9340 ppm), price per kg (elements.json), atom mass, first ionisation energy
  (12.13, 14.00, 15.76 eV); the plume's colour and push change.
- Facts to check: Starlink's first satellites (2019 on) used krypton; the V2 Mini (2023) uses argon, "krypton is
  too rare" (Musk, 2023); thrust per watt falls from xenon to argon, exhaust speed rises.

Must not repeat: silicon's `solar` (Vanguard 1, a globe and a pad) and `earth` (the deck far out); hydrogen's
`fuel` (Shuttle engines).

---

## water: "Water a million years old?"

Picture: `public/boards/Kr/water.svg` (the Sahara at dusk cut open: dunes, an oasis with palms and a well, a
field; below, sand, sandstone soaked with water like a sponge, bedrock; a dashed path from a faded window onto
the green Sahara of long ago, rain, an acacia and a giraffe; a close-up of the well's water with one krypton-81
caught glowing where three laser beams cross).

Place: an oasis in Egypt's Western Desert at dusk (Kharga or Dakhla in spirit), a new stage `desert.js`: dunes
to the horizon, palms round a pool, a well head with a pump, irrigated fields, a glass-floored pit beside the
well that looks down into the rock: the sandstone wet in its pores, the bedrock below. A field lab under a
tent by the well.

Station 1, "Where the water came from" (the picture's faded window, made a place). A long sand table model of
the aquifer from the Uweinat hills in the south-west to the oasis.
- Slider: time, from 1 million years ago to today. The model turns green in wet periods (grass, lakes,
  giraffes, rain clouds over Uweinat), the rain soaks into the sandstone, a blue drop creeps north a metre or
  two a year (a distance counter), then the climate dries and the desert comes.
- Tap the rain cloud (in a wet period): a burst of rain soaks in, with krypton from the air dissolved in it
  (teal dots: most are ordinary krypton, a very few are krypton-81 drawn bigger).
- Facts to check: the Nubian Sandstone Aquifer System under Egypt, Libya, Sudan and Chad; recharge in
  Pleistocene wet ("pluvial") periods from an Atlantic moisture source (Sturchio et al., GRL 2004); flow about
  1 to 2 m per year northward from near the Uweinat uplift.

Station 2, "Catch the gas" (the well).
- Tap the pump: water flows through a degassing tank; a litre counter runs into the thousands (Sturchio's team
  degassed thousands of litres in the field).
- Tap the tank's outlet: a small cylinder of dissolved gas comes out; tap it again and it is split into its
  parts on a board: mostly nitrogen, then argon, oxygen if any... and a tiny drop of krypton (the volume to
  check: a few to tens of microlitres in 2004; say "a drop smaller than a raindrop" for kids).

Station 3, "The atom trap" (the picture's close-up, in the tent). A vacuum chamber with three pairs of laser
beams crossing at its centre, a camera, a counter.
- Tap the krypton cylinder: atoms stream through the beams: ordinary krypton flies straight on, only the very
  rare krypton-81 slows and is caught, glowing at the centre; the counter ticks once now and then.
- Tap "air today": the counter's rate for today's air. Tap "the well's water": a lower rate. A dial between them
  turns the ratio into an age: half the krypton-81 left is 229 000 years, a quarter 458 000, an eighth 687 000,
  a sixteenth about 916 000 years (a dial, not a decay curve chart: carbon's `clock` has the curve and the
  hourglass).
- Facts to check: ATTA, Argonne, Zheng-Tian Lu's group (Chen et al., Science 1999); 81Kr/Kr fewer than one in
  a trillion (about 5 × 10⁻¹³); ages 200 000 to 1 million years (Sturchio 2004); Taylor Glacier ice 120 000 years
  (Buizert et al., PNAS 2014); the lasers tuned to krypton-81 alone (its isotope shift; the 811 nm line of the
  metastable atoms: check before saying the wavelength).

Must not repeat: carbon's `clock` (decay curve, hourglass, archaeology); the Atom Forge's decays.

---

## hands: "Can a noble gas hold hands?"

Picture: `public/boards/Kr/hands.svg` (a big krypton atom with its full shell of eight electrons holding a
fluorine on each side, F-Kr-F; a glass bulb in a frosty cold bath with colourless crystals; an upright laser
firing an ultraviolet beam through a lens onto a wafer; a close-up of a krypton and a fluorine clinging, and a
pair bursting apart in a violet flash).

Place: a chemistry laboratory in 1963 (Temple University's Research Institute, Philadelphia, in spirit): the
`lab.js` stage (a university lab at night, painted block walls, vinyl tiles, fluorescent panels, windows onto
a city) dressed back to the early 1960s: a nickel vacuum line, cylinders of fluorine in a ventilated cabinet,
a big Dewar of liquid nitrogen, a dry-ice box, a UV lamp; and at the far end, a door into a later laser lab
(1990s): a KrF excimer laser on an optical table.

Station 1, "Make it" (the picture's cold bulb).
- Tap the krypton cylinder, then the fluorine cylinder: both flow into a cold nickel or quartz vessel standing
  in liquid nitrogen (out of order the Atomling says why: no fluorine, nothing happens).
- Tap the UV lamp (or the spark coil): colourless crystals of KrF2 grow on the cold wall; a lens shows the
  linear F-Kr-F molecules packing.
- Slider: the vessel's temperature, −196 °C to 25 °C: below −78 °C the crystals keep; warmer, they fall apart
  little by little (about 10% an hour at room temperature, sped up and said so), krypton and fluorine coming
  back; a gold leaf on a stand beside it (tap it into the vessel): the krypton difluoride attacks even gold.
- Facts to check: 1963, photochemical (Streng) or discharge synthesis at low temperature; the early "KrF4"
  report was KrF2 (Grosse et al.); colourless volatile solid; decomposition about 10% per hour at room
  temperature, stable at −78 °C; 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr.

Station 2, "Who will hold hands?" A row of six glass bulbs: helium, neon, argon, krypton, xenon, radon (radon in
a lead holder, no Geiger counter: that is the workshop's).
- Tap a bulb to offer it fluorine: helium and neon never; argon only as HArF frozen at very low temperature
  (2000, Helsinki); krypton: KrF2; xenon: many (XeF2, XeF4, XeF6, from 1962, Bartlett's XePtF6 first); radon:
  a fluoride (reported).
- Each atom is drawn at its size with its outer shell: the bigger the atom, the farther its outer electrons
  from the nucleus and the easier for fluorine to tug at them; a bar shows the first ionisation energy
  (24.59, 21.56, 15.76, 14.00, 12.13 eV; radon 10.75: check). Bars, not an energy ladder (the workshop has the
  ladder of lines).
- Facts to check: HArF (Khriachtchev et al., Nature 2000); Bartlett 1962; radon fluoride (Fields, Stein and
  Zirin 1962: check).

Station 3, "A molecule that lives for a flash" (the picture's laser and close-up). Through the door, a KrF
excimer laser opened up on an optical table, a fluorescent card, a mask and a lens over a small wafer.
- Tap the discharge: in the gas, excited krypton and fluorine atoms join (KrF*), a few nanoseconds later they
  spring apart with an ultraviolet flash (248 nm), the flashes bounce between the mirrors and grow into a beam.
- Tap the card: the invisible beam shows as a blue glow on it.
- Tap the lens: the beam carries a pattern from the mask onto the wafer, four times smaller (one short step:
  silicon's rooms have the chip line and the transistor; only the printing here).
- Slider: the laser's pulse rate, slow enough to see each flash.
- Facts to check: 248 nm; the excited state's lifetime of a few nanoseconds; a repulsive ground state; KrF
  lithography at the 250 to 130 nm generations around 2000 (Cymer, ASML); the Nike laser at NRL.

---

## kryptonite: "Is kryptonite real?"

Picture: `public/boards/Kr/kryptonite.svg` (split by a comic page's jagged edge: on the left halftone dots, a
caped hero across a big moon and glowing green crystals in a starburst; on the right a museum case at night,
the white earthy lump of jadarite under a glass dome, a clear flask of krypton; a close-up of the flask's atoms).

Place: a natural history museum's mineral gallery at night (London's in spirit, no names or logos on anything):
a new stage `gallery.js`, a long Victorian gallery of iron and glass, rows of wooden mineral cases with lit
specimens, a vaulted roof, moonlight through the skylights, a polished floor. Halfway along, one bay is dressed
as a comic page come to life: halftone dots on its walls, a jagged panel edge where it meets the real gallery
(the picture's split, made a doorway). No superhero figure with any emblem: the comic side holds only the green
crystals and a cape on a stand.

Station 1, "Same recipe?" (the picture's two halves). On the comic side, the green crystals on their rock
(glowing, made up); on the real side, jadarite in its case.
- Tap an element tile on the comic side's label (sodium, lithium, boron, silicon, oxygen, hydrogen,
  fluorine): the same tile lights on jadarite's label too, all but fluorine (jadarite has none).
- Tap the green crystals: they flicker (a stage light inside, the Atomling says: made up for a radio show in
  1943). Tap jadarite: a lens shows it is white and earthy, not crystals that glow.
- Tap the lithium tile: a little battery fills (the deposit is one of Europe's largest stores of lithium).
- Facts to check: jadarite LiNaSiB3O7(OH), Jadar basin near Loznica, Serbia, Rio Tinto, described in 2007 (Chris
  Stanley, Natural History Museum; Canada's National Research Council); the film's case label (Superman Returns,
  2006) "sodium lithium boron silicate hydroxide with fluorine"; kryptonite in the radio serial, June 1943, in
  the comics 1949 (red, in Superman #61; green from 1951). Jadarite's pinkish-orange fluorescence under UV
  has only one source found: leave it out unless confirmed (mindat, IMA description).

Station 2, "Real krypton can be a rock" (the picture's flask). A flask of krypton gas on a stand (nothing to
see), a Dewar of liquid nitrogen beside it.
- Tap the flask: a lens shows its atoms flying about.
- Tap the Dewar: the flask's bulb dips into the liquid nitrogen; white crystals of krypton grow inside.
- Slider: the bulb's temperature, −196 °C to −140 °C: solid below −157.4 °C, a little liquid for only about
  4 degrees, gas again above −153.2 °C (a thermometer with the three bands).
- Facts to check: melting and boiling points (elements.json); solid krypton white, face-centred cubic
  (elements.json lattice FCC).

Station 3, "What krypton really does to people" (no superpowers lost). A small pressure chamber like a diving
bell, a diver figure in it (or the Atomling), and a gas panel.
- Slider: the chamber's pressure of air, 1 to 5 bar (a depth gauge to 40 m): past about 30 m the diver's
  thought bubble goes wobbly (nitrogen narcosis, "the rapture of the deep").
- Tap the krypton bottle: at normal pressure, a mix of half krypton and half air makes the same wobble as air
  at 4 bar (about 30 m): krypton is about seven times as narcotic as air. The Atomling says plainly: only in
  the story, never breathe gas from a bottle.
- Facts to check: krypton narcotic potency about seven times air's; 50% Kr / 50% air comparable to air at four
  times atmospheric pressure, like 30 m (Wikipedia "Krypton", Precautions; find the primary source before
  building).

Must not repeat: the workshop's balloons (heavier than air) and its glowing tubes (no discharge tube here).

---

## Facts flagged while writing the boards (for whoever builds the rooms)

- Discovery day: 30 May 1898 (most sources, Kr.js) or 31 May (DSB's Travers entry): the boards say "May 1898"
  and "the end of May".
- The krypton Hall thruster's figures (about 70 mN, about 16 km/s) are worked out from SpaceX's 2023 statement
  about the argon thruster (170 mN, 2.4 times the thrust, 1.5 times the specific impulse of the older one), not
  published directly.
- Glazing gap widths and U-values vary with the source (vendor tables): the boards say "roughly" and "about".
- That Superman's planet was named after the element is the usual reading, not documented by its creators.
