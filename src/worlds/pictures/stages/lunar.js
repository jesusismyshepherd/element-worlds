// A stage for picture rooms (docs/knowledge/picture-rooms.md): standing on the Moon, on a rise above a young
// crater (radon's `moon` room: Aristarchus, on its plateau). Grey regolith with small craters and rocks; the
// walking circle is a hilltop, flat behind its middle and tilting gently (`tilt`) toward the crater (-z), then
// past its edge a steep fall that flattens onto the plain `hill` metres below, where the bowl lies with its
// terraced walls, its central peak and a raised rim, the far wall lit by a low Sun from behind; bright rays
// round the rim. (A flat hilltop whose edge bulged hid the bowl's floor from the circle: the tilt and the
// concave fall let the whole bowl be seen.) No air: a black sky with steady stars (they do not twinkle), the
// Earth hanging in it lit from the side, the Sun low with a small glare, long black shadows, nothing hazy
// however far.
//
// lunarStage({ radius, light, pixelRatio, crater, clear, rocks, hill, slopeFrom, tilt, sun, earth }) ->
// { group, groundAt, solids, env, cameraBounds, sunDir, earthDir, sunLight, hemi, update(t), dispose }.
// `crater`: { x, z, r, depth, peak, rim, lip } (metres; the bowl must stay outside the walking circle);
// `clear`: [[x, z, r]] spots kept free of rocks and small craters (stations, the frame). The ground is a real
// surface (`groundAt`), so a scene can stand things on it and let things land on it. The Earth is drawn about
// 3.4 degrees across (from the Moon the real one is about 1.9): bigger, so it reads on a phone.
// Also exported for later Moon rooms: `paintMoonMap(g, w, h, view)` draws a map of the Moon (maria, the
// bright young craters) on a canvas, `MARIA` and `CRATERS` (their selenographic places), `moonDir`.
// Surfaces are mid-toned (a pale floor under the bloom washes everything out): the regolith is a grey that
// the hard sunlight makes bright.
import * as THREE from 'three'
import { canvasTex, clamp, smooth, random } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'
import { rockGeometry } from './mars.js'
import { glowTexture } from './space.js'

const TAU = Math.PI * 2

// ---- the Moon's map: the maria as ellipses (centre latitude and longitude, half-sizes in degrees of
// latitude, a turn), approximations of their outlines from the IAU's centres and diameters ----
export const MARIA = [
  // Oceanus Procellarum, as a few overlapping pieces
  { name: 'Procellarum', lat: 30, lon: -55, a: 20, b: 13, rot: 0.5 },
  { name: 'Procellarum', lat: 12, lon: -52, a: 15, b: 12, rot: 0.2 },
  { name: 'Procellarum', lat: -2, lon: -44, a: 11, b: 9, rot: 0 },
  { name: 'Procellarum', lat: 42, lon: -40, a: 9, b: 8, rot: 0 },
  { name: 'Imbrium', lat: 32.8, lon: -15.6, a: 18, b: 17, rot: 0 },
  { name: 'Insularum', lat: 7.5, lon: -30.9, a: 7, b: 6, rot: 0 },
  { name: 'Cognitum', lat: -10, lon: -23.1, a: 6, b: 5, rot: 0 },
  { name: 'Nubium', lat: -21.3, lon: -16.6, a: 11, b: 9, rot: 0 },
  { name: 'Humorum', lat: -24.4, lon: -38.6, a: 6.4, b: 6, rot: 0 },
  { name: 'Frigoris', lat: 56, lon: 0, a: 6, b: 38, rot: 0 },
  { name: 'Serenitatis', lat: 28, lon: 17.5, a: 11, b: 10, rot: 0 },
  { name: 'Vaporum', lat: 13.3, lon: 3.6, a: 4, b: 4, rot: 0 },
  { name: 'Tranquillitatis', lat: 8.5, lon: 31.4, a: 12, b: 14, rot: 0.3 },
  { name: 'Crisium', lat: 17, lon: 59.1, a: 8, b: 10, rot: 0 },
  { name: 'Fecunditatis', lat: -7.8, lon: 51.3, a: 14, b: 9, rot: 0.2 },
  { name: 'Nectaris', lat: -15.2, lon: 35.5, a: 5.5, b: 5.5, rot: 0 },
  { name: 'Smythii', lat: 1.3, lon: 87.5, a: 6, b: 6, rot: 0 },
  { name: 'Marginis', lat: 13.3, lon: 86.1, a: 5, b: 5, rot: 0 },
  { name: 'Australe', lat: -38.9, lon: 93, a: 9, b: 9, rot: 0, faint: true },
  { name: 'Moscoviense', lat: 27.3, lon: 147.9, a: 4.5, b: 4.5, rot: 0 },
  { name: 'Ingenii', lat: -33.7, lon: 163.5, a: 4, b: 4, rot: 0, faint: true },
  { name: 'Tsiolkovskiy', lat: -20.4, lon: 129.1, a: 2.6, b: 2.6, rot: 0 },
]
/** Craters worth marking: bright young ones (Aristarchus is the brightest big one on the Moon), and
 *  Grimaldi's dark floor. Radius in degrees of latitude. */
