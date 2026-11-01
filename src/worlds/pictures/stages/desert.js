// A stage for picture rooms (docs/knowledge/picture-rooms.md): a desert oasis at dusk, as in krypton's
// picture "Water a million years old?" (the Sahara at dusk: dunes to the horizon, palms round a pool, a crescent
// moon). Wind-rippled sand, a flat walking floor inside `radius` and dunes rising beyond it, far dunes dark
// against a sky that glows orange where the Sun went down (`glow`, a direction on the ground plane) and turns
// deep blue overhead with stars and a crescent moon.
// Options: `pool: { x, z, r }` (a pool with a rim of mud and reeds), `palms: [[x, z, height], ...]`, `fields:
// [{ x, z, w, d }]` (irrigated crops in rows). Also here, for later desert rooms: `palm(height, seed)` (one date
// palm as a group, about `height` metres tall). Surfaces are mid-toned: the sand is a deep tan the light makes
// bright; a pale floor under the bloom washes the whole scene out.
import * as THREE from 'three'
import { canvasTex, clamp, smooth, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'
import { circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const C = c => new THREE.Color(c)

/** Sand in wind ripples, grit and a few darker grains (UVs in metres: repeat 1 per 3 m). */
export function sandTexture({ seed = 3, base = '#b69462', px = 512 } = {}) {
  const rnd = random(seed)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 240; i++) {
      g.fillStyle = rnd() < 0.5 ? `rgba(86,56,30,${0.06 + rnd() * 0.1})` : `rgba(230,190,130,${0.06 + rnd() * 0.1})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * h, 12 + rnd() * 50, 6 + rnd() * 22, rnd() * Math.PI, 0, TAU)
      g.fill()
    }
    // ripples: wavy crests across, a lit side and a shaded side (whole waves per tile, so it tiles)
    for (let k = 0; k < 9; k++) {
      const y0 = (k / 9) * h
      g.strokeStyle = 'rgba(240,205,150,0.22)'
      g.lineWidth = 3
      g.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const y = y0 + Math.sin((x / w) * TAU * 2 + k) * 6 + Math.sin((x / w) * TAU * 5 + k * 2) * 2
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
      }
      g.stroke()
      g.strokeStyle = 'rgba(70,44,24,0.2)'
      g.lineWidth = 4
      g.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const y = y0 + 6 + Math.sin((x / w) * TAU * 2 + k) * 6 + Math.sin((x / w) * TAU * 5 + k * 2) * 2
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
      }
      g.stroke()
    }
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(60,40,22,0.35)' : 'rgba(250,220,170,0.3)'
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
    }
  }, { repeat: true })
}

/** One date palm, `height` m tall: a leaning trunk ringed with old leaf bases, a crown of drooping fronds
 *  (double-sided strips), a cluster of dates. Its materials are shared inside a stage (`mats`). */
export function palm(height = 4, seed = 1, mats = null) {
  const rnd = random(seed)
  const g = new THREE.Group()
  const m = mats ?? {
    trunk: new THREE.MeshStandardMaterial({ color: '#6b5236', roughness: 1 }),
    frond: new THREE.MeshStandardMaterial({ color: '#3f7f3a', roughness: 0.8, side: THREE.DoubleSide }),
    date: new THREE.MeshStandardMaterial({ color: '#a8561e', roughness: 0.6 }),
  }
  const lean = (rnd() - 0.5) * 0.9
  const top = new THREE.Vector3(lean, height, (rnd() - 0.5) * 0.5)
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(lean * 0.2, height * 0.4, 0), top])
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, height * 0.032, 8, false), m.trunk)
  g.add(trunk)
  for (let i = 1; i < 12; i++) {
    const p = curve.getPoint(i / 12)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(height * 0.034, height * 0.007, 5, 10), m.trunk)
    ring.rotation.x = Math.PI / 2
    ring.position.copy(p)
    g.add(ring)
  }
  const frondGeo = (len, droop) => {
    const N = 8
    const pos = []
    const idx = []
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const x = t * len
      const y = Math.sin(t * 1.5) * len * 0.34 - droop * t * t * len
      const w = Math.pow(Math.sin(Math.PI * Math.min(0.98, t * 0.95 + 0.03)), 0.7) * len * 0.12
      pos.push(x, y, -w, x, y - w * 0.25, w)
      if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    return geo
  }
  const crown = new THREE.Group()
  crown.position.copy(top)
  g.add(crown)
  const count = 10
  for (let i = 0; i < count; i++) {
    const f = new THREE.Mesh(frondGeo(height * (0.34 + rnd() * 0.12), 0.9 + rnd() * 0.6), m.frond)
    f.rotation.y = (i / count) * TAU + rnd() * 0.3
    f.rotation.z = (rnd() - 0.2) * 0.35
    crown.add(f)
  }
  for (let i = 0; i < 7; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(height * 0.012, 6, 5), m.date)
    d.scale.y = 1.4
    d.position.set((rnd() - 0.5) * height * 0.07, -height * 0.035 - rnd() * height * 0.03, (rnd() - 0.5) * height * 0.07)
    crown.add(d)
  }
  return g
}

export function desertStage({ radius = 11, light = false, pool = null, palms = [], fields = [] } = {}) {
  const group = new THREE.Group()
  const disposers = []
  // where the Sun went down: a direction on the ground plane
  const glow = new THREE.Vector3(-0.35, 0, -0.94).normalize()

  // ---- the ground: flat where people walk, then dunes rolling up to the haze ----
  const dunes = (x, z) => {
    const r = Math.hypot(x, z)
    const k = smooth(radius + 1.5, radius + 28, r)
    const slip = 0.5 + 0.5 * Math.sin(x * 0.085 + 0.6 + Math.sin(z * 0.05) * 1.3) * Math.cos(z * 0.062 - 0.4)
    return k * (5.2 * slip + 1.8 * Math.sin(x * 0.19 - z * 0.14) + 0.8 * Math.sin(z * 0.31 + x * 0.07))
  }
  const groundAt = (x, z) => 0.02 * Math.sin(x * 1.3 + z * 0.8) * Math.cos(z * 0.9) + dunes(x, z)

  const sandTex = sandTexture()
  disposers.push(() => sandTex.dispose())
  const groundMat = new THREE.MeshStandardMaterial({ map: sandTex, roughness: 1, color: '#ffffff' })
  const shapeRing = (r0, r1, aSeg, rSeg) => {
    const geo = new THREE.RingGeometry(r0, r1, aSeg, rSeg)
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      // a shape's (x, y) becomes the ground's (x, -z)
      p.setZ(i, groundAt(x, -y))
      uv.setXY(i, x / 3, y / 3)
    }
    geo.rotateX(-Math.PI / 2)
    geo.computeVertexNormals()
    return geo
  }
  const inner = new THREE.Mesh(shapeRing(0.01, 44, 200, 110), groundMat)
  const outer = new THREE.Mesh(shapeRing(44, 96, 200, 30), groundMat)
  group.add(inner, outer)

  // ---- the sky: orange where the Sun went down, deep blue overhead, stars and a crescent moon ----
  const moonDir = new THREE.Vector3(0.52, 0.46, -0.72).normalize()
  const skyU = {
    uGlow: { value: glow.clone() },
    uMoon: { value: moonDir },
    uZenith: { value: C('#0b1130') },
    uMid: { value: C('#2c2a5e') },
    uHorizon: { value: C('#d98a62') },
    uSide: { value: C('#5d4a72') },
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
        uniform vec3 uGlow; uniform vec3 uMoon; uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uSide;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          float hp = clamp(h, 0.0, 1.0);
          // clamped before pow(): a hair below 0 gives NaN, which the bloom spreads as a black square
          vec3 up = mix(uMid, uZenith, pow(hp, 0.5));
          vec3 c = mix(uSide, up, smoothstep(0.0, 0.35, hp));
          vec2 dh = normalize(d.xz + vec2(1e-5));
          vec2 gh = normalize(uGlow.xz);
          float k = clamp(dot(dh, gh) * 0.5 + 0.5, 0.0, 1.0);
          float band = pow(1.0 - clamp(hp * 2.4, 0.0, 1.0), 2.0);
          c = mix(c, uHorizon, band * (0.18 + 0.82 * pow(k, 3.0)));
          c += uHorizon * 0.5 * pow(k, 6.0) * pow(1.0 - clamp(hp * 1.6, 0.0, 1.0), 3.0);
          if (h < 0.0) c = mix(c, uSide * 0.6, clamp(-h * 5.0, 0.0, 1.0));
          // stars, more of them higher up
          if (h > 0.0) {
            vec3 q = d * 300.0;
            vec3 cell = floor(q);
            float n = hash(cell);
            float star = step(0.9968, n) * (0.35 + 0.65 * hash(cell + 7.0)) * smoothstep(0.42, 0.08, length(fract(q) - 0.5));
            c += vec3(star) * smoothstep(0.04, 0.4, h) * 1.5;
          }
          // the crescent: a bright disc with a darker disc cut out of it
          float a1 = acos(clamp(dot(d, uMoon), -1.0, 1.0));
          vec3 m2 = normalize(uMoon + vec3(0.03, 0.012, 0.0));
          float a2 = acos(clamp(dot(d, m2), -1.0, 1.0));
          float crescent = (1.0 - smoothstep(0.044, 0.048, a1)) * smoothstep(0.040, 0.046, a2);
          c = mix(c, vec3(1.25, 1.12, 0.9), crescent);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- palms, a pool, crops ----
  const palmMats = {
    trunk: new THREE.MeshStandardMaterial({ color: '#6b5236', roughness: 1 }),
    frond: new THREE.MeshStandardMaterial({ color: '#3f7f3a', roughness: 0.8, side: THREE.DoubleSide }),
    date: new THREE.MeshStandardMaterial({ color: '#a8561e', roughness: 0.6 }),
  }
  const solids = ringWall(radius)
  palms.forEach(([x, z, h], i) => {
    const p = palm(h, 11 + i, palmMats)
    p.position.set(x, groundAt(x, z), z)
    p.rotation.y = i * 1.9
    group.add(p)
  })
  const waterMat = new THREE.MeshStandardMaterial({ color: '#2fb5b0', emissive: '#0c4a52', emissiveIntensity: 0.7, roughness: 0.12, metalness: 0.25, transparent: true, opacity: 0.92 })
  let ripples = null
  if (pool) {
    const rim = new THREE.Mesh(new THREE.CircleGeometry(pool.r + 0.55, 40), new THREE.MeshStandardMaterial({ color: '#5d4630', roughness: 1 }))
    rim.rotation.x = -Math.PI / 2
    rim.position.set(pool.x, groundAt(pool.x, pool.z) + 0.012, pool.z)
    const wat = new THREE.Mesh(new THREE.CircleGeometry(pool.r, 40), waterMat)
    wat.rotation.x = -Math.PI / 2
    wat.position.set(pool.x, groundAt(pool.x, pool.z) + 0.025, pool.z)
    wat.raycast = () => {}
    group.add(rim, wat)
    solids.push(...Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * TAU
      return circle(pool.x + Math.cos(a) * (pool.r * 0.8), pool.z + Math.sin(a) * (pool.r * 0.8), pool.r * 0.32)
    }))
    // reeds along the near rim
    const rnd = random(5)
    const reedMat = new THREE.MeshStandardMaterial({ color: '#5a8a3c', roughness: 0.9 })
    const reeds = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.016, 1, 4), reedMat, 90)
    const o = new THREE.Object3D()
    for (let i = 0; i < 90; i++) {
      const a = rnd() * TAU
      const r = pool.r + 0.1 + rnd() * 0.4
      const x = pool.x + Math.cos(a) * r
      const z = pool.z + Math.sin(a) * r
      const hgt = 0.5 + rnd() * 0.7
      o.position.set(x, groundAt(x, z) + hgt / 2, z)
      o.rotation.set((rnd() - 0.5) * 0.25, 0, (rnd() - 0.5) * 0.25)
      o.scale.set(1, hgt, 1)
      o.updateMatrix()
      reeds.setMatrixAt(i, o.matrix)
    }
    group.add(reeds)
    ripples = wat
  }
  for (const f of fields) {
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.d), new THREE.MeshStandardMaterial({ color: '#4a3a26', roughness: 1 }))
    soil.rotation.x = -Math.PI / 2
    soil.position.set(f.x, groundAt(f.x, f.z) + 0.015, f.z)
    group.add(soil)
    const rows = Math.max(2, Math.round(f.d / 0.35))
    const crop = new THREE.InstancedMesh(new THREE.BoxGeometry(f.w * 0.94, 0.16, 0.12), new THREE.MeshStandardMaterial({ color: '#5fa044', roughness: 0.9 }), rows)
    const o = new THREE.Object3D()
    for (let i = 0; i < rows; i++) {
      o.position.set(f.x, groundAt(f.x, f.z) + 0.1, f.z - f.d / 2 + (i + 0.5) * (f.d / rows))
      o.updateMatrix()
      crop.setMatrixAt(i, o.matrix)
    }
    group.add(crop)
  }

  // dust in the dusk air, and far dark dunes are the ground itself
  const specks = motes({ count: 160, radius: radius + 3, y0: 0.1, y1: 4, color: '#ffd2a8', size: 0.03, opacity: 0.35, speed: 0.05, light })
  group.add(specks.group)

  // ---- light: a low warm light from where the Sun went down, a cool sky ----
  const hemi = new THREE.HemisphereLight('#a4aae8', '#6a5640', 1.25)
  const sun = new THREE.DirectionalLight('#ffc596', 1.35)
  sun.position.set(glow.x * 40, 9, glow.z * 40)
  sun.target.position.set(0, 0, 0)
  group.add(hemi, sun, sun.target)

  const background = C('#5d4a72')
  const fog = new THREE.Fog(C('#8a6a80'), 34, 115)

  return {
    group,
    solids,
    groundAt,
    glow,
    water: waterMat,
    env: {
      background,
      fog,
      exposure: 1.0,
      envIntensity: 0.22,
      bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 },
      fov: 62,
      shadows: false,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      specks.update(t)
      if (ripples) waterMat.emissiveIntensity = 0.65 + Math.sin(t * 1.3) * 0.08
    },
    dispose: () => {
      disposers.forEach(f => f())
      for (const m of Object.values(palmMats)) m.dispose()
    },
  }
}
