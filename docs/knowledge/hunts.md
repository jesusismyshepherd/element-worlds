# Treasure hunts (2026-11-09)

The studio's item `treasure-hunts` (`docs/studio/backlog.json`): "Hunts in order: each clue leads to the next
hall, board or exhibit, on a theme." Why: hunts turn everything already built into a game to play again,
alone or (later) as a team. From the item: themes (history, uses at home, records), difficulty from Explorer
clues to Scientist riddles, a long hunt left and picked up later (kept in the account too), built from what is
in the game so every answer can be found there, each clue a real place, the tests failing when a place a hunt
needs goes away; a few tracks first. Teams under a room code come later. It joins today's element
(`daily.md`): the same spirit, a reason to come back.

## What a player sees

- **The plaza's dock**: 🗺️ after today's element and the quiz ("Hunts", "Caça ao tesouro", "Poszukiwania",
  "Schatzsuche" beside it on a computer), a green dot while a hunt is on. `/?hunts` opens it too (the end of a
  hunt links there).
- **The sheet** (down the left side, across the top of an upright phone, like today's element): the clue of
  the hunt on with "Continue" and "Leave the hunt"; then the three tracks, each with what it is about, a mark
  per clue (the history track by its years), "Clue 3 of 7", "Finished 2 times", "Best time: 12 minutes", and
  Start, Continue or Play again. Starting closes the sheet.
- **The clue card**, in every world while a hunt is on: the track, a mark per clue, "Clue n of 7" (and the
  year on the history track), the riddle at the player's depth, where to look ("A picture on the wall of its
  hall: step into it", "A board in its hall: “What it is for”", the fact file, the specimen case, an arch),
  a hint button 30 s after the clue came (the family and the row of the table, never the name; the Explorer
  then gets a second one with the element and its place), "Leave the hunt". ▴ folds it to a chip (🗺️ 🏠 4/7).
- **A clue found**: a short sound, "Found it!" and what the place shows (one or two true sentences), then
  "The next clue". Only the clue to find now counts: the hunt goes in order.
- **The end**: "Hunt finished!", the last place's line, the time it took (counted only while the page was on
  show and touched in the last minute), "Your best time yet!" when it is, the badge the first time, Proverbs
  25:2 ("It is God's privilege to conceal things and the king's privilege to discover them", krypton's passage,
  quoted by its id `Kr`: `scripture.md`), "More hunts" and "Close".
- **The passport**: a badge per track (📜 Time traveller, 🏠 Home detective, 🥇 Record hunter).

## Where the card goes (`HuntCard.jsx`; `hud-layout.md`)

- Under the top bar at the right edge, `min(20rem, 28vw)` wide on a computer (on the plaza it stops short of
  the element's card at the bottom right), `min(15rem, 30vw)` on a phone on its side, across the top of an
  upright phone (`(100vh - bar) * 0.3` at most, so it stays out of the middle without reporting a cover).
- Beside a panel's side sheet on a computer it stands left of it (`min(15rem, 22vw)`).
- On a phone it takes turns with what else wants that edge, the last one asked for shown: a panel (it waits as
  a chip and shows the clue found when the panel closes), the Atomling's bubble across an upright phone (a new
  line folds the card; a clue just found clears the bubble instead), a plaza sheet over the top, the plaza's
  element card (a new pick folds the card; unfolding it hides the element's card, the cube stays picked:
  `PlazaHud.jsx` `huntCardUp`). Tapping the chip closes what held its place.
- The chip waits under the bar at the right (left of a side sheet), by the stick's top on an upright phone's
  walking worlds, and in the top bar in the lab and the forges, whose own panels fill every edge: there the
  card stays folded until asked for.
- The plaza's sheet in the store (`plazaSheet`: 'daily', 'quiz', 'hunts') tells the card which sheet is open.

## The tracks (`src/game/hunts.js`, words in `src/content/hunts.js`)

A clue is `{ id, w, panel? }`: `w` a world as the store and telemetry key it (`atrium:Na`, `wing:C:allotropes`,
`lab`), `panel` an exhibit there as its panel's `panelFrom` says (`board:<id>`, `facts`, `look`, a station's id).

