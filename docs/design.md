# Element Worlds: design

Started 2026-10-27. The living design of the project: change it when a decision changes, and say why.

## What it is

A 3D periodic table in the browser. The 118 elements stand as cubes on a plaza under the stars (the
elements were made in stars). Pick one and step inside: each cube is bigger on the inside, like the
Tardis, a world about that element to explore, walking in first person or playing the element's own
character (its Atomling).

Made for two people at once: Artur (10) meeting the periodic table, and his father exploring the
science. Every screen works at two depths, **Explorer** (the default, plain words, big pictures) and
**Scientist** (the real numbers, units, configurations, isotopes, the why).

Later, the same world grows into combining elements: molecules, alloys, reactions, materials, and
mechanics, engineering and chemistry games. Everything below is shaped so that this needs no rewrite
(see "Molecules and alloys").

## Decisions and their reasons

1. **Inside the cube: both options, combined (the atrium and its wings).** Every cube opens into the
   same kind of room, the atrium: a 16 m hall behind a 3 m door (bigger on the inside), laid out the same
   way for every element and built from the element's data, so all 118 can be entered from the first day
   and two elements can be compared by walking through both. From the atrium, arches lead to **wings**:
   worlds designed for that one element, any size or shape (a sky deck for oxygen, a walk-through
   nanotube for carbon). A fixed cube could not hold a sky or a forest; a free design per element would
   leave 116 empty cubes for a long time and nothing in common between them.
2. **Characters are built from the element's real properties (the Atomling grammar, below).** One rule
   set gives all 118 a character today; elements of a family look related (as the chemistry is), and the
   differences that remain are real ones (size from the atomic radius, number of hands from the bonds it
   forms). Reading an Atomling teaches the element. Bespoke touches (an accessory, a pose) come on top,
   element by element.
3. **Hands are bonds.** An Atomling has as many hands as bonds it usually forms (H 1, O 2, N 3, C 4,
   noble gases none). Molecules later are Atomlings holding hands: water is oxygen holding two hydrogens,
   a double bond is two hands held. This is the seam where the molecule game attaches.
4. **Two depths of content, one switch.** Each text exists as `kid` and `sci`; the Scientist switch also
   changes what the 3D shows (Bohr shells or orbitals, numbers with units).
5. **Same stack as pokemon-site** (Vite 5, React 18, three.js 0.181, i18next, Tailwind 3): the arena's
   know-how and code carry over (touch stick, weak-device detection, loaders, sound). Plain three.js
   modules for the 3D, React only for the HUD, a small store between them.
6. **Procedural 3D first.** Lattices, nanotubes, buckyballs, orbitals and atoms are exact geometry made
   in code; the Atomlings are generated from data. Blender (the pokemon project's pipeline: baked light,
   KTX2) comes in later for rich environments, through the same loaders.
7. **Languages:** European Portuguese and English from the start, Polish and German since 2026-10-28
   (`docs/knowledge/translating.md`; element names for all 118 in all four);
   the i18n layout is pokemon-site's, so German, Japanese and Chinese can follow.

## The plaza (outside)

- The table lies on a dark glossy plaza at night: 18 columns, 7 periods, the f-block as two rows in
  front with a gap (lanthanum to lutetium, actinium to lawrencium; group 3 shows Sc and Y with a link to
  the f-block rows, as most school tables do). Period 1 is farthest from the starting view, the f-block
  nearest, so the overview reads like the printed table.
- Cubes: 3 m, rounded edges, lit from inside in their family's colour (glowing rims), the number, symbol
  and name on the top face (read from above) and the symbol and name on the front face (read when
  walking). Opaque glowing blocks, not clear glass: clear glass hides the cubes behind it in three.js.
- Overview camera (orbit, zoom, pan, limits). Hover lifts a cube and shows its card; a click selects it,
  the camera frames its front, its Atomling appears on top and waves, the card offers "Enter". In Explorer
  the card tells the Atomling's facts (what it says to "Tell me something" in its hall), one at a time:
  the arrows, a click on the text or T go through them (`ElementCard.jsx` `Facts`; every element has 3
  to 5). Arrow keys
  move the selection, Enter goes in.
- Family legend: hover or tap a family to light it and dim the rest.
- Trends (both depths since 2026-10-29: the user looked for it in Explorer): cubes stretch into bars by a property (atomic radius, electronegativity, first
  ionisation energy, melting point, density, atomic mass, year of discovery) with a colour scale and a
  legend; unknown values stay flat and faded. The periodic trends become visible landscapes.
- Entering: the camera flies to the front face, the door opens with light, a short white fade, the
  atrium fades in. Leaving through the atrium's door returns you in front of the cube.

