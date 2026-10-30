// Sodium's picture "1807: a metal nobody had ever seen" as a room (docs/knowledge/picture-rooms.md): the
// picture made into the Royal Institution's basement laboratory in London, autumn 1807, by candlelight
// (stages/workshop.js without its electric lamps: brick, flagstones, beams, two windows onto the night).
// The great battery of troughs stands along the left wall, the experiment of the picture on the bench at
// the back (a lump of moist caustic soda on a platinum dish, a platinum wire above it, the picture's purple
// lens beside it), shelves of jars behind, Davy's desk on the right. Three things to do, each step chosen by
// tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names
// the next tap, E opens the station's panel, whose buttons (and a slider for the troughs) do the same:
// - the battery: ten troughs of 25 pairs of copper and zinc plates (four of 6-inch plates, six of 4-inch:
//   Davy's "power of 250 of 6 and 4"); tap a trough to pour acid in (its plates fizz) or to empty it; a
//   slate counts the pairs, sparks at the wire and light running along the leads show the push;
// - the experiment: tap the wire (or the soda) to touch it down or lift it. No troughs, nothing; a few,
//   warmth; 100 pairs (enough for potash), hot but no metal; all 250, oxygen fizzes at the top and beads
//   with the shine of mercury appear round the bottom, some bursting into flame and jets of fire, the rest
//   tarnishing white. Tap a bead: the lens shows it close (its white skin growing); tap the lens: its atoms;
//   again: empty. The beads are a fixed schedule from a shared seed, so everyone in a room sees the same;
// - the desk: tap the notebook to read its pages (potassium first, sodium, 1808), the model of a Downs
//   cell beside it to run it (chlorine bubbling at the middle, sodium rising round it).
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, at, clamp, damp, random, fill } from '../../../wings/noble/kit.js'
import { workshopStage } from '../../stages/workshop.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { DAVY_WORDS } from './davy.words.js'

export const WORDS = DAVY_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const round1 = v => Math.round(v * 10) / 10
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- where things stand (metres; the spawn at z = 3 looks along -z, into the picture) ----
const ROOM = { x0: -6.2, x1: 6.2, z0: -6.5, z1: 6.6, h: 4.2 }
const TABLE = { x: 0.15, z: -4.35, w: 2.2, d: 1.0, top: 0.86 }
const PILLAR = 0.15
const DISH = { x: 0, z: -4.3, r: 0.17, y: TABLE.top + 0.03 + PILLAR + 0.012 }
const LUMP = { rx: 0.11, ry: 0.085, rz: 0.095, cut: 0.4 }
const STAND = { x: -0.42, z: -4.32 }
const LENS = { x: 0.86, y: 1.38, z: -4.66, r: 0.23 }
const BENCH = { x0: -4.45, x1: -3.05, z0: -5.55, z1: -0.15, top: 0.62, step: 0.2, stepX: -3.65 }
const DESK = { x: 5.35, z: -2.3, w: 0.8, d: 1.7, top: 0.8 }
const DOWNS = { x: 5.25, z: -4.05, top: 0.74 }
const SIDE = { x: 5.75, z0: 0.3, z1: 2.7, top: 0.85 }
const SHELF = { z: -6.3, x0: -3.5, x1: 3.5, ys: [1.25, 1.9, 2.55] }
// the troughs: four of 6-inch plates on the raised back row, six of 4-inch in front, 25 pairs each
const PAIRS_PER = 25
const FULL = 250
const PITCH = 0.03
const TROUGH_L = 0.8
const TROUGHS = [
  ...[-4.14, -3.28, -2.42, -1.56].map(z => ({ x: -4.03, z, base: BENCH.top + BENCH.step, P: 0.152 })),
  ...[-5.0, -4.14, -3.28, -2.42, -1.56, -0.7].map(z => ({ x: -3.4, z, base: BENCH.top, P: 0.102 })),
  // the walls stand lower than the plates, so the plates' copper and zinc edges show as stripes
].map(t => ({ ...t, wi: t.P + 0.02, di: 0.75 * t.P - 0.005, wo: t.P + 0.06, ho: 0.75 * t.P + 0.03 }))
const POST = { plus: new THREE.Vector3(-3.9, BENCH.top + BENCH.step, -5.25), minus: new THREE.Vector3(-3.9, BENCH.top + BENCH.step, -0.42) }
const JUG_REST = new THREE.Vector3(-2.8, 0, 0.15)

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A candle flame: a teardrop, white at its heart, orange at its edge. */
function flameTex() {
  return canvasTex(64, 128, (g, w, h) => {
    g.save()
    g.translate(w / 2, h * 0.7)
    g.scale(1, 2.3)
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.45)
    grd.addColorStop(0, 'rgba(255,255,235,1)')
    grd.addColorStop(0.3, 'rgba(255,214,120,0.95)')
    grd.addColorStop(0.65, 'rgba(255,140,40,0.55)')
    grd.addColorStop(1, 'rgba(255,90,20,0)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(0, 0, w * 0.45, 0, TAU)
    g.fill()
    g.restore()
  })
}

