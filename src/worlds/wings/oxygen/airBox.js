// The box of air: 100 molecules in the proportions of dry air (78 N2, 21 O2, 1 Ar), flying in straight
// lines, tumbling, and bouncing off the walls and each other as a real gas does (elastic collisions,
// speeds from a Maxwell-Boltzmann draw, heavier molecules slower: speed goes as 1/sqrt(M)). Tapping a
// molecule, or a gas's column on the console, highlights that gas and counts its molecules; the same gas
// again shows them all (air.js). Beside it, a little case holds the rare one: a
// single CO2, which in real air is about one molecule in 2400.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { glass, screen, random, hdr, equation, glowMat, damp, hitBox } from './kit.js'
import { AIR_MIX } from './oxygenData.js'

const S = 0.32 // metres per angstrom in the box
const GASES = {
  N2: { el: 'N', count: AIR_MIX.N2, bond: 1.1, order: 3, mass: 28, color: '#3a5cf5', glow: '#7f9bff', atomR: 0.34 },
  O2: { el: 'O', count: AIR_MIX.O2, bond: 1.21, order: 2, mass: 32, color: '#f2302b', glow: '#ff6a55', atomR: 0.34 },
  Ar: { el: 'Ar', count: AIR_MIX.Ar, bond: 0, order: 0, mass: 40, color: '#80d1e3', glow: '#b8f2ff', atomR: 0.6 },
}