## The atrium (every element, from data)

A 16 m cube of a hall, pale surfaces tinted by the family colour.

- Centre: **the atom**, floating: the nucleus (real counts of protons and neutrons of the commonest
  isotope, packed), the electron shells as tilted rings with their real electron counts orbiting, the
  outer (valence) shell highlighted with its empty slots shown for main-group elements. Scientist: the
  configuration written out, later the orbitals as clouds.
- Stations round the walls, the same place for every element: Identity (number, symbol, name and its
  origin, mass, family, group, period, block), Inside the atom, At room temperature (state, melting and
  boiling points with a thermometer, density compared with water), Discovery (year, who, where), Where it
  is found (crust, sea, body, stars), Uses. Data-driven stations exist for all; story stations need
  written content and show "being built" until then.
- The floor has the periodic table inlaid with this element's tile glowing (where you are).
- Doors: the south wall is the way out to the plaza; the north, east and west walls hold up to three
  arches to the element's wings, each named and with an icon; an element without wings shows closed
  arches ("being built").
- The host Atomling lives here: idles by the atom, turns to the visitor, waves and greets.
- Discoveries: reading a station or an exhibit collects it ("4 of 12 discovered"), kept on the device.

## Wings (one element each)

**Carbon** (the first two):
1. *Diamond, graphite and company* (the allotropes): a gallery with a graphene floor (glowing hexagons:
   you walk on one layer of carbon atoms); a diamond lattice (ball and stick, tetrahedral) beside a cut
   brilliant with real dispersion; graphite as stacked sheets that slide (why pencils write); a
   nanotube tunnel to walk through into a C60 buckyball dome; the press that turns graphite into diamond
   (high pressure, high temperature).
2. *Carbon of life*: a garden where a tree breathes in CO2 molecules and gives out O2 (a link to
   oxygen); "you are 18% carbon"; the carbon cycle; carbon-14 dating.

**Oxygen** (the first two):
1. *The air* (the sky deck): a platform above the clouds among floating molecules in the real
   proportions (78 N2, 21 O2, 1 Ar per 100, one CO2 per 2500); the ozone layer above catching the sun's
   UV; where the oxygen came from (plants, plankton, the Great Oxidation 2.4 billion years ago).
   Breathing (2026-10-29, `wings/oxygen/airBreath.js`): glass lungs between a column of the air breathed
   in and one of the air breathed out, each stacked by gas (21% oxygen in, about 16% out; 0.04% carbon
   dioxide in, about 4% out); E starts the breathing and E again holds the breath (the user: one breath
   was over before the breath out was seen). `tools/breath_probe.py` films two breaths. Liquid oxygen
   (pale blue) poured between a magnet's poles hangs there; liquid nitrogen falls through (`airO2.js`).
2. *Fire*: a stone chamber with a campfire; the fire triangle (take away a side and the fire dies); the
   candle under a jar (the oxygen gauge falls, the flame dies); the glowing splint that bursts into flame
   in pure oxygen (the school test for oxygen); methane burning atom by atom; rust as slow burning.
Next for oxygen: a ride with a red blood cell (where the breathed oxygen goes).

A wing is a module (see Architecture); adding one never touches the engine.

## Atomlings: the grammar

