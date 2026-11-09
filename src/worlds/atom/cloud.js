// The electron cloud, drawn as glowing mist with a skin (the room inside the atom, docs/knowledge/inside-the-atom.md).
// A ray from the eye is marched through a sphere round the nucleus and adds up the light of the clouds it
// crosses: hydrogen's exact waves (a radial wave times a real spherical harmonic, the same polynomials as
// src/chem/orbitals.js) for one subshell's orbitals, or a table of the whole atom's shells against distance.
// The march is drawn into a smaller picture (half the screen's pixels, a quarter on a phone) and laid over
// the room by a sphere that the room's solid things hide, so it goes through the bloom like everything else.
// Two views are kept: changing what is shown blends the old into the new.
import * as THREE from 'three'

const MAX = 7

// ---- the shader's pieces ----
const COMMON = /* glsl */ `
float pw(float x, int n) { float v = 1.0; for (int i = 0; i < 3; i++) { if (i >= n) break; v *= x; } return v; }
// the generalised Laguerre polynomial L_k^a(x), as in orbitals.js
float lag(int k, float a, float x) {
  if (k == 0) return 1.0;
  float p = 1.0;
  float q = 1.0 + a - x;
  for (int i = 1; i < 6; i++) {
    if (i >= k) break;
    float fi = float(i);
    float r = ((2.0 * fi + 1.0 + a - x) * q - (fi + a) * p) / (fi + 1.0);
    p = q;
    q = r;
  }
  return q;
}
// the real spherical harmonics by index (orbitals.js HARMONICS)
float harm(int k, vec3 d) {
  float x = d.x, y = d.y, z = d.z;
  if (k == 0) return 0.28209479;
  if (k == 1) return 0.48860251 * x;
  if (k == 2) return 0.48860251 * y;
  if (k == 3) return 0.48860251 * z;
  if (k == 4) return 1.09254843 * x * y;
  if (k == 5) return 1.09254843 * x * z;
  if (k == 6) return 1.09254843 * y * z;
  if (k == 7) return 0.54627422 * (x * x - y * y);
  if (k == 8) return 0.31539157 * (3.0 * z * z - 1.0);
  if (k == 9) return 0.37317633 * z * (5.0 * z * z - 3.0);
  if (k == 10) return 0.4570458 * x * (5.0 * z * z - 1.0);
  if (k == 11) return 0.4570458 * y * (5.0 * z * z - 1.0);
  if (k == 12) return 2.89061144 * x * y * z;
  if (k == 13) return 1.44530572 * z * (x * x - y * y);
  if (k == 14) return 0.59004359 * x * (x * x - 3.0 * y * y);
  return 0.59004359 * y * (3.0 * x * x - y * y);
}
// where along its first step each ray starts: white noise (a regular dither showed as a mesh on thin skins
// once the smaller picture was stretched to the screen)
float jitter(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
// how far the eye is from the nucleus (set in main): the whole atom's shells that enclose the visitor fade,
// so after diving through a shell you see the inner ones ahead instead of a fog all round
float gCamR;
`

const viewUniforms = S => /* glsl */ `
uniform int uMode${S};
uniform float uScale${S};
uniform float uGain${S};
uniform sampler2D uTable${S};
uniform float uLogMin${S};
uniform float uLogMax${S};
uniform int uN${S};
uniform int uL${S};
uniform float uZh${S};
uniform float uNorm${S};
uniform int uCount${S};
uniform int uK${S}[${MAX}];
uniform vec3 uTint${S}[${MAX}];
uniform float uFill${S}[${MAX}];
uniform float uLevel${S}[${MAX}];
uniform float uPhase${S};
`

