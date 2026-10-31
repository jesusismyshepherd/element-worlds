// A stage for picture rooms (docs/knowledge/picture-rooms.md): Meridiani Planum on Mars, the flat plain
// where the rover Opportunity landed in 2004. Red dust in low ripples, grey hematite pebbles ("blueberries")
// scattered over it, dark rocks; a small impact crater (`crater`, Eagle crater is 22 m across and 3 m deep)
// with pale layered bedrock showing in its inner wall and the lander's deflated airbags on its floor; low
// rises far off in the dusty haze. The sky is Mars's: butterscotch by day, darkening at sunset with a blue
// glow round the small Sun (the dust scatters blue light forwards), stars after dark.
//
// The scene moves the Sun: setSun(dir) with `dir` a unit vector toward it (below the horizon after
// sunset); marsSun(hour) gives it for a Mars local solar time near the equator (sunset about 18:00). The
// sky, the haze and the light follow; `look` says how much day, dusk and night there is. The ground is a
// real surface (`groundAt`), the crater a real hollow outside the walking circle of `radius`.
// `tracks` ([[x, z], ...]) lays a rover's wheel tracks along a path; `clear` ([[x, z, r]]) keeps rocks and
// pebbles off a spot. Also here, for this room and later Mars rooms: marsRover() (a rover like Spirit and
// Opportunity, its arm moved by reach()), marsLander() (a lander on its open petals in its airbags).
// Surfaces are mid-toned: the dust is a deep red-brown that the light makes bright.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, clamp, smooth, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'

const TAU = Math.PI * 2
const C = c => new THREE.Color(c)
// the sky's colours by day, at dusk and at night (from rover pictures: butterscotch by day, a dusky
// brown at sunset with blue round the Sun, near black at night)
const ZENITH = { night: C('#05050b'), dusk: C('#2c211f'), day: C('#7c5a44') }
const HORIZON = { night: C('#0d0b10'), dusk: C('#5c4236'), day: C('#c09470') }
const AUREOLE = { day: C('#d6cbbb'), dusk: C('#4a82dc') }
const SUNLIGHT = { low: C('#ffd8b0'), high: C('#fff4e6') }

/** The Sun's direction for a Mars local solar time (hours of a sol, 12 = noon) at Meridiani (about 2°S),
 *  with the Sun's declination `dec` (degrees); west is `west` (a horizontal unit vector). */
export function marsSun(hour, out = new THREE.Vector3(), { lat = -2, dec = 10, west = new THREE.Vector3(0.24, 0, -0.97).normalize() } = {}) {
  const H = ((hour - 12) / 24) * TAU
  const L = (lat * Math.PI) / 180
  const D = (dec * Math.PI) / 180
  const east = -Math.cos(D) * Math.sin(H)
  const north = Math.cos(L) * Math.sin(D) - Math.sin(L) * Math.cos(D) * Math.cos(H)
  const up = Math.sin(L) * Math.sin(D) + Math.cos(L) * Math.cos(D) * Math.cos(H)
  // east is -west; north is west turned a quarter to the right, seen from above
  const nx = -west.z
  const nz = west.x
  return out.set(-west.x * east + nx * north, up, -west.z * east + nz * north).normalize()
}

