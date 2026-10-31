// A stage for picture rooms (docs/knowledge/picture-rooms.md): an ancient shore before plants and animals,
// made for oxygen's picture of the first oxygen, some 2.5 billion years ago. A wet tidal flat to walk on,
// patched with dark microbial mats, running down into warm, clear shallows where stromatolites stand with
// their tops at the surface; the open sea ahead to the horizon; behind and on both sides bare red-brown
// land rising into rocky hills, nothing green on it; far to the left a volcano smoking; a hazy sky, warm
// and orange low down (some scientists think a haze of methane may have tinted the sky at times), the
// Sun high ahead and to the right. No birds, no grass, no shells: nothing alive but microbes.
//
// The ground (`groundAt(x, z)`, also the world's floor) is one function, written in JS and GLSL alike, so
// the water knows how deep it is everywhere: clear and pale over the sand in the shallows, deep teal out in
// the bay, a line of foam where it meets the flat. `stromatolite()` gives the mound's shape (a lathe, its
// laminae banded, a green mat on top); `boulder(seed)` lumpy rock. Big surfaces are mid-toned: pale ones
// bloom to white under the bright sky.
import * as THREE from 'three'
import { canvasTex, clamp, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'
import { lumpyGeometry } from './leaf.js'
import { circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const C = c => new THREE.Color(c)
/** The water's surface (m). */
export const SEA_LEVEL = 0.1
const SKY = { top: C('#6e9cb8'), mid: C('#b9b6a4'), horizon: C('#eaa77a'), warm: C('#f08a52') }
// the Sun: ahead (-z), a little to the right, high (as in the picture)
const SUN_DIR = new THREE.Vector3(0.3, 0.72, -0.62).normalize()

const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** The water's edge: the z of the shoreline at x (the sea lies toward -z). */
export const shoreZ = (x, z0) => z0 + 0.45 * Math.sin(x * 0.33 + 0.7) + 0.2 * Math.sin(x * 0.95 + 2.1)

/** The ground's height at (x, z): the flat sloping gently under the water at the shoreline, the sea floor
 *  deepening out in the bay, the land behind rising far away into bare hills. */
export function groundAt(x, z, z0) {
  const d = z - shoreZ(x, z0)
  let y = -0.07 + 0.24 * smooth(-0.8, 2.4, d)
  y -= 0.22 * smooth(-1, -9, d) + 2.4 * smooth(-9, -40, d)
  const r = Math.hypot(x, z)
  const land = smooth(-1, 6, d)
  y += land * smooth(13, 48, r) * (4.5 + 2.2 * Math.sin(x * 0.09 + 1.3) + 1.6 * Math.sin(z * 0.13 + x * 0.05))
  return y
}

// the same ground near the water in GLSL (the hills are on land, where no water is drawn)
const GROUND_GLSL = /* glsl */ `
  uniform float uZ0;
  float sm(float a, float b, float v) { float t = clamp((v - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  float groundAt(vec2 p) {
    float d = p.y - (uZ0 + 0.45 * sin(p.x * 0.33 + 0.7) + 0.2 * sin(p.x * 0.95 + 2.1));
    float y = -0.07 + 0.24 * sm(-0.8, 2.4, d);
    y -= 0.22 * sm(-1.0, -9.0, d) + 2.4 * sm(-9.0, -40.0, d);
    return y;
  }`

/** The stromatolite's outline, height 1 and widest about 1: [radius, y] from the foot to the crown. */
const PROFILE = [[0.33, 0], [0.4, 0.12], [0.47, 0.3], [0.5, 0.48], [0.48, 0.64], [0.42, 0.78], [0.32, 0.9], [0.18, 0.97], [0, 1]]

/** A stromatolite's shape (height 1, about 1 across): a lathe of the picture's outline, its rows of
 *  vertices running up the laminae (v from the foot, 0, to the crown, 1). */
export function stromatoliteGeometry(segments = 28) {
  const curve = new THREE.SplineCurve(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)))
  const pts = curve.getPoints(24).map(p => new THREE.Vector2(Math.max(0, p.x), p.y))
  pts[pts.length - 1].x = 0
  return new THREE.LatheGeometry(pts, segments)
}

