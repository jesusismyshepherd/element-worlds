// A stage for picture rooms (docs/knowledge/picture-rooms.md): inside a space station module, as in the
// Russian segment of the International Space Station. A long white cylinder of panels (3.3 m in radius, 24 m
// long) with a floor deck of dark grey plates and two velcro strips for velcro shoes, a bank of equipment
// racks down each wall (one bay per metre; the scene leaves gaps where its own machines stand: `gaps`),
// yellow handrails, cable bundles along the ceiling, fluorescent light strips, a hatch at each end, and a
// round porthole in the left wall with the real Earth turning below: oceans, land, cloud, city lights on the
// night side, a blue limb, and the Sun going round in `PERIOD` seconds (sped up from 92 minutes) so that
// every turn a sunrise comes over the limb in the window and a warm beam crosses the module. A few water
// drops and a pen float about (nothing is tied down in orbit).
// Along z: the visitor arrives at +z (the way back, a frame, at z = 6.1) and the module runs away to -z.
// The walkway is |x| < 2.0 (the racks stand from 2.05 to 2.8 on both sides).
// Exports `stationStage({ light, pixelRatio, gaps })` -> { group, solids, env, cameraBounds, cameraClear,
// mats, STATION, win (the porthole), setSun(q), sunDir, floaters, update(t, dt), dispose } and `silverMatcap`.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'
import { glowTexture } from './space.js'

const TAU = Math.PI * 2
export const STATION = { R: 3.3, cy: 1.65, z0: -17.8, z1: 6.7, bank: 2.05, rackD: 0.75, rackH: 2.2 }
export const PERIOD = 150 // seconds for one turn of the Sun (92 minutes in life)
const EARTH = { r: 600, drop: 652 }

/** A drawn matcap for polished silver: soft sky above, a dark band, a warm bounce below (a lit metal face
 *  only mirrors the room it stands in). */
export function silverMatcap() {
  return canvasTex(256, 256, (g, w) => {
    const grd = g.createRadialGradient(w * 0.38, w * 0.32, w * 0.02, w / 2, w / 2, w / 2)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.25, '#e4e8ee')
    grd.addColorStop(0.62, '#9aa3b2')
    grd.addColorStop(0.86, '#59606e')
    grd.addColorStop(1, '#2a2f3a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    const warm = g.createLinearGradient(0, w * 0.62, 0, w)
    warm.addColorStop(0, 'rgba(255,230,190,0)')
    warm.addColorStop(1, 'rgba(255,226,180,0.4)')
    g.fillStyle = warm
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2, 0, TAU)
    g.fill()
  })
}

const EARTH_VERT = /* glsl */ `
  varying vec3 vDir; varying vec3 vN; varying vec3 vView;
  void main() {
    vDir = normalize(position);
    vN = normalize(mat3(modelMatrix) * position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`

