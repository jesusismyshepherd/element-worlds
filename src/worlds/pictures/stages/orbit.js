// A stage for picture rooms (docs/knowledge/picture-rooms.md): a docking platform in low Earth orbit, about
// 550 km up, with the real Earth under it (unlike space.js, whose deck floats far out with model planets).
// The Earth is a sphere of 600 m whose centre sits 652 m below the deck, so the horizon dips 23 degrees below
// the level, exactly as at 550 km (6371 km radius, 6921 km from its centre). Its shader paints oceans,
// continents, ice, clouds, city lights on the night side and a thin blue limb. The Sun goes round in a
// vertical plane (`setSun(phase)`, a turn in `PERIOD` seconds, sped up from the real 95 minutes): sunrise over
// the limb, day, sunset, night. The platform itself keeps its own lamps, so a night is dim, never black.
// Satellites cross the sky as moving stars, a row of sisters strung along one orbit.
// Exports `orbitStage({ light, pixelRatio })` -> { group, sunDir, solids, env, cameraBounds, earthMaterial(),
// setSun(phase), phase, update(t, dt), dispose }.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { canvasTex } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'
import { glowTexture } from './space.js'

const TAU = Math.PI * 2
export const PERIOD = 170 // seconds for one turn of the Sun (95 minutes in life)
export const EARTH = { r: 600, drop: 652 } // metres in the scene: the real ratio 6371 : 6921

const VERT = /* glsl */ `
  varying vec3 vDir; varying vec3 vN; varying vec3 vView;
  void main() {
    vDir = normalize(position);
    vN = normalize(mat3(modelMatrix) * position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`

const FRAG = /* glsl */ `
  uniform vec3 uSun; uniform float uTime;
  uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uGreen; uniform vec3 uDesert; uniform vec3 uHigh;
  varying vec3 vDir; varying vec3 vN; varying vec3 vView;
  float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float a = 0.5; float s = 0.0;
    for (int i = 0; i < OCT; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
    return s;
  }
  void main() {
    vec3 d = normalize(vDir);
    vec3 n3 = normalize(vN);
    float n = fbm(d * 2.4 + vec3(3.0)) * 1.15;
    float land = smoothstep(0.55, 0.58, n);
    float lat = abs(d.y);
    vec3 ocean = mix(uDeep, uShallow, smoothstep(0.38, 0.55, n));
    float dry = fbm(d * 5.0 + 7.0);
    vec3 terrain = mix(uGreen, uDesert, smoothstep(0.5, 0.7, dry) * smoothstep(0.35, 0.8, 1.0 - lat));
    terrain = mix(terrain, uHigh, smoothstep(0.7, 0.9, n));
    vec3 surf = mix(ocean, terrain, land);
    float ice = smoothstep(0.82, 0.9, lat + 0.07 * (n - 0.5));
    surf = mix(surf, vec3(0.82, 0.88, 0.95), ice);
    float cl = smoothstep(0.5, 0.78, fbm(d * 4.2 + vec3(uTime * 0.012, 0.0, uTime * 0.008)));
    float nl = dot(n3, uSun);
    float day = smoothstep(-0.1, 0.2, nl);
    float lum = max(nl, 0.0);
    vec3 col = surf * (0.045 + 1.15 * lum);
    col = mix(col, vec3(0.05 + lum * 1.05), cl * 0.82);
    vec3 refl = reflect(-uSun, n3);
    float spec = pow(max(dot(refl, normalize(vView)), 0.0), 70.0) * (1.0 - land) * (1.0 - cl);
    col += vec3(1.0, 0.95, 0.85) * spec * 0.7 * day;
    // the night side: cities where there is land, in clusters, hidden by cloud
    float clusters = smoothstep(0.5, 0.68, fbm(d * 9.0 + 11.0));
    float dots = smoothstep(0.7, 0.86, vn(d * 210.0) * 0.6 + vn(d * 470.0) * 0.4);
    float city = land * (1.0 - ice) * clusters * dots * (1.0 - day) * (1.0 - cl * 0.75);
    col += vec3(1.0, 0.72, 0.38) * city * 1.7;
    float fr = pow(1.0 - max(dot(n3, normalize(vView)), 0.0), 3.0);
    col += vec3(0.25, 0.5, 1.0) * fr * (0.08 + 0.9 * day) * 0.9;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

const HALO_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vDir; varying vec3 vN; varying vec3 vView;
  void main() {
    float ndv = max(dot(normalize(vN), normalize(vView)), 0.0);
    float a = smoothstep(0.0, 0.3, ndv) * pow(1.0 - ndv, 2.6);
    float lit = 0.12 + 0.88 * smoothstep(-0.3, 0.5, dot(normalize(vN), uSun));
    gl_FragColor = vec4(vec3(0.22, 0.5, 1.0) * lit, a * 0.75);
  }`

