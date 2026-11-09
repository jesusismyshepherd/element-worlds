// The Alloy Forge's smithy (alloys.js): the furnace with its glowing coals, flames and embers; the crucible
// in it with the melt (its colour the mix's, carbon that does not dissolve floating as specks); the anvil,
// the ingot on it (dented by each strike, flattened when its rows slip, split when cast iron cracks) and
// the hammer; sparks. Everything moves in update(dt, t); what happens is asked for by the world: splash(),
// pour(onCast), strike(onContact), crack().
import * as THREE from 'three'

export const FURNACE = new THREE.Vector3(-2.25, 0.5, -0.75)
export const ANVIL = new THREE.Vector3(2.2, 0.5, -0.6)
const ANVIL_SCALE = 1.4
const HEARTH_H = 0.52
const ANVIL_TOP = 0.66 // the anvil's face, above the table
const INGOT = { w: 0.64, h: 0.13, d: 0.26 }

const ease = f => f * f * (3 - 2 * f)
const clamp01 = f => Math.max(0, Math.min(1, f))

function radial(size, stops) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const [at, col] of stops) grad.addColorStop(at, col)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
/** A flame: a soft teardrop, bright at its foot. */
function flameTexture() {
  const W = 64
  const H = 128
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const img = g.createImageData(W, H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = 1 - y / H // 1 at the foot
      const half = 0.5 * Math.pow(v, 0.55) * (0.6 + 0.4 * v)
      const dx = Math.abs(x / W - 0.5) / Math.max(0.02, half)
      const a = Math.max(0, 1 - dx * dx) * Math.pow(v, 0.8) * Math.min(1, (1 - v) * 6 + 0.2)
      const i = (y * W + x) * 4
      img.data[i] = 255
      img.data[i + 1] = 255
      img.data[i + 2] = 255
      img.data[i + 3] = Math.round(255 * Math.min(1, a))
    }
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function buildSmithy({ light }) {
  const group = new THREE.Group()
  group.name = 'smithy'
  const glowDot = radial(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']])

  // ---- the furnace: a stone hearth, a bed of coals, flames, embers, its light ----
  const furnace = new THREE.Group()
  furnace.position.copy(FURNACE)
  group.add(furnace)
  const stone = new THREE.MeshStandardMaterial({ color: '#4a3b37', roughness: 0.88, metalness: 0.05 })
  const hearth = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.92, HEARTH_H, 32), stone)
  hearth.position.y = HEARTH_H / 2
  furnace.add(hearth)
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.07, 10, 40), new THREE.MeshStandardMaterial({ color: '#5a4642', roughness: 0.8, emissive: '#ff5a1a', emissiveIntensity: 0.12 }))
  lip.rotation.x = Math.PI / 2
  lip.position.y = HEARTH_H
  furnace.add(lip)
  const bed = new THREE.Mesh(new THREE.CircleGeometry(0.76, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1c').multiplyScalar(1.4), transparent: true, opacity: 0.85 }))
  bed.rotation.x = -Math.PI / 2
  bed.position.y = HEARTH_H + 0.004
  furnace.add(bed)
  // the coals, each glowing and fading on its own
  const COALS = light ? 16 : 30
  const coalGeo = new THREE.DodecahedronGeometry(0.075, 0)
  const coals = new THREE.InstancedMesh(coalGeo, new THREE.MeshBasicMaterial({ color: '#ffffff' }), COALS)
  const coalHeat = []
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const v3 = new THREE.Vector3()
  const s3 = new THREE.Vector3()
  for (let i = 0; i < COALS; i++) {
    const a = (i / COALS) * Math.PI * 2 + (i % 3) * 0.4
    const r = 0.4 + ((i * 37) % 11) / 11 * 0.3
    e.set(i * 1.7, i * 2.3, i * 0.9)
    q.setFromEuler(e)
    v3.set(Math.cos(a) * r, HEARTH_H + 0.03 + ((i * 13) % 5) * 0.01, Math.sin(a) * r)
    s3.setScalar(0.75 + ((i * 29) % 7) / 10)
    m4.compose(v3, q, s3)
    coals.setMatrixAt(i, m4)
    coalHeat.push({ f: 1.3 + ((i * 17) % 9) / 6, p: i * 2.1 })
  }
  coals.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COALS * 3), 3)
  furnace.add(coals)
  const ember = new THREE.Color('#3b1206')
  const hotCoal = new THREE.Color('#ff7a22').multiplyScalar(2.4)
  const c3 = new THREE.Color()
  // a halo over the fire
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowDot, color: '#ff7a2a', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
  halo.scale.set(2.6, 2.0, 1)
  halo.position.y = HEARTH_H + 0.45
  furnace.add(halo)
  const flameTex = flameTexture()
  const flames = []
  const FLAMES = light ? 4 : 7
  for (let i = 0; i < FLAMES; i++) {
    const mat = new THREE.SpriteMaterial({ map: flameTex, color: i % 2 ? '#ffb347' : '#ff6a20', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    const s = new THREE.Sprite(mat)
    s.center.set(0.5, 0)
    const a = (i / FLAMES) * Math.PI * 2
    s.position.set(Math.cos(a) * 0.42, HEARTH_H + 0.02, Math.sin(a) * 0.42)
    furnace.add(s)
    flames.push({ s, p: i * 1.9, h: 0.42 + (i % 3) * 0.1 })
  }
  // embers drifting up
  const EMBERS = light ? 18 : 44
  const emberPos = new Float32Array(EMBERS * 3)
  const embers = []
  for (let i = 0; i < EMBERS; i++) embers.push({ y: Math.random() * 1.6, a: Math.random() * 6.3, r: Math.random() * 0.55, s: 0.25 + Math.random() * 0.35 })
  const emberGeo = new THREE.BufferGeometry()
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
  const emberPts = new THREE.Points(emberGeo, new THREE.PointsMaterial({ map: glowDot, color: new THREE.Color('#ffa040').multiplyScalar(2), size: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  emberPts.frustumCulled = false
  furnace.add(emberPts)
  const fireLight = new THREE.PointLight('#ff8a3a', 9, 9, 1.4)
  fireLight.position.set(0, HEARTH_H + 0.8, 0.2)
  furnace.add(fireLight)

  // ---- the crucible and the melt ----
  const crucible = new THREE.Group()
  const rest = new THREE.Vector3(FURNACE.x, FURNACE.y + HEARTH_H - 0.1, FURNACE.z)
  crucible.position.copy(rest)
  group.add(crucible)
  const prof = [[0, 0], [0.2, 0], [0.25, 0.025], [0.3, 0.25], [0.335, 0.49], [0.345, 0.52], [0.315, 0.52], [0.29, 0.27], [0.235, 0.07], [0, 0.07]].map(([x, y]) => new THREE.Vector2(x, y))
  const clay = new THREE.MeshStandardMaterial({ color: '#7a5244', roughness: 0.75, metalness: 0.05, emissive: '#ff4a14', emissiveIntensity: 0.3 })
  const cup = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), clay)
  crucible.add(cup)
  const meltMat = new THREE.MeshStandardMaterial({ color: '#ffb36b', roughness: 0.25, metalness: 0.2, emissive: '#ff8a3a', emissiveIntensity: 1.5 })
  const melt = new THREE.Mesh(new THREE.CircleGeometry(1, 40), meltMat)
  melt.rotation.x = -Math.PI / 2
  melt.visible = false
  crucible.add(melt)
  // a shimmer on the melt: a slow bright spot wandering over it
  const glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowDot, color: '#fff2c8', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }))
  glint.scale.setScalar(0.22)
  crucible.add(glint)
  // carbon floating on a melt it does not dissolve in, or lying in the bottom alone
  const SPECKS = 14
  const specks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.03, 0), new THREE.MeshStandardMaterial({ color: '#1b1c20', roughness: 0.9 }), SPECKS)
  specks.count = 0
  crucible.add(specks)
  let meltLevel = 0 // 0..1, the crucible's fill
  let meltShown = 0
  const meltColor = new THREE.Color()
  const meltGlow = new THREE.Color()
  const levelY = f => 0.09 + f * 0.36
  const radiusAtY = y => 0.235 + ((0.315 - 0.235) * (y - 0.07)) / 0.45
  let floating = 0
  let carbonOnly = false
  /** The melt: its colour, how full (0..1), carbon floating (pinches), carbon alone (no melt). */
  const setMelt = (look, fill, { carbon = 0, alone = false } = {}) => {
    meltColor.set(look)
    meltGlow.set('#ff7a24').lerp(meltColor, 0.35)
    meltLevel = fill
    floating = carbon
    carbonOnly = alone
  }

  // splashes: a ring and droplets where a lump falls in
  const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc070').multiplyScalar(2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 36), ringMat)
  ring.rotation.x = Math.PI / 2
  crucible.add(ring)
  const dropGeo = new THREE.SphereGeometry(0.022, 8, 6)
  const dropMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb060').multiplyScalar(2.2) })
  const drops = []
  for (let i = 0; i < (light ? 4 : 7); i++) {
    const d = new THREE.Mesh(dropGeo, dropMat)
    d.visible = false
    crucible.add(d)
    drops.push({ d, v: new THREE.Vector3(), life: 0 })
  }
  let ringAge = 9
  const splash = (big = 1) => {
    ringAge = 0
    drops.forEach((p, i) => {
      const a = (i / drops.length) * Math.PI * 2 + Math.random()
      p.d.visible = true
      p.d.position.set(Math.cos(a) * 0.06, levelY(meltShown), Math.sin(a) * 0.06)
      p.v.set(Math.cos(a) * (0.4 + Math.random() * 0.3), 0.9 + Math.random() * 0.6 * big, Math.sin(a) * (0.4 + Math.random() * 0.3))
      p.life = 0.8
    })
  }

  // ---- the anvil, the ingot and the hammer ----
  const anvil = new THREE.Group()
  anvil.position.copy(ANVIL)
  anvil.scale.setScalar(ANVIL_SCALE)
  group.add(anvil)
  const iron = new THREE.MeshStandardMaterial({ color: '#3f444c', roughness: 0.38, metalness: 0.85 })
  const wood = new THREE.MeshStandardMaterial({ color: '#5b3b26', roughness: 0.8 })
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.22, 20), wood)
  stump.position.y = 0.11
  anvil.add(stump)
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.36), iron)
  foot.position.y = 0.27
  const waist = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.24), iron)
  waist.position.y = 0.41
  const face = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.16, 0.34), iron)
  face.position.y = ANVIL_TOP - 0.08
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.42, 20), iron)
  horn.rotation.z = Math.PI / 2
  horn.position.set(-0.62, ANVIL_TOP - 0.1, 0)
  horn.scale.set(1, 1, 0.9)
  anvil.add(foot, waist, face, horn)
  const faceTop = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.012, 0.34), new THREE.MeshStandardMaterial({ color: '#8e96a2', roughness: 0.22, metalness: 1 }))
  faceTop.position.y = ANVIL_TOP + 0.002
  anvil.add(faceTop)

  const ingotMat = new THREE.MeshStandardMaterial({ color: '#d27d4f', roughness: 0.3, metalness: 1, emissive: '#ff6a1a', emissiveIntensity: 0 })
  const ingotGeo = new THREE.BoxGeometry(INGOT.w, INGOT.h, INGOT.d, 32, 2, 12)
  const base = Float32Array.from(ingotGeo.attributes.position.array)
  const ingot = new THREE.Mesh(ingotGeo, ingotMat)
  const ingotRest = new THREE.Vector3(0, ANVIL_TOP + INGOT.h / 2 + 0.006, 0)
  ingot.position.copy(ingotRest)
  anvil.add(ingot)
  // cast iron's two halves, shown when it cracks
  const halfGeo = new THREE.BoxGeometry(INGOT.w / 2, INGOT.h, INGOT.d, 8, 2, 6)
  const halves = [-1, 1].map(s => {
    const h = new THREE.Mesh(halfGeo, ingotMat)
    h.visible = false
    anvil.add(h)
    return { h, s }
  })
  const crackMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a40').multiplyScalar(2.5), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const crackGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.02, INGOT.h * 1.4), crackMat)
  crackGlow.position.copy(ingotRest)
  crackGlow.position.z = INGOT.d / 2 + 0.003
  anvil.add(crackGlow)
  let squash = 1
  let hot = 0 // 1 just cast, cooling to 0
  let cracked = 0 // 0 whole, then 0..1 the halves falling apart
  let crackAge = 9
  let growing = 1 // the ingot rising out of the pour, 0..1
  const hotColor = new THREE.Color()
  const WHITE_HOT = new THREE.Color('#fff1c4')
  const ORANGE = new THREE.Color('#ff7a22')
  const RED = new THREE.Color('#a8200a')

  const resetIngot = (look, { hotNow = 0, squashTo = 1 } = {}) => {
    ingotGeo.attributes.position.array.set(base)
    ingotGeo.attributes.position.needsUpdate = true
    ingotGeo.computeVertexNormals()
    ingotMat.color.set(look)
    squash = squashTo
    hot = hotNow
    cracked = 0
    crackAge = 9
    ingot.visible = true
    for (const { h } of halves) h.visible = false
    crackMat.opacity = 0
  }
  /** A dent at (x, z) on the ingot's top (metres from its centre), `depth` deep. */
  const dent = (x, z, depth) => {
    const p = ingotGeo.attributes.position
    const R = 0.075
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i)
      if (base[i * 3 + 1] < INGOT.h / 2 - 1e-4) continue
      const d = Math.hypot(p.getX(i) - x, p.getZ(i) - z)
      if (d >= R) continue
      const k = Math.pow(1 - (d / R) * (d / R), 1.5)
      p.setY(i, Math.max(-INGOT.h * 0.2, y - depth * k))
    }
    p.needsUpdate = true
    ingotGeo.computeVertexNormals()
  }
  const flatten = k => {
    squash = Math.max(0.55, squash * k)
  }
  const crack = (now = true) => {
    cracked = now ? 0.001 : 1
    crackAge = now ? 0 : 9
    ingot.visible = false
    for (const { h } of halves) h.visible = true
  }

  // the hammer: its pivot (a wrist) right of the anvil, the handle pointing back over the ingot
  const hammer = new THREE.Group()
  const pivot = new THREE.Vector3(0.66, ANVIL_TOP + INGOT.h + 0.13, 0.04)
  hammer.position.copy(pivot)
  anvil.add(hammer)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.72, 12), wood)
  handle.rotation.z = Math.PI / 2
  handle.position.x = -0.28
  const headMat = new THREE.MeshStandardMaterial({ color: '#6f7782', roughness: 0.3, metalness: 1 })
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.13), headMat)
  head.position.set(-0.64, 0, 0)
  const cheek = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 20), headMat)
  cheek.position.set(-0.64, -0.13, 0)
  hammer.add(handle, head, cheek)
  const REST = -0.95
  hammer.rotation.z = REST
  let swing = null // { t, onContact, done }

  // sparks
  const SPARKS = light ? 30 : 70
  const sparkPos = new Float32Array(SPARKS * 3)
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  const sparkPts = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ map: glowDot, color: new THREE.Color('#ffd27a').multiplyScalar(2.4), size: 0.045, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  sparkPts.frustumCulled = false
  group.add(sparkPts)
  const sparks = []
  for (let i = 0; i < SPARKS; i++) sparks.push({ p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), life: 0 })
  let nextSpark = 0
  const burst = (at, n, { up = 1.6, spread = 1.4 } = {}) => {
    for (let i = 0; i < n; i++) {
      const s = sparks[nextSpark]
      nextSpark = (nextSpark + 1) % SPARKS
      const a = Math.random() * Math.PI * 2
      s.p.copy(at)
      s.v.set(Math.cos(a) * spread * (0.4 + Math.random()), up * (0.5 + Math.random()), Math.sin(a) * spread * (0.4 + Math.random()))
      s.life = 0.5 + Math.random() * 0.5
    }
  }
  const contactPoint = () => anvil.localToWorld(new THREE.Vector3(0.02, ANVIL_TOP + INGOT.h * squash, 0))

  /** Swing the hammer: up, down onto the ingot (onContact then), and back. */
  const strike = onContact => {
    swing = { t: 0, onContact, hit: false }
  }

  // ---- the pour: the crucible lifts out of the fire, flies over the anvil, tips, and the ingot grows ----
  let pourAnim = null
  const lipLocal = new THREE.Vector3(0.33, 0.52, 0)
  const streamMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc070').multiplyScalar(2.6) })
  let stream = null
  anvil.updateMatrixWorld(true)
  const above = anvil.localToWorld(new THREE.Vector3(-0.4, ANVIL_TOP + 0.44, 0))
  const pour = (look, { onCast, onDone, quick = false } = {}) => {
    if (quick) {
      resetIngot(look)
      onCast?.()
      onDone?.()
      return
    }
    pourAnim = { t: 0, look, onCast, onDone, cast: false, from: crucible.position.clone() }
  }
  const pourPath = f => {
    // f 0..1 out to the anvil (up, across), f 1..2 back
    const up = new THREE.Vector3(rest.x, rest.y + 1.3, rest.z)
    const mid = new THREE.Vector3((rest.x + above.x) / 2, Math.max(up.y, above.y) + 0.4, (rest.z + above.z) / 2)
    const out = new THREE.Vector3()
    if (f <= 0.35) out.lerpVectors(rest, up, ease(f / 0.35))
    else if (f <= 1) {
      const g = ease((f - 0.35) / 0.65)
      // a quadratic arc up over the slab's foot and down above the anvil
      const a = up.clone().lerp(mid, g)
      const b = mid.clone().lerp(above, g)
      out.lerpVectors(a, b, g)
    } else {
      const g = ease(Math.min(1, f - 1))
      const a = above.clone().lerp(mid, g)
      const b = mid.clone().lerp(rest, g)
      out.lerpVectors(a, b, g)
    }
    return out
  }

  // ---- every frame ----
  const update = (dt, t) => {
    // coals, flames, halo, light
    for (let i = 0; i < COALS; i++) {
      const h = coalHeat[i]
      const k = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * h.f + h.p)) * (0.75 + 0.25 * Math.sin(t * 7.1 + h.p * 3))
      c3.copy(ember).lerp(hotCoal, k)
      coals.setColorAt(i, c3)
    }
    coals.instanceColor.needsUpdate = true
    const flick = 0.85 + 0.1 * Math.sin(t * 9.3) + 0.06 * Math.sin(t * 23.7)
    fireLight.intensity = 9 * flick
    halo.material.opacity = 0.42 + 0.12 * Math.sin(t * 5.1)
    for (const f of flames) {
      const k = 0.75 + 0.25 * Math.sin(t * 8 + f.p) + 0.12 * Math.sin(t * 19 + f.p * 2)
      f.s.scale.set(0.2 + 0.04 * Math.sin(t * 6 + f.p), f.h * k, 1)
      f.s.material.opacity = 0.65 + 0.25 * Math.sin(t * 11 + f.p)
    }
    embers.forEach((m, i) => {
      m.y += m.s * dt
      m.a += dt * 0.6
      if (m.y > 1.7) {
        m.y = 0
        m.r = Math.random() * 0.55
      }
      emberPos[i * 3] = Math.cos(m.a) * m.r * (1 + m.y * 0.4)
      emberPos[i * 3 + 1] = HEARTH_H + 0.05 + m.y
      emberPos[i * 3 + 2] = Math.sin(m.a) * m.r * (1 + m.y * 0.4)
    })
    emberGeo.attributes.position.needsUpdate = true

    // the melt rises and falls with what is in the crucible
    meltShown += (meltLevel - meltShown) * Math.min(1, dt * 4)
    melt.visible = meltShown > 0.02 && !carbonOnly
    const y = levelY(meltShown)
    melt.position.y = y
    melt.scale.setScalar(radiusAtY(y) - 0.004)
    meltMat.color.copy(meltColor)
    meltMat.emissive.copy(meltGlow)
    meltMat.emissiveIntensity = 1.25 + 0.2 * Math.sin(t * 2.3) + 0.1 * Math.sin(t * 5.7)
    glint.visible = melt.visible
    glint.position.set(Math.cos(t * 0.7) * 0.12, y + 0.01, Math.sin(t * 0.9) * 0.1)
    const shown = Math.min(SPECKS, carbonOnly ? Math.max(3, floating) : floating)
    specks.count = shown
    for (let i = 0; i < shown; i++) {
      const a = i * 2.4 + t * 0.15
      const r = 0.05 + ((i * 7) % 5) * 0.04
      v3.set(Math.cos(a) * r, carbonOnly ? 0.1 : y + 0.012, Math.sin(a) * r)
      e.set(i, i * 2, 0)
      q.setFromEuler(e)
      s3.setScalar(carbonOnly ? 1.6 : 1)
      m4.compose(v3, q, s3)
      specks.setMatrixAt(i, m4)
    }
    specks.instanceMatrix.needsUpdate = true
    ringAge += dt
    ring.visible = ringAge < 0.55
    if (ring.visible) {
      ring.position.y = y + 0.01
      ring.scale.setScalar(1 + ringAge * 3.2)
      ringMat.opacity = 0.9 * (1 - ringAge / 0.55)
    }
    for (const p of drops) {
      if (!p.d.visible) continue
      p.life -= dt
      p.v.y -= 4.5 * dt
      p.d.position.addScaledVector(p.v, dt * 0.35)
      if (p.life <= 0 || p.d.position.y < y) p.d.visible = false
    }

    // the pour
    if (pourAnim) {
      const P = pourAnim
      P.t += dt
      const OUT = 1.05
      const TIP = 0.3
      const POUR = 0.95
      const BACK = 1.0
      let f
      if (P.t < OUT) {
        f = P.t / OUT
        crucible.position.copy(pourPath(f))
        crucible.rotation.z = 0
      } else if (P.t < OUT + TIP + POUR + TIP) {
        crucible.position.copy(above)
        const g = P.t - OUT
        crucible.rotation.z = g < TIP ? -1.75 * ease(g / TIP) : g < TIP + POUR ? -1.75 : -1.75 * (1 - ease((g - TIP - POUR) / TIP))
        const pouring = g >= TIP * 0.6 && g < TIP + POUR
        if (pouring && !stream) {
          crucible.updateMatrixWorld(true)
          const from = crucible.localToWorld(lipLocal.clone())
          const to = anvil.localToWorld(new THREE.Vector3(0, ANVIL_TOP + 0.02, 0))
          const ctrl = from.clone().lerp(to, 0.5)
          ctrl.x += 0.12
          const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to)
          stream = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.028, 8), streamMat)
          stream.geometry.setDrawRange(0, 0)
          group.add(stream)
          // the old ingot melts away under it
          resetIngot(P.look, { hotNow: 1 })
          growing = 0
        }
        if (stream) {
          const k = clamp01((g - TIP * 0.6) / 0.25)
          const end = g > TIP + POUR - 0.2 ? clamp01((TIP + POUR - g) / 0.2) : 1
          const n = stream.geometry.index.count
          const startF = 1 - end
          stream.geometry.setDrawRange(Math.floor(n * startF / 6) * 6, Math.floor((n * (k - startF)) / 6) * 6)
          growing = clamp01((g - TIP) / (POUR * 0.85))
          if (Math.random() < dt * 30) burst(anvil.localToWorld(new THREE.Vector3((Math.random() - 0.5) * 0.4, ANVIL_TOP + 0.08, 0)), 1, { up: 0.9, spread: 0.6 })
        }
        if (!pouring && stream && g >= TIP + POUR) {
          group.remove(stream)
          stream.geometry.dispose()
          stream = null
          growing = 1
          if (!P.cast) {
            P.cast = true
            P.onCast?.()
          }
        }
      } else {
        f = 1 + (P.t - OUT - TIP * 2 - POUR) / BACK
        crucible.rotation.z = 0
        crucible.position.copy(pourPath(Math.min(2, f)))
        if (f >= 2) {
          crucible.position.copy(rest)
          if (!P.cast) P.onCast?.()
          pourAnim = null
          growing = 1
          P.onDone?.()
        }
      }
    }

    // the ingot: rising out of the pour, cooling, flattened, cracked
    hot = Math.max(0, hot - dt / 6)
    if (hot > 0.66) hotColor.copy(ORANGE).lerp(WHITE_HOT, (hot - 0.66) / 0.34)
    else if (hot > 0.25) hotColor.copy(RED).lerp(ORANGE, (hot - 0.25) / 0.41)
    else hotColor.copy(RED)
    ingotMat.emissive.copy(hotColor)
    ingotMat.emissiveIntensity = hot > 0.25 ? 0.6 + hot * 2.4 : hot * 4
    const gy = 0.04 + 0.96 * ease(growing)
    ingot.scale.set(1 / Math.sqrt(squash), squash * gy, 1 / Math.sqrt(squash))
    ingot.position.y = ANVIL_TOP + (INGOT.h * squash * gy) / 2 + 0.006
    if (cracked > 0) {
      crackAge += dt
      cracked = Math.min(1, cracked + dt * 3)
      const k = ease(cracked)
      for (const { h, s } of halves) {
        h.position.set(s * (INGOT.w / 4 + 0.03 * k), ANVIL_TOP + INGOT.h / 2 + 0.006 + 0.01 * k, s * 0.015 * k)
        h.rotation.set(0, s * 0.12 * k, -s * 0.14 * k)
      }
      crackMat.opacity = Math.max(0, 1 - crackAge / 0.6)
    }

    // the hammer
    if (swing) {
      swing.t += dt
      const T = swing.t
      let a
      if (T < 0.16) a = REST + (-1.25 - REST) * ease(T / 0.16)
      else if (T < 0.26) a = -1.25 + 1.25 * Math.pow((T - 0.16) / 0.1, 2)
      else if (T < 0.4) a = -0.32 * Math.sin(((T - 0.26) / 0.14) * Math.PI * 0.5)
      else if (T < 0.8) a = -0.32 + (REST + 0.32) * ease((T - 0.4) / 0.4)
      else a = REST
      if (T >= 0.26 && !swing.hit) {
        swing.hit = true
        a = 0
        swing.onContact?.(contactPoint())
      }
      hammer.rotation.z = a
      if (T >= 0.8) swing = null
    }
    // the hammer stands a little higher over a flattened ingot
    hammer.position.y = pivot.y - INGOT.h * (1 - squash)

    // sparks
    for (let i = 0; i < SPARKS; i++) {
      const s = sparks[i]
      if (s.life > 0) {
        s.life -= dt
        s.v.y -= 6 * dt
        s.p.addScaledVector(s.v, dt)
        if (s.p.y < 0.52 && Math.hypot(s.p.x, s.p.z) < 4.2) {
          s.p.y = 0.52
          s.v.y *= -0.3
          s.v.x *= 0.6
          s.v.z *= 0.6
        }
      } else s.p.y = -50
      sparkPos[i * 3] = s.p.x
      sparkPos[i * 3 + 1] = s.p.y
      sparkPos[i * 3 + 2] = s.p.z
    }
    sparkGeo.attributes.position.needsUpdate = true
  }

  return {
    group,
    crucible,
    crucibleTargets: [cup, melt, hearth, bed, coals],
    anvilTargets: [stump, foot, waist, face, horn, faceTop, ingot, ...halves.map(h => h.h), handle, head, cheek],
    setMelt,
    splash,
    pour,
    pouring: () => !!pourAnim,
    strike,
    swinging: () => !!swing,
    resetIngot,
    dent,
    flatten,
    crack,
    burst,
    contactPoint,
    meltPoint: () => crucible.localToWorld(new THREE.Vector3(0, levelY(meltShown), 0)),
    ingotTop: () => anvil.localToWorld(new THREE.Vector3(0, ANVIL_TOP + INGOT.h * squash, 0)),
    update,
    dispose() {
      glowDot.dispose()
      flameTex.dispose()
    },
  }
}
