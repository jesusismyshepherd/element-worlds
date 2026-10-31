# Oxygen's wings

Two worlds reached from the oxygen hall. The contract every wing keeps: `docs/knowledge/adding-a-wing.md`.
Why they are as they are and what comes next: `docs/design.md` ("Oxygen"). The history:
`docs/history.md`.

## Every step a tap (2026-10-30)

The user's rule for every station: the visitor chooses each step by tapping the thing it is about, and
what varies smoothly is a slider; pressing E again and again through fixed stages felt passive. So each
station is a `manual` exhibit (`kit.js` `exhibitSet`): its things are made clickable with
`common/taps.js` (the world returns `pointAt` and `onTap`), the prompt names the next tap (the words'
`hints`), and E opens the station's panel, whose buttons (and sliders) do the same steps. A step says its
line and counts the find (`ex.discover(id, delay)`); the first find opens the panel a few seconds later,
once the step has been seen. Each station has a `focus`: used in third person, the view goes into the
Atomling's eyes (`docs/knowledge/walking.md`). Small or thin things get an invisible, bigger shape to tap
(`hitBox`, `hitBall`, `hitShape` in `kit.js`). `parts` and `panels` on each world are for the probes.

| station | tap | panel |
|---|---|---|
| box of air | a molecule (or a gas's column on the console): that gas counted; the same again, all | a button per gas, and all |
| the rare one (CO2) | (read only: E opens its panel) | |
| O2 up close | the molecule or its Lewis screen: electrons shown, again hidden | show / hide |
| the magnet | the blue flask: liquid oxygen hangs between the poles; the silver one: liquid nitrogen falls through | pour each |
| the ozone layer | the column: a volley of the Sun's UV | send |
| where our oxygen comes from | the land or the sea on the globe (or the screen's halves) | land, ocean |
| the Great Oxidation | the pool (or the screen): the 11 s journey through time | travel; a slider, any moment |
| breathing | the lungs: breathing starts and goes on; again, the breath held | breathe / hold |
| the fire triangle | a side's post or its glowing bar: taken away, again put back | each side |
| the candle | the jar or the candle: covered, again lifted | cover / lift |
| the splint | the splint or its tube: the test | the test |
| methane | the molecules or the gas ring: burnt, again set up | burn / again |
| rust | the rack of tubes: the week runs on (at its end, new nails) | run, new nails; a slider, any day |

Breathing keeps what the user asked on 2026-10-29 (one breath was over before the breath out was seen):
it goes on, breath after breath, until held. The magnet had one flask that poured oxygen and nitrogen in
turn; it has two now, so the liquid is chosen by tapping its flask (each with its formula and name).
Traps met: three.js raycasts invisible meshes, but `taps.js` skips a thing whose own `visible` is false,
so a hit shape is a visible group holding a hidden mesh; the box's molecules are tested as balls (each
molecule's centre and size), not their instanced faces, every frame; a station's things are raycast only
while the walker is near it (`within`), and the box's only beside the box (from the ozone column the
station view backs off past the box, and the box's molecules caught the taps). Check:
`tools/breath_probe.py`, `tools/shared_probe.py --world /e/O/air` (and `/e/O/fire`) with
`tools/shared_steps/oxygen.json`.

## The air (`/e/O/air`)

A round sky deck above a sea of clouds, the ozone layer glowing above.

- `air.js`: the deck, where everything stands, the exhibits, their taps and panels; `cameraPitchMax` lets
  the third-person view look up at the ozone (`adding-a-wing.md`).
- `airSky.js`: the daylight dome, the clouds, the peaks, the ozone glow.
- `airBox.js`: the box of air, 100 molecules in dry air's proportions (78 N2, 21 O2, 1 Ar) colliding as
  a real gas (Maxwell-Boltzmann speeds); `picker` finds the molecule tapped.
- `airBreath.js`: breathing (2026-10-29): glass lungs between the air breathed in and the air breathed
  out; a tap on the lungs starts it, a tap again holds the breath. `tools/breath_probe.py`.
- `airO2.js`: the O2 molecule up close (its Lewis picture, its twelve outer electrons; in Scientist the
  two unpaired electrons that make it magnetic) and the magnet with its two flasks (liquid oxygen hangs
  between the poles, liquid nitrogen falls through).
- `airOzone.js`: the atmosphere to scale in a 5 m tube (1 m = 10 km), Everest, a jet, the ozone layer.
- `airGoe.js`: the Great Oxidation: stromatolites giving off oxygen, oxygen in the air over 4.6 billion
  years; `hold(ga)` stops at a moment (the slider).
- `globe.js` + `earthLand.js`: where our oxygen comes from, on a globe with the real coastlines (Natural
  Earth 1:110m, public domain); `sideAt` says whether a tap landed on land or sea.
- `airWords.js`: every word, four languages, both depths, with the numbers' sources.

## Fire (`/e/O/fire`)

A round stone chamber lit by a campfire.

- `fire.js`: the chamber, the exhibits, their taps and panels. `fireCave.js`: the cave, smoke and
  moonlight.
- `fireTriangle.js`: the fire triangle round the campfire (take a side away and the fire dies).
- `fireBenches.js`: the four benches (the candle under a jar, the glowing splint, methane burning atom
  by atom, rust as slow burning, its week stopped at any day by a slider), each with its `things` to tap.
- `flame.js`: flames drawn by a shader, embers, the campfire.
- `fireWords.js`: every word.

## Shared

- `kit.js`: noise, screens on stands in the hall's look, glass, labels, equations, the exhibits' rules
  (`exhibitSet`: manual exhibits, `discover`, `say`, `refreshPanel`, `watch`: an open panel written
  again when what its buttons say changed, by an animation ending or by someone else in the room),
  shapes to tap, small helpers.
- `oxygenData.js` (the numbers, no three.js), `oxygenText.js` (text helpers; `chemBlocks` also writes
  buttons' and sliders' formulas): read by `oxygen.test.js`.

## In a room

Everyone on the same deck or in the same chamber shares its things: each piece's `state()` /
`setState(s, live)` (the methane stage's `shared()` / `setShared()`: `state` is its own stage), listed in
`shared` near the end of `air.js` and `fire.js` (`src/net/shared.js`; `adding-a-wing.md`, "Shared with
the room"). Air: the box's highlight, O2's electrons, the magnet's pours (`{ n, last }`: the count and the
liquid poured last), the ozone volley (the sky's too), the globe's half, the Great Oxidation run and the
moment held on its slider (`at`), breathing. Fire: the triangle's sides, the jar (the air used up, run
forward for a latecomer), the splint, methane, rust (`day` where the week stands, as on its slider). A
slider sends at most four times a second, its last value always. The rare CO2 is a panel only; the fire's
flare is each one's own (it answers this visitor's own oxygen Atomling). Check:
`py -3.11 tools/shared_probe.py --world /e/O/air` (and `/e/O/fire`).

Next for oxygen: `docs/design.md` (a ride with a red blood cell).
