# Silver's picture rooms: a design per board

Silver's seven boards (`src/content/boards/Ag.js`, pictures `public/boards/Ag/<id>.svg`, drawn by
`tools/boards/Ag/`; look at them with `py -3.11 tools/boards/lib/render.py Ag`). One room per picture, each at
`/e/Ag/<id>` (silver has no wing, so no id clashes). Seven different places. Read `docs/knowledge/picture-rooms.md`
(scene contract, stages, traps) and `docs/knowledge/adding-a-wing.md` "Look and feel" (each step chosen by tapping
its thing, sliders for what varies smoothly, the prompt naming the next tap; E opens the panel whose buttons do the
same steps). Every room is the picture made into a place: the same things, the same colours. `room.js` gives every
room its frame back to the hall, the easel with the story, and silver's Atomling.

Never repeat, in any of the seven:
- What silver's hall already shows: the verse stone (Psalm 12:6, silver refined in a furnace, and its reason:
  cupellation), so no room melts or refines silver in a furnace and no room shows cupellation; the specimen case
  (wire silver on its black ore, a flask silvered into a mirror ball, a piece of eight in a holder:
  `silver` in `src/worlds/atrium/showpieces.js`), so a room may use these things in its own story but never as a
  plain display case.
- The built rooms in `picture-rooms.md` "Built", the near ones above all: iron's `tower` (the Eiffel Tower's second
  floor: the medal's iron hexagon is only a pointer to it), iron's `compass` (a research ship's steel deck at night:
  the galleon must not look like it), iron's `smith` (a bloomery and an anvil), sodium's `davy` (a candlelit
  basement laboratory) and `lamps` (light of one colour renders no colour: the darkroom's red lamp is about the paper
  being blind to red, not about colour rendering), sodium's `space` and carbon's `sky` (mountaintop observatories
  outside at night: the mirror room is inside a 1920s dome), carbon's `football` and krypton's `hands` (the `lab.js`
  stage), krypton's `windows` and `kryptonite` (snow at a window factory, a museum gallery), oxygen's `ozone` and
  `aurora` (polar snow, an arctic camp), krypton's `thruster` (a platform outside in orbit: the germs room is inside a
  station module), the body rooms (sodium's `nerves`, carbon's `you`, oxygen's `breath`: the germ here is a giant
  model in a water sphere, not the body's fluid), the kitchens (sodium's `kitchen`, silicon's `silicone`).
- Radon's seven rooms, being built now (`docs/agents/designs/Rn_rooms.md`): above all its `cave` (a lamplit limestone
  show cave: the silver mine has hewn, soot-dark rounded galleries, rails and shafts, no stalactites and no pools) and
  its `moon` (the lunar surface).
- The Atom Forge and the Star Forge: no room makes silver in a star or steps through decays.

The silver look: silver atoms everywhere are the pictures' grey shaded balls (`#b4bcc8`, highlight `#f4f6fa`), Ag+ the
same ball with a white plus on it (`aion` in `tools/boards/Ag/agkit.py`), gold `#ffc93a`, copper `#d8843a`, iodine
purple `#a830b0`, bromine dark red `#b8402e`, sulfur the kit's yellow. Polished silver in 3D is a drawn matcap (the
showpiece's `silverMatcap`, `chromeMatcap` for a mirror ball): a lit metal face only mirrors the room it stands in.

Numbers from `src/data/elements.json`: silver melts at 961.78 °C, boils at 2162 °C, density 10.501 g/cm³, thermal
conductivity 429 W/(m·K), isotopes 107 (51.839%) and 109 (48.161%), 0.075 mg/kg of the crust; gold 19.282 g/cm³,
copper 8.96, lead 11.342, tin 7.287, iron 7.874, aluminium 2.70; molar masses Ag 107.87, Au 196.97.

---

## medal

Title: "Is a gold medal made of gold?" · Picture: `public/boards/Ag/medal.svg` (`medal.py`: a stadium at night,
floodlights and a crowd of flashes; the Paris 2024 gold medal over a podium, the iron hexagon in its middle, its gold
skin peeled back at one corner showing silver; the winner's silver medal of 1896 with an olive branch; a close-up of
two rows of gold atoms over silver atoms, a few copper among them).

