// A stage for picture rooms (docs/knowledge/picture-rooms.md): a granite upland at dusk, like the Serra da
// Estrela in radon's picture "How does a rock breathe out a gas?". A broad hilltop of short grass and heather
// among rounded granite boulders, the land falling away to a valley, far ridges crowned with tors, under a sky
// that glows pink where the Sun went down (`glow`, a direction on the ground plane) and turns violet overhead
// with the first stars. The last of the light comes softly from the front left; the glow behind gives the
// boulders a pink rim. Surfaces are mid-toned (a pale floor under the bloom washes a scene out).
// Options: `radius` (the walkable hilltop), `boulders: [[x, z, r, seed, squash]]` (the scene's own, solids
// added), `ring` (a loose ring of boulders round the edge, true by default), `clear: [[x, z, r]]` (places the
// ring and the heather keep free). Exported for later granite rooms: `GRANITE` (the picture's feldspar, quartz
// and mica colours), `boulderGeometry(r, opts)` (a weathered corestone with its grains as vertex colours),
// `graniteSpeckle()` (fine grain to lay over it); the stage gives `boulder(r, seed, opts)` sharing its material.
import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, smooth, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'
import { circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const C = c => new THREE.Color(c)

/** The picture's granite (tools/boards/Rn/rnkit.py): a grey-pink base, pink feldspar, grey quartz, black mica. */
export const GRANITE = {
  base: '#8a7e86',
  feld: ['#c58a8e', '#b9787f', '#d39a98'],
  quartz: ['#a7adba', '#9298a6', '#b8bcc6'],
  mica: ['#25252c', '#34333b'],
  lichen: ['#9aa48a', '#b4ad84'],
}

// smooth 3D value noise (0..1)
const h3 = (i, j, k) => {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453
  return s - Math.floor(s)
}
function noise3(x, y, z) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const k = Math.floor(z)
  const fx = x - i
  const fy = y - j
  const fz = z - k
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const w = fz * fz * (3 - 2 * fz)
  const l = (a, b, t) => a + (b - a) * t
  const x0 = l(l(h3(i, j, k), h3(i + 1, j, k), u), l(h3(i, j + 1, k), h3(i + 1, j + 1, k), u), v)
  const x1 = l(l(h3(i, j, k + 1), h3(i + 1, j, k + 1), u), l(h3(i, j + 1, k + 1), h3(i + 1, j + 1, k + 1), u), v)
  return l(x0, x1, w)
}
const fbm = (x, y, z) => noise3(x, y, z) * 0.6 + noise3(x * 2.1 + 5, y * 2.1, z * 2.1) * 0.28 + noise3(x * 4.3, y * 4.3 + 9, z * 4.3) * 0.12

/**
 * A weathered granite corestone, r metres across its widest half, resting on y = 0: a lumpy rounded block,
 * squashed (`squash`: height over width), its foot flattened into the ground, its grains as vertex colours
 * (pink feldspar blotches, grey quartz, black mica specks, pale lichen on top). `cut`: a z beyond which the
 * stone is sliced flat (the face of a boulder cut open). `detail`: the icosphere's subdivisions.
 */
