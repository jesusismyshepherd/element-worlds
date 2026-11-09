// A stage for picture rooms (docs/knowledge/picture-rooms.md): two places in one long hall, divided by a
// glazed screen with a wide opening. West of it, a professor's study in St Petersburg on a winter night about
// 1870: dark walnut boards and rugs, a dark wainscot under a warm sienna wall, bookcases to the ceiling, a tall
// green tiled stove in the corner, tall windows onto the frozen Neva and its lit embankment, oil lamps. East of
// it, a laboratory in Freiberg, Saxony, in the evening of 1886: stone flags, glazed tiles to the shoulder,
// pale plaster, gas lamps, a window onto snowy gables and a church tower. Russian and warmer than the
// townhouse's Georgian London (townhouse.js), older than the labs (lab.js, mcgill.js).
// Walking inside x0..x1, z0..z1. `mats` are plain materials for the scene's things; `oilLamp(x, y, z)` and
// `gasLamp(x, y, z)` stand a lamp (a real light each); `onWall(side, at, y, d)` gives a point on a wall and
// the rotation that faces into the room; `annex` is where the second place begins (x), `gap` the opening.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box, roomWalls } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const SILL = 1.05

/** A soft round glow. */
function softTexture() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A flame: a teardrop, white at its heart, orange at its edge. */
function flameTexture() {
  return canvasTex(64, 128, (g, w, h) => {
    g.save()
    g.translate(w / 2, h * 0.7)
    g.scale(1, 2.3)
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.45)
    grd.addColorStop(0, 'rgba(255,255,235,1)')
    grd.addColorStop(0.3, 'rgba(255,214,120,0.95)')
    grd.addColorStop(0.65, 'rgba(255,140,40,0.55)')
    grd.addColorStop(1, 'rgba(255,90,20,0)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(0, 0, w * 0.45, 0, TAU)
    g.fill()
    g.restore()
  })
}

/** Walnut floorboards (UVs in metres, 4 m to the tile). */
function boardsTex(light) {
  const s = light ? 256 : 512
  const rnd = random(1869)
  const per = s / 16
  return canvasTex(s, s, g => {
    g.fillStyle = '#1c120b'
    g.fillRect(0, 0, s, s)
    for (let c = 0; c < 16; c++) {
      let y = -rnd() * s
      while (y < s) {
        const len = s * (0.3 + rnd() * 0.5)
        const v = 0.72 + rnd() * 0.3
        for (const dy of [0, s]) {
          g.fillStyle = `rgb(${112 * v},${74 * v},${46 * v})`
          g.fillRect(c * per + 1, y - dy + 1, per - 2, len - 2)
          for (let k = 0; k < 6; k++) {
            g.fillStyle = `rgba(${rnd() < 0.5 ? '40,24,12' : '170,120,80'},${0.08 + rnd() * 0.1})`
            g.fillRect(c * per + 2 + rnd() * (per - 5), y - dy + 2, 1 + rnd() * 2, len - 4)
          }
        }
        y += len
      }
    }
  }, { repeat: true })
}

/** Stone flags for the laboratory (UVs in metres, 2 m to the tile): grey-green slabs. */
function flagsTex(light) {
  const s = light ? 256 : 512
  const rnd = random(1886)
  return canvasTex(s, s, g => {
    g.fillStyle = '#242a28'
    g.fillRect(0, 0, s, s)
    const n = 4
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const off = r % 2 ? s / n / 2 : 0
        const v = 0.8 + rnd() * 0.3
        for (const dx of [-s, 0, s]) {
          g.fillStyle = `rgb(${88 * v},${98 * v},${92 * v})`
          g.fillRect((c * s) / n + off + dx + 2, (r * s) / n + 2, s / n - 4, s / n - 4)
        }
        for (let k = 0; k < 14; k++) {
          g.fillStyle = `rgba(${rnd() < 0.5 ? '20,24,22' : '190,200,190'},0.07)`
          g.fillRect((c * s) / n + off + rnd() * (s / n), (r * s) / n + rnd() * (s / n), 3 + rnd() * 10, 2 + rnd() * 6)
        }
      }
    }
  }, { repeat: true })
}

/** A rug: a deep red field, a green border, a row of lozenges. */
function rugTex(light) {
  const w = light ? 256 : 512
  const h = Math.round(w * 0.62)
  const rnd = random(1871)
  return canvasTex(w, h, g => {
    g.fillStyle = '#6a2420'
    g.fillRect(0, 0, w, h)
    const b = w * 0.08
    g.fillStyle = '#1f3a2c'
    g.fillRect(0, 0, w, b)
    g.fillRect(0, h - b, w, b)
    g.fillRect(0, 0, b, h)
    g.fillRect(w - b, 0, b, h)
    g.strokeStyle = '#c9a050'
    g.lineWidth = w * 0.007
    g.strokeRect(b * 0.5, b * 0.5, w - b, h - b)
    g.strokeRect(b * 1.1, b * 1.1, w - b * 2.2, h - b * 2.2)
    const lozenge = (cx, cy, rx, ry, c) => {
      g.fillStyle = c
      g.beginPath()
      g.moveTo(cx - rx, cy)
      g.lineTo(cx, cy - ry)
      g.lineTo(cx + rx, cy)
      g.lineTo(cx, cy + ry)
      g.closePath()
      g.fill()
    }
    for (let i = 0; i < 5; i++) {
      const cx = w * (0.18 + i * 0.16)
      lozenge(cx, h / 2, w * 0.07, h * 0.28, i % 2 ? '#1f3a2c' : '#c9a050')
      lozenge(cx, h / 2, w * 0.035, h * 0.14, i % 2 ? '#c9a050' : '#6a2420')
    }
    for (let i = 0; i < 400; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,230,200,0.04)'
      g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 6)
    }
  })
}

