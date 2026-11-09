// A stage for picture rooms (docs/knowledge/picture-rooms.md): a photographer's studio and, through a
// light-tight curtained doorway, a darkroom. The studio (the south half, z > zp) is a daylight room: a
// plank floor, pale plaster, a skylight, a painted backdrop's wall. The darkroom (the north half) is a
// brick room with a concrete floor, lit by two red safelights and, when `setWhite(k)` is raised, a bare
// white bulb; the doorway between them is 3.2 m wide with the curtain drawn aside. One light each in the
// two halves would wash into the other through an open door, which is right: a red glow in the studio's
// far end, daylight in the darkroom's doorway. Every big surface mid-toned (pale ones bloom to white).
// Walking inside x0..x1, zn..zs. The scene adds its tables and things; `mats` are shared plain materials,
// `white` is the white light's strength (0..1) for the scene's own shaders (paper under a safelight is
// pink, under the bulb white), `safe` the safelight colour.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box, roomWalls } from '../../../engine/collide.js'
import { makeText } from '../../../engine/text.js'

export const DARKROOM = { x0: -8, x1: 8, zs: 7.5, zp: -0.5, zn: -12, h: 3.6, doorHalf: 1.6, doorH: 2.7 }
const SAFE = '#ff2a18'

/** Planks 0.25 m wide, running along z, warm and worn; 2 m square. */
function plankTex(light) {
  const px = light ? 256 : 512
  const rnd = random(61)
  return canvasTex(px, px, (g, w) => {
    const n = 8
    const s = w / n
    for (let i = 0; i < n; i++) {
      const k = 0.85 + rnd() * 0.3
      g.fillStyle = `rgb(${Math.round(150 * k)},${Math.round(112 * k)},${Math.round(76 * k)})`
      g.fillRect(i * s, 0, s, w)
      g.fillStyle = 'rgba(60,38,22,0.5)'
      g.fillRect(i * s, 0, 2, w)
      for (let j = 0; j < 14; j++) {
        g.fillStyle = `rgba(70,45,26,${0.05 + rnd() * 0.12})`
        g.fillRect(i * s + rnd() * s, rnd() * w, 1 + rnd() * 2, 20 + rnd() * 120)
      }
      // a butt joint somewhere along each plank
      g.fillStyle = 'rgba(40,26,16,0.6)'
      g.fillRect(i * s, rnd() * w, s, 2)
    }
  }, { repeat: true })
}

/** Pale plaster, a little mottled, mid-toned. */
function plasterTex(tone) {
  const rnd = random(23)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = tone
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 700; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(50,50,40,0.035)' : 'rgba(230,230,210,0.035)'
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, 3 + rnd() * 14, 0, Math.PI * 2)
      g.fill()
    }
  }, { repeat: true })
}

/** Old brick in running bond, 8 to a row and 18 rows to the tile (1.8 m by 1.17 m of wall). */
function brickTex(light) {
  const w = light ? 256 : 512
  const h = Math.round(w * 0.65)
  const bw = w / 8
  const bh = h / 18
  const rnd = random(31)
  return canvasTex(w, h, (g) => {
    g.fillStyle = '#3a302c'
    g.fillRect(0, 0, w, h)
    const mortar = Math.max(2, w / 170)
    for (let r = 0; r < 18; r++) {
      const shift = r % 2 ? bw / 2 : 0
      for (let c = -1; c < 9; c++) {
        const k = 0.72 + rnd() * 0.5
        g.fillStyle = `rgb(${Math.round(150 * k)},${Math.round(82 * k)},${Math.round(62 * k)})`
        g.fillRect(c * bw + shift + mortar, r * bh + mortar, bw - mortar, bh - mortar)
        for (let s = 0; s < 6; s++) {
          g.fillStyle = `rgba(40,20,14,${0.08 + rnd() * 0.12})`
          g.fillRect(c * bw + shift + rnd() * bw, r * bh + rnd() * bh, 2 + rnd() * 3, 2 + rnd() * 3)
        }
      }
    }
  }, { repeat: true })
}

