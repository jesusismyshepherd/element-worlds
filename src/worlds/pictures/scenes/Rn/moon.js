// Radon's picture "Does the Moon breathe out a gas?" as a room (docs/knowledge/picture-rooms.md): the picture
// made into a place, standing on the Moon above the bright crater Aristarchus (stages/lunar.js: grey regolith,
// the bowl with its central peak below, a low Sun, the Earth in a black sky). Three stations, each step chosen
// by tapping its thing (the user, 2026-10-30), the prompt naming the next tap; E opens the station's panel,
// whose buttons and slider do the same:
// - the crack: tap it and a puff of radon atoms (the hall's teal balls) comes out and hops away in long arcs,
//   with no air to carry or stop them, until each, after its own random wait (radon's 3.8 days in 6 s), breaks
//   apart where it lies, a tiny alpha flash, leaving an amber dot that stays: what radon turns into marks where
//   gas came out. An air slider (none, as on the Moon, up to as much as on Earth) fills a bubble round the crack
//   with air for the next puff: the atoms drift on the breeze instead, spread thin, and what they turn into
//   floats off on dust. A small screen counts hopping atoms, broken ones and dots;
// - the orbiter: Apollo 15's command and service module, a model a third of real size, hovering with its
//   instrument bay open; tap the gold box (the alpha-particle spectrometer) and a cone sweeps the land while
//   the map below it fills in: radon over Aristarchus (teal), polonium-210 along the edges of the dark seas and
//   at Grimaldi (amber). A years slider (2 hours to 100 years after a puff of gas at the crater below) fades the
//   teal haze over the crater in days and lets an amber stain grow on its floor and last for decades, with the
//   two meters (and, for the Scientist, the two curves) on the board: why one means "now", the other "lately";
// - Lunar Prospector (1998 and 1999), at real size, spinning on a pedestal beside a Moon globe: each tap is two
//   weeks of mapping from its polar orbit, the globe turning under it; the counts are faint, so each map is
//   noisy and only adding many makes the two radon spots stand out (Aristarchus and Kepler) with the amber
//   boxes; one tap in three the Sun is stormy and those weeks are thrown away (as the team did).
// The puffs, the air, the scans, the years and the map cycles are shared in a room (src/net/shared.js); a
// puff's atoms are worked out ahead from its number and its air, so every screen shows the same hops and dots.
// parts.<station> does what a tap does, for the probes. Facts and their sources: moon.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, random } from '../../../wings/noble/kit.js'
import { lunarStage, paintMoonMap, CRATERS, MARIA } from '../../stages/lunar.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { MOON_WORDS } from './moon.words.js'

export const WORDS = MOON_WORDS

const TAU = Math.PI * 2
const TEAL = '#3cc3d6'
const HALO = '#6ff0ff'
const AMBER = '#ffb347'
const LILAC = '#b39dff'
const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')

// ---- radon on the Moon, sped up ----
const HALF = 6 // s: radon-222's half-life, 3.82 days, here
const LIFE = 34 // s: a puff is worked out this far (every atom has broken apart by then)
const KEEP = 5 // puffs whose dots stay on the ground
const G = 5 // m/s2: the hops' gravity, shrunk with the hops (real hops are kilometres long)
const FPS = 30 // frames a second stored for each atom's path

// ---- the decay chain for the years slider (half-lives in days) ----
const LAMBDA = [3.8235, 22.2 * 365.25, 5.012, 138.376].map(h => Math.LN2 / h) // Rn-222, Pb-210, Bi-210, Po-210
/** Polonium-210's activity t days after a puff of radon, the radon's at the start being 1 (Bateman). */
function poActivity(t) {
  let s = 0
  for (let i = 0; i < 4; i++) {
    let p = 1
    for (let j = 0; j < 4; j++) if (j !== i) p *= LAMBDA[j] - LAMBDA[i]
    s += Math.exp(-LAMBDA[i] * t) / p
  }
  // the activity lambda4 * N4 over the radon's first, lambda1 * N1(0): the lambda1 of N4's factor cancels
  return LAMBDA[1] * LAMBDA[2] * LAMBDA[3] * s
}
const rnActivity = t => Math.exp(-LAMBDA[0] * t)
const PO_PEAK = (() => {
  let best = 0
  for (let u = 0; u <= 2000; u++) best = Math.max(best, poActivity(0.1 * Math.pow(365250 / 0.1, u / 2000)))
  return best
})()
/** The years slider (0..100) as days after the puff: 2.4 hours to 100 years, evenly in the logarithm. */
const daysAt = u => 0.1 * Math.pow(365250 / 0.1, clamp(u, 0, 100) / 100)

// ---- small helpers ----
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1, ...o })
const hitShape = (geo, parent, x, y, z) => {
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  parent.add(m)
  return m
}
const label = (text, size = 0.14, extra = {}) => makeText(text, { size, color: '#ffffff', outlineWidth: size * 0.08, outlineColor: '#06081a', ...extra })
const _q = new THREE.Quaternion()
function faceCamera(obj, camera) {
  obj.quaternion.copy(camera.quaternion)
  if (obj.parent) obj.quaternion.premultiply(obj.parent.getWorldQuaternion(_q).invert())
}
function setText(t, text) {
  if (t.text === text) return
  t.text = text
  t.sync()
}
/** A teal radon ball with its soft halo, or an amber speck (for Points). */
function ballTexture(core, halo) {
  return canvasTex(64, 64, (g, w) => {
    const c = w / 2
    const h = g.createRadialGradient(c, c, 0, c, c, c)
    h.addColorStop(0, halo)
    h.addColorStop(0.45, halo + '66')
    h.addColorStop(1, halo + '00')
    g.fillStyle = h
    g.fillRect(0, 0, w, w)
    const b = g.createRadialGradient(c * 0.82, c * 0.8, 1, c, c, c * 0.42)
    b.addColorStop(0, '#ffffff')
    b.addColorStop(0.35, core)
    b.addColorStop(1, core)
    g.fillStyle = b
    g.beginPath()
    g.arc(c, c, c * 0.4, 0, TAU)
    g.fill()
  })
}
/** A small board on a post: a canvas face (`tex`, drawn by the caller) in a glowing frame that turns gold
 *  once its station is found. Unlit, so the low Sun never washes it out. */
