// Silicon's picture "Why is a valley named after silicon?" as a room (docs/knowledge/picture-rooms.md): a
// hilltop at night above the Santa Clara Valley, the picture's golden chip rising over the far hills like
// a sun. Three things to do: a lever at the lookout runs the valley from its orchards of 1950 to today (the
// moments light up: Shockley 1956, Fairchild 1957, Noyce's chip 1959, Intel 1968, the name in 1971); a
// giant transistor on the hill switches a lamp (gate on, electrons flow from source to drain); the Intel
// 4004's 2300 transistors as lights, zoomed out twice, each light a whole 4004, to a phone chip's 12
// billion. Beside the path, Berzelius's brown silicon of 1824, where the story started. All three are
// shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, screen, hdr } from '../../../wings/noble/kit.js'
import { nightStage } from '../../stages/night.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { VALLEY_WORDS } from './valley.words.js'

export const WORDS = VALLEY_WORDS

const TAU = Math.PI * 2
const R = 11 // the summit's walkable circle
const DROP = 4 // the valley floor below it (more, and the summit's edge hides the valley near it)
const NOW = 2026 // "today" on the lever (shown as the word, never as a year)
const STEPS = [1950, 1956, 1957, 1959, 1968, 1971, NOW]
const KEYS = ['y1950', 'y1956', 'y1957', 'y1959', 'y1968', 'y1971', 'today']
const GOLD = '#ffcf5a'

// where things stand on the hill. The spawn looks north (-z) over the valley to the chip, near the
// summit's north edge: from farther back the edge hides the valley below. A fence across the summit
// (CHORD) closes off its back, behind the frame.
const SPAWN = { x: 0, z: -2.4 }
const BACK = { x: 0, z: 1.9 }
const CHORD = 2.7
const STAND = { x: -2.7, z: -3.9 }
const HOST = { x: 2.0, z: -3.4 }
const LOOK = { x: 0, z: -8.6 } // the lookout, where the lever is used
const LEVER = { x: -2.4, z: -8.2 } // beside the lookout, out of the view over the valley
const T = { x: -7.4, z: -3.4 } // the transistor
const C = { x: 7.4, z: -3.4 } // the 4004
const VIAL = { x: 1.6, z: -6.1 }
const CHIP = { y: 12.5, z: -128, size: 18 } // the chip rising over the hills

