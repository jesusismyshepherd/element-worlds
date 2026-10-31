// A stage for picture rooms (docs/knowledge/picture-rooms.md): an observation gondola hanging under a huge
// parachute, sinking into a gas giant's atmosphere (made for hydrogen's `jupiter` picture, 2026-10-31). A
// round deck with a brass rail, its hull tapering below, cables rising in a cone to a load ring and on to a
// striped canopy high overhead; all round, the planet's sky. There is no ground: cloud decks lie above and
// below, each a stack of soft sheets with a clear hole where the gondola falls (as the Galileo probe fell
// through a clear, dry "hot spot"), so you see the next deck down through it and the deck you are in stands
// round you as walls of cloud. setAltitude(z) moves the gondola (z in km above the 1-bar level): the decks
// pass by, the sky darkens from a pale golden haze to the hot dark below, the sun fades, lightning flickers
// in the deck that has it, and motes rush upward while it sinks.
//
//   gasGiantStage({ light, camera, radius, scale, layers: [{ z, thick, color, lit, cover, lightning }], sky,
//                   towers: { from, to, count } })
//   -> { group, solids, env, cameraBounds, mats, setAltitude(z), altitude, flash(), onFlash, update(dt, t), dispose }
//
// `scale`: metres of scene per km of height (the decks are squeezed so several show at once); `sky`: the
// colours by height (JUPITER_SKY by default); `towers`: thunderheads far off, rising from one deck (km) up
// through the ones above (one draw call: billboards in a shader). Keep big surfaces mid-toned: a pale haze under the bloom
// washes everything white (picture-rooms.md, the snow trap).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, clamp, lerp } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'

const TAU = Math.PI * 2

/** Jupiter's look by height (km above the 1-bar level, highest first): the sky overhead, the haze at the
 *  horizon, the depths below it, the fog (colour, near, far in m), the sun's strength and the fill light's. */
export const JUPITER_SKY = [
  { z: 30, top: '#6a4c32', horizon: '#c29a68', below: '#8e6a44', fog: '#b48e62', near: 140, far: 1300, sun: 2.4, fill: 1.0 },
  { z: 9, top: '#9a8a70', horizon: '#b8aa90', below: '#9c8e76', fog: '#ae9f86', near: 40, far: 420, sun: 1.7, fill: 0.95 },
  { z: -6, top: '#8a6a48', horizon: '#a9845c', below: '#8a6440', fog: '#9e7852', near: 60, far: 650, sun: 1.15, fill: 0.85 },
  { z: -20, top: '#6e4428', horizon: '#8c5834', below: '#6e4226', fog: '#80502e', near: 35, far: 380, sun: 0.65, fill: 0.75 },
  { z: -38, top: '#47362a', horizon: '#604634', below: '#432f22', fog: '#56402f', near: 45, far: 440, sun: 0.32, fill: 0.65 },
  { z: -54, top: '#333d48', horizon: '#43525f', below: '#29313a', fog: '#3d4a56', near: 35, far: 360, sun: 0.14, fill: 0.6 },
  { z: -95, top: '#21160e', horizon: '#352315', below: '#1b120b', fog: '#2b1c10', near: 30, far: 300, sun: 0.03, fill: 0.55 },
  { z: -140, top: '#180e09', horizon: '#29160e', below: '#140b07', fog: '#21130b', near: 25, far: 250, sun: 0, fill: 0.5 },
  { z: -270, top: '#130705', horizon: '#290d07', below: '#120504', fog: '#200b06', near: 22, far: 210, sun: 0, fill: 0.5 },
]

/** A tileable value noise (the red channel), 256 px, for the cloud sheets. */
function noiseTexture(seed = 7) {
  const N = 256
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const field = new Float32Array(N * N)
  let amp = 1
  let total = 0
  for (const g of [4, 8, 16, 32, 64]) {
    const lat = Array.from({ length: g * g }, rnd)
    const v = (i, j) => lat[((j + g) % g) * g + ((i + g) % g)]
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const fx = (x / N) * g
        const fy = (y / N) * g
        const i = Math.floor(fx)
        const j = Math.floor(fy)
        let u = fx - i
        let w = fy - j
        u = u * u * (3 - 2 * u)
        w = w * w * (3 - 2 * w)
        const a = lerp(v(i, j), v(i + 1, j), u)
        const b = lerp(v(i, j + 1), v(i + 1, j + 1), u)
        field[y * N + x] += lerp(a, b, w) * amp
      }
    }
    total += amp
    amp *= 0.55
  }
  return canvasTex(N, N, (g, w, h) => {
    const img = g.createImageData(w, h)
    for (let i = 0; i < N * N; i++) {
      const v = Math.round(clamp(field[i] / total) * 255)
      img.data.set([v, v, v, 255], i * 4)
    }
    g.putImageData(img, 0, 0)
  }, { srgb: false, repeat: true })
}