export const CRATERS = {
  Aristarchus: { lat: 23.7, lon: -47.4, r: 0.7, bright: 1 },
  Kepler: { lat: 8.1, lon: -38, r: 0.55, bright: 0.8 },
  Copernicus: { lat: 9.6, lon: -20.1, r: 1.6, bright: 0.7 },
  Tycho: { lat: -43.3, lon: -11.4, r: 1.4, bright: 0.85 },
  Grimaldi: { lat: -5.2, lon: -68.6, r: 3.5, bright: -0.6 },
  Plato: { lat: 51.6, lon: -9.4, r: 1.7, bright: -0.5 },
}
/** A unit vector on a globe for a latitude and longitude (degrees), longitude 0 facing +z. */
export function moonDir(lat, lon, out = new THREE.Vector3()) {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180
  return out.set(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo))
}

/** Draws the Moon's surface as a map on a 2D canvas: `view` = { lon0, lon1, lat0, lat1 } (degrees, an
 *  equirectangular piece; the whole Moon by default), highlands light grey, maria darker, the young craters
 *  bright with their rays. `seed` fixes the speckle. Returns the mapping { x(lon), y(lat), dx(deg) }. */
export function paintMoonMap(g, w, h, { lon0 = -180, lon1 = 180, lat0 = -90, lat1 = 90, seed = 7, tone = 1 } = {}) {
  const x = lon => ((lon - lon0) / (lon1 - lon0)) * w
  const y = lat => ((lat1 - lat) / (lat1 - lat0)) * h
  const dx = (lon1 - lon0) / w // degrees a pixel
  const k = tone
  const rgb = (v, a = 1) => `rgba(${Math.round(v * k)},${Math.round(v * k)},${Math.round((v + 8) * k)},${a})`
  g.fillStyle = rgb(148)
  g.fillRect(0, 0, w, h)
  const rnd = random(seed)
  // highland mottling
  for (let i = 0; i < 900; i++) {
    const v = 120 + rnd() * 60
    g.fillStyle = rgb(v, 0.12)
    const s = (2 + rnd() * 10) / (dx * 3)
    g.beginPath()
    g.ellipse(rnd() * w, rnd() * h, s, s * 0.8, 0, 0, TAU)
    g.fill()
  }
  // maria: each a cloud of soft dark patches inside its ellipse, so the edges are ragged and the overlaps
  // merge into one dark sea (plain ellipses read as holes)
  const dy = (lat1 - lat0) / h // degrees a pixel, up and down
  for (const m of MARIA) {
    const cos = Math.max(0.3, Math.cos((m.lat * Math.PI) / 180))
    const n = Math.round(14 + (m.a * m.b) / 5)
    const rot = m.rot ?? 0
    for (let i = 0; i < n; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd())
      // a point in the ellipse (half-sizes b across, a up), turned by rot
      const ex = Math.cos(a) * r * m.b
      const ey = Math.sin(a) * r * m.a
      const lat = m.lat + ex * Math.sin(rot) + ey * Math.cos(rot)
      const lon = m.lon + (ex * Math.cos(rot) - ey * Math.sin(rot)) / cos
      const s = 1.5 + rnd() * 0.45 * Math.min(m.a, m.b) + 1.5
      for (const off of [0, -360, 360]) {
        const cx = x(lon + off)
        if (cx < -w * 0.2 || cx > w * 1.2) continue
        const cy = y(lat)
        const rx = s / cos / dx
        const ry = s / dy
        const grd = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
        const v = m.faint ? 112 : 80
        grd.addColorStop(0, rgb(v, m.faint ? 0.3 : 0.5))
        grd.addColorStop(0.6, rgb(v + 10, m.faint ? 0.18 : 0.32))
        grd.addColorStop(1, rgb(v + 20, 0))
        g.fillStyle = grd
        g.beginPath()
        g.ellipse(cx, cy, rx, ry, 0, 0, TAU)
        g.fill()
      }
    }
  }
  // small craters: faint rings scattered over the highlands
  for (let i = 0; i < 90; i++) {
    const cx = rnd() * w
    const cy = rnd() * h
    const r = (0.6 + rnd() * 2.2) / dx
    g.strokeStyle = rgb(172, 0.14)
    g.lineWidth = Math.max(1, r * 0.25)
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.stroke()
  }
  // the named craters: bright young ones with rays, dark floors
  for (const c of Object.values(CRATERS)) {
    const cx = x(c.lon)
    const cy = y(c.lat)
    const r = c.r / dx
    if (c.bright > 0) {
      g.strokeStyle = rgb(210, 0.18 * c.bright)
      g.lineWidth = Math.max(1, r * 0.5)
      for (let i = 0; i < 9; i++) {
        const a = rnd() * TAU
        const l = r * (5 + rnd() * 9)
        g.beginPath()
        g.moveTo(cx, cy)
        g.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l)
        g.stroke()
      }
      const grd = g.createRadialGradient(cx, cy, 0, cx, cy, r * 3)
      grd.addColorStop(0, rgb(250, 0.95 * c.bright))
      grd.addColorStop(0.35, rgb(225, 0.6 * c.bright))
      grd.addColorStop(1, rgb(200, 0))
      g.fillStyle = grd
      g.beginPath()
      g.arc(cx, cy, r * 3, 0, TAU)
      g.fill()
    } else {
      g.fillStyle = rgb(70, 0.85)
      g.beginPath()
      g.ellipse(cx, cy, r / Math.cos((c.lat * Math.PI) / 180), r, 0, 0, TAU)
      g.fill()
    }
  }
  return { x, y, dx }
}

