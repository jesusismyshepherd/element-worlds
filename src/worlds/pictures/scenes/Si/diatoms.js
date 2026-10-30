// Silicon's picture "Who lives in a house made of glass?" as a room (docs/knowledge/picture-rooms.md):
// shrunk to a diatom's size on a sunlit sea floor, diatoms of the picture's four kinds drifting round
// (round, boat, triangle, star). Three things to do: the round diatom opens like a box and its lid, the
// cell inside; diatoms in the sun give off oxygen; a diatom family shrinks with each division until the
// smallest leaves its glass and grows big again. All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { canvasTex, at, clamp, lerp, damp } from '../../../wings/noble/kit.js'
import { waterStage } from '../../stages/water.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle } from '../../../../engine/collide.js'
import { DIATOMS_WORDS } from './diatoms.words.js'

export const WORDS = DIATOMS_WORDS

const TAU = Math.PI * 2

// ---- the glass: textures and materials every diatom here shares ----

function materials() {
  // a round valve's face: radial ribs and rows of pores, the pores cut through (the cell shows behind)
  const face = canvasTex(1024, 1024, (g, w) => {
    const c = w / 2
    const R = c - 6
    g.clearRect(0, 0, w, w)
    g.fillStyle = '#a6efdc'
    g.beginPath()
    g.arc(c, c, R, 0, TAU)
    g.fill()
    const ribs = 28
    g.strokeStyle = '#effffa'
    g.lineWidth = 7
    for (let i = 0; i < ribs; i++) {
      const a = (i / ribs) * TAU
      g.beginPath()
      g.moveTo(c + Math.cos(a) * R * 0.19, c + Math.sin(a) * R * 0.19)
      g.lineTo(c + Math.cos(a) * R * 0.97, c + Math.sin(a) * R * 0.97)
      g.stroke()
    }
    g.lineWidth = 14
    g.beginPath()
    g.arc(c, c, R - 8, 0, TAU)
    g.stroke()
    g.lineWidth = 8
    g.beginPath()
    g.arc(c, c, R * 0.19, 0, TAU)
    g.stroke()
    g.globalCompositeOperation = 'destination-out'
    for (let r = R * 0.25; r < R * 0.92; r += R * 0.05) {
      const pr = R * (0.012 + (r / R) * 0.009)
      for (let i = 0; i < ribs; i++) {
        const a0 = (i / ribs) * TAU
        const span = (TAU / ribs) * r
        const k = Math.max(1, Math.floor(span / (pr * 3.3)))
        for (let j = 0; j < k; j++) {
          const a = a0 + (TAU / ribs) * ((j + 0.5) / k)
          g.beginPath()
          g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, pr, 0, TAU)
          g.fill()
        }
      }
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU
      g.beginPath()
      g.arc(c + Math.cos(a) * R * 0.105, c + Math.sin(a) * R * 0.105, R * 0.028, 0, TAU)
      g.fill()
    }
    g.globalCompositeOperation = 'source-over'
  })
  // the valve's rim (its mantle): two rows of pores
  const band = canvasTex(1024, 128, (g, w, h) => {
    g.fillStyle = '#9fe8d5'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#effffa'
    g.fillRect(0, 0, w, 12)
    g.fillRect(0, h - 12, w, 12)
    g.globalCompositeOperation = 'destination-out'
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 64; i++) {
        g.beginPath()
        g.arc((i + 0.5 + row * 0.5) * (w / 64), h * (0.36 + row * 0.3), 6, 0, TAU)
        g.fill()
      }
    }
    g.globalCompositeOperation = 'source-over'
  })
  band.wrapS = THREE.RepeatWrapping
  band.repeat.set(3, 1)
  // the girdle: overlapping bands of glass
  const girdle = canvasTex(64, 256, (g, w, h) => {
    g.fillStyle = '#8ad8c4'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#d2fff2'
    for (let i = 0; i < 6; i++) g.fillRect(0, (i + 0.5) * (h / 6), w, 5)
  })
  // a boat's face: a slit down the middle, rows of fine pores across, two golden plastids under the glass
  const boatDraw = glow => (g, w) => {
    const c = w / 2
    g.fillStyle = glow ? '#000000' : '#b4ecd8'
    g.fillRect(0, 0, w, w)
    g.fillStyle = glow ? '#ffffff' : '#c99a3a'
    for (const s of [-1, 1]) {
      g.beginPath()
      g.ellipse(c, c + s * w * 0.2, w * 0.4, w * 0.11, 0, 0, TAU)
      g.fill()
    }
    if (glow) return
    g.strokeStyle = 'rgba(232,255,247,0.85)'
    g.lineWidth = 3
    for (let i = 0; i < 70; i++) {
      const x = (i + 0.5) * (w / 70)
      g.beginPath()
      g.moveTo(x, c - w * 0.47)
      g.lineTo(x, c - w * 0.05)
      g.moveTo(x, c + w * 0.05)
      g.lineTo(x, c + w * 0.47)
      g.stroke()
    }
    g.fillStyle = '#effffa'
    g.fillRect(w * 0.06, c - 5, w * 0.88, 10)
    g.beginPath()
    g.arc(c, c, w * 0.05, 0, TAU)
    g.fill()
  }
  const boat = canvasTex(512, 512, boatDraw(false))
  const boatGlow = canvasTex(512, 512, boatDraw(true))
  // a triangle's face: hexagonal chambers
  const hex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#a3ecd9'
    g.fillRect(0, 0, w, w)
    g.globalCompositeOperation = 'destination-out'
    const s = w / 8
    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < 9; i++) {
        const x = (i + (j % 2) * 0.5) * s
        const y = j * s * 0.866
        g.beginPath()
        for (let k = 0; k < 6; k++) g.lineTo(x + Math.cos((k / 6) * TAU) * s * 0.36, y + Math.sin((k / 6) * TAU) * s * 0.36)
        g.fill()
      }
    }
    g.globalCompositeOperation = 'source-over'
  })
  hex.wrapS = hex.wrapT = THREE.RepeatWrapping
  hex.repeat.set(2.4, 2.4)

  const glass = (map, extra = {}) =>
    new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.25, metalness: 0.05, emissive: '#2fc7ae', emissiveMap: map, emissiveIntensity: 0.35, ...extra })
  return {
    textures: [face, band, girdle, boat, boatGlow, hex],
    valve: glass(face),
    band: glass(band),
    girdle: new THREE.MeshStandardMaterial({ map: girdle, side: THREE.DoubleSide, roughness: 0.3, emissive: '#1f8f7d', emissiveIntensity: 0.3 }),
    rim: new THREE.MeshStandardMaterial({ color: '#e9fff7', emissive: '#7ff0da', emissiveIntensity: 0.55, roughness: 0.3 }),
    cell: new THREE.MeshStandardMaterial({ color: '#c9d98e', roughness: 0.7, emissive: '#3c4d14', emissiveIntensity: 0.3 }),
    golden: new THREE.MeshStandardMaterial({ color: '#c58a26', roughness: 0.55, emissive: '#6e4108', emissiveIntensity: 0.5 }),
    nucleus: new THREE.MeshStandardMaterial({ color: '#efe3c2', roughness: 0.6, emissive: '#3d3420', emissiveIntensity: 0.3 }),
    boat: new THREE.MeshStandardMaterial({ map: boat, roughness: 0.3, emissive: '#ffb540', emissiveMap: boatGlow, emissiveIntensity: 0.15 }),
    tri: glass(hex),
    o2: new THREE.MeshStandardMaterial({ color: '#e81f1f', roughness: 0.35, emissive: '#5a0505', emissiveIntensity: 0.5 }),
    flash: new THREE.MeshBasicMaterial({ color: '#dffff6', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  }
}

// ---- the diatoms ----

/** A round (centric) diatom: a pillbox facing +z, the front valve (the lid) over the back one, the girdle
 *  round the middle, and the cell inside: `cell` 'full' (chloroplasts and nucleus) or 'simple'. */
function centric(M, { R = 1, h = 0.6, cell = 'full' }) {
  const group = new THREE.Group()
  const m = h * 0.38
  const valve = (r, dir) => {
    const v = new THREE.Group()
    const face = new THREE.Mesh(new THREE.CircleGeometry(r, 72), M.valve)
    face.position.z = (dir * h) / 2
    if (dir < 0) face.rotation.y = Math.PI
    const mantle = new THREE.Mesh(new THREE.CylinderGeometry(r, r, m, 72, 1, true), M.band)
    mantle.rotation.x = Math.PI / 2
    mantle.position.z = dir * (h / 2 - m / 2)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.022 + 0.008, 8, 72), M.rim)
    rim.position.z = (dir * h) / 2
    v.add(face, mantle, rim)
    return { group: v, face }
  }
  const front = valve(R, 1)
  const back = valve(R * 0.96, -1)
  const girdle = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.975, R * 0.975, h * 0.5, 72, 1, true), M.girdle)
  girdle.rotation.x = Math.PI / 2
  group.add(front.group, back.group, girdle)
  const inner = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.86, R * 0.86, h * 0.74, 48), cell === 'full' ? M.cell : M.golden)
  body.rotation.x = Math.PI / 2
  inner.add(body)
  if (cell === 'full') {
    // golden-brown chloroplasts on the cell's face, a nucleus in the middle
    // small flat discs scattered over the face (in rings they read as a pattern, not as a living cell)
    const n = 34
    const chl = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 10), M.golden, n)
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996
      const ring = 0.28 + 0.52 * Math.sqrt((i + 0.5) / n)
      o.position.set(Math.cos(a) * R * ring, Math.sin(a) * R * ring, h * 0.37)
      o.rotation.set(0, 0, a * 1.7)
      o.scale.set(R * 0.1, R * 0.065, R * 0.025)
      o.updateMatrix()
      chl.setMatrixAt(i, o.matrix)
    }
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(R * 0.15, 20, 14), M.nucleus)
    nucleus.position.z = h * 0.33
    inner.add(chl, nucleus)
  }
  group.add(inner)
  return { group, front: front.group, back: back.group, faces: [front.face, back.face], inner, R, h }
}

