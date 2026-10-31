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
  (`player.dive`, as the doorway boards do) and goes to `/e/<Symbol>/<board id>`. Coming back you stand
  in front of the picture, facing the hall. Only the nearest picture's room is built ahead
  (`engine.prewarm`; another place asked for lets the previous one go, so the side-by-side boards each
  get theirs when approached).
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
  feel"): `clickable(object, onTap, { when, reach, accept })` makes a mesh or group a thing to click or
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
  `pipeRun(points, { r, mat, bend })`, `mist({ x, y, z, rate, spread, floor })`, `puffs(max)`). A
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
- A sprite inside a clickable threw (the raycaster had no camera): `room.js` now sets it.
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
- The easel's legs first went straight through the picture (the user liked the picture on sticks, not
  the sticks through it): `storyStand` leans the front legs back behind the picture, which rests on a
  ledge in front of them, and props them with a third leg.
