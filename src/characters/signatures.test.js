// Signatures (look.js SIGNATURE, built by signatures.js): every one exists, has its words, adds no
// new kind of shader, and sits well on its Atomling: clear of the face, out of the body, clear of the
// electron a metal holds out, also in the middle of a wave; without arms (the Molecule Lab) only what is
// worn stays. The Atomlings are built here without their belly tile (its text needs a browser).
import { test } from 'node:test'
import assert from 'node:assert/strict'

globalThis.self ??= globalThis // troika-three-text, imported by atomling.js, looks for a browser global
const THREE = await import('three')
const { createAtomling } = await import('./atomling.js')
const { ELEMENTS } = await import('../data/elements.js')
const { SIGNATURE } = await import('./look.js')
const { SIGNATURE_KINDS, WORN } = await import('./signatures.js')
const { SIG } = await import('./explain.js')

const withSig = ELEMENTS.filter(e => SIGNATURE[e.symbol])

/** Build, then play it for a while (with a wave) and stop at time t (the middle of the wave: 0.9 s). */
function pose(el, t, opts = {}) {
  const a = createAtomling(el, { badge: false, ...opts })
  const dt = 1 / 30
  for (let s = 0; s <= t + 1e-9; s += dt) {
    if (Math.abs(s - 0.1) < dt / 2) a.wave()
    a.update(dt, s, { speed: 0 })
  }
  a.root.updateMatrixWorld(true)
  return a
}

const sigMeshes = a => {
  const out = []
  a.root.traverse(o => o.isMesh && o.userData.signature && o.visible && out.push(o))
  return out
}

const worldPoints = (mesh, every = 1) => {
  const p = mesh.geometry.attributes.position
  const out = []
  for (let i = 0; i < p.count; i += every) out.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(mesh.matrixWorld))
  return out
}

/** The electrons a metal holds out in its hands (the gifts at its fingertips). */
const gifts = a => {
  const out = []
  a.root.traverse(o => o.isMesh && o.material === a.mats.electron && o.scale.x > 1.2 && out.push(o))
  return out.map(o => ({ c: o.getWorldPosition(new THREE.Vector3()), r: o.geometry.parameters.radius * o.getWorldScale(new THREE.Vector3()).x }))
}

/** Is a world point inside the body's shell (its lathe profile), with a small margin? */
function insideBody(a, p, margin = 0.03) {
  const shell = a.root.children[0].children[0].children[0]
  const pts = shell.geometry.parameters.points
  const q = shell.worldToLocal(p.clone())
  if (q.y <= 0.02 || q.y >= 0.98) return false
  let r = 0
  for (let i = 1; i < pts.length; i++) {
    if (q.y >= pts[i - 1].y && q.y <= pts[i].y) {
      r = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * ((q.y - pts[i - 1].y) / (pts[i].y - pts[i - 1].y || 1))
      break
    }
  }
  return Math.hypot(q.x, q.z) < r - margin
}

test('every signature has a builder and its words in both languages', () => {
  for (const [sym, kind] of Object.entries(SIGNATURE)) {
    assert.ok(SIGNATURE_KINDS.includes(kind), `${sym}: no builder for ${kind}`)
    assert.ok(SIG[kind]?.[0] && SIG[kind]?.[1], `${sym}: no words for ${kind}`)
    for (const s of SIG[kind]) assert.ok(!s.includes('\u2014'), `${kind}: an em dash`)
  }
  assert.ok(Object.keys(SIGNATURE).length >= 60)
})

test('every Atomling builds and moves, with and without arms, with no broken numbers', () => {
  for (const el of ELEMENTS) {
    for (const opts of [{}, { arms: false, hoop: false }]) {
      const a = pose(el, 2, opts)
      for (const m of sigMeshes(a)) {
        const p = m.getWorldPosition(new THREE.Vector3())
        assert.ok(Number.isFinite(p.x + p.y + p.z), `${el.symbol} ${m.userData.signature}`)
      }
    }
  }
})

