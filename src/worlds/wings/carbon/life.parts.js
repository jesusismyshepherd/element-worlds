// The pieces of the life wing (a garden under a glass dome): the sky (day and night), the geodesic
// dome, the lawn and its paths, garden lamps, the day/night dial, the "you are 18% carbon" figure, the
// molecule pedestals, the carbon-14 clock with a mammoth's bone, and the carbon-cycle table.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { ballAndStick } from '../../../chem/ballAndStick.js'
import { glowMat, taperedTube, easeInOut, easeOut, smooth, clamp, paint } from './kit.js'
import { BODY, C14, rng } from './structures.js'

export const GREEN = '#8be37a'
const GOLD = '#ffd166'

// ---------------------------------------------------------------- the sky
export function skyDome({ radius = 260 } = {}) {
  const uniforms = {
    uNight: { value: 0 },
    uTime: { value: 0 },
    uSun: { value: new THREE.Vector3(0.45, 0.62, 0.35).normalize() },
    uMoon: { value: new THREE.Vector3(-0.4, 0.55, -0.5).normalize() },
  }
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uNight; uniform float uTime; uniform vec3 uSun; uniform vec3 uMoon;
      varying vec3 vDir;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise(vec3 x) {
        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) { float a = 0.5; float s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 day = mix(vec3(0.78, 0.87, 0.95), vec3(0.2, 0.45, 0.86), smoothstep(0.0, 0.55, h));
        float s = max(dot(d, uSun), 0.0);
        day += vec3(1.0, 0.92, 0.75) * (pow(s, 900.0) * 9.0 + pow(s, 12.0) * 0.22);
        float cl = fbm(vec3(d.xz / max(h, 0.08) * 0.9, 0.0) + vec3(uTime * 0.006, 0.0, uTime * 0.003));
        cl = smoothstep(0.52, 0.78, cl) * smoothstep(0.03, 0.22, h);
        day = mix(day, vec3(1.0, 0.99, 0.97), cl * 0.75);
        vec3 night = mix(vec3(0.03, 0.05, 0.12), vec3(0.006, 0.01, 0.035), smoothstep(0.0, 0.6, h));
        vec3 sp = d * 240.0;
        vec3 cell = floor(sp);
        float r = hash(cell);
        float star = step(0.986, r) * smoothstep(0.32, 0.0, length(fract(sp) - 0.5)) * smoothstep(0.02, 0.2, h);
        night += vec3(0.9, 0.95, 1.0) * star * (0.7 + 0.3 * sin(uTime * 2.0 + r * 60.0)) * 1.4;
        float m = max(dot(d, uMoon), 0.0);
        night += vec3(0.9, 0.93, 1.0) * (smoothstep(0.99945, 0.9997, m) * 2.0 + pow(m, 40.0) * 0.08);
        night = mix(night, vec3(0.05, 0.06, 0.1), cl * 0.6);
        vec3 col = mix(day, night, uNight);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat)
  mesh.renderOrder = -10
  mesh.frustumCulled = false
  return { mesh, uniforms }
}

// ---------------------------------------------------------------- the glass dome
/** A geodesic dome (a subdivided icosahedron) `radius` m, its centre `drop` m under the ground: thin
 *  white struts and faint glass panes. */
export function glassDome({ radius = 17, drop = 1.6, light }) {
  const group = new THREE.Group()
  const ico = new THREE.IcosahedronGeometry(radius, 5)
  const pos = ico.getAttribute('position')
  const key = v => `${Math.round(v.x * 100)},${Math.round(v.y * 100)},${Math.round(v.z * 100)}`
  const verts = new Map()
  const edges = new Map()
  const tris = []
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i)
    b.fromBufferAttribute(pos, i + 1)
    c.fromBufferAttribute(pos, i + 2)
    const pts = [a.clone(), b.clone(), c.clone()].map(p => p.setY(p.y - drop))
    if (pts.every(p => p.y < -0.05)) continue
    tris.push(pts)
    for (const [p, q] of [[pts[0], pts[1]], [pts[1], pts[2]], [pts[2], pts[0]]]) {
      if (p.y < -0.05 && q.y < -0.05) continue
      const k = [key(p), key(q)].sort().join('|')
      if (!edges.has(k)) edges.set(k, [p, q])
      verts.set(key(p), p)
      verts.set(key(q), q)
    }
  }
  const strutMat = new THREE.MeshStandardMaterial({ color: '#eef2f5', roughness: 0.35, metalness: 0.7 })
  const struts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 6), strutMat, edges.size)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)
  let i = 0
  for (const [p, r] of edges.values()) {
    const d = r.clone().sub(p)
    q.setFromUnitVectors(up, d.clone().normalize())
    struts.setMatrixAt(i++, m4.compose(p.clone().add(r).multiplyScalar(0.5), q, s.set(1, d.length(), 1)))
  }
  struts.castShadow = !light
  group.add(struts)
  const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), strutMat, verts.size)
  i = 0
  for (const p of verts.values()) nodes.setMatrixAt(i++, m4.makeTranslation(p.x, p.y, p.z))
  group.add(nodes)
  const pp = []
  for (const t of tris) for (const p of t) pp.push(p.x, p.y, p.z)
  const paneGeo = new THREE.BufferGeometry()
  paneGeo.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3))
  paneGeo.computeVertexNormals()
  const glass = new THREE.MeshPhysicalMaterial({ color: '#dff2ff', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, clearcoat: light ? 0 : 1, envMapIntensity: 1.4 })
  const panes = new THREE.Mesh(paneGeo, glass)
  panes.renderOrder = 8
  group.add(panes)
  const base = new THREE.Mesh(new THREE.TorusGeometry(Math.sqrt(radius * radius - drop * drop), 0.16, 8, 160), new THREE.MeshStandardMaterial({ color: '#d7dde3', roughness: 0.5, metalness: 0.4 }))
  base.rotation.x = Math.PI / 2
  base.position.y = 0.08
  group.add(base)
  return { group, floorRadius: Math.sqrt(radius * radius - drop * drop) }
}

// ---------------------------------------------------------------- the lawn, the paths, the flowers
function grassTexture(seed, base = '#4f8a35') {
  return paint(512, 512, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    const r = rng(seed)
    for (let i = 0; i < 9000; i++) {
      const x = r() * w
      const y = r() * h
      const l = 3 + r() * 7
      const hue = 85 + r() * 30
      g.strokeStyle = `hsla(${hue}, ${40 + r() * 25}%, ${22 + r() * 22}%, 0.8)`
      g.lineWidth = 1 + r() * 1.2
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (r() - 0.5) * 3, y - l)
      g.stroke()
    }
    for (let i = 0; i < 40; i++) {
      const x = r() * w
      const y = r() * h
      const rad = 20 + r() * 60
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, r() < 0.5 ? 'rgba(30,60,20,0.18)' : 'rgba(170,200,90,0.12)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grad
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
    }
  }, { repeat: [1, 1] })
}

function stoneTexture() {
  return paint(512, 512, (g, w, h) => {
    g.fillStyle = '#c9c2b2'
    g.fillRect(0, 0, w, h)
    const r = rng(17)
    // irregular pavers
    for (let row = 0; row < 8; row++) {
      let x = -r() * 40
      while (x < w) {
        const pw = 50 + r() * 60
        const y = row * 64
        const tone = 185 + r() * 40
        g.fillStyle = `rgb(${tone},${tone - 6},${tone - 18})`
        g.beginPath()
        g.roundRect(x + 3, y + 3, pw - 6, 58, 8)
        g.fill()
        for (let k = 0; k < 30; k++) {
          g.fillStyle = `rgba(90,80,70,${r() * 0.12})`
          g.fillRect(x + r() * pw, y + r() * 60, 2, 2)
        }
        x += pw
      }
    }
  }, { repeat: [1, 1] })
}

/** The garden floor: lawn, a ring path round the tree and spokes to the exhibits; grass blades and
 *  flowers. `keepOut(x, z)` says where no grass may grow (paths, exhibits). */
