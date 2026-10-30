// Sodium's picture "Why is the sea salty?" as a room (docs/knowledge/picture-rooms.md): Aveiro's salt pans
// on a bright, windy afternoon (stages/saltpan.js). Shallow pans in low clay walls all round, shining heaps
// of salt, a canal across the back with a moliceiro moored in it, the lagoon and the sea beyond, flamingos
// in a far pan, gulls overhead; in the pool in front, as in the picture, big Na+ (violet) and Cl− (green)
// ions bob while water molecules rise. Three things to do, each step chosen by tapping its thing (the
// user, 2026-10-30), the prompt naming the next tap, E opening the station's panel whose buttons (and a
// slider) do the same:
// - where the salt comes from: a landscape model on a table. Tap the cloud: it rains, violet sodium washes
//   out of the mountains and the river carries it to the sea; tap the volcano: green chloride; tap the sun:
//   water rises as vapour into the cloud, the salt stays and the sea grows saltier. A meter shows the sea's
//   salt, Na+, Cl− and the rest, up to today's 35 g/kg; then it holds (as much leaves as comes in);
// - the salt pans: tap the sluice gate to let seawater from the canal into the reservoir, the next gates to
//   move the brine on; the sun-and-wind slider dries it; a board shows the salt in the water and what has
//   come out (calcium carbonate at half the water gone, gypsum at four fifths, sodium chloride at nine
//   tenths); on a hot, windy day a crust of flor de sal floats in the last pan: tap the skimmer;
// - the marnoto's rake: tap it to draw the salt across the crystalliser into a ridge and onto a heap; each
//   tap grows the heap, three heaps and the salt is carried away.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes; parts.rayTo(name) aims a real tap.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, at, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { saltpanStage } from '../../stages/saltpan.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { SALT_WORDS } from './salt.words.js'

export const WORDS = SALT_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
// the game's colours for the ions (the boards and the Periodic Videos lab): sodium violet, chloride green
const NA = '#ab5cf2'
const CL = '#31d843'

// ---- where things stand (metres; the spawn at z = 5 looks along -z, into the picture) ----
const CANAL = { z: -9.8, width: 1.6 }
const TABLE = { x: -5.6, z: -1.3, w: 2.8, d: 1.5, top: 0.86 }
// the three ponds side by side across the view (a receding row hid the far ones from a standing eye),
// fed from the canal by a channel into the first; the brine moves left to right
const PONDS = [
  { x: -1.1, z: -4.0, w: 2.4, d: 1.8, deep: 0.1, alpha: 0.8 },
  { x: 1.6, z: -4.0, w: 2.4, d: 1.8, deep: 0.075, alpha: 0.66 },
  { x: 4.2, z: -4.0, w: 2.2, d: 1.8, deep: 0.055, alpha: 0.52 },
]
const CHANNEL = { x: -1.1, w: 0.7, z0: -9.0, z1: -5.18 }
// the gates: the channel's into the first pond, then one in each wall between the ponds (turned across it)
const GATES = [{ x: -1.1, z: -5.04, rot: 0 }, { x: 0.25, z: -4.0, rot: Math.PI / 2 }, { x: 2.95, z: -4.0, rot: Math.PI / 2 }]
const RPAN = { x: 7.6, z: -1.7, w: 3.0, d: 2.0 }
// the marnoto's heaps on the clay behind the crystalliser, seen across it
const HEAPS = [V3(6.75, 0, -4.15), V3(8.35, 0, -4.25), V3(9.9, 0, -3.75)]
const POOL = { x: -1.3, z: -1.0, w: 2.2, d: 1.4 }
// pans on the platform that are only to look at: [x, z, width, depth], clear of the paths and stations
const DECOR = [
  [-6.6, 3.7, 3.2, 2.1], [-6.1, 6.9, 3.0, 1.9], [-9.9, -0.4, 2.0, 2.6],
  [5.7, 3.9, 2.8, 1.9], [6.1, 7.0, 2.8, 1.7], [9.7, 3.1, 2.0, 2.3],
  [-4.6, -6.2, 2.6, 1.8], [6.4, -8.0, 2.4, 1.4],
]
// the pans stand on the platform: their floor just above it, their clay rims rising round them
const FLOOR_Y = 0.006
const POOL_Y = 0.09
const RIM = { h: 0.19, w: 0.28 }

// ---- the sea's model: salt per kilogram of today's sea (reference composition) ----
const NA_MAX = 10.8
const CL_MAX = 19.4
const OTHER_MAX = 4.8
const NA_RAIN = 3.6
const CL_PUFF = 6.5
const OTHER_RAIN = 1.6
const GRAINS = 18 // grains of each ion in the tank when the sea is as salty as today

// ---- the brine: water gone (0..1) per pond, how fast it dries at full sun and wind ----
const CAP = [0, 0.55, 0.86, 0.96]
const RATE = [0, 0.1, 0.1, 0.06]
/** Salt dissolved in the brine (g/kg) when a share `g` of seawater's water has gone; it holds near
 *  saturation once sodium chloride crystallises. */
const salinity = g => Math.min(310, (1000 * 35) / (35 + 965 * (1 - g)))

/** Water molecules (a red oxygen, two white hydrogens) rising and fading: the picture's vapour. */
function vapour(root, { max, r, light }) {
  const n = light ? Math.ceil(max / 2) : max
  const O = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 12, 8), new THREE.MeshStandardMaterial({ color: '#e0392b', roughness: 0.4, emissive: '#5a0c06', emissiveIntensity: 0.4 }), n)
  const H = new THREE.InstancedMesh(new THREE.SphereGeometry(r * 0.62, 10, 6), new THREE.MeshStandardMaterial({ color: '#d9dde0', roughness: 0.4 }), n * 2)
  O.count = 0
  H.count = 0
  O.frustumCulled = H.frustumCulled = false
  root.add(O, H)
  const list = []
  const o = new THREE.Object3D()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const off = new THREE.Vector3()
  // the H-O-H angle, 104.5°
  const hx = Math.sin(0.912) * r * 1.25
  const hy = Math.cos(0.912) * r * 1.25
  return {
    emit(p, v, life) {
      if (list.length < n) list.push({ p: p.clone(), v: v.clone(), age: 0, life, spin: Math.random() * TAU, ax: Math.random() * TAU })
    },
    get count() {
      return list.length
    },
    update(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        const m = list[i]
        m.age += dt
        m.p.addScaledVector(m.v, dt)
        m.spin += dt * 1.6
        if (m.age > m.life) list.splice(i, 1)
      }
      O.count = list.length
      H.count = list.length * 2
      list.forEach((m, i) => {
        const k = Math.min(1, m.age / 0.3) * Math.min(1, (m.life - m.age) / 0.5)
        e.set(m.ax, m.spin, 0.3)
        q.setFromEuler(e)
        o.quaternion.copy(q)
        o.position.copy(m.p)
        o.scale.setScalar(Math.max(0.001, k))
        o.updateMatrix()
        O.setMatrixAt(i, o.matrix)
        for (const [j, s] of [[0, 1], [1, -1]]) {
          off.set(s * hx, hy, 0).applyQuaternion(q).multiplyScalar(k)
          o.position.copy(m.p).add(off)
          o.updateMatrix()
          H.setMatrixAt(i * 2 + j, o.matrix)
        }
      })
      O.instanceMatrix.needsUpdate = true
      H.instanceMatrix.needsUpdate = true
    },
  }
}

