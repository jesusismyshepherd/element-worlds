// A stage for picture rooms (docs/knowledge/picture-rooms.md): the great hall of a wooden bathhouse at the
// edge of a lake on a winter afternoon. Walls of pine boards, a floor of grey stone slabs, a ceiling of
// boards on dark beams, warm pendant lamps. The north wall is one big window onto the lake, set so low that
// the lake's water stands outside the glass up to `water` metres above the hall's floor: through the lower
// part of the window you look into the lake (its water in layers that grow bluer with distance, the lake bed
// sloping away, the ice's underside), through the upper part across its surface to a snowy shore of spruces,
// blue hills and a low sun. `lake.set({ ice, top, deep, sun })` sets the ice's thickness (metres; 0 is open
// water) and the water's colour near the surface and in the deep, so a scene can take the lake through a
// winter. Walking inside the rectangle x0..x1, z0..z1; the window is the wall at z0. `onWall` places a thing
// on a wall; `mats` are plain shared materials (wood, dark wood, brass, cloth).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random, clamp, lerp } from '../../wings/noble/kit.js'
import { roomWalls, box } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** Pine boards laid across, 14 cm each: ten to the tile, the tile 2 m wide and 1.4 m tall. */
function boardTex(light, { base = [176, 128, 82], seed = 5 } = {}) {
  const rnd = random(seed)
  const px = light ? 256 : 512
  return canvasTex(px, Math.round(px * 0.7), (g, w, h) => {
    const n = 10
    const bh = h / n
    for (let i = 0; i < n; i++) {
      const k = 0.86 + rnd() * 0.22
      g.fillStyle = `rgb(${Math.round(base[0] * k)},${Math.round(base[1] * k)},${Math.round(base[2] * k)})`
      g.fillRect(0, i * bh, w, bh)
      // the grain: long wavy lines, a knot or two
      for (let s = 0; s < 9; s++) {
        g.strokeStyle = `rgba(90,52,24,${0.08 + rnd() * 0.12})`
        g.lineWidth = 0.6 + rnd() * 1.2
        g.beginPath()
        const y0 = i * bh + rnd() * bh
        g.moveTo(0, y0)
        for (let x = 0; x <= w; x += w / 8) g.lineTo(x, y0 + Math.sin(x * 0.02 + s) * bh * 0.08)
        g.stroke()
      }
      if (rnd() < 0.5) {
        g.fillStyle = 'rgba(96,56,26,0.5)'
        g.beginPath()
        g.ellipse(rnd() * w, i * bh + bh * (0.3 + rnd() * 0.4), 3 + rnd() * 4, 2 + rnd() * 2, 0, 0, TAU)
        g.fill()
      }
      // the joint between boards
      g.fillStyle = 'rgba(52,30,14,0.75)'
      g.fillRect(0, i * bh, w, 2)
      // end joints, staggered
      const jx = rnd() * w
      g.fillRect(jx, i * bh, 2, bh)
    }
  }, { repeat: true })
}

/** Grey stone slabs, 60 cm square, four by four to the tile. */
function slabTex(light) {
  const rnd = random(23)
  const n = 4
  const px = light ? 64 : 128
  return canvasTex(n * px, n * px, (g) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const k = 0.88 + rnd() * 0.16
        g.fillStyle = `rgb(${Math.round(118 * k)},${Math.round(114 * k)},${Math.round(106 * k)})`
        g.fillRect(i * px, j * px, px, px)
        for (let s = 0; s < px * 1.2; s++) {
          g.fillStyle = rnd() < 0.5 ? 'rgba(70,66,60,0.35)' : 'rgba(160,156,146,0.3)'
          g.fillRect(i * px + rnd() * px, j * px + rnd() * px, 1 + rnd() * 2.5, 1 + rnd() * 2.5)
        }
        g.strokeStyle = 'rgba(44,40,36,0.9)'
        g.lineWidth = 2
        g.strokeRect(i * px + 1, j * px + 1, px - 2, px - 2)
      }
    }
  }, { repeat: true })
}

/** Snow on ice: white with blue-grey streaks where the wind swept it thin. */
function snowTex() {
  const rnd = random(41)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#e9eef4'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 70; i++) {
      g.fillStyle = `rgba(120,150,175,${0.05 + rnd() * 0.1})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 40, 2 + rnd() * 6, -0.3 + rnd() * 0.2, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`
      g.fillRect(rnd() * w, rnd() * h, 1, 1)
    }
  }, { repeat: true })
}

