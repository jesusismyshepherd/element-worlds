// Radon's picture "How does a rock breathe out a gas?" as a room (docs/knowledge/picture-rooms.md): a granite
// hillside of the Serra da Estrela at dusk (stages/tors.js), the picture's big boulder cut open in the middle,
// radon rising out of its crack, the uranium family's staircase floating above it. Three things to do, each
// step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the
// prompt names the next tap, E opens the station's panel, whose buttons and sliders do the same:
// - the grains (the picture's lens made giant): a pink feldspar grain below, a grey quartz grain above, a pore
//   between. Tap the green radium atom and it breaks apart: the alpha particle flies one way, the new radon
//   atom recoils the other, and stops in its own grain (born too deep), in the quartz opposite (across a dry
//   pore) or in the pore's water (free). Tap the pink grain to move the radium deeper or shallower (a depth
//   slider too), the dropper to wet the pore (a water slider), the board for 20 tries at once. Each try's
//   direction comes from its number, so every screen in a room sees the same;
// - the soil column, three metres of soil in glass: tap a level and twenty radon atoms born there wander at
//   random and break apart at random moments (3.8 days, sped up) into amber polonium dots; those reaching the
//   top drift away into the air, and a board keeps how many of twenty got out from each depth. Tap the rain
//   cloud: wet soil, radon crawls, fewer get out. A release is drawn from its number, the same everywhere;
// - the family: the uranium-238 series as the picture's staircase in the sky, each atom on its step; tap one to
//   meet it (its half-life, solid or gas). Radon's step is empty: its atom floats above it, the one gas.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes. Sources: the head of rock.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, smooth, damp, random, standingScreen } from '../../../wings/noble/kit.js'
import { torsStage, boulderGeometry, GRANITE } from '../../stages/tors.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { element, nameOf } from '../../../../data/elements.js'
import { RN_ROCK_WORDS } from './rock.words.js'

export const WORDS = RN_ROCK_WORDS

const TAU = Math.PI * 2
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const wall = () => Date.now() / 1000
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// the radon atoms of all seven rooms: teal with a soft halo
const RN_C = '#3cc3d6'
const RN_GLOW = '#6ff0ff'
// the family's colours (the pictures' Jmol colours, rnkit.py)
const ATOM_C = { U: '#2f8fff', Th: '#2fb8f0', Pa: '#2fa0f0', Ra: '#2fa82f', Rn: RN_C, Po: '#c7731e', Pb: '#6b6e78', Bi: '#a964c2' }
// the uranium-238 series: symbol, mass number, how it decays ('a' alpha, 'b' beta, null stable); the chain
// passes through protactinium's excited state, Pa-234m
const SERIES = [
  ['U', 238, 'a'], ['Th', 234, 'b'], ['Pa', '234m', 'b'], ['U', 234, 'a'], ['Th', 230, 'a'], ['Ra', 226, 'a'], ['Rn', 222, 'a'],
  ['Po', 218, 'a'], ['Pb', 214, 'b'], ['Bi', 214, 'b'], ['Po', 214, 'a'], ['Pb', 210, 'b'], ['Bi', 210, 'b'], ['Po', 210, 'a'], ['Pb', 206, null],
]
const RN_I = 6

// ---- where things stand (metres; the spawn at z = 5.4 looks along -z) ----
const BOULDER = { x: 0, z: -6.6, r: 2.6 }
const LENS = { x: -5.0, z: -3.3, rot: 0.5 }
const COL = { x: 5.0, z: -3.5, rot: -0.5 }
const STAIR = { x0: -2.15, y0: 4.6, z: -6.05, step: 0.3, da: 0.17, db: 0.06 }

// ---- the grains: a model in nanometres ----
const NM = 1 / 60 // metres in the lens per nanometre
const RM = 40 // the recoil's range in the crystals, nm (minerals: 20 to 70)
const RW = 100 // in water
const RA = 63000 // in air
const LR = 1.65 // the lens's ring
const LI = 1.57 // inside it
const LY = 1.9 // its centre's height
const ys = x => -0.33 + 0.05 * Math.sin(2.1 * x + 0.5) + 0.025 * Math.sin(5.3 * x + 1.2) // feldspar's surface
const yq = x => 0.84 + 0.05 * Math.sin(1.7 * x + 2.0) + 0.025 * Math.sin(4.4 * x + 0.3) // quartz's
const DMAX = 65 // nm
const XMAX = 0.35
const GRAIN_D = 0.5 // the grains' thickness
const FZ = GRAIN_D / 2 + 0.02 // where atoms and tracks are drawn, just in front of the cut

/** One try: radium at depth d (nm) below the surface at x0, water filling w of the pore. The direction comes
 *  from the try's number n (isotropic in 3D); the recoil spends its range through crystal, water and air. */
function recoil(n, d, x0, w) {
  const cz = 2 * hash(n, 1) - 1
  const ph = TAU * hash(n, 2)
  const s = Math.sqrt(Math.max(0, 1 - cz * cz))
  const dx = s * Math.cos(ph)
  const dy = cz
  const dz = s * Math.sin(ph)
  let x = x0
  let y = ys(x0) - d * NM
  let z = 0
  let f = 1
  const stepNm = 0.5
  const st = stepNm * NM
  const pts = [[x, y]]
  let where = 'stuck'
  for (let k = 0; k < 6000 && f > 0; k++) {
    x += dx * st
    y += dy * st
    z += dz * st
    const top = ys(x)
    const wet = top + w * (yq(x) - top)
    if (y < top) {
      where = 'stuck'
      f -= stepNm / RM
    } else if (y < wet) {
      where = 'free'
      f -= stepNm / RW
    } else if (y < yq(x)) {
      where = 'air'
      f -= stepNm / RA
    } else {
      where = 'buried'
      f -= stepNm / RM
    }
    if (k % 3 === 0) pts.push([x, y])
    // flying along a dry gap, it meets a grain wall farther on
    if (where === 'air' && (Math.abs(x) > 1.4 || Math.abs(z) > 1.5)) break
  }
  pts.push([x, y])
  if (where === 'air') where = 'buried'
  return { pts, end: where, ax: -dx, ay: -dy }
}

// ---- the soil column ----
const COLR = 0.58
const Y0 = 0.35 // the soil's floor: 3 m down
const Y1 = 3.35 // its surface
const GLASS_TOP = 3.9
const CLOUD_Y = 4.6
const MEAN_LIFE = 3.8215 / Math.LN2 // days
const DAY = 2 // seconds of the room to a day
const L_DRY = 1.5 // diffusion length, m
const L_WET = 0.3
const MOTES = 20
const SIM_DT = 0.03
const SAMPLE = 0.36
const SIM_MAX = 34
const LEVELS = [0.5, 1, 1.5, 2, 2.5, 3]

/** A release of twenty radon atoms at depth d (m), drawn from its number k: each a random walk with its own
 *  random lifetime; walked finely, kept every SAMPLE s for drawing. */
