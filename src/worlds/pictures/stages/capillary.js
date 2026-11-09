// A stage for picture rooms (docs/knowledge/picture-rooms.md): inside a glass capillary on a laboratory
// bench, the visitor shrunk until the hair-thin tube is a glass tunnel 8 m across. Radon's `glow` room was
// the first (Gray and Ramsay's capillary of 1909, about 1/20 mm across); a later room can freeze another gas
// in it (krypton, xenon). Along z: behind the visitor (+z) the tube is closed by the silver face of a
// mercury thread, a convex wall that `mercury.setPush(d)` moves forward as it presses; ahead (-z) the tube
// narrows in a cone (the capillary's drawn end) to a small rounded tip, where a condensed gas collects.
// A walkway of dark glass plates runs along the floor. Round the front part, a cold jacket: a wider glass
// cylinder that a bath fills (`bath.set({ fill, air, boil })`: an alcohol bath, or liquid air, pale blue,
// boiling); mist creeps over it. Above the tip, outside, the microscope's brass objective, its lens a round
// skylight with the lamplight in it. Beyond, the laboratory at night, far and out of focus.
// The glass is one shader: thick at grazing angles, and glowing near the tip when the gas there makes it
// phosphoresce (`glass.setGlow({ a, b, mix, k, z, fall })`: colours, strength, where the glow starts and how
// fast it fades back along the tube); `glass.setTint(c)` changes the glass, `glass.sweep()` runs a ring of
// light along it (a new glass put in).
// Exports `capillaryStage({ light, R, axisY, backZ, tipZ, coneLen, tipR, jacket })` -> { group, solids,
// env, cameraBounds, cameraClear, glass, bath, mercury, objective, mats, shine, R, axisY, halfW, backZ,
// tipZ, coneLen, tipR, radiusAt(z), update(t, dt), dispose }, and `CAPILLARY` (the default sizes).
import * as THREE from 'three'
import { canvasTex, clamp } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'
import { glowTexture } from './space.js'

const TAU = Math.PI * 2
export const CAPILLARY = { R: 4, axisY: 2.4, backZ: 8, tipZ: -11, coneLen: 6, tipR: 0.9, jacket: { z0: -4.4, R: 6.2 } }

const GLASS_VERT = /* glsl */ `
  varying vec3 vW; varying vec3 vN;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`

// the tube's glass: faint face on, bright at grazing angles (a thick wall), and the phosphorescence near the
// tip in one colour or two (soda glass squeezed hard: blue and pink in bands), with a speckle of tiny flashes
const GLASS_FRAG = /* glsl */ `
  uniform vec3 uTint; uniform vec3 uA; uniform vec3 uB; uniform float uMix; uniform float uK; uniform float uZ;
  uniform float uFall; uniform float uAxisY; uniform float uTime; uniform float uSweepZ; uniform float uSweepK;
  uniform float uBase;
  varying vec3 vW; varying vec3 vN;
  float h3(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
  void main() {
    vec3 V = normalize(cameraPosition - vW);
    float ndv = clamp(abs(dot(normalize(vN), V)), 0.0, 1.0);
    float fr = pow(clamp(1.0 - ndv, 0.0, 1.0), 3.0);
    // thick glass: pale face on, its edges seen at a slant greener and brighter
    vec3 edge = mix(uTint, vec3(0.62, 0.9, 0.84), 0.45);
    vec3 col = mix(uTint, edge, fr) * (0.07 + 0.95 * fr) * uBase;
    float a = 0.05 + 0.62 * fr;
    float ang = atan(vW.y - uAxisY, vW.x);
    // the lamp's light caught along the curve of the tube: two long soft stripes, and a fainter low one
    float stripe = exp(-pow((ang - 1.12) * 7.0, 2.0)) + 0.55 * exp(-pow((ang - 2.05) * 10.0, 2.0)) + 0.25 * exp(-pow((ang + 0.35) * 9.0, 2.0));
    stripe *= 0.75 + 0.25 * sin(vW.z * 0.9);
    col += vec3(0.82, 0.9, 1.0) * stripe * 0.32 * uBase;
    a = max(a, stripe * 0.3 * uBase);
    float d = max(0.0, vW.z - uZ);
    float g = uK * exp(-d * uFall);
    float band = 0.5 + 0.5 * sin(vW.z * 1.7 + ang * 3.0 + uTime * 0.9);
    vec3 gc = mix(uA, uB, uMix * smoothstep(0.25, 0.75, band));
    // tiny flashes in the glass where the radiation strikes it
    vec3 q = vW * 22.0;
    vec3 cell = floor(q);
    float dot0 = 1.0 - smoothstep(0.15, 0.4, length(fract(q) - 0.5));
    float flick = step(0.9965, h3(cell + floor(uTime * 7.0))) * dot0;
    col += gc * g * (0.55 + 0.7 * fr) + gc * flick * g * 3.0;
    a = max(a, clamp(g * 0.42 + flick * g, 0.0, 0.75));
    // a ring of light running along the tube (a new glass)
    float s = uSweepK * exp(-pow((vW.z - uSweepZ) * 1.6, 2.0));
    col += vec3(0.85, 0.95, 1.0) * s;
    a = max(a, clamp(s * 0.6, 0.0, 0.8));
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }`

