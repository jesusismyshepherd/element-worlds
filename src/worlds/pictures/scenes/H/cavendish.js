// Hydrogen's picture "A fire that makes water?" as a room (docs/knowledge/picture-rooms.md): the picture made
// into Henry Cavendish's laboratory in London, a summer night in 1781 (stages/townhouse.js: a panelled
// Georgian room, sash windows onto moonlit roofs, a coal fire, his books). The picture's table runs along the
// back wall in two benches; his quart bottles of 1766 stand on a table by the windows. Three things to do,
// each step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive);
// the prompt names the next tap, E opens the station's panel, whose buttons (and sliders) do the same:
// - inflammable air (1766): three saucers (zinc, iron wire, tinfoil) and two acids (oil of vitriol, spirit
//   of salt); tap a metal and an acid and the bottle fizzes, the gas runs through the bent tube into the
//   upturned jar in the trough and pushes its water down; tap the full jar and it goes, stoppered, onto the
//   balance in place of a jar of common air: the beam tips, far lighter. A slate ticks each metal and acid
//   weighed: any metal, either acid, the same light gas;
// - the bottles (1766): nine quart bottles of inflammable air mixed with common air, 1 part in 10 up to 8,
//   and one of pure gas; tap a bottle and the taper goes to its mouth: what each did is what Cavendish wrote
//   (no fire at 1 in 10 until the flame went inside, a very loud noise at 3 and 4, a puff at 7, a quiet
//   flame in the neck at 8); the slate draws each bang's loudness as the visitor tries them;
// - the spark globe (1781): tap the brass cock and a mixture comes in from two jars (the inflammable air's
//   water rising twice as fast as the dephlogisticated air's), tap the machine's handle to charge the Leyden
//   jar, tap the globe: a spark, a flash, dew. After a few sparks a drop of water; tap it and the picture's
//   lens shows its molecules, tap the lens and two H2 and one O2 become two H2O; the slate counts the gases
//   used up to Cavendish's own 37000 and 19500 grain measures; the book from Paris (1787) names the gas.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, num, random } from '../../../wings/noble/kit.js'
import { townhouseStage } from '../../stages/townhouse.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { CAVENDISH_WORDS } from './cavendish.words.js'

export const WORDS = CAVENDISH_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const round1 = v => Math.round(v * 10) / 10

// ---- where things stand (metres; the spawn at z = 3.2 looks along -z, toward the picture's table) ----
const ROOM = { x0: -6.4, x1: 6.4, z0: -6.4, z1: 6.6, h: 4.3 }
const TOP = 0.86
const BENCH_A = { x: -3.3, z: -5.78, w: 4.0, d: 0.8 }
const BENCH_B = { x: 3.3, z: -5.78, w: 4.0, d: 0.8 }
const TABLE2 = { x: -5.95, z: 0.35, w: 0.6, d: 2.7, top: 0.8 }
// station 1: the saucers, the acids, the bottle, the trough, the balance
const DISH = [{ x: -5.0, z: -5.52 }, { x: -4.66, z: -5.52 }, { x: -4.32, z: -5.52 }]
const ACID = [{ x: -4.98, z: -5.98 }, { x: -4.62, z: -5.98 }]
const FLASK = { x: -4.05, z: -5.72 }
const TROUGH = { x: -3.05, z: -5.74, w: 0.8, d: 0.5, h: 0.15, water: 0.12 }
const JAR = { r: 0.06, h: 0.3 }
const JAR_AT = new THREE.Vector3(TROUGH.x + 0.06, TOP + 0.045, TROUGH.z + 0.02) // the jar's mouth in the trough, under water
const BAL = { x: -1.95, z: -5.75, arm: 0.4, beam: TOP + 0.98, hang: 0.8, max: 0.16 }
// station 3: the gas jars, the globe, the lens, the Leyden jar, the machine, the book
const GASES = { x: 1.85, z: -5.74, w: 0.56, d: 0.32, h: 0.15 }
const GLOBE = { x: 2.55, z: -5.7, y: TOP + 0.3, r: 0.055 }
const LENS = { x: 2.18, y: 1.56, z: -5.98, r: 0.19 }
const LEYDEN = { x: 3.28, z: -5.6 }
const MACHINE = { x: 3.98, z: -5.8 }
const BOOK = { x: 4.72, z: -5.66 }
// Cavendish's own figures: grain measures of each gas used, six fillings of the globe in all
const INF = [0, 6200, 12300, 18500, 24700, 30800, 37000]
const DEP = [0, 3250, 6500, 9750, 13000, 16250, 19500]
const FILLS = 6
// the bottles: parts of inflammable air in ten, and what each did (Cavendish, 1766; the pure one today)
const MIX = [1, 2, 3, 4, 5, 6, 7, 8, 10]
const LOUD = [0.04, 0.55, 0.92, 1, 0.9, 0.4, 0.2, 0, 0]
// metals: zinc fizzes fast, iron less, tin slowly (seconds to fill the jar)
const DUR = [5, 7, 10]

const lathe = (pts, seg = 20) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)

/** A line of geometry between two points (a cylinder of height 1), for streams and wires that move. */
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(1, Math.max(0.001, a.distanceTo(b)), 1)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
}

