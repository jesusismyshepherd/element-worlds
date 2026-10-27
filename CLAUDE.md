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
  (how characters are made, the traps met). Read the one for the area you touch.
- `.claude/skills/element-wing/`: the steps for building an element's wing.
- `scripts/build-elements.mjs` (`npm run data`): `scripts/data/` raw sources -> `src/data/elements.json`,
  with the fixes to the sources (discovery years by one rule, discoverers, spellings).
  `scripts/data/export_mendeleev.py` refreshes `mendeleev.json` (venv in `scripts/data/.venv`).
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
- `tools/shot.py` (screenshots of the dev server, `npm run dev` on port 5310, with steps),
  `tools/lineup.py` (the Atomlings page).
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

## Status (2026-10-27)

- Plaza done: the table, hover, select (card), enter, families, trends (Scientist).
- In progress: Atomlings (the character grammar), the atrium, carbon's and oxygen's first wings.
