// Iron's picture "How do you build a tower of iron?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into the Eiffel Tower's second floor, 115 m above Paris, on a summer evening
// (stages/tower.js: the deck between the two north legs, the riveted parapet, the lattice rising round and
// overhead, Paris below). The picture's three things are three stations; each step is chosen by tapping
// its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next
// tap, E opens the station's panel, whose buttons and sliders do the same:
// - the rivet gang (left, the picture's lens): tap the forge to pump the bellows (the rivet goes grey, red,
//   orange, yellow), the glowing rivet to toss it to the catcher's cone, the plates to push it into the
//   hole (the holder's dolly comes up under it), the hammer three times to form the new head; then it
//   cools: the gauge and the lens show it shrinking, the gap between the plates closing and the squeeze
//   growing, the iron atoms in the lens jiggling less and sitting closer. A slider sets its temperature
//   (warm it again and the squeeze lets go);
// - the model in the sun (in front, the picture's tower and its loop): a 1:100 model on a plinth in the
//   room's own sun. The time slider moves the sun over Paris on 21 June (the whole room's light and the
//   lattice's shadows with it); the face in the sun glows warmer and the model bends away from the sun, 200
//   times more than to scale, its top drawing its loop in the air; the board draws the real top's loop (about
//   15 cm across) from above. Tap the model to run a whole day; the thermometer (or a slider) warms or cools
//   all the iron: about 3.6 mm per degree for 300 m;
// - the painters (right): three pots of the tower's yellow-brown, dark, middle and light; tap a pot, then a
//   part of the model (bottom, middle, top). A screen shows the model seen from its foot against the sky:
//   graded dark to light it looks one even colour, all one shade the top looks darker. A bare girder end
//   by the leg shows rust.
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes; parts.at.<thing>() a point to aim a real
// tap at (with parts.rayTo).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill } from '../../../wings/noble/kit.js'
import { towerStage, towerParts, panelGeometry, halfWidth, legWidth, sunAt, rivetHeads } from '../../stages/tower.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { TOWER_WORDS } from './tower.words.js'

export const WORDS = TOWER_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
const now = () => performance.now() / 1000

// ---- iron's numbers ----
const ALPHA = 12e-6 // linear expansion, per kelvin (about 11.8e-6 for pure iron at 25 °C)
const IRON_M = 300 // metres of iron from the ground to the top's roof
const REF_T = 15 // °C: the model's height is drawn against this
const EXAG = 200 // the models bend (and grow) 200 times more than to scale
const SCALE = 0.01 // the sun model: 1:100

// ---- the rivet ----
const RIVET_L = 0.13 // m, the whole rivet
const GRIP = 0.08 // m, the two plates it holds
const GAP0 = 0.00025 // m, the play left between the plates when the head is formed (closes as it cools)
const ROOM_T = 20
const COOL_TAU = 6 // s: the room's cooling clock (a real rivet takes minutes)
const T_READY = 850
const T_MAX = 1150

/** A glowing iron's colour and glow at a temperature (°C): none below about 480 °C, then dark red,
 *  cherry, orange, yellow. */
function heatGlow(T, out = new THREE.Color()) {
  const k = clamp((T - 480) / 700)
  if (k <= 0) return { color: out.setRGB(0, 0, 0), k: 0 }
  const stops = [
    [0, [0.35, 0.03, 0.0]],
    [0.35, [1.0, 0.12, 0.0]],
    [0.65, [1.0, 0.42, 0.05]],
    [1, [1.0, 0.82, 0.38]],
  ]
  let i = 1
  while (i < stops.length - 1 && k > stops[i][0]) i++
  const [k0, c0] = stops[i - 1]
  const [k1, c1] = stops[i]
  const f = clamp((k - k0) / (k1 - k0))
  out.setRGB(lerp(c0[0], c1[0], f), lerp(c0[1], c1[1], f), lerp(c0[2], c1[2], f))
  return { color: out, k }
}
const cssGlow = T => {
  if (T < 480) return `rgb(${Math.round(lerp(110, 140, clamp(T / 480)))},${Math.round(lerp(112, 120, clamp(T / 480)))},${Math.round(lerp(118, 112, clamp(T / 480)))})`
  const { color } = heatGlow(T)
  return `rgb(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)})`
}

// ---- the paint: the tower's yellow-brown in three shades, and how they look from the foot ----
// (CIE lightness about 34, 47 and 61: the real three tones are closer; these read apart on a small model)
const SHADES = ['#654b2a', '#8a6a3c', '#ae8d55']
const PRIMER = '#6d6763'
const BAND_KEYS = ['bottom', 'middle', 'top']
// from the foot, the upper parts are seen against the bright sky: they read darker (in CIE lightness). How
// much is the room's model (chosen so the graded shades come out even), not a measurement
const BACKLIT = [0, 13.1, 26.6]
const lin = c => new THREE.Color(c)
const lum = c => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
const lstar = Y => (Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y)
const yOf = L => (L > 8 ? Math.pow((L + 16) / 116, 3) : L / 903.3)
/** The colour a band of paint looks from the foot (its lightness lowered by the sky behind it). */
function seenFromFoot(hex, band) {
  const c = lin(hex)
  const Y = lum(c)
  const L = lstar(Y) - BACKLIT[band]
  return c.multiplyScalar(yOf(L) / Math.max(1e-4, Y))
}
const perceived = (hex, band) => lstar(lum(seenFromFoot(hex, band)))

// ---- the sun model: how far the real top leans (m) at an hour, the loop scaled to 15 cm across ----
// the face in the sun warms in proportion to the sunlight falling on it (more with height, less on a
// vertical face at a high sun); the top leans away from the sun by the difference
function rawLean(h, out) {
  const d = sunAt(h)
  const e = Math.asin(clamp(d.y, -1, 1))
  const k = e <= 0 ? 0 : Math.cos(e) * (1 - Math.exp(-8 * Math.sin(e)))
  const l = Math.hypot(d.x, d.z) || 1
  return out.set((-d.x / l) * k, 0, (-d.z / l) * k)
}
const LOOP = (() => {
  const pts = []
  for (let h = 4.5; h <= 23.0001; h += 0.1) pts.push(rawLean(h, new THREE.Vector3()))
  let D = 0
  for (const a of pts) for (const b of pts) D = Math.max(D, a.distanceTo(b))
  return { k: 0.15 / D }
})()
const leanAt = (h, out = new THREE.Vector3()) => rawLean(h, out).multiplyScalar(LOOP.k)
const DAY = { from: 5.6, to: 22.4, secs: 18 }

/** A board with a canvas face on a post, facing +z. */
function canvasBoard({ w, h, px, post = 1.1, frame = '#2b2f45', glow = '#ffc83d', tilt = 0 }) {
  const ph = Math.round((px * h) / w)
  const tex = canvasTex(px, ph, null)
  const group = new THREE.Group()
  const edge = new THREE.Mesh(new RoundedBoxGeometry(w + 0.08, h + 0.08, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: glow, emissive: glow, emissiveIntensity: 0.45, roughness: 0.4 }))
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: '#d8d8d8' }))
  face.position.z = 0.03
  // the board leans back about its lower edge (a lectern) by `tilt`
  const panel = new THREE.Group()
  panel.position.y = -h / 2
  panel.rotation.x = -tilt
  edge.position.y = h / 2
  face.position.y = h / 2
  panel.add(edge, face)
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, post, 8), new THREE.MeshStandardMaterial({ color: frame, roughness: 0.5, metalness: 0.4 }))
  leg.position.set(0, -h / 2 - post / 2, -0.03)
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.04, 20), leg.material)
  foot.position.set(0, -h / 2 - post, -0.03)
  group.add(panel, leg, foot)
  const canvas = tex.image
  return { group, tex, canvas, g: canvas.getContext('2d'), W: px, H: ph, face }
}