Place: the Panathenaic Stadium in Athens at dusk (a new stage `stadium.js`): the long horseshoe of marble terraces
(kept mid-toned, `#9a9aa8` to `#b8b4b0`, or the bloom whitens it), the cinder track, the Acropolis lit on its hill
beyond, floodlights coming on, a few flags. The 1896 Games were held here and the Paris 2024 medals show it. On the
track: a podium of three steps, and beside it a medal-maker's bench under an open tent (the workshop of the Monnaie
de Paris, which struck the medals of both 1896 and 2024, brought to the stadium).

Station 1, "What is under the gold?" (the picture's medal). A gold medal 2 m across standing on its edge in a stand,
the iron hexagon in its middle, radiating lines, and a balance beside it.
- Tap the medal's corner: its gold skin peels back like the picture; a lens on the cut shows a thin skin of gold atoms
  over silver atoms with a few copper atoms (sterling, 925 parts in 1000).
- Tap the balance: the real gold medal (529 g: about 505 g of silver, 6 g of gold, 18 g of iron) goes on one pan, a
  copy of solid gold the same size on the other: the copy is almost twice as heavy (about 950 g, worked out from the
  densities; say "about") and its price tag reads "tens of thousands of euros".
- Tap the hexagon: a pointer only, "this iron came from the Eiffel Tower: see iron's hall".
- Facts to check: Paris 2024 medals 85 mm, 9.2 mm, 529 / 525 / 455 g, 18 g hexagon of puddled iron, 5084 medals,
  made by the Monnaie de Paris, designed by Chaumet (paris.fr, olympics.com); the 505 g of silver (press reports, Compound
  Interest); the rule: first- and second-place medals of silver at least 925/1000, the gold one gilded with at least 6 g
  (Olympedia). The ~950 g is (505/10.501 + 6/19.282) cm³ of gold plus the iron: flag it as worked out.

Station 2, "Gild it" (electroplating). On the bench: a tank of clear yellow gold-plating solution, a power supply
with an ammeter, a silver medal blank on a hook.
- Tap the blank: it hangs from the negative bar into the bath. Tap the switch: the needle moves, gold ions (gold balls
  with a plus) drift to the medal and become gold atoms; the medal turns gold.
- Slider: the current, or the time; a counter shows grams of gold laid down (one ampere for one hour lays about 7.35 g
  of gold from a gold(I) bath: 6 g is about 0.8 A for an hour) and the skin's thickness (6 g over about 140 cm² is about
  0.02 mm).
- Out of order: the switch without a medal does nothing; the medal hung on the positive side loses silver into the
  bath instead (the Atomling says why).
- Facts to check: Faraday's law (96 485 C per mole of electrons, Au 196.97 g/mol, gold(I) cyanide or sulfite baths);
  that gilding Olympic medals is done by electroplating (usual, not confirmed for Paris 2024: the board says
  "usually").

