# Carbon's wings

Two worlds reached from the carbon hall. The contract every wing keeps (attach, update, panels,
discoveries, words, checking): `docs/knowledge/adding-a-wing.md`. Why they are as they are:
`docs/design.md` ("Carbon"). The history: `docs/history.md`.

## Diamond, graphite and company (`/e/C/allotropes`)

- `allotropes.js`: the gallery (24 m by 47 m, graphene floor at 0.5 m per ångström), where everything
  stands, the exhibits and their panels.
- `allotropes.parts.js`: its pieces (floor shader, hall, diamond lattice, brilliant, graphite's sliding
  sheets, the giant pencil, nanotube tunnel, C60 dome, the football, the sticky-tape station, the press).
- `graphene.parts.js`: the graphene row (the peel stack, physics: the π bands and the Dirac cones,
  chemistry, the hammock, the transistor, the twisted bilayer on its light table).
- `gem.js`: the cut diamond that sparkles for real (ray traced in a shader, n = 2.42).
- `structures.js`: the exact geometry in ångström, pure (no three.js), checked by `structures.test.js`.
- `honeycomb.js`: the graphene honeycomb in GLSL, shared by floor, moiré, hammock and transistor.
- `tbgBands.js` + `tbgBands.json`: twisted bilayer bands from `scripts/data/tbg_bands.py`
  (Bistritzer-MacDonald), any angle from 0.5 to 12 degrees; `tbgBands.test.js`.
- `allotropes.words.js`: every word, four languages, both depths.

## The carbon of life (`/e/C/life`)

- `life.js`: the garden under a geodesic dome with the breathing tree (CO2 in, O2 out while the sun
  shines; a dial turns day into night).
- `life.parts.js`: sky, dome, lawn, lamps, the day/night dial, "you are 18% carbon", molecule pedestals,
  the carbon-14 clock.
- `tree.js`: the tree grown in code (Leonardo's rule, instanced leaves, the air it breathes).
- `life.words.js`: every word.

## Shared

- `kit.js`: lattices as instanced balls and sticks, lecterns that follow the depth switch, plinths,
  light beams, equations with real subscripts.
- `words.test.js`: every word present in four languages and both depths.

Traps: meshes that are not solids (lattices, crowns) need this wing's own camera fade (CLAUDE.md,
Open). The nanotube's camera is eased (`docs/knowledge/walking.md`).