| Discoverers (in order of time) | place | Explorer riddle (English) |
|---|---|---|
| c. 1323 BC | iron, the picture `meteorite` | a pharaoh's dagger of metal that fell from the sky (nails, red blood) |
| 1766 | hydrogen, `cavendish` | the shy scientist's bubbles that went pop; his fire that makes water |
| 1774 | oxygen's fact file | a red powder heated with sunlight through a lens; who, and who in Sweden |
| 1807 | sodium, `davy` | shiny beads of a new metal pulled from caustic soda by a huge battery |
| 1898 | krypton, `hidden` | the gas hiding in the last drops of liquid air ("hidden") |
| 1949 | carbon, `clock` | the clock in every bone, log and mummy |
| 1971 | silicon, `valley` | the valley of fruit trees renamed after the element in every chip |

| At home | place | |
|---|---|---|
| breakfast | iron, `cereal` | a magnet pulls black specks of metal from cereal |
| the table | sodium, `salt` | the salt shaker: one of salt's two elements is a soft metal |
| the kitchen | aluminium's station "What it is for" | the foil round your sandwich and your drink's can |
| the oven | silicon, `silicone` | the bendy cake mould ("put an e on the end") |
| the desk | carbon, `twins` | the pencil's secret twin, a diamond |
| the window | krypton, `windows` | the invisible gas between the panes |
| the bathroom | fluorine's station "What it is for" | toothpaste (and non-stick pans) |

| Records (from Z = 1 to Z = 118) | place | |
|---|---|---|
| the lightest, the first | hydrogen, `bigbang` | the very first atoms after the Big Bang |
| the coldest boiling point | helium's station "At room temperature" | boils at about −269 °C (party balloons) |
| the hardest | carbon's gallery `wing:C:allotropes` | the hardest natural material, beside its soft grey twin |
| the most of you and of the crust | oxygen's fact file | two thirds of your weight, almost half of the rocks |
| the densest | osmium's station "At room temperature" | a 10 cm cube of 22.6 kg, twice lead's |
| the liquid metal | mercury's specimen case (`look`) | a metal you can pour (old thermometers) |
| the heaviest made | oganesson's "Identity card" | 118 protons, a handful ever made |

Riddles name the thing, never the element; Explorer ones end with a nudge ("A nudge:", "Um empurrãozinho:",
"Mała pomoc:", "Kleiner Schubs:", a word unlike the hint button's), Scientist ones carry a date, a number or a
term. The found lines repeat what the place itself says (the boards, the elements' own words, the data).

### Facts checked, and the doubtful ones

- Osmium 22.59 g/cm³ against iridium 22.56 (`elements.json`): said as "ahead by a hair", from densities
  worked out from their crystals; nothing more than the data supports.
- Mercury: "the only metal anyone has seen liquid at room temperature" (Explorer); the Scientist line adds
  caesium 28.44 °C and gallium 29.76 °C (melting just above it) and copernicium and flerovium, predicted
  liquids of which only a few atoms were ever made (both marked liquid, predicted, in the data).
- Helium: boils at 4.22 K, never solidifies at 1 atm (only above about 25 atm), superfluid below 2.17 K.
- Oganesson: "the heaviest element made", 118 protons; the first atom in 2002, announced 2006, credited
  2015; Og-294 about 0.7 ms; its bulk properties (a solid, melting near 325 K) said as predictions.
- Tutankhamun: buried in the 14th century BC; the card's year says "c. 1323 BC", his death's usual date
  (uncertain by a few years). The dagger's 10.8% nickel and 0.58% cobalt: Comelli and colleagues, 2016.
- Radiocarbon: "1949" for Libby's first dates (Arnold and Libby, Science, 1949), his Nobel 1960; the
  half-life 5730 years is today's value (Libby used 5568), so no riddle ties 5730 to him.
- The first atoms: the hydrogen board's own words ("almost all of them were hydrogen", by number about 92%
  of nuclei). Strictly, helium caught its electrons a little earlier than hydrogen did; the line follows
  the board.
- Priestley's red powder in the Scientist riddle is "mercurius calcinatus, the red calx of mercury" in
  every language: Polish "tlenek" (oxide) carries "tlen", oxygen's own name, and the test caught it.

## How it works

- **Completion (`hunts.js`, pure)**: `placeOf(store)` is `{ w, panel }` (the panel's exhibit only while a
  panel is open: a closed panel leaves its `panelFrom` in the store) or null during a fade; `keysOfTarget`
  and `keysOfPlace` turn both into keys; a target with no exhibit is reached anywhere in its world. A
  picture is reached by stepping into it: since 2026-10-31 every picture is a door to its room
  (`picture-rooms.md`), so `board:<id>` in a hall is also reached by the room `wing:<S>:<pictureRoomId>`
  (oxygen's fire picture is `fire-picture`). `advance(state, place, now)` moves only the clue to find now.
- **The watcher (`useHunts.js`)** follows the store like telemetry does, so no world knows about hunts: each
  change schedules one check 150 ms later (a panel's exhibit is set a frame after the panel itself, by
  `player.keepReading`; checking at once read the exhibit before it), and the same place counts once.
- **The state**, kept as the player's own state of the pseudo-world `/hunts` (`keepWorldState`, so
  `ew-world:/hunts` on the device and the account's `worlds` with no server change: a world's state in name
  only, no page is there): `{ on, at, tracks: { <id>: { step, at, start, spent, done, best, last } } }`.
  The account keeps each world's state whole, the newer by its `at` (`ew_save_progress`); when the
  account's comes in (`onRestore`) the device joins it with its own track by track (`mergeHunts`: the newer
  of each track, finishes and best times never lost) and keeps the result, which goes up at the next save. A
  sign-out empties it. A clue found asks the account to save at once (`account.save()`).
