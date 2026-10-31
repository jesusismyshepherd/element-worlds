// The Star Forge (/stars, docs/knowledge/star-forge.md): make the elements as the universe did. Three
// places in one orbit world, each step chosen by tapping the thing it is about (the user, 2026-10-30), what
// varies smoothly a slider in the HUD (ui/StarHud.jsx):
// - a star's life: the star in cutaway, its layers an onion drawn on the cut faces. Tap a star of the
//   nursery below (or slide its mass) to choose it; tap its core to light hydrogen and again for each
//   next burning (the life slider runs through them too); in its last burning a tap on the core ends it: a
//   planetary nebula and a white dwarf, or a supernova and a neutron star or a black hole. An old giant's
//   glowing helium shell takes you to the slow capture; the neutron star left by a supernova, to the rapid.
// - the slow capture (the s-process) inside an old giant: tap the nucleus to give it a neutron; it waits
//   or beta-decays (neutrons.js on the forge's chart of nuclides), climbing from iron to lead and bismuth.
// - the rapid capture (the r-process): tap two neutron stars to merge them; the flood of neutrons swells a
//   nucleus far out on the neutron-rich side up to plutonium; tap the cloud to let it cool and decay back
//   into gold, platinum, uranium.
// Every element made lights up on the HUD's table. Shared in a room (net/shared.js): the star (its mass,
// its place in its life, its end), the slow nucleus, the merger, the elements made; the camera, the words,
// the panels and the missions (stars:<id>) stay each one's.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { nightSky } from '../common/sky.js'
import { packBall } from '../common/pack.js'
import { loadChart } from '../../chem/nucleus.js'
import { ELEMENTS } from '../../data/elements.js'
import { markFound, isFound } from '../../engine/progress.js'
import { track } from '../../net/telemetry.js'
import { play } from '../../audio/sound.js'
import { makeText } from '../../engine/text.js'
import { phasesOf, endOf, placeAt, lookOf, NURSERY, M_MIN, M_MAX, kindOf } from './life.js'
import { SEED, sDecay, rPath, rProducts, elementsOf } from './neutrons.js'
import { MISSIONS, wordsOf } from './words.js'
import { LAYER, LABEL, AGB_SHELL, layersOf } from './layers.js'

const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const TAU = Math.PI * 2
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const ease = v => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v))
const damp = (from, to, rate, dt) => to + (from - to) * Math.exp(-rate * dt)
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k)

// the three places, far apart under one sky
const PLACES = { star: V3(0, 0, 0), slow: V3(180, 0, 0), rapid: V3(-180, 0, 0) }
const R_RATE = 22 // steps of the rapid path a second
const MERGE_S = 2.6
const DECAY_S = 3.2
const S_DECAY_WAIT = 0.5 // how long a nucleus on show waits before it decays (s on screen)
const COLORS = { p: '#ff5a55', n: '#b9c6dc', e: '#a8ecff' }

// value noise for boiling surfaces (the same as the picture rooms' giant, pictures/stages/giant.js)
const NOISE = /* glsl */ `
  float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float n3(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i + vec3(0, 0, 0)), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = 0.5; float s = 0.0; for (int i = 0; i < 4; i++) { s += a * n3(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
`