// the light a view gives at P (metres from the nucleus, the room's axes), and how much it dims what is behind
const viewEval = S => /* glsl */ `
vec3 eval${S}(vec3 P, out float absorb) {
  // the atom is turned about the room's up (uYaw: cos, sin) so that no axis points straight at the visitor;
  // the room's y is up, the atom's z is up (the atom's x and y lie on the floor)
  vec2 q = vec2(uYaw.x * P.x - uYaw.y * P.z, uYaw.y * P.x + uYaw.x * P.z);
  vec3 p = vec3(q.x, -q.y, P.y) / uScale${S};
  float r = length(p);
  absorb = 0.0;
  if (uMode${S} == 0) {
    float u = (log(max(r, 1e-7)) - uLogMin${S}) / (uLogMax${S} - uLogMin${S});
    if (u >= 1.0) return vec3(0.0);
    vec4 tb = texture2D(uTable${S}, vec2(clamp(u, 0.0, 1.0), 0.5));
    float around = 1.0 - 0.88 * smoothstep(gCamR * 0.9, gCamR * 1.1, length(P));
    absorb = tb.a * uAbsorb * 0.25 * around;
    return tb.rgb * tb.a * uGain${S} * around;
  }
  vec3 d = p / max(r, 1e-6);
  float rho = 2.0 * uZh${S} * r / float(uN${S});
  float R = uNorm${S} * exp(-0.5 * rho) * pw(rho, uL${S}) * lag(uN${S} - uL${S} - 1, float(2 * uL${S} + 1), rho);
  vec3 col = vec3(0.0);
  float ab = 0.0;
  for (int i = 0; i < ${MAX}; i++) {
    if (i >= uCount${S}) break;
    float ps = R * harm(uK${S}[i], d);
    // the density as a share of the skin's: 1 on the skin, more inside. The mist fills the cloud and
    // fades fast outside its skin; the skin itself is a thin glowing shell
    float nd = ps * ps / uLevel${S}[i];
    float mist = (1.0 - exp(-nd * 1.1)) * smoothstep(0.1, 0.8, nd) * uMist;
    float lk = log(max(nd, 1e-6));
    float skin = exp(-lk * lk * uSharp) * uSkin;
    vec3 c = uPhase${S} > 0.5 ? (ps > 0.0 ? uPos : uNeg) : uTint${S}[i];
    float f = uFill${S}[i];
    col += c * (mist + skin) * f;
    ab += min(nd, 5.0) * f;
  }
  absorb = ab * uAbsorb;
  return col * uGain${S};
}
`

const MARCH_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

const marchFrag = steps => /* glsl */ `
uniform vec3 uCenter;
uniform int uSteps;
uniform float uRadius;
uniform float uMix;
uniform float uFade;
uniform float uMist;
uniform float uSkin;
uniform float uSharp;
uniform float uAbsorb;
uniform vec2 uYaw;
uniform vec3 uPos;
uniform vec3 uNeg;
${viewUniforms('A')}
${viewUniforms('B')}
varying vec3 vWorld;
${COMMON}
${viewEval('A')}
${viewEval('B')}
void main() {
  vec3 ro = cameraPosition - uCenter;
  vec3 rd = normalize(vWorld - cameraPosition);
  gCamR = length(ro);
  float b = dot(ro, rd);
  float c = dot(ro, ro) - uRadius * uRadius;
  float h = b * b - c;
  if (h <= 0.0) { gl_FragColor = vec4(0.0); return; }
  h = sqrt(h);
  float t0 = max(-b - h, 0.0);
  float t1 = -b + h;
  if (t1 <= t0) { gl_FragColor = vec4(0.0); return; }
  float dt = (t1 - t0) / float(uSteps);
  float j = jitter(gl_FragCoord.xy);
  vec3 acc = vec3(0.0);
  float T = 1.0;
  for (int i = 0; i < ${steps}; i++) {
    if (i >= uSteps) break;
    vec3 P = ro + rd * (t0 + (float(i) + j) * dt);
    float aA;
    vec3 e = evalA(P, aA);
    float a = aA;
    if (uMix > 0.001) {
      float aB;
      vec3 eB = evalB(P, aB);
      e = mix(e, eB, uMix);
      a = mix(a, aB, uMix);
    }
    acc += T * e * dt;
    T *= exp(-a * dt);
    if (T < 0.02) break;
  }
  gl_FragColor = vec4(acc * uFade, (1.0 - T) * uFade);
}
`