export function garden({ radius = 16.9, ringIn = 7.6, ringOut = 9.4, spokes = [], keepOut = () => false, light, shadows }) {
  const group = new THREE.Group()
  const lawnTex = grassTexture(3)
  lawnTex.wrapS = lawnTex.wrapT = THREE.RepeatWrapping
  lawnTex.repeat.set(10, 10)
  const lawn = new THREE.Mesh(new THREE.CircleGeometry(radius + 0.4, 96), new THREE.MeshStandardMaterial({ map: lawnTex, roughness: 0.95, color: '#c9dcb6' }))
  lawn.rotation.x = -Math.PI / 2
  lawn.receiveShadow = shadows
  group.add(lawn)
  // the meadow outside the dome
  const outTex = grassTexture(8, '#46783a')
  outTex.wrapS = outTex.wrapT = THREE.RepeatWrapping
  outTex.repeat.set(60, 60)
  const meadow = new THREE.Mesh(new THREE.RingGeometry(radius + 0.3, 250, 96, 1), new THREE.MeshStandardMaterial({ map: outTex, roughness: 1, color: '#c9dcb8' }))
  meadow.rotation.x = -Math.PI / 2
  meadow.position.y = -0.02
  group.add(meadow)
  // paths
  const stone = stoneTexture()
  stone.wrapS = stone.wrapT = THREE.RepeatWrapping
  const ringTex = stone.clone()
  ringTex.repeat.set(12, 1)
  ringTex.needsUpdate = true
  const ringGeo = new THREE.RingGeometry(ringIn, ringOut, 160, 2)
  // map u round the ring and v across it
  const rp = ringGeo.getAttribute('position')
  const ruv = ringGeo.getAttribute('uv')
  for (let i = 0; i < rp.count; i++) {
    const x = rp.getX(i)
    const y = rp.getY(i)
    ruv.setXY(i, (Math.atan2(y, x) / (Math.PI * 2) + 0.5) * 6, (Math.hypot(x, y) - ringIn) / (ringOut - ringIn))
  }
  const pathMat = new THREE.MeshStandardMaterial({ map: ringTex, color: '#d9d2c4', roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
  const ring = new THREE.Mesh(ringGeo, pathMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.012
  ring.receiveShadow = shadows
  group.add(ring)
  for (const sp of spokes) {
    const tex = stone.clone()
    tex.repeat.set(1, sp.length / 1.8)
    tex.needsUpdate = true
    const m = new THREE.Mesh(new THREE.PlaneGeometry(sp.width, sp.length), new THREE.MeshStandardMaterial({ map: tex, color: '#d9d2c4', roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }))
    m.rotation.x = -Math.PI / 2
    m.rotation.z = sp.angle
    m.position.set(sp.x, 0.013, sp.z)
    m.receiveShadow = shadows
    group.add(m)
  }
  // grass blades: a tapering strip, swaying
  const blade = new THREE.BufferGeometry()
  const bp = [-0.5, 0, 0, 0.5, 0, 0, -0.38, 0.35, 0.03, 0.38, 0.35, 0.03, -0.22, 0.7, 0.08, 0.22, 0.7, 0.08, 0, 1, 0.16]
  const bu = [0, 0, 1, 0, 0, 0.35, 1, 0.35, 0, 0.7, 1, 0.7, 0.5, 1]
  blade.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3))
  blade.setAttribute('uv', new THREE.Float32BufferAttribute(bu, 2))
  blade.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6])
  blade.computeVertexNormals()
  const wind = { uTime: { value: 0 } }
  const bladeMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, side: THREE.DoubleSide })
  bladeMat.onBeforeCompile = sh => {
    sh.uniforms.uTime = wind.uTime
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nvarying float vH;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vH = uv.y;
        #ifdef USE_INSTANCING
          vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          float sway = sin(uTime * 1.6 + ip.x * 0.45 + ip.z * 0.3) + 0.4 * sin(uTime * 3.1 + ip.x * 1.7);
          transformed.x += sway * 0.12 * uv.y * uv.y;
        #endif`)
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vH;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= mix(0.42, 1.08, vH);')
  }
  bladeMat.customProgramCacheKey = () => 'carbon-grass'
  const count = light ? 9000 : 42000
  const blades = new THREE.InstancedMesh(blade, bladeMat, count)
  const r = rng(31)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const col = new THREE.Color()
  let n = 0
  let tries = 0
  while (n < count && tries < count * 6) {
    tries++
    const a = r() * Math.PI * 2
    const rad = Math.sqrt(r()) * (radius - 0.4)
    const x = Math.cos(a) * rad
    const z = Math.sin(a) * rad
    if (rad > ringIn - 0.1 && rad < ringOut + 0.1) continue
    if (keepOut(x, z)) continue
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * Math.PI * 2)
    const h = 0.13 + r() * 0.24
    const w = 0.018 + r() * 0.014
    m4.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(w, h, w * 8))
    blades.setMatrixAt(n, m4)
    col.setHSL(0.24 + r() * 0.06, 0.5 + r() * 0.2, 0.3 + r() * 0.14)
    blades.setColorAt(n, col)
    n++
  }
  blades.count = n
  blades.receiveShadow = shadows
  blades.computeBoundingSphere()
  group.add(blades)
  // flowers round the edge of the dome and in clumps
  const fcount = light ? 260 : 700
  const stemGeo = new THREE.CylinderGeometry(0.008, 0.01, 1, 4)
  stemGeo.translate(0, 0.5, 0)
  const headGeo = new THREE.IcosahedronGeometry(1, 1)
  headGeo.scale(1, 0.55, 1)
  const stems = new THREE.InstancedMesh(stemGeo, new THREE.MeshStandardMaterial({ color: '#3f7a2c', roughness: 0.8 }), fcount)
  const heads = new THREE.InstancedMesh(headGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, emissive: '#ffffff', emissiveIntensity: 0.04 }), fcount)
  const palette = ['#f2c14e', '#f78fb3', '#c39bff', '#ffffff', '#ff8a5c', '#7cc6fe', '#ffd6e8']
  let fn = 0
  tries = 0
  while (fn < fcount && tries < fcount * 10) {
    tries++
    const edge = r() < 0.65
    const a = r() * Math.PI * 2
    const rad = edge ? radius - 0.6 - r() * 1.6 : 1.4 + r() * (radius - 2)
    const x = Math.cos(a) * rad
    const z = Math.sin(a) * rad
    if (rad > ringIn - 0.3 && rad < ringOut + 0.3) continue
    if (keepOut(x, z)) continue
    if (!edge && Math.sin(x * 0.9) * Math.cos(z * 0.7) < 0.55) continue // clumps
    const h = 0.25 + r() * 0.35
    stems.setMatrixAt(fn, m4.compose(new THREE.Vector3(x, 0, z), q.identity(), new THREE.Vector3(1, h, 1)))
    const hs = 0.035 + r() * 0.03
    heads.setMatrixAt(fn, m4.compose(new THREE.Vector3(x, h, z), q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), (r() - 0.5) * 0.5), new THREE.Vector3(hs, hs, hs)))
    heads.setColorAt(fn, col.set(palette[(r() * palette.length) | 0]))
    fn++
  }
  stems.count = heads.count = fn
  group.add(stems, heads)
  return {
    group,
    update(t) {
      wind.uTime.value = t
    },
  }
}

/** Garden lamps that light up at night. setNight(k). */
export function gardenLamps({ spots, light }) {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: '#2d3236', roughness: 0.4, metalness: 0.8 })
  const globeMat = new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffcf86', emissiveIntensity: 0, roughness: 0.3 })
  for (const [x, z] of spots) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.3, 10), metal)
    post.position.set(x, 1.15, z)
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.14, 12), metal)
    cap.position.set(x, 2.62, z)
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), globeMat)
    globe.position.set(x, 2.42, z)
    group.add(post, cap, globe)
  }
  const lights = []
  if (!light) {
    for (const [x, z] of spots.filter((_, k) => k % 2 === 0)) {
      const l = new THREE.PointLight('#ffc77a', 0, 14, 1.8)
      l.position.set(x, 2.35, z)
      group.add(l)
      lights.push(l)
    }
  }
  return {
    group,
    setNight(k) {
      globeMat.emissiveIntensity = k * 3
      for (const l of lights) l.intensity = k * 9
    },
  }
}

