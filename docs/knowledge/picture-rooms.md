# Picture rooms: stepping into a hall's pictures (2026-10-30)

Artur, the first time he saw the new picture boards in the halls: "How can I get inside these pictures?"
He took them for portals, like the board that leads into the Periodic Videos lab. The user scheduled it,
marked it Sooner in the studio, and set the rule: **no picture without its room**. The pictures already
on the walls get their rooms (silicon first, then sodium, carbon, oxygen), and from now on a new hall's
pictures are drawn and built together with their rooms, so a picture on a wall always means you can step
in. The studio item is `picture-rooms`.

## How it works

- A picture has a room when its scene exists: `src/worlds/pictures/scenes/<Symbol>/<board id>.js`. The
  file is the list (`pictures/index.js`, an `import.meta.glob`); nothing else to register.
- The hall (`atrium.js`): a board with a room says "Step in" (not "Explore"), E dives into the picture
  (`player.dive`, as the doorway boards do) and goes to `/e/<Symbol>/<board id>`, or
  `/e/<Symbol>/<board id>-picture` when one of the element's wings has that id (oxygen's `fire` picture
  beside its fire wing: `registry.js` `pictureRoomId` / `pictureBoardId`; the scene file and the
  discoveries keep the board's id). Coming back you stand in front of the picture, facing the hall. Only
  the nearest place, an arch or a picture's room, is built ahead (`engine.prewarm`; another place asked
  for lets the previous one go, so asking for two each frame rebuilt both every frame).
- The address is a wing's (`kind: 'wing'`); `registry.loadWorld` sends a wing id that is not in `WINGS`
  to `pictures/room.js`, which loads the scene (and fails plainly if there is none).
- `pictures/room.js` (one module for every picture) adds what every room has: the picture's frame
  standing behind the spawn as the way back (walk into it), an easel with the picture and its story (the
  board's own words from `src/content/boards/<Symbol>.js`, both depths; its frame breathes until read),
  the element's Atomling (greeting and lines from the scene's words), the exhibit rules and discoveries
  (`<Symbol>:<board id>:<exhibit>`), the shared things. Entering marks the hall's board as found
  (`<Symbol>:board:<id>`), since stepping in is exploring it.
