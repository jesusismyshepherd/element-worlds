# The halls' picture boards (2026-10-29; Carbon and Oxygen first)

The user, looking at a hall: "pretty boring, all the info on these generic blackboards could be on one of
them as the facts and the other could be some picture or colorful pictographics exciting the interest to
approach and learn more about the atom in various contexts ... start with carbon and oxygen and let me see
the results."

## What a hall with boards has

- The fact file ("Fact file", "Ficha técnica", "Metryczka", "Steckbrief"), beside the way out, on the right
  as you face the door (`FACT_SPOT`, the user's choice, 2026-10-29). Its face is drawn from the data
  (`src/worlds/atrium/factFile.js`, so any element has one): the element's tile, its atom with every
  shell and electron and a nucleus of protons and neutrons, "6 p⁺ · 6 n · 6 e⁻", the family and state
  as chips, and four tiles with an icon each (melts, boils, density, discovered). Its panel holds
  everything the eight stations told, one section each (`{ h }` headings), at the visitor's depth.
  A colour emoji drawn on a canvas takes the fill's transparency: set an opaque fill before it.
- Seven picture boards on the other spots (`BOARD_SPOTS` in `atrium.js`: the first beside the north arch,
  then the east wall, the west wall, north left, the way out's other side). Each is a picture in a frame glowing in its own colour
  that breathes until the board is read (then gold), with a hook question on a dark band over its bottom.
  E ("Explore: ...") opens its story: the picture again, two short paragraphs (Explorer or Scientist), and
  a link to the wing it belongs to.
- The discoveries counter counts the fact file, the seven pictures and the specimen case.
- Elements without boards keep the eight text stations (`stationsOf`).

## Where things are

- Texts: `src/content/boards/<Symbol>.js` (id, colour, optional wing, title and story in en, pt-pt, pl,
  de). `boards.test.js` checks seven boards, a picture for each, all four languages, as many paragraphs
  as English, titles of at most 44 characters (the band has room for two short lines).
- Pictures: `public/boards/<Symbol>/<id>.svg`, 1200 x 800, no words (the title is drawn in the visitor's
  language), the board's colour blended into the hall's navy, atoms in CPK colours, the bottom 22% calm
  (the caption band covers it). Flat, bold, colourful, readable from 5 m.
- Code: `pictureBoard` in `src/worlds/common/props.js`; `loadBoards`, `boardArt` in
  `src/content/boards/index.js`; the hall in `src/worlds/atrium/atrium.js` (`boards`).

## The specimen case (2026-10-29)

The user: the case "could be something more substantial or representative", its samples "often generic
polyhedra". Every hall now has a museum showcase (`src/worlds/atrium/specimen.js`): a stepped plinth
ringed in the family's colour, a brass name plate wrapped round the column (as long as the name needs, the
name curved with it: troika's curveRadius), a turning table, a lamp in the lid of a tall glass
case. The generic samples: metals as three cast ingots (the top one stamped with the symbol) and a
nugget; crystals as pointed six-sided crystals growing from a rock; liquids in a flask, gases in a jar,
noble gases as a glowing tube, superheavies as a question mark, each at the size that fits the case.
An element can have its own showpiece (`src/worlds/atrium/showpieces.js`, `SHOWPIECES`): Carbon shows its
three faces (a cut diamond over a stack of graphite flakes whose top one slips, and a lump of coal), Oxygen
liquid oxygen boiling in a flask with cold fog over the rim and a magnet holding a drop of it.

Traps met:
- Glass: a transmissive (`transmission`) glass does not show transparent things inside it (the liquid
  vanished), and a transparent physical glass reflects the bright hall over all of it (a milky fog over
  the sample). `edgeGlass` (`src/worlds/common/props.js`) is clear face-on and shows at its edges only:
  use it for cases, flasks and jars.
- A diamond with real refraction showed the bright hall behind it (a white funnel): it is a cut gem whose
  facets each have their own shade of white and ice blue (vertex colours, flat shading), with glints.
- Random bumps per corner make a crumpled polyhedron; a rounded rock is a sphere pushed by smooth waves
  (`lump` in showpieces.js).
- Look at a case from where a visitor stands (`teleport(-3.2, 3.15, 0.38, -0.2)` in first person).

## Adding an element's boards

Write the seven stories in English first (each a context that makes you want to walk up: the element in
you, in nature, in space, in history, in things you use), translate them (`translating.md`), draw the seven
pictures (look at each one rendered, and at a contact sheet of all seven), then `npm test`,
`tools/halls_probe.py <Symbol>` and a look in the hall.

## The other 116 halls (the user approved them on 2026-10-29)

The user loved Carbon's and Oxygen's halls: "the others can now follow". The plan (the studio's item
`halls-116`, right after the Periodic Videos screens, `periodic-videos`):
- Order: the other 38 elements of the quiz's Explorer list (`KID_POOL` in `src/game/quiz.js`), in the
  order the family dashboard shows their halls are visited (`/stats`, `usage-data.md`), five or six to a
  batch; then the rest family by family.
- Per element, as above. Research notes: the element's story in `src/content/`, its Periodic Videos
  video (retold in the game's own words, never copied), every number from `elements.json`. The
  well-known ones get a showpiece of their own (`showpieces.js`); the rest keep the case's samples.
- One style for every hall's pictures: start a shared module (`tools/boards/lib/`) from Carbon's
  `lib.py` and Oxygen's `kit.py` instead of a new one per element, so the halls read as one series.
- After each batch: the studio (the item's details say how far it got; `built` gets a line), a line in
  `docs/history.md`, commit and push, so each batch goes live when it is done.
