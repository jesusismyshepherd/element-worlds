import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFormula } from '../../../chem/build.js'
import { bondCount } from '../../../chem/atom.js'
import { element } from '../../../data/elements.js'
import {
  REACTIONS, REACTION, MOLECULES, MAX_ATOMS, MAX_K, BOND, speciesOf, start, tally, isBalanced, multipleOf, divisor, enthalpy,
  baseEnthalpy, waterChoice, sideCount, canAdd, canRemove, clean, pairAtoms, shapeOf, footprint, arrange, isIonic, molarMass,
  boilLitres, stateOf, atomsOnSide, bodyRadius,
} from './chemistry.js'

test('every molecule is its formula, and every atom holds its hands (an ionic thread counts as given or taken)', () => {
  for (const [f, g] of Object.entries(MOLECULES)) {
    assert.deepEqual([...g.atoms].sort(), parseFormula(f).map(a => a.el).sort(), `${f}: atoms`)
    const held = g.atoms.map(() => 0)
    for (const [a, b, o] of g.bonds) {
      held[a] += o
      held[b] += o
    }
    // a metal standing alone (sodium, iron) is a piece of metal: its electrons are shared in the metal
    if (g.atoms.length === 1) continue
    // (an ionic thread is an electron given per hand: the ions' charges then add up to nothing)
    g.atoms.forEach((el, i) => assert.equal(held[i], bondCount(element(el)), `${f}: atom ${i} (${el}) holds ${held[i]}`))
  }
  assert.ok(isIonic(MOLECULES.NaCl, MOLECULES.NaCl.bonds[0]))
  assert.ok(!isIonic(MOLECULES.CaCO3, MOLECULES.CaCO3.bonds[0]), 'the carbonate C=O is shared')
  assert.ok(isIonic(MOLECULES.CaCO3, MOLECULES.CaCO3.bonds[3]), 'calcium holds the carbonate by attraction')
})

test('every reaction uses molecules the bench can draw, and its answer balances; none starts balanced but limestone', () => {
  for (const r of REACTIONS) {
    for (const f of speciesOf(r)) assert.ok(MOLECULES[f], `${r.id}: ${f}`)
    assert.equal(r.answer.length, speciesOf(r).length)
    assert.ok(isBalanced(r, r.answer), `${r.id}: the answer balances`)
    assert.equal(divisor(r.answer), 1, `${r.id}: the answer is the smallest whole numbers`)
    assert.equal(isBalanced(r, start(r)), r.id === 'limestone', `${r.id}: one of each`)
    // the answer fits on the bench, and can be reached one tap at a time
    assert.ok(atomsOnSide(r, r.answer, 'L') <= MAX_ATOMS && atomsOnSide(r, r.answer, 'R') <= MAX_ATOMS, `${r.id} fits`)
    assert.ok(r.answer.every(x => x <= MAX_K))
  }
})

test('the tally counts each element on both sides', () => {
  const r = REACTION.methane
  assert.deepEqual(tally(r, [1, 1, 1, 1]), [
    { el: 'C', left: 1, right: 1, ok: true },
    { el: 'H', left: 4, right: 2, ok: false },
    { el: 'O', left: 2, right: 3, ok: false },
  ])
  assert.deepEqual(sideCount(REACTION.photosynthesis, [6, 6, 1, 6], 'R'), { C: 6, H: 12, O: 18 })
  assert.ok(isBalanced(r, [2, 4, 2, 4]))
  assert.equal(multipleOf(r, [2, 4, 2, 4]), 2)
  assert.equal(multipleOf(r, [1, 2, 1, 3]), null)
  assert.equal(divisor([2, 4, 2, 4]), 2)
})