// ---------------------------------------------------------------- the day/night dial
function dialFace() {
  return paint(512, 512, (g, w) => {
    const c = w / 2
    g.save()
    g.beginPath()
    g.arc(c, c, c - 4, 0, Math.PI * 2)
    g.clip()
    // top half: day (sun in a blue sky); bottom half: night (moon and stars)
    const day = g.createLinearGradient(0, 0, 0, c)
    day.addColorStop(0, '#3d86d8')
    day.addColorStop(1, '#a9d4f5')
    g.fillStyle = day
    g.fillRect(0, 0, w, c)
    const night = g.createLinearGradient(0, c, 0, w)
    night.addColorStop(0, '#1b2350')
    night.addColorStop(1, '#070b22')
    g.fillStyle = night
    g.fillRect(0, c, w, c)
    g.fillStyle = '#ffd34d'
    g.beginPath()
    g.arc(c, c * 0.48, 62, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = '#ffd34d'
    g.lineWidth = 10
    g.lineCap = 'round'
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2
      g.beginPath()
      g.moveTo(c + Math.cos(a) * 80, c * 0.48 + Math.sin(a) * 80)
      g.lineTo(c + Math.cos(a) * 104, c * 0.48 + Math.sin(a) * 104)
      g.stroke()
    }
    // the moon upside down, so that it stands upright when the dial has turned
    g.translate(c, c * 1.52)
    g.rotate(Math.PI)
    g.fillStyle = '#eef2ff'
    g.beginPath()
    g.arc(0, 0, 58, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#121a40'
    g.beginPath()
    g.arc(26, -14, 52, 0, Math.PI * 2)
    g.fill()
    g.setTransform(1, 0, 0, 1, 0, 0)
    const r = rng(3)
    g.fillStyle = '#ffffff'
    for (let k = 0; k < 26; k++) {
      g.beginPath()
      g.arc(r() * w, c + 20 + r() * (c - 40), 1.5 + r() * 2.5, 0, Math.PI * 2)
      g.fill()
    }
    g.restore()
    g.strokeStyle = '#d9c38a'
    g.lineWidth = 10
    g.beginPath()
    g.arc(c, c, c - 6, 0, Math.PI * 2)
    g.stroke()
  })
}

export function dayNightDial({ light }) {
  const group = new THREE.Group()
  const stone = new THREE.MeshPhysicalMaterial({ color: '#cfc8b8', roughness: 0.6, clearcoat: light ? 0 : 0.2 })
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 1.15, 24), stone)
  column.position.y = 0.575
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.12, 32), stone)
  base.position.y = 0.06
  group.add(column, base)
  const holder = new THREE.Group()
  holder.position.y = 1.62
  group.add(holder)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.045, 12, 64), new THREE.MeshStandardMaterial({ color: '#c9a961', metalness: 1, roughness: 0.3 }))
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.5, 64), new THREE.MeshStandardMaterial({ map: dialFace(), roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.15 }))
  face.material.emissiveMap = face.material.map
  const back = face.clone()
  back.rotation.y = Math.PI
  const wheel = new THREE.Group()
  wheel.add(face, back, ring)
  holder.add(wheel)
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), new THREE.MeshStandardMaterial({ color: '#c9a961', metalness: 1, roughness: 0.3 }))
  arm.position.y = -0.3
  holder.add(arm)
  const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 4), glowMat(GOLD, 1.5))
  pointer.position.set(0, 0.62, 0.02)
  pointer.rotation.z = Math.PI
  holder.add(pointer)
  let night = 0
  let target = 0
  return {
    group,
    get night() {
      return target > 0.5
    },
    toggle() {
      target = target > 0.5 ? 0 : 1
      return target > 0.5
    },
    /** Day or night, for the others in a room (src/net/shared.js). */
    state() {
      return { night: target > 0.5 }
    },
    /** Someone else turned the dial: the sky turns here too (live), or is so at once (a newcomer). */
    setState({ night: n = false } = {}, live = false) {
      target = n ? 1 : 0
      if (!live) night = target
    },
    update(dt) {
      night += (target - night) * Math.min(1, dt * 1.6)
      wheel.rotation.z = night * Math.PI
      return night
    },
  }
}

// ---------------------------------------------------------------- "you are 18% carbon"
function personShapes() {
  // a friendly figure, 2 m tall: a round head and a body with arms held a little out
  const right = [
    [0, 1.56], [0.09, 1.56], [0.2, 1.53], [0.3, 1.47], [0.37, 1.36], [0.45, 1.13], [0.52, 0.93], [0.53, 0.84], [0.47, 0.8],
    [0.41, 0.86], [0.35, 1.04], [0.3, 1.16], [0.28, 1.0], [0.27, 0.86], [0.25, 0.62], [0.24, 0.26], [0.28, 0.08], [0.27, 0.0],
    [0.06, 0.0], [0.06, 0.14], [0.05, 0.5], [0.0, 0.6],
  ]
  const pts = [...right, ...right.slice(1, -1).reverse().map(([x, y]) => [-x, y])]
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal', 0.5)
  const body = new THREE.Shape(curve.getPoints(180).map(p => new THREE.Vector2(p.x, p.y)))
  const head = new THREE.Shape()
  head.absarc(0, 1.79, 0.19, 0, Math.PI * 2, false)
  return [body, head]
}

/** The area of the shapes below each height (sampled), so that volumes, not heights, follow the
 *  mass fractions: the figure is filled like a glass. */
function heightsForFractions(shapes, fractions, top = 2.0) {
  const polys = shapes.map(s => s.getPoints(120))
  const N = 800
  const widths = []
  for (let i = 0; i < N; i++) {
    const y = ((i + 0.5) / N) * top
    let w = 0
    for (const poly of polys) {
      const xs = []
      for (let k = 0; k < poly.length; k++) {
        const a = poly[k]
        const b = poly[(k + 1) % poly.length]
        if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) xs.push(a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x))
      }
      xs.sort((p, q) => p - q)
      for (let k = 0; k + 1 < xs.length; k += 2) w += xs[k + 1] - xs[k]
    }
    widths.push(w)
  }
  const total = widths.reduce((s, w) => s + w, 0)
  const out = []
  let acc = 0
  let i = 0
  let cum = 0
  for (const f of fractions) {
    cum += f
    while (i < N && acc / total < cum - 1e-9) acc += widths[i++]
    out.push((i / N) * top)
  }
  return out
}

export function carbonPerson({ light, words }) {
  const group = new THREE.Group()
  const shapes = personShapes()
  const depth = 0.3
  const shellGeo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 32 })
  shellGeo.translate(0, 0, -depth / 2)
  const fillGeo = new THREE.ExtrudeGeometry(shapes, { depth: depth - 0.04, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.015, bevelSegments: 3, curveSegments: 32 })
  fillGeo.translate(0, 0, -(depth - 0.04) / 2)
  const fractions = BODY.map(e => e.mass / 100)
  const tops = heightsForFractions(shapes, fractions)
  const colors = BODY.map(e => new THREE.Color(e.color))
  const fillU = {
    uFill: { value: 0 },
    uTops: { value: tops },
    uColors: { value: colors },
    uTime: { value: 0 },
    uGlowC: { value: 0 },
  }
  const fillMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0 })
  fillMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, fillU)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvY = position.y;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying float vY; uniform float uFill; uniform float uTops[7]; uniform vec3 uColors[7]; uniform float uTime; uniform float uGlowC;
        vec3 bandColor(float y, out int band) {
          band = 6;
          for (int i = 6; i >= 0; i--) { if (y < uTops[i]) band = i; }
          return uColors[band];
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float surface = uFill + 0.012 * sin(vY * 0.0 + uTime * 3.0 + gl_FragCoord.x * 0.02);
        if (vY > surface) discard;
        int band;
        diffuseColor.rgb = bandColor(vY, band);
        float gap = 1.0;
        for (int i = 0; i < 6; i++) gap = min(gap, abs(vY - uTops[i]));
        diffuseColor.rgb *= mix(0.35, 1.0, smoothstep(0.004, 0.014, gap));`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        int band2;
        vec3 bc = bandColor(vY, band2);
        totalEmissiveRadiance += band2 == 1 ? bc * 0.4 + vec3(0.12, 0.42, 0.62) * uGlowC * 0.35 : bc * 0.2;`)
  }
  fillMat.customProgramCacheKey = () => 'carbon-person-fill'
  const fill = new THREE.Mesh(fillGeo, fillMat)
  const shell = new THREE.Mesh(shellGeo, new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color('#eef8ff') } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
      void main() {
        // glass: clear where you look straight through it, bright along its edges
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.6);
        gl_FragColor = vec4(uColor * (0.7 + 0.9 * f), 0.02 + 0.6 * f);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }))
  shell.renderOrder = 4
  const figure = new THREE.Group()
  figure.position.y = 0.32
  figure.add(fill, shell)
  group.add(figure)
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.3, 48), new THREE.MeshPhysicalMaterial({ color: '#cfc8b8', roughness: 0.55, clearcoat: light ? 0 : 0.2 }))
  stand.position.y = 0.15
  const standRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.018, 6, 96), glowMat(GREEN, 1.4))
  standRing.rotation.x = Math.PI / 2
  standRing.position.y = 0.3
  group.add(stand, standRing)
  // labels beside each band, spaced so the thin ones at the top do not overlap
  const W = words()
  const labels = []
  const mids = tops.map((t, i) => ((i ? tops[i - 1] : 0) + t) / 2)
  let last = -1
  const ys = mids.map(m => {
    const y = Math.max(m, last + 0.2)
    last = y
    return y
  })
  BODY.forEach((e, i) => {
    const text = `${W.el[e.el]} ${String(e.mass).replace('.', W.decimal)}%`
    const t = makeText(text, { size: e.el === 'C' ? 0.15 : 0.11, color: e.el === 'C' ? '#ffffff' : '#e8eef7', anchorX: 'left', font: e.el === 'C' ? 'display' : 'medium', outlineWidth: 0.008, outlineColor: '#1b2a1b' })
    t.position.set(0.85, 0.32 + ys[i], 0)
    t.fillOpacity = 0
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.36, 0.32 + mids[i], 0.2), new THREE.Vector3(0.8, 0.32 + ys[i], 0.0)])
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: e.color, transparent: true, opacity: 0 }))
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glowMat(e.color, 1.2, { transparent: true, opacity: 0 }))
    dot.position.set(0.36, 0.32 + mids[i], 0.2)
    group.add(t, line, dot)
    labels.push({ t, line, dot, top: tops[i] })
  })
  const title = makeText(W.personTitle, { size: 0.2, color: '#ffffff', outlineWidth: 0.01, outlineColor: '#24402a' })
  title.position.set(0, 2.72, 0)
  group.add(title)
  let fillT = 1 // filled at the start
  let target = 1
  let glow = 0
  return {
    group,
    refill() {
      fillT = 0
      target = 1
      glow = 0
    },
    update(dt, t) {
      fillU.uTime.value = t
      if (fillT < target) fillT = Math.min(target, fillT + dt / 5)
      const level = easeOut(fillT) * (tops[tops.length - 1] + 0.04)
      fillU.uFill.value = level
      for (const l of labels) {
        const on = level >= l.top - 0.02 ? 1 : 0
        l.t.fillOpacity += (on - l.t.fillOpacity) * Math.min(1, dt * 4)
        l.line.material.opacity = l.t.fillOpacity * 0.8
        l.dot.material.opacity = l.t.fillOpacity
      }
      glow = level >= tops[1] ? Math.min(1, glow + dt) : 0
      fillU.uGlowC.value = glow * (0.6 + 0.4 * Math.sin(t * 2.5))
    },
  }
}

