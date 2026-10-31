# The neon sign workshop (`/e/<Symbol>/signs`)

One wing shared by the six noble gases (He, Ne, Ar, Kr, Xe, Rn); the visitor's gas starts every
exhibit. How a shared wing works (one module, the target symbol, discoveries per hall):
`docs/knowledge/adding-a-wing.md`, "A wing shared by several elements". The history: `docs/history.md`.

- `signs.js`: the workshop, where everything stands, the exhibits and their panels.
- `signs.room.js`: the brick room at night, lamps, the doorway, the glass-bender's corner.
- `signs.bench.js`: the filling bench (five tubes bent into He, Ne, Ar, Kr, Xe; manifold, pump, gauge)
  and radon's lead box.
- `signs.optics.js`: the spectroscope (NIST lines) and the atom's energy ladder.
- `signs.parts.js`: the name wall (your word in neon), the history board, the balloons.
- `neonTube.js` + `tubeFont.js`: tubes swept along a font of bent glass (Portuguese, Polish and German
  letters too); `nameOverlay.js`: the little window for writing your name (plain DOM, at an edge).
- `spectrumCanvas.js`: spectra drawn on a canvas. `nobleData.js`: the numbers and their sources.
- `kit.js`: maths, canvas textures, screens, words at the reader's depth, the exhibits' rules.
- `signs.words.js`: every word, four languages, both depths. `noble.test.js`.

The workshop's things are kept twice, the player's own and each room's, and in a room everyone in the same
workshop shares them: each piece's `state()` / `setState(s, live)`, listed in `shared` at the end of
`signs.js` (`src/net/shared.js`; `adding-a-wing.md`, "Shared with the room"). The word on the wall is one of
them (it had its own key, `ew-neon-name:<Symbol>`, before). Check: `tools/shared_probe.py` (its own
workshop scenario, and `--world /e/Ne/signs` with `tools/shared_steps/noble.json`).

## Choosing each step by tapping its thing (2026-10-31)

The user's rule for every station (2026-10-30): pressing E again and again through fixed stages felt
passive, so each step is a tap on the thing it is about (`common/taps.js`; the hand shows over it), the
prompt names the next tap, and E opens the station's panel, whose buttons do the same steps. Each
station's first step counts its discovery and opens its panel a moment later if the visitor is still
there. Every station but the name has a station view (`focus`: the view goes into the Atomling's eyes as
E is pressed or the panel opens; the balloons' takes in the room's height, to see them fly).

| station | before | now (tap) | panel (E) |
|---|---|---|---|
| bench | E ran pump, fill, spark on the next tube in a fixed order; all lit, E switched off | the pump; a gas's flask or its tube on the wall (lets that gas in); the high-voltage box (lights it, or switches the lit ones off). Out of order the Atomling says why (air still in: no glow, Paschen; empty: no gas) | Pump, the five gases, High voltage |
| radon | E measured | the Geiger counter or the lead box | Measure |
| name | E opened the window | the word on the wall, the desk or its screen (E still opens it) | the window itself |
| atom | E fired, then moved on to the gas's next line by itself | the atom (or its plinth) fires; a colour down the ladder's right side chooses that line and fires | Fire, the three lines |
| history | E lit the next sign in order, then all off | any sign, in any order (a lit one tells its year again) | 1898, 1910, TODAY, Switch them off |
| spectrum | E put the next gas in the holder | a tube in the rack of spare tubes on the table | the five gases |
| balloons | E let all go or tied all back | one balloon (a flying one comes back); the table, all five at once | the five gases, all go, tie again |

No station had a value that varies smoothly, so none has a slider. The shared states grew: the bench's
`{ lit, line }` (`line`: 'air', 'empty' or the gas waiting for the voltage), the board's `{ lit: [keys] }`
(a number kept from before lights the first ones), the balloons' `{ free, age, out }` (`out`: each
balloon's seconds aloft or -1; a `{ free, age }` kept from before lets all five go), the atom's `line` is the
one chosen (it no longer moves on by itself).

For the probes: `parts.tap(id, what)` does what a tap does (`tap('bench')` the step the prompt names next,
`tap('bench', 'pump' | 'hv' | 'Kr')`, `tap('atom', 2)`, `tap('history', '1910' | 'off')`,
`tap('spectrum', 'Xe')`, `tap('balloons', 'He')`, `tap('balloons')` the table); `parts.at.<thing>()`
gives where a thing stands (`pump`, `hv`, `flask(s)`, `tube(s)`, `geiger`, `word`, `desk`, `atom`,
`chip(k)`, `sign(key)`, `rack(s)`, `balloon(s)`, `table`) and `parts.rayTo(p)` the ray a tap there casts,
for a real tap: `w.onTap(w.parts.rayTo(w.parts.at.pump()))`; `panels.<station>` opens a panel
(`__ew.showPanel(__ew.world.panels.bench)`). A tap at a point on the screen, as the mouse would:
`__ew.world.onTap(__ew.rayAt({ x, y }))` (project the point with `__ew.camera`; in shot.py, assign the
helper inside `void (...)`, or Playwright calls the function it returns).
