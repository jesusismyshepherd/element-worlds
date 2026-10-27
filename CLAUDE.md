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
- `docs/knowledge/`: traps and their fixes, workflows (read the file for the area you touch).
- `scripts/build-elements.mjs` (`npm run data`): `scripts/data/` raw sources -> `src/data/elements.json`.
  `scripts/data/export_mendeleev.py` refreshes `mendeleev.json` (venv in `scripts/data/.venv`).
- `src/data/elements.js`: lookups, table cells, families and their colours.
- `src/chem/atom.js`: subshells, shells, valence electrons, octet places, hands (bonds), nucleus.
- `src/engine/`: `engine.js` (renderer, loop, world switching, bloom, light mode), `player.js` (walking,
  both views), `collide.js` (solids on the ground plane), `input.js`, `text.js` (troika SDF text),
  `quality.js` (light mode, from the arena), `store.js` (engine <-> HUD).
- `src/worlds/registry.js`: addresses (`/`, `/e/C`, `/e/C/allotropes`) and which module builds each world.
  `plaza/` (the table), `atrium/` (every element), `wings/<element>/`, `common/` (sky, shared pieces).
- `src/ui/`: the HUD (React). `src/pages/`: Explore (the 3D) and Atomlings (all 118 characters).
- `tools/shot.py`: screenshots of the running dev server (`npm run dev`, port 5310).
- Tests: `npm test` (node --test: data, atom, collisions).

## Working traps

- Git Bash turns an argument starting with `/` into a Windows path: run probes as
  `MSYS_NO_PATHCONV=1 python tools/shot.py / ...`.
- The RoomEnvironment studio light (the default environment) washes a night scene out; a dark world
  sets `env.envIntensity` low (the plaza: 0.12).
- mendeleev lists some superheavies' ionisation energies from a higher degree only; the first ionisation
  energy comes from PubChem.

## Status (2026-10-27)

- Plaza done: the table, hover, select (card), enter, families, trends (Scientist).
- In progress: Atomlings (the character grammar), the atrium, carbon's and oxygen's first wings.
