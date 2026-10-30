// Silicon's Periodic Videos room: what its film shows (docs/pv/Si.md) as stations. The lump (out of its
// bottle, turning, its grains glinting; sand and a lens beside it), the chip line (cut a wafer, test the
// chips, sort them; then a 30 cm wafer), the wafer and its rainbow (turn it over, tilt it under the lamp),
// the turbocharger (steel and silicon nitride wheels racing), the minerals (quartz, mica, feldspar, garnet).
// In a room all five are shared (`shared` below, src/net/shared.js); the words, the panels and the film stay
// each one's own.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, fill, num, canvasTex, clamp, lerp, random } from '../noble/kit.js'
import { edgeGlass } from '../../common/props.js'
import { makeText } from '../../../engine/text.js'
import { play } from '../../../audio/sound.js'
import { SPOTS } from './lab.js'
import { SI_WORDS } from './Si.words.js'

export const WORDS = SI_WORDS
/** The room's colour: the blue-grey of a polished wafer. */
export const COLOR = '#7fb4ff'

export const chapters = E => [
  { label: E.minerals.title, part: 'sand' },
  { label: E.lump.title, part: 'lump' },
  { label: E.wafer.title, part: 'wafer' },
  { label: E.chips.title, part: 'chips' },
  { label: E.wafer.says.front.kid.replace(/[!.].*$/, ''), part: 'rainbow' },
  { label: E.turbo.title, part: 'turbo' },
]

const ease = v => v * v * (3 - 2 * v)
const put = (root, part, spot, scale = 1) => {
  part.group.scale.setScalar(scale)
  part.group.position.set(spot.x, spot.y, spot.z)
  part.group.rotation.y = spot.face
  root.add(part.group)
}

// a wafer's face: chips in rows, gold-brown, with their pads, on the grey of silicon
function chipFace(rows) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#5d6370'
    g.fillRect(0, 0, w, h)
    const n = rows
    const s = w / n
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = i * s
      const y = j * s
      g.fillStyle = (i + j) % 3 ? '#9c7a3e' : '#a8854a'
      g.fillRect(x + s * 0.06, y + s * 0.06, s * 0.88, s * 0.88)
      g.fillStyle = '#c9b27a'
      for (let k = 1; k < 6; k++) {
        g.fillRect(x + s * 0.1, y + s * (0.08 + k * 0.14), s * 0.06, s * 0.05)
        g.fillRect(x + s * 0.84, y + s * (0.08 + k * 0.14), s * 0.06, s * 0.05)
      }
      g.fillStyle = '#6e5228'
      g.fillRect(x + s * 0.25, y + s * 0.25, s * 0.5, s * 0.5)
    }
  })
}

// ---- the lump: polycrystalline silicon, its grains glinting as it turns ----

const GLINT_VERT = `
attribute float aAlpha;
varying float vAlpha;
uniform float uScale;
void main() {
  vAlpha = aAlpha;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 0.012 * uScale / max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
}`
const GLINT_FRAG = `
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float star = max(0.0, 1.0 - 9.0 * abs(c.x * c.y) - 1.8 * length(c));
  if (star * vAlpha < 0.02) discard;
  gl_FragColor = vec4(vec3(2.2, 2.3, 2.6) * star, star * vAlpha);
}`