// the jacket round the front of the tube, seen from inside through the bath: below the bath's level the
// liquid's colour, a bright line at its surface, frost speckles on the cold glass above it
const BATH_FRAG = /* glsl */ `
  uniform vec3 uCol; uniform float uLevel; uniform float uFill; uniform float uFrost; uniform float uTime;
  varying vec3 vW; varying vec3 vN;
  void main() {
    vec3 V = normalize(cameraPosition - vW);
    float ndv = clamp(abs(dot(normalize(vN), V)), 0.0, 1.0);
    float fr = pow(clamp(1.0 - ndv, 0.0, 1.0), 2.5);
    float under = smoothstep(uLevel + 0.06, uLevel - 0.06, vW.y) * step(0.001, uFill);
    vec3 col = vec3(0.55, 0.62, 0.78) * (0.04 + 0.35 * fr);
    float a = 0.03 + 0.28 * fr;
    float wave = sin(vW.z * 2.3 + uTime * 1.4) * 0.05 + sin(vW.x * 1.7 - uTime) * 0.04;
    col = mix(col, uCol * (0.38 + 0.4 * fr), under);
    a = mix(a, 0.3 + 0.3 * fr, under);
    float line = exp(-pow((vW.y - uLevel - wave) * 9.0, 2.0)) * step(0.001, uFill) * step(uLevel, 30.0);
    col += uCol * line * 0.45;
    a = max(a, line * 0.6);
    // frost on the cold glass above the bath: a soft white haze, thicker at a slant
    float frost = uFrost * (1.0 - under) * (0.12 + 0.3 * fr);
    col += vec3(0.8, 0.88, 1.0) * frost;
    a = max(a, frost * 0.8);
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }`

