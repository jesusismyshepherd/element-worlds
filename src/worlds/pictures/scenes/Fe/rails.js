// Iron's picture "How do you weld a railway track?" as a room (docs/knowledge/picture-rooms.md): a thermite
// welding site on a railway line at night (stages/railway.js), the picture's floodlit track running to the
// horizon, its crucible pouring white-hot iron into a mould round a gap in the near rail, the sparks, and its
// lens where aluminium takes the oxygen from rust. Each step is chosen by tapping its thing (the user,
// 2026-10-30); the prompt names the next tap; E opens the station's panel, whose buttons and sliders do the
// same:
// - the thermite crucible, cut open: tap the rust jar and the aluminium jar to pour scoops in (or the mix
//   slider), tap the igniter: the burning front runs down, a thermometer climbs to about 2500 °C, the heavy
//   liquid iron sinks under the light slag (off the 3 : 1 ratio it stays lumpy or fizzles out); the lens
//   shows two aluminium atoms taking the three oxygens of Fe2O3;
// - the weld on the near rail: tap the rail ends (a 25 mm gap), the sand mould, the torch (a preheat slider
//   too), the crucible (the steel pours in), the shear, the grinder; then the signal: a train clacks over
//   the old jointed line beside it, and glides over the welded one;
// - who takes the oxygen? A bench by the maintenance van: tap a metal jar and an oxide jar, light the little
//   crucible: magnesium and aluminium burn rust, copper does not, iron takes copper's oxygen; the ladder on
//   the van fills in, the tightest holders of oxygen at the top.
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's. Every
// moving thing is drawn from its state and the time since its step began, so a latecomer finds it as it is.
// parts.<exhibit>.tap(thing) does what a tap does, for the probes; parts.at.<thing>() a point to aim a real
// tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, random, fill } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { railwayStage, railTrain, railGeometry, railShape, RAIL_HALF, RAIL_BASE, RAIL_TOP, BALLAST_TOP } from '../../stages/railway.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { RAILS_WORDS } from './rails.words.js'

export const WORDS = RAILS_WORDS

const TAU = Math.PI * 2
// a count for this frame from a rate per second (the fraction carried as a chance)
const rate = (perSecond, dt) => {
  const n = perSecond * dt
  return Math.floor(n) + (Math.random() < n % 1 ? 1 : 0)
}
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// ---- the line: a long-welded track and an old jointed one beside it ----
const NEW_X = 3.6
const OLD_X = 7.8
const NEAR_X = NEW_X - RAIL_HALF // the rail being welded
const WZ = -1.95 // the weld: a crib between two sleepers (sleepers lie at (k + 0.5) x 0.65 m)
const CUT = 5 // the stage leaves the near rail out for 5 m either side; the room lays its own two pieces there
const GAP = 0.025

// ---- thermite: Fe2O3 + 2 Al -> Al2O3 + 2 Fe ----
const RATIO = 159.69 / (159.69 + 53.96) // the right share of rust by mass (0.748, 2.96 : 1)
const FULL = 8 // scoops the crucible holds
// how much of the mix can react (the scarcer powder's share of what it needs); the products' heat is
// spread over all of it, so the top temperature falls off away from the right ratio (roughly: about
// 2500 °C at best, as the products of a real portion reach)
const quality = s => Math.max(0, Math.min(s / RATIO, (1 - s) / (1 - RATIO)))
const peakOf = s => 20 + 2480 * quality(s)
const ALUMINA_MELTS = 2072
const IRON_MELTS = 1538
const outcomeOf = (r, a) => {
  if (!(r > 0 && a > 0)) return 'none'
  const T = peakOf(r / (r + a))
  return T >= ALUMINA_MELTS ? 'good' : T >= 1300 ? 'lumpy' : 'fizzle'
}
// the demo burn's timeline (s): the igniter, the burning front, the iron sinking, cooling (sped up)
const IGN = 1.0
const BURN = 3.2
const SEP = 2.6
const COOL = 12
const MIX_END = IGN + BURN + SEP + COOL

// ---- the weld's timeline (s; the real minutes sped up) ----
const ALIGN = 1.0
const CLAMP = 1.2
const HEAT_RATE = 0.45 // minutes of preheat per second
const HEAT_OK = 1.6 // minutes: warm enough to pour
const HEAT_TO = 2.0 // the torch's run (one maker's short preheat)
const MOVE = 0.8 // the crucible over the gap
const REACT = 3.0 // about 20 s in the real crucible
const POUR = 2.0
const SET = 4.0 // 4 to 5 minutes in the real mould
const SHEAR = 2.6
const GRIND = 4.1
// the trains: from behind the visitor out to the far horizon, as the picture's track runs (the signal faces
// them, so the visitor sees it change); the welded line's starts when the old one's is well past
const T_FROM = 90
const T_TO = -290
const T_SPEED = 20
const T_NEXT = 7.0
const T_RUN = (T_FROM - T_TO) / T_SPEED

// ---- who holds oxygen tightest: Gibbs energy of formation per mole of O atoms at 25 °C (kJ) ----
const GRIP = { Mg: 569, Al: 527, Fe: 247, Cu: 130 }
const METALS = ['Mg', 'Al', 'Fe', 'Cu']
const OXIDES = ['Fe2O3', 'CuO']
const METAL_OF = { Fe2O3: 'Fe', CuO: 'Cu' }
const RESULT = { Mg_Fe2O3: 'burn', Al_Fe2O3: 'burn', Cu_Fe2O3: 'none', Mg_CuO: 'burn', Al_CuO: 'fast', Fe_CuO: 'glow' }
const BENCH_T = 3.6
const CPK = { Fe: '#e06633', O: '#f2302b', Al: '#bfa6a6', Mg: '#6fd33a', Cu: '#c88033' }
const POWDER = { Mg: '#b9bec6', Al: '#c9ccd4', Fe: '#4a4c53', Cu: '#c4703a', Fe2O3: '#8a3418', CuO: '#1f1d1d' }

/** A soft round glow. */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A flame: a bright teardrop, its tip up. */
function flameTex() {
  return canvasTex(64, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h * 0.72, 2, w / 2, h * 0.62, h * 0.55)
    grd.addColorStop(0, 'rgba(255,255,240,1)')
    grd.addColorStop(0.3, 'rgba(255,214,120,0.85)')
    grd.addColorStop(0.65, 'rgba(255,120,30,0.35)')
    grd.addColorStop(1, 'rgba(255,60,0,0)')
    g.fillStyle = grd
    g.beginPath()
    g.moveTo(w / 2, 0)
    g.quadraticCurveTo(w * 1.05, h * 0.62, w / 2, h)
    g.quadraticCurveTo(-w * 0.05, h * 0.62, w / 2, 0)
    g.fill()
  })
}

