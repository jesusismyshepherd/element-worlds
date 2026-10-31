# The Star Forge (`/stars`)

Make the elements as the universe did (the user marked it Sooner, 2026-10-30; the studio's item
`star-forge`). Three places in one orbit world, on top of the Atom Forge's physics (`atom-forge.md`), built to
the user's rule for every station from the start: each step is a tap on the thing it is about, what varies
smoothly is a slider, the prompt names the next tap. Reached from the plaza's top bar (🌟, and the ☰ menu on
a phone), the Atom Forge (its right column), carbon's `stars` picture room (a link in its third panel), the
passport's star missions.

## The three places

- **A star's life** (`star`): the star in cutaway, a quarter wedge cut out, its layers drawn as an onion on
  the two cut faces with each layer's symbols (H, He, C O, O Ne Mg, O Mg, Si S, Fe Ni), the burning ones
  flickering. Not to scale: the cores are drawn far bigger than they are, so every layer can be read.
  Under it, the nursery: a red dwarf (0.25 suns), the Sun, 3, 15 and 25 suns. Tap one (or slide the mass,
  0.1 to 25 suns, on a log scale) to choose it; tap its core to light hydrogen, again for each next
  burning (the life slider runs through them too, each phase an equal share of it, the real age beside
  it); in its last burning a tap on the core ends it: a red dwarf shrinks into a helium white dwarf, a
  Sun-like star puffs off a planetary nebula round a white dwarf, a heavy one collapses into a supernova
  (a flash, debris in the layers' colours) leaving a neutron star (a pulsar's beams) or a black hole (its
  disc). An old giant's glowing helium shell (a tap on that ring of the cut face) goes to the slow
  capture; a neutron star, tapped, to the rapid one ("find it a partner"); a white dwarf or a black hole,
  tapped, starts a new star of the same mass.
- **The slow capture** (`slow`, the s-process) inside an old giant's helium layer (a warm haze round the
  visitor, the carbon-13 pocket glowing green where the neutrons come from): tap the nucleus to give it a
  neutron; it waits, or beta-decays (an electron streaks off, a neutron turns red). The neutron rain is a
  slider (one per tap up to about two a second). From iron-56 it climbs the valley to lead and bismuth,
  through technetium (Merrill's proof, 1952), and goes round lead and bismuth for ever.
- **The rapid capture** (`rapid`, the r-process): two neutron stars orbit with trails and ripples of
  gravitational waves; tap them and they spiral in (the orbit shrinks as (t_c - t)^1/4), flash, and a
  kilonova cloud flies out, blue turning red; a nucleus in it swells along the neutron-rich edge of the
  chart up to plutonium (22 steps a second, about 12 s); tap the cloud and it decays back: gold, platinum,
  uranium and 54 elements in all light up.

The HUD (`src/ui/StarHud.jsx`, loaded lazily with the world): the places and the sliders on the left (with
the path on the chart of nuclides, `NeutronPath.jsx`, at the slow and rapid places, or "Why iron is the
end", `BindingCurve.jsx`, at the star), the card at the top (`worlds/stars/card.js`: the title, the next tap
👉, the lines at the reader's depth, the link to carbon's triple-alpha room during helium burning), the
missions and the table (`StarTable.jsx`) on the right. An upright phone: the card at the top, a bar at the
bottom (the sliders, the places, 🏆, 🧪 the table, 📈 or 🗺️), each tool opening above the bar. A phone on its
side: a column each side.

The table: "What you made" lights each element in the colour of its source (the Big Bang's three at the
start; dying low-mass stars for a star under 8 suns and the slow capture; exploding massive stars; merging
neutron stars); "Where the atoms came from" colours every element by Jennifer Johnson's shares, with "You,
by mass" (a bar: about 73 % exploding massive stars, 16 % dying low-mass stars, 10 % the Big Bang, 1 %
exploding white dwarfs).

## Files

