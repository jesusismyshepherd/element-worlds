# Adding a wing (a world for one element)

A wing is a world designed for one element, reached through an arch in its atrium. It is one module,
`src/worlds/wings/<element>/<id>.js` (helpers beside it in the same folder), and one entry in `WINGS`
in `src/worlds/registry.js` (`id`, `side` of the atrium: `'n'`, `'e'` or `'w'`, `color`, `load`). The
atrium draws its arch by itself, titled from `wings.<Symbol>.<id>.title` in both locale files.

## The world contract

`export async function build(ctx, target)` returns:

| field | what |
|---|---|
| `mode: 'walk'` | the engine's player walks it (`engine/player.js`) |
| `root` | a `THREE.Group` with everything, lights included |
| `title` | the wing's name for the breadcrumb |
| `env` | `{ background, fog, exposure, envIntensity, bloom: { strength, radius, threshold } or false, fov }` |
| `spawn` | `{ x, z, yaw }`; yaw 0 looks along -z, `Math.PI` along +z |
| `hostSpot` | where the Atomling waits while you walk in first person |
| `avatar` | `createAtomling(el, { light: ctx.light })`, added to `root` |
| `solids` | `engine/collide.js`: `box(x, z, w, d, { rot, y0, y1 })`, `circle(x, z, r, { y0, y1 })`, `roomWalls(...)`; a solid whose top is within 0.35 m of the feet is a step to stand on |
| `floor(x, z)` | optional ground height (default 0) |
| `cameraBounds` | `{ minX, maxX, minY, maxY, minZ, maxZ }`: the third-person camera stays inside |
| `interactables` | `[{ id, x, z, radius, label, verb, onUse }]`: the nearest within reach gets the prompt (E or the button) |
| `doors` | `[{ x, z, radius, to }]`: walking into one goes to the address `to` (`atriumPath(symbol)` for the way back) |
| `shared` | `{ <id>: { get(), set(state, live, ago) } }`: the world's things, kept and shared (below) |
| `attach(engine)`, `detach(engine)`, `update(dt, t)`, `dispose()` | optional |

`ctx`: `{ engine, renderer, scene, camera, canvas, input, store, light, t, lang(), level(), go(path), share(id) }`.

## Shared with the room (every wing, since 2026-10-30)