function siliconLump() {
  const group = new THREE.Group()
  // the lump: a crusty rock of many facets, grey with a blue sheen
  const geo = new THREE.IcosahedronGeometry(0.055, 2)
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const k = 1 + 0.12 * Math.sin(v.x * 70 + v.y * 23) * Math.cos(v.z * 55 - v.x * 17)
    v.multiplyScalar(k)
    v.x *= 1.35
    v.y *= 0.8
    p.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  const flat = geo.toNonIndexed()
  flat.computeVertexNormals()
  const metal = new THREE.MeshStandardMaterial({ color: '#7d889c', metalness: 0.85, roughness: 0.3, flatShading: true })
  const lump = new THREE.Mesh(flat, metal)
  // glints: one point on each of some faces, bright when that face mirrors the lamp into the eye
  const fp = flat.attributes.position
  const rnd = random(9)
  const pts = []
  const nrm = []
  for (let f = 0; f < fp.count / 3; f++) {
    if (rnd() > 0.35) continue
    const a = new THREE.Vector3().fromBufferAttribute(fp, f * 3)
    const b = new THREE.Vector3().fromBufferAttribute(fp, f * 3 + 1)
    const c = new THREE.Vector3().fromBufferAttribute(fp, f * 3 + 2)
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize()
    const mid = a.add(b).add(c).multiplyScalar(1 / 3).addScaledVector(n, 0.002)
    pts.push(mid.x, mid.y, mid.z)
    nrm.push(n)
  }
  const gg = new THREE.BufferGeometry()
  gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  const alpha = new Float32Array(nrm.length)
  gg.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
  const gm = new THREE.ShaderMaterial({ uniforms: { uScale: { value: 600 } }, vertexShader: GLINT_VERT, fragmentShader: GLINT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const glints = new THREE.Points(gg, gm)
  glints.frustumCulled = false
  const spinner = new THREE.Group()
  spinner.add(lump, glints)
  group.add(spinner)
  // its bottle (it lives in it), a small turntable, a tray of sand with a lens over it
  const glass = edgeGlass({ color: '#dbe6ff', edge: 0.5, base: 0.03 })
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.2, 24, 1, true), glass)
  bottle.position.set(0.02, 0.1, -0.22)
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.04, 16), new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.9 }))
  cork.position.set(0.02, 0.22, -0.22)
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.02, 32), new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.5 }))
  table.position.set(0.04, 0.01, 0.08)
  const sandTex = canvasTex(128, 128, (g, w, h) => {
    const r = random(4)
    g.fillStyle = '#c9b48a'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 2200; i++) {
      g.fillStyle = ['#e2d3ad', '#a8916a', '#f3ead2', '#8d7754'][i % 4]
      g.fillRect(r() * w, r() * h, 1.5, 1.5)
    }
  })
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.2), [new THREE.MeshStandardMaterial({ color: '#3b3f47' }), new THREE.MeshStandardMaterial({ color: '#3b3f47' }), new THREE.MeshStandardMaterial({ map: sandTex, roughness: 0.95 }), new THREE.MeshStandardMaterial({ color: '#3b3f47' }), new THREE.MeshStandardMaterial({ color: '#3b3f47' }), new THREE.MeshStandardMaterial({ color: '#3b3f47' })])
  tray.position.set(0.04, 0.015, 0.42)
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.006, 8, 28), new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.4 }))
  lensRing.rotation.x = -Math.PI / 2 + 0.35
  lensRing.position.set(0.06, 0.1, 0.42)
  const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.048, 28), glass)
  lensGlass.rotation.copy(lensRing.rotation)
  lensGlass.position.copy(lensRing.position)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), new THREE.MeshStandardMaterial({ color: '#222' }))
  handle.position.set(0.06, 0.06, 0.5)
  handle.rotation.x = 0.9
  group.add(bottle, cork, table, tray, lensRing, lensGlass, handle)

  const inBottle = new THREE.Vector3(0.02, 0.06, -0.22)
  const onTable = new THREE.Vector3(0.04, 0.065, 0.08)
  spinner.position.copy(inBottle)
  spinner.scale.setScalar(0.7)
  let state = 'bottle'
  let t = 0
  let spin = 0.25
  let turns = 0 // for the others in a room
  const tmp = new THREE.Vector3()
  const lampWorld = new THREE.Vector3()
  const nmat = new THREE.Matrix3()
  const api = {
    group,
    act() {
      if (state === 'lifting') return false
      if (state === 'bottle') {
        state = 'lifting'
        t = 0
        return 'take'
      }
      spin = 3.2
      turns++
      return 'turn'
    },
    get out() {
      return state !== 'bottle'
    },
    state() {
      return { out: state !== 'bottle', turns }
    },
    /** Someone else took it out or spun it (live: it plays here, returns true); a newcomer finds it on
     *  its turntable. */
    setState({ out = false, turns: n = 0 } = {}, live = false) {
      n = Math.max(0, Math.floor(Number(n) || 0))
      let played = false
      if (out && state === 'bottle') {
        if (live) played = !!api.act()
        else {
          state = 'out'
          spinner.position.copy(onTable)
          spinner.scale.setScalar(1)
        }
      } else if (live && out && n > turns) played = !!api.act()
      turns = n
      return played
    },
    update(dt, time, camera, viewH) {
      t += dt
      if (state === 'lifting') {
        const k = ease(clamp(t / 1.2))
        spinner.position.lerpVectors(inBottle, onTable, k)
        spinner.position.y += Math.sin(k * Math.PI) * 0.2
        spinner.scale.setScalar(lerp(0.7, 1, k))
        if (t >= 1.2) state = 'out'
      }
      spin += (0.35 - spin) * Math.min(1, dt * 0.8)
      if (state !== 'bottle') spinner.rotation.y += spin * dt
      // the glints: a face shines when it mirrors the lamp (the fume cupboard's, above and behind) to the eye
      if (camera) {
        gm.uniforms.uScale.value = viewH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
        lump.updateWorldMatrix(true, false)
        nmat.getNormalMatrix(lump.matrixWorld)
        group.localToWorld(lampWorld.set(-0.2, 1.4, 0.1))
        const c = new THREE.Vector3().setFromMatrixPosition(lump.matrixWorld)
        const l = lampWorld.clone().sub(c).normalize()
        const e = camera.position.clone().sub(c).normalize()
        const hv = l.add(e).normalize()
        for (let i = 0; i < nrm.length; i++) {
          tmp.copy(nrm[i]).applyMatrix3(nmat).normalize()
          const d = Math.max(0, tmp.dot(hv))
          alpha[i] = state === 'bottle' ? 0 : Math.pow(d, 40) * 1.4
        }
        gg.attributes.aAlpha.needsUpdate = true
      }
    },
  }
  return api
}

// ---- the chip line: cut a wafer, test its chips, sort them ----

