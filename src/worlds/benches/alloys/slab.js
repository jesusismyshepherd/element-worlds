// Inside the metal (alloys.js): the ingot's atoms, magnified, in a glass case over the bench. The ions are
// spheres sized by their metallic radii (mix.js slabOf: the rows, the misfits' strain, carbon in the gaps),
// in their Atomlings' colours; the electron sea is a cloud of glowing dots drifting freely among them,
// carried along when a row slips. A strike plays here: the upper rows slip one place along the slip plane
// (a pure metal bends), or start to and spring back while the misfit atoms that pinned them flash (an
// alloy holds), or the upper part breaks away along cast iron's flake of graphite.
import * as THREE from 'three'
import { ION, SEA, ROW_H } from './mix.js'
import { makeText } from '../../../engine/text.js'

export const U = 0.235 // metres per lattice place
const CARBON = '#7d838f'

const ease = f => f * f * (3 - 2 * f)

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** The case and its contents. `words`: { inside, slip, sea } (3D text, the world's language). */
export function buildSlab({ light, words, level }) {
  const group = new THREE.Group()
  group.name = 'slab'
  const inner = new THREE.Group() // the atoms, centred, in metres
  group.add(inner)
  const MAX = 12 * 7 * 3
  const sphere = new THREE.SphereGeometry(1, light ? 14 : 22, light ? 10 : 16)
  const ionMat = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.45, roughness: 0.38, emissive: '#101830', emissiveIntensity: 0.4 })
  const ions = new THREE.InstancedMesh(sphere, ionMat, MAX)
  ions.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3)
  ions.count = 0
  ions.frustumCulled = false
  inner.add(ions)
  const MAXC = 160
  const cMat = new THREE.MeshStandardMaterial({ color: CARBON, metalness: 0.1, roughness: 0.55, emissive: '#20242c', emissiveIntensity: 0.6 })
  const carbons = new THREE.InstancedMesh(sphere, cMat, MAXC)
  carbons.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAXC * 3), 3)
  carbons.count = 0
  carbons.frustumCulled = false
  inner.add(carbons)

  // the electron sea
  const dot = dotTexture()
  const MAXE = light ? 180 : 380
  const ePos = new Float32Array(MAXE * 3)
  const eGeo = new THREE.BufferGeometry()
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3))
  eGeo.setDrawRange(0, 0)
  const sea = new THREE.Points(eGeo, new THREE.PointsMaterial({ map: dot, color: new THREE.Color('#a8ecff').multiplyScalar(2.6), size: 0.1, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  sea.frustumCulled = false
  inner.add(sea)
  const electrons = []

  // the case: a dark pane behind, glowing edges, its title
  const caseGroup = new THREE.Group()
  group.add(caseGroup)
  const edgeMat = new THREE.LineBasicMaterial({ color: '#7fd4ff', transparent: true, opacity: 0.75 })
  let edges = null
  const paneMat = new THREE.MeshBasicMaterial({ color: '#08112e', transparent: true, opacity: 0.6, depthWrite: false })
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), paneMat)
  caseGroup.add(pane)
  const title = makeText(words.inside, { size: 0.15, color: '#cfeeff', outlineWidth: 0.008, outlineColor: '#0b0f24' })
  caseGroup.add(title)
  // a tap target over the whole case
  const hit = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }))
  caseGroup.add(hit)
  // the legend: a dot and a name for each element in the slab
  const legend = new THREE.Group()
  caseGroup.add(legend)
  // the slip plane, flashed during a strike
  const planeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#9ff0ff').multiplyScalar(2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const planeLine = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), planeMat)
  inner.add(planeLine)
  const planeLabel = makeText(words.slip, { size: 0.085, color: '#bff4ff', anchorX: 'left', outlineWidth: 0.006, outlineColor: '#0b0f24' })
  planeLabel.visible = false
  inner.add(planeLabel)

  let slab = null
  let cx = 0
  let cy = 0
  let cz = 0
  let rowOff = [] // each row's offset now (places)
  let rowGoal = [] // where it settles
  let lift = [] // a broken-off part's lift (places) and tilt
  let tilt = 0
  let crackPlane = -1
  let anim = null // { kind, plane, dir, t, pin: Set of site indices, pinC: Set }
  const col = new THREE.Color()
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const p3 = new THREE.Vector3()
  const s3 = new THREE.Vector3()

  const place = (x, y, z, row, out) => {
    const up = crackPlane >= 0 && row >= crackPlane
    const ly = up ? lift[0] : 0
    const t = up ? tilt : 0
    out.set((x + rowOffAt(row) - cx) * U, (y - cy + ly + (x - cx) * t) * U, (cz - z) * U)
    return out
  }
  const rowOffAt = r => {
    const lo = Math.floor(r)
    const hi = Math.ceil(r)
    if (lo === hi) return rowOff[lo] ?? 0
    return ((rowOff[lo] ?? 0) + (rowOff[hi] ?? 0)) / 2
  }

  /** The bounds of the metal (places): x of each row, y, z; electrons stay inside. */
  const bounds = () => {
    const rows = slab?.rows ?? 1
    return {
      x: r => [rowOffAt(Math.max(0, Math.min(rows - 1, r))) - 0.45, rowOffAt(Math.max(0, Math.min(rows - 1, r))) + (slab?.cols ?? 1) - 0.05],
      y: [-0.5, (rows - 1) * ROW_H + 0.5],
      z: [-0.45, (slab?.depth ?? 1) - 0.55],
    }
  }

  const draw = () => {
    if (!slab) return
    slab.sites.forEach((s, i) => {
      place(s.x, s.y, s.z, s.row, p3)
      const pulse = anim?.pin?.has(i) ? 1 + 0.3 * Math.sin(Math.min(1, anim.t / 0.7) * Math.PI) : 1
      s3.setScalar(s.r * U * 0.97 * pulse)
      m4.compose(p3, q, s3)
      ions.setMatrixAt(i, m4)
    })
    ions.instanceMatrix.needsUpdate = true
    slab.gaps.forEach((g, i) => {
      place(g.x, g.y, g.z, g.below + 0.5, p3)
      const pulse = anim?.pinC?.has(i) ? 1 + 0.35 * Math.sin(Math.min(1, anim.t / 0.7) * Math.PI) : 1
      s3.setScalar(g.r * U * pulse)
      m4.compose(p3, q, s3)
      carbons.setMatrixAt(i, m4)
    })
    carbons.instanceMatrix.needsUpdate = true
  }
  const paint = (glow = 0) => {
    if (!slab) return
    slab.sites.forEach((s, i) => {
      col.set(ION[s.el] ?? '#cccccc')
      if (glow && anim?.pin?.has(i)) col.lerp(new THREE.Color('#ffffff'), glow * 0.6)
      ions.setColorAt(i, col)
    })
    ions.instanceColor.needsUpdate = true
    slab.gaps.forEach((g, i) => {
      col.set(g.flake ? '#4a4f5a' : CARBON)
      if (glow && anim?.pinC?.has(i)) col.lerp(new THREE.Color('#ffffff'), glow * 0.7)
      carbons.setColorAt(i, col)
    })
    carbons.instanceColor.needsUpdate = true
  }

  const W = () => ((slab?.cols ?? 12) + 0.5) * U
  const H = () => ((slab?.rows ?? 7) - 1) * ROW_H * U + U
  const D = () => (slab?.depth ?? 3) * U

  /** The case's frame, its title and its legend for the slab on show. */
  const frame = (names) => {
    if (edges) {
      caseGroup.remove(edges)
      edges.geometry.dispose()
    }
    const w = W() + 0.5
    const h = H() + 0.45
    const d = D() + 0.25
    edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), edgeMat)
    caseGroup.add(edges)
    pane.scale.set(w, h, 1)
    pane.position.z = -d / 2
    hit.scale.set(w, h, d)
    title.position.set(0, h / 2 + 0.16, 0)
    for (const c of [...legend.children]) {
      legend.remove(c)
      c.dispose?.()
    }
    // the legend under the case, centred
    const items = names.map(({ el, name }) => {
      const g = new THREE.Group()
      const ball = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: el === 'C' ? CARBON : ION[el], metalness: 0.5, roughness: 0.3, emissive: '#1a2240', emissiveIntensity: 0.5 }))
      ball.scale.setScalar(0.05)
      const txt = makeText(name, { size: 0.1, color: '#dfe8ff', anchorX: 'left', font: 'body', outlineWidth: 0.005, outlineColor: '#0b0f24' })
      txt.position.x = 0.09
      g.add(ball, txt)
      g.userData.width = 0.12 + name.length * 0.055
      return g
    })
    const elec = (() => {
      const g = new THREE.Group()
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: new THREE.Color('#a8ecff').multiplyScalar(1.9), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
      glow.scale.setScalar(0.1)
      const txt = makeText(words.sea, { size: 0.1, color: '#bfefff', anchorX: 'left', font: 'body', outlineWidth: 0.005, outlineColor: '#0b0f24' })
      txt.position.x = 0.09
      g.add(glow, txt)
      g.userData.width = 0.12 + words.sea.length * 0.055
      return g
    })()
    items.push(elec)
    const gap = 0.16
    const total = items.reduce((s, g) => s + g.userData.width, 0) + gap * (items.length - 1)
    let x = -total / 2
    for (const g of items) {
      g.position.set(x + 0.05, -h / 2 - 0.14, d / 2)
      x += g.userData.width + gap
      legend.add(g)
    }
  }

  /** Show a slab: as it stands after its strikes (shifts, and the crack if it cracked). `names` for the
   *  legend: [{ el, name }]. */
  const show = (next, { shifts = [], cracked = null, names = [] } = {}) => {
    slab = next
    anim = null
    cx = (slab.cols - 1) / 2 + 0.25
    cy = ((slab.rows - 1) * ROW_H) / 2
    cz = (slab.depth - 1) / 2
    rowOff = Array.from({ length: slab.rows }, (_, r) => shifts[r] ?? 0)
    rowGoal = [...rowOff]
    crackPlane = cracked ? cracked.plane : -1
    lift = [cracked ? 0.55 : 0]
    tilt = cracked ? 0.045 : 0
    ions.count = slab.sites.length
    carbons.count = Math.min(MAXC, slab.gaps.length)
    draw()
    paint()
    frame(names)
    // the sea: as many electrons as the atoms give (drawn at half), never more than the bench can carry
    const given = slab.sites.reduce((s, x) => s + (SEA[x.el] ?? 1), 0)
    const n = Math.max(60, Math.min(MAXE, Math.round(given * (light ? 0.35 : 0.55))))
    electrons.length = 0
    const b = bounds()
    for (let i = 0; i < n; i++) {
      const y = b.y[0] + Math.random() * (b.y[1] - b.y[0])
      const [x0, x1] = b.x(Math.round(y / ROW_H))
      const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(0.9 + Math.random() * 0.6)
      electrons.push({ p: new THREE.Vector3(x0 + Math.random() * (x1 - x0), y, b.z[0] + Math.random() * (b.z[1] - b.z[0])), v, up: crackPlane >= 0 && y >= (crackPlane - 0.5) * ROW_H })
    }
    eGeo.setDrawRange(0, n)
  }

  /** Play a strike: { kind, plane, dir }; `pinned` the site and gap indices that held it (a jam). */
  const strike = (s, pinned = { sites: [], gaps: [] }) => {
    if (!slab) return
    if (anim && anim.kind === 'slip') {
      // the last one settles at once
      rowOff = [...rowGoal]
    }
    anim = { ...s, t: 0, pin: new Set(pinned.sites), pinC: new Set(pinned.gaps), from: [...rowOff] }
    if (s.kind === 'slip') for (let r = s.plane; r < slab.rows; r++) rowGoal[r] = rowOff[r] + s.dir
    if (s.kind === 'crack') {
      crackPlane = s.plane
      for (const el of electrons) el.up = el.p.y >= (s.plane - 0.5) * ROW_H
    }
    planeMat.color.set(s.kind === 'slip' ? '#9ff0ff' : '#ff9a6a').multiplyScalar(2)
  }

  let face = 0
  const update = (dt, t, camera, worldPos) => {
    // the case turns to the camera (slowly), so its rows read from wherever the view has gone
    if (camera && worldPos) {
      const want = Math.atan2(camera.position.x - worldPos.x, camera.position.z - worldPos.z)
      face += (want - face) * Math.min(1, dt * 2.5)
      group.rotation.y = face
    }
    if (!slab) return
    let moving = false
    let carry = 0 // how fast the upper rows move (places a second), to carry the electrons
    if (anim) {
      anim.t += dt
      const T = anim.t
      const rows = slab.rows
      if (anim.kind === 'slip') {
        const f = Math.min(1, T / 0.45)
        for (let r = anim.plane; r < rows; r++) rowOff[r] = anim.from[r] + anim.dir * ease(f)
        carry = f < 1 ? anim.dir / 0.45 * 1.5 * (1 - Math.abs(2 * f - 1)) : 0
      } else if (anim.kind === 'jam') {
        // a start along, then pinned: back with a shudder
        const push = T < 0.14 ? ease(T / 0.14) * 0.3 : 0.3 * Math.exp(-(T - 0.14) * 7) * Math.cos((T - 0.14) * 30)
        for (let r = anim.plane; r < rows; r++) rowOff[r] = anim.from[r] + anim.dir * push
        carry = T < 0.14 ? anim.dir * 2 : 0
        paint(Math.max(0, 1 - T / 0.9))
      } else if (anim.kind === 'crack') {
        const f = Math.min(1, T / 0.5)
        lift[0] = 0.55 * ease(f)
        tilt = 0.045 * ease(f)
        paint(Math.max(0, 1 - T / 0.9))
      }
      planeLine.scale.set(W(), 0.022, D())
      planeLine.position.set((rowOffAt(anim.plane - 0.5) - 0.25 + 0) * U, ((anim.plane - 0.5) * ROW_H - cy) * U, 0)
      planeMat.opacity = Math.max(0, Math.sin(Math.min(1, T / 0.9) * Math.PI)) * 0.9
      planeLabel.visible = level() === 'scientist' && anim.kind !== 'crack' && T < 1.2
      planeLabel.position.set(W() / 2 + 0.06, planeLine.position.y, D() / 2)
      moving = true
      if (T > 1.3) {
        if (anim.kind === 'slip') rowOff = [...rowGoal]
        if (anim.kind === 'jam') rowOff = [...anim.from]
        anim = null
        paint()
        planeMat.opacity = 0
        planeLabel.visible = false
      }
    }
    if (moving) draw()
    // the electrons wander: a drift that keeps changing, bounced back at the metal's edge
    const b = bounds()
    const n = electrons.length
    const yCrack = (crackPlane - 0.5) * ROW_H
    for (let i = 0; i < n; i++) {
      const e = electrons[i]
      e.v.x += (Math.random() - 0.5) * dt * 6
      e.v.y += (Math.random() - 0.5) * dt * 6
      e.v.z += (Math.random() - 0.5) * dt * 6
      const sp = e.v.length()
      if (sp > 1.8) e.v.multiplyScalar(1.8 / sp)
      else if (sp < 0.5) e.v.multiplyScalar(0.5 / Math.max(0.01, sp))
      e.p.addScaledVector(e.v, dt)
      const row = e.p.y / ROW_H
      if (anim && row >= anim.plane - 0.5 && carry) e.p.x += carry * dt
      let [y0, y1] = b.y
      if (crackPlane >= 0) {
        if (e.up) y0 = yCrack + 0.15
        else y1 = yCrack - 0.15
      }
      if (e.p.y < y0) {
        e.p.y = y0
        e.v.y = Math.abs(e.v.y)
      } else if (e.p.y > y1) {
        e.p.y = y1
        e.v.y = -Math.abs(e.v.y)
      }
      const [x0, x1] = b.x(Math.round(e.p.y / ROW_H))
      if (e.p.x < x0) {
        e.p.x = x0
        e.v.x = Math.abs(e.v.x)
      } else if (e.p.x > x1) {
        e.p.x = x1
        e.v.x = -Math.abs(e.v.x)
      }
      if (e.p.z < b.z[0]) {
        e.p.z = b.z[0]
        e.v.z = Math.abs(e.v.z)
      } else if (e.p.z > b.z[1]) {
        e.p.z = b.z[1]
        e.v.z = -Math.abs(e.v.z)
      }
      const up = crackPlane >= 0 && e.up
      const t2 = up ? tilt : 0
      ePos[i * 3] = (e.p.x - cx) * U
      ePos[i * 3 + 1] = (e.p.y - cy + (up ? lift[0] : 0) + (e.p.x - cx) * t2) * U
      ePos[i * 3 + 2] = (cz - e.p.z) * U
    }
    eGeo.attributes.position.needsUpdate = true
  }

  return {
    group,
    hit,
    show,
    strike,
    update,
    size: () => ({ w: W() + 0.5, h: H() + 0.45 }),
    dispose() {
      dot.dispose()
      title.dispose()
      planeLabel.dispose()
    },
  }
}
