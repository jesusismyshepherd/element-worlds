// A stage for picture rooms (docs/knowledge/picture-rooms.md): a physics laboratory at McGill University,
// Montreal, on a winter night around 1900 (the Macdonald Physics Building, opened in 1893, where Rutherford
// worked from 1898 to 1907). Electric light, not gas or candles: pendant lamps with green enamel shades and
// warm carbon-filament bulbs. Dark oak panelling to the dado, painted plaster above, an oak strip floor, a
// plaster ceiling crossed by beams, tall round-headed windows onto snowy roofs and a church spire with snow
// falling, a wall regulator clock with its pendulum, glass-fronted cabinets of brass instruments, cast-iron
// radiators. A tall door (a real opening) gives onto a cold corridor whose far window stands open to the
// snow; `door.setOpen(k)` swings its leaf (0 shut, 1 wide open) and `door.cold` is the corridor's light.
// Every big surface mid-toned (pale ones bloom to white). Walking inside x0..x1, z0..z1; the scene adds its
// benches and apparatus. Gives `mats` (oak, darkOak, brass, iron, ebonite, glass, ivory, paint), `shine`
// (a reflection map), `soft` (a soft dot), `onWall(obj, side, at, y, out)`, `windows` (each with its
// `pane`, a hinged casement the scene may open: `setOpen(k)`), `clock`. Any physics laboratory of about 1900
// lit by electricity can use it (Rutherford's other McGill rooms, Thomson's or Röntgen's laboratories).
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls } from '../../../engine/collide.js'

export const BULB = '#ffd49a'
export const COLD = '#9db8ff'
const TAU = Math.PI * 2

function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** Oak panelling, one tile 1.2 m wide and `ht` m tall (UVs in metres): stiles and rails round two raised
 *  fields, each field with a light bevel along its top and left and a shadow along its bottom and right. */