test('the energy: the real values, scaled with the equation as written, water liquid or vapour', () => {
  const near = (a, b, tol = 1) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`)
  near(enthalpy(REACTION.methane, [1, 2, 1, 2]), -890)
  near(enthalpy(REACTION.methane, [1, 2, 1, 2], 'g'), -802)
  near(enthalpy(REACTION.hydrogen, [2, 1, 2]), -572)
  near(enthalpy(REACTION.hydrogen, [4, 2, 4]), -1143)
  near(enthalpy(REACTION.photosynthesis, [6, 6, 1, 6]), 2803)
  near(enthalpy(REACTION.respiration, [1, 6, 6, 6]), -2803)
  near(enthalpy(REACTION.ammonia, [1, 3, 2]), -92)
  near(enthalpy(REACTION.salt, [2, 1, 2]), -822)
  near(enthalpy(REACTION.rust, [4, 3, 2]), -1651)
  near(enthalpy(REACTION.ethanol, [1, 3, 2, 3]), -1368)
  near(enthalpy(REACTION.limestone, [1, 1, 1]), 178)
  assert.equal(enthalpy(REACTION.methane, [1, 1, 1, 1]), null)
  // the reverse reactions take in what the forward ones give out
  assert.equal(baseEnthalpy(REACTION.water), -baseEnthalpy(REACTION.hydrogen, 'l'))
  assert.equal(baseEnthalpy(REACTION.photosynthesis), -baseEnthalpy(REACTION.respiration))
  // vapour carries away water's heat of vaporisation (44.0 kJ/mol at 25 °C)
  for (const r of REACTIONS.filter(waterChoice)) {
    const nWater = r.answer[speciesOf(r).indexOf('H2O')]
    near(baseEnthalpy(r, 'l') - baseEnthalpy(r, 'g'), -44.0 * nWater, 0.2)
  }
  // the endothermic ones say what they need, the exothermic ones how they burn
  for (const r of REACTIONS) {
    if (baseEnthalpy(r) > 0) assert.ok(['light', 'heat', 'power'].includes(r.needs), r.id)
    else assert.ok(!r.needs && r.flame, r.id)
  }
  near(molarMass('CH4'), 16.04, 0.01)
  near(molarMass('C6H12O6'), 180.16, 0.02)
  near(boilLitres(-890.3), 2.66, 0.01)
  assert.equal(stateOf('H2O', 'g'), 'g')
  assert.equal(stateOf('C6H12O6'), 's')
})

test('adding stops at nine and at a full bench; one always stays', () => {
  const r = REACTION.respiration
  assert.ok(canAdd(r, [1, 1, 1, 1], 1))
  assert.ok(!canAdd(r, [1, 1, 1, 1], 0), 'a second glucose beside an oxygen would pass 48 atoms')
  assert.ok(canAdd(r, [1, 5, 6, 6], 1), 'the answer can be reached')
  assert.ok(!canAdd(REACTION.hydrogen, [9, 1, 1], 0))
  assert.ok(!canRemove(r, [1, 1, 1, 1], 0))
  assert.ok(canRemove(r, [2, 1, 1, 1], 0))
})

test('a state from another device is made safe', () => {
  assert.deepEqual(clean(null), { r: 'hydrogen', k: [1, 1, 1], ph: 'before', n: 0, on: false, w: 'l' })
  assert.deepEqual(clean({ r: 'methane', k: [1, 2, 1, 2], ph: 'after', n: 3, on: 1, w: 'g' }), { r: 'methane', k: [1, 2, 1, 2], ph: 'after', n: 3, on: true, w: 'g' })
  assert.equal(clean({ r: 'methane', k: [1, 1, 1, 1], ph: 'after' }).ph, 'before', 'not balanced: not run')
  assert.deepEqual(clean({ r: 'methane', k: [1, 99, 1, 1] }).k, [1, 1, 1, 1])
  assert.deepEqual(clean({ r: 'methane', k: [1, 2] }).k, [1, 1, 1, 1])
  assert.deepEqual(clean({ r: 'respiration', k: [3, 1, 1, 1] }).k, [1, 1, 1, 1], 'over the bench')
  assert.equal(clean({ r: 'nope' }).r, 'hydrogen')
})

test('when it runs, every atom goes to a place of its own element, once, along the bench', () => {
  for (const r of REACTIONS) {
    for (const m of [1, 2]) {
      const k = r.answer.map(x => x * m)
      if (atomsOnSide(r, k, 'L') > MAX_ATOMS) continue
      const list = side => {
        const out = []
        const fs = side === 'L' ? r.left : r.right
        let x = 0
        fs.forEach((f, s) => {
          const n = k[side === 'L' ? s : r.left.length + s]
          for (let c = 0; c < n; c++) MOLECULES[f].atoms.forEach((el, a) => out.push({ id: `${side}${s}.${c}.${a}`, el, f, x: x++ }))
        })
        return out
      }
      const from = list('L')
      const to = list('R')
      const pairs = pairAtoms(from, to, r.prefer)
      assert.equal(pairs.length, from.length, `${r.id} x${m}: every atom goes`)
      assert.equal(new Set(pairs.map(p => p[0])).size, from.length)
      assert.equal(new Set(pairs.map(p => p[1])).size, to.length, `${r.id}: every place filled once`)
      const el = id => [...from, ...to].find(a => a.id === id).el
      for (const [a, b] of pairs) assert.equal(el(a), el(b), `${r.id}: ${a} -> ${b}`)
    }
  }
  // photosynthesis: the oxygen that comes out was the water's (all six of them go into O2)
  const r = REACTION.photosynthesis
  const from = []
  const to = []
  r.left.forEach((f, s) => { for (let c = 0; c < r.answer[s]; c++) MOLECULES[f].atoms.forEach((el, a) => from.push({ id: `L${f}${c}.${a}`, el, f, x: from.length })) })
  r.right.forEach((f, s) => { for (let c = 0; c < r.answer[2 + s]; c++) MOLECULES[f].atoms.forEach((el, a) => to.push({ id: `R${f}${c}.${a}`, el, f, x: to.length })) })
  const pairs = pairAtoms(from, to, r.prefer)
  const waterO = from.filter(a => a.f === 'H2O' && a.el === 'O').map(a => a.id)
  const toO2 = new Set(to.filter(a => a.f === 'O2').map(a => a.id))
  assert.ok(waterO.every(id => toO2.has(pairs.find(p => p[0] === id)[1])))
})

test('shapes: bonds about one bond length, nothing overlapping, water bent, carbon dioxide straight', () => {
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
  for (const [f, g] of Object.entries(MOLECULES)) {
    const p = shapeOf(f)
    assert.equal(p.length, g.atoms.length)
    for (const [a, b] of g.bonds) assert.ok(Math.abs(dist(p[a], p[b]) - BOND) < 0.5, `${f}: bond ${a}-${b} ${dist(p[a], p[b])}`)
    // no two Atomlings' bodies touch
    for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) assert.ok(dist(p[i], p[j]) > (bodyRadius(g.atoms[i]) + bodyRadius(g.atoms[j])) * 1.4, `${f}: ${i} and ${j} too close`)
    const fp = footprint(f)
    assert.ok(fp.w >= fp.h - 0.01 && fp.w >= fp.d - 0.01, `${f} lies across: ${JSON.stringify(fp)}`)
  }
  const w = shapeOf('H2O')
  const ang = (c, a, b) => {
    const u = [0, 1, 2].map(k => w[a][k] - w[c][k])
    const v = [0, 1, 2].map(k => w[b][k] - w[c][k])
    return (Math.acos((u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (Math.hypot(...u) * Math.hypot(...v))) * 180) / Math.PI
  }
  assert.ok(ang(0, 1, 2) > 100 && ang(0, 1, 2) < 110, `water ${ang(0, 1, 2)}`)
  assert.ok(w[0][1] > w[1][1], 'water stands with its oxygen up')
  const c = shapeOf('CO2')
  assert.ok(Math.abs(c[1][1] - c[2][1]) < 0.05 && Math.abs(c[0][1] - c[1][1]) < 0.05, 'carbon dioxide is straight and level')
})

test('the layout fits the strip, shrinking only when it must', () => {
  const sizes = [footprint('H2'), footprint('O2')]
  const small = arrange(sizes, [1, 1], { width: 6, depth: 3, maxScale: 0.6 })
  assert.equal(small.scale, 0.6)
  const big = arrange([footprint('CO2'), footprint('H2O')], [6, 6], { width: 6, depth: 3, maxScale: 0.6 })
  assert.ok(big.scale < 0.6 && big.scale > 0.2, `${big.scale}`)
  const span = big.blocks.at(-1).x1 - big.blocks[0].x0
  assert.ok(span <= 6 + 1e-6 && Math.abs(big.blocks[0].x0 + span / 2) < 1e-6, 'centred within the strip')
  assert.equal(big.blocks[0].cells.length, 6)
  // the copies of one block do not stand on each other
  for (const b of big.blocks) {
    for (let i = 0; i < b.cells.length; i++) {
      for (let j = i + 1; j < b.cells.length; j++) {
        const [p, q] = [b.cells[i], b.cells[j]]
        assert.ok(Math.hypot(p[0] - q[0], p[2] - q[2]) > 0.05, 'apart')
      }
    }
  }
})