/** Red dust in low ripples, grit and a few darker grains (UVs in metres: repeat 1 per `size` m). */
export function dustTexture({ seed = 5, base = '#9a5236', px = 512 } = {}) {
  const rnd = random(seed)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    // blotches of brighter and darker dust
    for (let i = 0; i < 260; i++) {
      g.fillStyle = rnd() < 0.5 ? `rgba(70,30,16,${0.08 + rnd() * 0.12})` : `rgba(196,112,72,${0.08 + rnd() * 0.12})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 50, 6 + rnd() * 24, rnd() * Math.PI, 0, TAU)
      g.fill()
    }
    // ripples: wavy crests across, a lit side and a shaded side (they tile: whole waves per tile)
    for (let k = 0; k < 4; k++) {
      const y0 = (k + 0.5) * (h / 4)
      const ph = rnd() * TAU
      for (const [dy, col, lw] of [[-3, 'rgba(214,138,96,0.32)', 5], [3, 'rgba(60,24,12,0.3)', 6]]) {
        g.strokeStyle = col
        g.lineWidth = lw
        g.beginPath()
        for (let x = 0; x <= w; x += 8) {
          const y = y0 + dy + Math.sin((x / w) * TAU * 2 + ph) * 9 + Math.sin((x / w) * TAU * 5 + ph * 2) * 3
          if (x === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
        g.stroke()
      }
    }
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = rnd() < 0.55 ? `rgba(48,22,14,${0.2 + rnd() * 0.3})` : `rgba(220,150,110,${0.15 + rnd() * 0.25})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** Pale layered sandstone, as the crater's bedrock shows it: thin layers, some slanting (cross-bedding),
 *  tan with darker partings (v = 1 at the top). */
export function layersTexture({ seed = 9, w = 512, h = 256, base = '#b48c68', layers = 14 } = {}) {
  const rnd = random(seed)
  return canvasTex(w, h, g => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    let y = 0
    for (let i = 0; i < layers && y < h; i++) {
      const th = (h / layers) * (0.6 + rnd() * 0.8)
      const shade = rnd()
      g.fillStyle = shade < 0.5 ? `rgba(120,78,52,${0.15 + rnd() * 0.2})` : `rgba(226,196,160,${0.12 + rnd() * 0.18})`
      g.fillRect(0, y, w, th)
      // a parting at the layer's foot
      g.strokeStyle = 'rgba(70,44,30,0.45)'
      g.lineWidth = 1.5
      g.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const yy = y + th + Math.sin(x * 0.05 + i) * 1.2
        if (x === 0) g.moveTo(x, yy)
        else g.lineTo(x, yy)
      }
      g.stroke()
      // slanting laminae inside some layers
      if (rnd() < 0.45) {
        g.strokeStyle = 'rgba(90,58,38,0.22)'
        g.lineWidth = 1
        for (let x = -th * 2; x < w; x += 6 + rnd() * 5) {
          g.beginPath()
          g.moveTo(x, y + th)
          g.lineTo(x + th * 1.6, y)
          g.stroke()
        }
      }
      y += th
    }
    for (let i = 0; i < 1600; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(60,36,24,0.25)' : 'rgba(240,220,190,0.2)'
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1)
    }
    // red dust settled on the top
    const grd = g.createLinearGradient(0, 0, 0, h * 0.2)
    grd.addColorStop(0, 'rgba(150,70,40,0.75)')
    grd.addColorStop(1, 'rgba(150,70,40,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h * 0.2)
  })
}

/** A lumpy rock geometry (radius 1, flattened by the caller), seeded. */
export function rockGeometry(seed = 1, detail = 2) {
  const rnd = random(seed)
  const g = mergeVertices(new THREE.IcosahedronGeometry(1, detail).deleteAttribute('normal').deleteAttribute('uv'))
  const p = g.attributes.position
  const v = new THREE.Vector3()
  const k = [rnd() * 3 + 1.5, rnd() * 3 + 1.5, rnd() * 3 + 1.5, rnd() * TAU, rnd() * TAU]
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = 1 + 0.16 * Math.sin(v.x * k[0] + k[3]) * Math.cos(v.z * k[1]) + 0.1 * Math.sin(v.y * k[2] + k[4]) + 0.05 * Math.sin(v.x * 7 + v.z * 5)
    v.multiplyScalar(n)
    if (v.y < -0.35) v.y = -0.35 + (v.y + 0.35) * 0.25
    p.setXYZ(i, v.x, v.y + 0.35, v.z)
  }
  g.computeVertexNormals()
  return g
}