// ---------------------------------------------------------------- the molecule pedestals
export function moleculePedestal({ mol, scale, name, light }) {
  const group = new THREE.Group()
  const stone = new THREE.MeshPhysicalMaterial({ color: '#cfc8b8', roughness: 0.55, clearcoat: light ? 0 : 0.2 })
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 32), stone)
  foot.position.y = 0.04
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.78, 20), stone)
  col.position.y = 0.47
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.06, 32), stone)
  cap.position.y = 0.88
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 64), glowMat(GREEN, 1.4))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.91
  group.add(foot, col, cap, ring)
  const model = ballAndStick(mol, { scale, light })
  model.traverse(o => o.isMesh && (o.castShadow = true))
  const spin = new THREE.Group()
  spin.position.y = 1.5
  spin.add(model)
  group.add(spin)
  const label = makeText(name, { size: 0.13, color: '#ffffff', outlineWidth: 0.008, outlineColor: '#24402a' })
  label.position.set(0, 2.25, 0)
  group.add(label)
  let boost = 0
  return {
    group,
    label,
    update(dt, t) {
      boost = Math.max(0, boost - dt * 0.5)
      spin.rotation.y += dt * (0.35 + boost * 2.2)
      spin.rotation.x = Math.sin(t * 0.5) * 0.25
      spin.position.y = 1.5 + Math.sin(t * 1.1) * 0.04 + Math.sin(Math.min(1, boost) * Math.PI) * 0.12
    },
    spin() {
      boost = 1.5
    },
  }
}

// ---------------------------------------------------------------- carbon-14: the clock and the mammoth
function ivoryTexture() {
  // along a tusk: stained brown at the root (v = 0), creamy toward the tip, with growth bands
  return paint(64, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, h, 0, 0)
    grad.addColorStop(0, '#7d5f3e')
    grad.addColorStop(0.16, '#c4a77e')
    grad.addColorStop(0.45, '#e6d6b6')
    grad.addColorStop(1, '#f5ecd9')
    g.fillStyle = grad
    g.fillRect(0, 0, w, h)
    const r = rng(19)
    for (let yy = 0; yy < h; yy += 5 + r() * 9) {
      g.fillStyle = `rgba(110,80,50,${0.05 + r() * 0.08})`
      g.fillRect(0, yy, w, 1 + r() * 2)
    }
    for (let i = 0; i < 14; i++) {
      g.strokeStyle = `rgba(90,65,40,${0.06 + r() * 0.1})`
      g.beginPath()
      const x = r() * w
      const y0 = r() * h
      g.moveTo(x, y0)
      g.lineTo(x + (r() - 0.5) * 4, y0 + 30 + r() * 120)
      g.stroke()
    }
  })
}

function boneTexture() {
  return paint(256, 256, (g, w, h) => {
    g.fillStyle = '#d9ccb0'
    g.fillRect(0, 0, w, h)
    const r = rng(41)
    for (let i = 0; i < 160; i++) {
      const x = r() * w
      const y = r() * h
      const rad = 4 + r() * 26
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, r() < 0.6 ? 'rgba(120,95,60,0.22)' : 'rgba(250,245,230,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grad
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
    }
    g.strokeStyle = 'rgba(90,70,50,0.25)'
    for (let i = 0; i < 30; i++) {
      g.beginPath()
      const x = r() * w
      g.moveTo(x, 0)
      g.lineTo(x + (r() - 0.5) * 20, h)
      g.stroke()
    }
  }, { repeat: [1, 1] })
}

function clockFace(W) {
  return paint(1024, 1024, (g, w) => {
    const c = w / 2
    const grad = g.createRadialGradient(c, c, 40, c, c, c)
    grad.addColorStop(0, '#20305a')
    grad.addColorStop(1, '#0c1430')
    g.fillStyle = grad
    g.beginPath()
    g.arc(c, c, c - 6, 0, Math.PI * 2)
    g.fill()
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    // eight half-lives round the dial, 0 at the top
    for (let k = 0; k < 8; k++) {
      const a = -Math.PI / 2 + (k / 8) * Math.PI * 2
      g.strokeStyle = k === 4 ? '#ffd166' : '#a8c4ff'
      g.lineWidth = k === 4 ? 12 : 8
      g.beginPath()
      g.moveTo(c + Math.cos(a) * (c - 30), c + Math.sin(a) * (c - 30))
      g.lineTo(c + Math.cos(a) * (c - 90), c + Math.sin(a) * (c - 90))
      g.stroke()
      g.fillStyle = k === 4 ? '#ffd166' : '#e6eeff'
      g.font = `bold ${k ? 54 : 70}px sans-serif`
      const years = W.fmt(k * C14.halfLife)
      g.fillText(k ? years : '0', c + Math.cos(a) * (c - 175), c + Math.sin(a) * (c - 175))
      for (let m = 1; m < 5; m++) {
        const b = a + (m / 5) * (Math.PI / 4)
        g.lineWidth = 4
        g.strokeStyle = '#6f86c4'
        g.beginPath()
        g.moveTo(c + Math.cos(b) * (c - 30), c + Math.sin(b) * (c - 30))
        g.lineTo(c + Math.cos(b) * (c - 60), c + Math.sin(b) * (c - 60))
        g.stroke()
      }
    }
    g.strokeStyle = '#d9c38a'
    g.lineWidth = 16
    g.beginPath()
    g.arc(c, c, c - 10, 0, Math.PI * 2)
    g.stroke()
  })
}

/** The carbon-14 clock: a dial of half-lives, a jar of 64 carbon-14 atoms (half of those left decay
 *  to nitrogen-14 at each 5730 years), and a mammoth's thigh bone with 1/16 of its carbon-14 left.
 *  advance() moves the clock on one half-life; returns { halvings, years, left } or null if busy. */
