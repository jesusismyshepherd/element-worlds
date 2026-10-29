# The neon sign workshop (`/e/<Symbol>/signs`)

One wing shared by the six noble gases (He, Ne, Ar, Kr, Xe, Rn); the visitor's gas starts every
exhibit. How a shared wing works (one module, the target symbol, discoveries per hall):
`docs/knowledge/adding-a-wing.md`, "A wing shared by several elements". The history: `docs/history.md`.

- `signs.js`: the workshop, where everything stands, the exhibits and their panels.
- `signs.room.js`: the brick room at night, lamps, the doorway, the glass-bender's corner.
- `signs.bench.js`: the filling bench (five tubes bent into He, Ne, Ar, Kr, Xe; manifold, pump, gauge)
  and radon's lead box.
- `signs.optics.js`: the spectroscope (NIST lines) and the atom's energy ladder.
- `signs.parts.js`: the name wall (your word in neon), the history board, the balloons.
- `neonTube.js` + `tubeFont.js`: tubes swept along a font of bent glass (Portuguese, Polish and German
  letters too); `nameOverlay.js`: the little window for writing your name (plain DOM, at an edge).
- `spectrumCanvas.js`: spectra drawn on a canvas. `nobleData.js`: the numbers and their sources.
- `kit.js`: maths, canvas textures, screens, words at the reader's depth, the exhibits' rules.
- `signs.words.js`: every word, four languages, both depths. `noble.test.js`.