/** Lake ice cut through: clear blue-white columns grown downward, trapped bubbles, snow lying on top. */
function iceCutTex() {
  const rnd = random(61)
  return canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, 'rgba(226,242,252,1)')
    grd.addColorStop(1, 'rgba(150,200,228,0.92)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(255,255,255,${0.04 + rnd() * 0.08})`
      g.fillRect(rnd() * w, h * 0.12, 1 + rnd() * 3, h * 0.88)
    }
    for (let i = 0; i < 70; i++) {
      g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`
      g.beginPath()
      g.ellipse(rnd() * w, h * (0.15 + rnd() * 0.6), 0.6 + rnd() * 1.2, 1 + rnd() * 2.5, 0, 0, TAU)
      g.fill()
    }
    // the snow on top
    g.fillStyle = 'rgba(250,252,255,1)'
    g.fillRect(0, 0, w, h * 0.16)
    // the underside, where the ice meets the water
    g.fillStyle = 'rgba(90,150,190,0.9)'
    g.fillRect(0, h * 0.95, w, h * 0.05)
  }, { repeat: true })
}

/** The lake bed: grey-brown mud, sand and stones. */
function bedTex() {
  const rnd = random(57)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#6b6450'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 1600; i++) {
      const v = 70 + rnd() * 70
      g.fillStyle = `rgba(${v},${v - 6},${v - 22},${0.25 + rnd() * 0.4})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 0.6 + rnd() * 2.6, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(${60 + rnd() * 40},${60 + rnd() * 30},${55 + rnd() * 20},0.9)`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * h, 3 + rnd() * 7, 2 + rnd() * 5, rnd() * 3, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
}

/** A band of spruces with snow on their boughs (alpha: the sky shows above them). */
function treeLineTex(seed, { px = 1024, dark = '#1d2d33', snow = '#d9e4ee', fill = 0.55 } = {}) {
  const rnd = random(seed)
  return canvasTex(px, px / 4, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const base = h * 0.92
    // the snowy bank they stand on
    g.fillStyle = snow
    g.fillRect(0, base, w, h - base)
    let x = -10
    while (x < w + 10) {
      const th = h * (fill * 0.55 + rnd() * fill * 0.6)
      const tw = th * (0.26 + rnd() * 0.1)
      // the tree: tiers of boughs, narrower upward
      const tiers = 6
      for (let k = 0; k < tiers; k++) {
        const y1 = base - (k / tiers) * th
        const y0 = base - ((k + 1.6) / tiers) * th
        const half = tw * (1 - k / tiers) * 0.6
        g.fillStyle = dark
        g.beginPath()
        g.moveTo(x - half, y1)
        g.lineTo(x, Math.max(base - th, y0))
        g.lineTo(x + half, y1)
        g.closePath()
        g.fill()
        // snow lying on the upper side of each tier
        g.fillStyle = snow
        g.beginPath()
        g.moveTo(x - half * 0.7, y1 - (y1 - y0) * 0.28)
        g.lineTo(x, Math.max(base - th, y0) + 1)
        g.lineTo(x + half * 0.35, y1 - (y1 - y0) * 0.5)
        g.closePath()
        g.fill()
      }
      x += tw * (0.45 + rnd() * 0.5)
    }
  }, { repeat: true })
}

/** Far hills: two soft ridges, blue-grey and paler, with snow. */
function hillTex() {
  const rnd = random(77)
  return canvasTex(1024, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    // (whole waves across the tile, so its repeats join without a step)
    const ridge = (base, amp, col, seed) => {
      g.fillStyle = col
      g.beginPath()
      g.moveTo(0, h)
      for (let x = 0; x <= w; x += 8) {
        const u = (x / w) * TAU
        const y = base - amp * (0.55 + 0.3 * Math.sin(u * 3 + seed) * Math.sin(u * 2 + seed * 2) + 0.15 * Math.sin(u * 7 + seed)) - rnd() * 2
        g.lineTo(x, y)
      }
      g.lineTo(w, h)
      g.closePath()
      g.fill()
    }
    ridge(h * 0.7, h * 0.45, '#8ea3bd', 1)
    ridge(h * 0.85, h * 0.35, '#6f839e', 4)
  }, { repeat: true })
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

/** A spruce on the shore: tiers of dark cones, a little snow on each. */
function spruce(M, s = 1) {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 1.2 * s, 6).translate(0, 0.6 * s, 0), M.bark)
  g.add(trunk)
  for (let k = 0; k < 4; k++) {
    const r = (1.5 - k * 0.32) * s
    const hgt = (2.2 - k * 0.3) * s
    const y = (0.9 + k * 1.35) * s
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, hgt, 9).translate(0, y + hgt / 2, 0), M.needles)
    const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.62, hgt * 0.42, 9).translate(0, y + hgt * 0.79, 0), M.snow)
    g.add(cone, cap)
  }
  return g
}

/**
 * The bathhouse. `water`: the lake's level outside the window above the hall's floor (m). `lamps`: [{ x, z,
 * light }] pendant lamps (`light: true` for the few that carry a real light). `sun`: the direction toward the
 * low winter sun (it stands over the lake, a little to the left).
 */
export function bathhouseStage({ light = false, x0 = -8, x1 = 8, z0 = -7, z1 = 7, h = 5.2, water = 1.35, lamps = [], sun = [-0.55, 0.075, -0.83], benches = [] } = {}) {
  const group = new THREE.Group()
  const textures = []
  const disposers = []
  const fw = x1 - x0
  const fd = z1 - z0
  const WL = water
  const SUN = new THREE.Vector3(...sun).normalize()
  const keep = t => (textures.push(t), t)

  const mats = {
    wood: new THREE.MeshStandardMaterial({ color: '#a8794c', roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.75 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c99a45', roughness: 0.3, metalness: 0.85 }),
    iron: new THREE.MeshStandardMaterial({ color: '#2c2c30', roughness: 0.5, metalness: 0.6 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#d9d2c4', roughness: 0.95 }),
    stone: new THREE.MeshStandardMaterial({ color: '#7c776e', roughness: 0.9 }),
  }

  // ---- the hall ----
  const sl = keep(slabTex(light))
  sl.repeat.set(1 / 2.4, 1 / 2.4)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  {
    const uv = floorGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fw, uv.getY(i) * fd)
  }
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: sl, roughness: 0.8, color: '#c9c3b8' }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)

  const bt = keep(boardTex(light))
  bt.repeat.set(1 / 2, 1 / 1.4)
  const wallMat = new THREE.MeshStandardMaterial({ map: bt, roughness: 0.75, color: '#d8c8b4' })
  const addWall = (geo, x, z, rotY) => {
    const m = new THREE.Mesh(geo, wallMat)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
    return m
  }
  addWall(wallPiece(-x1, -x0, 0, h), 0, z1, Math.PI)
  addWall(wallPiece(-z1, -z0, 0, h), x0, 0, Math.PI / 2)
  addWall(wallPiece(z0, z1, 0, h), x1, 0, -Math.PI / 2)
  // the window wall: the window from wx0 to wx1, from the kerb to the head
  const WX = 7.4
  const KERB = 0.22
  const HEAD = h - 0.55
  addWall(wallPiece(x0, -WX, 0, h), 0, z0, 0)
  addWall(wallPiece(WX, x1, 0, h), 0, z0, 0)
  addWall(wallPiece(-WX, WX, HEAD, h), 0, z0, 0)
  // skirting boards all round
  const skirt = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.03), mats.dark)
    m.position.set(x, 0.07, z)
    m.rotation.y = rotY
    group.add(m)
  }
  skirt(fw, (x0 + x1) / 2, z1 - 0.015, 0)
  skirt(fd, x0 + 0.015, (z0 + z1) / 2, Math.PI / 2)
  skirt(fd, x1 - 0.015, (z0 + z1) / 2, Math.PI / 2)

  // the window: a kerb, six posts (no post in the middle, so the lake is seen whole), a transom, the glass
  {
    const kerb = new THREE.Mesh(new THREE.BoxGeometry(WX * 2 + 0.3, KERB, 0.36), mats.dark)
    kerb.position.set(0, KERB / 2, z0 + 0.1)
    group.add(kerb)
    const head = new THREE.Mesh(new THREE.BoxGeometry(WX * 2 + 0.3, 0.22, 0.3), mats.dark)
    head.position.set(0, HEAD + 0.05, z0 + 0.08)
    group.add(head)
    const posts = 5
    for (let i = 0; i <= posts; i++) {
      const x = -WX + (i / posts) * WX * 2
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, HEAD - KERB, 0.24), mats.dark)
      p.position.set(x, (HEAD + KERB) / 2, z0 + 0.06)
      group.add(p)
    }
    const transom = new THREE.Mesh(new THREE.BoxGeometry(WX * 2, 0.1, 0.18), mats.dark)
    transom.position.set(0, HEAD - 0.9, z0 + 0.05)
    group.add(transom)
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(WX * 2, HEAD - KERB),
      new THREE.MeshStandardMaterial({ color: '#dfeef6', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.05, depthWrite: false }),
    )
    glass.position.set(0, (HEAD + KERB) / 2, z0 - 0.02)
    group.add(glass)
  }

  // the ceiling: boards along the hall, dark beams across
  {
    const ct = keep(boardTex(light, { base: [150, 104, 64], seed: 9 }))
    ct.repeat.set(1 / 2, 1 / 1.4)
    const geo = wallPiece(z0, z1, x0, x1)
    const ceil = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: ct, roughness: 0.8, color: '#b8a690' }))
    // (the boards' own x runs along -z, their y along x: turned face down)
    ceil.rotation.set(Math.PI / 2, 0, Math.PI / 2)
    ceil.position.set(0, h, 0)
    group.add(ceil)
    for (let z = z0 + 1.5; z < z1 - 0.5; z += 2.5) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.26, 0.2), mats.dark)
      beam.position.set((x0 + x1) / 2, h - 0.13, z)
      group.add(beam)
    }
  }

  // pendant lamps: a dark cord, a brass shade, a warm bulb
  const bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9a0').multiplyScalar(1.6) })
  for (const l of lamps) {
    const y = l.y ?? 3.5
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, h - y, 5), mats.iron)
    cord.position.set(l.x, (h + y) / 2, l.z)
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.24, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#b98a3c', roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide }))
    shade.position.set(l.x, y - 0.1, l.z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), bulbMat)
    bulb.position.set(l.x, y - 0.2, l.z)
    group.add(cord, shade, bulb)
    if (l.light) {
      const pl = new THREE.PointLight('#ffcf94', l.intensity ?? 7, 11, 1.6)
      pl.position.set(l.x, y - 0.35, l.z)
      group.add(pl)
    }
  }

  // benches along the walls: slatted seats on dark legs
  const solids = roomWalls(x0, x1, z0, z1)
  for (const b of benches) {
    const g = new THREE.Group()
    for (let k = 0; k < 4; k++) {
      const slat = new THREE.Mesh(new RoundedBoxGeometry(b.len, 0.04, 0.1, 2, 0.015), mats.wood)
      slat.position.set(0, 0.45, -0.17 + k * 0.115)
      g.add(slat)
    }
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.45, 0.4), mats.dark)
      leg.position.set(s * (b.len / 2 - 0.15), 0.225, 0)
      g.add(leg)
    }
    g.position.set(b.x, 0, b.z)
    g.rotation.y = b.rot ?? 0
    group.add(g)
    solids.push(box(b.x, b.z, Math.abs(Math.cos(b.rot ?? 0)) * b.len + 0.5, Math.abs(Math.sin(b.rot ?? 0)) * b.len + 0.5, { y1: 0.5 }))
  }

  // where a thing on a wall goes: the wall's side, along it, its height
  const onWall = (obj, side, at, y, out = 0.03) => {
    if (side === 'w') obj.position.set(x0 + out, y, at), (obj.rotation.y = Math.PI / 2)
    else if (side === 'e') obj.position.set(x1 - out, y, at), (obj.rotation.y = -Math.PI / 2)
    else if (side === 's') obj.position.set(at, y, z1 - out), (obj.rotation.y = Math.PI)
    else obj.position.set(at, y, z0 + out)
    group.add(obj)
    return obj
  }

  // ---- outside: the sky, the sun, the far shore ----
  const outside = new THREE.Group()
  group.add(outside)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uSun: { value: SUN.clone() },
      uZenith: { value: new THREE.Color('#33598f') },
      uHorizon: { value: new THREE.Color('#b9cde0') },
      uGlow: { value: new THREE.Color('#ffc58f') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun; uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGlow;
      varying vec3 vDir;
      void main() {
        float h = clamp(vDir.y, -1.0, 1.0);
        vec3 c = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.55));
        float s = max(dot(normalize(vDir), uSun), 0.0);
        // the low sun warms the sky round it and along the horizon
        c = mix(c, uGlow, clamp(pow(s, 6.0) * 0.75 + pow(s, 2.0) * (1.0 - clamp(h * 4.0, 0.0, 1.0)) * 0.35, 0.0, 1.0));
        c += vec3(1.0, 0.85, 0.65) * pow(s, 400.0) * 1.5;
        if (h < 0.0) c = mix(uHorizon, vec3(0.62, 0.68, 0.74), clamp(-h * 3.0, 0.0, 1.0));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(240, 32, 16), skyMat)
  sky.position.set(0, 0, z0)
  outside.add(sky)
  // the sun's disc and its glow (a soft sprite)
  const glowTex = keep(canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,248,230,1)')
    grd.addColorStop(0.12, 'rgba(255,232,190,0.95)')
    grd.addColorStop(0.3, 'rgba(255,200,140,0.35)')
    grd.addColorStop(1, 'rgba(255,190,130,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color('#ffffff').multiplyScalar(1.4) }))
  sunSprite.scale.setScalar(26)
  sunSprite.position.copy(SUN).multiplyScalar(200).add(new THREE.Vector3(0, WL, z0))
  outside.add(sunSprite)

  // far hills and the spruce shore: bands round the lake, the window at their middle
  const band = (r, y0, hgt, tex, repeat, span = 3.4) => {
    tex.repeat.set(repeat, 1)
    const geo = new THREE.CylinderGeometry(r, r, hgt, 64, 1, true, Math.PI - span / 2, span)
    geo.translate(0, hgt / 2, 0)
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4, side: THREE.BackSide, fog: true }))
    m.position.set(0, y0, z0)
    outside.add(m)
    return m
  }
  band(180, WL - 2, 42, keep(hillTex()), 3)
  band(96, WL - 0.6, 18, keep(treeLineTex(31, { px: light ? 512 : 1024 })), 6)
  band(70, WL - 0.4, 10, keep(treeLineTex(37, { px: light ? 512 : 1024, dark: '#22353a', fill: 0.62 })), 5, 1.5)
  const shoreSnow = new THREE.MeshStandardMaterial({ color: '#e4ebf2', roughness: 0.95 })
  {
    // the snowy ground beyond the trees, and the near shore curving away on both sides of the hall
    const ring = new THREE.Mesh(new THREE.RingGeometry(68, 228, 48, 1, 0, Math.PI).rotateX(-Math.PI / 2), shoreSnow)
    ring.position.set(0, WL + 0.05, z0)
    outside.add(ring)
  }
  const M = {
    bark: new THREE.MeshStandardMaterial({ color: '#4a3526', roughness: 0.9 }),
    needles: new THREE.MeshStandardMaterial({ color: '#21372e', roughness: 0.85 }),
    snow: shoreSnow,
  }
  const rndT = random(91)
  for (const s of [-1, 1]) {
    // a bank of snow along the shore beside the hall, its spruces
    for (let k = 0; k < 5; k++) {
      const bank = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10), shoreSnow)
      const d = 6 + k * 9
      bank.scale.set(7 + k * 1.5, 1.6, 6)
      bank.position.set(s * (13 + k * 6.5), WL - 0.6, z0 - d)
      outside.add(bank)
      for (let j = 0; j < 2; j++) {
        const tr = spruce(M, 1.1 + rndT() * 0.7)
        tr.position.set(s * (15 + k * 6.5 + rndT() * 3), WL + 0.2, z0 - d - 1 + rndT() * 3)
        tr.rotation.y = rndT() * TAU
        outside.add(tr)
      }
    }
  }
  // a little red cabin on the far shore, its window lit
  {
    const cabin = new THREE.Group()
    const walls = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.6), new THREE.MeshStandardMaterial({ color: '#8c2f22', roughness: 0.8 }))
    walls.position.y = 1.1
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.3, 4).rotateY(Math.PI / 4).scale(1.0, 1, 0.82), shoreSnow)
    roof.position.y = 2.85
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc66e').multiplyScalar(1.5) }))
    win.position.set(0.6, 1.2, 1.31)
    cabin.add(walls, roof, win)
    cabin.position.set(14, WL, z0 - 66)
    cabin.rotation.y = -0.25
    outside.add(cabin)
  }

  // ---- the lake ----
  // the open water's surface: dark, the sky's light along the far part, a slow ripple
  const surfMat = new THREE.ShaderMaterial({
    transparent: false,
    fog: false,
    uniforms: { uTime: { value: 0 }, uDeep: { value: new THREE.Color('#2b4258') }, uSky: { value: new THREE.Color('#b8cadc') }, uSun: { value: SUN.clone() } },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uDeep; uniform vec3 uSky; uniform vec3 uSun;
      varying vec3 vW;
      void main() {
        vec3 v = normalize(vW - cameraPosition);
        float graze = pow(1.0 - clamp(-v.y, 0.0, 1.0), 5.0);
        float rip = sin(vW.x * 1.3 + uTime * 0.9) * sin(vW.z * 1.7 - uTime * 0.7) * 0.5 + 0.5;
        vec3 c = mix(uDeep, uSky, clamp(graze * 0.9 + rip * 0.05, 0.0, 1.0));
        vec3 r = reflect(v, vec3(0.0, 1.0, 0.0));
        c += vec3(1.0, 0.8, 0.55) * pow(max(dot(r, uSun), 0.0), 60.0) * 1.2;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const surface = new THREE.Mesh(new THREE.CircleGeometry(70, 48, 0, Math.PI).rotateX(-Math.PI / 2), surfMat)
  surface.position.set(0, WL, z0 - 0.03)
  outside.add(surface)

  // the ice: one slab whose cut face stands at the glass. Unit thickness, scaled by `ice`; it floats with
  // about 0.917 of its thickness under the water (the density of ice over that of water at 0 °C)
  const SUB = 0.917
  const snow = keep(snowTex())
  snow.repeat.set(30, 18)
  const iceTop = new THREE.MeshStandardMaterial({ map: snow, color: '#ffffff', roughness: 0.6, metalness: 0.0 })
  const cutTex = keep(iceCutTex())
  cutTex.repeat.set(40, 1)
  const iceCut = new THREE.MeshStandardMaterial({ map: cutTex, color: '#ffffff', roughness: 0.15, emissive: '#3d6f90', emissiveIntensity: 0.3, transparent: true, depthWrite: false })
  const iceUnder = new THREE.MeshStandardMaterial({ color: '#a9cde0', roughness: 0.3, emissive: '#3c6f8e', emissiveIntensity: 0.35, side: THREE.DoubleSide })
  const iceSide = new THREE.MeshStandardMaterial({ color: '#cfe8f5', roughness: 0.3 })
  const iceGeo = new THREE.BoxGeometry(150, 1, 62).translate(0, 0.5 - SUB, -31)
  const iceSlab = new THREE.Mesh(iceGeo, [iceSide, iceSide, iceTop, iceUnder, iceCut, iceSide])
  iceSlab.position.set(0, WL, z0 - 0.05)
  outside.add(iceSlab)
  // beyond the slab the ice goes on to the shore as a plain sheet
  const iceFar = new THREE.Mesh(new THREE.RingGeometry(40, 70, 48, 1, 0, Math.PI).rotateX(-Math.PI / 2), iceTop)
  iceFar.position.set(0, WL - 0.03, z0)
  outside.add(iceFar)

  // under the water: the bed sloping away from the glass, a few stones and reeds
  const bt2 = keep(bedTex())
  bt2.repeat.set(10, 7)
  const bed = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), new THREE.MeshStandardMaterial({ map: bt2, roughness: 1, color: '#9a9480' }))
  // from 0.6 m under the floor at the glass down to about 6 m under it, 30 m out
  const BED_DROP = Math.atan2(5.4, 30)
  bed.rotation.x = -Math.PI / 2 - BED_DROP
  bed.position.set(0, -0.6 - Math.sin(BED_DROP) * 16, z0 - Math.cos(BED_DROP) * 16)
  outside.add(bed)
  const bedAt = d => -0.6 - Math.tan(BED_DROP) * d
  const rockMat = new THREE.MeshStandardMaterial({ color: '#59584f', roughness: 0.95 })
  const rndR = random(63)
  for (let i = 0; i < 16; i++) {
    const d = 0.8 + rndR() * 9
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2 + rndR() * 0.45, 0), rockMat)
    r.position.set(-9 + rndR() * 18, bedAt(d) + 0.1, z0 - d)
    r.rotation.set(rndR() * 3, rndR() * 3, rndR() * 3)
    r.scale.y = 0.6
    outside.add(r)
  }
  const reedMat = new THREE.MeshStandardMaterial({ color: '#3e5a3a', roughness: 0.9, side: THREE.DoubleSide })
  for (let i = 0; i < 30; i++) {
    const d = 0.5 + rndR() * 5
    const hgt = 0.6 + rndR() * 1.0
    const reed = new THREE.Mesh(new THREE.PlaneGeometry(0.05, hgt).translate(0, hgt / 2, 0), reedMat)
    const side = rndR() < 0.5 ? -1 : 1
    reed.position.set(side * (4.5 + rndR() * 3.5), bedAt(d), z0 - d)
    reed.rotation.set((rndR() - 0.5) * 0.3, rndR() * 3, (rndR() - 0.5) * 0.3)
    outside.add(reed)
  }

  // the water itself, as seen through the glass: layers that tint whatever lies behind them more and more
  // with distance (the lake's own colour, paler under the ice, deeper below), and an opaque deep at the back
  // (each layer a little deeper in colour than the one before it, and all of them darker downward)
  const waterUni = { uTop: { value: new THREE.Color('#5e97b0') }, uDeep: { value: new THREE.Color('#0c2a40') }, uSurf: { value: WL }, uBot: { value: -3.5 } }
  const layerMat = (alpha, dim) =>
    new THREE.ShaderMaterial({
      transparent: alpha < 1,
      depthWrite: alpha >= 1,
      fog: false,
      uniforms: { ...waterUni, uAlpha: { value: alpha }, uDim: { value: dim } },
      vertexShader: /* glsl */ `
        varying float vY;
        void main() { vec4 w = modelMatrix * vec4(position, 1.0); vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop; uniform vec3 uDeep; uniform float uSurf; uniform float uBot; uniform float uAlpha; uniform float uDim;
        varying float vY;
        void main() {
          float k = clamp((vY - uBot) / (uSurf - uBot), 0.0, 1.0);
          vec3 c = mix(uDeep, uTop, pow(k, 1.4));
          c = mix(c, uDeep, uDim);
          gl_FragColor = vec4(c, uAlpha);
          #include <colorspace_fragment>
        }`,
    })
  const layers = []
  const DEPTHS = light ? [0.08, 2.0, 5.0, 10.0] : [0.08, 1.2, 2.6, 4.6, 7.5, 11.5]
  const BOTTOM = -12
  for (const [i, d] of [...DEPTHS, 19].entries()) {
    const last = i === DEPTHS.length
    const a = last ? 1 : i === 0 ? 0.14 : light ? 0.36 : 0.26
    const m = new THREE.Mesh(new THREE.PlaneGeometry(60, 1).translate(0, 0.5, 0), layerMat(a, (i / DEPTHS.length) * 0.5))
    m.position.set(0, BOTTOM, z0 - d)
    m.renderOrder = -1
    outside.add(m)
    layers.push(m)
  }
  // the surface seen from below, while the lake is open: light shimmering on it
  const underMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#cfeaf2') }, uK: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor; uniform float uK;
      varying vec2 vP;
      void main() {
        vec2 p = vP * 0.6;
        float w = sin(p.x * 3.1 + uTime * 0.7) + sin(p.y * 2.7 - uTime * 0.6) + sin((p.x + p.y) * 2.2 + uTime * 0.9);
        float caustic = pow(abs(sin(w * 1.6)), 6.0);
        gl_FragColor = vec4(uColor * (0.7 + caustic * 0.6), (0.55 + caustic * 0.3) * uK);
        #include <colorspace_fragment>
      }`,
  })
  const under = new THREE.Mesh(new THREE.PlaneGeometry(60, 20).rotateX(Math.PI / 2), underMat)
  under.position.set(0, WL - 0.004, z0 - 10)
  outside.add(under)

  // ---- light ----
  group.add(new THREE.HemisphereLight('#d6e2f0', '#6b5845', light ? 1.15 : 0.9))
  // daylight through the big window, cool, and the low sun's warmth on the snow outside
  const day = new THREE.DirectionalLight('#c4d8f2', 0.75)
  day.position.set(0, 7, z0 - 9)
  day.target.position.set(0, 0, 2)
  group.add(day, day.target)
  const sunLight = new THREE.DirectionalLight('#ffd6a8', 1.1)
  sunLight.position.copy(SUN).multiplyScalar(40).add(new THREE.Vector3(0, 0, z0))
  sunLight.target.position.set(0, 0, z0 - 20)
  group.add(sunLight, sunLight.target)

  // snow falling outside, slowly, past the window
  const FLAKES = light ? 120 : 360
  const flakePos = new Float32Array(FLAKES * 3)
  const flakeSeed = new Float32Array(FLAKES)
  const rndF = random(5)
  for (let i = 0; i < FLAKES; i++) {
    flakePos.set([-12 + rndF() * 24, 0, z0 - 0.4 - rndF() * 14], i * 3)
    flakeSeed[i] = rndF() * 100
  }
  const flakeGeo = new THREE.BufferGeometry()
  flakeGeo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3))
  const flakeBase = flakePos.slice()
  const flakeTex = keep(canvasTex(32, 32, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const flakes = new THREE.Points(flakeGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.07, map: flakeTex, transparent: true, depthWrite: false, opacity: 0.85 }))
  flakes.frustumCulled = false
  flakes.raycast = () => {}
  outside.add(flakes)

  // ---- the lake's state ----
  const state = { ice: 0 }
  const top = new THREE.Color()
  const lake = {
    level: WL,
    glass: z0,
    sub: SUB,
    bedAt,
    slab: iceSlab,
    surface,
    /** ice: thickness in metres (0: open water); top, deep: the water's colour under the surface and deep. */
    set({ ice = state.ice, top: t = null, deep = null } = {}) {
      state.ice = Math.max(0, ice)
      const th = state.ice
      const on = th > 0.004
      iceSlab.visible = on
      iceFar.visible = on
      surface.visible = !on
      iceSlab.scale.y = Math.max(0.004, th)
      // thin ice is dark and glassy (black ice); thicker ice turns white under its snow
      const k = clamp((th - 0.02) / 0.18)
      iceTop.color.set('#55707f').lerp(top.set('#ffffff'), k)
      iceTop.roughness = lerp(0.12, 0.65, k)
      // the water stops under the ice; no shimmer from below once the ice covers it
      const surf = on ? WL - SUB * th : WL
      waterUni.uSurf.value = surf
      for (const m of layers) m.scale.y = surf - BOTTOM
      under.visible = !on
      if (t) waterUni.uTop.value.set(t)
      if (deep) waterUni.uDeep.value.set(deep)
    },
    get ice() {
      return state.ice
    },
  }
  lake.set({ ice: 0 })

  return {
    group,
    mats,
    onWall,
    lake,
    window: { x0: -WX, x1: WX, kerb: KERB, head: HEAD, z: z0 },
    solids,
    env: {
      background: new THREE.Color('#9fb6cf'),
      fog: new THREE.Fog('#a9bdd2', 70, 260),
      exposure: 1.0,
      envIntensity: 0.32,
      bloom: { strength: 0.42, radius: 0.5, threshold: 0.88 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      surfMat.uniforms.uTime.value = t
      underMat.uniforms.uTime.value = t
      for (let i = 0; i < FLAKES; i++) {
        const s = flakeSeed[i]
        flakePos[i * 3] = flakeBase[i * 3] + Math.sin(t * 0.4 + s) * 0.4
        flakePos[i * 3 + 1] = WL + 9 - ((t * 0.45 + s * 0.37) % 9)
        flakePos[i * 3 + 2] = flakeBase[i * 3 + 2] + Math.cos(t * 0.3 + s) * 0.3
      }
      flakeGeo.attributes.position.needsUpdate = true
    },
    dispose() {
      textures.forEach(t => t.dispose())
      disposers.forEach(f => f())
    },
  }
}
