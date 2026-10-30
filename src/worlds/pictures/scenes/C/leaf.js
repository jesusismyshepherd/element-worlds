// Carbon's picture "Plants eat air!" as a room (docs/knowledge/picture-rooms.md): shrunk smaller than a
// leaf's cells, standing inside a leaf, in the air spaces of its spongy layer on the inside of its lower
// skin (stages/leaf.js): the palisade cells overhead glowing with chloroplasts as the sun shines through,
// spongy cells round about, a vein at the back. Three things to do, each step chosen by tapping its thing
// (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E
// opens the station's panel, whose buttons and sliders do the same:
// - van Helmont's willow (his account, published in 1648): a five-pound willow cutting in a pot of 200
//   pounds of oven-dried soil. Tap the watering can for each year (or slide the years; leaves fall in four
//   autumns and lie unweighed on the deck), tap the willow after five to weigh it and the soil (169 pounds
//   3 ounces; the soil about 2 ounces lighter), tap the scale to see what the willow is made of and where
//   each part came from (about half water; the dry wood almost all carbon and oxygen from the air's carbon
//   dioxide), tap the pot to start again;
// - the stoma: a pore in the leaf's underside between two guard cells. Tap it to open or close it; open,
//   carbon dioxide drifts in and water vapour out, the more the drier the air outside (a slider and a dry
//   day button); the leaf's water gauge falls, and when it runs low the guard cells go limp and the door
//   shuts by itself;
// - the carbon catcher: a chloroplast cut open, its grana glowing in a sunbeam, and RuBisCO, the enzyme
//   that catches carbon dioxide, drawn far bigger than it is. Tap a CO2 molecule (or RuBisCO): it is
//   caught and its carbon joins the sugar being built; six make one glucose, which goes into the starch
//   grain. The light on the grana powers it (a sunlight slider, or tap the sunbeam): in the dark it stalls.
//   The CO2 comes in through the stoma: with the stoma shut, no more comes.
// Not the life wing's breathing tree (wings/carbon/life.js): here, where a tree's carbon comes from and
// how a leaf catches it. All shared in a room (src/net/shared.js); the words, panels and discoveries stay
// each one's. parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill, num, standingScreen } from '../../../wings/noble/kit.js'
import { leafStage, lumpyGeometry, chloroTexture } from '../../stages/leaf.js'
import { softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { glucose } from '../../../wings/carbon/structures.js'
import { LEAF_WORDS } from './leaf.words.js'

export const WORDS = LEAF_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const WILLOW_C = '#e8c46a'
const STOMA_C = '#7fd0ff'
const CATCH_C = '#8be37a'
// the game's atom colours (CPK, as chem/ballAndStick.js): carbon dark grey, oxygen red, hydrogen white
const ATOM = { C: '#42464e', O: '#f2302b', H: '#f4f6fb' }

// where things stand: the stations in a ring round the spawn, the catcher straight ahead in its sunbeam
const SPAWN = { x: 0, z: 5.6 }
const ST = {
  willow: { x: 5.8, z: -0.8, stand: { x: 3.5, z: 0.0 } },
  stoma: { x: -5.7, z: -0.7, stand: { x: -3.5, z: -0.3 } },
  catcher: { x: 0.6, z: -6.6, stand: { x: 0.6, z: -2.5 } },
}
for (const s of Object.values(ST)) s.rot = Math.atan2(s.stand.x - s.x, s.stand.z - s.z)

/** A group standing at a station, its +z toward where the visitor stands, +x to the visitor's right. */
function rigAt(s) {
  const g = new THREE.Group()
  g.position.set(s.x, 0, s.z)
  g.rotation.y = s.rot
  // (the room's root stands at the origin: the rig's own matrix is its place in the world)
  g.updateMatrixWorld(true)
  return g
}

/** Words drawn in 3D, with a dark edge so they read against the glowing leaf. */
const label = (text, size, color = '#ffffff', opts = {}) => makeText(text, { size, color, outlineWidth: size * 0.12, outlineColor: '#10240f', ...opts })

// ---- molecules: a few balls, the game's colours ----

function atomMats() {
  const m = el => new THREE.MeshStandardMaterial({ color: ATOM[el], roughness: 0.35, emissive: ATOM[el], emissiveIntensity: el === 'C' ? 0.12 : el === 'O' ? 0.22 : 0.1 })
  return { C: m('C'), O: m('O'), H: m('H') }
}

/** CO2 as three balls along x (carbon in the middle), and an invisible ball round it to tap. */
function co2Group(A, ball, s = 1) {
  const g = new THREE.Group()
  const c = new THREE.Mesh(ball, A.C)
  c.scale.setScalar(0.13 * s)
  g.add(c)
  for (const k of [-1, 1]) {
    const o = new THREE.Mesh(ball, A.O)
    o.scale.setScalar(0.12 * s)
    o.position.x = k * 0.22 * s
    g.add(o)
  }
  const hit = new THREE.Mesh(ball, new THREE.MeshBasicMaterial({ visible: false }))
  hit.scale.setScalar(0.34 * s)
  g.add(hit)
  return g
}

// ---- the willow: a trunk, branches that arch out and weep, narrow leaves ----

function leafShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.quadraticCurveTo(0.018, 0.05, 0, 0.13)
  s.quadraticCurveTo(-0.018, 0.05, 0, 0)
  return new THREE.ShapeGeometry(s, 4)
}

function willowTree(M, rnd) {
  const group = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.07, 1.25, 10).translate(0, 0.625, 0), M.bark)
  group.add(trunk)
  // the roots, shown when the willow is lifted out of its pot
  const roots = new THREE.Group()
  const ballM = new THREE.Mesh(lumpyGeometry(31, { detail: 16 }), M.roots)
  ballM.scale.set(0.28, 0.17, 0.28)
  ballM.position.y = -0.14
  roots.add(ballM)
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + rnd() * 0.5
    const curve = new THREE.QuadraticBezierCurve3(V3(0, -0.05, 0), V3(Math.cos(a) * 0.22, -0.1, Math.sin(a) * 0.22), V3(Math.cos(a) * 0.36, -0.3 - rnd() * 0.12, Math.sin(a) * 0.36))
    roots.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.016, 5), M.roots))
  }
  roots.visible = false
  group.add(roots)
  const branches = []
  const NB = 11
  for (let i = 0; i < NB; i++) {
    const a = (i / NB) * TAU + rnd() * 0.4
    const y0 = i === 0 ? 1.2 : 0.72 + rnd() * 0.5
    const out = 0.45 + rnd() * 0.32
    const p0 = V3(0, y0, 0)
    const curve = new THREE.CubicBezierCurve3(
      p0,
      V3(Math.cos(a) * out * 0.45, y0 + 0.32 + rnd() * 0.2, Math.sin(a) * out * 0.45),
      V3(Math.cos(a) * out, y0 + 0.16, Math.sin(a) * out),
      V3(Math.cos(a) * (out + 0.1), y0 - 0.42 - rnd() * 0.35, Math.sin(a) * (out + 0.1)),
    )
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.013, 5), M.bark)
    tube.position.copy(p0).negate()
    const pivot = new THREE.Group()
    pivot.position.copy(p0)
    pivot.add(tube)
    group.add(pivot)
    // when it sprouts (years); the first is the cutting's own top
    branches.push({ pivot, curve, p0, birth: i === 0 ? -1 : 0.15 + ((i - 1) / (NB - 1)) * 3.4 })
  }
  // leaves along every branch, hanging
  const leaves = []
  for (const [bi, b] of branches.entries()) {
    const n = bi === 0 ? 10 : 30
    for (let j = 0; j < n; j++) {
      const t = 0.25 + (j / n) * 0.75
      leaves.push({ b, t, spin: rnd() * TAU, tilt: 2.2 + rnd() * 0.6, s: 1.0 + rnd() * 0.5 })
    }
  }
  const leafMesh = new THREE.InstancedMesh(leafShape(), M.leaf, leaves.length)
  leafMesh.frustumCulled = false
  group.add(leafMesh)
  return { group, trunk, roots, branches, leaves, leafMesh }
}

// ---- RuBisCO: eight large parts in a ring, four small ones above and below, eight places to catch ----

function rubisco(M, geo) {
  const group = new THREE.Group()
  const spin = new THREE.Group()
  group.add(spin)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    const m = new THREE.Mesh(geo, i % 2 ? M.rbA : M.rbB)
    m.scale.set(0.2, 0.3, 0.17)
    m.position.set(Math.cos(a) * 0.29, 0, Math.sin(a) * 0.29)
    m.rotation.y = -a
    spin.add(m)
  }
  for (const y of [-0.36, 0.36]) {
    for (let j = 0; j < 4; j++) {
      const a = (j / 4) * TAU + Math.PI / 4
      const m = new THREE.Mesh(geo, M.rbS)
      m.scale.setScalar(0.13)
      m.position.set(Math.cos(a) * 0.17, y, Math.sin(a) * 0.17)
      spin.add(m)
    }
  }
  const sites = []
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * TAU
    const m = new THREE.Mesh(geo, M.site)
    m.scale.setScalar(0.055)
    m.position.set(Math.cos(a) * 0.4, 0.06, Math.sin(a) * 0.4)
    spin.add(m)
    sites.push({ a, m })
  }
  return { group, spin, sites }
}

// ---- the room ----