export function c14Clock({ light, words }) {
  const W = words()
  const group = new THREE.Group()
  const stone = new THREE.MeshPhysicalMaterial({ color: '#b3aa98', roughness: 0.65, clearcoat: light ? 0 : 0.15 })
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.7, 0.14, 64), stone)
  platform.position.y = 0.07
  group.add(platform)
  // the bone (a mammoth's femur, about 1.2 m) on a low plinth, with its tag
  const boneMat = new THREE.MeshStandardMaterial({ map: boneTexture(), roughness: 0.75, color: '#efe6d4' })
  const bone = new THREE.Group()
  const shaft = new THREE.Mesh(taperedTube([new THREE.Vector3(-0.42, 0, 0), new THREE.Vector3(-0.1, 0.03, 0.01), new THREE.Vector3(0.2, 0.02, -0.01), new THREE.Vector3(0.44, 0, 0)], 0.075, 0.068, { radial: 20, segments: 24, flare: u => 1 + 0.35 * Math.pow(Math.abs(u - 0.5) * 2, 3) }), boneMat)
  bone.add(shaft)
  const knob = (x, y, z, s) => {
    const k = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), boneMat)
    k.position.set(x, y, z)
    k.scale.set(...s)
    bone.add(k)
  }
  knob(-0.52, 0.05, 0.04, [0.11, 0.12, 0.12]) // the head of the femur
  knob(-0.45, -0.01, -0.07, [0.09, 0.08, 0.08]) // the greater trochanter
  knob(0.52, 0.0, 0.07, [0.1, 0.09, 0.1]) // the two condyles at the knee
  knob(0.52, 0.0, -0.07, [0.1, 0.09, 0.1])
  bone.rotation.y = 0.15
  const cradle = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.62, 0.62, 3, 0.05), stone)
  cradle.position.set(0, 0.45, 0.9)
  bone.position.set(0, 0.88, 0.9)
  bone.traverse(o => o.isMesh && (o.castShadow = true))
  group.add(cradle, bone)
  const boneGlowMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const boneGlow = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 6, 16).rotateZ(Math.PI / 2), boneGlowMat)
  boneGlow.position.copy(bone.position)
  group.add(boneGlow)
  const tag = makeText(W.boneTag, { size: 0.075, color: '#3a2c18', maxWidth: 1.3, font: 'medium' })
  tag.position.set(0, 0.62, 1.215)
  group.add(tag)
  // a whole tusk lying behind the bone on two cradles, as museums show them: thick at the root (stained
  // brown from the ground, cut open to show its rings), sweeping round in a long curve, the tip rising
  // shown in profile, standing like a crescent: the root low on the left, the tusk sweeping out and up,
  // its tip curling back in at the top (it also twists a little toward you, as tusks spiral)
  const tuskCurve = new THREE.CatmullRomCurve3(Array.from({ length: 29 }, (_, i) => {
    const u = i / 28
    const phi = (-118 + 232 * u) * (Math.PI / 180)
    const rr = 0.9 - 0.26 * u
    return new THREE.Vector3(0.18 + rr * Math.cos(phi), 1.28 + rr * Math.sin(phi), -1.45 + 0.3 * u * u)
  }), false, 'centripetal')
  const tuskR = u => 0.02 + 0.13 * (1 - Math.pow(u, 1.5))
  const ivory = new THREE.MeshPhysicalMaterial({ map: ivoryTexture(), roughness: 0.36, clearcoat: light ? 0 : 0.35, clearcoatRoughness: 0.4 })
  const tusk = new THREE.Mesh(taperedTube(tuskCurve, 0.15, 0.02, { radial: 24, segments: 90, flare: u => tuskR(u) / (0.15 - 0.13 * u) }), ivory)
  tusk.castShadow = true
  group.add(tusk)
  // the cut root: growth rings round a dark pulp cavity
  const rootAt = tuskCurve.getPointAt(0)
  const rootDir = tuskCurve.getTangentAt(0).negate()
  const ringTex = paint(128, 128, (g, w) => {
    const c = w / 2
    for (let r = c; r > 2; r -= 3) {
      g.fillStyle = r > c * 0.4 ? (r % 6 < 3 ? '#e3d2b0' : '#cdb58c') : '#5a3f28'
      g.beginPath()
      g.arc(c, c, r, 0, Math.PI * 2)
      g.fill()
    }
  })
  const cap = new THREE.Mesh(new THREE.CircleGeometry(tuskR(0) * 1.0, 32), new THREE.MeshStandardMaterial({ map: ringTex, roughness: 0.6 }))
  cap.position.copy(rootAt).addScaledVector(rootDir, 0.002)
  cap.lookAt(rootAt.clone().add(rootDir))
  group.add(cap)
  // its mount: two dark metal posts with cradles that hold it up behind the bone
  const mountMat = new THREE.MeshStandardMaterial({ color: '#2d2a28', roughness: 0.4, metalness: 0.8 })
  for (const u of [0.1, 0.38]) {
    const p = tuskCurve.getPointAt(u)
    const h = p.y - tuskR(u) - 0.14
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, h, 12), mountMat)
    post.position.set(p.x, 0.14 + h / 2, p.z)
    const fork = new THREE.Mesh(new THREE.TorusGeometry(tuskR(u) * 1.05, 0.012, 6, 24, Math.PI), mountMat)
    fork.position.set(p.x, p.y, p.z)
    const t = tuskCurve.getTangentAt(u)
    fork.rotation.set(0, Math.atan2(t.x, t.z) + Math.PI / 2, Math.PI)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 20), mountMat)
    foot.position.set(p.x, 0.155, p.z)
    group.add(post, fork, foot)
  }
  const tuskTag = makeText(W.tuskTag, { size: 0.065, color: '#3a2c18', maxWidth: 0.9, font: 'medium' })
  const tagPlate = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.2, 0.03, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#d8c79a', roughness: 0.4, metalness: 0.6 }))
  const tagGroup = new THREE.Group()
  tagGroup.position.set(1.42, 0.36, 1.22)
  tagGroup.rotation.set(-0.85, 0, 0)
  tuskTag.position.z = 0.02
  tagGroup.add(tagPlate, tuskTag)
  group.add(tagGroup)
  // the clock
  const clock = new THREE.Group()
  clock.position.set(-1.65, 1.8, -0.2)
  clock.rotation.y = 0.45
  group.add(clock)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.1, 12), new THREE.MeshStandardMaterial({ color: '#2b3236', metalness: 0.8, roughness: 0.35 }))
  post.position.set(0, -1.25, -0.08)
  clock.add(post)
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.72, 64), new THREE.MeshStandardMaterial({ map: clockFace(W), roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.35 }))
  face.material.emissiveMap = face.material.map
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.04, 12, 64), new THREE.MeshStandardMaterial({ color: '#c9a961', metalness: 1, roughness: 0.3 }))
  const backing = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 64), new THREE.MeshStandardMaterial({ color: '#1b2236', roughness: 0.6 }))
  backing.rotation.x = Math.PI / 2
  backing.position.z = -0.035
  clock.add(face, rim, backing)
  const hand = new THREE.Group()
  hand.position.z = 0.02
  const handMesh = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.56, 0.012), glowMat(GOLD, 1.6))
  handMesh.position.y = 0.26
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16), new THREE.MeshStandardMaterial({ color: '#c9a961', metalness: 1, roughness: 0.3 }))
  hub.rotation.x = Math.PI / 2
  hand.add(handMesh, hub)
  clock.add(hand)
  const yearsText = makeText(`0 ${W.years}`, { size: 0.12, color: '#ffffff', outlineWidth: 0.008, outlineColor: '#10183a' })
  yearsText.position.set(0, -0.93, 0.03)
  clock.add(yearsText)
  // the jar: 64 atoms of carbon-14
  const jar = new THREE.Group()
  jar.position.set(1.65, 1.35, -0.1)
  group.add(jar)
  const jarStand = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.0, 24), stone)
  jarStand.position.y = -0.85
  jar.add(jarStand)
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.44, 40, 28), new THREE.MeshPhysicalMaterial({ color: '#e8f6ff', roughness: 0.03, transparent: true, opacity: 0.16, clearcoat: light ? 0 : 1, depthWrite: false }))
  glass.renderOrder = 4
  jar.add(glass)
  const N = 64
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 12, 9), new THREE.MeshBasicMaterial({ color: '#ffffff' }), N)
  const r = rng(64)
  const home = []
  const m4 = new THREE.Matrix4()
  while (home.length < N) {
    const p = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).multiplyScalar(0.36)
    if (p.length() < 0.36 && home.every(q => q.distanceTo(p) > 0.075)) home.push(p)
  }
  const c14 = new THREE.Color('#4fe6ff').multiplyScalar(1.6)
  const n14 = new THREE.Color('#2a3f9a').multiplyScalar(0.55)
  const alive = new Array(N).fill(true)
  home.forEach((p, i) => {
    atoms.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z))
    atoms.setColorAt(i, c14)
  })
  jar.add(atoms)
  const jarLabel = makeText(W.jarLabel, { size: 0.07, color: '#ffffff', maxWidth: 1.0, outlineWidth: 0.006, outlineColor: '#10183a' })
  jarLabel.position.set(0, 0.62, 0)
  jar.add(jarLabel)
  const countText = makeText('64 / 64', { size: 0.11, color: '#9ff4ff', outlineWidth: 0.006, outlineColor: '#10183a' })
  countText.position.set(0, -0.56, 0.32)
  jar.add(countText)
  let halvings = 0
  let anim = -1
  let from = 0
  const flashes = new Array(N).fill(0)
  const setCount = n => {
    countText.text = `${n} / 64`
    countText.sync()
  }
  let boneLit = 0
  return {
    group,
    get halvings() {
      return halvings
    },
    /** The half-lives gone by and which atoms are still carbon-14 (a 0 or 1 for each), for the others in
     *  a room (src/net/shared.js): which ones decay is chance, so the one who turned it says. */
    state() {
      return { h: halvings, alive: alive.map(a => (a ? 1 : 0)).join('') }
    },
    /** Someone else turned the clock: their atoms decay here (flashing, the hand turning, when live); a
     *  newcomer's clock stands there at once. */
    setState({ h = 0, alive: mask = '' } = {}, live = false) {
      const n = Math.max(0, Math.min(8, Math.round(Number(h) || 0)))
      const want = Array.from({ length: N }, (_, i) => String(mask)[i] !== '0')
      if (n === halvings && want.every((a, i) => a === alive[i])) return
      for (let i = 0; i < N; i++) {
        if (want[i] === alive[i]) continue
        alive[i] = want[i]
        flashes[i] = 0
        if (want[i]) atoms.setColorAt(i, c14)
        else if (live) flashes[i] = 1
        else atoms.setColorAt(i, n14)
      }
      atoms.instanceColor.needsUpdate = true
      halvings = n
      if (!live) {
        hand.rotation.z = -(halvings / 8) * Math.PI * 2
        setCount(alive.filter(Boolean).length)
      }
      // the hand turns there (at once for a newcomer: from where it already stands), the count after it
      from = hand.rotation.z
      anim = 0
    },
    advance() {
      if (anim >= 0) return null
      if (halvings >= 8) {
        // start again: a living sample
        halvings = 0
        alive.fill(true)
        home.forEach((_, i) => atoms.setColorAt(i, c14))
        atoms.instanceColor.needsUpdate = true
        setCount(64)
        from = hand.rotation.z
        anim = 0
        return { halvings: 0, years: 0, left: 64 }
      }
      halvings++
      // half of those still carbon-14 decay (chosen at random, as decay is)
      const live = alive.map((a, i) => (a ? i : -1)).filter(i => i >= 0)
      for (let k = live.length - 1; k > 0; k--) {
        const j = Math.floor(r() * (k + 1))
        ;[live[k], live[j]] = [live[j], live[k]]
      }
      for (const i of live.slice(0, live.length / 2)) {
        alive[i] = false
        flashes[i] = 1
      }
      from = hand.rotation.z
      anim = 0
      const left = alive.filter(Boolean).length
      return { halvings, years: halvings * C14.halfLife, left }
    },
    update(dt, t) {
      if (anim >= 0) {
        anim = Math.min(1, anim + dt / 1.6)
        const to = -(halvings / 8) * Math.PI * 2
        hand.rotation.z = from + (to - from) * easeInOut(anim)
        const yrs = Math.round((-hand.rotation.z / (Math.PI * 2)) * 8 * C14.halfLife / 10) * 10
        yearsText.text = `${W.fmt(yrs)} ${W.years}`
        yearsText.sync()
        if (anim >= 1) {
          anim = -1
          setCount(alive.filter(Boolean).length)
        }
      }
      let changed = false
      for (let i = 0; i < N; i++) {
        if (flashes[i] > 0) {
          flashes[i] = Math.max(0, flashes[i] - dt * 0.8)
          atoms.setColorAt(i, n14.clone().lerp(new THREE.Color('#ffffff').multiplyScalar(2.5), flashes[i]))
          changed = true
        }
      }
      if (changed) atoms.instanceColor.needsUpdate = true
      // atoms jiggle a little in the jar
      for (let i = 0; i < N; i++) {
        const p = home[i]
        m4.makeTranslation(p.x + Math.sin(t * 2.1 + i) * 0.006, p.y + Math.cos(t * 1.7 + i * 1.3) * 0.006, p.z)
        atoms.setMatrixAt(i, m4)
      }
      atoms.instanceMatrix.needsUpdate = true
      boneLit += ((halvings === C14.sampleHalvings ? 1 : 0) - boneLit) * Math.min(1, dt * 2)
      boneGlowMat.opacity = boneLit * (0.42 + 0.14 * Math.sin(t * 3))
    },
  }
}

