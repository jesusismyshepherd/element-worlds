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

## Doorways (2026-10-30)

The user: the Periodic Videos lab is entered through one of the hall's boards, like stepping into a
picture, and other such themes will join it there; the arches at the gates stay for the wings (carbon's
and oxygen's kind). A board entry `{ id: 'doors', color, doors: ['videos'] }` in `boards/<Symbol>.js` is a
doorway board (`src/worlds/atrium/doors.js`): each door is a wing in `WINGS` marked `board: true` (no arch,
still its address `/e/<Symbol>/<id>`), drawn on the board (`ART` per kind of door; one door fills it, more
share it as tiles and E asks which). E: "Step in": the view dives into the picture (`player.dive`), then
the place opens; coming back you stand in front of the board, facing the hall. Doorway boards count as
one of the seven boards and are no discovery of their own (the place behind has its own).

Picture rooms (Artur, 2026-10-30, on first seeing the boards: "how can I get inside these pictures?"): a
picture with a scene file behind it says "Step in" and dives into its own room, the picture's story on an
easel inside (`picture-rooms.md`). The user's rule: no picture without its room; silicon's `diatoms` was
the first.

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
liquid oxygen boiling in a flask with cold fog over the rim and a magnet holding a drop of it, Sodium
(2026-10-30) lumps kept under oil in a capped jar, and on a tile with filter paper a piece just cut, its
silver face beside the dull grey crust, the slice that came off it and the knife (`cutLump`: a lump cut
flat by a plane, the face its own material), Silicon (2026-10-30) a broken lump of polycrystalline
silicon whose grains flash as the table turns, a single-crystal boule lying in a cradle (shoulder, seed
neck, four faint growth ridges, its sawn end polished) and a wafer sliced from it standing in a holder
(`siliconChunk`, `siliconMatcap`).

Traps met:
- Glass: a transmissive (`transmission`) glass does not show transparent things inside it (the liquid
  vanished), and a transparent physical glass reflects the bright hall over all of it (a milky fog over
  the sample). `edgeGlass` (`src/worlds/common/props.js`) is clear face-on and shows at its edges only:
  use it for cases, flasks and jars.
- A diamond with real refraction showed the bright hall behind it (a white funnel): it is a cut gem whose
  facets each have their own shade of white and ice blue (vertex colours, flat shading), with glints.
- Random bumps per corner make a crumpled polyhedron; a rounded rock is a sphere pushed by smooth waves
  (`lump` in showpieces.js).
- Look at a case from where a visitor stands (`teleport(-3.2, 3.15, 0.38, -0.2)` in first person; closer,
  `teleport(-3.35, 1.75, 0.68, -0.32)`, a few shots some seconds apart as the table turns).
- The case's lamp and the hall's bloom light a sample two or three times brighter than its colour: pale
  things (sodium's grey-white crust, a white tile) came out as white blobs. Give a showpiece dark colours
  (Carbon's coal is near black; sodium's crust is #414449) and judge them in the case.
- A bare metal face (metalness, low roughness) only mirrors the pink hall, so it does not read as silver:
  sodium's cut face carries a drawn silver (bands of light and shade on a canvas, a little emissive), as
  the diamond's facets carry their shades.
- A visitor looks at the table from the side: a face lying on top shows edge-on. Turn what must be seen
  outwards, two such things opposite ways, so one faces you whichever way the table has turned.
- Polished metal over a whole shape (silicon's lump and boule): a drawn matcap (`MeshMatcapMaterial`, a
  canvas of a blue-grey sphere with a few small bright windows) mirrors nothing, needs no light and is not
  blown out by the case's lamp; with `flatShading` each facet shows the shade its angle gives it, so the
  facets flash one by one as the table turns (glitter for free). Vertex colours per grain multiply it.
- A rock from a sphere of even triangles (an icosphere of detail 3) read as a geodesic ball: detail 4,
  finer waves on top of the broad ones, stretched unevenly and broken flat by a few planes, reads as a
  broken chunk. Shape the bumps as functions of the direction, never per corner (a non-indexed sphere
  has each corner several times; per-corner noise tears the faces apart).
- A tall thing standing in the case (silicon's boule) read as a bottle and hid the rest from a visitor's
  eye height: lay it down.

## Adding an element's boards

Write the seven stories in English first (each a context that makes you want to walk up: the element in
you, in nature, in space, in history, in things you use), translate them (`translating.md`), draw the seven
pictures (look at each one rendered, and at a contact sheet of all seven), then `npm test`,
`tools/halls_probe.py <Symbol>` and a look in the hall. Each picture comes with its room (the user,
2026-10-30: a picture on a wall always means you can step in): design the picture and its room together
(`picture-rooms.md`).

The pipeline since hydrogen and iron (2026-10-31), so a hall never shows a picture without its room:
1. One agent per element (`docs/agents/hall-boards-brief.md`): the seven stories, pictures and the
   showpiece on its own branch, plus a room design per picture in the scratchpad (`<Symbol>_rooms.md`).
2. Seven room builders (`docs/agents/picture-room-brief.md`, one file per room, a short prompt pointing
   to it), each merging the boards branch into its worktree first, then building its room from the design.
3. The session merges the boards branch and the seven rooms into main together, reviews each room's
   shots, adds the steps (`tools/shared_steps/pictures.json`) and the docs, and pushes.
Two elements at a time keep the machine's memory in hand (seven room builders and two more agents ran
with about 8 GB free).

Pictures since sodium: one script per board in `tools/boards/<Symbol>/`, all drawn with the shared kit
`tools/boards/lib/style.py` (`tools/boards/README.md`); `py -3.11 tools/boards/lib/render.py <Symbol>`
renders them and a contact sheet with the titles on the caption band. Traps met with sodium's:
- The hall's bloom (threshold 0.78) makes any large near-white area glow on the wall (a whole nerve went
  white, the salt pans' crust washed out): keep big pale areas a little under it (#f0c4d8, #c8e8e2);
  small white highlights and sparkles may glow.
- A charge drawn as a small white badge beside an ion read as an eye: the sign goes on the ball (`ion`).
- A doorway board takes one of the seven places, so an element with a doorway has six pictures.

## The other 116 halls (the user approved them on 2026-10-29)

The user loved Carbon's and Oxygen's halls: "the others can now follow". The plan (the studio's item
`halls-116`, right after the Periodic Videos screens, `periodic-videos`):
- Order: the other 38 elements of the quiz's Explorer list (`KID_POOL` in `src/game/quiz.js`), in the
  order the family dashboard shows their halls are visited (`/stats`, `usage-data.md`), five or six to a
  batch; then the rest family by family.
- Per element, as above, together with its Periodic Videos room (`periodic-videos.md`). Research notes:
  the element's story in `src/content/`, its Periodic Videos
  video (retold in the game's own words, never copied), every number from `elements.json`. The
  well-known ones get a showpiece of their own (`showpieces.js`); the rest keep the case's samples.
- One style for every hall's pictures: the shared module `tools/boards/lib/` (started on 2026-10-30 from
  Carbon's `lib.py` and Oxygen's `kit.py`, which stay as they are), so the halls read as one series.
- Done: Sodium (2026-10-30): its Periodic Videos doorway and six pictures (`nerves` your nerves fire with
  sodium and the sodium-potassium pump; `salt` why the sea is salty and Aveiro's salt pans; `davy` Davy's
  1807 electrolysis; `lamps` the low-pressure sodium street lamp, one street in its light and in white
  light; `space` the sodium layer 90 km up, laser guide stars, Hale-Bopp's sodium tail; `kitchen` baking
  soda and a rising cake), none repeating the lab (cutting, water, the salt window, the salt lamp); its
  showpiece above.
- Done: Silicon (2026-10-30): its doorway and six pictures (`diatoms` the glass houses of diatoms, a fifth
  of Earth's oxygen, Nobel's kieselguhr, nettles' silica tips; `solar` the p-n junction, Bell Labs 1954,
  Vanguard 1; `glass` sand to glass, why it is clear, optical fibres; `earth` the mantle's olivine and
  bridgmanite, Hawaii's green sand, Apollo's 382 kg, silicon made in stars; `valley` Berzelius's brown
  powder, the orchards that became Silicon Valley, Hoefler 1971, the Intel 4004; `silicone` the bendy
  muffin tray, PDMS, Kipping's misnomer, bouncing putty), none repeating the lab (the lump and sand, the
  chip line, the wafer's rainbow, the turbocharger, the minerals); its showpiece above. Trap: a title over
  about 37 characters wraps on the band and can leave one word alone on the second line ("of?", "vidro?");
  keep titles under that where the language allows (the test still allows 44).
- Done: Hydrogen (2026-10-31): seven pictures, no doorway yet (no wing, no Periodic Videos room), each with
  a room designed for it and built on top by other agents (`bigbang` the first atoms, 380,000 years after
  the Big Bang, Penzias and Wilson's hiss; `airship` Charles's balloon of 1783, lift per cubic metre, why
  airships went to helium after the Hindenburg; `bond` the pond skater and the hydrogen bond; `fuel` the
  Shuttle's hydrogen and the fuel cell, Apollo's drinking water, the iLint train; `cavendish` inflammable air
  in 1766, the 1781 spark globe, Lavoisier's name; `jupiter` metallic hydrogen and Jupiter's magnet, the
  Galileo probe; `radio` the 21 cm line, the hydrogen map of the Milky Way, the Pioneer plaque), none
  repeating oxygen's water room, the Atom Forge or the Star Forge. Its showpiece: a spectrum tube in its stand
  glowing pink-violet and a red balloon tugging its string from a brass weight (`hydrogen` in showpieces.js;
  the case's words in `appearance.js` say it glows in a tube). The pictures share `tools/boards/H/hkit.py`
  (atoms as models in the Atom Forge's colours, water molecules that report their hydrogens for drawing
  hydrogen bonds). Trap: the kit already defines `url(#b<El>)` for every ball, so a gradient of your own
  named `bP` or `bN` silently takes phosphorus's orange or nitrogen's blue (the first definition wins):
  name your own gradients apart (`pP`, `pN`).
- After each batch: the studio (the item's details say how far it got; `built` gets a line), a line in
  `docs/history.md`, commit and push, so each batch goes live when it is done.
