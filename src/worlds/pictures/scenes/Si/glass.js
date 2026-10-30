// Silicon's picture "How does sand turn into glass?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into a glassblower's workshop at night (stages/workshop.js). The round brick furnace of the
// picture glows at the back with a gob of molten glass on a blowpipe in front of its mouth; the heap of
// sand is on the left, the shelf of glass on the right, with the lens over it showing glass's jumbled
// network of silicon and oxygen. Three things to do:
// - the melting pot: sand alone stays sand at the furnace's 1500 °C (pure silica needs about 1700 °C), soda
//   melts it with a fizz of CO2, limestone makes the glass last; a dial shows the temperature;
// - the blowpipe: blow the gob into a bubble, then a bottle or a vase, watch it cool from orange through
//   red to clear and join the shelf, which keeps what visitors made;
// - the light bench: a lamp shone at a heap of sand (white, nothing passes), through a pane (straight on to
//   the card), into the pane's edge (green, the iron) and into a coil of glass fibre (round the bends).
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { workshopStage } from '../../stages/workshop.js'
import { ease, motes } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { GLASS_WORDS } from './glass.words.js'

export const WORDS = GLASS_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- where things stand (metres; the spawn at z = 4.6 looks along -z, as into the picture) ----
const FURNACE = { x: 0, z: -5.6, w: 3.2, h: 3.6, d: 2.4, mouthY: 1.35, mouthR: 0.58 }
const FRONT = FURNACE.z + FURNACE.d / 2
// the blowpipe lies along the furnace's face, right of its mouth, so the gob glows against the brick
const PIPE = { tip: new THREE.Vector3(1.62, 1.2, -3.78), end: new THREE.Vector3(3.15, 1.3, -3.3) }
const KILN = { x: -3.2, z: -3.0, r: 0.78, h: 0.6 }
const GAUGE = { x: -2.05, z: -3.55, y: 1.3, r: 0.3 }
const BINS = { z: -4.95, xs: [-4.9, -3.9, -2.9], w: 0.8, h: 0.55, d: 0.6 }
const HEAP = { x: -5.25, z: -6.95 }
const SHELF = { z: -8.24, low: 1.0, high: 1.75, lowX: [2.2, 6.7], highX: [3.7, 6.7] }
const LENS = { x: 2.95, y: 2.75, z: -7.98, r: 0.62 }
const BENCH = { x0: 4.5, x1: 6.6, z0: -1.9, z1: 1.9, top: 0.9 }
const LAMP = { x: 6.1, z: 1.6, y: 1.28 }
const SAND = { x: 6.15, z: -0.2, r: 0.33 }
const PANE = { x: 5.42, z: -0.1, w: 0.74, h: 0.58, t: 0.026 }
const FIBRE = { x: 4.8, inZ: 0.35, cz: -0.45, outZ: -1.05, r: 0.22 }
const CARD = { z: -1.55, x0: 4.6, x1: 6.5, h: 0.95 }

// ---- the colour of glowing heat: nothing below about 450 °C, dull red near 600, orange at 1000,
//      yellow-white at 1500 (above 1, so the bloom takes it) ----
const GLOW = [[450, 0, '#4a0800'], [600, 0.6, '#b81e06'], [800, 0.85, '#e83a0c'], [1000, 1.0, '#ff6a1c'], [1200, 1.25, '#ff9030'], [1500, 1.7, '#ffc068']].map(([T, k, c]) => ({ T, k, c: new THREE.Color(c) }))
function glowAt(T, out = new THREE.Color()) {
  if (T <= GLOW[0].T) return out.setRGB(0, 0, 0)
  for (let i = 1; i < GLOW.length; i++) {
    const a = GLOW[i - 1]
    const b = GLOW[i]
    if (T <= b.T || i === GLOW.length - 1) {
      const f = clamp((T - a.T) / (b.T - a.T))
      return out.copy(a.c).lerp(b.c, f).multiplyScalar(lerp(a.k, b.k, f))
    }
  }
  return out
}

// ---- glass shapes, as lathe profiles (radius, height) from the far end to the neck on the pipe; every
//      shape has the same number of points, so one turns into the next ----
const N = 26
const SEG = 32
function resample(pts) {
  const seg = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    seg.push(d)
    total += d
  }
  const out = []
  for (let k = 0; k < N; k++) {
    let s = (k / (N - 1)) * total
    let i = 0
    while (i < seg.length - 1 && s > seg[i]) {
      s -= seg[i]
      i++
    }
    const f = seg[i] ? clamp(s / seg[i]) : 0
    out.push(new THREE.Vector2(lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)))
  }
  return out
}
const SHAPES = {
  gob: [[0, 0], [0.07, 0.012], [0.115, 0.05], [0.135, 0.12], [0.125, 0.19], [0.085, 0.245], [0.035, 0.272], [0.022, 0.29]],
  bubble: [[0, 0], [0.1, 0.018], [0.165, 0.08], [0.19, 0.17], [0.178, 0.26], [0.125, 0.33], [0.05, 0.37], [0.024, 0.39]],
  parison: [[0, 0], [0.11, 0.02], [0.19, 0.09], [0.22, 0.2], [0.215, 0.36], [0.17, 0.48], [0.08, 0.56], [0.03, 0.59], [0.024, 0.61]],
  bottle: [[0, 0.02], [0.12, 0], [0.155, 0.012], [0.165, 0.05], [0.165, 0.36], [0.15, 0.43], [0.1, 0.49], [0.05, 0.53], [0.044, 0.6], [0.054, 0.64]],
  vase: [[0, 0.012], [0.1, 0], [0.13, 0.02], [0.2, 0.14], [0.21, 0.22], [0.17, 0.33], [0.1, 0.43], [0.088, 0.5], [0.12, 0.56], [0.145, 0.585]],
  tumbler: [[0, 0.014], [0.11, 0], [0.125, 0.012], [0.15, 0.3]],
}
const PROF = Object.fromEntries(Object.entries(SHAPES).map(([k, p]) => [k, resample(p)]))
const KINDS = ['bottle', 'vase']
const MADE_MAX = 12

function latheGeo(prof) {
  return new THREE.LatheGeometry(prof, SEG)
}
function fillLathe(geo, prof) {
  const pos = geo.attributes.position
  for (let i = 0; i <= SEG; i++) {
    const phi = (i / SEG) * TAU
    const s = Math.sin(phi)
    const c = Math.cos(phi)
    for (let j = 0; j < N; j++) pos.setXYZ(i * N + j, prof[j].x * s, prof[j].y, prof[j].x * c)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
}

/** Glass that glows while hot and turns clear as it cools (uHot 1 to 0, uGlow its heat's colour). */
function hotGlass() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uCold: { value: new THREE.Color('#c4f4e6') }, uGlow: { value: new THREE.Color() }, uHot: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCold; uniform vec3 uGlow; uniform float uHot;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5);
        vec3 hot = uGlow * (1.0 - 0.45 * f);
        // glowing, it is opaque in its heat's colour (orange, then red); only below the glow does it clear
        gl_FragColor = vec4(mix(uCold, hot, smoothstep(0.0, 0.45, uHot)), mix(0.05 + 0.7 * f, 0.97, uHot));
        #include <colorspace_fragment>
      }`,
  })
}

/** A soft round glow (for halos and spots of light). */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A beam of light from (0,0,0) along +z to z = 1 (placed with lookAt and scale.z): soft at its sides. */
function beamMesh(r0, r1, colorHex) {
  const geo = new THREE.CylinderGeometry(r1, r0, 1, 20, 1, true).rotateX(Math.PI / 2).translate(0, 0, 0.5)
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 0 }, uColor: { value: new THREE.Color(colorHex) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform vec3 uColor;
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main() {
        float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
        float a = uK * core * (0.45 + 0.55 * (1.0 - vUv.y));
        gl_FragColor = vec4(uColor * a, a);
      }`,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  return {
    mesh,
    mat,
    /** From a to b, at strength k. */
    set(a, b, k) {
      mesh.position.copy(a)
      mesh.lookAt(b)
      mesh.scale.set(1, 1, Math.max(0.001, a.distanceTo(b)))
      mat.uniforms.uK.value = k
      mesh.visible = k > 0.003
    },
  }
}

