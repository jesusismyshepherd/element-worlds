// The sky of the air wing: a daylight dome (deep blue overhead, pale at the horizon, a warm glow round
// the sun), a sea of clouds below the deck whose far edge melts into the same horizon colour, a few
// snowy peaks standing out of it, the ozone layer high above (a faint sheet that glows as a band near
// the horizon, where the eye looks through more of it) with O3 molecules in it, and the Sun's UV rays
// coming down to it, most of them stopped there. The same sky lights the scene (environment map).
import * as THREE from 'three'
import { NOISE_GLSL, makeNoise, random, Particles, softDot } from './kit.js'

/** Toward the sun: south-south-west (azimuth 210 degrees from north), 24 degrees up. It lights the
 *  exhibits from the front and side as one walks round the deck, and stands behind the arch. */
const SUN_AZ = (210 * Math.PI) / 180
const SUN_EL = (24 * Math.PI) / 180
export const SUN = new THREE.Vector3(Math.sin(SUN_AZ) * Math.cos(SUN_EL), Math.sin(SUN_EL), -Math.cos(SUN_AZ) * Math.cos(SUN_EL)).normalize()

const SKY_GLSL = /* glsl */ `
  uniform vec3 uSun;
  vec3 skyColor(vec3 d) {
    float e = d.y;
    float t = clamp(e, 0.0, 1.0);
    vec3 zen = vec3(0.035, 0.13, 0.46);
    vec3 hor = vec3(0.5, 0.68, 0.92);
    vec3 col = mix(hor, zen, pow(t, 0.42));
    col = mix(col, vec3(0.78, 0.85, 0.94), exp(-max(e, 0.0) * 16.0) * 0.55);
    float s = max(dot(d, uSun), 0.0);
    vec3 warm = vec3(1.0, 0.76, 0.48);
    col += warm * (pow(s, 8.0) * 0.08 + pow(s, 48.0) * 0.3 + pow(s, 520.0) * 1.3);
    col += warm * 0.1 * pow(s, 3.0) * exp(-abs(e) * 8.0);
    vec3 haze = vec3(0.74, 0.81, 0.91) + warm * 0.08 * pow(s, 3.0);
    return mix(col, haze, smoothstep(0.0, -0.05, e));
  }
`

/** The sky dome. `env` makes the variant for the environment map: below the horizon it is the lit
 *  cloud tops (bright), which is what lights things from below up here. */
export function skyDome({ radius = 5200, env = false } = {}) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uSun: { value: SUN.clone() }, uEnv: { value: env ? 1 : 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }`,
    fragmentShader: /* glsl */ `
      ${SKY_GLSL}
      uniform float uEnv;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        vec3 col = skyColor(d);
        float s = dot(d, uSun);
        // the sun's disc (bright enough to bloom)
        col += vec3(1.0, 0.93, 0.8) * smoothstep(0.99990, 0.999955, s) * 40.0 * (1.0 - uEnv);
        if (uEnv > 0.5) {
          // under the deck: cloud tops in sunshine
          col = mix(col, vec3(1.05, 1.02, 0.98), smoothstep(-0.02, -0.25, d.y));
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const dome = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat)
  dome.frustumCulled = false
  dome.renderOrder = -10
  return dome
}

/** Light from this sky for reflections and fill (an environment map). Dispose the returned target. */
export function skyEnvironment(renderer) {
  const scene = new THREE.Scene()
  scene.add(skyDome({ radius: 40, env: true }))
  const pmrem = new THREE.PMREMGenerator(renderer)
  const rt = pmrem.fromScene(scene, 0.02, 0.1, 100)
  pmrem.dispose()
  scene.traverse(o => {
    o.geometry?.dispose()
    o.material?.dispose()
  })
  return rt
}

/** A disc of rings, fine near the middle and coarse far out (what perspective needs). */
function polarGrid(rings, segs, r0, r1) {
  const pos = [0, 0, 0]
  for (let i = 0; i < rings; i++) {
    const r = r0 * Math.pow(r1 / r0, i / (rings - 1))
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2
      pos.push(Math.cos(a) * r, 0, Math.sin(a) * r)
    }
  }
  const idx = []
  for (let j = 0; j < segs; j++) idx.push(0, 1 + ((j + 1) % segs), 1 + j)
  for (let i = 0; i < rings - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const a = 1 + i * segs + j
      const b = 1 + i * segs + ((j + 1) % segs)
      const c = 1 + (i + 1) * segs + j
      const d = 1 + (i + 1) * segs + ((j + 1) % segs)
      idx.push(a, b, c, b, d, c)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), r1)
  return g
}

