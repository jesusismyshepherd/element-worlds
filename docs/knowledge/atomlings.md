# Atomlings: how they are made, and the traps met

The grammar (what an element's properties become) is in `docs/design.md`; the code in
`src/characters/traits.js` (pure: element in, description out, tested in `traits.test.js`) and
`src/characters/atomling.js` (draws only what the traits say). Look at them on `/atomlings`
(`?set=p2`, `?set=lanthanides`, `?only=C,O,N,H`) or with `python tools/lineup.py p2 --only ...`.

## How a character is put together

- Body: a lathe of a smooth profile (`PROFILES`: a gumdrop for walkers, a teardrop for floaters, a
  melting base for liquids), scaled to the height (from the covalent radius) and width.
- Face: eyes and a smile placed on the surface by `onSurface(obj, heightFraction, angle)`, which also
  turns them to the surface normal. The element's tile from the table (symbol and number) on the belly.
- Hoop: the outer electrons as Lewis places (`chem/atom.js` `lewisSlots`, `lewisAngle`): one per side
  first, then pairs; hollow rings are free places. Noble gases wear theirs as a halo. Metals that give
  their outer electrons (s-block, aluminium) hold them in their hands instead.
- Hands: `layout` by count (1 at the side, 2 both sides, 3 adds one on the head, 4 two pairs reaching
  up and down: carbon). A metal's hands hold out an electron each.
- Inside a see-through body: the nucleus (protons and neutrons in their real proportion, up to 70
  shown) and the inner shells as small orbits.
- Motion is procedural (`update(dt, time, { speed, run, grounded })`): breathing, blinking, steps and
  arm swing at the walk's pace, float bob, slide wobble, `wave()`, `hop()`, `poof()`.
- Bespoke looks (element by element, on top of the grammar): `SIGNATURE` in traits.js. Carbon: a clear
  diamond body with graphite hands.
- Signatures: an object from the element's own story, worn or carried (see below).

## Signatures (objects from an element's story)

75 of the 118 carry one (2026-10-28). `look.js` `SIGNATURE` maps a symbol to a kind, `signatures.js`
builds each kind from a few primitives, `explain.js` `SIG` says why (both languages; the card on
/atomlings reads it out), `signatures.test.js` checks them all.

- Chosen where the object is truly the element's: a use everyone meets (Al can, F toothbrush, Cl swim
  ring, Zn sun cream, In phone, Am smoke alarm), the name's story (Th hammer, U Uranus, Np Neptune,
  Pu Pluto, Se Moon, Te Earth, Pm torch, Es Einstein's hair, Md a little periodic table, Lu the Eiffel
  Tower, Cn the Sun and Earth, flags: Ge, Po, Fr, Nh, Yb), or the thing it is famous for (Os dumbbell,
  the densest; Ir asteroid, the dinosaurs' iridium layer; Ga a spoon melting in tea; Bi stepped
  crystal). Facts are checked against the element's own words in `src/content/<Symbol>.js`.
- The list: H drop, He balloon, Li battery, Be Webb telescope mirror, B slime, C pencil, N crisp
  packet, O fishbowl, F toothbrush, Ne neon heart, Na salt shaker, Mg leaf, Al can, Si chip, P match,
  S rotten egg, Cl swim ring, Ar pillow, K banana, Ca bone, Ti jet plane, V spanner, Cr ruby, Fe magnet
  and nail, Co paintbrush, Ni 1 euro coin, Cu coil, Zn sun cream, Ga melting spoon in a mug, Ge flag,
  Se crescent Moon, Kr magnifying glass, Sr glow-in-the-dark star, Rh rose, Pd toy car, Ag Olympic
  silver medal, In phone, Sn tin soldier, Te Earth, I flask of violet vapour, Xe ion-engine probe,
  Cs alarm clock, Ba green firework, La camera, Ce flint sparks, Pr glassblower's goggles, Nd
  headphones, Pm torch, Eu euro banknote, Dy wind turbine, Yb Swedish flag, Lu Eiffel Tower, W bulb,
  Os dumbbell, Ir asteroid, Pt ring, Au crown, Hg thermometer, Pb fishing rod and sinker, Bi rainbow
  crystal, Po flag, Rn radiation sign, Fr flag, Ra glowing watch, Th hammer, U Uranus, Np Neptune,
  Pu Pluto with its heart, Am smoke alarm, Cm Mars rover, Es wild white hair, Md little periodic
  table, No Nobel medal, Cn Sun and Earth, Nh flag.
