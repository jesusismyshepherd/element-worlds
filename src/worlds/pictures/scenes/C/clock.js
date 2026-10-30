// Carbon's picture "A clock inside every bone" as a room (docs/knowledge/picture-rooms.md): an archaeologists'
// dig at golden hour (stages/dig.js: the low sun behind the arrival, the sky ahead deepening to navy with
// the first stars, as the picture's sky). The picture's hourglass of glowing atoms stands in front of a tree-
// ring disc with a clock's ticks; a trench steps down through four soil layers; a tent holds the dating lab;
// an oak with a red deer under it stands at the edge of the field. Three things to do, each step chosen by
// tapping its thing (the user, 2026-10-30), E opening the station's panel, whose buttons (and a slider for
// the hourglass's time) do the same:
// - made in the sky: tap the sky (or the signpost's button). A cosmic ray strikes the air where the sky was
//   tapped (14 m out along the tap, so it plays in view; the button and the panel strike west of the oak's
//   crown, in the station's view), a neutron flies to a nitrogen-14 nucleus, which takes it, gives off a
//   proton and is carbon-14; two oxygens join it (carbon dioxide), it drifts down outside the crown into a
//   leaf of the oak's low branch, and the deer reaches up and eats it;
// - dig and date: tap a find in the trench (linen, a wooden bowl, a deer's bone, a hearth's charcoal, one
//   per layer, deeper older; invented examples, as the panel says) and it flies to the tray in the tent;
//   tap the machine (or a find on the tray): it counts the carbon-14 left and gives the age (5730 years a
//   half-life, not calibrated); the clock's curve on the tent's board gathers the dated finds; the tree
//   slice beside the machine shows the rings that calibrate real dates. The shovel starts a new dig;
// - the atom hourglass: 128 carbon-14 atoms; tap the hourglass to let time run (a slider for time in the
//   panel): each decays at its own random moment, an electron flies off and it falls to the bottom as
//   nitrogen-14; the lever gives 128 new atoms, and the count at 5730 years is never exactly 64.
// Not carbon's life wing again: there a dial halves a jar exactly at each wind; here the decays are random
// in continuous time, and the room adds where carbon-14 comes from and how a find is dated.
// All three are shared in a room (src/net/shared.js); the hourglass's decays come from a seed in the shared
// state, so every screen sees the same atoms go. parts.<exhibit>.tap(...) does what a tap does (probes).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, random, screen, fill, num, hdr } from '../../../wings/noble/kit.js'
import { digStage, soilTexture, strataTexture } from '../../stages/dig.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { packBall } from '../../../common/pack.js'
import { buildTree } from '../../../wings/carbon/tree.js'
import { FADE } from '../../../wings/carbon/kit.js'
import { CLOCK_WORDS } from './clock.words.js'

export const WORDS = CLOCK_WORDS

const TAU = Math.PI * 2
const HALF = 5730
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const r1 = v => Math.round(v * 10) / 10
const SKY_C = '#8fb4ff'
const DIG_C = '#e8c07a'
const LAB_C = '#7fe0c4'
const JAR_C = '#3fe6b4'
const TEAL = new THREE.Color('#3fe6b4')
const NITRO = new THREE.Color('#5b86e6')
/** Years written with a space between thousands from 10 000 on (as the picture's story writes them). */
const yrs = n => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n))

// ---- the ground plan ----
const TR = { x0: -6.6, x1: -1.6, z0: -1.9, z1: 0.3 } // the trench, stepping down from west to east
const STEP_W = (TR.x1 - TR.x0) / 4
const DEPTH = k => 0.22 * (k + 1)
const FIND_Z = -0.75
const TENT = { x0: 3.6, x1: 7.2, z0: -0.9, z1: 2.1, eave: 2.1, ridge: 2.75 } // open toward +z
const JAR = { x: 0, z: -5.2 }
const TREE = { x: 6.4, z: -10.2 }
const DEER = { x: 4.4, z: -9.7 }
const POST = { x: 2.0, z: -2.6 } // the signpost, beside the sky's station (clear of the hourglass's board)
const SPOIL = { x: -8.2, z: -0.5 }

// the finds, one per layer, deeper older (invented examples): the share of carbon-14 left, the age it gives
// with 5730 years a half-life (8267 ln(1/f), rounded to tens), a plausible AMS uncertainty
const FINDS = [
  { id: 'linen', f: 0.75, age: 2380, err: 25 },
  { id: 'bowl', f: 0.5, age: 5730, err: 30 },
  { id: 'bone', f: 0.25, age: 11460, err: 45 },
  { id: 'hearth', f: 1 / 64, age: 34380, err: 450 },
]
const DIG_T = 3.2 // a find's trip from the soil to the tray
const DATE_T = 5.0 // into the machine, counted, back on the tray

// ---- small pieces ----

function softDot() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A shiny bead's light (a matcap): every ball in the room shares it, coloured per ball or per instance. */
function beadMatcap() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w * 0.36, w * 0.3, w * 0.03, w * 0.5, w * 0.5, w * 0.52)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.22, '#dcdcdc')
    grd.addColorStop(0.7, '#8c8c8c')
    grd.addColorStop(1, '#3c3c3c')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A tree's cut face: growth rings round the pith, cracks, the bark's edge; `ticks` adds a clock's marks
 *  (the picture's tree-ring clock face). glow(k) draws the rings from the bark inward up to k (0..1) lit,
 *  on a second canvas (the slice's emissive map). */
function ringFace({ seed = 5, ticks = false, size = 512 } = {}) {
  const rnd = random(seed)
  const rings = []
  let r = 0.03
  let k = 0
  while (r < 0.9) {
    rings.push({ r, k1: rnd() * 6, k2: rnd() * 6 })
    r += 0.018 + 0.03 * rnd() * (1 - r * 0.6)
    k++
  }
  const ringPath = (g, c, ring, scale) => {
    g.beginPath()
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * TAU
      const rr = ring.r * (1 + 0.025 * Math.sin(3 * a + ring.k1) + 0.018 * Math.cos(5 * a + ring.k2)) * scale
      const x = c + 6 + rr * Math.cos(a)
      const y = c - 4 + rr * Math.sin(a)
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    }
    g.stroke()
  }
  const map = canvasTex(size, size, (g, w) => {
    const c = w / 2
    const R = c
    g.fillStyle = '#4e301a'
    g.fillRect(0, 0, w, w)
    const grd = g.createRadialGradient(c, c, 0, c, c, R * 0.92)
    grd.addColorStop(0, '#e9c48c')
    grd.addColorStop(0.7, '#d6a465')
    grd.addColorStop(1, '#b97f45')
    g.fillStyle = grd
    g.beginPath()
    g.arc(c, c, R * 0.93, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(150,96,46,0.6)'
    g.lineWidth = w / 220
    for (const ring of rings) ringPath(g, c, ring, R)
    // two drying cracks from the pith
    g.strokeStyle = 'rgba(70,40,20,0.7)'
    g.lineWidth = w / 260
    for (const a0 of [0.7, 3.6]) {
      g.beginPath()
      g.moveTo(c + 6, c - 4)
      let x = c + 6
      let y = c - 4
      for (let i = 0; i < 8; i++) {
        x += Math.cos(a0 + (rnd() - 0.5) * 0.4) * R * 0.05
        y += Math.sin(a0 + (rnd() - 0.5) * 0.4) * R * 0.05
        g.lineTo(x, y)
      }
      g.stroke()
    }
    if (ticks) {
      g.strokeStyle = 'rgba(90,52,24,0.9)'
      g.lineCap = 'round'
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU
        g.lineWidth = i % 3 === 0 ? w / 70 : w / 120
        g.beginPath()
        g.moveTo(c + Math.cos(a) * R * 0.78, c + Math.sin(a) * R * 0.78)
        g.lineTo(c + Math.cos(a) * R * 0.86, c + Math.sin(a) * R * 0.86)
        g.stroke()
      }
    }
  })
  let glowTex = null
  const glow = kGlow => {
    glowTex.userData.redraw((g, w) => {
      const c = w / 2
      g.fillStyle = '#000000'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = '#ffffff'
      g.lineWidth = w / 120
      const n = rings.length
      // the outermost ring (the bark's year, the newest) lights first, then inward to the pith
      for (let i = n - 1; i >= 0; i--) {
        const lit = (n - 1 - i) / n < kGlow
        if (!lit) continue
        g.globalAlpha = 0.35 + 0.65 * Math.max(0, 1 - Math.abs((n - 1 - i) / n - kGlow) * 6)
        ringPath(g, c, rings[i], c)
      }
      g.globalAlpha = 1
    })
  }
  if (!ticks) {
    glowTex = canvasTex(size / 2, size / 2, (g, w) => {
      g.fillStyle = '#000000'
      g.fillRect(0, 0, w, w)
    })
  }
  return { map, glowTex, glow }
}

/** A card with a word (facing +z), its edge in a colour, sized to the word. */
function card(word, color, cardMat, { size = 0.12, maxWidth = 1.4, textColor = '#3a2412' } = {}) {
  const g = new THREE.Group()
  const edge = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.012), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
  const board = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.02), cardMat)
  board.position.z = 0.005
  const text = makeText(word, { size, color: textColor, maxWidth, lineHeight: 1.05 })
  text.position.z = 0.018
  g.add(edge, board, text)
  const fit = (w, h) => {
    board.scale.set(w + size * 1.2, h + size * 0.9, 1)
    edge.scale.set(w + size * 1.2 + 0.04, h + size * 0.9 + 0.04, 1)
  }
  fit(Math.min(maxWidth, word.length * size * 0.56), size)
  text.addEventListener('synccomplete', () => {
    const b = text.textRenderInfo?.blockBounds
    if (b) fit(b[2] - b[0], b[3] - b[1])
  })
  return g
}

/** A quad from four corners, counter-clockwise seen from its front; UVs from `uv` (four pairs). */
function quad(a, b, c, d, uv) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex([0, 1, 2, 0, 2, 3])
  geo.computeVertexNormals()
  return geo
}

