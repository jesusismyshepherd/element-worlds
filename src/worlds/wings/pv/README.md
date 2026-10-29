# The Periodic Videos rooms (`/e/<Symbol>/videos`)

An element's Periodic Videos film rebuilt as experiments to do, with the film beside them
(`docs/knowledge/periodic-videos.md`; what each film shows: `docs/pv/<Symbol>.md`). One module serves every
element that has a room; sodium's is the first (2026-10-30).

- `room.js`: `build(ctx, target)`: the room for `target.symbol`, the screen and its chapters, the arch back,
  the Atomling, and `panel(...)`, a station's panel with "Watch this part" (YouTube's player opens on top of
  the station's own words and buttons, at the moment that experiment starts).
- `lab.js`: the room every element shares: the lab (bench and fume cupboard west, the professor's corner
  east), the brick courtyard north with the red bench; `SPOTS` (where stations stand and where the visitor
  stands to use them; `face` points a part's +x at the visitor).
- `apparatus.js`: the parts and what they do: `oilTin`, `courtyardBowl` (any alkali metal: three lumps,
  skating, the flame, the bang, the indicator), `saltWindow`, `saltLamp`, `noteCard`, `videoScreen`.
- `fx.js`: `particles` (bubbles, sparks, smoke) and `flame`, shared by every room.
- `videos.js`: each element's video id, year, length, and where each station's part starts (`parts`, s);
  `ROOMS` lists the elements with a room. `pv.words.js`: the words every room shares.
- `<Symbol>.js` + `<Symbol>.words.js`: an element's stations (`stations(...)`, `chapters`, `COLOR`) and their
  words in four languages at both depths. `pv.test.js` checks the words' shapes and the video times.

Adding an element: watch its film (`tools/pv/pv.py`), write its brief, add its video and parts to
`videos.js` and `ROOMS`, write `<Symbol>.js` and its words (reuse the apparatus; add a part to
`apparatus.js` only when no existing one does the experiment), add it to `STATIONS` in `room.js`, its entry
in `WINGS` (`registry.js`) and its title in the four locale files.