export function marsStage({ radius = 11, light = false, crater = null, tracks = [], clear = [], berries = 0, rocks = 60 } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const sunDir = marsSun(17.3)

  // ---- the ground's shape: a flat plain, the crater a bowl with a raised rim, gentle swells far off ----
  const cr = crater ? { depth: 3, rim: 0.45, ...crater } : null
  const craterH = (x, z) => {
    if (!cr) return 0
    const u = Math.hypot(x - cr.x, z - cr.z) / cr.r
    const bowl = u < 1 ? -cr.depth * Math.pow(1 - u * u, 0.9) : 0
    const lip = cr.rim * Math.exp(-(((u - 1) / (u < 1 ? 0.1 : 0.32)) ** 2))
    return bowl + lip
  }
  const far = (x, z) => {
    const r = Math.hypot(x, z)
    const k = smooth(radius + 4, radius + 30, r)
    return k * (0.5 * Math.sin(x * 0.07 + 1.3) * Math.cos(z * 0.06) + 0.35 * Math.sin(x * 0.021 - z * 0.03))
  }
  const groundAt = (x, z) => craterH(x, z) + far(x, z)

  // ---- the sky ----
  const skyU = {
    uSunDir: { value: sunDir.clone() },
    uZenith: { value: ZENITH.day.clone() },
    uHorizon: { value: HORIZON.day.clone() },
    uAureole: { value: AUREOLE.day.clone() },
    uBlueC: { value: AUREOLE.dusk.clone() },
    uBlue: { value: 0 },
    uSun: { value: 1 },
    uNight: { value: 0 },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(95, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uAureole; uniform vec3 uBlueC;
        uniform float uBlue; uniform float uSun; uniform float uNight;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          // (clamped before pow(): a hair below 0 gives NaN, which the bloom spreads as a black square)
          float hp = clamp(h, 0.0, 1.0);
          vec3 c = h > 0.0 ? mix(uHorizon, uZenith, pow(hp, 0.55)) : mix(uHorizon, uHorizon * 0.6, clamp(-h * 5.0, 0.0, 1.0));
          float s = clamp(dot(d, uSunDir), 0.0, 1.0);
          // the side of the sky where the Sun is, a little brighter
          vec2 dh = normalize(d.xz + vec2(1e-5));
          vec2 sh = normalize(uSunDir.xz + vec2(1e-5));
          float k = clamp(dot(dh, sh) * 0.5 + 0.5, 0.0, 1.0);
          c *= 0.82 + 0.3 * pow(k, 3.0) * (1.0 - hp);
          // the glow round the Sun: pale by day; at sunset blue, lingering after it
          float near = pow(s, 14.0) * 0.55 + pow(s, 60.0) * 0.6 + pow(s, 4.0) * 0.18;
          c = mix(c, uAureole * 0.9, clamp(near * 0.55 * (1.0 - uBlue), 0.0, 0.8));
          // (a compact glow, some 15 to 20 degrees round the Sun; the rest of the sky stays dusky brown)
          float wide = pow(s, 30.0) * 0.8 + pow(s, 90.0) * 0.5 + pow(s, 10.0) * 0.3;
          c = mix(c, uBlueC, clamp(wide * 1.2, 0.0, 0.92) * uBlue);
          c += uBlueC * pow(s, 200.0) * 0.5 * uBlue + uAureole * pow(s, 220.0) * 0.8 * (1.0 - uBlue);
          // the small white Sun (about two thirds as wide as from Earth; drawn a little bigger, as the picture does)
          float a = acos(s);
          float disc = 1.0 - smoothstep(0.017, 0.021, a);
          c = mix(c, mix(vec3(1.7, 1.65, 1.55), vec3(1.15, 1.3, 1.6), uBlue), disc * uSun * step(-0.03, uSunDir.y));
          // stars, when it is dark enough
          if (uNight > 0.01 && h > 0.0) {
            // small round stars: one in a few hundred cells of a fine grid, round within its cell
            vec3 q = d * 320.0;
            vec3 cell = floor(q);
            float n = hash(cell);
            float star = step(0.9972, n) * (0.35 + 0.65 * hash(cell + 7.0)) * smoothstep(0.42, 0.08, length(fract(q) - 0.5));
            c += vec3(star) * uNight * smoothstep(0.02, 0.3, h) * 1.6;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- the ground: red dust in ripples, one surface out to the haze ----
  const dustTex = dustTexture()
  disposers.push(() => dustTex.dispose())
  const groundMat = new THREE.MeshStandardMaterial({ map: dustTex, roughness: 1, color: '#f0d2c0' })
  const shapeRing = (r0, r1, aSeg, rSeg) => {
    const geo = new THREE.RingGeometry(r0, r1, aSeg, rSeg)
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      // a shape's (x, y) becomes the ground's (x, -z)
      p.setZ(i, groundAt(x, -y))
      uv.setXY(i, x / 3.2, y / 3.2)
    }
    geo.rotateX(-Math.PI / 2)
    geo.computeVertexNormals()
    return geo
  }
  const inner = new THREE.Mesh(shapeRing(0.01, 40, 220, 110), groundMat)
  const outer = new THREE.Mesh(shapeRing(40, 92, 220, 26), groundMat)
  inner.receiveShadow = outer.receiveShadow = true
  group.add(inner, outer)

  // the crater's bedrock: pale layers in its inner wall, round most of it, with slabs broken off the rim
  const bedTex = layersTexture({ seed: 4 })
  disposers.push(() => bedTex.dispose())
  bedTex.wrapS = THREE.RepeatWrapping
  const bedMat = new THREE.MeshStandardMaterial({ map: bedTex, roughness: 0.95, color: '#e8d6c4' })
  if (cr) {
    const A0 = cr.from ?? 0.3
    const A1 = cr.to ?? 4.6
    const U0 = 0.8
    const U1 = 0.95
    const aSeg = 90
    const uSeg = 8
    const pos = []
    const uvs = []
    const idx = []
    for (let i = 0; i <= aSeg; i++) {
      const a = A0 + ((A1 - A0) * i) / aSeg
      for (let j = 0; j <= uSeg; j++) {
        const u = U0 + ((U1 - U0) * j) / uSeg
        const x = cr.x + Math.cos(a) * u * cr.r
        const z = cr.z + Math.sin(a) * u * cr.r
        // stands a few centimetres proud of the wall, more in the middle of the band
        const lift = 0.05 + 0.08 * Math.sin((j / uSeg) * Math.PI)
        pos.push(cr.x + Math.cos(a) * (u * cr.r - lift), groundAt(x, z) + 0.03, cr.z + Math.sin(a) * (u * cr.r - lift))
        uvs.push(((a - A0) * cr.r) / 3, j / uSeg)
      }
    }
    for (let i = 0; i < aSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        const a = i * (uSeg + 1) + j
        const b = a + uSeg + 1
        idx.push(a, a + 1, b, b, a + 1, b + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const band = new THREE.Mesh(geo, bedMat)
    // seen from the rim or across the crater: both faces
    bedMat.side = THREE.DoubleSide
    band.receiveShadow = true
    group.add(band)
    // slabs of bedrock lying at the rim and on the wall
    const rndS = random(17)
    const slabGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.12)
    for (let i = 0; i < 16; i++) {
      const a = A0 + rndS() * (A1 - A0)
      const u = 0.86 + rndS() * 0.16
      const x = cr.x + Math.cos(a) * u * cr.r
      const z = cr.z + Math.sin(a) * u * cr.r
      const m = new THREE.Mesh(slabGeo, bedMat)
      m.scale.set(0.3 + rndS() * 0.6, 0.1 + rndS() * 0.14, 0.25 + rndS() * 0.4)
      m.position.set(x, groundAt(x, z) + 0.03, z)
      m.rotation.set((rndS() - 0.5) * 0.3, rndS() * TAU, (rndS() - 0.5) * 0.3)
      m.castShadow = !light
      group.add(m)
    }
  }

  // wheel tracks: two bands of cleat marks along a path
  if (tracks.length > 1) {
    const trackTex = canvasTex(64, 128, (g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = 'rgba(58,26,16,0.55)'
      g.fillRect(4, 0, w - 8, h)
      g.fillStyle = 'rgba(30,12,8,0.6)'
      for (let y = 0; y < h; y += 16) g.fillRect(6, y, w - 12, 5)
    }, { repeat: true })
    disposers.push(() => trackTex.dispose())
    const trackMat = new THREE.MeshStandardMaterial({ map: trackTex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
    const curve = new THREE.CatmullRomCurve3(tracks.map(([x, z]) => new THREE.Vector3(x, 0, z)))
    const N = Math.max(8, Math.round(curve.getLength() * 3))
    for (const side of [-0.62, 0.62]) {
      const pos = []
      const uvs = []
      const idx = []
      let run = 0
      let last = null
      for (let i = 0; i <= N; i++) {
        const p = curve.getPointAt(i / N)
        const tg = curve.getTangentAt(i / N)
        const nx = -tg.z
        const nz = tg.x
        if (last) run += p.distanceTo(last)
        last = p
        for (const s of [-0.09, 0.09]) {
          const x = p.x + nx * (side + s)
          const z = p.z + nz * (side + s)
          pos.push(x, groundAt(x, z) + 0.006, z)
          uvs.push(s < 0 ? 0 : 1, run / 0.5)
        }
        if (i < N) {
          const a = i * 2
          idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
        }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
      geo.setIndex(idx)
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, trackMat)
      m.material.side = THREE.DoubleSide
      m.renderOrder = -1
      m.receiveShadow = true
      group.add(m)
    }
  }

  // rocks, dark under their red dust, and the grey pebbles scattered everywhere
  const isClear = (x, z, m = 0) => clear.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r + m)
  const inCrater = (x, z) => cr && Math.hypot(x - cr.x, z - cr.z) < cr.r * 1.15
  const rockMat = new THREE.MeshStandardMaterial({ color: '#6a3e2e', roughness: 0.92 })
  const rockGeo = rockGeometry(3, 1)
  const ROCKS = light ? Math.round(rocks / 2) : rocks
  const rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, ROCKS)
  {
    const o = new THREE.Object3D()
    const rnd = random(21)
    let n = 0
    for (let tries = 0; n < ROCKS && tries < ROCKS * 6; tries++) {
      const a = rnd() * TAU
      const r = 1.5 + Math.sqrt(rnd()) * 36
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (isClear(x, z, 0.4) || (inCrater(x, z) && rnd() < 0.5)) continue
      const s = r < radius ? 0.05 + rnd() * 0.12 : 0.08 + rnd() * 0.3
      o.position.set(x, groundAt(x, z) - s * 0.15, z)
      o.rotation.set(0, rnd() * TAU, 0)
      o.scale.set(s * (1 + rnd() * 0.6), s * (0.5 + rnd() * 0.5), s * (1 + rnd() * 0.5))
      o.updateMatrix()
      rockMesh.setMatrixAt(n++, o.matrix)
    }
    rockMesh.count = n
  }
  rockMesh.castShadow = !light
  rockMesh.receiveShadow = true
  group.add(rockMesh)
  let pebbles = null
  if (berries > 0) {
    const COUNT = light ? Math.round(berries / 3) : berries
    pebbles = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#5c6470', roughness: 0.55, metalness: 0.25 }), COUNT)
    const o = new THREE.Object3D()
    const rnd = random(33)
    let n = 0
    for (let tries = 0; n < COUNT && tries < COUNT * 4; tries++) {
      const a = rnd() * TAU
      const r = 0.8 + Math.sqrt(rnd()) * (radius + 3)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (isClear(x, z)) continue
      const s = 0.006 + rnd() * 0.006
      o.position.set(x, groundAt(x, z) + s * 0.6, z)
      o.scale.setScalar(s)
      o.updateMatrix()
      pebbles.setMatrixAt(n++, o.matrix)
    }
    pebbles.count = n
    group.add(pebbles)
  }

  // low rises far off, brown in the haze
  const hillMat = new THREE.MeshStandardMaterial({ color: '#6e3f2c', roughness: 1 })
  const rndH = random(41)
  // none where the Sun sets (in the west, -z a little to the right): it goes down on a clear horizon
  const westA = Math.atan2(-0.97, 0.24)
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU + rndH() * 0.25
    const r = 66 + rndH() * 12
    if (Math.abs(Math.atan2(Math.sin(a - westA), Math.cos(a - westA))) < 0.5) continue
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 10), hillMat)
    m.scale.set(18 + rndH() * 16, 2.2 + rndH() * 3.2, 10 + rndH() * 8)
    m.position.set(Math.cos(a) * r, -0.6, Math.sin(a) * r)
    m.rotation.y = -a + Math.PI / 2
    group.add(m)
  }

  // dust drifting in the thin air
  const specks = motes({ count: 220, radius: radius + 4, y0: 0.1, y1: 5, color: '#ffc8a0', size: 0.035, opacity: 0.5, speed: 0.06, light })
  group.add(specks.group)

  // ---- light ----
  const hemi = new THREE.HemisphereLight('#c9a07c', '#5a2c1c', 0.9)
  const sun = new THREE.DirectionalLight('#fff1e0', 2.2)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -(radius + 5)
  sun.shadow.camera.right = sun.shadow.camera.top = radius + 5
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 110
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.04
  group.add(hemi, sun, sun.target)

  const background = HORIZON.day.clone()
  const fog = new THREE.Fog(HORIZON.day.clone(), 28, 100)
  const tmp = new THREE.Color()
  const look = { day: 1, dusk: 0, night: 0, blue: 0 }

  /** The Sun's direction (unit, toward it): the sky, the haze and the light follow. */
  function setSun(dir) {
    const e = dir.y
    const day = smooth(0.02, 0.45, e)
    const night = 1 - smooth(-0.32, -0.04, e)
    const dusk = (1 - smooth(0.05, 0.4, e)) * (1 - night)
    // the blue round the Sun grows as it sinks and lingers in the twilight
    const blue = clamp((1 - smooth(0.0, 0.28, e)) * smooth(-0.32, -0.08, e))
    look.day = day
    look.dusk = dusk
    look.night = night
    look.blue = blue
    skyU.uSunDir.value.copy(dir)
    const z = skyU.uZenith.value.copy(ZENITH.night).lerp(ZENITH.dusk, 1 - night).lerp(ZENITH.day, day)
    const hz = skyU.uHorizon.value.copy(HORIZON.night).lerp(HORIZON.dusk, 1 - night).lerp(HORIZON.day, day)
    skyU.uAureole.value.copy(AUREOLE.day).multiplyScalar(1 - 0.75 * night)
    skyU.uBlueC.value.copy(AUREOLE.dusk).multiplyScalar(0.8 * (1 - 0.55 * night))
    skyU.uBlue.value = blue
    skyU.uSun.value = 1
    skyU.uNight.value = clamp(night * 1.3)
    background.copy(hz)
    fog.color.copy(hz).lerp(z, 0.12)
    // sunlight: weaker than Earth's (about 43 %), warm and dim near the horizon, none below it
    const up = smooth(-0.01, 0.16, e)
    sun.intensity = 2.3 * up * (0.5 + 0.5 * day)
    sun.color.copy(SUNLIGHT.low).lerp(SUNLIGHT.high, smooth(0.08, 0.5, e))
    sun.position.copy(dir).multiplyScalar(50)
    sun.target.position.set(0, 0, 0)
    // the sky's own light: butterscotch by day, dusky after sunset, a little left at night
    hemi.intensity = 0.16 + 0.22 * (1 - night) + 0.75 * day
    hemi.color.copy(hz).lerp(z, 0.3).lerp(tmp.set('#ffe6cc'), 0.3 * day)
    hemi.groundColor.set('#5a2c1c').multiplyScalar(0.3 + 0.7 * Math.max(day, 0.15))
    // the drifting dust is lit by the day, not glowing in the dark
    specks.group.material.opacity = 0.5 * (0.12 + 0.88 * (1 - night))
    specks.group.material.color.set('#ffc8a0').multiplyScalar(0.25 + 0.75 * Math.max(day, 0.3 * (1 - night)))
  }
  setSun(sunDir)

  return {
    group,
    solids: ringWall(radius),
    look,
    groundAt,
    sunLight: sun,
    hemi,
    pebbles,
    env: {
      background,
      fog,
      exposure: 1.0,
      envIntensity: 0.22,
      bloom: { strength: 0.45, radius: 0.5, threshold: 0.88 },
      fov: 62,
      shadows: true,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    setSun,
    update(t) {
      specks.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}

/**
 * A rover like Spirit and Opportunity (2004), about their real size: 1.6 m long, 2.3 m wide with its solar
 * wings, its camera mast about 1.5 m high; six wheels on rocker-bogie legs; the arm folded under the front,
 * a turret of four tools at its end (`tools`: rat, mb, apxs, mi). The rover faces +z.
 * reach(point, tool, k): the arm's pose that puts `tool`'s face on the world `point` (k from 0, folded, to
 * 1, there), so the scene eases it. `deck` holds the magnets and the sundial (the scene's own copies are
 * bigger).
 */
export function marsRover({ light = false } = {}) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#d8d2c6', roughness: 0.6, metalness: 0.15 })
  const gold = new THREE.MeshStandardMaterial({ color: '#b88a3c', roughness: 0.45, metalness: 0.7 })
  const grey = new THREE.MeshStandardMaterial({ color: '#8d9096', roughness: 0.5, metalness: 0.6 })
  const dark = new THREE.MeshStandardMaterial({ color: '#23262c', roughness: 0.6, metalness: 0.3 })
  const cellTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#1b2850'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(150,170,220,0.45)'
    g.lineWidth = 2
    for (let i = 0; i <= 8; i++) {
      g.beginPath()
      g.moveTo((i / 8) * w, 0)
      g.lineTo((i / 8) * w, h)
      g.stroke()
      g.beginPath()
      g.moveTo(0, (i / 8) * h)
      g.lineTo(w, (i / 8) * h)
      g.stroke()
    }
  }, { repeat: true })
  const cells = new THREE.MeshStandardMaterial({ map: cellTex, roughness: 0.3, metalness: 0.5, color: '#c8d0ff' })
  // the warm electronics box under the deck
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.3, 1.0, 2, 0.03), white)
  body.position.y = 0.58
  group.add(body)
  // the solar deck and its wings, a thin slab of cells (a hexagon-ish outline as the real one has)
  const deckShape = new THREE.Shape()
  ;[[-0.6, -0.78], [0.6, -0.78], [1.15, -0.25], [1.15, 0.2], [0.55, 0.62], [-0.55, 0.62], [-1.15, 0.2], [-1.15, -0.25]].forEach(([x, y], i) => (i ? deckShape.lineTo(x, y) : deckShape.moveTo(x, y)))
  const deckGeo = new THREE.ExtrudeGeometry(deckShape, { depth: 0.03, bevelEnabled: false })
  deckGeo.rotateX(-Math.PI / 2)
  {
    const uv = deckGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2.5, uv.getY(i) * 2.5)
  }
  const deck = new THREE.Mesh(deckGeo, cells)
  deck.position.y = 0.76
  // the underside and rim of the deck in white
  const under = new THREE.Mesh(new THREE.ExtrudeGeometry(deckShape, { depth: 0.02, bevelEnabled: false }).rotateX(-Math.PI / 2), white)
  under.position.y = 0.745
  group.add(deck, under)
  const deckTop = new THREE.Group()
  deckTop.position.y = 0.795
  group.add(deckTop)
  // the camera mast at the front, the cameras' head on top
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.62, 10), white)
  mast.position.set(-0.22, 1.1, 0.42)
  const head = new THREE.Group()
  head.position.set(-0.22, 1.45, 0.42)
  const headBox = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.1, 0.1, 2, 0.02), white)
  head.add(headBox)
  for (const x of [-0.11, 0.11]) {
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16), dark)
    eye.rotation.x = Math.PI / 2
    eye.position.set(x, 0, 0.055)
    head.add(eye)
  }
  group.add(mast, head)
  // the dish antenna and the thin antenna rod
  const dishPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), grey)
  dishPost.position.set(0.32, 0.88, -0.1)
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.03, 28), white)
  dish.position.set(0.32, 0.98, -0.1)
  dish.rotation.x = 0.35
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.62, 6), grey)
  rod.position.set(0.42, 1.1, -0.45)
  group.add(dishPost, dish, rod)
  // wheels and rocker-bogie legs
  const wheelGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.16, 24)
  wheelGeo.rotateZ(Math.PI / 2)
  const hubGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.17, 16)
  hubGeo.rotateZ(Math.PI / 2)
  const legGeo = new THREE.CylinderGeometry(0.022, 0.022, 1, 8)
  const wheels = []
  for (const sx of [-1, 1]) {
    const x = sx * 0.6
    const pivot = new THREE.Vector3(sx * 0.42, 0.55, 0.05)
    for (const z of [0.55, 0.0, -0.55]) {
      const w = new THREE.Mesh(wheelGeo, grey)
      w.position.set(x, 0.13, z)
      const hub = new THREE.Mesh(hubGeo, dark)
      hub.position.copy(w.position)
      group.add(w, hub)
      wheels.push(w)
    }
    // the rocker from the body to the front wheel, the bogie to the middle and back wheels
    const legs = [
      [pivot, new THREE.Vector3(x, 0.3, 0.55)],
      [pivot, new THREE.Vector3(x, 0.38, -0.28)],
      [new THREE.Vector3(x, 0.38, -0.28), new THREE.Vector3(x, 0.3, 0.0)],
      [new THREE.Vector3(x, 0.38, -0.28), new THREE.Vector3(x, 0.3, -0.55)],
      [new THREE.Vector3(x, 0.3, 0.55), new THREE.Vector3(x, 0.13, 0.55)],
      [new THREE.Vector3(x, 0.3, 0.0), new THREE.Vector3(x, 0.13, 0.0)],
      [new THREE.Vector3(x, 0.3, -0.55), new THREE.Vector3(x, 0.13, -0.55)],
    ]
    for (const [a, b] of legs) {
      const m = new THREE.Mesh(legGeo, white)
      m.position.copy(a).add(b).multiplyScalar(0.5)
      m.scale.y = a.distanceTo(b)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
      group.add(m)
    }
  }

  // ---- the arm: a yaw at its base, shoulder and elbow pitch, a wrist, a turret of four tools ----
  const L1 = 0.72
  const L2 = 0.72
  const TOOL = 0.2 // from the wrist to a tool's face
  const base = new THREE.Group()
  base.position.set(0.12, 0.52, 0.52)
  group.add(base)
  const yaw = new THREE.Group()
  base.add(yaw)
  const shoulder = new THREE.Group()
  yaw.add(shoulder)
  const seg = (len, r) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), white)
    m.rotation.z = -Math.PI / 2
    m.position.x = len / 2
    return m
  }
  const joint = r => new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), gold)
  shoulder.add(seg(L1, 0.032), joint(0.055))
  const elbow = new THREE.Group()
  elbow.position.x = L1
  shoulder.add(elbow)
  elbow.add(seg(L2, 0.028), joint(0.05))
  const wrist = new THREE.Group()
  wrist.position.x = L2
  elbow.add(wrist)
  wrist.add(joint(0.045))
  // the turret: four tools round an axis (the wrist's x), each pointing out from it
  const turret = new THREE.Group()
  wrist.add(turret)
  const toolMats = {
    rat: new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.4, metalness: 0.7 }),
    mb: new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.35, metalness: 0.8 }),
    apxs: new THREE.MeshStandardMaterial({ color: '#d8d2c6', roughness: 0.5, metalness: 0.3 }),
    mi: dark,
  }
  const tools = {}
  ;['rat', 'mb', 'apxs', 'mi'].forEach((name, i) => {
    const holder = new THREE.Group()
    holder.rotation.x = (i / 4) * TAU
    turret.add(holder)
    // each points along the holder's -y
    const t = new THREE.Group()
    holder.add(t)
    let face
    if (name === 'rat') {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 18), toolMats.rat)
      c.position.y = -0.09
      face = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 18), dark)
      face.position.y = -0.17
      t.add(c, face)
    } else if (name === 'mb') {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.12, 18), toolMats.mb)
      c.position.y = -0.08
      face = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.008, 8, 24), gold)
      face.rotation.x = Math.PI / 2
      face.position.y = -0.145
      t.add(c, face)
    } else if (name === 'apxs') {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 14), toolMats.apxs)
      c.position.y = -0.09
      t.add(c)
    } else {
      const c = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.13, 0.07, 2, 0.01), dark)
      c.position.y = -0.08
      t.add(c)
    }
    // how far above a point the wrist stands for this tool's face to touch it
    const reach = { rat: 0.19, mb: 0.155, apxs: 0.17, mi: 0.2 }[name]
    tools[name] = { holder, index: i, face, group: t, reach }
  })

  // the pose: angles that put a tool face on a point, from the base's frame; parked, the arm lies folded
  // under the front of the deck, pointing forward
  const PARK = { yaw: -Math.PI / 2, sh: 0.12, el: -2.95, wr: 2.83, turret: 0 }
  const pose = { ...PARK }
  const apply = p => {
    yaw.rotation.y = p.yaw
    shoulder.rotation.z = p.sh
    elbow.rotation.z = p.el
    wrist.rotation.z = p.wr
    turret.rotation.x = p.turret
  }
  apply(pose)
  const tmp = new THREE.Vector3()
  /** The pose that puts `tool`'s face on `point` (world), pointing down. */
  function solve(point, tool = 'mb') {
    group.updateMatrixWorld(true)
    base.worldToLocal(tmp.copy(point))
    // the wrist stands TOOL above the point; the arm works in the vertical plane toward it
    const yawA = Math.atan2(-tmp.z, tmp.x)
    const d = Math.hypot(tmp.x, tmp.z)
    const h = tmp.y + (tools[tool]?.reach ?? TOOL)
    const c = clamp(Math.hypot(d, h), 0.2, L1 + L2 - 0.001)
    const a1 = Math.atan2(h, d) + Math.acos(clamp((L1 * L1 + c * c - L2 * L2) / (2 * L1 * c), -1, 1))
    const inner = Math.acos(clamp((L1 * L1 + L2 * L2 - c * c) / (2 * L1 * L2), -1, 1))
    const el = -(Math.PI - inner)
    // the wrist turns the turret's axis level, so the chosen tool points straight down
    const wr = -(a1 + el)
    const k = tools[tool]?.index ?? 0
    return { yaw: yawA, sh: a1, el, wr, turret: -(k / 4) * TAU }
  }
  const lerpPose = (a, b, k) => ({
    yaw: a.yaw + (b.yaw - a.yaw) * k,
    sh: a.sh + (b.sh - a.sh) * k,
    el: a.el + (b.el - a.el) * k,
    wr: a.wr + (b.wr - a.wr) * k,
    turret: a.turret + (b.turret - a.turret) * k,
  })
  const shadows = []
  group.traverse(o => {
    if (o.isMesh) {
      o.castShadow = !light
      shadows.push(o)
    }
  })
  return {
    group,
    deck: deckTop,
    head,
    tools,
    wrist,
    solve,
    park: () => ({ ...PARK }),
    lerpPose,
    apply,
    /** Where the tool face is now (world). */
    toolFace: (name, out = new THREE.Vector3()) => (tools[name].face ?? tools[name].group).getWorldPosition(out),
    dispose: () => cellTex.dispose(),
  }
}