/** The sea of clouds: billowing tops (a height field moved in the vertex shader, its fine detail lit
 *  per pixel), sunlit and warm on the sun's side, blue-grey in their own shade, with a few gaps that
 *  look down into the haze, fading into the horizon's colour. `y` is the level of the cloud base. */
const CLOUD_HEIGHT_GLSL = /* glsl */ `
  uniform float uTime;
  // 0..1: how much cloud there is (gaps where it falls to 0), and the height of the tops in metres
  vec2 cloudField(vec2 p, int oct) {
    vec2 q = p * 0.0036 + vec2(uTime * 0.0035, uTime * 0.0012);
    float swell = snoise(p * 0.0008 + 3.1) * 0.5 + 0.5;
    float h = 0.0;
    float a = 1.0;
    float n = 0.0;
    for (int i = 0; i < 6; i++) {
      if (i >= oct) break;
      h += a * abs(snoise(q));
      n += a;
      q = q * 2.09 + vec2(1.3, 7.1);
      a *= 0.5;
    }
    h /= n;
    float cover = smoothstep(0.1, 0.34, h + (swell - 0.5) * 0.42);
    return vec2(cover, h * cover * (14.0 + 34.0 * swell * swell));
  }
`
export function cloudSea({ y = -46, light = false } = {}) {
  const octV = light ? 3 : 4
  const octF = light ? 4 : 6
  const mat = new THREE.ShaderMaterial({
    fog: false,
    uniforms: { uSun: { value: SUN.clone() }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      ${NOISE_GLSL}
      ${CLOUD_HEIGHT_GLSL}
      varying vec3 vWorld;
      varying float vFade;
      void main() {
        vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
        float r = length(position.xz);
        float fade = 1.0 - smoothstep(800.0, 2800.0, r);
        p.y += cloudField(p.xz, ${octV}).y * fade;
        vWorld = p;
        vFade = fade;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      ${NOISE_GLSL}
      ${SKY_GLSL}
      ${CLOUD_HEIGHT_GLSL}
      varying vec3 vWorld;
      varying float vFade;
      void main() {
        vec3 view = vWorld - cameraPosition;
        float dist = length(view.xz);
        vec3 v = normalize(view);
        // fewer octaves far away, where they would only shimmer
        int oct = dist > 1500.0 ? 3 : dist > 550.0 ? ${Math.max(3, octF - 1)} : ${octF};
        float e = 1.2 + dist * 0.004;
        float k = max(vFade, 0.3);
        vec2 f0 = cloudField(vWorld.xz, oct);
        float h0 = f0.y * k;
        float hx = cloudField(vWorld.xz + vec2(e, 0.0), oct).y * k;
        float hz = cloudField(vWorld.xz + vec2(0.0, e), oct).y * k;
        vec3 n = normalize(vec3(h0 - hx, e, h0 - hz));
        float ndl = dot(n, uSun);
        float lit = clamp((ndl + 0.18) / 1.18, 0.0, 1.0);
        // valleys between the heads sit in their neighbours' shade
        float ao = mix(0.5, 1.0, smoothstep(1.0, 22.0, h0));
        vec3 sunC = vec3(1.5, 1.4, 1.26);
        vec3 shade = vec3(0.36, 0.45, 0.62);
        vec3 col = mix(shade, sunC, lit) * ao;
        // the edge of a head toward the sun glows (light through its thin rim)
        float rim = pow(1.0 - clamp(n.y, 0.0, 1.0), 2.0) * max(dot(normalize(vec3(n.x, 0.0, n.z) + 1e-4), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
        col += vec3(1.0, 0.86, 0.66) * rim * 0.5;
        // looking toward the sun: light scattered forward through the cloud
        float fwd = pow(max(dot(v, uSun), 0.0), 8.0);
        col += vec3(1.0, 0.82, 0.58) * fwd * 0.35;
        // gaps: down into blue haze, far below
        vec3 deep = vec3(0.16, 0.25, 0.42);
        col = mix(deep, col, smoothstep(0.0, 0.55, f0.x));
        // the horizon's haze, the same colour as the sky there
        vec3 horiz = normalize(vec3(v.x, 0.0, v.z));
        vec3 haze = skyColor(horiz + vec3(0.0, -0.001, 0.0));
        float fog = 1.0 - exp(-dist / 2600.0);
        col = mix(col, haze, clamp(fog, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const mesh = new THREE.Mesh(polarGrid(light ? 90 : 170, light ? 110 : 200, 3, 6500), mat)
  mesh.position.y = y
  mesh.frustumCulled = false
  mesh.renderOrder = -8
  return { mesh, update: t => (mat.uniforms.uTime.value = t) }
}

/** Snowy peaks far away, standing out of the clouds (they give the sea of clouds its scale). */
export function peaks({ y = -46 } = {}) {
  const group = new THREE.Group()
  const noise = makeNoise(31)
  const spots = [
    { az: -112, d: 3900, h: 560, r: 980 },
    { az: -96, d: 4600, h: 380, r: 820 },
    { az: 24, d: 3300, h: 470, r: 900 },
    { az: 38, d: 4200, h: 640, r: 1100 },
    { az: 128, d: 3800, h: 420, r: 900 },
    { az: 162, d: 4500, h: 330, r: 760 },
  ]
  const snow = new THREE.Color('#f4f7fb')
  const rock = new THREE.Color('#5d6a80')
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0, fog: true })
  // the feet of the peaks melt into the cloud tops instead of standing on a hard line
  mat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vHeight;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvHeight = (modelMatrix * vec4(transformed, 1.0)).y;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vHeight;')
      .replace('#include <fog_fragment>', 'gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.86, 0.88, 0.93), 1.0 - smoothstep(-40.0, 70.0, vHeight));\n#include <fog_fragment>')
  }
  spots.forEach((s, k) => {
    const geo = new THREE.ConeGeometry(s.r, s.h + 120, 128, 72, true)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const f = (v.y + (s.h + 120) / 2) / (s.h + 120) // 0 at the foot, 1 at the top
      const a = Math.atan2(v.z, v.x)
      // ridges: sharp crests down the flanks
      const ridge = Math.pow(1 - Math.abs(noise.fbm2(Math.cos(a) * 3 + k * 7, Math.sin(a) * 3 + f * 2.5, 4) * 2 - 1), 2)
      const rough = noise.fbm2(Math.cos(a) * 9 + k, f * 9 + Math.sin(a) * 9, 4)
      const rad = Math.hypot(v.x, v.z)
      const scale = 1 + (ridge - 0.45) * 0.38 + (rough - 0.5) * 0.2
      v.x *= scale
      v.z *= scale
      v.y += (rough - 0.5) * s.h * 0.08 * (1 - f) + (ridge - 0.5) * s.h * 0.06
      if (rad < 1e-3) v.y += (rough - 0.5) * 30
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    const col = new Float32Array(pos.count * 3)
    const n = geo.attributes.normal
    for (let i = 0; i < pos.count; i++) {
      const f = (pos.getY(i) + (s.h + 120) / 2) / (s.h + 120)
      const flatness = n.getY(i)
      const white = THREE.MathUtils.smoothstep(flatness + f * 0.6 + (noise.n2(i * 0.37, k) - 0.5) * 0.25, 0.55, 0.8)
      const c = rock.clone().lerp(snow, white)
      col.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const m = new THREE.Mesh(geo, mat)
    const az = (s.az * Math.PI) / 180
    m.position.set(Math.sin(az) * s.d, y - 60 + (s.h + 120) / 2, -Math.cos(az) * s.d)
    m.rotation.y = k * 1.7
    group.add(m)
  })
  return group
}

/** The ozone layer high above the deck, drawn to scale with nothing but itself (the real one is 15 to
 *  35 km up): a thin glowing sheet, faint overhead and brighter toward the horizon where a look passes
 *  through more of it, O3 molecules (bent, 116.8 degrees) floating in it, and the Sun's UV rays coming
 *  down: UV-C and most UV-B stop there with a flash, UV-A goes on. */
export function ozoneLayer({ height = 150, light = false } = {}) {
  const group = new THREE.Group()
  const sheetMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
    uniforms: { uTime: { value: 0 }, uFlash: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      ${NOISE_GLSL}
      uniform float uTime;
      uniform float uFlash;
      varying vec3 vWorld;
      void main() {
        vec3 v = normalize(vWorld - cameraPosition);
        float path = 1.0 / max(abs(v.y), 0.06);
        float r = length(vWorld.xz);
        float n = snoise(vec3(vWorld.xz * 0.0035, uTime * 0.02)) * 0.5 + 0.5;
        float wisps = snoise(vec3(vWorld.xz * 0.012, uTime * 0.05 + 4.0)) * 0.5 + 0.5;
        float a = (0.010 + uFlash * 0.012) * path * (0.55 + 0.45 * n) * (0.8 + 0.4 * wisps);
        a *= 1.0 - smoothstep(1600.0, 3300.0, r);
        vec3 col = mix(vec3(0.42, 0.42, 1.0), vec3(0.75, 0.5, 1.0), n) * a;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const sheet = new THREE.Mesh(new THREE.CircleGeometry(3400, 96), sheetMat)
  sheet.rotation.x = -Math.PI / 2
  sheet.position.y = height
  sheet.frustumCulled = false
  sheet.renderOrder = -6
  group.add(sheet)

  // O3 molecules: three atoms, two bonds, 116.8 degrees, scaled up hugely so they read from the deck
  const count = light ? 28 : 70
  const rnd = random(116)
  const scale = 3.2 // metres per angstrom
  const half = (116.8 / 2) * (Math.PI / 180)
  const bond = 1.278 * scale
  const atoms = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-Math.sin(half) * bond, -Math.cos(half) * bond, 0), new THREE.Vector3(Math.sin(half) * bond, -Math.cos(half) * bond, 0)]
  const centre = atoms.reduce((s, a) => s.add(a), new THREE.Vector3()).multiplyScalar(1 / 3)
  atoms.forEach(a => a.sub(centre))
  const atomMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, light ? 10 : 16, light ? 8 : 12),
    new THREE.MeshStandardMaterial({ color: '#ff5a4e', emissive: '#ff3b2f', emissiveIntensity: 0.55, roughness: 0.35, fog: false }),
    count * 3,
  )
  const stickMesh = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.28, 0.28, 1, 8),
    new THREE.MeshStandardMaterial({ color: '#f1e6ff', emissive: '#c9a7ff', emissiveIntensity: 0.4, roughness: 0.4, fog: false }),
    count * 2,
  )
  atomMesh.frustumCulled = false
  stickMesh.frustumCulled = false
  const mols = []
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2
    const r = 20 + Math.pow(rnd(), 0.8) * 240
    mols.push({
      p: new THREE.Vector3(Math.cos(a) * r, height - 8 + rnd() * 16, Math.sin(a) * r),
      q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6)),
      w: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5),
      drift: new THREE.Vector3(rnd() - 0.5, 0, rnd() - 0.5).multiplyScalar(1.2),
      glow: 0,
    })
  }
  group.add(atomMesh, stickMesh)
  const m4 = new THREE.Matrix4()
  const tmp = new THREE.Vector3()
  const tmp2 = new THREE.Vector3()
  const dq = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const sq = new THREE.Quaternion()
  const one = new THREE.Vector3(1, 1, 1)
  const placeMolecules = dt => {
    mols.forEach((m, i) => {
      dq.setFromAxisAngle(tmp.copy(m.w).normalize(), m.w.length() * dt)
      m.q.multiply(dq)
      m.p.addScaledVector(m.drift, dt)
      if (Math.hypot(m.p.x, m.p.z) > 270) {
        m.p.x *= -0.98
        m.p.z *= -0.98
      }
      const world = atoms.map(a => a.clone().applyQuaternion(m.q).add(m.p))
      world.forEach((w, j) => atomMesh.setMatrixAt(i * 3 + j, m4.compose(w, sq.identity(), tmp2.setScalar(1.15 * scale * 0.37 * (1 + m.glow * 0.25)))))
      for (let j = 0; j < 2; j++) {
        const a = world[0]
        const b = world[j + 1]
        tmp.subVectors(b, a)
        const len = tmp.length()
        sq.setFromUnitVectors(up, tmp.normalize())
        stickMesh.setMatrixAt(i * 2 + j, m4.compose(tmp2.addVectors(a, b).multiplyScalar(0.5), sq, one.set(1, len, 1)))
      }
      m.glow = Math.max(0, m.glow - dt * 1.5)
    })
    atomMesh.instanceMatrix.needsUpdate = true
    stickMesh.instanceMatrix.needsUpdate = true
  }
  placeMolecules(0)

  // UV rays from the sun, as long glowing streaks: UV-A (lavender) gets through, UV-B (violet) mostly
  // stops, UV-C (magenta) always stops, at the layer
  const KINDS = [
    { id: 'A', color: new THREE.Color('#c8b0ff').multiplyScalar(1.4), pass: 0.95 },
    { id: 'B', color: new THREE.Color('#8f5bff').multiplyScalar(1.7), pass: 0.1 },
    { id: 'C', color: new THREE.Color('#ff4fd8').multiplyScalar(1.7), pass: 0 },
  ]
  const rayCount = light ? 10 : 22
  const rayGeo = new THREE.CylinderGeometry(0.35, 0.35, 1, 6, 1, true)
  rayGeo.translate(0, 0.5, 0) // the head at the origin, the tail behind it (toward the sun)
  const rayMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: true })
  const rays = new THREE.InstancedMesh(rayGeo, rayMat, rayCount)
  rays.frustumCulled = false
  rays.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(rayCount * 3), 3)
  group.add(rays)
  const flashes = new Particles(light ? 16 : 40, { map: softDot(64) })
  group.add(flashes.points)
  const live = Array.from({ length: rayCount }, () => ({ on: false }))
  const down = SUN.clone().negate()
  const qRay = new THREE.Quaternion().setFromUnitVectors(up, SUN)
  let wait = 0.5
  let burst = 0
  const spawnRay = kindIndex => {
    const r = live.find(x => !x.on)
    if (!r) return
    const kind = KINDS[kindIndex ?? Math.floor(rnd() * 3)]
    const target = new THREE.Vector3((rnd() - 0.5) * 240, 0, (rnd() - 0.5) * 240 - 40)
    // where the ray crosses the layer, and where it starts (far up toward the sun)
    const toLayer = height / SUN.y
    r.start = target.clone().addScaledVector(SUN, toLayer + 700)
    r.cross = target.clone().addScaledVector(SUN, toLayer)
    r.end = kind.pass > rnd() ? target.clone().addScaledVector(SUN, -20) : r.cross
    r.kind = kind
    r.d = 0
    r.len = r.start.distanceTo(r.end)
    r.on = true
    r.flashed = false
  }
  const updateRays = dt => {
    for (let i = 0; i < rayCount; i++) {
      const r = live[i]
      if (!r.on) {
        rays.setMatrixAt(i, m4.makeScale(0, 0, 0))
        continue
      }
      r.d += dt * 420
      const head = Math.min(r.d, r.len)
      const tail = Math.max(0, r.d - 70)
      if (tail >= r.len) {
        r.on = false
        rays.setMatrixAt(i, m4.makeScale(0, 0, 0))
        continue
      }
      const hp = r.start.clone().addScaledVector(down, head)
      const length = Math.max(0.01, head - tail)
      if (!r.flashed && r.end === r.cross && head >= r.len) {
        r.flashed = true
        flashes.spawn({ x: hp.x, y: hp.y, z: hp.z, life: 0.7, size: 26, r: r.kind.color.r, g: r.kind.color.g, b: r.kind.color.b })
        // the nearest molecule lights up
        let best = null
        let bd = 1e9
        for (const m of mols) {
          const d = m.p.distanceToSquared(hp)
          if (d < bd) {
            bd = d
            best = m
          }
        }
        if (best && bd < 120 * 120) best.glow = 1
      }
      rays.setMatrixAt(i, m4.compose(hp, qRay, tmp2.set(1, length, 1)))
      rays.setColorAt(i, r.kind.color)
    }
    rays.instanceMatrix.needsUpdate = true
    rays.instanceColor.needsUpdate = true
  }

  return {
    group,
    sheet,
    /** A volley of rays (the column exhibit sends one), all three kinds. */
    volley(n = 9) {
      burst = n
      sheetMat.uniforms.uFlash.value = 1
    },
    update(dt, t, camera, renderer) {
      sheetMat.uniforms.uTime.value = t
      sheetMat.uniforms.uFlash.value = Math.max(0, sheetMat.uniforms.uFlash.value - dt * 0.15)
      wait -= dt
      if (wait <= 0) {
        if (burst > 0) {
          spawnRay(burst % 3)
          burst--
          wait = 0.18
        } else {
          spawnRay()
          wait = 0.7 + rnd() * 1.2
        }
      }
      updateRays(dt)
      placeMolecules(dt)
      flashes.step(dt, (p, _dt, k) => {
        p.alpha = (1 - k) * (1 - k)
        p.size = 26 + k * 30
      }, camera, renderer)
    },
  }
}
