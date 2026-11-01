// A stage for picture rooms (docs/knowledge/picture-rooms.md): a long Victorian gallery of a natural history
// museum at night, in the spirit of London's and without a name or a logo on anything. Painted green walls over
// an oak dado, pilasters, a polished parquet floor, a barrel vault of iron ribs whose glass shows the night
// sky, the moon's panes laid on the floor, rows of wooden mineral cases with lit specimens and a pair of
// benches. Walking inside x0..x1, z0..z1; the back wall (z0) is for the exhibits. Exports `lumpGeometry`
// (a rough rock), `comicTexture` (halftone dots and a jagged panel edge) and `zigzag`; the stage gives
// `mats`, `specimenCase(...)` and `bay(...)` (the back wall dressed as a comic page, left, and the real
// gallery, right).
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** A rough rock: an icosahedron pushed in and out by a few sines (the same rock for the same seed). */
export function lumpGeometry(seed = 1, { detail = 3, bump = 0.16, squash = 1 } = {}) {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const p = geo.attributes.position
  const rnd = random(seed)
  const waves = Array.from({ length: 6 }, () => ({ a: rnd() * TAU, b: rnd() * TAU, f: 1.5 + rnd() * 3.5, k: 0.4 + rnd() * 0.6, ph: rnd() * TAU }))
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize()
    let d = 0
    for (const w of waves) d += Math.sin(v.x * w.f + v.y * w.f * 0.7 * Math.cos(w.a) + v.z * w.f * Math.sin(w.b) + w.ph) * w.k
    const r = 1 + (d / waves.length) * bump * 2.2
    p.setXYZ(i, v.x * r, v.y * r * squash, v.z * r)
  }
  geo.computeVertexNormals()
  return geo
}

/** The jagged edge of a comic panel: points down the line x = 0 of a w x h canvas, every `step` pixels
 *  alternately `amp` to the left and the right. */
export function zigzag(w, h, { step = 70, amp = 22 } = {}) {
  const pts = []
  let k = 0
  for (let y = -step; y <= h + step; y += step) pts.push([w / 2 + (k++ % 2 ? amp : -amp) * (0.6 + 0.4 * Math.sin(y * 0.05)), y])
  return pts
}

/** Halftone dots: rows of dots on a 45 degree grid, their size growing with `size(x, y)`. */
function halftone(g, x0, y0, x1, y1, { pitch = 18, size, color }) {
  g.save()
  g.beginPath()
  g.rect(x0, y0, x1 - x0, y1 - y0)
  g.clip()
  g.fillStyle = color
  for (let r = 0, y = y0 - pitch; y < y1 + pitch; y += pitch * 0.5, r++) {
    for (let x = x0 - pitch + (r % 2 ? pitch * 0.5 : 0); x < x1 + pitch; x += pitch) {
      const s = size(x, y)
      if (s < 0.3) continue
      g.beginPath()
      g.arc(x, y, s, 0, TAU)
      g.fill()
    }
  }
  g.restore()
}

/** The comic page and the gallery side by side on one canvas: halftone dots on teal at the left, a night
 *  museum at the right, a white jagged edge between them (the picture's split). `focus` is where the dots
 *  are biggest, as a share of the canvas (the glow of the crystals). */