/** Laminae round a stromatolite (bands of pale trapped sand and darker mat, wavy), a green mat on top. */
export function stromatoliteTexture(seed = 5, { mat = '#3f8f5a', top = 0.84 } = {}) {
  const rnd = random(seed)
  return canvasTex(256, 512, (g, w, h) => {
    let y = h
    let k = 0
    while (y > 0) {
      const t = 3 + rnd() * 9
      const light = k % 2 === 0
      const v = light ? 150 + rnd() * 40 : 105 + rnd() * 30
      g.fillStyle = `rgb(${v + 22},${v - 2},${v - 34})`
      g.beginPath()
      g.moveTo(0, y)
      for (let x = 0; x <= w; x += 16) g.lineTo(x, y - t + Math.sin(x * 0.05 + k) * 2)
      g.lineTo(w, y)
      g.closePath()
      g.fill()
      y -= t
      k++
    }
    // the living mat on the crown, fading down the sides
    const grd = g.createLinearGradient(0, 0, 0, h * (1 - top) + 30)
    grd.addColorStop(0, mat)
    grd.addColorStop(0.75, mat)
    grd.addColorStop(1, 'rgba(60,120,80,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h * (1 - top) + 30)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(${rnd() < 0.5 ? '120,200,140' : '30,70,45'},${0.25 + rnd() * 0.3})`
      g.fillRect(rnd() * w, rnd() * h * (1 - top), 2 + rnd() * 3, 2 + rnd() * 3)
    }
  })
}