export function orbitStage({ radius = 11, light = false, pixelRatio = 1 } = {}) {
  const group = new THREE.Group()
  const textures = []
  const sunDir = new THREE.Vector3(0, 1, 0)
  const H = new THREE.Vector2(-0.45, -0.89).normalize() // where the Sun's turn leans: it rises ahead, to the left
  let phase = 1.05

  // the sky
  const sky = nightSky({ radius: 1500, stars: light ? 900 : 2200, top: '#02030b', mid: '#04071a', horizon: '#060a22', pixelRatio })
  const below = nightSky({ radius: 1480, stars: light ? 400 : 1200, pixelRatio })
  const dome = below.children[0]
  below.remove(dome)
  dome.geometry.dispose()
  dome.material.dispose()
  below.rotation.x = Math.PI
  group.add(sky, below)

  // the Earth: one set of uniforms shared by the big planet and any small globe a scene makes
  const uniforms = {
    uSun: { value: sunDir },
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color('#07265a') },
    uShallow: { value: new THREE.Color('#1c63ae') },
    uGreen: { value: new THREE.Color('#3d7a38') },
    uDesert: { value: new THREE.Color('#a58a52') },
    uHigh: { value: new THREE.Color('#d7d9d2') },
  }
  const defines = { OCT: light ? 3 : 5 }
  const earthMaterial = () => new THREE.ShaderMaterial({ uniforms, defines, vertexShader: VERT, fragmentShader: FRAG })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH.r, light ? 96 : 192, light ? 48 : 96), earthMaterial())
  earth.position.y = -EARTH.drop
  earth.rotation.set(0.5, 0.9, 0.35)
  earth.frustumCulled = false
  group.add(earth)
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH.r * 1.028, 128, 64),
    new THREE.ShaderMaterial({ uniforms: { uSun: uniforms.uSun }, vertexShader: VERT, fragmentShader: HALO_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  halo.position.y = -EARTH.drop
  halo.frustumCulled = false
  group.add(halo)

  // the Sun, and nebulae far off
  const glow = glowTexture(128)
  textures.push(glow)
  const sprite = (dir, color, size, opacity, dist = 1300) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.position.copy(new THREE.Vector3(...dir).normalize().multiplyScalar(dist))
    s.scale.setScalar(size)
    s.renderOrder = -8
    group.add(s)
    return s
  }
  sprite([-0.7, 0.45, -0.55], '#3c6a2a', 1500, 0.22)
  sprite([0.8, 0.2, -0.6], '#4a2a66', 1400, 0.2)
  const sunDisc = sprite([0, 1, 0], new THREE.Color('#fff2d6').multiplyScalar(3), 80, 1, 1250)
  const sunHalo = sprite([0, 1, 0], '#ffd9a0', 420, 0.3, 1250)
  sunDisc.renderOrder = sunHalo.renderOrder = 5
  sunDisc.material.depthTest = sunHalo.material.depthTest = true

  // the platform: a round deck of plates, a glowing rim, a field round the edge, lamps on posts
  // the floor is glass in a steel grid, so the Earth shows through it, under your feet
  const N = light ? 512 : 1024
  const floorTex = canvasTex(N, N, (g, w) => {
    g.clearRect(0, 0, w, w)
    const cells = 14
    const c = w / cells
    for (let j = 0; j < cells; j++) {
      for (let i = 0; i < cells; i++) {
        g.fillStyle = 'rgba(120,160,230,0.10)'
        g.fillRect(i * c, j * c, c, c)
      }
    }
    // a few scuffs on the glass
    let s = 7
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    g.strokeStyle = 'rgba(200,225,255,0.12)'
    g.lineWidth = 2
    for (let i = 0; i < 40; i++) {
      const x = rnd() * w
      const y = rnd() * w
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (rnd() - 0.5) * 120, y + (rnd() - 0.5) * 120)
      g.stroke()
    }
    // the steel beams between the panes, with rivets
    g.strokeStyle = '#46527c'
    g.lineWidth = 9
    for (let i = 0; i <= cells; i++) {
      g.beginPath()
      g.moveTo(i * c, 0)
      g.lineTo(i * c, w)
      g.moveTo(0, i * c)
      g.lineTo(w, i * c)
      g.stroke()
    }
    g.strokeStyle = '#7f95d0'
    g.lineWidth = 2
    for (let i = 0; i <= cells; i++) {
      g.beginPath()
      g.moveTo(i * c - 3, 0)
      g.lineTo(i * c - 3, w)
      g.moveTo(0, i * c - 3)
      g.lineTo(w, i * c - 3)
      g.stroke()
    }
    g.strokeStyle = 'rgba(127,220,255,0.7)'
    g.lineWidth = w / 220
    g.setLineDash([w / 50, w / 80])
    g.beginPath()
    g.arc(w / 2, w / 2, w * 0.4, 0, TAU)
    g.stroke()
  })
  textures.push(floorTex)
  const metal = new THREE.MeshStandardMaterial({ color: '#2a3150', roughness: 0.55, metalness: 0.35 })
  const top = new THREE.MeshStandardMaterial({ map: floorTex, transparent: true, depthWrite: false, roughness: 0.3, metalness: 0.2 })
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.985, 0.32, 128), [metal, top, metal])
  deck.position.y = -0.16
  group.add(deck)
  const rimMat = new THREE.MeshStandardMaterial({ color: '#7fdcff', emissive: '#7fdcff', emissiveIntensity: 1.5, roughness: 0.4 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.06, 8, 180), rimMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.03
  group.add(ring)
  const fieldMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#7fdcff') } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
      void main() {
        float up = 1.0 - vUv.y;
        float wave = 0.75 + 0.25 * sin(vUv.x * 60.0 + uTime * 1.3 + vUv.y * 4.0);
        gl_FragColor = vec4(uColor, pow(up, 2.2) * 0.3 * wave + pow(up, 6.0) * 0.22);
      }`,
  })
  const field = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.02, radius + 0.02, 1.1, 180, 1, true), fieldMat)
  field.position.y = 0.55
  group.add(field)
  // lamps on posts round the rim
  const postMat = new THREE.MeshStandardMaterial({ color: '#4a5478', roughness: 0.5, metalness: 0.4 })
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff3d8', emissive: '#ffe2a8', emissiveIntensity: 1.6, roughness: 0.4 })
  const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.07, 1.5, 8), postMat, 10)
  const lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 12, 8), lampMat, 10)
  const o = new THREE.Object3D()
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU + 0.15
    o.position.set(Math.cos(a) * (radius - 0.5), 0.75, Math.sin(a) * (radius - 0.5))
    o.updateMatrix()
    posts.setMatrixAt(i, o.matrix)
    o.position.y = 1.55
    o.updateMatrix()
    lamps.setMatrixAt(i, o.matrix)
  }
  group.add(posts, lamps)

  // satellites crossing the sky as moving stars, and a row of sisters strung along one orbit
  const sats = []
  const tangent = (axis, ang) => {
    const u = new THREE.Vector3().crossVectors(axis, Math.abs(axis.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize()
    const v = new THREE.Vector3().crossVectors(axis, u)
    return u.multiplyScalar(Math.cos(ang)).add(v.multiplyScalar(Math.sin(ang)))
  }
  const addOrbit = (count, gap, speed, seed) => {
    const axis = new THREE.Vector3(Math.sin(seed * 7.1), Math.cos(seed * 3.3) * 0.6 - 0.3, Math.sin(seed * 5.7)).normalize()
    for (let i = 0; i < count; i++) sats.push({ axis, ang: seed * 9 + i * gap, speed })
  }
  addOrbit(9, 0.028, 0.012, 1.3) // the sisters
  for (let k = 0; k < 9; k++) addOrbit(1, 0, 0.006 + (k % 4) * 0.003, 2 + k * 1.7)
  const satGeo = new THREE.BufferGeometry()
  const satPos = new Float32Array(sats.length * 3)
  satGeo.setAttribute('position', new THREE.BufferAttribute(satPos, 3))
  const satPts = new THREE.Points(satGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 3.2, map: glow, transparent: true, opacity: 0.95, depthWrite: false, sizeAttenuation: false }))
  satPts.frustumCulled = false
  group.add(satPts)

  // light: the Sun while it shines on the platform, the platform's own lamps, a dim blue fill
  const sunLight = new THREE.DirectionalLight('#fff3e2', 2.4)
  group.add(sunLight, sunLight.target)
  const lampLight = new THREE.DirectionalLight('#b9cdff', 0.7)
  lampLight.position.set(3, 12, 14)
  group.add(lampLight)
  group.add(new THREE.HemisphereLight('#9fb4ff', '#1b2142', 0.75))

  function setSun(p) {
    phase = p
    const c = Math.cos(p)
    sunDir.set(H.x * c, Math.sin(p), H.y * c).normalize()
    sunLight.position.copy(sunDir).multiplyScalar(40)
    // the Sun shows over the Earth's limb at 23 degrees below the level (sin = -0.39)
    const lit = THREE.MathUtils.smoothstep(sunDir.y, -0.43, -0.34)
    sunLight.intensity = 2.6 * lit
    sunDisc.position.copy(sunDir).multiplyScalar(1250)
    sunHalo.position.copy(sunDisc.position)
    sunDisc.material.opacity = 1
    sunHalo.material.opacity = 0.3
  }
  setSun(phase)

  return {
    group,
    sunDir,
    solids: ringWall(radius),
    env: {
      background: new THREE.Color('#02030b'),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
      fov: 62,
      far: 4000,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    earthMaterial,
    setSun,
    get phase() {
      return phase
    },
    /** `auto`: the Sun goes round by itself (false for a probe holding the light still). */
    auto: true,
    update(t, dt = 0.016) {
      if (this.auto) setSun((phase + (dt * TAU) / PERIOD) % TAU)
      uniforms.uTime.value = t
      sky.userData.update?.(t)
      below.userData.update?.(t)
      fieldMat.uniforms.uTime.value = t
      sats.forEach((s, i) => {
        const p = tangent(s.axis, s.ang + t * s.speed).multiplyScalar(1100)
        satPos.set([p.x, p.y, p.z], i * 3)
      })
      satGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      textures.forEach(tx => tx.dispose())
      earth.geometry.dispose()
      earth.material.dispose()
      halo.geometry.dispose()
      halo.material.dispose()
    },
  }
}
