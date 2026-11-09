// A stage for picture rooms (docs/knowledge/picture-rooms.md): a laboratory at Bell Telephone Laboratories,
// Murray Hill, New Jersey, on a snowy evening in the week before Christmas 1947. A room of the 1940s, older
// than stages/lab.js (the 1980s) and younger than stages/mcgill.js (1900): a floor of mottled brown linoleum,
// plaster walls painted cream over a dark green glossy dado, deal benches with black bakelite tops, factory
// windows of steel in small panes onto a snowy car park under lamps (the snow falling), conical green enamel
// pendant lamps with warm bulbs, paper chains for Christmas, a wall clock, a calendar of the month. Every big
// surface mid-toned (pale ones bloom to white). Walking inside x0..x1, z0..z1; the scene adds its apparatus.
// Gives `mats` (wood, deal, bakelite, steel, brass, paint, cream, cloth, glass, rubber), `shine` (what metal
// reflects), `onWall(obj, side, at, y, out)`, `bench(x, z, w, d, { rot })` (a laboratory bench, top at
// BENCH_TOP), `tubeRack({ tubes })` (a relay rack of tube amplifiers with glowing tubes), `lamps`, `soft`.
// A 1940s electronics laboratory can use it (the other halls of the Bell System, a radar shack).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box, roomWalls } from '../../../engine/collide.js'

export const BENCH_TOP = 0.92
export const BULB = '#ffd49a'
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

/** Mottled brown linoleum in 12 inch squares, four by four to the texture. */
function floorTex(light) {
  const n = 4
  const px = light ? 64 : 128
  const rnd = random(23)
  return canvasTex(n * px, n * px, (g, w, h) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const k = 0.9 + rnd() * 0.16
        g.fillStyle = `rgb(${Math.round(112 * k)},${Math.round(92 * k)},${Math.round(70 * k)})`
        g.fillRect(i * px, j * px, px, px)
        for (let s = 0; s < px * 2.2; s++) {
          const d = rnd()
          g.fillStyle = d < 0.4 ? 'rgba(60,46,32,0.5)' : d < 0.75 ? 'rgba(150,126,92,0.45)' : 'rgba(88,98,72,0.4)'
          g.fillRect(i * px + rnd() * px, j * px + rnd() * px, 1 + rnd() * 3, 1 + rnd() * 2)
        }
        g.strokeStyle = 'rgba(40,30,20,0.55)'
        g.lineWidth = 1
        g.strokeRect(i * px + 0.5, j * px + 0.5, px - 1, px - 1)
      }
    }
  }, { repeat: true })
}

/** Cream plaster, one tile 1 m square, a little mottled. */
function plasterTex(light) {
  const s = light ? 128 : 256
  const rnd = random(31)
  return canvasTex(s, s, (g, w, h) => {
    g.fillStyle = '#b9b08e'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 700; i++) {
      g.fillStyle = rnd() < 0.5 ? `rgba(90,82,60,${0.05 + rnd() * 0.07})` : `rgba(230,224,196,${0.05 + rnd() * 0.07})`
      g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 4)
    }
  }, { repeat: true })
}

/** Glossy dark green dado paint with the streak of a brush. */
function dadoTex() {
  const rnd = random(37)
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#34503f'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(20,34,26,0.14)' : 'rgba(110,150,120,0.1)'
      g.fillRect(rnd() * w, rnd() * h, 14 + rnd() * 50, 1)
    }
  }, { repeat: true })
}

/** Bakelite black with a faint sheen, a bench top. */
function topTex() {
  const rnd = random(43)
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#1e1b19'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 300; i++) {
      g.fillStyle = rnd() < 0.6 ? 'rgba(80,74,66,0.2)' : 'rgba(0,0,0,0.25)'
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 5, 1)
    }
  }, { repeat: true })
}

/** The car park on a snowy night through a window: a dark low sky, lamps on posts with their halos, parked
 *  cars as dark shapes under snow, a line of bare trees, snow on the ground. `seed` varies it. */
