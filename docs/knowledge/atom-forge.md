# The Atom Forge (`/forge`, `/forge?z=Fe`)

Build an atom from protons, neutrons and electrons. The protons make the element (its Atomling pops up
on the pedestal), the neutrons its isotope, the electrons its charge. The chart of nuclides says whether
the nucleus holds together; an unstable one trembles and decays before your eyes, down whole decay
chains. Every hall's "Inside the atom" panel links here with its element (`/forge?z=C`).

## Pieces

- `src/chem/nucleus.js`: the physics, pure and tested (`nucleus.test.js`).
  - `nuclide(Z, N)`: `{ kind, t, abundance, modes }`, kind one of empty, neutron (one alone: 609 s),
    neutrons (two or more: unbound), stable, radioactive, instant (under 10^-12 s, or only sheds
    nucleons), unmeasured (made, not timed), unknown (`side`: 'rich' or 'poor' past the drip lines, or
    null: a superheavy not made yet).
  - `decay(Z, N)`: one decay by the strongest mode: `{ mode, Z, N, emitted }` (fission keeps the heavier
    piece; an unknown nucleus drips a neutron or a proton toward the known ones). `chain()` follows it
    to the end (uranium-238 reaches lead-206 in 8 alpha and 6 beta steps: a test).
  - `ionShells(Z, E)`: an ion's shells (taken from the outside first, added to the outer shell), so
    Fe2+ loses its 4s electrons. `commonestN(Z)`, `nuclideSymbol`, `halfLifeParts`.
- `src/data/nuclides.json` (70 KB, loaded only by the forge): `{ Z: [[A, t, abundance, modes]] }`, built
  by `npm run data:nuclides` (`scripts/build-nuclides.mjs`) from `scripts/data/nuclides.json`, which
  `scripts/data/export_nuclides.py` exports from the mendeleev package (3557 nuclides from NUBASE, with
  decay modes). The isotope fixes are shared with the elements' data: `scripts/data/fixes.mjs`
  (unconfirmed superheavy isotopes out, newer half-lives in).
- `src/worlds/forge/forge.js`: the 3D (an orbit world like the lab). `words.js`: the missions and every
  line the forge says, in all four languages, both depths. `src/ui/ForgeHud.jsx` (the HUD words it from the
  state, so a change of language or level shows at once) and `src/ui/NuclideChart.jsx` (the whole chart
  and a close-up with names; a tap builds that nucleus).
- `src/worlds/common/pack.js`: `packBall`, an even ball of points (the forge's and the halls' nuclei).

## The beam (2026-10-28)

Fire n, p, d, t, alpha, carbon-12, oxygen-16, calcium-48, iron-58 or zinc-70 at the nucleus on the table
(`BEAMS`, `collide` in `chem/nucleus.js`; the HUD's beam panel, a 🚀 toggle on phones). The beam's
nucleons fly in together; on arrival the compound nucleus reacts:
- Famous reactions go as history saw them (`REACTIONS`): Rutherford's N-14 + alpha -> O-17 + p (1919),
  Chadwick's Be-9 + alpha -> C-12 + n (1932), Cockcroft and Walton's Li-7 + p -> 2 alpha, the
  Joliot-Curies' Al-27 + alpha -> P-30 + n (1934), U-235 + n fission to Ba-141, Kr-92 and 3n (1938),
  D-T fusion, the Sun's p + p -> d + e+ + neutrino, the triple alpha (Be-8 + alpha -> C-12, the Hoyle
  state), cosmic rays' N-14 + n -> C-14 + p. Each with its words (`words.js` FAMOUS).
- Otherwise the two fuse and a heavy compound boils off neutrons: three on an actinide target (hot
  fusion), one on lead or bismuth (cold fusion), then more until it reaches a seen nucleus. That rule
  alone gives the real syntheses: Cf-249 + Ca-48 -> Og-294 + 3n (Dubna 2006), Bk-249 + Ca-48 ->
  Ts-294 + 3n (2010), Bi-209 + Fe-58 -> Mt-266 + n (GSI 1982), Pb-208 + Zn-70 -> Cn-277 + n,
  Bi-209 + Zn-70 -> Nh-278 + n (RIKEN 2004): `nucleus.test.js` checks them, and that every famous
  reaction keeps its protons and neutrons.
- The atom keeps its charge through a reaction (the beam's protons arrive bare; the target was
  neutral, so the product is too). What the beam made stays on show a moment before it decays.
- Seven beam missions (21 in all).

## Rules of play

- A nucleus that cannot last decays by itself once the player stops building for 1.6 s (instant ones
  after 0.8 s, half-lives under 3 s after about a second); longer ones wait for the "Decay" button,
  which says how long nature would take ("Wait 5700 years"). "Hold" (a force field) stops the
  self-decay while building: on the way to a stable nucleus you pass unstable ones (lithium-5 cannot
  exist, which is also why stars cannot easily build past helium).
- After a decay the atom keeps its charge (an electron capture so takes one of its own electrons).
- Electrons: none without protons; at most three extra; an atom without a positive electron affinity
  (noble gases, nitrogen, beryllium, magnesium) loses an extra electron after a second; two or more
  extra are said to exist only inside crystals.
- Missions (`words.js` MISSIONS, discoveries `forge:<id>`): from a hydrogen atom to oganesson-294,
  carbon-14 turning into nitrogen, and the whole uranium-238 chain to lead.

## Traps

- A golden-angle spiral (`y` from `i * 0.618`, angle `i * 2.39996`) ties a point's height to its angle:
  every direction lies on one curve, and a big nucleus drew as a crescent (the halls' too). `packBall`
  takes its two numbers from the R2 sequence; `pack.test.js` checks that each octant gets its share.
- mendeleev's intensities of minor decay modes lose their exponents (U-238: "SF 5.44" is 5.44e-5 %);
  the forge only uses the order of the modes, never their percentages.
- NUBASE lists theoretical modes for stable nuclides (lead-206 "alpha"): `build-nuclides.mjs` drops them.
- Technetium's longest-lived isotope is Tc-97 (4.21 million years, NUBASE2020), not Tc-98.
- A JSON import in Node needs `with { type: 'json' }`; the forge's chart is a dynamic `import()` for
  Vite, so the tests read the file themselves (`useChart`).
- On an upright phone the particles are a bar at the bottom (the side column covered the atom); the 3D
  then frames the atom in the middle and stands the Atomling in front of it.

## Checking

`MSYS_NO_PATHCONV=1 python tools/shot.py /forge --steps "js:__ew.world.goTo('U'); wait:3; shot:u; js:__ew.world.decay(); wait:0.4; shot:alpha"`;
`__ew.world.set(Z, N, E)`, `add('p'|'n'|'e')`, `remove(...)`, `decay()`, `nucleons()` (positions, for
probes). `--phone` for the bottom bar. `tools/forge_probe.py` builds every element, decays it, makes ions
and the odd cases, and reads the HUD in all four languages and both depths (about a minute). A beam that
would pass element 118 is refused with why (note `beyond`): zinc-70 at uranium made 122 and broke the names.

## Next

- Fusion in a star: four protons to helium-4 step by step (the proton-proton chain), then the triple
  alpha to carbon-12 (the Hoyle state). The Star Forge (`/stars`, `star-forge.md`, 2026-10-31) now tells
  each burning star by star and catches neutrons both ways on this forge's chart and decays; the step-by-step
  chain in this forge is still to do.
- Binding energy per nucleon as a curve beside the chart: the Star Forge has it (`BindingCurve.jsx`,
  `src/data/binding.json`); this forge's chart could show it too.
