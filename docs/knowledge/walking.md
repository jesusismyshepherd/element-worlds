# Walking and looking (the halls and the wings)

`src/engine/player.js` (the walker, both views), `src/engine/input.js` (keys, drag, pinch, the stick).
Changed 2026-10-28 after the user tried both views on a phone and a computer.

## The rules

- Both views drive alike: W and S (the stick up and down) go forward and back, A and D (the arrows, the
  stick sideways) turn. First person used to step sideways on A and D; the user found it the main reason
  first person felt worse than the character. A drag looks round in both.
- The character's camera swings round the Atomling from above (-1.15 rad) down to the world's
  `cameraPitchMax` (0.2 by default; worlds with something overhead allow more); tilted further, it stays
  and looks up (`AIM_UP`, 0.75 rad), and walking on brings the view back down. Before, it stopped about
  11 degrees up (the floor held it): "I could hardly pan the camera vertically".
- The camera aims at the Atomling's upper body where it floats: `pos.y + hover + 0.85 * height`.
  Helium hovers 1.38 m up; aimed at a walker's head height, the view looked at the floor under it and
  helium sat at the top of the screen, far away.
- On a touch screen the camera stands at 0.9 of a computer's distance (minimum 2.6 m before that), and
  two fingers pinch it nearer or farther (the computer has the wheel); 1.8 to 12 m.
- No jump button on touch screens (the user: a museum floor needs none, and it crowded the screen);
  Space still jumps on a keyboard.

## A world's rule for the camera: `cameraClear`, never a move after the player

A world that keeps the third-person camera somewhere (inside a round dome, on the player's side of a
tunnel's bars) gives `cameraClear(from, to)`: the share (0 to 1) of the way from the player to where the
camera wants to be that is allowed. The player takes the smallest of it and the solids' `segmentFree`
and eases the camera there (quickly when it must come in, slowly going out).

Trap (carbon's nanotube, 2026-10-28): the gallery set the camera's position after the player had placed
it, every frame, outside the easing, and counted the tube's open mouth as a wall. As carbon went in, the
camera was thrown from four metres behind to its back, then let out again: 2.2 m jumps in single
frames ("the camera jumps and throttles"). Now the tube's two ends and the dome's door are open
(`allotropes.js` `cameraClear`), the life dome's round wall the same way (`life.js`), and
`tools/nav_probe.py` measures the worst frame (0.01 m).

## Panels and exhibits

- A world opens a panel with `ctx.showPanel(level => ({ title, kicker, color, blocks }))`: the engine
  keeps the maker and writes the panel again when the level changes while it is open (Explorer and
  Scientist open different texts; the open one used to stay as it was).
- The panel remembers which exhibit it tells about (`store.panelFrom`). Another exhibit in reach is
  still offered beside the open panel; E or the button uses it and its panel takes the place; E with no
  other exhibit offered closes the panel. Walking away closes it (`player.keepReading`).

## Checking it

`MSYS_NO_PATHCONV=1 py -3.11 tools/nav_probe.py` (dev server on 5310; `--only first|look|tube|panel|touch`,
`--base` for the live site): first person turns, the view looks up, helium framed on a computer and a
phone, the nanotube walked in and out frame by frame, a panel following the level, a neighbour exhibit
offered and switched to, the pinch, no jump button. About a minute.
