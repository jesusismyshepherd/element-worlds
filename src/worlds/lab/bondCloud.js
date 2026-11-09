// The Molecule Lab's clouds drawn (bondDomains.js says which there are and how each wave is made): a ray
// from the eye is marched through a sphere round the molecule, adding up each cloud's light where the ray
// passes (a mist inside its skin and a glowing skin, as the room inside the atom draws its orbitals,
// src/worlds/atom/cloud.js). Each cloud is skipped where the point is outside its own sphere. The march is
// drawn into a smaller picture and laid over the lab by a card through the molecule's middle that always
// faces the eye: the table and floor behind the molecule do not hide the clouds, an Atomling in front of the
// middle does. (The near side of a sphere round the molecule dipped below the table top, which hid the clouds'
// lower half.) update(domains) each frame, render() before the frame is drawn.
import * as THREE from 'three'
import { MAXD, boundOf, levelOf } from './bondDomains.js'
import { CLOUD_COLORS } from './cloudWords.js'

const KIND = { sigma: 0, pi: 1, lone: 2, free: 2, ion: 2 }

const VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

const frag = steps => /* glsl */ `
#define MAXD ${MAXD}
uniform vec3 uCenter;
uniform float uRadius;
uniform int uSteps;
uniform int uN;
uniform vec3 uA[MAXD];
uniform vec3 uB[MAXD];
uniform vec3 uDA[MAXD];
uniform vec3 uDB[MAXD];
uniform vec4 uZ[MAXD];     // zeta A, zeta B, lambda A, lambda B
uniform vec4 uC[MAXD];     // cA, cB, how far made (0..1), kind (0 sigma, 1 pi, 2 one atom's)
uniform vec4 uL[MAXD];     // electrons / skin level: the cloud's, each half's before the bond is made
uniform vec3 uCol[MAXD];
uniform vec4 uBound[MAXD]; // centre, radius squared
uniform float uMist;
uniform float uSkin;
uniform float uSharp;
uniform float uAbsorb;
uniform float uFade;
varying vec3 vWorld;
const float PI = 3.14159265;
float hyb(vec3 r, vec3 d, float z, float l) {
  return sqrt(z * z * z / PI) * exp(-z * length(r)) * (1.0 + l * z * dot(r, d)) / sqrt(1.0 + l * l);
}
float porb(vec3 r, vec3 d, float z) {
  return sqrt(z * z * z * z * z / PI) * dot(r, d) * exp(-z * length(r));
}
float jitter(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - cameraPosition);
  vec3 oc = ro - uCenter;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - uRadius * uRadius;
  float h = b * b - c;
  if (h <= 0.0 || uN == 0) { gl_FragColor = vec4(0.0); return; }
  h = sqrt(h);
  float t0 = max(-b - h, 0.0);
  float t1 = -b + h;
  if (t1 <= t0) { gl_FragColor = vec4(0.0); return; }
  float dt = (t1 - t0) / float(uSteps);
  float j = jitter(gl_FragCoord.xy);
  vec3 acc = vec3(0.0);
  float T = 1.0;
  for (int s = 0; s < ${steps}; s++) {
    if (s >= uSteps) break;
    vec3 P = ro + rd * (t0 + (float(s) + j) * dt);
    vec3 col = vec3(0.0);
    float ab = 0.0;
    for (int i = 0; i < MAXD; i++) {
      if (i >= uN) break;
      vec3 q = P - uBound[i].xyz;
      if (dot(q, q) > uBound[i].w) continue;
      vec3 rA = P - uA[i];
      float nd;
      if (uC[i].w < 0.5) {
        float hA = hyb(rA, uDA[i], uZ[i].x, uZ[i].z);
        float hB = hyb(P - uB[i], uDB[i], uZ[i].y, uZ[i].w);
        float w = uC[i].x * hA + uC[i].y * hB;
        float m = uC[i].z;
        // two hands' clouds (one electron each) becoming one shared cloud of two
        nd = m * w * w * uL[i].x + (1.0 - m) * (hA * hA * uL[i].y + hB * hB * uL[i].z);
      } else if (uC[i].w < 1.5) {
        float w = uC[i].x * porb(rA, uDA[i], uZ[i].x) + uC[i].y * porb(P - uB[i], uDB[i], uZ[i].y);
        nd = w * w * uL[i].x * uC[i].z;
      } else {
        float hh = hyb(rA, uDA[i], uZ[i].x, uZ[i].z);
        nd = hh * hh * uL[i].x;
      }
      float mist = (1.0 - exp(-nd * 1.1)) * smoothstep(0.1, 0.8, nd) * uMist;
      float lk = log(max(nd, 1e-6));
      float skin = exp(-lk * lk * uSharp) * uSkin;
      col += uCol[i] * (mist + skin);
      ab += min(nd, 5.0);
    }
    acc += T * col * dt;
    T *= exp(-ab * uAbsorb * dt);
    if (T < 0.02) break;
  }
  gl_FragColor = vec4(acc * uFade, (1.0 - T) * uFade);
}
`

