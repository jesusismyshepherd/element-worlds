# The HUD keeps the middle free

The user's rule (2026-10-28, after trying the site on a phone): "the middle of the screen should be
always free to explore, and then all the prompts, labels, stories, everything should be somewhat around
it, so you can still navigate". Before, on a phone, the plaza's tools covered most of the table and
inside the halls the speech bubble and the story panels sat in the middle; and there was no way to go
full screen.

## The rule

- Everything the HUD shows hugs an edge: the top bar, docks and drawers at the bottom left, cards at
  the bottom right, side sheets on the right, sheets across the top of an upright phone. Nothing is
  centred on the screen, not even a celebration (the lab's and the forge's now show inside their card
  at the top).
- What opens to be read (a story panel, the quiz, the neon name window) is a side sheet in landscape and
  a top sheet on an upright phone (at most about 40 % of its height), never a box in the middle; the
  stick keeps working under it, and walking away from the exhibit closes the panel
  (`player.keepReading`). Another exhibit in reach is still offered beside it (on a touch screen the
  prompt stands left of the side sheet) and using it switches the panel (walking.md).
- Touch screens have the stick (bottom left) and the prompt by the right thumb (bottom right); no jump
  button since 2026-10-28 (the user: a museum floor needs none, and it crowded the screen).
- At rest the HUD covers under a third of the screen; with something opened to read, about half at most.
- Phones fold: the pages, the level and the language go into the ☰ menu; the plaza's tools become a
  dock of icons (one drawer open at a time, none at the start; the card and a drawer take turns at the
  bottom, the last one asked for is shown: a dock button opens its drawer over a selected element's
  card, a new pick brings the card back; until 2026-10-29 the card won and the dock seemed dead, the
  user's report); the walking worlds' view switch and "talk" move into the top bar; the
  Atomling's bubble waits while a panel is open.
- The Atomling's bubble (top left) stays until the player switches it off (the user, 2026-10-29: it went
  away by itself after 9 s): "talk" in the top bar switches it on and off (lit while it is on), the
  arrow inside the bubble (and T) tells the next thing. `tools/nav_probe.py --only talk` checks it.
- The plaza's card tells the Atomling's facts the same way, one at a time with arrows (Explorer).
- Three screen kinds (`useViewport` in `src/ui/layout.js`): a computer; an upright phone (`narrow`,
  under 640 px wide); a phone on its side (`short`, under 520 px tall). The lab and the forge have a
  layout for each (`side` in LabHud and ForgeHud is the phone on its side).

## The mechanism: covers and the view offset

- A HUD piece that covers part of an edge reports it: `useCover(ref, side, on)` (`src/ui/layout.js`)
  measures the element and tells `src/engine/covers.js` how far in from that edge it reaches. A world's
  own DOM window does the same with `setCover(coverId(), { side, size })` (`noble/nameOverlay.js`).
- The engine eases its camera's view offset (`camera.setViewOffset`) so the world's centre is drawn at
  the centre of the part left free (`engine.updateView`, `engine.view`). A panel opening on the right
  slides the exhibit to the left, beside it; the top bar alone moves the centre down by half its height.
  Picking still works: three's raycaster reads the projection with the offset.
- Worlds that frame something fit it into the free part: `engine.freeShare()` gives its share of the
  width and the height (the plaza's overview, the lab's molecule distance, the forge's atom distance).
  The overview fits with the probe camera's own offset cleared and the bounds scaled by the free share.
- `freeArea` never leaves the 3D less than a third of either side, whatever the covers say.
- Only pieces that really take an edge report: the hover card on a computer, the desktop's corner
  drawers and the speech bubble do not (they would make the view swim).
- `--bar` (a CSS variable on the page's root, kept measured by Hud.jsx) is how far down the top bar
  reaches; sheets start at `calc(var(--bar) + 0.25rem)`.

## Full screen

- A button in the top bar on every screen whose browser has full screen (`src/ui/fullscreen.js`).
- Touch screens go full screen by themselves at the end of the first touch (a browser grants it to a
  tap, and for a finger the tap counts on `pointerup`, not `pointerdown`), and again after the back
  gesture took it away; never after the player left it with the button (kept for the visit in
  sessionStorage), nor after two refusals. The arena on pokemon-site does the same
  (`src/games/arena/useFullscreen.js`).
- An iPhone's browser has no full screen for a page: the site added to the home screen opens without the
  browser's bars (`public/manifest.webmanifest` with `display: fullscreen`, the Apple meta tags in
  `index.html`, icons from `tools/make_icons.py`).

## Checking it

- `MSYS_NO_PATHCONV=1 py -3.11 tools/hud_probe.py` (dev server on 5310): six screens (a desktop, a
  laptop, an upright phone and a phone on its side, each phone also inside the browser's bars, 690 x 265
  being the user's screenshot) and ten scenes (the plaza at rest, with a card, a drawer, the quiz; a
  hall's panel and speech; a wing's panel; the lab with water made; the forge; the neon name window).
  It fails when a HUD piece lies in the middle of the free part (the stick in its corner excepted) or the HUD covers more than the scene allows. Screenshots in `tools/shots/hud/`;
  look at them too. About 4 minutes.
- `MSYS_NO_PATHCONV=1 py -3.11 tools/fullscreen_probe.py`: the first tap, the button off and on, a
  computer's click.
- On a real phone: `py -3.11 tools/phone.py` (pair once with Wireless debugging; then `shot` with steps
  and `frames`). A headless browser cannot tell the phone's frame times, its browser's own full screen
  or how a thumb reaches the controls.

## Traps

- Tailwind's `line-clamp-*` sets its own `display: -webkit-box`; a `block` class beside it wins and the
  clamp silently does nothing (the lab's fact ran to three lines on a phone on its side).
- A hook that measures an element must follow it when the layout swaps it for another (a phone
  turned): `useCover` runs after every render and re-observes when `ref.current` changed.
- A box that appears only after async data (the quiz's first question) cannot report its cover in
  time for a camera move made in the same tick: render the box at once, empty, so the overview that
  follows already fits beside it.
- Measuring "what is in the middle" must cut each element by the scrolling boxes round it: text
  scrolled out of a panel still has a rectangle in the middle of the screen.
- The page's own background (`#root`) is behind the 3D: a probe skips the canvas and what holds it.
