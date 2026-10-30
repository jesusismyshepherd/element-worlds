# The Periodic Videos rooms (`/e/<Symbol>/videos`)

An element's Periodic Videos film rebuilt as experiments to do, with the film beside them, entered through a
doorway board in the element's hall
(`docs/knowledge/periodic-videos.md`; what each film shows: `docs/pv/<Symbol>.md`). One module serves every
element that has a room; sodium's is the first, silicon's the second (2026-10-30).

- `room.js`: `build(ctx, target)`: the room for `target.symbol`, the screen and its chapters, the arch back,
  the Atomling, and `panel(...)`, a station's panel with "Watch this part" (YouTube's player opens on top of
  the station's own words and buttons, at the moment that experiment starts).
- `lab.js`: the room every element shares: the lab (bench and fume cupboard west, the professor's corner
  east), the brick courtyard north with the red bench; `SPOTS` (where stations stand and where the visitor
  stands to use them; `face` points a part's +x at the visitor).
- `apparatus.js`: the parts and what they do: `oilTin`, `courtyardBowl` (any alkali metal: three lumps,
  skating, the flame, the bang, the indicator), `saltWindow`, `saltLamp`, `noteCard`, `videoScreen`.
- `fx.js`: `particles` (bubbles, sparks, smoke) and `flame`, shared by every room.
- `professor.js`: the professor in his corner (his lines: `prof` in the element's words, their times in
  `videos.js`); `room.js` gives him a panel with "Watch him say it" and "Next".
- `videos.js`: each element's video id, year, length, and where each station's part starts (`parts`, s);
  `ROOMS` lists the elements with a room. `pv.words.js`: the words every room shares.
- `<Symbol>.js` + `<Symbol>.words.js`: an element's stations (`stations(...)`, `chapters`, `COLOR`) and their
  words in four languages at both depths. `pv.test.js` checks the words' shapes and the video times.

In a room, everyone in the same lab shares its experiments (the user, 2026-10-30: the film and every panel
stay each one's own; "it is just about the state of the world objects"). Each part in `apparatus.js` and
`<Symbol>.js` that changes gives `state()` / `setState(s, live)`; `<Symbol>.js` lists them in `shared` and
calls `ctx.share(id)` after its own visitor changed one, from a panel's button too; `room.js` returns them
(`src/net/shared.js`; `adding-a-wing.md`, "Shared with the room"). The words after an animation (the bowl's
flame and bang, the chip line's steps) are said only to whoever did it (`mine`). A chip wafer's good and bad
chips follow from its number, so every screen's wafer is the same; the wafer's tilt slider is shared at most
every 0.15 s. Check: `tools/shared_probe.py --world /e/Na/videos` (and `/e/Si/videos`); the panel buttons it
also presses are in `tools/shared_steps/pv.json` (`__ew.world.panels` has each station's panel).

Adding an element: watch its film (`tools/pv/pv.py`), write its brief, add its video and parts to
`videos.js` and `ROOMS`, write `<Symbol>.js` and its words (reuse the apparatus; add a part to
`apparatus.js` only when no existing one does the experiment; every part that changes goes in `shared`, as
above), add it to `STATIONS` in `room.js`, its entry
in `WINGS` (`registry.js`) and its title in the four locale files.