export function boulderGeometry(r, { seed = 1, squash = 0.68, lump = 0.22, detail = 10, cut = null, dim = 0.82 } = {}) {
  let geo = new THREE.IcosahedronGeometry(1, detail)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo)
  const p = geo.attributes.position
  const o = seed * 7.31
  const sx = 1 + (random(seed)() - 0.5) * 0.3
  const sz = 1 + (random(seed + 1)() - 0.5) * 0.3
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    // rounded edges like a weathered block: between a sphere and a soft cube
    const cube = Math.pow(Math.pow(Math.abs(v.x), 4) + Math.pow(Math.abs(v.y), 4) + Math.pow(Math.abs(v.z), 4), 0.25)
    const k = 1 / (0.55 + 0.45 * cube)
    const n = fbm(v.x * 1.4 + o, v.y * 1.4, v.z * 1.4 - o) - 0.5
    const s = r * k * (1 + n * lump * 2)
    let x = v.x * s * sx
    let y = v.y * s * squash
    let z = v.z * s * sz
    // the foot sits in the ground
    const foot = -r * squash * 0.55
    if (y < foot) y = foot + (y - foot) * 0.15
    if (cut != null && z > cut) z = cut
    p.setXYZ(i, x, y - foot * 0.85, z)
  }
  geo.computeVertexNormals()
  // the grains as colours
  const cols = new Float32Array(p.count * 3)
  const c = new THREE.Color()
  const base = C(GRANITE.base)
  const feld = GRANITE.feld.map(C)
  const quartz = GRANITE.quartz.map(C)
  const mica = GRANITE.mica.map(C)
  const lichen = GRANITE.lichen.map(C)
  const nrm = geo.attributes.normal
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / r
    const y = p.getY(i) / r
    const z = p.getZ(i) / r
    c.copy(base)
    const f = noise3(x * 5.3 + o, y * 5.3, z * 5.3)
    const q = noise3(x * 6.1 - o, y * 6.1 + 3, z * 6.1)
    const m = noise3(x * 13 + o, y * 13 - 2, z * 13)
    if (f > 0.62) c.lerp(feld[Math.floor(f * 97) % 3], smooth(0.62, 0.7, f))
    else if (q > 0.66) c.lerp(quartz[Math.floor(q * 89) % 3], smooth(0.66, 0.74, q))
    if (m > 0.78) c.lerp(mica[Math.floor(m * 53) % 2], 0.85)
    // lichen where rain and light reach: on top
    const up = nrm.getY(i)
    const li = noise3(x * 2.2 + 11, y * 2.2, z * 2.2 - o)
    if (up > 0.35 && li > 0.6) c.lerp(lichen[Math.floor(li * 31) % 2], smooth(0.6, 0.72, li) * 0.6 * up)
    // weathered darker toward the ground
    c.multiplyScalar(dim * (0.78 + 0.22 * smooth(-0.3, 0.6, y)))
    cols.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
  // UVs for the fine speckle: a planar map, distortion hidden at that scale
  const uv = new Float32Array(p.count * 2)
  for (let i = 0; i < p.count; i++) uv.set([(p.getX(i) + p.getZ(i) * 0.6) / 0.9, (p.getY(i) + p.getZ(i) * 0.35) / 0.9], i * 2)
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

/** Fine granite grain (white feldspar glints, mica specks) laid over a boulder's colours; tiles. */
export function graniteSpeckle(seed = 4) {
  const rnd = random(seed)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#d8d8d8'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 900; i++) {
      const v = rnd()
      g.fillStyle = v < 0.45 ? `rgba(40,36,44,${0.25 + rnd() * 0.4})` : v < 0.8 ? `rgba(255,250,250,${0.2 + rnd() * 0.3})` : `rgba(230,160,170,${0.2 + rnd() * 0.3})`
      const s = 1 + rnd() * 3
      g.fillRect(rnd() * w, rnd() * h, s, s * (0.6 + rnd()))
    }
  }, { repeat: true })
}

/**
 * radius: the hilltop's walkable circle; boulders: the scene's own [[x, z, r, seed, squash]]; ring: a loose ring
 * of boulders round the edge; clear: [[x, z, r]] spots the ring and the heather keep free (paths, stations).
 */