const COMPOSITE = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uRes;
void main() {
  gl_FragColor = texture2D(uTex, gl_FragCoord.xy / uRes);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

/** The lab's clouds. `group` goes into the scene (in world space: the clouds are given in world
 *  coordinates); update(domains, origin) each frame with the molecule's clouds (bondDomains.js) and where
 *  the molecule's own axes start in the world; render() before the frame is drawn. */
export function bondCloud({ renderer, camera, light }) {
  const steps = light ? 60 : 88
  const share = light ? 0.42 : 0.55
  const vec3s = () => Array.from({ length: MAXD }, () => new THREE.Vector3())
  const vec4s = () => Array.from({ length: MAXD }, () => new THREE.Vector4())
  const uniforms = {
    uCenter: { value: new THREE.Vector3() },
    uRadius: { value: 1 },
    uSteps: { value: steps },
    uN: { value: 0 },
    uA: { value: vec3s() },
    uB: { value: vec3s() },
    uDA: { value: vec3s() },
    uDB: { value: vec3s() },
    uZ: { value: vec4s() },
    uC: { value: vec4s() },
    uL: { value: vec4s() },
    uCol: { value: Array.from({ length: MAXD }, () => new THREE.Color()) },
    uBound: { value: vec4s() },
    uMist: { value: 0.035 },
    uSkin: { value: 0.62 },
    uSharp: { value: 6 },
    uAbsorb: { value: 0.06 },
    uFade: { value: 0 },
  }
  const march = new THREE.Mesh(
    new THREE.SphereGeometry(1, 40, 20),
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: frag(steps), side: THREE.BackSide, depthTest: false, depthWrite: false }),
  )
  march.frustumCulled = false
  const scene = new THREE.Scene()
  scene.add(march)
  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false })
  rt.texture.minFilter = THREE.LinearFilter
  rt.texture.magFilter = THREE.LinearFilter
  rt.texture.generateMipmaps = false
  const composite = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: { uTex: { value: rt.texture }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: VERT,
      fragmentShader: COMPOSITE,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    }),
  )
  composite.frustumCulled = false
  composite.renderOrder = -5
  const group = new THREE.Group()
  group.add(composite)

  const full = new THREE.Vector2()
  const clear = new THREE.Color()
  const levels = new Map() // a cloud's key -> its skin levels (they keep while its shape does)
  let fade = 0
  let want = 0
  const keyOf = c => `${c.kind}:${c.a}:${c.b}:${c.e}:${c.lA.toFixed(2)}:${c.lB.toFixed(2)}:${c.cA.toFixed(3)}`

  return {
    group,
    uniforms,
    /** Fade the clouds in (true) or out. */
    show(on) {
      want = on ? 1 : 0
    },
    get visible() {
      return fade > 0.001
    },
    /** This frame's clouds. */
    update(domains, origin, dt) {
      fade += (want - fade) * Math.min(1, dt * 4)
      uniforms.uFade.value = fade
      group.visible = fade > 0.001
      const n = Math.min(MAXD, domains.length)
      uniforms.uN.value = n
      if (!n) return
      const lo = new THREE.Vector3(Infinity, Infinity, Infinity)
      const hi = new THREE.Vector3(-Infinity, -Infinity, -Infinity)
      const u = uniforms
      for (let i = 0; i < n; i++) {
        const c = domains[i]
        const k = keyOf(c)
        if (!levels.has(k)) {
          const own = levelOf(c)
          // before the bond is made, each hand's own cloud (one electron), along the bond
          const half = side => levelOf({ kind: 'free', A: side ? c.B : c.A, B: side ? c.B : c.A, dA: side ? c.dB : c.dA, dB: side ? c.dB : c.dA, zA: side ? c.zB : c.zA, zB: side ? c.zB : c.zA, lA: side ? c.lB : c.lA, lB: side ? c.lB : c.lA, cA: 1, cB: 0, e: 1 })
          levels.set(k, c.kind === 'sigma' ? [own, half(false), half(true)] : [own, own, own])
        }
        const [lv, la, lb] = levels.get(k)
        u.uA.value[i].set(c.A[0] + origin.x, c.A[1] + origin.y, c.A[2] + origin.z)
        u.uB.value[i].set(c.B[0] + origin.x, c.B[1] + origin.y, c.B[2] + origin.z)
        u.uDA.value[i].set(...c.dA)
        u.uDB.value[i].set(...c.dB)
        u.uZ.value[i].set(c.zA, c.zB, c.lA, c.lB)
        u.uC.value[i].set(c.cA, c.cB, c.merge, KIND[c.kind])
        u.uL.value[i].set(c.e / lv, 1 / la, 1 / lb, 0)
        // each shared pair its own shade, so a molecule's bonds read as separate clouds (methane's four)
        u.uCol.value[i].set(CLOUD_COLORS[c.kind])
        if (c.kind === 'sigma' || c.kind === 'lone') u.uCol.value[i].offsetHSL(((i * 0.618) % 1 - 0.5) * 0.12, 0, 0)
        const bd = boundOf(c)
        u.uBound.value[i].set(bd.at[0] + origin.x, bd.at[1] + origin.y, bd.at[2] + origin.z, bd.r * bd.r)
        lo.min(new THREE.Vector3(bd.at[0] - bd.r, bd.at[1] - bd.r, bd.at[2] - bd.r).add(origin))
        hi.max(new THREE.Vector3(bd.at[0] + bd.r, bd.at[1] + bd.r, bd.at[2] + bd.r).add(origin))
      }
      // the sphere the rays are marched through: round every cloud
      const centre = lo.clone().add(hi).multiplyScalar(0.5)
      const r = hi.clone().sub(lo).length() / 2
      u.uCenter.value.copy(centre)
      u.uRadius.value = r
      march.position.copy(centre)
      march.scale.setScalar(r)
      // the card: through the middle, facing the eye, as wide as the sphere looks (a little more, for
      // perspective); with the eye inside the sphere, just in front of the eye
      const toEye = camera.position.clone().sub(centre)
      const dist = toEye.length()
      if (dist > r * 0.6) composite.position.copy(centre)
      else composite.position.copy(camera.position).addScaledVector(toEye.normalize(), -Math.min(0.5, dist * 0.5))
      composite.quaternion.copy(camera.quaternion)
      composite.scale.setScalar(Math.max(r * 2.8, 4) * (dist > r * 0.6 ? 1 : 3))
      if (levels.size > 400) levels.clear()
    },
    render() {
      if (!group.visible || !uniforms.uN.value) return
      renderer.getDrawingBufferSize(full)
      const w = Math.max(2, Math.round(full.x * share))
      const h = Math.max(2, Math.round(full.y * share))
      if (rt.width !== w || rt.height !== h) rt.setSize(w, h)
      composite.material.uniforms.uRes.value.copy(full)
      const prev = renderer.getRenderTarget()
      const auto = renderer.autoClear
      renderer.getClearColor(clear)
      const alpha = renderer.getClearAlpha()
      renderer.setRenderTarget(rt)
      renderer.setClearColor(0x000000, 0)
      renderer.autoClear = true
      renderer.render(scene, camera)
      renderer.setRenderTarget(prev)
      renderer.setClearColor(clear, alpha)
      renderer.autoClear = auto
    },
    async warm() {
      const prev = renderer.getRenderTarget()
      renderer.setRenderTarget(rt)
      try {
        if (renderer.compileAsync) await renderer.compileAsync(scene, camera)
        else renderer.compile(scene, camera)
      } finally {
        renderer.setRenderTarget(prev)
      }
    },
    dispose() {
      rt.dispose()
      march.geometry.dispose()
      march.material.dispose()
      composite.geometry.dispose()
      composite.material.dispose()
    },
  }
}
