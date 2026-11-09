import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nucleotide, freeBase, hbonds, place, frameAt, complement, counts, measure, cleanSeq, partnerOf, copyAt, copyLength, BASES, TWIST, RISE, hbondCount } from './bases.js'
import { fromBuild, RING_BUILDS, skeleton, formulaOf, recognise, complete } from '../../../chem/build.js'

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const at = (nuc, name) => nuc.atoms[nuc.index[name]].p
const SHOW = { A: 'C5H5N5', T: 'C5H6N2O2', G: 'C5H5N5O', C: 'C4H5N3O' }

test('each free base is the lab\'s molecule: the same formula and skeleton, every hand held', () => {
  for (const b of BASES) {
    const fb = freeBase(b)
    const graph = { atoms: fb.atoms.map(a => ({ el: a.el })), bonds: fb.bonds }
    assert.equal(formulaOf(graph), SHOW[b], b)
    assert.ok(complete(graph), `${b}: a hand left free`)
    assert.equal(skeleton(graph), skeleton(fromBuild(RING_BUILDS[SHOW[b]])), b)
    assert.equal(recognise(graph)?.show, SHOW[b])
    // flat, and every bond a real bond's length (1.0 to 1.55 Å)
    for (const a of fb.atoms) if (!a.name.startsWith('H7')) assert.ok(Math.abs(a.p[2]) < 0.01, a.name)
    for (const [i, j] of fb.bonds) {
      const d = dist(fb.atoms[i].p, fb.atoms[j].p)
      assert.ok(d > 0.95 && d < 1.55, `${b} ${fb.atoms[i].name}-${fb.atoms[j].name} ${d}`)
    }
  }
})

test('Watson-Crick pairs: A-T by two hydrogen bonds, G-C by three, each 2.8 to 3.1 Å and nearly straight', () => {
  for (const b of BASES) {
    const hb = hbonds(b)
    assert.equal(hb.length, b === 'A' || b === 'T' ? 2 : 3, b)
    assert.equal(hb.length, hbondCount(b))
    const nucs = [nucleotide(b, 0), nucleotide(complement(b), 1)]
    for (const { donor, acceptor } of hb) {
      const D = at(nucs[donor.strand], donor.atom)
      const H = at(nucs[donor.strand], donor.h)
      const A = at(nucs[acceptor.strand], acceptor.atom)
      const d = dist(D, A)
      assert.ok(d > 2.8 && d < 3.1, `${b}: ${donor.atom}...${acceptor.atom} ${d}`)
      assert.ok(dist(H, A) < d - 0.85, `${b}: the hydrogen ${donor.h} points at ${acceptor.atom}`)
    }
  }
  // the glycosidic carbons 10.5 Å apart, both on the minor groove's side (x < 0)
  for (const b of BASES) {
    const c1 = at(nucleotide(b, 0), "C1'")
    const c2 = at(nucleotide(complement(b), 1), "C1'")
    assert.ok(Math.abs(dist(c1, c2) - 10.6) < 0.3, `${dist(c1, c2)}`)
    assert.ok(c1[0] < 0 && c2[0] < 0)
  }
})

test('the backbone joins up: O3\' to the next P is 1.6 Å on both strands, for every pair of letters', () => {
  const f0 = frameAt(0)
  const f1 = frameAt(1)
  for (const x of BASES) {
    for (const y of BASES) {
      // strand 0 runs up: x's O3' (pair 0) to y's P (pair 1)
      const o3 = place(at(nucleotide(x, 0), "O3'"), f0.angle, f0.z)
      const p = place(at(nucleotide(y, 0), 'P'), f1.angle, f1.z)
      assert.ok(Math.abs(dist(o3, p) - 1.6) < 0.08, `${x}${y} strand 0: ${dist(o3, p)}`)
      // the partner strand runs down: its O3' at pair 1 to its P at pair 0
      const o3b = place(at(nucleotide(complement(y), 1), "O3'"), f1.angle, f1.z)
      const pb = place(at(nucleotide(complement(x), 1), 'P'), f0.angle, f0.z)
      assert.ok(Math.abs(dist(o3b, pb) - 1.6) < 0.08, `${x}${y} strand 1: ${dist(o3b, pb)}`)
    }
  }
})

test('stacked pairs do not run into each other, and the helix is right-handed, 2 nm wide', () => {
  const seq = 'ATGCGTACCATG'
  const atoms = []
  ;[...seq].forEach((b, k) => {
    const f = frameAt(k)
    for (const [base, strand] of [[b, 0], [complement(b), 1]]) {
      const nuc = nucleotide(base, strand)
      nuc.atoms.forEach(a => atoms.push({ k, strand, name: a.name, el: a.el, p: place(a.p, f.angle, f.z) }))
    }
  })
  let closest = Infinity
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a = atoms[i]
      const b = atoms[j]
      if (a.k === b.k && a.strand === b.strand) continue
      // the backbone's links between neighbours and the paired atoms are bonded or hydrogen-bonded
      if (a.k !== b.k && a.strand === b.strand && Math.abs(a.k - b.k) === 1) continue
      if (a.k === b.k) continue
      if (a.el === 'H' || b.el === 'H') continue
      closest = Math.min(closest, dist(a.p, b.p))
    }
  }
  assert.ok(closest > 3.0, `two heavy atoms of different pairs ${closest} Å apart`)
  // right-handed: going up strand 0, its phosphorus turns anticlockwise seen from above
  const p0 = place(at(nucleotide('A', 0), 'P'), 0, 0)
  const p1 = place(at(nucleotide('A', 0), 'P'), TWIST, RISE)
  assert.ok(p0[0] * p1[1] - p0[1] * p1[0] > 0)
  const r = Math.hypot(p0[0], p0[1])
  assert.ok(r > 9 && r < 10, `phosphorus radius ${r}`)
})

test('counting the letters: Chargaff\'s rule, the partner strand, turns and length', () => {
  assert.equal(partnerOf('ATGC'), 'TACG')
  const c = counts('AATGC')
  assert.equal(c.A, c.T)
  assert.equal(c.G, c.C)
  const m = measure('ATGCGC')
  assert.equal(m.gc, 67)
  assert.equal(m.hbonds, 2 + 2 + 3 + 3 + 3 + 3)
  assert.ok(Math.abs(measure('A'.repeat(21)).turns - 2) < 1e-9)
  assert.ok(Math.abs(measure('ATGCATGCAT').nm - 3.38) < 1e-9)
  assert.equal(cleanSeq('atgx C' + 'A'.repeat(40)).length, 24)
  assert.equal(cleanSeq(null), '')
})

test('the copy runs along the strand and ends with both halves apart', () => {
  const n = 8
  const end = copyLength(n)
  assert.equal(copyAt(0, n).open(0), 0)
  assert.equal(copyAt(end, n).done, true)
  assert.equal(copyAt(end, n).apart, 1)
  for (let k = 0; k < n; k++) {
    assert.equal(copyAt(end, n).open(k), 1)
    assert.equal(copyAt(end, n).arrived(k), 1)
  }
  // the first pair opens before the last
  const mid = copyAt(end / 2, n)
  assert.ok(mid.open(0) > mid.open(n - 1))
})
