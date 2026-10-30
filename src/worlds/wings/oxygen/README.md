# Oxygen's wings

Two worlds reached from the oxygen hall. The contract every wing keeps: `docs/knowledge/adding-a-wing.md`.
Why they are as they are and what comes next: `docs/design.md` ("Oxygen"). The history:
`docs/history.md`.

## The air (`/e/O/air`)

A round sky deck above a sea of clouds, the ozone layer glowing above.

- `air.js`: the deck, where everything stands, the exhibits and their panels; `cameraPitchMax` lets the
  third-person view look up at the ozone (`adding-a-wing.md`).
- `airSky.js`: the daylight dome, the clouds, the peaks, the ozone glow.
- `airBox.js`: the box of air, 100 molecules in dry air's proportions (78 N2, 21 O2, 1 Ar) colliding as
  a real gas (Maxwell-Boltzmann speeds).
- `airBreath.js`: breathing (2026-10-29): glass lungs between the air breathed in and the air breathed
  out; E starts it and E again holds the breath (the user: one breath was over before the breath out
  was seen). `tools/breath_probe.py`.
- `airO2.js`: the O2 molecule up close (its Lewis picture, its twelve outer electrons; in Scientist the
  two unpaired electrons that make it magnetic) and the magnet (liquid oxygen hangs between the poles,
  liquid nitrogen falls through).
- `airOzone.js`: the atmosphere to scale in a 5 m tube (1 m = 10 km), Everest, a jet, the ozone layer.
- `airGoe.js`: the Great Oxidation: stromatolites giving off oxygen, oxygen in the air over 4.6 billion
  years.
- `globe.js` + `earthLand.js`: where our oxygen comes from, on a globe with the real coastlines (Natural
  Earth 1:110m, public domain).
- `airWords.js`: every word, four languages, both depths, with the numbers' sources.

## Fire (`/e/O/fire`)

A round stone chamber lit by a campfire.

- `fire.js`: the chamber, the exhibits and their panels. `fireCave.js`: the cave, smoke and moonlight.
- `fireTriangle.js`: the fire triangle round the campfire (take a side away and the fire dies).
- `fireBenches.js`: the four benches (the candle under a jar, the glowing splint, methane burning atom
  by atom, rust as slow burning).
- `flame.js`: flames drawn by a shader, embers, the campfire.
- `fireWords.js`: every word.

## Shared

- `kit.js`: noise, screens on stands in the hall's look, glass, labels, equations, small helpers.
- `oxygenData.js` (the numbers, no three.js), `oxygenText.js` (text helpers): read by `oxygen.test.js`.

## In a room

Everyone on the same deck or in the same chamber shares its things: each piece's `state()` /
`setState(s, live)` (the methane stage's `shared()` / `setShared()`: `state` is its own stage), listed in
`shared` near the end of `air.js` and `fire.js` (`src/net/shared.js`; `adding-a-wing.md`, "Shared with
the room"). Air: the box's highlight, O2's electrons, the magnet's pours, the ozone volley (the sky's too),
the globe's half, the Great Oxidation run, breathing. Fire: the triangle's sides, the jar (the air used
up, run forward for a latecomer), the splint, methane, rust. The rare CO2 is a panel only; the fire's
flare is each one's own (it answers this visitor's own oxygen Atomling). Check:
`py -3.11 tools/shared_probe.py --world /e/O/air` (and `/e/O/fire`).

Next for oxygen: `docs/design.md` (a ride with a red blood cell).
