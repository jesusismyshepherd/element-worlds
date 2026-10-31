# The diamond press for two (2026-10-31)

The user: "all of the stations are for one person. Can you have stations that two people can play with
and have fun", after the science centres' exhibits (Experimentarium in Copenhagen, the Copernicus Science
Centre in Warsaw): some played alone, more where several play (more fun, more engagement), some that need
another person, and where possible switching from solo to needing more depending on whether the player is
in a room. "Just one, as a working example." This is it; the next ones follow its pattern (below).

## What it is

Carbon's gallery (`/e/C/allotropes`), its existing press made into a job for two, because real diamond
growth needs two things at once (HPHT: high pressure, high temperature):

- **The pump** (the console, its red lever): each stroke adds pressure, less as it rises; the seals leak
  (5% a second), so someone keeps pumping (about 1.5 strokes a second holds 6.3 GPa). Over 7.6 GPa the
  safety valve opens and drops it to 5 GPa (the lamp flashes, the press shakes).
- **The heater** (a cabinet on the press's other side: its knob, a power slider, and a screen): the
  capsule follows the power slowly (2.5 s), heats more as the cell is squeezed, and drifts as it settles,
  so the heat needs watching too.
- **The window**: a diamond grows only while T is between 1300 °C (the iron-nickel solvent melts) and
  1600 °C (hotter, the crystal would grow flawed: this press stops it) and P is above the graphite-diamond
  line (Kennedy and Kennedy 1976: 1.94 GPa + 0.0025 GPa/°C, 5.69 GPa at 1500 °C), fastest 0.5 GPa above
  it. Below the line while hot it shrinks back into graphite. The heater's screen draws the window (P
  against T, 600 to 1800 °C, 3 to 8 GPa), the press's point with its trail, the carats, the seconds left and
  a word ("Growing!", "Too cold", "More pressure!", "Too hot", "Safety valve!"); the lamp on top is green,
  blue, red or orange the same way.
- **A run** lasts 45 s (the sci text says a real press takes days for a carat), then the press cools and
  opens on the diamond, sized by its carats (0.8 ct is the old press's size); a run that grew nothing
  shows the graphite. Steady teamwork makes about a carat; careless play almost nothing.
- **Alone** the player works both (hard: tap the lever and drag the slider). **Two or more at the press in a
  room**: whoever pumps first keeps the pump, whoever turns the heater first keeps the heater; the other job
  is refused with "Ana has that job. Call out to them!" (the duo text tells them to talk). Someone leaving
  frees their job; alone again, one works both. More than two: the others watch and can take a freed job.
- The diamond (the result panel, the discovery, the best kept on the device) is theirs who worked the
  press (`doers`), not who only stood by: a bystander sees the press open without a panel. The panel says
  "Together: a 1.07-carat diamond!" when two or more worked it.

Ways in: tap the graphite on the bed (or E at the pump, or the panel's Start); the lever (or E at the
pump, or the panel's Pump) pumps; the heater's knob (or E at the heater) opens its slider; the diamond (or
the panel's Start again) loads the press again. E at the pump pumps rather than opening a panel, so a
keyboard player can pump; the panels follow the jobs as they are taken.

## How it works

- `src/game/press.js`: the rules, pure (`newRun`, `act` with `{ t: 'pump' }` or `{ t: 'heat', p }`, `tick`,
  `present`, `may`, `holder`, `zone`, `growth`, `heatTarget`, `lineP`); `press.test.js`. All the numbers
  are at the top of the file; tuning was checked by simulating strokes a second against heater settings
  (0.7 power too cold, 0.85 too hot, 1.5 to 2.1 strokes a second best, 2.5 opens the valve).
- `src/net/press.js` (`pressLink`, `window.__ewPress`): in a room the run goes through the room's referee
  (`referee.js`, as the duel and the forge's race): who starts it runs the rules four times a second and
  sends the state; the others send their strokes (lazy: they go with the next tick) and the heater's power
  (at most every 0.12 s, the last always). Who is at the press: the room's members whose path is the
  gallery. A newcomer asks for a run on; the referee leaving hands it on (the players first).
- `src/worlds/wings/carbon/pressRun.js`: the gallery's side: alone, the rules run every frame here; in a
  room, through `pressLink`; `onEnd` once per run on every screen.
- `allotropes.parts.js` `diamondPress`: the model (the heater cabinet and its canvas screen, the lamp),
  `actions.show(view)` each frame of a run (the press closes in the first two seconds), `finish(ct)`,
  `reset()`, `rest(ct)`; `state()` / `setState()` keep the press at rest (open on a diamond, or loaded) in the
  room's store and one's own (`shared.js`); a run itself is not in `shared`.
- `allotropes.js`: the two spots (`LAYOUT.press.use` the pump, `.heat` the heater), the taps, the panels
  (`pressPanel`: during a run the controls this player may use; after it the result; `heatPanel`), the
  words (`W.press` in `allotropes.words.js`, four languages, both depths).

## Checking

- `npm test` (`src/game/press.test.js`).
- `py -3.11 tools/press_duo_probe.py`: Ana on a computer, Bob on a phone in Polish, in a room: the same run
  on both, the jobs kept and refused (with who has them), the same diamond and the result panel on both,
  then Ana alone works both. 23 checks, about a minute.
- `py -3.11 tools/carbon_taps_probe.py --only press`: the real taps on the screen (graphite, lever, knob,
  slider).
- `tools/shared_probe.py --world /e/C/allotropes`: the press and the heater's spot pass. Its five moiré
  failures were there before (the live site has them too; a studio item).

## Traps met

- The referee closes a run as soon as its last state arrives (`referee.js` `receive`), so the others' code
  never saw the end: `PressLink.receive` tells the gallery the final state before handing it on.
- First version showed the result panel to everyone in the gallery: the shared probe's bystander got a
  panel 45 s after Ana started the press. The result is for `doers` only.
- Without pressure the capsule could not reach 1300 °C at full power (true to the physics of the cell's
  contact, but a child at the heater thinks it is broken): the pressure's effect on heating starts at 4 GPa.

## The pattern for the next stations for two

A station for two is a job that really needs two things at once (here pressure and heat), split so each
person has one and both see the shared result; alone, one person can still do both, harder. The room's
referee runs the shared state; the jobs are taken by doing them; the result belongs to who took part.
Candidates (the studio's "Stations for two" idea): the fire triangle for three (fuel, heat, oxygen: each
holds one side, the fire burns only while all three hold), the neon bench (one pumps the vacuum, one
fills and lights), an electron tug of war between two atoms (who wins is the electronegativity, so the
fun is in choosing the atom).
