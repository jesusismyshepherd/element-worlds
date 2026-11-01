// Krypton's picture "Can a noble gas hold hands?" as a room (docs/knowledge/picture-rooms.md): the picture
// made into a chemistry laboratory of 1963, the year krypton first joined another atom, with a door onto
// a laser room of the 1990s where the same two atoms hold hands for a few nanoseconds (stages/lab.js, its
// look kept, dressed with a nickel vacuum line, gas cylinders, a liquid nitrogen bath and a UV lamp). Three
// things to do, each step chosen by tapping its thing; the prompt names the next tap, E opens the
// station's panel, whose buttons (and a slider) do the same:
// - the cold bulb, back left: tap the krypton cylinder, then the fluorine cylinder (the gases run down the
//   pipes into the quartz bulb), chill the bulb (tap the liquid nitrogen or the dry ice; tap the bulb to
//   lift it out into the room), tap the UV lamp and colourless crystals of KrF2 grow on the cold wall (a
//   lens shows the F-Kr-F molecules packing). Warm, they fall apart, sped up (the temperature slider, or
//   lift the bulb out); tap the gold leaf and it is eaten (7 KrF2 + 2 Au);
// - "Who will hold hands?", the bench on the east wall: six bulbs, helium to radon, each atom at its true
//   size (van der Waals radius) with its outer electrons, and behind them the first ionisation energy as a
//   bar; tap a bulb to offer it fluorine: helium and neon never, argon only frozen as HArF, krypton, xenon
//   and radon take it;
// - the laser room (a doorway in the partition, back right): tap the KrF laser (the discharge): in the gas
//   an excited krypton and a fluorine join and spring apart in a flash of 248 nm light (a magnifier shows
//   one cycle, slowed down); tap the card to see the invisible beam (it fluoresces), tap the lens to print
//   the mask's pattern, four times smaller, die by die onto a wafer; a slider sets the pulse rate.
// All three are shared in a room (src/net/shared.js). parts.<station>.tap(...) does what a tap does.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, random } from '../../../wings/noble/kit.js'
import { element } from '../../../../data/elements.js'
import { labStage } from '../../stages/lab.js'
import { ease, motes } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { HANDS_WORDS } from './hands.words.js'

export const WORDS = HANDS_WORDS

const TAU = Math.PI * 2
const UP = new THREE.Vector3(0, 1, 0)

// ---- where things stand (metres; the spawn at z = 2.6 looks along -z, into the picture) ----
const ROOM = { x0: -5.6, x1: 5.6, z0: -5.4, z1: 5.8, h: 3.2 }
const TOP = 0.9 // every bench's top
// station 1: the vacuum line along the north wall; the bulb moves between three places
const BENCH1 = { x0: -3.9, x1: -0.1, z: -5.05 }
const SPOT = { dewar: { x: -3.25, y: 1.04, T: -196 }, ice: { x: -2.4, y: 1.04, T: -78 }, air: { x: -1.6, y: 1.19, T: 25 } }
const VZ = -5.05 // the bulb's z
const NECK = 0.3 // the bulb's neck above its centre
const PORT = { x: -2.9, y: 1.5, z: -5.28 } // where the pipes meet and the hose starts
const CYL = { kr: { x: -4.2, z: -5.12, h: 1.4, r: 0.11 }, f2: { x: -5.05, z: -5.02, h: 1.3, r: 0.1 } }
const GOLD_AT = { x: -0.95, z: -4.95 }
const LENS1 = { x: -0.45, z: -4.95, y: 1.4, r: 0.27 }
const VRAD = 0.105 // the bulb's radius
const KMAX = 70 // crystals when full
const SPEED = 0.05 // crystals lost a second at room temperature (a second here is half an hour: 10% an hour)
// station 2: six bulbs along the east wall
const GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']
const BENCH2 = { x: 5.25, z0: -1.6, z1: 3.2 }
const bulbZ = i => -1.2 + i * 0.8
const BX = 5.15 // the bulbs' x
const BY = 1.17 // the bulbs' centre height
const BR = 0.2 // glass radius
const RSC = 0.00068 // metres per picometre: van der Waals radii drawn at one scale
const BAR0 = 1.5 // the bars stand from here
const BARSC = 0.04 // metres per eV
const OUTCOME = { He: 'none', Ne: 'none', Ar: 'ice', Kr: 'ok', Xe: 'ok', Rn: 'ok' }
// station 3: the laser room, a partition with a doorway at the back right
const PART = { z: -2.7, x0: 1.4, gap0: 1.9, gap1: 5.0, top: 2.4 } // a wide doorway: the camera of the station view backs through it
const OT = { x0: 1.6, x1: 5.3, z: -4.65, w: 0.9 }
const BEAM_Y = 1.15
const LASER = { x: 2.25, len: 1.1, ap: 2.8 }
const CARD_X = 3.2
const MASK_X = 3.65
const LENS_X = 4.15
const WAFER_X = 4.85
const RING = { x: 2.25, y: 1.9, z: -4.65, r: 0.3 }
const DIE = 0.08 // a die's cell on the wafer
const PULSES = 6 // pulses a die takes
const KR_COL = '#7fd0ee'
const F_COL = '#90e050'
const PINK = '#ff5fb0'
const VIOLET = '#b46cff'

const disposers = []
function soft() {
  const t = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  disposers.push(t)
  return t
}

/** A cylinder of unit height placed between two points. */
function stretch(obj, a, b) {
  obj.position.copy(a).add(b).multiplyScalar(0.5)
  obj.scale.set(1, Math.max(0.0001, a.distanceTo(b)), 1)
  obj.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize())
}