function canvasBoard({ w, h, color, top = 1.3, tilt = 0.28, post, px = 512 }) {
  const tex = canvasTex(px, Math.round((px * h) / w), null)
  const group = new THREE.Group()
  const face = new THREE.Group()
  face.position.y = top
  face.rotation.x = -tilt
  group.add(face)
  const frameMat = std(color, { emissive: color, emissiveIntensity: 0.75 })
  face.add(new THREE.Mesh(new RoundedBoxGeometry(w + 0.08, h + 0.08, 0.05, 2, 0.02), frameMat))
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
  plate.position.z = 0.03
  face.add(plate)
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, top, 8), post)
  leg.position.set(0, top / 2, -0.06)
  group.add(leg)
  const base = new THREE.Color(color)
  return {
    group,
    tex,
    setRead(read) {
      frameMat.color.copy(read ? new THREE.Color('#ffd166') : base)
      frameMat.emissive.copy(read ? new THREE.Color('#ffd166') : base)
      frameMat.emissiveIntensity = read ? 0.45 : 0.75
    },
  }
}
/** Plural forms of a unit ({ one, few, many }) for a whole number in a language. */
function plural(forms, n, lang) {
  const k = new Intl.PluralRules(lang === 'pt-pt' ? 'pt-PT' : lang).select(n)
  return (k === 'one' ? forms.one : k === 'few' ? forms.few : forms.many).replace('{n}', String(n))
}
/** A soft cone of light, its tip at the origin, opening along -y (`len` long, `r` wide at the end). */
function coneMesh({ len, r, color }) {
  const geo = new THREE.CylinderGeometry(0.04, r, len, 48, 1, true).translate(0, -len / 2, 0)
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uK: { value: 0 }, uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `varying vec2 vUv; varying vec3 vNm; varying vec3 vVw;
      void main() {
        vUv = uv;
        vNm = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vVw = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `uniform float uK; uniform vec3 uColor; uniform float uTime; varying vec2 vUv; varying vec3 vNm; varying vec3 vVw;
      void main() {
        float t = 1.0 - vUv.y;
        float fade = pow(clamp(1.0 - t, 0.0, 1.0), 0.6) * smoothstep(0.0, 0.03, t);
        float soft = pow(clamp(abs(dot(normalize(vNm), normalize(vVw))), 0.0, 1.0), 1.2);
        float scan = 0.75 + 0.25 * sin(t * 40.0 - uTime * 6.0);
        gl_FragColor = vec4(uColor, uK * fade * soft * scan * 0.45);
      }`,
  })
  const m = new THREE.Mesh(geo, mat)
  m.raycast = () => {}
  m.frustumCulled = false
  m.userData.mat = mat
  return m
}

export async function build({ ctx, root, E, ex, say, level, clickable, lang, light }) {
  const R = 72
  // ==== where things stand (metres; the spawn at z = 5.5 looks along -z, down toward the crater) ====
  const CRACK = [[-5.9, -0.3], [-4.8, -0.9], [-3.8, -1.3], [-2.9, -2.1], [-1.9, -2.6], [-1.1, -3.3]]
  const VC = { x: -3.5, z: -1.6 } // the crack's middle
  const BOARD = { x: 4.0, z: -5.1 }
  const SPOT_O = { x: 2.5, z: -1.2 }
  const LP = { x: 6.8, z: 1.2 }
  const GLOBE = { x: 7.0, z: 5.0 }
  const SPOT_P = { x: 3.4, z: 2.6 }
  const STAND = { x: -5.4, z: 4.6 }
  const stage = lunarStage({
    radius: 9.5,
    light,
    pixelRatio: Math.min(2, window.devicePixelRatio || 1),
    crater: { x: 0, z: -31.5 - R, r: R },
    clear: [[0, 7.6, 2], [0, 5.5, 1.4], [VC.x, VC.z, 3], [BOARD.x, BOARD.z, 1.6], [LP.x, LP.z, 1.6], [GLOBE.x, GLOBE.z, 1.2], [STAND.x, STAND.z, 1.2]],
  })
  root.add(stage.group)
  const groundAt = stage.groundAt
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const sent = {}
  const throttled = id => {
    if (sent[id]) return
    sent[id] = setTimeout(() => {
      sent[id] = null
      share(id)
    }, 250)
  }
  const now = () => performance.now()
  const glowTex = glowTexture(128)
  const radonTex = ballTexture(TEAL, HALO)
  const amberTex = ballTexture('#ffc56a', AMBER)
  textures.push(glowTex, radonTex, amberTex)
  const facing = []

  // =========================================================================================================
  // 1. THE CRACK: radon comes out and hops
  // =========================================================================================================
  const crackLen = []
  let total = 0
  for (let i = 1; i < CRACK.length; i++) crackLen.push((total += Math.hypot(CRACK[i][0] - CRACK[i - 1][0], CRACK[i][1] - CRACK[i - 1][1])))
  /** A point along the crack, s from 0 to 1. */
  const crackPoint = s => {
    const d = s * total
    let i = crackLen.findIndex(l => l >= d)
    if (i < 0) i = crackLen.length - 1
    const l0 = i ? crackLen[i - 1] : 0
    const k = (d - l0) / (crackLen[i] - l0)
    return [CRACK[i][0] + (CRACK[i + 1][0] - CRACK[i][0]) * k, CRACK[i][1] + (CRACK[i + 1][1] - CRACK[i][1]) * k]
  }
  // the crack itself: a dark ribbon cut into the ground, its lips a little paler, a faint glow deep in it
  const crackTex = canvasTex(64, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const grd = g.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, 'rgba(10,9,14,0)')
    grd.addColorStop(0.22, 'rgba(10,9,14,0.85)')
    grd.addColorStop(0.5, 'rgba(4,4,8,1)')
    grd.addColorStop(0.78, 'rgba(10,9,14,0.85)')
    grd.addColorStop(1, 'rgba(10,9,14,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(crackTex)
  const ribbon = (width, mat, lift) => {
    const pos = []
    const uv = []
    const idx = []
    const N = 60
    let run = 0
    let last = null
    for (let i = 0; i <= N; i++) {
      const s = i / N
      const [x, z] = crackPoint(s)
      const [x2, z2] = crackPoint(Math.min(1, s + 0.01))
      const [x1, z1] = crackPoint(Math.max(0, s - 0.01))
      const tx = x2 - x1
      const tz = z2 - z1
      const tl = Math.hypot(tx, tz) || 1
      const nx = -tz / tl
      const nz = tx / tl
      // wider in the middle, a wobble along it
      const wv = width * (0.45 + 0.55 * Math.sin(Math.PI * s)) * (0.85 + 0.15 * Math.sin(s * 37))
      if (last) run += Math.hypot(x - last[0], z - last[1])
      last = [x, z]
      for (const side of [-1, 1]) {
        const px = x + nx * wv * side
        const pz = z + nz * wv * side
        pos.push(px, groundAt(px, pz) + lift, pz)
        uv.push(side < 0 ? 0 : 1, run / 2)
      }
      if (i < N) {
        const a = i * 2
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, mat)
    m.renderOrder = 1
    root.add(m)
    return m
  }
  const crackMat = new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })
  const crackMesh = ribbon(0.32, crackMat, 0.012)
  crackMesh.raycast = () => {}
  const seepMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(TEAL).multiplyScalar(1.4), transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
  const seep = ribbon(0.06, seepMat, 0.016)
  seep.raycast = () => {}
  // the crack to tap: an invisible strip along it, higher than the ground
  const crackHits = new THREE.Group()
  root.add(crackHits)
  for (let i = 0; i < CRACK.length - 1; i++) {
    const [ax, az] = CRACK[i]
    const [bx, bz] = CRACK[i + 1]
    const l = Math.hypot(bx - ax, bz - az)
    const mx = (ax + bx) / 2
    const mz = (az + bz) / 2
    const h = hitShape(new THREE.BoxGeometry(l + 0.2, 0.5, 0.9), crackHits, mx, groundAt(mx, mz) + 0.2, mz)
    h.rotation.y = -Math.atan2(bz - az, bx - ax)
  }
  // a breath of glow along the crack when gas comes out
  const breath = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: HALO, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  breath.position.set(VC.x, groundAt(VC.x, VC.z) + 0.4, VC.z)
  breath.scale.set(6, 1.6, 1)
  breath.raycast = () => {}
  root.add(breath)

  // the bubble of air round the crack (the air slider), and specks riding its breeze
  const AIR_R = 4.6
  const domeMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uAir: { value: 0 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `varying vec3 vNm; varying vec3 vVw; varying vec3 vP;
      void main() {
        vP = position;
        vNm = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vVw = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `uniform float uAir; uniform float uTime; varying vec3 vNm; varying vec3 vVw; varying vec3 vP;
      void main() {
        float f = 1.0 - clamp(abs(dot(normalize(vNm), normalize(vVw))), 0.0, 1.0);
        float sheen = 0.025 + 0.32 * pow(f, 3.0) + 0.02 * sin(vP.y * 9.0 + uTime * 1.5);
        gl_FragColor = vec4(mix(vec3(0.3, 0.55, 1.0), vec3(0.65, 0.85, 1.0), f), uAir * sheen);
      }`,
  })
  const dome = new THREE.Mesh(new THREE.SphereGeometry(AIR_R, 48, 24, 0, TAU, 0, Math.PI * 0.62), domeMat)
  dome.position.set(VC.x, groundAt(VC.x, VC.z) - 1.2, VC.z)
  dome.raycast = () => {}
  dome.visible = false
  root.add(dome)
  const NW = light ? 40 : 90
  const windPos = new Float32Array(NW * 3)
  const windSeed = Array.from({ length: NW }, (_, i) => random(300 + i))
  const windBase = windSeed.map(r => [r() * TAU, Math.sqrt(r()) * (AIR_R - 0.6), 0.2 + r() * 2.4, r()])
  const windGeo = new THREE.BufferGeometry()
  windGeo.setAttribute('position', new THREE.BufferAttribute(windPos, 3))
  const windMat = new THREE.PointsMaterial({ map: glowTex, color: '#cfe6ff', size: 0.07, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const windPts = new THREE.Points(windGeo, windMat)
  windPts.frustumCulled = false
  windPts.raycast = () => {}
  root.add(windPts)

  // ---- a puff, worked out ahead from its number and its air: every screen shows the same hops ----
  const ATOMS = light ? 8 : 10
  const sims = new Map()
  function simulate(id, air) {
    const key = `${id}|${air}`
    if (sims.has(key)) return sims.get(key)
    const rnd = random(1000 + id * 7919 + air * 13)
    const a01 = air / 100
    const drag = a01 * 9
    const wind = [0.75 * a01, 0, 0.35 * a01]
    const atoms = []
    const dt = 1 / 60
    for (let k = 0; k < ATOMS; k++) {
      const [x0, z0] = crackPoint(0.06 + rnd() * 0.88)
      let x = x0
      let z = z0
      let y = groundAt(x, z) + 0.06
      let vx = 0
      let vy = 0
      let vz = 0
      let rest = 0.05 + rnd() * 0.6 // a moment in the crack before it comes out
      let grounded = true
      // its random wait (exponential, half-life HALF), at least a little hop first
      const T = Math.min(LIFE - 5, 0.8 + (-HALF / Math.LN2) * Math.log(1 - rnd() * 0.995))
      const frames = []
      let t = 0
      let decayAt = -1
      let landAt = -1
      let dot = null
      let decayPos = null
      let turb = [0, 0, 0]
      let turbT = 0
      const alpha = new THREE.Vector3(rnd() - 0.5, 0.35 + rnd(), rnd() - 0.5).normalize()
      const end = T + 3.2
      for (let i = 0; t <= end; i++, t += dt) {
        if (i % 2 === 0) frames.push(x, y, z)
        const gy = groundAt(x, z) + 0.06
        const isRadon = t < T
        if (isRadon || !dot || landAt < 0) {
          if (!isRadon && decayAt < 0) {
            decayAt = t
            decayPos = [x, y, z]
            if (a01 < 0.4 && grounded) {
              dot = [x, gy - 0.05, z]
              landAt = t
            }
          }
          if (grounded && (isRadon || a01 >= 0.4) && a01 < 0.4) {
            // resting on the ground for a moment (it sticks briefly), then off again
            if (isRadon && (rest -= dt) <= 0) {
              const v = 3.0 + rnd() * 1.7
              const el = 0.6 + rnd() * 0.75
              const az = rnd() * TAU
              vx = v * Math.cos(el) * Math.cos(az)
              vz = v * Math.cos(el) * Math.sin(az)
              vy = v * Math.sin(el)
              grounded = false
            }
          } else if (!grounded || a01 >= 0.4) {
            if (grounded && a01 >= 0.4) {
              grounded = false
              vy = 0.5 + rnd() * 0.5
            }
            // through the air: dragged toward the breeze, jostled; in a vacuum: falling freely
            if ((turbT -= dt) <= 0) {
              turbT = 0.12 + rnd() * 0.1
              turb = [(rnd() - 0.5) * 3.2 * a01, (rnd() - 0.4) * 2.4 * a01, (rnd() - 0.5) * 3.2 * a01]
            }
            const kk = Math.min(1, drag * dt)
            vx += (wind[0] + turb[0] - vx) * kk
            vy += (wind[1] + turb[1] - vy) * kk - G * (1 - a01) * dt
            vz += (wind[2] + turb[2] - vz) * kk
            x += vx * dt
            y += vy * dt
            z += vz * dt
            const ng = groundAt(x, z) + 0.06
            if (y > ng + 5) vy -= 2 * dt
            if (y <= ng) {
              y = ng
              if (a01 < 0.4 && vy < 0) {
                grounded = true
                vx = vy = vz = 0
                rest = 0.12 + rnd() * 0.45
                if (!isRadon && !dot) {
                  dot = [x, ng - 0.05, z]
                  landAt = t
                }
              } else vy = Math.abs(vy) * 0.5
            }
          }
        }
      }
      atoms.push({ T, decayAt: decayAt < 0 ? T : decayAt, landAt, dot, decayPos: decayPos ?? [x, y, z], alpha, frames: new Float32Array(frames), drift: !dot })
    }
    const sim = { atoms }
    sims.set(key, sim)
    if (sims.size > 24) sims.delete(sims.keys().next().value)
    return sim
  }
  const framePos = (a, age, out) => {
    const f = clamp(age * FPS, 0, a.frames.length / 3 - 1.001)
    const i = Math.floor(f)
    const k = f - i
    const p = a.frames
    out[0] = p[i * 3] + (p[i * 3 + 3] - p[i * 3]) * k
    out[1] = p[i * 3 + 1] + (p[i * 3 + 4] - p[i * 3 + 1]) * k
    out[2] = p[i * 3 + 2] + (p[i * 3 + 5] - p[i * 3 + 2]) * k
    return out
  }

  // what is drawn: the atoms, their dotted trails, the amber specks, the dots on the ground, the alpha flashes
  const MAXA = KEEP * ATOMS
  const TRAIL = 9
  const mkPoints = (n, mat) => {
    const pos = new Float32Array(n * 3).fill(-999)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    root.add(pts)
    return { pos, geo, pts }
  }
  const atomPts = mkPoints(MAXA, new THREE.PointsMaterial({ map: radonTex, size: 0.34, transparent: true, depthWrite: false, alphaTest: 0.02 }))
  const trailCol = new Float32Array(MAXA * TRAIL * 3)
  const trailPts = mkPoints(MAXA * TRAIL, new THREE.PointsMaterial({ map: glowTex, size: 0.09, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  trailPts.geo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3))
  const speckPts = mkPoints(MAXA, new THREE.PointsMaterial({ map: amberTex, size: 0.22, transparent: true, depthWrite: false, alphaTest: 0.02 }))
  const dotGlow = mkPoints(MAXA, new THREE.PointsMaterial({ map: glowTex, color: AMBER, size: 0.42, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
  const dotMesh = new THREE.InstancedMesh(new THREE.CircleGeometry(0.075, 14).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(AMBER).multiplyScalar(1.3), toneMapped: false }), MAXA)
  dotMesh.count = 0
  dotMesh.frustumCulled = false
  dotMesh.raycast = () => {}
  root.add(dotMesh)
  const flashPos = new Float32Array(MAXA * 6)
  const flashCol = new Float32Array(MAXA * 6)
  const flashGeo = new THREE.BufferGeometry()
  flashGeo.setAttribute('position', new THREE.BufferAttribute(flashPos, 3))
  flashGeo.setAttribute('color', new THREE.BufferAttribute(flashCol, 3))
  const flashes = new THREE.LineSegments(flashGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  flashes.frustumCulled = false
  flashes.raycast = () => {}
  root.add(flashes)

  // the small screen beside the crack: what is happening, counted
  // (drawn on a canvas that the hard sunlight cannot wash out)
  const readout = canvasBoard({ w: 1.5, h: 0.84, color: TEAL, top: 1.3, post: std('#3a3c4a', { metalness: 0.5 }) })
  textures.push(readout.tex)
  const RD = { x: -6.3, z: -2.6 }
  readout.group.position.set(RD.x, groundAt(RD.x, RD.z), RD.z)
  readout.group.rotation.y = Math.atan2(-2.0 - RD.x, 1.6 - RD.z)
  root.add(readout.group)
  solids.push(circle(RD.x, RD.z, 0.35))
  const crackSign = label(E.vent.signs.crack, 0.15)
  crackSign.position.set(-1.0, groundAt(-1.0, -3.3) + 0.55, -3.3)
  root.add(crackSign)
  facing.push(crackSign)

  // the state: the air, how many puffs so far, the puffs whose dots still lie there
  const V = { air: 0, n: 0, puffs: [] }
  let airTried = false
  let lastPuffAir = -1
  const ageOf = p => clamp((now() - p.start) / 1000, 0, LIFE)
  function puff(mine = true) {
    V.n++
    V.puffs.push({ id: V.n, air: V.air, start: now() })
    while (V.puffs.length > KEEP) V.puffs.shift()
    simulate(V.n, V.air)
    lastPuffAir = V.air
    play('tap')
    if (mine) {
      say(at(V.air >= 40 ? E.vent.says.puffAir : V.air > 0 ? E.vent.says.puffThin : V.n === 1 ? E.vent.says.puff : E.vent.says.again, level()))
      ex.discover('vent', ventPanel, 4.5)
      share('vent')
    }
  }
  let airSaid = 0
  function setAir(v, now_ = false) {
    const n = clamp(Math.round((Number(v) || 0) / 5) * 5, 0, 100)
    if (n === V.air) return
    V.air = n
    airTried = true
    if (now_) share('vent')
    else throttled('vent')
    ex.discover('vent', ventPanel, 4.5)
    const band = n === 0 ? 0 : n < 40 ? 1 : 2
    if (band !== airSaid) {
      airSaid = band
      say(at(n === 0 ? E.vent.says.airNone : n < 40 ? E.vent.says.airThin : E.vent.says.airFull, level()))
    }
  }
  const airText = v => (v <= 0 ? E.vent.airNone : fill(E.vent.air, { n: Math.round(v) }))
  const ventPanel = lv => ({
    title: E.vent.title,
    color: TEAL,
    blocks: [
      { buttons: [{ label: E.vent.buttons.puff, onClick: () => puff() }] },
      { slider: { label: E.vent.slider, min: 0, max: 100, step: 5, value: V.air, onInput: v => setAir(v), format: airText, live: () => V.air } },
      ...E.vent.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(crackHits, () => puff(), { reach: 6 })
  // the screen opens the panel (the air slider)
  clickable(readout.group, () => ctx.showPanel(ventPanel), { reach: 6 })
  ex.add({
    id: 'vent',
    x: -2.1,
    z: 1.5,
    radius: 2.6,
    manual: true,
    label: E.vent.label,
    verb: () => {
      const H = E.vent.hints
      if (!V.n) return H.tap
      if (!airTried) return H.air
      if (V.air !== lastPuffAir) return H.again
      return H.more
    },
    screens: [readout],
    focus: { x: VC.x - 0.6, y: groundAt(VC.x, VC.z) + 0.9, z: VC.z - 0.5, size: 5.4, width: 5.6 },
    act: () => ctx.showPanel(ventPanel),
  })

  const tmp3 = [0, 0, 0]
  const m4 = new THREE.Matrix4()
  const popV = new THREE.Vector3()
  let rdKey = ''
  updates.push((dt, t) => {
    const lv = level()
    let na = 0
    let nt = 0
    let ns = 0
    let nd = 0
    let nf = 0
    let hopping = 0
    let broken = 0
    let freshest = 99
    for (const p of V.puffs) {
      const age = ageOf(p)
      freshest = Math.min(freshest, age)
      const sim = simulate(p.id, p.air)
      // in air, an atom that drifts out of the bubble has spread too thin to see
      const thin = p.air >= 40 ? pos => Math.hypot(pos[0] - VC.x, pos[2] - VC.z) > AIR_R - 0.3 : () => false
      for (const a of sim.atoms) {
        if (age < a.T) {
          hopping++
          framePos(a, age, tmp3)
          if (thin(tmp3)) continue
          atomPts.pos.set(tmp3, na * 3)
          na++
          // the dotted trail behind it
          for (let j = 1; j <= TRAIL; j++) {
            const ta = age - j * 0.075
            if (ta < 0) break
            framePos(a, ta, tmp3)
            trailPts.pos.set(tmp3, nt * 3)
            const k = (1 - j / (TRAIL + 1)) * 0.9
            trailCol.set([0.24 * k, 0.76 * k, 0.84 * k], nt * 3)
            nt++
          }
        } else {
          broken++
          if (a.dot && age >= a.landAt) {
            m4.makeTranslation(a.dot[0], a.dot[1] + 0.02, a.dot[2])
            const pop = Math.min(1, (age - a.landAt) / 0.25)
            m4.scale(popV.set(pop, 1, pop))
            dotMesh.setMatrixAt(nd, m4)
            dotGlow.pos.set([a.dot[0], a.dot[1] + 0.1, a.dot[2]], nd * 3)
            nd++
          } else if (age < a.decayAt + 3.2) {
            framePos(a, age, tmp3)
            if (!thin(tmp3)) {
              speckPts.pos.set(tmp3, ns * 3)
              ns++
            }
          }
          // the alpha particle it throws out as it breaks apart: a quick streak
          const fa = age - a.decayAt
          if (fa >= 0 && fa < 0.45) {
            const [px, py, pz] = a.decayPos
            const l0 = fa * 5
            const l1 = Math.min(fa * 5 + 0.9, 2.6)
            flashPos.set([px + a.alpha.x * l0, py + a.alpha.y * l0, pz + a.alpha.z * l0, px + a.alpha.x * l1, py + a.alpha.y * l1, pz + a.alpha.z * l1], nf * 6)
            const k = 1 - fa / 0.45
            flashCol.set([0.6 * k, 0.95 * k, 1.0 * k, 0, 0, 0], nf * 6)
            nf++
          }
        }
      }
    }
    for (let i = na; i < MAXA; i++) atomPts.pos[i * 3 + 1] = -999
    for (let i = nt; i < MAXA * TRAIL; i++) trailPts.pos[i * 3 + 1] = -999
    for (let i = ns; i < MAXA; i++) speckPts.pos[i * 3 + 1] = -999
    for (let i = nd; i < MAXA; i++) dotGlow.pos[i * 3 + 1] = -999
    atomPts.geo.attributes.position.needsUpdate = true
    trailPts.geo.attributes.position.needsUpdate = true
    trailPts.geo.attributes.color.needsUpdate = true
    speckPts.geo.attributes.position.needsUpdate = true
    dotGlow.geo.attributes.position.needsUpdate = true
    dotMesh.count = nd
    dotMesh.instanceMatrix.needsUpdate = true
    flashGeo.setDrawRange(0, nf * 2)
    flashGeo.attributes.position.needsUpdate = true
    flashGeo.attributes.color.needsUpdate = true
    // the crack breathes when a puff comes out, and seeps faintly all the time
    breath.material.opacity = freshest < 1.4 ? 0.55 * (1 - freshest / 1.4) : 0
    seepMat.opacity = 0.16 + 0.08 * Math.sin(t * 1.7)
    // the bubble of air
    const air01 = V.air / 100
    domeMat.uniforms.uAir.value = damp(domeMat.uniforms.uAir.value, air01, 4, dt)
    domeMat.uniforms.uTime.value = t
    dome.visible = domeMat.uniforms.uAir.value > 0.01
    windMat.opacity = domeMat.uniforms.uAir.value * 0.7
    if (dome.visible) {
      for (let i = 0; i < NW; i++) {
        const [a0, r0, h0, s0] = windBase[i]
        const u = (t * (0.08 + 0.04 * s0) * (0.4 + air01) + s0) % 1
        const x = VC.x - AIR_R * 0.85 + u * AIR_R * 1.7 + Math.cos(a0) * 0.6
        const z = VC.z + Math.sin(a0) * r0 * 0.8 + u * 0.8
        windPos.set([x, groundAt(x, z) + h0 * Math.sin(Math.PI * u) + 0.1, z], i * 3)
      }
      windGeo.attributes.position.needsUpdate = true
    }
    // the screen's numbers
    const R_ = E.vent.readout
    const line = [
      fill(lastPuffAir >= 40 ? R_.drifting : R_.hopping, { n: hopping }),
      fill(R_.broken, { n: broken }),
      fill(nd || lastPuffAir < 40 ? R_.dots : R_.floated, { n: nd }),
      at(R_.clock, lv),
    ].join('\n')
    const key = `${lv}|${line}`
    if (key !== rdKey) {
      rdKey = key
      readout.tex.userData.redraw((g, w, h) => {
        g.fillStyle = '#0b1230'
        g.fillRect(0, 0, w, h)
        g.textAlign = 'left'
        g.fillStyle = TEAL
        g.font = '700 44px Outfit'
        g.fillText(R_.title, 28, 56)
        const lines = line.split('\n')
        lines.forEach((l, i) => {
          g.fillStyle = i === 2 ? '#ffcf86' : i === 3 ? '#9fb2e8' : '#ffffff'
          // a long line (some languages) is made smaller rather than cut
          let size = i === 3 ? 30 : 36
          g.font = `${i === 3 ? 600 : 700} ${size}px Nunito`
          while (size > 20 && g.measureText(l).width > w - 50) g.font = `${i === 3 ? 600 : 700} ${(size -= 2)}px Nunito`
          g.fillText(l, 28, 112 + i * 50)
        })
      })
    }
  })

  // =========================================================================================================
  // 2. THE ORBITER: Apollo 15's spaceship, a model a third of real size, and the map its counter made
  // =========================================================================================================
  const orb = new THREE.Group() // its +z faces the visitor's spot
  const gB = groundAt(BOARD.x, BOARD.z)
  orb.position.set(BOARD.x, gB, BOARD.z)
  orb.rotation.y = Math.atan2(SPOT_O.x - BOARD.x, SPOT_O.z - BOARD.z)
  root.add(orb)
  const alu = std('#c6cad4', { metalness: 0.6, roughness: 0.36 })
  const cmMat = std('#b4b8c4', { metalness: 0.35, roughness: 0.5 })
  const darkMat = std('#353946', { metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide })
  const goldMat = std('#d8a83a', { metalness: 0.75, roughness: 0.32, emissive: '#8a5c10', emissiveIntensity: 0.2 })
  const apsMat = std('#e6b445', { metalness: 0.7, roughness: 0.3, emissive: '#ffb020', emissiveIntensity: 0.3 })
  const whiteMat = std('#eceef2', { roughness: 0.6 })
  // the service module's skin: panel seams and the radiators' stripes
  const smTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#cfd3dc'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(70,76,92,0.55)'
    g.lineWidth = 2
    for (let i = 1; i < 6; i++) {
      g.beginPath()
      g.moveTo((i * w) / 6, 0)
      g.lineTo((i * w) / 6, h)
      g.stroke()
    }
    g.fillStyle = 'rgba(245,247,250,0.9)'
    for (const x0 of [0.3, 0.72]) {
      g.fillRect(x0 * w, h * 0.12, w * 0.12, h * 0.76)
      g.strokeStyle = 'rgba(150,156,170,0.6)'
      for (let y = h * 0.14; y < h * 0.88; y += 7) {
        g.beginPath()
        g.moveTo(x0 * w, y)
        g.lineTo((x0 + 0.12) * w, y)
        g.stroke()
      }
    }
  })
  textures.push(smTex)
  alu.map = smTex
  const ship = new THREE.Group() // axis along x: the nose at +x; its instrument bay facing +z before the roll
  const roll = new THREE.Group()
  roll.rotation.x = 0.85 // the bay turned toward the Moon below and toward the visitor
  roll.add(ship)
  const lift = new THREE.Group()
  lift.position.set(0, 4.15, -0.35)
  lift.rotation.z = 0.08
  lift.add(roll)
  orb.add(lift)
  const SR = 0.65
  const SL = 2.1
  const BAY = 1.0 // radians of the circumference left open for the bay
  const smGeo = new THREE.CylinderGeometry(SR, SR, SL, 48, 1, true, BAY / 2, TAU - BAY).rotateZ(-Math.PI / 2)
  ship.add(new THREE.Mesh(smGeo, alu))
  // the bay: a dark recess in the gap, its instruments standing out of it
  const bayW = SL * 0.78
  const bayH = 2 * SR * Math.sin(BAY / 2)
  const bayZ = SR * Math.cos(BAY / 2)
  const recess = new THREE.Mesh(new THREE.BoxGeometry(bayW, bayH, 0.5), darkMat)
  recess.position.set(-0.05, 0, bayZ - 0.25)
  ship.add(recess)
  for (const sx of [-1, 1]) {
    const end = new THREE.Mesh(new THREE.PlaneGeometry(bayH, 0.5), darkMat)
    end.rotation.y = Math.PI / 2
    end.position.set(-0.05 + (sx * bayW) / 2, 0, bayZ - 0.25)
    ship.add(end)
  }
  for (const s of [-1, 1]) {
    // the cylinder's skin outside the bay's ends
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(SR, SR, (SL - bayW) / 2 - 0.05, 48, 1, true, -BAY / 2, BAY).rotateZ(-Math.PI / 2), alu)
    cap.position.x = -0.05 + s * (bayW / 2 + ((SL - bayW) / 2 - 0.05) / 2 + 0.025)
    ship.add(cap)
  }
  const box = (w, h, d, mat, x, y) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.015), mat)
    m.position.set(x, y, bayZ - 0.02 - d / 2 + 0.06)
    ship.add(m)
    return m
  }
  box(0.3, 0.26, 0.24, std('#2a2d36', { metalness: 0.4 }), 0.5, 0.02) // the cameras
  box(0.14, 0.32, 0.18, whiteMat, 0.22, -0.02) // the laser altimeter
  box(0.26, 0.22, 0.2, goldMat, -0.06, 0.05) // the X-ray spectrometer
  const aps = box(0.2, 0.17, 0.18, apsMat, -0.32, 0.06) // the alpha-particle spectrometer
  const gamma = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.34, 16), whiteMat) // the gamma-ray spectrometer's canister
  gamma.position.set(-0.6, 0, bayZ - 0.12)
  ship.add(gamma)
  // aft bulkhead, the engine bell, the command module, the docking probe
  const aft = new THREE.Mesh(new THREE.CircleGeometry(SR, 48), alu)
  aft.rotation.y = -Math.PI / 2
  aft.position.x = -SL / 2
  ship.add(aft)
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.42, 0.95, 32, 1, true).rotateZ(Math.PI / 2), darkMat)
  bell.position.x = -SL / 2 - 0.47
  ship.add(bell)
  const cm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, SR, 1.08, 48).rotateZ(-Math.PI / 2), cmMat)
  cm.position.x = SL / 2 + 0.54
  ship.add(cm)
  const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.26, 10).rotateZ(-Math.PI / 2), darkMat)
  probe.position.x = SL / 2 + 1.2
  ship.add(probe)
  // the reaction-control thrusters: four little blocks round the front
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2 + 0.6
    const q = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.06, 0.16, 2, 0.01), alu)
    q.position.set(SL / 2 - 0.35, Math.sin(a) * (SR + 0.03), Math.cos(a) * (SR + 0.03))
    q.rotation.x = -a
    ship.add(q)
  }
  // (no high-gain antenna: its four small dishes, seen from below, read as loose balls under the ship)
  // the ship to tap (the gold box above all): a hit shape round the hull
  hitShape(new THREE.CylinderGeometry(0.85, 0.85, 3.6, 12).rotateZ(Math.PI / 2), ship, 0.1, 0, 0)
  // a soft ring of light under it (it hangs on nothing, like the picture's)
  const hoverGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: LILAC, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending }))
  hoverGlow.scale.set(3.6, 1.2, 1)
  hoverGlow.position.set(0, 3.0, -0.35)
  hoverGlow.raycast = () => {}
  orb.add(hoverGlow)
  // the counter's cone, down over the crater
  const cone = coneMesh({ len: 30, r: 9, color: LILAC })
  root.add(cone)
  const apsWorld = new THREE.Vector3()
  const coneDir = new THREE.Vector3()
  const down = new THREE.Vector3(0, -1, 0)
  // signs
  const shipSign = label(E.orbiter.signs.ship, 0.15)
  shipSign.position.set(1.7, 5.2, -0.35)
  orb.add(shipSign)
  const apsSign = label(E.orbiter.signs.aps, 0.12, { color: '#ffe3a0' })
  apsSign.position.set(-1.25, 3.2, 0.1)
  orb.add(apsSign)
  facing.push(shipSign, apsSign)

  // the map board below it
  const MAPV = { lon0: -100, lon1: 100, lat0: -32, lat1: 40 }
  const baseMap = canvasTex(1024, 368, (g, w, h) => paintMoonMap(g, w, h, { ...MAPV, seed: 11, tone: 0.95 }), { mipmaps: false })
  textures.push(baseMap)
  const boardTex = canvasTex(1280, 900, null)
  textures.push(boardTex)
  const board = new THREE.Group()
  board.position.set(0, 1.62, 0)
  board.rotation.x = -0.12
  orb.add(board)
  board.add(new THREE.Mesh(new RoundedBoxGeometry(2.66, 1.9, 0.07, 2, 0.03), std(LILAC, { emissive: LILAC, emissiveIntensity: 0.7 })))
  const boardFace = new THREE.Mesh(new THREE.PlaneGeometry(2.56, 1.8), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }))
  boardFace.position.z = 0.04
  board.add(boardFace)
  const postMat = std('#3a3c4a', { metalness: 0.5 })
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.6, 8), postMat)
    leg.position.set(s * 1.1, -0.85, -0.06)
    board.add(leg)
  }
  solids.push(circle(BOARD.x, BOARD.z, 1.3))
  // Apollo's findings on the map (Gorenstein, Golub and Bjorkholm 1973 and 1974): radon over Aristarchus; polonium-210
  // along the edges of the maria they flew over, and at Grimaldi
  const PO_EDGES = ['Fecunditatis', 'Crisium', 'Smythii', 'Tranquillitatis', 'Nubium', 'Cognitum', 'Procellarum']
  const O = { scans: 0, years: 0, start: -1e9 }
  let yearsTried = false
  const SCAN = 6.5
  const scanAge = () => clamp((now() - O.start) / 1000, 0, SCAN)
  let mapKey = ''
  function drawBoard(lv, reveal, sweep) {
    const sci = lv === 'scientist'
    const B = E.orbiter.board
    const days = daysAt(O.years)
    const rn = rnActivity(days)
    const po = poActivity(days) / PO_PEAK
    boardTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#ffffff'
      g.font = '700 46px Outfit'
      g.textAlign = 'left'
      g.fillText(at(B.head, lv), 40, 62)
      // the map
      const mx = 40
      const my = 88
      const mw = w - 80
      const mh = Math.round(mw * (368 / 1024))
      g.fillStyle = '#141b3e'
      g.fillRect(mx, my, mw, mh)
      const cut = mx + mw * clamp(reveal)
      g.save()
      g.beginPath()
      g.rect(mx, my, cut - mx, mh)
      g.clip()
      g.drawImage(baseMap.image, mx, my, mw, mh)
      const X = lon => mx + ((lon - MAPV.lon0) / (MAPV.lon1 - MAPV.lon0)) * mw
      const Y = lat => my + ((MAPV.lat1 - lat) / (MAPV.lat1 - MAPV.lat0)) * mh
      const blob = (x, y, r, col, a) => {
        const grd = g.createRadialGradient(x, y, 0, x, y, r)
        grd.addColorStop(0, col + Math.round(a * 255).toString(16).padStart(2, '0'))
        grd.addColorStop(1, col + '00')
        g.fillStyle = grd
        g.beginPath()
        g.arc(x, y, r, 0, TAU)
        g.fill()
      }
      g.globalCompositeOperation = 'lighter'
      // polonium-210 (amber) round the edges of the dark seas, and at Grimaldi
      const rndB = random(77)
      for (const name of PO_EDGES) {
        for (const m of MARIA.filter(q => q.name === name).slice(0, 2)) {
          const cos = Math.max(0.3, Math.cos((m.lat * Math.PI) / 180))
          for (let i = 0; i < 7; i++) {
            const a = rndB() * TAU
            const lon = m.lon + (Math.cos(a) * m.b) / cos
            const lat = m.lat + Math.sin(a) * m.a
            if (lon < MAPV.lon0 || lon > MAPV.lon1) continue
            blob(X(lon), Y(lat), 18 + rndB() * 10, '#ffb347', 0.55)
          }
        }
      }
      const gr = CRATERS.Grimaldi
      blob(X(gr.lon), Y(gr.lat), 34, '#ffb347', 0.75)
      // radon (teal) over Aristarchus
      const ar = CRATERS.Aristarchus
      blob(X(ar.lon), Y(ar.lat), 52, '#3cc3d6', 0.95)
      blob(X(ar.lon), Y(ar.lat), 22, '#6ff0ff', 0.9)
      g.globalCompositeOperation = 'source-over'
      g.font = '700 26px Nunito'
      g.fillStyle = '#ffffff'
      g.strokeStyle = 'rgba(5,8,26,0.85)'
      g.lineWidth = 5
      const tag = (txt, x, y) => {
        g.strokeText(txt, x, y)
        g.fillText(txt, x, y)
      }
      tag(B.aristarchus, X(ar.lon) + 30, Y(ar.lat) - 22)
      if (sci) {
        tag('Grimaldi', X(gr.lon) - 50, Y(gr.lat) + 50)
        tag('Kepler', X(CRATERS.Kepler.lon) + 14, Y(CRATERS.Kepler.lat) + 30)
      }
      g.restore()
      // the sweep: a bright line where the counter is looking now
      if (sweep >= 0 && sweep <= 1) {
        const sx = mx + mw * sweep
        const grd = g.createLinearGradient(sx - 60, 0, sx + 6, 0)
        grd.addColorStop(0, 'rgba(179,157,255,0)')
        grd.addColorStop(1, 'rgba(179,157,255,0.8)')
        g.fillStyle = grd
        g.fillRect(sx - 60, my, 66, mh)
      }
      if (reveal <= 0.001) {
        g.fillStyle = '#7f8bc0'
        g.font = '600 34px Nunito'
        g.textAlign = 'center'
        g.fillText(B.unseen, mx + mw / 2, my + mh / 2 + 12)
        g.textAlign = 'left'
      }
      g.strokeStyle = 'rgba(159,178,232,0.5)'
      g.lineWidth = 2
      g.strokeRect(mx, my, mw, mh)
      // the legend
      const ly = my + mh + 44
      const dot = (x, y, col) => {
        blob(x, y, 16, col, 1)
      }
      g.font = '600 28px Nunito'
      // (a long legend, in some languages, is made smaller to keep to its half)
      const legend = (txt, x) => {
        let size = 28
        g.font = `600 ${size}px Nunito`
        while (size > 18 && g.measureText(txt).width > mw / 2 - 56) g.font = `600 ${(size -= 2)}px Nunito`
        g.fillStyle = '#d2dbff'
        g.fillText(txt, x, ly)
      }
      dot(mx + 14, ly - 9, '#3cc3d6')
      legend(at(B.legendRn, lv), mx + 36)
      dot(mx + mw / 2 + 14, ly - 9, '#ffb347')
      legend(at(B.legendPo, lv), mx + mw / 2 + 36)
      // the years strip: a puff at the crater below, after so long
      const sy = ly + 30
      g.fillStyle = '#16204a'
      g.fillRect(mx, sy, mw, h - sy - 24)
      g.fillStyle = '#ffffff'
      g.font = '700 32px Outfit'
      g.fillText(fill(at(B.after, lv), { t: timeText(days) }), mx + 20, sy + 44)
      if (!sci) {
        const bar = (y, name, v, col) => {
          g.fillStyle = '#c4d1f5'
          g.font = '600 28px Nunito'
          g.fillText(name, mx + 20, y + 26)
          g.fillStyle = '#0b1230'
          g.fillRect(mx + 330, y, mw - 370, 34)
          g.fillStyle = col
          g.fillRect(mx + 330, y, (mw - 370) * clamp(v), 34)
        }
        bar(sy + 70, B.rn, rn, '#3cc3d6')
        bar(sy + 122, B.po, po, '#ffb347')
      } else {
        // the two curves against time (log), each scaled to its own peak, and where the slider is
        const px = mx + 20
        const pw = mw - 40
        const py = sy + 66
        const ph = h - py - 50
        g.strokeStyle = 'rgba(159,178,232,0.35)'
        g.lineWidth = 2
        g.strokeRect(px, py, pw, ph)
        const T0 = Math.log(0.1)
        const T1 = Math.log(36525)
        const XT = d => px + ((Math.log(d) - T0) / (T1 - T0)) * pw
        g.font = '600 22px Nunito'
        g.fillStyle = '#9fb2e8'
        B.ticks.forEach((txt, i) => {
          const x = XT([1, 7, 30.44, 365.25, 3652.5, 36525][i])
          g.fillRect(x, py + ph - 8, 2, 8)
          g.textAlign = i === B.ticks.length - 1 ? 'right' : 'center'
          g.fillText(txt, x, py + ph + 26)
        })
        g.textAlign = 'left'
        const curve = (fn, col) => {
          g.strokeStyle = col
          g.lineWidth = 4
          g.beginPath()
          for (let i = 0; i <= 200; i++) {
            const d = Math.exp(T0 + ((T1 - T0) * i) / 200)
            const x = px + (pw * i) / 200
            const y = py + ph - 6 - (ph - 12) * fn(d)
            if (i) g.lineTo(x, y)
            else g.moveTo(x, y)
          }
          g.stroke()
        }
        curve(rnActivity, '#3cc3d6')
        curve(d => poActivity(d) / PO_PEAK, '#ffb347')
        const cx = XT(days)
        g.fillStyle = '#ffffff'
        g.fillRect(cx - 1.5, py, 3, ph)
        g.font = '600 22px Nunito'
        g.fillStyle = '#3cc3d6'
        g.fillText(B.rnShort, px + 10, py + 26)
        g.fillStyle = '#ffb347'
        g.fillText(B.poShort, px + pw - 360, py + 26)
      }
    })
  }
  function timeText(d) {
    const U = E.units
    if (d < 1) return plural(U.hour, Math.max(1, Math.round(d * 24)), lang)
    if (d < 60) return plural(U.day, Math.round(d), lang)
    if (d < 730) return plural(U.month, Math.round(d / 30.44), lang)
    return plural(U.year, Math.round(d / 365.25), lang)
  }
  function scan(mine = true) {
    O.scans++
    O.start = now()
    play('beam')
    if (mine) {
      say(at(O.scans === 1 ? E.orbiter.says.scan : E.orbiter.says.again, level()))
      ex.discover('orbiter', orbiterPanel, SCAN + 0.3)
      share('orbiter')
    }
  }
  let yearsSaid = -1
  function setYears(v, now_ = false) {
    const n = clamp(Math.round(Number(v) || 0), 0, 100)
    if (n === O.years) return
    O.years = n
    yearsTried = true
    if (now_) share('orbiter')
    else throttled('orbiter')
    ex.discover('orbiter', orbiterPanel, 1)
    const d = daysAt(n)
    const band = d < 20 ? 0 : d < 3650 ? 1 : 2
    if (band !== yearsSaid) {
      yearsSaid = band
      say(at([E.orbiter.says.days, E.orbiter.says.years, E.orbiter.says.decades][band], level()))
    }
  }
  const orbiterPanel = lv => ({
    title: E.orbiter.title,
    color: LILAC,
    blocks: [
      { buttons: [{ label: E.orbiter.buttons.scan, onClick: () => scan() }] },
      { slider: { label: E.orbiter.slider, min: 0, max: 100, step: 1, value: O.years, onInput: v => setYears(v), format: v => timeText(daysAt(v)), live: () => O.years } },
      ...E.orbiter.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(ship, () => scan(), { reach: 8 })
  // the board opens the panel (the time slider)
  clickable(board, () => ctx.showPanel(orbiterPanel), { reach: 6 })
  ex.add({
    id: 'orbiter',
    x: SPOT_O.x,
    z: SPOT_O.z,
    radius: 2.5,
    manual: true,
    label: E.orbiter.label,
    verb: () => {
      const H = E.orbiter.hints
      if (!O.scans) return H.tap
      if (!yearsTried) return H.years
      return H.again
    },
    focus: { x: BOARD.x, y: gB + 2.7, z: BOARD.z, size: 4.9, width: 4.4 },
    act: () => ctx.showPanel(orbiterPanel),
  })
  // the crater below: radon's teal haze over its floor, polonium's amber stain on it (the years slider)
  const floorY = groundAt(0, -31.5 - R) // the crater's middle (the peak); the floor is a little lower round it
  const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: HALO, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
  haze.position.set(6, floorY + 2, -31.5 - R - 6)
  haze.scale.set(95, 38, 1)
  haze.raycast = () => {}
  root.add(haze)
  const hazeCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: TEAL, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }))
  hazeCore.position.copy(haze.position).add(new THREE.Vector3(0, -3, 0))
  hazeCore.scale.set(46, 18, 1)
  hazeCore.raycast = () => {}
  root.add(hazeCore)
  const stainTex = canvasTex(256, 256, (g, w) => {
    const rnd = random(9)
    g.clearRect(0, 0, w, w)
    for (let i = 0; i < 60; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * w * 0.36
      const x = w / 2 + Math.cos(a) * r
      const y = w / 2 + Math.sin(a) * r
      const s = 10 + rnd() * 34
      const grd = g.createRadialGradient(x, y, 0, x, y, s)
      grd.addColorStop(0, 'rgba(255,179,71,0.5)')
      grd.addColorStop(1, 'rgba(255,179,71,0)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(x, y, s, 0, TAU)
      g.fill()
    }
  })
  textures.push(stainTex)
  const stainMat = new THREE.MeshBasicMaterial({ map: stainTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  // the stain follows the floor: a grid draped on it
  const stainGeo = new THREE.PlaneGeometry(64, 64, 32, 32).rotateX(-Math.PI / 2)
  {
    const p = stainGeo.attributes.position
    const cx = 4
    const cz = -31.5 - R - 4
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + cx
      const z = p.getZ(i) + cz
      p.setXYZ(i, x, groundAt(x, z) + 0.4, z)
    }
    stainGeo.computeVertexNormals()
  }
  const stain = new THREE.Mesh(stainGeo, stainMat)
  stain.raycast = () => {}
  root.add(stain)

  updates.push((dt, t) => {
    const lv = level()
    const age = scanAge()
    const scanning = O.scans > 0 && age < SCAN
    const reveal = O.scans > 1 ? 1 : O.scans === 1 ? clamp(age / (SCAN - 0.5)) : 0
    const sweep = scanning ? clamp(age / (SCAN - 0.5)) : -1
    const key = `${lv}|${Math.round(reveal * 60)}|${Math.round(sweep * 60)}|${O.years}`
    if (key !== mapKey) {
      mapKey = key
      drawBoard(lv, reveal, sweep)
    }
    // the cone: faint while idle, bright and sweeping during a scan
    aps.getWorldPosition(apsWorld)
    cone.position.copy(apsWorld)
    const sw = scanning ? Math.sin((age / SCAN) * TAU * 1.5) : Math.sin(t * 0.25) * 0.15
    coneDir.set(-0.35 + sw * 0.7, -1, -1.25).normalize()
    cone.quaternion.setFromUnitVectors(down, coneDir)
    const k = scanning ? 1 : 0.35
    cone.userData.mat.uniforms.uK.value = damp(cone.userData.mat.uniforms.uK.value, k, 3, dt)
    cone.userData.mat.uniforms.uTime.value = t
    apsMat.emissiveIntensity = O.scans ? 0.35 + (scanning ? 0.5 + 0.4 * Math.sin(t * 9) : 0) : 0.35 + 0.35 * Math.sin(t * 3)
    // the ship drifts a little, as if in orbit
    lift.position.y = 4.15 + Math.sin(t * 0.6) * 0.05
    lift.rotation.z = 0.08 + Math.sin(t * 0.4) * 0.02
    // the crater's radon and polonium for the years slider
    const days = daysAt(O.years)
    const rn = rnActivity(days)
    const po = poActivity(days) / PO_PEAK
    haze.material.opacity = 0.42 * rn
    hazeCore.material.opacity = 0.36 * rn
    stainMat.opacity = damp(stainMat.opacity, 0.95 * po, 4, dt)
  })

  // =========================================================================================================
  // 3. LUNAR PROSPECTOR: the drum with its three booms, spinning, and the globe it mapped
  // =========================================================================================================
  const lpG = new THREE.Group()
  const gL = groundAt(LP.x, LP.z)
  lpG.position.set(LP.x, gL, LP.z)
  root.add(lpG)
  const pedMat = std('#4a4c5a', { metalness: 0.4, roughness: 0.5 })
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.5, 2.3, 24), pedMat)
  ped.position.y = 0.98
  lpG.add(ped)
  const pedFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.18, 32), pedMat)
  pedFoot.position.y = 0.0
  lpG.add(pedFoot)
  solids.push(circle(LP.x, LP.z, 0.75))
  const spin = new THREE.Group()
  spin.position.y = 2.75
  lpG.add(spin)
  // the drum (1.36 m across, 1.28 m high), solar cells round it
  const cellTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#1a2148'
    g.fillRect(0, 0, w, h)
    for (let j = 0; j < 14; j++) {
      for (let i = 0; i < 48; i++) {
        const k = 26 + ((i * 7 + j * 5) % 7) * 3
        g.fillStyle = `rgb(${k},${k + 18},${k + 80})`
        g.fillRect((i * w) / 48 + 1, (j * h) / 14 + 1, w / 48 - 2, h / 14 - 2)
      }
    }
    g.fillStyle = '#c9ccd6'
    g.fillRect(0, h * 0.47, w, h * 0.06)
  }, { repeat: true })
  textures.push(cellTex)
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.28, 48), [std('#ffffff', { map: cellTex, roughness: 0.35, metalness: 0.4 }), std('#b8bcc8', { metalness: 0.6, roughness: 0.4 }), std('#8c90a0', { metalness: 0.6, roughness: 0.4 })])
  spin.add(drum)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.6, 8), std('#d8dbe2', { metalness: 0.6 }))
  mast.position.y = 0.94
  spin.add(mast)
  const omni = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12), whiteMat)
  omni.position.y = 1.3
  spin.add(omni)
  // three booms, 2.5 m, with the instruments at their tips
  const boomMat = std('#e8e2c8', { metalness: 0.3, roughness: 0.5 })
  let apsCube = null
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU
    const arm = new THREE.Group()
    arm.rotation.y = a
    spin.add(arm)
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.5, 6).rotateZ(Math.PI / 2), boomMat)
    b.position.x = 0.68 + 1.25
    arm.add(b)
    const tip = new THREE.Group()
    tip.position.x = 0.68 + 2.5
    arm.add(tip)
    if (i === 0) {
      // the gamma-ray spectrometer
      const grs = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.42, 16), whiteMat)
      tip.add(grs)
    } else if (i === 1) {
      // the alpha-particle spectrometer, a cube of about 18 cm, with the neutron spectrometer's two tubes
      apsCube = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.2, 0.2, 2, 0.02), apsMat)
      tip.add(apsCube)
      for (const s of [-1, 1]) {
        const ns = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 10).rotateX(Math.PI / 2), whiteMat)
        ns.position.set(0.02, -0.15, s * 0.06)
        tip.add(ns)
      }
    } else {
      // the electron reflectometer, and the magnetometer on its extension
      tip.add(new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.12, 0.12, 2, 0.015), std('#c8a64a', { metalness: 0.6 })))
      const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.14, 6).rotateZ(Math.PI / 2), boomMat)
      ext.position.x = 0.57
      tip.add(ext)
      const mag = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.1, 0.1, 2, 0.01), whiteMat)
      mag.position.x = 1.16
      tip.add(mag)
    }
  }
  hitShape(new THREE.CylinderGeometry(1.0, 1.0, 1.8, 12), spin, 0, 0.1, 0)
  const lpSign = label(E.prospector.signs.lp, 0.12)
  {
    // in front of the pedestal, under the sweep of the booms
    const d = Math.hypot(SPOT_P.x - LP.x, SPOT_P.z - LP.z)
    lpSign.position.set(((SPOT_P.x - LP.x) / d) * 0.75, 1.5, ((SPOT_P.z - LP.z) / d) * 0.75)
  }
  lpG.add(lpSign)
  facing.push(lpSign)

  // the globe: the whole Moon, and LP's map laid on it cycle by cycle
  const glG = new THREE.Group()
  const gG = groundAt(GLOBE.x, GLOBE.z)
  glG.position.set(GLOBE.x, gG, GLOBE.z)
  root.add(glG)
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.3, 0.9, 16), pedMat)
  stand.position.y = 0.45
  glG.add(stand)
  solids.push(circle(GLOBE.x, GLOBE.z, 0.45))
  const globeTex = canvasTex(1024, 512, null)
  textures.push(globeTex)
  const moonBase = canvasTex(1024, 512, (g, w, h) => paintMoonMap(g, w, h, { seed: 5 }), { mipmaps: false })
  textures.push(moonBase)
  const GR = 0.62
  const globe = new THREE.Mesh(new THREE.SphereGeometry(GR, 64, 32), std('#ffffff', { map: globeTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: globeTex, emissiveIntensity: 0.5 }))
  const tiltG = new THREE.Group()
  tiltG.position.y = 1.55
  glG.add(tiltG)
  tiltG.add(globe)
  // LP's polar orbit round it, and LP as a bright dot on it
  const ringOrbit = new THREE.Mesh(new THREE.TorusGeometry(GR * 1.3, 0.008, 6, 120), new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.7 }))
  tiltG.add(ringOrbit)
  const lpDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffe9a6' }))
  tiltG.add(lpDot)
  const globeSign = label('', 0.12)
  globeSign.position.set(0, 2.45, 0)
  glG.add(globeSign)
  facing.push(globeSign)
  // the globe's rest: Aristarchus and Kepler turned to the visitor's spot
  const toSpot = Math.atan2(SPOT_P.x - GLOBE.x, SPOT_P.z - GLOBE.z)
  const L0 = -42
  const restY = toSpot - Math.atan2(Math.cos((L0 * Math.PI) / 180), -Math.sin((L0 * Math.PI) / 180))
  ringOrbit.rotation.y = toSpot + Math.PI / 2 - 0.5
  tiltG.rotation.x = -0.25
  // what LP's counter found (Lawson et al. 2005): radon (teal) at Aristarchus and Kepler; polonium-210 (amber) in
  // about thirteen boxes, Aristarchus among them, most at the edges of the maria (Imbrium twice, Serenitatis),
  // a few on the far side's east; the boxes 15 degrees wide and 10 high, as the team's maps
  const BOX_W = 15
  const BOX_H = 10
  const NBX = 360 / BOX_W
  const NBY = 180 / BOX_H
  const boxOf = (lat, lon) => [Math.floor((lon + 180) / BOX_W), Math.floor((90 - lat) / BOX_H)]
  const SIG_RN = new Map([[boxOf(23.7, -47.4).join(), 1.0], [boxOf(8.1, -38).join(), 0.8]])
  const SIG_PO = new Map([
    [boxOf(23.7, -47.4).join(), 0.75],
    ...[[44, -30], [43, 0], [35, 25], [24, 52], [12, 44], [-5, 45], [-18, 25], [-28, -33], [3, -62], [16, 112], [-24, 128], [38, 62]].map(([la, lo]) => [boxOf(la, lo).join(), 0.85]),
  ])
  const P = { cycles: 0, start: -1e9 }
  const CYCLE = 5.5
  const cycleAge = () => clamp((now() - P.start) / 1000, 0, CYCLE)
  const stormy = c => c % 3 === 2
  const goodCount = c => c - Math.floor((c + 1) / 3)
  const gauss = rnd => Math.sqrt(-2 * Math.log(1 - rnd() * 0.9999)) * Math.cos(TAU * rnd())
  const SIGMA = 0.5
  function estimates(cycles, withStorm) {
    const rn = new Float32Array(NBX * NBY)
    const po = new Float32Array(NBX * NBY)
    let n = 0
    for (let c = 1; c <= cycles; c++) {
      if (stormy(c) && !(withStorm && c === cycles)) continue
      n++
      const rnd = random(5000 + c * 31)
      const s = stormy(c) ? SIGMA * 2.5 : SIGMA
      for (let i = 0; i < NBX * NBY; i++) {
        rn[i] += gauss(rnd) * s
        po[i] += gauss(rnd) * s
      }
    }
    if (n) {
      for (let j = 0; j < NBY; j++) {
        for (let i = 0; i < NBX; i++) {
          const k = j * NBX + i
          rn[k] = rn[k] / n + (SIG_RN.get(`${i},${j}`) ?? 0)
          po[k] = po[k] / n + (SIG_PO.get(`${i},${j}`) ?? 0)
        }
      }
    }
    return { rn, po, n }
  }
  let globeKey = ''
  function drawGlobe(lv, showStorm) {
    const { rn, po, n } = estimates(P.cycles, showStorm)
    const good = goodCount(P.cycles)
    globeTex.userData.redraw((g, w, h) => {
      g.drawImage(moonBase.image, 0, 0, w, h)
      if (!n) return
      const bw = (w * BOX_W) / 360
      const bh = (h * BOX_H) / 180
      g.globalCompositeOperation = 'lighter'
      const blob = (i, j, v, col) => {
        const a = clamp((v - 0.45) / 0.45)
        if (a <= 0.01) return
        const x = (i + 0.5) * bw
        const y = (j + 0.5) * bh
        const grd = g.createRadialGradient(x, y, 0, x, y, bw * 0.75)
        grd.addColorStop(0, col + Math.round(a * 230).toString(16).padStart(2, '0'))
        grd.addColorStop(1, col + '00')
        g.fillStyle = grd
        g.fillRect(x - bw, y - bw, bw * 2, bw * 2)
      }
      for (let j = 0; j < NBY; j++) {
        for (let i = 0; i < NBX; i++) {
          blob(i, j, po[j * NBX + i], '#ffb347')
          blob(i, j, rn[j * NBX + i], '#3cc3d6')
        }
      }
      g.globalCompositeOperation = 'source-over'
      // the names, once the spots stand out
      if (good >= 3 && !showStorm) {
        g.font = '700 22px Nunito'
        g.fillStyle = '#ffffff'
        g.strokeStyle = 'rgba(5,8,26,0.9)'
        g.lineWidth = 5
        const tag = (txt, lat, lon, dx, dy) => {
          const x = ((lon + 180) / 360) * w + dx
          const y = ((90 - lat) / 180) * h + dy
          g.strokeText(txt, x, y)
          g.fillText(txt, x, y)
        }
        tag('Aristarchus', 23.7, -47.4, -150, -14)
        tag('Kepler', 8.1, -38, 14, 34)
      }
      if (lv === 'scientist') {
        g.strokeStyle = 'rgba(255,255,255,0.12)'
        g.lineWidth = 1
        for (let i = 0; i <= NBX; i++) {
          g.beginPath()
          g.moveTo(i * bw, 0)
          g.lineTo(i * bw, h)
          g.stroke()
        }
        for (let j = 0; j <= NBY; j++) {
          g.beginPath()
          g.moveTo(0, j * bh)
          g.lineTo(w, j * bh)
          g.stroke()
        }
      }
    })
  }
  function cycle(mine = true) {
    P.cycles++
    P.start = now()
    play('beep')
    if (mine) {
      const good = goodCount(P.cycles)
      const S = E.prospector.says
      say(at(stormy(P.cycles) ? S.storm : P.cycles === 1 ? S.first : good >= 4 ? S.clear : S.more, level()))
      ex.discover('prospector', prospectorPanel, CYCLE + 0.3)
      share('prospector')
    }
  }
  const prospectorPanel = lv => ({
    title: E.prospector.title,
    color: '#ffd166',
    blocks: [
      { buttons: [{ label: E.prospector.buttons.cycle, onClick: () => cycle() }] },
      ...E.prospector.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(spin, () => cycle(), { reach: 7 })
  clickable(glG, () => cycle(), { reach: 6 })
  ex.add({
    id: 'prospector',
    x: SPOT_P.x,
    z: SPOT_P.z,
    radius: 2.4,
    manual: true,
    label: E.prospector.label,
    verb: () => {
      const H = E.prospector.hints
      if (!P.cycles) return H.tap
      return goodCount(P.cycles) < 4 ? H.more : H.again
    },
    focus: { x: (LP.x + GLOBE.x) / 2 + 0.2, y: gL + 2.0, z: (LP.z + GLOBE.z) / 2, size: 5.6, width: 6.0 },
    act: () => ctx.showPanel(prospectorPanel),
  })
  let spinA = 0
  updates.push((dt, t) => {
    const lv = level()
    // 12 turns a minute, as it spun while it mapped
    spinA += dt * TAU * 0.2
    spin.rotation.y = spinA
    const age = cycleAge()
    const busy = P.cycles > 0 && age < CYCLE
    const storm = busy && stormy(P.cycles)
    // a cycle: the globe turns once under the orbit (two weeks), LP going round and round it
    const turn = busy ? ease(age / CYCLE) * TAU : 0
    globe.rotation.y = restY + turn
    const u = busy ? (age / CYCLE) * 9 : t * 0.08
    lpDot.position.set(0, Math.cos(u * TAU) * GR * 1.3, Math.sin(u * TAU) * GR * 1.3).applyAxisAngle(new THREE.Vector3(0, 1, 0), ringOrbit.rotation.y - Math.PI / 2)
    lpDot.visible = true
    const key = `${lv}|${P.cycles}|${storm}`
    if (key !== globeKey) {
      globeKey = key
      drawGlobe(lv, storm)
    }
    const good = goodCount(P.cycles)
    const RD_ = E.prospector.readout
    setText(globeSign, storm ? RD_.storm : P.cycles ? `${fill(RD_.cycles, { n: good })}\n${fill(RD_.weeks, { t: plural(E.units.week, good * 2, lang) })}` : RD_.none)
    apsCube.material.emissiveIntensity = busy && !storm ? 0.6 + 0.4 * Math.sin(t * 8) : 0.3
  })

  // the labels face the camera
  updates.push(() => {
    for (const s of facing) faceCamera(s, ctx.camera)
  })
  // the stage's own clock (the Earth turns)
  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    floor: groundAt,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, minY: -2.4, maxZ: 7.9 },
    cameraPitchMax: 0.7,
    spawn: { x: 0, z: 5.5, yaw: 0 },
    hostSpot: { x: -1.9, z: 3.7, yaw: Math.atan2(-1.9, -1.8) },
    back: { x: 0, z: 8.4, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(-STAND.x, 6.5 - STAND.z) },
    parts: {
      vent: {
        tap: () => puff(),
        setAir: v => setAir(v, true),
        get state() { return { air: V.air, n: V.n, puffs: V.puffs.map(p => ({ id: p.id, air: p.air, age: ageOf(p) })) } },
        // how many are hopping, broken, lying as dots now
        get counts() {
          let hop = 0
          let dots = 0
          for (const p of V.puffs) {
            const age = ageOf(p)
            for (const a of simulate(p.id, p.air).atoms) {
              if (age < a.T) hop++
              else if (a.dot && age >= a.landAt) dots++
            }
          }
          return { hop, dots }
        },
        // jump a puff's clock forward (for looking at it)
        seek: secs => V.puffs.forEach(p => (p.start = now() - secs * 1000)),
        crackAt: () => new THREE.Vector3(VC.x, groundAt(VC.x, VC.z) + 0.1, VC.z),
      },
      orbiter: {
        tap: () => scan(),
        setYears: v => setYears(v, true),
        get state() { return { ...O, age: scanAge() } },
        seek: secs => (O.start = now() - secs * 1000),
        apsAt: () => aps.getWorldPosition(new THREE.Vector3()),
      },
      prospector: {
        tap: () => cycle(),
        get state() { return { cycles: P.cycles, good: goodCount(P.cycles), age: cycleAge() } },
        seek: secs => (P.start = now() - secs * 1000),
        lpAt: () => drum.getWorldPosition(new THREE.Vector3()),
        globeAt: () => globe.getWorldPosition(new THREE.Vector3()),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { vent: ventPanel, orbiter: orbiterPanel, prospector: prospectorPanel },
    shared: {
      vent: {
        // n: the puffs so far (the probe compares a count exactly); each puff's age, its atoms worked out from it
        get: () => ({ air: V.air, n: V.n, puffs: V.puffs.map(p => ({ id: p.id, air: p.air, age: Math.round(ageOf(p) * 10) / 10 })) }),
        set: (s, liveSet, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (liveSet && n > V.n) play('tap')
          V.n = n
          V.air = clamp(Math.round((Number(s?.air) || 0) / 5) * 5, 0, 100)
          const t0 = now()
          const list = Array.isArray(s?.puffs) ? s.puffs.slice(-KEEP) : []
          V.puffs = list
            .map(p => {
              const id = Math.max(1, Math.round(Number(p?.id) || 0))
              const air = clamp(Math.round((Number(p?.air) || 0) / 5) * 5, 0, 100)
              const mine = V.puffs.find(q => q.id === id && q.air === air)
              const age = clamp(Number(p?.age) || 0, 0, LIFE) + (Number(ago) || 0)
              return { id, air, start: mine ? mine.start : t0 - Math.min(LIFE, age) * 1000 }
            })
            .filter(p => p.id <= V.n)
          lastPuffAir = V.puffs.length ? V.puffs[V.puffs.length - 1].air : -1
        },
      },
      orbiter: {
        get: () => ({ scans: O.scans, years: O.years, age: Math.round(scanAge() * 10) / 10 }),
        set: (s, liveSet, ago = 0) => {
          const scans = Math.max(0, Math.round(Number(s?.scans) || 0))
          const age = clamp(Number(s?.age) || 0, 0, SCAN) + (Number(ago) || 0)
          if (liveSet && scans > O.scans) {
            O.start = now() - (Number(ago) || 0) * 1000
            play('beam')
          } else if (scans !== O.scans) O.start = now() - Math.min(SCAN, age) * 1000
          O.scans = scans
          O.years = clamp(Math.round(Number(s?.years) || 0), 0, 100)
        },
      },
      prospector: {
        get: () => ({ cycles: P.cycles, age: Math.round(cycleAge() * 10) / 10 }),
        set: (s, liveSet, ago = 0) => {
          const cycles = Math.max(0, Math.round(Number(s?.cycles) || 0))
          const age = clamp(Number(s?.age) || 0, 0, CYCLE) + (Number(ago) || 0)
          if (liveSet && cycles > P.cycles) {
            P.start = now() - (Number(ago) || 0) * 1000
            play('beep')
          } else if (cycles !== P.cycles) P.start = now() - Math.min(CYCLE, age) * 1000
          P.cycles = cycles
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const id of Object.keys(sent)) clearTimeout(sent[id])
      for (const tx of textures) tx.dispose()
    },
  }
}
