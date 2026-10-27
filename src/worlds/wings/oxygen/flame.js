// Fire for the fire chamber: flames drawn by a shader on upright cards that turn to face the camera
// (noise rising through a teardrop, white-yellow at the core, orange, then red at the edge; a gas
// flame is blue), glowing embers, and a campfire built from charred logs in a ring of stones, with
// sparks and smoke. Every part follows one `level` (0 out, 1 burning).
import * as THREE from 'three'
import { NOISE_GLSL, canvasTex, makeNoise, Particles, softDot, random, clamp, damp } from './kit.js'

const FLAME_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // turn the card round the vertical to face the camera, keeping its own scale
    vec3 centre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 toCam = cameraPosition - centre;
    toCam.y = 0.0;
    toCam = normalize(toCam + vec3(1e-4, 0.0, 0.0));
    vec3 right = vec3(toCam.z, 0.0, -toCam.x);
    float sx = length(modelMatrix[0].xyz);
    float sy = length(modelMatrix[1].xyz);
    vec3 world = centre + right * position.x * sx + vec3(0.0, position.y * sy, 0.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  }`

const FLAME_FRAG = /* glsl */ `
  ${NOISE_GLSL}
  uniform float uTime;
  uniform float uPower;
  uniform float uSeed;
  uniform float uTurb;
  uniform float uGain;
  uniform vec3 uCore;
  uniform vec3 uMid;
  uniform vec3 uEdge;
  uniform vec3 uBase;
  varying vec2 vUv;
  void main() {
    if (uPower < 0.01) discard;
    vec2 p = vec2(vUv.x * 2.0 - 1.0, vUv.y);
    float t = uTime * 1.5 + uSeed * 17.0;
    float n1 = snoise(vec3(p.x * 2.0, p.y * 2.6 - t * 1.7, uSeed * 3.1 + t * 0.25));
    float n2 = snoise(vec3(p.x * 4.6, p.y * 5.5 - t * 3.1, uSeed * 1.7 + t * 0.45));
    float n = (n1 * 0.62 + n2 * 0.38) * uTurb;
    float y = p.y;
    float sway = snoise(vec2(y * 1.6 - t * 1.1, uSeed * 5.0)) * 0.22 * y * uTurb;
    float width = 0.62 * pow(max(0.0, 1.0 - y), 0.75) * (0.75 + 0.25 * uPower);
    float d = abs(p.x - sway) / max(width, 1e-3);
    float body = 1.0 - smoothstep(0.45 + n * 0.3, 1.0 + n * 0.25, d);
    body *= smoothstep(0.0, 0.07, y);
    float topEdge = 1.0 - smoothstep(0.32 + n * 0.22, 0.98, y / max(uPower, 0.05));
    float k = clamp(body * topEdge, 0.0, 1.0);
    // hottest low in the middle, cooler toward the edges and the tips
    float temp = k * (1.05 - y * 0.8);
    vec3 col = mix(uEdge, uMid, smoothstep(0.12, 0.5, temp));
    col = mix(col, uCore, smoothstep(0.7, 1.0, temp));
    // a blue root where the gas meets the air (candles, gas flames)
    col = mix(col, uBase, (1.0 - smoothstep(0.0, 0.2, y)) * smoothstep(0.3, 0.8, k) * 0.85);
    float alpha = smoothstep(0.03, 0.55, k) * (0.3 + 0.7 * (1.0 - y));
    gl_FragColor = vec4(col * uGain, alpha * smoothstep(0.0, 0.25, uPower));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`

export const FIRE = { core: '#ffe0a0', mid: '#ff8c26', edge: '#b8280a', base: '#ff7a20' }
export const CANDLE = { core: '#fff6d6', mid: '#ffc35a', edge: '#ff6a1c', base: '#3d6bff' }
export const GAS = { core: '#cfe6ff', mid: '#3f7bff', edge: '#2a2fbf', base: '#7fd4ff' }

/** One flame card: base at the origin, `w` wide and `h` tall. set(power 0..1). */
export function flameCard({ w = 0.6, h = 1.2, colors = FIRE, seed = 0, turb = 1, gain = 1.4 } = {}) {
  const geo = new THREE.PlaneGeometry(1, 1, 1, 1)
  geo.translate(0, 0.5, 0)
  const mat = new THREE.ShaderMaterial({
    vertexShader: FLAME_VERT,
    fragmentShader: FLAME_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uPower: { value: 1 }, uSeed: { value: seed }, uTurb: { value: turb }, uGain: { value: gain },
      uCore: { value: new THREE.Color(colors.core) }, uMid: { value: new THREE.Color(colors.mid) },
      uEdge: { value: new THREE.Color(colors.edge) }, uBase: { value: new THREE.Color(colors.base) },
    },
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.scale.set(w, h, 1)
  mesh.frustumCulled = false
  mesh.renderOrder = 8
  return {
    mesh,
    set(power) {
      mat.uniforms.uPower.value = power
      mesh.visible = power > 0.01
    },
    update(t) {
      mat.uniforms.uTime.value = t
    },
  }
}

/** A flicker in 0..1 from a few incommensurate sines (cheap, smooth, never repeating visibly). */
export const flicker = (t, s = 0) => 0.5 + 0.22 * Math.sin(t * 7.1 + s) + 0.16 * Math.sin(t * 13.3 + s * 2.1) + 0.12 * Math.sin(t * 23.7 + s * 0.7)

/** Bark with charred, glowing cracks toward one end (u along the log). */
function logTextures(size) {
  const noise = makeNoise(9)
  const h = size / 2
  const bark = canvasTex(size, (g, s, hh) => {
    const img = g.createImageData(s, hh)
    for (let y = 0; y < hh; y++) {
      for (let x = 0; x < s; x++) {
        const u = x / s
        const n = noise.fbm2(x / 6, y / 40, 4)
        const crack = Math.pow(1 - Math.abs(noise.n2(x / 3, y / 60) * 2 - 1), 8)
        let k = 0.55 + n * 0.5 - crack * 0.4
        let r = 92 * k
        let gg = 64 * k
        let b = 44 * k
        // charred toward the burning end
        const char = THREE.MathUtils.smoothstep(u, 0.35, 0.75)
        r = r * (1 - char) + 26 * char * (0.7 + n * 0.6)
        gg = gg * (1 - char) + 22 * char * (0.7 + n * 0.6)
        b = b * (1 - char) + 20 * char * (0.7 + n * 0.6)
        img.data.set([r, gg, b, 255], (y * s + x) * 4)
      }
    }
    g.putImageData(img, 0, 0)
  }, { height: h })
  const glow = canvasTex(size, (g, s, hh) => {
    const img = g.createImageData(s, hh)
    for (let y = 0; y < hh; y++) {
      for (let x = 0; x < s; x++) {
        const u = x / s
        const crack = Math.pow(1 - Math.abs(noise.n2(x / 4 + 9, y / 30) * 2 - 1), 10)
        const ember = THREE.MathUtils.smoothstep(noise.fbm2(x / 10 + 3, y / 10, 3), 0.55, 0.8)
        const k = (crack * 0.9 + ember * 0.6) * THREE.MathUtils.smoothstep(u, 0.55, 0.95)
        img.data.set([255 * k, 110 * k, 30 * k, 255], (y * s + x) * 4)
      }
    }
    g.putImageData(img, 0, 0)
  }, { height: h })
  return { bark, glow }
}

/** A rock: a squashed, lumpy sphere. */
export function rockGeometry(r, seed, detail = 2) {
  const noise = makeNoise(seed)
  const g = new THREE.IcosahedronGeometry(r, detail)
  const pos = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = noise.fbm3(v.x * 3 + seed, v.y * 3, v.z * 3, 3)
    v.multiplyScalar(0.78 + n * 0.45)
    v.y *= 0.62
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

/** The campfire: a ring of stones, a bed of embers, five logs in a cone, flames, sparks, smoke and the
 *  light it throws. setLevel(0..1) eases the fire up or down; `boost` makes it flare. */
export function campfire({ light = false, stoneMat }) {
  const group = new THREE.Group()
  const rnd = random(7)
  // the stones
  const stones = new THREE.Group()
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rnd() * 0.15
    const s = new THREE.Mesh(rockGeometry(0.17 + rnd() * 0.06, 20 + i, 2), stoneMat)
    s.position.set(Math.cos(a) * 0.86, 0.06, Math.sin(a) * 0.86)
    s.rotation.y = rnd() * 6
    s.castShadow = s.receiveShadow = true
    stones.add(s)
  }
  group.add(stones)
  // the embers: a disc of ash with glowing spots
  const emberMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPower: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      ${NOISE_GLSL}
      uniform float uTime;
      uniform float uPower;
      varying vec2 vP;
      void main() {
        float r = length(vP);
        float n = snoise(vec3(vP * 7.0, uTime * 0.25)) * 0.5 + 0.5;
        float m = snoise(vec3(vP * 19.0, uTime * 0.6 + 3.0)) * 0.5 + 0.5;
        float hot = smoothstep(0.45, 0.85, n * 0.7 + m * 0.4) * (1.0 - smoothstep(0.2, 0.72, r));
        vec3 ash = mix(vec3(0.05, 0.045, 0.04), vec3(0.16, 0.14, 0.13), m);
        vec3 glow = mix(vec3(0.9, 0.18, 0.02), vec3(1.6, 0.75, 0.2), m) * 2.0;
        vec3 col = mix(ash, glow, hot * uPower);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const embers = new THREE.Mesh(new THREE.CircleGeometry(0.74, 40), emberMat)
  embers.rotation.x = -Math.PI / 2
  embers.position.y = 0.02
  group.add(embers)
  // logs leaning together
  const tex = logTextures(light ? 256 : 512)
  const logMat = new THREE.MeshStandardMaterial({ map: tex.bark, roughness: 0.92, emissive: '#ffffff', emissiveMap: tex.glow, emissiveIntensity: 1.5 })
  const logs = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3
    const len = 0.95 + rnd() * 0.15
    const geo = new THREE.CylinderGeometry(0.075, 0.09, len, 12, 1)
    // u along the log: the cylinder's v runs along its height (top v = 1): the top is the burning end
    const uv = geo.attributes.uv
    for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getY(k), uv.getX(k))
    const log = new THREE.Mesh(geo, logMat)
    // a low cone: the feet out by the stones, the burning ends meeting over the embers
    const lean = 1.0
    const mid = 0.78 - Math.sin(lean) * len * 0.5
    log.position.set(Math.cos(a) * mid, Math.cos(lean) * len * 0.5 + 0.02, Math.sin(a) * mid)
    log.rotation.set(0, -a, 0)
    log.rotateZ(lean)
    log.castShadow = true
    logs.add(log)
  }
  group.add(logs)
  // flames
  const flames = []
  const specs = light
    ? [[0, 0, 1.1, 1.9, 0], [0.2, 0.1, 0.7, 1.2, 1], [-0.18, -0.12, 0.72, 1.3, 2]]
    : [[0, 0, 1.15, 2.0, 0], [0.22, 0.1, 0.72, 1.3, 1], [-0.2, -0.12, 0.76, 1.4, 2], [0.06, -0.22, 0.6, 1.05, 3], [-0.1, 0.22, 0.62, 1.15, 4], [0, 0, 0.55, 2.5, 5]]
  for (const [x, z, w, h, s] of specs) {
    const f = flameCard({ w, h, seed: s * 1.37, gain: s === 5 ? 0.9 : 1.35 })
    f.mesh.position.set(x, 0.04, z)
    f.base = { w, h }
    group.add(f.mesh)
    flames.push(f)
  }
  // sparks and smoke
  const sparks = new Particles(light ? 24 : 70, { map: softDot(32, 0, true) })
  const smoke = new Particles(light ? 10 : 32, { map: softDot(64), additive: false, renderOrder: 7 })
  group.add(sparks.points, smoke.points)
  // its light
  const fireLight = new THREE.PointLight('#ff8a3d', 70, 0, 2)
  fireLight.position.y = 0.9
  if (!light) {
    fireLight.castShadow = true
    fireLight.shadow.mapSize.set(1024, 1024)
    fireLight.shadow.bias = -0.002
    fireLight.shadow.radius = 4
    fireLight.shadow.camera.near = 0.3
    fireLight.shadow.camera.far = 20
  }
  group.add(fireLight)
  const glowLight = new THREE.PointLight('#ff5a1a', 8, 0, 2)
  glowLight.position.y = 0.25
  group.add(glowLight)

  let level = 1
  let target = 1
  let rate = 1
  let flare = 0
  let sparkWait = 0
  let smokeWait = 0
  const api = {
    group,
    fireLight,
    get level() {
      return level
    },
    setLevel(to, speed = 1) {
      target = to
      rate = speed
    },
    /** a burst of flame (relit, or oxygen came close) */
    whoomph(k = 1) {
      flare = Math.max(flare, k)
    },
    logs,
    embers,
    update(dt, t, camera, renderer, boost = 0) {
      level = damp(level, target, rate * 2, dt)
      if (Math.abs(level - target) < 0.002) level = target
      flare = Math.max(0, flare - dt * 1.4)
      const f = flicker(t)
      const power = clamp(level * (0.88 + f * 0.24) + flare * 0.6 + boost * 0.25 * level, 0, 1.6)
      flames.forEach((fl, i) => {
        fl.update(t)
        fl.set(Math.min(1, power * (i === 5 ? 0.7 : 1)))
        fl.mesh.scale.set(fl.base.w * (0.8 + 0.2 * power), fl.base.h * (0.35 + 0.65 * Math.min(power, 1.3)), 1)
      })
      emberMat.uniforms.uTime.value = t
      emberMat.uniforms.uPower.value = Math.min(1, level * 1.4 + 0.08 * level)
      logMat.emissiveIntensity = 0.2 + level * (1.1 + f * 0.6)
      fireLight.intensity = 70 * power * (0.85 + f * 0.3)
      glowLight.intensity = 8 * Math.min(1, level * 1.5)
      fireLight.position.x = Math.sin(t * 3.1) * 0.04
      fireLight.position.z = Math.cos(t * 2.3) * 0.04
      // sparks: tiny, quick, drifting up on the hot air
      sparkWait -= dt
      while (sparkWait < 0) {
        sparkWait += (light ? 0.12 : 0.045) / Math.max(0.05, power)
        if (power > 0.2) {
          sparks.spawn({
            x: (rnd() - 0.5) * 0.5, y: 0.3 + rnd() * 0.4, z: (rnd() - 0.5) * 0.5,
            vx: (rnd() - 0.5) * 0.4, vy: 1.2 + rnd() * 1.6, vz: (rnd() - 0.5) * 0.4,
            life: 0.8 + rnd() * 1.6, size: 0.025 + rnd() * 0.02, r: 1.6, g: 0.75, b: 0.25, k: rnd() * 10,
          })
        }
      }
      sparks.step(dt, (p, d, k) => {
        p.vx += Math.sin(t * 5 + p.k) * d * 1.2
        p.vz += Math.cos(t * 4 + p.k) * d * 1.2
        p.vy -= d * 0.3
        p.alpha = (1 - k) * (0.6 + 0.4 * Math.sin(t * 30 + p.k))
        p.g = 0.75 - k * 0.45
      }, camera, renderer)
      // smoke: slow, dark, widening, toward the opening above
      smokeWait -= dt
      const smoky = level > 0.05 ? 0.25 + (1 - level) * 0.6 : 0
      while (smokeWait < 0) {
        smokeWait += 0.35
        if (smoky > 0.01) {
          smoke.spawn({
            x: (rnd() - 0.5) * 0.4, y: 1.0 + rnd() * 0.5, z: (rnd() - 0.5) * 0.4,
            vx: (rnd() - 0.5) * 0.15, vy: 0.55 + rnd() * 0.3, vz: (rnd() - 0.5) * 0.15,
            life: 7 + rnd() * 4, size: 0.4, alpha: 0, r: 0.16, g: 0.15, b: 0.15, k: smoky,
          })
        }
      }
      smoke.step(dt, (p, d, k) => {
        p.size = 0.4 + k * 2.6
        p.alpha = Math.sin(Math.min(1, k * 1.2) * Math.PI) * 0.22 * p.k
        p.vx += -p.x * d * 0.02
        p.vz += -p.z * d * 0.02
      }, camera, renderer)
      return power
    },
  }
  return api
}
