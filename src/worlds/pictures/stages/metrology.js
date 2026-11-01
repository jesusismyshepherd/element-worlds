// A stage for picture rooms (docs/knowledge/picture-rooms.md): a length laboratory of 1960, calm and
// clean, like the BIPM's at Sèvres. Flagstones, pale plaster over dark wood panelling, a ceiling of
// plain boards on beams, tall windows onto a park at dusk, a steel vault door, warm brass pendant lamps.
// Every big surface mid-toned (pale ones bloom to white), so what glows in it (a lamp, a laser) stands
// out. Walking inside the rectangle x0..x1, z0..z1. The scene adds its tables and instruments;
// `mats` are shared plain materials for them (one shader program each), `granite(w, d, h)` makes a
// measuring table of dark speckled granite on two stone piers, standing on the floor (a Group whose
// top is at y = h).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls } from '../../../engine/collide.js'

/** Flagstones, 1.2 m a tile, grey-beige, each stone a shade of its own. */
function floorTex(light) {
  const px = light ? 192 : 384
  const rnd = random(11)
  return canvasTex(px, px, (g, w) => {
    g.fillStyle = '#6c675d'
    g.fillRect(0, 0, w, w)
    const n = 3
    const s = w / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const k = 0.9 + rnd() * 0.2
        g.fillStyle = `rgb(${Math.round(138 * k)},${Math.round(132 * k)},${Math.round(120 * k)})`
        g.fillRect(i * s + 3, j * s + 3, s - 6, s - 6)
        for (let d = 0; d < s * 0.9; d++) {
          g.fillStyle = rnd() < 0.5 ? 'rgba(80,76,68,0.4)' : 'rgba(180,174,160,0.35)'
          g.fillRect(i * s + rnd() * s, j * s + rnd() * s, 1 + rnd() * 2, 1 + rnd() * 2)
        }
      }
    }
  }, { repeat: true })
}

/** Soft plaster, mid-toned, a little mottled. */
function plasterTex() {
  const rnd = random(23)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#8f8a7b'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(70,66,56,0.03)' : 'rgba(200,194,176,0.03)'
      const r = 3 + rnd() * 14
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, r, 0, Math.PI * 2)
      g.fill()
    }
  }, { repeat: true })
}