/** A red deer stag, facing +z, standing on y = 0. setPose(raise) from grazing (0) to reaching up (1). */
function makeDeer(M) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.8, 6, 14).rotateX(Math.PI / 2), M.fur)
  body.position.set(0, 1.0, 0)
  body.scale.set(0.9, 1, 1)
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 10), M.fur)
  chest.position.set(0, 1.03, 0.42)
  const belly = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.6, 4, 10).rotateX(Math.PI / 2), M.pale)
  belly.position.set(0, 0.86, 0)
  const rump = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8).scale(1.05, 1.1, 0.45), M.pale)
  rump.position.set(0, 1.04, -0.68)
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 8), M.fur)
  tail.position.set(0, 1.17, -0.75)
  tail.rotation.x = -2.4
  g.add(body, chest, belly, rump, tail)
  for (const [x, z] of [[-0.15, 0.4], [0.15, 0.4], [-0.15, -0.42], [0.15, -0.42]]) {
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.045, 0.5, 8), M.fur)
    up.position.set(x, 0.74, z)
    const low = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.5, 8), M.fur)
    low.position.set(x, 0.28, z)
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.042, 0.06, 8), M.dark)
    hoof.position.set(x, 0.03, z)
    g.add(up, low, hoof)
  }
  const neck = new THREE.Group()
  neck.position.set(0, 1.15, 0.52)
  g.add(neck)
  neck.add(new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.13, 0.66, 10).translate(0, 0.33, 0), M.fur))
  const mane = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.4, 10).translate(0, 0.22, -0.02), M.mane)
  neck.add(mane)
  const head = new THREE.Group()
  head.position.set(0, 0.66, 0)
  neck.add(head)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10).scale(0.85, 0.9, 1.6), M.fur)
  skull.position.set(0, 0, 0.08)
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8).scale(0.9, 0.85, 1.2), M.fur)
  muzzle.position.set(0, -0.045, 0.27)
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), M.dark)
  nose.position.set(0, -0.04, 0.35)
  head.add(skull, muzzle, nose)
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), M.dark)
    eye.position.set(s * 0.085, 0.035, 0.13)
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.17, 8).scale(1, 1, 0.5), M.fur)
    ear.position.set(s * 0.11, 0.09, -0.03)
    ear.rotation.z = -s * 1.1
    // the antlers: a beam curving up and back, three tines forward
    const curve = new THREE.CatmullRomCurve3([V3(s * 0.05, 0.09, -0.03), V3(s * 0.17, 0.32, -0.1), V3(s * 0.26, 0.56, -0.07), V3(s * 0.24, 0.78, 0.03)])
    const beam = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.018, 6), M.antler)
    head.add(eye, ear, beam)
    for (const u of [0.2, 0.5, 0.78]) {
      const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.014, 0.17, 6).translate(0, 0.085, 0), M.antler)
      tine.position.copy(curve.getPointAt(u))
      tine.rotation.set(1.0, 0, -s * 0.25)
      head.add(tine)
    }
  }
  const mouth = new THREE.Object3D()
  mouth.position.set(0, -0.07, 0.36)
  head.add(mouth)
  const setPose = k => {
    neck.rotation.x = lerp(2.3, 0.45, k)
    head.rotation.x = lerp(-0.85, -0.25, k)
  }
  setPose(0)
  return { group: g, setPose, mouth, body }
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, lang, clickable }) {
  const stage = digStage({
    light,
    radius: 13,
    sun: [-0.6, 0.22, 0.77],
    pits: [TR],
    bare: [
      [(TR.x0 + TR.x1) / 2, (TR.z0 + TR.z1) / 2, 7.2, 3.6],
      [SPOIL.x, SPOIL.z, 3.0, 3.0],
      [(TENT.x0 + TENT.x1) / 2, (TENT.z0 + TENT.z1) / 2, 4.2, 4.4],
      [JAR.x, JAR.z - 0.3, 4.0, 3.4],
    ],
    clear: [[TREE.x, TREE.z, 1.4], [POST.x, POST.z, 0.4]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  let clock = 0
  const paras = list => list.map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still at
   *  that station. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const cam = () => ctx.camera
  /** A station's view: `size` is fitted to the screen's height, so on an upright phone (narrow) it is
   *  widened until `wide` metres fit across. Read when the station is used. */
  const view = (x, y, z, size, wide) => ({
    x,
    y,
    z,
    get size() {
      const aspect = ctx.camera?.aspect ?? 1.6
      return Math.max(size, aspect < 1 ? wide / Math.max(0.4, aspect) : size)
    },
  })
  // carbon's tree fades what stands between the camera and the player in its own wings: not here
  FADE.uFadeRadius.value = 0

  const dotTex = softDot()
  const matcap = beadMatcap()
  textures.push(dotTex, matcap)
  const M = {
    card: new THREE.MeshStandardMaterial({ color: '#d6bf98', roughness: 0.85 }),
    wood: new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.8 }),
    darkWood: new THREE.MeshStandardMaterial({ color: '#4e3420', roughness: 0.85 }),
    steel: new THREE.MeshStandardMaterial({ color: '#a9b1ba', roughness: 0.3, metalness: 0.85 }),
    canvas: new THREE.MeshStandardMaterial({ color: '#c4b696', roughness: 0.95, side: THREE.DoubleSide }),
    pole: new THREE.MeshStandardMaterial({ color: '#8a7a64', roughness: 0.6, metalness: 0.3 }),
    rope: new THREE.MeshStandardMaterial({ color: '#d8d0bc', roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: '#868074', roughness: 0.95, flatShading: true }),
    charcoal: new THREE.MeshStandardMaterial({ color: '#1e1a18', roughness: 0.85, flatShading: true }),
    ash: new THREE.MeshStandardMaterial({ color: '#3a3330', roughness: 1 }),
    bone: new THREE.MeshStandardMaterial({ color: '#cbb68c', roughness: 0.7 }),
    bowl: new THREE.MeshStandardMaterial({ color: '#7d4f2c', roughness: 0.75 }),
    hollow: new THREE.MeshStandardMaterial({ color: '#2f2318', roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
    fur: new THREE.MeshStandardMaterial({ color: '#8a5434', roughness: 0.9 }),
    mane: new THREE.MeshStandardMaterial({ color: '#5e3a24', roughness: 0.95 }),
    pale: new THREE.MeshStandardMaterial({ color: '#cdb48e', roughness: 0.9 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a1d16', roughness: 0.5 }),
    antler: new THREE.MeshStandardMaterial({ color: '#cbb894', roughness: 0.7 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#557a32', roughness: 0.75, side: THREE.DoubleSide }),
    machine: new THREE.MeshStandardMaterial({ color: '#b8b3a6', roughness: 0.45, metalness: 0.2 }),
    magnet: new THREE.MeshStandardMaterial({ color: '#b0362e', roughness: 0.5, metalness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: '#e6f4ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.17, depthWrite: false, side: THREE.DoubleSide }),
    hit: new THREE.MeshBasicMaterial({ visible: false }),
  }
  const bead = (color, k = 1) => new THREE.MeshMatcapMaterial({ matcap, color: hdr(color, k) })
  const glowSprite = (color, scale, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity }))
    s.scale.setScalar(scale)
    return s
  }
  const label3d = (text, size, color = '#ffffff') => makeText(text, { size, color, outlineWidth: size * 0.1, outlineColor: '#0a0f2a', anchorY: 'bottom' })
  const billboards = []
  updates.push(() => {
    for (const b of billboards) if (b.visible) b.quaternion.copy(cam().quaternion)
  })

  // ======== 1. the trench: four layers, a find in each ========
  const soilTex = soilTexture({ seed: 9, base: '#d2c3ad' })
  soilTex.repeat.set(1.2, 1.2)
  const strata = strataTexture({
    layers: [
      { to: 0.14, color: '#4b3824', grit: 0.4, stones: 0.1 },
      { to: 0.33, color: '#7a6248', grit: 0.6, stones: 0.3 },
      { to: 0.55, color: '#584330', grit: 0.5, stones: 0.25 },
      { to: 0.77, color: '#937a52', grit: 0.4, stones: 0.15 },
      { to: 1.3, color: '#463a31', grit: 0.8, stones: 0.4 },
    ],
    height: 1.3,
    width: 5,
    seed: 12,
  })
  textures.push(soilTex, strata)
  const wallMat = new THREE.MeshStandardMaterial({ map: strata, roughness: 1 })
  const treadColors = ['#9a7c5c', '#7a5f45', '#ad9068', '#625247']
  const treadMats = treadColors.map(c => new THREE.MeshStandardMaterial({ map: soilTex, color: c, roughness: 1 }))
  const trench = new THREE.Group()
  root.add(trench)
  {
    const H = 1.3
    const vOf = y => 1 + y / H
    const uN = x => (x - TR.x0) / 5
    const D = TR.z1 - TR.z0
    const add = (geo, mat) => {
      const m = new THREE.Mesh(geo, mat)
      m.receiveShadow = true
      trench.add(m)
    }
    for (let k = 0; k < 4; k++) {
      const xa = TR.x0 + k * STEP_W
      const xb = xa + STEP_W
      const d = -DEPTH(k)
      // the far wall (north, facing the visitor) and the near one
      add(quad([xa, d, TR.z0], [xb, d, TR.z0], [xb, 0, TR.z0], [xa, 0, TR.z0], [uN(xa), vOf(d), uN(xb), vOf(d), uN(xb), 1, uN(xa), 1]), wallMat)
      add(quad([xb, d, TR.z1], [xa, d, TR.z1], [xa, 0, TR.z1], [xb, 0, TR.z1], [uN(xb) + 0.4, vOf(d), uN(xa) + 0.4, vOf(d), uN(xa) + 0.4, 1, uN(xb) + 0.4, 1]), wallMat)
      // the tread, its soil the layer's
      const tu = (x, z) => [x * 0.8, z * 0.8]
      add(quad([xa, d, TR.z1], [xb, d, TR.z1], [xb, d, TR.z0], [xa, d, TR.z0], [...tu(xa, TR.z1), ...tu(xb, TR.z1), ...tu(xb, TR.z0), ...tu(xa, TR.z0)]), treadMats[k])
      // the riser down to the next step (facing east), or the end wall
      if (k < 3) {
        const yb = -DEPTH(k + 1)
        add(quad([xb, yb, TR.z1], [xb, yb, TR.z0], [xb, d, TR.z0], [xb, d, TR.z1], [0.1, vOf(yb), 0.1 + D / 5, vOf(yb), 0.1 + D / 5, vOf(d), 0.1, vOf(d)]), wallMat)
      }
    }
    // the end walls: the west one (shallow) and the east one (deepest)
    const dw = -DEPTH(0)
    add(quad([TR.x0, dw, TR.z1], [TR.x0, dw, TR.z0], [TR.x0, 0, TR.z0], [TR.x0, 0, TR.z1], [0.6, vOf(dw), 0.6 + D / 5, vOf(dw), 0.6 + D / 5, 1, 0.6, 1]), wallMat)
    const de = -DEPTH(3)
    add(quad([TR.x1, de, TR.z0], [TR.x1, de, TR.z1], [TR.x1, 0, TR.z1], [TR.x1, 0, TR.z0], [0.3, vOf(de), 0.3 + D / 5, vOf(de), 0.3 + D / 5, 1, 0.3, 1]), wallMat)
  }
  // the trench and its strings keep walkers out (low: the camera looks over it)
  solids.push(box((TR.x0 + TR.x1) / 2, (TR.z0 + TR.z1) / 2, TR.x1 - TR.x0 + 0.7, TR.z1 - TR.z0 + 0.7, { y0: -2, y1: 0.6 }))
  // pegs and string round it, a ranging pole, a trowel and a brush, buckets
  {
    const m = 0.32
    const corners = [[TR.x0 - m, TR.z0 - m], [TR.x1 + m, TR.z0 - m], [TR.x1 + m, TR.z1 + m], [TR.x0 - m, TR.z1 + m]]
    for (const [x, z] of corners) {
      const peg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), M.wood)
      peg.position.set(x, 0.2, z)
      root.add(peg)
    }
    corners.forEach((a, i) => {
      const b = corners[(i + 1) % 4]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, len, 4), M.rope)
      s.position.set((a[0] + b[0]) / 2, 0.34, (a[1] + b[1]) / 2)
      s.rotation.set(0, -Math.atan2(b[1] - a[1], b[0] - a[0]), Math.PI / 2)
      root.add(s)
    })
    const stripes = canvasTex(16, 256, (g, w, h) => {
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#e9e4da' : '#c4362c'
        g.fillRect(0, (i * h) / 8, w, h / 8)
      }
    })
    textures.push(stripes)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2, 8), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.6 }))
    pole.position.set(TR.x0 + 0.25, -0.25 + 0.95, TR.z0 + 0.2)
    pole.rotation.set(-0.12, 0, 0.12)
    trench.add(pole)
    // a trowel and a brush on the first step
    const trowel = new THREE.Group()
    const blade = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([V3(0, 0, 0), V3(0.05, 0, 0.14), V3(-0.05, 0, 0.14)]), M.steel)
    blade.geometry.setIndex([0, 2, 1])
    blade.geometry.computeVertexNormals()
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.12, 8).rotateX(Math.PI / 2), M.darkWood)
    handle.position.set(0, 0.03, -0.07)
    trowel.add(blade, handle)
    trowel.position.set(TR.x0 + 0.3, -DEPTH(0) + 0.005, FIND_Z + 0.35)
    trowel.rotation.y = 0.7
    trench.add(trowel)
    const brush = new THREE.Group()
    const bHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.16), M.wood)
    const bristles = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.04), M.darkWood)
    bristles.position.z = 0.1
    brush.add(bHandle, bristles)
    brush.position.set(TR.x0 + STEP_W + 0.35, -DEPTH(1) + 0.015, FIND_Z + 0.42)
    brush.rotation.y = -0.5
    trench.add(brush)
    const bucketMat = new THREE.MeshStandardMaterial({ color: '#2f5d8c', roughness: 0.6, side: THREE.DoubleSide })
    for (const [x, z] of [[-0.95, 0.9], [-0.55, 1.35]]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.3, 18, 1, true).translate(0, 0.15, 0), bucketMat)
      b.position.set(x, 0, z)
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16).rotateX(-Math.PI / 2), treadMats[1])
      soil.position.set(x, 0.24, z)
      root.add(b, soil)
      solids.push(circle(x, z, 0.18))
    }
  }

  // the finds, each sunk in its tread
  const linenTex = canvasTex(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const rnd = random(77)
    g.fillStyle = '#b9a47c'
    g.beginPath()
    // a torn edge all round
    const pts = []
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * TAU
      const rx = w * (0.42 + rnd() * 0.06)
      const ry = h * (0.36 + rnd() * 0.06)
      pts.push([w / 2 + Math.cos(a) * rx * (Math.abs(Math.cos(a)) > 0.7 ? 1.05 : 1), h / 2 + Math.sin(a) * ry])
    }
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.closePath()
    g.fill()
    g.globalCompositeOperation = 'source-atop'
    g.strokeStyle = 'rgba(90,70,40,0.35)'
    g.lineWidth = 1
    for (let x = 0; x < w; x += 3) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x, h)
      g.stroke()
    }
    for (let y = 0; y < h; y += 3) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(w, y)
      g.stroke()
    }
    g.fillStyle = 'rgba(80,60,30,0.25)'
    for (let i = 0; i < 12; i++) {
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 4 + rnd() * 10, 0, TAU)
      g.fill()
    }
  })
  textures.push(linenTex)
  const findObjs = FINDS.map((fd, k) => {
    const g = new THREE.Group()
    const inner = new THREE.Group()
    g.add(inner)
    let sink = 0
    let trayScale = 0.6
    if (fd.id === 'linen') {
      const geo = new THREE.PlaneGeometry(0.46, 0.36, 18, 14)
      const p = geo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const y = p.getY(i)
        p.setZ(i, 0.018 * Math.sin(x * 28 + y * 9) + 0.014 * Math.sin(y * 31 - x * 5) + 0.01 * Math.cos(x * 55))
      }
      geo.computeVertexNormals()
      geo.rotateX(-Math.PI / 2)
      inner.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: linenTex, alphaTest: 0.5, roughness: 0.95, side: THREE.DoubleSide })))
      sink = -0.005
    } else if (fd.id === 'bowl') {
      const prof = [[0, 0], [0.1, 0], [0.15, 0.03], [0.185, 0.08], [0.195, 0.11], [0.18, 0.112], [0.165, 0.085], [0.13, 0.04], [0.06, 0.025], [0, 0.024]]
      const m = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 36), M.bowl)
      m.rotation.z = 0.35
      inner.add(m)
      sink = -0.05
      trayScale = 0.55
    } else if (fd.id === 'bone') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.36, 12).rotateZ(Math.PI / 2), M.bone)
      inner.add(shaft)
      for (const s of [-1, 1]) {
        for (const z of [-0.026, 0.026]) {
          const knob = new THREE.Mesh(new THREE.SphereGeometry(0.044, 12, 10), M.bone)
          knob.position.set(s * 0.19, 0, z)
          inner.add(knob)
        }
      }
      inner.rotation.y = 0.4
      sink = -0.012
      trayScale = 0.6
    } else {
      // the hearth: a ring of stones round ash and charcoal (they stay), one big lump of charcoal to take
      const hearth = new THREE.Group()
      const ash = new THREE.Mesh(new THREE.CircleGeometry(0.3, 24).rotateX(-Math.PI / 2), M.ash)
      ash.position.y = 0.004
      hearth.add(ash)
      const rnd = random(5)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + rnd() * 0.3
        const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075 + rnd() * 0.04, 0), M.stone)
        s.position.set(Math.cos(a) * 0.36, 0.02, Math.sin(a) * 0.32)
        s.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
        s.scale.y = 0.7
        hearth.add(s)
      }
      for (let i = 0; i < 9; i++) {
        const c = new THREE.Mesh(new THREE.DodecahedronGeometry(0.025 + rnd() * 0.02, 0), M.charcoal)
        c.position.set((rnd() - 0.5) * 0.4, 0.01, (rnd() - 0.5) * 0.36)
        c.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
        hearth.add(c)
      }
      hearth.position.set(TR.x0 + (k + 0.5) * STEP_W, -DEPTH(k), FIND_Z)
      trench.add(hearth)
      const lump = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07, 0), M.charcoal)
      lump.scale.set(1.3, 0.8, 1)
      inner.add(lump)
      sink = 0.01
      trayScale = 1.3
    }
    inner.scale.setScalar(1.3)
    g.traverse(o => o.isMesh && (o.castShadow = !light))
    const home = V3(TR.x0 + (k + 0.5) * STEP_W, -DEPTH(k) + sink, FIND_Z)
    g.position.copy(home)
    root.add(g)
    // the hollow it leaves in the soil
    const hollow = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20).rotateX(-Math.PI / 2).scale(1.2, 1, 0.9), M.hollow)
    hollow.position.set(home.x, -DEPTH(k) + 0.003, FIND_Z)
    hollow.visible = false
    trench.add(hollow)
    // a bigger, invisible shape to tap (a scrap of cloth is thin)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.5), M.hit)
    hit.position.y = 0.1
    g.add(hit)
    return { ...fd, k, group: g, inner, home, hollow, trayScale }
  })
  // soil thrown up as a find comes out
  const CLODS = 10
  const clods = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.03, 0), treadMats[1], CLODS * 4)
  clods.frustumCulled = false
  clods.count = 0
  clods.raycast = () => {}
  root.add(clods)
  const clodSeeds = Array.from({ length: CLODS }, (_, i) => {
    const r = random(300 + i)
    const a = r() * TAU
    return { dx: Math.cos(a), dz: Math.sin(a), v: 1.0 + r() * 1.2, s: 0.6 + r() * 0.8 }
  })

  // the spoil heap with its shovel (a new dig), a sieve, a wheelbarrow
  const spoil = new THREE.Group()
  spoil.position.set(SPOIL.x, 0, SPOIL.z)
  root.add(spoil)
  const shovel = new THREE.Group()
  {
    const heapGeo = new THREE.SphereGeometry(1, 28, 12, 0, TAU, 0, Math.PI / 2)
    const p = heapGeo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const k = 1 + 0.08 * Math.sin(x * 7 + z * 5) + 0.06 * Math.cos(z * 9 - x * 3)
      p.setXYZ(i, x * k, y * k, z * k)
    }
    heapGeo.computeVertexNormals()
    const heap = new THREE.Mesh(heapGeo, treadMats[1])
    heap.scale.set(1.3, 0.75, 1.1)
    heap.receiveShadow = true
    heap.castShadow = !light
    spoil.add(heap)
    solids.push(circle(SPOIL.x, SPOIL.z, 1.2, { y1: 0.75 }))
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 1.0, 8).translate(0, 0.5, 0), M.wood)
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8).rotateZ(Math.PI / 2).translate(0, 1.02, 0), M.darkWood)
    const blade = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.28, 0.02, 2, 0.008).translate(0, -0.12, 0), M.steel)
    shovel.add(handle, grip, blade)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.4).translate(0, 0.45, 0), M.hit)
    shovel.add(hit)
    shovel.position.set(0.55, 0.55, 0.45)
    shovel.rotation.set(0.2, 0.5, -0.35)
    spoil.add(shovel)
    // a sieve on its stand
    const sieve = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.6), M.wood)
    frame.position.y = 0.75
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.54).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6d6a62', roughness: 0.6, metalness: 0.5, wireframe: true }))
    mesh.position.y = 0.74
    sieve.add(frame, mesh)
    for (const [x, z] of [[-0.35, -0.25], [0.35, -0.25], [-0.35, 0.25], [0.35, 0.25]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 6), M.wood)
      leg.position.set(x, 0.37, z)
      sieve.add(leg)
    }
    sieve.position.set(SPOIL.x + 0.6, 0, SPOIL.z - 2.3)
    sieve.rotation.y = 0.3
    root.add(sieve)
    solids.push(circle(sieve.position.x, sieve.position.z, 0.5))
    // the wheelbarrow
    const barrow = new THREE.Group()
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.32, 4, 1, true).rotateY(Math.PI / 4).scale(1, 1, 1.35), new THREE.MeshStandardMaterial({ color: '#3f6b46', roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide }))
    tub.position.y = 0.48
    const fill = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 8, 0, TAU, 0, Math.PI / 2).scale(1, 0.3, 1.3), treadMats[1])
    fill.position.y = 0.58
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 20).rotateY(Math.PI / 2), M.dark)
    wheel.position.set(0, 0.2, 0.62)
    barrow.add(tub, fill, wheel)
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 6).rotateX(Math.PI / 2 - 0.25), M.steel)
      arm.position.set(s * 0.26, 0.42, -0.05)
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.4, 6), M.steel)
      leg.position.set(s * 0.24, 0.2, -0.35)
      barrow.add(arm, leg)
    }
    barrow.position.set(SPOIL.x + 0.4, 0, SPOIL.z + 2.6)
    barrow.rotation.y = 2.4
    root.add(barrow)
    solids.push(circle(barrow.position.x, barrow.position.z, 0.6))
  }

  // ======== 2. the tent: the dating lab, open toward the arrival ========
  const tent = new THREE.Group()
  root.add(tent)
  const TX = (TENT.x0 + TENT.x1) / 2
  const TZ = (TENT.z0 + TENT.z1) / 2
  {
    const { x0, x1, z0, z1, eave, ridge } = TENT
    const o = 0.15
    const add = (geo, mat = M.canvas) => {
      const m = new THREE.Mesh(geo, mat)
      m.receiveShadow = true
      tent.add(m)
      return m
    }
    const U = [0, 0, 1, 0, 1, 1, 0, 1]
    // the roof's two slopes (the ridge runs from the door to the back), the side walls, the back wall
    add(quad([x0 - o, eave - 0.05, z1 + o], [x0 - o, eave - 0.05, z0 - o], [TX, ridge, z0 - o], [TX, ridge, z1 + o], U))
    add(quad([x1 + o, eave - 0.05, z0 - o], [x1 + o, eave - 0.05, z1 + o], [TX, ridge, z1 + o], [TX, ridge, z0 - o], U))
    add(quad([x0, 0, z0], [x0, 0, z1], [x0, eave, z1], [x0, eave, z0], U))
    add(quad([x1, 0, z1], [x1, 0, z0], [x1, eave, z0], [x1, eave, z1], U))
    add(quad([x0, 0, z0], [x1, 0, z0], [x1, eave, z0], [x0, eave, z0], U))
    const gable = z => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute([x0, eave, z, x1, eave, z, TX, ridge, z], 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2))
      geo.computeVertexNormals()
      return geo
    }
    add(gable(z0))
    add(gable(z1))
    // poles at the corners, the ridge beam, guy ropes to pegs
    for (const [x, z] of [[x0, z0], [x0, z1], [x1, z0], [x1, z1]]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, eave, 8), M.pole)
      p.position.set(x, eave / 2, z)
      tent.add(p)
      const a = V3(x, eave, z)
      const b = V3(x + (x < TX ? -1.0 : 1.0), 0, z + (z < TZ ? -0.5 : 0.5))
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, a.distanceTo(b), 4), M.rope)
      rope.position.copy(a).add(b).multiplyScalar(0.5)
      rope.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize())
      tent.add(rope)
    }
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, z1 - z0 + 0.3, 8).rotateX(Math.PI / 2), M.pole)
    beam.position.set(TX, ridge - 0.03, TZ)
    tent.add(beam)
    solids.push(box(x0, TZ, 0.12, z1 - z0 + 0.1), box(x1, TZ, 0.12, z1 - z0 + 0.1), box(TX, z0, x1 - x0 + 0.1, 0.12))
    solids.push(circle(x0, z1, 0.1), circle(x1, z1, 0.1))
    // the sign over the door
    const sign = card(E.lab.sign, LAB_C, M.card, { size: 0.17, maxWidth: 1.9 })
    sign.position.set(TX, eave + 0.24, z1 + 0.02)
    tent.add(sign)
    // a lantern under the ridge
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: hdr('#ffd08a', 2.2) }))
    lantern.position.set(TX, ridge - 0.45, TZ + 0.4)
    tent.add(lantern)
    const lampLight = new THREE.PointLight('#ffc27a', light ? 1.5 : 2.2, 5.5, 2)
    lampLight.position.copy(lantern.position)
    tent.add(lampLight)
  }
  // the table along the back wall
  const TABLE = { z: TENT.z0 + 0.36, top: 0.9, x0: TENT.x0 + 0.15, x1: TENT.x1 - 0.15 }
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(TABLE.x1 - TABLE.x0, 0.05, 0.6, 2, 0.015), M.wood)
    top.position.set(TX, TABLE.top - 0.025, TABLE.z)
    top.castShadow = !light
    top.receiveShadow = true
    tent.add(top)
    for (const x of [TABLE.x0 + 0.15, TABLE.x1 - 0.15]) {
      for (const z of [TABLE.z - 0.24, TABLE.z + 0.24]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, TABLE.top - 0.05, 0.05), M.darkWood)
        leg.position.set(x, (TABLE.top - 0.05) / 2, z)
        tent.add(leg)
      }
    }
    solids.push(box(TX, TABLE.z, TABLE.x1 - TABLE.x0, 0.64, { y1: TABLE.top + 0.05 }))
  }
  // the tray where finds wait (a slot each), on the table's left
  const slotAt = k => V3(TENT.x0 + 0.5 + k * 0.3, TABLE.top + 0.035, TABLE.z + 0.08)
  {
    const tray = new THREE.Mesh(new RoundedBoxGeometry(1.22, 0.03, 0.34, 2, 0.01), M.darkWood)
    tray.position.set(TENT.x0 + 0.95, TABLE.top + 0.015, TABLE.z + 0.08)
    tent.add(tray)
  }
  // a gold tag in front of each slot, shown once its find is dated
  const tags = FINDS.map((_, k) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 0.012), new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffb84a', emissiveIntensity: 0.15, roughness: 0.4 }))
    t.position.copy(slotAt(k)).add(V3(0, 0.02, 0.2))
    t.visible = false
    tent.add(t)
    return t
  })
  // the counter: an accelerator mass spectrometer, made small: a cabinet, a beam ring on top with its
  // magnet, a sample port in front, a screen above
  const MACH = V3(TX + 0.45, TABLE.top, TABLE.z)
  const machine = new THREE.Group()
  machine.position.copy(MACH)
  tent.add(machine)
  const ringR = 0.24
  const port = V3(-0.3, 0.2, 0.26) // in the machine's frame
  const beamDots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: hdr('#7ff7d6', 2.4) }), 10)
  beamDots.frustumCulled = false
  beamDots.visible = false
  beamDots.raycast = () => {}
  const portGlow = new THREE.MeshStandardMaterial({ color: '#203040', emissive: LAB_C, emissiveIntensity: 0.1, roughness: 0.4 })
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.92, 0.44, 0.5, 3, 0.04), M.machine)
    body.position.y = 0.22
    body.castShadow = !light
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.93, 0.04, 0.505), new THREE.MeshStandardMaterial({ color: LAB_C, emissive: LAB_C, emissiveIntensity: 0.5 }))
    stripe.position.y = 0.36
    const ring = new THREE.Mesh(new THREE.TorusGeometry(ringR, 0.028, 10, 48).rotateX(Math.PI / 2), M.steel)
    ring.position.y = 0.47
    const magnet = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.14, 0.16, 2, 0.02), M.magnet)
    magnet.position.set(ringR, 0.47, 0)
    const detector = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.16, 0.14, 2, 0.02), M.machine)
    detector.position.set(-ringR, 0.5, 0)
    const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 20).rotateX(Math.PI / 2), portGlow)
    hatch.position.copy(port)
    beamDots.position.y = 0.47
    machine.add(body, stripe, ring, magnet, detector, hatch, beamDots)
  }
  const labScreen = screen({ width: 0.92, height: 0.54, color: LAB_C, title: E.lab.screen.title, line: E.lab.screen.ready, titleSize: 0.068, lineSize: 0.056 })
  labScreen.group.position.set(MACH.x, 1.84, TENT.z0 + 0.12)
  tent.add(labScreen.group)
  {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), M.pole)
    post.position.set(MACH.x, 1.37, TENT.z0 + 0.1)
    tent.add(post)
  }
  // the bar on the screen: how much carbon-14 is left
  const barBack = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.045), new THREE.MeshBasicMaterial({ color: '#1b2350' }))
  barBack.position.set(0, -0.2, 0.002)
  const barFill = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.045).translate(0.36, 0, 0), new THREE.MeshBasicMaterial({ color: hdr(JAR_C, 1.3) }))
  barFill.position.set(-0.36, -0.2, 0.004)
  labScreen.content.add(barBack, barFill)
  barBack.visible = barFill.visible = false

  // the board on the back wall: the carbon-14 clock's curve, the dated finds on it
  const curveTex = canvasTex(1024, 600, () => {})
  textures.push(curveTex)
  const curveBoard = new THREE.Group()
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(1.42, 0.86, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: LAB_C, emissive: LAB_C, emissiveIntensity: 0.6 }))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.8), new THREE.MeshBasicMaterial({ map: curveTex, toneMapped: false }))
    face.position.z = 0.022
    curveBoard.add(frame, face)
    curveBoard.position.set(TENT.x0 + 0.92, 1.73, TENT.z0 + 0.05)
    tent.add(curveBoard)
  }
  // the tree slice at the table's right end: its rings calibrate real dates
  const slice = ringFace({ seed: 8 })
  textures.push(slice.map, slice.glowTex)
  const sliceGroup = new THREE.Group()
  {
    const r = 0.3
    const face = new THREE.MeshStandardMaterial({ map: slice.map, emissiveMap: slice.glowTex, emissive: '#ffcf7a', emissiveIntensity: 0, roughness: 0.85 })
    const bark = new THREE.MeshStandardMaterial({ color: '#4e301a', roughness: 1 })
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.06, 40).rotateX(Math.PI / 2), [bark, face, face])
    disc.castShadow = !light
    sliceGroup.add(disc)
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.12), M.darkWood)
    cradle.position.y = -r + 0.02
    sliceGroup.add(cradle)
    sliceGroup.position.set(TENT.x1 - 0.5, TABLE.top + r + 0.01, TABLE.z)
    sliceGroup.rotation.y = -0.4
    tent.add(sliceGroup)
    sliceGroup.userData.face = face
  }

  // ======== 3. the atom hourglass, before the tree-ring clock face ========
  const NJ = 128
  const HB = 0.68
  const RB = 0.34
  const RN = 0.035
  const AR = 0.036
  const PLINTH = 0.28
  const NECK_Y = PLINTH + 0.07 + HB
  const bulbR = u => {
    const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, u / 0.5)), 0.75)
    const b = 1 - 0.28 * Math.pow(clamp((u - 0.55) / 0.45), 2)
    return RN + (RB - RN) * a * b
  }
  const hourglass = new THREE.Group()
  hourglass.position.set(JAR.x, 0, JAR.z)
  root.add(hourglass)
  const glassGroup = new THREE.Group()
  glassGroup.position.y = NECK_Y
  hourglass.add(glassGroup)
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.3, PLINTH, 1.0, 2, 0.03), M.darkWood)
    plinth.position.y = PLINTH / 2
    plinth.castShadow = !light
    plinth.receiveShadow = true
    hourglass.add(plinth)
    const prof = []
    for (let i = 0; i <= 64; i++) {
      const y = -HB + (2 * HB * i) / 64
      prof.push(new THREE.Vector2(bulbR(Math.abs(y) / HB), y))
    }
    const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), M.glass)
    glass.renderOrder = 5
    glassGroup.add(glass)
    const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.07, 36)
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(capGeo, M.wood)
      cap.position.y = s * (HB + 0.035)
      cap.castShadow = !light
      glassGroup.add(cap)
    }
    // four turned posts, on the diagonals (the front stays open)
    const postProf = []
    for (let i = 0; i <= 24; i++) {
      const v = i / 24
      const r = 0.026 + 0.012 * Math.pow(Math.abs(Math.sin(v * Math.PI * 3)), 3)
      postProf.push(new THREE.Vector2(r, -HB + 2 * HB * v))
    }
    const postGeo = new THREE.LatheGeometry(postProf, 10)
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2
      const p = new THREE.Mesh(postGeo, M.wood)
      p.position.set(Math.cos(a) * 0.41, 0, Math.sin(a) * 0.41)
      glassGroup.add(p)
    }
  }
  solids.push(box(JAR.x, JAR.z, 1.3, 1.0, { y1: PLINTH }))
  solids.push(circle(JAR.x, JAR.z, 0.55))
  // the slots: a close packing inside each bulb; the top one fills from the neck up, the bottom one heaps
  const topSlots = []
  const botSlots = []
  {
    const a = 2 * AR * 1.06 * Math.SQRT2
    const offs = [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]]
    const pts = []
    for (let i = -5; i <= 5; i++) for (let j = -8; j <= 8; j++) for (let k = -5; k <= 5; k++) for (const o of offs) pts.push(V3((i + o[0]) * a, (j + o[1]) * a, (k + o[2]) * a))
    const inside = (p, y) => y > AR + 0.012 && y < HB - AR - 0.02 && Math.hypot(p.x, p.z) < bulbR(y / HB) - AR * 1.12
    topSlots.push(...pts.filter(p => inside(p, p.y)).sort((p, q) => p.y - q.y).slice(0, NJ))
    const heap = p => p.y + 0.45 * Math.hypot(p.x, p.z)
    botSlots.push(...pts.filter(p => inside(p, -p.y)).sort((p, q) => heap(p) - heap(q)).slice(0, NJ))
  }
  const atomMat = new THREE.MeshMatcapMaterial({ matcap, color: '#ffffff' })
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(AR, 14, 10), atomMat, NJ)
  atoms.frustumCulled = false
  glassGroup.add(atoms)
  const EL = 24
  const electrons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: hdr('#cfeaff', 3) }), EL)
  electrons.frustumCulled = false
  electrons.raycast = () => {}
  electrons.count = 0
  glassGroup.add(electrons)
  // the lever: 128 new atoms
  const lever = new THREE.Group()
  lever.position.set(JAR.x + 0.5, PLINTH, JAR.z + 0.38)
  root.add(lever)
  const leverArm = new THREE.Group()
  lever.add(leverArm)
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.14), M.steel)
    base.position.y = 0.02
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 8).translate(0, 0.18, 0), M.steel)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), new THREE.MeshStandardMaterial({ color: '#d0402e', roughness: 0.4 }))
    knob.position.y = 0.37
    leverArm.add(arm, knob)
    leverArm.position.y = 0.03
    lever.add(base)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3).translate(0, 0.22, 0), M.hit)
    lever.add(hit)
  }
  // the tree-ring clock face behind, as in the picture
  const bigRings = ringFace({ seed: 3, ticks: true, size: 1024 })
  textures.push(bigRings.map)
  {
    const R = 1.55
    const face = new THREE.MeshStandardMaterial({ map: bigRings.map, color: '#e6e0d6', roughness: 0.85 })
    const bark = new THREE.MeshStandardMaterial({ color: '#4e301a', roughness: 1 })
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.24, 64).rotateX(Math.PI / 2), [bark, face, face])
    disc.position.set(JAR.x, R + 0.1, JAR.z - 1.2)
    disc.castShadow = !light
    disc.receiveShadow = true
    root.add(disc)
    for (const s of [-1, 1]) {
      const chock = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.5), M.darkWood)
      chock.position.set(JAR.x + s * 0.7, 0.11, JAR.z - 1.2)
      root.add(chock)
    }
    solids.push(box(JAR.x, JAR.z - 1.2, 3.2, 0.4))
  }
  // the board beside it: the time, how many are left, their count against time
  const jarTex = canvasTex(512, 512, () => {})
  textures.push(jarTex)
  const jarBoard = new THREE.Group()
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.94, 0.94, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: JAR_C, emissive: JAR_C, emissiveIntensity: 0.6 }))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.88), new THREE.MeshBasicMaterial({ map: jarTex, toneMapped: false }))
    face.position.z = 0.022
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.06), M.darkWood)
    post.position.set(0, -0.86, -0.04)
    jarBoard.add(frame, face, post)
    jarBoard.position.set(JAR.x + 1.3, 1.3, JAR.z + 0.35)
    jarBoard.rotation.y = Math.atan2(-1.3, 2.3)
    root.add(jarBoard)
    solids.push(circle(jarBoard.position.x, jarBoard.position.z, 0.2))
  }

  // ======== 4. the sky, the signpost, the oak and its deer ========
  const post = new THREE.Group()
  post.position.set(POST.x, 0, POST.z)
  root.add(post)
  const skyButton = new THREE.MeshStandardMaterial({ color: '#2f6fd6', emissive: SKY_C, emissiveIntensity: 0.4, roughness: 0.4 })
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 10).translate(0, 1.2, 0), M.wood)
    pole.castShadow = !light
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.3, 4), new THREE.MeshStandardMaterial({ color: SKY_C, emissive: SKY_C, emissiveIntensity: 0.6 }))
    arrow.position.y = 2.55
    const sign = card(E.sky.sign, SKY_C, M.card, { size: 0.13, maxWidth: 1.3 })
    sign.position.set(0, 1.8, 0.07)
    const boxM = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.2, 0.1, 2, 0.02), M.steel)
    boxM.position.set(0, 1.05, 0.08)
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20).rotateX(Math.PI / 2), skyButton)
    btn.position.set(0, 1.05, 0.15)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.6, 8).translate(0, 1.3, 0), M.hit)
    post.add(pole, arrow, sign, boxM, btn, hit)
    post.rotation.y = -0.25
    solids.push(circle(POST.x, POST.z, 0.15))
  }
  // the oak (carbon's tree, grown in code) with a low branch where the deer browses
  const tree = buildTree({ light, seed: 6, scale: 0.72, shadows: !light })
  tree.group.position.set(TREE.x, 0, TREE.z)
  root.add(tree.group)
  solids.push(circle(TREE.x, TREE.z, 0.7))
  const deer = makeDeer(M)
  deer.group.position.set(DEER.x, 0, DEER.z)
  deer.group.rotation.y = Math.PI / 2
  deer.group.traverse(o => o.isMesh && (o.castShadow = !light))
  root.add(deer.group)
  solids.push(circle(DEER.x - 0.35, DEER.z, 0.42), circle(DEER.x + 0.35, DEER.z, 0.42))
  // where the deer's mouth reaches when it stretches up: the sprig's leaves are there
  deer.setPose(1)
  deer.group.updateMatrixWorld(true)
  const mouthUp = deer.mouth.getWorldPosition(V3(0, 0, 0))
  deer.setPose(0)
  const SPRIG = mouthUp.clone().add(V3(0.1, 0.06, 0))
  const sprig = new THREE.Group()
  root.add(sprig)
  {
    const from = V3(TREE.x - 0.25, 2.45, TREE.z + 0.25)
    const curve = new THREE.CatmullRomCurve3([from, V3((from.x + SPRIG.x) / 2, 2.35, (from.z + SPRIG.z) / 2), SPRIG.clone().add(V3(0.05, 0.12, 0))])
    const twig = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.035, 6), new THREE.MeshStandardMaterial({ color: '#5a4636', roughness: 0.9 }))
    sprig.add(twig)
    const rnd = random(19)
    for (let i = 0; i < 14; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6).scale(1, 0.22, 1.7), M.leaf)
      leaf.position.copy(SPRIG).add(V3((rnd() - 0.5) * 0.3, (rnd() - 0.3) * 0.22, (rnd() - 0.5) * 0.3))
      leaf.rotation.set(rnd() * 2 - 1, rnd() * TAU, rnd() * 2 - 1)
      sprig.add(leaf)
    }
  }
  // carbon-14 glowing in the deer, one more each time it eats some (up to five)
  const deerDots = Array.from({ length: 5 }, (_, i) => {
    const s = glowSprite(TEAL, 0.16, 0.9)
    const r = random(60 + i)
    s.position.set((r() - 0.5) * 0.3, 0.95 + (r() - 0.5) * 0.25, (r() - 0.5) * 0.9)
    s.visible = false
    deer.group.add(s)
    return s
  })

  // the cosmic ray's story, high over the field
  // where the ray strikes the air: where the sky was tapped, some 14 m out (the post's button and the panel:
  // over the oak, in the station's view); the nitrogen-14 nucleus a little toward the oak and lower
  const SKY_AT = V3(1.0, 8.5, -12.0)
  const P = SKY_AT.clone()
  const HN = V3(0, 0, 0)
  const RAY_FROM = V3(0, 0, 0)
  let down = null
  const sky = new THREE.Group()
  root.add(sky)
  const rayMat = new THREE.MeshBasicMaterial({ color: hdr('#d6c8ff', 3), transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
  const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 6, 1, true).translate(0, 0.5, 0), rayMat)
  const rayHead = glowSprite('#e6dcff', 1.4)
  const flash = glowSprite('#fff4e0', 1)
  sky.add(ray, rayHead, flash)
  const nucleus = new THREE.Group()
  nucleus.position.copy(HN)
  sky.add(nucleus)
  const NUC_R = 0.2
  const nucPts = packBall(14, 0.42)
  const protonMat = bead('#ff5e4e', 1.25)
  const neutronMat = bead('#c8ccd6', 1.1)
  const tealMat = bead('#3fe6b4', 1.8)
  const ballGeo = new THREE.SphereGeometry(NUC_R, 16, 12)
  const nucSpin = new THREE.Group()
  nucleus.add(nucSpin)
  const nucBalls = nucPts.map((p, i) => {
    const m = new THREE.Mesh(ballGeo, i % 2 ? neutronMat : protonMat)
    m.position.copy(p)
    nucSpin.add(m)
    return m
  })
  const nucHalo = glowSprite('#9fb8ff', 2.6, 0.5)
  nucleus.add(nucHalo)
  const nucLabel = label3d(E.sky.labels.n14, 0.36)
  nucLabel.position.set(0, 0.75, 0)
  nucleus.add(nucLabel)
  billboards.push(nucLabel)
  const neutron = new THREE.Mesh(ballGeo, neutronMat)
  const neutronLabel = label3d(E.sky.labels.neutron, 0.3)
  neutronLabel.position.set(0, -0.32, 0)
  neutronLabel.anchorY = 'top'
  neutron.add(neutronLabel, glowSprite('#ffffff', 1.0, 0.45))
  billboards.push(neutronLabel)
  const proton = new THREE.Mesh(ballGeo, protonMat)
  const protonLabel = label3d(E.sky.labels.proton, 0.3, '#ffd0c8')
  protonLabel.position.set(0, -0.32, 0)
  protonLabel.anchorY = 'top'
  proton.add(protonLabel, glowSprite('#ff8a7a', 1.0, 0.45))
  billboards.push(protonLabel)
  const rayLabel = label3d(E.sky.labels.ray, 0.36, '#e6dcff')
  billboards.push(rayLabel)
  sky.add(neutron, proton, rayLabel)
  // carbon dioxide: the new carbon-14 between two oxygens
  const co2 = new THREE.Group()
  const cAtom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 14), tealMat)
  co2.add(cAtom, glowSprite(TEAL, 1.6, 0.7))
  const oxy = [-1, 1].map(s => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 12), bead('#ef3a2f', 1.1))
    o.userData.side = s
    co2.add(o)
    return o
  })
  const sticks = [-1, 1].map(s => {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 8).rotateZ(Math.PI / 2), new THREE.MeshMatcapMaterial({ matcap, color: '#cfd3dc' }))
    st.position.x = s * 0.36
    co2.add(st)
    return st
  })
  const co2Label = label3d(E.sky.labels.co2, 0.36, '#bff7e6')
  billboards.push(co2Label)
  sky.add(co2, co2Label)
  const c14Label = E.sky.labels.c14
  /** Aim the story at a strike point: the nucleus beside it, the ray from above, the way down to the oak. */
  const aimSky = q => {
    P.copy(q)
    const toward = V3(SPRIG.x - P.x, 0, SPRIG.z - P.z)
    const far = toward.length()
    toward.normalize()
    HN.copy(P).addScaledVector(toward, Math.min(3.2, far * 0.35)).add(V3(0, -2.0, 0))
    RAY_FROM.copy(P).add(V3(-0.35, 1, 0.25).normalize().multiplyScalar(40))
    // down outside the crown on its west side, then in under it to the low branch
    const low = SPRIG.clone().add(V3(-2.3, 0.5, -0.1))
    const mid = HN.clone().lerp(low, 0.5).add(V3(-0.8, 0.6, 0.4))
    down = new THREE.CatmullRomCurve3([HN.clone(), mid, low, SPRIG.clone()], false, 'centripetal')
  }
  aimSky(SKY_AT)
  // a fading trail behind it
  const TRAIL = 36
  const trail = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshBasicMaterial({ color: hdr('#3fe6b4', 1.6), transparent: true, opacity: 0.7, depthWrite: false }), TRAIL)
  trail.frustumCulled = false
  trail.count = 0
  trail.raycast = () => {}
  sky.add(trail)
  const sprigGlow = glowSprite(TEAL, 0.9, 0)
  sprigGlow.position.copy(SPRIG)
  const bite = glowSprite(TEAL, 0.3, 0)
  sky.add(sprigGlow, bite)
  // the sky to tap: an invisible dome (only its upper part counts)
  const skyHit = new THREE.Mesh(new THREE.SphereGeometry(80, 24, 12), new THREE.MeshBasicMaterial({ visible: false, side: THREE.BackSide }))
  root.add(skyHit)

  // ================= the sky: steps and timeline =================
  const T = { ray: 0.9, nIn: 0.2, neu: [0.9, 2.3], c14: 2.45, pro: [2.45, 4.4], oIn: [3.6, 4.6], down: [4.8, 11.0], raise: [11.4, 12.8], eat: [12.8, 13.9], into: [13.2, 14.0], lower: [14.2, 15.4] }
  const SKY_T = 15.6
  const SAYS = [[0.3, 'ray'], [2.5, 'made'], [4.6, 'co2'], [11.0, 'tree'], [13.3, 'deer']]
  const CUES = [[0.0, 'beam'], [2.3, 'neutron'], [2.45, 'proton'], [4.5, 'join'], [11.0, 'pop'], [13.9, 'select']]
  const S = { n: 0, start: -99, mine: false, live: false, said: 0, cue: 0 }
  const skyAge = () => clock - S.start
  const skyBusy = () => skyAge() < SKY_T
  const startSky = (age, live, mine) => {
    S.start = clock - age
    S.live = live
    S.mine = mine
    S.said = SAYS.findIndex(([t]) => t >= age)
    if (S.said < 0) S.said = SAYS.length
    S.cue = CUES.findIndex(([t]) => t >= age)
    if (S.cue < 0) S.cue = CUES.length
  }
  const skyPanel = lv => ({
    title: E.sky.title,
    color: SKY_C,
    blocks: [...paras(E.sky.panel[depth(lv)]), { buttons: [{ label: E.sky.button, onClick: () => skyStep() }] }],
  })
  function skyStep(q = SKY_AT) {
    if (skyBusy()) return say(at(W.busy, level()))
    S.n++
    aimSky(q)
    startSky(0, true, true)
    share('sky')
    findOnce('sky', skyPanel, SKY_T - 0.5)
  }
  ex.add({
    id: 'sky',
    // beside the signpost (it stands to the left, out of the view up)
    x: POST.x + 1.0,
    z: POST.z + 0.4,
    radius: 1.6,
    label: E.sky.label,
    verb: () => (skyBusy() ? E.sky.hints.watch : S.n ? E.sky.hints.again : E.sky.hints.tap),
    manual: true,
    focus: view(3.0, 4.2, -10.5, 8, 5),
    act: () => ctx.showPanel(skyPanel),
  })
  clickable(post, () => skyStep(), { when: () => !skyBusy() })
  // a tap on the sky: the ray strikes there, 14 m out along the tap, no lower than 6 m nor higher than 15
  const strikeAt = hit => {
    const eye = ctx.camera.position
    const q = hit.point.clone().sub(eye).normalize().multiplyScalar(14).add(eye)
    q.y = clamp(q.y, 6, 15)
    return q
  }
  clickable(skyHit, hit => skyStep(strikeAt(hit)), { reach: 2000, accept: h => h.point.y > 14, when: () => !skyBusy() })
  const tmp = V3(0, 0, 0)
  const tmp2 = V3(0, 0, 0)
  const dummy = new THREE.Object3D()
  const trailPts = []
  let trailT = 0
  updates.push(dt => {
    const a = skyAge()
    const on = a < SKY_T
    if (on && S.mine) while (S.said < SAYS.length && a >= SAYS[S.said][0]) say(at(E.sky.says[SAYS[S.said++][1]], level()), SKY_C)
    if (on && S.live) while (S.cue < CUES.length && a >= CUES[S.cue][0]) play(CUES[S.cue++][1])
    // the ray coming down
    const rk = span(0, T.ray, a)
    ray.visible = rayHead.visible = on && a < T.ray + 0.5
    rayLabel.visible = on && a < T.ray
    if (ray.visible) {
      const head = tmp.copy(RAY_FROM).lerp(P, rk)
      const tailK = Math.max(0, rk - 0.35)
      const tail = tmp2.copy(RAY_FROM).lerp(P, tailK)
      const len = Math.max(0.01, head.distanceTo(tail))
      ray.position.copy(tail)
      ray.scale.set(1, len, 1)
      ray.quaternion.setFromUnitVectors(V3(0, 1, 0), head.clone().sub(tail).normalize())
      rayHead.position.copy(head)
      rayMat.opacity = 1 - span(T.ray, T.ray + 0.5, a)
      rayLabel.position.copy(head).add(V3(0.6, 0.3, 0))
    }
    flash.visible = on && a > T.ray && a < T.ray + 0.8
    if (flash.visible) {
      const f = (a - T.ray) / 0.8
      flash.scale.setScalar(0.5 + 4 * Math.sqrt(f))
      flash.material.opacity = 1 - f
      flash.position.copy(P)
    }
    // the nucleus: nitrogen-14 fading in, taking the neutron, turning into carbon-14
    const nOn = on && a > T.nIn && a < T.oIn[1] + 0.1
    nucleus.visible = nOn
    if (nOn) {
      const k = span(T.nIn, T.nIn + 0.7, a)
      const shrink = 1 - span(T.oIn[0], T.oIn[1], a)
      nucleus.scale.setScalar(Math.max(0.01, k * shrink))
      const c = a >= T.c14
      // seven protons and seven neutrons; once the neutron is in and a proton gone, six and eight
      nucBalls.forEach((m, i) => (m.material = i % 2 || (c && i === 0) ? neutronMat : protonMat))
      const word = c ? c14Label : E.sky.labels.n14
      if (nucLabel.text !== word) {
        nucLabel.text = word
        nucLabel.color = c ? '#bff7e6' : '#ffffff'
        nucLabel.sync()
      }
      nucHalo.material.color.set(c ? '#3fe6b4' : '#9fb8ff')
      nucSpin.rotation.y += dt * 0.6
      // a shudder when the neutron lands
      const hit = a > T.neu[1] && a < T.neu[1] + 0.4 ? Math.sin((a - T.neu[1]) * 60) * 0.06 : 0
      nucleus.position.copy(HN).add(V3(hit, 0, 0))
    }
    neutron.visible = on && a > T.neu[0] && a < T.neu[1]
    if (neutron.visible) neutron.position.copy(P).lerp(HN, span(T.neu[0], T.neu[1], a))
    proton.visible = on && a > T.pro[0] && a < T.pro[1]
    if (proton.visible) {
      const k = (a - T.pro[0]) / (T.pro[1] - T.pro[0])
      proton.position.copy(HN).add(V3(3.0 * k, -0.6 * k, 1.2 * k))
      proton.scale.setScalar(1 - span(0.7, 1, k))
    }
    // carbon dioxide: the oxygens fly in, the molecule drifts down to the oak's low branch
    co2.visible = on && a > T.oIn[0] && a < T.down[1] + 0.4
    co2Label.visible = co2.visible
    if (co2.visible) {
      const join = span(T.oIn[0], T.oIn[1], a)
      oxy.forEach(o => o.position.set(o.userData.side * lerp(2.4, 0.72, join), lerp(1.2, 0, join) * o.userData.side, 0))
      sticks.forEach(s => (s.visible = join > 0.95))
      cAtom.scale.setScalar(lerp(0.4, 1, span(T.oIn[0], T.oIn[0] + 0.5, a)))
      const d = span(T.down[0], T.down[1], a)
      const p = down.getPointAt(Math.min(0.999, d))
      co2.position.copy(p).add(V3(Math.sin(a * 1.3) * 0.3 * (1 - d), 0, Math.cos(a * 1.1) * 0.3 * (1 - d)))
      co2.rotation.set(Math.sin(a * 0.7) * 0.4, a * 0.5, Math.cos(a * 0.6) * 0.3)
      const sc = lerp(1, 0.32, d) * (1 - span(T.down[1], T.down[1] + 0.4, a))
      co2.scale.setScalar(Math.max(0.01, sc))
      co2Label.visible = d < 0.75
      co2Label.position.copy(co2.position).add(V3(0, 0.55 * sc + 0.05, 0))
      co2Label.scale.setScalar(Math.max(0.3, sc))
      // the trail
      trailT += dt
      if (d > 0 && d < 1 && trailT > 0.08) {
        trailT = 0
        trailPts.push({ p: co2.position.clone(), t: clock })
        if (trailPts.length > TRAIL) trailPts.shift()
      }
    }
    trailPts.forEach((tp, i) => {
      const age = clock - tp.t
      dummy.position.copy(tp.p)
      dummy.scale.setScalar(Math.max(0.001, 1 - age / 2.6))
      dummy.updateMatrix()
      trail.setMatrixAt(i, dummy.matrix)
    })
    while (trailPts.length && clock - trailPts[0].t > 2.6) trailPts.shift()
    trail.count = trailPts.length
    trail.instanceMatrix.needsUpdate = true
    // the leaf takes it in; the deer reaches up, eats, lowers its head
    const leaf = on ? span(T.down[1] - 0.2, T.down[1] + 0.3, a) * (1 - span(T.into[0], T.into[1], a)) : 0
    sprigGlow.material.opacity = leaf * (0.75 + 0.25 * Math.sin(clock * 6))
    const raise = on ? span(T.raise[0], T.raise[1], a) * (1 - span(T.lower[0], T.lower[1], a)) : 0
    const nibble = on && a > T.eat[0] && a < T.eat[1] ? Math.sin((a - T.eat[0]) * 18) * 0.04 : 0
    deer.setPose(raise)
    deer.mouth.parent.rotation.x += nibble
    if (!on || raise < 0.01) {
      // grazing: the head bobs a little
      deer.mouth.parent.rotation.x += Math.sin(clock * 1.7) * 0.05
    }
    bite.visible = on && a > T.into[0] && a < T.into[1] + 0.3
    if (bite.visible) {
      const k = span(T.into[0], T.into[1], a)
      deer.mouth.getWorldPosition(tmp)
      const inBody = deer.group.localToWorld(tmp2.set(0, 1.0, 0.1))
      bite.position.copy(SPRIG).lerp(tmp, Math.min(1, k * 2)).lerp(inBody, Math.max(0, k * 2 - 1))
      bite.material.opacity = 1 - span(T.into[1], T.into[1] + 0.3, a)
    }
    const eaten = Math.min(5, S.n - (on && a < T.into[1] ? 1 : 0))
    deerDots.forEach((d, i) => {
      d.visible = i < eaten
      d.material.opacity = 0.55 + 0.3 * Math.sin(clock * 2 + i)
    })
  })

  // ================= dig and date: steps =================
  const F = FINDS.map(() => 0) // 0 in the soil, 1 dug (on its way or waiting on the tray), 2 dated
  const digStart = FINDS.map(() => -99)
  const L = { act: null, shown: -1, rings: 0, ringsAt: -99, n: 0, resets: 0, resetAt: -99 }
  const idx = id => FINDS.findIndex(f => f.id === id)
  const onTray = i => F[i] >= 1 && clock - digStart[i] >= DIG_T
  const digPanel = lv => ({
    title: E.dig.title,
    color: DIG_C,
    blocks: [
      ...paras(E.dig.panel[depth(lv)]),
      { buttons: FINDS.map(f => ({ label: E.dig.buttons[f.id], onClick: () => digStep(f.id) })) },
      { buttons: [{ label: E.dig.buttons.again, onClick: () => digStep('shovel') }] },
    ],
  })
  const pctOf = (f, lv) => (lv === 'scientist' ? num(f * 100, f < 0.1 ? 2 : 1, lang) : f < 0.1 ? num(f * 100, 1, lang) : String(Math.round(f * 100)))
  const labPanel = lv => {
    const dated = FINDS.filter((f, i) => F[i] === 2)
    return {
      title: E.lab.title,
      color: LAB_C,
      blocks: [
        ...paras(E.lab.panel[depth(lv)]),
        { buttons: [{ label: E.lab.buttons.date, onClick: () => labStep('machine') }, { label: E.lab.buttons.rings, onClick: () => labStep('rings') }] },
        ...(dated.length
          ? [{ h: E.lab.found }, { rows: dated.map(f => [E.dig.finds[f.id].name, `${pctOf(f.f, lv)}%, ${lv === 'scientist' ? fill(E.lab.screen.years.sci, { age: yrs(f.age), err: f.err }) : fill(E.lab.screen.years.kid, { age: yrs(f.age) })}`]) }]
          : []),
      ],
    }
  }
  function digStep(id) {
    const lv = level()
    if (id === 'shovel') {
      FINDS.forEach((_, i) => {
        F[i] = 0
        digStart[i] = -99
      })
      L.act = null
      L.shown = -1
      L.resets++
      L.resetAt = clock
      play('part')
      say(at(E.dig.says.again, lv), DIG_C)
      share('dig')
      afterDig()
      return
    }
    const i = idx(id)
    if (i < 0 || F[i] !== 0) return
    F[i] = 1
    digStart[i] = clock
    L.n++
    play('tap')
    later(0.25, () => play('part'))
    say(at(E.dig.says[id], lv), DIG_C)
    share('dig')
    findOnce('dig', digPanel, DIG_T + 0.6)
    afterDig()
  }
  function labStep(id) {
    const lv = level()
    if (id === 'rings') {
      L.rings++
      L.ringsAt = clock
      play('select')
      say(at(E.lab.says.rings, lv), LAB_C)
      share('dig')
      return
    }
    if (L.act) return say(at(W.busy, lv))
    let i = id === 'machine' ? F.findIndex((s, j) => s === 1 && onTray(j)) : idx(id)
    if (i < 0) {
      if (F.some((s, j) => s === 1 && !onTray(j))) return say(at(W.busy, lv))
      return say(at(E.lab.says.nothing, lv), LAB_C)
    }
    if (F[i] === 2) {
      // a dated find tapped again: its result on the screen once more
      L.shown = i
      showScreen()
      say(at(E.lab.says[FINDS[i].id], lv), LAB_C)
      return
    }
    if (!onTray(i)) return say(at(W.busy, lv))
    L.act = { find: i, start: clock, mine: true }
    L.n++
    play('beam')
    say(at(E.lab.says.counting, lv), LAB_C)
    share('dig')
  }
  function afterDig() {
    drawCurve()
    showScreen()
    refresh(digPanel)
    refresh(labPanel)
  }
  ex.add({
    id: 'dig',
    x: (TR.x0 + TR.x1) / 2,
    z: TR.z1 + 1.25,
    radius: 2.4,
    label: E.dig.label,
    verb: () => {
      const H = E.dig.hints
      if (!F.includes(0)) return H.done
      if (F.includes(1)) return H.lab
      return F.every(s => s === 0) ? H.tap : H.more
    },
    manual: true,
    focus: view((TR.x0 + TR.x1) / 2, -0.35, FIND_Z, 5.4, 4.4),
    act: () => ctx.showPanel(digPanel),
  })
  ex.add({
    id: 'lab',
    x: TX,
    z: TENT.z1 + 0.6,
    radius: 1.9,
    label: E.lab.label,
    verb: () => {
      const H = E.lab.hints
      if (L.act) return H.counting
      if (F.includes(1)) return H.date
      if (F.includes(2) && !L.rings) return H.rings
      if (F.includes(0)) return H.none
      return H.done
    },
    manual: true,
    screens: [labScreen],
    focus: view(TX, 1.35, TENT.z0 + 0.4, 3.3, 2.9),
    act: () => ctx.showPanel(labPanel),
  })
  findObjs.forEach(fo => clickable(fo.group, () => (F[fo.k] === 0 ? digStep(fo.id) : labStep(fo.id)), { when: () => F[fo.k] === 0 || onTray(fo.k) }))
  clickable(shovel, () => digStep('shovel'), { reach: 6 })
  clickable(machine, () => labStep('machine'))
  clickable(labScreen.group, () => labStep('machine'))
  clickable(sliceGroup, () => labStep('rings'))

  // the screen: what it shows (ready, counting, a result), at the reader's depth
  let screenKey = ''
  function showScreen(count = null) {
    const lv = level()
    let title = E.lab.screen.title
    let line = E.lab.screen.ready
    let bar = -1
    if (L.act) {
      const f = FINDS[L.act.find]
      title = E.dig.finds[f.id].name
      line = `${E.lab.screen.counting}\n${count ?? ''}`
      bar = count == null ? 0 : -2
    } else if (L.shown >= 0) {
      const f = FINDS[L.shown]
      title = E.dig.finds[f.id].name
      const d = depth(lv)
      line = `${fill(E.lab.screen.left[d], { pct: pctOf(f.f, lv) })}\n${fill(E.lab.screen.years[d], { age: yrs(f.age), err: f.err })}`
      bar = f.f
    }
    const key = `${title}|${line}|${bar}`
    if (key === screenKey) return
    screenKey = key
    labScreen.set({ title, line })
    barBack.visible = bar !== -1
    barFill.visible = bar >= 0 || bar === -2
    if (bar >= 0) barFill.scale.x = Math.max(0.002, bar)
  }
  // the board's curve: the share left against time, the half-lives, the dated finds on it
  function drawCurve() {
    curveTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#ffd98a'
      g.font = '700 46px Outfit'
      g.textAlign = 'left'
      g.textBaseline = 'top'
      g.fillText(E.lab.board.title, 36, 26)
      const X0 = 120
      const X1 = w - 50
      const Y0 = 120
      const Y1 = h - 80
      const xOf = t => X0 + ((X1 - X0) * t) / 40000
      const yOf = f => Y1 - (Y1 - Y0) * f
      g.font = '500 24px Outfit'
      g.fillStyle = '#9fb0e6'
      g.strokeStyle = 'rgba(160,176,230,0.25)'
      g.lineWidth = 2
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        g.beginPath()
        g.moveTo(X0, yOf(f))
        g.lineTo(X1, yOf(f))
        g.stroke()
        g.textAlign = 'right'
        g.textBaseline = 'middle'
        g.fillText(`${Math.round(f * 100)}%`, X0 - 12, yOf(f))
      }
      g.textAlign = 'center'
      g.textBaseline = 'top'
      for (let t = 0; t <= 40000; t += 10000) g.fillText(yrs(t), xOf(t), Y1 + 12)
      g.textAlign = 'right'
      g.fillText(E.lab.board.years, X1, Y1 + 42)
      g.textAlign = 'left'
      g.fillText(E.lab.board.left, X0 + 10, Y0 - 34)
      // the half-lives
      g.setLineDash([8, 8])
      g.strokeStyle = 'rgba(255,217,138,0.45)'
      for (let k = 1; k <= 6; k++) {
        g.beginPath()
        g.moveTo(xOf(k * HALF), Y1)
        g.lineTo(xOf(k * HALF), yOf(Math.pow(0.5, k)))
        g.stroke()
      }
      g.setLineDash([])
      g.fillStyle = '#ffd98a'
      g.textAlign = 'center'
      g.font = '500 22px Outfit'
      g.textAlign = 'left'
      g.fillText(E.lab.board.half, xOf(HALF) + 8, Y1 - 16)
      // the curve
      g.strokeStyle = '#ffd98a'
      g.lineWidth = 5
      g.beginPath()
      for (let t = 0; t <= 40000; t += 250) {
        const x = xOf(t)
        const y = yOf(Math.pow(0.5, t / HALF))
        if (t) g.lineTo(x, y)
        else g.moveTo(x, y)
      }
      g.stroke()
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(xOf(0), yOf(1), 9, 0, TAU)
      g.fill()
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.font = '700 24px Outfit'
      g.fillText(E.lab.board.alive, xOf(0) + 16, yOf(1) + 4)
      // the dated finds
      FINDS.forEach((f, i) => {
        if (F[i] !== 2) return
        const x = xOf(f.age)
        const y = yOf(f.f)
        g.fillStyle = '#3fe6b4'
        g.beginPath()
        g.arc(x, y, 12, 0, TAU)
        g.fill()
        // its name and age above and to the right of it (clear of the curve and the axis)
        g.fillStyle = '#ffffff'
        g.font = '700 25px Outfit'
        g.textAlign = 'left'
        g.textBaseline = 'bottom'
        const lx = Math.min(x + 14, X1 - 150)
        g.fillText(E.dig.finds[f.id].short, lx, y - 34)
        g.font = '500 21px Outfit'
        g.fillStyle = '#bff7e6'
        g.fillText(yrs(f.age), lx, y - 12)
      })
    })
  }
  drawCurve()
  showScreen()

  // the finds moving: up out of the soil, across to the tray, into the machine and back
  const ARC_UP = 3.2
  const findPose = (fo, out) => {
    const i = fo.k
    const tray = slotAt(i)
    if (F[i] === 0) {
      const r = span(0, 0.6, clock - L.resetAt)
      out.pos.copy(fo.home)
      out.pos.y -= 0.18 * (1 - r)
      out.scale = 1
      out.spin = 0
      return
    }
    const a = clock - digStart[i]
    const lifted = V3(fo.home.x, 1.1, fo.home.z)
    if (a < 1.0) {
      out.pos.copy(fo.home).lerp(lifted, ease(a / 1.0))
      out.scale = 1
      out.spin = a * 2
    } else if (a < 1.4) {
      out.pos.copy(lifted)
      out.scale = 1
      out.spin = a * 2
    } else if (a < DIG_T) {
      const k = ease((a - 1.4) / (DIG_T - 1.4))
      out.pos.copy(lifted).lerp(tray, k)
      out.pos.y += Math.sin(Math.PI * k) * ARC_UP
      out.scale = lerp(1, fo.trayScale, k)
      out.spin = a * 2
    } else {
      out.pos.copy(tray)
      out.scale = fo.trayScale
      out.spin = 0
    }
    // in and out of the machine
    if (L.act && L.act.find === i) {
      const b = clock - L.act.start
      const portW = machine.localToWorld(port.clone())
      if (b < 0.8) {
        const k = ease(b / 0.8)
        out.pos.lerp(portW, k)
        out.pos.y += Math.sin(Math.PI * k) * 0.25
        out.scale = lerp(fo.trayScale, 0.12, k)
      } else if (b < DATE_T - 0.6) {
        out.pos.copy(portW)
        out.scale = 0
      } else {
        const k = ease((b - (DATE_T - 0.6)) / 0.6)
        out.pos.copy(portW).lerp(tray, k)
        out.pos.y += Math.sin(Math.PI * k) * 0.25
        out.scale = lerp(0.12, fo.trayScale, k)
      }
    }
  }
  const pose = { pos: V3(0, 0, 0), scale: 1, spin: 0 }
  let lastLevel = level()
  updates.push(dt => {
    // the dating: count, then the result
    if (L.act) {
      const b = clock - L.act.start
      const f = FINDS[L.act.find]
      const k = span(0.9, DATE_T - 0.9, b)
      showScreen(`${pctOf(f.f * k, 'explorer')}%`)
      barFill.scale.x = Math.max(0.002, f.f * k)
      portGlow.emissiveIntensity = 0.1 + 1.4 * (b > 0.6 && b < DATE_T - 0.5 ? 1 : 0)
      beamDots.visible = b > 0.8 && b < DATE_T - 0.6
      if (beamDots.visible) {
        for (let j = 0; j < 10; j++) {
          const ang = b * 9 + (j / 10) * TAU
          dummy.position.set(Math.cos(ang) * ringR, 0, Math.sin(ang) * ringR)
          dummy.scale.setScalar(j % 3 === 0 ? 1.4 : 0.8)
          dummy.updateMatrix()
          beamDots.setMatrixAt(j, dummy.matrix)
        }
        beamDots.instanceMatrix.needsUpdate = true
      }
      if (b >= DATE_T) {
        const i = L.act.find
        const mine = L.act.mine
        F[i] = 2
        L.shown = i
        L.act = null
        portGlow.emissiveIntensity = 0.1
        beamDots.visible = false
        if (mine) {
          play('select')
          say(at(E.lab.says[f.id], level()), LAB_C)
          findOnce('lab', labPanel, 2.5)
        }
        afterDig()
      }
    } else {
      beamDots.visible = false
    }
    if (level() !== lastLevel) {
      lastLevel = level()
      showScreen()
    }
    // the finds, their hollows and tags
    findObjs.forEach(fo => {
      findPose(fo, pose)
      fo.group.position.copy(pose.pos)
      fo.group.scale.setScalar(Math.max(0.001, pose.scale))
      fo.group.visible = pose.scale > 0.01
      fo.inner.rotation.y = pose.spin
      fo.hollow.visible = F[fo.k] >= 1
      tags[fo.k].visible = F[fo.k] === 2
    })
    // the soil thrown up
    let c = 0
    findObjs.forEach(fo => {
      const a = clock - digStart[fo.k]
      if (F[fo.k] === 0 || a > 0.9) return
      for (const s of clodSeeds) {
        const t = a
        dummy.position.set(fo.home.x + s.dx * s.v * 0.35 * t, -DEPTH(fo.k) + 0.03 + s.v * 1.6 * t - 4.9 * t * t, FIND_Z + s.dz * s.v * 0.35 * t)
        dummy.position.y = Math.max(-DEPTH(fo.k) + 0.02, dummy.position.y)
        dummy.scale.setScalar(s.s)
        dummy.updateMatrix()
        clods.setMatrixAt(c++, dummy.matrix)
      }
    })
    clods.count = c
    clods.instanceMatrix.needsUpdate = true
    // the slice's rings lighting from the bark inward
    const rk = clock - L.ringsAt
    const face = sliceGroup.userData.face
    if (rk < 4) {
      slice.glow(span(0, 2.4, rk))
      face.emissiveIntensity = 2.2 * (1 - span(3, 4, rk))
    } else if (face.emissiveIntensity) face.emissiveIntensity = 0
  })

  // ================= the atom hourglass: steps =================
  const RATE = 2600 // years a second while time runs
  const T_END = 40000
  const MARKS = [HALF, 2 * HALF]
  const HOLD = 1.8 // a pause at one and at two half-lives, to read the count
  // the time shown: where the run started (t0), how long ago (start); the same on every screen
  const J = { seed: 7071, t0: 0, start: 0, t: 0, run: false, n: 0, hist: [], mine: false, saidStart: false }
  /** The time `age` seconds into a run from t0: RATE years a second, holding at each mark ahead. */
  const tAt = (t0, age) => {
    let t = t0
    let rem = Math.max(0, age)
    for (const m of MARKS) {
      if (m <= t0) continue
      const run = (m - t) / RATE
      if (rem < run) return t + rem * RATE
      t = m
      rem -= run
      if (rem < HOLD) return m
      rem -= HOLD
    }
    return Math.min(T_END, t + rem * RATE)
  }
  let lives = []
  let rank = []
  const p = new Float32Array(NJ) // each atom's fall, 0 in the top bulb to 1 in the bottom
  const flashAt = new Float32Array(NJ).fill(-99)
  const wasDecayed = new Uint8Array(NJ)
  const reseed = seed => {
    const r = random(seed)
    lives = Array.from({ length: NJ }, () => (-Math.log(1 - r()) * HALF) / Math.LN2)
    const order = lives.map((_, i) => i).sort((a, b) => lives[a] - lives[b])
    rank = new Array(NJ)
    order.forEach((i, k) => (rank[i] = k))
  }
  const leftAt = t => lives.reduce((n, l) => n + (l > t ? 1 : 0), 0)
  const snapAtoms = () => {
    for (let i = 0; i < NJ; i++) {
      const d = lives[i] <= J.t
      p[i] = d ? 1 : 0
      wasDecayed[i] = d ? 1 : 0
      flashAt[i] = -99
    }
  }
  reseed(J.seed)
  snapAtoms()
  const elec = []
  const jarPanel = lv => ({
    title: E.jar.title,
    color: JAR_C,
    blocks: [
      ...paras(E.jar.panel[depth(lv)]),
      {
        slider: {
          label: E.jar.slider,
          min: 0,
          max: T_END / 1000,
          step: 0.1,
          value: J.t / 1000,
          onInput: v => setTime(v * 1000, false),
          format: v => `${num(v, 1, lang)} ${E.jar.kyears}`,
          live: () => J.t / 1000,
        },
      },
      {
        buttons: [
          { label: J.run ? E.jar.buttons.stop : E.jar.buttons.run, onClick: () => jarStep('glass') },
          {
            label: E.jar.buttons.half,
            onClick: () => {
              setTime(HALF, true)
              J.mine = true
              mark(HALF)
            },
          },
          { label: E.jar.buttons.again, onClick: () => jarStep('lever') },
        ],
      },
    ],
  })
  // the slider moves many times a second: the others get it a few times a second, and where it stopped
  let jarSend = null
  const sendJarSoon = () => {
    if (jarSend) return
    jarSend = setTimeout(() => {
      jarSend = null
      share('jar')
    }, 160)
  }
  function setTime(t, now) {
    J.t = J.t0 = clamp(t, 0, T_END)
    J.run = false
    if (now) share('jar')
    else sendJarSoon()
    findOnce('jar', jarPanel, 0.5)
    refresh(jarPanel)
  }
  let leverAt = -99
  function jarStep(id) {
    const lv = level()
    if (id === 'lever') {
      J.hist = [...J.hist, leftAt(HALF)].slice(-4)
      J.seed = 1 + Math.floor(Math.random() * 2147483000)
      reseed(J.seed)
      J.t = J.t0 = 0
      snapAtoms()
      J.run = true
      J.start = clock
      J.n++
      J.mine = true
      leverAt = clock
      play('part')
      say(at(E.jar.says.again, lv), JAR_C)
    } else {
      if (J.t >= T_END) {
        J.t = 0
        snapAtoms()
        J.run = true
      } else J.run = !J.run
      // a run starts (or stops) where the time stands now
      J.t0 = J.t
      J.start = clock
      J.mine = true
      play('tap')
      if (J.run && !J.saidStart) {
        J.saidStart = true
        say(at(E.jar.says.start, lv), JAR_C)
      }
    }
    share('jar')
    findOnce('jar', jarPanel, 3.5)
    refresh(jarPanel)
  }
  const mark = m => {
    if (!J.mine) return
    const lv = level()
    const n = leftAt(m)
    if (m === HALF) {
      const prev = J.hist[J.hist.length - 1]
      say(prev != null ? at(E.jar.says.compare, lv)(n, prev) : at(E.jar.says.half, lv)(n), JAR_C)
    } else if (m === 2 * HALF) say(at(E.jar.says.quarter, lv)(n), JAR_C)
    else say(at(E.jar.says.end, lv)(n), JAR_C)
    play('beep')
  }
  ex.add({
    id: 'jar',
    x: JAR.x,
    z: JAR.z + 2.0,
    radius: 1.9,
    label: E.jar.label,
    verb: () => (J.run ? E.jar.hints.stop : J.t >= T_END ? E.jar.hints.again : E.jar.hints.run),
    manual: true,
    focus: view(JAR.x + 0.6, 1.05, JAR.z + 0.1, 2.6, 2.1),
    act: () => ctx.showPanel(jarPanel),
  })
  clickable(glassGroup, () => jarStep('glass'))
  clickable(lever, () => jarStep('lever'))

  let boardKey = ''
  let boardAt = 0
  function drawJarBoard() {
    const tShow = Math.round(J.t / 10) * 10
    const left = leftAt(J.t)
    const runs = [...J.hist, ...(J.t >= HALF ? [leftAt(HALF)] : [])].slice(-5)
    const key = `${tShow}|${left}|${runs.join(',')}`
    if (key === boardKey || clock - boardAt < 0.08) return
    boardKey = key
    boardAt = clock
    jarTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      g.fillStyle = '#ffffff'
      g.font = '700 58px Outfit'
      g.fillText(`${yrs(tShow)} ${E.jar.board.years}`, 30, 78)
      g.font = '700 32px Outfit'
      g.fillStyle = '#3fe6b4'
      g.beginPath()
      g.arc(42, 122, 12, 0, TAU)
      g.fill()
      g.fillText(`${E.jar.board.c14}: ${left}`, 64, 134)
      g.fillStyle = '#7fa2f0'
      g.beginPath()
      g.arc(42, 168, 12, 0, TAU)
      g.fill()
      g.fillText(`${E.jar.board.n14}: ${NJ - left}`, 64, 180)
      // the count against time: the smooth half-life curve, the atoms' own steps
      const X0 = 40
      const X1 = w - 30
      const Y0 = 220
      const Y1 = h - 70
      const xOf = t => X0 + ((X1 - X0) * t) / T_END
      const yOf = n => Y1 - ((Y1 - Y0) * n) / NJ
      g.strokeStyle = 'rgba(160,176,230,0.3)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(X0, Y0)
      g.lineTo(X0, Y1)
      g.lineTo(X1, Y1)
      g.stroke()
      g.setLineDash([6, 6])
      g.strokeStyle = 'rgba(255,217,138,0.7)'
      g.beginPath()
      for (let t = 0; t <= T_END; t += 400) {
        const y = yOf(NJ * Math.pow(0.5, t / HALF))
        if (t) g.lineTo(xOf(t), y)
        else g.moveTo(xOf(t), y)
      }
      g.stroke()
      g.setLineDash([])
      const sorted = [...lives].sort((a, b) => a - b)
      g.strokeStyle = '#3fe6b4'
      g.lineWidth = 4
      g.beginPath()
      g.moveTo(xOf(0), yOf(NJ))
      let n = NJ
      for (const l of sorted) {
        if (l > J.t) break
        g.lineTo(xOf(l), yOf(n))
        n--
        g.lineTo(xOf(l), yOf(n))
      }
      g.lineTo(xOf(J.t), yOf(n))
      g.stroke()
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(xOf(J.t), yOf(n), 7, 0, TAU)
      g.fill()
      // the half-life mark and the counts there, run after run
      g.strokeStyle = 'rgba(255,217,138,0.5)'
      g.beginPath()
      g.moveTo(xOf(HALF), Y0)
      g.lineTo(xOf(HALF), Y1)
      g.stroke()
      g.font = '500 26px Outfit'
      g.fillStyle = '#ffd98a'
      g.fillText(`${E.jar.board.runs}: ${runs.length ? runs.join('  ·  ') : '...'}`, 30, h - 24)
    })
  }

  const col = new THREE.Color()
  updates.push(dt => {
    // time running, holding a moment at one and two half-lives
    if (J.run) {
      const before = J.t
      J.t = tAt(J.t0, clock - J.start)
      for (const m of MARKS) if (before < m && J.t >= m) mark(m)
      if (J.t >= T_END) {
        J.run = false
        J.t = J.t0 = T_END
        mark(T_END)
        refresh(jarPanel)
      }
    }
    // each atom: decayed or not at this time; a decay flashes, throws an electron and falls through the neck
    let spawned = 0
    for (let i = 0; i < NJ; i++) {
      const d = lives[i] <= J.t
      if (d && !wasDecayed[i]) {
        flashAt[i] = clock
        if (spawned < 4 && elec.length < EL) {
          spawned++
          const a = Math.random() * TAU
          const up = 0.2 + Math.random() * 0.8
          elec.push({ pos: topSlots[i].clone(), vel: V3(Math.cos(a) * (1 - up * 0.5), up, Math.sin(a) * (1 - up * 0.5)).multiplyScalar(1.6), age: 0 })
          if (spawned === 1) play('electron')
        }
      }
      wasDecayed[i] = d ? 1 : 0
      const target = d ? 1 : 0
      p[i] = target > p[i] ? Math.min(1, p[i] + dt * 1.6) : Math.max(0, p[i] - dt * 1.6)
      const top = topSlots[i]
      const bot = botSlots[rank[i]]
      if (p[i] <= 0) dummy.position.copy(top)
      else if (p[i] >= 1) dummy.position.copy(bot)
      else if (p[i] < 0.5) dummy.position.copy(top).lerp(tmp.set(0, 0.02, 0), ease(p[i] / 0.5))
      else {
        const k = (p[i] - 0.5) / 0.5
        dummy.position.set(0, -0.02, 0).lerp(bot, k * k)
      }
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      atoms.setMatrixAt(i, dummy.matrix)
      const fl = Math.exp(-(clock - flashAt[i]) * 5)
      if (d) tmp.set(NITRO.r, NITRO.g, NITRO.b).multiplyScalar(0.9).lerp(tmp2.set(3, 3, 3), fl)
      else tmp.set(TEAL.r, TEAL.g, TEAL.b).multiplyScalar(1.7 + 0.25 * Math.sin(clock * 3 + i))
      atoms.setColorAt(i, col.setRGB(tmp.x, tmp.y, tmp.z))
    }
    atoms.instanceMatrix.needsUpdate = true
    if (atoms.instanceColor) atoms.instanceColor.needsUpdate = true
    // the electrons flying off
    for (let i = elec.length - 1; i >= 0; i--) {
      const e = elec[i]
      e.age += dt
      e.pos.addScaledVector(e.vel, dt)
      if (e.age > 0.8) elec.splice(i, 1)
    }
    electrons.count = elec.length
    elec.forEach((e, i) => {
      dummy.position.copy(e.pos)
      dummy.scale.set(1, 1, 1).multiplyScalar(1 - e.age / 0.9)
      dummy.updateMatrix()
      electrons.setMatrixAt(i, dummy.matrix)
    })
    electrons.instanceMatrix.needsUpdate = true
    // the lever
    const la = clock - leverAt
    leverArm.rotation.x = la < 0.8 ? Math.sin((la / 0.8) * Math.PI) * 1.0 : 0
    drawJarBoard()
  })

  updates.push((dt, t) => {
    stage.update(t)
    tree.update(t)
    FADE.uFadeRadius.value = 0
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 9.2 },
    cameraPitchMax: 0.5,
    spawn: { x: 0, z: 6.2, yaw: 0 },
    hostSpot: { x: 1.8, z: 4.9, yaw: Math.atan2(1.8, -1.3) },
    back: { x: 0, z: 9.8, rot: Math.PI },
    stand: { x: -2.3, z: 4.6, rot: Math.atan2(2.3, 1.6) },
    parts: {
      sky: {
        tap: () => skyStep(),
        get busy() {
          return skyBusy()
        },
        get n() {
          return S.n
        },
        at: () => P.clone(),
        postAt: () => post.localToWorld(V3(0, 1.05, 0.15)),
      },
      dig: {
        tap: id => digStep(id), // 'linen' | 'bowl' | 'bone' | 'hearth' (the finds), 'shovel' (a new dig)
        get state() {
          return digState()
        },
        at: id => (id === 'shovel' ? shovel.localToWorld(V3(0, 0.6, 0)) : findObjs[idx(id)].group.localToWorld(V3(0, 0.05, 0))),
      },
      lab: {
        tap: id => labStep(id), // 'machine', 'rings' (the tree slice), or a find's id (on the tray)
        get state() {
          return digState()
        },
        at: id => (id === 'rings' ? sliceGroup.localToWorld(V3(0, 0, 0)) : machine.localToWorld(V3(0, 0.3, 0))),
      },
      jar: {
        tap: id => jarStep(id), // 'glass' (run or stop time), 'lever' (128 new atoms)
        slide: kyears => setTime(kyears * 1000, true),
        get state() {
          return jarState()
        },
        get left() {
          return leftAt(J.t)
        },
        at: id => (id === 'lever' ? lever.localToWorld(V3(0, 0.3, 0)) : glassGroup.localToWorld(V3(0, 0.2, 0.2))),
      },
      rayTo: q => new THREE.Ray(ctx.camera.position.clone(), q.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { sky: skyPanel, dig: digPanel, lab: labPanel, jar: jarPanel },
    shared: {
      sky: {
        get: () => ({ n: S.n, age: Math.min(30, r1(skyAge())), at: [r1(P.x), r1(P.y), r1(P.z)] }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 99)
          const fresh = n !== S.n
          S.n = n
          // where it struck (checked: it comes from another device)
          const q = Array.isArray(s?.at) ? s.at.map(Number) : []
          if (q.length === 3 && q.every(Number.isFinite)) aimSky(V3(clamp(q[0], -40, 40), clamp(q[1], 4, 20), clamp(q[2], -40, 40)))
          if (!n) S.start = clock - 99
          // what unfolds runs on by its age (a newcomer sees it where it is, silently)
          else startSky(age, !!live && fresh, false)
        },
      },
      dig: { get: () => digState(), set: (s, live, ago = 0) => digSet(s, live, ago) },
      jar: { get: () => jarState(), set: (s, live, ago = 0) => jarSet(s, live, ago) },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (jarSend) clearTimeout(jarSend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }

  function digState() {
    return {
      st: [...F],
      dug: F.map((s, i) => (s ? Math.min(30, r1(clock - digStart[i])) : -1)),
      act: L.act ? { find: L.act.find, age: Math.min(30, r1(clock - L.act.start)) } : null,
      shown: L.shown,
      rings: L.rings,
      n: L.n,
      resets: L.resets,
    }
  }
  function digSet(s, live, ago) {
    const a0 = Math.max(0, Number(ago) || 0)
    const resets = Math.max(0, Math.round(Number(s?.resets) || 0))
    if (resets !== L.resets) L.resetAt = live ? clock : clock - 9
    L.resets = resets
    const st = Array.isArray(s?.st) ? s.st : []
    const dug = Array.isArray(s?.dug) ? s.dug : []
    FINDS.forEach((_, i) => {
      const v = [0, 1, 2].includes(st[i]) ? st[i] : 0
      if (v >= 1 && (F[i] === 0 || !live)) digStart[i] = clock - clamp((Number(dug[i]) || 0) + a0, 0, 99)
      if (v === 0) digStart[i] = -99
      F[i] = v
    })
    const act = s?.act
    const fi = Math.round(Number(act?.find))
    if (act && fi >= 0 && fi < FINDS.length && F[fi] >= 1) {
      const age = clamp((Number(act.age) || 0) + a0, 0, 99)
      if (age < DATE_T) {
        if (live && !L.act) play('beam')
        L.act = { find: fi, start: clock - age, mine: false }
      } else {
        F[fi] = 2
        L.act = null
      }
    } else L.act = null
    const shown = Math.round(Number(s?.shown))
    L.shown = shown >= 0 && shown < FINDS.length && F[shown] === 2 ? shown : -1
    const rings = Math.max(0, Math.round(Number(s?.rings) || 0))
    if (rings > L.rings && live) L.ringsAt = clock
    L.rings = rings
    L.n = Math.max(0, Math.round(Number(s?.n) || 0))
    afterDig()
  }
  function jarState() {
    return { seed: J.seed, t0: Math.round(J.t0), run: J.run, age: J.run ? Math.min(30, r1(clock - J.start)) : 0, hist: [...J.hist], n: J.n }
  }
  function jarSet(s, live, ago) {
    const seed = Math.round(Number(s?.seed))
    const changed = Number.isFinite(seed) && seed > 0 && seed !== J.seed
    if (changed) {
      J.seed = seed
      reseed(seed)
    }
    const run = !!s?.run
    const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 99)
    J.t0 = clamp(Number(s?.t0) || 0, 0, T_END)
    J.start = clock - age
    J.run = run && J.t0 < T_END
    // (a run already over here ends in the next frame, as it did there)
    J.t = J.run ? Math.min(tAt(J.t0, age), T_END - 1) : J.t0
    J.hist = (Array.isArray(s?.hist) ? s.hist : []).map(v => clamp(Math.round(Number(v) || 0), 0, NJ)).slice(-4)
    J.n = Math.max(0, Math.round(Number(s?.n) || 0))
    J.mine = false
    if (changed && live) {
      // new atoms: all back in the top bulb at once, then they go as time runs
      for (let i = 0; i < NJ; i++) {
        p[i] = 0
        wasDecayed[i] = 0
      }
      leverAt = clock
    } else if (!live) snapAtoms()
    refresh(jarPanel)
  }
}