function chipLine({ onStep }) {
  const group = new THREE.Group()
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.04, 0.5, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.5 }))
  plinth.position.y = 0.02
  group.add(plinth)
  // the computer the good chips go into, the bin for the others
  const pc = new THREE.Group()
  const tower = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.34, 0.3, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#d9dce2', roughness: 0.5 }))
  tower.position.y = 0.17
  const screenTex = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = '#0d1a3a'
    g.fillRect(0, 0, w, h)
  })
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.3), new THREE.MeshStandardMaterial({ color: '#1d2027' }))
  monitor.position.set(-0.02, 0.32, 0.32)
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.18), new THREE.MeshBasicMaterial({ map: screenTex }))
  face.rotation.y = Math.PI / 2
  face.position.set(-0.004, 0.32, 0.32)
  pc.add(tower, monitor, face)
  pc.position.set(-0.05, 0, 0.5)
  const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.22, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#53606e', roughness: 0.6, side: THREE.DoubleSide }))
  bin.position.set(0, 0.11, -0.45)
  group.add(pc, bin)

  // the wafer, whole, then its chips (instances), on a stage tilted toward the visitor like a display
  // stand (flat on the bench, the chips were seen edge-on)
  const stage = new THREE.Group()
  stage.position.set(0.02, 0.16, 0)
  stage.rotation.z = -0.75
  const stand = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.18, 0.06, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.5 }))
  stand.position.set(0.02, 0.09, 0)
  group.add(stage, stand)
  const R = { small: 0.1, big: 0.15 }
  const PITCH = 0.018
  const faceMat = new THREE.MeshStandardMaterial({ map: chipFace(11), roughness: 0.35, metalness: 0.3 })
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 48), faceMat)
  disc.rotation.x = -Math.PI / 2
  disc.position.y = 0.042
  stage.add(disc)
  const MAX = 260
  const chips = new THREE.InstancedMesh(new THREE.BoxGeometry(PITCH * 0.86, 0.006, PITCH * 0.86), new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.25 }), MAX)
  chips.count = 0
  // first drawn with no chips, it would keep an empty bounding sphere and never be drawn again
  chips.frustumCulled = false
  stage.add(chips)
  // a backing disc under the wafer on the stage
  const backing = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.01, 40), new THREE.MeshStandardMaterial({ color: '#1d2027', roughness: 0.6 }))
  backing.position.y = 0.035
  stage.add(backing)
  let size = 'small'
  let state = 'whole'
  let t = 0
  let list = []
  let wafers = 0 // the wafer's number: which of its chips work follows from it, the same on every screen
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const one = new THREE.Vector3(1, 1, 1)
  const GOLD = new THREE.Color('#a8854a')
  const GOOD = new THREE.Color('#3ddc84')
  const BAD = new THREE.Color('#ff4d4d')
  const counts = { good: 0, bad: 0 }

  function newWafer(s, n = wafers + 1) {
    wafers = n
    const rnd = random(31 + n * 7919)
    size = s
    const r = R[s]
    disc.scale.set(r, r, r)
    faceMat.map = chipFace(Math.round((2 * r) / PITCH))
    faceMat.needsUpdate = true
    disc.visible = true
    chips.count = 0
    state = 'whole'
    t = 0
    list = []
    for (let i = -20; i <= 20; i++) for (let j = -20; j <= 20; j++) {
      const x = (i + 0.5) * PITCH
      const z = (j + 0.5) * PITCH
      if (Math.hypot(Math.abs(x) + PITCH / 2, Math.abs(z) + PITCH / 2) < r - 0.004) list.push({ x, z, ok: rnd() > 0.17, at: new THREE.Vector3(x, 0.044, z) })
    }
  }
  newWafer('small', 0)

  const draw = () => {
    chips.count = list.length
    list.forEach((c, i) => {
      m4.compose(c.at, q, c.hide ? new THREE.Vector3(0.0001, 0.0001, 0.0001) : one)
      chips.setMatrixAt(i, m4)
    })
    chips.instanceMatrix.needsUpdate = true
  }
  // where each step leads (one under way counts as done: it ends there by itself on every screen)
  const STEPS = ['whole', 'cut', 'tested', 'done']
  const stepOf = s => ({ cutting: 'cut', testing: 'tested', sorting: 'done' })[s] ?? s
  const api = {
    group,
    get state() {
      return state
    },
    get size() {
      return size
    },
    get busy() {
      return state === 'cutting' || state === 'testing' || state === 'sorting'
    },
    snapshot() {
      return { size, wafer: wafers, step: stepOf(state) }
    },
    /** Someone else's step (live: the next step, or a new wafer, plays here; returns true when it did);
     *  a newcomer sees the wafer as that step left it. */
    restore({ size: s, wafer = 0, step } = {}, live = false) {
      if (!R[s] || !STEPS.includes(step)) return false
      const n = Math.max(0, Math.floor(Number(wafer) || 0))
      const have = stepOf(state)
      if (n === wafers && s === size && step === have) return false
      if (live && !api.busy) {
        if (n === wafers && STEPS.indexOf(step) === STEPS.indexOf(have) + 1) return !!api.act()
        if (n === wafers + 1 && step === 'whole') {
          newWafer(s, n)
          return true
        }
      }
      newWafer(s, n)
      const k = STEPS.indexOf(step)
      if (k >= 1) {
        disc.visible = false
        list.forEach((c, i) => {
          c.at.set(c.x * 1.18, 0.044, c.z * 1.18)
          chips.setColorAt(i, k >= 2 ? (c.ok ? GOOD : BAD) : GOLD)
          c.hide = k >= 3
        })
        chips.instanceColor.needsUpdate = true
        counts.good = list.filter(c => c.ok).length
        counts.bad = list.length - counts.good
        draw()
        state = step
      }
      return false
    },
    /** One step: cut, test, sort, then a new wafer (the other size unless one is asked for). */
    act(want) {
      if (api.busy) return false
      if (want) {
        newWafer(want)
        onStep?.('new', size)
        return 'new'
      }
      t = 0
      if (state === 'whole') {
        state = 'cutting'
        disc.visible = false
        list.forEach((c, i) => chips.setColorAt(i, GOLD))
        chips.instanceColor.needsUpdate = true
        play('crack')
        return 'cut'
      }
      if (state === 'cut') {
        state = 'testing'
        return 'test'
      }
      if (state === 'tested') {
        state = 'sorting'
        return 'sort'
      }
      newWafer(size === 'small' ? 'big' : 'small')
      onStep?.('new', size)
      return 'new'
    },
    update(dt) {
      t += dt
      if (state === 'cutting') {
        // the chips draw apart along the cutting lines
        const k = ease(clamp(t / 0.7))
        list.forEach(c => c.at.set(c.x * (1 + 0.18 * k), 0.044, c.z * (1 + 0.18 * k)))
        draw()
        if (t >= 0.7) {
          state = 'cut'
          onStep?.('cut')
        }
      } else if (state === 'testing') {
        // tested in turn, row by row: green works, red does not
        const n = Math.floor(clamp(t / 2.2) * list.length)
        for (let i = 0; i < n; i++) chips.setColorAt(i, list[i].ok ? GOOD : BAD)
        chips.instanceColor.needsUpdate = true
        if (t >= 2.2) {
          state = 'tested'
          counts.good = list.filter(c => c.ok).length
          counts.bad = list.length - counts.good
          onStep?.('tested')
        }
      } else if (state === 'sorting') {
        // the good ones fly into the computer, the bad ones into the bin
        // (the computer and the bin, in the stage's own frame)
        const to = { good: stage.worldToLocal(group.localToWorld(new THREE.Vector3(-0.05, 0.3, 0.5))), bad: stage.worldToLocal(group.localToWorld(new THREE.Vector3(0, 0.2, -0.45))) }
        list.forEach((c, i) => {
          const k = ease(clamp((t - (i / list.length) * 1.2) / 0.5))
          const dest = c.ok ? to.good : to.bad
          if (!c.from) c.from = c.at.clone()
          c.at.lerpVectors(c.from, dest, k)
          c.at.y += Math.sin(k * Math.PI) * 0.15
          c.hide = k >= 1
        })
        draw()
        if (t >= 1.8) {
          state = 'done'
          onStep?.('sorted', { ...counts, all: list.length })
        }
      }
    },
  }
  return api
}

