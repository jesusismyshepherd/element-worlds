---
name: element-wing
description: Build or change a wing (a world designed for one element, reached from its atrium) in Element Worlds, or give a new element its first wings. Use when the user asks for a new element's interior, a new exhibit or experiment for an element, or changes to carbon's or oxygen's worlds.
---

# Building an element's wing

1. Read `CLAUDE.md`, then `docs/knowledge/adding-a-wing.md` (the world contract, the words at two
   depths and in two languages, the pieces to reuse, how to check it) and the design's "Wings" section.
2. Look at an existing wing in `src/worlds/wings/` as the model to follow.
3. Register it in `WINGS` (`src/worlds/registry.js`: id, side of the atrium n/e/w, colour, loader) and
   give it a title in both locale files (`wings.<Symbol>.<id>.title`).
4. Build it in `src/worlds/wings/<element>/<id>.js`: exhibits to do, not only to read; every text in
   pt-PT and English, kid and sci; one discovery per exhibit; an arch back to the atrium behind the spawn.
5. Check facts (numbers from `src/data/elements.json`; say "predicted" for predictions).
6. Look at it: `MSYS_NO_PATHCONV=1 python tools/shot.py /e/<Symbol>/<id> --steps "js:__ew.teleport(x, z, yaw, pitch); wait:1; shot:name"`
   for every exhibit, both views (`__ew.setMode('first')`), `--lang en`, `--level scientist`, `--phone`.
   Nothing of the HUD in the middle of the screen (`docs/knowledge/hud-layout.md`): panels and speech
   go through the store; a window of the wing's own sits at an edge, reports its cover and sets
   `store.overlay`; add it to `tools/hud_probe.py` and run that. Panels open with `ctx.showPanel(make)`;
   a camera rule of the wing's own is `cameraClear` (`docs/knowledge/walking.md`), checked by walking
   through it (`tools/nav_probe.py`).
7. `npm test`, `npx vite build`; write what you learned into `docs/knowledge/` (traps and fixes) and
   the status in `CLAUDE.md`; commit and push.