/** The latest moment at or before year y (an index into STEPS). */
const stepIndex = y => {
  let i = 0
  for (let k = 0; k < STEPS.length; k++) if (STEPS[k] <= y + 0.01) i = k
  return i
}
/** A whole number with a space between thousands (none in four digits), as the site writes them. */
const grouped = n => {
  const s = String(Math.round(n))
  return s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
/** A rod from a to b (Vector3s). */
function rod(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat)
  m.position.copy(a).addScaledVector(d, 0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
  return m
}
const faceTo = (o, x, z) => (o.rotation.y = Math.atan2(x - o.position.x, z - o.position.z))
const v3 = (x, y, z) => new THREE.Vector3(x, y, z)

/** A soft additive glow fading upward (a moment's beam of light, the chip's rays). */
function glowMaterial(color, { power = 1.6, alpha = 0.55, across = 1 } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uK: { value: 0 }, uAcross: { value: across }, uColor: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform float uAcross; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float across = mix(1.0, smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x), uAcross);
        float a = uK * pow(1.0 - vUv.y, ${power.toFixed(2)}) * ${alpha.toFixed(2)};
        gl_FragColor = vec4(uColor * 1.6, a * (0.4 + 0.6 * across));
      }`,
  })
}

// ---- the chip over the hills, as the picture draws it: a dark package with golden pins, a golden die,
// bond wires, rays and a glow ----

function chipSun() {
  const group = new THREE.Group()
  const S = CHIP.size
  const face = canvasTex(1024, 1024, (g, w) => {
    g.clearRect(0, 0, w, w)
    g.beginPath()
    g.roundRect(10, 10, w - 20, w - 20, 80)
    g.fillStyle = '#1f1946'
    g.fill()
    g.lineWidth = 12
    g.strokeStyle = '#d9a640'
    g.stroke()
    const d0 = w * 0.3
    const d1 = w * 0.7
    g.strokeStyle = 'rgba(236,196,110,0.75)'
    g.lineWidth = 5
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5) / 9
      const a = lerp(d0 + 24, d1 - 24, t)
      const b = lerp(w * 0.13, w * 0.87, t)
      for (const [x0, y0, x1, y1] of [[a, d0, b, w * 0.06], [a, d1, b, w * 0.94], [d0, a, w * 0.06, b], [d1, a, w * 0.94, b]]) {
        g.beginPath()
        g.moveTo(x0, y0)
        g.lineTo(x1, y1)
        g.stroke()
      }
    }
    g.fillStyle = '#d8a23c'
    g.fillRect(d0, d0, d1 - d0, d1 - d0)
    const r = random(4004)
    for (let i = 0; i < 28; i++) {
      g.fillStyle = r() < 0.5 ? '#f6d488' : '#b98327'
      g.fillRect(d0 + 14 + r() * (d1 - d0 - 100), d0 + 14 + r() * (d1 - d0 - 90), 30 + r() * 60, 22 + r() * 46)
    }
    g.strokeStyle = 'rgba(110,70,16,0.55)'
    g.lineWidth = 3
    for (let i = 1; i < 8; i++) {
      const y = lerp(d0, d1, i / 8)
      g.beginPath()
      g.moveTo(d0 + 8, y)
      g.lineTo(d1 - 8, y)
      g.stroke()
    }
  })
  const faceMesh = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshBasicMaterial({ map: face, transparent: true, fog: false, color: new THREE.Color(2, 2, 2) }))
  faceMesh.position.z = 0.42
  const body = new THREE.Mesh(new RoundedBoxGeometry(S * 0.99, S * 0.99, 0.8, 3, 0.6), new THREE.MeshBasicMaterial({ color: '#120f2e', fog: false }))
  const pinMat = new THREE.MeshBasicMaterial({ color: hdr('#ffbf3f', 1.7), fog: false })
  const pins = new THREE.Group()
  for (let i = 0; i < 7; i++) {
    const t = lerp(-S * 0.36, S * 0.36, i / 6)
    for (const [x, y, w, h] of [[t, S / 2 + 1.0, 1.0, 2.0], [t, -S / 2 - 1.0, 1.0, 2.0], [S / 2 + 1.0, t, 2.0, 1.0], [-S / 2 - 1.0, t, 2.0, 1.0]]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.4), pinMat)
      p.position.set(x, y, 0)
      pins.add(p)
    }
  }
  // the glow behind it, hidden where the hills stand in front
  const halo = canvasTex(256, 256, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,214,120,0.95)')
    grd.addColorStop(0.22, 'rgba(255,170,80,0.45)')
    grd.addColorStop(0.55, 'rgba(190,90,140,0.12)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  const haloMat = new THREE.MeshBasicMaterial({ map: halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
  const haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(S * 4.6, S * 4.6), haloMat)
  haloMesh.position.z = -1.5
  // rays fanning out over the top half, as in the picture
  const rayMat = glowMaterial('#ffc65a', { power: 1.2, alpha: 0.7 })
  const rays = new THREE.Group()
  const n = 13
  for (let i = 0; i < n; i++) {
    const a = lerp(0.06, Math.PI - 0.06, i / (n - 1))
    const L = S * (i % 2 ? 0.42 : 0.55)
    // bright at the chip, fading outward (the shader fades toward vUv.y = 1, the plane's outer end)
    const geo = new THREE.PlaneGeometry(0.75, L).translate(0, S * 0.9 + L / 2, 0)
    const ray = new THREE.Mesh(geo, rayMat)
    ray.rotation.z = a - Math.PI / 2
    rays.add(ray)
  }
  group.add(haloMesh, rays, body, faceMesh, pins)
  group.position.set(0, CHIP.y, CHIP.z)
  return {
    group,
    update(t, k) {
      rayMat.uniforms.uK.value = (0.75 + 0.25 * Math.sin(t * 0.8)) * (0.75 + 0.25 * k)
      haloMat.opacity = 0.75 + 0.25 * k
    },
  }
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, light, level, depth }) {
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const rotT = Math.atan2(-T.x, -1.5 - T.z)
  const rotC = Math.atan2(-C.x, -1.5 - C.z)
  const ahead = (p, rot, d) => ({ x: p.x + Math.sin(rot) * d, z: p.z + Math.cos(rot) * d })
  const useT = ahead(T, rotT, 2.6)
  const useC = ahead(C, rotC, 2.6)

  const stage = nightStage({
    radius: R,
    drop: DROP,
    ridge: 9,
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    chord: CHORD,
    gaps: [[-Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45]],
    paths: [
      [[BACK.x, BACK.z + 0.4], [0, -2], [0, LOOK.z - 0.8]],
      [[0, -1.6], [useT.x * 0.5, (useT.z - 1.6) * 0.5 + 0.3], [useT.x, useT.z]],
      [[0, -1.6], [useC.x * 0.5, (useC.z - 1.6) * 0.5 + 0.3], [useC.x, useC.z]],
    ],
    clearings: [[0, LOOK.z - 0.7, 1.9], [SPAWN.x, SPAWN.z + 0.3, 1.4], [useT.x, useT.z, 1.1], [useC.x, useC.z, 1.1]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const gy = stage.groundAt
  const fog0 = stage.env.fog.color.clone()
  const fogCity = new THREE.Color('#4a2f62')

  // warm light from the chip, on the sides of things that face the valley
  const chipLight = new THREE.DirectionalLight('#ffbf6a', 0.55)
  chipLight.position.set(0, 14, -60)
  root.add(chipLight, chipLight.target)
  const sun = chipSun()
  root.add(sun.group)

  const M = {
    stone: new THREE.MeshStandardMaterial({ color: '#3b3f5e', roughness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a04a', metalness: 0.7, roughness: 0.35, emissive: '#4a3208', emissiveIntensity: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ color: '#4a3c33', roughness: 0.9 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#fff1c8', emissive: '#ffc35c', emissiveIntensity: 2.2, roughness: 0.4 }),
  }

  // ---- lanterns along the paths ----
  for (const [x, z] of [[-1.9, 1.7], [1.9, 1.7], [-3.9, -1.2], [3.9, -1.2], [-3.7, -9.5], [3.7, -9.5]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.35, 8), M.wood)
    post.position.set(x, 0.675, z)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.16), M.lamp)
    cap.position.set(x, 1.42, z)
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.12, 4), M.wood)
    hat.position.set(x, 1.58, z)
    hat.rotation.y = Math.PI / 4
    root.add(post, cap, hat)
    solids.push(circle(x, z, 0.12))
  }

  // =====================================================================================
  // 1. The valley through time
  // =====================================================================================
  const rnd = random(1956)
  const ROADS = [
    { w: 1.7, pts: [[-2, -20.4], [2, -28], [9, -35], [19, -42], [31, -48], [45, -53], [63, -57], [86, -59]] },
    { w: 2.4, pts: [[-92, -60], [-50, -66], [-10, -68], [30, -69], [70, -67], [92, -64]] },
    { w: 1.5, pts: [[-3, -20.4], [-9, -28], [-19, -35], [-34, -42], [-56, -47], [-86, -50]] },
  ].map(r => {
    const curve = new THREE.CatmullRomCurve3(r.pts.map(([x, z]) => v3(x, 0, z)))
    return { ...r, curve, len: curve.getLength(), samples: curve.getSpacedPoints(Math.ceil(curve.getLength())) }
  })
  // the road: a ribbon on the ground with a dashed line down the middle
  const roadTex = canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = '#262a46'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#e6cf8f'
    g.fillRect(w / 2 - 3, 0, 6, h * 0.5)
  }, { repeat: true })
  textures.push(roadTex)
  const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.9, emissive: '#2a2a50', emissiveIntensity: 0.35 })
  for (const road of ROADS) {
    const pos = []
    const uv = []
    const idx = []
    const N = road.samples.length
    let dist = 0
    for (let i = 0; i < N; i++) {
      const p = road.samples[i]
      const q = road.samples[Math.min(N - 1, i + 1)]
      const o = road.samples[Math.max(0, i - 1)]
      const tx = q.x - o.x
      const tz = q.z - o.z
      const l = Math.hypot(tx, tz) || 1
      const nx = -tz / l
      const nz = tx / l
      if (i) dist += p.distanceTo(road.samples[i - 1])
      for (const s of [-1, 1]) {
        const x = p.x + nx * s * road.w * 0.5
        const z = p.z + nz * s * road.w * 0.5
        pos.push(x, gy(x, z) + 0.07, z)
        uv.push(s < 0 ? 0 : 1, dist / 3)
      }
      if (i < N - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    root.add(new THREE.Mesh(geo, roadMat))
  }

  // where the towns grow from, and when (the old town of San José was there before 1950)
  const CENTRES = [
    { x: 40, z: -62, y0: 1936, r0: 6, v: 1.0 },
    { x: -26, z: -40, y0: 1956, r0: 2, v: 1.05 },
    { x: 12, z: -52, y0: 1961, r0: 2, v: 1.0 },
    { x: -6, z: 34, y0: 1972, r0: 2, v: 1.1 },
  ]
  const urbanYear = (x, z) => Math.min(...CENTRES.map(c => c.y0 + Math.max(0, Math.hypot(x - c.x, z - c.z) - c.r0) / c.v))
  // the moments, each where it happened (Fairchild's chip of 1959 above its company of 1957)
  // (spread so that, seen from the lookout, their labels stand apart: Mountain View and Palo Alto to the
  // west, Santa Clara to the east)
  const MARKS = [
    { key: 'y1956', year: 1956, x: -16, z: -32 },
    { key: 'y1957', year: 1957, x: -17, z: -56 },
    { key: 'y1959', year: 1959, x: -17, z: -56, up: 1 },
    { key: 'y1968', year: 1968, x: 17, z: -49 },
  ]

  // the land in parcels: orchards in rows, until the town reaches them
  const PW = 11
  const PD = 8
  const parcels = []
  for (let i = -7; i <= 7; i++) {
    for (let j = -10; j <= 5; j++) {
      const x = i * 12.4
      const z = j * 9.4 - 2
      const r = Math.hypot(x, z)
      if (r < 24 || r > (z < 0 ? (light ? 70 : 86) : light ? 40 : 50)) continue
      const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => Math.hypot(x + (a * PW) / 2, z + (b * PD) / 2))
      if (Math.min(...corners) < 21.5) continue
      if (ROADS.some(road => road.samples.some(p => Math.abs(p.x - x) < PW / 2 + road.w / 2 + 0.6 && Math.abs(p.z - z) < PD / 2 + road.w / 2 + 0.6))) continue
      const mark = MARKS.find(m => !m.up && Math.abs(m.x - x) < PW / 2 + 1 && Math.abs(m.z - z) < PD / 2 + 1)
      // a few orchards at the hill's foot are kept to this day, as some are in the valley
      const kept = x < -3 && z > -44 && r < 42
      const year = mark ? mark.year - 0.4 : kept ? Infinity : urbanYear(x, z) + (rnd() - 0.5) * 6
      parcels.push({ x, z, year, mark })
      if (mark) mark.parcel = parcels.length - 1
    }
  }
  // MARKS that found no parcel stand on their own patch
  for (const m of MARKS) if (!m.up && m.parcel == null) parcels.push({ x: m.x, z: m.z, year: m.year - 0.4, mark: m })

  // trees
  const crownTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#2f8a55'
    g.fillRect(0, 0, w, h)
    const r = random(3)
    for (let i = 0; i < 140; i++) {
      g.fillStyle = `rgba(${60 + r() * 40},${150 + r() * 50},${90 + r() * 30},0.5)`
      g.beginPath()
      g.arc(r() * w, r() * h, 4 + r() * 8, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 46; i++) {
      g.fillStyle = r() < 0.8 ? '#f4a640' : '#e86a4a'
      g.beginPath()
      g.arc(r() * w, r() * h, 4 + r() * 2.5, 0, TAU)
      g.fill()
    }
  })
  textures.push(crownTex)
  const trees = []
  const [ROW, LINES, ROW_GAP, LINE_GAP] = light ? [4, 3, 2.6, 2.4] : [5, 4, 2.1, 1.9]
  for (const p of parcels) {
    for (let a = 0; a < ROW; a++) {
      for (let b = 0; b < LINES; b++) {
        const x = p.x + (a - (ROW - 1) / 2) * ROW_GAP + (rnd() - 0.5) * 0.3
        const z = p.z + (b - (LINES - 1) / 2) * LINE_GAP + (rnd() - 0.5) * 0.3
        trees.push({ x, y: gy(x, z), z, s: 0.85 + rnd() * 0.3, year: p.year })
      }
    }
  }
  const crowns = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.8, 1).translate(0, 1.05, 0),
    new THREE.MeshStandardMaterial({ map: crownTex, roughness: 0.8, emissive: '#ffffff', emissiveMap: crownTex, emissiveIntensity: 0.22, flatShading: true }),
    trees.length,
  )
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 6).translate(0, 0.25, 0), M.wood, trees.length)
  crowns.frustumCulled = trunks.frustumCulled = false
  root.add(crowns, trunks)
  // and a few of the picture's round fruit trees up here on the hill, behind the fence
  for (const [x, z, k] of [[-7.2, 5.6, 1.7], [-3.4, 7.4, 1.9], [1.2, 6.2, 1.6], [4.6, 7.9, 1.8], [8.0, 4.4, 1.6]]) {
    const crown = new THREE.Mesh(crowns.geometry, crowns.material)
    const trunk = new THREE.Mesh(trunks.geometry, M.wood)
    for (const m of [crown, trunk]) {
      m.position.set(x, 0, z)
      m.scale.setScalar(k)
      m.rotation.y = x
      root.add(m)
    }
  }

  // buildings: a few kinds, windows lit
  const facade = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#34365f'
    g.fillRect(0, 0, w, w)
    const r = random(68)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        g.fillStyle = r() < 0.5 ? '#ffd98a' : '#1d1e3c'
        g.fillRect(i * 32 + 8, j * 32 + 9, 16, 15)
      }
    }
  }, { repeat: true })
  const glow = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, w)
    const r = random(68)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        g.fillStyle = r() < 0.5 ? '#ffffff' : '#000000'
        g.fillRect(i * 32 + 8, j * 32 + 9, 16, 15)
      }
    }
  }, { repeat: true })
  textures.push(facade, glow)
  const wallMat = new THREE.MeshStandardMaterial({ map: facade, emissive: '#ffd27a', emissiveMap: glow, emissiveIntensity: 1.5, roughness: 0.8 })
  const roofMat = new THREE.MeshStandardMaterial({ color: '#2a2b4c', roughness: 0.9 })
  const blockGeo = (w, h, d) => {
    const g = new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0)
    const uv = g.attributes.uv
    const size = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) uv.setXY(f * 4 + v, (uv.getX(f * 4 + v) * size[f][0]) / 5.6, (uv.getY(f * 4 + v) * size[f][1]) / 6)
    return g
  }
  const KINDS = {
    house: blockGeo(1.5, 0.9, 1.3),
    low: blockGeo(7.2, 1.5, 4.4),
    mid: blockGeo(3.4, 3.0, 3.4),
    tall: blockGeo(2.6, 7.5, 2.6),
  }
  const blocks = { house: [], low: [], mid: [], tall: [] }
  const put = (kind, p, x, z, year, sy = 1) => blocks[kind].push({ x: p.x + x, z: p.z + z, y: gy(p.x + x, p.z + z), year, rot: (rnd() - 0.5) * 0.1, sx: 0.85 + rnd() * 0.3, sy: sy * (0.8 + rnd() * 0.4), sz: 0.85 + rnd() * 0.3 })
  for (const p of parcels) {
    if (!Number.isFinite(p.year)) continue
    const y = p.year
    if (p.mark) {
      put('low', p, 0, 0, y)
      continue
    }
    const v = rnd()
    const kind = y < 1962 ? (v < 0.6 ? 'houses' : 'low') : y < 1985 ? (v < 0.4 ? 'houses' : v < 0.8 ? 'low' : 'mid') : y < 2005 ? (v < 0.2 ? 'houses' : v < 0.5 ? 'low' : 'mid') : v < 0.4 ? 'mid' : v < 0.7 ? 'tall' : 'low'
    if (kind === 'houses') {
      for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) put('house', p, (a - 1) * 3.4, (b - 0.5) * 3.6, y + rnd() * 3)
    } else if (kind === 'low') {
      put('low', p, -0.8, -1.2, y)
      if (rnd() < 0.6) put('mid', p, 3.2, 2.0, y + 1 + rnd() * 3, 0.7)
    } else if (kind === 'mid') {
      put('mid', p, -2.8, 0, y)
      put('mid', p, 2.6, -1.0, y + rnd() * 2)
      if (rnd() < 0.5) put('house', p, 2.6, 2.6, y + 2)
    } else {
      put('tall', p, 0, -0.5, y + 2)
      put('mid', p, -3.6, 1.5, y)
      put('low', p, 1.0, 2.2, y, 0.8)
    }
  }
  const buildings = Object.entries(blocks).map(([kind, list]) => {
    const mesh = new THREE.InstancedMesh(KINDS[kind], [wallMat, wallMat, roofMat, roofMat, wallMat, wallMat], Math.max(1, list.length))
    mesh.count = list.length
    mesh.frustumCulled = false
    root.add(mesh)
    return { mesh, list }
  })

  // car lights on the roads, more as the years go by
  const CARS = light ? 70 : 150
  const totalLen = ROADS.reduce((s, r) => s + r.len, 0)
  const cars = []
  for (const [ri, road] of ROADS.entries()) {
    const n = Math.round((CARS * road.len) / totalLen)
    for (let i = 0; i < n; i++) cars.push({ road: ri, u0: rnd(), speed: (4 + rnd() * 4) / road.len, dir: rnd() < 0.5 ? 1 : -1, order: rnd() })
  }
  cars.sort((a, b) => a.order - b.order)
  const carMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), cars.length)
  const head = new THREE.Color(2.4, 2.1, 1.6)
  const tail = new THREE.Color(2.4, 0.3, 0.22)
  cars.forEach((c, i) => carMesh.setColorAt(i, c.dir > 0 ? head : tail))
  carMesh.frustumCulled = false
  root.add(carMesh)

  // the moments: a beam of light from where it happened, its year and name over it
  const marks = MARKS.map(m => {
    const g = gy(m.x, m.z)
    const beamMat = glowMaterial(GOLD, { power: 1.4, alpha: 0.5, across: 0 })
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 16, 16, 1, true).translate(0, 8, 0), beamMat)
    beam.position.set(m.x, g, m.z)
    root.add(beam)
    const label = new THREE.Group()
    const yearText = makeText(String(m.year), { size: 1.3, color: hdr(GOLD, 1.4), anchorY: 'bottom' })
    const name = makeText(E.valley.board[m.key], { size: 0.8, color: '#f4ecff', anchorY: 'top', maxWidth: 7.5 })
    name.position.y = -0.1
    label.add(yearText, name)
    label.position.set(m.x, g + 5.4 + (m.up ? 3.6 : 0), m.z)
    faceTo(label, LOOK.x, LOOK.z)
    label.visible = false
    root.add(label)
    return { ...m, beam, beamMat, label, texts: [yearText, name], shown: 0 }
  })
  // 1971: the name, over the whole valley
  const banner = new THREE.Group()
  const bannerTitle = makeText('SILICON VALLEY U.S.A.', { size: 1.7, color: hdr(GOLD, 1.5), anchorY: 'bottom' })
  const bannerLine = makeText(E.valley.paper, { size: 0.8, color: '#f4ecff', anchorY: 'top' })
  bannerLine.position.y = -0.15
  banner.add(bannerTitle, bannerLine)
  banner.position.set(0, -1.0, -40)
  faceTo(banner, LOOK.x, LOOK.z)
  banner.visible = false
  root.add(banner)

  // the year, glowing in the sky over the valley's west side, above the moments' labels
  const sign = new THREE.Group()
  const signYear = makeText('1950', { size: 2.6, color: hdr(GOLD, 1.5), anchorY: 'bottom' })
  const signLine = makeText(E.valley.board.y1950, { size: 1.0, color: '#f4ecff', anchorY: 'top', maxWidth: 22 })
  signLine.position.y = -0.15
  sign.add(signYear, signLine)
  sign.position.set(-36, 7.6, -64)
  faceTo(sign, LOOK.x, LOOK.z)
  root.add(sign)
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }

  // the lever at the lookout
  const consoleG = new THREE.Group()
  consoleG.position.set(LEVER.x, 0, LEVER.z)
  faceTo(consoleG, LOOK.x, LOOK.z)
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.95, 0.6, 2, 0.06), M.stone)
  plinth.position.y = 0.475
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.5), M.brass)
  slot.position.y = 0.97
  const arm = new THREE.Group()
  arm.position.y = 0.97
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.75, 10).translate(0, 0.375, 0), M.brass)
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshStandardMaterial({ color: '#d8343a', roughness: 0.35, emissive: '#5a0a10', emissiveIntensity: 0.6 }))
  knob.position.y = 0.78
  arm.add(stick, knob)
  // a brass plate on its front: 1950 at one end, today at the other
  const from = makeText('1950', { size: 0.08, color: '#ffe3a0' })
  from.position.set(0, 0.88, 0.31)
  const plateTo = makeText(E.valley.today, { size: 0.08, color: '#ffe3a0' })
  plateTo.position.set(0, 0.62, 0.31)
  consoleG.add(plinth, slot, arm, from, plateTo)
  root.add(consoleG)
  solids.push(circle(LEVER.x, LEVER.z, 0.55))

  // ---- the time ----
  let year = 1950 // as shown (moving)
  let target = 1950 // where it is going (shared)
  let tAnim = null
  let told = 'y1950' // the moment this visitor was last told
  const goTo = (to, how) => {
    to = clamp(Math.round(Number(to) || 1950), 1950, NOW)
    target = to
    const d = Math.abs(to - year)
    if (how === 'jump' || how === 'hand' || d < 0.01) {
      tAnim = null
      year = to
      return
    }
    tAnim = { from: year, to, t: 0, dur: how === 'remote' && d <= 4 ? 0.35 : clamp(1.3 + d * 0.04, 1.5, 4.2) }
  }
  let soon = false
  const shareSoon = () => {
    if (soon) return
    soon = true
    later(0.2, () => {
      soon = false
      share('valley')
    })
  }
  const byHand = v => {
    goTo(v, 'hand')
    shareSoon()
    const key = KEYS[stepIndex(target)]
    if (key !== told) {
      told = key
      say(at(E.valley.says[key], level()))
    }
  }
  const valleyPanel = lv => ({
    title: E.valley.title,
    color: GOLD,
    blocks: [
      {
        slider: {
          label: E.valley.year,
          min: 1950,
          max: NOW,
          step: 1,
          value: target,
          live: () => year,
          format: v => (v >= NOW - 0.5 ? E.valley.today : String(Math.round(v))),
          onInput: byHand,
        },
      },
      ...E.valley.panel[depth(lv)].map(p => ({ p })),
    ],
  })
  ex.add({
    id: 'valley',
    x: LOOK.x,
    z: LOOK.z,
    radius: 2.5,
    label: E.valley.label,
    verb: () => (target >= NOW ? E.valley.restart : E.valley.next),
    panel: valleyPanel,
    panelDelay: 2.8,
    focus: { x: 0, y: -3.5, z: -40, size: 20 },
    act: () => {
      const next = target >= NOW ? 1950 : STEPS.find(s => s > target + 0.01)
      goTo(next, 'press')
      play(next === 1950 ? 'tap' : 'select')
      share('valley')
      told = KEYS[stepIndex(next)]
      return at(E.valley.says[told], level())
    },
  })

  const o = new THREE.Object3D()
  let posed = -1
  let treesUp = 0
  let blocksUp = 0
  let carsOn = 0
  const poseValley = y => {
    treesUp = 0
    for (let i = 0; i < trees.length; i++) {
      const t = trees[i]
      const s = t.s * (1 - ease(clamp((y - (t.year - 1.6)) / 1.4)))
      if (s > 0.01) treesUp++
      o.position.set(t.x, t.y, t.z)
      o.rotation.set(0, i * 1.7, 0)
      o.scale.setScalar(Math.max(s, 0.0001))
      o.updateMatrix()
      crowns.setMatrixAt(i, o.matrix)
      trunks.setMatrixAt(i, o.matrix)
    }
    crowns.instanceMatrix.needsUpdate = trunks.instanceMatrix.needsUpdate = true
    blocksUp = 0
    for (const { mesh, list } of buildings) {
      list.forEach((b, i) => {
        const k = ease(clamp((y - b.year) / 2.2))
        if (k > 0.01) blocksUp++
        o.position.set(b.x, b.y, b.z)
        o.rotation.set(0, b.rot, 0)
        o.scale.set(b.sx, Math.max(b.sy * k, 0.0001), b.sz)
        o.updateMatrix()
        mesh.setMatrixAt(i, o.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
    }
  }
  const city = y => clamp((y - 1950) / (NOW - 1950))
  updates.push((dt, t) => {
    if (tAnim) {
      tAnim.t += dt
      const k = clamp(tAnim.t / tAnim.dur)
      year = lerp(tAnim.from, tAnim.to, ease(k))
      if (k >= 1) {
        year = tAnim.to
        tAnim = null
      }
    }
    if (Math.abs(year - posed) > 0.001) {
      posed = year
      poseValley(year)
      const i = stepIndex(year)
      const whole = Math.round(year)
      setText(signYear, whole >= NOW ? E.valley.today : String(whole))
      setText(signLine, E.valley.board[KEYS[i]])
      stage.env.fog.color.copy(fog0).lerp(fogCity, city(year) * 0.6)
    }
    // the lever leans from the visitor (1950) toward the valley (today)
    arm.rotation.x = lerp(0.65, -0.65, city(year))
    // the cars: a few in 1950, the roads full today
    const f = 0.05 + 0.95 * Math.pow(city(year), 1.2)
    carsOn = Math.round(cars.length * f)
    carMesh.count = carsOn
    for (let i = 0; i < carsOn; i++) {
      const c = cars[i]
      const road = ROADS[c.road]
      const u = (((c.u0 + c.dir * c.speed * t) % 1) + 1) % 1
      const p = road.curve.getPointAt(u)
      const tg = road.curve.getTangentAt(u)
      const side = c.dir * road.w * 0.22
      const x = p.x - tg.z * side
      const z = p.z + tg.x * side
      o.position.set(x, gy(x, z) + 0.25, z)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(1)
      o.updateMatrix()
      carMesh.setMatrixAt(i, o.matrix)
    }
    carMesh.instanceMatrix.needsUpdate = true
    // the moments: the newest bright, the older ones dimmer, the ones to come not yet there
    const now = stepIndex(year)
    for (const m of marks) {
      const reached = clamp((year - (m.year - 0.6)) / 0.6)
      const newest = STEPS[now] === m.year
      m.shown = damp(m.shown, reached * (newest ? 1 : 0.5), 4, dt)
      m.beamMat.uniforms.uK.value = m.shown * (0.85 + 0.15 * Math.sin(t * 2 + m.x))
      m.label.visible = m.shown > 0.02
      for (const tx of m.texts) tx.fillOpacity = clamp(m.shown * 1.6)
    }
    const named = clamp((year - 1970.4) / 0.6)
    banner.visible = named > 0.02
    bannerTitle.fillOpacity = bannerLine.fillOpacity = named * (STEPS[now] === 1971 ? 1 : 0.55)
    sun.update(t, city(year))
  })

  // =====================================================================================
  // 2. The switch: a giant n-channel MOSFET, its gate switching a lamp
  // =====================================================================================
  const tr = new THREE.Group()
  tr.position.set(T.x, 0, T.z)
  tr.rotation.y = rotT
  root.add(tr)
  solids.push(box(T.x, T.z, 4.8, 1.9, { rot: rotT }))
  const crystal = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#7d88ab'
    g.fillRect(0, 0, w, w)
    g.fillStyle = 'rgba(214,224,255,0.55)'
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        g.beginPath()
        g.arc(i * 16 + 8 + (j % 2) * 8, j * 16 + 8, 2.4, 0, TAU)
        g.fill()
      }
    }
  }, { repeat: true })
  crystal.repeat.set(3, 1)
  textures.push(crystal)
  const TM = {
    base: new THREE.MeshStandardMaterial({ color: '#30344f', roughness: 0.85 }),
    si: new THREE.MeshStandardMaterial({ map: crystal, metalness: 0.4, roughness: 0.4, emissive: '#1d2444', emissiveIntensity: 0.6 }),
    n: new THREE.MeshStandardMaterial({ color: '#33c7a8', roughness: 0.45, emissive: '#0f5a4c', emissiveIntensity: 0.7 }),
    oxide: new THREE.MeshStandardMaterial({ color: '#cdeefc', roughness: 0.15, metalness: 0.1, emissive: '#5aa8c8', emissiveIntensity: 0.35 }),
    gate: new THREE.MeshStandardMaterial({ color: '#8f97ad', metalness: 0.6, roughness: 0.3, emissive: '#ff6a10', emissiveIntensity: 0 }),
    copper: new THREE.MeshStandardMaterial({ color: '#d08a4a', metalness: 0.65, roughness: 0.35, emissive: '#3a1c06', emissiveIntensity: 0.5 }),
    cell: new THREE.MeshStandardMaterial({ color: '#2d3150', roughness: 0.5, metalness: 0.3 }),
    bulb: new THREE.MeshStandardMaterial({ color: '#fff6dc', roughness: 0.3, emissive: '#ffc867', emissiveIntensity: 0 }),
  }
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    tr.add(m)
    return m
  }
  add(new RoundedBoxGeometry(4.8, 0.5, 1.9, 2, 0.05), TM.base, 0, 0.25, 0)
  add(new THREE.BoxGeometry(3.2, 1.0, 1.3), TM.si, 0, 1.0, 0)
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.9, 0.4, 1.32), TM.n, s * 1.15, 1.3, 0)
  add(new THREE.BoxGeometry(1.5, 0.12, 1.3), TM.oxide, 0, 1.56, 0)
  add(new THREE.BoxGeometry(1.3, 0.3, 1.2), TM.gate, 0, 1.77, 0)
  // the channel: a sheet of electrons under the oxide while the gate is on
  const chanMat = new THREE.MeshBasicMaterial({ color: hdr('#5cc8ff', 1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  add(new THREE.BoxGeometry(1.42, 0.07, 1.33), chanMat, 0, 1.46, 0)
  // contacts and wires
  for (const x of [-1.15, 1.15]) add(new THREE.CylinderGeometry(0.075, 0.075, 0.75, 10), TM.copper, x, 1.875, 0)
  add(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 10), TM.copper, 0, 2.17, 0)
  const wire = [
    [v3(-1.95, 1.36, 0), v3(-1.95, 2.25, 0), v3(-1.15, 2.25, 0)],
    [v3(1.15, 2.25, 0), v3(1.83, 2.25, 0), v3(1.83, 2.36, 0)],
    [v3(2.07, 2.36, 0), v3(2.12, 2.36, 0), v3(2.12, 0.56, 0), v3(2.12, 0.56, 0.8), v3(-1.95, 0.56, 0.8), v3(-1.95, 0.56, 0)],
  ]
  for (const pts of wire) {
    for (let i = 1; i < pts.length; i++) tr.add(rod(pts[i - 1], pts[i], 0.035, TM.copper))
    for (const p of pts) add(new THREE.SphereGeometry(0.04, 8, 6), TM.copper, p.x, p.y, p.z)
  }
  // the battery that pushes the electrons round, and the lamp they light
  add(new THREE.CylinderGeometry(0.22, 0.22, 0.86, 20), TM.cell, -1.95, 0.93, 0)
  add(new THREE.CylinderGeometry(0.225, 0.225, 0.12, 20), M.brass, -1.95, 1.3, 0)
  const minus = makeText('−', { size: 0.2, color: '#ffe3a0' })
  minus.position.set(-1.95, 1.1, 0.23)
  const plus = makeText('+', { size: 0.2, color: '#ffe3a0' })
  plus.position.set(-1.95, 0.7, 0.23)
  tr.add(minus, plus)
  add(new THREE.CylinderGeometry(0.05, 0.07, 1.8, 10), TM.cell, 1.95, 1.4, -0.25)
  add(new THREE.CylinderGeometry(0.14, 0.12, 0.2, 16), M.brass, 1.95, 2.4, 0)
  const bulb = add(new THREE.SphereGeometry(0.28, 24, 18), TM.bulb, 1.95, 2.74, 0)
  const lampLight = new THREE.PointLight('#ffc977', 0, 9, 2)
  lampLight.position.set(1.95, 2.8, 0.3)
  tr.add(lampLight)
  // the gate's switch on top: a lever up (on) or down (off)
  add(new RoundedBoxGeometry(0.42, 0.24, 0.24, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#6e2a3a', roughness: 0.5 }), 0, 2.52, 0)
  const gateArm = new THREE.Group()
  gateArm.position.set(0, 2.64, 0)
  gateArm.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.05).translate(0, 0.18, 0), M.brass))
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), new THREE.MeshBasicMaterial({ color: '#3a4a3a', toneMapped: false }))
  led.position.set(0.14, 2.56, 0.13)
  tr.add(gateArm, led)
  // its words, on the parts themselves
  const P = E.gate.parts
  const label = (text, x, y, z, size = 0.13) => {
    const t = makeText(text, { size, color: '#f2f6ff', outlineWidth: size * 0.09, outlineColor: '#141030' })
    t.position.set(x, y, z)
    tr.add(t)
    return t
  }
  label(P.source, -1.15, 1.3, 0.67)
  label(P.drain, 1.15, 1.3, 0.67)
  label(P.gate, 0, 1.77, 0.61)
  label(P.silicon, 0, 0.82, 0.66, 0.15)
  const ox = formulaText('SiO2', { size: 0.085, color: '#0d2a40' })
  ox.position.set(0, 1.56, 0.66)
  tr.add(ox)
  const charges = makeText('+  +  +  +  +', { size: 0.16, color: hdr('#ffcf8a', 1.3) })
  charges.position.set(0, 1.99, 0.3)
  charges.rotation.x = -0.5
  tr.add(charges)

  // the electrons' way round: battery, source, channel, drain, lamp, back to the battery
  const loop = new THREE.CurvePath()
  // (inside the silicon they run along its front face, where they can be seen)
  const way = [v3(-1.95, 1.36, 0), v3(-1.95, 2.25, 0), v3(-1.15, 2.25, 0), v3(-1.15, 1.52, 0), v3(-1.15, 1.42, 0.69), v3(-0.72, 1.45, 0.69), v3(0.72, 1.45, 0.69), v3(1.15, 1.42, 0.69), v3(1.15, 1.52, 0), v3(1.15, 2.25, 0), v3(1.83, 2.25, 0), v3(1.83, 2.36, 0), v3(2.12, 2.36, 0), v3(2.12, 0.56, 0), v3(2.12, 0.56, 0.8), v3(-1.95, 0.56, 0.8), v3(-1.95, 0.56, 0), v3(-1.95, 1.36, 0)]
  for (let i = 1; i < way.length; i++) loop.add(new THREE.LineCurve3(way[i - 1], way[i]))
  const lens = loop.getCurveLengths()
  const total = loop.getLength()
  const chan = [lens[4] / total, lens[5] / total] // the channel's share of the way
  const NE = light ? 32 : 52
  const electrons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.038, 10, 8), new THREE.MeshBasicMaterial({ color: hdr('#6fd0ff', 1.35), toneMapped: false }), NE)
  electrons.frustumCulled = false
  tr.add(electrons)
  let gateOn = false
  let onK = 0
  let flow = 0
  const setGate = (v, live) => {
    gateOn = v
    if (!live) onK = v ? 1 : 0
    else play(v ? 'join' : 'part')
  }
  ex.add({
    id: 'gate',
    x: useT.x,
    z: useT.z,
    radius: 2.3,
    label: E.gate.label,
    verb: () => (gateOn ? E.gate.off : E.gate.on),
    panel: lv => ({ title: E.gate.title, color: GOLD, blocks: E.gate.panel[depth(lv)].map(p => ({ p })) }),
    panelDelay: 1.8,
    focus: { x: T.x, y: 1.7, z: T.z, size: 4.2 },
    act: () => {
      setGate(!gateOn, true)
      share('gate')
      return at(gateOn ? E.gate.says.on : E.gate.says.off, level())
    },
  })
  const p = new THREE.Vector3()
  updates.push((dt, t) => {
    onK = damp(onK, gateOn ? 1 : 0, 5, dt)
    flow = (flow + dt * 0.09 * onK) % 1
    TM.gate.emissiveIntensity = onK * 0.5
    chanMat.opacity = onK * 0.55
    TM.bulb.emissiveIntensity = onK * 2.0
    lampLight.intensity = onK * 4
    gateArm.rotation.z = lerp(-1.2, 0, onK)
    led.material.color.setRGB(lerp(0.23, 0.4, onK), lerp(0.29, 2.4, onK), lerp(0.23, 0.6, onK))
    charges.fillOpacity = onK
    for (let i = 0; i < NE; i++) {
      const u = (i / NE + flow) % 1
      loop.getPointAt(u, p)
      // in the channel only while the gate holds them there
      const inChan = u > chan[0] && u < chan[1]
      const s = inChan ? onK : 1
      o.position.set(p.x, p.y + (inChan ? 0 : 0), p.z + 0.02 * Math.sin(t * 9 + i))
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(Math.max(s, 0.0001))
      o.updateMatrix()
      electrons.setMatrixAt(i, o.matrix)
    }
    electrons.instanceMatrix.needsUpdate = true
  })

  // =====================================================================================
  // 3. The chip that counts: the 4004's 2300 transistors, then each a whole 4004, twice
  // =====================================================================================
  const kiosk = new THREE.Group()
  kiosk.position.set(C.x, 0, C.z)
  kiosk.rotation.y = rotC
  root.add(kiosk)
  solids.push(box(C.x, C.z, 2.1, 0.9, { rot: rotC }))
  const BY = 1.85 // the board's middle
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, BY, 0.1).translate(0, BY / 2, 0), M.stone)
    leg.position.set(s * 0.62, 0, -0.12)
    kiosk.add(leg)
  }
  const foot = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.12, 0.8, 2, 0.04), M.stone)
  foot.position.y = 0.06
  kiosk.add(foot)
  const edge = new THREE.Mesh(new RoundedBoxGeometry(1.62, 2.06, 0.08, 2, 0.04), new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.9, roughness: 0.4 }))
  edge.position.set(0, BY, -0.04)
  const pkg = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.95, 0.1, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#171c40', roughness: 0.5, emissive: '#0d1130', emissiveIntensity: 0.6 }))
  pkg.position.set(0, BY, 0)
  kiosk.add(edge, pkg)
  // 16 pins, eight a side, as on the 4004's package
  for (let i = 0; i < 8; i++) {
    for (const s of [-1, 1]) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.05), M.brass)
      pin.position.set(s * 0.87, BY - 0.75 + (i * 1.5) / 7, 0)
      kiosk.add(pin)
    }
  }
  // the die under the lights: dark silicon with faint wiring
  const DW = 1.12
  const DH = 1.5
  const dieTex = canvasTex(256, 342, (g, w, h) => {
    g.fillStyle = '#232a52'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(160,170,230,0.25)'
    g.lineWidth = 1
    const r = random(1971)
    for (let i = 0; i < 70; i++) {
      g.beginPath()
      const x = r() * w
      const y = r() * h
      g.moveTo(x, y)
      if (r() < 0.5) g.lineTo(x + (r() - 0.5) * 120, y)
      else g.lineTo(x, y + (r() - 0.5) * 120)
      g.stroke()
    }
    g.fillStyle = '#c9a04a'
    for (let i = 0; i < 16; i++) {
      g.fillRect(4 + (i % 8) * (w / 8), i < 8 ? 3 : h - 9, 12, 6)
    }
  })
  textures.push(dieTex)
  const die = new THREE.Mesh(new THREE.PlaneGeometry(DW + 0.06, DH + 0.06), new THREE.MeshStandardMaterial({ map: dieTex, roughness: 0.6, emissive: '#151a3a', emissiveIntensity: 0.5 }))
  die.position.set(0, BY, 0.052)
  kiosk.add(die)
  // the 2300 lights: 46 by 50, in blocks
  const COLS = 46
  const ROWS = 50
  const gapsX = [15, 31]
  const gapsY = [12, 25, 38]
  const px = (DW - 0.04) / (COLS + gapsX.length * 1.2)
  const py = (DH - 0.04) / (ROWS + gapsY.length * 1.2)
  const spots = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const gx = gapsX.filter(g => i >= g).length * 1.2
      const gyy = gapsY.filter(g => j >= g).length * 1.2
      spots.push([(i + gx + 0.5) * px - (DW - 0.04) / 2, (j + gyy + 0.5) * py - (DH - 0.04) / 2])
    }
  }
  const MID = 25 * COLS + 23
  const dotGeo = new THREE.PlaneGeometry(px * 0.55, py * 0.6)
  const fieldOf = () => {
    const mat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, toneMapped: false, depthWrite: false })
    const mesh = new THREE.InstancedMesh(dotGeo, mat, spots.length)
    spots.forEach(([x, y], i) => {
      o.position.set(x, y, 0)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(1)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      mesh.setColorAt(i, new THREE.Color(1.6, 1.05, 0.32))
    })
    mesh.frustumCulled = false
    const g = new THREE.Group()
    g.add(mesh)
    return { g, mesh, mat }
  }
  const fieldHolder = new THREE.Group()
  fieldHolder.position.set(0, BY, 0.06)
  kiosk.add(fieldHolder)
  const A = fieldOf()
  const B = fieldOf()
  fieldHolder.add(B.g, A.g)
  // B's middle light is where A shrinks to: hidden
  o.position.set(spots[MID][0], spots[MID][1], 0)
  o.scale.setScalar(0.0001)
  o.updateMatrix()
  B.mesh.setMatrixAt(MID, o.matrix)
  // the bright speck all of A becomes
  const speck = new THREE.Mesh(new THREE.PlaneGeometry(px * 0.75, py * 0.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.8, 0.7), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }))
  speck.position.set(spots[MID][0], spots[MID][1], 0.004)
  fieldHolder.add(speck)
  // at today's count the lights are too many to tell apart: they glow as one
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(DW - 0.02, DH - 0.02), new THREE.MeshBasicMaterial({ color: hdr('#ffb84a', 1.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
  sheet.position.z = 0.006
  fieldHolder.add(sheet)
  const tw = Float32Array.from(spots, () => 0.55 + rnd() * 0.45)
  // the counter under the board
  const counter = screen({ width: 1.75, height: 0.5, color: GOLD, title: '2300', line: `${E.chip.unit} · ${E.chip.one}`, titleSize: 0.17, lineSize: 0.075 })
  counter.group.position.set(0, 0.62, 0.32)
  counter.group.rotation.x = -0.55
  kiosk.add(counter.group)
  let today = false
  let zk = 0 // 0: one 4004; 1: each light a 4004; 2: and again
  const setToday = (v, live) => {
    today = v
    if (!live) zk = v ? 2 : 0
    else play(v ? 'beam' : 'tap')
  }
  ex.add({
    id: 'chip',
    x: useC.x,
    z: useC.z,
    radius: 2.3,
    label: E.chip.label,
    verb: () => (today ? E.chip.back : E.chip.grow),
    panel: lv => ({ title: E.chip.title, color: GOLD, blocks: E.chip.panel[depth(lv)].map(q => ({ p: q })) }),
    panelDelay: 5.0,
    screens: [counter],
    focus: { x: C.x, y: 1.5, z: C.z, size: 2.6 },
    act: () => {
      if (zk > 0.001 && zk < 1.999) return false
      setToday(!today, true)
      share('chip')
      return at(today ? E.chip.says.grow : E.chip.says.back, level())
    },
  })
  let twinkle = 0
  let counted = ''
  let countAt = 0
  const white = new THREE.Color()
  updates.push((dt, t) => {
    const goal = today ? 2 : 0
    zk = goal > zk ? Math.min(goal, zk + dt * 0.42) : Math.max(goal, zk - dt * 1.2)
    const lv = zk >= 2 ? 1 : Math.floor(zk)
    const s = zk >= 2 ? 1 : zk - lv
    const e = ease(s)
    const shrink = lerp(1, px / (DW - 0.04), e)
    A.g.position.set(spots[MID][0] * e, spots[MID][1] * e, 0)
    A.g.scale.setScalar(shrink)
    B.g.visible = s > 0.001
    B.mat.opacity = e
    speck.material.opacity = clamp((e - 0.75) / 0.25)
    sheet.material.opacity = 0.42 * ease(clamp((zk - 1.2) / 0.8))
    // the lights flicker as they count
    twinkle += dt
    if (twinkle > 0.09) {
      twinkle = 0
      for (let i = 0; i < spots.length; i++) {
        if (rnd() < 0.06) tw[i] = rnd() < 0.5 ? 0.35 + rnd() * 0.3 : 0.85 + rnd() * 0.4
        white.setRGB(1.6 * tw[i], 1.05 * tw[i], 0.32 * tw[i])
        A.mesh.setColorAt(i, white)
        B.mesh.setColorAt(i, white)
      }
      A.mesh.instanceColor.needsUpdate = B.mesh.instanceColor.needsUpdate = true
    }
    // the count, racing up with the zoom
    countAt -= dt
    if (countAt <= 0) {
      countAt = 0.06
      const text = grouped(Math.pow(2300, 1 + zk))
      const line = `${E.chip.unit} · ${zk < 0.5 ? E.chip.one : zk < 1.5 ? E.chip.each : E.chip.phone}`
      if (text + line !== counted) {
        counted = text + line
        counter.set({ title: text, line })
      }
    }
  })

  // =====================================================================================
  // Beside the path: Berzelius's silicon of 1824, a brown powder in a vial
  // =====================================================================================
  const vial = new THREE.Group()
  vial.position.set(VIAL.x, 0, VIAL.z)
  faceTo(vial, 0, VIAL.z + 1)
  root.add(vial)
  solids.push(circle(VIAL.x, VIAL.z, 0.3))
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.95, 16), M.stone)
  pillar.position.y = 0.475
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 8, 32), new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 1.0 }))
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.96
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#dff4ff', transparent: true, opacity: 0.35, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false }))
  glass.position.y = 1.09
  const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.1, 20), new THREE.MeshStandardMaterial({ color: '#6b4528', roughness: 1, emissive: '#2a160a', emissiveIntensity: 0.5 }))
  powder.position.y = 1.01
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.06, 16), new THREE.MeshStandardMaterial({ color: '#b48a58', roughness: 0.9 }))
  cork.position.y = 1.25
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.02), M.brass)
  plate.position.set(0, 0.72, 0.235)
  const tag = makeText(E.vial.tag, { size: 0.045, color: '#2a1a08' })
  tag.position.set(0, 0.72, 0.247)
  vial.add(pillar, rim, glass, powder, cork, plate, tag)
  const vialAt = ahead(VIAL, Math.atan2(-VIAL.x, 1), 0.9)
  ex.add({
    id: 'vial',
    x: vialAt.x,
    z: vialAt.z,
    radius: 1.3,
    label: E.vial.label,
    verb: E.vial.verb,
    panel: lv => ({ title: E.vial.title, color: GOLD, blocks: E.vial.panel[depth(lv)].map(q => ({ p: q })) }),
    focus: { x: VIAL.x, y: 1.05, z: VIAL.z, size: 0.7 },
    act: () => at(E.vial.says, level()),
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, -(SPAWN.z - HOST.z)) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    parts: {
      valley: {
        get year() {
          return year
        },
        get target() {
          return target
        },
        get trees() {
          return treesUp
        },
        get buildings() {
          return blocksUp
        },
        get cars() {
          return carsOn
        },
      },
      gate: {
        get on() {
          return gateOn
        },
        get flow() {
          return onK
        },
      },
      chip: {
        get today() {
          return today
        },
        get zoom() {
          return zk
        },
      },
    },
    panels: {
      valley: valleyPanel,
      gate: lv => ({ title: E.gate.title, color: GOLD, blocks: E.gate.panel[depth(lv)].map(q => ({ p: q })) }),
      chip: lv => ({ title: E.chip.title, color: GOLD, blocks: E.chip.panel[depth(lv)].map(q => ({ p: q })) }),
    },
    shared: {
      valley: { get: () => ({ year: target }), set: (s, live) => goTo(s?.year, live ? 'remote' : 'jump') },
      gate: { get: () => ({ on: gateOn }), set: (s, live) => setGate(!!s?.on, live) },
      chip: { get: () => ({ today }), set: (s, live) => setToday(!!s?.today, live) },
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
