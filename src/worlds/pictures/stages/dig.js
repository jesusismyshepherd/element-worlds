// A stage for picture rooms (docs/knowledge/picture-rooms.md): an archaeologists' dig in open country at
// golden hour. The sun low behind the visitor's arrival, the sky deepening to navy ahead with the first
// stars in it (the boards' night sky); a field of dry summer grass, flat inside a circle of `radius` and
// falling away past it; golden hills and a few dark trees far off; dust glowing in the low light.
//
// The ground has real holes where the scene digs: `pits` ([{ x0, x1, z0, z1 }], axis-aligned) are cut
// out of it, and the scene builds what is inside (walls, floors, steps). `bare` ([[x, z, w, d, rot]])
// are patches of trodden earth (no grass tufts there); `clear` ([[x, z, r]]) keeps tufts off a spot. For a
// pit's walls: `strataTexture(layers)` (soil layers, as a trench wall shows them) and `soilTexture()`.
// Surfaces are mid-toned: pale ones bloom to white in the low sun.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { cloudTexture } from './meadow.js'
import { motes, ringWall } from '../kit.js'

const TAU = Math.PI * 2

/** The ground's height at a distance r from the middle: flat on the field, falling gently beyond. */
export function fieldHeight(r, radius) {
  const edge = radius + 2
  return r <= edge ? 0 : -0.05 * Math.pow(r - edge, 1.5)
}

/** Dug earth: brown with grit, small stones and darker crumbs (UVs in metres, repeat 1 per `size` m). */
export function soilTexture({ seed = 7, base = '#6e5236', size = 256 } = {}) {
  const rnd = random(seed)
  const t = canvasTex(size, size, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 900; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(40,26,14,${0.15 + rnd() * 0.25})` : `rgba(160,128,92,${0.12 + rnd() * 0.2})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3)
    }
    for (let i = 0; i < 26; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const r = 1.5 + rnd() * 4
      g.fillStyle = `rgba(${150 + rnd() * 60},${140 + rnd() * 50},${120 + rnd() * 40},0.85)`
      g.beginPath()
      g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * 3, 0, TAU)
      g.fill()
      g.fillStyle = 'rgba(30,20,10,0.35)'
      g.beginPath()
      g.ellipse(x + 1, y + r * 0.5, r, r * 0.35, 0, 0, Math.PI)
      g.fill()
    }
  }, { repeat: true })
  return t
}

/**
 * A trench wall's face: soil layers one under another, as archaeologists read them. `layers` from the
 * top down: [{ to (metres below the surface), color, grit (0..1), stones (0..1) }]; `height` the
 * texture's depth in metres (v = 1 at the surface, 0 at `height` below), `width` its run in metres (UVs in
 * metres along the wall: repeat.x = 1 / width). Boundaries wave a little, turf and roots at the top.
 */
