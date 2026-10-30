// A stage for picture rooms (docs/knowledge/picture-rooms.md): a university laboratory of the 1980s at
// night. Painted concrete-block walls, a floor of speckled vinyl tiles, a suspended ceiling of acoustic
// tiles with fluorescent panels, windows onto a city at night, a door. Lit cool and even, but every big
// surface mid-toned (pale ones bloom to white), so what glows in it (a screen, a laser) still stands out.
// Walking inside the rectangle x0..x1, z0..z1. The scene adds its own machines and benches; `mats` are
// shared plain materials for them (one shader program each), and `shine` is an equirectangular picture
// of this room for metal to reflect.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls } from '../../../engine/collide.js'

/** Speckled vinyl floor tiles, 12 inches (0.305 m), four by four to the texture. */
function floorTex(light) {
  const n = 4
  const px = light ? 64 : 128
  const rnd = random(17)
  const t = canvasTex(n * px, n * px, (g, w, h) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // most tiles a warm grey-beige, a few a shade darker, as tiles from different boxes are
        const k = rnd() < 0.18 ? 0.86 : 0.95 + rnd() * 0.08
        g.fillStyle = `rgb(${Math.round(150 * k)},${Math.round(144 * k)},${Math.round(128 * k)})`
        g.fillRect(i * px, j * px, px, px)
        for (let s = 0; s < px * 1.6; s++) {
          const d = rnd()
          g.fillStyle = d < 0.5 ? 'rgba(90,84,74,0.55)' : d < 0.8 ? 'rgba(196,190,174,0.5)' : 'rgba(120,128,112,0.5)'
          g.fillRect(i * px + rnd() * px, j * px + rnd() * px, 1 + rnd() * 2, 1 + rnd() * 2)
        }
        g.strokeStyle = 'rgba(60,56,50,0.55)'
        g.lineWidth = 1
        g.strokeRect(i * px + 0.5, j * px + 0.5, px - 1, px - 1)
      }
    }
  }, { repeat: true })
  return { map: t, size: n * 0.305 }
}

/** Painted concrete blocks (16 by 8 inches) in running bond: two blocks wide and four rows to the tile. */
function blockTex(light, tint) {
  const bw = light ? 64 : 128
  const bh = bw / 2
  const rnd = random(29)
  const t = canvasTex(bw * 2, bh * 4, (g, w, h) => {
    g.fillStyle = tint
    g.fillRect(0, 0, w, h)
    for (let r = 0; r < 4; r++) {
      const shift = r % 2 ? bw / 2 : 0
      for (let c = -1; c < 3; c++) {
        const x = c * bw + shift
        const k = 0.94 + rnd() * 0.1
        g.fillStyle = `rgba(255,255,255,${(k - 0.94) * 0.5})`
        g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4)
        // the painted block's pitted face
        for (let s = 0; s < bw * 0.5; s++) {
          g.fillStyle = `rgba(40,44,38,${0.05 + rnd() * 0.08})`
          g.fillRect(x + rnd() * bw, r * bh + rnd() * bh, 1.5, 1.5)
        }
        g.fillStyle = 'rgba(30,34,30,0.35)'
        g.fillRect(x, r * bh, bw, 2)
        g.fillRect(x, r * bh, 2, bh)
      }
    }
  }, { repeat: true })
  return { map: t, size: [0.8, 0.8] }
}

/** Acoustic ceiling tiles (2 by 2 feet) in a light grid. */
function ceilingTex() {
  const rnd = random(41)
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#8f8f8a'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(60,60,56,${0.15 + rnd() * 0.25})`
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
    }
    g.fillStyle = '#b4b4ae'
    g.fillRect(0, 0, w, 3)
    g.fillRect(0, 0, 3, h)
  }, { repeat: true })
}

