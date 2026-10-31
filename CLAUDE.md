# Element Worlds (Mundos dos Elementos)

Read first. A 3D periodic table in the browser: 118 element cubes on a night plaza; each cube is bigger
on the inside (an atrium built from the element's data, then wings designed for that element), explored
in first person or as the element's own character (an Atomling). For Artur (10) and his father; every
screen has two depths, Explorer and Scientist. Started 2026-10-27 from the pokemon project's 3D
experience (`D:\Family\Artur\pokemon images`, `D:\Family\Artur\pokemon-site`).

The design and the reasons behind it: `docs/design.md`. Change it when a decision changes. What was
built when, and the user's requests behind it: `docs/history.md`.

## Rules

- Start every session with `/update-dashboard`: the studio, the user's dashboard for this project
  (https://claude.ai/artifact/UnVCX3MBSmNViL4Vu6XJAG): their ideas, verdicts, ticks and notes come in, each
  gets an answer there (`docs/knowledge/update-dashboard.md`). What to build next is its queue, in
  `docs/studio/backlog.json`; Claude picks from the top unless the user switched the studio to "I pick".
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
  (how characters are made, the traps met), `molecule-lab.md`, `atom-forge.md`, `star-forge.md`, `hud-layout.md` (the
  HUD's layout rule, covers and the view offset, full screen), `walking.md` (both views, the camera,
  `cameraClear`, panels and exhibits, things to click), `hall-boards.md` (the halls' fact file and picture
  boards, Carbon and Oxygen first), `picture-rooms.md` (stepping into a hall's pictures: the scene
  contract, the stages, adding a room), `usage-data.md` (what is recorded, the privacy rules, the dashboard,
  reading the data), `multiplayer.md` (rooms, the shared lab, the realtime traps), `accounts.md` (the
  Pokémon site's logins, the progress kept in them, the recording switch), `tools.md` (every probe and
  helper in `tools/`, what each checks), `deploying.md` (Vercel, new versions, Reload), `update-dashboard.md` (the studio), `sound.md` (the
  music beds as offline loops, the buffer, why a phone crackles), `periodic-videos.md` (watching an element's
  video with `tools/pv/pv.py`, its brief in `docs/pv/<Symbol>.md`, the rooms). Read the one for the area
  you touch.
- `docs/studio/`: `backlog.json` (the queue, every idea, what waits on the user, what was built, the
  decisions; checked by `src/data/studio.test.js`) and `studio.html` (the studio page, published with it).
- `src/net/`: `config.js` (the family Supabase project, pokemon-site's: URL, publishable key, `rpc` with
  the signed-in session, the client loaded on demand), `account.js` (sign in, new account, the progress
  saved to the account, sign out), `telemetry.js` (usage recording: `track(kind, data)`), `room.js`
  (rooms), `duel.js` (the quiz duel), `shared.js` (a world's things shared in a room: the world's `shared`
  and `ctx.share(id)`, `adding-a-wing.md`). `supabase/ew_001_usage.sql`, `ew_002_accounts.sql`,
  `ew_003_room_worlds.sql` (the rooms' worlds kept): the `ew_` tables and functions (applied to project kawvqpvntdgehigwvfao; nothing readable with the public key).
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
  `progress.js` (discoveries kept on the device), `release.js` (new versions: Reload offered, a page
  left behind reloads once; `docs/knowledge/deploying.md`).
- `src/worlds/registry.js`: addresses (`/`, `/e/C`, `/e/C/allotropes`) and which module builds each world.
  `plaza/` (the table, trends, time machine), `atrium/` (every element's hall: `atrium.js`, the big atom
  `atom.js`, the specimen case `specimen.js`, doorway boards `doors.js`), `wings/<element>/`, `common/` (sky, panels, arches).
- `src/ui/`: the HUD (React). `layout.js` (`useViewport`: computer, upright phone, phone on its side;
  `useCover`), `fullscreen.js` (the button, full screen at a touch screen's first tap); the engine side
  of covers is `src/engine/covers.js`. `src/pages/`: Explore (the 3D) and Atomlings (`/atomlings`).
  `public/manifest.webmanifest`: the site added to a home screen opens full screen (iPhone too).
- `src/worlds/forge/` + `src/ui/ForgeHud.jsx`, `src/ui/NuclideChart.jsx`: the Atom Forge (`/forge`):
  build atoms from protons, neutrons and electrons, watch nuclei decay; physics in `src/chem/nucleus.js`.
  `src/worlds/common/pack.js`: an even ball of points (every nucleus).
- `src/worlds/stars/` + `src/ui/StarHud.jsx`, `StarTable.jsx`: the Star Forge (`/stars`): pick a star,
  its burnings from inside, its end, the slow and rapid neutron captures, the table by where each element
  came from (`star-forge.md`; data in `src/data/origins.js`, `binding.json`).
- `src/game/quiz.js` + `src/ui/QuizHud.jsx`: "Who am I?" (Quem sou eu?) in the plaza: clues from the
  data and the element's own words (its name and symbol hidden; `mask` knows units like °C and words
  like "O" or "As"), ten a round, the table flies to each answer.
- `src/worlds/lab/lab.js` + `src/ui/LabHud.jsx`: the Molecule Lab. `src/audio/sound.js`: all sound.
  `src/pages/Passport.jsx`: discoveries and badges. `src/characters/look.js`: flame colours, helmets by
  column, signatures. `src/content/molecules.js`: facts for the lab's molecules.
- `src/worlds/wings/carbon/`, `oxygen/` (two worlds each), `noble/` (the neon sign workshop, one wing
  shared by the six noble gases, `/e/<Symbol>/signs`), `pv/` (the Periodic Videos rooms, `/e/<Symbol>/videos`,
  sodium's first): each folder's `README.md` maps its files.
- `src/worlds/pictures/`: the rooms inside the halls' pictures (`/e/<Symbol>/<board id>`): `room.js` for
  every picture, `kit.js`, `stages/`, `scenes/<Symbol>/<id>.js` (a scene file is what makes its picture a
  door). Rule (the user, 2026-10-30): no picture without its room; new pictures come with theirs.
- `tools/`: probes and helpers (`docs/knowledge/tools.md` says what each checks). The everyday ones:
  `shot.py <path>` (screenshots and console errors; `--base https://element-worlds.vercel.app` for the
  live site), `halls_probe.py` (all 118 halls, four languages, both depths), `hud_probe.py` (after any HUD
  change), `phone.py` (the user's real phone). Probes run with `py -3.11`.
- Tests: `npm test` (node --test: data, atom, Lewis places, discovery years, molecules, collisions,
  grammar, every wing's words, the content).

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
  `notranslate` (2026-10-28). The user's phone (a Galaxy S21) and how to reach it: `tools.md`, `phone.py`.
- Never give a git worktree a junction to the main `node_modules`: `git worktree remove` followed it and
  deleted 68 packages of the real one before failing (2026-10-29; restored with `npm install`). Remove
  the junction first (`cmd /c rmdir <junction>`), or copy what you need.
- Stopping a background `npx vite` task ends its shell, not Vite: the old server kept the port and its
  stale bundles. Find it (`Get-CimInstance Win32_Process` with `vite` in the command line) and stop it.
  Match the server exactly (`vite` and `preview` and `--port 5317` in one command line, `node.exe` only),
  never a bare port number: matching "5318" killed one of the user's Chrome processes (2026-10-30).
- The realtime service closes the channel of a client that updates its presence often ("Client
  presence rate limit exceeded"): presence for who is in a room only, the rest by broadcast
  (docs/knowledge/multiplayer.md).
- Agents editing files make the dev server reload the page under a probe (shots of an empty world, a
  frame count that restarts): check against a separate build instead,
  `npx vite build --outDir <scratch>` + `npx vite preview --outDir <scratch> --port 5317` and
  `tools/shot.py --port 5317`.

## Status (last updated 2026-10-29)

Live at https://element-worlds.vercel.app. What there is, each with its doc (when and why each piece was
built: `docs/history.md`):

- The plaza (`/`): the table, the card with the Atomling's facts, families, trends (both depths), the
  time machine, search, "Who am I?", golden stars over elements with worlds of their own.
- Every element's hall (`/e/<Symbol>`): the atom, the Atomling to talk to, the specimen showcase, the
  floor table to any element. Carbon and Oxygen have a fact file, seven picture boards and their own
  showpieces; the other 116 still have the eight text stations (`hall-boards.md`). A picture with a room
  is stepped into (`picture-rooms.md`; every picture on a wall since 2026-10-31).
- Wings: carbon (allotropes, life), oxygen (air, fire), the noble gases' neon sign workshop, sodium's
  and silicon's Periodic Videos rooms (since 2026-10-30, sodium the pilot, entered through a doorway board in the hall, the
  professor in it; a README in each folder). Using a station in third person looks through the Atomling's
  eyes (`walking.md`).
- The Molecule Lab (`/lab`, `molecule-lab.md`), the Atom Forge (`/forge`, `atom-forge.md`), the Star
  Forge (`/stars`, `star-forge.md`, 2026-10-31), the Atomlings (`/atomlings`, `atomlings.md`), the
  passport (`/passport`).
- Rooms: playing together, the shared lab, the quiz duel, every wing's things shared (since 2026-10-30),
  each world saved twice: the player's own and each room's, kept while empty (`multiplayer.md`). Accounts (`accounts.md`).
  Usage data and the family dashboard at `/stats` (`usage-data.md`).
- The HUD keeps the middle free (`hud-layout.md`); walking in both views (`walking.md`); four languages
  (`translating.md`); new versions and Reload (`deploying.md`).

Open: everything left to do is in `docs/studio/backlog.json`, one list: the queue (`next`, in order,
each with why), the ideas, the known problems (kind `tech`: first visits, the camera among lattices,
the phone), and what waits on the user. Next: the older wings' stations worked by hand (taps on the
things, `src/worlds/common/taps.js`), the star forge, the forge together, then element by element each
hall's pictures with their rooms, the best-known elements first (`hall-boards.md`, "The other 116 halls";
new Periodic Videos rooms wait, the user marked them Later).