/** Wall of the study: a sienna paper with a faint stripe (UVs in metres, 2 m to the tile). */
function paperTex(light) {
  const s = light ? 128 : 256
  return canvasTex(s, s, g => {
    g.fillStyle = '#6a4a38'
    g.fillRect(0, 0, s, s)
    for (let x = 0; x < s; x += s / 8) {
      g.fillStyle = 'rgba(40,20,10,0.16)'
      g.fillRect(x, 0, s / 40, s)
      g.fillStyle = 'rgba(210,150,100,0.07)'
      g.fillRect(x + s / 16, 0, s / 20, s)
    }
  }, { repeat: true })
}

/** Dark panelled wainscot (UVs in metres, 1 m to the tile): fielded panels. */
function panelTex() {
  return canvasTex(256, 256, g => {
    g.fillStyle = '#2a1a10'
    g.fillRect(0, 0, 256, 256)
    g.fillStyle = '#3c261a'
    g.fillRect(16, 16, 224, 224)
    g.strokeStyle = '#1a0f09'
    g.lineWidth = 6
    g.strokeRect(34, 34, 188, 188)
    g.strokeStyle = 'rgba(190,130,80,0.25)'
    g.lineWidth = 2
    g.strokeRect(38, 38, 180, 180)
  }, { repeat: true })
}

/** Glazed tiles: `c` the colour, a white-ish border line; UVs in metres, 1 m to the tile. */
function tileTex(c, grout, n = 6) {
  return canvasTex(256, 256, g => {
    const t = 256 / n
    g.fillStyle = grout
    g.fillRect(0, 0, 256, 256)
    for (let r = 0; r < n; r++) {
      for (let k = 0; k < n; k++) {
        g.fillStyle = c
        g.fillRect(k * t + 2, r * t + 2, t - 4, t - 4)
        const grd = g.createLinearGradient(k * t, r * t, k * t + t, r * t + t)
        grd.addColorStop(0, 'rgba(255,255,255,0.22)')
        grd.addColorStop(0.5, 'rgba(255,255,255,0)')
        grd.addColorStop(1, 'rgba(0,0,0,0.18)')
        g.fillStyle = grd
        g.fillRect(k * t + 2, r * t + 2, t - 4, t - 4)
      }
    }
  }, { repeat: true })
}

/** The Neva in a winter night, seen from the study: sky and stars, the far bank's long palace front with lit
 *  windows and a gold spire, the frozen river, the embankment's lamps and snow in the air. */
function nevaTex(light) {
  const w = light ? 768 : 1536
  const h = Math.round(w / 1.5)
  const rnd = random(1870)
  return canvasTex(w, h, g => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.55)
    sky.addColorStop(0, '#060a1e')
    sky.addColorStop(1, '#27345c')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(255,255,240,${0.25 + rnd() * 0.6})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h * 0.42, 0.6 + rnd() * 1.1, 0, TAU)
      g.fill()
    }
    // the far bank: a long low palace front, a gold needle and a dome
    const base = h * 0.56
    g.fillStyle = '#10141f'
    g.fillRect(0, base - h * 0.07, w, h * 0.5)
    let x = 0
    while (x < w) {
      const bw = w * (0.04 + rnd() * 0.05)
      const top = base - h * (0.06 + rnd() * 0.07)
      g.fillStyle = `rgb(${20 + rnd() * 10},${22 + rnd() * 10},${34 + rnd() * 10})`
      g.fillRect(x, top, bw + 1, base - top + h * 0.02)
      for (let wy = top + h * 0.012; wy < base - h * 0.01; wy += h * 0.022) {
        for (let wx = x + bw * 0.12; wx < x + bw * 0.88; wx += bw * 0.2) {
          g.fillStyle = rnd() < 0.3 ? 'rgba(255,196,110,0.85)' : 'rgba(18,22,36,0.9)'
          g.fillRect(wx, wy, bw * 0.09, h * 0.011)
        }
      }
      x += bw
    }
    g.fillStyle = '#2a2a36'
    g.beginPath()
    g.arc(w * 0.28, base - h * 0.1, w * 0.034, Math.PI, 0)
    g.fill()
    g.fillStyle = '#d8b25a'
    g.beginPath()
    g.moveTo(w * 0.7 - w * 0.004, base - h * 0.08)
    g.lineTo(w * 0.7, base - h * 0.27)
    g.lineTo(w * 0.7 + w * 0.004, base - h * 0.08)
    g.fill()
    // the frozen river and the snow, the embankment's parapet
    const ice = g.createLinearGradient(0, base, 0, h)
    ice.addColorStop(0, '#3a4868')
    ice.addColorStop(0.5, '#56668a')
    ice.addColorStop(1, '#8c9bb8')
    g.fillStyle = ice
    g.fillRect(0, base + h * 0.02, w, h)
    g.fillStyle = '#161a28'
    g.fillRect(0, h * 0.84, w, h * 0.04)
    g.fillStyle = '#aab6cc'
    g.fillRect(0, h * 0.88, w, h)
    // lamps along the near embankment and their glow on the snow
    for (let i = 0; i < 6; i++) {
      const lx = w * (0.07 + i * 0.17)
      g.fillStyle = '#12141c'
      g.fillRect(lx - 2, h * 0.7, 4, h * 0.15)
      const gl = g.createRadialGradient(lx, h * 0.69, 0, lx, h * 0.69, h * 0.17)
      gl.addColorStop(0, 'rgba(255,220,150,0.95)')
      gl.addColorStop(0.15, 'rgba(255,190,100,0.55)')
      gl.addColorStop(1, 'rgba(255,170,80,0)')
      g.fillStyle = gl
      g.fillRect(lx - h * 0.2, h * 0.5, h * 0.4, h * 0.45)
    }
    for (let i = 0; i < (light ? 150 : 400); i++) {
      g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 0.7 + rnd() * 1.6, 0, TAU)
      g.fill()
    }
  }, { mipmaps: false })
}

