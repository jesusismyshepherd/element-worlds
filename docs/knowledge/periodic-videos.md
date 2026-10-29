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
  from its brief. Reached from the hall (the doorway board, `periodic-videos` in the studio).
- The screen by the door plays the element's video in YouTube's player (an iframe in the HUD's side
  sheet, or placed on the screen in 3D; both to be tried); each station's "Watch this part" starts it at
  the station's time. Credited and linked to periodicvideos.com.
- The kit, built once and reused: bench, fume cupboard, the courtyard bowl (all the alkali metals), flame
  colours (flame tests), fizz and bubbles, smoke, cracking along a crystal grid, liquid nitrogen, a Geiger
  counter, a magnet, a balance. Apparatus modelled in Blender where it beats code (the pokemon project's
  pipeline), effects in code because they answer the player.

## Order

The sodium room first, as the pilot the user looks at; then element by element together with the hall's
picture boards (`hall-boards.md`, "The other 116 halls"): one look at the video serves both.
