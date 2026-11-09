// A stage for picture rooms (docs/knowledge/picture-rooms.md): the Panathenaic Stadium in Athens at dusk,
// seen from its track. The horseshoe of marble terraces round a red cinder track and a packed-earth
// infield (the curve at the far end, the open end behind the arrival), a crowd in the seats with cameras
// flashing, four floodlight towers coming on with their beams crossing the field, Greek flags on the rim,
// pines and far hills, the sky's last glow behind them. 1896's first modern Games were run here, in
// marble rebuilt for them (Georgios Averoff paid for it).
// For the scene: `group`, `solids` (a wall round the track, a fence across the open end), `env`,
// `cameraBounds`, `update(t)`, `dispose()`, and `metals`: matcaps for polished silver, gold, copper, bronze
// and iron (a lit metal face only mirrors the room it stands in: the hall's showpiece draws its silver the
// same way). Layout, in metres: the track's axis is z, the curve's centre (0, ZC), the walkable inside is
// |x| < R0 from the curve's far end (z = ZC - R0) to the open end (z = Z_OPEN), terraces rising outside it.
// Terraces stay mid-toned: pale marble under the bloom turns the whole view white.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random, smooth } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'

export const ZC = -6
export const R0 = 16
export const Z_OPEN = 14
const ROWS = 15
const RUN = 0.85
const RISE = 0.48
const TOP = ROWS * RISE
const TAU = Math.PI * 2

// ---- polished metals drawn as matcaps ----

const caps = {}
function matcap(key, stops, windows, rimColor) {
  if (caps[key]) return caps[key]
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 256)
  for (const [o, col] of stops) base.addColorStop(o, col)
  g.fillStyle = base
  g.fillRect(0, 0, 256, 256)
  const rim = g.createRadialGradient(128, 128, 92, 128, 128, 128)
  rim.addColorStop(0, `${rimColor}0)`)
  rim.addColorStop(1, `${rimColor}0.5)`)
  g.fillStyle = rim
  g.fillRect(0, 0, 256, 256)
  for (const [x, y, r, a] of windows) {
    const w = g.createRadialGradient(x, y, 0, x, y, r)
    w.addColorStop(0, `rgba(255,250,236,${a})`)
    w.addColorStop(0.5, `rgba(255,244,214,${a * 0.55})`)
    w.addColorStop(1, 'rgba(255,244,214,0)')
    g.fillStyle = w
    g.fillRect(x - r, y - r, 2 * r, 2 * r)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.userData.shared = true
  caps[key] = t
  return t
}
const WINDOWS = [[86, 72, 30, 0.8], [176, 92, 18, 0.7], [140, 44, 11, 0.6], [62, 150, 10, 0.4], [196, 170, 8, 0.35]]
export const metals = {
  silver: () => matcap('silver', [[0, '#dde2ea'], [0.38, '#aeb5c2'], [0.62, '#6c727f'], [0.82, '#4c505a'], [1, '#6e737f']], WINDOWS, 'rgba(206,212,222,'),
  gold: () => matcap('gold', [[0, '#fff0a8'], [0.38, '#f0c43c'], [0.62, '#a8760e'], [0.82, '#6a4608'], [1, '#a87a1c']], WINDOWS, 'rgba(255,214,120,'),
  copper: () => matcap('copper', [[0, '#e8a074'], [0.38, '#b0653a'], [0.62, '#5a2c16'], [0.82, '#3a1c0e'], [1, '#6a3a20']], WINDOWS, 'rgba(240,160,110,'),
  bronze: () => matcap('bronze', [[0, '#cfa264'], [0.38, '#97692f'], [0.62, '#4a3216'], [0.82, '#2e200e'], [1, '#5a4120']], WINDOWS, 'rgba(210,166,100,'),
  iron: () => matcap('iron', [[0, '#8f8b84'], [0.38, '#615d57'], [0.62, '#34312d'], [0.82, '#22201e'], [1, '#3b3835']], [[96, 80, 24, 0.35], [172, 100, 14, 0.25]], 'rgba(150,146,140,'),
}

// ---- the horseshoe ----

const LS = Z_OPEN - ZC // each straight side's length
const ARC = Math.PI * R0

/** A point on the track's edge line at distance `t` along it (from the open end down the left side, round the
 *  curve and up the right side), pushed `d` metres outward: the path of a row of seats. */
