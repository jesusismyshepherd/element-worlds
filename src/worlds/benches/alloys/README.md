# The Alloy Forge (`/lab/alloys`)

A bench of the Molecule Lab: metals thrown into a crucible become bronze, brass, steel and the rest; inside
the metal, the ions in their sea of electrons; a hammer whose strike slides a pure metal's rows and is
stopped by an alloy's misfit atoms. How it works, the science and its sources, the traps:
`docs/knowledge/alloys.md`. The bench frame (address, title, verse, HUD loading): `docs/knowledge/benches.md`.

| file | what |
|---|---|
| `alloys.js` | the world: the lab's night and table, the crew of ten metal Atomlings (tap: a lump flies in; hold: more), the state (crucible, ingot), pour and strike, what is shared in a room, the taps, the camera's fit, the HUD's report, the discoveries |
| `mix.js` | the chemistry, pure: the metals, mass and atom fractions, the ten alloys (ranges by mass, hardness, melting), what a nameless mix nearly is, the slab of atoms (sites, carbon in the gaps, the strain, solder's bands, cast iron's flake) and each strike (slip, jam, crack) |
| `smithy.js` | the furnace (stones, coals, flames, embers, its light), the crucible and its melt (splashes, floating carbon), the pour, the anvil, the ingot (dents, flattening, the halves), the hammer, sparks |
| `slab.js` | inside the metal: the glass case, the ions (instanced, at 74% of the atom's size), the electron sea (drifting dots, carried by a slipping row), the slip plane's flash, the jam's culprits, the crack |
| `words.js` | every word in English, European Portuguese, Polish and German, at both depths, and the sentences built from them |
| `mix.test.js`, `words.test.js` | the alloys by their recipes and ranges, the fractions, the slab and the strikes; every language's words |

The HUD is `src/ui/benches/AlloysHud.jsx`. Sounds (`anvil`, `plop`, `pour`, `sizzle`, `ring`) are in
`src/audio/sound.js`. Probes: `tools/alloys_probe.py` (by hand), `tools/hud_probe.py --scene bench-alloys`,
`tools/shared_probe.py --world /lab/alloys` (with `tools/shared_steps/alloys.json`).