/** A lander like Spirit's and Opportunity's, sitting on its open petals among its deflated airbags. */
export function marsLander() {
  const group = new THREE.Group()
  const petal = new THREE.MeshStandardMaterial({ color: '#a89a86', roughness: 0.7, metalness: 0.3 })
  const bag = new THREE.MeshStandardMaterial({ color: '#c8b49c', roughness: 0.95 })
  const tri = new THREE.Shape()
  tri.moveTo(0, 0.95)
  tri.lineTo(-0.82, -0.48)
  tri.lineTo(0.82, -0.48)
  tri.closePath()
  const triGeo = new THREE.ExtrudeGeometry(tri, { depth: 0.06, bevelEnabled: false }).rotateX(-Math.PI / 2)
  const baseM = new THREE.Mesh(triGeo, petal)
  baseM.position.y = 0.18
  group.add(baseM)
  // three petals folded out flat from the base's edges: each the base turned half round, beyond an edge
  for (const [mx, my] of [[0, -0.48], [0.41, 0.235], [-0.41, 0.235]]) {
    const m = new THREE.Mesh(triGeo, petal)
    m.rotation.y = Math.PI
    m.position.set(2 * mx, 0.1, -2 * my)
    group.add(m)
  }
  // the deflated bags: crumpled lumps round the edges
  const lump = rockGeometry(8, 2)
  const rnd = random(12)
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU + rnd() * 0.2
    const r = 1.35 + rnd() * 0.5
    const m = new THREE.Mesh(lump, bag)
    m.scale.set(0.45 + rnd() * 0.35, 0.22 + rnd() * 0.18, 0.4 + rnd() * 0.3)
    m.position.set(Math.cos(a) * r, -0.05, Math.sin(a) * r)
    m.rotation.y = rnd() * TAU
    group.add(m)
  }
  group.traverse(o => o.isMesh && (o.castShadow = true))
  return group
}