// ---------------------------------------------------------------- the carbon cycle
function sheep(s = 1) {
  const g = new THREE.Group()
  const wool = new THREE.MeshStandardMaterial({ color: '#f3f0ea', roughness: 0.95 })
  const dark = new THREE.MeshStandardMaterial({ color: '#2b2622', roughness: 0.7 })
  const body = new THREE.Group()
  const r = rng(77)
  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.07 + r() * 0.02, 12, 10), wool)
    b.position.set((r() - 0.5) * 0.16, 0.2 + (r() - 0.5) * 0.06, (r() - 0.5) * 0.09)
    body.add(b)
  }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), dark)
  head.scale.set(1.3, 0.9, 0.9)
  head.position.set(0.15, 0.24, 0)
  g.add(body, head)
  for (const [x, z] of [[0.07, 0.04], [0.07, -0.04], [-0.07, 0.04], [-0.07, -0.04]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.16, 6), dark)
    leg.position.set(x, 0.08, z)
    g.add(leg)
  }
  g.scale.setScalar(s)
  return g
}

/** The carbon cycle on a round table: a little landscape (wooded hills, a meadow with sheep, the sea,
 *  the soil with its mushrooms, a town whose power station burns coal and oil), a quarter cut away to
 *  show the rock underneath with a coal seam and an oil pocket, and the air as a cloud over it all.
 *  Markers flow between the stores. setLevel(level) shows Explorer names or Scientist stores. */