/** What shiny metal reflects in this room: dark wood and brick, warm candle spots, a cold window. */
function shineEnv() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#121214')
    grd.addColorStop(0.45, '#56504a')
    grd.addColorStop(0.55, '#3a3632')
    grd.addColorStop(1, '#0c0b0a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#34405e'
    g.fillRect(w * 0.62, h * 0.22, w * 0.07, h * 0.22)
    for (const [x, y, r] of [[0.12, 0.42, 9], [0.3, 0.36, 6], [0.47, 0.44, 12], [0.78, 0.4, 7], [0.9, 0.47, 10]]) {
      const c = g.createRadialGradient(x * w, y * h, 0, x * w, y * h, r)
      c.addColorStop(0, 'rgba(255,248,236,1)')
      c.addColorStop(1, 'rgba(255,170,90,0)')
      g.fillStyle = c
      g.fillRect(x * w - r, y * h - r, r * 2, r * 2)
    }
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/** A line of geometry between two points (a cylinder), for wires that move. */
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(1, Math.max(0.001, a.distanceTo(b)), 1)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, light, level, color, clickable }) {
  const stage = workshopStage({
    light,
    ...ROOM,
    lamps: [],
    windows: [{ side: 'w', at: 2.6 }, { side: 'e', at: 3.6 }],
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const soft = softTex()
  const flame = flameTex()
  const env = shineEnv()
  textures.push(soft, flame, env)
  const tmpV = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const copper = new THREE.MeshStandardMaterial({ color: '#c8733c', roughness: 0.35, metalness: 0.85, envMap: env, envMapIntensity: 1.2 })
  const zinc = new THREE.MeshStandardMaterial({ color: '#a7adb2', roughness: 0.45, metalness: 0.8, envMap: env, envMapIntensity: 1.1 })
  const platinum = new THREE.MeshStandardMaterial({ color: '#b8bcc0', roughness: 0.3, metalness: 1, envMap: env, envMapIntensity: 0.9 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#cfe6ea', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.32, depthWrite: false })
  const darkWood = new THREE.MeshStandardMaterial({ color: '#4a3324', roughness: 0.75 })
  // light stays warm and low: the night's blue from the stage, the candles' orange from here
  const room = new THREE.HemisphereLight('#5a4a3c', '#24170f', light ? 0.55 : 0.4)
  root.add(room)

  // ======== candles: the only light of 1807 (a few carry a real light) ========
  const candles = []
  const flameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const haloMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffb060').multiplyScalar(0.9), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
  const waxMat = new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.6, emissive: '#5a3a18', emissiveIntensity: 0.25 })
  const stickGeo = new THREE.LatheGeometry([[0, 0], [0.055, 0], [0.058, 0.012], [0.02, 0.03], [0.014, 0.09], [0.04, 0.1], [0.042, 0.11], [0.016, 0.112]].map(([x, y]) => new THREE.Vector2(x, y)), 18)
  function candle(x, y, z, { h = 0.15, glow = 0, reach = 6 } = {}) {
    const g = new THREE.Group()
    const stick = new THREE.Mesh(stickGeo, mats.brass)
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.014, h, 10), waxMat)
    wax.position.y = 0.11 + h / 2
    const f = new THREE.Sprite(flameMat)
    const top = 0.11 + h
    f.center.set(0.5, 0.1)
    f.position.y = top + 0.005
    const halo = new THREE.Sprite(haloMat)
    halo.position.y = top + 0.03
    halo.scale.setScalar(0.32)
    g.add(stick, wax, f, halo)
    g.position.set(x, y, z)
    root.add(g)
    let pl = null
    if (glow) {
      pl = new THREE.PointLight('#ffb36a', glow, reach, 1.6)
      pl.position.set(x, y + top + 0.08, z)
      root.add(pl)
    }
    const seed = Math.random() * 100
    candles.push({ f, pl, glow, seed })
  }
  updates.push((dt, t) => {
    for (const c of candles) {
      const k = 1 + Math.sin(t * 11 + c.seed) * 0.06 + Math.sin(t * 23.7 + c.seed * 2) * 0.05
      c.f?.scale.set(0.028 * (2 - k), 0.07 * k, 1)
      if (c.pl) c.pl.intensity = c.glow * (0.92 + (k - 1) * 1.4)
    }
  })

  // ======== shelves of jars on the back wall, as the picture's ========
  {
    const board = new THREE.BoxGeometry(SHELF.x1 - SHELF.x0, 0.04, 0.3)
    for (const y of SHELF.ys) {
      const b = new THREE.Mesh(board, mats.wood)
      b.position.set(0, y - 0.02, SHELF.z)
      root.add(b)
      for (const x of [SHELF.x0 + 0.2, 0, SHELF.x1 - 0.2]) {
        const br = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.24), mats.beam)
        br.position.set(x, y - 0.12, SHELF.z - 0.02)
        root.add(br)
      }
    }
    solids.push(box(0, SHELF.z, SHELF.x1 - SHELF.x0, 0.36))
    const shapes = {
      bottle: [[0, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.14], [0.03, 0.19], [0.018, 0.21], [0.02, 0.24]],
      jar: [[0, 0], [0.065, 0], [0.07, 0.01], [0.07, 0.15], [0.06, 0.165], [0.06, 0.18]],
      flask: [[0, 0], [0.04, 0], [0.075, 0.05], [0.07, 0.1], [0.022, 0.14], [0.018, 0.22], [0.022, 0.225]],
      tall: [[0, 0], [0.04, 0], [0.042, 0.01], [0.042, 0.24], [0.025, 0.27], [0.016, 0.29], [0.019, 0.31]],
    }
    const geos = Object.fromEntries(Object.entries(shapes).map(([k, p]) => [k, new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 16)]))
    const glassTints = ['#5a7bd8', '#4f9a6c', '#b07a3a', '#cfe6ea', '#7a4a2a', '#4a68b8'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.6, depthWrite: false }))
    const stuff = ['#eeeae0', '#e8cf3a', '#3a78c8', '#b8402c', '#d8d0c0', '#2c2a28'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }))
    const labelMat = new THREE.MeshStandardMaterial({ color: '#e6dcc0', roughness: 0.9 })
    const rnd = random(23)
    const kinds = Object.keys(shapes)
    for (const y of SHELF.ys) {
      let x = SHELF.x0 + 0.15
      while (x < SHELF.x1 - 0.12) {
        const kind = kinds[Math.floor(rnd() * kinds.length)]
        const s = 0.9 + rnd() * 0.5
        const g = new THREE.Group()
        const jar = new THREE.Mesh(geos[kind], glassTints[Math.floor(rnd() * glassTints.length)])
        jar.renderOrder = 2
        g.add(jar)
        if (kind !== 'flask' || rnd() < 0.5) {
          const fillH = 0.06 + rnd() * 0.08
          const inner = new THREE.Mesh(new THREE.CylinderGeometry(kind === 'jar' ? 0.06 : 0.035, kind === 'jar' ? 0.06 : 0.04, fillH, 12), stuff[Math.floor(rnd() * stuff.length)])
          inner.position.y = fillH / 2 + 0.005
          g.add(inner)
        }
        if (kind !== 'flask' && rnd() < 0.7) {
          const label = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.045), labelMat)
          label.position.set(0, 0.08, kind === 'jar' ? 0.072 : 0.057)
          g.add(label)
        }
        g.scale.setScalar(s)
        g.position.set(x, y, SHELF.z + (rnd() - 0.5) * 0.08)
        g.rotation.y = (rnd() - 0.5) * 0.4
        root.add(g)
        x += 0.17 * s + 0.06 + rnd() * 0.22
      }
    }
    // the picture's candle on the shelf
    candle(-0.55, SHELF.ys[1], SHELF.z + 0.05, { glow: light ? 0 : 1.6, reach: 5 })
  }

  // ======== the bench of the picture, with the experiment ========
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(TABLE.w, 0.06, TABLE.d, 2, 0.015), mats.wood)
    top.position.set(TABLE.x, TABLE.top - 0.03, TABLE.z)
    root.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, TABLE.top - 0.06, 0.07), mats.beam)
        leg.position.set(TABLE.x + sx * (TABLE.w / 2 - 0.08), (TABLE.top - 0.06) / 2, TABLE.z + sz * (TABLE.d / 2 - 0.08))
        root.add(leg)
      }
    }
    const stretcher = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w - 0.16, 0.05, 0.04), mats.beam)
    stretcher.position.set(TABLE.x, 0.18, TABLE.z)
    root.add(stretcher)
    solids.push(box(TABLE.x, TABLE.z, TABLE.w, TABLE.d))
    // two candles on the bench, one light for both
    candle(TABLE.x - 0.88, TABLE.top, TABLE.z - 0.3)
    candle(TABLE.x + 0.62, TABLE.top, TABLE.z - 0.32, { h: 0.11 })
    const bl = new THREE.PointLight('#ffb36a', 1.8, 6.5, 1.5)
    bl.position.set(TABLE.x - 0.3, TABLE.top + 1.2, TABLE.z + 0.7)
    root.add(bl)
    candles.push({ f: null, pl: bl, glow: 1.8, seed: 7 })
    // a few things a chemist keeps at hand: a retort, a flask, a mortar
    const retort = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 12), glassMat)
    retort.position.set(TABLE.x + 0.45, TABLE.top + 0.085, TABLE.z - 0.3)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.34, 10), glassMat)
    neck.position.set(TABLE.x + 0.29, TABLE.top + 0.17, TABLE.z - 0.3)
    neck.rotation.z = 1.05
    const mortar = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.085, 0.06], [0.08, 0.065], [0.06, 0.02], [0, 0.02]].map(([x, y]) => new THREE.Vector2(x, y)), 18), new THREE.MeshStandardMaterial({ color: '#d8d2c4', roughness: 0.8 }))
    mortar.position.set(TABLE.x - 0.7, TABLE.top, TABLE.z + 0.25)
    root.add(retort, neck, mortar)
  }

  // the platinum dish on its glass pillar (insulated), and the lump of caustic soda on it
  const dish = new THREE.Group()
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.03, 24), darkWood)
    base.position.y = TABLE.top + 0.015
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, PILLAR, 14), glassMat)
    pillar.position.y = TABLE.top + 0.03 + PILLAR / 2
    pillar.renderOrder = 2
    const r = DISH.r
    const plate = new THREE.Mesh(new THREE.LatheGeometry([[0, -0.012], [r - 0.02, -0.012], [r, -0.004], [r + 0.012, 0.012], [r + 0.006, 0.014], [r - 0.012, 0.001], [0, 0.001]].map(([x, y]) => new THREE.Vector2(x, y)), 40), platinum)
    plate.position.y = DISH.y - 0.001
    // the clamp where the negative lead joins the dish
    const clampBlock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.03), mats.brass)
    clampBlock.position.set(-r - 0.01, DISH.y, 0.05)
    dish.add(base, pillar, plate, clampBlock)
    dish.position.set(DISH.x, 0, DISH.z)
    root.add(dish)
  }
  const lumpGeo = (() => {
    // merged, so the lump is smooth where it is round (an icosahedron's own faces are flat)
    const g = mergeVertices(new THREE.IcosahedronGeometry(1, 4).deleteAttribute('normal').deleteAttribute('uv'))
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const n = 1 + 0.12 * Math.sin(v.x * 3.1 + 1.3) * Math.cos(v.z * 2.7) + 0.08 * Math.sin(v.y * 4.3 + v.x * 2) + 0.05 * Math.sin(v.z * 7 + 2)
      v.multiplyScalar(n)
      // a few flat faces, as a broken lump has
      if (v.x > 0.78) v.x = 0.78 + (v.x - 0.78) * 0.2
      if (v.z < -0.8) v.z = -0.8 + (v.z + 0.8) * 0.2
      v.y = Math.max(v.y, -LUMP.cut) + LUMP.cut
      p.setXYZ(i, v.x * LUMP.rx, v.y * LUMP.ry, v.z * LUMP.rz)
    }
    g.computeVertexNormals()
    g.computeBoundingBox()
    return g
  })()
  const LUMP_TOP = lumpGeo.boundingBox.max.y
  const lumpMat = new THREE.MeshStandardMaterial({ color: '#c8cbc4', roughness: 0.42, metalness: 0, emissive: '#ff7a30', emissiveIntensity: 0 })
  const lump = new THREE.Mesh(lumpGeo, lumpMat)
  lump.position.set(DISH.x, DISH.y, DISH.z)
  root.add(lump)
  const TIP_DOWN = new THREE.Vector3(DISH.x - 0.01, DISH.y + LUMP_TOP - 0.006, DISH.z)
  // the base's edge, where the beads come out
  const BASE_R = { x: LUMP.rx * Math.sqrt(1 - LUMP.cut ** 2) * 1.02, z: LUMP.rz * Math.sqrt(1 - LUMP.cut ** 2) * 1.02 }

  // the positive wire: a platinum wire hanging from an arm on a retort stand, the arm sliding down to touch
  const LIFT = 0.12
  const WIRE_L = 0.17
  const armMat = glassMat
  const arm = new THREE.Group()
  const armFrom = new THREE.Vector3(STAND.x, 0, STAND.z)
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.15), mats.iron)
    base.position.set(STAND.x, TABLE.top + 0.015, STAND.z)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.92, 8), mats.iron)
    rod.position.set(STAND.x, TABLE.top + 0.46, STAND.z)
    root.add(base, rod)
    const boss = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), mats.brass)
    const len = Math.hypot(TIP_DOWN.x - STAND.x, TIP_DOWN.z - STAND.z)
    const glassRod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, len, 10), armMat)
    glassRod.rotation.z = Math.PI / 2
    glassRod.position.x = len / 2
    glassRod.renderOrder = 2
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.04, 12), mats.brass)
    holder.position.x = len
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, WIRE_L, 6), platinum)
    wire.position.set(len, -WIRE_L / 2, 0)
    const tipBall = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), platinum)
    tipBall.position.set(len, -WIRE_L, 0)
    // something easy to tap: the thin wire alone is hard to hit
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.14, WIRE_L + 0.12, 0.14), ghost)
    hit.position.set(len, -WIRE_L / 2 + 0.03, 0)
    arm.add(boss, glassRod, holder, wire, tipBall, hit)
    arm.rotation.y = -Math.atan2(TIP_DOWN.z - STAND.z, TIP_DOWN.x - STAND.x)
    root.add(arm)
  }
  const armY = lift => TIP_DOWN.y + WIRE_L + lift
  let armLift = LIFT
  const tipPos = () => tmpV.set(TIP_DOWN.x, armY(armLift) - WIRE_L, TIP_DOWN.z)

  // the leads from the battery: up and over to the stand (positive), along the floor to the dish (negative)
  const leadPlus = new THREE.CatmullRomCurve3([
    POST.plus.clone().setY(POST.plus.y + 0.14),
    new THREE.Vector3(-3.6, 1.7, -5.6),
    new THREE.Vector3(-2.4, 2.5, -5.4),
    new THREE.Vector3(-1.2, 2.4, -4.9),
    new THREE.Vector3(-0.55, 1.95, -4.4),
    new THREE.Vector3(STAND.x, TABLE.top + 0.93, STAND.z),
  ])
  const leadMinus = new THREE.CatmullRomCurve3([
    POST.minus.clone().setY(POST.minus.y + 0.14),
    new THREE.Vector3(-3.25, 0.55, -0.1),
    new THREE.Vector3(-2.75, 0.02, -0.5),
    new THREE.Vector3(-1.6, 0.02, -2.5),
    new THREE.Vector3(-0.9, 0.02, -3.65),
    new THREE.Vector3(-0.85, 0.5, -3.88),
    new THREE.Vector3(-0.55, TABLE.top + 0.01, -3.95),
    new THREE.Vector3(DISH.x - DISH.r - 0.03, DISH.y, DISH.z + 0.05),
  ])
  for (const c of [leadPlus, leadMinus]) root.add(new THREE.Mesh(new THREE.TubeGeometry(c, 160, 0.01, 6, false), copper))
  const flexMat = copper
  const flex = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 6), flexMat)
  root.add(flex)
  const flexTop = new THREE.Vector3(STAND.x, TABLE.top + 0.93, STAND.z)
  // light running along the leads while the current flows (the picture's glowing dots)
  const DOTS = light ? 18 : 32
  const dotPos = new Float32Array(DOTS * 2 * 3)
  const dotGeo = new THREE.BufferGeometry()
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3))
  const dotMat = new THREE.PointsMaterial({ map: soft, color: new THREE.Color('#ffe2b8').multiplyScalar(1.8), size: 0.07, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const dots = new THREE.Points(dotGeo, dotMat)
  dots.frustumCulled = false
  root.add(dots)
  let dotRun = 0

  // ======== the great battery: ten troughs of copper and zinc ========
  const benchGroup = new THREE.Group()
  {
    const bw = BENCH.x1 - BENCH.x0
    const bl = BENCH.z1 - BENCH.z0
    const top = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.05, bl), mats.wood)
    top.position.set((BENCH.x0 + BENCH.x1) / 2, BENCH.top - 0.025, (BENCH.z0 + BENCH.z1) / 2)
    benchGroup.add(top)
    for (const z of [BENCH.z0 + 0.1, (BENCH.z0 + BENCH.z1) / 2, BENCH.z1 - 0.1]) {
      for (const x of [BENCH.x0 + 0.1, BENCH.x1 - 0.1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, BENCH.top - 0.05, 0.07), mats.beam)
        leg.position.set(x, (BENCH.top - 0.05) / 2, z)
        benchGroup.add(leg)
      }
    }
    const step = new THREE.Mesh(new THREE.BoxGeometry(BENCH.stepX - BENCH.x0, BENCH.step, bl), mats.beam)
    step.position.set((BENCH.x0 + BENCH.stepX) / 2, BENCH.top + BENCH.step / 2, (BENCH.z0 + BENCH.z1) / 2)
    benchGroup.add(step)
    root.add(benchGroup)
    solids.push(box((BENCH.x0 + BENCH.x1) / 2, (BENCH.z0 + BENCH.z1) / 2, bw, bl))
    // the terminal posts
    for (const [p, sign] of [[POST.plus, '+'], [POST.minus, '−']]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.14, 10), mats.brass)
      post.position.copy(p).setY(p.y + 0.07)
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), mats.brass)
      knob.position.copy(p).setY(p.y + 0.15)
      const t = makeText(sign, { size: 0.12, color: '#ffd9a0' })
      t.position.copy(p).add(new THREE.Vector3(0.12, 0.2, 0))
      t.rotation.y = Math.PI / 2
      root.add(post, knob, t)
    }
  }
  const troughBox = new THREE.MeshStandardMaterial({ color: '#7a5236', roughness: 0.7 })
  const acidMat = new THREE.MeshStandardMaterial({ color: '#a8d8c4', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.55, emissive: '#2a5a48', emissiveIntensity: 0.25, depthWrite: false })
  const troughs = TROUGHS.map(t => {
    const g = new THREE.Group()
    const wall = 0.02
    const L = TROUGH_L
    const parts = [
      [t.wo, wall, L, 0, wall / 2, 0],
      [wall, t.ho, L, -(t.wo - wall) / 2, t.ho / 2, 0],
      [wall, t.ho, L, (t.wo - wall) / 2, t.ho / 2, 0],
      [t.wo - 2 * wall, t.ho, wall, 0, t.ho / 2, -(L - wall) / 2],
      [t.wo - 2 * wall, t.ho, wall, 0, t.ho / 2, (L - wall) / 2],
    ]
    for (const [w, h, d, x, y, z] of parts) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), troughBox)
      m.position.set(x, y, z)
      g.add(m)
    }
    const acid = new THREE.Mesh(new THREE.BoxGeometry(t.wi - 0.004, 1, L - 2 * wall - 0.004).translate(0, 0.5, 0), acidMat)
    acid.position.y = wall
    acid.scale.y = 0.0001
    acid.visible = false
    acid.renderOrder = 2
    g.add(acid)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(t.wo + 0.04, t.ho + 0.12, L + 0.02), ghost)
    hit.position.y = (t.ho + 0.12) / 2
    g.add(hit)
    g.position.set(t.x, t.base, t.z)
    root.add(g)
    return { ...t, group: g, acid, hit, lvl: 0, wait: 0 }
  })
  // the plates: a copper and a zinc plate soldered face to face, 25 to a trough (instanced)
  {
    const n = TROUGHS.length * PAIRS_PER
    const cu = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), copper, n)
    const zn = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), zinc, n)
    let k = 0
    for (const t of troughs) {
      for (let i = 0; i < PAIRS_PER; i++) {
        const z = t.z - TROUGH_L / 2 + 0.035 + i * PITCH
        const y = t.base + 0.02 + t.P / 2 + 0.004
        dummy.position.set(t.x, y, z)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(t.P, t.P, 0.006)
        dummy.updateMatrix()
        cu.setMatrixAt(k, dummy.matrix)
        dummy.position.z = z + 0.007
        dummy.scale.set(t.P, t.P, 0.008)
        dummy.updateMatrix()
        zn.setMatrixAt(k, dummy.matrix)
        k++
      }
    }
    root.add(cu, zn)
  }
  // bubbles rising off the plates in filled troughs (faster while current flows)
  const FIZZ = light ? 10 : 22
  const fizzPos = new Float32Array(troughs.length * FIZZ * 3)
  const fizzSeed = Array.from({ length: troughs.length * FIZZ }, (_, i) => [hash(5, i), hash(5, i, 1), hash(5, i, 2)])
  const fizzGeo = new THREE.BufferGeometry()
  fizzGeo.setAttribute('position', new THREE.BufferAttribute(fizzPos, 3))
  const fizz = new THREE.Points(fizzGeo, new THREE.PointsMaterial({ map: soft, color: '#f4fff8', size: 0.016, transparent: true, opacity: 0.85, depthWrite: false }))
  fizz.frustumCulled = false
  root.add(fizz)
  let fizzClock = 0
  // the slate on the wall that counts the pairs
  const slate = new THREE.Group()
  {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.78, 0.04), mats.wood)
    const face = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.68, 0.02), new THREE.MeshStandardMaterial({ color: '#2b2e30', roughness: 0.95 }))
    face.position.z = 0.016
    slate.add(frame, face)
    slate.position.set(ROOM.x0 + 0.04, 1.85, -2.85)
    slate.rotation.y = Math.PI / 2
    root.add(slate)
  }
  const slateNum = makeText('0', { size: 0.34, color: '#ecead8', anchorY: 'middle' })
  slateNum.position.set(0, 0.08, 0.03)
  const slateLine = makeText(E.battery.slate, { size: 0.1, color: '#d6d2c0', maxWidth: 0.95, anchorY: 'middle' })
  slateLine.position.set(0, -0.2, 0.03)
  slate.add(slateNum, slateLine)
  let slateShown = 0
  // a candle in a sconce above the battery, and the carboy of acid with the jug by the bench's end
  {
    const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.16), mats.brass)
    sconce.position.set(ROOM.x0 + 0.08, 1.62, -1.6)
    root.add(sconce)
    candle(ROOM.x0 + 0.13, 1.64, -1.6, { glow: light ? 0 : 1.8, reach: 6 })
    // a candle at each end of the battery, to see the plates by
    candle(-3.85, BENCH.top + BENCH.step, -4.85, { glow: 2.6, reach: 5.5 })
    candle(-3.85, BENCH.top + BENCH.step, -0.85, { h: 0.1, glow: light ? 0 : 2.2, reach: 5 })
    const carboy = new THREE.Group()
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.42, 16), new THREE.MeshStandardMaterial({ color: '#7a5a34', roughness: 0.95 }))
    basket.position.y = 0.21
    const glassTop = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 10, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6aa48a', roughness: 0.1, transparent: true, opacity: 0.6 }))
    glassTop.position.y = 0.42
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.14, 12), glassTop.material)
    neck.position.y = 0.7
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.05, 10), mats.wood)
    stopper.position.y = 0.79
    carboy.add(basket, glassTop, neck, stopper)
    carboy.position.set(-3.75, 0, 0.45)
    root.add(carboy)
    solids.push(circle(-3.75, 0.45, 0.28))
  }
  const jug = new THREE.Group()
  const SPOUT = new THREE.Vector3(-0.085, 0.22, 0)
  {
    const body = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.09, 0.06], [0.085, 0.16], [0.065, 0.21], [0.075, 0.23]].map(([x, y]) => new THREE.Vector2(x, y)), 18), new THREE.MeshStandardMaterial({ color: '#c9b48c', roughness: 0.6, side: THREE.DoubleSide }))
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 12, Math.PI), body.material)
    handle.position.set(0.085, 0.14, 0)
    handle.rotation.z = -Math.PI / 2
    jug.add(body, handle)
  }
  jug.position.copy(JUG_REST)
  root.add(jug)
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 1, 8), acidMat)
  stream.visible = false
  root.add(stream)
  let jugAnim = null // { i, t }

  // ---- the battery's state: which troughs hold acid ----
  const on = troughs.map(() => 0)
  const pairs = () => on.reduce((s, v) => s + v, 0) * PAIRS_PER
  const count = () => on.reduce((s, v) => s + v, 0)
  const troughTop = t => new THREE.Vector3(t.x, t.base + t.ho, t.z)
  const startJug = i => {
    jugAnim = { i, t: 0 }
    troughs[i].wait = 0.6
    play('select')
  }
  function poseJug() {
    const a = jugAnim
    if (!a) {
      jug.position.copy(JUG_REST)
      jug.rotation.set(0, 0, 0)
      stream.visible = false
      return
    }
    const t = troughs[a.i]
    const over = troughTop(t).add(new THREE.Vector3(0.2, 0.22, 0))
    const go = span(0, 0.45, a.t)
    const back = span(1.2, 1.65, a.t)
    const k = go * (1 - back)
    jug.position.lerpVectors(JUG_REST, over, k)
    jug.position.y += Math.sin(Math.PI * k) * 0.35
    jug.rotation.set(0, 0, 1.5 * span(0.45, 0.65, a.t) * (1 - span(1.05, 1.2, a.t)))
    const pour = a.t > 0.62 && a.t < 1.08
    stream.visible = pour
    if (pour) {
      jug.updateMatrixWorld()
      const s = jug.localToWorld(SPOUT.clone())
      stretch(stream, s, new THREE.Vector3(s.x, t.base + 0.05, s.z))
    }
  }
  // what the visitor's change does, said by the Atomling
  const sayBattery = (filled, was) => {
    const lv = level()
    const p = pairs()
    let line = filled ? E.battery.says.fill : E.battery.says.drain
    if (p === FULL) line = E.battery.says.full
    else if (filled && p === 100) line = E.battery.says.potash
    else if (p === 0 && was > 0) line = E.battery.says.none
    say(fill(at(line, lv), { pairs: p }))
  }
  const batteryPanel = lv => ({
    title: E.battery.title,
    color,
    blocks: [
      { slider: { label: E.battery.slider, min: 0, max: troughs.length, step: 1, value: count(), onInput: v => setCount(v), format: v => fill(E.battery.count, { n: Math.round(v), pairs: Math.round(v) * PAIRS_PER }), live: () => count() } },
      {
        buttons: [
          { label: E.battery.buttons.next, onClick: () => batteryStep('next') },
          { label: E.battery.buttons.all, onClick: () => setCount(troughs.length, true) },
          { label: E.battery.buttons.none, onClick: () => setCount(0, true) },
        ],
      },
      ...E.battery.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // a visitor's step: a tap on a trough (or the panel's "fill a trough")
  function batteryStep(i) {
    if (i === 'next') {
      i = on.findIndex(v => !v)
      if (i < 0) return say(fill(at(E.battery.says.full, level()), { pairs: pairs() }))
    }
    if (!(i >= 0 && i < troughs.length)) return
    const was = pairs()
    on[i] = on[i] ? 0 : 1
    if (on[i]) startJug(i)
    else {
      troughs[i].wait = 0
      play('tap')
    }
    sayBattery(!!on[i], was)
    afterBattery()
    ex.discover('battery', batteryPanel, 2.2)
    share('battery')
  }
  // the slider (and the panel's all or none): the first n troughs filled, the rest emptied
  let countSend = null
  function setCount(v, now = false) {
    const n = clamp(Math.round(Number(v) || 0), 0, troughs.length)
    if (n === count() && on.slice(0, n).every(Boolean)) return
    const was = pairs()
    on.forEach((_, i) => {
      on[i] = i < n ? 1 : 0
      troughs[i].wait = 0
    })
    if (now) {
      sayBattery(pairs() > was, was)
      play('tap')
    }
    afterBattery()
    ex.discover('battery', batteryPanel, 2.2)
    if (now) share('battery')
    else if (!countSend) {
      countSend = setTimeout(() => {
        countSend = null
        share('battery')
      }, 250)
    }
  }
  updates.push((dt, t) => {
    if (jugAnim && (jugAnim.t += dt) > 1.7) jugAnim = null
    poseJug()
    const current = S.down && pairs() > 0
    fizzClock += dt * (current ? 0.9 : 0.25)
    troughs.forEach((tr, i) => {
      if (tr.wait > 0) tr.wait -= dt
      else tr.lvl = on[i] ? Math.min(1, tr.lvl + dt / 0.5) : Math.max(0, tr.lvl - dt / 0.45)
      tr.acid.visible = tr.lvl > 0.01
      tr.acid.scale.y = Math.max(0.0001, tr.di * 0.92 * tr.lvl)
      // the bubbles: up through the acid, only where there is acid
      for (let k = 0; k < FIZZ; k++) {
        const [a, b, c] = fizzSeed[i * FIZZ + k]
        const j = (i * FIZZ + k) * 3
        if (tr.lvl < 0.3) {
          fizzPos[j + 1] = -5
          continue
        }
        const h = tr.di * 0.92 * tr.lvl
        fizzPos[j] = tr.x + (a - 0.5) * tr.wi * 0.85
        fizzPos[j + 1] = tr.base + 0.02 + ((fizzClock * (0.6 + b) + c) % 1) * h
        fizzPos[j + 2] = tr.z + (c - 0.5) * (TROUGH_L - 0.08)
      }
    })
    fizzGeo.attributes.position.needsUpdate = true
    if (pairs() !== slateShown) {
      slateShown = pairs()
      slateNum.text = String(slateShown)
      slateNum.sync()
    }
  })
  troughs.forEach((tr, i) => clickable(tr.hit, () => batteryStep(i)))
  ex.add({
    id: 'battery',
    x: -2.05,
    z: -2.6,
    radius: 1.7,
    manual: true,
    label: E.battery.label,
    // the next step, as a hint: the visitor does it by tapping a trough (E opens the panel)
    verb: () => {
      const p = pairs()
      if (!p) return E.battery.hints.first
      if (p < FULL) return fill(E.battery.hints.more, { pairs: p })
      return E.battery.hints.full
    },
    focus: { x: -3.7, y: 0.85, z: -2.85, size: 2.5 },
    act: () => ctx.showPanel(batteryPanel),
  })
  const batteryState = () => ({ on: [...on] })
  const batterySet = (s, liveSet) => {
    const next = troughs.map((_, i) => (Array.isArray(s?.on) && s.on[i] ? 1 : 0))
    const added = next.map((v, i) => v && !on[i] ? i : -1).filter(i => i >= 0)
    const removed = next.some((v, i) => !v && on[i])
    next.forEach((v, i) => (on[i] = v))
    if (liveSet) {
      if (added.length === 1 && !jugAnim) startJug(added[0])
      else if (added.length || removed) play('tap')
    } else {
      jugAnim = null
      troughs.forEach((tr, i) => {
        tr.wait = 0
        tr.lvl = on[i]
      })
    }
  }

  // ======== the experiment: wire down or up, the beads, the lens ========
  // S: down (the wire touches), seed (of this run's beads, 0 before the first), age (seconds since the run
  // began), on (when the soda was splitting: [from, to] in age, to -1 while it goes on; the last four),
  // lens (0 empty, 1 a bead, 2 its atoms), lt (seconds the lens has shown it)
  const S = { down: 0, seed: 0, age: 0, on: [], lens: 0, lt: 0 }
  const splitting = () => S.on.length > 0 && S.on[S.on.length - 1][1] < 0
  let mine = false // the last change was this visitor's (only then the Atomling tells what happens)
  let toldSplit = false
  // after the wire moved or the battery changed: does the soda split now? (true when that changed)
  function syncSplit() {
    const want = !!S.down && pairs() >= FULL
    if (want && !splitting()) {
      if (!S.seed) {
        S.seed = 1 + Math.floor(Math.random() * 999999)
        S.age = 0
      }
      S.on.push([round1(S.age), -1])
      if (S.on.length > 4) S.on.shift()
      toldSplit = false
      return true
    }
    if (!want && splitting()) {
      S.on[S.on.length - 1][1] = round1(S.age)
      return true
    }
    return false
  }
  function afterBattery() {
    const was = splitting()
    if (syncSplit()) {
      mine = true
      if (was && !splitting()) say(at(E.soda.says.weaker, level()))
      share('soda')
    }
  }
  // the beads: slot s (of 12 round the base) holds the latest bead j (j = s, s + 12, ...) born while the
  // soda was splitting; bead j is born at 0.9 + 0.62 j s (+ a little), and its fate comes from the seed
  const SLOTS = 12
  const PERIOD = 0.62
  const bornOf = j => 0.9 + j * PERIOD + 0.3 * hash(S.seed, j)
  const fateOf = j => {
    const burns = hash(S.seed, j, 1) < 0.4
    return {
      burns,
      burnAt: 0.55 + hash(S.seed, j, 2) * 1.5,
      bursts: hash(S.seed, j, 3) < 0.5,
      r: 0.016 + 0.014 * hash(S.seed, j, 4),
      a: ((j % SLOTS) + 0.15 + 0.7 * hash(S.seed, j, 5)) / SLOTS * TAU,
    }
  }
  const BURN = 0.95
  function latestIn(s) {
    for (let k = S.on.length - 1; k >= 0; k--) {
      const [a, b0] = S.on[k]
      const b = b0 < 0 ? S.age : b0
      let j = Math.floor((b - 0.9) / PERIOD)
      j -= (((j - s) % SLOTS) + SLOTS) % SLOTS
      if (j >= 0 && bornOf(j) > b) j -= SLOTS
      if (j >= 0 && bornOf(j) >= a) return j
    }
    return -1
  }
  // a bead's look at this moment: { j, r, a, grow (0..1), burn (0..1 or -1), crust (0..1) } or null if gone
  function beadNow(j) {
    if (j < 0) return null
    const f = fateOf(j)
    const tau = S.age - bornOf(j)
    if (tau < 0) return null
    if (f.burns && tau > f.burnAt + BURN) return null
    const burn = f.burns && tau > f.burnAt ? (tau - f.burnAt) / BURN : -1
    return { j, ...f, tau, grow: span(0, 0.4, tau), burn, crust: f.burns ? 0 : clamp((tau - 2.5) / 9) }
  }
  const beadMat = new THREE.MeshStandardMaterial({ color: '#f4f6f8', roughness: 0.06, metalness: 1, envMap: env, envMapIntensity: 2.6 })
  const crustMat = new THREE.MeshStandardMaterial({ color: '#e8e4dc', roughness: 0.9 })
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), beadMat, SLOTS * 2)
  const crustGeo = (() => {
    // smooth, with broad low bumps: grown through the bead's surface it shows as spreading patches
    const g = mergeVertices(new THREE.IcosahedronGeometry(1, 4).deleteAttribute('normal').deleteAttribute('uv'))
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      v.multiplyScalar(1 + 0.07 * Math.sin(v.x * 4 + 1) * Math.sin(v.y * 3.5 + 2) * Math.sin(v.z * 4.2) + 0.025 * Math.sin(v.x * 11 + v.z * 9))
      p.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  })()
  const crusts = new THREE.InstancedMesh(crustGeo, crustMat, SLOTS * 2)
  beads.frustumCulled = crusts.frustumCulled = false
  root.add(beads, crusts)
  // flames on burning beads, and sparks (the "jets of fire", and the spark where the wire touches)
  const flames = Array.from({ length: SLOTS }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffc050').multiplyScalar(2.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
    s.center.set(0.5, 0.15)
    s.visible = false
    root.add(s)
    return s
  })
  const SPARKS = light ? 90 : 180
  const sparkPos = new Float32Array(SPARKS * 3)
  const sparkCol = new Float32Array(SPARKS * 3)
  const sparkList = Array.from({ length: SPARKS }, () => ({ life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), c: new THREE.Color() }))
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3))
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ map: soft, size: 0.03, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  sparks.frustumCulled = false
  root.add(sparks)
  let sparkNext = 0
  const SPARK_FIRE = new THREE.Color('#ffc060').multiplyScalar(2.2)
  const SPARK_BLUE = new THREE.Color('#d8e8ff').multiplyScalar(2.6)
  function burst(from, n, col, speed = 1, up = 0.6) {
    for (let i = 0; i < n; i++) {
      const s = sparkList[sparkNext]
      sparkNext = (sparkNext + 1) % SPARKS
      const a = Math.random() * TAU
      const e = Math.random() * 0.9 + 0.1
      s.p.copy(from)
      s.v.set(Math.cos(a) * (1 - e), up + e, Math.sin(a) * (1 - e)).normalize().multiplyScalar(speed * (0.4 + Math.random()))
      s.max = s.life = 0.35 + Math.random() * 0.55
      s.c.copy(col)
    }
  }
  const dishLight = new THREE.PointLight('#ffb050', 0, 3.2, 1.6)
  dishLight.position.set(DISH.x, DISH.y + 0.55, DISH.z + 0.3)
  root.add(dishLight)
  let flash = 0
  // oxygen bubbling at the top, steam rising from the warm soda, the melted spot under the wire
  const BUB = light ? 14 : 28
  const bubMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.4, envMap: env, envMapIntensity: 1.4, depthWrite: false })
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), bubMat, BUB)
  bubbles.frustumCulled = false
  bubbles.count = 0
  root.add(bubbles)
  const bubList = []
  const steam = Array.from({ length: light ? 4 : 7 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#f4f0ea', transparent: true, opacity: 0, depthWrite: false }))
    root.add(s)
    return { s, ph: i / 7 }
  })
  const meltSpot = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshStandardMaterial({ color: '#d8e2e0', roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.85, envMap: env, envMapIntensity: 1.4 }))
  meltSpot.position.copy(TIP_DOWN)
  meltSpot.visible = false
  root.add(meltSpot)
  let heat = 0
  let melt = 0
  let shownBeads = 0
  const burnSeen = new Set()
  let popClock = 0
  let crackClock = 1

  // the lens of the picture, on a brass arm beside the dish: a bead close up, then its atoms
  const lens = new THREE.Group()
  const lensFace = new THREE.Group()
  const beadView = new THREE.Group()
  const atomView = new THREE.Group()
  let lensBead = null
  let lensCrust = null
  {
    const backing = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), new THREE.MeshBasicMaterial({ color: '#141a3c' }))
    const ringMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.032, 10, 64), ringMat)
    ring.position.z = 0.02
    const gloss = new THREE.Mesh(new THREE.TorusGeometry(LENS.r * 0.82, 0.01, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 }))
    gloss.rotation.z = 1.9
    gloss.position.z = 0.16
    lensFace.add(backing, ring, gloss, beadView, atomView)
    // a bead filling the lens, its white skin growing
    lensBead = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), beadMat)
    lensBead.scale.set(LENS.r * 0.55, LENS.r * 0.55, LENS.r * 0.3)
    lensBead.position.z = 0.04
    lensCrust = new THREE.Mesh(crustGeo, crustMat)
    lensCrust.position.z = 0.04
    beadView.add(lensBead, lensCrust)
    // sodium's atoms: a body-centred cubic slab seen along a cube edge, the picture's purple
    const a = 0.11
    const rA = (Math.sqrt(3) / 4) * a
    const front = []
    const back = []
    for (let i = -4; i <= 4; i++) {
      for (let j = -4; j <= 4; j++) {
        if (Math.hypot(i * a, j * a) < LENS.r - rA - 0.02) front.push([i * a, j * a])
        if (Math.hypot((i + 0.5) * a, (j + 0.5) * a) < LENS.r - rA - 0.02) back.push([(i + 0.5) * a, (j + 0.5) * a])
      }
    }
    const ball = new THREE.SphereGeometry(rA, 18, 12)
    const fm = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: '#a77bff', emissive: '#3a1c80', roughness: 0.35, envMap: env, envMapIntensity: 0.8 }), front.length)
    const bm = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: '#7650d0', emissive: '#24104e', roughness: 0.4 }), back.length)
    front.forEach(([x, y], i) => {
      dummy.position.set(x, y, 0.1)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      fm.setMatrixAt(i, dummy.matrix)
    })
    back.forEach(([x, y], i) => {
      dummy.position.set(x, y, 0.1 - a / 2)
      dummy.updateMatrix()
      bm.setMatrixAt(i, dummy.matrix)
    })
    atomView.add(bm, fm)
    // the shared electrons, drifting among them
    const EL = 46
    const elPos = new Float32Array(EL * 3)
    const elSeed = Array.from({ length: EL }, (_, i) => [hash(9, i), hash(9, i, 1), hash(9, i, 2)])
    const elGeo = new THREE.BufferGeometry()
    elGeo.setAttribute('position', new THREE.BufferAttribute(elPos, 3))
    const els = new THREE.Points(elGeo, new THREE.PointsMaterial({ map: soft, color: new THREE.Color('#8fe4ff').multiplyScalar(1.6), size: 0.04, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
    els.frustumCulled = false
    // never hit by a tap: three's raycaster catches Points within 1 m (its default threshold), so the
    // electrons took taps meant for the wire beside the lens
    els.raycast = () => {}
    atomView.add(els)
    atomView.userData.drift = t => {
      for (let i = 0; i < EL; i++) {
        const [p, q, w] = elSeed[i]
        const ang = p * TAU + t * (0.3 + q * 0.5) * (w < 0.5 ? 1 : -1)
        const rr = (0.15 + 0.8 * q) * (LENS.r - 0.05)
        elPos[i * 3] = Math.cos(ang) * rr + Math.sin(t * 1.3 + p * 9) * 0.03
        elPos[i * 3 + 1] = Math.sin(ang) * rr + Math.cos(t * 1.1 + q * 9) * 0.03
        elPos[i * 3 + 2] = 0.16
      }
      elGeo.attributes.position.needsUpdate = true
    }
    lensFace.position.y = LENS.y
    lens.add(lensFace)
    // the arm: a brass post from a foot on the bench
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, LENS.y - LENS.r - TABLE.top + 0.02, 8), mats.brass)
    post.position.y = TABLE.top + (LENS.y - LENS.r - TABLE.top) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.025, 18), mats.brass)
    foot.position.y = TABLE.top + 0.012
    lens.add(post, foot)
    lens.position.set(LENS.x, 0, LENS.z)
    lens.rotation.y = Math.atan2(0.15 - LENS.x, -2.4 - LENS.z)
    root.add(lens)
  }
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LENS.r + 0.04, 24), ghost)
  lensHit.position.z = 0.2
  lensFace.add(lensHit)
  let lensK = 0
  let lensShown = 0

  // a visitor's step, from a tap on the wire (or the soda), a bead, the lens, or the panel's buttons
  const visibleBeads = () => shownBeads
  const sodaPanel = lv => ({
    title: E.soda.title,
    color,
    blocks: [
      { buttons: ['wire', 'bead', 'atoms'].map(k => ({ label: E.soda.buttons[k], onClick: () => sodaStep(k) })) },
      ...E.soda.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  function sodaStep(what) {
    const lv = level()
    const p = pairs()
    if (what === 'wire') {
      S.down = S.down ? 0 : 1
      if (p > 0) {
        burst(TIP_DOWN, Math.round(4 + 22 * (p / FULL)), SPARK_BLUE, 0.5 + p / FULL)
        flash = 0.4 + p / FULL
        play('crack')
      } else play('tap')
      mine = true
      syncSplit()
      let line = null
      if (!S.down) line = E.soda.says.lift
      else if (!p) line = E.soda.says.none
      else if (p < 100) line = E.soda.says.warm
      else if (p < FULL) line = E.soda.says.strong
      if (line) say(fill(at(line, lv), { pairs: p }))
    } else if (what === 'bead' || what === 'lens' || what === 'atoms') {
      const next = what === 'bead' ? 1 : what === 'atoms' ? 2 : (S.lens + 1) % 3
      if (next > 0 && !visibleBeads() && !S.lens) return say(at(E.soda.says.noBeads, lv))
      if (next === S.lens && what !== 'lens') return say(at(next === 1 ? E.soda.says.bead : E.soda.says.atoms, lv))
      S.lens = next
      S.lt = 0
      play(next ? 'select' : 'tap')
      say(at(next === 1 ? E.soda.says.bead : next === 2 ? E.soda.says.atoms : E.soda.says.close, lv))
    } else return
    ex.discover('soda', sodaPanel, 3.4)
    share('soda')
  }
  const beadHit = new THREE.Mesh(new THREE.CylinderGeometry(DISH.r + 0.02, DISH.r + 0.02, 0.06, 24, 1, true), ghost)
  beadHit.position.set(DISH.x, DISH.y + 0.025, DISH.z)
  root.add(beadHit)
  clickable(arm, () => sodaStep('wire'))
  clickable(lump, () => sodaStep('wire'))
  clickable(beadHit, () => sodaStep('bead'), { when: () => visibleBeads() > 0 })
  clickable(lensFace, () => sodaStep('lens'), { when: () => visibleBeads() > 0 || S.lens > 0 })
  ex.add({
    id: 'soda',
    x: 0.3,
    z: -3.15,
    radius: 1.5,
    manual: true,
    label: E.soda.label,
    verb: () => {
      const H = E.soda.hints
      if (S.lens === 1) return H.atoms
      if (S.lens === 2) return H.lens
      if (visibleBeads() > 0) return H.bead
      if (!S.down) return H.touch
      return pairs() < FULL ? H.weak : H.watch
    },
    focus: { x: 0.12, y: 1.12, z: -4.35, size: 1.15 },
    act: () => ctx.showPanel(sodaPanel),
  })
  const ATOP = new THREE.Vector3(TIP_DOWN.x, TIP_DOWN.y, TIP_DOWN.z)
  function poseSoda(dt, t) {
    if (S.seed) S.age += dt
    popClock -= dt
    if (S.lens) S.lt += dt
    const p = pairs()
    const flowing = S.down && p > 0
    const split = splitting() && S.down && p >= FULL
    // the wire slides down or up
    armLift = damp(armLift, S.down ? 0 : LIFT, 9, dt)
    arm.position.copy(armFrom).setY(armY(armLift))
    stretch(flex, flexTop, tmpV.set(STAND.x, armY(armLift) + 0.02, STAND.z))
    // the current along the leads
    const k = flowing ? 0.35 + 0.65 * (p / FULL) : 0
    dotMat.opacity = damp(dotMat.opacity, k, 4, dt)
    dotRun = (dotRun + dt * (0.04 + 0.12 * (p / FULL))) % 1
    for (let i = 0; i < DOTS; i++) {
      const u = (i / DOTS + dotRun) % 1
      leadPlus.getPointAt(1 - u, tmpV)
      dotPos.set([tmpV.x, tmpV.y, tmpV.z], i * 3)
      leadMinus.getPointAt(u, tmpV)
      dotPos.set([tmpV.x, tmpV.y, tmpV.z], (DOTS + i) * 3)
    }
    dotGeo.attributes.position.needsUpdate = true
    // warmth, then the melt where the wire touches
    heat = damp(heat, flowing ? p / FULL : 0, 1.2, dt)
    melt = damp(melt, split ? 1 : 0, 1.5, dt)
    lumpMat.emissiveIntensity = heat * 0.05
    const formed = S.on.reduce((s, [a, b]) => s + ((b < 0 ? S.age : b) - a), 0)
    lump.scale.setScalar(1 - 0.12 * clamp(formed / 120))
    meltSpot.visible = melt > 0.02
    meltSpot.scale.set(0.028 * melt, 0.008 * melt, 0.026 * melt)
    meltSpot.position.copy(ATOP).setY(DISH.y + LUMP_TOP * lump.scale.y - 0.004)
    steam.forEach(st => {
      const u = (t * 0.35 + st.ph) % 1
      st.s.position.set(DISH.x + Math.sin(u * 7 + st.ph * 20) * 0.03, DISH.y + LUMP_TOP + 0.02 + u * 0.35, DISH.z + Math.cos(u * 5 + st.ph * 9) * 0.03)
      st.s.scale.setScalar(0.05 + u * 0.16)
      st.s.material.opacity = heat * 0.22 * Math.sin(Math.PI * u)
    })
    // oxygen bubbles at the top while it splits
    if (split && bubList.length < BUB && Math.random() < dt * 22) {
      const ang = Math.random() * TAU
      const rr = Math.random() * 0.025
      bubList.push({ x: ATOP.x + Math.cos(ang) * rr, z: ATOP.z + Math.sin(ang) * rr, y: DISH.y + LUMP_TOP * lump.scale.y, v: 0.03 + Math.random() * 0.05, r: 0.003 + Math.random() * 0.005, life: 0.3 + Math.random() * 0.5 })
    }
    for (let i = bubList.length - 1; i >= 0; i--) {
      const b = bubList[i]
      b.y += b.v * dt
      if ((b.life -= dt) < 0) bubList.splice(i, 1)
    }
    bubbles.count = bubList.length
    bubList.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(b.r * Math.min(1, b.life * 4))
      dummy.updateMatrix()
      bubbles.setMatrixAt(i, dummy.matrix)
    })
    bubbles.instanceMatrix.needsUpdate = true
    // a crackle at the wire now and then while it splits
    if (split && (crackClock -= dt) < 0) {
      crackClock = 0.7 + Math.random() * 1.6
      burst(ATOP, 5, SPARK_BLUE, 0.5)
    }
    // the beads
    let n = 0
    let burning = 0
    const scale = lump.scale.x
    const place = (b, idx, shrink = 1) => {
      const r = b.r * b.grow * shrink * (b.burn >= 0 ? 1 - ease(clamp(b.burn * 1.3)) : 1)
      const x = DISH.x + Math.cos(b.a) * (BASE_R.x * scale + b.r * 0.7)
      const z = DISH.z + Math.sin(b.a) * (BASE_R.z * scale + b.r * 0.7)
      dummy.position.set(x, DISH.y + b.r * 0.85, z)
      dummy.rotation.set(0, b.a, 0)
      dummy.scale.set(r, r * 0.9, r)
      dummy.updateMatrix()
      beads.setMatrixAt(idx, dummy.matrix)
      // the white skin: a bumpy shell that grows through the bead's surface, patch by patch
      dummy.scale.multiplyScalar(b.crust > 0 ? 0.92 + 0.13 * b.crust : 0.001)
      dummy.updateMatrix()
      crusts.setMatrixAt(idx, dummy.matrix)
      return dummy.position
    }
    for (let s = 0; s < SLOTS; s++) {
      const j = latestIn(s)
      const b = beadNow(j)
      flames[s].visible = false
      if (b) {
        const pos = place(b, n++).clone()
        if (b.burn >= 0) {
          burning++
          const fk = Math.sin(Math.PI * clamp(b.burn))
          flames[s].visible = true
          flames[s].position.copy(pos)
          flames[s].scale.set(0.07 * fk * (1 + Math.sin(t * 31 + s) * 0.15), 0.17 * fk * (1 + Math.sin(t * 23 + s) * 0.12), 1)
          if (!burnSeen.has(j)) {
            burnSeen.add(j)
            if (b.burn < 0.3) {
              burst(pos, b.bursts ? 16 : 5, SPARK_FIRE, b.bursts ? 1.3 : 0.6, 0.8)
              if (popClock <= 0) {
                popClock = 0.25
                play('pop')
              }
              flash = Math.max(flash, 0.8)
            }
          }
          if (b.bursts && Math.random() < dt * 14) burst(pos, 1, SPARK_FIRE, 1.1, 0.9)
        }
        // the bead it replaced shrinks away
        const prev = beadNow(j - SLOTS)
        if (prev && b.tau < 0.5 && !prev.burns && n < SLOTS * 2) place(prev, n++, 1 - b.tau / 0.5)
      }
    }
    if (n !== shownBeads) shownBeads = n
    beads.count = crusts.count = n
    beads.instanceMatrix.needsUpdate = true
    crusts.instanceMatrix.needsUpdate = true
    if (burnSeen.size > 200) burnSeen.clear()
    // the first beads: told to whoever made it happen
    if (split && n > 0 && !toldSplit) {
      toldSplit = true
      if (mine) say(at(E.soda.says.splits, level()))
    }
    flash = Math.max(0, flash - dt * 3)
    dishLight.intensity = Math.min(1.2, burning * 0.35) + flash * 0.8
    // the sparks
    for (let i = 0; i < SPARKS; i++) {
      const s = sparkList[i]
      if (s.life > 0) {
        s.life -= dt
        s.v.y -= 3.5 * dt
        s.p.addScaledVector(s.v, dt)
        const f = Math.max(0, s.life / s.max)
        sparkPos.set([s.p.x, s.p.y, s.p.z], i * 3)
        sparkCol.set([s.c.r * f, s.c.g * f, s.c.b * f], i * 3)
      } else {
        sparkPos[i * 3 + 1] = -5
        sparkCol.set([0, 0, 0], i * 3)
      }
    }
    sparkGeo.attributes.position.needsUpdate = true
    sparkGeo.attributes.color.needsUpdate = true
    // the lens: what it shows comes up, its bead's white skin grows
    if (S.lens !== lensShown) {
      lensShown = S.lens
      lensK = 0
    }
    lensK = Math.min(1, lensK + dt / 0.45)
    const lk = ease(lensK)
    beadView.visible = S.lens === 1
    atomView.visible = S.lens === 2
    beadView.scale.setScalar(0.5 + 0.5 * lk)
    atomView.scale.setScalar(0.6 + 0.4 * lk)
    // the white skin spreads, but a little of the shine stays to the end
    const ck = 0.8 * clamp((S.lt - 2.2) / 12)
    lensCrust.scale.set(LENS.r * 0.55 * (0.9 + 0.16 * ck), LENS.r * 0.55 * (0.9 + 0.16 * ck), LENS.r * 0.3 * (0.9 + 0.16 * ck))
    lensCrust.visible = ck > 0
    lensBead.rotation.y = t * 0.3
    lensCrust.rotation.y = t * 0.3
    atomView.rotation.set(Math.sin(t * 0.4) * 0.12, Math.sin(t * 0.5) * 0.2, 0)
    if (atomView.visible) atomView.userData.drift(t)
  }
  updates.push(poseSoda)
  const sodaState = () => ({ down: S.down, seed: S.seed, age: round1(S.age), on: S.on.map(([a, b]) => [a, b]), lens: S.lens, lt: round1(S.lt) })
  const sodaSet = (s, liveSet, ago = 0) => {
    const wasDown = S.down
    S.down = s?.down ? 1 : 0
    S.seed = Math.max(0, Math.round(Number(s?.seed) || 0))
    S.on = (Array.isArray(s?.on) ? s.on : [])
      .filter(r => Array.isArray(r) && r.length === 2)
      .map(([a, b]) => [Math.max(0, Number(a) || 0), Number(b) >= 0 ? Number(b) : -1])
      .slice(-4)
    const run = Math.min(Number(ago) || 0, 3600)
    S.age = S.seed ? Math.max(0, Number(s?.age) || 0) + run : 0
    S.lens = [0, 1, 2].includes(s?.lens) ? s.lens : 0
    S.lt = S.lens ? Math.max(0, Number(s?.lt) || 0) + run : 0
    // someone else's experiment now: what happens next is theirs to be told
    mine = false
    toldSplit = true
    if (liveSet && S.down !== wasDown) {
      if (pairs() > 0) {
        burst(TIP_DOWN, Math.round(4 + 22 * (pairs() / FULL)), SPARK_BLUE, 0.5 + pairs() / FULL)
        flash = 0.6
        play('crack')
      } else play('tap')
    }
    if (!liveSet) {
      armLift = S.down ? 0 : LIFT
      lensK = 1
      lensShown = S.lens
      // beads that burnt before this visitor came are not burnt again
      for (let s2 = 0; s2 < SLOTS; s2++) {
        const j = latestIn(s2)
        if (j >= 0) burnSeen.add(j)
      }
    }
  }

  // ======== Davy's desk: the notebook, and a model of a Downs cell ========
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(DESK.w, 0.05, DESK.d, 2, 0.012), mats.wood)
    top.position.set(DESK.x, DESK.top - 0.025, DESK.z)
    root.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, DESK.top - 0.05, 0.06), mats.beam)
        leg.position.set(DESK.x + sx * (DESK.w / 2 - 0.06), (DESK.top - 0.05) / 2, DESK.z + sz * (DESK.d / 2 - 0.06))
        root.add(leg)
      }
    }
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, DESK.d - 0.3), mats.beam)
    drawer.position.set(DESK.x - DESK.w / 2 - 0.005, DESK.top - 0.12, DESK.z)
    root.add(drawer)
    solids.push(box(DESK.x, DESK.z, DESK.w, DESK.d))
    // a chair
    const chair = new THREE.Group()
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), mats.wood)
    seat.position.y = 0.46
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.42), mats.wood)
    back.position.set(0.2, 0.72, 0)
    chair.add(seat, back)
    for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.46, 0.035), mats.beam)
      leg.position.set(lx, 0.23, lz)
      chair.add(leg)
    }
    chair.position.set(DESK.x + 0.62, 0, DESK.z + 0.55)
    chair.rotation.y = 0.3
    root.add(chair)
    solids.push(circle(DESK.x + 0.62, DESK.z + 0.55, 0.3))
    candle(DESK.x + 0.15, DESK.top, DESK.z - 0.6, { glow: 2.2, reach: 6 })
    // the inkwell and the quill
    const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.05, 12), new THREE.MeshStandardMaterial({ color: '#1a1a22', roughness: 0.2, metalness: 0.2 }))
    ink.position.set(DESK.x + 0.15, DESK.top + 0.025, DESK.z + 0.5)
    const quill = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.3, 6), new THREE.MeshStandardMaterial({ color: '#efe8da', roughness: 0.8 }))
    quill.position.set(DESK.x + 0.13, DESK.top + 0.17, DESK.z + 0.52)
    quill.rotation.set(0.3, 0, -0.45)
    root.add(ink, quill)
  }
  // the notebook, open on a slanted reading stand, its pages facing the room
  const PAGE = { w: 0.29, h: 0.4 }
  const book = new THREE.Group()
  const spreadTex = canvasTex(1024, 704, () => {}, { mipmaps: true })
  textures.push(spreadTex)
  const leafTex = canvasTex(512, 704, (g, w, h) => {
    g.fillStyle = '#e6d8b8'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(70,45,25,0.35)'
    g.lineWidth = 2
    const r = random(77)
    for (let y = 80; y < h - 60; y += 34) {
      g.beginPath()
      let x = 50
      g.moveTo(x, y)
      while (x < w - 50 - r() * 80) {
        x += 6 + r() * 6
        g.lineTo(x, y + Math.sin(x * 0.4) * 3 + (r() - 0.5) * 3)
      }
      g.stroke()
    }
  })
  textures.push(leafTex)
  // the pages: sketches in ink and lines of handwriting (no words: Davy's own are not ours to write)
  function drawSpread(page) {
    spreadTex.userData.redraw((g, w, h) => {
      const grd = g.createLinearGradient(0, 0, w, 0)
      grd.addColorStop(0, '#d9c8a2')
      grd.addColorStop(0.08, '#ead9b6')
      grd.addColorStop(0.47, '#e2d1ac')
      grd.addColorStop(0.5, '#b8a27a')
      grd.addColorStop(0.53, '#e2d1ac')
      grd.addColorStop(0.92, '#ead9b6')
      grd.addColorStop(1, '#d9c8a2')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#3a2614'
      g.fillStyle = '#3a2614'
      g.lineCap = 'round'
      g.lineJoin = 'round'
      const r = random(101 + page * 13)
      const scrawl = (x0, x1, y0, y1, gap = 30) => {
        g.lineWidth = 2.2
        for (let y = y0; y < y1; y += gap) {
          let x = x0 + (y === y0 ? 30 : 0)
          const end = x1 - r() * 70
          while (x < end) {
            const word = 18 + r() * 46
            g.beginPath()
            g.moveTo(x, y)
            for (let u = 0; u < word; u += 3) g.lineTo(x + u, y + Math.sin((x + u) * 0.55 + r() * 2) * (3 + r() * 3) - (r() < 0.08 ? 8 : 0))
            g.stroke()
            x += word + 8 + r() * 8
          }
        }
      }
      g.lineWidth = 3
      const L = 60
      const R = w / 2 + 50
      if (page === 0) {
        // the dish, the lump, the wire from above, globules round its foot, two of them aflame
        g.beginPath()
        g.ellipse(L + 200, 330, 150, 26, 0, 0, TAU)
        g.stroke()
        g.beginPath()
        g.moveTo(L + 110, 325)
        g.quadraticCurveTo(L + 120, 230, L + 190, 214)
        g.quadraticCurveTo(L + 280, 222, L + 296, 325)
        g.stroke()
        g.beginPath()
        g.moveTo(L + 200, 90)
        g.lineTo(L + 200, 214)
        g.stroke()
        for (const [x, y, rr] of [[L + 92, 334, 9], [L + 128, 344, 7], [L + 262, 346, 8], [L + 308, 332, 10], [L + 180, 350, 6]]) {
          g.beginPath()
          g.arc(x, y, rr, 0, TAU)
          g.stroke()
        }
        for (const [x, y] of [[L + 92, 318], [L + 308, 314]]) {
          g.beginPath()
          g.moveTo(x - 9, y)
          g.quadraticCurveTo(x - 6, y - 26, x, y - 40)
          g.quadraticCurveTo(x + 6, y - 26, x + 9, y)
          g.stroke()
        }
        for (const [x, y] of [[L + 190, 196], [L + 210, 184], [L + 200, 168]]) {
          g.beginPath()
          g.arc(x, y, 5, 0, TAU)
          g.stroke()
        }
        scrawl(L, w / 2 - 40, 450, 650)
        scrawl(R, w - 50, 80, 650)
      } else if (page === 1) {
        // a trough of plates, and the wire to the dish
        g.strokeRect(L + 20, 150, 360, 80)
        for (let x = L + 36; x < L + 370; x += 16) {
          g.beginPath()
          g.moveTo(x, 156)
          g.lineTo(x, 224)
          g.stroke()
        }
        g.beginPath()
        g.moveTo(L + 20, 190)
        g.bezierCurveTo(L - 20, 300, L + 160, 360, L + 260, 330)
        g.stroke()
        g.beginPath()
        g.ellipse(L + 300, 340, 70, 14, 0, 0, TAU)
        g.stroke()
        scrawl(L, w / 2 - 40, 430, 650)
        scrawl(R, w - 50, 80, 300)
        // a globule drawn larger, shining
        g.beginPath()
        g.arc(R + 200, 420, 54, 0, TAU)
        g.stroke()
        g.beginPath()
        g.arc(R + 182, 402, 14, Math.PI * 1.1, Math.PI * 1.7)
        g.stroke()
        scrawl(R, w - 50, 520, 650)
      } else {
        // four little flasks
        for (let i = 0; i < 4; i++) {
          const x = L + 50 + i * 95
          g.beginPath()
          g.moveTo(x - 12, 120)
          g.lineTo(x - 12, 190)
          g.lineTo(x - 38, 260)
          g.quadraticCurveTo(x, 280, x + 38, 260)
          g.lineTo(x + 12, 190)
          g.lineTo(x + 12, 120)
          g.stroke()
          g.beginPath()
          g.arc(x, 248, 7, 0, TAU)
          g.fill()
        }
        scrawl(L, w / 2 - 40, 340, 650)
        scrawl(R, w - 50, 80, 650)
      }
    })
  }
  const leaf = new THREE.Group()
  {
    const lectern = new THREE.Mesh(new THREE.BoxGeometry(PAGE.w * 2 + 0.08, 0.04, PAGE.h + 0.06), mats.beam)
    lectern.position.y = -0.03
    const cover = new THREE.Mesh(new THREE.BoxGeometry(PAGE.w * 2 + 0.03, 0.012, PAGE.h + 0.02), new THREE.MeshStandardMaterial({ color: '#4a2418', roughness: 0.7 }))
    cover.position.y = -0.006
    const blockL = new THREE.Mesh(new THREE.BoxGeometry(PAGE.w, 0.018, PAGE.h), new THREE.MeshStandardMaterial({ color: '#d9c9a4', roughness: 0.9 }))
    blockL.position.set(-PAGE.w / 2, 0.009, 0)
    const blockR = blockL.clone()
    blockR.position.x = PAGE.w / 2
    const spread = new THREE.Mesh(new THREE.PlaneGeometry(PAGE.w * 2, PAGE.h), new THREE.MeshStandardMaterial({ map: spreadTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: spreadTex, emissiveIntensity: 0.12 }))
    spread.rotation.x = -Math.PI / 2
    spread.position.y = 0.0185
    // the leaf that turns over the spine
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(PAGE.w, PAGE.h).translate(PAGE.w / 2, 0, 0), new THREE.MeshStandardMaterial({ map: leafTex, roughness: 0.9, side: THREE.DoubleSide }))
    sheet.rotation.x = -Math.PI / 2
    leaf.add(sheet)
    leaf.position.y = 0.02
    leaf.visible = false
    const hit = new THREE.Mesh(new THREE.BoxGeometry(PAGE.w * 2 + 0.1, 0.12, PAGE.h + 0.08), ghost)
    book.add(lectern, cover, blockL, blockR, spread, leaf, hit)
    // on the desk, tilted toward a reader standing in the room
    const tilt = new THREE.Group()
    tilt.rotation.x = 0.32
    tilt.add(book)
    const holder = new THREE.Group()
    holder.add(tilt)
    holder.position.set(DESK.x - 0.08, DESK.top + 0.1, DESK.z + 0.05)
    holder.rotation.y = -Math.PI / 2
    root.add(holder)
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, PAGE.w * 2), mats.beam)
    prop.position.set(DESK.x + 0.02, DESK.top + 0.05, DESK.z + 0.05)
    root.add(prop)
  }
  drawSpread(0)

  // the model of a Downs cell on a little round table: cut open toward the room
  const downs = new THREE.Group()
  const cellParts = {}
  {
    const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 28), mats.wood)
    tbl.position.set(DOWNS.x, DOWNS.top - 0.02, DOWNS.z)
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, DOWNS.top - 0.04, 10), mats.beam)
    ped.position.set(DOWNS.x, (DOWNS.top - 0.04) / 2, DOWNS.z)
    const pedFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 18), mats.beam)
    pedFoot.position.set(DOWNS.x, 0.02, DOWNS.z)
    root.add(tbl, ped, pedFoot)
    solids.push(circle(DOWNS.x, DOWNS.z, 0.36))
    const gap = { start: Math.PI / 4, len: Math.PI * 1.5 }
    const steel = new THREE.MeshStandardMaterial({ color: '#6c7076', roughness: 0.45, metalness: 0.75, side: THREE.DoubleSide, envMap: env, envMapIntensity: 0.8 })
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 40, 1, true, gap.start, gap.len), steel)
    outer.position.y = 0.15
    const lining = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.3, 40, 1, true, gap.start, gap.len), new THREE.MeshStandardMaterial({ color: '#b08060', roughness: 0.9, side: THREE.DoubleSide }))
    lining.position.y = 0.15
    const floorDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 40), steel)
    floorDisc.position.y = 0.01
    // the melt, glowing dull orange at 600 °C, seen through the cut
    const meltMat = new THREE.MeshStandardMaterial({ color: '#4a1606', emissive: '#ff5a1a', emissiveIntensity: 0.7, roughness: 0.3, transparent: true, opacity: 0.72, depthWrite: false })
    const meltC = new THREE.Mesh(new THREE.CylinderGeometry(0.183, 0.183, 0.2, 40, 1, false, gap.start, gap.len), meltMat)
    meltC.position.y = 0.12
    meltC.renderOrder = 3
    const face = (ang) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.183, 0.2).translate(0.0915, 0, 0), meltMat)
      m.rotation.y = ang - Math.PI / 2
      m.position.y = 0.12
      m.renderOrder = 3
      return m
    }
    // cut faces: the slice is open between angles -pi/4 and pi/4 (round +z)
    const faceA = face(gap.start)
    const faceB = face(gap.start + gap.len)
    // the graphite anode in the middle, the steel gauze round it, the iron cathode ring round that
    const anode = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.26, 16), new THREE.MeshStandardMaterial({ color: '#2a2a2d', roughness: 0.8 }))
    anode.position.y = 0.13
    const gauze = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.18, 24, 6, true), new THREE.MeshBasicMaterial({ color: '#5e6268', wireframe: true, transparent: true, opacity: 0.45 }))
    gauze.position.y = 0.12
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.15, 32, 1, true, gap.start, gap.len), new THREE.MeshStandardMaterial({ color: '#4a4c52', roughness: 0.5, metalness: 0.7, side: THREE.DoubleSide }))
    cathode.position.y = 0.11
    // the hood over the anode with its chlorine pipe; the collector ring over the cathode with its pipe
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.09, 24, 1, true), steel)
    hood.position.y = 0.27
    const clPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 10), steel)
    clPipe.position.y = 0.42
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 40), steel)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.235
    const naPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 10), steel)
    naPipe.rotation.z = Math.PI / 2
    naPipe.position.set(-0.24, 0.235, 0)
    downs.add(outer, lining, floorDisc, meltC, faceA, faceB, anode, gauze, cathode, hood, clPipe, ring, naPipe)
    const tag = (text, x, y, z, size = 0.05) => {
      const t = makeText(text, { size, color: '#ffe2b8', anchorY: 'middle' })
      t.position.set(x, y, z)
      downs.add(t)
      return t
    }
    tag(E.downs.labels.cl, 0, 0.6, 0.02)
    tag(E.downs.labels.na, -0.27, 0.32, 0.12)
    tag(E.downs.labels.sign, 0, -0.04, 0.36, 0.045)
    // what rises: chlorine bubbles round the anode, sodium droplets off the cathode
    const CLB = 18
    const NAD = 14
    const clMat = new THREE.MeshStandardMaterial({ color: '#d8ee6a', emissive: '#6a7a10', emissiveIntensity: 0.5, transparent: true, opacity: 0.85, roughness: 0.2 })
    const cl = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), clMat, CLB)
    const na = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), beadMat, NAD)
    cl.frustumCulled = na.frustumCulled = false
    cl.renderOrder = na.renderOrder = 4
    downs.add(cl, na)
    Object.assign(cellParts, { meltMat, cl, na, CLB, NAD })
    downs.position.set(DOWNS.x, DOWNS.top, DOWNS.z)
    downs.scale.setScalar(1.35)
    // the open cut faces the room
    downs.rotation.y = Math.atan2(3.6 - DOWNS.x, -3.4 - DOWNS.z)
    root.add(downs)
  }
  const downsHit = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.62, 12), ghost)
  downsHit.position.y = 0.28
  downs.add(downsHit)
  const D = { page: 0, downs: 0 }
  let turn = null // { t, to }: the leaf turning
  let readHere = false // this visitor has read the open page
  let downsSeen = false
  let downsK = 0
  let downsClock = 0
  const pagePanel = lv => {
    const pg = E.notebook.pages[D.page]
    return {
      title: pg.title,
      color,
      blocks: [
        ...pg[depthOf(lv)].map(p => ({ p })),
        { buttons: [{ label: E.notebook.buttons.page, onClick: () => deskStep('page') }, { label: D.downs ? E.notebook.buttons.stop : E.notebook.buttons.downs, onClick: () => deskStep('downs') }] },
      ],
    }
  }
  const downsPanel = lv => ({
    title: E.downs.title,
    color,
    blocks: [
      { buttons: [{ label: D.downs ? E.notebook.buttons.stop : E.notebook.buttons.downs, onClick: () => deskStep('downs') }] },
      ...E.downs.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const startTurn = to => {
    turn = { t: 0, to }
    play('tap')
  }
  // a visitor's step: a tap on the notebook (the first shows its page, then each turns to the next) or
  // on the model of the Downs cell (on or off), or the panel's buttons
  function deskStep(what) {
    const lv = level()
    if (what === 'book') what = readHere ? 'page' : 'read'
    if (what === 'read') {
      readHere = true
      ctx.showPanel(pagePanel)
    } else if (what === 'page') {
      if (turn) return say(at(W.busy, lv))
      readHere = true
      D.page = (D.page + 1) % E.notebook.pages.length
      startTurn(D.page)
      ctx.showPanel(pagePanel)
    } else if (what === 'downs') {
      D.downs = D.downs ? 0 : 1
      downsSeen = true
      say(at(D.downs ? E.downs.says.on : E.downs.says.off, lv))
      play(D.downs ? 'select' : 'tap')
      ctx.showPanel(downsPanel)
    } else return
    ex.discover('notebook')
    if (what !== 'read') share('desk')
  }
  clickable(book, () => deskStep('book'))
  clickable(downs, () => deskStep('downs'))
  ex.add({
    id: 'notebook',
    x: 3.75,
    z: -2.95,
    radius: 2.0,
    manual: true,
    label: E.notebook.label,
    verb: () => (readHere && !downsSeen ? E.notebook.hints.downs : E.notebook.hints.page),
    focus: { x: 5.15, y: 1.0, z: -3.2, size: 2.3 },
    act: () => {
      readHere = true
      ctx.showPanel(pagePanel)
    },
  })
  updates.push((dt, t) => {
    if (turn) {
      turn.t += dt
      const k = span(0, 0.7, turn.t)
      leaf.visible = turn.t < 0.72
      leaf.rotation.z = k * Math.PI
      if (turn.t > 0.35 && !turn.drawn) {
        turn.drawn = true
        drawSpread(turn.to)
      }
      if (turn.t > 0.75) turn = null
    }
    // the Downs cell: chlorine and sodium rise while it runs
    downsK = damp(downsK, D.downs, 3, dt)
    downsClock += dt * downsK
    const { meltMat, cl, na, CLB, NAD } = cellParts
    meltMat.emissiveIntensity = 0.55 + 0.25 * downsK + Math.sin(t * 2.3) * 0.04
    for (let i = 0; i < CLB; i++) {
      const u = (downsClock * (0.5 + hash(3, i) * 0.4) + hash(3, i, 1)) % 1
      const a = hash(3, i, 2) * TAU
      dummy.position.set(Math.cos(a) * (0.045 + 0.02 * u), 0.04 + u * 0.21, Math.sin(a) * (0.045 + 0.02 * u))
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(downsK * (0.007 + 0.006 * u))
      dummy.updateMatrix()
      cl.setMatrixAt(i, dummy.matrix)
    }
    for (let i = 0; i < NAD; i++) {
      const u = (downsClock * (0.25 + hash(4, i) * 0.2) + hash(4, i, 1)) % 1
      const a = hash(4, i, 2) * TAU
      dummy.position.set(Math.cos(a) * 0.12, 0.05 + u * 0.18, Math.sin(a) * 0.12)
      dummy.scale.setScalar(downsK * 0.011)
      dummy.updateMatrix()
      na.setMatrixAt(i, dummy.matrix)
    }
    cl.instanceMatrix.needsUpdate = true
    na.instanceMatrix.needsUpdate = true
  })
  const deskSet = (s, liveSet) => {
    const page = clamp(Math.round(Number(s?.page) || 0), 0, E.notebook.pages.length - 1)
    D.downs = s?.downs ? 1 : 0
    if (page !== D.page) {
      D.page = page
      if (liveSet) startTurn(page)
      else {
        turn = null
        drawSpread(page)
      }
    }
    if (!liveSet) downsK = D.downs
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: { ...stage.env, background: new THREE.Color('#080605'), fog: new THREE.Fog('#0a0806', 12, 34), bloom: { strength: 0.7, radius: 0.5, threshold: 0.82 } },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    spawn: { x: 0, z: 3.0, yaw: 0 },
    hostSpot: { x: -1.7, z: 2.2, yaw: Math.atan2(-1.7, -0.8) },
    back: { x: 0, z: 5.8, rot: Math.PI },
    stand: { x: 2.5, z: 1.6, rot: Math.atan2(-2.5, 1.4) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      battery: {
        tap: i => batteryStep(i), // a trough (0 to 9), or 'next' (the panel's button)
        set: n => setCount(n, true), // the panel's slider
        get on() { return [...on] },
        get pairs() { return pairs() },
        at: i => troughTop(troughs[i]),
      },
      soda: {
        tap: what => sodaStep(what), // 'wire' (the wire or the soda), 'bead', 'lens'; or 'atoms' (the panel)
        get state() { return sodaState() },
        get beads() { return visibleBeads() },
        wireAt: () => new THREE.Vector3(TIP_DOWN.x, armY(armLift) - WIRE_L / 2, TIP_DOWN.z),
        beadAt: () => new THREE.Vector3(DISH.x, DISH.y + 0.015, DISH.z + BASE_R.z + 0.012),
        lensAt: () => lensFace.getWorldPosition(new THREE.Vector3()),
      },
      desk: {
        tap: what => deskStep(what), // 'book' (the notebook), 'downs' (the model); or 'page' (the panel)
        get page() { return D.page },
        get downs() { return D.downs },
        bookAt: () => book.getWorldPosition(new THREE.Vector3()),
        downsAt: () => downs.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, 0)),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { battery: batteryPanel, soda: sodaPanel, notebook: pagePanel, downs: downsPanel },
    shared: {
      battery: {
        get: batteryState,
        set: (s, liveSet) => batterySet(s, liveSet),
      },
      soda: { get: sodaState, set: sodaSet },
      desk: { get: () => ({ page: D.page, downs: D.downs }), set: deskSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (countSend) clearTimeout(countSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