function viewTex(seed) {
  const rnd = random(seed)
  const w = 256
  const h = 256
  return canvasTex(w, h, g => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.62)
    sky.addColorStop(0, '#0a1128')
    sky.addColorStop(1, '#2a3664')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    const horizon = h * 0.58
    // trees against the sky
    g.fillStyle = '#0d1226'
    for (let x = 0; x < w; x += 7 + rnd() * 9) {
      const th = 12 + rnd() * 34
      g.fillRect(x, horizon - th, 2, th)
      g.beginPath()
      g.arc(x + 1, horizon - th, 4 + rnd() * 5, 0, TAU)
      g.fill()
    }
    // the snow on the ground, lit in pools under the lamps
    const ground = g.createLinearGradient(0, horizon, 0, h)
    ground.addColorStop(0, '#586180')
    ground.addColorStop(1, '#7a84a4')
    g.fillStyle = ground
    g.fillRect(0, horizon, w, h - horizon)
    for (const lx of [w * (0.2 + rnd() * 0.1), w * (0.65 + rnd() * 0.2)]) {
      const halo = g.createRadialGradient(lx, horizon + 24, 0, lx, horizon + 24, 70)
      halo.addColorStop(0, 'rgba(255,214,150,0.55)')
      halo.addColorStop(1, 'rgba(255,214,150,0)')
      g.fillStyle = halo
      g.fillRect(lx - 70, horizon - 46, 140, 140)
      g.fillStyle = '#10141f'
      g.fillRect(lx - 1.5, horizon - 52, 3, 54)
      g.fillStyle = '#ffe2a8'
      g.beginPath()
      g.arc(lx, horizon - 54, 4, 0, TAU)
      g.fill()
    }
    // cars under snow
    for (let i = 0; i < 4; i++) {
      const cx = 20 + i * 62 + rnd() * 18
      const cy = horizon + 14 + rnd() * 30
      g.fillStyle = '#161a2c'
      g.fillRect(cx, cy, 34, 11)
      g.fillStyle = '#9aa4c4'
      g.fillRect(cx + 7, cy - 6, 20, 7)
      g.fillStyle = '#161a2c'
      g.fillRect(cx + 9, cy - 4, 16, 5)
    }
    for (let i = 0; i < 100; i++) {
      g.fillStyle = `rgba(226,234,255,${0.3 + rnd() * 0.5})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 0.7 + rnd() * 1.4, 0, TAU)
      g.fill()
    }
  })
}

/** The face of a wall clock, black numerals on white, for a time (hours, minutes). */
function clockTex(hr, mn) {
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#e8e2cc'
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2 - 2, 0, TAU)
    g.fill()
    g.strokeStyle = '#2a2622'
    g.fillStyle = '#2a2622'
    g.lineWidth = 6
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2 - 6, 0, TAU)
    g.stroke()
    g.font = '700 30px Outfit'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * TAU - Math.PI / 2
      g.fillText(String(i), w / 2 + Math.cos(a) * w * 0.38, w / 2 + Math.sin(a) * w * 0.38)
    }
    const hand = (ang, len, width) => {
      g.lineWidth = width
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(w / 2, w / 2)
      g.lineTo(w / 2 + Math.sin(ang) * len, w / 2 - Math.cos(ang) * len)
      g.stroke()
    }
    hand(((hr % 12) + mn / 60) / 12 * TAU, w * 0.24, 9)
    hand((mn / 60) * TAU, w * 0.36, 6)
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
 * The laboratory. `lamps`: [{ x, z, light }] pendant lamps (light: a real point light of that intensity,
 * on a few only); `windows`: [{ side, at, width }] factory windows onto the snow; `door`: { side, at } (a
 * door that stays shut); `chains`: paper chains for Christmas; `clock`: { side, at, y, hour, minute }.
 */
export function bellLabsStage({
  light = false, x0 = -6.5, x1 = 6.5, z0 = -6, z1 = 6.2, h = 3.5, dado = 1.25,
  lamps = [], windows = [], door = null, chains = true, clock = null,
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
    grd.addColorStop(0.45, '#6a5c48')
    grd.addColorStop(0.55, '#3a342a')
    grd.addColorStop(1, '#0c0a08')
    g.fillStyle = grd
    g.fillRect(0, 0, w, hh)
    for (const [x, y, r] of [[0.1, 0.3, 9], [0.36, 0.28, 11], [0.62, 0.3, 9], [0.88, 0.32, 8]]) {
      const c = g.createRadialGradient(x * w, y * hh, 0, x * w, y * hh, r)
      c.addColorStop(0, 'rgba(255,240,210,1)')
      c.addColorStop(1, 'rgba(255,200,120,0)')
      g.fillStyle = c
      g.fillRect(x * w - r, y * hh - r, r * 2, r * 2)
    }
    g.fillStyle = '#26345c'
    g.fillRect(w * 0.2, hh * 0.18, w * 0.08, hh * 0.3)
    g.fillRect(w * 0.7, hh * 0.18, w * 0.08, hh * 0.3)
  }, { mipmaps: false }))
  shine.mapping = THREE.EquirectangularReflectionMapping
  const topMap = tex(topTex())
  const mats = {
    wood: new THREE.MeshStandardMaterial({ color: '#6b4a30', roughness: 0.6, metalness: 0.04 }),
    deal: new THREE.MeshStandardMaterial({ color: '#a07c52', roughness: 0.7 }),
    bakelite: new THREE.MeshStandardMaterial({ color: '#1a1614', roughness: 0.32, metalness: 0.1, envMap: shine, envMapIntensity: 0.5 }),
    top: new THREE.MeshStandardMaterial({ map: topMap, roughness: 0.4, metalness: 0.1, envMap: shine, envMapIntensity: 0.3 }),
    steel: new THREE.MeshStandardMaterial({ color: '#a9aeb2', roughness: 0.34, metalness: 0.85, envMap: shine, envMapIntensity: 0.9 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.3, metalness: 0.85, envMap: shine, envMapIntensity: 1.0 }),
    paint: new THREE.MeshStandardMaterial({ color: '#7d8478', roughness: 0.55, metalness: 0.15 }),
    cream: new THREE.MeshStandardMaterial({ color: '#b9ad8c', roughness: 0.6 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#7a6a4c', roughness: 0.95 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#242220', roughness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: '#d8ecee', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.2, depthWrite: false, envMap: shine, envMapIntensity: 1.1, side: THREE.DoubleSide }),
  }
  mats.top.map.repeat.set(2, 2)

  // ---- floor and ceiling ----
  const fl = tex(floorTex(light))
  fl.repeat.set(1 / 1.22, 1 / 1.22)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  {
    const uv = floorGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fw, uv.getY(i) * fd)
  }
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: fl, roughness: 0.45, metalness: 0.05, color: '#d2c4aa', envMap: shine, envMapIntensity: 0.25 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: '#7e7860', roughness: 0.95 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  // conduit and a cable tray across the ceiling, as a laboratory of the time wired itself
  for (const [x, w, mat] of [[-3.2, 0.05, mats.steel], [0.6, 0.05, mats.steel], [3.8, 0.34, mats.paint]]) {
    const run = new THREE.Mesh(w > 0.1 ? new THREE.BoxGeometry(w, 0.06, fd) : new THREE.CylinderGeometry(w, w, fd, 8), mat)
    if (w <= 0.1) run.rotation.x = Math.PI / 2
    run.position.set(x, h - 0.1, (z0 + z1) / 2)
    group.add(run)
  }

  // ---- walls: green dado, plaster above, windows cut as openings of colour (the window is a frame on the wall)
  const pl = tex(plasterTex(light))
  const dd = tex(dadoTex())
  const plMat = new THREE.MeshStandardMaterial({ map: pl, roughness: 0.9 })
  const dadoMat = new THREE.MeshStandardMaterial({ map: dd, roughness: 0.32, metalness: 0.05, envMap: shine, envMapIntensity: 0.3 })
  const sides = { n: [x0, x1, z0, 0], s: [-x1, -x0, z1, Math.PI], w: [-z1, -z0, x0, Math.PI / 2], e: [z0, z1, x1, -Math.PI / 2] }
  for (const [side, [a0, a1, p, rot]] of Object.entries(sides)) {
    const x = side === 'n' || side === 's' ? 0 : p
    const z = side === 'n' || side === 's' ? p : 0
    for (const [y0, y1, mat] of [[0, dado, dadoMat], [dado, h, plMat]]) {
      const m = new THREE.Mesh(wallPiece(a0, a1, y0, y1), mat)
      m.position.set(x, 0, z)
      m.rotation.y = rot
      group.add(m)
    }
    // the dado rail and a skirting board, along the whole wall
    for (const [yy, hh, dp, mat] of [[dado, 0.06, 0.05, mats.wood], [0.07, 0.14, 0.03, mats.wood]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(a1 - a0, hh, dp), mat)
      m.position.set((a0 + a1) / 2, yy, dp / 2)
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

  // ---- windows: tall steel factory windows in small panes, the snowy car park behind, snow falling ----
  const flakes = []
  const flakeZone = []
  for (const [i, wd] of windows.entries()) {
    const ww = wd.width ?? 1.4
    const wh = wd.height ?? 1.9
    const win = new THREE.Group()
    const view = tex(viewTex(5 + i * 13))
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ map: view }))
    sky.position.z = 0.006
    win.add(sky)
    const cols = 3
    const rows = 5
    const bar = (bw, bh, bx, by, dz = 0.03) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.06), mats.paint)
      b.position.set(bx, by, dz)
      win.add(b)
    }
    bar(ww + 0.12, 0.07, 0, wh / 2)
    bar(ww + 0.12, 0.07, 0, -wh / 2)
    bar(0.07, wh + 0.07, -ww / 2, 0)
    bar(0.07, wh + 0.07, ww / 2, 0)
    for (let c = 1; c < cols; c++) bar(0.035, wh, -ww / 2 + (c * ww) / cols, 0)
    for (let r = 1; r < rows; r++) bar(ww, 0.035, 0, -wh / 2 + (r * wh) / rows)
    const sill = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.3, 0.05, 0.22), mats.wood)
    sill.position.set(0, -wh / 2 - 0.05, 0.1)
    win.add(sill)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), mats.glass)
    pane.position.z = 0.02
    pane.renderOrder = 2
    win.add(pane)
    onWall(win, wd.side, wd.at, wd.y ?? 2.05, 0.012)
    // the snow in front of the picture, in a slab just outside this window (world coordinates)
    const out = 0.8
    const cx = wd.side === 'w' ? x0 - out / 2 : wd.side === 'e' ? x1 + out / 2 : wd.at
    const cz = wd.side === 'n' ? z0 - out / 2 : wd.side === 's' ? z1 + out / 2 : wd.at
    flakeZone.push({ cx, cz, w: wd.side === 'n' || wd.side === 's' ? ww : out, d: wd.side === 'n' || wd.side === 's' ? out : ww, y: wd.y ?? 2.05, h: wh })
  }
  const perWindow = light ? 14 : 34
  const flakeN = flakeZone.length * perWindow
  const flakePos = new Float32Array(flakeN * 3)
  const flakeSeed = new Float32Array(flakeN)
  for (let i = 0; i < flakeN; i++) flakeSeed[i] = Math.random() * 100
  let snow = null
  if (flakeN) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3))
    snow = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#e6ecff', size: 0.045, map: soft, transparent: true, opacity: 0.85, depthWrite: false }))
    snow.frustumCulled = false
    group.add(snow)
  }

  // ---- a door that stays shut ----
  if (door) {
    const d = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 0.08), mats.wood)
    frame.position.y = 1.15
    const leaf = new THREE.Mesh(new RoundedBoxGeometry(1.02, 2.2, 0.06, 2, 0.01), mats.deal)
    leaf.position.set(0, 1.1, 0.04)
    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.9), new THREE.MeshBasicMaterial({ color: '#1a2036' }))
    glassPane.position.set(0, 1.6, 0.075)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), mats.brass)
    knob.position.set(-0.4, 1.0, 0.11)
    d.add(frame, leaf, glassPane, knob)
    onWall(d, door.side, door.at, 0, 0.02)
  }

  // ---- a wall clock and the month's calendar ----
  if (clock) {
    const c = new THREE.Group()
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 28), mats.bakelite)
    rim.rotation.x = Math.PI / 2
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.18, 28), new THREE.MeshBasicMaterial({ map: tex(clockTex(clock.hour ?? 5, clock.minute ?? 20)) }))
    face.position.z = 0.028
    c.add(rim, face)
    onWall(c, clock.side, clock.at, clock.y ?? 2.6, 0.03)
  }

  // ---- pendant lamps: a rod, a green enamel cone, white inside, a warm bulb ----
  const lampLights = []
  {
    const cone = new THREE.ConeGeometry(0.3, 0.2, 24, 1, true)
    const outer = new THREE.MeshStandardMaterial({ color: '#2f5a44', roughness: 0.35, metalness: 0.2, side: THREE.DoubleSide, envMap: shine, envMapIntensity: 0.5 })
    const bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(BULB).multiplyScalar(1.4) })
    const glowMat = new THREE.MeshBasicMaterial({ color: '#ffd9a0', map: soft, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
    for (const l of lamps) {
      const g = new THREE.Group()
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.75, 6), mats.paint)
      rod.position.y = h - 0.375
      const shade = new THREE.Mesh(cone, outer)
      shade.position.y = h - 0.85
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), bulbMat)
      bulb.position.y = h - 0.9
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), glowMat)
      halo.position.y = h - 1.1
      halo.rotation.x = -Math.PI / 2
      g.add(rod, shade, bulb, halo)
      g.position.set(l.x, 0, l.z)
      group.add(g)
      if (l.light) {
        const pl = new THREE.PointLight(BULB, l.light, 11, 1.5)
        pl.position.set(l.x, h - 1.1, l.z)
        group.add(pl)
        lampLights.push(pl)
      }
    }
  }

  // ---- paper chains: loops of coloured paper festooned between the lamps ----
  if (chains) {
    const link = new THREE.TorusGeometry(0.05, 0.012, 5, 14)
    const cols = ['#b8333a', '#2f7a46', '#d4a63a', '#e8e0cc']
    const make = (a, b, sag) => {
      const mid = a.clone().add(b).multiplyScalar(0.5)
      mid.y -= sag
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const n = Math.round(a.distanceTo(b) / 0.09)
      const im = new THREE.InstancedMesh(link, new THREE.MeshStandardMaterial({ roughness: 0.8 }), n)
      const o = new THREE.Object3D()
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1)
        o.position.copy(curve.getPoint(t))
        o.rotation.set(0, i % 2 ? Math.PI / 2 : 0, 0.4)
        o.updateMatrix()
        im.setMatrixAt(i, o.matrix)
        im.setColorAt(i, new THREE.Color(cols[i % cols.length]))
      }
      im.frustumCulled = false
      group.add(im)
    }
    // (none along the back wall: the picture's lens hangs there)
    make(new THREE.Vector3(x0 + 0.3, h - 0.25, z1 - 0.3), new THREE.Vector3(x1 - 0.3, h - 0.25, z1 - 0.3), 0.7)
    make(new THREE.Vector3(x0 + 0.3, h - 0.25, z0 + 0.3), new THREE.Vector3(x0 + 0.3, h - 0.25, z1 - 0.3), 0.6)
    make(new THREE.Vector3(x1 - 0.3, h - 0.25, z0 + 0.3), new THREE.Vector3(x1 - 0.3, h - 0.25, z1 - 0.3), 0.6)
  }

  // ---- the warm light from the pendants above, the linoleum's brown from below ----
  group.add(new THREE.HemisphereLight('#f0e4cc', '#5c5040', light ? 1.5 : 1.15))

  // ---- a laboratory bench: deal frame and drawers, a black bakelite top (BENCH_TOP high) ----
  const solids = roomWalls(x0, x1, z0, z1)
  const bench = (x, z, w, d, { rot = 0, shelf = false } = {}) => {
    const g = new THREE.Group()
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), mats.top)
    top.position.y = BENCH_TOP - 0.025
    const body = new THREE.Mesh(new THREE.BoxGeometry(w - 0.06, BENCH_TOP - 0.06, d - 0.1), mats.deal)
    body.position.set(0, (BENCH_TOP - 0.05) / 2, 0)
    g.add(top, body)
    const knob = new THREE.SphereGeometry(0.018, 8, 6)
    for (let i = 0; i < Math.floor(w / 0.65); i++) {
      const dr = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.3, 0.012), mats.wood)
      dr.position.set(-w / 2 + 0.4 + i * 0.65, 0.62, d / 2 - 0.04)
      const kn = new THREE.Mesh(knob, mats.brass)
      kn.position.set(dr.position.x, 0.62, d / 2 - 0.02)
      g.add(dr, kn)
    }
    if (shelf) {
      for (const sx of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), mats.wood)
        post.position.set(sx * (w / 2 - 0.05), BENCH_TOP + 0.45, -d / 2 + 0.1)
        g.add(post)
      }
      const sh = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.04, 0.3), mats.wood)
      sh.position.set(0, BENCH_TOP + 0.9, -d / 2 + 0.2)
      g.add(sh)
    }
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    solids.push(box(x, z, rot ? d : w, rot ? w : d))
    return g
  }

  // ---- a relay rack of tube amplifiers: two steel uprights, panels with knobs, tubes glowing orange ----
  const tubeGlow = []
  const tubeRack = ({ tubes = 4 } = {}) => {
    const g = new THREE.Group()
    for (const sx of [-0.27, 0.27]) {
      const up = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, 0.05), mats.paint)
      up.position.set(sx, 1.1, 0)
      g.add(up)
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.45), mats.paint)
    base.position.y = 0.03
    g.add(base)
    const glow = new THREE.MeshBasicMaterial({ color: '#ff8a3a' })
    glow.color.multiplyScalar(0.9)
    const glass = new THREE.MeshStandardMaterial({ color: '#d8e6e8', roughness: 0.1, transparent: true, opacity: 0.28, depthWrite: false })
    let y = 0.2
    for (let p = 0; p < 6; p++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.03), p % 2 ? mats.paint : mats.bakelite)
      panel.position.set(0, y + 0.1, 0.22)
      g.add(panel)
      for (let k = 0; k < 3; k++) {
        const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.025, 10), mats.brass)
        kn.rotation.x = Math.PI / 2
        kn.position.set(-0.15 + k * 0.15, y + 0.1, 0.245)
        g.add(kn)
      }
      y += 0.22
    }
    // a shelf of tubes near the top
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.3), mats.paint)
    shelf.position.set(0, 1.55, 0.05)
    g.add(shelf)
    for (let i = 0; i < tubes; i++) {
      const x = -0.18 + (i * 0.36) / Math.max(1, tubes - 1)
      const gl = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 4, 10), glass)
      gl.position.set(x, 1.67, 0.05)
      const fil = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 6), glow)
      fil.position.set(x, 1.67, 0.05)
      g.add(gl, fil)
      tubeGlow.push(fil)
    }
    return g
  }

  return {
    group,
    mats,
    shine,
    soft,
    onWall,
    bench,
    tubeRack,
    solids,
    lampLights,
    env: {
      background: new THREE.Color('#0b0b10'),
      fog: new THREE.Fog('#14110e', 16, 40),
      exposure: 1.0,
      envIntensity: 0.28,
      bloom: { strength: 0.45, radius: 0.5, threshold: 0.9 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      // the snow falls past each window and drifts a little sideways; the tubes shimmer
      for (let i = 0; i < flakeN; i++) {
        const z = flakeZone[Math.floor(i / perWindow)]
        const s = flakeSeed[i]
        const fall = (t * (0.28 + (s % 3) * 0.06) + s) % 1
        const dx = Math.sin(t * 0.6 + s) * 0.1
        flakePos[i * 3] = z.cx + ((s * 7.3) % 1 - 0.5) * z.w + (z.w < 1 ? 0 : dx)
        flakePos[i * 3 + 1] = z.y + z.h / 2 - fall * (z.h + 0.6)
        flakePos[i * 3 + 2] = z.cz + (((s * 3.1) % 1) - 0.5) * z.d + (z.w < 1 ? dx : 0)
      }
      if (snow) snow.geometry.attributes.position.needsUpdate = true
      for (const f of tubeGlow) f.material.color.setRGB(1 * 0.9, (0.5 + 0.04 * Math.sin(t * 7)) * 0.9, 0.2 * 0.9)
    },
    dispose: () => textures.forEach(t => t.dispose()),
  }
}
