// A stage for picture rooms (docs/knowledge/picture-rooms.md): open air on a grassy hilltop. A sky dome
// with the sun (a bright disc with short rays, as the boards draw it) whose colours follow the sun: a deep
// blue day, a warm glow round a low sun, stars at dusk and at night. Grass underfoot that falls away past
// the edge, distant hills in the haze, a few clouds, pollen in the air. Walking inside a circle of `radius`;
// the haze hides where the ground ends.
//
// The scene moves the sun: setSun(dir, { cloud }) with `dir` a unit vector toward the sun (below the
// horizon at night) and `cloud` how much of it a cloud hides (0 to 1). The sky, the haze, the light and the
// shadows follow. Surfaces are mid-toned: pale ones bloom to white under a bright sky.
import * as THREE from 'three'
import { canvasTex, clamp, smooth } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'

const C = c => new THREE.Color(c)
// the sky's colours: night, a low sun, the day
const ZENITH = { night: C('#040816'), dusk: C('#121a46'), day: C('#21468c') }
const HORIZON = { night: C('#0a1028'), dusk: C('#4a4f80'), day: C('#5c83bb') }
const GLOW = { dusk: C('#ff7a2e'), day: C('#ffcf80') }
const SUNLIGHT = { low: C('#ffb26a'), high: C('#fff1d8') }

/** Where the ground is at a distance r from the middle: flat on the hilltop, falling away beyond. */
export function hillHeight(r, radius) {
  const edge = radius + 1.5
  return r <= edge ? 0 : -0.065 * Math.pow(r - edge, 1.55)
}

/** A soft cloud on a canvas (white, see-through at its edges), shared by the sky's clouds and a scene's. */
export function cloudTexture(seed = 3) {
  return canvasTex(256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    let s = seed
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 16; i++) {
      const x = w * (0.18 + 0.64 * rnd())
      const y = h * (0.42 + 0.22 * rnd())
      const r = h * (0.16 + 0.2 * rnd())
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, 'rgba(255,255,255,0.95)')
      grd.addColorStop(0.55, 'rgba(255,255,255,0.7)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(x, y, r, 0, Math.PI * 2)
      g.fill()
    }
  })
}

