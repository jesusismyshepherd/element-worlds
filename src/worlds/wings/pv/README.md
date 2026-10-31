# The Periodic Videos rooms (`/e/<Symbol>/videos`)

An element's Periodic Videos film rebuilt as experiments to do, with the film beside them, entered through a
doorway board in the element's hall
(`docs/knowledge/periodic-videos.md`; what each film shows: `docs/pv/<Symbol>.md`). One module serves every
element that has a room; sodium's is the first, silicon's the second (2026-10-30).

- `room.js`: `build(ctx, target)`: the room for `target.symbol`, the screen and its chapters, the arch back,
  the Atomling, and `panel(...)`, a station's panel with "Watch this part" (YouTube's player opens on top of
  the station's own words and buttons, at the moment that experiment starts). It gives the stations
  `clickable` (`common/taps.js`) and `reopen(make)` (a station's open panel written again after a button
  changed what it says), and returns the world's `pointAt` and `onTap`.
- `lab.js`: the room every element shares: the lab (bench and fume cupboard west, the professor's corner
  east), the brick courtyard north with the red bench; `SPOTS` (where stations stand and where the visitor
  stands to use them; `face` points a part's +x at the visitor).
- `apparatus.js`: the parts and what they do: `oilTin` (`lift`, `cut`), `courtyardBowl` (any alkali metal:
  three lumps on a tile, carried over and dropped in, skating, the flame, the bang, the indicator from a dropper
  bottle), `saltWindow`, `saltLamp` (with its switch), `noteCard`, `videoScreen`; `hitMesh(geo)`, a target for
  taps that is never drawn (round a thin knife, a small lump).
- `fx.js`: `particles` (bubbles, sparks, smoke) and `flame`, shared by every room.
- `professor.js`: the professor in his corner (his lines: `prof` in the element's words, their times in
  `videos.js`); `room.js` gives him a panel with "Watch him say it" and "Next".
- `videos.js`: each element's video id, year, length, and where each station's part starts (`parts`, s);
  `ROOMS` lists the elements with a room. `pv.words.js`: the words every room shares.
- `<Symbol>.js` + `<Symbol>.words.js`: an element's stations (`stations(...)`, `chapters`, `COLOR`) and their
  words in four languages at both depths. `pv.test.js` checks the words' shapes and the video times.

## Every step is a tap on its thing (the user, 2026-10-30)

Pressing E again and again to walk through fixed stages felt passive. Each station is an exhibit with
`manual: true`: its prompt (`verb`, a getter) names the next tap ("Tap the knife to cut a slice"), a tap on the
thing does the step (`clickable(object, fn, { reach })`), what varies smoothly is a slider in the panel, and E
opens the panel, whose buttons do the same steps (keyboards, probes). A tap out of turn says the prompt
again. The first step that makes the find calls `ex.discover(id, panel, delay)`, which opens the panel after
the delay the first time (the old `panelDelay`). The same pattern as the picture rooms
(`pictures/scenes/C/twins.js`).

| station | the taps | slider |
|---|---|---|
| Na: oil tin | the tin (the rod comes out; a new rod after 15 slices), the knife or the rod (a slice) | |
| Na: bowl | a lump on the tile, small, medium or large (carried over, dropped in), the indicator bottle (a drop falls from the dropper; only after a lump has reacted) | |
| Na: salt window | the window (cracks; again, a new window) | |
| Na: salt lamp | the switch on its cord, or the lamp | |
| Si: lump | the bottle (out onto the turntable), the lump (a spin) | turn it by hand (held at that angle until spun) |
| Si: chip line | the wafer (cut), the tester (test), the computer or the bin (sort), a wafer on the board on the wall (20 or 30 cm, the next) | |
| Si: wafer | the stand (rocks it, the rainbow sweeps), the wafer (turns it over) | tilt |
| Si: turbocharger | the pedal | |
| Si: minerals | each mineral (picked up, named) | |

Left as they were: the professor (E, his next line), the screen (E, the film), the professor's card (read),
the Atomling (talk). In third person the Atomling stands between the camera and a bench-top station, so E
(the station view, through its eyes) usually comes before the first tap; first person sees the bench at once.

For the probes: `parts.tap.<thing>(arg)` does what a tap on it does, `parts.at.<thing>(arg)` is a point on it,
and `parts.rayTo(point)` the ray from the eye to it: `__ew.world.onTap(p.rayTo(p.at.knife()))` is a real tap,
`__ew.world.pointAt(...)` whether the hand shows. `tools/pv_taps_probe.py` walks every station's taps that
way in both labs (the hand, the step, the next prompt, a screenshot each).

## Shared with the room

In a room, everyone in the same lab shares its experiments (the user, 2026-10-30: the film and every panel
stay each one's own; "it is just about the state of the world objects"). Each part in `apparatus.js` and
`<Symbol>.js` that changes gives `state()` / `setState(s, live)`; `<Symbol>.js` lists them in `shared` and
calls `ctx.share(id)` after its own visitor changed one, from a tap or a panel's button; `room.js` returns them
(`src/net/shared.js`; `adding-a-wing.md`, "Shared with the room"). The words after an animation (the bowl's
flame and bang, the indicator's pink, the chip line's steps) are said only to whoever did it (`mine`). The oil
tin's state is `{ rods, n }` (rods taken out, slices off this one; an older `{ n }` is read as the rod it
left). A chip wafer's good and bad chips follow from its number, so every screen's wafer is the same; the
sliders (the wafer's tilt, the lump's turn, `hold` in its state) are shared at most every 0.15 s. Check:
`tools/shared_probe.py --world /e/Na/videos` (and `/e/Si/videos`); the taps and panel buttons it also does are
in `tools/shared_steps/pv.json` (`__ew.world.panels` has each station's panel).

Adding an element: watch its film (`tools/pv/pv.py`), write its brief, add its video and parts to
`videos.js` and `ROOMS`, write `<Symbol>.js` and its words (reuse the apparatus; add a part to
`apparatus.js` only when no existing one does the experiment; every step a tap on its thing, as above; every
part that changes goes in `shared`), add it to `STATIONS` in `room.js`, its entry in `WINGS` (`registry.js`)
and its title in the four locale files; add its stations to `tools/pv_taps_probe.py`.