/** Dark speckled granite for the measuring tables. */
function graniteTex() {
  const rnd = random(5)
  return canvasTex(128, 128, (g, w) => {
    g.fillStyle = '#3d3f43'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 1400; i++) {
      const d = rnd()
      g.fillStyle = d < 0.4 ? 'rgba(20,20,24,0.7)' : d < 0.75 ? 'rgba(120,122,128,0.55)' : 'rgba(190,176,170,0.4)'
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** The park of Saint-Cloud at dusk through a tall window: a green-grey sky fading to apricot, dark trees. */
function parkTex() {
  const rnd = random(8)
  return canvasTex(256, 384, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#2a3a63')
    grd.addColorStop(0.55, '#8d7f8c')
    grd.addColorStop(0.8, '#d49a6a')
    grd.addColorStop(1, '#8a5a44')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 18; i++) {
      g.fillStyle = `rgba(255,248,230,${0.25 + rnd() * 0.5})`
      g.fillRect(rnd() * w, rnd() * h * 0.35, 1.5, 1.5)
    }
    g.fillStyle = '#1a2224'
    let x = -10
    while (x < w + 10) {
      const r = 22 + rnd() * 34
      g.beginPath()
      g.arc(x + r, h * 0.78 + rnd() * 12, r, 0, Math.PI * 2)
      g.fill()
      x += r * 1.3
    }
    g.fillRect(0, h * 0.86, w, h)
  })
}

export function metrologyStage({ x0 = -10, x1 = 10, z0 = -9, z1 = 9.6, h = 5, light = false, lamps = [] } = {}) {
  const group = new THREE.Group()
  const textures = []
  const keep = t => (textures.push(t), t)
  const fw = x1 - x0
  const fd = z1 - z0
  const uvMetres = (geo, su, sv) => {
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    return geo
  }

  // materials
  const floorMap = keep(floorTex(light))
  floorMap.repeat.set(1 / 1.2, 1 / 1.2)
  const plaster = keep(plasterTex())
  plaster.repeat.set(1 / 2, 1 / 2)
  const graniteMap = keep(graniteTex())
  graniteMap.repeat.set(1, 1)
  const mats = {
    floor: new THREE.MeshStandardMaterial({ map: floorMap, roughness: 0.82 }),
    plaster: new THREE.MeshStandardMaterial({ map: plaster, roughness: 0.95 }),
    wood: new THREE.MeshStandardMaterial({ color: '#5b3d29', roughness: 0.65 }),
    beam: new THREE.MeshStandardMaterial({ color: '#3a2a1f', roughness: 0.8 }),
    granite: new THREE.MeshStandardMaterial({ map: graniteMap, roughness: 0.38, metalness: 0.1 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.32, metalness: 0.9 }),
    steel: new THREE.MeshStandardMaterial({ color: '#9aa1ab', roughness: 0.3, metalness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1b1816', roughness: 0.85 }),
    velvet: new THREE.MeshStandardMaterial({ color: '#6b1a2a', roughness: 0.98 }),
  }

  // floor and ceiling
  const floor = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(fw, fd), fw, fd), mats.floor)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: '#6e675c', roughness: 0.95 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  for (let z = z1 - 1.6; z > z0 + 0.5; z -= 3.2) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.4, 0.3), mats.beam)
    b.position.set((x0 + x1) / 2, h - 0.2, z)
    group.add(b)
  }

  // walls: plaster over a dado of dark wood panelling (rails and a cap), one piece per wall
  const DADO = 1.15
  const wall = (len, x, z, rotY) => {
    const g = new THREE.Group()
    const up = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(len, h - DADO), len, h - DADO), mats.plaster)
    up.position.set(0, DADO + (h - DADO) / 2, 0)
    const low = new THREE.Mesh(new THREE.PlaneGeometry(len, DADO), mats.wood)
    low.position.set(0, DADO / 2, 0.01)
    g.add(up, low)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.08), mats.beam)
    cap.position.set(0, DADO, 0.04)
    g.add(cap)
    const n = Math.floor(len / 1.4)
    for (let i = 1; i < n; i++) {
      const stile = new THREE.Mesh(new THREE.BoxGeometry(0.06, DADO - 0.2, 0.03), mats.beam)
      stile.position.set(-len / 2 + (i * len) / n, DADO / 2, 0.03)
      g.add(stile)
    }
    g.position.set(x, 0, z)
    g.rotation.y = rotY
    group.add(g)
    return g
  }
  const back = wall(fw, (x0 + x1) / 2, z0, 0)
  wall(fw, (x0 + x1) / 2, z1, Math.PI)
  const west = wall(fd, x0, (z0 + z1) / 2, Math.PI / 2)
  wall(fd, x1, (z0 + z1) / 2, -Math.PI / 2)

  // three tall windows onto the park, in the far wall
  const park = keep(parkTex())
  for (const wx of [-6, 0, 6]) {
    const win = new THREE.Group()
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.1), new THREE.MeshBasicMaterial({ map: park, toneMapped: false }))
    sky.position.set(0, 3.0, 0.03)
    win.add(sky)
    const frame = (w, hh, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.14), mats.beam)
      m.position.set(x, y, 0.07)
      win.add(m)
    }
    frame(2.5, 0.15, 0, 4.58)
    frame(2.5, 0.15, 0, 1.45)
    frame(0.15, 3.28, -1.18, 3.02)
    frame(0.15, 3.28, 1.18, 3.02)
    frame(0.07, 3.1, 0, 3.0)
    frame(2.2, 0.07, 0, 3.0)
    const sill = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 0.34), mats.wood)
    sill.position.set(0, 1.4, 0.2)
    win.add(sill)
    win.position.set(wx, 0, 0.0)
    back.add(win)
  }

  // the vault door in the west wall: a round steel door in a heavy frame, its wheel in brass
  const vault = new THREE.Group()
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.16, 12, 40), mats.steel)
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.22, 40), mats.steel)
  disc.rotation.x = Math.PI / 2
  disc.position.z = 0.04
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 28), mats.brass)
  wheel.position.z = 0.24
  vault.add(ring, disc, wheel)
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.05, 0.05), mats.brass)
    spoke.rotation.z = (i * Math.PI) / 4
    spoke.position.z = 0.24
    vault.add(spoke)
  }
  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), mats.brass)
  hub.position.z = 0.26
  vault.add(hub)
  for (const a of [0.5, -0.5, 2.6, -2.6]) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), mats.brass)
    bolt.rotation.x = Math.PI / 2
    bolt.position.set(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0.16)
    vault.add(bolt)
  }
  vault.position.set(0, 1.32, 0.02)
  vault.position.x = 5.2 // along the west wall, towards the back
  west.add(vault)

  // brass pendant lamps with a warm glow
  const shadeGeo = new THREE.LatheGeometry(
    [[0.04, 0.22], [0.08, 0.2], [0.14, 0.1], [0.3, 0], [0.31, -0.01]].map(([x, y]) => new THREE.Vector2(x, y)),
    24,
  )
  const shadeMat = new THREE.MeshStandardMaterial({ color: '#2f5a4a', roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide })
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff2d8', emissive: '#ffcf8a', emissiveIntensity: 1.6 })
  for (const l of lamps) {
    const drop = l.drop ?? 1.7
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drop, 5), mats.dark)
    cord.position.set(l.x, h - drop / 2, l.z)
    const shade = new THREE.Mesh(shadeGeo, shadeMat)
    shade.position.set(l.x, h - drop - 0.2, l.z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), bulbMat)
    bulb.position.set(l.x, h - drop - 0.14, l.z)
    group.add(cord, shade, bulb)
    if (!(light && l.optional)) {
      const p = new THREE.PointLight('#ffd7a0', l.intensity ?? 7, 10, 2)
      p.position.set(l.x, h - drop - 0.4, l.z)
      group.add(p)
    }
  }
  group.add(new THREE.HemisphereLight('#7d86a8', '#3a2c22', light ? 1.0 : 0.8))

  // dust turning in the steady air
  const dust = motes({ count: 200, radius: Math.min(fw, fd) / 2, y0: 0.4, y1: h - 0.6, color: '#ffe2b8', size: 0.02, opacity: 0.25, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  /** A measuring table: a slab of granite (w by d, top at h) on two stone piers. */
  const granite = (w, d, top = 0.92) => {
    const g = new THREE.Group()
    const slab = new THREE.Mesh(new RoundedBoxGeometry(w, 0.16, d, 2, 0.02), mats.granite)
    slab.position.y = top - 0.08
    g.add(slab)
    for (const s of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.34, top - 0.16, d * 0.7), mats.floor)
      pier.position.set(s * (w / 2 - 0.35), (top - 0.16) / 2, 0)
      g.add(pier)
    }
    return g
  }

  return {
    group,
    mats,
    granite,
    solids: roomWalls(x0, x1, z0, z1),
    env: {
      background: new THREE.Color('#0d0c0e'),
      fog: new THREE.Fog('#17151a', 16, 42),
      exposure: 1.0,
      envIntensity: 0.25,
      bloom: { strength: 0.5, radius: 0.5, threshold: 0.88 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.45, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose: () => textures.forEach(t => t.dispose()),
  }
}
