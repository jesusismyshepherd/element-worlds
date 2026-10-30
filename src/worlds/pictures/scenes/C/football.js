// Carbon's picture "A molecule shaped like a football" as a room (docs/knowledge/picture-rooms.md): the
// picture made into the laboratory at Rice University in Houston where C60 was found, September 1985, at
// night (stages/lab.js). The gallery wing (wings/carbon) shows the molecules; this room tells how the ball
// was found and what rolled-up carbon can do. Three things to do, each step chosen by tapping its thing
// (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E
// opens the station's panel, whose buttons (and a slider for the helium) do the same:
// - the cluster machine along the back wall: tap the laser to fire it (green pulses, ten a second) at the
//   spinning graphite disc seen through the porthole; clusters fly through the glass part of the beam line
//   and the screen draws their time-of-flight spectrum, lightest first. Tap the helium bottle (or the
//   slider) for more helium and more time to cluster: the peak at 60 atoms grows from a little taller than
//   its neighbours to five times, then about forty times (the three spectra of the Nature paper, 1985);
//   70 grows too;
// - Smalley's paper model on the table, under the chalkboard and the poster of Fuller's dome at Expo 67:
//   tap the hexagon pile and they tape on flat, like graphite, however many; tap the pentagon pile and the
//   sheet curls up round a pentagon into a bowl; go on tapping either pile (pentagons never touch, so the
//   next gap decides what fits) until 12 pentagons and 20 hexagons close the ball with 60 corners; tap it
//   for an atom at every corner, again to take it apart. The chalkboard counts;
// - rolled-up carbon on the left: a graphene sheet hanging from a bar, rolled by tapping the armchair or
//   zigzag sign (or the sheet) into a nanotube with that rim; then a steel wire and the nanotube, just as
//   thin, side by side on a rig: tap the weights to hang one on each; the steel snaps at the third, the
//   tube holds all six. Tap a hook to take them off.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, random } from '../../../wings/noble/kit.js'
import { c60, nanotube } from '../../../wings/carbon/structures.js'
import { labStage } from '../../stages/lab.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { FOOTBALL_WORDS } from './football.words.js'

export const WORDS = FOOTBALL_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const UP = new THREE.Vector3(0, 1, 0)

// ---- where things stand (metres; the spawn at z = 3.4 looks along -z, into the picture) ----
const ROOM = { x0: -5.6, x1: 5.6, z0: -5.4, z1: 5.8, h: 3.2 }
// the cluster machine along the back wall: the beam runs at BEAM_Y along z = LINE_Z
const BEAM_Y = 1.15
const LINE_Z = -4.25
const OPT = { x: -2.45, z: LINE_Z, w: 1.15, d: 0.9, top: 0.86 } // the optical table
const LASER = { x0: -2.95, x1: -2.12 } // the laser head along x; its aperture at x1
const SRC = { x: -1.3, s: 0.72 } // the source chamber, a steel cube on the line
const GLASS = { x0: -0.72, x1: 0.28, r: 0.075 } // the glass part of the beam line
const TOF = { x: 0.75, y1: 2.6, r: 0.1 } // the flight tube, standing up at the line's end
const HE = { x: 1.2, z: LINE_Z + 0.02, h: 1.38, r: 0.115 } // the helium bottle, beside the screen
const MON = { x: 1.98, z: -3.92, rot: -0.45 } // the rack with the screen
// the paper model's table on the right, the chalkboard and the poster on the east wall behind it
const PT = { x: 3.7, z: -1.0, w: 1.0, d: 1.9, top: 0.78 }
const MODEL = { x: 3.72, z: -1.0 }
const PILES = { h: { x: 3.62, z: -1.78 }, p: { x: 3.62, z: -0.22 } }
const EDGE = 0.115 // a paper polygon's side
const BOARD = { z: -1.0, y: 1.62, w: 2.6, h: 1.25 }
const POSTER = { z: 1.65, y: 1.7, w: 1.3, h: 1.0 }
// rolled-up carbon on the left: the sheet hangs in the plane x = SHEET.x, the rig beside it
const SC = 0.072 // metres per ångström for the sheet
const SHEET = { x: -4.3, z: -0.75, y0: 0.5 }
const RIG = { x: -4.3, za: 0.78, zb: 2.48, bar: 2.36, steel: 1.28, tube: 1.98, hook: 1.02 }
const PILE = { x: -3.6, z: 3.0, top: 0.32 }
const SIGNS = { armchair: { x: -3.6, z: -0.12 }, zigzag: { x: -3.6, z: -1.38 } }
const WMAX = 6 // weights on the tube at most
const SNAP = 3 // the steel wire breaks under the third
const DISC = { r: 0.085, h: 0.045 }

/** A soft round glow. */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A regular polygon of k sides with its first corner along +x, in the xy plane. */
function polyGeo(k, side, shrink = 1) {
  const r = (side / (2 * Math.sin(Math.PI / k))) * shrink
  const shape = new THREE.Shape()
  for (let i = 0; i < k; i++) {
    const a = (i / k) * TAU
    if (i) shape.lineTo(r * Math.cos(a), r * Math.sin(a))
    else shape.moveTo(r, 0)
  }
  return new THREE.ShapeGeometry(shape)
}

/** A cylinder of unit height along y placed between two points. */
function stretch(obj, a, b) {
  obj.position.copy(a).add(b).multiplyScalar(0.5)
  obj.scale.set(1, Math.max(0.0001, a.distanceTo(b)), 1)
  obj.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize())
}

/** "C" with "60" written small and low after it, on a canvas (the 3D fonts have no subscripts). */
function formula(g, sym, n, x, y, size) {
  g.font = `700 ${size}px Outfit`
  const w1 = g.measureText(sym).width
  g.font = `700 ${Math.round(size * 0.62)}px Outfit`
  const w2 = g.measureText(n).width
  const x0 = x - (w1 + w2) / 2
  g.textAlign = 'left'
  g.font = `700 ${size}px Outfit`
  g.fillText(sym, x0, y)
  g.font = `700 ${Math.round(size * 0.62)}px Outfit`
  g.fillText(n, x0 + w1 + 1, y + size * 0.22)
  g.textAlign = 'center'
}

