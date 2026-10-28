import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AIR_WORDS } from './airWords.js'
import { FIRE_WORDS } from './fireWords.js'
import { AIR_MIX, O2_HISTORY, o2At, UV_THROUGH, CANDLE_O2, REACTIONS, atomsOf } from './oxygenData.js'
import { chem, chemBlocks, at } from './oxygenText.js'
import { MOLECULES, checkHands } from '../../../chem/molecules.js'

/** Every leaf of an object as [path, value]. */
function leaves(o, path = '') {
  if (o == null || typeof o !== 'object') return [[path, o]]
  return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}
const shape = o => leaves(o).map(([p, v]) => `${p.replace(/\.\d+(\.|$)/g, '.#$1')}:${typeof v}`).sort()

const LANGS = ['en', 'pt-pt', 'pl', 'de']
const SAMPLES = [0, 1, 3, 7, 0.5, 2.4, 0.012, 0.022, 0.54]
// what each function is called with: the rust's day counter whole days 0 to 7, the time travel 0 to 4.6 billion years
const samplesOf = p => (p.endsWith('day') ? [0, 1, 2, 3, 5, 7] : SAMPLES)
/** Every text of a language, the functions' answers included. */
const texts = L => leaves(L).flatMap(([p, v]) => (typeof v === 'function' ? samplesOf(p).map(d => [`${p}(${d})`, String(v(d))]) : [[p, v]]))

for (const [name, W] of [['air', AIR_WORDS], ['fire', FIRE_WORDS]]) {
  for (const lang of LANGS.slice(1)) {
    test(`${name}: ${lang} has the same words as English`, () => {
      assert.deepEqual(shape(W[lang]), shape(W.en))
    })
  }

  test(`${name}: no em dash, nothing empty`, () => {
    for (const lang of LANGS) {
      for (const [p, v] of leaves(W[lang])) {
        if (typeof v === 'function') {
          for (const d of SAMPLES) assert.ok(!String(v(d)).includes('—'), `${lang}.${p}(${d})`)
          continue
        }
        assert.equal(typeof v, 'string', `${lang}.${p}`)
        assert.ok(v.trim().length > 0, `${lang}.${p} is empty`)
        assert.ok(!v.includes('—'), `${lang}.${p} has an em dash`)
      }
    }
  })

  test(`${name}: decimal commas and no en dash as a pause outside English`, () => {
    for (const lang of LANGS.slice(1)) {
      for (const [p, v] of texts(W[lang])) {
        assert.ok(!/\d\.\d/.test(v), `${lang}.${p} has a decimal point: ${v}`)
        assert.ok(!v.includes(' – '), `${lang}.${p} has an en dash`)
      }
    }
  })

  test(`${name}: every panel exists at both depths`, () => {
    for (const lang of LANGS) {
      for (const [id, ex] of Object.entries(W[lang])) {
        if (!ex?.panel) continue
        assert.ok(ex.panel.kid?.length > 0, `${lang}.${id}.panel.kid`)
        assert.ok(ex.panel.sci?.length > 0, `${lang}.${id}.panel.sci`)
      }
    }
  })
}

test('Portuguese is European Portuguese (AO90 spellings)', () => {
  const text = [AIR_WORDS, FIRE_WORDS].flatMap(W => leaves(W['pt-pt']).map(([, v]) => (typeof v === 'string' ? v : ''))).join(' ')
  // Brazilian forms and pre-1990 spellings
  for (const bad of ['elétron', 'ozônio', 'nitrogênio', 'oxigênio', 'hidrogênio', 'reacção', 'acção', 'eléctr', 'óptic', 'fotosíntese']) {
    assert.ok(!text.includes(bad), `found "${bad}"`)
  }
  for (const good of ['eletrões', 'ozono', 'fotossíntese', 'azoto', 'comburente', 'árgon']) assert.ok(text.includes(good), `missing "${good}"`)
})