test('signatures use only the kinds of material every Atomling already has (no new shader)', () => {
  for (const el of withSig) {
    for (const m of sigMeshes(pose(el, 0))) {
      const mat = m.material
      assert.ok(mat.type === 'MeshStandardMaterial' || mat.type === 'MeshBasicMaterial', `${el.symbol}: ${mat.type}`)
      assert.equal(mat.side, THREE.FrontSide, `${el.symbol}: two-sided material`)
      assert.ok(!mat.map && !mat.vertexColors && !mat.flatShading, `${el.symbol}: a map, vertex colours or flat shading`)
    }
  }
})

test('without arms (the Molecule Lab) only what is worn stays', () => {
  for (const el of withSig) {
    const kinds = new Set(sigMeshes(pose(el, 0, { arms: false, hoop: false })).map(m => m.userData.signature))
    for (const k of kinds) assert.ok(WORN.has(k), `${el.symbol}: ${k} without arms`)
    if (WORN.has(SIGNATURE[el.symbol])) assert.ok(kinds.size, `${el.symbol}: its worn ${SIGNATURE[el.symbol]} went missing`)
  }
})

test('the face stays clear: nothing in front of the eyes or the mouth', () => {
  const bad = []
  const ray = new THREE.Raycaster()
  for (const el of withSig) {
    for (const t of [0, 0.9, 2.3]) {
      const a = pose(el, t)
      const H = a.body.height
      const face = []
      a.root.traverse(o => {
        if (!o.isMesh) return
        if (o.material === a.mats.eyeWhite || o.material === a.mats.mouth || (o.material === a.mats.pupil && o.geometry.type === 'TorusGeometry')) face.push(o)
      })
      const mine = sigMeshes(a)
      for (const f of face) {
        const target = f.getWorldPosition(new THREE.Vector3())
        const from = target.clone().add(new THREE.Vector3(0, H * 0.4, H * 5))
        ray.set(from, target.clone().sub(from).normalize())
        ray.far = from.distanceTo(target) - H * 0.01
        const hit = ray.intersectObjects(mine, false)[0]
        if (hit) bad.push(`${el.symbol} t=${t}: ${hit.object.userData.signature} hides the face`)
      }
    }
  }
  assert.deepEqual(bad, [])
})

test('what a hand holds stays out of the body and clear of the electron the hand holds out', () => {
  const bad = []
  for (const el of withSig) {
    // at rest, and in the middle of a wave (the first hand waves; a one-handed metal waves what it holds)
    for (const t of [0, 0.9]) {
      const a = pose(el, t)
      const H = a.body.height
      const held = sigMeshes(a).filter(m => {
        let o = m
        while (o && !o.userData.hand) o = o.parent
        return !!o
      })
      for (const m of held) {
        const pts = worldPoints(m, Math.max(1, Math.floor(m.geometry.attributes.position.count / 300)))
        const inside = pts.filter(p => insideBody(a, p)).length
        if (inside !== 0) bad.push(`${el.symbol} t=${t}: ${m.userData.signature} goes into the body (${inside} points)`)
        for (const g of gifts(a)) {
          const near = Math.min(...pts.map(p => p.distanceTo(g.c)))
          if (!(near > g.r + H * 0.004)) bad.push(`${el.symbol} t=${t}: ${m.userData.signature} touches a held-out electron (${(near / H).toFixed(3)} H)`)
        }
      }
    }
  }
  assert.deepEqual(bad, [])
})

test('signatures stay close to their Atomling and above the ground', () => {
  const bad = []
  for (const el of withSig) {
    const a = pose(el, 0.9)
    const H = a.body.height
    const box = new THREE.Box3()
    for (const m of sigMeshes(a)) box.expandByObject(m)
    if (box.isEmpty()) continue
    if (!(box.min.y > -0.02 * H)) bad.push(`${el.symbol}: below the ground`)
    if (!(box.max.y < a.body.hover + 2.5 * H)) bad.push(`${el.symbol}: too high`)
    if (!(Math.max(-box.min.x, box.max.x, -box.min.z, box.max.z) < 1.5 * H)) bad.push(`${el.symbol}: too far out`)
  }
  assert.deepEqual(bad, [])
})