export async function build({ ctx, root, E, W, ex, say, light, level, color, clickable }) {
  const stage = labStage({
    light,
    ...ROOM,
    panels: [-3, 0, 3].flatMap(x => [-3.4, -0.4, 2.6].map(z => ({ x, z }))),
    lights: [{ x: -2.6, z: -3.4, intensity: 4.2 }, { x: 3.2, z: 0.4, intensity: 3.6 }, { x: 3.3, z: -3.9, intensity: 2.4 }, { x: -1.5, z: 1.4, intensity: 3.2 }],
    windows: [{ side: 'w', at: -3.4, width: 1.4 }, { side: 'w', at: 2.2, width: 1.4 }],
    door: { side: 'e', at: 4.8 },
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const glow = soft()
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o })
  const glass = (c = '#d8eef4', op = 0.2) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.06, metalness: 0.1, transparent: true, opacity: op, depthWrite: false, envMap: stage.shine, envMapIntensity: 1.2 })
  const glowMat = (c, k = 1.6) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: k, roughness: 0.4 })
  const sprite = (c, size, op = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: c, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(size)
    return s
  }
  const mk = (geo, mat, x, y, z, parent = root) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const narrow = () => (ctx.camera?.aspect ?? 1.6) < 1
  const focusBy = (item, wide, tall) => Object.defineProperty(item, 'focus', { get: () => (narrow() ? tall() : wide), configurable: true })
  const tag = (text, x, y, z, rotY, size = 0.075, c = '#e8ecf6') => {
    const t = makeText(text, { size, color: c, anchorY: 'middle', outlineWidth: size * 0.07, outlineColor: '#141826' })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    root.add(t)
    return t
  }
  const setText = (t, s) => {
    if (t.text === s) return
    t.text = s
    t.sync()
  }
  const hit = (w, h, d, x, y, z, parent = root) => mk(new THREE.BoxGeometry(w, h, d), ghost, x, y, z, parent)
  const refresh = (title, panel) => ctx.store.get().panel?.title === title && ctx.showPanel(panel)
  const minus = n => `${n < 0 ? '−' : ''}${Math.abs(Math.round(n))} °C`
  const bench = (x0, x1, z0, z1, parent = root) => {
    const w = x1 - x0
    const d = z1 - z0
    mk(new THREE.BoxGeometry(w, TOP - 0.05, d - 0.04), mats.paint, (x0 + x1) / 2, (TOP - 0.05) / 2, (z0 + z1) / 2, parent)
    mk(new THREE.BoxGeometry(w + 0.04, 0.05, d + 0.04), mats.dark, (x0 + x1) / 2, TOP - 0.025, (z0 + z1) / 2, parent)
    solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, w, d))
  }

  // ======== 1963 on the walls: a chalkboard, the room's clock ========
  {
    const board = new THREE.Group()
    mk(new THREE.BoxGeometry(1.9, 1.0, 0.04), M('#2b3a33', { roughness: 0.9 }), 0, 0, 0, board)
    mk(new THREE.BoxGeometry(1.98, 0.04, 0.06), M('#8a6440'), 0, -0.52, 0.01, board)
    const t1 = makeText('1963', { size: 0.2, color: '#f0f0e0', anchorY: 'middle' })
    t1.position.set(-0.55, 0.26, 0.03)
    const t2 = makeText('Kr + F2 = KrF2', { size: 0.14, color: '#f0f0e0', anchorY: 'middle' })
    t2.position.set(0, -0.12, 0.03)
    const t3 = makeText('KrF4 ?', { size: 0.11, color: '#c8c8b8', anchorY: 'middle' })
    t3.position.set(0.5, 0.28, 0.03)
    board.add(t1, t2, t3)
    stage.onWall(board, 'w', -0.8, 1.7, 0.03)
  }

  // ======== station 1: the cold bulb ========
  const S1 = { kr: 0, f2: 0, K: 0, T: 25, spot: 'air', gold: 0, lamp: 0 }
  const live1 = { Tnow: 25, frost: 0, flowKr: 0, flowF2: 0, grew: false, heldSaid: false, moveK: 1, from: null, vz: 0, goldK: 0, goldDone: 0, lampK: 0, dipTimer: 0 }
  bench(BENCH1.x0, BENCH1.x1, -5.4, -4.7)
  // the cylinders: krypton in a strapped steel one, fluorine in a ventilated cabinet
  const cylinder = (spec, col, label, parent = root) => {
    const g = new THREE.Group()
    g.position.set(spec.x, 0, spec.z)
    const body = mk(new THREE.CylinderGeometry(spec.r, spec.r, spec.h, 22), M(col, { roughness: 0.4, metalness: 0.4 }), 0, spec.h / 2, 0, g)
    mk(new THREE.SphereGeometry(spec.r, 22, 10, 0, TAU, 0, Math.PI / 2), M(col, { roughness: 0.4, metalness: 0.4 }), 0, spec.h, 0, g)
    mk(new THREE.CylinderGeometry(0.03, 0.035, 0.12, 12), mats.steel, 0, spec.h + spec.r + 0.04, 0, g)
    const wheel = mk(new THREE.TorusGeometry(0.05, 0.008, 8, 18), M('#c0322a', { roughness: 0.5 }), 0, spec.h + spec.r + 0.11, 0, g)
    wheel.rotation.x = Math.PI / 2
    const t = makeText(label, { size: 0.09, color: '#f4f4ec', anchorY: 'middle', outlineWidth: 0.006, outlineColor: '#102030' })
    t.position.set(0, spec.h * 0.72, spec.r + 0.004)
    g.add(t)
    parent.add(g)
    return { g, body, wheel }
  }
  const krCyl = cylinder(CYL.kr, '#3a7f96', 'Kr')
  solids.push(circle(CYL.kr.x, CYL.kr.z, CYL.kr.r + 0.08))
  // a chain round it
  mk(new THREE.TorusGeometry(CYL.kr.r + 0.01, 0.006, 6, 24), mats.steel, CYL.kr.x, 0.9, CYL.kr.z, root).rotation.x = Math.PI / 2
  {
    // the ventilated cabinet: steel frame, glass door, louvres, a duct to the ceiling
    const c = CYL.f2
    const cab = new THREE.Group()
    cab.position.set(c.x, 0, c.z - 0.0)
    const W = 0.8
    const D = 0.62
    const Hh = 1.9
    mk(new THREE.BoxGeometry(0.04, Hh, D), mats.steel, -W / 2, Hh / 2, 0, cab)
    mk(new THREE.BoxGeometry(0.04, Hh, D), mats.steel, W / 2, Hh / 2, 0, cab)
    mk(new THREE.BoxGeometry(W, 0.04, D), mats.steel, 0, Hh, 0, cab)
    mk(new THREE.BoxGeometry(W, 0.06, D), mats.steel, 0, 0.03, 0, cab)
    mk(new THREE.BoxGeometry(W, Hh, 0.03), mats.paint, 0, Hh / 2, -D / 2, cab)
    mk(new THREE.BoxGeometry(W - 0.06, Hh - 0.1, 0.02), glass('#cfe8e0', 0.14), 0, Hh / 2, D / 2 - 0.01, cab)
    for (let i = 0; i < 6; i++) mk(new THREE.BoxGeometry(W - 0.2, 0.018, 0.012), mats.steel, 0, 1.55 + i * 0.05, D / 2 + 0.005, cab)
    mk(new THREE.CylinderGeometry(0.1, 0.1, 1.3, 14), M('#4a4a42', { roughness: 0.8 }), 0, Hh + 0.65, 0, cab)
    root.add(cab)
    solids.push(box(c.x, c.z, W, D))
    cab.userData.c = c
  }
  const f2Cyl = cylinder({ ...CYL.f2, z: CYL.f2.z }, '#9bd23c', 'F2')
  tag('F2', CYL.f2.x, 2.22, CYL.f2.z + 0.34, 0, 0.12)
  // the pipes (nickel) from the cylinders to the port, the hose to the bulb
  const pipe = (a, b, r = 0.014) => {
    const m = mk(new THREE.CylinderGeometry(r, r, 1, 8), mats.steel, 0, 0, 0)
    stretch(m, a, b)
    return m
  }
  {
    const pk = [new THREE.Vector3(CYL.kr.x, CYL.kr.h + 0.3, CYL.kr.z), new THREE.Vector3(CYL.kr.x, 1.62, PORT.z), new THREE.Vector3(PORT.x, 1.62, PORT.z), new THREE.Vector3(PORT.x, PORT.y, PORT.z)]
    const pf = [new THREE.Vector3(CYL.f2.x, 1.75, CYL.f2.z - 0.1), new THREE.Vector3(CYL.f2.x, 1.75, PORT.z), new THREE.Vector3(PORT.x, 1.75, PORT.z), new THREE.Vector3(PORT.x, PORT.y, PORT.z)]
    // hidden inside the cabinet the cylinder's pipe runs to the wall
    for (const p of [pk, pf]) for (let i = 0; i < p.length - 1; i++) pipe(p[i], p[i + 1])
    live1.pathKr = pk
    live1.pathF2 = pf
    mk(new THREE.SphereGeometry(0.035, 12, 8), mats.steel, PORT.x, PORT.y, PORT.z)
  }
  const hose = mk(new THREE.CylinderGeometry(0.01, 0.01, 1, 8), M('#cfd4d8', { roughness: 0.6 }), 0, 0, 0)
  // the Dewar of liquid nitrogen (glass, so the bulb shows), the dry ice box, the clamp stand
  const dewar = new THREE.Group()
  dewar.position.set(SPOT.dewar.x, TOP, VZ)
  mk(new THREE.CylinderGeometry(0.2, 0.18, 0.42, 28, 1, true), glass('#e8f4ff', 0.2), 0, 0.21, 0, dewar).material.side = THREE.DoubleSide
  mk(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24), mats.steel, 0, 0.01, 0, dewar)
  mk(new THREE.TorusGeometry(0.2, 0.012, 8, 28), mats.steel, 0, 0.42, 0, dewar).rotation.x = Math.PI / 2
  const ln2 = mk(new THREE.CylinderGeometry(0.187, 0.173, 0.27, 28), glass('#bfe8ff', 0.4), 0, 0.155, 0, dewar)
  root.add(dewar)
  const iceBox = new THREE.Group()
  iceBox.position.set(SPOT.ice.x, TOP, VZ)
  {
    const foam = M('#d8d6cc', { roughness: 0.95 })
    mk(new THREE.BoxGeometry(0.56, 0.03, 0.44), foam, 0, 0.015, 0, iceBox)
    for (const [w, d, x, z] of [[0.56, 0.03, 0, 0.205], [0.56, 0.03, 0, -0.205], [0.03, 0.44, 0.265, 0], [0.03, 0.44, -0.265, 0]]) mk(new THREE.BoxGeometry(w, 0.24, d), foam, x, 0.12, z, iceBox)
    const rnd = random(5)
    for (let i = 0; i < 9; i++) mk(new THREE.BoxGeometry(0.07 + rnd() * 0.05, 0.05 + rnd() * 0.04, 0.07 + rnd() * 0.05), M('#eef4f8', { roughness: 0.35 }), (rnd() - 0.5) * 0.4, 0.12 + rnd() * 0.1, (rnd() - 0.5) * 0.28, iceBox).rotation.y = rnd() * 3
  }
  root.add(iceBox)
  mk(new THREE.CylinderGeometry(0.15, 0.17, 0.02, 20), mats.steel, SPOT.air.x, TOP + 0.01, VZ)
  mk(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), mats.steel, SPOT.air.x, TOP + 0.14, VZ - 0.14)
  mk(new THREE.TorusGeometry(0.09, 0.008, 8, 20), mats.steel, SPOT.air.x, 1.04, VZ).rotation.x = Math.PI / 2
  const mist = [motes({ count: 40, radius: 0.1, y0: 0, y1: 0.3, color: '#e8f4ff', size: 0.03, opacity: 0.3, speed: 0.5, light }), motes({ count: 40, radius: 0.12, y0: 0, y1: 0.3, color: '#e8f4ff', size: 0.03, opacity: 0.3, speed: 0.5, light })]
  for (const m of mist) m.group.scale.set(0.4, 1, 0.4)
  mist[0].group.position.set(SPOT.dewar.x, TOP + 0.4, VZ)
  mist[1].group.position.set(SPOT.ice.x, TOP + 0.24, VZ)
  root.add(mist[0].group, mist[1].group)
  tag(E.make.tags.ln2, SPOT.dewar.x, 0.78, -4.68, 0, 0.055)
  tag(E.make.tags.ice, SPOT.ice.x, 0.78, -4.68, 0, 0.055)
  tag(E.make.tags.air, SPOT.air.x, 0.78, -4.68, 0, 0.055)
  // the UV lamp: a tube under a hood, hung over the three places
  const lamp = new THREE.Group()
  lamp.position.set(-2.45, 1.7, -4.88)
  mk(new THREE.BoxGeometry(2.1, 0.12, 0.16), mats.steel, 0, 0.07, -0.03, lamp)
  const tube = mk(new THREE.CylinderGeometry(0.022, 0.022, 2.0, 12), glowMat('#8a7fb0', 0.15), 0, -0.02, 0, lamp)
  tube.rotation.z = Math.PI / 2
  const lampHalo = sprite(VIOLET, 1.3, 0)
  lampHalo.position.set(0, -0.15, 0.05)
  lamp.add(lampHalo)
  root.add(lamp)
  const uvLight = new THREE.PointLight(VIOLET, 0, 2.6, 1.6)
  uvLight.position.set(-2.45, 1.4, -4.55)
  root.add(uvLight)
  tag(E.make.tags.lamp, -2.45, 1.95, -4.8, 0, 0.07)
  // the gold leaf on a stand
  const leaf = new THREE.Group()
  const leafMat = new THREE.MeshStandardMaterial({ color: '#ffd166', metalness: 0.9, roughness: 0.25, emissive: '#6b4a00', emissiveIntensity: 0.4, side: THREE.DoubleSide, transparent: true })
  const leafMesh = mk(new THREE.PlaneGeometry(0.13, 0.15, 4, 4), leafMat, 0, 0, 0, leaf)
  {
    const p = leafMesh.geometry.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 40) * 0.006 + Math.cos(p.getY(i) * 30) * 0.005)
    leafMesh.geometry.computeVertexNormals()
  }
  root.add(leaf)
  mk(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 14), mats.steel, GOLD_AT.x, TOP + 0.01, GOLD_AT.z)
  mk(new THREE.CylinderGeometry(0.008, 0.008, 0.4, 8), mats.steel, GOLD_AT.x, TOP + 0.2, GOLD_AT.z)
  const leafHome = new THREE.Vector3(GOLD_AT.x, TOP + 0.42, GOLD_AT.z + 0.03)
  leaf.position.copy(leafHome)
  tag(E.make.tags.gold, GOLD_AT.x, 0.78, -4.68, 0, 0.055)
  const goldHit = hit(0.2, 0.3, 0.2, GOLD_AT.x, TOP + 0.35, GOLD_AT.z)
  // the bulb: quartz, a neck, crystals on its cold wall, gas inside
  const vessel = new THREE.Group()
  root.add(vessel)
  mk(new THREE.SphereGeometry(VRAD, 24, 16), glass('#dff0ff', 0.3), 0, 0, 0, vessel)
  mk(new THREE.CylinderGeometry(0.012, 0.012, NECK, 10), glass('#e8f4ff', 0.35), 0, NECK / 2 + VRAD * 0.6, 0, vessel)
  mk(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 10), mats.steel, 0, NECK + VRAD * 0.6, 0, vessel)
  const frost = mk(new THREE.SphereGeometry(VRAD * 1.03, 20, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }), 0, 0, 0, vessel)
  const crystals = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), M('#f4f8fc', { roughness: 0.25, emissive: '#aab8c8', emissiveIntensity: 0.35 }), KMAX)
  crystals.frustumCulled = false
  vessel.add(crystals)
  const cDummy = new THREE.Object3D()
  {
    const rnd = random(33)
    for (let i = 0; i < KMAX; i++) {
      // on the lower inner wall, clustered
      const a = rnd() * TAU
      const u = 0.25 + rnd() * 0.75
      const polar = Math.acos(-u)
      const r = VRAD * 0.86
      cDummy.position.set(Math.sin(polar) * Math.cos(a) * r, Math.cos(polar) * r, Math.sin(polar) * Math.sin(a) * r)
      cDummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
      const s = 0.004 + rnd() * 0.007
      cDummy.scale.set(s, s * (1 + rnd() * 1.6), s)
      cDummy.updateMatrix()
      crystals.setMatrixAt(i, cDummy.matrix)
    }
    crystals.count = 0
  }
  const NGAS = 22
  const gasKr = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), M(KR_COL, { roughness: 0.4, emissive: KR_COL, emissiveIntensity: 0.35 }), NGAS)
  const gasF = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), M(F_COL, { roughness: 0.4, emissive: F_COL, emissiveIntensity: 0.35 }), NGAS * 2)
  gasKr.frustumCulled = gasF.frustumCulled = false
  vessel.add(gasKr, gasF)
  const gseed = Array.from({ length: NGAS * 2 }, () => [Math.random() * 6, Math.random() * 6, Math.random() * 6, 0.6 + Math.random() * 1.2])
  const vHit = hit(0.2, 0.34, 0.2, 0, 0.1, 0, vessel)
  vessel.position.set(SPOT.air.x, SPOT.air.y, VZ)
  // the lens: a round glass on a stand with the packed F-Kr-F molecules behind it
  const lens1 = new THREE.Group()
  lens1.position.set(LENS1.x, LENS1.y, LENS1.z)
  {
    mk(new THREE.CylinderGeometry(0.015, 0.02, LENS1.y - TOP, 8), mats.steel, 0, -(LENS1.y - TOP) / 2 - 0.0, -0.02, lens1)
    mk(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), mats.steel, 0, -(LENS1.y - TOP), -0.02, lens1)
    const disc = mk(new THREE.CylinderGeometry(LENS1.r - 0.02, LENS1.r - 0.02, 0.01, 32), new THREE.MeshBasicMaterial({ color: '#0d1233' }), 0, 0, -0.01, lens1)
    disc.rotation.x = Math.PI / 2
    mk(new THREE.TorusGeometry(LENS1.r, 0.02, 10, 36), mats.steel, 0, 0, 0, lens1)
    mk(new THREE.CircleGeometry(LENS1.r - 0.02, 32), glass('#cfe8ff', 0.12), 0, 0, 0.02, lens1)
  }
  const molecules = []
  {
    const bondMat = M('#d8dce8')
    const krGeo = new THREE.SphereGeometry(0.034, 14, 10)
    const fGeo = new THREE.SphereGeometry(0.02, 12, 8)
    const krMat = M(KR_COL, { roughness: 0.35, emissive: KR_COL, emissiveIntensity: 0.3 })
    const fMat = M(F_COL, { roughness: 0.35, emissive: F_COL, emissiveIntensity: 0.3 })
    const cols = 4
    const rows = 3
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const g = new THREE.Group()
        const x = (c - (cols - 1) / 2) * 0.115 + (r % 2 ? 0.05 : -0.025)
        const y = (r - (rows - 1) / 2) * 0.115
        g.position.set(x, y, 0.005)
        g.rotation.z = (r + c) % 2 ? 0.5 : -0.35
        mk(krGeo, krMat, 0, 0, 0, g)
        for (const s of [-1, 1]) {
          mk(fGeo, fMat, s * 0.058, 0, 0, g)
          const b = mk(new THREE.CylinderGeometry(0.006, 0.006, 0.04, 6), bondMat, s * 0.036, 0, 0, g)
          b.rotation.z = Math.PI / 2
        }
        g.visible = false
        lens1.add(g)
        molecules.push(g)
      }
    }
  }
  root.add(lens1)
  tag(E.make.tags.lens, LENS1.x, 0.78, -4.68, 0, 0.055)
  const lensHit = hit(0.56, 0.56, 0.1, LENS1.x, LENS1.y, LENS1.z)

  // taps on the cylinders, bath, bulb, lamp, gold, lens
  const krHit = hit(0.34, 1.7, 0.34, CYL.kr.x, 0.85, CYL.kr.z)
  const f2Hit = hit(0.85, 1.9, 0.7, CYL.f2.x, 0.95, CYL.f2.z)
  const dewarHit = hit(0.5, 0.45, 0.5, SPOT.dewar.x, TOP + 0.2, VZ)
  const iceHit = hit(0.6, 0.3, 0.5, SPOT.ice.x, TOP + 0.14, VZ)
  const lampHit = hit(2.2, 0.3, 0.3, -2.45, 1.7, -4.88)
  const airHit = hit(0.4, 0.25, 0.3, SPOT.air.x, TOP + 0.12, VZ)

  const spotOf = T => (T < -137 ? 'dewar' : T < -26 ? 'ice' : 'air')
  function moveTo(spot, loud = true) {
    if (live1.target === spot && live1.moveK >= 1) return
    live1.from = vessel.position.clone()
    live1.target = spot
    live1.moveK = 0
    S1.spot = spot
    if (loud) play('tap')
  }
  const kPercent = () => Math.round(S1.K * 100)
  function make1(what, arg) {
    const lv = level()
    live1.touched = true
    const says = E.make.says
    if (what === 'kr') {
      S1.kr = 1
      live1.flowKr = 1
      play('select')
      say(at(says.kr, lv))
    } else if (what === 'f2') {
      S1.f2 = 1
      live1.flowF2 = 1
      play('select')
      say(at(says.f2, lv))
    } else if (what === 'dewar') {
      S1.T = SPOT.dewar.T
      moveTo('dewar')
      say(at(says.dewar, lv))
    } else if (what === 'ice') {
      S1.T = SPOT.ice.T
      moveTo('ice')
      say(at(says.ice, lv))
    } else if (what === 'air') {
      S1.T = SPOT.air.T
      moveTo('air')
      say(at(S1.K > 0.05 ? says.melt : says.air, lv))
    } else if (what === 'vessel') {
      // lifted out into the room, or put back into the liquid nitrogen
      return make1(S1.spot === 'air' ? 'dewar' : 'air')
    } else if (what === 'temp') {
      S1.T = clamp(Number(arg), -196, 25)
      moveTo(spotOf(S1.T), false)
    } else if (what === 'lamp') {
      if (!S1.kr || !S1.f2) say(at(S1.kr ? says.noF2 : says.noKr, lv))
      else {
        S1.lamp = 6
        live1.mine = true
        play('beam')
        say(at(live1.Tnow > -60 ? says.warmLamp : says.lamp, lv))
      }
    } else if (what === 'gold') {
      if (live1.goldK > 0 && live1.goldK < 1) return
      if (S1.gold) {
        S1.gold = 0
        live1.goldK = 0
        play('tap')
      } else if (S1.K < 0.1) say(at(says.noGold, lv))
      else {
        S1.gold = 1
        live1.goldK = 0.0001
        play('select')
        say(at(says.gold, lv))
      }
    } else if (what === 'lens') {
      say(at(S1.K > 0.05 ? says.lens : says.noLens, lv))
    } else if (what === 'reset') {
      S1.kr = S1.f2 = 0
      S1.K = 0
      S1.lamp = 0
      S1.gold = 0
      live1.goldK = 0
      live1.grew = false
      play('tap')
    } else return
    refresh(E.make.title, makePanel)
    ex.discover('make', makePanel, 3.4)
    share('make')
  }
  const makePanel = lv => ({
    title: E.make.title,
    color,
    blocks: [
      {
        slider: { label: E.make.slider, min: -196, max: 25, step: 1, value: S1.T, onInput: v => make1('temp', v), format: minus, live: () => S1.T },
      },
      {
        buttons: [
          { label: E.make.buttons.kr, onClick: () => make1('kr') },
          { label: E.make.buttons.f2, onClick: () => make1('f2') },
          { label: E.make.buttons.lamp, onClick: () => make1('lamp') },
          { label: S1.gold ? E.make.buttons.newGold : E.make.buttons.gold, onClick: () => make1('gold') },
          { label: E.make.buttons.reset, onClick: () => make1('reset') },
        ],
      },
      ...E.make.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(krHit, () => make1('kr'))
  clickable(f2Hit, () => make1('f2'))
  clickable(dewarHit, () => make1('dewar'))
  clickable(iceHit, () => make1('ice'))
  clickable(airHit, () => make1('air'), { when: () => S1.spot !== 'air' })
  clickable(vHit, () => make1('vessel'))
  clickable(lampHit, () => make1('lamp'))
  clickable(goldHit, () => make1('gold'))
  clickable(lensHit, () => make1('lens'))
  const makeHint = () => {
    const h = E.make.hints
    if (!S1.kr) return h.kr
    if (!S1.f2) return h.f2
    if (S1.K < 0.05 && live1.Tnow > -60) return h.cool
    if (S1.K < 0.05) return S1.lamp > 0 ? h.wait : h.lamp
    if (S1.lamp > 0 && S1.K < 0.98) return h.wait
    if (live1.Tnow > -60) return h.melting
    return S1.gold ? h.lift : h.keeps
  }
  const makeItem = ex.add({
    id: 'make',
    x: -2.4,
    z: -3.7,
    radius: 2.6,
    manual: true,
    label: E.make.label,
    verb: makeHint,
    focus: { x: -2.3, y: 1.2, z: -5.0, size: 4.0, width: 4.2 },
    act: () => ctx.showPanel(makePanel),
  })
  focusBy(makeItem, makeItem.focus, () => ({ x: -2.4, y: 1.2, z: -5.0, size: 2.6, width: 2.4 }))
  const makeSet = (s, liveSet) => {
    S1.kr = s?.kr ? 1 : 0
    S1.f2 = s?.f2 ? 1 : 0
    S1.K = clamp(Number(s?.K) || 0)
    S1.T = clamp(Number(s?.T ?? 25), -196, 25)
    S1.gold = s?.gold ? 1 : 0
    S1.lamp = clamp(Number(s?.lamp) || 0, 0, 6)
    if (liveSet) live1.mine = false
    live1.goldK = S1.gold ? (liveSet ? 0.0001 : 1) : 0
    if (!liveSet) {
      live1.Tnow = S1.T
      live1.flowKr = live1.flowF2 = 0
      live1.goldDone = S1.gold ? 1 : 0
    } else {
      if (S1.kr) live1.flowKr = 1
      if (S1.f2) live1.flowF2 = 1
    }
    live1.grew = S1.K > 0.05
    moveTo(spotOf(S1.T), false)
    if (!liveSet) {
      vessel.position.set(SPOT[S1.spot].x, SPOT[S1.spot].y, VZ)
      live1.moveK = 1
    }
  }
  // flowing gas: small beads along each pipe
  const beadGeo = new THREE.SphereGeometry(0.02, 8, 6)
  const beads = { kr: [], f2: [] }
  for (const k of ['kr', 'f2']) {
    for (let i = 0; i < 5; i++) {
      const b = mk(beadGeo, glowMat(k === 'kr' ? KR_COL : F_COL, 0.9), 0, -9, 0)
      beads[k].push(b)
    }
  }
  const pathPoint = (path, tt, out) => {
    // along the pipe's corners, then straight to the bulb's neck
    const pts = [...path, new THREE.Vector3(vessel.position.x, vessel.position.y + NECK + VRAD * 0.6 + 0.02, VZ)]
    const lens = pts.slice(1).map((p, i) => p.distanceTo(pts[i]))
    let d = tt * lens.reduce((a, b) => a + b, 0)
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) return out.lerpVectors(pts[i], pts[i + 1], clamp(d / lens[i]))
      d -= lens[i]
    }
    return out
  }
  const tmp = new THREE.Vector3()
  const tmpP = new THREE.Vector3()
  let lastCrystals = -1
  let gasTime = 0
  updates.push((dt, t) => {
    // the temperature of the bulb follows the bath
    live1.Tnow = damp(live1.Tnow, S1.T, 1.1, dt)
    const Tn = live1.Tnow
    // the bulb travels between its places
    if (live1.moveK < 1) {
      live1.moveK = Math.min(1, live1.moveK + dt / 0.9)
      const k = ease(live1.moveK)
      const to = SPOT[live1.target]
      vessel.position.set(live1.from.x + (to.x - live1.from.x) * k, live1.from.y + (to.y - live1.from.y) * k + Math.sin(Math.PI * k) * 0.28, VZ)
    }
    const top = vessel.position.clone().add(new THREE.Vector3(0, NECK + VRAD * 0.6 + 0.02, 0))
    stretch(hose, new THREE.Vector3(PORT.x, PORT.y, PORT.z), top)
    // crystals grow under the lamp while it is cold enough, and fall apart when warm
    if (S1.lamp > 0) {
      S1.lamp -= dt
      if (S1.kr && S1.f2 && Tn <= -60) {
        S1.K = Math.min(1, S1.K + dt / 6)
        if (!live1.grew && S1.K > 0.1) {
          live1.grew = true
          // what someone else's lamp grew is not this visitor's find or story
          if (live1.mine) {
            say(at(E.make.says.grow, level()))
            ex.discover('make', makePanel, 3.4)
            play('discover')
          }
          refresh(E.make.title, makePanel)
        }
      }
      if (S1.lamp <= 0) {
        S1.lamp = 0
        if (S1.K >= 0.98 && live1.mine) say(at(E.make.says.done, level()))
        refresh(E.make.title, makePanel)
        // the one who switched the lamp on tells the room how far the crystals got
        if (live1.mine) share('make')
        live1.mine = false
      }
    }
    if (S1.K > 0) {
      const rate = SPEED * Math.exp((Tn - 25) / 14)
      const was = S1.K
      S1.K = Math.max(0, S1.K - rate * dt)
      if (was > 0.05 && S1.K <= 0.05 && Tn > -60 && !live1.heldSaid && live1.touched) {
        live1.heldSaid = true
        say(at(E.make.says.gone, level()))
      }
    }
    if (S1.K > 0.2) live1.heldSaid = false
    // the lamp's glow
    const lampOn = S1.lamp > 0
    live1.lampK = damp(live1.lampK, lampOn ? 1 : 0, 9, dt)
    tube.material.emissiveIntensity = 0.15 + live1.lampK * 2.4
    tube.material.color.set(live1.lampK > 0.3 ? '#c8a8ff' : '#8a7fb0')
    lampHalo.material.opacity = live1.lampK * 0.55
    uvLight.intensity = live1.lampK * 1.3
    // frost on the cold glass, mist over the cold baths
    live1.frost = damp(live1.frost, Tn < -120 && S1.spot === 'dewar' ? 1 : 0, 1.2, dt)
    frost.material.opacity = live1.frost * 0.22
    mist[0].update(t)
    mist[1].update(t)
    // crystals
    const n = Math.round(S1.K * KMAX)
    if (n !== lastCrystals) {
      crystals.count = n
      lastCrystals = n
    }
    // gas wandering inside the bulb, less as it freezes into crystals
    gasTime += dt
    const dens = (1 - S1.K * 0.92)
    const nKr = S1.kr ? Math.round(NGAS * dens) : 0
    const nF = S1.f2 ? Math.round(NGAS * 2 * dens) : 0
    gasKr.count = nKr
    gasF.count = nF
    const place = (mesh, count, off, size) => {
      for (let i = 0; i < count; i++) {
        const s = gseed[(i + off) % gseed.length]
        const rr = VRAD * 0.62
        cDummy.position.set(Math.sin(gasTime * s[3] + s[0]) * rr, Math.sin(gasTime * s[3] * 0.8 + s[1]) * rr, Math.sin(gasTime * s[3] * 1.2 + s[2]) * rr)
        cDummy.rotation.set(0, 0, 0)
        cDummy.scale.setScalar(size)
        cDummy.updateMatrix()
        mesh.setMatrixAt(i, cDummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
    place(gasKr, nKr, 0, 0.0085)
    place(gasF, nF, 7, 0.0055)
    // the beads down the pipes
    for (const k of ['kr', 'f2']) {
      const key = k === 'kr' ? 'flowKr' : 'flowF2'
      live1[key] = Math.max(0, live1[key] - dt / 2.4)
      const flow = live1[key]
      beads[k].forEach((b, i) => {
        if (flow <= 0) {
          b.position.y = -9
          return
        }
        const u = (1 - flow) * 1.4 - i * 0.12
        if (u < 0 || u > 1) {
          b.position.y = -9
          return
        }
        pathPoint(k === 'kr' ? live1.pathKr : live1.pathF2, u, tmpP)
        b.position.copy(tmpP)
      })
    }
    // valve wheels turn as they open
    krCyl.wheel.rotation.z = S1.kr ? Math.PI * 1.5 : 0
    f2Cyl.wheel.rotation.z = S1.f2 ? Math.PI * 1.5 : 0
    // the packed molecules in the lens, as many as the crystals
    const shown = Math.round(S1.K * molecules.length)
    molecules.forEach((m, i) => {
      m.visible = i < shown
      if (m.visible) m.rotation.z = ((i % 2 ? 0.5 : -0.35) + Math.sin(t * 1.3 + i) * 0.05)
    })
    // the gold leaf: carried to the bulb, eaten, krypton bubbles off, the leaf is gone
    if (live1.goldK > 0 && live1.goldK < 1) live1.goldK = Math.min(1, live1.goldK + dt / 3.2)
    const gk = live1.goldK
    if (gk > 0) {
      const vp = vessel.position
      const toBulb = ease(clamp(gk / 0.3))
      const eaten = clamp((gk - 0.35) / 0.55)
      tmp.set(vp.x, vp.y + 0.02, VZ + 0.09)
      leaf.position.lerpVectors(leafHome, tmp, toBulb)
      leaf.scale.setScalar(1 - eaten * 0.9)
      leafMat.opacity = 1 - eaten
      leafMat.color.set(eaten > 0 ? new THREE.Color('#ffd166').lerp(new THREE.Color('#f0b070'), eaten) : '#ffd166')
      if (gk > 0.35 && gk < 0.9 && S1.K > 0) S1.K = Math.max(0, S1.K - dt * 0.07)
      if (gk >= 1 && !live1.goldDone) {
        live1.goldDone = 1
        leaf.visible = false
      }
    } else {
      live1.goldDone = 0
      leaf.visible = true
      leaf.scale.setScalar(1)
      leafMat.opacity = 1
      leafMat.color.set('#ffd166')
      leaf.position.copy(leafHome)
    }
  })

  // ======== station 2: who will hold hands? ========
  const S2 = { at: -1, tried: [0, 0, 0, 0, 0, 0] }
  const live2 = { k: 0, lastLevel: null }
  bench(BENCH2.x - 0.35, BENCH2.x + 0.35, BENCH2.z0, BENCH2.z1)
  // the board behind the bulbs, with the bars
  const wall2 = new THREE.Group()
  mk(new THREE.BoxGeometry(0.04, 1.5, 5.1), M('#1d2438', { roughness: 0.8 }), 0, 1.97, 0.8, wall2)
  wall2.position.set(ROOM.x1 - 0.04, 0, 0)
  root.add(wall2)
  const titleTx = makeText('', { font: 'body', size: 0.085, color: '#dfe8ff', anchorY: 'middle', maxWidth: 3.6, outlineWidth: 0.004, outlineColor: '#101528' })
  titleTx.position.set(ROOM.x1 - 0.075, 2.58, 0.8)
  titleTx.rotation.y = -Math.PI / 2
  root.add(titleTx)
  const bulbs = GASES.map((sym, i) => {
    const el = element(sym)
    const z = bulbZ(i)
    const g = new THREE.Group()
    g.position.set(BX, 0, z)
    root.add(g)
    // the stand and the glass
    mk(new THREE.CylinderGeometry(0.1, 0.12, 0.04, 20), mats.steel, 0, TOP + 0.02, 0, g)
    mk(new THREE.CylinderGeometry(0.03, 0.05, 0.12, 12), mats.steel, 0, TOP + 0.08, 0, g)
    const bulb = mk(new THREE.SphereGeometry(BR, 28, 18), glass('#e8f4ff', 0.13), 0, BY, 0, g)
    // the atom at its size, shell and outer electrons
    const rA = el.radius.vdw * RSC
    const atom = new THREE.Group()
    atom.position.y = BY
    g.add(atom)
    mk(new THREE.SphereGeometry(rA, 24, 16), new THREE.MeshStandardMaterial({ color: el.cpk, emissive: el.cpk, emissiveIntensity: 0.35, roughness: 0.4, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, atom)
    mk(new THREE.SphereGeometry(rA * 0.1, 10, 8), glowMat('#ffe6a0', 1.2), 0, 0, 0, atom)
    const spin = new THREE.Group()
    atom.add(spin)
    const ne = sym === 'He' ? 2 : 8
    for (let e = 0; e < ne; e++) {
      // two on opposite sides for helium, eight spread over the shell for the others
      const y = ne === 2 ? 0 : 1 - (2 * (e + 0.5)) / ne
      const rr = Math.sqrt(1 - y * y)
      const a = ne === 2 ? e * Math.PI : e * 2.399
      mk(new THREE.SphereGeometry(0.008, 8, 6), glowMat('#fff6c8', 1.4), Math.cos(a) * rr * rA * 0.9, y * rA * 0.9, Math.sin(a) * rr * rA * 0.9, spin)
    }
    // frost over the argon bulb when it holds HArF
    const ice = mk(new THREE.SphereGeometry(BR * 0.97, 20, 12), new THREE.MeshStandardMaterial({ color: '#f4fbff', roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }), 0, BY, 0, g)
    // fluorines offered (two atoms), and the bonds they make
    const fa = mk(new THREE.SphereGeometry(0.03, 14, 10), M(F_COL, { emissive: F_COL, emissiveIntensity: 0.4, roughness: 0.35 }), 0, BY, 0, g)
    const fb = mk(new THREE.SphereGeometry(0.03, 14, 10), M(F_COL, { emissive: F_COL, emissiveIntensity: 0.4, roughness: 0.35 }), 0, BY, 0, g)
    const hy = mk(new THREE.SphereGeometry(0.018, 12, 8), M('#ffffff', { emissive: '#aaaaaa', emissiveIntensity: 0.3 }), 0, BY, 0, g)
    const bondA = mk(new THREE.CylinderGeometry(0.008, 0.008, 1, 6), M('#d8dce8'), 0, BY, 0, g)
    const bondB = mk(new THREE.CylinderGeometry(0.008, 0.008, 1, 6), M('#d8dce8'), 0, BY, 0, g)
    for (const o of [fa, fb, hy, bondA, bondB]) o.visible = false
    // its bar: the first ionisation energy
    const ie = el.ie[0]
    const bh = ie * BARSC
    const bar = mk(new THREE.BoxGeometry(0.05, bh, 0.3), M(el.cpk, { emissive: el.cpk, emissiveIntensity: 0.25, roughness: 0.5 }), ROOM.x1 - 0.11, BAR0 + bh / 2, z)
    const ieTx = makeText(ie.toFixed(1), { size: 0.09, color: '#f0f4ff', anchorY: 'bottom', outlineWidth: 0.005, outlineColor: '#101528' })
    ieTx.position.set(ROOM.x1 - 0.14, BAR0 + bh + 0.02, z)
    ieTx.rotation.y = -Math.PI / 2
    root.add(ieTx)
    const symTx = makeText(sym, { size: 0.13, color: el.cpk, anchorY: 'middle', outlineWidth: 0.007, outlineColor: '#101528' })
    symTx.position.set(BX - 0.02, 0.77, z)
    symTx.rotation.y = -Math.PI / 2
    // the bench's front edge faces the room (-x): the signs read from there
    symTx.position.set(BENCH2.x - 0.37, 0.78, z)
    symTx.rotation.y = -Math.PI / 2
    root.add(symTx)
    const plaque = makeText('', { font: 'body', size: 0.055, color: '#e8ecf6', anchorY: 'top', maxWidth: 0.7, outlineWidth: 0.004, outlineColor: '#101528' })
    plaque.position.set(BENCH2.x - 0.37, 0.7, z)
    plaque.rotation.y = -Math.PI / 2
    root.add(plaque)
    const h = hit(0.4, 0.46, 0.4, BX, BY, z)
    clickable(h, () => offer(i), { reach: 5.5 })
    return { sym, el, g, atom, spin, rA, bulb, ice, fa, fb, hy, bondA, bondB, bar, plaque, z }
  })
  const plaqueOf = i => (S2.tried[i] ? E.who.results[GASES[i]] : '')
  const stepOffer = i => {
    const lv = level()
    S2.tried[i] = 1
    S2.at = S2.at === i ? -1 : i
    live2.k = 0
    if (S2.at === i) {
      play(OUTCOME[GASES[i]] === 'none' ? 'tap' : 'join')
      say(at(E.who.says[GASES[i]], lv))
    } else play('part')
    if (S2.tried.every(Boolean) && S2.at === i && !live2.allSaid) {
      live2.allSaid = true
      later2(5.5, () => say(at(E.who.says.all, level())))
    }
  }
  let timerSet = null
  const later2 = (s, fn) => {
    clearTimeout(timerSet)
    timerSet = setTimeout(fn, s * 1000)
  }
  function offer(i) {
    if (i < 0 || i > 5) return
    stepOffer(i)
    refresh(E.who.title, whoPanel)
    ex.discover('who', whoPanel, 3.4)
    share('who')
  }
  const whoPanel = lv => ({
    title: E.who.title,
    color,
    blocks: [
      { buttons: GASES.map((s, i) => ({ label: `${S2.at === i ? '✓ ' : ''}${s}`, onClick: () => offer(i) })) },
      {
        rows: GASES.map((s, i) => [
          s,
          S2.tried[i] ? E.who.results[s] : '?',
        ]),
      },
      ...E.who.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const whoHint = () => {
    const n = S2.tried.filter(Boolean).length
    return n === 0 ? E.who.hints.start : n < 6 ? E.who.hints.more : E.who.hints.all
  }
  const whoItem = ex.add({
    id: 'who',
    x: 3.3,
    z: 0.8,
    radius: 3.0,
    manual: true,
    label: E.who.label,
    verb: whoHint,
    focus: { x: BX, y: 1.5, z: 0.8, size: 4.0, width: 5.0 },
    act: () => ctx.showPanel(whoPanel),
  })
  focusBy(whoItem, whoItem.focus, () => ({ x: BX, y: 1.5, z: 1.2, size: 2.6, width: 2.7 }))
  const whoSet = (s, liveSet) => {
    S2.at = Number.isInteger(s?.at) ? s.at : -1
    S2.tried = GASES.map((_, i) => (s?.tried?.[i] ? 1 : 0))
    live2.k = liveSet ? 0 : 1
    live2.allSaid = S2.tried.every(Boolean)
  }
  updates.push((dt, t) => {
    const lv = level()
    if (live2.lastLevel !== lv) {
      live2.lastLevel = lv
      setText(titleTx, at(E.who.boardTitle, lv))
      bulbs.forEach((b, i) => setText(b.plaque, plaqueOf(i)))
    }
    live2.k = Math.min(1, live2.k + dt / 2.2)
    bulbs.forEach((b, i) => {
      b.spin.rotation.y = t * 0.6 + i
      b.spin.rotation.x = t * 0.35
      const on = S2.at === i
      const kind = OUTCOME[b.sym]
      const k = on ? live2.k : 0
      for (const o of [b.fa, b.fb, b.hy, b.bondA, b.bondB]) o.visible = on && !(o === b.hy && kind !== 'ice')
      b.ice.material.opacity += ((on && kind === 'ice' ? 0.42 : 0) - b.ice.material.opacity) * Math.min(1, dt * 3)
      setText(b.plaque, plaqueOf(i))
      if (!on) return
      const rA = b.rA
      const dock = rA + 0.03
      let d
      if (kind === 'ok' || kind === 'ice') d = 0.42 - (0.42 - dock) * ease(clamp(k / 0.6))
      else {
        // it comes in, is turned away, and tries again
        const p = (t * 0.55) % 1
        d = dock + 0.04 + (0.42 - dock - 0.04) * (p < 0.4 ? 1 - ease(p / 0.4) : ease((p - 0.4) / 0.6))
      }
      const bob = kind === 'none' ? 0 : Math.sin(t * 5) * 0.004 * ease(clamp((k - 0.6) / 0.4))
      const docked = kind !== 'none' && k > 0.6
      // fluorine on one side; on the other a second fluorine, or for argon's HArF the hydrogen
      const far = kind === 'ice' ? rA + 0.025 : d
      b.fa.position.set(0, BY + bob, d)
      b.fb.visible = kind !== 'ice'
      b.fb.position.set(0, BY - bob, -d)
      b.hy.visible = kind === 'ice'
      b.hy.position.set(0, BY, -(kind === 'ice' ? Math.max(far, rA + 0.025 + (d - dock) * 0.9) : d))
      b.bondA.visible = docked
      b.bondB.visible = docked
      if (docked) {
        stretch(b.bondA, new THREE.Vector3(0, BY, 0), new THREE.Vector3(0, BY, d))
        stretch(b.bondB, new THREE.Vector3(0, BY, 0), b.hy.position)
        if (kind !== 'ice') stretch(b.bondB, new THREE.Vector3(0, BY, 0), new THREE.Vector3(0, BY, -d))
      }
    })
  })

  // ======== station 3: the laser room ========
  const S3 = { on: 0, hz: 4, card: 0, print: 0, dies: 0 }
  const live3 = { pulse: 0, flash: 0, cardK: 0, resin: 0, lampK: 0, prog: 0, first: false, flipK: 0, windowGlow: 0 }
  // the partition with its doorway
  {
    const wallMat = M('#6c7896', { roughness: 0.85 })
    const seg = (a, b) => {
      mk(new THREE.BoxGeometry(b - a, ROOM.h, 0.12), wallMat, (a + b) / 2, ROOM.h / 2, PART.z)
      solids.push(box((a + b) / 2, PART.z, b - a, 0.14))
    }
    seg(PART.x0, PART.gap0)
    seg(PART.gap1, ROOM.x1)
    mk(new THREE.BoxGeometry(PART.gap1 - PART.gap0, ROOM.h - PART.top, 0.12), wallMat, (PART.gap0 + PART.gap1) / 2, PART.top + (ROOM.h - PART.top) / 2, PART.z)
    for (const x of [PART.gap0, PART.gap1]) mk(new THREE.BoxGeometry(0.06, PART.top, 0.16), mats.steel, x, PART.top / 2, PART.z)
    mk(new THREE.BoxGeometry(PART.gap1 - PART.gap0 + 0.06, 0.06, 0.16), mats.steel, (PART.gap0 + PART.gap1) / 2, PART.top, PART.z)
    // the end of the partition meets the west side of the room at x0 with a bare edge
    tag(E.flash.tags.door, (PART.gap0 + PART.gap1) / 2, 2.8, PART.z + 0.08, 0, 0.16, '#dfe8ff')
    tag(E.flash.tags.excimer, (PART.gap0 + PART.gap1) / 2, 2.58, PART.z + 0.08, 0, 0.08, '#ffd27a')
  }
  const warn = mk(new THREE.SphereGeometry(0.07, 14, 10), new THREE.MeshStandardMaterial({ color: '#6a2a22', emissive: '#ff3a22', emissiveIntensity: 0.1, roughness: 0.4 }), (PART.gap1 + ROOM.x1) / 2, 2.0, PART.z + 0.12)
  // the optical table: a steel top with its grid of holes, on a frame
  const table = new THREE.Group()
  root.add(table)
  {
    const len = OT.x1 - OT.x0
    const top = canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = '#7e8590'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#464b54'
      for (let i = 0; i < w; i += 8) for (let j = 0; j < h; j += 8) g.fillRect(i + 3, j + 3, 2, 2)
    }, { repeat: true })
    top.repeat.set(len / 0.5, 0.9 / 0.5)
    disposers.push(top)
    mk(new THREE.BoxGeometry(len, 0.08, OT.w), new THREE.MeshStandardMaterial({ map: top, metalness: 0.5, roughness: 0.45 }), (OT.x0 + OT.x1) / 2, TOP - 0.04, OT.z, table)
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mk(new THREE.BoxGeometry(0.08, TOP - 0.08, 0.08), mats.dark, (OT.x0 + OT.x1) / 2 + dx * (len / 2 - 0.1), (TOP - 0.08) / 2, OT.z + dz * (OT.w / 2 - 0.08), table)
    mk(new THREE.BoxGeometry(len - 0.2, 0.06, OT.w - 0.1), mats.dark, (OT.x0 + OT.x1) / 2, 0.35, OT.z, table)
    solids.push(box((OT.x0 + OT.x1) / 2, OT.z, len, OT.w))
  }
  // the laser: a steel-blue box with a window onto the discharge, a mirror at each end
  const laser = new THREE.Group()
  laser.position.set(LASER.x, TOP, OT.z)
  table.add(laser)
  mk(new RoundedBoxGeometry(LASER.len, 0.5, 0.46, 3, 0.03), M('#3b5a86', { roughness: 0.4, metalness: 0.35 }), 0, 0.27, 0, laser)
  mk(new THREE.BoxGeometry(LASER.len + 0.04, 0.03, 0.5), mats.dark, 0, 0.015, 0, laser)
  const winMat = new THREE.MeshStandardMaterial({ color: '#1a1030', emissive: PINK, emissiveIntensity: 0.1, roughness: 0.3 })
  mk(new THREE.PlaneGeometry(0.8, 0.17), winMat, -0.05, BEAM_Y - TOP + 0.02, 0.235, laser)
  mk(new THREE.BoxGeometry(0.84, 0.02, 0.01), mats.steel, -0.05, BEAM_Y - TOP + 0.115, 0.236, laser)
  mk(new THREE.BoxGeometry(0.84, 0.02, 0.01), mats.steel, -0.05, BEAM_Y - TOP - 0.075, 0.236, laser)
  const winHalo = sprite(PINK, 0.9, 0)
  winHalo.position.set(-0.05, BEAM_Y - TOP + 0.02, 0.3)
  laser.add(winHalo)
  mk(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), mats.steel, LASER.len / 2 + 0.04, BEAM_Y - TOP + 0.0, 0, laser).rotation.z = Math.PI / 2
  const redBtn = mk(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), new THREE.MeshStandardMaterial({ color: '#c0322a', emissive: '#c0322a', emissiveIntensity: 0.3 }), 0.43, 0.38, 0.235, laser)
  redBtn.rotation.x = Math.PI / 2
  tag(E.flash.tags.laser, LASER.x, 0.78, OT.z + 0.55, 0, 0.065)
  // the magnifier: one excited krypton and fluorine pair, slowed down
  const ring = new THREE.Group()
  ring.position.set(RING.x, RING.y, RING.z)
  root.add(ring)
  mk(new THREE.CylinderGeometry(0.012, 0.012, RING.y - TOP - 0.45 + 0.05, 8), mats.steel, 0, -(RING.y - TOP + 0.4) / 2 + 0.28 + 0.0, -0.05, ring)
  {
    mk(new THREE.TorusGeometry(RING.r, 0.02, 10, 40), mats.steel, 0, 0, 0, ring)
    mk(new THREE.CircleGeometry(RING.r - 0.02, 40), new THREE.MeshBasicMaterial({ color: '#0d1233' }), 0, 0, -0.01, ring)
  }
  const pairs = [0, 1, 2].map(i => {
    const y = (i - 1) * 0.15
    const kr = mk(new THREE.SphereGeometry(0.05, 16, 12), M(KR_COL, { emissive: KR_COL, emissiveIntensity: 0.3, roughness: 0.35 }), 0, y, 0.02, ring)
    const f = mk(new THREE.SphereGeometry(0.03, 14, 10), M(F_COL, { emissive: F_COL, emissiveIntensity: 0.3, roughness: 0.35 }), 0, y, 0.02, ring)
    const halo = sprite(PINK, 0.34, 0)
    halo.position.set(0, y, 0.04)
    ring.add(halo)
    const burst = sprite(VIOLET, 0.5, 0)
    burst.position.set(0, y, 0.05)
    ring.add(burst)
    return { kr, f, halo, burst, y, phase: i / 3 }
  })
  const starTx = makeText('KrF*', { size: 0.07, color: '#ffd0ea', anchorY: 'middle', outlineWidth: 0.004, outlineColor: '#101528' })
  starTx.position.set(0, -RING.r - 0.07, 0.02)
  ring.add(starTx)
  const nmTx = makeText('248 nm', { size: 0.06, color: '#e0c8ff', anchorY: 'middle', outlineWidth: 0.004, outlineColor: '#101528' })
  nmTx.position.set(0, RING.r + 0.07, 0.02)
  ring.add(nmTx)
  const ringHit = hit(0.64, 0.64, 0.1, RING.x, RING.y, RING.z)
  // the card: a fluorescent card on a post, flipped into the beam
  const cardG = new THREE.Group()
  cardG.position.set(CARD_X, TOP, OT.z)
  table.add(cardG)
  mk(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 14), mats.steel, 0, 0.01, 0, cardG)
  mk(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8), mats.steel, 0, 0.12, 0, cardG)
  const flip = new THREE.Group()
  flip.position.set(0, 0.22, 0)
  cardG.add(flip)
  const cardMat = new THREE.MeshStandardMaterial({ color: '#e8e4d8', roughness: 0.7, emissive: '#3a8aff', emissiveIntensity: 0 })
  const cardMesh = mk(new THREE.BoxGeometry(0.02, 0.2, 0.2), cardMat, 0, BEAM_Y - TOP - 0.22 + 0.0, 0, flip)
  cardMesh.position.y = BEAM_Y - TOP - 0.22
  const cardGlow = sprite('#4aa0ff', 0.4, 0)
  cardGlow.position.set(-0.03, BEAM_Y - TOP - 0.22, 0)
  flip.add(cardGlow)
  const cardHit = hit(0.2, 0.34, 0.3, CARD_X, BEAM_Y - 0.02, OT.z)
  tag(E.flash.tags.card, CARD_X, 0.78, OT.z + 0.55, 0, 0.055)
  // the mask: a plate with a pattern, in a holder; the pattern is four times the size it prints
  const maskCan = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#20263a'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#9fb4e0'
    g.fillRect(8, 8, w - 16, h - 16)
    g.fillStyle = '#10142a'
    // a little chip: a ring of pads, a grid of lines, a block
    for (let i = 0; i < 8; i++) {
      g.fillRect(24 + i * 26, 22, 14, 14)
      g.fillRect(24 + i * 26, h - 36, 14, 14)
      g.fillRect(22, 24 + i * 26, 14, 14)
      g.fillRect(w - 36, 24 + i * 26, 14, 14)
    }
    for (let i = 0; i < 7; i++) g.fillRect(60, 64 + i * 18, 136, 6)
    g.fillRect(60, 64, 6, 120)
    g.fillRect(190, 64, 6, 120)
    g.fillRect(100, 100, 56, 56)
  })
  disposers.push(maskCan)
  const maskG = new THREE.Group()
  maskG.position.set(MASK_X, TOP, OT.z)
  table.add(maskG)
  mk(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 14), mats.steel, 0, 0.01, 0, maskG)
  mk(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8), mats.steel, 0, 0.12, 0, maskG)
  mk(new THREE.BoxGeometry(0.02, 0.26, 0.26), mats.dark, 0, 0.22 + 0.0, 0, maskG).position.y = BEAM_Y - TOP
  const maskPlate = mk(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: maskCan }), 0, BEAM_Y - TOP, 0.0, maskG)
  maskPlate.rotation.y = -Math.PI / 2
  maskPlate.position.x = -0.012
  tag(E.flash.tags.mask, MASK_X, 0.78, OT.z + 0.55, 0, 0.055)
  // the lens: a barrel of glass elements
  const lensG = new THREE.Group()
  lensG.position.set(LENS_X, TOP, OT.z)
  table.add(lensG)
  mk(new THREE.BoxGeometry(0.1, 0.1, 0.3), mats.dark, 0, 0.05, 0, lensG)
  const barrel = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 24), M('#2c3446', { roughness: 0.4, metalness: 0.5 }), 0, BEAM_Y - TOP, 0, lensG)
  barrel.rotation.z = Math.PI / 2
  const lensGlass = new THREE.MeshStandardMaterial({ color: '#cfe0ff', emissive: VIOLET, emissiveIntensity: 0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.5 })
  for (const dx of [-0.152, 0.152]) {
    const lg = mk(new THREE.CircleGeometry(0.085, 24), lensGlass, dx, BEAM_Y - TOP, 0, lensG)
    lg.rotation.y = dx < 0 ? -Math.PI / 2 : Math.PI / 2
  }
  mk(new THREE.TorusGeometry(0.1, 0.01, 8, 24), mats.steel, -0.15, BEAM_Y - TOP, 0, lensG).rotation.y = Math.PI / 2
  mk(new THREE.TorusGeometry(0.1, 0.01, 8, 24), mats.steel, 0.15, BEAM_Y - TOP, 0, lensG).rotation.y = Math.PI / 2
  const lensHit3 = hit(0.4, 0.26, 0.3, LENS_X, BEAM_Y, OT.z)
  tag(E.flash.tags.lens, LENS_X, 0.78, OT.z + 0.55, 0, 0.055)
  // the wafer on its stage: nine dies in a grid, each gets the pattern four times smaller
  const waferG = new THREE.Group()
  waferG.position.set(WAFER_X, TOP, OT.z)
  table.add(waferG)
  mk(new THREE.BoxGeometry(0.4, 0.04, 0.4), mats.dark, 0, 0.02, 0, waferG)
  mk(new THREE.CylinderGeometry(0.19, 0.19, 0.012, 36), M('#9aa4b8', { roughness: 0.15, metalness: 0.8 }), 0, 0.046, 0, waferG)
  const dieTex = canvasTex(64, 64, (g, w, h) => {
    g.fillStyle = '#243a66'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#6a8ad8'
    g.fillRect(3, 3, w - 6, h - 6)
    g.fillStyle = '#10142a'
    for (let i = 0; i < 8; i++) {
      g.fillRect(6 + i * 6.5, 6, 3.5, 3.5)
      g.fillRect(6 + i * 6.5, h - 10, 3.5, 3.5)
    }
    for (let i = 0; i < 7; i++) g.fillRect(15, 16 + i * 4.5, 34, 1.5)
    g.fillRect(25, 25, 14, 14)
  })
  disposers.push(dieTex)
  const dies = []
  for (let k = 0; k < 9; k++) {
    const gx = (k % 3) - 1
    const gz = Math.floor(k / 3) - 1
    const d = mk(new THREE.PlaneGeometry(DIE * 0.9, DIE * 0.9), new THREE.MeshStandardMaterial({ map: dieTex, roughness: 0.3, metalness: 0.4, emissive: '#6aa0ff', emissiveIntensity: 0, transparent: true, opacity: 0 }), gx * DIE, 0.054, gz * DIE, waferG)
    d.rotation.x = -Math.PI / 2
    dies.push(d)
    const ghostDie = mk(new THREE.PlaneGeometry(DIE * 0.9, DIE * 0.9), new THREE.MeshStandardMaterial({ color: '#7a86a0', roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.9 }), gx * DIE, 0.0535, gz * DIE, waferG)
    ghostDie.rotation.x = -Math.PI / 2
  }
  const waferHit = hit(0.42, 0.2, 0.42, WAFER_X, TOP + 0.05, OT.z)
  tag(E.flash.tags.wafer, WAFER_X, 0.78, OT.z + 0.55, 0, 0.055)
  const waferGlow = sprite('#6aa0ff', 0.5, 0)
  waferGlow.position.set(0, 0.12, 0)
  waferG.add(waferGlow)

  const needBeam = () => !S3.card
  function flashStep(what, arg) {
    const lv = level()
    if (what !== 'hz') live3.mine = true
    const says = E.flash.says
    if (what === 'laser') {
      S3.on = S3.on ? 0 : 1
      if (S3.on) {
        live3.pulse = 0
        play('beam')
        say(at(says.on, lv))
      } else {
        play('tap')
        say(at(says.off, lv))
      }
    } else if (what === 'card') {
      S3.card = S3.card ? 0 : 1
      play('tap')
      say(at(S3.card ? (S3.on ? says.card : says.cardOff) : says.cardOut, lv))
      if (S3.card && S3.on) ex.discover('flash', flashPanel, 2.5)
    } else if (what === 'print') {
      S3.print = S3.print ? 0 : 1
      play('select')
      say(at(S3.print ? (S3.on ? (S3.card ? says.blocked : says.print) : says.printOff) : says.printStop, lv))
    } else if (what === 'wafer') {
      if (S3.dies >= 9 || S3.dies > 0) {
        S3.dies = 0
        live3.prog = 0
        play('tap')
        say(at(says.wafer, lv))
      } else say(at(says.mask, lv))
    } else if (what === 'hz') {
      S3.hz = clamp(Math.round(Number(arg) || 1), 1, 20)
    } else if (what === 'mask') {
      say(at(says.mask, lv))
    } else if (what === 'ring') {
      say(at(says.ring, lv))
    } else return
    if (what !== 'hz') ex.discover('flash', flashPanel, 3.4)
    refresh(E.flash.title, flashPanel)
    share('flash')
  }
  const flashPanel = lv => ({
    title: E.flash.title,
    color,
    blocks: [
      { slider: { label: E.flash.slider, min: 1, max: 20, step: 1, value: S3.hz, onInput: v => { flashStep('hz', v); share('flash') }, format: v => `${Math.round(v)} / s`, live: () => S3.hz } },
      {
        buttons: [
          { label: S3.on ? E.flash.buttons.laserOff : E.flash.buttons.laser, onClick: () => flashStep('laser') },
          { label: S3.card ? E.flash.buttons.cardOut : E.flash.buttons.card, onClick: () => flashStep('card') },
          { label: S3.print ? E.flash.buttons.printOff : E.flash.buttons.print, onClick: () => flashStep('print') },
          { label: E.flash.buttons.wafer, onClick: () => flashStep('wafer') },
        ],
      },
      ...E.flash.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(laser, () => flashStep('laser'), { reach: 5 })
  clickable(ringHit, () => flashStep('ring'), { reach: 5 })
  clickable(cardHit, () => flashStep('card'))
  clickable(lensHit3, () => flashStep('print'))
  clickable(waferHit, () => flashStep('wafer'))
  clickable(maskPlate, () => flashStep('mask'))
  const flashHint = () => {
    const h = E.flash.hints
    if (!S3.on) return h.laser
    if (!live3.first && !S3.card && !S3.print) return h.card
    if (!S3.print) return h.print
    if (S3.card) return h.cardOut
    if (S3.dies < 9) return h.look
    return h.done
  }
  const flashItem = ex.add({
    id: 'flash',
    x: 3.3,
    z: -3.55,
    radius: 1.9,
    manual: true,
    label: E.flash.label,
    verb: flashHint,
    focus: { x: 3.5, y: 1.35, z: OT.z, size: 3.5, width: 3.9 },
    act: () => ctx.showPanel(flashPanel),
  })
  focusBy(flashItem, flashItem.focus, () => ({ x: 2.7, y: 1.4, z: OT.z, size: 1.9, width: 2.0 }))
  const flashSet = (s, liveSet) => {
    S3.on = s?.on ? 1 : 0
    S3.hz = clamp(Math.round(Number(s?.hz) || 4), 1, 20)
    S3.card = s?.card ? 1 : 0
    S3.print = s?.print ? 1 : 0
    S3.dies = clamp(Math.round(Number(s?.dies) || 0), 0, 9)
    if (liveSet) live3.mine = false
    if (!liveSet) live3.cardK = S3.card ? 1 : 0
    live3.prog = 0
  }
  updates.push((dt, t) => {
    const on = !!S3.on
    // the pulses
    live3.flash = Math.max(0, live3.flash - dt * 6)
    if (on) {
      live3.pulse += dt * S3.hz
      while (live3.pulse >= 1) {
        live3.pulse -= 1
        live3.flash = 1
        if (S3.print && !S3.card) {
          live3.prog += 1
          if (live3.prog >= PULSES && S3.dies < 9) {
            live3.prog = 0
            S3.dies++
            if (S3.dies === 9) {
              if (live3.mine) {
                say(at(E.flash.says.full, level()))
                ex.discover('flash', flashPanel, 3.4)
              }
              refresh(E.flash.title, flashPanel)
            }
          }
        }
      }
    }
    // the card flips up into the beam
    live3.cardK = damp(live3.cardK, S3.card ? 1 : 0, 9, dt)
    flip.rotation.x = (1 - live3.cardK) * -1.4
    flip.rotation.z = 0
    flip.rotation.y = 0.7
    const pulseLevel = on ? Math.min(1, live3.flash + (S3.hz > 8 ? 0.35 : 0)) : 0
    winMat.emissiveIntensity = 0.08 + pulseLevel * 2.2
    winHalo.material.opacity = pulseLevel * 0.5
    cardMat.emissiveIntensity = S3.card ? pulseLevel * 1.8 : 0
    cardGlow.material.opacity = S3.card ? pulseLevel * 0.7 : 0
    lensGlass.emissiveIntensity = S3.print && on && !S3.card ? 0.2 + pulseLevel * 1.4 : 0
    waferGlow.material.opacity = S3.print && on && !S3.card ? pulseLevel * 0.45 : 0
    warn.material.emissiveIntensity = on ? 0.6 + Math.sin(t * 8) * 0.5 : 0.1
    // dies show their pattern as they are printed (the one in progress fades in)
    dies.forEach((d, k) => {
      const done = k < S3.dies
      const cur = k === S3.dies && S3.print && on && !S3.card ? live3.prog / PULSES : 0
      const target = done ? 1 : cur
      d.material.opacity += (target - d.material.opacity) * Math.min(1, dt * 8)
      d.material.emissiveIntensity = done && k === S3.dies - 1 ? 0.2 + pulseLevel * 0.8 : cur > 0 ? 0.3 + pulseLevel * 1.2 : 0
    })
    // the magnifier: each pair joins, glows, springs apart in a flash, slowed down by a billion
    for (const p of pairs) {
      const u = on ? (t * 0.42 + p.phase) % 1 : 0
      let sep
      let glowK = 0
      let burst = 0
      if (!on) sep = 0.2
      else if (u < 0.35) sep = 0.2 - 0.14 * ease(u / 0.35)
      else if (u < 0.62) {
        sep = 0.06
        glowK = ease((u - 0.35) / 0.1)
      } else if (u < 0.8) {
        const k = ease((u - 0.62) / 0.12)
        sep = 0.06 + 0.14 * k
        burst = 1 - clamp((u - 0.62) / 0.18)
        glowK = 1 - k
      } else sep = 0.2
      p.kr.position.x = -sep * 0.45
      p.f.position.x = sep * 0.6
      p.kr.position.y = p.f.position.y = p.y + (u >= 0.35 && u < 0.62 ? Math.sin(t * 20) * 0.003 : 0)
      p.halo.material.opacity = glowK * 0.8
      p.burst.material.opacity = burst
      p.burst.scale.setScalar(0.25 + (1 - burst) * 0.7)
    }
  })

  // the room's own clock: dust in the light is the stage's. The Atomling's place, the way back, the easel
  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 4.6 },
    spawn: { x: 0, z: 2.6, yaw: 0 },
    hostSpot: { x: 1.4, z: 1.7, yaw: Math.atan2(1.4, -0.9) },
    back: { x: 0, z: 5.2, rot: Math.PI },
    stand: { x: -2.2, z: 0.6, rot: Math.atan2(2.2, 2.0) },
    parts: {
      make: {
        tap: (what, arg) => make1(what, arg), // 'kr', 'f2', 'lamp', 'dewar', 'ice', 'air', 'vessel', 'gold', 'lens', 'reset', 'temp'
        get state() { return { ...S1, Tnow: live1.Tnow } },
        at: what => ({ kr: new THREE.Vector3(CYL.kr.x, 0.9, CYL.kr.z), f2: new THREE.Vector3(CYL.f2.x, 1.0, CYL.f2.z + 0.3), dewar: new THREE.Vector3(SPOT.dewar.x, TOP + 0.17, VZ), ice: new THREE.Vector3(SPOT.ice.x, TOP + 0.12, VZ), vessel: vessel.position.clone(), lamp: new THREE.Vector3(-2.45, 1.7, -4.8), gold: new THREE.Vector3(GOLD_AT.x, TOP + 0.4, GOLD_AT.z), lens: new THREE.Vector3(LENS1.x, LENS1.y, LENS1.z) })[what],
      },
      who: {
        tap: i => offer(typeof i === 'string' ? GASES.indexOf(i) : i),
        get state() { return { at: S2.at, tried: [...S2.tried] } },
        at: i => new THREE.Vector3(BX, BY, bulbZ(typeof i === 'string' ? GASES.indexOf(i) : i)),
      },
      flash: {
        tap: (what, arg) => flashStep(what, arg), // 'laser', 'card', 'print', 'wafer', 'mask', 'ring', 'hz'
        get state() { return { ...S3, prog: live3.prog } },
        at: what => ({ laser: new THREE.Vector3(LASER.x, TOP + 0.3, OT.z + 0.25), card: new THREE.Vector3(CARD_X, BEAM_Y, OT.z), print: new THREE.Vector3(LENS_X, BEAM_Y, OT.z), wafer: new THREE.Vector3(WAFER_X, TOP + 0.06, OT.z), mask: new THREE.Vector3(MASK_X, BEAM_Y, OT.z) })[what],
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { make: makePanel, who: whoPanel, flash: flashPanel },
    shared: {
      make: { get: () => ({ kr: S1.kr, f2: S1.f2, K: Math.round(S1.K * 100) / 100, T: S1.T, gold: S1.gold, lamp: Math.round(S1.lamp * 10) / 10 }), set: makeSet },
      who: { get: () => ({ at: S2.at, tried: [...S2.tried] }), set: whoSet },
      flash: { get: () => ({ on: S3.on, hz: S3.hz, card: S3.card, print: S3.print, dies: S3.dies }), set: flashSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      clearTimeout(timerSet)
      for (const tx of disposers.splice(0)) tx.dispose()
    },
  }
}