/** Poured concrete, dark and speckled, a wet patch or two. 2 m square. */
function concreteTex() {
  const rnd = random(5)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#5a5654'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 1600; i++) {
      const d = rnd()
      g.fillStyle = d < 0.4 ? 'rgba(30,28,28,0.35)' : d < 0.8 ? 'rgba(150,146,142,0.3)' : 'rgba(200,196,190,0.25)'
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
    g.strokeStyle = 'rgba(25,24,24,0.7)'
    g.lineWidth = 2
    g.strokeRect(0, 0, w, w)
  }, { repeat: true })
}

export function darkroomStage({ light = false, sign = 'DARKROOM' } = {}) {
  const { x0, x1, zs, zp, zn, h, doorHalf, doorH } = DARKROOM
  const group = new THREE.Group()
  const textures = []
  const keep = t => (textures.push(t), t)
  const fw = x1 - x0
  const uvMetres = (geo, su, sv) => {
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    return geo
  }
  const tile = (map, w, hh) => {
    map.repeat.set(1 / w, 1 / hh)
    return map
  }

  const mats = {
    plank: new THREE.MeshStandardMaterial({ map: tile(keep(plankTex(light)), 2, 2), roughness: 0.75 }),
    concrete: new THREE.MeshStandardMaterial({ map: tile(keep(concreteTex()), 2, 2), roughness: 0.8 }),
    plaster: new THREE.MeshStandardMaterial({ map: tile(keep(plasterTex('#a2a794')), 2, 2), roughness: 0.95 }),
    black: new THREE.MeshStandardMaterial({ map: tile(keep(plasterTex('#34302f')), 2, 2), roughness: 0.95 }),
    brick: new THREE.MeshStandardMaterial({ map: tile(keep(brickTex(light)), 1.8, 1.17), roughness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.7 }),
    darkwood: new THREE.MeshStandardMaterial({ color: '#3a2a20', roughness: 0.75 }),
    paint: new THREE.MeshStandardMaterial({ color: '#2d3a3a', roughness: 0.55 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8d949c', roughness: 0.4, metalness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.35, metalness: 0.7 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#1e1d1f', roughness: 0.9 }),
    velvet: new THREE.MeshStandardMaterial({ color: '#2a2230', roughness: 0.98 }),
  }
  const flat = (geo, mat, x, y, z, rx = 0, ry = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.set(rx, ry, 0)
    group.add(m)
    return m
  }
  const slab = (w, hh, d, mat, x, y, z) => flat(new THREE.BoxGeometry(w, hh, d), mat, x, y, z)

  // floors and ceilings: planks in the studio, concrete in the darkroom
  const sd = zs - zp
  const dd = zp - zn
  flat(uvMetres(new THREE.PlaneGeometry(fw, sd), fw, sd), mats.plank, 0, 0, (zs + zp) / 2, -Math.PI / 2)
  flat(uvMetres(new THREE.PlaneGeometry(fw, dd), fw, dd), mats.concrete, 0, 0, (zp + zn) / 2, -Math.PI / 2)
  const ceilMat = new THREE.MeshStandardMaterial({ color: '#6c675d', roughness: 0.95 })
  const darkCeil = new THREE.MeshStandardMaterial({ color: '#2e2926', roughness: 0.95 })
  flat(new THREE.PlaneGeometry(fw, sd), ceilMat, 0, h, (zs + zp) / 2, Math.PI / 2)
  flat(new THREE.PlaneGeometry(fw, dd), darkCeil, 0, h, (zp + zn) / 2, Math.PI / 2)

  // the skylight over the studio: a pane of pale daylight in a wooden frame
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(7, 4.4), new THREE.MeshBasicMaterial({ color: '#cfe0f4', toneMapped: false }))
  sky.rotation.x = Math.PI / 2
  sky.position.set(0, h - 0.02, 3.2)
  group.add(sky)
  for (const x of [-3.5, 0, 3.5]) slab(0.1, 0.1, 4.6, mats.darkwood, x, h - 0.05, 3.2)
  for (const z of [1.0, 3.2, 5.4]) slab(7.2, 0.1, 0.1, mats.darkwood, 0, h - 0.05, z)

  // walls: a studio of plaster with a skirting, a darkroom of brick; each wall one plane, its face inward
  const wall = (len, hh, mat, x, z, rotY, y = 0) => {
    const m = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(len, hh), len, hh), mat)
    m.position.set(x, y + hh / 2, z)
    m.rotation.y = rotY
    group.add(m)
    return m
  }
  wall(fw, h, mats.plaster, 0, zs, Math.PI) // the studio's south wall (behind the spawn)
  wall(sd, h, mats.plaster, x0, (zs + zp) / 2, Math.PI / 2)
  wall(sd, h, mats.plaster, x1, (zs + zp) / 2, -Math.PI / 2)
  wall(fw, h, mats.brick, 0, zn, 0)
  wall(dd, h, mats.brick, x0, (zp + zn) / 2, Math.PI / 2)
  wall(dd, h, mats.brick, x1, (zp + zn) / 2, -Math.PI / 2)
  // skirting boards in the studio
  slab(fw, 0.14, 0.05, mats.darkwood, 0, 0.07, zs - 0.03)
  slab(0.05, 0.14, sd, mats.darkwood, x0 + 0.03, 0.07, (zs + zp) / 2)
  slab(0.05, 0.14, sd, mats.darkwood, x1 - 0.03, 0.07, (zs + zp) / 2)

  // the partition: plaster on the studio's face, black on the darkroom's, a doorway with the curtain aside
  const T = 0.3
  const part = (xa, xb, y0, y1) => {
    const w = xb - xa
    const hh = y1 - y0
    const faces = [mats.black, mats.black, mats.black, mats.black, mats.plaster, mats.black]
    const g = new THREE.BoxGeometry(w, hh, T)
    const m = new THREE.Mesh(g, faces)
    m.position.set((xa + xb) / 2, (y0 + y1) / 2, zp)
    group.add(m)
  }
  part(x0, -doorHalf, 0, h)
  part(doorHalf, x1, 0, h)
  part(-doorHalf, doorHalf, doorH, h)
  // the door frame and a lit sign over it
  for (const s of [-1, 1]) slab(0.14, doorH, T + 0.06, mats.darkwood, s * (doorHalf + 0.07), doorH / 2, zp)
  slab(doorHalf * 2 + 0.28, 0.14, T + 0.06, mats.darkwood, 0, doorH + 0.07, zp)
  const signText = makeText(sign, { size: 0.2, color: '#ff6a4a', anchorY: 'middle', maxWidth: 3 })
  signText.position.set(0, doorH + 0.38, zp + T / 2 + 0.03)
  slab(1.9, 0.34, 0.04, mats.darkwood, 0, doorH + 0.38, zp + T / 2 + 0.01)
  const signText2 = signText.clone()
  signText2.rotation.y = Math.PI
  signText2.position.z = zp - T / 2 - 0.03
  slab(1.9, 0.34, 0.04, mats.darkwood, 0, doorH + 0.38, zp - T / 2 - 0.01)
  signText.sync()
  signText2.sync()
  group.add(signText, signText2)
  // the curtain, drawn aside: thick folds bunched at each side of the doorway, on a rail
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, doorHalf * 2 + 2.2, 8), mats.steel)
  rail.rotation.z = Math.PI / 2
  rail.position.set(0, doorH + 0.02, zp + T / 2 + 0.2)
  group.add(rail)
  for (const s of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const fold = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, doorH - 0.02, 10), mats.velvet)
      // folds bunch outward from the doorway's edge, along the wall
      fold.position.set(s * (doorHalf + 0.12 + i * 0.12), (doorH - 0.02) / 2, zp + T / 2 + 0.2 + (i % 2) * 0.07)
      group.add(fold)
    }
  }

  // red safelights, hanging; a bare white bulb in the middle (off until setWhite)
  const shadeGeo = new THREE.LatheGeometry([[0.03, 0.18], [0.08, 0.16], [0.13, 0.08], [0.24, 0], [0.25, -0.01]].map(([x, y]) => new THREE.Vector2(x, y)), 20)
  const shadeMat = new THREE.MeshStandardMaterial({ color: '#241a18', roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide })
  const safeMat = new THREE.MeshStandardMaterial({ color: SAFE, emissive: SAFE, emissiveIntensity: 2.2, roughness: 0.5 })
  const safeLights = []
  for (const [x, z] of [[-5.2, -9.4], [5.2, -9.4]]) {
    const drop = 1.1
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drop, 5), mats.rubber)
    cord.position.set(x, h - drop / 2, z)
    const shade = new THREE.Mesh(shadeGeo, shadeMat)
    shade.position.set(x, h - drop - 0.17, z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), safeMat)
    bulb.position.set(x, h - drop - 0.13, z)
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 20), safeMat)
    glow.position.set(x, h - drop - 0.19, z)
    group.add(cord, shade, bulb, glow)
    if (!(light && x > 0)) {
      const p = new THREE.PointLight(SAFE, 22, 11, 2)
      p.position.set(x, h - drop - 0.4, z)
      group.add(p)
      safeLights.push(p)
    }
  }
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffe8c0', emissiveIntensity: 0.05, roughness: 0.4 })
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), bulbMat)
  bulb.position.set(0, h - 0.7, -5.3)
  const bulbCord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.7, 5), mats.rubber)
  bulbCord.position.set(0, h - 0.35, -5.3)
  group.add(bulb, bulbCord)
  const whiteLight = new THREE.PointLight('#fff1dc', 0, 16, 2)
  whiteLight.position.set(0, h - 0.8, -5.3)
  group.add(whiteLight)

  // the studio's own light: warm daylight from the skylight, two soft points
  const dayLights = []
  for (const x of [-4.2, 4.4]) {
    if (light && x > 0) continue
    const p = new THREE.PointLight('#fff0de', 15, 12, 2)
    p.position.set(x, h - 0.5, 3.4)
    group.add(p)
    dayLights.push(p)
  }

  // dust in the studio's daylight and in the darkroom's red
  const dust = motes({ count: 160, radius: 5, y0: 0.4, y1: h - 0.5, color: '#fff0d8', size: 0.02, opacity: 0.22, speed: 0.04, light })
  dust.group.position.set(0, 0, 3.3)
  group.add(dust.group)
  const rdust = motes({ count: 160, radius: 6, y0: 0.4, y1: h - 0.5, color: '#ff8870', size: 0.02, opacity: 0.25, speed: 0.04, light })
  rdust.group.position.set(0, 0, -6.2)
  group.add(rdust.group)

  const solids = [...roomWalls(x0, x1, zn, zs), box((x0 - doorHalf) / 2, zp, -doorHalf - x0, T + 0.1), box((doorHalf + x1) / 2, zp, x1 - doorHalf, T + 0.1)]

  const stage = {
    group,
    mats,
    solids,
    safe: SAFE,
    white: 0,
    /** The white light's strength, 0 (off) to 1: the bulb, its light, and the safelights dimmed by it. */
    setWhite(k) {
      stage.white = k
      whiteLight.intensity = k * 80
      bulbMat.emissiveIntensity = 0.05 + k * 3
      for (const p of safeLights) p.intensity = 22 * (1 - 0.5 * k)
    },
    env: {
      background: new THREE.Color('#0b0809'),
      fog: new THREE.Fog('#120c0c', 18, 46),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: zn + 0.4, maxZ: zs - 1.0 },
    update(t) {
      dust.update(t)
      rdust.update(t)
    },
    dispose() {
      textures.forEach(t => t.dispose())
      signText.dispose?.()
      signText2.dispose?.()
    },
  }
  return stage
}
