# Element Worlds (Mundos dos Elementos)

Read first. A 3D periodic table in the browser: 118 element cubes on a night plaza; each cube is bigger
on the inside (an atrium built from the element's data, then wings designed for that element), explored
in first person or as the element's own character (an Atomling). For Artur (10) and his father; every
screen has two depths, Explorer and Scientist. Started 2026-10-27 from the pokemon project's 3D
experience (`D:\Family\Artur\pokemon images`, `D:\Family\Artur\pokemon-site`).

The design and the reasons behind it: `docs/design.md`. Change it when a decision changes.

## Rules

- Commit and push when a unit of work is done (the user's standing rule), on `main`. Identity:
  jesusismyshepherd <christskingdomwork@gmail.com> (set in this repo's git config). Vercel deploys `main`.
- Text for people in European Portuguese (pt-PT), English, Polish and German, all four always
  (`docs/knowledge/translating.md`; a text missing in one falls back to English); no em dashes anywhere.
  pt-PT element names follow the Sociedade Portuguesa de Química (azoto, crómio, árgon, xénon).
- Two depths for every text: `kid` (Explorer) and `sci` (Scientist).
- Look at what you made: `python tools/shot.py <path>` (screenshots, console errors) before calling
  3D work done. Judge it at the size and angle a player sees it.
- Science must be right: numbers from `src/data/elements.json` (PubChem + mendeleev), facts checked.
  Say "predicted" where a value is a prediction (superheavy elements).
- Never truncate a file before its new content exists (patch scripts: build the text, write a temp
  file, rename it over the original).
- The middle of the screen stays free (the user, 2026-10-28): every prompt, label, story and tool hugs an
  edge; what opens to be read is a side sheet (a top sheet on an upright phone) and reports what it
  covers, so the world's centre moves into the part left free. `docs/knowledge/hud-layout.md`; check
  with `tools/hud_probe.py` after any HUD change or any new window a world opens.
- Heavy jobs on this machine (browser probes, renders) go through the pokemon project's lock when other
  sessions are busy: `python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" <label> -- <cmd>`.

## Map

- `docs/design.md`: what it is, the decisions, the Atomling grammar, the extension path to molecules.
- `docs/knowledge/`: `adding-a-wing.md` (the world contract, words, pieces, checking), `atomlings.md`
  (how characters are made, the traps met), `molecule-lab.md`, `atom-forge.md`, `hud-layout.md` (the
  HUD's layout rule, covers and the view offset, full screen), `walking.md` (both views, the camera,
  `cameraClear`, panels and exhibits, things to click), `hall-boards.md` (the halls' fact file and picture
  boards, Carbon and Oxygen first), `usage-data.md` (what is recorded, the privacy rules, the dashboard,
  reading the data), `multiplayer.md` (rooms, the shared lab, the realtime traps). Read the one for the
  area you touch. `accounts.md`: the accounts (the Pokémon site's logins), the progress kept in them, the
  recording switch.
- `src/net/`: `config.js` (the family Supabase project, pokemon-site's: URL, publishable key, `rpc` with
  the signed-in session, the client loaded on demand), `account.js` (sign in, new account, the progress
  saved to the account, sign out), `telemetry.js` (usage recording: `track(kind, data)`), `room.js`
  (rooms), `duel.js` (the quiz duel). `supabase/ew_001_usage.sql`, `ew_002_accounts.sql`: the `ew_`
  tables and functions (applied to project kawvqpvntdgehigwvfao; nothing readable with the public key).
  `src/pages/Stats.jsx` + `src/stats/`: the family dashboard at `/stats` (password or an admin account;
  English only).
- `.claude/skills/element-wing/`: the steps for building an element's wing.
- `scripts/build-elements.mjs` (`npm run data`): `scripts/data/` raw sources -> `src/data/elements.json`,
  with the fixes to the sources (discovery years by one rule, discoverers, spellings).
  `scripts/data/export_mendeleev.py` refreshes `mendeleev.json` (venv in `scripts/data/.venv`).
  `scripts/build-nuclides.mjs` (`npm run data:nuclides`): the chart of nuclides for the Atom Forge, from
  `scripts/data/nuclides.json` (`export_nuclides.py`); isotope fixes shared in `scripts/data/fixes.mjs`.
- `src/data/elements.js`: lookups, table cells, families and their colours. `src/data/appearance.js`:
  what each element looks like for real (the specimen cases).
- `src/chem/atom.js`: subshells, shells, valence electrons, octet places, Lewis places, hands, nucleus.
  `src/chem/molecules.js`: molecules as graphs, `checkHands` (the molecule game's rule);
  `src/chem/ballAndStick.js` draws them.
- `src/characters/`: `traits.js` (the Atomling grammar), `atomling.js` (the 3D character),
  `signatures.js` (the objects from each element's story, 75 so far, and where they go), `explain.js`,
  `lineup.js` (the stage of the Atomlings page). `tools/atomsheet.py`: contact sheets of Atomlings
  (each alone from several angles, or the page's rows) for judging them.
- `src/content/`: `stations.js` (the atrium's stations for any element, from the data, all four languages,
  both depths), `C.js`, `O.js` (an element's own words), `boards/<Symbol>.js` (a hall's picture boards;
  pictures in `public/boards/<Symbol>/`, drawn by `tools/boards/<Symbol>/`).
- `src/engine/`: `engine.js` (renderer, loop, world switching, bloom, light mode, `teleport` for probes),
  `player.js` (walking, both views), `collide.js` (solids on the ground plane), `input.js`, `text.js`
  (troika SDF text, `formulaText`), `quality.js` (light mode, from the arena), `store.js` (engine <-> HUD),
  `progress.js` (discoveries kept on the device), `release.js` (a page that a new deployment left behind
  reloads itself once when a world's code is gone; `watchUpdates`: every build writes `/version.json`
  (vite.config.js), an open page asks for it when it comes back on screen and offers "Reload"; the phone's
  ☰ menu always has Reload: the installed app (manifest `fullscreen`) has no reload button or pull to
  refresh, the user, 2026-10-29; checked by `tools/update_probe.py`, two builds).
- `src/worlds/registry.js`: addresses (`/`, `/e/C`, `/e/C/allotropes`) and which module builds each world.
  `plaza/` (the table, trends, time machine), `atrium/` (every element's hall: `atrium.js`, the big atom
  `atom.js`, the specimen case `specimen.js`), `wings/<element>/`, `common/` (sky, panels, arches).
- `src/ui/`: the HUD (React). `layout.js` (`useViewport`: computer, upright phone, phone on its side;
  `useCover`), `fullscreen.js` (the button, full screen at a touch screen's first tap); the engine side
  of covers is `src/engine/covers.js`. `src/pages/`: Explore (the 3D) and Atomlings (`/atomlings`).
  `public/manifest.webmanifest`: the site added to a home screen opens full screen (iPhone too).
- `src/worlds/forge/` + `src/ui/ForgeHud.jsx`, `src/ui/NuclideChart.jsx`: the Atom Forge (`/forge`):
  build atoms from protons, neutrons and electrons, watch nuclei decay; physics in `src/chem/nucleus.js`.
  `src/worlds/common/pack.js`: an even ball of points (every nucleus).
- `src/game/quiz.js` + `src/ui/QuizHud.jsx`: "Who am I?" (Quem sou eu?) in the plaza: clues from the
  data and the element's own words (its name and symbol hidden; `mask` knows units like °C and words
  like "O" or "As"), ten a round, the table flies to each answer.
- `src/worlds/lab/lab.js` + `src/ui/LabHud.jsx`: the Molecule Lab. `src/audio/sound.js`: all sound.
  `src/pages/Passport.jsx`: discoveries and badges. `src/characters/look.js`: flame colours, helmets by
  column, signatures. `src/content/molecules.js`: facts for the lab's molecules.
- `src/worlds/wings/carbon/`, `src/worlds/wings/oxygen/`: the four worlds (each folder has its own
  words, parts and tests). `src/worlds/wings/noble/`: the neon sign workshop, one wing shared by the six
  noble gases (`/e/<Symbol>/signs`; adding-a-wing.md, "A wing shared by several elements").
- `tools/shot.py` (screenshots of the dev server, `npm run dev` on port 5310, with steps),
  `tools/lineup.py` (the Atomlings page), `tools/journey.py` (a whole visit through every wing and back),
  `tools/halls_probe.py` (all 118 halls, every panel, all four languages (each hall rebuilt in it) and
  both depths: words gone wrong, errors;
  under 2 minutes). `shot.py --base https://element-worlds.vercel.app` looks at the live site.
  `tools/hud_probe.py` (the HUD keeps the middle free on six screens, ten scenes; screenshots in
  `tools/shots/hud/`), `tools/fullscreen_probe.py`, `tools/make_icons.py` (the home-screen icons),
  `tools/card_probe.py` (the plaza card's facts on every element, four languages, a computer and a phone:
  the arrows, a click on the text and T go through them, the arrows stay put),
  `tools/nav_probe.py` (walking and looking: turning, looking up, helium framed, the nanotube's camera,
  panels following the level and switching between exhibits, the pinch). `tools/sound_probe.py` (the
  sound opens with the first tap, click or key and the music bed plays; a finger's pointerdown alone does
  not give leave to play on a real phone, headless Edge is lenient there). `tools/breath_probe.py` (the
  air wing's breathing: on and held with E, every gas streaming in and out, two breaths filmed as a
  contact sheet), `tools/spot_probe.py` (a reload puts the walker back where they stood: the engine's
  `keepSpot`, per tab in sessionStorage `ew-spot`, only for the first world of a page load).
  `tools/plaza_room_probe.py` (three players on the table: the others' Atomlings on their picked cubes,
  the dock's drawers over a phone's card). `tools/phone.py`: the site on
  a real Android phone over Wi-Fi (adb, installed 2026-10-28 with winget; Chrome's DevTools socket):
  screenshots, taps, drags and frame times on the phone's own chip; pairing steps in its header.
  Probes run with `py -3.11` (Playwright is installed there).
- Tests: `npm test` (node --test: data, atom, Lewis places, discovery years, molecules, collisions, grammar).

## Working traps

- Git Bash turns an argument starting with `/` into a Windows path: run probes as
  `MSYS_NO_PATHCONV=1 python tools/shot.py / ...`.
- The RoomEnvironment studio light (the default environment) washes a night scene out; a dark world
  sets `env.envIntensity` low (the plaza: 0.12).
- mendeleev lists some superheavies' ionisation energies from a higher degree only; the first ionisation
  energy comes from PubChem.
- PubChem's discovery years mix "first recognised" with "a compound was known" (fluorite 1670, alum and
  lime "ancient"): `YEAR` in `scripts/build-elements.mjs` holds the corrections; discoverers there too.
- The 3D fonts have no superscript or subscript digits and no emoji: plain text on walls, `formulaText`
  for formulas, superscripts only in the HUD (HTML).
- Commit by path while other agents or sessions have work in the tree (`git add <paths>`, never `-A`).
  A shared file that also holds another agent's unfinished lines (the locale files, `registry.js`): stage
  only yours, `python -X utf8 E:\Business\loveandhealing\tools\stage_own_edits.py <file> <edits.json>`
  (HEAD's version plus your replacements; then commit without a pathspec). Check that what is staged
  stands alone: `python -X utf8 tools/check_staged.py` (exports the index, tests and builds it) (2026-10-28: the noble-gas wing's titles and registry entries sat in the same
  files as the lab's keys; committing them early would have broken the live site).
- Chrome on the user's phone translates Portuguese pages into English by itself: it reached the HTML (HUD,
  speech) but not the words drawn in 3D, mixing the two. `index.html` says `translate="no"` and
  `notranslate` (2026-10-28). The user's phone: a Galaxy S21 (Android 15, Chrome), paired with this
  computer for `tools/phone.py` (later: turn Wireless debugging on, `phone.py connect`); in light mode it
  holds 60 frames a second in the hall and the graphene gallery.
- Never give a git worktree a junction to the main `node_modules`: `git worktree remove` followed it and
  deleted 68 packages of the real one before failing (2026-10-29; restored with `npm install`). Remove
  the junction first (`cmd /c rmdir <junction>`), or copy what you need.
- Stopping a background `npx vite` task ends its shell, not Vite: the old server kept the port and its
  stale bundles. Find it (`Get-CimInstance Win32_Process` with `vite` in the command line) and stop it.
- The realtime service closes the channel of a client that updates its presence often ("Client
  presence rate limit exceeded"): presence for who is in a room only, the rest by broadcast
  (docs/knowledge/multiplayer.md).
- Agents editing files make the dev server reload the page under a probe (shots of an empty world, a
  frame count that restarts): check against a separate build instead,
  `npx vite build --outDir <scratch>` + `npx vite preview --outDir <scratch> --port 5317` and
  `tools/shot.py --port 5317`.

## Status (last updated 2026-10-29)

- 2026-10-29 (evening): accounts (the Pokémon site's logins; 👤): progress kept in the account and moved
  there from a device at its first sign-in (Artur's phone), recording under the account with a switch
  (on by default), the `?who=` tags removed, the dashboard's People; `accounts.md`, `account_probe.py`.
- 2026-10-29: usage data (every visit recorded: signed-in players under their account, everyone else
  anonymous per visit; the dashboard at /stats, password with the user; `usage-data.md`) and rooms
  (playing together: up to any number of players, follow, call, emotes, the others' Atomlings, the shared
  Molecule Lab; the quiz as a duel: two seats, everyone else watching, seats swapped by asking, by a line
  or by "winner stays"; `multiplayer.md`). Next for rooms: a shared forge. Probes: `usage_probe.py`,
  `stats_probe.py` (both want EW_DASH_PASS), `room_probe.py`, `duel_probe.py`.

- Live at https://element-worlds.vercel.app (Vercel deploys `main` on every push).
- The plaza: the table, hover and select (the card, the element's Atomling on its cube; in Explorer the
  card tells the Atomling's facts, "Tell me something", one at a time to click through, since the user's
  request of 2026-10-28: it said only how many protons and electrons), enter, families,
  trends (both depths since 2026-10-29), the time machine, search, golden stars over elements with worlds of their own,
  About, links to the Atomlings, the lab and the passport.
- Every element's hall: the atom, eight stations and the specimen case (what it looks like), talking
  to the Atomling (its greeting, then its fun facts), discoveries; coming back from a wing you arrive at
  its arch; walking toward a wing's arch builds it ahead (`engine.prewarm`). The floor table: a click or
  tap on a tile goes to that element's hall (2026-10-29). Carbon and Oxygen (2026-10-29, the user: the
  text boards were boring) have a fact file and seven picture boards instead of the eight stations;
  the rest of the elements once the user has seen these (`docs/knowledge/hall-boards.md`). The specimen
  case is a museum showcase in every hall, with real-looking samples; Carbon and Oxygen have their own
  showpieces (`showpieces.js`; the rest once the user has seen these).
- Element stories in `src/content/`: all 118 (written 2026-10-27 by agents in batches, checked by
  `content.test.js`; their data findings fixed in `scripts/build-elements.mjs`: discovery credit as
  IUPAC/IUPAP gave it, measured ionisation energies, predicted states said as predictions, unconfirmed
  isotopes out).
- Worlds: carbon (`/e/C/allotropes` with the graphene row and, since 2026-10-28, the twisted graphene as
  two hexagonal flakes on a light table, turned by hand or by themselves, beside a board of their bands
  (Bistritzer-MacDonald, `scripts/data/tbg_bands.py`), with why twistronics matters; `/e/C/life`), oxygen (`/e/O/air`,
  `/e/O/fire`; since 2026-10-29 the air wing's breathing exhibit, `oxygen/airBreath.js`: glass lungs
  between the air breathed in and the air breathed out, breathing on until held with E), the noble gases' neon sign workshop (`/e/He/signs` to `/e/Rn/signs`, 2026-10-28: filling
  bench, radon's lead box, your name in neon, spectroscope with NIST lines, the atom's energy ladder,
  history board, balloons). Ideas for the next ones: `docs/wing-ideas.md`.
- Atomlings: the grammar and the second layer of looks (`characters/look.js`); `/atomlings` with cards.
- The Molecule Lab (`/lab`, `docs/knowledge/molecule-lab.md`): covalent molecules and, since 2026-10-28,
  ionic compounds (metals hand their electrons over: NaCl, MgO, CaCl2, Al2O3...); molecules keep their
  shape and lie level. Sound (`src/audio/sound.js`), the passport (`/passport`: halls, molecules, forge
  missions, the quiz's record, badges).
- The Atom Forge (`/forge`, 2026-10-27 evening; `docs/knowledge/atom-forge.md`): protons, neutrons,
  electrons; the element's Atomling pops up; 3552 nuclides from NUBASE say what holds together; decays
  shown (alpha, beta, capture, fission), whole chains; 14 missions; the chart of nuclides to tap; a
  bottom bar on phones. Linked from every hall's "Inside the atom" panel. The beam (2026-10-28): fire
  particles and nuclei at it; famous reactions as history saw them, superheavies by fusion-evaporation.
- "Who am I?" (2026-10-28 night): a quiz in the plaza, Explorer from 40 well-known elements, Scientist
  from all 118; fewer clues, more points; the best score kept on the device.
- The HUD around the middle (2026-10-28, the user's first feedback from a phone: no full screen, the
  pop-ups covered the table, something always in the middle inside the halls): one rule for every
  screen (`docs/knowledge/hud-layout.md`): edges only, a dock of tools on the plaza, side or top sheets
  for stories and the quiz, the world's centre drawn in the part left free (covers and the camera's
  view offset), phones' pages, level and language in the ☰ menu, full screen (a button; a touch
  screen's first tap; the home-screen app). `tools/hud_probe.py` passes 60 of 60.
- Walking (2026-10-28, the user's second notes; `docs/knowledge/walking.md`): first person turns on A/D
  like the character; the character's view looks up past the floor; floating Atomlings framed (helium
  was left at the top of a phone's screen); a pinch zooms on phones; no jump button on phones; the
  nanotube's camera eased (it jumped 2.2 m going in and out); an open panel follows a change of
  level; a neighbour exhibit is offered beside an open panel and E switches to it.
- The neon workshop's rooms (2026-10-28): each starts with its own gas's name on the wall in its own
  light (the name is kept per room), its lamplight, OPEN sign and greeting are the gas's own.
- Open (the one list of what is left; add to it, and take out what gets done):
  - The user's review: the Atomlings' look, the worlds, the forge, the HUD, walking, the breathing.
  - Waiting on that review: the picture boards, fact file and showpiece for the other 116 halls
    (`docs/knowledge/hall-boards.md`).
  - Next to build: a shared forge in rooms (`multiplayer.md`); oxygen's next exhibits (`docs/design.md`);
    the wings in `docs/wing-ideas.md`.
  - First visits: shaders are now warmed for the bloom's linear buffer (2026-10-28; they were warmed for
    the screen, a wasted half that recompiled on the first frames): cold first visits 1.2 to 3.9 s
    (carbon's gallery was 10 s); fewer material variants would cut more (the gallery still needs 53
    programs).
  - The third-person camera keeps clear of solids and looks up when the floor holds it (2026-10-27), but
    meshes that are not solids (lattices, crowns) still need each world's own fade (carbon's wings).
  - The real phone (`tools/phone.py`) has measured only the hall and the graphene gallery (60 frames a
    second in light mode); the other worlds not yet.