/** A sign (+ or −) drawn white on a disc of the ion's colour, for a sprite on a big ion's face. */
function signTex(sign, color) {
  return canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w)
    g.fillStyle = color
    g.beginPath()
    g.arc(w / 2, w / 2, w * 0.36, 0, TAU)
    g.fill()
    g.fillStyle = '#ffffff'
    const t = w * 0.09
    g.fillRect(w * 0.27, w / 2 - t / 2, w * 0.46, t)
    if (sign === '+') g.fillRect(w / 2 - t / 2, w * 0.27, t, w * 0.46)
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, light, level, color, clickable }) {
  const stage = saltpanStage({ radius: 12, light, canal: CANAL })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const tmpC = new THREE.Color()
  const wood = new THREE.MeshStandardMaterial({ color: '#7a5636', roughness: 0.8 })
  const darkWood = new THREE.MeshStandardMaterial({ color: '#4e3523', roughness: 0.85 })
  const saltMat = stage.mats.salt
  const clayWall = stage.mats.wall
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const naMat = new THREE.MeshStandardMaterial({ color: NA, roughness: 0.35, emissive: '#3a1660', emissiveIntensity: 0.5 })
  const clMat = new THREE.MeshStandardMaterial({ color: CL, roughness: 0.35, emissive: '#0b4a12', emissiveIntensity: 0.45 })
  const rnd = random(959)

  // a canvas board on posts (the sea's meter, the brine's readout)
  const board = (w, h, pxW, pxH, draw) => {
    const tex = canvasTex(pxW, pxH, draw, { mipmaps: true })
    textures.push(tex)
    const g = new THREE.Group()
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.28 }))
    face.position.z = 0.03
    const back = new THREE.Mesh(new RoundedBoxGeometry(w + 0.08, h + 0.08, 0.05, 2, 0.015), darkWood)
    g.add(back, face)
    return { group: g, tex }
  }
  const font = (px, face = 'Outfit', weight = 700) => `${weight} ${px}px ${face}`
  /** Text drawn to fit a width (smaller rather than cut). */
  const fitText = (g, text, x, y, maxW, px, face = 'Outfit') => {
    let s = px
    g.font = font(s, face)
    while (g.measureText(text).width > maxW && s > 12) {
      s -= 2
      g.font = font(s, face)
    }
    g.fillText(text, x, y)
  }
  const roundRect = (g, x, y, w, h, r) => {
    g.beginPath()
    g.moveTo(x + r, y)
    g.arcTo(x + w, y, x + w, y + h, r)
    g.arcTo(x + w, y + h, x, y + h, r)
    g.arcTo(x, y + h, x, y, r)
    g.arcTo(x, y, x + w, y, r)
    g.closePath()
  }

  // ======== the picture's front pool: big ions bobbing, water rising ========
  const vapourBig = vapour(root, { max: 60, r: 0.045, light })
  const ions = []
  {
    const P = POOL
    const rim = []
    const t = RIM.w
    rim.push([P.x, P.z - P.d / 2 - t / 2, P.w + 2 * t, t], [P.x, P.z + P.d / 2 + t / 2, P.w + 2 * t, t], [P.x - P.w / 2 - t / 2, P.z, t, P.d], [P.x + P.w / 2 + t / 2, P.z, t, P.d])
    for (const [x, z, w, d] of rim) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, RIM.h, d), clayWall)
      m.position.set(x, RIM.h / 2, z)
      m.receiveShadow = true
      root.add(m)
    }
    const water = new THREE.Mesh(new THREE.PlaneGeometry(P.w, P.d).rotateX(-Math.PI / 2), stage.water({ tint: '#47aeb9' }))
    water.position.set(P.x, POOL_Y, P.z)
    root.add(water)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(P.w, P.d).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6b5541', roughness: 1 }))
    floor.position.set(P.x, FLOOR_Y, P.z)
    root.add(floor)
    solids.push(box(P.x, P.z, P.w + 2 * t, P.d + 2 * t))
    const signs = { '+': signTex('+', NA), '−': signTex('−', CL) }
    textures.push(signs['+'], signs['−'])
    for (const [dx, dz, el] of [[-0.7, -0.25, 'Na'], [0.15, 0.3, 'Cl'], [0.75, -0.3, 'Na'], [-0.2, -0.38, 'Cl'], [-0.75, 0.38, 'Cl']]) {
      const r = el === 'Na' ? 0.13 : 0.19
      const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), el === 'Na' ? naMat : clMat)
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: el === 'Na' ? signs['+'] : signs['−'], depthWrite: false }))
      sp.scale.setScalar(r * 1.05)
      root.add(ball, sp)
      ions.push({ ball, sp, r, x: P.x + dx, z: P.z + dz, ph: rnd() * TAU })
    }
  }
  const toCam = new THREE.Vector3()
  let poolEmit = 0
  updates.push((dt, t) => {
    for (const io of ions) {
      io.ball.position.set(io.x + Math.sin(t * 0.5 + io.ph) * 0.05, POOL_Y + io.r * 0.2 + Math.sin(t * 1.3 + io.ph) * 0.02, io.z + Math.cos(t * 0.4 + io.ph) * 0.05)
      io.ball.rotation.y = t * 0.3 + io.ph
      toCam.copy(ctx.camera.position).sub(io.ball.position).normalize()
      io.sp.position.copy(io.ball.position).addScaledVector(toCam, io.r * 1.02)
    }
    // water rising from the pool, as the picture draws it
    poolEmit += dt * (0.5 + stage.wind * 1.2)
    while (poolEmit > 1) {
      poolEmit -= 1
      vapourBig.emit(V3(POOL.x + (rnd() - 0.5) * POOL.w * 0.8, POOL_Y, POOL.z + (rnd() - 0.5) * POOL.d * 0.8), V3(0.15 + stage.wind * 0.4, 0.45 + rnd() * 0.2, 0), 4.5)
    }
  })

  // ======== more pans on the platform: paths of clay between them, as in a real salina ========
  {
    const rims = []
    const floors = []
    const waters = []
    const colours = ['#3ba3b6', '#47b0bb', '#7cc7bf', '#94d0c2', '#3399b0', '#a4d6c6', '#5cbabc', '#3ba3b6', '#94d0c2']
    const t = RIM.w
    DECOR.forEach(([x, z, w, d], i) => {
      for (const [rx, rz, rw, rd] of [[x, z - d / 2 - t / 2, w + 2 * t, t], [x, z + d / 2 + t / 2, w + 2 * t, t], [x - w / 2 - t / 2, z, t, d], [x + w / 2 + t / 2, z, t, d]]) {
        rims.push(new THREE.BoxGeometry(rw, RIM.h, rd).translate(rx, RIM.h / 2, rz))
      }
      floors.push(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(x, FLOOR_Y, z))
      const g = new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(x, POOL_Y - 0.01 + (i % 3) * 0.01, z)
      const c = new THREE.Color(colours[i % colours.length])
      const arr = new Float32Array(g.attributes.position.count * 3)
      for (let k = 0; k < arr.length; k += 3) arr.set([c.r, c.g, c.b], k)
      g.setAttribute('aTint', new THREE.BufferAttribute(arr, 3))
      waters.push(g)
      solids.push(box(x, z, w + 2 * t, d + 2 * t))
    })
    const rimMesh = new THREE.Mesh(mergeGeometries(rims), clayWall)
    rimMesh.receiveShadow = true
    rimMesh.castShadow = true
    const floorMesh = new THREE.Mesh(mergeGeometries(floors), new THREE.MeshStandardMaterial({ color: '#6b5541', roughness: 1 }))
    const waterMesh = new THREE.Mesh(mergeGeometries(waters), stage.water({ perVertex: true }))
    for (const g of [...rims, ...floors, ...waters]) g.dispose()
    root.add(rimMesh, floorMesh, waterMesh)
  }

  // ======== scenery: the picture's big heaps, the canal's moliceiro, flamingos, a pennant ========
  const sparkPos = []
  const heapGeo = new THREE.ConeGeometry(1, 1, 11, 3)
  {
    // a big heap with a rake leaning on it (the picture's left), two more toward the back
    for (const [x, z, h, rr] of [[-9.3, -4.7, 1.7, 1.15], [-7.3, -8.0, 1.15, 0.85], [9.0, -6.4, 1.4, 1.0]]) {
      const m = new THREE.Mesh(heapGeo, saltMat)
      m.scale.set(rr, h, rr)
      m.position.set(x, h / 2, z)
      m.castShadow = true
      m.receiveShadow = true
      root.add(m)
      solids.push(circle(x, z, rr * 0.9))
      for (let i = 0; i < 26; i++) {
        const a = rnd() * TAU
        const y = rnd() * h * 0.9
        const rad = rr * (1 - y / h) + 0.01
        sparkPos.push(x + Math.cos(a) * rad, y, z + Math.sin(a) * rad)
      }
    }
    const lean = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.9, 8), wood)
    pole.position.y = 1.45
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.035), wood)
    head.position.y = 0.05
    lean.add(pole, head)
    lean.position.set(-8.2, 0, -3.95)
    lean.rotation.set(-0.38, 0.6, 0.05)
    root.add(lean)
  }
  // the moliceiro: a long, low lagoon boat with a tall curled bow and painted panels, moored in the canal
  const boat = new THREE.Group()
  {
    const L = 11
    const half = L / 2
    const hullMat = new THREE.MeshStandardMaterial({ color: '#3a2f2a', roughness: 0.7 })
    const side = new THREE.Shape()
    side.moveTo(-half + 0.6, 0)
    side.lineTo(half - 0.8, 0)
    side.quadraticCurveTo(half - 0.1, 0.05, half, 0.75)
    side.lineTo(half - 0.25, 0.75)
    side.quadraticCurveTo(half - 0.45, 0.42, half - 1.2, 0.42)
    side.lineTo(-half + 1.4, 0.42)
    side.quadraticCurveTo(-half + 0.55, 0.45, -half + 0.3, 0.9)
    side.lineTo(-half + 0.1, 0.9)
    side.quadraticCurveTo(-half + 0.1, 0.25, -half + 0.6, 0)
    const hullGeo = new THREE.ExtrudeGeometry(side, { depth: 1.6, bevelEnabled: false, curveSegments: 10 })
    hullGeo.translate(0, 0, -0.8)
    // taper the beam toward bow and stern
    const pos = hullGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const k = clamp((half - Math.abs(x)) / 2.6)
      pos.setZ(i, pos.getZ(i) * (0.12 + 0.88 * Math.sqrt(k)))
    }
    hullGeo.computeVertexNormals()
    const hull = new THREE.Mesh(hullGeo, hullMat)
    hull.castShadow = true
    boat.add(hull)
    // the swan-neck bow, curling up and back
    const neck = new THREE.Shape()
    neck.moveTo(-half + 0.1, 0.85)
    neck.quadraticCurveTo(-half - 0.45, 1.7, -half - 0.15, 2.45)
    neck.quadraticCurveTo(-half + 0.05, 2.8, -half + 0.35, 2.55)
    neck.lineTo(-half + 0.25, 2.45)
    neck.quadraticCurveTo(-half + 0.02, 2.62, -half - 0.02, 2.4)
    neck.quadraticCurveTo(-half - 0.25, 1.75, -half + 0.32, 0.88)
    const neckGeo = new THREE.ExtrudeGeometry(neck, { depth: 0.12, bevelEnabled: false, curveSegments: 12 })
    neckGeo.translate(0, 0, -0.06)
    // dark faces, a yellow edge
    boat.add(new THREE.Mesh(neckGeo, [hullMat, new THREE.MeshStandardMaterial({ color: '#e0b63a', roughness: 0.6 })]))
    // the painted panels on the bow's sides: bright colours, a sun, a flower, stripes (no words)
    const paint = canvasTex(512, 160, (g, w, h) => {
      g.fillStyle = '#f0c63e'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#c8362b'
      g.fillRect(0, 0, w, 16)
      g.fillRect(0, h - 16, w, 16)
      g.fillStyle = '#2b62b0'
      g.fillRect(0, 16, w, 8)
      g.fillRect(0, h - 24, w, 8)
      // a sun
      g.fillStyle = '#e8541f'
      g.beginPath()
      g.arc(90, h / 2, 34, 0, TAU)
      g.fill()
      g.strokeStyle = '#e8541f'
      g.lineWidth = 6
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU
        g.beginPath()
        g.moveTo(90 + Math.cos(a) * 42, h / 2 + Math.sin(a) * 42)
        g.lineTo(90 + Math.cos(a) * 56, h / 2 + Math.sin(a) * 56)
        g.stroke()
      }
      // a flower
      g.fillStyle = '#2f8f4a'
      g.fillRect(250, h / 2, 6, 50)
      g.fillStyle = '#d23a7a'
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU
        g.beginPath()
        g.ellipse(253 + Math.cos(a) * 20, h / 2 - 6 + Math.sin(a) * 20, 14, 9, a, 0, TAU)
        g.fill()
      }
      g.fillStyle = '#f7e9a8'
      g.beginPath()
      g.arc(253, h / 2 - 6, 10, 0, TAU)
      g.fill()
      // a boat on waves
      g.strokeStyle = '#2b62b0'
      g.lineWidth = 5
      for (let k = 0; k < 3; k++) {
        g.beginPath()
        for (let x = 330; x < 490; x += 4) g.lineTo(x, h / 2 + 34 + Math.sin(x * 0.12 + k) * 5 - k * 2)
        g.stroke()
      }
      g.fillStyle = '#2b2523'
      g.beginPath()
      g.moveTo(350, h / 2 + 18)
      g.lineTo(470, h / 2 + 18)
      g.lineTo(450, h / 2 + 32)
      g.lineTo(370, h / 2 + 32)
      g.closePath()
      g.fill()
    })
    textures.push(paint)
    const panelMat = new THREE.MeshStandardMaterial({ map: paint, roughness: 0.6 })
    for (const s of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.34), panelMat)
      p.position.set(-half + 2.6, 0.24, s * 0.812)
      p.rotation.y = s > 0 ? 0 : Math.PI
      boat.add(p)
      // a red band along the side
      const band = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.07), new THREE.MeshStandardMaterial({ color: '#c8362b', roughness: 0.6 }))
      band.position.set(0.6, 0.36, s * 0.812)
      band.rotation.y = s > 0 ? 0 : Math.PI
      boat.add(band)
    }
    // moored clear of the channel's mouth
    boat.position.set(5.2, -0.32, CANAL.z)
    root.add(boat)
  }
  updates.push((dt, t) => {
    boat.position.y = -0.32 + Math.sin(t * 0.9) * 0.025
    boat.rotation.z = Math.sin(t * 0.7) * 0.012
  })
  // flamingos wading in a far pan
  {
    const pink = new THREE.MeshStandardMaterial({ color: '#e59aa5', roughness: 0.8 })
    const dark = new THREE.MeshStandardMaterial({ color: '#2a2224', roughness: 0.6 })
    const legMat = new THREE.MeshStandardMaterial({ color: '#d1747f', roughness: 0.8 })
    for (const [x, z, rot, down] of [[-15.5, -16.5, 0.6, false], [-14.2, -17.4, 2.2, true], [-16.8, -18.2, 1.2, false], [-13.4, -15.8, -0.4, true]]) {
      const f = new THREE.Group()
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), pink)
      body.scale.set(1.4, 0.8, 0.8)
      body.position.y = 0.95
      const neckPts = down
        ? [V3(0.24, 0.98, 0), V3(0.38, 1.15, 0), V3(0.45, 0.9, 0), V3(0.47, 0.45, 0), V3(0.5, 0.2, 0)]
        : [V3(0.24, 0.98, 0), V3(0.32, 1.2, 0), V3(0.24, 1.45, 0), V3(0.34, 1.68, 0)]
      const neck = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(neckPts), 16, 0.03, 6), pink)
      const tip = neckPts[neckPts.length - 1]
      const headM = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), pink)
      headM.position.copy(tip)
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 6), dark)
      beak.position.copy(tip).add(V3(0.07, -0.03, 0))
      beak.rotation.z = -1.9
      f.add(body, neck, headM, beak)
      for (const s of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 5), legMat)
        leg.position.set(-0.02, 0.45, s * 0.05)
        f.add(leg)
      }
      f.position.set(x, -0.06, z)
      f.rotation.y = rot
      root.add(f)
    }
  }
  // a pennant on a pole by the ponds: it shows the wind
  const flagGeo = new THREE.PlaneGeometry(1.0, 0.36, 12, 1)
  const flagBase = flagGeo.attributes.position.array.slice()
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 3.4, 8), darkWood)
    pole.position.set(4.75, 1.7, -7.9)
    root.add(pole)
    solids.push(circle(4.75, -7.9, 0.15))
    // a pennant: the far end narrow
    for (let i = 0; i < flagBase.length; i += 3) {
      const u = (flagBase[i] + 0.5) / 1.0
      flagBase[i] = u
      flagBase[i + 1] *= 1 - u * 0.85
    }
    const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color: '#c8362b', roughness: 0.7, side: THREE.DoubleSide }))
    flag.position.set(4.75, 3.2, -7.9)
    root.add(flag)
    updates.push((dt, t) => {
      const w = stage.wind
      const p = flagGeo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const u = flagBase[i * 3]
        p.setXYZ(i, u * (0.55 + 0.45 * w), flagBase[i * 3 + 1] - u * (1 - w) * 0.5, Math.sin(u * 6 - t * (3 + 9 * w)) * u * 0.12 * (0.3 + w))
      }
      p.needsUpdate = true
      flagGeo.computeVertexNormals()
    })
  }

  // ======== 1. where the salt comes from: a landscape model on a table ========
  const T = TABLE
  const model = new THREE.Group()
  model.position.set(T.x, T.top, T.z)
  root.add(model)
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(T.w, 0.07, T.d, 2, 0.02), wood)
    top.position.set(T.x, T.top - 0.035, T.z)
    top.castShadow = true
    root.add(top)
    for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, T.top - 0.07, 0.07), darkWood)
      leg.position.set(T.x + lx * (T.w / 2 - 0.1), (T.top - 0.07) / 2, T.z + lz * (T.d / 2 - 0.1))
      root.add(leg)
    }
    solids.push(box(T.x, T.z, T.w, T.d))
  }
  // the land: a low slab, green and brown, the mountains with violet flecks (the sodium in their rock)
  const LAND_TOP = 0.12
  const SEA = { x0: 0.62, x1: 1.36, z0: -0.66, z1: 0.66, floor: 0.012, level: 0.17 }
  {
    const landTex = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#7f8a52'
      g.fillRect(0, 0, w, h)
      const r2 = random(5)
      for (let i = 0; i < 260; i++) {
        g.fillStyle = r2() < 0.5 ? 'rgba(98,108,60,0.6)' : 'rgba(150,138,92,0.5)'
        g.beginPath()
        g.arc(r2() * w, r2() * h, 2 + r2() * 7, 0, TAU)
        g.fill()
      }
    })
    textures.push(landTex)
    const land = new THREE.Mesh(new THREE.BoxGeometry(2.0, LAND_TOP, 1.36), [clayWall, clayWall, new THREE.MeshStandardMaterial({ map: landTex, roughness: 1 }), clayWall, clayWall, clayWall])
    land.position.set(-0.4, LAND_TOP / 2, 0)
    land.receiveShadow = true
    model.add(land)
    // a beach where the land meets the sea
    const beach = new THREE.Mesh(new THREE.BoxGeometry(0.1, LAND_TOP - 0.02, 1.36), stage.mats.sand)
    beach.position.set(0.62, (LAND_TOP - 0.02) / 2, 0)
    model.add(beach)
  }
  const rockTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#857a70'
    g.fillRect(0, 0, w, w)
    const r2 = random(11)
    for (let i = 0; i < 500; i++) {
      const v = r2()
      g.fillStyle = v < 0.45 ? 'rgba(95,86,80,0.6)' : v < 0.85 ? 'rgba(170,160,150,0.5)' : 'rgba(171,92,242,0.9)'
      g.beginPath()
      g.arc(r2() * w, r2() * w, v < 0.85 ? 2 + r2() * 6 : 2 + r2() * 2.5, 0, TAU)
      g.fill()
    }
  })
  textures.push(rockTex)
  const rockMat = new THREE.MeshStandardMaterial({ map: rockTex, roughness: 0.95, flatShading: true })
  const PEAKS = [[-1.05, -0.32, 0.55, 0.34], [-0.66, -0.44, 0.42, 0.28], [-0.32, -0.36, 0.32, 0.25], [-0.98, 0.08, 0.3, 0.24]]
  for (const [x, z, h, r] of PEAKS) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 9, 2), rockMat)
    m.position.set(x, LAND_TOP + h / 2, z)
    m.rotation.y = x * 3
    m.castShadow = true
    model.add(m)
  }
  // the volcano: a dark cone with a glowing crater
  const VOL = { x: -1.16, z: 0.42, h: 0.3 }
  const volcano = new THREE.Group()
  {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.22, VOL.h, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#4a3b35', roughness: 0.95, side: THREE.DoubleSide }))
    cone.position.y = VOL.h / 2
    const crater = new THREE.Mesh(new THREE.CircleGeometry(0.048, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1c').multiplyScalar(1.6) }))
    crater.position.y = VOL.h - 0.02
    volcano.add(cone, crater)
    volcano.position.set(VOL.x, LAND_TOP, VOL.z)
    model.add(volcano)
  }
  const craterTop = () => V3(VOL.x, LAND_TOP + VOL.h, VOL.z)
  // the river, from the mountains' foot to the sea
  const riverCurve = new THREE.CatmullRomCurve3([V3(-0.5, 0, -0.12), V3(-0.28, 0, 0.06), V3(-0.02, 0, -0.06), V3(0.26, 0, 0.14), V3(0.52, 0, 0.06), V3(0.68, 0, 0.04)].map(p => p.setY(LAND_TOP + 0.004)))
  {
    const n = 60
    const pos = []
    const idx = []
    for (let i = 0; i <= n; i++) {
      const u = i / n
      const p = riverCurve.getPointAt(u)
      const tg = riverCurve.getTangentAt(u)
      const nx = -tg.z
      const nz = tg.x
      const w = 0.018 + 0.03 * u
      pos.push(p.x + nx * w, p.y, p.z + nz * w, p.x - nx * w, p.y, p.z - nz * w)
      if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const river = new THREE.Mesh(geo, stage.water({ tint: '#3f9fc0' }))
    model.add(river)
  }
  // the sea: a glass tank of water at the table's end, the salt's grains inside it
  const seaWaterMat = new THREE.MeshStandardMaterial({ color: '#6cc0de', transparent: true, opacity: 0.14, roughness: 0.2, depthWrite: false })
  const seaBody = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), seaWaterMat)
  const seaTop = new THREE.Mesh(new THREE.PlaneGeometry(SEA.x1 - SEA.x0, SEA.z1 - SEA.z0).rotateX(-Math.PI / 2), stage.water({ tint: '#3d9cc2', alpha: 0.22 }))
  seaBody.renderOrder = 1
  seaTop.renderOrder = 2
  model.add(seaBody, seaTop)
  {
    const glassMat = new THREE.MeshStandardMaterial({ color: '#d8eef2', transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide })
    const gw = SEA.x1 - SEA.x0
    const gd = SEA.z1 - SEA.z0
    const gh = 0.22
    for (const [w, d, x, z] of [[gw, 0.01, (SEA.x0 + SEA.x1) / 2, SEA.z0], [gw, 0.01, (SEA.x0 + SEA.x1) / 2, SEA.z1], [0.01, gd, SEA.x1, 0]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, gh, d), glassMat)
      m.position.set(x, gh / 2, z)
      m.renderOrder = 3
      model.add(m)
    }
    const floor = new THREE.Mesh(new THREE.BoxGeometry(gw, SEA.floor, gd), stage.mats.sand)
    floor.position.set((SEA.x0 + SEA.x1) / 2, SEA.floor / 2, 0)
    model.add(floor)
  }
  // the grains in the sea (instanced), each with its own place in the tank; they glow a little, to show
  // through the water and the glass
  const naGrainMat = new THREE.MeshStandardMaterial({ color: NA, roughness: 0.35, emissive: NA, emissiveIntensity: 0.55 })
  const clGrainMat = new THREE.MeshStandardMaterial({ color: CL, roughness: 0.35, emissive: CL, emissiveIntensity: 0.45 })
  const naGrains = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 12, 8), naGrainMat, GRAINS + 12)
  const clGrains = new THREE.InstancedMesh(new THREE.SphereGeometry(0.029, 12, 8), clGrainMat, GRAINS + 12)
  naGrains.frustumCulled = clGrains.frustumCulled = false
  naGrains.renderOrder = clGrains.renderOrder = 0
  model.add(naGrains, clGrains)
  const spotIn = r2 => V3(lerp(SEA.x0 + 0.06, SEA.x1 - 0.06, r2()), lerp(SEA.floor + 0.03, SEA.level - 0.03, r2()), lerp(SEA.z0 + 0.06, SEA.z1 - 0.06, r2()))
  const naSpots = Array.from({ length: GRAINS + 12 }, (_, i) => spotIn(random(100 + i)))
  const clSpots = Array.from({ length: GRAINS + 12 }, (_, i) => spotIn(random(300 + i)))
  // the travellers: grains on their way (from the rock along the river, or from the crater through the air)
  const naFly = new THREE.InstancedMesh(naGrains.geometry, naGrainMat, 12)
  const clFly = new THREE.InstancedMesh(clGrains.geometry, clGrainMat, 12)
  naFly.frustumCulled = clFly.frustumCulled = false
  naFly.count = clFly.count = 0
  model.add(naFly, clFly)
  // the cloud above the mountains: puffs; it grows with its water and darkens while it rains
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#d3dbe4', roughness: 1 })
  const cloud = new THREE.Group()
  for (const [x, y, z, r] of [[0, 0, 0, 0.16], [0.16, -0.02, 0.04, 0.12], [-0.16, -0.03, -0.02, 0.12], [0.07, 0.07, -0.05, 0.11], [-0.07, 0.05, 0.06, 0.1], [0.27, -0.05, -0.03, 0.08], [-0.26, -0.05, 0.03, 0.08]]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), cloudMat)
    m.position.set(x, y, z)
    m.scale.y = 0.78
    cloud.add(m)
  }
  const CLOUD_AT = V3(-0.72, 0.78, -0.22)
  cloud.position.copy(CLOUD_AT)
  model.add(cloud)
  // rain: short streaks falling from the cloud onto the mountains
  const RAIN_N = light ? 30 : 60
  const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.003, 0.003, 0.07, 4), new THREE.MeshBasicMaterial({ color: '#a9cbe8', transparent: true, opacity: 0.85 }), RAIN_N)
  rain.frustumCulled = false
  rain.count = 0
  const rainSeed = Array.from({ length: RAIN_N }, () => [rnd() - 0.5, rnd() - 0.5, rnd()])
  model.add(rain)
  // the sun above the sea, with a halo
  const sunHalo = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,240,190,0.6)')
    grd.addColorStop(1, 'rgba(255,220,150,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  textures.push(sunHalo)
  const SUN_AT = V3(1.0, 0.8, -0.42)
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd25e').multiplyScalar(1.6) }))
  sunBall.position.copy(SUN_AT)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunHalo, color: '#ffe7a0', transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.scale.setScalar(0.5)
  halo.position.copy(SUN_AT)
  model.add(sunBall, halo)
  // smoke from the volcano
  const smokeMat = new THREE.MeshStandardMaterial({ color: '#8d8a88', roughness: 1, transparent: true, opacity: 0.8, depthWrite: false })
  const smoke = Array.from({ length: 6 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), smokeMat)
    m.visible = false
    model.add(m)
    return m
  })
  // water rising from the sea to the cloud
  const vapourSmall = vapour(model, { max: 16, r: 0.018, light: false })
  // the meter: a board at the table's end
  const meterW = { title: E.sea.meter.title, unit: E.sea.meter.unit, today: E.sea.meter.today, other: E.sea.meter.other }
  let meterShown = { S: -1, na: -1, cl: -1, oth: -1 }
  const drawMeter = (g, w, h, m = { na: 0, cl: 0, oth: 0, S: 0 }) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#16224a'
    roundRect(g, 4, 4, w - 8, h - 8, 28)
    g.fill()
    g.strokeStyle = color
    g.lineWidth = 6
    g.stroke()
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#e8f4ff'
    fitText(g, meterW.title, w / 2, 58, w - 50, 46)
    g.fillStyle = '#ffe9a8'
    g.font = font(128)
    g.fillText(String(Math.round(m.S)), w / 2, 168)
    g.fillStyle = '#c8d6f0'
    fitText(g, meterW.unit, w / 2, 250, w - 50, 30, 'Nunito')
    // the bar: sodium, chloride and the rest, stacked, up to 45 g/kg
    const bx = 70
    const bw = 120
    const by0 = 300
    const by1 = 720
    const per = (by1 - by0) / 45
    g.fillStyle = '#0c1430'
    g.fillRect(bx, by0, bw, by1 - by0)
    let y = by1
    for (const [v, c] of [[m.na, NA], [m.cl, CL], [m.oth, '#9aa3b5']]) {
      const hh = v * per
      g.fillStyle = c
      g.fillRect(bx, y - hh, bw, hh)
      y -= hh
    }
    g.strokeStyle = '#8a97c4'
    g.lineWidth = 3
    g.strokeRect(bx, by0, bw, by1 - by0)
    // today's sea: a dashed line at 35
    const ty = by1 - 35 * per
    g.setLineDash([12, 8])
    g.strokeStyle = '#ffd166'
    g.lineWidth = 5
    g.beginPath()
    g.moveTo(bx - 16, ty)
    g.lineTo(bx + bw + 16, ty)
    g.stroke()
    g.setLineDash([])
    g.textAlign = 'left'
    g.fillStyle = '#ffd166'
    fitText(g, `35  ${meterW.today}`, bx + bw + 26, ty, w - (bx + bw + 40), 28, 'Nunito')
    // the legend
    const lx = bx + bw + 30
    for (const [i, [label, c]] of [['Na+', NA], ['Cl−', CL], [meterW.other, '#9aa3b5']].entries()) {
      const ly = 520 + i * 62
      g.fillStyle = c
      g.beginPath()
      g.arc(lx + 16, ly, 16, 0, TAU)
      g.fill()
      g.fillStyle = '#e8f4ff'
      fitText(g, label, lx + 44, ly, w - lx - 60, 34, i < 2 ? 'Outfit' : 'Nunito')
    }
  }
  const meter = board(0.62, 0.93, 512, 768, (g, w, h) => drawMeter(g, w, h))
  meter.group.position.set(T.x + T.w / 2 + 0.42, 1.28, T.z - 0.45)
  meter.group.rotation.y = -0.45
  root.add(meter.group)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.82, 8), darkWood)
    post.position.set(T.x + T.w / 2 + 0.42, 0.41, T.z - 0.48)
    root.add(post)
    solids.push(circle(T.x + T.w / 2 + 0.42, T.z - 0.48, 0.15))
  }

  // ---- the sea's state: salt per kilogram (sodium, chloride, the rest), the cloud's water ----
  const S1 = { na: 0, cl: 0, oth: 0, cw: 1, rains: 0, puffs: 0, suns: 0, resets: 0 }
  let seaAnim = null // { kind: 'rain' | 'volcano' | 'sun', t, units, grains }
  let seaMine = false
  let toldToday = false
  const seaW = () => 1 + 0.04 * (1 - S1.cw)
  const seaSalt = () => (S1.na + S1.cl + S1.oth) / seaW()
  const atToday = () => S1.na >= NA_MAX - 0.01 && S1.cl >= CL_MAX - 0.01
  const seaPanel = lv => ({
    title: E.sea.title,
    color,
    blocks: [{ buttons: ['cloud', 'volcano', 'sun', 'again'].map(k => ({ label: E.sea.buttons[k], onClick: () => seaStep(k) })) }, ...paras(E.sea.panel, lv)],
  })
  const seaDone = () => {
    seaMine = true
    ex.discover('sea', seaPanel, 2.8)
    share('sea')
  }
  const startSea = (kind, units = 1) => {
    // the grains that travel are drawn apart from the tank's, which shows them once they land
    const grains = kind === 'rain' ? Math.min(12, 6 * units) : kind === 'volcano' ? 6 : 0
    seaAnim = { kind, t: 0, units, grains, landed: false }
    play(kind === 'volcano' ? 'pop' : kind === 'sun' ? 'beam' : 'fizz', { order: 1.2 })
  }
  function seaStep(k) {
    const lv = level()
    if (seaAnim && k !== 'again') return say(at(W.busy, lv))
    if (k === 'cloud') {
      if (S1.cw < 0.5) return say(at(E.sea.says.empty, lv))
      const units = S1.cw
      const was = S1.na
      S1.na = Math.min(NA_MAX, S1.na + NA_RAIN * units)
      S1.oth = Math.min(OTHER_MAX, S1.oth + OTHER_RAIN * units)
      S1.cw = 0
      S1.rains++
      startSea('rain', units)
      say(at(was >= NA_MAX - 0.01 ? E.sea.says.steady : E.sea.says.rain, lv))
    } else if (k === 'volcano') {
      const was = S1.cl
      S1.cl = Math.min(CL_MAX, S1.cl + CL_PUFF)
      S1.puffs++
      startSea('volcano')
      say(at(was >= CL_MAX - 0.01 ? E.sea.says.steady : E.sea.says.volcano, lv))
    } else if (k === 'sun') {
      if (S1.cw >= 2) return say(at(E.sea.says.full, lv))
      S1.cw += 1
      S1.suns++
      startSea('sun')
      say(at(E.sea.says.sun, lv))
    } else if (k === 'again') {
      Object.assign(S1, { na: 0, cl: 0, oth: 0, cw: 1 })
      S1.resets++
      seaAnim = null
      toldToday = false
      play('tap')
      say(at(E.sea.says.again, lv))
    } else return
    seaDone()
  }
  ex.add({
    id: 'sea',
    x: T.x + 0.5,
    z: T.z + 1.95,
    radius: 2.1,
    manual: true,
    label: E.sea.label,
    // the next step, as a hint: the visitor does it by tapping its thing (E opens the panel)
    verb: () => {
      const H = E.sea.hints
      if (S1.cw < 0.5) return H.empty
      if (S1.na < NA_MAX - 0.01) return H.cloud
      if (S1.cl < CL_MAX - 0.01) return H.volcano
      return H.done
    },
    focus: { x: T.x + 0.1, y: T.top + 0.45, z: T.z - 0.1, size: 3.0 },
    act: () => ctx.showPanel(seaPanel),
  })
  const cloudHit = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), ghost)
  cloudHit.scale.set(1.3, 0.75, 0.9)
  cloud.add(cloudHit)
  const volcanoHit = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.45, 10), ghost)
  volcanoHit.position.y = 0.2
  volcano.add(volcanoHit)
  const sunHit = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), ghost)
  sunHit.position.copy(SUN_AT)
  model.add(sunHit)
  clickable(cloud, () => seaStep('cloud'))
  clickable(volcano, () => seaStep('volcano'))
  clickable(sunHit, () => seaStep('sun'))

  // where the travellers go: from the rock to the river's head, down the river, into the tank
  const rockSpots = Array.from({ length: 12 }, (_, i) => {
    const [x, z, h, r] = PEAKS[i % PEAKS.length]
    const a = (i * 2.4) % TAU
    const y = 0.25 + (i % 3) * 0.2
    return V3(x + Math.cos(a) * r * (1 - y) * 0.95, LAND_TOP + h * y, z + Math.sin(a) * r * (1 - y) * 0.95)
  })
  const riverHead = riverCurve.getPointAt(0)
  const fly = new THREE.Object3D()
  const p0 = new THREE.Vector3()
  const p1 = new THREE.Vector3()
  const counts = { na: 0, cl: 0 }
  function poseSea(dt, t) {
    const a = seaAnim
    const s = a?.t ?? 0
    // the tank: its level falls a little while the cloud holds more water
    const lvl = SEA.level * (0.92 + 0.08 * (seaW() - 0.96) / 0.08)
    seaBody.scale.set(SEA.x1 - SEA.x0 - 0.01, lvl - SEA.floor, SEA.z1 - SEA.z0 - 0.01)
    seaBody.position.set((SEA.x0 + SEA.x1) / 2, SEA.floor + (lvl - SEA.floor) / 2, 0)
    seaTop.position.set((SEA.x0 + SEA.x1) / 2, lvl, 0)
    // the tank's grains, less those still on their way
    const arriving = a && !a.landed ? a.grains : 0
    const naN = clamp(Math.round((S1.na / NA_MAX) * GRAINS) - (a?.kind === 'rain' ? arriving : 0), 0, GRAINS + 12)
    const clN = clamp(Math.round((S1.cl / CL_MAX) * GRAINS) - (a?.kind === 'volcano' ? arriving : 0), 0, GRAINS + 12)
    counts.na = naN
    counts.cl = clN
    naGrains.count = naN
    clGrains.count = clN
    for (const [mesh, spots, n] of [[naGrains, naSpots, naN], [clGrains, clSpots, clN]]) {
      for (let i = 0; i < n; i++) {
        const sp = spots[i]
        fly.position.set(sp.x + Math.sin(t * 0.6 + i) * 0.012, Math.min(sp.y, lvl - 0.025) + Math.sin(t * 0.9 + i * 1.7) * 0.006, sp.z + Math.cos(t * 0.5 + i) * 0.012)
        fly.scale.setScalar(1)
        fly.updateMatrix()
        mesh.setMatrixAt(i, fly.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
    // the cloud: its size follows its water; dark while it rains
    const cs = 0.62 + 0.24 * S1.cw + (a?.kind === 'sun' ? 0.24 * span(1.6, 2.8, s) - 0.24 : 0) + (a?.kind === 'rain' ? 0.24 * a.units * (1 - span(0.2, 2.2, s)) : 0)
    cloud.scale.setScalar(damp(cloud.scale.x, Math.max(0.5, cs), 4, dt))
    cloud.position.set(CLOUD_AT.x + Math.sin(t * 0.3) * 0.03, CLOUD_AT.y + Math.sin(t * 0.5) * 0.015, CLOUD_AT.z)
    const dark = a?.kind === 'rain' ? 1 - span(2.0, 2.6, s) : 0
    cloudMat.color.set('#d3dbe4').lerp(tmpC.set('#7c8796'), dark * span(0, 0.3, s))
    // the rain
    const raining = a?.kind === 'rain' && s < 2.3
    rain.count = raining ? RAIN_N : 0
    if (raining) {
      rainSeed.forEach(([u, v, ph], i) => {
        const f = (t * 1.8 + ph) % 1
        fly.position.set(cloud.position.x + u * 0.55, lerp(cloud.position.y - 0.08, LAND_TOP + 0.2, f), cloud.position.z + v * 0.45)
        fly.scale.setScalar(1)
        fly.updateMatrix()
        rain.setMatrixAt(i, fly.matrix)
      })
      rain.instanceMatrix.needsUpdate = true
    }
    // the sun: it glows harder while it lifts the water
    const shine = a?.kind === 'sun' ? Math.sin(Math.PI * span(0, 2.8, s)) : 0
    halo.scale.setScalar(0.5 + 0.35 * shine + Math.sin(t * 2) * 0.02)
    halo.material.opacity = 0.6 + 0.35 * shine
    // the volcano's smoke
    smoke.forEach((m, i) => {
      const f = a?.kind === 'volcano' ? clamp((s - i * 0.12) / 1.6) : 0
      m.visible = f > 0 && f < 1
      const c = craterTop()
      m.position.set(c.x + Math.sin(i * 2.1) * 0.05 * f, c.y + 0.05 + f * 0.45, c.z + Math.cos(i * 1.7) * 0.05 * f)
      m.scale.setScalar(0.6 + f * 1.8)
    })
    smokeMat.opacity = 0.75
    // the travellers
    naFly.count = 0
    clFly.count = 0
    if (a && a.kind === 'rain' && !a.landed) {
      naFly.count = a.grains
      for (let i = 0; i < a.grains; i++) {
        const d = i * 0.12
        const u = s - 0.9 - d
        const rock = rockSpots[i % rockSpots.length]
        const dest = naSpots[clamp(Math.round((S1.na / NA_MAX) * GRAINS) - a.grains + i, 0, GRAINS + 11)]
        if (u < 0) {
          p0.copy(rock)
          fly.scale.setScalar(u > -0.4 ? 1 : 0.001)
        } else if (u < 0.7) {
          p0.copy(rock).lerp(riverHead, ease(u / 0.7))
          fly.scale.setScalar(1)
        } else if (u < 2.3) {
          p0.copy(riverCurve.getPointAt(clamp((u - 0.7) / 1.6)))
          p0.y += 0.012
          p0.x += Math.sin(u * 9 + i) * 0.006
        } else {
          p1.copy(riverCurve.getPointAt(1))
          p0.copy(p1).lerp(dest, ease(clamp((u - 2.3) / 0.6)))
        }
        fly.position.copy(p0)
        fly.updateMatrix()
        naFly.setMatrixAt(i, fly.matrix)
      }
      naFly.instanceMatrix.needsUpdate = true
    }
    if (a && a.kind === 'volcano' && !a.landed) {
      clFly.count = a.grains
      for (let i = 0; i < a.grains; i++) {
        const u = clamp((s - 0.4 - i * 0.1) / 1.6)
        const dest = clSpots[clamp(Math.round((S1.cl / CL_MAX) * GRAINS) - a.grains + i, 0, GRAINS + 11)]
        const c = craterTop()
        p0.copy(c).lerp(dest, u)
        p0.y += Math.sin(Math.PI * u) * 0.75
        fly.position.copy(p0)
        fly.scale.setScalar(u > 0 ? 1 : 0.001)
        fly.updateMatrix()
        clFly.setMatrixAt(i, fly.matrix)
      }
      clFly.instanceMatrix.needsUpdate = true
    }
    // vapour from the tank while the sun works
    if (a?.kind === 'sun' && s > 0.2 && s < 2.2 && Math.random() < dt * 5) {
      const from = V3(lerp(SEA.x0 + 0.08, SEA.x1 - 0.08, Math.random()), lvl, lerp(SEA.z0 + 0.1, SEA.z1 - 0.1, Math.random()))
      const v = CLOUD_AT.clone().sub(from).multiplyScalar(1 / 1.9)
      vapourSmall.emit(from, v, 1.9)
    }
    vapourSmall.update(dt)
    // the meter, drawn again when its numbers change
    const m = { S: seaSalt(), na: S1.na / seaW(), cl: S1.cl / seaW(), oth: S1.oth / seaW() }
    if (Math.abs(m.S - meterShown.S) > 0.05 || Math.abs(m.na - meterShown.na) > 0.05 || Math.abs(m.cl - meterShown.cl) > 0.05) {
      meterShown = m
      meter.tex.userData.redraw((g, w, h) => drawMeter(g, w, h, m))
    }
  }
  updates.push((dt, t) => {
    if (seaAnim) {
      seaAnim.t += dt
      const end = seaAnim.kind === 'rain' ? 4.0 : seaAnim.kind === 'volcano' ? 2.6 : 2.9
      if (!seaAnim.landed && seaAnim.t >= end - 0.05) seaAnim.landed = true
      if (seaAnim.t >= end) seaAnim = null
    }
    poseSea(dt, t)
    // as salty as today's sea: told once, to whoever made it so
    if (!seaAnim && atToday() && !toldToday) {
      toldToday = true
      if (seaMine) say(at(E.sea.says.today, level()))
    }
  })
  const seaState = () => ({ ...S1 })
  const seaSet = (s, live) => {
    const n = {
      na: clamp(Number(s?.na) || 0, 0, NA_MAX),
      cl: clamp(Number(s?.cl) || 0, 0, CL_MAX),
      oth: clamp(Number(s?.oth) || 0, 0, OTHER_MAX),
      cw: clamp(Math.round(Number(s?.cw) || 0), 0, 2),
      rains: Math.max(0, Math.round(Number(s?.rains) || 0)),
      puffs: Math.max(0, Math.round(Number(s?.puffs) || 0)),
      suns: Math.max(0, Math.round(Number(s?.suns) || 0)),
      resets: Math.max(0, Math.round(Number(s?.resets) || 0)),
    }
    seaMine = false
    let kind = null
    let units = 1
    if (live && n.resets === S1.resets) {
      if (n.rains === S1.rains + 1) {
        kind = 'rain'
        units = Math.max(1, S1.cw)
      } else if (n.puffs === S1.puffs + 1) kind = 'volcano'
      else if (n.suns === S1.suns + 1) kind = 'sun'
    }
    Object.assign(S1, n)
    if (kind) startSea(kind, units)
    else seaAnim = null
    // a sea found as it stands has nothing new to tell
    toldToday = atToday()
  }

  // ======== 2. the salt pans: three ponds side by side, fed from the canal ========
  const pondParts = PONDS.map((P, k) => {
    const g = new THREE.Group()
    g.position.set(P.x, 0, P.z)
    root.add(g)
    const t = RIM.w
    for (const [x, z, w, d] of [[0, -P.d / 2 - t / 2, P.w + 2 * t, t], [0, P.d / 2 + t / 2, P.w + 2 * t, t], [-P.w / 2 - t / 2, 0, t, P.d], [P.w / 2 + t / 2, 0, t, P.d]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, RIM.h, d), clayWall)
      m.position.set(x, RIM.h / 2, z)
      m.receiveShadow = true
      g.add(m)
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(P.w, P.d).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6b5541', roughness: 1 }))
    floor.position.y = FLOOR_Y
    floor.receiveShadow = true
    g.add(floor)
    // what comes out on the floor: a film, a crust
    const film = new THREE.Mesh(new THREE.PlaneGeometry(P.w, P.d).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: k === 0 ? '#b3a68c' : k === 1 ? '#aeb0aa' : '#c3c8c6', roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }))
    film.position.y = FLOOR_Y + 0.003
    g.add(film)
    const mat = stage.water({ tint: '#3a9fb1', alpha: P.alpha })
    const water = new THREE.Mesh(new THREE.PlaneGeometry(P.w, P.d).rotateX(-Math.PI / 2), mat)
    water.renderOrder = 2
    g.add(water)
    solids.push(box(P.x, P.z, P.w + 2 * t, P.d + 2 * t))
    // its sign, on a stake behind it (clear of the channel and the board)
    const sign = new THREE.Group()
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 0.03), new THREE.MeshStandardMaterial({ color: '#b89464', roughness: 0.85 }))
    plank.position.y = 0.6
    const stake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), darkWood)
    stake.position.y = 0.3
    const label = makeText(E.pans.ponds[k], { size: 0.1, color: '#3b2a1c', maxWidth: 1.1 })
    label.position.set(0, 0.6, 0.02)
    sign.add(plank, stake, label)
    sign.position.set(k === 0 ? -P.w / 2 + 0.05 : k === 1 ? P.w / 2 - 0.35 : 0, 0, -P.d / 2 - 0.5)
    g.add(sign)
    return { P, g, water, mat, film, level: 0 }
  })
  // gypsum needles in the second pond, salt cubes in the third, flor de sal flakes on the third's surface
  const gyps = new THREE.InstancedMesh(new THREE.BoxGeometry(0.012, 0.012, 0.07), new THREE.MeshStandardMaterial({ color: '#c9c8c0', roughness: 0.6 }), light ? 60 : 140)
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.035, 0.035), new THREE.MeshStandardMaterial({ color: '#d4d8d6', roughness: 0.35 }), light ? 90 : 220)
  const flakes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.004, 0.07), new THREE.MeshStandardMaterial({ color: '#e2e5e3', roughness: 0.3, emissive: '#ffffff', emissiveIntensity: 0.08 }), light ? 70 : 160)
  for (const m of [gyps, cubes, flakes]) {
    m.frustumCulled = false
    m.count = 0
    root.add(m)
  }
  const scatter = (mesh, P, y, seed, rot) => {
    const r2 = random(seed)
    return Array.from({ length: mesh.instanceMatrix.count }, () => ({
      x: P.x + (r2() - 0.5) * (P.w - 0.12),
      z: P.z + (r2() - 0.5) * (P.d - 0.12),
      y: y + r2() * 0.004,
      rx: rot ? (r2() - 0.5) * 0.3 : 0,
      ry: r2() * TAU,
      s: 0.6 + r2() * 0.8,
      k: r2(),
    }))
  }
  const gypsSpots = scatter(gyps, PONDS[1], FLOOR_Y + 0.008, 21, true)
  const cubeSpots = scatter(cubes, PONDS[2], FLOOR_Y + 0.016, 22, true)
  const flakeSpots = scatter(flakes, PONDS[2], 0, 23, false)
  // the channel from the canal to the first pond, with its low clay banks
  {
    const C = CHANNEL
    const len = C.z1 - C.z0
    const water = new THREE.Mesh(new THREE.PlaneGeometry(C.w, len).rotateX(-Math.PI / 2), stage.water({ tint: '#2f8fa2' }))
    water.position.set(C.x, 0.05, (C.z0 + C.z1) / 2)
    root.add(water)
    for (const sx of [-1, 1]) {
      const bank = new THREE.Mesh(new THREE.BoxGeometry(0.16, RIM.h, len), clayWall)
      bank.position.set(C.x + sx * (C.w / 2 + 0.08), RIM.h / 2, (C.z0 + C.z1) / 2)
      root.add(bank)
    }
    solids.push(box(C.x, (C.z0 + C.z1) / 2, C.w + 0.32, len))
  }
  // the gates: a plank sliding up between two posts, a little wheel to turn; the first lets the channel in
  const gates = GATES.map(({ x, z, rot }, k) => {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.56, 0.07), darkWood)
      post.position.set(s * 0.38, 0.28, 0)
      g.add(post)
    }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.06, 0.08), darkWood)
    bar.position.y = 0.53
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.3, 0.04), wood)
    plank.position.y = 0.06
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 6), darkWood)
    spindle.position.y = 0.6
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.014, 6, 16).rotateX(Math.PI / 2), darkWood)
    wheel.position.y = 0.66
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.72, 0.45), ghost)
    hit.position.y = 0.36
    g.add(bar, plank, spindle, wheel, hit)
    g.position.set(x, 0, z)
    g.rotation.y = rot
    root.add(g)
    // the water running over the sill while it is open
    const stream = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5).rotateX(-Math.PI / 2), stage.water({ tint: '#47aeb9', alpha: 0.85 }))
    stream.position.set(x, RIM.h + 0.006, z)
    stream.rotation.y = rot
    stream.visible = false
    root.add(stream)
    return { g, plank, wheel, stream, k }
  })
  // the board behind the middle pond: the brine's salt, the water gone, what has come out
  const BW = E.pans.board
  const drawBoard = (g, w, h, s = { S: 0, pct: 0, has: [] }) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#16224a'
    roundRect(g, 4, 4, w - 8, h - 8, 26)
    g.fill()
    g.strokeStyle = color
    g.lineWidth = 6
    g.stroke()
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillStyle = '#e8f4ff'
    fitText(g, BW.title, w / 2, 52, w - 40, 44)
    g.textAlign = 'left'
    g.fillStyle = '#c8d6f0'
    fitText(g, BW.salt, 36, 108, w - 72, 30, 'Nunito')
    g.fillStyle = '#ffe9a8'
    g.font = font(62)
    g.fillText(s.on ? `${Math.round(s.S)} g/kg` : '', 36, 162)
    g.fillStyle = '#c8d6f0'
    fitText(g, BW.gone, 36, 222, w - 160, 30, 'Nunito')
    g.textAlign = 'right'
    g.fillStyle = '#ffe9a8'
    g.font = font(34)
    g.fillText(s.on ? `${s.pct}%` : '', w - 36, 222)
    g.fillStyle = '#0c1430'
    g.fillRect(36, 248, w - 72, 22)
    g.fillStyle = '#3fd6c6'
    g.fillRect(36, 248, ((w - 72) * s.pct) / 100, 22)
    // the marks where things come out: half, four fifths, nine tenths
    g.fillStyle = '#ffd166'
    for (const f of [0.5, 0.8, 0.9]) g.fillRect(36 + (w - 72) * f - 2, 242, 4, 34)
    g.textAlign = 'left'
    const rows = [['lime', '#d8cdb0'], ['gypsum', '#c8ccd0'], ['halite', '#ffffff'], ['flor', '#ffe9a8']]
    rows.forEach(([key, c], i) => {
      const y = 318 + i * 50
      const on = s.has.includes(key)
      g.fillStyle = on ? c : '#3a4566'
      g.beginPath()
      g.arc(50, y, 14, 0, TAU)
      g.fill()
      g.fillStyle = on ? '#e8f4ff' : '#66739a'
      fitText(g, BW[key], 78, y, w - 110, 32, 'Nunito')
    })
  }
  const readout = board(0.85, 0.85, 512, 512, (g, w, h) => drawBoard(g, w, h))
  const RB = { x: PONDS[1].x, z: PONDS[1].z - PONDS[1].d / 2 - 0.62, rot: 0 }
  readout.group.position.set(RB.x, 1.08, RB.z)
  readout.group.rotation.y = RB.rot
  root.add(readout.group)
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.06), darkWood)
    post.position.set(RB.x + s * 0.3 * Math.cos(RB.rot), 0.32, RB.z - s * 0.3 * Math.sin(RB.rot))
    root.add(post)
  }
  solids.push(circle(RB.x, RB.z, 0.4))
  // the skimmer: a round sieve on a long handle, resting by the last pond; the basket for the flor de sal
  const skimmer = new THREE.Group()
  const netTex = canvasTex(64, 64, (g, w) => {
    g.clearRect(0, 0, w, w)
    g.strokeStyle = '#d9cdb3'
    g.lineWidth = 2
    for (let i = 0; i <= w; i += 8) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i, w)
      g.moveTo(0, i)
      g.lineTo(w, i)
      g.stroke()
    }
  })
  textures.push(netTex)
  {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.7, 8).rotateZ(Math.PI / 2), wood)
    handle.position.x = 0.85 + 0.2
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 6, 24).rotateX(Math.PI / 2), darkWood)
    const net = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: netTex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }))
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.45), ghost)
    hit.position.x = 0.75
    skimmer.add(handle, ring, net, hit)
  }
  root.add(skimmer)
  // at rest the sieve lies on the near rim's left end, its handle along the rim