function release(k, d, wet) {
  const L = wet ? L_WET : L_DRY
  const tau = MEAN_LIFE * DAY
  const D = (L * L) / tau
  const sig = Math.sqrt(2 * D * SIM_DT)
  const every = Math.round(SAMPLE / SIM_DT)
  const out = []
  for (let i = 0; i < MOTES; i++) {
    const rnd = random(k * 7919 + i * 104729 + (wet ? 17 : 3) + Math.round(d * 10) * 31 + 1)
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(TAU * rnd())
    const life = Math.min(SIM_MAX - 2, -tau * Math.log(1 - rnd() * 0.9999))
    let y = Y1 - d
    let x = (rnd() - 0.5) * 0.8
    const xs = [x]
    const yv = [y]
    let end = 'decay'
    let t = 0
    for (let s = 1; ; s++) {
      t = s * SIM_DT
      y += sig * gauss()
      x += sig * 0.5 * gauss() + (0 - x) * 0.01
      if (y < Y0) y = 2 * Y0 - y
      if (x > 0.48) x = 0.96 - x
      if (x < -0.48) x = -0.96 - x
      if (y >= Y1) {
        end = 'air'
        xs.push(x)
        yv.push(Y1)
        break
      }
      if (t >= life) {
        xs.push(x)
        yv.push(y)
        break
      }
      if (s % every === 0) {
        xs.push(x)
        yv.push(y)
      }
    }
    // the last stretch is shorter than SAMPLE: its own time
    out.push({ xs, ys: yv, end, t, last: t - (xs.length - 2) * SAMPLE })
  }
  return out
}
/** Where a mote is `a` seconds after its release (Catmull-Rom through its samples). */
function moteAt(m, a) {
  const n = m.xs.length
  if (a >= m.t) return [m.xs[n - 1], m.ys[n - 1]]
  let i = Math.floor(a / SAMPLE)
  let u = (a - i * SAMPLE) / SAMPLE
  if (i >= n - 2) {
    i = n - 2
    u = clamp((a - i * SAMPLE) / Math.max(0.001, m.last))
  }
  const p = j => [m.xs[clamp(j, 0, n - 1)], m.ys[clamp(j, 0, n - 1)]]
  const [a0, a1, a2, a3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
  const cr = (q0, q1, q2, q3) => 0.5 * (2 * q1 + (-q0 + q2) * u + (2 * q0 - 5 * q1 + 4 * q2 - q3) * u * u + (-q0 + 3 * q1 - 3 * q2 + q3) * u * u * u)
  return [cr(a0[0], a1[0], a2[0], a3[0]), cr(a0[1], a1[1], a2[1], a3[1])]
}

export async function build({ ctx, root, E, ex, say, later, light, level, color, clickable, lang }) {
  const stage = torsStage({
    radius: 11,
    light,
    boulders: [[-8.2, 1.5, 0.9, 5, 0.6], [8.4, 1.0, 1.1, 8, 0.62], [-7.4, -6.8, 1.3, 12, 0.58], [7.2, -7.2, 1.0, 14, 0.66], [-4.1, -9.0, 0.8, 21, 0.6]],
    clear: [[0, 7, 2.5], [0, -3, 2.8], [LENS.x, LENS.z, 2.4], [COL.x, COL.z, 2.0], [-2.6, 3.8, 1.2]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#3a3f4c', roughness: 0.5, metalness: 0.5 })
  const brass = new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.35, metalness: 0.8 })
  const label = (text, size, c = '#ffffff', extra = {}) => makeText(text, { size, color: c, outlineWidth: size * 0.06, outlineColor: '#1a1030', ...extra })
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const repanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const paras = (p, lv) => p[depthOf(lv)].map(x => ({ p: x }))
  const metres = v => (Number.isInteger(v) ? String(v) : num(v, 1, lang))
  let sliding = false
  const slid = id => {
    if (sliding) return
    sliding = true
    later(0.25, () => {
      sliding = false
      share(id)
    })
  }
  const soft = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  const starTex = canvasTex(128, 128, (g, w) => {
    g.translate(w / 2, w / 2)
    for (let i = 0; i < 8; i++) {
      g.rotate(TAU / 8)
      const grd = g.createLinearGradient(0, 0, w / 2, 0)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.beginPath()
      g.moveTo(0, -w * (i % 2 ? 0.03 : 0.05))
      g.lineTo(w / 2, 0)
      g.lineTo(0, w * (i % 2 ? 0.03 : 0.05))
      g.fill()
    }
    const c = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.2)
    c.addColorStop(0, 'rgba(255,255,255,1)')
    c.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = c
    g.fillRect(-w / 2, -w / 2, w, w)
  })
  disposers.push(() => soft.dispose(), () => starTex.dispose())
  /** Soft round points that are never a tap target (three's raycaster would catch them within a metre). */
  const cloud = (n, colour, size, opacity = 0.9, additive = true) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3))
    const mat = new THREE.PointsMaterial({ color: colour, size, map: soft, vertexColors: true, transparent: true, opacity, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    return pts
  }
  const sphere = new THREE.SphereGeometry(1, 24, 16)
  const atomMat = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3, roughness: 0.32, metalness: 0.05 })
  const radonMat = atomMat(RN_C)
  radonMat.emissiveIntensity = 0.55
  const haloMat = new THREE.SpriteMaterial({ map: soft, color: RN_GLOW, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
  /** A radon atom: a teal ball in its soft halo. */
  const radonAtom = r => {
    const g = new THREE.Group()
    const m = new THREE.Mesh(sphere, radonMat)
    m.scale.setScalar(r)
    const h = new THREE.Sprite(haloMat.clone())
    h.scale.setScalar(r * 5)
    g.add(m, h)
    return { group: g, ball: m, halo: h }
  }
  const local = (grp, x, y, z) => {
    grp.updateMatrixWorld(true)
    return grp.localToWorld(V(x, y, z))
  }

  // ======================= the boulder, cut open =======================
  const bGeo = boulderGeometry(BOULDER.r, { seed: 238, squash: 0.6, lump: 0.16, detail: 16, cut: 0 })
  disposers.push(() => bGeo.dispose())
  const bp = bGeo.attributes.position
  // its face: the triangles lying in the cut, made a mesh of their own with the grains drawn on
  const idx = bGeo.index.array
  const keep = []
  const faceTris = []
  for (let i = 0; i < idx.length; i += 3) {
    const onFace = [0, 1, 2].every(k => bp.getZ(idx[i + k]) > -1e-4)
    ;(onFace ? faceTris : keep).push(idx[i], idx[i + 1], idx[i + 2])
  }
  bGeo.setIndex(keep)
  let fx0 = Infinity
  let fx1 = -Infinity
  let fy0 = Infinity
  let fy1 = -Infinity
  for (const i of faceTris) {
    fx0 = Math.min(fx0, bp.getX(i))
    fx1 = Math.max(fx1, bp.getX(i))
    fy0 = Math.min(fy0, bp.getY(i))
    fy1 = Math.max(fy1, bp.getY(i))
  }
  const fPos = []
  const fUv = []
  for (const i of faceTris) {
    const x = bp.getX(i)
    const y = bp.getY(i)
    fPos.push(x, y, 0.004)
    fUv.push((x - fx0) / (fx1 - fx0), (y - fy0) / (fy1 - fy0))
  }
  const faceGeo = new THREE.BufferGeometry()
  faceGeo.setAttribute('position', new THREE.Float32BufferAttribute(fPos, 3))
  faceGeo.setAttribute('uv', new THREE.Float32BufferAttribute(fUv, 2))
  faceGeo.computeVertexNormals()
  disposers.push(() => faceGeo.dispose())
  const FW = 1024
  const FH = Math.round((FW * (fy1 - fy0)) / (fx1 - fx0))
  const fpx = (x, y) => [((x - fx0) / (fx1 - fx0)) * FW, (1 - (y - fy0) / (fy1 - fy0)) * FH]
  const CRACK = [[-0.32, fy1 + 0.1], [-0.42, 1.95], [-0.24, 1.45], [-0.38, 0.95], [-0.2, 0.45], [-0.3, 0.05]]
  const faceTex = canvasTex(FW, FH, g => {
    const rnd = random(1898)
    const dim = c => {
      const k = new THREE.Color(c).multiplyScalar(0.8)
      return `#${k.getHexString()}`
    }
    g.fillStyle = dim(GRANITE.base)
    g.fillRect(0, 0, FW, FH)
    const k = FW / (fx1 - fx0) // pixels a metre
    const blob = (x, y, r, c) => {
      g.fillStyle = c
      g.beginPath()
      const n = 6 + Math.floor(rnd() * 4)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + rnd() * 0.4
        const rr = r * (0.65 + rnd() * 0.5)
        const px = x + Math.cos(a) * rr
        const py = y + Math.sin(a) * rr * (0.7 + rnd() * 0.5)
        i ? g.lineTo(px, py) : g.moveTo(px, py)
      }
      g.closePath()
      g.fill()
    }
    const area = FW * FH
    for (let i = 0; i < (area / (k * k)) * 42; i++) blob(rnd() * FW, rnd() * FH, k * (0.05 + rnd() * 0.08), dim(GRANITE.feld[Math.floor(rnd() * 3)]))
    for (let i = 0; i < (area / (k * k)) * 46; i++) blob(rnd() * FW, rnd() * FH, k * (0.03 + rnd() * 0.05), dim(GRANITE.quartz[Math.floor(rnd() * 3)]))
    for (let i = 0; i < (area / (k * k)) * 60; i++) {
      g.save()
      g.translate(rnd() * FW, rnd() * FH)
      g.rotate(rnd() * TAU)
      g.fillStyle = GRANITE.mica[Math.floor(rnd() * 2)]
      g.fillRect(-k * 0.02, -k * 0.008, k * (0.025 + rnd() * 0.035), k * (0.012 + rnd() * 0.012))
      g.restore()
    }
    // light from the top left, shade at the foot
    const sh = g.createLinearGradient(0, 0, FW * 0.4, FH)
    sh.addColorStop(0, 'rgba(255,255,255,0.12)')
    sh.addColorStop(0.5, 'rgba(255,255,255,0)')
    sh.addColorStop(1, 'rgba(0,0,0,0.3)')
    g.fillStyle = sh
    g.fillRect(0, 0, FW, FH)
    // the crack
    g.lineCap = 'round'
    g.lineJoin = 'round'
    for (const [wd, c] of [[k * 0.13, 'rgba(111,240,255,0.18)'], [k * 0.06, '#1a1420']]) {
      g.strokeStyle = c
      g.lineWidth = wd
      g.beginPath()
      CRACK.forEach(([x, y], i) => {
        const [px, py] = fpx(x, y)
        i ? g.lineTo(px, py) : g.moveTo(px, py)
      })
      g.stroke()
    }
    // the spot the lens looks into, as in the picture: a dashed pink ring
    const [cx, cy] = fpx(1.25, 0.95)
    g.strokeStyle = '#ff9fb6'
    g.lineWidth = k * 0.035
    g.setLineDash([k * 0.08, k * 0.07])
    g.beginPath()
    g.arc(cx, cy, k * 0.3, 0, TAU)
    g.stroke()
    g.setLineDash([])
  }, { mipmaps: true })
  disposers.push(() => faceTex.dispose())
  const boulderG = new THREE.Group()
  boulderG.position.set(BOULDER.x, 0, BOULDER.z)
  root.add(boulderG)
  const bMesh = new THREE.Mesh(bGeo, stage.stone)
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.82 })
  const face = new THREE.Mesh(faceGeo, faceMat)
  boulderG.add(bMesh, face)
  // a rim of the picture's pale pink round the cut
  solids.push(box(BOULDER.x, BOULDER.z - 1.25, (fx1 - fx0) * 0.98, 2.5))
  clickable(face, () => say(at(E.face, level())), { reach: 5 })

  // radon rising from the crack, up to its place in the family above
  const wispN = light ? 14 : 28
  const wisp = cloud(wispN, RN_GLOW, 0.16, 0.85)
  root.add(wisp)
  const wispSeeds = Array.from({ length: wispN }, (_, i) => [hash(77, i), hash(78, i)])

  // ======================= the family's staircase in the sky =======================
  const stairG = new THREE.Group()
  root.add(stairG)
  const slabMat = new THREE.MeshStandardMaterial({ color: '#af5175', emissive: '#af5175', emissiveIntensity: 0.55, roughness: 0.5 })
  const stepPos = []
  {
    let x = STAIR.x0
    let y = STAIR.y0
    for (const [, , mode] of SERIES) {
      stepPos.push([x, y])
      if (mode) {
        x += STAIR.step
        y -= mode === 'a' ? STAIR.da : STAIR.db
      }
    }
  }
  const slabGeo = new RoundedBoxGeometry(STAIR.step + 0.06, 0.055, 0.3, 2, 0.02)
  const alphaBall = new THREE.SphereGeometry(0.024, 10, 8)
  const pMat = atomMat('#ff4d4d')
  const nMat = atomMat('#9aa3b8')
  const eMat = atomMat('#8fd0ff')
  const atoms = []
  SERIES.forEach(([sym, A, mode], i) => {
    const [x, y] = stepPos[i]
    const slab = new THREE.Mesh(slabGeo, slabMat)
    slab.position.set(x + 0.02, y - 0.14, STAIR.z)
    stairG.add(slab)
    if (mode) {
      const dy = mode === 'a' ? STAIR.da : STAIR.db
      const riser = new THREE.Mesh(new THREE.BoxGeometry(0.045, dy + 0.055, 0.3), slabMat)
      riser.position.set(x + STAIR.step / 2 + 0.03, y - 0.14 - dy / 2, STAIR.z)
      stairG.add(riser)
      // what flies out: an alpha (two protons, two neutrons) or a beta (an electron)
      const mk = new THREE.Group()
      mk.position.set(x + STAIR.step * 0.55, y + 0.1, STAIR.z + 0.05)
      if (mode === 'a') {
        ;[[-0.02, 0.012, pMat], [0.02, 0.016, nMat], [-0.012, -0.02, nMat], [0.016, -0.016, pMat]].forEach(([ax, ay, m]) => {
          const b = new THREE.Mesh(alphaBall, m)
          b.position.set(ax, ay, 0)
          mk.add(b)
        })
      } else {
        const b = new THREE.Mesh(alphaBall, eMat)
        b.scale.setScalar(1.1)
        mk.add(b)
      }
      stairG.add(mk)
    }
    const r = i === 0 || i === SERIES.length - 1 ? 0.14 : 0.11
    const g = new THREE.Group()
    g.position.set(x, y - 0.11 + r, STAIR.z)
    stairG.add(g)
    let ball = null
    let mat = null
    if (i !== RN_I) {
      mat = atomMat(ATOM_C[sym])
      ball = new THREE.Mesh(sphere, mat)
      ball.scale.setScalar(r)
      g.add(ball)
    } else {
      // radon's step is empty: a dashed ring where it sat
      const ringMat = new THREE.MeshStandardMaterial({ color: RN_GLOW, emissive: RN_GLOW, emissiveIntensity: 0.9, roughness: 0.4 })
      for (let k = 0; k < 8; k++) {
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 6, 8, TAU / 16), ringMat)
        arc.rotation.z = (k / 8) * TAU
        g.add(arc)
      }
    }
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), ghost)
    g.add(hit)
    atoms.push({ sym, A, mode, g, ball, mat, r, hit })
  })
  // radon's own atom, floating up and away from its step, the one gas
  const RN_FLOAT = V(stepPos[RN_I][0] + 0.36, stepPos[RN_I][1] + 0.42, STAIR.z)
  const rnFloat = radonAtom(0.13)
  rnFloat.group.position.copy(RN_FLOAT)
  stairG.add(rnFloat.group)
  const rnHit = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), ghost)
  rnFloat.group.add(rnHit)
  // the label of the atom being met
  const famLabel = label('', 0.12, '#ffffff', { anchorY: 'bottom', maxWidth: 2.4, lineHeight: 1.2 })
  famLabel.visible = false
  stairG.add(famLabel)

  // ======================= the grains (the picture's lens, made giant) =======================
  const lensG = new THREE.Group()
  lensG.position.set(LENS.x, 0, LENS.z)
  lensG.rotation.y = LENS.rot
  root.add(lensG)
  const lens = new THREE.Group()
  lens.position.y = LY
  lensG.add(lens)
  const ringMat = new THREE.MeshStandardMaterial({ color: '#ff8fae', emissive: '#ff6f91', emissiveIntensity: 0.85, roughness: 0.35, metalness: 0.2 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(LR, 0.09, 14, 96), ringMat)
  lens.add(ring)
  // legs to the ground
  for (const s of [-1, 1]) {
    const a = -Math.PI / 2 + s * 0.62
    const top = V(Math.cos(a) * LR, Math.sin(a) * LR + LY, 0)
    const foot = V(s * 1.25, 0, 0)
    const len = top.distanceTo(foot)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, len, 10), darkMetal)
    leg.position.copy(top).add(foot).multiplyScalar(0.5)
    leg.quaternion.setFromUnitVectors(V(0, 1, 0), top.clone().sub(foot).normalize())
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 20), darkMetal)
    pad.position.set(s * 1.25, 0.03, 0)
    lensG.add(leg, pad)
  }
  // the dark of the pore behind the grains
  const back = new THREE.Mesh(new THREE.CircleGeometry(LI, 64), new THREE.MeshBasicMaterial({ color: '#14112a' }))
  back.position.z = -GRAIN_D / 2 - 0.03
  lens.add(back)
  // the grains: a shape inside the ring under (or over) each surface, extruded through the lens
  const arcPts = (a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [Math.cos(a) * LI, Math.sin(a) * LI]
  })
  const xAt = (f, y0, sign) => {
    // where a surface y = f(x) meets the ring, on the side `sign`
    let lo = 0
    let hi = LI
    for (let k = 0; k < 30; k++) {
      const m = (lo + hi) / 2
      if (m * m + f(sign * m) ** 2 < LI * LI) lo = m
      else hi = m
    }
    return sign * lo
  }
  const surface = (f, xa, xb, n = 60) => Array.from({ length: n + 1 }, (_, i) => {
    const x = xa + ((xb - xa) * i) / n
    return [x, f(x)]
  })
  const xl = xAt(ys, 0, -1)
  const xr = xAt(ys, 0, 1)
  const ql = xAt(yq, 0, -1)
  const qr = xAt(yq, 0, 1)
  const shapeOf = pts => {
    const s = new THREE.Shape()
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
    s.closePath()
    return s
  }
  const lowerPts = [...surface(ys, xl, xr), ...arcPts(Math.atan2(ys(xr), xr), Math.atan2(ys(xl), xl) + (Math.atan2(ys(xl), xl) > Math.atan2(ys(xr), xr) ? -TAU : 0))]
  const upperPts = [...surface(yq, qr, ql), ...arcPts(Math.atan2(yq(ql), ql), Math.atan2(yq(qr), qr) + (Math.atan2(yq(qr), qr) > Math.atan2(yq(ql), ql) ? -TAU : 0))]
  const extrude = pts => {
    const geo = new THREE.ExtrudeGeometry(shapeOf(pts), { depth: GRAIN_D, bevelEnabled: false, curveSegments: 4 })
    geo.translate(0, 0, -GRAIN_D / 2)
    return geo
  }
  // the cut faces: each crystal's atoms in rows, a ruler down the feldspar, the dashed line at the recoil's range
  const LP = 1024
  const lpx = (x, y) => [((x + LI) / (2 * LI)) * LP, (1 - (y + LI) / (2 * LI)) * LP]
  const grainTex = canvasTex(LP, LP, g => {
    const k = LP / (2 * LI)
    g.fillStyle = '#9a6070'
    g.fillRect(0, 0, LP, LP / 2 + k * 0.3)
    g.fillStyle = '#7c8294'
    g.fillRect(0, 0, LP, LP / 2 - k * 0.2)
    // shading as in the picture: lighter at the pore
    for (const [f, c0, c1, dir] of [[ys, 'rgba(255,220,230,0.18)', 'rgba(60,20,40,0.35)', 1], [yq, 'rgba(230,236,255,0.2)', 'rgba(40,44,70,0.3)', -1]]) {
      const [, py] = lpx(0, f(0))
      const grd = g.createLinearGradient(0, py, 0, py + dir * k * 1.3)
      grd.addColorStop(0, c0)
      grd.addColorStop(1, c1)
      g.fillStyle = grd
      if (dir > 0) g.fillRect(0, py - k * 0.2, LP, k * 1.6)
      else g.fillRect(0, py - k * 1.4, LP, k * 1.6)
    }
    const sp = 0.115 * k
    for (let j = -40; j < 40; j++) {
      for (let i = -40; i < 40; i++) {
        const x = (i + (j % 2) * 0.5) * sp + LP / 2
        const y = j * sp * 0.866 + LP / 2
        const mx = (x / LP) * 2 * LI - LI
        const my = (1 - y / LP) * 2 * LI - LI
        if (my < ys(mx) - 0.04) g.fillStyle = 'rgba(240,190,204,0.42)'
        else if (my > yq(mx) + 0.04) g.fillStyle = 'rgba(214,220,236,0.4)'
        else continue
        g.beginPath()
        g.arc(x, y, sp * 0.17, 0, TAU)
        g.fill()
      }
    }
    // the dashed line: born below it, radon can never reach the surface
    g.strokeStyle = 'rgba(111,240,255,0.75)'
    g.lineWidth = k * 0.018
    g.setLineDash([k * 0.06, k * 0.05])
    g.beginPath()
    for (let x = -LI; x <= LI; x += 0.02) {
      const [px, py] = lpx(x, ys(x) - RM * NM)
      x === -LI ? g.moveTo(px, py) : g.lineTo(px, py)
    }
    g.stroke()
    g.setLineDash([])
    // the ruler down the feldspar's right side, every 20 nm
    const rx = 0.78
    g.strokeStyle = 'rgba(255,255,255,0.85)'
    g.fillStyle = 'rgba(255,255,255,0.95)'
    g.lineWidth = k * 0.012
    const [r0x, r0y] = lpx(rx, ys(rx))
    const [, r1y] = lpx(rx, ys(rx) - 60 * NM)
    g.beginPath()
    g.moveTo(r0x, r0y)
    g.lineTo(r0x, r1y)
    g.stroke()
    g.font = `700 ${Math.round(k * 0.085)}px Outfit, Nunito, sans-serif`
    g.textBaseline = 'middle'
    for (const n of [0, 20, 40, 60]) {
      const [px, py] = lpx(rx, ys(rx) - n * NM)
      g.beginPath()
      g.moveTo(px - k * 0.05, py)
      g.lineTo(px + k * 0.05, py)
      g.stroke()
      if (n === 20 || n === 40) g.fillText(n === 40 ? '40 nm' : '20', px + k * 0.08, py)
    }
  })
  grainTex.repeat.set(1 / (2 * LI), 1 / (2 * LI))
  grainTex.offset.set(0.5, 0.5)
  disposers.push(() => grainTex.dispose())
  const capMat = new THREE.MeshStandardMaterial({ map: grainTex, roughness: 0.6, emissive: '#ffffff', emissiveMap: grainTex, emissiveIntensity: 0.12 })
  const feldSide = new THREE.MeshStandardMaterial({ color: '#7a4656', roughness: 0.7, emissive: '#4a2634', emissiveIntensity: 0.6 })
  const quartzSide = new THREE.MeshStandardMaterial({ color: '#626878', roughness: 0.6, emissive: '#40445a', emissiveIntensity: 0.7 })
  const lowerGeo = extrude(lowerPts)
  const upperGeo = extrude(upperPts)
  disposers.push(() => lowerGeo.dispose(), () => upperGeo.dispose())
  const feldspar = new THREE.Mesh(lowerGeo, [capMat, feldSide])
  const quartz = new THREE.Mesh(upperGeo, [capMat, quartzSide])
  lens.add(feldspar, quartz)
  // the water in the pore: a film on the feldspar, rebuilt as it rises
  const waterMat = new THREE.MeshStandardMaterial({ color: '#4a8ae0', emissive: '#1f4fa0', emissiveIntensity: 0.35, roughness: 0.15, transparent: true, opacity: 0.42, depthWrite: false })
  // its top and ends fainter: seen at a slant they lie over the ring's edge
  const waterSide = waterMat.clone()
  waterSide.opacity = 0.16
  const water = new THREE.Mesh(new THREE.BufferGeometry(), waterMat)
  water.renderOrder = 2
  lens.add(water)
  let waterDrawn = -1
  const drawWater = w => {
    if (Math.abs(w - waterDrawn) < 0.004) return
    waterDrawn = w
    water.geometry.dispose()
    if (w < 0.01) {
      water.geometry = new THREE.BufferGeometry()
      return
    }
    const top = x => ys(x) + w * (yq(x) - ys(x))
    const tl = xAt(top, 0, -1)
    const tr = xAt(top, 0, 1)
    const pts = [...surface(top, tl, tr), ...surface(ys, xr, xl)]
    // the ring's arc between the surfaces at each end is short: straight lines do
    const geo = new THREE.ExtrudeGeometry(shapeOf(pts), { depth: GRAIN_D - 0.02, bevelEnabled: false, curveSegments: 2 })
    geo.translate(0, 0, -(GRAIN_D - 0.02) / 2)
    water.geometry = geo
    water.material = [waterMat, waterSide]
  }
  disposers.push(() => water.geometry.dispose())
  // labels on the cut
  const lblFeld = label(E.grain.labels.feldspar, 0.14, '#ffe0e8')
  lblFeld.position.set(-0.95, -0.62, FZ)
  const lblQuartz = label(E.grain.labels.quartz, 0.14, '#e6ecff')
  lblQuartz.position.set(-0.2, 1.22, FZ)
  const lblPore = label(E.grain.labels.pore, 0.12, '#b8b4e0')
  lblPore.position.set(1.08, 0.42, FZ)
  const lblWater = label(E.grain.labels.water, 0.12, '#bfe0ff')
  lblWater.visible = false
  lens.add(lblFeld, lblQuartz, lblPore, lblWater)
  // the radium atom
  const raMat = atomMat(ATOM_C.Ra)
  raMat.emissiveIntensity = 0.6
  const radium = new THREE.Group()
  const raBall = new THREE.Mesh(sphere, raMat)
  raBall.scale.setScalar(0.075)
  const raHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#7dff7a', transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }))
  raHalo.scale.setScalar(0.42)
  const raHit = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), ghost)
  radium.add(raBall, raHalo, raHit)
  lens.add(radium)
  const raLabel = label('', 0.085, '#d6ffd4', { anchorX: 'left' })
  lens.add(raLabel)
  // a hit shape over the feldspar's cut, to move the radium
  const feldHit = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(lowerPts)), ghost)
  feldHit.position.z = GRAIN_D / 2 + 0.01
  lens.add(feldHit)
  // the dropper: a glass pipette with a red bulb, its tip at the pore
  const dropper = new THREE.Group()
  const TIP = V(-0.95, 0.3, FZ + 0.12)
  const TOP = V(-1.55, 1.33, FZ + 0.22)
  {
    const len = TIP.distanceTo(TOP)
    const glassMat = new THREE.MeshStandardMaterial({ color: '#d8f0ff', roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.55, emissive: '#3a6a90', emissiveIntensity: 0.3 })
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.012, len, 14), glassMat)
    tube.position.copy(TIP).add(TOP).multiplyScalar(0.5)
    tube.quaternion.setFromUnitVectors(V(0, 1, 0), TOP.clone().sub(TIP).normalize())
    const inside = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.008, len * 0.6, 10), waterMat)
    inside.position.copy(TIP).lerp(TOP, 0.32)
    inside.quaternion.copy(tube.quaternion)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 12), new THREE.MeshStandardMaterial({ color: '#c8323c', roughness: 0.6, emissive: '#5a0a10', emissiveIntensity: 0.4 }))
    bulb.scale.set(1, 1.4, 1)
    bulb.position.copy(TOP).add(TOP.clone().sub(TIP).normalize().multiplyScalar(0.12))
    bulb.quaternion.copy(tube.quaternion)
    const clamp1 = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 16), brass)
    clamp1.position.copy(TIP).lerp(TOP, 0.75)
    clamp1.quaternion.copy(tube.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), Math.PI / 2))
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), brass)
    arm.position.copy(clamp1.position).add(V(-0.22, 0.05, -0.12))
    arm.rotation.z = -Math.PI / 2.4
    const hitD = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, len + 0.3, 8), ghost)
    hitD.position.copy(tube.position)
    hitD.quaternion.copy(tube.quaternion)
    dropper.add(tube, inside, bulb, clamp1, arm, hitD)
  }
  lens.add(dropper)
  const drops = Array.from({ length: 3 }, () => {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), waterMat)
    d.visible = false
    lens.add(d)
    return d
  })
  // the tries in flight: the radon recoiling, the alpha flying off, the flash, the dotted tracks
  const FLY = 8
  const flyers = Array.from({ length: FLY }, () => {
    const rn = radonAtom(0.075)
    rn.group.visible = false
    lens.add(rn.group)
    const alpha = new THREE.Group()
    ;[[-0.03, 0.012, pMat], [0.03, 0.018, nMat], [-0.018, -0.03, nMat], [0.024, -0.024, pMat]].forEach(([ax, ay, m]) => {
      const b = new THREE.Mesh(sphere, m)
      b.scale.setScalar(0.034)
      b.position.set(ax, ay, 0)
      alpha.add(b)
    })
    alpha.visible = false
    lens.add(alpha)
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, color: '#ffe0a0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    flash.visible = false
    lens.add(flash)
    const trail = cloud(48, RN_GLOW, 0.06, 0.8)
    trail.visible = false
    lens.add(trail)
    const atrail = cloud(30, '#ffd0a0', 0.07, 0.8)
    atrail.visible = false
    lens.add(atrail)
    return { rn, alpha, flash, trail, atrail, busy: false }
  })
  // where tries ended inside a crystal: dim teal atoms, fading
  const LEFT = 16
  const leftovers = cloud(LEFT, RN_GLOW, 0.17, 0.95)
  lens.add(leftovers)
  const leftList = []

  // the tally board, beside the lens
  const boardMat = new THREE.MeshStandardMaterial({ color: '#3a3f4c', roughness: 0.6, metalness: 0.3 })
  const gBoard = standingScreen({ width: 1.3, height: 0.92, color, title: E.grain.board.title, line: '', titleSize: 0.085, lineSize: 0.05 }, { top: 1.42, tilt: 0.2, mat: boardMat })
  gBoard.group.position.set(-2.2, 0, 0.75)
  gBoard.group.rotation.y = 0.5
  lensG.add(gBoard.group)
  const gBoardTex = canvasTex(1024, 640, null, { mipmaps: false })
  disposers.push(() => gBoardTex.dispose())
  const gBoardPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), new THREE.MeshBasicMaterial({ map: gBoardTex, transparent: true, toneMapped: false }))
  gBoardPlane.position.set(0, -0.07, 0.002)
  gBoard.content.add(gBoardPlane)

  // ---- the grain station's state and steps ----
  const G = { d: 12, x: -0.1, w: 0, n: 0, last: '', wetTries: 0, deep: false }
  let wNow = 0
  let mine = false
  const tally = () => {
    const c = { free: 0, stuck: 0, buried: 0 }
    for (const ch of G.last) c[ch === 'f' ? 'free' : ch === 's' ? 'stuck' : 'buried']++
    return c
  }
  let shownLast = null
  let boardBusy = 0
  const CODE = { free: 'f', stuck: 's', buried: 'b' }
  const COLS = { f: RN_GLOW, s: '#e08aa0', b: '#a7adba' }
  function drawGrainBoard(upTo = G.last.length) {
    const L = G.last.slice(0, upTo)
    gBoardTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.font = '700 46px Outfit, Nunito, sans-serif'
      g.textBaseline = 'middle'
      if (!L.length) {
        g.fillStyle = '#c8d0ff'
        g.textAlign = 'center'
        g.fillText(E.grain.board.none, w / 2, h / 2)
        return
      }
      const c = { f: 0, s: 0, b: 0 }
      for (const ch of L) c[ch]++
      const rows = [['f', E.grain.board.free], ['s', E.grain.board.stuck], ['b', E.grain.board.buried]]
      rows.forEach(([k, txt], i) => {
        const y = 70 + i * 92
        g.fillStyle = COLS[k]
        g.beginPath()
        g.arc(70, y, 24, 0, TAU)
        g.fill()
        g.textAlign = 'left'
        g.fillStyle = '#e8ecff'
        g.font = '600 44px Outfit, Nunito, sans-serif'
        g.fillText(txt, 115, y)
        g.textAlign = 'right'
        g.font = '700 56px Outfit, Nunito, sans-serif'
        g.fillStyle = COLS[k]
        g.fillText(String(c[k]), w - 50, y)
      })
      // the tries in order
      const n = 20
      for (let i = 0; i < n; i++) {
        const x = 70 + i * ((w - 140) / (n - 1))
        const ch = L[i]
        g.beginPath()
        g.arc(x, 400, 17, 0, TAU)
        if (ch) {
          g.fillStyle = COLS[ch]
          g.fill()
        } else {
          g.strokeStyle = 'rgba(200,210,255,0.35)'
          g.lineWidth = 4
          g.stroke()
        }
      }
      g.textAlign = 'center'
      g.fillStyle = '#ffd166'
      g.font = '700 54px Outfit, Nunito, sans-serif'
      g.fillText(fill(E.grain.board.share, { n: c.f, m: L.length }), w / 2, 520)
    })
  }
  drawGrainBoard()
  const placeRadium = () => {
    radium.position.set(G.x, ys(G.x) - G.d * NM, FZ)
    setText(raLabel, fill(E.grain.labels.nm, { n: Math.round(G.d) }))
    raLabel.position.set(G.x + 0.13, ys(G.x) - G.d * NM + 0.11, FZ + 0.01)
  }
  placeRadium()
  let raGone = 0 // seconds until the next radium shows (after a try)
  const grainHint = () => {
    if (G.n === 0) return E.grain.hints.radium
    if (G.w < 0.05 && G.n >= 3 && G.wetTries === 0) return E.grain.hints.water
    if (G.w >= 0.05 && G.wetTries < 2) return E.grain.hints.again
    if (!G.deep) return E.grain.hints.deeper
    if (G.n < 20) return E.grain.hints.board
    return E.grain.hints.more
  }
  const grainPanel = lv => ({
    title: E.grain.title,
    color,
    blocks: [
      {
        slider: {
          label: E.grain.sliders.depth,
          min: 0,
          max: DMAX,
          step: 1,
          value: Math.round(G.d),
          onInput: v => grainStep('depth', Number(v)),
          format: v => fill(E.grain.labels.nm, { n: Math.round(v) }),
          live: () => Math.round(G.d),
        },
      },
      {
        slider: {
          label: E.grain.sliders.water,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(G.w * 100),
          onInput: v => grainStep('water', Number(v) / 100),
          format: v => `${Math.round(v)} %`,
          live: () => Math.round(G.w * 100),
        },
      },
      {
        buttons: [
          { label: E.grain.buttons.one, onClick: () => grainStep('radium') },
          { label: E.grain.buttons.twenty, onClick: () => grainStep('twenty') },
          { label: G.w >= 0.999 ? E.grain.buttons.dry : E.grain.buttons.water, onClick: () => grainStep('dropper') },
        ],
      },
      ...paras(E.grain.panel, lv),
    ],
  })
  /** Start the animation of try number n (quick in a burst). `own`: this visitor's, so the Atomling speaks. */
  function launch(n, quick, own, said) {
    const r = recoil(n, G.d, G.x, G.w)
    const f = flyers.find(q => !q.busy) ?? flyers[0]
    f.busy = true
    f.r = r
    f.t = 0
    f.quick = quick
    f.own = own
    f.said = said
    f.origin = [G.x, ys(G.x) - G.d * NM]
    // the alpha: away the other way, off the edge of the lens (it runs some 20 um, far beyond)
    let ax = r.ax
    let ay = r.ay
    const al = Math.hypot(ax, ay)
    if (al < 0.15) {
      ax = 0.15 * Math.sign(ax || 1)
      ay = -0.1
    }
    const an = Math.hypot(ax, ay)
    f.adir = [ax / an, ay / an]
    // how far until the ring's inside
    const [ox, oy] = f.origin
    const b = ox * f.adir[0] + oy * f.adir[1]
    f.alen = -b + Math.sqrt(Math.max(0, b * b - (ox * ox + oy * oy - (LI - 0.06) ** 2)))
    f.dur = quick ? 0.35 : 0.9
    f.rn.group.visible = true
    f.alpha.visible = true
    f.flash.visible = true
    f.trail.visible = true
    f.atrail.visible = true
    f.rn.group.position.set(ox, oy, FZ + 0.02)
    f.flash.position.set(ox, oy, FZ + 0.04)
    play(quick ? 'tap' : 'decay')
    return r
  }
  function grainStep(what, v) {
    const lv = level()
    mine = true
    if (what === 'radium') {
      if (boardBusy > 0) return
      G.n += 1
      const r = recoil(G.n, G.d, G.x, G.w)
      G.last = (G.last + CODE[r.end]).slice(-20)
      if (G.w >= 0.05) G.wetTries++
      launch(G.n, false, true, null)
      raGone = 1.3
    } else if (what === 'twenty') {
      if (boardBusy > 0) return
      const start = G.n
      let freed = 0
      for (let i = 1; i <= 20; i++) {
        const r = recoil(start + i, G.d, G.x, G.w)
        G.last = (G.last + CODE[r.end]).slice(-20)
        if (r.end === 'free') freed++
      }
      G.n = start + 20
      if (G.w >= 0.05) G.wetTries += 20
      burst(start, true, freed)
    } else if (what === 'depth' || what === 'spot') {
      const d = clamp(Math.round(Number(what === 'spot' ? v.d : v) || 0), 0, DMAX)
      const x = what === 'spot' ? clamp(v.x, -XMAX, XMAX) : G.x
      if (d === Math.round(G.d) && x === G.x) return
      G.d = d
      G.x = x
      if (d > RM) {
        if (!G.deep) say(at(E.grain.says.deep, lv))
        G.deep = true
      } else if (what === 'spot') say(fill(at(E.grain.says.moved, lv), { n: d }))
      placeRadium()
      play('tap')
    } else if (what === 'water' || what === 'dropper') {
      let w
      if (what === 'water') w = clamp(Number(v) || 0)
      else w = G.w >= 0.999 ? 0 : Math.min(1, Math.round((G.w + 0.25) * 4) / 4)
      if (w === G.w) return
      const was = G.w
      G.w = w
      if (what === 'dropper') {
        if (w > was) dripT = 0
        play(w > was ? 'pop' : 'tap')
        say(at(w === 0 ? E.grain.says.dry : w >= 0.999 ? E.grain.says.full : E.grain.says.wet, lv))
      } else if (was < 0.05 && w >= 0.05) say(at(E.grain.says.wet, lv))
    } else return
    ex.discover('grain', grainPanel, 3)
    repanel(grainPanel)
    what === 'depth' || what === 'water' ? slid('grain') : share('grain')
  }
  let dripT = 9
  /** Twenty tries one after another (the state already holds their ends). */
  function burst(start, own, freed) {
    boardBusy = 20 * 0.2 + 0.6
    drawGrainBoard(Math.max(0, G.last.length - 20))
    shownLast = G.last
    for (let i = 1; i <= 20; i++) {
      later((i - 1) * 0.2, () => {
        launch(start + i, true, own, null)
        drawGrainBoard(Math.max(0, G.last.length - 20) + i)
      })
    }
    if (own) later(20 * 0.2 + 0.5, () => say(fill(at(E.grain.says.twenty, level()), { n: freed, m: Math.round((freed / 20) * 100) })))
  }
  const seenEnd = { free: false, stuck: false, buried: false }
  const endLine = end => {
    const first = !seenEnd[end]
    seenEnd[end] = true
    return at(first ? E.grain.says[end] : E.grain.says[`${end}Again`], level())
  }
  const tmp = new THREE.Object3D()
  updates.push((dt, t) => {
    // water rising or falling
    wNow = damp(wNow, G.w, 3, dt)
    if (Math.abs(wNow - G.w) < 0.002) wNow = G.w
    drawWater(wNow)
    lblWater.visible = wNow > 0.08
    if (lblWater.visible) {
      const lx = 0.45
      lblWater.position.set(lx, ys(lx) + wNow * (yq(lx) - ys(lx)) * 0.5, FZ + 0.01)
    }
    // the drops from the dropper
    dripT += dt
    drops.forEach((d, i) => {
      const a = dripT - i * 0.18
      d.visible = a > 0 && a < 0.5
      if (d.visible) d.position.set(TIP.x, TIP.y - a * a * 3.5, TIP.z)
    })
    // the radium: gone a moment after each try, then a new one
    raGone = Math.max(0, raGone - dt)
    radium.visible = raGone <= 0 && boardBusy <= 0
    raLabel.visible = radium.visible
    raHalo.material.opacity = 0.38 + Math.sin(t * 3) * 0.1
    boardBusy = Math.max(0, boardBusy - dt)
    if (boardBusy <= 0 && shownLast !== G.last) {
      shownLast = G.last
      drawGrainBoard()
    }
    // the tries in flight
    for (const f of flyers) {
      if (!f.busy) continue
      f.t += dt
      const { r } = f
      const k = clamp(f.t / f.dur)
      // the radon slows as it goes
      const u = 1 - (1 - k) * (1 - k)
      const m = r.pts.length - 1
      const fi = u * m
      const i0 = Math.min(m - 1, Math.floor(fi))
      const p0 = r.pts[i0]
      const p1 = r.pts[i0 + 1] ?? p0
      const q = fi - i0
      let px = p0[0] + (p1[0] - p0[0]) * q
      let py = p0[1] + (p1[1] - p0[1]) * q
      const after = f.t - f.dur
      // a free one drifts off along the pore, then fades
      if (r.end === 'free' && after > 0) {
        const end = r.pts[m]
        const a = clamp((after - (f.quick ? 0.1 : 0.5)) / 2.6)
        const ex2 = end[0] + (1.5 - end[0]) * ease(a)
        const top = ys(ex2) + Math.max(0.05, wNow) * (yq(ex2) - ys(ex2))
        px = ex2
        py = end[1] + (Math.min(top - 0.06, (ys(ex2) + top) / 2 + 0.02) - end[1]) * ease(a) + Math.sin(f.t * 5) * 0.015
        f.rn.group.scale.setScalar(1)
        f.rn.halo.material.opacity = 0.55 * (1 - smooth(0.75, 1, a))
        f.rn.group.visible = a < 1
      }
      f.rn.group.position.set(px, py, FZ + 0.02)
      // its dotted track behind it
      const tp = f.trail.geometry.attributes.position
      const tc = f.trail.geometry.attributes.color
      const fadeT = clamp(1 - (after - 1.2) / 1.5)
      for (let j = 0; j < 48; j++) {
        const pj = r.pts[Math.round((j / 47) * m * u)] ?? r.pts[0]
        tp.setXYZ(j, pj[0], pj[1], FZ + 0.015)
        tc.setXYZ(j, fadeT, fadeT, fadeT)
      }
      tp.needsUpdate = true
      tc.needsUpdate = true
      // the alpha particle: fast, off the edge
      const ak = clamp(f.t / (f.quick ? 0.25 : 0.5))
      const [ox, oy] = f.origin
      f.alpha.visible = ak < 1
      f.alpha.position.set(ox + f.adir[0] * f.alen * ak, oy + f.adir[1] * f.alen * ak, FZ + 0.03)
      f.alpha.rotation.z = f.t * 9
      const ap = f.atrail.geometry.attributes.position
      const ac = f.atrail.geometry.attributes.color
      const afade = clamp(1 - (f.t - 1.5) / 1.5)
      for (let j = 0; j < 30; j++) {
        const s = (j / 29) * ak
        ap.setXYZ(j, ox + f.adir[0] * f.alen * s, oy + f.adir[1] * f.alen * s, FZ + 0.012)
        ac.setXYZ(j, afade, afade * 0.9, afade * 0.8)
      }
      ap.needsUpdate = true
      ac.needsUpdate = true
      // the flash of the break
      const fk = f.t / 0.45
      f.flash.material.opacity = fk < 1 ? (1 - fk) * 0.95 : 0
      f.flash.scale.setScalar(0.25 + fk * 0.45)
      f.flash.visible = fk < 1
      // the end: stuck or buried atoms stay as dim dots; the Atomling says what happened
      if (after >= 0 && !f.ended) {
        f.ended = true
        if (r.end !== 'free') {
          leftList.push({ x: px, y: py, born: t })
          if (leftList.length > LEFT) leftList.shift()
          f.rn.group.visible = false
        }
        if (f.own && !f.quick) say(endLine(r.end))
      }
      const doneAt = r.end === 'free' ? (f.quick ? 2.9 : 3.3) : 0.05
      if (after > Math.max(doneAt, 3)) {
        f.busy = false
        f.ended = false
        f.rn.group.visible = false
        f.alpha.visible = false
        f.flash.visible = false
        f.trail.visible = false
        f.atrail.visible = false
      }
    }
    // the leftovers fade over a dozen seconds
    const lp = leftovers.geometry.attributes.position
    const lc = leftovers.geometry.attributes.color
    for (let j = 0; j < LEFT; j++) {
      const l = leftList[j]
      if (l) {
        const a = clamp(1 - (t - l.born - 6) / 8)
        lp.setXYZ(j, l.x, l.y, FZ + 0.02)
        lc.setXYZ(j, 0.8 * a, 0.8 * a, 0.8 * a)
      } else lp.setXYZ(j, 0, 0, -99)
    }
    lp.needsUpdate = true
    lc.needsUpdate = true
    void tmp
  })
  clickable(raHit, () => grainStep('radium'), { when: () => radium.visible })
  clickable(feldHit, h => {
    const p = lens.worldToLocal(h.point.clone())
    const x = clamp(p.x, -XMAX, XMAX)
    grainStep('spot', { x, d: (ys(x) - p.y) / NM })
  })
  clickable(dropper, () => grainStep('dropper'))
  clickable(gBoard.group, () => grainStep('twenty'))
  const grainSpot = local(lensG, 0, 0, 3.3)
  ex.add({
    id: 'grain',
    x: grainSpot.x,
    z: grainSpot.z,
    radius: 2.2,
    manual: true,
    label: E.grain.label,
    verb: grainHint,
    screens: [gBoard],
    focus: (() => {
      const c = local(lensG, -0.6, LY - 0.15, 0.2)
      return { x: c.x, y: c.y, z: c.z, size: 4.4, width: 4.7 }
    })(),
    act: () => ctx.showPanel(grainPanel),
  })
  {
    const c = local(lensG, 0, 0, 0)
    solids.push(box(c.x, c.z, 3.0, 0.7, { rot: -LENS.rot }))
    const b = local(lensG, -2.2, 0, 0.75)
    solids.push(circle(b.x, b.z, 0.3))
  }
  const grainState = () => ({ d: Math.round(G.d), x: Math.round(G.x * 1000) / 1000, w: Math.round(G.w * 1000) / 1000, n: G.n, last: G.last })
  const grainSet = (s, live) => {
    const n = Math.max(0, Math.round(Number(s?.n) || 0))
    const d = clamp(Math.round(Number(s?.d) || 0), 0, DMAX)
    const x = clamp(Number(s?.x) || 0, -XMAX, XMAX)
    const w = clamp(Number(s?.w) || 0)
    const last = String(s?.last ?? '').replace(/[^fsb]/g, '').slice(-20)
    const was = G.n
    G.d = d
    G.x = x
    G.w = w
    if (!live) wNow = w
    placeRadium()
    if (live && n === was + 1) {
      G.n = n
      G.last = last
      launch(n, false, false, null)
      raGone = 1.3
    } else if (live && n === was + 20) {
      G.n = n
      G.last = last
      burst(was, false, 0)
    } else {
      G.n = n
      G.last = last
      drawGrainBoard()
      shownLast = last
    }
    if (d > RM) G.deep = true
    repanel(grainPanel)
  }

  // ======================= the soil column =======================
  const colG = new THREE.Group()
  colG.position.set(COL.x, 0, COL.z)
  colG.rotation.y = COL.rot
  root.add(colG)
  // the granite it stands on, the crack in it
  const plinthMat = new THREE.MeshStandardMaterial({ color: '#6e6268', map: stage.stone.map, roughness: 0.9 })
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.9, Y0, 40), plinthMat)
  plinth.position.y = Y0 / 2
  colG.add(plinth)
  const crackMat = new THREE.MeshStandardMaterial({ color: '#1a1420', emissive: RN_GLOW, emissiveIntensity: 0.25, roughness: 1 })
  const crackBit = new THREE.Mesh(new THREE.BoxGeometry(0.04, Y0 * 0.95, 0.02), crackMat)
  crackBit.position.set(-0.12, Y0 / 2, 0.86)
  crackBit.rotation.z = 0.25
  colG.add(crackBit)
  // the soil: its back half and the cut face toward the visitor, layered like a real profile
  const soilTex = canvasTex(256, 1024, (g, w, h) => {
    const rnd = random(3)
    const k = h / 3
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#2e2418')
    grd.addColorStop(0.08, '#3e2e1e')
    grd.addColorStop(0.14, '#5a4430')
    grd.addColorStop(0.4, '#6a5038')
    grd.addColorStop(0.55, '#7c6448')
    grd.addColorStop(1, '#8a7458')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    // roots near the top
    g.strokeStyle = 'rgba(190,160,120,0.45)'
    g.lineWidth = 2
    for (let i = 0; i < 26; i++) {
      let x = rnd() * w
      let y = 0
      g.beginPath()
      g.moveTo(x, y)
      for (let s = 0; s < 8; s++) {
        x += (rnd() - 0.5) * 16
        y += rnd() * k * 0.07
        g.lineTo(x, y)
      }
      g.stroke()
    }
    // grains and pebbles, more and lighter lower down (weathered granite, the grus)
    for (let i = 0; i < 2600; i++) {
      const y = rnd() * h
      const deep = y / h
      const v = 80 + deep * 90 + rnd() * 40
      g.fillStyle = rnd() < 0.15 ? `rgba(${v + 40},${v + 10},${v + 20},0.7)` : rnd() < 0.3 ? 'rgba(30,26,30,0.5)' : `rgba(${v},${v * 0.86},${v * 0.7},0.55)`
      g.beginPath()
      g.arc(rnd() * w, y, 0.8 + rnd() * (1.5 + deep * 3.5), 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 40; i++) {
      const y = h * (0.3 + rnd() * 0.7)
      const v = 120 + rnd() * 60
      g.fillStyle = `rgb(${v + 20},${v},${v + 8})`
      g.beginPath()
      g.ellipse(rnd() * w, y, 5 + rnd() * 9, 3 + rnd() * 6, rnd() * 3, 0, TAU)
      g.fill()
    }
  })
  disposers.push(() => soilTex.dispose())
  const soilMat = new THREE.MeshStandardMaterial({ map: soilTex, roughness: 0.95, color: '#ffffff' })
  soilMat.side = THREE.DoubleSide
  const soilBack = new THREE.Mesh(new THREE.CylinderGeometry(COLR, COLR, Y1 - Y0, 40, 1, true, Math.PI / 2, Math.PI), soilMat)
  soilBack.position.y = (Y0 + Y1) / 2
  const soilFace = new THREE.Mesh(new THREE.PlaneGeometry(2 * COLR, Y1 - Y0), soilMat)
  soilFace.position.set(0, (Y0 + Y1) / 2, 0)
  colG.add(soilBack, soilFace)
  // the turf on top
  const turf = new THREE.Mesh(new THREE.CircleGeometry(COLR, 32, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#3c5530', roughness: 1 }))
  turf.rotation.x = -Math.PI / 2
  turf.position.y = Y1 + 0.004
  colG.add(turf)
  const turfTufts = new THREE.InstancedMesh(new THREE.ConeGeometry(0.03, 0.14, 4).translate(0, 0.07, 0), new THREE.MeshStandardMaterial({ color: '#4f6c3a', roughness: 1 }), 40)
  {
    const o = new THREE.Object3D()
    const rnd = random(9)
    for (let i = 0; i < 40; i++) {
      const a = Math.PI + rnd() * Math.PI
      const r = Math.sqrt(rnd()) * (COLR - 0.04)
      o.position.set(Math.cos(a) * r, Y1, -Math.abs(Math.sin(a) * r))
      o.rotation.set((rnd() - 0.5) * 0.4, rnd() * 6, (rnd() - 0.5) * 0.4)
      o.scale.setScalar(0.7 + rnd() * 0.8)
      o.updateMatrix()
      turfTufts.setMatrixAt(i, o.matrix)
    }
  }
  colG.add(turfTufts)
  // the glass, its rims in the picture's pink
  const glassMat = new THREE.MeshStandardMaterial({ color: '#d6ecff', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide })
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.63, GLASS_TOP - Y0, 48, 1, true), glassMat)
  glass.position.y = (Y0 + GLASS_TOP) / 2
  glass.raycast = () => {}
  colG.add(glass)
  const rimMat = new THREE.MeshStandardMaterial({ color: '#ff8fae', emissive: '#ff6f91', emissiveIntensity: 0.7, roughness: 0.4 })
  for (const y of [Y0, GLASS_TOP]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.635, 0.025, 8, 48), rimMat)
    rim.rotation.x = Math.PI / 2
    rim.position.y = y
    colG.add(rim)
  }
  // the depth marks on the left, every half metre a tick
  const tickMat = new THREE.MeshBasicMaterial({ color: '#ffffff' })
  for (let d = 0; d <= 3.001; d += 0.5) {
    const big = Number.isInteger(d)
    const tick = new THREE.Mesh(new THREE.BoxGeometry(big ? 0.16 : 0.09, 0.012, 0.012), tickMat)
    tick.position.set(-COLR - 0.02 - (big ? 0.08 : 0.045), Y1 - d, 0.02)
    colG.add(tick)
    if (big) {
      const t = label(fill(E.soil.labels.m, { n: d }), 0.12, '#ffffff', { anchorX: 'right' })
      t.position.set(-COLR - 0.2, Y1 - d, 0.03)
      colG.add(t)
    }
  }
  const lblAir = label(E.soil.labels.air, 0.12, '#d8e8ff', { anchorX: 'right' })
  lblAir.position.set(-COLR - 0.2, Y1 + 0.32, 0.03)
  const lblGranite = label(E.soil.labels.granite, 0.1, '#f0dce4')
  lblGranite.position.set(0.32, Y0 * 0.5, 0.9)
  lblGranite.rotation.y = 0
  colG.add(lblAir, lblGranite)
  const dayText = label('', 0.13, '#ffd166', { anchorX: 'left' })
  dayText.position.set(COLR + 0.15, Y1 + 0.32, 0.03)
  colG.add(dayText)
  // where the next release is born: a teal ring round the glass
  const marker = new THREE.Mesh(new THREE.TorusGeometry(0.665, 0.018, 8, 48), new THREE.MeshStandardMaterial({ color: RN_GLOW, emissive: RN_GLOW, emissiveIntensity: 0.9 }))
  marker.rotation.x = Math.PI / 2
  colG.add(marker)
  // the radon atoms, their halos, the polonium they leave
  const moteMesh = new THREE.InstancedMesh(sphere, radonMat, MOTES)
  moteMesh.frustumCulled = false
  moteMesh.raycast = () => {}
  const moteHalo = cloud(MOTES, RN_GLOW, 0.24, 0.7)
  const poMat = atomMat('#ffb347')
  poMat.emissiveIntensity = 0.7
  const poMesh = new THREE.InstancedMesh(sphere, poMat, MOTES)
  poMesh.frustumCulled = false
  poMesh.raycast = () => {}
  colG.add(moteMesh, moteHalo, poMesh)
  // the rain cloud above
  const cloudG = new THREE.Group()
  cloudG.position.set(0, CLOUD_Y, 0.1)
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#c4bfd6', emissive: '#4c4466', emissiveIntensity: 0.5, roughness: 1 })
  ;[[0, 0, 0, 0.36], [0.34, -0.06, 0.05, 0.28], [-0.32, -0.05, -0.02, 0.3], [0.12, 0.17, -0.05, 0.27], [-0.14, 0.12, 0.1, 0.24], [0.55, -0.12, -0.04, 0.2], [-0.55, -0.1, 0.06, 0.19]].forEach(([x, y, z, r]) => {
    const p = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), cloudMat)
    p.position.set(x, y, z)
    p.scale.y = 0.82
    cloudG.add(p)
  })
  colG.add(cloudG)
  const RAIN = light ? 30 : 60
  const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4), new THREE.MeshBasicMaterial({ color: '#a8d0ff', transparent: true, opacity: 0.75 }), RAIN)
  rain.frustumCulled = false
  rain.raycast = () => {}
  colG.add(rain)
  const rainSeeds = Array.from({ length: RAIN }, (_, i) => [hash(5, i), hash(6, i), hash(7, i)])
  // the board beside it
  const sBoard = standingScreen({ width: 1.3, height: 0.92, color, title: E.soil.board.title, line: '', titleSize: 0.075, lineSize: 0.05 }, { top: 1.42, tilt: 0.2, mat: boardMat })
  sBoard.group.position.set(1.6, 0, 0.85)
  sBoard.group.rotation.y = -0.55
  colG.add(sBoard.group)
  const sBoardTex = canvasTex(1024, 640, null, { mipmaps: false })
  disposers.push(() => sBoardTex.dispose())
  const sBoardPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), new THREE.MeshBasicMaterial({ map: sBoardTex, transparent: true, toneMapped: false }))
  sBoardPlane.position.set(0, -0.07, 0.002)
  sBoard.content.add(sBoardPlane)
  // hit shapes: the soil (a level to release at), the cloud
  const soilHit = new THREE.Mesh(new THREE.BoxGeometry(1.3, Y1 - Y0, 1.3), ghost)
  soilHit.position.y = (Y0 + Y1) / 2
  colG.add(soilHit)
  const cloudHit = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 8), ghost)
  cloudHit.scale.set(1.3, 0.7, 1)
  cloudG.add(cloudHit)

  // ---- the soil station's state and steps ----
  const S = { wet: false, k: 0, d: 1, rel: null, b: Array(12).fill(-1), rained: false, wetRel: 0, depths: [] }
  let sim = null // the motes of the release under way
  let relStart = 0 // wall clock
  let relOwn = false
  let relDone = true
  let wetK = 0
  let rainT = 9
  const binOf = d => clamp(Math.round(d / 0.5) - 1, 0, 5)
  const soilAge = () => (S.rel ? Math.min(SIM_MAX + 4, wall() - relStart) : 0)
  const reachedBy = a => (sim ? sim.filter(m => m.end === 'air' && m.t <= a).length : 0)
  function drawSoilBoard() {
    const a = soilAge()
    const runBin = S.rel && !relDone ? binOf(S.rel.d) * 2 + (S.rel.wet ? 1 : 0) : -1
    sBoardTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      const x0 = 110
      const x1 = w - 40
      const yb = 470
      const yt = 70
      g.strokeStyle = 'rgba(200,210,255,0.4)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x0, yt)
      g.lineTo(x0, yb)
      g.lineTo(x1, yb)
      g.stroke()
      g.font = '600 38px Outfit, Nunito, sans-serif'
      g.fillStyle = '#c8d0ff'
      g.textAlign = 'right'
      g.textBaseline = 'middle'
      for (const v of [0, 10, 20]) {
        const y = yb - (v / 20) * (yb - yt)
        g.fillText(String(v), x0 - 14, y)
      }
      const bw = (x1 - x0) / 6
      LEVELS.forEach((d, i) => {
        const cx = x0 + bw * (i + 0.5)
        for (const wet of [0, 1]) {
          const j = i * 2 + wet
          let v = S.b[j]
          if (j === runBin) v = reachedBy(a)
          const bx = cx - 40 + wet * 42
          if (v >= 0) {
            const hh = (v / 20) * (yb - yt)
            g.fillStyle = wet ? '#5aa0ff' : RN_GLOW
            g.fillRect(bx, yb - hh, 38, Math.max(4, hh))
            g.fillStyle = '#ffffff'
            g.textAlign = 'center'
            g.font = '700 40px Outfit, Nunito, sans-serif'
            g.fillText(String(v), bx + 19, yb - hh - 26)
          }
        }
        g.fillStyle = '#e8ecff'
        g.textAlign = 'center'
        g.font = '700 38px Outfit, Nunito, sans-serif'
        g.fillText(fill(E.soil.labels.m, { n: metres(d) }), cx, yb + 38)
      })
      // the legend
      g.font = '600 40px Outfit, Nunito, sans-serif'
      g.textAlign = 'left'
      g.fillStyle = RN_GLOW
      g.fillRect(x0, 562, 34, 34)
      g.fillStyle = '#e8ecff'
      g.fillText(E.soil.board.dry, x0 + 48, 580)
      g.fillStyle = '#5aa0ff'
      g.fillRect(x0 + 420, 562, 34, 34)
      g.fillStyle = '#e8ecff'
      g.fillText(E.soil.board.wet, x0 + 468, 580)
    })
  }
  drawSoilBoard()
  let boardDrawnAt = -1
  const soilHint = () => {
    if (S.k === 0) return E.soil.hints.level
    if (S.depths.length < 2) return E.soil.hints.deeper
    if (!S.wet && !S.rained) return E.soil.hints.rain
    if (S.wet && S.wetRel === 0) return E.soil.hints.wet
    if (S.wet) return E.soil.hints.dry
    return E.soil.hints.level
  }
  const soilPanel = lv => ({
    title: E.soil.title,
    color,
    blocks: [
      {
        slider: {
          label: E.soil.slider,
          min: 0.5,
          max: 3,
          step: 0.5,
          value: S.d,
          onInput: v => soilStep('depth', Number(v)),
          format: v => fill(E.soil.labels.m, { n: metres(Number(v)) }),
          live: () => S.d,
        },
      },
      {
        buttons: [
          { label: E.soil.buttons.release, onClick: () => soilStep('release', S.d) },
          { label: S.wet ? E.soil.buttons.dry : E.soil.buttons.rain, onClick: () => soilStep('cloud') },
        ],
      },
      ...paras(E.soil.panel, lv),
    ],
  })
  const startRelease = (own, ago = 0) => {
    sim = release(S.k, S.rel.d, S.rel.wet)
    relStart = wall() - ago
    relOwn = own
    relDone = soilAge() > Math.max(...sim.map(m => m.t)) + 2.2
  }
  function soilStep(what, v) {
    const lv = level()
    if (what === 'release' || what === 'level') {
      const d = clamp(Math.round((Number(v) || 0.5) * 2) / 2, 0.5, 3)
      S.d = d
      S.k += 1
      S.rel = { d, wet: S.wet }
      // the release's end is known from its number: the board keeps it, and draws it as the atoms arrive
      const out = release(S.k, d, S.wet)
      S.b[binOf(d) * 2 + (S.wet ? 1 : 0)] = out.filter(m => m.end === 'air').length
      if (!S.depths.includes(d)) S.depths.push(d)
      if (S.wet) S.wetRel++
      startRelease(true)
      play('beam')
      say(fill(at(E.soil.says.release, lv), { d: fill(E.soil.labels.m, { n: metres(d) }) }))
    } else if (what === 'depth') {
      const d = clamp(Math.round((Number(v) || 0.5) * 2) / 2, 0.5, 3)
      if (d === S.d) return
      S.d = d
      ex.discover('soil', soilPanel, 3)
      repanel(soilPanel)
      slid('soil')
      return
    } else if (what === 'cloud') {
      S.wet = !S.wet
      if (S.wet) {
        S.rained = true
        rainT = 0
        wetK = S.k
        play('fizz')
      } else play('tap')
      say(at(S.wet ? E.soil.says.rain : E.soil.says.dry, lv))
    } else return
    ex.discover('soil', soilPanel, 3)
    repanel(soilPanel)
    share('soil')
  }
  void wetK
  let wetNow = 0
  const mo = new THREE.Object3D()
  updates.push((dt, t) => {
    // wet soil darkens
    wetNow = damp(wetNow, S.wet ? 1 : 0, 1.5, dt)
    soilMat.color.setRGB(1 - wetNow * 0.4, 1 - wetNow * 0.4, 1 - wetNow * 0.3)
    cloudMat.color.set('#c4bfd6').lerp(new THREE.Color('#6a667e'), wetNow)
    cloudG.position.y = CLOUD_Y + Math.sin(t * 0.6) * 0.04
    // the rain: a few seconds of it when it starts
    rainT += dt
    const raining = rainT < 3.2
    rain.visible = raining
    if (raining) {
      rainSeeds.forEach(([a, b, c], i) => {
        const r = Math.sqrt(a) * 0.5
        const ang = b * TAU
        const fall = ((t * 3.2 + c * 4) % 1) * (CLOUD_Y - 0.2 - Y1)
        mo.position.set(Math.cos(ang) * r, CLOUD_Y - 0.25 - fall, Math.sin(ang) * r)
        mo.rotation.set(0, 0, 0)
        mo.scale.setScalar(1)
        mo.updateMatrix()
        rain.setMatrixAt(i, mo.matrix)
      })
      rain.instanceMatrix.needsUpdate = true
    }
    // the marker at the chosen level
    marker.position.y = Y1 - S.d
    marker.material.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.2
    // the release under way
    const a = soilAge()
    let shownMotes = 0
    let shownPo = 0
    if (sim) {
      const hp = moteHalo.geometry.attributes.position
      sim.forEach((m, i) => {
        let [x, y] = moteAt(m, a)
        let z = 0.03
        let vis = true
        let fade = 1
        if (m.end === 'air' && a > m.t) {
          // out into the air: up past the glass's top and away, fading
          const u = a - m.t
          y = Y1 + u * 0.55
          x += Math.sin(u * 1.7 + i) * 0.15 + u * 0.08 * (i % 2 ? 1 : -1)
          z = 0.03 + u * 0.12
          fade = 1 - smooth(1.6, 3.2, u)
          vis = fade > 0.02
        }
        if (m.end === 'decay' && a > m.t) {
          vis = false
          mo.position.set(x, y, 0.035)
          mo.rotation.set(0, 0, 0)
          mo.scale.setScalar(0.034)
          mo.updateMatrix()
          poMesh.setMatrixAt(shownPo++, mo.matrix)
        }
        if (vis) {
          mo.position.set(x, y, z)
          mo.scale.setScalar(0.045 * (0.6 + 0.4 * fade))
          mo.updateMatrix()
          moteMesh.setMatrixAt(shownMotes, mo.matrix)
          hp.setXYZ(shownMotes, x, y, z)
          moteHalo.geometry.attributes.color.setXYZ(shownMotes, fade, fade, fade)
          shownMotes++
        }
      })
      for (let j = shownMotes; j < MOTES; j++) hp.setXYZ(j, 0, -99, 0)
      hp.needsUpdate = true
      moteHalo.geometry.attributes.color.needsUpdate = true
      const end = Math.max(...sim.map(m => m.t)) + 2.2
      if (!relDone && a > end) {
        relDone = true
        if (relOwn) say(fill(at(E.soil.says.done, level()), { n: reachedBy(a) }))
        drawSoilBoard()
      }
      setText(dayText, !relDone ? fill(E.soil.labels.day, { n: Math.floor(a / DAY) }) : '')
      // the board follows the arrivals
      const n = reachedBy(a)
      if (!relDone && n !== boardDrawnAt) {
        boardDrawnAt = n
        drawSoilBoard()
      }
    }
    moteMesh.count = shownMotes
    moteMesh.instanceMatrix.needsUpdate = true
    poMesh.count = shownPo
    poMesh.instanceMatrix.needsUpdate = true
  })
  clickable(soilHit, h => {
    const p = colG.worldToLocal(h.point.clone())
    soilStep('level', Y1 - p.y)
  })
  clickable(cloudG, () => soilStep('cloud'))
  clickable(sBoard.group, () => ctx.showPanel(soilPanel))
  const soilSpot = local(colG, 0, 0, 3.3)
  ex.add({
    id: 'soil',
    x: soilSpot.x,
    z: soilSpot.z,
    radius: 2.2,
    manual: true,
    label: E.soil.label,
    verb: soilHint,
    screens: [sBoard],
    focus: (() => {
      const c = local(colG, 0.55, 2.55, 0.2)
      return { x: c.x, y: c.y, z: c.z, size: 5.0, width: 4.0 }
    })(),
    act: () => ctx.showPanel(soilPanel),
  })
  solids.push(circle(COL.x, COL.z, 0.9))
  {
    const b = local(colG, 1.6, 0, 0.85)
    solids.push(circle(b.x, b.z, 0.3))
  }
  const soilState = () => ({ wet: S.wet, k: S.k, d: S.d, rel: S.rel ? { d: S.rel.d, wet: S.rel.wet, age: Math.round(soilAge() * 10) / 10 } : null, b: [...S.b] })
  const soilSet = (s, live, ago = 0) => {
    const k = Math.max(0, Math.round(Number(s?.k) || 0))
    const wasK = S.k
    const wasWet = S.wet
    S.wet = !!s?.wet
    S.d = clamp(Math.round((Number(s?.d) || 1) * 2) / 2, 0.5, 3)
    S.b = Array.from({ length: 12 }, (_, i) => {
      const v = Math.round(Number(s?.b?.[i]))
      return Number.isFinite(v) ? clamp(v, -1, 20) : -1
    })
    if (S.wet && !wasWet) {
      S.rained = true
      if (live) rainT = 0
    }
    if (!live) wetNow = S.wet ? 1 : 0
    S.k = k
    if (s?.rel && k > 0) {
      const d = clamp(Math.round((Number(s.rel.d) || 1) * 2) / 2, 0.5, 3)
      const changed = k !== wasK
      S.rel = { d, wet: !!s.rel.wet }
      if (changed || !sim) startRelease(false, Math.max(0, Number(s.rel.age) || 0) + (ago || 0))
      if (live && changed) play('beam')
      if (!S.depths.includes(d)) S.depths.push(d)
    } else {
      S.rel = null
      sim = null
    }
    boardDrawnAt = -1
    drawSoilBoard()
    repanel(soilPanel)
  }

  // ======================= the family: meeting its members =======================
  const F = { sel: -1, met: new Set() }
  const famHint = () => {
    if (F.sel < 0) return E.family.hints.atom
    if (!F.met.has(RN_I)) return E.family.hints.radon
    return E.family.hints.more
  }
  const FORGE_LINK = E.family.forge
  const familyPanel = lv => ({
    title: E.family.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.family.buttons.top, onClick: () => famStep(0) },
          { label: E.family.buttons.radon, onClick: () => famStep(RN_I) },
          { label: E.family.buttons.end, onClick: () => famStep(SERIES.length - 1) },
        ],
      },
      ...paras(E.family.panel, lv),
      { link: { to: '/forge', label: FORGE_LINK } },
    ],
  })
  const nameMass = i => `${nameOf(element(SERIES[i][0]), lang)}-${SERIES[i][1]}`
  const famLine = (i, lv) => {
    if (lv !== 'scientist') return E.family.kid[i]
    if (i === RN_I) return E.family.sci.rn
    if (i === SERIES.length - 1) return E.family.sci.end
    const [, , mode] = SERIES[i]
    const nx = SERIES[i + 1]
    const line = fill(E.family.sci.line, {
      name: nameMass(i),
      state: E.family.state.solid,
      hl: E.family.hl[i],
      mode: mode === 'a' ? E.family.sci.alpha : E.family.sci.beta,
      next: `${nx[0]}-${nx[1]}`,
    })
    return i === 2 ? `${line} ${E.family.sci.pa}` : line
  }
  const showFamily = () => {
    const i = F.sel
    famLabel.visible = i >= 0
    if (i < 0) return
    const st = i === RN_I ? E.family.state.gas : E.family.state.solid
    setText(famLabel, `${nameMass(i)}\n${E.family.hl[i]} · ${st}`)
    const p = i === RN_I ? RN_FLOAT : atoms[i].g.position
    famLabel.position.set(clamp(p.x, STAIR.x0 + 0.5, stepPos[SERIES.length - 1][0] - 0.4), p.y + (i === RN_I ? 0.32 : 0.28), STAIR.z + 0.18)
  }
  function famStep(i) {
    if (!(i >= 0 && i < SERIES.length)) return
    F.sel = i
    F.met.add(i)
    showFamily()
    play('select')
    say(famLine(i, level()))
    ex.discover('family', familyPanel, 3.5)
    repanel(familyPanel)
    share('family')
  }
  atoms.forEach((a, i) => clickable(a.hit, () => famStep(i), { reach: 5 }))
  clickable(rnHit, () => famStep(RN_I), { reach: 5 })
  ex.add({
    id: 'family',
    x: 0,
    z: -3.0,
    radius: 2.0,
    manual: true,
    label: E.family.label,
    verb: famHint,
    focus: { x: -0.05, y: 3.75, z: STAIR.z, size: 2.0, width: 4.7 },
    act: () => ctx.showPanel(familyPanel),
  })
  updates.push((dt, t) => {
    atoms.forEach((a, i) => {
      if (!a.ball) return
      const on = i === F.sel
      const k = damp(a.ball.scale.x / a.r, on ? 1.3 : 1, 6, dt)
      a.ball.scale.setScalar(a.r * k)
      a.mat.emissiveIntensity = on ? 0.75 + Math.sin(t * 4) * 0.12 : 0.3
    })
    const rk = F.sel === RN_I ? 1.3 : 1
    rnFloat.group.position.set(RN_FLOAT.x + Math.sin(t * 0.7) * 0.04, RN_FLOAT.y + Math.sin(t * 1.1) * 0.06, RN_FLOAT.z)
    rnFloat.ball.scale.setScalar(damp(rnFloat.ball.scale.x, 0.13 * rk, 6, dt))
    rnFloat.halo.material.opacity = 0.5 + Math.sin(t * 2.2) * 0.12 + (F.sel === RN_I ? 0.2 : 0)
    // the wisp from the crack up to radon's place
    const wp = wisp.geometry.attributes.position
    const wc = wisp.geometry.attributes.color
    const from = V(BOULDER.x + CRACK[0][0], fy1 - 0.15, BOULDER.z + 0.08)
    const to = rnFloat.group.position
    wispSeeds.forEach(([s1, s2], i) => {
      const u = (t * 0.07 + s1) % 1
      const x = from.x + (to.x - from.x) * u + Math.sin(u * 7 + s2 * 6 + t * 0.8) * 0.14 * Math.sin(u * Math.PI)
      const y = from.y + (to.y - from.y) * u
      const z = from.z + (to.z - from.z) * u + Math.cos(u * 5 + s2 * 4) * 0.08
      wp.setXYZ(i, x, y, z)
      const o = Math.sin(u * Math.PI) * 0.9
      wc.setXYZ(i, o, o, o)
    })
    wp.needsUpdate = true
    wc.needsUpdate = true
  })
  const famState = () => ({ sel: F.sel })
  const famSet = (s, live) => {
    const i = Math.round(Number(s?.sel))
    F.sel = i >= 0 && i < SERIES.length ? i : -1
    if (F.sel >= 0) F.met.add(F.sel)
    showFamily()
    if (live && F.sel >= 0) play('select')
  }

  // radon seeping out of the hillside here and there
  const SEEP = light ? 16 : 36
  const seep = cloud(SEEP, RN_GLOW, 0.1, 0.7)
  root.add(seep)
  const seepSeeds = Array.from({ length: SEEP }, (_, i) => {
    const a = hash(31, i) * TAU
    const r = 2.5 + Math.sqrt(hash(32, i)) * 8
    return [Math.cos(a) * r, Math.sin(a) * r, hash(33, i)]
  })
  updates.push((dt, t) => {
    const p = seep.geometry.attributes.position
    const c = seep.geometry.attributes.color
    seepSeeds.forEach(([x, z, s], i) => {
      const u = (t * 0.06 + s) % 1
      p.setXYZ(i, x + Math.sin(u * 6 + s * 9) * 0.2, stage.groundAt(x, z) + u * 2.6, z + Math.cos(u * 5 + s * 7) * 0.2)
      const o = Math.sin(u * Math.PI) * 0.75
      c.setXYZ(i, o, o, o)
    })
    p.needsUpdate = true
    c.needsUpdate = true
    stage.update(t)
  })

  const lensAt = (x, y, z = FZ) => lens.localToWorld(V(x, y, z))
  return {
    env: stage.env,
    solids,
    floor: stage.groundAt,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.6 },
    spawn: { x: 0, z: 5.4, yaw: 0 },
    hostSpot: { x: 1.7, z: 4.3, yaw: Math.atan2(1.7, -1.0) },
    back: { x: 0, z: 9.1, rot: Math.PI },
    stand: { x: -2.6, z: 3.8, rot: Math.atan2(2.6, 1.6) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      grain: {
        tap: (what, v) => grainStep(what, v), // 'radium', 'twenty', 'dropper', 'spot' ({ x, d }), 'depth' (nm), 'water' (0..1)
        get state() { return grainState() },
        get busy() { return boardBusy > 0 || flyers.some(f => f.busy) },
        radiumAt: () => radium.getWorldPosition(V()),
        grainAt: (x, d) => lensAt(x, ys(x) - d * NM, GRAIN_D / 2 + 0.01),
        dropperAt: () => lensAt(-1.3, 0.85, FZ + 0.17),
        boardAt: () => gBoard.panel.getWorldPosition(V()),
        // the end of try n at the current depth and water, without doing it
        peek: n => recoil(n, G.d, G.x, G.w).end,
      },
      soil: {
        tap: (what, v) => soilStep(what, v), // 'level' (m deep), 'cloud', 'depth' (m), 'release' (m)
        get state() { return soilState() },
        get reached() { return reachedBy(soilAge()) },
        get done() { return relDone },
        levelAt: d => colG.localToWorld(V(0, Y1 - d, 0.66)),
        cloudAt: () => cloudG.getWorldPosition(V()),
        boardAt: () => sBoard.panel.getWorldPosition(V()),
      },
      family: {
        tap: i => famStep(i), // 0 (U-238) to 14 (Pb-206); 6 is radon
        get state() { return famState() },
        atomAt: i => (i === RN_I ? rnFloat.group.getWorldPosition(V()) : atoms[i].g.getWorldPosition(V())),
      },
      faceAt: () => boulderG.localToWorld(V(1.2, 1.2, 0.01)),
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { grain: grainPanel, soil: soilPanel, family: familyPanel },
    shared: {
      grain: { get: grainState, set: grainSet },
      soil: { get: soilState, set: soilSet },
      family: { get: famState, set: famSet },
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
