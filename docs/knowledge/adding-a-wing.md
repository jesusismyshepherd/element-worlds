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
| `attach(engine)`, `detach(engine)`, `update(dt, t)`, `dispose()` | optional |

`ctx`: `{ engine, renderer, scene, camera, canvas, input, store, light, t, lang(), level(), go(path) }`.

## Words

- Every text in European Portuguese and English, and at two depths: `kid` (Explorer: plain words, a
  ten-year-old) and `sci` (Scientist: numbers with units, equations, names and dates). Keep a wing's
  words in its module: `const WORDS = { en: { ... }, 'pt-pt': { ... } }`, chosen with `ctx.lang()`;
  read `ctx.level()` when a panel opens, so a change of level shows at once.
- Panels: `ctx.store.set({ panel: { title, kicker, color, blocks } })`, blocks `{ p }`, `{ big, small }`,
  `{ rows: [[label, value]] }`, `{ list: [...] }`. The Atomling talks: `ctx.store.set({ speech: { text, who, color } })`.
- No em dashes. Portuguese element names take articles ("o carbono", but "a prata", "a platina").
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
- `ctx.light` (phones, weak computers): fewer particles, no glass; keep frames short.
- The arch back to the atrium stands behind the spawn; the spawn faces into the wing.

## Checking it

- `npm run dev` (port 5310), then
  `MSYS_NO_PATHCONV=1 python tools/shot.py /e/C/allotropes --steps "js:__ew.teleport(0, 4, 0, 0.1); wait:1; shot:name"`.
  `__ew.teleport(x, z, yaw, pitch)` puts the walker anywhere; `__ew.setMode('first')` switches view;
  `__ew.world.interactables` lists the exhibits; `__ew.player.near?.onUse()` uses the one in reach.
  Look at every exhibit from where a player stands, in both views; console errors fail the run.
- `npm test` and `npx vite build` pass.

## Traps

- Text: the 3D fonts have no Greek letters, no arrows, no subscripts and no superscripts except ² and ³
  (troika then fetches fallback fonts from a CDN): `formulaText` for formulas, words for Greek letters.
- A door less than about 2.6 m behind the spawn: switching to first person steps the visitor back 1.6 m
  (the engine now steps in front instead when a door is there, but keep doors clear of the spawn).
- An arch at a platform's edge puts the third-person camera behind its portal, which floods the view with
  its colour: keep `cameraBounds` on the inner side of the arch.
- Something overhead to see (oxygen's ozone layer): `cameraPitchMax` on the world lets the third-person
  camera tilt up (default 0.2 rad).
- Shadows: `env.shadows: true` (computers only); a world may also switch `renderer.shadowMap` in attach
  and restore it in detach, as oxygen's wings do.
- troika's `sync(cb)` never calls back for a text that has already synced; three's `Curve` has no
  `isCurve` flag.
- A patch that renames a file over the original can leave Vite's error overlay up until the file is
  touched again; other sessions creating files make Vite reload the page under a running probe (retry).
- `env.environment` (a texture, or null for none) and `env.far` exist too.
- The RoomEnvironment light washes out dark places: set `env.envIntensity` low there.
- A transmission (glass) material dims what is behind it by its base colour: keep the base light and
  put the colour in `attenuationColor` (see `characters/atomling.js`).
