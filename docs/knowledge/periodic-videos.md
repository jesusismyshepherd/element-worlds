# Periodic Videos rooms

The user (2026-10-29, sharpened 2026-10-30): every element's video from Periodic Videos (Brady Haran with
Professor Sir Martyn Poliakoff and colleagues, University of Nottingham; playlist
https://www.youtube.com/playlist?list=PL7A1F4CF36C085DE1, one video per element, 118) carries experiments
and demonstrations. Each element gets a **Periodic Videos room** where those experiments are rebuilt as
things the player does, with the video beside them: watch to understand, then do it yourself, and go back
to the video for what you are doing and learning. Claude has to see each video to design them (the
captions alone do not say what the apparatus looks like or what happens).

## Seeing a video

`py -3.11 tools/pv/pv.py list` (the playlist, once), `fetch <Symbol>` (the video at 480p and its English
captions), then three looks, because one is not enough (the user asked, 2026-10-30, whether a frame
every 4 s misses things; it did):
- `cuts <Symbol>`: every hard cut at its exact time, however short the shot: where a station's part
  starts. It does not see fades (sodium's lab, title card and professor blend into each other).
- `sheets <Symbol>` (a frame every 2 s, with `transcript.txt`, the captions with times): the fades, the
  change within a shot, what is said when.
- `zoom <Symbol> <from> <to> --fps 4`: the moments an exhibit copies, frame by frame. Sodium's bang is
  0.3 s long (3:50.5): the 4 s grid showed only the smoke before and after it.
"Watch this part" starts where the part starts: a cut or a fade, checked against the captions so it
never starts mid-sentence.

- Everything goes to `D:/Family/Artur/pv-cache` (`PV_CACHE`), outside the repository: the videos are
  Periodic Videos' own, kept on this computer only for designing the game's versions (the user asked for
  this; YouTube's terms do not generally allow downloading, so nothing from the cache is ever committed,
  published or shown in the game). Players watch the videos through YouTube's own player.
- Captions: ask for `en` only; a pattern such as `en.*` requests every auto-translation and YouTube
  answers HTTP 429 (2026-10-30).

## A brief per element

`docs/pv/<Symbol>.md` (the first: `Na.md`, 2026-10-30): the video's link and length; a table of what it
shows with times, in our own words (never its transcript); then the room: each station with what the
player does, the science at both depths, its "Watch this part" time, what is modelled and what is an
effect in code; and the game's own additions marked as such. Numbers from `elements.json` (the video's
spoken numbers are often rounded). Dangerous experiments carry the video's own warning: never at home.

## The room

- One shared module (like the neon sign workshop): a corner of a chemistry department (a lab bench, a
  fume cupboard, a door to a brick courtyard, the professor's desk) dressed per element, with the stations
  from its brief. Reached through the hall's doorway board (`atrium/doors.js`, `hall-boards.md` "Doorways"), not an arch:
  the arches are for the wings (the user, 2026-10-30).
- The screen by the door plays the element's video in YouTube's player (an iframe in the HUD's side
  sheet, or placed on the screen in 3D; both to be tried); each station's "Watch this part" starts it at
  the station's time. Credited and linked to periodicvideos.com.
- The kit, built once and reused: bench, fume cupboard, the courtyard bowl (all the alkali metals), flame
  colours (flame tests), fizz and bubbles, smoke, cracking along a crystal grid, liquid nitrogen, a Geiger
  counter, a magnet, a balance. Apparatus modelled in Blender where it beats code (the pokemon project's
  pipeline), effects in code because they answer the player.

## Built: sodium's room (2026-10-30)

`/e/Na/videos` (`src/worlds/wings/pv/`, its README): the oil tin (lift the rod, cut, the fresh face shines
and dulls in seconds), the courtyard bowl (small, medium, large lumps; the bead skates on its fizz, the
hydrogen lights after a wait, the large one bangs and throws a molten bead onto the bench; the indicator
turns the alkaline water pink), the salt window (cracks at right angles, the cubic lattice rising out of
it), the salt lamp, the professor's card, the screen with the whole film and a chapter per experiment.
Each station's panel has "Watch this part" (the bowl also "the big one", 3:26). A new panel block,
`{ video }` (`Panel.jsx`), holds YouTube's player and keeps playing while the panel is written again;
`{ href }` opens a page outside. Sounds `fizz`, `pop`, `bang`, `crack` (`audio/sound.js`).

Traps met building it:
- Light: a pale lab under a hemisphere light, the environment and point lights washed out to white; the
  room needs coloured walls and floor and modest light (hemisphere 0.7, points 3.5, `envIntensity` 0.4).
- A flame's own point light and an HDR sprite turn a cream bowl into a white blur: keep the flame's light
  under 1 and the sprite's colour at about 1.3; a flash for a bang at 10, not 40 (all white).
- Timing in a probe: the headless browser draws slowly and the engine caps a frame's step, so the game's
  clock runs behind the wall clock and fixed waits miss a 0.3 s event. Wait for the state instead:
  `js:new Promise(r => { const i = setInterval(() => { if (!__ew.world.parts.bowl.busy) { clearInterval(i), r() } }, 10) })`
  then `shot:` (no semicolons inside a step).
- Headless Edge shows YouTube's player black: check the embed with `yt-dlp -J` (`playable_in_embed`)
  and look at the real thing on a phone or a computer.
- The apparatus face +x; a spot's `face` is the turn that points +x at the visitor (rotation.y takes +x
  to (cos, 0, -sin)).

## Built: silicon's room (2026-10-30)

The second element, chosen by the family dashboard (after Oxygen, Silicon's hall is the most visited).
`/e/Si/videos` (`Si.js`, `docs/pv/Si.md`): the lump (out of its bottle onto a turntable, its grains glinting:
a glint per facet, bright when the facet mirrors the lamp into the eye), the chip line (cut, test green or
red, sort into the computer and the bin; a 20 or 30 cm wafer), the wafer and its rainbow (a grating shader:
the colour leaving toward the eye depends on the light's and the eye's angles along the wafer; a tilt slider
and "Turn it over" to its mirror back), the turbocharger (steel and silicon nitride wheels on one push: the
lighter spins up first, dials show it), the minerals (quartz, mica, feldspar, garnet). The professor's seven
lines are his, from the film. Traps: an instanced mesh first drawn with no instances keeps an empty bounding
sphere and is culled for good (`frustumCulled = false`); things lying flat on a bench are seen edge-on from
a visitor's eyes: tilt them toward the visitor like a display stand.

## The professor (2026-10-30)

The user asked for the professor himself, to talk to. `pv/professor.js`: a friendly figure in the game's
rounded style (the white hair, glasses, striped shirt, a tie of little coloured squares) in his corner; he
turns his head to the visitor and gestures as he talks. What he says comes from the element's film only:
each line retold in the game's words, in his voice, with "Watch him say it" at the moment he says it
(`prof` in `<Symbol>.words.js`, the times in `videos.js` `prof`). He is a real person: the game puts no
words of its own in his mouth; facts the film does not have stay with the Atomling. Lines from his other
films can join when they are watched.

## Order

The sodium room first, as the pilot the user looks at; then element by element together with the hall's
picture boards (`hall-boards.md`, "The other 116 halls"): one look at the video serves both.