- The scene's `build(api)` makes its stage and its things to do and returns `{ env, solids,
  cameraBounds, spawn, hostSpot, back: { x, z, rot } (the frame), stand: { x, z, rot } (the easel),
  parts, shared, update(dt, t), dispose }`. `api`: `ctx, root, el, sym, lang, E (its words), W (shared
  words), ex (exhibitSet), say, later, light, color, level, depth, clickable`.
- Things worked by hand (the user's rule for every station, 2026-10-30; `adding-a-wing.md`, "Look and
  feel"): `clickable(object, onTap, { when, reach, accept })` (`common/taps.js`, shared with every
  world) makes a mesh or group a thing to click or
  tap (`accept(hit)` can refuse some hits);
  the hand shows over it while `when()` is true and the visitor stands within `reach` (4.5 m); `onTap(hit)`
  does the step (count its find with `ex.discover`, share it, say the line). Each step is chosen by
  touching its thing; a smooth quantity is a slider in the station's panel; the panel's buttons do the
  same steps for E and the probes.
- Stages, one file each in `pictures/stages/`: `water.js` (sunlit shallow sea, from the sea floor),
  `meadow.js` (a grassy hilltop whose sky follows the sun: day, dusk, stars at night), `kitchen.js` (a
  cosy tiled kitchen: counters round the room, a wall oven, a fridge-freezer, a window; silicon's at night
  by default, sodium's a sunny morning: `time: 'morning'`, `tiles`, `floorStyle`, `floorTiles`,
  `ceilingColor`, `shade`, `ovenLabel`; `oven.label(text)`, `oven.glass`, `oven.pane`), `space.js` (a
  round deck floating in space, stars above and below, a far sun lighting the planets from one side),
  `night.js` (a hilltop at night over a valley below: `drop`, `hills`, `ridge`, `paths`, `clearings`,
  `groundAt` for the scene), `workshop.js` (indoors at night: brick, flagstones, beams; gives its `brick`
  and `firebrick` materials, UVs in metres), `summit.js` (a dry desert summit at night like Paranal:
  gravel, red path lamps, far ranges, a sea of clouds, the Milky Way, airglow), `body.js` (the warm
  fluid between cells, seen very small; exports `ionCloud`, `ionTexture`, `softGlow`, `ION_LOOK`: labelled
  ions that face the eye, one draw call per kind), `saltpan.js` (Aveiro's salt works on a bright, windy
  afternoon: a clay platform cut by a canal, pans in low clay walls, heaps, the lagoon and the sea; one
  water shader for every pond, `water({ tint, alpha, perVertex })`, and `setWeather(k)` for wind and
  haze), `street.js` (a terraced street at night; its lamps light it colour by colour through `paint()`
  and `lamps.set()`: each surface's reflectance near 589 and 640 nm from its colour, Smits' smooth
  spectra), `leaf.js` (inside a leaf among its cells: palisade cells overhead, spongy cells round about,
  the lower skin's jigsaw floor with `holes` for stomata, a vein; `setSun(k)`; exports `lumpyGeometry`,
  `chloroTexture`), `lab.js` (a 1980s university lab at night: painted block walls, vinyl tiles,
  fluorescent panels, windows onto a city; gives `mats`, `shine`, `onWall(obj, side, at, y)`),
  `giant.js` (the space deck beside a red giant, limb-darkened with churning cells and its warm light;
  `giant.set({ scale, heat, glow })` ages or removes it; exports `NOISE`), `dig.js` (open country at
  golden hour, real pits cut in the ground; `pits`, `bare`, `clear`, `strataTexture`, `soilTexture`),
  `coldlab.js` (a cold lab, frosted pipes and mist, big doors onto a fenced yard at dusk; `frost`, `mats`,
  `pipeRun(points, { r, mat, bend })`, `mist({ x, y, z, rate, spread, floor })`, `puffs(max)`),
  `laboratory.js` (a laboratory of the 1770s by day: parquet, plaster over a painted dado, tall windows,
  glazed doors open onto a sunny stone terrace, a garden and a city's roofs; `windows`, `doors`,
  `terrace`, `sun`, `onWall`), `bathhouse.js` (a wooden bathhouse whose big window is set low into a
  frozen lake: snow and spruces above the waterline, the ice's underside, stones and fish below;
  `lake.set({ ice, top, deep })`),
  `polar.js` (an Antarctic ice shelf on a clear spring day: a low sun, long blue shadows, sastrugi, route
  flags, a far station of modules on legs; `sun`, `wind`, `flags`, `station`; gives `snowMaterial`,
  `sunLight`, `setNacreous(k)` for mother-of-pearl clouds), `shore.js` (an ancient shore before plants:
  a tidal flat, clear shallows with stromatolites, bare red hills, a volcano, a hazy sky; `groundAt` shared
  with the water's shader; exports `stromatoliteGeometry`, `stromatoliteTexture`, `SEA_LEVEL`),
  `gasgiant.js` (a gondola under a parachute sinking into a gas giant: cloud decks with a clear hole,
  thunderheads, lightning, the sky by height; `setAltitude(z)` in km above the 1-bar level, `flash`,
  `JUPITER_SKY`), `garden.js` (a formal garden on a winter afternoon, the Tuileries of 1783: a roped
  square, a crowd that turns and cheers, lawns, yews, a pond, a palace far off), `youngcosmos.js` (the
  young universe as a horn-shaped tunnel round a glass walkway, its fog set by `set({ temp, fog })`, a
  lawn under today's sky past the mouth; `fogColour(T)`), `depot.js` (a hydrogen filling station at dusk
  by a railway: a forecourt, a canopy, a bus lane curving away, a platform, wind turbines; `DEPOT`,
  `ROUTE`), `heath.js` (a Drenthe heath at night whose stars and Milky Way sit in the real sky and turn,
  `sky.setLst(rad)`, `galDir`, `eqDir`, `altAz`), `pond.js` (a pond at a pond skater's size: you stand
  on the water, whose skin dents, `dimple(...)`, `heightAt`, `ripple`, reeds like trunks, a lily pad),
  `townhouse.js` (a Georgian London room at night: panelling, sash windows onto moonlit roofs, a coal
  fire, bookcases; `candle()`, `onWall`), `ship.js` (a research ship's aft deck at night: winch and tow,
  portholes, a moonlit swell; `onWall`, `seaLevel`), `table.js` (a breakfast table seen at 20 times its
  size: `K`, `cm()`, bowls, cups, a cereal box), `village.js` (an Iron Age village at dusk: round houses,
  a wattle fence, a stream; `smoke()`), `tower.js` (the Eiffel Tower's second floor over Paris, the real
  sun of 21 June: `setTime(hour)`, `sunAt`, `towerParts` for models at any scale), `mars.js` (Meridiani
  Planum beside Eagle crater, a Mars sky by the hour: `marsSun(hour)`, `marsRover()`, `marsLander()`),
  `railway.js` (a welded and a jointed line through fields at night: `cuts`, `railTrain()`),
  `gaslab.js` (a Victorian teaching laboratory by gaslight: glazed brick, bottle shelves, sash windows onto a
  street at night; `gaslabStage({ mantles, pendants, windows, door, shelves })` gives `onWall` and `mats`),
  `metrology.js` (a length laboratory of 1960: flagstones, panelled plaster, tall windows onto a park at dusk,
  a vault door; `granite(w, d, top)` makes a measuring table on stone piers), `glazing.js` (wraps
  `coldLabStage` in snow: `flakes(box)`, `setSnow(k)`), `orbit.js` (a glass-floored platform in low orbit over
  the real Earth: `setSun`), `desert.js` (a dusk oasis: `desertStage({ radius, light, pool, palms, fields })`,
  `palm(height, seed)`, `sandTexture`), `gallery.js` (a Victorian museum gallery at night under a starry
  iron vault: table cases, benches, moon panes on the parquet),
  `arctic.js` (a winter camp in Lapland at night: snow, a frozen lake, fells, spruces and birches, a log
  hut and a tent, the aurora's curtains coloured by height and lighting the snow; `aurora.set({ level,
  storm })`, `aurora.time` for long exposures, `kmWorld`), and radon's six (2026-11-09): `capillary.js` (inside a
  glass capillary at a speck's size, a cold jacket of liquid air, a microscope objective as a skylight;
  `glass.setGlow/setTint/sweep`, `bath.set({ fill, air, boil, frost })`, `mercury.setPush(d)`, `radiusAt(z)`),
  `stonehouse.js` (a granite house in the Beira on a frosty night, cut open like a doll's house down to the rock;
  `window.setOpen`, `trapdoor.setOpen`, `stove.setLit`, `hood.setOn`, `setFrost`, `setSmoke`, `strataTexture`),
  `tors.js` (a granite upland of the Serra da Estrela at dusk; `GRANITE`, `boulderGeometry(r, { seed, squash, cut })`,
  `boulder()`, `groundAt`), `mcgill.js` (a McGill physics laboratory of about 1900 by electric light, snowy
  Montreal outside, a real door onto a cold corridor; `door.setOpen(k)`, `windows[i].pane.setOpen(k)`, `onWall`),
  `lunar.js` (on the Moon on a rise above a young crater, black sky, the Earth lit from the side;
  `groundAt`, `paintMoonMap(g, w, h, view)`, `MARIA`, `CRATERS`, `moonDir`) and `showcave.js` (a limestone show
  cave with a bottom and a top door; `doors.bottom/top.set(k)`, `setSeason(k)`, `setDrift(k)`, `ceilingAt`), and
  silver's seven (2026-11-09): `stadium.js` (the Panathenaic Stadium at dusk: marble terraces, a cinder track, a
  crowd with flashes, floodlights; matcaps for polished silver, gold, copper, bronze and iron), `dome.js` (inside
  the 100-inch telescope's dome on Mount Wilson in the 1920s: the slit turns, `setDomeAz(az)`; `domeTelescope()`
  with `aim(az, alt)`; `silverCap()`), `spacestation.js` (inside a station module: racks both sides, handrails split
  at `gaps` for a scene's own machines, a porthole with the Earth turning below; `STATION`, `PERIOD`), `mine.js`
  (Kongsberg: a dusk clearing over a valley town that grows with `town.setYear`, a banded-gneiss gallery with a
  forge chamber, rails, a smoke loft; `setAdvance` for the end face, `setInside`), `greylock.js` (a frosty
  November summit with its memorial tower, wrapping `meadow.js`; `cloudDeck` of puffs that can each turn to ice,
  `bareTree`), `darkroom.js` (a daylight studio and, through a curtained doorway, a brick darkroom under red
  safelights; `setWhite(k)`, `DARKROOM`) and `galleon.js` (a Spanish galleon's main deck at anchor on a moonlit
  night: castle roof, great cabin, rigging; `lantern()`, `rope()`, `onBulkhead(obj, x, y)`). A
  room picks one
  or builds its own; a new kind of place becomes a new stage file so the next room can use it.
- A station with several steps: give its exhibit `manual: true` so E opens its panel (whose buttons do
  each step), and let each tap on a thing do its step and count its find with `ex.discover`. Give the
  scene's `parts` a helper per tap (`parts.tap('tray')`, `parts.gate.tap()`) so probes can do what a tap
  does; `tools/shared_steps/pictures.json` drives them in the shared probe.
- `pictures/kit.js`: `frameDoor`, `storyStand`, `motes`, `ringWall` (a round edge), `ease`. Exhibits use
  the neon workshop's kit (`wings/noble/kit.js`: `exhibitSet`, `canvasTex`, `at`, `damp`, ...).
- Words: `scenes/<Symbol>/<id>.words.js`, all four languages, kid and sci, the same shape as the English
  (`pictures.test.js`): `title` (the room's name, in the breadcrumb), `greet`, `talk`, then one entry per
  exhibit (label, verbs, title, says, panel).

## Size, shape and speed

No size limit in the code; a room is whatever its subject needs. What costs speed is not size: a room's
code is fetched only when it is entered and freed when it is left. Two things matter. The first visit
compiles the shaders of every kind of material the room uses (1.2 to 3.9 s for the big wings), so a room
built from the kit's few materials compiles little and shares programs with the next room. And on the
phone, what is drawn at once (lights, glass, particles, bloom). `ctx.light` rooms draw fewer motes and
shafts. A room that grows rich or loved (the family dashboard shows the visits) can become a full wing
at the same address.

## Built

- Silicon, `diatoms` ("Who lives in a house made of glass?", 2026-10-30): shrunk to a diatom's size on a
  sunlit sea floor, the picture's four kinds drifting round (round, boat, triangle, star). The round
  diatom opens like a box and its lid (the golden-brown cell inside, seen through the pores while closed);
  boat diatoms in a sunbeam give off oxygen, O2 rising; a diatom family shrinks by 0.84 with each
  division (the MacDonald-Pfitzer rule) until the smallest leaves its glass, swells into an auxospore and
  becomes a full-size diatom again. Worked by hand: tap the round diatom, the boats or their sunbeam,
  the family.
- Silicon, `solar` ("How does sunlight become electricity?", 2026-10-30): a grassy hilltop. The panel
  wired to a meter and a bulb, the sun moved by a time-of-day slider (the user liked the slider far more
  than stepping through times with E) and a cloud to tap; inside a giant cut-away cell (n layer with
  phosphorus, p layer with boron, the junction), four lamps to tap fire photons: red, green and blue free
  an electron that goes round through a little bulb, blue's extra energy glows as heat, infrared passes
  through; Vanguard 1 launched from its pad (tap the rocket), orbiting a globe and beeping, at real size
  beside a grapefruit.
- Silicon, `silicone` ("Is your cake mould made of silicon?", 2026-10-30): a kitchen at night. Tap the
  silicone tray (it bends, the muffins pop out), the silicon bar (it snaps), the oven (220 °C) and the
  freezer (−18 °C): the tray stays bendy; the bouncing putty thrown, pulled slowly (a strand), pulled
  fast (it snaps), left alone (it sags, sped up); a giant PDMS chain in the picture's magnifier with a
  temperature slider: stiff below about −125 °C, wiggling harder the warmer, holding at 250 °C.
- Silicon, `earth` ("What are the Earth and Moon made of?", 2026-10-30): a deck in space. A 10 m Earth
  cut open, its layers in true proportion; tap a layer (or the depth slider) and a light goes there, a
  lens showing the atoms at that depth (crust, olivine, ringwoodite, bridgmanite, liquid then solid iron
  and nickel); the Moon at true size: tap a dark sea or the bright highlands and its rock flies into a
  case, then a mantle rock from the Earth, "the same oxygen"; tap the giant star: oxygen fuses into
  silicon, the star explodes, the silicon gathers into a disc with a young Sun and planets.
- Silicon, `valley` ("Why is a valley named after silicon?", 2026-10-30): a hilltop at night over the
  valley. A year slider from 1950 to today turns orchards into a lit-up valley, beams marking Shockley
  1956, Fairchild 1957, Noyce 1959, Intel 1968 and the 1971 headline; a giant transistor whose gate you
  tap lets electrons through to a lamp; the Intel 4004's 2300 lights, zoomed out twice to about 12
  billion, a phone chip's count; Berzelius's brown powder of 1824 in a vial.
- Silicon, `glass` ("How does sand turn into glass?", 2026-10-30): a glassblower's workshop at night.
  Tap the sand, soda and limestone into the pot in any order and heat it (sand alone stays grains at
  1500 °C, sand and soda without lime is water glass); blow the gob into a bottle or a vase that cools
  from orange to clear and goes on the shelf; at the light bench the sand scatters the beam, the pane
  lets it through (its edge green with iron), the fibre carries it round its coil.

- Sodium, `space` ("Sodium 90 km above your head", 2026-10-30): a mountaintop observatory at night.
  Tap the launcher and a 589 nm laser climbs to a star at 90 km beside a height scale (80 to 105 km,
  planes at 10 km); tap the deformable mirror and the twinkling star on the camera's screen sharpens (a
  turbulence slider); tap anywhere in the sky for a shooting star that leaves a puff of sodium in the
  layer, or the comet, Hale-Bopp, to name its dust, ion and sodium tails.

- Sodium, `nerves` ("How does your brain send a message?", 2026-10-30): beside a giant nerve fibre in
  the fluid between cells. Tap the nerve cell: Na+ gates open, Na+ pours in, a voltmeter traces the spike
  (−70 to about +30 mV in about 1 ms; a push slider shows all or nothing), K+ flows out, the signal jumps
  node to node; after three messages the nerve is tired until the golden Na+/K+ pump is worked (each tap
  one cycle: 3 Na+ out, 2 K+ in, one ATP); a race of a bare fibre and a myelinated one over 1 m.

- Sodium, `davy` ("1807: a metal nobody had ever seen", 2026-10-30): the Royal Institution's basement
  laboratory by candlelight (the workshop stage, `lamps: []`). Ten troughs of copper and zinc plates,
  each filled with acid by a tap (a slider too), up to Davy's "power of 250 of 6 and 4" (his Bakerian
  Lecture, 1807); the wire on the moist caustic soda: warmth, then at 250 pairs oxygen above and beads
  like mercury below, some burning as they form (the beads from a number shared in the room); a lens on
  a bead and on sodium's atoms; his desk: a notebook of three pages (potassium, sodium, 1808; no words in
  his hand) and a Downs cell (1924) that runs when tapped.

- Sodium, `kitchen` ("What makes a cake rise?", 2026-10-30): a sunny baking morning. The fizz test:
  tap a glass (vinegar, lemon juice, water) and a jar (baking soda, baking powder): acids foam over,
  soda in water only dissolves, baking powder fizzes in water too; two cakes: add yoghurt and soda to
  either tin, bake, cut a slice (tall and holey, or flat and dense); heat alone: soda in a test tube over
  a burner (a temperature slider) breaks down from about 80 °C, water drops, milky limewater, and red
  cabbage juice turns blue with fresh soda, green with what is left (sodium carbonate).

- Sodium, `salt` ("Why is the sea salty?", 2026-10-30): Aveiro's salt pans. A landscape model: tap the
  cloud (rain washes sodium from the mountains down the river), the volcano (chloride), the sun (water
  rises, the salt stays) and a meter climbs to today's 35 g/kg; three ponds: the sluice lets seawater in,
  the gates move the brine on, a sun-and-wind slider dries it, a board shows calcium carbonate, gypsum,
  then salt coming out at nine tenths gone, and on hot, windy days flor de sal to skim; the marnoto's
  rake piles the salt into shining heaps. Aveiro's details from Maia Alcoforado's account of 1877.

- Sodium, `lamps` ("Why were old street lights yellow?", 2026-10-30): a terraced street at night. Tap
  the lamp's switch: neon pink, then orange, then sodium yellow over ten lamp-minutes (a dial, sped up);
  under it the red car, green tree and blue ball turn to yellows and greys, the white LED across the road
  (or a slider) brings the colours back; the spectroscope shows one yellow line against a rainbow, at
  Scientist level split into 589.0 and 589.6 nm. Beek to Geleen, 1932.

- Carbon, `twins` ("A diamond and a pencil: twins?", 2026-10-30): the workshop stage raised to 7.2 m.
  A slice of the Earth to 250 km, room-high: tap it (or a depth slider) to send a lump of graphite down
  on a glass lift; below 143 km (the diamond zone) it turns into a pale diamond a third smaller, brought
  up slowly it turns back ("Too slow!"); a board shows depth, heat and the squeeze in elephants on a
  fingernail (Scientist: the pressure-temperature diagram). The kimberlite pipe: tap it and magma races
  up, carrying the carbon into a case (deep enough arrives as diamond, shallow as graphite), the ride's
  hours on a board. The pencil workshop: tap the graphite and clay hoppers (or a slider), a grade from
  9H to 8B, the kiln, then the paper draws a line as dark as the mix; Borrowdale graphite in a case.

- Carbon, `leaf` ("Plants eat air!", 2026-10-30): inside a leaf, smaller than its cells (`leaf.js`).
  Van Helmont's willow on a deck: tap the can for each year (or a slider), the willow grows; after five
  years tap it onto the scale (169 lb 3 oz, the soil about 2 oz lighter), tap the scale and it becomes a
  column of where each part came from (air, water, a sliver of soil). The stoma: tap it, the guard cells
  swell apart, CO2 drifts in and water vapour out; a dryness slider, and a thirsty leaf shuts it by
  itself. The carbon catcher: tap a CO2 or RuBisCO, its carbon joins a sugar, six make one that goes to
  the starch grain; dim the sunbeam and it stalls; new CO2 comes only while the stoma is open.

- Carbon, `football` ("A molecule shaped like a football", 2026-10-30): Smalley's lab at Rice, September
  1985 (`lab.js`). Tap the laser: pulses hit the spinning graphite disc, clusters fly, the screen draws
  the spectrum; tap the helium bottle (or a slider) and the 60 peak grows as in the Nature paper's three
  spectra. Smalley's paper model under a chalkboard and Fuller's Expo 67 dome: tap hexagons (they stay
  flat) and pentagons (they curl; two never touch), the board counts, at 12 and 20 the ball closes with
  60 corners. A graphene sheet rolled armchair or zigzag, then a nanotube and a steel wire as thin side
  by side: tap the weights, the steel snaps first.

- Carbon, `stars` ("Made inside a giant star", 2026-10-30): a deck beside a red giant (`giant.js`). The
  lens: tap to join two heliums into a trembling beryllium-8, tap again quickly for the third (its real
  exponential lifetime slowed 10^16 times, the same draw for everyone in a room; the first try lasts at
  least 1.4 s). Hoyle's ladder: an energy slider (or the rail), the helium gun fires 16 and near 288 keV
  most are caught, each burst a point on a chart, so the peak comes from the visitor's own tries;
  Hoyle's notebook turns a page per tap (1953, Whaling's team, the 1983 Nobel). The giant: tap it old,
  tap it into a planetary nebula, carbon drifts into a cloud, a young sun and planets form, "the carbon in
  you" on the blue one.

- Carbon, `you` ("What are you made of?", 2026-10-30): inside a body (`body.js` in violet, no ions). The
  picture's glass child on a scale, seven jars sized by mass and filled by a weight slider; tap a jar and
  the child lights where that element is. A DNA zipper of eight base pairs that unzips and copies; tap a
  sugar carbon for its four tetrahedral bonds. Bread breaks into glucose and amino acids: glucose burns
  to CO2 into your breath, amino acids coil into a protein; a slider for how hard you move.

- Carbon, `clock` ("A clock inside every bone", 2026-10-30): an archaeologists' dig at sunset (`dig.js`;
  the oak from carbon's life wing). Tap the sky: a cosmic ray strikes there, a neutron turns nitrogen-14
  into carbon-14, its CO2 drifts down to the oak and a deer eats the leaves. A stepped trench of four
  layers, a find in each (linen, a bowl, a deer's bone, charcoal; invented, and the panel says so): tap
  one to the tent, tap the machine for the share left and the age, a board plots it on the decay curve;
  the tree slice explains calibration. The picture's hourglass of 128 carbon-14 atoms, each decaying at
  its own random moment into nitrogen-14 (a time slider, pauses at one and two half-lives, a lever for
  new atoms, the count at 5730 years compared with the last run).

- Carbon, `sky` ("The carbon in the sky", 2026-10-30): the Mauna Loa observatory above the clouds at night
  (`summit.js`). A window into the Carboniferous swamp: tap giants to fell them, the sea for plankton, a
  time slider buries them into coal, shale, oil and gas; lift a coal block and a flask of oil. The
  Keeling curve, 5.6 m, from NOAA's monthly means (March 1958 to September 2026, in the file): tap the
  analyser and it draws to today, the tree for one year up close, the ice core for 280 ppm. The blanket:
  a column of air where CO2 catches heat light and sends it any way, some back down, N2 and O2 let it
  pass; burn coal, then what helps (wind and sun stop the chimney, a tree takes one back).

- Oxygen, `magnet` ("Oxygen that sticks to a magnet", 2026-10-31): a cold lab (`coldlab.js`). The liquid
  air machine: tap it (or a temperature slider) and it cools, frost, dry-ice snow, pale blue drops near
  −191 °C; tap the column and the nitrogen boils off, the oxygen flask fills. Three tubes for the race
  (1877 a mist, 1883 Kraków's liquid, 1895 Linde). A big electromagnet with a field slider: liquid oxygen
  bridges the poles (and falls when the field drops), nitrogen falls through, water on a dish dips
  0.83 mm at 1.5 T. The Nijmegen magnet: tap it to 16 T and the frog floats. Outside, a rocket engine on
  its stand: a mix slider (too little oxygen sooty, near 2.5 bright with shock diamonds), Goddard's 1926
  rocket beside it.

- Oxygen, `fire` ("What does a fire need?", 2026-10-31), at `/e/O/fire-picture`: Lavoisier's laboratory
  in the 1770s (`laboratory.js`), laid out as the picture's triangle. The burning lens on the terrace:
  tap it and the sun heats red mercury calx in a jar of mercury (Priestley, 1 August 1774), the gas
  pushes the mercury down; tap the candle and it blazes in the gas. The twelve days (the Traité, 1789):
  tap the furnace (or a days slider), a red crust grows and the air in the bell jar shrinks from 50 to
  42.5 cubic inches; a candle goes out in what is left (azote); heat the crust and the air comes back, a
  second candle blazes. The great balance: the sealed flask of tin heated weighs the same; break its tip
  and air rushes in, heavier. Marie-Anne Lavoisier's drawing table: three plates of the apparatus.

- Oxygen, `breath` ("Why do you breathe?", 2026-10-31): the queued "Ride with a red blood cell" as a
  room, at the scale of cells (`body.js` in pink). Tap the airway: air fills the sac, O2 crosses into red
  cells that turn bright red. Tap a red cell: its haemoglobin's four seats fill, beside the saturation
  curve (a slider or a tap on the curve). Tap the big red cell to ride it through the left heart and an
  artery to a muscle (the world takes the camera in its `update`; walking gets you off). The muscle: tap
  it (or a slider) from rest to sprint, the board shows oxygen used, heartbeats, breaths. The
  mitochondrion: the chain step by step, oxygen catching the used electrons and becoming water; the
  sugar's quick way (2 ATP) and the way with oxygen (about 28 more), lactate when sprinting.

- Oxygen, `water` ("Water is mostly oxygen", 2026-10-31): a bathhouse by a frozen lake (`bathhouse.js`).
  Tap the bath: its water becomes a red oxygen globe and two white hydrogen globes on the balance, 133
  and 17 kg, a slider from a glass to an Olympic pool; Volta's pile and Hofmann's tubes give hydrogen
  twice as fast as oxygen. Giant molecules to walk among: the big one's charges and 104.5°, a rubbed
  balloon bending the stream (by induced charge, the words say), salt carried off in shells of six. An
  air slider or the thermometer takes the lake through a winter, 4 °C at the bottom and ice on top; the
  model freezes into ice's open hexagons, 9% more room.
- Oxygen, `ozone` ("Earth's invisible sunscreen", 2026-10-31): a research station on the Brunt Ice Shelf,
  where Halley found the ozone hole (`polar.js`). The ozone factory: a model sun over four filters
  (UV-C, UV-B, UV-A, visible), the layer as a slab of O2 and O3 (33 atoms, the count shared), UV beads
  over the snow; one photon per tap, UV-C makes two O3, UV-B is caught (warmth) or two O3 become O2,
  UV-A colours the beads; a wavelength slider dims a beam by ozone's real absorption at 300 DU. The
  Dobson hut: the spectrophotometer squeezes the violet column to its 3 mm at the ground (10 times
  bigger, beside a 1 euro coin), a month slider and a logbook of decades from Halley's monthly means
  (BAS), a balloon draws a modelled ozonesonde profile. The fix: a fridge and a spray can send a CFC-12
  up for years, winter's icy cloud frees the chlorine, the spring sun lets it break ozone after ozone;
  the Montreal treaty (1987) and a year slider to 2066 (a globe's hole, Halley's October ozone and
  NOAA's chlorine). Sources in the head of `ozone.js` and `ozone.words.js`.

- Oxygen, `first` ("The great oxygen surprise", 2026-10-31): a shore 2.5 billion years ago (`shore.js`),
  a cut in time in each headland. A giant microscope on blue-green cells: tap its mirror (or a sunlight
  slider), water drifts in and O2 bubbles out; tap the mud and the microbes that need no oxygen move
  deeper. The rusting sea in a glass case: tap the microbes for a sunny season (a red rust layer) or a
  quiet one (grey silica), a slider of millions of years buries the bands into rock and opens the right
  cut on Karijini's gorge. The left cut shows Hamelin Pool today: tap a stromatolite to split it, its cut
  face for a magnifier of sand held by microbe threads, a years slider regrows it beside a ruler.

- Oxygen, `aurora` ("Who paints the sky green?", 2026-10-31): a winter camp in Lapland under the northern
  lights (`arctic.js`). The Sun's gust: tap the Sun, particles are steered round the Earth and pour into
  rings round the poles, the sky over the camp dances; a Kp slider spreads the rings ("Portugal: seen!"
  at Kp 9, May 2024). Oxygen's two colours: tap the curtain at a height (or a slider), an electron lifts
  an oxygen atom, green 557.7 nm in under a second, then red 630.0 nm after a long wait unless a passing
  molecule bumps it first (so red only high up); below 100 km nitrogen's blue-violet. The camera: tap it
  for a long exposure (the camp rendered several times and added up), beside what the eye sees at
  night; tap the white fox for the tale behind "revontulet".

- Hydrogen, `bigbang` ("What were the very first atoms?", 2026-10-31): a walk through the young universe
  (`youngcosmos.js`), forward in time. The cosmic recipe on a tray (14 protons, 2 neutrons: deuterons,
  helium-4, a balance, 75/25 by mass and 12 of 13 by number; a clock: too hot before 3 minutes, a neutron
  decays past 13, too cold after 20). The cooling: a brass time rail to 380,000 years, helium first, below
  4000 K a tap catches an electron, the fog clears. The Holmdel horn: the hiss from everywhere, the pigeons
  shooed, the light stretched to 2.7 K.

- Hydrogen, `airship` ("How can a gas lift a ship?", 2026-10-31): the Tuileries, 1 December 1783
  (`garden.js`). Fill Charles's balloon from barrels, drop sandbags, let the ropes go; four 1 m³ balloons
  on spring scales (air, helium, hydrogen, hot air with a slider) and the lens: as many molecules inside as
  outside, hydrogen's lighter (the picture's lens was redrawn so); a Hindenburg model and the candle on a
  stick: hydrogen burns, helium pops.

- Hydrogen, `bond` ("Why can an insect walk on water?", 2026-10-31): a pond at a skater's size
  (`pond.js`). The skin: the skater's dimples, sand onto a floating clip until it sinks, soap. Every
  molecule pulled: a walk-round model, a temperature slider, the foot pressing. The tallest drink: a
  redwood's water thread, the sun lifting it, a height slider to the 122 to 130 m limit. What if: a lever
  switches the hydrogen bonds off, water would boil near -80 °C.

- Hydrogen, `fuel` ("What engine puffs out only water?", 2026-10-31): a hydrogen station by a railway
  (`depot.js`). A giant fuel cell cut open (the hydrogen bottle, the air intake, protons through the
  membrane, the bulb, water dripping; a road slider). The bus: fill to 350 bar, drive a trip, catch 9 L of
  water per kg. The Coradia iLint with a glass roof. Hydrogen in space: the Shuttle's engines, Apollo's
  fuel cell and its bubbly drinking water.

- Hydrogen, `cavendish` ("A fire that makes water?", 2026-10-31): a Georgian London laboratory at night
  (`townhouse.js`). Inflammable air (1766): zinc, iron or tin in either acid, the gas caught and weighed
  against air. His nine bottles of mixes, each burning as he wrote. The spark globe (1781): the mixture,
  the Leyden jar, spark, dew, a drop of water, the lens playing 2 H2 + O2 into 2 H2O.

- Hydrogen, `jupiter` ("What is inside Jupiter?", 2026-10-31): a gondola sinking where Galileo's probe fell
  (`gasgiant.js`). The descent (a red handle or depth slider to 22 bar and beyond, the helium counter,
  lightning). Squeezing hydrogen with Livermore's gas gun until it turns metallic and lights a bulb. A
  turning Jupiter: field lines, a compass, auroras, Io's torus and footprint, the Earth to scale.

- Hydrogen, `radio` ("How would you write to aliens?", 2026-10-31): the Dwingeloo dish on a heath
  (`heath.js`). Map the Milky Way: six stretches, the 21 cm profile, the clouds placed on a spiral map,
  Sydney's charts for the part that never rises. The spin flip: a random wait, a true-size 21 cm wave over
  a ruler. The Pioneer plaque at 3 m, and your height in hydrogen units, in binary.

- Iron, `meteorite` ("A dagger from outer space?", 2026-10-31): the Hoba West farm at golden hour
  (`dig.js`). Hoba: an X-ray meter reads its iron, nickel and cobalt into the picture's lens, a magnet
  clings, a scale weighs it against ten elephants. Tutankhamun's dagger (a copy) against a smelted knife.
  The etching bench: saw, polish and acid, and only the Gibeon meteorite shows the Widmanstätten pattern. A
  little planet melts into core and mantle, a cooling slider widens the crystal plates, a rock smashes it.

- Iron, `compass` ("Why does a compass point north?", 2026-10-31): a research ship over the Mid-Atlantic
  Ridge (`ship.js`). Gilbert's little Earth with a dip needle and the ship's compass. A dynamo globe of
  liquid iron: spin it and heat it, and only with both does the field grow; a lever flips it. Lava laid
  half a million years a tap records the field in stripes. The wandering north magnetic pole, 1590 to 2025.

- Iron, `smith` ("How did people get iron from rock?", 2026-10-31): an Iron Age village at dusk
  (`village.js`). The bloomery cut open: charcoal and ore, the bellows, a dial that never reaches 1538 °C,
  carbon monoxide taking the oxygen in the lens, the bloom pulled out. The anvil: ten blows, slag sprays.
  Steel: hours in the charcoal, the magnet letting go at 770 °C, the quench, the file skating or biting.

- Iron, `cereal` ("Can a magnet pull iron from cereal?", 2026-10-31): a breakfast table at a mouse's size
  (`table.js`). Crush the flakes and stir with a magnet hung from a spoon crane. The specks into stomach
  acid: hydrogen bubbles, green iron(II), a pH slider. Six foods on a plate and the gut's gate letting few
  in (orange juice helps, tea hinders), the day's board and the iron used again.

- Iron, `tower` ("How do you build a tower of iron?", 2026-10-31): the Eiffel Tower's second floor on a
  summer evening (`tower.js`). The rivet gang: heat, toss, catch, strike, and the cooling rivet squeezing
  the plates in the lens. A model bending away from the sun through a day, a temperature slider. The
  painters: graded paint looks even from the foot.

- Iron, `mars` ("Why is Mars red?", 2026-10-31): Meridiani Planum (`mars.js`). Opportunity's arm brushes
  and grinds a rock and reads its iron minerals. The blueberries: a handful under a lens, one cut open, a
  model of the rock's story. The sky clock from noon to the blue sunset and the Earth as an evening star.
  The magnets gathering magnetic dust over the sols.

- Iron, `rails` ("How do you weld a railway track?", 2026-10-31): a railway at night (`railway.js`). The
  thermite crucible cut open: rust and aluminium in scoops, the burn, the iron sinking under the slag. The
  weld: gap, mould, preheat, pour, shear, grind, then trains over the jointed and the welded rail. Who
  takes the oxygen: metals and oxides on a bench and a ladder of how tightly each holds oxygen.

- Krypton (2026-11-01, built with Sonnet 5.5 at high effort, the first model trial: `docs/studio/backlog.json`
  `cost.trial`), seven rooms, each from `docs/agents/designs/Kr_rooms.md`:
  - `hidden` ("What was hiding in the air?"): a teaching laboratory at University College London by
    gaslight, May 1898 (`gaslab.js`). Hampson's flask boils from 750 cm3 to the last 10 cm3 (nitrogen, then
    oxygen and argon leave); a jar of a million molecules fades to the one krypton; the clean-up train
    (hot copper takes the oxygen, hot magnesium the nitrogen, about 26 cm3 left); pump a tube, seal it,
    light it white-lilac, Travers' notebook with a yellow and a green line. The flask's slider is
    "boiled away", not temperature (the residue only warms to about -183 C: the design's -150 C was wrong).
  - `metre` ("How long is a metre, really?"): a length laboratory of 1960 (`metrology.js`). The 1889 bar
    (temperature slider, 8.6 micrometres a kelvin, drawn 150 times too big, the microscope true), the
    krypton-86 lamp at 63 K and the interferometer counting 1 650 763.73 waves, the 1983 metre as light's
    3.34 ns (a log time slider, the equator in 134 ms).
  - `windows` ("Why is there gas in your window?"): a window factory on a snowy evening (`glazing.js`).
    The glass line (coat, press, fill with air, argon or krypton, seal); the giant gap (atoms at true
    relative speeds, a gap-width slider, the best width marked, the gas starting to roll when too wide);
    the test house with three windows and a heat camera.
  - `thruster` ("What pushes a satellite along?"): a glass-floored platform 550 km up over the real Earth
    (`orbit.js`). A cut-open Hall thruster (valve, magnets, voltage slider, cathode off and the satellite
    charges), the satellite under 70 mN, space junk and the burn-up, a climb slider, a board comparing
    xenon, krypton and argon. Krypton's 70 mN and 16 km/s are worked back from SpaceX's argon thruster
    (170 mN, 2 500 s: 2.4 times the thrust and 1.5 times the specific impulse of the krypton one).
  - `water` ("Water a million years old?"): an oasis in the Western Desert at dusk (`desert.js`). A long
    cut-away window through a million years of rain, sandstone and creeping water with krypton-81
    fading by half every 229 000 years; the well (1 500 litres, degassing, the gas sorted); the atom trap
    catching krypton-81 one atom at a time and reading an age.
  - `hands` ("Can a noble gas hold hands?"): a chemistry laboratory of 1963 (`lab.js`, no new stage). The
    cold bulb (krypton and fluorine frozen and lit into KrF2 crystals, only when cold; gold leaf eaten),
    six noble gases offered fluorine (He and Ne refuse, Ar only as HArF, Kr, Xe and Rn dock), and a laser
    room printing a chip with a KrF laser (pulses a second, a wafer of nine dies).
  - `kryptonite` ("Is kryptonite real?"): a Victorian museum mineral gallery at night (`gallery.js`). The
    film's label and jadarite's side by side (tap the elements; F lights only the comic one), real krypton
    frozen in liquid nitrogen with a lens on gas, liquid and solid, a diving bell where krypton makes the
    sum "2 + 2" drift (a pressure slider, "feels like" depth). The film's formula and jadarite, LiNaSiB3O7(OH),
    from Jadar in Serbia (2007); no figure or emblem on the cape.

- Radon (2026-11-09, built with Opus 5.5 at xhigh effort, the model trial's second half: `docs/studio/backlog.json`
  `cost.trial`), seven rooms from `docs/agents/designs/Rn_rooms.md`, every radon atom a teal mote with a halo:
  - `glow` ("Can a frozen gas glow by itself?"): inside Gray and Ramsay's capillary, 1909 (`capillary.js`). The
    cold bath (the thermometer, the liquid-air tap or a slider: clear liquid at −62 °C, a solid at −71 °C shining
    steel-blue, yellow, then orange-red in liquid air, the red out at −118 °C); three glasses glowing blue,
    bluish green and lilac, the mercury pushed to 20 and 45 atm; the 1910 quartz microbalance (levelled by the
    air in its case, as theirs was) weighing five samples: 216 to 227, today 222.
  - `cellar` ("Why do people air their cellars?"): the granite house cut open (`stonehouse.js`). The house
    breathes (window, extractor, trapdoor, stove, thermometer: an illustrative stack-effect model); the
    detector kit (a CR-39 chip, months of tracks, etched in hot sodium hydroxide, pits counted onto a scale with
    Portugal's 300 and the WHO's 100); the fix (sealing the cracks helps only a little; the sump fan sends radon
    up a pipe above the roof).
  - `rock` ("How does granite breathe out radon?"): a hillside of the Serra da Estrela at dusk (`tors.js`). The
    lens (a radium atom breaks, the radon recoils about 40 nm: stuck in its grain, buried across a dry pore, or
    free in the pore water; 20 tries on a board); the soil column (radon wanders and breaks apart, rain stops it);
    the uranium family's staircase in the sky (tap an atom; the Atom Forge for the decays one by one).
  - `draught` ("Why did a door spoil the experiment?"): Rutherford's laboratory at McGill, winter 1899
    (`mcgill.js`). Owens's plates and the draught from the door, the glass case; Rutherford's tube of 1900 with
    the cotton wool, the stopwatch and the chalkboard's half-life (his Table III at Scientist level); the 1903
    liquid-air trap with radium's and thorium's emanation, the zinc sulphide screen and willemite, a days slider.
  - `moon` ("Does the Moon breathe out a gas?"): on the Moon above Aristarchus (`lunar.js`). The crack (radon hops
    in ballistic arcs and breaks into amber dots that stay; an air slider and they drift off instead); Apollo
    15's service module at a third of its size over its map board (radon over Aristarchus, polonium-210 at the
    seas' edges; a time slider from 2 hours to 100 years); Lunar Prospector at real size beside a Moon globe,
    noisy maps averaging until Aristarchus and Kepler stand out.
  - `quake` ("Can a gas warn of earthquakes?"): a village in Japan at dusk beside a fault (`dig.js`). The fault
    model (push until it slips, the room shakes, the leak falls back); the Nishinomiya well's record before Kobe
    (Igarashi et al. 1995) and three folders of example records (rain, a quake with no change, air pressure),
    so one record is not enough; a soil-gas probe along seven spots finding the hidden fault. Told as research,
    never a method.
  - `cave` ("Do caves breathe in and out?"): a limestone show cave on a winter night (`showcave.js`). The cave's
    breath (outside temperature: about 200 Bq/m³ in winter, about 3000 in summer, as at Postojna; below −6 °C
    snow closes the top); the doors (shut the bottom door in summer; Waring et al. 2021, a proposal); the
    guide's year of dose against the 20 mSv limit, the visitor's sliver.

- Silver (2026-11-09, built with Sonnet 5.5 at high effort, the setting krypton's were built with, since neither hall
  of the trial had stars yet), seven rooms from `docs/agents/designs/Ag_rooms.md`; facts with doubts sit in each
  words file's head:
  - `medal` ("What is inside a gold medal?"): the Panathenaic Stadium at dusk (`stadium.js`). A medal 1.8 m across
    (peel the gold skin back, a lens of gold over silver with a copper atom in eight; the balance, 529 g against
    about 950 g of solid gold; the iron hexagon lifts out and points to iron's hall); the medal-maker's bench
    (hang a silver blank in the gold bath, a current slider, grams and micrometres by Faraday's law, swap the clips
    and silver leaves instead); the podium through the Games, 1896 to 2024, each medal cut through.
  - `mirror` ("How do you silver a mirror?"): inside the 100-inch telescope's dome, the 1920s (`dome.js`). The disc
    on a cradle (acid washes the old coat, reducer and silver jars in either order grow the film to 95%, the dish
    gathers one coat into a cube of 1.1 cm); five mirror metals under a reflectometer, a colour slider, foul air
    tarnishes silver; Hubble's plate H335H (the dome swings to Andromeda, three spots marked N, one VAR!, its
    31.4-day pulse, 930,000 light-years on 1925's scale, about 2.5 million today).
  - `germs` ("How does silver fight germs?"): the space station's Russian segment (`spacestation.js`). Water from
    breath (condense, filter, a silver dose of 0.05 to 0.2 mg/L, 85 °C, a ball of water floats out only when it is
    safe); a Petri dish 1.9 m across with clear rings round the silver and copper coins and none round a button;
    one germ 1.5 million times bigger, silver ions jamming its machines (four of seven: it cannot divide, a model);
    Credé's bottle of 1880.
  - `wire` ("Can silver grow like hair?"): Kongsberg's King's Mine (`mine.js`). The ox's find of 1623 and a year
    slider growing the town to 1958; fire-setting over a model weekend, 10 to 15 cm a fire; a lump of silver
    sulfide heated past 177 °C grows silver hair, melts at about 830 °C, and three ideas for how the mine's grew.
  - `snow` ("Can you make it snow?"): Mount Greylock, November 1946 (`greylock.js`). Schaefer's cold box (breathe a
    cloud in, six jars: dry ice freezes it at any temperature, silver iodide at −4 °C or colder, at −38 °C it
    freezes by itself); ice's hexagons slide onto silver iodide's and not onto salt's squares; the plane seeds
    the cloud deck, the burner sends silver iodide smoke, "a little" more snow.
  - `photo` ("How does light make a picture?"): a daylight studio and its red-lit darkroom (`darkroom.js`).
    Daguerre's plate (iodine, an exposure slider with a puppet bear that blurs, mercury, hypo, tilt it from
    positive to negative); a silver bromide crystal as big as a table, each tap a photon, four silver atoms make
    the speck the developer needs; the bench (the enlarger's seconds, four trays, white light fogs what is not
    fixed).
  - `dollar` ("Why is a dollar called a dollar?"): a Spanish galleon at anchor on a moonlit night (`galleon.js`).
    The piece of eight cut into bits (27.47 g, "two bits"), a cob and a milled coin clipped; the silver roads on a
    map with a year slider (Joachimsthal's tolar to dollar, Potosí, Mexico, Manila); the purser's test of six
    coins by density (tin, copper, silver 10.38, lead).

## Adding a room

1. Read the picture's story (`src/content/boards/<Symbol>.js`) and look at its picture
   (`py -3.11 tools/boards/lib/render.py <Symbol>`). The room is the picture made into a place: the same
   things, the same colours, and one to three things to do that the story is about, without repeating
   the element's other rooms (its Periodic Videos lab, its wings).
2. Write `scenes/<Symbol>/<id>.words.js` (English first, then pt-PT, Polish, German; `translating.md`)
   and `scenes/<Symbol>/<id>.js` on a stage (`diatoms.js` is the model). Every exhibit that changes goes
   in `shared` (`adding-a-wing.md`, "Shared with the room"); a verb that changes with the state is a
   getter.
3. `npm test`; look at it (`tools/shot.py /e/<Symbol>/<id>`, both views, every exhibit used, `--phone`,
   `--level scientist`); step in from the hall and walk back out; `py -3.11 tools/shared_probe.py --world
   /e/<Symbol>/<id>`.
4. Add it under "Built" here and in the studio's item.

## Traps met

- The third-person camera sits about 4 m behind the player: a frame placed 2 m behind the spawn had the
  camera behind it, looking at the world through its swirl. Stand the frame at the room's edge and give
  the camera a `maxZ` in front of it.
- A pale floor under the bloom washes the whole scene out (the silt was #b9c2a8 and read as snow): keep
  big surfaces mid-toned (#93a08a).
- `tools/shot.py` splits its steps at every `;`: a `js:` step can hold no semicolon (no `for` loops); use
  `[1, 2, 3].forEach(...)` or an arrow function with commas.
- Chloroplasts set out in neat rings read as a printed pattern, not a living cell: scatter them (a golden
  angle spiral).
- Facts with dates: Vanguard 1's battery radio stopped "after about 20 days" in one source and "June
  1958" in others; where sources disagree, say only what they share ("in 1958").
- A home-made ring mesh (a hilltop's rim, a road) must be wound counter-clockwise seen from above, or it
  is culled and the sky shows through.
- Through `heavy.py`, a `bash -c` command starts WSL's bash and fails: pass the probe's own command.
- In a probe, `player.use()` does not move the view to a new station while the last one is still
  active, even after a teleport: call the tap helper in `parts` instead.
- A tap aimed at something behind another thing hits the nearer one (the bins behind the pot): raise
  their signs or move them apart. Thin things (a ladle, a fibre) need an invisible hit shape
  (`MeshBasicMaterial({ visible: false })`), which the ray still hits.
- A sprite inside a clickable threw (the raycaster had no camera): `common/taps.js` sets it.
- A flat summit hides the valley below unless you stand near its edge: put the arrival near the edge or
  keep the drop small. A 10 m Earth seen from 9 m filled the screen: a station's `focus` only backs the
  eye off, so leave room for it.
- A tap on something beyond its `reach` falls through to the clickable behind it (a tap on the laser
  from the spawn sent a shooting star): give far things a reach that covers where people stand. A
  tappable sky is an invisible BackSide sphere with a large reach and `accept: h => h.point.y > 30`.
- Long 3D labels beside a station overflow an upright phone: keep them to short lines.
- The prompt reads "verb: label", so a hint must hold no colon of its own.
- A station's first-discovery panel (`ex.discover` with a delay) opened over another station's panel
  the visitor had opened meanwhile: `discover` now opens it only when no panel is open.
- Station views are close: keep floating things out of the strip between the visitor and the screens.
- A `THREE.Points` cloud inside a clickable catches taps within 1 m (three's default threshold): the
  lens's electrons stole the wire's taps. `points.raycast = () => {}` on clouds that are not for tapping.
- A point light a few centimetres above a pale thing blooms the whole station view white: keep lights a
  metre away and dim.
- From Git Bash, `shared_probe.py --world /e/...` needs `MSYS_NO_PATHCONV=1`, as `shot.py` does.
- three.js hides an object only when `visible === false`: `visible = a && b` can give `null` and show it.
  Use `!!(a && b)`.
- Gates in a line one behind another: a tap on the far one is caught by the nearer one's hit box; lay
  them across the view. A row of ponds receding from the visitor hides the far ones (the station view
  rises 1.45 m at most): lay them side by side. A pond inside a walkable platform must stand on it.
- Saving a file while `shared_probe.py` runs reloads the world under it ("reading 'shared'").
- Plain RGB lighting cannot show one-colour light (a red car stays red under yellow light): light by
  reflectance at the lamp's wavelengths, in the shader. A night's own fill light brings the colours
  back unless it is grey (rods see no colour anyway).
- Near a wall the third-person camera closes in on the Atomling: keep station spots off the walls.
- The station view backed off for height only: a wide station spilled over an upright phone's sides
  (twins, leaf and football each worked round it). The engine now fits `size` across the screen too, or
  the focus's `width` when the station is wider than tall (`walking.md`). Keep the easel and ceiling
  lamps off the line of that backed-off eye.
- Round guard cells touching still leave a gap at the floor: lips close over the hole. Two mirrored
  copies of a home-made tube need the same winding, or one renders inside out. Bright streaks far off
  in haze read as lines across the screen.
- A chamber built as one solid box hides what its porthole should show: build it hollow. A panel opened
  by `ex.discover` turns the view to the nearest station, so a probe tapping from across the room sees
  odd views.
- A shader's `pow(1 - abs(dot), k)` can go slightly negative and give NaN, and the bloom spreads it
  into a black square over the screen: clamp before `pow()`. Shared ages timed by adding frame times
  drift (the engine caps a frame at 1/20 s): use wall-clock time. A shared `set` keeps the age it is
  given, even when not live, or the latecomer check fails.
- An `InstancedMesh` keeps the bounding sphere of its first raycast: moving instances need
  `mesh.boundingSphere = null`, or a plain sphere test (`sphereCast` in `C/you.js`). A see-through
  figure of overlapping shapes shows its own insides: draw a depth-only pass first (`colorWrite: false`).
  A tap at a ring's centre goes through the hole: give rings a solid invisible hit shape.
- Ground decals must not cover pits; third person cannot see into a pit, so lift dug things well above
  the ground. A running shared clock shares its start and age, not its moving value.
- A big frame turning gold when found blooms over the whole view: about 0.45 emissive for gold.
  Paintings on a box's own faces z-fight: inset them about 5 cm. Things lying flat in water at eye level
  vanish: let them lean. An opaque cut in front of a diorama takes taps only in its regions (`accept`),
  so taps reach the trees behind.
- A normal map from random block heights bands the walls in rows: paint them flat. A value snapped to 0
  below a threshold every frame never grows: snap only while it shrinks. A `js:` step whose result is
  a function gets called by Playwright: wrap assignments in `void (...)`. Animating a shared material
  lights every surface that uses it: clone it.
- A picture whose id is also one of the element's wings (oxygen's `fire`): both had `/e/O/fire`, the
  wing won. Hence `pictureRoomId` (above). The hall asked the engine to build ahead an arch within 7.5 m
  and the nearest picture's room in the same frame; the engine keeps one, so beside oxygen's arches both
  were rebuilt every frame (1 fps, stepping in took up to a minute). It now asks for the nearest only.
- On an upright phone the station view backs off until `width` fits: at 6 m wide the eye went about 10 m
  back, into another station. Keep a station's width to about 5 m, nothing in the way behind its stand.
- Snow: fresh snow drawn white blooms the whole view white; keep the snow and the sky mid-toned and let
  the light make them bright (`polar.js`). Dark letters on brass do not read from a few metres: a dark
  plaque with gold letters does. Small glowing molecules need a halo near 0.9 opacity and half their
  size again to read against a bright sky.
- An `InstancedMesh` made with count 0 keeps empty bounds and is culled: `frustumCulled = false`. The
  stage's sea-level water sheet shows inside a diorama too: keep diorama floors above it; a closed veil
  over a hollow box needs `depthWrite` and two-sided walls. `formulaText('Fe2+')` reads the 2 as a
  subscript: ion charges need their own raised text.
- Rendering a photo several times: hide objects, never lights (a changed light count recompiles every
  material). Fade a troika text's `outlineOpacity` with its `fillOpacity`, or it reads as black. A
  shader's `#include` must sit on its own line. A home-made band laid on a sphere may face inward: make
  it double-sided.