export function meadowStage({ radius = 12, light = false } = {}) {
  const group = new THREE.Group()
  const disposers = []

  // ---- the sky ----
  const skyU = {
    uSunDir: { value: new THREE.Vector3(0, 0.5, -1).normalize() },
    uZenith: { value: ZENITH.day.clone() },
    uHorizon: { value: HORIZON.day.clone() },
    uGlow: { value: GLOW.day.clone() },
    uSun: { value: 1 },
    uNight: { value: 0 },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(90, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGlow;
        uniform float uSun; uniform float uNight;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 c = h > 0.0 ? mix(uHorizon, uZenith, pow(h, 0.5)) : mix(uHorizon, uHorizon * 0.55, clamp(-h * 4.0, 0.0, 1.0));
          float s = dot(d, uSunDir);
          float up = clamp(uSunDir.y * 4.0 + 0.6, 0.0, 1.0);
          // the glow round the sun, and the horizon warm on the sun's side
          c += uGlow * up * (pow(max(s, 0.0), 10.0) * 0.32 + pow(max(s, 0.0), 120.0) * 0.5);
          c += uGlow * up * 0.3 * pow(max(s, 0.0), 3.0) * (1.0 - clamp(abs(h) * 3.0, 0.0, 1.0));
          // the disc and its short rays (the boards' sun), dimmed by a cloud
          float a = acos(clamp(s, -1.0, 1.0));
          float disc = 1.0 - smoothstep(0.046, 0.052, a);
          vec3 t1 = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
          vec3 t2 = cross(t1, uSunDir);
          float ang = atan(dot(d, t2), dot(d, t1));
          float ray = pow(abs(cos(ang * 6.0)), 40.0) * smoothstep(0.062, 0.07, a) * (1.0 - smoothstep(0.095, 0.11, a));
          vec3 sunC = vec3(2.4, 1.85, 1.05);
          c = mix(c, sunC, disc * uSun * up);
          c += sunC * 0.45 * ray * uSun * up;
          // stars, when the sky is dark enough
          if (uNight > 0.01 && h > 0.0) {
            vec3 q = floor(d * 160.0);
            float n = hash(q);
            float star = step(0.9965, n) * (0.5 + 0.5 * hash(q + 7.0));
            c += vec3(star) * uNight * smoothstep(0.0, 0.25, h) * 1.4;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- the ground: grass, flat on the hilltop, falling away past the edge ----
  const grassTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#4a7536'
    g.fillRect(0, 0, w, w)
    let s = 11
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 1400; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(40,78,32,${0.25 + rnd() * 0.3})` : `rgba(112,150,70,${0.18 + rnd() * 0.25})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * w, 3 + rnd() * 16, 2 + rnd() * 8, rnd() * Math.PI, 0, Math.PI * 2)
      g.fill()
    }
    g.lineWidth = 1.2
    for (let i = 0; i < 2600; i++) {
      const x = rnd() * w
      const y = rnd() * w
      g.strokeStyle = rnd() < 0.5 ? 'rgba(130,170,80,0.45)' : 'rgba(30,62,26,0.45)'
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (rnd() - 0.5) * 3, y - 4 - rnd() * 5)
      g.stroke()
    }
  })
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping
  grassTex.repeat.set(22, 22)
  disposers.push(() => grassTex.dispose())
  const groundGeo = new THREE.RingGeometry(0.01, 85, 96, 60)
  const gp = groundGeo.attributes.position
  for (let i = 0; i < gp.count; i++) {
    const r = Math.hypot(gp.getX(i), gp.getY(i))
    gp.setZ(i, hillHeight(r, radius))
  }
  groundGeo.rotateX(-Math.PI / 2)
  groundGeo.computeVertexNormals()
  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, color: '#d6e6c8' }))
  ground.receiveShadow = true
  group.add(ground)

  // tufts of grass and a few flowers, scattered (one instanced mesh each)
  const tuft = new THREE.BufferGeometry()
  {
    const pts = []
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI
      const lean = 0.05 * (k - 1)
      const cx = Math.cos(a) * 0.05
      const cz = Math.sin(a) * 0.05
      pts.push(-cx, 0, -cz, cx, 0, cz, lean, 1, lean * 0.5)
    }
    tuft.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    tuft.computeVertexNormals()
  }
  const tufts = new THREE.InstancedMesh(tuft, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, side: THREE.DoubleSide }), light ? 900 : 2600)
  const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.045, 0), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 }), light ? 70 : 220)
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    let s = 29
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < tufts.count; i++) {
      const a = rnd() * Math.PI * 2
      const r = Math.sqrt(rnd()) * (radius + 9)
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      o.position.set(x, hillHeight(r, radius), z)
      o.rotation.set(0, rnd() * Math.PI, 0)
      const k = 0.07 + rnd() * 0.13
      o.scale.set(0.5 + rnd() * 0.6, k, 0.5 + rnd() * 0.6)
      o.updateMatrix()
      tufts.setMatrixAt(i, o.matrix)
      tufts.setColorAt(i, col.setHSL(0.25 + rnd() * 0.05, 0.42, 0.2 + rnd() * 0.1))
    }
    const petals = ['#f4d35e', '#f7f3e8', '#c9a7ff', '#ff9fb2']
    for (let i = 0; i < flowers.count; i++) {
      const a = rnd() * Math.PI * 2
      const r = 1.5 + Math.sqrt(rnd()) * (radius + 6)
      o.position.set(Math.cos(a) * r, hillHeight(r, radius) + 0.12 + rnd() * 0.08, Math.sin(a) * r)
      o.rotation.set(rnd(), rnd(), rnd())
      o.scale.setScalar(0.7 + rnd() * 0.6)
      o.updateMatrix()
      flowers.setMatrixAt(i, o.matrix)
      flowers.setColorAt(i, col.set(petals[i % petals.length]).multiplyScalar(0.8))
    }
  }
  group.add(tufts, flowers)

  // hills far off in the haze
  const hillMat = new THREE.MeshStandardMaterial({ color: '#3f6b3a', roughness: 1 })
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.13
    const r = 55 + (i % 4) * 6
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), hillMat)
    m.scale.set(16 + (i % 5) * 4, 15 + (i % 3) * 4, 14 + (i % 4) * 3)
    m.position.set(Math.cos(a) * r, hillHeight(r, radius) - 8 + (i % 2) * 3, Math.sin(a) * r)
    m.rotation.y = a
    group.add(m)
  }

  // a few clouds across the sky (planes facing the middle, tinted by the sky)
  const cloudTex = cloudTexture(5)
  disposers.push(() => cloudTex.dispose())
  const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: '#ffffff', opacity: 0.85 })
  const clouds = []
  for (const [a, el, d, w] of [[0.6, 0.2, 70, 26], [2.2, 0.28, 72, 22], [3.4, 0.16, 74, 30], [4.4, 0.32, 70, 20], [5.5, 0.22, 72, 24]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.45), cloudMat)
    m.position.set(Math.cos(a) * Math.cos(el) * d, Math.sin(el) * d, Math.sin(a) * Math.cos(el) * d)
    m.lookAt(0, m.position.y * 0.6, 0)
    m.renderOrder = -5
    group.add(m)
    clouds.push({ m, a, el, d, speed: 0.004 + (clouds.length % 3) * 0.002 })
  }

  // pollen and dust in the evening air
  const specks = motes({ count: 260, radius: radius + 4, y0: 0.2, y1: 6, color: '#fff3c4', size: 0.045, opacity: 0.55, speed: 0.08, light })
  group.add(specks.group)

  // ---- light ----
  const hemi = new THREE.HemisphereLight('#b9cdf0', '#3b5428', 1.0)
  const sun = new THREE.DirectionalLight('#fff1d8', 2.0)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -(radius + 4)
  sun.shadow.camera.right = sun.shadow.camera.top = radius + 4
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 90
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  group.add(hemi, sun, sun.target)

  const background = HORIZON.day.clone()
  const fog = new THREE.Fog(HORIZON.day.clone(), 24, 92)
  const tmp = new THREE.Color()
  const look = { day: 1, night: 0, dusk: 0 }

  /** The sun's direction (unit, toward it) and how much a cloud hides it (0 to 1): the sky, the haze and
   *  the light follow. */
  function setSun(dir, { cloud = 0 } = {}) {
    const e = dir.y
    const day = smooth(0.0, 0.62, e)
    const night = 1 - smooth(-0.2, 0.03, e)
    const dusk = (1 - smooth(0.06, 0.5, e)) * smooth(-0.22, 0.02, e)
    look.day = day
    look.night = night
    look.dusk = dusk
    skyU.uSunDir.value.copy(dir)
    const z = skyU.uZenith.value.copy(ZENITH.night).lerp(ZENITH.dusk, 1 - night).lerp(ZENITH.day, day)
    const hz = skyU.uHorizon.value.copy(HORIZON.night).lerp(HORIZON.dusk, 1 - night).lerp(HORIZON.day, day)
    skyU.uGlow.value.copy(GLOW.day).lerp(GLOW.dusk, clamp(dusk * 1.6)).multiplyScalar(1 - night)
    skyU.uSun.value = 1 - cloud * 0.85
    skyU.uNight.value = clamp(night * 1.2 + dusk * 0.25)
    background.copy(hz)
    fog.color.copy(hz).lerp(z, 0.15)
    // the sun's light: warm and weak near the horizon, none below it, dimmed by a cloud
    const up = smooth(-0.02, 0.2, e)
    sun.intensity = 2.4 * up * (0.55 + 0.45 * day) * (1 - cloud * 0.75)
    sun.color.copy(SUNLIGHT.low).lerp(SUNLIGHT.high, smooth(0.08, 0.5, e))
    sun.position.copy(dir).multiplyScalar(40)
    sun.target.position.set(0, 0, 0)
    hemi.intensity = 0.12 + 0.2 * (1 - night) + 0.85 * day + 0.25 * dusk
    hemi.color.copy(hz).lerp(z, 0.3).lerp(tmp.set('#ffffff'), 0.35 * day)
    hemi.groundColor.set('#3b5428').multiplyScalar(0.35 + 0.65 * Math.max(day, 0.2))
    cloudMat.color.set('#ffffff').lerp(tmp.set('#ffa47a'), clamp(dusk * 1.4) * 0.65).multiplyScalar((0.25 + 0.75 * (1 - night)) * (0.6 + 0.4 * day))
    cloudMat.opacity = 0.85 - 0.45 * night
    // the grass darker at night
    hillMat.color.set('#3f6b3a').multiplyScalar(0.35 + 0.65 * (1 - night))
    ground.material.color.set('#d6e6c8').multiplyScalar(0.45 + 0.55 * (1 - night))
    tufts.material.color.set('#ffffff').multiplyScalar(0.45 + 0.55 * (1 - night))
  }
  setSun(skyU.uSunDir.value)

  return {
    group,
    solids: ringWall(radius),
    look,
    // the sky's clouds' material (tinted with the sky): a scene's own cloud uses it too
    cloudMaterial: cloudMat,
    env: {
      background,
      fog,
      exposure: 1.0,
      envIntensity: 0.25,
      bloom: { strength: 0.5, radius: 0.5, threshold: 0.86 },
      fov: 62,
      shadows: true,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    setSun,
    sunLight: sun,
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
