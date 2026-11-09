# The Reactions bench (`/lab/reactions`)

Balance a reaction by tapping molecules, then run it: the same Atomlings let go and join into the products, with
the real energy given out or taken in. What it is, the science and its sources, the traps: 
`docs/knowledge/reactions.md`. The frame every bench shares: `docs/knowledge/benches.md`.

| file | what |
|---|---|
| `reactions.js` | the world: the bench (one level, or two tiers on an upright phone), the Atomlings and their bonds, the ghosts of the places waiting, the words on the bench, the energy sources (sun lamp, burner, battery), a run and its return, the effects, the camera fit, taps, `shared` |
| `chemistry.js` | pure: the ten reactions and their ΔH, the molecules as graphs, the tally, balance and multiples, the energy, `clean` (a shared state made safe), `pairAtoms` (which atom flies where), `shapeOf` and `face` (shapes), `arrange` (the blocks and stadium rows) |
| `words.js` | every word the bench and its HUD say, in en, pt-pt, pl and de, at both depths; `say`, `num`, `molName` |
| `chemistry.test.js`, `words.test.js` | run by `npm test` |
| `../../../ui/benches/ReactionsHud.jsx` | the HUD: the reactions (left, or a strip on an upright phone), the card at the top, the atoms counted and the buttons at the bottom |

Probes: `tools/reactions_probe.py` (played with real taps), the `reactions` scenes of `tools/hud_probe.py`,
`tools/shared_steps/reactions.json` for `tools/shared_probe.py --world /lab/reactions`.