// the laboratory far round the bench: a dark night-blue, a warm glow low down, out of focus
const SKY_FRAG = /* glsl */ `
  varying vec3 vW; varying vec3 vN;
  void main() {
    vec3 d = normalize(vW - cameraPosition);
    float y = d.y;
    vec3 top = vec3(0.025, 0.025, 0.065);
    vec3 mid = vec3(0.075, 0.06, 0.13);
    vec3 warm = vec3(0.2, 0.11, 0.09);
    vec3 low = vec3(0.045, 0.03, 0.025);
    vec3 col = mix(mid, top, smoothstep(0.0, 0.65, y));
    col = mix(col, warm, exp(-pow((y + 0.08) * 6.0, 2.0)) * 0.55);
    col = mix(col, low, smoothstep(-0.05, -0.35, y));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

/** What metal reflects in here: the dark laboratory, warm lamplight and the tube's pale glass. */
function shineTex() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#2a2440')
    grd.addColorStop(0.4, '#5a4a66')
    grd.addColorStop(0.5, '#9a8a8c')
    grd.addColorStop(0.62, '#3a2c30')
    grd.addColorStop(1, '#141018')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (const [x, y, r, c] of [[40, 34, 16, 'rgba(255,214,160,0.45)'], [150, 28, 10, 'rgba(255,230,200,0.4)'], [210, 44, 12, 'rgba(190,170,255,0.3)'], [100, 70, 20, 'rgba(160,210,255,0.2)']]) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r)
      gr.addColorStop(0, c)
      gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/** What the mercury's face reflects: a bright, silvery room (it must read as a shining metal wall). */
function silverTex() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#8e93a6')
    grd.addColorStop(0.38, '#d9dde8')
    grd.addColorStop(0.5, '#f4f6fb')
    grd.addColorStop(0.58, '#a9a2ac')
    grd.addColorStop(1, '#3c3640')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (const [x, y, r, c] of [[60, 40, 22, 'rgba(255,226,180,0.8)'], [180, 36, 16, 'rgba(255,240,220,0.7)'], [120, 76, 26, 'rgba(180,170,255,0.35)']]) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r)
      gr.addColorStop(0, c)
      gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/** The walkway's plates: dark glass in a steel grid, seams every metre, UVs in metres. */
function plateTex(light) {
  const N = light ? 256 : 512
  const t = canvasTex(N, N, (g, w) => {
    g.fillStyle = '#4c5874'
    g.fillRect(0, 0, w, w)
    let s = 11
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(${rnd() > 0.5 ? '140,160,200' : '30,36,56'},${0.05 + rnd() * 0.06})`
      g.fillRect(rnd() * w, rnd() * w, 2 + rnd() * 30, 1 + rnd() * 3)
    }
    g.strokeStyle = '#2b3248'
    g.lineWidth = w / 64
    g.strokeRect(0, 0, w, w)
    g.strokeStyle = 'rgba(170,200,255,0.25)'
    g.lineWidth = w / 256
    g.strokeRect(w / 64, w / 64, w - w / 32, w - w / 32)
  }, { repeat: true })
  return t
}