/** Sand: a fine pale grain (a mould's). */
function sandTex() {
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#b7a684'
    g.fillRect(0, 0, w, h)
    const rnd = random(77)
    for (let i = 0; i < 1800; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(120,104,78,${0.3 + rnd() * 0.4})` : `rgba(230,220,196,${0.25 + rnd() * 0.35})`
      g.fillRect(rnd() * w, rnd() * h, 1.2, 1.2)
    }
  })
}

/** Sparks: a pool of glowing points thrown out and falling. */
function sparkPool(n, tex) {
  const pos = new Float32Array(n * 3).fill(0)
  const col = new Float32Array(n * 3)
  const vel = new Float32Array(n * 3)
  const life = new Float32Array(n)
  const span0 = new Float32Array(n)
  const tint = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) pos[i * 3 + 1] = -50
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.045, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.raycast = () => {}
  let next = 0
  return {
    points,
    /** count sparks from p, thrown at about `speed` m/s, mostly upward (`up`), spread round (`spread`). */
    emit(p, count, { speed = 2.2, up = 1, spread = 1, life: L = 0.9, color = [1, 0.72, 0.32], dir = null } = {}) {
      for (let k = 0; k < count; k++) {
        const i = next
        next = (next + 1) % n
        const a = Math.random() * TAU
        const s = speed * (0.4 + Math.random() * 0.8)
        let vx = Math.cos(a) * spread * s
        let vz = Math.sin(a) * spread * s
        let vy = up * s * (0.6 + Math.random() * 0.6)
        if (dir) {
          vx += dir.x * s
          vy += dir.y * s
          vz += dir.z * s
        }
        pos.set([p.x, p.y, p.z], i * 3)
        vel.set([vx, vy, vz], i * 3)
        life[i] = span0[i] = L * (0.5 + Math.random() * 0.8)
        const w = 0.75 + Math.random() * 0.5
        tint.set([color[0] * w, color[1] * w, color[2] * w], i * 3)
      }
    },
    update(dt) {
      for (let i = 0; i < n; i++) {
        if (life[i] <= 0) continue
        life[i] -= dt
        const j = i * 3
        vel[j + 1] -= 9.8 * dt
        pos[j] += vel[j] * dt
        pos[j + 1] += vel[j + 1] * dt
        pos[j + 2] += vel[j + 2] * dt
        if (pos[j + 1] < 0.02) {
          pos[j + 1] = 0.02
          vel[j + 1] *= -0.25
          vel[j] *= 0.5
          vel[j + 2] *= 0.5
        }
        const k = life[i] <= 0 ? 0 : clamp(life[i] / span0[i]) ** 0.7
        col[j] = tint[j] * k
        col[j + 1] = tint[j + 1] * k
        col[j + 2] = tint[j + 2] * k
        if (life[i] <= 0) pos[j + 1] = -50
      }
      geo.attributes.position.needsUpdate = true
      geo.attributes.color.needsUpdate = true
    },
  }
}

/** Smoke: soft grey puffs rising and spreading (thermite gives a thick white smoke of alumina). */
function smokePool(n, tex, parent) {
  const puffs = []
  for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: '#cfd2da', transparent: true, opacity: 0, depthWrite: false }))
    s.visible = false
    s.raycast = () => {}
    parent.add(s)
    puffs.push({ s, life: 0, span: 1, v: new THREE.Vector3(), size: 0.3 })
  }
  let next = 0
  return {
    emit(p, { size = 0.35, rise = 0.6, life = 2.6, drift = 0.15, opacity = 0.32 } = {}) {
      const q = puffs[next]
      next = (next + 1) % n
      q.s.position.copy(p)
      q.v.set((Math.random() - 0.5) * drift, rise * (0.7 + Math.random() * 0.6), (Math.random() - 0.5) * drift)
      q.life = q.span = life
      q.size = size
      q.op = opacity
      q.s.visible = true
    },
    update(dt) {
      for (const q of puffs) {
        if (q.life <= 0) continue
        q.life -= dt
        const k = 1 - q.life / q.span
        q.s.position.addScaledVector(q.v, dt)
        q.s.scale.setScalar(q.size * (1 + k * 2.4))
        q.s.material.opacity = q.op * Math.sin(Math.PI * clamp(k)) * (k < 0.1 ? k * 10 : 1)
        if (q.life <= 0) q.s.visible = false
      }
    },
  }
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = railwayStage({
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    tracks: [{ x: NEW_X }, { x: OLD_X, jointed: true }],
    cuts: [{ track: 0, side: -1, z0: WZ - CUT, z1: WZ + CUT }],
    poles: -12.5,
    floods: [
      // the picture's floodlight on the right, across the tracks onto the weld and the site
      { x: 11.6, z: -0.8, h: 7.6, aim: [0.5, 0, -2.6], intensity: light ? 95 : 110, reach: 40, angle: 0.55, beam: 0.1 },
      // a second mast behind the crucible, over the site's left half
      { x: -6.6, z: -9.0, h: 6.2, aim: [-3.2, 0, -2.8], intensity: light ? 45 : 55, reach: 24, angle: 0.75, beam: 0.07 },
    ],
    signals: [
      { x: NEW_X - 2.0, z: -150, color: '#ff3a2a' },
      { x: OLD_X + 2.0, z: -215, color: '#36ff80' },
      { x: OLD_X + 2.0, z: 160, color: '#36ff80' },
    ],
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = []
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v)
  const born = performance.now()
  const clock = () => (performance.now() - born) / 1000
  const soft = softTex()
  const flame = flameTex()
  const sand = sandTex()
  textures.push(soft, flame, sand)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null
  const label = (text, size, colour = '#f4ecdc', opts = {}) => makeText(text, { size, color: colour, outlineWidth: size * 0.08, outlineColor: '#0a0d18', ...opts })
  const pair = (entry, size, colour, opts = {}) => {
    const g = new THREE.Group()
    for (const k of ['kid', 'sci']) {
      const t = label(at(entry, k === 'sci' ? 'scientist' : 'explorer'), size, colour, opts)
      g.add(t)
      byLevel.push([t, k])
    }
    return g
  }
  const sparks = sparkPool(light ? 160 : 360, soft)
  root.add(sparks.points)
  const smoke = smokePool(light ? 14 : 26, soft, root)
  updates.push(dt => {
    sparks.update(dt)
    smoke.update(dt)
  })
  const steel = mats.rail
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#2e323b', metalness: 0.6, roughness: 0.5 })
  const yellow = new THREE.MeshStandardMaterial({ color: '#f2c230', roughness: 0.5, metalness: 0.2 })
  const orange = new THREE.MeshStandardMaterial({ color: '#e8722c', roughness: 0.55, metalness: 0.15 })
  const sandMat = new THREE.MeshStandardMaterial({ map: sand, roughness: 1 })
  const refractory = new THREE.MeshStandardMaterial({ color: '#cfc4ad', roughness: 0.95 })
  const sx = (a, b) => new THREE.Vector3().subVectors(b, a)
  /** A stick from a to b (a cylinder of radius r). */
  function stick(a, b, r, mat) {
    const d = sx(a, b)
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat)
    m.position.copy(a).addScaledVector(d, 0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    return m
  }

  // ======== the work site: gravel underfoot, barriers round it, cones along the line ========
  {
    const g = stage.gravelTexture(9, '#343843')
    g.repeat.set(6, 10)
    textures.push(g)
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 20), new THREE.MeshStandardMaterial({ map: g, color: '#8a909c', roughness: 1 }))
    pad.rotation.x = -Math.PI / 2
    pad.position.set(-4.2, 0.012, 0)
    root.add(pad)
    // orange mesh barriers on feet: behind (north), on the left (west), at the back (south)
    const fence = canvasTex(256, 128, (g2, w, h) => {
      g2.clearRect(0, 0, w, h)
      g2.strokeStyle = '#ff7a1c'
      g2.lineWidth = 3
      for (let x = -h; x < w + h; x += 18) {
        g2.beginPath()
        g2.moveTo(x, 0)
        g2.lineTo(x + h, h)
        g2.moveTo(x + h, 0)
        g2.lineTo(x, h)
        g2.stroke()
      }
      g2.fillStyle = '#ff7a1c'
      g2.fillRect(0, 0, w, 10)
      g2.fillRect(0, h - 10, w, 10)
      g2.fillStyle = '#ffffff'
      for (let x = 0; x < w; x += 64) g2.fillRect(x, 0, 32, 10)
    })
    textures.push(fence)
    const fenceMat = new THREE.MeshStandardMaterial({ map: fence, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, emissive: '#ff6a10', emissiveIntensity: 0.18, emissiveMap: fence, roughness: 0.8 })
    const runs = [
      [[-10.2, -9.6], [1.2, -9.6]],
      [[-10.2, -9.6], [-10.2, 9.6]],
      [[-10.2, 9.6], [1.2, 9.6]],
    ]
    for (const [[x0, z0], [x1, z1]] of runs) {
      const len = Math.hypot(x1 - x0, z1 - z0)
      const n = Math.max(1, Math.round(len / 2.2))
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(len / n - 0.05, 0.95), fenceMat)
        panel.position.set(lerp(x0, x1, t), 0.6, lerp(z0, z1, t))
        panel.rotation.y = Math.atan2(-(z1 - z0), x1 - x0)
        root.add(panel)
      }
      solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0) + 0.4, Math.abs(z1 - z0) + 0.4))
    }
    // the line's edge: nobody walks onto the ballast (the trains run past here)
    solids.push(box(1.75, 0, 0.6, 30))
    const coneMat = new THREE.MeshStandardMaterial({ color: '#ff6a1a', emissive: '#ff4a00', emissiveIntensity: 0.25, roughness: 0.6 })
    const stripe = new THREE.MeshStandardMaterial({ color: '#f4f4f4', emissive: '#9aa0b0', emissiveIntensity: 0.3 })
    for (let z = -8.8; z < 9; z += 2.2) {
      if (Math.abs(z - WZ) < 1.4) continue
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.48, 12), coneMat)
      cone.position.set(1.32, 0.24, z)
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.08, 12), stripe)
      band.position.set(1.32, 0.3, z)
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), coneMat)
      base.position.set(1.32, 0.015, z)
      root.add(cone, band, base)
    }
  }

  // ======== 1. the thermite crucible, cut open ========
  const CR = { x: -2.6, z: -5.7, yb: 0.98, yt: 1.86, rb: 0.11, rt: 0.36, wall: 0.075 }
  const CRH = CR.yt - CR.yb
  const crR = y => lerp(CR.rb, CR.rt, (y - CR.yb) / CRH)
  const volTo = y => {
    const h = clamp(y - CR.yb, 0, CRH)
    const r = crR(CR.yb + h)
    return (Math.PI / 3) * h * (CR.rb * CR.rb + CR.rb * r + r * r)
  }
  const heightFor = v => {
    let lo = CR.yb
    let hi = CR.yt
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (volTo(mid) < v) lo = mid
      else hi = mid
    }
    return (lo + hi) / 2
  }
  const CAP = volTo(CR.yb + CRH * 0.84)
  const yOfScoops = s => heightFor((CAP * clamp(s, 0, FULL)) / FULL)
  const MIX_SPOT = { x: -2.75, z: -3.1 }
  const crucible = new THREE.Group()
  crucible.position.set(CR.x, 0, CR.z)
  root.add(crucible)
  {
    // the lining (refractory) and the steel shell: the back half, the front cut away toward the visitor
    const w = CR.wall
    const prof = [
      [0.0001, CR.yb],
      [CR.rb, CR.yb],
      [CR.rt, CR.yt],
      [CR.rt + w, CR.yt],
      [CR.rb + w + 0.01, CR.yb - 0.09],
      [0.0001, CR.yb - 0.09],
    ].map(([r, y]) => new THREE.Vector2(r, y))
    const lining = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#7d7062', roughness: 0.95, side: THREE.DoubleSide }))
    crucible.add(lining)
    const shellProf = [[CR.rt + w + 0.022, CR.yt + 0.012], [CR.rb + w + 0.032, CR.yb - 0.1], [0.0001, CR.yb - 0.1]].map(([r, y]) => new THREE.Vector2(r, y))
    const shell = new THREE.Mesh(new THREE.LatheGeometry(shellProf, 32, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#3c414b', metalness: 0.6, roughness: 0.45, side: THREE.DoubleSide }))
    crucible.add(shell)
    // the cut faces: the wall's section on either side, hatched as a drawing's cut is, a dark shell edge
    const hatch = canvasTex(
      64,
      64,
      (g, W2, H2) => {
        g.fillStyle = '#a89a82'
        g.fillRect(0, 0, W2, H2)
        g.strokeStyle = '#7a6c58'
        g.lineWidth = 5
        for (const o of [-W2, 0, W2]) {
          g.beginPath()
          g.moveTo(o, H2)
          g.lineTo(o + W2, 0)
          g.stroke()
        }
      },
      { repeat: true },
    )
    hatch.repeat.set(14, 14)
    textures.push(hatch)
    const hatchMat = new THREE.MeshStandardMaterial({ map: hatch, roughness: 0.9, side: THREE.DoubleSide })
    for (const s of [-1, 1]) {
      const sh = new THREE.Shape()
      const pts = [[0, CR.yb], [CR.rb, CR.yb], [CR.rt, CR.yt], [CR.rt + w, CR.yt], [CR.rb + w + 0.01, CR.yb - 0.09], [0, CR.yb - 0.09]]
      pts.forEach(([x, y], i) => (i ? sh.lineTo(s * x, y) : sh.moveTo(s * x, y)))
      const face = new THREE.Mesh(new THREE.ShapeGeometry(sh), hatchMat)
      face.position.z = 0.001
      crucible.add(face)
      const edge = new THREE.Shape()
      const e = [[CR.rt + w, CR.yt + 0.012], [CR.rt + w + 0.022, CR.yt + 0.012], [CR.rb + w + 0.032, CR.yb - 0.1], [CR.rb + w + 0.01, CR.yb - 0.1]]
      e.forEach(([x, y], i) => (i ? edge.lineTo(s * x, y) : edge.moveTo(s * x, y)))
      const em = new THREE.Mesh(new THREE.ShapeGeometry(edge), darkMetal)
      em.position.z = 0.002
      crucible.add(em)
    }
    // the tripod: a ring round the waist, three legs to the ground (none in front of the cut)
    const ringY = 1.3
    const ringR = crR(ringY) + w + 0.03
    const ring = new THREE.Mesh(new THREE.TorusGeometry(ringR, 0.02, 6, 32), darkMetal)
    ring.rotation.x = Math.PI / 2
    ring.position.y = ringY
    crucible.add(ring)
    for (const a of [Math.PI / 2 + 0.0, Math.PI / 2 + 2.3, Math.PI / 2 - 2.3]) {
      const top = new THREE.Vector3(Math.cos(a) * ringR, ringY, -Math.sin(a) * ringR)
      const foot = new THREE.Vector3(Math.cos(a) * 0.62, 0, -Math.sin(a) * 0.62)
      crucible.add(stick(top, foot, 0.022, darkMetal))
    }
    solids.push(circle(CR.x, CR.z, 0.6))
  }
  // the contents, seen in the cut: a canvas drawn from the state (powder layers, the burning front, the
  // liquid iron and slag, the cooled lump), its glowing parts in a second canvas
  const SW = 256
  const SH = 512
  const secCols = canvasTex(SW, SH, null, { mipmaps: false })
  const secGlow = canvasTex(SW, SH, null, { mipmaps: false })
  textures.push(secCols, secGlow)
  const secMat = new THREE.MeshStandardMaterial({ map: secCols, emissive: '#ffffff', emissiveMap: secGlow, emissiveIntensity: 0.9, transparent: true, alphaTest: 0.5, roughness: 0.95 })
  const section = new THREE.Mesh(new THREE.PlaneGeometry(CR.rt * 2, CRH), secMat)
  section.position.set(0, (CR.yb + CR.yt) / 2, 0.004)
  crucible.add(section)
  // the top of the contents, a half disc at its level
  const topMat = new THREE.MeshStandardMaterial({ color: '#7a3216', emissive: '#000000', roughness: 0.95 })
  const topDisc = new THREE.Mesh(new THREE.CircleGeometry(1, 28, 0, Math.PI), topMat)
  topDisc.rotation.x = -Math.PI / 2
  crucible.add(topDisc)
  // the fire's light, from above the mouth (a light close to the pale lining washed the whole cut white)
  const crLight = new THREE.PointLight('#ffb060', 0, 8, 1.6)
  crLight.position.set(0, CR.yt + 1.0, -0.4)
  crucible.add(crLight)
  // what is in it, in front of the tripod: scoops of each (Explorer) or rust's share by weight (Scientist)
  const countSign = label(' ', 0.062, '#ffe08a', { anchorY: 'top', maxWidth: 1.4 })
  countSign.position.set(CR.x, 0.8, CR.z + 0.66)
  root.add(countSign)
  let countKey = ''
  // the two layers named once they have parted
  const layerTags = {}
  for (const k of ['slag', 'iron']) {
    const t = label(E.mix.tags[k], 0.06, k === 'iron' ? '#ffe2a0' : '#ffc890', { anchorX: 'left' })
    t.visible = false
    crucible.add(t)
    layerTags[k] = t
  }
  const crFlames = []
  for (let i = 0; i < 3; i++) {
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd27a').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
    f.position.set((i - 1) * 0.14, CR.yt + 0.25, -0.05)
    f.raycast = () => {}
    crucible.add(f)
    crFlames.push(f)
  }

  // the jars, on a crate on the left
  const CRATE = { x: -4.05, z: -5.35 }
  const crate = new THREE.Group()
  crate.position.set(CRATE.x, 0, CRATE.z)
  root.add(crate)
  const wood = new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.85 })
  {
    const c = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.66, 0.6, 2, 0.03), wood)
    c.position.y = 0.33
    crate.add(c)
    solids.push(circle(CRATE.x, CRATE.z, 0.55))
  }
  const jars = {}
  for (const [k, dx] of [['rust', -0.23], ['al', 0.23]]) {
    const g = new THREE.Group()
    g.position.set(dx, 0.66, 0)
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.32, 24, 1, true), edgeGlass({ color: '#dbe6ff', edge: 0.7, base: 0.05 }))
    glass.position.y = 0.16
    glass.renderOrder = 3
    const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.2, 24), new THREE.MeshStandardMaterial({ color: k === 'rust' ? '#8a3418' : '#c4c8d0', roughness: k === 'rust' ? 0.95 : 0.5, metalness: k === 'rust' ? 0 : 0.6 }))
    powder.position.y = 0.105
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.03, 24), darkMetal)
    lid.position.set(0.0, 0.34, 0)
    const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.05, 12), steel)
    scoop.position.set(0.05, 0.24, 0.03)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 0.34), ghost)
    hit.position.y = 0.2
    g.add(glass, powder, lid, scoop, hit)
    const tag = pair(E.mix.jars[k], 0.075, '#f4ecdc', { anchorY: 'top', maxWidth: 0.6 })
    tag.position.set(dx, 0.58, 0.31)
    crate.add(g, tag)
    jars[k] = g
  }
  // the igniter: a sparkler-like stick in a little stand between the jars and the crucible
  const IGNITER = { x: -3.42, z: -5.0 }
  const igniterStand = new THREE.Group()
  igniterStand.position.set(IGNITER.x, 0, IGNITER.z)
  root.add(igniterStand)
  {
    igniterStand.add(stick(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.95, 0), 0.02, darkMetal))
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 16), darkMetal)
    foot.position.y = 0.02
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.08, 12), darkMetal)
    cup.position.y = 0.95
    igniterStand.add(foot, cup)
    const tag = label(E.mix.igniter, 0.07, '#f4ecdc', { anchorY: 'top' })
    tag.position.set(0, 0.86, 0.08)
    igniterStand.add(tag)
    solids.push(circle(IGNITER.x, IGNITER.z, 0.22))
  }
  const igniter = new THREE.Group()
  {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 6), steel)
    rod.position.y = 0.21
    const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), new THREE.MeshStandardMaterial({ color: '#9a9ca4', roughness: 0.9 }))
    coat.position.y = 0.3
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), new THREE.MeshStandardMaterial({ color: '#c8c8c8', emissive: '#ff9a3a', emissiveIntensity: 0.35 }))
    tip.position.y = 0.42
    igniter.add(tip)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), ghost)
    hit.position.y = 0.2
    igniter.add(rod, coat, hit)
  }
  root.add(igniter)
  const igniterRest = new THREE.Vector3(IGNITER.x, 0.92, IGNITER.z)
  const igniterIn = new THREE.Vector3(CR.x + 0.05, CR.yt - 0.12, CR.z - 0.08)
  const igniterTip = new THREE.Vector3()

  // the thermometer board on the crucible's right
  const GAUGE = { x: -1.5, z: -5.85 }
  const GW = 200
  const GH = 640
  const gaugeTex = canvasTex(GW, GH, null, { mipmaps: false })
  textures.push(gaugeTex)
  {
    const g = new THREE.Group()
    g.position.set(GAUGE.x, 0, GAUGE.z)
    g.rotation.y = Math.atan2(MIX_SPOT.x - GAUGE.x, MIX_SPOT.z - GAUGE.z) * 0.7
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.46, 1.32, 0.05, 2, 0.02), darkMetal)
    frame.position.y = 1.12
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 1.27), new THREE.MeshBasicMaterial({ map: gaugeTex, toneMapped: false, color: '#dcdcdc' }))
    face.position.set(0, 1.12, 0.03)
    g.add(frame, face, stick(new THREE.Vector3(0, 0, -0.04), new THREE.Vector3(0, 0.5, -0.04), 0.025, darkMetal))
    root.add(g)
    solids.push(circle(GAUGE.x, GAUGE.z, 0.3))
  }
  let gaugeShown = ''
  function drawGauge(T, lv) {
    const key = `${Math.round(T / 5)}|${lv}`
    if (key === gaugeShown) return
    gaugeShown = key
    gaugeTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0e1630'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(90,169,255,0.7)'
      g.lineWidth = 4
      g.strokeRect(5, 5, w - 10, h - 10)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const fit = (text, x, y, size, weight = 700, maxW = w - 24) => {
        let s = size
        g.font = `${weight} ${s}px Outfit`
        while (s > 10 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
        g.fillText(text, x, y)
      }
      g.fillStyle = '#9fc8ff'
      fit(E.mix.gauge.title, w / 2, 34, 26)
      g.fillStyle = T > IRON_MELTS ? '#ffd27a' : '#f2f6ff'
      fit(`${nf(Math.round(T / 10) * 10)} °C`, w / 2, 76, 36, 800)
      const X = 58
      const Y0 = h - 40
      const Y1 = 120
      const ty = v => Y0 - (v / 3000) * (Y0 - Y1)
      // the tube and its bulb
      g.fillStyle = '#1d2748'
      g.beginPath()
      g.roundRect(X - 12, Y1 - 12, 24, Y0 - Y1 + 24, 12)
      g.fill()
      const grd = g.createLinearGradient(0, Y0, 0, Y1)
      grd.addColorStop(0, '#ff5a1a')
      grd.addColorStop(0.5, '#ffb030')
      grd.addColorStop(1, '#fff4c8')
      g.fillStyle = grd
      g.beginPath()
      g.roundRect(X - 7, ty(T), 14, Y0 - ty(T) + 6, 7)
      g.fill()
      g.beginPath()
      g.arc(X, Y0 + 8, 16, 0, TAU)
      g.fill()
      // the scale
      g.textAlign = 'left'
      g.fillStyle = '#c8d6f0'
      for (let v = 0; v <= 3000; v += 500) {
        g.fillRect(X + 14, ty(v) - 1, v % 1000 ? 8 : 14, 2)
        if (v % 1000 === 0) {
          g.font = '600 18px Outfit'
          g.fillText(nf(v), X + 32, ty(v))
        }
      }
      // where iron and the slag melt
      const mark = (v, text, c) => {
        g.strokeStyle = c
        g.setLineDash([6, 5])
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(X + 14, ty(v))
        g.lineTo(w - 12, ty(v))
        g.stroke()
        g.setLineDash([])
        g.fillStyle = c
        g.textAlign = 'right'
        fit(`${text} ${nf(v)}`, w - 14, ty(v) - 12, 15, 600, w - X - 30)
        g.textAlign = 'left'
      }
      mark(IRON_MELTS, E.mix.gauge.iron, '#ffb36b')
      mark(ALUMINA_MELTS, at(E.mix.gauge.slag, lv), '#ffe08a')
    })
  }

  // the lens: aluminium takes the oxygen from rust (the picture's magnifier), upper right
  const LENS = { x: -0.82, y: 2.12, z: -5.4, r: 0.4 }
  const lens = new THREE.Group()
  lens.position.set(LENS.x, LENS.y, LENS.z)
  lens.rotation.y = Math.atan2(MIX_SPOT.x - LENS.x, MIX_SPOT.z - LENS.z)
  root.add(lens)
  const atomMats = {}
  const atomMat = (el, glow = 0.2) => (atomMats[`${el}${glow}`] ??= new THREE.MeshStandardMaterial({ color: CPK[el], emissive: CPK[el], emissiveIntensity: glow, roughness: 0.35, metalness: 0.1 }))
  const hotIron = new THREE.MeshStandardMaterial({ color: CPK.Fe, emissive: '#ffb84a', emissiveIntensity: 0, roughness: 0.35 })
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.032, 10, 48), new THREE.MeshStandardMaterial({ color: '#5aa9ff', emissive: '#5aa9ff', emissiveIntensity: 1.1, roughness: 0.4 }))
    const back = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 40), new THREE.MeshBasicMaterial({ color: '#191d30' }))
    back.position.z = -0.03
    const tint = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 40), new THREE.MeshBasicMaterial({ color: '#ff8a2a', transparent: true, opacity: 0.08, depthWrite: false }))
    tint.position.z = -0.025
    lens.add(ring, back, tint)
    // a post down to the ground, behind the lens
    const post = stick(new THREE.Vector3(0, -LENS.r, -0.06), new THREE.Vector3(0, -LENS.y, -0.06), 0.02, darkMetal)
    lens.add(post)
    const hit = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 20), ghost)
    lens.add(hit)
    solids.push(circle(LENS.x, LENS.z, 0.2))
  }
  // the atoms: Fe2O3 on the left, two Al on the right; after: Al2O3 above, two free Fe below, glowing
  const ballGeo = new THREE.SphereGeometry(1, 20, 14)
  const atomBall = (el, r) => {
    const m = new THREE.Mesh(ballGeo, el === 'Fe' ? hotIron : atomMat(el))
    m.scale.setScalar(r)
    lens.add(m)
    return m
  }
  const A = {
    O: [0, 1, 2].map(() => atomBall('O', 0.052)),
    Fe: [0, 1].map(() => atomBall('Fe', 0.066)),
    Al: [0, 1].map(() => atomBall('Al', 0.062)),
  }
  const P = (x, y) => new THREE.Vector3(x, y, 0.02)
  const START = { O: [P(-0.27, 0.12), P(-0.09, 0.12), P(0.09, 0.12)], Fe: [P(-0.18, 0.03), P(0.0, 0.03)], Al: [P(0.27, 0.14), P(0.28, -0.04)] }
  const NEAR = { Al: [P(0.17, 0.2), P(0.2, 0.03)] }
  const END = { O: [P(-0.16, 0.25), P(0.0, 0.25), P(0.16, 0.25)], Al: [P(-0.08, 0.17), P(0.08, 0.17)], Fe: [P(-0.09, -0.2), P(0.09, -0.2)] }
  const lensCap = {}
  for (const k of ['before', 'after']) {
    const t = pair(E.mix.lens[k], 0.055, '#e8f2ff', { maxWidth: 0.7 })
    t.position.set(0, -0.31, 0.03)
    lens.add(t)
    lensCap[k] = t
  }
  const lensSpark = new THREE.Vector3()

  // ======== 2. the weld on the near rail ========
  const WELD_SPOT = { x: 0.6, z: WZ }
  const railA = new THREE.Group()
  {
    const m = new THREE.Mesh(railGeometry(CUT - GAP / 2), steel)
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.004, CUT - GAP / 2), mats.band)
    band.position.set(0, RAIL_TOP - RAIL_BASE + 0.001, (CUT - GAP / 2) / 2)
    railA.add(m, band)
    railA.position.set(NEAR_X, RAIL_BASE, WZ + GAP / 2)
    root.add(railA)
  }
  // the other piece turns about its far end: out of line until the gap is set
  const railB = new THREE.Group()
  railB.position.set(NEAR_X, RAIL_BASE, WZ - CUT)
  {
    const m = new THREE.Mesh(railGeometry(CUT - GAP / 2), steel)
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.004, CUT - GAP / 2), mats.band)
    band.position.set(0, RAIL_TOP - RAIL_BASE + 0.001, (CUT - GAP / 2) / 2)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.6), ghost)
    hit.position.set(0, 0.1, CUT - 0.8)
    railB.add(m, band, hit)
  }
  root.add(railB)
  const railAHit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.6), ghost)
  railAHit.position.set(0, 0.1, 0.8)
  railA.add(railAHit)
  const BENT = { x: -0.0065, y: 0.013 }
  // the rail ends glowing as they warm (just outside the mould, where they show)
  const endGlowMat = new THREE.MeshBasicMaterial({ color: '#ff5a1a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const endGlows = [-1, 1].map(s => {
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(railShape(1.04), { depth: 0.3, bevelEnabled: false, curveSegments: 1 }), endGlowMat)
    m.position.set(NEAR_X, RAIL_BASE, s > 0 ? WZ + 0.005 : WZ - 0.305)
    m.raycast = () => {}
    root.add(m)
    return m
  })
  // the gap's gauge and its label
  const gapTag = label(E.weld.gap, 0.075, '#ffe08a', { anchorY: 'bottom' })
  gapTag.position.set(NEAR_X - 0.05, RAIL_TOP + 0.12, WZ)
  gapTag.rotation.y = -Math.PI / 2
  root.add(gapTag)
  const gauge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, GAP * 0.92), yellow)
  gauge.position.set(NEAR_X - 0.03, RAIL_TOP + 0.02, WZ)
  root.add(gauge)

  // the weld itself: a collar round foot and web, the excess round the head with its risers, and after
  // the grinding the head flush with the rail
  // the cast steel: rough and paler than the rolled rail, so the collar shows
  const COLD_WELD = new THREE.Color('#8a8076')
  const HOT_WELD = new THREE.Color('#9a3a14')
  const weldMat = new THREE.MeshStandardMaterial({ color: '#8a8076', emissive: '#ff7a24', emissiveIntensity: 0, roughness: 0.85, metalness: 0.25 })
  // the collar: a bulge of cast steel round the foot and the web (a scaled rail keeps its thin web, which
  // hid it), as a real weld keeps it after the head is ground
  const collarShape = new THREE.Shape()
  ;[[-0.1, -0.014], [0.1, -0.014], [0.1, 0.022], [0.042, 0.05], [0.036, 0.126], [-0.036, 0.126], [-0.042, 0.05], [-0.1, 0.022]].forEach(([x, y], i) => (i ? collarShape.lineTo(x, y) : collarShape.moveTo(x, y)))
  const collarLow = new THREE.Mesh(new THREE.ExtrudeGeometry(collarShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.01, bevelSegments: 2 }), weldMat)
  collarLow.position.set(NEAR_X, RAIL_BASE, WZ - 0.075)
  const collarHead = new THREE.Mesh(railGeometry(0.12, 1.35, { headOnly: true }), weldMat)
  collarHead.position.set(NEAR_X, RAIL_BASE, WZ - 0.06)
  const risers = new THREE.Group()
  for (const dz of [-0.03, 0.03]) {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.09, 10), weldMat)
    r.position.set(NEAR_X, RAIL_TOP + 0.05, WZ + dz)
    risers.add(r)
  }
  const headRough = new THREE.Mesh(railGeometry(0.1, 1.06, { headOnly: true }), weldMat)
  headRough.position.set(NEAR_X, RAIL_BASE, WZ - 0.05)
  const headFill = new THREE.Group()
  {
    const m = new THREE.Mesh(railGeometry(0.1, 1.0, { headOnly: true }), steel)
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.004, 0.1), mats.band)
    band.position.set(0, RAIL_TOP - RAIL_BASE + 0.001, 0.05)
    headFill.add(m, band)
    headFill.position.set(NEAR_X, RAIL_BASE, WZ - 0.05)
  }
  root.add(collarLow, collarHead, risers, headRough, headFill)

  // the tools, waiting on the ballast beside the rail (left to right as seen from the station: the shear,
  // the crucible, the gap, the mould, the torch, the grinder on the rail)
  const ON = BALLAST_TOP
  // -- the sand mould: two halves lying on the ballast, clamped round the gap when tapped --
  const MOULD_REST = new THREE.Vector3(2.02, ON, WZ + 0.62)
  const mouldHalves = [-1, 1].map(s => {
    const g = new THREE.Group()
    const block = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.34, 0.38, 2, 0.015), sandMat)
    block.position.y = 0.17
    g.add(block)
    // half of the pouring cup on top
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.05, 0.07, 16, 1, true, s > 0 ? 0 : Math.PI, Math.PI), sandMat)
    cup.material = sandMat
    cup.position.set(-s * 0.065, 0.375, 0)
    g.add(cup)
    root.add(g)
    return g
  })
  const mouldSeam = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.36), new THREE.MeshBasicMaterial({ color: '#ff8a2a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  mouldSeam.position.set(NEAR_X, RAIL_BASE + 0.06, WZ)
  mouldSeam.raycast = () => {}
  root.add(mouldSeam)
  const cupGlow = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), new THREE.MeshBasicMaterial({ color: '#ffb040', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  cupGlow.rotation.x = -Math.PI / 2
  cupGlow.position.set(NEAR_X, RAIL_BASE + 0.39, WZ)
  cupGlow.raycast = () => {}
  root.add(cupGlow)
  const clampBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.05), darkMetal)
  clampBar.position.set(NEAR_X, RAIL_BASE + 0.3, WZ + 0.21)
  root.add(clampBar)
  // the slag pan hung on the mould's near side
  const slagPan = new THREE.Group()
  {
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.06, 16, 1, true), darkMetal)
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), darkMetal)
    bottom.rotation.x = -Math.PI / 2
    bottom.position.y = -0.03
    slagPan.add(pan, bottom)
    slagPan.position.set(NEAR_X - 0.22, RAIL_BASE + 0.26, WZ + 0.02)
  }
  const slagFill = new THREE.Mesh(new THREE.CircleGeometry(0.092, 16), new THREE.MeshStandardMaterial({ color: '#d8cfbe', emissive: '#ff8a2a', emissiveIntensity: 0, roughness: 0.9 }))
  slagFill.rotation.x = -Math.PI / 2
  slagPan.add(slagFill)
  root.add(slagPan)
  const mouldHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), ghost)
  root.add(mouldHit)

  // -- the torch: a burner on a stand, hoses to two bottles on a trolley --
  const TORCH_STAND = new THREE.Vector3(2.0, ON, WZ + 1.15)
  const burner = new THREE.Group()
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), steel)
    body.rotation.z = Math.PI / 2
    body.position.x = -0.15
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.022, 0.16, 12), mats.oldRail)
    nozzle.position.y = -0.08
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: '#c0282a', roughness: 0.6 }))
    handle.position.set(-0.32, 0, 0)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.3), ghost)
    hit.position.x = -0.12
    burner.add(body, nozzle, handle, hit)
  }
  root.add(burner)
  const torchFlame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 14, 1, true), new THREE.MeshBasicMaterial({ color: '#9fc8ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))
  torchFlame.rotation.x = Math.PI
  torchFlame.position.y = -0.3
  torchFlame.raycast = () => {}
  burner.add(torchFlame)
  {
    const post = stick(TORCH_STAND, TORCH_STAND.clone().add(new THREE.Vector3(0, 0.75, 0)), 0.018, darkMetal)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.03, 14), darkMetal)
    foot.position.copy(TORCH_STAND).add(new THREE.Vector3(0, 0.015, 0))
    root.add(post, foot)
    // the gas bottles on a trolley, back from the line
    const trolley = new THREE.Group()
    trolley.position.set(0.85, 0, WZ + 2.85)
    for (const [dx, c, top] of [[-0.14, '#b8402e', '#b8402e'], [0.14, '#2e3440', '#e8e8e8']]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.15, 16), new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.3 }))
      b.position.set(dx, 0.62, 0)
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 8, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: top, roughness: 0.5 }))
      shoulder.position.set(dx, 1.195, 0)
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), steel)
      valve.position.set(dx, 1.32, 0)
      trolley.add(b, shoulder, valve)
    }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.04, 0.3), darkMetal)
    frame.position.y = 0.05
    trolley.add(frame)
    root.add(trolley)
    solids.push(circle(0.85, WZ + 2.85, 0.35))
  }
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#1e2026', roughness: 0.8 })
  let hose = null
  const hoseAt = new THREE.Vector3(1e9, 0, 0)
  const burnerRest = TORCH_STAND.clone().add(new THREE.Vector3(0.1, 0.8, 0))
  const burnerOn = new THREE.Vector3(NEAR_X + 0.06, RAIL_BASE + 0.62, WZ)
  function drawHose() {
    if (hose && burner.position.distanceToSquared(hoseAt) < 1e-6) return
    hoseAt.copy(burner.position)
    const a = new THREE.Vector3(0.85, 1.3, WZ + 2.85)
    const b = burner.position.clone().add(new THREE.Vector3(-0.35, 0, 0))
    const mid = a.clone().lerp(b, 0.5)
    mid.y = Math.min(a.y, b.y) - 0.5
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    hose?.geometry.dispose()
    if (!hose) {
      hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.012, 5), hoseMat)
      hose.raycast = () => {}
      root.add(hose)
    } else hose.geometry = new THREE.TubeGeometry(curve, 16, 0.012, 5)
  }

  // -- the crucible on its tripod, aside until it is lit over the mould --
  const CRU_ASIDE = new THREE.Vector3(2.0, ON, WZ - 1.15)
  const CRU_OVER = new THREE.Vector3(NEAR_X, RAIL_BASE + 0.0, WZ)
  const pot = new THREE.Group()
  const potMat = new THREE.MeshStandardMaterial({ color: '#c9c3b6', roughness: 0.9, emissive: '#ff6a10', emissiveIntensity: 0 })
  {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.08, 0.42, 20), potMat)
    cone.position.y = 0.95
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.05, 20), darkMetal)
    band.position.y = 1.08
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.18, 20), new THREE.MeshStandardMaterial({ color: '#8a5a3a', emissive: '#ffb84a', emissiveIntensity: 0, roughness: 0.9 }))
    mouth.rotation.x = -Math.PI / 2
    mouth.position.y = 1.161
    pot.add(cone, band, mouth)
    pot.userData.mouth = mouth
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.016, 6, 24), darkMetal)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.92
    pot.add(ring)
    for (const a of [0.3, 0.3 + TAU / 3, 0.3 + (2 * TAU) / 3]) {
      pot.add(stick(new THREE.Vector3(Math.cos(a) * 0.2, 0.92, Math.sin(a) * 0.2), new THREE.Vector3(Math.cos(a) * 0.46, 0, Math.sin(a) * 0.46), 0.014, darkMetal))
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.6), ghost)
    hit.position.y = 0.6
    pot.add(hit)
  }
  root.add(pot)
  const potFlames = []
  for (let i = 0; i < 3; i++) {
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd27a').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
    f.position.set((i - 1) * 0.08, 1.32, 0)
    f.raycast = () => {}
    pot.add(f)
    potFlames.push(f)
  }
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 1, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2.2), toneMapped: false }))
  stream.visible = false
  stream.raycast = () => {}
  root.add(stream)
  const weldLight = new THREE.PointLight('#ffb050', 0, 7, 1.6)
  weldLight.position.set(NEAR_X - 0.6, RAIL_TOP + 0.9, WZ)
  root.add(weldLight)

  // -- the shear: a yellow hydraulic weld trimmer --
  const SHEAR_REST = new THREE.Vector3(2.02, ON, WZ - 2.05)
  const shear = new THREE.Group()
  {
    // a frame straddling the rail head: a cylinder on top, two cheeks down the sides, the blade between
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.34, 14).rotateX(Math.PI / 2), yellow)
    body.position.y = 0.34
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.06, 0.4, 2, 0.02), yellow)
    top.position.y = 0.25
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.05), darkMetal)
    jaw.position.set(0, 0.13, 0.17)
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.36), yellow)
    legL.position.set(-0.085, 0.13, 0)
    const legR = legL.clone()
    legR.position.x = 0.085
    const handle = stick(new THREE.Vector3(0, 0.4, -0.15), new THREE.Vector3(0, 0.68, -0.4), 0.016, darkMetal)
    shear.add(top)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.7), ghost)
    hit.position.y = 0.3
    shear.add(body, jaw, legL, legR, handle, hit)
    shear.userData.jaw = jaw
  }
  root.add(shear)
  const offcut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.13), weldMat)
  offcut.visible = false
  root.add(offcut)
  // the mould's broken halves after it is knocked off
  // -- the grinder: a profile grinder on little wheels, waiting on the rail --
  const GRIND_REST = WZ + 1.75
  const grinder = new THREE.Group()
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.12, 0.62, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#2f6fd0', roughness: 0.5, metalness: 0.2 }))
    frame.position.y = 0.2
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 16), darkMetal)
    motor.position.set(0, 0.36, 0)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 20), new THREE.MeshStandardMaterial({ color: '#8a8478', roughness: 0.9 }))
    disc.position.set(0, 0.07, 0)
    for (const dz of [-0.24, 0.24]) {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14).rotateZ(Math.PI / 2), darkMetal)
      wh.position.set(0, 0.05, dz)
      grinder.add(wh)
    }
    const handle = stick(new THREE.Vector3(0, 0.26, 0.28), new THREE.Vector3(-0.3, 0.75, 0.55), 0.016, darkMetal)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.8), ghost)
    hit.position.y = 0.3
    grinder.add(frame, motor, disc, handle, hit)
    grinder.userData.disc = disc
  }
  grinder.position.set(NEAR_X, RAIL_TOP - 0.05 + 0.0, GRIND_REST)
  root.add(grinder)

  // -- the signal, ahead beside the new line: red until the weld is done --
  const SIGNAL = { x: 1.55, z: -9.4 }
  const signal = new THREE.Group()
  signal.position.set(SIGNAL.x, 0, SIGNAL.z)
  const sigLamp = {}
  {
    signal.add(stick(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3.1, 0), 0.06, darkMetal))
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.72, 0.2, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#15171c', roughness: 0.6 }))
    head.position.y = 3.35
    signal.add(head)
    for (const [k, y, c] of [['red', 3.52, '#ff2a1a'], ['green', 3.18, '#2aff6a']]) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), new THREE.MeshStandardMaterial({ color: '#1a1a1a', emissive: c, emissiveIntensity: 0 }))
      m.position.set(0, y, 0.105)
      const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 16, 1, true, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#15171c', side: THREE.DoubleSide }))
      hood.rotation.x = Math.PI / 2
      hood.position.set(0, y + 0.02, 0.16)
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color(c).multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
      glow.position.set(0, y, 0.2)
      glow.scale.setScalar(0.7)
      glow.raycast = () => {}
      signal.add(m, hood, glow)
      sigLamp[k] = { m, glow }
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.0, 0.8), ghost)
    hit.position.y = 2.0
    signal.add(hit)
    const tag = label(E.weld.tools.signal, 0.14, '#f4ecdc', { anchorY: 'bottom' })
    tag.position.set(0, 3.8, 0)
    signal.add(tag)
  }
  root.add(signal)
  solids.push(circle(SIGNAL.x, SIGNAL.z, 0.2))

  // the next thing to tap: an arrow and its name, bobbing above it
  const marker = new THREE.Group()
  {
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 12), new THREE.MeshStandardMaterial({ color: '#5aa9ff', emissive: '#5aa9ff', emissiveIntensity: 1.4 }))
    arrow.rotation.x = Math.PI
    marker.add(arrow)
    marker.userData.arrow = arrow
  }
  const markerTags = {}
  for (const k of Object.keys(E.weld.tools)) {
    if (k === 'signal') continue
    const t = label(E.weld.tools[k], 0.075, '#dbeaff', { anchorY: 'bottom' })
    t.position.y = 0.1
    t.visible = false
    marker.add(t)
    markerTags[k] = t
  }
  marker.traverse(o => (o.raycast = () => {}))
  root.add(marker)

  // the trains: one on each line, run when the signal is tapped
  const trains = [railTrain({ cars: 3, light }), railTrain({ cars: 3, light })]
  trains[0].group.position.x = OLD_X
  trains[1].group.position.x = NEW_X
  for (const tr of trains) {
    tr.group.visible = false
    tr.group.traverse(o => (o.raycast = () => {}))
    root.add(tr.group)
    disposers.push(() => tr.dispose())
  }
  const oldJoints = stage.joints.find(j => j.track === 1)?.zs ?? []

  // ======== 3. who takes the oxygen? The bench by the maintenance van ========
  const VAN = { x: -8.3, z0: 0.3, z1: 5.9 }
  const BENCH = { x: -6.4, z: 2.4, y: 0.88 }
  const BENCH_SPOT = { x: -4.55, z: 2.4 }
  const beacons = []
  {
    const van = new THREE.Group()
    van.position.set(VAN.x, 0, 0)
    root.add(van)
    const L = VAN.z1 - VAN.z0
    const cargo = new THREE.Mesh(new RoundedBoxGeometry(2.1, 2.2, L - 1.5, 3, 0.08), orange)
    cargo.position.set(0, 0.5 + 1.1, VAN.z0 + (L - 1.5) / 2)
    const cab = new THREE.Mesh(new RoundedBoxGeometry(2.1, 1.75, 1.5, 3, 0.12), orange)
    cab.position.set(0, 0.5 + 0.875, VAN.z1 - 0.75)
    const screenMat = new THREE.MeshStandardMaterial({ color: '#141a28', roughness: 0.15, metalness: 0.6 })
    const windscreen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.7), screenMat)
    windscreen.position.set(0, 1.85, VAN.z1 + 0.005)
    const sideWin = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.55), screenMat)
    sideWin.rotation.y = Math.PI / 2
    sideWin.position.set(1.056, 1.85, VAN.z1 - 0.7)
    van.add(cargo, cab, windscreen, sideWin)
    // reflective stripes along the side
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#ffe14a', emissive: '#ffd21a', emissiveIntensity: 0.35, roughness: 0.4 })
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.14, L - 0.2), stripeMat)
    stripe.position.set(1.056, 0.95, (VAN.z0 + VAN.z1) / 2)
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.14, 0.01), stripeMat)
    back.position.set(0, 0.95, VAN.z0 - 0.005)
    van.add(stripe, back)
    for (const [dz, s] of [[VAN.z0 + 0.8, 1], [VAN.z0 + 0.8, -1], [VAN.z1 - 1.0, 1], [VAN.z1 - 1.0, -1]]) {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 18).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.8 }))
      wh.position.set(s * 0.95, 0.36, dz)
      van.add(wh)
    }
    // the side door open: the van's lit inside, shelves of boxes and powder tins
    const inside = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#2a2a2e'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#5a5248'
      for (const y of [70, 140, 210]) g.fillRect(0, y, w, 8)
      const rnd = random(5)
      for (const y of [70, 140, 210]) {
        for (let x = 6; x < w - 30; x += 30 + rnd() * 20) {
          const bh = 24 + rnd() * 30
          g.fillStyle = ['#c8a050', '#7a8a9a', '#b05a3a', '#d8d0c0', '#4a6a8a'][Math.floor(rnd() * 5)]
          g.fillRect(x, y - bh, 22 + rnd() * 12, bh)
        }
      }
      g.fillStyle = 'rgba(255,240,200,0.9)'
      g.fillRect(40, 6, w - 80, 10)
    })
    textures.push(inside)
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.9), new THREE.MeshStandardMaterial({ map: inside, emissive: '#ffffff', emissiveMap: inside, emissiveIntensity: 0.22, roughness: 0.9 }))
    door.rotation.y = Math.PI / 2
    door.position.set(1.058, 1.5, 3.68)
    // the sliding door, pushed back toward the van's rear (behind the ladder)
    const slid = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.95, 1.3), orange)
    slid.position.set(1.085, 1.52, 2.4)
    van.add(door, slid)
    for (const dx of [-0.45, 0.45]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.14, 12), new THREE.MeshStandardMaterial({ color: '#ffb01a', emissive: '#ff9a00', emissiveIntensity: 0.2 }))
      b.position.set(dx, 2.33, VAN.z1 - 0.75)
      van.add(b)
      beacons.push(b)
    }
    const lamp = new THREE.PointLight('#fff0d8', light ? 2.6 : 3, 7, 1.6)
    lamp.position.set(VAN.x + 2.4, 2.7, 2.4)
    root.add(lamp)
    solids.push(box(VAN.x, (VAN.z0 + VAN.z1) / 2, 2.3, L + 0.2))
  }
  // the folding bench in front of the door
  const bench = new THREE.Group()
  bench.position.set(BENCH.x, 0, BENCH.z)
  root.add(bench)
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.05, 2.7, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#8a7a64', roughness: 0.8 }))
    top.position.y = BENCH.y - 0.025
    bench.add(top)
    for (const [dx, dz] of [[-0.3, -1.25], [0.3, -1.25], [-0.3, 1.25], [0.3, 1.25]]) bench.add(stick(new THREE.Vector3(dx, 0, dz), new THREE.Vector3(dx, BENCH.y - 0.05, dz), 0.018, darkMetal))
    solids.push(box(BENCH.x, BENCH.z, 0.9, 2.9))
  }
  // the jars: metals on the left (as seen from the bench's front), oxides on the right
  const benchJars = {}
  const JAR_Z = { Mg: 1.1, Al: 0.8, Fe: 0.5, Cu: 0.2, Fe2O3: -0.75, CuO: -1.05 }
  for (const k of [...METALS, ...OXIDES]) {
    const g = new THREE.Group()
    g.position.set(0.05, BENCH.y, JAR_Z[k])
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.18, 20, 1, true), edgeGlass({ color: '#dbe6ff', edge: 0.7, base: 0.05 }))
    glass.position.y = 0.09
    glass.renderOrder = 3
    const metal = METALS.includes(k)
    const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.069, 0.069, 0.11, 20), new THREE.MeshStandardMaterial({ color: POWDER[k], roughness: metal ? 0.45 : 0.95, metalness: metal ? 0.6 : 0 }))
    powder.position.y = 0.06
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.26), ghost)
    hit.position.y = 0.12
    g.add(glass, powder, hit)
    bench.add(g)
    const name = metal ? E.bench.metals[k] : E.bench.oxides[k]
    const tag = pair({ kid: name, sci: `${name}\n${k}` }, 0.052, '#f4ecdc', { anchorY: 'top', maxWidth: 0.4, lineHeight: 1.05 })
    tag.position.set(0.37, BENCH.y - 0.03, JAR_Z[k])
    tag.rotation.y = Math.PI / 2
    bench.add(tag)
    benchJars[k] = g
  }
  // the little crucible in its sand tray, a sparkler fuse in it
  const LITTLE = new THREE.Vector3(0.0, BENCH.y, -0.25)
  const little = new THREE.Group()
  little.position.copy(LITTLE)
  bench.add(little)
  const littleTop = canvasTex(64, 64, null, { mipmaps: false })
  textures.push(littleTop)
  const littleMat = new THREE.MeshStandardMaterial({ map: littleTop, emissive: '#000000', roughness: 0.9 })
  const fuse = new THREE.Group()
  {
    const tray = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.05, 0.36, 2, 0.012), sandMat)
    tray.position.y = 0.025
    const pot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.055, 0.12, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#c9a07a', roughness: 0.9, side: THREE.DoubleSide }))
    pot2.position.y = 0.11
    const fill2 = new THREE.Mesh(new THREE.CircleGeometry(0.074, 20), littleMat)
    fill2.rotation.x = -Math.PI / 2
    fill2.position.y = 0.15
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 6), steel)
    rod.position.y = 0.1
    const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.1, 8), new THREE.MeshStandardMaterial({ color: '#7b7d84', roughness: 0.9 }))
    coat.position.y = 0.15
    fuse.add(rod, coat)
    fuse.position.set(0.03, 0.12, 0.02)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.4, 0.36), ghost)
    hit.position.y = 0.18
    little.add(tray, pot2, fill2, fuse, hit)
  }
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 10), new THREE.MeshStandardMaterial({ color: '#8a8c92', emissive: '#ffb050', emissiveIntensity: 0, metalness: 0.7, roughness: 0.35 }))
  bead.position.set(-0.02, 0.165, -0.01)
  bead.visible = false
  little.add(bead)
  const benchLight = new THREE.PointLight('#ffe0b0', 0, 5, 1.6)
  benchLight.position.set(0.4, 0.5, 0)
  little.add(benchLight)
  // the ladder on the van's side: who holds oxygen tightest
  const LW = 512
  const LH = 600
  const ladderTex = canvasTex(LW, LH, null, { mipmaps: false })
  textures.push(ladderTex)
  {
    const g = new THREE.Group()
    g.position.set(VAN.x + 1.14, 1.72, 1.35)
    g.rotation.y = Math.PI / 2
    const frame = new THREE.Mesh(new RoundedBoxGeometry(1.32, 1.56, 0.03, 2, 0.015), darkMetal)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.26, 1.48), new THREE.MeshBasicMaterial({ map: ladderTex, toneMapped: false, color: '#dcdcdc' }))
    face.position.z = 0.02
    g.add(frame, face)
    root.add(g)
    g.userData.face = face
  }

  // ======== the state of each station ========
  // the crucible: scoops of rust and aluminium (in the order poured, `seq`, unless the slider mixed them),
  // burnt or not, when it was lit (n counts the burns), the lens's replays
  const M = { r: 0, a: 0, seq: '', mixed: false, burnt: false, n: 0, at: -99, lensAt: -99, ln: 0, mine: false, loud: false, flights: [] }
  // the weld: k steps done (1 the gap, 2 the mould, 3 the pour, 4 the shear, 5 the grinding), when the
  // last step began; the preheat (minutes) and the torch's run; the trains (n runs)
  const Wd = { k: 0, kAt: -99, h0: 0, h1: 0, torchAt: -99, n: 0, tAt: -99, both: false, mine: false, trainMine: false, loud: false }
  // the bench: the metal and the oxide in the little crucible, lit or not, the metals the ladder shows
  const B = { m: null, o: null, lit: false, n: 0, at: -99, seen: [], mine: false, loud: false }

  // ---- the crucible's steps ----
  const mixAge = () => clock() - M.at
  const mixBusy = () => M.burnt && mixAge() < IGN + BURN + SEP
  const shareNow = () => (M.r + M.a > 0 ? M.r / (M.r + M.a) : RATIO)
  function clearMix() {
    M.r = 0
    M.a = 0
    M.seq = ''
    M.mixed = false
    M.burnt = false
    M.at = -99
    M.lensAt = -99
  }
  const mixPanel = lv => ({
    title: E.mix.title,
    color,
    blocks: [
      {
        slider: {
          label: E.mix.slider,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(shareNow() * 100),
          onInput: v => slideMix(v / 100),
          format: v => `${nf(v)}%`,
          live: () => Math.round(shareNow() * 100),
        },
      },
      { buttons: ['rust', 'al', 'light', 'lens', 'empty'].map(k => ({ label: E.mix.buttons[k], onClick: () => mixStep(k) })) },
      ...paras(E.mix.panel, lv),
    ],
  })
  /** A step at the crucible: 'rust' | 'al' (a scoop from the jar), 'light' (the igniter), 'lens', 'empty'. */
  function mixStep(k) {
    const lv = level()
    if (k === 'lens') {
      M.ln++
      M.lensAt = clock()
      play('tap')
      say(at(E.mix.says.lens, lv))
      share('mix')
      return
    }
    if (mixBusy()) return say(at(E.mix.says.busy, lv))
    if (k === 'empty') {
      clearMix()
      play('tap')
      share('mix')
      return
    }
    if (k === 'rust' || k === 'al') {
      if (M.burnt) clearMix()
      if (M.r + M.a >= FULL - 0.01) return say(at(E.mix.says.full, lv))
      if (M.mixed) {
        M.mixed = false
        M.seq = ''
      }
      M[k === 'rust' ? 'r' : 'a'] = Math.round(M[k === 'rust' ? 'r' : 'a'] * 100) / 100 + 1
      M.r = Math.min(M.r, FULL)
      M.a = Math.min(M.a, FULL)
      M.seq = (M.seq + (k === 'rust' ? 'r' : 'a')).slice(-FULL)
      M.flights.push({ k, t: 0 })
      play('tap')
      say(at(M.r + M.a >= FULL ? E.mix.says.full : E.mix.says[k], lv))
      share('mix')
      return
    }
    // 'light'
    if (M.burnt) return say(at(E.mix.says.cold, lv))
    if (M.r + M.a <= 0) return say(at(E.mix.says.empty, lv))
    if (!(M.r > 0 && M.a > 0)) return say(at(E.mix.says.both, lv))
    M.burnt = true
    M.n++
    M.at = clock()
    M.lensAt = M.at + IGN
    M.mine = true
    M.loud = true
    play('select')
    say(at(E.mix.says.light, lv))
    ex.discover('mix', mixPanel, IGN + BURN + SEP + 1.4)
    share('mix')
  }
  let mixSliding = false
  function slideMix(s) {
    if (mixBusy()) return
    if (M.burnt) clearMix()
    M.mixed = true
    M.seq = ''
    M.r = Math.round(clamp(s) * FULL * 100) / 100
    M.a = Math.round((FULL - M.r) * 100) / 100
    if (mixSliding) return
    mixSliding = true
    later(0.25, () => {
      mixSliding = false
      share('mix')
    })
  }
  ex.add({
    id: 'mix',
    x: MIX_SPOT.x,
    z: MIX_SPOT.z,
    radius: 1.9,
    manual: true,
    label: E.mix.label,
    verb: () => {
      const h = E.mix.hints
      if (mixBusy()) return h.burn
      if (M.burnt) return h.again
      if (M.r + M.a <= 0) return h.fill
      if (M.r <= 0) return h.rust
      if (M.a <= 0) return h.al
      return h.light
    },
    focus: focusOf(-2.5, 1.3, -5.5, 2.4, 4.2),
    act: () => ctx.showPanel(mixPanel),
  })
  clickable(jars.rust, () => mixStep('rust'), { reach: 6 })
  clickable(jars.al, () => mixStep('al'), { reach: 6 })
  clickable(igniter, () => mixStep('light'), { reach: 6 })
  clickable(lens, () => mixStep('lens'), { reach: 6 })

  // ---- the weld's steps ----
  const wAge = () => clock() - Wd.kAt
  const heatNow = () => (Wd.h1 > Wd.h0 ? Math.min(Wd.h1, Wd.h0 + Math.max(0, clock() - Wd.torchAt - 0.6) * HEAT_RATE) : Wd.h0)
  const torchRunning = () => Wd.k === 2 && Wd.h1 > Wd.h0 && heatNow() < Wd.h1 - 1e-6
  const setTime = () => REACT + POUR + SET + MOVE
  const weldBusy = () =>
    (Wd.k === 1 && wAge() < ALIGN) || (Wd.k === 2 && (wAge() < CLAMP || torchRunning())) || (Wd.k === 3 && wAge() < setTime()) || (Wd.k === 4 && wAge() < SHEAR) || (Wd.k === 5 && wAge() < GRIND)
  const trainAge = () => clock() - Wd.tAt
  const trainsRunning = () => Wd.n > 0 && trainAge() < (Wd.both ? T_NEXT : 0) + T_RUN
  /** The hint for the weld now (also the next thing to tap, for the marker). */
  function weldNext() {
    const k = Wd.k
    if (k === 0) return 'rails'
    if (k === 1) return 'mould'
    if (k === 2) {
      if (torchRunning()) return 'heating'
      return heatNow() < HEAT_OK ? 'torch' : 'crucible'
    }
    if (k === 3) {
      if (wAge() < MOVE + REACT + POUR) return 'pouring'
      return wAge() < setTime() ? 'setting' : 'shear'
    }
    if (k === 4) return 'grinder'
    if (k === 5 && wAge() < GRIND) return 'grinding'
    if (trainsRunning()) return 'trains'
    return Wd.n > 0 ? 'again' : 'signal'
  }
  const weldPanel = lv => ({
    title: E.weld.title,
    color,
    blocks: [
      {
        slider: {
          label: E.weld.slider,
          min: 0,
          max: 3,
          step: 0.1,
          value: Math.round(heatNow() * 10) / 10,
          onInput: v => slideHeat(v),
          format: v => `${nf(v, 1)} min`,
          live: () => Math.round(heatNow() * 10) / 10,
        },
      },
      { buttons: ['rails', 'mould', 'torch', 'crucible', 'shear', 'grinder', 'signal', 'fresh'].map(k => ({ label: E.weld.buttons[k], onClick: () => weldStep(k) })) },
      ...paras(E.weld.panel, lv),
    ],
  })
  const stepTo = k => {
    Wd.k = k
    Wd.kAt = clock()
    Wd.mine = true
    Wd.loud = true
  }
  function hintText() {
    const n = weldNext()
    return E.weld.hints[n] ?? ''
  }
  /** A step at the weld: the thing tapped ('rails' | 'mould' | 'torch' | 'crucible' | 'shear' | 'grinder'
   *  | 'signal'), or 'fresh' (a new weld, from the panel or a rail end once finished). */
  function weldStep(k) {
    const lv = level()
    const tell = key => say(at(E.weld.says[key], lv))
    const notYet = () => say(fill(at(E.weld.says.order, lv), { hint: hintText() }))
    if (k === 'signal') return runTrains()
    if (weldBusy()) return say(at(Wd.k === 3 && wAge() > MOVE + REACT + POUR ? E.weld.says.wait : W.busy, lv))
    if (k === 'fresh' || (k === 'rails' && Wd.k === 5)) {
      Wd.k = 0
      Wd.kAt = -99
      Wd.h0 = Wd.h1 = 0
      Wd.torchAt = -99
      play('tap')
      tell('fresh')
      share('weld')
      return
    }
    if (k === 'rails') {
      if (Wd.k !== 0) return notYet()
      stepTo(1)
      play('select')
      tell('rails')
      ex.discover('weld', weldPanel, 2.2)
    } else if (k === 'mould') {
      if (Wd.k !== 1) return notYet()
      stepTo(2)
      play('join')
      tell('mould')
    } else if (k === 'torch') {
      if (Wd.k !== 2) return notYet()
      if (heatNow() >= HEAT_TO) return tell('warm')
      Wd.h0 = heatNow()
      Wd.h1 = HEAT_TO
      Wd.torchAt = clock()
      Wd.mine = true
      Wd.loud = true
      play('fizz', { order: 2 })
      tell('torch')
    } else if (k === 'crucible') {
      if (Wd.k !== 2) return notYet()
      if (heatNow() < HEAT_OK) return tell('cold')
      Wd.h0 = Wd.h1 = heatNow()
      stepTo(3)
      play('select')
      tell('light')
    } else if (k === 'shear') {
      if (Wd.k !== 3) return notYet()
      stepTo(4)
      play('crack')
      tell('shear')
    } else if (k === 'grinder') {
      if (Wd.k !== 4) return notYet()
      stepTo(5)
      tell('grind')
    }
    share('weld')
  }
  let heatSliding = false
  function slideHeat(v) {
    if (Wd.k !== 2 || wAge() < CLAMP) return
    Wd.h0 = Wd.h1 = clamp(Math.round(v * 10) / 10, 0, 3)
    Wd.torchAt = -99
    Wd.mine = true
    if (heatSliding) return
    heatSliding = true
    later(0.25, () => {
      heatSliding = false
      share('weld')
    })
  }
  function runTrains() {
    const lv = level()
    if (trainsRunning()) return say(at(W.busy, lv))
    Wd.n++
    Wd.tAt = clock()
    Wd.both = Wd.k === 5 && wAge() >= GRIND
    Wd.trainMine = true
    Wd.loud = true
    play('select')
    say(at(Wd.both ? E.weld.says.coming : E.weld.says.red, lv))
    // each line's words as its train passes the visitor
    const by = (T_FROM - ctx.engine.player.pos.z) / T_SPEED
    const n = Wd.n
    later(Math.max(1.5, by - 1), () => Wd.trainMine && Wd.n === n && say(at(E.weld.says.old, level())))
    if (Wd.both) later(T_NEXT + Math.max(1.5, by - 1), () => Wd.trainMine && Wd.n === n && say(at(E.weld.says.new, level())))
    share('weld')
  }
  ex.add({
    id: 'weld',
    x: WELD_SPOT.x,
    z: WELD_SPOT.z,
    radius: 1.9,
    manual: true,
    label: E.weld.label,
    verb: () => {
      return E.weld.hints[weldNext()]
    },
    focus: focusOf(NEAR_X - 0.5, 0.78, WZ - 0.1, 1.5, 4.0),
    act: () => ctx.showPanel(weldPanel),
  })
  clickable(railA, () => weldStep('rails'), { reach: 5 })
  clickable(railB, () => weldStep('rails'), { reach: 5 })
  clickable(mouldHit, () => weldStep('mould'), { reach: 5 })
  for (const h of mouldHalves) clickable(h, () => weldStep('mould'), { reach: 5, when: () => Wd.k <= 2 })
  clickable(burner, () => weldStep('torch'), { reach: 5 })
  clickable(pot, () => weldStep('crucible'), { reach: 5 })
  clickable(shear, () => weldStep('shear'), { reach: 5 })
  clickable(grinder, () => weldStep('grinder'), { reach: 5 })
  clickable(signal, () => weldStep('signal'), { reach: 12 })

  // ---- the bench's steps ----
  const benchAge = () => clock() - B.at
  const benchBusy = () => B.lit && benchAge() < BENCH_T
  const resultOf = () => (B.m && B.o ? RESULT[`${B.m}_${B.o}`] : null)
  const benchPanel = lv => ({
    title: E.bench.title,
    color,
    blocks: [
      { buttons: METALS.map(m => ({ label: E.bench.metals[m], onClick: () => benchStep(m) })) },
      { buttons: [...OXIDES.map(o => ({ label: E.bench.oxides[o], onClick: () => benchStep(o) })), { label: E.bench.buttons.light, onClick: () => benchStep('light') }, { label: E.bench.buttons.fresh, onClick: () => benchStep('fresh') }] },
      ...paras(E.bench.panel, lv),
    ],
  })
  /** A step at the bench: a jar ('Mg' | 'Al' | 'Fe' | 'Cu' | 'Fe2O3' | 'CuO'), 'light' (the little crucible)
   *  or 'fresh' (a clean crucible). */
  function benchStep(k) {
    const lv = level()
    if (benchBusy()) return say(at(W.busy, lv))
    if (k === 'fresh') {
      B.m = B.o = null
      B.lit = false
      play('tap')
      share('bench')
      return
    }
    if (METALS.includes(k) || OXIDES.includes(k)) {
      if (B.lit) {
        B.m = B.o = null
        B.lit = false
      }
      const metal = METALS.includes(k)
      const m = metal ? k : B.m
      const o = metal ? B.o : k
      if (m && o && METAL_OF[o] === m) return say(at(E.bench.says.same, lv))
      if (metal) B.m = k
      else B.o = k
      play('tap')
      // the name as it stands in a sentence (German nouns keep their capital)
      const name = metal ? E.bench.metals[k] : E.bench.oxides[k]
      const inLine = lang === 'de' ? name : name.toLowerCase()
      say(fill(at(E.bench.says[metal ? 'metal' : 'oxide'], lv), { m: inLine, o: inLine }))
      share('bench')
      return
    }
    // 'light'
    if (B.lit) return say(at(E.bench.says[`${B.m}_${B.o}`] ?? E.bench.says.need, lv))
    if (!B.m || !B.o) return say(at(E.bench.says.need, lv))
    B.lit = true
    B.n++
    B.at = clock()
    B.mine = true
    B.loud = true
    B.seen = METALS.filter(x => B.seen.includes(x) || x === B.m || x === METAL_OF[B.o])
    play('select')
    later(1.3, () => B.mine && B.lit && say(at(E.bench.says[`${B.m}_${B.o}`], level())))
    ex.discover('bench', benchPanel, BENCH_T + 1.2)
    share('bench')
  }
  ex.add({
    id: 'bench',
    x: BENCH_SPOT.x,
    z: BENCH_SPOT.z,
    radius: 1.9,
    manual: true,
    label: E.bench.label,
    verb: () => {
      const h = E.bench.hints
      if (benchBusy()) return h.burning
      if (B.lit) return h.again
      if (!B.m && !B.o) return h.pick
      if (!B.m) return h.metal
      if (!B.o) return h.oxide
      return h.light
    },
    focus: focusOf(BENCH.x - 0.5, 1.45, BENCH.z - 0.15, 2.0, 3.4),
    act: () => ctx.showPanel(benchPanel),
  })
  for (const k of [...METALS, ...OXIDES]) clickable(benchJars[k], () => benchStep(k), { reach: 5 })
  clickable(little, () => benchStep('light'), { reach: 5 })

  // ======== drawing the crucible's contents ========
  const RUST = ['#7a3216', '#a5482a', '#5a2410']
  const ALU = ['#9a9ea8', '#dfe2ea', '#6a6e78']
  const pyOf = y => ((CR.yt - y) / CRH) * SH
  const pxOf = x => ((x + CR.rt) / (2 * CR.rt)) * SW
  function trapezoid(g) {
    g.beginPath()
    g.moveTo(pxOf(-CR.rb), pyOf(CR.yb))
    g.lineTo(pxOf(CR.rb), pyOf(CR.yb))
    g.lineTo(pxOf(CR.rt), pyOf(CR.yt))
    g.lineTo(pxOf(-CR.rt), pyOf(CR.yt))
    g.closePath()
  }
  /** A band of powder from height y0 to y1: rust, aluminium or a mix (share of rust s). */
  function powderBand(g, y0, y1, s, seed) {
    const rnd = random(seed)
    const top = pyOf(y1)
    const h = pyOf(y0) - top
    const base = new THREE.Color(RUST[0]).lerp(new THREE.Color(ALU[0]), 1 - s)
    g.fillStyle = `#${base.getHexString()}`
    g.fillRect(0, top, SW, h + 0.5)
    const n = Math.round((h * SW) / 60)
    for (let i = 0; i < n; i++) {
      const pal = rnd() < s ? RUST : ALU
      g.fillStyle = pal[1 + Math.floor(rnd() * 2)]
      g.fillRect(rnd() * SW, top + rnd() * h, 2, 2)
    }
  }
  let secKey = ''
  let secT = 0
  /** Draws the cut face: `v` the crucible's look now (from the state and the time since it was lit). */
  function drawSection(v, glow) {
    const g = (glow ? secGlow : secCols).image.getContext('2d')
    g.clearRect(0, 0, SW, SH)
    g.save()
    trapezoid(g)
    g.clip()
    if (glow) {
      g.fillStyle = '#000'
      g.fillRect(0, 0, SW, SH)
    }
    const yFill = yOfScoops(M.r + M.a)
    // what is still powder: below the burning front (all of it before lighting, all of it after a fizzle
    // below where the front died)
    const powderTop = v.phase === 'mix' ? yFill : v.phase === 'burn' || v.phase === 'dead' ? v.front : CR.yb
    if (!glow && M.r + M.a > 0) {
      if (M.mixed || !M.seq) powderBand(g, CR.yb, Math.min(powderTop, yFill), shareNow(), 5)
      else {
        let c = 0
        for (const [i, ch] of [...M.seq].entries()) {
          const y0 = yOfScoops(c)
          const y1 = yOfScoops(c + 1)
          c += 1
          if (y0 >= powderTop) break
          powderBand(g, y0, Math.min(y1, powderTop), ch === 'r' ? 1 : 0, 11 + i)
        }
      }
    }
    const rnd = random(23 + Math.floor(v.t * 12))
    if (v.phase === 'burn' && v.front != null) {
      // the burning front and the bubbling liquid above it
      const yTop = lerp(yFill, v.liquidTop, v.k)
      const top = pyOf(Math.max(yTop, v.front))
      const bot = pyOf(v.front)
      const grd = g.createLinearGradient(0, top, 0, bot)
      grd.addColorStop(0, glow ? '#d8781e' : '#c86a24')
      grd.addColorStop(1, glow ? '#ffd890' : '#f0c070')
      g.fillStyle = grd
      g.fillRect(0, top, SW, bot - top + 2)
      for (let i = 0; i < 26; i++) {
        g.fillStyle = glow ? 'rgba(255,236,190,0.75)' : 'rgba(255,230,180,0.8)'
        g.beginPath()
        g.arc(rnd() * SW, top + rnd() * (bot - top), 2 + rnd() * 5, 0, TAU)
        g.fill()
      }
      // the front itself, a white-hot line
      g.fillStyle = '#ffffff'
      g.fillRect(0, bot - 3, SW, 6)
    } else if (v.phase === 'sep' || v.phase === 'cool') {
      const hot = v.phase === 'sep' ? 1 : v.hot
      // hot: the iron glowing yellow-white below, the slag a duller orange above; cold: a dark iron lump
      // under a pale crust
      const slagC = new THREE.Color('#d6cdbd').lerp(new THREE.Color('#b8561c'), hot)
      const ironC = new THREE.Color('#4a4c53').lerp(new THREE.Color('#f2d690'), Math.min(1, hot * 1.2))
      const ironG = new THREE.Color('#000000').lerp(new THREE.Color('#ffd27a'), Math.min(1, hot * 1.2))
      const slagG = new THREE.Color('#000000').lerp(new THREE.Color('#b04a10'), hot)
      if (v.lumpy) {
        // no clean split: a mottled crust with beads of iron caught in it
        const top = pyOf(v.liquidTop)
        g.fillStyle = `#${(glow ? slagG : slagC).getHexString()}`
        g.fillRect(0, top, SW, SH - top)
        const r2 = random(41)
        for (let i = 0; i < 70; i++) {
          g.fillStyle = `#${(glow ? ironG : ironC).getHexString()}`
          g.beginPath()
          g.arc(r2() * SW, top + r2() * (SH - top), 3 + r2() * 6, 0, TAU)
          g.fill()
        }
      } else {
        const ironTop = lerp(v.liquidTop, v.ironTop, v.sep)
        const top = pyOf(v.liquidTop)
        const mid = pyOf(ironTop)
        g.fillStyle = `#${(glow ? slagG : slagC).getHexString()}`
        g.fillRect(0, top, SW, mid - top)
        // the iron pool at the bottom, and drops still sinking through the slag
        g.fillStyle = `#${(glow ? ironG : ironC).getHexString()}`
        g.fillRect(0, mid, SW, SH - mid)
        if (v.sep < 1) {
          const r2 = random(57)
          for (let i = 0; i < 40; i++) {
            const y0 = r2() * (mid - top)
            const y = top + ((y0 + v.sep * (mid - top) * (0.6 + r2())) % (mid - top))
            g.beginPath()
            g.arc(r2() * SW, y, 2.5 + r2() * 3, 0, TAU)
            g.fill()
          }
        }
        // the line where they meet
        if (!glow && v.sep > 0.6) {
          g.fillStyle = 'rgba(40,30,24,0.6)'
          g.fillRect(0, mid - 1.5, SW, 3)
        }
      }
    } else if (v.phase === 'dead') {
      // a fizzle: a dark sintered crust over the powder that never burned
      const top = pyOf(yFill)
      const bot = pyOf(v.front)
      g.fillStyle = glow ? `rgba(255,90,20,${0.6 * v.hot})` : '#3a2a24'
      g.fillRect(0, top, SW, bot - top)
      if (!glow) {
        const r2 = random(71)
        for (let i = 0; i < 30; i++) {
          g.fillStyle = 'rgba(120,100,90,0.6)'
          g.fillRect(r2() * SW, top + r2() * (bot - top), 3, 3)
        }
      }
    }
    g.restore()
    ;(glow ? secGlow : secCols).needsUpdate = true
  }
  /** The crucible's look now: phase, the front's height, the liquid's top, the iron's top, how far the
   *  iron has sunk, how hot it still is; and the thermometer's reading. */
  function mixView() {
    const t = clock()
    const out = outcomeOf(M.r, M.a)
    const s = shareNow()
    const Tp = peakOf(s)
    const yFill = yOfScoops(M.r + M.a)
    const V = volTo(yFill)
    const liquidTop = heightFor(V * 0.5)
    const ironTop = heightFor(V * 0.5 * 0.32)
    if (!M.burnt) return { phase: 'mix', t, T: 20, front: null }
    const e = t - M.at
    if (e < IGN) return { phase: 'mix', t, T: 20, front: null, igniting: e }
    const b = e - IGN
    if (out === 'fizzle') {
      const stop = lerp(yFill, CR.yb, 0.3)
      const k = clamp(b / 1.2)
      const front = lerp(yFill, stop, ease(k))
      const T = 20 + (Tp - 20) * (b < 0.6 ? b / 0.6 : Math.exp(-(b - 0.6) / 1.4))
      if (b < 1.2) return { phase: 'burn', t, T, front, liquidTop: lerp(yFill, front, 0.4), k: 0.4 * k, flames: 0.6 * (1 - k * 0.5), out }
      return { phase: 'dead', t, T, front: stop, hot: clamp(1 - (b - 1.2) / 2), out }
    }
    const rise = ease(clamp(b / (BURN * 0.6)))
    if (b < BURN) {
      const front = lerp(yFill, CR.yb, ease(b / BURN))
      return { phase: 'burn', t, T: 20 + (Tp - 20) * rise, front, liquidTop, k: clamp(b / BURN), flames: 1, out }
    }
    const c = b - BURN
    if (c < SEP) return { phase: 'sep', t, T: Tp * (1 - 0.03 * (c / SEP)), liquidTop, ironTop, sep: ease(c / SEP), lumpy: out === 'lumpy', flames: 1 - c / SEP, out }
    const k = clamp((c - SEP) / COOL)
    const T = 30 + (Tp * 0.97 - 30) * Math.exp(-3.4 * k)
    return { phase: 'cool', t, T, liquidTop, ironTop, sep: 1, lumpy: out === 'lumpy', hot: clamp(1 - k * 1.25), out }
  }

  // ======== every frame ========
  const v3 = new THREE.Vector3()
  const v4 = new THREE.Vector3()
  let lastMixPhase = 'mix'
  let lastOutTold = -1
  let toldWeld = ''
  updates.push((dt, t) => {
    const lv = level()
    // ---- the crucible ----
    const v = mixView()
    // the scoops flying from the jars into the crucible
    for (let i = M.flights.length - 1; i >= 0; i--) {
      const f = M.flights[i]
      f.t += dt
      if (!f.mesh) {
        f.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshStandardMaterial({ color: f.k === 'rust' ? '#8a3418' : '#c4c8d0', roughness: 0.8 }))
        f.mesh.raycast = () => {}
        root.add(f.mesh)
      }
      const from = jars[f.k].getWorldPosition(v3).add(new THREE.Vector3(0, 0.38, 0))
      const to = v4.set(CR.x, CR.yt + 0.05, CR.z - 0.1)
      const k = clamp(f.t / 0.7)
      f.mesh.position.lerpVectors(from, to, k)
      f.mesh.position.y += Math.sin(Math.PI * k) * 0.6
      if (k >= 1) {
        root.remove(f.mesh)
        f.mesh.geometry.dispose()
        f.mesh.material.dispose()
        M.flights.splice(i, 1)
        secKey = ''
      }
    }
    // the cut face: redrawn while it changes (about 20 times a second)
    secT -= dt
    const key = `${M.r}|${M.a}|${M.seq}|${M.mixed}|${v.phase}|${M.flights.length}`
    const moving = v.phase === 'burn' || v.phase === 'sep' || (v.phase === 'cool' && v.hot > 0) || (v.phase === 'dead' && v.hot > 0)
    if (key !== secKey || (moving && secT <= 0)) {
      secKey = key
      secT = 1 / 20
      drawSection(v, false)
      drawSection(v, true)
    }
    // the top surface
    const yFill = yOfScoops(M.r + M.a)
    const yTopNow = v.phase === 'mix' ? yFill : v.phase === 'burn' ? lerp(yFill, v.liquidTop, v.k) : v.phase === 'dead' ? yFill : v.liquidTop
    topDisc.visible = M.r + M.a > 0
    topDisc.position.y = yTopNow + 0.002
    topDisc.scale.setScalar(crR(yTopNow) - 0.002)
    if (v.phase === 'mix') {
      const c = new THREE.Color(RUST[0]).lerp(new THREE.Color(ALU[0]), M.seq && !M.mixed ? (M.seq.endsWith('r') ? 0 : 1) : 1 - shareNow())
      topMat.color.copy(c)
      topMat.emissive.setRGB(0, 0, 0)
    } else if (v.phase === 'burn') {
      topMat.color.set('#f0c070')
      topMat.emissive.set('#ffb050').multiplyScalar(0.9)
    } else if (v.phase === 'dead') {
      topMat.color.set('#3a2a24')
      topMat.emissive.set('#ff5a14').multiplyScalar(v.hot * 0.8)
    } else {
      const hot = v.phase === 'sep' ? 1 : v.hot
      topMat.color.set('#d6cdbd').lerp(new THREE.Color('#b8561c'), hot)
      topMat.emissive.set('#b04a10').multiplyScalar(hot * 0.9)
    }
    // flames, light, sparks and smoke while it burns
    const flames = v.flames ?? 0
    crFlames.forEach((f, i) => {
      const k = flames * (0.75 + 0.25 * Math.sin(t * (13 + i * 3) + i))
      f.material.opacity = clamp(k)
      f.scale.set(0.32 + 0.1 * k, (0.7 + 0.5 * Math.sin(t * 9 + i * 2)) * k + 0.01, 1)
      f.position.y = CR.yt + 0.12 + f.scale.y * 0.35
    })
    const heatGlow = v.phase === 'burn' ? 1 : v.phase === 'sep' ? 0.9 : v.phase === 'cool' ? v.hot * 0.6 : v.phase === 'dead' ? v.hot * 0.3 : 0
    crLight.intensity = heatGlow * (light ? 5 : 6.5) * (0.85 + 0.15 * Math.sin(t * 23))
    // the layers' names beside the cut, once the iron has sunk
    const named = (v.phase === 'sep' || v.phase === 'cool') && !v.lumpy && v.sep > 0.7
    for (const [kk, tg] of Object.entries(layerTags)) {
      tg.visible = named
      if (!named) continue
      const y = kk === 'iron' ? (CR.yb + v.ironTop) / 2 : (v.liquidTop + v.ironTop) / 2
      tg.position.set(crR(y) + CR.wall + 0.07, y, 0.02)
    }
    if (v.phase === 'burn') {
      sparks.emit(v3.set(CR.x, CR.yt + 0.05, CR.z), rate(light ? 120 : 300, dt), { speed: 2.6, up: 1.1, spread: 0.7, life: 1.0 })
      if (Math.random() < dt * 9) smoke.emit(v3.set(CR.x + (Math.random() - 0.5) * 0.3, CR.yt + 0.4, CR.z), { size: 0.4, rise: 0.8, life: 3.2 })
    }
    // the igniter: on its stand, then carried into the crucible fizzing, then gone until a new mix
    if (v.igniting != null) {
      const k = ease(clamp(v.igniting / (IGN * 0.8)))
      igniter.visible = true
      igniter.position.lerpVectors(igniterRest, igniterIn, k)
      igniter.position.y += Math.sin(Math.PI * k) * 0.35
      igniterTip.copy(igniter.position).add(new THREE.Vector3(0, 0.42, 0))
      sparks.emit(igniterTip, rate(light ? 90 : 200, dt), { speed: 1.4, up: 0.5, spread: 1, life: 0.5, color: [1, 0.9, 0.6] })
    } else {
      igniter.visible = !M.burnt
      igniter.position.copy(igniterRest)
    }
    // the sounds and words of a burn, for whoever lit it (or watched it lit, live)
    if (v.phase !== lastMixPhase) {
      if (M.loud) {
        if (v.phase === 'burn') play('fizz', { order: 3 })
        if (v.phase === 'sep' && v.out === 'good') play('discover')
      }
      if (M.mine && M.n !== lastOutTold && (v.phase === 'sep' || v.phase === 'dead')) {
        lastOutTold = M.n
        const s = shareNow()
        const key = v.out === 'good' ? 'good' : v.out
        let line = fill(at(E.mix.says[key], lv), { t: nf(Math.round(peakOf(s) / 10) * 10) })
        if (v.out !== 'fizzle' && Math.abs(s - RATIO) > 0.06) line += ` ${at(s > RATIO ? E.mix.says.leftRust : E.mix.says.leftAl, lv)}`
        say(line)
      }
      lastMixPhase = v.phase
    }
    drawGauge(v.T, lv)
    const ck = `${M.r}|${M.a}|${lv}`
    if (ck !== countKey) {
      countKey = ck
      const sc = s => nf(s, Number.isInteger(s) ? 0 : 1)
      countSign.text = M.r + M.a > 0 ? fill(at(E.mix.count, lv), { r: sc(M.r), a: sc(M.a), p: nf(Math.round(shareNow() * 100)) }) : ' '
      countSign.sync()
    }
    // the lens: the swap, when the mix catches (or replayed)
    const le = t - M.lensAt
    const swap = M.lensAt > 0 ? le : -1
    const kA = ease(clamp(swap / 0.8))
    const kB = ease(clamp((swap - 0.8) / 1.2))
    const kC = ease(clamp((swap - 2.0) / 1.0))
    A.Al.forEach((m, i) => {
      m.position.lerpVectors(START.Al[i], NEAR.Al[i], kA)
      if (kB > 0) m.position.lerpVectors(NEAR.Al[i], END.Al[i], kB)
    })
    A.O.forEach((m, i) => {
      m.position.lerpVectors(START.O[i], END.O[i], kB)
      m.position.y += Math.sin(Math.PI * kB) * 0.08
    })
    A.Fe.forEach((m, i) => m.position.lerpVectors(START.Fe[i], END.Fe[i], kC))
    hotIron.emissiveIntensity = kC * (0.9 + 0.2 * Math.sin(t * 6))
    for (const [k, o] of Object.entries(lensCap)) o.userData.on = k === 'after' ? kB > 0.5 : kB <= 0.5
    if (swap > 0.8 && swap < 2.0 && Math.random() < 0.5) {
      lens.localToWorld(lensSpark.set(0.05, 0.22, 0.05))
      sparks.emit(lensSpark, 1, { speed: 0.5, up: 0.4, spread: 1, life: 0.4, color: [1, 0.85, 0.5] })
    }

    // ---- the weld ----
    const k = Wd.k
    const e = wAge()
    // the rail end swinging into line
    const align = k >= 1 ? ease(clamp(e / ALIGN)) || (k > 1 ? 1 : 0) : 0
    const aligned = k > 1 ? 1 : align
    railB.rotation.set(BENT.x * (1 - aligned), BENT.y * (1 - aligned), 0)
    gauge.visible = k === 1 && aligned > 0.5
    gapTag.visible = k === 1 && aligned > 0.5
    // the mould: lying on the ballast, clamped, knocked off after the pour
    const clampK = k >= 2 ? (k === 2 ? ease(clamp(e / CLAMP)) : 1) : 0
    const off = k >= 4 ? (k === 4 ? ease(clamp(e / 0.6)) : 1) : 0
    mouldHalves.forEach((h, i) => {
      const s = i ? 1 : -1
      const rest = v3.copy(MOULD_REST).add(new THREE.Vector3(0, 0.065 + i * 0.13, i * 0.02))
      const on = v4.set(NEAR_X + s * 0.07, RAIL_BASE - 0.06, WZ)
      h.position.lerpVectors(rest, on, clampK)
      h.position.y += Math.sin(Math.PI * clampK) * 0.25
      h.rotation.set(0, 0, lerp(i ? -Math.PI / 2 : Math.PI / 2, 0, clampK))
      if (off > 0) {
        const away = new THREE.Vector3(NEAR_X + s * 0.55, ON, WZ + (i ? 0.35 : -0.4))
        h.position.lerp(away, off)
        h.position.y += Math.sin(Math.PI * off) * 0.2
        h.rotation.z = s * off * 1.4
        h.rotation.y = off * (i ? 0.6 : -0.5)
      }
      h.visible = true
    })
    mouldHit.position.copy(k >= 2 ? v3.set(NEAR_X, RAIL_BASE + 0.15, WZ) : MOULD_REST.clone().add(new THREE.Vector3(0, 0.1, 0)))
    clampBar.visible = k >= 2 && k < 4 && clampK > 0.9
    slagPan.visible = k >= 2 && (k < 4 || off < 0.5)
    // the torch: to the mould and back, its flame while it runs
    const tE = clock() - Wd.torchAt
    const running = torchRunning()
    const tk = running ? ease(clamp(tE / 0.6)) : k === 2 && Wd.h1 > Wd.h0 && tE < (Wd.h1 - Wd.h0) / HEAT_RATE + 1.4 ? 1 - ease(clamp((tE - 0.6 - (Wd.h1 - Wd.h0) / HEAT_RATE) / 0.6)) : 0
    burner.position.lerpVectors(burnerRest, burnerOn, tk)
    burner.position.y += Math.sin(Math.PI * tk) * 0.2
    drawHose()
    const flameOn = running && tE > 0.6
    torchFlame.material.opacity = flameOn ? 0.75 + 0.2 * Math.sin(t * 40) : 0
    torchFlame.scale.set(1, flameOn ? 1 + 0.15 * Math.sin(t * 31) : 0.01, 1)
    if (flameOn && Wd.loud && Math.random() < dt * 2) play('fizz', { order: 1 })
    // the rail ends' glow: the preheat until the pour, then the weld's own heat
    const preGlow = k === 2 ? clamp(heatNow() / HEAT_TO) : k === 3 ? clamp(1 - e / 6) : 0
    endGlowMat.opacity = k >= 2 && k <= 3 ? preGlow * 0.55 : 0
    for (const m of endGlows) m.visible = endGlowMat.opacity > 0.01
    cupGlow.material.opacity = k === 2 ? preGlow * 0.8 : 0
    // the crucible: over the gap, lit, pouring, back aside
    const pk = k === 3 ? ease(clamp(e / MOVE)) * (1 - ease(clamp((e - MOVE - REACT - POUR - 0.4) / 0.8))) : 0
    pot.position.lerpVectors(CRU_ASIDE, v3.copy(CRU_OVER).add(new THREE.Vector3(0, -0.02, 0)), pk)
    pot.position.y += Math.sin(Math.PI * pk) * 0.15
    const reacting = k === 3 && e > MOVE && e < MOVE + REACT + POUR * 0.6
    const fierce = reacting ? Math.min(1, (e - MOVE) / 0.5) : 0
    potFlames.forEach((f, i) => {
      const a = fierce * (0.75 + 0.25 * Math.sin(t * (14 + i * 3) + i))
      f.material.opacity = clamp(a)
      f.scale.set(0.24 + 0.08 * a, (0.5 + 0.35 * Math.sin(t * 10 + i * 2)) * a + 0.01, 1)
      f.position.y = 1.2 + f.scale.y * 0.35
    })
    pot.userData.mouth.material.emissiveIntensity = reacting ? 2.2 : k >= 3 && e < MOVE + REACT + POUR + 2 ? 0.8 : 0
    potMat.emissiveIntensity = k === 3 && e > MOVE && e < MOVE + REACT + POUR + 3 ? 0.08 : 0
    if (reacting) {
      v3.copy(pot.position).add(new THREE.Vector3(0, 1.2, 0))
      sparks.emit(v3, rate(light ? 150 : 400, dt), { speed: 2.8, up: 1.0, spread: 0.9, life: 1.1 })
      if (Math.random() < dt * 8) smoke.emit(v3.clone().add(new THREE.Vector3(0, 0.3, 0)), { size: 0.35, rise: 0.9, life: 3 })
    }
    // the stream of liquid steel, then the slag into its pan
    const pouring = k === 3 && e > MOVE + REACT && e < MOVE + REACT + POUR
    stream.visible = pouring
    if (pouring) {
      const top = pot.position.y + 0.74
      const bottom = RAIL_BASE + 0.38
      stream.position.set(NEAR_X, (top + bottom) / 2, WZ)
      stream.scale.set(1 + 0.15 * Math.sin(t * 50), top - bottom, 1 + 0.15 * Math.sin(t * 43))
      sparks.emit(v3.set(NEAR_X, bottom + 0.02, WZ), rate(light ? 120 : 300, dt), { speed: 2.2, up: 0.9, spread: 1.2, life: 0.8 })
    }
    const pourK = k === 3 ? clamp((e - MOVE - REACT) / POUR) : k > 3 ? 1 : 0
    slagFill.position.y = lerp(-0.028, 0.02, clamp(pourK * 1.6 - 0.6))
    slagFill.visible = pourK > 0.4
    const cooled = k === 3 ? clamp((e - MOVE - REACT - POUR) / (SET + 6)) : k > 3 ? 1 : 0
    slagFill.material.emissiveIntensity = (1 - cooled) * 1.4
    mouldSeam.material.opacity = k === 3 && pourK > 0 ? 0.8 * (1 - cooled) : 0
    cupGlow.material.opacity = Math.max(cupGlow.material.opacity, k === 3 && pourK > 0 ? 1 - cooled : 0)
    weldLight.intensity = (reacting ? 4.5 : 0) + (pouring ? 3.5 : 0) + (flameOn ? 1.5 : 0) + (k === 5 && e > 0.8 && e < GRIND - 0.8 ? 2.5 : 0)
    // the weld: inside the mould until it comes off, then red hot, sheared, ground
    const shown = k >= 4
    collarLow.visible = shown
    collarHead.visible = shown && (k === 4 ? e < 1.5 : false)
    risers.visible = shown && (k === 4 ? e < 1.5 : false)
    headRough.visible = k === 4 ? e >= 1.5 : k === 5 ? e < 2.6 : false
    headFill.visible = (k === 5 && e >= 2.6) || false
    const weldHeat = k === 4 ? clamp(1 - e / 14) : k === 5 ? clamp(0.8 - (e + 14) / 18) : 0
    weldMat.emissiveIntensity = weldHeat * 1.6
    weldMat.color.copy(COLD_WELD).lerp(HOT_WELD, weldHeat * 0.6)
    // the shear: onto the head, the cut, the excess falling, back
    const sh = k === 4 ? (e < 0.6 ? 0 : e < 1.2 ? ease((e - 0.6) / 0.6) : e < 1.9 ? 1 : 1 - ease(clamp((e - 1.9) / 0.7))) : 0
    shear.position.lerpVectors(SHEAR_REST, v3.set(NEAR_X, RAIL_TOP - 0.12, WZ), sh)
    shear.position.y += Math.sin(Math.PI * sh) * 0.2
    shear.userData.jaw.position.z = k === 4 && e > 1.2 && e < 1.9 ? lerp(0.15, -0.15, ease((e - 1.2) / 0.5)) : 0.15
    offcut.visible = k === 4 && e > 1.5 && e < 3.6
    if (offcut.visible) {
      const f = e - 1.5
      offcut.position.set(NEAR_X - 0.05 - f * 0.35, Math.max(ON + 0.03, RAIL_TOP + 0.04 - 4.9 * f * f), WZ)
      offcut.rotation.z = f * 3
    }
    if (k === 4 && Wd.loud && e > 1.2 && e < 1.25) play('crack')
    // the grinder: rolls to the weld, grinds with a shower of sparks, rolls back
    const gk = k === 5 ? (e < 0.8 ? ease(e / 0.8) : e < GRIND - 0.8 ? 1 : 1 - ease(clamp((e - GRIND + 0.8) / 0.8))) : 0
    grinder.position.set(NEAR_X, RAIL_TOP - 0.05, lerp(GRIND_REST, WZ, gk))
    const grinding = k === 5 && e > 0.8 && e < GRIND - 0.8
    grinder.userData.disc.rotation.y += grinding ? dt * 60 : 0
    if (grinding) {
      sparks.emit(v3.set(NEAR_X - 0.04, RAIL_TOP + 0.03, WZ), rate(light ? 150 : 420, dt), { speed: 3.2, up: 0.5, spread: 0.5, life: 0.7, dir: new THREE.Vector3(-0.9, 0.2, 0.3), color: [1, 0.8, 0.45] })
      if (Wd.loud && Math.random() < dt * 4) play('fizz', { order: 1.5 })
    }
    // the signal: red until the weld is finished
    const green = k === 5 && e >= GRIND
    sigLamp.red.m.material.emissiveIntensity = green ? 0 : 2.4
    sigLamp.red.glow.material.opacity = green ? 0 : 0.85
    sigLamp.green.m.material.emissiveIntensity = green ? 2.4 : 0
    sigLamp.green.glow.material.opacity = green ? 0.85 : 0
    // the Atomling tells each step's moment as it comes, to whoever did it
    if (Wd.mine) {
      const moment =
        k === 3 ? (e >= setTime() ? 'set' : e >= MOVE + REACT ? 'pour' : null) : k === 5 && e >= GRIND ? 'done' : k === 2 && Wd.h1 > Wd.h0 && !torchRunning() && clock() - Wd.torchAt < 20 ? 'warm' : null
      const told = moment && `${moment}|${Math.round(Wd.kAt * 10)}|${Math.round(Wd.torchAt * 10)}`
      if (moment && told !== toldWeld) {
        toldWeld = told
        say(at(E.weld.says[moment], lv))
        if (moment === 'done') play('celebrate')
      }
    }
    // the marker over the next thing to tap
    const next = weldNext()
    const spot = {
      rails: () => v3.set(NEAR_X, RAIL_TOP + 0.35, WZ - 0.25),
      mould: () => v3.copy(mouldHalves[1].position).add(new THREE.Vector3(0, 0.55, 0)),
      torch: () => v3.copy(burner.position).add(new THREE.Vector3(-0.1, 0.3, 0)),
      crucible: () => v3.copy(pot.position).add(new THREE.Vector3(0, 1.62, 0)),
      shear: () => v3.copy(shear.position).add(new THREE.Vector3(0, 0.85, 0)),
      grinder: () => v3.copy(grinder.position).add(new THREE.Vector3(0, 0.75, 0)),
    }[next]
    marker.visible = !!spot
    if (spot) {
      marker.position.copy(spot())
      marker.position.y += 0.05 * Math.sin(t * 3.2)
      for (const [kk, tg] of Object.entries(markerTags)) tg.visible = kk === next
      marker.quaternion.copy(ctx.camera.quaternion)
    }
    // the trains
    const te = trainAge()
    const runs = [
      { tr: trains[0], e: te, on: Wd.n > 0 && te >= 0 && te < T_RUN, jointed: true },
      { tr: trains[1], e: te - T_NEXT, on: Wd.n > 0 && Wd.both && te - T_NEXT >= 0 && te - T_NEXT < T_RUN, jointed: false },
    ]
    const pz = ctx.engine.player.pos.z
    for (const r of runs) {
      r.tr.group.visible = r.on
      if (!r.on) continue
      const head = T_FROM - T_SPEED * r.e
      const was = r.tr.group.position.z
      r.tr.group.position.z = head
      r.tr.update(dt, T_SPEED)
      if (r.jointed) {
        // each axle knocks as it crosses a joint near the visitor
        let bump = 0
        for (const ax of r.tr.axles) {
          const z1 = head + ax
          const z0 = was + ax
          if (z0 - z1 > 3) continue
          for (const j of oldJoints) {
            if (j < z0 && j >= z1 && Math.abs(j - pz) < 34) {
              bump = 1
              if (Wd.loud) play('pop')
            }
          }
        }
        r.tr.bump = Math.max(bump, (r.tr.bump ?? 0) - dt * 8)
        r.tr.setBump(r.tr.bump)
      } else if (Wd.loud && was > pz + 4 && head <= pz + 4) play('fizz', { order: 2 })
    }

    // ---- the bench ----
    const be = benchAge()
    const res = B.lit ? resultOf() : null
    const burning = B.lit && be < BENCH_T
    fuse.visible = !B.lit || be < 1.0
    if (B.lit && be < 1.0) {
      little.localToWorld(v3.set(0.03, 0.34 - be * 0.15, 0.02))
      sparks.emit(v3, rate(light ? 60 : 140, dt), { speed: 1.2, up: 0.5, spread: 1, life: 0.45, color: [1, 0.9, 0.6] })
    }
    let flash = 0
    if (burning && be >= 1.0) {
      const f = be - 1.0
      little.localToWorld(v3.set(0, 0.17, 0))
      if (res === 'burn') {
        flash = Math.max(0, 1 - f / 1.8) * (0.85 + 0.15 * Math.sin(t * 30))
        if (f < 1.6) sparks.emit(v3, rate(light ? 120 : 300, dt), { speed: 2.2, up: 1.1, spread: 0.8, life: 0.8, color: B.m === 'Mg' ? [1, 1, 0.95] : [1, 0.75, 0.35] })
        if (Math.random() < dt * 6) smoke.emit(v3.clone().add(new THREE.Vector3(0, 0.2, 0)), { size: 0.22, rise: 0.6, life: 2.4 })
      } else if (res === 'fast') {
        flash = f < 0.35 ? 2.2 : Math.max(0, 1 - (f - 0.35) / 0.5)
        if (f < 0.12) sparks.emit(v3, light ? 25 : 60, { speed: 3.6, up: 1.2, spread: 1.2, life: 0.8 })
        if (f < 0.3 && Math.random() < 0.6) smoke.emit(v3.clone().add(new THREE.Vector3(0, 0.25, 0)), { size: 0.45, rise: 0.8, life: 3, opacity: 0.45 })
      } else if (res === 'glow') {
        flash = Math.sin(Math.PI * clamp(f / 2.4)) * 0.35
      }
    }
    // (a bright flash beside the pale table and the orange van whitened the whole view: kept low, the
    // sparks and the bloom on the crucible carry it)
    benchLight.intensity = Math.min(1.2, flash) * (B.m === 'Mg' ? 3.2 : 2.4)
    benchLight.color.set(res === 'glow' ? '#ff6a2a' : B.m === 'Mg' ? '#f4f6ff' : '#ffd8a0')
    if (B.loud && B.lit && be >= 1.0 && be - dt < 1.0) {
      if (res === 'fast') play('bang')
      else if (res === 'burn') play('fizz', { order: 3 })
      else if (res === 'glow') play('fizz', { order: 1 })
    }
    // the product: a bead of iron or copper in a crust (or the powders unchanged)
    const made = B.lit && res !== 'none' && be > 1.4
    bead.visible = made
    if (made) {
      const cu = B.o === 'CuO'
      bead.material.color.set(cu ? '#c88033' : '#8a8c92')
      bead.material.emissiveIntensity = clamp(1 - (be - 1.4) / 6) * 1.6
    }
    drawLittle(be, res)
    beacons.forEach((b, i) => (b.material.emissiveIntensity = 0.2 + 1.8 * Math.max(0, Math.sin(t * 5 + i * Math.PI))))
    drawLadder(lv)

    // words that follow the depth switch
    if (lv !== shownLevel) {
      shownLevel = lv
      gaugeShown = ''
    }
    for (const [o, d] of byLevel) o.visible = depthOf(lv) === d && o.parent?.userData?.on !== false
  })

  // the little crucible's top: the two powders side by side, then what the fire left
  let littleKey = ''
  function drawLittle(be, res) {
    const stage2 = !B.lit ? 'mix' : be < 1.4 || res === 'none' ? 'mix' : 'done'
    const key = `${B.m}|${B.o}|${stage2}|${res}`
    if (key === littleKey) return
    littleKey = key
    littleTop.userData.redraw((g, w, h) => {
      g.fillStyle = '#b7a684'
      g.fillRect(0, 0, w, h)
      if (stage2 === 'mix') {
        if (B.m) {
          g.fillStyle = POWDER[B.m]
          g.fillRect(0, 0, w / 2, h)
        }
        if (B.o) {
          g.fillStyle = POWDER[B.o]
          g.fillRect(w / 2, 0, w / 2, h)
        }
      } else {
        // a crust of the new oxide: white magnesia, pale alumina, rust-red iron oxide
        g.fillStyle = B.m === 'Mg' ? '#eeeeea' : B.m === 'Al' ? '#d8d2c6' : '#7a3a22'
        g.fillRect(0, 0, w, h)
        const rnd = random(3)
        for (let i = 0; i < 40; i++) {
          g.fillStyle = B.o === 'CuO' ? 'rgba(200,128,51,0.8)' : 'rgba(90,90,96,0.7)'
          g.fillRect(rnd() * w, rnd() * h, 3, 3)
        }
      }
    })
  }

  // the ladder on the van: the metals tried so far in their places
  let ladderKey = ''
  function drawLadder(lv) {
    const key = `${B.seen.join(',')}|${lv}`
    if (key === ladderKey) return
    ladderKey = key
    const L2 = E.bench.ladder
    ladderTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0e1630'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(90,169,255,0.7)'
      g.lineWidth = 5
      g.strokeRect(6, 6, w - 12, h - 12)
      g.textBaseline = 'middle'
      const fit = (text, x, y, size, weight = 700, maxW = w - 60) => {
        let s = size
        g.font = `${weight} ${s}px Outfit`
        while (s > 12 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
        g.fillText(text, x, y)
      }
      g.textAlign = 'center'
      g.fillStyle = '#9fc8ff'
      fit(L2.title, w / 2, 46, 34)
      const sci = lv === 'scientist'
      g.fillStyle = '#c8d6f0'
      g.textAlign = 'left'
      fit(`▲ ${at(L2.top, lv)}`, 30, 92, 22, 600)
      METALS.forEach((m, i) => {
        const y = 150 + i * 92
        const seen = B.seen.includes(m)
        const len = ((w - 230) * GRIP[m]) / 600
        // the rung
        g.fillStyle = seen ? CPK[m] : 'rgba(120,140,190,0.25)'
        g.beginPath()
        g.roundRect(190, y - 20, seen ? len : w - 230, 40, 20)
        g.fill()
        g.fillStyle = seen ? '#f2f6ff' : '#7f8db0'
        g.textAlign = 'right'
        fit(seen ? E.bench.metals[m] : '?', 176, y, 30, 700, 160)
        g.textAlign = 'left'
        if (seen && sci) {
          g.fillStyle = '#0e1630'
          fit(`−${nf(GRIP[m])}`, 202, y, 24, 800, len - 20)
        }
        if (!seen) {
          g.fillStyle = '#9aa6c8'
          fit(L2.unknown, 206, y, 22, 600, w - 260)
        }
      })
      g.fillStyle = '#c8d6f0'
      fit(`▼ ${at(L2.bottom, lv)}`, 30, 150 + 3 * 92 + 62, 22, 600)
      g.fillStyle = '#ffe08a'
      g.textAlign = 'center'
      // the rule, on up to two lines
      const words = at(L2.rule, lv).split(' ')
      const lines = ['']
      g.font = '700 24px Outfit'
      for (const wd of words) {
        const tryL = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${wd}` : wd
        if (g.measureText(tryL).width > w - 60 && lines[lines.length - 1]) lines.push(wd)
        else lines[lines.length - 1] = tryL
      }
      lines.slice(0, 2).forEach((ln, i) => fit(ln, w / 2, h - 66 + i * 30, 24, 700))
    })
  }

  updates.push((dt, t) => stage.update(t))

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = (obj, dy = 0) => obj.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, dy, 0))
  const num = (v, a, b) => clamp(Number(v) || 0, a, b)

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame and off the line
    cameraBounds: { minX: -9.8, maxX: 1.5, minY: 0.35, maxY: 9, minZ: -9.3, maxZ: 7.9 },
    cameraPitchMax: 0.4,
    spawn: { x: 0, z: 5.6, yaw: 0 },
    hostSpot: { x: -1.5, z: 3.6, yaw: Math.atan2(-1.5 - 0, 3.6 - 5.6) },
    back: { x: 0, z: 8.7, rot: Math.PI },
    // the easel on the left of the arrival
    stand: { x: -3.2, z: 5.4, rot: Math.atan2(3.2, 0.2) },
    parts: {
      mix: {
        tap: what => mixStep(what), // 'rust' | 'al' | 'light' | 'lens' | 'empty'
        slide: s => slideMix(s), // the panel's slider (0..1, rust's share)
        get state() {
          return { r: M.r, a: M.a, seq: M.seq, burnt: M.burnt, out: outcomeOf(M.r, M.a), view: mixView().phase }
        },
      },
      weld: {
        tap: what => weldStep(what), // 'rails' | 'mould' | 'torch' | 'crucible' | 'shear' | 'grinder' | 'signal' | 'fresh'
        slide: v => slideHeat(v), // the preheat slider (minutes)
        get state() {
          return { k: Wd.k, heat: heatNow(), next: weldNext(), trains: trainsRunning() }
        },
        // skip the waits (a probe's shortcut): the current step as if it began s seconds ago
        age: s => {
          Wd.kAt = clock() - s
          if (torchRunning()) Wd.torchAt = clock() - s
        },
      },
      bench: {
        tap: what => benchStep(what), // 'Mg' | 'Al' | 'Fe' | 'Cu' | 'Fe2O3' | 'CuO' | 'light' | 'fresh'
        get state() {
          return { m: B.m, o: B.o, lit: B.lit, result: resultOf(), seen: [...B.seen] }
        },
      },
      at: {
        rust: () => world(jars.rust, 0.2),
        al: () => world(jars.al, 0.2),
        igniter: () => world(igniter, 0.3),
        lens: () => world(lens),
        rails: () => new THREE.Vector3(NEAR_X, RAIL_TOP, WZ - 0.5),
        mould: () => world(mouldHit),
        torch: () => world(burner),
        crucible: () => world(pot, 0.95),
        shear: () => world(shear, 0.3),
        grinder: () => world(grinder, 0.3),
        signal: () => world(signal, 3.3),
        jar: k => world(benchJars[k], 0.1),
        little: () => world(little, 0.15),
      },
      rayTo,
    },
    panels: { mix: mixPanel, weld: weldPanel, bench: benchPanel },
    shared: {
      mix: {
        get: () => ({ r: M.r, a: M.a, seq: M.seq, mixed: M.mixed, burnt: M.burnt, n: M.n, ln: M.ln, age: M.burnt ? Math.min(30, Math.round(Math.max(0, mixAge()) * 10) / 10) : 0 }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const ln = Math.max(0, Math.round(Number(s?.ln) || 0))
          M.r = Math.round(num(s?.r, 0, FULL) * 100) / 100
          M.a = Math.round(num(s?.a, 0, FULL) * 100) / 100
          M.seq = String(s?.seq ?? '').replace(/[^ra]/g, '').slice(-FULL)
          M.mixed = !!s?.mixed
          const burnt = !!s?.burnt && M.r > 0 && M.a > 0
          M.mine = false
          M.loud = live
          if (burnt) {
            const age = num((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
            if (!M.burnt || n !== M.n || !live) {
              M.at = clock() - age
              M.lensAt = M.at + IGN
              lastOutTold = n
            }
          } else {
            M.at = -99
            M.lensAt = -99
          }
          if (live && ln === M.ln + 1) {
            M.lensAt = clock()
          }
          M.burnt = burnt
          M.n = n
          M.ln = ln
          lastMixPhase = mixView().phase
          secKey = ''
        },
      },
      weld: {
        get: () => ({
          k: Wd.k,
          h: Math.round(heatNow() * 10) / 10,
          to: Wd.h1 > Wd.h0 && torchRunning() ? Wd.h1 : 0,
          age: Math.min(30, Math.round(Math.max(0, wAge()) * 10) / 10),
          n: Wd.n,
          both: Wd.both,
          tage: Wd.n > 0 ? Math.min(40, Math.round(Math.max(0, trainAge()) * 10) / 10) : 0,
        }),
        set: (s, live, ago = 0) => {
          const k = Math.round(num(s?.k, 0, 5))
          const h = num(s?.h, 0, 3)
          const to = num(s?.to, 0, 3)
          const age = num((Number(s?.age) || 0) + (Number(ago) || 0), 0, 99)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          Wd.mine = false
          Wd.trainMine = false
          Wd.loud = live
          Wd.k = k
          Wd.kAt = clock() - age
          if (to > h) {
            // the torch still running: from the heat it has reached, on to its end
            Wd.h0 = h
            Wd.h1 = to
            Wd.torchAt = clock() - 0.6 - (Number(ago) || 0)
          } else {
            Wd.h0 = Wd.h1 = h
            Wd.torchAt = -99
          }
          if (n !== Wd.n || !live) {
            Wd.n = n
            Wd.both = !!s?.both
            Wd.tAt = n > 0 ? clock() - num((Number(s?.tage) || 0) + (Number(ago) || 0), 0, 99) : -99
          }
        },
      },
      bench: {
        get: () => ({ m: B.m, o: B.o, lit: B.lit, n: B.n, age: B.lit ? Math.min(20, Math.round(Math.max(0, benchAge()) * 10) / 10) : 0, seen: [...B.seen] }),
        set: (s, live, ago = 0) => {
          const m = METALS.includes(s?.m) ? s.m : null
          const o = OXIDES.includes(s?.o) ? s.o : null
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          B.mine = false
          B.loud = live
          B.m = m
          B.o = o && !(m && METAL_OF[o] === m) ? o : null
          B.lit = !!s?.lit && !!(B.m && B.o)
          B.seen = METALS.filter(x => Array.isArray(s?.seen) && s.seen.includes(x))
          if (B.lit) B.at = clock() - num((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          else B.at = -99
          B.n = n
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
      hose?.geometry.dispose()
    },
  }
}
