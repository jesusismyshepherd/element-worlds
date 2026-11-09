// A stage for picture rooms (docs/knowledge/picture-rooms.md): inside the dome of a great telescope on a
// mountain, a night in the 1920s, like the 100-inch Hooker dome on Mount Wilson. A round observing floor of
// wooden planks, a drum of plaster with an iron gallery round it, and over it the dome: a riveted steel
// shell on arched ribs with a slit open on the sky (a clear, crowded night with the Milky Way, and the
// Andromeda galaxy drawn a little larger than the eye sees it). The dome TURNS: `setDomeAz(az)` swings the
// slit to an azimuth (radians east of north; north is -z) and the sky stays where it is. `skyDir(az, alt)`
// gives a direction in the sky. Warm electric lamps on the drum (a few real lights, the rest only glowing
// globes). `mats` are shared plain materials for the scene's things; `silverCap()` is a drawn matcap for
// polished silver, which a lit metal face in a dark dome cannot show. `domeTelescope()` makes the great
// telescope on its English yoke (the equatorial mounting: the yoke turns about the polar axis, the tube
// about the declination axis between its girders), any aim: `aim(az, alt)`. Walking inside radius
// `walk` (solids for the piers are added by the scene from `telescopeSolids`).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'
import { ringWall, motes } from '../kit.js'

const TAU = Math.PI * 2

/** A direction in the sky from an azimuth (radians east of north, north is -z) and an altitude. */
export const skyDir = (az, alt) => new THREE.Vector3(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt))

/** Polished silver drawn as a matcap (a grey room above, a dark floor, soft windows): the same idea as the
 *  silver in the hall's showcase. */
let silverCapTex = null
export function silverCap() {
  if (silverCapTex) return silverCapTex
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 256)
  for (const [o, col] of [[0, '#b7bdc7'], [0.4, '#7e8591'], [0.62, '#454a55'], [0.82, '#2a2d35'], [1, '#444851']]) base.addColorStop(o, col)
  g.fillStyle = base
  g.fillRect(0, 0, 256, 256)
  for (const [x, y, r, a] of [[88, 70, 34, 0.9], [176, 92, 20, 0.75], [140, 40, 12, 0.7], [60, 150, 12, 0.45]]) {
    const w = g.createRadialGradient(x, y, 0, x, y, r)
    w.addColorStop(0, `rgba(246,248,252,${a})`)
    w.addColorStop(0.5, `rgba(216,222,232,${a * 0.6})`)
    w.addColorStop(1, 'rgba(216,222,232,0)')
    g.fillStyle = w
    g.fillRect(x - r, y - r, 2 * r, 2 * r)
  }
  silverCapTex = new THREE.CanvasTexture(c)
  silverCapTex.colorSpace = THREE.SRGBColorSpace
  silverCapTex.userData.shared = true
  return silverCapTex
}

/** Planks of a worn wooden floor, 2 m of tile. */
function plankTex(light) {
  const px = light ? 256 : 512
  const rnd = random(31)
  return canvasTex(px, px, (g, w) => {
    g.fillStyle = '#4a3a2c'
    g.fillRect(0, 0, w, w)
    const n = 8
    const s = w / n
    for (let i = 0; i < n; i++) {
      const k = 0.85 + rnd() * 0.3
      g.fillStyle = `rgb(${Math.round(112 * k)},${Math.round(86 * k)},${Math.round(58 * k)})`
      g.fillRect(0, i * s + 2, w, s - 4)
      for (let d = 0; d < 26; d++) {
        g.fillStyle = rnd() < 0.5 ? 'rgba(50,34,20,0.25)' : 'rgba(170,134,92,0.18)'
        g.fillRect(rnd() * w, i * s + 3 + rnd() * (s - 6), 20 + rnd() * 90, 1)
      }
      // the butt joints
      g.fillStyle = 'rgba(30,20,12,0.7)'
      g.fillRect(((i * 0.37 + 0.2) % 1) * w, i * s + 2, 2, s - 4)
    }
  }, { repeat: true })
}

