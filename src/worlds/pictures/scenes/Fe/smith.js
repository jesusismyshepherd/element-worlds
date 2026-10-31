// Iron's picture "How did people get iron from rock?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into an Iron Age village at dusk (stages/village.js: round houses, a wattle fence, a stream,
// a wood of dark pines). As in the picture, from left to right: the leather bellows, the clay furnace, the
// heaps of red ore and black charcoal, the anvil on its stump with a glowing bloom, the steaming bucket, a
// round house behind. Three things to do, each step chosen by tapping its thing (the user, 2026-10-30:
// pressing E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel,
// whose buttons and sliders do the same:
// - the bloomery: a clay shaft furnace cut open toward the visitor. Tap the charcoal and ore heaps to load
//   layers (ore alone does nothing, charcoal alone only burns), tap the bellows to pump (an air slider too:
//   a helper pumping steadily). A dial: below about 1100 °C the ore only roasts; above it the bloom grows at
//   the bottom and, near 1200 °C, glowing slag runs out of the arch; the needle never reaches 1538 °C,
//   iron's melting point. The picture's lens: tap it and carbon monoxide takes the oxygen away, step by step
//   (Fe2O3, Fe3O4, FeO, Fe). Tap the arch to break it and pull the bloom out with tongs, onto the anvil.
// - the anvil: tap the bloom to strike it (slag sprays as sparks, the lump flattens into a bar, ten blows);
//   below a yellow heat it would crumble, so tap the hearth to reheat it; a board of glow colours shows its
//   heat. A finished bar, tapped, goes into the hearth; a pile of blooms from earlier smelts gives another.
// - steel and the magnet: the bar in the forge hearth. Tap the hearth for hours in the hot charcoal (a slider
//   too): carbon creeps in, in a lens of iron atoms; tap the hearth's little bellows (or a heat slider);
//   tap the magnet: it clings below 770 °C, iron's Curie point, and lets go above it (smiths today use it
//   as their cue); tap the bucket to quench (steam, and hard if it had carbon and was hot enough); tap the
//   file: it skates on hard steel and bites into soft iron (unquenched, quenched too cool, or no carbon).
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes. Sped up throughout: a real smelt took most
// of a day, consolidating a bloom many heats, carburising hours.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, num, smooth, random } from '../../../wings/noble/kit.js'
import { villageStage } from '../../stages/village.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { SMITH_WORDS } from './smith.words.js'

export const WORDS = SMITH_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const r1 = v => Math.round(v * 10) / 10
const r3 = v => Math.round(v * 1000) / 1000
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- where things stand (metres; the spawn at z = 3.2 looks along -z, into the picture) ----
const FURN = { x: -3.45, z: -3.5, h: 1.62, r0: 0.52, r1: 0.36, bore: 0.19, floor: 0.06 }
const CUT = 0.62 // half the angle of the cut-away, round +z (toward the visitor)
const ARCH = 1.3 // the tapping arch's direction round the furnace (round +x, so the slag runs toward the anvil)
const LAYER = 0.14
const CHARGE0 = 0.36 // the charge's foot: the bloom grows below it, by the tuyere
const MAX_LAYERS = 8
const LUMPS = 16
const KG = 5 // a scoop of ore or of charcoal
const KG_PER_ORE = 1 // iron in the bloom from a scoop of ore (a fifth: experimental smelts give 5 to 45%)
const REBUILD = 5 // seconds to patch the arch
const HEAP = { ore: { x: -2.25, z: -3.9 }, coal: { x: -1.6, z: -3.3 } }
const BELLOWS = { x: -4.75, z: -3.35 }
const DIAL = { x: -2.0, z: -4.65, y: 1.45 }
const LENS1 = { x: -4.95, z: -4.45, y: 1.9, r: 0.42 }
const ANVIL = { x: 0.5, z: -3.15, top: 0.82 }
const PILE = { x: -0.4, z: -3.4 }
const SCALE = { x: 0.35, z: -4.15, y: 1.66 } // above the raised hammer
const HEARTH = { x: 2.05, z: -3.85, top: 0.72, w: 1.05, d: 0.78 }
const HB = { x: 2.78, z: -4.48 } // the hearth's own small bellows
const POST = { x: 2.85, z: -3.05 } // the magnet's post
const BUCKET = { x: 3.55, z: -3.15, r: 0.24, h: 0.44 }
const BLOCK = { x: 4.3, z: -3.7, h: 0.5 }
const LENS2 = { x: 4.95, z: -4.6, y: 1.78, r: 0.36 }
const RACK = { x: 5.3, z: -2.85 }
const SPOT = { bloomery: { x: -3.1, z: -1.3 }, anvil: { x: 0.7, z: -1.65 }, steel: { x: 3.55, z: -1.55 } }
const MAX_BLOWS = 10
const WELD = 1100 // below a yellow heat the bloom crumbles
const CURIE = 770
const facing = (x, z, to) => Math.atan2(to.x - x, to.z - z)

// the glow of hot iron, as smiths see it in the shade (approximate: sources differ by tens of degrees)
const GLOW = [[480, '#000000'], [580, '#3a0600'], [650, '#701000'], [750, '#b8260a'], [850, '#e8420e'], [950, '#ff6a1e'], [1100, '#ffb444'], [1250, '#ffe7a0'], [1400, '#fff8e8']].map(([t, c]) => [t, new THREE.Color(c)])
function glowColor(T, out) {
  if (T <= GLOW[0][0]) return out.setRGB(0, 0, 0)
  for (let i = 1; i < GLOW.length; i++) {
    if (T <= GLOW[i][0]) {
      const [t0, c0] = GLOW[i - 1]
      const [t1, c1] = GLOW[i]
      return out.copy(c0).lerp(c1, (T - t0) / (t1 - t0))
    }
  }
  return out.copy(GLOW[GLOW.length - 1][1])
}
const glowK = T => 0.1 + 1.2 * Math.pow(smooth(500, 1350, T), 1.5)

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false })
}

/** A flame: a teardrop, white at its heart, orange at its edge. */
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

