import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SIGNS_WORDS } from './signs.words.js'
import {
  GASES, SIGN_GASES, LINES, SUN_1868, LADDER, CM_TO_EV, N_AIR, levelsEV, glowOf, densityOf, AIR_DENSITY, balloonOf,
  stepBalloon, wavelengthRGB, colourKey, lineBrightness,
} from './nobleData.js'
import { GLYPHS, sanitizeName, layoutText, tubeLength, NAME_MAX } from './tubeFont.js'
import { element, nameOf } from '../../../data/elements.js'
import { WINGS } from '../../registry.js'
import en from '../../../i18n/locales/en.json' with { type: 'json' }
import pt from '../../../i18n/locales/pt-pt.json' with { type: 'json' }

/** Every leaf of an object as [path, value]. */
function leaves(o, path = '') {
  if (o == null || typeof o !== 'object') return [[path, o]]
  return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}
const shape = o => leaves(o).map(([p, v]) => `${p.replace(/\.\d+(\.|$)/g, '.#$1')}:${typeof v}`).sort()
const holes = s => [...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',')

test('words: English and Portuguese have the same shape and the same placeholders', () => {
  assert.deepEqual(shape(SIGNS_WORDS.en), shape(SIGNS_WORDS['pt-pt']))
  const pts = new Map(leaves(SIGNS_WORDS['pt-pt']))
  for (const [p, v] of leaves(SIGNS_WORDS.en)) assert.equal(holes(pts.get(p)), holes(v), `placeholders differ at ${p}`)
})

test('words: no em dash, nothing empty', () => {
  for (const lang of ['en', 'pt-pt']) {
    for (const [p, v] of leaves(SIGNS_WORDS[lang])) {
      assert.equal(typeof v, 'string', `${lang}.${p}`)
      assert.ok(v.trim().length > 0, `${lang}.${p} is empty`)
      assert.ok(!v.includes('—'), `${lang}.${p} has an em dash`)
    }
  }
})

test('words: every panel exists at both depths', () => {
  for (const lang of ['en', 'pt-pt']) {
    for (const [id, ex] of Object.entries(SIGNS_WORDS[lang])) {
      if (!ex?.panel) continue
      assert.ok(ex.panel.kid?.length > 0, `${lang}.${id}.panel.kid`)
      assert.ok(ex.panel.sci?.length > 0, `${lang}.${id}.panel.sci`)
    }
  }
})

test('words drawn in 3D keep to letters the 3D fonts have (no Greek, no superscripts but ² and ³)', () => {
  for (const lang of ['en', 'pt-pt']) {
    const W = SIGNS_WORDS[lang]
    const in3d = [
      W.back, W.kicker, ...['bench', 'radon', 'name', 'spectrum', 'atom', 'history', 'balloons'].flatMap(k => [W[k].title, W[k].screen.kid, W[k].screen.sci]),
      W.bench.hv, W.bench.air, W.radon.sign, W.radon.lines, W.spectrum.sun, W.spectrum.match, W.spectrum.footer.kid, W.spectrum.footer.sci,
      W.history.today, ...Object.values(W.history.captions), ...Object.values(W.atom.ladder),
    ]
    for (const s of in3d) assert.ok(!/[Ͱ-Ͽ⁰-₟¹]/.test(s), `${lang}: "${s}"`)
  }
})

test('Portuguese is European Portuguese (AO90 spellings)', () => {
  const text = leaves(SIGNS_WORDS['pt-pt']).map(([, v]) => v).join(' ')
  for (const bad of ['espectr', 'elétron', 'eletron', 'fóton', 'radioactiv', 'eléctr', 'electr', 'óptic', 'acção', 'exacto', 'actual', 'detector', 'íon ', 'hidrogênio', 'oxigênio', 'xenônio', 'criptônio', 'radônio', 'neônio', 'argônio']) {
    assert.ok(!text.includes(bad), `found "${bad}"`)
  }
  for (const good of ['eletrões', 'fotão', 'espetroscópio', 'radioativo', 'crípton', 'xénon', 'rádon', 'árgon', 'néon', 'hélio']) assert.ok(text.includes(good), `missing "${good}"`)
})

test('the six gases: the registry, the titles and the colours agree with the Atomlings', () => {
  for (const sym of GASES) {
    const wing = WINGS[sym]?.find(w => w.id === 'signs')
    assert.ok(wing, `${sym} has the workshop`)
    assert.equal(wing.side, 'n')
    assert.equal(wing.color.toLowerCase(), glowOf(sym).toLowerCase(), `${sym}'s arch is its discharge colour`)
    assert.ok(en.wings?.[sym]?.signs?.title, `en title for ${sym}`)
    assert.ok(pt.wings?.[sym]?.signs?.title, `pt title for ${sym}`)
  }
  assert.deepEqual(SIGN_GASES, GASES.filter(s => s !== 'Rn'))
})