/** A boat-shaped (pennate) diatom lying with a valve up: an elliptic pillbox. */
function pennate(M, { L = 0.6, W = 0.18, h = 0.1 }) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, h, 40), [M.girdle, M.boat, M.boat])
  mesh.scale.set(L, 1, W)
  const group = new THREE.Group()
  group.add(mesh)
  return group
}

/** A triangular diatom (like Triceratium): a rounded triangle of hexagonal chambers, facing +z. */
function triangle(M, { r = 0.5, h = 0.14 }) {
  const shape = new THREE.Shape()
  const pts = [0, 1, 2].map(i => {
    const a = (i / 3) * TAU + Math.PI / 2
    return [Math.cos(a) * r, Math.sin(a) * r]
  })
  const k = 0.25
  for (let i = 0; i < 3; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % 3]
    const ax = lerp(x0, x1, k)
    const ay = lerp(y0, y1, k)
    if (i === 0) shape.moveTo(ax, ay)
    else shape.lineTo(ax, ay)
    shape.lineTo(lerp(x0, x1, 1 - k), lerp(y0, y1, 1 - k))
    const [x2, y2] = pts[(i + 2) % 3]
    shape.quadraticCurveTo(x1, y1, lerp(x1, x2, k), lerp(y1, y2, k))
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: true, bevelThickness: h * 0.3, bevelSize: r * 0.06, bevelSegments: 3, curveSegments: 10 })
  geo.translate(0, 0, -h / 2)
  return new THREE.Mesh(geo, [M.tri, M.girdle])
}

