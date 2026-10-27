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
- Signatures (element by element, on top of the grammar): `SIGNATURE` in traits.js. Carbon: a clear
  diamond body with graphite hands.

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

## Open (for the user to judge)

- The look itself: proportions, faces, the metals' plainness (silver gumdrops with a family mark).
- Accessories from each element's story (iron's horseshoe, neon's sign, helium's balloon).
- Many characters on screen at once (the lineup's 15) cost one draw call per part; fine on a computer.
