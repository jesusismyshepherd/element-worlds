// A stage for picture rooms (docs/knowledge/picture-rooms.md): a winter camp in the far north at night, as in
// Finnish Lapland. A trodden snowy clearing (a circle of `radius`, a bank of shovelled snow round it, kept low
// on the lake's side), a frozen lake beyond it to the north with patches of black ice, rounded fells all round
// with dark wooded slopes and snow on their tops, snowy spruces and bare birches, a red log hut with warm
// windows and a lantern by its door, a canvas tent lit from inside. Above: a dark, starry sky and the aurora
// (`stage.aurora`): curtains of light whose colour follows their height in the sky (`km` metres a kilometre),
// green from about 100 km, red above about 150 to 200 km, a purple fringe under the green in a storm; their
// folds sway and their rays run along them, faster in a storm. The aurora is the scene's main light: a
// hemisphere and a light from the north follow its strength (`aurora.set({ level, storm })`), and its glow
// shows in the black ice; the hut and the tent add their warm light. The environment's share is kept low.
// `groundAt(x, z)` gives the ground's height anywhere. `aurora.time` is the curtains' clock (a long exposure
// draws them at several moments).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { smooth, random, canvasTex } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'
import { ringWall } from '../kit.js'

const TAU = Math.PI * 2

// smooth value noise (0..1)
const hash = (i, j) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x, z) {
  const i = Math.floor(x)
  const j = Math.floor(z)
  const fx = x - i
  const fz = z - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fz * fz * (3 - 2 * fz)
  const a = hash(i, j) + (hash(i + 1, j) - hash(i, j)) * u
  const b = hash(i, j + 1) + (hash(i + 1, j + 1) - hash(i, j + 1)) * u
  return a + (b - a) * v
}
const fbm = (x, z) => noise(x, z) * 0.55 + noise(x * 2.1 + 7, z * 2.1 + 3) * 0.3 + noise(x * 4.3 + 1, z * 4.3 + 9) * 0.15

/** Distance from (x, z) to the segment a-b, in the ground plane. */
function toSegment(x, z, [ax, az], [bx, bz]) {
  const dx = bx - ax
  const dz = bz - az
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}

// the lake: a round one north of the camp, its south shore at the camp's edge
const LAKE = { x: 0, z: -182, r: 168 }
const lakeDist = (x, z) => Math.hypot(x - LAKE.x, z - LAKE.z)

/** The aurora's curtains, by default: [{ pts: [[x, z], ...] (its path), kmB, kmT (its bottom and top, km),
 *  strength, storm (1: only in a storm), seed }], in the aurora's own frame, which the stage scales up by
 *  `auroraScale` round the camp (the angles stay, and the curtains stand behind the fells). The main one
 *  stands beyond the lake's far shore, a fainter one behind it, one passing high over the camp, and one in
 *  the south that shows only in a storm. */
export const CURTAINS = [
  { pts: [[-420, -235], [-260, -290], [-120, -250], [0, -275], [110, -240], [240, -285], [420, -250]], kmB: 88, kmT: 300, strength: 1, storm: 0, seed: 1.3 },
  { pts: [[-520, -420], [-300, -470], [-80, -410], [120, -455], [330, -400], [520, -440]], kmB: 92, kmT: 290, strength: 0.6, storm: 0, seed: 4.1 },
  { pts: [[-380, -20], [-180, 5], [0, -25], [170, 10], [380, -15]], kmB: 95, kmT: 280, strength: 0.5, storm: 0, seed: 7.7 },
  { pts: [[-420, 170], [-150, 200], [100, 160], [420, 200]], kmB: 95, kmT: 300, strength: 0.75, storm: 1, seed: 2.9 },
]

/** The curtains of the aurora: one mesh for all (one draw call, one shader), its colour following the
 *  height (km) at every point. set({ level, storm }) (0 to 1): how bright, how stormy (faster folds and
 *  rays, more red, the purple fringe, the storm's curtains). */