export function comicTexture(w, h, { focus = [0.22, 0.62] } = {}) {
  return canvasTex(w, h, g => {
    const zz = zigzag(w, h)
    // the real side: dark navy, a faint glow and a few stars
    const real = g.createLinearGradient(0, 0, 0, h)
    real.addColorStop(0, '#0e1633')
    real.addColorStop(1, '#070b1c')
    g.fillStyle = real
    g.fillRect(0, 0, w, h)
    const rnd = random(5)
    g.fillStyle = 'rgba(210,225,255,0.8)'
    for (let i = 0; i < 40; i++) {
      g.beginPath()
      g.arc(w / 2 + 40 + rnd() * (w / 2 - 40), rnd() * h * 0.8, 1 + rnd() * 1.6, 0, TAU)
      g.fill()
    }
    // the comic side, cut by the zigzag
    g.save()
    g.beginPath()
    g.moveTo(0, -80)
    for (const [x, y] of zz) g.lineTo(x, y)
    g.lineTo(0, h + 80)
    g.closePath()
    g.clip()
    g.fillStyle = '#0f2f2a'
    g.fillRect(0, 0, w, h)
    const fx = focus[0] * w
    const fy = focus[1] * h
    const glow = g.createRadialGradient(fx, fy, 0, fx, fy, h * 0.9)
    glow.addColorStop(0, 'rgba(70,200,100,0.55)')
    glow.addColorStop(1, 'rgba(70,200,100,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, w, h)
    halftone(g, 0, 0, w / 2 + 40, h, {
      pitch: 22,
      color: '#7fe6a0',
      size: (x, y) => 9.5 * Math.max(0, 1 - Math.hypot(x - fx, (y - fy) * 1.15) / (h * 0.95)) + 1.2,
    })
    g.restore()
    // the white edge, with a dark shadow beside it
    g.lineJoin = 'miter'
    g.strokeStyle = 'rgba(0,0,0,0.5)'
    g.lineWidth = 16
    g.beginPath()
    zz.forEach(([x, y], i) => (i ? g.lineTo(x + 8, y) : g.moveTo(x + 8, y)))
    g.stroke()
    g.strokeStyle = '#f4f7ff'
    g.lineWidth = 8
    g.beginPath()
    zz.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.stroke()
  })
}

/** Parquet in blocks of short boards, laid in herringbone (UVs in metres, 4 m to the tile). */
function parquetTex(light) {
  const s = light ? 256 : 512
  const rnd = random(11)
  return canvasTex(s, s, g => {
    g.fillStyle = '#1a0f08'
    g.fillRect(0, 0, s, s)
    const n = 8
    const cell = s / n
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const v = 0.7 + rnd() * 0.45
        g.fillStyle = `rgb(${Math.round(92 * v)},${Math.round(58 * v)},${Math.round(34 * v)})`
        const x = i * cell
        const y = j * cell
        if ((i + j) % 2) {
          g.fillRect(x + 1, y + 1, cell - 2, cell / 2 - 1.5)
          g.fillRect(x + 1, y + cell / 2 + 0.5, cell - 2, cell / 2 - 1.5)
        } else {
          g.fillRect(x + 1, y + 1, cell / 2 - 1.5, cell - 2)
          g.fillRect(x + cell / 2 + 0.5, y + 1, cell / 2 - 1.5, cell - 2)
        }
      }
    }
  }, { repeat: true })
}

/** The night sky seen through the glass roof: deep blue, stars, a moon's glow. */
function skyTex() {
  return canvasTex(1024, 512, g => {
    const grd = g.createLinearGradient(0, 0, 0, 512)
    grd.addColorStop(0, '#0b1230')
    grd.addColorStop(1, '#17234f')
    g.fillStyle = grd
    g.fillRect(0, 0, 1024, 512)
    const rnd = random(23)
    for (let i = 0; i < 280; i++) {
      const b = 0.4 + rnd() * 0.6
      g.fillStyle = `rgba(220,232,255,${b})`
      g.beginPath()
      g.arc(rnd() * 1024, rnd() * 512, 0.8 + rnd() * 1.7, 0, TAU)
      g.fill()
    }
    const moon = g.createRadialGradient(720, 250, 0, 720, 250, 120)
    moon.addColorStop(0, 'rgba(235,242,255,0.9)')
    moon.addColorStop(0.15, 'rgba(200,215,255,0.55)')
    moon.addColorStop(1, 'rgba(120,150,230,0)')
    g.fillStyle = moon
    g.fillRect(480, 40, 480, 420)
  })
}

/** One pane of moonlight on the floor: a window's panes, in soft light. */
function paneTex() {
  return canvasTex(256, 512, g => {
    g.fillStyle = 'rgba(150,175,235,0.34)'
    g.fillRect(0, 0, 256, 512)
    g.strokeStyle = 'rgba(0,0,0,0.45)'
    g.lineWidth = 9
    for (let x = 0; x <= 256; x += 128) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x, 512)
      g.stroke()
    }
    for (let y = 0; y <= 512; y += 128) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(256, y)
      g.stroke()
    }
    g.strokeStyle = 'rgba(0,0,0,1)'
    g.lineWidth = 14
    g.strokeRect(0, 0, 256, 512)
  })
}