/** A city at night through a window: deep blue sky, low lights, a few lit windows far off. */
function cityTex(seed) {
  const rnd = random(seed)
  return canvasTex(256, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#070b22')
    grd.addColorStop(0.65, '#1a2246')
    grd.addColorStop(1, '#3a2e3a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(255,255,240,${0.3 + rnd() * 0.5})`
      g.fillRect(rnd() * w, rnd() * h * 0.5, 1.2, 1.2)
    }
    // trees and low buildings against the glow of the city
    let x = 0
    while (x < w) {
      const bw = 14 + rnd() * 40
      const bh = 18 + rnd() * (rnd() < 0.2 ? 90 : 40)
      g.fillStyle = '#0b0c16'
      g.fillRect(x, h - bh, bw, bh)
      for (let k = 0; k < bw * bh * 0.004; k++) {
        g.fillStyle = rnd() < 0.7 ? 'rgba(255,214,140,0.85)' : 'rgba(200,220,255,0.7)'
        g.fillRect(x + 2 + rnd() * (bw - 6), h - bh + 3 + rnd() * (bh - 8), 2, 2)
      }
      x += bw + rnd() * 6
    }
    for (let i = 0; i < 18; i++) {
      g.fillStyle = 'rgba(255,180,90,0.8)'
      g.beginPath()
      g.arc(rnd() * w, h - 6 - rnd() * 10, 1.4, 0, Math.PI * 2)
      g.fill()
    }
  })
}

/** What metal reflects in this room: the ceiling's bright panels, pale walls, a dark floor. */
function shineTex() {
  const t = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#9aa0a6')
    grd.addColorStop(0.42, '#6e7670')
    grd.addColorStop(0.55, '#4a4a46')
    grd.addColorStop(1, '#262420')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#f4f8ff'
    for (let i = 0; i < 6; i++) g.fillRect(i * (w / 6) + 8, 6, w / 12, 7)
    g.fillStyle = '#20263a'
    g.fillRect(w * 0.7, h * 0.3, w * 0.08, h * 0.16)
  }, { mipmaps: false })
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
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
 * The laboratory. `panels`: [{ x, z }] fluorescent ceiling panels (each 0.6 by 1.2 m, long along z);
 * `lights`: [{ x, z, intensity }] the few that carry a real light; `windows`: [{ side: 'w' | 'e' | 'n' |
 * 's', at, width }] onto the night; `door`: { side, at } (a door that stays shut). `wall` tints the
 * painted blocks.
 */
