// Pieces both of oxygen's wings share: noise (GLSL and JS), screens on stands in the atrium's look
// (dark navy faces, glowing edges in the exhibit colour, gold once discovered), glass that is clear in
// the middle and reflective at the edges (no transmission, so it is cheap and keeps flames visible
// behind it), soft particles, arrows for equations, and the exhibits' interaction and discovery rules.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { Text } from 'troika-three-text'
import { makeText, FONTS } from '../../../engine/text.js'
import { markFound, countFound, isFound } from '../../../engine/progress.js'
import { chem, chemBlocks } from './oxygenText.js'

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const damp = (from, to, rate, dt) => to + (from - to) * Math.exp(-rate * dt)

/** A colour pushed above 1 (text and glows stay bright under tone mapping). */
export const hdr = (c, k = 1) => new THREE.Color(c).multiplyScalar(k)

/** A seeded random generator (mulberry32). */
export function random(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---- noise in JS (canvas textures, displaced geometry) ----

/** Smooth value noise in 2D and 3D, values in 0..1, and fractal sums of it. */
export function makeNoise(seed = 7) {
  const rnd = random(seed)
  const perm = new Uint16Array(512)
  const vals = new Float32Array(256)
  const p = [...Array(256).keys()]
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) vals[i] = rnd()
  const f = t => t * t * t * (t * (t * 6 - 15) + 10)
  const n2 = (x, y) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const X = xi & 255
    const Y = yi & 255
    const a = vals[perm[perm[X] + Y]]
    const b = vals[perm[perm[X + 1] + Y]]
    const c = vals[perm[perm[X] + Y + 1]]
    const d = vals[perm[perm[X + 1] + Y + 1]]
    const u = f(xf)
    const v = f(yf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  const n3 = (x, y, z) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const zi = Math.floor(z)
    const X = xi & 255
    const Y = yi & 255
    const Z = zi & 255
    const u = f(x - xi)
    const v = f(y - yi)
    const w = f(z - zi)
    const h = (i, j, k) => vals[perm[perm[perm[X + i] + Y + j] + Z + k]]
    const l = (a, b, t) => a + (b - a) * t
    return l(
      l(l(h(0, 0, 0), h(1, 0, 0), u), l(h(0, 1, 0), h(1, 1, 0), u), v),
      l(l(h(0, 0, 1), h(1, 0, 1), u), l(h(0, 1, 1), h(1, 1, 1), u), v),
      w,
    )
  }
  const fbm2 = (x, y, oct = 5, gain = 0.5) => {
    let s = 0
    let a = 0.5
    let norm = 0
    for (let i = 0; i < oct; i++) {
      s += a * n2(x, y)
      norm += a
      x *= 2.03
      y *= 2.03
      a *= gain
    }
    return s / norm
  }
  const fbm3 = (x, y, z, oct = 4, gain = 0.5) => {
    let s = 0
    let a = 0.5
    let norm = 0
    for (let i = 0; i < oct; i++) {
      s += a * n3(x, y, z)
      norm += a
      x *= 2.03
      y *= 2.03
      z *= 2.03
      a *= gain
    }
    return s / norm
  }
  return { n2, n3, fbm2, fbm3 }
}

// ---- noise in GLSL ----

/** Simplex noise in 2D and 3D (Ian McEwan, Stefan Gustavson, Ashima Arts; MIT licence), and fbm. */
export const NOISE_GLSL = /* glsl */ `
  vec3 nz_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 nz_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 nz_mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 nz_permute(vec3 x) { return nz_mod289(((x * 34.0) + 10.0) * x); }
  vec4 nz_permute(vec4 x) { return nz_mod289(((x * 34.0) + 10.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = nz_mod289(i);
    vec3 p = nz_permute(nz_permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = nz_mod289(i);
    vec4 p = nz_permute(nz_permute(nz_permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  float fbm3(vec3 p, int oct) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= oct) break;
      s += a * snoise(p);
      p = p * 2.03 + vec3(1.7, 9.2, 3.1);
      a *= 0.5;
    }
    return s;
  }
`

// ---- textures ----

/** A canvas texture: draw(ctx2d, size). */
export function canvasTex(size, draw, { srgb = true, repeat = 0, height = size, mipmaps = true } = {}) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = height
  draw(c.getContext('2d'), size, height)
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.generateMipmaps = mipmaps
  if (!mipmaps) t.minFilter = THREE.LinearFilter
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat, repeat)
  }
  return t
}