- `src/worlds/stars/stars.js`: the 3D (the star, the nursery, the ends, the two nuclei, the merger), its taps,
  the camera flying between the places (`go(place)`), what is shared. `life.js`: a star's phases by mass
  (pure). `neutrons.js`: the two captures on `chem/nucleus.js` (pure). `words.js`: every word, four
  languages, both depths, the missions. `card.js`: the card's words from the state (pure). Tests beside
  each (`life.test.js`, `neutrons.test.js`, `words.test.js`: every state's card in every language).
- `src/data/origins.js` (+ `origins.test.js`): Johnson's shares and the body. `src/data/binding.json`:
  binding energy per nucleon for A = 1 to 260 (`scripts/data/export_binding.py`, mendeleev's AME masses).
- Shared files touched: `registry.js` (`/stars`, kind `stars`), `Hud.jsx` (the 🌟 page link, the breadcrumb,
  the lazy HUD), `RoomHud.jsx` (where someone is), `Passport.jsx` (star missions, the "Star maker" badge for
  five), `ForgeHud.jsx` (the link), carbon's `scenes/C/stars.js` (the link), `audio/sound.js` (a bed),
  `stats/analyze.js` and `names.js` (the place), the locale files (`hud.stars`, `stars.title`,
  `passport.stars`, `passport.badge.stars`), `tools/hud_probe.py` (two scenes).

## The science and its sources

- Hydrogen burning (the main sequence), years: red dwarfs from Adams, Laughlin & Graves 2004 (0.08 suns 12
  trillion, 0.25 suns 1 trillion); the Sun 10 billion; 3, 5, 8 suns from Maeder & Meynet 1989 (as fitted in
  Romano et al. 2005); 15, 20, 25 suns from Woosley, Heger & Weaver 2002 as listed in Paxton et al. 2011
  (MESA, table 12). Log-log lines between.
- Heavy stars' later burnings: Woosley, Heger & Weaver 2002 (the same table): a 20-sun star burns helium
  1.17 million years, carbon 976 years, neon 0.6 years, oxygen 1.25 years, silicon 11.5 days; a 25-sun star
  silicon in 18 hours. Core temperatures of a 20-sun star: Heger, Woosley, Fryer & Langer 2003
  (astro-ph/0211062, table 1): 37 million K, 190 million, 0.87, 1.6, 2.0, 3.3 billion. The Sun's core now
  15.7 million K. Products of each burning: Heger's lecture table (JINA).
- The Sun's later life: about 100 million years of core helium burning, about 20 million on the asymptotic
  giant branch, a white dwarf of about 0.54 suns (Schröder & Smith 2008, Sackmann et al. 1993, via Wikipedia).
- The slow capture: about 10^8 neutrons per cm^3 from 13C(α,n)16O, so a neutron about every century (1/(nσv),
  σ ≈ 100 mb); a nucleus that decays sooner than 100 years decays first. The rapid capture: the most
  neutron-rich nucleus of each element ever made (the chart's edge) as the path, plutonium the top; products:
  each mass number's last nucleus on the path, decayed until stable or longer-lived than 500 million years,
  from mass 70.
- GW170817 (17 August 2017, LIGO and Virgo, 130 million light-years, a gamma-ray burst 1.7 s after), the
  kilonova AT2017gfo (0.03 to 0.05 suns of r-process matter), strontium in it (Watson et al. 2019), a few to
  ten Earth masses of gold (estimates differ: 3 to 13 in one, 10 to 15 in another).
- Binding energy per nucleon: ⁶²Ni 8.7946 MeV the peak, ⁵⁶Fe 8.7904, ⁴He 7.0739, ¹²C 7.6801, ²³⁸U 7.57.
- Johnson's chart: `origins.js` header.

### What is approximate (flagged)

- Johnson's shares are read from a picture (her 2017 chart, as encoded by CMG Lee on Wikimedia Commons),
  rounded to whole per cent; the 2019 Science version may differ by a few per cent. Some shares look
  doubtful (bismuth 99.5 % from neutron star mergers, lead 47 % from low-mass stars where her own post says
  "most of the Pb"); kept as published there.
- Low-mass stars other than the Sun: the red-giant climb (a tenth of the main sequence for the Sun, less for
  heavier stars), helium burning (100 million years, or 19 % of the main sequence when shorter) and the
  asymptotic giant branch (a fifth of the helium burning) are scaled, not modelled.
- Stars of 10 to 15 suns take the 15-sun star's carbon to silicon burnings; the core temperatures of every
  heavy star are the 20-sun star's; hydrogen's between 1 and 25 suns a power law through the Sun and 20 suns.
- The border masses (no helium below 0.5 suns, white dwarfs to 8, oxygen-neon white dwarfs to 10, a black
  hole above 20) are round numbers for borders that are still studied; the words say so.
- The slow capture takes each branch point one way (krypton-85, samarium-151 really split); the rapid path
  runs along the most neutron-rich nuclei made in laboratories, nearer stability than the real path, so
  its waiting points at N = 50, 82, 126 do not show as clearly; its products are counted one per mass
  number, not weighted by how many of each.
- What each place makes on the table is the main products (the secondary ones from Heger's table), plus,
  for a supernova, fluorine, scandium and copper to rubidium (Johnson gives them to exploding massive stars).

## Shared in a room

`shared` (net/shared.js, `multiplayer.md`): `star` (`{ m, x, lit, end, n }`: n counts lives and ends, so a
new one plays live), `slow` (`{ Z, N, n }`; a change plays as a neutron in, a beta decay, an alpha out),
`rapid` (`{ phase, n, t }`: the merge, the flood and the decay run on by their time, `ago` included), `made`
(the table, `["26m", ...]`). Each one's own: the place on show and the camera, the words, the missions, the
neutron rain (each visitor's rain adds neutrons for all). Only the one who did a thing lights its elements
and gets its missions; the others take the table as shared. `tools/shared_steps/stars.json` drives the
probe through a Sun's whole life, the slow capture and a supernova.

## Checking

- `MSYS_NO_PATHCONV=1 python tools/shot.py /stars --port <p> --steps "js:__ew.world.tapCore(); wait:2; shot:a"`.
  The world's steps: `pick(id)`, `setMass(m)`, `setLife(x)`, `tapCore()`, `tapShell()`, `tapRemnant()`,
  `go(place)`, `tapNucleus()`, `setRate(r)`, `slowReset()`, `tapPair()`, `tapCloud()`, `origins()`;
  `screenOf(what)` gives a thing's place on the screen for real taps.
- `py -3.11 tools/shared_probe.py --world /stars --base http://localhost:<p>`; `tools/hud_probe.py --scene stars`.
- Measured 2026-10-31 (headless Edge on this machine, the dev server): first visit 1.4 s (code 36 ms, built in
  46 ms, shaders warmed in 0.23 s); 27 shader programs (18 in light mode, no bloom); 60 frames a second at
  each place. The shared probe all ok; the HUD probe ok on all six screens after the phones got compact
  sliders (label and value beside the slider) and the places in a row.

## Traps

- The 3D fonts have no superscripts and no arrows: the 3D labels say "Fe-56" and "13C + 4He > 16O + n";
  superscripts only in the HUD.
- The slow place's haze is a back-faced sphere 180 m away: seen from the star it would glow in the sky, so it
  shows only while the camera is there (and switches during the flight).
- A world's taps in an orbit world are its own (pointerdown/up on the canvas, a ray at its things); the
  engine's `pointAt`/`onTap` are for walking worlds.
- Twenty-two steps a second of the rapid path, each a `store.set`, flooded React: the HUD is told at most
  every 0.15 s during the flood.

## Next

- (Done 2026-10-31: the Atom Forge in a room, one atom built together and a race: `multiplayer.md`, "The
  forge together".)
- An exploding white dwarf (a type Ia supernova) from a white dwarf with a companion: the iron, manganese
  and nickel Johnson gives to them.
- A real r-process abundance curve (weighted by waiting times) beside the products, and the waiting points.
