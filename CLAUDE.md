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
- Text for people in European Portuguese (pt-PT) and English, both always; no em dashes anywhere.
  pt-PT element names follow the Sociedade Portuguesa de Química (azoto, crómio, árgon, xénon).
- Two depths for every text: `kid` (Explorer) and `sci` (Scientist).
- Look at what you made: `python tools/shot.py <path>` (screenshots, console errors) before calling
  3D work done. Judge it at the size and angle a player sees it.
- Science must be right: numbers from `src/data/elements.json` (PubChem + mendeleev), facts checked.
  Say "predicted" where a value is a prediction (superheavy elements).
- Never truncate a file before its new content exists (patch scripts: build the text, write a temp
  file, rename it over the original).
- Heavy jobs on this machine (browser probes, renders) go through the pokemon project's lock when other
  sessions are busy: `python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" <label> -- <cmd>`.

## Map

- `docs/design.md`: what it is, the decisions, the Atomling grammar, the extension path to molecules.
- `docs/knowledge/`: `adding-a-wing.md` (the world contract, words, pieces, checking), `atomlings.md`
  (how characters are made, the traps met), `molecule-lab.md`, `atom-forge.md`. Read the one for the
  area you touch.
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
  `lineup.js` (the stage of the Atomlings page).
- `src/content/`: `stations.js` (the atrium's stations for any element, from the data, both languages,
  both depths), `C.js`, `O.js` (an element's own words).
- `src/engine/`: `engine.js` (renderer, loop, world switching, bloom, light mode, `teleport` for probes),
  `player.js` (walking, both views), `collide.js` (solids on the ground plane), `input.js`, `text.js`
  (troika SDF text, `formulaText`), `quality.js` (light mode, from the arena), `store.js` (engine <-> HUD),
  `progress.js` (discoveries kept on the device).
- `src/worlds/registry.js`: addresses (`/`, `/e/C`, `/e/C/allotropes`) and which module builds each world.
  `plaza/` (the table, trends, time machine), `atrium/` (every element's hall: `atrium.js`, the big atom
  `atom.js`, the specimen case `specimen.js`), `wings/<element>/`, `common/` (sky, panels, arches).
- `src/ui/`: the HUD (React). `src/pages/`: Explore (the 3D) and Atomlings (`/atomlings`, all 118).
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
  words, parts and tests).
- `tools/shot.py` (screenshots of the dev server, `npm run dev` on port 5310, with steps),
  `tools/lineup.py` (the Atomlings page), `tools/journey.py` (a whole visit through every wing and back),
  `tools/halls_probe.py` (all 118 halls, every panel, both languages and depths: words gone wrong, errors;
  under 2 minutes). `shot.py --base https://element-worlds.vercel.app` looks at the live site.
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
  only yours, `python -X utf8 E:\Business\loveandhealing	ools\stage_own_edits.py <file> <edits.json>`
  (HEAD's version plus your replacements; then commit without a pathspec). Check that what is staged
  stands alone: `python -X utf8 tools/check_staged.py` (exports the index, tests and builds it) (2026-10-28: the noble-gas wing's titles and registry entries sat in the same
  files as the lab's keys; committing them early would have broken the live site).
- Agents editing files make the dev server reload the page under a probe (shots of an empty world, a
  frame count that restarts): check against a separate build instead,
  `npx vite build --outDir <scratch>` + `npx vite preview --outDir <scratch> --port 5317` and
  `tools/shot.py --port 5317`.

## Status (2026-10-27, end of the first day)

- Live at https://element-worlds.vercel.app (Vercel deploys `main` on every push).
- The plaza: the table, hover and select (the card, the element's Atomling on its cube), enter, families,
  trends (Scientist), the time machine, search, golden stars over elements with worlds of their own,
  About, links to the Atomlings, the lab and the passport.
- Every element's hall: the atom, eight stations and the specimen case (what it looks like), talking
  to the Atomling (its greeting, then its fun facts), discoveries; coming back from a wing you arrive at
  its arch; walking toward a wing's arch builds it ahead (`engine.prewarm`).
- Element stories in `src/content/`: all 118 (written 2026-10-27 by agents in batches, checked by
  `content.test.js`; their data findings fixed in `scripts/build-elements.mjs`: discovery credit as
  IUPAC/IUPAP gave it, measured ionisation energies, predicted states said as predictions, unconfirmed
  isotopes out).
- Worlds: carbon (`/e/C/allotropes` with the graphene row, `/e/C/life`), oxygen (`/e/O/air`,
  `/e/O/fire`). Ideas for the next ones: `docs/wing-ideas.md`.
- Atomlings: the grammar and the second layer of looks (`characters/look.js`); `/atomlings` with cards.
- The Molecule Lab (`/lab`, `docs/knowledge/molecule-lab.md`), sound (`src/audio/sound.js`), the
  passport (`/passport`).
- The Atom Forge (`/forge`, 2026-10-27 evening; `docs/knowledge/atom-forge.md`): protons, neutrons,
  electrons; the element's Atomling pops up; 3552 nuclides from NUBASE say what holds together; decays
  shown (alpha, beta, capture, fission), whole chains; 14 missions; the chart of nuclides to tap; a
  bottom bar on phones. Linked from every hall's "Inside the atom" panel.
- "Who am I?" (2026-10-28 night): a quiz in the plaza, Explorer from 40 well-known elements, Scientist
  from all 118; fewer clues, more points; the best score kept on the device.
- Open: the user's review (the Atomlings' look, the worlds, the forge); first visits to big worlds
  compile 70 to 90 shader programs (8 s on Windows, about 1 s after; prewarm hides most of it, fewer
  material variants would cut it); the third-person camera keeps clear of solids and looks up when the
  floor holds it (2026-10-27), but meshes that are not solids (lattices, crowns) still need each
  world's own fade (carbon's wings); a test on a real phone.