/** A soft round dot (sprites, glows). */
export function softDot(size = 128, inner = 0.0, hard = false) {
  return canvasTex(size, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, s * inner * 0.5, s / 2, s / 2, s / 2)
    r.addColorStop(0, 'rgba(255,255,255,1)')
    r.addColorStop(hard ? 0.55 : 0.25, 'rgba(255,255,255,0.75)')
    r.addColorStop(hard ? 0.8 : 0.6, 'rgba(255,255,255,0.22)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.fillRect(0, 0, s, s)
  })
}

/** A height map drawn as a normal map (tangent space), for canvas-made surfaces. */
export function normalFromHeight(heights, size, strength = 2) {
  return canvasTex(size, (g, s) => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const hl = heights[y * s + ((x - 1 + s) % s)]
        const hr = heights[y * s + ((x + 1) % s)]
        const hu = heights[((y - 1 + s) % s) * s + x]
        const hd = heights[((y + 1) % s) * s + x]
        let nx = (hl - hr) * strength
        let ny = (hd - hu) * strength
        const nz = 1
        const l = Math.hypot(nx, ny, nz)
        const i = (y * s + x) * 4
        img.data[i] = ((nx / l) * 0.5 + 0.5) * 255
        img.data[i + 1] = ((ny / l) * 0.5 + 0.5) * 255
        img.data[i + 2] = ((nz / l) * 0.5 + 0.5) * 255
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { srgb: false })
}

// ---- materials ----

/** A label standing in the open (not on a screen): outlined in dark navy so it reads against a bright
 *  sky or a dark wall alike. */
export function label(text, { size = 0.09, color = '#ffffff', anchorX = 'center', maxWidth = Infinity, align = 'center', boost = 1.3 } = {}) {
  return makeText(text, { size, color: hdr(color, boost), anchorX, maxWidth, align, outlineWidth: size * 0.12, outlineColor: '#0b1030' })
}

export const glowMat = (color, k = 1.4, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: k, roughness: 0.4, ...extra })

/** Glass without transmission: clear where you look straight through, reflective toward the edges
 *  (Fresnel), so it costs little and what is inside (a flame, molecules) stays visible. */