Station 3, "Who got what?" (the picture's podium and the 1896 medal). The three steps on the track.
- Slider: the Games, from 1896 to 2024. 1896: the winner's step holds a silver medal, an olive branch and a diploma, the
  runner-up's a copper medal and a laurel branch, the third step nothing. 1900: cups and other prizes for many events.
  Then gold, silver and bronze; solid gold medals until 1912; gilded silver after; 2024 with the iron hexagon.
- Tap a step: its medal comes up in a lens, cut through, showing what it is made of in that year.
- Facts to check: 1896 prizes (Wikipedia "1896 Summer Olympics", the IOC's Olympic Studies Centre table: silver and
  copper by Jules-Clément Chaplain, struck by the Monnaie de Paris); 1900 mixed prizes; the first Games with all three
  medals (sources say 1904 or 1908: show "from 1904" only if checked); 1912 the last solid gold (Guinness, Olympedia).

Must not repeat: iron's `tower` (no Eiffel Tower place here), hydrogen's `airship` (Paris in 1783), the verse stone
(nothing melted or refined).

---

## mirror

Title: "What is behind a mirror?" · Picture: `public/boards/Ag/mirror.svg` (`mirror.py`: inside the dome of the great
telescope on Mount Wilson at night, the slit open on the stars and the Andromeda galaxy, the telescope's open tube; its
2.5 m mirror lying in its cell being silvered, half a bright mirror showing the galaxy, half dark bare glass, a jar
pouring the liquid; starlight coming down and bouncing back; a close-up of one layer of silver atoms on glass with
light bouncing off it).

Place: the dome of the 100-inch Hooker telescope, Mount Wilson, a night in the 1920s (a new stage `dome.js`): the
great dome's steel ribs and its slit open on a starry sky with the Milky Way and the Andromeda galaxy, the telescope's
open tube in its huge yoke, iron stairs, a balcony round the wall, 1920s electric lamps, brass dials; the mirror out
of the telescope, lying in its cell on the floor for its new coat (as Russell Porter saw it in 1929). It is inside a
dome: not sodium's or carbon's open summits.

Station 1, "Silver the mirror" (the picture's scene). The 2.5 m glass disc (33 cm thick) in its cell, a row of jars,
long swabs.
- Tap the acid jar: the old, tarnished silver washes off; bare glass, dark green-blue.
- Tap the reducing jar, then the silver jar (silver nitrate dissolved in ammonia): the liquids flood the disc, the
  swabs keep them moving, and a silver film grows across the glass from brownish to a bright mirror. Slider: the minutes
  (the film's thickness and a reflectance meter climbing to about 95%).
- Out of order: the silver jar alone does nothing (nothing to give the silver ions their electron); the reducing jar
  alone does nothing (no silver).
- Tap the little dish: all the silver of one coat gathered into a cube about 1 cm across, beside a sugar cube.
- Facts to check: Porter's account in Scientific American, 1929 (quoted in Mount Wilson's "Reflections", June 2016):
  silvered twice a year, three pounds of silver nitrate in solution, a film about 1/100 000 inch thick, all of it a
  cube about 3/8 inch on a side; aluminised by John Strong in February 1935 (Humason, PASP 47, 1935). The reducing
  agent used at Mount Wilson is not given there (sugar, Rochelle salt and formaldehyde were all used: MRS Bulletin,
  April 1989): do not name one as theirs.

Station 2, "Which metal shines best?" A bench of five round mirrors facing a lamp: speculum metal (Newton's copper and
tin), a tin-mercury amalgam mirror (Venice), aluminium (1935), silver, gold.
- Tap a mirror: the lamp's beam bounces off it into a light meter showing the share reflected.
- Slider: the lamp's colour, from violet to red (and, at Scientist level, ultraviolet and infrared at the ends):
  silver tops the visible, weakens in the violet and fails near 320 nm; aluminium keeps on into the ultraviolet (why it
  replaced silver on most telescopes); gold reflects red and infrared but not blue (why it looks yellow).
- Tap the jar of foul air beside the silver mirror: it tarnishes dark (silver sulfide) and its reading drops: why the
  telescope needed a new coat twice a year, and why Gemini's silver (2004) is sealed under a protective layer.
- Facts to check: reflectances (silver about 95 to 98% in the visible, aluminium about 90%, speculum about 60%, gold
  high in red and infrared and low in blue; take the curves from a coating maker's published data); silver's dip near
  320 nm; Gemini's protected silver (Gemini Observatory, 2004).

Station 3, "Find another galaxy" (Hubble, 1923). At the telescope's plate holder and a viewing desk with a light box.
- Tap the telescope: the dome turns, the slit opens towards Andromeda and a 45-minute exposure builds on a glass plate
  (a slider for the minutes).
- Tap the plate: the light box shows it beside the night before's; tap the three spots marked N: one blinks, its N is
  crossed out and "VAR!" written beside it; its light curve draws itself over 31.4 days.
- Slider: from its period, how bright it really is, and so how far: about 900 000 light-years in 1925's numbers, about
  2.5 million today (the Scientist panel says why the scale changed).
- Facts to check: plate H335H, night of 5 to 6 October 1923, 45 minutes (Carnegie Science's plate archive); period
  31.4 days; Hubble's 1925 distance about 285 000 parsecs (about 900 000 light-years); today about 2.5 million.

Must not repeat: sodium's `space` (a laser guide star and a modern camera outside), hydrogen's `radio` (mapping the
Milky Way at 21 cm), the noble gases' spectroscope.

---

## germs

Title: "Can a metal fight germs?" · Picture: `public/boards/Ag/germs.svg` (`germs.py`: a big Petri dish covered with
a lawn of germs except in a clear ring round a silver coin, a blue plastic button with germs right up to it; the space
station crossing the stars; a brown dropper bottle letting fall a drop; a plaster with a silver pad; a close-up of a
rod-shaped germ with silver ions clinging to the sulfur in its skin).

Place: inside the Russian service module of the International Space Station (a new stage `spacestation.js`): a long
white cylinder of panels, handrails and cable bundles, velcro patches, a round window with the Earth turning below
and a sunrise every 92 minutes, a laboratory rack with a glovebox, the water machine behind a panel, water drops
floating free. The visitor walks on the "floor" with velcro shoes; loose things float. Not krypton's `thruster`
(outside on a platform): this is inside.

Station 1, "Water from breath" (the station in the picture). The water machine opened up behind its panel: the air
duct, a cold condenser, filter columns, a silver ionizer (a little cell with silver plates), a heater, a drinking
bag.
- Tap the astronaut's breath (a puff by the duct): damp air flows over the cold plates, drops gather and a tank fills.
- Tap the filter columns: the water runs through them clean of dirt and smells.
- Slider: the silver added, 0 to 0.2 mg/L. A lens on the tank: at 0, germs multiply over a week (a counter); at 0.05
  mg/L and above they stop.
- Tap the heater (85 °C, pasteurising), then the bag: a sphere of water floats out; the Atomling drinks a toast.
- Facts to check: the SRV-K system in the Russian segment (NASA NTRS 20180004666: humidity condensate, multifiltration,
  minerals added, silver 0.05 to 0.20 mg/L, pasteurised at 85 °C); the US segment uses iodine; NASA tests silver for
  missions beyond orbit (safe to drink below about 0.4 mg/L, NTRS 20250005545).

Station 2, "The germ dish" (the picture's dish, made big). In the glovebox, a Petri dish 2 m across, its jelly
seeded with germs, and a tray of things to try.
- Tap a thing to place it on the jelly: a silver coin, a copper coin, a blue plastic button, a plaster with a silver
  pad.
- Slider: hours, 0 to 24: the lawn grows; clear rings open round the silver and the copper, none round the button.
- Tap a ring: a lens shows silver ions spreading out into the jelly from the coin, fewer the farther out: the ring
  ends where there are too few to stop the germs.
- Facts to check: the agar diffusion ("zone of inhibition") test, as school labs do it with silver and copper (copper
  is antimicrobial too); do not give ring sizes; germs grown on the station in microgravity behave a little
  differently (say nothing unless sourced).

Station 3, "Inside a germ" (the picture's close-up). A rod-shaped germ 3 m long in a floating sphere of water, its
skin dotted with yellow sulfur, a tail, protein machines turning inside.
- Tap a silver ion floating by: it drifts in and grabs a sulfur on a protein in the skin; that machine stops.
- Tap three more: the skin leaks, its turning machines stop one by one, it cannot divide (a division counter stops).
- At Scientist level, a slider: the silver in the water, against the line where growth stops (tens to hundreds of
  micrograms per litre).
- A small 1880 bottle on the rack's shelf: tap it for Credé's drops (the panel tells it; no baby is shown).
- Facts to check: the mechanisms (thiol binding, respiration, DNA) as in the story; Credé from 1 June 1880, published
  1881, 2% silver nitrate (Schmidt 2007; Am J Ophthalmol centenary note); argyria from long swallowing of silver.

Must not repeat: the body rooms (`body.js`), krypton's `thruster`, hydrogen's `fuel` (Apollo's fuel-cell water).

---

## wire

Title: "Can a rock grow silver hair?" · Picture: `public/boards/Ag/wire.svg` (`wire.py`: Kongsberg's hillside at dusk,
two children and their ox at a rock that glints; below, the rock in section: grey gneiss in bands, a pale vein; a
shaft with a ladder, a long gallery with smooth rounded walls, rails and an ore cart, a fire burning against its far
end; in the vein, a black lump of silver sulfide with curls of silver wire; a close-up of sulfur and silver atoms,
silver moving to the root of a wire that grows from below).

Place: Kongsberg's King's Mine (a new stage `mine.js`): it starts outside, on the hillside of Gruveåsen at dusk among
spruces, at the mouth of the adit with the shaft house above; then a long gallery into the mountain: grey gneiss walls
smoothed and rounded by fire, soot on the roof, a wooden smoke loft along the top, rails with a little ore train,
iron ladders down a shaft, miners' lamps, a pale calcite vein crossing the wall. No stalactites, no pools: radon's
`cave` is a show cave.

Station 1, "The ox's find" (outside, the picture's top). The rock outcrop, the ox and two children (simple figures).
- Tap the ox: it butts the rock, a flake falls, a glint shows; tap the glint: a lump of black ore with silver in it
  comes to the hand; the Atomling tells it as the story the town tells.
- Slider: years, 1623 to 1958: the hillside fills with shaft houses, waterwheels and the town of Kongsberg (founded by
  Christian IV on 2 May 1624); a counter climbs to about 1350 tonnes of silver; a depth gauge on the King's Mine grows
  to 1068 m (its bottom about 500 m below sea level); 4000 people worked here around 1770; closed in 1958.
- Facts to check: Helga Verp and Jacob Grosvold, early July 1623 (Norsk Bergverksmuseum; Wikipedia calls the story
  "somewhat romanticized"); the silver works counted from 18 October 1623; the totals and depths (the museum gives about
  500 m below sea level, Wikipedia 560 m: say "about 500").

Station 2, "Fire against the rock" (the picture's gallery). The gallery's end face, a stack of split spruce logs.
- Tap the logs: they are stacked against the face; tap the torch: the fire burns (sped up from a weekend: fires were lit
  on Friday and the miners came back on Monday), smoke rises into the loft above.
- The face glows with heat, cracks and flakes; tap the hammer and pick: the loosened rock comes away; a ruler shows
  the advance, 10 to 15 cm a fire, and a board how far that comes to in a month (about 0.5 to 1.5 m in a gallery of the
  1700s, up to 7 m in the great adit with its smoke loft).
- Facts to check: 10 to 15 cm per fire (Bjørn Ivar Berg, quoted by Blaafarveværket and bergverkshistorie.no); the
  Friday-to-Monday fires (Galissard de Marignac, 1839, in Mines ParisTech's "Grand Tour industriel"); no water was
  thrown on the hot rock at Kongsberg; the smoke loft from 1844; last fire 1890.

Station 3, "Grow silver hair" (the picture's vein and close-up). In the mine's forge, a lump of black silver sulfide
on a little hearth with bellows; in the wall beside it, the vein with real curls.
- Tap the bellows (or a temperature slider, 20 to 800 °C): above about 177 °C the crystal changes (the lens shows its
  silver ions starting to run through the sulfur), above about 450 °C silver curls push out of it and grow, millimetres
  in half an hour (sped up), and the lens shows silver arriving at each wire's root; too hot and the lump starts to
  melt and the curls are lost.
- Tap a curl in the vein: the lens shows the same curls in the rock; the Atomling says nobody knows yet whether nature
  grew them hot or slowly in cool groundwater.
- Facts to check: Anderson, Mathur, Rakovan and Tremsin, Geology 47 (2019): growth at the base from argentite, a
  superionic conductor; wires up to 7 mm in an hour in a Bunsen flame (Anderson, Cedarville 2016); the acanthite to
  argentite change at about 177 °C; silver sulfide's melting point (sources give 825 to 836 °C: check before showing a
  number).

Must not repeat: radon's `cave`, iron's `smith` (the forge here only heats a sample), the verse stone (no smelting).

---

## snow

Title: "Can people make it snow?" · Picture: `public/boards/Ag/snow.svg` (`snow.py`: a November morning over Mount
Greylock and its memorial tower, a long grey-blue cloud, a little high-winged plane scattering dry ice into it,
curtains of snow hanging under the seeded stretch and fading before the ground; Schaefer's freezer with its lid open,
crystals sparkling in a lamp's beam; a close-up of silver iodide's honeycomb with water molecules lining up into a ring
of ice).

Place: the summit of Mount Greylock in November 1946 (reuse `meadow.js`, a hilltop whose sky follows the sun, dressed
for late autumn: brown grass and frost, bare trees, the memorial tower with its globe on top, the Berkshire hills
below), a long cloud deck lying above the summit, and a small wooden lab hut at the summit (General Electric's cold
box brought up for the day). Not krypton's `windows` (snow at a factory), oxygen's `ozone`, `aurora` or `water`.

Station 1, "The cold box" (Schaefer's freezer, July 1946). A chest freezer lined with black velvet, a lamp shining in,
a thermometer, a shelf of jars: talc, salt, ash, soot, dry ice, a silver iodide burner.
- Tap the breathing tube: a cloud of droplets fills the box; the thermometer reads below 0 °C but a lens shows the
  droplets still liquid.
- Tap a jar to drop its dust in: most do nothing; the dry ice: millions of crystals sparkle in the beam and snow onto
  the floor; the silver iodide smoke: crystals appear too.
- Slider: the box's temperature, 0 to −40 °C: above about −4 °C even silver iodide does nothing; colder, the seeds
  work; near −38 °C the droplets freeze by themselves.
- Facts to check: Schaefer's July 1946 experiment at GE, Schenectady (AAAS, GE Reports); homogeneous freezing near −38
  °C; silver iodide active from a few degrees below 0 (as warm as −3 °C in some studies: Soni and Patey 2022; the
  board says "a few degrees below zero"); dry ice at −78.5 °C.

Station 2, "Two crystals" (the picture's close-up, made big). Two lattice models on stands: ice (rings of six water
molecules) and silver iodide (silver and iodine in a honeycomb), and a cube of salt.
- Tap the ice layer: it slides onto the silver iodide and fits, hexagon on hexagon; tap it onto the salt: it does not fit.
- At Scientist level a ruler shows the spacings (4.59 against 4.52 Å) and the difference, about 2%.
- Facts to check: the lattice constants of hexagonal β-AgI and ice Ih; Marcolli et al., ACP 16 (2016): a good match helps
  but is not the whole story (the panel says so).

Station 3, "Seed the cloud" (the picture's plane and cloud). The cloud deck over the summit, the plane passing
overhead, a ground burner on the slope.
- Tap the plane: it flies through the cloud scattering dry ice; the seeded stretch turns to ice and curtains of snow
  fall from its base and fade before the ground, as on 13 November 1946.
- Tap the burner: silver iodide smoke rises into the cloud (today's way); a slider for the cloud's temperature: warmer
  than about −4 °C nothing happens.
- A board, honestly: how much more snow? A little, and it is hard to measure (SNOWIE, Idaho, 2017).
- Facts to check: 13 November 1946, about 14 000 ft (4300 m), −18.5 °C, about 3 lb dropped before the dispenser froze and
  the rest pushed out of the window (Schaefer's own account, Journal of Weather Modification); SNOWIE (French et al., PNAS
  2018; Friedrich et al., PNAS 2020).

Must not repeat: silicon's `solar` (the same meadow stage: here autumn, a tower, clouds, no sun slider), the snowy rooms
named above.

---

## photo

Title: "How were photos made before phones?" · Picture: `public/boards/Ag/photo.svg` (`photo.py`: a darkroom under a
red safelight; prints drying on a line with pegs; the enlarger shining down onto paper; three trays, a cat coming up
on the paper in the developer; a close-up of silver bromide's checkerboard of silver and bromine atoms, a ray of blue
light striking it and a speck of four silver atoms on its face).

Place: a photographer's studio and darkroom (a new stage `darkroom.js`; this is the studio's idea "The darkroom",
`silver-darkroom` in `docs/studio/backlog.json`): a daylight portrait studio with a painted backdrop, a big wooden
camera on a tripod and a posing chair, and through a light-tight curtained door the darkroom: red safelights, a long
sink with trays, an enlarger, a film tank, a drying line of prints. Not `lab.js`.

Station 1, "Take a picture" (Daguerre, 1839). In the studio, the wooden camera, a silvered copper plate, an iodine box
and a mercury box (a sealed one: the panel says mercury fumes are poisonous).
- Tap the plate into the iodine box: it turns golden-yellow (silver iodide). Tap the camera: the Atomling sits for its
  portrait; slider: the exposure, from seconds to minutes: too short, nothing; long, and the Atomling must keep still
  (it fidgets and blurs if the slider runs long).
- Tap the mercury box: the picture comes up on the plate, a mirror that shows the picture positive or negative as you
  move.
- Facts to check: Daguerre's process announced in 1839 (iodine fuming, mercury development, salt then hypo fixing);
  exposures of minutes in 1839, seconds a few years later.

Station 2, "The hidden picture" (the picture's close-up, made big). A crystal of silver bromide as big as a table, set
in gelatin.
- Tap the lamp to send one photon: an electron is freed, wanders and is caught; a silver ion arrives and becomes a silver
  atom. Each tap adds one; at four the speck lights up: "developable".
- Tap the developer: the whole crystal turns into one black silver grain (zoom out: billions of atoms from four).
- Slider: light (photons per crystal), and a strip of crystals turning grey to black: how a picture's greys are made.
- Facts to check: Gurney and Mott (1938); four atoms (three with gold sensitising); a gain of about a billion (Tani,
  Physics Today 1989); grains sensitive mainly to blue.

Station 3, "The darkroom" (the picture's trays). The enlarger with a negative of a cat, three trays, the red lamp, the
drying line.
- Tap the enlarger: the cat's negative shines onto the paper; slider: the seconds (too few: pale, too many: dark).
- Tap the paper into the developer: the picture comes up (a timer); then the stop bath, then the fixer (hypo dissolves
  the unused silver salt), then the wash; out of order: switch on the white light before the fixer and the paper goes
  grey; skip the fixer and the print darkens later in daylight.
- The finished print goes on the line with a peg, beside the others.
- Facts to check: red or amber safelights for black-and-white paper; paper developing in about a minute or two; hypo
  (Herschel, 1839); Talbot's negative-positive calotype (1841).

Must not repeat: sodium's `lamps` (no colour-rendering lesson), the mirror room (here silver comes as grains, not a
film), `lab.js` rooms.

---

## dollar

Title: "Why is a dollar called a dollar?" · Picture: `public/boards/Ag/dollar.svg` (`dollar.py`: a galleon's deck at
night under a full moon; an open chest heaped with silver coins, more spilled on the planks; one coin cut into eight
pieces like a pie and the chisel beside it; beyond the rail, the moonlit sea, a second galleon under sail, a far shore
with a cone-shaped mountain, the silver mountain of Potosí; a close-up of a coin's metal, silver atoms with a few copper
atoms).

Place: a Spanish treasure galleon at anchor off the American coast at night (a new stage `galleon.js`; borrow the
sea and swell of `ship.js`, nothing else): a wooden main deck with three masts and furled or set sails, the rail,
lanterns, the high stern with the great cabin and its windows, a hatch and ladder down to the hold with chests and
barrels. A full moon. It must not look like iron's `compass` (a steel research ship with a winch): wood, rope, canvas,
lantern light. Potosí is far inland at about 4000 m: the far shore's cone is the picture's idea; in the room, Potosí is
on the map table, and the shore is just a coast.

Station 1, "Pieces of eight" (the picture's cut coin). A coin 1 m across on a chopping block, a chisel and mallet, a
balance.
- Tap the chisel: the coin is cut in half (four reales), in quarters ("two bits"), in eighths (one bit each); each piece
  goes on the balance (27.47 g for the whole coin, about 3.4 g a bit).
- Tap a ragged hand-struck coin (a "cob") and a round milled one (from 1732, its edge reeded): the cob's edge can be
  clipped and the silver kept; on the milled coin a clipped edge shows at once.
- Facts to check: 27.47 g of 0.9305 fine silver (the 1537 standard; University of Notre Dame's colonial coin notes);
  bits and "two bits"; cobs to 1773 at Potosí, milled pillar dollars from 1732.

Station 2, "Where the silver came from" (the map table in the great cabin). A table with a map of the world in relief.
- Tap Joachimsthal in Bohemia: silver found in 1516, the first thalers in 1520; the name spreads as glowing word tags
  over Europe (tolar, talar, Taler, daler, dollar).
- Tap Potosí, Zacatecas and Guanajuato: the mints (Mexico City from the 1530s, Potosí from the 1570s), llama trains to
  the coast, the treasure fleets to Seville, the Manila galleon from Acapulco to Manila and China.
- Slider: years, 1500 to 1857: the routes light up; 1792, the US dollar; 1857, Spanish dollars stop being legal tender in
  the USA.
- Facts to check: Joachimsthal 1516 and 9 January 1520 (Czech Mint, Radio Prague, BBC); about 12 million thalers by the
  mid-1500s; the Manila galleons 1565 to 1815; US Coinage Act 1792 (371.25 grains, 24.06 g, of pure silver); legal tender
  to 21 February 1857.

Station 3, "Is it real silver?" (the purser's corner in the hold). A stone slab, a balance, a measuring cylinder of
water, a heap of coins, some of them fakes.
- Tap a coin to drop it on the slab: real silver rings, a fake of lead or base metal thuds (sound).
- Tap a coin into the cylinder: the water rises by its volume; the balance gives its mass; a dial shows the density:
  silver about 10.5 g/cm³ (an alloy of 93% a little less), copper 8.96, tin 7.29, lead 11.34 (Archimedes' way).
- Facts to check: the densities (elements.json); the ring test as a traditional, rough test (say "rough").

Must not repeat: iron's `compass` (a ship at night: keep this one wooden and lantern-lit), the verse stone (nothing
melted or refined).

---

## Facts flagged while writing the boards (for whoever builds the rooms)

- `medal`: the 505 g of silver in the Paris 2024 gold medal comes from press reports (Forbes, Compound Interest), not the
  organisers; whether Paris 2024's gilding was electroplating is not confirmed (the story says "usually"); "solid gold
  until 1912" is firm, when the gold, silver and bronze trio began is not (1904 or 1908).
- `mirror`: "silvered twice a year" and the sugar-cube of silver come from one witness, Russell Porter (1929); Hubble's
  first distance is given as 900 000 light-years in most sources, 1 million in some.
- `germs`: the ISS silver dose is for the Russian segment's water from cabin humidity (NASA's 2018 paper); Credé began on
  1 June 1880 and published from 1881.
- `wire`: the children's story is the town's legend ("somewhat romanticized"); the bottom of the King's Mine is about 500 m
  below sea level (the museum) or 560 m (Wikipedia); how natural wire silver grew is debated (Geology 2019 against Sci.
  Rep. 2018).
- `snow`: Schaefer dropped about 3 lb before his dispenser froze and then let the rest go (Time said 6 lb): the story
  says "a few kilograms"; AgI's threshold is "a few degrees below zero" (−3 to −5 °C by source).
- `photo`: fine as written; the cat is the picture's.
- `dollar`: the first thalers' weight differs by source (about 27.6 to 29.3 g): the story gives none; Potosí's mint dates
  vary between 1572 and 1575: the story says "from the 1570s".