export function cycleTable({ light, words }) {
  const group = new THREE.Group()
  const top = 1.0
  const R = 1.55
  const smooth01 = t => t * t * (3 - 2 * t)
  // the table: a disc of land with a quarter cut away (toward +z) to show what lies underneath
  const strata = [
    ['#4c3828', 0.12], ['#7a6a58', 0.16], ['#1b1b1b', 0.1], ['#8c7b66', 0.12], ['#5a4936', 0.16],
  ]
  let y = top
  const wedge = Math.PI * 0.5
  for (const [c, h] of strata) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, h, 96, 1, false, wedge * 0.5, Math.PI * 2 - wedge), new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }))
    m.position.y = y - h / 2
    group.add(m)
    y -= h
  }
  const total = strata.reduce((sum, [, h]) => sum + h, 0)
  const cutTex = paint(256, 256, (g, w, h) => {
    let yy = 0
    const rr = rng(13)
    for (const [c, hh] of strata) {
      const band = (hh / total) * h
      g.fillStyle = c
      g.fillRect(0, yy, w, band + 1)
      for (let i = 0; i < 160 * (hh / total); i++) {
        g.fillStyle = `rgba(${rr() < 0.5 ? '255,240,220' : '0,0,0'},${0.06 + rr() * 0.1})`
        g.beginPath()
        g.arc(rr() * w, yy + rr() * band, 1 + rr() * 3, 0, Math.PI * 2)
        g.fill()
      }
      yy += band
    }
  })
  const cutMat = new THREE.MeshStandardMaterial({ map: cutTex, roughness: 0.95, side: THREE.DoubleSide })
  for (const a of [wedge * 0.5, -wedge * 0.5 + Math.PI * 2]) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(R, top - y), cutMat)
    face.position.set((Math.sin(a) * R) / 2, (top + y) / 2, (Math.cos(a) * R) / 2)
    face.rotation.y = a + Math.PI / 2
    group.add(face)
  }
  const oil = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshPhysicalMaterial({ color: '#1a1206', roughness: 0.1, clearcoat: 1 }))
  oil.scale.set(1.4, 0.45, 1.4)
  oil.position.set(0, top - 0.56, 0.95)
  group.add(oil)
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, y, 32), new THREE.MeshStandardMaterial({ color: '#4a4036', roughness: 0.8 }))
  legs.position.y = y / 2
  group.add(legs)

  // the land: wooded hills at the back, flat toward the cut and where the sea, the soil and the town lie
  const SEA = [-0.82, 0.32, 0.46]
  const TOWN = [0.86, 0.42, 0.4]
  const SOIL = [0.78, -0.38, 0.28]
  const H = (x, z) => {
    const r = Math.hypot(x, z)
    const rim = smooth01(clamp((R - r) / 0.2, 0, 1))
    const back = smooth01(clamp((0.25 - z) / 0.6, 0, 1))
    const bump = (cx, cz, s, h) => h * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / s)
    let h = bump(-0.42, -0.72, 0.14, 0.22) + bump(0.12, -1.02, 0.07, 0.13) + bump(-0.98, -0.42, 0.05, 0.1)
    h += 0.025 * (Math.sin(x * 5.3 + 0.6) * Math.cos(z * 4.7) * 0.5 + 0.5)
    const flat = ([cx, cz, rr]) => smooth01(clamp((Math.hypot(x - cx, z - cz) - rr) / 0.18, 0, 1))
    return h * rim * back * flat(SEA) * flat(TOWN) * flat(SOIL)
  }
  const landGeo = new THREE.RingGeometry(0.001, R, 128, 48, -Math.PI / 2 + wedge / 2, Math.PI * 2 - wedge)
  const lp = landGeo.getAttribute('position')
  for (let i = 0; i < lp.count; i++) lp.setZ(i, H(lp.getX(i), -lp.getY(i)))
  landGeo.computeVertexNormals()
  const landTex = paint(256, 256, (g, w, h) => {
    g.fillStyle = '#5c9443'
    g.fillRect(0, 0, w, h)
    const rr = rng(6)
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = `hsla(${90 + rr() * 30}, 45%, ${26 + rr() * 22}%, 0.7)`
      g.fillRect(rr() * w, rr() * h, 2, 2)
    }
  }, { repeat: [3, 3] })
  const land = new THREE.Mesh(landGeo, new THREE.MeshStandardMaterial({ map: landTex, roughness: 0.95 }))
  land.rotation.x = -Math.PI / 2
  land.position.y = top + 0.002
  land.receiveShadow = true
  group.add(land)
  const at = (x, z, lift = 0) => new THREE.Vector3(x, top + H(x, z) + lift, z)
  // the sea, a soil patch with mushrooms
  const sea = new THREE.Mesh(new THREE.CircleGeometry(SEA[2], 48), new THREE.MeshPhysicalMaterial({ color: '#1f6aa5', roughness: 0.06, clearcoat: 1, transparent: true, opacity: 0.94 }))
  sea.rotation.x = -Math.PI / 2
  sea.position.set(SEA[0], top + 0.01, SEA[1])
  group.add(sea)
  const soil = new THREE.Mesh(new THREE.CircleGeometry(SOIL[2], 32), new THREE.MeshStandardMaterial({ color: '#5a3f26', roughness: 1 }))
  soil.rotation.x = -Math.PI / 2
  soil.position.set(SOIL[0], top + 0.008, SOIL[1])
  group.add(soil)
  for (const [x, z, s] of [[0.72, -0.34, 1], [0.86, -0.46, 0.7], [0.9, -0.26, 0.85], [0.66, -0.47, 0.6]]) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * s, 0.015 * s, 0.07 * s, 8), new THREE.MeshStandardMaterial({ color: '#f1e8d6' }))
    stem.position.set(x, top + 0.035 * s, z)
    const capM = new THREE.Mesh(new THREE.SphereGeometry(0.04 * s, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#b5462e', roughness: 0.6 }))
    capM.position.set(x, top + 0.065 * s, z)
    group.add(stem, capM)
  }
  // a forest on the hills: round broadleaf trees and pointed conifers
  const fr = rng(12)
  const trees = []
  while (trees.length < (light ? 16 : 26)) {
    const a = fr() * Math.PI * 2
    const d = Math.sqrt(fr()) * 0.5
    const x = -0.42 + Math.cos(a) * d * 1.3
    const z = -0.72 + Math.sin(a) * d
    if (Math.hypot(x, z) > R - 0.12 || trees.some(t => Math.hypot(t[0] - x, t[1] - z) < 0.085)) continue
    trees.push([x, z, 0.75 + fr() * 0.5, fr() < 0.45])
  }
  const trunkGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.07, 6)
  trunkGeo.translate(0, 0.035, 0)
  const trunks = new THREE.InstancedMesh(trunkGeo, new THREE.MeshStandardMaterial({ color: '#5a4030', roughness: 0.9 }), trees.length)
  const roundGeo = new THREE.IcosahedronGeometry(0.06, 1)
  const coneGeo = new THREE.ConeGeometry(0.05, 0.16, 8)
  const rounds = new THREE.InstancedMesh(roundGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, flatShading: true }), trees.length)
  const cones = new THREE.InstancedMesh(coneGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, flatShading: true }), trees.length)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const col = new THREE.Color()
  let nr = 0
  let nc = 0
  trees.forEach(([x, z, s, conifer], i) => {
    const base = at(x, z)
    trunks.setMatrixAt(i, m4.compose(base, q.identity(), new THREE.Vector3(s, s, s)))
    if (conifer) {
      cones.setMatrixAt(nc, m4.compose(base.clone().add(new THREE.Vector3(0, 0.12 * s, 0)), q, new THREE.Vector3(s, s, s)))
      cones.setColorAt(nc++, col.setHSL(0.36 + fr() * 0.04, 0.45, 0.2 + fr() * 0.06))
    } else {
      rounds.setMatrixAt(nr, m4.compose(base.clone().add(new THREE.Vector3(0, 0.1 * s, 0)), q.setFromEuler(new THREE.Euler(0, fr() * 3, 0)), new THREE.Vector3(s, s * 1.15, s)))
      rounds.setColorAt(nr++, col.setHSL(0.25 + fr() * 0.07, 0.5, 0.26 + fr() * 0.08))
    }
  })
  rounds.count = nr
  cones.count = nc
  for (const m of [trunks, rounds, cones]) {
    m.castShadow = true
    group.add(m)
  }
  // sheep on the meadow
  for (const [x, z, rot] of [[0.18, -0.48, 2.2], [0.38, -0.62, 0.6], [0.3, -0.3, -1.2]]) {
    const sh = sheep(0.62)
    sh.position.copy(at(x, z))
    sh.rotation.y = rot
    group.add(sh)
  }
  // a town with a power station burning coal and oil
  const town = new THREE.Group()
  group.add(town)
  const walls = new THREE.MeshStandardMaterial({ color: '#efe6d6', roughness: 0.8 })
  const roof = new THREE.MeshStandardMaterial({ color: '#b5533c', roughness: 0.7 })
  const tr = rng(29)
  for (const [x, z] of [[0.62, 0.3], [0.7, 0.55], [0.84, 0.72], [1.04, 0.62], [0.6, 0.72], [1.12, 0.36]]) {
    const w = 0.08 + tr() * 0.04
    const h = 0.06 + tr() * 0.04
    const house = new THREE.Mesh(new THREE.BoxGeometry(w, h, w * 0.8), walls)
    house.position.set(x, top + h / 2, z)
    house.rotation.y = tr() * 0.6
    const r = new THREE.Mesh(new THREE.ConeGeometry(w * 0.78, 0.06, 4), roof)
    r.position.set(x, top + h + 0.03, z)
    r.rotation.y = house.rotation.y + Math.PI / 4
    town.add(house, r)
  }
  const plant = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.13, 0.17, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#8d8a86', roughness: 0.7 }))
  plant.position.set(0.98, top + 0.065, 0.2)
  const stackM = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.34, 14), new THREE.MeshStandardMaterial({ color: '#a8574a', roughness: 0.7 }))
  stackM.position.set(1.06, top + 0.17 + 0.13, 0.2)
  for (const yy of [0.22, 0.29]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.005, 6, 20), new THREE.MeshStandardMaterial({ color: '#f2efe9' }))
    band.rotation.x = Math.PI / 2
    band.position.set(1.06, top + 0.13 + yy, 0.2)
    town.add(band)
  }
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), glowMat('#ff8a2a', 3))
  ember.position.set(1.06, top + 0.48, 0.2)
  town.add(plant, stackM, ember)
  const smokeMat = new THREE.MeshStandardMaterial({ color: '#8e8e8e', roughness: 1, transparent: true, opacity: 0.55, depthWrite: false })
  const puffs = []
  for (let i = 0; i < 6; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), smokeMat.clone())
    town.add(puff)
    puffs.push({ puff, ph: i / 6 })
  }
  // the air: a cloud over the middle
  const cloud = new THREE.Group()
  cloud.position.set(0, top + 1.2, 0)
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: 0.92 })
  const cr = rng(5)
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.12 + cr() * 0.09, 16, 12), cloudMat)
    s.position.set((cr() - 0.5) * 0.55, (cr() - 0.5) * 0.1, (cr() - 0.5) * 0.28)
    cloud.add(s)
  }
  group.add(cloud)
  // the flows between the stores
  const P = {
    air: new THREE.Vector3(0, top + 1.13, 0),
    plants: at(-0.42, -0.72, 0.3),
    animals: at(0.28, -0.47, 0.2),
    ocean: new THREE.Vector3(SEA[0], top + 0.05, SEA[1]),
    soil: new THREE.Vector3(SOIL[0], top + 0.06, SOIL[1]),
    fossil: new THREE.Vector3(0, top - 0.42, 0.72),
    fire: new THREE.Vector3(1.06, top + 0.5, 0.2),
  }
  const flows = [
    ['air', 'plants', '#5fdc5a', 1.0, 0.5],
    ['plants', 'air', '#e8f2ff', 0.9, 0.35],
    ['plants', 'animals', '#f2c14e', 0.5, 0.2],
    ['animals', 'air', '#e8f2ff', 0.45, 0.4],
    ['plants', 'soil', '#a8743f', 0.6, 0.15],
    ['animals', 'soil', '#a8743f', 0.35, 0.15],
    ['soil', 'air', '#e8f2ff', 0.6, 0.45],
    ['air', 'ocean', '#59b8ff', 0.75, 0.3],
    ['ocean', 'air', '#bfe6ff', 0.72, 0.3],
    ['soil', 'fossil', '#6b5a4a', 0.12, 0.05],
    ['fossil', 'fire', '#3a3a3a', 0.4, 0.15],
    ['fire', 'air', '#ff8a3a', 0.55, 0.35],
  ]
  const curves = flows.map(([a, b, , , lift]) => {
    const A = P[a]
    const B = P[b]
    const mid = A.clone().lerp(B, 0.5)
    const side = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.12)
    mid.y += lift
    mid.add(side)
    return new THREE.QuadraticBezierCurve3(A, mid, B)
  })
  const tubeMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12, depthWrite: false })
  for (const c of curves) group.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.006, 4), tubeMat))
  const per = light ? 3 : 6
  const markers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }), flows.length * per)
  flows.forEach(([, , c], f) => {
    for (let k = 0; k < per; k++) markers.setColorAt(f * per + k, col.set(c).multiplyScalar(1.4))
  })
  markers.frustumCulled = false
  group.add(markers)
  // labels at each store
  const labels = {}
  const W = words()
  for (const id of Object.keys(P)) {
    const t = makeText(W.cycle.kid[id], { size: 0.085, color: '#ffffff', outlineWidth: 0.007, outlineColor: '#1d2d1d', maxWidth: 1.0 })
    const off = id === 'air' ? [0, 0.3, 0] : id === 'fossil' ? [0, -0.02, 0.45] : id === 'fire' ? [0, 0.2, 0] : [0, 0.17, 0]
    t.position.copy(P[id]).add(new THREE.Vector3(...off))
    group.add(t)
    labels[id] = t
  }
  const pos = new THREE.Vector3()
  let speedBoost = 0
  return {
    group,
    labels,
    setLevel(level) {
      // the Scientist's labels are longer: smaller letters, wider lines
      const sci = level === 'scientist'
      for (const id of Object.keys(labels)) {
        Object.assign(labels[id], { text: sci ? W.cycle.sci[id] : W.cycle.kid[id], fontSize: sci ? 0.058 : 0.085, maxWidth: sci ? 1.5 : 1.0 })
        labels[id].sync()
      }
    },
    burst() {
      speedBoost = 2
    },
    update(dt, t, cameraQuat) {
      speedBoost = Math.max(0, speedBoost - dt * 0.4)
      flows.forEach(([, , , speed], f) => {
        for (let k = 0; k < per; k++) {
          const u = ((t * speed * 0.22 * (1 + speedBoost) + k / per) % 1 + 1) % 1
          curves[f].getPoint(u, pos)
          const s = Math.min(1, u * 8, (1 - u) * 8)
          m4.makeScale(s, s, s).setPosition(pos)
          markers.setMatrixAt(f * per + k, m4)
        }
      })
      markers.instanceMatrix.needsUpdate = true
      cloud.position.y = top + 1.2 + Math.sin(t * 0.8) * 0.03
      for (const p of puffs) {
        const u = (t * 0.25 + p.ph) % 1
        p.puff.position.set(1.06 + u * 0.12, top + 0.5 + u * 0.38, 0.2 - u * 0.05)
        p.puff.scale.setScalar(0.6 + u * 1.6)
        p.puff.material.opacity = 0.5 * Math.sin(u * Math.PI)
      }
      ember.scale.setScalar(1 + Math.sin(t * 13) * 0.15)
      if (cameraQuat) for (const l of Object.values(labels)) l.quaternion.copy(cameraQuat)
    },
  }
}