/** A soft round glow for sprites. */
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(255,255,255,1)')
  gr.addColorStop(0.22, 'rgba(255,255,255,0.6)')
  gr.addColorStop(0.55, 'rgba(255,255,255,0.14)')
  gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export async function build(ctx) {
  await loadChart()
  const { camera, canvas, store, light } = ctx
  const lang = () => ctx.lang()
  const root = new THREE.Group()
  root.name = 'stars'
  const GLOW = glowTexture()
  const sprite = (color, size, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(size)
    return s
  }

  // ---- the sky: deep space, a few faint clouds of gas ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 1400 : 3000, top: '#02030b', mid: '#050821', horizon: '#0b0c2a' })
  root.add(sky)
  const clouds = new THREE.Group()
  root.add(clouds)
  ;[['#5a2a8a', V3(-300, 120, -520), 520], ['#1f4a8a', V3(380, -60, -480), 460], ['#7a2a4a', V3(60, 260, -600), 420], ['#20406a', V3(-80, -200, 500), 500]].forEach(([c, p, s]) => {
    const sp = sprite(c, s, 0.35)
    sp.position.copy(p)
    sp.renderOrder = -8
    clouds.add(sp)
  })
  root.add(new THREE.HemisphereLight('#c9d4ff', '#120a20', 0.9))

  // ---- taps: each thing to tap with when it can be tapped (the hand shows only then) ----
  const ray = new THREE.Raycaster()
  const targets = [] // { object, place, when, onTap }
  const clickable = (object, place, onTap, when = () => true) => targets.push({ object, place, onTap, when })
  let place = 'star'

  // =====================================================================================================
  // A star's life
  // =====================================================================================================
  const starG = new THREE.Group()
  starG.position.copy(PLACES.star)
  root.add(starG)
  const body = new THREE.Group() // the star, scaled to its radius; the wedge opening faces +z
  body.rotation.y = Math.PI / 4 + 0.35 // (the face with the labels turned a little more toward the visitor)
  starG.add(body)
  const surfMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#ffd27a') }, uBright: { value: 1 }, uCells: { value: 3 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        vP = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor; uniform float uBright; uniform float uCells;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      ${NOISE}
      void main() {
        float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float g = fbm(vP * uCells + vec3(0.0, uTime * 0.05, uTime * 0.03)) * 0.7 + fbm(vP * uCells * 3.5 - uTime * 0.08) * 0.35;
        vec3 c = uColor * (0.32 + 0.78 * pow(mu, 0.6)) * (0.7 + 0.55 * g);
        gl_FragColor = vec4(c * uBright, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const SEG = light ? 48 : 96
  const surface = new THREE.Mesh(new THREE.SphereGeometry(1, SEG, SEG * 0.66, Math.PI / 2, Math.PI * 1.5), surfMat)
  body.add(surface)
  // the two cut faces, the onion drawn on them by radius
  const faceMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uR: { value: new Array(8).fill(1) },
      uC: { value: Array.from({ length: 8 }, () => new THREE.Color('#ff9a52')) },
      uB: { value: new Array(8).fill(0) },
      uN: { value: 1 },
      uBright: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vXY;
      void main() {
        vXY = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uR[8]; uniform vec3 uC[8]; uniform float uB[8]; uniform int uN; uniform float uBright;
      varying vec2 vXY;
      ${NOISE}
      void main() {
        float r = length(vXY);
        int idx = uN - 1;
        for (int i = 0; i < 8; i++) { if (i < uN && r < uR[i]) { idx = i; break; } }
        float lo = idx > 0 ? uR[idx - 1] : 0.0;
        float hi = uR[idx];
        vec3 c = uC[idx];
        // hotter toward the middle; the burning layers flicker, their outer edge the brightest
        float burn = uB[idx];
        float fl = fbm(vec3(vXY * 9.0, uTime * 0.7));
        c *= (0.42 + 0.5 * (1.0 - r)) * (1.0 + burn * (0.75 + 0.2 * sin(uTime * 3.0 + r * 40.0) + 0.45 * fl));
        c += burn * uC[idx] * 0.9 * smoothstep(hi - 0.05, hi, r);
        // a thin dark line between layers
        float line = 1.0 - smoothstep(0.0, 0.006, min(abs(r - lo), abs(r - hi)));
        if (idx == 0) line = 1.0 - smoothstep(0.0, 0.006, abs(r - hi));
        c = mix(c, vec3(0.02, 0.01, 0.03), line * 0.75);
        gl_FragColor = vec4(c * uBright, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.DoubleSide,
  })
  const faceA = new THREE.Mesh(new THREE.CircleGeometry(1, SEG, Math.PI / 2, Math.PI), faceMat)
  const faceB = new THREE.Mesh(new THREE.CircleGeometry(1, SEG, -Math.PI / 2, Math.PI), faceMat)
  faceB.rotation.y = -Math.PI / 2
  body.add(faceA, faceB)
  const halo = sprite('#ffd27a', 3, 0.4)
  halo.renderOrder = -2
  starG.add(halo)
  // the layers' symbols, written on the face toward the left
  const labels = Array.from({ length: 7 }, () => {
    const t = makeText('', { size: 0.06, color: '#ffffff', outlineWidth: 0.004, outlineColor: '#120a20' })
    faceA.add(t)
    return t
  })
  let labelKey = ''
  const setLayers = (layers, R) => {
    const n = layers.length
    faceMat.uniforms.uN.value = n
    layers.forEach((L, i) => {
      faceMat.uniforms.uR.value[i] = L.r
      faceMat.uniforms.uC.value[i].set(LAYER[L.k])
      faceMat.uniforms.uB.value[i] = L.burn ? 1 : 0
    })
    // the labels: each layer's symbols in the middle of its ring, along a line down to the left
    const key = layers.map(L => L.k).join(',') + Math.round(R * 20)
    labels.forEach((t, i) => {
      const L = layers[i]
      const lo0 = i > 0 && L ? layers[i - 1].r : 0
      if (!L || (i === n - 1 && n > 1 && layers[n - 2].k === 'H') || (i < n - 1 && L.r - lo0 < 0.075)) {
        t.visible = false
        return
      }
      t.visible = true
      const lo = i > 0 ? layers[i - 1].r : 0
      const mid = i === n - 1 ? 0.66 : (lo + L.r) / 2
      // along a line down to the left, the inner ones turned a little further so close rings do not collide
      const a = Math.PI + 0.3 + (i % 2) * 0.32
      t.position.set(Math.cos(a) * mid, Math.sin(a) * mid, 0.004)
      // letters about half the ring's width tall, never tiny on screen
      const w = (L.r - lo) * 0.6
      const size = Math.min(0.14, Math.max(0.065, w)) * (i === n - 1 ? 1.25 : 1)
      if (Math.abs(t.fontSize - size) > 1e-4) t.fontSize = size
      if (labelKey !== key) {
        t.text = LABEL[L.k]
        t.sync()
      }
    })
    labelKey = key
  }

  // the nursery: the stars to choose from, in a row under the star
  const nursery = new THREE.Group()
  starG.add(nursery)
  const nGeo = new THREE.SphereGeometry(1, 24, 16)
  const nStars = NURSERY.map((s, i) => {
    const g = new THREE.Group()
    const size = 0.13 + 0.17 * Math.log10(s.m / 0.1) / Math.log10(250)
    const ball = new THREE.Mesh(nGeo, new THREE.MeshBasicMaterial({ color: hdr(s.color, 1.6) }))
    ball.scale.setScalar(size)
    const gl = sprite(s.color, size * 4, 0.45)
    const label = makeText(wordsOf(lang()).nursery[s.id], { font: 'body', size: 0.17, color: '#eef2ff', outlineWidth: 0.012, outlineColor: '#0b0f24' })
    label.position.y = -size - 0.3
    label.renderOrder = 5
    // a generous invisible ball to tap
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), new THREE.MeshBasicMaterial({ visible: false }))
    g.add(ball, gl, label, hit)
    nursery.add(g)
    clickable(hit, 'star', () => pick(s.id))
    return { ...s, g, ball, size, i }
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 6, 48), new THREE.MeshBasicMaterial({ color: hdr('#ffe9a8', 1.6) }))
  nursery.add(ring)

  // what is left when the star ends
  const remnant = new THREE.Group()
  starG.add(remnant)
  const wd = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), new THREE.MeshBasicMaterial({ color: hdr('#e8f0ff', 2.2) }))
  wd.add(sprite('#cfe0ff', 1.1, 0.8))
  const ns = new THREE.Group()
  const nsBall = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshBasicMaterial({ color: hdr('#bfefff', 2.6) }))
  ns.add(nsBall, sprite('#8fdcff', 0.9, 0.9))
  const beamMat = new THREE.MeshBasicMaterial({ color: hdr('#9fe6ff', 1.4), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
  for (const s of [1, -1]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 2.6, 16, 1, true), beamMat)
    cone.position.y = s * 1.3
    cone.rotation.x = s > 0 ? Math.PI : 0
    ns.add(cone)
  }
  ns.rotation.z = 0.5
  const bh = new THREE.Group()
  bh.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 20), new THREE.MeshBasicMaterial({ color: '#000000' })))
  const disc = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.95, 64), new THREE.MeshBasicMaterial({ color: hdr('#ff9a4a', 1.5), transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
  disc.rotation.x = -Math.PI / 2 + 0.35
  bh.add(disc, sprite('#ffb070', 1.4, 0.35))
  remnant.add(wd, ns, bh)
  const remnantHit = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  remnant.add(remnantHit)
  remnant.visible = false

  // the end: a planetary nebula (a glowing shell and its ring) or a supernova (a flash and flying debris)
  const nebMat = new THREE.ShaderMaterial({
    uniforms: { uO: { value: 0 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); vP = position;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uO; uniform float uTime;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      ${NOISE}
      void main() {
        float mu = abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(1.0 - mu, 2.2);
        float n = fbm(vP * 2.6 + uTime * 0.05);
        // oxygen's teal inside, hydrogen's red at the rim
        vec3 c = mix(vec3(0.1, 0.75, 0.7), vec3(1.0, 0.25, 0.3), smoothstep(0.25, 0.85, rim));
        // a shell seen through: thin in the middle, bright at its edge (a ring, as planetary nebulae look)
        gl_FragColor = vec4(c * (0.04 + 0.85 * rim) * (0.55 + 0.8 * n) * uO, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  const nebula = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), nebMat)
  nebula.visible = false
  starG.add(nebula)
  const DEBRIS = light ? 900 : 2600
  const debrisGeo = new THREE.BufferGeometry()
  const dDir = new Float32Array(DEBRIS * 3)
  const dPos = new Float32Array(DEBRIS * 3)
  const dCol = new Float32Array(DEBRIS * 3)
  const dSpeed = new Float32Array(DEBRIS)
  const debrisKinds = ['H', 'He', 'CO', 'ONeMg', 'SiS', 'FeNi']
  for (let i = 0; i < DEBRIS; i++) {
    const u = Math.random() * 2 - 1
    const a = Math.random() * TAU
    const s = Math.sqrt(1 - u * u)
    dDir.set([Math.cos(a) * s, u, Math.sin(a) * s], i * 3)
    const kind = debrisKinds[Math.floor(Math.random() ** 1.6 * debrisKinds.length)]
    const c = new THREE.Color(LAYER[kind]).multiplyScalar(1.8)
    dCol.set([c.r, c.g, c.b], i * 3)
    dSpeed[i] = 0.6 + Math.random() * 1.4
  }
  debrisGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
  debrisGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3))
  const debrisMat = new THREE.PointsMaterial({ size: 0.16, map: GLOW, vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending })
  const debris = new THREE.Points(debrisGeo, debrisMat)
  debris.frustumCulled = false
  debris.visible = false
  starG.add(debris)
  const flash = sprite('#ffffff', 1, 0)
  starG.add(flash)

  // symbols flying out of what made them
  const flyers = [] // { obj, vel, age, life }
  const flySymbols = (zs, parent, from = 0.3, spread = 1) => {
    const list = zs.slice(0, 10)
    // in front of what made them, toward the camera; out across the screen
    const toCam = camera.position.clone().sub(parent.getWorldPosition(new THREE.Vector3())).normalize()
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
    list.forEach((z, k) => {
      const t = makeText(ELEMENTS[z - 1].symbol, { size: 0.3, color: '#fff3c4', outlineWidth: 0.014, outlineColor: '#2a1430' })
      t.position.copy(toCam).multiplyScalar(from)
      const a = (k / list.length) * TAU + 0.6
      const vel = right.clone().multiplyScalar(Math.cos(a)).addScaledVector(up, Math.sin(a)).multiplyScalar(1.3 * spread)
      parent.add(t)
      flyers.push({ obj: t, vel, age: -k * 0.08, life: 2.4, parent })
    })
  }

  // ---- the star's state ----
  let m = 1
  let x = 0 // where the life slider stands, 0..1
  let lit = false
  let end = null // endOf(m) once it has ended; with its time
  let endAt = 0
  let starN = 0 // counts the star's lives and ends (a room plays a new one when it goes up)
  let reached = -1 // the furthest phase lit in this life (each phase's discoveries once)
  let radiusNow = 1 // the star's radius on show (eased)
  let endR = 1 // its radius when it ended (the nebula and the debris grow from it)
  let clock = 0
  const phases = () => phasesOf(m)
  const here = () => placeAt(m, x)
  let look = { radius: 1, color: new THREE.Color('#ffd27a') }

  // =====================================================================================================
  // Nuclei (the slow and the rapid captures)
  // =====================================================================================================
  function nucleusView(NR, cap) {
    const group = new THREE.Group()
    const geo = new THREE.SphereGeometry(NR, light ? 10 : 14, light ? 8 : 10)
    const mats = {
      p: new THREE.MeshStandardMaterial({ color: COLORS.p, emissive: COLORS.p, emissiveIntensity: 0.6, roughness: 0.35 }),
      n: new THREE.MeshStandardMaterial({ color: COLORS.n, emissive: COLORS.n, emissiveIntensity: 0.32, roughness: 0.35 }),
    }
    const im = { p: new THREE.InstancedMesh(geo, mats.p, cap), n: new THREE.InstancedMesh(geo, mats.n, cap) }
    for (const k of ['p', 'n']) {
      im[k].count = 0
      im[k].frustumCulled = false
      group.add(im[k])
    }
    const glow = sprite('#ff8a6a', 1, 0.25)
    group.add(glow)
    const list = []
    let Z = 0
    let N = 0
    const radius = () => NR * Math.cbrt(Math.max(1, list.length)) * 1.08
    const relayout = () => {
      const total = list.length
      if (!total) return
      const pts = packBall(total, radius())
      const share = Z / total
      const free = { p: [], n: [] }
      pts.forEach((pt, i) => free[Math.floor((i + 1) * share) > Math.floor(i * share) ? 'p' : 'n'].push(pt))
      while (free.p.length < Z) free.p.push(free.n.pop())
      while (free.p.length > Z) free.n.push(free.p.pop())
      for (const kind of ['p', 'n']) {
        const slots = free[kind]
        for (const x of list.filter(q => q.kind === kind).sort((a, b) => b.pos.lengthSq() - a.pos.lengthSq())) {
          let best = 0
          let bd = Infinity
          slots.forEach((s, i) => {
            const d = s.distanceToSquared(x.pos)
            if (d < bd) {
              bd = d
              best = i
            }
          })
          x.target.copy(slots[best] ?? x.pos)
          slots.splice(best, 1)
        }
      }
    }
    const view = {
      group,
      get Z() { return Z },
      get N() { return N },
      radius,
      /** Show (z, n) at once. */
      set(z, n) {
        Z = z
        N = n
        list.length = 0
        for (let i = 0; i < z + n; i++) list.push({ kind: i < z ? 'p' : 'n', pos: new THREE.Vector3(), target: new THREE.Vector3(), seed: Math.random() * 100 })
        list.sort(() => Math.random() - 0.5)
        relayout()
        for (const q of list) q.pos.copy(q.target)
      },
      /** Go to (z, n) as nature would from here: a neutron caught, a beta decay, an alpha, else at once.
       *  Returns what flew out ('e', 'alpha') for the caller's effects. */
      morph(z, n, from = null) {
        if (z === Z && n === N + 1) {
          N++
          list.push({ kind: 'n', pos: from ? from.clone() : V3(0, radius() * 3, 0), target: new THREE.Vector3(), seed: Math.random() * 100 })
          relayout()
          return 'n'
        }
        const flipTo = (a, b) => {
          const q = list.filter(x => x.kind === a).sort((p, r) => r.pos.y - p.pos.y)[0]
          if (q) q.kind = b
        }
        if (z === Z + 1 && n === N - 1) {
          flipTo('n', 'p')
          Z++
          N--
          relayout()
          return 'e'
        }
        if (z === Z - 1 && n === N + 1) {
          flipTo('p', 'n')
          Z--
          N++
          relayout()
          return 'ec'
        }
        if (z === Z - 2 && n === N - 2) {
          const out = [...list.filter(q => q.kind === 'p').slice(0, 2), ...list.filter(q => q.kind === 'n').slice(0, 2)]
          for (const q of out) list.splice(list.indexOf(q), 1)
          Z -= 2
          N -= 2
          relayout()
          return 'alpha'
        }
        if (z !== Z || n !== N) view.set(z, n)
        return null
      },
      update(dt, t, amp = 0) {
        const counts = { p: 0, n: 0 }
        const k = 1 - Math.exp(-dt * 8)
        for (const q of list) {
          q.pos.lerp(q.target, k)
          M4.makeTranslation(q.pos.x + (amp ? Math.sin(t * 31 + q.seed) * amp : 0), q.pos.y + (amp ? Math.sin(t * 27 + q.seed * 1.7) * amp : 0), q.pos.z + (amp ? Math.sin(t * 35 + q.seed * 2.3) * amp : 0))
          if (counts[q.kind] < cap) im[q.kind].setMatrixAt(counts[q.kind]++, M4)
        }
        for (const kk of ['p', 'n']) {
          im[kk].count = counts[kk]
          im[kk].instanceMatrix.needsUpdate = true
        }
        group.rotation.y = t * 0.25
        glow.scale.setScalar(radius() * 4.2)
      },
    }
    return view
  }
  const M4 = new THREE.Matrix4()

  // little things flying: a neutron in, an electron out, an alpha out
  const bits = [] // { obj, from, to, vel, age, life, parent, onEnd }
  const bitGeo = new THREE.SphereGeometry(1, 12, 8)
  const bitMats = {
    n: new THREE.MeshStandardMaterial({ color: COLORS.n, emissive: COLORS.n, emissiveIntensity: 0.5 }),
    p: new THREE.MeshStandardMaterial({ color: COLORS.p, emissive: COLORS.p, emissiveIntensity: 0.6 }),
    e: new THREE.MeshBasicMaterial({ color: hdr(COLORS.e, 2.4) }),
  }
  const bit = (kind, size, parent, from, { to = null, vel = null, life = 0.5, onEnd = null } = {}) => {
    const o = new THREE.Mesh(bitGeo, bitMats[kind])
    o.scale.setScalar(size)
    o.position.copy(from)
    parent.add(o)
    bits.push({ obj: o, from: from.clone(), to, vel, age: 0, life, parent, onEnd, streak: kind === 'e' })
    return o
  }

  // =====================================================================================================
  // The slow capture, inside an old giant
  // =====================================================================================================
  const slowG = new THREE.Group()
  slowG.position.copy(PLACES.slow)
  root.add(slowG)
  // the giant's helium layer all round: a warm glowing haze, hotter below (toward the core)
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() { vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; varying vec3 vP;
      ${NOISE}
      void main() {
        float h = vP.y;
        float n = fbm(vP * 3.0 + vec3(uTime * 0.03, 0.0, uTime * 0.02));
        vec3 deep = vec3(0.55, 0.16, 0.05);
        vec3 top = vec3(0.12, 0.03, 0.06);
        vec3 c = mix(deep, top, smoothstep(-0.6, 0.7, h)) * (0.55 + 0.75 * n);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false,
  })
  const haze = new THREE.Mesh(new THREE.SphereGeometry(26, 48, 32), hazeMat)
  haze.renderOrder = -5
  slowG.add(haze)
  // helium nuclei drifting in the haze
  const MOTES = light ? 160 : 420
  const moteGeo = new THREE.BufferGeometry()
  const motePos = new Float32Array(MOTES * 3)
  for (let i = 0; i < MOTES; i++) motePos.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 30], i * 3)
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: hdr('#ffd9a0', 1.3), size: 0.14, map: GLOW, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }))
  slowG.add(motes)
  // where the neutrons come from: carbon-13 meeting helium (a soft green cloud on the left)
  const pocket = sprite('#7ff0c0', 3.2, 0.5)
  pocket.position.set(-3.6, 1.2, -0.6)
  slowG.add(pocket)
  // (the 3D fonts have no superscripts and no arrows)
  const pocketText = makeText('13C + 4He  >  16O + n', { font: 'body', size: 0.14, color: '#9fd8c2' })
  pocketText.position.set(-3.6, 0.2, -0.6)
  slowG.add(pocketText)
  const sNuc = nucleusView(0.12, 140)
  slowG.add(sNuc.group)
  const sLabel = makeText('', { size: 0.24, color: '#d9def2', outlineWidth: 0.01, outlineColor: '#2a1430' })
  slowG.add(sLabel)
  const sHit = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  slowG.add(sHit)
  let sZ = SEED.Z
  let sN = SEED.N
  let sCount = 0
  let sEvent = null // the last thing the slow nucleus did: { op, from: { Z, N }, to: { Z, N } }
  let sTc = false
  let sCheck = null // when the nucleus on show next checks whether it decays
  let rate = 0 // the neutron rain (personal)
  let rainAt = 0
  const showSlowLabel = () => {
    sLabel.text = `${ELEMENTS[sZ - 1].symbol}-${sZ + sN}`
    sLabel.sync()
  }
  sNuc.set(sZ, sN)
  showSlowLabel()

  // =====================================================================================================
  // The rapid capture: two neutron stars
  // =====================================================================================================
  const rapidG = new THREE.Group()
  rapidG.position.copy(PLACES.rapid)
  root.add(rapidG)
  const pair = new THREE.Group()
  rapidG.add(pair)
  const nsMat = new THREE.MeshBasicMaterial({ color: hdr('#d8f6ff', 2.4) })
  const twins = [0, 1].map(() => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), nsMat), sprite('#9fdcff', 1.3, 0.8))
    pair.add(g)
    return g
  })
  const TRAIL = 70
  const trails = twins.map(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    const col = new Float32Array(TRAIL * 3)
    for (let i = 0; i < TRAIL; i++) col.set([0.4 * (1 - i / TRAIL), 0.8 * (1 - i / TRAIL), 1.2 * (1 - i / TRAIL)], i * 3)
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
    line.frustumCulled = false
    pair.add(line)
    return { geo, pts: [] }
  })
  const pairHit = new THREE.Mesh(new THREE.SphereGeometry(2.1, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  pair.add(pairHit)
  // ripples of space (gravitational waves) in the orbit's plane
  const waveMat = new THREE.MeshBasicMaterial({ color: hdr('#8fb8ff', 1.2), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const waves = Array.from({ length: 6 }, () => {
    const w = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 96), waveMat.clone())
    w.rotation.x = -Math.PI / 2
    w.visible = false
    rapidG.add(w)
    return { w, age: 9 }
  })
  let waveAt = 0
  // the kilonova: a cloud of neutron-rich matter, blue at first, then red (the lanthanides' glow)
  const CLOUD = light ? 900 : 2400
  const cloudGeo = new THREE.BufferGeometry()
  const cDir = new Float32Array(CLOUD * 3)
  const cPos = new Float32Array(CLOUD * 3)
  const cSp = new Float32Array(CLOUD)
  for (let i = 0; i < CLOUD; i++) {
    const u = (Math.random() * 2 - 1) * (Math.random() < 0.6 ? 0.45 : 1) // more of it in the orbit's plane
    const a = Math.random() * TAU
    const s = Math.sqrt(1 - u * u)
    cDir.set([Math.cos(a) * s, u, Math.sin(a) * s], i * 3)
    cSp[i] = 0.35 + Math.random() * 0.65
  }
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3))
  const cloudMat = new THREE.PointsMaterial({ color: hdr('#7fb0ff', 1.4), size: 0.2, map: GLOW, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
  const cloud = new THREE.Points(cloudGeo, cloudMat)
  cloud.frustumCulled = false
  cloud.visible = false
  rapidG.add(cloud)
  const cloudGlow = sprite('#ff6a50', 6, 0)
  rapidG.add(cloudGlow)
  const cloudHit = new THREE.Mesh(new THREE.SphereGeometry(3.2, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  rapidG.add(cloudHit)
  const rFlash = sprite('#ffffff', 1, 0)
  rapidG.add(rFlash)
  const rNuc = nucleusView(0.1, 170)
  rapidG.add(rNuc.group)
  rNuc.group.visible = false
  const rLabel = makeText('', { size: 0.22, color: '#d9def2', outlineWidth: 0.01, outlineColor: '#1a1030' })
  rapidG.add(rLabel)
  const PATH = rPath()
  const PRODUCTS = rProducts(PATH)
  const R_ELEMENTS = elementsOf(PRODUCTS)
  let rPhase = 'orbit' // orbit, merge, flood, cool, decay, done
  let rT = 0 // seconds since the phase began
  let rN = 0
  let rK = 0 // how far along the path the nucleus on show is
  let orbitAng = 0
  let rFlashAt = -10
  const rTimed = () => rPhase === 'merge' || rPhase === 'flood' || rPhase === 'decay'
  const showRapidLabel = () => {
    const s = PATH[rK]
    rLabel.text = `${ELEMENTS[s.Z - 1].symbol}-${s.Z + s.N}`
    rLabel.sync()
  }

  // =====================================================================================================
  // What has been made, the missions, the HUD
  // =====================================================================================================
  const made = new Map([[1, 'b'], [2, 'b'], [3, 'b']]) // atomic number -> source (data/origins.js ids)
  let newly = [] // the elements lit last (the HUD makes them pulse a few seconds)
  let newlyAt = 0
  const lightUp = (zs, src) => {
    const fresh = zs.filter(z => !made.has(z))
    for (const z of fresh) made.set(z, src)
    if (fresh.length) {
      newly = fresh
      newlyAt = clock
      ctx.share('made')
    }
    return fresh
  }
  const event = ev => {
    for (const ms of MISSIONS) {
      if (!isFound(`stars:${ms.id}`) && ms.check(ev, { made: made.size }) && markFound(`stars:${ms.id}`)) {
        track('mission', { id: `stars:${ms.id}` })
        play('celebrate')
        store.set({ starsCelebrate: { id: ms.id, name: ms.name[lang()] ?? ms.name.en, at: performance.now() } })
      }
    }
  }
  let dirty = true
  const report = () => {
    const { i, f } = here()
    store.set({
      stars: {
        place, m, x, lit, i, f, ids: phases().map(p => p.id), kind: kindOf(m),
        end: end ? { kind: end.kind, remnant: end.remnant, notYet: end.notYet } : null,
        slow: { Z: sZ, N: sN, n: sCount, ev: sEvent, tc: sTc, rate },
        rapid: { phase: rPhase, k: rK, total: PATH.length, Z: PATH[rK].Z, N: PATH[rK].N, count: R_ELEMENTS.length },
        made: [...made.entries()], newly,
        done: MISSIONS.filter(ms => isFound(`stars:${ms.id}`)).map(ms => ms.id),
      },
    })
    dirty = false
  }
  const changed = () => {
    dirty = true
  }

  // ---- the star's steps ----
  const srcOf = () => (m < 8 ? 'l' : 'm')
  /** Light the phases up to i (their products, their discoveries) after the visitor moved there. */
  const reach = (i, mine) => {
    const ph = phases()
    const fresh = []
    for (let k = Math.max(0, reached + 1); k <= i && k < ph.length; k++) {
      if (mine) {
        fresh.push(...lightUp(ph[k].makes, srcOf()))
        event({ type: 'phase', id: ph[k].id, m })
      }
    }
    if (fresh.length) flySymbols(fresh, starG, radiusNow + 0.4)
    reached = Math.max(reached, i)
  }
  /** A new star of this mass, not shining yet. */
  const newStar = (mine = true) => {
    x = 0
    lit = false
    end = null
    reached = -1
    starN++
    hideEnd()
    if (mine) {
      play('select')
      ctx.share('star')
    }
    changed()
  }
  const setMass = (v, mine = true) => {
    m = clamp(v, M_MIN, M_MAX)
    if (mine) track('stars', { op: 'mass', m: Number(m.toFixed(2)) })
    newStar(mine)
  }
  const pick = id => {
    const s = NURSERY.find(q => q.id === id)
    if (s) setMass(s.m)
  }
  let lifeSentAt = -9
  let lifeDue = false // a slider's last value still to send
  const setLife = (v, mine = true) => {
    if (end) {
      end = null
      hideEnd()
    }
    lit = true
    x = clamp(v)
    const { i } = here()
    reach(i, mine)
    if (mine && clock - lifeSentAt > 0.25) {
      lifeSentAt = clock
      ctx.share('star')
    } else if (mine) lifeDue = true
    changed()
  }
  const tapCore = (mine = true) => {
    if (end) return tapRemnant(mine)
    const ph = phases()
    if (mine) track('stars', { op: 'core', m: Number(m.toFixed(2)) })
    if (!lit) {
      lit = true
      x = 0
      play('beam')
      reach(0, mine)
    } else {
      const { i } = here()
      if (i >= ph.length - 1) return die(mine)
      x = (i + 1) / ph.length
      play('proton')
      reach(i + 1, mine)
    }
    if (mine) ctx.share('star')
    changed()
    return true
  }
  const tapShell = () => {
    if (!lit || end || phases()[here().i]?.id !== 'agb') return false
    goPlace('slow')
    return true
  }

  // ---- the end ----
  function hideEnd() {
    nebula.visible = false
    debris.visible = false
    remnant.visible = false
    flash.material.opacity = 0
    body.visible = true
    halo.visible = true
  }
  const showEnd = (age = 99) => {
    endAt = clock - age
    remnant.visible = true
    wd.visible = ['wd', 'heWD', 'oneWD'].includes(end.remnant)
    ns.visible = end.remnant === 'ns'
    bh.visible = end.remnant === 'bh'
    nebula.visible = end.kind === 'pn' || end.kind === 'one'
    debris.visible = end.kind === 'sn'
  }
  const die = (mine = true, age = 0) => {
    end = { ...endOf(m) }
    endR = Math.max(1, radiusNow)
    // it ends at the end of its life (a red dwarf's one burning, tapped at its start, lived it all)
    x = 1
    lit = true
    if (mine) starN++
    showEnd(age)
    if (age < 0.5) {
      if (end.kind === 'sn') play('bang')
      else play('decay', { order: 2 })
    }
    if (mine) {
      track('stars', { op: 'end', kind: end.kind, m: Number(m.toFixed(2)) })
      const fresh = lightUp(end.makes, 'm')
      if (fresh.length) flySymbols(fresh, starG, radiusNow + 0.4, 1.6)
      event({ type: 'end', kind: end.kind, remnant: end.remnant, m })
      ctx.share('star')
    }
    changed()
    return true
  }
  const tapRemnant = (mine = true) => {
    if (!end) return false
    if (end.remnant === 'ns') {
      if (rPhase === 'done') rapidAgain(mine)
      goPlace('rapid')
      return true
    }
    newStar(mine)
    return true
  }

  // ---- the slow capture's steps ----
  const sLight = z => {
    const fresh = lightUp([z], 'l')
    if (z === 43) sTc = true
    event({ type: 's', Z: z, N: sN })
    return fresh
  }
  /** A decay of the nucleus on show, if it cannot wait for the next neutron. */
  const sDecayNow = (mine, animate = true) => {
    const d = sDecay(sZ, sN)
    if (!d) return false
    const from = { Z: sZ, N: sN }
    sZ = d.Z
    sN = d.N
    sEvent = { op: d.mode, from, to: { Z: sZ, N: sN } }
    const out = animate ? sNuc.morph(sZ, sN) : (sNuc.set(sZ, sN), null)
    if (out === 'e') {
      bit('e', 0.05, slowG, V3(0, sNuc.radius(), 0), { vel: V3(2.5, 3.5, 1.5), life: 0.9 })
      play('electron')
    } else if (out === 'alpha') {
      for (const [k, dx] of [['p', -0.1], ['p', 0.1], ['n', 0], ['n', 0.05]]) bit(k, 0.12, slowG, V3(dx, sNuc.radius(), 0.05), { vel: V3(1.8, 2.6, 0.6), life: 1.2 })
      play('decay', { order: 2 })
    }
    showSlowLabel()
    if (mine) {
      sLight(sZ)
      ctx.share('slow')
    }
    changed()
    return true
  }
  const tapNucleus = (mine = true, rain = false) => {
    // a nucleus still waiting to decay does so first (taps quicker than the decays)
    for (let k = 0; k < 4 && sDecayNow(mine, false); k++);
    sN++
    sCount++
    const from = { Z: sZ, N: sN - 1 }
    sEvent = { op: 'n', from, to: { Z: sZ, N: sN } }
    const start = pocket.position.clone()
    sNuc.morph(sZ, sN, sNuc.group.worldToLocal(slowG.localToWorld(start.clone())))
    play('neutron')
    showSlowLabel()
    sCheck = clock + S_DECAY_WAIT
    if (mine) {
      if (!rain) track('stars', { op: 's', z: sZ, n: sN })
      sLight(sZ)
      ctx.share('slow')
    }
    changed()
    return true
  }
  const setRate = r => {
    rate = clamp(r)
    changed()
  }
  const slowReset = (mine = true) => {
    sZ = SEED.Z
    sN = SEED.N
    sCount++
    sEvent = null
    sTc = false
    sNuc.set(sZ, sN)
    showSlowLabel()
    if (mine) ctx.share('slow')
    changed()
  }

  // ---- the rapid capture's steps ----
  const setRapid = (phase, t = 0) => {
    rPhase = phase
    rT = t
    if (phase === 'orbit') {
      rK = 0
      pair.visible = true
      cloud.visible = false
      cloudGlow.material.opacity = 0
      rNuc.group.visible = false
      rLabel.visible = false
      for (const tr of trails) tr.pts.length = 0
    }
    if (phase === 'merge') {
      rK = 0
      pair.visible = true
      cloud.visible = false
      rNuc.group.visible = false
      rLabel.visible = false
    }
    if (phase === 'flood' || phase === 'cool') {
      pair.visible = false
      cloud.visible = true
      rNuc.group.visible = true
      rLabel.visible = true
      rK = phase === 'cool' ? PATH.length - 1 : Math.min(PATH.length - 1, Math.floor(t * R_RATE))
      rNuc.set(PATH[rK].Z, PATH[rK].N)
      showRapidLabel()
    }
    if (phase === 'decay' || phase === 'done') {
      pair.visible = false
      cloud.visible = true
      rK = PATH.length - 1
      rNuc.group.visible = phase === 'decay'
      rLabel.visible = false
    }
    changed()
  }
  const tapPair = (mine = true) => {
    if (rPhase !== 'orbit') return false
    rN++
    setRapid('merge', 0)
    play('beam')
    if (mine) {
      track('stars', { op: 'merge' })
      ctx.share('rapid')
    }
    return true
  }
  const rapidAgain = (mine = true) => {
    rN++
    setRapid('orbit', 0)
    if (mine) ctx.share('rapid')
  }
  const tapCloud = (mine = true) => {
    if (rPhase === 'cool') {
      setRapid('decay', 0)
      play('decay', { order: 2 })
      const shown = [79, 78, 92, 90, 63, 53, 54, 38, 56, 82].filter(z => R_ELEMENTS.includes(z))
      flySymbols(shown, rapidG, 1.5, 1.8)
      if (mine) {
        track('stars', { op: 'cool' })
        lightUp(R_ELEMENTS, 'n')
        event({ type: 'r', elements: R_ELEMENTS })
        ctx.share('rapid')
      }
      return true
    }
    if (rPhase === 'done') {
      rapidAgain(mine)
      return true
    }
    return false
  }

  // the things to tap, by place
  clickable(surface, 'star', () => tapCore(), () => !end)
  clickable(faceA, 'star', hit => (isShell(hit) ? tapShell() : tapCore()), () => !end)
  clickable(faceB, 'star', hit => (isShell(hit) ? tapShell() : tapCore()), () => !end)
  clickable(remnantHit, 'star', () => tapRemnant(), () => !!end)
  clickable(sHit, 'slow', () => tapNucleus())
  clickable(pairHit, 'rapid', () => tapPair(), () => rPhase === 'orbit')
  clickable(cloudHit, 'rapid', () => tapCloud(), () => rPhase === 'cool' || rPhase === 'done')
  // on an old giant's cut face, the helium shell (between the carbon-oxygen core and the hydrogen shell)
  function isShell(hit) {
    if (phases()[here().i]?.id !== 'agb' || end) return false
    const r = body.worldToLocal(hit.point.clone()).length()
    return r > AGB_SHELL[0] - 0.02 && r < AGB_SHELL[1] + 0.02
  }

  // ---- places and the camera ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 2.5
  controls.maxDistance = 60
  let fly = null // { from, to, t }
  const goPlace = (p, mine = true) => {
    if (!PLACES[p] || (p === place && !fly)) return
    const from = controls.target.clone()
    const to = PLACES[p].clone()
    fly = { from, to, t: 0, offset: camera.position.clone().sub(controls.target) }
    place = p
    if (mine) {
      track('stars', { op: 'go', p })
      play('enter')
    }
    changed()
  }

  // ---- shared with the room (net/shared.js) ----
  const madeCode = { b: 'b', l: 'l', m: 'm', n: 'n' }
  const shared = {
    star: {
      get: () => ({ m: Number(m.toFixed(3)), x: Number(x.toFixed(4)), lit, end: end ? end.kind : null, n: starN }),
      set(s, live) {
        const mass = clamp(Number(s.m) || 1, M_MIN, M_MAX)
        const newLife = mass !== m || (s.n ?? 0) !== starN
        m = mass
        x = clamp(Number(s.x) || 0)
        lit = !!s.lit
        // (the furthest phase is where it stands: my own discoveries come when I move it on myself)
        reached = lit ? here().i : -1
        if (s.end && (!end || newLife)) die(false, live ? 0 : 99)
        else if (!s.end && end) {
          end = null
          hideEnd()
        }
        starN = s.n ?? starN
        changed()
      },
    },
    slow: {
      get: () => ({ Z: sZ, N: sN, n: sCount }),
      set(s, live) {
        const Z = Math.round(Number(s.Z))
        const N = Math.round(Number(s.N))
        if (!(Z >= 1 && Z <= 92 && N >= 0 && N <= 160)) return
        const from = { Z: sZ, N: sN }
        sZ = Z
        sN = N
        sCount = s.n ?? sCount
        if (live && (Z !== from.Z || N !== from.N)) {
          const out = sNuc.morph(Z, N, sNuc.group.worldToLocal(slowG.localToWorld(pocket.position.clone())))
          sEvent = { op: out === 'n' ? 'n' : out === 'e' ? 'B-' : out === 'alpha' ? 'A' : out === 'ec' ? 'EC' : 'set', from, to: { Z, N } }
          if (out === 'n') play('neutron')
          if (out === 'e') bit('e', 0.05, slowG, V3(0, sNuc.radius(), 0), { vel: V3(2.5, 3.5, 1.5), life: 0.9 })
        } else {
          sNuc.set(Z, N)
          sEvent = null
        }
        if (Z === 43) sTc = true
        sCheck = null
        showSlowLabel()
        changed()
      },
    },
    rapid: {
      get: () => ({ phase: rPhase, n: rN, t: rTimed() ? Number(rT.toFixed(1)) : 0 }),
      set(s, live, ago) {
        const ph = ['orbit', 'merge', 'flood', 'cool', 'decay', 'done'].includes(s.phase) ? s.phase : 'orbit'
        rN = s.n ?? rN
        let t = (Number(s.t) || 0) + (ph === 'merge' || ph === 'flood' || ph === 'decay' ? ago : 0)
        // run forward what unfolded while the state travelled
        let p = ph
        if (p === 'merge' && t > MERGE_S) {
          t -= MERGE_S
          p = 'flood'
        }
        if (p === 'flood' && t * R_RATE >= PATH.length - 1) {
          p = 'cool'
          t = 0
        }
        if (p === 'decay' && t > DECAY_S) {
          p = 'done'
          t = 0
        }
        setRapid(p, t)
        if (live && p === 'merge') play('beam')
        if (live && p === 'decay') flySymbols([79, 78, 92, 90, 63, 53].filter(z => R_ELEMENTS.includes(z)), rapidG, 1.5, 1.8)
      },
    },
    made: {
      get: () => ({ z: [...made.entries()].map(([z, s]) => `${z}${s}`) }),
      set(s) {
        if (!Array.isArray(s.z)) return
        const next = new Map()
        for (const code of s.z) {
          const mm = /^(\d{1,3})([blmn])$/.exec(String(code))
          if (mm && Number(mm[1]) >= 1 && Number(mm[1]) <= 118) next.set(Number(mm[1]), madeCode[mm[2]])
        }
        made.clear()
        for (const [z, src] of next) made.set(z, src)
        newly = []
        changed()
      },
    },
  }

  // ---- taps on the 3D ----
  let down = null
  const rayAt = e => {
    const r = canvas.getBoundingClientRect()
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
  }
  const hitAt = e => {
    if (fly) return null
    rayAt(e)
    let best = null
    for (const c of targets) {
      if (c.place !== place || !c.when()) continue
      let o = c.object
      let shown = true
      while (o) {
        if (!o.visible && o !== c.object) shown = false
        o = o.parent
      }
      if (!shown) continue
      const hit = ray.intersectObject(c.object, false)[0]
      if (hit && (!best || hit.distance < best.hit.distance)) best = { c, hit }
    }
    return best
  }
  const onDown = e => {
    down = { x: e.clientX, y: e.clientY, at: performance.now() }
  }
  const onUp = e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.at > 600) {
      down = null
      return
    }
    down = null
    const best = hitAt(e)
    if (best) best.c.onTap(best.hit)
  }
  const onMove = e => {
    if (e.pointerType === 'touch') return
    const can = !!hitAt(e)
    const cursor = can ? 'pointer' : ''
    if (canvas.style.cursor !== cursor) canvas.style.cursor = cursor
  }

  // ---- the frame ----
  const v = new THREE.Vector3()
  const colorNow = new THREE.Color('#ffd27a')
  const colorWant = new THREE.Color()
  let reportAt = 0
  const update = (dt, t) => {
    clock = t
    sky.userData.update(t)
    if (lifeDue && t - lifeSentAt > 0.25) {
      lifeDue = false
      lifeSentAt = t
      ctx.share('star')
    }

    // the star
    surfMat.uniforms.uTime.value = t
    faceMat.uniforms.uTime.value = t
    const ph = phases()
    const { i, f } = here()
    const phase = ph[i]?.id ?? 'h'
    const lk = lit ? lookOf(m, phase, f) : { radius: lookOf(m, 'h', 0).radius * 1.15, color: '#b8462e' }
    let R = lk.radius
    colorWant.set(lk.color)
    let bright = lit ? 0.95 : 0.5
    const age = t - endAt
    if (end) {
      if (end.kind === 'fade') {
        // a red dwarf turns blue and shrinks into a white dwarf
        const k = ease(age / 3)
        R *= 1 - k
        colorWant.set('#9fc4ff')
        body.visible = k < 0.98
        bright = 1.4
      } else if (end.kind === 'sn') {
        // the core collapses (the star dims and shrinks a moment), then the blast
        const k = ease(age / 0.5)
        body.visible = age < 0.5
        R *= 1 - 0.5 * k
        flash.material.opacity = age < 0.5 ? 0 : Math.max(0, 1 - (age - 0.5) / 1.6)
        flash.scale.setScalar(4 + (age - 0.5) * 30)
        const dr = Math.max(0, age - 0.45)
        const pos = debrisGeo.attributes.position.array
        const spread = endR * (1 + Math.min(dr, 20) * 1.1)
        for (let k2 = 0; k2 < DEBRIS; k2++) {
          const s = spread * (0.4 + dSpeed[k2] * 0.6)
          pos[k2 * 3] = dDir[k2 * 3] * s
          pos[k2 * 3 + 1] = dDir[k2 * 3 + 1] * s
          pos[k2 * 3 + 2] = dDir[k2 * 3 + 2] * s
        }
        debrisGeo.attributes.position.needsUpdate = true
        debrisMat.opacity = age < 0.45 ? 0 : 0.35 + 0.65 * Math.max(0, 1 - dr / 6)
        debrisMat.size = 0.16 * Math.min(2.2, Math.max(1, spread / 5))
        halo.visible = age < 0.5
      } else {
        // a planetary nebula: the envelope drifts away, the core is left
        const k = ease(age / 4)
        body.visible = k < 0.95
        R *= 1 - k
        nebula.scale.setScalar(endR * (1.1 + 0.9 * ease(age / 6)) + Math.min(age, 60) * 0.008)
        nebMat.uniforms.uO.value = Math.min(1, age / 1.5) * (0.55 + 0.45 * Math.max(0, 1 - age / 20))
        nebMat.uniforms.uTime.value = t
        halo.visible = k < 0.9
      }
      remnant.visible = age > (end.kind === 'sn' ? 0.6 : 1.5)
      ns.rotation.y = t * 6
      disc.rotation.z = t * 0.6
    }
    radiusNow = end ? Math.max(0.02, R) : damp(radiusNow, R, 3, dt)
    colorNow.lerp(colorWant, 1 - Math.exp(-dt * 2.5))
    surfMat.uniforms.uColor.value.copy(colorNow).multiplyScalar(1.15)
    surfMat.uniforms.uBright.value = bright
    surfMat.uniforms.uCells.value = phase === 'h' && lit ? 3.5 : 2.2
    faceMat.uniforms.uBright.value = lit ? 1 : 0.55
    body.scale.setScalar(radiusNow)
    halo.scale.setScalar(radiusNow * 3.1)
    halo.material.color.copy(colorNow)
    setLayers(layersOf(phase, f, lit), radiusNow)
    // the nursery in a row under the star, the chosen one ringed
    const narrow = camera.aspect < 0.8
    const gap = narrow ? 1.05 : 1.55
    const extent = !end ? radiusNow : end.kind === 'sn' ? Math.min(4, endR * 1.6) : end.kind === 'pn' || end.kind === 'one' ? Math.max(1, nebula.scale.x) : 1
    const lowY = -extent - 1.25
    nursery.position.y = damp(nursery.position.y, lowY, 3, dt)
    nursery.position.z = 0.6
    nStars.forEach(s => {
      s.g.position.set((s.i - 2) * gap, 0, 0)
      s.ball.rotation.y = t * 0.3
    })
    const chosen = nStars.find(s => Math.abs(s.m - m) < 1e-6)
    ring.visible = !!chosen
    if (chosen) {
      ring.position.copy(chosen.g.position)
      ring.scale.setScalar(chosen.size * 1.9 + 0.06 * Math.sin(t * 3))
      ring.lookAt(camera.position)
    }
    remnantHit.visible = !!end

    // the slow capture: a neutron rain, decays when they cannot wait
    if (place === 'slow' && rate > 0 && !fly && t >= rainAt) {
      rainAt = t + (2.2 - 2.05 * rate)
      tapNucleus(true, true)
    }
    if (sCheck != null && t >= sCheck) {
      sCheck = sDecayNow(true) ? t + S_DECAY_WAIT : null
    }
    hazeMat.uniforms.uTime.value = t
    motes.rotation.y = t * 0.01
    sNuc.update(dt, t, sDecay(sZ, sN) ? 0.012 : 0)
    sLabel.position.set(0, sNuc.radius() + 0.5, 0)
    sHit.scale.setScalar(Math.max(1, sNuc.radius() * 1.6))
    pocket.material.opacity = 0.42 + 0.12 * Math.sin(t * 1.7)

    // the rapid capture
    rT += dt
    if (rPhase === 'orbit' || rPhase === 'merge') {
      const k = rPhase === 'merge' ? clamp(rT / MERGE_S) : 0
      const a = 1.45 * (1 - k) ** 0.25 + 0.05
      const w = 1.1 * (1.5 / a) ** 1.5
      const ang = (rPhase === 'orbit' ? t * w : orbitAng + w * dt)
      orbitAng = ang
      twins.forEach((g, j) => {
        g.position.set(Math.cos(ang + j * Math.PI) * a, 0, Math.sin(ang + j * Math.PI) * a)
        const tr = trails[j]
        tr.pts.unshift(g.position.clone())
        if (tr.pts.length > TRAIL) tr.pts.length = TRAIL
        const arr = tr.geo.attributes.position.array
        for (let q = 0; q < TRAIL; q++) {
          const p = tr.pts[Math.min(q, tr.pts.length - 1)] ?? g.position
          arr[q * 3] = p.x
          arr[q * 3 + 1] = p.y
          arr[q * 3 + 2] = p.z
        }
        tr.geo.attributes.position.needsUpdate = true
      })
      // ripples, faster as they close in
      if (t > waveAt) {
        waveAt = t + (rPhase === 'merge' ? 0.12 + 0.3 * (1 - k) : 0.9)
        const free = waves.find(q => q.age > 3) ?? waves[0]
        free.age = 0
      }
      if (rPhase === 'merge' && rT >= MERGE_S) {
        setRapid('flood', 0)
        rFlashAt = t
        play('bang')
      }
    }
    for (const q of waves) {
      q.age += dt
      q.w.visible = q.age < 3 && (rPhase === 'orbit' || rPhase === 'merge' || t - rFlashAt < 3)
      q.w.scale.setScalar(0.8 + q.age * 3.2)
      q.w.material.opacity = 0.45 * Math.max(0, 1 - q.age / 3)
    }
    rFlash.material.opacity = Math.max(0, 1 - (t - rFlashAt) / 1.2)
    rFlash.scale.setScalar(2 + (t - rFlashAt) * 14)
    if (rPhase === 'flood') {
      const want = Math.min(PATH.length - 1, Math.floor(rT * R_RATE))
      if (want !== rK) {
        // catch up a step at a time while it is close, else jump
        if (want - rK <= 3) {
          while (rK < want) {
            rK++
            const s = PATH[rK]
            rNuc.morph(s.Z, s.N, V3((Math.random() - 0.5) * 6, 2.5, (Math.random() - 0.5) * 6))
          }
        } else {
          rK = want
          rNuc.set(PATH[rK].Z, PATH[rK].N)
        }
        showRapidLabel()
        if (t - reportAt > 0.15) dirty = true
      }
      if (rK >= PATH.length - 1) setRapid('cool', 0)
    }
    if (rPhase === 'decay' && rT > DECAY_S) setRapid('done', 0)
    // the cloud grows, blue then red
    if (cloud.visible) {
      const ct = rPhase === 'flood' ? rT : rPhase === 'decay' ? PATH.length / R_RATE + rT : PATH.length / R_RATE + 4
      const pos = cloudGeo.attributes.position.array
      const spread = 0.6 + Math.min(ct, 16) * 0.2
      for (let k = 0; k < CLOUD; k++) {
        const s = spread * (0.35 + cSp[k] * 0.65)
        pos[k * 3] = cDir[k * 3] * s
        pos[k * 3 + 1] = cDir[k * 3 + 1] * s
        pos[k * 3 + 2] = cDir[k * 3 + 2] * s
      }
      cloudGeo.attributes.position.needsUpdate = true
      cloudMat.color.copy(new THREE.Color('#7fb0ff').lerp(new THREE.Color('#ff5a3a'), clamp(ct / 12))).multiplyScalar(1.5)
      cloudGlow.material.opacity = 0.18 + 0.2 * clamp(ct / 12) + (rPhase === 'cool' || rPhase === 'done' ? 0.08 * Math.sin(t * 2.4) : 0)
      cloudGlow.scale.setScalar(spread * 3.6)
      cloud.rotation.y = t * 0.05
    }
    rNuc.update(dt, t, rPhase === 'cool' ? 0.02 : 0)
    if (rPhase === 'decay') rNuc.group.scale.setScalar(Math.max(0.01, 1 - rT / DECAY_S))
    else rNuc.group.scale.setScalar(1)
    rLabel.position.set(0, rNuc.radius() + 0.45, 0)
    cloudHit.visible = rPhase === 'cool' || rPhase === 'done'
    pairHit.visible = rPhase === 'orbit'

    // bits and flying symbols
    for (let k = bits.length - 1; k >= 0; k--) {
      const b = bits[k]
      b.age += dt
      if (b.vel) b.obj.position.addScaledVector(b.vel, dt)
      if (b.streak && b.vel) {
        b.obj.lookAt(b.obj.getWorldPosition(v).add(b.vel))
        b.obj.scale.set(0.05, 0.05, 0.2)
      }
      if (b.age > b.life) {
        b.parent.remove(b.obj)
        bits.splice(k, 1)
      }
    }
    for (let k = flyers.length - 1; k >= 0; k--) {
      const fl = flyers[k]
      fl.age += dt
      fl.obj.visible = fl.age > 0
      if (fl.age > 0) fl.obj.position.addScaledVector(fl.vel, dt)
      fl.obj.fillOpacity = Math.max(0, Math.min(1, fl.age * 4, (fl.life - fl.age) / 0.8))
      fl.obj.quaternion.copy(camera.quaternion)
      if (fl.age > fl.life) {
        fl.parent.remove(fl.obj)
        fl.obj.dispose()
        flyers.splice(k, 1)
      }
    }
    for (const lb of [sLabel, rLabel, pocketText, ...nStars.map(s => s.g.children[2])]) lb.quaternion.copy(camera.quaternion)

    // the camera: fly between places, and keep what is shown big in the part of the screen left free
    const target = PLACES[place]
    let span = 2.6
    let aimY = 0
    if (place === 'star') {
      const lowY = nursery.position.y - 0.5
      const top = extent
      span = Math.max((top - lowY) / 2 + 0.3, gap * 2 + 0.9)
      aimY = (top + lowY) / 2
    } else if (place === 'slow') span = Math.max(2.4, sNuc.radius() + 1.8)
    else span = cloud.visible ? Math.min(4.4, 1.2 + (rPhase === 'flood' ? rT : 8) * 0.2) + 0.6 : 2.4
    const free = ctx.engine.freeShare()
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const dist = Math.max(4, 1.12 * Math.max(span / (tan * Math.max(0.35, free.h)), span / (tan * camera.aspect * Math.max(0.35, free.w))))
    const aim = v.set(target.x, target.y + aimY, target.z)
    if (fly) {
      fly.t = Math.min(1, fly.t + dt / 1.4)
      const k = ease(fly.t)
      controls.target.lerpVectors(fly.from, aim, k)
      camera.position.copy(controls.target).add(fly.offset.clone().setLength(dist * (1 + Math.sin(k * Math.PI) * 0.6)))
      haze.visible = place === 'slow' ? k > 0.7 : k < 0.3 && fly.from.distanceTo(PLACES.slow) < 1
      if (fly.t >= 1) {
        fly = null
        changed()
      }
    } else {
      controls.target.lerp(aim, 1 - Math.exp(-dt * 2.5))
      const d = camera.position.distanceTo(controls.target)
      if (d < dist * 0.97 || d > dist * 1.4) camera.position.sub(controls.target).setLength(d + (dist * (d < dist ? 1 : 1.35) - d) * Math.min(1, dt * 2)).add(controls.target)
      haze.visible = place === 'slow'
    }
    controls.update()

    if (newly.length && t - newlyAt > 4) {
      newly = []
      dirty = true
    }
    if (dirty || (t - reportAt > 0.5 && rPhase === 'flood')) {
      reportAt = t
      report()
    }
  }

  const attach = () => {
    camera.position.set(0.4, 1.6, 9)
    controls.target.set(0, -0.6, 0)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointermove', onMove)
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointermove', onMove)
    canvas.style.cursor = ''
    controls.dispose()
    store.set({ stars: null, starsCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#03040c'), exposure: 1.0, envIntensity: 0.12, bloom: { strength: 0.85, radius: 0.5, threshold: 0.62 }, fov: 50 },
    attach,
    detach,
    update,
    refresh: () => report(),
    shared,
    // the steps, for the HUD and the probes (each does what a tap on its thing does)
    go: goPlace,
    pick,
    setMass,
    setLife,
    tapCore,
    tapShell,
    tapRemnant,
    tapNucleus,
    setRate,
    slowReset,
    tapPair,
    tapCloud,
    origins: () => event({ type: 'origins' }),
    // what the shared probe uses, one by one (an orbit world: no walking)
    interactables: [
      { id: 'core', onUse: () => tapCore() },
      { id: 'nursery', onUse: () => pick('fifteen') },
      { id: 'nucleus', onUse: () => tapNucleus() },
      { id: 'pair', onUse: () => tapPair() },
      { id: 'cloud', onUse: () => tapCloud() },
    ],
    /** For probes: where a thing to tap is on the screen ({ x, y } in CSS px), or null. */
    screenOf(what) {
      const o = { core: surface, nucleus: sHit, pair: pairHit, cloud: cloudHit, remnant: remnantHit }[what] ?? nStars.find(s => s.id === what)?.g
      if (!o) return null
      const p = o.getWorldPosition(new THREE.Vector3()).project(camera)
      const r = canvas.getBoundingClientRect()
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height }
    },
    spot: () => ({ place }),
    restoreSpot: s => {
      if (s?.place && PLACES[s.place]) {
        place = s.place
        controls.target.copy(PLACES[place])
        camera.position.copy(PLACES[place]).add(V3(0.4, 1.6, 9))
        changed()
      }
    },
    dispose() {
      GLOW.dispose()
    },
  }
}
