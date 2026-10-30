# Picture rooms (`/e/<Symbol>/<board id>`)

The room inside one of a hall's pictures, stepped into from the board (`docs/knowledge/picture-rooms.md`).

- `index.js`: which pictures have a room (`hasRoom`, `loadScene`): the scene files themselves.
- `room.js`: `build(ctx, target)`, one module for every picture: the scene, the frame back to the hall,
  the easel with the picture's story, the Atomling, discoveries, the shared things.
- `kit.js`: `frameDoor`, `storyStand`, `motes`, `ringWall`, `ease`.
- `words.js`: the words every room shares (four languages).
- `stages/`: places a scene stands in. `water.js`: shallow sunlit sea, seen from the sea floor;
  `meadow.js`: a grassy hilltop, its sky following the sun; `kitchen.js`: a cosy tiled kitchen;
  `space.js`: a deck floating in space; `night.js`: a hilltop at night over a valley; `workshop.js`: a
  brick workshop at night; `summit.js`: a desert mountaintop at night; `body.js`: the fluid between
  cells, with labelled ions.
- `scenes/<Symbol>/<id>.js` + `<id>.words.js`: a picture's room and its words. Silicon: all six
  (`diatoms`, `solar`, `glass`, `earth`, `valley`, `silicone`). Sodium: `space`, `nerves`, `davy`,
  `kitchen`.
- `pictures.test.js`: every room stands behind a real picture; its words in four languages, the same
  shape, both depths, no em dashes.
