# Building DNA (the lab's bench at `/lab/dna`)

Read `docs/knowledge/dna.md` first (what there is, the science and its sources, traps, checking).

| file | what |
|---|---|
| `dna.js` | the world: the table, the tray drawn into the HUD's slots, the nucleotides' flights, the helix (instanced atoms and bonds per duplex, slabs, rails, hydrogen-bond beads, letters), the twist, the copy, finds, the verse's corner, `shared` (part `bench`) |
| `bases.js` | pure: the four B-DNA nucleotides from 3DNA (atoms, bonds, hydrogens), the free bases, which atoms hold hands across a pair, where each pair stands (twist 34.3 degrees, rise 3.38 Å), counting (Chargaff), the copy's timeline, the finds |
| `words.js` | every text, four languages, two depths (`say`, `findText`, `num`) |
| `bases.test.js`, `words.test.js` | the geometry checked against the real thing; the words complete |

The HUD is `src/ui/benches/DnaHud.jsx`. Probes: `tools/dna_probe.py`, `tools/shared_steps/dna.json`, the
`dna` scenes of `tools/hud_probe.py`.