export function strataTexture({ layers, height = 1.2, width = 4, seed = 3, px = 128 } = {}) {
  const rnd = random(seed)
  const W = Math.round(width * px)
  const H = Math.round(height * px)
  const t = canvasTex(W, H, (g, w, h) => {
    // each layer's lower edge, waving along the wall
    const waves = layers.map((l, i) => {
      const a = 0.012 + rnd() * 0.02
      const k1 = 1.5 + rnd() * 2
      const k2 = 4 + rnd() * 5
      const p = rnd() * 9
      return x => (l.to + a * Math.sin((x / px) * k1 + p) + a * 0.5 * Math.sin((x / px) * k2 + p * 2)) * px
    })
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i]
      g.fillStyle = l.color
      g.beginPath()
      g.moveTo(0, 0)
      for (let x = 0; x <= w; x += 8) g.lineTo(x, Math.min(h, waves[i](x)))
      g.lineTo(w, 0)
      g.closePath()
      g.fill()
    }
    // grit and stones, each layer its own
    const layerAt = y => {
      for (let i = 0; i < layers.length; i++) if (y < layers[i].to * px) return layers[i]
      return layers[layers.length - 1]
    }
    for (let i = 0; i < w * h * 0.02; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const l = layerAt(y)
      if (rnd() > (l.grit ?? 0.5)) continue
      g.fillStyle = rnd() < 0.5 ? 'rgba(30,20,12,0.3)' : 'rgba(200,180,150,0.22)'
      g.fillRect(x, y, 1 + rnd() * 2, 1 + rnd() * 2)
    }
    for (let i = 0; i < w * h * 0.0009; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const l = layerAt(y)
      if (rnd() > (l.stones ?? 0.3)) continue
      const r = 2 + rnd() * 5
      g.fillStyle = `rgba(${150 + rnd() * 50},${135 + rnd() * 45},${115 + rnd() * 40},0.9)`
      g.beginPath()
      g.ellipse(x, y, r, r * (0.55 + rnd() * 0.4), rnd() * 3, 0, TAU)
      g.fill()
    }
    // the turf at the top and roots reaching down into the first layer
    g.fillStyle = '#4a4a26'
    g.fillRect(0, 0, w, 0.06 * px)
    g.strokeStyle = 'rgba(200,170,120,0.45)'
    g.lineWidth = 1
    for (let i = 0; i < w / 10; i++) {
      let x = rnd() * w
      let y = 0.05 * px
      g.beginPath()
      g.moveTo(x, y)
      const n = 4 + rnd() * 6
      for (let k = 0; k < n; k++) {
        x += (rnd() - 0.5) * 8
        y += 3 + rnd() * 6
        g.lineTo(x, y)
      }
      g.stroke()
    }
    // the trowel's marks: faint scrapes across
    g.strokeStyle = 'rgba(255,240,210,0.06)'
    g.lineWidth = 2
    for (let i = 0; i < w / 6; i++) {
      const x = rnd() * w
      const y = 0.08 * px + rnd() * (h - 0.1 * px)
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + 10 + rnd() * 20, y + (rnd() - 0.5) * 4)
      g.stroke()
    }
  })
  t.wrapS = THREE.RepeatWrapping
  return t
}

/** A soft-edged patch of trodden earth (a decal on the grass). */
function patchTexture(seed = 5) {
  const rnd = random(seed)
  return canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const grd = g.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.5)
    grd.addColorStop(0, 'rgba(118,88,58,1)')
    grd.addColorStop(1, 'rgba(118,88,58,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 1400; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const d = Math.hypot(x - w / 2, y - h / 2) / (w / 2)
      if (d > 0.95) continue
      g.fillStyle = rnd() < 0.5 ? `rgba(60,40,22,${0.25 * (1 - d)})` : `rgba(170,140,100,${0.25 * (1 - d)})`
      g.fillRect(x, y, 1 + rnd() * 3, 1 + rnd() * 3)
    }
  })
}

