// Oxygen's picture "What does a fire need?" as a room (docs/knowledge/picture-rooms.md). The fire wing next
// door shows what a fire needs; this room shows how people found out, in the 1770s: Antoine Lavoisier's
// laboratory in Paris by day (stages/laboratory.js), glazed doors open onto a terrace in the sun. The
// picture's triangle is laid out in the room: the heat (the sun through a great burning lens, on the
// terrace to the right), the oxygen (the twelve days, on the bench at the back), the fuel (the great
// balance, on the left); Marie-Anne Lavoisier's drawing table stands by the window. Each step is chosen by
// tapping its thing (the user, 2026-10-30); the prompt names the next tap; E opens the station's panel,
// whose buttons (and the days' slider) do the same:
// - the lens (Priestley, 1 August 1774): tap it to aim the sun at red mercury calx floating at the top of a
//   jar of mercury; a gas comes off and pushes the mercury down; tap the candle and the jar is lifted out on
//   a glass plate, turned up, and the candle lowered in: it blazes;
// - the twelve days (Lavoisier's experiment, Traité élémentaire de chimie, 1789): tap the furnace (or slide
//   the days) to heat mercury in a long-necked flask whose neck opens into a bell jar over mercury; a red
//   crust grows and the air shrinks from 50 to 42.5 cubic inches; tap the candle and it goes out in the
//   leftover air (azote); tap the red crust and it is heated strongly in a small retort: mercury and 7.5
//   cubic inches of air come back, in which the second candle blazes;
// - the balance (Lavoisier's tin in a sealed flask, 1774): tap the flask and it is heated on the brazier
//   (off the pan the balance tips; back on it, level again: the same weight); tap its sealed tip and air
//   rushes in: heavier;
// - the drawing table: tap the drawing to turn to the next of three plates (no words in anyone's hand).
// All four are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, random, fill } from '../../../wings/noble/kit.js'
import { laboratoryStage } from '../../stages/laboratory.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { FIRE_WORDS } from './fire.words.js'

export const WORDS = FIRE_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const round2 = v => Math.round(v * 100) / 100
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- where things stand (metres; the spawn at z = 3.3 looks along -z) ----
const ROOM = { x0: -6.5, x1: 6.5, z0: -6.5, z1: 6.5, h: 5.2 }
const TERRACE = { x1: 13.0, z0: -5.6, z1: 4.6 }
const SUN = new THREE.Vector3(0.82, 0.52, -0.24).normalize()
// the lens on the terrace: the calx at its focus, the lens 1.75 m toward the sun
const LT = { x: 9.0, z: -0.95, w: 0.95, d: 0.7, top: 0.78 }
const BASIN = { x: 8.95, z: -1.08, r: 0.2 }
const HG1 = LT.top + 0.035 // the mercury's surface in the basin
const JAR1 = { r: 0.075, h: 0.34 }
const FOCUS = new THREE.Vector3(BASIN.x, HG1 + JAR1.h - 0.04, BASIN.z)
const LENS = FOCUS.clone().addScaledVector(SUN, 1.75)
const LENS_R = 0.58
// the bench at the back: the furnace and the long-necked flask, the trough, the small retort
const BENCH = { x0: -2.3, x1: 2.7, z: -5.98, d: 0.86, top: 0.85 }
const FURN = { x: -1.45, z: -5.98, r: 0.24, h: 0.38 }
const FLASK = { x: FURN.x, y: BENCH.top + FURN.h + 0.09, z: FURN.z, r: 0.16 }
const TROUGH = { x0: -0.55, x1: 1.15, z: -5.98, w: 0.5, h: 0.12 }
const HG2 = BENCH.top + TROUGH.h - 0.012
const BELL = { x: 0.05, r: 0.21, h: 0.52, lift0: 0.05, rise: 0.11 }
const SMALL = { x: 0.8, r: 0.075, h: 0.27 }
const RETORT2 = { x: 1.85, z: -6.05, r: 0.085 }
// the balance on the left, the brazier beside it
const BT = { x: -5.98, z0: -3.35, z1: -0.25, d: 0.8, top: 0.85 }
const BAL = { x: -6.0, z: -2.05, pivot: BT.top + 0.98, arm: 0.5, hang: 0.74 }
const BRAZ = { x: -6.0, z: -0.72, r: 0.16, h: 0.22 }
// Marie-Anne Lavoisier's table by the west window
const MT = { x: -5.85, z: 3.1, w: 0.8, d: 1.3, top: 0.78 }
// the days of heating, the times of the steps (seconds)
const DAY = 1.3
const HEAT1 = 7.5 // the lens: the gas comes off
const CRUST_T = 6.5 // the red crust heated in the small retort
const HEAT3 = 6.0 // the tin's flask off the pan, heated, back
const air = day => 50 - 7.5 * span(1, 7.5, day) // cubic inches under the bell jar

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

/** What shiny mercury and brass reflect here: a bright sky above a warm room. */
function shineEnv() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#4e4942')
    grd.addColorStop(0.24, '#6a645a')
    grd.addColorStop(0.31, '#a9b1ba')
    grd.addColorStop(0.46, '#9ca2a8')
    grd.addColorStop(0.5, '#7a6c5c')
    grd.addColorStop(0.6, '#463628')
    grd.addColorStop(1, '#22180f')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#ffffff'
    for (const x of [0.08, 0.3, 0.55, 0.8]) g.fillRect(x * w, h * 0.3, w * 0.07, h * 0.15)
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/** A line of geometry between two points (a cylinder 1 long along y). */
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(1, Math.max(0.001, a.distanceTo(b)), 1)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
}