export function capillaryStage({
  light = false,
  R = CAPILLARY.R,
  axisY = CAPILLARY.axisY,
  backZ = CAPILLARY.backZ,
  tipZ = CAPILLARY.tipZ,
  coneLen = CAPILLARY.coneLen,
  tipR = CAPILLARY.tipR,
  jacket = CAPILLARY.jacket,
  tint = '#dceeff',
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const halfW = Math.sqrt(R * R - axisY * axisY)
  const segs = light ? 64 : 128
  const radiusAt = z => (z >= tipZ ? R : z >= tipZ - coneLen ? R - ((R - tipR) * (tipZ - z)) / coneLen : Math.sqrt(Math.max(0, tipR * tipR - (tipZ - coneLen - z) ** 2)))
  const shine = shineTex()
  textures.push(shine)
  const glow = glowTexture(128)
  textures.push(glow)
  const mats = {
    brass: new THREE.MeshStandardMaterial({ color: '#c99a48', roughness: 0.32, metalness: 0.9, envMap: shine, envMapIntensity: 1.1 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b8bec8', roughness: 0.3, metalness: 0.85, envMap: shine, envMapIntensity: 1.0 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1c1e26', roughness: 0.55, metalness: 0.2 }),
    wood: new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.7 }),
    navy: new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.4, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#2a2224', roughness: 0.85 }),
  }

  // ---- the laboratory round the bench, far and out of focus ----
  const skyGeo = new THREE.SphereGeometry(300, 32, 16)
  geos.push(skyGeo)
  const sky = new THREE.Mesh(skyGeo, new THREE.ShaderMaterial({ vertexShader: GLASS_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false }))
  sky.renderOrder = -20
  sky.frustumCulled = false
  group.add(sky)
  const bokeh = (x, y, z, size, color, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.position.set(x, y, z)
    s.scale.setScalar(size)
    s.renderOrder = -15
    group.add(s)
    return s
  }
  {
    let s = 1909
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    const cols = ['#ffb070', '#ffcf8a', '#9a7cff', '#7fb2e8', '#ff8c42']
    for (let i = 0; i < (light ? 10 : 18); i++) {
      const a = rnd() * TAU
      const d = 150 + rnd() * 80
      bokeh(Math.cos(a) * d, -10 + rnd() * 70, Math.sin(a) * d, 30 + rnd() * 50, cols[i % cols.length], 0.08 + rnd() * 0.12)
    }
  }
  // the bench far below, dark wood
  const benchGeo = new THREE.PlaneGeometry(900, 900)
  geos.push(benchGeo)
  const bench = new THREE.Mesh(benchGeo, new THREE.MeshStandardMaterial({ color: '#3a2618', roughness: 0.8 }))
  bench.rotation.x = -Math.PI / 2
  bench.position.y = -36
  group.add(bench)

  // ---- the glass: the tube, its cone and tip ----
  const glassUniforms = {
    uTint: { value: new THREE.Color(tint) },
    uA: { value: new THREE.Color('#5a9cff') },
    uB: { value: new THREE.Color('#ff7ad0') },
    uMix: { value: 0 },
    uK: { value: 0 },
    uZ: { value: tipZ },
    uFall: { value: 0.25 },
    uAxisY: { value: axisY },
    uTime: { value: 0 },
    uSweepZ: { value: 999 },
    uSweepK: { value: 0 },
    uBase: { value: 1 },
  }
  const glassMat = new THREE.ShaderMaterial({ uniforms: glassUniforms, vertexShader: GLASS_VERT, fragmentShader: GLASS_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  const tubeLen = backZ + 4 - tipZ
  const tubeGeo = new THREE.CylinderGeometry(R, R, tubeLen, segs, 1, true).rotateX(Math.PI / 2).translate(0, axisY, (backZ + 4 + tipZ) / 2)
  const coneGeo = new THREE.CylinderGeometry(tipR, R, coneLen, segs, 1, true).rotateX(-Math.PI / 2).translate(0, axisY, tipZ - coneLen / 2)
  const capGeo = new THREE.SphereGeometry(tipR, 48, 16, 0, TAU, 0, Math.PI / 2).rotateX(-Math.PI / 2).translate(0, axisY, tipZ - coneLen)
  geos.push(tubeGeo, coneGeo, capGeo)
  for (const g of [tubeGeo, coneGeo, capGeo]) {
    const m = new THREE.Mesh(g, glassMat)
    m.renderOrder = -1
    m.frustumCulled = false
    group.add(m)
  }
  // a second, outer skin: the wall is thick (computers only)
  if (!light) {
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.22, R + 0.22, tubeLen, segs, 1, true).rotateX(Math.PI / 2).translate(0, axisY, (backZ + 4 + tipZ) / 2), glassMat)
    geos.push(outer.geometry)
    outer.renderOrder = -2
    outer.frustumCulled = false
    group.add(outer)
  }
  // faint drawing lines along the tube, the way thermometer tubing is drawn (regular bore)
  {
    const pts = []
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * 0.18 + (i / 10) * Math.PI * 0.64
      const y = axisY + Math.sin(a) * (R - 0.02)
      const x = Math.cos(a) * (R - 0.02)
      pts.push(new THREE.Vector3(x, y, tipZ), new THREE.Vector3(x, y, backZ + 3))
    }
    const lg = new THREE.BufferGeometry().setFromPoints(pts)
    geos.push(lg)
    const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: '#9fc4ff', transparent: true, opacity: 0.08, depthWrite: false }))
    lines.renderOrder = -1
    group.add(lines)
  }

  // ---- the walkway: dark glass plates in a steel grid, a thin light along each edge ----
  const walkZ0 = tipZ + 0.1
  const walkZ1 = backZ - 0.2
  const plates = plateTex(light)
  textures.push(plates)
  const walkW = 2 * halfW - 0.06
  plates.repeat.set(walkW / 1.2, (walkZ1 - walkZ0) / 1.2)
  const floorGeo = new THREE.BoxGeometry(walkW, 0.1, walkZ1 - walkZ0)
  geos.push(floorGeo)
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: plates, roughness: 0.28, metalness: 0.25, envMap: shine, envMapIntensity: 0.6 }))
  floor.position.set(0, -0.05, (walkZ0 + walkZ1) / 2)
  group.add(floor)
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#9fd8ff', emissive: '#9fd8ff', emissiveIntensity: 0.55, roughness: 0.4 })
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, walkZ1 - walkZ0), edgeMat)
    geos.push(e.geometry)
    e.position.set(s * (halfW - 0.12), 0.02, (walkZ0 + walkZ1) / 2)
    group.add(e)
  }
  // the walkway's end over the cone: a rail of light
  const rail = new THREE.Group()
  const railBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, walkW - 0.4, 12).rotateZ(Math.PI / 2), edgeMat)
  geos.push(railBar.geometry)
  railBar.position.set(0, 0.95, walkZ0 + 0.25)
  rail.add(railBar)
  for (const x of [-(walkW / 2 - 0.3), -walkW / 6, walkW / 6, walkW / 2 - 0.3]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.95, 8), mats.dark)
    geos.push(post.geometry)
    post.position.set(x, 0.475, walkZ0 + 0.25)
    rail.add(post)
  }
  group.add(rail)

  // ---- the mercury thread: a convex silver face filling the tube behind the visitor ----
  const mercury = new THREE.Group()
  group.add(mercury)
  const Rs = R * 1.75
  const theta = Math.asin((R - 0.03) / Rs)
  const capH = Rs * (1 - Math.cos(theta))
  const silver = silverTex()
  textures.push(silver)
  const hgMat = new THREE.MeshStandardMaterial({ color: '#dfe3ea', roughness: 0.08, metalness: 1, envMap: silver, envMapIntensity: 0.85 })
  const hgCap = new THREE.Mesh(new THREE.SphereGeometry(Rs, 72, 24, 0, TAU, 0, theta).rotateX(-Math.PI / 2), hgMat)
  geos.push(hgCap.geometry)
  hgCap.position.set(0, axisY, backZ - capH + Rs)
  mercury.add(hgCap)
  const hgBody = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.03, R - 0.03, 3.5, 72, 1, true).rotateX(Math.PI / 2), hgMat)
  geos.push(hgBody.geometry)
  hgBody.position.set(0, axisY, backZ + 1.75)
  mercury.add(hgBody)

  // ---- the cold jacket round the front of the tube, and its bath ----
  const RJ = jacket.R
  const jz0 = jacket.z0
  const jz1 = tipZ - coneLen - tipR - 1.0
  const bathUniforms = {
    uCol: { value: new THREE.Color('#8fc8ff') },
    uLevel: { value: -99 },
    uFill: { value: 0 },
    uFrost: { value: 0 },
    uTime: { value: 0 },
  }
  const bathMat = new THREE.ShaderMaterial({ uniforms: bathUniforms, vertexShader: GLASS_VERT, fragmentShader: BATH_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  const jGeo = new THREE.CylinderGeometry(RJ, RJ, jz0 - jz1, segs, 1, true).rotateX(Math.PI / 2).translate(0, axisY, (jz0 + jz1) / 2)
  const jEnd = new THREE.CircleGeometry(RJ, segs).translate(0, axisY, jz1)
  geos.push(jGeo, jEnd)
  for (const g of [jGeo, jEnd]) {
    const m = new THREE.Mesh(g, bathMat)
    m.renderOrder = -4
    m.frustumCulled = false
    group.add(m)
  }
  // the collar where the jacket meets the tube: a dark rubber ring and a brass rim
  const collar = new THREE.Mesh(new THREE.RingGeometry(R + 0.05, RJ + 0.12, segs), new THREE.MeshStandardMaterial({ color: '#3a2c30', roughness: 0.8, side: THREE.DoubleSide, transparent: true, opacity: 0.45, depthWrite: false }))
  geos.push(collar.geometry)
  collar.position.set(0, axisY, jz0)
  collar.renderOrder = -3
  group.add(collar)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RJ + 0.1, 0.09, 10, segs), mats.brass)
  geos.push(rim.geometry)
  rim.position.set(0, axisY, jz0)
  group.add(rim)
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(R + 0.12, 0.08, 10, segs), mats.brass)
  geos.push(ring2.geometry)
  ring2.position.set(0, axisY, jz0)
  group.add(ring2)

  // bubbles rising in the bath when it boils (liquid air)
  const NB = light ? 70 : 200
  const bPos = new Float32Array(NB * 3)
  const bSeed = []
  for (let i = 0; i < NB; i++) {
    const z = jz0 - 0.4 - Math.random() * (jz0 - jz1 - 1.2)
    const r0 = radiusAt(z) + 0.3
    bSeed.push({ z, a: Math.random() * TAU, r: r0 + Math.random() * (RJ - 0.3 - r0), v: 0.6 + Math.random() * 0.9, ph: Math.random() * 10 })
  }
  const bGeo = new THREE.BufferGeometry()
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3))
  geos.push(bGeo)
  const bMat = new THREE.PointsMaterial({ color: '#bfe0ff', size: 0.12, map: glow, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const bubbles = new THREE.Points(bGeo, bMat)
  bubbles.frustumCulled = false
  bubbles.renderOrder = -3
  bubbles.raycast = () => {}
  group.add(bubbles)
  // cold mist creeping over the jacket's top
  const mist = []
  for (let i = 0; i < (light ? 6 : 14); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#dfeaff', transparent: true, opacity: 0, depthWrite: false }))
    s.userData = { z: jz0 - Math.random() * (jz0 - jz1), a: -0.6 + Math.random() * 1.2 + Math.PI / 2, ph: Math.random() * 20, sz: 2.2 + Math.random() * 2.5 }
    s.renderOrder = -3
    group.add(s)
    mist.push(s)
  }

  // ---- the microscope's objective above the tip, outside: a round skylight with the lamplight in it ----
  const objective = new THREE.Group()
  objective.position.set(0, axisY + RJ + 2.6, tipZ - 2.2)
  group.add(objective)
  {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 2.6, 48), mats.brass)
    barrel.position.y = 1.3
    const knurl = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.78, 0.5, 48), mats.dark)
    knurl.position.y = 0.6
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.5, 48), mats.brass)
    nose.position.y = -0.2
    const lens = new THREE.Mesh(new THREE.CircleGeometry(1.15, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe2b0').multiplyScalar(1.05), toneMapped: true }))
    lens.rotation.x = Math.PI / 2
    lens.position.y = -0.46
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.06, 8, 48), mats.dark)
    lensRing.rotation.x = Math.PI / 2
    lensRing.position.y = -0.45
    for (const m of [barrel, knurl, nose, lens, lensRing]) {
      geos.push(m.geometry)
      objective.add(m)
    }
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffcf8a', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.position.y = -0.9
    halo.scale.setScalar(4.5)
    objective.add(halo)
  }

  // ---- light: a dim night fill, the lamplight from above through the microscope ----
  group.add(new THREE.HemisphereLight('#9aa6d8', '#2a1c22', 0.55))
  const lamp = new THREE.DirectionalLight('#ffdcb0', 0.6)
  lamp.position.set(2, 14, tipZ + 2)
  lamp.target.position.set(0, 0, tipZ + 4)
  group.add(lamp, lamp.target)
  const back = new THREE.DirectionalLight('#8fa4ff', 0.25)
  back.position.set(-4, 6, backZ + 10)
  group.add(back)

  // ---- the walls to walk inside, the camera kept inside the glass ----
  const walkLen = walkZ1 - walkZ0
  const solids = [
    box(-(halfW - 0.05), (walkZ0 + walkZ1) / 2, 0.3, walkLen + 2),
    box(halfW - 0.05, (walkZ0 + walkZ1) / 2, 0.3, walkLen + 2),
    box(0, walkZ0 + 0.1, 2 * halfW, 0.5), // the rail over the cone
    box(0, backZ - capH - 0.25, 2 * halfW, 0.6), // the mercury
  ]
  const camTo = new THREE.Vector3()
  let sweepT = 99
  let sweepFrom = backZ

  return {
    group,
    solids,
    R,
    axisY,
    halfW,
    backZ,
    tipZ,
    coneLen,
    tipR,
    radiusAt,
    mats,
    shine,
    glowTexture: glow,
    objective,
    env: {
      background: new THREE.Color('#120d20'),
      fog: new THREE.FogExp2('#150f26', 0.004),
      exposure: 1.0,
      envIntensity: 0.18,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.8 },
      fov: 62,
      far: 800,
    },
    cameraBounds: { minX: -halfW + 0.45, maxX: halfW - 0.45, minY: 0.35, maxY: axisY + R - 1.0, minZ: walkZ0 + 0.3, maxZ: backZ - capH - 0.6 },
    /** The share of the way from the player to the camera that stays inside the glass (with a margin). */
    cameraClear(from, to) {
      const n = 12
      for (let i = 1; i <= n; i++) {
        camTo.lerpVectors(from, to, i / n)
        if (Math.hypot(camTo.x, camTo.y - axisY) > R - 0.6) return (i - 1) / n
      }
      return 1
    },
    glass: {
      /** The glow near the tip: colours a (and b, mixed in bands by `mix`), strength k, starting at z
       *  (full where the glass lies beyond z, toward the tip) and fading by `fall` a metre back along it. */
      setGlow({ a, b, mix, k, z, fall }) {
        if (a) glassUniforms.uA.value.copy(a)
        if (b) glassUniforms.uB.value.copy(b)
        if (mix != null) glassUniforms.uMix.value = mix
        if (k != null) glassUniforms.uK.value = k
        if (z != null) glassUniforms.uZ.value = z
        if (fall != null) glassUniforms.uFall.value = fall
      },
      setTint(c) {
        glassUniforms.uTint.value.set(c)
      },
      /** A ring of light runs along the tube from the tip back (a new glass put in). */
      sweep(from = tipZ - coneLen) {
        sweepT = 0
        sweepFrom = from
      },
      uniforms: glassUniforms,
    },
    bath: {
      /** fill: how full the jacket is (0 to 1); air: liquid air rather than a cold alcohol bath (0 to 1);
       *  boil: bubbles (0 to 1); frost on the jacket's glass above the bath (0 to 1). */
      set({ fill, air, boil, frost }) {
        if (fill != null) {
          bathUniforms.uFill.value = fill
          bathUniforms.uLevel.value = fill <= 0.001 ? -99 : axisY - RJ + fill * (2 * RJ - 1.1)
        }
        if (air != null) bathUniforms.uCol.value.set('#a9b6c8').lerp(new THREE.Color('#7fc0ff'), clamp(air))
        if (boil != null) bMat.opacity = clamp(boil) * 0.6
        if (frost != null) bathUniforms.uFrost.value = clamp(frost)
      },
      get level() {
        return bathUniforms.uLevel.value
      },
    },
    mercury: {
      group: mercury,
      /** The mercury pressed forward (toward the tip) by d metres. */
      setPush(d) {
        mercury.position.z = -d
      },
    },
    update(t, dt = 0.016) {
      glassUniforms.uTime.value = t
      bathUniforms.uTime.value = t
      sweepT += dt
      glassUniforms.uSweepK.value = sweepT < 2.2 ? Math.sin(Math.PI * clamp(sweepT / 2.2)) * 1.1 : 0
      glassUniforms.uSweepZ.value = sweepFrom + (backZ - sweepFrom) * clamp(sweepT / 2.2)
      // the bubbles rise below the bath's level and start again at the bottom
      const level = bathUniforms.uLevel.value
      const boiling = bMat.opacity > 0.01
      for (let i = 0; i < NB; i++) {
        const b = bSeed[i]
        if (!boiling) {
          bPos[i * 3 + 1] = -99
          continue
        }
        const span = Math.min(level, axisY + RJ) - (axisY - RJ + 0.4)
        const y = axisY - RJ + 0.4 + ((t * b.v + b.ph) % Math.max(0.5, span))
        const a = b.a + Math.sin(t * 0.7 + b.ph) * 0.05
        const r = b.r + Math.sin(t * 3 + b.ph) * 0.06
        // the bubbles keep to the jacket's annulus at that height
        const dy = y - axisY
        const rx = Math.sqrt(Math.max(0, r * r - dy * dy))
        bPos[i * 3] = Math.cos(a) > 0 ? rx : -rx
        bPos[i * 3 + 1] = y > level ? -99 : y
        bPos[i * 3 + 2] = b.z
      }
      bGeo.attributes.position.needsUpdate = true
      // the mist drifts slowly back along the jacket's top and fades
      const cold = bathUniforms.uFill.value
      for (const s of mist) {
        const u = s.userData
        const k = ((t * 0.05 + u.ph) % 1)
        s.position.set(Math.cos(u.a) * (RJ + 0.4), axisY + Math.sin(u.a) * (RJ + 0.4) + k * 0.8, u.z + k * 2.5)
        s.scale.setScalar(u.sz * (0.7 + k * 0.6))
        s.material.opacity = cold * 0.09 * Math.sin(Math.PI * k)
      }
    },
    dispose() {
      textures.forEach(tx => tx.dispose())
      geos.forEach(g => g.dispose())
      glassMat.dispose()
      bathMat.dispose()
    },
  }
}