/** A star-shaped colony (like Asterionella): rods joined at one end, a golden plastid in each. */
function star(M, { n = 8, len = 0.7 }) {
  const group = new THREE.Group()
  const rod = new THREE.CapsuleGeometry(0.035, len, 4, 10)
  const blob = new THREE.SphereGeometry(1, 12, 8)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    const arm = new THREE.Group()
    arm.rotation.z = a
    const r = new THREE.Mesh(rod, M.girdle)
    r.position.y = len / 2 + 0.05
    const b = new THREE.Mesh(blob, M.golden)
    b.scale.set(0.045, 0.16, 0.045)
    b.position.y = len * 0.55
    arm.add(r, b)
    group.add(arm)
  }
  return group
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, light, level }) {
  const stage = waterStage({ radius: 10, light })
  root.add(stage.group)
  const solids = stage.solids
  const M = materials()
  const share = id => ctx.share?.(id)
  const updates = []

  // diatoms of the picture's kinds, drifting overhead and round about (scenery)
  const drift = []
  const add = (obj, x, y, z, spin) => {
    obj.position.set(x, y, z)
    root.add(obj)
    drift.push({ obj, y, spin, phase: x * 1.3 + z })
  }
  for (const [x, y, z, R] of [[-6.5, 5.2, -6.5, 0.6], [7.5, 6.5, -5, 0.45], [-3, 7.5, 3, 0.4], [5.5, 3.6, 6.5, 0.35]]) {
    const d = centric(M, { R, h: R * 0.5, cell: 'simple' })
    d.group.rotation.set(0.6, x * 0.2, 0)
    add(d.group, x, y, z, 0.12)
  }
  for (const [x, y, z] of [[-8, 3.2, 1], [2.5, 6, -8], [8.5, 4.5, 2.5]]) {
    const b = pennate(M, { L: 1.0, W: 0.3, h: 0.16 })
    b.rotation.set(0.9, x, 0.3)
    add(b, x, y, z, 0.2)
  }
  for (const [x, y, z] of [[-4.5, 4.4, -8.5], [6.8, 7.4, -1.5]]) {
    const t = triangle(M, { r: 0.55, h: 0.16 })
    t.rotation.set(0.4, x * 0.3, 0)
    add(t, x, y, z, -0.15)
  }
  for (const [x, y, z] of [[-7.5, 6.2, -2.5], [3.5, 8.2, 3.5], [0.5, 5.5, -9]]) {
    const s = star(M, { n: 8, len: 0.75 })
    s.rotation.set(0.3, x, 0)
    add(s, x, y, z, 0.25)
  }

  // ---- the round diatom: open its lid ----
  const HOUSE = { x: 0, y: 2.15, z: -3.2 }
  const house = centric(M, { R: 1.5, h: 0.85, cell: 'full' })
  house.group.position.set(HOUSE.x, HOUSE.y, HOUSE.z)
  root.add(house.group)
  solids.push(circle(HOUSE.x, HOUSE.z, 1.6))
  let open = false
  let openK = 0
  const setOpen = (v, live) => {
    open = v
    if (!live) openK = v ? 1 : 0
    if (live) play('select')
  }
  ex.add({
    id: 'house',
    x: 0,
    z: -0.8,
    radius: 2.3,
    label: E.house.label,
    verb: () => (open ? E.house.close : E.house.open),
    panel: lv => ({ title: E.house.title, color: '#46e0a0', blocks: E.house.panel[lv === 'scientist' ? 'sci' : 'kid'].map(p => ({ p })) }),
    panelDelay: 1.6,
    focus: { x: HOUSE.x, y: HOUSE.y, z: HOUSE.z, size: 3.6 },
    act: () => {
      setOpen(!open, true)
      share('house')
      return at(open ? E.house.says.open : E.house.says.close, level())
    },
  })
  updates.push((dt, t) => {
    openK = damp(openK, open ? 1 : 0, 3, dt)
    const k = ease(openK)
    house.front.position.set(0, 1.15 * k, 1.35 * k)
    house.front.rotation.x = -0.75 * k
    // the pattern turns slowly (the faces and the cell spin on their axis; the lid lifts straight)
    for (const f of house.faces) f.rotation.z = t * 0.05
    house.inner.rotation.z = t * 0.05
    house.group.position.y = HOUSE.y + Math.sin(t * 0.8) * 0.05
  })

  // ---- diatoms in the sun: oxygen bubbling up ----
  const SUN = { x: -5.6, z: -2.6 }
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 14), new THREE.MeshStandardMaterial({ color: '#b6bf9f', roughness: 1 }))
  mound.scale.set(1.5, 0.42, 1.25)
  mound.position.set(SUN.x, 0, SUN.z)
  root.add(mound)
  solids.push(circle(SUN.x, SUN.z, 1.35, { y1: 0.5 }))
  const boats = []
  for (let i = 0; i < 9; i++) {
    const a = i * 2.4
    const r = 0.25 + (i % 3) * 0.33
    const x = SUN.x + Math.cos(a) * r * 1.1
    const z = SUN.z + Math.sin(a) * r * 0.9
    const b = pennate(M, { L: 0.62, W: 0.19, h: 0.09 })
    const d = Math.hypot((x - SUN.x) / 1.5, (z - SUN.z) / 1.25)
    b.position.set(x, 0.42 * Math.sqrt(Math.max(0, 1 - d * d)) + 0.03, z)
    b.rotation.set(0, a * 1.7, (x - SUN.x) * -0.18)
    root.add(b)
    boats.push(b)
  }
  // the sunbeam over them, dim until the sun comes out
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 0.2 }, uColor: { value: new THREE.Color('#fff2c4') } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float a = uK * (0.35 + 0.65 * vUv.y) * smoothstep(0.0, 0.15, vUv.y);
        gl_FragColor = vec4(uColor, a * 0.32);
      }`,
  })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.7, 16, 32, 1, true), beamMat)
  beam.position.set(SUN.x, 8, SUN.z)
  root.add(beam)
  // oxygen: O2 molecules, two red balls each, rising from the boats
  const MOL = light ? 24 : 48
  const o2 = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 14, 10), M.o2, MOL * 2)
  o2.frustumCulled = false
  o2.count = 0
  root.add(o2)
  const mols = []
  let sunny = false
  let sunK = 0
  let emit = 0
  const setSun = v => {
    sunny = v
  }
  ex.add({
    id: 'sun',
    x: -4.4,
    z: -0.4,
    radius: 2.1,
    label: E.sun.label,
    verb: () => (sunny ? E.sun.off : E.sun.on),
    panel: lv => ({ title: E.sun.title, color: '#46e0a0', blocks: E.sun.panel[lv === 'scientist' ? 'sci' : 'kid'].map(p => ({ p })) }),
    panelDelay: 2.2,
    focus: { x: SUN.x, y: 1.6, z: SUN.z, size: 3.8 },
    act: () => {
      setSun(!sunny)
      play(sunny ? 'select' : 'tap')
      share('sun')
      return at(sunny ? E.sun.says.on : E.sun.says.off, level())
    },
  })
  const o = new THREE.Object3D()
  updates.push((dt, t) => {
    sunK = damp(sunK, sunny ? 1 : 0, 2, dt)
    beamMat.uniforms.uK.value = 0.2 + sunK * 1.0
    M.boat.emissiveIntensity = 0.15 + sunK * 1.3
    if (sunny && sunK > 0.4) {
      emit += dt
      while (emit > 0.14 && mols.length < MOL) {
        emit -= 0.14
        const b = boats[Math.floor(Math.random() * boats.length)]
        mols.push({ x: b.position.x, y: b.position.y + 0.08, z: b.position.z, v: 0.45 + Math.random() * 0.3, ph: Math.random() * TAU, spin: Math.random() * TAU })
      }
    }
    for (let i = mols.length - 1; i >= 0; i--) {
      const m = mols[i]
      m.y += m.v * dt
      m.spin += dt * 1.5
      if (m.y > 9) mols.splice(i, 1)
    }
    o2.count = mols.length * 2
    mols.forEach((m, i) => {
      const wx = m.x + Math.sin(t * 2 + m.ph) * 0.12
      const wz = m.z + Math.cos(t * 1.7 + m.ph) * 0.12
      const dx = Math.cos(m.spin) * 0.045
      const dz = Math.sin(m.spin) * 0.045
      for (const [j, s] of [[0, 1], [1, -1]]) {
        o.position.set(wx + dx * s, m.y, wz + dz * s)
        o.updateMatrix()
        o2.setMatrixAt(i * 2 + j, o.matrix)
      }
    })
    o2.instanceMatrix.needsUpdate = true
  })

  // ---- a diatom family: smaller with each division, until the smallest grows big again ----
  const N = 6
  const SHRINK = 0.84
  const R0 = 0.36
  const S = Array.from({ length: N }, (_, i) => SHRINK ** i)
  const X = []
  for (let i = 0; i < N; i++) X.push(i === 0 ? 4.5 : X[i - 1] + R0 * (S[i - 1] + S[i]) + 0.1)
  const FY = 1.2
  const FZ = -2.6
  const ledge = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 12), mound.material)
  ledge.scale.set(2.2, 0.55, 0.7)
  ledge.position.set((X[0] + X[N - 1]) / 2, 0, FZ)
  root.add(ledge)
  solids.push(circle(X[1], FZ, 0.7, { y1: 0.6 }), circle(X[3], FZ, 0.7, { y1: 0.6 }), circle(X[5], FZ, 0.6, { y1: 0.6 }))
  const row = Array.from({ length: N }, () => {
    const d = centric(M, { R: R0, h: R0 * 0.62, cell: 'simple' })
    d.group.rotation.y = -0.3
    root.add(d.group)
    return d
  })
  const flash = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 48), M.flash)
  flash.rotation.y = -0.3
  const auxo = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), M.cell)
  root.add(flash, auxo)
  let gen = 0
  let cycle = 0
  let anim = null // { kind: 'divide' | 'regrow', from, t }
  const rest = (i, show) => {
    const d = row[i]
    d.group.visible = show
    d.group.position.set(X[i], FY, FZ)
    d.group.scale.setScalar(S[i])
    d.front.position.set(0, 0, 0)
    d.front.rotation.set(0, 0, 0)
    d.back.position.set(0, 0, 0)
    d.back.rotation.set(0, 0, 0)
    d.front.visible = d.back.visible = d.inner.visible = true
  }
  const pose = t => {
    for (let i = 0; i < N; i++) rest(i, i <= gen)
    auxo.visible = false
    flash.visible = false
    if (!anim) return
    const s = anim.t
    if (anim.kind === 'divide') {
      const g = anim.from
      const a = row[g]
      const b = row[g + 1]
      const k1 = ease(s / 0.6)
      const k2 = ease((s - 0.6) / 1.0)
      b.group.visible = true
      a.group.position.z = FZ - 0.22 * k1 * (1 - k2)
      b.group.position.set(lerp(X[g], X[g + 1], k2), FY + 0.18 * Math.sin(Math.PI * k2), FZ + 0.22 * k1 * (1 - k2))
      b.group.scale.setScalar(lerp(S[g], S[g + 1], k2))
      if (s < 1.1) {
        flash.visible = true
        flash.position.set(X[g], FY, FZ)
        flash.scale.setScalar(R0 * S[g] * (0.7 + s * 0.6))
        M.flash.opacity = 0.85 * (1 - clamp(s / 1.1))
      }
    } else {
      // the smallest drops its glass, swells into an auxospore, which floats to the start and builds new valves
      const k1 = ease(s / 0.8)
      const k2 = ease((s - 0.8) / 1.6)
      const k3 = ease((s - 2.4) / 0.8)
      const last = row[N - 1]
      last.group.visible = s < 1.6
      last.inner.visible = s < 0.3
      last.front.position.set(0, -2.6 * k1, 1.2 * k1)
      last.front.rotation.x = 1.3 * k1
      last.back.position.set(0, -2.6 * k1, -1.2 * k1)
      last.back.rotation.x = -1.3 * k1
      for (let i = 0; i < N - 1; i++) {
        const k = i === 0 ? (s < 2.4 ? 1 - k2 : k3) : 1 - k2
        row[i].group.visible = k > 0.02
        row[i].group.scale.setScalar(S[i] * Math.max(0.02, k))
        row[i].group.position.y = FY - (i === 0 && s >= 2.4 ? 0 : 0.4 * k2)
      }
      if (s > 0.3 && s < 3.2) {
        auxo.visible = true
        const r = lerp(R0 * S[N - 1] * 0.8, R0 * 1.05, k2) * (1 - k3)
        auxo.scale.setScalar(Math.max(0.01, r))
        auxo.position.set(lerp(X[N - 1], X[0], k2), FY + 0.35 * Math.sin(Math.PI * k2), FZ)
      }
    }
    for (const d of row) d.group.position.y += Math.sin(t * 0.9 + d.group.position.x) * 0.03
  }
  const startDivide = () => {
    anim = { kind: 'divide', from: gen, t: 0 }
    play('pop')
  }
  const startRegrow = () => {
    anim = { kind: 'regrow', from: gen, t: 0 }
    play('beam')
  }
  ex.add({
    id: 'family',
    x: 5.8,
    z: -0.3,
    radius: 2.2,
    label: E.family.label,
    verb: () => (gen >= N - 1 ? E.family.regrow : E.family.divide),
    panel: lv => ({ title: E.family.title, color: '#46e0a0', blocks: E.family.panel[lv === 'scientist' ? 'sci' : 'kid'].map(p => ({ p })) }),
    panelDelay: 2.4,
    focus: { x: (X[0] + X[N - 1]) / 2, y: FY, z: FZ, size: 3.8 },
    act: () => {
      if (anim) return false
      const regrow = gen >= N - 1
      if (regrow) startRegrow()
      else startDivide()
      share('family')
      const lv = level()
      if (regrow) return at(E.family.says.regrow, lv)
      return at(gen + 1 >= N - 1 ? E.family.says.last : E.family.says.divide, lv)
    },
  })
  updates.push((dt, t) => {
    if (anim) {
      anim.t += dt
      const end = anim.kind === 'divide' ? 1.6 : 3.2
      if (anim.t >= end) {
        if (anim.kind === 'divide') gen = anim.from + 1
        else {
          gen = 0
          cycle++
          play('select')
        }
        anim = null
      }
    }
    pose(t)
  })
  // the state a share sends is where it ends: gen and cycle move at the start of an animation
  const familyState = () => (anim ? (anim.kind === 'divide' ? { gen: anim.from + 1, cycle } : { gen: 0, cycle: cycle + 1 }) : { gen, cycle })

  updates.push((dt, t) => {
    for (const d of drift) {
      d.obj.position.y = d.y + Math.sin(t * 0.4 + d.phase) * 0.25
      d.obj.rotation.y += d.spin * dt
    }
    stage.update(t, ctx.camera)
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.9 },
    spawn: { x: 0, z: 5.2, yaw: 0 },
    hostSpot: { x: 1.6, z: 4.4, yaw: Math.atan2(1.6, -0.8) },
    back: { x: 0, z: 9.5, rot: Math.PI },
    stand: { x: -2.1, z: 3.1, rot: Math.atan2(2.1, 2.1) },
    parts: {
      house: { get open() { return open } },
      sun: { get sunny() { return sunny }, get bubbles() { return mols.length } },
      family: { get gen() { return gen }, get busy() { return !!anim } },
    },
    shared: {
      house: { get: () => ({ open }), set: (s, live) => setOpen(!!s?.open, live) },
      sun: { get: () => ({ sun: sunny }), set: s => setSun(!!s?.sun) },
      family: {
        get: familyState,
        set: (s, live) => {
          const g = clamp(Math.round(Number(s?.gen) || 0), 0, N - 1)
          const c = Math.max(0, Math.round(Number(s?.cycle) || 0))
          if (live && !anim && c === cycle && g === gen + 1) startDivide()
          else if (live && !anim && c === cycle + 1 && g === 0 && gen === N - 1) startRegrow()
          else {
            anim = null
            gen = g
            cycle = c
          }
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of M.textures) tx.dispose()
    },
  }
}