const SKIM_REST = { pos: V3(PONDS[2].x - PONDS[2].w / 2 + 0.1, RIM.h + 0.03, PONDS[2].z + PONDS[2].d / 2 + RIM.w / 2), ry: 0, rz: 0 }
  const basket = new THREE.Group()
  const basketFill = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 1, 18), new THREE.MeshStandardMaterial({ color: '#dfe2e0', roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.06 }))
  {
    const weave = canvasTex(128, 32, (g, w, h) => {
      g.fillStyle = '#8a6a3e'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#b08a52'
      for (let y = 0; y < h; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < w; x += 16) g.fillRect(x, y, 8, 6)
    }, { repeat: true })
    weave.repeat.set(3, 2)
    textures.push(weave)
    const side = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.26, 20, 1, true), new THREE.MeshStandardMaterial({ map: weave, roughness: 0.9, side: THREE.DoubleSide }))
    side.position.y = 0.13
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.18, 20).rotateX(-Math.PI / 2), darkWood)
    bottom.position.y = 0.01
    basketFill.visible = false
    basket.add(side, bottom, basketFill)
    basket.position.set(PONDS[2].x + PONDS[2].w / 2 + 0.15, 0, PONDS[2].z + PONDS[2].d / 2 + 0.72)
    root.add(basket)
    solids.push(circle(basket.position.x, basket.position.z, 0.24))
  }
  // water rising from the ponds while they dry
  let pondEmit = 0

  // ---- the brine: where it is (0 none, 1 to 3 the ponds), how much water has gone, the crust ----
  const S2 = { at: 0, gone: 0, dry: 0.6, crust: 0, fills: 0, flor: 0 }
  let flow = null // { from, to, t }: a gate open, the brine running through
  let skimAnim = null // { t }
  let pondMine = false
  let pondSaid = {}
  const FLOW_T = 1.9
  const SKIM_T = 2.6
  const pondsBusy = () => !!flow || !!skimAnim
  stage.setWeather(S2.dry)
  function advancePonds(dt) {
    if (S2.at > 0) S2.gone = Math.min(CAP[S2.at], S2.gone + RATE[S2.at] * S2.dry * dt)
    if (S2.at === 3 && S2.gone >= 0.9 && S2.dry >= 0.7) S2.crust = Math.min(1, S2.crust + (0.06 + (S2.dry - 0.7)) * dt)
    else if (S2.crust > 0) S2.crust = Math.max(0, S2.crust - 0.04 * dt)
  }
  const pondsPanel = lv => ({
    title: E.pans.title,
    color,
    blocks: [
      { slider: { label: E.pans.slider, min: 0, max: 1, step: 0.01, value: S2.dry, onInput: v => setDry(v), format: v => E.pans.weather[v < 0.35 ? 0 : v < 0.7 ? 1 : 2], live: () => S2.dry } },
      { buttons: [['sea', 'sea'], ['next', 'next'], ['skim', 'skim']].map(([k, step]) => ({ label: E.pans.buttons[k], onClick: () => pondStep(step) })) },
      ...paras(E.pans.panel, lv),
    ],
  })
  const pondsChanged = () => {
    pondMine = true
    ex.discover('pans', pondsPanel, 2.4)
    share('pans')
  }
  const startFlow = (from, to) => {
    flow = { from, to, t: 0 }
    play('fizz', { order: 1.4 })
  }
  function pondStep(step) {
    const lv = level()
    if (step === 'next') step = S2.at === 1 ? 'gate2' : S2.at === 2 ? 'gate3' : 'gate2'
    if (pondsBusy()) return say(at(W.busy, lv))
    if (step === 'sea') {
      if (S2.at === 1 || S2.at === 2) return say(at(E.pans.says.oneBatch, lv))
      const again = S2.fills > 0
      startFlow(0, 1)
      Object.assign(S2, { at: 1, gone: 0, crust: 0 })
      S2.fills++
      pondSaid = {}
      say(at(again ? E.pans.says.again : E.pans.says.sea, lv))
    } else if (step === 'gate2' || step === 'gate3') {
      const k = step === 'gate2' ? 2 : 3
      if (S2.at !== k - 1) return say(at(E.pans.says.noBrine, lv))
      startFlow(k - 1, k)
      S2.at = k
      say(at(E.pans.says[step], lv))
    } else if (step === 'skim') {
      if (S2.at !== 3 || S2.crust < 0.25) return say(at(E.pans.says.noflor, lv))
      skimAnim = { t: 0, crust: S2.crust }
      S2.crust = 0
      S2.flor++
      pondSaid.flor = false
      play('select')
      say(at(E.pans.says.skim, lv))
    } else return
    pondsChanged()
  }
  // the weather, from the slider (sent a few times a second, the last always)
  let drySend = null
  function setDry(v, now = false) {
    S2.dry = clamp(Math.round(v * 100) / 100)
    stage.setWeather(S2.dry)
    if (now) {
      pondsChanged()
      return
    }
    pondMine = true
    if (!drySend) {
      drySend = setTimeout(() => {
        drySend = null
        pondsChanged()
      }, 250)
    }
  }
  ex.add({
    id: 'pans',
    x: PONDS[1].x,
    z: PONDS[1].z + 3.1,
    radius: 2.1,
    manual: true,
    label: E.pans.label,
    verb: () => {
      const H = E.pans.hints
      if (S2.at === 0) return H.sea
      if (S2.at === 1) return S2.gone >= 0.5 ? H.gate2 : H.wait
      if (S2.at === 2) return S2.gone >= 0.8 ? H.gate3 : H.wait
      if (S2.crust >= 0.25) return H.skim
      if (S2.gone >= 0.9 && S2.dry < 0.7) return H.hot
      if (S2.gone >= CAP[3] - 0.005) return H.again
      return H.wait
    },
    focus: { x: PONDS[1].x + 0.3, y: 0.3, z: PONDS[1].z + 0.1, size: 5.0 },
    act: () => ctx.showPanel(pondsPanel),
  })
  gates.forEach((gt, k) => clickable(gt.g, () => pondStep(k === 0 ? 'sea' : k === 1 ? 'gate2' : 'gate3'), { reach: 10 }))
  clickable(skimmer, () => pondStep('skim'), { reach: 5 })
  // what happens, told by the Atomling to whoever made it happen (once a batch)
  const tellPond = key => {
    pondSaid[key] = true
    if (pondMine) say(at(E.pans.says[key], level()))
  }
  let boardShown = ''
  const tint = new THREE.Color()
  const TINTS = [[35, new THREE.Color('#3a9fb1')], [150, new THREE.Color('#6fbfba')], [310, new THREE.Color('#aed9cb')]]
  const tintFor = (S, out) => {
    if (S <= TINTS[1][0]) return out.copy(TINTS[0][1]).lerp(TINTS[1][1], (S - 35) / 115)
    return out.copy(TINTS[1][1]).lerp(TINTS[2][1], clamp((S - 150) / 160))
  }
  const o3 = new THREE.Object3D()
  function posePonds(dt, t) {
    const f = flow
    const s = f?.t ?? 0
    // each pond's water: full depth when the brine arrives, shallower as it dries; empty otherwise
    pondParts.forEach((pp, i) => {
      const k = i + 1
      let fill = 0
      if (S2.at === k) {
        const gin = k === 1 ? 0 : CAP[k - 1]
        fill = 0.25 + 0.75 * clamp((CAP[k] - S2.gone) / (CAP[k] - gin + 1e-6))
        fill = Math.max(fill, 0.25)
      }
      // a flow under way: the source empties, the target fills
      if (f) {
        const k1 = span(0.3, 1.6, s)
        if (f.to === k) fill *= k1
        if (f.from === k) fill = (1 - k1) * 0.3
      }
      pp.level = damp(pp.level, fill, 5, dt)
      pp.water.visible = pp.level > 0.02
      pp.water.position.y = FLOOR_Y + 0.004 + pp.P.deep * pp.level
      const S = S2.at === k || (f && f.from === k) ? salinity(S2.gone) : 35
      pp.mat.uniforms.uTint.value.copy(tintFor(S, tint))
    })
    // the deposits, from the batch's progress (a pond already passed keeps its own)
    const later = S2.fills > 1
    const limeK = S2.at >= 2 || later ? 1 : S2.at === 1 ? span(0.45, 0.55, S2.gone) : 0
    const gypK = S2.at === 3 || later ? 1 : S2.at === 2 ? span(0.78, 0.86, S2.gone) : 0
    const halK = S2.at === 3 ? span(0.89, 0.955, S2.gone) : 0
    pondParts[0].film.material.opacity = 0.75 * limeK
    pondParts[1].film.material.opacity = 0.55 * gypK
    pondParts[2].film.material.opacity = 0.65 * halK
    const place = (mesh, spots, k, scale) => {
      const n = Math.round(spots.length * k)
      mesh.count = n
      for (let i = 0; i < n; i++) {
        const sp = spots[i]
        o3.position.set(sp.x, sp.y, sp.z)
        o3.rotation.set(sp.rx, sp.ry, 0)
        o3.scale.setScalar(sp.s * scale)
        o3.updateMatrix()
        mesh.setMatrixAt(i, o3.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
    place(gyps, gypsSpots, gypK, 1)
    place(cubes, cubeSpots, halK, 0.6 + 0.6 * halK)
    // the flakes ride on the last pond's surface; the skimmer takes those it passes
    const skimX = skimAnim ? lerp(PONDS[2].x - PONDS[2].w / 2, PONDS[2].x + PONDS[2].w / 2 + 0.2, span(0.35, 1.5, skimAnim.t)) : -99
    const crustShown = skimAnim ? skimAnim.crust : S2.crust
    const yTop = pondParts[2].water.position.y + 0.003
    let nf = 0
    for (const sp of flakeSpots) {
      if (sp.k > crustShown) continue
      if (skimAnim && sp.x < skimX) continue
      o3.position.set(sp.x + Math.sin(t * 0.7 + sp.ry) * 0.01, yTop, sp.z)
      o3.rotation.set(0, sp.ry + t * 0.05, 0)
      o3.scale.setScalar(sp.s)
      o3.updateMatrix()
      flakes.setMatrixAt(nf++, o3.matrix)
    }
    flakes.count = nf
    flakes.instanceMatrix.needsUpdate = true
    // the gates: the plank up while the brine runs
    gates.forEach(gt => {
      const open = f && f.to === gt.k + 1 ? span(0, 0.3, s) * (1 - span(1.55, 1.85, s)) : 0
      gt.plank.position.y = 0.06 + 0.34 * open
      gt.wheel.rotation.z = open * 4
      gt.stream.visible = open > 0.3
    })
    // the skimmer: along the surface, up to the basket, back
    if (skimAnim) {
      const k = skimAnim.t
      const a = span(0, 0.35, k)
      const b = span(1.5, 1.95, k)
      const c = span(2.1, 2.6, k)
      const start = V3(PONDS[2].x - PONDS[2].w / 2 + 0.15, yTop + 0.02, PONDS[2].z)
      const end = V3(PONDS[2].x + PONDS[2].w / 2 - 0.25, yTop + 0.02, PONDS[2].z)
      const over = basket.position.clone().setY(0.55)
      const p = new THREE.Vector3()
      if (k < 0.35) p.copy(SKIM_REST.pos).lerp(start, a)
      else if (k < 1.5) p.copy(start).lerp(end, span(0.35, 1.5, k))
      else if (k < 2.1) p.copy(end).lerp(over, b)
      else p.copy(over).lerp(SKIM_REST.pos, c)
      skimmer.position.copy(p)
      // the handle turned toward the near side, slanting up over the rim
      skimmer.rotation.set(0, lerp(SKIM_REST.ry, -Math.PI / 2, a * (1 - c)), lerp(SKIM_REST.rz, 0.35, a * (1 - c)))
    } else {
      skimmer.position.copy(SKIM_REST.pos)
      skimmer.rotation.set(0, SKIM_REST.ry, SKIM_REST.rz)
    }
    // the basket's flor de sal
    const lvl = Math.min(5, S2.flor - (skimAnim && skimAnim.t < 2.0 ? 1 : 0))
    basketFill.visible = lvl > 0
    basketFill.scale.set(1, Math.max(0.01, lvl * 0.04), 1)
    basketFill.position.y = 0.01 + lvl * 0.02
    // vapour rising from the pond that holds the brine
    const P = S2.at > 0 ? PONDS[S2.at - 1] : null
    if (P && !f && S2.gone < CAP[S2.at] - 0.002) {
      pondEmit += dt * (0.6 + 4 * S2.dry)
      while (pondEmit > 1) {
        pondEmit -= 1
        vapourBig.emit(V3(P.x + (rnd() - 0.5) * P.w * 0.85, pondParts[S2.at - 1].water.position.y, P.z + (rnd() - 0.5) * P.d * 0.85), V3(0.1 + stage.wind * 0.5, 0.5 + rnd() * 0.25, 0), 4)
      }
    }
    // the board, drawn again when what it shows changes
    const S = salinity(S2.gone)
    const has = []
    if (limeK > 0.5) has.push('lime')
    if (gypK > 0.5) has.push('gypsum')
    if (halK > 0.3) has.push('halite')
    if (S2.flor > 0 || S2.crust >= 0.25) has.push('flor')
    const on = S2.at > 0
    const pct = on ? Math.round(S2.gone * 100) : 0
    const key = `${on}|${Math.round(S)}|${pct}|${has.join()}`
    if (key !== boardShown) {
      boardShown = key
      readout.tex.userData.redraw((g, w, h) => drawBoard(g, w, h, { S, pct, has, on }))
    }
  }
  function pondEvents() {
    if (S2.at === 1 && S2.gone >= 0.5 && !pondSaid.lime) tellPond('lime')
    if (S2.at === 2 && S2.gone >= 0.8 && !pondSaid.gypsum) tellPond('gypsum')
    if (S2.at === 3 && S2.gone >= 0.9 && !pondSaid.halite) tellPond('halite')
    if (S2.at === 3 && S2.crust >= 0.3 && !pondSaid.flor) tellPond('flor')
    if (S2.at === 3 && S2.gone >= CAP[3] - 0.002 && S2.crust < 0.25 && !pondSaid.bitter) tellPond('bitter')
  }
  updates.push((dt, t) => {
    if (flow && (flow.t += dt) > FLOW_T) flow = null
    if (skimAnim && (skimAnim.t += dt) > SKIM_T) skimAnim = null
    advancePonds(dt)
    pondEvents()
    posePonds(dt, t)
  })
  const r3 = v => Math.round(v * 1000) / 1000
  const pondState = () => ({ at: S2.at, gone: r3(S2.gone), dry: S2.dry, crust: r3(S2.crust), fills: S2.fills, flor: S2.flor })
  const pondSet = (s, live, ago = 0) => {
    const n = {
      at: clamp(Math.round(Number(s?.at) || 0), 0, 3),
      gone: clamp(Number(s?.gone) || 0, 0, CAP[3]),
      dry: clamp(Number(s?.dry ?? 0.6)),
      crust: clamp(Number(s?.crust) || 0),
      fills: Math.max(0, Math.round(Number(s?.fills) || 0)),
      flor: Math.max(0, Math.round(Number(s?.flor) || 0)),
    }
    pondMine = false
    if (live) {
      if (n.fills === S2.fills + 1 && n.at === 1) startFlow(0, 1)
      else if (n.fills === S2.fills && n.at === S2.at + 1) startFlow(S2.at, n.at)
      if (n.flor === S2.flor + 1) {
        skimAnim = { t: 0, crust: Math.max(S2.crust, 0.3) }
        play('select')
      }
    } else {
      flow = null
      skimAnim = null
    }
    if (n.fills !== S2.fills) pondSaid = {}
    Object.assign(S2, n)
    stage.setWeather(S2.dry)
    for (let left = Math.min(Number(ago) || 0, 60); left > 0; left -= 0.1) advancePonds(Math.min(0.1, left))
    // a pond found as it stands has nothing new to tell
    if (!live) pondSaid = { lime: true, gypsum: true, halite: true, flor: true, bitter: true }
  }

  // ======== 3. the marnoto's rake: a crystalliser full of salt, the heaps beside it ========
  const R = RPAN
  {
    const t = RIM.w
    for (const [x, z, w, d] of [[R.x, R.z - R.d / 2 - t / 2, R.w + 2 * t, t], [R.x, R.z + R.d / 2 + t / 2, R.w + 2 * t, t], [R.x - R.w / 2 - t / 2, R.z, t, R.d], [R.x + R.w / 2 + t / 2, R.z, t, R.d]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, RIM.h, d), clayWall)
      m.position.set(x, RIM.h / 2, z)
      m.receiveShadow = true
      root.add(m)
    }
    solids.push(box(R.x, R.z, R.w + 2 * t, R.d + 2 * t))
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(R.w, R.d).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6b5541', roughness: 1 }))
    floor.position.set(R.x, FLOOR_Y, R.z)
    root.add(floor)
  }
  const bedMat = new THREE.MeshStandardMaterial({ color: '#c3c7c5', roughness: 0.6, transparent: true, opacity: 1, depthWrite: false })
  const bed = new THREE.Mesh(new THREE.PlaneGeometry(R.w, R.d).rotateX(-Math.PI / 2), bedMat)
  bed.position.set(R.x, FLOOR_Y + 0.004, R.z)
  root.add(bed)
  const bedCubes = new THREE.InstancedMesh(cubes.geometry, cubes.material, light ? 120 : 260)
  bedCubes.frustumCulled = false
  root.add(bedCubes)
  const bedSpots = scatter(bedCubes, R, FLOOR_Y + 0.016, 31, true)
  const rakeWater = new THREE.Mesh(new THREE.PlaneGeometry(R.w, R.d).rotateX(-Math.PI / 2), stage.water({ tint: '#a6d6c8', alpha: 0.42 }))
  rakeWater.position.set(R.x, FLOOR_Y + 0.045, R.z)
  rakeWater.renderOrder = 2
  root.add(rakeWater)
  // the rake: a long wooden handle and a flat board across its end
  const rake = new THREE.Group()
  const HANDLE = 3.0
  {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, HANDLE, 8).rotateZ(Math.PI / 2), wood)
    handle.position.x = HANDLE / 2
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.62), wood)
    head.position.set(0, 0.055, 0)
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), darkWood)
    brace.position.set(0.1, 0.09, 0)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(HANDLE + 0.2, 0.35, 0.75), ghost)
    hit.position.x = HANDLE / 2 - 0.1
    rake.add(handle, head, brace, hit)
  }
  root.add(rake)
  // the ridge of salt the board pushes along, and the heaps
  const ridge = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.1, R.d - 0.3, 2, 0.04), saltMat)
  ridge.visible = false
  root.add(ridge)
  const heaps = HEAPS.map(p => {
    const m = new THREE.Mesh(heapGeo, saltMat)
    m.position.copy(p)
    m.castShadow = true
    m.visible = false
    root.add(m)
    solids.push(circle(p.x, p.z, 0.55))
    return m
  })
  // glints on every heap (the picture's shining salt)
  const SPARK_HEAP = 22
  const heapSpark = HEAPS.flatMap(p => Array.from({ length: SPARK_HEAP }, () => ({ p, a: rnd() * TAU, y: rnd() * 0.9 })))
  const sparkArr = new Float32Array(sparkPos.length + heapSpark.length * 3)
  sparkArr.set(sparkPos)
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkArr, 3))
  const sparkMat = new THREE.PointsMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(1.6), size: 0.045, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  sparks.frustumCulled = false
  root.add(sparks)

  const S3 = { n: 0, age: 60 }
  let rakeAnim = null // { t, n }: the sweep for tap n
  const RAKE_T = 2.7
  const PER_HEAP = 5
  const CYCLE = PER_HEAP * HEAPS.length
  const inCycle = n => (n === 0 ? 0 : ((n - 1) % CYCLE) + 1)
  const rakePanel = lv => ({
    title: E.rake.title,
    color,
    blocks: [{ buttons: [{ label: E.rake.buttons.rake, onClick: () => rakeStep() }] }, ...paras(E.rake.panel, lv)],
  })
  const startRake = n => {
    rakeAnim = { t: 0, n }
    play('fizz', { order: 0.8 })
  }
  function rakeStep() {
    const lv = level()
    if (rakeAnim) return say(at(W.busy, lv))
    S3.n++
    S3.age = 0
    startRake(S3.n)
    const k = inCycle(S3.n)
    const line = S3.n === 1 ? 'rake' : k === 1 ? 'all' : k % PER_HEAP === 0 ? 'full' : 'grow'
    say(at(E.rake.says[line], lv))
    ex.discover('rake', rakePanel, 3.0)
    share('rake')
  }
  ex.add({
    id: 'rake',
    x: R.x - 0.2,
    z: R.z + R.d / 2 + 1.55,
    radius: 2.0,
    manual: true,
    label: E.rake.label,
    verb: () => (S3.n === 0 ? E.rake.hints.rake : E.rake.hints.more),
    focus: { x: R.x + 0.3, y: 0.3, z: R.z - 1.0, size: 4.0 },
    act: () => ctx.showPanel(rakePanel),
  })
  clickable(rake, () => rakeStep(), { when: () => !rakeAnim })
  // at rest its handle lies over the pan's right rim