export function digStage({ radius = 13, light = false, sun = [-0.6, 0.2, 0.77], pits = [], bare = [], clear = [] } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const sunDir = new THREE.Vector3(...sun).normalize()

  // ---- the sky: navy overhead and ahead, gold and rose round the low sun behind, the first stars ----
  const skyU = {
    uSunDir: { value: sunDir.clone() },
    uZenith: { value: new THREE.Color('#13205a') },
    uAnti: { value: new THREE.Color('#4d4688') },
    uWarm: { value: new THREE.Color('#f0a25e') },
    uGlow: { value: new THREE.Color('#ffb466') },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(95, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uZenith; uniform vec3 uAnti; uniform vec3 uWarm; uniform vec3 uGlow;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          // how far round toward the sun (1 on its side, 0 opposite)
          vec2 dh = normalize(d.xz + vec2(1e-5));
          vec2 sh = normalize(uSunDir.xz + vec2(1e-5));
          // (clamped: a hair below 0 opposite the sun gives pow() a NaN, which the bloom spreads as black)
          float k = clamp(dot(dh, sh) * 0.5 + 0.5, 0.0, 1.0);
          vec3 horizon = mix(uAnti, uWarm, pow(k, 2.2));
          vec3 c = h > 0.0 ? mix(horizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.42 + 0.3 * k)) : mix(horizon, horizon * 0.5, clamp(-h * 5.0, 0.0, 1.0));
          // a rose band low down all round, the earth's shadow ahead
          c += vec3(0.16, 0.06, 0.08) * (1.0 - k) * exp(-abs(h - 0.06) * 18.0);
          float s = dot(d, uSunDir);
          c += uGlow * (pow(max(s, 0.0), 8.0) * 0.45 + pow(max(s, 0.0), 90.0) * 0.8);
          // the sun's disc and short rays, as the boards draw it
          float a = acos(clamp(s, -1.0, 1.0));
          float disc = 1.0 - smoothstep(0.042, 0.048, a);
          vec3 t1 = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
          vec3 t2 = cross(t1, uSunDir);
          float ang = atan(dot(d, t2), dot(d, t1));
          float ray = pow(abs(cos(ang * 6.0)), 40.0) * smoothstep(0.058, 0.066, a) * (1.0 - smoothstep(0.09, 0.105, a));
          vec3 sunC = vec3(2.4, 1.7, 0.9);
          c = mix(c, sunC, disc);
          c += sunC * 0.4 * ray;
          // the first stars, where the sky is darkest (high up, away from the sun)
          if (h > 0.0) {
            vec3 q = floor(d * 170.0);
            float n = hash(q);
            float star = step(0.9962, n) * (0.4 + 0.6 * hash(q + 7.0));
            c += vec3(star) * smoothstep(0.12, 0.6, h) * pow(1.0 - k, 1.3) * 1.3;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- the ground: dry summer grass, holes where the scene digs ----
  const grassTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#6f6c38'
    g.fillRect(0, 0, w, w)
    const rnd = random(11)
    for (let i = 0; i < 1500; i++) {
      const v = rnd()
      g.fillStyle = v < 0.45 ? `rgba(70,74,34,${0.25 + rnd() * 0.3})` : v < 0.8 ? `rgba(150,136,74,${0.2 + rnd() * 0.25})` : `rgba(96,110,52,${0.25 + rnd() * 0.25})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * w, 3 + rnd() * 16, 2 + rnd() * 8, rnd() * Math.PI, 0, TAU)
      g.fill()
    }
    g.lineWidth = 1.2
    for (let i = 0; i < 2800; i++) {
      const x = rnd() * w
      const y = rnd() * w
      g.strokeStyle = rnd() < 0.55 ? 'rgba(186,164,96,0.45)' : 'rgba(58,62,28,0.45)'
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (rnd() - 0.5) * 3, y - 4 - rnd() * 5)
      g.stroke()
    }
  }, { repeat: true })
  disposers.push(() => grassTex.dispose())
  const groundMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, color: '#e8dcc0' })
  // the flat field, a circle with the pits cut out (a shape's (x, y) becomes the ground's (x, -z))
  const FLAT = radius + 2
  const SEG = 48
  const field = new THREE.Shape()
  field.absarc(0, 0, FLAT, 0, TAU, false)
  for (const p of pits) {
    const hole = new THREE.Path()
    hole.moveTo(p.x0, -p.z0)
    hole.lineTo(p.x0, -p.z1)
    hole.lineTo(p.x1, -p.z1)
    hole.lineTo(p.x1, -p.z0)
    hole.closePath()
    field.holes.push(hole)
  }
  const flatGeo = new THREE.ShapeGeometry(field, SEG)
  flatGeo.rotateX(-Math.PI / 2)
  {
    const uv = flatGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3.2, uv.getY(i) / 3.2)
  }
  const flat = new THREE.Mesh(flatGeo, groundMat)
  flat.receiveShadow = true
  group.add(flat)
  // beyond the field the land falls away into the haze
  const outerGeo = new THREE.RingGeometry(FLAT, 90, SEG * 2, 40)
  {
    const p = outerGeo.attributes.position
    const uv = outerGeo.attributes.uv
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      p.setZ(i, fieldHeight(Math.hypot(x, y), radius))
      uv.setXY(i, x / 3.2, y / 3.2)
    }
    outerGeo.rotateX(-Math.PI / 2)
    outerGeo.computeVertexNormals()
  }
  const outer = new THREE.Mesh(outerGeo, groundMat)
  outer.receiveShadow = true
  group.add(outer)

  // trodden earth
  const patchTex = patchTexture()
  disposers.push(() => patchTex.dispose())
  const patchMat = new THREE.MeshStandardMaterial({ map: patchTex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  // a patch never covers a pit: its fragments over one are dropped
  if (pits.length) {
    const rects = pits.map(p => new THREE.Vector4(p.x0, p.x1, p.z0, p.z1))
    patchMat.onBeforeCompile = sh => {
      sh.uniforms.uPits = { value: rects }
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vPatchWorld;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvPatchWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;')
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying vec3 vPatchWorld;\nuniform vec4 uPits[${rects.length}];`)
        .replace('void main() {', `void main() {
          for (int i = 0; i < ${rects.length}; i++) {
            vec4 r = uPits[i];
            if (vPatchWorld.x > r.x && vPatchWorld.x < r.y && vPatchWorld.z > r.z && vPatchWorld.z < r.w) discard;
          }`)
    }
    patchMat.customProgramCacheKey = () => `dig-patch-${rects.length}`
  }
  for (const [x, z, w, d, rot = 0] of bare) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), patchMat)
    m.position.set(x, 0.003, z)
    m.rotation.y = rot
    m.receiveShadow = true
    m.renderOrder = -1
    group.add(m)
  }

  // tufts of dry grass and a few late flowers, off the pits and the bare earth
  const inPit = (x, z, m = 0.25) => pits.some(p => x > p.x0 - m && x < p.x1 + m && z > p.z0 - m && z < p.z1 + m)
  const onBare = (x, z) =>
    bare.some(([bx, bz, w, d, rot = 0]) => {
      const dx = x - bx
      const dz = z - bz
      const c = Math.cos(rot)
      const s = Math.sin(rot)
      return Math.abs(dx * c - dz * s) < w * 0.42 && Math.abs(dx * s + dz * c) < d * 0.42
    })
  const isClear = (x, z) => clear.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r)
  const tuft = new THREE.BufferGeometry()
  {
    const pts = []
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI
      const lean = 0.06 * (k - 1)
      const cx = Math.cos(a) * 0.05
      const cz = Math.sin(a) * 0.05
      pts.push(-cx, 0, -cz, cx, 0, cz, lean, 1, lean * 0.5)
    }
    tuft.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    tuft.computeVertexNormals()
  }
  const TUFTS = light ? 900 : 2800
  const tufts = new THREE.InstancedMesh(tuft, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, side: THREE.DoubleSide }), TUFTS)
  const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.04, 0), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 }), light ? 50 : 160)
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    const rnd = random(29)
    let n = 0
    for (let tries = 0; n < TUFTS && tries < TUFTS * 3; tries++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * (radius + 10)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (inPit(x, z) || onBare(x, z) || isClear(x, z)) continue
      o.position.set(x, fieldHeight(r, radius), z)
      o.rotation.set(0, rnd() * Math.PI, 0)
      const k = 0.1 + rnd() * 0.22
      o.scale.set(0.5 + rnd() * 0.7, k, 0.5 + rnd() * 0.7)
      o.updateMatrix()
      tufts.setMatrixAt(n, o.matrix)
      tufts.setColorAt(n, col.setHSL(0.13 + rnd() * 0.07, 0.38 + rnd() * 0.15, 0.3 + rnd() * 0.14))
      n++
    }
    tufts.count = n
    const petals = ['#f4d35e', '#f7f3e8', '#c9a7ff', '#e9894a']
    let f = 0
    for (let tries = 0; f < flowers.count && tries < flowers.count * 4; tries++) {
      const a = rnd() * TAU
      const r = 1.5 + Math.sqrt(rnd()) * (radius + 6)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (inPit(x, z, 0.6) || onBare(x, z) || isClear(x, z)) continue
      o.position.set(x, fieldHeight(r, radius) + 0.14 + rnd() * 0.1, z)
      o.rotation.set(rnd(), rnd(), rnd())
      o.scale.setScalar(0.7 + rnd() * 0.6)
      o.updateMatrix()
      flowers.setMatrixAt(f, o.matrix)
      flowers.setColorAt(f, col.set(petals[f % petals.length]).multiplyScalar(0.8))
      f++
    }
    flowers.count = f
  }
  tufts.receiveShadow = true
  group.add(tufts, flowers)

  // golden hills far off, a few dark trees on them
  const hillMat = new THREE.MeshStandardMaterial({ color: '#8c7a45', roughness: 1 })
  const treeMat = new THREE.MeshStandardMaterial({ color: '#2f3a22', roughness: 1 })
  const rndH = random(41)
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU + rndH() * 0.2
    const r = 58 + rndH() * 14
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 10), hillMat)
    m.scale.set(15 + rndH() * 12, 9 + rndH() * 9, 12 + rndH() * 6)
    m.position.set(Math.cos(a) * r, fieldHeight(r, radius) - 4 + rndH() * 2, Math.sin(a) * r)
    m.rotation.y = a
    group.add(m)
  }
  for (let i = 0; i < (light ? 14 : 30); i++) {
    const a = rndH() * TAU
    const r = 34 + rndH() * 20
    const y = fieldHeight(r, radius)
    const tall = rndH() < 0.4
    const m = new THREE.Mesh(tall ? new THREE.ConeGeometry(0.9, 6, 8) : new THREE.SphereGeometry(2, 10, 8), treeMat)
    m.position.set(Math.cos(a) * r, y + (tall ? 2.6 : 1.4), Math.sin(a) * r)
    if (!tall) m.scale.set(1, 0.8 + rndH() * 0.3, 1)
    group.add(m)
  }

  // clouds, lit gold and rose from below by the low sun
  const cloudTex = cloudTexture(9)
  disposers.push(() => cloudTex.dispose())
  const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: '#f4b48a', opacity: 0.7 })
  const clouds = []
  for (const [a, el, d, w] of [[0.9, 0.12, 75, 30], [2.0, 0.2, 78, 24], [3.6, 0.1, 76, 34], [4.6, 0.26, 74, 22], [5.6, 0.15, 77, 28]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.32), cloudMat)
    m.renderOrder = -5
    group.add(m)
    clouds.push({ m, a, el, d, speed: 0.003 + (clouds.length % 3) * 0.0015 })
  }

  // dust and seeds in the low light
  const specks = motes({ count: 260, radius: radius + 3, y0: 0.2, y1: 5, color: '#ffe2a4', size: 0.04, opacity: 0.6, speed: 0.07, light })
  group.add(specks.group)

  // ---- light: a low warm sun behind the arrival, a blue evening sky ----
  const hemi = new THREE.HemisphereLight('#9aa8de', '#5a4530', 0.95)
  const sunLight = new THREE.DirectionalLight('#ffc184', 2.5)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -(radius + 3)
  sunLight.shadow.camera.right = sunLight.shadow.camera.top = radius + 3
  sunLight.shadow.camera.near = 1
  sunLight.shadow.camera.far = 100
  sunLight.shadow.bias = -0.0004
  sunLight.shadow.normalBias = 0.04
  sunLight.position.copy(sunDir).multiplyScalar(45)
  group.add(hemi, sunLight, sunLight.target)

  const horizonC = new THREE.Color('#5a4c84')
  const fog = new THREE.Fog(new THREE.Color('#7d6a86'), 30, 110)

  return {
    group,
    solids: ringWall(radius),
    sunDir,
    sunLight,
    groundAt: (x, z) => fieldHeight(Math.hypot(x, z), radius),
    env: {
      background: horizonC,
      fog,
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.5, radius: 0.5, threshold: 0.86 },
      fov: 62,
      shadows: true,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      for (const c of clouds) {
        const a = c.a + t * c.speed
        c.m.position.set(Math.cos(a) * Math.cos(c.el) * c.d, Math.sin(c.el) * c.d, Math.sin(a) * Math.cos(c.el) * c.d)
        c.m.lookAt(0, c.m.position.y * 0.6, 0)
      }
      specks.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