Every world's things have two saved states, the player's own (alone) and each room's (in a room, where
everyone in the same world sees the same and each change as it happens): `src/net/shared.js`, the protocol
in `multiplayer.md`, "Shared world objects". Each exhibit's piece gives `state()` (small plain JSON:
`{ free, age }`, `{ lit: ['He', 'Ne'] }`, `{ gas: 'Ar' }`) and `setState(s, live)`; the world lists them in
`shared` and calls `ctx.share(id)` right after its own visitor changed one (after `act` succeeded, not when
it was busy). `live`: someone has just done it, play it here as if done here (the animation and its
sound); not live: show it as it stands at once (a newcomer, a saved state coming back). `ago` (seconds):
how long before the state was taken; what unfolds over time runs on by it (`{ ...s, age: s.age + ago }`
in the world's `set`; the balloons' flight, the candle's air, a run under way). Something that only happens
(a Geiger counter's clicks, an electron fired) is a count in the state, played when it goes up.
A world builds itself as new and never reads or writes a saved state of its own: the keeper puts back the
player's own or the room's, and the world as built is where a room's starts (the neon wall's word moved
there from its own key). Exhibits say whether this visitor has found them (`found`, a getter: the kits do
it), so someone beside an exhibit another player used is told it is not their discovery yet.
Stays each one's own: panels, the Atomling's words (`say`), discoveries, windows, videos, the camera.
A piece's callback that speaks after an animation must know whose it was (`onLit(gas, mine)`). Check what
comes in (a known gas, a cleaned word): it comes from another device. A room's word or pick is the room's,
never saved as this visitor's own. Example: `noble/signs.js` (`shared`) and its pieces.
Check: `py -3.11 tools/shared_probe.py --world <path>` (every exhibit used by one player, the others' states
compared, a latecomer); a button in a panel goes in `tools/shared_steps/<area>.json`.
Traps met (2026-10-30): an exhibit's label or verb that changes with its state must be a getter (the
prompt then follows a change someone else made); one set by hand in `onUse` stays stale on the others'
screens, and spreading `extra` into an exhibit turns getters into fixed values (carbon's `wordsFrom`).
A piece may already use the names `live` or `state` (ozone's rays in flight are `live`, methane's stage is
`state`): name the parameter or the methods otherwise. A slider sends at most a few times a second, its
last value always (carbon's moiré). Anything drawn from a random generator per use differs between
players: seed it from a number in the shared state (silicon's wafers). A `setState` that skips a field when
not live shows only with a latecomer: the probe's latecomer check catches it (sodium's bowl). A panel that
opens after `panelDelay` only while the player stands near cannot be opened by a probe's `onUse`: give the
world `panels` (its panel makers) and open it with `__ew.showPanel(__ew.world.panels.<id>)` (pv).

## Words

- Every text in European Portuguese, English, Polish and German (`translating.md`), and at two depths: `kid` (Explorer: plain words, a
  ten-year-old) and `sci` (Scientist: numbers with units, equations, names and dates). Keep a wing's
  words in its module: `const WORDS = { en: { ... }, 'pt-pt': { ... } }`, chosen with `ctx.lang()`;
  read `ctx.level()` when a panel opens, so a change of level shows at once.
- Panels: `ctx.showPanel(level => ({ title, kicker, color, blocks }))` (written again when the level
  changes while it is open; never `store.set({ panel })` with a level baked in), blocks `{ p }`, `{ big, small }`,
  `{ slider: { label, min, max, step, value, onInput, format, live } }` (an exhibit the visitor works by
  hand; `live()` lets the slider follow the exhibit when it moves by itself), `{ buttons: [{ label, onClick }] }`,
  `{ rows: [[label, value]] }`, `{ list: [...] }`. The Atomling talks: `ctx.store.set({ speech: { text, who, color } })`.
  The HUD places both at the edges (`hud-layout.md`). A wing's own DOM window goes at an edge too (under
  the top bar: `top: calc(var(--bar) + 4px)`, the left side in landscape, across the top upright),
  reports what it covers (`setCover(coverId(), { side, size })` from `engine/covers.js`) and sets
  `store.overlay` while open, so the prompt waits (`noble/nameOverlay.js`, `noble/signs.js`).
- No em dashes. Portuguese element names take articles ("o carbono", but "a prata", "a platina").
- A Bible passage about the wing's subject, on a stone or a plaque (the user, 2026-10-31): every world has
  one; how to choose it, fetch it and place it: `scripture.md`.
- Facts must be right; numbers from `src/data/elements.json` where it has them.

## Discoveries

Each exhibit used once is a discovery (`markFound('C:allotropes:diamond')`, `engine/progress.js`); keep
the wing's count in the HUD: `ctx.store.set({ discoveries: { found, total } })` on attach and on each find.

## Pieces to reuse

- `worlds/common/props.js`: `wallPanel` (a station screen), `arch` (doors: `portal: 'swirl'`, `'stars'`),
  `portalMaterial`, `canvasTexture`. `worlds/common/sky.js`: `nightSky`.
- `worlds/atrium/atom.js`: `bigAtom(el, { size, accent })`.
- `chem/molecules.js` (O2, N2, CO2, CO, H2O, CH4, O3, NH3, C6H6, Ar) and `chem/ballAndStick.js`, which
  draws any graph `{ atoms: [{ el, p: [x, y, z] (ångström), charge }], bonds: [[i, j, order]] }`;
  `checkHands(graph)` says whether every atom holds exactly its hands.
- `characters/atomling.js`: `createAtomling(el)`.
- `engine/text.js`: `makeText(text, { size, color, font, maxWidth, anchorX, anchorY })` and
  `formulaText('CO2')` for formulas. The fonts are Latin only: no emoji, no subscript or superscript
  digits in plain text (formulaText builds them from pieces); the minus sign − and · exist.

## Look and feel

- Kin to the plaza and the atrium: glowing edges, dark navy screens, soft bloom; but each wing is its
  own place with its own light (a sky deck is daylight, a fire chamber dark and warm).
- Exhibits are things to do, not only to read: a press to work, a fire to put out, a sheet to slide.
- The visitor chooses each step (the user, 2026-10-30, a rule for every station): a step is done by
  clicking or tapping the thing it is about (the sand pile, the soda, the pot, the switch), and anything
  that varies smoothly (the sun's height, a temperature, a depth) is a slider. Pressing E again and again
  to walk through fixed steps felt passive. The prompt tells the next step ("Tap the sand pile"); E still
  opens the station's panel, whose buttons do the same steps (keyboards, probes). Any world:
  `const taps = tapTargets(ctx)` (`src/worlds/common/taps.js`), `taps.clickable(object, onTap, { when,
  reach, accept })` for each thing, and the world returns `pointAt: taps.pointAt, onTap: taps.onTap`
  (picture rooms get `clickable` from `room.js`; `picture-rooms.md`, `walking.md` "Things to click").
- `ctx.light` (phones, weak computers): fewer particles, no glass; keep frames short.
- The arch back to the atrium stands behind the spawn; the spawn faces into the wing. An arch in a square
  doorway: fill the wall round its round top (`archSurround` in `common/props.js`; the user, 2026-10-31:
  the doorway's corners showed dark above the portal).

## Checking it

- `npm run dev` (port 5310), then
  `MSYS_NO_PATHCONV=1 python tools/shot.py /e/C/allotropes --steps "js:__ew.teleport(0, 4, 0, 0.1); wait:1; shot:name"`.
  `__ew.teleport(x, z, yaw, pitch)` puts the walker anywhere; `__ew.setMode('first')` switches view;
  `__ew.world.interactables` lists the exhibits; `__ew.player.near?.onUse()` uses the one in reach.
  Look at every exhibit from where a player stands, in both views; console errors fail the run.
- A camera rule of the wing's own (keep it inside a dome, on the player's side of bars): give the world
  `cameraClear(from, to)` (the share of the way allowed) and let the player ease to it; never move the
  camera in the world's update after the player placed it (it jumps: `walking.md`). Walk through it
  with `tools/nav_probe.py`'s tube check as the model.
- `npm test` and `npx vite build` pass. A wing with a window of its own: add a scene to
  `tools/hud_probe.py` (the neon name window is one) and run it.

## Traps

- Text: the 3D fonts have no Greek letters, no arrows, no subscripts and no superscripts except ² and ³
  (troika then fetches fallback fonts from a CDN): `formulaText` for formulas, words for Greek letters.
- A door less than about 2.6 m behind the spawn: switching to first person steps the visitor back 1.6 m
  (the engine now steps in front instead when a door is there, but keep doors clear of the spawn).
- An arch at a platform's edge puts the third-person camera behind its portal, which floods the view with
  its colour: keep `cameraBounds` on the inner side of the arch.
- Something overhead to see (oxygen's ozone layer): `cameraPitchMax` on the world lets the third-person
  camera tilt up (default 0.2 rad). When the floor holds the camera up, it looks up the way the player
  tilted (the Atomling slides down the screen) instead of at its head from the floor (`player.js`).
- The third-person camera comes in front of any solid between it and the Atomling (`segmentFree` in
  `collide.js`), so walls and pillars that are `solids` need nothing more. Things that are not solids
  (a lattice, a tree crown, a glass dome) still need the world's own care: carbon's wings fade what
  stands in the way (`keepCameraClear`, `keepCameraIn`).
- Shadows: `env.shadows: true` (computers only); a world may also switch `renderer.shadowMap` in attach
  and restore it in detach, as oxygen's wings do.
- troika's `sync(cb)` never calls back for a text that has already synced; three's `Curve` has no
  `isCurve` flag.
- A patch that renames a file over the original can leave Vite's error overlay up until the file is
  touched again; other sessions creating files make Vite reload the page under a running probe (retry).
- `env.environment` (a texture, or null for none) and `env.far` exist too.
- Shader programs: every material kind (and each transparent, double-sided, instanced or customised
  variant) is another program to compile on a first visit, about 30 to 100 ms each on Windows. Reuse
  materials; count them with `renderer.info.programs.length` (carbon's gallery: 53). The engine warms
  them for the composer's linear buffer (`engine.compileFor`); compiling for the screen instead made
  every program twice.
- The RoomEnvironment light washes out dark places: set `env.envIntensity` low there.
- Show a phenomenon, do not paint its explanation on it (the user, 2026-10-28, on the twisted
  graphene's bright "AA spots": insider knowledge). The moiré is now two transparencies on a light
  table turning by themselves (`graphene.parts.js` `moireDisc`), the pattern coming from the overlap;
  the panel says why it matters. Two inks overlapping must both take most of the light away, or where
  they fall apart the other's colour gets through and the pattern nearly cancels (complementary inks
  gave 12 % contrast); far away, where a pixel spans several bonds, blend in the lattices' registry or
  the pattern washes out with distance.
- The twisted sheets (2026-10-28, the user after bilayer.graphene.science): hexagonal flakes, so the top
  one's corners show the twist; turned by hand in the panel (a slider, the magic angle, the ring size
  ×0.5 to ×8); a board beside them with the bands near the Fermi level along K′-K-Γ-M-K′, the electrons'
  speed and the middle-band width against the angle (the dip at 1.1°). The bands are computed ahead
  with the Bistritzer-MacDonald model (`scripts/data/tbg_bands.py` -> `carbon/tbgBands.json`, read by
  `tbgBands.js`; 4 shells are converged, flattest at 1.1°, electrons at 1 % of graphene's speed there).
  Sample a band path through its corners exactly, or the Dirac crossing at K is missed.
- A transmission (glass) material dims what is behind it by its base colour: keep the base light and
  put the colour in `attenuationColor` (see `characters/atomling.js`).

## A wing shared by several elements (the neon sign workshop, 2026-10-28)

`src/worlds/wings/noble/signs.js` serves He, Ne, Ar, Kr, Xe and Rn: the same `load` under each symbol
in `WINGS` (one id, `signs`), a title per symbol in both locale files, and `build(ctx, target)` reads
`target.symbol`: the visitor's gas starts every exhibit, its Atomling plays, the arch says "Back to
neon's hall" and leads to `atriumPath(target.symbol)`, and discoveries are kept as
`<Symbol>:signs:<exhibit>` (each hall's passport tile counts its own). `/e/Ne/signs` and `/e/Ar/signs`
are different worlds to the engine (`worldKey`), so each is built for its gas. The wing's notes, parts
and traps: the folder's module headers; its pure data and words are tested in `noble.test.js`.

Each room must feel like its own gas's (the user, 2026-10-28: "the prewritten word always shows Neon"):
what a visitor leaves in a room is kept per room (the name on the wall: `ew-neon-name:<Symbol>`; one key
for all six put NÉON in every room once it was lit in neon's), and the room takes the gas's colour where
it costs nothing: the name wall starts with the gas's own name in its own light, the OPEN sign by the
door, the lamplight and fill (`workshopRoom({ tint })`), and each gas greets in its own words
(`greetGas`: where its name comes from, its colour, what it does). Radon keeps neon's light (it never
goes into a sign).

More traps met there (each with its fix):

- Neon tubes: unlit tubing in a light grey reads as a lit white tube; dark glass (`#3c424f`, low
  roughness) reads as glass. A white glow (krypton) blooms about three times wider than a saturated
  red at the same emissive intensity: scale the emissive by the colour's luminance (`glowNorm` in
  `noble/neonTube.js`). Without bloom (light mode), an emissive much above 1.2 is tone-mapped to white
  whatever the gas: keep it low and let a wide faint additive tube carry the colour.
- A point light that stands for several glowing things takes the mix of their colours, weighted by how
  lit they are; the colour of the last one lit tints the others.
- Typing in a world: the WalkHud closes a panel on E in the capture phase, and the engine reads keys from
  `window`. A small DOM overlay that stops `keydown`/`keyup` from leaving it, opened with no panel open,
  takes a word without the walker moving (`noble/nameOverlay.js`; its classes are inline styles plus the
  global `glass`).
- A panel opened a few seconds after an action (so the action is seen first) should open only if the
  visitor is still at that exhibit; otherwise the next use opens it (`noble/kit.js` `exhibitSet`).
- Canvas textures with text: `await document.fonts.load('700 40px Outfit')` (and the other faces) before
  drawing, or the first draw uses a fallback font (`noble/kit.js` `fontsReady`).
- Spectra drawn from measured intensities: weight each line's brightness gently by the eye's sensitivity,
  or a near-ultraviolet line (helium's 388.9 nm) looks as bright as the yellow one.
- `tools/shot.py` splits its steps on `;`: a `js:` step must not contain one (use commas). When another
  session saves files, Vite reloads the page or the world re-enters at the spawn under a running probe
  (the frame count at the end drops, or a shot shows the spawn): retry.
- Leaving a world within a second or two of the hall starting to prewarm it gives a console error from
  three's `compileAsync` ("reading 'isReady'": a material disposed while its compile is polled). It is the
  engine's race, not a wing's (the fire wing does it too); a normal pause before the arch avoids it.