function pathAt(t, d) {
  const R = R0 + d
  const arc = Math.PI * R
  if (t < LS) return { x: -R, z: Z_OPEN - t, nx: -1, nz: 0 }
  if (t < LS + arc) {
    const a = Math.PI + (t - LS) / R
    return { x: Math.cos(a) * R, z: ZC + Math.sin(a) * R, nx: Math.cos(a), nz: Math.sin(a) }
  }
  return { x: R, z: ZC + (t - LS - arc), nx: 1, nz: 0 }
}
const lengthAt = d => 2 * LS + Math.PI * (R0 + d)

/** A Greek flag: nine blue and white stripes, a white cross on a blue canton. */
function flagTexture() {
  return canvasTex(270, 180, (g, w, h) => {
    const s = h / 9
    for (let i = 0; i < 9; i++) {
      g.fillStyle = i % 2 === 0 ? '#2a5fb5' : '#eef2f8'
      g.fillRect(0, i * s, w, s + 1)
    }
    g.fillStyle = '#2a5fb5'
    g.fillRect(0, 0, s * 5, s * 5)
    g.fillStyle = '#eef2f8'
    g.fillRect(s * 2, 0, s, s * 5)
    g.fillRect(0, s * 2, s * 5, s)
  })
}

export function stadiumStage({ light = false, pixelRatio = 1 } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const rnd = random(1896)
  const o = new THREE.Object3D()
  const geos = []
  const own = g => (geos.push(g), g)

  // the sky: the last glow behind the hills, the first stars
  const sky = nightSky({ radius: 700, stars: light ? 500 : 1100, top: '#0b1030', mid: '#2a2f68', horizon: '#a8665a', pixelRatio })
  group.add(sky)

  // ---- the ground: red cinder lanes round a packed-earth infield, white lines ----
  const PX = 1024
  const GX = 44 // metres across
  const GZ = 44
  const gz0 = -24 // the ground's z range: -24 .. 20
  const ground = canvasTex(PX, PX, (g, w) => {
    const kx = w / GX
    const kz = w / GZ
    const px = x => (x + GX / 2) * kx
    const pz = z => (z - gz0) * kz
    g.fillStyle = '#7f6a58'
    g.fillRect(0, 0, w, w)
    // lanes: from r = 10 to 16 about the curve's centre, 1 m each
    const U = (r, close) => {
      g.beginPath()
      g.moveTo(px(-r), pz(Z_OPEN))
      g.lineTo(px(-r), pz(ZC))
      g.ellipse(px(0), pz(ZC), r * kx, r * kz, 0, Math.PI, TAU)
      g.lineTo(px(r), pz(Z_OPEN))
      if (close) g.lineTo(px(-r), pz(Z_OPEN))
    }
    U(16.2, true)
    g.fillStyle = '#935a46'
    g.fill()
    U(10, true)
    g.fillStyle = '#7f6a58'
    g.fill()
    for (let i = 0; i < 26000; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(60,34,26,${0.12 + rnd() * 0.18})` : `rgba(190,140,110,${0.08 + rnd() * 0.14})`
      g.fillRect(x, y, 1.5 + rnd() * 2.5, 1.5 + rnd() * 2.5)
    }
    g.strokeStyle = 'rgba(236,236,238,0.86)'
    g.lineWidth = 0.07 * kx
    for (let r = 10; r <= 16.01; r += 1) {
      U(r, false)
      g.stroke()
    }
    // the finish line across the lanes
    g.fillStyle = 'rgba(236,236,238,0.9)'
    const fz = 3
    g.fillRect(px(-16), pz(fz), 6 * kx, 0.12 * kz)
    g.fillRect(px(10), pz(fz), 6 * kx, 0.12 * kz)
  })
  disposers.push(() => ground.dispose())
  const floor = new THREE.Mesh(own(new THREE.PlaneGeometry(GX, GZ)), new THREE.MeshStandardMaterial({ map: ground, roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, gz0 + GZ / 2)
  group.add(floor)
  // the street and land outside, dark, far round
  const land = new THREE.Mesh(own(new THREE.CircleGeometry(520, 48)), new THREE.MeshStandardMaterial({ color: '#1b1f38', roughness: 1 }))
  land.rotation.x = -Math.PI / 2
  land.position.y = -0.03
  group.add(land)

  // ---- the terraces: treads and risers of marble, as one mesh ----
  const samples = []
  for (let t = 0; t < LS; t += 1) samples.push(t)
  const aN = Math.round(ARC / 0.4)
  for (let i = 0; i < aN; i++) samples.push(LS + (i / aN) * ARC)
  for (let t = 0; t <= LS; t += 1) samples.push(LS + ARC + t)
  const base = i => pathAt(samples[i], 0)
  const P = []
  const C = []
  const quad = (a, b, c2, d, expect, col) => {
    // a b c2 d around a quad; wound so its normal faces `expect` (a vector)
    const ab = new THREE.Vector3().subVectors(b, a)
    const ad = new THREE.Vector3().subVectors(d, a)
    const n = new THREE.Vector3().crossVectors(ab, ad)
    const order = n.dot(expect) >= 0 ? [a, b, c2, a, c2, d] : [a, c2, b, a, d, c2]
    for (const v of order) {
      P.push(v.x, v.y, v.z)
      C.push(col.r, col.g, col.b)
    }
  }
  const marble = new THREE.Color()
  const vec = (i, d, h) => {
    const p = base(i)
    return new THREE.Vector3(p.x + p.nx * d, h, p.z + p.nz * d)
  }
  for (let i = 0; i < samples.length - 1; i++) {
    for (let k = 0; k < ROWS; k++) {
      const row = 0.9 + 0.1 * Math.sin(k * 2.1 + i * 0.07)
      const stain = 0.92 + 0.12 * (Math.sin(i * 0.9 + k * 3.3) * Math.sin(i * 0.31 + k)) // a little unevenness
      // a tread (facing up), then the riser in front of the next row (facing the track)
      marble.set('#aaa9b6').multiplyScalar(row * stain)
      quad(vec(i, k * RUN, (k + 1) * RISE), vec(i + 1, k * RUN, (k + 1) * RISE), vec(i + 1, (k + 1) * RUN, (k + 1) * RISE), vec(i, (k + 1) * RUN, (k + 1) * RISE), new THREE.Vector3(0, 1, 0), marble)
      const p = base(i)
      marble.set('#8e8d9c').multiplyScalar(row * stain)
      quad(vec(i, k * RUN, k * RISE), vec(i + 1, k * RUN, k * RISE), vec(i + 1, k * RUN, (k + 1) * RISE), vec(i, k * RUN, (k + 1) * RISE), new THREE.Vector3(-p.nx, 0, -p.nz), marble)
    }
    // the dark plateau beyond the top row, where the pines stand
    marble.set('#1a2030')
    quad(vec(i, ROWS * RUN, TOP), vec(i + 1, ROWS * RUN, TOP), vec(i + 1, ROWS * RUN + 70, TOP), vec(i, ROWS * RUN + 70, TOP), new THREE.Vector3(0, 1, 0), marble)
  }
  // the open ends of the terraces (the cut, closed with a fan from the foot's outer corner)
  for (const [i, face] of [[0, 1], [samples.length - 1, 1]]) {
    const pts = []
    for (let k = 0; k < ROWS; k++) pts.push(vec(i, k * RUN, (k + 1) * RISE), vec(i, (k + 1) * RUN, (k + 1) * RISE))
    const foot = vec(i, ROWS * RUN, 0)
    marble.set('#8e8d9c')
    const first = vec(i, 0, 0)
    const ring = [first, ...pts, foot]
    for (let j = 0; j < ring.length - 1; j++) quad(ring[j], ring[j + 1], foot, foot, new THREE.Vector3(0, 0, face), marble)
  }
  const geo = own(new THREE.BufferGeometry())
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3))
  geo.computeVertexNormals()
  const terraces = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 }))
  group.add(terraces)

  // ---- the crowd: rounded figures in dusk colours, a few seats empty ----
  const palette = ['#2f3d6e', '#7a2f3c', '#d8d4cc', '#3d5a45', '#4a4160', '#a8863f', '#2a2e3c', '#8a5a3a', '#5a7fa8', '#b8b2a6']
  const figs = []
  for (let k = 1; k < ROWS; k++) {
    const d = k * RUN + RUN * 0.55
    const total = lengthAt(d)
    const n = Math.floor(total / (light ? 1.1 : 0.62))
    for (let j = 0; j < n; j++) {
      if (rnd() < 0.14) continue
      const p = pathAt(((j + 0.5 + (rnd() - 0.5) * 0.3) / n) * total, d)
      if (p.z > Z_OPEN - 0.6) continue
      figs.push({ x: p.x, z: p.z, y: (k + 1) * RISE, c: palette[Math.floor(rnd() * palette.length)], s: 0.9 + rnd() * 0.25 })
    }
  }
  const crowd = new THREE.InstancedMesh(own(new THREE.CapsuleGeometry(0.17, 0.4, 3, 6)), new THREE.MeshStandardMaterial({ roughness: 0.9 }), figs.length)
  const col = new THREE.Color()
  figs.forEach((f, i) => {
    o.position.set(f.x, f.y + 0.4 * f.s, f.z)
    o.rotation.set(0, rnd() * TAU, 0)
    o.scale.setScalar(f.s)
    o.updateMatrix()
    crowd.setMatrixAt(i, o.matrix)
    crowd.setColorAt(i, col.set(f.c))
  })
  crowd.frustumCulled = false
  group.add(crowd)
  // heads, in a few skin tones, so the figures read as people
  const heads = new THREE.InstancedMesh(own(new THREE.SphereGeometry(0.115, 10, 8)), new THREE.MeshStandardMaterial({ roughness: 0.8 }), figs.length)
  const skins = ['#e0b08c', '#c68c66', '#8c5a3c', '#f0cba8', '#6b4430']
  figs.forEach((f, i) => {
    o.position.set(f.x, f.y + 0.4 * f.s + 0.43 * f.s, f.z)
    o.rotation.set(0, 0, 0)
    o.scale.setScalar(f.s)
    o.updateMatrix()
    heads.setMatrixAt(i, o.matrix)
    heads.setColorAt(i, col.set(skins[i % skins.length]))
  })
  heads.frustumCulled = false
  group.add(heads)
  // cameras flashing: bright pops at random moments, here and there in the stands
  const FL = Math.min(figs.length, light ? 60 : 150)
  const fpos = new Float32Array(FL * 3)
  const fph = new Float32Array(FL)
  for (let i = 0; i < FL; i++) {
    const f = figs[Math.floor(rnd() * figs.length)]
    fpos.set([f.x, f.y + 0.95, f.z], i * 3)
    fph[i] = rnd() * 100
  }
  const fgeo = own(new THREE.BufferGeometry())
  fgeo.setAttribute('position', new THREE.BufferAttribute(fpos, 3))
  fgeo.setAttribute('aPhase', new THREE.BufferAttribute(fph, 1))
  const flashMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScale: { value: pixelRatio } },
    vertexShader: /* glsl */ `
      attribute float aPhase; uniform float uTime; uniform float uScale; varying float vK;
      void main() {
        float f = 0.22 + fract(aPhase * 0.37) * 0.35;
        float s = sin(uTime * f * 6.2831 + aPhase);
        vK = pow(max(s, 0.0), 60.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uScale * (4.0 + 360.0 * vK) / max(1.0, -mv.z) * 1.6;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying float vK;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.85, 0.92, 1.0) * (0.05 + 0.95 * vK), a * (0.05 + 0.9 * vK));
      }`,
  })
  const flashes = new THREE.Points(fgeo, flashMat)
  flashes.frustumCulled = false
  group.add(flashes)

  // ---- floodlight towers on the rim, their lamps and beams ----
  const steel = new THREE.MeshStandardMaterial({ color: '#2a2f40', roughness: 0.7, metalness: 0.4 })
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff3d4', emissive: '#ffe9bd', emissiveIntensity: 2.2, roughness: 0.4 })
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 0.0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uK; varying vec2 vUv;
      void main() { gl_FragColor = vec4(vec3(1.0, 0.93, 0.75), uK * 0.07 * vUv.y * smoothstep(1.0, 0.85, vUv.y)); }`,
  })
  const legGeo = own(new THREE.CylinderGeometry(0.1, 0.16, 20, 6))
  const ringGeo = own(new THREE.BoxGeometry(1.5, 0.1, 0.1))
  const panelGeo = own(new THREE.BoxGeometry(4.4, 2.6, 0.3))
  const lampGeo = own(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 10).rotateX(Math.PI / 2))
  const glowTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,240,205,1)')
    grd.addColorStop(0.35, 'rgba(255,225,170,0.4)')
    grd.addColorStop(1, 'rgba(255,225,170,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  disposers.push(() => glowTex.dispose())
  const towers = []
  for (const t of [LS * 0.55, LS * 0.55 + 100, LS + ARC * 0.28, LS + ARC * 0.72]) {
    const p = pathAt(t, ROWS * RUN + 1.5)
    const tower = new THREE.Group()
    tower.position.set(p.x, TOP, p.z)
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const leg = new THREE.Mesh(legGeo, steel)
      leg.position.set(sx * 0.65, 10, sz * 0.65)
      leg.rotation.set(sz * -0.012, 0, sx * 0.012)
      tower.add(leg)
    }
    for (const y of [4, 9, 14, 19]) {
      for (const [rx, rz, ry] of [[0, 0.7, 0], [0, -0.7, 0], [0.7, 0, Math.PI / 2], [-0.7, 0, Math.PI / 2]]) {
        const bar = new THREE.Mesh(ringGeo, steel)
        bar.position.set(rx, y, rz)
        bar.rotation.y = ry
        tower.add(bar)
      }
    }
    // the lamp panel, turned toward the middle of the field
    const lamps = new THREE.Group()
    lamps.position.set(0, 21.5, 0)
    lamps.add(new THREE.Mesh(panelGeo, steel))
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const lamp = new THREE.Mesh(lampGeo, lampMat)
        lamp.position.set((c - 2) * 0.82, (1 - r) * 0.8, -0.2)
        lamps.add(lamp)
      }
    }
    lamps.rotation.y = Math.atan2(p.x, p.z - ZC) // its lamps (on its -z side) face the field
    tower.add(lamps)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8, fog: false }))
    glow.scale.setScalar(9)
    glow.position.set(0, 21.5, 0)
    tower.add(glow)
    group.add(tower)
    towers.push({ p, glow, top: new THREE.Vector3(p.x, TOP + 21.5, p.z) })
  }
  // beams from each lamp panel across the field to a spot on the track
  const aim = [new THREE.Vector3(3, 0, -4), new THREE.Vector3(-3, 0, -4), new THREE.Vector3(2, 0, -10), new THREE.Vector3(-2, 0, -10)]
  towers.forEach((tw, i) => {
    const to = aim[i % aim.length]
    const dir = new THREE.Vector3().subVectors(to, tw.top)
    const len = dir.length()
    const beam = new THREE.Mesh(own(new THREE.CylinderGeometry(1.4, 6.5, len, 20, 1, true)), beamMat)
    beam.position.copy(tw.top).addScaledVector(dir, 0.5)
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize())
    beam.renderOrder = 3
    group.add(beam)
  })

  // ---- Greek flags on the rim ----
  const flagTex = flagTexture()
  disposers.push(() => flagTex.dispose())
  const flags = []
  for (const t of [LS * 0.2, LS + ARC * 0.5, LS * 1.0 + ARC + LS * 0.8]) {
    const p = pathAt(t, ROWS * RUN + 0.5)
    const pole = new THREE.Mesh(own(new THREE.CylinderGeometry(0.05, 0.07, 8, 6)), steel)
    pole.position.set(p.x, TOP + 4, p.z)
    group.add(pole)
    const geoF = own(new THREE.PlaneGeometry(3, 2, 14, 1))
    const flag = new THREE.Mesh(geoF, new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, roughness: 0.9, emissive: '#101830', emissiveIntensity: 0.4 }))
    flag.position.set(p.x - p.nx * 1.5, TOP + 7, p.z - p.nz * 1.5)
    flag.rotation.y = Math.atan2(p.nz, -p.nx) // the pole at its edge, the flag toward the field
    const rest = geoF.attributes.position.array.slice()
    group.add(flag)
    flags.push({ flag, rest, geoF, ph: t })
  }

  // ---- pines along the rim, far hills, the city's lights ----
  const pineGeo = own(new THREE.ConeGeometry(1.3, 5, 6).translate(0, 2.5, 0))
  const pines = new THREE.InstancedMesh(pineGeo, new THREE.MeshStandardMaterial({ color: '#17261f', roughness: 1 }), 46)
  for (let i = 0; i < 46; i++) {
    const t = (i / 46) * lengthAt(ROWS * RUN + 6)
    const p = pathAt(t, ROWS * RUN + 4 + rnd() * 6)
    if (p.z > Z_OPEN - 2) {
      o.position.set(0, -50, 0)
    } else o.position.set(p.x, TOP, p.z)
    o.rotation.set(0, rnd() * 6, 0)
    o.scale.set(0.8 + rnd() * 0.6, 0.8 + rnd() * 1.1, 0.8 + rnd() * 0.6)
    o.updateMatrix()
    pines.setMatrixAt(i, o.matrix)
  }
  group.add(pines)
  {
    const SEG = 90
    const ridge = own(new THREE.CylinderGeometry(320, 320, 1, SEG, 1, true))
    const pos = ridge.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i))
      const top = pos.getY(i) > 0
      const hh = top ? 22 + 30 * Math.max(0, Math.sin(a * 3 + 1) * 0.6 + Math.sin(a * 7 + 2) * 0.4 + 0.3) : -2
      pos.setY(i, hh)
    }
    const hills = new THREE.Mesh(ridge, new THREE.MeshBasicMaterial({ color: '#242a52', side: THREE.BackSide, fog: false }))
    hills.renderOrder = -5
    group.add(hills)
  }
  {
    // the city: warm points low on the horizon, beyond the open end and round
    const N = light ? 260 : 700
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = Math.PI * 0.5 + (rnd() - 0.5) * (rnd() < 0.7 ? 2.2 : 6.2)
      const r = 250 + rnd() * 50
      pos.set([Math.cos(a) * r, 1 + rnd() * 9, Math.sin(a) * r], i * 3)
    }
    const g = own(new THREE.BufferGeometry())
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const city = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffd9a0', size: 2.4, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, fog: false }))
    city.frustumCulled = false
    group.add(city)
  }

  // ---- the open end: a low marble wall and street lamps beyond it ----
  const wall = new THREE.Mesh(own(new THREE.BoxGeometry(2 * R0 + 2, 1.0, 0.5)), new THREE.MeshStandardMaterial({ color: '#8d8c98', roughness: 0.9 }))
  wall.position.set(0, 0.5, Z_OPEN - 0.25)
  group.add(wall)

  // ---- light: dusk sky above, warm floodlights on the field ----
  group.add(new THREE.HemisphereLight('#7f8fd8', '#2a2230', 1.0))
  const sun = new THREE.DirectionalLight('#ffbf94', 0.55)
  sun.position.set(14, 14, 18)
  group.add(sun, sun.target)
  if (!light) {
    for (const [x, z, tx, tz] of [[-14, 6, -4, -4], [14, 6, 4, -4]]) {
      const s = new THREE.SpotLight('#fff0d6', 70, 44, 0.62, 0.7, 1.3)
      s.position.set(x, 16, z)
      s.target.position.set(tx, 0, tz)
      group.add(s, s.target)
    }
  }

  // ---- solids and bounds ----
  const solids = []
  {
    const SEGS = 30
    const w = ((Math.PI * (R0 + 0.3)) / SEGS) * 1.15
    for (let i = 0; i < SEGS; i++) {
      const a = Math.PI + ((i + 0.5) / SEGS) * Math.PI
      solids.push(box(Math.cos(a) * (R0 + 0.3), ZC + Math.sin(a) * (R0 + 0.3), w, 0.6, { rot: -a + Math.PI / 2 }))
    }
    const mid = (ZC + Z_OPEN) / 2
    for (const s of [-1, 1]) solids.push(box(s * (R0 + 0.3), mid, 0.6, LS + 1))
    solids.push(box(0, Z_OPEN + 0.3, 2 * R0 + 2, 0.8))
  }

  const fogColor = '#3a3868'
  const base2 = new THREE.Color(fogColor)
  return {
    group,
    solids,
    env: {
      background: new THREE.Color('#0d1233'),
      fog: new THREE.Fog(base2, 70, 330),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.62, radius: 0.5, threshold: 0.8 },
      fov: 60,
    },
    cameraBounds: { minX: -R0 + 0.6, maxX: R0 - 0.6, minY: 0.35, maxY: 8.5, minZ: ZC - R0 + 0.6, maxZ: Z_OPEN - 2.6 },
    update(t) {
      sky.userData.update?.(t)
      flashMat.uniforms.uTime.value = t
      // the floodlights come on, a little uneven at first
      const k = smooth(0.2, 3.5, t)
      beamMat.uniforms.uK.value = k
      lampMat.emissiveIntensity = 1.2 + 1.0 * k
      for (const [i, tw] of towers.entries()) tw.glow.material.opacity = 0.8 * smooth(0.1 + i * 0.4, 2.5 + i * 0.4, t)
      for (const f of flags) {
        const a = f.geoF.attributes.position
        for (let i = 0; i < a.count; i++) {
          const x = f.rest[i * 3] + 1.5 // 0 at the pole, 3 at the free end
          const w = Math.sin(x * 2.2 - t * 3.4 + f.ph) * 0.12 * (x / 3)
          a.setZ(i, w)
        }
        a.needsUpdate = true
      }
    },
    dispose() {
      disposers.forEach(f => f())
      for (const g of geos) g.dispose()
    },
  }
}
