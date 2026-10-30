# Silicon: the Periodic Videos room (brief)

Video: "Silicon - Periodic Table of Videos" (Brady Haran with Professor Sir Martyn Poliakoff and a colleague in
a green lab coat, University of Nottingham, 2008), https://www.youtube.com/watch?v=a2aWO5cL410, 3:37.
Watched 2026-10-30 (`tools/pv/pv.py`: 12 cuts, frames every 2 s, the timed captions). Our own description
of what the film shows, for designing the room; the room retells it in the game's words, with the game's
numbers. Silicon was chosen second because, after Oxygen, its hall is the most visited (the family
dashboard, 2026-10-30: Oxygen 13 visits, Silicon 3, Sodium 2, Carbon 2).

## What the film shows

| Time | Where | What happens |
| --- | --- | --- |
| 0:00 to 0:10 | a workshop with shelves of apparatus | A lump of silicon comes out of its bottle: silvery, crusty, glittering ("I'll have to wash my hands after this"). |
| 0:14 to 0:50 | the professor's office | Silicon is very common: sand is silica, silicon with oxygen; silicates (silicon, oxygen and a metal) make an enormous number of minerals ("boring unless you are a specialist, but like everything, interesting once you go into it"). |
| 0:50.0 to 1:05 | the workshop bench | The polycrystalline lump on a wooden bench: the element of electronic components, computers, the camera filming. |
| 1:05.6 to 1:30 | the office | In his watch, the camera, computers; he fetches a wafer in a clear case: a grid of gold-brown chips. |
| 1:30.6 to 1:47 | the workshop | Chips are made from silicon grown as one single crystal; this lump is polycrystalline: its grains catch the light, each a different size. |
| 1:55.4 to 2:47 | the office | A 20 cm wafer: pure silicon on the back (a grey mirror), on the front rows of chips (he thinks Pentium 4s) with connectors on either side; grown many at once, cut apart and tested, the good ones go into computers, the rest are thrown away; now 30 cm wafers carry many more. |
| 2:47.6 to 2:57 | the workshop | A single crystal's surface bends light off at different angles: a rainbow. |
| 2:57.7 to 3:27 | the office | Silicon nitride: very tough and very light, so car turbochargers' impellers are made of it: it spins up fast when you press the accelerator and does not fly apart. |

## The room

The same lab as every element's (`src/worlds/wings/pv/lab.js`). "Watch this part" plays each station's
moment; the professor retells his own lines (0:14, 0:24, 1:05, 1:55, 2:18, 2:35, 2:57).

1. **The silicon lump** (bench, in the fume cupboard; watch from 0:50.0): take it out of its bottle and turn
   it under the lamp: the grains glint one by one, each a crystal of its own. Beside it, a tray of sand and a
   lens: sand is silica, SiO2, the same silicon held by oxygen. Explorer: the most common element after
   oxygen in the Earth's crust, but never found pure. Scientist: polycrystalline versus single crystal; how
   silicon is won from quartz (carbon at about 2000 °C) and purified.
2. **The chip line** (the bench's other end; watch from 2:14): a wafer covered in chips: cut it apart, test
   each chip (a light: green works, red does not), the good ones go into a computer, the bad ones into the
   bin; then do it again with a 30 cm wafer and count how many more fit (2.25 times the area). The game's
   own: a few chips fail at random, as in a real factory (the "yield").
3. **The wafer and its rainbow** (on the desk; watch from 1:55.4, and the rainbow from 2:47.6): turn the wafer
   over: the grey mirror of pure silicon on the back, the chips on the front; tilt it under the lamp and a
   rainbow sweeps across the chips (a diffraction grating: the circuits' repeating patterns are as fine as a
   CD's grooves, about 1.6 micrometres apart, or finer; the rows of chips themselves are far too coarse).
4. **The turbocharger** (the courtyard's red bench: a car part outside; watch from 2:57.7): two impellers side
   by side, steel and silicon nitride; press the pedal: the ceramic one, much lighter, spins up first; let go
   and both slow down. Scientist: densities (silicon nitride about 3.2 g/cm3, steel about 7.9 g/cm3), why less
   mass spins up faster for the same push.
5. **The minerals** (the side table; watch from 0:14): quartz, mica, feldspar and a garnet: tap each to see
   how its silicon and oxygen are joined (frameworks, sheets, single tetrahedra).

The professor's lines come from the film only (`prof` in `Si.words.js`); the green-coated presenter's
lines are not given to the professor.