export function torsStage({ radius = 11, light = false, boulders = [], ring = true, clear = [] } = {}) {
  const group = new THREE.Group()
  const disposers = []
  // where the Sun went down: behind the scene's stations (toward -z), a little to the left
  const glow = new THREE.Vector3(-0.25, 0, -1).normalize()
  const EDGE = radius + 0.8
  const FOOT = EDGE + 12
  const DROP = 8

  /** The ground's height: the flat hilltop, the slope, the valley's roll, the far ridges. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0.04 * Math.sin(x * 0.7 + z * 0.4) * Math.cos(z * 0.5 - x * 0.2) * smooth(2, EDGE, r)
    const a = Math.atan2(z, x)
    const s = smooth(EDGE, FOOT, r)
    let h = -DROP * s + (noise3(x * 0.05, 0, z * 0.05) - 0.5) * 2.2 * s
    const rise = smooth(64, 104, r)
    if (rise > 0) h += rise * (17 + 9 * Math.sin(a * 3 + 0.4) + 5 * Math.sin(a * 7 + 1.9) + 8 * (noise3(Math.cos(a) * 3 + 4, 1, Math.sin(a) * 3) - 0.5))
    return h
  }
  const keepFree = (x, z, pad = 0) => clear.some(([cx, cz, cr]) => Math.hypot(x - cx, z - cz) < cr + pad)

  // ---- the sky: pink where the Sun went down, violet overhead, the first stars ----
  const skyU = {
    uGlow: { value: glow.clone() },
    uZenith: { value: C('#141236') },
    uMid: { value: C('#3c2a68') },
    uHorizon: { value: C('#e2789c') },
    uSide: { value: C('#6a4a88') },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(160, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uGlow; uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uSide;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          float hp = clamp(h, 0.0, 1.0);
          // clamped before pow(): a hair below 0 gives NaN, which the bloom spreads as a black square
          vec3 up = mix(uMid, uZenith, pow(hp, 0.55));
          vec3 c = mix(uSide, up, smoothstep(0.0, 0.4, hp));
          vec2 dh = normalize(d.xz + vec2(1e-5));
          vec2 gh = normalize(uGlow.xz);
          float k = clamp(dot(dh, gh) * 0.5 + 0.5, 0.0, 1.0);
          float band = pow(1.0 - clamp(hp * 2.2, 0.0, 1.0), 2.0);
          c = mix(c, uHorizon, band * (0.22 + 0.78 * pow(k, 2.5)));
          c += uHorizon * 0.35 * pow(k, 6.0) * pow(1.0 - clamp(hp * 1.5, 0.0, 1.0), 3.0);
          // soft round glows in the pink, as the picture has
          c += vec3(0.9, 0.5, 0.7) * 0.05 * smoothstep(0.5, 0.0, length(d.xz - gh * 0.75) + abs(h - 0.32));
          if (h < 0.0) c = mix(c, uSide * 0.6, clamp(-h * 5.0, 0.0, 1.0));
          // stars, more of them higher up and away from the glow
          if (h > 0.0) {
            vec3 q = d * 300.0;
            vec3 cell = floor(q);
            float n = hash(cell);
            float star = step(0.9965, n) * (0.35 + 0.65 * hash(cell + 7.0)) * smoothstep(0.42, 0.08, length(fract(q) - 0.5));
            c += vec3(star) * smoothstep(0.12, 0.55, h) * (1.0 - 0.7 * pow(k, 3.0)) * 1.4;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- the land: rings round the hilltop, close together where the slope bends ----
  const rings = []
  for (let r = 0; r < EDGE; r += 1.5) rings.push(r)
  for (let r = EDGE; r < FOOT + 2; r += 0.6) rings.push(r)
  for (let r = FOOT + 2; r < 64; r += 2.5) rings.push(r)
  for (let r = 64; r <= 150; r += 3) rings.push(r)
  const SEG = light ? 96 : 160
  const pos = []
  const col = []
  const idx = []
  const cGrass = C('#2e3c27')
  const cSlope = C('#28301f')
  const cFloor = C('#1f2420')
  const cRidge = C('#3a3150')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * TAU
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      pos.push(x, groundAt(x, z), z)
      c.copy(cGrass).lerp(cSlope, smooth(EDGE, EDGE + 6, rings[i])).lerp(cFloor, smooth(EDGE + 6, FOOT + 10, rings[i])).lerp(cRidge, smooth(60, 96, rings[i]))
      // heather's purple-brown in patches
      const hn = noise3(x * 0.18, 3, z * 0.18)
      if (hn > 0.58) c.lerp(C('#3e2a3c'), smooth(0.58, 0.72, hn) * 0.6 * (1 - smooth(60, 80, rings[i])))
      c.multiplyScalar(0.86 + noise3(x * 0.4, 0, z * 0.4) * 0.28)
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
  const land = new THREE.Mesh(landGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }))
  group.add(land)

  // the hilltop: short grass, heather in patches, grit where the granite shows through
  const PX = 1024
  const span = EDGE * 2
  const toPx = v => ((v + EDGE) / span) * PX
  const rnd = random(23)
  const topTex = canvasTex(PX, PX, g => {
    g.fillStyle = '#34452b'
    g.fillRect(0, 0, PX, PX)
    for (let i = 0; i < 40; i++) {
      const x = rnd() * PX
      const y = rnd() * PX
      const r = 30 + rnd() * 90
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      const heather = rnd() < 0.55
      grd.addColorStop(0, heather ? 'rgba(84,52,78,0.75)' : 'rgba(118,108,104,0.45)')
      grd.addColorStop(1, heather ? 'rgba(84,52,78,0)' : 'rgba(118,108,104,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, r * 2, r * 2)
    }
    for (let i = 0; i < 12000; i++) {
      const v = rnd()
      g.fillStyle = v < 0.45 ? `rgba(24,40,24,${0.35 + rnd() * 0.4})` : v < 0.85 ? `rgba(70,96,58,${0.25 + rnd() * 0.35})` : `rgba(120,80,110,${0.25 + rnd() * 0.3})`
      g.fillRect(rnd() * PX, rnd() * PX, 1.5 + rnd() * 2, 3 + rnd() * 6)
    }
    for (let i = 0; i < 1600; i++) {
      const w = 100 + rnd() * 60
      g.fillStyle = `rgba(${w + 30},${w},${w + 10},${0.15 + rnd() * 0.25})`
      g.beginPath()
      g.arc(rnd() * PX, rnd() * PX, 1 + rnd() * 2.2, 0, TAU)
      g.fill()
    }
  })
  disposers.push(() => topTex.dispose())
  const topGeo = new THREE.CircleGeometry(EDGE, 96)
  {
    const tp = topGeo.attributes.position
    for (let i = 0; i < tp.count; i++) tp.setZ(i, groundAt(tp.getX(i), -tp.getY(i)))
    topGeo.computeVertexNormals()
  }
  const top = new THREE.Mesh(topGeo, new THREE.MeshStandardMaterial({ map: topTex, roughness: 1 }))
  top.rotation.x = -Math.PI / 2
  top.position.y = 0.012
  group.add(top)
  void toPx

  // ---- heather bushes and grass tufts ----
  const o = new THREE.Object3D()
  const HEATH = light ? 160 : 420
  const heathGeo = new THREE.IcosahedronGeometry(0.2, 1)
  const heath = new THREE.InstancedMesh(heathGeo, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), HEATH)
  const hc = ['#5a3852', '#4a3440', '#6b4560', '#3e3a2c', '#57483a'].map(C)
  let n = 0
  for (let tries = 0; n < HEATH && tries < HEATH * 8; tries++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (EDGE + 9)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (keepFree(x, z, 0.4) || noise3(x * 0.18, 3, z * 0.18) < 0.45) continue
    if (r < radius - 0.5 && rnd() < 0.6) continue
    o.position.set(x, groundAt(x, z) + 0.02, z)
    o.rotation.set(0, rnd() * TAU, 0)
    const s = 0.6 + rnd() * 1.1
    o.scale.set(s * (1 + rnd() * 0.5), s * (0.45 + rnd() * 0.35), s)
    o.updateMatrix()
    heath.setMatrixAt(n, o.matrix)
    heath.setColorAt(n, hc[Math.floor(rnd() * hc.length)])
    n++
  }
  heath.count = n
  group.add(heath)
  const TUFTS = light ? 260 : 800
  const tuftGeo = new THREE.ConeGeometry(0.04, 0.2, 4)
  tuftGeo.translate(0, 0.1, 0)
  const tufts = new THREE.InstancedMesh(tuftGeo, new THREE.MeshStandardMaterial({ color: '#4b6238', roughness: 1 }), TUFTS)
  n = 0
  for (let tries = 0; n < TUFTS && tries < TUFTS * 6; tries++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (radius + 0.5)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (keepFree(x, z, 0.1)) continue
    o.position.set(x, groundAt(x, z), z)
    o.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5)
    o.scale.set(0.7 + rnd() * 0.8, 0.5 + rnd() * 1.1, 0.7 + rnd() * 0.8)
    o.updateMatrix()
    tufts.setMatrixAt(n++, o.matrix)
  }
  tufts.count = n
  group.add(tufts)

  // ---- the granite: boulders on the hilltop, a ring round its edge, tors on the slopes and the far ridges ----
  const speckle = graniteSpeckle()
  speckle.repeat.set(1, 1)
  disposers.push(() => speckle.dispose())
  const stone = new THREE.MeshStandardMaterial({ vertexColors: true, map: speckle, roughness: 0.92, metalness: 0 })
  // far tors are dark shapes against the pink, as in the picture
  const far = new THREE.MeshStandardMaterial({ color: '#3e3460', roughness: 1, metalness: 0 })
  const geos = []
  const boulder = (r, seed, opts = {}) => {
    const geo = boulderGeometry(r, { seed, detail: r > 1.2 ? 12 : r > 0.6 ? 8 : 5, ...opts })
    geos.push(geo)
    return new THREE.Mesh(geo, opts.far ? far : stone)
  }
  const solids = ringWall(radius)
  const place = (x, z, r, seed, squash = 0.68, rot = seed * 1.7, opts = {}) => {
    const m = boulder(r, seed, { squash, ...opts })
    m.position.set(x, groundAt(x, z) - r * 0.06, z)
    m.rotation.y = rot
    group.add(m)
    return m
  }
  for (const [x, z, r, seed = 1, squash = 0.68] of boulders) {
    place(x, z, r, seed, squash)
    if (Math.hypot(x, z) < radius + 0.5) solids.push(circle(x, z, r * 0.92))
  }
  if (ring) {
    const N = light ? 18 : 30
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + Math.sin(i * 2.3) * 0.08
      const r = radius + 1.1 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 1.6
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (keepFree(x, z, 1)) continue
      const s = 0.45 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 0.9
      place(x, z, s, 30 + i, 0.55 + (i % 3) * 0.08)
    }
  }
  // tors: blocks piled on blocks, down the slope and on the skyline (seen dark against the pink)
  const tor = (x, z, size, seed, nBlocks) => {
    let y = groundAt(x, z)
    let s = size
    const opts = { far: Math.hypot(x, z) > 40, detail: Math.hypot(x, z) > 40 ? 4 : 7 }
    for (let k = 0; k < nBlocks; k++) {
      const m = boulder(s, seed + k * 13, { squash: 0.5 + (k % 2) * 0.08, ...opts })
      m.position.set(x + Math.sin(seed + k) * s * 0.25, y - s * 0.05, z + Math.cos(seed * 2 + k) * s * 0.2)
      m.rotation.y = seed + k
      group.add(m)
      y += s * 0.5 * 0.95
      s *= 0.72
    }
  }
  const torsAt = [
    [-30, -24, 3.4, 3], [24, -34, 2.8, 2], [36, 12, 3.0, 3], [-34, 20, 2.6, 2],
    [-62, -78, 6, 3], [8, -112, 7, 3], [70, -84, 6.5, 2], [104, -10, 6, 3], [-110, 6, 6.5, 2], [-70, 82, 5.5, 3], [60, 92, 6, 2],
  ]
  torsAt.forEach(([x, z, s, k], i) => tor(x, z, s, 70 + i * 7, k))

  // a few moths in the dusk air
  const moths = motes({ count: 60, radius: radius + 2, y0: 0.4, y1: 3.2, color: '#f4e6ff', size: 0.04, opacity: 0.55, speed: 0.12, light })
  group.add(moths.group)

  // ---- light: the last of the day from the front left, the sky's violet above, the glow's pink behind ----
  const hemi = new THREE.HemisphereLight('#b39ad6', '#2a3026', 1.15)
  const key = new THREE.DirectionalLight('#ffd2dc', 1.15)
  key.position.set(-9, 12, 11)
  const rim = new THREE.DirectionalLight('#ff8fb4', 0.7)
  rim.position.set(glow.x * 30, 6, glow.z * 30)
  group.add(hemi, key, key.target, rim, rim.target)

  return {
    group,
    solids,
    groundAt,
    glow,
    stone,
    boulder,
    env: {
      background: C('#6a4a88'),
      fog: new THREE.Fog(C('#6c4e86'), 42, 170),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.8 },
      fov: 60,
      shadows: false,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      moths.update(t)
    },
    dispose: () => {
      disposers.forEach(f => f())
      geos.forEach(g => g.dispose())
      stone.dispose()
      far.dispose()
    },
  }
}
