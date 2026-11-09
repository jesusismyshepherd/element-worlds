import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, element } from '../data/elements.js'
import {
  HARMONICS, radial, outerPeak, slaterZeff, madelung, MADELUNG, boxes, electronsOf, psi, finder, random, skinOf,
  radiusWithin, densityProfile, nodesOf, skinSampled,
} from './orbitals.js'
import { SKINS } from './orbitalSkins.js'
import { subshells } from './atom.js'

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} is not ${b} ± ${tol}`)

// an even spread of directions (a Fibonacci sphere) for integrals over the sphere
const sphere = (N = 6000) =>
  Array.from({ length: N }, (_, i) => {
    const z = 1 - (2 * (i + 0.5)) / N
    const s = Math.sqrt(1 - z * z)
    const a = i * 2.399963229728653
    return [s * Math.cos(a), s * Math.sin(a), z]
  })

test('the real spherical harmonics are normalised and orthogonal', () => {
  const dirs = sphere()
  for (const set of HARMONICS) {
    for (const a of set) {
      for (const b of set) {
        const mean = dirs.reduce((acc, [x, y, z]) => acc + a.f(x, y, z) * b.f(x, y, z), 0) / dirs.length
        near(mean * 4 * Math.PI, a === b ? 1 : 0, 2e-3, `Y${a.sub}·Y${b.sub}`)
      }
    }
  }
  // the shader's indices are 0 to 15, each once
  assert.deepEqual(HARMONICS.flat().map(h => h.k), Array.from({ length: 16 }, (_, i) => i))
})

test('hydrogen radial waves are normalised and peak where they should', () => {
  for (const [n, l, Z] of [[1, 0, 1], [2, 0, 1], [2, 1, 3.25], [3, 2, 6.25], [4, 3, 11], [6, 0, 2.2], [7, 1, 3]]) {
    const top = (2 * n * n + 12 * n) / Z
    let acc = 0
    const N = 20000
    for (let i = 1; i <= N; i++) {
      const r = (i / N) * top
      acc += r * r * radial(n, l, Z, r) ** 2 * (top / N)
    }
    near(acc, 1, 2e-3, `∫r²R² for ${n}${'spdf'[l]}`)
  }
  near(outerPeak(1, 0), 1, 1e-4, '1s peak')
  near(outerPeak(2, 1), 4, 1e-3, '2p peak')
  near(outerPeak(2, 0), 3 + Math.sqrt(5), 1e-3, '2s outer peak')
  near(outerPeak(3, 2), 9, 1e-3, '3d peak')
  // 2s changes sign once (one radial node), 3s twice
  const signs = (n, l) => {
    let changes = 0
    let last = Math.sign(radial(n, l, 1, 0.01))
    for (let r = 0.02; r < 60; r += 0.01) {
      const s = Math.sign(radial(n, l, 1, r))
      if (s && s !== last) [changes, last] = [changes + 1, s]
    }
    return changes
  }
  assert.equal(signs(2, 0), nodesOf(2, 0).radial)
  assert.equal(signs(3, 0), nodesOf(3, 0).radial)
  assert.equal(signs(4, 2), nodesOf(4, 2).radial)
})

test("Slater's rules give the textbook charges", () => {
  const z = (sym, n, l) => {
    const el = element(sym)
    return slaterZeff(subshells(el.config), el.z, { n, l })
  }
  near(z('He', 1, 's'), 1.7, 1e-9, 'He 1s')
  near(z('C', 2, 'p'), 3.25, 1e-9, 'C 2p')
  near(z('O', 2, 'p'), 4.55, 1e-9, 'O 2p')
  near(z('Na', 3, 's'), 2.2, 1e-9, 'Na 3s')
  near(z('Fe', 3, 'd'), 6.25, 1e-9, 'Fe 3d')
  near(z('Fe', 4, 's'), 3.75, 1e-9, 'Fe 4s')
  near(z('Zn', 4, 's'), 4.35, 1e-9, 'Zn 4s')
  near(z('Zn', 3, 'd'), 8.85, 1e-9, 'Zn 3d')
})

test("Madelung's order, and the elements that break it", () => {
  assert.deepEqual(MADELUNG.slice(0, 12).map(s => `${s.n}${s.l}`), ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s'])
  assert.equal(madelung(118).reduce((a, s) => a + s.count, 0), 118)
  for (const sym of ['Cr', 'Cu', 'Nb', 'Mo', 'Ru', 'Rh', 'Pd', 'Ag', 'Pt', 'Au', 'La', 'Ce', 'Gd', 'Th', 'Pa', 'U', 'Np', 'Cm', 'Lr']) {
    assert.ok(electronsOf(element(sym)).exception, `${sym} breaks the rule`)
  }
  for (const sym of ['H', 'C', 'O', 'Fe', 'Zn', 'Kr', 'Mn', 'Eu', 'Pb']) assert.equal(electronsOf(element(sym)).exception, null, sym)
  const cr = electronsOf(element('Cr')).exception
  assert.deepEqual(cr.rule, [{ id: '4s', count: 2 }, { id: '3d', count: 4 }])
  assert.deepEqual(cr.real, [{ id: '4s', count: 1 }, { id: '3d', count: 5 }])
  assert.ok(cr.halfOrFull)
  assert.ok(electronsOf(element('Cu')).exception.halfOrFull)
  assert.ok(!electronsOf(element('Nb')).exception.halfOrFull)
})

test("Hund's boxes and unpaired electrons", () => {
  assert.deepEqual(boxes('p', 2), [1, 1, 0])
  assert.deepEqual(boxes('p', 4), [2, 1, 1])
  assert.deepEqual(boxes('d', 6), [2, 1, 1, 1, 1])
  assert.deepEqual(boxes('f', 14), [2, 2, 2, 2, 2, 2, 2])
  const unpaired = { H: 1, He: 0, C: 2, N: 3, O: 2, F: 1, Ne: 0, Cr: 6, Mn: 5, Fe: 4, Cu: 1, Zn: 0, Gd: 8, Eu: 7 }
  for (const [sym, n] of Object.entries(unpaired)) assert.equal(electronsOf(element(sym)).unpaired, n, sym)
})

test('every element: its electrons add up, every subshell has a sensible cloud', () => {
  for (const el of ELEMENTS) {
    const info = electronsOf(el)
    assert.equal(info.subs.reduce((a, s) => a + s.count, 0), el.z, el.symbol)
    for (const s of info.subs) {
      assert.equal(s.boxes.reduce((a, b) => a + b, 0), s.count, `${el.symbol} ${s.id} boxes`)
      assert.equal(s.orbitals.length, 2 * s.lq + 1)
      assert.ok(s.zeff > 0 && Number.isFinite(s.zh) && s.zh > 0, `${el.symbol} ${s.id} charge`)
      assert.ok(s.n <= 7 && s.lq <= 3)
    }
    // the innermost clouds are the smallest
    const first = info.subs.find(s => s.id === '1s')
    for (const s of info.subs) assert.ok(s.peak >= first.peak - 1e-12, `${el.symbol} ${s.id} inside 1s`)
    assert.equal(info.predicted, !!el.configPredicted)
  }
  // superheavies' configurations are predictions, and say so
  assert.ok(electronsOf(element('Og')).predicted)
  assert.ok(!electronsOf(element('Fe')).predicted)
})

test('places drawn by Born’s rule: mean distances as quantum mechanics has them', () => {
  // <r> = (3n² − l(l+1)) / (2Z)
  for (const [n, lq, k] of [[1, 0, 0], [2, 1, 3], [3, 2, 4]]) {
    const o = { n, lq, k }
    const find = finder(o, 1, random(5))
    let acc = 0
    const N = 30000
    for (let i = 0; i < N; i++) {
      const [x, y, z] = find()
      acc += Math.hypot(x, y, z)
    }
    near(acc / N, (3 * n * n - lq * (lq + 1)) / 2, 0.06 * n * n, `<r> ${n}${'spdf'[lq]}`)
  }
  // pz: the electron is above the xy plane half the time, and its wave's sign follows z
  const pz = finder({ n: 2, lq: 1, k: 3 }, 1, random(11))
  let up = 0
  for (let i = 0; i < 4000; i++) {
    const [, , z, sign] = pz()
    if (z > 0) up++
    assert.equal(sign, Math.sign(z) || 1)
  }
  near(up / 4000, 0.5, 0.04, 'pz above')
  // the same seed draws the same places (each screen in a room sees the same photos)
  const a = finder({ n: 3, lq: 2, k: 7 }, 2, random(42))
  const b = finder({ n: 3, lq: 2, k: 7 }, 2, random(42))
  for (let i = 0; i < 20; i++) assert.deepEqual(a(), b())
})

test("the 90 % skin of hydrogen's 1s is the sphere of 2.66 a0", () => {
  const o = { n: 1, lq: 0, k: 0 }
  near(radiusWithin(o, 1, 0.9), 2.66, 0.02, '90 % radius')
  const skin = skinOf(o, 1)
  // ψ² = e^(−2r)/π on the skin
  near(skin.level, Math.exp(-2 * 2.661) / Math.PI, 0.0015, 'density on the skin')
  near(skin.reach, 2.66, 0.05, 'reach')
  // a pz skin: the density on its axis at its reach is the skin's level
  const pz = { n: 2, lq: 1, k: 3 }
  const s = skinOf(pz, 1)
  near(psi(pz, 1, 0, 0, s.reach) ** 2 / s.level, 1, 0.08, 'pz reach on its axis')
})

test('the whole atom: density highest at the nucleus, every subshell counted', () => {
  const info = electronsOf(element('Ar'))
  const prof = densityProfile(info, [0.001, 0.5, 1, 2, 4])
  for (let i = 1; i < prof.length; i++) assert.ok(prof[i].total < prof[i - 1].total)
  assert.equal(prof[0].parts.length, info.subs.length)
})

test('the stored skins agree with skins drawn afresh, and scale with the charge', () => {
  // every orbital up to 7p has its skin stored
  for (let n = 1; n <= 7; n++) for (let lq = 0; lq < Math.min(n, 4); lq++) for (const h of HARMONICS[lq]) assert.ok(SKINS[`${n},${h.k}`], `${n},${h.k}`)
  for (const [n, lq, k] of [[1, 0, 0], [2, 1, 3], [3, 2, 8], [4, 3, 12], [6, 0, 0]]) {
    const o = { n, lq, k }
    const fresh = skinSampled(o, 1, 40000, 77)
    const stored = skinOf(o, 1)
    near(stored.level / fresh.level, 1, 0.05, `level ${n},${k}`)
    near(stored.reach / fresh.reach, 1, 0.05, `reach ${n},${k}`)
    const z3 = skinOf(o, 3)
    near(z3.level, stored.level * 27, 1e-12, 'Z³')
    near(z3.reach, stored.reach / 3, 1e-12, '1/Z')
  }
})