- The station view's eye stays at most 1.45 m up: a model topped near that is seen edge-on (tilt its top
  toward the visitor or raise the visitor on a platform with low steps); closing the panel ends the
  station view, so probe shots of it keep the panel open. A thing standing between the spot and the focus
  fills the view: raise `size`. A label above a station sits under the speech bubble: put it on or beside
  the thing.
- `Number(age) || 30` turns an age of 0 into 30: a shared age of 0 must stay 0. `flat` is a GLSL keyword.
  A glow alone inside a cloud deck is invisible: briefly raise the fill light too. Rounding gives "-0":
  add `+ 0`.
- A big invisible hit shape round a thing catches taps meant for smaller things inside it (the forge and
  its rivet; a block's edge and the magnet on it): hit shapes must not enclose smaller tappable things.
  A cooling value is shared as its value at the last change plus its age (wall clock), and a running
  simulation as a snapshot the receiver runs forward. A sky shader's twilight factor inverted paints the
  whole night blue; a bright sun disc's bloom washes its blue glow white.
- The easel's legs first went straight through the picture (the user liked the picture on sticks, not
  the sticks through it): `storyStand` leans the front legs back behind the picture, which rests on a
  ledge in front of them, and props them with a third leg.
- Krypton's builders (2026-11-01), the traps met:
  - A hint text holds no colon: the prompt already adds "verb: label".
  - A simulation both machines run fires `ex.discover` on the watcher too: guard the say and discover with
    an ownership flag, or the shared probe fails with "no panel opened for Bob". Ages that keep growing
    break the probe's frozen expectation: clamp them in `get()` and share `set(s, live, ago)`.
  - A floor you stand on hides what is below it: make it glass (`orbit.js`).
  - A station's eye backs off from the player's position, not the focus: put the spots 3 to 4 m from the
    exhibit, and keep a station's parts within about 4.5 m, centred left of where the panel falls. A
    station inside a small alcove puts the camera inside the wall: widen the doorway to 3.1 m.
  - A Dewar needs a window cut in its front, or you cannot see the flask dip. Glass alone reads as nothing
    in the case's light: give it dark solid anchors.
  - A three.js `Points` with a one-component position attribute draws that many points: put the dot number
    in `position.x`; a million additive points need an alpha of about 0.0035.
  - `Object.assign(mesh, { position })` throws (read-only). `npm install` run by several builders at once
    can leave a truncated `esbuild.exe` or an empty `node_modules/three`: remove `node_modules` and again.
  - Open: in the phone station view of `hidden`'s clean-up a thin dark bar stands in front of the bench
    (not on a computer); not traced. The million-dot clouds are untested on the S21.