// ---- the spectrum: even clusters from C36 to C120, their heights for a clustering setting he (0..1) ----
const SIZES = Array.from({ length: 43 }, (_, i) => 36 + i * 2)
// the three spectra of the Nature paper: after the helium had passed (C60 the largest, not dominant), at
// its peak (C60 about five times its neighbours), with the integrating cup (about forty times, more than
// half of all large clusters, C70 about 5 %)
const ANCHORS = [
  { others: 1, f60: 1.25, f70: 1.1 },
  { others: 0.9, f60: 5.2, f70: 2.6 },
  { others: 0.5, f60: 40, f70: 3.3 },
]
function spectrum(he) {
  const k = clamp(he) * 2
  const i = Math.min(1, Math.floor(k))
  const u = k - i
  const a = ANCHORS[i]
  const b = ANCHORS[i + 1]
  const logLerp = (p, q) => Math.exp(Math.log(p) + (Math.log(q) - Math.log(p)) * u)
  const others = a.others + (b.others - a.others) * u
  const f60 = logLerp(a.f60, b.f60)
  const f70 = logLerp(a.f70, b.f70)
  return SIZES.map(n => Math.exp(-(((n - 66) / 24) ** 2)) * others * (n === 60 ? f60 : n === 70 ? f70 : 1))
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, light, level, color, clickable }) {
  const stage = labStage({
    light,
    ...ROOM,
    panels: [-3, 0, 3].flatMap(x => [-3.4, -0.4, 2.6].map(z => ({ x, z }))),
    lights: [{ x: -1.0, z: -2.6, intensity: 4.5 }, { x: 1.9, z: -0.5, intensity: 3.4 }, { x: -2.8, z: 0.6, intensity: 4 }, { x: 0.4, z: 2.6, intensity: 3 }],
    windows: [{ side: 'w', at: -3.1, width: 1.4 }, { side: 'w', at: 4.1, width: 1.4 }],
    door: { side: 'e', at: 4.5 },
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const soft = softTex()
  textures.push(soft)
  const tmpV = new THREE.Vector3()
  const tmpQ = new THREE.Quaternion()
  const dummy = new THREE.Object3D()
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 10)
  const glassMat = new THREE.MeshStandardMaterial({ color: '#d8eef4', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false, envMap: stage.shine, envMapIntensity: 1.2 })
  // an upright phone sees a narrow slice: a wide station looks at its most telling part there (the
  // station view fits a station's size against the height of the view only)
  const narrow = () => (ctx.camera?.aspect ?? 1.6) < 1
  const focusBy = (item, wide, tall) => Object.defineProperty(item, 'focus', { get: () => (narrow() ? tall() : wide), configurable: true })
  const tag = (text, x, y, z, rotY, size = 0.1) => {
    const t = makeText(text, { size, color: '#e8ecf6', anchorY: 'middle', outlineWidth: size * 0.06, outlineColor: '#141826' })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    root.add(t)
    return t
  }

  // ======== the calendar by the door ========
  {
    const cal = new THREE.Group()
    const tex = canvasTex(256, 360, (g, w, h) => {
      g.fillStyle = '#e8e2d2'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#5a7aa8'
      g.fillRect(0, 0, w, 130)
      // a drawing above the month: the moon over the bayou
      g.fillStyle = '#f2ead0'
      g.beginPath()
      g.arc(190, 48, 20, 0, TAU)
      g.fill()
      g.fillStyle = '#2e4466'
      g.fillRect(0, 100, w, 30)
      g.fillStyle = '#4a3a2e'
      g.fillRect(0, 150, w, 2)
      g.fillStyle = '#3a3a3a'
      g.font = '700 22px Outfit'
      g.textAlign = 'center'
      // September 1985 began on a Sunday
      for (let d = 1; d <= 30; d++) {
        const col = (d - 1) % 7
        const row = Math.floor((d - 1) / 7)
        g.fillText(String(d), 22 + col * 35, 220 + row * 32)
      }
    })
    textures.push(tex)
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.59), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }))
    const month = makeText(E.calendar, { size: 0.042, color: '#2a2a2a', anchorY: 'middle', maxWidth: 0.4 })
    month.position.set(0, 0.055, 0.003)
    cal.add(sheet, month)
    stage.onWall(cal, 'e', 3.15, 1.62, 0.02)
  }

  // ======== the room's furniture: benches and a cabinet along the walls ========
  {
    const knob = new THREE.SphereGeometry(0.018, 8, 6)
    const bench = (x, z, w, d) => {
      const g = new THREE.Group()
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), mats.black)
      top.position.y = 0.9
      const base = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, 0.84, d - 0.08), mats.paint)
      base.position.set(0, 0.46, -0.02)
      g.add(top, base)
      for (let i = 0; i < Math.floor(w / 0.6); i++) {
        const h = new THREE.Mesh(knob, mats.chrome)
        h.position.set(-w / 2 + 0.3 + i * 0.6, 0.78, d / 2 - 0.05)
        g.add(h)
      }
      g.position.set(x, 0, z)
      root.add(g)
      solids.push(box(x, z, w, d))
      return g
    }
    const flaskGeo = new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.065, 0.01], [0.022, 0.13], [0.018, 0.2], [0.022, 0.205]].map(([x, y]) => new THREE.Vector2(x, y)), 18)
    const beakerGeo = new THREE.LatheGeometry([[0, 0], [0.045, 0], [0.047, 0.01], [0.047, 0.12], [0.052, 0.125]].map(([x, y]) => new THREE.Vector2(x, y)), 18)
    const flaskMat = new THREE.MeshStandardMaterial({ color: '#dfeef2', roughness: 0.06, transparent: true, opacity: 0.4, depthWrite: false, envMap: stage.shine, envMapIntensity: 1.2 })
    const glassAt = (g, geo, x, z) => {
      const m = new THREE.Mesh(geo, flaskMat)
      m.position.set(x, 0.92, z)
      m.renderOrder = 2
      g.add(m)
    }
    // the back bench, right of the screen: an oscilloscope, a terminal, binders
    const back = bench(4.05, -4.98, 2.9, 0.75)
    {
      const scope = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.22, 0.4, 2, 0.02), mats.paint)
      scope.position.set(-0.9, 1.03, 0)
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.1), new THREE.MeshBasicMaterial({ color: '#1f6a3a' }))
      scr.position.set(-1.0, 1.04, 0.201)
      const term = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.36, 0.4, 2, 0.04), mats.paint)
      term.position.set(0.15, 1.1, -0.04)
      const tscr = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.22), new THREE.MeshBasicMaterial({ color: '#2a8a4e' }))
      tscr.position.set(0.15, 1.12, 0.163)
      const keys = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.04, 0.16, 2, 0.01), mats.paint)
      keys.position.set(0.15, 0.94, 0.24)
      back.add(scope, scr, term, tscr, keys)
      const spines = ['#7a2a2a', '#2a4a7a', '#2a6a3a', '#8a7a2a', '#4a2a6a']
      spines.forEach((c, i) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.26), new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }))
        b.position.set(0.85 + i * 0.065, 1.07, -0.12)
        back.add(b)
      })
      glassAt(back, beakerGeo, -0.45, 0.1)
      glassAt(back, flaskGeo, 1.25, 0.12)
    }
    // a tall cabinet of binders and glassware, left of the laser table
    {
      const cab = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.45), mats.paint)
      body.position.y = 1.05
      cab.add(body)
      const rnd = random(19)
      for (const y of [1.25, 1.7]) {
        let x = -0.48
        while (x < 0.45) {
          const w = 0.05 + rnd() * 0.03
          const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(rnd(), 0.4, 0.3 + rnd() * 0.15), roughness: 0.7 }))
          b.position.set(x + w / 2, y + 0.15, 0.04)
          cab.add(b)
          x += w + 0.005
        }
      }
      const doors = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.95), flaskMat)
      doors.position.set(0, 1.6, 0.23)
      doors.renderOrder = 2
      cab.add(doors)
      cab.position.set(-4.6, 0, -5.12)
      root.add(cab)
      solids.push(box(-4.6, -5.12, 1.1, 0.5))
    }
    // a bench along the south wall, beside the way back
    const south = bench(-3.9, 5.38, 2.6, 0.75)
    south.rotation.y = Math.PI
    glassAt(south, flaskGeo, -0.6, 0)
    glassAt(south, beakerGeo, 0.3, 0.1)
    glassAt(south, beakerGeo, 0.45, -0.1)
  }

  // ======== 1. the cluster machine ========
  const beamGroup = new THREE.Group()
  root.add(beamGroup)
  // the optical table with the laser
  {
    const holes = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#1c1d20'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#0a0a0b'
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        g.beginPath()
        g.arc(16 + i * 32, 16 + j * 32, 4, 0, TAU)
        g.fill()
      }
    }, { repeat: true })
    holes.repeat.set(OPT.w / 0.2, OPT.d / 0.2)
    textures.push(holes)
    const top = new THREE.Mesh(new THREE.BoxGeometry(OPT.w, 0.12, OPT.d), [mats.dark, mats.dark, new THREE.MeshStandardMaterial({ map: holes, roughness: 0.4, metalness: 0.5 }), mats.dark, mats.dark, mats.dark])
    top.position.set(OPT.x, OPT.top - 0.06, OPT.z)
    beamGroup.add(top)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, OPT.top - 0.12, 14), mats.paint)
      leg.position.set(OPT.x + sx * (OPT.w / 2 - 0.12), (OPT.top - 0.12) / 2, OPT.z + sz * (OPT.d / 2 - 0.12))
      beamGroup.add(leg)
    }
  }
  const laser = new THREE.Group()
  const laserLed = new THREE.MeshBasicMaterial({ color: '#401010' })
  {
    const len = LASER.x1 - LASER.x0
    const head = new THREE.Mesh(new RoundedBoxGeometry(len, 0.22, 0.26, 3, 0.03), mats.blue)
    head.position.set((LASER.x0 + LASER.x1) / 2, BEAM_Y, LINE_Z)
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16), mats.steel)
    nose.rotation.z = Math.PI / 2
    nose.position.set(LASER.x1 + 0.03, BEAM_Y, LINE_Z)
    for (const dx of [0.12, len - 0.12]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, BEAM_Y - 0.11 - OPT.top, 8), mats.steel)
      post.position.set(LASER.x0 + dx, OPT.top + (BEAM_Y - 0.11 - OPT.top) / 2, LINE_Z)
      laser.add(post)
    }
    // the laser warning on its side, facing the room
    const warn = canvasTex(128, 112, (g, w, h) => {
      g.fillStyle = '#f2c81e'
      g.beginPath()
      g.moveTo(w / 2, 6)
      g.lineTo(w - 6, h - 6)
      g.lineTo(6, h - 6)
      g.closePath()
      g.fill()
      g.strokeStyle = '#111'
      g.lineWidth = 6
      g.stroke()
      g.fillStyle = '#111'
      g.beginPath()
      g.arc(w / 2 - 14, h * 0.64, 9, 0, TAU)
      g.fill()
      g.lineWidth = 4
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU
        g.beginPath()
        g.moveTo(w / 2 - 14 + Math.cos(a) * 13, h * 0.64 + Math.sin(a) * 13)
        g.lineTo(w / 2 - 14 + Math.cos(a) * 20, h * 0.64 + Math.sin(a) * 20)
        g.stroke()
      }
      g.beginPath()
      g.moveTo(w / 2 - 14, h * 0.64)
      g.lineTo(w - 26, h * 0.64)
      g.stroke()
    })
    textures.push(warn)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.115), new THREE.MeshStandardMaterial({ map: warn, roughness: 0.6, transparent: true }))
    sign.position.set(LASER.x0 + 0.2, BEAM_Y + 0.01, LINE_Z + 0.131)
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), laserLed)
    led.position.set(LASER.x1 - 0.12, BEAM_Y + 0.05, LINE_Z + 0.131)
    // its power supply under the table
    const psu = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.42, 0.55, 2, 0.02), mats.paint)
    psu.position.set(OPT.x - 0.1, 0.22, OPT.z)
    laser.add(head, nose, sign, led, psu)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(len + 0.2, 0.4, 0.45), ghost)
    hit.position.set((LASER.x0 + LASER.x1) / 2, BEAM_Y, LINE_Z)
    laser.add(hit)
    beamGroup.add(laser)
  }
  // the source chamber: a steel cube with a porthole facing the room, the graphite disc spinning inside
  const SRC_FRONT = LINE_Z + SRC.s / 2
  const disc = new THREE.Group()
  const plumeMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffe6c8').multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const plume = new THREE.Sprite(plumeMat)
  const spotMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#7dff6a').multiplyScalar(2.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const spot = new THREE.Sprite(spotMat)
  const valve = new THREE.Group()
  {
    const s = SRC.s
    // hollow, so the porthole shows the inside: a back, two sides, a top and a bottom
    const walls = [[s, s, 0.04, 0, 0, -s / 2 + 0.02], [0.04, s, s - 0.04, -s / 2 + 0.02, 0, 0], [0.04, s, s - 0.04, s / 2 - 0.02, 0, 0], [s, 0.04, s - 0.04, 0, s / 2 - 0.02, 0], [s, 0.04, s - 0.04, 0, -s / 2 + 0.02, 0]]
    for (const [w, h, d, x, y, z] of walls) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.steel)
      m.position.set(SRC.x + x, BEAM_Y + y, LINE_Z - 0.02 + z)
      beamGroup.add(m)
    }
    // the front plate with its round window
    const plate = new THREE.Shape()
    plate.moveTo(-s / 2, -s / 2)
    plate.lineTo(s / 2, -s / 2)
    plate.lineTo(s / 2, s / 2)
    plate.lineTo(-s / 2, s / 2)
    plate.closePath()
    const hole = new THREE.Path()
    hole.absarc(0, 0, 0.17, 0, TAU, true)
    plate.holes.push(hole)
    const front = new THREE.Mesh(new THREE.ExtrudeGeometry(plate, { depth: 0.04, bevelEnabled: false, curveSegments: 32 }), mats.steel)
    front.position.set(SRC.x, BEAM_Y, SRC_FRONT - 0.04)
    const flange = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.028, 10, 40), mats.steel)
    flange.position.set(SRC.x, BEAM_Y, SRC_FRONT + 0.01)
    for (let i = 0; i < 12; i++) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.03, 6), mats.chrome)
      const a = (i / 12) * TAU
      bolt.rotation.x = Math.PI / 2
      bolt.position.set(SRC.x + Math.cos(a) * 0.235, BEAM_Y + Math.sin(a) * 0.235, SRC_FRONT + 0.012)
      beamGroup.add(bolt)
    }
    const pane = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), glassMat)
    pane.position.set(SRC.x, BEAM_Y, SRC_FRONT - 0.005)
    pane.renderOrder = 3
    // inside: dark, the disc on its spindle, the little mirror that turns the beam onto it
    const inside = new THREE.Mesh(new THREE.BoxGeometry(s - 0.08, s - 0.08, s - 0.12), new THREE.MeshStandardMaterial({ color: '#2a2d33', roughness: 0.7, metalness: 0.4, side: THREE.BackSide }))
    inside.position.set(SRC.x, BEAM_Y, LINE_Z - 0.03)
    const graphite = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.025, 36), new THREE.MeshStandardMaterial({ color: '#3a3b40', roughness: 0.45, metalness: 0.5 }))
    graphite.rotation.x = Math.PI / 2
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.006, 6, 36), new THREE.MeshStandardMaterial({ color: '#202124', roughness: 0.8 }))
    groove.position.z = 0.013
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), mats.steel)
    spindle.rotation.x = Math.PI / 2
    spindle.position.z = -0.1
    disc.add(graphite, groove, spindle)
    disc.position.set(SRC.x + 0.04, BEAM_Y, LINE_Z - 0.05)
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.008), mats.chrome)
    mirror.position.set(SRC.x - 0.2, BEAM_Y, LINE_Z + 0.06)
    mirror.rotation.y = -Math.PI / 4 - 0.25
    spot.position.set(SRC.x + 0.04 - 0.06, BEAM_Y, LINE_Z - 0.03)
    spot.scale.setScalar(0.12)
    plume.position.set(SRC.x + 0.0, BEAM_Y, LINE_Z + 0.02)
    // its window for the laser on the left, its pump below, a flange on the right for the beam line
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 18), mats.steel)
    port.rotation.z = Math.PI / 2
    port.position.set(SRC.x - s / 2 - 0.04, BEAM_Y, LINE_Z)
    const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, BEAM_Y - s / 2 - 0.12, 24), mats.steel)
    pump.position.set(SRC.x, (BEAM_Y - s / 2 - 0.12) / 2 + 0.12, LINE_Z - 0.05)
    const fins = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 24), mats.steel)
    fins.position.set(SRC.x, BEAM_Y - s / 2 - 0.07, LINE_Z - 0.05)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.12, 24), mats.paint)
    foot.position.set(SRC.x, 0.06, LINE_Z - 0.05)
    // the pulsed valve on top, where the helium comes in
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 18), mats.steel)
    body.position.y = 0.08
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 18), mats.blue)
    cap.position.y = 0.17
    valve.add(body, cap)
    valve.position.set(SRC.x, BEAM_Y + s / 2, LINE_Z)
    beamGroup.add(front, flange, pane, inside, disc, mirror, port, pump, fins, foot, valve, spot, plume)
  }
  // the laser beam: green, from the laser's nose to the window, the mirror, then onto the disc
  const beamMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#5dff5a').multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const beamRays = [
    [new THREE.Vector3(LASER.x1 + 0.06, BEAM_Y, LINE_Z), new THREE.Vector3(SRC.x - 0.2, BEAM_Y, LINE_Z)],
    [new THREE.Vector3(SRC.x - 0.2, BEAM_Y, LINE_Z), new THREE.Vector3(SRC.x - 0.2, BEAM_Y, LINE_Z + 0.06)],
    [new THREE.Vector3(SRC.x - 0.2, BEAM_Y, LINE_Z + 0.06), new THREE.Vector3(SRC.x - 0.02, BEAM_Y, LINE_Z - 0.03)],
  ].map(([a, b]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 8), beamMat)
    stretch(m, a, b)
    m.renderOrder = 4
    beamGroup.add(m)
    return m
  })
  // the beam line: steel to the glass section, glass, steel to the flight tube's cross
  {
    const pipe = (x0, x1, r, mat) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, x1 - x0, 24, 1, mat === glassMat), mat)
      m.rotation.z = Math.PI / 2
      m.position.set((x0 + x1) / 2, BEAM_Y, LINE_Z)
      if (mat === glassMat) m.renderOrder = 3
      beamGroup.add(m)
    }
    pipe(SRC.x + SRC.s / 2, GLASS.x0, 0.06, mats.steel)
    pipe(GLASS.x0, GLASS.x1, GLASS.r, glassMat)
    pipe(GLASS.x1, TOF.x - 0.12, 0.06, mats.steel)
    for (const x of [GLASS.x0, GLASS.x1]) {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.035, 24), mats.steel)
      f.rotation.z = Math.PI / 2
      f.position.set(x, BEAM_Y, LINE_Z)
      beamGroup.add(f)
    }
    // the flight tube: a cross at the beam's height, the tube up to the detector, a pump below
    const cross = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.26, 0.26, 2, 0.03), mats.steel)
    cross.position.set(TOF.x, BEAM_Y, LINE_Z)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(TOF.r, TOF.r, TOF.y1 - BEAM_Y - 0.13, 24), mats.steel)
    tube.position.set(TOF.x, (TOF.y1 + BEAM_Y + 0.13) / 2, LINE_Z)
    const det = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 24), mats.steel)
    det.position.set(TOF.x, TOF.y1 + 0.08, LINE_Z)
    const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, BEAM_Y - 0.25, 24), mats.steel)
    pump.position.set(TOF.x, (BEAM_Y - 0.13) / 2, LINE_Z)
    const pfoot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.1, 24), mats.paint)
    pfoot.position.set(TOF.x, 0.05, LINE_Z)
    beamGroup.add(cross, tube, det, pump, pfoot)
    for (const y of [1.65, 2.15]) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(TOF.r + 0.03, TOF.r + 0.03, 0.03, 24), mats.steel)
      ring.position.set(TOF.x, y, LINE_Z)
      beamGroup.add(ring)
    }
    // the detector's cable to the rack
    const cable = new THREE.CatmullRomCurve3([
      new THREE.Vector3(TOF.x + 0.12, TOF.y1 + 0.1, LINE_Z),
      new THREE.Vector3(TOF.x + 0.6, TOF.y1 + 0.18, LINE_Z + 0.1),
      new THREE.Vector3(MON.x - 0.1, 2.1, MON.z - 0.3),
      new THREE.Vector3(MON.x, 1.85, MON.z - 0.25),
    ])
    beamGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cable, 40, 0.012, 6, false), mats.rubber))
  }
  // the helium bottle, its regulator and the hose up to the pulsed valve
  const heValve = new THREE.Group()
  const heBottle = new THREE.Group()
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(HE.r, HE.r, HE.h - HE.r, 24), new THREE.MeshStandardMaterial({ color: '#7b8088', roughness: 0.45, metalness: 0.4 }))
    body.position.y = (HE.h - HE.r) / 2
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(HE.r, 24, 12, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#8a6a3a', roughness: 0.45, metalness: 0.3 }))
    shoulder.position.y = HE.h - HE.r
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.08, 12), mats.chrome)
    neck.position.y = HE.h + 0.03
    const reg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 14), mats.chrome)
    reg.rotation.x = Math.PI / 2
    reg.position.set(0, HE.h + 0.1, 0.03)
    const gaugeFace = canvasTex(64, 64, (g, w) => {
      g.fillStyle = '#f4f2ea'
      g.beginPath()
      g.arc(w / 2, w / 2, w / 2 - 2, 0, TAU)
      g.fill()
      g.strokeStyle = '#222'
      g.lineWidth = 2
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI * 0.8 + (i / 8) * Math.PI * 1.4
        g.beginPath()
        g.moveTo(w / 2 + Math.cos(a) * 22, w / 2 + Math.sin(a) * 22)
        g.lineTo(w / 2 + Math.cos(a) * 28, w / 2 + Math.sin(a) * 28)
        g.stroke()
      }
    })
    textures.push(gaugeFace)
    const gauges = []
    for (const dx of [-0.07, 0.07]) {
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20), mats.chrome)
      rim.rotation.x = Math.PI / 2
      rim.position.set(dx, HE.h + 0.12, 0.08)
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20), new THREE.MeshBasicMaterial({ map: gaugeFace }))
      face.position.set(dx, HE.h + 0.12, 0.096)
      const needle = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.032, 0.002), new THREE.MeshBasicMaterial({ color: '#c02020' }))
      needle.geometry.translate(0, 0.014, 0)
      needle.position.set(dx, HE.h + 0.12, 0.099)
      heBottle.add(rim, face, needle)
      gauges.push(needle)
    }
    heBottle.userData.gauges = gauges
    // the valve's handle, a black knob on top: turned by a tap
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 6), mats.black)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 8), mats.chrome)
    stem.position.y = -0.03
    heValve.add(knob, stem)
    heValve.position.set(0, HE.h + 0.2, 0.0)
    // a strap to the wall
    const strap = new THREE.Mesh(new THREE.TorusGeometry(HE.r + 0.012, 0.012, 6, 28), mats.dark)
    strap.rotation.x = Math.PI / 2
    strap.position.y = 1.0
    heBottle.add(body, shoulder, neck, reg, heValve, strap)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, HE.h + 0.4, 10), ghost)
    hit.position.y = (HE.h + 0.4) / 2
    heBottle.add(hit)
    heBottle.position.set(HE.x, 0, HE.z)
    beamGroup.add(heBottle)
    // up behind the flight tube, along the wall and down onto the pulsed valve
    const hose = new THREE.CatmullRomCurve3([
      new THREE.Vector3(HE.x, HE.h + 0.1, HE.z - 0.05),
      new THREE.Vector3(HE.x - 0.1, 1.95, LINE_Z - 0.35),
      new THREE.Vector3(TOF.x - 0.6, 2.05, LINE_Z - 0.4),
      new THREE.Vector3(SRC.x + 0.3, 1.95, LINE_Z - 0.2),
      new THREE.Vector3(SRC.x, BEAM_Y + SRC.s / 2 + 0.36, LINE_Z),
      new THREE.Vector3(SRC.x, BEAM_Y + SRC.s / 2 + 0.19, LINE_Z),
    ])
    beamGroup.add(new THREE.Mesh(new THREE.TubeGeometry(hose, 40, 0.009, 6, false), new THREE.MeshStandardMaterial({ color: '#c8c2b0', roughness: 0.4, metalness: 0.6 })))
  }
  // the rack with the screen, turned toward where the visitor stands
  const screenTex = canvasTex(640, 480, () => {}, { mipmaps: false })
  textures.push(screenTex)
  const screen = new THREE.Group()
  {
    const panel = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#3a3c40'
      g.fillRect(0, 0, w, h)
      const r = random(5)
      for (let row = 0; row < 4; row++) {
        g.fillStyle = '#2a2b2e'
        g.fillRect(6, 6 + row * 62, w - 12, 56)
        for (let k = 0; k < 6; k++) {
          g.fillStyle = '#c8c8c0'
          g.beginPath()
          g.arc(28 + k * 38, 34 + row * 62, 7, 0, TAU)
          g.fill()
          if (r() < 0.5) {
            g.fillStyle = r() < 0.5 ? '#ff5040' : '#60ff70'
            g.fillRect(22 + k * 38, 14 + row * 62, 5, 5)
          }
        }
      }
    })
    textures.push(panel)
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.0, 0.6), [mats.dark, mats.dark, mats.dark, mats.dark, new THREE.MeshStandardMaterial({ map: panel, roughness: 0.6 }), mats.dark])
    rack.position.y = 0.5
    const caseMat = new THREE.MeshStandardMaterial({ color: '#c9c1aa', roughness: 0.55 })
    const crt = new THREE.Mesh(new RoundedBoxGeometry(0.98, 0.8, 0.52, 3, 0.05), caseMat)
    crt.position.set(0, 1.42, -0.04)
    const bezel = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.7, 0.04, 3, 0.03), mats.black)
    bezel.position.set(0, 1.44, 0.23)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), new THREE.MeshBasicMaterial({ map: screenTex, color: new THREE.Color(1.15, 1.15, 1.15), toneMapped: false }))
    face.position.set(0, 1.44, 0.255)
    screen.add(rack, crt, bezel, face)
    screen.userData.face = face
    screen.position.set(MON.x, 0, MON.z)
    screen.rotation.y = MON.rot
    beamGroup.add(screen)
  }
  solids.push(box(-0.45, -4.5, 5.2, 1.85))
  tag(E.beam.tags.laser, (LASER.x0 + LASER.x1) / 2, BEAM_Y + 0.27, LINE_Z + 0.05, 0)
  tag(E.beam.tags.helium, HE.x, HE.h + 0.4, HE.z + 0.12, 0, 0.085)
  tag(E.beam.tags.disc, SRC.x, BEAM_Y - 0.27, SRC_FRONT + 0.04, 0, 0.075)

  // clusters flying down the glass part of the beam line (only seen there)
  const FLY = light ? 40 : 90
  const flyPos = new Float32Array(FLY * 3)
  const flyCol = new Float32Array(FLY * 3)
  const flyGeo = new THREE.BufferGeometry()
  flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPos, 3))
  flyGeo.setAttribute('color', new THREE.BufferAttribute(flyCol, 3))
  const flyPts = new THREE.Points(flyGeo, new THREE.PointsMaterial({ map: soft, size: 0.05, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  flyPts.frustumCulled = false
  // never hit by a tap (three catches points within 1 m)
  flyPts.raycast = () => {}
  beamGroup.add(flyPts)
  const flies = Array.from({ length: FLY }, () => ({ x: 99, v: 1, y: 0, z: 0, big: false }))
  let flyNext = 0
  const FLY_LAV = new THREE.Color('#c3a6ff').multiplyScalar(1.6)
  const FLY_GOLD = new THREE.Color('#ffd166').multiplyScalar(1.8)

  // ---- the machine's state: the laser on or off, the clustering setting ----
  const S = { on: 0, he: 0 }
  let shots = 0 // pulses fired since it was switched on (the screen sweeps across once at the start)
  let pulseClock = 0
  let flash = 0
  let sweep = 1
  let everFired = false
  const shown = spectrum(0).map(() => 0)
  let screenDirty = true
  let screenClock = 0
  let lastLv = null
  const heSettle = { k: 0 } // the valve's turn, eased
  const levelOf = v => (v < 0.25 ? 'low' : v < 0.75 ? 'mid' : 'high')
  const X = n => 58 + ((n - 32) / (124 - 32)) * (640 - 58 - 26)
  function drawScreen(lv) {
    const sci = lv === 'scientist'
    screenTex.userData.redraw((g, w, h) => {
      const L = 58
      const R = w - 26
      const T = 34
      const B = h - 78
      g.fillStyle = '#041409'
      g.fillRect(0, 0, w, h)
      const vg = g.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.8)
      vg.addColorStop(0, 'rgba(40,110,60,0.22)')
      vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      g.fillStyle = vg
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(110,230,140,0.16)'
      g.lineWidth = 1
      for (let n = 40; n <= 120; n += 10) {
        g.beginPath()
        g.moveTo(X(n), T)
        g.lineTo(X(n), B)
        g.stroke()
      }
      for (let k = 1; k <= 4; k++) {
        const y = B - ((B - T) * k) / 4
        g.beginPath()
        g.moveTo(L, y)
        g.lineTo(R, y)
        g.stroke()
      }
      g.strokeStyle = 'rgba(150,255,180,0.75)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(L, T)
      g.lineTo(L, B)
      g.lineTo(R, B)
      g.stroke()
      g.fillStyle = 'rgba(170,255,195,0.9)'
      g.font = '600 22px Outfit'
      g.textAlign = 'center'
      for (let n = 40; n <= 120; n += 10) g.fillText(String(sci ? n * 12 : n), X(n), B + 28)
      g.font = '600 24px Outfit'
      g.fillText(at(E.beam.axis, lv), (L + R) / 2, h - 16)
      if (!everFired) return
      // the trace: a narrow peak for every cluster size, drawn up to the sweep
      const top = Math.max(...shown, 1e-6)
      const scale = ((B - T) * 0.9) / top
      const rx = L + (R - L) * sweep
      g.strokeStyle = '#a8ffbe'
      g.lineWidth = 2.5
      g.shadowColor = '#5dff8a'
      g.shadowBlur = 10
      g.beginPath()
      const jitter = S.on ? 1.2 : 0
      for (let x = L + 1; x <= rx; x += 1) {
        let y = 0
        for (let i = 0; i < SIZES.length; i++) {
          const d = (x - X(SIZES[i])) / 1.7
          if (d > -5 && d < 5) y += shown[i] * scale * Math.exp(-d * d)
        }
        y += (Math.random() - 0.5) * jitter
        if (x === L + 1) g.moveTo(x, B - 1 - y)
        else g.lineTo(x, B - 1 - y)
      }
      g.stroke()
      g.shadowBlur = 0
      if (S.on && sweep < 1) {
        g.fillStyle = '#e8ffe8'
        g.beginPath()
        g.arc(rx, B - 2, 4, 0, TAU)
        g.fill()
      }
      // the two famous peaks, named once they are drawn
      g.fillStyle = '#d8ffe0'
      for (const n of [60, 70]) {
        const i = SIZES.indexOf(n)
        const hp = shown[i] * scale
        if (X(n) > rx || hp < 26) continue
        const y = B - hp - 12
        if (sci) formula(g, 'C', String(n), X(n), y, 26)
        else {
          g.font = '700 26px Outfit'
          g.fillText(String(n), X(n), y)
        }
      }
    })
    screenDirty = false
  }
  drawScreen(level())

  const beamPanel = lv => ({
    title: E.beam.title,
    color,
    blocks: [
      {
        slider: {
          label: E.beam.slider,
          min: 0,
          max: 1,
          step: 0.01,
          value: S.he,
          onInput: v => setHe(v),
          format: v => E.beam.levels[levelOf(v)],
          live: () => S.he,
        },
      },
      { buttons: [{ label: S.on ? E.beam.buttons.stop : E.beam.buttons.fire, onClick: () => beamStep('laser') }, { label: E.beam.buttons.helium, onClick: () => beamStep('helium') }] },
      ...E.beam.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const startFiring = () => {
    shots = 0
    sweep = 0
    everFired = true
    play('beam')
  }
  // a visitor's step: a tap on the laser (on or off) or on the helium bottle (more helium, then round
  // again to none), or the panel's buttons
  function beamStep(what) {
    const lv = level()
    if (what === 'laser') {
      S.on = S.on ? 0 : 1
      if (S.on) {
        startFiring()
        say(at(E.beam.says.fire, lv))
      } else {
        play('tap')
        say(at(E.beam.says.stop, lv))
      }
    } else if (what === 'helium') {
      S.he = S.he >= 0.99 ? 0 : S.he < 0.49 ? 0.5 : 1
      play('select')
      lastSaid = levelOf(S.he)
      say(at(S.on ? E.beam.says[lastSaid] : E.beam.says.set, lv))
    } else return
    // the open panel's button follows the laser (on or off)
    if (ctx.store.get().panel?.title === E.beam.title) ctx.showPanel(beamPanel)
    ex.discover('beam', beamPanel, 3.2)
    share('beam')
  }
  // the slider: the clustering setting, said when it crosses into another of the paper's three
  let heSend = null
  let lastSaid = 'low'
  function setHe(v) {
    const next = clamp(Number(v) || 0)
    if (next === S.he) return
    S.he = next
    const lvName = levelOf(next)
    if (lvName !== lastSaid) {
      lastSaid = lvName
      if (S.on) say(at(E.beam.says[lvName], level()))
    }
    ex.discover('beam', beamPanel, 3.2)
    if (!heSend) {
      heSend = setTimeout(() => {
        heSend = null
        share('beam')
      }, 250)
    }
  }
  clickable(laser, () => beamStep('laser'))
  clickable(heBottle, () => beamStep('helium'))
  const beamItem = ex.add({
    id: 'beam',
    x: -0.55,
    z: -2.15,
    radius: 2.0,
    manual: true,
    label: E.beam.label,
    verb: () => (!S.on ? E.beam.hints.fire : S.he < 0.95 ? E.beam.hints.helium : E.beam.hints.look),
    focus: { x: -0.45, y: 1.3, z: -4.2, size: 4.6 },
    act: () => ctx.showPanel(beamPanel),
  })
  // on a phone: the screen and the helium bottle, where the peak grows
  focusBy(beamItem, beamItem.focus, () => ({ x: 1.5, y: 1.35, z: -4.1, size: 1.9 }))
  const beamSet = (s, liveSet) => {
    const wasOn = S.on
    S.on = s?.on ? 1 : 0
    S.he = clamp(Number(s?.he) || 0)
    lastSaid = levelOf(S.he)
    if (S.on && !wasOn) {
      if (liveSet) startFiring()
      else {
        everFired = true
        sweep = 1
      }
    } else if (!S.on && wasOn && liveSet) play('tap')
    if (!liveSet && S.on) spectrum(S.he).forEach((v, i) => (shown[i] = v))
    screenDirty = true
  }
  updates.push((dt, t) => {
    // pulses at ten a second while on
    flash = Math.max(0, flash - dt * 9)
    if (S.on) {
      pulseClock += dt * 10
      while (pulseClock >= 1) {
        pulseClock -= 1
        shots++
        flash = 1
        // a few clusters per pulse; the heavy ones (gold: C60, C70) more often with more helium
        for (let k = 0; k < (light ? 2 : 3); k++) {
          const f = flies[flyNext]
          flyNext = (flyNext + 1) % FLY
          const big = Math.random() < 0.12 + 0.55 * S.he
          f.x = SRC.x + SRC.s / 2 - 0.05 - Math.random() * 0.1
          f.v = big ? 0.9 + Math.random() * 0.2 : 1.2 + Math.random() * 0.8
          f.y = (Math.random() - 0.5) * 0.06
          f.z = (Math.random() - 0.5) * 0.06
          f.big = big
        }
      }
      if (sweep < 1) sweep = Math.min(1, sweep + dt / 1.1)
    }
    const k = S.on ? 0.25 + 0.75 * flash : 0
    beamMat.opacity = k
    spotMat.opacity = S.on ? 0.4 + 0.6 * flash : 0
    plumeMat.opacity = S.on ? flash * 0.85 : 0
    plume.scale.setScalar(0.08 + (1 - flash) * 0.18)
    laserLed.color.set(S.on ? '#ff3a2a' : '#401010')
    disc.rotation.z += dt * 1.2
    // the flying clusters
    for (let i = 0; i < FLY; i++) {
      const f = flies[i]
      if (f.x < TOF.x) f.x += f.v * dt
      const seen = f.x > GLASS.x0 && f.x < GLASS.x1
      flyPos.set(seen ? [f.x, BEAM_Y + f.y, LINE_Z + f.z] : [0, -9, 0], i * 3)
      const c = f.big ? FLY_GOLD : FLY_LAV
      flyCol.set([c.r, c.g, c.b], i * 3)
    }
    flyGeo.attributes.position.needsUpdate = true
    flyGeo.attributes.color.needsUpdate = true
    // the valve's knob turns to the setting, the gauge follows
    heSettle.k = damp(heSettle.k, S.he, 5, dt)
    heValve.rotation.y = -heSettle.k * Math.PI * 1.5
    for (const n of heBottle.userData.gauges) n.rotation.z = 1.9 - heSettle.k * 2.6
    // the screen: the peaks ease to the setting while it fires, redrawn about fifteen times a second
    if (S.on) {
      const target = spectrum(S.he)
      for (let i = 0; i < shown.length; i++) shown[i] = damp(shown[i], target[i], 3.5, dt)
      screenDirty = true
    }
    const lv = level()
    if (lv !== lastLv) {
      lastLv = lv
      screenDirty = true
    }
    screenClock -= dt
    if (screenDirty && screenClock <= 0) {
      screenClock = light ? 0.12 : 0.066
      drawScreen(lv)
    }
  })

  // ======== 2. Smalley's paper model ========
  // the truncated icosahedron with equal edges, resting on a pentagon; faces ordered from the bottom up
  const POLY = c60({ single: 1, double: 1 })
  const P0 = POLY.pentagons[0]
  const centreOf = ring => ring.reduce((s, i) => s.add(new THREE.Vector3(...POLY.atoms[i])), new THREE.Vector3()).multiplyScalar(1 / ring.length)
  const turn = new THREE.Quaternion().setFromUnitVectors(centreOf(P0).normalize(), new THREE.Vector3(0, -1, 0))
  turn.premultiply(new THREE.Quaternion().setFromAxisAngle(UP, 0.3))
  const corner = POLY.atoms.map(p => new THREE.Vector3(...p).applyQuaternion(turn).multiplyScalar(EDGE))
  const rawFaces = [...POLY.pentagons.map(ring => ({ kind: 'p', ring })), ...POLY.hexagons.map(ring => ({ kind: 'h', ring }))]
  const faceList = rawFaces.map(f => {
    const c = f.ring.reduce((s, i) => s.add(corner[i]), new THREE.Vector3()).multiplyScalar(1 / f.ring.length)
    const n = c.clone().normalize()
    const u = corner[f.ring[0]].clone().sub(c).normalize()
    const v = n.clone().cross(u)
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, v, n))
    return { ...f, c, n, q, h: c.y, az: Math.atan2(c.z, c.x) }
  })
  // slot 0 is the bottom pentagon; the rest by height, round the ball within a band
  const FACES = faceList.sort((a, b) => (Math.abs(a.h - b.h) > 1e-4 ? a.h - b.h : a.az - b.az))
  const N_FACES = FACES.length
  const adj = FACES.map(f => FACES.map((g, j) => j).filter(j => FACES[j] !== f && FACES[j].ring.filter(i => f.ring.includes(i)).length === 2))
  const EDGES = []
  FACES.forEach((f, a) => adj[a].forEach(b => {
    if (b < a) return
    const both = f.ring.filter(i => FACES[b].ring.includes(i))
    EDGES.push({ a, b, i: both[0], j: both[1] })
  }))
  const inradius = FACES[0].c.length()
  const CENTRE = new THREE.Vector3(MODEL.x, PT.top + inradius + 0.002, MODEL.z)
  const FLAT_Q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), UP))
  // the flat sheet of hexagons: one in the middle, six round it (a vertex of each along +x)
  const FLAT = [new THREE.Vector3(0, 0, 0), ...Array.from({ length: 6 }, (_, k) => {
    const a = Math.PI / 6 + (k * Math.PI) / 3
    return new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(Math.sqrt(3) * EDGE)
  })].map(p => p.add(new THREE.Vector3(MODEL.x, PT.top + 0.004, MODEL.z)))
  const FLAT_CORNERS = [0, 6, 10, 13, 16, 19, 22, 24]
  // the table, its piles of paper, the tape, the book
  const hexPaper = new THREE.MeshStandardMaterial({ color: '#d2cec2', roughness: 0.92, side: THREE.DoubleSide })
  const pentPaper = new THREE.MeshStandardMaterial({ color: '#6c56c4', roughness: 0.85, side: THREE.DoubleSide })
  const hexGeo = polyGeo(6, EDGE, 0.975)
  const pentGeo = polyGeo(5, EDGE, 0.975)
  const piles = {}
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(PT.w, 0.05, PT.d, 2, 0.012), mats.wood)
    top.position.set(PT.x, PT.top - 0.025, PT.z)
    root.add(top)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, PT.top - 0.05, 0.05), mats.steel)
      leg.position.set(PT.x + sx * (PT.w / 2 - 0.06), (PT.top - 0.05) / 2, PT.z + sz * (PT.d / 2 - 0.06))
      root.add(leg)
    }
    solids.push(box(PT.x, PT.z, PT.w, PT.d))
    const rnd = random(8)
    for (const kind of ['h', 'p']) {
      const pile = new THREE.Group()
      for (let i = 0; i < 9; i++) {
        const m = new THREE.Mesh(kind === 'h' ? hexGeo : pentGeo, kind === 'h' ? hexPaper : pentPaper)
        m.quaternion.copy(FLAT_Q)
        m.rotateZ((rnd() - 0.5) * 0.5)
        m.position.set((rnd() - 0.5) * 0.02, 0.003 + i * 0.004, (rnd() - 0.5) * 0.02)
        pile.add(m)
      }
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 12), ghost)
      hit.position.y = 0.05
      pile.add(hit)
      pile.position.set(PILES[kind].x, PT.top, PILES[kind].z)
      root.add(pile)
      piles[kind] = pile
    }
    // a tape dispenser and the library book about Fuller's domes
    const disp = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.07, 0.07, 2, 0.02), mats.black)
    disp.position.set(PT.x - 0.32, PT.top + 0.035, PT.z - 0.62)
    disp.rotation.y = 0.4
    const roll = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.012, 8, 20), new THREE.MeshStandardMaterial({ color: '#e8e4d0', roughness: 0.3, transparent: true, opacity: 0.8 }))
    roll.position.set(PT.x - 0.32, PT.top + 0.075, PT.z - 0.62)
    roll.rotation.y = 0.4
    const cover = canvasTex(128, 168, (g, w, h) => {
      g.fillStyle = '#26324a'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(230,236,255,0.8)'
      g.lineWidth = 1.5
      g.beginPath()
      g.arc(w / 2, h * 0.62, 40, Math.PI, 0)
      g.stroke()
      for (let k = 1; k < 6; k++) {
        g.beginPath()
        g.ellipse(w / 2, h * 0.62, 40 * Math.cos((k * Math.PI) / 12), 40, 0, Math.PI, 0)
        g.stroke()
      }
      for (let k = 1; k < 4; k++) {
        const y = h * 0.62 - 40 * Math.sin((k * Math.PI) / 8)
        const half = 40 * Math.cos((k * Math.PI) / 8)
        g.beginPath()
        g.moveTo(w / 2 - half, y)
        g.lineTo(w / 2 + half, y)
        g.stroke()
      }
      g.fillStyle = 'rgba(230,236,255,0.8)'
      g.fillRect(20, 24, w - 40, 6)
      g.fillRect(30, 38, w - 60, 4)
    })
    textures.push(cover)
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.27), [mats.paint, mats.paint, new THREE.MeshStandardMaterial({ map: cover, roughness: 0.7 }), mats.paint, mats.paint, mats.paint])
    book.position.set(PT.x + 0.28, PT.top + 0.0175, PT.z + 0.68)
    book.rotation.y = -0.35
    root.add(disp, roll, book)
  }
  // the pieces: seven to lie flat, one for each face of the ball
  const flatPieces = FLAT.map(() => {
    const m = new THREE.Mesh(hexGeo, hexPaper)
    m.visible = false
    root.add(m)
    return m
  })
  const slotPieces = FACES.map(f => {
    const m = new THREE.Mesh(f.kind === 'h' ? hexGeo : pentGeo, f.kind === 'h' ? hexPaper : pentPaper)
    m.visible = false
    root.add(m)
    return m
  })
  const slotPose = f => ({ p: CENTRE.clone().add(FACES[f].c), q: FACES[f].q.clone() })
  const flatPose = i => ({ p: FLAT[i].clone(), q: FLAT_Q.clone() })
  const pilePose = kind => ({ p: piles[kind].position.clone().add(new THREE.Vector3(0, 0.04, 0)), q: FLAT_Q.clone() })
  // tape across every seam whose two pieces have landed
  const tapeMat = new THREE.MeshStandardMaterial({ color: '#f4f0dc', roughness: 0.25, transparent: true, opacity: 0.55, depthWrite: false })
  const tapes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.003, 0.026), tapeMat, EDGES.length)
  tapes.count = 0
  tapes.frustumCulled = false
  tapes.renderOrder = 2
  root.add(tapes)
  // the carbon atoms, one at every corner
  const atomMat = new THREE.MeshStandardMaterial({ color: '#2e3038', roughness: 0.3, metalness: 0.3, envMap: stage.shine, envMapIntensity: 0.9 })
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 16, 12), atomMat, 60)
  atoms.frustumCulled = false
  atoms.count = 0
  root.add(atoms)
  let atomK = 0
  // the hit shape of the finished ball
  const ballHit = new THREE.Mesh(new THREE.SphereGeometry(inradius * 1.08, 16, 12), ghost)
  ballHit.position.copy(CENTRE)
  root.add(ballHit)

  // ---- the model's state ----
  // B: flat (hexagons lying flat, before any pentagon), slots (the faces taped on, in order), atoms
  const B = { flat: 0, slots: [], atoms: 0 }
  const anims = new Map() // piece -> { from, to, t, delay, dur }
  const landed = new Set() // faces whose piece has landed (their seams get tape)
  const placed = () => new Set(B.slots)
  const countOf = kind => B.slots.filter(f => FACES[f].kind === kind).length
  const complete = () => B.slots.length === N_FACES
  const corners = () => (B.slots.length ? new Set(B.slots.flatMap(f => FACES[f].ring)).size : FLAT_CORNERS[B.flat])
  /** The lowest empty face of this kind that touches one already taped on (-1 if none). */
  const nextSlot = (kind, have = placed()) => {
    for (let f = 0; f < N_FACES; f++) if (!have.has(f) && FACES[f].kind === kind && adj[f].some(g => have.has(g))) return f
    return -1
  }
  const fly = (piece, from, to, { delay = 0, dur = 0.7, arc = 0.18, onLand = null } = {}) => {
    piece.visible = true
    piece.position.copy(from.p)
    piece.quaternion.copy(from.q)
    anims.set(piece, { from, to, t: -delay, dur, arc, onLand })
  }
  const settle = (piece, pose) => {
    anims.delete(piece)
    piece.visible = true
    piece.position.copy(pose.p)
    piece.quaternion.copy(pose.q)
  }
  function layTapes() {
    let n = 0
    for (const e of EDGES) {
      if (!landed.has(e.a) || !landed.has(e.b)) continue
      const a = corner[e.i]
      const b = corner[e.j]
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const m = FACES[e.a].n.clone().add(FACES[e.b].n).normalize()
      const along = b.clone().sub(a).normalize()
      const across = m.clone().cross(along)
      dummy.position.copy(CENTRE).add(mid).addScaledVector(m, 0.002)
      dummy.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(across, m, along))
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      tapes.setMatrixAt(n++, dummy.matrix)
    }
    tapes.count = n
    tapes.instanceMatrix.needsUpdate = true
  }
  const landOn = f => () => {
    landed.add(f)
    layTapes()
  }
  /** Shows the model as the state says, at once (a newcomer, a state coming back). */
  function showBall() {
    anims.clear()
    landed.clear()
    flatPieces.forEach((m, i) => (i < B.flat ? settle(m, flatPose(i)) : (m.visible = false)))
    slotPieces.forEach(m => (m.visible = false))
    for (const f of B.slots) {
      settle(slotPieces[f], slotPose(f))
      landed.add(f)
    }
    layTapes()
    atomK = B.atoms ? 1 : 0
  }
  const ballPanel = lv => ({
    title: E.ball.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.ball.buttons.hex, onClick: () => ballStep('hex') },
          { label: E.ball.buttons.pent, onClick: () => ballStep('pent') },
          { label: E.ball.buttons.atoms, onClick: () => ballStep('atoms') },
          { label: E.ball.buttons.apart, onClick: () => ballStep('apart') },
        ],
      },
      ...E.ball.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // a visitor's step: a tap on a pile (tape one on), on the finished ball (atoms, then apart), or the
  // panel's buttons
  function ballStep(what) {
    const lv = level()
    const S2 = E.ball.says
    if (what === 'ball') what = B.atoms ? 'apart' : complete() ? 'atoms' : null
    if (what === 'hex') {
      if (!B.slots.length) {
        if (B.flat >= FLAT.length) return say(at(S2.still, lv))
        fly(flatPieces[B.flat], pilePose('h'), flatPose(B.flat))
        B.flat++
        play('tap')
        if (B.flat === 1) say(at(S2.flat, lv))
        else if (B.flat === 4 || B.flat === FLAT.length) say(at(S2.still, lv))
      } else {
        if (complete()) return say(at(S2.closed, lv))
        const f = nextSlot('h')
        if (f < 0) return say(at(S2.noHex, lv))
        B.slots.push(f)
        fly(slotPieces[f], pilePose('h'), slotPose(f), { onLand: landOn(f) })
        play('tap')
        afterPiece(lv)
      }
    } else if (what === 'pent') {
      if (!B.slots.length) {
        // the first pentagon: the ball begins on it, and the flat hexagons curl up round it
        B.slots.push(0)
        fly(slotPieces[0], pilePose('p'), slotPose(0), { onLand: landOn(0) })
        const have = placed()
        for (let i = 0; i < B.flat; i++) {
          const f = nextSlot('h', have)
          have.add(f)
          B.slots.push(f)
          flatPieces[i].visible = false
          fly(slotPieces[f], flatPose(i), slotPose(f), { delay: 0.45 + i * 0.09, dur: 0.9, arc: 0.05, onLand: landOn(f) })
        }
        B.flat = 0
        play('select')
        say(at(S2.curl, lv))
      } else {
        if (complete()) return say(at(S2.closed, lv))
        const f = nextSlot('p')
        if (f < 0) return say(at(S2.apartP, lv))
        B.slots.push(f)
        fly(slotPieces[f], pilePose('p'), slotPose(f), { onLand: landOn(f) })
        play('select')
        afterPiece(lv)
      }
    } else if (what === 'atoms') {
      if (!complete()) return say(at(B.slots.length ? S2.still : S2.flat, lv))
      B.atoms = 1
      play('pop')
      say(at(S2.atoms, lv))
    } else if (what === 'apart') {
      if (!B.slots.length && !B.flat) return
      B.flat = 0
      B.slots = []
      B.atoms = 0
      showBall()
      play('part')
      say(at(S2.apart, lv))
    } else return
    ex.discover('ball', ballPanel, 3.0)
    share('ball')
  }
  function afterPiece(lv) {
    if (complete()) {
      play('celebrate')
      say(at(E.ball.says.closed, lv))
    }
  }
  for (const kind of ['h', 'p']) clickable(piles[kind], () => ballStep(kind === 'h' ? 'hex' : 'pent'))
  clickable(ballHit, () => ballStep('ball'), { when: () => complete() && !anims.size })
  ex.add({
    id: 'ball',
    x: 2.15,
    z: -1.0,
    radius: 1.7,
    manual: true,
    label: E.ball.label,
    verb: () => {
      const H = E.ball.hints
      if (B.atoms) return H.atoms
      if (complete()) return H.closed
      if (!B.slots.length) return B.flat ? H.flat : H.start
      if (B.slots.length === 1) return H.round
      const h = 20 - countOf('h')
      const p = 12 - countOf('p')
      if (h && p) return fill(H.both, { h, p })
      return h ? fill(H.hex, { h }) : fill(H.pent, { p })
    },
    focus: { x: 3.75, y: 1.12, z: -1.0, size: 2.3 },
    act: () => ctx.showPanel(ballPanel),
  })
  const ballSet = (s, liveSet) => {
    const flat = clamp(Math.round(Number(s?.flat) || 0), 0, FLAT.length)
    const seen = new Set()
    const slots = (Array.isArray(s?.slots) ? s.slots : []).map(Number).filter(f => Number.isInteger(f) && f >= 0 && f < N_FACES && !seen.has(f) && seen.add(f))
    const atomsOn = s?.atoms && slots.length === N_FACES ? 1 : 0
    if (!liveSet) {
      Object.assign(B, { flat: slots.length ? 0 : flat, slots, atoms: atomsOn })
      return showBall()
    }
    // someone else's step, played here as if done here
    if (!slots.length && !flat && (B.slots.length || B.flat)) {
      Object.assign(B, { flat: 0, slots: [], atoms: 0 })
      showBall()
      return play('part')
    }
    if (!slots.length) {
      for (let i = B.flat; i < flat; i++) fly(flatPieces[i], pilePose('h'), flatPose(i))
      if (flat < B.flat) for (let i = flat; i < B.flat; i++) flatPieces[i].visible = false
      if (flat !== B.flat) play('tap')
      B.flat = flat
      return
    }
    const had = new Set(B.slots)
    const wasFlat = !B.slots.length ? B.flat : 0
    slots.forEach((f, k) => {
      if (had.has(f)) return
      if (wasFlat && k >= 1 && k <= wasFlat) {
        flatPieces[k - 1].visible = false
        fly(slotPieces[f], flatPose(k - 1), slotPose(f), { delay: 0.45 + k * 0.09, dur: 0.9, arc: 0.05, onLand: landOn(f) })
      } else fly(slotPieces[f], pilePose(FACES[f].kind), slotPose(f), { onLand: landOn(f) })
    })
    if (slots.length > B.slots.length) play(slots.length === N_FACES ? 'celebrate' : 'tap')
    if (atomsOn && !B.atoms) play('pop')
    Object.assign(B, { flat: 0, slots, atoms: atomsOn })
  }
  updates.push((dt, t) => {
    for (const [piece, a] of anims) {
      a.t += dt
      if (a.t < 0) continue
      const k = ease(clamp(a.t / a.dur))
      piece.position.lerpVectors(a.from.p, a.to.p, k)
      piece.position.y += Math.sin(Math.PI * k) * a.arc
      piece.quaternion.slerpQuaternions(a.from.q, a.to.q, k)
      if (a.t >= a.dur) {
        anims.delete(piece)
        a.onLand?.()
      }
    }
    // the atoms pop on, one after another round the ball
    atomK = damp(atomK, B.atoms ? 1 : 0, 2.5, dt)
    const n = B.atoms || atomK > 0.01 ? 60 : 0
    atoms.count = n
    for (let i = 0; i < n; i++) {
      const s = clamp(atomK * 1.6 - (i / 60) * 0.6)
      dummy.position.copy(CENTRE).add(corner[i])
      dummy.quaternion.identity()
      dummy.scale.setScalar(Math.max(0.0001, ease(s)))
      dummy.updateMatrix()
      atoms.setMatrixAt(i, dummy.matrix)
    }
    if (n) atoms.instanceMatrix.needsUpdate = true
  })

  // the chalkboard on the east wall: sketches of the week, and the model's count
  {
    const bw = BOARD.w
    const bh = BOARD.h
    const chalk = canvasTex(1024, 492, (g, w, h) => {
      g.fillStyle = '#26332c'
      g.fillRect(0, 0, w, h)
      const r = random(12)
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(220,230,215,${r() * 0.05})`
        g.fillRect(r() * w, r() * h, 2 + r() * 18, 1 + r() * 3)
      }
      g.strokeStyle = 'rgba(236,240,226,0.85)'
      g.fillStyle = 'rgba(236,240,226,0.88)'
      g.lineCap = 'round'
      g.lineWidth = 3
      // a spectrum: small bumps, one tall line at 60, a smaller one at 70
      g.beginPath()
      g.moveTo(40, 40)
      g.lineTo(40, 250)
      g.lineTo(460, 250)
      g.stroke()
      for (let x = 60; x < 450; x += 10) {
        const tall = x === 220 ? 190 : x === 270 ? 70 : 8 + r() * 14
        g.beginPath()
        g.moveTo(x, 250)
        g.lineTo(x + (r() - 0.5) * 2, 250 - tall)
        g.stroke()
      }
      g.font = '700 30px Nunito'
      g.textAlign = 'center'
      g.fillText('60', 220, 46)
      g.fillText('70', 270, 166)
      g.fillText('720 = 60 × 12', 250, 312)
      // a hexagon and a pentagon, and a question
      const poly = (k, cx, cy, rr, rot) => {
        g.beginPath()
        for (let i = 0; i <= k; i++) {
          const a = rot + (i / k) * TAU
          const x = cx + rr * Math.cos(a) + (r() - 0.5) * 2
          const y = cy + rr * Math.sin(a) + (r() - 0.5) * 2
          if (i) g.lineTo(x, y)
          else g.moveTo(x, y)
        }
        g.stroke()
      }
      poly(6, 110, 400, 50, 0)
      poly(5, 240, 404, 46, -Math.PI / 2)
      g.font = '700 64px Nunito'
      g.fillText('?', 340, 424)
      g.font = '700 38px Nunito'
      formula(g, 'C', '60', 430, 410, 46)
      g.font = '700 30px Nunito'
      // a line down the middle, the count goes on the right
      g.globalAlpha = 0.35
      g.beginPath()
      g.moveTo(540, 30)
      g.lineTo(540, h - 30)
      g.stroke()
      g.globalAlpha = 1
    })
    textures.push(chalk)
    const brd = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.1, bh + 0.1, 0.04), mats.wood)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshStandardMaterial({ map: chalk, roughness: 0.95 }))
    face.position.z = 0.021
    const tray = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.03, 0.08), mats.wood)
    tray.position.set(0, -bh / 2 - 0.04, 0.04)
    brd.add(frame, face, tray)
    stage.onWall(brd, 'e', BOARD.z, BOARD.y, 0.03)
    const lines = ['hex', 'pent', 'corners'].map((k, i) => {
      const t = makeText('', { size: 0.12, color: '#eef2e4', anchorX: 'left', anchorY: 'middle', font: 'body' })
      t.position.set(0.12, 0.32 - i * 0.28, 0.025)
      brd.add(t)
      return t
    })
    let last = ''
    updates.push(() => {
      const h = B.slots.length ? countOf('h') : B.flat
      const p = countOf('p')
      const text = `${h}|${p}|${corners()}`
      if (text === last) return
      last = text
      const [a, b, c] = text.split('|')
      const set = (t, s) => {
        t.text = s
        t.sync()
      }
      set(lines[0], `${E.ball.board.hex}  ${a} / 20`)
      set(lines[1], `${E.ball.board.pent}  ${b} / 12`)
      set(lines[2], `${E.ball.board.corners}  ${c}`)
    })
  }
  // the poster of Fuller's dome at Expo 67, beside the chalkboard
  const poster = new THREE.Group()
  {
    const tex = canvasTex(512, 400, (g, w, h) => {
      const sky = g.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#0b1230')
      sky.addColorStop(0.7, '#2a3466')
      sky.addColorStop(1, '#1a1a2a')
      g.fillStyle = sky
      g.fillRect(0, 0, w, h)
      const r = random(3)
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(255,255,240,${0.3 + r() * 0.6})`
        g.fillRect(r() * w, r() * h * 0.4, 1.5, 1.5)
      }
      // the dome: a geodesic sphere cut at three quarters, its struts lit from inside
      const cx = w / 2
      const cy = h * 0.5
      const R = h * 0.34
      const glow = g.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.3)
      glow.addColorStop(0, 'rgba(255,214,150,0.45)')
      glow.addColorStop(1, 'rgba(255,214,150,0)')
      g.fillStyle = glow
      g.fillRect(0, 0, w, h)
      const geo = new THREE.IcosahedronGeometry(1, 5)
      const pos = geo.attributes.position
      const tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.22)
      const seen = new Set()
      const a = new THREE.Vector3()
      const b = new THREE.Vector3()
      const edges = []
      for (let i = 0; i < pos.count; i += 3) {
        for (const [p, q] of [[i, i + 1], [i + 1, i + 2], [i + 2, i]]) {
          a.fromBufferAttribute(pos, p)
          b.fromBufferAttribute(pos, q)
          const key = [a, b].map(v => v.toArray().map(x => x.toFixed(3)).join(',')).sort().join('|')
          if (seen.has(key)) continue
          seen.add(key)
          if (a.y < -0.5 || b.y < -0.5) continue
          edges.push([a.clone().applyQuaternion(tilt), b.clone().applyQuaternion(tilt)])
        }
      }
      geo.dispose()
      for (const back of [true, false]) {
        g.strokeStyle = back ? 'rgba(200,220,255,0.22)' : 'rgba(225,236,255,0.85)'
        g.lineWidth = back ? 1 : 1.3
        g.beginPath()
        for (const [p, q] of edges) {
          if ((p.z + q.z < 0) !== back) continue
          g.moveTo(cx + p.x * R, cy - p.y * R)
          g.lineTo(cx + q.x * R, cy - q.y * R)
        }
        g.stroke()
      }
      // the ground and the river in front
      const gy = cy + R * 0.62
      g.fillStyle = '#0d1018'
      g.fillRect(0, gy, w, h - gy)
      g.fillStyle = 'rgba(255,214,150,0.18)'
      g.fillRect(cx - R * 0.8, gy + 10, R * 1.6, 6)
      // the caption strip
      g.fillStyle = '#efe9da'
      g.fillRect(0, h - 64, w, 64)
      g.fillStyle = '#1e2436'
      g.font = '700 34px Outfit'
      g.textAlign = 'center'
      g.fillText(E.poster, w / 2, h - 20)
    })
    textures.push(tex)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(POSTER.w + 0.08, POSTER.h + 0.08, 0.03), mats.black)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(POSTER.w, POSTER.h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.25 }))
    face.position.z = 0.017
    poster.add(frame, face)
    stage.onWall(poster, 'e', POSTER.z, POSTER.y, 0.025)
  }
  clickable(poster, () => say(at(E.ball.says.dome, level())), { reach: 5 })

  // ======== 3. rolled-up carbon ========
  // two sheets: armchair (6,6) and zigzag (10,0), each given flat (s across, t up) from the rolled tube
  const sheetMat = new THREE.MeshStandardMaterial({ color: '#33353f', roughness: 0.3, metalness: 0.35, envMap: stage.shine, envMapIntensity: 0.8 })
  const stickMat = new THREE.MeshStandardMaterial({ color: '#dcd6f0', roughness: 0.5 })
  const rimMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4 })
  const sheetGroup = new THREE.Group()
  root.add(sheetGroup)
  function lattice(n, m, cells) {
    const tube = nanotube(n, m, cells)
    const R = tube.radius * SC
    const C = TAU * R
    const flat = tube.atoms.map(([x, y, z]) => ({ s: Math.atan2(y, x) * R, t: z * SC }))
    const L = tube.length * SC
    const deg = flat.map(() => 0)
    tube.bonds.forEach(([i, j]) => {
      deg[i]++
      deg[j]++
    })
    const bonds = tube.bonds.map(([i, j]) => ({ i, j, seam: Math.abs(flat[i].s - flat[j].s) > C / 2, rim: deg[i] < 3 || deg[j] < 3 }))
    const ball = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 12, 8), sheetMat, flat.length)
    const plain = bonds.filter(b => !b.rim)
    const rims = bonds.filter(b => b.rim)
    const sticks = new THREE.InstancedMesh(unitCyl, stickMat, plain.length)
    const rimSticks = new THREE.InstancedMesh(unitCyl, rimMat, rims.length)
    for (const o of [ball, sticks, rimSticks]) {
      o.frustumCulled = false
      sheetGroup.add(o)
    }
    // the three atoms of the top row that hang from the bar's threads
    const topT = Math.max(...flat.map(a => a.t))
    const row = flat.map((a, i) => ({ ...a, i })).filter(a => a.t > topT - 0.01)
    const hang = [-C / 2 + 0.05, 0, C / 2 - 0.05].map(s => row.reduce((b, a) => (Math.abs(a.s - s) < Math.abs(b.s - s) ? a : b)).i)
    return { n, m, R, C, L, flat, plain, rims, ball, sticks, rimSticks, hang, pos: flat.map(() => new THREE.Vector3()) }
  }
  const LAT = { armchair: lattice(6, 6, 8), zigzag: lattice(10, 0, 5) }
  // where an atom is with the sheet rolled by k (0 flat, 1 a closed tube curling away from the room)
  function poseLattice(lat, k) {
    const kap = (k * TAU) / lat.C
    lat.flat.forEach((a, i) => {
      const p = lat.pos[i]
      const y = a.t - lat.L / 2
      if (kap < 1e-4) p.set(0, y, a.s)
      else p.set(-(1 - Math.cos(kap * a.s)) / kap, y, Math.sin(kap * a.s) / kap)
      dummy.position.copy(p)
      dummy.quaternion.identity()
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      lat.ball.setMatrixAt(i, dummy.matrix)
    })
    const seam = span(0.94, 1, k)
    for (const [list, mesh] of [[lat.plain, lat.sticks], [lat.rims, lat.rimSticks]]) {
      list.forEach((b, j) => {
        const a = lat.pos[b.i]
        const c = lat.pos[b.j]
        const w = b.seam ? seam : 1
        stretch(dummy, a, c)
        if (b.seam && seam < 0.01) dummy.scale.set(0.0001, 0.0001, 0.0001)
        else dummy.scale.set(0.011 * w, dummy.scale.y, 0.011 * w)
        dummy.updateMatrix()
        mesh.setMatrixAt(j, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
    }
    lat.ball.instanceMatrix.needsUpdate = true
  }
  // the group's middle is the sheet's middle, so a change of kind shrinks it away there
  const placeSheet = lat => sheetGroup.position.set(SHEET.x, SHEET.y0 + lat.L / 2, SHEET.z)
  placeSheet(LAT.armchair)
  // the bar it hangs from, on two posts, and its three threads
  const barY = SHEET.y0 + Math.max(LAT.armchair.L, LAT.zigzag.L) + 0.32
  const barHalf = Math.max(LAT.armchair.C, LAT.zigzag.C) / 2 + 0.18
  {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, barHalf * 2, 12), mats.steel)
    bar.rotation.x = Math.PI / 2
    bar.position.set(SHEET.x, barY, SHEET.z)
    root.add(bar)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, barY + 0.03, 0.05), mats.steel)
      post.position.set(SHEET.x, (barY + 0.03) / 2, SHEET.z + s * barHalf)
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.12), mats.steel)
      foot.position.set(SHEET.x - 0.1, 0.02, SHEET.z + s * barHalf)
      root.add(post, foot)
      solids.push(circle(SHEET.x, SHEET.z + s * barHalf, 0.2))
    }
  }
  const threadMat = new THREE.MeshStandardMaterial({ color: '#c8c4b8', roughness: 0.6 })
  const threads = [0, 1, 2].map(() => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1, 5), threadMat)
    root.add(m)
    return m
  })
  const sheetHit = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.7, 2.1), ghost)
  sheetHit.position.set(SHEET.x - 0.3, SHEET.y0 + 0.78, SHEET.z)
  root.add(sheetHit)
  solids.push(box(SHEET.x - 0.3, SHEET.z, 0.75, 2.0))
  // the two signs on stands in front: the rim each way of rolling gives
  const signs = {}
  const signMats = {}
  for (const kind of ['armchair', 'zigzag']) {
    const tex = canvasTex(256, 160, (g, w, h) => {
      g.fillStyle = '#121a33'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#d8d0ff'
      g.lineWidth = 6
      g.lineJoin = 'round'
      g.beginPath()
      // the rim's profile: armchairs (a seat between two arms) or a zigzag
      const y0 = 92
      if (kind === 'armchair') {
        let x = 22
        g.moveTo(x, y0)
        while (x < w - 40) {
          g.lineTo(x + 12, y0 - 22)
          g.lineTo(x + 36, y0 - 22)
          g.lineTo(x + 48, y0)
          g.lineTo(x + 72, y0)
          x += 72
        }
      } else {
        let x = 20
        g.moveTo(x, y0)
        while (x < w - 30) {
          g.lineTo(x + 18, y0 - 30)
          g.lineTo(x + 36, y0)
          x += 36
        }
      }
      g.stroke()
      g.fillStyle = '#f0ecff'
      g.font = '700 34px Outfit'
      g.textAlign = 'center'
      g.fillText(E.tube.tags[kind], w / 2, h - 18)
    })
    textures.push(tex)
    const st = new THREE.Group()
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.62, 8), mats.steel)
    leg.position.y = 0.31
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.03, 18), mats.steel)
    foot.position.y = 0.015
    const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.4 })
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.3, 0.03, 2, 0.01), edgeMat)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.26), new THREE.MeshBasicMaterial({ map: tex }))
    face.position.z = 0.016
    const board = new THREE.Group()
    board.add(plate, face)
    board.position.y = 0.72
    board.rotation.x = -0.5
    st.add(leg, foot, board)
    st.position.set(SIGNS[kind].x, 0, SIGNS[kind].z)
    st.rotation.y = Math.PI / 2
    root.add(st)
    solids.push(circle(SIGNS[kind].x, SIGNS[kind].z, 0.18))
    signs[kind] = st
    signMats[kind] = edgeMat
  }
  // the rig: a steel wire and the nanotube, just as thin, hanging side by side from a beam
  const rig = {}
  {
    for (const z of [RIG.za, RIG.zb]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, RIG.bar, 0.06), mats.steel)
      post.position.set(RIG.x, RIG.bar / 2, z)
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.14), mats.steel)
      foot.position.set(RIG.x, 0.02, z)
      root.add(post, foot)
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, RIG.zb - RIG.za + 0.1), mats.steel)
    beam.position.set(RIG.x, RIG.bar + 0.05, (RIG.za + RIG.zb) / 2)
    root.add(beam)
    const mat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, RIG.zb - RIG.za - 0.12), mats.rubber)
    mat.position.set(RIG.x, 0.01, (RIG.za + RIG.zb) / 2)
    root.add(mat)
    solids.push(box(RIG.x, (RIG.za + RIG.zb) / 2, 0.6, RIG.zb - RIG.za + 0.15))
    const steelMat = new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.25, metalness: 0.9, envMap: stage.shine, envMapIntensity: 1 })
    const tubeMat = new THREE.MeshStandardMaterial({ color: '#2a2c34', emissive: color, emissiveIntensity: 0.35, roughness: 0.4 })
    const hanger = () => {
      const g = new THREE.Group()
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 16, Math.PI * 1.5), mats.chrome)
      hook.position.y = 0.0
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 8), mats.chrome)
      rod.position.y = -0.17
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 20), mats.chrome)
      plate.position.y = -0.32
      g.add(hook, rod, plate)
      return g
    }
    const clamp1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.07), mats.dark)
    clamp1.position.set(RIG.x, RIG.bar - 0.025, RIG.steel)
    const clamp2 = clamp1.clone()
    clamp2.position.z = RIG.tube
    root.add(clamp1, clamp2)
    const top = RIG.bar - 0.05
    rig.steelWire = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 1, 6), steelMat)
    stretch(rig.steelWire, new THREE.Vector3(RIG.x, top, RIG.steel), new THREE.Vector3(RIG.x, RIG.hook + 0.03, RIG.steel))
    rig.stub = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 1, 6), steelMat)
    stretch(rig.stub, new THREE.Vector3(RIG.x, top, RIG.steel), new THREE.Vector3(RIG.x + 0.03, top - 0.42, RIG.steel + 0.04))
    rig.stub.visible = false
    rig.tubeWire = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 1, 6).translate(0, -0.5, 0), tubeMat)
    rig.tubeWire.position.set(RIG.x, top, RIG.tube)
    rig.tubeWire.scale.set(1, 0.0001, 1)
    rig.tubeLen = top - RIG.hook - 0.03
    rig.steelHanger = hanger()
    rig.steelHanger.position.set(RIG.x, RIG.hook, RIG.steel)
    rig.tubeHanger = hanger()
    rig.tubeHanger.position.set(RIG.x, RIG.hook, RIG.tube)
    rig.tubeHanger.visible = false
    root.add(rig.steelWire, rig.stub, rig.tubeWire, rig.steelHanger, rig.tubeHanger)
    rig.hit = new THREE.Group()
    for (const z of [RIG.steel, RIG.tube]) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.75, 0.4), ghost)
      h.position.set(RIG.x, RIG.hook - 0.1, z)
      rig.hit.add(h)
    }
    const fallen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.6), ghost)
    fallen.position.set(RIG.x + 0.1, 0.15, RIG.steel)
    rig.hit.add(fallen)
    root.add(rig.hit)
    // the pile of weights on a stool
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, PILE.top, 18), mats.paint)
    stool.position.set(PILE.x, PILE.top / 2, PILE.z)
    root.add(stool)
    solids.push(circle(PILE.x, PILE.z, 0.26))
    rig.pileHit = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 10), ghost)
    rig.pileHit.position.set(PILE.x, PILE.top + 0.25, PILE.z)
    root.add(rig.pileHit)
  }
  tag(E.tube.tags.steel, RIG.x + 0.06, RIG.bar + 0.22, RIG.steel, Math.PI / 2, 0.09)
  tag(E.tube.tags.tube, RIG.x + 0.06, RIG.bar + 0.22, RIG.tube, Math.PI / 2, 0.09)
  // iron weights in two shades, so a stack shows each one
  const ironMats = ['#3c3f45', '#5a5f68'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.7, envMap: stage.shine, envMapIntensity: 0.6 }))
  const discGeo = new THREE.CylinderGeometry(DISC.r, DISC.r, DISC.h * 0.94, 24)
  const discs = Array.from({ length: WMAX + SNAP }, (_, i) => {
    const m = new THREE.Mesh(discGeo, ironMats[i % 2])
    root.add(m)
    return { m, anim: null, where: '' }
  })

  // ---- the tube's state ----
  // T: kind (armchair or zigzag), rolled (0 or 1), w (weights on the tube; the steel takes the same up to SNAP)
  const T = { kind: 'armchair', rolled: 0, w: 0 }
  let shownKind = 'armchair'
  let rollK = 0
  let swapK = 1
  let poseDirty = true
  let broken = 0 // the steel's fall, 0 hanging to 1 on the floor
  let breakAt = -1 // seconds until the steel snaps (after its third weight lands)
  let tubeGrow = 0
  const steelLoad = () => Math.min(T.w, SNAP)
  const tubePanel = lv => ({
    title: E.tube.title,
    color,
    blocks: [
      { buttons: ['armchair', 'zigzag', 'unroll', 'weight', 'off'].map(k => ({ label: E.tube.buttons[k], onClick: () => tubeStep(k === 'unroll' ? 'sheet' : k) })) },
      ...E.tube.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // where weight i sits now: the tube's hanger, the steel's, or the pile
  function discTarget(i) {
    if (i < T.w) return rig.tubeHanger.localToWorld(new THREE.Vector3(0, -0.3125 + DISC.h / 2 + i * DISC.h, 0))
    const j = i - WMAX
    if (j >= 0 && j < steelLoad()) return rig.steelHanger.localToWorld(new THREE.Vector3(0, -0.3125 + DISC.h / 2 + j * DISC.h, 0))
    // the pile: those not hung, stacked in order
    let k = 0
    for (let q = 0; q < i; q++) if (!(q < T.w || (q >= WMAX && q - WMAX < steelLoad()))) k++
    return new THREE.Vector3(PILE.x, PILE.top + DISC.h / 2 + k * DISC.h, PILE.z)
  }
  // a visitor's step: a tap on a sign (roll that way), the sheet (roll or unroll), the weights (hang one
  // more), a hook (take them off), or the panel's buttons
  function tubeStep(what) {
    const lv = level()
    const SY = E.tube.says
    if (what === 'sheet') what = T.rolled ? 'unroll' : T.kind
    if (what === 'armchair' || what === 'zigzag') {
      T.kind = what
      T.rolled = 1
      T.w = 0
      play('select')
      say(at(SY[what], lv))
    } else if (what === 'unroll') {
      if (!T.rolled) return
      T.rolled = 0
      T.w = 0
      play('tap')
      say(at(SY.unroll, lv))
    } else if (what === 'weight') {
      if (!T.rolled) return say(at(SY.first, lv))
      if (T.w >= WMAX) return say(at(SY.full, lv))
      T.w++
      play('tap')
      if (T.w === SNAP) say(at(SY.snap, lv))
      else if (T.w === WMAX) say(at(SY.hold, lv))
      else if (T.w < SNAP) say(at(SY.hang, lv))
      onWeight()
    } else if (what === 'off') {
      if (!T.w) return
      T.w = 0
      play('tap')
      say(at(SY.off, lv))
    } else return
    ex.discover('tube', tubePanel, 3.0)
    share('tube')
  }
  // the steel snaps half a second after its third weight lands
  const onWeight = () => {
    if (T.w === SNAP && !broken) breakAt = 1.0
  }
  for (const kind of ['armchair', 'zigzag']) clickable(signs[kind], () => tubeStep(kind))
  clickable(sheetHit, () => tubeStep('sheet'))
  clickable(rig.pileHit, () => tubeStep('weight'))
  clickable(rig.hit, () => tubeStep('off'), { when: () => T.w > 0 })
  const tubeItem = ex.add({
    id: 'tube',
    x: -2.55,
    z: 0.45,
    radius: 1.9,
    manual: true,
    label: E.tube.label,
    verb: () => {
      const H = E.tube.hints
      if (!T.rolled) return H.roll
      if (!T.w) return H.hang
      if (T.w < SNAP) return H.more
      if (T.w < WMAX) return H.snapped
      return H.off
    },
    focus: { x: -4.3, y: 1.3, z: 0.5, size: 4.1 },
    act: () => ctx.showPanel(tubePanel),
  })
  // on a phone: the sheet and its signs, or the rig once there is a tube to hang
  focusBy(tubeItem, tubeItem.focus, () => (T.rolled ? { x: -4.3, y: 1.1, z: 1.63, size: 3.6 } : { x: -4.2, y: 1.2, z: -0.75, size: 3.6 }))
  const tubeSet = (s, liveSet) => {
    const kind = s?.kind === 'zigzag' ? 'zigzag' : 'armchair'
    const rolled = s?.rolled ? 1 : 0
    const w = rolled ? clamp(Math.round(Number(s?.w) || 0), 0, WMAX) : 0
    if (liveSet && (kind !== T.kind || rolled !== T.rolled || w !== T.w)) play(rolled !== T.rolled ? 'select' : 'tap')
    const more = w > T.w
    Object.assign(T, { kind, rolled, w })
    if (liveSet) {
      if (more) onWeight()
      return
    }
    // as it stands, at once
    shownKind = kind
    placeSheet(LAT[kind])
    rollK = rolled
    swapK = 1
    tubeGrow = rolled
    broken = w >= SNAP ? 1 : 0
    breakAt = -1
    discs.forEach(d => {
      d.anim = null
      d.where = ''
    })
    poseDirty = true
  }
  updates.push((dt, t) => {
    // the sheet: a change of kind unrolls first, swaps, then rolls the new way
    const wantRoll = T.kind === shownKind ? T.rolled : 0
    const before = rollK
    if (T.kind !== shownKind && rollK < 0.01) {
      swapK = Math.max(0, swapK - dt / 0.25)
      if (swapK <= 0) {
        shownKind = T.kind
        placeSheet(LAT[shownKind])
        poseDirty = true
      }
    } else if (T.kind === shownKind && swapK < 1) swapK = Math.min(1, swapK + dt / 0.25)
    rollK = wantRoll > rollK ? Math.min(wantRoll, rollK + dt / 1.4) : Math.max(wantRoll, rollK - dt / 1.0)
    for (const kind of ['armchair', 'zigzag']) {
      const lat = LAT[kind]
      const on = kind === shownKind
      lat.ball.visible = lat.sticks.visible = lat.rimSticks.visible = on
      signMats[kind].emissiveIntensity = on && T.rolled ? 1.4 : 0.5
    }
    sheetGroup.scale.setScalar(Math.max(0.0001, ease(swapK)))
    if (poseDirty || rollK !== before) {
      poseLattice(LAT[shownKind], ease(rollK))
      poseDirty = false
    }
    rimMat.emissiveIntensity = 0.9 + Math.sin(t * 2.4) * 0.25
    // the threads from the bar to the top row
    const lat = LAT[shownKind]
    lat.hang.forEach((i, k) => {
      const atom = sheetGroup.localToWorld(tmpV.copy(lat.pos[i]))
      stretch(threads[k], new THREE.Vector3(SHEET.x, barY, SHEET.z + (k - 1) * (barHalf - 0.12)), atom)
    })
    // the rig: the tube thread grows down from its clamp once there is a tube
    tubeGrow = damp(tubeGrow, T.rolled && rollK > 0.9 ? 1 : 0, 5, dt)
    rig.tubeWire.scale.y = Math.max(0.0001, tubeGrow * rig.tubeLen)
    rig.tubeHanger.visible = tubeGrow > 0.95
    // the steel: snaps after its third weight, falls to the mat; a new one when the weights come off
    if (breakAt > 0) {
      breakAt -= dt
      if (breakAt <= 0 && T.w >= SNAP) {
        broken = 0.0001
        play('crack')
      }
    }
    if (T.w < SNAP && broken) {
      broken = 0
      breakAt = -1
    }
    if (broken > 0 && broken < 1) {
      broken = Math.min(1, broken + dt / 0.55)
      if (broken >= 1) play('bang')
    }
    const fall = broken > 0 ? broken * broken : 0
    rig.steelWire.visible = broken === 0
    rig.stub.visible = broken > 0
    rig.steelHanger.position.set(RIG.x + fall * 0.12, RIG.hook - fall * (RIG.hook - 0.37), RIG.steel)
    rig.steelHanger.rotation.set(0, 0, fall * 0.5)
    rig.hit.children[2].visible = broken > 0
    // the weights fly to where they belong
    rig.steelHanger.updateMatrixWorld()
    rig.tubeHanger.updateMatrixWorld()
    discs.forEach((d, i) => {
      const where = i < T.w ? 't' : i >= WMAX && i - WMAX < steelLoad() ? 's' : 'p'
      const target = discTarget(i)
      if (where !== d.where) {
        if (d.where) d.anim = { from: d.m.position.clone(), t: 0 }
        d.where = where
      }
      if (d.anim) {
        d.anim.t += dt / 0.5
        const k = ease(clamp(d.anim.t))
        d.m.position.lerpVectors(d.anim.from, target, k)
        d.m.position.y += Math.sin(Math.PI * k) * 0.25
        if (d.anim.t >= 1) d.anim = null
      } else d.m.position.copy(target)
      d.m.rotation.set(0, 0, where === 's' ? fall * 0.5 : 0)
    })
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 4.6 },
    spawn: { x: 0, z: 2.6, yaw: 0 },
    hostSpot: { x: -1.5, z: 1.9, yaw: Math.atan2(-1.5, -0.8) },
    back: { x: 0, z: 5.2, rot: Math.PI },
    stand: { x: 2.0, z: 1.5, rot: Math.atan2(-2.0, 1.1) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      beam: {
        tap: what => beamStep(what), // 'laser' or 'helium'
        set: v => setHe(v), // the panel's slider
        get state() { return { ...S } },
        laserAt: () => new THREE.Vector3((LASER.x0 + LASER.x1) / 2, BEAM_Y, LINE_Z),
        heliumAt: () => new THREE.Vector3(HE.x, 1.0, HE.z),
      },
      ball: {
        tap: what => ballStep(what), // 'hex', 'pent', 'ball'; or 'atoms', 'apart' (the panel)
        get state() { return { flat: B.flat, slots: [...B.slots], atoms: B.atoms } },
        hexAt: () => piles.h.position.clone().add(new THREE.Vector3(0, 0.03, 0)),
        pentAt: () => piles.p.position.clone().add(new THREE.Vector3(0, 0.03, 0)),
        ballAt: () => CENTRE.clone(),
        posterAt: () => poster.position.clone(),
      },
      tube: {
        tap: what => tubeStep(what), // 'armchair', 'zigzag', 'sheet', 'weight'; or 'off', 'unroll'
        get state() { return { ...T } },
        signAt: kind => signs[kind].position.clone().setY(0.72),
        sheetAt: () => new THREE.Vector3(SHEET.x, SHEET.y0 + 0.8, SHEET.z),
        pileAt: () => new THREE.Vector3(PILE.x, PILE.top + 0.15, PILE.z),
        hookAt: () => new THREE.Vector3(RIG.x, RIG.hook - 0.2, RIG.tube),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { beam: beamPanel, ball: ballPanel, tube: tubePanel },
    shared: {
      beam: { get: () => ({ on: S.on, he: Math.round(S.he * 100) / 100 }), set: beamSet },
      ball: { get: () => ({ flat: B.flat, slots: [...B.slots], atoms: B.atoms }), set: ballSet },
      tube: { get: () => ({ ...T }), set: tubeSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (heSend) clearTimeout(heSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
