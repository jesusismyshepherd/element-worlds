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
  light beams, equations with real subscripts, invisible shapes to tap (`ghostBox`, `ghostPost`,
  `ghostBall`, `ghostAround`).
- `words.test.js`: every word present in four languages and both depths.

## Worked by hand (since 2026-10-31)

The user's rule for every station (2026-10-30, `adding-a-wing.md` "Look and feel"): the visitor chooses
each step by tapping the thing it is about, anything that varies smoothly is a slider, the prompt names
the next tap, and E opens the station's panel, whose buttons do the same. Both worlds make
`tapTargets(ctx)` (`common/taps.js`) and return its `pointAt` and `onTap`. What is tapped is an invisible
shape (`kit.js` ghosts: a lattice of hundreds of balls is slow to test every frame the mouse moves and hard
to hit with a finger), its `when` saying whether that step can be done now (the hand shows only then).

| Station | Before | Now |
| --- | --- | --- |
| Graphene (peel) | E peeled, E again put it back | tap the stack (or the tape over it, out of sight from close by) to peel, the floating sheet (or the stack) to put it back; panel: Peel, Put back |
| Graphite | E slid, E again stacked | tap the layers (each tap the other way); panel: Slide, Stack up |
| Electronics (transistor) | E swept the gate; each sweep swapped plain graphene and bilayer by itself | tap the gate (the middle gold bar; its knob on the table's front is hidden behind the Atomling from where one stands) to sweep, the chip to swap the kind (the visitor's choice); panel: the gate voltage as a slider, Sweep, Plain, Two layers; the bottom reached by hand says what it means |
| The diamond press | E five times through load, squeeze, heat, open, start again | tap the graphite on the tray, the red pump lever, the capsule, the piston, the diamond, in that order (the hand only on the next); panel: the five steps (one out of order says which comes first) |
| Day and night (garden) | E turned day to night and back | tap the dial; panel: the sunlight as a slider (0 to 100%), Day, Night; the dark or full sun reached by hand is told |
| Carbon-14 clock | E wound on a half-life, the ninth started again | tap the clock for each half-life, the jar for a fresh sample; panel: Wait 5730 years, A fresh sample |
| One step each (physics, chemistry, hammock, pencil, diamond, brilliant, nanotube, C60, football, the body, the five molecules, the cycle) | E | unchanged, and a tap on the thing does what E does |
| The moiré | E: the panel with its sliders | unchanged; a tap on the sheets takes them as E does |
| The tree | E: its panel (read only) | unchanged |

Panels of the stations worked by hand carry `exhibit: <id>`: a first find opens the station's panel after
its step has played only when no panel is open (a find made from the panel's buttons never covers it).
The press opens "You made a diamond!" after each opening unless another station's panel is open. The
transistor's state is `{ n, mode, vg }` (the kind on the chip, the gate where the hand left it), the dial's
`{ night, sun }` (a state saved before has no `sun`: day or night then); sliders are sent at most seven
times a second, their last value always. Probes: `world.parts.tap.<station>(step)` does what a tap does,
`world.parts.targets` are the things, `world.panels` the panels. Check:
`py -3.11 tools/carbon_taps_probe.py` (every station tapped where a player stands, the hand checked,
screenshots in `tools/shots/carbon/`; `--phone`, `--lang`, `--level scientist`). On an upright phone the
press's tray and lever and the carbon-14 clock and jar lie outside the view from the station's middle: the
probe turns toward them as a player would.

Traps met: a box round a big thing (`ghostAround` of the C60 dome, of the nanotube) holds the walkway
beside it, and one stood inside catches every tap: the tube and the dome have their own shapes, the tube
gives way to the dome when the walker is in it (the camera then stands in the tube). The chip's middle is
the gate bar: a tap there sweeps, the chip's pads and channel swap the kind. Groups with lines (the
diamond's highlight, the hammock, the body) must not be tapped as they are: the raycaster's line threshold
(1 m) makes every line a wide target; the ghosts avoid it.

## Shared with the room

In a room, everyone in the same wing shares its exhibits (`src/net/shared.js`; `adding-a-wing.md`, "Shared
with the room"); each world's `shared` sits after its interactables. Pieces with a lasting state give
`state()` / `setState(s, live)`: the peeled sheet, graphite's slid sheets, the transistor (sweeps, the
kind on the chip, the gate where the hand left it), the moiré (its twist, sweep phase, who holds it:
someone else's hand is followed, eased, for at most a minute; the slider is sent at most seven times a
second), the press's step (a newcomer's runs every step to its end at once), the day/night dial (and its
sunlight), the carbon-14 clock (which atoms decayed: chance, so the one who turned it says). What only happens (a pulse, a kick, a spin, the dome's count, the pencil's hexagon)
is a count (`kit.js` `happening`). Labels that follow a state are getters and `promptSync` keeps the
prompt right when someone else changed it. The panels (the tree's too), words and discoveries stay each
one's. Check: `py -3.11 tools/shared_probe.py --world /e/C/allotropes` (and `/e/C/life`); more steps in
`tools/shared_steps/carbon.json`.

Traps: meshes that are not solids (lattices, crowns) need this wing's own camera fade (CLAUDE.md,
Open). The nanotube's camera is eased (`docs/knowledge/walking.md`).
