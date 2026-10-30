# What was built, when, and why

The project's log, newest first; moved out of `CLAUDE.md` on 2026-10-29 so every session does not load
it. How each piece works is in its area's doc (`docs/knowledge/`); this file keeps the order of events
and the user's requests behind them. Add a line here when a piece of work changes what the game has.

## 2026-10-30

- Periodic Videos rooms (the user: each video's experiments become things to do, the video beside
  them): `tools/pv/pv.py` lets Claude watch a film (every cut at its exact time, a frame every 2 s, zooms;
  the user asked whether a frame every 4 s was enough: it missed sodium's 0.3 s bang), and sodium's room
  is the pilot (`/e/Na/videos`: the oil tin, the courtyard bowl, the salt window, the salt lamp, the
  professor's card, the film with "Watch this part"; `periodic-videos.md`).

- Sodium's lab is entered through a doorway board in its hall (stepping into the picture), no longer an
  arch: the arches are for the wings (the user). Using a station in third person looks through the
  Atomling's eyes (`walking.md`). The professor stands in his lab and retells his own remarks from the
  film, each with the moment to watch him say it (`periodic-videos.md`).

- Sodium's hall has its picture boards and its own showpiece, the first of the other 116 halls (the user
  loved Carbon's and Oxygen's): beside the doorway into its lab, six pictures (its nerves, the sea's salt
  and Aveiro's salt pans, Davy in 1807, the yellow street lamps, the sodium layer in the sky, the rising
  cake), and in the case lumps under oil in a jar beside a piece just cut, silver against its crust. The
  pictures are the first drawn with the shared kit `tools/boards/lib/` (`hall-boards.md`).

## 2026-10-29

- Evening: accounts (the Pokémon site's logins; 👤): progress kept in the account and moved there from a
  device at its first sign-in (Artur's phone), recording under the account with a switch (on by
  default), the `?who=` tags removed, the dashboard's People; `accounts.md`, `account_probe.py`.
- Usage data (every visit recorded: signed-in players under their account, everyone else anonymous per
  visit; the dashboard at /stats, password with the user; `usage-data.md`) and rooms (playing together:
  up to any number of players, follow, call, emotes, the others' Atomlings, the shared Molecule Lab; the
  quiz as a duel: two seats, everyone else watching, seats swapped by asking, by a line or by "winner
  stays"; `multiplayer.md`). Probes: `usage_probe.py`, `stats_probe.py` (both want EW_DASH_PASS),
  `room_probe.py`, `duel_probe.py`.
- Together on the table: the others' Atomlings stand on the cubes they picked; phone drawers open over a
  selected card (`plaza_room_probe.py`).
- Trends in both depths (the user looked for it in Explorer).
- A reload keeps your place: the walker where they stood, the table's view, pick and trend
  (`walking.md`, `spot_probe.py`). A new version offers Reload, and the phone's ☰ menu always has Reload
  (`deploying.md`).
- The breathing exhibit in oxygen's air wing (`docs/design.md`, `breath_probe.py`).
- The halls: the floor table takes you to any element (a click or tap on a tile); Carbon and Oxygen (the
  user: the text boards were boring) have a fact file and seven picture boards instead of the eight
  stations (`hall-boards.md`); the specimen case is a museum showcase in every hall, with real-looking
  samples; Carbon and Oxygen have their own showpieces (`showpieces.js`). The user loved the new Carbon
  and Oxygen halls (2026-10-29): the other 116 halls follow.

## 2026-10-28

- The HUD around the middle (the user's first feedback from a phone: no full screen, the pop-ups covered
  the table, something always in the middle inside the halls): one rule for every screen
  (`hud-layout.md`): edges only, a dock of tools on the plaza, side or top sheets for stories and the
  quiz, the world's centre drawn in the part left free (covers and the camera's view offset), phones'
  pages, level and language in the ☰ menu, full screen (a button; a touch screen's first tap; the
  home-screen app). `tools/hud_probe.py` passes 60 of 60.
- Walking (the user's second notes; `walking.md`): first person turns on A/D like the character; the
  character's view looks up past the floor; floating Atomlings framed (helium was left at the top of a
  phone's screen); a pinch zooms on phones; no jump button on phones; the nanotube's camera eased (it
  jumped 2.2 m going in and out); an open panel follows a change of level; a neighbour exhibit is offered
  beside an open panel and E switches to it.
- The plaza card in Explorer tells the Atomling's facts, "Tell me something", one at a time to click
  through (the user's request: it said only how many protons and electrons).
- Carbon: the twisted graphene as two hexagonal flakes on a light table, turned by hand or by
  themselves, beside a board of their bands (Bistritzer-MacDonald, `scripts/data/tbg_bands.py`), with why
  twistronics matters.
- The noble gases' neon sign workshop (`/e/He/signs` to `/e/Rn/signs`): filling bench, radon's lead box,
  your name in neon, spectroscope with NIST lines, the atom's energy ladder, history board, balloons.
  Each room starts with its own gas's name on the wall in its own light (the name is kept per room), its
  lamplight, OPEN sign and greeting are the gas's own.
- The Molecule Lab: ionic compounds (metals hand their electrons over: NaCl, MgO, CaCl2, Al2O3...);
  molecules keep their shape and lie level.
- The Atom Forge's beam: fire particles and nuclei at it; famous reactions as history saw them,
  superheavies by fusion-evaporation.
- Polish and German for everything (`translating.md`).
- Night: "Who am I?", a quiz in the plaza, Explorer from 40 well-known elements, Scientist from all 118;
  fewer clues, more points; the best score kept on the device.
- First visits: shaders warmed for the bloom's linear buffer (they were warmed for the screen, a wasted
  half that recompiled on the first frames): cold first visits 1.2 to 3.9 s (carbon's gallery was 10 s).

## 2026-10-27 (the first day)

- Started from the pokemon project's 3D experience. Live at https://element-worlds.vercel.app.
- The plaza: the table, hover and select (the card, the element's Atomling on its cube), enter,
  families, trends, the time machine, search, golden stars over elements with worlds of their own,
  About, links to the Atomlings, the lab and the passport.
- Every element's hall: the atom, eight stations and the specimen case (what it looks like), talking to
  the Atomling (its greeting, then its fun facts), discoveries; coming back from a wing you arrive at its
  arch; walking toward a wing's arch builds it ahead (`engine.prewarm`).
- Element stories in `src/content/`: all 118, written by agents in batches, checked by
  `content.test.js`; their data findings fixed in `scripts/build-elements.mjs` (discovery credit as
  IUPAC/IUPAP gave it, measured ionisation energies, predicted states said as predictions, unconfirmed
  isotopes out).
- Worlds: carbon (`/e/C/allotropes` with the graphene row, `/e/C/life`), oxygen (`/e/O/air`,
  `/e/O/fire`).
- Atomlings: the grammar and the second layer of looks (`characters/look.js`); `/atomlings` with cards.
- The Molecule Lab (covalent molecules), sound, the passport (halls, molecules, forge missions, the
  quiz's record, badges).
- Evening: the Atom Forge (`/forge`): protons, neutrons, electrons; the element's Atomling pops up; 3552
  nuclides from NUBASE say what holds together; decays shown (alpha, beta, capture, fission), whole
  chains; 14 missions; the chart of nuclides to tap; a bottom bar on phones. Linked from every hall's
  "Inside the atom" panel.
- The third-person camera keeps clear of solids and looks up when the floor holds it.