// ---------------------------------------------------------------- butterflies
/** A few butterflies over the flower beds: two wings each, flapping, wandering on looping paths. */
export function butterflies({ count = 10, radius = 15, light }) {
  const wingTex = paint(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    // one wing (the right one), its root at the left edge; white, tinted per butterfly
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.moveTo(4, 64)
    g.bezierCurveTo(30, 6, 118, 2, 120, 40)
    g.bezierCurveTo(122, 62, 90, 66, 70, 66)
    g.bezierCurveTo(100, 76, 112, 110, 84, 122)
    g.bezierCurveTo(56, 128, 20, 96, 4, 64)
    g.fill()
    g.fillStyle = 'rgba(30,20,20,0.85)'
    g.beginPath()
    g.ellipse(96, 30, 14, 9, 0.4, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = 'rgba(30,20,20,0.7)'
    g.lineWidth = 5
    g.beginPath()
    g.moveTo(10, 64)
    g.bezierCurveTo(40, 30, 100, 10, 118, 40)
    g.stroke()
    g.fillStyle = 'rgba(255,255,255,0.9)'
    for (const [x, y] of [[108, 44], [96, 104], [80, 112]]) {
      g.beginPath()
      g.arc(x, y, 4, 0, Math.PI * 2)
      g.fill()
    }
  })
  const geo = new THREE.PlaneGeometry(0.11, 0.11)
  geo.translate(0.055, 0, 0) // hinge at the body
  const mat = new THREE.MeshStandardMaterial({ map: wingTex, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.6 })
  const n = light ? Math.ceil(count / 2) : count
  const wings = new THREE.InstancedMesh(geo, mat, n * 2)
  const r = rng(57)
  const palette = ['#ff9f1c', '#3a86ff', '#ffd23f', '#ffffff', '#ff5d8f', '#8338ec']
  const flies = Array.from({ length: n }, (_, i) => {
    const a = r() * Math.PI * 2
    const rad = radius * (0.72 + r() * 0.2)
    return { cx: Math.cos(a) * rad, cz: Math.sin(a) * rad, ph: r() * 10, sp: 0.25 + r() * 0.2, rx: 1.2 + r() * 1.6, rz: 1.0 + r() * 1.4, flap: 9 + r() * 5, color: palette[i % palette.length] }
  })
  const col = new THREE.Color()
  flies.forEach((f, i) => {
    wings.setColorAt(i * 2, col.set(f.color))
    wings.setColorAt(i * 2 + 1, col.set(f.color))
  })
  wings.frustumCulled = false
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const qy = new THREE.Quaternion()
  const qz = new THREE.Quaternion()
  const one = new THREE.Vector3(1, 1, 1)
  const p = new THREE.Vector3()
  const yAxis = new THREE.Vector3(0, 1, 0)
  const xAxis = new THREE.Vector3(1, 0, 0)
  return {
    group: wings,
    update(t) {
      flies.forEach((f, i) => {
        const u = t * f.sp + f.ph
        p.set(f.cx + Math.sin(u) * f.rx, 0.55 + Math.sin(u * 2.3) * 0.25 + Math.sin(u * 5.1) * 0.06, f.cz + Math.sin(u * 1.7) * f.rz)
        // heading along its path
        const dx = Math.cos(u) * f.rx
        const dz = Math.cos(u * 1.7) * 1.7 * f.rz
        qy.setFromAxisAngle(yAxis, Math.atan2(dx, dz))
        const flap = 0.25 + 0.95 * (0.5 + 0.5 * Math.sin(t * f.flap + f.ph))
        for (const side of [1, -1]) {
          // a wing lies along +x from the body; the left wing is the right one turned round
          qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), side * flap)
          q.copy(qy).multiply(new THREE.Quaternion().setFromAxisAngle(yAxis, side > 0 ? -Math.PI / 2 : Math.PI / 2)).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, -Math.PI / 2)).multiply(qz)
          wings.setMatrixAt(i * 2 + (side > 0 ? 0 : 1), m4.compose(p, q, one))
        }
      })
      wings.instanceMatrix.needsUpdate = true
    },
  }
}
