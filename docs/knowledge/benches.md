# The lab's benches (`/lab/<id>`, 2026-11-09)

The Molecule Lab grew benches: worlds of their own beside the molecule table, each one piece of chemistry
done by hand. The user marked six lab ideas Sooner in the family studio on 2026-11-09; four of them are
benches (the other two, the clouds in the forge and the lab, live in those worlds).

| id | title (en) | the idea in the studio | its doc |
|---|---|---|---|
| `crystal` | Growing Crystals (ready 2026-11-09) | `crystals-grow`: ions stacking into a salt crystal you watch grow | `crystal.md` |
| `alloys` | The Alloy Forge (ready 2026-11-09) | `alloys`: copper, tin, zinc, iron and carbon into bronze, brass and steel | `alloys.md` |
| `reactions` | Reactions | `reactions-game`: balance by counting atoms on both sides, then run it | `reactions.md` |
| `dna` | Building DNA | `rings-dna`: the DNA bases and a short strand built and paired (benzene and glucose join the lab's own molecules) | `dna.md` |

## Where things are

- `src/worlds/registry.js` `BENCHES` (id, icon, loader) and `benchPath(id)`; `/lab/<id>` is the target
  `{ kind: 'bench', bench: id }`, its world key `bench:<id>` (also the telemetry's and the hunts' name for it).
- The world: `src/worlds/benches/<id>/<id>.js` (`build(ctx)` like the lab's: `mode: 'orbit'`, its own
  OrbitControls), the rest of its code in the same folder, its words in that folder's `words.js` (all four
  languages, both depths, like `src/worlds/forge/words.js`), its tests beside them (`*.test.js`, run by `npm test`).
- The HUD: `src/ui/benches/<Id>Hud.jsx`, loaded with its world (`Hud.jsx` `BENCH_HUDS`). The top bar reads
  "← Table / Molecule Lab / <title>"; the lab's title links back to the lab.
- Titles: `bench.<id>.title` in the four locale files; the lab's missions card lists the benches
  (`lab.benches`, `data-lab-benches`: icons while folded, names when open).
- The Bible passage: the passage id is the bench id (`passages.json`, `why.js`, `scripture.md`), shown in the
  bench's sky with `skyVerse(ctx, '<id>', ...)`.
- `store.world` carries `bench` (engine.js); RoomHud's "where" says the bench; the family dashboard names it
  "the lab's <id> bench".

## Rules every bench keeps

The project's: four languages and two depths for every text, the middle of the screen free (the HUD at the
edges, `useCover`, `hud-layout.md`), tap the thing itself (the tap-the-thing rule, `walking.md`), science from
the data and checked, "predicted" where it is, shared in a room (`multiplayer.md`), discoveries
`bench:<id>:<find>` (`engine/progress.js`), sound from `audio/sound.js`, light mode (`ctx.light`) for phones.