/** A sand texture: golden grains and specks. */
function sandTex(base, seed) {
  const rnd = random(seed)
  const t = canvasTex(256, 256, (g, w) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 2600; i++) {
      const v = rnd()
      g.fillStyle = v < 0.45 ? 'rgba(255,240,200,0.55)' : v < 0.8 ? 'rgba(120,80,30,0.45)' : 'rgba(255,255,255,0.7)'
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, 0.6 + rnd() * 1.6, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
  t.repeat.set(3, 3)
  return t
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, light, level, color }) {
  const stage = workshopStage({
    light,
    lamps: [
      { x: -1.6, z: 2.6, drop: 1.6, light: true, intensity: 4 },
      { x: 4.4, z: -6.6, drop: 1.7, light: true, intensity: 3.5, optional: true },
      { x: 5.0, z: 3.6, drop: 1.5 },
    ],
    windows: [{ side: 'w', at: 1.2 }, { side: 'w', at: 5.6 }, { side: 'e', at: 5.4 }],
  })
  root.add(stage.group)
  const { brick, firebrick, mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const panelOf = w => lv => ({ title: w.title, color, blocks: w.panel[depthOf(lv)].map(p => ({ p })) })
  const soft = softTex()
  textures.push(soft)
  const tmpC = new THREE.Color()
  const metreUV = (geo, sx, sy) => {
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy)
    return geo
  }

  // ======== the furnace of the picture: round-topped brick, its mouth full of fire ========
  const F = FURNACE
  {
    const r = F.w / 2
    const shape = new THREE.Shape()
    shape.moveTo(-r, 0)
    shape.lineTo(r, 0)
    shape.lineTo(r, F.h - r)
    shape.absarc(0, F.h - r, r, 0, Math.PI, false)
    shape.lineTo(-r, 0)
    const hole = new THREE.Path()
    hole.absarc(0, F.mouthY, F.mouthR, 0, TAU, true)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, { depth: F.d, bevelEnabled: false, curveSegments: 28 })
    geo.translate(0, 0, -F.d / 2)
    const body = new THREE.Mesh(geo, firebrick)
    body.position.set(F.x, 0, F.z)
    root.add(body)
    // a dark iron band round its outline, as the picture draws it
    const outline = new THREE.CurvePath()
    outline.add(new THREE.LineCurve3(new THREE.Vector3(-r, 0, 0), new THREE.Vector3(-r, F.h - r, 0)))
    const arc = new THREE.EllipseCurve(0, F.h - r, r, r, Math.PI, 0, true)
    outline.add(new THREE.CatmullRomCurve3(arc.getPoints(32).map(p => new THREE.Vector3(p.x, p.y, 0))))
    outline.add(new THREE.LineCurve3(new THREE.Vector3(r, F.h - r, 0), new THREE.Vector3(r, 0, 0)))
    const band = new THREE.Mesh(new THREE.TubeGeometry(outline, 96, 0.06, 6, false), mats.iron)
    band.position.set(F.x, 0, FRONT + 0.01)
    root.add(band)
    // a ring of dark bricks round the mouth, and the flue up through the ceiling
    const ring = new THREE.Mesh(new THREE.TorusGeometry(F.mouthR + 0.05, 0.085, 10, 48), new THREE.MeshStandardMaterial({ color: '#3a1a12', roughness: 0.9 }))
    ring.position.set(F.x, F.mouthY, FRONT + 0.01)
    root.add(ring)
    const flue = new THREE.Mesh(metreUV(new THREE.CylinderGeometry(0.45, 0.5, 1.6, 24, 1, true), 2.9, 1.6), brick)
    flue.position.set(F.x, F.h + 0.6, F.z)
    root.add(flue)
    solids.push(box(F.x, F.z, F.w + 0.1, F.d + 0.1))
  }
  // the fire inside: flames licking up a glowing back wall
  const fireMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float n = noise(vec2(p.x * 3.0, p.y * 2.2 - uTime * 1.4)) * 0.6 + noise(vec2(p.x * 7.0, p.y * 5.0 - uTime * 2.6)) * 0.4;
        float tongue = smoothstep(0.35, 0.85, n + 0.45 - (p.y + 1.0) * 0.32);
        vec3 deep = vec3(1.0, 0.28, 0.04);
        vec3 hot = vec3(1.0, 0.72, 0.28);
        vec3 c = mix(deep * 1.05, hot * 1.55, tongue);
        c *= 0.75 + 0.25 * smoothstep(1.0, 0.2, length(p));
        gl_FragColor = vec4(c, 1.0);
      }`,
  })
  const fire = new THREE.Mesh(new THREE.CircleGeometry(F.mouthR + 0.02, 40), fireMat)
  fire.position.set(F.x, F.mouthY, FRONT - 0.45)
  root.add(fire)
  const furnaceLight = new THREE.PointLight('#ff8a3c', 16, 20, 1.6)
  furnaceLight.position.set(F.x, F.mouthY, FRONT + 0.5)
  root.add(furnaceLight)
  // sparks rising in front of the mouth
  const sparks = motes({ count: 70, radius: 0.55, y0: F.mouthY + 0.3, y1: 4.6, color: '#ffb36b', size: 0.035, opacity: 0.85, speed: 0.55, light })
  sparks.group.position.set(F.x, 0, FRONT + 0.35)
  root.add(sparks.group)
  updates.push((dt, t) => {
    fireMat.uniforms.uTime.value = t
    furnaceLight.intensity = 16 + Math.sin(t * 7.3) * 1.4 + Math.sin(t * 13.1) * 0.9
    sparks.update(t)
  })

  // a marver (the glassblower's steel table) beside the furnace
  {
    const marver = new THREE.Group()
    const top = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.08, 0.62, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.25, metalness: 0.9 }))
    top.position.y = 0.86
    marver.add(top)
    for (const [lx, lz] of [[-0.42, -0.24], [0.42, -0.24], [-0.42, 0.24], [0.42, 0.24]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.82, 0.06), mats.iron)
      leg.position.set(lx, 0.41, lz)
      marver.add(leg)
    }
    marver.position.set(3.1, 0, -5.3)
    marver.rotation.y = -0.25
    root.add(marver)
    solids.push(circle(3.1, -5.3, 0.6))
  }

  // ======== the heap of sand from the picture, and the bins ========
  const sandMap = sandTex('#b78a42', 3)
  textures.push(sandMap)
  const sandMat = new THREE.MeshStandardMaterial({ map: sandMap, color: '#d8b070', roughness: 1 })
  {
    const heap = new THREE.Mesh(
      new THREE.LatheGeometry([[1.82, 0], [1.75, 0.08], [1.45, 0.42], [0.9, 1.05], [0.35, 1.48], [0, 1.55]].map(([x, y]) => new THREE.Vector2(x, y)), 40),
      sandMat,
    )
    heap.position.set(HEAP.x, 0, HEAP.z)
    root.add(heap)
    // a shovel stuck in it
    const shovel = new THREE.Group()
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.3, 8), mats.wood)
    handle.position.y = 0.65
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.02), mats.iron)
    blade.position.y = -0.1
    shovel.add(handle, blade)
    shovel.position.set(HEAP.x + 0.7, 1.15, HEAP.z + 0.7)
    shovel.rotation.set(-0.35, 0.6, 0.25)
    root.add(shovel)
    solids.push(circle(HEAP.x, HEAP.z, 1.7))
  }
  const BIN_LOOK = {
    sand: { mat: sandMat, grain: '#d9a548' },
    soda: { mat: new THREE.MeshStandardMaterial({ color: '#cfccc4', roughness: 0.95 }), grain: '#ecebe4' },
    lime: { mat: new THREE.MeshStandardMaterial({ color: '#a8a294', roughness: 0.95 }), grain: '#bdb7a7' },
  }
  const binSpots = {}
  ;['sand', 'soda', 'lime'].forEach((id, i) => {
    const bin = new THREE.Group()
    const x = BINS.xs[i]
    const { w, h, d } = BINS
    const sides = [
      [w, h, 0.05, 0, h / 2, d / 2 - 0.025],
      [w, h, 0.05, 0, h / 2, -d / 2 + 0.025],
      [0.05, h, d, -w / 2 + 0.025, h / 2, 0],
      [0.05, h, d, w / 2 - 0.025, h / 2, 0],
    ]
    for (const [bw, bh, bd, bx, by, bz] of sides) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mats.wood)
      m.position.set(bx, by, bz)
      bin.add(m)
    }
    const fill = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), BIN_LOOK[id].mat)
    fill.scale.set(w / 2 - 0.04, 0.12, d / 2 - 0.04)
    fill.position.y = h - 0.06
    bin.add(fill)
    // its name on a board raised behind it, seen over the pot
    const sign = new THREE.Mesh(new THREE.BoxGeometry(w - 0.06, 0.2, 0.03), mats.beam)
    sign.position.set(0, h + 0.42, -d / 2 + 0.03)
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.03), mats.beam)
    leg.position.set(0, h + 0.2, -d / 2 + 0.03)
    const label = makeText(E.batch.bins[id], { size: 0.11, color: '#f0dcb8', maxWidth: w - 0.1 })
    label.position.set(0, h + 0.42, -d / 2 + 0.05)
    bin.add(sign, leg, label)
    bin.position.set(x, 0, BINS.z)
    root.add(bin)
    binSpots[id] = new THREE.Vector3(x, h + 0.05, BINS.z)
  })
  solids.push(box((BINS.xs[0] + BINS.xs[2]) / 2, BINS.z, BINS.xs[2] - BINS.xs[0] + BINS.w + 0.05, BINS.d + 0.05))

  // ======== the melting pot: a small pot furnace (a brick drum with a crucible in it) ========
  const K = KILN
  const kiln = new THREE.Group()
  kiln.position.set(K.x, 0, K.z)
  root.add(kiln)
  {
    const drum = new THREE.Mesh(metreUV(new THREE.CylinderGeometry(K.r, K.r + 0.05, K.h, 40, 1, true), TAU * K.r, K.h), brick)
    drum.position.y = K.h / 2
    const top = new THREE.Mesh(new THREE.RingGeometry(0.5, K.r + 0.01, 40), new THREE.MeshStandardMaterial({ color: '#5a3022', roughness: 0.9, side: THREE.DoubleSide }))
    top.rotation.x = -Math.PI / 2
    top.position.y = K.h
    kiln.add(drum, top)
    for (const y of [0.1, K.h - 0.08]) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(K.r + 0.03 + (0.05 * (K.h - y)) / K.h, 0.018, 6, 48), mats.iron)
      band.rotation.x = Math.PI / 2
      band.position.y = y
      kiln.add(band)
    }
    solids.push(circle(K.x, K.z, K.r + 0.12))
  }
  // the firebox's door low on the drum, glowing when the fire is lit
  const doorMat = new THREE.MeshBasicMaterial({ color: '#000000' })
  {
    const door = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20, 0, Math.PI), doorMat)
    const dir = Math.atan2(-0.6, 1.8)
    door.position.set(Math.sin(dir) * (K.r + 0.04), 0.1, Math.cos(dir) * (K.r + 0.04))
    door.rotation.y = dir
    kiln.add(door)
  }
  // the crucible: a fireclay pot, its rim just above the drum
  const potMat = new THREE.MeshStandardMaterial({ color: '#7c4b33', roughness: 0.9, emissive: '#000000' })
  // shallow, so what is in it shows from where a visitor stands
  const POT = { floor: 0.53, rim: 0.72 }
  const potProfile = [[0.0, 0.4], [0.34, 0.4], [0.4, 0.48], [0.47, 0.7], [0.49, 0.72], [0.45, 0.725], [0.42, 0.64], [0.37, POT.floor], [0.0, POT.floor]]
  const pot = new THREE.Mesh(new THREE.LatheGeometry(potProfile.map(([x, y]) => new THREE.Vector2(x, y)), 40), potMat)
  kiln.add(pot)
  const innerR = y => 0.37 + (y - POT.floor) * 0.45
  // flames licking up round the pot while the fire burns
  const flameMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uK: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uK;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      void main() {
        float x = vUv.x * 26.0;
        float n = noise(vec2(x, vUv.y * 2.5 - uTime * 2.2)) * 0.65 + noise(vec2(x * 2.3, vUv.y * 5.0 - uTime * 3.4)) * 0.35;
        float reach = 0.25 + 0.75 * uK;
        float tongue = smoothstep(0.0, 0.35, n * reach * 1.6 - vUv.y);
        vec3 c = mix(vec3(0.9, 0.22, 0.03), vec3(1.0, 0.62, 0.22), tongue) * 0.85;
        float a = tongue * smoothstep(0.0, 0.05, uK) * (0.35 + 0.35 * uK) * (1.0 - vUv.y * 0.6);
        gl_FragColor = vec4(c * a, a);
      }`,
  })
  const flames = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.6, 0.42, 48, 1, true).translate(0, 0.21, 0), flameMat)
  flames.position.y = K.h - 0.02
  kiln.add(flames)
  const kilnLight = new THREE.PointLight('#ff9a4a', 0, 6, 1.8)
  kilnLight.position.set(0, 1.25, 0)
  kiln.add(kilnLight)

  // the grains: sand, then soda and limestone on top (one instanced mesh, a colour each)
  const G = light ? { sand: 110, soda: 40, lime: 30 } : { sand: 190, soda: 70, lime: 50 }
  const grainList = []
  const rnd = random(17)
  const heapH = (r, R, base, top) => base + top * Math.max(0, 1 - (r / R) ** 2)
  const HEAP_TOP = POT.floor + 0.125
  for (const id of ['sand', 'soda', 'lime']) {
    const R = id === 'sand' ? 0.34 : id === 'soda' ? 0.27 : 0.22
    for (let i = 0; i < G[id]; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * R
      const ox = id === 'lime' ? 0.05 : id === 'soda' ? -0.03 : 0
      const x = Math.cos(a) * r + ox
      const z = Math.sin(a) * r
      const rr = Math.hypot(x, z)
      let y = heapH(rr, 0.37, POT.floor + 0.005, 0.12) - rnd() * 0.025
      if (id !== 'sand') y = heapH(rr, 0.37, POT.floor + 0.005, 0.12) + 0.015 + (id === 'lime' ? 0.012 : 0)
      grainList.push({
        id,
        rest: new THREE.Vector3(x, y, z),
        size: (id === 'sand' ? 0.016 : 0.02) + rnd() * 0.012,
        rot: new THREE.Euler(rnd() * TAU, rnd() * TAU, 0),
        delay: rnd() * 0.45,
      })
    }
  }
  const grainMat = new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true, emissive: '#000000' })
  const grains = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), grainMat, grainList.length)
  grains.frustumCulled = false
  grainList.forEach((g, i) => {
    tmpC.set(BIN_LOOK[g.id].grain).offsetHSL(0, 0, (rnd() - 0.5) * 0.12)
    grains.setColorAt(i, tmpC)
  })
  kiln.add(grains)
  // the melt: a glowing pool, and the bubbles of carbon dioxide rising through it
  const meltTex = canvasTex(256, 256, (g, w) => {
    const r2 = random(5)
    g.fillStyle = '#c8c8c8'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 70; i++) {
      const v = 150 + r2() * 105
      g.fillStyle = `rgba(${v},${v},${v},0.5)`
      g.beginPath()
      g.ellipse(r2() * w, r2() * w, 8 + r2() * 30, 4 + r2() * 12, r2() * TAU, 0, TAU)
      g.fill()
    }
  })
  textures.push(meltTex)
  const meltMat = new THREE.MeshStandardMaterial({ color: '#1a0c06', roughness: 0.15, metalness: 0.1, emissive: '#000000', emissiveMap: meltTex })
  const melt = new THREE.Mesh(new THREE.CircleGeometry(1, 48), meltMat)
  melt.rotation.x = -Math.PI / 2
  kiln.add(melt)
  const BUB = light ? 20 : 40
  const bubbleMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe8b0').multiplyScalar(2.2), transparent: true, opacity: 0.9 })
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), bubbleMat, BUB)
  bubbles.frustumCulled = false
  bubbles.count = 0
  kiln.add(bubbles)
  const bubbleList = []
  // the scoop that carries each ingredient from its bin
  const scoop = new THREE.Group()
  {
    const cup = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 8, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.35, metalness: 0.85, side: THREE.DoubleSide }))
    cup.rotation.x = Math.PI
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.5, 8), mats.wood)
    handle.rotation.z = Math.PI / 2
    handle.position.x = 0.32
    const load = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 8), sandMat)
    load.scale.y = 0.45
    load.position.y = -0.01
    scoop.add(cup, handle, load)
    scoop.userData.load = load
  }
  scoop.visible = false
  root.add(scoop)

  // the dial: a pyrometer on a post, 0 to 1800 °C; the red end is where pure sand melts
  const DIAL = { a0: -135, a1: 135, max: 1800 }
  const angleOf = T => THREE.MathUtils.degToRad(DIAL.a0 + ((DIAL.a1 - DIAL.a0) * clamp(T, 0, DIAL.max)) / DIAL.max)
  const gauge = new THREE.Group()
  {
    const face = canvasTex(512, 512, (g, w) => {
      const c = w / 2
      const R = c - 12
      g.fillStyle = '#16120e'
      g.beginPath()
      g.arc(c, c, R, 0, TAU)
      g.fill()
      const pol = (a, r) => [c + Math.sin(a) * r, c - Math.cos(a) * r]
      // the red zone: 1700 °C and up
      g.strokeStyle = '#e8441c'
      g.lineWidth = 44
      g.beginPath()
      g.arc(c, c, R * 0.62, angleOf(1700) - Math.PI / 2, angleOf(1800) - Math.PI / 2)
      g.stroke()
      g.strokeStyle = '#e8dcc0'
      for (let T = 0; T <= 1800; T += 100) {
        const a = angleOf(T)
        const big = T % 500 === 0
        g.lineWidth = big ? 6 : 3
        const [x0, y0] = pol(a, R * (big ? 0.5 : 0.56))
        const [x1, y1] = pol(a, R * 0.7)
        g.beginPath()
        g.moveTo(x0, y0)
        g.lineTo(x1, y1)
        g.stroke()
      }
      g.fillStyle = '#e8dcc0'
      g.font = '700 40px Outfit'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      for (const T of [0, 500, 1000, 1500]) {
        const [x, y] = pol(angleOf(T), R * 0.8)
        g.fillText(String(T), x, y)
      }
      g.font = '700 46px Outfit'
      g.fillText('°C', c, c - R * 0.3)
      // what the red means, in red, low on the face (on two lines when long)
      g.fillStyle = '#ff7a4a'
      g.font = '700 30px Outfit'
      const words = E.batch.gauge
      g.font = '700 34px Outfit'
      const [rx, ry] = pol(angleOf(1700), R * 0.86)
      g.fillText('1700', rx, ry)
      g.font = '700 27px Outfit'
      if (g.measureText(words).width < R * 1.1) g.fillText(words, c, c + R * 0.6)
      else {
        const cut = words.lastIndexOf(' ', Math.ceil(words.length / 2))
        g.fillText(words.slice(0, cut), c, c + R * 0.54)
        g.fillText(words.slice(cut + 1), c, c + R * 0.67)
      }
      // the furnace's top: a small triangle at 1500
      const [tx, ty] = pol(angleOf(1500), R * 0.74)
      g.fillStyle = '#ffd27e'
      g.beginPath()
      g.arc(tx, ty, 9, 0, TAU)
      g.fill()
    }, { mipmaps: true })
    textures.push(face)
    const disc = new THREE.Mesh(new THREE.CircleGeometry(GAUGE.r, 48), new THREE.MeshStandardMaterial({ map: face, roughness: 0.6, emissive: '#ffffff', emissiveMap: face, emissiveIntensity: 0.35 }))
    disc.position.z = 0.03
    const rim = new THREE.Mesh(new THREE.TorusGeometry(GAUGE.r, 0.025, 8, 48), mats.brass)
    rim.position.z = 0.03
    const back = new THREE.Mesh(new THREE.CylinderGeometry(GAUGE.r, GAUGE.r, 0.06, 32).rotateX(Math.PI / 2), mats.iron)
    gauge.add(disc, rim, back)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, GAUGE.y, 8), mats.iron)
    post.position.set(0, -GAUGE.y / 2, -0.04)
    gauge.add(post)
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.3, 6), mats.iron)
    wire.rotation.z = Math.PI / 2
    wire.position.set(-0.6, -GAUGE.y + 0.25, -0.04)
    gauge.add(wire)
  }
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.014, GAUGE.r * 0.7, 0.01).translate(0, GAUGE.r * 0.27, 0), new THREE.MeshBasicMaterial({ color: '#ff5a2a' }))
  needle.position.z = 0.05
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16).rotateX(Math.PI / 2), mats.brass)
  hub.position.z = 0.055
  gauge.add(needle, hub)
  const readout = makeText('20 °C', { size: 0.1, color: '#ffd9a0', anchorY: 'top' })
  readout.position.set(0, -GAUGE.r - 0.06, 0.04)
  gauge.add(readout)
  gauge.position.set(GAUGE.x, GAUGE.y, GAUGE.z)
  gauge.rotation.y = Math.atan2(-2.6 - GAUGE.x, -1.2 - GAUGE.z)
  root.add(gauge)
  solids.push(circle(GAUGE.x, GAUGE.z, 0.12))
  let shownT = 20

  // ---- the batch: what is in the pot, and how hot ----
  // steps: 0 empty and cold, 1 sand, 2 sand at 1500 °C (still grains), 3 melted with soda, 4 window glass
  const B_KIND = ['sand', 'heat', 'soda', 'lime', 'empty']
  const B_END = { sand: 1.9, heat: 3.9, soda: 3.8, lime: 3.0, empty: 2.6 }
  const B_TEMP = [20, 20, 1500, 1500, 1500]
  let bStep = 0
  let bCycle = 0
  let bAnim = null
  let temp = 20
  let fireK = 0
  const startBatch = kind => {
    bAnim = { kind, t: 0 }
    if (kind === 'heat') play('beam')
    else if (kind === 'empty') play('tap')
    else play('select')
  }
  const BIN_OF = { sand: 'sand', soda: 'soda', lime: 'lime' }
  const POT_TOP = new THREE.Vector3(K.x, 1.1, K.z)
  const scoopPose = (from, s) => {
    // to the pot (0 to 0.55 s), tip and pour (to 1.1), back to its bin (to 1.7)
    scoop.visible = s < 1.75
    const go = span(0, 0.55, s)
    const back = span(1.15, 1.7, s)
    const pos = from.clone().lerp(POT_TOP, go * (1 - back))
    pos.y += Math.sin(Math.PI * (go < 1 ? go : 1 - back)) * 0.45
    scoop.position.copy(pos)
    scoop.rotation.set(0, 0, -1.7 * span(0.55, 0.8, s) * (1 - span(1.0, 1.2, s)))
    scoop.userData.load.visible = s < 0.75
  }
  const grainDummy = new THREE.Object3D()
  function poseBatch(dt, t) {
    const a = bAnim
    const s = a?.t ?? 0
    // temperature and fire
    let fireTarget = bStep >= 2 ? 0.22 : 0
    if (a?.kind === 'heat') {
      temp = lerp(20, 1500, span(0.3, 3.5, s))
      fireTarget = 1
    } else if (a?.kind === 'empty') {
      temp = lerp(1500, 20, span(0.4, 2.5, s))
      fireTarget = 0
    } else temp = B_TEMP[bStep]
    fireK = damp(fireK, fireTarget, 3, dt)
    // the melt (0 grains, 1 all molten)
    let m = bStep >= 3 ? 1 : 0
    if (a?.kind === 'soda') m = span(0.9, 3.4, s)
    let level = lerp(POT.floor + 0.01, 0.63, m)
    let meltK = m
    if (a?.kind === 'empty') {
      level = lerp(0.63, POT.floor, span(0.2, 1.6, s))
      meltK = 1 - span(1.2, 1.7, s)
    }
    melt.visible = meltK > 0.01
    melt.position.y = level
    melt.scale.setScalar(innerR(level) - 0.01)
    meltTex.rotation = t * 0.03
    meltTex.center.set(0.5, 0.5)
    glowAt(temp, tmpC)
    meltMat.emissive.copy(tmpC).multiplyScalar(meltK)
    grainMat.emissive.copy(tmpC).multiplyScalar(0.85)
    potMat.emissive.copy(glowAt(temp * 0.85, tmpC)).multiplyScalar(0.12)
    glowAt(temp, tmpC)
    // which grains show
    const from = a && BIN_OF[a.kind] ? binSpots[a.kind] : null
    grainList.forEach((g, i) => {
      let k = 0
      const p = grainDummy.position.copy(g.rest)
      if (g.id === 'sand') {
        if (bStep >= 1 && bStep <= 2) k = 1
        if (a?.kind === 'soda') k = 1 - span(1.0, 3.2, s)
        if (a?.kind === 'sand') k = 1
        p.y -= m * 0.1
      } else if (g.id === 'soda') {
        if (bStep === 2 && a?.kind === 'soda') k = 1 - span(1.2, 3.3, s)
        p.y -= m * 0.08
      } else if (a?.kind === 'lime') {
        k = 1 - span(1.3, 2.8, s)
        p.y = level + 0.012 + (g.rest.y - HEAP_TOP) * 0.3
      }
      // falling in from the scoop
      if (a && a.kind === g.id) {
        const f = clamp((s - 0.62 - g.delay) / 0.4)
        if (f <= 0) k = 0
        else {
          const start = new THREE.Vector3(POT_TOP.x - K.x - 0.16, POT_TOP.y - 0.05, POT_TOP.z - K.z)
          p.lerpVectors(start, p.clone(), f * f)
        }
      }
      grainDummy.rotation.copy(g.rot)
      grainDummy.scale.setScalar(g.size * k)
      grainDummy.updateMatrix()
      grains.setMatrixAt(i, grainDummy.matrix)
    })
    grains.instanceMatrix.needsUpdate = true
    if (from) scoopPose(from, s)
    else scoop.visible = false
    // bubbles of CO2: while soda or limestone reacts
    let fizz = 0
    if (a?.kind === 'soda') fizz = span(0.8, 1.2, s) * (1 - span(3.0, 3.7, s))
    if (a?.kind === 'lime') fizz = span(0.9, 1.2, s) * (1 - span(2.4, 2.95, s))
    if (fizz > 0 && bubbleList.length < BUB && Math.random() < fizz * dt * 40) {
      const ang = Math.random() * TAU
      const rr = Math.sqrt(Math.random()) * 0.3
      bubbleList.push({ x: Math.cos(ang) * rr, z: Math.sin(ang) * rr, y: level - 0.05, v: 0.05 + Math.random() * 0.05, r: 0.008 + Math.random() * 0.014, life: 0 })
    }
    for (let i = bubbleList.length - 1; i >= 0; i--) {
      const b = bubbleList[i]
      b.y = Math.min(b.y + b.v * dt, level + b.r * 0.4)
      b.life += dt
      if (b.y >= level + b.r * 0.4 - 0.001 && (b.pop = (b.pop ?? 0) + dt) > 0.25) bubbleList.splice(i, 1)
    }
    bubbles.count = bubbleList.length
    bubbleList.forEach((b, i) => {
      grainDummy.position.set(b.x, b.y, b.z)
      grainDummy.rotation.set(0, 0, 0)
      grainDummy.scale.setScalar(b.r * (1 - clamp((b.pop ?? 0) / 0.25)))
      grainDummy.updateMatrix()
      bubbles.setMatrixAt(i, grainDummy.matrix)
    })
    bubbles.instanceMatrix.needsUpdate = true
    // the fire round the pot
    flames.visible = fireK > 0.01
    flameMat.uniforms.uK.value = fireK
    flameMat.uniforms.uTime.value = t
    doorMat.color.copy(glowAt(lerp(500, 1300, fireK), tmpC)).multiplyScalar(fireK > 0.02 ? 1 : 0)
    kilnLight.intensity = fireK * 4 + clamp((temp - 500) / 1000) * 3
    // the dial
    needle.rotation.z = -angleOf(temp)
    const T10 = Math.round(temp / 10) * 10
    if (T10 !== shownT) {
      shownT = T10
      readout.text = `${T10} °C`
      readout.sync()
    }
  }
  const batchSay = { sand: 'sand', soda: 'soda', lime: 'lime', empty: 'empty' }
  ex.add({
    id: 'batch',
    x: -2.55,
    z: -1.45,
    radius: 2.1,
    label: E.batch.label,
    // during an animation the prompt already offers what comes next
    verb: () => E.batch.verbs[B_KIND[batchState().step]],
    panel: panelOf(E.batch),
    panelDelay: 2.2,
    focus: { x: -3.3, y: 0.85, z: -3.5, size: 3.3 },
    act: () => {
      if (bAnim) return false
      const kind = B_KIND[bStep]
      startBatch(kind)
      share('batch')
      if (kind === 'heat') {
        later(B_END.heat, () => say(at(E.batch.says.hot, level())))
        return null
      }
      return at(E.batch.says[batchSay[kind]], level())
    },
  })
  updates.push((dt, t) => {
    if (bAnim) {
      bAnim.t += dt
      if (bAnim.t >= B_END[bAnim.kind]) {
        if (bAnim.kind === 'empty') {
          bStep = 0
          bCycle++
        } else bStep++
        bAnim = null
      }
    }
    poseBatch(dt, t)
  })
  // the state a share sends is where it ends (the step moves at the end of its animation)
  const batchState = () => (bAnim ? (bAnim.kind === 'empty' ? { step: 0, cycle: bCycle + 1 } : { step: bStep + 1, cycle: bCycle }) : { step: bStep, cycle: bCycle })

  // ======== the blowpipe and the shelf ========
  const pipeDir = PIPE.tip.clone().sub(PIPE.end).normalize()
  const pipeLen = PIPE.tip.distanceTo(PIPE.end)
  {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, pipeLen + 0.1, 10), new THREE.MeshStandardMaterial({ color: '#8d939c', roughness: 0.35, metalness: 0.85 }))
    pipe.position.copy(PIPE.tip).add(PIPE.end).multiplyScalar(0.5)
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pipeDir)
    root.add(pipe)
    const mouthpiece = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.12, 12), mats.brass)
    mouthpiece.position.copy(PIPE.end).addScaledVector(pipeDir, -0.02)
    mouthpiece.quaternion.copy(pipe.quaternion)
    root.add(mouthpiece)
    // the yoke the pipe turns on
    const mid = PIPE.tip.clone().lerp(PIPE.end, 0.55)
    const yoke = new THREE.Group()
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, mid.y - 0.04, 8), mats.iron)
    post.position.y = (mid.y - 0.04) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.05, 20), mats.iron)
    foot.position.y = 0.025
    const fork = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 16, Math.PI), mats.iron)
    fork.position.y = mid.y - 0.02
    fork.rotation.set(0, Math.atan2(pipeDir.x, pipeDir.z) + Math.PI / 2, Math.PI)
    yoke.add(post, foot, fork)
    yoke.position.set(mid.x, 0, mid.z)
    root.add(yoke)
    solids.push(circle(mid.x, mid.z, 0.28))
  }
  const hot = hotGlass()
  const pieceGeo = latheGeo(PROF.gob)
  const piece = new THREE.Mesh(pieceGeo, hot)
  piece.frustumCulled = false
  piece.renderOrder = 2
  root.add(piece)
  const pieceLight = new THREE.PointLight('#ff8a3c', 0, 3.5, 2)
  root.add(pieceLight)
  const cold = edgeGlass({ color: '#c4f4e6', edge: 0.8, base: 0.05 })
  const shapeGeos = { bottle: latheGeo(PROF.bottle), vase: latheGeo(PROF.vase), tumbler: latheGeo(PROF.tumbler) }
  const topOf = prof => prof[N - 1].y
  // the shelf: two boards on the back wall; the picture's three pieces, then what visitors made
  {
    const board = (x0, x1, y) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.05, 0.5), mats.wood)
      b.position.set((x0 + x1) / 2, y - 0.025, SHELF.z)
      root.add(b)
      for (const x of [x0 + 0.25, (x0 + x1) / 2, x1 - 0.25]) {
        const br = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.4), mats.beam)
        br.position.set(x, y - 0.16, SHELF.z - 0.03)
        root.add(br)
      }
    }
    board(...SHELF.lowX, SHELF.low)
    board(...SHELF.highX, SHELF.high)
    solids.push(box((SHELF.lowX[0] + SHELF.lowX[1]) / 2, SHELF.z, SHELF.lowX[1] - SHELF.lowX[0], 0.55))
    const originals = [['bottle', 2.5], ['vase', 2.97], ['tumbler', 3.42]]
    for (const [kind, x] of originals) {
      const m = new THREE.Mesh(shapeGeos[kind], cold)
      m.position.set(x, SHELF.low, SHELF.z)
      m.renderOrder = 2
      root.add(m)
    }
    const sign = makeText(E.blow.shelf, { size: 0.17, color: '#d9c39a' })
    sign.position.set((SHELF.highX[0] + SHELF.highX[1]) / 2, SHELF.high + 0.85, -8.47)
    root.add(sign)
  }
  const slot = i => {
    const low = i < 6
    const k = low ? i : i - 6
    return new THREE.Vector3(3.95 + k * 0.46, low ? SHELF.low : SHELF.high, SHELF.z)
  }
  const shelfPieces = Array.from({ length: MADE_MAX }, (_, i) => {
    const m = new THREE.Mesh(shapeGeos.bottle, cold)
    m.position.copy(slot(i))
    m.visible = false
    m.renderOrder = 2
    root.add(m)
    return m
  })
  // the lens over the shelf: glass's network of silicon (tan) and oxygen (red), jumbled, drawn flat
  {
    const lens = new THREE.Group()
    const backing = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), new THREE.MeshBasicMaterial({ color: '#141a3c' }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.04, 10, 64), new THREE.MeshStandardMaterial({ color: '#f0a37a', emissive: '#d0663e', emissiveIntensity: 0.9, roughness: 0.4 }))
    ring.position.z = 0.03
    lens.add(backing, ring)
    const b = 0.15
    const r3 = random(29)
    const si = []
    for (let i = -6; i <= 6; i++) {
      for (let j = -6; j <= 6; j++) {
        const x = i * Math.sqrt(3) * b + (j % 2 ? (Math.sqrt(3) / 2) * b : 0)
        const y = j * 1.5 * b
        si.push([x, y], [x, y + b])
      }
    }
    const pts = si.map(([x, y]) => [x + (r3() - 0.5) * 0.36 * b, y + (r3() - 0.5) * 0.36 * b])
    const near = pts.map(([x, y], i) => ({ i, x, y, ok: Math.hypot(x, y) < LENS.r - 0.06 }))
    const bonds = []
    for (let i = 0; i < si.length; i++) {
      for (let j = i + 1; j < si.length; j++) {
        const d = Math.hypot(si[i][0] - si[j][0], si[i][1] - si[j][1])
        if (Math.abs(d - b) < 0.01 && near[i].ok && near[j].ok) bonds.push([i, j])
      }
    }
    const used = new Set(bonds.flat())
    const ball = new THREE.SphereGeometry(1, 14, 10)
    const siMesh = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: '#c9a67a', emissive: '#4a3520', roughness: 0.5 }), used.size)
    const oMesh = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: '#e0392b', emissive: '#5a0c06', roughness: 0.45 }), bonds.length)
    const stickMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 6), new THREE.MeshStandardMaterial({ color: '#8a8f9a', roughness: 0.6 }), bonds.length * 2)
    const o = new THREE.Object3D()
    let k = 0
    for (const i of used) {
      o.position.set(pts[i][0], pts[i][1], 0.05)
      o.scale.setScalar(0.045)
      o.updateMatrix()
      siMesh.setMatrixAt(k++, o.matrix)
    }
    const up = new THREE.Vector3(0, 1, 0)
    bonds.forEach(([i, j], n) => {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[j]
      // the oxygen bridges the two, a little off the line (the Si-O-Si angle is not straight)
      const side = (r3() - 0.5) * 0.5 * b
      const len = Math.hypot(x1 - x0, y1 - y0)
      const ox = (x0 + x1) / 2 + (-(y1 - y0) / len) * side
      const oy = (y0 + y1) / 2 + ((x1 - x0) / len) * side
      o.position.set(ox, oy, 0.06)
      o.scale.setScalar(0.03)
      o.rotation.set(0, 0, 0)
      o.updateMatrix()
      oMesh.setMatrixAt(n, o.matrix)
      ;[[x0, y0], [x1, y1]].forEach(([sx, sy], e) => {
        const d = new THREE.Vector3(ox - sx, oy - sy, 0)
        o.position.set((sx + ox) / 2, (sy + oy) / 2, 0.045)
        o.quaternion.setFromUnitVectors(up, d.clone().normalize())
        o.scale.set(0.008, d.length(), 0.008)
        o.updateMatrix()
        stickMesh.setMatrixAt(n * 2 + e, o.matrix)
        o.quaternion.identity()
      })
    })
    lens.add(stickMesh, siMesh, oMesh)
    const gloss = new THREE.Mesh(new THREE.TorusGeometry(LENS.r * 0.82, 0.012, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 }))
    gloss.rotation.z = 1.9
    gloss.position.z = 0.09
    lens.add(gloss)
    // the arm it hangs from, out of the wall
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), mats.brass)
    arm.rotation.x = Math.PI / 2
    arm.position.set(0, LENS.r + 0.08, -0.25)
    lens.add(arm)
    // and its faint cone of light down to the vase it magnifies
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(LENS.r * 0.55, 0.14, LENS.y - LENS.r - SHELF.low - 0.25, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: '#ffe0b0', transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    )
    cone.position.set(0, -(LENS.r + (LENS.y - LENS.r - SHELF.low - 0.25) / 2), -0.15)
    lens.add(cone)
    lens.position.set(LENS.x, LENS.y, LENS.z)
    root.add(lens)
  }

  // ---- blowing: 0 a gob, 1 a bubble, 2 a parison; shaping cools it and sets it on the shelf ----
  const W_END = { blow: 1.2, more: 1.2, make: 7.6 }
  let wStep = 0
  let wN = 0
  let made = []
  let wAnim = null
  const STEP_SHAPE = ['gob', 'bubble', 'parison']
  const live = { from: null, to: null, k: -1, prof: PROF.gob.map(p => p.clone()) }
  const setShape = (from, to, k) => {
    // only when it changes (a shape at rest is filled once)
    if (live.from === from && live.to === to && live.k === k) return
    live.from = from
    live.to = to
    live.k = k
    for (let j = 0; j < N; j++) live.prof[j].lerpVectors(from[j], to[j], k)
    fillLathe(pieceGeo, live.prof)
  }
  const rebuildShelf = () => {
    shelfPieces.forEach((m, i) => {
      const kind = made[i]
      m.visible = !!kind
      if (kind) m.geometry = shapeGeos[kind]
    })
  }
  const onPipe = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pipeDir.clone().negate())
  const spinQ = new THREE.Quaternion()
  const yAxis = new THREE.Vector3(0, 1, 0)
  const startBlow = kind => {
    wAnim = { kind, t: 0, shape: kind === 'make' ? KINDS[wN % KINDS.length] : null, landed: false }
    if (kind === 'make') play('select')
    else play('fizz', { order: 1.6 })
  }
  function poseBlow(dt, t) {
    const a = wAnim
    const s = a?.t ?? 0
    let T = 1050
    let scale = 1
    let lift = 0
    if (!a) {
      setShape(PROF[STEP_SHAPE[wStep]], PROF[STEP_SHAPE[wStep]], 1)
    } else if (a.kind === 'blow' || a.kind === 'more') {
      const from = PROF[STEP_SHAPE[wStep]]
      const to = PROF[STEP_SHAPE[wStep + 1]]
      setShape(from, to, span(0.05, 1.1, s))
    } else {
      // shape (to 1.2 s), cool (to 4.6), crack off (4.7), fly to the shelf (to 6.3), a new gob (6.5 to 7.6)
      const shape = PROF[a.shape]
      if (s < 1.25) setShape(PROF.parison, shape, span(0.05, 1.2, s))
      else if (s < 6.4) setShape(shape, shape, 1)
      T = lerp(1050, 260, span(1.3, 4.6, s))
      if (s >= 4.6 && !a.cracked) {
        a.cracked = true
        play('crack')
      }
      lift = span(4.8, 6.3, s)
      if (s >= 6.3 && !a.landed) {
        a.landed = true
        made = [...made, a.shape].slice(-MADE_MAX)
        rebuildShelf()
        play('tap')
      }
      if (s >= 6.3) {
        // a new gob gathered from the furnace, glowing in
        setShape(PROF.gob, PROF.gob, 1)
        scale = span(6.5, 7.5, s)
        T = 1080
        lift = 0
      }
    }
    // on the pipe: its neck at the pipe's tip, turning with the pipe
    const L = topOf(live.prof)
    spinQ.setFromAxisAngle(yAxis, t * 1.4)
    const onPos = PIPE.tip.clone().addScaledVector(pipeDir, L * scale)
    if (lift > 0) {
      const dest = slot(Math.min(made.length, MADE_MAX - 1))
      const k = lift
      piece.position.lerpVectors(onPos, dest, k)
      piece.position.y += Math.sin(Math.PI * k) * 0.9
      piece.quaternion.copy(onPipe).multiply(spinQ).slerp(new THREE.Quaternion(), ease(k))
      piece.visible = true
    } else {
      piece.position.copy(onPos)
      piece.quaternion.copy(onPipe).multiply(spinQ)
      piece.visible = scale > 0.01
    }
    piece.scale.setScalar(Math.max(0.01, scale))
    glowAt(T, hot.uniforms.uGlow.value)
    hot.uniforms.uHot.value = clamp((T - 380) / 250)
    pieceLight.position.copy(piece.position)
    pieceLight.intensity = clamp((T - 500) / 500) * 2.2 * scale
    pieceLight.color.copy(glowAt(Math.max(T, 700), tmpC)).multiplyScalar(1 / Math.max(0.01, tmpC.r))
  }
  ex.add({
    id: 'blow',
    x: 2.05,
    z: -1.8,
    radius: 1.9,
    label: E.blow.label,
    verb: () => {
      const s = blowState()
      return s.step === 0 ? E.blow.verbs.blow : s.step === 1 ? E.blow.verbs.more : E.blow.verbs[KINDS[s.n % KINDS.length]]
    },
    panel: panelOf(E.blow),
    panelDelay: 1.6,
    focus: { x: 1.4, y: 1.2, z: -3.8, size: 2.0 },
    act: () => {
      if (wAnim) return false
      const lv = level()
      if (wStep < 2) {
        startBlow(wStep === 0 ? 'blow' : 'more')
        share('blow')
        return at(wStep === 0 ? E.blow.says.blow : E.blow.says.more, lv)
      }
      startBlow('make')
      share('blow')
      return at(E.blow.says[wAnim.shape], lv)
    },
  })
  updates.push((dt, t) => {
    if (wAnim) {
      wAnim.t += dt
      if (wAnim.t >= W_END[wAnim.kind]) {
        if (wAnim.kind === 'make') {
          if (!wAnim.landed) {
            made = [...made, wAnim.shape].slice(-MADE_MAX)
            rebuildShelf()
          }
          wStep = 0
          wN++
        } else wStep++
        wAnim = null
      }
    }
    poseBlow(dt, t)
  })
  const blowState = () => {
    if (!wAnim) return { step: wStep, n: wN, made: [...made] }
    if (wAnim.kind !== 'make') return { step: wStep + 1, n: wN, made: [...made] }
    return { step: 0, n: wN + 1, made: wAnim.landed ? [...made] : [...made, wAnim.shape].slice(-MADE_MAX) }
  }

  // ======== the light bench: sand, a pane, a coil of fibre, and a lamp to shine at them ========
  const benchMat = new THREE.MeshStandardMaterial({ color: '#4a3527', roughness: 0.7 })
  {
    const bw = BENCH.x1 - BENCH.x0
    const bl = BENCH.z1 - BENCH.z0
    const top = new THREE.Mesh(new RoundedBoxGeometry(bw, 0.07, bl, 2, 0.02), benchMat)
    top.position.set((BENCH.x0 + BENCH.x1) / 2, BENCH.top - 0.035, (BENCH.z0 + BENCH.z1) / 2)
    root.add(top)
    for (const lx of [BENCH.x0 + 0.1, BENCH.x1 - 0.1]) {
      for (const lz of [BENCH.z0 + 0.1, BENCH.z1 - 0.1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, BENCH.top - 0.07, 0.07), mats.beam)
        leg.position.set(lx, (BENCH.top - 0.07) / 2, lz)
        root.add(leg)
      }
    }
    solids.push(box((BENCH.x0 + BENCH.x1) / 2, (BENCH.z0 + BENCH.z1) / 2, bw, bl, { y1: BENCH.top }))
  }
  // the card behind, where light that gets through lands
  const card = new THREE.Mesh(new THREE.BoxGeometry(CARD.x1 - CARD.x0, CARD.h, 0.03), new THREE.MeshStandardMaterial({ color: '#77736b', roughness: 0.9 }))
  card.position.set((CARD.x0 + CARD.x1) / 2, BENCH.top + CARD.h / 2, CARD.z)
  root.add(card)
  const spotMat = () => new THREE.MeshBasicMaterial({ map: soft, color: new THREE.Color('#fff2d6').multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const cardSpot = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), spotMat())
  const fibreSpot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), spotMat())
  for (const sp of [cardSpot, fibreSpot]) {
    sp.position.z = CARD.z + 0.02
    root.add(sp)
  }
  // a heap of white glass sand on a tray
  const glassSandMat = new THREE.MeshStandardMaterial({ map: sandTex('#b8b2a2', 9), color: '#d2ccbd', roughness: 1, emissive: '#fff4e0', emissiveIntensity: 0 })
  textures.push(glassSandMat.map)
  {
    const tray = new THREE.Mesh(new RoundedBoxGeometry(SAND.r * 2 + 0.08, 0.06, SAND.r * 1.7 + 0.08, 2, 0.015), mats.wood)
    tray.position.set(SAND.x, BENCH.top + 0.03, SAND.z)
    const heap = new THREE.Mesh(new THREE.SphereGeometry(SAND.r, 28, 14, 0, TAU, 0, Math.PI / 2), glassSandMat)
    heap.scale.set(1, 0.6, 0.85)
    heap.position.set(SAND.x, BENCH.top + 0.05, SAND.z)
    root.add(tray, heap)
  }
  const sandHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#fff6e8').multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  sandHalo.scale.setScalar(0.6)
  sandHalo.position.set(SAND.x - 0.02, BENCH.top + 0.16, SAND.z + 0.08)
  root.add(sandHalo)
  const GLINTS = 26
  const glintPos = new Float32Array(GLINTS * 3)
  const r4 = random(41)
  for (let i = 0; i < GLINTS; i++) {
    const a = r4() * Math.PI - Math.PI / 2
    const h = r4() * 0.9
    const rr = SAND.r * Math.sqrt(1 - h * h)
    glintPos.set([SAND.x + Math.sin(a) * rr, BENCH.top + 0.05 + h * SAND.r * 0.6 + 0.01, SAND.z + Math.cos(a) * rr * 0.85], i * 3)
  }
  const glintGeo = new THREE.BufferGeometry()
  glintGeo.setAttribute('position', new THREE.BufferAttribute(glintPos, 3))
  const glintMat = new THREE.PointsMaterial({ map: soft, color: '#ffffff', size: 0.05, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const glints = new THREE.Points(glintGeo, glintMat)
  root.add(glints)
  // the pane on a turntable: its face toward the lamp, or turned to put its edge to the lamp
  const pane = new THREE.Group()
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 28), mats.iron)
    base.position.y = 0.025
    const clamp1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.06), mats.wood)
    clamp1.position.y = 0.07
    pane.add(base, clamp1)
  }
  const paneGlass = new THREE.Mesh(new THREE.BoxGeometry(PANE.w, PANE.h, PANE.t), edgeGlass({ color: '#b8f0d2', edge: 0.85, base: 0.08 }))
  paneGlass.position.y = 0.06 + PANE.h / 2
  paneGlass.renderOrder = 2
  pane.add(paneGlass)
  // its edges, which glow green when light runs inside it
  const greenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#3ee08a').multiplyScalar(2.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const faintGreen = new THREE.MeshBasicMaterial({ color: new THREE.Color('#3ee08a'), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const farEdge = new THREE.Mesh(new THREE.BoxGeometry(0.02, PANE.h, PANE.t + 0.006), greenMat)
  farEdge.position.set(PANE.w / 2, 0.06 + PANE.h / 2, 0)
  const rimTop = new THREE.Mesh(new THREE.BoxGeometry(PANE.w, 0.014, PANE.t + 0.006), greenMat)
  rimTop.position.set(0, 0.06 + PANE.h, 0)
  const faceGlow = new THREE.Mesh(new THREE.PlaneGeometry(PANE.w, PANE.h), faintGreen)
  faceGlow.position.set(0, 0.06 + PANE.h / 2, 0)
  pane.add(farEdge, rimTop, faceGlow)
  pane.position.set(PANE.x, BENCH.top, PANE.z)
  root.add(pane)
  // a coil of glass fibre: in from the lamp's side, three turns, out toward the card
  const fibrePath = (() => {
    const pts = []
    const y0 = BENCH.top + 0.18
    pts.push(new THREE.Vector3(FIBRE.x, y0, FIBRE.inZ), new THREE.Vector3(FIBRE.x, y0, FIBRE.cz + FIBRE.r + 0.05))
    const turns = 3
    const n = 72
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * turns * TAU
      pts.push(new THREE.Vector3(FIBRE.x + Math.sin(a) * FIBRE.r, y0 - 0.05 + (i / n) * 0.12 - 0.06 * Math.sin((i / n) * Math.PI), FIBRE.cz + Math.cos(a) * FIBRE.r))
    }
    pts.push(new THREE.Vector3(FIBRE.x, y0 + 0.05, FIBRE.cz - FIBRE.r - 0.08), new THREE.Vector3(FIBRE.x, y0 + 0.05, FIBRE.outZ))
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  })()
  const fibreMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOn: { value: 0 }, uFront: { value: 0 }, uTime: { value: 0 }, uCold: { value: new THREE.Color('#9fd8cf') }, uLit: { value: new THREE.Color('#fff0cf') } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uOn; uniform float uFront; uniform float uTime; uniform vec3 uCold; uniform vec3 uLit;
      varying vec2 vUv;
      void main() {
        float lit = uOn * (1.0 - smoothstep(uFront - 0.02, uFront, vUv.x));
        float pulse = 0.65 + 0.35 * sin(vUv.x * 140.0 - uTime * 14.0);
        vec3 c = mix(uCold * 0.55, uLit * (0.75 + 0.6 * pulse), lit);
        gl_FragColor = vec4(c, mix(0.5, 1.0, lit));
      }`,
  })
  const fibre = new THREE.Mesh(new THREE.TubeGeometry(fibrePath, light ? 160 : 320, 0.012, 6, false), fibreMat)
  root.add(fibre)
  {
    // a little stand holding each end
    for (const z of [FIBRE.inZ - 0.05, FIBRE.outZ + 0.05]) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.06), mats.wood)
      st.position.set(FIBRE.x, BENCH.top + 0.09, z)
      root.add(st)
    }
  }
  const fibreEnd = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#fff0cf').multiplyScalar(2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  fibreEnd.scale.setScalar(0.16)
  fibreEnd.position.copy(fibrePath.getPoint(1))
  root.add(fibreEnd)
  // the lamp: a stage spotlight on a stand, turning to what it shines at
  const lamp = new THREE.Group()
  const lampHead = new THREE.Group()
  lampHead.rotation.order = 'YXZ'
  const lensMat = new THREE.MeshBasicMaterial({ color: '#2a2622' })
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 24), mats.iron)
    foot.position.y = BENCH.top + 0.02
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, LAMP.y - BENCH.top - 0.1, 8), mats.iron)
    post.position.y = (LAMP.y + BENCH.top) / 2 - 0.05
    lamp.add(foot, post)
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.34, 24).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#2b2d33', roughness: 0.45, metalness: 0.6 }))
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 28), mats.brass)
    bezel.position.z = -0.17
    const glassFront = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), lensMat)
    glassFront.position.z = -0.172
    glassFront.rotation.y = Math.PI
    lampHead.add(housing, bezel, glassFront)
    lampHead.position.y = LAMP.y
    lamp.add(lampHead)
  }
  lamp.position.set(LAMP.x, 0, LAMP.z)
  root.add(lamp)
  const spot = new THREE.SpotLight('#fff1d6', 0, 4, 0.11, 0.5, 1.2)
  const spotAim = new THREE.Object3D()
  root.add(spot, spotAim)
  spot.target = spotAim
  const beamIn = beamMesh(0.075, 0.12, '#fff2d6')
  const beamOn = beamMesh(0.1, 0.13, '#fff2d6')
  const beamOut = beamMesh(0.02, 0.09, '#fff2d6')
  root.add(beamIn.mesh, beamOn.mesh, beamOut.mesh)
  for (const b of [beamIn, beamOn, beamOut]) b.mesh.renderOrder = 3
  const LAMP_POS = new THREE.Vector3(LAMP.x, LAMP.y, LAMP.z)
  const AIMS = ['sand', 'pane', 'edge', 'fibre']
  const TARGET = {
    off: new THREE.Vector3(PANE.x, BENCH.top + 0.25, PANE.z),
    sand: new THREE.Vector3(SAND.x - 0.02, BENCH.top + 0.16, SAND.z + 0.12),
    pane: new THREE.Vector3(PANE.x, BENCH.top + 0.06 + PANE.h / 2, PANE.z),
    edge: new THREE.Vector3(PANE.x, BENCH.top + 0.06 + PANE.h / 2, PANE.z + PANE.w / 2),
    fibre: fibrePath.getPoint(0),
  }
  TARGET.pane.y = TARGET.edge.y
  let aim = 'off'
  let switchT = 0
  let beamK = 0
  let front = 0
  let lampYaw = 0
  let lampPitch = 0
  let paneRot = 0
  const aimAngles = which => {
    const d = TARGET[which].clone().sub(LAMP_POS)
    return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)) }
  }
  const snapLight = () => {
    const ang = aimAngles(aim)
    lampYaw = ang.yaw
    lampPitch = ang.pitch
    paneRot = aim === 'edge' ? Math.PI / 2 : 0
    switchT = 0
    beamK = aim === 'off' ? 0 : 1
    front = aim === 'fibre' ? 1 : 0
  }
  snapLight()
  const setAim = (which, liveSet) => {
    aim = which
    if (liveSet) {
      switchT = 0.55
      front = 0
    } else snapLight()
  }
  ex.add({
    // seen from the bench's corner: the lamp on the right, the three things side by side, the card behind
    id: 'light',
    x: 3.85,
    z: 2.2,
    radius: 2.0,
    label: E.light.label,
    verb: () => E.light.verbs[AIMS[(AIMS.indexOf(aim) + 1) % AIMS.length]],
    panel: panelOf(E.light),
    panelDelay: 2.4,
    focus: { x: 5.45, y: 1.1, z: -0.25, size: 3.0 },
    act: () => {
      const next = AIMS[(AIMS.indexOf(aim) + 1) % AIMS.length]
      setAim(next, true)
      play('tap')
      share('light')
      return at(E.light.says[next], level())
    },
  })
  const lensPos = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const hit = new THREE.Vector3()
  updates.push((dt, t) => {
    const ang = aimAngles(aim)
    lampYaw = damp(lampYaw, ang.yaw, 6, dt)
    lampPitch = damp(lampPitch, ang.pitch, 6, dt)
    lampHead.rotation.set(lampPitch, lampYaw, 0)
    paneRot = damp(paneRot, aim === 'edge' ? Math.PI / 2 : 0, 4, dt)
    pane.rotation.y = paneRot
    if (switchT > 0) switchT -= dt
    beamK = damp(beamK, aim !== 'off' && switchT <= 0 ? 1 : 0, switchT > 0 ? 14 : 5, dt)
    if (aim === 'fibre' && switchT <= 0 && beamK > 0.5) front = Math.min(1.02, front + dt * 0.8)
    else if (aim !== 'fibre') front = 0
    // the beam from the lens to what it shines at
    dir.set(0, 0, -1).applyEuler(lampHead.rotation)
    lensPos.copy(LAMP_POS).addScaledVector(dir, 0.18)
    const T = TARGET[aim]
    const reach = lensPos.distanceTo(T)
    hit.copy(lensPos).addScaledVector(dir, reach)
    const k = beamK
    beamIn.set(lensPos, hit, k * 0.42)
    lensMat.color.set(k > 0.02 ? '#fff4dc' : '#2a2622').multiplyScalar(k > 0.02 ? 1 + 1.6 * k : 1)
    // through the pane: on to the card; anything else stops where it lands
    const through = aim === 'pane' ? k : 0
    const onCard = hit.clone().addScaledVector(dir, (CARD.z + 0.02 - hit.z) / dir.z)
    beamOn.set(hit, onCard, through * 0.36)
    cardSpot.position.set(onCard.x, onCard.y, CARD.z + 0.02)
    cardSpot.material.opacity = through
    // the sand: white all over, glinting, nothing behind
    const onSand = aim === 'sand' ? k : 0
    glassSandMat.emissiveIntensity = onSand * 0.55
    sandHalo.material.opacity = onSand * 0.45
    glintMat.opacity = onSand
    glintMat.size = 0.04 + 0.02 * Math.sin(t * 9)
    // the edge: the far edge glows green, the pane faintly
    const edgeK = aim === 'edge' ? k * span(0.8, 1.0, paneRot / (Math.PI / 2)) : 0
    greenMat.opacity = edgeK
    faintGreen.opacity = edgeK * 0.22
    // the fibre: the light runs round the coil and out of its end
    const fk = aim === 'fibre' ? k : 0
    fibreMat.uniforms.uOn.value = fk
    fibreMat.uniforms.uFront.value = front
    fibreMat.uniforms.uTime.value = t
    const out = fk * span(0.97, 1.02, front)
    fibreEnd.material.opacity = out
    const endP = fibrePath.getPoint(1)
    const endCard = new THREE.Vector3(endP.x, endP.y, CARD.z + 0.02)
    beamOut.set(endP, endCard, out * 0.5)
    fibreSpot.position.set(endP.x, endP.y, CARD.z + 0.02)
    fibreSpot.material.opacity = out * 0.9
    // the spotlight itself, reaching no farther than the light goes
    spot.position.copy(lensPos)
    spotAim.position.copy(hit)
    spot.intensity = k * 9
    spot.distance = aim === 'pane' ? lensPos.distanceTo(onCard) + 0.3 : reach + 0.25
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.4 },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: 1.7, z: 3.8, yaw: Math.atan2(1.7, -0.8) },
    back: { x: 0, z: 9.0, rot: Math.PI },
    stand: { x: -2.2, z: 3.0, rot: Math.atan2(2.2, 1.6) },
    parts: {
      batch: { get step() { return bStep }, get cycle() { return bCycle }, get temp() { return Math.round(temp) }, get busy() { return !!bAnim } },
      blow: { get step() { return wStep }, get n() { return wN }, get made() { return [...made] }, get busy() { return !!wAnim } },
      light: { get aim() { return aim } },
    },
    panels: { batch: panelOf(E.batch), blow: panelOf(E.blow), light: panelOf(E.light) },
    shared: {
      batch: {
        get: batchState,
        set: (s, liveSet) => {
          const st = clamp(Math.round(Number(s?.step) || 0), 0, 4)
          const c = Math.max(0, Math.round(Number(s?.cycle) || 0))
          if (liveSet && !bAnim && c === bCycle && st === bStep + 1) startBatch(B_KIND[bStep])
          else if (liveSet && !bAnim && c === bCycle + 1 && st === 0 && bStep === 4) startBatch('empty')
          else {
            bAnim = null
            bStep = st
            bCycle = c
          }
        },
      },
      blow: {
        get: blowState,
        set: (s, liveSet) => {
          const st = clamp(Math.round(Number(s?.step) || 0), 0, 2)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const list = (Array.isArray(s?.made) ? s.made : []).filter(k => KINDS.includes(k)).slice(-MADE_MAX)
          if (liveSet && !wAnim && n === wN && st === wStep + 1) startBlow(wStep === 0 ? 'blow' : 'more')
          else if (liveSet && !wAnim && n === wN + 1 && st === 0 && wStep === 2) {
            startBlow('make')
            wAnim.shape = list[list.length - 1] ?? KINDS[wN % KINDS.length]
          } else {
            wAnim = null
            wStep = st
            wN = n
            made = list
            rebuildShelf()
          }
        },
      },
      light: {
        get: () => ({ aim }),
        set: (s, liveSet) => {
          const next = ['off', ...AIMS].includes(s?.aim) ? s.aim : 'off'
          if (next !== aim) setAim(next, liveSet)
          else if (!liveSet) snapLight()
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
