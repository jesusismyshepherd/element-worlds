import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  ALLOYS, BOOK, identify, massFractions, atomFractions, cleanMix, roomFor, lumpsIn, propertiesOf, lookOf, pourable,
  slabOf, strikeOf, shiftsAfter, pinning, PIN, apportion, ironMelt, solderMelt, steelHB, dentOf, mixSeed, SLAB, MAX_LUMPS,
} from './mix.js'

test('every alloy in the book is made by its own recipe', () => {
  for (const a of ALLOYS) {
    const info = identify(a.recipe)
    assert.equal(info.kind, 'alloy', `${a.id}: ${JSON.stringify(info.w)}`)
    assert.equal(info.id, a.id, `${a.id}'s recipe makes ${info.id}`)
  }
  assert.equal(BOOK.length, ALLOYS.length)
})

test('alloys are named by mass: the classic recipes', () => {
  assert.equal(identify({ Cu: 22, Sn: 3 }).id, 'bronze') // 88/12
  assert.equal(identify({ Cu: 7, Zn: 3 }).id, 'brass') // 70/30, cartridge brass
  assert.equal(identify({ Cu: 3, Zn: 2 }).id, 'brass') // 60/40, Muntz metal
  assert.equal(identify({ Cu: 3, Ni: 1 }).id, 'cupronickel') // 75/25, coins
  assert.equal(identify({ Ag: 13, Cu: 1 }).id, 'sterling') // 92.9 %
  assert.equal(identify({ Ag: 12, Cu: 1 }).kind, 'mix') // 92.3 %: not quite sterling
  assert.deepEqual(identify({ Ag: 12, Cu: 1 }).near, { id: 'sterling', more: 'Ag' })
  assert.equal(identify({ Au: 3, Cu: 1 }).id, 'gold18') // 75 %
  assert.equal(identify({ Au: 3, Cu: 1 }).grade, 'rose')
  assert.equal(identify({ Au: 6, Ag: 1, Cu: 1 }).grade, 'yellow')
  assert.equal(identify({ Au: 3, Ag: 1 }).grade, 'green')
  assert.equal(identify({ Au: 3, Ni: 1 }).grade, 'white')
  assert.equal(identify({ Au: 11, Cu: 1 }).kind, 'gold') // 22 carats
  assert.equal(identify({ Au: 11, Cu: 1 }).carats, 22)
  assert.equal(identify({ Sn: 5, Pb: 3 }).id, 'solder')
  assert.equal(identify({ Sn: 5, Pb: 3 }).grade, 'eutectic') // 62.5 % tin
  assert.equal(identify({ Sn: 1, Pb: 1 }).grade, 'plain')
  assert.equal(identify({ Fe: 7, Cr: 2, Ni: 1 }).id, 'stainless')
  assert.equal(identify({ Fe: 7, Cr: 2, Ni: 1 }).grade, '304') // 20 % Cr, 10 % Ni
  assert.equal(identify({ Fe: 4, Cr: 1 }).grade, 'chromium')
  assert.equal(identify({ Fe: 9, Cr: 1 }).kind, 'mix') // 10 %: under 10.5 %
  assert.equal(identify({ Fe: 9, Cr: 1 }).near.more, 'Cr')
})

test('steel and cast iron by their carbon', () => {
  assert.equal(identify({ Fe: 5, C: 1 }).id, 'steel') // 0.2 %
  assert.equal(identify({ Fe: 5, C: 1 }).grade, 'mild')
  assert.equal(identify({ Fe: 1, C: 1 }).grade, 'high') // 0.99 %
  assert.equal(identify({ Fe: 1, C: 2 }).id, 'steel') // 1.96 %
  assert.equal(identify({ Fe: 1, C: 3 }).id, 'castIron') // 2.9 %
  assert.equal(identify({ Fe: 1, C: 8 }).kind, 'mix') // 7.4 %: more carbon than iron can take
  assert.deepEqual(identify({ Fe: 1, C: 8 }).near, { id: 'castIron', more: 'Fe' })
  assert.equal(identify({ Fe: 1 }).kind, 'pure')
})

test('carbon floats on anything but iron, and alone it does not melt', () => {
  const b = identify({ Cu: 8, Sn: 1, C: 2 })
  assert.equal(b.id, 'bronze')
  assert.equal(b.floating, 2)
  assert.equal(identify({ C: 4 }).kind, 'carbon')
  assert.equal(pourable(identify({ C: 4 })), false)
  assert.equal(pourable(identify({})), false)
  assert.equal(pourable(identify({ Pb: 1 })), true)
})

test('mass and atom fractions', () => {
  const w = massFractions({ Fe: 1, C: 1 })
  assert.ok(Math.abs(w.C - 1 / 101) < 1e-12)
  const x = atomFractions(w)
  // 1 % carbon by mass is about 4.5 % of the atoms (carbon is light)
  assert.ok(Math.abs(x.C - 0.0449) < 0.001, x.C)
  const s = atomFractions(massFractions({ Cu: 22, Sn: 3 }))
  assert.ok(Math.abs(s.Sn - 0.068) < 0.002, s.Sn) // 12 % tin by mass, about 7 % of the atoms
  const sum = Object.values(atomFractions(massFractions({ Au: 6, Ag: 1, Cu: 1 }))).reduce((a, b) => a + b, 0)
  assert.ok(Math.abs(sum - 1) < 1e-12)
})

test('the crucible is checked and has room', () => {
  assert.deepEqual(cleanMix({ Cu: 3.7, Xx: 4, Sn: -1, C: 'a' }), { Cu: 3 })
  assert.equal(lumpsIn(cleanMix({ Cu: 40, Sn: 40 })), MAX_LUMPS)
  assert.equal(roomFor({ Cu: MAX_LUMPS }, 'Sn'), false)
  assert.equal(roomFor({ Cu: MAX_LUMPS }, 'C'), true)
  assert.deepEqual(cleanMix(null), {})
})

