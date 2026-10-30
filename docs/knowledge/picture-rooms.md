# Picture rooms: stepping into a hall's pictures (2026-10-30)

Artur, the first time he saw the new picture boards in the halls: "How can I get inside these pictures?"
He took them for portals, like the board that leads into the Periodic Videos lab. The user scheduled it,
marked it Sooner in the studio, and set the rule: **no picture without its room**. The pictures already
on the walls get their rooms (silicon first, then sodium, carbon, oxygen), and from now on a new hall's
pictures are drawn and built together with their rooms, so a picture on a wall always means you can step
in. The studio item is `picture-rooms`.

## How it works

- A picture has a room when its scene exists: `src/worlds/pictures/scenes/<Symbol>/<board id>.js`. The
  file is the list (`pictures/index.js`, an `import.meta.glob`); nothing else to register.
- The hall (`atrium.js`): a board with a room says "Step in" (not "Explore"), E dives into the picture
  (`player.dive`, as the doorway boards do) and goes to `/e/<Symbol>/<board id>`. Coming back you stand
  in front of the picture, facing the hall. Only the nearest picture's room is built ahead
  (`engine.prewarm`; another place asked for lets the previous one go, so the side-by-side boards each
  get theirs when approached).
- The address is a wing's (`kind: 'wing'`); `registry.loadWorld` sends a wing id that is not in `WINGS`
  to `pictures/room.js`, which loads the scene (and fails plainly if there is none).
- `pictures/room.js` (one module for every picture) adds what every room has: the picture's frame
  standing behind the spawn as the way back (walk into it), an easel with the picture and its story (the
  board's own words from `src/content/boards/<Symbol>.js`, both depths; its frame breathes until read),
  the element's Atomling (greeting and lines from the scene's words), the exhibit rules and discoveries
  (`<Symbol>:<board id>:<exhibit>`), the shared things. Entering marks the hall's board as found
  (`<Symbol>:board:<id>`), since stepping in is exploring it.
- The scene's `build(api)` makes its stage and its things to do and returns `{ env, solids,
  cameraBounds, spawn, hostSpot, back: { x, z, rot } (the frame), stand: { x, z, rot } (the easel),
  parts, shared, update(dt, t), dispose }`. `api`: `ctx, root, el, sym, lang, E (its words), W (shared
  words), ex (exhibitSet), say, later, light, color, level, depth, clickable`.
- Things worked by hand (the user's rule for every station, 2026-10-30; `adding-a-wing.md`, "Look and
  feel"): `clickable(object, onTap, { when, reach })` makes a mesh or group a thing to click or tap;
  the hand shows over it while `when()` is true and the visitor stands within `reach` (4.5 m); `onTap(hit)`
  does the step (count its find with `ex.discover`, share it, say the line). Each step is chosen by
  touching its thing; a smooth quantity is a slider in the station's panel; the panel's buttons do the
  same steps for E and the probes.
- Stages, one file each in `pictures/stages/`: `water.js` (sunlit shallow sea, from the sea floor). A
  room picks one or builds its own; a new kind of place becomes a new stage file so the next room can
  use it.
- `pictures/kit.js`: `frameDoor`, `storyStand`, `motes`, `ringWall` (a round edge), `ease`. Exhibits use
  the neon workshop's kit (`wings/noble/kit.js`: `exhibitSet`, `canvasTex`, `at`, `damp`, ...).
- Words: `scenes/<Symbol>/<id>.words.js`, all four languages, kid and sci, the same shape as the English
  (`pictures.test.js`): `title` (the room's name, in the breadcrumb), `greet`, `talk`, then one entry per
  exhibit (label, verbs, title, says, panel).

## Size, shape and speed

No size limit in the code; a room is whatever its subject needs. What costs speed is not size: a room's
code is fetched only when it is entered and freed when it is left. Two things matter. The first visit
compiles the shaders of every kind of material the room uses (1.2 to 3.9 s for the big wings), so a room
built from the kit's few materials compiles little and shares programs with the next room. And on the
phone, what is drawn at once (lights, glass, particles, bloom). `ctx.light` rooms draw fewer motes and
shafts. A room that grows rich or loved (the family dashboard shows the visits) can become a full wing
at the same address.

## Built

- Silicon, `diatoms` ("Who lives in a house made of glass?", 2026-10-30): shrunk to a diatom's size on a
  sunlit sea floor, the picture's four kinds drifting round (round, boat, triangle, star). The round
  diatom opens like a box and its lid (the golden-brown cell inside, seen through the pores while closed);
  boat diatoms in a sunbeam give off oxygen, O2 rising; a diatom family shrinks by 0.84 with each
  division (the MacDonald-Pfitzer rule) until the smallest leaves its glass, swells into an auxospore and
  becomes a full-size diatom again.

## Adding a room

1. Read the picture's story (`src/content/boards/<Symbol>.js`) and look at its picture
   (`py -3.11 tools/boards/lib/render.py <Symbol>`). The room is the picture made into a place: the same
   things, the same colours, and one to three things to do that the story is about, without repeating
   the element's other rooms (its Periodic Videos lab, its wings).
2. Write `scenes/<Symbol>/<id>.words.js` (English first, then pt-PT, Polish, German; `translating.md`)
   and `scenes/<Symbol>/<id>.js` on a stage (`diatoms.js` is the model). Every exhibit that changes goes
   in `shared` (`adding-a-wing.md`, "Shared with the room"); a verb that changes with the state is a
   getter.
3. `npm test`; look at it (`tools/shot.py /e/<Symbol>/<id>`, both views, every exhibit used, `--phone`,
   `--level scientist`); step in from the hall and walk back out; `py -3.11 tools/shared_probe.py --world
   /e/<Symbol>/<id>`.
4. Add it under "Built" here and in the studio's item.

## Traps met

- The third-person camera sits about 4 m behind the player: a frame placed 2 m behind the spawn had the
  camera behind it, looking at the world through its swirl. Stand the frame at the room's edge and give
  the camera a `maxZ` in front of it.
- A pale floor under the bloom washes the whole scene out (the silt was #b9c2a8 and read as snow): keep
  big surfaces mid-toned (#93a08a).
- `tools/shot.py` splits its steps at every `;`: a `js:` step can hold no semicolon (no `for` loops); use
  `[1, 2, 3].forEach(...)` or an arrow function with commas.
- Chloroplasts set out in neat rings read as a printed pattern, not a living cell: scatter them (a golden
  angle spiral).
- The easel's legs first went straight through the picture (the user liked the picture on sticks, not
  the sticks through it): `storyStand` leans the front legs back behind the picture, which rests on a
  ledge in front of them, and props them with a third leg.