const COMPOSITE_FRAG = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uRes;
void main() {
  gl_FragColor = texture2D(uTex, gl_FragCoord.xy / uRes);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

// ---- the photos: dots where the electron was found ----
const DOT_VERT = /* glsl */ `
attribute vec3 color;
attribute float born;
uniform float uTime;
uniform float uPx;
uniform float uSize;
varying vec3 vColor;
varying float vFlash;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float age = max(uTime - born, 0.0);
  vFlash = exp(-age * 5.0);
  vColor = color;
  gl_PointSize = clamp(uSize * (1.0 + 7.0 * vFlash) * uPx / max(-mv.z, 0.1), 1.5, 44.0);
  gl_Position = projectionMatrix * mv;
}
`
const DOT_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vFlash;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float core = exp(-d * 9.0);
  float halo = exp(-d * 2.5) * 0.35;
  gl_FragColor = vec4(vColor * (core * (1.6 + 5.0 * vFlash) + halo), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

// ---- the motes: faint sparks twinkling where the electron might be (drawn by Born's rule like the photos),
// so a cloud has depth when you stand inside it, and the whole atom shows how its electrons crowd the core
const MOTE_VERT = /* glsl */ `
attribute vec3 color;
attribute float phase;
uniform float uTime;
uniform float uPx;
uniform float uFade;
varying vec3 vColor;
varying float vGlow;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float s = 0.5 + 0.5 * sin(uTime * (0.7 + fract(phase * 7.31) * 1.6) + phase * 6.2832);
  vGlow = pow(s, 6.0) * uFade;
  vColor = color;
  gl_PointSize = clamp(0.07 * uPx / max(-mv.z, 0.1), 1.0, 14.0);
  gl_Position = projectionMatrix * mv;
}
`
const MOTE_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vGlow;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0 || vGlow < 0.01) discard;
  gl_FragColor = vec4(vColor * exp(-d * 4.0) * vGlow * 1.6, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

const blankTable = (() => {
  const t = new THREE.DataTexture(new Float32Array(4), 1, 1, THREE.RGBAFormat, THREE.FloatType)
  t.needsUpdate = true
  return t
})()

const viewDefaults = S => ({
  [`uMode${S}`]: { value: 1 },
  [`uScale${S}`]: { value: 1 },
  [`uGain${S}`]: { value: 0 },
  [`uTable${S}`]: { value: blankTable },
  [`uLogMin${S}`]: { value: -7 },
  [`uLogMax${S}`]: { value: 3 },
  [`uN${S}`]: { value: 1 },
  [`uL${S}`]: { value: 0 },
  [`uZh${S}`]: { value: 1 },
  [`uNorm${S}`]: { value: 2 },
  [`uCount${S}`]: { value: 0 },
  [`uK${S}`]: { value: new Int32Array(MAX) },
  [`uTint${S}`]: { value: Array.from({ length: MAX }, () => new THREE.Color(1, 1, 1)) },
  [`uFill${S}`]: { value: new Float32Array(MAX) },
  [`uLevel${S}`]: { value: new Float32Array(MAX).fill(1) },
  [`uPhase${S}`]: { value: 0 },
})

/** Writes a view ({ mode 0: table, logMin, logMax | mode 1: n, lq, zh, norm, orbitals [{ k, tint, fill,
 *  level }], phase }, scale, gain) into the uniforms of slot S. */
function writeView(u, S, v) {
  u[`uMode${S}`].value = v.mode
  u[`uScale${S}`].value = v.scale
  u[`uGain${S}`].value = v.gain
  if (v.mode === 0) {
    u[`uTable${S}`].value = v.table
    u[`uLogMin${S}`].value = v.logMin
    u[`uLogMax${S}`].value = v.logMax
    u[`uCount${S}`].value = 0
    return
  }
  u[`uN${S}`].value = v.n
  u[`uL${S}`].value = v.lq
  u[`uZh${S}`].value = v.zh
  u[`uNorm${S}`].value = v.norm
  u[`uCount${S}`].value = v.orbitals.length
  u[`uPhase${S}`].value = v.phase ? 1 : 0
  v.orbitals.forEach((o, i) => {
    u[`uK${S}`].value[i] = o.k
    u[`uTint${S}`].value[i].copy(o.tint)
    u[`uFill${S}`].value[i] = o.fill
    u[`uLevel${S}`].value[i] = o.level
  })
}

/** The cloud and its photos. `group` goes into the room (a sphere that shows the cloud, the dots);
 *  `render()` each frame before the room is drawn; `show(view)` blends to another view. */
export function electronCloud({ renderer, camera, light, radius = 26, center = new THREE.Vector3(), yaw = 0 }) {
  // steps along each ray: a subshell's waves cost more a step than the whole atom's table, which needs more
  // steps for its thin shells
  const steps = light ? { orbital: 48, atom: 96 } : { orbital: 120, atom: 200 }
  const share = light ? 0.42 : 0.55
  const uniforms = {
    uCenter: { value: center.clone() },
    uSteps: { value: steps.orbital },
    uRadius: { value: radius },
    uMix: { value: 0 },
    uFade: { value: 1 },
    uMist: { value: 0.022 },
    uSkin: { value: 0.42 },
    uSharp: { value: 11 },
    uAbsorb: { value: 0.05 },
    uYaw: { value: new THREE.Vector2(Math.cos(yaw), Math.sin(yaw)) },
    uPos: { value: new THREE.Color('#ffae42').multiplyScalar(1.15) },
    uNeg: { value: new THREE.Color('#3d8bff').multiplyScalar(1.25) },
    ...viewDefaults('A'),
    ...viewDefaults('B'),
  }
  const march = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 24),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: MARCH_VERT,
      fragmentShader: marchFrag(steps.atom),
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      transparent: false,
    }),
  )
  march.frustumCulled = false
  march.position.copy(center)
  march.scale.setScalar(radius)
  const cloudScene = new THREE.Scene()
  cloudScene.add(march)

  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false })
  rt.texture.minFilter = THREE.LinearFilter
  rt.texture.magFilter = THREE.LinearFilter
  rt.texture.generateMipmaps = false
  const full = new THREE.Vector2()
  const clear = new THREE.Color()

  const group = new THREE.Group()
  const composite = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      uniforms: { uTex: { value: rt.texture }, uRes: { value: new THREE.Vector2(1, 1) } },
      vertexShader: MARCH_VERT,
      fragmentShader: COMPOSITE_FRAG,
      side: THREE.BackSide,
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
  composite.position.copy(center)
  composite.renderOrder = -10
  composite.frustumCulled = false
  group.add(composite)

  // the photos
  const CAP = 6000
  const dotGeo = new THREE.BufferGeometry()
  const dotPos = new Float32Array(CAP * 3)
  const dotCol = new Float32Array(CAP * 3)
  const dotBorn = new Float32Array(CAP).fill(-1e6)
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3))
  dotGeo.setAttribute('color', new THREE.BufferAttribute(dotCol, 3))
  dotGeo.setAttribute('born', new THREE.BufferAttribute(dotBorn, 1))
  dotGeo.setDrawRange(0, 0)
  const dotMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: 600 }, uSize: { value: 0.16 } },
    vertexShader: DOT_VERT,
    fragmentShader: DOT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const dots = new THREE.Points(dotGeo, dotMat)
  dots.frustumCulled = false
  dots.position.copy(center)
  // the same turn as the cloud's (a point's room position turned back by yaw is where the march finds it)
  dots.rotation.y = yaw
  dots.renderOrder = 5
  group.add(dots)
  let dotCount = 0

  const MOTES = light ? 700 : 1800
  const moteGeo = new THREE.BufferGeometry()
  const motePos = new Float32Array(MOTES * 3)
  const moteCol = new Float32Array(MOTES * 3)
  const motePhase = new Float32Array(MOTES)
  for (let i = 0; i < MOTES; i++) motePhase[i] = Math.random()
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
  moteGeo.setAttribute('color', new THREE.BufferAttribute(moteCol, 3))
  moteGeo.setAttribute('phase', new THREE.BufferAttribute(motePhase, 1))
  moteGeo.setDrawRange(0, 0)
  const moteMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: 600 }, uFade: { value: 0 } },
    vertexShader: MOTE_VERT,
    fragmentShader: MOTE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const motes = new THREE.Points(moteGeo, moteMat)
  motes.frustumCulled = false
  motes.position.copy(center)
  motes.rotation.y = yaw
  motes.renderOrder = 4
  group.add(motes)
  let moteFill = null // the next view's sparks, put in place while they are faded out
  let moteFade = 0
  let moteGlow = 1

  let blend = null // { k } while blending the view in slot A into the one in slot B
  let now = 0
  let current = null // the view in slot A
  let next = null // the view in slot B while blending
  // the march sphere: as big as the views shown need (view.cut, metres), never more than `radius`
  const fit = (...views) => {
    const shown = views.filter(Boolean)
    const r = Math.min(radius, Math.max(1, ...shown.map(v => v.cut ?? radius)))
    march.scale.setScalar(r)
    uniforms.uRadius.value = r
    uniforms.uSteps.value = shown.some(v => v.mode === 0) ? steps.atom : steps.orbital
  }

  return {
    group,
    uniforms,
    get view() {
      return next ?? current
    },
    /** Show a view; `instant` skips the blend. */
    show(view, { instant = false } = {}) {
      dots.scale.setScalar(view.scale)
      if (instant || !current) {
        writeView(uniforms, 'A', view)
        uniforms.uMix.value = 0
        blend = null
        current = view
        next = null
      } else {
        // a blend under way is cut short: whichever of its two views shows more becomes the start
        if (blend && uniforms.uMix.value > 0.5) {
          writeView(uniforms, 'A', next)
          current = next
        }
        writeView(uniforms, 'B', view)
        uniforms.uMix.value = 0
        blend = { k: 0 }
        next = view
      }
      fit(current, next)
    },
    /** The view shown changed its scale, gain or reach in place (the zoom): written at once. */
    retune(view) {
      const S = blend && view === next ? 'B' : 'A'
      uniforms[`uScale${S}`].value = view.scale
      uniforms[`uGain${S}`].value = view.gain
      dots.scale.setScalar(view.scale)
      motes.scale.setScalar(view.scale)
      fit(current, next)
    },
    /** Compile the march's shader ahead (as it is drawn: into the smaller picture), so stepping in does not
     *  stall on it. */
    async warm() {
      const prev = renderer.getRenderTarget()
      renderer.setRenderTarget(rt)
      try {
        if (renderer.compileAsync) await renderer.compileAsync(cloudScene, camera)
        else renderer.compile(cloudScene, camera)
      } finally {
        renderer.setRenderTarget(prev)
      }
    },
    /** The sparks for a view: `sample(i)` gives the i-th { p (a0, room axes), color }. They fade out, change,
     *  and fade back in. `glow` scales their light (the whole atom's many electrons want fewer each). */
    setMotes(sample, scale, glow = 1) {
      moteFill = { sample, scale, glow }
    },
    /** A photo: a dot at p (in a0 from the nucleus, on the room's axes: the dots take the view's scale) in a
     *  colour, with its flash or (a state coming back) without. */
    photo(p, color, flash = true) {
      const i = dotCount % CAP
      dotPos.set([p.x, p.y, p.z], i * 3)
      dotCol.set([color.r, color.g, color.b], i * 3)
      dotBorn[i] = flash ? now : -1e6
      dotCount++
      dotGeo.setDrawRange(0, Math.min(dotCount, CAP))
      for (const a of ['position', 'color', 'born']) {
        const attr = dotGeo.getAttribute(a)
        attr.needsUpdate = true
      }
    },
    clearPhotos() {
      dotCount = 0
      dotGeo.setDrawRange(0, 0)
    },
    get photos() {
      return dotCount
    },
    setFade(f) {
      uniforms.uFade.value = f
    },
    update(dt, t) {
      now = t
      dotMat.uniforms.uTime.value = t
      moteMat.uniforms.uTime.value = t
      // the sparks: out, refilled for the new view, back in
      moteFade = moteFill ? Math.max(0, moteFade - dt * 3) : Math.min(1, moteFade + dt * 1.2)
      if (moteFill && moteFade <= 0) {
        for (let i = 0; i < MOTES; i++) {
          const { p, color } = moteFill.sample(i)
          motePos.set([p.x, p.y, p.z], i * 3)
          moteCol.set([color.r, color.g, color.b], i * 3)
        }
        moteGeo.getAttribute('position').needsUpdate = true
        moteGeo.getAttribute('color').needsUpdate = true
        moteGeo.setDrawRange(0, MOTES)
        motes.scale.setScalar(moteFill.scale)
        moteGlow = moteFill.glow
        moteFill = null
      }
      moteMat.uniforms.uFade.value = moteFade * moteGlow * uniforms.uFade.value
      if (blend) {
        blend.k = Math.min(1, blend.k + dt / 0.85)
        const e = blend.k * blend.k * (3 - 2 * blend.k)
        uniforms.uMix.value = e
        if (blend.k >= 1) {
          writeView(uniforms, 'A', next)
          uniforms.uMix.value = 0
          current = next
          next = null
          blend = null
          fit(current)
        }
      }
    },
    /** Draw the cloud into its smaller picture (call before the room is drawn). */
    render() {
      renderer.getDrawingBufferSize(full)
      const w = Math.max(2, Math.round(full.x * share))
      const h = Math.max(2, Math.round(full.y * share))
      if (rt.width !== w || rt.height !== h) rt.setSize(w, h)
      composite.material.uniforms.uRes.value.copy(full)
      dotMat.uniforms.uPx.value = full.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))
      moteMat.uniforms.uPx.value = dotMat.uniforms.uPx.value
      const prev = renderer.getRenderTarget()
      const auto = renderer.autoClear
      renderer.getClearColor(clear)
      const alpha = renderer.getClearAlpha()
      renderer.setRenderTarget(rt)
      renderer.setClearColor(0x000000, 0)
      renderer.autoClear = true
      renderer.render(cloudScene, camera)
      renderer.setRenderTarget(prev)
      renderer.setClearColor(clear, alpha)
      renderer.autoClear = auto
    },
    dispose() {
      rt.dispose()
      march.geometry.dispose()
      march.material.dispose()
      composite.geometry.dispose()
      composite.material.dispose()
      dotGeo.dispose()
      dotMat.dispose()
      moteGeo.dispose()
      moteMat.dispose()
    },
  }
}