export function glass({ color = '#0c1622', opacity = 0.05, edge = 0.6, env = 1.6, side = THREE.FrontSide } = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color, roughness: 0.03, metalness: 0, transparent: true, opacity, envMapIntensity: env, depthWrite: false, side,
    clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1,
  })
  const uEdge = { value: edge }
  m.userData.edge = uEdge
  m.onBeforeCompile = s => {
    s.uniforms.uEdge = uEdge
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uEdge;')
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
        float glassFr = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), 2.6);
        gl_FragColor.a = clamp(opacity + glassFr * uEdge, 0.0, 1.0);`)
  }
  return m
}

// ---- screens ----

const NAVY = new THREE.Color('#0d1233')

/** A screen in the atrium's look: a dark navy face in a glowing frame, a title, one big line and one
 *  small, and a `content` group for anything else (faces +z, centred). setRead(true) turns the frame
 *  gold (discovered). Texts can be changed later (set). */
export function screen({
  width = 2.2, height = 1.3, color = '#8fd0ff', title = '', big = '', small = '', titleSize = 0.12, bigSize = 0.24,
  smallSize = 0.085, bigY = 0.04, smallY = null, depth = 0.08, textBoost = 1.25, glow = 1,
} = {}) {
  textBoost *= Math.sqrt(glow)
  const group = new THREE.Group()
  const base = new THREE.Color(color)
  const gold = new THREE.Color('#ffd166')
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.25 * glow, roughness: 0.4, metalness: 0.2 })
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.1, height + 0.1, depth * 0.7, 3, 0.045), edgeMat)
  const face = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, 3, 0.035),
    new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.3, metalness: 0.25, emissive: '#10173f', emissiveIntensity: 0.7 * glow }),
  )
  face.position.z = depth * 0.25
  group.add(edge, face)
  const z = depth * 0.75 + 0.004
  // a long title or big line is made smaller rather than wrapped onto the line below
  // (Outfit bold runs about 0.56 of its size per character)
  const fit = (text, size) => Math.min(size, (width - 0.3) / Math.max(1, String(text).length * 0.56))
  titleSize = fit(title, titleSize)
  if (big) bigSize = fit(big, bigSize)
  const t = makeText(title, { size: titleSize, color: hdr(color, textBoost), maxWidth: width - 0.24, anchorY: 'top' })
  t.position.set(0, height / 2 - 0.1, z)
  const b = makeText(big, { size: bigSize, color: hdr('#ffffff', textBoost), maxWidth: width - 0.24 })
  b.position.set(0, bigY, z)
  const sm = makeText(small, { font: 'body', size: smallSize, color: hdr('#c9d4ff', textBoost), maxWidth: width - 0.3, anchorY: 'top', lineHeight: 1.2 })
  sm.position.set(0, smallY ?? -height / 2 + 0.3, z)
  const content = new THREE.Group()
  content.position.z = z
  group.add(t, b, sm, content)
  const sync = (text, value) => {
    if (value == null || text.text === value) return
    text.text = value
    text.sync()
  }
  return {
    group,
    content,
    edgeMat,
    width,
    height,
    texts: { title: t, big: b, small: sm },
    front: z,
    set({ title: tt, big: bb, small: ss } = {}) {
      sync(t, tt)
      sync(b, bb)
      sync(sm, ss)
    },
    setRead(read) {
      edgeMat.color.copy(read ? gold : base)
      edgeMat.emissive.copy(read ? gold : base)
    },
  }
}

/** A screen raised on a slim stand and tilted back toward the reader. `look` is the material of the
 *  stand ('white' for the sky deck, 'stone' for the fire chamber). Returns the screen with `group`
 *  replaced by the whole stand (the screen's own group is `panel`). */
export function standingScreen(opts = {}, { top = 1.55, tilt = 0.22, look = 'white', standMat = null } = {}) {
  const s = screen(opts)
  const group = new THREE.Group()
  const h = s.height
  const mat = standMat ?? (look === 'white'
    ? new THREE.MeshStandardMaterial({ color: '#e9edf2', roughness: 0.32, metalness: 0.1 })
    : new THREE.MeshStandardMaterial({ color: '#3a3532', roughness: 0.85, metalness: 0.05 }))
  const legH = top - (h / 2) * Math.cos(tilt) + 0.05
  const leg = new THREE.Mesh(new RoundedBoxGeometry(0.16, legH, 0.12, 2, 0.04), mat)
  leg.position.set(0, legH / 2, -0.12)
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.06, 32), mat)
  foot.position.set(0, 0.03, -0.12)
  group.add(leg, foot)
  s.group.position.set(0, top, 0)
  s.group.rotation.x = -tilt
  group.add(s.group)
  group.traverse(o => {
    if (o.isMesh) o.castShadow = true
  })
  return { ...s, panel: s.group, group }
}

// ---- equations ----

/** An arrow along +x, `length` long, centred, for equations drawn in 3D (the fonts have no →). */
export function arrow(length = 0.5, color = '#ffffff', thick = 0.025) {
  const g = new THREE.Group()
  const mat = new THREE.MeshBasicMaterial({ color: hdr(color, 1.3) })
  const head = thick * 3.2
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(length - head, thick, thick * 0.4), mat)
  shaft.position.x = -head / 2
  const tip = new THREE.Mesh(new THREE.ConeGeometry(head * 0.7, head, 3), mat)
  tip.rotation.z = -Math.PI / 2
  tip.position.x = length / 2 - head / 2
  tip.scale.z = 0.25
  g.add(shaft, tip)
  return g
}

/** A formula split into runs: a leading coefficient, element letters, subscript digits, a final charge.
 *  "2 H2O" -> [2][H][2 sub][O]; "Fe2O3·nH2O" keeps the dot and the n. */
export function formulaRuns(f) {
  const runs = []
  let rest = String(f)
  const coef = rest.match(/^(\d+)\s+/)
  if (coef) {
    runs.push({ t: coef[1], k: 'coef' })
    rest = rest.slice(coef[0].length)
  }
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i]
    const prev = rest[i - 1]
    let k = 'main'
    if (/\d/.test(c) && prev && /[A-Za-z)\d]/.test(prev)) k = 'sub'
    else if (/[+\-−]/.test(c) && i === rest.length - 1 && i > 0) k = 'sup'
    const t = k === 'sup' && c === '-' ? '−' : c
    const last = runs[runs.length - 1]
    if (last && last.k === k && k !== 'coef') last.t += t
    else runs.push({ t, k })
  }
  return runs
}

/** A row of pieces laid out left to right and centred: strings are formulas (with subscripts and
 *  coefficients), numbers are gaps, 'arrow' an arrow, '+' a plus, { text } plain words. The layout is
 *  made once every piece's text is ready. Returns a Group; its userData.width is set then. */
export function equation(pieces, { size = 0.2, color = '#ffffff', gap = 0.1, font = 'display', boost = 1.25 } = {}) {
  const group = new THREE.Group()
  const items = []
  for (const p of pieces) {
    if (p === 'arrow') {
      const a = arrow(size * 2.1, color, size * 0.11)
      group.add(a)
      items.push({ obj: a, width: size * 2.1 })
      continue
    }
    if (typeof p === 'number') {
      items.push({ width: p })
      continue
    }
    const word = typeof p === 'object' || p === '+'
    const text = typeof p === 'object' ? p.text : p
    const col = hdr((typeof p === 'object' && p.color) || color, boost)
    const runs = word ? [{ t: text, k: 'main' }] : formulaRuns(text)
    const texts = runs.map(r => {
      const t = makeTextRaw(r.t, {
        font, color: col, size: r.k === 'sub' || r.k === 'sup' ? size * 0.62 : size,
      })
      t.position.y = r.k === 'sub' ? -size * 0.28 : r.k === 'sup' ? size * 0.34 : 0
      t.userData.kind = r.k
      group.add(t)
      return t
    })
    items.push({ texts })
  }
  let pending = items.reduce((n, it) => n + (it.texts?.length ?? 0), 0)
  const layout = () => {
    let x = 0
    for (const it of items) {
      if (it.texts) {
        let w = 0
        for (const t of it.texts) {
          t.position.x = x + w
          const b = t.textRenderInfo?.blockBounds
          w += (b ? b[2] - b[0] : size * 0.6 * t.text.length) + (t.userData.kind === 'coef' ? size * 0.2 : 0)
        }
        x += w + gap
      } else {
        if (it.obj) it.obj.position.x = x + it.width / 2
        x += it.width + gap
      }
    }
    const total = Math.max(0, x - gap)
    for (const c of group.children) c.position.x -= total / 2
    group.userData.width = total
    group.userData.onLayout?.(total)
  }
  for (const it of items) for (const t of it.texts ?? []) t.sync(() => --pending === 0 && layout())
  if (!pending) layout()
  return group
}

/** A left-anchored troika text, not yet synced: equation syncs it with a callback (troika drops the
 *  callback of a sync asked for after the text has already synced). */
function makeTextRaw(text, { font = 'display', size = 0.2, color = '#ffffff' }) {
  const t = new Text()
  Object.assign(t, { text, font: FONTS[font] ?? font, fontSize: size, color, anchorX: 'left', anchorY: 'middle' })
  return t
}

// ---- particles ----

const POINT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.0, aSize * uScale / max(0.05, -mv.z));
    gl_Position = projectionMatrix * mv;
  }`
