# Sodium: the Periodic Videos room (brief)

Video: "Sodium - Periodic Table of Videos" (Brady Haran with Professor Sir Martyn Poliakoff and Neil
Barnes, University of Nottingham, 2010), https://www.youtube.com/watch?v=7IT2I3LtlNE, 4:42. Watched
2026-10-30 (`tools/pv/pv.py`: every cut, frames every 2 s, zooms at 2 to 4 frames a second on the
moments the stations copy, the timed captions). What follows is our own
description of what the video shows, for designing the room; the room retells it in the game's words.
Numbers come from the game's data, not the video (it says "about 96 degrees"; sodium melts at 97.8 °C).

## What the video shows

| Time | Where | What happens |
| --- | --- | --- |
| 0:00 to 0:58 | lab, fume cupboard | A rod of sodium (about 2 kg) comes out of a tin of oil on a knife; a slice is cut off: soft, bright silver inside, a white crust forming fast. Why it is kept under oil (air and moisture). |
| 1:04.5 to 2:10 | outdoor courtyard, brick walls, a red bench | About a gram dropped into a stoneware dog bowl of water with long tongs (1:36.0): a white bead skates with a faint fizz, steam wisps from 1:46, the hydrogen lights at 1:47.0 (eleven seconds after the drop) with an orange-red flame riding on the bead; a bead of molten sodium jumps out. |
| 2:14.0 to 2:50 | the professor's office | A broken salt (NaCl) window from an infrared cell: the cracks run at right angles, because the ions sit in a cubic pattern. |
| 2:59.5 to 3:25 | the office | A lamp made from a lump of rock salt dug from an underground salt mine; switched on, it glows orange. |
| 3:26.2 to 4:15 | the courtyard, on the ground | "Take two": a bigger lump into a bigger bowl: smoke and orange sparks from 3:47.5, then at 3:50.5 the bang, a radial spray of orange sparks with white smoke, over in about 0.3 s. A card (4:15.5 to 4:21): sodium is dangerous, never handle it without expert supervision. |
| 4:18 to 4:35 | over the card, then the office | Why the professor likes sodium: Na was his mother's nickname as a child. |

## The room

A corner of a chemistry department: a lab bench with a fume cupboard, a door out to a brick courtyard,
the professor's desk with books and the salt lamp. The video plays on a screen by the door; each station
has "Watch this part", which plays the video from that station's time (YouTube's player, `start`).

1. **The oil tin** (watch from 0:00). Lift the rod out on the knife, choose where to cut, slice. The new face shines
   silver and turns dull white in a few seconds (a timer the player watches). Explorer: soft enough to
   cut like cold butter; so eager to react that it is kept under oil. Scientist: 4 Na + O2 -> 2 Na2O, then
   NaOH with the air's moisture; one outer electron, easily given away (first ionisation energy from the
   data).
2. **The courtyard bowl** (watch from 1:04.5; take two from 3:26.2). Pick a lump (small, medium, large), drop it with long tongs.
   It floats (density 0.97 g/cm3, water 1.00), melts into a ball (97.8 °C) and skates on its fizz;
   after a wait (eleven seconds in the video; the waiting is part of it) a medium or large lump lights
   the hydrogen: the orange flame (sodium's yellow-orange line at 589 nm,
   the same line as in the neon workshop's spectroscope); the large one spits a molten bead and ends
   with a bang. Afterwards (the game's own addition, not in the video): a drop of indicator turns the
   water pink, because the bowl now holds an alkali. Scientist: 2 Na + 2 H2O -> 2 NaOH + H2, the heat
   that lights the hydrogen. A card the same as the video's: never try this; sodium is for experts.
3. **The salt window** (watch from 2:14.0). A clear plate of salt in its cell: tap to crack it; the cracks run at
   right angles; zoom in until the cubic pattern of Na+ and Cl- shows (the Molecule Lab's NaCl). Scientist:
   why salt lets infrared through where glass does not (an infrared view through both).
4. **The salt lamp** (watch from 2:59.5). Switch it on. Rock salt is the same sodium chloride, laid down when ancient
   seas dried up and dug from salt mines.
5. **The professor's note** (watch from 4:18): a small card on the desk with the story of "Na", credited.

## Built from

- Apparatus to model (Blender, the pokemon project's pipeline, or code where simpler): the oil tin, the
  knife, the stoneware bowl, the red bench, long tongs, the salt window in its cell, the salt lamp, the
  courtyard (brick walls, paving).
- Effects in code (they answer the player): the cut face's tarnish, the skating ball and its fizz, the
  hydrogen's orange flame, the molten bead, smoke, cracks along a cubic grid.
- Shared with other rooms (the kit): the lab bench and fume cupboard, the courtyard bowl (lithium,
  potassium, rubidium and caesium do the same, harder each time), the screen, the flame-colour line.