| Element property | What the Atomling shows |
|---|---|
| Bonds it usually forms | Number of hands (0 to 4): 1 at the side, 2 both sides, 3 adds one on the head, 4 is two pairs (carbon) |
| Valence electrons | A hoop around the body with the outer electrons orbiting; main-group elements also show the empty places of their octet (or duet), which the hands are reaching to fill |
| Full outer shell (noble gases) | The hoop rises above the head as a halo; no hands; serene closed eyes |
| Nucleus and inner shells | Seen inside the translucent body (non-metals, gases) or through a round belly window (metals) |
| Atomic radius | Height (covalent radius; the lanthanide contraction shows as siblings getting smaller) |
| Atomic mass | Heft: heavier walks slower with deeper steps (speed from anatomy, as in the arena) |
| State at 20 °C | Solid walks on two feet; liquid (Hg, Br) slides on a melting base; gas floats with a wispy tail, high if lighter than air (H2, He, Ne), low if heavier (O2, Cl2, Rn) |
| Metal, metalloid, non-metal | Metals are polished metal (most silvery, copper, gold, caesium's pale gold, osmium's blue) with a glowing core; metalloids are half metal, half matte; non-metals are soft and translucent |
| Colour | The element's CPK colour (the molecule-model colour: C dark grey, O red, N blue, H white), as body colour for non-metals and as glow, eyes and hoop for metals |
| Family | A family mark: alkali metals a flame tuft and a hand holding out their electron; alkaline earths two nubs; transition metals a smith's helmet; halogens a spiky crest and a grabbing hand; lanthanides a gem; actinides and other radioactive ones a pulsing glow; superheavies (Z 104+) flicker like holograms, since only a few atoms ever existed |
| Signature | An object from its story, worn or held (75 of 118 since 2026-10-28: helium's balloon, carbon's pencil, neon's sign, gold's crown, einsteinium's hair; `characters/signatures.js`) |

## Modes and controls

- Inside, two modes with one switch (V or the button): **Character** (third person, default: you play the
  room's Atomling) and **First person**.
- Computer: W A S D or the arrows, drag to look (first person: a click locks the pointer, Esc frees it),
  Shift runs, Space jumps, E uses, V switches view.
- Touch: the arena's stick bottom left, drag on the right half to look, buttons for use, jump and view.
- Outside: the overview camera. Walking on the plaza as an Atomling comes later.

## Molecules and alloys (the extension path)

1. Now: `src/chem/` holds atoms with their hands (valence slots) and molecules as graphs (atoms, bonds
   with orders, 3D positions). The wings already use it to show O2, N2, O3, CO2, H2O, CH4.
2. Next: a Molecule Lab world where Atomlings join hands; a molecule is valid when every hand is held
   (a double bond takes two); known molecules are recognised by their graph; shape from VSEPR.
3. Then: reactions with energy (burning methane), the forge for alloys (metallic bonding; steel is iron
   with a little carbon), materials and their properties, quests and puzzles ("make water", "build a
   diamond").

## Architecture

- `src/data/`: `elements.json` (generated, 118 elements: PubChem, mendeleev, names) and `elements.js`
  (lookups and derived values: table position, shells, valence, hands, family).
- `src/chem/`: atom model (shells from the configuration, octet slots, hands), molecule graphs.
- `src/engine/`: renderer and loop, quality tiers, input (keys, pointer, touch), the player (first and
  third person, collisions), interaction prompts, doors and transitions, a store for the HUD.
- `src/worlds/`: `plaza/`, `atrium/`, `wings/<element>/`. A world is a module with
  `build(ctx, params)` returning `{ root, spawn, colliders, floor(x, z), interactables, doors,
  update(dt, t, player), dispose() }`; worlds are loaded on demand.
- `src/characters/`: the Atomling grammar (`traits.js`), the builder (`atomling.js`), procedural motion.
- `src/ui/`, `src/pages/`: the HUD in React; routes `/` (plaza), `/e/:symbol` (atrium),
  `/e/:symbol/:wing`, `/atomlings` (all 118 characters, for review).
- Content per element: `src/content/<Symbol>.js`, texts as `{ 'pt-pt': { kid, sci }, en: { kid, sci } }`.

## Data and sources

- PubChem periodic table (public domain, US government): mass, CPK colour, configuration,
  electronegativity, ionisation energy, electron affinity, oxidation states, state, melting and boiling
  points, density, family, year of discovery.
- mendeleev (Python package, MIT): numeric fields only (covalent radii, abundances, isotopes, discoverers,
  discovery places). Its descriptive texts come from other publishers and are not used.
- Names in European Portuguese follow the IUPAC Portuguese recommendations (Sociedade Portuguesa de
  Química): azoto, hidrogénio, crómio, árgon, xénon, nihónio, tenesso, oganésson.
- Raw sources are kept in `scripts/data/` so a build never needs the network.

## Devices and performance

- The arena's rule: phones and weaker computers get the light mode (no bloom or transmission, lower pixel
  ratio, fewer particles). Worlds load on demand; the plaza opens first.
- The plaza draws all 118 cubes as one instanced mesh, and the labels as one batched text.

## Testing

- `node --test`: data integrity (118 elements, unique table positions, shells add up to Z, hands and
  valence of known elements), molecule graphs (every hand used).
- Browser probes (`tools/`, Python Playwright, headless Edge as in the arena): screenshots of the plaza,
  a selection, each atrium and wing, the Atomlings page, on a computer and a phone screen; console errors;
  frame times.

## What is built, and what comes next

What was built and when: `docs/history.md`. What comes next, every idea and what waits on the user:
the studio (`docs/studio/backlog.json`, shown to the user at
https://claude.ai/artifact/UnVCX3MBSmNViL4Vu6XJAG; `docs/knowledge/update-dashboard.md`). Since
2026-10-29 Claude picks what to build from the top of its queue and says why; the user steers there
with Sooner, Later and Not now, notes and ideas of their own (and Artur's). Still open for the user:
the Atomlings' look, and the site's name (working title: Element Worlds, Mundos dos Elementos).