// ---- the regolith: grey dust with grit, pebbles and the rings of tiny craters (UVs in metres) ----
function regolithTexture({ seed = 3, px = 512 } = {}) {
  const rnd = random(seed)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = '#7d7a86'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 220; i++) {
      g.fillStyle = rnd() < 0.5 ? `rgba(60,58,70,${0.06 + rnd() * 0.1})` : `rgba(150,146,160,${0.06 + rnd() * 0.1})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * h, 8 + rnd() * 40, 6 + rnd() * 30, rnd() * Math.PI, 0, TAU)
      g.fill()
    }
    // tiny craters: a dark bowl, a lit rim on the side away from the light
    for (let i = 0; i < 26; i++) {
      const cx = rnd() * w
      const cy = rnd() * h
      const r = 3 + rnd() * 14
      g.fillStyle = 'rgba(40,38,50,0.28)'
      g.beginPath()
      g.arc(cx, cy, r, 0, TAU)
      g.fill()
      g.strokeStyle = 'rgba(170,166,182,0.35)'
      g.lineWidth = Math.max(1, r * 0.25)
      g.beginPath()
      g.arc(cx, cy, r, -0.4, 2.2)
      g.stroke()
    }
    for (let i = 0; i < 3800; i++) {
      g.fillStyle = rnd() < 0.55 ? `rgba(40,38,48,${0.2 + rnd() * 0.35})` : `rgba(180,176,192,${0.15 + rnd() * 0.3})`
      const s = 1 + rnd() * 2.2
      g.fillRect(rnd() * w, rnd() * h, s, s)
    }
  }, { repeat: true })
}

const STAR_VERT = /* glsl */ `
  attribute float aSize; attribute vec3 color;
  uniform float uScale;
  varying vec3 vColor;
  void main() {
    vColor = color;
    gl_PointSize = aSize * uScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`
const STAR_FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.05, d));
  }`

// the Earth seen from the Moon: oceans, land, ice and cloud from noise, lit by the Sun (a direction in the
// world), its night side dark with a few city lights, a thin blue limb
const EARTH_VERT = /* glsl */ `
  varying vec3 vObj; varying vec3 vN; varying vec3 vView;
  void main() {
    vObj = normalize(position);
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`
const EARTH_FRAG = /* glsl */ `
  uniform vec3 uSun; uniform float uTime;
  varying vec3 vObj; varying vec3 vN; varying vec3 vView;
  float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = 0.5; float s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }
  void main() {
    vec3 d = normalize(vObj);
    float c = cos(uTime * 0.02); float s = sin(uTime * 0.02);
    vec3 q = vec3(c * d.x - s * d.z, d.y, s * d.x + c * d.z);
    float n = fbm(q * 2.2 + 3.0) * 1.12;
    float land = smoothstep(0.55, 0.58, n);
    float lat = abs(d.y);
    vec3 ocean = mix(vec3(0.03, 0.12, 0.32), vec3(0.08, 0.3, 0.62), smoothstep(0.38, 0.55, n));
    vec3 terrain = mix(vec3(0.22, 0.42, 0.18), vec3(0.62, 0.52, 0.32), smoothstep(0.5, 0.7, fbm(q * 5.0 + 7.0)));
    vec3 surf = mix(ocean, terrain, land);
    surf = mix(surf, vec3(0.85, 0.9, 0.96), smoothstep(0.8, 0.88, lat + 0.06 * (n - 0.5)));
    float cl = smoothstep(0.5, 0.76, fbm(q * 3.6 + vec3(uTime * 0.01, 0.0, 0.0)));
    vec3 nn = normalize(vN);
    float nl = dot(nn, uSun);
    float lum = max(nl, 0.0);
    vec3 col = surf * (0.02 + 1.25 * lum);
    col = mix(col, vec3(0.03 + lum * 1.15), cl * 0.8);
    float day = smoothstep(-0.08, 0.15, nl);
    float city = land * smoothstep(0.7, 0.86, vn(q * 120.0)) * smoothstep(0.5, 0.65, fbm(q * 8.0)) * (1.0 - day) * (1.0 - cl);
    col += vec3(1.0, 0.75, 0.4) * city * 0.8;
    float fr = pow(clamp(1.0 - max(dot(nn, normalize(vView)), 0.0), 0.0, 1.0), 3.0);
    col += vec3(0.25, 0.5, 1.0) * fr * (0.05 + 0.9 * day);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

export function lunarStage({
  radius = 9.5, light = false, pixelRatio = 1, crater = null, clear = [], rocks = 90, hill = 10, slopeFrom = 6, tilt = 0.2,
  sun = [0.6, 0.34, 0.72], earth = [-0.56, 0.21, -0.8],
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const sunDir = new THREE.Vector3(...sun).normalize()
  const earthDir = new THREE.Vector3(...earth).normalize()

  // ---- the ground's shape ----
  const cr = crater ? { depth: 13, peak: 9, lip: 0.4, rim: 1.5, ...crater } : null
  const rndC = random(12)
  const isClear = (x, z, m = 0) => clear.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r + m)
  const inBowl = (x, z, m = 1) => cr && Math.hypot(x - cr.x, z - cr.z) < cr.r * m
  // small craters, in the walking circle and round it (not on the stations), more and bigger farther out
  const pits = []
  for (let tries = 0; pits.length < (light ? 70 : 120) && tries < 2000; tries++) {
    const a = rndC() * TAU
    const r = 1.5 + Math.pow(rndC(), 0.7) * 160
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const s = r < radius + 2 ? 0.35 + rndC() * 0.9 : 0.6 + rndC() * (r < 40 ? 2.2 : 6)
    if (isClear(x, z, s + 0.4) || inBowl(x, z, 1.04)) continue
    pits.push({ x, z, r: s, d: s * (0.18 + rndC() * 0.1) })
  }
  const pitAt = (x, z) => {
    let h = 0
    for (const p of pits) {
      const dx = x - p.x
      const dz = z - p.z
      if (Math.abs(dx) > p.r * 1.7 || Math.abs(dz) > p.r * 1.7) continue
      const u = Math.hypot(dx, dz) / p.r
      if (u < 1) h += -p.d * (1 - u * u) + p.d * 0.3 * u * u * u * u
      else if (u < 1.7) h += p.d * 0.3 * Math.exp(-(((u - 1) / 0.28) ** 2))
    }
    return h
  }
  // the walking circle is a hilltop `hill` metres above the plain, so the crater's inside is seen from it
  const far = (x, z) => {
    const r = Math.hypot(x, z)
    const k = smooth(radius + 20, radius + 80, r)
    return k * (1.2 * Math.sin(x * 0.013 + 1.3) * Math.cos(z * 0.011) + 0.8 * Math.sin(x * 0.031 - z * 0.027) + 4 * Math.sin(x * 0.004 + z * 0.0035))
  }
  // toward the crater (-z): flat where the frame stands, a gentle tilt (`tilt`) across the walking circle,
  // then past its edge a steep fall that flattens out on the plain, so nothing hides the bowl from the circle
  // (a hilltop whose edge bulged hid the crater's floor)
  const tE = slopeFrom + radius
  const fwdDrop = z => {
    const t = slopeFrom - z
    if (t <= 0) return 0
    const tt = t < 2 ? (t * t) / 4 : t - 1
    if (t <= tE) return tilt * tt
    const atEdge = tilt * (tE - 1)
    return atEdge + (hill - atEdge) * (1 - Math.exp(-(t - tE) / 7))
  }
  const baseAt = (x, z) => {
    const r = Math.hypot(x, z)
    // (the far swells fade in outside the crater, so its rim stays one level all round)
    const fk = cr ? smooth(1.05, 1.6, Math.hypot(x - cr.x, z - cr.z) / cr.r) : 1
    const down = Math.max(fwdDrop(z), hill * smooth(radius + 1.5, radius + 32, r))
    return -down + far(x, z) * fk
  }
  const bowlAt = (x, z, base) => {
    if (!cr) return base
    const d = Math.hypot(x - cr.x, z - cr.z)
    const u = d / cr.r
    let h
    if (u < 1) {
      // the inner wall: steep under the rim, in slumped terraces, down to a hummocky floor
      const rimLevel = base + cr.rim
      const floor = -hill + cr.rim - cr.depth
      const w = smooth(0.56, 1.0, u)
      const terr = 0.05 * Math.sin(w * Math.PI * 3) * Math.sin(w * Math.PI)
      h = floor + (rimLevel - floor) * (Math.pow(w, 0.8) + terr)
      const a = Math.atan2(z - cr.z, x - cr.x)
      h += (1 - w) * (0.7 * Math.sin(x * 0.17 + 1.2) * Math.cos(z * 0.13) + 0.5 * Math.sin(a * 7 + u * 9))
      // the central peak, a ridge of a few summits
      h += cr.peak * (Math.exp(-((u / 0.12) ** 2)) * (0.8 + 0.2 * Math.sin(a * 3)) + 0.4 * Math.exp(-(((u - 0.08) / 0.07) ** 2)) * Math.max(0, Math.sin(a * 2 + 0.5)))
    } else {
      // outside: the raised rim, its blanket of thrown-out rock thinning away from it
      h = base + cr.rim * Math.exp(-(u - 1) / 0.28)
    }
    return h + cr.lip * Math.exp(-(((u - 1) / 0.015) ** 2))
  }
  const groundAt = (x, z) => bowlAt(x, z, baseAt(x, z)) + pitAt(x, z)

  // ---- the sky: black, steady stars, the Sun low, the Earth ----
  const NS = light ? 900 : 2000
  const sPos = new Float32Array(NS * 3)
  const sCol = new Float32Array(NS * 3)
  const sSize = new Float32Array(NS)
  const rndS = random(1971)
  const tints = [new THREE.Color('#cfe0ff'), new THREE.Color('#fff4e0'), new THREE.Color('#ffd8b8'), new THREE.Color('#bcd2ff')]
  for (let i = 0; i < NS; i++) {
    const yv = rndS() * 1.1 - 0.12
    const a = rndS() * TAU
    const r = Math.sqrt(Math.max(0, 1 - yv * yv))
    sPos.set([Math.cos(a) * r * 1400, yv * 1400, Math.sin(a) * r * 1400], i * 3)
    const c = tints[(rndS() * tints.length) | 0]
    const b = 0.35 + rndS() * 0.5
    sCol.set([c.r * b, c.g * b, c.b * b], i * 3)
    sSize[i] = rndS() < 0.05 ? 2.4 + rndS() * 1.2 : 0.8 + rndS() * 1.1
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3))
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1))
  const stars = new THREE.Points(starGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    uniforms: { uScale: { value: pixelRatio } }, vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
  }))
  stars.frustumCulled = false
  stars.renderOrder = -9
  stars.raycast = () => {}
  group.add(stars)

  const glow = glowTexture(128)
  disposers.push(() => glow.dispose())
  const sprite = (dir, dist, color, size, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.position.copy(dir).multiplyScalar(dist)
    s.scale.setScalar(size)
    s.renderOrder = -8
    s.raycast = () => {}
    group.add(s)
    return s
  }
  // the Sun: a hard white disc (about half a degree), a small glare round it (no sky to scatter it)
  sprite(sunDir, 1300, new THREE.Color('#fff6e8').multiplyScalar(3.2), 34, 1)
  sprite(sunDir, 1300, '#fff0d8', 150, 0.28)
  // the Earth: about 3.4 degrees across here (the real one about 1.9 from the Moon), lit by the same Sun
  const earthU = { uSun: { value: sunDir }, uTime: { value: 0 } }
  const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 32), new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG, fog: false }))
  earthMesh.position.copy(earthDir).multiplyScalar(1350)
  earthMesh.rotation.set(0.4, 0.3, 0.41)
  earthMesh.renderOrder = -7
  group.add(earthMesh)
  sprite(earthDir, 1352, '#4f86ff', 120, 0.16)

  // ---- the ground: one surface from under your feet to the horizon ----
  const regTex = regolithTexture()
  disposers.push(() => regTex.dispose())
  const groundMat = new THREE.MeshStandardMaterial({ map: regTex, vertexColors: true, roughness: 1, metalness: 0 })
  const RMAX = 1300
  const AS = light ? 220 : 360
  // a polar grid: rings every 20 cm across the walking circle (its small craters), then each a few per cent
  // farther than the last out to the horizon
  const rings = [0]
  for (let r = 0; r < radius + 4.5; ) rings.push((r += light ? 0.3 : 0.2))
  for (let r = rings[rings.length - 1]; r < RMAX; ) rings.push((r *= light ? 1.05 : 1.035))
  const RS = rings.length - 1
  {
    const pos = []
    const col = []
    const uv = []
    const idx = []
    const base = new THREE.Color('#aaa6b6')
    const tmp = new THREE.Color()
    for (let i = 0; i <= RS; i++) {
      const r = rings[i]
      for (let j = 0; j <= AS; j++) {
        const a = (j / AS) * TAU
        const x = Math.cos(a) * r
        const z = -Math.sin(a) * r
        const y = groundAt(x, z)
        pos.push(x, y, z)
        uv.push(x / 3.4, z / 3.4)
        // the crater's bright walls and rays (Aristarchus is the brightest big crater on the Moon)
        let k = 1
        if (cr) {
          const d = Math.hypot(x - cr.x, z - cr.z)
          const u = d / cr.r
          const ca = Math.atan2(z - cr.z, x - cr.x)
          if (u < 1) k = 1.08 + 0.32 * smooth(0.5, 0.95, u) - 0.12 * Math.exp(-((u / 0.15) ** 2))
          else {
            const ray = Math.pow(0.5 + 0.5 * Math.sin(ca * 11 + Math.sin(ca * 5) * 2), 10) + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(ca * 17 + 1.7), 14)
            k = 1 + (0.28 * ray + 0.16) * Math.exp(-(u - 1) * 1.6)
          }
        }
        const jitter = 0.94 + 0.06 * Math.sin(x * 0.7 + z * 0.4) * Math.cos(z * 0.9)
        tmp.copy(base).multiplyScalar(k * jitter)
        col.push(tmp.r, tmp.g, tmp.b)
      }
    }
    // wound counter-clockwise seen from above (a ring wound the other way is culled: the sky shows through)
    for (let i = 0; i < RS; i++) {
      for (let j = 0; j < AS; j++) {
        const a = i * (AS + 1) + j
        const b = a + AS + 1
        idx.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const ground = new THREE.Mesh(geo, groundMat)
    ground.receiveShadow = true
    ground.raycast = () => {}
    group.add(ground)
    disposers.push(() => geo.dispose())
  }

  // ---- rocks: small ones on the rim, boulders down the crater's wall and on its floor ----
  const rockMat = new THREE.MeshStandardMaterial({ color: '#5c5866', roughness: 0.95 })
  const rockGeo = rockGeometry(5, 1)
  disposers.push(() => rockGeo.dispose())
  const NR = light ? Math.round(rocks / 2) : rocks
  const rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, NR)
  {
    const o = new THREE.Object3D()
    const rnd = random(23)
    let n = 0
    for (let tries = 0; n < NR && tries < NR * 8; tries++) {
      const inside = cr && rnd() < 0.45
      let x
      let z
      let s
      if (inside) {
        const a = rnd() * TAU
        const u = 0.15 + rnd() * 0.8
        x = cr.x + Math.cos(a) * u * cr.r
        z = cr.z + Math.sin(a) * u * cr.r
        s = 0.8 + rnd() * 2.6
      } else {
        const a = rnd() * TAU
        const r = 1.2 + Math.pow(rnd(), 0.8) * 60
        x = Math.cos(a) * r
        z = Math.sin(a) * r
        if (inBowl(x, z, 1.02)) continue
        s = r < radius + 1 ? 0.05 + rnd() * 0.16 : 0.12 + rnd() * 0.5
      }
      if (isClear(x, z, 0.5)) continue
      o.position.set(x, groundAt(x, z) - s * 0.2, z)
      o.rotation.set(0, rnd() * TAU, 0)
      o.scale.set(s * (1 + rnd() * 0.6), s * (0.45 + rnd() * 0.5), s * (1 + rnd() * 0.5))
      o.updateMatrix()
      rockMesh.setMatrixAt(n++, o.matrix)
    }
    rockMesh.count = n
  }
  rockMesh.castShadow = !light
  rockMesh.receiveShadow = true
  rockMesh.raycast = () => {}
  group.add(rockMesh)

  // ---- light: the Sun hard and low, the ground's own glow filling the shadows a little ----
  const sunLight = new THREE.DirectionalLight('#fff6ea', 3.4)
  sunLight.position.copy(sunDir).multiplyScalar(60)
  sunLight.castShadow = !light
  sunLight.shadow.mapSize.set(2048, 2048)
  const sr = radius + 6
  sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -sr
  sunLight.shadow.camera.right = sunLight.shadow.camera.top = sr
  sunLight.shadow.camera.near = 1
  sunLight.shadow.camera.far = 140
  sunLight.shadow.bias = -0.0005
  sunLight.shadow.normalBias = 0.04
  group.add(sunLight, sunLight.target)
  // no sky light (the sky is black); what fills a shadow is sunlight thrown back by the grey ground
  const hemi = new THREE.HemisphereLight('#2a2c3a', '#7a7682', 0.75)
  group.add(hemi)

  return {
    group,
    groundAt,
    sunDir,
    earthDir,
    sunLight,
    hemi,
    solids: ringWall(radius),
    env: {
      background: new THREE.Color('#010104'),
      exposure: 1.0,
      envIntensity: 0.06,
      bloom: { strength: 0.5, radius: 0.5, threshold: 0.86 },
      fov: 62,
      far: 3000,
      shadows: true,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      earthU.uTime.value = t
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
