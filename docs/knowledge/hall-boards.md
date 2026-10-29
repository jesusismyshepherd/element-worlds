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

## Adding an element's boards

Write the seven stories in English first (each a context that makes you want to walk up: the element in
you, in nature, in space, in history, in things you use), translate them (`translating.md`), draw the seven
pictures (look at each one rendered, and at a contact sheet of all seven), then `npm test`,
`tools/halls_probe.py <Symbol>` and a look in the hall.