export function shoreStage({ radius = 10.5, light = false, z0 = -2.2, keep = () => true, mounds = 70, volcano = true } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const updates = []
  const sunDir = SUN_DIR.clone()
  const rnd = random(2500)

  // ---- the sky: hazy, warm and orange low down (stronger on the volcano's side), pale above ----
  const skyU = {
    uSunDir: { value: sunDir },
    uTop: { value: SKY.top.clone() },
    uMid: { value: SKY.mid.clone() },
    uHorizon: { value: SKY.horizon.clone() },
    uWarm: { value: SKY.warm.clone() },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uWarm;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = max(d.y, 0.0);
          // warmer toward the left (the volcano's side, -x), as the picture's sky
          vec3 low = mix(uHorizon, uWarm, clamp(-d.x * 0.8 + 0.2, 0.0, 1.0) * 0.6);
          vec3 c = mix(uMid, uTop, smoothstep(0.15, 0.9, h));
          c = mix(low, c, smoothstep(0.0, 0.3, h));
          if (d.y < 0.0) c = low * 0.95;
          float s = max(dot(d, uSunDir), 0.0);
          // a broad halo in the haze, then the disc
          c += vec3(1.0, 0.86, 0.6) * (pow(s, 6.0) * 0.22 + pow(s, 60.0) * 0.45);
          float a = acos(clamp(dot(d, uSunDir), -1.0, 1.0));
          float disc = 1.0 - smoothstep(0.042, 0.05, a);
          c = mix(c, vec3(2.6, 2.3, 1.7), disc);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)

  // ---- the ground: a polar grid, fine near the middle, out to the far hills ----
  const sandTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#9a8468'
    g.fillRect(0, 0, w, w)
    const r2 = random(17)
    for (let i = 0; i < 3200; i++) {
      const v = r2()
      g.fillStyle = v < 0.55 ? `rgba(120,98,74,${0.12 + r2() * 0.18})` : v < 0.92 ? `rgba(178,152,118,${0.12 + r2() * 0.16})` : 'rgba(70,52,40,0.35)'
      g.fillRect(r2() * w, r2() * w, 1 + r2() * 2.5, 1 + r2() * 2.5)
    }
    // ripple marks left by the waves
    g.strokeStyle = 'rgba(92,72,54,0.32)'
    g.lineWidth = 3
    for (let k = 0; k < 22; k++) {
      const y0 = (k + 0.5) * (w / 22)
      g.beginPath()
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y0 + Math.sin((x / w) * TAU * 3 + k * 1.3) * 4 + Math.sin((x / w) * TAU * 7) * 1.5)
      g.stroke()
    }
  }, { repeat: true })
  disposers.push(() => sandTex.dispose())
  const groundGeo = (() => {
    const rings = [0]
    for (let i = 1; i <= 64; i++) rings.push(0.6 * i + 0.032 * i * i * i * 0.05 + 0.02 * i * i)
    const segs = 120
    const pos = []
    const col = []
    const uv = []
    const idx = []
    const wet = C('#7d6a52')
    const dry = C('#a58565')
    const red = C('#80442c')
    const dark = C('#5b3424')
    const under = C('#8c8064')
    const c = new THREE.Color()
    rings.forEach((r, i) => {
      const n = i === 0 ? 1 : segs
      for (let j = 0; j < n; j++) {
        const a = (j / segs) * TAU
        const x = Math.cos(a) * r
        const z = Math.sin(a) * r
        const y = groundAt(x, z, z0)
        pos.push(x, y, z)
        uv.push(x / 3.2, z / 3.2)
        const d = z - shoreZ(x, z0)
        c.copy(under).lerp(wet, smooth(-1.2, 0, d)).lerp(dry, smooth(0.6, 3.5, d))
        c.lerp(red, smooth(10, 26, r) * smooth(-1, 4, d)).lerp(dark, smooth(2.5, 7, y) * 0.6)
        // deep sea floor darker
        c.multiplyScalar(1 - 0.35 * smooth(-4, -20, d))
        col.push(c.r, c.g, c.b)
      }
    })
    // the centre to the first ring
    for (let j = 0; j < segs; j++) idx.push(0, 1 + ((j + 1) % segs), 1 + j)
    for (let i = 1; i < rings.length - 1; i++) {
      const a0 = 1 + (i - 1) * segs
      const b0 = 1 + i * segs
      for (let j = 0; j < segs; j++) {
        const j1 = (j + 1) % segs
        idx.push(a0 + j, a0 + j1, b0 + j, a0 + j1, b0 + j1, b0 + j)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    return geo
  })()
  const sandMat = new THREE.MeshStandardMaterial({ map: sandTex, vertexColors: true, roughness: 0.95, color: '#ffffff' })
  const ground = new THREE.Mesh(groundGeo, sandMat)
  ground.receiveShadow = true
  group.add(ground)

  // ---- dark, tufted microbial mats on the wet flat and under the shallows ----
  const matTex = canvasTex(256, 256, (g, w) => {
    g.clearRect(0, 0, w, w)
    const r2 = random(23)
    for (let i = 0; i < 70; i++) {
      const x = w / 2 + (r2() - 0.5) * w * 0.55
      const y = w / 2 + (r2() - 0.5) * w * 0.55
      const rr = 14 + r2() * 34
      const grd = g.createRadialGradient(x, y, 0, x, y, rr)
      grd.addColorStop(0, 'rgba(48,82,52,0.75)')
      grd.addColorStop(0.7, 'rgba(70,92,58,0.5)')
      grd.addColorStop(1, 'rgba(70,92,58,0)')
      g.fillStyle = grd
      g.fillRect(x - rr, y - rr, rr * 2, rr * 2)
    }
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(${r2() < 0.5 ? '34,60,40' : '96,130,80'},${0.3 + r2() * 0.4})`
      const x = w / 2 + (r2() - 0.5) * w * 0.7
      const y = w / 2 + (r2() - 0.5) * w * 0.7
      if (Math.hypot(x - w / 2, y - w / 2) < w * 0.36) g.fillRect(x, y, 2, 2)
    }
  })
  disposers.push(() => matTex.dispose())
  {
    const spots = []
    for (let i = 0; i < (light ? 26 : 60); i++) {
      const x = (rnd() - 0.5) * 2 * (radius + 4)
      const z0s = shoreZ(x, z0)
      const z = z0s + 1.4 - rnd() * 7
      if (Math.hypot(x, z) > radius + 5 || !keep(x, z, 1.2)) continue
      spots.push([x, z, 0.8 + rnd() * 1.6, rnd() * TAU])
    }
    const mats = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: matTex, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }), spots.length)
    const o = new THREE.Object3D()
    spots.forEach(([x, z, s, a], k) => {
      o.position.set(x, groundAt(x, z, z0) + 0.012, z)
      o.rotation.set(0, a, 0)
      o.scale.set(s * 1.6, 1, s)
      o.updateMatrix()
      mats.setMatrixAt(k, o.matrix)
    })
    mats.receiveShadow = true
    group.add(mats)
  }

  // ---- stromatolites in the shallows: tops at the surface, a green mat on each ----
  const stromGeo = stromatoliteGeometry(light ? 18 : 28)
  const stromTex = stromatoliteTexture(7)
  disposers.push(() => stromTex.dispose())
  const stromMat = new THREE.MeshStandardMaterial({ map: stromTex, roughness: 0.85, emissive: '#16402a', emissiveIntensity: 0.15 })
  const stromSpots = []
  {
    let tries = 0
    while (stromSpots.length < (light ? Math.round(mounds * 0.6) : mounds) && tries++ < 4000) {
      // more of them near, where they can be seen
      const x = (rnd() - 0.5) * (tries % 2 ? 36 : 70)
      const z = -3 - rnd() * (tries % 2 ? 20 : 34)
      const d = z - shoreZ(x, z0)
      if (d > -1.6) continue
      if (!keep(x, z, 1.1)) continue
      const far = Math.hypot(x, z)
      const near = far < radius + 1
      const w = (near ? 0.8 : far < 26 ? 1.4 : 1) * (0.7 + rnd() * 1.4)
      if (stromSpots.some(s => Math.hypot(s[0] - x, s[1] - z) < (s[2] + w) * 0.55)) continue
      const foot = groundAt(x, z, z0)
      // the crown reaches about the surface, a few stand proud of it at low tide
      const h = Math.max(0.2, SEA_LEVEL - foot + (near ? 0.1 + rnd() * 0.35 : far < 26 ? 0.12 + rnd() * 0.45 : -0.2 + rnd() * 0.5))
      stromSpots.push([x, z, w, h, foot, rnd() * TAU])
    }
    const inst = new THREE.InstancedMesh(stromGeo, stromMat, stromSpots.length)
    const o = new THREE.Object3D()
    stromSpots.forEach(([x, z, w, h, foot, a], k) => {
      o.position.set(x, foot - 0.03, z)
      o.rotation.set(0, a, 0)
      o.scale.set(w, h, w * (0.85 + 0.3 * ((k * 0.37) % 1)))
      o.updateMatrix()
      inst.setMatrixAt(k, o.matrix)
    })
    inst.castShadow = true
    inst.receiveShadow = true
    group.add(inst)
  }

  // ---- the water: one sheet at sea level, clear over the shallows, deep teal out in the bay ----
  const waterU = {
    uSunDir: { value: sunDir },
    uSkyTop: { value: SKY.top.clone().lerp(SKY.mid, 0.4) },
    uSkyHorizon: { value: SKY.horizon.clone().lerp(SKY.mid, 0.45) },
    uTime: { value: 0 },
    uZ0: { value: z0 },
    uShallow: { value: C('#5fc4b4') },
    uDeep: { value: C('#17606a') },
    fogColor: { value: new THREE.Color() },
    fogNear: { value: 1 },
    fogFar: { value: 2000 },
    fogDensity: { value: 0.00025 },
  }
  const waterMat = new THREE.ShaderMaterial({
    fog: true,
    transparent: true,
    depthWrite: false,
    uniforms: waterU,
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir; uniform vec3 uSkyTop; uniform vec3 uSkyHorizon; uniform float uTime;
      uniform vec3 uShallow; uniform vec3 uDeep;
      varying vec3 vWorld;
      ${GROUND_GLSL}
      #include <fog_pars_fragment>
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      float waves(vec2 p) {
        float t = uTime;
        return noise(p * 1.7 - vec2(t * 0.35, t * 0.12)) + 0.5 * noise(p * 4.3 + vec2(t * 0.2, -t * 0.45));
      }
      void main() {
        vec3 V = normalize(cameraPosition - vWorld);
        float dist = length(cameraPosition - vWorld);
        vec2 p = vWorld.xz;
        float depth = vWorld.y - groundAt(p);
        if (depth < 0.0) discard;
        float e = 0.05;
        float h0 = waves(p);
        float amp = 0.05 * (1.0 - smoothstep(20.0, 80.0, dist));
        vec3 N = normalize(vec3(-(waves(p + vec2(e, 0.0)) - h0) / e * amp, 1.0, -(waves(p + vec2(0.0, e)) - h0) / e * amp));
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fres = 0.03 + 0.97 * pow(1.0 - ndv, 5.0);
        vec3 R = reflect(-V, N);
        vec3 sky = mix(uSkyHorizon, uSkyTop, pow(clamp(R.y, 0.0, 1.0), 0.6));
        float deep = smoothstep(0.05, 1.6, depth);
        vec3 base = mix(uShallow, uDeep, deep);
        vec3 c = mix(base, sky, fres * 0.55);
        c += vec3(1.0, 0.9, 0.7) * pow(max(dot(R, uSunDir), 0.0), 400.0) * 2.2;
        // a line of foam where the water thins out on the flat
        float foam = (1.0 - smoothstep(0.0, 0.035, depth)) * (0.55 + 0.45 * noise(p * 6.0 + uTime * 0.6));
        c = mix(c, vec3(0.93, 0.92, 0.86), foam * 0.75);
        float alpha = mix(0.32, 0.93, deep);
        alpha = max(alpha, fres * 0.8);
        alpha = max(alpha, foam * 0.8) * smoothstep(0.0, 0.01, depth);
        gl_FragColor = vec4(c, alpha);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
  const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 900, 1, 1).rotateX(-Math.PI / 2), waterMat)
  water.position.y = SEA_LEVEL
  water.renderOrder = 2
  group.add(water)
  disposers.push(() => waterMat.dispose())

  // ---- rock: lumpy boulders along the shore and on the hills, red-brown and bare ----
  const rockTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#7a4632'
    g.fillRect(0, 0, w, w)
    const r2 = random(31)
    for (let i = 0; i < 900; i++) {
      const v = r2()
      g.fillStyle = v < 0.5 ? `rgba(60,30,22,${0.15 + r2() * 0.25})` : `rgba(160,98,70,${0.12 + r2() * 0.2})`
      g.beginPath()
      g.ellipse(r2() * w, r2() * w, 2 + r2() * 9, 1 + r2() * 5, r2() * Math.PI, 0, TAU)
      g.fill()
    }
    g.strokeStyle = 'rgba(40,20,16,0.4)'
    for (let i = 0; i < 14; i++) {
      let x = r2() * w
      let y = r2() * w
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 4; k++) {
        x += (r2() - 0.5) * 50
        y += (r2() - 0.5) * 50
        g.lineTo(x, y)
      }
      g.stroke()
    }
  }, { repeat: true })
  disposers.push(() => rockTex.dispose())
  const rockMat = new THREE.MeshStandardMaterial({ map: rockTex, color: '#c9a08a', roughness: 0.95 })
  const boulders = [lumpyGeometry(11, { detail: 16, bump: 2.2 }), lumpyGeometry(12, { detail: 16, bump: 2.6 }), lumpyGeometry(13, { detail: 16, bump: 1.8 })]
  {
    const spots = []
    for (let i = 0; i < (light ? 30 : 60); i++) {
      const a = rnd() * TAU
      const r = 13 + rnd() * 40
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (z - shoreZ(x, z0) < -1.5) continue
      spots.push([x, z, 0.6 + rnd() * 2.4 * (r / 25), rnd()])
    }
    const per = boulders.map(() => [])
    spots.forEach((s, k) => per[k % 3].push(s))
    per.forEach((list, b) => {
      const inst = new THREE.InstancedMesh(boulders[b], rockMat, list.length)
      const o = new THREE.Object3D()
      list.forEach(([x, z, s, q], k) => {
        o.position.set(x, groundAt(x, z, z0) + s * 0.15, z)
        o.rotation.set(q * 2, q * 7, q * 3)
        o.scale.set(s * (1 + q * 0.5), s * 0.6, s)
        o.updateMatrix()
        inst.setMatrixAt(k, o.matrix)
      })
      inst.castShadow = true
      group.add(inst)
    })
  }

  // ---- far away: ranges of bare hills round the land, a volcano smoking on the left ----
  const farMat = new THREE.MeshStandardMaterial({ color: '#6a3a2c', roughness: 1 })
  {
    const n = 96
    const pos = []
    const idx = []
    // a ring of ridges from the sea's right edge round behind to its left edge (azimuth from -z, to the right)
    for (let i = 0; i <= n; i++) {
      const k = i / n
      const az = 1.3 + k * (TAU - 2.6)
      const ridge = 18 + 14 * Math.sin(k * 17) * Math.sin(k * 5 + 1) + 10 * Math.sin(k * 41)
      for (const [r, y] of [[60, -1], [120, ridge * 0.7], [170, ridge + 8], [230, -2]]) pos.push(Math.sin(az) * r, y, -Math.cos(az) * r)
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < 3; j++) {
        const a = i * 4 + j
        idx.push(a, a + 1, a + 4, a + 1, a + 5, a + 4)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const ranges = new THREE.Mesh(geo, farMat)
    ranges.material.side = THREE.DoubleSide
    group.add(ranges)
  }
  const plume = []
  if (volcano) {
    const v = new THREE.Group()
    const az = -0.5
    v.position.set(Math.sin(az) * 240, -2, -Math.cos(az) * 240)
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(9, 150, 78, 40, 1, true), new THREE.MeshStandardMaterial({ color: '#4a2520', roughness: 1 }))
    cone.position.y = 39
    v.add(cone)
    const lava = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(1.15) })
    const crater = new THREE.Mesh(new THREE.CircleGeometry(9, 24).rotateX(-Math.PI / 2), lava)
    crater.position.y = 78.1
    v.add(crater)
    // a stream of lava down the near flank
    const pts = []
    // down the upper flank only (a glowing line to the foot read as a stick across the view)
    for (let i = 0; i <= 12; i++) {
      const k = (i / 12) * 0.4
      const r = 10.5 + k * 137.4
      pts.push(new THREE.Vector3(Math.sin(k * 7) * 5, 78 - k * 76, r).applyAxisAngle(new THREE.Vector3(0, 1, 0), -az + 0.15 + Math.sin(k * 4) * 0.05))
    }
    // (thin: from the shore, 240 m away, a thick tube read as a stripe across the sky)
    const stream = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.7, 5), lava)
    v.add(stream)
    const smokeTex = canvasTex(128, 128, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,0.9)')
      grd.addColorStop(0.5, 'rgba(255,255,255,0.4)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    })
    disposers.push(() => smokeTex.dispose())
    const smokeMat = new THREE.SpriteMaterial({ map: smokeTex, color: '#7d6870', transparent: true, depthWrite: false, opacity: 0.7, fog: false })
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Sprite(smokeMat)
      v.add(s)
      plume.push({ s, k: i / 9 })
    }
    group.add(v)
  }

  // haze drifting in the warm air
  const haze = motes({ count: 260, radius: radius + 6, y0: 0.3, y1: 7, color: '#ffe2c0', size: 0.05, opacity: 0.4, speed: 0.08, light })
  group.add(haze.group)

  // ---- light: a hazy sky and a strong Sun ----
  const hemi = new THREE.HemisphereLight('#f1d6b8', '#7a4a34', 1.25)
  const sun = new THREE.DirectionalLight('#fff0d8', 2.5)
  sun.position.copy(sunDir).multiplyScalar(40)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -(radius + 6)
  sun.shadow.camera.right = sun.shadow.camera.top = radius + 6
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 90
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  group.add(hemi, sun, sun.target)

  updates.push(t => {
    waterU.uTime.value = t
    haze.update(t)
    plume.forEach(p => {
      const k = (p.k + t * 0.012) % 1
      p.s.position.set(-k * 70, 82 + k * 90, k * 20)
      p.s.scale.setScalar(18 + k * 60)
      p.s.material.opacity = 0.7
    })
  })

  return {
    group,
    solids: [...ringWall(radius), ...stromSpots.filter(([x, z]) => Math.hypot(x, z) < radius + 1.5).map(([x, z, w]) => circle(x, z, w * 0.45))],
    stromatolites: stromSpots,
    sunDir,
    sunLight: sun,
    mats: { sand: sandMat, rock: rockMat, strom: stromMat, far: farMat },
    boulders,
    groundAt: (x, z) => groundAt(x, z, z0),
    shoreZ: x => shoreZ(x, z0),
    env: {
      background: SKY.horizon.clone(),
      fog: new THREE.Fog(SKY.horizon.clone().lerp(SKY.mid, 0.3), 120, 650),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.42, radius: 0.5, threshold: 0.9 },
      fov: 62,
      shadows: true,
      far: 1200,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      for (const u of updates) u(t)
    },
    dispose() {
      disposers.forEach(f => f())
      stromGeo.dispose()
    },
  }
}
