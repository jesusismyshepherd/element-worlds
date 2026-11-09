// Germanium's picture "How does the internet cross the sea?" as a room (docs/knowledge/picture-rooms.md): the
// deep sea floor, about 3000 m down (the abyss stage), a small yellow research submersible by the spawn and
// the cable lying across the mud into the dark. Three stations, each worked by touching its things; E opens
// the station's panel, whose sliders and buttons do the same:
// - "Stay inside!": a giant glass thread on stands (drawn 8000 times life size). Tap the laser to send a
//   flash of light: it zigzags down the glowing core, bouncing off its wall (total internal reflection).
//   Tap the thread to bend it (the light follows, until the bend is too sharp and it leaks out); the panel's
//   sliders: the beam's angle, the germanium in the core (its refractive index and so the critical angle:
//   with none the light just walks out) and the bend. The ray is really traced (traceRay below): at every
//   wall hit the angle of incidence is compared with the critical angle of the glass pair.
// - "The cable cut open": a cable cut across, 60 times life size, its five layers (polyethylene, steel wires,
//   copper tube, gel, glass fibres): tap each from the outside in and it slides back; the repeater on the
//   floor cable opens (tap it) on its erbium coil and pump laser (tap the pump): a faded flash comes in and
//   leaves bright, or fainter still with the pump off.
// - "Across the ocean": a map of the Atlantic, Sines to Fortaleza (EllaLink): tap Sines and a flash runs
//   along the cable in slow motion with a clock in milliseconds: without repeaters it fades out after a
//   few hundred kilometres (0.2 dB per km), tap the switch and the repeaters top it up all the way. A slider
//   for the distance and the light left.
// All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, num, standingScreen } from '../../../wings/noble/kit.js'
import { abyssStage, cableZ } from '../../stages/abyss.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { FIBRE_WORDS } from './fibre.words.js'

export const WORDS = FIBRE_WORDS

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const TEAL = '#3ce0c8'
const GOLD = '#ffd166'
const N_CLAD = 1.444 // pure silica at 1550 nm
const DN_PER_MOL = 0.0015 // the index rises about 0.0015 for each mol% of GeO2 (silica 1.458, germania 1.607 in the visible)
const nCore = ge => N_CLAD + DN_PER_MOL * ge
const FIB = { L: 4.6, W: 0.1, R: 0.5, X0: -7.7, Y0: 1.25, Z: -3.1 } // length, core width, cladding radius, where its left end is
const KMAX = 0.12 // the sharpest bend of the slider: curvature, 1/m
const KTAP = 0.04 // a tap on the thread bends it this much
const SPAN = 70 // km between repeaters in this model (real ones: 50 to 100 km)
const ROUTE_KM = 6000 // EllaLink, about
const LOSS = 0.2 // dB per km at 1550 nm
const V_FIBRE = 299792.458 / 1.468 // km/s: c over the group index of silica at 1550 nm
const RUN_SECONDS = 12 // the whole route, in slow motion
const DEAD_DB = 60 // a signal weaker than a millionth is lost in the noise (a round number: real receivers differ)

/** Where the centre line of the bent fibre is, `s` along it: bending up with curvature k (local x along, y up). */
const centre = (s, k) => (k < 1e-5 ? { x: s, y: 0, phi: 0 } : { x: Math.sin(k * s) / k, y: (1 - Math.cos(k * s)) / k, phi: k * s })

/** A ray traced in a core of width W that bends upward with curvature k (the outer wall is the lower one),
 *  from the middle of its first face at `alpha` radians up from the axis. At every wall hit the angle from
 *  the wall's normal is compared with the critical angle asin(n2 / n1): beyond it the ray is reflected, below
 *  it the ray refracts out into the cladding and is lost. Returns the corners of its path. */
export function traceRay({ k, alpha, ge, L = FIB.L, W = FIB.W, step = 0.01 }) {
  const n1 = nCore(ge)
  const n2 = N_CLAD
  const thC = Math.asin(Math.min(1, n2 / n1))
  const R = k > 1e-6 ? 1 / k : Infinity
  const straight = R === Infinity
  const off = p => (straight ? -p.y : Math.hypot(p.x, p.y - R) - R)
  const along = p => (straight ? p.x : R * Math.atan2(p.x, R - p.y))
  const outward = p => {
    if (straight) return { x: 0, y: -1 }
    const d = Math.hypot(p.x, p.y - R)
    return { x: p.x / d, y: (p.y - R) / d }
  }
  let p = { x: 0, y: 0 }
  let d = { x: Math.cos(alpha), y: Math.sin(alpha) }
  const path = [{ ...p }]
  let leakAt = -1
  let thLeak = 0
  let bounces = 0
  for (let i = 0; i < 3000; i++) {
    p = { x: p.x + d.x * step, y: p.y + d.y * step }
    if (leakAt < 0) {
      const u = off(p)
      if (Math.abs(u) > W / 2) {
        const s = u > 0 ? 1 : -1
        const o = outward(p)
        const n = { x: o.x * s, y: o.y * s }
        const c = d.x * n.x + d.y * n.y
        const th = Math.acos(clamp(c, -1, 1))
        const over = Math.abs(u) - W / 2
        p = { x: p.x - n.x * over, y: p.y - n.y * over }
        if (th >= thC) {
          d = { x: d.x - 2 * c * n.x, y: d.y - 2 * c * n.y }
          path.push({ ...p })
          bounces++
        } else {
          const r = n1 / n2
          const ct = Math.sqrt(Math.max(0, 1 - r * r * (1 - c * c)))
          d = { x: r * d.x + (ct - r * c) * n.x, y: r * d.y + (ct - r * c) * n.y }
          path.push({ ...p })
          leakAt = path.length - 1
          thLeak = th
        }
      } else if (along(p) >= L) {
        path.push({ ...p })
        break
      }
    } else if (Math.abs(off(p)) > FIB.R + 0.25) {
      break
    }
  }
  const exitEnd = leakAt >= 0 ? { ...p } : null
  return { path, leakAt, exitEnd, bounces, thC, n1, n2, thLeak, arrived: leakAt < 0 }
}

/** A tube round a centre line that can bend (local x along, y up), its positions rewritten in place by set(k). */
function bentTube(radius, { seg = 64, radial = 16, L = FIB.L, closed = false } = {}) {
  const geo = new THREE.BufferGeometry()
  const n = (seg + 1) * (radial + 1)
  const pos = new Float32Array(n * 3)
  const nor = new Float32Array(n * 3)
  const idx = []
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j
      const b = (i + 1) * (radial + 1) + j
      const c = (i + 1) * (radial + 1) + j + 1
      const d = i * (radial + 1) + j + 1
      idx.push(a, d, b, d, c, b)
    }
  }
  geo.setIndex(idx)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  const set = k => {
    for (let i = 0; i <= seg; i++) {
      const c = centre((L * i) / seg, k)
      const nx = -Math.sin(c.phi)
      const ny = Math.cos(c.phi)
      for (let j = 0; j <= radial; j++) {
        const th = (TAU * j) / radial
        const cs = Math.cos(th)
        const sn = Math.sin(th)
        const o = (i * (radial + 1) + j) * 3
        nor[o] = nx * cs
        nor[o + 1] = ny * cs
        nor[o + 2] = sn
        pos[o] = c.x + radius * nor[o]
        pos[o + 1] = c.y + radius * nor[o + 1]
        pos[o + 2] = radius * sn
      }
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.normal.needsUpdate = true
    geo.computeBoundingSphere()
  }
  set(0)
  return { geo, set }
}

/** A flat glowing strip along a polyline (corners of a ray) in the x-y plane, facing +z. */
function ribbon(max, width, material) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(max * 4 * 3)
  const idx = []
  for (let i = 0; i < max; i++) idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 1, i * 4 + 3, i * 4 + 2)
  geo.setIndex(idx)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setDrawRange(0, 0)
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false
  mesh.raycast = () => {}
  return {
    mesh,
    set(points, w = width, z = 0) {
      const m = Math.min(max, points.length - 1)
      for (let i = 0; i < m; i++) {
        const a = points[i]
        const b = points[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy) || 1
        const nx = (-dy / len) * (w / 2)
        const ny = (dx / len) * (w / 2)
        pos.set([a.x + nx, a.y + ny, z, a.x - nx, a.y - ny, z, b.x + nx, b.y + ny, z, b.x - nx, b.y - ny, z], i * 12)
      }
      geo.setDrawRange(0, Math.max(0, m) * 6)
      geo.attributes.position.needsUpdate = true
    },
  }
}