- Where they go (the kit in `signatures.js`): in a hand (`hand()`: the left hand, or the only one; a
  four-handed one lifts it in an upper hand, `prefer: 'low'` carries it low), on the wrist (`wrist()`),
  on the head (`head()`), on the body's surface (`surf`/`normalAt`/`onSurface`), beside the body
  (`beside()`, for the noble gases, which have no hands) or under it (`under()`, argon's pillow).
- Things in hands are drawn 1.5 times life size (flags 1.15): at life size they did not read on the
  page, where a character is about 80 px wide in a row of 18. Judge them on the page's own rows.
- A held object stays upright: its anchor undoes the shoulder's turn every frame (Euler `'ZYX'` with
  the shoulder's angles negated), so it rides up with a wave without tipping; the wave's wiggle (the
  swing) still moves it, so a flag waves.
- Without arms (the Molecule Lab: `{ arms: false, hoop: false }`) objects held, beside or under the body
  are left out; the worn ones (`WORN`: crown, leaf, swim ring, headphones, hair...) stay.
- Materials: only `MeshStandardMaterial` (opaque or see-through) and `MeshBasicMaterial`, front faces
  only, no maps, so a signature compiles no new shader program; each colour is made once per
  Atomling (`kit.solid`, `glow`, `clear`, `line`). Closed solids (extrusions, lathe rings, thin boxes)
  instead of two-sided planes; gem facets from `toNonIndexed()` + `computeVertexNormals()`, not
  `flatShading`. The test enforces it.

## Traps (and the fix that worked)

- Arms invisible: rotating a hanging arm about z by `+a` swings it toward +x; the first version used
  `-side * spread`, which swung every arm into the body. A hand on the +x side turns by `+spread`.
- A dark round badge under the eyes read as a screaming mouth, and the letter O on the belly as an
  open mouth: the symbol is a light periodic-table tile (with the atomic number) low on the belly.
- Glass that hid the nucleus: three.js multiplies what is seen through a transmission material by
  the base colour (carbon's grey let through about 14%). Keep the base colour light (mixed 30% to
  white) and put the colour into `attenuationColor`, with a thin `thickness`.
- The nucleus behind the face: from the front the eyes covered it. It sits low and a little behind
  the centre, glowing (emissive), so it shows through the glass in most views.
- A character on the plaza is tiny from the selection camera: it stands on its cube at 2.1 times its
  size, in a holder group (the Atomling sets its own root's scale while it pops up), with a light.
- Light mode (phones) has no transmission: see-through bodies become milky (transparent, no depth
  write). Fine at phone size.
- A metal holds out an electron at its fingertips: an object in a metal's hand sits inward and back of
  the fist (0.055 H; a one-handed metal, which waves with it, 0.11 H, because the wave lifts the
  electron above the fist) and starts above it. `signatures.test.js` measures the gap at rest and in
  the middle of a wave, and that nothing held goes into the body.
- Objects too small: at life size, hand-held objects vanished on the page's rows; drawn 1.5 times
  larger they read (flags already read at 1.15). Big white things glare in the bloom (argon's first,
  white pillow read as a glowing slab): mid-tones. Silver on a silver body does not read (gallium's
  bare spoon, silver's medal): give it context or contrast (a blue mug, a blue and red ribbon,
  mercury's column on a navy board).
- Shapes that say the wrong thing at card size: a flask of liquid nitrogen with white puffs read as a
  mug of something foaming (nitrogen carries a crisp packet now, puffed up with nitrogen); the group 6
  helmet's visor, a standing half ring, read as a bucket handle (now a brim over the eyes).
- The /atomlings row spaced characters by the body's radius only: neon's sign and lithium's battery
  were cut off at the ends of a row. `lineup.js` now leaves room for each signature's reach, and aims a
  little lower so the row stands above the legend's panel.
- Testing in Node: `atomling.js` imports troika (the belly tile's text), which needs a browser global.
  Set `globalThis.self = globalThis` before importing it and build with `badge: false`.
- Probing while other agents work: their saves reload the dev page under a running probe (the page's
  panels come back, the camera resets), and a half-saved JSON of theirs makes the server answer 500.
  Re-run; a probe that re-applies its setup after a reload helps.

## Open (for the user to judge)

- The look itself: proportions, faces, the metals' plainness (silver gumdrops with a family mark).
- The signatures (2026-10-28): 75 objects; 43 elements still have none (most of the transition metals
  of periods 5 and 6, Sm Gd Tb Ho Er Tm, most actinides from Ac to Lr, the superheavies). Ideas kept
  back: Er an optical fibre (the internet's undersea cables), Tb the green of screens, Gd an MRI
  scanner, Rg an X-ray of a hand (Röntgen), Bh the Bohr atom, Cd yellow paint.
- Many characters on screen at once (the lineup's 18) cost one draw call per part; fine on a computer.