/** A soft round glow for sprites. */
function glowTexture() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

const CLOUD_VERT = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`
const CLOUD_FRAG = /* glsl */ `
  uniform sampler2D uNoise; uniform float uTime; uniform vec3 uCol; uniform vec3 uLit; uniform float uCover;
  uniform float uHole; uniform float uAlpha; uniform vec3 uFog; uniform float uNear; uniform float uFar;
  uniform vec3 uFlashPos; uniform float uFlash; uniform float uSeed;
  varying vec3 vW;
  void main() {
    vec2 p = vW.xz;
    float r = length(p);
    vec2 q = p * 0.0042 + vec2(uTime * 0.0032 + uSeed, uSeed * 0.7);
    float n = texture2D(uNoise, q).r * 0.62 + texture2D(uNoise, q * 3.3 + vec2(0.37, uTime * 0.002)).r * 0.38;
    float cov = smoothstep(uCover, uCover + 0.16, n);
    // the clear hole the gondola falls through, its edge ragged
    float m = texture2D(uNoise, vec2(atan(p.y, p.x) * 0.16, uSeed * 0.31)).r;
    float hole = smoothstep(uHole * (0.72 + 0.5 * m), uHole * (1.12 + 0.6 * m), r);
    float a = cov * hole * uAlpha;
    if (a < 0.004) discard;
    vec3 c = mix(uCol, uLit, smoothstep(0.35, 0.85, n));
    // lightning lighting the cloud from inside
    float fl = uFlash * exp(-distance(vW, uFlashPos) / 140.0);
    c += vec3(0.85, 0.9, 1.0) * fl * 2.4;
    float d = distance(cameraPosition, vW);
    float f = smoothstep(uNear, uFar, d);
    c = mix(c, uFog, f);
    gl_FragColor = vec4(c, a * (1.0 - 0.35 * f));
    #include <colorspace_fragment>
  }`

export function gasGiantStage({ light = false, camera = null, radius = 8.5, scale = 2.5, layers = [], sky = JUPITER_SKY, canopy = '#ff7062', towers = null } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const noise = noiseTexture(19)
  const glow = glowTexture()
  textures.push(noise, glow)
  const C = c => new THREE.Color(c)

  // ---- materials the scene may share ----
  const mats = {
    brass: new THREE.MeshStandardMaterial({ color: '#c9a25a', roughness: 0.35, metalness: 0.85 }),
    metal: new THREE.MeshStandardMaterial({ color: '#3b4660', roughness: 0.5, metalness: 0.45 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1d2335', roughness: 0.55, metalness: 0.4 }),
    hull: new THREE.MeshStandardMaterial({ color: '#2b3348', roughness: 0.6, metalness: 0.35 }),
    cable: new THREE.MeshStandardMaterial({ color: '#d8d0c0', roughness: 0.7 }),
  }

  // ---- the sky: a dome shading from the haze overhead to the depths below ----
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: C('#8d7354') },
      uHorizon: { value: C('#c9ac80') },
      uBelow: { value: C('#a8845a') },
      uSunDir: { value: new THREE.Vector3(0.5, 0.3, -0.8).normalize() },
      uSunK: { value: 1 },
      uFlash: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uBelow; uniform vec3 uSunDir; uniform float uSunK; uniform float uFlash;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float y = d.y;
        vec3 c = y > 0.0 ? mix(uHorizon, uTop, pow(clamp(y, 0.0, 1.0), 0.55)) : mix(uHorizon, uBelow, pow(clamp(-y, 0.0, 1.0), 0.45));
        // the sun, a glow through the haze (never a disc: it is far, and the haze is thick)
        float s = pow(max(dot(d, uSunDir), 0.0), 10.0);
        c += vec3(0.32, 0.26, 0.17) * s * uSunK;
        // the haze glows along the horizon on the sun's side
        c += vec3(0.1, 0.07, 0.035) * exp(-abs(y) * 9.0) * (0.4 + 0.6 * max(dot(normalize(d.xz + 1e-4), normalize(uSunDir.xz)), 0.0)) * uSunK;
        c += vec3(0.25, 0.28, 0.34) * uFlash * smoothstep(0.15, -0.5, y);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1200, 48, 24), skyMat)
  dome.renderOrder = -20
  dome.frustumCulled = false
  group.add(dome)

  // ---- the cloud decks: soft sheets stacked through each deck's thickness ----
  const sheets = []
  const SLICES = light ? 3 : 6
  const sheetGeo = new THREE.CircleGeometry(1000, 72).rotateX(-Math.PI / 2)
  geos.push(sheetGeo)
  layers.forEach((L, li) => {
    for (let k = 0; k < SLICES; k++) {
      const u = SLICES === 1 ? 0.5 : k / (SLICES - 1)
      const mid = 1 - Math.abs(u - 0.5) * 2
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
        uniforms: {
          uNoise: { value: noise },
          uTime: { value: 0 },
          uCol: { value: C(L.color).lerp(C(L.lit ?? L.color), u * 0.6) },
          uLit: { value: C(L.lit ?? L.color) },
          // the middle of a deck is fuller than its top and bottom: puffy in section
          uCover: { value: (L.cover ?? 0.42) + 0.14 * (1 - mid) },
          uHole: { value: (L.hole ?? 34) * (0.9 + 0.25 * (1 - mid)) },
          uAlpha: { value: (light ? 0.75 : 0.55) * (0.65 + 0.35 * mid) },
          uFog: { value: C('#b4aa94') },
          uNear: { value: 60 },
          uFar: { value: 600 },
          uFlashPos: { value: new THREE.Vector3(0, -999, 0) },
          uFlash: { value: 0 },
          uSeed: { value: li * 0.37 + k * 0.11 },
        },
        vertexShader: CLOUD_VERT,
        fragmentShader: CLOUD_FRAG,
      })
      const mesh = new THREE.Mesh(sheetGeo, mat)
      mesh.frustumCulled = false
      mesh.raycast = () => {}
      group.add(mesh)
      sheets.push({ mesh, mat, layer: L, off: (u - 0.5) * (L.thick ?? 4) })
    }
  })

  // ---- storm towers: thunderheads far off, rising from a deck up through the ones above ----
  const towerGroup = new THREE.Group()
  group.add(towerGroup)
  const towerMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uNoise: { value: noise },
      uLit: { value: C('#e0d2b4') },
      uShadow: { value: C('#7a6046') },
      uFog: { value: C('#b48e62') },
      uNear: { value: 140 },
      uFar: { value: 1300 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aOff; attribute float aSize; attribute float aShade;
      varying vec2 vUv; varying float vShade; varying float vD;
      void main() {
        vec4 mv = modelViewMatrix * vec4(aOff, 1.0);
        mv.xy += position.xy * aSize;
        vUv = uv;
        vShade = aShade;
        vD = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uNoise; uniform vec3 uLit; uniform vec3 uShadow; uniform vec3 uFog; uniform float uNear; uniform float uFar;
      varying vec2 vUv; varying float vShade; varying float vD;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float n = texture2D(uNoise, vUv * 0.6 + vec2(vShade * 3.1, vShade * 1.7)).r;
        float a = smoothstep(1.0, 0.4 + 0.35 * n, r);
        if (a < 0.01) discard;
        // lit from above: bright tops, shadowed bellies
        float lit = clamp(0.25 + vUv.y * 0.7 + vShade * 0.3, 0.0, 1.0);
        vec3 col = mix(uShadow, uLit, lit * (0.7 + 0.3 * n));
        float f = smoothstep(uNear, uFar, vD);
        col = mix(col, uFog, f);
        gl_FragColor = vec4(col, a * 0.9 * (1.0 - 0.45 * f));
        #include <colorspace_fragment>
      }`,
  })
  if (towers) {
    const n = light ? Math.max(3, Math.round(towers.count * 0.6)) : towers.count
    const per = light ? 10 : 18
    const offs = []
    const sizes = []
    const shades = []
    let sd = 77
    const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rnd() * 0.7
      const r = 220 + rnd() * 300
      const cx = Math.cos(a) * r
      const cz = Math.sin(a) * r
      const y0 = towers.from * scale
      const y1 = (towers.to + rnd() * 5) * scale
      for (let k = 0; k < per; k++) {
        const u = k / (per - 1)
        // a column, swelling as it rises, spreading into an anvil at the top
        const top = u > 0.82
        const w = (34 + 34 * u + (top ? 60 : 0)) * (0.8 + rnd() * 0.4)
        offs.push(cx + (rnd() - 0.5) * w * (top ? 1.6 : 0.6), lerp(y0, y1, Math.pow(u, 0.85)), cz + (rnd() - 0.5) * w * (top ? 1.6 : 0.6))
        sizes.push(w)
        shades.push(u)
      }
    }
    const base = new THREE.PlaneGeometry(1, 1)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = base.index
    geo.setAttribute('position', base.attributes.position)
    geo.setAttribute('uv', base.attributes.uv)
    geo.setAttribute('aOff', new THREE.InstancedBufferAttribute(new Float32Array(offs), 3))
    geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(new Float32Array(sizes), 1))
    geo.setAttribute('aShade', new THREE.InstancedBufferAttribute(new Float32Array(shades), 1))
    geo.instanceCount = sizes.length
    geos.push(geo, base)
    const mesh = new THREE.Mesh(geo, towerMat)
    mesh.frustumCulled = false
    mesh.raycast = () => {}
    mesh.renderOrder = -16
    towerGroup.add(mesh)
  }

  // ---- the deck ----
  const N = light ? 512 : 1024
  const paint = (g, w, glowOnly) => {
    const c = w / 2
    g.fillStyle = glowOnly ? '#000000' : '#343c52'
    g.fillRect(0, 0, w, w)
    const rings = [0.18, 0.4, 0.62, 0.84, 0.985]
    if (!glowOnly) {
      for (let i = rings.length - 1; i >= 0; i--) {
        g.fillStyle = ['#2f374c', '#384157', '#323a50', '#3a4359', '#2e364b'][i]
        g.beginPath()
        g.arc(c, c, rings[i] * c, 0, TAU)
        g.fill()
      }
      let s = 31
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
      for (let i = 0; i < 2600; i++) {
        const v = 45 + rnd() * 40
        g.fillStyle = `rgba(${v + 10},${v + 6},${v},${0.1 + rnd() * 0.18})`
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 3, 1 + rnd() * 3)
      }
      g.strokeStyle = 'rgba(10,12,22,0.8)'
      g.lineWidth = w / 380
      for (const r of rings) {
        g.beginPath()
        g.arc(c, c, r * c, 0, TAU)
        g.stroke()
      }
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU
        const r0 = i % 2 ? rings[1] : rings[0]
        g.beginPath()
        g.moveTo(c + Math.cos(a) * r0 * c, c + Math.sin(a) * r0 * c)
        g.lineTo(c + Math.cos(a) * rings[4] * c, c + Math.sin(a) * rings[4] * c)
        g.stroke()
      }
      g.fillStyle = 'rgba(210,180,120,0.35)'
      for (const r of rings.slice(1)) {
        const n = Math.round(r * 90)
        for (let i = 0; i < n; i++) {
          const a = ((i + 0.5) / n) * TAU
          g.beginPath()
          g.arc(c + Math.cos(a) * (r * c - w / 200), c + Math.sin(a) * (r * c - w / 200), w / 600, 0, TAU)
          g.fill()
        }
      }
    }
    // a warm guide ring, glowing faintly
    g.strokeStyle = glowOnly ? '#a8783c' : '#b08850'
    g.lineWidth = w / 300
    g.setLineDash([w / 70, w / 110])
    g.beginPath()
    g.arc(c, c, 0.5 * c, 0, TAU)
    g.stroke()
    g.setLineDash([])
    g.beginPath()
    g.arc(c, c, 0.94 * c, 0, TAU)
    g.stroke()
  }
  const floorTex = canvasTex(N, N, (g, w) => paint(g, w, false))
  const floorGlow = canvasTex(N, N, (g, w) => paint(g, w, true))
  textures.push(floorTex, floorGlow)
  const top = new THREE.MeshStandardMaterial({ map: floorTex, emissive: '#ffffff', emissiveMap: floorGlow, emissiveIntensity: 0.25, roughness: 0.7, metalness: 0.2 })
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.25, radius + 0.1, 0.32, 128), [mats.hull, top, mats.hull])
  deck.position.y = -0.16
  group.add(deck)
  // the hull below: a bowl tapering into the haze, a ring of portholes, a keel lamp
  const bowl = new THREE.Mesh(
    new THREE.LatheGeometry([[radius + 0.1, 0], [radius - 0.4, -1.2], [radius - 2.2, -2.8], [radius - 5, -3.8], [1.2, -4.4], [0.6, -5.2], [0, -5.4]].map(([x, y]) => new THREE.Vector2(x, y)).reverse(), 64),
    mats.hull,
  )
  bowl.position.y = -0.32
  group.add(bowl)
  const portMat = new THREE.MeshStandardMaterial({ color: '#ffd9a0', emissive: '#ffb860', emissiveIntensity: 1.4, roughness: 0.4 })
  const ports = new THREE.InstancedMesh(new THREE.SphereGeometry(0.16, 10, 8), portMat, 24)
  const o = new THREE.Object3D()
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU
    o.position.set(Math.cos(a) * (radius - 0.95), -1.55, Math.sin(a) * (radius - 0.95))
    o.updateMatrix()
    ports.setMatrixAt(i, o.matrix)
  }
  group.add(ports)
  const keel = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 10), portMat)
  keel.position.y = -5.6
  group.add(keel)

  // the rail: two brass rings on posts, and a dark kick plate round the edge
  const railR = radius - 0.05
  const rail = new THREE.Mesh(new THREE.TorusGeometry(railR, 0.045, 8, 160), mats.brass)
  rail.rotation.x = Math.PI / 2
  rail.position.y = 1.05
  const rail2 = new THREE.Mesh(new THREE.TorusGeometry(railR, 0.025, 6, 160), mats.brass)
  rail2.rotation.x = Math.PI / 2
  rail2.position.y = 0.55
  group.add(rail, rail2)
  const POSTS = 48
  const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.035, 1.05, 8), mats.brass, POSTS)
  for (let i = 0; i < POSTS; i++) {
    const a = (i / POSTS) * TAU
    o.position.set(Math.cos(a) * railR, 0.525, Math.sin(a) * railR)
    o.updateMatrix()
    posts.setMatrixAt(i, o.matrix)
  }
  group.add(posts)
  const kick = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.02, radius + 0.02, 0.16, 128, 1, true), mats.dark)
  kick.position.y = 0.08
  group.add(kick)

  // ---- the cables and the parachute ----
  const RING = { y: 17, r: 0.9 }
  const SKIRT = { y: 44, r: 19 }
  const anchors = 12
  const cableGeos = []
  const cable = (a, b, r = 0.022) => {
    const len = a.distanceTo(b)
    const g = new THREE.CylinderGeometry(r, r, len, 5, 1, true)
    const m = new THREE.Matrix4().compose(
      a.clone().add(b).multiplyScalar(0.5),
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()),
      new THREE.Vector3(1, 1, 1),
    )
    cableGeos.push(g.applyMatrix4(m))
  }
  for (let i = 0; i < anchors; i++) {
    const a = (i / anchors) * TAU + TAU / 48
    const foot = new THREE.Vector3(Math.cos(a) * railR, 1.1, Math.sin(a) * railR)
    cable(foot, new THREE.Vector3(Math.cos(a) * RING.r, RING.y, Math.sin(a) * RING.r), 0.028)
  }
  const GORES = 24
  for (let i = 0; i < GORES; i++) {
    const a = (i / GORES) * TAU
    cable(new THREE.Vector3(Math.cos(a) * RING.r * 0.8, RING.y + 0.6, Math.sin(a) * RING.r * 0.8), new THREE.Vector3(Math.cos(a) * SKIRT.r, SKIRT.y, Math.sin(a) * SKIRT.r), 0.035)
  }
  const cables = new THREE.Mesh(mergeGeometries(cableGeos), mats.cable)
  cableGeos.forEach(g => g.dispose())
  geos.push(cables.geometry)
  group.add(cables)
  const loadRing = new THREE.Mesh(new THREE.TorusGeometry(RING.r, 0.12, 10, 32), mats.brass)
  loadRing.rotation.x = Math.PI / 2
  loadRing.position.y = RING.y
  const swivel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.9, 12), mats.metal)
  swivel.position.y = RING.y + 0.5
  group.add(loadRing, swivel)
  // the canopy: gores of cream and the picture's colour, a vent at the top
  const goreTex = canvasTex(1024, 256, (g, w, h) => {
    const cw = w / GORES
    for (let i = 0; i < GORES; i++) {
      g.fillStyle = i % 2 ? '#e6dccb' : canopy
      g.fillRect(i * cw, 0, cw + 1, h)
      g.fillStyle = 'rgba(60,40,30,0.35)'
      g.fillRect(i * cw, 0, 2, h)
    }
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, 'rgba(0,0,0,0.25)')
    grd.addColorStop(0.5, 'rgba(0,0,0,0)')
    grd.addColorStop(0.92, 'rgba(0,0,0,0)')
    grd.addColorStop(1, 'rgba(70,40,20,0.5)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(goreTex)
  const canopyMat = new THREE.MeshStandardMaterial({ map: goreTex, side: THREE.DoubleSide, roughness: 0.85, emissive: '#ffffff', emissiveMap: goreTex, emissiveIntensity: 0.18 })
  const canopyMesh = new THREE.Mesh(new THREE.SphereGeometry(SKIRT.r / Math.sin(1.05), 64, 16, 0, TAU, 0.07, 1.05 - 0.07), canopyMat)
  canopyMesh.scale.y = 0.55
  canopyMesh.position.y = SKIRT.y - (SKIRT.r / Math.sin(1.05)) * Math.cos(1.05) * 0.55
  group.add(canopyMesh)

  // ---- light: the sun high above through the haze, a fill from the sky, the gondola's own lamps ----
  const sun = new THREE.DirectionalLight('#ffe6c0', 2.4)
  sun.position.set(22, 40, -36)
  group.add(sun, sun.target)
  const fill = new THREE.HemisphereLight('#c9ac80', '#a8845a', 1)
  group.add(fill)
  const lamps = [[-3.4, 3.4, 1.5], [3.4, 3.4, -1.8]].map(([x, y, z]) => {
    const l = new THREE.PointLight('#ffd6a0', 0, 16, 1.3)
    l.position.set(x, y, z)
    group.add(l)
    return l
  })

  // ---- lightning: glows deep in a deck, lighting it from inside ----
  const boltMat = new THREE.MeshBasicMaterial({ color: C('#eef4ff').multiplyScalar(2.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
  const bolts = Array.from({ length: 3 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: C('#dfe8ff').multiplyScalar(2.4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.visible = false
    group.add(s)
    // a jagged channel, about 80 m tall, forking once
    let sd = 101 + i * 37
    const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647)
    const zig = (from, n, step) => {
      const pts = [from.clone()]
      for (let k = 0; k < n; k++) pts.push(pts[pts.length - 1].clone().add(new THREE.Vector3((rnd() - 0.5) * step * 0.9, -step, (rnd() - 0.5) * step * 0.9)))
      return pts
    }
    const main = zig(new THREE.Vector3(0, 40, 0), 9, 9)
    const fork = zig(main[4], 4, 7)
    const geo = mergeGeometries([main, fork].map(p => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p, false, 'catmullrom', 0.1), 40, 0.5, 4, false)))
    geos.push(geo)
    const mat = boltMat.clone()
    const line = new THREE.Mesh(geo, mat)
    line.visible = false
    line.frustumCulled = false
    group.add(line)
    return { s, line, mat, life: 0, max: 0.4, k: 1, seed: 0 }
  })
  let nextBolt = 0
  let flashK = 0
  let flashPos = new THREE.Vector3(0, -999, 0)
  let boltClock = 1.5
  let fillBase = 1

  // ---- motes: grains of haze and ice drifting round the deck, rushing upward while it sinks ----
  const MOTES = light ? 160 : 420
  const mPos = new Float32Array(MOTES * 3)
  const mBase = []
  for (let i = 0; i < MOTES; i++) {
    const a = Math.random() * TAU
    const r = 1.5 + Math.sqrt(Math.random()) * 14
    mBase.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, y: Math.random(), s: Math.random() * 100 })
  }
  const mGeo = new THREE.BufferGeometry()
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
  geos.push(mGeo)
  const moteMat = new THREE.PointsMaterial({ color: '#e8dcc4', size: 0.07, map: glow, transparent: true, opacity: 0.65, depthWrite: false })
  const motes = new THREE.Points(mGeo, moteMat)
  motes.frustumCulled = false
  motes.raycast = () => {}
  group.add(motes)
  const M_Y0 = -6
  const M_H = 22
  let rise = 0

  // ---- the gondola's height, and what it changes ----
  const env = {
    background: C('#c9ac80'),
    fog: new THREE.Fog('#bf9f74', 90, 900),
    exposure: 1.0,
    envIntensity: 0.15,
    bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 },
    fov: 62,
    far: 2600,
  }
  const tmpA = new THREE.Color()
  const tmpB = new THREE.Color()
  let alt = sky[0].z
  let lastAlt = alt
  let lightningNear = 0
  /** The sky's colours at height z (km), interpolated between the table's rows. */
  function skyAt(z) {
    let i = 0
    while (i < sky.length - 2 && z < sky[i + 1].z) i++
    const a = sky[i]
    const b = sky[i + 1]
    const k = clamp((a.z - z) / (a.z - b.z))
    const col = key => tmpA.set(a[key]).lerp(tmpB.set(b[key]), k).clone()
    return { top: col('top'), horizon: col('horizon'), below: col('below'), fog: col('fog'), near: lerp(a.near, b.near, k), far: lerp(a.far, b.far, k), sun: lerp(a.sun, b.sun, k), fill: lerp(a.fill, b.fill, k) }
  }
  function setAltitude(z) {
    alt = z
    const s = skyAt(z)
    skyMat.uniforms.uTop.value.copy(s.top)
    skyMat.uniforms.uHorizon.value.copy(s.horizon)
    skyMat.uniforms.uBelow.value.copy(s.below)
    skyMat.uniforms.uSunK.value = s.sun / 2.4
    env.background.copy(s.horizon)
    env.fog.color.copy(s.fog)
    env.fog.near = s.near
    env.fog.far = s.far
    sun.intensity = s.sun
    fill.color.copy(s.horizon).lerp(C('#ffffff'), 0.15)
    fill.groundColor.copy(s.below)
    fill.intensity = fillBase = s.fill
    // the lamps take over as the sun fades
    const dark = clamp(1 - s.sun / 1.2)
    lamps.forEach(l => (l.intensity = (light ? 6 : 9) * (0.25 + 0.75 * dark)))
    moteMat.color.copy(s.fog).lerp(C('#fff4e0'), 0.45)
    for (const sh of sheets) {
      const y = (sh.layer.z - z) * scale + sh.off * scale
      sh.mesh.position.y = y
      sh.mat.uniforms.uFog.value.copy(s.fog)
      sh.mat.uniforms.uNear.value = s.near
      sh.mat.uniforms.uFar.value = s.far
      // a deck is lit from above: the lower it lies under the sun's light, the darker its face
      const lit = clamp(0.35 + s.sun / 2.4)
      sh.mat.uniforms.uLit.value.set(sh.layer.lit ?? sh.layer.color).multiplyScalar(0.55 + 0.45 * lit)
    }
    towerGroup.position.y = -z * scale
    towerMat.uniforms.uLit.value.copy(s.horizon).lerp(C('#fff4e0'), 0.5).multiplyScalar(0.6 + 0.4 * clamp(s.sun / 2.4))
    towerMat.uniforms.uShadow.value.copy(s.below).lerp(s.horizon, 0.55)
    towerMat.uniforms.uFog.value.copy(s.fog)
    towerMat.uniforms.uNear.value = s.near
    towerMat.uniforms.uFar.value = s.far
    // lightning is likelier the nearer its deck
    const L = layers.find(l => l.lightning)
    lightningNear = L ? clamp(1 - Math.abs(L.z - z) / 90) : 0
  }

  /** A lightning flash somewhere in the deck that has lightning (or `at`: [x, z] in metres). Returns its
   *  place in the scene. */
  function flash(at = null, strength = 1) {
    const L = layers.find(l => l.lightning)
    if (!L) return null
    const b = bolts[nextBolt]
    nextBolt = (nextBolt + 1) % bolts.length
    const a = Math.random() * TAU
    const r = 70 + Math.random() * 280
    const x = at ? at[0] : Math.cos(a) * r
    const z = at ? at[1] : Math.sin(a) * r
    const y = (L.z - alt) * scale - (L.thick ?? 4) * scale * 0.15
    b.s.position.set(x, y, z)
    b.s.scale.setScalar(90 + Math.random() * 90)
    b.life = b.max = 0.35 + Math.random() * 0.3
    b.k = strength
    b.seed = Math.random() * 10
    b.s.visible = true
    b.line.position.copy(b.s.position)
    b.line.rotation.y = Math.random() * TAU
    b.line.visible = true
    flashPos = b.s.position.clone()
    flashK = Math.max(flashK, strength)
    api.onFlash?.(Math.hypot(x, y, z))
    return b.s.position
  }

  const camPos = new THREE.Vector3()
  const api = {
    group,
    mats,
    glow,
    noise,
    solids: ringWall(radius),
    env,
    cameraBounds: { minX: -radius + 0.3, maxX: radius - 0.3, minY: 0.4, maxY: 13, minZ: -radius + 0.3, maxZ: radius - 0.3 },
    setAltitude,
    get altitude() {
      return alt
    },
    /** scene height (m) of a height in the atmosphere (km), as the gondola now hangs */
    yOf: z => (z - alt) * scale,
    flash,
    onFlash: null,
    update(dt, t) {
      // the sheets drift with the wind, and are drawn farthest first
      if (camera) camera.getWorldPosition(camPos)
      const order = sheets.map(sh => ({ sh, d: Math.abs(sh.mesh.position.y - camPos.y) })).sort((p, q) => q.d - p.d)
      order.forEach(({ sh }, i) => {
        sh.mesh.renderOrder = -15 + i * 0.01
        sh.mat.uniforms.uTime.value = t
      })
      // lightning
      boltClock -= dt
      if (lightningNear > 0.05 && boltClock < 0) {
        boltClock = (2.2 + Math.random() * 4) / (0.4 + lightningNear)
        flash(null, 0.6 + 0.6 * lightningNear)
      }
      flashK = Math.max(0, flashK - dt * 3.2)
      for (const b of bolts) {
        if (b.life <= 0) {
          b.s.visible = false
          b.line.visible = false
          continue
        }
        b.life -= dt
        const u = 1 - b.life / b.max
        // a flash flickers: two or three pulses
        const pulse = Math.max(0, Math.sin(u * Math.PI)) * (0.55 + 0.45 * Math.abs(Math.sin(u * 23 + b.seed)))
        b.s.material.opacity = pulse * b.k
        b.mat.opacity = pulse > 0.5 ? b.k : 0
      }
      // a flash nearby lights the gondola for a moment
      fill.intensity = fillBase + flashK * lightningNear * 2.2
      for (const sh of sheets) {
        sh.mat.uniforms.uFlash.value = sh.layer.lightning ? flashK : flashK * 0.25
        sh.mat.uniforms.uFlashPos.value.copy(flashPos)
      }
      skyMat.uniforms.uFlash.value = flashK * lightningNear
      // the motes: up past the deck as fast as the gondola sinks (sped up), a slow swirl besides
      const sink = dt > 0 ? (lastAlt - alt) / dt : 0
      lastAlt = alt
      rise = rise * 0.9 + clamp(sink * scale, -40, 40) * 0.1
      for (let i = 0; i < MOTES; i++) {
        const m = mBase[i]
        m.y = (((m.y + (rise * dt + 0.05 * dt) / M_H) % 1) + 1) % 1
        mPos[i * 3] = m.x + Math.sin(t * 0.2 + m.s) * 0.4
        mPos[i * 3 + 1] = M_Y0 + m.y * M_H
        mPos[i * 3 + 2] = m.z + Math.cos(t * 0.17 + m.s) * 0.4
      }
      mGeo.attributes.position.needsUpdate = true
      moteMat.size = 0.07 + Math.min(0.06, Math.abs(rise) * 0.002)
    },
    dispose() {
      textures.forEach(tx => tx.dispose())
      geos.forEach(g => g.dispose())
    },
  }
  setAltitude(alt)
  return api
}