/** An invisible box the tap ray still hits (thin things need one). */
const hitBox = (w, h, d, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  return m
}

/** A number in groups of three digits and the language's decimal mark. */
const grp = (v, digits, lang) => {
  const [i, f] = Math.abs(v).toFixed(digits).split('.')
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ')
  return (v < 0 ? '−' : '') + g + (f ? (lang === 'en' ? '.' : ',') + f : '')
}

/** "1 in N" in words for a loss in dB: a grouped number up to a billion, then the number of zeros. */
const lightLeft = (db, lg, E, lv) => {
  if (db < 0.05) return E.sea.all
  const z = db / 10
  if (z < 9) return fill(E.sea.oneIn, { n: grp(Math.round(10 ** z), 0, lg) })
  return lv === 'scientist' ? fill(E.sea.tenTo, { z: Math.round(z) }) : fill(E.sea.zeros, { z: Math.round(z) })
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, lang, color, clickable }) {
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const tex = t => (textures.push(t), t)
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = list => list.map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const pending = {}
  const shareSoon = id => {
    if (pending[id]) return
    pending[id] = true
    later(0.15, () => {
      pending[id] = false
      share(id)
    })
  }
  const settleTimers = {}
  const settleSay = (id, fn) => {
    settleTimers[id] = { t: 0.9, fn }
  }
  const say1 = (entry, vars) => say(fill(at(entry, level()), vars))

  // ===============================================================================================
  // the stage
  // ===============================================================================================
  const CABLE = { x: 0.3, z: -4.5, y: 1.05 } // the cut cable's place
  const REP = { x: 3.7, r: 0.5, len: 2.5 } // the repeater on the floor cable
  const TABLE = { x: 7.3, z: -3.3, yaw: -0.38 }
  const stage = abyssStage({
    radius: 12.4,
    light,
    lamps: [
      { x: -9.9, z: -2.0, intensity: 18 },
      { x: -1.5, z: -2.6, intensity: 16 },
      { x: 10.2, z: -1.0, intensity: 15 },
    ],
    rov: { x: -3.6, y: 1.5, z: 5.7, yaw: -0.35 },
    lift: { x: REP.x, y: REP.r + 0.02, flat: REP.len / 2 + 0.55, fall: 1.5 },
    bulge: { x: REP.x, dz: 2.7, w: 3.4 },
  })
  root.add(stage.group)
  const solids = stage.solids

  // shared plain materials (few kinds, so few shaders to compile)
  const steelMat = new THREE.MeshStandardMaterial({ color: '#7d848e', roughness: 0.5, metalness: 0.5 })
  const darkMat = new THREE.MeshStandardMaterial({ color: '#23272e', roughness: 0.55, metalness: 0.4 })
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.25, roughness: 0.4 })
  const beadMat = new THREE.MeshBasicMaterial({ color: '#eafff9' })
  const haloMat = new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
  const bead = () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), beadMat)
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 8), haloMat)
    m.add(h)
    m.raycast = () => {}
    h.raycast = () => {}
    m.visible = false
    return m
  }

  // =================================================================================================
  // "Stay inside!": the glass thread
  // =================================================================================================
  const F = { a: 2.5, ge: 3.5, k: 0, kShown: 0, sent: 0, got: 0, n: 0, lasered: false, bent: false, germTouched: false, angleTouched: false, last: 'angle', leakSeen: false }
  const fib = new THREE.Group()
  fib.position.set(FIB.X0, FIB.Y0, FIB.Z)
  root.add(fib)
  const cladTube = bentTube(FIB.R, { seg: 48, radial: 28 })
  const coreTube = bentTube(FIB.W / 2, { seg: 48, radial: 12 })
  const cladMat = new THREE.MeshStandardMaterial({ color: '#7fd8d0', emissive: '#1d6a68', emissiveIntensity: 0.5, roughness: 0.1, transparent: true, opacity: 0.17, depthWrite: false })
  const coreMat = new THREE.MeshStandardMaterial({ color: '#2fb8a6', emissive: TEAL, emissiveIntensity: 0.9, roughness: 0.3, transparent: true, opacity: 0.55, depthWrite: false })
  const cladMesh = new THREE.Mesh(cladTube.geo, cladMat)
  const coreMesh = new THREE.Mesh(coreTube.geo, coreMat)
  cladMesh.renderOrder = 1
  coreMesh.renderOrder = 2
  cladMesh.raycast = () => {}
  coreMesh.raycast = () => {}
  fib.add(cladMesh, coreMesh)
  // the thread's whole length is one thing to tap (a tube hit shape beside the clear glass)
  const tapTube = bentTube(FIB.R * 1.02, { seg: 24, radial: 10 })
  const tapMesh = new THREE.Mesh(tapTube.geo, new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }))
  fib.add(tapMesh)
  // germanium atoms mixed into the core, as many as the slider says (not to scale: a real core holds a few
  // in a hundred of its metal atoms)
  const ATOMS = 220
  const atomRnd = (() => {
    let s = 5
    return () => ((s = (s * 16807) % 2147483647) / 2147483647)
  })()
  const atomAt = Array.from({ length: ATOMS }, () => ({ s: 0.08 + atomRnd() * (FIB.L - 0.16), u: (atomRnd() - 0.5) * FIB.W * 0.8, z: (atomRnd() - 0.5) * FIB.W * 0.8 }))
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0145, 10, 8), new THREE.MeshStandardMaterial({ color: '#7fb8b2', emissive: '#3a706c', emissiveIntensity: 0.7, roughness: 0.4 }), ATOMS)
  atoms.frustumCulled = false
  atoms.raycast = () => {}
  fib.add(atoms)
  const dm = new THREE.Object3D()
  const setAtoms = () => {
    const shown = Math.round((clamp(F.ge / 6) * ATOMS))
    atoms.count = shown
    for (let i = 0; i < shown; i++) {
      const a = atomAt[i]
      const c = centre(a.s, F.kShown)
      dm.position.set(c.x - Math.sin(c.phi) * a.u, c.y + Math.cos(c.phi) * a.u, a.z)
      dm.updateMatrix()
      atoms.setMatrixAt(i, dm.matrix)
    }
    atoms.instanceMatrix.needsUpdate = true
  }
  // little tags on the glass: which is which
  {
    const tagCore = makeText(E.stay.tags.core, { font: 'body', size: 0.07, color: '#bff8f0', maxWidth: 1.6, anchorX: 'left' })
    tagCore.position.set(0.55, -0.15, FIB.R + 0.02)
    const tagClad = makeText(E.stay.tags.clad, { font: 'body', size: 0.07, color: '#bff8f0', maxWidth: 1.6, anchorX: 'left' })
    tagClad.position.set(0.55, 0.27, FIB.R + 0.02)
    fib.add(tagCore, tagClad)
    for (const [yy, y2] of [[-0.12, -0.045], [0.24, 0.1]]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.004, Math.abs(y2 - yy), 0.004), haloMat)
      l.position.set(0.5, (yy + y2) / 2, FIB.R + 0.02)
      fib.add(l)
    }
  }
  // the two ends: a glass face with its core, the laser against the left one and a receiver on the right
  const endFace = flip => {
    const g = new THREE.Group()
    const clad = new THREE.Mesh(new THREE.CircleGeometry(FIB.R, 32), new THREE.MeshBasicMaterial({ color: '#56b8b0', transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }))
    const core = new THREE.Mesh(new THREE.CircleGeometry(FIB.W / 2, 16), new THREE.MeshBasicMaterial({ color: '#d8fff8' }))
    core.position.z = 0.002
    g.add(clad, core)
    g.rotation.y = flip * (Math.PI / 2)
    clad.raycast = () => {}
    core.raycast = () => {}
    const holder = new THREE.Group()
    holder.add(g)
    return holder
  }
  const faceL = endFace(-1)
  const faceR = endFace(1)
  fib.add(faceL, faceR)
  // the laser: pivots on the middle of the left face and leans as the slider says
  const laser = new THREE.Group()
  fib.add(laser)
  const laserMat = new THREE.MeshStandardMaterial({ color: '#c9e6ff', emissive: TEAL, emissiveIntensity: 0.3, roughness: 0.4 })
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.22, 0.22, 3, 0.04), darkMat)
    body.position.x = -0.78
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 18), steelMat)
    ring.rotation.z = Math.PI / 2
    ring.position.x = -0.5
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 14), laserMat)
    eye.rotation.z = Math.PI / 2
    eye.position.x = -0.482
    laser.add(body, ring, eye)
    laser.add(hitBox(0.7, 0.34, 0.34, -0.72, 0, 0))
    // a short stand that keeps its pivot
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, FIB.Y0 - 0.2, 10), darkMat)
    stand.position.set(-0.83, -0.15 - (FIB.Y0 - 0.2) / 2, 0)
    fib.add(stand)
  }
  // the receiver: a plate on the right end that lights when the flash arrives
  const recv = new THREE.Group()
  fib.add(recv)
  const recvMat = new THREE.MeshStandardMaterial({ color: '#1c4a3c', emissive: '#4cffb0', emissiveIntensity: 0.05, roughness: 0.4 })
  {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.7, 0.5, 3, 0.03), darkMat)
    plate.position.x = 0.1
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), recvMat)
    eye.rotation.z = Math.PI / 2
    eye.position.x = 0.035
    recv.add(plate, eye)
  }
  // two adjustable stands under the thread (their tops follow it as it bends)
  const POSTS = [1.0, 3.4]
  const postMat = new THREE.MeshStandardMaterial({ color: '#3a4048', roughness: 0.5, metalness: 0.5 })
  const posts = POSTS.map(() => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1, 10), postMat)
    const cradle = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.08, 0.3, 2, 0.02), steelMat)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16), postMat)
    foot.position.y = 0.04 - FIB.Y0
    fib.add(m, cradle, foot)
    m.raycast = () => {}
    return { m, cradle }
  })
  solids.push(circle(FIB.X0 + POSTS[0], FIB.Z, 0.3), circle(FIB.X0 + POSTS[1], FIB.Z, 0.3), circle(FIB.X0 - 0.83, FIB.Z, 0.25))

  // the ray: a glow and a bright core, a dimmer one for what leaks, beads for the flashes
  const rayMat = new THREE.MeshBasicMaterial({ color: '#8affea', transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const rayCoreMat = new THREE.MeshBasicMaterial({ color: '#eafffb', transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const leakMat = new THREE.MeshBasicMaterial({ color: '#ffb68a', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const rayGlow = ribbon(40, 0.034, rayMat)
  const rayCore = ribbon(40, 0.011, rayCoreMat)
  const rayLeak = ribbon(2, 0.04, leakMat)
  const RZ = FIB.W / 2 + 0.006 // the ray and the flashes ride just in front of the core's glass
  for (const r of [rayGlow, rayCore, rayLeak]) {
    r.mesh.renderOrder = 5
    r.mesh.position.z = RZ
    fib.add(r.mesh)
  }
  const leakFlash = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffb68a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  leakFlash.raycast = () => {}
  fib.add(leakFlash)
  const starTex = tex(canvasTex(64, 64, (g, w) => {
    const c = w / 2
    const grd = g.createRadialGradient(c, c, 0, c, c, c)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.18, 'rgba(210,255,248,0.7)')
    grd.addColorStop(1, 'rgba(60,224,200,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    g.fillStyle = 'rgba(255,255,255,0.95)'
    g.beginPath()
    g.moveTo(c, 0)
    g.lineTo(c + 3, c - 3)
    g.lineTo(w, c)
    g.lineTo(c + 3, c + 3)
    g.lineTo(c, w)
    g.lineTo(c - 3, c + 3)
    g.lineTo(0, c)
    g.lineTo(c - 3, c - 3)
    g.closePath()
    g.fill()
  }, { mipmaps: false }))
  const sparkMat = new THREE.MeshBasicMaterial({ map: starTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const sparks = Array.from({ length: 12 }, () => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), sparkMat)
    m.raycast = () => {}
    m.renderOrder = 6
    m.visible = false
    fib.add(m)
    return m
  })
  const FB = Array.from({ length: 12 }, bead)
  for (const b of FB) fib.add(b)
  const flashes = [] // beads in flight: { s, mine, over }
  let R = traceRay({ k: 0, alpha: F.a * DEG, ge: F.ge })
  let fullPath = []
  let guidedLen = 0
  let totalLen = 0
  const lens = []
  const buildPath = () => {
    const ap = { x: -0.5 * Math.cos(F.a * DEG), y: -0.5 * Math.sin(F.a * DEG) }
    const g = [ap, ...(R.leakAt >= 0 ? R.path.slice(0, R.leakAt + 1) : R.path)]
    const x = R.leakAt >= 0 ? [R.path[R.leakAt], R.exitEnd] : []
    fullPath = x.length ? [...g, R.exitEnd] : g
    lens.length = 0
    let acc = 0
    lens.push(0)
    for (let i = 1; i < fullPath.length; i++) {
      acc += Math.hypot(fullPath[i].x - fullPath[i - 1].x, fullPath[i].y - fullPath[i - 1].y)
      lens.push(acc)
    }
    guidedLen = lens[g.length - 1]
    totalLen = acc
    rayGlow.set(g)
    rayCore.set(g)
    if (x.length) rayLeak.set(x)
    else rayLeak.set([])
    return { g, x }
  }
  const pointAtS = (s, out) => {
    let i = 1
    while (i < lens.length - 1 && lens[i] < s) i++
    const t = clamp((s - lens[i - 1]) / Math.max(1e-6, lens[i] - lens[i - 1]))
    out.x = lerp(fullPath[i - 1].x, fullPath[i].x, t)
    out.y = lerp(fullPath[i - 1].y, fullPath[i].y, t)
    return out
  }
  const info = () => {
    const n1 = nCore(F.ge)
    const thC = Math.asin(Math.min(1, N_CLAD / n1)) / DEG
    return { n1, thC, lim: 90 - thC }
  }
  const stayVars = () => {
    const i = info()
    const rad = F.kShown > 0.004 ? 1 / F.kShown : null
    return {
      a: num(F.a, 1, lang),
      ge: num(F.ge, 1, lang),
      x: num(F.ge, 1, lang),
      lim: num(i.lim, 1, lang),
      n1: num(i.n1, 4, lang),
      n2: num(N_CLAD, 3, lang),
      thc: num(i.thC, 1, lang),
      r: rad ? num(rad, rad < 10 ? 1 : 0, lang) : '-',
      th: num(R.thLeak / DEG, 1, lang),
      s: F.sent,
      rcv: F.got,
      n: F.sent,
    }
  }
  // the board standing in front of the thread: what the beam does
  const stayBoard = standingScreen({ width: 1.4, height: 0.8, color, title: E.stay.boardTitle, line: '', titleSize: 0.09, lineSize: 0.064 }, { top: 0.52, tilt: 0.42, mat: darkMat })
  stayBoard.group.position.set(FIB.X0 + 2.1, 0, FIB.Z + 1.15)
  stayBoard.group.rotation.y = 0.12
  root.add(stayBoard.group)
  solids.push(circle(FIB.X0 + 2.1, FIB.Z + 1.15, 0.45))
  const stayLine = () => {
    const v = stayVars()
    const lv = level()
    const verdict = at(R.arrived ? E.stay.verdict.ok : E.stay.verdict.leak, lv)
    return fill(at(E.stay.board, lv), { ...v, verdict })
  }

  // --- doing things
  let lastKey = ''
  let sparkAt = []
  const retrace = () => {
    const key = `${F.kShown.toFixed(4)}|${F.a.toFixed(2)}|${F.ge.toFixed(2)}`
    if (key === lastKey) return
    lastKey = key
    cladTube.set(F.kShown)
    coreTube.set(F.kShown)
    tapTube.set(F.kShown)
    R = traceRay({ k: F.kShown, alpha: F.a * DEG, ge: F.ge })
    buildPath()
    sparkAt = (R.leakAt >= 0 ? R.path.slice(1, R.leakAt) : R.path.slice(1, -1)).slice(0, 12)
    setAtoms()
    // the end face and receiver turn with the end of the thread
    const e = centre(FIB.L, F.kShown)
    faceR.position.set(e.x, e.y, 0)
    faceR.rotation.z = e.phi
    recv.position.set(e.x, e.y, 0)
    recv.rotation.z = e.phi
    laser.rotation.z = F.a * DEG
    for (let i = 0; i < POSTS.length; i++) {
      const c = centre(POSTS[i], F.kShown)
      const top = FIB.Y0 + c.y - FIB.R - 0.05
      posts[i].m.scale.y = top
      posts[i].m.position.set(c.x, top / 2 - FIB.Y0, 0)
      posts[i].cradle.position.set(c.x, top - FIB.Y0 + 0.04, 0)
      posts[i].cradle.rotation.z = c.phi
    }
    // the core's glow and colour follow the germanium
    const g = clamp(F.ge / 3.5, 0, 1.4)
    coreMat.emissiveIntensity = 0.12 + 0.85 * g
    coreMat.color.set('#8fdcd2').lerp(new THREE.Color(TEAL), clamp(g))
    coreMat.emissive.set('#3a8c86').lerp(new THREE.Color(TEAL), clamp(g))
  }
  const fireFlash = mine => {
    play('beam')
    for (let i = 0; i < 5; i++) flashes.push({ s: -i * 0.42, mine, got: false })
    F.n += 1
    F.sent += 5
    laserMat.emissiveIntensity = 2.4
  }
  const stayHint = () => (!F.lasered ? E.stay.hints.laser : !F.bent ? E.stay.hints.bend : !F.germTouched ? E.stay.hints.germ : !F.angleTouched ? E.stay.hints.angle : E.stay.hints.done)
  const stayWords = () => {
    const v = stayVars()
    const lv = level()
    if (F.last === 'ge') {
      if (F.ge < 0.05) return say(at(E.stay.says.germ0, lv))
      return say(fill(at(E.stay.says.germ, lv), v))
    }
    if (F.last === 'bend') {
      if (F.kShown < 0.004) return say(at(E.stay.says.straight, lv))
      return say(fill(at(R.arrived ? E.stay.says.bent : E.stay.says.bentLeak, lv), v))
    }
    return say(fill(at(R.arrived ? E.stay.says.angle : E.stay.says.angleLeak, lv), v))
  }
  const stayPanel = lv => ({
    title: E.stay.title,
    color,
    blocks: [
      ...paras(E.stay.panel[depth(lv)]),
      { p: E.stay.tip },
      {
        slider: {
          label: E.stay.sliders.angle,
          min: 0,
          max: 8,
          step: 0.1,
          value: F.a,
          onInput: v => {
            F.a = v
            F.angleTouched = true
            F.last = 'angle'
            shareSoon('stay')
            settleSay('stay', stayWords)
          },
          format: v => `${num(v, 1, lang)}°`,
          live: () => F.a,
        },
      },
      {
        slider: {
          label: E.stay.sliders.ge,
          min: 0,
          max: 6,
          step: 0.1,
          value: F.ge,
          onInput: v => {
            F.ge = v
            F.germTouched = true
            F.last = 'ge'
            shareSoon('stay')
            settleSay('stay', stayWords)
          },
          format: v => `${num(v, 1, lang)} %`,
          live: () => F.ge,
        },
      },
      {
        slider: {
          label: E.stay.sliders.bend,
          min: 0,
          max: KMAX,
          step: 0.002,
          value: F.k,
          onInput: v => {
            F.k = v
            F.bent = F.bent || v > 0.01
            F.last = 'bend'
            shareSoon('stay')
            settleSay('stay', stayWords)
          },
          format: v => (v < 0.004 ? E.stay.straight : fill(E.stay.radius, { r: num(1 / v, 0, lang) })),
          live: () => F.k,
        },
      },
      {
        buttons: [
          { label: E.stay.buttons.laser, onClick: () => tapLaser() },
          { label: E.stay.buttons.bend, onClick: () => tapFibre() },
        ],
      },
    ],
  })
  const tapLaser = () => {
    if (flashes.some(f => f.mine) && flashes.length > 6) return
    F.lasered = true
    fireFlash(true)
    say1(E.stay.says.flash, stayVars())
    share('stay')
    findOnce('stay', stayPanel, 3)
  }
  const tapFibre = () => {
    play('select')
    F.bent = true
    F.k = F.k > 0.01 ? 0 : KTAP
    F.last = 'bend'
    share('stay')
    settleSay('stay', stayWords)
    refresh(stayPanel)
    findOnce('stay', stayPanel, 3)
  }
  ex.add({
    id: 'stay',
    x: FIB.X0 + 2.3,
    z: 0.9,
    radius: 2.9,
    label: E.stay.label,
    verb: stayHint,
    manual: true,
    focus: { x: FIB.X0 + 2.5, y: 1.2, z: FIB.Z, size: 3.0, width: 5.9 },
    act: () => ctx.showPanel(stayPanel),
  })
  clickable(laser, tapLaser, { reach: 7 })
  clickable(tapMesh, tapFibre, { reach: 7 })

  let boardWait = 0
  const tmp = { x: 0, y: 0 }
  updates.push((dt, t) => {
    F.kShown = Math.abs(F.k - F.kShown) < 0.0004 ? F.k : damp(F.kShown, F.k, 4.5, dt)
    retrace()
    // the flashes run along the ray, and what reaches the end lights the receiver
    let live = 0
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]
      f.s += dt * 3.2
      if (f.s > totalLen + 0.6) {
        flashes.splice(i, 1)
        continue
      }
      if (R.arrived && !f.got && f.s >= guidedLen) {
        f.got = true
        F.got += 1
        recvMat.emissiveIntensity = 2.6
        if (f.mine && !flashes.some(g => g.mine && g !== f && !g.got)) later(0.3, arrivedWords)
      }
      if (!R.arrived && !f.got && f.s >= guidedLen) {
        f.got = true
        if (f.mine && !flashes.some(g => g.mine && g !== f && !g.got)) later(0.3, lostWords)
      }
    }
    FB.forEach((b, i) => {
      const f = flashes[i]
      if (!f || f.s < 0) return void (b.visible = false)
      b.visible = true
      pointAtS(Math.min(f.s, totalLen), tmp)
      b.position.set(tmp.x, tmp.y, RZ)
      live++
      const fade = f.s > guidedLen && !R.arrived ? clamp(1 - (f.s - guidedLen) / 0.6) : 1
      b.scale.setScalar(0.3 + fade * 0.7)
    })
    sparks.forEach((m, i) => {
      const p = sparkAt[i]
      m.visible = !!p
      if (!p) return
      m.position.set(p.x, p.y, RZ + 0.004)
      // a flash passing over a wall hit makes it flare
      let boost = 0
      for (const b of FB) if (b.visible) boost = Math.max(boost, 1 - Math.hypot(b.position.x - p.x, b.position.y - p.y) / 0.4)
      m.scale.setScalar(0.85 + 0.25 * Math.sin(t * 4 + i * 1.7) + 1.1 * Math.max(0, boost))
    })
    recvMat.emissiveIntensity = damp(recvMat.emissiveIntensity, R.arrived ? 0.18 : 0.04, 2.5, dt)
    laserMat.emissiveIntensity = damp(laserMat.emissiveIntensity, 0.3, 4, dt)
    // the leak's flash sits where the ray leaves the core
    if (R.leakAt >= 0) leakFlash.position.set(R.path[R.leakAt].x, R.path[R.leakAt].y, RZ)
    leakFlash.material.opacity = R.leakAt >= 0 ? 0.5 + 0.3 * Math.sin(t * 6) : 0
    boardWait -= dt
    if (boardWait <= 0) {
      boardWait = 0.12
      stayBoard.set({ line: stayLine() })
    }
  })
  const arrivedWords = () => {
    if (!here()) return
    say1(E.stay.says.arrived, stayVars())
  }
  const lostWords = () => {
    if (!here()) return
    say1(E.stay.says.lost, stayVars())
  }
  const here = () => ctx.engine.world?.root === root

  // =================================================================================================
  // "The cable cut open": layers and the repeater
  // =================================================================================================
  const LAYERS = [
    { id: 'poly', ro: 0.6, ri: 0.46, back: 1.0, color: '#2a2d33', metal: 0.05, rough: 0.55 },
    { id: 'steel', wires: 18, rad: 0.385, wr: 0.068, back: 0.78, color: '#8e959e', metal: 0.5, rough: 0.5 },
    { id: 'copper', ro: 0.31, ri: 0.25, back: 0.56, color: '#c4702f', metal: 0.5, rough: 0.45 },
    { id: 'gel', ro: 0.25, back: 0.34, color: '#e8c36a', metal: 0.0, rough: 0.15, gel: true },
    { id: 'glass', fibres: 8, back: -0.5, color: TEAL, metal: 0.0, rough: 0.3 },
  ]
  const LEN = 1.5
  const cab = new THREE.Group()
  cab.position.set(CABLE.x, CABLE.y, CABLE.z)
  cab.rotation.y = 0.18
  root.add(cab)
  // a heavy cradle under it
  {
    const cradle = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.42, 1.9, 3, 0.05), darkMat)
    cradle.position.set(0, -CABLE.y + 0.21, -0.5)
    cab.add(cradle)
    for (const z of [-1.05, 0.05]) {
      const cleat = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.18, 0.12, 2, 0.03), steelMat)
      cleat.position.set(0, -0.58, z)
      cab.add(cleat)
    }
  }
  solids.push(box(CABLE.x, CABLE.z - 0.45, 1.6, 2.0, { rot: -0.18 }))
  const C = { open: LAYERS.map(() => false), shown: LAYERS.map(() => 0), glow: LAYERS.map(() => 0), sel: -1, touched: 0, lid: false, lidK: 0, pump: true, pumpK: 1, pumpTouched: false }
  const layerGroups = LAYERS.map(L => {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({
      color: L.color,
      roughness: L.rough,
      metalness: L.metal,
      emissive: L.color,
      emissiveIntensity: 0,
      ...(L.gel ? { transparent: true, opacity: 0.88 } : {}),
    })
    if (L.wires) {
      for (let i = 0; i < L.wires; i++) {
        const a = (i / L.wires) * TAU
        const w = new THREE.Mesh(new THREE.CylinderGeometry(L.wr, L.wr, LEN, 12), mat)
        w.rotation.x = Math.PI / 2
        w.position.set(Math.cos(a) * L.rad, Math.sin(a) * L.rad, -LEN / 2)
        g.add(w)
      }
    } else if (L.fibres) {
      for (let i = 0; i < L.fibres; i++) {
        const a = (i / L.fibres) * TAU
        const rr = i === 0 ? 0 : 0.075
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, LEN * 0.8, 8), mat)
        w.rotation.x = Math.PI / 2
        w.position.set(Math.cos(a) * rr, Math.sin(a) * rr, -LEN * 0.4)
        g.add(w)
      }
    } else {
      const shape = new THREE.Shape()
      shape.absarc(0, 0, L.ro, 0, TAU, false)
      if (L.ri) {
        const hole = new THREE.Path()
        hole.absarc(0, 0, L.ri, 0, TAU, true)
        shape.holes.push(hole)
      }
      const geo = new THREE.ExtrudeGeometry(shape, { depth: LEN, bevelEnabled: false, curveSegments: 40 })
      geo.translate(0, 0, -LEN)
      const m = new THREE.Mesh(geo, mat)
      g.add(m)
    }
    if (L.fibres) g.add(hitBox(0.26, 0.26, 0.9, 0, 0, -0.35))
    g.userData.mat = mat
    cab.add(g)
    return g
  })
  // the cable board: the layers, the one picked marked
  const cabBoard = standingScreen({ width: 1.3, height: 0.88, color, title: E.cable.boardTitle, line: '', titleSize: 0.085, lineSize: 0.062 }, { top: 1.3, tilt: 0.2, mat: darkMat })
  cabBoard.group.position.set(2.0, 0, -6.3)
  cabBoard.group.rotation.y = -0.35
  root.add(cabBoard.group)
  solids.push(circle(2.0, -6.3, 0.4))
  const cabLine = () => {
    const lv = level()
    return LAYERS.map((L, i) => `${C.sel === i ? '> ' : '   '}${i + 1}  ${at(E.cable.layers[L.id].name, lv)}${C.open[i] ? '  (*)' : ''}`).join('\n')
  }
  const layerHit = i => () => tapLayer(i)

  // the repeater on the floor cable, its lid and what is inside
  const rep = new THREE.Group()
  rep.position.set(REP.x, REP.r + 0.02, stage.cableZ(REP.x))
  rep.rotation.y = -Math.atan2(stage.cableZ(REP.x + 0.05) - stage.cableZ(REP.x - 0.05), 0.1)
  root.add(rep)
  solids.push(box(REP.x, stage.cableZ(REP.x), REP.len + 0.2, REP.r * 2 + 0.1))
  const shellMat = new THREE.MeshStandardMaterial({ color: '#9aa1ab', roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide })
  const bootMat = new THREE.MeshStandardMaterial({ color: '#b87430', roughness: 0.75 })
  const lid = new THREE.Group()
  lid.position.set(0, 0, -REP.r)
  {
    // a half pipe along x: its section is in the y-z plane, theta measured from +z towards +y
    const half = start => new THREE.CylinderGeometry(REP.r, REP.r, REP.len, 28, 1, true, start, Math.PI).rotateZ(Math.PI / 2)
    const trough = new THREE.Mesh(half(Math.PI), shellMat)
    // top half: the lid, hinged along its back edge
    const top = new THREE.Mesh(half(0), shellMat)
    top.position.z = REP.r
    lid.add(top)
    rep.add(trough, lid)
    // end caps: half discs, and the rubber boots where the cable goes in
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CircleGeometry(REP.r, 28, Math.PI, Math.PI), shellMat)
      cap.rotation.y = s * (Math.PI / 2)
      cap.position.x = (s * REP.len) / 2
      rep.add(cap)
      const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, REP.r * 0.62, 0.6, 16), bootMat)
      boot.rotation.z = (s * Math.PI) / 2
      boot.position.x = (s * (REP.len + 0.6)) / 2
      rep.add(boot)
    }
    // the plate inside, and the lid's hit shape
    const plate = new THREE.Mesh(new RoundedBoxGeometry(REP.len - 0.2, 0.05, REP.r * 1.7, 2, 0.01), darkMat)
    plate.position.y = -0.03
    rep.add(plate)
  }
  const lidHit = hitBox(REP.len, REP.r, REP.r * 2, 0, REP.r * 0.5, 0)
  rep.add(lidHit)
  // inside: the pump laser, the coil of erbium-doped fibre (pink) and the fibre path
  const YP = 0.0
  const inner = new THREE.Group()
  rep.add(inner)
  const pumpMat = new THREE.MeshStandardMaterial({ color: '#3a2a52', emissive: '#a070ff', emissiveIntensity: 0.4, roughness: 0.4 })
  const pump = new THREE.Group()
  pump.position.set(-0.42, YP + 0.11, 0.0)
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.2, 0.4, 3, 0.03), pumpMat)
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff9a3a' }))
    led.position.set(0.14, 0.13, 0)
    led.name = 'led'
    pump.add(body, led)
    pump.add(hitBox(0.6, 0.34, 0.5, 0, 0.04, 0))
  }
  inner.add(pump)
  const coilMat = new THREE.MeshStandardMaterial({ color: '#ff7ab8', emissive: '#ff5aa0', emissiveIntensity: 0.4, roughness: 0.4 })
  const coil = new THREE.Group()
  coil.position.set(0.5, YP + 0.07, 0)
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.27 - i * 0.04, 0.02, 8, 36), coilMat)
    t.rotation.x = Math.PI / 2
    t.position.y = i * 0.034
    coil.add(t)
  }
  inner.add(coil)
  const wireMat = new THREE.MeshBasicMaterial({ color: '#52cfc4' })
  const wire = (a, b) => {
    const d = new THREE.Vector3().subVectors(b, a)
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, d.length(), 6), wireMat)
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    inner.add(m)
  }
  const WY = YP + 0.13
  const pIn0 = new THREE.Vector3(-REP.len / 2 - 0.25, WY, 0)
  const pIn1 = new THREE.Vector3(0.26, WY, 0)
  const pOut0 = new THREE.Vector3(0.74, WY, 0)
  const pOut1 = new THREE.Vector3(REP.len / 2 + 0.25, WY, 0)
  wire(pIn0, pIn1)
  wire(pOut0, pOut1)
  // the pump's own light into the coil, violet (invisible in life: infrared)
  const pumpBeads = Array.from({ length: 5 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: '#b890ff' }))
    m.raycast = () => {}
    inner.add(m)
    return m
  })
  const pulses = Array.from({ length: 3 }, bead)
  for (const p of pulses) inner.add(p)
  const RP = { t: 0, pulses: [{ s: 0 }], wait: 0 }
  const COIL_R = 0.24
  const repPoint = (s, out) => {
    // s from 0 to 3: in, round the coil, out
    if (s < 1) return out.lerpVectors(pIn0, pIn1, s)
    if (s < 2) {
      const a = Math.PI + (s - 1) * 3 * Math.PI
      return out.set(coil.position.x + Math.cos(a) * COIL_R, WY, Math.sin(a) * COIL_R)
    }
    return out.lerpVectors(pOut0, pOut1, s - 2)
  }
  const cbl = new THREE.Vector3()
  const repGain = s => {
    // the pulse is weak coming in, grows round the coil (pump on) or dies (pump off), and leaves
    const k = ease(clamp(s - 1))
    const inSize = 0.7
    const out = C.pumpK > 0.5 ? 1.7 : 0.25
    return s < 1 ? inSize : s < 2 ? lerp(inSize, out, k) : out
  }
  // the repeater's own board: a short plaque on its side
  const cabHint = () => {
    const i = C.open.indexOf(false)
    if (i >= 0) return E.cable.hints[LAYERS[i].id]
    if (!C.lid) return E.cable.hints.repeater
    if (!C.pumpTouched) return E.cable.hints.pump
    return E.cable.hints.done
  }
  const tapLayer = i => {
    C.open[i] = !C.open[i]
    C.glow[i] = 1
    C.sel = i
    play(C.open[i] ? 'select' : 'tap')
    const L = LAYERS[i]
    say(at(E.cable.layers[L.id].says, level()))
    share('cable')
    findOnce('cable', cablePanel, 3)
    refresh(cablePanel)
  }
  const tapRepeater = () => {
    C.lid = !C.lid
    play(C.lid ? 'select' : 'tap')
    say1(C.lid ? E.cable.says.open : E.cable.says.close)
    share('cable')
    findOnce('cable', cablePanel, 3)
  }
  const tapPump = () => {
    if (!C.lid) return tapRepeater()
    C.pump = !C.pump
    C.pumpTouched = true
    play(C.pump ? 'beam' : 'tap')
    say1(C.pump ? E.cable.says.pumpOn : E.cable.says.pumpOff)
    share('cable')
    findOnce('cable', cablePanel, 3)
  }
  const cablePanel = lv => ({
    title: E.cable.title,
    color,
    blocks: [
      ...paras(E.cable.panel[depth(lv)]),
      { p: E.cable.tip },
      { rows: LAYERS.map((L, i) => [`${i + 1}  ${at(E.cable.layers[L.id].name, lv)}`, at(E.cable.layers[L.id].job, lv)]) },
      {
        buttons: [
          { label: E.cable.buttons.layer, onClick: () => tapLayer(Math.max(0, C.open.indexOf(false)) % LAYERS.length) },
          { label: E.cable.buttons.repeater, onClick: () => tapRepeater() },
          { label: E.cable.buttons.pump, onClick: () => tapPump() },
        ],
      },
    ],
  })
  ex.add({
    id: 'cable',
    x: 2.0,
    z: -0.5,
    radius: 3.3,
    label: E.cable.label,
    verb: cabHint,
    manual: true,
    focus: { x: 2.0, y: 0.9, z: -4.8, size: 4.0, width: 6.2 },
    act: () => ctx.showPanel(cablePanel),
  })
  layerGroups.forEach((g, i) => clickable(g, layerHit(i), { reach: 8 }))
  clickable(lidHit, () => (C.lid ? null : tapRepeater()), { reach: 9, when: () => !C.lid })
  clickable(pump, tapPump, { reach: 9, when: () => C.lid })
  clickable(lid, tapRepeater, { reach: 9, when: () => C.lid })
  updates.push((dt, t) => {
    for (let i = 0; i < LAYERS.length; i++) {
      const L = LAYERS[i]
      C.shown[i] = damp(C.shown[i], C.open[i] ? 1 : 0, 4, dt)
      layerGroups[i].position.z = -L.back * ease(C.shown[i]) * (L.back < 0 ? 1 : 1)
      C.glow[i] = Math.max(0, C.glow[i] - dt * 0.8)
      layerGroups[i].userData.mat.emissiveIntensity = (C.glow[i] * 0.9 + (C.sel === i ? 0.1 : 0)) * (L.id === 'glass' ? 1.6 : 0.8) + (L.id === 'glass' ? 0.9 : 0)
    }
    C.lidK = damp(C.lidK, C.lid ? 1 : 0, 3.6, dt)
    lid.rotation.x = -2.0 * ease(C.lidK)
    C.pumpK = damp(C.pumpK, C.pump ? 1 : 0, 5, dt)
    pumpMat.emissiveIntensity = 0.15 + 0.7 * C.pumpK
    coilMat.emissiveIntensity = 0.25 + 0.8 * C.pumpK * (0.8 + 0.2 * Math.sin(t * 5))
    pump.getObjectByName('led').material.color.set(C.pump ? '#ffb04a' : '#5a4636')
    // the pulses in the repeater (only seen with the lid open)
    inner.visible = C.lidK > 0.02
    if (inner.visible) {
      RP.wait -= dt
      if (RP.wait <= 0) {
        RP.wait = 1.7
        RP.pulses.push({ s: 0 })
      }
      for (let i = RP.pulses.length - 1; i >= 0; i--) {
        const p = RP.pulses[i]
        p.s += dt * 0.7
        if (p.s > 3) RP.pulses.splice(i, 1)
      }
      pulses.forEach((b, i) => {
        const p = RP.pulses[i]
        if (!p) return void (b.visible = false)
        b.visible = true
        repPoint(p.s, cbl)
        b.position.copy(cbl)
        b.scale.setScalar(repGain(p.s))
      })
      pumpBeads.forEach((b, i) => {
        b.visible = C.pumpK > 0.3
        const f = (t * 0.9 + i / pumpBeads.length) % 1
        b.position.set(lerp(pump.position.x + 0.28, coil.position.x - 0.15, f), lerp(YP + 0.24, WY, f), lerp(0.0, -0.12, f))
        b.scale.setScalar(1 + 0.4 * Math.sin(f * Math.PI))
      })
    }
    cabBoard.set({ line: cabLine() })
  })

  // =================================================================================================
  // "Across the ocean": the map table
  // =================================================================================================
  const MAP = { lon0: -50, lon1: -1, lat0: -8, lat1: 40, w: 2.5, h: 1.94 }
  const SINES = { lon: -8.87, lat: 37.96 }
  const FORT = { lon: -38.54, lat: -3.72 }
  const toXY = (lon, lat) => ({ x: ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0) - 0.5) * MAP.w, y: ((lat - MAP.lat0) / (MAP.lat1 - MAP.lat0) - 0.5) * MAP.h })
  // the route: the shortest way over the globe (a great circle), a little longer in life
  const route = []
  {
    const ll = ({ lon, lat }) => new THREE.Vector3(Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG))
    const a = ll(SINES)
    const b = ll(FORT)
    const om = Math.acos(clamp(a.dot(b), -1, 1))
    for (let i = 0; i <= 120; i++) {
      const f = i / 120
      const v = a.clone().multiplyScalar(Math.sin((1 - f) * om) / Math.sin(om)).add(b.clone().multiplyScalar(Math.sin(f * om) / Math.sin(om)))
      const lat = Math.asin(v.y) / DEG
      const lon = Math.atan2(v.z, v.x) / DEG
      route.push(toXY(lon, lat))
    }
  }
  const routeCum = [0]
  for (let i = 1; i < route.length; i++) routeCum.push(routeCum[i - 1] + Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y))
  const routeLen = routeCum[routeCum.length - 1]
  const routeAt = (f, out) => {
    const s = clamp(f) * routeLen
    let i = 1
    while (i < routeCum.length - 1 && routeCum[i] < s) i++
    const t = clamp((s - routeCum[i - 1]) / (routeCum[i] - routeCum[i - 1]))
    out.x = lerp(route[i - 1].x, route[i].x, t)
    out.y = lerp(route[i - 1].y, route[i].y, t)
    return out
  }
  const mapTex = tex(canvasTex(1280, 994, (g, w, h) => {
    const X = lon => ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * w
    const Y = lat => (1 - (lat - MAP.lat0) / (MAP.lat1 - MAP.lat0)) * h
    g.fillStyle = '#0d3a58'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(160,220,255,0.12)'
    g.lineWidth = 2
    for (let lon = -50; lon <= 0; lon += 10) {
      g.beginPath()
      g.moveTo(X(lon), 0)
      g.lineTo(X(lon), h)
      g.stroke()
    }
    for (let lat = -10; lat <= 40; lat += 10) {
      g.beginPath()
      g.moveTo(0, Y(lat))
      g.lineTo(w, Y(lat))
      g.stroke()
    }
    const land = new Path2D()
    for (const ring of LAND) {
      let lon = ring[0]
      let lat = ring[1]
      land.moveTo(X(lon / 5), Y(lat / 5))
      for (let i = 2; i < ring.length; i += 2) {
        lon += ring[i]
        lat += ring[i + 1]
        land.lineTo(X(lon / 5), Y(lat / 5))
      }
      land.closePath()
    }
    g.fillStyle = '#4f7a52'
    g.fill(land, 'evenodd')
    g.strokeStyle = '#8fb48a'
    g.lineWidth = 2
    g.stroke(land)
    // the cable
    g.strokeStyle = '#3ce0c8'
    g.lineWidth = 5
    g.setLineDash([])
    g.beginPath()
    route.forEach((p, i) => {
      const x = (p.x / MAP.w + 0.5) * w
      const y = (0.5 - p.y / MAP.h) * h
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    })
    g.stroke()
    // names
    g.fillStyle = 'rgba(235,245,255,0.8)'
    g.font = '700 38px Outfit'
    g.textAlign = 'center'
    g.fillText(E.sea.map.portugal, X(-8.5), Y(41.4))
    g.fillText(E.sea.map.brazil, X(-44), Y(-6.6))
    g.fillText(E.sea.map.africa, X(-8), Y(8))
    g.fillStyle = 'rgba(160,210,255,0.55)'
    g.font = '700 46px Outfit'
    g.fillText(E.sea.map.atlantic, X(-26), Y(22))
  }, { mipmaps: true }))
  const table = new THREE.Group()
  table.position.set(TABLE.x, 0, TABLE.z)
  table.rotation.y = TABLE.yaw
  root.add(table)
  const slope = new THREE.Group()
  slope.position.set(0, 1.35, 0)
  slope.rotation.x = -0.42
  table.add(slope)
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(MAP.w + 0.16, MAP.h + 0.16, 0.08, 3, 0.03), darkMat)
    frame.position.z = -0.045
    slope.add(frame)
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 1.4, 10), darkMat)
      leg.position.set(s * 1.05, 0.7, -0.45)
      leg.rotation.x = 0
      table.add(leg)
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 14), darkMat)
      foot.position.set(s * 1.05, 0.035, -0.45)
      table.add(foot)
    }
    const ledge = new THREE.Mesh(new RoundedBoxGeometry(MAP.w + 0.2, 0.06, 0.16, 2, 0.02), steelMat)
    ledge.position.set(0, -MAP.h / 2 - 0.04, 0.04)
    slope.add(ledge)
  }
  const mapPlane = new THREE.Mesh(new THREE.PlaneGeometry(MAP.w, MAP.h), new THREE.MeshBasicMaterial({ map: mapTex, toneMapped: false }))
  mapPlane.raycast = () => {}
  slope.add(mapPlane)
  solids.push(box(TABLE.x - 0.18, TABLE.z - 0.25, 2.5, 0.9, { rot: -TABLE.yaw }))
  const onMap = (obj, p, z = 0.03) => {
    obj.position.set(p.x, p.y, z)
    slope.add(obj)
    return obj
  }
  // the two ends of the cable
  const mark = (p, c, name) => {
    const g = new THREE.Group()
    const dotM = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9, roughness: 0.4 }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 8, 28), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8 }))
    const label = makeText(name, { size: 0.085, color: '#ffffff', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#06283a' })
    label.position.set(0, 0.14, 0)
    g.add(dotM, ring, label, hitBox(0.36, 0.36, 0.2, 0, 0, 0.05))
    onMap(g, p)
    return { g, dotM, ring }
  }
  const sines = mark(route[0], GOLD, 'Sines')
  const fort = mark(route[route.length - 1], TEAL, 'Fortaleza')
  // the repeaters, one dot every SPAN km, lit when they are on
  const NREP = Math.floor(ROUTE_KM / SPAN)
  const repDots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NREP)
  repDots.frustumCulled = false
  repDots.raycast = () => {}
  {
    const o = new THREE.Object3D()
    const q = { x: 0, y: 0 }
    for (let i = 0; i < NREP; i++) {
      routeAt(((i + 1) * SPAN) / ROUTE_KM, q)
      o.position.set(q.x, q.y, 0.025)
      o.updateMatrix()
      repDots.setMatrixAt(i, o.matrix)
    }
    repDots.instanceMatrix.needsUpdate = true
    slope.add(repDots)
  }
  // the pulse
  const pulse = new THREE.Group()
  const pulseCore = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), new THREE.MeshBasicMaterial({ color: '#f4fffd', transparent: true }))
  const pulseHalo = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))
  pulse.add(pulseCore, pulseHalo)
  pulse.raycast = () => {}
  pulseCore.raycast = () => {}
  pulseHalo.raycast = () => {}
  onMap(pulse, route[0], 0.05)
  pulse.visible = false
  // the switch for the repeaters, on the ledge
  const sw = new THREE.Group()
  sw.position.set(0.7, -MAP.h / 2 - 0.12, 0.2)
  slope.add(sw)
  const swLed = new THREE.MeshStandardMaterial({ color: '#40281c', emissive: '#ff5a3a', emissiveIntensity: 0.2, roughness: 0.4 })
  const lever = new THREE.Group()
  {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.2, 0.06, 3, 0.02), darkMat)
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.02), steelMat)
    slot.position.z = 0.032
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), steelMat)
    stem.rotation.x = Math.PI / 2
    stem.position.z = 0.07
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), goldMat)
    knob.position.z = 0.14
    lever.add(stem, knob)
    lever.position.z = 0.03
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), swLed)
    led.position.set(0.28, 0, 0.04)
    const lab = makeText(E.sea.switch, { size: 0.06, color: '#ffffff', anchorX: 'center', anchorY: 'bottom' })
    lab.position.set(-0.04, 0.16, 0.03)
    sw.add(plate, slot, lever, led, lab, hitBox(0.9, 0.34, 0.35, 0, 0, 0.15))
  }
  const S = { rep: false, repK: 0, d: 1500, n: 0, run: null, pin: false, hasRun: false, lostOnce: false, arrived: false, slid: false, tmaps: 0 }
  const seaBoard = standingScreen({ width: 1.25, height: 0.72, color, title: E.sea.boardTitle, line: '', titleSize: 0.08, lineSize: 0.06 }, { top: 0.25, tilt: 0.36, mat: darkMat })
  seaBoard.group.position.set(TABLE.x - 0.9, 0, TABLE.z + 0.75)
  seaBoard.group.rotation.y = 0
  root.add(seaBoard.group)
  solids.push(circle(TABLE.x - 0.9, TABLE.z + 0.75, 0.4))
  const lossAt = (d, repeaters) => (repeaters ? ((d % SPAN) * LOSS) : d * LOSS)
  const timeMs = d => (d / V_FIBRE) * 1000
  const seaVars = d => {
    const db = d * LOSS
    return {
      d: grp(Math.round(d), 0, lang),
      t: num(timeMs(d), timeMs(d) < 10 ? 1 : 0, lang),
      rt: num(2 * timeMs(ROUTE_KM), 0, lang),
      db: grp(Math.round(db), 0, lang),
      left: lightLeft(db, lang, E, level()),
      lost: grp(Math.round(60 / LOSS), 0, lang),
    }
  }
  const seaLine = () => {
    const lv = level()
    const run = S.run
    const d = run ? run.d : S.d
    const v = seaVars(d)
    if (run?.lost) v.left = at(E.sea.lostWord, lv)
    else if (S.rep) v.left = at(E.sea.topped, lv)
    return fill(at(E.sea.board, lv), v)
  }
  const seaHint = () => (!S.hasRun ? E.sea.hints.sines : !S.rep ? E.sea.hints.switch : !S.arrived ? E.sea.hints.again : !S.slid ? E.sea.hints.slide : E.sea.hints.done)
  const startRun = mine => {
    S.n += 1
    S.run = { f: 0, mine, rep: S.rep, d: 0, lost: false }
    S.hasRun = true
    play('beam')
    pulse.visible = true
  }
  const tapSines = () => {
    if (S.run) return
    startRun(true)
    say1(E.sea.says.start, seaVars(0))
    share('sea')
    findOnce('sea', seaPanel, RUN_SECONDS + 2)
  }
  const tapSwitch = () => {
    S.rep = !S.rep
    play('select')
    say1(S.rep ? E.sea.says.on : E.sea.says.off, seaVars(S.d))
    share('sea')
    refresh(seaPanel)
    findOnce('sea', seaPanel, 3)
  }
  const tapFort = () => {
    if (S.run) return
    S.d = ROUTE_KM
    S.slid = true
    play('tap')
    say1(E.sea.says.far, seaVars(ROUTE_KM))
    share('sea')
    refresh(seaPanel)
  }
  const seaPanel = lv => ({
    title: E.sea.title,
    color,
    blocks: [
      ...paras(E.sea.panel[depth(lv)]),
      { p: E.sea.tip },
      {
        slider: {
          label: E.sea.slider,
          min: 0,
          max: ROUTE_KM,
          step: 10,
          value: S.d,
          onInput: v => {
            if (S.run) return
            S.d = v
            S.slid = true
            shareSoon('sea')
            settleSay('sea', () => say1(E.sea.says.slide, seaVars(S.d)))
          },
          format: v => `${grp(v, 0, lang)} km`,
          live: () => S.d,
        },
      },
      {
        buttons: [
          { label: E.sea.buttons.sines, onClick: () => tapSines() },
          { label: E.sea.buttons.repeaters, onClick: () => tapSwitch() },
          { label: E.sea.buttons.fortaleza, onClick: () => tapFort() },
        ],
      },
    ],
  })
  ex.add({
    id: 'sea',
    x: TABLE.x - 1.3,
    z: 0.3,
    radius: 2.9,
    label: E.sea.label,
    verb: seaHint,
    manual: true,
    focus: { x: TABLE.x - 0.8, y: 1.3, z: TABLE.z, size: 3.2, width: 4.8 },
    act: () => ctx.showPanel(seaPanel),
  })
  clickable(sines.g, tapSines, { reach: 8 })
  clickable(fort.g, tapFort, { reach: 8 })
  clickable(sw, tapSwitch, { reach: 8 })
  const q = { x: 0, y: 0 }
  let seaWait = 0
  updates.push((dt, t) => {
    S.repK = damp(S.repK, S.rep ? 1 : 0, 6, dt)
    repDots.material.color.set('#4a5a66').lerp(new THREE.Color(GOLD), S.repK)
    lever.rotation.x = lerp(0.5, -0.5, S.repK)
    swLed.emissive.set('#ff5a3a').lerp(new THREE.Color('#4cff9a'), S.repK)
    swLed.emissiveIntensity = 0.3 + 0.8 * S.repK
    sines.ring.scale.setScalar(1 + 0.12 * Math.sin(t * 3))
    fort.ring.scale.setScalar(1 + (S.arrived ? 0.12 * Math.sin(t * 3) : 0))
    const run = S.run
    if (run) {
      run.f += dt / RUN_SECONDS
      run.d = Math.min(ROUTE_KM, run.f * ROUTE_KM)
      const db = lossAt(run.d, run.rep)
      const b = run.rep ? 0.45 + 0.55 * (1 - db / (SPAN * LOSS)) : clamp(1 - db / DEAD_DB)
      routeAt(run.f, q)
      pulse.position.set(q.x, q.y, 0.05)
      pulseCore.material.opacity = 0.25 + 0.75 * b
      pulseHalo.material.opacity = 0.7 * b
      pulse.scale.setScalar(0.7 + 0.5 * b)
      if (!run.rep && db >= DEAD_DB) {
        run.lost = true
        S.run = null
        S.d = DEAD_DB / LOSS
        S.pin = true
        S.lostOnce = true
        play('tap')
        if (run.mine) later(0.1, () => say1(E.sea.says.lost, seaVars(DEAD_DB / LOSS)))
      } else if (run.f >= 1) {
        S.run = null
        S.d = ROUTE_KM
        S.pin = true
        S.arrived = S.arrived || run.rep
        play('discover')
        if (run.mine) later(0.1, () => say1(run.rep ? E.sea.says.arrive : E.sea.says.faded, seaVars(ROUTE_KM)))
      }
    } else {
      routeAt(S.d / ROUTE_KM, q)
      pulse.position.set(q.x, q.y, 0.05)
      pulse.visible = S.slid || S.pin
      const db = lossAt(S.d, S.rep)
      const b = S.rep ? 0.45 + 0.55 * (1 - db / (SPAN * LOSS)) : clamp(1 - db / DEAD_DB)
      pulseCore.material.opacity = 0.25 + 0.75 * b
      pulseHalo.material.opacity = 0.7 * b
      pulse.scale.setScalar(0.7 + 0.5 * b)
    }
    fort.dotM.material.emissiveIntensity = 0.9 + (S.run && S.run.f > 0.97 && S.run.rep ? 3 : 0)
    seaWait -= dt
    if (seaWait <= 0) {
      seaWait = 0.12
      seaBoard.set({ line: seaLine() })
    }
  })

  // -----------------------------------------------------------------------------------------------
  updates.push(dt => {
    for (const [id, s] of Object.entries(settleTimers)) {
      if (!s) continue
      s.t -= dt
      if (s.t <= 0) {
        settleTimers[id] = null
        s.fn()
      }
    }
  })

  const at3 = (g, x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))
  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.2 },
    spawn: { x: 0, z: 5.2, yaw: 0 },
    hostSpot: { x: 1.7, z: 4.3, yaw: Math.atan2(1.7, -0.8) },
    back: { x: 0, z: 9.1, rot: Math.PI },
    stand: { x: 3.7, z: 5.5, rot: -1.15 },
    panels: { stay: stayPanel, cable: cablePanel, sea: seaPanel },
    parts: {
      // what a tap does, for the probes (a real tap is `world.onTap(__ew.rayAt({ x, y }))`)
      tap: name =>
        ({
          laser: tapLaser,
          fibre: tapFibre,
          poly: () => tapLayer(0),
          steel: () => tapLayer(1),
          copper: () => tapLayer(2),
          gel: () => tapLayer(3),
          glass: () => tapLayer(4),
          repeater: tapRepeater,
          pump: tapPump,
          sines: tapSines,
          switch: tapSwitch,
          fortaleza: tapFort,
        })[name]?.(),
      stay: {
        get a() {
          return F.a
        },
        get ge() {
          return F.ge
        },
        get k() {
          return F.k
        },
        get arrived() {
          return R.arrived
        },
        get bounces() {
          return R.bounces
        },
        get sent() {
          return F.sent
        },
        get got() {
          return F.got
        },
        set: (v = {}) => {
          if (v.a != null) F.a = v.a
          if (v.ge != null) F.ge = v.ge
          if (v.k != null) F.k = v.k
          share('stay')
        },
        at: name => ({ laser: at3(fib, -0.7, 0, 0.15), fibre: at3(fib, 2.6, FIB.R * 0.9, FIB.R * 0.4) })[name],
      },
      cable: {
        get open() {
          return [...C.open]
        },
        get lid() {
          return C.lid
        },
        get pump() {
          return C.pump
        },
        at: name => ({ poly: at3(cab, 0.5, 0.2, 0.05), steel: at3(cab, 0.385, 0, 0.05), copper: at3(cab, 0, 0.28, 0.05), glass: at3(cab, 0.06, 0, 0.45), repeater: at3(rep, 0, REP.r * 0.8, REP.r * 0.5), pump: at3(inner, pump.position.x, pump.position.y + 0.12, 0) })[name],
      },
      sea: {
        get rep() {
          return S.rep
        },
        get d() {
          return S.d
        },
        get n() {
          return S.n
        },
        get running() {
          return !!S.run
        },
        get arrived() {
          return S.arrived
        },
        at: name => ({ sines: at3(slope, route[0].x, route[0].y, 0.1), switch: at3(sw, 0, 0, 0.2), fortaleza: at3(slope, route[route.length - 1].x, route[route.length - 1].y, 0.1) })[name],
      },
    },
    shared: {
      stay: {
        get: () => ({ a: Math.round(F.a * 10) / 10, ge: Math.round(F.ge * 10) / 10, k: Math.round(F.k * 1000) / 1000, n: F.n }),
        set: (s, live) => {
          F.a = clamp(Number(s?.a) || 0, 0, 8)
          F.ge = clamp(Number(s?.ge) || 0, 0, 6)
          F.k = clamp(Number(s?.k) || 0, 0, KMAX)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (live && n === F.n + 1) fireFlash(false)
          F.n = n
          if (!live) {
            F.kShown = F.k
            lastKey = ''
          }
        },
      },
      cable: {
        get: () => ({ l: C.open.map(v => (v ? 1 : 0)), lid: C.lid, pump: C.pump }),
        set: (s, live) => {
          const l = Array.isArray(s?.l) ? s.l : []
          C.open = LAYERS.map((_, i) => !!l[i])
          C.lid = !!s?.lid
          C.pump = s?.pump !== false
          if (!live) {
            C.shown = C.open.map(v => (v ? 1 : 0))
            C.lidK = C.lid ? 1 : 0
            C.pumpK = C.pump ? 1 : 0
          }
        },
      },
      sea: {
        get: () => ({ rep: S.rep, d: Math.round(S.d), n: S.n }),
        set: (s, live) => {
          S.rep = !!s?.rep
          S.d = clamp(Number(s?.d) || 0, 0, ROUTE_KM)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (live && n === S.n + 1 && !S.run) startRun(false)
          S.n = n
          if (!live) S.repK = S.rep ? 1 : 0
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      stage.update(t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const g of [cladTube.geo, coreTube.geo, tapTube.geo]) g.dispose()
    },
  }
}