/** Freiberg in the evening, seen from the laboratory: snowy gables, chimneys with smoke, lit windows, a church
 *  tower with a lit clock under a dark sky. */
function freibergTex(light) {
  const w = light ? 768 : 1536
  const h = Math.round(w / 1.5)
  const rnd = random(1886)
  return canvasTex(w, h, g => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#0a1024')
    sky.addColorStop(0.6, '#2a3a5e')
    sky.addColorStop(1, '#4a4a60')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(255,255,240,${0.2 + rnd() * 0.5})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h * 0.4, 0.6 + rnd() * 0.9, 0, TAU)
      g.fill()
    }
    // the church tower and its spire
    const tx = w * 0.64
    g.fillStyle = '#14141e'
    g.fillRect(tx, h * 0.3, w * 0.05, h * 0.7)
    g.beginPath()
    g.moveTo(tx - w * 0.004, h * 0.3)
    g.lineTo(tx + w * 0.025, h * 0.08)
    g.lineTo(tx + w * 0.054, h * 0.3)
    g.fill()
    g.fillStyle = 'rgba(255,214,130,0.95)'
    g.beginPath()
    g.arc(tx + w * 0.025, h * 0.4, w * 0.011, 0, TAU)
    g.fill()
    // roofs: steep gables under snow, a few lit windows
    let x = -10
    while (x < w) {
      const bw = w * (0.07 + rnd() * 0.07)
      const wall = h * (0.66 + rnd() * 0.12)
      const peak = wall - h * (0.1 + rnd() * 0.08)
      g.fillStyle = `rgb(${24 + rnd() * 10},${26 + rnd() * 10},${38 + rnd() * 10})`
      g.fillRect(x, wall, bw, h)
      g.fillStyle = '#c4cfe0'
      g.beginPath()
      g.moveTo(x - 4, wall + 2)
      g.lineTo(x + bw / 2, peak)
      g.lineTo(x + bw + 4, wall + 2)
      g.lineTo(x + bw, wall + h * 0.012)
      g.lineTo(x + bw / 2, peak + h * 0.02)
      g.lineTo(x, wall + h * 0.012)
      g.fill()
      if (rnd() < 0.7) {
        g.fillStyle = '#1c1c28'
        g.fillRect(x + bw * (0.55 + rnd() * 0.2), peak + h * 0.02, bw * 0.08, h * 0.06)
      }
      for (let wy = wall + h * 0.04; wy < h * 0.96; wy += h * 0.07) {
        for (let wx = x + bw * 0.18; wx < x + bw * 0.8; wx += bw * 0.3) {
          g.fillStyle = rnd() < 0.35 ? 'rgba(255,196,110,0.9)' : 'rgba(14,18,32,0.9)'
          g.fillRect(wx, wy, bw * 0.12, h * 0.035)
        }
      }
      x += bw
    }
    for (let i = 0; i < (light ? 100 : 260); i++) {
      g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 0.7 + rnd() * 1.5, 0, TAU)
      g.fill()
    }
  }, { mipmaps: false })
}

/**
 * The hall. `windows`: [{ side, at, width, height, view: 'neva' | 'freiberg' }] (centre `at` along the wall, as
 * townhouse.js: x on the north wall, -x on the south, -z on the west, z on the east); `bookcases`:
 * [{ side, at, width }]; `rugs`: [{ x, z, w, d, rot }]; `stove`: { x, z, rot }; `gap`: the screen's opening.
 */
