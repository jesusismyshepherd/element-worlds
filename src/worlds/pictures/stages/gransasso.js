// A stage for picture rooms (docs/knowledge/picture-rooms.md): Hall A of the Laboratori Nazionali del Gran
// Sasso, deep under the Italian mountain. A huge barrel-vaulted cavern lined with grey concrete, lit clean
// and bright by long LED strips along the vault (no bare rock face anywhere: silver's mine and radon's cave
// are the rocky places). Painted steel stairs and a platform on one side, pipes and cable trays along the
// walls, a few bicycles by the entrance, the mouth of the road tunnel it is reached by, and at the far end
// the big cylindrical water tank with a white clean room on top (GERDA's, and now LEGEND-200's), scaled down
// to fit (the real tank is 10 m across).
// Walking inside the rectangle x0..x1, z0..z1. The scene adds its own benches and machines; `mats` are shared
// plain materials for them (one shader program each), `shine` is an equirectangular picture of this hall for
// metal to reflect, `glow` a soft round dot, `onFloor(x, z, w, d)` lays a yellow safety rectangle.
// Exports `hallStage({ light, x0, x1, z0, z1, tank })` -> { group, mats, shine, glow, tank: { x, z, r, h },
// bike(), solids, env, cameraBounds, update(t), dispose }.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { circle, box } from '../../../engine/collide.js'
import { glowTexture } from './space.js'

const TAU = Math.PI * 2
const SPRING = 4.5 // where the vault starts to curve (m)
const RISE = 6.3 // how much higher it rises at the crown

/** Sprayed concrete with shuttering joints: mid-grey, speckled, four metres to the tile. */
function concreteTex(light) {
  const px = light ? 256 : 512
  const rnd = random(76)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = '#85888b'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 90; i++) {
      const r = 14 + rnd() * 60
      const x = rnd() * w
      const y = rnd() * h
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      const dark = rnd() < 0.5
      grd.addColorStop(0, dark ? 'rgba(60,62,66,0.16)' : 'rgba(190,192,194,0.14)')
      grd.addColorStop(1, 'rgba(120,122,126,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
    for (let i = 0; i < px * 5; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(50,52,56,0.28)' : 'rgba(200,202,206,0.25)'
      g.fillRect(rnd() * w, rnd() * h, 1.2 + rnd() * 1.8, 1.2 + rnd() * 1.8)
    }
    // shuttering joints: a panel every 2 m (half a tile), a dark seam and a bright lip
    g.fillStyle = 'rgba(40,42,46,0.55)'
    g.fillRect(0, 0, 3, h)
    g.fillRect(w / 2, 0, 3, h)
    g.fillRect(0, 0, w, 3)
    g.fillRect(0, h / 2, w, 3)
    g.fillStyle = 'rgba(210,212,216,0.22)'
    g.fillRect(3, 0, 2, h)
    g.fillRect(w / 2 + 3, 0, 2, h)
    // tie holes in the panels' corners
    g.fillStyle = 'rgba(40,42,46,0.7)'
    for (const [x, y] of [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
      g.beginPath()
      g.arc(x * w, y * h, 4, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
}

/** The painted floor: dark grey-green, scuffed, with a seam every two metres. */
function floorTex(light) {
  const px = light ? 256 : 512
  const rnd = random(21)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = '#4e5857'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 70; i++) {
      const r = 20 + rnd() * 70
      const x = rnd() * w
      const y = rnd() * h
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, rnd() < 0.5 ? 'rgba(30,36,36,0.2)' : 'rgba(150,160,158,0.14)')
      grd.addColorStop(1, 'rgba(80,90,90,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
    for (let i = 0; i < px * 4; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(20,24,24,0.3)' : 'rgba(170,180,176,0.25)'
      g.fillRect(rnd() * w, rnd() * h, 1.2 + rnd() * 1.6, 1.2 + rnd() * 1.6)
    }
    g.fillStyle = 'rgba(20,24,24,0.6)'
    g.fillRect(0, 0, 3, h)
    g.fillRect(0, 0, w, 3)
  }, { repeat: true })
}

/** What metal reflects in this hall: bright LED strips overhead, pale concrete, a dark floor. */
function shineTex() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#a8aeb6')
    grd.addColorStop(0.42, '#767c82')
    grd.addColorStop(0.55, '#4c4e50')
    grd.addColorStop(1, '#26282a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#f4f8ff'
    for (let i = 0; i < 5; i++) g.fillRect(i * (w / 5) + 6, 8, w / 8, 5)
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/** The road tunnel's mouth: a dark arch with orange lamps receding, drawn on a canvas. */
function tunnelTex() {
  const rnd = random(5)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#050608'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 9; i++) {
      const k = 1 - i / 9
      const y = h * (0.28 + 0.34 * (1 - k) * 0.9)
      g.fillStyle = `rgba(255,170,70,${0.25 + 0.6 * (1 - k) * 0.7})`
      const s = 2 + (1 - k) * 0
      g.fillRect(w * 0.5 - 40 * k - s / 2, y, s + 1.5, 3 + 4 * k)
      g.fillRect(w * 0.5 + 40 * k - s / 2, y, s + 1.5, 3 + 4 * k)
      g.fillStyle = `rgba(255,150,60,${0.1 + 0.2 * k})`
      g.fillRect(w * 0.5 - 22 * k, y + 8 + 14 * k, 44 * k, 2)
    }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = 'rgba(255,200,120,0.05)'
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
    }
  })
}