function auroraCurtains({ curtains, km, scale, light }) {
  const pos = []
  const attrU = []
  const attrV = []
  const attrN = []
  const attrS = []
  const idx = []
  const STEP = light ? 6 : 3.5
  const ROWS = light ? 12 : 18
  let base = 0
  for (const c of curtains) {
    const curve = new THREE.CatmullRomCurve3(c.pts.map(([x, z]) => new THREE.Vector3(x, 0, z)))
    const len = curve.getLength()
    const cols = Math.max(2, Math.round(len / STEP))
    for (let i = 0; i <= cols; i++) {
      const u = i / cols
      const p = curve.getPointAt(u)
      const tan = curve.getTangentAt(u)
      const n = new THREE.Vector2(-tan.z, tan.x).normalize()
      for (let j = 0; j <= ROWS; j++) {
        // rows closer together near the bottom, where the edge and the green are
        const v = Math.pow(j / ROWS, 1.6)
        const k = c.kmB + (c.kmT - c.kmB) * v
        pos.push(p.x, k * km, p.z)
        attrU.push(u * len, u)
        attrV.push(v)
        attrN.push(n.x, n.y)
        attrS.push(c.strength, c.storm, c.seed)
      }
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < ROWS; j++) {
        const a = base + i * (ROWS + 1) + j
        const b = a + ROWS + 1
        idx.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
    base += (cols + 1) * (ROWS + 1)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('aU', new THREE.Float32BufferAttribute(attrU, 2))
  geo.setAttribute('aV', new THREE.Float32BufferAttribute(attrV, 1))
  geo.setAttribute('aN', new THREE.Float32BufferAttribute(attrN, 2))
  geo.setAttribute('aS', new THREE.Float32BufferAttribute(attrS, 3))
  geo.setIndex(idx)
  geo.computeBoundingSphere()
  const uniforms = {
    uTime: { value: 0 },
    uLevel: { value: 0.6 },
    uStorm: { value: 0 },
    uKm: { value: km },
  }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
    vertexShader: /* glsl */ `
      attribute vec2 aU; attribute float aV; attribute vec2 aN; attribute vec3 aS;
      uniform float uTime; uniform float uStorm; uniform float uKm;
      varying float vU; varying float vV; varying float vKm; varying float vS; varying float vEnd;
      void main() {
        vec3 p = position;
        float t = uTime * (0.55 + 0.9 * uStorm);
        float u = aU.x;
        // the folds sway across the curtain; the lower edge ripples
        float sway = sin(u * 0.019 + t * 0.11 + aS.z) * 10.0 + sin(u * 0.061 - t * 0.27 + aS.z * 2.0) * 3.5 * (1.0 + uStorm);
        p.x += aN.x * sway;
        p.z += aN.y * sway;
        float rip = (sin(u * 0.043 + t * 0.35 + aS.z) * 3.2 + sin(u * 0.12 - t * 0.8) * 1.2) * (1.0 - 0.6 * aV);
        p.y += rip * uKm;
        vKm = p.y / uKm;
        vU = u;
        vV = aV;
        // a storm's curtains come only with the storm
        vS = aS.x * mix(1.0, uStorm, aS.y);
        vEnd = smoothstep(0.0, 0.12, aU.y) * smoothstep(1.0, 0.88, aU.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uLevel; uniform float uStorm;
      varying float vU; varying float vV; varying float vKm; varying float vS; varying float vEnd;
      float h1(float n) { return fract(sin(n) * 43758.5453); }
      float n1(float x) { float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
      void main() {
        float t = uTime * (0.55 + 0.9 * uStorm);
        // rays: thin vertical streaks running along the curtain, and brighter folds travelling slower
        float r = n1(vU * 0.21 + t * 0.9) * 0.55 + n1(vU * 0.63 - t * 1.6) * 0.45;
        r = 0.18 + 1.25 * r * r;
        float fold = 0.65 + 0.55 * sin(vU * 0.011 - t * 0.33) * sin(vU * 0.027 + t * 0.21);
        float km = vKm;
        // oxygen's green: a sharp lower edge near 100 km, brightest just above it, fading upward
        float edge = smoothstep(96.0, 101.0, km);
        float g = edge * exp(-max(km - 104.0, 0.0) / 42.0) * (1.0 - 0.9 * smoothstep(150.0, 215.0, km));
        // oxygen's red, high up: faint on a calm night, stronger in a storm
        float rd = smoothstep(150.0, 225.0, km) * exp(-max(km - 235.0, 0.0) / 110.0) * (0.2 + 0.36 * uStorm);
        // nitrogen's purple fringe under the green, in a storm
        float fr = uStorm * smoothstep(88.0, 92.5, km) * (1.0 - smoothstep(97.0, 101.0, km));
        float top = 1.0 - smoothstep(0.82, 1.0, vV);
        vec3 c = vec3(0.16, 1.0, 0.42) * g * 1.15 + vec3(1.0, 0.07, 0.16) * rd + vec3(0.62, 0.16, 1.0) * fr * 0.9;
        c *= r * fold * top * vS * vEnd * uLevel;
        gl_FragColor = vec4(c, 1.0);
      }`,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.scale.setScalar(scale)
  mesh.frustumCulled = false
  mesh.renderOrder = -5
  mesh.raycast = () => {}
  return {
    mesh,
    uniforms,
    set({ level, storm }) {
      if (level != null) uniforms.uLevel.value = level
      if (storm != null) uniforms.uStorm.value = storm
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}

/** A white birch in winter: its trunk (with dark marks) and a crown of bare twigs, as two geometries
 *  (a mesh each for every birch). */
function birchGeometries() {
  const trunk = new THREE.CylinderGeometry(0.09, 0.14, 6.5, 8, 1).translate(0, 3.25, 0)
  const twigs = []
  const rnd = random(77)
  for (let i = 0; i < 9; i++) {
    const len = 1.6 + rnd() * 1.6
    const g = new THREE.CylinderGeometry(0.012, 0.035, len, 4, 1).translate(0, len / 2, 0)
    const a = (i / 9) * TAU + rnd()
    g.rotateZ(0.45 + rnd() * 0.35)
    g.rotateY(a)
    g.translate(0, 3.2 + rnd() * 2.6, 0)
    twigs.push(g)
  }
  // the fine twigs at the top, a dark haze
  const haze = new THREE.SphereGeometry(1.25, 10, 8).scale(1, 1.5, 1).translate(0, 6.1, 0)
  return { trunk, twigs: mergeGeometries(twigs), haze }
}

/**
 * radius: the camp's walkable circle; km: metres of sky for each kilometre of height in the aurora's own frame,
 * auroraScale: how much that frame is scaled up round the camp (`kmWorld`: metres a kilometre in the room);
 * hut: { x, z, rot } (its door faces +z turned by rot); tent: { x, z }; birches: [[x, z, scale]] in or by the
 * camp (more grow outside it by themselves); paths: polylines [[x, z], ...] of trodden snow in the camp;
 * clearings: [[x, z, r]]; curtains: the aurora's (CURTAINS by default).
 */
export function arcticStage({ radius = 13, km = 0.36, auroraScale = 3.5, light = false, pixelRatio = 1, hut = { x: -8.6, z: 5.4, rot: 0.9 }, tent = { x: 8.4, z: 4.6 }, birches = [], paths = [], clearings = [], curtains = CURTAINS } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const EDGE = radius + 0.6
  const rnd = random(4127)

  /** The ground's height: the flat camp, the snowfield's gentle roll, the frozen lake, the fells round it. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0
    const out = smooth(EDGE, EDGE + 20, r)
    let h = (fbm(x * 0.018 + 3, z * 0.018 + 5) - 0.5) * 5 * out
    // the lake: flat ice, the shore easing down to it
    const d = lakeDist(x, z)
    const lake = 1 - smooth(LAKE.r - 6, LAKE.r + 14, d)
    h = h * (1 - lake) - 0.35 * lake
    // the fells, round the lake and behind the camp: wooded slopes, bare snowy tops
    const a = Math.atan2(z - LAKE.z, x - LAKE.x)
    const rise = smooth(LAKE.r + 70, LAKE.r + 330, d)
    if (rise > 0) {
      // lower in the north, so the aurora shows over them
      const north = 1 - 0.4 * Math.max(0, -Math.sin(a))
      const top = 55 + 75 * fbm(Math.cos(a) * 2.6 + 11, Math.sin(a) * 2.6 + 4) + 18 * Math.sin(a * 7 + 1.3)
      h += Math.pow(rise, 1.5) * top * north
    }
    return h
  }

  // ---- the sky: dark, starry, a teal glow low in the north where the aurora is ----
  const sky = nightSky({ radius: 1500, stars: light ? 1200 : 2800, top: '#02040c', mid: '#061226', horizon: '#0c2a36', pixelRatio })
  group.add(sky)
  const domeU = sky.children[0].material.uniforms
  const HORIZON_CALM = new THREE.Color('#0c2a36')
  const HORIZON_GLOW = new THREE.Color('#145a4c')

  // ---- the land: rings round the camp, close together near it ----
  const rings = []
  for (let r = 0; r < radius; r += 1.5) rings.push(r)
  for (let r = radius; r < EDGE + 24; r += 1.2) rings.push(r)
  for (let r = EDGE + 24; r < 160; r += 5) rings.push(r)
  for (let r = 160; r < 600; r += 10) rings.push(r)
  for (let r = 600; r <= 1300; r += 25) rings.push(r)
  const SEG = light ? 140 : 220
  const pos = []
  const col = []
  const idx = []
  const cSnow = new THREE.Color('#d9e3f1')
  const cIce = new THREE.Color('#aebfd6')
  const cWood = new THREE.Color('#203040')
  const cRock = new THREE.Color('#33405a')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * TAU
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      const y = groundAt(x, z)
      pos.push(x, y, z)
      const d = lakeDist(x, z)
      c.copy(cSnow).lerp(cIce, 1 - smooth(LAKE.r - 4, LAKE.r + 8, d))
      // the fells: dark wooded slopes below the snowy tops, rock where steep
      const rise = smooth(LAKE.r + 70, LAKE.r + 330, d)
      if (rise > 0.05) {
        const band = smooth(4, 22, y) * (1 - smooth(48, 85, y + (noise(x * 0.02, z * 0.02) - 0.5) * 30))
        c.lerp(cWood, band * 0.85)
        c.lerp(cRock, band * 0.25 * noise(x * 0.05, z * 0.05))
      }
      c.multiplyScalar(0.9 + noise(x * 0.12, z * 0.12) * 0.14)
      col.push(c.r, c.g, c.b)
    }
  }
  const W = SEG + 1
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < SEG; j++) {
      const a = i * W + j
      const b = (i + 1) * W + j
      // wound so the faces look up (counter-clockwise seen from above)
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  const landGeo = new THREE.BufferGeometry()
  landGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  landGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  landGeo.setIndex(idx)
  landGeo.computeVertexNormals()
  const snowMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })
  group.add(new THREE.Mesh(landGeo, snowMat))

  // ---- the camp: trodden snow, paths a little bluer where boots have packed it ----
  const PX = 1024
  const spanM = EDGE * 2
  const toPx = v => ((v + EDGE) / spanM) * PX
  const campTex = canvasTex(PX, PX, g => {
    g.fillStyle = '#dbe5f2'
    g.fillRect(0, 0, PX, PX)
    for (let i = 0; i < 9000; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(170,188,214,${0.15 + rnd() * 0.25})` : `rgba(250,252,255,${0.2 + rnd() * 0.4})`
      const s = 2 + rnd() * 9
      g.beginPath()
      g.ellipse(rnd() * PX, rnd() * PX, s, s * 0.5, rnd() * 3, 0, TAU)
      g.fill()
    }
    g.lineCap = 'round'
    g.lineJoin = 'round'
    const k = PX / spanM
    for (const [w, colr] of [[1.5, 'rgba(150,170,205,0.45)'], [1.1, 'rgba(138,160,198,0.7)']]) {
      g.strokeStyle = colr
      g.fillStyle = colr
      g.lineWidth = w * k
      for (const p of paths) {
        g.beginPath()
        p.forEach(([x, z], i) => (i ? g.lineTo(toPx(x), toPx(z)) : g.moveTo(toPx(x), toPx(z))))
        g.stroke()
      }
      for (const [x, z, r] of clearings) {
        g.beginPath()
        g.arc(toPx(x), toPx(z), (r + (w - 1.1) / 2) * k, 0, TAU)
        g.fill()
      }
    }
    // footprints along the paths
    g.fillStyle = 'rgba(110,130,170,0.35)'
    for (const p of paths) {
      for (let i = 1; i < p.length; i++) {
        const [ax, az] = p[i - 1]
        const [bx, bz] = p[i]
        const len = Math.hypot(bx - ax, bz - az)
        const ang = Math.atan2(bz - az, bx - ax)
        for (let s = 0; s < len; s += 0.45) {
          const side = (Math.round(s / 0.45) % 2 ? 1 : -1) * 0.13
          const x = ax + ((bx - ax) * s) / len - Math.sin(ang) * side
          const z = az + ((bz - az) * s) / len + Math.cos(ang) * side
          g.beginPath()
          g.ellipse(toPx(x), toPx(z), 0.13 * k, 0.06 * k, ang, 0, TAU)
          g.fill()
        }
      }
    }
  })
  disposers.push(() => campTex.dispose())
  const camp = new THREE.Mesh(new THREE.CircleGeometry(EDGE, 96), new THREE.MeshStandardMaterial({ map: campTex, roughness: 0.9 }))
  camp.rotation.x = -Math.PI / 2
  camp.position.y = 0.012
  group.add(camp)

  // ---- the snowbank round the camp, low on the lake's side ----
  const BANK = light ? 70 : 120
  const lumpGeo = new THREE.SphereGeometry(1, 10, 7)
  const lumps = new THREE.InstancedMesh(lumpGeo, new THREE.MeshStandardMaterial({ color: '#dfe8f4', roughness: 0.95 }), BANK)
  const o = new THREE.Object3D()
  for (let i = 0; i < BANK; i++) {
    const a = (i / BANK) * TAU + rnd() * 0.04
    const r = radius + 0.9 + rnd() * 0.5
    const north = Math.max(0, -Math.sin(a))
    const hgt = (0.45 + rnd() * 0.3) * (1 - 0.65 * smooth(0.55, 0.9, north))
    o.position.set(Math.cos(a) * r, 0, Math.sin(a) * r)
    o.rotation.set(0, rnd() * 6, 0)
    o.scale.set(0.9 + rnd() * 0.6, hgt, 0.7 + rnd() * 0.4)
    o.updateMatrix()
    lumps.setMatrixAt(i, o.matrix)
  }
  group.add(lumps)
  const solids = ringWall(radius)

  // ---- black ice on the lake: dark, polished, with the aurora's glow in it ----
  const iceU = { uLevel: { value: 0.6 }, uTime: { value: 0 } }
  const iceMat = new THREE.ShaderMaterial({
    uniforms: iceU,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vW;
      void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float uLevel; uniform float uTime; varying vec2 vUv; varying vec3 vW;
      float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
      void main() {
        vec2 p = vUv - 0.5;
        float shape = n2(vW.xz * 0.045) * 0.6 + n2(vW.xz * 0.11 + 7.0) * 0.4;
        float a = smoothstep(0.5, 0.62, shape) * smoothstep(0.5, 0.36, length(p));
        // the curtains' light in the ice: soft streaks running toward the camp
        float s = n2(vec2(vW.x * 0.09, vW.z * 0.006 + uTime * 0.05)) * 0.7 + 0.3;
        vec3 c = vec3(0.012, 0.03, 0.05) + vec3(0.05, 0.42, 0.22) * s * uLevel * 0.55;
        gl_FragColor = vec4(c, a * 0.9);
        #include <colorspace_fragment>
      }`,
  })
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(LAKE.r * 1.7, LAKE.r * 1.7), iceMat)
  ice.rotation.x = -Math.PI / 2
  ice.position.set(LAKE.x, -0.33, LAKE.z + 20)
  ice.renderOrder = 1
  group.add(ice)

  // ---- spruces, heavy with snow, round the lake and behind the camp ----
  const SPRUCES = light ? 110 : 260
  const firParts = []
  const capParts = []
  for (let k = 0; k < 4; k++) {
    const r0 = 1.25 - k * 0.27
    const y0 = 0.6 + k * 1.15
    firParts.push(new THREE.ConeGeometry(r0, 1.9, 8, 1).translate(0, y0 + 0.95, 0))
    capParts.push(new THREE.ConeGeometry(r0 * 0.86, 0.7, 8, 1).translate(0, y0 + 1.55, 0))
  }
  firParts.push(new THREE.CylinderGeometry(0.1, 0.14, 0.9, 6).translate(0, 0.45, 0))
  const firGeo = mergeGeometries(firParts)
  const capGeo = mergeGeometries(capParts)
  const firs = new THREE.InstancedMesh(firGeo, new THREE.MeshStandardMaterial({ color: '#16271f', roughness: 0.95 }), SPRUCES)
  const caps = new THREE.InstancedMesh(capGeo, new THREE.MeshStandardMaterial({ color: '#d2deee', roughness: 0.95 }), SPRUCES)
  let n = 0
  for (let tries = 0; n < SPRUCES && tries < SPRUCES * 12; tries++) {
    const a = rnd() * TAU
    const r = EDGE + 4 + Math.pow(rnd(), 1.6) * 230
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (lakeDist(x, z) < LAKE.r + 8) continue
    // thinner in the clearing south of the camp, so the frame behind the spawn stands in the open
    if (z > 0 && Math.abs(x) < 16 && r < 30) continue
    const s = 0.8 + rnd() * 0.9
    o.position.set(x, groundAt(x, z) - 0.1, z)
    o.rotation.set(0, rnd() * 6, 0)
    o.scale.set(s, s * (0.9 + rnd() * 0.4), s)
    o.updateMatrix()
    firs.setMatrixAt(n, o.matrix)
    caps.setMatrixAt(n, o.matrix)
    n++
  }
  firs.count = caps.count = n
  group.add(firs, caps)

  // ---- birches: the scene's, and more outside the camp ----
  const allBirches = [...birches]
  for (let tries = 0; allBirches.length < birches.length + (light ? 10 : 22) && tries < 400; tries++) {
    const a = rnd() * TAU
    const r = EDGE + 2 + rnd() * 26
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (lakeDist(x, z) < LAKE.r + 4 || (z > 0 && Math.abs(x) < 7)) continue
    allBirches.push([x, z, 0.75 + rnd() * 0.5])
  }
  const bg = birchGeometries()
  const barkTex = canvasTex(64, 256, (g, w, h) => {
    g.fillStyle = '#e9e6de'
    g.fillRect(0, 0, w, h)
    const r2 = random(5)
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(30,26,28,${0.5 + r2() * 0.4})`
      g.fillRect(r2() * w, r2() * h, 6 + r2() * 26, 1.5 + r2() * 3)
    }
  })
  disposers.push(() => barkTex.dispose())
  const trunks = new THREE.InstancedMesh(bg.trunk, new THREE.MeshStandardMaterial({ map: barkTex, roughness: 0.8 }), allBirches.length)
  const twigMat = new THREE.MeshStandardMaterial({ color: '#4a3638', roughness: 0.9 })
  const twigs = new THREE.InstancedMesh(bg.twigs, twigMat, allBirches.length)
  const haze = new THREE.InstancedMesh(bg.haze, new THREE.MeshStandardMaterial({ color: '#3b2a30', roughness: 1, transparent: true, opacity: 0.42, depthWrite: false }), allBirches.length)
  allBirches.forEach(([x, z, s = 1], i) => {
    o.position.set(x, groundAt(x, z), z)
    o.rotation.set((rnd() - 0.5) * 0.08, rnd() * 6, (rnd() - 0.5) * 0.08)
    o.scale.setScalar(s)
    o.updateMatrix()
    trunks.setMatrixAt(i, o.matrix)
    twigs.setMatrixAt(i, o.matrix)
    haze.setMatrixAt(i, o.matrix)
    if (Math.hypot(x, z) < radius + 0.5) solids.push(circle(x, z, 0.2 * s))
  })
  group.add(trunks, twigs, haze)

  // ---- the hut: red logs, a snowy roof, warm windows, a lantern by the door ----
  const warm = new THREE.MeshStandardMaterial({ color: '#ffd59a', emissive: '#ffa040', emissiveIntensity: 1.05, roughness: 0.5 })
  const white = new THREE.MeshStandardMaterial({ color: '#e8e4dc', roughness: 0.7 })
  const dark = new THREE.MeshStandardMaterial({ color: '#3a2a22', roughness: 0.85 })
  const snowCap = new THREE.MeshStandardMaterial({ color: '#e4ecf6', roughness: 0.9 })
  {
    const logs = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#7c2b22'
      g.fillRect(0, 0, w, h)
      for (let y = 0; y < h; y += 32) {
        const grd = g.createLinearGradient(0, y, 0, y + 32)
        grd.addColorStop(0, 'rgba(255,190,170,0.18)')
        grd.addColorStop(0.5, 'rgba(0,0,0,0)')
        grd.addColorStop(1, 'rgba(20,0,0,0.45)')
        g.fillStyle = grd
        g.fillRect(0, y, w, 32)
      }
    }, { repeat: true })
    logs.repeat.set(2, 1.2)
    disposers.push(() => logs.dispose())
    const W2 = 4.4
    const D2 = 3.4
    const H2 = 2.3
    const hutG = new THREE.Group()
    const walls = new THREE.Mesh(new THREE.BoxGeometry(W2, H2, D2), new THREE.MeshStandardMaterial({ map: logs, roughness: 0.85 }))
    walls.position.y = H2 / 2
    hutG.add(walls)
    // the gables and the roof
    const gable = new THREE.Shape()
    gable.moveTo(-W2 / 2, 0)
    gable.lineTo(W2 / 2, 0)
    gable.lineTo(0, 1.35)
    gable.closePath()
    const gableGeo = new THREE.ExtrudeGeometry(gable, { depth: D2, bevelEnabled: false }).translate(0, H2, -D2 / 2)
    hutG.add(new THREE.Mesh(gableGeo, walls.material))
    const slope = Math.atan2(1.35, W2 / 2)
    const half = Math.hypot(W2 / 2, 1.35) + 0.35
    for (const s of [-1, 1]) {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(half, 0.12, D2 + 0.7), dark)
      roof.position.set((s * half * Math.cos(slope)) / 2 - s * 0.05, H2 + 0.7, 0)
      roof.rotation.z = -s * slope
      const snow = new THREE.Mesh(new RoundedBoxGeometry(half - 0.05, 0.22, D2 + 0.6, 2, 0.08), snowCap)
      snow.position.set((s * half * Math.cos(slope)) / 2 - s * 0.12, H2 + 0.86, 0)
      snow.rotation.z = -s * slope
      hutG.add(roof, snow)
    }
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.45), new THREE.MeshStandardMaterial({ color: '#5a5550', roughness: 0.9 }))
    chimney.position.set(0.9, H2 + 1.2, -0.6)
    hutG.add(chimney)
    // the door and windows on the front (+z), a window on the side toward the camp
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.85, 0.08), dark)
    door.position.set(-1.1, 0.95, D2 / 2 + 0.03)
    hutG.add(door)
    const windowAt = (x, y, z, ry) => {
      const w = new THREE.Group()
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.7), warm)
      glass.position.z = 0.01
      w.add(glass)
      for (const [bw, bh, bx, by] of [[0.96, 0.08, 0, 0.39], [0.96, 0.08, 0, -0.39], [0.08, 0.86, 0.44, 0], [0.08, 0.86, -0.44, 0], [0.05, 0.7, 0, 0], [0.8, 0.05, 0, 0]]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.06), white)
        bar.position.set(bx, by, 0.03)
        w.add(bar)
      }
      w.position.set(x, y, z)
      w.rotation.y = ry
      hutG.add(w)
    }
    windowAt(0.75, 1.3, D2 / 2 + 0.01, 0)
    windowAt(W2 / 2 + 0.01, 1.3, 0.2, Math.PI / 2)
    // the lantern by the door
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.16), warm)
    lantern.position.set(-0.45, 1.9, D2 / 2 + 0.18)
    hutG.add(lantern)
    // steps of packed snow and a woodpile
    const logGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.9, 8).rotateZ(Math.PI / 2)
    const pile = new THREE.InstancedMesh(logGeo, new THREE.MeshStandardMaterial({ color: '#8a6a4a', roughness: 0.9 }), 15)
    let li = 0
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 5 - row && li < 15; k++) {
        o.position.set(0, 0.11 + row * 0.2, k * 0.23 - (4 - row) * 0.115)
        o.rotation.set(0, 0, 0)
        o.scale.setScalar(1)
        o.updateMatrix()
        pile.setMatrixAt(li++, o.matrix)
      }
    }
    pile.count = li
    pile.position.set(-W2 / 2 - 0.55, 0, 0.4)
    hutG.add(pile)
    hutG.position.set(hut.x, 0, hut.z)
    hutG.rotation.y = hut.rot
    group.add(hutG)
    solids.push(box(hut.x, hut.z, W2 + 0.3, D2 + 0.3, { rot: hut.rot }))
    const pileAt = new THREE.Vector3(-W2 / 2 - 0.55, 0, 0.4).applyAxisAngle(new THREE.Vector3(0, 1, 0), hut.rot)
    solids.push(circle(hut.x + pileAt.x, hut.z + pileAt.z, 0.6))
    // the window's light on the snow in front
    const front = new THREE.Vector3(0.4, 1.4, D2 / 2 + 1.1).applyAxisAngle(new THREE.Vector3(0, 1, 0), hut.rot)
    const lamp = new THREE.PointLight('#ffb466', light ? 2 : 2.6, 7, 1.8)
    lamp.position.set(hut.x + front.x, front.y, hut.z + front.z)
    group.add(lamp)
  }

  // ---- the tent: canvas over poles, glowing from the lamp inside ----
  {
    const tentG = new THREE.Group()
    const canvas = new THREE.MeshStandardMaterial({ color: '#8c7a5e', emissive: '#e07a30', emissiveIntensity: 0.16, roughness: 0.9, side: THREE.DoubleSide })
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.9, 3.2, 20, 1, true), canvas)
    cone.position.y = 1.6
    tentG.add(cone)
    const pole = new THREE.CylinderGeometry(0.03, 0.035, 1.0, 5)
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(pole, dark)
      const a = (i / 6) * TAU
      p.position.set(Math.cos(a) * 0.18, 3.35, Math.sin(a) * 0.18)
      p.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35)
      tentG.add(p)
    }
    // the open flap, bright inside
    const door = new THREE.Shape()
    door.moveTo(-0.45, 0)
    door.lineTo(0.45, 0)
    door.lineTo(0, 1.4)
    door.closePath()
    const doorM = new THREE.Mesh(new THREE.ShapeGeometry(door), warm)
    const toCamp = Math.atan2(-tent.x, -tent.z)
    doorM.position.set(Math.sin(toCamp) * 1.31, 0.02, Math.cos(toCamp) * 1.31)
    doorM.rotation.y = toCamp
    doorM.rotation.x = -0.52
    tentG.add(doorM)
    tentG.position.set(tent.x, 0, tent.z)
    group.add(tentG)
    solids.push(circle(tent.x, tent.z, 1.9))
    const lamp = new THREE.PointLight('#ffa255', light ? 2 : 2.6, 6, 1.8)
    lamp.position.set(tent.x + Math.sin(toCamp) * 2.8, 0.7, tent.z + Math.cos(toCamp) * 2.8)
    group.add(lamp)
  }

  // ---- glints in the snow ----
  const GL = light ? 160 : 520
  const gPos = new Float32Array(GL * 3)
  const gPh = new Float32Array(GL)
  for (let i = 0; i < GL; i++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (radius + 6)
    gPos.set([Math.cos(a) * r, 0.03, Math.sin(a) * r], i * 3)
    gPh[i] = rnd() * 100
  }
  const glintGeo = new THREE.BufferGeometry()
  glintGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
  glintGeo.setAttribute('aPhase', new THREE.BufferAttribute(gPh, 1))
  const glintMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScale: { value: pixelRatio }, uLevel: { value: 0.6 } },
    vertexShader: /* glsl */ `
      attribute float aPhase; uniform float uTime; uniform float uScale; varying float vK;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        // a glint flashes for a moment as the eye moves (here: as time goes)
        float s = sin(uTime * (0.7 + fract(aPhase) * 1.3) + aPhase);
        vK = pow(max(s, 0.0), 24.0);
        gl_PointSize = (2.0 + 2.5 * vK) * uScale * clamp(8.0 / -mv.z, 0.4, 1.6);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uLevel; varying float vK;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * vK;
        gl_FragColor = vec4(vec3(0.75, 1.0, 0.9) * a * (0.6 + uLevel), 1.0);
      }`,
  })
  const glints = new THREE.Points(glintGeo, glintMat)
  glints.raycast = () => {}
  group.add(glints)

  // ---- the aurora ----
  const aurora = auroraCurtains({ curtains, km, scale: auroraScale, light })
  group.add(aurora.mesh)

  // ---- light: the aurora's from above and from the north, a little starlight ----
  const hemi = new THREE.HemisphereLight('#5d7fa8', '#141a2a', 0.3)
  const north = new THREE.DirectionalLight('#7dffc4', 0.2)
  north.position.set(0, 140, -220)
  group.add(hemi, north, north.target)
  const SKY_CALM = new THREE.Color('#5d7fa8')
  const SKY_GREEN = new THREE.Color('#62e0aa')

  /** How bright the aurora is (0 to 1) and how stormy (0 to 1): its light on the camp follows. */
  const setAurora = ({ level = aurora.uniforms.uLevel.value, storm = aurora.uniforms.uStorm.value } = {}) => {
    aurora.set({ level, storm })
    iceU.uLevel.value = level
    glintMat.uniforms.uLevel.value = level
    hemi.color.copy(SKY_CALM).lerp(SKY_GREEN, Math.min(1, level * 0.9))
    hemi.intensity = 0.16 + 0.3 * level
    north.intensity = 0.08 + 0.4 * level + 0.2 * storm
    domeU.uHorizon.value.copy(HORIZON_CALM).lerp(HORIZON_GLOW, Math.min(1, level * 0.8 + storm * 0.3))
  }
  setAurora({ level: 0.6, storm: 0 })

  return {
    group,
    groundAt,
    solids,
    lake: LAKE,
    km,
    kmWorld: km * auroraScale,
    aurora: {
      time: aurora.uniforms.uTime,
      set: setAurora,
      get level() {
        return aurora.uniforms.uLevel.value
      },
      get storm() {
        return aurora.uniforms.uStorm.value
      },
      mesh: aurora.mesh,
    },
    env: {
      background: new THREE.Color('#02040c'),
      fog: new THREE.Fog('#0a1724', 500, 3000),
      exposure: 1.0,
      envIntensity: 0.06,
      bloom: { strength: 0.8, radius: 0.6, threshold: 0.7 },
      fov: 60,
      far: 3600,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      sky.userData.update?.(t)
      aurora.uniforms.uTime.value = t
      iceU.uTime.value = t
      glintMat.uniforms.uTime.value = t
    },
    dispose: () => {
      disposers.forEach(f => f())
      aurora.dispose()
    },
  }
}
