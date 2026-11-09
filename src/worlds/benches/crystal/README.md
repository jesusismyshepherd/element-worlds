# Growing Crystals (`/lab/crystal`)

A bench of the Molecule Lab: ions drift in salt water (or a hot melt) and stack into a crystal, a perfect cube
when slow, a hopper (and salt boats) when fast; tap an ion to see its neighbours; zoom out to a real grain. The
whole story, the science and its sources: `docs/knowledge/crystal.md`. The bench frame: `docs/knowledge/benches.md`.

| file | what |
|---|---|
| `crystal.js` | the world: `build(ctx)`, the room (sky, table, verse), the hosts (two Atomlings), the drifting ions, each crystal's drawing, the flights, taps and their neighbours, the grain's zoom, the camera, `shared.dish`, the probe hooks |
| `dish.js` | the glass dish (or crucible), the water or melt and its level or glow, caustics, the light from above, the rod and thread, vapour |
| `lattice.js` | pure: the structures (rock salt, fluorite, antifluorite) as integer points, neighbours, the fifteen compounds (lattice constants, water or melt), Shannon radii, the grain's count |
| `grow.js` | pure: the seeded growth model (`Crystal`: bond-weighted placing inside an envelope: cube, hopper, boat), `capacity` |
| `plan.js` | pure: a dish's plan from (compound, speed, seed), the growth curve, the discoveries (`FINDS`), `cleanDish` |
| `words.js` | every text, four languages, both depths (Polish counts, formulas with subscripts, numbers) |
| `*.test.js` | `npm test` |

The HUD: `src/ui/benches/CrystalHud.jsx` (store `crystal`, `crystalCelebrate`). Probes: `tools/crystal_probe.py`,
`tools/hud_probe.py --scene crystal-tap`, `tools/shared_steps/crystal.json` (for `shared_probe.py --world /lab/crystal`).