const lathe = (pts, n = 24) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), n)

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, light, level, color, clickable, lang }) {
  const stage = laboratoryStage({
    light,
    ...ROOM,
    windows: [{ side: 'w', at: -1.85 }, { side: 'w', at: 3.1 }],
    doors: [{ side: 'e', at: -1.95 }, { side: 'e', at: 2.05 }],
    terrace: TERRACE,
    sun: SUN.toArray(),
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v)
  const soft = softTex()
  const flame = flameTex()
  const env = shineEnv()
  textures.push(soft, flame, env)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const tmpV = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  // a station's focus: how high and how wide it is (the station view fits both, so an upright phone sees
  // the whole width too)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#e4f2f4', roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.26, depthWrite: false, side: THREE.DoubleSide, envMap: env, envMapIntensity: 1.2 })
  const mercury = new THREE.MeshStandardMaterial({ color: '#c2c7ce', roughness: 0.08, metalness: 1, envMap: env, envMapIntensity: 1.3 })
  const calxMat = new THREE.MeshStandardMaterial({ color: '#c0301c', roughness: 0.85, emissive: '#ff6a20', emissiveIntensity: 0 })
  const brassEnv = new THREE.MeshStandardMaterial({ color: '#c99c4a', roughness: 0.28, metalness: 0.95, envMap: env, envMapIntensity: 1.1 })
  const clay = new THREE.MeshStandardMaterial({ color: '#9a5a3a', roughness: 0.85 })
  const coalMat = new THREE.MeshStandardMaterial({ color: '#2a1810', roughness: 0.9, emissive: '#ff5a14', emissiveIntensity: 0 })
  const brazCoal = coalMat.clone()
  // the calx heated by the lens, and the crust in the small retort, glow on their own
  const calxLens = calxMat.clone()
  const calxRetort = calxMat.clone()
  const waxMat = new THREE.MeshStandardMaterial({ color: '#f1e9d4', roughness: 0.6, emissive: '#6a4a20', emissiveIntensity: 0.15 })
  const paperMat = new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.9 })
  // one light for whichever flame flares (a candle blazing in the new air)
  const flare = new THREE.PointLight('#fff2d0', 0, 4, 1.6)
  root.add(flare)
  let flareWant = 0
  updates.push(dt => (flare.intensity = damp(flare.intensity, flareWant, 8, dt)))

  // ======== small pieces used at every station ========
  /** A table: a top on four legs, a solid to walk round. */
  function table(x, z, w, d, top, mat = mats.wood) {
    const g = new THREE.Group()
    const t = new THREE.Mesh(new RoundedBoxGeometry(w, 0.05, d, 2, 0.012), mat)
    t.position.set(0, top - 0.025, 0)
    g.add(t)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, top - 0.05, 8), mats.darkWood)
        leg.position.set(sx * (w / 2 - 0.07), (top - 0.05) / 2, sz * (d / 2 - 0.07))
        g.add(leg)
      }
    }
    const apron = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.09, d - 0.1), mats.darkWood)
    apron.position.y = top - 0.095
    g.add(apron)
    g.position.set(x, 0, z)
    g.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true))
    root.add(g)
    solids.push(box(x, z, w, d))
    return g
  }

  /** A taper on a bent wire (its origin at the candle's foot): lit, it can be lowered into a jar. */
  function probe() {
    const g = new THREE.Group()
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.017, 0.12, 12), waxMat)
    wax.position.y = 0.06
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.02, 0.014, 12), brassEnv)
    cup.position.y = 0.004
    const wireMat = mats.iron
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.6, 5), wireMat)
    wire.position.set(0.03, 0.3, 0)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.032, 5), wireMat)
    foot.rotation.z = Math.PI / 2
    foot.position.set(0.014, 0.005, 0)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.0035, 5, 12), wireMat)
    ring.position.set(0.03, 0.62, 0)
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
    f.center.set(0.5, 0.1)
    f.position.y = 0.122
    const smoke = Array.from({ length: 4 }, (_, i) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#8a8580', transparent: true, opacity: 0, depthWrite: false }))
      g.add(s)
      return { s, ph: i / 4 }
    })
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.72, 0.16), ghost)
    hit.position.y = 0.33
    g.add(wax, cup, wire, foot, ring, f, hit)
    root.add(g)
    const base = new THREE.Color('#ffd9a0').multiplyScalar(2.4)
    const white = new THREE.Color('#ffffff').multiplyScalar(4.2)
    let smokeT = -1
    return {
      group: g,
      hit,
      // k: the flame's size (0 out), w: how white and dazzling (0..1), t: time for the flicker
      flame(k, w, t) {
        const fl = 1 + Math.sin(t * 13 + g.id) * 0.07 * (1 + w * 2) + Math.sin(t * 27.3) * 0.05 * (1 + w * 2)
        f.visible = k > 0.01
        f.scale.set(0.04 * k * (2 - fl) * (1 + w * 0.5), 0.1 * k * fl, 1)
        f.material.color.copy(base).lerp(white, w)
      },
      // the smoke of a candle gone out (s: seconds since, -1 none)
      smoke(s) {
        smokeT = s
        for (const p of smoke) {
          const u = s < 0 ? 1 : (s * 0.45 + p.ph) % 1
          const life = s < 0 ? 0 : clamp(1 - s / 3.5)
          p.s.position.set(Math.sin(u * 6 + p.ph * 9) * 0.02, 0.13 + u * 0.32, Math.cos(u * 5) * 0.02)
          p.s.scale.setScalar(0.03 + u * 0.09)
          p.s.material.opacity = 0.32 * life * Math.sin(Math.PI * u)
        }
        return smokeT
      },
    }
  }

  /** A gas jar standing mouth down in mercury, tested by lifting it out on a glass plate, turning it up and
   *  lowering a lit taper into it. `jar`: a group with its mouth at the origin and its body along -y. */
  function jarTest({ jar, r, h, trough, bench, pr, rest, dip, lift = 0.32 }) {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.35, r * 1.35, 0.006, 24), glassMat)
    plate.position.y = 0.004
    plate.renderOrder = 4
    plate.visible = false
    jar.add(plate)
    const benchTop = bench.clone().setY(bench.y + h)
    const over = new THREE.Vector3()
    return {
      // t: seconds since the test began (-1: the jar is still in the mercury); mode 'out' or 'bright'
      pose(t, mode, time) {
        if (t < 0) {
          jar.position.copy(trough)
          jar.rotation.set(Math.PI, 0, 0)
          plate.visible = false
          pr.group.position.copy(rest)
          pr.flame(1, 0, time)
          pr.smoke(-1)
          return 0
        }
        // the plate slides under the mouth, the jar comes up and over, turned mouth up
        plate.visible = t < 2.05
        plate.position.x = t < 0.5 ? r * 2.4 * (1 - span(0, 0.45, t)) : r * 2.6 * span(1.6, 2.0, t)
        const u = span(0.5, 1.6, t)
        jar.position.lerpVectors(trough, benchTop, u)
        jar.position.y += Math.sin(Math.PI * u) * lift
        jar.rotation.set(Math.PI * (1 - u), 0, 0)
        // the taper goes over and down into it
        over.copy(benchTop).setY(benchTop.y + 0.2)
        const a = span(2.0, 2.6, t)
        const b = span(2.6, 3.0, t)
        pr.group.position.lerpVectors(rest, over, a)
        pr.group.position.y += Math.sin(Math.PI * a) * 0.12 - b * (0.2 + dip)
        // and the flame answers the air it is in
        const k = t - 3.0
        if (mode === 'out') {
          pr.flame(k < 0 ? 1 : 1 - span(0, 0.45, k), 0, time)
          pr.smoke(k < 0.3 ? -1 : k - 0.3)
          return 0
        }
        const blaze = k < 0 ? 0 : span(0, 0.35, k) * (1 - 0.55 * span(7, 10, k))
        pr.flame(1 + 2.2 * blaze, blaze, time)
        pr.smoke(-1)
        return blaze
      },
    }
  }

  // ======== the terrace: the great burning lens (Priestley's experiment) ========
  table(LT.x, LT.z, LT.w, LT.d, LT.top)
  // the basin of mercury and the jar standing in it, full of mercury, the red calx floating at its top
  {
    const basin = new THREE.Mesh(lathe([[0, 0], [BASIN.r - 0.01, 0], [BASIN.r, 0.01], [BASIN.r + 0.008, 0.045], [BASIN.r - 0.004, 0.045], [BASIN.r - 0.01, 0.012], [0, 0.012]], 32), new THREE.MeshStandardMaterial({ color: '#d8d2c2', roughness: 0.4 }))
    basin.position.set(BASIN.x, LT.top, BASIN.z)
    const pool = new THREE.Mesh(new THREE.CircleGeometry(BASIN.r - 0.006, 32), mercury)
    pool.rotation.x = -Math.PI / 2
    pool.position.set(BASIN.x, HG1, BASIN.z)
    root.add(basin, pool)
  }
  const jar1 = new THREE.Group()
  {
    const g = new THREE.Mesh(lathe([[JAR1.r, 0], [JAR1.r, -JAR1.h + 0.02], [JAR1.r * 0.85, -JAR1.h + 0.004], [0, -JAR1.h]], 28), glassMat)
    g.renderOrder = 3
    const lip = new THREE.Mesh(new THREE.TorusGeometry(JAR1.r, 0.004, 6, 28), glassMat)
    lip.rotation.x = Math.PI / 2
    jar1.add(g, lip)
    root.add(jar1)
  }
  const hg1 = new THREE.Mesh(new THREE.CylinderGeometry(JAR1.r - 0.004, JAR1.r - 0.004, 1, 24).translate(0, 0.5, 0), mercury)
  hg1.position.set(BASIN.x, HG1, BASIN.z)
  root.add(hg1)
  const calx1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 10), calxLens)
  calx1.scale.set(1, 0.38, 1)
  root.add(calx1)
  const pr1 = probe()
  const REST1 = new THREE.Vector3(LT.x - 0.36, LT.top, LT.z + 0.16)
  const test1 = jarTest({ jar: jar1, r: JAR1.r, h: JAR1.h, trough: new THREE.Vector3(BASIN.x, HG1, BASIN.z), bench: new THREE.Vector3(LT.x + 0.3, LT.top, LT.z + 0.16), pr: pr1, rest: REST1, dip: 0.24 })
  // the great lens on its carriage, turned toward the sun by a yoke (the Academy's lenses in Paris were
  // used out of doors like this: Trudaine's, from 1774)
  const yoke = new THREE.Group()
  const tilt = new THREE.Group()
  const lensHit = new THREE.Mesh(new THREE.CylinderGeometry(LENS_R + 0.08, LENS_R + 0.08, 0.2, 24), ghost)
  {
    const carriage = new THREE.Group()
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.7), mats.wood)
    deck.position.y = 0.36
    carriage.add(deck)
    for (const [sx, sz] of [[-0.62, -0.7], [0.62, -0.7], [-0.62, 0.7], [0.62, 0.7]]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 18), mats.darkWood)
      wheel.rotation.x = Math.PI / 2
      wheel.position.set(sx, 0.26, sz + Math.sign(sz) * 0.06)
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.09, 10), mats.iron)
      hub.rotation.x = Math.PI / 2
      hub.position.copy(wheel.position)
      carriage.add(wheel, hub)
    }
    carriage.position.set(LENS.x + 0.15, 0, LENS.z)
    root.add(carriage)
    solids.push(circle(LENS.x + 0.15, LENS.z, 0.95))
    // the yoke turns on the carriage; the lens tilts in it
    const postH = LENS.y - 0.36
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, postH + 0.1, 0.1), mats.wood)
      post.position.set(0, 0.36 + postH / 2, s * (LENS_R + 0.14))
      yoke.add(post)
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 10), brassEnv)
      pin.rotation.x = Math.PI / 2
      pin.position.set(0, LENS.y, s * (LENS_R + 0.08))
      yoke.add(pin)
    }
    const turntable = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 20), mats.darkWood)
    turntable.position.y = 0.42
    yoke.add(turntable)
    yoke.position.set(LENS.x, 0, LENS.z)
    root.add(yoke)
    tilt.position.y = LENS.y
    yoke.add(tilt)
    // the lens: a thick double-convex glass in a wooden ring, its axis along the tilt group's x
    const lensGeo = new THREE.SphereGeometry(1, 40, 12, 0, TAU, 0, 0.32)
    const face = new THREE.Mesh(lensGeo, new THREE.MeshStandardMaterial({ color: '#b8dcf2', roughness: 0.02, metalness: 0.3, transparent: true, opacity: 0.5, envMap: env, envMapIntensity: 2.6, depthWrite: false, side: THREE.DoubleSide }))
    const kk = LENS_R / Math.sin(0.32)
    face.scale.setScalar(kk)
    face.position.y = -kk * Math.cos(0.32)
    const back = face.clone()
    back.rotation.x = Math.PI
    back.position.y = kk * Math.cos(0.32)
    const lensGroup = new THREE.Group()
    lensGroup.add(face, back)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(LENS_R + 0.03, 0.05, 10, 48), mats.darkWood)
    rim.rotation.x = Math.PI / 2
    const rimBrass = new THREE.Mesh(new THREE.TorusGeometry(LENS_R + 0.03, 0.018, 6, 48), brassEnv)
    rimBrass.rotation.x = Math.PI / 2
    rimBrass.position.y = 0.04
    lensGroup.add(rim, rimBrass)
    lensHit.position.set(0, 0, 0)
    lensGroup.add(lensHit)
    // the lens's axis (its local y) is turned to point along the tilt group's +x
    lensGroup.rotation.z = -Math.PI / 2
    tilt.add(lensGroup)
    face.renderOrder = back.renderOrder = 3
  }
  // the yoke's aim: yaw about y (the lens's axis toward +x at 0) and the tilt up
  const aimYaw = Math.atan2(-SUN.z, SUN.x)
  const aimPitch = Math.asin(SUN.y)
  const REST_YAW = aimYaw + 0.7
  const REST_PITCH = 0.12
  let lensYaw = REST_YAW
  let lensPitch = REST_PITCH
  // the cone of sunlight from the lens to the calx, and the dazzling point
  const coneTex = canvasTex(4, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, 'rgba(255,255,255,0.15)')
    grd.addColorStop(0.75, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,1)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(coneTex)
  const cone = new THREE.Mesh(new THREE.ConeGeometry(LENS_R * 0.95, 1, 48, 1, true), new THREE.MeshBasicMaterial({ map: coneTex, color: '#fff2c8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
  cone.renderOrder = 6
  cone.raycast = () => {}
  root.add(cone)
  const spot = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#fff6e0').multiplyScalar(3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  root.add(spot)
  // L: phase 0 the lens at rest, 1 heating the calx (age), 2 the gas caught, 3 the candle tried (age)
  const L = { phase: 0, age: 0 }
  let lensMine = false
  const lensPanel = lv => ({
    title: E.lens.title,
    color,
    blocks: [
      { buttons: [{ label: E.lens.buttons.aim, onClick: () => lensStep('lens') }, { label: E.lens.buttons.candle, onClick: () => lensStep('candle') }] },
      ...paras(E.lens.panel, lv),
    ],
  })
  function lensStep(what) {
    const lv = level()
    if (what === 'lens') {
      if (L.phase === 1) return say(at(E.lens.says.heating, lv))
      if (L.phase === 3 && L.age < 4) return say(at(W.busy, lv))
      if (L.phase === 2) return say(at(E.lens.says.caught, lv))
      L.phase = 1
      L.age = 0
      play('select')
      say(at(E.lens.says.aim, lv))
    } else if (what === 'candle') {
      if (L.phase === 0 || L.phase === 1) return say(at(E.lens.says.notYet, lv))
      if (L.phase === 3) return say(at(L.age < 4 ? W.busy : E.lens.says.bright, lv))
      L.phase = 3
      L.age = 0
      play('tap')
      ex.discover('lens', lensPanel, 4.5)
    } else return
    lensMine = true
    share('lens')
  }
  clickable(lensHit, () => lensStep('lens'), { reach: 6 })
  clickable(jar1, () => lensStep(L.phase === 2 ? 'candle' : 'lens'), { reach: 5 })
  clickable(pr1.hit, () => lensStep('candle'), { reach: 5 })
  ex.add({
    id: 'lens',
    x: 8.55,
    z: 0.6,
    radius: 1.8,
    manual: true,
    label: E.lens.label,
    verb: () => {
      const H = E.lens.hints
      if (L.phase === 1) return H.wait
      if (L.phase === 2) return H.candle
      if (L.phase === 3) return H.again
      return H.aim
    },
    focus: focusOf(9.6, 1.45, -1.25, 1.9, 2.6),
    act: () => ctx.showPanel(lensPanel),
  })
  let blazeSaid = false
  function poseLens(dt, t) {
    if (L.phase === 1 || L.phase === 3) L.age += dt
    if (L.phase === 1 && L.age >= HEAT1) {
      L.phase = 2
      L.age = 0
      if (lensMine) say(at(E.lens.says.caught, level()))
    }
    const heating = L.phase === 1
    const k = L.phase === 1 ? clamp(L.age / HEAT1) : L.phase >= 2 ? 1 : 0
    // the lens turns to the sun while it heats, and away once the calx is gone
    lensYaw = damp(lensYaw, heating ? aimYaw : REST_YAW, 3, dt)
    lensPitch = damp(lensPitch, heating ? aimPitch : REST_PITCH, 3, dt)
    yoke.rotation.y = lensYaw
    tilt.rotation.z = lensPitch
    const aimed = clamp(1 - (Math.abs(lensYaw - aimYaw) + Math.abs(lensPitch - aimPitch)) / 0.25)
    // the mercury in the jar goes down as the gas collects; the calx rides on it, shrinking
    const top = HG1 + JAR1.h - 0.012
    const level1 = top - (top - HG1 - 0.004) * ease(k)
    const inTrough = L.phase < 3
    hg1.visible = inTrough && level1 > HG1 + 0.006
    hg1.scale.y = Math.max(0.001, level1 - HG1)
    const left = 1 - span(0.1, 0.92, k)
    calx1.visible = inTrough && left > 0.02
    calx1.position.set(BASIN.x, level1 + 0.008, BASIN.z)
    calx1.scale.set(left, 0.38 * left, left)
    calxLens.emissiveIntensity = heating ? 0.4 + 0.5 * aimed : 0
    // the focused light
    const glow = heating ? aimed : 0
    cone.material.opacity = damp(cone.material.opacity, glow * 0.34, 6, dt)
    spot.material.opacity = damp(spot.material.opacity, glow, 6, dt)
    const target = calx1.visible ? calx1.position : FOCUS
    cone.visible = cone.material.opacity > 0.005
    if (cone.visible) {
      // the cone's tip (+y) at the target
      stretch(cone, LENS, target)
      cone.scale.set(1, LENS.distanceTo(target), 1)
    }
    spot.position.copy(target).y += 0.01
    spot.scale.setScalar(0.16 + Math.sin(t * 17) * 0.02)
    // the candle test
    const blaze = test1.pose(L.phase === 3 ? L.age : -1, 'bright', t)
    if (L.phase === 3 && blaze > 0.5 && !blazeSaid) {
      blazeSaid = true
      if (lensMine) say(at(E.lens.says.bright, level()))
      play('fizz', { order: 2 })
    }
    if (L.phase !== 3) blazeSaid = false
    return blaze > 0 ? { blaze, at: pr1.group.position } : null
  }
  const lensState = () => ({ phase: L.phase, age: round2(L.age) })
  const lensSet = (s, live, ago = 0) => {
    const phase = [0, 1, 2, 3].includes(s?.phase) ? s.phase : 0
    let age = Math.max(0, Number(s?.age) || 0) + Math.min(Number(ago) || 0, 3600)
    let p = phase
    if (p === 1 && age >= HEAT1) {
      p = 2
      age = 0
    }
    if (live && p === 1 && L.phase !== 1) play('select')
    L.phase = p
    L.age = p === 1 || p === 3 ? age : 0
    lensMine = false
    // a candle test that had blazed before this visitor came is not told again
    blazeSaid = p === 3 && L.age > 3.4
    if (!live) {
      const heating = p === 1
      lensYaw = heating ? aimYaw : REST_YAW
      lensPitch = heating ? aimPitch : REST_PITCH
    }
  }

  // ======== the back bench: the twelve days (Lavoisier's mercury and air) ========
  {
    const w = BENCH.x1 - BENCH.x0
    const g = table((BENCH.x0 + BENCH.x1) / 2, BENCH.z, w, BENCH.d, BENCH.top)
    // a shelf low down between the legs
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - 0.16, 0.03, BENCH.d - 0.12), mats.darkWood)
    shelf.position.y = 0.22
    g.add(shelf)
  }
  // the furnace (a round clay furnace with a door showing the coals) and the flask sitting in its mouth
  const furnace = new THREE.Group()
  const furnLight = new THREE.PointLight('#ff8a3a', 0, 2.6, 1.6)
  {
    const body = new THREE.Mesh(lathe([[0, 0], [FURN.r, 0], [FURN.r + 0.01, 0.03], [FURN.r, FURN.h - 0.04], [FURN.r + 0.02, FURN.h - 0.02], [FURN.r + 0.02, FURN.h], [FURN.r - 0.06, FURN.h], [FURN.r - 0.07, FURN.h - 0.03], [0, FURN.h - 0.03]], 28), clay)
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.08), coalMat)
    door.position.set(0, 0.1, FURN.r + 0.012)
    const coals = new THREE.Mesh(new THREE.CylinderGeometry(FURN.r - 0.075, FURN.r - 0.075, 0.03, 20), coalMat)
    coals.position.y = FURN.h - 0.045
    furnace.add(body, door, coals)
    furnace.position.set(FURN.x, BENCH.top, FURN.z)
    furnace.traverse(o => o.isMesh && (o.castShadow = true))
    root.add(furnace)
    furnLight.position.set(FURN.x, BENCH.top + FURN.h + 0.1, FURN.z + 0.5)
    root.add(furnLight)
  }
  const furnHit = new THREE.Mesh(new THREE.CylinderGeometry(FURN.r + 0.04, FURN.r + 0.04, FURN.h, 12), ghost)
  furnHit.position.set(FURN.x, BENCH.top + FURN.h / 2, FURN.z)
  root.add(furnHit)
  // the flask (Lavoisier's matras): a round body, its long neck bent over and down into the trough, opening
  // under the bell jar
  const flask = new THREE.Group()
  const specks = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 7), calxMat, 70)
  const flaskHit = new THREE.Mesh(new THREE.SphereGeometry(FLASK.r + 0.04, 12, 8), ghost)
  {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(FLASK.r, 28, 20), glassMat)
    bulb.renderOrder = 3
    // four ounces of mercury in its bottom
    const hgPool = new THREE.Mesh(new THREE.SphereGeometry(FLASK.r - 0.006, 24, 8, 0, TAU, Math.PI * 0.68, Math.PI * 0.32), mercury)
    const hgTop = new THREE.Mesh(new THREE.CircleGeometry((FLASK.r - 0.006) * Math.sin(Math.PI * 0.32), 24), mercury)
    hgTop.rotation.x = -Math.PI / 2
    hgTop.position.y = -(FLASK.r - 0.006) * Math.cos(Math.PI * 0.32)
    flask.add(bulb, hgPool, hgTop)
    specks.position.y = hgTop.position.y + 0.001
    specks.count = 70
    flask.add(specks)
    flask.position.set(FLASK.x, FLASK.y, FLASK.z)
    root.add(flask)
    flaskHit.position.copy(flask.position)
    root.add(flaskHit)
    const neck = new THREE.CatmullRomCurve3([
      new THREE.Vector3(FLASK.x + 0.03, FLASK.y + FLASK.r - 0.01, FLASK.z),
      new THREE.Vector3(FLASK.x + 0.12, FLASK.y + 0.38, FLASK.z),
      new THREE.Vector3(FLASK.x + 0.45, FLASK.y + 0.5, FLASK.z),
      new THREE.Vector3(-0.55, FLASK.y + 0.42, FLASK.z),
      new THREE.Vector3(-0.36, HG2 + 0.18, FLASK.z),
      new THREE.Vector3(-0.28, HG2 - 0.02, FLASK.z),
      new THREE.Vector3(-0.12, HG2 - 0.035, FLASK.z),
      new THREE.Vector3(BELL.x - 0.02, HG2 + 0.02, FLASK.z),
      new THREE.Vector3(BELL.x, HG2 + 0.08, FLASK.z),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(neck, 120, 0.014, 10, false), glassMat)
    tube.renderOrder = 3
    root.add(tube)
    // where each red speck sits on the mercury and when it appears (the same on every screen)
    const rr = (FLASK.r - 0.012) * Math.sin(Math.PI * 0.32)
    specks.userData.spots = Array.from({ length: 70 }, (_, i) => {
      const a = hash(41, i) * TAU
      const d = Math.sqrt(hash(41, i, 1)) * rr
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, from: 1 + 4.5 * hash(41, i, 2), r: 0.008 + 0.012 * hash(41, i, 3) }
    })
  }
  // the trough of mercury, the bell jar over the neck's end, the small jar beside it
  {
    const len = TROUGH.x1 - TROUGH.x0
    const trough = new THREE.Group()
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#8f8a80', roughness: 0.45 })
    const wall = 0.025
    for (const [w, h, d, x, y, z] of [
      [len, wall, TROUGH.w, 0, wall / 2, 0],
      [len, TROUGH.h, wall, 0, TROUGH.h / 2, -(TROUGH.w - wall) / 2],
      [len, TROUGH.h, wall, 0, TROUGH.h / 2, (TROUGH.w - wall) / 2],
      [wall, TROUGH.h, TROUGH.w, -(len - wall) / 2, TROUGH.h / 2, 0],
      [wall, TROUGH.h, TROUGH.w, (len - wall) / 2, TROUGH.h / 2, 0],
    ]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stoneMat)
      m.position.set(x, y, z)
      m.castShadow = m.receiveShadow = true
      trough.add(m)
    }
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(len - 2 * wall, TROUGH.w - 2 * wall), mercury)
    pool.rotation.x = -Math.PI / 2
    pool.position.y = HG2 - BENCH.top
    trough.add(pool)
    trough.position.set((TROUGH.x0 + TROUGH.x1) / 2, BENCH.top, TROUGH.z)
    root.add(trough)
  }
  const bell = new THREE.Group()
  {
    const g = new THREE.Mesh(lathe([[BELL.r, 0], [BELL.r, -BELL.h * 0.62], [BELL.r * 0.9, -BELL.h * 0.86], [BELL.r * 0.5, -BELL.h * 0.98], [0.035, -BELL.h], [0, -BELL.h]], 36), glassMat)
    g.renderOrder = 3
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 10), glassMat)
    knob.position.y = -BELL.h - 0.02
    knob.renderOrder = 3
    // the slip of paper pasted on at the mercury's first height
    const slip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.014, 0.003), paperMat)
    slip.position.set(0, -BELL.lift0, -(BELL.r + 0.003))
    bell.add(g, knob, slip)
    root.add(bell)
  }
  const hgBell = new THREE.Mesh(new THREE.CylinderGeometry(BELL.r - 0.004, BELL.r - 0.004, 1, 36).translate(0, 0.5, 0), mercury)
  hgBell.position.set(BELL.x, HG2, TROUGH.z)
  root.add(hgBell)
  const small = new THREE.Group()
  {
    const g = new THREE.Mesh(lathe([[SMALL.r, 0], [SMALL.r, -SMALL.h + 0.02], [SMALL.r * 0.8, -SMALL.h + 0.004], [0, -SMALL.h]], 28), glassMat)
    g.renderOrder = 3
    small.add(g)
    root.add(small)
  }
  const hgSmall = new THREE.Mesh(new THREE.CylinderGeometry(SMALL.r - 0.004, SMALL.r - 0.004, 1, 24).translate(0, 0.5, 0), mercury)
  hgSmall.position.set(SMALL.x, HG2, TROUGH.z)
  root.add(hgSmall)
  // the small retort on its little furnace, for heating the red crust; its neck runs under the small jar
  const retort2 = new THREE.Group()
  const lamp2 = new THREE.Group()
  const lampFlame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#9ec8ff').multiplyScalar(2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  const powder2 = new THREE.Mesh(new THREE.SphereGeometry(RETORT2.r * 0.62, 16, 8, 0, TAU, Math.PI * 0.6, Math.PI * 0.4), calxRetort)
  const drops2 = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), mercury, 9)
  const retortHit = new THREE.Mesh(new THREE.SphereGeometry(RETORT2.r + 0.06, 12, 8), ghost)
  {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 18), clay)
    stand.position.set(RETORT2.x, BENCH.top + 0.09, RETORT2.z)
    const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 20), mats.iron)
    ringTop.rotation.x = Math.PI / 2
    ringTop.position.set(RETORT2.x, BENCH.top + 0.19, RETORT2.z)
    root.add(stand, ringTop)
    lampFlame.center.set(0.5, 0.1)
    lampFlame.position.set(RETORT2.x, BENCH.top + 0.18, RETORT2.z + 0.11)
    lampFlame.scale.set(0.035, 0.08, 1)
    lamp2.add(lampFlame)
    root.add(lamp2)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(RETORT2.r, 24, 16), glassMat)
    bulb.renderOrder = 3
    retort2.add(bulb, powder2)
    retort2.position.set(RETORT2.x, BENCH.top + 0.19 + RETORT2.r * 0.8, RETORT2.z)
    root.add(retort2)
    retortHit.position.copy(retort2.position)
    root.add(retortHit)
    const neck = new THREE.CatmullRomCurve3([
      new THREE.Vector3(RETORT2.x - RETORT2.r * 0.7, retort2.position.y + RETORT2.r * 0.5, RETORT2.z),
      new THREE.Vector3(1.5, retort2.position.y + 0.14, RETORT2.z),
      new THREE.Vector3(1.26, HG2 + 0.12, TROUGH.z),
      new THREE.Vector3(1.07, HG2 - 0.015, TROUGH.z),
      new THREE.Vector3(0.9, HG2 - 0.025, TROUGH.z),
      new THREE.Vector3(SMALL.x, HG2 + 0.02, TROUGH.z),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(neck, 80, 0.009, 8, false), glassMat)
    tube.renderOrder = 3
    root.add(tube)
    drops2.userData.curve = neck
    drops2.frustumCulled = false
    root.add(drops2)
  }
  // the two tapers on the bench, and the spots where the jars are set down
  const prA = probe()
  const prB = probe()
  const REST_A = new THREE.Vector3(-0.42, BENCH.top, BENCH.z + 0.36)
  const REST_B = new THREE.Vector3(2.3, BENCH.top, BENCH.z + 0.32)
  const testA = jarTest({ jar: bell, r: BELL.r, h: BELL.h, trough: new THREE.Vector3(BELL.x, HG2, TROUGH.z), bench: new THREE.Vector3(-0.95, BENCH.top, BENCH.z + 0.26), pr: prA, rest: REST_A, dip: 0.36, lift: 0.4 })
  const testB = jarTest({ jar: small, r: SMALL.r, h: SMALL.h, trough: new THREE.Vector3(SMALL.x, HG2, TROUGH.z), bench: new THREE.Vector3(1.4, BENCH.top, BENCH.z + 0.28), pr: prB, rest: REST_B, dip: 0.2 })
  // the slate above the bench: the day and the air
  const slate = new THREE.Group()
  {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.86, 0.05), mats.wood)
    const face = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.74, 0.02), new THREE.MeshStandardMaterial({ color: '#2c3133', roughness: 0.95 }))
    face.position.z = 0.02
    slate.add(frame, face)
    slate.position.set(0.25, 2.25, ROOM.z0 + 0.08)
    root.add(slate)
  }
  const slateDay = makeText('', { size: 0.15, color: '#f2efe2', anchorY: 'middle', maxWidth: 1.5 })
  slateDay.position.set(0, 0.17, 0.035)
  const slateAir = makeText('', { size: 0.105, color: '#ffd9a8', anchorY: 'middle', maxWidth: 1.5 })
  slateAir.position.set(0, -0.12, 0.035)
  slate.add(slateDay, slateAir)
  let slateShown = ''
  // D: day (0..12), fire (the furnace lit), testA (the candle in the leftover air), crust (the red crust
  // heated), testB (the candle in the air from the crust): seconds since each began, -1 not yet
  const D = { day: 0, fire: 0, testA: -1, crust: -1, testB: -1 }
  let daysMine = false
  let dayTold = false
  const daysPanel = lv => ({
    title: E.days.title,
    color,
    blocks: [
      { slider: { label: E.days.slider, min: 0, max: 12, step: 0.1, value: D.day, onInput: v => setDay(v), format: v => fill(E.days.board.day, { d: nf(Math.floor(v + 1e-6)) }), live: () => D.day } },
      {
        buttons: [
          { label: D.day >= 12 ? E.days.buttons.again : D.fire ? E.days.buttons.stop : E.days.buttons.fire, onClick: () => daysStep('furnace') },
          { label: E.days.buttons.taper, onClick: () => daysStep('taper') },
          { label: E.days.buttons.crust, onClick: () => daysStep('crust') },
          { label: E.days.buttons.taper2, onClick: () => daysStep('taper2') },
        ],
      },
      ...paras(E.days.panel, lv),
    ],
  })
  const resetTests = () => {
    D.testA = -1
    D.crust = -1
    D.testB = -1
  }
  function daysStep(what) {
    const lv = level()
    const S = E.days.says
    if (what === 'furnace') {
      if (D.day >= 12 && D.testB >= 0 && D.testB < 4) return say(at(W.busy, lv))
      if (D.day >= 12) {
        // all over: a fresh flask of mercury, a fresh bell jar of air
        D.day = 0
        resetTests()
        D.fire = 1
        dayTold = false
        play('select')
        say(at(S.again, lv))
      } else {
        D.fire = D.fire ? 0 : 1
        play(D.fire ? 'select' : 'tap')
        say(at(D.fire ? S.fire : S.stop, lv))
      }
    } else if (what === 'taper') {
      if (D.day < 12) return say(at(S.early, lv))
      if (D.testA >= 0) return say(at(D.testA < 4 ? W.busy : S.out, lv))
      D.testA = 0
      play('tap')
    } else if (what === 'crust') {
      if (D.day < 12) return say(at(S.early, lv))
      if (D.crust >= 0) return say(at(D.crust < CRUST_T ? W.busy : S.crust, lv))
      D.crust = 0
      play('select')
      say(at(S.heat, lv))
    } else if (what === 'taper2') {
      if (D.crust < CRUST_T) return say(at(D.day < 12 ? S.early : S.noCrust, lv))
      if (D.testB >= 0) return say(at(D.testB < 4 ? W.busy : S.bright, lv))
      D.testB = 0
      play('tap')
    } else return
    daysMine = true
    share('days')
  }
  // the slider: the days go by by hand (the furnace keeps its state)
  let daySend = null
  function setDay(v) {
    const d = clamp(Number(v) || 0, 0, 12)
    if (Math.abs(d - D.day) < 1e-4) return
    D.day = d
    if (d < 12) resetTests()
    daysMine = true
    if (!daySend) {
      daySend = setTimeout(() => {
        daySend = null
        share('days')
      }, 250)
    }
  }
  clickable(furnHit, () => daysStep('furnace'))
  clickable(flaskHit, () => daysStep(D.day >= 12 && D.crust < 0 ? 'crust' : 'furnace'))
  clickable(bell, () => daysStep('taper'), { when: () => D.day >= 12 })
  clickable(prA.hit, () => daysStep('taper'))
  clickable(retortHit, () => daysStep('crust'))
  clickable(small, () => daysStep(D.crust >= CRUST_T ? 'taper2' : 'crust'), { when: () => D.day >= 12 })
  clickable(prB.hit, () => daysStep('taper2'))
  ex.add({
    id: 'days',
    x: 0.2,
    z: -4.35,
    radius: 1.9,
    manual: true,
    label: E.days.label,
    verb: () => {
      const H = E.days.hints
      if (D.day < 12) return D.fire ? H.burning : H.fire
      if (D.testA < 0) return H.taper
      if (D.crust < 0) return H.crust
      if (D.crust < CRUST_T) return H.wait
      if (D.testB < 0) return H.taper2
      return H.again
    },
    focus: focusOf(0.15, 1.3, -5.95, 1.7, 4.6),
    act: () => ctx.showPanel(daysPanel),
  })
  let outSaid = false
  let brightSaid = false
  let crustSaid = false
  function poseDays(dt, t) {
    if (D.fire && D.day < 12) {
      D.day = Math.min(12, D.day + dt / DAY)
      if (D.day >= 12) {
        // Lavoisier put the fire out after twelve days: the crust had stopped growing
        D.fire = 0
      }
    }
    if (D.day >= 12 && !dayTold) {
      dayTold = true
      if (daysMine) {
        say(at(E.days.says.done, level()))
        ex.discover('days', daysPanel, 2.5)
      }
    }
    if (D.day < 12) dayTold = false
    if (D.testA >= 0) D.testA += dt
    if (D.crust >= 0) D.crust += dt
    if (D.testB >= 0) D.testB += dt
    // the furnace glows while it burns
    const burn = D.fire ? 1 : 0
    coalMat.emissiveIntensity = damp(coalMat.emissiveIntensity, burn * (1.6 + Math.sin(t * 7) * 0.2 + Math.sin(t * 3.1) * 0.15), 4, dt)
    furnLight.intensity = coalMat.emissiveIntensity * (light ? 0.6 : 1.1)
    // the red specks on the mercury: from the second day, growing for four or five days, then no more;
    // gathered up when the crust is heated
    const taken = D.crust >= 0 ? 1 - span(0, 0.6, D.crust) : 1
    specks.userData.spots.forEach((s, i) => {
      const g = clamp((D.day - s.from) / 2.2) * taken
      dummy.position.set(s.x, specks.position.y, s.z)
      dummy.rotation.set(0, i, 0)
      dummy.scale.set(s.r * g + 1e-5, 0.004 * g + 1e-5, s.r * g + 1e-5)
      dummy.position.y = 0
      dummy.updateMatrix()
      specks.setMatrixAt(i, dummy.matrix)
    })
    specks.instanceMatrix.needsUpdate = true
    // the air under the bell jar shrinks: the mercury rises inside it
    const lost = span(1, 7.5, D.day)
    const inBell = D.testA < 0
    hgBell.visible = inBell
    hgBell.scale.y = BELL.lift0 + BELL.rise * lost
    testA.pose(D.testA, 'out', t)
    if (D.testA > 3.4 && !outSaid) {
      outSaid = true
      if (daysMine) say(at(E.days.says.out, level()))
    }
    if (D.testA < 0) outSaid = false
    // the red crust in the small retort: it reddens, darkens and is gone; mercury runs down the neck and
    // the air comes back into the small jar
    const c = D.crust
    powder2.visible = c >= 0.6 && c < CRUST_T - 0.6
    const burnt = span(1.6, CRUST_T - 1.0, c)
    powder2.scale.setScalar(Math.max(0.01, 1 - burnt))
    calxRetort.emissiveIntensity = 0.9 * span(1.2, 2.6, c)
    lamp2.visible = c >= 0.8 && c < CRUST_T
    lampFlame.scale.set(0.035 * (1 + Math.sin(t * 19) * 0.08), 0.085 * (1 + Math.sin(t * 13) * 0.1), 1)
    const gas = c < 0 ? 0 : span(1.8, CRUST_T - 0.3, c)
    hgSmall.visible = D.testB < 0
    hgSmall.scale.y = Math.max(0.001, (SMALL.h - 0.015) * (1 - gas * 0.92))
    const curve = drops2.userData.curve
    for (let i = 0; i < 9; i++) {
      const u = c < 1.8 ? -1 : ((c - 1.8) * 0.35 + i / 9) % 1
      const on = c >= 1.8 && c < CRUST_T + 2 && u >= 0
      curve.getPointAt(clamp(0.05 + u * 0.55), tmpV)
      dummy.position.copy(tmpV)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(on ? 0.005 : 0.00001)
      dummy.updateMatrix()
      drops2.setMatrixAt(i, dummy.matrix)
    }
    drops2.instanceMatrix.needsUpdate = true
    if (c >= CRUST_T && !crustSaid) {
      crustSaid = true
      if (daysMine) say(at(E.days.says.crust, level()))
    }
    if (c < 0) crustSaid = false
    const blaze = testB.pose(D.testB, 'bright', t)
    if (blaze > 0.5 && !brightSaid) {
      brightSaid = true
      play('fizz', { order: 2 })
      if (daysMine) say(at(E.days.says.bright, level()))
    }
    if (D.testB < 0) brightSaid = false
    // the slate
    const line = `${fill(E.days.board.day, { d: nf(Math.floor(D.day + 1e-6)) })}|${fill(E.days.board.air, { v: nf(air(D.day), 1) })}`
    if (line !== slateShown) {
      slateShown = line
      const [a, b] = line.split('|')
      slateDay.text = a
      slateAir.text = b
      slateDay.sync()
      slateAir.sync()
    }
    return blaze > 0 ? { blaze, at: prB.group.position } : null
  }
  const daysState = () => ({ day: round2(D.day), fire: D.fire, testA: round2(D.testA), crust: round2(D.crust), testB: round2(D.testB) })
  const daysSet = (s, live, ago = 0) => {
    const run = Math.min(Number(ago) || 0, 3600)
    const num = v => (Number.isFinite(Number(v)) ? Number(v) : -1)
    D.fire = s?.fire ? 1 : 0
    D.day = clamp(Number(s?.day) || 0, 0, 12)
    if (D.fire) {
      D.day = Math.min(12, D.day + run / DAY)
      if (D.day >= 12) D.fire = 0
    }
    const later = v => (num(v) >= 0 ? num(v) + run : -1)
    D.testA = later(s?.testA)
    D.crust = later(s?.crust)
    D.testB = later(s?.testB)
    daysMine = false
    if (live) play(D.fire ? 'select' : 'tap')
    // what happened before this visitor came is not told again
    dayTold = D.day >= 12
    outSaid = D.testA > 3.4
    crustSaid = D.crust >= CRUST_T
    brightSaid = D.testB > 3.4
  }

  // ======== the left wall: the great balance and the tin sealed in its flask ========
  table(BT.x, (BT.z0 + BT.z1) / 2, BT.d, BT.z1 - BT.z0, BT.top)
  const beam = new THREE.Group()
  const panR = new THREE.Group() // the flask's pan (+z)
  const panW = new THREE.Group() // the weights' pan (-z)
  const pointer = new THREE.Group()
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.06, 0.62, 2, 0.015), mats.darkWood)
    base.position.set(BAL.x, BT.top + 0.03, BAL.z)
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, BAL.pivot - BT.top - 0.04, 12), brassEnv)
    pillar.position.set(BAL.x, (BAL.pivot + BT.top) / 2, BAL.z)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.08), brassEnv)
    cap.position.set(BAL.x, BAL.pivot + 0.01, BAL.z)
    // the scale behind the pointer's tip
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 6, 24, 0.7), brassEnv)
    arc.rotation.set(0, Math.PI / 2, -Math.PI / 2 - 0.35)
    arc.position.set(BAL.x + 0.02, BAL.pivot - 0.82 + 0.17 + 0.03, BAL.z)
    const zero = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.035, 0.006), new THREE.MeshStandardMaterial({ color: '#2a2a2a' }))
    zero.position.set(BAL.x + 0.03, BAL.pivot - 0.66, BAL.z)
    root.add(base, pillar, cap, arc, zero)
    // the beam, along z, with knife edges at its ends
    const bar = new THREE.Mesh(lathe([[0.006, -BAL.arm], [0.016, -BAL.arm * 0.6], [0.03, 0], [0.016, BAL.arm * 0.6], [0.006, BAL.arm]], 10), brassEnv)
    bar.rotation.x = Math.PI / 2
    beam.add(bar)
    for (const s of [-1, 1]) {
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), brassEnv)
      end.position.z = s * BAL.arm
      beam.add(end)
    }
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.006, 0.66, 6), mats.iron)
    needle.position.y = -0.33
    pointer.add(needle)
    beam.add(pointer)
    beam.position.set(BAL.x, BAL.pivot, BAL.z)
    root.add(beam)
    // the pans hang from the beam's ends on three cords each
    for (const pan of [panR, panW]) {
      const dish = new THREE.Mesh(lathe([[0, 0], [0.13, 0.006], [0.15, 0.03], [0.145, 0.032], [0.125, 0.01], [0, 0.004]], 28), brassEnv)
      pan.add(dish)
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 1, 4), mats.iron)
        stretch(cord, new THREE.Vector3(Math.cos(a) * 0.14, 0.03, Math.sin(a) * 0.14), new THREE.Vector3(0, BAL.hang, 0))
        pan.add(cord)
      }
      root.add(pan)
    }
    // brass weights on their pan
    const wts = [[0, 0, 0.03, 0.05], [0.055, 0.03, 0.022, 0.04], [-0.05, 0.035, 0.018, 0.032], [0.02, -0.06, 0.014, 0.025]]
    for (const [x, z, r, hh] of wts) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, hh, 14), brassEnv)
      w.position.set(x, 0.006 + hh / 2, z)
      const knob = new THREE.Mesh(new THREE.SphereGeometry(r * 0.45, 10, 6), brassEnv)
      knob.position.set(x, 0.006 + hh + r * 0.3, z)
      panW.add(w, knob)
    }
  }
  // the flask with its tin: a round body and a neck sealed at the tip; heated, the tin melts and a grey
  // powder grows on it
  const tinFlask = new THREE.Group()
  const tinMat = new THREE.MeshStandardMaterial({ color: '#d4d8dc', roughness: 0.2, metalness: 0.95, envMap: env, envMapIntensity: 1.3 })
  const ashMat = new THREE.MeshStandardMaterial({ color: '#55534f', roughness: 0.95 })
  const tin = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 10), tinMat)
  const ash = new THREE.Mesh(new THREE.SphereGeometry(0.046, 18, 10), ashMat)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), glassMat)
  const tipHit = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), ghost)
  const glowMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ff8a3a').multiplyScalar(1.5), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const TIP = new THREE.Vector3(0, 0.3, -0.06)
  {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), glassMat)
    bulb.position.y = 0.085
    bulb.renderOrder = 3
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.22, 10), glassMat)
    neck.renderOrder = 3
    const NECK0 = new THREE.Vector3(0, 0.155, -0.01)
    neck.geometry = new THREE.CylinderGeometry(0.008, 0.02, NECK0.distanceTo(TIP), 10)
    stretch(neck, NECK0, TIP)
    neck.scale.set(1, 1, 1)
    tip.position.copy(TIP)
    tip.renderOrder = 3
    tipHit.position.copy(TIP)
    tin.position.y = 0.035
    tin.scale.set(1, 0.55, 1)
    ash.position.copy(tin.position)
    ash.scale.set(1, 0.55, 1)
    const glow = new THREE.Sprite(glowMat)
    glow.position.y = 0.03
    glow.scale.setScalar(0.28)
    tinFlask.add(bulb, neck, tip, tipHit, tin, ash, glow)
    tinFlask.scale.setScalar(1.25)
    root.add(tinFlask)
  }
  // the brazier beside the balance
  const brazLight = new THREE.PointLight('#ff8a3a', 0, 2.4, 1.6)
  {
    const pot = new THREE.Mesh(lathe([[0, 0], [BRAZ.r * 0.7, 0], [BRAZ.r, BRAZ.h * 0.6], [BRAZ.r + 0.015, BRAZ.h], [BRAZ.r - 0.02, BRAZ.h], [0, BRAZ.h - 0.04]], 24), clay)
    pot.position.set(BRAZ.x, BT.top, BRAZ.z)
    const coals = new THREE.Mesh(new THREE.CylinderGeometry(BRAZ.r - 0.03, BRAZ.r - 0.04, 0.03, 18), brazCoal)
    coals.position.set(BRAZ.x, BT.top + BRAZ.h - 0.03, BRAZ.z)
    const grid = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 6, 18), mats.iron)
    grid.rotation.x = Math.PI / 2
    grid.position.set(BRAZ.x, BT.top + BRAZ.h + 0.005, BRAZ.z)
    root.add(pot, coals, grid)
    brazLight.position.set(BRAZ.x + 0.4, BT.top + BRAZ.h + 0.4, BRAZ.z)
    root.add(brazLight)
  }
  // the air rushing in at the broken tip
  const RUSH = light ? 14 : 26
  const rushPos = new Float32Array(RUSH * 3)
  const rushGeo = new THREE.BufferGeometry()
  rushGeo.setAttribute('position', new THREE.BufferAttribute(rushPos, 3))
  const rush = new THREE.Points(rushGeo, new THREE.PointsMaterial({ map: soft, color: '#ffffff', size: 0.025, transparent: true, opacity: 0, depthWrite: false }))
  rush.frustumCulled = false
  rush.raycast = () => {}
  root.add(rush)
  const shard = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), glassMat)
  root.add(shard)
  // B: heat (seconds since the flask was taken to be heated, -1 not yet), open (seconds since its tip was
  // broken, -1 sealed), n (flasks used)
  const B = { heat: -1, open: -1, n: 0 }
  let balMine = false
  let backSaid = false
  let openSaid = false
  const balancePanel = lv => ({
    title: E.balance.title,
    color,
    blocks: [
      { buttons: [{ label: E.balance.buttons.heat, onClick: () => balanceStep('flask') }, { label: E.balance.buttons.open, onClick: () => balanceStep('tip') }] },
      ...paras(E.balance.panel, lv),
    ],
  })
  function balanceStep(what) {
    const lv = level()
    const S = E.balance.says
    if (what === 'flask') {
      if (B.heat >= 0 && B.heat < HEAT3) return say(at(W.busy, lv))
      if (B.open >= 0 && B.open < 2.5) return say(at(W.busy, lv))
      if (B.heat >= HEAT3 && B.open < 0) return say(at(S.tipFirst, lv))
      if (B.open >= 0) {
        // a new flask with fresh tin
        B.heat = -1
        B.open = -1
        B.n++
        play('tap')
        say(at(S.fresh, lv))
      } else {
        B.heat = 0
        play('select')
        say(at(S.off, lv))
      }
    } else if (what === 'tip') {
      if (B.heat < 0) return say(at(S.heatFirst, lv))
      if (B.heat < HEAT3) return say(at(W.busy, lv))
      if (B.open >= 0) return say(at(B.open < 2.5 ? W.busy : S.open, lv))
      B.open = 0
      play('fizz', { order: 1 })
    } else return
    balMine = true
    share('balance')
  }
  clickable(tinFlask, hit => balanceStep(hit.object === tipHit && B.heat >= HEAT3 ? 'tip' : 'flask'))
  ex.add({
    id: 'balance',
    x: -4.25,
    z: -1.55,
    radius: 1.8,
    manual: true,
    label: E.balance.label,
    verb: () => {
      const H = E.balance.hints
      if (B.heat < 0) return H.heat
      if (B.heat < HEAT3) return H.wait
      if (B.open < 0) return H.open
      return H.again
    },
    focus: focusOf(-6.0, 1.4, -1.5, 1.55, 2.9),
    act: () => ctx.showPanel(balancePanel),
  })
  let theta = 0
  let omega = 0
  const ON_PAN = new THREE.Vector3()
  const ON_FIRE = new THREE.Vector3(BRAZ.x, BT.top + BRAZ.h + 0.005, BRAZ.z)
  function poseBalance(dt, t) {
    if (B.heat >= 0) B.heat += dt
    if (B.open >= 0) B.open += dt
    const h = B.heat
    const off = h >= 0 && h < HEAT3 - 0.15
    // the beam: level with the flask on its pan; tipped toward the weights while it is off; heavier on the
    // flask's side once the air has rushed in
    const want = off ? -0.16 : B.open >= 0 ? 0.08 * span(0.2, 1.4, B.open) : 0
    // a damped swing toward it
    omega += ((want - theta) * 26 - omega * 4.2) * dt
    theta += omega * dt
    beam.rotation.x = theta
    pointer.rotation.x = 0
    const endR = new THREE.Vector3(0, 0, BAL.arm).applyEuler(beam.rotation).add(beam.position)
    const endW = new THREE.Vector3(0, 0, -BAL.arm).applyEuler(beam.rotation).add(beam.position)
    panR.position.copy(endR).setY(endR.y - BAL.hang)
    panW.position.copy(endW).setY(endW.y - BAL.hang)
    ON_PAN.copy(panR.position).setY(panR.position.y + 0.008)
    // the flask: off the pan, over to the brazier, heated, and back
    const go = span(0, 1.0, h)
    const back = span(HEAT3 - 1.0, HEAT3, h)
    const k = h < 0 ? 0 : go * (1 - back)
    tinFlask.position.lerpVectors(ON_PAN, ON_FIRE, k)
    tinFlask.position.y += Math.sin(Math.PI * k) * 0.25
    tinFlask.rotation.y = Math.PI
    const hot = h < 0 ? 0 : span(1.0, 1.8, h) * (1 - span(HEAT3 - 1.2, HEAT3 - 0.6, h))
    brazCoal.emissiveIntensity = 0.6 + hot * 1.4 + Math.sin(t * 6) * 0.08
    brazLight.intensity = damp(brazLight.intensity, (0.5 + hot * 1.6) * (light ? 0.6 : 1), 4, dt)
    glowMat.opacity = hot * 0.55
    // the tin melts round and a grey powder spreads on it
    const melt = h < 0 ? 0 : span(1.6, 3.0, h)
    tin.scale.set(1 + 0.15 * melt, 0.55 - 0.15 * melt, 1 + 0.15 * melt)
    const grey = h < 0 ? 0 : span(2.6, HEAT3 - 1.2, h)
    ash.visible = grey > 0.02
    ash.scale.set((1 + 0.15 * melt) * (0.96 + 0.08 * grey), (0.55 - 0.15 * melt) * (0.96 + 0.1 * grey), (1 + 0.15 * melt) * (0.96 + 0.08 * grey))
    ashMat.opacity = 1
    // the tip broken: a bead of glass flies off, air streams in
    const o = B.open
    tip.visible = o < 0
    shard.visible = o >= 0 && o < 0.8
    if (shard.visible) {
      tinFlask.updateMatrixWorld()
      const p0 = tinFlask.localToWorld(TIP.clone())
      shard.position.set(p0.x + o * 0.25, p0.y + o * 0.5 - 2.5 * o * o, p0.z + o * 0.1)
    }
    rush.material.opacity = o >= 0 ? 0.85 * (1 - span(1.1, 1.6, o)) : 0
    if (rush.material.opacity > 0.01) {
      tinFlask.updateMatrixWorld()
      const p0 = tinFlask.localToWorld(TIP.clone())
      for (let i = 0; i < RUSH; i++) {
        const u = (o * 1.6 + i / RUSH) % 1
        const a = hash(7, i) * TAU
        const rr = (1 - u) * 0.16
        rushPos.set([p0.x + Math.cos(a) * rr, p0.y + (1 - u) * 0.1 + Math.sin(a) * rr * 0.5, p0.z + Math.sin(a) * rr], i * 3)
      }
      rushGeo.attributes.position.needsUpdate = true
    }
    if (h >= HEAT3 && !backSaid) {
      backSaid = true
      if (balMine) say(at(E.balance.says.back, level()))
    }
    if (h < 0) backSaid = false
    if (o > 1.6 && !openSaid) {
      openSaid = true
      if (balMine) {
        say(at(E.balance.says.open, level()))
        ex.discover('balance', balancePanel, 2.5)
      }
    }
    if (o < 0) openSaid = false
  }
  const balanceState = () => ({ heat: round2(B.heat), open: round2(B.open), n: B.n })
  const balanceSet = (s, live, ago = 0) => {
    const run = Math.min(Number(ago) || 0, 3600)
    const later = v => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) + run : -1)
    const wasHeat = B.heat
    B.heat = later(s?.heat)
    B.open = B.heat >= HEAT3 ? later(s?.open) : -1
    B.n = Math.max(0, Math.round(Number(s?.n) || 0))
    balMine = false
    if (live) play(B.open >= 0 && B.open < 1 ? 'fizz' : wasHeat < 0 && B.heat >= 0 ? 'select' : 'tap')
    backSaid = B.heat >= HEAT3
    openSaid = B.open > 1.6
    if (!live) {
      const off = B.heat >= 0 && B.heat < HEAT3 - 0.15
      theta = off ? -0.16 : B.open >= 0 ? 0.08 * span(0.2, 1.4, B.open) : 0
      omega = 0
    }
  }

  // ======== Marie-Anne Lavoisier's drawing table by the window ========
  table(MT.x, MT.z, MT.w, MT.d, MT.top)
  const SHEET = { w: 0.56, h: 0.42 }
  const drawTex = canvasTex(1024, 768, () => {}, { mipmaps: true })
  textures.push(drawTex)
  // three plates in the manner of an engraving: the lens, the twelve days, the balance (no words: the
  // plates in the Traité were drawn and engraved by her; these are only pictures of the room's apparatus)
  function drawPlate(page) {
    drawTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#f1e8d2'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#2e1e10'
      g.fillStyle = '#2e1e10'
      g.lineCap = 'round'
      g.lineJoin = 'round'
      g.lineWidth = 3
      g.strokeRect(40, 40, w - 80, h - 80)
      g.lineWidth = 1.2
      g.strokeRect(52, 52, w - 104, h - 104)
      const rnd = random(5 + page)
      const hatch = (x0, y0, x1, y1, gap = 7, slope = 0.6) => {
        g.save()
        g.beginPath()
        g.rect(x0, y0, x1 - x0, y1 - y0)
        g.clip()
        g.lineWidth = 2
        for (let x = x0 - (y1 - y0); x < x1; x += gap) {
          g.beginPath()
          g.moveTo(x, y1)
          g.lineTo(x + (y1 - y0) * slope, y0)
          g.stroke()
        }
        g.restore()
      }
      g.lineWidth = 5
      if (page === 0) {
        // the great lens on its carriage, rays to a jar on a table
        g.beginPath()
        g.ellipse(640, 300, 46, 150, -0.25, 0, TAU)
        g.stroke()
        g.beginPath()
        g.ellipse(640, 300, 34, 138, -0.25, 0, TAU)
        g.stroke()
        g.strokeRect(600, 470, 160, 22)
        for (const x of [620, 740]) {
          g.beginPath()
          g.arc(x, 510, 26, 0, TAU)
          g.stroke()
        }
        g.beginPath()
        g.moveTo(640, 450)
        g.lineTo(640, 470)
        g.stroke()
        g.lineWidth = 1
        for (let k = -4; k <= 4; k++) {
          g.beginPath()
          g.moveTo(640 + k * 6, 300 + k * 30)
          g.lineTo(330, 392)
          g.stroke()
        }
        g.lineWidth = 5
        // the table, the basin, the jar
        g.strokeRect(220, 470, 230, 16)
        g.beginPath()
        g.moveTo(240, 486)
        g.lineTo(240, 600)
        g.moveTo(430, 486)
        g.lineTo(430, 600)
        g.stroke()
        g.beginPath()
        g.ellipse(330, 462, 70, 10, 0, 0, TAU)
        g.stroke()
        g.strokeRect(306, 370, 48, 92)
        hatch(306, 420, 354, 462, 5, 0.4)
        g.beginPath()
        g.ellipse(330, 380, 14, 5, 0, 0, TAU)
        g.fill()
        // the sun's rays from the corner
        g.lineWidth = 1.2
        for (let k = 0; k < 9; k++) {
          const a = 2.3 + k * 0.12
          g.beginPath()
          g.moveTo(w - 70 + Math.cos(a) * 30, 90 + Math.sin(a) * 30)
          g.lineTo(w - 70 + Math.cos(a) * 80, 90 + Math.sin(a) * 80)
          g.stroke()
        }
      } else if (page === 1) {
        // the furnace, the flask with its long neck, the trough and the bell jar (as in plate IV)
        g.strokeRect(150, 380, 180, 200)
        hatch(150, 380, 330, 580, 8)
        g.beginPath()
        g.arc(240, 340, 70, 0, TAU)
        g.stroke()
        g.beginPath()
        g.moveTo(260, 272)
        g.bezierCurveTo(290, 160, 520, 150, 560, 300)
        g.lineTo(590, 440)
        g.moveTo(276, 276)
        g.bezierCurveTo(300, 178, 506, 172, 546, 300)
        g.lineTo(574, 440)
        g.stroke()
        g.strokeRect(480, 440, 330, 60)
        hatch(484, 444, 806, 470, 6, 0.3)
        g.beginPath()
        g.moveTo(560, 470)
        g.lineTo(560, 300)
        g.quadraticCurveTo(560, 240, 640, 236)
        g.quadraticCurveTo(720, 240, 720, 300)
        g.lineTo(720, 470)
        g.stroke()
        g.beginPath()
        g.arc(640, 228, 10, 0, TAU)
        g.stroke()
        g.beginPath()
        g.moveTo(560, 420)
        g.lineTo(720, 420)
        g.stroke()
        for (let k = 0; k < 18; k++) {
          g.beginPath()
          g.arc(210 + rnd() * 60, 352 + rnd() * 20, 2.5, 0, TAU)
          g.fill()
        }
      } else {
        // the balance, a flask on one pan, weights on the other, the brazier beside
        g.beginPath()
        g.moveTo(512, 600)
        g.lineTo(512, 200)
        g.moveTo(300, 210)
        g.lineTo(724, 190)
        g.stroke()
        g.strokeRect(440, 600, 144, 24)
        for (const [x, y] of [[300, 210], [724, 190]]) {
          g.beginPath()
          g.moveTo(x, y)
          g.lineTo(x - 60, y + 260)
          g.moveTo(x, y)
          g.lineTo(x + 60, y + 260)
          g.stroke()
          g.beginPath()
          g.ellipse(x, y + 262, 66, 12, 0, 0, Math.PI)
          g.stroke()
        }
        g.beginPath()
        g.arc(300, 420, 40, 0, TAU)
        g.moveTo(320, 386)
        g.lineTo(370, 300)
        g.stroke()
        hatch(272, 430, 330, 458, 5)
        for (const [x, ww, hh] of [[700, 40, 30], [750, 30, 22], [665, 24, 18]]) g.strokeRect(x - ww / 2, 450 - hh, ww, hh)
        g.beginPath()
        g.moveTo(512, 200)
        g.lineTo(512, 540)
        g.stroke()
        g.strokeRect(120, 520, 110, 80)
        hatch(120, 520, 230, 600, 7)
      }
      // a plate number in the corner, as engravings have
      g.font = '600 30px Georgia, serif'
      g.fillText(['I', 'II', 'III'][page], w - 110, h - 70)
    })
  }
  const board = new THREE.Group()
  const sheetHit = new THREE.Mesh(new THREE.BoxGeometry(SHEET.w + 0.1, 0.12, SHEET.h + 0.1), ghost)
  {
    const slope = new THREE.Mesh(new THREE.BoxGeometry(SHEET.w + 0.08, 0.025, SHEET.h + 0.08), mats.wood)
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(SHEET.w, SHEET.h), new THREE.MeshStandardMaterial({ map: drawTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: drawTex, emissiveIntensity: 0.12 }))
    sheet.rotation.x = -Math.PI / 2
    sheet.position.y = 0.014
    board.add(slope, sheet, sheetHit)
    const lean = new THREE.Group()
    lean.rotation.z = -0.42
    lean.add(board)
    // the board's foot rests on a block, its top raised toward the window: the drawing faces the room
    lean.position.set(MT.x - 0.05, MT.top + 0.12, MT.z - 0.12)
    const holder = new THREE.Group()
    holder.add(lean)
    root.add(holder)
    board.rotation.y = Math.PI / 2
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, SHEET.w), mats.darkWood)
    prop.position.set(MT.x - 0.22, MT.top + 0.08, MT.z - 0.12)
    root.add(prop)
    // her notebook open, an inkwell and a quill, loose sheets, a candlestick
    const nb = canvasTex(512, 352, (g, w, h) => {
      g.fillStyle = '#ece2c8'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#c9b892'
      g.fillRect(w / 2 - 3, 0, 6, h)
      g.strokeStyle = 'rgba(60,40,20,0.55)'
      g.lineWidth = 1.6
      const r = random(17)
      // columns of figures and lines of writing (no words)
      for (const x0 of [24, w / 2 + 20]) {
        for (let y = 30; y < h - 20; y += 20) {
          let x = x0
          const end = x0 + w / 2 - 60 - r() * 60
          while (x < end) {
            const word = 10 + r() * 30
            g.beginPath()
            g.moveTo(x, y)
            for (let u = 0; u < word; u += 3) g.lineTo(x + u, y + Math.sin((x + u) * 0.6) * 2.5)
            g.stroke()
            x += word + 6
          }
        }
      }
    })
    textures.push(nb)
    const book = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.29), new THREE.MeshStandardMaterial({ map: nb, roughness: 0.9 }))
    book.rotation.set(-Math.PI / 2, 0, Math.PI / 2)
    book.position.set(MT.x + 0.12, MT.top + 0.006, MT.z + 0.35)
    const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.045, 12), new THREE.MeshStandardMaterial({ color: '#1a1a22', roughness: 0.2, metalness: 0.2 }))
    ink.position.set(MT.x + 0.25, MT.top + 0.022, MT.z - 0.5)
    const quill = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.28, 6), new THREE.MeshStandardMaterial({ color: '#f2ece0', roughness: 0.8 }))
    quill.position.set(MT.x + 0.24, MT.top + 0.15, MT.z - 0.48)
    quill.rotation.set(0.25, 0, -0.4)
    const loose = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.22), paperMat)
    loose.rotation.set(-Math.PI / 2, 0, 0.3)
    loose.position.set(MT.x + 0.2, MT.top + 0.004, MT.z - 0.15)
    root.add(book, ink, quill, loose)
    // her chair, pushed back
    const chair = new THREE.Group()
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.44), new THREE.MeshStandardMaterial({ color: '#7a3a3a', roughness: 0.8 }))
    seat.position.y = 0.46
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.05), mats.wood)
    back.position.set(0, 0.74, 0.21)
    chair.add(seat, back)
    for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.46, 6), mats.wood)
      leg.position.set(lx, 0.23, lz)
      chair.add(leg)
    }
    chair.position.set(MT.x + 0.75, 0, MT.z + 1.0)
    chair.rotation.y = -Math.PI / 2 + 0.9
    root.add(chair)
    solids.push(circle(MT.x + 0.75, MT.z + 1.0, 0.3))
  }
  drawPlate(0)
  const P = { page: 0 }
  let flip = null // { t, to }
  const tablePanel = lv => {
    const pg = E.table.pages[P.page]
    return {
      title: pg.title,
      kicker: E.table.label,
      color,
      blocks: [...pg[depthOf(lv)].map(p => ({ p })), { buttons: [{ label: E.table.buttons.next, onClick: () => tableStep('next') }] }, ...paras(E.table.about, lv)],
    }
  }
  function tableStep(what) {
    if (what === 'read') {
      ctx.showPanel(tablePanel)
      ex.discover('table')
      return
    }
    if (flip) return say(at(W.busy, level()))
    P.page = (P.page + 1) % E.table.pages.length
    flip = { t: 0, to: P.page }
    play('tap')
    ctx.showPanel(tablePanel)
    ex.discover('table')
    share('table')
  }
  let readHere = false
  clickable(board, () => {
    tableStep(readHere ? 'next' : 'read')
    readHere = true
  })
  ex.add({
    id: 'table',
    x: -4.45,
    z: 3.0,
    radius: 1.5,
    manual: true,
    label: E.table.label,
    verb: () => E.table.hints.look,
    focus: focusOf(-5.85, 1.05, 3.0, 1.15, 1.3),
    act: () => {
      readHere = true
      tableStep('read')
    },
  })
  updates.push(dt => {
    if (!flip) return
    flip.t += dt
    // the sheet lifts and a fresh plate is laid in its place
    board.position.y = Math.sin(Math.PI * clamp(flip.t / 0.6)) * 0.04
    if (flip.t > 0.3 && !flip.drawn) {
      flip.drawn = true
      drawPlate(flip.to)
    }
    if (flip.t > 0.6) flip = null
  })
  const tableSet = (s, live) => {
    const page = clamp(Math.round(Number(s?.page) || 0), 0, E.table.pages.length - 1)
    if (page === P.page) return
    P.page = page
    if (live) flip = { t: 0, to: page }
    else drawPlate(page)
  }

  // ======== the room's other things: shelves of glassware, a barometer and a thermometer ========
  {
    const shapes = {
      bottle: [[0, 0], [0.05, 0], [0.055, 0.01], [0.055, 0.14], [0.03, 0.19], [0.018, 0.21], [0.02, 0.24]],
      jar: [[0, 0], [0.065, 0], [0.07, 0.01], [0.07, 0.15], [0.06, 0.165], [0.06, 0.18]],
      flask: [[0, 0], [0.04, 0], [0.075, 0.05], [0.07, 0.1], [0.022, 0.14], [0.018, 0.22], [0.022, 0.225]],
      retort: [[0, 0], [0.06, 0.01], [0.08, 0.07], [0.06, 0.13], [0.02, 0.16], [0, 0.17]],
    }
    const geos = Object.fromEntries(Object.entries(shapes).map(([k, p]) => [k, lathe(p, 16)]))
    const tints = ['#cfe6ea', '#9cc4b0', '#c8b48a', '#a8c0e0'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.55, depthWrite: false, envMap: env, envMapIntensity: 1 }))
    const stuff = ['#eeeae0', '#e8cf3a', '#3a78c8', '#b8402c', '#d8d0c0', '#5a8a4a'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }))
    const rnd = random(23)
    const kinds = Object.keys(shapes)
    for (const [xa, xb] of [[-6.2, -3.3], [3.7, 6.2]]) {
      for (const y of [1.3, 1.95, 2.6, 3.25]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(xb - xa, 0.04, 0.32), mats.wood)
        b.position.set((xa + xb) / 2, y - 0.02, ROOM.z0 + 0.2)
        b.castShadow = b.receiveShadow = true
        root.add(b)
        let x = xa + 0.15
        while (x < xb - 0.12) {
          const kind = kinds[Math.floor(rnd() * kinds.length)]
          const s = 0.9 + rnd() * 0.5
          const g = new THREE.Group()
          const j = new THREE.Mesh(geos[kind], tints[Math.floor(rnd() * tints.length)])
          j.renderOrder = 2
          g.add(j)
          if (kind !== 'retort' && rnd() < 0.7) {
            const fh = 0.05 + rnd() * 0.08
            const inner = new THREE.Mesh(new THREE.CylinderGeometry(kind === 'jar' ? 0.06 : 0.035, kind === 'jar' ? 0.06 : 0.04, fh, 10), stuff[Math.floor(rnd() * stuff.length)])
            inner.position.y = fh / 2 + 0.005
            g.add(inner)
          }
          g.scale.setScalar(s)
          g.position.set(x, y, ROOM.z0 + 0.2 + (rnd() - 0.5) * 0.08)
          root.add(g)
          x += 0.17 * s + 0.06 + rnd() * 0.2
        }
      }
      // the uprights
      for (const x of [xa + 0.05, xb - 0.05]) {
        const up = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.3, 0.32), mats.darkWood)
        up.position.set(x, 2.15, ROOM.z0 + 0.2)
        root.add(up)
      }
    }
    // a barometer and a thermometer on the pier between the glazed doors (Lavoisier noted both before
    // every measure of air)
    const pier = { x: ROOM.x1 - 0.03, z: 0.05 }
    const baro = new THREE.Group()
    const boardB = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.1, 0.12), mats.wood)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.9, 6), glassMat)
    tube.position.x = -0.02
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.76, 6), mercury)
    col.position.set(-0.02, -0.07, 0)
    const cistern = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), mercury)
    cistern.position.set(-0.02, -0.5, 0)
    baro.add(boardB, tube, col, cistern)
    baro.position.set(pier.x, 1.85, pier.z - 0.22)
    const thermo = new THREE.Group()
    const boardT = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.08), mats.wood)
    const ttube = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.4, 6), glassMat)
    ttube.position.x = -0.02
    const tcol = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.2, 6), new THREE.MeshStandardMaterial({ color: '#c02020', roughness: 0.4 }))
    tcol.position.set(-0.02, -0.09, 0)
    thermo.add(boardT, ttube, tcol)
    thermo.position.set(pier.x, 1.7, pier.z + 0.25)
    root.add(baro, thermo)
    // a cabinet each side of the frame on the wall behind the spawn
    for (const x of [-4.2, 4.2]) {
      const cab = new THREE.Mesh(new RoundedBoxGeometry(1.6, 2.2, 0.5, 2, 0.03), mats.wood)
      cab.position.set(x, 1.1, ROOM.z1 - 0.3)
      cab.castShadow = cab.receiveShadow = true
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), glassMat)
      glass.position.set(x, 1.55, ROOM.z1 - 0.56)
      glass.rotation.y = Math.PI
      root.add(cab, glass)
      solids.push(box(x, ROOM.z1 - 0.3, 1.6, 0.5))
    }
  }
  // the shelves stand on the wall behind the bench: keep walkers off them
  solids.push(box(-4.75, ROOM.z0 + 0.2, 2.9, 0.34), box(4.95, ROOM.z0 + 0.2, 2.5, 0.34))

  // ======== every frame ========
  updates.push((dt, t) => {
    const a = poseLens(dt, t)
    const b = poseDays(dt, t)
    poseBalance(dt, t)
    // whichever candle is blazing lights its surroundings
    const f = a ?? b
    flareWant = f ? f.blaze * (light ? 1.2 : 2.2) : 0
    if (f) flare.position.copy(f.at).setY(f.at.y + 0.25)
    stage.update(t)
  })

  // the shadows: the room's things cast them on the floor and on each other (glass and glows do not)
  root.traverse(o => {
    if (!o.isMesh || o.castShadow) return
    const m = o.material
    if (!m || m.transparent || m.visible === false || m.isMeshBasicMaterial || m.isShaderMaterial) return
    o.castShadow = true
    o.receiveShadow = true
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    spawn: { x: 0, z: 3.3, yaw: 0 },
    hostSpot: { x: -1.7, z: 2.3, yaw: Math.atan2(-1.7, -0.9) },
    back: { x: 0, z: 5.8, rot: Math.PI },
    stand: { x: 2.55, z: 2.3, rot: Math.atan2(-2.55, 1.2) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      lens: {
        tap: what => lensStep(what), // 'lens', 'candle'
        get state() { return lensState() },
        lensAt: () => LENS.clone(),
        jarAt: () => jar1.getWorldPosition(new THREE.Vector3()),
        candleAt: () => pr1.group.getWorldPosition(new THREE.Vector3()).setY(LT.top + 0.1),
      },
      days: {
        tap: what => daysStep(what), // 'furnace', 'taper', 'crust', 'taper2'
        set: d => setDay(d), // the panel's slider
        get state() { return daysState() },
        furnaceAt: () => new THREE.Vector3(FURN.x, BENCH.top + 0.15, FURN.z),
        bellAt: () => bell.getWorldPosition(new THREE.Vector3()).setY(HG2 + 0.2),
        retortAt: () => retort2.getWorldPosition(new THREE.Vector3()),
        taperAt: () => prA.group.getWorldPosition(new THREE.Vector3()).setY(BENCH.top + 0.25),
        taper2At: () => prB.group.getWorldPosition(new THREE.Vector3()).setY(BENCH.top + 0.25),
      },
      balance: {
        tap: what => balanceStep(what), // 'flask', 'tip'
        get state() { return balanceState() },
        get angle() { return theta },
        flaskAt: () => tinFlask.getWorldPosition(new THREE.Vector3()).setY(tinFlask.position.y + 0.08),
        tipAt: () => tinFlask.localToWorld(TIP.clone()),
      },
      table: {
        tap: what => tableStep(what), // 'read', 'next'
        get page() { return P.page },
        sheetAt: () => board.getWorldPosition(new THREE.Vector3()),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { lens: lensPanel, days: daysPanel, balance: balancePanel, table: tablePanel },
    shared: {
      lens: { get: lensState, set: lensSet },
      days: { get: daysState, set: daysSet },
      balance: { get: balanceState, set: balanceSet },
      table: { get: () => ({ page: P.page }), set: tableSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (daySend) clearTimeout(daySend)
      for (const tx of textures) tx.dispose()
    },
  }
}