const REST = { head: V3(R.x - R.w / 2 + 0.25, FLOOR_Y + 0.01, R.z), lift: Math.asin((RIM.h + 0.04) / (R.w - 0.25)) }
  const heapSize = (i, k) => clamp(k - PER_HEAP * i, 0, PER_HEAP) / PER_HEAP
  function poseRake(dt, t) {
    const a = rakeAnim
    const s = a?.t ?? 0
    // the board's path: from the left end across the pan to the right, pushing the ridge
    const x0 = R.x - R.w / 2 + 0.25
    const x1 = R.x + R.w / 2 - 0.2
    const sweep = span(0.3, 1.8, s)
    const back = span(2.2, 2.7, s)
    const headX = a ? (s < 2.2 ? lerp(x0, x1, sweep) : lerp(x1, x0, back)) : x0
    const raise = a ? span(0, 0.3, s) * (1 - back) : 0
    rake.position.set(headX, REST.head.y + (s >= 1.8 && s < 2.2 ? 0.05 : 0), R.z)
    // the handle slants up toward where the marnoto would hold it
    rake.rotation.set(0, 0, lerp(REST.lift, 0.33, raise))
    // the floor: raked bare behind the board, growing back over the next seconds
    const k = inCycle(S3.n)
    // (from the end of the sweep: the salt grows back over the next five seconds, days in a real pan)
    const regrow = a ? 0 : clamp((S3.age - RAKE_T) / 5)
    const bedK = a ? 1 : 0.25 + 0.75 * regrow
    bedMat.opacity = 0.35 + 0.65 * bedK
    const n = Math.round(bedSpots.length * (a ? 1 : 0.15 + 0.85 * regrow))
    let m = 0
    for (let i = 0; i < n; i++) {
      const sp = bedSpots[i]
      if (a && sp.x < headX - 0.04 && s < 2.2) continue
      o3.position.set(sp.x, sp.y, sp.z)
      o3.rotation.set(sp.rx, sp.ry, 0)
      o3.scale.setScalar(sp.s * 0.9)
      o3.updateMatrix()
      bedCubes.setMatrixAt(m++, o3.matrix)
    }
    bedCubes.count = m
    bedCubes.instanceMatrix.needsUpdate = true
    // the ridge in front of the board; at the end it hops onto the heap
    const target = a ? Math.floor((inCycle(a.n) - 1) / PER_HEAP) : 0
    if (a && s > 0.3 && s < 2.4) {
      ridge.visible = true
      const grow = sweep
      if (s < 1.8) {
        ridge.position.set(headX + 0.1, FLOOR_Y + 0.03 + 0.05 * grow, R.z)
        ridge.scale.set(0.6 + 0.8 * grow, 0.4 + 1.2 * grow, 1)
      } else {
        // gathered up and onto the heap
        const h = span(1.8, 2.4, s)
        const to = HEAPS[target]
        ridge.position.set(lerp(x1 + 0.1, to.x, h), FLOOR_Y + 0.11 + Math.sin(Math.PI * h) * 0.7 + h * 0.4, lerp(R.z, to.z, h))
        ridge.scale.set(1.4 * (1 - h * 0.6), 1.6 * (1 - h * 0.6), 1 - h * 0.75)
      }
    } else ridge.visible = false
    // the heaps: each tap adds a rakeful; a new round carries the full ones away first
    const kShown = a && s < 2.4 ? Math.max(0, k - 1) : k
    const carrying = a && k === 1 && a.n > 1
    heaps.forEach((hm, i) => {
      let size = heapSize(i, kShown)
      if (carrying && s < 2.4) size = (1 - span(0, 1.2, s)) * 1
      hm.visible = size > 0.01
      const g = Math.cbrt(size)
      hm.scale.set(0.82 * g, 1.05 * g, 0.82 * g)
      hm.position.y = (1.05 * g) / 2
    })
    // the glints: on the heaps as they stand, twinkling
    let p = sparkPos.length
    heapSpark.forEach(({ p: c, a: ang, y }, j) => {
      const hm = heaps[Math.floor(j / SPARK_HEAP)]
      const hh = hm.visible ? hm.scale.y : 0
      const rr = hm.visible ? hm.scale.x : 0
      const yy = y * hh
      const rad = rr * (1 - y) + 0.012
      sparkArr[p++] = c.x + Math.cos(ang) * rad
      sparkArr[p++] = hm.visible ? yy : -5
      sparkArr[p++] = c.z + Math.sin(ang) * rad
    })
    sparkGeo.attributes.position.needsUpdate = true
    sparkMat.size = 0.035 + 0.02 * Math.abs(Math.sin(t * 7))
  }
  updates.push((dt, t) => {
    if (rakeAnim && (rakeAnim.t += dt) > RAKE_T) rakeAnim = null
    S3.age = Math.min(60, S3.age + dt)
    poseRake(dt, t)
  })
  const rakeState = () => ({ n: S3.n, age: Math.round(S3.age * 10) / 10 })
  const rakeSet = (s, live, ago = 0) => {
    const n = Math.max(0, Math.round(Number(s?.n) || 0))
    if (live && n === S3.n + 1) startRake(n)
    else rakeAnim = null
    S3.n = n
    S3.age = Math.min(60, (Number(s?.age) || 0) + (Number(ago) || 0))
  }

  updates.push((dt, t) => {
    vapourBig.update(dt)
    stage.update(t, dt)
  })

  // where a probe aims a tap (world positions of the things)
  const spots = {
    cloud: () => model.localToWorld(cloud.position.clone()),
    volcano: () => model.localToWorld(craterTop().add(V3(0, -0.12, 0))),
    sun: () => model.localToWorld(SUN_AT.clone()),
    gate1: () => V3(GATES[0].x, 0.5, GATES[0].z),
    gate2: () => V3(GATES[1].x, 0.5, GATES[1].z),
    gate3: () => V3(GATES[2].x, 0.5, GATES[2].z),
    skimmer: () => skimmer.localToWorld(V3(0.9, 0, 0)),
    rake: () => rake.localToWorld(V3(1.2, 0, 0)),
  }

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.8 },
    spawn: { x: 0, z: 5.0, yaw: 0 },
    hostSpot: { x: 1.6, z: 4.1, yaw: Math.atan2(1.6, -0.9) },
    back: { x: 0, z: 9.4, rot: Math.PI },
    stand: { x: -2.3, z: 3.2, rot: Math.atan2(2.3, 1.8) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      sea: {
        tap: k => seaStep(k), // 'cloud', 'volcano', 'sun', 'again' (the panel's button)
        get state() { return seaState() },
        get busy() { return !!seaAnim },
        get grains() { return { ...counts } },
      },
      pans: {
        tap: k => pondStep(k), // 'sea' (the sluice), 'gate2', 'gate3', 'next', 'skim' (the skimmer)
        dry: v => setDry(v, true), // the panel's slider
        skip: sec => { for (let i = 0; i < sec * 10; i++) advancePonds(0.1) }, // run the drying on (this screen only)
        get state() { return pondState() },
        get busy() { return pondsBusy() },
      },
      rake: {
        tap: () => rakeStep(),
        get state() { return rakeState() },
        get busy() { return !!rakeAnim },
      },
      at: name => spots[name]?.(),
      rayTo: name => {
        const p = spots[name]?.()
        return p ? new THREE.Ray(ctx.camera.position.clone(), p.sub(ctx.camera.position).normalize()) : null
      },
    },
    panels: { sea: seaPanel, pans: pondsPanel, rake: rakePanel },
    shared: {
      sea: { get: seaState, set: seaSet },
      pans: { get: pondState, set: pondSet },
      rake: { get: rakeState, set: rakeSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (drySend) clearTimeout(drySend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
