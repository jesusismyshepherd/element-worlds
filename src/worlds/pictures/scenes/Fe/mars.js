// Iron's picture "Why is Mars red?" as a room (docs/knowledge/picture-rooms.md): Meridiani Planum on Mars,
// on the plain beside Eagle crater, where the rover Opportunity landed in January 2004 (stages/mars.js).
// The rover of the picture stands with its arm out over a rock, a drift of red dust and a few grey
// "blueberries"; the crater lies beyond, pale bedrock in its wall, the lander's airbags on its floor; the
// small Sun sinks into a butterscotch sky. Four things to do, each step chosen by tapping its thing (the
// user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E opens the
// station's panel, whose buttons and sliders do the same:
// - the rover's arm: tap the rock, its tool brushes the red dust off, again it grinds a round hole into
//   dark grey rock; then tap the rock, the dust or a blueberry and the Mössbauer spectrometer sits on it,
//   a spectrum builds on the screen and names the iron minerals (olivine and pyroxene in the rock; fine
//   ferric oxide with some olivine, pyroxene and magnetite in the dust; hematite in the berry). The lens
//   shows why: a cobalt-57 source swings to and fro, and iron-57 atoms catch its rays only at their own
//   speeds, a different set for each mineral;
// - the blueberries: tap the berries on the ground and a handful flies into the magnifier (ten times
//   bigger, a ruler in millimetres), tap the magnifier to cut one open (grey hematite all through); a
//   model of the crater's rock, ten times bigger, tells their story with a time slider or a tap: sand
//   laid down, groundwater soaking through it, hematite growing into balls inside, the wind wearing the
//   rock away, the balls left lying on top; tap the bedrock ledge for its jarosite (acid water);
// - the sky clock: a copy of the rovers' sundial; tap it (or the slider) to move the Sun on from noon to
//   after sunset: the butterscotch sky darkens and the glow round the Sun turns blue; tap the sky for a
//   lens of a dust grain sending blue light forwards; after sunset tap the bright dot: the Earth;
// - the magnets: copies of the rovers' capture and filter magnets; tap them (or a sols slider) and the
//   dust gathers on them in rings (it holds magnetite).
// All four are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes. Sources: the head of mars.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, clamp, damp, random, hdr, standingScreen } from '../../../wings/noble/kit.js'
import { marsStage, marsRover, marsLander, marsSun, rockGeometry, layersTexture } from '../../stages/mars.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { MARS_WORDS } from './mars.words.js'

export const WORDS = MARS_WORDS

const TAU = Math.PI * 2
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const bump = (a, b, v) => Math.sin(Math.PI * clamp((v - a) / (b - a)))
const clock = () => performance.now() / 1000
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- where things stand (metres; the spawn at z = 4.6 looks along -z, toward the setting Sun) ----
const CRATER = { x: -1, z: -23, r: 11, depth: 3, from: Math.PI - 0.6, to: TAU + 0.6 }
const ROVER = { x: -2.8, z: -4.7 }
const ROCK = { x: -2.6, z: -3.0 }
const DUST = { x: -1.7, z: -3.45 }
const BERRY = { x: -3.6, z: -3.35 }
const SCREEN = { x: -4.2, z: -3.6 }
const LENS_A = V(-1.1, 1.32, -3.75)
const LEDGE = { x: -0.3, z: -7.75 }
const PATCH = { x: -0.15, z: -6.75 }
const MODEL = { x: 1.6, z: -7.5 }
const DISH = { x: 3.0, z: -6.65 }
const DIAL = { x: 4.3, z: -3.3 }
const MAGS = { x: 6.35, z: -2.4 }
const LENS_C = V(3.05, 1.75, -4.0)
// the Earth as an evening star: low in the west, above where the Sun went down
const EARTH_DIR = V(0.05, 0.3, -0.95).normalize()

// ---- the Mössbauer spectra: the iron minerals' lines (mm/s), as the rovers' spectrometers read them ----
// doublets: [centre shift, quadrupole splitting]; sextets: [centre shift, field in tesla]
const MINERALS = {
  pyroxene: { color: '#7ec8ff', doublet: [1.15, 2.1] },
  olivine: { color: '#8ee08a', doublet: [1.15, 2.95] },
  npox: { color: '#ff8a5c', doublet: [0.37, 0.9] },
  magnetite: { color: '#c9a7ff', sextet: [0.5, 48] },
  hematite: { color: '#ffd166', sextet: [0.37, 51.8] },
}
const MIX = {
  rock: [['pyroxene', 0.62], ['olivine', 0.38]],
  dust: [['npox', 0.42], ['olivine', 0.2], ['pyroxene', 0.22], ['magnetite', 0.16]],
  berry: [['hematite', 1]],
}
const SEXTET = [[-0.1611, 3], [-0.0934, 2], [-0.0257, 1], [0.0257, 1], [0.0934, 2], [0.1611, 3]]
/** A mineral's lines: [[velocity, weight], ...] (the weights add up to 1). */
function linesOf(name) {
  const m = MINERALS[name]
  if (m.doublet) return [[m.doublet[0] - m.doublet[1] / 2, 0.5], [m.doublet[0] + m.doublet[1] / 2, 0.5]]
  return SEXTET.map(([f, w]) => [m.sextet[0] + f * m.sextet[1], w / 12])
}
const VMAX = 11
const GAMMA = 0.32
/** The spectrum of a target (backscatter: peaks), 0..1, at velocity v. */
function spectrumAt(target, v) {
  let s = 0
  for (const [name, wt] of MIX[target]) for (const [p, w] of linesOf(name)) s += (wt * w * GAMMA * GAMMA) / ((v - p) ** 2 + GAMMA * GAMMA)
  return s
}
const PEAK = Object.fromEntries(Object.keys(MIX).map(k => [k, Math.max(...Array.from({ length: 900 }, (_, i) => spectrumAt(k, -VMAX + (i / 899) * 2 * VMAX)))]))