/** A flat piece of wall from (a0, y0) to (a1, y1) in its own plane, UVs in metres. */
function wallPiece(a0, a1, y0, y1) {
  const geo = new THREE.PlaneGeometry(a1 - a0, y1 - y0)
  const uv = geo.attributes.uv
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) + (a0 + a1) / 2, pos.getY(i) + (y0 + y1) / 2)
  geo.translate((a0 + a1) / 2, (y0 + y1) / 2, 0)
  return geo
}

export function hallStage({ light = false, x0 = -9.5, x1 = 9.5, z0 = -16, z1 = 7.6, tank = { x: 0, z: -12.4, r: 3.6, h: 6.0 } } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const fw = x1 - x0
  const fd = z1 - z0
  const halfW = fw / 2
  const cx = (x0 + x1) / 2
  const shine = shineTex()
  const glow = glowTexture(64)
  textures.push(shine, glow)
  const mats = {
    steel: new THREE.MeshStandardMaterial({ color: '#b3b9c0', roughness: 0.34, metalness: 0.85, envMap: shine, envMapIntensity: 0.9 }),
    dark: new THREE.MeshStandardMaterial({ color: '#23262a', roughness: 0.55, metalness: 0.25 }),
    black: new THREE.MeshStandardMaterial({ color: '#131416', roughness: 0.4, metalness: 0.1 }),
    white: new THREE.MeshStandardMaterial({ color: '#d4d8dc', roughness: 0.5, metalness: 0.05 }),
    blue: new THREE.MeshStandardMaterial({ color: '#2f5aa0', roughness: 0.5, metalness: 0.3 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#d8a820', roughness: 0.55, metalness: 0.2 }),
    green: new THREE.MeshStandardMaterial({ color: '#3f7a52', roughness: 0.5, metalness: 0.25 }),
    copper: new THREE.MeshStandardMaterial({ color: '#c47a4a', roughness: 0.3, metalness: 0.9, envMap: shine, envMapIntensity: 1.0 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a14a', roughness: 0.3, metalness: 0.9, envMap: shine, envMapIntensity: 1.0 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: '#8a6a48', roughness: 0.75 }),
    panel: new THREE.MeshStandardMaterial({ color: '#c9ced4', roughness: 0.45, metalness: 0.1 }),
  }
  const mk = (geo, mat, x, y, z, parent = group) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    geos.push(geo)
    return m
  }

  // the floor and the concrete
  const ft = floorTex(light)
  ft.repeat.set(1 / 4, 1 / 4)
  const ct = concreteTex(light)
  ct.repeat.set(1 / 4, 1 / 4)
  textures.push(ft, ct)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  const fuv = floorGeo.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * fw, fuv.getY(i) * fd)
  const floor = mk(floorGeo, new THREE.MeshStandardMaterial({ map: ft, roughness: 0.6, metalness: 0.08 }), cx, 0, (z0 + z1) / 2)
  floor.rotation.x = -Math.PI / 2
  const concrete = new THREE.MeshStandardMaterial({ map: ct, roughness: 0.92, color: '#d6d8da' })
  const addWall = (geo, x, z, rotY) => {
    const m = new THREE.Mesh(geo, concrete)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
    geos.push(geo)
  }
  // side walls up to the spring of the vault (a wall turned by +90 degrees runs its x along -z)
  addWall(wallPiece(-z1, -z0, 0, SPRING), x0, 0, Math.PI / 2)
  addWall(wallPiece(z0, z1, 0, SPRING), x1, 0, -Math.PI / 2)
  // the end walls: a rectangle with the vault's half-ellipse on top
  const endShape = new THREE.Shape()
  endShape.moveTo(x0, 0)
  endShape.lineTo(x1, 0)
  endShape.lineTo(x1, SPRING)
  endShape.absellipse(cx, SPRING, halfW, RISE, 0, Math.PI, false)
  endShape.lineTo(x0, 0)
  const endGeo = new THREE.ShapeGeometry(endShape, 36)
  addWall(endGeo, 0, z0, 0)
  addWall(endGeo.clone(), 0, z1, Math.PI)
  // the vault: half a cylinder along z, squashed into an ellipse (open ended, seen from inside)
  const vaultGeo = new THREE.CylinderGeometry(halfW, halfW, fd, 56, 1, true, Math.PI / 2, Math.PI)
  vaultGeo.rotateX(Math.PI / 2)
  vaultGeo.scale(1, RISE / halfW, 1)
  const vuv = vaultGeo.attributes.uv
  for (let i = 0; i < vuv.count; i++) vuv.setXY(i, vuv.getX(i) * Math.PI * halfW * 1.0, vuv.getY(i) * fd)
  const vault = new THREE.Mesh(vaultGeo, new THREE.MeshStandardMaterial({ map: ct, roughness: 0.95, color: '#c4c6c8', side: THREE.BackSide }))
  vault.position.set(cx, SPRING, (z0 + z1) / 2)
  group.add(vault)
  geos.push(vaultGeo)

  // LED strips along the vault, five rows, and the light they give
  const ledMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#eaf2ff').multiplyScalar(0.95) })
  for (const a of [-1.15, -0.62, 0, 0.62, 1.15]) {
    const x = cx + Math.sin(a) * (halfW - 0.2)
    const y = SPRING + Math.cos(a) * (RISE - 0.15)
    const strip = mk(new THREE.BoxGeometry(0.16, 0.05, fd - 1), ledMat, x, y, (z0 + z1) / 2)
    strip.rotation.z = -a * 0.9
  }
  for (const z of [z0 + 4, (z0 + z1) / 2 - 1, z1 - 5]) {
    const pl = new THREE.PointLight('#e6eeff', light ? 36 : 44, 26, 1.5)
    pl.position.set(cx, SPRING + RISE - 1.6, z)
    group.add(pl)
  }
  group.add(new THREE.HemisphereLight('#dfe6ee', '#555a58', light ? 1.5 : 1.15))

  // pipes and cable trays along the west wall, a blue main and a yellow one, painted brackets every 3 m
  const pipe = (len, r, mat, x, y, z) => {
    const m = mk(new THREE.CylinderGeometry(r, r, len, 14), mat, x, y, z)
    m.rotation.x = Math.PI / 2
    return m
  }
  pipe(fd - 1, 0.16, mats.blue, x0 + 0.3, 3.5, (z0 + z1) / 2)
  pipe(fd - 1, 0.1, mats.yellow, x0 + 0.3, 3.1, (z0 + z1) / 2)
  pipe(fd - 1, 0.14, mats.steel, x0 + 0.3, 1.05, (z0 + z1) / 2)
  for (let z = z0 + 1.5; z < z1 - 1; z += 3) {
    mk(new THREE.BoxGeometry(0.1, 2.6, 0.1), mats.dark, x0 + 0.12, 2.3, z)
  }
  for (const [x, y] of [[x1 - 0.5, 3.9], [x1 - 0.5, 4.15]]) {
    mk(new THREE.BoxGeometry(0.5, 0.05, fd - 1), mats.dark, x, y, (z0 + z1) / 2)
    for (let z = z0 + 1.2; z < z1 - 1; z += 0.5) mk(new THREE.BoxGeometry(0.5, 0.02, 0.03), mats.steel, x, y + 0.03, z)
  }

  // a yellow-and-black kerb band along the foot of both walls
  const band = new THREE.MeshStandardMaterial({ color: '#c9a21c', roughness: 0.7 })
  mk(new THREE.BoxGeometry(0.06, 0.18, fd), band, x0 + 0.03, 0.09, (z0 + z1) / 2)
  mk(new THREE.BoxGeometry(0.06, 0.18, fd), band, x1 - 0.03, 0.09, (z0 + z1) / 2)

  // the mouth of the road tunnel in the west end wall, beside the way back
  const tun = tunnelTex()
  textures.push(tun)
  const tunnel = new THREE.Group()
  const tShape = new THREE.Shape()
  tShape.moveTo(-1.9, 0)
  tShape.lineTo(1.9, 0)
  tShape.lineTo(1.9, 2.6)
  tShape.absellipse(0, 2.6, 1.9, 1.5, 0, Math.PI, false)
  tShape.lineTo(-1.9, 0)
  const tGeo = new THREE.ShapeGeometry(tShape, 24)
  const tuv = tGeo.attributes.uv
  const tpos = tGeo.attributes.position
  for (let i = 0; i < tuv.count; i++) tuv.setXY(i, (tpos.getX(i) + 1.9) / 3.8, tpos.getY(i) / 4.1)
  tunnel.add(new THREE.Mesh(tGeo, new THREE.MeshBasicMaterial({ map: tun })))
  geos.push(tGeo)
  // a steel frame round it and a hazard stripe above
  const frameGeo = new THREE.ExtrudeGeometry(tShape, { depth: 0.1, bevelEnabled: false, curveSegments: 24 })
  geos.push(frameGeo)
  const framePos = new THREE.Mesh(frameGeo, mats.dark)
  framePos.scale.set(1.06, 1.04, 1)
  framePos.position.z = -0.12
  tunnel.add(framePos)
  tunnel.position.set(-5.8, 0, z1 - 0.03)
  tunnel.rotation.y = Math.PI
  group.add(tunnel)
  const tunnelSign = mk(new THREE.BoxGeometry(2.4, 0.3, 0.04), mats.yellow, -5.8, 4.85, z1 - 0.06)
  tunnelSign.rotation.y = Math.PI

  // stairs and a platform on the east side, behind the right-hand station
  const stairs = new THREE.Group()
  const runX = x1 - 1.0
  const nSteps = 14
  const stepRise = 3.0 / nSteps
  const z0s = -9.2
  const stepRun = 0.28
  for (let i = 0; i < nSteps; i++) {
    mk(new THREE.BoxGeometry(1.1, 0.04, stepRun), mats.steel, runX, stepRise * (i + 1), z0s - stepRun * i, stairs)
    mk(new THREE.BoxGeometry(1.1, stepRise, 0.02), mats.yellow, runX, stepRise * (i + 0.5), z0s - stepRun * i + stepRun / 2, stairs)
  }
  for (const sx of [-0.57, 0.57]) {
    const rail = mk(new THREE.CylinderGeometry(0.025, 0.025, 4.2, 8), mats.yellow, runX + sx, 2.0, z0s - 1.9, stairs)
    rail.rotation.x = Math.PI / 2 - Math.atan2(3.0, stepRun * nSteps)
    rail.position.y += 0.55
  }
  group.add(stairs)
  const platZ0 = z0s - stepRun * nSteps - 0.1
  const platDepth = 2.6
  mk(new THREE.BoxGeometry(2.3, 0.08, platDepth), mats.steel, x1 - 1.2, 3.0, platZ0 - platDepth / 2 + 0.1)
  for (let i = 0; i < 6; i++) mk(new THREE.BoxGeometry(0.06, 0.95, 0.06), mats.yellow, x1 - 2.3, 3.5, platZ0 + 0.1 - i * (platDepth / 5))
  mk(new THREE.BoxGeometry(0.05, 0.05, platDepth), mats.yellow, x1 - 2.3, 3.95, platZ0 + 0.1 - platDepth / 2)
  mk(new THREE.BoxGeometry(0.05, 0.05, platDepth), mats.yellow, x1 - 2.3, 3.55, platZ0 + 0.1 - platDepth / 2)

  // the big water tank with its clean room on top, scaled down; a ladder up its side
  const tk = new THREE.Group()
  tk.position.set(tank.x, 0, tank.z)
  group.add(tk)
  mk(new THREE.CylinderGeometry(tank.r, tank.r, tank.h, 56), new THREE.MeshStandardMaterial({ color: '#9aa2ac', roughness: 0.4, metalness: 0.7, envMap: shine, envMapIntensity: 0.9 }), 0, tank.h / 2, 0, tk)
  for (let i = 1; i < 4; i++) mk(new THREE.TorusGeometry(tank.r + 0.02, 0.05, 6, 56), mats.dark, 0, (tank.h / 4) * i, 0, tk).rotation.x = Math.PI / 2
  mk(new THREE.CylinderGeometry(tank.r + 0.2, tank.r + 0.2, 0.2, 56), mats.dark, 0, 0.1, 0, tk)
  const cleanW = 4.6
  const cleanD = 3.0
  const cleanH = 2.7
  const room = mk(new RoundedBoxGeometry(cleanW, cleanH, cleanD, 3, 0.1), mats.panel, 0, tank.h + cleanH / 2 + 0.1, 0.2, tk)
  room.name = 'clean-room'
  mk(new THREE.BoxGeometry(cleanW + 0.3, 0.12, cleanD + 0.3), mats.dark, 0, tank.h + 0.05, 0.2, tk)
  const winMat = new THREE.MeshStandardMaterial({ color: '#16202c', roughness: 0.15, metalness: 0.6, envMap: shine, envMapIntensity: 1.1 })
  mk(new THREE.BoxGeometry(2.4, 1.1, 0.05), winMat, -0.5, tank.h + 1.5, 0.2 + cleanD / 2 + 0.02, tk)
  mk(new THREE.BoxGeometry(2.55, 0.06, 0.06), mats.steel, -0.5, tank.h + 2.07, 0.2 + cleanD / 2 + 0.04, tk)
  mk(new THREE.BoxGeometry(2.55, 0.06, 0.06), mats.steel, -0.5, tank.h + 0.93, 0.2 + cleanD / 2 + 0.04, tk)
  const lamp = mk(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: '#5ab0ff' }), 1.7, tank.h + 2.1, 0.2 + cleanD / 2 + 0.05, tk)
  lamp.name = 'blue-lamp'
  // the ladder with its cage
  for (const sx of [-0.28, 0.28]) mk(new THREE.BoxGeometry(0.05, tank.h + 0.2, 0.05), mats.yellow, 2.6 + sx, tank.h / 2, tank.r - 0.55, tk)
  for (let y = 0.4; y < tank.h; y += 0.4) mk(new THREE.BoxGeometry(0.56, 0.04, 0.04), mats.yellow, 2.6, y, tank.r - 0.55, tk)
  // a manhole by the foot of the tank
  mk(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 20), mats.dark, tank.x + 1.2, 0.03, tank.z + tank.r + 1.1)

  // bicycles by the entrance, leant on the west wall (they are how people get about the hall)
  const bike = (colour = '#c43a2a') => {
    const g = new THREE.Group()
    const frameMat = new THREE.MeshStandardMaterial({ color: colour, roughness: 0.4, metalness: 0.5 })
    const wheel = x => {
      const w = new THREE.Group()
      mk(new THREE.TorusGeometry(0.34, 0.02, 6, 28), mats.rubber, 0, 0, 0, w)
      mk(new THREE.TorusGeometry(0.31, 0.006, 4, 24), mats.steel, 0, 0, 0, w)
      mk(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8), mats.steel, 0, 0, 0, w).rotation.x = Math.PI / 2
      w.position.set(x, 0.36, 0)
      g.add(w)
    }
    wheel(-0.48)
    wheel(0.48)
    const bar = (a, b, r = 0.016, mat = frameMat) => {
      const va = new THREE.Vector3(...a)
      const vb = new THREE.Vector3(...b)
      const m = mk(new THREE.CylinderGeometry(r, r, va.distanceTo(vb), 6), mat, 0, 0, 0, g)
      m.position.copy(va).add(vb).multiplyScalar(0.5)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize())
    }
    bar([-0.48, 0.36, 0], [-0.1, 0.38, 0])
    bar([-0.1, 0.38, 0], [0.2, 0.66, 0])
    bar([-0.48, 0.36, 0], [-0.18, 0.7, 0])
    bar([-0.18, 0.7, 0], [0.2, 0.66, 0])
    bar([0.2, 0.66, 0], [0.48, 0.36, 0])
    bar([0.2, 0.66, 0], [0.24, 0.9, 0])
    bar([0.24, 0.9, 0], [0.18, 0.92, 0.22], 0.012, mats.dark)
    bar([0.24, 0.9, 0], [0.18, 0.92, -0.22], 0.012, mats.dark)
    mk(new RoundedBoxGeometry(0.22, 0.04, 0.1, 2, 0.015), mats.dark, -0.2, 0.74, 0, g)
    return g
  }
  for (const [x, z, y, c] of [[x0 + 0.5, z1 - 3.2, 0.2, '#c43a2a'], [x0 + 0.5, z1 - 2.2, 0.05, '#2f6fd0'], [x0 + 0.55, z1 - 1.2, -0.1, '#e0b020']]) {
    const b = bike(c)
    b.rotation.y = Math.PI / 2 + y
    b.rotation.z = -0.22
    b.position.set(x, 0, z)
    group.add(b)
  }

  /** A yellow safety rectangle painted on the floor (centre x, z; size w, d). */
  const lineMat = new THREE.MeshBasicMaterial({ color: '#b8941c' })
  const onFloor = (x, z, w, d, t = 0.07) => {
    for (const [lw, ld, lx, lz] of [[w, t, 0, -d / 2], [w, t, 0, d / 2], [t, d, -w / 2, 0], [t, d, w / 2, 0]]) {
      const m = mk(new THREE.PlaneGeometry(lw, ld), lineMat, x + lx, 0.012, z + lz)
      m.rotation.x = -Math.PI / 2
    }
  }

  // dust motes and the blue glow of the tank's lamp in the air
  const sol = [
    ...[
      box(x0 - 0.5, (z0 + z1) / 2, 1, fd + 2),
      box(x1 + 0.5, (z0 + z1) / 2, 1, fd + 2),
      box(cx, z0 - 0.5, fw + 2, 1),
      box(cx, z1 + 0.5, fw + 2, 1),
    ],
    circle(tank.x, tank.z, tank.r + 0.15),
    box(runX, z0s - (stepRun * nSteps) / 2, 1.2, stepRun * nSteps + 0.3),
  ]

  return {
    group,
    mats,
    shine,
    glow,
    tank,
    bike,
    onFloor,
    solids: sol,
    env: {
      background: new THREE.Color('#0b0d12'),
      fog: new THREE.Fog('#10131a', 28, 70),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.42, radius: 0.5, threshold: 0.92 },
      fov: 62,
      far: 120,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: SPRING + RISE - 1.2, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update() {},
    dispose() {
      textures.forEach(t => t.dispose())
      geos.forEach(g => g.dispose())
    },
  }
}
