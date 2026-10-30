// A stage for picture rooms (docs/knowledge/picture-rooms.md): a workshop indoors at night. Old brick
// walls, a floor of worn flagstones, a dark ceiling of boards on heavy beams, windows onto the night, a
// few dim enamel lamps hanging low. Dark enough that whatever glows in it (a furnace, a forge) is the
// light; every big surface mid-toned, since pale ones bloom to white. Walking inside the rectangle
// x0..x1, z0..z1. The scene adds its own fire and things; `mats` are shared plain materials for them, and
// `brick` (red) and `firebrick` (buff) are brick materials whose textures repeat per metre (geometry with
// UVs in metres, as ExtrudeGeometry's own, shows real-sized bricks).
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls } from '../../../engine/collide.js'

/** A height map as a tangent-space normal map. */
function normalMap(heights, w, h, strength) {
  return canvasTex(w, h, g => {
    const img = g.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = (heights[y * w + ((x - 1 + w) % w)] - heights[y * w + ((x + 1) % w)]) * strength
        const ny = (heights[((y + 1) % h) * w + x] - heights[((y - 1 + h) % h) * w + x]) * strength
        const l = Math.hypot(nx, ny, 1)
        const i = (y * w + x) * 4
        img.data[i] = (nx / l * 0.5 + 0.5) * 255
        img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255
        img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { srgb: false, repeat: true })
}

/** Old bricks in running bond, sooty, 8 to a row and 20 rows to the tile (1.8 m by 1.5 m of wall).
 *  `tone`: the bricks' colour (red clay; firebrick is buff) and `joint` the mortar's. */
function brickTextures(light, { tone = [128, 62, 46], joint = [52, 46, 42], seed = 31 } = {}) {
  const w = light ? 256 : 512
  const h = light ? 250 : 500
  const bw = w / 8
  const bh = h / 20
  const mortar = Math.max(2, Math.round(w / 170))
  const rnd = random(seed)
  const heights = new Float32Array(w * h)
  const tones = Array.from({ length: 20 * 9 }, () => 0.72 + rnd() * 0.5)
  const burnt = Array.from({ length: 20 * 9 }, () => (rnd() < 0.15 ? 0.6 : 1))
  const map = canvasTex(w, h, g => {
    const img = g.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      const row = Math.floor(y / bh)
      const shift = row % 2 ? bw / 2 : 0
      const yy = y - row * bh
      for (let x = 0; x < w; x++) {
        const xs = (x + shift) % w
        const col = Math.floor(xs / bw)
        const xx = xs - col * bw
        const joint = yy < mortar || xx < mortar
        const k = row * 9 + col
        const speck = rnd() * 0.18
        let r, gg, b
        if (joint) {
          r = joint[0] + speck * 40
          gg = joint[1] + speck * 36
          b = joint[2] + speck * 34
          heights[y * w + x] = 0
        } else {
          const t = tones[k] * burnt[k] * (0.9 + speck)
          const edge = Math.min(xx - mortar, bw - xx, yy - mortar, bh - yy) / (bh * 0.5)
          r = tone[0] * t
          gg = tone[1] * t
          b = tone[2] * t
          heights[y * w + x] = Math.min(1, 0.6 + edge * 0.8) - speck * 0.4
        }
        const i = (y * w + x) * 4
        img.data[i] = r
        img.data[i + 1] = gg
        img.data[i + 2] = b
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
  return { map, normalMap: normalMap(heights, w, h, 3), size: [1.8, 1.5] }
}

/** Worn flagstones of a few sizes in a 3 m square, grey-brown, with dark joints. */
function stoneTextures(light) {
  const s = light ? 256 : 512
  const rnd = random(47)
  const heights = new Float32Array(s * s).fill(0.8)
  const map = canvasTex(s, s, g => {
    g.fillStyle = '#2a2420'
    g.fillRect(0, 0, s, s)
    // rows of slabs of varied length (a row is 0.6 to 1 m deep)
    let y = 0
    const joint = Math.max(2, s / 170)
    while (y < s - 2) {
      const rh = Math.min(s - y, Math.round(s * (0.2 + rnd() * 0.13)))
      let x = rnd() * s * 0.3
      const x0 = x
      while (x < x0 + s - 2) {
        const sw = Math.min(x0 + s - x, Math.round(s * (0.22 + rnd() * 0.2)))
        const v = 92 + rnd() * 34
        const hue = rnd() * 10
        g.fillStyle = `rgb(${v + 8 + hue},${v + 2},${v - 6 - hue})`
        // the slab wraps round the tile's edge so the tile repeats
        for (const dx of [0, -s]) g.fillRect(x + dx + joint, y + joint, sw - joint * 2, rh - joint * 2)
        // worn patches and specks on each slab
        for (let k = 0; k < 18; k++) {
          const px = x + rnd() * sw
          const py = y + rnd() * rh
          const pv = v + (rnd() - 0.5) * 30
          g.fillStyle = `rgba(${pv + 6},${pv},${pv - 8},0.35)`
          g.beginPath()
          g.arc(px % s, py, 2 + rnd() * s * 0.03, 0, Math.PI * 2)
          g.fill()
        }
        x += sw
      }
      y += rh
    }
    // the joints are low in the height map
    const d = g.getImageData(0, 0, s, s).data
    for (let i = 0; i < s * s; i++) if (d[i * 4] < 60) heights[i] = 0
  }, { repeat: true })
  return { map, normalMap: normalMap(heights, s, s, 2.2), size: 3 }
}

/** A night sky seen through a window of small panes: deep blue, a few stars, the leading between. */
function nightTex(seed) {
  const rnd = random(seed)
  return canvasTex(256, 384, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#0a1030')
    grd.addColorStop(1, '#1d2a55')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(255,255,240,${0.4 + rnd() * 0.6})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h * 0.8, 0.8 + rnd() * 1.4, 0, Math.PI * 2)
      g.fill()
    }
    g.strokeStyle = '#120e0c'
    g.lineWidth = 6
    for (let i = 1; i < 3; i++) {
      g.beginPath()
      g.moveTo((i * w) / 3, 0)
      g.lineTo((i * w) / 3, h)
      g.stroke()
    }
    for (let j = 1; j < 4; j++) {
      g.beginPath()
      g.moveTo(0, (j * h) / 4)
      g.lineTo(w, (j * h) / 4)
      g.stroke()
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

/**
 * The workshop. `lamps`: [{ x, z, drop, light }] enamel lamps hanging from the ceiling (`light`: it
 * carries a real light; keep them few). `windows`: [{ side: 'w' | 'e' | 'n', at }] windows onto the night
 * (`at`: along the wall, z for the side walls, x for the north one).
 */
export function workshopStage({ light = false, x0 = -7, x1 = 7, z0 = -8.5, z1 = 9.8, h = 5, lamps = [], windows = [] } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const textures = []
  const bricks = brickTextures(light)
  for (const t of [bricks.map, bricks.normalMap]) t.repeat.set(1 / bricks.size[0], 1 / bricks.size[1])
  const brick = new THREE.MeshStandardMaterial({ map: bricks.map, normalMap: bricks.normalMap, normalScale: new THREE.Vector2(1, 1), roughness: 0.93, color: '#c2aca0' })
  // buff firebrick, for what holds a fire (a furnace, a kiln), so it stands out from the walls
  const fire = brickTextures(light, { tone: [150, 118, 84], joint: [40, 34, 30], seed: 53 })
  for (const t of [fire.map, fire.normalMap]) t.repeat.set(1 / fire.size[0], 1 / fire.size[1])
  const firebrick = new THREE.MeshStandardMaterial({ map: fire.map, normalMap: fire.normalMap, roughness: 0.9, color: '#d8c4b0' })
  textures.push(fire.map, fire.normalMap)
  const stone = stoneTextures(light)
  for (const t of [stone.map, stone.normalMap]) t.repeat.set(1 / stone.size, 1 / stone.size)
  const floorMat = new THREE.MeshStandardMaterial({ map: stone.map, normalMap: stone.normalMap, roughness: 0.85, color: '#b8aa9c' })
  textures.push(bricks.map, bricks.normalMap, stone.map, stone.normalMap)
  // plain materials the scene may share (one shader program for all of them)
  const mats = {
    wood: new THREE.MeshStandardMaterial({ color: '#6a4630', roughness: 0.75 }),
    beam: new THREE.MeshStandardMaterial({ color: '#33251b', roughness: 0.85 }),
    iron: new THREE.MeshStandardMaterial({ color: '#3b3d42', roughness: 0.5, metalness: 0.7 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.32, metalness: 0.9 }),
    dark: new THREE.MeshStandardMaterial({ color: '#17130f', roughness: 0.9 }),
  }

  // the floor
  const fw = x1 - x0
  const fd = z1 - z0
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  const fuv = floorGeo.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * fw, fuv.getY(i) * fd)
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)

  // the walls (a wall turned by +90 degrees runs its x along -z, one turned by -90 degrees along +z)
  const wall = (geo, x, z, rotY) => {
    const m = new THREE.Mesh(geo, brick)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
  }
  wall(wallPiece(x0, x1, 0, h), 0, z0, 0)
  wall(wallPiece(-x1, -x0, 0, h), 0, z1, Math.PI)
  wall(wallPiece(-z1, -z0, 0, h), x0, 0, Math.PI / 2)
  wall(wallPiece(z0, z1, 0, h), x1, 0, -Math.PI / 2)
  // a skirting of dark wood all round
  const skirt = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.04), mats.beam)
    m.position.set(x, 0.08, z)
    m.rotation.y = rotY
    group.add(m)
  }
  skirt(fw, (x0 + x1) / 2, z0 + 0.02, 0)
  skirt(fw, (x0 + x1) / 2, z1 - 0.02, 0)
  skirt(fd, x0 + 0.02, (z0 + z1) / 2, Math.PI / 2)
  skirt(fd, x1 - 0.02, (z0 + z1) / 2, Math.PI / 2)

  // the ceiling: dark boards on heavy beams
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), mats.dark)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  for (let z = z1 - 1.4; z > z0 + 0.4; z -= 2.6) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.34, 0.26), mats.beam)
    b.position.set((x0 + x1) / 2, h - 0.17, z)
    group.add(b)
  }
  for (const x of [x0 + 0.15, x1 - 0.15]) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, fd), mats.beam)
    plate.position.set(x, h - 0.15, (z0 + z1) / 2)
    group.add(plate)
  }

  // windows onto the night: a deep wooden frame round small panes of dark blue
  const frameGeo = new THREE.BoxGeometry(1.5, 2.1, 0.12)
  for (const [i, wdw] of windows.entries()) {
    const tex = nightTex(5 + i * 7)
    textures.push(tex)
    const win = new THREE.Group()
    const frame = new THREE.Mesh(frameGeo, mats.beam)
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.9), new THREE.MeshBasicMaterial({ map: tex }))
    sky.position.z = 0.065
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.3), mats.wood)
    sill.position.set(0, -1.09, 0.12)
    win.add(frame, sky, sill)
    const y = 2.4
    if (wdw.side === 'w') win.position.set(x0 + 0.04, y, wdw.at), (win.rotation.y = Math.PI / 2)
    else if (wdw.side === 'e') win.position.set(x1 - 0.04, y, wdw.at), (win.rotation.y = -Math.PI / 2)
    else win.position.set(wdw.at, y, z0 + 0.04)
    group.add(win)
  }

  // enamel lamps hanging low, dim and warm (only some carry a light, to keep the lights few)
  const shadeGeo = new THREE.LatheGeometry(
    [[0.03, 0.2], [0.06, 0.19], [0.1, 0.12], [0.24, 0], [0.255, -0.01]].map(([x, y]) => new THREE.Vector2(x, y)),
    24,
  )
  const shadeMat = new THREE.MeshStandardMaterial({ color: '#2e4a3c', roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide })
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff2d8', emissive: '#ffcf8a', emissiveIntensity: 2.2 })
  for (const l of lamps) {
    const drop = l.drop ?? 1.3
    const y = h - drop
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drop, 5), mats.iron)
    cord.position.set(l.x, h - drop / 2, l.z)
    const shade = new THREE.Mesh(shadeGeo, shadeMat)
    shade.position.set(l.x, y - 0.2, l.z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), bulbMat)
    bulb.position.set(l.x, y - 0.15, l.z)
    group.add(cord, shade, bulb)
    if (l.light && !(light && l.optional)) {
      const p = new THREE.PointLight('#ffc98a', l.intensity ?? 5, 9, 2)
      p.position.set(l.x, y - 0.3, l.z)
      group.add(p)
    }
  }

  // dust drifting in the warm air
  const dust = motes({ count: 260, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: h - 0.5, color: '#ffd9a8', size: 0.025, opacity: 0.3, speed: 0.05, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  // a faint fill so nothing is pitch black: the night's blue from above, the floor's brown from below
  group.add(new THREE.HemisphereLight('#4a5274', '#2e1d14', light ? 0.95 : 0.7))

  disposers.push(() => textures.forEach(t => t.dispose()))
  return {
    group,
    brick,
    firebrick,
    mats,
    solids: roomWalls(x0, x1, z0, z1),
    env: {
      background: new THREE.Color('#0a0807'),
      fog: new THREE.Fog('#0d0a08', 14, 42),
      exposure: 1.0,
      envIntensity: 0.15,
      bloom: { strength: 0.62, radius: 0.5, threshold: 0.84 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.4, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