function panelTex(light, ht) {
  const pw = light ? 192 : 384
  const ph = Math.round((pw / 1.2) * ht)
  const rnd = random(41)
  return canvasTex(pw, ph, (g, w, h) => {
    const px = w / 1.2
    g.fillStyle = '#6e4a31'
    g.fillRect(0, 0, w, h)
    // the grain of the stiles and rails
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(${rnd() < 0.5 ? '52,32,18' : '150,108,70'},${0.05 + rnd() * 0.08})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.5, 20 + rnd() * 80)
    }
    const field = (x, y, fw, fh) => {
      g.fillStyle = '#5a3a25'
      g.fillRect(x, y, fw, fh)
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(${rnd() < 0.5 ? '40,24,14' : '130,92,60'},${0.06 + rnd() * 0.08})`
        g.fillRect(x + rnd() * fw, y + 4, 1 + rnd(), fh - 8)
      }
      const b = px * 0.035
      g.fillStyle = 'rgba(190,150,100,0.35)'
      g.fillRect(x, y, fw, b)
      g.fillRect(x, y, b, fh)
      g.fillStyle = 'rgba(20,10,4,0.45)'
      g.fillRect(x, y + fh - b, fw, b)
      g.fillRect(x + fw - b, y, b, fh)
      // the raised middle of the field
      g.fillStyle = 'rgba(120,84,54,0.35)'
      g.fillRect(x + b * 2.2, y + b * 2.2, fw - b * 4.4, fh - b * 4.4)
    }
    const st = px * 0.1
    const fw = (w - st * 3) / 2
    const top = h * 0.12
    const mid = h * 0.52
    field(st, top, fw, mid - top - st * 0.5)
    field(st * 2 + fw, top, fw, mid - top - st * 0.5)
    field(st, mid + st * 0.5, fw, h - mid - st * 1.5 - h * 0.06)
    field(st * 2 + fw, mid + st * 0.5, fw, h - mid - st * 1.5 - h * 0.06)
  }, { repeat: true })
}

/** Painted plaster, a faint mottle (UVs in metres, 2 m to the tile). */
function plasterTex(light, base) {
  const s = light ? 128 : 256
  const rnd = random(53)
  const c = new THREE.Color(base)
  return canvasTex(s, s, g => {
    g.fillStyle = `#${c.getHexString()}`
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 500; i++) {
      const k = rnd() < 0.5 ? 0 : 255
      g.fillStyle = `rgba(${k},${k},${k},${0.006 + rnd() * 0.01})`
      const r = 4 + rnd() * 18
      g.beginPath()
      g.arc(rnd() * s, rnd() * s, r, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
}

/** An oak strip floor (UVs in metres, 4 m to the tile): boards 0.1 m wide of varied lengths, honey-brown. */
function floorTex(light) {
  const s = light ? 256 : 512
  const rnd = random(61)
  const per = s / 40
  return canvasTex(s, s, g => {
    g.fillStyle = '#2a1c10'
    g.fillRect(0, 0, s, s)
    for (let c = 0; c < 40; c++) {
      let y = -rnd() * s
      while (y < s) {
        const len = s * (0.12 + rnd() * 0.22)
        const v = 0.8 + rnd() * 0.28
        for (const dy of [0, s]) {
          g.fillStyle = `rgb(${Math.round(132 * v)},${Math.round(94 * v)},${Math.round(58 * v)})`
          g.fillRect(c * per + 0.8, y - dy + 0.8, per - 1.6, len - 1.6)
          for (let k = 0; k < 3; k++) {
            g.fillStyle = `rgba(${rnd() < 0.5 ? '60,38,20' : '176,134,90'},${0.08 + rnd() * 0.1})`
            g.fillRect(c * per + 1.5 + rnd() * (per - 3.5), y - dy + 2, 1, len - 4)
          }
        }
        y += len
      }
    }
  }, { repeat: true })
}

/** Montreal on a snowy night through a window: a low glowing sky, snow-covered roofs with lit windows,
 *  chimneys, a church's spire, falling snow, snow on the sill outside. `seed` varies the roofs. */
function viewTex(seed, { spire = true, w = 256, h = 512 } = {}) {
  const rnd = random(seed)
  return canvasTex(w, h, g => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.75)
    sky.addColorStop(0, '#0c1430')
    sky.addColorStop(0.7, '#1e2c58')
    sky.addColorStop(1, '#34467a')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    const base = h * 0.94
    if (spire) {
      const sx = w * (0.55 + rnd() * 0.2)
      g.fillStyle = '#121a36'
      g.fillRect(sx - 14, h * 0.44, 28, base - h * 0.44)
      g.beginPath()
      g.moveTo(sx - 14, h * 0.45)
      g.lineTo(sx, h * 0.16)
      g.lineTo(sx + 14, h * 0.45)
      g.fill()
      // snow on the spire's windward side, a lit belfry slit, a cross
      g.fillStyle = 'rgba(190,206,236,0.75)'
      g.beginPath()
      g.moveTo(sx - 3, h * 0.2)
      g.lineTo(sx, h * 0.16)
      g.lineTo(sx + 2, h * 0.3)
      g.fill()
      g.fillStyle = 'rgba(255,200,120,0.6)'
      g.fillRect(sx - 3, h * 0.5, 6, 14)
      g.fillStyle = '#121a36'
      g.fillRect(sx - 1, h * 0.12, 2, h * 0.05)
      g.fillRect(sx - 5, h * 0.135, 10, 2)
    }
    let x = -20
    while (x < w + 10) {
      const bw = 50 + rnd() * 50
      const top = h * (0.6 + rnd() * 0.16)
      g.fillStyle = '#141c3a'
      g.beginPath()
      g.moveTo(x, base)
      g.lineTo(x, top + 18)
      g.lineTo(x + bw / 2, top)
      g.lineTo(x + bw, top + 18)
      g.lineTo(x + bw, base)
      g.fill()
      // the snow on the roof
      g.fillStyle = '#9fb0d4'
      g.beginPath()
      g.moveTo(x - 2, top + 20)
      g.lineTo(x + bw / 2, top + 1)
      g.lineTo(x + bw + 2, top + 20)
      g.lineTo(x + bw + 2, top + 26)
      g.lineTo(x + bw / 2, top + 9)
      g.lineTo(x - 2, top + 26)
      g.fill()
      // a chimney with its cap of snow
      if (rnd() < 0.6) {
        const cx = x + bw * (0.2 + rnd() * 0.5)
        g.fillStyle = '#141c3a'
        g.fillRect(cx, top - 4, 8, 24)
        g.fillStyle = '#9fb0d4'
        g.fillRect(cx - 1, top - 6, 10, 3)
      }
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
        g.fillStyle = rnd() < 0.4 ? 'rgba(255,200,120,0.85)' : 'rgba(30,40,70,0.9)'
        g.fillRect(x + 10 + c * (bw - 28), top + 34 + r * 26, 9, 13)
      }
      x += bw
    }
    // the falling snow, painted (more falls in front, in the room's update)
    for (let i = 0; i < 120; i++) {
      g.fillStyle = `rgba(222,232,255,${0.3 + rnd() * 0.5})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * base, 0.8 + rnd() * 1.6, 0, TAU)
      g.fill()
    }
    // snow banked on the sill outside
    g.fillStyle = '#b4c2e0'
    g.beginPath()
    g.moveTo(0, h)
    g.lineTo(0, base + 4)
    g.quadraticCurveTo(w * 0.3, base - 8, w * 0.6, base + 2)
    g.quadraticCurveTo(w * 0.85, base - 6, w, base + 3)
    g.lineTo(w, h)
    g.fill()
  })
}

/** A dial with twelve marks and Roman numerals (the regulator clock). */
function dialTex() {
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#e8dcc0'
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2, 0, TAU)
    g.fill()
    g.strokeStyle = '#3a2a1a'
    g.lineWidth = 3
    g.beginPath()
    g.arc(w / 2, w / 2, w * 0.46, 0, TAU)
    g.stroke()
    g.fillStyle = '#2a1d12'
    g.font = '700 26px serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const R = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU - Math.PI / 2
      g.fillText(R[i], w / 2 + Math.cos(a) * w * 0.36, w / 2 + Math.sin(a) * w * 0.36)
    }
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * TAU
      const r0 = i % 5 ? w * 0.44 : w * 0.42
      g.lineWidth = i % 5 ? 1.5 : 3
      g.beginPath()
      g.moveTo(w / 2 + Math.cos(a) * r0, w / 2 + Math.sin(a) * r0)
      g.lineTo(w / 2 + Math.cos(a) * w * 0.46, w / 2 + Math.sin(a) * w * 0.46)
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

/** A round-headed opening `w` wide, its springing at `hs` above its foot (the arch's top at hs + w / 2). */
function archShape(w, hs, bottom = 0) {
  const r = w / 2
  const s = new THREE.Shape()
  s.moveTo(-r, bottom)
  s.lineTo(r, bottom)
  s.lineTo(r, hs)
  s.absarc(0, hs, r, 0, Math.PI, false)
  s.lineTo(-r, bottom)
  return s
}

/**
 * The laboratory. `lamps`: [{ x, z, y, light }] pendants (light: a real point light of that intensity);
 * `windows`: [{ side, at, width, sill, spring, pane }] round-headed windows (sill height, the arch's
 * springing above the sill; `pane`: a casement that opens); `door`: { side, at, width, height } (an opening
 * onto the cold corridor); `cabinets`: [{ side, at, width }]; `radiators`: [{ side, at }]; `clock`: { side,
 * at, y }. `wainscot`: the panelling's height (m). `paint`: the plaster's colour.
 */
export function mcgillStage({
  light = false, x0 = -6.8, x1 = 6.8, z0 = -6.6, z1 = 6.6, h = 4.8, wainscot = 1.5, paint = '#5a6684',
  lamps = [], windows = [], door = null, cabinets = [], radiators = [], clock = null,
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const tex = t => (textures.push(t), t)
  const fw = x1 - x0
  const fd = z1 - z0
  const soft = tex(softTex())
  const shine = tex(canvasTex(256, 128, (g, w, hh) => {
    const grd = g.createLinearGradient(0, 0, 0, hh)
    grd.addColorStop(0, '#14120e')
    grd.addColorStop(0.45, '#5c5040')
    grd.addColorStop(0.55, '#38322a')
    grd.addColorStop(1, '#0c0a08')
    g.fillStyle = grd
    g.fillRect(0, 0, w, hh)
    for (const [x, y, r] of [[0.12, 0.3, 9], [0.38, 0.28, 11], [0.64, 0.3, 9], [0.88, 0.32, 8]]) {
      const c = g.createRadialGradient(x * w, y * hh, 0, x * w, y * hh, r)
      c.addColorStop(0, 'rgba(255,240,210,1)')
      c.addColorStop(1, 'rgba(255,200,120,0)')
      g.fillStyle = c
      g.fillRect(x * w - r, y * hh - r, r * 2, r * 2)
    }
    g.fillStyle = '#2c3c66'
    g.fillRect(w * 0.2, hh * 0.18, w * 0.08, hh * 0.3)
    g.fillRect(w * 0.7, hh * 0.18, w * 0.08, hh * 0.3)
  }, { mipmaps: false }))
  shine.mapping = THREE.EquirectangularReflectionMapping
  const mats = {
    oak: new THREE.MeshStandardMaterial({ color: '#7a5434', roughness: 0.55, metalness: 0.04 }),
    darkOak: new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.3, metalness: 0.9, envMap: shine, envMapIntensity: 1.2 }),
    iron: new THREE.MeshStandardMaterial({ color: '#3a3c42', roughness: 0.5, metalness: 0.6, envMap: shine, envMapIntensity: 0.6 }),
    ebonite: new THREE.MeshStandardMaterial({ color: '#16161a', roughness: 0.35, metalness: 0.1, envMap: shine, envMapIntensity: 0.5 }),
    paint: new THREE.MeshStandardMaterial({ color: '#9c968a', roughness: 0.6 }),
    ivory: new THREE.MeshStandardMaterial({ color: '#cdbf9e', roughness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe6ea', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false, envMap: shine, envMapIntensity: 1.1, side: THREE.DoubleSide }),
  }

  // ---- the floor and the ceiling ----
  const fl = tex(floorTex(light))
  fl.repeat.set(1 / 4, 1 / 4)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  {
    const uv = floorGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fw, uv.getY(i) * fd)
  }
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: fl, roughness: 0.5, metalness: 0.04, color: '#d4c4ae' }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: '#5e5c58', roughness: 0.95 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  for (let x = x0 + fw / 4; x < x1 - 0.1; x += fw / 4) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, fd), mats.darkOak)
    beam.position.set(x, h - 0.15, (z0 + z1) / 2)
    group.add(beam)
  }

  // ---- the walls: panelling to the dado, a rail, plaster above, a picture rail and a cornice ----
  const pan = tex(panelTex(light, wainscot))
  pan.repeat.set(1 / 1.2, 1 / wainscot)
  const pl = tex(plasterTex(light, paint))
  pl.repeat.set(1 / 2, 1 / 2)
  const panMat = new THREE.MeshStandardMaterial({ map: pan, roughness: 0.5, metalness: 0.03 })
  const plMat = new THREE.MeshStandardMaterial({ map: pl, roughness: 0.9 })
  const sides = { n: [x0, x1, z0, 0], s: [-x1, -x0, z1, Math.PI], w: [-z1, -z0, x0, Math.PI / 2], e: [z0, z1, x1, -Math.PI / 2] }
  // where along its wall (in the wall's own coordinate) a world position falls
  const along = (side, at) => (side === 'n' ? at : side === 's' ? -at : side === 'w' ? -at : at)
  const openings = { n: [], s: [], w: [], e: [] }
  if (door) {
    const a = along(door.side, door.at)
    const dw = door.width ?? 1.2
    openings[door.side].push([a - dw / 2, a + dw / 2, door.height ?? 2.5])
  }
  for (const [side, [a0, a1, p, rot]] of Object.entries(sides)) {
    const x = side === 'n' || side === 's' ? 0 : p
    const z = side === 'n' || side === 's' ? p : 0
    const add = (b0, b1, y0, y1, mat) => {
      if (b1 - b0 < 0.001 || y1 - y0 < 0.001) return
      const m = new THREE.Mesh(wallPiece(b0, b1, y0, y1), mat)
      m.position.set(x, 0, z)
      m.rotation.y = rot
      group.add(m)
    }
    // the wall as strips between its openings
    const cuts = openings[side].slice().sort((u, v) => u[0] - v[0])
    let from = a0
    for (const [c0, c1, ch] of cuts) {
      add(from, c0, 0, wainscot, panMat)
      add(from, c0, wainscot, h, plMat)
      add(c0, c1, ch, h, plMat)
      from = c1
    }
    add(from, a1, 0, wainscot, panMat)
    add(from, a1, wainscot, h, plMat)
    // the dado rail, the skirting, the picture rail and the cornice, broken at the openings
    const trims = (b0, b1) => {
      const len = b1 - b0
      if (len < 0.01) return
      const mid = (b0 + b1) / 2
      for (const [yy, hh, dd, mat] of [[wainscot, 0.07, 0.05, mats.oak], [0.09, 0.18, 0.03, mats.darkOak]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(len, hh, dd), mat)
        m.position.set(mid, yy, dd / 2)
        const holder = new THREE.Group()
        holder.add(m)
        holder.position.set(x, 0, z)
        holder.rotation.y = rot
        group.add(holder)
      }
    }
    from = a0
    for (const [c0, c1] of cuts) {
      trims(from, c0 - 0.09)
      from = c1 + 0.09
    }
    trims(from, a1)
    for (const [yy, hh, dd, mat] of [[h - 0.6, 0.04, 0.03, mats.darkOak], [h - 0.08, 0.16, 0.14, mats.paint]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(a1 - a0, hh, dd), mat)
      m.position.set((a0 + a1) / 2, yy, dd / 2)
      const holder = new THREE.Group()
      holder.add(m)
      holder.position.set(x, 0, z)
      holder.rotation.y = rot
      group.add(holder)
    }
  }

  const onWall = (obj, side, at, y, out = 0.03) => {
    if (side === 'w') obj.position.set(x0 + out, y, at), (obj.rotation.y = Math.PI / 2)
    else if (side === 'e') obj.position.set(x1 - out, y, at), (obj.rotation.y = -Math.PI / 2)
    else if (side === 's') obj.position.set(at, y, z1 - out), (obj.rotation.y = Math.PI)
    else obj.position.set(at, y, z0 + out)
    group.add(obj)
    return obj
  }

  const lights = []
  const updates = []

  // ---- pendant lamps: a rod, a green enamel shade (white inside), a warm bulb ----
  {
    const shadePts = [[0.035, 0.0], [0.05, -0.02], [0.13, -0.12], [0.2, -0.2], [0.205, -0.215]].map(([r, y]) => new THREE.Vector2(r, y))
    const shadeGeo = new THREE.LatheGeometry(shadePts, light ? 16 : 28)
    const outMat = new THREE.MeshStandardMaterial({ color: '#2f5a3a', roughness: 0.35, metalness: 0.2, envMap: shine, envMapIntensity: 0.6, side: THREE.FrontSide })
    const inMat = new THREE.MeshStandardMaterial({ color: '#efe6cf', emissive: '#ffe3b0', emissiveIntensity: 0.55, roughness: 0.5, side: THREE.BackSide })
    const bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(BULB).multiplyScalar(2.2) })
    const glowMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color(BULB).multiplyScalar(1.0), transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false })
    for (const lp of lamps) {
      const y = lp.y ?? 3.0
      const g = new THREE.Group()
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, h - y, 6), mats.iron)
      rod.position.y = (h + y) / 2
      const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14), mats.brass)
      rose.position.y = h - 0.015
      const outer = new THREE.Mesh(shadeGeo, outMat)
      outer.position.y = y
      const inner = new THREE.Mesh(shadeGeo, inMat)
      inner.position.y = y
      const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.06, 10), mats.brass)
      holder.position.y = y - 0.03
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), bulbMat)
      bulb.scale.y = 1.25
      bulb.position.y = y - 0.1
      const glow = new THREE.Sprite(glowMat)
      glow.position.y = y - 0.14
      glow.scale.setScalar(0.45)
      g.add(rod, rose, outer, inner, holder, bulb, glow)
      g.position.set(lp.x, 0, lp.z)
      group.add(g)
      if (lp.light) {
        const pl = new THREE.PointLight(BULB, lp.light, lp.range ?? 11, 1.5)
        pl.position.set(lp.x, y - 0.2, lp.z)
        group.add(pl)
        lights.push(pl)
      }
    }
  }

  // ---- round-headed windows onto the snowy town, snow falling past ----
  const win = []
  const dot = soft
  windows.forEach((wd, i) => {
    const ww = wd.width ?? 1.3
    const sill = wd.sill ?? 1.25
    const hs = wd.spring ?? 1.9
    const g = new THREE.Group()
    const view = tex(viewTex(1900 + i * 17, { spire: wd.spire ?? i % 2 === 0 }))
    const vgeo = new THREE.ShapeGeometry(archShape(ww, hs), 24)
    // UVs over the opening's bounding box
    {
      const pos = vgeo.attributes.position
      const uv = vgeo.attributes.uv
      const top = hs + ww / 2
      for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) / ww + 0.5, pos.getY(k) / top)
    }
    const viewM = new THREE.Mesh(vgeo, new THREE.MeshBasicMaterial({ map: view, color: '#cfd8ee' }))
    viewM.position.z = 0.004
    g.add(viewM)
    // the frame: a moulded surround, a sill, bars
    const surround = archShape(ww + 0.24, hs, -0.08)
    surround.holes.push(archShape(ww, hs, 0))
    const sGeo = new THREE.ExtrudeGeometry(surround, { depth: 0.1, bevelEnabled: false, curveSegments: 24 })
    const frame = new THREE.Mesh(sGeo, mats.darkOak)
    frame.position.y = -0.0
    g.add(frame)
    const sillM = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.44, 0.06, 0.34), mats.oak)
    sillM.position.set(0, -0.03, 0.16)
    g.add(sillM)
    const bar = (w, hh, x, y, d = 0.06) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mats.darkOak)
      b.position.set(x, y, d / 2 + 0.01)
      g.add(b)
      return b
    }
    bar(0.05, hs + ww / 2, 0, (hs + ww / 2) / 2)
    bar(ww, 0.05, 0, hs)
    bar(ww, 0.04, 0, hs * 0.5)
    // a casement in the lower left quarter that can open inward on its left hinge
    let pane = null
    if (wd.pane) {
      const pw = ww / 2 - 0.03
      const phh = hs * 0.5 - 0.03
      const hinge = new THREE.Group()
      hinge.position.set(-ww / 2 + 0.01, 0.02, 0.06)
      const leaf = new THREE.Group()
      const glassM = new THREE.Mesh(new THREE.PlaneGeometry(pw - 0.06, phh - 0.06), mats.glass)
      glassM.position.set(pw / 2, phh / 2, 0)
      leaf.add(glassM)
      for (const [w2, h2, x2, y2] of [[pw, 0.04, pw / 2, 0.02], [pw, 0.04, pw / 2, phh - 0.02], [0.04, phh, 0.02, phh / 2], [0.04, phh, pw - 0.02, phh / 2]]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, 0.04), mats.darkOak)
        b.position.set(x2, y2, 0)
        leaf.add(b)
      }
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.03), mats.brass)
      handle.position.set(pw - 0.05, phh / 2, 0.03)
      leaf.add(handle)
      hinge.add(leaf)
      g.add(hinge)
      pane = { group: hinge, leaf, width: pw, height: phh, setOpen: k => (hinge.rotation.y = -Math.max(0, Math.min(1, k)) * 1.1) }
    }
    // snow falling just outside the glass
    const n = light ? 18 : 46
    const pos = new Float32Array(n * 3)
    const sp = new Float32Array(n)
    const r = ww / 2
    const topAt = x => hs + Math.sqrt(Math.max(0, r * r - x * x))
    for (let k = 0; k < n; k++) {
      const x = (Math.random() * 2 - 1) * r * 0.96
      pos.set([x, Math.random() * topAt(x), 0.012], k * 3)
      sp[k] = 0.18 + Math.random() * 0.25
    }
    const sgeo = new THREE.BufferGeometry()
    sgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const flakes = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: '#e4ecff', size: 0.03, map: dot, transparent: true, opacity: 0.85, depthWrite: false }))
    flakes.frustumCulled = false
    flakes.raycast = () => {}
    g.add(flakes)
    updates.push((dt, t) => {
      for (let k = 0; k < n; k++) {
        let x = pos[k * 3] + Math.sin(t * 0.9 + k) * 0.03 * dt
        let y = pos[k * 3 + 1] - sp[k] * dt
        if (y < 0.02) {
          x = (Math.random() * 2 - 1) * r * 0.96
          y = topAt(x)
        }
        pos[k * 3] = x
        pos[k * 3 + 1] = y
      }
      sgeo.attributes.position.needsUpdate = true
    })
    onWall(g, wd.side, wd.at, sill, 0.01)
    win.push({ group: g, pane, width: ww, sill, spring: hs })
  })

  // ---- the door onto the cold corridor ----
  let doorApi = null
  if (door) {
    const dw = door.width ?? 1.2
    const dh = door.height ?? 2.5
    const len = door.depth ?? 6
    const g = new THREE.Group()
    // the architrave round the opening
    for (const [w2, h2, x2, y2] of [[0.14, dh + 0.14, -dw / 2 - 0.07, (dh + 0.14) / 2], [0.14, dh + 0.14, dw / 2 + 0.07, (dh + 0.14) / 2], [dw + 0.28, 0.16, 0, dh + 0.08]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, 0.08), mats.darkOak)
      m.position.set(x2, y2, 0.04)
      g.add(m)
    }
    // the corridor beyond: going away from the room (-z in the door's own coordinates)
    const cw = dw + 1.2
    const corr = new THREE.Group()
    const stone = new THREE.MeshStandardMaterial({ color: '#6e7486', roughness: 0.7 })
    const cpaint = new THREE.MeshStandardMaterial({ color: '#6a7896', roughness: 0.85 })
    const cdado = new THREE.MeshStandardMaterial({ color: '#3a4258', roughness: 0.7 })
    const cfloor = new THREE.Mesh(new THREE.PlaneGeometry(cw, len), stone)
    cfloor.rotation.x = -Math.PI / 2
    cfloor.position.set(0, 0.002, -len / 2)
    corr.add(cfloor)
    // black and grey tiles in a checker, faintly
    {
      const tg = new THREE.PlaneGeometry(0.3, 0.3)
      const tm = new THREE.MeshStandardMaterial({ color: '#4a4f60', roughness: 0.6 })
      const nTiles = Math.floor(cw / 0.3) * Math.floor(len / 0.3)
      const im = new THREE.InstancedMesh(tg, tm, nTiles)
      const dummy = new THREE.Object3D()
      let k = 0
      for (let ix = 0; ix < Math.floor(cw / 0.3); ix++) for (let iz = 0; iz < Math.floor(len / 0.3); iz++) {
        if ((ix + iz) % 2) continue
        dummy.position.set(-cw / 2 + 0.15 + ix * 0.3, 0.004, -0.15 - iz * 0.3)
        dummy.rotation.set(-Math.PI / 2, 0, 0)
        dummy.updateMatrix()
        im.setMatrixAt(k++, dummy.matrix)
      }
      im.count = k
      corr.add(im)
    }
    for (const s of [-1, 1]) {
      const wl = new THREE.Mesh(new THREE.PlaneGeometry(len, dh + 0.9), cpaint)
      wl.rotation.y = -s * Math.PI / 2
      wl.position.set(s * cw / 2, (dh + 0.9) / 2, -len / 2)
      const dd = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.1), cdado)
      dd.rotation.y = -s * Math.PI / 2
      dd.position.set(s * (cw / 2 - 0.005), 0.55, -len / 2)
      corr.add(wl, dd)
    }
    const cc = new THREE.Mesh(new THREE.PlaneGeometry(cw, len), new THREE.MeshStandardMaterial({ color: '#4c5266', roughness: 0.95 }))
    cc.rotation.x = Math.PI / 2
    cc.position.set(0, dh + 0.9, -len / 2)
    corr.add(cc)
    // the far end: a wall with a window standing open onto the snow
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(cw, dh + 0.9), cpaint)
    endWall.position.set(0, (dh + 0.9) / 2, -len)
    corr.add(endWall)
    const farView = tex(viewTex(77, { spire: false, w: 256, h: 384 }))
    const fv = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.6), new THREE.MeshBasicMaterial({ map: farView, color: '#d8e2ff' }))
    fv.position.set(0, 1.75, -len + 0.01)
    corr.add(fv)
    for (const [w2, h2, x2, y2] of [[1.1, 0.06, 0, 0.95], [1.1, 0.06, 0, 2.55], [0.06, 1.66, -0.52, 1.75], [0.06, 1.66, 0.52, 1.75]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, 0.06), mats.paint)
      m.position.set(x2, y2, -len + 0.04)
      corr.add(m)
    }
    // its sash pushed up: the lower half open to the night
    const sash = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.05), mats.paint)
    sash.position.set(0, 2.0, -len + 0.1)
    corr.add(sash)
    // a cold light in the corridor (the snow's glow through the far window, a far lamp)
    const cold = new THREE.PointLight(COLD, light ? 3.2 : 2.6, 7, 1.4)
    cold.position.set(0, 2.2, -len + 1.2)
    corr.add(cold)
    lights.push(cold)
    const cglow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color(COLD).multiplyScalar(0.5), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }))
    cglow.position.set(0, 1.75, -len + 0.3)
    cglow.scale.set(2.2, 2.6, 1)
    corr.add(cglow)
    g.add(corr)
    // the leaf: four panels, frosted glass in the upper two, a brass knob; hinged on its right side,
    // opening into the room
    const hinge = new THREE.Group()
    hinge.position.set(dw / 2, 0, 0.02)
    const leaf = new THREE.Group()
    const lw = dw - 0.02
    const slab = new THREE.Mesh(new THREE.BoxGeometry(lw, dh - 0.02, 0.05), mats.oak)
    slab.position.set(-lw / 2, dh / 2, 0)
    leaf.add(slab)
    const frosted = new THREE.MeshStandardMaterial({ color: '#7a869c', roughness: 0.4, emissive: '#3a4a70', emissiveIntensity: 0.3 })
    for (const sx of [-1, 1]) {
      for (const [yy, hh, m] of [[0.55, 0.75, mats.darkOak], [1.65, 1.0, frosted]]) {
        for (const sz of [-1, 1]) {
          const p = new THREE.Mesh(new THREE.BoxGeometry(lw * 0.36, hh, 0.012), m)
          p.position.set(-lw / 2 + sx * lw * 0.21, yy, sz * 0.03)
          leaf.add(p)
        }
      }
    }
    for (const sz of [-1, 1]) {
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), mats.brass)
      knob.position.set(-lw + 0.1, 1.05, sz * 0.06)
      leaf.add(knob)
    }
    hinge.add(leaf)
    g.add(hinge)
    onWall(g, door.side, door.at, 0, 0.0)
    let open = 0
    doorApi = {
      group: g,
      leaf: hinge,
      cold,
      width: dw,
      height: dh,
      get open() { return open },
      setOpen(k) {
        open = Math.max(0, Math.min(1, k))
        hinge.rotation.y = open * 1.45
      },
    }
  }

  // ---- glass-fronted cabinets of brass instruments ----
  for (const cb of cabinets) {
    const cw = cb.width ?? 1.6
    const ch = 2.2
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.45), mats.darkOak)
    body.position.set(0, ch / 2, 0.225)
    g.add(body)
    const inside = new THREE.Mesh(new THREE.PlaneGeometry(cw - 0.12, ch - 0.5), new THREE.MeshStandardMaterial({ color: '#2a1e14', roughness: 0.9 }))
    inside.position.set(0, ch / 2 + 0.15, 0.452)
    g.add(inside)
    const rnd = random(cb.seed ?? 3)
    for (const sy of [0.75, 1.3, 1.85]) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(cw - 0.12, 0.025, 0.3), mats.oak)
      shelf.position.set(0, sy, 0.5)
      g.add(shelf)
      // instruments: brass cylinders, balls on stands, a coil
      let x = -cw / 2 + 0.16
      while (x < cw / 2 - 0.16) {
        const kind = Math.floor(rnd() * 3)
        if (kind === 0) {
          const c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.18, 14), mats.brass)
          c.position.set(x, sy + 0.1, 0.52)
          g.add(c)
        } else if (kind === 1) {
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), mats.brass)
          b.position.set(x, sy + 0.2, 0.52)
          const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 6), mats.ebonite)
          st.position.set(x, sy + 0.08, 0.52)
          g.add(b, st)
        } else {
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.025, 8, 16), new THREE.MeshStandardMaterial({ color: '#b5652e', roughness: 0.45, metalness: 0.7, envMap: shine }))
          coil.position.set(x, sy + 0.09, 0.52)
          g.add(coil)
        }
        x += 0.18 + rnd() * 0.12
      }
    }
    // the glass doors and their bars
    const front = new THREE.Mesh(new THREE.PlaneGeometry(cw - 0.08, ch - 0.45), mats.glass)
    front.position.set(0, ch / 2 + 0.15, 0.68)
    g.add(front)
    for (const x of [-cw / 2 + 0.04, 0, cw / 2 - 0.04]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.04, ch - 0.45, 0.04), mats.darkOak)
      b.position.set(x, ch / 2 + 0.15, 0.68)
      g.add(b)
    }
    for (const y of [0.42, ch - 0.07]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.06, 0.26), mats.darkOak)
      b.position.set(0, y, 0.58)
      g.add(b)
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.42, 0.7), mats.darkOak)
    base.position.set(0, 0.21, 0.35)
    g.add(base)
    onWall(g, cb.side, cb.at, 0, 0.0)
  }

  // ---- cast-iron radiators under the windows ----
  for (const rd of radiators) {
    const g = new THREE.Group()
    const n = rd.columns ?? 14
    const colGeo = new THREE.BoxGeometry(0.06, 0.62, 0.16)
    const im = new THREE.InstancedMesh(colGeo, new THREE.MeshStandardMaterial({ color: '#8a8c90', roughness: 0.45, metalness: 0.6, envMap: shine, envMapIntensity: 0.5 }), n)
    const dummy = new THREE.Object3D()
    for (let k = 0; k < n; k++) {
      dummy.position.set((k - (n - 1) / 2) * 0.075, 0.42, 0.14)
      dummy.updateMatrix()
      im.setMatrixAt(k, dummy.matrix)
    }
    g.add(im)
    for (const y of [0.16, 0.7]) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, n * 0.075, 8), mats.iron)
      pipe.rotation.z = Math.PI / 2
      pipe.position.set(0, y, 0.14)
      g.add(pipe)
    }
    onWall(g, rd.side, rd.at, 0, 0.0)
  }

  // ---- the wall regulator clock: dial, hands, a seconds pendulum behind glass ----
  let clockApi = null
  if (clock) {
    const g = new THREE.Group()
    const caseM = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.2, 0.16), mats.darkOak)
    caseM.position.set(0, 0, 0.08)
    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.2), mats.oak)
    crown.position.set(0, 0.64, 0.1)
    const foot = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.14, 4), mats.oak)
    foot.rotation.set(Math.PI, Math.PI / 4, 0)
    foot.position.set(0, -0.67, 0.08)
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.17, 40), new THREE.MeshStandardMaterial({ map: tex(dialTex()), roughness: 0.6 }))
    dial.position.set(0, 0.36, 0.165)
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 8, 40), mats.brass)
    bezel.position.set(0, 0.36, 0.168)
    const hand = (len, wdt, col) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(wdt, len, 0.006), new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 }))
      m.geometry.translate(0, len / 2 - 0.02, 0)
      m.position.set(0, 0.36, 0.172)
      return m
    }
    const hourH = hand(0.1, 0.014, '#1a120c')
    const minH = hand(0.145, 0.009, '#1a120c')
    const secH = hand(0.15, 0.003, '#7a1a12')
    secH.position.z = 0.176
    const window_ = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.62), new THREE.MeshStandardMaterial({ color: '#140e0a', roughness: 0.9 }))
    window_.position.set(0, -0.2, 0.163)
    const pend = new THREE.Group()
    pend.position.set(0, 0.06, 0.17)
    const prod = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.5, 0.004), mats.brass)
    prod.position.y = -0.25
    const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 20), mats.brass)
    bob.rotation.x = Math.PI / 2
    bob.position.y = -0.5
    pend.add(prod, bob)
    const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.64), mats.glass)
    glassFront.position.set(0, -0.2, 0.185)
    g.add(caseM, crown, foot, dial, bezel, hourH, minH, secH, window_, pend, glassFront)
    onWall(g, clock.side, clock.at, clock.y ?? 2.5, 0.01)
    // a winter evening, ten past nine, running on from the moment the room was built
    const start = 21 * 3600 + 10 * 60 + 12
    const t0 = performance.now() / 1000
    updates.push((dt, t) => {
      const s = start + performance.now() / 1000 - t0
      const sec = Math.floor(s) % 60
      secH.rotation.z = -(sec / 60) * TAU
      minH.rotation.z = -((s / 60) % 60 / 60) * TAU
      hourH.rotation.z = -((s / 3600) % 12 / 12) * TAU
      pend.rotation.z = Math.sin(t * Math.PI) * 0.08
    })
    clockApi = { group: g }
  }

  const dust = motes({ count: 140, radius: Math.min(fw, fd) / 2, y0: 0.4, y1: h - 0.4, color: '#ffe8c4', size: 0.018, opacity: 0.18, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  dust.group.raycast = () => {}
  group.add(dust.group)

  // warm light from the lamps above, the floor's brown below, a cold note of the winter night
  group.add(new THREE.HemisphereLight('#5e6078', '#2a1c12', light ? 0.75 : 0.6))

  return {
    group,
    mats,
    shine,
    soft,
    onWall,
    windows: win,
    door: doorApi,
    clock: clockApi,
    lights,
    solids: roomWalls(x0, x1, z0, z1),
    env: {
      background: new THREE.Color('#0a0a10'),
      fog: new THREE.Fog('#0b0b12', 14, 36),
      exposure: 1.0,
      envIntensity: 0.18,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.85 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t, dt = 1 / 60) {
      dust.update(t)
      for (const u of updates) u(dt, t)
    },
    dispose: () => textures.forEach(tx => tx.dispose()),
  }
}