// ---- the time of a sol at the sky clock ----
const HOUR = { min: 12, max: 19.5, start: 17.3 }
const STOPS = [12, 15, 17, 17.7, 18.2, 18.8, 19.5]
const clockText = h => {
  let hh = Math.floor(h)
  let mm = Math.round((h - hh) * 60)
  if (mm === 60) {
    hh += 1
    mm = 0
  }
  return `${hh}:${String(mm).padStart(2, '0')}`
}

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.6)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = marsStage({
    radius: 11,
    light,
    crater: CRATER,
    tracks: [[-1.4, -11.4], [-2.1, -9.6], [-2.9, -7.6], [-2.85, -5.6]],
    clear: [[ROVER.x, ROVER.z, 1.5], [ROCK.x, ROCK.z, 0.5], [DUST.x, DUST.z, 0.5], [BERRY.x, BERRY.z, 0.3], [LEDGE.x, LEDGE.z, 1.1], [PATCH.x, PATCH.z, 0.9], [MODEL.x, MODEL.z, 0.9], [DISH.x, DISH.z, 0.5], [DIAL.x, DIAL.z, 0.5], [MAGS.x, MAGS.z, 0.5], [0, 4.6, 1.4], [0, 6.8, 1.8], [2.1, 3.4, 0.9], [SCREEN.x, SCREEN.z, 0.5]],
    berries: 1800,
  })
  root.add(stage.group)
  const solids = stage.solids
  const groundAt = stage.groundAt
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const soft = softTex()
  disposers.push(() => soft.dispose())
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const metal = new THREE.MeshStandardMaterial({ color: '#4a4e57', roughness: 0.5, metalness: 0.6 })
  const navy = new THREE.MeshBasicMaterial({ color: '#0b1030', transparent: true, opacity: 0.9 })
  const rimMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3, roughness: 0.4 })
  const label = (text, size, c = '#ffffff', extra = {}) => {
    const t = makeText(text, { size, color: c, ...extra })
    return t
  }
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  // an open panel written again when its station's state changed (its buttons follow)
  const repanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const panelOf = (title, paras, extra) => lv => ({
    title,
    color,
    blocks: [...(extra ? extra(lv) : []), ...paras[depthOf(lv)].map(p => ({ p }))],
  })
  const faceTo = (obj, x, z) => (obj.rotation.y = Math.atan2(x - obj.position.x, z - obj.position.z))

  // the crater's lander among its airbags, where Opportunity rolled off it
  const lander = marsLander()
  lander.position.set(CRATER.x + 1.2, groundAt(CRATER.x + 1.2, CRATER.z + 0.8), CRATER.z + 0.8)
  lander.rotation.y = 0.4
  root.add(lander)

  // a small puff of dust or rock powder (one cloud reused), from a point
  const PUFF = light ? 24 : 48
  const puffPos = new Float32Array(PUFF * 3)
  const puffVel = Array.from({ length: PUFF }, () => V())
  const puffGeo = new THREE.BufferGeometry()
  puffGeo.setAttribute('position', new THREE.BufferAttribute(puffPos, 3))
  const puffMat = new THREE.PointsMaterial({ color: '#c8704a', size: 0.035, map: soft, transparent: true, opacity: 0, depthWrite: false })
  const puff = new THREE.Points(puffGeo, puffMat)
  puff.frustumCulled = false
  puff.raycast = () => {}
  root.add(puff)
  let puffAge = 9
  const puffAt = (p, c) => {
    puffMat.color.set(c)
    for (let i = 0; i < PUFF; i++) {
      puffPos.set([p.x, p.y, p.z], i * 3)
      const a = Math.random() * TAU
      const s = 0.15 + Math.random() * 0.35
      puffVel[i].set(Math.cos(a) * s, 0.2 + Math.random() * 0.5, Math.sin(a) * s)
    }
    puffAge = 0
  }
  updates.push(dt => {
    if (puffAge > 2) return
    puffAge += dt
    for (let i = 0; i < PUFF; i++) {
      puffVel[i].y -= 0.25 * dt
      puffPos[i * 3] += puffVel[i].x * dt
      puffPos[i * 3 + 1] += puffVel[i].y * dt
      puffPos[i * 3 + 2] += puffVel[i].z * dt
    }
    puffGeo.attributes.position.needsUpdate = true
    puffMat.opacity = 0.85 * (1 - clamp(puffAge / 1.8))
  })

  // =====================================================================================================
  // ======== station 1: the rover's arm and its iron detector ========
  // =====================================================================================================
  const rover = marsRover({ light })
  rover.group.position.set(ROVER.x, groundAt(ROVER.x, ROVER.z), ROVER.z)
  root.add(rover.group)
  disposers.push(rover.dispose)
  solids.push(box(ROVER.x, ROVER.z, 1.45, 1.4))

  // the rock: dark basalt under a coat of red dust
  const rockMat = new THREE.MeshStandardMaterial({ color: '#8c4a30', roughness: 0.92 })
  const rock = new THREE.Mesh(rockGeometry(7, 3), rockMat)
  rock.scale.set(0.3, 0.2, 0.26)
  rock.position.set(ROCK.x, groundAt(ROCK.x, ROCK.z) - 0.02, ROCK.z)
  rock.rotation.y = 0.5
  rock.castShadow = !light
  root.add(rock)
  solids.push(circle(ROCK.x, ROCK.z, 0.3))
  rock.updateMatrixWorld(true)
  const ROCK_TOP = V(ROCK.x, 0.3, ROCK.z)
  const rockN = V(0, 1, 0)
  {
    const hit = new THREE.Raycaster(V(ROCK.x + 0.02, 2, ROCK.z + 0.03), V(0, -1, 0)).intersectObject(rock)[0]
    if (hit) {
      ROCK_TOP.copy(hit.point)
      rockN.copy(hit.face.normal).transformDirection(rock.matrixWorld)
    }
  }
  // what the brush and the grinder leave: a dark brushed patch, then a round hole of fresh grey rock with
  // its powder round it
  const onRock = new THREE.Group()
  onRock.position.copy(ROCK_TOP).addScaledVector(rockN, 0.004)
  onRock.quaternion.setFromUnitVectors(V(0, 0, 1), rockN)
  root.add(onRock)
  const brushedMat = new THREE.MeshStandardMaterial({ color: '#4c3a33', roughness: 0.9, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2 })
  const brushed = new THREE.Mesh(new THREE.CircleGeometry(0.075, 32), brushedMat)
  const powderMat = new THREE.MeshStandardMaterial({ color: '#8d8a88', roughness: 1, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -3 })
  const powder = new THREE.Mesh(new THREE.RingGeometry(0.033, 0.06, 32), powderMat)
  powder.position.z = 0.001
  const hole = new THREE.Group()
  const holeFloor = new THREE.Mesh(new THREE.CircleGeometry(0.031, 32), new THREE.MeshStandardMaterial({ color: '#45484e', roughness: 0.75, metalness: 0.1 }))
  holeFloor.position.z = -0.006
  const holeWall = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.008, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#2e3034', roughness: 0.9, side: THREE.BackSide }))
  holeWall.rotation.x = Math.PI / 2
  holeWall.position.z = -0.002
  hole.add(holeFloor, holeWall)
  hole.scale.setScalar(0.001)
  onRock.add(brushed, powder, hole)

  // the drift of red dust, brighter than the ground
  const driftMat = new THREE.MeshStandardMaterial({ color: '#b8653e', roughness: 1 })
  const drift = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 12, 0, TAU, 0, Math.PI / 2), driftMat)
  drift.scale.set(0.42, 0.11, 0.2)
  drift.position.set(DUST.x, groundAt(DUST.x, DUST.z) - 0.005, DUST.z)
  drift.rotation.y = 0.35
  drift.receiveShadow = true
  root.add(drift)
  const driftHit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.45), ghost)
  driftHit.position.set(DUST.x, 0.1, DUST.z)
  driftHit.rotation.y = 0.35
  root.add(driftHit)
  const DUST_TOP = V(DUST.x, groundAt(DUST.x, DUST.z) + 0.1, DUST.z)

  // a few blueberries lying in front of the rover
  const berryMat = new THREE.MeshStandardMaterial({ color: '#5e6672', roughness: 0.45, metalness: 0.35 })
  const berryGeo = new THREE.IcosahedronGeometry(1, 2)
  const cluster = new THREE.InstancedMesh(berryGeo, berryMat, 11)
  {
    const o = new THREE.Object3D()
    for (let i = 0; i < 11; i++) {
      const a = hash(4, i) * TAU
      const r = Math.sqrt(hash(4, i, 1)) * 0.11
      const s = 0.014 + hash(4, i, 2) * 0.008
      o.position.set(BERRY.x + Math.cos(a) * r, groundAt(BERRY.x, BERRY.z) + s * 0.8, BERRY.z + Math.sin(a) * r)
      o.scale.setScalar(s)
      o.updateMatrix()
      cluster.setMatrixAt(i, o.matrix)
    }
  }
  root.add(cluster)
  const berryHit = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.36), ghost)
  berryHit.position.set(BERRY.x, 0.06, BERRY.z)
  root.add(berryHit)
  const BERRY_TOP = V(BERRY.x, groundAt(BERRY.x, BERRY.z) + 0.03, BERRY.z)
  const TARGETS = { rock: ROCK_TOP, dust: DUST_TOP, berry: BERRY_TOP }

  // the screen beside the rover: the spectrum as it builds
  const screen = standingScreen({ width: 1.25, height: 0.82, color, title: E.arm.screen, line: '', titleSize: 0.075, lineSize: 0.05 }, { top: 1.32, tilt: 0.22, mat: metal })
  screen.group.position.set(SCREEN.x, groundAt(SCREEN.x, SCREEN.z), SCREEN.z)
  faceTo(screen.group, -2.6, -0.3)
  root.add(screen.group)
  solids.push(circle(SCREEN.x, SCREEN.z, 0.3))
  const specTex = canvasTex(768, 400, null, { mipmaps: false })
  disposers.push(() => specTex.dispose())
  const specPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.17, 0.61), new THREE.MeshBasicMaterial({ map: specTex, transparent: true, toneMapped: false }))
  specPlane.position.set(0, -0.08, 0.002)
  screen.content.add(specPlane)

  // ---- the arm's state: the rock's stage, what was measured, the job under way (shared) ----
  const MOVE = 1.3
  const DUR = { brush: 2.4, grind: 3.6, mb: 5.5 }
  const A = { rock: 0, done: { rock: 0, dust: 0, berry: 0 }, last: null, job: null }
  const jobAge = () => (A.job ? clock() - A.job.start : 0)
  const jobEnd = j => MOVE + DUR[j.kind]
  const busy = () => !!A.job && jobAge() < jobEnd(A.job)
  let armSeen = false
  const armHint = () => {
    if (busy()) return A.job.kind === 'mb' ? E.arm.hints.measuring : E.arm.hints.busy
    if (A.rock === 0) return E.arm.hints.brush
    if (A.rock === 1) return E.arm.hints.grind
    if (!A.done.rock) return E.arm.hints.rock
    if (!A.done.dust) return E.arm.hints.dust
    if (!A.done.berry) return E.arm.hints.berry
    return E.arm.hints.again
  }
  const armPanel = panelOf(E.arm.title, E.arm.panel, () => [
    {
      buttons: [
        { label: A.rock === 0 ? E.arm.buttons.brush : A.rock === 1 ? E.arm.buttons.grind : E.arm.buttons.rock, onClick: () => armStep('rock') },
        { label: E.arm.buttons.dust, onClick: () => armStep('dust') },
        { label: E.arm.buttons.berry, onClick: () => armStep('berry') },
        { label: E.arm.buttons.fresh, onClick: () => armStep('fresh') },
      ],
    },
  ])
  const startJob = (kind, on, start = clock(), mine = true) => {
    A.job = { kind, on, start, mine, done: false }
  }
  /** A visitor's step: a tap on the rock, the dust or a berry (or the panel's buttons). */
  function armStep(what) {
    const lv = level()
    if (what === 'fresh') {
      if (busy()) return say(at(W.busy, lv))
      A.rock = 0
      A.done = { rock: 0, dust: 0, berry: 0 }
      A.last = null
      A.job = null
      play('tap')
      say(at(E.arm.says.fresh, lv))
      repanel(armPanel)
      share('arm')
      return
    }
    if (!TARGETS[what]) return
    if (busy()) return say(at(W.busy, lv))
    if (what === 'rock' && A.rock < 2) {
      startJob(A.rock === 0 ? 'brush' : 'grind', 'rock')
      say(at(A.rock === 0 ? E.arm.says.brush : E.arm.says.grind, lv))
    } else {
      startJob('mb', what)
      say(at(E.arm.says.measure[what], lv))
    }
    play('select')
    armSeen = true
    ex.discover('arm', armPanel, 3.5)
    repanel(armPanel)
    share('arm')
  }
  clickable(rock, () => armStep('rock'))
  clickable(driftHit, () => armStep('dust'))
  clickable(berryHit, () => armStep('berry'))
  clickable(screen.group, () => ctx.showPanel(armPanel))
  ex.add({
    id: 'arm',
    x: -2.6,
    z: -1.25,
    radius: 1.7,
    manual: true,
    label: E.arm.label,
    verb: armHint,
    screens: [screen],
    focus: { x: -2.75, y: 0.8, z: -3.7, size: 2.9, width: 4.2 },
    act: () => ctx.showPanel(armPanel),
  })

  // ---- the lens: iron-57 atoms catching the source's rays at their own speeds ----
  const LR = 0.42
  const lensA = new THREE.Group()
  lensA.position.copy(LENS_A)
  lensA.lookAt(-2.6, 1.4, -0.3)
  root.add(lensA)
  const lensABody = new THREE.Group()
  lensA.add(lensABody)
  lensABody.add(new THREE.Mesh(new THREE.CircleGeometry(LR, 64), navy), new THREE.Mesh(new THREE.TorusGeometry(LR, 0.03, 10, 72), rimMat))
  const lensATitle = label(E.arm.lens.title, 0.07, hdr(color, 1.2))
  lensATitle.position.set(0, LR + 0.1, 0.01)
  const lensAName = label('', 0.05, '#e8ecff', { maxWidth: 0.95 })
  lensAName.position.set(0, -LR - 0.08, 0.01)
  lensABody.add(lensATitle, lensAName)
  // the crystal: iron atoms (orange), oxygen (red), silicon (sand) for the rock's silicates
  const ATOMS = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const x = -0.28 + c * 0.13 + (r % 2) * 0.065
      const y = 0.12 - r * 0.12
      ATOMS.push({ x, y, kind: 'fe', i: r * 4 + c })
      ATOMS.push({ x: x + 0.065, y: y + 0.035, kind: 'o' })
    }
  }
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0 }), ATOMS.length)
  atomMesh.position.z = 0.03
  atomMesh.frustumCulled = false
  lensABody.add(atomMesh)
  const COL = { fe: new THREE.Color('#d9772b'), o: new THREE.Color('#e04a3a'), si: new THREE.Color('#cdb88a'), hot: new THREE.Color('#fff2b0') }
  const glowAt = new Float32Array(ATOMS.length)
  // the source of the rays, swinging to and fro; a speed scale under the crystal with the mineral's lines
  const source = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.08, 0.04, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#b28cff', emissive: '#7a4cff', emissiveIntensity: 0.8 }))
  source.position.set(0.3, 0.06, 0.03)
  const srcLabel = label(E.arm.lens.source, 0.04, '#d8ccff')
  srcLabel.position.set(0.3, 0.14, 0.03)
  lensABody.add(source, srcLabel)
  const scaleBar = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.006), new THREE.MeshBasicMaterial({ color: '#8a96c8' }))
  scaleBar.position.set(0, -0.27, 0.02)
  const marker = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.05), new THREE.MeshBasicMaterial({ color: '#b28cff' }))
  marker.position.set(0, -0.27, 0.025)
  const scaleLabel = label(E.arm.lens.speed, 0.032, '#aab4dd')
  scaleLabel.position.set(0, -0.32, 0.02)
  lensABody.add(scaleBar, marker, scaleLabel)
  const ticks = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.008, 0.03), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 16)
  ticks.position.set(0, -0.255, 0.022)
  ticks.frustumCulled = false
  lensABody.add(ticks)
  // the rays: dashes flying in from the source, and back out when caught
  const RAYS = 14
  const rayMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.008, 0.004), new THREE.MeshBasicMaterial({ color: hdr('#d8ff9a', 1.6), toneMapped: false }), RAYS)
  rayMesh.position.z = 0.04
  rayMesh.frustumCulled = false
  rayMesh.raycast = () => {}
  lensABody.add(rayMesh)
  const rays = Array.from({ length: RAYS }, () => ({ live: false }))
  let rayClock = 0
  let lensAOn = 0
  let lensTarget = null
  const lensLines = []
  const showLensFor = target => {
    if (target === lensTarget) return
    lensTarget = target
    lensLines.length = 0
    if (target) for (const [name, wt] of MIX[target]) for (const [p, w] of linesOf(name)) lensLines.push({ p, w: wt * w, name })
    const o = new THREE.Object3D()
    for (let i = 0; i < 16; i++) {
      const l = lensLines[i]
      if (l) {
        o.position.set((l.p / VMAX) * 0.28, 0, 0)
        o.scale.set(1, 0.6 + Math.min(1, l.w * 4), 1)
        ticks.setColorAt(i, new THREE.Color(MINERALS[l.name].color))
      } else o.scale.setScalar(0)
      o.updateMatrix()
      ticks.setMatrixAt(i, o.matrix)
    }
    ticks.instanceMatrix.needsUpdate = true
    if (ticks.instanceColor) ticks.instanceColor.needsUpdate = true
    setText(lensAName, target ? MIX[target].map(([n]) => E.arm.minerals[n]).join(', ') : '')
  }
  const om = new THREE.Object3D()
  updates.push((dt, t) => {
    const want = A.last || (A.job?.kind === 'mb' ? A.job.on : null)
    const measuring = A.job?.kind === 'mb' && busy() && jobAge() > MOVE
    lensAOn = damp(lensAOn, want ? 1 : 0, 4, dt)
    lensA.visible = lensAOn > 0.02
    lensA.scale.setScalar(Math.max(0.001, ease(lensAOn)))
    if (!lensA.visible) return
    const target = A.job?.kind === 'mb' && busy() ? A.job.on : A.last
    showLensFor(target)
    // the source's speed: a slow sweep from -VMAX to +VMAX and back
    const v = VMAX * Math.sin(t * 1.4)
    source.position.x = 0.3 + 0.025 * Math.sin(t * 1.4)
    marker.position.x = (v / VMAX) * 0.28
    // rays leave the source while the spectrometer is measuring (and slowly after, to show it again)
    rayClock -= dt
    if (rayClock <= 0) {
      rayClock = measuring ? 0.09 : 0.3
      const r = rays.find(q => !q.live)
      const fe = ATOMS.filter(a => a.kind === 'fe' && !(target === 'rock' && a.i % 2))
      if (r && fe.length) {
        const a = fe[Math.floor(Math.random() * fe.length)]
        const caught = target && lensLines.some(l => Math.abs(l.p - v) < 0.45 + l.w * 1.2)
        Object.assign(r, { live: true, x: source.position.x - 0.03, y: source.position.y, tx: a.x, ty: a.y, atom: ATOMS.indexOf(a), caught, back: false })
      }
    }
    for (let i = 0; i < RAYS; i++) {
      const r = rays[i]
      if (r.live) {
        const tx = r.back ? 0.45 : r.caught ? r.tx : -0.45
        const ty = r.back ? -0.02 : r.caught ? r.ty : r.ty
        const dx = tx - r.x
        const dy = ty - r.y
        const d = Math.hypot(dx, dy)
        const step = 0.9 * dt
        if (d <= step) {
          if (r.caught && !r.back) {
            glowAt[r.atom] = 1
            r.back = true
            r.x = r.tx
            r.y = r.ty
          } else r.live = false
        } else {
          r.x += (dx / d) * step
          r.y += (dy / d) * step
        }
        om.position.set(r.x, r.y, 0)
        om.rotation.set(0, 0, Math.atan2(dy, dx))
        om.scale.setScalar(Math.hypot(r.x, r.y) < LR - 0.03 ? 1 : 0)
      } else om.scale.setScalar(0)
      om.updateMatrix()
      rayMesh.setMatrixAt(i, om.matrix)
    }
    rayMesh.instanceMatrix.needsUpdate = true
    const c = new THREE.Color()
    ATOMS.forEach((a, i) => {
      glowAt[i] = Math.max(0, glowAt[i] - dt * 2.5)
      const isSi = target === 'rock' && a.kind === 'fe' && a.i % 2
      const kind = isSi ? 'si' : a.kind
      om.position.set(a.x, a.y, 0)
      om.rotation.set(0, 0, 0)
      om.scale.setScalar(a.kind === 'o' ? 0.026 : 0.04)
      om.updateMatrix()
      atomMesh.setMatrixAt(i, om.matrix)
      atomMesh.setColorAt(i, c.copy(COL[kind]).lerp(COL.hot, glowAt[i]))
    })
    atomMesh.instanceMatrix.needsUpdate = true
    if (atomMesh.instanceColor) atomMesh.instanceColor.needsUpdate = true
  })

  // ---- the spectrum on the screen: counts gathering at each speed (the same noise on every screen) ----
  const BINS = 220
  let drawnKey = ''
  const drawSpectrum = (target, p) => {
    const key = `${target}:${Math.round(p * 40)}:${lang}:${level()}`
    if (key === drawnKey) return
    drawnKey = key
    specTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      const X0 = 40
      const X1 = w - 20
      const Y0 = h - 70
      const Y1 = 58
      g.font = '600 30px Outfit'
      g.fillStyle = '#e8ecff'
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      if (!target) {
        g.fillStyle = '#9aa6d6'
        g.font = '500 28px Nunito'
        g.fillText(at(E.arm.screenIdle, level()), X0, h / 2)
        return
      }
      g.fillText(E.arm.targets[target], X0, 40)
      g.textAlign = 'right'
      g.font = '500 24px Nunito'
      g.fillStyle = '#9aa6d6'
      g.fillText(p < 1 ? fill(E.arm.progress, { n: Math.round(p * 100) }) : E.arm.complete, X1, 40)
      // the axis
      g.strokeStyle = 'rgba(160,175,230,0.6)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(X0, Y0)
      g.lineTo(X1, Y0)
      g.stroke()
      g.textAlign = 'center'
      g.font = '500 20px Nunito'
      g.fillStyle = '#8a96c8'
      for (const vv of [-10, -5, 0, 5, 10]) {
        const x = X0 + ((vv + VMAX) / (2 * VMAX)) * (X1 - X0)
        g.fillRect(x - 1, Y0, 2, 8)
        g.fillText(String(vv).replace('-', '−'), x, Y0 + 28)
      }
      g.fillText(E.arm.axis, (X0 + X1) / 2, Y0 + 56)
      // the counts: the true spectrum and noise that shrinks as counts gather
      const tick = Math.floor(p * 40)
      const noise = 0.55 / Math.sqrt(1 + 60 * p)
      g.strokeStyle = color
      g.lineWidth = 3
      g.beginPath()
      for (let i = 0; i < BINS; i++) {
        const v = -VMAX + (i / (BINS - 1)) * 2 * VMAX
        const s = spectrumAt(target, v) / PEAK[target]
        const n = (hash(91 + tick, i) + hash(57 + tick, i, 3) - 1) * noise
        const y = Y0 - 8 - clamp(0.06 + 0.82 * s * clamp(p * 1.6) + n * 0.4, 0, 1) * (Y0 - Y1 - 8)
        const x = X0 + (i / (BINS - 1)) * (X1 - X0)
        if (i) g.lineTo(x, y)
        else g.moveTo(x, y)
      }
      g.stroke()
      // the minerals, named once the lines stand clear, each with its lines marked
      if (p > 0.6) {
        const k = clamp((p - 0.6) / 0.3)
        g.globalAlpha = k
        let lx = X0
        g.textAlign = 'left'
        g.font = '700 22px Outfit'
        for (const [name] of MIX[target]) {
          g.fillStyle = MINERALS[name].color
          for (const [pv] of linesOf(name)) {
            const x = X0 + ((pv + VMAX) / (2 * VMAX)) * (X1 - X0)
            g.fillRect(x - 2, Y0 - 16, 4, 14)
          }
          const word = E.arm.minerals[name]
          g.fillText(word, lx, 76)
          lx += g.measureText(word).width + 22
        }
        g.globalAlpha = 1
      }
    })
  }

  // ---- the arm moving: from where it is to the job's target, the tools at work ----
  let pose = rover.park()
  const tmpT = V()
  let armWas = null
  const ratSpin = rover.tools.rat.group
  updates.push((dt, t) => {
    const j = A.job
    const age = jobAge()
    const target = j && age < jobEnd(j) + 1.6 ? TARGETS[j.on] : A.last ? TARGETS[A.last] : A.rock > 0 ? ROCK_TOP : null
    const tool = j && age < jobEnd(j) + 1.6 ? (j.kind === 'mb' ? 'mb' : 'rat') : 'mb'
    // at work the tool sits on the target; idle, the arm hovers above the last one, so it can be seen
    const working_ = j && age < jobEnd(j)
    const want = target ? rover.solve(working_ ? target : tmpT.copy(target).add(V(0, 0.28, 0.05)), tool) : rover.park()
    // the tool waits a little above until the move is done, then comes down onto the target
    if (j && age < MOVE) want.sh += 0.12 * (1 - age / MOVE)
    pose = rover.lerpPose(pose, want, 1 - Math.exp(-3.2 * dt))
    rover.apply(pose)
    const working = j && j.kind !== 'mb' && age > MOVE && age < jobEnd(j)
    ratSpin.rotation.y += working ? dt * 30 : 0
    // the job's effects on the rock
    if (j && j.on === 'rock' && j.kind !== 'mb') {
      const k = clamp((age - MOVE) / DUR[j.kind])
      if (j.kind === 'brush') brushedMat.opacity = Math.max(brushedMat.opacity, 0.92 * k)
      else {
        brushedMat.opacity = 0.92
        hole.scale.setScalar(Math.max(0.001, k))
        powderMat.opacity = 0.85 * k
      }
      if (working && Math.random() < dt * 3) puffAt(ROCK_TOP.clone().add(V(0, 0.03, 0)), j.kind === 'brush' ? '#c8704a' : '#9a9898')
    }
    // the job ends: its result stands (for everyone), its words for the one who did it
    if (j && !j.done && age >= jobEnd(j)) {
      j.done = true
      if (j.kind === 'brush') A.rock = Math.max(A.rock, 1)
      else if (j.kind === 'grind') A.rock = 2
      else {
        A.done[j.on] = 1
        A.last = j.on
      }
      repanel(armPanel)
      if (j.mine) {
        const lv = level()
        if (j.kind === 'mb') {
          say(at(E.arm.says.result[j.on], lv))
          play('discover')
        } else say(at(j.kind === 'brush' ? E.arm.says.brushed : E.arm.says.ground, lv))
      }
    }
    // the screen: the measurement under way, or the last one
    const showing = j?.kind === 'mb' && !j.done ? j.on : A.last
    const p = j?.kind === 'mb' && !j.done ? clamp((age - MOVE) / DUR.mb) : 1
    drawSpectrum(showing, showing ? p : 0)
    if (showing !== armWas) armWas = showing
  })
  const armSet = (s, live, ago = 0) => {
    const rockS = clamp(Math.round(Number(s?.rock) || 0), 0, 2)
    const d = s?.done ?? {}
    A.done = { rock: d.rock ? 1 : 0, dust: d.dust ? 1 : 0, berry: d.berry ? 1 : 0 }
    A.last = TARGETS[s?.last] ? s.last : null
    A.rock = rockS
    const j = s?.job
    if (j && DUR[j.kind] && TARGETS[j.on]) {
      const age = Math.max(0, Number(j.age) || 0) + (ago || 0)
      A.job = { kind: j.kind, on: j.on, start: clock() - age, mine: false, done: age >= jobEnd(j) }
      // a job already finished stands as done; one under way plays on from where it is
      if (A.job.done && j.kind === 'grind') A.rock = 2
      else if (A.job.done && j.kind === 'brush') A.rock = Math.max(A.rock, 1)
    } else A.job = null
    // what is on the rock, at once
    brushedMat.opacity = A.rock >= 1 ? 0.92 : 0
    hole.scale.setScalar(A.rock >= 2 ? 1 : 0.001)
    powderMat.opacity = A.rock >= 2 ? 0.85 : 0
    if (!live) pose = A.last || A.rock ? rover.solve(V().copy(A.last ? TARGETS[A.last] : ROCK_TOP).add(V(0, 0.28, 0.05)), 'mb') : rover.park()
    repanel(armPanel)
  }
  const armState = () => ({
    rock: A.rock,
    done: { ...A.done },
    last: A.last,
    job: A.job ? { kind: A.job.kind, on: A.job.on, age: Math.round(jobAge() * 100) / 100 } : null,
  })

  // =====================================================================================================
  // ======== station 2: the blueberries, the ledge of bedrock and the model of its story ========
  // =====================================================================================================
  // the ledge: the crater's pale bedrock poking through the dust, berries weathering out of it
  const ledgeTex = layersTexture({ seed: 12, base: '#b89070', layers: 11 })
  disposers.push(() => ledgeTex.dispose())
  const ledgeMat = new THREE.MeshStandardMaterial({ map: ledgeTex, color: '#f0dccb', roughness: 0.95 })
  const ledge = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.42, 0.6, 3, 0.07), ledgeMat)
  ledge.position.set(LEDGE.x, groundAt(LEDGE.x, LEDGE.z) + 0.14, LEDGE.z)
  ledge.rotation.y = 0.12
  ledge.castShadow = !light
  ledge.receiveShadow = true
  root.add(ledge)
  solids.push(box(LEDGE.x, LEDGE.z, 1.7, 0.6, { rot: 0.12 }))
  const ledgeBits = new THREE.Group()
  ledge.add(ledgeBits)
  {
    const stuck = new THREE.InstancedMesh(berryGeo, berryMat, 16)
    const o = new THREE.Object3D()
    for (let i = 0; i < 16; i++) {
      const s = 0.016 + hash(6, i) * 0.008
      const onTop = i > 10
      o.position.set(-0.75 + hash(6, i, 1) * 1.5, onTop ? 0.21 + s * 0.4 : -0.12 + hash(6, i, 2) * 0.28, onTop ? -0.2 + hash(6, i, 3) * 0.4 : 0.3 - s * 0.3)
      o.scale.setScalar(s)
      o.updateMatrix()
      stuck.setMatrixAt(i, o.matrix)
    }
    ledgeBits.add(stuck)
  }
  // jarosite: yellowish grains in the rock, shining when the visitor looks for them
  const jaroMat = new THREE.MeshStandardMaterial({ color: '#c9a63a', emissive: '#ffd24a', emissiveIntensity: 0, roughness: 0.6 })
  const jaroGeo = new THREE.CircleGeometry(1, 10)
  {
    const specks = new THREE.InstancedMesh(jaroGeo, jaroMat, 40)
    const o = new THREE.Object3D()
    for (let i = 0; i < 40; i++) {
      o.position.set(-0.78 + hash(7, i) * 1.56, -0.15 + hash(7, i, 1) * 0.3, 0.302)
      o.scale.setScalar(0.006 + hash(7, i, 2) * 0.008)
      o.updateMatrix()
      specks.setMatrixAt(i, o.matrix)
    }
    ledgeBits.add(specks)
  }

  // the patch of blueberries on the ground in front of it
  const patch = new THREE.InstancedMesh(berryGeo, berryMat, 110)
  const PATCH_AT = []
  {
    const o = new THREE.Object3D()
    for (let i = 0; i < 110; i++) {
      const a = hash(8, i) * TAU
      const r = Math.sqrt(hash(8, i, 1))
      const x = PATCH.x + Math.cos(a) * r * 0.75
      const z = PATCH.z + Math.sin(a) * r * 0.36
      const s = 0.011 + hash(8, i, 2) * 0.009
      o.position.set(x, groundAt(x, z) + s * 0.75, z)
      o.scale.setScalar(s)
      o.updateMatrix()
      patch.setMatrixAt(i, o.matrix)
      PATCH_AT.push(o.position.clone())
    }
  }
  root.add(patch)
  const patchHit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.8), ghost)
  patchHit.position.set(PATCH.x, 0.05, PATCH.z)
  root.add(patchHit)

  // the magnifier: a dish on a post, a ruler in millimetres on its floor (everything in it ten times bigger)
  const dish = new THREE.Group()
  dish.position.set(DISH.x, groundAt(DISH.x, DISH.z) + 0.98, DISH.z)
  root.add(dish)
  faceTo(dish, 1.2, -4.4)
  const dishTilt = new THREE.Group()
  dishTilt.rotation.x = 0.6
  dish.add(dishTilt)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.95, 10), metal)
    post.position.set(DISH.x, groundAt(DISH.x, DISH.z) + 0.475, DISH.z)
    root.add(post)
    solids.push(circle(DISH.x, DISH.z, 0.28))
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.26, 0.05, 40), metal)
    bowl.position.y = -0.03
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.014, 8, 56), rimMat)
    rim.rotation.x = Math.PI / 2
    const rulerTex = canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#9aa0aa'
      g.fillRect(0, 0, w, w)
      // a ruler across the floor: 40 mm (ten times bigger: 1 mm is 1 cm)
      const x0 = w * 0.1
      const x1 = w * 0.9
      const y = w * 0.78
      g.fillStyle = '#d8d0b8'
      g.fillRect(x0 - 8, y - 6, x1 - x0 + 16, 64)
      g.fillStyle = '#2a2a30'
      for (let mm = 0; mm <= 40; mm++) {
        const x = x0 + (mm / 40) * (x1 - x0)
        const len = mm % 10 === 0 ? 30 : mm % 5 === 0 ? 20 : 11
        g.fillRect(x - 1, y - 6, 2, len)
        if (mm % 10 === 0) {
          g.font = '700 22px Outfit'
          g.textAlign = 'center'
          g.fillText(String(mm), x, y + 50)
        }
      }
      g.font = '700 20px Outfit'
      g.textAlign = 'right'
      g.fillText('mm', x1 + 4, y - 14)
    })
    disposers.push(() => rulerTex.dispose())
    const floor = new THREE.Mesh(new THREE.CircleGeometry(0.27, 40), new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.6 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.004
    dishTilt.add(bowl, rim, floor)
  }
  const dishTag = label(E.berries.dish, 0.038, '#e8d8c0')
  dishTag.position.set(0, 0.1, -0.33)
  dishTilt.add(dishTag)
  // the handful in the dish (ten times bigger: 3 to 6 mm across become 3 to 6 cm)
  const HAND = 7
  const HAND_AT = Array.from({ length: HAND }, (_, i) => {
    const a = (i / HAND) * TAU + 0.4
    const r = i === 0 ? 0 : 0.13
    const s = 0.018 + hash(9, i) * 0.012
    return { p: V(Math.cos(a) * r - (i === 0 ? 0.03 : 0), s, Math.sin(a) * r * 0.7 - 0.03), s }
  })
  const handful = new THREE.InstancedMesh(berryGeo, berryMat, HAND)
  handful.frustumCulled = false
  dishTilt.add(handful)
  // the berry cut open: two halves, grey hematite all through
  const cutTex = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, '#a3a9b2')
    grd.addColorStop(0.85, '#8c929b')
    grd.addColorStop(1, '#5e636c')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    const rnd = random(5)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(220,226,235,${0.15 + rnd() * 0.35})`
      g.fillRect(rnd() * w, rnd() * w, 1.5, 1.5)
    }
  })
  disposers.push(() => cutTex.dispose())
  const halves = new THREE.Group()
  // a 6 mm berry, ten times bigger
  const BIG = 0.03
  for (const s of [-1, 1]) {
    const h = new THREE.Group()
    const shell = new THREE.Mesh(new THREE.SphereGeometry(BIG, 24, 14, 0, TAU, 0, Math.PI / 2), berryMat)
    const face = new THREE.Mesh(new THREE.CircleGeometry(BIG, 24), new THREE.MeshStandardMaterial({ map: cutTex, roughness: 0.4, metalness: 0.3 }))
    face.rotation.x = Math.PI / 2
    h.add(shell, face)
    // each half lies on its round side, its cut face up (the dish leans toward the visitor); tipped, one
    // face caught the light and the other did not
    h.rotation.set(Math.PI, 0, 0)
    h.position.set(s * 0.06 - 0.03, BIG * 0.9, -0.03)
    halves.add(h)
  }
  halves.visible = false
  dishTilt.add(halves)
  const dishHit = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.14, 20), ghost)
  dishTilt.add(dishHit)

  // the model of the rock's story, ten times bigger, on a plinth: its face cut open toward the visitor
  const B = { w: 1.2, h: 0.8, d: 0.55, base: 0.46 }
  const model = new THREE.Group()
  model.position.set(MODEL.x, groundAt(MODEL.x, MODEL.z) + B.base, MODEL.z)
  faceTo(model, 1.2, -3.0)
  root.add(model)
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.36, B.base, 0.72, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#3a302c', roughness: 0.8 }))
  plinth.position.y = -B.base / 2
  model.add(plinth)
  solids.push(box(MODEL.x, MODEL.z, 1.36, 0.72, { rot: model.rotation.y }))
  const sandTex = layersTexture({ seed: 21, base: '#c2a07a', layers: 9, w: 512, h: 384 })
  disposers.push(() => sandTex.dispose())
  // the model's own layers: no red dust on the top until the end (the dust is today's)
  sandTex.userData.redraw?.(g => {
    const rnd = random(31)
    const w = 512
    const h = 384
    g.fillStyle = '#c2a07a'
    g.fillRect(0, 0, w, h)
    let y = 0
    for (let i = 0; i < 9; i++) {
      const th = (h / 9) * (0.7 + rnd() * 0.6)
      g.fillStyle = rnd() < 0.5 ? `rgba(130,90,60,${0.15 + rnd() * 0.15})` : `rgba(235,210,170,${0.15 + rnd() * 0.15})`
      g.fillRect(0, y, w, th)
      g.strokeStyle = 'rgba(80,52,34,0.5)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(0, y + th)
      for (let x = 0; x <= w; x += 16) g.lineTo(x, y + th + Math.sin(x * 0.03 + i) * 2)
      g.stroke()
      // the slanting layers of old dunes
      g.strokeStyle = 'rgba(100,68,44,0.28)'
      g.lineWidth = 1.4
      for (let x = -th * 2; x < w; x += 9 + rnd() * 6) {
        g.beginPath()
        g.moveTo(x, y + th)
        g.lineTo(x + th * 1.5, y)
        g.stroke()
      }
      y += th
    }
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(70,44,28,0.28)' : 'rgba(250,232,200,0.25)'
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
    }
  })
  const faces = []
  const faceMat = side => {
    const tx = sandTex.clone()
    tx.needsUpdate = true
    disposers.push(() => tx.dispose())
    tx.repeat.set(side, 1)
    const m = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.95, color: '#fff3e6' })
    return m
  }
  // front, back, left, right: each a plane standing on the plinth, cropped from the top as the rock wears
  const sides = [
    { w: B.w, at: V(0, 0, B.d / 2), rot: 0, rep: 1 },
    { w: B.w, at: V(0, 0, -B.d / 2), rot: Math.PI, rep: 1 },
    { w: B.d, at: V(-B.w / 2, 0, 0), rot: -Math.PI / 2, rep: B.d / B.w },
    { w: B.d, at: V(B.w / 2, 0, 0), rot: Math.PI / 2, rep: B.d / B.w },
  ]
  for (const s of sides) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s.w, B.h).translate(0, B.h / 2, 0), faceMat(s.rep))
    m.position.copy(s.at)
    m.rotation.y = s.rot
    m.castShadow = !light
    model.add(m)
    faces.push(m)
  }
  const topMat = new THREE.MeshStandardMaterial({ color: '#b48e6c', roughness: 1 })
  const top = new THREE.Mesh(new THREE.PlaneGeometry(B.w, B.d).rotateX(-Math.PI / 2), topMat)
  model.add(top)
  // the water soaking through: a blue sheen on the faces, up to the water table
  const waterTex = canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, 'rgba(110,170,255,0)')
    grd.addColorStop(0.08, 'rgba(110,170,255,0.75)')
    grd.addColorStop(1, 'rgba(60,110,220,0.85)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  disposers.push(() => waterTex.dispose())
  const waterMat = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0, depthWrite: false })
  const waters = sides.map(s => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s.w + 0.004, 1).translate(0, 0.5, 0), waterMat)
    m.position.copy(s.at).add(V(Math.sin(s.rot) * 0.003, 0, Math.cos(s.rot) * 0.003))
    m.rotation.y = s.rot
    m.raycast = () => {}
    model.add(m)
    return m
  })
  // the berries inside the model: growing in the rock, then freed as it wears away and left on top
  const MB_N = 30
  const IN = Array.from({ length: MB_N }, (_, i) => {
    const onFront = i < 20
    const s = 0.02 + hash(10, i) * 0.012
    return {
      x: onFront ? -0.54 + hash(10, i, 1) * 1.08 : (i % 2 ? -1 : 1) * (B.w / 2 - s * 0.4),
      y: 0.06 + hash(10, i, 2) * (B.h - 0.1),
      z: onFront ? B.d / 2 - s * 0.45 : -0.22 + hash(10, i, 3) * 0.44,
      s,
      grow: 0.36 + hash(10, i, 4) * 0.14,
      rest: { x: -0.5 + hash(10, i, 5) * 1.0, z: -0.2 + hash(10, i, 6) * 0.4 },
    }
  })
  const inBerries = new THREE.InstancedMesh(berryGeo, berryMat, MB_N)
  inBerries.frustumCulled = false
  model.add(inBerries)
  const inJaro = new THREE.InstancedMesh(jaroGeo, jaroMat, 36)
  inJaro.frustumCulled = false
  model.add(inJaro)
  const JARO_AT = Array.from({ length: 36 }, (_, i) => ({ x: -0.56 + hash(11, i) * 1.12, y: 0.05 + hash(11, i, 1) * (B.h - 0.12), s: 0.008 + hash(11, i, 2) * 0.008 }))
  // its sign: the stage of the story, and "ten times bigger"
  const stageSign = label('', 0.075, '#ffe9c8', { maxWidth: 1.3 })
  stageSign.position.set(0, -B.base + 0.3, 0.375)
  const zoomSign = label(E.berries.zoom, 0.045, '#d8c8b0')
  zoomSign.position.set(0, -B.base + 0.17, 0.375)
  model.add(stageSign, zoomSign)
  const modelHit = new THREE.Mesh(new THREE.BoxGeometry(B.w + 0.04, B.h, B.d + 0.04).translate(0, B.h / 2, 0), ghost)
  model.add(modelHit)

  // ---- the berries' state (shared): the handful, the model's time, the jarosite looked for ----
  const S = { scoop: 0, time: 1, jar: 0 }
  let timeNow = 1
  let fly = null
  let cutAnim = 1
  const stageOf = t => (t < 0.14 ? 0 : t < 0.36 ? 1 : t < 0.6 ? 2 : t < 0.96 ? 3 : 4)
  const T_OF = [0, 0.26, 0.5, 0.8, 1]
  let saidStage = stageOf(1)
  const berriesHint = () => {
    if (!S.scoop) return E.berries.hints.scoop
    if (S.scoop === 1) return E.berries.hints.cut
    if (S.time > 0.99 && saidStage === 4 && !modelSeen) return E.berries.hints.model
    if (!S.jar) return E.berries.hints.ledge
    return E.berries.hints.model
  }
  let modelSeen = false
  let sliding = false
  const slid = id => {
    if (sliding) return
    sliding = true
    later(0.2, () => {
      sliding = false
      share(id)
    })
  }
  const berriesPanel = panelOf(E.berries.title, E.berries.panel, () => [
    {
      slider: {
        label: E.berries.slider,
        min: 0,
        max: 1,
        step: 0.005,
        value: S.time,
        onInput: v => {
          S.time = clamp(Number(v) || 0)
          modelSeen = true
          ex.discover('berries', berriesPanel, 2)
          slid('berries')
        },
        format: v => E.berries.stages[stageOf(v)],
        live: () => S.time,
      },
    },
    {
      buttons: [
        { label: S.scoop === 0 ? E.berries.buttons.scoop : S.scoop === 1 ? E.berries.buttons.cut : E.berries.buttons.again, onClick: () => berriesStep(S.scoop === 1 ? 'dish' : 'patch') },
        { label: E.berries.buttons.step, onClick: () => berriesStep('model') },
        { label: E.berries.buttons.ledge, onClick: () => berriesStep('ledge') },
      ],
    },
  ])
  /** A visitor's step: a tap on the patch, the dish, the model or the ledge (or the panel's buttons). */
  function berriesStep(what) {
    const lv = level()
    if (what === 'patch') {
      if (fly) return say(at(W.busy, lv))
      S.scoop = 1
      startFly()
      say(at(E.berries.says.scoop, lv))
      play('select')
    } else if (what === 'dish') {
      if (!S.scoop) return say(at(E.berries.says.empty, lv))
      if (fly) return say(at(W.busy, lv))
      S.scoop = S.scoop === 1 ? 2 : 1
      cutAnim = 0
      say(at(S.scoop === 2 ? E.berries.says.cut : E.berries.says.whole, lv))
      play(S.scoop === 2 ? 'crack' : 'tap')
    } else if (what === 'model') {
      // each tap steps the story on; from today it starts again at the beginning
      const st = stageOf(S.time)
      const next = st >= 4 ? 0 : st + 1
      S.time = T_OF[next]
      modelSeen = true
      say(at(E.berries.says.stages[next], lv))
      saidStage = next
      play('tap')
    } else if (what === 'ledge') {
      S.jar = 1
      say(at(S.time < 0.2 ? E.berries.says.ledgeEarly : E.berries.says.ledge, lv))
      play('select')
    } else return
    ex.discover('berries', berriesPanel, 2.6)
    repanel(berriesPanel)
    share('berries')
  }
  const startFly = (start = clock()) => {
    fly = { start }
  }
  clickable(patchHit, () => berriesStep('patch'))
  clickable(dishHit, () => berriesStep('dish'))
  clickable(modelHit, () => berriesStep('model'))
  clickable(ledge, () => berriesStep('ledge'))
  ex.add({
    id: 'berries',
    x: 1.2,
    z: -4.95,
    radius: 1.8,
    manual: true,
    label: E.berries.label,
    verb: berriesHint,
    focus: { x: 1.35, y: 0.75, z: -7.05, size: 3.1, width: 4.5 },
    act: () => ctx.showPanel(berriesPanel),
  })
  const tmpW = V()
  updates.push((dt, t) => {
    // the model's time glides to where it was sent
    timeNow = damp(timeNow, S.time, 2.2, dt)
    if (Math.abs(timeNow - S.time) < 0.0005) timeNow = S.time
    const tt = timeNow
    const st = stageOf(tt)
    setText(stageSign, E.berries.stages[st])
    // the rock wears down from 0.8 m to about 0.48 m
    const H = B.h - 0.32 * span(0.62, 0.95, tt)
    const k = H / B.h
    faces.forEach(m => {
      m.scale.y = k
      m.material.map.repeat.y = k
    })
    top.position.y = H
    // loose sand at first, then cemented rock; today's red dust on the top at the end
    const cement = span(0.18, 0.4, tt)
    faces.forEach(m => m.material.color.set('#fff3e6').multiplyScalar(1.08 - 0.16 * cement))
    topMat.color.set('#c8a27c').lerp(new THREE.Color('#8a4a30'), span(0.9, 1, tt))
    // the groundwater: rising and falling through the sand while it lasts
    const wet = bump(0.12, 0.44, tt)
    const level_ = 0.12 + 0.7 * (0.5 - 0.5 * Math.cos(clamp((tt - 0.12) / 0.32) * TAU * 1.5))
    waterMat.opacity = 0.3 * wet
    waters.forEach(m => {
      m.visible = wet > 0.01
      m.scale.y = Math.max(0.01, Math.min(level_, H))
    })
    waterTex.offset.x = t * 0.05
    // jarosite grains, formed in the acid water
    const jk = span(0.2, 0.32, tt)
    JARO_AT.forEach((j, i) => {
      om.position.set(j.x, j.y, B.d / 2 + 0.004)
      om.rotation.set(0, 0, 0)
      om.scale.setScalar(j.y < H - 0.01 ? Math.max(0.0001, j.s * jk) : 0.0001)
      om.updateMatrix()
      inJaro.setMatrixAt(i, om.matrix)
    })
    inJaro.instanceMatrix.needsUpdate = true
    jaroMat.emissiveIntensity = damp(jaroMat.emissiveIntensity, S.jar ? 0.6 + 0.25 * Math.sin(t * 3) : 0, 3, dt)
    // the berries: growing inside, then freed and lying on the worn top
    IN.forEach((b, i) => {
      const g = span(b.grow, b.grow + 0.12, tt)
      const free = b.y + b.s * 0.3 > H
      if (free && g > 0.5) om.position.set(b.rest.x, H + b.s * 0.85, b.rest.z)
      else om.position.set(b.x, b.y, b.z)
      om.rotation.set(0, 0, 0)
      om.scale.setScalar(Math.max(0.0001, b.s * g))
      om.updateMatrix()
      inBerries.setMatrixAt(i, om.matrix)
    })
    inBerries.instanceMatrix.needsUpdate = true
    // the handful flying from the ground into the dish, or lying there
    let flyK = 1
    if (fly) {
      flyK = clamp((clock() - fly.start) / 1.3)
      if (flyK >= 1) fly = null
    }
    dishTilt.updateMatrixWorld(true)
    HAND_AT.forEach((h, i) => {
      const there = S.scoop > 0
      const hidden = !there || (S.scoop === 2 && i === 0)
      if (hidden && !(fly && there)) {
        om.scale.setScalar(0.0001)
      } else {
        const kk = ease(clamp(flyK * 1.25 - i * 0.04))
        if (kk < 1) {
          const from = PATCH_AT[i * 13]
          const to = dishTilt.localToWorld(tmpW.copy(h.p))
          const p = from.clone().lerp(to, kk)
          p.y += Math.sin(kk * Math.PI) * 0.6
          dishTilt.worldToLocal(p)
          om.position.copy(p)
          om.scale.setScalar(h.s * (0.6 + 0.4 * kk))
        } else {
          om.position.copy(h.p)
          om.scale.setScalar(h.s)
        }
      }
      om.rotation.set(0, 0, 0)
      om.updateMatrix()
      handful.setMatrixAt(i, om.matrix)
    })
    handful.instanceMatrix.needsUpdate = true
    // the halves part as the berry is cut
    cutAnim = Math.min(1, cutAnim + dt / 0.6)
    halves.visible = S.scoop === 2
    halves.children.forEach((h, i) => (h.position.x = (i ? 1 : -1) * (0.015 + 0.05 * ease(cutAnim)) - 0.03))
  })
  const berriesSet = (s, live) => {
    const scoop = clamp(Math.round(Number(s?.scoop) || 0), 0, 2)
    if (live && scoop === 1 && S.scoop === 0) startFly()
    if (scoop !== S.scoop && live && scoop === 2) cutAnim = 0
    S.scoop = scoop
    S.time = clamp(Number(s?.time ?? 1))
    S.jar = s?.jar ? 1 : 0
    if (!live) {
      timeNow = S.time
      fly = null
      cutAnim = 1
    }
    repanel(berriesPanel)
  }

  // =====================================================================================================
  // ======== station 3: the sky clock (the rovers' sundial) and the evening sky ========
  // =====================================================================================================
  const dialG = new THREE.Group()
  dialG.position.set(DIAL.x, groundAt(DIAL.x, DIAL.z), DIAL.z)
  root.add(dialG)
  solids.push(circle(DIAL.x, DIAL.z, 0.3))
  const DIAL_Y = 1.0
  // five times the real dial (about 3 inches, 7.6 cm, square), as the panel says
  const DS = 0.38
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, DIAL_Y, 10), metal)
    post.position.y = DIAL_Y / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 20), metal)
    foot.position.y = 0.025
    dialG.add(post, foot)
  }
  const dialTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#5a5d64'
    g.fillRect(0, 0, w, w)
    // grey rings round the middle, as the real one has, for the camera's brightness
    for (const [r, c] of [[0.42, '#2a2c30'], [0.34, '#8a8d92'], [0.26, '#c8c8c4'], [0.16, '#3a3c40']]) {
      g.fillStyle = c
      g.beginPath()
      g.arc(w / 2, w / 2, r * w, 0, TAU)
      g.fill()
    }
    // colour chips in the corners, for the camera's colours
    for (const [x, y, c] of [[0.09, 0.09, '#c83a32'], [0.91, 0.09, '#3a9a48'], [0.09, 0.91, '#3a5cc8'], [0.91, 0.91, '#e2c03a']]) {
      g.fillStyle = c
      g.fillRect((x - 0.065) * w, (y - 0.065) * w, 0.13 * w, 0.13 * w)
    }
    g.fillStyle = '#e8e8e4'
    g.font = '700 34px Outfit'
    g.textAlign = 'center'
    g.fillText('MARS 2004', w / 2, w * 0.97)
    // hour marks round the rings
    g.strokeStyle = '#e8e8e4'
    g.lineWidth = 3
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU
      g.beginPath()
      g.moveTo(w / 2 + Math.cos(a) * w * 0.43, w / 2 + Math.sin(a) * w * 0.43)
      g.lineTo(w / 2 + Math.cos(a) * w * 0.47, w / 2 + Math.sin(a) * w * 0.47)
      g.stroke()
    }
  })
  disposers.push(() => dialTex.dispose())
  const plate = new THREE.Mesh(new THREE.BoxGeometry(DS, 0.025, DS), [metal, metal, new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.6 }), metal, metal, metal])
  plate.position.y = DIAL_Y
  dialG.add(plate)
  const GN = 0.11
  const gnomon = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, GN, 10), metal)
  gnomon.position.y = DIAL_Y + 0.0125 + GN / 2
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 10), new THREE.MeshStandardMaterial({ color: '#b88a3c', metalness: 0.7, roughness: 0.4 }))
  knob.position.y = DIAL_Y + 0.0125 + GN
  dialG.add(gnomon, knob)
  // the gnomon's shadow on the dial (drawn, so it reads clearly)
  const shadowMat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.6, depthWrite: false })
  const gShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.018, 1).translate(0, 0.5, 0).rotateX(-Math.PI / 2), shadowMat)
  gShadow.position.y = DIAL_Y + 0.0135
  dialG.add(gShadow)
  const dialHit = new THREE.Mesh(new THREE.BoxGeometry(DS + 0.1, 0.4, DS + 0.1), ghost)
  dialHit.position.y = DIAL_Y + 0.1
  dialG.add(dialHit)
  // the time, above the dial
  const timeTag = label('', 0.11, '#ffe9c8')
  timeTag.position.set(0, DIAL_Y + 0.42, 0)
  const timeCap = label(E.sky.time, 0.045, '#d8c8b0')
  timeCap.position.set(0, DIAL_Y + 0.52, 0)
  const tagG = new THREE.Group()
  tagG.add(timeTag, timeCap)
  dialG.add(tagG)
  tagG.rotation.y = Math.atan2(4.2 - DIAL.x, -1.2 - DIAL.z)

  // the sky to tap (round the clock only), and the Earth
  const skyHit = new THREE.Mesh(new THREE.SphereGeometry(90, 16, 10), new THREE.MeshBasicMaterial({ visible: false, side: THREE.BackSide }))
  skyHit.position.set(DIAL.x, 0, DIAL.z)
  root.add(skyHit)
  const nearDial = () => {
    const p = ctx.engine.player.pos
    return Math.hypot(p.x - DIAL.x, p.z - DIAL.z) < 6.5
  }
  const earthMat = new THREE.SpriteMaterial({ map: soft, color: hdr('#bfe0ff', 2.2), transparent: true, opacity: 0, depthWrite: false, fog: false })
  const earth = new THREE.Sprite(earthMat)
  const EARTH_AT = V(DIAL.x, 0, DIAL.z).addScaledVector(EARTH_DIR, 80)
  earth.position.copy(EARTH_AT)
  earth.scale.setScalar(2.4)
  earth.raycast = () => {}
  root.add(earth)
  const earthHit = new THREE.Mesh(new THREE.SphereGeometry(5, 10, 8), ghost)
  earthHit.position.copy(EARTH_AT)
  root.add(earthHit)
  const earthTag = label(E.sky.earth, 2.2, '#cfe6ff')
  earthTag.position.copy(EARTH_AT).add(V(0, 4.2, 0))
  earthTag.material.fog = false
  earthTag.lookAt(DIAL.x, 1.5, DIAL.z + 3)
  root.add(earthTag)

  // the lens: a speck of dust in the sunlight, blue sent forwards, red spread wide
  const lensC = new THREE.Group()
  lensC.position.copy(LENS_C)
  lensC.lookAt(4.2, 1.45, -1.2)
  root.add(lensC)
  const LC = 0.46
  lensC.add(new THREE.Mesh(new THREE.CircleGeometry(LC, 64), navy), new THREE.Mesh(new THREE.TorusGeometry(LC, 0.03, 10, 72), rimMat))
  const grain = new THREE.Mesh(rockGeometry(5, 2).center(), new THREE.MeshStandardMaterial({ color: '#b0603a', roughness: 0.8, emissive: '#3a1a0c' }))
  grain.scale.setScalar(0.06)
  grain.position.z = 0.04
  lensC.add(grain)
  const lcTitle = label(E.sky.lens.title, 0.06, hdr(color, 1.2))
  lcTitle.position.set(0, LC + 0.09, 0.01)
  const lcSun = label(E.sky.lens.sun, 0.042, '#ffe9a0', { anchorX: 'left' })
  lcSun.position.set(-LC + 0.07, 0.08, 0.02)
  const lcYou = label(E.sky.lens.you, 0.042, '#cfe6ff', { anchorX: 'right' })
  lcYou.position.set(LC - 0.07, 0.08, 0.02)
  const sunDot = new THREE.Mesh(new THREE.CircleGeometry(0.03, 20), new THREE.MeshBasicMaterial({ color: hdr('#fff2c0', 1.8), toneMapped: false }))
  sunDot.position.set(-LC + 0.1, 0, 0.02)
  lensC.add(lcTitle, lcSun, lcYou, sunDot)
  const PH = light ? 30 : 54
  const photons = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.012, 0.004), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), PH)
  photons.position.z = 0.05
  photons.frustumCulled = false
  photons.raycast = () => {}
  lensC.add(photons)
  const phot = Array.from({ length: PH }, (_, i) => ({ seed: hash(13, i), kind: i % 3 }))
  const PC = { white: new THREE.Color('#ffffff').multiplyScalar(1.6), blue: new THREE.Color('#5fa0ff').multiplyScalar(1.8), red: new THREE.Color('#ff7a4a').multiplyScalar(1.6) }

  // ---- the sky's state (shared): the hour, the lens ----
  const K = { hour: HOUR.start, lens: 0, earth: 0 }
  let hourNow = HOUR.start
  let lensCK = 0
  const sunNow = marsSun(HOUR.start)
  const partOf = h => (h < 14.5 ? 'noon' : h < 17.4 ? 'afternoon' : h < 18.05 ? 'sunset' : h < 18.9 ? 'after' : 'night')
  let saidPart = partOf(HOUR.start)
  const earthUp = () => hourNow > 18.35
  const skyHint = () => {
    if (!skySeen) return E.sky.hints.dial
    if (!K.lens && !lensSeen) return E.sky.hints.sky
    if (earthUp() && !earthSeen) return E.sky.hints.earth
    if (hourNow < 18.2) return E.sky.hints.later
    return E.sky.hints.dial
  }
  let skySeen = false
  let lensSeen = false
  let earthSeen = false
  const skyPanel = panelOf(E.sky.title, E.sky.panel, () => [
    {
      slider: {
        label: E.sky.slider,
        min: HOUR.min,
        max: HOUR.max,
        step: 0.05,
        value: K.hour,
        onInput: v => {
          K.hour = clamp(Number(v) || HOUR.start, HOUR.min, HOUR.max)
          skySeen = true
          ex.discover('sky', skyPanel, 3)
          slid('sky')
        },
        format: v => `${clockText(v)} · ${E.sky.parts[partOf(v)]}`,
        live: () => K.hour,
      },
    },
    {
      buttons: [
        { label: E.sky.buttons.later, onClick: () => skyStep('dial') },
        { label: K.lens ? E.sky.buttons.lensOff : E.sky.buttons.lens, onClick: () => skyStep('sky') },
        { label: E.sky.buttons.earth, onClick: () => skyStep('earth') },
      ],
    },
  ])
  /** A visitor's step: a tap on the dial (the Sun on), the sky (the lens), the Earth. */
  function skyStep(what) {
    const lv = level()
    if (what === 'dial') {
      const next = STOPS.find(s => s > K.hour + 0.02) ?? STOPS[0]
      K.hour = next
      skySeen = true
      say(at(E.sky.says[partOf(next)], lv))
      saidPart = partOf(next)
      play('tap')
    } else if (what === 'sky') {
      K.lens = K.lens ? 0 : 1
      lensSeen = true
      say(at(K.lens ? E.sky.says.lens : E.sky.says.lensOff, lv))
      play('select')
    } else if (what === 'earth') {
      if (!earthUp()) return say(at(E.sky.says.noEarth, lv))
      earthSeen = true
      K.earth++
      say(at(E.sky.says.earth, lv))
      play('discover')
    } else return
    ex.discover('sky', skyPanel, 3)
    repanel(skyPanel)
    share('sky')
  }
  clickable(dialHit, () => skyStep('dial'))
  clickable(skyHit, () => skyStep('sky'), { when: nearDial, reach: 100, accept: h => h.point.y > 2 })
  clickable(earthHit, () => skyStep('earth'), { when: () => nearDial() && earthUp(), reach: 100 })
  clickable(lensC, () => skyStep('sky'), { when: () => K.lens > 0 })
  ex.add({
    id: 'sky',
    x: 4.2,
    z: -1.45,
    radius: 1.4,
    manual: true,
    label: E.sky.label,
    verb: skyHint,
    focus: { x: 4.1, y: 1.3, z: -3.6, size: 2.3, width: 3.6 },
    act: () => ctx.showPanel(skyPanel),
  })
  let earthK = 0
  updates.push((dt, t) => {
    // the hour glides to where it was sent
    const d = K.hour - hourNow
    if (Math.abs(d) > 1e-4) hourNow += Math.sign(d) * Math.min(Math.abs(d), (0.6 + 2.5 * Math.abs(d)) * dt)
    marsSun(hourNow, sunNow)
    stage.setSun(sunNow)
    setText(timeTag, clockText(hourNow))
    // once the slider rests in another part of the day, the Atomling says what is happening
    const part = partOf(hourNow)
    if (part !== saidPart && Math.abs(d) < 0.01 && skySeen) {
      saidPart = part
      say(at(E.sky.says[part], level()))
    }
    // the dial's shadow: from the gnomon away from the Sun, as long as the Sun is low
    const up = sunNow.y
    shadowMat.opacity = 0.6 * clamp(up / 0.05)
    if (up > 0.002) {
      const len = Math.min(DS * 0.48, GN / Math.max(0.05, up / Math.hypot(sunNow.x, sunNow.z)))
      gShadow.scale.set(1, 1, len)
      // the plane runs along -z: turned so that it points away from the Sun
      gShadow.rotation.y = Math.atan2(sunNow.x, sunNow.z) - dialG.rotation.y
    }
    // the Earth, a bright evening star once the sky is dark enough
    earthK = damp(earthK, earthUp() ? 1 : 0, 1.5, dt)
    earthMat.opacity = earthK * (0.85 + 0.15 * Math.sin(t * 2.3))
    earth.visible = earthK > 0.01
    earthTag.visible = earthK > 0.3 && (earthSeen || K.earth > 0)
    // the lens of the dust grain
    lensCK = damp(lensCK, K.lens ? 1 : 0, 4, dt)
    lensC.visible = lensCK > 0.02
    lensC.scale.setScalar(Math.max(0.001, ease(lensCK)))
    if (lensC.visible) {
      grain.rotation.y = t * 0.3
      phot.forEach((p, i) => {
        // each photon: in from the Sun (left), then out from the grain: blue in a narrow cone forward,
        // red spread wide
        const u = (t * 0.45 + p.seed) % 1
        const dir = p.kind === 0 ? 0 : (hash(14, i, Math.floor(t * 0.45 + p.seed)) - 0.5) * (p.kind === 1 ? 0.45 : 2.4)
        if (u < 0.5) {
          const x = -LC + 0.12 + (u / 0.5) * (LC - 0.12)
          om.position.set(x, (p.seed - 0.5) * 0.05, 0)
          om.rotation.set(0, 0, 0)
          photons.setColorAt(i, PC.white)
        } else {
          const r = ((u - 0.5) / 0.5) * (LC - 0.08)
          om.position.set(Math.cos(dir) * r, Math.sin(dir) * r, 0)
          om.rotation.set(0, 0, dir)
          photons.setColorAt(i, p.kind === 1 ? PC.blue : p.kind === 2 ? PC.red : PC.white)
        }
        om.scale.setScalar(p.kind === 0 && u >= 0.5 ? 0.0001 : 1)
        om.updateMatrix()
        photons.setMatrixAt(i, om.matrix)
      })
      photons.instanceMatrix.needsUpdate = true
      if (photons.instanceColor) photons.instanceColor.needsUpdate = true
    }
  })
  const skySet = (s, live) => {
    K.hour = clamp(Number(s?.hour ?? HOUR.start), HOUR.min, HOUR.max)
    K.lens = s?.lens ? 1 : 0
    K.earth = Math.max(0, Math.round(Number(s?.earth) || 0))
    if (!live) {
      hourNow = K.hour
      lensCK = K.lens
      saidPart = partOf(K.hour)
    }
    repanel(skyPanel)
  }

  // =====================================================================================================
  // ======== station 4: the magnets, gathering the magnetic dust ========
  // =====================================================================================================
  const magG = new THREE.Group()
  magG.position.set(MAGS.x, groundAt(MAGS.x, MAGS.z), MAGS.z)
  faceTo(magG, 6.0, -0.4)
  root.add(magG)
  solids.push(circle(MAGS.x, MAGS.z, 0.28))
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.95, 10), metal)
    post.position.y = 0.475
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.05, 20), metal)
    foot.position.y = 0.025
    magG.add(post, foot)
  }
  const magTilt = new THREE.Group()
  magTilt.position.y = 1.0
  magTilt.rotation.x = 0.6
  magG.add(magTilt)
  magTilt.add(new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.035, 0.36, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#d8d2c6', roughness: 0.6 })))
  const mags = ['capture', 'filter'].map((kind, i) => {
    const tex = canvasTex(256, 256, null, { mipmaps: false })
    disposers.push(() => tex.dispose())
    const capMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.4 })
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.03, 40), [metal, capMat, metal])
    disc.position.set(i ? 0.16 : -0.16, 0.03, 0)
    magTilt.add(disc)
    const tag = label(E.magnets.labels[kind], 0.04, '#ffe9c8')
    tag.position.set(i ? 0.16 : -0.16, 0.02, 0.23)
    tag.rotation.x = -Math.PI / 2
    magTilt.add(tag)
    return { kind, tex, drawn: -1 }
  })
  /** The dust on a magnet after `sols`: a ring round a dark middle (the capture magnet), fainter on the
   *  weaker filter magnet, which keeps only the most magnetic grains. */
  const drawMagnet = (m, sols) => {
    const k = clamp(sols / 300)
    const key = Math.round(k * 60)
    if (key === m.drawn) return
    m.drawn = key
    m.tex.userData.redraw((g, w) => {
      g.fillStyle = '#7d8088'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = '#5c5f66'
      g.lineWidth = 4
      for (const r of [0.2, 0.32, 0.45]) {
        g.beginPath()
        g.arc(w / 2, w / 2, r * w, 0, TAU)
        g.stroke()
      }
      const strong = m.kind === 'capture'
      const rnd = random(strong ? 3 : 4)
      // the dust: piled in a ring over the magnet's edge and a spot over its middle
      const grains = Math.round((strong ? 2600 : 1100) * k)
      for (let i = 0; i < grains; i++) {
        const a = rnd() * TAU
        const ring = rnd() < 0.7
        const r = ring ? 0.3 + (rnd() - 0.5) * (strong ? 0.16 : 0.08) : rnd() * (strong ? 0.12 : 0.06)
        const x = w / 2 + Math.cos(a) * r * w
        const y = w / 2 + Math.sin(a) * r * w
        g.fillStyle = strong ? `rgba(${150 + rnd() * 40},${70 + rnd() * 30},${40 + rnd() * 20},0.7)` : `rgba(${60 + rnd() * 30},${40 + rnd() * 20},${34 + rnd() * 20},0.75)`
        g.fillRect(x, y, 2 + rnd() * 2, 2 + rnd() * 2)
      }
    })
  }
  const solTag = label('', 0.06, '#ffe9c8')
  solTag.position.set(0, 1.42, 0)
  const solCap = label(E.magnets.sol, 0.04, '#d8c8b0')
  solCap.position.set(0, 1.51, 0)
  magG.add(solTag, solCap)
  const magHit = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.45), ghost)
  magTilt.add(magHit)
  const M = { sols: 0 }
  let solsNow = 0
  let magSeen = false
  const magPanel = panelOf(E.magnets.title, E.magnets.panel, () => [
    {
      slider: {
        label: E.magnets.slider,
        min: 0,
        max: 400,
        step: 1,
        value: M.sols,
        onInput: v => {
          M.sols = clamp(Math.round(Number(v) || 0), 0, 400)
          magSeen = true
          ex.discover('magnets', magPanel, 2.5)
          slid('magnets')
        },
        format: v => fill(E.magnets.count, { n: Math.round(v) }),
        live: () => M.sols,
      },
    },
    { buttons: [{ label: E.magnets.buttons.more, onClick: () => magStep('more') }, { label: E.magnets.buttons.clean, onClick: () => magStep('clean') }] },
  ])
  function magStep(what) {
    const lv = level()
    if (what === 'more') {
      M.sols = M.sols >= 400 ? 0 : Math.min(400, M.sols + 60)
      say(at(M.sols === 0 ? E.magnets.says.clean : M.sols < 150 ? E.magnets.says.few : E.magnets.says.many, lv))
      play('tap')
    } else if (what === 'clean') {
      M.sols = 0
      say(at(E.magnets.says.clean, lv))
      play('tap')
    } else return
    magSeen = true
    ex.discover('magnets', magPanel, 2.5)
    share('magnets')
  }
  clickable(magHit, () => magStep('more'))
  ex.add({
    id: 'magnets',
    x: 6.05,
    z: -0.75,
    radius: 1.2,
    manual: true,
    label: E.magnets.label,
    verb: () => (magSeen && M.sols >= 400 ? E.magnets.hints.full : E.magnets.hints.tap),
    focus: { x: MAGS.x, y: 1.05, z: MAGS.z, size: 1.1 },
    act: () => ctx.showPanel(magPanel),
  })
  updates.push((dt, t) => {
    const d = M.sols - solsNow
    if (Math.abs(d) > 0.01) solsNow += Math.sign(d) * Math.min(Math.abs(d), (40 + 3 * Math.abs(d)) * dt)
    else solsNow = M.sols
    for (const m of mags) drawMagnet(m, solsNow)
    setText(solTag, fill(E.magnets.count, { n: Math.round(solsNow) }))
  })
  const magSet = (s, live) => {
    M.sols = clamp(Math.round(Number(s?.sols) || 0), 0, 400)
    if (!live) solsNow = M.sols
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    floor: groundAt,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.2 },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: -1.3, z: 3.2, yaw: Math.atan2(1.3, -1.2) },
    back: { x: 0, z: 6.8, rot: Math.PI },
    stand: { x: 2.1, z: 3.4, rot: Math.atan2(-2.1, 1.2) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      arm: {
        tap: what => armStep(what), // 'rock', 'dust', 'berry'; or 'fresh' (the panel's button)
        get state() { return armState() },
        get busy() { return busy() },
        rockAt: () => ROCK_TOP.clone(),
        dustAt: () => DUST_TOP.clone(),
        berryAt: () => BERRY_TOP.clone(),
      },
      berries: {
        tap: what => berriesStep(what), // 'patch', 'dish', 'model', 'ledge'
        set: v => {
          S.time = clamp(v)
          share('berries')
        },
        get state() { return { ...S } },
        patchAt: () => V(PATCH.x, 0.05, PATCH.z),
        dishAt: () => dish.getWorldPosition(V()),
        modelAt: () => model.localToWorld(V(0, 0.5, B.d / 2)),
        ledgeAt: () => ledge.getWorldPosition(V()).add(V(0, 0.1, 0.3)),
      },
      sky: {
        tap: what => skyStep(what), // 'dial', 'sky', 'earth'
        set: h => {
          K.hour = clamp(h, HOUR.min, HOUR.max)
          share('sky')
        },
        get state() { return { ...K } },
        dialAt: () => V(DIAL.x, DIAL_Y, DIAL.z),
        earthAt: () => EARTH_AT.clone(),
      },
      magnets: {
        tap: what => magStep(what), // 'more', 'clean'
        set: n => {
          M.sols = clamp(Math.round(n), 0, 400)
          share('magnets')
        },
        get state() { return { ...M } },
        at: () => magTilt.getWorldPosition(V()),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { arm: armPanel, berries: berriesPanel, sky: skyPanel, magnets: magPanel },
    shared: {
      arm: { get: armState, set: armSet },
      berries: { get: () => ({ ...S }), set: berriesSet },
      sky: { get: () => ({ ...K }), set: skySet },
      magnets: { get: () => ({ ...M }), set: magSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const f of disposers) f()
    },
  }
}