- **Hints**: `hintsOf(clue, level)`: the family and the period (the HUD lowercases the family name except in
  German); the Explorer's second names the element (`nameInText`: Portuguese with its article) and its place,
  the picture's title from the boards file, a station's from `stations.js`, a wing's from the locale.
- **The words** load with the hunts' HUD on demand (`content/hunts.js` is its own chunk, about 75 kB).

## Recording (`usage-data.md`)

`huntopen` `{ on }` (the dock's button) and `hunt` `{ op, id, step }`: `start`, `clue` (found), `done`
(`ms`, its time), `stop`, `hint` (`n`). The family dashboard lists "the treasure hunts" among the things to
use (`FEATURES` in `src/stats/analyze.js`).

## Checking

- `npm test`: `src/game/hunts.test.js`: three tracks of six or seven clues, no two in a row in one world, none
  first on the plaza, the history track in order of years; every place in the game (the element, the
  picture in `src/content/boards/<S>.js`, the fact file only in a hall with pictures, a station only in one
  without, read from `stations.js`, a wing in `registry.js`), every text in four languages at both depths
  without dashes, no riddle giving its element away (the quiz's `mask`: names declined and in compounds,
  symbols), the locale blocks and badges, and the logic (places, keys, rooms, hints, a whole track in order
  with its time, leaving and coming back, the kept state made safe, two devices joined).
- `py -3.11 tools/hunt_probe.py --port 5329` (through the machine's lock, `heavy.py hunts -- ...`): every
  track played on a computer in English, "At home" on an upright phone in Polish, "Records" begun on a phone
  on its side in German, as a player plays (the hall by its address, the walker in front of the exhibit, E):
  the card moving on, the hints, a reload in the middle, leaving and taking up again, the end, the passport's
  badges, the chip in the lab's bar. Screenshots in `tools/shots/hunts/`. 2026-11-09: all green.
- `MSYS_NO_PATHCONV=1 py -3.11 tools/hud_probe.py --scene hunt` (`plaza-hunts`, `hall-hunt`, `forge-hunt`, last
  in the list: the hunt started stays on in that screen's later scenes) and `--scene plaza`.

## Traps

- `panelFrom` lags its panel by a frame and stays after the panel closes: read the place a moment after the
  store settles, and only with a panel open.
- A hall with pictures has no stations on its walls (they are in the fact file); a hall without has no fact
  file. The test knows which is which.
- On a 360 px phone the plaza's dock now takes two rows in every language (it did in Portuguese before): the
  element's card stands on the dock's measured height, so nothing overlaps.
- On the smallest phone on its side (690 x 265) the forge alone covers its 50%; the chip in its bar adds about
  1% (`forge-hunt` allows 52%).
- On an upright phone a hall's greeting (0.9 s after arriving) folds the card: a probe taps the chip.

## Next

Teams under a room code (the item's second half), more tracks (colours: the flame tests and the neon signs;
the Atomlings' homes; the forges), a passage of its own instead of krypton's.