test('hardness and melting: alloys are harder, and many melt lower', () => {
  const cu = propertiesOf(identify({ Cu: 1 }))
  const bronze = propertiesOf(identify({ Cu: 8, Sn: 1 }))
  assert.equal(cu.melt[0], 1085)
  assert.ok(bronze.hard.v > cu.hard.v)
  assert.ok(bronze.melt[1] < cu.melt[1])
  assert.ok(propertiesOf(identify({ Fe: 1, C: 1 })).hard.v > propertiesOf(identify({ Fe: 1 })).hard.v)
  assert.deepEqual(solderMelt(61.9), [183, 183])
  assert.ok(solderMelt(63)[1] < 190)
  assert.ok(solderMelt(40)[1] > 183)
  assert.deepEqual(ironMelt(0), [1538, 1538])
  assert.deepEqual(ironMelt(4.3), [1147, 1147])
  assert.ok(ironMelt(1)[1] < 1538)
  assert.ok(steelHB(0.95) > steelHB(0.2))
  assert.equal(propertiesOf(identify({ Cu: 1, Fe: 1 })).hard, null)
  assert.ok(dentOf(5) > dentOf(37) && dentOf(37) > dentOf(160))
})

test('looks: every alloy and metal has a colour', () => {
  for (const a of ALLOYS) assert.match(lookOf(identify(a.recipe)), /^#[0-9a-f]{6}$/)
  assert.match(lookOf(identify({ Cu: 1, Fe: 1 })), /^#[0-9a-f]{6}$/)
  assert.match(lookOf(identify({})), /^#[0-9a-f]{6}$/)
})

test('apportion gives whole counts that add up', () => {
  const c = apportion({ Cu: 0.932, Sn: 0.068 }, 252)
  assert.equal(c.Cu + c.Sn, 252)
  assert.equal(c.Sn, 17)
})

test('the slab: sites, sizes from metallic radii, carbon in the gaps', () => {
  const n = SLAB.cols * SLAB.rows * SLAB.depth
  const cu = slabOf({ Cu: 1 })
  assert.equal(cu.sites.length, n)
  assert.ok(cu.sites.every(s => s.el === 'Cu' && s.r === 0.5))
  const bronze = slabOf({ Cu: 22, Sn: 3 })
  const tin = bronze.sites.filter(s => s.el === 'Sn')
  assert.equal(tin.length, 17)
  assert.ok(tin.every(s => s.r > 0.55), 'tin atoms are bigger than copper ones')
  const steel = slabOf({ Fe: 1, C: 1 })
  assert.ok(steel.gaps.length >= 9 && steel.gaps.length <= 14, steel.gaps.length)
  assert.ok(steel.gaps.every(g => g.r < 0.4))
  const cast = slabOf({ Fe: 1, C: 3 })
  assert.ok(cast.gaps.some(g => g.flake), 'cast iron has a flake of graphite')
  assert.equal(slabOf({ Sn: 5, Pb: 3 }).phase, 'lamellae')
  assert.equal(slabOf({ Cu: 1, Fe: 1 }).phase, 'apart')
  assert.equal(slabOf({ C: 3 }).sites.length, 0)
})

test('the slab is the same on every screen', () => {
  const a = slabOf({ Cu: 8, Sn: 1 }, { seed: mixSeed({ Cu: 8, Sn: 1 }, 3) })
  const b = slabOf({ Cu: 8, Sn: 1 }, { seed: mixSeed({ Cu: 8, Sn: 1 }, 3) })
  assert.deepEqual(a.sites, b.sites)
  assert.deepEqual(a.gaps, b.gaps)
  assert.deepEqual(strikeOf(a, 4), strikeOf(b, 4))
})

test('strikes: pure metals slip, alloys jam, cast iron cracks', () => {
  for (const el of ['Cu', 'Au', 'Fe', 'Pb', 'Ag']) {
    const s = slabOf({ [el]: 1 })
    for (let k = 1; k <= 6; k++) assert.equal(strikeOf(s, k).kind, 'slip', `${el} strike ${k}`)
  }
  for (const id of ['bronze', 'brass', 'stainless', 'sterling', 'gold18', 'cupronickel', 'bell']) {
    const a = ALLOYS.find(x => x.id === id)
    const s = slabOf(a.recipe)
    let jams = 0
    for (let k = 1; k <= 8; k++) jams += strikeOf(s, k).kind === 'jam' ? 1 : 0
    assert.ok(jams >= 7, `${id}: ${jams} of 8 jammed`)
  }
  const cast = slabOf({ Fe: 1, C: 3 })
  assert.equal(strikeOf(cast, 1).kind, 'crack')
  const after = shiftsAfter(cast, 5)
  assert.ok(after.cracked)
})

test('a slipping slab keeps near the anvil', () => {
  const s = slabOf({ Cu: 1 })
  for (let n = 1; n <= 40; n++) {
    const { shifts } = shiftsAfter(s, n)
    assert.ok(shifts.every(v => Math.abs(v) <= 3), `after ${n}: ${shifts}`)
  }
  assert.ok(shiftsAfter(s, 3).shifts.some(v => v !== 0))
})

test('pinning: nothing pins a pure metal', () => {
  const s = slabOf({ Ni: 1 })
  for (let p = 1; p < s.rows; p++) assert.equal(pinning(s, p), 0)
  const steel = slabOf({ Fe: 1, C: 1 })
  assert.ok([1, 2, 3, 4, 5, 6].some(p => pinning(steel, p) > PIN))
})