const POINT_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 t = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vColor * t.rgb, t.a * vAlpha);
    if (gl_FragColor.a < 0.003) discard;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`

/** Soft round particles simulated on the CPU (sparks, embers, vapour, bubbles). Each particle has a
 *  position, velocity, age, life, size and colour; `step(dt, fn)` moves them, fn(p, dt) may change one.
 *  Sizes are in metres. */
export class Particles {
  constructor(count, { map, additive = true, renderOrder = 5 } = {}) {
    this.count = count
    this.items = Array.from({ length: count }, () => ({
      x: 0, y: -999, z: 0, vx: 0, vy: 0, vz: 0, age: 1, life: 0, size: 0.05, alpha: 0, r: 1, g: 1, b: 1, on: false, k: 0,
    }))
    const geo = new THREE.BufferGeometry()
    this.pos = new Float32Array(count * 3)
    this.size = new Float32Array(count)
    this.alpha = new Float32Array(count)
    this.col = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage))
    this.material = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: map }, uScale: { value: 500 } },
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
    this.points = new THREE.Points(geo, this.material)
    this.points.frustumCulled = false
    this.points.renderOrder = renderOrder
    this.next = 0
  }

  /** A free particle (or the oldest one), started with the given fields. */
  spawn(fields) {
    let p = null
    for (let i = 0; i < this.count; i++) {
      const q = this.items[(this.next + i) % this.count]
      if (!q.on) {
        p = q
        this.next = (this.next + i + 1) % this.count
        break
      }
    }
    if (!p) {
      p = this.items[this.next]
      this.next = (this.next + 1) % this.count
    }
    Object.assign(p, { vx: 0, vy: 0, vz: 0, age: 0, life: 1, size: 0.05, alpha: 1, r: 1, g: 1, b: 1, k: 0 }, fields, { on: true })
    return p
  }

  /** Move every particle; fn(p, dt, t) sets its look (alpha, size, colour) from its age. */
  step(dt, fn, camera, renderer) {
    for (let i = 0; i < this.count; i++) {
      const p = this.items[i]
      if (p.on) {
        p.age += dt
        if (p.age >= p.life) p.on = false
        else {
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.z += p.vz * dt
          fn?.(p, dt, p.age / p.life)
        }
      }
      this.pos[i * 3] = p.on ? p.x : 0
      this.pos[i * 3 + 1] = p.on ? p.y : -9999
      this.pos[i * 3 + 2] = p.on ? p.z : 0
      this.size[i] = p.size
      this.alpha[i] = p.on ? p.alpha : 0
      this.col[i * 3] = p.r
      this.col[i * 3 + 1] = p.g
      this.col[i * 3 + 2] = p.b
    }
    const g = this.points.geometry
    g.attributes.position.needsUpdate = true
    g.attributes.aSize.needsUpdate = true
    g.attributes.aAlpha.needsUpdate = true
    g.attributes.aColor.needsUpdate = true
    if (camera && renderer) {
      const h = renderer.getDrawingBufferSize(TMP2).y
      this.material.uniforms.uScale.value = h * 0.5 * camera.projectionMatrix.elements[5]
    }
  }
}
const TMP2 = new THREE.Vector2()

// ---- words ----

export { chem, chemBlocks, at } from './oxygenText.js'

// ---- exhibits: use, discover, tell ----

/** The rules every exhibit follows. Using one does its action; the first use (and the first after the
 *  level changed) opens its panel and counts a discovery (`O:<wing>:<id>`), later uses let the Atomling
 *  say a line instead, so an exhibit can be played with without a panel each time. An exhibit with no
 *  action always opens its panel. */
export function exhibitSet(ctx, { wing, color, who, busy = null }) {
  const keys = []
  const list = []
  const shown = {}
  const marks = {}
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  /** The progress was replaced (a sign-in): every screen's mark and the count again. */
  const refresh = () => {
    for (const [key, ss] of Object.entries(marks)) for (const s of ss) s.setRead(isFound(key))
    report()
  }
  const refreshPrompt = it => {
    if (ctx.engine?.player?.near === it) ctx.store.set({ prompt: { id: it.id, label: it.label, verb: it.verb } })
  }
  function add({ id, find = id, x, z, radius = 1.8, label, verb, act, panel, say, screen: scr = null }) {
    const key = `O:${wing}:${find}`
    if (!keys.includes(key)) keys.push(key)
    if (scr) {
      ;(marks[key] ??= []).push(scr)
      scr.setRead(isFound(key))
    }
    const it = {
      id,
      x,
      z,
      radius,
      get label() {
        return typeof label === 'function' ? label() : label
      },
      get verb() {
        return typeof verb === 'function' ? verb() : verb
      },
      get found() {
        return isFound(key)
      },
      onUse() {
        const level = ctx.level()
        const result = act ? act() : null
        if (result === false) {
          // still busy (an animation running): say so, rather than nothing happening
          const line = busy?.(level)
          if (line && isFound(key)) ctx.store.set({ speech: { text: chem(line), who, color } })
          return
        }
        const first = markFound(key)
        if (first) for (const s of marks[key] ?? []) s.setRead(true)
        if (!act || first || shown[id] !== level) {
          shown[id] = level
          ctx.showPanel(lv => {
            const p = panel(lv)
            return { ...p, blocks: chemBlocks(p.blocks), title: chem(p.title) }
          })
        } else {
          const line = typeof result === 'string' ? result : say?.(level)
          if (line) ctx.store.set({ speech: { text: chem(line), who, color } })
        }
        report()
        refreshPrompt(it)
      },
    }
    list.push(it)
    return it
  }
  let lastVerb = null
  let lastNear = null
  /** Call every frame: keeps the prompt's verb right when an exhibit's state changes by itself. */
  const sync = () => {
    const near = ctx.engine?.player?.near
    if (!near || !list.includes(near)) {
      lastNear = null
      return
    }
    const v = near.verb
    if (near !== lastNear) {
      lastNear = near
      lastVerb = v
      return
    }
    if (v !== lastVerb) {
      lastVerb = v
      refreshPrompt(near)
    }
  }
  return { add, list, keys, report, refresh, refreshPrompt, sync }
}

/** Calls fn(level) whenever the reader switches between Explorer and Scientist. Returns the unsubscribe. */
export function onLevel(store, fn) {
  let last = store.get().level
  return store.subscribe(s => {
    if (s.level !== last) {
      last = s.level
      fn(last)
    }
  })
}