/** The bloom's sponge: bright iron with dark pockets of slag (an emissive map). */
function spongeTex() {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    const r = random(41)
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(60,16,0,${0.35 + r() * 0.5})`
      g.beginPath()
      g.ellipse(r() * w, r() * h, 2 + r() * 8, 2 + r() * 5, r() * 3, 0, TAU)
      g.fill()
    }
  })
}

/** A lumpy ball (a bloom), keeping its UVs. */
function lumpGeometry(seed, rough = 0.18) {
  const g = new THREE.SphereGeometry(1, 28, 18)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = 1 + rough * (Math.sin(v.x * 5.1 + seed) * Math.cos(v.z * 4.3 + seed * 2) * 0.6 + Math.sin(v.y * 7.7 + v.x * 3 + seed) * 0.4)
    v.multiplyScalar(n)
    v.y *= 0.82
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

/** A line of geometry between two points (a cylinder of height 1), for things that move. */
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(1, Math.max(0.001, a.distanceTo(b)), 1)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = villageStage({
    radius: 13.5,
    light,
    houses: [
      { x: 6.0, z: -8.6, r: 2.7 },
      { x: -7.2, z: -7.8, r: 2.4 },
      { x: 9.6, z: -1.2, r: 2.3 },
      { x: -9.4, z: 1.8, r: 2.2 },
    ].map(h => ({ ...h, rot: Math.atan2(-h.x, -h.z) })),
    fence: { r: 13.9, gaps: [[-2.85, -2.45], [1.35, 1.8]] },
    clearings: [[0.6, -3.0, 6.2], [0, 3.6, 2.4]],
    paths: [[[0, 4], [0.4, -1]], [[0.5, -3], [5.0, -6.6]], [[-2, -3], [-6.2, -6.4]], [[3, -1.5], [7.6, -1.0]], [[-2, 0], [-7.4, 1.4]]],
    stream: [[-24, 12], [-19.5, 4], [-18.8, -4], [-16.5, -12], [-9, -19], [0, -22], [10, -24]],
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (p, lv) => p[depth(lv)].map(t => ({ p: t }))
  const soft = softTex()
  const flame = flameTex()
  const sponge = spongeTex()
  textures.push(soft, flame, sponge)
  const tmpV = new THREE.Vector3()
  const tmpC = new THREE.Color()
  const dummy = new THREE.Object3D()
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const iron = new THREE.MeshStandardMaterial({ color: '#3c3f44', roughness: 0.45, metalness: 0.65 })
  const darkWood = new THREE.MeshStandardMaterial({ color: '#3e2c20', roughness: 0.9 })
  const leather = new THREE.MeshStandardMaterial({ color: '#7a5236', roughness: 0.75 })
  const stone = new THREE.MeshStandardMaterial({ color: '#4c4a46', roughness: 0.9 })
  const fmtT = T => `${Math.round(T)} °C`
  const near = () => ctx.engine.player?.near?.id

  /** A hot piece of iron's material: dark metal whose glow follows its temperature. */
  function hotMetal(opts = {}) {
    return new THREE.MeshStandardMaterial({ color: '#45403c', roughness: 0.6, metalness: 0.45, emissive: '#000000', emissiveIntensity: 1, ...opts })
  }
  const setGlow = (mat, T, k = 1) => {
    glowColor(T, mat.emissive)
    mat.emissiveIntensity = glowK(T) * k
  }

  // sparks: the slag squirting from the bloom, sparks from the furnace's mouth
  const SPARKS = light ? 110 : 220
  const sparkPos = new Float32Array(SPARKS * 3)
  const sparkCol = new Float32Array(SPARKS * 3)
  const sparkList = Array.from({ length: SPARKS }, () => ({ life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), c: new THREE.Color() }))
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3))
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ map: soft, size: 0.045, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  sparks.frustumCulled = false
  sparks.raycast = () => {}
  root.add(sparks)
  let sparkNext = 0
  const SPARK = new THREE.Color('#ffb850').multiplyScalar(2.4)
  const SPARK_WHITE = new THREE.Color('#fff2d0').multiplyScalar(2.6)
  const FILINGS = new THREE.Color('#9a9894')
  function burst(from, n, col, speed = 1, up = 0.6, life = 0.8) {
    for (let i = 0; i < n; i++) {
      const s = sparkList[sparkNext]
      sparkNext = (sparkNext + 1) % SPARKS
      const a = Math.random() * TAU
      const e = Math.random() * 0.9 + 0.1
      s.p.copy(from)
      s.v.set(Math.cos(a) * (1 - e), up + e, Math.sin(a) * (1 - e)).normalize().multiplyScalar(speed * (0.4 + Math.random()))
      s.max = s.life = life * (0.4 + Math.random() * 0.7)
      s.c.copy(col)
    }
  }
  updates.push(dt => {
    for (let i = 0; i < SPARKS; i++) {
      const s = sparkList[i]
      if (s.life > 0) {
        s.life -= dt
        s.v.y -= 4 * dt
        s.p.addScaledVector(s.v, dt)
        if (s.p.y < 0.02) {
          s.p.y = 0.02
          s.v.multiplyScalar(0.3)
        }
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
  })

  /** A lens on a wooden post, facing a spot: its ring in the picture's colour, a muted violet inside. */
  function lensOn(L, spot) {
    const g = new THREE.Group()
    const face = new THREE.Group()
    const back = new THREE.Mesh(new THREE.CircleGeometry(L.r, 48), new THREE.MeshBasicMaterial({ color: '#3e3352' }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(L.r, 0.035, 10, 64), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }))
    ring.position.z = 0.02
    const gloss = new THREE.Mesh(new THREE.TorusGeometry(L.r * 0.82, 0.01, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.25 }))
    gloss.rotation.z = 1.9
    gloss.position.z = 0.12
    face.add(back, ring, gloss)
    face.position.y = L.y
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, L.y - L.r + 0.02, 8), mats.wood)
    post.position.y = (L.y - L.r) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.06, 12), mats.wood)
    foot.position.y = 0.03
    g.add(face, post, foot)
    g.position.set(L.x, 0, L.z)
    g.rotation.y = facing(L.x, L.z, spot)
    root.add(g)
    solids.push(circle(L.x, L.z, 0.22))
    const hit = new THREE.Mesh(new THREE.CircleGeometry(L.r + 0.05, 24), ghost)
    hit.position.z = 0.15
    face.add(hit)
    return { group: g, face }
  }

  // ======== light: the fires make the warm light, the dusk the cold ========
  const furnLight = new THREE.PointLight('#ff8a3a', 0.6, 7, 1.6)
  furnLight.position.set(FURN.x + 0.55, 0.45, FURN.z + 0.85)
  const hearthLight = new THREE.PointLight('#ff9a4a', 1.0, 5.5, 1.6)
  hearthLight.position.set(HEARTH.x, HEARTH.top + 1.1, HEARTH.z + 0.6)
  const pieceLight = new THREE.PointLight('#ffa050', 0, 3.6, 1.6)
  pieceLight.position.set(ANVIL.x + 0.1, ANVIL.top + 0.9, ANVIL.z + 0.6)
  root.add(furnLight, hearthLight, pieceLight)

  // ================================================================================================
  // ======== the bloomery ========
  // ================================================================================================
  const furnace = new THREE.Group()
  furnace.position.set(FURN.x, 0, FURN.z)
  root.add(furnace)
  solids.push(circle(FURN.x, FURN.z, FURN.r0 + 0.1))
  const archDir = new THREE.Vector3(Math.sin(ARCH), 0, Math.cos(ARCH))
  // the clay: a shaft cut open toward the visitor, so the charge inside shows
  const clayCanvas = cracks => g => {
    g.fillStyle = '#8c5c3e'
    g.fillRect(0, 0, 256, 256)
    const r = random(12)
    for (let i = 0; i < 500; i++) {
      g.fillStyle = r() < 0.5 ? `rgba(70,40,26,${0.12 + r() * 0.2})` : `rgba(176,128,92,${0.1 + r() * 0.2})`
      g.beginPath()
      g.ellipse(r() * 256, r() * 256, 3 + r() * 12, 2 + r() * 6, r() * 3, 0, TAU)
      g.fill()
    }
    // the picture's cracks in the fired clay (none on the cut: they read as wood grain there)
    g.strokeStyle = 'rgba(40,20,12,0.6)'
    g.lineWidth = 2
    for (let i = 0; i < cracks; i++) {
      let x = r() * 256
      let y = 40 + r() * 160
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 5; k++) {
        x += (r() - 0.5) * 18
        y += 8 + r() * 10
        g.lineTo(x, y)
      }
      g.stroke()
    }
  }
  const clayTex = canvasTex(256, 256, clayCanvas(2), { repeat: true })
  clayTex.repeat.set(4, 3)
  textures.push(clayTex)
  // the cut faces: plain clay, its tiles square on the section (u across the wall, v up it)
  const cutClay = canvasTex(256, 256, clayCanvas(0), { repeat: true })
  cutClay.repeat.set(1, 3)
  textures.push(cutClay)
  const clay = new THREE.MeshStandardMaterial({ map: clayTex, roughness: 0.95, side: THREE.DoubleSide, emissive: '#ff4a10', emissiveIntensity: 0 })
  const prof = [[FURN.bore, FURN.floor], [FURN.r0, 0], [FURN.r0 * 0.97, 0.35], [FURN.r1, FURN.h], [FURN.bore + 0.03, FURN.h], [FURN.bore, FURN.h - 0.08], [FURN.bore, FURN.floor]]
  const shell = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 40, CUT, TAU - 2 * CUT), clay)
  furnace.add(shell)
  // the cut faces: fired clay, glowing near the bottom of the bore while the furnace is hot
  const cutGlowTex = canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, h)
    const grd = g.createRadialGradient(w * 0.37, h * 0.86, 0, w * 0.37, h * 0.86, h * 0.55)
    grd.addColorStop(0, 'rgba(255,220,160,1)')
    grd.addColorStop(0.25, 'rgba(255,120,40,0.8)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(cutGlowTex)
  const cutMat = new THREE.MeshStandardMaterial({ map: cutClay, color: '#e8c0a0', roughness: 0.95, side: THREE.DoubleSide, emissive: '#ff7a30', emissiveMap: cutGlowTex, emissiveIntensity: 0 })
  {
    const shape = new THREE.Shape(prof.map(([x, y]) => new THREE.Vector2(x, y)))
    for (const phi of [CUT, -CUT]) {
      const geo = new THREE.ShapeGeometry(shape)
      const p = geo.attributes.position
      const uv = geo.attributes.uv
      for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / FURN.r0, p.getY(i) / FURN.h)
      const face = new THREE.Mesh(geo, cutMat)
      face.rotation.y = phi - Math.PI / 2
      furnace.add(face)
    }
    // the furnace's floor, and a ring of stones round its foot
    const floorDisc = new THREE.Mesh(new THREE.CircleGeometry(FURN.bore, 24), new THREE.MeshStandardMaterial({ color: '#2a1a12', roughness: 1 }))
    floorDisc.rotation.x = -Math.PI / 2
    floorDisc.position.y = FURN.floor + 0.002
    furnace.add(floorDisc)
  }
  // the fire inside: a glowing column at the bottom of the bore, brightest by the tuyere
  // brightest at the bottom by the tuyere, fading upward
  const fireTex = canvasTex(8, 64, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,200,140,0.6)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  }, { mipmaps: false })
  textures.push(fireTex)
  const fireMat = new THREE.MeshBasicMaterial({ map: fireTex, color: new THREE.Color('#ff8a30').multiplyScalar(1.5), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const fire = new THREE.Mesh(new THREE.CylinderGeometry(FURN.bore - 0.01, FURN.bore - 0.01, 0.4, 20, 1, true), fireMat)
  fire.position.y = FURN.floor + 0.2
  fire.raycast = () => {}
  furnace.add(fire)
  const tuyereGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffc070').multiplyScalar(2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  tuyereGlow.position.set(-FURN.bore * 0.6, 0.26, 0)
  tuyereGlow.scale.setScalar(0.3)
  furnace.add(tuyereGlow)
  // the flame at the mouth, as the picture's, and smoke above it
  const flameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffb060').multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const flames = [0, 1, 2].map(i => {
    const s = new THREE.Sprite(flameMat)
    s.center.set(0.5, 0.1)
    s.position.set((i - 1) * 0.07, FURN.h - 0.02, (i % 2) * 0.05 - 0.02)
    furnace.add(s)
    return s
  })
  const furnSmoke = stage.smoke({ x: FURN.x, y: FURN.h + 0.6, z: FURN.z, rate: 0, size: 1.8, opacity: 0.3, life: 6, max: 14 })
  // the tuyere: a clay pipe from the bellows into the furnace's foot
  {
    const a = new THREE.Vector3(BELLOWS.x + 0.45, 0.2, BELLOWS.z)
    const b = new THREE.Vector3(FURN.x - FURN.bore - 0.02, 0.26, FURN.z)
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1, 10), clay)
    stretch(pipe, a, b)
    root.add(pipe)
  }
  // the charge: layers of ore and charcoal, lumps seen through the cut
  const lumpGeo = new THREE.DodecahedronGeometry(1, 0)
  const oreMat = new THREE.MeshStandardMaterial({ color: '#8c3b24', roughness: 0.9, emissive: '#ff3a00', emissiveIntensity: 0 })
  const coalMat = new THREE.MeshStandardMaterial({ color: '#25211e', roughness: 0.45, metalness: 0.25, emissive: '#ff5a10', emissiveIntensity: 0 })
  const oreLumps = new THREE.InstancedMesh(lumpGeo, oreMat, MAX_LAYERS * LUMPS)
  const coalLumps = new THREE.InstancedMesh(lumpGeo, coalMat, MAX_LAYERS * LUMPS)
  oreLumps.frustumCulled = coalLumps.frustumCulled = false
  oreLumps.count = coalLumps.count = 0
  oreLumps.raycast = coalLumps.raycast = () => {}
  root.add(oreLumps, coalLumps)
  // the bloom growing at the bottom
  const bloomGeo = lumpGeometry(1.7)
  const fBloomMat = hotMetal({ emissiveMap: sponge })
  const fBloom = new THREE.Mesh(bloomGeo, fBloomMat)
  fBloom.visible = false
  root.add(fBloom)
  // the arch: a glowing mouth at the foot, stopped with a clay plug but for a hole for the slag
  const archGroup = new THREE.Group()
  {
    const outerR = FURN.r0 * 0.995
    archGroup.position.set(FURN.x + archDir.x * (outerR + 0.008), 0, FURN.z + archDir.z * (outerR + 0.008))
    archGroup.rotation.y = ARCH
    root.add(archGroup)
  }
  const archShape = (w, h) => {
    const s = new THREE.Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(w / 2, h - w / 2)
    s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false)
    s.lineTo(-w / 2, 0)
    return s
  }
  const mouthMat = new THREE.MeshStandardMaterial({ color: '#1a0c06', emissive: '#ff7a24', emissiveIntensity: 0, roughness: 0.6 })
  const mouth = new THREE.Mesh(new THREE.ShapeGeometry(archShape(0.28, 0.32)), mouthMat)
  mouth.position.z = 0.002
  archGroup.add(mouth)
  const plugMat = new THREE.MeshStandardMaterial({ color: '#a8745a', roughness: 0.95 })
  const plugShape = archShape(0.3, 0.34)
  {
    const hole = new THREE.Path()
    hole.moveTo(-0.045, 0.01)
    hole.lineTo(0.045, 0.01)
    hole.lineTo(0.045, 0.07)
    hole.lineTo(-0.045, 0.07)
    hole.lineTo(-0.045, 0.01)
    plugShape.holes.push(hole)
  }
  const plug = new THREE.Mesh(new THREE.ExtrudeGeometry(plugShape, { depth: 0.05, bevelEnabled: false }), plugMat)
  plug.position.z = 0.004
  archGroup.add(plug)
  const archHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.3), ghost)
  archHit.position.set(0, 0.22, 0.05)
  archGroup.add(archHit)
  // the plug's pieces when it is broken
  const chunks = Array.from({ length: 6 }, (_, i) => {
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04 + 0.02 * hash(3, i), 0), plugMat)
    m.visible = false
    root.add(m)
    return { m, v: new THREE.Vector3(), spin: new THREE.Vector3() }
  })
  // the slag: a glowing trickle from the arch to a little pit, darkening as it cools
  const slagFrom = new THREE.Vector3(FURN.x + archDir.x * (FURN.r0 + 0.02), 0.04, FURN.z + archDir.z * (FURN.r0 + 0.02))
  const slagTo = new THREE.Vector3(FURN.x + archDir.x * (FURN.r0 + 0.42), 0.02, FURN.z + archDir.z * (FURN.r0 + 0.42))
  const slagMat = new THREE.MeshStandardMaterial({ color: '#2a1408', emissive: '#ff6a18', emissiveIntensity: 0, roughness: 0.4 })
  const trickle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 1, 8), slagMat)
  stretch(trickle, slagFrom, slagTo)
  trickle.visible = false
  root.add(trickle)
  const poolMat = new THREE.MeshStandardMaterial({ color: '#1c1410', emissive: '#ff5a10', emissiveIntensity: 0, roughness: 0.35, metalness: 0.2 })
  const pool = new THREE.Mesh(lumpGeometry(5, 0.12), poolMat)
  pool.position.copy(slagTo).setY(0.0)
  pool.visible = false
  root.add(pool)
  // the tongs: leaning on the furnace until the bloom is pulled
  const tongs = new THREE.Group()
  {
    const arm = (s) => {
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.018, 0.018), iron)
      a.position.set(0.375, 0, s * 0.012)
      a.rotation.y = s * 0.04
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.02), iron)
      jaw.position.set(0.0, 0, s * 0.03)
      return [a, jaw]
    }
    tongs.add(...arm(1), ...arm(-1))
  }
  // leaning on the furnace by the arch: the jaws on the ground, the handles against the wall
  const TONGS_REST = { p: new THREE.Vector3(FURN.x + archDir.x * (FURN.r0 + 0.5) - archDir.z * 0.25, 0.02, FURN.z + archDir.z * (FURN.r0 + 0.5) + archDir.x * 0.25), rot: new THREE.Euler(0, ARCH + Math.PI / 2, 1.0) }
  tongs.position.copy(TONGS_REST.p)
  tongs.rotation.copy(TONGS_REST.rot)
  root.add(tongs)
  const flyBloomMat = hotMetal({ emissiveMap: sponge })
  const flyBloom = new THREE.Mesh(bloomGeo, flyBloomMat)
  flyBloom.visible = false
  root.add(flyBloom)

  // the bellows: two leather bags under boards, pumped in turn
  const bags = [-1, 1].map(s => {
    const g = new THREE.Group()
    const bag = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), leather)
    bag.scale.set(0.42, 0.16, 0.26)
    bag.position.y = 0.16
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.42), mats.wood)
    board.position.y = 0.32
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), mats.wood)
    handle.rotation.z = Math.PI / 2
    handle.position.set(-0.45, 0.34, 0)
    g.add(bag, board, handle)
    g.position.set(BELLOWS.x - 0.05, 0, BELLOWS.z + s * 0.3)
    root.add(g)
    return { g, bag, board, handle, k: 0 }
  })
  const bellowsHit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.2), ghost)
  bellowsHit.position.set(BELLOWS.x, 0.3, BELLOWS.z)
  root.add(bellowsHit)
  solids.push(box(BELLOWS.x, BELLOWS.z, 0.9, 1.2))
  let pumpSide = 0
  let steadyPhase = 0

  // the heaps of ore and charcoal, as the picture's
  const heaps = {}
  for (const kind of ['ore', 'coal']) {
    const H = HEAP[kind]
    const g = new THREE.Group()
    const n = light ? 40 : 70
    const lumps = new THREE.InstancedMesh(lumpGeo, kind === 'ore' ? new THREE.MeshStandardMaterial({ color: '#94402a', roughness: 0.9 }) : new THREE.MeshStandardMaterial({ color: '#232020', roughness: 0.45, metalness: 0.25 }), n)
    for (let i = 0; i < n; i++) {
      const a = hash(kind === 'ore' ? 7 : 8, i) * TAU
      const r = Math.sqrt(hash(kind === 'ore' ? 7 : 8, i, 1)) * 0.38
      const s = 0.045 + 0.03 * hash(9, i)
      dummy.position.set(Math.cos(a) * r, Math.max(0.03, (0.4 - r) * 0.55) + hash(9, i, 2) * 0.03, Math.sin(a) * r)
      dummy.rotation.set(a, a * 2, a * 3)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      lumps.setMatrixAt(i, dummy.matrix)
    }
    g.add(lumps)
    const label = makeText(E.bloomery.heaps[kind], { size: 0.085, color: '#c8a888', anchorY: 'bottom', outlineWidth: 0.006, outlineColor: '#1a0e08' })
    label.position.y = 0.42
    g.add(label)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12), ghost)
    hit.position.y = 0.2
    g.add(hit)
    g.position.set(H.x, 0, H.z)
    g.rotation.y = facing(H.x, H.z, SPOT.bloomery)
    root.add(g)
    solids.push(circle(H.x, H.z, 0.38))
    heaps[kind] = { g, hit }
  }
  // a scoop flying from a heap into the furnace's mouth
  const scoopMats = { o: new THREE.MeshStandardMaterial({ color: '#94402a', roughness: 0.9 }), c: new THREE.MeshStandardMaterial({ color: '#232020', roughness: 0.45, metalness: 0.25 }) }
  const scoops = Array.from({ length: 3 }, () => {
    const g = new THREE.Group()
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(lumpGeo, scoopMats.o)
      m.position.set((hash(11, i) - 0.5) * 0.12, (hash(11, i, 1) - 0.5) * 0.08, (hash(11, i, 2) - 0.5) * 0.12)
      m.scale.setScalar(0.035 + 0.015 * hash(11, i, 3))
      g.add(m)
    }
    g.visible = false
    root.add(g)
    return { g, t: -1, kind: 'o' }
  })

  // the dial and its board, beside the furnace: today's thermometer, so the visitor can see the heat
  const dial = new THREE.Group()
  const dialTex = canvasTex(512, 512, (g, w) => {
    const c = w / 2
    g.fillStyle = '#121633'
    g.beginPath()
    g.arc(c, c, c - 6, 0, TAU)
    g.fill()
    const ang = v => ((-225 + (270 * v) / 1600) * Math.PI) / 180
    const band = (a, b, col, wdt = 26) => {
      g.strokeStyle = col
      g.lineWidth = wdt
      g.beginPath()
      g.arc(c, c, c - 60, ang(a), ang(b))
      g.stroke()
    }
    band(0, 1100, '#3a3e5a')
    band(1100, 1300, '#ff8a2a')
    band(1300, 1600, '#3a3e5a')
    band(1534, 1542, '#ff2a2a', 46)
    g.strokeStyle = '#d8dcf0'
    for (let v = 0; v <= 1600; v += 100) {
      const a = ang(v)
      const big = v % 400 === 0
      g.lineWidth = big ? 6 : 3
      g.beginPath()
      g.moveTo(c + Math.cos(a) * (c - 30), c + Math.sin(a) * (c - 30))
      g.lineTo(c + Math.cos(a) * (c - (big ? 82 : 66)), c + Math.sin(a) * (c - (big ? 82 : 66)))
      g.stroke()
      if (big) {
        g.fillStyle = '#e8ecff'
        g.font = '700 38px Outfit, sans-serif'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText(String(v), c + Math.cos(a) * (c - 122), c + Math.sin(a) * (c - 122))
      }
    }
    g.fillStyle = '#ff6a5a'
    g.font = '700 30px Outfit, sans-serif'
    g.textAlign = 'center'
    g.fillText(`1538 · ${E.bloomery.dial.melt}`, c, c + 150)
    g.fillStyle = '#ffb060'
    g.fillText(E.bloomery.dial.bloom, c, c - 108)
    g.fillStyle = '#c8cce8'
    g.font = '700 36px Outfit, sans-serif'
    g.fillText('°C', c, c + 92)
  }, { mipmaps: true })
  textures.push(dialTex)
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.006).translate(0.08, 0, 0), new THREE.MeshBasicMaterial({ color: '#ff5040' }))
  const dialT = makeText('20 °C', { size: 0.075, color: '#ffe2b8', anchorY: 'middle' })
  const dialBloom = makeText('', { size: 0.06, color: '#ffd9a0', anchorY: 'middle', maxWidth: 0.6 })
  {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.04, 40), iron)
    rim.rotation.x = Math.PI / 2
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.27, 40), new THREE.MeshBasicMaterial({ map: dialTex, toneMapped: false }))
    face.position.z = 0.022
    needle.position.z = 0.03
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12), iron)
    hub.rotation.x = Math.PI / 2
    hub.position.z = 0.035
    const board = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.28, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#121633', roughness: 0.5 }))
    board.position.set(0, -0.48, 0)
    dialT.position.set(0, -0.42, 0.025)
    dialBloom.position.set(0, -0.53, 0.025)
    dial.add(rim, face, needle, hub, board, dialT, dialBloom)
    dial.position.set(DIAL.x, DIAL.y, DIAL.z)
    dial.rotation.y = facing(DIAL.x, DIAL.z, SPOT.bloomery)
    root.add(dial)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, DIAL.y - 0.6, 8), mats.wood)
    post.position.set(DIAL.x, (DIAL.y - 0.6) / 2, DIAL.z - 0.05)
    root.add(post)
    solids.push(circle(DIAL.x, DIAL.z, 0.15))
  }
  let dialShown = ''
  let bloomShownTxt = null

  // the picture's lens: carbon monoxide taking oxygen from iron oxide
  const lens1 = lensOn(LENS1, SPOT.bloomery)
  const L1 = 0.92 // the atoms' spread in the lens
  const FE1 = [[-0.16, -0.22], [0, -0.22], [0.16, -0.22], [-0.2, -0.12], [-0.04, -0.12], [0.12, -0.12]].map(([x, y]) => [x * L1, y * L1 + 0.04])
  // the oxygens in the order carbon monoxide takes them: 1 (Fe2O3 -> Fe3O4), 2 (-> FeO), 6 (-> Fe)
  const O1 = [[0.08, -0.02], [-0.12, -0.02], [0.2, -0.12], [-0.12, -0.12], [0.04, -0.12], [-0.24, -0.22], [-0.08, -0.22], [0.08, -0.22], [0.24, -0.22]].map(([x, y]) => [x * L1, y * L1 + 0.04])
  const STEP_TAKES = [1, 2, 6]
  const takenBy = s => STEP_TAKES.slice(0, s).reduce((a, b) => a + b, 0)
  const feMat = new THREE.MeshStandardMaterial({ color: '#d4783c', roughness: 0.4, emissive: '#3a1404' })
  const oMat = new THREE.MeshStandardMaterial({ color: '#e8403a', roughness: 0.35, emissive: '#3a0606' })
  const cMat = new THREE.MeshStandardMaterial({ color: '#16161a', roughness: 0.3, metalness: 0.2 })
  const feBalls = FE1.map(([x, y]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 12), feMat)
    m.position.set(x, y, 0.06)
    lens1.face.add(m)
    return m
  })
  const oBalls = O1.map(([x, y]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), oMat)
    m.position.set(x, y, 0.07)
    lens1.face.add(m)
    return m
  })
  // the CO molecules that fly in: a carbon and its oxygen, then off as CO2 with the one they took
  const cos = Array.from({ length: 6 }, () => {
    const g = new THREE.Group()
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 10), cMat)
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 10), oMat)
    o.position.x = -0.07
    g.add(c, o)
    g.visible = false
    lens1.face.add(g)
    return g
  })
  const formulas = ['Fe2O3', 'Fe3O4', 'FeO', 'Fe'].map(f => {
    const t = formulaText(f, { size: 0.085, color: '#ffe2c0' })
    t.position.set(0, LENS1.r * 0.62, 0.08)
    t.visible = false
    lens1.face.add(t)
    return t
  })
  const coLabel = formulaText('CO', { size: 0.06, color: '#c8c8d8' })
  coLabel.position.set(-LENS1.r * 0.55, LENS1.r * 0.3, 0.08)
  lens1.face.add(coLabel)
  let lensAnim = null // { step, t }

  // ---- the furnace's state ----
  // layers: 'o' (ore) and 'c' (charcoal) from the bottom; burn: how far the lowest charcoal has burnt;
  // red: how far the lowest ore has been reduced; bloom (kg); slag (0..1, the pit); puff: the bellows'
  // last pumps, fading; air: the helper's steady pumping (the slider); pumps, pulls, lensN: counts;
  // since: seconds since the last bloom was pulled (the arch is patched in REBUILD); lens: the lens's step
  const F = { layers: [], T: 20, burn: 0, red: 0, bloom: 0, slag: 0, puff: 0, air: 0, pumps: 0, pulls: 0, since: 99, lens: 0, lensN: 0, smelted: 0 }
  const nOf = k => F.layers.filter(v => v === k).length
  let lay = [] // what is drawn: { kind, id, y }
  let layId = 1
  const removeLowest = k => {
    const i = F.layers.indexOf(k)
    if (i < 0) return
    F.layers.splice(i, 1)
    const j = lay.findIndex(l => l.kind === k)
    if (j >= 0) lay.splice(j, 1)
  }
  const syncLay = () => {
    if (lay.length === F.layers.length && lay.every((l, i) => l.kind === F.layers[i])) return
    lay = F.layers.map((k, i) => ({ kind: k, id: layId++, y: CHARGE0 + i * LAYER }))
  }
  function simFurnace(dt) {
    F.since = Math.min(99, F.since + dt)
    F.puff *= Math.exp(-dt / 2.5)
    const coal = nOf('c')
    const ore = nOf('o')
    const blast = clamp(F.air + F.puff)
    const target = coal > 0 ? 250 + 1070 * blast : 20
    F.T += (target - F.T) * (1 - Math.exp(-(target > F.T ? 0.3 : 0.12) * dt))
    if (coal > 0 && F.T > 350) {
      F.burn += dt * (0.012 + 0.085 * blast)
      if (F.burn >= 1) {
        F.burn -= 1
        removeLowest('c')
      }
    }
    if (ore > 0 && coal > 0 && F.T >= 1100) {
      F.red += dt * (0.09 + 0.07 * smooth(1100, 1300, F.T))
      if (F.red >= 1) {
        F.red -= 1
        removeLowest('o')
        F.bloom = r1(F.bloom + KG_PER_ORE)
        F.smelted++
      }
    }
    if (F.T >= 1180 && (F.bloom > 0 || F.red > 0.05)) F.slag = Math.min(1, F.slag + dt * 0.02)
  }
  const bloomNow = () => F.bloom + (nOf('o') && nOf('c') && F.T >= 1100 ? F.red * KG_PER_ORE : 0)
  const slagRuns = () => F.T >= 1180 && (F.bloom > 0 || F.red > 0.05) && F.since >= REBUILD
  let fSnap = null
  let fAge = 0
  const snapF = () => {
    fSnap = { layers: F.layers.join(''), T: r1(F.T), burn: r3(F.burn), red: r3(F.red), bloom: F.bloom, slag: r3(F.slag), puff: r3(F.puff), air: Math.round(F.air * 100) / 100, pumps: F.pumps, pulls: F.pulls, since: r1(F.since), lens: F.lens, lensN: F.lensN, smelted: F.smelted }
    fAge = 0
  }
  snapF()
  let furnMine = false
  const told = {}
  const resetTold = () => Object.keys(told).forEach(k => delete told[k])
  const tell = (k, vars = {}) => {
    if (told[k] || !furnMine) return
    told[k] = true
    say(fill(at(E.bloomery.says[k], level()), vars))
  }

  const furnPanel = lv => ({
    title: E.bloomery.title,
    color,
    blocks: [
      { slider: { label: E.bloomery.slider, min: 0, max: 100, step: 5, value: Math.round(F.air * 100), onInput: v => setAir(v / 100), format: v => `${Math.round(v)}%`, live: () => Math.round(F.air * 100) } },
      { buttons: ['coal', 'ore', 'bellows', 'lens', 'arch'].map(k => ({ label: E.bloomery.buttons[k], onClick: () => furnStep(k) })) },
      ...paras(E.bloomery.panel, lv),
    ],
  })
  const furnChanged = () => {
    furnMine = true
    snapF()
    ex.discover('bloomery', furnPanel, 2.6)
    share('bloomery')
  }
  let airSending = false
  function setAir(v) {
    F.air = clamp(Math.round(Number(v) * 100) / 100)
    furnMine = true
    snapF()
    ex.discover('bloomery', furnPanel, 2.6)
    if (airSending) return
    airSending = true
    later(0.25, () => {
      airSending = false
      snapF()
      share('bloomery')
    })
  }
  function startScoop(kind) {
    const s = scoops.find(q => q.t < 0) ?? scoops[0]
    s.t = 0
    s.kind = kind
    s.g.children.forEach(m => (m.material = scoopMats[kind]))
    s.g.visible = true
    s.from = new THREE.Vector3(HEAP[kind === 'o' ? 'ore' : 'coal'].x, 0.35, HEAP[kind === 'o' ? 'ore' : 'coal'].z)
  }
  function pumpAnim() {
    bags[pumpSide].k = 1
    pumpSide = 1 - pumpSide
    if (F.T > 700) burst(new THREE.Vector3(FURN.x, FURN.h + 0.05, FURN.z), Math.round(4 + 10 * smooth(700, 1300, F.T)), SPARK, 1.2, 1.2, 0.9)
  }
  // a visitor's step: a tap on a heap, the bellows, the arch, the lens (or the panel's buttons)
  function furnStep(what) {
    const lv = level()
    const S = E.bloomery.says
    if (what === 'ore' || what === 'coal') {
      if (F.since < REBUILD) return say(at(S.rebuild, lv))
      if (F.layers.length >= MAX_LAYERS) return say(at(S.full, lv))
      const k = what === 'ore' ? 'o' : 'c'
      F.layers.push(k)
      lay.push({ kind: k, id: layId++, y: FURN.h + 0.1, wait: 0.6 })
      startScoop(k)
      play('select')
      if (k === 'o' && !nOf('c')) say(at(S.oreAlone, lv))
      else say(at(k === 'o' ? S.ore : S.coal, lv))
      if (F.layers.length === 1 && F.bloom <= 0) resetTold()
    } else if (what === 'bellows') {
      F.puff = Math.min(1.2, F.puff + 0.35)
      F.pumps++
      pumpAnim()
      play('fizz', { order: 0.6 })
      if (!nOf('c')) say(at(S.noFire, lv))
    } else if (what === 'arch') {
      if (F.since < REBUILD) return say(at(S.rebuild, lv))
      const kg = r1(bloomNow())
      if (kg < 0.5) return say(at(S.noBloom, lv))
      F.layers = []
      lay = []
      F.burn = 0
      F.red = 0
      F.bloom = 0
      F.smelted = 0
      F.since = 0
      F.pulls++
      resetTold()
      startPull()
      say(fill(at(kg < 2 ? S.small : S.pulled, lv), { kg: num(kg, 1, lang) }))
      // the bloom goes to the anvil, at a welding heat
      setPiece({ kind: 'bloom', mass: kg, blows: 0, T0: 1280, age: 0, src: 'furnace' })
      pieceMine = true
      arriveAt = 2.4
      play('pop')
      share('anvil')
    } else if (what === 'lens') {
      if (lensAnim) return say(at(W.busy, lv))
      if (F.lens >= 3) {
        F.lens = 0
        F.lensN++
        play('tap')
        say(at(S.lensAgain, lv))
      } else if (F.T < 800) {
        return say(at(S.lensCold, lv))
      } else {
        F.lens++
        F.lensN++
        lensAnim = { step: F.lens, t: 0 }
        play('join')
        say(at(S.lens[F.lens - 1], lv))
      }
    } else return
    furnChanged()
  }
  clickable(heaps.ore.g, () => furnStep('ore'))
  clickable(heaps.coal.g, () => furnStep('coal'))
  clickable(bellowsHit, () => furnStep('bellows'))
  for (const b of bags) clickable(b.g, () => furnStep('bellows'))
  clickable(archGroup, () => furnStep('arch'))
  clickable(furnace, () => furnStep('arch'), { when: () => bloomNow() >= 0.5 && F.since >= REBUILD })
  clickable(lens1.face, () => furnStep('lens'))
  ex.add({
    id: 'bloomery',
    x: SPOT.bloomery.x,
    z: SPOT.bloomery.z,
    radius: 1.7,
    manual: true,
    label: E.bloomery.label,
    verb: () => {
      const H = E.bloomery.hints
      if (F.since < REBUILD) return H.rebuild
      const coal = nOf('c')
      const ore = nOf('o')
      const kg = bloomNow()
      if (kg >= 2.5 && (!ore || kg >= 4)) return H.ready
      if (!coal && !ore) return kg >= 0.5 ? H.ready : H.load
      if (!coal) return H.coal
      if (!ore) return kg >= 0.5 ? H.ready : H.ore
      if (F.T < 600) return H.pump
      if (F.T < 1100) return H.hotter
      return H.grows
    },
    focus: { x: -3.25, y: 1.05, z: -3.9, size: 3.4, width: 4.6 },
    act: () => ctx.showPanel(furnPanel),
  })

  // the tongs' pull: in at the arch, out with the bloom, over to the anvil
  let pull = null // { t, kg }
  const archOut = new THREE.Vector3(FURN.x + archDir.x * (FURN.r0 + 0.45), 0.2, FURN.z + archDir.z * (FURN.r0 + 0.45))
  const bloomIn = new THREE.Vector3(FURN.x, FURN.floor + 0.08, FURN.z)
  const anvilTop = new THREE.Vector3(ANVIL.x, ANVIL.top, ANVIL.z)
  function startPull() {
    pull = { t: 0, kg: Math.max(0.5, bloomNow()) }
    plug.visible = false
    chunks.forEach((c, i) => {
      c.m.visible = true
      c.m.position.copy(archGroup.position).add(new THREE.Vector3(0, 0.15 + 0.05 * (i % 3), 0))
      c.v.copy(archDir).multiplyScalar(0.8 + Math.random() * 1.2).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, 1 + Math.random(), (Math.random() - 0.5) * 0.8))
      c.spin.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
    })
    burst(archGroup.position.clone().setY(0.15), 22, SPARK, 1.2, 0.5)
  }
  const tipTo = (p, rotY, tilt) => {
    tongs.position.copy(p)
    tongs.rotation.set(0, rotY, tilt)
  }
  function posePull(dt) {
    // the plug's pieces fall and lie until the arch is patched
    for (const c of chunks) {
      if (!c.m.visible) continue
      if (F.since >= REBUILD) {
        c.m.visible = false
        continue
      }
      if (c.m.position.y > 0.03) {
        c.v.y -= 6 * dt
        c.m.position.addScaledVector(c.v, dt)
        c.m.rotation.x += c.spin.x * dt
        c.m.rotation.y += c.spin.y * dt
        if (c.m.position.y < 0.03) {
          c.m.position.y = 0.03
          c.v.set(0, 0, 0)
        }
      }
    }
    plug.visible = F.since >= REBUILD
    if (F.since >= REBUILD - 0.6 && F.since < REBUILD) {
      plug.visible = true
      plug.scale.setScalar(span(REBUILD - 0.6, REBUILD, F.since))
    } else plug.scale.setScalar(1)
    if (!pull) {
      tongs.position.copy(TONGS_REST.p)
      tongs.rotation.copy(TONGS_REST.rot)
      flyBloom.visible = false
      return
    }
    pull.t += dt
    const t = pull.t
    // the handles point out of the arch, the jaws in
    const outRot = ARCH - Math.PI / 2
    const r = 0.03 + 0.045 * Math.cbrt(pull.kg)
    if (t < 0.5) {
      tmpV.lerpVectors(TONGS_REST.p, archOut, span(0, 0.5, t))
      tipTo(tmpV, outRot, 0.15)
    } else if (t < 0.9) {
      tmpV.lerpVectors(archOut, bloomIn, span(0.5, 0.9, t))
      tipTo(tmpV, outRot, 0.1)
    } else if (t < 1.3) {
      tmpV.lerpVectors(bloomIn, archOut, span(0.9, 1.3, t))
      tipTo(tmpV, outRot, 0.1)
    } else if (t < 2.3) {
      const k = span(1.3, 2.3, t)
      tmpV.lerpVectors(archOut, anvilTop.clone().setY(ANVIL.top + r * 0.8), k)
      tmpV.y += Math.sin(Math.PI * k) * 0.7
      tipTo(tmpV, outRot + (Math.PI / 2) * k, 0.1 + 0.2 * Math.sin(Math.PI * k))
    } else if (t < 3.0) {
      tmpV.lerpVectors(anvilTop.clone().setY(ANVIL.top + 0.1), TONGS_REST.p, span(2.3, 3.0, t))
      tipTo(tmpV, outRot + Math.PI / 2, 0.15)
    } else {
      pull = null
      return
    }
    flyBloom.visible = t >= 0.9 && t < 2.3
    if (flyBloom.visible) {
      flyBloom.position.copy(tongs.position).add(new THREE.Vector3(0, r * 0.3, 0))
      flyBloom.scale.setScalar(r)
      setGlow(flyBloomMat, 1280)
    }
  }
  updates.push(posePull)

  // ---- the furnace, drawn ----
  function poseFurnace(dt, t) {
    simFurnace(dt)
    fAge += dt
    const heat = smooth(300, 1320, F.T)
    const coal = nOf('c')
    const ore = nOf('o')
    // the charge: layers settle down as the bottom is used up; lumps shrink as they burn or give up iron
    let ko = 0
    let kc = 0
    const lowest = { o: F.layers.indexOf('o'), c: F.layers.indexOf('c') }
    lay.forEach((l, i) => {
      if (l.wait > 0) {
        l.wait -= dt
        return
      }
      l.y = damp(l.y, CHARGE0 + i * LAYER, 3, dt)
      const used = i === lowest[l.kind] ? (l.kind === 'c' ? F.burn : F.red) : 0
      const mesh = l.kind === 'o' ? oreLumps : coalLumps
      for (let j = 0; j < LUMPS; j++) {
        const a = hash(l.id, j) * TAU
        const rr = Math.sqrt(hash(l.id, j, 1)) * (FURN.bore - 0.045)
        const s = (0.03 + 0.018 * hash(l.id, j, 3)) * (1 - 0.6 * used)
        dummy.position.set(FURN.x + Math.cos(a) * rr, l.y + hash(l.id, j, 2) * LAYER * 0.75 + 0.02, FURN.z + Math.sin(a) * rr)
        dummy.rotation.set(a, a * 1.7, j)
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        mesh.setMatrixAt(l.kind === 'o' ? ko++ : kc++, dummy.matrix)
      }
    })
    oreLumps.count = ko
    coalLumps.count = kc
    oreLumps.instanceMatrix.needsUpdate = true
    coalLumps.instanceMatrix.needsUpdate = true
    const flick = 1 + Math.sin(t * 13) * 0.05 + Math.sin(t * 29.3) * 0.04
    oreMat.emissiveIntensity = heat * 0.1 * flick
    coalMat.emissiveIntensity = heat * 0.12 * flick
    fireMat.opacity = coal ? heat * 0.6 * flick : 0
    tuyereGlow.material.opacity = coal ? heat * (0.6 + 0.4 * clamp(F.air + F.puff)) * flick : 0
    cutMat.emissiveIntensity = heat * 1.4 * flick
    clay.emissiveIntensity = 0
    flameMat.opacity = coal ? heat * 0.7 : 0
    flames.forEach((f, i) => {
      const h = (0.12 + 0.3 * heat * (0.6 + 0.6 * clamp(F.air + F.puff))) * (1 + Math.sin(t * (9 + i * 3) + i) * 0.18)
      f.scale.set(h * 0.4, h, 1)
    })
    furnSmoke.setRate(coal ? 0.8 + 2.2 * heat : F.T > 200 ? 0.5 : 0)
    furnLight.intensity = (0.25 + 2.4 * heat * (coal ? 1 : 0.5)) * flick
    mouthMat.emissiveIntensity = heat * 1.6 * flick
    // the bloom at the bottom
    const kg = bloomNow()
    fBloom.visible = kg > 0.05 && F.since >= 0.9
    if (fBloom.visible) {
      const r = 0.03 + 0.045 * Math.cbrt(kg)
      fBloom.scale.setScalar(r)
      fBloom.position.set(FURN.x + 0.01, FURN.floor + r * 0.8, FURN.z + 0.02)
      fBloom.rotation.y = 0.6
      setGlow(fBloomMat, Math.max(F.T, 600))
    }
    // the slag
    const runs = slagRuns()
    trickle.visible = runs
    slagMat.emissiveIntensity = runs ? 1.4 * flick : 0
    pool.visible = F.slag > 0.01
    const pr = 0.07 + 0.2 * Math.sqrt(F.slag)
    pool.scale.set(pr, 0.05, pr * 0.8)
    poolMat.emissiveIntensity = damp(poolMat.emissiveIntensity, runs ? 0.8 : 0.03, 0.5, dt)
    // the bellows: a pump per tap, and the helper's steady pumping from the slider
    steadyPhase += dt * (0.5 + 1.4 * F.air) * (F.air > 0.02 ? 1 : 0)
    bags.forEach((b, i) => {
      b.k = Math.max(0, b.k - dt * 2.4)
      const steady = F.air > 0.02 ? 0.5 + 0.5 * Math.sin(steadyPhase * TAU + i * Math.PI) : 0
      const sq = Math.max(Math.sin(Math.PI * b.k), steady * 0.8)
      b.bag.scale.y = 0.16 * (1 - 0.55 * sq)
      b.bag.position.y = 0.16 * (1 - 0.55 * sq)
      b.board.position.y = 0.32 * (1 - 0.55 * sq) + 0.01
      b.handle.position.y = b.board.position.y + 0.02
    })
    // the scoops in flight
    for (const s of scoops) {
      if (s.t < 0) continue
      s.t += dt
      const u = span(0, 0.6, s.t)
      tmpV.lerpVectors(s.from, new THREE.Vector3(FURN.x, FURN.h + 0.05, FURN.z), u)
      tmpV.y += Math.sin(Math.PI * u) * 0.6
      s.g.position.copy(tmpV)
      s.g.rotation.y += dt * 4
      if (s.t > 0.62) {
        s.t = -1
        s.g.visible = false
      }
    }
    // the dial and its board
    const T = F.T
    needle.rotation.z = -((-225 + (270 * clamp(T, 0, 1600)) / 1600) * Math.PI) / 180
    const shown = fmtT(Math.round(T / 10) * 10)
    if (shown !== dialShown) {
      dialShown = shown
      dialT.text = shown
      dialT.sync()
    }
    const bt = kg >= 0.05 ? fill(E.bloomery.board.bloom, { kg: num(kg, 1, lang) }) : E.bloomery.board.empty
    if (bt !== bloomShownTxt) {
      bloomShownTxt = bt
      dialBloom.text = bt
      dialBloom.sync()
    }
    // what happens, told once a smelt to whoever made it happen
    if (ore && coal && T > 800 && T < 1100) tell('roast', { t: fmtT(T) })
    if (ore && coal && T >= 1100) tell('grows', { t: fmtT(T) })
    if (runs) tell('slag')
    if (T > 1290) tell('melt')
    if (!ore && coal && T > 900 && kg < 0.05) tell('coalOnly')
    if (ore && !coal && (F.bloom > 0 || told.grows)) tell('outCoal')
    if (!ore && F.bloom >= 0.5) tell('outOre')
  }
  updates.push(poseFurnace)

  // the lens: what it shows, and the molecules flying in
  function poseLens(dt, t) {
    const anim = lensAnim
    const shownStep = anim ? anim.step - 1 : F.lens
    formulas.forEach((f, i) => (f.visible = i === (anim && anim.t > 1.6 ? anim.step : shownStep)))
    const gone = takenBy(anim ? anim.step - 1 : F.lens)
    oBalls.forEach((o, i) => {
      o.visible = i < takenBy(F.lens) ? false : true
      if (i < gone) o.visible = false
      o.position.set(O1[i][0], O1[i][1], 0.07)
    })
    cos.forEach(c => (c.visible = false))
    feBalls.forEach((f, i) => {
      const j = 0.004 * Math.sin(t * 3 + i * 1.7)
      f.position.set(FE1[i][0] + j, FE1[i][1] - j, 0.06)
    })
    if (!anim) return
    anim.t += dt
    const n = STEP_TAKES[anim.step - 1]
    const first = takenBy(anim.step - 1)
    for (let i = 0; i < n; i++) {
      const target = O1[first + i]
      const o = oBalls[first + i]
      const c = cos[i]
      const tt = anim.t - i * 0.22
      const start = new THREE.Vector3(-LENS1.r * 0.55 + i * 0.03, LENS1.r * 0.5, 0.09)
      const grab = new THREE.Vector3(target[0] + 0.065, target[1] + 0.055, 0.09)
      const exit = new THREE.Vector3(LENS1.r * 0.5, LENS1.r * 0.62, 0.09)
      if (tt < 0) {
        o.visible = true
        continue
      }
      c.visible = tt < 1.5
      if (tt < 0.7) {
        c.position.lerpVectors(start, grab, span(0, 0.7, tt))
        c.rotation.z = -0.7
        o.visible = true
      } else if (tt < 1.5) {
        const k = span(0.85, 1.5, tt)
        c.position.lerpVectors(grab, exit, k)
        c.rotation.z = -0.7
        o.visible = true
        o.position.set(c.position.x + 0.06, c.position.y - 0.04, 0.09)
        c.scale.setScalar(1 - 0.6 * k)
        o.scale.setScalar(1 - 0.6 * k)
        if (k >= 0.99) o.visible = false
      } else {
        o.visible = false
        o.scale.setScalar(1)
        c.scale.setScalar(1)
      }
    }
    if (anim.t > 1.6 + (n - 1) * 0.22) {
      lensAnim = null
      oBalls.forEach(o => o.scale.setScalar(1))
      cos.forEach(c => c.scale.setScalar(1))
    }
  }
  updates.push(poseLens)

  const furnState = () => ({ ...fSnap, age: r1(fAge) })
  const furnSet = (s, liveSet, ago = 0) => {
    const was = { pumps: F.pumps, pulls: F.pulls, lensN: F.lensN, n: F.layers.length }
    const layers = typeof s?.layers === 'string' ? s.layers.replace(/[^oc]/g, '').slice(0, MAX_LAYERS) : ''
    const numOr = (v, d, lo = -Infinity, hi = Infinity) => (Number.isFinite(Number(v)) ? clamp(Number(v), lo, hi) : d)
    F.layers = layers.split('').filter(Boolean)
    F.T = numOr(s?.T, 20, 0, 1400)
    F.burn = numOr(s?.burn, 0, 0, 1)
    F.red = numOr(s?.red, 0, 0, 1)
    F.bloom = numOr(s?.bloom, 0, 0, 40)
    F.slag = numOr(s?.slag, 0, 0, 1)
    F.puff = numOr(s?.puff, 0, 0, 1.2)
    F.air = numOr(s?.air, 0, 0, 1)
    F.pumps = Math.round(numOr(s?.pumps, 0, 0))
    F.pulls = Math.round(numOr(s?.pulls, 0, 0))
    F.since = numOr(s?.since, 99, 0, 99)
    F.lens = Math.round(numOr(s?.lens, 0, 0, 3))
    F.lensN = Math.round(numOr(s?.lensN, 0, 0))
    F.smelted = Math.round(numOr(s?.smelted, 0, 0))
    snapF()
    // what has happened since the state was taken runs on here too
    const run = Math.min(900, numOr(s?.age, 0, 0) + (Number(ago) || 0))
    for (let k = 0; k < run; k += 0.1) simFurnace(Math.min(0.1, run - k))
    fAge = run
    syncLay()
    furnMine = false
    if (liveSet) {
      if (F.pumps > was.pumps) {
        pumpAnim()
        play('fizz', { order: 0.5 })
      }
      if (F.layers.length > was.n) startScoop(F.layers[F.layers.length - 1])
      if (F.pulls > was.pulls) {
        startPull()
        arriveAt = 2.4
      }
      if (F.lensN > was.lensN && F.lens > 0) lensAnim = { step: F.lens, t: 0 }
    } else {
      lensAnim = null
      pull = null
      lay.forEach((l, i) => (l.y = CHARGE0 + i * LAYER))
      for (const c of chunks) c.m.visible = false
    }
    // what follows is someone else's smelt: theirs to be told
    for (const k of ['roast', 'grows', 'slag', 'melt', 'coalOnly', 'outCoal', 'outOre']) told[k] = true
  }

  // ================================================================================================
  // ======== the anvil ========
  // ================================================================================================
  {
    const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.52, 16), mats.wood)
    stump.position.set(ANVIL.x, 0.26, ANVIL.z)
    const ringTop = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.01, 16), darkWood)
    ringTop.position.set(ANVIL.x, 0.525, ANVIL.z)
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.24), iron)
    base.position.set(ANVIL.x, 0.56, ANVIL.z)
    const waist = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.13), iron)
    waist.position.set(ANVIL.x, 0.66, ANVIL.z)
    const face = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.1, 0.18, 2, 0.015), iron)
    face.position.set(ANVIL.x + 0.03, ANVIL.top - 0.05, ANVIL.z)
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 12), iron)
    horn.rotation.z = Math.PI / 2
    horn.position.set(ANVIL.x - 0.31, ANVIL.top - 0.05, ANVIL.z)
    root.add(stump, ringTop, base, waist, face, horn)
    solids.push(circle(ANVIL.x, ANVIL.z, 0.42))
  }
  // the hammer, raised over the anvil as in the picture
  const hammer = new THREE.Group()
  {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.5, 8), mats.wood)
    handle.rotation.z = Math.PI / 2
    handle.position.x = 0.25
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.13, 0.08), iron)
    head.position.set(0.03, 0, 0)
    hammer.add(handle, head)
    // the head's face is at the group's origin side: the pivot sits at the handle's end
    const pivot = new THREE.Group()
    hammer.position.set(-0.5, 0, 0)
    pivot.add(hammer)
    pivot.position.set(ANVIL.x + 0.52, ANVIL.top + 0.25, ANVIL.z + 0.02)
    root.add(pivot)
    hammer.userData.pivot = pivot
  }
  const hammerPivot = hammer.userData.pivot
  let hammerT = 1
  // the piece on the anvil: a bloom flattening into a bar
  const pieceMat = hotMetal({ emissiveMap: sponge })
  const piece = new THREE.Mesh(bloomGeo, pieceMat)
  root.add(piece)
  const barMat = hotMetal()
  const bar = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.12), barMat)
  bar.visible = false
  root.add(bar)
  const pieceHit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.3), ghost)
  pieceHit.position.set(ANVIL.x, ANVIL.top + 0.1, ANVIL.z)
  root.add(pieceHit)
  // blooms from earlier smelts, dark, in a pile by the stump
  const pileGroup = new THREE.Group()
  {
    const m = new THREE.MeshStandardMaterial({ color: '#3a3330', roughness: 0.75, metalness: 0.3 })
    ;[[0, 0.07, 0, 0.085], [0.14, 0.06, 0.06, 0.07], [0.04, 0.06, 0.15, 0.072], [0.08, 0.17, 0.06, 0.065]].forEach(([x, y, z, r], i) => {
      const b = new THREE.Mesh(lumpGeometry(3 + i), m)
      b.position.set(x, y, z)
      b.scale.setScalar(r)
      b.rotation.y = i
      pileGroup.add(b)
    })
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.35, 10), ghost)
    hit.position.set(0.06, 0.15, 0.06)
    pileGroup.add(hit)
    pileGroup.position.set(PILE.x, 0, PILE.z)
    root.add(pileGroup)
    solids.push(circle(PILE.x + 0.06, PILE.z + 0.06, 0.25))
  }
  // the board of glow colours behind the anvil: how smiths read the heat
  const scaleBoard = new THREE.Group()
  const SC = { w: 1.1, h: 0.58, t0: 550, t1: 1350 }
  const scaleTex = canvasTex(1024, 540, (g, w, h) => {
    g.fillStyle = '#121633'
    g.fillRect(0, 0, w, h)
    const x0 = 60
    const x1 = w - 60
    const xOf = T => x0 + ((T - SC.t0) / (SC.t1 - SC.t0)) * (x1 - x0)
    for (let x = x0; x < x1; x++) {
      const T = SC.t0 + ((x - x0) / (x1 - x0)) * (SC.t1 - SC.t0)
      glowColor(Math.max(T, 520), tmpC)
      g.fillStyle = `#${tmpC.getHexString()}`
      g.fillRect(x, 230, 1, 110)
    }
    g.strokeStyle = '#d8dcf0'
    g.lineWidth = 3
    g.strokeRect(x0, 230, x1 - x0, 110)
    // the stops: a colour's name below, its heat above
    g.textAlign = 'center'
    E.anvil.colours.forEach((name, i) => {
      const T = [650, 750, 950, 1100, 1250][i]
      const x = xOf(T)
      g.beginPath()
      g.moveTo(x, 222)
      g.lineTo(x, 348)
      g.stroke()
      g.fillStyle = '#e8ecff'
      g.font = '700 36px Outfit, sans-serif'
      g.fillText(`${T}`, x, 212)
      // one line each, on two staggered rows, shrunk only if still too wide (German's long compounds)
      g.fillStyle = '#d8dcf0'
      g.font = '700 34px Nunito, sans-serif'
      const wide = g.measureText(String(name)).width
      g.font = `700 ${Math.max(22, Math.floor(34 * Math.min(1, 250 / wide)))}px Nunito, sans-serif`
      g.fillText(String(name), x, 385 + (i % 2) * 44)
    })
    // the bracket over the heat a bloom is hammered at
    g.strokeStyle = '#ffd166'
    g.lineWidth = 5
    g.beginPath()
    g.moveTo(xOf(WELD), 168)
    g.lineTo(xOf(WELD), 150)
    g.lineTo(x1, 150)
    g.lineTo(x1, 168)
    g.stroke()
    g.fillStyle = '#ffd166'
    g.font = '700 36px Outfit, sans-serif'
    g.fillText(E.anvil.zone, (xOf(WELD) + x1) / 2, 132)
    g.fillStyle = '#c8cce8'
    g.font = '700 30px Outfit, sans-serif'
    g.textAlign = 'left'
    g.fillText('°C', 8, 212)
  })
  textures.push(scaleTex)
  const scaleXOf = T => -SC.w / 2 + 0.055 + ((clamp(T, SC.t0, SC.t1) - SC.t0) / (SC.t1 - SC.t0)) * (SC.w - 0.11)
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 3), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
  marker.rotation.z = Math.PI
  const blowsText = makeText('', { size: 0.07, color: '#ffe2b8', anchorY: 'bottom', maxWidth: 1.2 })
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(SC.w + 0.08, SC.h + 0.08, 0.04, 2, 0.015), mats.wood)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(SC.w, SC.h), new THREE.MeshBasicMaterial({ map: scaleTex, toneMapped: false }))
    face.position.z = 0.022
    marker.position.set(0, (SC.h / 2) * (1 - (2 * 222) / 540) + 0.035, 0.03)
    blowsText.position.set(0, SC.h / 2 + 0.07, 0.02)
    scaleBoard.add(frame, face, marker, blowsText)
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, SCALE.y, 0.05), mats.wood)
      leg.position.set(s * (SC.w / 2 - 0.05), -SCALE.y / 2, -0.04)
      scaleBoard.add(leg)
    }
    scaleBoard.position.set(SCALE.x, SCALE.y, SCALE.z)
    scaleBoard.rotation.y = facing(SCALE.x, SCALE.z, SPOT.anvil)
    root.add(scaleBoard)
    solids.push(box(SCALE.x, SCALE.z, SC.w, 0.2))
  }
  let blowsShown = null

  // ---- the hearth: a raised clay hearth of glowing charcoal, with its own small bellows ----
  const hearthGroup = new THREE.Group()
  const hearthCoalMat = new THREE.MeshStandardMaterial({ color: '#1e1a18', roughness: 0.5, metalness: 0.2, emissive: '#ff4a0c', emissiveIntensity: 0.3 })
  const hearthGlow = new THREE.Mesh(new THREE.PlaneGeometry(HEARTH.w - 0.2, HEARTH.d - 0.2), new THREE.MeshBasicMaterial({ map: soft, color: new THREE.Color('#ff7a2a').multiplyScalar(1.4), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }))
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(HEARTH.w, HEARTH.top, HEARTH.d, 2, 0.04), stage.mats.daub)
    body.position.y = HEARTH.top / 2
    const rim = new THREE.Mesh(new THREE.BoxGeometry(HEARTH.w + 0.04, 0.06, HEARTH.d + 0.04), stone)
    rim.position.y = HEARTH.top + 0.0
    const bed = new THREE.Mesh(new THREE.BoxGeometry(HEARTH.w - 0.14, 0.02, HEARTH.d - 0.14), new THREE.MeshStandardMaterial({ color: '#1a100a', roughness: 1 }))
    bed.position.y = HEARTH.top + 0.035
    hearthGroup.add(body, rim, bed)
    // black charcoal with glowing embers among it
    const n = light ? 45 : 90
    const black = new THREE.MeshStandardMaterial({ color: '#222020', roughness: 0.45, metalness: 0.25 })
    const embers = Math.round(n * 0.35)
    const coals = [new THREE.InstancedMesh(lumpGeo, hearthCoalMat, embers), new THREE.InstancedMesh(lumpGeo, black, n - embers)]
    for (let i = 0; i < n; i++) {
      dummy.position.set((hash(21, i) - 0.5) * (HEARTH.w - 0.2), HEARTH.top + 0.05 + hash(21, i, 1) * 0.04, (hash(21, i, 2) - 0.5) * (HEARTH.d - 0.2))
      dummy.rotation.set(i, i * 2, i * 3)
      dummy.scale.setScalar(0.03 + 0.02 * hash(21, i, 3))
      dummy.updateMatrix()
      if (i < embers) coals[0].setMatrixAt(i, dummy.matrix)
      else coals[1].setMatrixAt(i - embers, dummy.matrix)
    }
    for (const c of coals) {
      c.raycast = () => {}
      hearthGroup.add(c)
    }
    hearthGlow.rotation.x = -Math.PI / 2
    hearthGlow.position.y = HEARTH.top + 0.1
    hearthGlow.raycast = () => {}
    hearthGroup.add(hearthGlow)
    hearthGroup.position.set(HEARTH.x, 0, HEARTH.z)
    root.add(hearthGroup)
    solids.push(box(HEARTH.x, HEARTH.z, HEARTH.w + 0.1, HEARTH.d + 0.1))
  }
  const hearthHit = new THREE.Mesh(new THREE.BoxGeometry(HEARTH.w, 0.3, HEARTH.d), ghost)
  hearthHit.position.set(HEARTH.x, HEARTH.top + 0.1, HEARTH.z)
  root.add(hearthHit)
  const hearthSmoke = stage.smoke({ x: HEARTH.x, y: HEARTH.top + 0.5, z: HEARTH.z, rate: 0.6, size: 1.2, opacity: 0.18, life: 5, max: 8 })
  // the small bellows behind the hearth
  const hBag = new THREE.Group()
  {
    const bag = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), leather)
    bag.scale.set(0.3, 0.12, 0.2)
    bag.position.y = 0.5
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.025, 0.32), mats.wood)
    board.position.y = 0.63
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.38, 0.34), mats.wood)
    stand.position.y = 0.19
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.5, 8), iron)
    nozzle.rotation.z = Math.PI / 2
    nozzle.position.set(-0.4, 0.5, 0)
    hBag.add(bag, board, stand, nozzle)
    hBag.userData = { bag, board, k: 0 }
    hBag.position.set(HB.x, 0, HB.z)
    // its nozzle (local -x) toward the hearth
    hBag.rotation.y = Math.atan2(HEARTH.z - HB.z, -(HEARTH.x - HB.x))
    root.add(hBag)
    solids.push(circle(HB.x, HB.z, 0.3))
  }
  const hBagHit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.45), ghost)
  hBagHit.position.y = 0.35
  hBag.add(hBagHit)

  // ---- the anvil's state ----
  // kind: 'bloom' (being forged), 'bar' (done), 'none'; mass (kg); blows; T0 and age: its heat, cooling
  // from T0 for age seconds; n: blows struck (for the others' sounds); re: reheats; made: bars made
  const P = { kind: 'bloom', mass: 3, blows: 0, T0: 1260, age: 0, n: 0, re: 0, made: 0 }
  const TAU_P = 90 // sped up less than the rest: time to walk over and strike
  const pieceT = () => (P.kind === 'none' ? 20 : 20 + (P.T0 - 20) * Math.exp(-Math.max(0, P.age) / TAU_P))
  let pieceMine = false
  let pieceAnim = null // { kind: 'reheat' | 'pile', t }
  let arriveAt = 0 // seconds until the pulled bloom lands (hidden till then)
  const setPiece = s => Object.assign(P, s)
  const anvilPanel = lv => ({
    title: E.anvil.title,
    color,
    blocks: [
      { buttons: ['strike', 'reheat', 'next', 'pile'].map(k => ({ label: E.anvil.buttons[k], onClick: () => anvilStep(k) })) },
      ...paras(E.anvil.panel, lv),
    ],
  })
  const anvilChanged = () => {
    pieceMine = true
    ex.discover('anvil', anvilPanel, 2.4)
    share('anvil')
  }
  const busyPiece = () => pieceAnim || arriveAt > 0
  // a visitor's step: a tap on the piece (strike, or a finished bar into the hearth), the hearth (reheat),
  // the pile (another bloom); or the panel's buttons
  function anvilStep(what) {
    const lv = level()
    const S = E.anvil.says
    if (busyPiece()) return say(at(W.busy, lv))
    if (what === 'piece') what = P.kind === 'bar' ? 'next' : P.kind === 'none' ? 'pile' : 'strike'
    if (what === 'strike') {
      if (P.kind === 'none') return say(at(S.none, lv))
      if (P.kind === 'bar') return say(at(S.bar, lv))
      const T = pieceT()
      if (T < WELD) return say(fill(at(S.cold, lv), { t: fmtT(T) }))
      P.blows++
      P.n++
      P.T0 = T - 15
      P.age = 0
      strikeAnim()
      if (P.blows >= MAX_BLOWS) {
        P.kind = 'bar'
        play('select')
        say(at(S.bar, lv))
      } else if (P.blows === 1) say(at(S.first, lv))
      else if (P.blows === Math.round(MAX_BLOWS / 2)) say(fill(at(S.half, lv), { n: P.blows, max: MAX_BLOWS }))
      else say(fill(at(S.blow, lv), { n: P.blows, max: MAX_BLOWS }))
    } else if (what === 'reheat') {
      if (P.kind === 'none') return say(at(S.none, lv))
      const fromT = pieceT()
      P.T0 = 1300
      P.age = -1.4 // back from the hearth in 1.4 s, at 1300 °C then
      P.re++
      pieceAnim = { kind: 'reheat', t: 0, fromT }
      play('fizz', { order: 0.4 })
      say(at(P.kind === 'bar' ? S.reheatBar : S.reheat, lv))
    } else if (what === 'next') {
      if (P.kind !== 'bar') return say(at(P.kind === 'none' ? S.none : S.notYet, lv))
      // the finished bar goes into the hearth, for the steel station; the bar there goes onto the rack
      const T = pieceT()
      P.kind = 'none'
      P.made++
      newBar(T)
      play('select')
      say(at(S.toHearth, lv))
      share('steel')
    } else if (what === 'pile') {
      if (P.kind !== 'none') return say(at(S.busy, lv))
      setPiece({ kind: 'bloom', mass: 3, blows: 0, T0: 1300, age: -1.4 })
      pieceAnim = { kind: 'pile', t: 0, fromT: 20 }
      play('select')
      say(at(S.pile, lv))
    } else return
    anvilChanged()
  }
  function strikeAnim() {
    hammerT = 0
    later(0.18, () => {
      const top = anvilTop.clone().setY(ANVIL.top + 0.08)
      burst(top, light ? 18 : 34, SPARK, 1.6, 0.35, 0.9)
      play('pop')
      play('crack')
    })
  }
  clickable(pieceHit, () => anvilStep('piece'), { when: () => P.kind !== 'none' })
  clickable(pileGroup, () => anvilStep('pile'))
  clickable(hammerPivot, () => anvilStep('strike'), { when: () => P.kind === 'bloom' })
  // the hearth serves both stations: the one the visitor stands at decides what a tap on it does
  const hearthTap = () => {
    const at2 = near()
    if (at2 === 'steel') return steelStep('soak')
    if (at2 === 'anvil' || (P.kind !== 'none' && P.kind !== 'bar')) return anvilStep('reheat')
    return steelStep('soak')
  }
  clickable(hearthHit, hearthTap)
  ex.add({
    id: 'anvil',
    x: SPOT.anvil.x,
    z: SPOT.anvil.z,
    radius: 1.5,
    manual: true,
    label: E.anvil.label,
    verb: () => {
      const H = E.anvil.hints
      if (busyPiece()) return H.heating
      if (P.kind === 'none') return H.none
      if (P.kind === 'bar') return H.bar
      if (pieceT() < WELD) return H.cold
      return H.strike
    },
    focus: { x: 0.75, y: 1.05, z: -3.6, size: 2.4, width: 3.4 },
    act: () => ctx.showPanel(anvilPanel),
  })
  const hearthSpot = new THREE.Vector3(HEARTH.x - 0.2, HEARTH.top + 0.08, HEARTH.z + 0.08)
  const pileSpot = new THREE.Vector3(PILE.x + 0.06, 0.18, PILE.z + 0.06)
  function poseAnvil(dt, t) {
    P.age += dt
    if (arriveAt > 0) arriveAt = Math.max(0, arriveAt - dt)
    const T = pieceT()
    // the hammer: up, down onto the piece, up again
    hammerT = Math.min(1, hammerT + dt / 0.45)
    const down = hammerT < 0.4 ? span(0, 0.4, hammerT) : 1 - span(0.4, 1, hammerT)
    // raised as in the picture; a blow brings the head's face down onto the piece's top
    const pieceTop = P.kind === 'bar' ? ANVIL.top + 0.05 : P.kind === 'bloom' ? ANVIL.top + 1.8 * (0.035 + 0.045 * Math.cbrt(P.mass)) * (1 - 0.55 * (P.blows / MAX_BLOWS)) : ANVIL.top
    const strikeA = Math.asin(clamp((hammerPivot.position.y - 0.065 - pieceTop) / 0.47, -1, 1))
    hammerPivot.rotation.z = -0.45 + (strikeA + 0.45) * (hammerT < 1 ? down : 0) + Math.sin(t * 0.8) * 0.02
    // the piece: where it is, its shape and glow
    const k = P.blows / MAX_BLOWS
    const R = 0.035 + 0.045 * Math.cbrt(P.mass)
    let where = anvilTop
    if (pieceAnim) {
      pieceAnim.t += dt
      const a = pieceAnim.t
      const from = pieceAnim.kind === 'pile' ? pileSpot : anvilTop
      if (a < 0.5) where = tmpV.lerpVectors(from, hearthSpot, span(0, 0.5, a)).setY(tmpV.y + Math.sin(Math.PI * span(0, 0.5, a)) * 0.4)
      else if (a < 0.9) where = hearthSpot
      else if (a < 1.4) where = tmpV.lerpVectors(hearthSpot, anvilTop, span(0.9, 1.4, a)).setY(tmpV.y + Math.sin(Math.PI * span(0.9, 1.4, a)) * 0.4)
      else pieceAnim = null
      if (pieceAnim && a > 0.5 && a < 0.9 && Math.random() < dt * 20) burst(hearthSpot.clone().setY(HEARTH.top + 0.15), 1, SPARK, 0.6, 1)
    }
    const showT = pieceAnim ? (pieceAnim.t > 0.6 ? 1300 : pieceAnim.fromT) : T
    const isBar = P.kind === 'bar'
    piece.visible = P.kind === 'bloom' && arriveAt <= 0
    bar.visible = isBar && arriveAt <= 0
    if (piece.visible) {
      piece.scale.set(R * (1 + 1.3 * k), R * (1 - 0.55 * k), R * (1 - 0.3 * k))
      piece.position.copy(where).setY(where.y + R * (1 - 0.55 * k) * 0.8)
      piece.rotation.set(0, 0.3, 0)
      setGlow(pieceMat, showT)
    }
    if (bar.visible) {
      const len = 0.16 + 0.07 * P.mass
      bar.scale.set(len, 0.045, 0.06)
      bar.position.copy(where).setY(where.y + 0.024)
      bar.rotation.set(0, 0.15, 0)
      setGlow(barMat, showT)
    }
    pieceLight.intensity = P.kind !== 'none' && arriveAt <= 0 ? 1.6 * smooth(600, 1300, showT) : 0
    // the board: the blows so far, and the marker at the piece's heat
    const bt = P.kind === 'none' ? E.anvil.board.none : P.kind === 'bar' ? E.anvil.board.bar : fill(E.anvil.board.blows, { n: P.blows, max: MAX_BLOWS })
    if (bt !== blowsShown) {
      blowsShown = bt
      blowsText.text = bt
      blowsText.sync()
    }
    marker.visible = P.kind !== 'none' && showT > SC.t0 - 20
    marker.position.x = scaleXOf(showT)
  }
  updates.push(poseAnvil)
  const anvilState = () => ({ kind: P.kind, mass: P.mass, blows: P.blows, T0: r1(P.T0), age: r1(P.age), n: P.n, re: P.re, made: P.made })
  const anvilSet = (s, liveSet, ago = 0) => {
    const was = { n: P.n, re: P.re, kind: P.kind }
    const kind = ['bloom', 'bar', 'none'].includes(s?.kind) ? s.kind : 'none'
    P.kind = kind
    P.mass = clamp(Number(s?.mass) || 3, 0.5, 40)
    P.blows = clamp(Math.round(Number(s?.blows) || 0), 0, MAX_BLOWS)
    P.T0 = clamp(Number(s?.T0) || 20, 20, 1400)
    P.age = (Number(s?.age) || 0) + Math.min(3600, Number(ago) || 0)
    P.n = Math.max(0, Math.round(Number(s?.n) || 0))
    P.re = Math.max(0, Math.round(Number(s?.re) || 0))
    P.made = Math.max(0, Math.round(Number(s?.made) || 0))
    pieceMine = false
    if (liveSet) {
      if (P.n > was.n) strikeAnim()
      if (P.re > was.re) pieceAnim = { kind: 'reheat', t: 0, fromT: 800 }
      else if (was.kind === 'none' && kind === 'bloom' && P.age < 0) pieceAnim = { kind: 'pile', t: 0, fromT: 20 }
    } else {
      pieceAnim = null
      arriveAt = 0
    }
  }

  // ================================================================================================
  // ======== steel and the magnet ========
  // ================================================================================================
  // the bucket of water, as the picture's
  const bucket = new THREE.Group()
  const waterMat = new THREE.MeshStandardMaterial({ color: '#2a4a6a', roughness: 0.1, metalness: 0.3, emissive: '#1a2a44', emissiveIntensity: 0.6 })
  {
    const staves = new THREE.Mesh(new THREE.CylinderGeometry(BUCKET.r, BUCKET.r * 0.85, BUCKET.h, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#6a4c32', roughness: 0.85, side: THREE.DoubleSide }))
    staves.position.y = BUCKET.h / 2
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(BUCKET.r * 0.85, 18), mats.wood)
    bottom.rotation.x = -Math.PI / 2
    bottom.position.y = 0.02
    const water = new THREE.Mesh(new THREE.CircleGeometry(BUCKET.r * 0.97, 24), waterMat)
    water.rotation.x = -Math.PI / 2
    water.position.y = BUCKET.h - 0.06
    bucket.add(staves, bottom, water)
    for (const y of [0.1, BUCKET.h - 0.08]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(BUCKET.r * (1 - 0.15 * (1 - y / BUCKET.h)) + 0.006, 0.012, 6, 28), iron)
      hoop.rotation.x = Math.PI / 2
      hoop.position.y = y
      bucket.add(hoop)
    }
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(BUCKET.r + 0.05, BUCKET.r + 0.05, BUCKET.h + 0.2, 12), ghost)
    hit.position.y = (BUCKET.h + 0.2) / 2
    bucket.add(hit)
    bucket.position.set(BUCKET.x, 0, BUCKET.z)
    root.add(bucket)
    solids.push(circle(BUCKET.x, BUCKET.z, BUCKET.r + 0.05))
  }
  const steam = Array.from({ length: light ? 6 : 12 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#eceaf2', transparent: true, opacity: 0, depthWrite: false }))
    root.add(s)
    return { s, ph: i / 12 }
  })
  let steamK = 0
  // the test block and the file
  const fileGroup = new THREE.Group()
  {
    const blk = new THREE.Mesh(new RoundedBoxGeometry(0.52, BLOCK.h, 0.42, 2, 0.04), stone)
    blk.position.set(BLOCK.x, BLOCK.h / 2, BLOCK.z)
    root.add(blk)
    solids.push(box(BLOCK.x, BLOCK.z, 0.55, 0.45))
    const fileTex = canvasTex(256, 32, (g, w, h) => {
      g.fillStyle = '#5a5e64'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(20,20,24,0.8)'
      g.lineWidth = 1.5
      for (let x = -h; x < w; x += 5) {
        g.beginPath()
        g.moveTo(x, 0)
        g.lineTo(x + h, h)
        g.stroke()
      }
    })
    textures.push(fileTex)
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.032), new THREE.MeshStandardMaterial({ map: fileTex, roughness: 0.5, metalness: 0.7 }))
    blade.position.x = 0.15
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.12, 8), mats.wood)
    handle.rotation.z = Math.PI / 2
    handle.position.x = -0.06
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.1, 0.12), ghost)
    hit.position.x = 0.1
    fileGroup.add(blade, handle, hit)
  }
  const FILE_REST = new THREE.Vector3(BLOCK.x - 0.08, BLOCK.h + 0.01, BLOCK.z + 0.15)
  fileGroup.position.copy(FILE_REST)
  root.add(fileGroup)
  // the scratch the file leaves on soft iron
  const scratch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.002, 0.018), new THREE.MeshStandardMaterial({ color: '#e8e8ec', roughness: 0.2, metalness: 0.9 }))
  scratch.visible = false
  root.add(scratch)
  // the steel bar
  const steelMat = hotMetal()
  const steelBar = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.032, 0.056, 2, 0.01), steelMat)
  root.add(steelBar)
  const steelHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.16), ghost)
  steelBar.add(steelHit)
  // lying on the coals, where it can be seen
  const BAR_HEARTH = new THREE.Vector3(HEARTH.x + 0.18, HEARTH.top + 0.11, HEARTH.z + 0.05)
  const BAR_BLOCK = new THREE.Vector3(BLOCK.x + 0.02, BLOCK.h + 0.017, BLOCK.z - 0.04)
  const BAR_DIP = new THREE.Vector3(BUCKET.x, BUCKET.h - 0.2, BUCKET.z)
  // the rack of bars already made
  const rackBars = new THREE.InstancedMesh(new RoundedBoxGeometry(0.42, 0.032, 0.056, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#4a4c52', roughness: 0.5, metalness: 0.6 }), 6)
  {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.9, 10), mats.wood)
    log.rotation.z = Math.PI / 2
    log.position.set(RACK.x, 0.14, RACK.z)
    log.rotation.y = 0.5
    root.add(log)
    solids.push(circle(RACK.x, RACK.z, 0.4))
    for (let i = 0; i < 6; i++) {
      dummy.position.set(RACK.x + (i - 2.5) * 0.09 * Math.cos(0.5) + 0.02, 0.3, RACK.z - (i - 2.5) * 0.09 * Math.sin(0.5))
      dummy.rotation.set(0, 0.5 + Math.PI / 2, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      rackBars.setMatrixAt(i, dummy.matrix)
    }
    root.add(rackBars)
  }
  // the magnet on a stick, hung on its post
  const magnet = new THREE.Group()
  {
    const red = new THREE.MeshStandardMaterial({ color: '#d8302a', roughness: 0.4, metalness: 0.3 })
    const silver = new THREE.MeshStandardMaterial({ color: '#d0d4da', roughness: 0.3, metalness: 0.9 })
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16, Math.PI), red)
    arc.position.y = 0.07
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), red)
      leg.position.set(s * 0.045, 0.04, 0)
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.03), silver)
      tip.position.set(s * 0.045, 0.0, 0)
      magnet.add(leg, tip)
    }
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.75, 6), mats.wood)
    stick.position.y = 0.11 + 0.375
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 0.2), ghost)
    hit.position.y = 0.4
    magnet.add(arc, stick, hit)
    root.add(magnet)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.3, 8), mats.wood)
    post.position.set(POST.x, 0.65, POST.z)
    const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6), mats.wood)
    peg.rotation.x = Math.PI / 2
    peg.position.set(POST.x, 1.2, POST.z + 0.07)
    root.add(post, peg)
    solids.push(circle(POST.x, POST.z, 0.12))
  }
  const MAG_REST = { p: new THREE.Vector3(POST.x, 0.4, POST.z + 0.08), q: new THREE.Quaternion() }
  let magK = 0
  let magAnim = null // { kind: 'stick' | 'bounce' | 'release', t }
  // the board under the carbon lens: carbon, heat, what the tests said
  const lens2 = lensOn(LENS2, SPOT.steel)
  const steelBoard = new THREE.Group()
  const sbLines = [0, 1, 2].map(i => {
    const t = makeText('', { size: i === 2 ? 0.056 : 0.06, color: i === 2 ? '#ffd166' : '#ffe2b8', anchorY: 'middle', maxWidth: 1.0 })
    t.position.set(0, 0.1 - i * 0.1, 0.025)
    steelBoard.add(t)
    return t
  })
  {
    const b = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.36, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#121633', roughness: 0.5 }))
    steelBoard.add(b)
    steelBoard.position.set(0, LENS2.y - LENS2.r - 0.3, 0.02)
    lens2.group.add(steelBoard)
  }
  const sbShown = ['', '', '']
  // the lens's atoms: iron in rows, carbon creeping in from the surface (the left edge)
  const L2 = { cols: 7, rows: 4, a: 0.085 }
  const fe2 = []
  for (let i = 0; i < L2.cols; i++) {
    for (let j = 0; j < L2.rows; j++) {
      const x = (i - (L2.cols - 1) / 2) * L2.a
      const y = (j - (L2.rows - 1) / 2) * L2.a
      if (Math.hypot(x, y) > LENS2.r - 0.05) continue
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 10), feMat)
      m.position.set(x, y, 0.06)
      lens2.face.add(m)
      fe2.push({ m, x, y, seed: i * 7 + j })
    }
  }
  // the holes between iron atoms where carbon sits, nearest the surface first
  const sites = []
  for (let i = 0; i < L2.cols - 1; i++) {
    for (let j = 0; j < L2.rows; j++) {
      const x = (i + 0.5 - (L2.cols - 1) / 2) * L2.a
      const y = (j - (L2.rows - 1) / 2) * L2.a
      if (Math.hypot(x, y) < LENS2.r - 0.06) sites.push({ x, y, key: x + 0.04 * hash(5, i, j) })
    }
  }
  sites.sort((p, q) => p.key - q.key)
  const MAX_C = 12
  const c2 = Array.from({ length: MAX_C }, (_, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 8), cMat)
    m.visible = false
    lens2.face.add(m)
    return { m, x: -LENS2.r, y: sites[i % sites.length].y, k: 0 }
  })
  const lensWord = makeText('', { size: 0.04, color: '#ffe2c0', anchorY: 'middle', maxWidth: 0.46 })
  lensWord.position.set(0, LENS2.r * 0.6, 0.08)
  lens2.face.add(lensWord)
  const fec = formulaText('Fe', { size: 0.06, color: '#ffb07a' })
  fec.position.set(-LENS2.r * 0.45, -LENS2.r * 0.7, 0.08)
  const cc = formulaText('C', { size: 0.06, color: '#c8c8d8' })
  cc.position.set(LENS2.r * 0.45, -LENS2.r * 0.7, 0.08)
  lens2.face.add(fec, cc)
  let lensWordShown = null

  // ---- the steel's state ----
  // hours in the hot charcoal (the slider); heat: the hearth's heat the bar tends to; where: 'hearth' or
  // 'block'; T0 and age: its heat, tending from T0 for age seconds; cooled: '' (in the fire), 'water' or
  // 'air'; hard (0..1) and from: the quench's heat; filed: tested since; magnet: stuck to it; m, q, f:
  // counts of magnet tests, quenches, filings (for the others' animations); bars: on the rack
  const S = { hours: 0, heat: 600, where: 'hearth', T0: 600, age: 60, hard: 0, from: 0, cooled: '', filed: 0, magnet: 0, m: 0, q: 0, f: 0, bars: 2 }
  const carbon = () => 0.8 * (1 - Math.exp(-S.hours / 2))
  const caseDepth = () => 0.55 * Math.sqrt(S.hours)
  const steelT = () => {
    if (S.where === 'hearth') return S.heat + (S.T0 - S.heat) * Math.exp(-Math.max(0, S.age) / 3)
    return 20 + (S.T0 - 20) * Math.exp(-Math.max(0, S.age) / (S.cooled === 'water' ? 0.6 : 2.5))
  }
  // how hard a quench from T leaves steel with carbon c: full above the line where all of it turned to
  // austenite (912 °C for pure iron down to 727 °C at 0.8% carbon), none below 727 °C
  const hardness = (T, c) => {
    const a3 = 912 - (185 * Math.min(c, 0.8)) / 0.8
    const q = T >= a3 ? 1 : T <= 727 ? 0 : (T - 727) / (a3 - 727)
    return smooth(0.15, 0.5, c) * q
  }
  let steelMine = false
  let barAnim = null // { kind: 'quench' | 'air' | 'back', t, file }
  let fileAnim = null // { t, hard }
  let hbK = 0
  const steelPanel = lv => ({
    title: E.steel.title,
    color,
    blocks: [
      { slider: { label: E.steel.sliders.hours, min: 0, max: 8, step: 0.5, value: S.hours, onInput: v => setHours(v), format: v => fill(E.steel.hoursFmt, { h: num(v, 1, lang) }), live: () => S.hours } },
      { slider: { label: E.steel.sliders.heat, min: 20, max: 1200, step: 10, value: Math.round(S.heat), onInput: v => setHeat(v), format: v => fmtT(v), live: () => Math.round(S.heat) } },
      { buttons: ['magnet', 'quench', 'file', 'back'].map(k => ({ label: E.steel.buttons[k], onClick: () => steelStep(k) })) },
      ...paras(E.steel.panel, lv),
    ],
  })
  const steelChanged = () => {
    steelMine = true
    ex.discover('steel', steelPanel, 2.6)
    share('steel')
  }
  let steelSending = false
  const steelSoon = () => {
    steelMine = true
    ex.discover('steel', steelPanel, 2.6)
    if (steelSending) return
    steelSending = true
    later(0.25, () => {
      steelSending = false
      share('steel')
    })
  }
  /** Into the fire (from the block): its heat starts from where it is; hardness is lost. */
  const intoFire = () => {
    const T = steelT()
    if (S.where !== 'hearth') {
      S.where = 'hearth'
      S.cooled = ''
      S.hard = 0
      S.from = 0
      S.filed = 0
      barAnim = { kind: 'back', t: 0 }
    }
    S.T0 = T
    S.age = 0
  }
  function setHeat(v) {
    if (barAnim && barAnim.kind !== 'back') return
    const T = clamp(Math.round(Number(v) || 20), 20, 1200)
    intoFire()
    S.heat = T
    steelSoon()
  }
  function setHours(v) {
    if (barAnim && barAnim.kind !== 'back') return
    const h = clamp(Math.round((Number(v) || 0) * 2) / 2, 0, 8)
    intoFire()
    if (h > S.hours && S.heat < 900) {
      S.T0 = steelT()
      S.age = 0
      S.heat = 900
    }
    S.hours = h
    steelSoon()
  }
  function newBar(T) {
    S.bars = Math.min(6, S.bars + 1)
    if (S.magnet) magAnim = { kind: 'release', t: 0 }
    Object.assign(S, { hours: 0, heat: Math.max(600, Math.min(T, 900)), where: 'hearth', T0: T, age: 0, hard: 0, from: 0, cooled: '', filed: 0, magnet: 0 })
    barAnim = null
  }
  // a visitor's step: a tap on the hearth (an hour more in the charcoal, or back into the fire), its small
  // bellows (hotter), the magnet, the bucket, the file, the bar on the block; or the panel's buttons
  function steelStep(what) {
    const lv = level()
    const SS = E.steel.says
    if (barAnim && barAnim.kind !== 'back') return say(at(W.busy, lv))
    if (what === 'soak') {
      if (S.where !== 'hearth') {
        intoFire()
        play('tap')
        say(at(SS.back, lv))
      } else {
        if (S.hours >= 8) return say(at(SS.soakFull, lv))
        S.T0 = steelT()
        S.age = 0
        S.hours = Math.min(8, S.hours + 1)
        if (S.heat < 900) S.heat = 900
        play('fizz', { order: 0.3 })
        say(fill(at(SS.soak, lv), { h: num(S.hours, 0, lang), c: num(carbon(), 2, lang), d: num(caseDepth(), 1, lang) }))
      }
    } else if (what === 'bellows') {
      intoFire()
      if (S.heat >= 1200) return say(at(SS.max, lv))
      S.heat = Math.min(1200, Math.round(S.heat / 100) * 100 + 100)
      hbK = 1
      play('fizz', { order: 0.5 })
      say(fill(at(SS.bellows, lv), { t: fmtT(S.heat) }))
    } else if (what === 'magnet') {
      S.m++
      if (S.magnet) {
        S.magnet = 0
        magAnim = { kind: 'release', t: 0 }
        play('part')
        say(at(SS.magnetOff, lv))
      } else {
        const T = steelT()
        if (T < CURIE) {
          S.magnet = 1
          magAnim = { kind: 'stick', t: 0 }
          later(0.45, () => play('tap'))
          say(fill(at(T > 550 ? SS.magnetStill : SS.magnetSticks, lv), { t: fmtT(T) }))
        } else {
          magAnim = { kind: 'bounce', t: 0 }
          later(0.5, () => play('part'))
          say(fill(at(SS.magnetFalls, lv), { t: fmtT(T) }))
        }
      }
    } else if (what === 'quench') {
      if (S.where !== 'hearth') return say(at(SS.alreadyCool, lv))
      const T = steelT()
      const c = carbon()
      S.hard = r3(hardness(T, c))
      S.from = Math.round(T)
      S.where = 'block'
      S.cooled = 'water'
      S.T0 = T
      S.age = -1.0 // it reaches the water a second from now
      S.magnet = 0
      S.filed = 0
      S.q++
      barAnim = { kind: 'quench', t: 0 }
      const vars = { t: fmtT(T), c: num(c, 2, lang) }
      let line = SS.quench.hard
      if (c < 0.15) line = SS.quench.noCarbon
      else if (T < 740) line = SS.quench.cold
      else if (T > 1000 && S.hard > 0.5) line = SS.quench.hot
      else if (S.hard < 0.7) line = SS.quench.mid
      later(1.0, () => say(fill(at(line, level()), vars)))
    } else if (what === 'file') {
      S.f++
      if (S.where === 'hearth') {
        // out of the fire to cool slowly in the air first: slow cooling leaves it soft
        S.from = Math.round(steelT())
        S.T0 = steelT()
        S.age = -1.0
        S.where = 'block'
        S.cooled = 'air'
        S.hard = 0
        S.magnet = 0
        S.filed = 1
        barAnim = { kind: 'air', t: 0, file: true }
        say(at(SS.airCool, lv))
      } else {
        S.filed = 1
        fileAnim = { t: 0, hard: S.hard }
        play('tap')
      }
    } else if (what === 'bar' || what === 'back') {
      if (S.where === 'hearth') return say(at(SS.inFire, lv))
      intoFire()
      play('tap')
      say(at(SS.back, lv))
    } else return
    steelChanged()
  }
  const fileLine = hard => (hard >= 0.7 ? E.steel.says.fileSkate : hard >= 0.3 ? E.steel.says.fileLittle : E.steel.says.fileBite)
  clickable(hBag, () => steelStep('bellows'))
  clickable(magnet, () => steelStep('magnet'))
  clickable(bucket, () => steelStep('quench'))
  clickable(fileGroup, () => steelStep('file'))
  clickable(steelBar, () => steelStep('bar'), { when: () => S.where === 'block' && !barAnim })
  ex.add({
    id: 'steel',
    x: SPOT.steel.x,
    z: SPOT.steel.z,
    radius: 1.7,
    manual: true,
    label: E.steel.label,
    verb: () => {
      const H = E.steel.hints
      if (barAnim && barAnim.kind !== 'back') return H.wait
      if (S.where === 'block') return S.filed ? H.again : H.file
      const T = steelT()
      if (carbon() < 0.3) return H.soak
      if (S.magnet) return H.magnetOn
      if (T < 700) return H.heat
      if (T < CURIE) return H.magnet
      return H.quench
    },
    focus: { x: 3.25, y: 0.95, z: -3.8, size: 2.8, width: 4.6 },
    act: () => ctx.showPanel(steelPanel),
  })
  // the magnet's pose: hung on its post, or touching the bar
  const magTarget = () => steelBar.position.clone().add(new THREE.Vector3(0, 0.03, 0))
  const magTouchQ = () => {
    const toward = new THREE.Vector3(SPOT.steel.x - steelBar.position.x, 0, SPOT.steel.z - steelBar.position.z).normalize().multiplyScalar(0.55).add(new THREE.Vector3(0, 1, 0)).normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), toward)
  }
  function poseSteel(dt, t) {
    S.age += dt
    const T = steelT()
    // the magnet lets go by itself when the bar passes the Curie point: the smith's cue
    if (S.magnet && T >= CURIE && S.where === 'hearth') {
      S.magnet = 0
      magAnim = { kind: 'release', t: 0 }
      play('part')
      if (steelMine) say(at(E.steel.says.magnetLetsGo, level()))
    }
    // the bar's way: from the fire to the bucket and the block, from the fire to the block, or back
    let p = S.where === 'hearth' ? BAR_HEARTH : BAR_BLOCK
    let tilt = 0
    if (barAnim) {
      barAnim.t += dt
      const a = barAnim.t
      if (barAnim.kind === 'quench') {
        if (a < 0.6) p = tmpV.lerpVectors(BAR_HEARTH, BAR_DIP.clone().setY(BUCKET.h + 0.3), span(0, 0.6, a))
        else if (a < 1.0) p = tmpV.lerpVectors(BAR_DIP.clone().setY(BUCKET.h + 0.3), BAR_DIP, span(0.6, 1.0, a))
        else if (a < 1.6) p = BAR_DIP
        else if (a < 2.2) p = tmpV.lerpVectors(BAR_DIP, BAR_BLOCK, span(1.6, 2.2, a)).setY(tmpV.y + Math.sin(Math.PI * span(1.6, 2.2, a)) * 0.3)
        else barAnim = null
        tilt = a > 0.6 && a < 1.6 ? 1.3 : 0
        if (a >= 1.0 && !barAnim?.hissed && barAnim) {
          barAnim.hissed = true
          steamK = 1
          play('fizz', { order: 1.6 })
        }
      } else if (barAnim.kind === 'air') {
        if (a < 0.8) p = tmpV.lerpVectors(BAR_HEARTH, BAR_BLOCK, span(0, 0.8, a)).setY(tmpV.y + Math.sin(Math.PI * span(0, 0.8, a)) * 0.35)
        else if (a > 3.4) {
          const file = barAnim.file
          barAnim = null
          if (file) {
            fileAnim = { t: 0, hard: S.hard }
            play('tap')
          }
        }
      } else if (barAnim.kind === 'back') {
        if (a < 0.7) p = tmpV.lerpVectors(BAR_BLOCK, BAR_HEARTH, span(0, 0.7, a)).setY(tmpV.y + Math.sin(Math.PI * span(0, 0.7, a)) * 0.35)
        else barAnim = null
      }
    }
    steelBar.position.copy(p)
    steelBar.rotation.set(0, 0.35, tilt)
    // in the water the glow goes at once; on the block it fades
    const shownT = barAnim?.kind === 'quench' && barAnim.t < 1.0 ? S.T0 : T
    setGlow(steelMat, shownT)
    // a quenched hard bar is grey; a slowly cooled one dark with scale
    steelMat.color.set(S.cooled === 'water' ? '#6a6e74' : '#45403c')
    // steam over the bucket after a quench
    steamK = Math.max(0, steamK - dt * 0.22)
    steam.forEach(st => {
      const u = (t * 0.4 + st.ph) % 1
      st.s.position.set(BUCKET.x + Math.sin(u * 7 + st.ph * 20) * 0.08, BUCKET.h + 0.05 + u * 0.9, BUCKET.z + Math.cos(u * 5 + st.ph * 9) * 0.08)
      st.s.scale.setScalar(0.12 + u * 0.4)
      st.s.material.opacity = (0.02 + steamK * 0.5) * Math.sin(Math.PI * u)
    })
    waterMat.emissiveIntensity = 0.6 + steamK * 0.3
    // the file at work: back and forth along the bar; filings from soft iron, glints from hard steel
    let fp = FILE_REST
    scratch.visible = S.where === 'block' && S.filed && S.hard < 0.3 && !barAnim
    if (scratch.visible) {
      scratch.position.copy(steelBar.position).setY(steelBar.position.y + 0.017)
      scratch.rotation.y = 0.35
    }
    if (fileAnim) {
      fileAnim.t += dt
      const a = fileAnim.t
      const stroke = Math.sin(a * Math.PI * 2.6)
      fp = tmpV.copy(steelBar.position).add(new THREE.Vector3(Math.cos(0.35) * stroke * 0.08 - 0.12, 0.03, -Math.sin(0.35) * stroke * 0.08 + 0.02))
      if (Math.random() < dt * 18) {
        if (fileAnim.hard >= 0.7) burst(steelBar.position.clone().setY(steelBar.position.y + 0.03), 1, SPARK_WHITE, 0.4, 1.2, 0.25)
        else burst(steelBar.position.clone().setY(steelBar.position.y + 0.02), 2, FILINGS, 0.25, -0.2, 0.9)
      }
      if (a > 1.5) {
        const hard = fileAnim.hard
        fileAnim = null
        play(hard >= 0.7 ? 'crack' : 'fizz', { order: 0.3 })
        if (steelMine) say(at(fileLine(hard), level()))
      }
    }
    fileGroup.position.copy(fp)
    fileGroup.rotation.set(0, 0.35 + (fileAnim ? 0 : 0.6), fileAnim ? -0.25 : 0)
    // the magnet
    if (magAnim) magAnim.t += dt
    let k = S.magnet ? 1 : 0
    if (magAnim) {
      const a = magAnim.t
      if (magAnim.kind === 'stick') k = span(0, 0.45, a)
      else if (magAnim.kind === 'bounce') k = a < 0.45 ? span(0, 0.45, a) : a < 0.7 ? 1 : 1 - span(0.7, 1.3, a)
      else if (magAnim.kind === 'release') k = 1 - span(0, 0.6, a)
      if (a > 1.4) magAnim = null
    }
    magK = k
    const touch = magTarget()
    magnet.position.lerpVectors(MAG_REST.p, touch, ease(magK))
    magnet.position.y += Math.sin(Math.PI * magK) * 0.25 * (magAnim?.kind === 'bounce' && magAnim.t > 0.7 ? 0.4 : 1)
    if (magAnim?.kind === 'bounce' && magAnim.t > 0.45 && magAnim.t < 0.7) magnet.position.y += 0.02 + Math.sin(magAnim.t * 60) * 0.008
    magnet.quaternion.slerpQuaternions(MAG_REST.q, magTouchQ(), ease(magK))
    // the hearth: its coals and light follow the heat it is blown to
    const hk = smooth(300, 1200, S.heat)
    const flick = 1 + Math.sin(t * 11) * 0.06 + Math.sin(t * 23.3) * 0.05
    hearthCoalMat.emissiveIntensity = (0.3 + 0.9 * hk) * flick
    hearthGlow.material.opacity = (0.15 + 0.35 * hk) * flick
    hearthLight.intensity = (0.6 + 1.6 * hk) * flick
    hearthSmoke.setRate(0.4 + hk)
    hbK = Math.max(0, hbK - dt * 2.4)
    const sq = Math.sin(Math.PI * hbK)
    hBag.userData.bag.scale.y = 0.12 * (1 - 0.5 * sq)
    hBag.userData.board.position.y = 0.63 - 0.06 * sq
    // the rack
    rackBars.count = Math.min(6, S.bars)
    // the board
    const c = carbon()
    const lines = [
      fill(E.steel.board.carbon, { c: num(c, 2, lang), d: num(caseDepth(), 1, lang) }),
      fill(E.steel.board.heat, { t: fmtT(Math.round(T / 10) * 10) }),
      S.where === 'block' && S.cooled === 'water' && S.filed && !fileAnim && !barAnim ? (S.hard >= 0.7 ? E.steel.board.hard : S.hard >= 0.3 ? E.steel.board.mid : E.steel.board.soft) : S.where === 'block' && S.cooled === 'air' && !fileAnim && !barAnim ? E.steel.board.soft : S.magnet ? E.steel.board.magnetOn : T >= CURIE && S.where === 'hearth' ? E.steel.board.magnetOff : '',
    ]
    lines.forEach((ln, i) => {
      if (ln !== sbShown[i]) {
        sbShown[i] = ln
        sbLines[i].text = ln
        sbLines[i].sync()
      }
    })
    // the lens: carbon atoms creep in from the surface; quenched, they are trapped in a strained lattice;
    // cooled slowly, they gather in clumps
    const nC = Math.round(MAX_C * clamp(c / 0.8))
    const strained = S.where === 'block' && S.cooled === 'water' && S.hard >= 0.3 && !(barAnim && barAnim.t < 1)
    const clumped = S.where === 'block' && S.cooled === 'air' && c > 0.15 && !(barAnim && barAnim.t < 1.5)
    const hotK = S.where === 'hearth' ? smooth(20, 1100, T) : 0
    fe2.forEach(f => {
      const j = 0.002 + 0.01 * hotK
      const sx = strained ? 0.96 : 1
      const sy = strained ? 1.07 : 1
      f.m.position.set(f.x * sx + (strained ? f.y * 0.06 : 0) + Math.sin(t * 9 + f.seed) * j, f.y * sy + Math.cos(t * 8 + f.seed * 1.3) * j, 0.06)
    })
    c2.forEach((ca, i) => {
      const on = i < nC
      ca.k = damp(ca.k, on ? 1 : 0, 3, dt)
      ca.m.visible = ca.k > 0.02
      const site = sites[i % sites.length]
      let tx = site.x
      let ty = site.y
      if (clumped) {
        tx = 0.12 + (i % 2) * 0.03
        ty = (Math.floor(i / 2) - 2.5) * 0.045
      } else if (strained) {
        tx = site.x * 0.96 + site.y * 0.06
        ty = site.y * 1.07
      }
      ca.x = damp(ca.x, on ? tx : -LENS2.r, on ? 2.2 : 4, dt)
      ca.y = damp(ca.y, ty, 3, dt)
      ca.m.position.set(ca.x + Math.sin(t * 7 + i) * 0.006 * hotK, ca.y, 0.075)
      ca.m.scale.setScalar(0.4 + 0.6 * ca.k)
    })
    const lw = strained ? E.steel.lens.trapped : clumped ? E.steel.lens.clumps : c > 0.05 ? E.steel.lens.creep : E.steel.lens.plain
    if (lw !== lensWordShown) {
      lensWordShown = lw
      lensWord.text = lw
      lensWord.sync()
    }
  }
  updates.push(poseSteel)
  const steelState = () => ({ hours: S.hours, heat: Math.round(S.heat), where: S.where, T0: r1(S.T0), age: r1(S.age), hard: S.hard, from: S.from, cooled: S.cooled, filed: S.filed, magnet: S.magnet, m: S.m, q: S.q, f: S.f, bars: S.bars })
  const steelSet = (s, liveSet, ago = 0) => {
    const was = { m: S.m, q: S.q, f: S.f, magnet: S.magnet, where: S.where, filed: S.filed }
    S.hours = clamp(Math.round((Number(s?.hours) || 0) * 2) / 2, 0, 8)
    S.heat = clamp(Math.round(Number(s?.heat) || 20), 20, 1200)
    S.where = s?.where === 'block' ? 'block' : 'hearth'
    S.T0 = clamp(Number(s?.T0) || 20, 20, 1400)
    S.age = (Number(s?.age) || 0) + Math.min(3600, Number(ago) || 0)
    S.hard = clamp(Number(s?.hard) || 0)
    S.from = clamp(Math.round(Number(s?.from) || 0), 0, 1400)
    S.cooled = ['water', 'air'].includes(s?.cooled) ? s.cooled : ''
    S.filed = s?.filed ? 1 : 0
    S.magnet = s?.magnet ? 1 : 0
    S.m = Math.max(0, Math.round(Number(s?.m) || 0))
    S.q = Math.max(0, Math.round(Number(s?.q) || 0))
    S.f = Math.max(0, Math.round(Number(s?.f) || 0))
    S.bars = clamp(Math.round(Number(s?.bars) || 0), 0, 6)
    steelMine = false
    if (liveSet) {
      if (S.q > was.q) barAnim = { kind: 'quench', t: 0 }
      else if (S.where === 'block' && was.where === 'hearth' && S.cooled === 'air') barAnim = { kind: 'air', t: 0, file: S.f > was.f }
      else if (S.where === 'hearth' && was.where === 'block') barAnim = { kind: 'back', t: 0 }
      else if (S.f > was.f && S.where === 'block') fileAnim = { t: 0, hard: S.hard }
      if (S.m > was.m) {
        if (S.magnet && !was.magnet) magAnim = { kind: 'stick', t: 0 }
        else if (!S.magnet && was.magnet) magAnim = { kind: 'release', t: 0 }
        else if (!S.magnet) magAnim = { kind: 'bounce', t: 0 }
      }
    } else {
      barAnim = null
      fileAnim = null
      magAnim = null
    }
  }

  // ======== a few things of village life round the yard ========
  {
    // a woodpile of split logs for charcoal, and a log to sit on
    const logs = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.1, 1.1, 8), mats.wood, 15)
    let n = 0
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 5 - row; i++) {
        dummy.position.set(-6.6 + i * 0.2 + row * 0.1, 0.1 + row * 0.17, -3.2)
        dummy.rotation.set(Math.PI / 2, 0, 0)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        logs.setMatrixAt(n++, dummy.matrix)
      }
    }
    logs.count = n
    root.add(logs)
    solids.push(box(-6.3, -3.2, 1.2, 1.2))
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.6, 10), mats.wood)
    seat.rotation.z = Math.PI / 2
    seat.position.set(5.6, 0.2, 0.9)
    seat.rotation.y = 0.4
    root.add(seat)
    solids.push(box(5.6, 0.9, 1.5, 0.45, { rot: 0.4 }))
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    spawn: { x: 0, z: 3.2, yaw: 0 },
    hostSpot: { x: 1.7, z: 2.0, yaw: Math.atan2(1.7, -1.2) },
    back: { x: 0, z: 5.8, rot: Math.PI },
    // the easel off the lines the station views back off along on an upright phone
    stand: { x: -1.45, z: 1.85, rot: Math.atan2(1.45, 1.35) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      bloomery: {
        tap: what => furnStep(what), // 'ore', 'coal', 'bellows', 'arch', 'lens'
        air: v => setAir(v), // the panel's slider (0..1)
        skip: s => {
          for (let k = 0; k < s; k += 0.1) simFurnace(0.1)
          snapF()
          share('bloomery')
        },
        get state() { return furnState() },
        get T() { return F.T },
        get bloom() { return bloomNow() },
        oreAt: () => new THREE.Vector3(HEAP.ore.x, 0.25, HEAP.ore.z),
        coalAt: () => new THREE.Vector3(HEAP.coal.x, 0.25, HEAP.coal.z),
        bellowsAt: () => new THREE.Vector3(BELLOWS.x, 0.3, BELLOWS.z),
        archAt: () => archGroup.position.clone().setY(0.18),
        lensAt: () => lens1.face.getWorldPosition(new THREE.Vector3()),
      },
      anvil: {
        tap: what => anvilStep(what), // 'piece' (the bloom or bar), 'pile'; or 'strike', 'reheat', 'next' (the panel)
        hearth: () => anvilStep('reheat'), // a tap on the hearth from the anvil
        get state() { return anvilState() },
        get T() { return pieceT() },
        pieceAt: () => anvilTop.clone().setY(ANVIL.top + 0.06),
        pileAt: () => pileSpot.clone(),
        hearthAt: () => new THREE.Vector3(HEARTH.x, HEARTH.top + 0.1, HEARTH.z),
      },
      steel: {
        tap: what => steelStep(what), // 'soak' (the hearth), 'bellows', 'magnet', 'quench' (the bucket), 'file', 'bar'
        hours: h => setHours(h), // the panel's sliders
        heat: v => setHeat(v),
        get state() { return steelState() },
        get T() { return steelT() },
        get carbon() { return carbon() },
        magnetAt: () => magnet.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, 0)),
        bucketAt: () => new THREE.Vector3(BUCKET.x, BUCKET.h, BUCKET.z),
        fileAt: () => fileGroup.getWorldPosition(new THREE.Vector3()),
        barAt: () => steelBar.position.clone(),
        bellowsAt: () => new THREE.Vector3(HB.x, 0.55, HB.z),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { bloomery: furnPanel, anvil: anvilPanel, steel: steelPanel },
    shared: {
      bloomery: { get: furnState, set: furnSet },
      anvil: { get: anvilState, set: anvilSet },
      steel: { get: steelState, set: steelSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