test('counts in Polish and German take their real plural forms', () => {
  const pl = AIR_WORDS.pl.goe.when
  assert.equal(pl(2.4), '2,4 miliarda lat temu')
  assert.equal(pl(0.022), '22 miliony lat temu')
  assert.equal(pl(0.012), '12 milionów lat temu')
  assert.equal(pl(0.54), '540 milionów lat temu')
  assert.equal(AIR_WORDS.de.goe.when(2.4), 'vor 2,4 Milliarden Jahren')
  assert.equal(AIR_WORDS.de.goe.when(0.54), 'vor 540 Millionen Jahren')
  assert.deepEqual([1, 3].map(FIRE_WORDS.pl.rust.day), ['1 dzień', '3 dni'])
  assert.deepEqual([1, 3].map(FIRE_WORDS.de.rust.day), ['1 Tag', '3 Tage'])
  // the fire triangle's missing sides: Polish after "brakuje" in the genitive, German nouns capitalised
  assert.equal(FIRE_WORDS.pl.triangle.missingNames.oxygen, 'tlenu')
  assert.equal(FIRE_WORDS.de.triangle.missingNames.oxygen, 'Sauerstoff')
})

test('formulas get subscripts, numbers and words do not', () => {
  assert.equal(chem('CO2 and 2 H2O'), 'CO₂ and 2 H₂O')
  assert.equal(chem('C6H12O6 + 6 O2'), 'C₆H₁₂O₆ + 6 O₂')
  assert.equal(chem('4 Fe + 3 O2 → 2 Fe2O3'), '4 Fe + 3 O₂ → 2 Fe₂O₃')
  assert.equal(chem('21% of 100, in 1987, UV-B, AO90'), '21% of 100, in 1987, UV-B, AO90')
  assert.equal(chem('O3, bent'), 'O₃, bent')
  assert.deepEqual(chemBlocks([{ rows: [['N2', '78%']] }]), [{ rows: [['N₂', '78%']] }])
  assert.equal(at({ kid: 'a', sci: 'b' }, 'scientist'), 'b')
  assert.equal(at({ kid: 'a', sci: 'b' }, 'explorer'), 'a')
})

test('the box of air: 100 molecules in the proportions of dry air', () => {
  assert.equal(AIR_MIX.N2 + AIR_MIX.O2 + AIR_MIX.Ar, 100)
  assert.ok(Math.abs(AIR_MIX.N2 - 78.08) < 0.5 && Math.abs(AIR_MIX.O2 - 20.95) < 0.5 && Math.abs(AIR_MIX.Ar - 0.93) < 0.5)
})

test('the oxygen history: none before the Great Oxidation, 21% today, rising at 2.4 billion years', () => {
  assert.equal(o2At(4.6), 0)
  assert.equal(o2At(3.0), 0)
  assert.ok(o2At(2.0) > 0.5)
  assert.equal(o2At(0), 21)
  for (let i = 1; i < O2_HISTORY.length; i++) assert.ok(O2_HISTORY[i][0] < O2_HISTORY[i - 1][0], 'time runs forward')
})

test('UV, the candle', () => {
  assert.deepEqual(UV_THROUGH, { A: 1, B: 0.1, C: 0 })
  assert.ok(CANDLE_O2.start === 20.9 && CANDLE_O2.out > 15 && CANDLE_O2.out < 17)
})

test('every reaction shown keeps its atoms', () => {
  for (const [name, r] of Object.entries(REACTIONS)) assert.deepEqual(atomsOf(r.left), atomsOf(r.right), name)
  assert.deepEqual(atomsOf(REACTIONS.methane.left), { C: 1, H: 4, O: 4 })
})

test('the molecules drawn hold all their hands (O2 double, O3 bent with charges, CO2, H2O, CH4)', () => {
  for (const id of ['O2', 'N2', 'O3', 'CO2', 'H2O', 'CH4']) assert.deepEqual(checkHands(MOLECULES[id]), [], id)
})