/** A ring for the bangs' sound, drawn round as it spreads. */
function ringTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, w * 0.3, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0)')
    grd.addColorStop(0.7, 'rgba(255,255,255,0.9)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** What shiny brass and glass reflect here: dark panelling, candle spots, a cold window. */
function shineEnv() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#0e0e16')
    grd.addColorStop(0.45, '#4a4658')
    grd.addColorStop(0.55, '#34303e')
    grd.addColorStop(1, '#0c0a0c')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#3a4a78'
    g.fillRect(w * 0.15, h * 0.2, w * 0.06, h * 0.3)
    for (const [x, y, r] of [[0.35, 0.42, 8], [0.52, 0.45, 11], [0.8, 0.4, 7]]) {
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

// ---- the room ----

export async function build({ ctx, root, lang, E, W, ex, say, light, level, color, clickable }) {
  const stage = townhouseStage({
    light,
    ...ROOM,
    windows: [{ side: 'w', at: -3.3 }, { side: 'w', at: 3.7 }],
    fireplace: { side: 'e', at: -0.4 },
    door: { side: 'e', at: 4.3 },
    bookcases: [{ side: 'n', at: 0, width: 1.9 }, { side: 'e', at: -3.2, width: 1.5 }, { side: 'e', at: 2.0, width: 1.5 }, { side: 's', at: -3.7, width: 2.0 }, { side: 's', at: 3.7, width: 2.0 }],
    rug: { x: 0, z: -0.4, w: 4.6, d: 3.2 },
  })
  root.add(stage.group)
  const { mats, candle, soft, flame } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const env = shineEnv()
  const rings = ringTex()
  textures.push(env, rings)
  const tmpV = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#d6ecf2', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.3, depthWrite: false, envMap: env, envMapIntensity: 1.2, side: THREE.DoubleSide })
  const waterMat = new THREE.MeshStandardMaterial({ color: '#4f86b8', roughness: 0.1, transparent: true, opacity: 0.5, depthWrite: false, emissive: '#10283c', emissiveIntensity: 0.6 })
  const brass = new THREE.MeshStandardMaterial({ color: '#c49a4c', roughness: 0.28, metalness: 0.9, envMap: env, envMapIntensity: 1.1 })
  const porcelain = new THREE.MeshStandardMaterial({ color: '#d4d0c6', roughness: 0.35 })
  const label = (text, size = 0.045, c = '#f2e6c8') => makeText(text, { size, color: c, anchorY: 'middle', outlineWidth: size * 0.08, outlineColor: '#1a1208' })
  // a soft dim fill of the room's own (the candles do the rest)
  root.add(new THREE.HemisphereLight('#4a4258', '#22160e', light ? 0.45 : 0.3))

  // the flash of a bang or a spark, moved to where it happens
  const flashLight = new THREE.PointLight('#cfe0ff', 0, 4, 1.6)
  root.add(flashLight)
  let flash = 0

  // gold sparks for a find, anywhere
  const SP = light ? 40 : 80
  const spPos = new Float32Array(SP * 3)
  const spList = Array.from({ length: SP }, () => ({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3() }))
  const spGeo = new THREE.BufferGeometry()
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3))
  const spMat = new THREE.PointsMaterial({ map: soft, color: new THREE.Color('#ffd166').multiplyScalar(2), size: 0.05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const sparkles = new THREE.Points(spGeo, spMat)
  sparkles.frustumCulled = false
  sparkles.raycast = () => {}
  root.add(sparkles)
  let spNext = 0
  function sparkle(p, n = 30) {
    for (let i = 0; i < n; i++) {
      const s = spList[spNext]
      spNext = (spNext + 1) % SP
      s.p.copy(p)
      const a = Math.random() * TAU
      s.v.set(Math.cos(a) * 0.4, 0.4 + Math.random() * 0.8, Math.sin(a) * 0.4).multiplyScalar(0.5 + Math.random())
      s.life = 0.6 + Math.random() * 0.6
    }
  }
  updates.push(dt => {
    for (let i = 0; i < SP; i++) {
      const s = spList[i]
      if (s.life > 0) {
        s.life -= dt
        s.v.y -= 1.2 * dt
        s.p.addScaledVector(s.v, dt)
        spPos.set([s.p.x, s.p.y, s.p.z], i * 3)
      } else spPos[i * 3 + 1] = -9
    }
    spGeo.attributes.position.needsUpdate = true
    flash = Math.max(0, flash - dt * 3.2)
    flashLight.intensity = flash * 3
  })

  // a slate on a wall, its face a canvas (chalk on slate), readable by candlelight
  function slate(w, h, pw, ph) {
    const g = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.04, 2, 0.015), mats.wood)
    const tex = canvasTex(pw, ph, () => {}, { mipmaps: true })
    textures.push(tex)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.32 }))
    face.position.z = 0.022
    g.add(frame, face)
    root.add(g)
    return { group: g, tex }
  }
  const chalk = '#ecead8'
  const chalkFont = (px, weight = 600) => `${weight} ${px}px Georgia, 'Times New Roman', serif`
  const slateBg = (g, w, h) => {
    g.fillStyle = '#25292c'
    g.fillRect(0, 0, w, h)
    const r = random(5)
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(236,234,216,${0.02 + r() * 0.03})`
      g.fillRect(r() * w, r() * h, 20 + r() * 80, 2 + r() * 5)
    }
  }

  // a bench along the back wall: a mahogany top on turned legs
  function bench({ x, z, w, d }) {
    const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.06, d, 2, 0.015), mats.wood)
    top.position.set(x, TOP - 0.03, z)
    root.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.022, TOP - 0.06, 10), mats.wood)
        leg.position.set(x + sx * (w / 2 - 0.08), (TOP - 0.06) / 2, z + sz * (d / 2 - 0.08))
        root.add(leg)
      }
    }
    const apron = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.12, 0.03), mats.wood)
    apron.position.set(x, TOP - 0.12, z + d / 2 - 0.04)
    root.add(apron)
    solids.push(box(x, z, w, d))
  }
  bench(BENCH_A)
  bench(BENCH_B)

  // ======== the room's furniture: an armchair by the fire, his hat, candles ========
  {
    const chair = new THREE.Group()
    const cloth = new THREE.MeshStandardMaterial({ color: '#5a2a26', roughness: 0.85 })
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.14, 0.6, 2, 0.04), cloth)
    seat.position.y = 0.42
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.7, 0.14, 2, 0.05), cloth)
    back.position.set(0, 0.8, -0.26)
    chair.add(seat, back)
    for (const sx of [-1, 1]) {
      const arm = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.22, 0.56, 2, 0.04), cloth)
      arm.position.set(sx * 0.33, 0.6, 0)
      chair.add(arm)
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.36, 8), mats.wood)
        leg.position.set(sx * 0.26, 0.18, sz * 0.24)
        chair.add(leg)
      }
    }
    chair.position.set(4.9, 0, 1.0)
    chair.rotation.y = -2.2
    root.add(chair)
    solids.push(circle(4.9, 1.0, 0.45))
    // a candlestand beside it
    const stand = new THREE.Group()
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.04, 16), mats.wood)
    foot.position.y = 0.02
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.66, 10), mats.wood)
    post.position.y = 0.35
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 20), mats.wood)
    tray.position.y = 0.69
    stand.add(foot, post, tray)
    stand.position.set(5.4, 0, 2.4)
    root.add(stand)
    solids.push(circle(5.4, 2.4, 0.22))
    candle(5.4, 0.705, 2.4, { glow: light ? 0 : 1.2, reach: 5 })
    // candles on the mantel
    candle(5.75, 1.11, -1.1, { h: 0.18 })
    candle(5.75, 1.11, 0.3, { h: 0.18 })
    // his tricorn hat at the bench's end, as in the picture
    const felt = new THREE.MeshStandardMaterial({ color: '#1c1b20', roughness: 0.95 })
    const hat = new THREE.Group()
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.07, 3, 1, true), new THREE.MeshStandardMaterial({ color: '#1c1b20', roughness: 0.95, side: THREE.DoubleSide }))
    brim.position.y = 0.04
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10, 0, TAU, 0, Math.PI / 2), felt)
    crown.scale.set(1, 0.7, 1)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 3), felt)
    band.position.y = 0.005
    hat.add(brim, crown, band)
    hat.position.set(5.0, TOP, -5.48)
    hat.rotation.y = 0.5
    root.add(hat)
  }

  // ======== Station 1: inflammable air from metals ========
  // the saucers and what is in them
  const metalLook = [
    new THREE.MeshStandardMaterial({ color: '#9aa1a8', roughness: 0.45, metalness: 0.75, envMap: env }),
    new THREE.MeshStandardMaterial({ color: '#5a5c62', roughness: 0.5, metalness: 0.7, envMap: env }),
    new THREE.MeshStandardMaterial({ color: '#d2d6da', roughness: 0.22, metalness: 0.9, envMap: env, envMapIntensity: 1.3 }),
  ]
  const pieceGeo = [new THREE.DodecahedronGeometry(0.011, 0), new THREE.TorusGeometry(0.012, 0.0025, 4, 10), new THREE.IcosahedronGeometry(0.014, 0)]
  const piece = i => {
    const m = new THREE.Mesh(pieceGeo[i], metalLook[i])
    if (i === 2) m.scale.set(1, 0.35, 1)
    return m
  }
  const saucers = DISH.map((d, i) => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(lathe([[0, 0], [0.07, 0], [0.1, 0.012], [0.115, 0.022], [0.11, 0.024], [0.09, 0.014], [0, 0.01]], 24), porcelain))
    const rnd = random(11 + i)
    if (i === 1) {
      // a coil of iron wire
      for (let k = 0; k < 4; k++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045 - k * 0.004, 0.0025, 5, 28), metalLook[1])
        ring.rotation.set(Math.PI / 2 + (rnd() - 0.5) * 0.3, 0, rnd())
        ring.position.y = 0.016 + k * 0.004
        g.add(ring)
      }
    } else {
      for (let k = 0; k < 11; k++) {
        const p = piece(i)
        const a = rnd() * TAU
        const r = Math.sqrt(rnd()) * 0.045
        p.position.set(Math.cos(a) * r, 0.016 + rnd() * 0.012, Math.sin(a) * r)
        p.rotation.set(rnd() * TAU, rnd() * TAU, rnd() * TAU)
        g.add(p)
      }
    }
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 12), ghost)
    hit.position.y = 0.05
    g.add(hit)
    g.position.set(d.x, TOP, d.z)
    root.add(g)
    const t = label(E.metals.names[i], 0.04)
    t.position.set(d.x, TOP - 0.07, BENCH_A.z + BENCH_A.d / 2 + 0.005)
    root.add(t)
    return g
  })
  // the acids, in stoppered bottles
  const acids = ACID.map((a, i) => {
    const g = new THREE.Group()
    const body = new THREE.Mesh(lathe([[0, 0], [0.045, 0], [0.048, 0.01], [0.048, 0.15], [0.03, 0.185], [0.016, 0.2], [0.016, 0.225], [0.02, 0.23]]), glassMat)
    body.renderOrder = 2
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.12, 16), new THREE.MeshStandardMaterial({ color: i ? '#e8d890' : '#dce8e4', roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }))
    liquid.position.y = 0.065
    const stopper = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 8), glassMat)
    stopper.position.y = 0.245
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.05), new THREE.MeshStandardMaterial({ color: '#e2d6b6', roughness: 0.9 }))
    paper.position.set(0, 0.09, 0.0485)
    g.add(body, liquid, stopper, paper)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 10), ghost)
    hit.position.y = 0.14
    g.add(hit)
    g.position.set(a.x, TOP, a.z)
    root.add(g)
    const t = label(E.metals.acids[i], 0.035)
    t.position.set(a.x, TOP + 0.32, a.z)
    root.add(t)
    return { group: g, rest: new THREE.Vector3(a.x, TOP, a.z), liquid }
  })
  // the bottle where the metal dissolves, its cork and the bent tube to the trough
  const flask = new THREE.Group()
  const FLASK_H = 0.29
  const flaskLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 1, 18).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#cfe0d8', roughness: 0.1, transparent: true, opacity: 0.5, depthWrite: false, emissive: '#1c2c24', emissiveIntensity: 0.4 }))
  {
    const body = new THREE.Mesh(lathe([[0, 0], [0.065, 0], [0.07, 0.01], [0.07, 0.17], [0.05, 0.21], [0.025, 0.24], [0.025, 0.28], [0.028, FLASK_H]]), glassMat)
    body.renderOrder = 3
    flaskLiquid.position.y = 0.006
    flaskLiquid.scale.y = 0.09
    flaskLiquid.renderOrder = 2
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.023, 0.04, 12), new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.9 }))
    cork.position.y = FLASK_H + 0.005
    flask.add(body, flaskLiquid, cork)
    flask.position.set(FLASK.x, TOP, FLASK.z)
    root.add(flask)
  }
  const tubePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(FLASK.x, TOP + 0.3, FLASK.z),
    new THREE.Vector3(FLASK.x, TOP + 0.47, FLASK.z),
    new THREE.Vector3(FLASK.x + 0.14, TOP + 0.56, FLASK.z),
    new THREE.Vector3(-3.45, TOP + 0.56, FLASK.z),
    new THREE.Vector3(-3.33, TOP + 0.46, -5.73),
    new THREE.Vector3(-3.3, TOP + 0.12, -5.73),
    new THREE.Vector3(-3.22, TOP + 0.028, -5.73),
    new THREE.Vector3(JAR_AT.x - 0.02, TOP + 0.03, JAR_AT.z),
  ])
  {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(tubePath, 80, 0.006, 6, false), glassMat)
    tube.renderOrder = 3
    root.add(tube)
  }
  // the trough of water, and the shelf the jar stands on
  {
    const g = new THREE.Group()
    const wall = 0.02
    const { w, d, h } = TROUGH
    for (const [bw, bh, bd, x, y, z] of [[w, wall, d, 0, wall / 2, 0], [wall, h, d, -(w - wall) / 2, h / 2, 0], [wall, h, d, (w - wall) / 2, h / 2, 0], [w - 2 * wall, h, wall, 0, h / 2, -(d - wall) / 2], [w - 2 * wall, h, wall, 0, h / 2, (d - wall) / 2]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mats.wood)
      m.position.set(x, y, z)
      g.add(m)
    }
    const water = new THREE.Mesh(new THREE.BoxGeometry(w - 2 * wall - 0.004, TROUGH.water - wall, d - 2 * wall - 0.004), waterMat)
    water.position.y = wall + (TROUGH.water - wall) / 2
    water.renderOrder = 1
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.2), mats.oak)
    shelf.position.set(JAR_AT.x - TROUGH.x, 0.04, JAR_AT.z - TROUGH.z)
    g.add(water, shelf)
    g.position.set(TROUGH.x, TOP, TROUGH.z)
    root.add(g)
  }
  // a gas jar: open at y = 0 (its mouth), closed at the top; its water inside; a glass stopper for the mouth
  const jarGeo = lathe([[JAR.r - 0.004, 0], [JAR.r, 0.004], [JAR.r, JAR.h - 0.02], [JAR.r - 0.012, JAR.h - 0.003], [0, JAR.h + 0.003]], 22)
  const plugGeo = new THREE.CylinderGeometry(JAR.r + 0.006, JAR.r + 0.006, 0.012, 20)
  function gasJar({ water = 0, plug = false } = {}) {
    const g = new THREE.Group()
    const glass = new THREE.Mesh(jarGeo, glassMat)
    glass.renderOrder = 3
    const w = new THREE.Mesh(new THREE.CylinderGeometry(JAR.r - 0.005, JAR.r - 0.005, 1, 18).translate(0, 0.5, 0), waterMat)
    w.scale.y = Math.max(0.001, water)
    w.visible = water > 0.002
    w.renderOrder = 2
    const p = new THREE.Mesh(plugGeo, glassMat)
    p.position.y = -0.006
    p.visible = plug
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(JAR.r + 0.03, JAR.r + 0.03, JAR.h + 0.04, 10).translate(0, JAR.h / 2, 0), ghost)
    g.add(glass, w, p, hit)
    return { group: g, water: w, plug: p }
  }
  const jar = gasJar({ water: JAR.h - 0.01 })
  root.add(jar.group)
  // the balance: a brass beam on a pillar, two pans on chains; a jar of common air on each pan
  const beam = new THREE.Group()
  const pans = []
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.2), mats.wood)
    base.position.set(BAL.x, TOP + 0.018, BAL.z - 0.08)
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, BAL.beam - TOP - 0.02, 10), brass)
    pillar.position.set(BAL.x, (BAL.beam + TOP) / 2 - 0.01, BAL.z - 0.08)
    root.add(base, pillar)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(BAL.arm * 2 + 0.04, 0.016, 0.014), brass)
    const knife = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 3), brass)
    knife.rotation.x = Math.PI
    knife.position.y = 0.02
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.22, 0.004), brass)
    needle.position.y = 0.11
    for (const sx of [-1, 1]) {
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), brass)
      end.position.x = sx * BAL.arm
      beam.add(end)
    }
    beam.add(bar, knife, needle)
    beam.position.set(BAL.x, BAL.beam, BAL.z)
    root.add(beam)
    // the arc the needle points along
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.004, 4, 24, 0.6), brass)
    arc.rotation.z = Math.PI / 2 - 0.3
    arc.position.set(BAL.x, BAL.beam, BAL.z - 0.01)
    root.add(arc)
    const panGeo = lathe([[0, 0], [0.11, 0], [0.12, 0.02], [0.118, 0.022], [0.105, 0.004], [0, 0.004]], 24)
    const chainMat = new THREE.MeshStandardMaterial({ color: '#8a7040', roughness: 0.4, metalness: 0.8 })
    for (const sx of [-1, 1]) {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(panGeo, brass))
      const chains = []
      for (let k = 0; k < 3; k++) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 1, 4), chainMat)
        const a = (k / 3) * TAU + 0.5
        chains.push({ mesh: c, at: new THREE.Vector3(Math.cos(a) * 0.115, 0.02, Math.sin(a) * 0.115) })
        root.add(c)
      }
      root.add(g)
      pans.push({ group: g, chains, sx })
    }
  }
  const airL = gasJar({ plug: true })
  const airR = gasJar({ plug: true })
  for (const j of [airL, airR]) {
    j.group.rotation.x = Math.PI
    root.add(j.group)
  }
  const airTagL = label(E.metals.air.common, 0.032)
  const airTagR = label(E.metals.air.common, 0.032)
  const infTag = label(E.metals.air.inflammable, 0.032, '#ffe6a0')
  root.add(airTagL, airTagR, infTag)
  // the slate above: each metal and acid weighed
  const slate1 = slate(1.5, 0.78, 1024, 532)
  slate1.group.position.set(BENCH_A.x, 1.86, ROOM.z0 + 0.04)
  // a candle at the bench's end, as in the picture
  candle(-5.12, TOP, -6.05, { glow: light ? 1.6 : 2.0, reach: 5.5 })

  // the moving bits: a pinch of metal flying to the bottle, an acid bottle pouring, bubbles
  const pinch = new THREE.Group()
  const pinchPieces = [0, 1, 2].map(i => [0, 1, 2, 3].map(k => {
    const p = piece(i)
    p.position.set((k % 2 - 0.5) * 0.03, 0, (Math.floor(k / 2) - 0.5) * 0.03)
    p.rotation.set(k, k * 2, k * 3)
    pinch.add(p)
    return p
  }))
  pinch.visible = false
  root.add(pinch)
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 1, 8), new THREE.MeshStandardMaterial({ color: '#e0ece8', roughness: 0.1, transparent: true, opacity: 0.6 }))
  stream.visible = false
  root.add(stream)
  const BUB = { flask: light ? 12 : 22, tube: light ? 8 : 14, jar: light ? 8 : 14 }
  const bubN = BUB.flask + BUB.tube + BUB.jar
  const bubPos = new Float32Array(bubN * 3)
  const bubSeed = Array.from({ length: bubN }, () => [Math.random(), Math.random(), Math.random()])
  const bubGeo = new THREE.BufferGeometry()
  bubGeo.setAttribute('position', new THREE.BufferAttribute(bubPos, 3))
  const bubbles = new THREE.Points(bubGeo, new THREE.PointsMaterial({ map: soft, color: '#eef8ff', size: 0.014, transparent: true, opacity: 0.9, depthWrite: false }))
  bubbles.frustumCulled = false
  bubbles.raycast = () => {}
  root.add(bubbles)
  let bubClock = 0

  // ---- the state: metal in the bottle (-1 none), acid in it (-1 none), the run's age (s; -1 none, negative
  // while the pour finishes), the jar on the balance (1) or in the trough (0), what has been weighed ----
  const M = { metal: -1, acid: -1, age: -1, jar: 0, done: [0, 0, 0, 0, 0, 0], n: 0 }
  const running = () => M.metal >= 0 && M.acid >= 0 && M.age > -9
  const fillOf = () => (M.metal >= 0 && M.acid >= 0 && M.age > -9 ? clamp(M.age / DUR[M.metal]) : 0)
  const metalsTried = () => [0, 1, 2].filter(i => M.done[i * 2] || M.done[i * 2 + 1]).length
  let fly = null // { i, t }: a pinch of metal flying
  let pour = null // { j, t }: an acid pouring
  let carry = null // { t, back }: the jar carried to the balance or back
  let mineMetals = false
  let toldFull = false
  let tilt = 0
  const NO_RUN = -10

  const drawSlate1 = () => {
    const lv = level()
    slate1.tex.userData.redraw((g, w, h) => {
      slateBg(g, w, h)
      g.fillStyle = chalk
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = chalkFont(46)
      g.fillText(E.metals.slate.title, w / 2, 56)
      const cx = [w * 0.47, w * 0.78]
      g.font = chalkFont(34, 500)
      E.metals.acids.forEach((a, j) => g.fillText(a, cx[j], 132))
      const ry = [222, 312, 402]
      g.textAlign = 'right'
      g.font = chalkFont(38, 600)
      E.metals.names.forEach((n, i) => g.fillText(n, w * 0.3, ry[i]))
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          const on = M.done[i * 2 + j]
          g.beginPath()
          g.arc(cx[j], ry[i], 26, 0, TAU)
          g.lineWidth = 4
          g.strokeStyle = on ? '#ffd166' : 'rgba(236,234,216,0.6)'
          g.stroke()
          if (on) {
            g.fillStyle = '#ffd166'
            g.beginPath()
            g.arc(cx[j], ry[i], 17, 0, TAU)
            g.fill()
          }
        }
      }
      if (metalsTried() === 3) {
        g.fillStyle = '#ffd166'
        g.textAlign = 'center'
        g.font = chalkFont(34, 600)
        g.fillText(at(E.metals.slate.done, lv), w / 2, h - 50)
      }
    })
  }
  drawSlate1()

  const metalsPanel = lv => ({
    title: E.metals.title,
    color,
    blocks: [
      { buttons: E.metals.names.map((n, i) => ({ label: n, onClick: () => metalsStep(['zn', 'fe', 'sn'][i]) })) },
      { buttons: [...E.metals.acids.map((n, j) => ({ label: n, onClick: () => metalsStep(['v', 's'][j]) })), { label: M.jar ? E.metals.buttons.back : E.metals.buttons.weigh, onClick: () => metalsStep('jar') }] },
      ...E.metals.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // a fresh bottle and the jar back in the trough, full of water
  function freshBottle() {
    M.metal = -1
    M.acid = -1
    M.age = NO_RUN
  }
  function jarBack(animate) {
    if (!M.jar) return
    M.jar = 0
    if (animate) carry = { t: 0, back: true }
    else carry = null
  }
  // a visitor's step: 'zn', 'fe', 'sn' (a saucer), 'v', 's' (an acid), 'jar'
  function metalsStep(what) {
    const lv = level()
    const S = E.metals.says
    const mi = ['zn', 'fe', 'sn'].indexOf(what)
    const ai = ['v', 's'].indexOf(what)
    // only what is still moving keeps a step waiting: the pinch for a metal, the pour for an acid, the jar
    if ((mi >= 0 && fly) || (ai >= 0 && pour) || (what === 'jar' && carry) || ((mi >= 0 || ai >= 0) && carry && !carry.back)) return say(at(W.busy, lv))
    if (mi >= 0) {
      if (M.jar || M.metal >= 0) {
        jarBack(true)
        freshBottle()
      }
      M.metal = mi
      fly = { i: mi, t: 0 }
      play('tap')
      if (M.acid >= 0) {
        M.age = -0.9
        say(at(S.fizz[mi], lv))
      } else say(at(S.metal[mi], lv))
    } else if (ai >= 0) {
      if (M.jar || M.acid >= 0) {
        if (M.acid >= 0 && !M.jar && M.metal < 0) return say(at(S.already, lv))
        jarBack(true)
        freshBottle()
      }
      M.acid = ai
      pour = { j: ai, t: 0 }
      play('select')
      if (M.metal >= 0) {
        M.age = -1.3
        say(at(S.fizz[M.metal], lv))
      } else say(at(S.acid[ai], lv))
    } else if (what === 'jar') {
      if (M.jar) {
        jarBack(true)
        freshBottle()
        play('tap')
        say(at(S.back, lv))
      } else if (fillOf() < 1) {
        return say(at(running() ? S.filling : S.empty, lv))
      } else {
        M.jar = 1
        M.done[M.metal * 2 + M.acid] = 1
        carry = { t: 0, back: false }
        play('select')
        say(at(metalsTried() === 3 ? S.same : S.weighed, lv))
        drawSlate1()
      }
    } else return
    M.n++
    mineMetals = true
    toldFull = !(running() && fillOf() < 1)
    ex.discover('metals', metalsPanel, 2.4)
    share('metals')
  }
  saucers.forEach((s, i) => clickable(s, () => metalsStep(['zn', 'fe', 'sn'][i])))
  acids.forEach((a, j) => clickable(a.group, () => metalsStep(['v', 's'][j])))
  clickable(jar.group, () => metalsStep('jar'))
  clickable(flask, () => (M.metal < 0 ? say(at(E.metals.says.needMetal, level())) : M.acid < 0 ? say(at(E.metals.says.needAcid, level())) : null))
  ex.add({
    id: 'metals',
    x: -3.2,
    z: -4.35,
    radius: 1.8,
    manual: true,
    label: E.metals.label,
    verb: () => {
      const H = E.metals.hints
      if (M.jar) return metalsTried() === 3 ? H.again : H.next
      if (M.metal < 0 && M.acid < 0) return H.start
      if (M.acid < 0) return H.acid
      if (M.metal < 0) return H.metal
      return fillOf() < 1 ? H.wait : H.weigh
    },
    focus: { x: -3.28, y: 1.38, z: -5.9, size: 2.65, width: 4.0 },
    act: () => ctx.showPanel(metalsPanel),
  })
  // where the jar stands: in the trough (mouth down), or on the left pan (stoppered, mouth up)
  const panTop = sx => {
    const ang = tilt
    return new THREE.Vector3(BAL.x + sx * BAL.arm * Math.cos(ang), BAL.beam + sx * BAL.arm * Math.sin(ang) - BAL.hang + 0.004, BAL.z)
  }
  const AIR_ASIDE = new THREE.Vector3(BAL.x - 0.12, TOP, BAL.z + 0.27)
  let slate1Level = level()
  function poseMetals(dt, t) {
    if (level() !== slate1Level) {
      slate1Level = level()
      drawSlate1()
    }
    if (M.age > -9) M.age += dt
    const f = fillOf()
    // the pinch of metal: up from the saucer, over and into the bottle
    if (fly) {
      fly.t += dt
      const k = span(0, 0.7, fly.t)
      const from = new THREE.Vector3(DISH[fly.i].x, TOP + 0.03, DISH[fly.i].z)
      const to = new THREE.Vector3(FLASK.x, TOP + 0.02, FLASK.z)
      pinch.position.lerpVectors(from, to, k)
      pinch.position.y += Math.sin(Math.PI * k) * 0.45
      if (fly.t > 0.75) fly = null
    }
    pinch.visible = M.metal >= 0
    pinchPieces.forEach((ps, i) => ps.forEach(p => {
      p.visible = i === M.metal
      // the metal is used up as the gas comes off, most of it
      p.scale.setScalar((1 - 0.65 * f) * (i === 2 ? 1 : 1))
      if (i === 2) p.scale.y *= 0.35
    }))
    if (!fly && M.metal >= 0) pinch.position.set(FLASK.x, TOP + 0.02, FLASK.z)
    // the acid: lifted over the bottle, tipped, poured, put back
    acids.forEach((a, j) => {
      const g = a.group
      if (pour && pour.j === j) {
        const k = span(0, 0.4, pour.t) * (1 - span(1.0, 1.35, pour.t))
        const over = new THREE.Vector3(FLASK.x + 0.13, TOP + FLASK_H + 0.06, FLASK.z)
        g.position.lerpVectors(a.rest, over, k)
        g.position.y += Math.sin(Math.PI * k) * 0.1
        g.rotation.set(0, 0, 1.9 * span(0.4, 0.6, pour.t) * (1 - span(0.85, 1.0, pour.t)))
        const pouring = pour.t > 0.55 && pour.t < 0.9
        stream.visible = pouring
        if (pouring) {
          g.updateMatrixWorld()
          const s = g.localToWorld(new THREE.Vector3(0, 0.23, 0))
          stretch(stream, s, new THREE.Vector3(s.x, TOP + 0.1, s.z))
        }
      } else {
        g.position.copy(a.rest)
        g.rotation.set(0, 0, 0)
      }
    })
    if (pour && (pour.t += dt) > 1.4) {
      pour = null
      stream.visible = false
    }
    // the bottle's liquid: water, then water and acid
    flaskLiquid.scale.y = damp(flaskLiquid.scale.y, M.acid >= 0 ? 0.13 : 0.09, 3, dt)
    // the jar: in the trough its water goes down as the gas comes in; carried to the pan and back
    let jarPos = JAR_AT.clone()
    let jarFlip = 0
    let airPos = null
    if (carry) carry.t += dt
    const onPan = panTop(-1)
    if (M.jar || carry) {
      const k = carry ? (carry.back ? 1 - span(0, 1.4, carry.t) : span(0, 1.4, carry.t)) : 1
      // the left air jar goes aside first, and comes back last
      const ka = carry ? (carry.back ? 1 - span(1.0, 1.5, carry.t) : span(0, 0.4, carry.t)) : 1
      airPos = new THREE.Vector3().lerpVectors(onPan, AIR_ASIDE, ka)
      airPos.y += Math.sin(Math.PI * ka) * 0.1
      const kj = carry && !carry.back ? span(0.3, 1.5, carry.t) : carry ? k : 1
      const rise = Math.sin(Math.PI * kj) * 0.35
      jarPos = new THREE.Vector3().lerpVectors(JAR_AT, onPan.clone().add(new THREE.Vector3(0, JAR.h + 0.004, 0)), kj)
      jarPos.y += rise
      jarFlip = span(0.2, 0.8, kj)
      if (carry && carry.t > 1.6) carry = null
    }
    jar.group.position.copy(jarPos)
    jar.group.rotation.set(Math.PI * jarFlip, 0, 0)
    jar.plug.visible = !!(M.jar === 1 || (carry && !carry.back) || jarFlip > 0.02)
    const inTrough = !M.jar && !carry
    const waterH = inTrough ? (JAR.h - 0.01) * (1 - f) : 0
    jar.water.visible = waterH > 0.002
    jar.water.scale.y = Math.max(0.001, waterH)
    // the balance: the lighter jar rises
    const target = M.jar && !carry ? -BAL.max : 0
    tilt = damp(tilt, target, 2.2, dt)
    beam.rotation.z = tilt
    pans.forEach(p => {
      const c = panTop(p.sx)
      p.group.position.copy(c).y -= 0.004
      const hook = new THREE.Vector3(BAL.x + p.sx * BAL.arm * Math.cos(tilt), BAL.beam + p.sx * BAL.arm * Math.sin(tilt), BAL.z)
      p.chains.forEach(ch => stretch(ch.mesh, hook, c.clone().add(ch.at)))
    })
    airR.group.position.copy(panTop(1)).add(new THREE.Vector3(0, JAR.h + 0.004, 0))
    airL.group.position.copy(airPos ?? onPan).add(airPos ? new THREE.Vector3(0, JAR.h, 0) : new THREE.Vector3(0, JAR.h + 0.004, 0))
    airTagR.position.set(BAL.x + BAL.arm, TOP + 0.06, BAL.z + 0.17)
    if (M.jar && !carry) airTagL.position.set(AIR_ASIDE.x, TOP + 0.06, AIR_ASIDE.z + 0.1)
    else airTagL.position.set(BAL.x - BAL.arm, TOP + 0.06, BAL.z + 0.17)
    airTagL.visible = !carry
    infTag.position.set(BAL.x - BAL.arm, TOP + 0.06, BAL.z + 0.17)
    infTag.visible = !!(M.jar && !carry)
    // bubbles: in the bottle, along the tube, up into the jar, while the gas comes
    const fizzing = running() && M.age > 0 && f < 1
    bubClock += dt * (fizzing ? [1.6, 1.1, 0.7][M.metal] : 0)
    for (let i = 0; i < bubN; i++) {
      const [a, b, c] = bubSeed[i]
      const j = i * 3
      if (!fizzing) {
        bubPos[j + 1] = -9
        continue
      }
      const u = (bubClock * (0.7 + b * 0.6) + c) % 1
      if (i < BUB.flask) {
        const r = Math.sqrt(a) * 0.05
        bubPos.set([FLASK.x + Math.cos(c * TAU) * r, TOP + 0.02 + u * 0.1, FLASK.z + Math.sin(c * TAU) * r], j)
      } else if (i < BUB.flask + BUB.tube) {
        tubePath.getPointAt(u, tmpV)
        bubPos.set([tmpV.x, tmpV.y, tmpV.z], j)
      } else {
        const top = waterH
        bubPos.set([JAR_AT.x + (a - 0.5) * 0.06, JAR_AT.y + u * top, JAR_AT.z + (c - 0.5) * 0.06], j)
      }
    }
    bubGeo.attributes.position.needsUpdate = true
    if (fizzing && Math.random() < dt * 1.2) play('fizz', { order: 0.25 })
    // the jar just filled: told to whoever made it happen
    if (running() && f >= 1 && !toldFull) {
      toldFull = true
      if (mineMetals) say(at(E.metals.says.full, level()))
    }
  }
  updates.push(poseMetals)
  const metalsState = () => ({ metal: M.metal, acid: M.acid, age: round1(Math.max(M.age, NO_RUN)), jar: M.jar, done: [...M.done], n: M.n })
  const metalsSet = (s, liveSet, ago = 0) => {
    const metal = [0, 1, 2].includes(s?.metal) ? s.metal : -1
    const acid = [0, 1].includes(s?.acid) ? s.acid : -1
    const jarOn = s?.jar ? 1 : 0
    const n = Math.max(0, Math.round(Number(s?.n) || 0))
    const age = Number(s?.age)
    const wasJar = M.jar
    if (liveSet && n !== M.n) {
      if (metal >= 0 && metal !== M.metal) fly = { i: metal, t: 0 }
      if (acid >= 0 && acid !== M.acid) pour = { j: acid, t: 0 }
      if (jarOn !== wasJar) carry = { t: 0, back: !jarOn }
    } else if (!liveSet) {
      fly = pour = carry = null
    }
    M.metal = metal
    M.acid = acid
    M.age = metal >= 0 && acid >= 0 && Number.isFinite(age) && age > -9 ? age + Math.min(Number(ago) || 0, 3600) : NO_RUN
    M.jar = jarOn
    M.done = [0, 1, 2, 3, 4, 5].map(i => (Array.isArray(s?.done) && s.done[i] ? 1 : 0))
    M.n = n
    mineMetals = false
    toldFull = true
    if (!liveSet) tilt = M.jar ? -BAL.max : 0
    drawSlate1()
  }

  // ======== Station 2: Cavendish's bottles (1766) ========
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(TABLE2.w, 0.05, TABLE2.d, 2, 0.012), mats.wood)
    top.position.set(TABLE2.x, TABLE2.top - 0.025, TABLE2.z)
    root.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, TABLE2.top - 0.05, 8), mats.wood)
        leg.position.set(TABLE2.x + sx * (TABLE2.w / 2 - 0.06), (TABLE2.top - 0.05) / 2, TABLE2.z + sz * (TABLE2.d / 2 - 0.06))
        root.add(leg)
      }
    }
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, TABLE2.d - 0.1), mats.wood)
    apron.position.set(TABLE2.x + TABLE2.w / 2 - 0.04, TABLE2.top - 0.1, TABLE2.z)
    root.add(apron)
    solids.push(box(TABLE2.x, TABLE2.z, TABLE2.w, TABLE2.d))
  }
  const BX = -5.88
  const bz = i => TABLE2.z - (i - 4) * 0.25 // 1 in 10 at +z: on the left as the visitor faces the wall, as the slate reads
  const NECK = 0.265 // the bottle's lip, above the table
  const bottleGeo = lathe([[0, 0], [0.042, 0], [0.045, 0.008], [0.045, 0.17], [0.03, 0.21], [0.016, 0.235], [0.016, 0.255], [0.019, NECK]], 22)
  const bottles = MIX.map((m, i) => {
    const g = new THREE.Group()
    const mat = glassMat.clone()
    const body = new THREE.Mesh(bottleGeo, mat)
    body.renderOrder = 3
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.014, 14), mats.wood)
    cap.position.y = NECK + 0.007
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 10), ghost)
    hit.position.y = 0.16
    g.add(body, cap, hit)
    g.position.set(BX, TABLE2.top, bz(i))
    root.add(g)
    const t = label(m === 10 ? '10:0' : `${m}:${10 - m}`, 0.045)
    t.position.set(TABLE2.x + TABLE2.w / 2 - 0.02, TABLE2.top - 0.1, bz(i))
    t.rotation.y = Math.PI / 2
    root.add(t)
    return { group: g, mat, cap, dew: 0, jump: 0 }
  })
  // the taper: a long wax taper in a holder at the table's end, lit
  const TAPER_REST = new THREE.Vector3(BX, TABLE2.top + 0.27, TABLE2.z + 1.25) // beside the 1 in 10 bottle
  const taper = new THREE.Group()
  const taperFlame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  taperFlame.center.set(0.5, 0.1)
  {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.24, 6).translate(0, -0.12, 0), new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.6, emissive: '#5a3a18', emissiveIntensity: 0.25 }))
    taper.add(stick, taperFlame)
    root.add(taper)
    const holder = new THREE.Mesh(lathe([[0, 0], [0.05, 0], [0.05, 0.01], [0.012, 0.02], [0.01, 0.05], [0.016, 0.06], [0, 0.06]], 14), brass)
    holder.position.set(BX, TABLE2.top, TAPER_REST.z)
    root.add(holder)
  }
  const taperLight = new THREE.PointLight('#ffb36a', light ? 0.8 : 1.1, 3.5, 1.6)
  root.add(taperLight)
  candle(BX, TABLE2.top, TABLE2.z - 1.18, { glow: light ? 1.2 : 1.6, reach: 5 })
  // what burns: one flame for the neck or the mouth, one glow inside the belly, the sound's rings
  const burnFlame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#b8c8ff').multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  burnFlame.center.set(0.5, 0.1)
  const bellyGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#9fb6ff').multiplyScalar(1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  const soundRings = [0, 1, 2].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: rings, color: '#fff2d8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    root.add(s)
    return s
  })
  root.add(burnFlame, bellyGlow)
  for (const s of [burnFlame, bellyGlow, taperFlame, ...soundRings]) s.raycast = () => {}
  // the slate above: how loud each bottle was
  const slate2 = slate(2.3, 0.98, 1024, 436)
  slate2.group.position.set(ROOM.x0 + 0.04, 1.84, TABLE2.z)
  slate2.group.rotation.y = Math.PI / 2

  const B = { n: MIX.map(() => 0), pick: 3 }
  let firing = null // { i, t, mine }
  const seen = () => B.n.map(v => v > 0)
  const drawSlate2 = () => {
    const sci = level() === 'scientist'
    slate2.tex.userData.redraw((g, w, h) => {
      slateBg(g, w, h)
      g.fillStyle = chalk
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = chalkFont(40)
      g.fillText(E.bottles.slate.title, w / 2, 40)
      const x0 = 110
      const x1 = w - 60
      const base = h - 82
      const top = 122
      const xOf = pct => x0 + ((pct - 5) / 100) * (x1 - x0) * 1.0
      // Scientist: where hydrogen burns in air, and the mix that uses all the oxygen
      if (sci) {
        g.fillStyle = 'rgba(255,209,102,0.12)'
        g.fillRect(xOf(4), top - 10, xOf(75) - xOf(4), base - top + 10)
        g.fillStyle = 'rgba(255,209,102,0.85)'
        g.font = chalkFont(22, 500)
        g.fillText(E.bottles.slate.burns, (xOf(4) + xOf(75)) / 2, top - 24)
        g.strokeStyle = 'rgba(255,209,102,0.9)'
        g.setLineDash([8, 8])
        g.lineWidth = 3
        g.beginPath()
        g.moveTo(xOf(29.5), top)
        g.lineTo(xOf(29.5), base)
        g.stroke()
        g.setLineDash([])
        g.textAlign = 'left'
        g.fillText(E.bottles.slate.just, xOf(29.5) + 10, top + 20)
        g.textAlign = 'center'
      }
      g.strokeStyle = 'rgba(236,234,216,0.7)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x0 - 30, base)
      g.lineTo(x1, base)
      g.stroke()
      const s = seen()
      MIX.forEach((m, i) => {
        const x = xOf(m * 10)
        g.fillStyle = 'rgba(236,234,216,0.85)'
        g.font = chalkFont(26, 500)
        g.fillText(m === 10 ? '10:0' : `${m}:${10 - m}`, x, base + 24)
        if (!s[i]) {
          g.fillStyle = 'rgba(236,234,216,0.3)'
          g.fillText('?', x, base - 30)
          return
        }
        const bh = LOUD[i] * (base - top - (sci ? 48 : 20))
        if (bh > 4) {
          g.fillStyle = i === 3 ? '#ffd166' : 'rgba(236,234,216,0.9)'
          g.fillRect(x - 22, base - bh, 44, bh)
        }
        if (LOUD[i] < 0.3) {
          // a little flame: it burned quietly
          g.fillStyle = '#9fb6ff'
          g.beginPath()
          const fy = base - Math.max(bh, 0) - 34
          g.moveTo(x, fy - 20)
          g.quadraticCurveTo(x + 14, fy + 4, x, fy + 14)
          g.quadraticCurveTo(x - 14, fy + 4, x, fy - 20)
          g.fill()
        }
      })
      g.fillStyle = 'rgba(236,234,216,0.75)'
      g.font = chalkFont(22, 500)
      g.textAlign = 'left'
      g.fillText(E.bottles.slate.axis, 20, h - 22)
    })
  }
  drawSlate2()
  let slateLevel = level()

  const fmtMix = v => {
    const m = MIX[clamp(Math.round(v) - 1, 0, MIX.length - 1)]
    return m === 10 ? E.bottles.pure : fill(E.bottles.mix, { n: m })
  }
  const bottlesPanel = lv => ({
    title: E.bottles.title,
    color,
    blocks: [
      { slider: { label: E.bottles.slider, min: 1, max: MIX.length, step: 1, value: B.pick + 1, onInput: v => (B.pick = clamp(Math.round(Number(v) || 1) - 1, 0, MIX.length - 1)), format: fmtMix } },
      { buttons: [{ label: E.bottles.buttons.light, onClick: () => bottleStep(B.pick) }] },
      ...E.bottles.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // a visitor's step: a tap on a bottle (or the panel's button)
  function bottleStep(i) {
    if (!(i >= 0 && i < MIX.length)) return
    if (firing) return say(at(W.busy, level()))
    B.n[i]++
    B.pick = i
    startFire(i, true)
    ex.discover('bottles', bottlesPanel, 4.2)
    share('bottles')
  }
  function startFire(i, mine) {
    firing = { i, t: 0, mine, rung: false, said: false }
    play('tap')
  }
  bottles.forEach((b, i) => clickable(b.group, () => bottleStep(i)))
  ex.add({
    id: 'bottles',
    x: -4.4,
    z: TABLE2.z,
    radius: 1.6,
    manual: true,
    label: E.bottles.label,
    verb: () => {
      const n = seen().filter(Boolean).length
      if (!n) return E.bottles.hints.first
      return n < MIX.length ? E.bottles.hints.more : E.bottles.hints.all
    },
    focus: { x: -5.95, y: 1.4, z: TABLE2.z, size: 1.75, width: 2.7 },
    act: () => ctx.showPanel(bottlesPanel),
  })
  // one firing: the taper goes to the mouth (0.5 s), the cap comes off, at 0.6 s what Cavendish saw
  const LEN = [3.2, 2.2, 2.0, 2.0, 2.2, 2.6, 3.8, 3.6, 4.2]
  function poseBottles(dt, t) {
    if (level() !== slateLevel) {
      slateLevel = level()
      drawSlate2()
    }
    let tip = TAPER_REST.clone()
    let tiltT = 0
    let dipK = 0
    let taperLit = true
    burnFlame.material.opacity = 0
    bellyGlow.material.opacity = 0
    if (firing) {
      const f = firing
      f.t += dt
      const i = f.i
      const b = bottles[i]
      const z = bz(i)
      const mouth = new THREE.Vector3(BX, TABLE2.top + NECK, z)
      const end = LEN[i]
      const go = span(0, 0.5, f.t) * (1 - span(end - 0.5, end, f.t))
      const at0 = mouth.clone().add(new THREE.Vector3(0.05, 0.035, 0))
      // into the belly: the 1 in 10 bottle (no fire at the mouth), and the pure one (the taper goes out)
      let dip = 0
      if (i === 0) dip = span(0.9, 1.3, f.t) * (1 - span(2.4, 2.7, f.t))
      if (i === 8) dip = span(1.4, 1.8, f.t) * (1 - span(2.5, 2.9, f.t))
      const inBelly = mouth.clone().add(new THREE.Vector3(0.0, -0.17, 0))
      tip = new THREE.Vector3().lerpVectors(TAPER_REST, at0, go).lerp(inBelly, dip)
      tip.y += Math.sin(Math.PI * go) * 0.12 * (1 - dip)
      tiltT = go
      dipK = dip
      if (i === 8 && dip > 0.5) taperLit = false
      // the cap comes off, and back once the bottle is filled again
      const capOff = span(0.4, 0.55, f.t) * (1 - span(end - 0.1, end + 0.2, f.t))
      b.cap.position.set(0.06 * capOff, NECK + 0.007 + 0.05 * capOff, 0)
      b.cap.rotation.z = -0.8 * capOff
      const k = f.t - 0.6
      if (k >= 0 && !f.rung) {
        f.rung = true
        const L = LOUD[i]
        if (L >= 0.85) play('bang')
        else if (L >= 0.35) play('pop')
        else if (i === 6) play('pop')
        if (L > 0.1) {
          b.jump = L
          flash = Math.max(flash, i === 4 ? 0.9 : 0.25 * L)
          flashLight.position.copy(mouth).add(new THREE.Vector3(0.3, 0, 0))
        }
        if (i >= 5) play('fizz', { order: 0.6 })
        if (i === 3 && B.n[3] === 1) sparkle(slate2.group.position.clone().add(new THREE.Vector3(0.12, -0.1, -((110 + (35 / 100) * (1024 - 170)) / 1024 - 0.5) * 2.3)), 36)
        if (f.mine) say(at(E.bottles.says.results[i], level()))
        drawSlate2()
      }
      if (k >= 0) {
        // the sound, spreading from the mouth
        soundRings.forEach((s, r) => {
          const kr = clamp((k - r * 0.08) / 0.5)
          s.position.copy(mouth).add(new THREE.Vector3(0.02, 0.02, 0))
          s.scale.setScalar(0.05 + kr * (0.2 + 0.9 * LOUD[i]))
          s.material.opacity = LOUD[i] > 0.1 && kr > 0 && kr < 1 ? (1 - kr) * 0.55 * LOUD[i] : 0
        })
        // the flames, as he saw them
        const neck = mouth.clone().add(new THREE.Vector3(0, -0.04, 0))
        const belly = mouth.clone().add(new THREE.Vector3(0, -0.16, 0))
        if (i === 0 && f.t > 1.3) {
          const kb = span(1.3, 2.0, f.t) * (1 - span(2.4, 3.0, f.t))
          bellyGlow.position.copy(belly)
          bellyGlow.scale.setScalar(0.06 + 0.1 * kb)
          bellyGlow.material.opacity = 0.7 * kb
        }
        if (i === 4) {
          bellyGlow.position.copy(belly)
          bellyGlow.scale.setScalar(0.2)
          bellyGlow.material.opacity = (1 - clamp(k / 0.3)) * 0.9
        }
        if (i === 5 || i === 6) {
          const last = i === 5 ? 1.0 : 2.4
          const kb = 1 - span(last - 0.4, last, k)
          bellyGlow.position.copy(belly).y += Math.sin(t * 9) * 0.01
          bellyGlow.scale.setScalar(0.13 + Math.sin(t * 13) * 0.015)
          bellyGlow.material.opacity = 0.75 * kb
        }
        if (i === 7) {
          const kb = span(0, 0.2, k) * (1 - span(2.2, 2.8, k))
          burnFlame.position.copy(neck)
          burnFlame.scale.set(0.04, 0.08 * kb + Math.sin(t * 17) * 0.005, 1)
          burnFlame.material.opacity = 0.9 * kb
        }
        if (i === 8) {
          const kb = span(0, 0.3, k) * (1 - span(3.0, 3.5, k))
          burnFlame.position.copy(mouth)
          burnFlame.scale.set(0.06, 0.14 * kb + Math.sin(t * 15) * 0.006, 1)
          burnFlame.material.opacity = 0.8 * kb
        }
        // burning made water: the glass mists
        b.dew = Math.max(b.dew, i === 0 ? span(1.6, 2.6, f.t) : span(0, 0.6, k))
      }
      if (f.t > end + 0.25) {
        firing = null
        for (const s of soundRings) s.material.opacity = 0
      }
    }
    // the taper, its flame and its light
    // held from the front and the side, its stick toward the visitor and the 1 in 10 end; nearly upright going in
    taper.position.copy(tip)
    tmpV.set(0.62 * tiltT * (1 - dipK) + 0.1 * dipK, -1 + 0.6 * tiltT * (1 - dipK), 0.55 * tiltT * (1 - dipK) + 0.1 * dipK).normalize()
    taper.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tmpV)
    taperFlame.visible = taperLit
    taperFlame.scale.set(0.024, 0.06 * (1 + Math.sin(t * 19) * 0.08), 1)
    taperLight.position.copy(tip).y += 0.1
    taperLight.intensity = taperLit ? (light ? 0.8 : 1.1) : 0
    // each bottle: its jump, and its dew clearing
    bottles.forEach((b, i) => {
      b.jump = Math.max(0, b.jump - dt * 3)
      b.group.position.y = TABLE2.top + Math.sin(b.jump * 9) * 0.012 * b.jump
      b.group.rotation.z = Math.sin(b.jump * 14) * 0.03 * b.jump
      if (!firing || firing.i !== i) b.dew = Math.max(0, b.dew - dt * 0.12)
      b.mat.opacity = 0.3 + 0.35 * b.dew
      b.mat.color.setRGB(0.84 + 0.16 * b.dew, 0.92 + 0.08 * b.dew, 0.95 + 0.05 * b.dew)
      if (!firing || firing.i !== i) {
        b.cap.position.set(0, NECK + 0.007, 0)
        b.cap.rotation.z = 0
      }
    })
  }
  updates.push(poseBottles)
  const bottlesState = () => ({ n: [...B.n] })
  const bottlesSet = (s, liveSet) => {
    const next = MIX.map((_, i) => Math.max(0, Math.round(Number(s?.n?.[i]) || 0)))
    const up = next.map((v, i) => (v > B.n[i] ? i : -1)).filter(i => i >= 0)
    B.n = next
    if (liveSet && up.length && !firing) startFire(up[up.length - 1], false)
    if (!liveSet) firing = null
    drawSlate2()
  }

  // ======== Station 3: the spark globe (1781) ========
  // the two jars of gas standing in their trough, joined to the globe's cock
  const gasJars = []
  {
    const g = new THREE.Group()
    const wall = 0.02
    const { w, d, h } = GASES
    for (const [bw, bh, bd, x, y, z] of [[w, wall, d, 0, wall / 2, 0], [wall, h, d, -(w - wall) / 2, h / 2, 0], [wall, h, d, (w - wall) / 2, h / 2, 0], [w - 2 * wall, h, wall, 0, h / 2, -(d - wall) / 2], [w - 2 * wall, h, wall, 0, h / 2, (d - wall) / 2]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mats.wood)
      m.position.set(x, y, z)
      g.add(m)
    }
    const water = new THREE.Mesh(new THREE.BoxGeometry(w - 2 * wall - 0.004, h - 0.04, d - 2 * wall - 0.004), waterMat)
    water.position.y = wall + (h - 0.04) / 2
    water.renderOrder = 1
    g.add(water)
    g.position.set(GASES.x, TOP, GASES.z)
    root.add(g)
    const knobMats = [new THREE.MeshStandardMaterial({ color: '#f2f2f0', roughness: 0.4, emissive: '#3a3a3a' }), new THREE.MeshStandardMaterial({ color: '#e0443a', roughness: 0.4, emissive: '#4a0a06' })]
    for (const k of [0, 1]) {
      const j = gasJar({ water: 0.02 })
      j.group.position.set(GASES.x - 0.13 + k * 0.26, TOP + 0.03, GASES.z)
      root.add(j.group)
      // a stopcock on top, a coloured label: white for inflammable air, red for dephlogisticated
      const cock = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 10), brass)
      cock.position.set(GASES.x - 0.13 + k * 0.26, TOP + 0.03 + JAR.h + 0.03, GASES.z)
      const tag = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), knobMats[k])
      tag.position.set(GASES.x - 0.13 + k * 0.26, TOP + 0.03 + JAR.h * 0.72, GASES.z + JAR.r + 0.002)
      root.add(cock, tag)
      gasJars.push(j)
    }
  }
  // the globe on its brass stand, its cock, the two wires, the dew and the drop
  const globe = new THREE.Group()
  const dewMat = new THREE.MeshStandardMaterial({ color: '#e8f4ff', roughness: 0.3, transparent: true, opacity: 0, depthWrite: false, emissive: '#5a7a9a', emissiveIntensity: 0.5 })
  const dropMat = new THREE.MeshStandardMaterial({ color: '#bfe0ff', roughness: 0.05, transparent: true, opacity: 0.85, emissive: '#4a8ac8', emissiveIntensity: 0.9, envMap: env, envMapIntensity: 1.4 })
  const cockLever = new THREE.Group()
  let dropMesh = null
  let sparkLine = null
  const spark = { a: new THREE.Vector3(GLOBE.x, GLOBE.y + 0.006, GLOBE.z), b: new THREE.Vector3(GLOBE.x, GLOBE.y - 0.006, GLOBE.z) }
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 20), brass)
    foot.position.set(GLOBE.x, TOP + 0.01, GLOBE.z)
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, GLOBE.y - GLOBE.r - TOP, 10), brass)
    pillar.position.set(GLOBE.x, (GLOBE.y - GLOBE.r + TOP) / 2, GLOBE.z)
    const cup = new THREE.Mesh(lathe([[0.008, 0], [0.03, 0.006], [0.036, 0.02], [0.032, 0.022], [0.01, 0.008]], 18), brass)
    cup.position.set(GLOBE.x, GLOBE.y - GLOBE.r - 0.012, GLOBE.z)
    root.add(foot, pillar, cup)
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(GLOBE.r, 32, 20), glassMat)
    sphere.renderOrder = 3
    const dew = new THREE.Mesh(new THREE.SphereGeometry(GLOBE.r - 0.002, 24, 16), dewMat)
    dew.renderOrder = 2
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.05, 12), glassMat)
    neck.position.y = GLOBE.r + 0.02
    neck.renderOrder = 3
    const cockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 12), brass)
    cockBody.position.y = GLOBE.r + 0.06
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8), brass)
    plug.rotation.z = Math.PI / 2
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.05, 0.008), brass)
    handle.position.set(0.03, 0.02, 0)
    cockLever.add(plug, handle)
    cockLever.position.y = GLOBE.r + 0.06
    const wireMat = brass
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, GLOBE.r + 0.04, 6), wireMat)
    top.position.y = (GLOBE.r + 0.04) / 2 + 0.006
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, GLOBE.r, 6), wireMat)
    bottom.position.y = -GLOBE.r / 2 - 0.006
    for (const wtip of [0.006, -0.006]) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.003, 8, 6), wireMat)
      ball.position.y = wtip
      globe.add(ball)
    }
    dropMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), dropMat)
    dropMesh.visible = false
    globe.add(sphere, dew, neck, cockBody, cockLever, top, bottom, dropMesh)
    globe.position.set(GLOBE.x, GLOBE.y, GLOBE.z)
    root.add(globe)
    // the spark: a jagged line between the two wires' ends
    const pts = new Float32Array(7 * 3)
    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    sparkLine = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: new THREE.Color('#e0ecff').multiplyScalar(3), transparent: true, opacity: 0 }))
    sparkLine.frustumCulled = false
    sparkLine.raycast = () => {}
    root.add(sparkLine)
  }
  const globeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#cfe0ff').multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  globeGlow.position.set(GLOBE.x, GLOBE.y, GLOBE.z)
  globeGlow.raycast = () => {}
  root.add(globeGlow)
  // the tubes from the jars' cocks to the globe's cock, and the gas running along them
  const gasPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(GASES.x - 0.13, TOP + 0.03 + JAR.h + 0.055, GASES.z),
    new THREE.Vector3(GASES.x - 0.13, TOP + 0.48, GASES.z),
    new THREE.Vector3(GASES.x + 0.13, TOP + 0.48, GASES.z),
    new THREE.Vector3(GLOBE.x - 0.12, TOP + 0.5, GLOBE.z),
    new THREE.Vector3(GLOBE.x - 0.04, GLOBE.y + GLOBE.r + 0.07, GLOBE.z),
    new THREE.Vector3(GLOBE.x - 0.015, GLOBE.y + GLOBE.r + 0.06, GLOBE.z),
  ])
  {
    const t1 = new THREE.Mesh(new THREE.TubeGeometry(gasPath, 60, 0.005, 6, false), glassMat)
    t1.renderOrder = 3
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.48 - 0.03 - JAR.h - 0.055, 6), glassMat)
    branch.position.set(GASES.x + 0.13, TOP + (0.48 + 0.03 + JAR.h + 0.055) / 2, GASES.z)
    root.add(t1, branch)
  }
  const GD = light ? 10 : 18
  const gdPos = new Float32Array(GD * 3)
  const gdGeo = new THREE.BufferGeometry()
  gdGeo.setAttribute('position', new THREE.BufferAttribute(gdPos, 3))
  const gasDots = new THREE.Points(gdGeo, new THREE.PointsMaterial({ map: soft, color: new THREE.Color('#ffe2b8').multiplyScalar(1.5), size: 0.03, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  gasDots.frustumCulled = false
  gasDots.raycast = () => {}
  root.add(gasDots)
  // the Leyden jar: glass coated with tinfoil, a brass rod and knob; a wire to the globe's upper wire
  const leydenKnobMat = new THREE.MeshStandardMaterial({ color: '#c49a4c', roughness: 0.28, metalness: 0.9, envMap: env, emissive: '#7aa0ff', emissiveIntensity: 0 })
  const KNOB = new THREE.Vector3(LEYDEN.x, TOP + 0.37, LEYDEN.z)
  const leyden = new THREE.Group()
  {
    const g = leyden
    const glass = new THREE.Mesh(lathe([[0, 0], [0.055, 0], [0.058, 0.01], [0.058, 0.2], [0.054, 0.205]], 22), glassMat)
    glass.renderOrder = 3
    const foil = new THREE.Mesh(new THREE.CylinderGeometry(0.0595, 0.0595, 0.13, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#b8bcc2', roughness: 0.35, metalness: 0.85, envMap: env }))
    foil.position.y = 0.075
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.014, 22), mats.wood)
    lid.position.y = 0.207
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 8), brass)
    rod.position.y = 0.29
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), leydenKnobMat)
    knob.position.y = 0.37
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 10), ghost)
    hit.position.y = 0.21
    g.add(glass, foil, lid, rod, knob, hit)
    g.position.set(LEYDEN.x, TOP, LEYDEN.z)
    root.add(g)
    const wire = new THREE.CatmullRomCurve3([
      KNOB.clone(),
      new THREE.Vector3(LEYDEN.x - 0.1, TOP + 0.47, LEYDEN.z),
      new THREE.Vector3(GLOBE.x + 0.12, TOP + 0.5, GLOBE.z + 0.02),
      new THREE.Vector3(GLOBE.x + 0.01, GLOBE.y + GLOBE.r + 0.1, GLOBE.z),
      new THREE.Vector3(GLOBE.x, GLOBE.y + GLOBE.r + 0.08, GLOBE.z),
    ])
    root.add(new THREE.Mesh(new THREE.TubeGeometry(wire, 50, 0.0022, 5, false), brass))
  }
  // the electrical machine: a glass cylinder turned by a crank against a leather rubber, a prime conductor
  const machine = new THREE.Group()
  const cylinder = new THREE.Group()
  const crank = new THREE.Group()
  const CYL_Y = 0.3
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.34), mats.wood)
    base.position.y = 0.018
    machine.add(base)
    for (const sx of [-1, 1]) {
      const up = new THREE.Mesh(new THREE.BoxGeometry(0.04, CYL_Y + 0.03, 0.05), mats.wood)
      up.position.set(sx * 0.23, (CYL_Y + 0.03) / 2 + 0.03, -0.04)
      machine.add(up)
    }
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.36, 28, 1, true), new THREE.MeshStandardMaterial({ color: '#d6ecf2', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45, depthWrite: false, envMap: env, envMapIntensity: 1.5, side: THREE.DoubleSide }))
    glass.rotation.z = Math.PI / 2
    glass.renderOrder = 3
    // a few streaks so the turning shows
    for (let k = 0; k < 3; k++) {
      const streak = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.004, 0.004), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 }))
      const a = (k / 3) * TAU
      streak.position.set(0, Math.cos(a) * 0.076, Math.sin(a) * 0.076)
      cylinder.add(streak)
    }
    for (const sx of [-1, 1]) {
      const capEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.02, 24), mats.wood)
      capEnd.rotation.z = Math.PI / 2
      capEnd.position.x = sx * 0.19
      cylinder.add(capEnd)
    }
    cylinder.add(glass)
    cylinder.position.set(0, CYL_Y, -0.04)
    machine.add(cylinder)
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.56, 8), mats.iron)
    axle.rotation.z = Math.PI / 2
    axle.position.set(0.02, CYL_Y, -0.04)
    machine.add(axle)
    // the crank: an arm and a wooden handle, on the right
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.13, 0.02), mats.iron)
    arm.position.y = 0.06
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), mats.wood)
    handle.rotation.z = Math.PI / 2
    handle.position.set(0.04, 0.12, 0)
    crank.add(arm, handle)
    crank.position.set(0.3, CYL_Y, -0.04)
    machine.add(crank)
    // the rubber behind, the prime conductor in front on a glass pillar
    const rubber = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.03), new THREE.MeshStandardMaterial({ color: '#5a2a1e', roughness: 0.9 }))
    rubber.position.set(0, CYL_Y, -0.13)
    const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, CYL_Y, 10), glassMat)
    pil.position.set(0, CYL_Y / 2 + 0.035, 0.13)
    pil.renderOrder = 3
    const cond = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 18), brass)
    cond.rotation.z = Math.PI / 2
    cond.position.set(0, CYL_Y + 0.05, 0.13)
    for (const sx of [-1, 1]) {
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), brass)
      end.position.set(sx * 0.17, CYL_Y + 0.05, 0.13)
      machine.add(end)
    }
    machine.add(rubber, pil, cond)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.4, 0.4), ghost)
    hit.position.set(0.04, CYL_Y, 0)
    machine.add(hit)
    machine.position.set(MACHINE.x, TOP, MACHINE.z)
    root.add(machine)
    // a chain from the conductor to the Leyden jar's knob
    const chain = new THREE.CatmullRomCurve3([
      new THREE.Vector3(MACHINE.x - 0.2, TOP + CYL_Y + 0.05, MACHINE.z + 0.13),
      new THREE.Vector3(MACHINE.x - 0.4, TOP + CYL_Y - 0.02, MACHINE.z + 0.18),
      new THREE.Vector3(KNOB.x + 0.02, KNOB.y, KNOB.z),
    ])
    root.add(new THREE.Mesh(new THREE.TubeGeometry(chain, 30, 0.0025, 5, false), brass))
  }
  // crackles at the conductor while it turns, and at the knob when charged
  const CR = light ? 16 : 30
  const crPos = new Float32Array(CR * 3)
  const crGeo = new THREE.BufferGeometry()
  crGeo.setAttribute('position', new THREE.BufferAttribute(crPos, 3))
  const crackles = new THREE.Points(crGeo, new THREE.PointsMaterial({ map: soft, color: new THREE.Color('#c8dcff').multiplyScalar(2), size: 0.025, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  crackles.frustumCulled = false
  crackles.raycast = () => {}
  root.add(crackles)
  // the picture's lens on a brass arm behind the globe: the drop's molecules, then the reaction
  const lensFace = new THREE.Group()
  const waterView = new THREE.Group()
  const reactView = new THREE.Group()
  const hMat = new THREE.MeshStandardMaterial({ color: '#f4f6f8', roughness: 0.35, emissive: '#3a3c40', emissiveIntensity: 0.5 })
  const oMat = new THREE.MeshStandardMaterial({ color: '#e0443a', roughness: 0.35, emissive: '#4a0c08', emissiveIntensity: 0.6 })
  const ballH = new THREE.SphereGeometry(0.019, 16, 12)
  const ballO = new THREE.SphereGeometry(0.03, 18, 12)
  // a water molecule: O with two H at 104.5 degrees (the picture's style: touching balls)
  const H2O = () => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(ballO, oMat))
    const half = (104.5 / 2) * (Math.PI / 180)
    for (const s of [-1, 1]) {
      const hb = new THREE.Mesh(ballH, hMat)
      hb.position.set(Math.sin(half) * s * 0.034, -Math.cos(half) * 0.034, 0.004)
      g.add(hb)
    }
    return g
  }
  const pair = (mat, geoB, d) => {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const b = new THREE.Mesh(geoB, mat)
      b.position.x = s * d
      g.add(b)
    }
    return g
  }
  const waters = []
  const react = { h: [pair(hMat, ballH, 0.016), pair(hMat, ballH, 0.016)], o: pair(oMat, ballO, 0.025), w: [H2O(), H2O()] }
  {
    const backing = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), new THREE.MeshBasicMaterial({ color: '#141a3c' }))
    const ringMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.028, 10, 64), ringMat)
    ring.position.z = 0.02
    const gloss = new THREE.Mesh(new THREE.TorusGeometry(LENS.r * 0.82, 0.008, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 }))
    gloss.rotation.z = 1.9
    gloss.position.z = 0.12
    lensFace.add(backing, ring, gloss, waterView, reactView)
    const rnd = random(1784)
    for (let k = 0; k < 7; k++) {
      const m = H2O()
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * (LENS.r - 0.06)
      m.userData = { x: Math.cos(a) * r, y: Math.sin(a) * r, ph: rnd() * TAU, sp: 0.5 + rnd() }
      m.position.z = 0.06
      waterView.add(m)
      waters.push(m)
    }
    reactView.add(...react.h, react.o, ...react.w)
    for (const m of [...react.h, react.o, ...react.w]) m.position.z = 0.06
    const lensFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffe8b0').multiplyScalar(2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    lensFlash.position.z = 0.08
    lensFlash.scale.setScalar(0.22)
    reactView.add(lensFlash)
    react.flash = lensFlash
    lensFace.position.set(LENS.x, LENS.y, LENS.z)
    lensFace.rotation.y = Math.atan2(BENCH_B.x - 0.2 - LENS.x, -4.3 - LENS.z)
    root.add(lensFace)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, LENS.y - LENS.r - TOP, 8), brass)
    post.position.set(LENS.x, TOP + (LENS.y - LENS.r - TOP) / 2, LENS.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 16), brass)
    foot.position.set(LENS.x, TOP + 0.01, LENS.z)
    root.add(post, foot)
  }
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LENS.r + 0.04, 24), ghost)
  lensHit.position.z = 0.15
  lensFace.add(lensHit)
  // the book from Paris (1787) on a slanted stand: its table of new names open at hydrogène
  const book = new THREE.Group()
  const bookTex = canvasTex(1024, 640, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, '#d9c8a2')
    grd.addColorStop(0.47, '#ead9b6')
    grd.addColorStop(0.5, '#b8a27a')
    grd.addColorStop(0.53, '#ead9b6')
    grd.addColorStop(1, '#d9c8a2')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#2a1c10'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = "600 40px Georgia, 'Times New Roman', serif"
    g.fillText('MÉTHODE', w * 0.25, h * 0.26)
    g.font = "500 30px Georgia, 'Times New Roman', serif"
    g.fillText('DE NOMENCLATURE', w * 0.25, h * 0.36)
    g.fillText('CHIMIQUE', w * 0.25, h * 0.44)
    g.fillRect(w * 0.15, h * 0.53, w * 0.2, 2)
    g.font = "italic 500 26px Georgia, 'Times New Roman', serif"
    g.fillText('Paris', w * 0.25, h * 0.64)
    g.font = "500 30px Georgia, 'Times New Roman', serif"
    g.fillText('M. DCC. LXXXVII.', w * 0.25, h * 0.74)
    g.font = "italic 500 32px Georgia, 'Times New Roman', serif"
    g.fillText('Air inflammable', w * 0.75, h * 0.3)
    g.fillText('↓', w * 0.75, h * 0.43)
    g.font = "700 62px Georgia, 'Times New Roman', serif"
    g.fillStyle = '#5a1e10'
    g.fillText('Gaz hydrogène', w * 0.75, h * 0.6)
  })
  textures.push(bookTex)
  {
    const pages = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshStandardMaterial({ map: bookTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: bookTex, emissiveIntensity: 0.18 }))
    pages.rotation.x = -Math.PI / 2
    pages.position.y = 0.018
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.016, 0.27), new THREE.MeshStandardMaterial({ color: '#4a2418', roughness: 0.7 }))
    cover.position.y = 0.006
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.1, 0.32), ghost)
    book.add(cover, pages, hit)
    const tilt = new THREE.Group()
    tilt.rotation.x = 0.45
    tilt.add(book)
    tilt.position.set(BOOK.x, TOP + 0.08, BOOK.z)
    tilt.rotation.y = -0.25
    root.add(tilt)
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.1), mats.wood)
    prop.position.set(BOOK.x, TOP + 0.04, BOOK.z - 0.08)
    prop.rotation.y = -0.25
    root.add(prop)
  }
  // the slate above: the gases used
  const slate3 = slate(1.5, 0.78, 1024, 532)
  slate3.group.position.set(BENCH_B.x + 0.1, 1.86, ROOM.z0 + 0.04)
  candle(5.15, TOP, -6.05, { glow: light ? 1.6 : 2.0, reach: 5.5 })

  // ---- the state: a mixture in the globe (1) or none, the Leyden jar's charge (0..1), sparks fired (each
  // one a filling burnt), cranks (counted, so a turn plays on the others' screens), the lens (0 empty, 1 the
  // drop's water, 2 the reaction) ----
  const G = { full: 0, charge: 0, sparks: 0, cranks: 0, lens: 0, lt: 0 }
  let spin = 0 // seconds the cylinder still turns
  let gasRun = 0 // seconds the gas still runs to the globe
  let bang = 0 // the spark's flash, fading
  let dew = 0
  let readBook = false
  let lensSeen = false
  let lensShown = -1
  let lensK = 0
  let mineGlobe = false
  const used = () => Math.min(FILLS, G.sparks + G.full)
  const drawSlate3 = () => {
    const sci = level() === 'scientist'
    slate3.tex.userData.redraw((g, w, h) => {
      slateBg(g, w, h)
      g.fillStyle = chalk
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.font = chalkFont(42)
      g.textAlign = 'center'
      g.fillText(E.globe.slate.title, w / 2, 52)
      const n = Math.min(G.sparks, FILLS)
      const rows = [
        { name: E.globe.slate.inflammable, c: '#f2f2f0', per: 2, num: INF[n], y: 170 },
        { name: E.globe.slate.dephlogisticated, c: '#ff6a5a', per: 1, num: DEP[n], y: 300 },
      ]
      for (const r of rows) {
        g.textAlign = 'left'
        g.fillStyle = chalk
        g.font = chalkFont(30, 500)
        g.fillText(r.name, 40, r.y - 42)
        if (sci) {
          const bw = (r.num / 37000) * (w - 330)
          g.fillStyle = r.c
          g.fillRect(40, r.y - 10, Math.max(bw, 2), 30)
          g.fillStyle = chalk
          g.font = chalkFont(34, 600)
          g.fillText(String(r.num), 60 + Math.max(bw, 2), r.y + 5)
        } else {
          for (let k = 0; k < n * r.per; k++) {
            g.fillStyle = r.c
            g.beginPath()
            g.arc(60 + k * 56, r.y + 5, 22, 0, TAU)
            g.fill()
          }
        }
      }
      g.textAlign = 'center'
      g.fillStyle = '#ffd166'
      g.font = chalkFont(34, 600)
      const line = n === 0 ? E.globe.slate.none : n >= FILLS && sci ? E.globe.slate.his : fill(E.globe.slate.sparks, { n })
      g.fillText(line, w / 2, h - 80)
      if (n > 0) {
        g.font = chalkFont(30, 500)
        g.fillStyle = chalk
        g.fillText(sci ? `${INF[n]} : ${DEP[n]} ≈ ${num(INF[n] / DEP[n], 1, lang)} : 1` : '2 : 1', w / 2, h - 34)
      }
    })
  }
  drawSlate3()
  let slate3Level = level()

  const globePanel = lv => ({
    title: E.globe.title,
    color,
    blocks: [
      { slider: { label: E.globe.slider, min: 0, max: 100, step: 5, value: Math.round(G.charge * 100), onInput: v => setCharge(Number(v) / 100), format: v => `${Math.round(v)} %`, live: () => Math.round(G.charge * 100) } },
      { buttons: [{ label: E.globe.buttons.cock, onClick: () => globeStep('cock') }, { label: E.globe.buttons.crank, onClick: () => globeStep('crank') }, { label: E.globe.buttons.spark, onClick: () => globeStep('globe') }] },
      { buttons: [{ label: E.globe.buttons.drop, onClick: () => globeStep('drop') }, { label: E.globe.buttons.book, onClick: () => globeStep('book') }] },
      ...E.globe.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const namePanel = lv => ({
    title: E.globe.name.title,
    color,
    blocks: E.globe.name[depthOf(lv)].map(p => ({ p })),
  })
  let chargeSend = null
  function setCharge(v) {
    G.charge = clamp(v)
    if (!chargeSend) {
      chargeSend = setTimeout(() => {
        chargeSend = null
        share('globe')
      }, 250)
    }
  }
  // a visitor's step: 'cock', 'crank' (the machine), 'globe' (the spark), 'drop', 'lens', 'book'
  function globeStep(what) {
    const lv = level()
    const S = E.globe.says
    if (what === 'cock') {
      if (gasRun > 0) return say(at(W.busy, lv))
      if (G.full) return say(at(S.full, lv))
      if (G.sparks >= FILLS) {
        G.sparks = 0
        G.lens = 0
        dew = 0
        play('select')
        say(at(S.fresh, lv))
        drawSlate3()
      } else {
        G.full = 1
        gasRun = 1.4
        play('fizz', { order: 0.5 })
        say(at(G.sparks ? S.more : S.cock, lv))
      }
    } else if (what === 'crank') {
      // a turn of the handle charges the jar fully (the state says so at once, for the room; the knob's glow
      // and the crackles show it coming)
      const was = G.charge
      G.cranks++
      G.charge = 1
      spin = 1.8
      play('crack')
      say(at(was >= 0.99 ? S.charged : S.crank, lv))
    } else if (what === 'globe') {
      if (gasRun > 0 || bang > 0.6) return say(at(W.busy, lv))
      if (!G.full) return say(at(G.sparks >= FILLS ? S.fresh0 : S.empty, lv))
      if (G.charge < 0.5) return say(at(S.noCharge, lv))
      G.charge = Math.max(0, G.charge - 0.5)
      G.full = 0
      G.sparks++
      fireSpark()
      const n = G.sparks
      say(at(n === 1 ? S.first : n === 2 ? S.drop : n >= FILLS ? S.six : S.spark, lv))
      drawSlate3()
    } else if (what === 'drop') {
      if (G.sparks < 2) return say(at(S.noDrop, lv))
      G.lens = 1
      G.lt = 0
      lensSeen = true
      play('select')
      say(at(S.water, lv))
    } else if (what === 'lens') {
      if (G.sparks < 2 && !G.lens) return say(at(S.noDrop, lv))
      G.lens = (G.lens + 1) % 3
      G.lt = 0
      lensSeen = true
      play(G.lens ? 'select' : 'tap')
      say(at(G.lens === 1 ? S.water : G.lens === 2 ? S.react : S.close, lv))
    } else if (what === 'book') {
      readBook = true
      play('tap')
      ctx.showPanel(namePanel)
      ex.discover('globe')
      return
    } else return
    mineGlobe = true
    ex.discover('globe', globePanel, 3.2)
    share('globe')
  }
  function fireSpark() {
    bang = 1
    dew = 1
    flash = Math.max(flash, 0.9)
    flashLight.position.set(GLOBE.x, GLOBE.y + 0.2, GLOBE.z + 0.3)
    play('pop')
    play('crack')
  }
  clickable(cockLever, () => globeStep('cock'))
  clickable(gasJars[0].group, () => globeStep('cock'))
  clickable(gasJars[1].group, () => globeStep('cock'))
  clickable(machine, () => globeStep('crank'))
  clickable(leyden, () => globeStep('globe'))
  // the globe: the drop at its bottom once there is one, the spark elsewhere
  clickable(globe, h => globeStep(h.object === cockLever.children[0] || h.object === cockLever.children[1] ? 'cock' : !G.full && G.sparks >= 2 ? 'drop' : 'globe'))
  clickable(lensFace, () => globeStep('lens'), { when: () => G.sparks >= 2 || G.lens > 0 })
  clickable(book, () => globeStep('book'))
  {
    // the globe is small: a bigger invisible shape to tap
    const hit = new THREE.Mesh(new THREE.SphereGeometry(GLOBE.r + 0.035, 12, 8), ghost)
    globe.add(hit)
  }
  ex.add({
    id: 'globe',
    x: 3.2,
    z: -4.35,
    radius: 1.8,
    manual: true,
    label: E.globe.label,
    verb: () => {
      const H = E.globe.hints
      if (G.full) return G.charge < 0.5 ? H.crank : H.spark
      if (G.sparks >= FILLS) return readBook ? H.fresh : H.book
      if (G.sparks >= 2 && !lensSeen) return H.drop
      return G.sparks ? H.more : H.cock
    },
    focus: { x: 3.3, y: 1.38, z: -5.9, size: 2.45, width: 3.85 },
    act: () => ctx.showPanel(globePanel),
  })
  function poseGlobe(dt, t) {
    if (level() !== slate3Level) {
      slate3Level = level()
      drawSlate3()
    }
    // the machine turns, the jar charges
    if (spin > 0) spin -= dt
    const turning = spin > 0
    const sp = turning ? 7 : 0
    cylinder.rotation.x += sp * dt
    crank.rotation.x += sp * dt
    leydenKnobMat.emissiveIntensity = damp(leydenKnobMat.emissiveIntensity, G.charge * 0.9, turning ? 1.2 : 3, dt)
    for (let i = 0; i < CR; i++) {
      const j = i * 3
      let c = null
      if (i < CR / 2 && turning && Math.random() < 0.5) c = tmpV.set(MACHINE.x + (Math.random() - 0.5) * 0.34, TOP + CYL_Y + 0.05, MACHINE.z + 0.1)
      else if (i >= CR / 2 && G.charge > 0.9 && Math.random() < 0.08) c = tmpV.copy(KNOB)
      if (c) crPos.set([c.x + (Math.random() - 0.5) * 0.05, c.y + (Math.random() - 0.5) * 0.05, c.z + (Math.random() - 0.5) * 0.05], j)
      else crPos[j + 1] = -9
    }
    crGeo.attributes.position.needsUpdate = true
    // the gas running in, and the jars' water rising (the inflammable air's twice as fast)
    if (gasRun > 0) gasRun -= dt
    gasDots.material.opacity = damp(gasDots.material.opacity, gasRun > 0 ? 0.9 : 0, 6, dt)
    for (let i = 0; i < GD; i++) {
      gasPath.getPointAt(((t * 0.8 + i / GD) % 1), tmpV)
      gdPos.set([tmpV.x, tmpV.y, tmpV.z], i * 3)
    }
    gdGeo.attributes.position.needsUpdate = true
    const u = used() - (gasRun > 0 ? clamp(gasRun / 1.4) : 0)
    const wantInf = 0.02 + (JAR.h - 0.05) * (u / FILLS)
    const wantDep = 0.02 + ((JAR.h - 0.05) / 2) * (u / FILLS)
    gasJars.forEach((j, k) => {
      const want = k ? wantDep : wantInf
      j.water.scale.y = damp(j.water.scale.y, want, 4, dt)
      j.water.visible = true
    })
    cockLever.rotation.y = damp(cockLever.rotation.y, gasRun > 0 ? Math.PI / 2 : 0, 8, dt)
    // the spark: a flash in the globe, the dew, the drop growing
    bang = Math.max(0, bang - dt * 2.2)
    sparkLine.material.opacity = bang > 0.75 ? 1 : 0
    if (bang > 0.75) {
      const p = sparkLine.geometry.attributes.position
      for (let k = 0; k < 7; k++) {
        const v = k / 6
        p.setXYZ(k, GLOBE.x + (k && k < 6 ? (Math.random() - 0.5) * 0.008 : 0), spark.a.y + (spark.b.y - spark.a.y) * v, GLOBE.z + (k && k < 6 ? (Math.random() - 0.5) * 0.008 : 0))
      }
      p.needsUpdate = true
    }
    globeGlow.material.opacity = bang * bang
    globeGlow.scale.setScalar(0.12 + 0.3 * bang)
    globe.position.x = GLOBE.x + Math.sin(t * 60) * 0.002 * bang
    dew = Math.max(0, dew - dt * 0.18)
    const film = Math.min(G.sparks, 1) * 0.1
    dewMat.opacity = Math.max(film, 0.7 * dew)
    const n = Math.min(G.sparks, FILLS)
    dropMesh.visible = n >= 1
    const rd = 0.008 + 0.016 * (n / FILLS)
    dropMesh.scale.set(rd, rd * 0.42, rd)
    dropMesh.position.y = -GLOBE.r + rd * 0.42 + 0.003
    // the lens
    if (G.lens !== lensShown) {
      lensShown = G.lens
      lensK = 0
    }
    if (G.lens) G.lt += dt
    lensK = Math.min(1, lensK + dt / 0.45)
    const lk = ease(lensK)
    waterView.visible = G.lens === 1
    reactView.visible = G.lens === 2
    waterView.scale.setScalar(0.5 + 0.5 * lk)
    reactView.scale.setScalar(0.6 + 0.4 * lk)
    if (G.lens === 1) {
      for (const m of waters) {
        const d = m.userData
        m.position.x = d.x + Math.sin(t * d.sp + d.ph) * 0.012
        m.position.y = d.y + Math.cos(t * d.sp * 1.3 + d.ph) * 0.012
        m.rotation.z = Math.sin(t * d.sp * 0.7 + d.ph) * 1.2
      }
    }
    if (G.lens === 2) {
      // two H2 and an O2 come together, a flash, two H2O fly apart; again and again
      const c = G.lt % 3.6
      const meet = span(0.2, 1.3, c)
      const apart = span(1.5, 2.6, c)
      const show = c < 1.4
      const hs = [[-0.12, 0.08], [-0.12, -0.08]]
      react.h.forEach((m, k) => {
        m.visible = show
        m.position.set(hs[k][0] * (1 - meet) - 0.022 * meet, hs[k][1] * (1 - meet) + (k ? -0.03 : 0.03) * meet, 0.06)
        m.rotation.z = (1 - meet) * (k ? 0.5 : -0.4)
      })
      react.o.visible = show
      react.o.position.set(0.12 * (1 - meet) + 0.02 * meet, 0, 0.06)
      react.o.rotation.z = Math.PI / 2 * meet
      react.w.forEach((m, k) => {
        m.visible = !show
        m.position.set((k ? 0.03 : -0.03) + (k ? 0.08 : -0.08) * apart, (k ? -0.02 : 0.02) + (k ? -0.03 : 0.03) * apart, 0.06)
        m.rotation.z = (k ? 0.6 : -0.6) * apart
      })
      react.flash.material.opacity = Math.max(0, 1 - Math.abs(c - 1.4) / 0.25) * 0.9
    }
  }
  updates.push(poseGlobe)
  const globeState = () => ({ full: G.full, charge: Math.round(G.charge * 100) / 100, sparks: G.sparks, cranks: G.cranks, lens: G.lens, lt: round1(G.lt) })
  const globeSet = (s, liveSet, ago = 0) => {
    const sparks = clamp(Math.round(Number(s?.sparks) || 0), 0, FILLS)
    const full = s?.full ? 1 : 0
    const cranks = Math.max(0, Math.round(Number(s?.cranks) || 0))
    if (liveSet) {
      if (sparks > G.sparks) fireSpark()
      if (full && !G.full) gasRun = 1.4
      if (cranks > G.cranks) spin = 1.8
      if (sparks < G.sparks) dew = 0
    }
    G.sparks = sparks
    G.full = full
    G.cranks = cranks
    G.charge = clamp(Number(s?.charge) || 0)
    G.lens = [0, 1, 2].includes(s?.lens) ? s.lens : 0
    G.lt = G.lens ? Math.max(0, Number(s?.lt) || 0) + Math.min(Number(ago) || 0, 3600) : 0
    mineGlobe = false
    if (!liveSet) {
      spin = 0
      gasRun = 0
      bang = 0
      lensShown = G.lens
      lensK = 1
    }
    drawSlate3()
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: { ...stage.env, bloom: { strength: 0.62, radius: 0.5, threshold: 0.84 } },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.3 },
    spawn: { x: 0, z: 3.2, yaw: 0 },
    hostSpot: { x: -1.9, z: 2.4, yaw: Math.atan2(-1.9, -0.8) },
    back: { x: 0, z: 5.9, rot: Math.PI },
    stand: { x: 3.4, z: 1.6, rot: Math.atan2(-3.4, 1.6) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      metals: {
        tap: what => metalsStep(what), // 'zn', 'fe', 'sn' (a saucer), 'v', 's' (an acid), 'jar'
        get state() { return metalsState() },
        get fill() { return fillOf() },
        at: what => {
          const mi = ['zn', 'fe', 'sn'].indexOf(what)
          if (mi >= 0) return new THREE.Vector3(DISH[mi].x, TOP + 0.03, DISH[mi].z)
          const ai = ['v', 's'].indexOf(what)
          if (ai >= 0) return acids[ai].group.position.clone().add(new THREE.Vector3(0, 0.12, 0))
          return jar.group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, M.jar ? -0.15 : 0.15, 0))
        },
      },
      bottles: {
        tap: i => bottleStep(i), // 0 (1 part in 10) to 8 (pure)
        get state() { return bottlesState() },
        get busy() { return !!firing },
        at: i => new THREE.Vector3(BX, TABLE2.top + 0.12, bz(i)),
      },
      globe: {
        tap: what => globeStep(what), // 'cock', 'crank', 'globe', 'drop', 'lens', 'book'
        get state() { return globeState() },
        at: what => ({
          cock: new THREE.Vector3(GLOBE.x, GLOBE.y + GLOBE.r + 0.06, GLOBE.z),
          crank: new THREE.Vector3(MACHINE.x + 0.3, TOP + CYL_Y, MACHINE.z),
          globe: new THREE.Vector3(GLOBE.x, GLOBE.y, GLOBE.z),
          drop: new THREE.Vector3(GLOBE.x, GLOBE.y - GLOBE.r + 0.01, GLOBE.z + 0.02),
          lens: lensFace.getWorldPosition(new THREE.Vector3()),
          book: new THREE.Vector3(BOOK.x, TOP + 0.1, BOOK.z),
          leyden: KNOB.clone(),
        })[what],
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { metals: metalsPanel, bottles: bottlesPanel, globe: globePanel, name: namePanel },
    shared: {
      metals: { get: metalsState, set: metalsSet },
      bottles: { get: bottlesState, set: (s, liveSet) => bottlesSet(s, liveSet) },
      globe: { get: globeState, set: globeSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (chargeSend) clearTimeout(chargeSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