// ======================================================================================================

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = towerStage({ light, hour: 20.25 })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const tmpC = new THREE.Color()
  const tmpV = new THREE.Vector3()
  const wood = new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.8 })
  const iron = new THREE.MeshStandardMaterial({ color: '#4d4a47', roughness: 0.5, metalness: 0.55 })
  const steel = new THREE.MeshStandardMaterial({ color: '#8d9096', roughness: 0.35, metalness: 0.8 })
  const leather = new THREE.MeshStandardMaterial({ color: '#5b3a24', roughness: 0.9 })
  disposers.push(() => [wood, iron, steel, leather, ghost].forEach(m => m.dispose()))
  const font = () => 'Outfit'
  const faceTowards = (obj, x, z) => (obj.rotation.y = Math.atan2(x - obj.position.x, z - obj.position.z))

  // ======== 1. the rivet gang ========
  // (what is read, the lens and the gauge, on the left: a panel opens on the right)
  const F = { x: -3.3, z: -2.95 } // the forge
  const CN = { x: -4.05, z: -2.5, top: 1.3 } // the catcher's cone
  const J = { x: -5.0, z: -2.95, y: 1.1 } // the joint: the top of the lower plate
  const LENS = { x: -6.6, y: 1.85, z: -3.95, r: 0.42 }
  const GAUGE = { x: -6.3, z: -2.9 }
  const SPOT1 = { x: -5.1, z: -0.85 }
  const T_PLATE = 0.04

  // the forge: an iron pan of coals on three legs, the bellows beside it
  const forge = new THREE.Group()
  forge.position.set(F.x, 0, F.z)
  root.add(forge)
  const coalMat = new THREE.MeshStandardMaterial({ color: '#2a2320', roughness: 0.9, emissive: '#ff5a14', emissiveIntensity: 0.4 })
  disposers.push(() => coalMat.dispose())
  {
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.16, 24, 1, true), iron)
    pan.material = iron
    pan.position.y = 0.8
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), iron)
    bottom.rotation.x = -Math.PI / 2
    bottom.position.y = 0.72
    forge.add(pan, bottom)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.3
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.8, 6), iron)
      leg.position.set(Math.cos(a) * 0.22, 0.38, Math.sin(a) * 0.22)
      leg.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12)
      forge.add(leg)
    }
    const rnd = random(3)
    const coals = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.05, 0), coalMat, 26)
    const o = new THREE.Object3D()
    for (let i = 0; i < 26; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * 0.27
      o.position.set(Math.cos(a) * r, 0.8 + rnd() * 0.05, Math.sin(a) * r)
      o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
      o.scale.setScalar(0.7 + rnd() * 0.6)
      o.updateMatrix()
      coals.setMatrixAt(i, o.matrix)
    }
    forge.add(coals)
  }
  // the bellows: two boards and a leather bag, its nozzle at the pan
  const bellows = new THREE.Group()
  bellows.position.set(0.62, 0.62, 0.05)
  bellows.rotation.y = Math.PI - 0.15
  forge.add(bellows)
  const bellowsTop = new THREE.Group()
  {
    const low = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.3), wood)
    bellows.add(low)
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.3), wood)
    top.position.x = -0.25
    bellowsTop.add(top)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 6), wood)
    handle.rotation.z = Math.PI / 2
    handle.position.set(-0.58, 0, 0)
    bellowsTop.add(handle)
    bellowsTop.position.set(0.25, 0.12, 0)
    bellows.add(bellowsTop)
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.3, 8), iron)
    nozzle.rotation.z = Math.PI / 2
    nozzle.position.set(0.38, 0.03, 0)
    bellows.add(nozzle)
  }
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1, 0.26), leather)
  bellows.add(bag)
  const forgeLight = new THREE.PointLight('#ff7a2a', 0.6, 4.5, 2)
  forgeLight.position.set(F.x - 0.1, 1.35, F.z + 0.3)
  root.add(forgeLight)
  // hit shapes below the coals and round the bellows: the rivet lying on the coals is a tap of its own
  const forgeHit = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.72, 12), ghost)
  forgeHit.position.set(0, 0.36, 0)
  const bellowsHit = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.4, 0.42), ghost)
  bellowsHit.position.set(0.62, 0.66, 0.05)
  forge.add(forgeHit, bellowsHit)
  solids.push(circle(F.x + 0.2, F.z, 0.6))

  // the catcher's cone: a can on a pole
  const cone = new THREE.Group()
  cone.position.set(CN.x, 0, CN.z)
  root.add(cone)
  {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.05, 0.26, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#5e5a54', roughness: 0.6, metalness: 0.6, side: THREE.DoubleSide }))
    can.position.y = CN.top - 0.13
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, CN.top - 0.26, 6), wood)
    pole.position.y = (CN.top - 0.26) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.04, 16), iron)
    foot.position.y = 0.02
    cone.add(can, pole, foot)
    disposers.push(() => can.material.dispose())
  }
  const coneHit = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.5, 10), ghost)
  coneHit.position.y = CN.top - 0.15
  cone.add(coneHit)
  solids.push(circle(CN.x, CN.z, 0.2))

  // the joint: two riveted plates on a trestle, one hole still empty
  const joint = new THREE.Group()
  joint.position.set(J.x, 0, J.z)
  root.add(joint)
  const plateMat = new THREE.MeshStandardMaterial({ color: '#7d6a52', roughness: 0.55, metalness: 0.45 })
  disposers.push(() => plateMat.dispose())
  {
    for (const x of [-0.42, 0.42]) {
      for (const z of [-0.2, 0.2]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, J.y - 0.04, 0.06), wood)
        leg.position.set(x, (J.y - 0.04) / 2, z)
        leg.rotation.x = z > 0 ? -0.08 : 0.08
        joint.add(leg)
      }
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.5), wood)
      beam.position.set(x, J.y - T_PLATE - 0.03, 0)
      joint.add(beam)
    }
    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.0, T_PLATE, 0.34), plateMat)
    lower.position.set(0, J.y - T_PLATE / 2, 0)
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.62, T_PLATE, 0.34), plateMat)
    upper.position.set(0.12, J.y + T_PLATE / 2, 0)
    joint.add(lower, upper)
    // the rivets already set in the joint
    const spots = []
    for (const x of [0.26, 0.4]) for (const z of [-0.1, 0.1]) spots.push({ p: new THREE.Vector3(x, J.y + T_PLATE, z), n: new THREE.Vector3(0, 1, 0) })
    spots.push({ p: new THREE.Vector3(-0.12, J.y + T_PLATE, 0.1), n: new THREE.Vector3(0, 1, 0) })
    const set = rivetHeads(spots, plateMat, 0.034)
    joint.add(set)
  }
  // our hole is at the joint's own (0, 0): the rivet stands there
  solids.push(box(J.x, J.z, 1.1, 0.55))
  const plates = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.4), ghost)
  plates.position.set(0, J.y, 0)
  joint.add(plates)

  // the rivet: a shank, the factory head below, the tail that becomes the new head
  const rivetMat = new THREE.MeshStandardMaterial({ color: '#4c4946', roughness: 0.45, metalness: 0.6, emissive: '#000000' })
  disposers.push(() => rivetMat.dispose())
  const rivet = new THREE.Group()
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, RIVET_L, 12), rivetMat)
  shank.position.y = RIVET_L / 2
  const factoryHead = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 8, 0, TAU, Math.PI / 2, Math.PI / 2), rivetMat)
  factoryHead.scale.y = 0.65
  const newHead = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 8, 0, TAU, 0, Math.PI / 2), rivetMat)
  newHead.scale.set(0.5, 0.01, 0.5)
  rivet.add(shank, factoryHead, newHead)
  root.add(rivet)
  // a bigger, invisible shape to tap the rivet by (it is small)
  const rivetHit = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), ghost)
  rivetHit.position.y = 0.05
  rivet.add(rivetHit)
  // a soft glow round it while it is hot, so a rivet a few centimetres long reads from the station
  const glowTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  textures.push(glowTex)
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#ff8a30', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  aura.scale.setScalar(0.3)
  aura.position.y = 0.06
  aura.raycast = () => {}
  rivet.add(aura)
  disposers.push(() => aura.material.dispose())
  // where it lies in the forge, sits in the cone, stands in the joint (its foot: the factory head)
  const POS = {
    forge: new THREE.Vector3(F.x + 0.06, 0.88, F.z + 0.02),
    cone: new THREE.Vector3(CN.x, CN.top - 0.2, CN.z),
    below: new THREE.Vector3(J.x, J.y - 0.42, J.z),
    set: new THREE.Vector3(J.x, J.y - T_PLATE, J.z),
  }

  // the holder's dolly bar under the joint, the riveter's hammer over it
  const dolly = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.5, 10), steel)
  root.add(dolly)
  const hammer = new THREE.Group()
  hammer.position.set(J.x + 0.62, J.y + T_PLATE + 0.06 + 0.1, J.z + 0.02)
  root.add(hammer)
  {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.66, 8), wood)
    handle.rotation.z = Math.PI / 2
    handle.position.x = -0.3
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), steel)
    head.position.set(-0.62, 0, 0)
    hammer.add(handle, head)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.2), ghost)
    hit.position.x = -0.35
    hammer.add(hit)
  }
  const HAMMER_UP = -0.95
  hammer.rotation.z = HAMMER_UP
  // sparks from each blow
  const SPARKS = 28
  const sparkPos = new Float32Array(SPARKS * 3)
  const sparkVel = new Float32Array(SPARKS * 3)
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  const sparkMat = new THREE.PointsMaterial({ color: new THREE.Color('#ffb347').multiplyScalar(2), size: 0.025, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  sparks.frustumCulled = false
  sparks.raycast = () => {}
  root.add(sparks)
  disposers.push(() => {
    sparkGeo.dispose()
    sparkMat.dispose()
  })
  let sparkT = 9

  // the gauge board: temperature, length, the gap and the squeeze
  // the gauge: a lectern in front, low, so it does not hide the lens behind it
  const gauge = canvasBoard({ w: 1.0, h: 0.75, px: 512, post: 0.62, tilt: 0.55 })
  gauge.group.position.set(GAUGE.x, 0.62 + 0.375 + 0.04, GAUGE.z)
  faceTowards(gauge.group, SPOT1.x, SPOT1.z)
  root.add(gauge.group)
  textures.push(gauge.tex)
  solids.push(circle(GAUGE.x, GAUGE.z, 0.3))

  // the lens (the picture's): the joint cut open, and the iron's atoms
  const lensTex = canvasTex(512, 512, null)
  textures.push(lensTex)
  const lens = new THREE.Group()
  lens.position.set(LENS.x, 0, LENS.z)
  root.add(lens)
  {
    const face = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false, color: '#dcdcdc' }))
    face.position.y = LENS.y
    const rim = new THREE.Mesh(new THREE.TorusGeometry(LENS.r + 0.02, 0.03, 10, 48), new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffc83d', emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.6 }))
    rim.position.y = LENS.y
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, LENS.y - LENS.r, 8), iron)
    post.position.y = (LENS.y - LENS.r) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.04, 18), iron)
    foot.position.y = 0.02
    lens.add(face, rim, post, foot)
    disposers.push(() => {
      face.material.dispose()
      rim.material.dispose()
    })
  }
  faceTowards(lens, SPOT1.x, SPOT1.z)
  solids.push(circle(LENS.x, LENS.z, 0.25))

  // ---- the rivet's state (shared) ----
  // phase: 'forge' | 'flight' | 'cone' | 'insert' | 'set' | 'cooling' | 'cold'
  // done: this rivet has gone cold once and been counted (warming it again does not count another)
  const RS = { phase: 'forge', T: ROOM_T, blows: 0, formedT: 0, n: 0, puffs: 0, done: false }
  let move = null // { kind: 'flight' | 'insert', t }
  let swing = -1 // the hammer's swing, seconds (-1 none)
  let puffT = 9 // the bellows' squeeze, seconds since
  let fire = 0.3 // the coals' glow
  let rivetMine = false
  // the temperature as it is shared: T0 at the moment t0 (wall clock), cooling from there (held while it
  // lies in the forge; the slider holds it a moment before it cools again). The same on every screen.
  let T0 = ROOM_T
  let t0 = now()
  const mark = (hold = 0) => {
    T0 = RS.T
    t0 = now() + hold
  }
  const tempNow = () => {
    if (RS.phase === 'forge') return T0
    const age = now() - t0
    return age <= 0 ? T0 : ROOM_T + (T0 - ROOM_T) * Math.exp(-age / (formedHead() ? COOL_TAU : 40))
  }
  let lastSaid = ''
  const FLIGHT = 0.95
  const INSERT = 1.0
  const formedHead = () => RS.phase === 'cooling' || RS.phase === 'cold'
  /** How far the shank has shortened since the head was formed (m), the gap left and the squeeze (0..1). */
  function clampOf() {
    if (!formedHead()) return { gap: GAP0, squeeze: 0 }
    const shrink = GRIP * ALPHA * (RS.formedT - RS.T)
    const gap = Math.max(0, GAP0 - shrink)
    const full = GRIP * ALPHA * (RS.formedT - ROOM_T) - GAP0
    return { gap, squeeze: clamp((shrink - GAP0) / Math.max(1e-6, full)) }
  }
  const rivetPanel = lv => ({
    title: E.rivet.title,
    color,
    blocks: [
      {
        slider: {
          label: E.rivet.slider,
          min: ROOM_T,
          max: T_MAX,
          step: 10,
          value: Math.round(RS.T),
          onInput: v => slideRivet(v),
          format: v => `${nf(v)} °C`,
          live: () => Math.round(RS.T / 10) * 10,
        },
      },
      { buttons: ['heat', 'toss', 'push', 'hammer', 'fresh'].map(k => ({ label: E.rivet.buttons[k], onClick: () => rivetStep(k === 'fresh' ? 'forge' : k === 'heat' ? 'forge' : k) })) },
      ...paras(E.rivet.panel, lv),
    ],
  })
  const tellR = key => {
    if (!rivetMine) return
    const t = at(E.rivet.says[key], level())
    if (t && t !== lastSaid) say(t)
    lastSaid = t
  }
  function startFlight() {
    move = { kind: 'flight', t: 0 }
    play('select')
  }
  function startInsert() {
    move = { kind: 'insert', t: 0 }
    play('tap')
  }
  function startBlow() {
    swing = 0
  }
  function newRivet() {
    Object.assign(RS, { phase: 'forge', T: ROOM_T, blows: 0, formedT: 0, done: false })
    move = null
    mark()
  }
  /** A step: 'forge' (the bellows, or a new rivet), 'toss' (the rivet), 'push' (the plates), 'hammer'. */
  function rivetStep(step) {
    const lv = level()
    rivetMine = true
    lastSaid = ''
    if (move) return say(at(E.rivet.says.busy, lv))
    if (step === 'forge') {
      if (RS.phase === 'cooling' || RS.phase === 'cold') {
        newRivet()
        RS.puffs++
        puffT = 0
        RS.T = 300
        mark()
        play('tap')
        say(at(E.rivet.says.puff, lv))
      } else if (RS.phase === 'forge') {
        RS.puffs++
        puffT = 0
        play('tap')
        const was = RS.T
        RS.T = Math.min(T_MAX, Math.max(RS.T, 250) + 230)
        mark()
        if (was >= T_MAX - 1) say(at(E.rivet.says.hottest, lv))
        else if (RS.T >= T_READY) say(at(E.rivet.says.ready, lv))
        else if (RS.T >= 600) say(at(E.rivet.says.red, lv))
        else say(at(E.rivet.says.puff, lv))
      } else return say(at(E.rivet.says.busy, lv))
    } else if (step === 'toss') {
      if (RS.phase !== 'forge') return say(at(RS.phase === 'cone' ? E.rivet.says.busy : E.rivet.says.notYet, lv))
      if (RS.T < T_READY) return say(at(E.rivet.says.tooCold, lv))
      RS.phase = 'flight'
      mark()
      startFlight()
      say(at(E.rivet.says.toss, lv))
    } else if (step === 'push') {
      if (RS.phase !== 'cone') return say(at(E.rivet.says.notYet, lv))
      RS.phase = 'insert'
      startInsert()
      say(at(E.rivet.says.push, lv))
    } else if (step === 'hammer') {
      if (RS.phase !== 'set') return say(at(RS.phase === 'cooling' || RS.phase === 'cold' ? E.rivet.says.busy : E.rivet.says.notYet, lv))
      if (RS.T < 650) return say(at(E.rivet.says.tooCold, lv))
      RS.blows = Math.min(3, RS.blows + 1)
      startBlow()
      if (RS.blows >= 3) {
        RS.phase = 'cooling'
        RS.formedT = RS.T
        mark()
        later(0.4, () => tellR('head'))
        ex.discover('rivet', rivetPanel, 4.5)
      } else say(at(E.rivet.says.blow, lv))
    } else return
    share('rivet')
  }
  // the slider: the rivet's temperature by hand (it cools again by itself a moment after)
  let rivetSend = false
  function slideRivet(v) {
    if (move) return
    const was = RS.T
    RS.T = clamp(Math.round(v), ROOM_T, T_MAX)
    mark(1.6)
    rivetMine = true
    if (formedHead() && RS.T > was + 60 && RS.T > 200) {
      RS.phase = 'cooling'
      tellR('warm')
    }
    if (rivetSend) return
    rivetSend = true
    later(0.25, () => {
      rivetSend = false
      share('rivet')
    })
  }
  ex.add({
    id: 'rivet',
    x: SPOT1.x,
    z: SPOT1.z,
    radius: 2.0,
    manual: true,
    label: E.rivet.label,
    verb: () => {
      const h = E.rivet.hints
      if (move) return h.watch
      if (RS.phase === 'forge') return RS.T >= T_READY ? h.toss : h.heat
      if (RS.phase === 'cone') return h.push
      if (RS.phase === 'set') return h.hammer
      if (RS.phase === 'cooling') return h.cool
      return h.again
    },
    focus: focusOf(-5.0, 1.3, -3.05, 3.0, 3.8),
    act: () => ctx.showPanel(rivetPanel),
  })
  clickable(forge, () => rivetStep('forge'), { reach: 6 })
  // the rivet lying in the coals: a tap heats it until it glows enough, then tosses it
  clickable(rivet, () => rivetStep(RS.phase === 'forge' ? (RS.T >= T_READY ? 'toss' : 'forge') : RS.phase === 'cone' ? 'push' : 'hammer'), { reach: 6, when: () => RS.phase !== 'cold' && RS.phase !== 'cooling' })
  clickable(cone, () => rivetStep('push'), { reach: 6 })
  clickable(plates, () => rivetStep(RS.phase === 'set' ? 'hammer' : 'push'), { reach: 6 })
  clickable(hammer, () => rivetStep('hammer'), { reach: 6 })

  // ---- the gauge's and the lens's drawings ----
  let gaugeKey = ''
  function drawGauge() {
    const { g, W: GW, H: GH } = gauge
    const { gap, squeeze } = clampOf()
    const dL = RIVET_L * ALPHA * (RS.T - ROOM_T)
    const key = `${Math.round(RS.T / 5)}|${Math.round(gap * 1e6 / 5)}|${Math.round(squeeze * 50)}|${RS.n}|${RS.phase}|${lang}`
    if (key === gaugeKey) return
    gaugeKey = key
    const G = E.rivet.gauge
    g.fillStyle = '#0e1630'
    g.fillRect(0, 0, GW, GH)
    g.strokeStyle = 'rgba(255,200,61,0.6)'
    g.lineWidth = 4
    g.strokeRect(6, 6, GW - 12, GH - 12)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    g.fillStyle = '#ffc83d'
    g.font = `700 30px ${font()}`
    g.fillText(G.title, 24, 34, 240)
    g.textAlign = 'right'
    g.fillStyle = '#c9d2ff'
    g.font = `500 22px ${font()}`
    g.fillText(fill(G.done, { n: nf(RS.n) }), GW - 24, 34)
    // the temperature on a glowing bar
    g.textAlign = 'left'
    g.fillStyle = '#c9d2ff'
    g.font = `500 22px ${font()}`
    g.fillText(G.temp, 24, 80)
    const bx = 24
    const bw = GW - 48
    const grd = g.createLinearGradient(bx, 0, bx + bw, 0)
    for (let i = 0; i <= 10; i++) grd.addColorStop(i / 10, cssGlow(ROOM_T + (i / 10) * (T_MAX - ROOM_T)))
    g.fillStyle = grd
    g.fillRect(bx, 98, bw, 26)
    const tx = bx + (bw * (RS.T - ROOM_T)) / (T_MAX - ROOM_T)
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.moveTo(tx, 96)
    g.lineTo(tx - 9, 84)
    g.lineTo(tx + 9, 84)
    g.fill()
    g.textAlign = 'right'
    g.font = `700 30px ${font()}`
    g.fillText(`${nf(Math.round(RS.T))} °C`, GW - 24, 74)
    // its length
    g.textAlign = 'left'
    g.fillStyle = '#c9d2ff'
    g.font = `500 22px ${font()}`
    g.fillText(G.length, 24, 160)
    g.textAlign = 'right'
    g.fillStyle = '#ffffff'
    g.font = `700 28px ${font()}`
    g.fillText(`+${nf(dL * 1000, 2)} mm`, GW - 24, 160)
    // the gap and the squeeze, once the rivet is in the plates
    if (RS.phase !== 'set' && !formedHead()) {
      gauge.tex.needsUpdate = true
      return
    }
    g.textAlign = 'left'
    g.fillStyle = '#c9d2ff'
    g.font = `500 22px ${font()}`
    g.fillText(G.gap, 24, 206)
    g.textAlign = 'right'
    g.fillStyle = gap > 1e-6 ? '#ffffff' : '#7fe08a'
    g.font = `700 28px ${font()}`
    g.fillText(gap > 1e-6 ? `${nf(gap * 1000, 2)} mm` : G.none, GW - 24, 206)
    // the gap drawn big: two plates and the space between them
    const px = 24
    const pw = 180
    const gy = 240
    // (0.25 mm drawn as 13 px, about 25 mm on the board: about 100 times bigger)
    const gp = (gap / GAP0) * 13
    g.fillStyle = '#8c8f96'
    g.fillRect(px, gy, pw, 22)
    g.fillRect(px, gy + 22 + gp, pw, 22)
    g.fillStyle = cssGlow(RS.T)
    g.fillRect(px + pw / 2 - 10, gy - 8, 20, 22 * 2 + gp + 16)
    g.fillStyle = 'rgba(201,210,255,0.8)'
    g.font = `500 17px ${font()}`
    g.textAlign = 'left'
    g.fillText(G.bigger, px + pw + 16, gy + 24, GW - px - pw - 36)
    // the squeeze
    g.fillStyle = '#c9d2ff'
    g.font = `500 22px ${font()}`
    g.fillText(G.squeeze, 24, 340)
    g.fillStyle = 'rgba(255,255,255,0.12)'
    g.fillRect(170, 328, GW - 194, 26)
    g.fillStyle = '#7fe08a'
    g.fillRect(170, 328, (GW - 194) * squeeze, 26)
    gauge.tex.needsUpdate = true
  }
  // the lens: the joint cut open (heads, shank, plates, the gap drawn big, the clamping arrows), and in
  // its lower corner a few iron atoms jiggling with the heat
  let lensT = 0
  function drawLens(t) {
    const g = lensTex.image.getContext('2d')
    const S = 512
    const { gap, squeeze } = clampOf()
    g.fillStyle = '#16203d'
    g.fillRect(0, 0, S, S)
    const cx = 250
    const top = 150
    const plateH = 62
    const gp = (gap / GAP0) * 16
    const inJoint = RS.phase === 'set' || formedHead() || (move?.kind === 'insert' && move.t > INSERT * 0.6)
    // the plates, cut through: a hole in each
    g.fillStyle = '#9a9ca3'
    g.fillRect(40, top, 420, plateH)
    g.fillRect(40, top + plateH + gp, 420, plateH)
    g.fillStyle = '#16203d'
    g.fillRect(cx - 34, top, 68, plateH * 2 + gp)
    if (inJoint) {
      // the rivet: shank, the factory head below, the new head above (as formed as the blows went)
      const glow = cssGlow(RS.T)
      const extra = (RIVET_L * ALPHA * (RS.T - ROOM_T)) * 4000
      const formed = formedHead() ? 1 : RS.blows / 3
      g.fillStyle = glow
      const y0 = top - 6 - (1 - formed) * 52 - extra * 0.5
      const y1 = top + plateH * 2 + gp + 4
      g.fillRect(cx - 30 - formed * 3, y0, 60 + formed * 6, y1 - y0)
      g.beginPath()
      g.ellipse(cx, y1, 62, 34, 0, 0, Math.PI)
      g.fill()
      g.beginPath()
      g.ellipse(cx, top, 30 + formed * 32, 6 + formed * 30, 0, Math.PI, TAU)
      g.fill()
      // the clamping arrows, growing with the squeeze
      if (squeeze > 0.02) {
        g.strokeStyle = 'rgba(255,255,255,0.95)'
        g.fillStyle = 'rgba(255,255,255,0.95)'
        g.lineWidth = 7
        const L = 18 + squeeze * 46
        for (const x of [cx - 120, cx + 120]) {
          for (const [ya, dir] of [[top - 40 - L, 1], [top + plateH * 2 + gp + 40 + L, -1]]) {
            g.beginPath()
            g.moveTo(x, ya)
            g.lineTo(x, ya + dir * L)
            g.stroke()
            g.beginPath()
            g.moveTo(x - 14, ya + dir * L)
            g.lineTo(x + 14, ya + dir * L)
            g.lineTo(x, ya + dir * (L + 18))
            g.fill()
          }
        }
      }
    }
    // the atoms: a little grid, jiggling more and further apart the hotter it is
    // (inside the lens's round face: the canvas's corners are cut off)
    const ax = 270
    const ay = 325
    g.save()
    g.beginPath()
    g.arc(ax + 70, ay + 70, 80, 0, TAU)
    g.fillStyle = '#0b1128'
    g.fill()
    g.strokeStyle = '#ffc83d'
    g.lineWidth = 4
    g.stroke()
    g.clip()
    const T = RS.T
    const spread = 1 + (T - ROOM_T) * 0.00022
    const amp = 2 + Math.sqrt(Math.max(0, T)) * 0.42
    const rnd = random(11)
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const ph = rnd() * 50
        const x = ax + 70 + i * 34 * spread + Math.sin(t * 13 + ph) * amp
        const y = ay + 70 + j * 34 * spread + Math.cos(t * 11.3 + ph * 1.3) * amp
        g.beginPath()
        g.arc(x, y, 12, 0, TAU)
        g.fillStyle = T > 480 ? cssGlow(T) : '#e06633'
        g.fill()
      }
    }
    g.restore()
    g.fillStyle = '#c9d2ff'
    g.font = `600 22px ${font()}`
    g.textAlign = 'right'
    g.textBaseline = 'middle'
    g.fillText(E.rivet.lens.atoms, ax - 22, ay + 42, 190)
    g.font = `500 18px ${font()}`
    const words = (T > 500 ? E.rivet.lens.hot : E.rivet.lens.cold).split(', ')
    words.forEach((w, i) => g.fillText(w, ax - 22, ay + 72 + i * 24, 190))
    lensTex.needsUpdate = true
  }

  updates.push((dt, t) => {
    // the bellows' squeeze and the fire
    puffT += dt
    const squeezeB = puffT < 0.5 ? Math.sin((puffT / 0.5) * Math.PI) : 0
    bellowsTop.rotation.z = -0.32 + squeezeB * 0.27
    bag.scale.y = 0.16 - squeezeB * 0.1
    bag.position.y = 0.06 - squeezeB * 0.02
    const want = RS.phase === 'forge' ? 0.35 + clamp((RS.T - 300) / 800) * 0.65 : 0.3
    fire = damp(fire, want + squeezeB * 0.6, 3, dt)
    coalMat.emissiveIntensity = 0.3 + fire * 1.6 + Math.sin(t * 7) * 0.05
    forgeLight.intensity = 0.5 + fire * 2.4
    // the rivet's temperature: held in the forge, cooling elsewhere
    if (RS.phase !== 'forge') {
      RS.T = tempNow()
      if (RS.phase === 'cooling' && RS.T < 60) {
        RS.phase = 'cold'
        if (!RS.done) {
          RS.done = true
          RS.n++
          tellR('cold')
          if (rivetMine) play('discover')
        }
      }
    }
    // its look
    const { color: gc, k } = heatGlow(RS.T, tmpC)
    rivetMat.emissive.copy(gc)
    rivetMat.emissiveIntensity = 0.4 + k * 2.6
    aura.material.color.copy(gc)
    aura.material.opacity = Math.min(0.85, k * 1.3)
    aura.visible = k > 0.01
    // where it is
    if (move) {
      move.t += dt
      if (move.kind === 'flight') {
        const f = clamp(move.t / FLIGHT)
        rivet.position.lerpVectors(POS.forge, POS.cone, f)
        rivet.position.y += Math.sin(Math.PI * f) * 0.75
        rivet.rotation.set(f * 9, 0, f * 4)
        if (move.t >= FLIGHT) {
          move = null
          RS.phase = 'cone'
          play('pop')
        }
      } else {
        const f = clamp(move.t / INSERT)
        if (f < 0.55) {
          const k1 = ease(f / 0.55)
          rivet.position.lerpVectors(POS.cone, POS.below, k1)
          rivet.position.y += Math.sin(Math.PI * k1) * 0.25
        } else rivet.position.lerpVectors(POS.below, POS.set, ease((f - 0.55) / 0.45))
        rivet.rotation.set(0, 0, 0)
        if (move.t >= INSERT) {
          move = null
          RS.phase = 'set'
        }
      }
    } else if (RS.phase === 'forge') {
      rivet.position.copy(POS.forge)
      rivet.rotation.set(0, 0.4, Math.PI / 2)
    } else if (RS.phase === 'cone') {
      rivet.position.copy(POS.cone)
      rivet.rotation.set(0.25, 0, 0.2)
    } else {
      rivet.position.copy(POS.set)
      rivet.rotation.set(0, 0, 0)
    }
    // the new head: a tail sticking up, squashed into a dome by the blows
    const formed = formedHead() ? 1 : RS.phase === 'set' ? RS.blows / 3 : 0
    const tail = 1 - formed
    shank.scale.y = 1 + (ALPHA * (RS.T - ROOM_T)) * 1 - formed * 0.35
    shank.position.y = (RIVET_L * shank.scale.y) / 2
    newHead.position.y = RIVET_L * shank.scale.y - 0.002
    newHead.scale.set(0.5 + formed * 0.55, 0.01 + formed * 0.6 + tail * 0.01, 0.5 + formed * 0.55)
    // the dolly comes up while the rivet is in the joint
    const dollyUp = RS.phase === 'set' || RS.phase === 'cooling' || (move?.kind === 'insert' && move.t > INSERT * 0.5) ? 1 : 0
    dolly.position.set(J.x, J.y - T_PLATE - 0.27, J.z)
    dolly.visible = dollyUp > 0
    // the hammer's swing
    if (swing >= 0) {
      swing += dt
      const s = swing / 0.34
      hammer.rotation.z = s < 0.45 ? lerp(HAMMER_UP, 0.02, ease(s / 0.45)) : lerp(0.02, HAMMER_UP, ease((s - 0.45) / 0.55))
      if (s >= 0.45 && sparkT > 0.5) {
        sparkT = 0
        play('crack')
        const rr = random(Math.floor(t * 1000))
        for (let i = 0; i < SPARKS; i++) {
          sparkPos.set([J.x, J.y + T_PLATE + 0.03, J.z], i * 3)
          const a = rr() * TAU
          const v = 0.8 + rr() * 1.8
          sparkVel.set([Math.cos(a) * v, 0.8 + rr() * 2.2, Math.sin(a) * v], i * 3)
        }
      }
      if (s >= 1) {
        swing = -1
        hammer.rotation.z = HAMMER_UP
      }
    }
    sparkT += dt
    if (sparkT < 0.7) {
      for (let i = 0; i < SPARKS; i++) {
        sparkVel[i * 3 + 1] -= 9.8 * dt
        sparkPos[i * 3] += sparkVel[i * 3] * dt
        sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt
        sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt
      }
      sparkGeo.attributes.position.needsUpdate = true
    }
    sparkMat.opacity = sparkT < 0.7 ? 1 - sparkT / 0.7 : 0
    // the drawings (the lens about 15 times a second)
    drawGauge()
    lensT -= dt
    if (lensT <= 0) {
      lensT = 1 / 15
      drawLens(t)
    }
  })

  // ======== 2. the model in the sun ========
  const M = { x: 0.0, z: -5.65, plinth: 0.42 }
  const BOARD = { x: -2.35, z: -5.05 }
  const THERMO = { x: 1.75, z: -5.0 }
  const SPOT2 = { x: 0, z: -2.25 }
  const latticeSmall = canvasTex(64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#ffffff'
    g.strokeStyle = '#ffffff'
    g.fillRect(0, 0, 8, h)
    g.fillRect(w - 8, 0, 8, h)
    g.fillRect(0, h - 5, w, 5)
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(0, 0)
    g.lineTo(w, h)
    g.moveTo(w, 0)
    g.lineTo(0, h)
    g.stroke()
  }, { repeat: true })
  textures.push(latticeSmall)
  const parts = towerParts({})
  const H_TOP = 300 // the bending grows with the square of the height, 1 at the top's roof
  /** A model of the tower at scale s: lattice meshes and solid pieces grouped by `key(panel or piece)`. */
  function towerModel(s, key, matFor) {
    const group = new THREE.Group()
    const meshes = []
    const keys = [...new Set([...parts.panels.map(p => key(p.h0, p.dir)), ...parts.solids.map(p => key(p.h, null))])]
    for (const k of keys) {
      const lat = panelGeometry(parts.panels, p => key(p.h0, p.dir) === k, s)
      if (lat.attributes.position.count) {
        const m = new THREE.Mesh(lat, matFor(k, true))
        m.castShadow = true
        m.userData.key = k
        group.add(m)
        meshes.push(m)
      }
      const pieces = parts.solids.filter(p => key(p.h, null) === k).map(p => p.geo.clone().scale(s, s, s))
      for (const geo of pieces) {
        const m = new THREE.Mesh(geo, matFor(k, false))
        m.castShadow = true
        m.userData.key = k
        group.add(m)
        meshes.push(m)
      }
    }
    // the second floor's deck (the stage builds the real one)
    const o = halfWidth(115) * s
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2 * o, 0.6 * s * 3, 2 * o), matFor(key(115, null), false))
    deck.position.y = 115 * s
    deck.userData.key = key(115, null)
    group.add(deck)
    meshes.push(deck)
    for (const m of meshes) m.geometry.userData.base = m.geometry.attributes.position.array.slice()
    for (const m of meshes) if (m === deck) m.geometry.userData.base = null
    /** Bend the model: the top moved by (dx, dz) model metres, and taller by `grow` (a share). */
    function deform(dx, dz, grow) {
      const top = H_TOP * s
      for (const m of meshes) {
        if (m === deck) {
          const f = Math.pow(115 / H_TOP, 2)
          m.position.set(dx * f, 115 * s * (1 + grow), dz * f)
          continue
        }
        const base = m.geometry.userData.base
        const pos = m.geometry.attributes.position.array
        for (let i = 0; i < pos.length; i += 3) {
          const y = base[i + 1]
          const f = (y / top) * (y / top)
          pos[i] = base[i] + dx * f
          pos[i + 1] = y * (1 + grow)
          pos[i + 2] = base[i + 2] + dz * f
        }
        m.geometry.attributes.position.needsUpdate = true
        m.geometry.computeBoundingSphere()
      }
    }
    disposers.push(() => meshes.forEach(m => m.geometry.dispose()))
    return { group, meshes, deform }
  }
  // the sun model: its four sides apart, so the side in the sun can glow warmer
  const sideMats = {}
  const modelSolid = new THREE.MeshStandardMaterial({ color: '#94703e', roughness: 0.6, metalness: 0.35, emissive: '#ff7a2a', emissiveIntensity: 0 })
  disposers.push(() => modelSolid.dispose())
  const sunModel = towerModel(SCALE, (h, dir) => dir ?? 'solid', (k, isLattice) => {
    if (!isLattice) return modelSolid
    sideMats[k] ??= new THREE.MeshStandardMaterial({ map: latticeSmall, color: '#a27a44', roughness: 0.6, metalness: 0.35, alphaTest: 0.45, side: THREE.DoubleSide, emissive: '#ff6a1a', emissiveIntensity: 0 })
    return sideMats[k]
  })
  disposers.push(() => Object.values(sideMats).forEach(m => m.dispose()))
  const model = new THREE.Group()
  model.position.set(M.x, M.plinth, M.z)
  model.add(sunModel.group)
  root.add(model)
  // the plinth
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.75, M.plinth, 1.75, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#4a4f63', roughness: 0.6, metalness: 0.2 }))
    plinth.position.set(M.x, M.plinth / 2, M.z)
    plinth.receiveShadow = true
    root.add(plinth)
    disposers.push(() => plinth.material.dispose())
    solids.push(box(M.x, M.z, 1.85, 1.85))
  }
  const modelHit = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.85, 3.1, 4), ghost)
  modelHit.rotation.y = Math.PI / 4
  modelHit.position.y = 1.55
  model.add(modelHit)
  // the top's trail: where it has been today (gold), and the whole day's loop (faint)
  const TRAIL = 240
  const trailPos = new Float32Array(TRAIL * 3)
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
  trailGeo.setDrawRange(0, 0)
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: new THREE.Color('#ffd166').multiplyScalar(2.2), transparent: true, opacity: 0.95 }))
  trail.frustumCulled = false
  trail.raycast = () => {}
  model.add(trail)
  // beads along it, so the loop reads from across the deck (a line is one pixel wide)
  const BEADS = 72
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd166').multiplyScalar(1.8) }), BEADS)
  beads.count = 0
  beads.frustumCulled = false
  beads.raycast = () => {}
  model.add(beads)
  disposers.push(() => {
    beads.geometry.dispose()
    beads.material.dispose()
  })
  const beadO = new THREE.Object3D()
  const loopPts = []
  for (let h = DAY.from; h <= DAY.to + 1e-6; h += (DAY.to - DAY.from) / 120) {
    const l = leanAt(h)
    loopPts.push(new THREE.Vector3(l.x * SCALE * EXAG, H_TOP * SCALE + 0.02, l.z * SCALE * EXAG))
  }
  const loopLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(loopPts), new THREE.LineDashedMaterial({ color: '#fff3d0', dashSize: 0.03, gapSize: 0.025, transparent: true, opacity: 0.55 }))
  loopLine.computeLineDistances()
  loopLine.frustumCulled = false
  loopLine.raycast = () => {}
  model.add(loopLine)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd166').multiplyScalar(2) }))
  tip.raycast = () => {}
  model.add(tip)
  disposers.push(() => {
    trailGeo.dispose()
    trail.material.dispose()
    loopLine.geometry.dispose()
    loopLine.material.dispose()
    tip.geometry.dispose()
    tip.material.dispose()
  })
  // the thermometer: a tall glass tube on a post, its red column the iron's temperature
  const thermo = new THREE.Group()
  thermo.position.set(THERMO.x, 0, THERMO.z)
  root.add(thermo)
  const TH = { y0: 0.5, y1: 1.75, tmin: -10, tmax: 45 }
  const colMat = new THREE.MeshStandardMaterial({ color: '#e0321f', emissive: '#c0200f', emissiveIntensity: 0.6, roughness: 0.4 })
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 10), colMat)
  {
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.26, TH.y1 - TH.y0 + 0.3, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#e9e2d0', roughness: 0.7 }))
    back.position.set(0, (TH.y0 + TH.y1) / 2, -0.04)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, TH.y1 - TH.y0, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.3 }))
    tube.position.y = (TH.y0 + TH.y1) / 2
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), colMat)
    bulb.position.y = TH.y0 - 0.03
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, TH.y0 - 0.15, 8), iron)
    post.position.y = (TH.y0 - 0.15) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.04, 16), iron)
    foot.position.y = 0.02
    thermo.add(back, tube, bulb, post, foot, column)
    // ticks every 10 degrees, numbers at 0, 15 and 40
    for (let T = -10; T <= 40; T += 10) {
      const y = lerp(TH.y0, TH.y1, (T - TH.tmin) / (TH.tmax - TH.tmin))
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.01), iron)
      tick.position.set(-0.07, y, -0.01)
      thermo.add(tick)
    }
    for (const T of [0, 15, 40]) {
      const y = lerp(TH.y0, TH.y1, (T - TH.tmin) / (TH.tmax - TH.tmin))
      const label = makeText(`${T}°`, { size: 0.05, color: '#3a3026', anchorX: 'left' })
      label.position.set(0.05, y, -0.01)
      thermo.add(label)
    }
    disposers.push(() => {
      back.material.dispose()
      tube.material.dispose()
      colMat.dispose()
    })
  }
  const thermoHit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.3), ghost)
  thermoHit.position.y = 1.0
  thermo.add(thermoHit)
  faceTowards(thermo, SPOT2.x, SPOT2.z)
  solids.push(circle(THERMO.x, THERMO.z, 0.22))
  // the board: the real top's loop seen from above, the time, the change in height
  const sunBoard = canvasBoard({ w: 1.1, h: 1.3, px: 512, post: 0.75 })
  sunBoard.group.position.set(BOARD.x, 0.75 + 0.65 + 0.04, BOARD.z)
  faceTowards(sunBoard.group, SPOT2.x, SPOT2.z)
  root.add(sunBoard.group)
  textures.push(sunBoard.tex)
  solids.push(circle(BOARD.x, BOARD.z, 0.3))

  // ---- the sun's state (shared): the hour, the iron's temperature, a day running ----
  const SS = { hour: 20.25, temp: REF_T, run: null } // run: { from, start (wall clock) }
  let sunMine = false
  let shownHour = -1
  let lastPhase = ''
  const lean = new THREE.Vector3()
  const sunNow = new THREE.Vector3()
  const hhmm = h => {
    const m = Math.round(h * 60)
    return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  }
  const sunPanel = lv => ({
    title: E.sun.title,
    color,
    blocks: [
      {
        slider: {
          label: E.sun.time,
          min: DAY.from,
          max: DAY.to,
          step: 0.05,
          value: SS.hour,
          onInput: v => setHour(v),
          format: v => hhmm(v),
          live: () => SS.hour,
        },
      },
      {
        slider: {
          label: E.sun.temp,
          min: TH.tmin,
          max: TH.tmax,
          step: 1,
          value: SS.temp,
          onInput: v => setTemp(v),
          format: v => `${nf(v)} °C`,
          live: () => SS.temp,
        },
      },
      { buttons: ['day', 'cold', 'mild', 'hot'].map(k => ({ label: E.sun.buttons[k], onClick: () => sunStep(k) })) },
      ...paras(E.sun.panel, lv),
    ],
  })
  let sunSend = false
  const sendSun = () => {
    if (sunSend) return
    sunSend = true
    later(0.25, () => {
      sunSend = false
      share('sun')
    })
  }
  function setHour(v) {
    SS.hour = clamp(v, DAY.from, DAY.to)
    SS.run = null
    sunMine = true
    ex.discover('sun', sunPanel, 2.5)
    sendSun()
  }
  function setTemp(v) {
    SS.temp = clamp(Math.round(v), TH.tmin, TH.tmax)
    sunMine = true
    ex.discover('sun', sunPanel, 2.5)
    sendSun()
  }
  /** A step: 'day' (the model), 'cold' | 'mild' | 'hot' (the panel), 'thermo' (the thermometer: the next). */
  function sunStep(step) {
    const lv = level()
    sunMine = true
    if (step === 'day') {
      if (SS.run) return say(at(E.sun.says.busy, lv))
      SS.run = { from: DAY.from, start: now() }
      SS.hour = DAY.from
      lastPhase = ''
      play('select')
      say(at(E.sun.says.day, lv))
      ex.discover('sun', sunPanel, DAY.secs + 1.5)
    } else {
      const next = step === 'thermo' ? (SS.temp < 7 ? 'mild' : SS.temp < 27 ? 'hot' : 'cold') : step
      SS.temp = { cold: 0, mild: REF_T, hot: 40 }[next]
      play(next === 'hot' ? 'select' : 'tap')
      say(at(E.sun.says[next], lv))
      ex.discover('sun', sunPanel, 2.5)
    }
    share('sun')
  }
  ex.add({
    id: 'sun',
    x: SPOT2.x,
    z: SPOT2.z,
    radius: 2.0,
    manual: true,
    label: E.sun.label,
    verb: () => {
      const h = E.sun.hints
      if (SS.run) return h.watch
      if (!ex.list.find(i => i.id === 'sun')?.found) return h.day
      return Math.abs(SS.temp - REF_T) < 1 ? h.temp : h.day
    },
    focus: focusOf(-0.55, 1.95, -5.3, 3.9, 5.2),
    act: () => ctx.showPanel(sunPanel),
  })
  clickable(model, () => sunStep('day'), { reach: 7 })
  clickable(thermo, () => sunStep('thermo'), { reach: 6 })

  function drawSunBoard(lv) {
    const { g, W: BW, H: BH } = sunBoard
    const B = E.sun.board
    g.fillStyle = '#0e1630'
    g.fillRect(0, 0, BW, BH)
    g.strokeStyle = 'rgba(255,200,61,0.6)'
    g.lineWidth = 4
    g.strokeRect(6, 6, BW - 12, BH - 12)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    g.fillStyle = '#ffc83d'
    g.font = `700 30px ${font()}`
    g.fillText(B.title, 24, 38, BW - 190)
    g.textAlign = 'right'
    g.fillStyle = '#ffffff'
    g.font = `700 40px ${font()}`
    g.fillText(hhmm(SS.hour), BW - 24, 40)
    // the loop from above: north up (away from the reader, as in the room)
    const cx = BW / 2
    const cy = 250
    const R = 150
    const k = R / 0.12 // pixels per metre of the real top's movement
    g.strokeStyle = 'rgba(201,210,255,0.25)'
    g.lineWidth = 2
    g.beginPath()
    g.arc(cx, cy, R, 0, TAU)
    g.stroke()
    g.beginPath()
    g.moveTo(cx - R, cy)
    g.lineTo(cx + R, cy)
    g.moveTo(cx, cy - R)
    g.lineTo(cx, cy + R)
    g.stroke()
    g.fillStyle = '#c9d2ff'
    g.font = `700 24px ${font()}`
    g.textAlign = 'center'
    g.fillText(B.north, cx, cy - R - 18)
    // the whole day's loop, faint, and today so far, gold
    const P = h => {
      const l = leanAt(h, tmpV)
      return [cx + l.x * k, cy + l.z * k]
    }
    g.setLineDash([8, 7])
    g.strokeStyle = 'rgba(255,243,208,0.45)'
    g.lineWidth = 3
    g.beginPath()
    for (let h = DAY.from; h <= DAY.to; h += 0.1) {
      const [x, y] = P(h)
      h === DAY.from ? g.moveTo(x, y) : g.lineTo(x, y)
    }
    g.stroke()
    g.setLineDash([])
    g.strokeStyle = '#ffd166'
    g.lineWidth = 6
    g.beginPath()
    for (let h = DAY.from; h <= SS.hour + 1e-6; h += 0.05) {
      const [x, y] = P(Math.min(h, SS.hour))
      h === DAY.from ? g.moveTo(x, y) : g.lineTo(x, y)
    }
    g.stroke()
    const [tx, ty] = P(SS.hour)
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.arc(tx, ty, 9, 0, TAU)
    g.fill()
    // the sun's direction on the rim
    sunAt(SS.hour, sunNow)
    if (sunNow.y > -0.02) {
      const l = Math.hypot(sunNow.x, sunNow.z) || 1
      const sx = cx + (sunNow.x / l) * (R + 2)
      const sy = cy + (sunNow.z / l) * (R + 2)
      g.fillStyle = '#ffcf4a'
      g.beginPath()
      g.arc(sx, sy, 16, 0, TAU)
      g.fill()
      g.strokeStyle = '#ffcf4a'
      g.lineWidth = 3
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU
        g.beginPath()
        g.moveTo(sx + Math.cos(a) * 21, sy + Math.sin(a) * 21)
        g.lineTo(sx + Math.cos(a) * 28, sy + Math.sin(a) * 28)
        g.stroke()
      }
    }
    // a 5 cm scale bar
    g.strokeStyle = '#c9d2ff'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(BW - 36 - 0.05 * k, cy + R)
    g.lineTo(BW - 36, cy + R)
    g.stroke()
    g.fillStyle = '#c9d2ff'
    g.font = `500 20px ${font()}`
    g.textAlign = 'right'
    g.fillText(`${nf(5)} cm`, BW - 36, cy + R - 18)
    // the words
    const d = leanAt(SS.hour, tmpV).length()
    g.textAlign = 'left'
    g.fillStyle = '#ffffff'
    g.font = `700 25px ${font()}`
    g.fillText(d < 0.003 ? B.straight : fill(B.moved, { d: `${nf(d * 100, 1)} cm` }), 24, 440, BW - 48)
    g.fillStyle = '#c9d2ff'
    g.font = `500 21px ${font()}`
    g.fillText(B.loop, 24, 470, BW - 48)
    const dT = SS.temp - REF_T
    const dL = IRON_M * ALPHA * dT
    g.fillStyle = '#ffffff'
    g.font = `700 24px ${font()}`
    const tline = Math.abs(dT) < 0.5 ? B.same : fill(dT > 0 ? B.taller : B.shorter, { t: `${nf(SS.temp)} °C`, d: `${nf(Math.abs(dL) * 100, 1)} cm` })
    g.fillText(tline, 24, 506, BW - 48)
    if (lv === 'scientist') {
      g.fillStyle = '#c9d2ff'
      g.font = `500 19px ${font()}`
      g.fillText(`ΔL = 300 m × 12 µm/(m·K) × ${nf(dT)} K`, 24, 536, BW - 48)
    }
    g.fillStyle = 'rgba(201,210,255,0.75)'
    g.font = `500 18px ${font()}`
    g.fillText(B.exag, 24, BH - 22, BW - 48)
    sunBoard.tex.needsUpdate = true
  }

  let boardKey = ''
  let deformKey = ''
  updates.push(() => {
    const lv = level()
    // a day running: the hour from the wall clock (the same on every screen)
    if (SS.run) {
      const h = SS.run.from + ((now() - SS.run.start) / DAY.secs) * (DAY.to - DAY.from)
      SS.hour = Math.min(DAY.to, h)
      if (h >= DAY.to) {
        SS.run = null
        if (sunMine) say(at(E.sun.says.dayEnd, lv))
      }
    }
    if (Math.abs(SS.hour - shownHour) > 1e-4) {
      shownHour = SS.hour
      stage.setTime(SS.hour)
      // a word at nightfall when the visitor moved the sun there by hand
      const phase = stage.sunDir.y < -0.01 ? 'night' : 'day'
      if (phase !== lastPhase && lastPhase && sunMine && !SS.run && phase === 'night') say(at(E.sun.says.night, lv))
      lastPhase = phase
    }
    // the model: leaning away from the sun, taller or shorter with the iron's temperature
    leanAt(SS.hour, lean)
    const grow = ALPHA * (SS.temp - REF_T) * EXAG
    const dKey = `${lean.x.toFixed(5)}|${lean.z.toFixed(5)}|${grow.toFixed(5)}`
    if (dKey !== deformKey) {
      deformKey = dKey
      sunModel.deform(lean.x * SCALE * EXAG, lean.z * SCALE * EXAG, grow)
    }
    const topY = H_TOP * SCALE * (1 + grow)
    tip.position.set(lean.x * SCALE * EXAG, topY + 0.02, lean.z * SCALE * EXAG)
    loopLine.position.y = topY - H_TOP * SCALE
    // the trail of today so far
    let n = 0
    const stepH = (DAY.to - DAY.from) / (TRAIL - 1)
    for (let h = DAY.from; h <= SS.hour + 1e-6 && n < TRAIL; h += stepH, n++) {
      const l = leanAt(h, tmpV)
      trailPos.set([l.x * SCALE * EXAG, topY + 0.02, l.z * SCALE * EXAG], n * 3)
    }
    trailGeo.setDrawRange(0, n)
    trailGeo.attributes.position.needsUpdate = true
    let b = 0
    for (let k = 0; k < BEADS; k++) {
      const h = DAY.from + (k / (BEADS - 1)) * (DAY.to - DAY.from)
      if (h > SS.hour + 1e-6) break
      const l = leanAt(h, tmpV)
      beadO.position.set(l.x * SCALE * EXAG, topY + 0.02, l.z * SCALE * EXAG)
      beadO.updateMatrix()
      beads.setMatrixAt(b++, beadO.matrix)
    }
    beads.count = b
    beads.instanceMatrix.needsUpdate = true
    // the side in the sun glows warmer
    sunAt(SS.hour, sunNow)
    const e = Math.max(0, sunNow.y)
    const heat = e <= 0 ? 0 : Math.cos(Math.asin(e)) * (1 - Math.exp(-8 * e))
    const l = Math.hypot(sunNow.x, sunNow.z) || 1
    for (const [dir, v] of Object.entries({ n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] })) {
      const m = sideMats[dir]
      if (m) m.emissiveIntensity = 0.55 * heat * Math.max(0, (v[0] * sunNow.x + v[1] * sunNow.z) / l)
    }
    // the thermometer's column
    const f = clamp((SS.temp - TH.tmin) / (TH.tmax - TH.tmin))
    const len = Math.max(0.01, (TH.y1 - TH.y0) * f)
    column.scale.y = len
    column.position.y = TH.y0 + len / 2
    const key = `${Math.round(SS.hour * 20)}|${SS.temp}|${lv}|${lang}`
    if (key !== boardKey) {
      boardKey = key
      drawSunBoard(lv)
    }
  })

  // ======== 3. the painters ========
  const PM = { x: 6.1, z: -4.45, plinth: 0.32, s: 0.0075 }
  const POTS = { x: 7.2, z: -3.15 }
  const VIEW = { x: 4.7, z: -4.55 }
  const RUST = { x: 10.62, y: 1.32, z: -3.05 }
  const SPOT3 = { x: 5.7, z: -1.25 }
  // the bands: the bottom up to and with the first floor, the middle to and with the second, the top above
  // (lattice panels by the height they start at, solid pieces by the height they stand at)
  const bandOf = (h, dir) => (dir ? (h < 57 ? 0 : h < 115 ? 1 : 2) : h <= 57 ? 0 : h <= 115 ? 1 : 2)
  const bandMats = [0, 1, 2].map(() => ({
    lattice: new THREE.MeshStandardMaterial({ map: latticeSmall, color: PRIMER, roughness: 0.7, metalness: 0.2, alphaTest: 0.45, side: THREE.DoubleSide }),
    solid: new THREE.MeshStandardMaterial({ color: PRIMER, roughness: 0.7, metalness: 0.2 }),
  }))
  disposers.push(() => bandMats.forEach(b => (b.lattice.dispose(), b.solid.dispose())))
  const paintModel = towerModel(PM.s, bandOf, (k, isLattice) => (isLattice ? bandMats[k].lattice : bandMats[k].solid))
  const pModel = new THREE.Group()
  pModel.position.set(PM.x, PM.plinth, PM.z)
  pModel.rotation.y = 0.25
  pModel.add(paintModel.group)
  root.add(pModel)
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.3, PM.plinth, 1.3, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#4a4f63', roughness: 0.6, metalness: 0.2 }))
    plinth.position.set(PM.x, PM.plinth / 2, PM.z)
    plinth.rotation.y = 0.25
    root.add(plinth)
    disposers.push(() => plinth.material.dispose())
    solids.push(box(PM.x, PM.z, 1.4, 1.4, { rot: 0.25 }))
  }
  // a hit shape for each band (the lattice is mostly air)
  const bandHits = [
    [0, 57, 62, 34],
    [57, 115, 34, 19],
    [115, 300, 19, 3],
  ].map(([h0, h1, w0, w1], i) => {
    const s = PM.s
    const m = new THREE.Mesh(new THREE.CylinderGeometry(w1 * s * Math.SQRT2, w0 * s * Math.SQRT2, (h1 - h0) * s, 4), ghost)
    m.rotation.y = Math.PI / 4
    m.position.y = ((h0 + h1) / 2) * s
    m.userData.band = i
    pModel.add(m)
    return m
  })
  // the pots on a crate, and the brush
  const crate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.5), wood)
  crate.position.set(POTS.x, 0.25, POTS.z)
  crate.rotation.y = -0.35
  root.add(crate)
  solids.push(box(POTS.x, POTS.z, 1.05, 0.55, { rot: -0.35 }))
  const potMat = new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.4, metalness: 0.7 })
  disposers.push(() => potMat.dispose())
  const pots = SHADES.map((hex, i) => {
    const g = new THREE.Group()
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 20), potMat)
    can.position.y = 0.11
    const paint = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), new THREE.MeshStandardMaterial({ color: hex, roughness: 0.25 }))
    paint.rotation.x = -Math.PI / 2
    paint.position.y = 0.205
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.122, 0.08, 20, 1, true), paint.material)
    band.position.y = 0.11
    const label = makeText(E.paint.pots[['dark', 'mid', 'light'][i]], { size: 0.075, color: '#ffffff', anchorY: 'bottom' })
    label.position.set(0, 0.36, 0)
    g.add(can, paint, band, label)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.5, 10), ghost)
    hit.position.y = 0.22
    g.add(hit)
    const off = (i - 1) * 0.31
    g.position.set(POTS.x + Math.cos(-0.35) * off, 0.5, POTS.z - Math.sin(-0.35) * off)
    root.add(g)
    disposers.push(() => paint.material.dispose())
    return { group: g, label }
  })
  const brush = new THREE.Group()
  const bristleMat = new THREE.MeshStandardMaterial({ color: PRIMER, roughness: 0.8 })
  disposers.push(() => bristleMat.dispose())
  {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.32, 8), wood)
    handle.position.y = 0.2
    const ferrule = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.04), steel)
    ferrule.position.y = 0.04
    const bristles = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.035), bristleMat)
    bristles.position.y = -0.03
    brush.add(handle, ferrule, bristles)
  }
  brush.raycast = () => {}
  root.add(brush)
  const BRUSH_REST = new THREE.Vector3(POTS.x - 0.62, 0.62, POTS.z + 0.15)
  // the view from the foot
  const view = canvasBoard({ w: 0.95, h: 1.25, px: 400, post: 0.72 })
  view.group.position.set(VIEW.x, 0.72 + 0.625 + 0.04, VIEW.z)
  faceTowards(view.group, SPOT3.x, SPOT3.z)
  root.add(view.group)
  textures.push(view.tex)
  solids.push(circle(VIEW.x, VIEW.z, 0.3))
  // a girder end the painters have not reached: bare iron, rusting
  const rustTex = canvasTex(128, 128, (g, w) => {
    g.fillStyle = '#5a3a26'
    g.fillRect(0, 0, w, w)
    const r = random(9)
    for (let i = 0; i < 220; i++) {
      g.fillStyle = r() < 0.5 ? `rgba(176,84,34,${0.4 + r() * 0.5})` : `rgba(120,60,30,${0.4 + r() * 0.4})`
      g.beginPath()
      g.arc(r() * w, r() * w, 2 + r() * 9, 0, TAU)
      g.fill()
    }
  })
  textures.push(rustTex)
  const rustMat = new THREE.MeshStandardMaterial({ map: rustTex, roughness: 0.95 })
  disposers.push(() => rustMat.dispose())
  const rustEnd = new THREE.Group()
  {
    // an I-section: two flanges and a web, sticking out of the leg's corner chord
    const web = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.02), rustMat)
    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.02, 0.14), rustMat)
    f1.position.y = 0.11
    const f2 = f1.clone()
    f2.position.y = -0.11
    rustEnd.add(web, f1, f2)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.4), ghost)
    rustEnd.add(hit)
  }
  rustEnd.position.set(RUST.x, RUST.y, RUST.z)
  root.add(rustEnd)

  // ---- the paint's state (shared): each band's shade (-1 primer), the pot, the count ----
  const PS = { bands: [-1, -1, -1], pot: -1, n: 0, last: -1 }
  let painting = null // { band, t, from: Color }
  let paintMine = false
  let rustSeen = false
  const shown = [0, 1, 2].map(() => new THREE.Color(PRIMER))
  const verdict = () => {
    if (PS.bands.some(b => b < 0)) return PS.bands.every(b => b < 0) ? 'bare' : 'part'
    const L = PS.bands.map((b, i) => perceived(SHADES[b], i))
    const spread = Math.max(...L) - Math.min(...L)
    if (spread < 3) return 'even'
    if (L[2] <= Math.min(L[0], L[1]) + 0.5) return 'topDark'
    return 'uneven'
  }
  const paintPanel = lv => ({
    title: E.paint.title,
    color,
    blocks: [
      { buttons: ['dark', 'mid', 'light', 'bottom', 'middle', 'top', 'strip'].map(k => ({ label: E.paint.buttons[k], onClick: () => paintStep(k) })) },
      ...paras(E.paint.panel, lv),
    ],
  })
  function startPainting(band) {
    painting = { band, t: 0 }
    play('fizz', { order: 0.4 })
  }
  /** A step: a pot ('dark' | 'mid' | 'light'), a band ('bottom' | 'middle' | 'top'), 'rust', 'strip'. */
  function paintStep(step) {
    const lv = level()
    paintMine = true
    const P = E.paint.says
    const potI = ['dark', 'mid', 'light'].indexOf(step)
    const bandI = BAND_KEYS.indexOf(step)
    if (potI >= 0) {
      PS.pot = potI
      play('tap')
      say(fill(at(P.pot, lv), { shade: E.paint.pots[step] }))
    } else if (bandI >= 0) {
      if (painting) return say(at(P.busy, lv))
      if (PS.pot < 0) return say(at(P.noPot, lv))
      PS.bands = PS.bands.map((b, i) => (i === bandI ? PS.pot : b))
      PS.n++
      PS.last = bandI
      startPainting(bandI)
      ex.discover('paint', paintPanel, 3.5)
      const v = verdict()
      if (v === 'even' || v === 'topDark' || v === 'uneven') later(1.3, () => paintMine && say(at(P[v], level())))
      else say(fill(at(P.painted, lv), { band: E.paint.bands[step] }))
    } else if (step === 'strip') {
      if (painting) return say(at(P.busy, lv))
      PS.bands = [-1, -1, -1]
      PS.n++
      PS.last = -1
      play('tap')
      say(at(P.strip, lv))
    } else if (step === 'rust') {
      rustSeen = true
      play('tap')
      say(at(P.rust, lv))
      ex.discover('paint', paintPanel, 3.5)
      return
    } else return
    share('paint')
  }
  ex.add({
    id: 'paint',
    x: SPOT3.x,
    z: SPOT3.z,
    radius: 2.0,
    manual: true,
    label: E.paint.label,
    verb: () => {
      const h = E.paint.hints
      if (PS.pot < 0) return h.pot
      if (PS.bands.every(b => b >= 0) && verdict() === 'even' && !rustSeen) return h.rust
      return h.band
    },
    focus: focusOf(5.9, 1.15, -4.0, 2.8, 4.4),
    act: () => ctx.showPanel(paintPanel),
  })
  pots.forEach((p, i) => clickable(p.group, () => paintStep(['dark', 'mid', 'light'][i]), { reach: 6 }))
  clickable(pModel, hit => {
    let o = hit.object
    while (o && o.userData.band == null && o !== pModel) o = o.parent
    const b = o?.userData.band ?? 1
    paintStep(BAND_KEYS[b])
  }, { reach: 6, accept: h => h.object.userData.band != null })
  clickable(rustEnd, () => paintStep('rust'), { reach: 6.5 })

  let viewKey = ''
  function drawView() {
    const { g, W: VW, H: VH } = view
    const V = E.paint.view
    // the sky behind, bright towards the top; trees and houses at the foot
    const sky = g.createLinearGradient(0, 0, 0, VH)
    sky.addColorStop(0, '#f2f6fb')
    sky.addColorStop(0.55, '#cfe0f0')
    sky.addColorStop(1, '#b4c9de')
    g.fillStyle = sky
    g.fillRect(0, 0, VW, VH)
    // the tower's front, as the picture draws it: legs, arch, floors, the shaft (heights in metres)
    const base = VH - 76
    const sc = (base - 58) / 330
    const cx = VW / 2
    const Y = h => base - h * sc
    const colourOf = band => {
      const b = PS.bands[band]
      const c = seenFromFoot(b < 0 ? PRIMER : SHADES[b], band)
      return `rgb(${Math.round(Math.min(1, c.r) ** (1 / 2.2) * 255)},${Math.round(Math.min(1, c.g) ** (1 / 2.2) * 255)},${Math.round(Math.min(1, c.b) ** (1 / 2.2) * 255)})`
    }
    const wAt = h => halfWidth(h) * sc
    const legIn = h => Math.max(0, halfWidth(h) - legWidth(h)) * sc
    const strip = (h0, h1, band) => {
      g.fillStyle = colourOf(band)
      for (let h = h0; h < h1; h += 2) {
        const hb = Math.min(h1, h + 2)
        const o0 = wAt(h)
        const o1 = wAt(hb)
        const i0 = legIn(h)
        const i1 = legIn(hb)
        for (const s of [-1, 1]) {
          g.beginPath()
          g.moveTo(cx + s * o0, Y(h))
          g.lineTo(cx + s * o1, Y(hb))
          g.lineTo(cx + s * i1, Y(hb))
          g.lineTo(cx + s * i0, Y(h))
          g.closePath()
          g.fill()
          g.strokeStyle = g.fillStyle
          g.lineWidth = 1.2
          g.stroke()
        }
      }
    }
    strip(0, 57, 0)
    strip(57, 115, 1)
    strip(115, 300, 2)
    // the floors and the arch
    const floorBand = (h, d, band) => {
      g.fillStyle = colourOf(band)
      g.fillRect(cx - wAt(h) - 3, Y(h), 2 * wAt(h) + 6, d * sc)
    }
    floorBand(57, 6, 0)
    floorBand(115, 4, 1)
    floorBand(276, 3, 2)
    g.strokeStyle = colourOf(0)
    g.lineWidth = 4
    g.beginPath()
    g.ellipse(cx, Y(12), wAt(12) - 14, 27 * sc, 0, Math.PI, TAU)
    g.stroke()
    g.fillStyle = colourOf(2)
    g.fillRect(cx - 4, Y(330), 8, 30 * sc)
    // a lattice of sky through the iron
    g.save()
    g.globalAlpha = 0.1
    g.strokeStyle = '#e8f0f8'
    g.lineWidth = 1.5
    for (let y = 0; y < VH; y += 9) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(VW, y + 9)
      g.moveTo(VW, y)
      g.lineTo(0, y + 9)
      g.stroke()
    }
    g.restore()
    // the trees and roofs of the Champ de Mars at the foot
    g.fillStyle = '#3e5a36'
    for (let x = 0; x < VW; x += 22) {
      g.beginPath()
      g.arc(x + 11, base + 14 + Math.sin(x) * 4, 20, 0, TAU)
      g.fill()
    }
    g.fillStyle = '#5a6340'
    g.fillRect(0, base + 20, VW, VH - base - 20)
    // the words
    g.fillStyle = 'rgba(14,22,48,0.82)'
    g.fillRect(0, 0, VW, 50)
    g.fillStyle = '#ffc83d'
    g.font = `700 21px ${font()}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(V.title, VW / 2, 25, VW - 20)
    const v = verdict()
    const line = v === 'bare' ? V.bare : v === 'part' ? fill(V.part, { n: nf(PS.bands.filter(b => b >= 0).length) }) : V[v]
    g.fillStyle = 'rgba(14,22,48,0.82)'
    g.fillRect(0, VH - 70, VW, 70)
    g.fillStyle = v === 'even' ? '#7fe08a' : '#ffffff'
    g.font = `700 22px ${font()}`
    g.fillText(line, VW / 2, VH - 48, VW - 20)
    g.fillStyle = '#c9d2ff'
    g.font = `500 13px ${font()}`
    g.fillText(V.real, VW / 2, VH - 20, VW - 16)
    view.tex.needsUpdate = true
  }

  updates.push((dt, t) => {
    // the brush: in the chosen pot, or travelling up the band being painted
    bristleMat.color.set(PS.pot >= 0 ? SHADES[PS.pot] : PRIMER)
    if (painting) {
      painting.t += dt
      const f = clamp(painting.t / 1.4)
      const h0 = [0, 57, 115][painting.band]
      const h1 = [57, 115, 300][painting.band]
      const hh = lerp(h0, h1, f)
      tmpV.set(halfWidth(hh) * PM.s + 0.12, (hh * PM.s) + 0.05, halfWidth(hh) * PM.s * 0.2)
      pModel.localToWorld(tmpV)
      brush.position.copy(tmpV)
      brush.rotation.set(0, 0.25, -0.9 + Math.sin(t * 18) * 0.25)
      if (painting.t >= 1.5) painting = null
    } else {
      brush.position.lerp(PS.pot >= 0 ? tmpV.copy(pots[PS.pot].group.position).add(new THREE.Vector3(0, 0.3, 0)) : BRUSH_REST, 1 - Math.exp(-6 * dt))
      brush.rotation.set(0, 0, 0.15)
    }
    // the bands' colours, each easing to its paint
    for (let i = 0; i < 3; i++) {
      const target = tmpC.set(PS.bands[i] < 0 ? PRIMER : SHADES[PS.bands[i]])
      shown[i].lerp(target, painting?.band === i ? 1 - Math.exp(-3 * dt) : 1 - Math.exp(-12 * dt))
      bandMats[i].lattice.color.copy(shown[i])
      bandMats[i].solid.color.copy(shown[i])
    }
    pots.forEach((p, i) => (p.group.position.y = 0.5 + (PS.pot === i ? 0.04 + Math.sin(t * 4) * 0.015 : 0)))
    const key = `${PS.bands.join(',')}|${lang}`
    if (key !== viewKey) {
      viewKey = key
      drawView()
    }
  })

  updates.push((dt, t) => stage.update(t))

  // ---- the probes' helpers ----
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = (obj, local = new THREE.Vector3()) => obj.localToWorld(local.clone())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.8 },
    cameraPitchMax: 0.5,
    spawn: { x: 0, z: 3.4, yaw: 0 },
    hostSpot: { x: -2.0, z: 2.3, yaw: Math.atan2(-2.0, -1.2) },
    back: { x: 0, z: 7.4, rot: Math.PI },
    stand: { x: 3.5, z: 2.3, rot: Math.atan2(-3.5, 1.4) },
    parts: {
      rivet: {
        tap: step => rivetStep(step), // 'forge' | 'toss' | 'push' | 'hammer'
        slide: v => slideRivet(v), // the panel's slider (°C)
        get state() {
          return { ...RS, ...clampOf(), moving: !!move }
        },
      },
      sun: {
        tap: step => sunStep(step), // 'day' (the model), 'thermo', 'cold' | 'mild' | 'hot'
        hour: v => setHour(v),
        temp: v => setTemp(v),
        get state() {
          return { hour: SS.hour, temp: SS.temp, running: !!SS.run, lean: leanAt(SS.hour).length() }
        },
      },
      paint: {
        tap: step => paintStep(step), // 'dark' | 'mid' | 'light', 'bottom' | 'middle' | 'top', 'rust', 'strip'
        get state() {
          return { bands: [...PS.bands], pot: PS.pot, verdict: verdict(), busy: !!painting }
        },
      },
      at: {
        forge: () => world(bellows),
        rivet: () => rivet.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.04, 0)),
        cone: () => new THREE.Vector3(CN.x, CN.top - 0.1, CN.z),
        plates: () => new THREE.Vector3(J.x + 0.3, J.y, J.z),
        hammer: () => world(hammer, new THREE.Vector3(-0.62, 0, 0)),
        model: () => new THREE.Vector3(M.x, M.plinth + 1.0, M.z),
        thermo: () => new THREE.Vector3(THERMO.x, 1.2, THERMO.z),
        pot: i => pots[i].group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)),
        band: i => world(bandHits[i]),
        rust: () => new THREE.Vector3(RUST.x, RUST.y, RUST.z),
      },
      rayTo,
      stage,
    },
    panels: { rivet: rivetPanel, sun: sunPanel, paint: paintPanel },
    shared: {
      rivet: {
        get: () => ({ phase: RS.phase, T0: Math.round(T0), age: Math.round((now() - t0) * 10) / 10, blows: RS.blows, formedT: Math.round(RS.formedT), n: RS.n, puffs: RS.puffs, done: RS.done }),
        set: (s, liveSet, ago = 0) => {
          const phases = ['forge', 'flight', 'cone', 'insert', 'set', 'cooling', 'cold']
          const phase = phases.includes(s?.phase) ? s.phase : 'forge'
          const prev = RS.phase
          const prevBlows = RS.blows
          const prevPuffs = RS.puffs
          T0 = clamp(Number(s?.T0) || ROOM_T, ROOM_T, T_MAX)
          t0 = now() - (Number(s?.age) || 0) - (ago || 0)
          RS.blows = clamp(Math.round(Number(s?.blows) || 0), 0, 3)
          RS.formedT = clamp(Number(s?.formedT) || 0, 0, T_MAX)
          RS.n = Math.max(0, Math.round(Number(s?.n) || 0))
          RS.puffs = Math.max(0, Math.round(Number(s?.puffs) || 0))
          RS.done = !!s?.done
          rivetMine = false
          if (liveSet) {
            if (phase === 'flight' && prev === 'forge') {
              RS.phase = 'flight'
              startFlight()
            } else if (phase === 'insert' && prev === 'cone') {
              RS.phase = 'insert'
              startInsert()
            } else {
              move = null
              RS.phase = phase === 'flight' ? 'cone' : phase === 'insert' ? 'set' : phase
            }
            if (RS.blows > prevBlows) startBlow()
            if (RS.puffs > prevPuffs) puffT = 0
          } else {
            move = null
            RS.phase = phase === 'flight' ? 'cone' : phase === 'insert' ? 'set' : phase
            // it went on cooling while the state was away
            if (RS.phase !== 'forge') {
              RS.T = tempNow()
              if (RS.phase === 'cooling' && RS.T < 60) {
                RS.phase = 'cold'
                if (!RS.done) {
                  RS.done = true
                  RS.n++
                }
              }
            }
          }
          RS.T = tempNow()
          gaugeKey = ''
        },
      },
      sun: {
        get: () => ({ hour: Math.round(SS.hour * 100) / 100, temp: SS.temp, run: SS.run ? { from: SS.run.from, age: now() - SS.run.start } : null }),
        set: (s, liveSet, ago = 0) => {
          SS.hour = clamp(Number(s?.hour) || 20.25, DAY.from, DAY.to)
          const temp = Number(s?.temp)
          SS.temp = Number.isFinite(temp) ? clamp(Math.round(temp), TH.tmin, TH.tmax) : REF_T
          const r = s?.run
          if (r && Number.isFinite(Number(r.age))) {
            const age = Number(r.age) + (ago || 0)
            if (age < DAY.secs) SS.run = { from: clamp(Number(r.from) || DAY.from, DAY.from, DAY.to), start: now() - age }
            else {
              SS.run = null
              SS.hour = DAY.to
            }
          } else SS.run = null
          sunMine = false
        },
      },
      paint: {
        get: () => ({ bands: [...PS.bands], pot: PS.pot, n: PS.n, last: PS.last }),
        set: (s, liveSet) => {
          const bands = (Array.isArray(s?.bands) ? s.bands : [-1, -1, -1]).slice(0, 3).map(b => (Number.isInteger(b) && b >= 0 && b < 3 ? b : -1))
          while (bands.length < 3) bands.push(-1)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const last = Number.isInteger(s?.last) && s.last >= 0 && s.last < 3 ? s.last : -1
          if (liveSet && n === PS.n + 1 && last >= 0 && !painting) startPainting(last)
          if (!liveSet) {
            painting = null
            for (let i = 0; i < 3; i++) shown[i].set(bands[i] < 0 ? PRIMER : SHADES[bands[i]])
          }
          PS.bands = bands
          PS.pot = Number.isInteger(s?.pot) && s.pot >= 0 && s.pot < 3 ? s.pot : -1
          PS.n = n
          PS.last = last
          paintMine = false
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const f of disposers) f()
    },
  }
}