test('the lines: visible, in order, and helium has the Sun\'s yellow line', () => {
  for (const sym of GASES) {
    const L = LINES[sym]
    assert.ok(L.length >= 8, `${sym}: ${L.length} lines`)
    for (let i = 0; i < L.length; i++) {
      assert.ok(L[i][0] >= 380 && L[i][0] <= 750, `${sym} ${L[i][0]}`)
      assert.ok(L[i][1] > 0)
      if (i) assert.ok(L[i][0] > L[i - 1][0], `${sym} in order at ${L[i][0]}`)
    }
    for (const [, I] of L) {
      const b = lineBrightness(sym, I)
      assert.ok(b >= 0.25 && b <= 1)
    }
  }
  const d3 = SUN_1868.find(l => l[2])[0]
  assert.ok(LINES.He.some(([nm]) => Math.abs(nm - d3) < 0.05), 'helium matches D3')
  for (const sym of ['Ne', 'Ar', 'Kr', 'Xe']) assert.ok(!LINES[sym].some(([nm]) => Math.abs(nm - d3) < 0.3), `${sym} does not match D3`)
})

test('the ladder: each line\'s levels give its wavelength (E = hc/lambda), below the ionisation energy', () => {
  for (const sym of GASES) {
    for (const l of LADDER[sym]) {
      const vacuum = 1e7 / (l.hi - l.lo)
      assert.ok(Math.abs(vacuum / N_AIR - l.nm) < 0.05, `${sym} ${l.nm}: levels give ${(vacuum / N_AIR).toFixed(3)}`)
      assert.ok(LINES[sym].some(([nm]) => Math.abs(nm - l.nm) < 0.05), `${sym} ${l.nm} is one of its lines`)
      const ev = levelsEV(l)
      assert.ok(ev.hi < element(sym).ie[0], `${sym}: ${ev.hi} eV is below ionisation`)
      assert.ok(Math.abs(ev.photon - 1239.84198 / vacuum) < 1e-3)
    }
  }
  assert.ok(Math.abs(levelsEV(LADDER.Ne[0]).photon - 1.936) < 0.002, 'neon 640.2 nm: 1.94 eV')
  assert.ok(CM_TO_EV > 1.2398e-4 && CM_TO_EV < 1.2399e-4)
})

test('the balloons: helium and neon rise, argon, krypton and xenon fall, the heavier the faster', () => {
  assert.ok(Math.abs(AIR_DENSITY - 1.293) < 0.001)
  const rho = GASES.map(densityOf)
  for (let i = 1; i < rho.length; i++) assert.ok(rho[i] > rho[i - 1], 'density follows the molar mass')
  const v = Object.fromEntries(SIGN_GASES.map(s => [s, balloonOf(s).terminal]))
  assert.ok(v.He > v.Ne && v.Ne > 0, `He ${v.He}, Ne ${v.Ne}`)
  assert.ok(v.Ar < 0 && v.Kr < v.Ar && v.Xe < v.Kr, `Ar ${v.Ar}, Kr ${v.Kr}, Xe ${v.Xe}`)
  // stepping the flight settles on the terminal speed
  for (const s of SIGN_GASES) {
    const b = balloonOf(s)
    let speed = 0
    for (let i = 0; i < 4000; i++) speed = stepBalloon(b, speed, 0.005)
    assert.ok(Math.abs(speed - b.terminal) < 0.01, `${s}: ${speed} vs ${b.terminal}`)
  }
})

test('colours of light', () => {
  const [r7, g7, b7] = wavelengthRGB(700)
  assert.ok(r7 > 0.8 && g7 === 0 && b7 === 0)
  const [r5, g5] = wavelengthRGB(530)
  assert.ok(g5 > r5)
  const [, , b4] = wavelengthRGB(450)
  assert.ok(b4 > 0.9)
  assert.equal(colourKey(587.56), 'yellow')
  assert.equal(colourKey(640.22), 'red')
  assert.equal(colourKey(473.42), 'blue')
  assert.equal(colourKey(420.07), 'violet')
})

test('the tube font: every letter a name may use, the symbols, and the gases\' names', () => {
  for (const s of GASES) for (const ch of s) assert.ok(GLYPHS[ch], `glyph for ${ch}`)
  for (const lang of ['en', 'pt-pt']) {
    for (const s of GASES) {
      const up = nameOf(element(s), lang).toLocaleUpperCase('pt-PT')
      assert.equal(sanitizeName(up), up, `${up} can be written`)
    }
  }
  for (const [ch, g] of Object.entries(GLYPHS)) {
    assert.ok(g.w >= 0)
    for (const st of g.s) {
      assert.ok(st.pts.length >= 2, `${ch} has a stroke with points`)
      for (const [x, y] of st.pts) {
        // marks may reach a little into the space between letters (1.5), never across it
        assert.ok(x >= -0.8 && x <= g.w + 0.8, `${ch}: x ${x}`)
        assert.ok(y >= -1.6 && y <= 7.9, `${ch}: y ${y}`)
      }
    }
  }
  assert.equal(sanitizeName('Artur'), 'ARTUR')
  assert.equal(sanitizeName('joão'), 'JOÃO')
  assert.equal(sanitizeName('maçã!'), 'MAÇÃ!')
  assert.equal(sanitizeName('Zoë 🎉 <3'), 'ZOË 3')
  assert.equal(sanitizeName('Łukasz'), 'UKASZ')
  assert.equal(sanitizeName('a'.repeat(30)).length, NAME_MAX)
  const lay = layoutText('NÉON')
  assert.equal(lay.glyphs.length, 4)
  assert.ok(lay.top > 7, 'the accent stands over the capitals')
  assert.ok(tubeLength('NEON') > tubeLength('NE'))
})