export function galleryStage({ light = false, x0 = -13, x1 = 13, z0 = -6, z1 = 10, wallH = 4.6, vaultH = 3.4 } = {}) {
  const group = new THREE.Group()
  const solids = []
  const textures = []
  const geos = []
  const tex = t => (textures.push(t), t)
  const geo = g => (geos.push(g), g)
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2
  const fw = x1 - x0
  const fd = z1 - z0

  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: '#35675a', roughness: 0.92 }),
    wood: new THREE.MeshStandardMaterial({ color: '#4a2f1d', roughness: 0.6, metalness: 0.05 }),
    woodDark: new THREE.MeshStandardMaterial({ color: '#2d1b10', roughness: 0.65 }),
    iron: new THREE.MeshStandardMaterial({ color: '#16191f', roughness: 0.55, metalness: 0.5 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.35, metalness: 0.75 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe6ff', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0, depthWrite: false, side: THREE.DoubleSide }),
    leather: new THREE.MeshStandardMaterial({ color: '#5b1f1a', roughness: 0.7 }),
    tray: new THREE.MeshStandardMaterial({ color: '#b9a98a', roughness: 0.9, emissive: '#5c4b30', emissiveIntensity: 0.65 }),
  }

  // ---- floor, walls, cornice ----
  const floorTex = tex(parquetTex(light))
  floorTex.repeat.set(fw / 4, fd / 4)
  const floor = new THREE.Mesh(geo(new THREE.PlaneGeometry(fw, fd)), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.34, metalness: 0.12, color: '#f0dfcf' }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(cx, 0, cz)
  group.add(floor)

  const wallPlane = (w, h, x, y, z, ry) => {
    const m = new THREE.Mesh(geo(new THREE.PlaneGeometry(w, h)), mats.wall)
    m.position.set(x, y, z)
    m.rotation.y = ry
    group.add(m)
    return m
  }
  wallPlane(fw, wallH, cx, wallH / 2, z0, 0)
  wallPlane(fw, wallH, cx, wallH / 2, z1, Math.PI)
  wallPlane(fd, wallH, x0, wallH / 2, cz, Math.PI / 2)
  wallPlane(fd, wallH, x1, wallH / 2, cz, -Math.PI / 2)
  // an oak dado round the room, a picture rail and a cornice
  const band = (len, h, y, d, x, z, ry, mat) => {
    const m = new THREE.Mesh(geo(new THREE.BoxGeometry(len, h, d)), mat)
    m.position.set(x, y, z)
    m.rotation.y = ry
    group.add(m)
  }
  for (const [len, x, z, ry, dz] of [[fw, cx, z0, 0, 1], [fw, cx, z1, Math.PI, 1], [fd, x0, cz, Math.PI / 2, 1], [fd, x1, cz, -Math.PI / 2, 1]]) {
    const off = (d, s = dz) => [x + Math.sin(ry) * d * s, z + Math.cos(ry) * d * s]
    const [dx, dzz] = off(0.04)
    band(len, 1.15, 0.575, 0.08, dx, dzz, ry, mats.wood)
    band(len, 0.08, 1.2, 0.12, dx, dzz, ry, mats.woodDark)
    const [cxx, czz] = off(0.08)
    band(len, 0.22, wallH - 0.11, 0.16, cxx, czz, ry, mats.woodDark)
    band(len, 0.06, wallH - 0.5, 0.06, dx, dzz, ry, mats.brass)
  }
  // pilasters on the back wall, between the bays
  const pil = geo(new THREE.BoxGeometry(0.5, wallH - 0.2, 0.3))
  for (const x of [-11, -6.4, 6.4, 11]) {
    const p = new THREE.Mesh(pil, mats.woodDark)
    p.position.set(x, (wallH - 0.2) / 2, z0 + 0.15)
    group.add(p)
  }
  solids.push(box(cx, z0 - 0.5, fw + 2, 1), box(cx, z1 + 0.5, fw + 2, 1), box(x0 - 0.5, cz, 1, fd + 2), box(x1 + 0.5, cz, 1, fd + 2))

  // ---- the vault: ribs of iron, glass showing the night ----
  const sky = new THREE.Mesh(
    geo(new THREE.CylinderGeometry(1, 1, 1, 48, 1, true, 0, Math.PI)),
    new THREE.MeshBasicMaterial({ map: tex(skyTex()), side: THREE.BackSide, fog: false, toneMapped: false }),
  )
  sky.rotation.z = Math.PI / 2
  sky.scale.set(vaultH, fw, fd / 2)
  sky.position.set(cx, wallH, cz)
  group.add(sky)
  const arc = Array.from({ length: 33 }, (_, i) => {
    const a = (i / 32) * Math.PI
    return new THREE.Vector3(0, wallH + Math.sin(a) * vaultH, cz + Math.cos(a) * (fd / 2))
  })
  const ribGeo = geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arc), 48, 0.07, 6, false))
  const ribs = Math.round(fw / 3.25)
  for (let i = 0; i <= ribs; i++) {
    const r = new THREE.Mesh(ribGeo, mats.iron)
    r.position.x = x0 + (i / ribs) * fw
    group.add(r)
  }
  for (const a of [0.25, 0.5, 0.75]) {
    const th = a * Math.PI
    const p = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.045, 0.045, fw, 6)), mats.iron)
    p.rotation.z = Math.PI / 2
    p.position.set(cx, wallH + Math.sin(th) * vaultH, cz + Math.cos(th) * (fd / 2))
    group.add(p)
  }

  // ---- moonlight: panes laid on the floor, and the moon's own light ----
  const paneMat = new THREE.MeshBasicMaterial({ map: tex(paneTex()), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  for (const [x, z, w, d] of [[-7.5, 3.5, 2.6, 6.2], [0, 1.2, 2.6, 6.2], [7.5, 3.5, 2.6, 6.2]]) {
    const m = new THREE.Mesh(geo(new THREE.PlaneGeometry(w, d)), paneMat)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.012, z)
    group.add(m)
  }
  group.add(new THREE.HemisphereLight('#7088c4', '#2a1d14', light ? 1.5 : 1.25))
  const moon = new THREE.DirectionalLight('#a9bdf5', light ? 0.9 : 1.1)
  moon.position.set(-6, 12, 4)
  group.add(moon)

  // ---- the comic bay: the back wall, left half a comic page, right half the real gallery ----
  /** Dress the back wall between x = -w/2 and w/2 (its edge at x = 0) from `y0` to `y1`. */
  function bay({ w = 9, y0 = 0.25, y1 = 4.05, focus = [0.22, 0.62] } = {}) {
    const t = tex(comicTexture(2048, Math.round((2048 * (y1 - y0)) / w), { focus }))
    const m = new THREE.Mesh(geo(new THREE.PlaneGeometry(w, y1 - y0)), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }))
    m.position.set(0, (y0 + y1) / 2, z0 + 0.025)
    group.add(m)
    // the same page spills onto the floor: dots at the left of the edge, the polished parquet at the right
    const fl = tex(canvasTex(1024, 1024, g => {
      g.clearRect(0, 0, 1024, 1024)
      const zz = zigzag(1024, 1024, { step: 90, amp: 26 })
      g.save()
      g.beginPath()
      g.moveTo(-80, -80)
      for (const [x, y] of zz) g.lineTo(x, y)
      g.lineTo(-80, 1104)
      g.closePath()
      g.clip()
      g.fillStyle = '#0f2f2a'
      g.fillRect(0, 0, 1024, 1024)
      halftone(g, 0, 0, 1024, 1024, { pitch: 26, color: '#7fe6a0', size: (x, y) => 2 + 8 * Math.max(0, 1 - Math.hypot(x - 280, (y - 330) * 0.9) / 700) })
      g.restore()
      g.strokeStyle = '#f4f7ff'
      g.lineWidth = 9
      g.beginPath()
      zz.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
      g.stroke()
    }))
    const dots = new THREE.Mesh(geo(new THREE.PlaneGeometry(w / 2 + 0.3, w / 2 + 0.3)), new THREE.MeshBasicMaterial({ map: fl, transparent: true, toneMapped: false, depthWrite: false }))
    dots.rotation.x = -Math.PI / 2
    dots.position.set(-w / 4 + 0.15 - 0.15, 0.02, z0 + (w / 2 + 0.3) / 2 - 0.05)
    group.add(dots)
    return m
  }

  // ---- a mineral case: a wooden table case with a glass top, a lit tray and a specimen ----
  const specimenKinds = {
    amethyst: ['#8b5fd0', '#3a1d6b'],
    azurite: ['#2f62c9', '#0e2150'],
    copper: ['#d5782f', '#5e2a0c'],
    sulphur: ['#e9d44a', '#6a5e0c'],
    rose: ['#e7a0b4', '#6b2c3f'],
    malachite: ['#1f9d6a', '#07402a'],
    quartz: ['#e5e9f2', '#4b5266'],
  }
  /** A case `w` wide at (x, z) facing +z (`rot` turns it), holding a specimen of `kind`; solid to walk round. */
  function specimenCase(x, z, { w = 1.3, d = 0.75, rot = 0, kind = 'amethyst', seed = 1 } = {}) {
    const g = new THREE.Group()
    const [c, e] = specimenKinds[kind] ?? specimenKinds.amethyst
    const base = new THREE.Mesh(geo(new THREE.BoxGeometry(w, 0.8, d)), mats.wood)
    base.position.y = 0.4
    const trim = new THREE.Mesh(geo(new THREE.BoxGeometry(w + 0.08, 0.06, d + 0.08)), mats.woodDark)
    trim.position.y = 0.82
    const tray = new THREE.Mesh(geo(new THREE.BoxGeometry(w - 0.1, 0.04, d - 0.1)), mats.tray)
    tray.position.y = 0.87
    const top = new THREE.Mesh(geo(new THREE.BoxGeometry(w - 0.06, 0.5, d - 0.06)), mats.glass)
    top.position.y = 1.14
    const rock = new THREE.Mesh(
      geo(lumpGeometry(seed, { detail: 2, bump: 0.22, squash: 0.7 })),
      new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: 0.55, roughness: 0.5, flatShading: true }),
    )
    rock.scale.setScalar(0.17 + (seed % 3) * 0.02)
    rock.position.set(((seed * 37) % 10) / 100 - 0.05, 0.99 + 0.07, 0)
    const bars = [-1, 1].map(s => {
      const b = new THREE.Mesh(geo(new THREE.BoxGeometry(0.025, 0.5, 0.025)), mats.brass)
      b.position.set((s * (w - 0.06)) / 2, 1.14, (d - 0.06) / 2)
      return b
    })
    g.add(base, trim, tray, top, rock, ...bars)
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    const turned = Math.abs(Math.sin(rot)) > 0.7 // a case turned a quarter: its width runs along z
    solids.push(box(x, z, turned ? d : w, turned ? w : d))
    return g
  }

  // ---- a museum bench ----
  function bench(x, z, { w = 1.7, rot = 0 } = {}) {
    const g = new THREE.Group()
    const seat = new THREE.Mesh(geo(new THREE.BoxGeometry(w, 0.1, 0.5)), mats.leather)
    seat.position.y = 0.46
    const legs = [-1, 1].map(s => {
      const l = new THREE.Mesh(geo(new THREE.BoxGeometry(0.08, 0.42, 0.42)), mats.woodDark)
      l.position.set(s * (w / 2 - 0.12), 0.21, 0)
      return l
    })
    g.add(seat, ...legs)
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    solids.push(box(x, z, w, 0.5, { y1: 0.6 }))
    return g
  }

  const dust = motes({ count: 180, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: wallH, color: '#cfdcff', size: 0.022, opacity: 0.28, speed: 0.04, light })
  dust.group.position.set(cx, 0, cz)
  group.add(dust.group)

  return {
    group,
    mats,
    solids,
    bay,
    specimenCase,
    bench,
    env: {
      background: new THREE.Color('#05070f'),
      fog: new THREE.Fog('#070a16', 16, 46),
      exposure: 1.0,
      envIntensity: 0.14,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.84 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: wallH - 0.4, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