/** A ball-and-stick material that can glow per instance (aGlow) and be dimmed as a group (uDim). */
function moleculeMaterial(color, glowColor, light) {
  const m = light
    ? new THREE.MeshStandardMaterial({ color, roughness: 0.35 })
    : new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18 })
  const u = { uDim: { value: 0 }, uGlowColor: { value: new THREE.Color(glowColor) } }
  m.userData.u = u
  m.onBeforeCompile = s => {
    Object.assign(s.uniforms, u)
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aGlow;\nvarying float vGlow;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlow = aGlow;')
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uDim;\nuniform vec3 uGlowColor;\nvarying float vGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * vGlow * 1.8;')
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
        float lum = dot(gl_FragColor.rgb, vec3(0.3, 0.55, 0.15));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(lum) * vec3(0.55, 0.62, 0.8) * 0.45, uDim * 0.85);`)
  }
  return m
}

function instanced(geo, mat, count) {
  const g = geo.clone()
  const glow = new THREE.InstancedBufferAttribute(new Float32Array(count), 1)
  glow.setUsage(THREE.DynamicDrawUsage)
  g.setAttribute('aGlow', glow)
  const mesh = new THREE.InstancedMesh(g, mat, count)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.castShadow = true
  mesh.frustumCulled = false
  return mesh
}

/** Builds the box at (x, z); size in metres (inside). Returns { group, solids, setMode, update, ... }. */
export function airBox({ x = 0, z = 0, w = 5.4, h = 3.0, d = 3.4, base = 0.36, color = '#8fd0ff', light = false, words }) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)
  const rnd = random(2095)

  // the plinth: a white slab with a glowing seam
  const plinthMat = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.05 })
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(w + 0.7, base, d + 0.7, 3, 0.1), plinthMat)
  plinth.position.y = base / 2
  plinth.receiveShadow = true
  plinth.castShadow = true
  const seam = new THREE.Mesh(new RoundedBoxGeometry(w + 0.74, 0.05, d + 0.74, 2, 0.02), glowMat(color, 1.6))
  seam.position.y = base - 0.07
  group.add(plinth, seam)

  // the glass and its glowing frame
  const cy = base + h / 2
  const boxGeo = new THREE.BoxGeometry(w, h, d)
  const back = new THREE.Mesh(boxGeo, glass({ opacity: 0.03, edge: 0.35, side: THREE.BackSide }))
  const front = new THREE.Mesh(boxGeo, glass({ opacity: 0.035, edge: 0.55 }))
  back.position.y = front.position.y = cy
  back.renderOrder = 2
  front.renderOrder = 4
  group.add(back, front)
  const frameMat = glowMat(color, 1.5, { metalness: 0.3 })
  const bar = 0.06
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(bar, h + bar, bar), frameMat)
      post.position.set((sx * w) / 2, cy, (sz * d) / 2)
      group.add(post)
    }
    for (const sy of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(bar, bar, d + bar), frameMat)
      rail.position.set((sx * w) / 2, cy + (sy * h) / 2, 0)
      group.add(rail)
    }
  }
  for (const sz of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w + bar, bar, bar), frameMat)
      rail.position.set(0, cy + (sy * h) / 2, (sz * d) / 2)
      group.add(rail)
    }
  }

  // ---- the molecules ----
  const seg = light ? 12 : 20
  const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  const stickR = 0.085 * S
  const stick = new THREE.CylinderGeometry(stickR, stickR, 1, light ? 6 : 10)
  const kinds = {}
  for (const [id, g] of Object.entries(GASES)) {
    // one material each (they share one shader program; the dimming and glow colour are their own)
    const atomMat = moleculeMaterial(g.color, g.glow, light)
    const bondMat = g.order ? moleculeMaterial('#e6ebf5', g.glow, light) : null
    const atoms = instanced(sphere, atomMat, g.count * (g.order ? 2 : 1))
    const bonds = g.order ? instanced(stick, bondMat, g.count * g.order) : null
    kinds[id] = { ...g, id, atoms, bonds, atomMat, bondMat }
  }

  const half = new THREE.Vector3(w / 2 - 0.05, h / 2 - 0.05, d / 2 - 0.05)
  const mols = []
  const gauss = () => {
    let u = 0
    let v = 0
    while (u === 0) u = rnd()
    while (v === 0) v = rnd()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  const speedN2 = 0.8 // m/s, the box's "temperature"
  for (const k of Object.values(kinds)) {
    for (let i = 0; i < k.count; i++) {
      const sigma = (speedN2 * Math.sqrt(28 / k.mass)) / Math.sqrt(3) * 1.1
      const len = (k.bond / 2 + k.atomR) * S
      mols.push({
        kind: k,
        index: i,
        r: Math.max(len, k.atomR * S) + 0.02,
        mass: k.mass,
        p: new THREE.Vector3((rnd() - 0.5) * 2 * (half.x - 0.4), (rnd() - 0.5) * 2 * (half.y - 0.4), (rnd() - 0.5) * 2 * (half.z - 0.4)),
        v: new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(sigma),
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6.3, rnd() * 6.3, rnd() * 6.3)),
        w: new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(0.9),
        glow: 0,
      })
    }
  }
  // spread them out so none starts inside another
  for (let pass = 0; pass < 30; pass++) {
    for (let i = 0; i < mols.length; i++) {
      for (let j = i + 1; j < mols.length; j++) {
        const a = mols[i]
        const b = mols[j]
        const dd = a.p.distanceTo(b.p)
        const min = a.r + b.r + 0.05
        if (dd < min) {
          const n = b.p.clone().sub(a.p).normalize().multiplyScalar((min - dd) / 2 + 0.01)
          a.p.sub(n)
          b.p.add(n)
        }
      }
    }
    for (const m of mols) m.p.clamp(half.clone().negate().addScalar(m.r), half.clone().subScalar(m.r))
  }
  const inner = new THREE.Group()
  inner.position.y = cy
  group.add(inner)
  for (const k of Object.values(kinds)) {
    inner.add(k.atoms)
    if (k.bonds) inner.add(k.bonds)
  }

  const m4 = new THREE.Matrix4()
  const qq = new THREE.Quaternion()
  const toX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
  const v1 = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const sc = new THREE.Vector3()
  const dq = new THREE.Quaternion()
  const axis = new THREE.Vector3()
  const draw = () => {
    const counters = { N2: 0, O2: 0, Ar: 0 }
    for (const m of mols) {
      const k = m.kind
      const i = counters[k.id]++
      const glowA = k.atoms.geometry.attributes.aGlow
      if (!k.order) {
        k.atoms.setMatrixAt(i, m4.compose(m.p, m.q, sc.setScalar(k.atomR * S)))
        glowA.setX(i, m.glow)
        continue
      }
      const hd = (k.bond * S) / 2
      for (let s = 0; s < 2; s++) {
        v1.set(s ? hd : -hd, 0, 0).applyQuaternion(m.q).add(m.p)
        k.atoms.setMatrixAt(i * 2 + s, m4.compose(v1, m.q, sc.setScalar(k.atomR * S)))
        glowA.setX(i * 2 + s, m.glow)
      }
      qq.copy(m.q).multiply(toX)
      const gap = stickR * 2.7
      const offsets = k.order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap]
      const bondGlow = k.bonds.geometry.attributes.aGlow
      offsets.forEach((off, s) => {
        v2.set(0, 0, off).applyQuaternion(m.q).add(m.p)
        k.bonds.setMatrixAt(i * k.order + s, m4.compose(v2, qq, sc.set(1, k.bond * S, 1)))
        bondGlow.setX(i * k.order + s, m.glow * 0.6)
      })
    }
    for (const k of Object.values(kinds)) {
      k.atoms.instanceMatrix.needsUpdate = true
      k.atoms.geometry.attributes.aGlow.needsUpdate = true
      if (k.bonds) {
        k.bonds.instanceMatrix.needsUpdate = true
        k.bonds.geometry.attributes.aGlow.needsUpdate = true
      }
    }
  }

  const step = dt => {
    for (const m of mols) {
      m.p.addScaledVector(m.v, dt)
      // walls
      for (const ax of ['x', 'y', 'z']) {
        const lim = half[ax] - m.r
        if (m.p[ax] > lim) {
          m.p[ax] = lim
          m.v[ax] = -Math.abs(m.v[ax])
        } else if (m.p[ax] < -lim) {
          m.p[ax] = -lim
          m.v[ax] = Math.abs(m.v[ax])
        }
      }
      if (m.w.lengthSq() > 0) {
        dq.setFromAxisAngle(axis.copy(m.w).normalize(), m.w.length() * dt)
        m.q.premultiply(dq)
      }
    }
    // each other: elastic collisions between spheres
    for (let i = 0; i < mols.length; i++) {
      const a = mols[i]
      for (let j = i + 1; j < mols.length; j++) {
        const b = mols[j]
        const dx = b.p.x - a.p.x
        const dy = b.p.y - a.p.y
        const dz = b.p.z - a.p.z
        const min = a.r + b.r
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 >= min * min || d2 < 1e-9) continue
        const dd = Math.sqrt(d2)
        const nx = dx / dd
        const ny = dy / dd
        const nz = dz / dd
        const rel = (b.v.x - a.v.x) * nx + (b.v.y - a.v.y) * ny + (b.v.z - a.v.z) * nz
        if (rel < 0) {
          const jImp = (2 * rel) / (1 / a.mass + 1 / b.mass)
          a.v.x += (jImp / a.mass) * nx
          a.v.y += (jImp / a.mass) * ny
          a.v.z += (jImp / a.mass) * nz
          b.v.x -= (jImp / b.mass) * nx
          b.v.y -= (jImp / b.mass) * ny
          b.v.z -= (jImp / b.mass) * nz
          // a knock sets them spinning a little differently
          a.w.x += (rnd() - 0.5) * 0.4
          b.w.z += (rnd() - 0.5) * 0.4
          a.w.clampLength(0.3, 2.2)
          b.w.clampLength(0.3, 2.2)
        }
        const push = (min - dd) / 2
        a.p.x -= nx * push
        a.p.y -= ny * push
        a.p.z -= nz * push
        b.p.x += nx * push
        b.p.y += ny * push
        b.p.z += nz * push
      }
    }
  }
  draw()

  // ---- the console in front: the three gases, their counts, and the count while highlighting ----
  const con = screen({ width: 2.6, height: 1.25, color, title: words.screenTitle, big: '', small: '', titleSize: 0.15 })
  con.group.position.set(0, 0.95, d / 2 + 0.62)
  con.group.rotation.x = -0.62
  const legs = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.75, 0.3, 2, 0.06), plinthMat)
  legs.position.set(0, 0.38, d / 2 + 0.55)
  legs.castShadow = true
  group.add(con.group, legs)
  const cols = {}
  const order = ['N2', 'O2', 'Ar']
  order.forEach((id, i) => {
    const k = kinds[id]
    const cg = new THREE.Group()
    cg.position.set((i - 1) * 0.82, 0.02, 0)
    // a tiny model of the molecule
    const icon = new THREE.Group()
    const im = new THREE.MeshStandardMaterial({ color: k.color, roughness: 0.35, emissive: k.color, emissiveIntensity: 0.25 })
    if (k.order) {
      for (const s of [-1, 1]) {
        const a = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), im)
        a.position.x = s * 0.06
        icon.add(a)
      }
    } else icon.add(new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), im))
    icon.position.set(0, 0.2, 0.05)
    const num = makeText(String(k.count), { size: 0.3, color: hdr('#ffffff', 1.25) })
    num.position.y = -0.06
    const formula = equation([id], { size: 0.13, color: '#c9d4ff' })
    formula.position.y = -0.31
    // an invisible card over the column, to tap (the gas is chosen by touching its column)
    const hit = hitBox(0.74, 0.86, 0.04)
    hit.position.set(0, 0.02, 0.02)
    cg.add(icon, num, formula, hit)
    con.content.add(cg)
    cols[id] = { group: cg, num, icon, mat: im, hit }
  })

  // ---- tapping a molecule in the box: which gas it is (each molecule as a ball round its middle;
  // raycasting the instanced spheres themselves would test every face of all of them every frame) ----
  const picker = new THREE.Object3D()
  const inv = new THREE.Matrix4()
  const lray = new THREE.Ray()
  const ball = new THREE.Sphere()
  const hp = new THREE.Vector3()
  picker.raycast = (raycaster, out) => {
    inner.updateWorldMatrix(true, false)
    inv.copy(inner.matrixWorld).invert()
    lray.copy(raycaster.ray).applyMatrix4(inv)
    let best = null
    for (const m of mols) {
      ball.set(m.p, m.r)
      if (!lray.intersectSphere(ball, hp)) continue
      const d = lray.origin.distanceTo(hp)
      if (!best || d < best.d) best = { d, m, p: hp.clone() }
    }
    if (!best) return
    const point = best.p.applyMatrix4(inner.matrixWorld)
    out.push({ distance: raycaster.ray.origin.distanceTo(point), point, object: picker, gas: best.m.kind.id })
  }
  inner.add(picker)

  // ---- highlight and count ----
  let mode = 'all'
  let counting = null
  // now: every molecule of the kind tagged at once, without the counting (a newcomer in a room)
  const setMode = (next, now = false) => {
    mode = next
    for (const k of Object.values(kinds)) {
      const dimTo = mode === 'all' || mode === k.id ? 0 : 1
      k.dimTo = dimTo
    }
    for (const m of mols) m.tagged = false
    counting = mode === 'all' ? null : { id: mode, t: 0, n: 0, list: mols.filter(m => m.kind.id === mode) }
    for (const [id, c] of Object.entries(cols)) {
      c.num.text = String(kinds[id].count)
      c.num.sync()
      c.targetScale = mode === 'all' ? 1 : mode === id ? 1.15 : 0.85
    }
    if (counting) {
      cols[mode].num.text = '0'
      cols[mode].num.sync()
    }
    if (counting && now) {
      for (const m of counting.list) m.tagged = true
      counting.n = counting.list.length
      cols[mode].num.text = String(counting.n)
      cols[mode].num.sync()
    }
  }
  const pulse = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.06, 6, 40),
    new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  inner.add(pulse)
  let pulseT = 1

  const update = (dt, t, camera) => {
    step(Math.min(dt, 1 / 30))
    for (const k of Object.values(kinds)) {
      const u = k.atomMat.userData.u
      u.uDim.value = damp(u.uDim.value, k.dimTo ?? 0, 4, dt)
      if (k.bondMat) k.bondMat.userData.u.uDim.value = u.uDim.value
    }
    if (counting) {
      counting.t += dt
      // tag one molecule after another: quick for many, slower for few
      const every = Math.min(0.5, 6 / counting.list.length)
      while (counting.n < counting.list.length && counting.t > counting.n * every + 0.4) {
        const m = counting.list[counting.n++]
        m.tagged = true
        m.glow = 1.6
        cols[counting.id].num.text = String(counting.n)
        cols[counting.id].num.sync()
        pulse.position.copy(m.p)
        pulseT = 0
      }
    }
    for (const m of mols) {
      const base = m.tagged ? 0.55 + Math.sin(t * 4 + m.index) * 0.15 : 0
      m.glow = damp(m.glow, base, 3, dt)
    }
    if (pulseT < 1) {
      pulseT = Math.min(1, pulseT + dt * 2.2)
      pulse.scale.setScalar(0.2 + pulseT * 0.5)
      pulse.material.opacity = (1 - pulseT) * 0.9
      if (camera) pulse.quaternion.copy(camera.quaternion)
    }
    for (const c of Object.values(cols)) {
      const s = damp(c.group.scale.x, c.targetScale ?? 1, 6, dt)
      c.group.scale.setScalar(s)
      c.icon.rotation.y = t * 0.8
    }
    draw()
  }

  // ---- the rare one: a CO2 in its own case ----
  const rare = new THREE.Group()
  const caseH = 1.05
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, caseH, 32), plinthMat)
  stand.position.y = caseH / 2
  stand.castShadow = true
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 8, 40), glowMat('#9ff0c0', 1.6))
  ring.rotation.x = Math.PI / 2
  ring.position.y = caseH - 0.02
  const cube = 0.62
  const caseGeo = new THREE.BoxGeometry(cube, cube, cube)
  const caseBack = new THREE.Mesh(caseGeo, glass({ opacity: 0.03, edge: 0.35, side: THREE.BackSide }))
  const caseFront = new THREE.Mesh(caseGeo, glass({ opacity: 0.04, edge: 0.6 }))
  caseBack.position.y = caseFront.position.y = caseH + cube / 2
  caseBack.renderOrder = 2
  caseFront.renderOrder = 4
  // its edges glow, so the case reads against the bright sky
  const edgeMat = glowMat('#9ff0c0', 1.4, { metalness: 0.3 })
  const e = 0.022
  const caseEdges = new THREE.Group()
  caseEdges.position.y = caseH + cube / 2
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      const v = new THREE.Mesh(new THREE.BoxGeometry(e, cube + e, e), edgeMat)
      v.position.set((a * cube) / 2, 0, (b * cube) / 2)
      const hx = new THREE.Mesh(new THREE.BoxGeometry(cube + e, e, e), edgeMat)
      hx.position.set(0, (a * cube) / 2, (b * cube) / 2)
      const hz = new THREE.Mesh(new THREE.BoxGeometry(e, e, cube + e), edgeMat)
      hz.position.set((a * cube) / 2, (b * cube) / 2, 0)
      caseEdges.add(v, hx, hz)
    }
  }
  const co2 = new THREE.Group()
  const cMat = new THREE.MeshPhysicalMaterial({ color: '#42464e', roughness: 0.3, clearcoat: 0.8 })
  const oMat = new THREE.MeshPhysicalMaterial({ color: '#f2302b', roughness: 0.3, clearcoat: 0.8 })
  const sc2 = 0.11
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.4 * sc2 * 1.6, 20, 14), cMat)
  co2.add(c)
  for (const s of [-1, 1]) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.37 * sc2 * 1.6, 20, 14), oMat)
    o.position.x = s * 1.16 * sc2 * 1.6
    co2.add(o)
    for (const off of [-1, 1]) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.16 * sc2 * 1.6, 8), new THREE.MeshStandardMaterial({ color: '#e6ebf5', roughness: 0.4 }))
      st.rotation.z = Math.PI / 2
      st.position.set(s * 0.58 * sc2 * 1.6, off * 0.018, 0)
      co2.add(st)
    }
  }
  co2.position.y = caseH + cube / 2
  co2.traverse(o => o.isMesh && (o.castShadow = true))
  // its label: a small navy plaque on the front of the stand, leaning back to the reader
  const plaque = new THREE.Group()
  plaque.position.set(0, 0.78, 0.27)
  plaque.rotation.x = -0.35
  const plFrame = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.27, 0.025, 2, 0.01), edgeMat)
  const plFace = new THREE.Mesh(
    new RoundedBoxGeometry(0.575, 0.245, 0.03, 2, 0.008),
    new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.35, emissive: '#10173f', emissiveIntensity: 0.6 }),
  )
  plFace.position.z = 0.004
  const tagFormula = equation(['CO2'], { size: 0.1, color: '#9ff0c0' })
  tagFormula.position.set(0, 0.05, 0.022)
  const tag = makeText(words.rareTag, { size: 0.058, color: hdr('#ffffff', 1.15), maxWidth: 0.55 })
  tag.position.set(0, -0.055, 0.022)
  plaque.add(plFrame, plFace, tagFormula, tag)
  rare.add(stand, ring, caseBack, caseFront, caseEdges, co2, plaque)
  const rareUpdate = t => {
    co2.rotation.y = t * 0.7
    co2.rotation.z = Math.sin(t * 0.5) * 0.3
    co2.position.y = caseH + cube / 2 + Math.sin(t * 1.3) * 0.03
  }

  return {
    group,
    con,
    rare,
    rareUpdate,
    kinds,
    mols,
    get mode() {
      return mode
    },
    setMode,
    // things to tap: the molecules (the hit says its `gas`) and the console's columns
    picker,
    columns: Object.fromEntries(order.map(id => [id, cols[id].hit])),
    /** Where a molecule of a gas is now, and a column's middle (world), for the probes. */
    gasAt: id => mols.find(m => m.kind.id === id).p.clone().applyMatrix4(inner.matrixWorld),
    columnAt: id => cols[id].hit.getWorldPosition(new THREE.Vector3()),
    update,
    halfSize: { x: w / 2 + 0.35, z: d / 2 + 0.35 },
  }
}