export function studyStage({
  light = false, x0 = -9.4, x1 = 9.4, z0 = -4.6, z1 = 4.6, h = 4.2, annex = 3.9, gap = { z0: -1.6, z1: 1.6 },
  windows = [], bookcases = [], rugs = [], stove = null,
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const tex = t => (textures.push(t), t)
  const geo = g => (geos.push(g), g)
  const soft = tex(softTexture())
  const flame = tex(flameTexture())

  const mats = {
    paper: new THREE.MeshStandardMaterial({ map: tex(paperTex(light)), color: '#ffffff', roughness: 0.9 }),
    wainscot: new THREE.MeshStandardMaterial({ map: tex(panelTex()), color: '#ffffff', roughness: 0.6 }),
    plaster: new THREE.MeshStandardMaterial({ color: '#8d8a7c', roughness: 0.95 }),
    labPlaster: new THREE.MeshStandardMaterial({ color: '#8f9a8c', roughness: 0.92 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#8a806c', roughness: 0.95 }),
    trim: new THREE.MeshStandardMaterial({ color: '#4a2e1c', roughness: 0.55 }),
    wood: new THREE.MeshStandardMaterial({ color: '#5a3722', roughness: 0.55 }),
    oak: new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#17110d', roughness: 0.9 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c49a4c', roughness: 0.3, metalness: 0.85 }),
    iron: new THREE.MeshStandardMaterial({ color: '#2e3034', roughness: 0.55, metalness: 0.7 }),
    stone: new THREE.MeshStandardMaterial({ color: '#8a867c', roughness: 0.6 }),
    snow: new THREE.MeshStandardMaterial({ color: '#8d9ab4', roughness: 0.9 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#2c5a3e', roughness: 0.95 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe2ea', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
  }

  // glazed tiles for the laboratory's dado: white above, green below
  const tileMat = new THREE.MeshStandardMaterial({ map: tex(tileTex('#cfdcd2', '#6a746c', 6)), color: '#a8b8ac', roughness: 0.25 })

  const fw = x1 - x0
  const fd = z1 - z0
  const planeUV = (w, d, rx, rz) => {
    const g = geo(new THREE.PlaneGeometry(w, d))
    const uv = g.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rx, uv.getY(i) * rz)
    return g
  }
  // ---- floors: walnut boards in the study, stone flags in the laboratory ----
  {
    const boards = tex(boardsTex(light))
    boards.repeat.set(1 / 4, 1 / 4)
    const w = annex - x0
    const f1 = new THREE.Mesh(planeUV(w, fd, w, fd), new THREE.MeshStandardMaterial({ map: boards, color: '#c8a888', roughness: 0.55 }))
    f1.rotation.x = -Math.PI / 2
    f1.position.set((x0 + annex) / 2, 0, (z0 + z1) / 2)
    const flags = tex(flagsTex(light))
    flags.repeat.set(1 / 2, 1 / 2)
    const w2 = x1 - annex
    const f2 = new THREE.Mesh(planeUV(w2, fd, w2, fd), new THREE.MeshStandardMaterial({ map: flags, color: '#b8c4bc', roughness: 0.5 }))
    f2.rotation.x = -Math.PI / 2
    f2.position.set((annex + x1) / 2, 0, (z0 + z1) / 2)
    group.add(f1, f2)
  }
  for (const r of rugs) {
    const m = new THREE.Mesh(geo(new THREE.PlaneGeometry(r.w, r.d)), new THREE.MeshStandardMaterial({ map: tex(rugTex(light)), color: '#c8b8b0', roughness: 0.95 }))
    m.rotation.x = -Math.PI / 2
    m.rotation.z = r.rot ?? 0
    m.position.set(r.x, 0.006, r.z)
    group.add(m)
  }
  {
    const c1 = new THREE.Mesh(geo(new THREE.PlaneGeometry(annex - x0, fd)), mats.ceiling)
    c1.rotation.x = Math.PI / 2
    c1.position.set((x0 + annex) / 2, h, (z0 + z1) / 2)
    const c2 = new THREE.Mesh(geo(new THREE.PlaneGeometry(x1 - annex, fd)), mats.labPlaster)
    c2.rotation.x = Math.PI / 2
    c2.position.set((annex + x1) / 2, h, (z0 + z1) / 2)
    group.add(c1, c2)
  }

  // ---- the walls, with their openings ----
  const sides = {
    n: { a0: x0, a1: x1, place: m => (m.position.set(0, 0, z0), (m.rotation.y = 0)), map: at => at },
    s: { a0: -x1, a1: -x0, place: m => (m.position.set(0, 0, z1), (m.rotation.y = Math.PI)), map: at => -at },
    w: { a0: -z1, a1: -z0, place: m => (m.position.set(x0, 0, 0), (m.rotation.y = Math.PI / 2)), map: at => -at },
    e: { a0: z0, a1: z1, place: m => (m.position.set(x1, 0, 0), (m.rotation.y = -Math.PI / 2)), map: at => at },
  }
  const onWall = (side, at, y, d = 0) => {
    const s = sides[side]
    const m = new THREE.Object3D()
    s.place(m)
    m.updateMatrix()
    return { pos: new THREE.Vector3(s.map(at), y, d).applyMatrix4(m.matrix), rot: m.rotation.y }
  }
  const WALL_T = 0.4
  const wins = windows.map(o => ({ width: 1.3, height: 2.3, ...o }))
  /** Where the laboratory begins along a side, in the side's own coordinate. */
  const splitAt = side => sides[side].map(annex)
  const wallMat = (side, a) => {
    // which material for the stretch around a (study paper or laboratory plaster)
    const x = side === 'n' || side === 's' ? sides[side].map(a) : side === 'w' ? x0 : x1
    return x > annex ? mats.labPlaster : mats.paper
  }
  for (const [name, s] of Object.entries(sides)) {
    const cuts = name === 'n' || name === 's' ? [s.a0, splitAt(name), s.a1].sort((p, q) => p - q) : [s.a0, s.a1]
    for (let i = 0; i < cuts.length - 1; i++) {
      const a0 = cuts[i]
      const a1 = cuts[i + 1]
      const shape = new THREE.Shape()
      shape.moveTo(a0, 0)
      shape.lineTo(a1, 0)
      shape.lineTo(a1, h)
      shape.lineTo(a0, h)
      shape.closePath()
      for (const o of wins.filter(q => q.side === name)) {
        const a = s.map(o.at)
        const p0 = a - o.width / 2
        const p1 = a + o.width / 2
        if (p0 < a0 || p1 > a1) continue
        const p = new THREE.Path()
        p.moveTo(p0, SILL)
        p.lineTo(p0, SILL + o.height)
        p.lineTo(p1, SILL + o.height)
        p.lineTo(p1, SILL)
        p.closePath()
        shape.holes.push(p)
      }
      const g = geo(new THREE.ShapeGeometry(shape))
      const uv = g.attributes.uv
      const pos = g.attributes.position
      for (let k = 0; k < uv.count; k++) uv.setXY(k, pos.getX(k) / 2, pos.getY(k) / 2)
      const mid = (a0 + a1) / 2
      const mat = name === 'w' ? mats.paper : name === 'e' ? mats.labPlaster : wallMat(name, mid)
      const wall = new THREE.Mesh(g, mat)
      s.place(wall)
      group.add(wall)
      // the lower part: dark wainscot in the study, glazed tiles in the laboratory
      const lab = mat === mats.labPlaster
      const wg = geo(new THREE.PlaneGeometry(a1 - a0, lab ? 1.45 : SILL - 0.02))
      const wuv = wg.attributes.uv
      for (let k = 0; k < wuv.count; k++) wuv.setXY(k, wuv.getX(k) * (a1 - a0), wuv.getY(k) * (lab ? 1.45 : SILL - 0.02))
      const strip = new THREE.Mesh(wg, lab ? tileMat : mats.wainscot)
      strip.position.set((a0 + a1) / 2, (lab ? 1.45 : SILL - 0.02) / 2, 0.012)
      const anchor = new THREE.Group()
      s.place(anchor)
      anchor.add(strip)
      // the rail on top, and the cornice
      const rail = new THREE.Mesh(geo(new THREE.BoxGeometry(a1 - a0, 0.07, 0.09)), lab ? mats.iron : mats.trim)
      rail.position.set((a0 + a1) / 2, (lab ? 1.45 : SILL) + (lab ? 0.02 : 0.035), 0.045)
      const corn = new THREE.Mesh(geo(new THREE.BoxGeometry(a1 - a0, 0.2, 0.16)), lab ? mats.labPlaster : mats.trim)
      corn.position.set((a0 + a1) / 2, h - 0.1, 0.08)
      anchor.add(rail, corn)
      group.add(anchor)
    }
  }

  // ---- the windows ----
  const windowGlass = []
  const sash = mats.oak
  for (const o of wins) {
    const s = sides[o.side]
    const a = s.map(o.at)
    const anchor = new THREE.Group()
    s.place(anchor)
    group.add(anchor)
    const lab = o.view === 'freiberg'
    // the reveal round the hole
    for (const [bw, bh, x, y] of [
      [o.width + 0.02, 0.05, a, SILL + o.height],
      [o.width + 0.02, 0.05, a, SILL],
      [0.05, o.height, a - o.width / 2, SILL + o.height / 2],
      [0.05, o.height, a + o.width / 2, SILL + o.height / 2],
    ]) {
      const m = new THREE.Mesh(geo(new THREE.BoxGeometry(bw, bh, WALL_T)), mats.trim)
      m.position.set(x, y, -WALL_T / 2)
      anchor.add(m)
    }
    // the casements: a frame, bars, glass
    const fw0 = o.width - 0.04
    const fh0 = o.height - 0.04
    const fr = new THREE.Group()
    fr.position.set(a, SILL + o.height / 2, -WALL_T * 0.55)
    const bar = (w, hh, x, y) => {
      const m = new THREE.Mesh(geo(new THREE.BoxGeometry(w, hh, 0.05)), sash)
      m.position.set(x, y, 0)
      fr.add(m)
    }
    bar(fw0, 0.06, 0, fh0 / 2 - 0.03)
    bar(fw0, 0.06, 0, -fh0 / 2 + 0.03)
    bar(0.06, fh0, -fw0 / 2 + 0.03, 0)
    bar(0.06, fh0, fw0 / 2 - 0.03, 0)
    bar(0.05, fh0, 0, 0)
    bar(fw0, 0.04, 0, fh0 * 0.2)
    bar(fw0, 0.04, 0, -fh0 * 0.1)
    bar(fw0, 0.04, 0, -fh0 * 0.34)
    const gl = new THREE.Mesh(geo(new THREE.PlaneGeometry(fw0, fh0)), mats.glass)
    gl.renderOrder = 3
    fr.add(gl)
    anchor.add(fr)
    // the sill, with snow on its outer edge
    const sill = new THREE.Mesh(geo(new THREE.BoxGeometry(o.width + 0.3, 0.06, 0.3)), mats.trim)
    sill.position.set(a, SILL - 0.03, 0.06)
    anchor.add(sill)
    const snow = new THREE.Mesh(geo(new THREE.BoxGeometry(o.width, 0.07, 0.2)), mats.snow)
    snow.position.set(a, SILL + 0.035, -WALL_T + 0.08)
    anchor.add(snow)
    // the view: a picture of the night a few metres behind the glass
    const vw = 8
    const vh = 5.3
    const pic = new THREE.Mesh(geo(new THREE.PlaneGeometry(vw, vh)), new THREE.MeshBasicMaterial({ map: tex(lab ? freibergTex(light) : nevaTex(light)), fog: false, color: '#c4c8d8' }))
    pic.position.set(a, SILL + o.height / 2 + 0.2, -WALL_T - 4.6)
    pic.rotation.y = 0
    anchor.add(pic)
    // the room's window light on the floor: a soft blue patch
    const patch = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(o.width * 0.9, 1.9)),
      new THREE.MeshBasicMaterial({ map: soft, color: new THREE.Color(lab ? '#9ab8d8' : '#8fa6e0').multiplyScalar(0.34), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    patch.rotation.x = -Math.PI / 2
    const pp = onWall(o.side, o.at, 0.02, 1.3).pos
    patch.position.copy(pp)
    patch.rotation.z = -onWall(o.side, o.at, 0, 0).rot
    group.add(patch)
    windowGlass.push(gl)
  }

  // ---- the glazed screen between the study and the laboratory, with its opening ----
  const solids = roomWalls(x0, x1, z0, z1)
  {
    const sh = h
    const post = (z, w = 0.22) => {
      const m = new THREE.Mesh(geo(new THREE.BoxGeometry(0.24, sh, w)), mats.trim)
      m.position.set(annex, sh / 2, z)
      group.add(m)
    }
    const run = (za, zb) => {
      // a glazed run: posts, a sill rail, a head rail, mullions, glass
      const len = zb - za
      const zc = (za + zb) / 2
      for (const [y, hh] of [[0.45, 0.9], [sh - 0.2, 0.4]]) {
        const m = new THREE.Mesh(geo(new THREE.BoxGeometry(0.2, hh, len)), mats.wainscot)
        m.position.set(annex, y, zc)
        group.add(m)
      }
      const n = Math.max(1, Math.round(len / 0.9))
      for (let i = 1; i < n; i++) {
        const m = new THREE.Mesh(geo(new THREE.BoxGeometry(0.1, sh - 1.3, 0.07)), mats.trim)
        m.position.set(annex, 0.9 + (sh - 1.3) / 2, za + (len * i) / n)
        group.add(m)
      }
      const bars = new THREE.Mesh(geo(new THREE.BoxGeometry(0.1, 0.05, len)), mats.trim)
      bars.position.set(annex, 2.0, zc)
      group.add(bars)
      const gl = new THREE.Mesh(geo(new THREE.PlaneGeometry(len, sh - 1.3)), mats.glass)
      gl.rotation.y = Math.PI / 2
      gl.position.set(annex, 0.9 + (sh - 1.3) / 2, zc)
      gl.renderOrder = 3
      group.add(gl)
      solids.push(box(annex, zc, 0.3, len))
    }
    run(z0, gap.z0)
    run(gap.z1, z1)
    post(gap.z0)
    post(gap.z1)
    // above the opening, a lintel with the year
    const lintel = new THREE.Mesh(geo(new THREE.BoxGeometry(0.26, sh - 2.7, gap.z1 - gap.z0 + 0.24)), mats.wainscot)
    lintel.position.set(annex, 2.7 + (sh - 2.7) / 2, (gap.z0 + gap.z1) / 2)
    group.add(lintel)
  }

  // ---- a tiled stove ----
  if (stove) {
    const g = new THREE.Group()
    g.position.set(stove.x, 0, stove.z)
    g.rotation.y = stove.rot ?? 0
    const tiles = tex(tileTex('#2f6b4c', '#d8d4c0', 5))
    tiles.repeat.set(0.9, 1.8)
    const tileM = new THREE.MeshStandardMaterial({ map: tiles, color: '#ffffff', roughness: 0.25, metalness: 0.05 })
    const white = new THREE.MeshStandardMaterial({ color: '#cfcab8', roughness: 0.4 })
    const base = new THREE.Mesh(geo(new THREE.BoxGeometry(1.2, 0.3, 1.2)), white)
    base.position.y = 0.15
    const shaft = new THREE.Mesh(geo(new THREE.BoxGeometry(1.08, 2.5, 1.08)), tileM)
    shaft.position.y = 0.3 + 1.25
    const band = new THREE.Mesh(geo(new THREE.BoxGeometry(1.18, 0.12, 1.18)), white)
    band.position.y = 1.35
    const cap = new THREE.Mesh(geo(new THREE.BoxGeometry(1.2, 0.22, 1.2)), white)
    cap.position.y = 2.9
    const cap2 = new THREE.Mesh(geo(new THREE.BoxGeometry(0.96, 0.3, 0.96)), white)
    cap2.position.y = 3.15
    const door = new THREE.Mesh(geo(new THREE.BoxGeometry(0.42, 0.34, 0.03)), mats.iron)
    door.position.set(0, 0.62, 0.55)
    const ember = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.28, 0.06)), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(1.6) }))
    ember.position.set(0, 0.62, 0.572)
    g.add(base, shaft, band, cap, cap2, door, ember)
    group.add(g)
    solids.push(box(stove.x, stove.z, 1.3, 1.3))
  }

  // ---- bookcases: open shelves of leather-bound books and a few boxed specimens ----
  {
    const spines = []
    for (const b of bookcases) {
      const s = sides[b.side]
      const anchor = new THREE.Group()
      s.place(anchor)
      group.add(anchor)
      const a = s.map(b.at)
      const bh = b.height ?? 3.1
      const dd = 0.4
      const carc = (w, hh, d, x, y, z) => {
        const m = new THREE.Mesh(geo(new THREE.BoxGeometry(w, hh, d)), mats.wood)
        m.position.set(x, y, z)
        anchor.add(m)
      }
      carc(b.width, 0.06, dd, a, bh - 0.03, dd / 2)
      carc(b.width + 0.1, 0.1, dd + 0.08, a, bh + 0.05, dd / 2 + 0.02)
      carc(b.width, 0.6, dd, a, 0.3, dd / 2)
      carc(0.05, bh, dd, a - b.width / 2 + 0.025, bh / 2, dd / 2)
      carc(0.05, bh, dd, a + b.width / 2 - 0.025, bh / 2, dd / 2)
      carc(b.width, bh, 0.02, a, bh / 2, 0.01)
      const shelves = 6
      const sy0 = 0.6
      const step = (bh - 0.1 - sy0) / shelves
      for (let k = 0; k <= shelves; k++) carc(b.width - 0.08, 0.03, dd - 0.04, a, sy0 + k * step, dd / 2)
      const rnd = random(Math.round(b.at * 100) + 11)
      for (let k = 0; k < shelves; k++) {
        let x = a - b.width / 2 + 0.07
        while (x < a + b.width / 2 - 0.11) {
          const t = 0.03 + rnd() * 0.04
          const bkH = step * (0.6 + rnd() * 0.32)
          spines.push({ anchor, x: x + t / 2, y: sy0 + k * step + 0.015 + bkH / 2, z: dd * 0.5, w: t, h: bkH, d: dd * (0.6 + rnd() * 0.25), c: rnd() })
          x += t + 0.003
          if (rnd() < 0.05) x += 0.07
        }
      }
      const c = onWall(b.side, b.at, 0, dd / 2).pos
      const along = b.side === 'n' || b.side === 's'
      solids.push(box(c.x, c.z, along ? b.width : dd + 0.1, along ? dd + 0.1 : b.width))
    }
    if (spines.length) {
      const leather = ['#5a2a1e', '#6e3a22', '#3c2a1c', '#2a3a2a', '#7a5a32', '#4a1e1a', '#5e4a30', '#2c2a3a', '#7a6a4a']
      const books = new THREE.InstancedMesh(geo(new THREE.BoxGeometry(1, 1, 1)), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 }), spines.length)
      const col = new THREE.Color()
      spines.forEach((sp, i) => {
        sp.anchor.updateMatrix()
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(sp.x, sp.y, sp.z).applyMatrix4(sp.anchor.matrix),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sp.anchor.rotation.y, 0)),
          new THREE.Vector3(sp.w, sp.h, sp.d),
        )
        books.setMatrixAt(i, m)
        books.setColorAt(i, col.set(leather[Math.floor(sp.c * leather.length)]))
      })
      group.add(books)
    }
  }

  // ---- lamps: an oil lamp with a glass chimney, a gas lamp on a bracket ----
  const lamps = []
  const flameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const gasFlameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#d8f0ff').multiplyScalar(2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const haloMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffb060').multiplyScalar(0.9), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
  const gasHaloMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#bfe4ff').multiplyScalar(0.7), transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
  const chimneyMat = new THREE.MeshStandardMaterial({ color: '#ffe8c0', roughness: 0.1, transparent: true, opacity: 0.22, depthWrite: false, emissive: '#7a4a20', emissiveIntensity: 0.4 })
  const lampBase = geo(new THREE.LatheGeometry([[0, 0], [0.09, 0], [0.1, 0.02], [0.04, 0.06], [0.035, 0.2], [0.1, 0.24], [0.115, 0.3], [0.08, 0.36], [0.03, 0.38]].map(([x, y]) => new THREE.Vector2(x, y)), 20))
  const chimneyGeo = geo(new THREE.LatheGeometry([[0.035, 0], [0.05, 0.05], [0.04, 0.12], [0.035, 0.28], [0.04, 0.3]].map(([x, y]) => new THREE.Vector2(x, y)), 14))
  /** An oil lamp at (x, y, z) (y the table); `glow`: the real light's strength. */
  function oilLamp(x, y, z, { glow = 3, reach = 9, shade = true } = {}) {
    const g = new THREE.Group()
    const base = new THREE.Mesh(lampBase, mats.brass)
    const chim = new THREE.Mesh(chimneyGeo, chimneyMat)
    chim.position.y = 0.36
    const f = new THREE.Sprite(flameMat)
    f.center.set(0.5, 0.1)
    f.position.y = 0.4
    const halo = new THREE.Sprite(haloMat)
    halo.position.y = 0.5
    halo.scale.setScalar(0.9)
    g.add(base, chim, f, halo)
    if (shade) {
      const sh = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.1, 0.19, 0.17, 18, 1, true)), new THREE.MeshStandardMaterial({ color: '#2c6a4a', roughness: 0.4, emissive: '#1c4a30', emissiveIntensity: 0.5, side: THREE.DoubleSide }))
      sh.position.y = 0.6
      g.add(sh)
    }
    g.position.set(x, y, z)
    group.add(g)
    const pl = new THREE.PointLight('#ffb36a', glow, reach, 1.5)
    pl.position.set(x, y + 0.62, z)
    group.add(pl)
    lamps.push({ f, pl, glow, seed: Math.random() * 100, size: 0.03 })
    return g
  }
  /** A gas lamp on a bracket at (x, y, z): a pale, steady light with a faint hiss of flicker. */
  function gasLamp(x, y, z, { glow = 3, reach = 9 } = {}) {
    const g = new THREE.Group()
    const arm = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.014, 0.014, 0.5, 8)), mats.brass)
    arm.rotation.z = Math.PI / 2
    arm.position.x = 0.25
    const globe = new THREE.Mesh(geo(new THREE.SphereGeometry(0.14, 18, 14)), new THREE.MeshStandardMaterial({ color: '#f2f6ff', roughness: 0.15, transparent: true, opacity: 0.4, emissive: '#7a8aa0', emissiveIntensity: 0.6, depthWrite: false }))
    globe.position.set(0.52, -0.1, 0)
    const f = new THREE.Sprite(gasFlameMat)
    f.center.set(0.5, 0.1)
    f.position.set(0.52, -0.2, 0)
    const halo = new THREE.Sprite(gasHaloMat)
    halo.position.set(0.52, -0.1, 0)
    halo.scale.setScalar(0.55)
    g.add(arm, globe, f, halo)
    g.position.set(x, y, z)
    group.add(g)
    const pl = new THREE.PointLight('#cfe6ff', glow, reach, 1.5)
    pl.position.set(x + 0.52, y - 0.1, z)
    group.add(pl)
    lamps.push({ f, pl, glow, seed: Math.random() * 100, size: 0.03, gas: true })
    return g
  }

  // dust in the lamplight
  const dust = motes({ count: 220, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: h - 0.5, color: '#ffe2b8', size: 0.02, opacity: 0.26, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  dust.group.scale.x = fw / fd
  group.add(dust.group)

  // a fill so nothing is pitch black, and the snow-light through the windows
  group.add(new THREE.HemisphereLight('#3a4468', '#2a1c14', light ? 1.1 : 0.85))

  return {
    group,
    mats,
    solids,
    onWall,
    oilLamp,
    gasLamp,
    soft,
    flame,
    tex,
    geo,
    annex,
    gap,
    sides,
    env: {
      background: new THREE.Color('#07060a'),
      fog: new THREE.Fog('#0a0810', 16, 46),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.4, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
      for (const l of lamps) {
        const k = 1 + Math.sin(t * (l.gas ? 17 : 11) + l.seed) * (l.gas ? 0.025 : 0.06) + Math.sin(t * 23.7 + l.seed * 2) * (l.gas ? 0.015 : 0.05)
        l.f.scale.set(l.size * (2 - k), l.size * 2.3 * k, 1)
        l.pl.intensity = l.glow * (0.93 + (k - 1) * 1.2)
      }
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