/** The drum's wall: pale grey-green paint over a dark dado, a faint stain here and there. */
function drumTex() {
  const rnd = random(7)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#7c8077'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 400; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(60,64,56,0.04)' : 'rgba(210,214,200,0.04)'
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, 4 + rnd() * 16, 0, TAU)
      g.fill()
    }
    g.fillStyle = '#34322e'
    g.fillRect(0, w * 0.66, w, w * 0.34)
    g.fillStyle = '#26241f'
    g.fillRect(0, w * 0.66 - 3, w, 5)
  }, { repeat: true })
}

/** Riveted plates of the dome's shell, painted dark grey-green; one tile is a plate. */
function plateTex() {
  const rnd = random(19)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#585e60'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 600; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(30,34,34,0.05)' : 'rgba(150,158,152,0.05)'
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, 3 + rnd() * 12, 0, TAU)
      g.fill()
    }
    g.strokeStyle = 'rgba(24,26,28,0.85)'
    g.lineWidth = 4
    g.strokeRect(2, 2, w - 4, w - 4)
    g.fillStyle = 'rgba(150,156,150,0.8)'
    for (let i = 0; i < 8; i++) {
      for (const e of [14, w - 14]) {
        g.beginPath()
        g.arc(e, 12 + (i * (w - 24)) / 7, 3, 0, TAU)
        g.arc(12 + (i * (w - 24)) / 7, e, 3, 0, TAU)
        g.fill()
      }
    }
  }, { repeat: true })
}

/** A soft galaxy: an elongated glow with a bright core, a dark lane and two small companions. */
function galaxyTex() {
  return canvasTex(512, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.save()
    g.translate(w / 2, h / 2)
    g.scale(1, 0.34)
    const halo = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.46)
    halo.addColorStop(0, 'rgba(255,240,215,0.95)')
    halo.addColorStop(0.12, 'rgba(238,226,208,0.7)')
    halo.addColorStop(0.4, 'rgba(176,186,214,0.32)')
    halo.addColorStop(1, 'rgba(120,140,200,0)')
    g.fillStyle = halo
    g.fillRect(-w / 2, -w / 2, w, w)
    g.restore()
    // a thin dark lane of dust along the near side
    g.strokeStyle = 'rgba(20,18,30,0.28)'
    g.lineWidth = 4
    g.beginPath()
    g.ellipse(w / 2, h / 2 + 4, w * 0.3, h * 0.07, 0, Math.PI * 1.05, Math.PI * 1.95)
    g.stroke()
    // two small companions (M32 and M110)
    for (const [x, y, rx, ry] of [[w / 2 + 52, h / 2 + 34, 13, 11], [w / 2 - 112, h / 2 - 38, 30, 14]]) {
      const c = g.createRadialGradient(x, y, 0, x, y, rx)
      c.addColorStop(0, 'rgba(255,240,220,0.8)')
      c.addColorStop(1, 'rgba(255,240,220,0)')
      g.save()
      g.translate(x, y)
      g.scale(1, ry / rx)
      g.translate(-x, -y)
      g.fillStyle = c
      g.fillRect(x - rx, y - rx, rx * 2, rx * 2)
      g.restore()
    }
  })
}

/** The Milky Way (a band of light round a great circle, a dark lane of dust along it) as an additive shader
 *  on a sphere just inside the stars. */