export function labStage({ light = false, x0 = -6.5, x1 = 6.5, z0 = -6.5, z1 = 6.5, h = 3.2, panels = [], lights = [], windows = [], door = null, wall = '#8f9a8a' } = {}) {
  const group = new THREE.Group()
  const textures = []
  const fw = x1 - x0
  const fd = z1 - z0
  const shine = shineTex()
  textures.push(shine)
  const mats = {
    steel: new THREE.MeshStandardMaterial({ color: '#b9bec4', roughness: 0.32, metalness: 0.85, envMap: shine, envMapIntensity: 1.0 }),
    dark: new THREE.MeshStandardMaterial({ color: '#202226', roughness: 0.55, metalness: 0.2 }),
    black: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.35, metalness: 0.1 }),
    paint: new THREE.MeshStandardMaterial({ color: '#a8a28e', roughness: 0.6, metalness: 0.15 }),
    blue: new THREE.MeshStandardMaterial({ color: '#2f4a7a', roughness: 0.45, metalness: 0.3 }),
    wood: new THREE.MeshStandardMaterial({ color: '#8a6440', roughness: 0.7 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#e8ecf0', roughness: 0.12, metalness: 1, envMap: shine, envMapIntensity: 1.2 }),
  }

  // the floor
  const fl = floorTex(light)
  fl.map.repeat.set(1 / fl.size, 1 / fl.size)
  textures.push(fl.map)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  const fuv = floorGeo.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * fw, fuv.getY(i) * fd)
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: fl.map, roughness: 0.55, metalness: 0.05, color: '#c8c2b4' }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)

  // the walls, painted blocks (a wall turned by +90 degrees runs its x along -z, one by -90 along +z)
  const bl = blockTex(light, wall)
  bl.map.repeat.set(1 / bl.size[0], 1 / bl.size[1])
  textures.push(bl.map)
  const wallMat = new THREE.MeshStandardMaterial({ map: bl.map, roughness: 0.85, color: '#d8dccf' })
  const addWall = (geo, x, z, rotY) => {
    const m = new THREE.Mesh(geo, wallMat)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
  }
  addWall(wallPiece(x0, x1, 0, h), 0, z0, 0)
  addWall(wallPiece(-x1, -x0, 0, h), 0, z1, Math.PI)
  addWall(wallPiece(-z1, -z0, 0, h), x0, 0, Math.PI / 2)
  addWall(wallPiece(z0, z1, 0, h), x1, 0, -Math.PI / 2)
  // a black rubber cove base all round
  const base = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.1, 0.02), mats.rubber)
    m.position.set(x, 0.05, z)
    m.rotation.y = rotY
    group.add(m)
  }
  base(fw, (x0 + x1) / 2, z0 + 0.01, 0)
  base(fw, (x0 + x1) / 2, z1 - 0.01, 0)
  base(fd, x0 + 0.01, (z0 + z1) / 2, Math.PI / 2)
  base(fd, x1 - 0.01, (z0 + z1) / 2, Math.PI / 2)

  // where a thing on a wall goes: the wall's side, along it, its height; returns the group placed and
  // turned to face into the room
  const onWall = (obj, side, at, y, out = 0.03) => {
    if (side === 'w') obj.position.set(x0 + out, y, at), (obj.rotation.y = Math.PI / 2)
    else if (side === 'e') obj.position.set(x1 - out, y, at), (obj.rotation.y = -Math.PI / 2)
    else if (side === 's') obj.position.set(at, y, z1 - out), (obj.rotation.y = Math.PI)
    else obj.position.set(at, y, z0 + out)
    group.add(obj)
    return obj
  }

  // the suspended ceiling, its fluorescent panels
  const ct = ceilingTex()
  ct.repeat.set(fw / 0.61, fd / 0.61)
  textures.push(ct)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ map: ct, roughness: 0.95, color: '#c4c4be' }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  const panelMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#eef4ff').multiplyScalar(0.92) })
  const rimMat = mats.paint
  for (const p of panels) {
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.03, 1.24), rimMat)
    rim.position.set(p.x, h - 0.015, p.z)
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 1.18), panelMat)
    glow.rotation.x = Math.PI / 2
    glow.position.set(p.x, h - 0.032, p.z)
    group.add(rim, glow)
  }
  for (const l of lights) {
    const pl = new THREE.PointLight('#e8f0ff', l.intensity ?? 4.5, 9, 1.6)
    pl.position.set(l.x, h - 0.35, l.z)
    group.add(pl)
  }

  // windows onto the night: aluminium frames, a sill, the city beyond
  for (const [i, wdw] of windows.entries()) {
    const ww = wdw.width ?? 1.6
    const win = new THREE.Group()
    const tex = cityTex(7 + i * 11)
    textures.push(tex)
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(ww, 1.3), new THREE.MeshBasicMaterial({ map: tex }))
    sky.position.z = 0.005
    win.add(sky)
    for (const [w, hh, x, y] of [[ww + 0.1, 0.06, 0, 0.68], [ww + 0.1, 0.06, 0, -0.68], [0.06, 1.42, -ww / 2 - 0.02, 0], [0.06, 1.42, ww / 2 + 0.02, 0], [0.04, 1.3, 0, 0]]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.06), mats.steel)
      bar.position.set(x, y, 0.03)
      win.add(bar)
    }
    const sill = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.3, 0.05, 0.22), mats.paint)
    sill.position.set(0, -0.73, 0.1)
    win.add(sill)
    onWall(win, wdw.side, wdw.at, 1.75, 0.01)
  }

  // a door that stays shut: wood, a narrow wire-glass pane, a steel kick plate and handle
  if (door) {
    const d = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.06), mats.paint)
    frame.position.y = 1.1
    const leaf = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.1, 0.06, 2, 0.01), mats.wood)
    leaf.position.set(0, 1.05, 0.03)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.7), new THREE.MeshBasicMaterial({ color: '#1a2036' }))
    pane.position.set(0.22, 1.5, 0.065)
    const kick = new THREE.Mesh(new THREE.BoxGeometry(0.93, 0.25, 0.01), mats.steel)
    kick.position.set(0, 0.14, 0.065)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 8), mats.chrome)
    handle.rotation.z = Math.PI / 2
    handle.position.set(-0.32, 1.02, 0.1)
    d.add(frame, leaf, pane, kick, handle)
    onWall(d, door.side, door.at, 0, 0.02)
  }

  // a little dust in the light
  const dust = motes({ count: 140, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: h - 0.3, color: '#dfe8ff', size: 0.02, opacity: 0.22, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  // the fluorescent light from above, the floor's warm grey from below
  group.add(new THREE.HemisphereLight('#dfe8f4', '#5a5448', light ? 1.35 : 1.05))

  return {
    group,
    mats,
    shine,
    onWall,
    solids: roomWalls(x0, x1, z0, z1),
    env: {
      background: new THREE.Color('#0b0d12'),
      fog: new THREE.Fog('#0f1116', 16, 40),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.45, radius: 0.5, threshold: 0.9 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose: () => textures.forEach(t => t.dispose()),
  }
}