- Radon's builders (2026-11-09):
  - With a focus below the eye, the station view keeps the Atomling's own eye height (about 0.95 m), so the lip of
    a cut hides what is below it: compress the section, put the stations at the edge, a low kerb with an invisible
    wall instead of a rail (`cellar`).
  - On a computer the station view fits only `size`; `width` counts on an upright phone (`rock`). On a phone the
    eye backs off by width over aspect, but `cameraBounds` stops it: keep a station's line short (`quake`).
  - Motes (points) near the camera become big halos in a station view or a small room: fade them within about
    2 m of the camera. Fading points with normal blending turn black; additive blending fades them to nothing.
  - A see-through liquid that writes depth hides the glows inside it: `depthWrite: false`, the glow a higher
    `renderOrder`; glass at 0.42 opacity hides what moves inside a tube, about 0.12 shows it (`draught`).
  - A lit navy board (`standingScreen`) washes to grey in a hard low sun: an unlit canvas face reads (`moon`).
    Metal at metalness 0.85 in a low sun blooms white (about 0.35); thin metal posts reflecting the
    environment bloom into white blobs (dark posts, a dimmer map).
  - A canvas radial-gradient fill left set by a helper makes the next `fillText` invisible: set the fill again.
  - A console tilted away from the visitor shows its labels mirrored: tilt it toward them.
  - Lines an Atomling speaks after another player's change speak on every screen: guard them with a "mine"
    flag (`cave`, `cellar`). Speech lines within a second overwrite each other: hold each about 3 s (`glow`).
  - A duplicate key in a words object wins silently (the shape test does not catch it): "undefined" on screen.
  - `collide.js` `box` takes the same rotation sign as the mesh's `rotation.y`. Shaking a room moves
    `root.position`; reset it in `detach`.
  - The easel at krypton's spot (−2.9, 1.7) stood on the line a phone's station view backs along; move it when
    a station sits on the left.
  - Several builders at once: wrapping `heavy.py` in a shell `timeout` killed probes waiting in the machine's
    queue (run them in the background); saving a file during a probe reloads the page under it.