// ---- the wafer and its rainbow ----

const RAINBOW_VERT = `
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vT = normalize(mat3(modelMatrix) * vec3(1.0, 0.0, 0.0));
  gl_Position = projectionMatrix * viewMatrix * w;
}`
const RAINBOW_FRAG = `
uniform sampler2D uMap;
uniform vec3 uLight;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
varying vec2 vUv;
vec3 spectral(float w) { return clamp(vec3(abs(w * 6.0 - 3.0) - 1.0, 2.0 - abs(w * 6.0 - 2.0), 2.0 - abs(w * 6.0 - 4.0)), 0.0, 1.0); }
void main() {
  vec3 base = texture2D(uMap, vUv).rgb;
  vec3 n = normalize(vN);
  vec3 l = normalize(uLight - vPos);
  vec3 v = normalize(cameraPosition - vPos);
  // a grating along the wafer: the colour that leaves toward the eye depends on (sin in + sin out)
  float s = abs(dot(l + v, normalize(vT)));
  vec3 h = normalize(l + v);
  float spec = pow(max(dot(n, h), 0.0), 3.0);
  float band = smoothstep(0.12, 0.3, s) * (1.0 - smoothstep(1.0, 1.3, s));
  vec3 rainbow = spectral(clamp((s - 0.2) / 0.95, 0.0, 1.0)) * band * (0.35 + 1.4 * spec);
  float diffuse = 0.3 + 0.7 * max(dot(n, l), 0.0);
  gl_FragColor = vec4(base * diffuse + rainbow, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function waferRainbow({ light }) {
  const group = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.5 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 20), dark)
  base.position.y = 0.01
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), dark)
  post.position.y = 0.08
  group.add(base, post)
  const pivot = new THREE.Group()
  pivot.position.y = 0.15
  group.add(pivot)
  const holder = new THREE.Group() // flips the wafer over
  pivot.add(holder)
  const R = 0.1
  const front = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.ShaderMaterial({ uniforms: { uMap: { value: chipFace(11) }, uLight: { value: new THREE.Vector3() } }, vertexShader: RAINBOW_VERT, fragmentShader: RAINBOW_FRAG }))
  const back = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.MeshStandardMaterial({ color: '#a4adb8', metalness: 1, roughness: 0.07 }))
  back.rotation.y = Math.PI
  back.position.z = -0.0008
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.0012, 4, 64), new THREE.MeshStandardMaterial({ color: '#8a929c', metalness: 1, roughness: 0.2 }))
  holder.add(front, back, rim)
  // the desk lamp beside it, whose light makes the rainbow
  const lamp = new THREE.Group()
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8), dark)
  arm.position.set(0, 0.21, 0)
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#d8a636', roughness: 0.5, side: THREE.DoubleSide }))
  head.position.set(0.04, 0.42, 0)
  head.rotation.z = 2.3
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), new THREE.MeshStandardMaterial({ color: '#fff7e0', emissive: '#fff2cc', emissiveIntensity: 2 }))
  bulb.position.set(0.06, 0.4, 0)
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.02, 16), dark)
  lampBase.position.y = 0.01
  lamp.add(arm, head, bulb, lampBase)
  lamp.position.set(-0.08, 0, -0.22)
  group.add(lamp)
  if (!light) {
    const bl = new THREE.PointLight('#fff2d6', 0.8, 2, 2)
    bl.position.set(-0.02, 0.38, -0.22)
    group.add(bl)
  }
  const lampPos = new THREE.Vector3()
  let tilt = 0.35
  let tiltTo = 0.35
  let flip = 0
  let flipTo = 0
  let rock = 0
  let rocks = 0 // for the others in a room
  const api = {
    group,
    get front() {
      return flipTo === 0
    },
    get tilt() {
      return tiltTo
    },
    setTilt(v) {
      tiltTo = v
      rock = 0
    },
    flip() {
      flipTo = flipTo === 0 ? Math.PI : 0
      return flipTo === 0 ? 'front' : 'back'
    },
    act() {
      // used: it rocks slowly through its angles once, so the rainbow sweeps
      rock = 6
      rocks++
      return null
    },
    state() {
      return { front: flipTo === 0, tilt: Math.round(tiltTo * 100) / 100, rocks }
    },
    /** Someone else turned it over, tilted it or set it rocking: it moves here too (a newcomer's at once). */
    setState({ front = true, tilt: v = 0.35, rocks: n = 0 } = {}, live = false) {
      n = Math.max(0, Math.floor(Number(n) || 0))
      flipTo = front ? 0 : Math.PI
      const rocked = live && n > rocks
      rocks = n
      if (rocked) rock = 6
      else if (Number.isFinite(v) && (Math.abs(v - tiltTo) > 0.005 || rock > 0)) {
        tiltTo = Math.max(0, Math.min(1.1, v))
        rock = 0
      }
      if (!live) {
        flip = flipTo
        tilt = tiltTo
      }
    },
    update(dt, t) {
      if (rock > 0) {
        rock -= dt
        tiltTo = 0.45 + Math.sin((6 - rock) * 1.1) * 0.4
      }
      tilt += (tiltTo - tilt) * Math.min(1, dt * 5)
      flip += (flipTo - flip) * Math.min(1, dt * 4)
      // standing up, facing the visitor (+x), tilted back by `tilt`
      pivot.rotation.set(0, Math.PI / 2, 0)
      pivot.rotateX(-tilt)
      holder.rotation.y = flip
      group.localToWorld(lampPos.set(-0.02, 0.38, -0.22))
      front.material.uniforms.uLight.value.copy(lampPos)
    },
  }
  return api
}

// ---- the turbocharger: steel and silicon nitride wheels racing ----

function impeller(mat) {
  const g = new THREE.Group()
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.05, 20), mat)
  hub.rotation.z = Math.PI / 2
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.006, 32), mat)
  plate.rotation.z = Math.PI / 2
  plate.position.x = -0.022
  g.add(hub, plate)
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.055, 0.005), mat)
    const a = (i / 10) * Math.PI * 2
    b.position.set(-0.002, Math.cos(a) * 0.05, Math.sin(a) * 0.05)
    b.rotation.x = -a
    b.rotateY(0.45)
    g.add(b)
  }
  return g
}

function turbocharger({ words }) {
  const group = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.5 })
  const steelMat = new THREE.MeshStandardMaterial({ color: '#c3c8cf', metalness: 0.9, roughness: 0.3 })
  const ceramicMat = new THREE.MeshStandardMaterial({ color: '#3a3f47', metalness: 0.05, roughness: 0.42 })
  const housingMat = new THREE.MeshStandardMaterial({ color: '#8b7e6d', metalness: 0.6, roughness: 0.55 })
  const wheels = [
    { mat: steelMat, z: -0.3, inertia: 7.9, name: words.steel },
    { mat: ceramicMat, z: 0.3, inertia: 3.2, name: words.ceramic },
  ].map(w => {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.06), dark)
    stand.position.set(-0.04, 0.08, w.z)
    const housing = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.028, 10, 36), housingMat)
    housing.rotation.y = Math.PI / 2
    housing.position.set(-0.01, 0.26, w.z)
    const wheel = impeller(w.mat)
    wheel.position.set(0.0, 0.26, w.z)
    // a dial below: its needle shows how fast the wheel turns
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.05, 32), new THREE.MeshBasicMaterial({ color: '#f2efe6' }))
    dial.rotation.y = Math.PI / 2
    dial.position.set(0.03, 0.08, w.z)
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.042, 0.004), new THREE.MeshBasicMaterial({ color: '#d33' }))
    needle.geometry.translate(0, 0.019, 0)
    needle.position.set(0.032, 0.08, w.z)
    const label = makeText(w.name, { size: 0.03, color: '#ffffff', maxWidth: 0.5, anchorX: 'center', anchorY: 'middle' })
    label.position.set(0.04, 0.4, w.z)
    label.rotation.y = Math.PI / 2
    group.add(stand, housing, wheel, dial, needle, label)
    return { ...w, wheel, needle, omega: 0 }
  })
  // the pedal in front
  const pedalPivot = new THREE.Group()
  pedalPivot.position.set(0.32, 0.02, 0)
  const pedal = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.02, 0.07, 2, 0.006), new THREE.MeshStandardMaterial({ color: '#30333a', roughness: 0.6 }))
  pedal.position.set(0.05, 0.0, 0)
  pedalPivot.add(pedal)
  pedalPivot.rotation.z = 0.35
  group.add(pedalPivot)
  let press = 0
  let presses = 0 // for the others in a room
  const api = {
    group,
    get busy() {
      return press > 0
    },
    act() {
      if (press > 0) return false
      press = 2.6
      presses++
      play('beam')
      return true
    },
    state() {
      return { n: presses }
    },
    /** Someone else pressed the pedal: the wheels race here too. */
    setState({ n = 0 } = {}, live = false) {
      n = Math.max(0, Math.floor(Number(n) || 0))
      if (live && n > presses) api.act()
      presses = n
    },
    update(dt) {
      press = Math.max(0, press - dt)
      pedalPivot.rotation.z += ((press > 0 ? 0.05 : 0.35) - pedalPivot.rotation.z) * Math.min(1, dt * 10)
      for (const w of wheels) {
        // the same push for both; the lighter wheel has less to turn (its moment of inertia)
        const torque = press > 0 ? 150 : 0
        w.omega += (torque / w.inertia - 0.55 * w.omega) * dt
        w.wheel.rotation.x += Math.min(w.omega, 40) * dt
        w.needle.rotation.x = -clamp(w.omega / 40, 0, 1) * 4.2 + 2.1
      }
    },
  }
  return api
}

// ---- the minerals: quartz, mica, feldspar, garnet ----

function minerals() {
  const group = new THREE.Group()
  const tray = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.03, 0.5, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.7 }))
  tray.position.y = 0.015
  group.add(tray)
  const items = {}
  // quartz: a cluster of six-sided crystals with pointed tips
  const quartz = new THREE.Group()
  const qMat = new THREE.MeshStandardMaterial({ color: '#e9eef5', transparent: true, opacity: 0.82, roughness: 0.12, metalness: 0.05, flatShading: true })
  const rq = random(6)
  for (let i = 0; i < 6; i++) {
    const h = 0.06 + rq() * 0.06
    const c = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, h, 6), qMat)
    body.position.y = h / 2
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.025, 6), qMat)
    tip.position.y = h + 0.0125
    c.add(body, tip)
    c.rotation.set((rq() - 0.5) * 0.7, rq() * 3, (rq() - 0.5) * 0.7)
    c.position.set((rq() - 0.5) * 0.03, 0, (rq() - 0.5) * 0.03)
    quartz.add(c)
  }
  items.quartz = quartz
  // mica: a stack of thin shiny sheets
  const mica = new THREE.Group()
  const mMat = new THREE.MeshStandardMaterial({ color: '#7d5f3c', metalness: 0.45, roughness: 0.22 })
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04 - i * 0.0012, 0.04 - i * 0.0012, 0.004, 6), mMat)
    s.position.y = 0.002 + i * 0.0045
    s.rotation.y = i * 0.07
    mica.add(s)
  }
  items.mica = mica
  // feldspar: a pink blocky crystal
  const feldspar = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.05, 0.05, 2, 0.006), new THREE.MeshStandardMaterial({ color: '#d39d86', roughness: 0.65 }))
  feldspar.geometry.translate(0, 0.025, 0)
  items.feldspar = feldspar
  // garnet: a deep red twelve-sided gem
  const garnet = new THREE.Mesh(new THREE.DodecahedronGeometry(0.03, 0), new THREE.MeshStandardMaterial({ color: '#7a1022', roughness: 0.18, metalness: 0.1, flatShading: true }))
  garnet.geometry.translate(0, 0.03, 0)
  items.garnet = garnet
  const order = ['quartz', 'mica', 'feldspar', 'garnet']
  const slots = [[0.1, -0.12], [0.1, 0.12], [-0.1, -0.12], [-0.1, 0.12]]
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.062, 32), new THREE.MeshBasicMaterial({ color: '#7fb4ff', transparent: true, opacity: 0.85 }))
  ring.rotation.x = -Math.PI / 2
  ring.visible = false
  group.add(ring)
  order.forEach((k, i) => {
    const o = items[k]
    o.position.set(slots[i][0], 0.03, slots[i][1])
    group.add(o)
  })
  let cur = -1
  let lift = 0
  const show = i => {
    cur = i
    lift = 0
    ring.visible = true
    ring.position.set(slots[cur][0], 0.032, slots[cur][1])
  }
  return {
    group,
    next() {
      show((cur + 1) % order.length)
      return order[cur]
    },
    state() {
      return { cur }
    },
    /** Someone else picked one up: it rises here too (live: returns true); a newcomer sees it up. */
    setState({ cur: i = -1 } = {}, live = false) {
      i = Math.floor(Number(i))
      if (i === cur || !(i >= 0 && i < order.length)) return false
      show(i)
      if (!live) lift = 1
      return live
    },
    update(dt, t) {
      lift = Math.min(1, lift + dt * 3)
      order.forEach((k, i) => {
        const o = items[k]
        const on = i === cur
        o.position.y = 0.03 + (on ? ease(lift) * 0.04 : 0)
        o.rotation.y = on ? t * 0.8 : o.rotation.y
      })
    },
  }
}

export function stations({ ctx, root, el, lang, E, W, ex, say, panel, light }) {
  const level = () => ctx.level()
  // tell the others in the room's same lab that this visitor changed something
  const share = id => ctx.share?.(id)
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const vars = {
    melt: num(el.melt - 273.15, 0, lang),
    density: num(el.density, 2, lang),
    crust: num((el.abundance?.crust ?? 282000) / 10000, 1, lang),
  }
  const paras = list => list.map(p => ({ p: fill(p, vars) }))

  // the lump, in the fume cupboard
  const lump = siliconLump()
  put(root, lump, SPOTS.bench, 1.3)
  ex.add({
    id: 'lump',
    x: SPOTS.bench.at.x,
    z: SPOTS.bench.at.z,
    radius: 1.5,
    focus: { x: SPOTS.bench.x + 0.1, y: SPOTS.bench.y + 0.12, z: SPOTS.bench.z + 0.2, size: 0.9 },
    label: E.lump.label,
    verb: () => (lump.out ? E.lump.turn : E.lump.take),
    act: () => {
      const r = lump.act()
      if (!r) return false
      share('lump')
      play('tap')
      return r === 'take' ? at(E.lump.says, level()) : null
    },
    panelDelay: 1.6,
    panel: panel({ id: 'lump', title: E.lump.title, parts: ['lump', 'grains'], extra: { grains: E.lump.turn + ' ({t})' }, blocks: lv => paras(E.lump.panel[depth(lv)]) }),
  })

  // the chip line, at the bench's other end
  const say1 = (key, vars2) => say(fill(at(E.chips.says[key], level()), vars2 ?? {}))
  // the step under way was this visitor's: someone else's plays here too, without the words
  let mine = true
  const lineAct = want => {
    const r = line.act(want)
    if (!r) return false
    mine = true
    share('chips')
    return r
  }
  const line = chipLine({
    onStep: (step, info) => {
      if (!mine) return
      if (step === 'cut') say1('cut')
      else if (step === 'tested') say1('test')
      else if (step === 'sorted') say1('sorted', { ...info, pct: Math.round((info.good / info.all) * 100) })
      else if (step === 'new' && info === 'big') say1('big')
    },
  })
  put(root, line, SPOTS.benchSide, 1.25)
  const lineVerb = () => (line.busy ? E.chips.working : { whole: E.chips.cut, cut: E.chips.test, tested: E.chips.sort, done: E.chips.again }[line.state] ?? E.chips.cut)
  ex.add({
    id: 'chips',
    x: SPOTS.benchSide.at.x,
    z: SPOTS.benchSide.at.z,
    radius: 1.5,
    focus: { x: SPOTS.benchSide.x + 0.05, y: SPOTS.benchSide.y + 0.15, z: SPOTS.benchSide.z, size: 1.4 },
    label: E.chips.label,
    verb: lineVerb,
    act: () => (lineAct() ? null : false),
    panelDelay: 0.8,
    panel: panel({
      id: 'chips',
      title: E.chips.title,
      parts: ['chips'],
      blocks: lv => [
        ...paras(E.chips.panel[depth(lv)]),
        { buttons: [{ label: E.chips.buttons.small, onClick: () => lineAct('small') || say(W.busy) }, { label: E.chips.buttons.big, onClick: () => lineAct('big') || say(W.busy) }] },
      ],
    }),
  })

  // the wafer and its rainbow, on the desk
  const wafer = waferRainbow({ light })
  put(root, wafer, SPOTS.deskA, 1.6)
  ex.add({
    id: 'wafer',
    x: SPOTS.deskA.at.x,
    z: SPOTS.deskA.at.z,
    radius: 1.45,
    focus: { x: SPOTS.deskA.x, y: SPOTS.deskA.y + 0.28, z: SPOTS.deskA.z, size: 0.8 },
    label: E.wafer.label,
    verb: E.wafer.tilt,
    act: () => {
      wafer.act()
      share('wafer')
      return at(wafer.front ? E.wafer.says.front : E.wafer.says.back, level())
    },
    panelDelay: 1.2,
    panel: panel({
      id: 'wafer',
      title: E.wafer.title,
      parts: ['wafer', 'rainbow'],
      extra: { rainbow: E.wafer.says.front.kid.replace(/[!.].*$/, '') + ' ({t})' },
      blocks: lv => [
        ...paras(E.wafer.panel[depth(lv)]),
        {
          slider: {
            label: E.wafer.tilt,
            min: 0,
            max: 1.1,
            step: 0.01,
            value: wafer.tilt,
            onInput: v => {
              wafer.setTilt(v)
              tilted()
            },
            format: v => `${Math.round((v * 180) / Math.PI)}°`,
            live: () => wafer.tilt,
          },
        },
        {
          buttons: [
            {
              label: E.wafer.flip,
              onClick: () => {
                const side = wafer.flip()
                share('wafer')
                say(at(side === 'front' ? E.wafer.says.front : E.wafer.says.back, level()))
              },
            },
          ],
        },
      ],
    }),
  })

  // the turbocharger, on the courtyard's red bench
  const turbo = turbocharger({ words: E.turbo })
  put(root, turbo, SPOTS.yard, 1.6)
  ex.add({
    id: 'turbo',
    x: SPOTS.yard.at.x,
    z: SPOTS.yard.at.z,
    radius: 1.8,
    focus: { x: SPOTS.yard.x, y: SPOTS.yard.y + 0.35, z: SPOTS.yard.z, size: 1.4 },
    label: E.turbo.label,
    verb: E.turbo.press,
    act: () => {
      if (!turbo.act()) return false
      share('turbo')
      later(1.8, () => say(at(E.turbo.says, level())))
      return null
    },
    panelDelay: 2.6,
    panel: panel({ id: 'turbo', title: E.turbo.title, parts: ['turbo'], blocks: lv => [...paras(E.turbo.panel[depth(lv)]), { buttons: [{ label: E.turbo.press, onClick: () => turbo.act() && share('turbo') }] }] }),
  })
  // a timer for the line said after the race (the room's own timers are not passed in)
  const waits = []
  function later(s, fn) {
    waits.push({ s, fn })
  }
  // the tilt slider moves many times a second: the others get it a few times a second, and where it stopped
  let tilting = false
  const tilted = () => {
    if (tilting) return
    tilting = true
    later(0.15, () => {
      tilting = false
      share('wafer')
    })
  }

  // the minerals, on the side table
  const rocks = minerals()
  put(root, rocks, SPOTS.side, 2.2)
  ex.add({
    id: 'minerals',
    x: SPOTS.side.at.x,
    z: SPOTS.side.at.z,
    radius: 1.45,
    focus: { x: SPOTS.side.x, y: SPOTS.side.y + 0.12, z: SPOTS.side.z, size: 0.8 },
    label: E.minerals.label,
    verb: E.minerals.look,
    act: () => {
      const k = rocks.next()
      share('minerals')
      play('tap')
      return at(E.minerals.says[k], level())
    },
    panelDelay: 1.0,
    panel: panel({ id: 'minerals', title: E.minerals.title, parts: ['sand'], blocks: lv => paras(E.minerals.panel[depth(lv)]) }),
  })

  // what everyone in a room's same lab shares (src/net/shared.js): set(state, live), live when someone has
  // just done it (it plays here, with its sound), else a newcomer's view at once
  const shared = {
    lump: { get: () => lump.state(), set: (s, live) => lump.setState(s, live) && play('tap') },
    chips: {
      get: () => line.snapshot(),
      set: (s, live) => {
        if (line.restore(s, live)) mine = false
      },
    },
    wafer: { get: () => wafer.state(), set: (s, live) => wafer.setState(s, live) },
    turbo: { get: () => turbo.state(), set: (s, live) => turbo.setState(s, live) },
    minerals: { get: () => rocks.state(), set: (s, live) => rocks.setState(s, live) && play('tap') },
  }

  return {
    parts: { lump, line, wafer, turbo, rocks },
    shared,
    update(dt, t, camera, viewHeight) {
      for (let i = waits.length - 1; i >= 0; i--) {
        waits[i].s -= dt
        if (waits[i].s <= 0) waits.splice(i, 1)[0].fn()
      }
      lump.update(dt, t, camera, viewHeight)
      line.update(dt)
      wafer.update(dt, t)
      turbo.update(dt)
      rocks.update(dt, t)
    },
  }
}