export async function build({ ctx, root, lang, E, W, ex, say, later, light, level, depth, clickable }) {
  const holeRx = 0.42
  const holeRz = 1.15
  const stage = leafStage({
    light,
    holes: [{ x: ST.stoma.x, z: ST.stoma.z, rx: holeRx, rz: holeRz, rot: ST.stoma.rot }],
    cells: [[-8.3, -5.0, 1.45], [7.7, -5.4, 1.35], [-8.4, 4.7, 1.25], [8.5, 4.5, 1.2]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  let clock = 0
  const rnd = random(77)
  const dummy = new THREE.Object3D()
  const paras = list => list.map(p => ({ p }))
  const lv = () => level()
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const ball = new THREE.SphereGeometry(1, 16, 12)
  const A = atomMats()
  const blob = lumpyGeometry(21, { detail: 18, bump: 1.4 })

  // ======== the sun over the leaf (shared by the whole room) ========
  const SUN = { k: 1, shown: 1, mine: false }
  let sunSend = null
  function setSun(v, now) {
    SUN.k = clamp(Number(v))
    SUN.mine = true
    if (now) return share('sun')
    if (!sunSend) {
      sunSend = setTimeout(() => {
        sunSend = null
        share('sun')
      }, 250)
    }
  }
  updates.push(dt => {
    SUN.shown = damp(SUN.shown, SUN.k, 2.4, dt)
    if (Math.abs(SUN.shown - SUN.k) < 0.002) SUN.shown = SUN.k
    stage.setSun(SUN.shown)
  })

  // ======== 1. van Helmont's willow ========
  const WM = {
    deck: new THREE.MeshStandardMaterial({ color: '#8a6038', roughness: 0.8 }),
    pot: new THREE.MeshStandardMaterial({ color: '#b5653a', roughness: 0.85 }),
    soil: new THREE.MeshStandardMaterial({ color: '#4a3424', roughness: 1 }),
    iron: new THREE.MeshStandardMaterial({ color: '#8d949c', roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide, alphaTest: 0.5 }),
    bark: new THREE.MeshStandardMaterial({ color: '#7a6a4c', roughness: 0.85 }),
    roots: new THREE.MeshStandardMaterial({ color: '#8a6a48', roughness: 0.9 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, side: THREE.DoubleSide }),
    fallen: new THREE.MeshStandardMaterial({ color: '#c79a3c', roughness: 0.8, side: THREE.DoubleSide }),
    can: new THREE.MeshStandardMaterial({ color: '#5f7d6a', roughness: 0.4, metalness: 0.5 }),
    scale: new THREE.MeshStandardMaterial({ color: '#2f3a44', roughness: 0.45, metalness: 0.4 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.3, metalness: 0.8 }),
    drop: new THREE.MeshStandardMaterial({ color: '#9fd4ff', roughness: 0.1, transparent: true, opacity: 0.8 }),
  }
  const wr = rigAt(ST.willow)
  root.add(wr)
  const DECK_Y = 0.18
  {
    const deck = new THREE.Mesh(new RoundedBoxGeometry(3.6, DECK_Y, 1.9, 2, 0.04), WM.deck)
    deck.position.set(0, DECK_Y / 2, -0.25)
    wr.add(deck)
    // planks
    for (let i = 0; i < 8; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(3.56, 0.004, 0.012), WM.roots)
      line.position.set(0, DECK_Y + 0.002, -1.12 + i * 0.235)
      wr.add(line)
    }
    // the deck is a solid, not a step: no one stands in van Helmont's pot
    const c = ST.willow
    solids.push(box(c.x - Math.sin(c.rot) * 0.25, c.z - Math.cos(c.rot) * 0.25, 3.7, 2.0, { rot: c.rot, y0: 0, y1: 1.2 }))
  }
  // the pot: an earthen pot, the soil, the iron plate pierced with holes over it (to keep the dust out)
  const POT = { x: 0, z: -0.35, h: 0.56 }
  const pot = new THREE.Group()
  pot.position.set(POT.x, DECK_Y, POT.z)
  wr.add(pot)
  {
    const prof = [[0, 0], [0.25, 0], [0.27, 0.03], [0.35, POT.h - 0.06], [0.39, POT.h - 0.04], [0.39, POT.h], [0.35, POT.h], [0.33, POT.h - 0.05]].map(([x, y]) => new THREE.Vector2(x, y))
    pot.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 36), WM.pot))
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.33, 32).rotateX(-Math.PI / 2), WM.soil)
    soil.position.y = POT.h - 0.06
    pot.add(soil)
    const holesTex = canvasTex(256, 256, (g, w) => {
      g.clearRect(0, 0, w, w)
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(w / 2, w / 2, w / 2 - 2, 0, TAU)
      g.fill()
      g.globalCompositeOperation = 'destination-out'
      for (let y = 14; y < w; y += 22) {
        for (let x = 14 + ((y / 22) % 2) * 11; x < w; x += 22) {
          if (Math.hypot(x - w / 2, y - w / 2) < 22) continue
          g.beginPath()
          g.arc(x, y, 4.5, 0, TAU)
          g.fill()
        }
      }
      g.beginPath()
      g.arc(w / 2, w / 2, 14, 0, TAU)
      g.fill()
    })
    textures.push(holesTex)
    WM.iron.map = holesTex
    const plate = new THREE.Mesh(new THREE.CircleGeometry(0.37, 36).rotateX(-Math.PI / 2), WM.iron)
    plate.position.y = POT.h + 0.004
    pot.add(plate)
  }
  // the willow, its foot at the soil
  const tree = willowTree(WM, random(5))
  wr.add(tree.group)
  const potTop = V3(POT.x, DECK_Y + POT.h - 0.06, POT.z)
  // the watering can, left of the pot
  const can = new THREE.Group()
  const CAN = V3(-1.05, DECK_Y, 0.1)
  can.position.copy(CAN)
  wr.add(can)
  const canTip = new THREE.Group()
  can.add(canTip)
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.34, 24).translate(0, 0.17, 0), WM.can)
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 0.5, 10), WM.can)
    spout.position.set(0.3, 0.33, 0)
    spout.rotation.z = -0.95
    const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.025, 0.06, 14), WM.brass)
    rose.position.set(0.5, 0.48, 0)
    rose.rotation.z = -0.95
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.016, 8, 20, Math.PI), WM.can)
    handle.position.set(-0.02, 0.36, 0)
    canTip.add(body, spout, rose, handle)
  }
  const ROSE = V3(0.5, 0.48, 0)
  // drops of water from the can's rose
  const DROPS = 24
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 8, 6), WM.drop, DROPS)
  drops.frustumCulled = false
  drops.raycast = () => {}
  wr.add(drops)
  // leaves fallen in the autumns, lying on the deck (van Helmont did not weigh them)
  const FALLEN_MAX = 64
  const fallenSpots = Array.from({ length: FALLEN_MAX }, () => {
    const a = rnd() * TAU
    const r = 0.5 + rnd() * 0.75
    return { x: POT.x + Math.cos(a) * r * 1.2, z: POT.z + Math.sin(a) * r * 0.6, a: rnd() * TAU }
  })
  const fallen = new THREE.InstancedMesh(leafShape(), WM.fallen, FALLEN_MAX)
  fallen.frustumCulled = false
  fallen.raycast = () => {}
  fallen.count = 0
  wr.add(fallen)
  fallenSpots.forEach((s, i) => {
    dummy.position.set(s.x, DECK_Y + 0.006, s.z)
    dummy.rotation.set(-Math.PI / 2, 0, s.a)
    dummy.scale.setScalar(1.6)
    dummy.updateMatrix()
    fallen.setMatrixAt(i, dummy.matrix)
  })
  // leaves falling now (autumn)
  const FALLING = 18
  const falling = new THREE.InstancedMesh(leafShape(), WM.fallen, FALLING)
  falling.frustumCulled = false
  falling.raycast = () => {}
  falling.visible = false
  wr.add(falling)
  // the scale: a platform, its dial on a post facing the visitor
  const SC = V3(1.12, DECK_Y, -0.2)
  const scale = new THREE.Group()
  scale.position.copy(SC)
  wr.add(scale)
  const dialTex = canvasTex(256, 256, (g, w) => {
    const c = w / 2
    g.fillStyle = '#f3ead6'
    g.beginPath()
    g.arc(c, c, c - 4, 0, TAU)
    g.fill()
    g.strokeStyle = '#3a2a18'
    g.lineWidth = 6
    g.stroke()
    g.lineWidth = 3
    for (let i = 0; i <= 40; i++) {
      const a = -Math.PI * 1.25 + (i / 40) * Math.PI * 1.5
      const r0 = i % 10 === 0 ? c - 34 : c - 22
      g.beginPath()
      g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0)
      g.lineTo(c + Math.cos(a) * (c - 12), c + Math.sin(a) * (c - 12))
      g.stroke()
    }
    g.fillStyle = '#3a2a18'
    g.font = '700 26px Outfit, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 0; i <= 4; i++) {
      const a = -Math.PI * 1.25 + (i / 4) * Math.PI * 1.5
      g.fillText(String(i * 50), c + Math.cos(a) * (c - 58), c + Math.sin(a) * (c - 58))
    }
  })
  textures.push(dialTex)
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.2, 0.01).translate(0, 0.085, 0), new THREE.MeshStandardMaterial({ color: '#b3261e', roughness: 0.4 }))
  // the dial low behind the pan, so the willow's crown stands above it
  const DIAL_Y = 0.66
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.1, 0.62, 2, 0.02), WM.scale)
    base.position.y = 0.05
    const pan = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.04, 0.56, 2, 0.015), WM.brass)
    pan.position.y = 0.12
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, DIAL_Y - 0.1, 0.06).translate(0, (DIAL_Y - 0.1) / 2 + 0.1, 0), WM.scale)
    post.position.z = -0.36
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32).rotateX(Math.PI / 2), WM.brass)
    rim.position.set(0, DIAL_Y, -0.34)
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.27, 32), new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.6 }))
    face.position.set(0, DIAL_Y, -0.305)
    needle.position.set(0, DIAL_Y, -0.298)
    scale.add(base, pan, post, rim, face, needle)
  }
  const PAN_Y = 0.14
  // the weight, written on the deck's edge in front of the scale
  const readout = label('', 0.085, '#ffe9b0', { anchorY: 'top', maxWidth: 1.2 })
  readout.position.set(0, 0.3, 0.5)
  scale.add(readout)
  // what the willow is made of: blocks on the scale, from the bottom: soil, water, air
  const PARTS = [
    { id: 'minerals', frac: 0.005, color: '#9a6a3a', from: 'soil' },
    { id: 'water', frac: 0.5, color: '#4a96dc', from: 'water' },
    { id: 'hydrogen', frac: 0.03, color: ATOM.H, from: 'water' },
    { id: 'oxygen', frac: 0.215, color: ATOM.O, from: 'air' },
    { id: 'carbon', frac: 0.25, color: ATOM.C, from: 'air' },
  ]
  const COL_H = 1.25
  const sortG = new THREE.Group()
  sortG.position.set(0, PAN_Y + 0.02, 0)
  scale.add(sortG)
  let yb = 0
  const blocks = PARTS.map(p => {
    const h = Math.max(0.035, p.frac * COL_H)
    const m = new THREE.Mesh(new RoundedBoxGeometry(0.42, h, 0.42, 2, Math.min(0.015, h / 3)).translate(0, h / 2, 0), new THREE.MeshStandardMaterial({ color: p.color, roughness: p.id === 'water' ? 0.2 : 0.5 }))
    m.position.y = yb
    const tag = label(E.willow.signs[p.id], 0.07, '#ffffff', { anchorX: 'left' })
    tag.position.set(0.26, yb + h / 2, 0.15)
    sortG.add(m, tag)
    const b = { m, tag, y: yb, h, p }
    yb += h
    return b
  })
  // where each part came from, beside the column
  const sources = ['soil', 'water', 'air'].map(from => {
    const ps = blocks.filter(b => b.p.from === from)
    const y0 = ps[0].y
    const y1 = ps[ps.length - 1].y + ps[ps.length - 1].h
    const g = new THREE.Group()
    // (a small gap at each end, so the three brackets read as three)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.026, Math.max(0.025, y1 - y0 - 0.05), 0.026), new THREE.MeshBasicMaterial({ color: from === 'air' ? '#e4f8ff' : from === 'water' ? '#5aa8f0' : '#c8955a' }))
    bar.position.set(-0.27, (y0 + y1) / 2, 0.15)
    const tag = label(E.willow.from[from], 0.075, from === 'air' ? '#c9f0ff' : from === 'water' ? '#a8d8ff' : '#e0b27a', { anchorX: 'right' })
    tag.position.set(-0.31, from === 'soil' ? y0 - 0.02 : (y0 + y1) / 2, 0.15)
    g.add(bar, tag)
    sortG.add(g)
    return g
  })
  sortG.visible = false
  // the board: the numbers of the experiment
  const board = standingScreen({ width: 1.6, height: 0.92, color: WILLOW_C, title: E.willow.title, line: '', titleSize: 0.1, lineSize: 0.07 }, { top: 1.55, tilt: 0.2, mat: WM.scale })
  board.group.position.set(-2.35, 0, -0.75)
  board.group.rotation.y = 0.5
  wr.add(board.group)
  {
    const p = wr.localToWorld(board.group.position.clone())
    solids.push(circle(p.x, p.z, 0.3))
  }

  // the experiment's state: the year (0 to 5), and what has been done since
  const WL = { year: 0, shown: 0, phase: 'grow', n: 0, anim: null, mine: false, said: true }
  const weightAt = y => 5 * Math.pow(169.2 / 5, clamp(y / 5))
  const growth = y => Math.cbrt(weightAt(y) / 169.2)
  const autumns = y => Math.min(4, Math.floor(y + 1e-6))
  const YEAR_T = 3.4
  const WEIGH_T = 2.4
  const SORT_T = 1.8
  const leafCol = new THREE.Color()
  const GREEN = new THREE.Color('#86b94e')
  const YELLOW = new THREE.Color('#e2c045')
  const tmpC = new THREE.Color()
  const willowHint = () => {
    const H = E.willow.hints
    if (WL.phase === 'sorted') return H.again
    if (WL.phase === 'weighed') return H.sort
    return WL.year >= 5 ? H.weigh : H.water
  }
  const boardLines = () => {
    const B = E.willow.board
    if (WL.phase === 'sorted') return B.sorted
    if (WL.phase === 'weighed') return B.weighed
    return fill(B.grow, { y: Math.floor(WL.year + 1e-6) })
  }
  let boardSaid = null
  const willowPanel = l => ({
    title: E.willow.title,
    color: WILLOW_C,
    blocks: [
      {
        slider: {
          label: E.willow.years,
          min: 0,
          max: 5,
          step: 0.1,
          value: WL.year,
          onInput: v => {
            setYear(v)
            ex.discover('willow')
          },
          format: v => fill(E.willow.yearsFmt, { y: Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : num(v, 1, lang) }),
          live: () => WL.year,
        },
      },
      { buttons: [{ label: E.willow.verbs.water, onClick: () => willowStep('water') }, { label: E.willow.verbs.weigh, onClick: () => willowStep('weigh') }, { label: E.willow.verbs.sort, onClick: () => willowStep('sort') }, { label: E.willow.verbs.again, onClick: () => willowStep('again') }] },
      {
        rows: [
          [E.willow.rows.treeStart, E.willow.weights.treeStart],
          [E.willow.rows.soilStart, E.willow.weights.soilStart],
          [E.willow.rows.tree, WL.phase === 'grow' ? '?' : E.willow.weights.tree],
          [E.willow.rows.soil, WL.phase === 'grow' ? '?' : E.willow.weights.soil],
        ],
      },
      ...paras(E.willow.panel[depth(l)]),
    ],
  })
  let yearSend = null
  function setYear(v) {
    if (WL.phase !== 'grow') {
      WL.phase = 'grow'
      WL.anim = null
    }
    WL.year = clamp(Math.round(Number(v) * 10) / 10, 0, 5)
    WL.mine = true
    if (!yearSend) {
      yearSend = setTimeout(() => {
        yearSend = null
        share('willow')
      }, 250)
    }
  }
  const startAnim = (kind, from, age = 0, sound = true) => {
    WL.anim = { kind, from, t: age, sound }
    if (sound && age < 0.1) play(kind === 'year' ? 'tap' : kind === 'weigh' ? 'select' : kind === 'sort' ? 'discover' : 'pop')
  }
  // a tap on a thing does the step it is for: the can waters; the willow is watered while it grows and
  // weighed after five years; the scale sorts it; the pot starts again once it has been weighed
  const willowTap = thing =>
    willowStep(thing === 'can' ? 'water' : thing === 'tree' ? (WL.phase === 'grow' && WL.year < 5 ? 'water' : 'weigh') : thing === 'scale' ? 'sort' : WL.phase === 'grow' ? 'water' : 'again')
  function willowStep(step) {
    const l = lv()
    const busy = !!WL.anim
    if (busy) return say(at(W.busy, l))
    WL.mine = true
    if (step === 'water') {
      if (WL.phase !== 'grow') return say(at(E.willow.says.done, l), WILLOW_C)
      if (WL.year >= 5) return say(at(E.willow.says.five, l), WILLOW_C)
      const from = WL.year
      WL.year = Math.min(5, Math.floor(WL.year + 1e-6) + 1)
      WL.n++
      WL.said = false
      startAnim('year', from)
      share('willow')
      findOnce('willow', willowPanel, YEAR_T)
      return
    }
    if (step === 'weigh') {
      if (WL.phase !== 'grow') return say(at(E.willow.says.done, l), WILLOW_C)
      if (WL.year < 5) return say(at(E.willow.says.notYet, l), WILLOW_C)
      WL.phase = 'weighed'
      WL.n++
      WL.said = false
      startAnim('weigh', 5)
      share('willow')
      findOnce('willow', willowPanel, WEIGH_T + 1)
      return
    }
    if (step === 'sort') {
      if (WL.phase === 'grow') return say(at(WL.year >= 5 ? E.willow.says.weighFirst : E.willow.says.notYet, l), WILLOW_C)
      if (WL.phase === 'sorted') return say(at(E.willow.says.sorted, l), WILLOW_C)
      WL.phase = 'sorted'
      WL.n++
      WL.said = false
      startAnim('sort', 5)
      share('willow')
      return
    }
    if (step === 'again') {
      WL.phase = 'grow'
      WL.year = 0
      WL.shown = 0
      WL.n++
      startAnim('again', 0)
      say(at(E.willow.says.again, l), WILLOW_C)
      share('willow')
    }
  }
  ex.add({
    id: 'willow',
    x: ST.willow.stand.x,
    z: ST.willow.stand.z,
    radius: 2.0,
    label: E.willow.label,
    verb: willowHint,
    manual: true,
    focus: { x: ST.willow.x - Math.sin(ST.willow.rot) * 0.2, y: 0.95, z: ST.willow.z - Math.cos(ST.willow.rot) * 0.2, size: 3.4 },
    act: () => ctx.showPanel(willowPanel),
  })
  clickable(can, () => willowTap('can'))
  clickable(pot, () => willowTap('pot'))
  clickable(tree.group, () => willowTap('tree'))
  clickable(scale, () => willowTap('scale'))

  // the willow's pose: grown to its year, in its season, in the pot or on the scale
  const ld = new THREE.Object3D()
  ld.rotation.order = 'YXZ'
  for (const L of tree.leaves) L.at = L.b.curve.getPoint(L.t).sub(L.b.p0)
  updates.push(dt => {
    const a = WL.anim
    if (a) {
      a.t += dt
      const end = a.kind === 'year' ? YEAR_T : a.kind === 'weigh' ? WEIGH_T : a.kind === 'sort' ? SORT_T : 1.2
      if (a.t >= end) WL.anim = null
    }
    // the year shown: eased to the slider, or stepping through the year being watered
    let season = 0.35 // the middle of summer: leaves out, green
    let pour = 0
    let fall = 0
    if (a?.kind === 'year') {
      const u = a.t / YEAR_T
      pour = u < 0.3 ? span(0, 0.06, u) * (1 - span(0.24, 0.3, u)) : 0
      WL.shown = lerp(a.from, WL.year, span(0.12, 0.62, u))
      // summer and growing, then (in years one to four) autumn, the leaves falling, winter, and spring
      // again; the fifth year ends in summer, ready to weigh (four autumns in five years)
      const lastYear = WL.year >= 5
      season = lastYear || u < 0.6 ? 0.35 : u
      fall = lastYear ? 0 : span(0.62, 0.86, u)
    } else {
      WL.shown = damp(WL.shown, WL.year, 3, dt)
      if (Math.abs(WL.shown - WL.year) < 0.003) WL.shown = WL.year
    }
    const yShown = WL.shown
    const g = growth(yShown)
    // where the tree stands: in the pot, or lifted onto the scale
    const onScale = WL.phase !== 'grow' || a?.kind === 'again'
    let lift = onScale ? 1 : 0
    if (a?.kind === 'weigh') lift = span(0.1, 0.75, a.t / WEIGH_T)
    if (a?.kind === 'again') lift = 0
    const panTop = V3(SC.x, DECK_Y + PAN_Y + 0.02 + 0.32, SC.z)
    tree.group.position.copy(potTop).lerp(panTop, lift)
    tree.group.position.y += Math.sin(Math.PI * lift) * 0.5
    tree.roots.visible = lift > 0.02
    // sorted: the willow gives way to what it is made of; started again: a new cutting grows in the pot
    let sortK = WL.phase === 'sorted' ? 1 : 0
    if (a?.kind === 'sort') sortK = span(0.0, 1.0, a.t / SORT_T)
    if (a?.kind === 'again') sortK = 0
    const treeK = (1 - span(0, 0.45, sortK)) * (a?.kind === 'again' ? span(0.25, 1, a.t / 1.2) : 1)
    tree.group.visible = treeK > 0.01
    tree.group.scale.setScalar(g * Math.max(0.001, treeK))
    sortG.visible = sortK > 0.01
    blocks.forEach((b, i) => {
      const k = span(0.3 + i * 0.1, 0.55 + i * 0.1, sortK)
      b.m.scale.set(1, Math.max(0.001, k), 1)
      b.tag.visible = k > 0.9
    })
    sources.forEach(s => (s.visible = sortK > 0.95))
    // the scale's needle and readout: the willow's weight once lifted on (the soil's on the board)
    const w = WL.phase === 'grow' && a?.kind !== 'again' ? 0 : 169.2
    const nk = a?.kind === 'weigh' ? span(0.7, 1, a.t / WEIGH_T) : WL.phase === 'grow' ? 0 : 1
    // (0 at the dial's lower left, 200 at its lower right, as the numbers are drawn)
    needle.rotation.z = Math.PI * 0.75 - ((w * nk) / 200) * Math.PI * 1.5
    // (gone once the willow is sorted: the column's own words stand there)
    const rd = nk > 0.98 && sortK < 0.3 ? E.willow.weights.tree : ''
    if (readout.text !== rd) {
      readout.text = rd
      readout.sync()
    }
    // branches sprout through the years
    for (const b of tree.branches) b.pivot.scale.setScalar(Math.max(0.001, clamp((yShown - b.birth) / 1.1)))
    // leaves: out in spring, yellow and gone in autumn, bare in winter
    const leafK = season < 0.62 ? span(0, 0.25, season) : season < 0.85 ? 1 - span(0.72, 0.85, season) : span(0.9, 1, season)
    const yellow = season < 0.62 ? 0 : season < 0.9 ? span(0.6, 0.72, season) : 1 - span(0.9, 1, season)
    leafCol.copy(GREEN).lerp(YELLOW, yellow)
    // (the leaves keep their own size as the tree grows: scaled against the tree's growth)
    tree.leaves.forEach((L, i) => {
      const s = clamp((yShown - L.b.birth) / 1.1)
      ld.position.copy(L.at).multiplyScalar(s).add(L.b.p0)
      ld.rotation.set(L.tilt, L.spin, 0)
      ld.scale.setScalar(Math.max(0.001, (L.s * s * leafK) / Math.max(0.35, g)))
      ld.updateMatrix()
      tree.leafMesh.setMatrixAt(i, ld.matrix)
      tree.leafMesh.setColorAt(i, tmpC.copy(leafCol).offsetHSL(0, 0, ((i * 37) % 11) / 110 - 0.05))
    })
    tree.leafMesh.instanceMatrix.needsUpdate = true
    if (tree.leafMesh.instanceColor) tree.leafMesh.instanceColor.needsUpdate = true
    // leaves falling to the deck, and the ones that lie there
    falling.visible = fall > 0 && fall < 1
    if (falling.visible) {
      for (let i = 0; i < FALLING; i++) {
        const s = fallenSpots[(i * 7) % FALLEN_MAX]
        const k = clamp(fall * 1.6 - (i / FALLING) * 0.6)
        const top = potTop.clone().add(V3(Math.cos(i * 2.4) * 0.4 * g, 1.1 * g, Math.sin(i * 2.4) * 0.4 * g))
        dummy.position.set(lerp(top.x, s.x, k) + Math.sin(k * 9 + i) * 0.08, lerp(top.y, DECK_Y + 0.01, k), lerp(top.z, s.z, k))
        dummy.rotation.set(-Math.PI / 2 + Math.sin(k * 7 + i) * 0.8, k * 4 + i, 0)
        dummy.scale.setScalar(k > 0 && k < 1 ? 1.5 : 0.001)
        dummy.updateMatrix()
        falling.setMatrixAt(i, dummy.matrix)
      }
      falling.instanceMatrix.needsUpdate = true
    }
    fallen.count = a?.kind === 'again' ? 0 : autumns(a?.kind === 'year' && fall < 1 ? a.from : yShown) * 16
    // the can pours
    canTip.rotation.z = -0.75 * pour
    drops.visible = pour > 0.05
    if (drops.visible) {
      const tip = canTip.localToWorld(ROSE.clone())
      wr.worldToLocal(tip)
      for (let i = 0; i < DROPS; i++) {
        const k = ((clock * 1.8 + i / DROPS) % 1)
        dummy.position.set(lerp(tip.x, potTop.x + Math.sin(i * 1.7) * 0.15, k), tip.y - (tip.y - potTop.y) * k * k, lerp(tip.z, potTop.z + Math.cos(i * 1.3) * 0.15, k))
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        drops.setMatrixAt(i, dummy.matrix)
      }
      drops.instanceMatrix.needsUpdate = true
    }
    // the board
    const lines = boardLines()
    if (lines !== boardSaid) {
      boardSaid = lines
      board.set({ line: lines })
    }
    // the Atomling tells what happened, once it shows, to whoever did it
    if (!WL.said && !WL.anim) {
      WL.said = true
      if (WL.mine) {
        const l = lv()
        if (WL.phase === 'weighed') say(at(E.willow.says.weighed, l), WILLOW_C)
        else if (WL.phase === 'sorted') say(at(E.willow.says.sortedNow, l), WILLOW_C)
        else if (WL.year >= 5) say(at(E.willow.says.five, l), WILLOW_C)
        else say(at(E.willow.says.years[Math.max(0, Math.min(3, Math.floor(WL.year + 1e-6) - 1))], l), WILLOW_C)
      }
      refresh(willowPanel)
    }
  })

  // ======== 2. the stoma: a door in the leaf's underside ========
  const sr = rigAt(ST.stoma)
  root.add(sr)
  const SM = {
    well: new THREE.MeshStandardMaterial({ color: '#4c6c44', roughness: 0.9, side: THREE.DoubleSide }),
    out: new THREE.MeshBasicMaterial({ color: '#a8d0ff', toneMapped: false }),
    glass: new THREE.MeshStandardMaterial({ color: '#eaf6ff', roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false }),
    water: new THREE.MeshStandardMaterial({ color: '#3f9cff', roughness: 0.2, emissive: '#1d5ab0', emissiveIntensity: 0.5 }),
    stand: new THREE.MeshStandardMaterial({ color: '#33503a', roughness: 0.6 }),
  }
  const gtex = chloroTexture(17, { w: 256, h: 128, count: 34, len: 9, base: '#9fcf74' })
  textures.push(gtex.map, gtex.glow)
  // (u runs along the cell, 2.9 m; v round it, about 2.5 m)
  gtex.map.repeat.set(1, 2)
  gtex.glow.repeat.set(1, 2)
  const guardMat = new THREE.MeshStandardMaterial({ map: gtex.map, emissiveMap: gtex.glow, emissive: '#9dff6a', emissiveIntensity: 0.25, roughness: 0.45 })
  // the well under the pore, and the bright air outside below it
  {
    const well = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 32, 1, true).translate(0, -0.5, 0), SM.well)
    well.scale.set(holeRx, 1.1, holeRz)
    sr.add(well)
    const out = new THREE.Mesh(new THREE.CircleGeometry(1, 32).rotateX(-Math.PI / 2), SM.out)
    out.scale.set(holeRx, 1, holeRz)
    out.position.y = -1.1
    sr.add(out)
  }
  // the two guard cells: bent sausages along z, bowing apart when they fill with water
  const GU = { L: 2.9, NU: 28, NV: 16 }
  const guards = [-1, 1].map(side => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array((GU.NU + 1) * (GU.NV + 1) * 3)
    const uv = new Float32Array((GU.NU + 1) * (GU.NV + 1) * 2)
    const idx = []
    for (let i = 0; i <= GU.NU; i++) {
      for (let j = 0; j <= GU.NV; j++) {
        uv.set([i / GU.NU, j / GU.NV], (i * (GU.NV + 1) + j) * 2)
        if (i < GU.NU && j < GU.NV) {
          const a = i * (GU.NV + 1) + j
          const b = a + GU.NV + 1
          idx.push(a, a + 1, b, b, a + 1, b + 1)
        }
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    geo.setIndex(idx)
    const mesh = new THREE.Mesh(geo, guardMat)
    sr.add(mesh)
    return { side, mesh, geo, pos }
  })
  let guardK = -1
  const shapeGuards = k => {
    if (Math.abs(k - guardK) < 0.002) return
    guardK = k
    const R = lerp(0.36, 0.44, k)
    const bow = 0.4 * k
    for (const gd of guards) {
      for (let i = 0; i <= GU.NU; i++) {
        const u = i / GU.NU
        const rad = Math.max(0.015, R * Math.pow(Math.sin(Math.PI * u), 0.42))
        const cx = gd.side * (R + bow * Math.sin(Math.PI * u))
        const cz = -GU.L / 2 + GU.L * u
        const cy = R * 0.82
        for (let j = 0; j <= GU.NV; j++) {
          const v = (j / GU.NV) * TAU
          gd.pos.set([cx + Math.cos(v) * rad, cy + Math.sin(v) * rad * 0.92, cz], (i * (GU.NV + 1) + j) * 3)
        }
      }
      gd.geo.attributes.position.needsUpdate = true
      gd.geo.computeVertexNormals()
      gd.geo.computeBoundingSphere()
      gd.geo.computeBoundingBox()
    }
  }
  shapeGuards(1)
  // the guard cells' inner lips: two flaps over the hole that meet when the stoma shuts (the round cells
  // alone leave a gap at the floor)
  const lipMat = new THREE.MeshStandardMaterial({ color: '#557f43', roughness: 0.6, side: THREE.DoubleSide })
  const lips = [-1, 1].map(side => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(1, 24, side > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI).rotateX(-Math.PI / 2), lipMat)
    m.scale.set(holeRx + 0.02, 1, holeRz + 0.02)
    m.position.y = 0.015
    m.raycast = () => {}
    sr.add(m)
    return { m, side }
  })
  // the outside light shining up through the open pore, and the stoma's name over its far end
  const poreLight = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 1 }, uColor: { value: new THREE.Color('#e8f4ff') } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float a = uK * (1.0 - vUv.y) * smoothstep(0.0, 0.08, vUv.y);
        gl_FragColor = vec4(uColor, a * 0.22);
      }`,
  })
  const poreBeam = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 24, 1, true).translate(0, 1.5, 0), poreLight)
  poreBeam.scale.set(0.3, 1, 0.9)
  poreBeam.raycast = () => {}
  sr.add(poreBeam)
  const stomaTag = label(E.stoma.signs.stoma, 0.16, '#d8f0ff')
  stomaTag.position.set(0.95, 2.1, -1.7)
  sr.add(stomaTag)
  // an invisible lid over the pore, so a tap on the opening counts too
  const poreHit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 2.6), new THREE.MeshBasicMaterial({ visible: false }))
  poreHit.position.y = 0.25
  sr.add(poreHit)
  solids.push(circle(ST.stoma.x, ST.stoma.z, 1.45))
  // the leaf's water gauge, left of the stoma
  const GAUGE = V3(-1.75, 0, -0.35)
  const gauge = new THREE.Group()
  gauge.position.copy(GAUGE)
  sr.add(gauge)
  const GH = 1.25
  const waterCol = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1, 20).translate(0, 0.5, 0), SM.water)
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.1, 24), SM.stand)
    foot.position.y = 0.05
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, GH, 24, 1, true), SM.glass)
    tube.position.y = 0.1 + GH / 2
    tube.renderOrder = 3
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.06, 24), SM.stand)
    cap.position.y = 0.13 + GH
    waterCol.position.y = 0.11
    gauge.add(foot, tube, cap, waterCol)
    const tag = label(E.stoma.signs.water, 0.11, '#cfe8ff', { anchorY: 'bottom', maxWidth: 1.4 })
    tag.position.y = 0.25 + GH
    gauge.add(tag)
  }
  solids.push((() => {
    const p = sr.localToWorld(GAUGE.clone())
    return circle(p.x, p.z, 0.35)
  })())
  // molecules through the pore: CO2 rising in, water vapour going out
  const MAXM = light ? 22 : 40
  const smol = { C: new THREE.InstancedMesh(ball, A.C, MAXM), O: new THREE.InstancedMesh(ball, A.O, MAXM * 3), H: new THREE.InstancedMesh(ball, A.H, MAXM * 2) }
  for (const m of Object.values(smol)) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.count = 0
    sr.add(m)
  }
  const flowing = []
  // where the catcher is, seen from the stoma: the carbon dioxide drifts off that way
  const toCatch = sr.worldToLocal(V3(ST.catcher.x, 1.2, ST.catcher.z)).setY(0).normalize()
  const S = { open: true, k: 1, dry: 0.3, water: 1, n: 0, mine: false, said: {}, co2: 0, h2o: 0 }
  const stomaHint = () => {
    const H = E.stoma.hints
    if (S.open) return H.close
    return S.water < 0.45 ? H.wait : H.open
  }
  const stomaPanel = l => ({
    title: E.stoma.title,
    color: STOMA_C,
    blocks: [
      { buttons: [{ label: S.open ? E.stoma.verbs.close : E.stoma.verbs.open, onClick: () => stomaStep('stoma') }, { label: S.dry >= 0.6 ? E.stoma.verbs.damp : E.stoma.verbs.dry, onClick: () => stomaStep('dry') }] },
      {
        slider: {
          label: E.stoma.dryLabel,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(S.dry * 100),
          onInput: v => setDry(v / 100, false),
          format: v => fill(E.stoma.dryFmt, { v: Math.round(v) }),
          live: () => Math.round(S.dry * 100),
        },
      },
      ...paras(E.stoma.panel[depth(l)]),
    ],
  })
  let drySend = null
  function setDry(v, now) {
    const was = S.dry >= 0.6
    S.dry = clamp(Number(v))
    S.mine = true
    ex.discover('stoma')
    if (was !== S.dry >= 0.6) refresh(stomaPanel)
    if (now) return share('stoma')
    if (!drySend) {
      drySend = setTimeout(() => {
        drySend = null
        share('stoma')
      }, 250)
    }
  }
  function stomaStep(thing) {
    const l = lv()
    S.mine = true
    if (thing === 'dry') {
      const dry = S.dry < 0.6
      setDry(dry ? 1 : 0.15, true)
      play('tap')
      say(at(dry ? E.stoma.says.dry : E.stoma.says.damp, l), STOMA_C)
      refresh(stomaPanel)
      return
    }
    if (!S.open && S.water < 0.45) return say(at(E.stoma.says.thirsty, l), STOMA_C)
    S.open = !S.open
    S.n++
    play(S.open ? 'select' : 'tap')
    const night = SUN.k < 0.25
    say(at(S.open ? (night ? E.stoma.says.night : E.stoma.says.open) : E.stoma.says.close, l), STOMA_C)
    share('stoma')
    findOnce('stoma', stomaPanel, 3)
    refresh(stomaPanel)
  }
  ex.add({
    id: 'stoma',
    x: ST.stoma.stand.x,
    z: ST.stoma.stand.z,
    radius: 1.9,
    label: E.stoma.label,
    verb: stomaHint,
    manual: true,
    focus: { x: ST.stoma.x, y: 0.5, z: ST.stoma.z, size: 3.6 },
    act: () => ctx.showPanel(stomaPanel),
  })
  for (const gd of guards) clickable(gd.mesh, () => stomaStep('stoma'))
  clickable(poreHit, () => stomaStep('stoma'))
  const outDamp = new THREE.Color('#a8d0ff')
  const outDry = new THREE.Color('#fff0a8')
  updates.push(dt => {
    S.k = damp(S.k, S.open ? 1 : 0, 1.6, dt)
    shapeGuards(S.k)
    for (const l of lips) l.m.position.x = l.side * S.k * (holeRx + 0.1)
    // water: the vein brings it in, the open pore lets it out, the more the drier and sunnier the day
    const supply = 0.035
    const loss = S.k * (0.005 + 0.09 * Math.pow(S.dry, 1.5)) * (0.4 + 0.6 * SUN.shown)
    S.water = clamp(S.water + (supply - loss) * dt)
    if (S.open && S.water < 0.28) {
      // the leaf saves its water: the guard cells go limp and the door shuts by itself
      S.open = false
      if (S.mine) {
        say(at(E.stoma.says.shut, lv()), STOMA_C)
        share('stoma')
      }
      refresh(stomaPanel)
    }
    waterCol.scale.y = Math.max(0.001, S.water * GH * 0.97)
    SM.water.color.set(S.water < 0.4 ? '#ff9a3c' : '#3f9cff')
    SM.water.emissive.set(S.water < 0.4 ? '#a04a10' : '#1d5ab0')
    SM.out.color.copy(outDamp).lerp(outDry, S.dry).multiplyScalar(0.5 + 0.6 * SUN.shown)
    poreLight.uniforms.uK.value = S.k * (0.35 + 0.65 * SUN.shown)
    poreLight.uniforms.uColor.value.copy(outDamp).lerp(outDry, S.dry)
    poreBeam.scale.set(0.12 + 0.2 * S.k, 1, 0.9)
    guardMat.emissiveIntensity = 0.06 + 0.3 * SUN.shown
    // molecules: carbon dioxide in, water vapour out (in proportion, many more water molecules leave)
    S.co2 += dt * S.k * 1.1
    S.h2o += dt * S.k * (0.5 + 3.4 * S.dry) * (0.4 + 0.6 * SUN.shown)
    while (S.co2 >= 1) {
      S.co2 -= 1
      if (flowing.length < MAXM) flowing.push({ kind: 'co2', p: V3((rnd() - 0.5) * 0.3, -1.0, (rnd() - 0.5) * 1.2), age: 0, spin: rnd() * TAU, ax: V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), side: rnd() - 0.5 })
    }
    while (S.h2o >= 1) {
      S.h2o -= 1
      const a = Math.PI + (rnd() - 0.5) * 2.6
      const r = 1.4 + rnd() * 1.3
      if (flowing.length < MAXM) flowing.push({ kind: 'h2o', p: V3(Math.sin(a) * r, 0.4 + rnd() * 2.0, Math.cos(a) * r), age: 0, spin: rnd() * TAU, ax: V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize() })
    }
    let nc = 0
    let no = 0
    let nh = 0
    const q = new THREE.Quaternion()
    for (let i = flowing.length - 1; i >= 0; i--) {
      const m = flowing[i]
      m.age += dt
      m.spin += dt * 1.2
      if (m.kind === 'co2') {
        // up through the pore, then off into the air spaces toward the chloroplasts
        if (m.p.y < 2.3) m.p.y += dt * (m.p.y < 0.3 ? 0.75 : 0.9)
        else m.p.addScaledVector(toCatch, dt * 0.55).add(V3(0, Math.sin(m.age * 2 + m.spin) * dt * 0.1, m.side * dt * 0.3))
        if (m.age > 9) flowing.splice(i, 1)
      } else {
        // water vapour finds the pore and leaves
        const target = V3(0, -1.2, 0)
        const d = target.clone().sub(m.p)
        const above = m.p.y > 0.3 && Math.hypot(m.p.x, m.p.z) > 0.25
        const step = above ? V3(-m.p.x, -0.3, -m.p.z).normalize() : d.normalize()
        m.p.addScaledVector(step, dt * 0.8)
        if (m.p.y < -1.05 || m.age > 9) flowing.splice(i, 1)
      }
    }
    for (const m of flowing) {
      q.setFromAxisAngle(m.ax, m.spin)
      const s = 0.75 * Math.min(1, m.age * 2) * (m.kind === 'co2' && m.age > 7.5 ? 1 - span(7.5, 9, m.age) : 1)
      if (m.kind === 'co2') {
        dummy.position.copy(m.p)
        dummy.quaternion.copy(q)
        dummy.scale.setScalar(0.13 * s)
        dummy.updateMatrix()
        smol.C.setMatrixAt(nc++, dummy.matrix)
        for (const k of [-1, 1]) {
          dummy.position.copy(m.p).add(V3(k * 0.22 * s, 0, 0).applyQuaternion(q))
          dummy.scale.setScalar(0.12 * s)
          dummy.updateMatrix()
          smol.O.setMatrixAt(no++, dummy.matrix)
        }
      } else {
        dummy.position.copy(m.p)
        dummy.quaternion.copy(q)
        dummy.scale.setScalar(0.11 * s)
        dummy.updateMatrix()
        smol.O.setMatrixAt(no++, dummy.matrix)
        for (const k of [-1, 1]) {
          const ang = k * 0.912
          dummy.position.copy(m.p).add(V3(Math.sin(ang) * 0.14 * s, Math.cos(ang) * 0.14 * s, 0).applyQuaternion(q))
          dummy.scale.setScalar(0.075 * s)
          dummy.updateMatrix()
          smol.H.setMatrixAt(nh++, dummy.matrix)
        }
      }
    }
    smol.C.count = nc
    smol.O.count = no
    smol.H.count = nh
    for (const m of Object.values(smol)) m.instanceMatrix.needsUpdate = true
  })

  // ======== 3. the carbon catcher: a chloroplast cut open, and RuBisCO ========
  const cr = rigAt(ST.catcher)
  root.add(cr)
  const CM = {
    shell: new THREE.MeshStandardMaterial({ color: '#5f9f48', roughness: 0.6, side: THREE.DoubleSide, emissive: '#1f4a14', emissiveIntensity: 0.25 }),
    rim: new THREE.MeshStandardMaterial({ color: '#c8f59a', roughness: 0.4, emissive: '#7fd64a', emissiveIntensity: 0.6 }),
    grana: new THREE.MeshStandardMaterial({ color: '#2f8a2c', roughness: 0.45, emissive: '#6dff4a', emissiveIntensity: 0.4 }),
    lamella: new THREE.MeshStandardMaterial({ color: '#4fae3e', roughness: 0.5, emissive: '#5ad83a', emissiveIntensity: 0.4 }),
    starch: new THREE.MeshStandardMaterial({ color: '#eee6cf', roughness: 0.8, emissive: '#4a4430', emissiveIntensity: 0.25 }),
    rbA: new THREE.MeshStandardMaterial({ color: '#3fb08c', roughness: 0.45, emissive: '#0f4a38', emissiveIntensity: 0.4 }),
    rbB: new THREE.MeshStandardMaterial({ color: '#2b8f86', roughness: 0.45, emissive: '#0c3e3a', emissiveIntensity: 0.4 }),
    rbS: new THREE.MeshStandardMaterial({ color: '#a6e3bd', roughness: 0.5, emissive: '#2a5a3a', emissiveIntensity: 0.3 }),
    site: new THREE.MeshBasicMaterial({ color: '#ffd84a', toneMapped: false }),
    spark: new THREE.MeshBasicMaterial({ color: '#ffe066', toneMapped: false }),
    ghost: new THREE.MeshBasicMaterial({ color: '#fff3b0', transparent: true, opacity: 0.26, depthWrite: false }),
    bond: new THREE.MeshStandardMaterial({ color: '#dfe5f2', roughness: 0.4 }),
  }
  const CH = { a: 2.7, b: 1.35, c: 1.35, y: 1.4 }
  {
    // the back half of the chloroplast's envelope, its two membranes showing at the cut
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24, Math.PI, Math.PI), CM.shell)
    shell.scale.set(CH.a, CH.b, CH.c)
    shell.position.y = CH.y
    cr.add(shell)
    for (const [k, r] of [[1, 0.05], [0.95, 0.035]]) {
      const pts = Array.from({ length: 64 }, (_, i) => {
        const t = (i / 64) * TAU
        return V3(Math.cos(t) * CH.a * k, CH.y + Math.sin(t) * CH.b * k, 0.01)
      })
      const ring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 96, r, 8, true), CM.rim)
      cr.add(ring)
    }
  }
  // the grana: stacks of thylakoid discs where the light is caught, joined by flat lamellae
  // (on the left and along the top: the right half stays clear behind the sugar being built)
  const GRANA = [[-2.05, 1.05, -0.45], [-1.2, 2.0, -0.75], [-0.55, 0.62, -0.95], [0.45, 2.3, -0.9], [1.55, 2.3, -0.55]]
  const DISCS = 7
  const granaMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.3, 0.055, 22), CM.grana, GRANA.length * DISCS)
  GRANA.forEach(([x, y, z], i) => {
    for (let d = 0; d < DISCS; d++) {
      dummy.position.set(x, y - ((DISCS - 1) / 2) * 0.078 + d * 0.078, z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(1 + Math.sin(i * 3 + d) * 0.05, 1, 1 + Math.cos(i * 2 + d) * 0.05)
      dummy.updateMatrix()
      granaMesh.setMatrixAt(i * DISCS + d, dummy.matrix)
    }
  })
  cr.add(granaMesh)
  for (let i = 0; i < GRANA.length - 1; i++) {
    const a = V3(...GRANA[i])
    const b = V3(...GRANA[i + 1])
    const len = a.distanceTo(b)
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.03, 0.16), CM.lamella)
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.rotation.set(0, -Math.atan2(b.z - a.z, b.x - a.x), Math.atan2(b.y - a.y, Math.hypot(b.x - a.x, b.z - a.z)), 'YZX')
    cr.add(m)
  }
  // the starch grain, where finished sugar is kept
  const STARCH = V3(-1.55, 0.55, -0.35)
  const starch = new THREE.Mesh(lumpyGeometry(41, { detail: 20 }), CM.starch)
  starch.position.copy(STARCH)
  cr.add(starch)
  // a few more RuBisCOs in the stroma (a leaf holds a great many), small and still
  for (const [x, y, z, s] of [[-1.55, 1.5, -0.2, 0.32], [-0.6, 2.45, -0.4, 0.28], [-2.3, 1.95, -0.15, 0.26], [-1.0, 1.05, -0.3, 0.24]]) {
    const r = rubisco(CM, blob)
    r.group.scale.setScalar(s)
    r.group.position.set(x, y, z)
    r.spin.rotation.y = x * 3
    cr.add(r.group)
  }
  // RuBisCO, the big one in front
  const RB = V3(0, 1.22, 0.35)
  const machine = rubisco(CM, blob)
  machine.group.position.copy(RB)
  cr.add(machine.group)
  const rbHit = new THREE.Mesh(ball, new THREE.MeshBasicMaterial({ visible: false }))
  rbHit.scale.setScalar(0.62)
  machine.group.add(rbHit)
  // the sugar being built: glucose, its atoms faint until each carbon arrives
  const GL = glucose()
  const GSCALE = 0.28
  const BUILD = V3(1.72, 1.25, 0.55)
  const builder = new THREE.Group()
  builder.position.copy(BUILD)
  builder.rotation.set(-0.25, -0.3, 0)
  cr.add(builder)
  const RAD = { C: 0.36, O: 0.33, H: 0.24 }
  const atomMesh = GL.atoms.map(a => {
    const m = new THREE.Mesh(ball, CM.ghost)
    m.position.set(...a.p).multiplyScalar(GSCALE)
    m.scale.setScalar(RAD[a.el] * GSCALE * 1.25)
    builder.add(m)
    return m
  })
  const bondMesh = GL.bonds.map(([i, j]) => {
    const a = atomMesh[i].position
    const b = atomMesh[j].position
    const d = b.clone().sub(a)
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, d.length(), 8), CM.ghost)
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
    builder.add(m)
    return { m, i, j }
  })
  // which atoms each carbon brings: C1 to C5 round the ring, then C6 with the ring's oxygen (it closes)
  const carbons = GL.atoms.map((a, i) => (a.el === 'C' ? i : -1)).filter(i => i >= 0)
  const RING_O = 5
  const bonded = i => GL.bonds.filter(b => b[0] === i || b[1] === i).map(b => (b[0] === i ? b[1] : b[0]))
  const stepOf = new Array(GL.atoms.length).fill(6)
  carbons.forEach((c, k) => {
    stepOf[c] = k + 1
    for (const n of bonded(c)) {
      if (GL.atoms[n].el === 'C' || n === RING_O) continue
      stepOf[n] = k + 1
      for (const m of bonded(n)) if (GL.atoms[m].el === 'H') stepOf[m] = k + 1
    }
  })
  stepOf[RING_O] = 6
  const carbonSpot = k => builder.localToWorld(atomMesh[carbons[k]].position.clone())
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow(), color: '#ffd84a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.scale.setScalar(2.2)
  halo.raycast = () => {}
  builder.add(halo)
  // the words over it all
  const rbTag = label('RuBisCO', 0.17, '#ffe9a0')
  rbTag.position.set(RB.x, RB.y + 0.72, RB.z + 0.1)
  cr.add(rbTag)
  const chlTag = label(E.catcher.signs.chloroplast, 0.16, '#d8ffc0')
  chlTag.position.set(0, CH.y + CH.b + 0.32, 0)
  cr.add(chlTag)
  const starchTag = label(E.catcher.signs.starch, 0.1, '#fff6dc')
  starchTag.position.set(STARCH.x, STARCH.y + 0.5, STARCH.z + 0.3)
  cr.add(starchTag)
  const sugarTag = label('', 0.11, '#fff2b0', { maxWidth: 1.6 })
  sugarTag.position.set(BUILD.x, BUILD.y + 0.95, BUILD.z)
  cr.add(sugarTag)
  // the sunbeam down onto the chloroplast
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 1 }, uColor: { value: new THREE.Color('#fff6c8') } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float a = uK * (0.3 + 0.7 * vUv.y) * smoothstep(0.0, 0.2, vUv.y);
        gl_FragColor = vec4(uColor, a * 0.2);
      }`,
  })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 3.0, 10.2, 32, 1, true), beamMat)
  beam.position.set(0, 5.3, -0.3)
  cr.add(beam)
  solids.push(circle(ST.catcher.x - 1.4, ST.catcher.z - 0.1, 1.45), circle(ST.catcher.x + 1.4, ST.catcher.z - 0.1, 1.45), circle(ST.catcher.x, ST.catcher.z + 0.35, 0.9))
  // CO2 molecules drifting in front, to be tapped
  // (two near the middle, low and high, where an upright phone's narrow view still has them)
  const HOME = [[-2.5, 0.85, 1.5], [-1.75, 1.95, 1.9], [0.45, 0.42, 1.9], [-2.95, 2.05, 1.0], [1.15, 2.45, 1.75], [2.75, 2.25, 1.25], [2.95, 0.75, 1.45]]
  const ENTRY = cr.worldToLocal(V3(ST.stoma.x, 1.4, ST.stoma.z))
  const slots = HOME.map(([x, y, z], i) => {
    const g = co2Group(A, ball)
    g.position.set(x, y, z)
    cr.add(g)
    return { i, g, home: V3(x, y, z), state: 'free', t: 0, from: V3(), site: 0, ph: i * 1.7 }
  })
  // sparks of energy from the grana to RuBisCO while the light shines
  const SPARKS = 30
  const sparkMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), CM.spark, SPARKS)
  sparkMesh.frustumCulled = false
  sparkMesh.raycast = () => {}
  sparkMesh.count = 0
  cr.add(sparkMesh)
  const sparks = []
  // the carbon atom carried from RuBisCO to the sugar
  const carried = new THREE.Mesh(ball, A.C)
  carried.scale.setScalar(RAD.C * GSCALE * 1.25)
  carried.visible = false
  cr.add(carried)

  const C = { n: 0, p: 0, sent: 0, vis: 0, mine: false, wait: 0, carry: null, done: null, refill: 0, pulse: 0, stalled: false, said: {} }
  const lit = () => SUN.shown >= 0.25
  const freeSlots = () => slots.filter(s => s.state === 'free')
  const catcherHint = () => {
    const H = E.catcher.hints
    if (SUN.k < 0.25) return H.dark
    if (!freeSlots().length) return S.open ? H.wait : H.empty
    return H.tap
  }
  const catcherPanel = l => ({
    title: E.catcher.title,
    color: CATCH_C,
    blocks: [
      {
        slider: {
          label: E.catcher.sunLabel,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(SUN.k * 100),
          onInput: v => {
            setSun(v / 100, false)
            ex.discover('catcher')
          },
          format: v => `${Math.round(v)} %`,
          live: () => Math.round(SUN.k * 100),
        },
      },
      { buttons: [{ label: E.catcher.verbs.feed, onClick: () => catcherStep('co2') }, { label: SUN.k >= 0.5 ? E.catcher.verbs.dim : E.catcher.verbs.bright, onClick: () => catcherStep('beam') }] },
      { rows: [[E.catcher.rows.carbons, fill(E.catcher.rows.of6, { n: C.vis })], [E.catcher.rows.sugars, String(C.sent)]] },
      ...paras(E.catcher.panel[depth(l)]),
    ],
  })
  function launch(slot) {
    slot.state = 'fly'
    slot.t = 0
    slot.from.copy(slot.g.position)
    // the free place on RuBisCO nearest the molecule
    const taken = new Set(slots.filter(s => s.state === 'fly' || s.state === 'held').map(s => s.site))
    let best = 0
    let bd = 99
    machine.sites.forEach((st, i) => {
      if (taken.has(i)) return
      const p = sitePos(i)
      const d = p.distanceTo(slot.g.position)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    slot.site = best
  }
  const sitePos = (i, out = 0.22) => {
    const s = machine.sites[i]
    const a = s.a - machine.spin.rotation.y
    return V3(RB.x + Math.cos(a) * (0.4 + out), RB.y + 0.06, RB.z + Math.sin(a) * (0.4 + out))
  }
  function catcherStep(thing, slotIndex = null) {
    const l = lv()
    C.mine = true
    if (thing === 'beam') {
      const bright = SUN.k < 0.5
      setSun(bright ? 1 : 0.1, true)
      play(bright ? 'select' : 'tap')
      say(at(bright ? E.catcher.says.bright : E.catcher.says.dim, l), CATCH_C)
      refresh(catcherPanel)
      return
    }
    if (C.n - C.p >= 7) return say(at(E.catcher.says.full, l), CATCH_C)
    let slot = slotIndex != null ? slots[slotIndex] : null
    if (!slot || slot.state !== 'free') {
      const free = freeSlots()
      if (!free.length) return say(at(S.open ? E.catcher.says.wait : E.catcher.says.empty, l), CATCH_C)
      // the one nearest RuBisCO
      slot = free.sort((a, b) => a.g.position.distanceTo(RB) - b.g.position.distanceTo(RB))[0]
    }
    launch(slot)
    C.n++
    play('tap')
    if (!lit()) say(at(E.catcher.says.dark, l), CATCH_C)
    else if (C.n === 1 || !C.said.first) {
      C.said.first = true
      say(at(E.catcher.says.first, l), CATCH_C)
    }
    share('catcher')
    findOnce('catcher', catcherPanel, 3.2)
  }
  ex.add({
    id: 'catcher',
    x: ST.catcher.stand.x,
    z: ST.catcher.stand.z,
    radius: 2.1,
    label: E.catcher.label,
    verb: catcherHint,
    manual: true,
    focus: { x: ST.catcher.x + 0.7, y: 1.35, z: ST.catcher.z + 0.6, size: 3.5 },
    act: () => ctx.showPanel(catcherPanel),
  })
  for (const s of slots) clickable(s.g, () => catcherStep('co2', s.i), { when: () => s.state === 'free' })
  clickable(machine.group, () => catcherStep('co2'))
  clickable(beam, () => catcherStep('beam'), { reach: 7, accept: h => h.point.y > 3.1 })

  const setVis = v => {
    C.vis = v
    atomMesh.forEach((m, i) => {
      const on = stepOf[i] <= v
      m.material = on ? A[GL.atoms[i].el] : CM.ghost
    })
    for (const b of bondMesh) b.m.material = stepOf[b.i] <= v && stepOf[b.j] <= v ? CM.bond : CM.ghost
    const t = fill(E.catcher.signs.sugar, { n: v })
    if (sugarTag.text !== t) {
      sugarTag.text = t
      sugarTag.sync()
    }
    refresh(catcherPanel)
  }
  setVis(0)
  const starchSize = () => 1 + Math.min(10, C.sent) * 0.045
  const SUGAR_T = 2.6
  updates.push((dt, t) => {
    const on = lit()
    // stalling in the dark, and going again in the light
    if (!on && C.n > C.p && !C.stalled) {
      C.stalled = true
      if (C.mine) say(at(E.catcher.says.stall, lv()), CATCH_C)
    }
    if (on && C.stalled) {
      C.stalled = false
      if (C.mine && C.n > C.p) say(at(E.catcher.says.going, lv()), CATCH_C)
    }
    machine.spin.rotation.y += dt * 0.35 * SUN.shown
    const glow = on ? 0.55 + 0.45 * Math.sin(t * 4) : 0.15
    CM.site.color.setRGB(1 * glow + 0.1, 0.85 * glow + 0.08, 0.3 * glow)
    CM.grana.emissiveIntensity = lerp(0.03, 0.45, SUN.shown)
    CM.lamella.emissiveIntensity = lerp(0.03, 0.45, SUN.shown)
    beamMat.uniforms.uK.value = SUN.shown
    // the pulse when it catches one
    C.pulse = Math.max(0, C.pulse - dt * 2.5)
    machine.group.scale.setScalar(1 + 0.09 * Math.sin(C.pulse * Math.PI))
    machine.group.position.y = RB.y + Math.sin(t * 1.1) * 0.03
    // molecules: drifting, flying in, held on RuBisCO, coming in from the stoma
    for (const s of slots) {
      if (s.state === 'free') {
        s.g.visible = true
        s.g.position.copy(s.home).add(V3(Math.sin(t * 0.6 + s.ph) * 0.12, Math.sin(t * 0.8 + s.ph * 2) * 0.1, Math.cos(t * 0.5 + s.ph) * 0.1))
        s.g.rotation.set(Math.sin(t * 0.3 + s.ph) * 0.6, t * 0.4 + s.ph, 0.3)
        s.g.scale.setScalar(1)
      } else if (s.state === 'fly') {
        s.t += dt / 0.8
        const k = ease(clamp(s.t))
        s.g.position.copy(s.from).lerp(sitePos(s.site), k)
        s.g.position.y += Math.sin(Math.PI * k) * 0.25
        if (s.t >= 1) s.state = 'held'
      } else if (s.state === 'held') {
        s.g.position.copy(sitePos(s.site, 0.2))
        s.g.rotation.set(0, -(machine.sites[s.site].a - machine.spin.rotation.y), 0)
      } else if (s.state === 'gone') {
        s.g.visible = false
      } else if (s.state === 'come') {
        s.t += dt / 2.6
        const k = ease(clamp(s.t))
        s.g.visible = true
        s.g.position.copy(ENTRY).lerp(s.home, k)
        s.g.scale.setScalar(Math.min(1, s.t * 3))
        if (s.t >= 1) s.state = 'free'
      }
    }
    // more comes in through the stoma while it is open
    if (S.k > 0.5) {
      C.refill += dt * S.k
      const gone = slots.find(s => s.state === 'gone')
      if (C.refill > 1.4 && gone) {
        C.refill = 0
        gone.state = 'come'
        gone.t = 0
      }
    } else C.refill = 0
    // catching: one at a time, as fast as the light allows, while the sugar has room
    C.wait = Math.max(0, C.wait - dt)
    const room = C.p - 6 * C.sent < 6 && !C.done
    if (on && C.n > C.p && room && C.wait <= 0 && !C.carry) {
      const held = slots.find(s => s.state === 'held')
      const flying = slots.some(s => s.state === 'fly')
      if (held || !flying) {
        if (held) held.state = 'gone'
        C.p++
        C.pulse = 1
        C.wait = 0.7 / Math.max(0.3, SUN.shown)
        C.carry = { t: 0, k: (C.p - 1) % 6 }
        play('join')
      }
    }
    if (C.carry) {
      C.carry.t += dt / 0.65
      const k = ease(clamp(C.carry.t))
      carried.visible = true
      const to = cr.worldToLocal(carbonSpot(C.carry.k))
      carried.position.copy(RB).lerp(to, k)
      carried.position.y += Math.sin(Math.PI * k) * 0.3
      if (C.carry.t >= 1) {
        carried.visible = false
        const k6 = C.carry.k
        C.carry = null
        setVis(k6 + 1)
        if (k6 + 1 >= 6) {
          C.done = { t: 0 }
          play('celebrate')
          if (C.mine) say(at(E.catcher.says.sugar, lv()), CATCH_C)
        }
      }
    }
    // a finished sugar glows, then goes into the starch grain
    if (C.done) {
      C.done.t += dt
      const u = C.done.t / SUGAR_T
      halo.material.opacity = 0.75 * span(0, 0.15, u) * (1 - span(0.45, 0.6, u))
      const go = span(0.5, 0.95, u)
      builder.position.copy(BUILD).lerp(STARCH, go)
      builder.scale.setScalar(1 - 0.85 * go)
      if (u >= 1) {
        C.done = null
        C.sent++
        builder.position.copy(BUILD)
        builder.scale.setScalar(1)
        setVis(0)
      }
    } else halo.material.opacity = 0
    starch.scale.set(0.42 * starchSize(), 0.3 * starchSize(), 0.32 * starchSize())
    // sparks of energy from the grana
    if (on && sparks.length < SPARKS && Math.random() < dt * 9 * SUN.shown) {
      const gr = GRANA[Math.floor(Math.random() * GRANA.length)]
      sparks.push({ from: V3(...gr), t: 0, arc: 0.3 + Math.random() * 0.4 })
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].t += dt / 1.1
      if (sparks[i].t >= 1) sparks.splice(i, 1)
    }
    sparkMesh.count = sparks.length
    sparks.forEach((s, i) => {
      const k = ease(s.t)
      dummy.position.copy(s.from).lerp(RB, k)
      dummy.position.y += Math.sin(Math.PI * k) * s.arc
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(1 - 0.5 * k)
      dummy.updateMatrix()
      sparkMesh.setMatrixAt(i, dummy.matrix)
    })
    sparkMesh.instanceMatrix.needsUpdate = true
  })

  // ======== the room's own life: the stage, and the sun ========
  updates.push((dt, t) => stage.update(t, ctx.camera))

  const catcherState = () => ({ n: C.n, p: C.p })
  const willowState = () => ({ year: WL.year, phase: WL.phase, n: WL.n })
  const stomaState = () => ({ open: S.open, dry: Math.round(S.dry * 100) / 100, water: Math.round(S.water * 100) / 100, n: S.n })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.8 },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: 2.0, z: 4.3, yaw: Math.atan2(2.0, -1.0) },
    back: { x: 0, z: 9.4, rot: Math.PI },
    stand: { x: -2.1, z: 4.1, rot: Math.atan2(2.1, 1.6) },
    parts: {
      willow: {
        tap: thing => willowTap(thing), // 'can', 'tree', 'scale', 'pot'
        step: s => willowStep(s), // the panel's buttons: 'water', 'weigh', 'sort', 'again'
        years: v => setYear(v), // the panel's slider
        get state() { return { ...willowState(), busy: !!WL.anim } },
        at: thing => ({ can, tree: tree.group, scale, pot })[thing].localToWorld(V3(0, thing === 'tree' ? 1.0 : 0.3, 0)),
      },
      stoma: {
        tap: thing => stomaStep(thing), // 'stoma', 'dry'
        dry: v => setDry(v, true), // the panel's slider, 0 to 1
        get state() { return stomaState() },
        at: () => sr.localToWorld(V3(0.4, 0.5, 0)),
      },
      catcher: {
        tap: (thing, i) => catcherStep(thing, i), // 'co2' (a slot, or the nearest), 'beam'
        sun: v => setSun(v, true), // the panel's slider, 0 to 1
        get state() { return { ...catcherState(), vis: C.vis, sent: C.sent, sun: SUN.k, free: freeSlots().length } },
        at: i => slots[i].g.getWorldPosition(V3()),
        rbAt: () => machine.group.getWorldPosition(V3()),
        beamAt: () => cr.localToWorld(V3(0, 5.5, 1.6)),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { willow: willowPanel, stoma: stomaPanel, catcher: catcherPanel },
    shared: {
      sun: {
        get: () => ({ sun: Math.round(SUN.k * 100) / 100 }),
        set: (s, live) => {
          SUN.k = clamp(Number(s?.sun ?? 1))
          SUN.mine = false
          if (!live) SUN.shown = SUN.k
          refresh(catcherPanel)
        },
      },
      willow: {
        get: willowState,
        set: (s, live) => {
          const year = clamp(Math.round((Number(s?.year) || 0) * 10) / 10, 0, 5)
          const phase = ['grow', 'weighed', 'sorted'].includes(s?.phase) ? s.phase : 'grow'
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          WL.mine = false
          if (live && n === WL.n + 1 && phase === 'grow' && WL.phase === 'grow' && year === Math.floor(WL.year + 1e-6) + 1) startAnim('year', WL.year, 0, true)
          else if (live && n === WL.n + 1 && phase === 'weighed' && WL.phase === 'grow') startAnim('weigh', 5, 0, true)
          else if (live && n === WL.n + 1 && phase === 'sorted' && WL.phase === 'weighed') startAnim('sort', 5, 0, true)
          else if (live && n === WL.n + 1 && phase === 'grow' && year === 0 && WL.phase !== 'grow') startAnim('again', 0, 0, true)
          else {
            WL.anim = null
            if (!live) WL.shown = year
          }
          WL.year = year
          WL.phase = phase
          WL.n = n
          WL.said = true
          refresh(willowPanel)
        },
      },
      stoma: {
        get: stomaState,
        set: (s, live) => {
          S.open = !!s?.open
          S.dry = clamp(Number(s?.dry ?? 0.3))
          S.water = clamp(Number(s?.water ?? 1))
          S.n = Math.max(0, Math.round(Number(s?.n) || 0))
          S.mine = false
          if (!live) {
            S.k = S.open ? 1 : 0
            flowing.length = 0
          }
          refresh(stomaPanel)
        },
      },
      catcher: {
        get: catcherState,
        set: (s, live) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const p = clamp(Math.round(Number(s?.p) || 0), 0, n)
          C.mine = false
          if (live && n > C.n) {
            // someone caught one: a molecule here flies in too
            for (let k = 0; k < Math.min(3, n - C.n); k++) {
              const free = freeSlots().sort((a, b) => a.g.position.distanceTo(RB) - b.g.position.distanceTo(RB))
              if (free.length) launch(free[0])
            }
            play('tap')
          }
          C.n = n
          if (!live) {
            // as it stands: the sugars made, the carbons in this one, the molecules waiting on RuBisCO
            C.p = p
            C.sent = Math.floor(p / 6)
            C.carry = null
            C.done = null
            carried.visible = false
            builder.position.copy(BUILD)
            builder.scale.setScalar(1)
            for (const sl of slots) sl.state = 'free'
            const waiting = Math.min(slots.length, n - p)
            for (let k = 0; k < waiting; k++) {
              slots[k].state = 'held'
              slots[k].site = k
            }
            setVis(p % 6)
          } else if (p > C.p + 1 && !C.carry && !C.done) {
            // far behind the one who did it (this screen was asleep): catch up at once
            C.p = p
            C.sent = Math.floor(p / 6)
            setVis(p % 6)
          }
          refresh(catcherPanel)
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (sunSend) clearTimeout(sunSend)
      if (yearSend) clearTimeout(yearSend)
      if (drySend) clearTimeout(drySend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