const EARTH_FRAG = /* glsl */ `
  uniform vec3 uSun; uniform float uTime;
  varying vec3 vDir; varying vec3 vN; varying vec3 vView;
  float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float a = 0.5; float s = 0.0;
    for (int i = 0; i < OCT; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
    return s;
  }
  void main() {
    vec3 d = normalize(vDir);
    vec3 n3 = normalize(vN);
    float n = fbm(d * 2.4 + vec3(3.0)) * 1.15;
    float land = smoothstep(0.55, 0.58, n);
    float lat = abs(d.y);
    vec3 ocean = mix(vec3(0.03, 0.15, 0.35), vec3(0.11, 0.39, 0.68), smoothstep(0.38, 0.55, n));
    float dry = fbm(d * 5.0 + 7.0);
    vec3 terrain = mix(vec3(0.24, 0.48, 0.22), vec3(0.65, 0.54, 0.32), smoothstep(0.5, 0.7, dry) * smoothstep(0.35, 0.8, 1.0 - lat));
    vec3 surf = mix(ocean, terrain, land);
    float ice = smoothstep(0.82, 0.9, lat + 0.07 * (n - 0.5));
    surf = mix(surf, vec3(0.82, 0.88, 0.95), ice);
    float cl = smoothstep(0.5, 0.78, fbm(d * 4.2 + vec3(uTime * 0.012, 0.0, uTime * 0.008)));
    float nl = dot(n3, uSun);
    float day = smoothstep(-0.1, 0.2, nl);
    float lum = max(nl, 0.0);
    vec3 col = surf * (0.045 + 1.15 * lum);
    col = mix(col, vec3(0.05 + lum * 1.05), cl * 0.82);
    float clusters = smoothstep(0.5, 0.68, fbm(d * 9.0 + 11.0));
    float dots = smoothstep(0.7, 0.86, vn(d * 210.0) * 0.6 + vn(d * 470.0) * 0.4);
    float city = land * (1.0 - ice) * clusters * dots * (1.0 - day) * (1.0 - cl * 0.75);
    col += vec3(1.0, 0.72, 0.38) * city * 1.7;
    float fr = pow(clamp(1.0 - max(dot(n3, normalize(vView)), 0.0), 0.0, 1.0), 3.0);
    col += vec3(0.25, 0.5, 1.0) * fr * (0.08 + 0.9 * day) * 0.9;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

export function stationStage({ light = false, pixelRatio = 1, gaps = { left: [], right: [] } } = {}) {
  const { R, cy, z0, z1, bank, rackD, rackH } = STATION
  const group = new THREE.Group()
  const textures = []
  const disposables = []
  const tex = t => (textures.push(t), t)
  const len = z1 - z0
  const zMid = (z0 + z1) / 2
  const rnd = random(1998)

  // ---- materials, shared (one shader program each) ----
  const mats = {
    white: new THREE.MeshStandardMaterial({ color: '#d9dde4', roughness: 0.55, metalness: 0.1 }),
    grey: new THREE.MeshStandardMaterial({ color: '#8d95a3', roughness: 0.5, metalness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f3a', roughness: 0.6, metalness: 0.3 }),
    navy: new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.35, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.6 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#e9b933', roughness: 0.45, metalness: 0.2 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b6bdc9', roughness: 0.3, metalness: 0.8 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#25272e', roughness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c99a48', roughness: 0.35, metalness: 0.8 }),
  }
  const matcap = tex(silverMatcap())
  mats.silver = new THREE.MeshMatcapMaterial({ matcap, color: '#f2f3f6' })

  // ---- the shell: panels with seams and rivets, a round hole for the porthole ----
  const shellTex = tex(
    canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#d3d8e0'
      g.fillRect(0, 0, w, w)
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(${rnd() < 0.5 ? '120,128,140' : '255,255,255'},${0.03 + rnd() * 0.05})`
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 5, 1 + rnd() * 2)
      }
      g.strokeStyle = 'rgba(90,100,118,0.65)'
      g.lineWidth = 3
      g.strokeRect(1.5, 1.5, w - 3, w - 3)
      g.strokeStyle = 'rgba(90,100,118,0.35)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(w / 2, 0)
      g.lineTo(w / 2, w)
      g.stroke()
      g.fillStyle = 'rgba(90,100,118,0.7)'
      for (let i = 0; i < 16; i++) {
        const p = 12 + (i / 15) * (w - 24)
        for (const [x, y] of [[p, 9], [p, w - 9], [9, p], [w - 9, p]]) {
          g.beginPath()
          g.arc(x, y, 2.2, 0, TAU)
          g.fill()
        }
      }
    }, { repeat: true }),
  )
  shellTex.repeat.set(16, Math.round(len / 1.6))
  const win = { x: 0, y: 2.15, z: -2.2, r: 0.62 }
  win.x = -Math.sqrt(R * R - (win.y - cy) ** 2)
  const winU = { value: new THREE.Vector4(win.x, win.y, win.z, win.r) }
  const shellMat = new THREE.MeshStandardMaterial({ map: shellTex, roughness: 0.6, metalness: 0.15, side: THREE.BackSide })
  shellMat.onBeforeCompile = sh => {
    sh.uniforms.uWin = winU
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWp = (modelMatrix * vec4(position, 1.0)).xyz;')
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform vec4 uWin;').replace('void main() {', 'void main() {\n  if (distance(vWp, uWin.xyz) < uWin.w) discard;')
  }
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(R, R, len, 56, 1, true), shellMat)
  shell.rotation.x = Math.PI / 2
  shell.position.set(0, cy, zMid)
  group.add(shell)

  // end walls: a disc with a round hatch each
  const hatchTex = tex(
    canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#cfd4dc'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = 'rgba(90,100,118,0.8)'
      g.lineWidth = 5
      for (const r of [0.44, 0.38]) {
        g.beginPath()
        g.arc(w / 2, w / 2, w * r, 0, TAU)
        g.stroke()
      }
      g.fillStyle = 'rgba(90,100,118,0.8)'
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU
        g.beginPath()
        g.arc(w / 2 + Math.cos(a) * w * 0.41, w / 2 + Math.sin(a) * w * 0.41, 4, 0, TAU)
        g.fill()
      }
    }),
  )
  for (const [z, face] of [[z1, -1], [z0, 1]]) {
    const cap = new THREE.Mesh(new THREE.CircleGeometry(R, 56), new THREE.MeshStandardMaterial({ map: hatchTex, roughness: 0.6, metalness: 0.15 }))
    cap.position.set(0, cy, z)
    cap.rotation.y = face > 0 ? 0 : Math.PI
    group.add(cap)
  }
  // the far hatch's wheel (the module beyond), a closed round door
  {
    const wheel = new THREE.Group()
    wheel.position.set(0, cy, z0 + 0.12)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 10, 40), mats.grey)
    wheel.add(rim)
    for (let i = 0; i < 3; i++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.08), mats.yellow)
      sp.rotation.z = (i * Math.PI) / 3
      wheel.add(sp)
    }
    wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 18), mats.steel).rotateX(Math.PI / 2))
    group.add(wheel)
  }

  // ---- the floor deck, with two velcro strips ----
  const floorTex = tex(
    canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#5a6171'
      g.fillRect(0, 0, w, w)
      for (let i = 0; i < 700; i++) {
        g.fillStyle = `rgba(${rnd() < 0.5 ? '30,34,44' : '150,158,172'},${0.05 + rnd() * 0.08})`
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 4, 1 + rnd() * 2)
      }
      g.strokeStyle = 'rgba(30,34,44,0.7)'
      g.lineWidth = 3
      g.strokeRect(1.5, 1.5, w - 3, w - 3)
    }, { repeat: true }),
  )
  floorTex.repeat.set(6, Math.round(len))
  const floorW = 5.8
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorW, len), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.7, metalness: 0.2 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, zMid)
  group.add(floor)
  const velcro = new THREE.MeshStandardMaterial({ color: '#23262e', roughness: 1 })
  for (const x of [-0.75, 0.75]) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.24, len - 0.6), velcro)
    strip.rotation.x = -Math.PI / 2
    strip.position.set(x, 0.004, zMid)
    group.add(strip)
  }

  // ---- racks: a bank down each wall, one bay a metre ----
  const rackTexs = [0, 1, 2, 3].map(v =>
    tex(
      canvasTex(256, 640, (g, w, h) => {
        const r2 = random(40 + v * 7)
        g.fillStyle = v % 2 ? '#dfe2e8' : '#d3d8e0'
        g.fillRect(0, 0, w, h)
        g.strokeStyle = 'rgba(80,90,108,0.7)'
        g.lineWidth = 4
        g.strokeRect(2, 2, w - 4, h - 4)
        let y = 14
        while (y < h - 60) {
          const kind = Math.floor(r2() * 4)
          const bh = 50 + Math.floor(r2() * 90)
          g.fillStyle = 'rgba(70,80,98,0.25)'
          g.fillRect(12, y, w - 24, bh)
          g.strokeStyle = 'rgba(80,90,108,0.7)'
          g.lineWidth = 2
          g.strokeRect(12, y, w - 24, bh)
          if (kind === 0) {
            g.fillStyle = '#0c1226'
            g.fillRect(26, y + 8, w - 52, bh - 16)
            g.strokeStyle = 'rgba(110,255,170,0.7)'
            g.lineWidth = 2
            for (let i = 0; i < 5; i++) {
              g.beginPath()
              g.moveTo(34, y + 16 + i * ((bh - 32) / 4))
              g.lineTo(34 + r2() * (w - 80), y + 16 + i * ((bh - 32) / 4))
              g.stroke()
            }
          } else if (kind === 1) {
            for (let i = 0; i < 6; i++) {
              g.fillStyle = r2() < 0.3 ? '#e04a3a' : r2() < 0.5 ? '#f2c542' : '#58627a'
              g.beginPath()
              g.arc(34 + (i % 3) * 70, y + 18 + Math.floor(i / 3) * 28, 8, 0, TAU)
              g.fill()
            }
          } else if (kind === 2) {
            g.fillStyle = '#23262e'
            g.fillRect(26, y + 10, w - 52, bh - 20)
          } else {
            g.fillStyle = '#e9b933'
            g.fillRect(20, y + bh - 16, w - 40, 8)
            g.fillStyle = '#58627a'
            for (let i = 0; i < 4; i++) g.fillRect(26 + i * 50, y + 10, 36, 14)
          }
          y += bh + 12
        }
      }),
    ),
  )
  const rackMats = rackTexs.map(t => new THREE.MeshStandardMaterial({ map: t, roughness: 0.55, metalness: 0.15 }))
  const rackBox = new THREE.BoxGeometry(0.94, rackH, rackD)
  const inGap = (z, list) => list.some(([a, b]) => z + 0.5 > a && z - 0.5 < b)
  const solids = []
  for (const side of [-1, 1]) {
    const list = side < 0 ? gaps.left : gaps.right
    let run = null
    const flush = () => {
      if (run) solids.push(box(side * (bank + rackD / 2), (run.a + run.b) / 2, rackD, run.b - run.a))
      run = null
    }
    for (let z = z0 + 0.5; z <= z1 - 0.4; z += 1) {
      if (inGap(z, list)) {
        flush()
        continue
      }
      const m = rackMats[Math.floor(rnd() * 4)]
      // the material list: +x, -x, +y, -y, +z, -z faces; the face toward the walkway carries the front
      const faces = [mats.white, mats.white, mats.white, mats.white, mats.white, mats.white]
      faces[side < 0 ? 0 : 1] = m
      const bay = new THREE.Mesh(rackBox, faces)
      bay.position.set(side * (bank + rackD / 2), rackH / 2, z)
      group.add(bay)
      if (!run) run = { a: z - 0.5, b: z + 0.5 }
      else run.b = z + 0.5
    }
    flush()
    // a yellow handrail along the racks, and uprights every four metres
    // (not across a gap: the scene's machine stands there)
    const free = []
    let a = z0 + 0.5
    for (const [ga, gb] of [...list].sort((p, q) => p[0] - q[0])) {
      if (ga - 0.3 > a) free.push([a, ga - 0.3])
      a = Math.max(a, gb + 0.3)
    }
    if (z1 - 0.5 > a) free.push([a, z1 - 0.5])
    for (const [fa, fb] of free) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, fb - fa, 8), mats.yellow)
      rail.rotation.x = Math.PI / 2
      rail.position.set(side * (bank - 0.12), 1.15, (fa + fb) / 2)
      group.add(rail)
      for (const z of [fa + 0.1, fb - 0.1]) {
        const up = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), mats.yellow)
        up.position.set(side * (bank - 0.06), 1.15, z)
        group.add(up)
      }
    }
  }

  // ---- ceiling: light strips and cable bundles ----
  const stripMat = new THREE.MeshStandardMaterial({ color: '#f4f8ff', emissive: '#e8f0ff', emissiveIntensity: 1.5, roughness: 0.4 })
  const stripGeo = new THREE.BoxGeometry(0.16, 0.05, 2.2)
  const cableMats = ['#2a2f3a', '#3d5a8c', '#a8342a', '#2f6f45'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }))
  for (const a of [-0.55, 0.55]) {
    // along the shell at an angle a from the top
    const px = Math.sin(a) * (R - 0.12)
    const py = cy + Math.cos(a) * (R - 0.12)
    for (let z = z0 + 2; z < z1 - 1; z += 3.2) {
      const s = new THREE.Mesh(stripGeo, stripMat)
      s.position.set(px, py, z)
      s.rotation.z = -a
      group.add(s)
    }
  }
  for (const [a, ci, r] of [[-1.15, 0, 0.07], [-1.05, 1, 0.05], [-1.25, 2, 0.04], [1.15, 0, 0.07], [1.05, 3, 0.05], [1.25, 1, 0.04], [0, 0, 0.06]]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len - 0.6, 8), cableMats[ci])
    c.rotation.x = Math.PI / 2
    c.position.set(Math.sin(a) * (R - 0.14), cy + Math.cos(a) * (R - 0.14), zMid)
    group.add(c)
  }
  // hand loops on the racks' tops, velcro patches on a few rack faces
  const patchGeo = new THREE.PlaneGeometry(0.22, 0.16)
  for (let i = 0; i < 14; i++) {
    const side = i % 2 ? 1 : -1
    const z = z0 + 1 + rnd() * (len - 2)
    if (inGap(z, side < 0 ? gaps.left : gaps.right)) continue
    const p = new THREE.Mesh(patchGeo, velcro)
    p.position.set(side * (bank - 0.004), 0.5 + rnd() * 1.5, z)
    p.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2
    group.add(p)
  }

  // ---- the porthole: a bezel, a faint pane; the Earth, the sky and the Sun outside ----
  const winG = new THREE.Group()
  winG.position.set(win.x, win.y, win.z)
  winG.lookAt(0, cy, win.z)
  group.add(winG)
  winG.add(new THREE.Mesh(new THREE.TorusGeometry(win.r + 0.04, 0.09, 12, 48), mats.grey))
  const bolts = new THREE.InstancedMesh(new THREE.SphereGeometry(0.04, 8, 6), mats.steel, 12)
  {
    const o = new THREE.Object3D()
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU
      o.position.set(Math.cos(a) * (win.r + 0.17), Math.sin(a) * (win.r + 0.17), 0.02)
      o.updateMatrix()
      bolts.setMatrixAt(i, o.matrix)
    }
  }
  winG.add(bolts)
  const pane = new THREE.Mesh(new THREE.CircleGeometry(win.r + 0.02, 40), new THREE.MeshBasicMaterial({ color: '#9fb8e0', transparent: true, opacity: 0.05, depthWrite: false }))
  pane.position.z = -0.01
  winG.add(pane)

  const outside = new THREE.Group()
  group.add(outside)
  const sky = nightSky({ radius: 1500, stars: light ? 900 : 2200, top: '#02030b', mid: '#04071a', horizon: '#060a22', pixelRatio })
  outside.add(sky)
  const N = new THREE.Vector3(-0.72, -0.69, -0.05).normalize() // straight down, as the window sees it
  const W = new THREE.Vector3(0, 0, 1).cross(N).negate().normalize() // along the Sun's turn, toward the window's side
  const sunDir = new THREE.Vector3(0, 1, 0)
  const uniforms = { uSun: { value: sunDir }, uTime: { value: 0 } }
  const earthMat = new THREE.ShaderMaterial({ uniforms, defines: { OCT: light ? 3 : 4 }, vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH.r, light ? 80 : 160, light ? 40 : 80), earthMat)
  earth.position.copy(N).multiplyScalar(EARTH.drop).add(new THREE.Vector3(0, cy, win.z))
  earth.rotation.set(0.5, 0.9, 0.35)
  earth.frustumCulled = false
  outside.add(earth)
  const glow = tex(glowTexture(128))
  const sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#fff2d6').multiplyScalar(3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  sunDisc.scale.setScalar(90)
  const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffd9a0', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  sunHalo.scale.setScalar(480)
  sunDisc.renderOrder = sunHalo.renderOrder = 5
  outside.add(sunDisc, sunHalo)
  // a solar array of the station, seen edge-on from the window: gold cells in a grid
  const arrayTex = tex(
    canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#7a5418'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#d8a63a'
      g.lineWidth = 2
      for (let i = 0; i <= 16; i++) {
        g.beginPath()
        g.moveTo((i * w) / 16, 0)
        g.lineTo((i * w) / 16, h)
        g.stroke()
      }
      for (let j = 0; j <= 8; j++) {
        g.beginPath()
        g.moveTo(0, (j * h) / 8)
        g.lineTo(w, (j * h) / 8)
        g.stroke()
      }
    }),
  )
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(18, 6), new THREE.MeshStandardMaterial({ map: arrayTex, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.4, emissive: '#3a2808', emissiveIntensity: 0.6 }))
  panel.position.set(-9, 4.5, -10)
  panel.rotation.set(0.15, 1.1, 0.25)
  outside.add(panel)

  // the Sun's beam into the module: a spot at the porthole, as bright as the Sun is in the window
  const beam = new THREE.SpotLight('#fff0d8', 0, 16, 0.42, 0.7, 1.2)
  beam.position.set(win.x - 0.3, win.y, win.z)
  group.add(beam, beam.target)
  const winOut = new THREE.Vector3(win.x, win.y - cy, 0).normalize() // from the axis toward the window

  function setSun(q) {
    sunDir.copy(N).multiplyScalar(-Math.cos(q)).addScaledVector(W, Math.sin(q)).normalize()
    sunDisc.position.copy(sunDir).multiplyScalar(1250).add(new THREE.Vector3(0, cy, win.z))
    sunHalo.position.copy(sunDisc.position)
    // hidden behind the Earth while within the limb's 67 degrees of straight down
    const vis = THREE.MathUtils.smoothstep(sunDir.dot(N), 0.46, 0.3)
    sunDisc.material.opacity = vis
    sunHalo.material.opacity = 0.35 * vis
    const toward = THREE.MathUtils.smoothstep(sunDir.dot(winOut), 0.25, 0.75)
    beam.intensity = 60 * vis * toward
    beam.target.position.set(win.x, win.y, win.z).addScaledVector(sunDir, -6)
  }
  let q = 2.0
  setSun(q)

  // ---- light inside ----
  group.add(new THREE.HemisphereLight('#e6efff', '#6b7585', 1.0))
  const lights = []
  for (const z of light ? [-8] : [1, -6, -13]) {
    const l = new THREE.PointLight('#f4f8ff', 9, 12, 1.5)
    l.position.set(0, cy + 1.4, z)
    group.add(l)
    lights.push(l)
  }

  // ---- floating things: water drops and a pen ----
  const floaters = new THREE.Group()
  group.add(floaters)
  const dropMat = new THREE.MeshStandardMaterial({ color: '#bfe4ff', roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.42, depthWrite: false })
  const drops = []
  for (let i = 0; i < (light ? 5 : 10); i++) {
    const r = 0.05 + rnd() * 0.09
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), dropMat)
    const home = new THREE.Vector3((rnd() - 0.5) * 3.2, 1.0 + rnd() * 2.4, z0 + 2 + rnd() * (len - 4))
    m.position.copy(home)
    floaters.add(m)
    drops.push({ m, home, ph: rnd() * 20, sp: 0.2 + rnd() * 0.3 })
  }
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), new THREE.MeshStandardMaterial({ color: '#2a52be', roughness: 0.4 }))
  pen.position.set(0.9, 2.5, -4.2)
  floaters.add(pen)

  const camTo = new THREE.Vector3()
  return {
    group,
    solids,
    STATION,
    win,
    mats,
    sunDir,
    floaters,
    glowTexture: glow,
    env: {
      background: new THREE.Color('#05060e'),
      exposure: 1.0,
      envIntensity: 0.5,
      bloom: { strength: 0.4, radius: 0.5, threshold: 0.88 },
      fov: 62,
      far: 4000,
    },
    cameraBounds: { minX: -1.95, maxX: 1.95, minY: 0.35, maxY: 3.4, minZ: z0 + 0.6, maxZ: 5.2 },
    /** The share of the way from the player to the camera that stays inside the module. */
    cameraClear(from, to) {
      const n = 10
      for (let i = 1; i <= n; i++) {
        camTo.lerpVectors(from, to, i / n)
        if (Math.hypot(camTo.x, camTo.y - cy) > R - 0.5) return (i - 1) / n
      }
      return 1
    },
    setSun,
    get phase() {
      return q
    },
    /** `auto`: the Sun goes round by itself (false for a probe holding the light still). */
    auto: true,
    setPhase(v) {
      q = v
      setSun(q)
    },
    update(t, dt = 0.016) {
      if (this.auto) {
        q = (q - (dt * TAU) / PERIOD + TAU) % TAU
        setSun(q)
      }
      uniforms.uTime.value = t
      earth.rotation.y += dt * 0.02
      sky.userData.update?.(t)
      for (const d of drops) {
        d.m.position.set(d.home.x + Math.sin(t * d.sp + d.ph) * 0.25, d.home.y + Math.sin(t * d.sp * 0.7 + d.ph * 1.3) * 0.2, d.home.z + Math.cos(t * d.sp * 0.8 + d.ph) * 0.3)
      }
      pen.rotation.set(t * 0.2, t * 0.13, 0.4)
      pen.position.y = 2.5 + Math.sin(t * 0.3) * 0.08
    },
    dispose() {
      textures.forEach(tx => tx.dispose())
      earth.geometry.dispose()
      earthMat.dispose()
      for (const d of disposables) d.dispose?.()
    },
  }
}