function milkyWay({ az, el, tilt }, k) {
  const core = skyDir(az, el)
  const across = new THREE.Vector3(0, 1, 0).cross(core).normalize()
  const bandNormal = new THREE.Vector3().crossVectors(core, across).normalize().applyAxisAngle(core, tilt)
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: { uN: { value: bandNormal }, uCore: { value: core }, uK: { value: k } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uN; uniform vec3 uCore; uniform float uK;
      varying vec3 vDir;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise(vec3 x) {
        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.07; a *= 0.5; } return v; }
      void main() {
        vec3 d = normalize(vDir);
        float b = dot(d, uN);
        float mid = max(dot(d, uCore), 0.0);
        float w = 0.13 + 0.12 * pow(mid, 3.0);
        float band = exp(-b * b / (w * w));
        float clouds = fbm(d * 7.0);
        float lane = exp(-pow((b - 0.015 + 0.02 * sin(dot(d, vec3(9.0, 4.0, 7.0)))) / 0.03, 2.0)) * smoothstep(0.1, 0.8, mid + fbm(d * 11.0) * 0.5);
        float kk = band * (0.25 + 1.1 * clouds * clouds) * (1.0 - 0.8 * lane) * (0.35 + 1.2 * pow(mid, 5.0));
        float up = smoothstep(0.0, 0.3, d.y);
        vec3 col = mix(vec3(0.52, 0.58, 0.85), vec3(1.0, 0.86, 0.66), pow(mid, 4.0));
        gl_FragColor = vec4(col * kk * 0.32 * uK * up, 1.0);
      }`,
  })
  const m = new THREE.Mesh(new THREE.SphereGeometry(860, 64, 32), mat)
  m.renderOrder = -9.5
  m.frustumCulled = false
  return m
}

/**
 * radius: the drum's inner radius; drum: its height (the dome springs from there); slit: half its width as an
 * angle (radians); andromeda: { az, alt } where the galaxy hangs; milky: the Milky Way's middle and tilt;
 * lamps: how many globes round the wall. Everything that is fixed is in `group`; `shell` (the dome with its
 * slit) is what turns.
 */
export function domeStage({
  radius = 10.5, drum = 4.2, slit = 0.22, light = false, pixelRatio = 1,
  andromeda = { az: 0.95, alt: 1.0 }, milky = { az: 5.9, el: 0.6, tilt: 0.8 }, lamps = 8,
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const keep = t => (textures.push(t), t)
  const disposers = []
  const solids = ringWall(radius - 0.9)
  const WALK = radius - 0.9

  // ---- materials ----
  const plank = keep(plankTex(light))
  plank.repeat.set(1 / 2, 1 / 2)
  const drumMap = keep(drumTex())
  drumMap.repeat.set(10, 1)
  const plate = keep(plateTex())
  const mats = {
    floor: new THREE.MeshStandardMaterial({ map: plank, roughness: 0.78 }),
    drum: new THREE.MeshStandardMaterial({ map: drumMap, roughness: 0.95, side: THREE.BackSide }),
    shell: new THREE.MeshStandardMaterial({ map: plate, roughness: 0.85, metalness: 0.15, side: THREE.BackSide }),
    steel: new THREE.MeshStandardMaterial({ color: '#79818c', roughness: 0.42, metalness: 0.55 }),
    iron: new THREE.MeshStandardMaterial({ color: '#2e3136', roughness: 0.7, metalness: 0.4 }),
    dark: new THREE.MeshStandardMaterial({ color: '#17181b', roughness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.32, metalness: 0.8 }),
    wood: new THREE.MeshStandardMaterial({ color: '#5b3d29', roughness: 0.65 }),
    concrete: new THREE.MeshStandardMaterial({ color: '#85857d', roughness: 0.95 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.35, roughness: 0.08 }),
    paper: new THREE.MeshStandardMaterial({ color: '#d9d2bd', roughness: 0.9 }),
  }

  // ---- floor, drum, gallery ----
  const floorGeo = new THREE.CircleGeometry(radius, 96)
  {
    const uv = floorGeo.attributes.uv
    const p = floorGeo.attributes.position
    for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i), p.getY(i))
  }
  const floor = new THREE.Mesh(floorGeo, mats.floor)
  floor.rotation.x = -Math.PI / 2
  group.add(floor)
  const drumMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, drum, 96, 1, true), mats.drum)
  drumMesh.position.y = drum / 2
  group.add(drumMesh)
  // pilasters of iron round the drum
  const pilaster = new THREE.BoxGeometry(0.34, drum, 0.3)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU
    const p = new THREE.Mesh(pilaster, mats.iron)
    p.position.set(Math.sin(a) * (radius - 0.14), drum / 2, -Math.cos(a) * (radius - 0.14))
    p.rotation.y = -a
    group.add(p)
  }
  // the gallery: a ring of grating at 2.6 m, a rail on its inner edge, brackets under it
  const GY = 2.6
  const gal = new THREE.Mesh(new THREE.RingGeometry(radius - 1.15, radius - 0.02, 96), mats.iron)
  gal.rotation.x = -Math.PI / 2
  gal.position.y = GY
  group.add(gal)
  const galEdge = new THREE.Mesh(new THREE.TorusGeometry(radius - 1.15, 0.05, 6, 96), mats.iron)
  galEdge.rotation.x = Math.PI / 2
  galEdge.position.y = GY
  group.add(galEdge)
  const rail = new THREE.Mesh(new THREE.TorusGeometry(radius - 1.2, 0.035, 6, 96), mats.brass)
  rail.rotation.x = Math.PI / 2
  rail.position.y = GY + 1.0
  const rail2 = rail.clone()
  rail2.position.y = GY + 0.5
  group.add(rail, rail2)
  const post = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6)
  const brackets = new THREE.BoxGeometry(0.08, 0.7, 0.9)
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU
    const r = radius - 1.2
    const p = new THREE.Mesh(post, mats.iron)
    p.position.set(Math.sin(a) * r, GY + 0.5, -Math.cos(a) * r)
    group.add(p)
    if (i % 4 === 0) {
      const b = new THREE.Mesh(brackets, mats.iron)
      b.position.set(Math.sin(a) * (radius - 0.6), GY - 0.38, -Math.cos(a) * (radius - 0.6))
      b.rotation.y = -a
      group.add(b)
    }
  }
  // an iron stair up to the gallery, along the wall (for the look: it stands outside the walking ring)
  {
    const stair = new THREE.Group()
    const steps = 13
    const run = 0.3
    const rise = GY / steps
    for (let i = 0; i < steps; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, run + 0.04), mats.iron)
      s.position.set(0, rise * (i + 1) - 0.025, -i * run)
      stair.add(s)
      const r = new THREE.Mesh(new THREE.BoxGeometry(1.0, rise - 0.02, 0.03), mats.dark)
      r.position.set(0, rise * i + rise / 2, -i * run + run / 2)
      stair.add(r)
    }
    for (const x of [-0.52, 0.52]) {
      const rl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, Math.hypot(steps * run, GY)), mats.brass)
      rl.position.set(x, GY / 2 + 0.9, -(steps * run) / 2 + run / 2)
      rl.rotation.x = Math.atan2(GY, steps * run)
      stair.add(rl)
    }
    const a = 2.15
    stair.position.set(Math.sin(a) * (radius - 0.55), 0, -Math.cos(a) * (radius - 0.55))
    // climbs along the wall: its steps run tangent to the drum
    stair.rotation.y = -a + Math.PI / 2
    group.add(stair)
  }

  // ---- lamps: globes on the drum wall, a few of them real lights ----
  const globeMat = new THREE.MeshStandardMaterial({ color: '#fff0d4', emissive: '#ffc880', emissiveIntensity: 1.6, roughness: 0.4 })
  const globeGeo = new THREE.SphereGeometry(0.16, 14, 10)
  const arm = new THREE.BoxGeometry(0.05, 0.05, 0.5)
  const real = light ? [1, 3, 5, 7] : [0, 1, 2, 3, 4, 5, 6, 7]
  for (let i = 0; i < lamps; i++) {
    const a = ((i + 0.5) / lamps) * TAU
    const r = radius - 0.35
    const x = Math.sin(a) * r
    const z = -Math.cos(a) * r
    const y = 3.35
    const g = new THREE.Mesh(globeGeo, globeMat)
    g.position.set(x - Math.sin(a) * 0.38, y, z + Math.cos(a) * 0.38)
    const bracket = new THREE.Mesh(arm, mats.brass)
    bracket.position.set(x - Math.sin(a) * 0.15, y, z + Math.cos(a) * 0.15)
    bracket.rotation.y = -a
    group.add(g, bracket)
    if (real.includes(i)) {
      const p = new THREE.PointLight('#ffd8a0', light ? 26 : 24, 22, 2)
      p.position.set(x - Math.sin(a) * 1.2, y - 0.3, z + Math.cos(a) * 1.2)
      group.add(p)
    }
  }
  // a pendant lamp from the dome over the telescope, for the middle of the room
  group.add(new THREE.HemisphereLight('#6f7aa0', '#2c2218', light ? 1.1 : 0.9))
  const dust = motes({ count: 140, radius: radius - 2, y0: 0.4, y1: 10, color: '#ffe2b8', size: 0.02, opacity: 0.22, speed: 0.04, light })
  group.add(dust.group)

  // ---- the sky behind the slit, fixed in space ----
  const sky = new THREE.Group()
  group.add(sky)
  const stars = nightSky({ radius: 900, stars: light ? 1500 : 3400, top: '#020309', mid: '#05081a', horizon: '#0b1228', pixelRatio })
  sky.add(stars)
  sky.add(milkyWay(milky, light ? 0.8 : 1))
  const gtex = keep(galaxyTex())
  const galaxy = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5),
    new THREE.MeshBasicMaterial({ map: gtex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, opacity: 1 }),
  )
  const gdir = skyDir(andromeda.az, andromeda.alt)
  galaxy.position.copy(gdir).multiplyScalar(820)
  galaxy.lookAt(0, 0, 0)
  galaxy.rotateZ(0.55)
  galaxy.scale.setScalar(150)
  galaxy.renderOrder = -9
  sky.add(galaxy)

  // ---- the dome: a shell of plates on ribs, with a slit that turns ----
  const shell = new THREE.Group()
  shell.position.y = drum
  group.add(shell)
  const N = 72
  const M = 14
  const R = radius + 0.1
  const P = (az, alt, r = R) => new THREE.Vector3(Math.sin(az) * Math.cos(alt) * r, Math.sin(alt) * r, -Math.cos(az) * Math.cos(alt) * r)
  const wrap = a => Math.abs(((a + Math.PI) % TAU + TAU) % TAU - Math.PI)
  {
    const pos = []
    const nor = []
    const uvs = []
    const tri = (a, b, c, ua, ub, uc) => {
      const cx = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a))
      const mid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3)
      if (cx.dot(mid) < 0) [b, c, ub, uc] = [c, b, uc, ub]
      for (const [v, u] of [[a, ua], [b, ub], [c, uc]]) {
        pos.push(v.x, v.y, v.z)
        const n = v.clone().normalize()
        nor.push(n.x, n.y, n.z)
        uvs.push(u[0], u[1])
      }
    }
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * TAU
      const a1 = ((i + 1) / N) * TAU
      const am = (a0 + a1) / 2
      for (let j = 0; j < M; j++) {
        const e0 = (j / M) * (Math.PI / 2)
        const e1 = ((j + 1) / M) * (Math.PI / 2)
        const em = (e0 + e1) / 2
        if (wrap(am) < slit) continue
        if (wrap(am - Math.PI) < slit * 0.9 && em > Math.PI / 2 - 0.2) continue
        const p00 = P(a0, e0)
        const p10 = P(a1, e0)
        const p01 = P(a0, e1)
        const p11 = P(a1, e1)
        // plates: about 1.3 m by 1.3 m, one tile each
        const u0 = i * 0.72
        const v0 = j * 1.0
        tri(p00, p10, p11, [u0, v0], [u0 + 0.72, v0], [u0 + 0.72, v0 + 1])
        tri(p00, p11, p01, [u0, v0], [u0 + 0.72, v0 + 1], [u0, v0 + 1])
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    shell.add(new THREE.Mesh(geo, mats.shell))
  }
  // ribs: arches of steel from the drum to the zenith, skipping the slit
  const arch = (az, r = R - 0.08, tube = 0.1) => {
    const pts = []
    for (let k = 0; k <= 24; k++) pts.push(P(az, (k / 24) * (Math.PI / 2 - 0.04), r))
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, tube, 6), mats.steel)
  }
  for (let i = 0; i < 18; i++) {
    const az = (i / 18) * TAU
    if (wrap(az) < slit + 0.05 || wrap(az - Math.PI) < slit + 0.05) continue
    shell.add(arch(az))
  }
  // the slit's edges: stout curbs along both sides and over the top
  for (const s of [-1, 1]) shell.add(arch(s * slit, R - 0.04, 0.14))
  // horizontal rings, cut by the slit
  for (const alt of [0.04, 0.42, 0.78, 1.1, 1.35]) {
    const rr = R - 0.08
    const pts = []
    const lo = slit
    const hi = TAU - slit
    for (let k = 0; k <= 72; k++) pts.push(P(lo + (k / 72) * (hi - lo), alt, rr))
    shell.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, alt < 0.1 ? 0.16 : 0.08, 6), mats.steel))
  }
  // the rail the shutters run on, at the dome's foot, and a big wheel-track
  const foot = new THREE.Mesh(new THREE.TorusGeometry(R * Math.cos(0.02) - 0.12, 0.12, 6, 96), mats.iron)
  foot.rotation.x = Math.PI / 2
  shell.add(foot)
  // a pendant lamp from the shell on each side of the slit
  for (const s of [-1, 1]) {
    const az = s * 1.6
    const top = P(az, 1.0, R - 0.1)
    const drop = 2.2
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, drop, 4), mats.dark)
    cord.position.set(top.x, top.y - drop / 2, top.z)
    const g = new THREE.Mesh(globeGeo, globeMat)
    g.position.set(top.x, top.y - drop - 0.1, top.z)
    shell.add(cord, g)
  }

  const setDomeAz = az => {
    shell.rotation.y = -az
    api.domeAz = az
  }

  const api = {
    group,
    shell,
    mats,
    solids,
    walk: WALK,
    domeAz: 0,
    setDomeAz,
    skyDir,
    andromeda: { dir: gdir, az: andromeda.az, alt: andromeda.alt },
    sky,
    drum,
    radius,
    env: {
      background: new THREE.Color('#05060a'),
      fog: new THREE.Fog('#0a0c12', 40, 110),
      exposure: 1.0,
      envIntensity: 0.18,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
      fov: 62,
      far: 3200,
    },
    cameraBounds: { minX: -7.4, maxX: 7.4, minY: 0.35, maxY: 12, minZ: -8.2, maxZ: 8.9 },
    update(t) {
      stars.userData.update?.(t)
      dust.update(t)
    },
    dispose() {
      textures.forEach(t => t.dispose())
      disposers.forEach(f => f())
    },
  }
  setDomeAz(0)
  return api
}

/**
 * The great telescope on its English yoke, standing at (x, z) with its polar axis tilting up to the north
 * (-z) at the latitude (34.2 degrees for Mount Wilson). `aim(az, alt)` points it. The group is the telescope
 * and its two piers; `solids` keep a walker out from under it. The mirror's end (the cell) is closed with a
 * cover: the mirror itself is out, on the floor.
 */
export function domeTelescope({ x = 0, z = -3.2, y = 3.4, lat = 0.597, mats, light = false } = {}) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)
  const centre = new THREE.Vector3(0, y, 0)
  const p = new THREE.Vector3(0, Math.sin(lat), -Math.cos(lat)) // the polar axis, up toward the pole
  const half = 4.6
  const north = centre.clone().addScaledVector(p, half)
  const south = centre.clone().addScaledVector(p, -half)
  const concrete = mats.concrete
  // piers: a tall tapering block to the north bearing and a stout low one to the south
  const pier = (top, w, d) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, top.y - 0.4, d, 2, 0.05), concrete)
    m.position.set(top.x, (top.y - 0.4) / 2 - 0.0, top.z - 0.0)
    group.add(m)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 0.3, 24), mats.steel)
    cap.position.set(top.x, top.y - 0.25, top.z)
    group.add(cap)
    const bearing = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), mats.steel)
    bearing.position.copy(top)
    group.add(bearing)
  }
  pier(north, 1.7, 1.7)
  pier(south, 1.5, 1.5)
  // the yoke and everything that moves with the sky
  const yoke = new THREE.Group()
  group.add(yoke)
  // the polar axle through the yoke's ends
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, half * 2, 18), mats.steel)
  yoke.add(axle)
  const girder = (sx) => {
    const g = new THREE.Mesh(new RoundedBoxGeometry(0.5, half * 1.8, 0.8, 2, 0.04), mats.iron)
    g.position.x = sx * 1.7
    yoke.add(g)
    for (let k = -3; k <= 3; k++) {
      const web = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.1, 0.84), mats.steel)
      web.position.set(sx * 1.7, k * 1.2, 0)
      yoke.add(web)
    }
  }
  girder(-1)
  girder(1)
  for (const end of [-1, 1]) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.55, 0.8), mats.iron)
    cross.position.y = end * half * 0.95
    yoke.add(cross)
  }
  // the declination axle between the girders, where the tube hangs
  const dec = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.9, 14), mats.steel)
  dec.rotation.z = Math.PI / 2
  yoke.add(dec)
  for (const s of [-1, 1]) {
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 20), mats.brass)
    hub.rotation.z = Math.PI / 2
    hub.position.x = s * 2.0
    yoke.add(hub)
  }
  // the tube: an open truss from the cell (-2.6) to the top ring (+3.6)
  const tube = new THREE.Group()
  yoke.add(tube)
  const W = 0.85 // half width
  const trussMat = mats.steel
  const strut = (len, a, b, rot) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, len, 0.1), trussMat)
    m.position.set(a, (b[0] + b[1]) / 2, rot)
    return m
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.11, 6.2, 0.11), trussMat)
      m.position.set(sx * W, 0.5, sz * W)
      tube.add(m)
    }
  }
  for (let k = 0; k <= 6; k++) {
    const yy = -2.55 + k * 1.0
    for (const [w, d, ox, oz] of [[2 * W, 0.08, 0, W], [2 * W, 0.08, 0, -W], [0.08, 2 * W, W, 0], [0.08, 2 * W, -W, 0]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), trussMat)
      m.position.set(ox, yy, oz)
      tube.add(m)
    }
  }
  // diagonals on the long faces
  for (let k = 0; k < 6; k++) {
    for (const sz of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.18, 0.05), trussMat)
      m.position.set(0, -2.05 + k * 1.0, sz * W)
      m.rotation.z = (k % 2 ? 1 : -1) * 1.0
      tube.add(m)
    }
  }
  // the cell at the lower end (covered, the mirror is out) and the cage at the top
  const cell = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.5, 28), mats.iron)
  cell.position.y = -2.85
  const cover = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.06, 28), mats.steel)
  cover.position.y = -2.58
  const cage = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.9, 1.5, 2, 0.08), mats.iron)
  cage.position.y = 3.75
  const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.3, 16), mats.brass)
  eye.position.set(0, 3.75, 0.9)
  eye.rotation.x = Math.PI / 2
  tube.add(cell, cover, cage, eye)

  const dir = new THREE.Vector3()
  const basis = new THREE.Matrix4()
  const xN = new THREE.Vector3()
  const zN = new THREE.Vector3()
  const tmp = new THREE.Quaternion()
  const state = { az: 0, alt: 1.0 }
  /** Point the tube at (az, alt): the yoke follows, its girders each side of the tube. */
  const aim = (az, alt) => {
    state.az = az
    state.alt = alt
    dir.copy(skyDir(az, alt))
    // the declination axis is across both the polar axis and the tube
    xN.crossVectors(dir, p)
    if (xN.lengthSq() < 1e-6) xN.set(1, 0, 0)
    xN.normalize()
    // the yoke's frame: x along the declination axis, y along the polar axis
    zN.crossVectors(xN, p).normalize()
    basis.makeBasis(xN, p, zN)
    yoke.quaternion.setFromRotationMatrix(basis)
    yoke.position.copy(centre)
    // the tube in the world, then into the yoke's frame
    const zT = new THREE.Vector3().crossVectors(xN, dir).normalize()
    basis.makeBasis(xN, dir, zT)
    tmp.setFromRotationMatrix(basis)
    tube.quaternion.copy(yoke.quaternion).invert().multiply(tmp)
  }
  aim(0, 1.0)

  const solids = [circle(x, z + 3.6, 2.0), circle(x, z, 2.3), circle(x, z - 3.8, 1.7)]
  return { group, aim, tube, yoke, state, centre, solids, mouth: () => centre.clone().addScaledVector(dir, 3.9) }
}
