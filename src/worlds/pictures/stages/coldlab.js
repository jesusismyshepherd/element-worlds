// A stage for picture rooms (docs/knowledge/picture-rooms.md): a cold laboratory, a hall where very cold
// liquids are made and handled, whose big sliding doors stand open onto a yard at dusk. Painted block walls
// (a darker band below), a concrete floor, a ceiling of steel trusses with strip lights, frosted pipes along
// the west wall; through the doors in the north wall a concrete apron inside a low fence, dark land beyond,
// far hills, the sky's last glow low ahead and the first stars above. Walking inside the hall (x0..x1,
// z0..z1) and, through the doors, the yard (yard.x0..yard.x1, from the north wall out to yard.z0).
// For the scene: `mats` (plain shared materials), `frost` (frosted pipes and tanks), `pipeRun(points,
// { r, mat })` (a pipe along points with rounded corners), `puffs(max, { additive })` (soft billboards the
// scene moves: mist, steam, smoke, one draw call each), `mist(...)` (cold mist breathing from a point; it
// sinks and spreads on the floor, as cold vapour does). Big surfaces mid-toned: pale ones bloom to white.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box, roomWalls } from '../../../engine/collide.js'

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

/** Painted concrete blocks (0.4 by 0.2 m) in running bond: 4 blocks by 6 rows to the tile (1.6 by 1.2 m),
 *  nearly white so the material's colour is the paint. */
function blockTextures(light) {
  const w = light ? 256 : 512
  const h = Math.round((w * 1.2) / 1.6)
  const bw = w / 4
  const bh = h / 6
  const joint = Math.max(2, Math.round(w / 200))
  const rnd = random(19)
  const map = canvasTex(w, h, g => {
    const img = g.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      const row = Math.floor(y / bh)
      const shift = row % 2 ? bw / 2 : 0
      const yy = y - row * bh
      for (let x = 0; x < w; x++) {
        const xx = (x + shift) % bw
        const j = yy < joint || xx < joint
        const n = rnd() * 14
        const v = j ? 186 + n : 232 + n
        const i = (y * w + x) * 4
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
  return { map, size: [1.6, 1.2] }
}

/** Concrete, 4 m to the tile: mottled grey, saw-cut joints every 2 m, a few stains. */
function concreteTex(light, seed = 7) {
  const s = light ? 256 : 512
  const rnd = random(seed)
  return canvasTex(s, s, g => {
    g.fillStyle = '#c9c9c9'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 900; i++) {
      const v = 170 + rnd() * 70
      g.fillStyle = `rgba(${v},${v},${v + 4},0.18)`
      g.beginPath()
      g.arc(rnd() * s, rnd() * s, 2 + rnd() * s * 0.04, 0, Math.PI * 2)
      g.fill()
    }
    for (let i = 0; i < 5; i++) {
      g.fillStyle = 'rgba(90,96,104,0.12)'
      g.beginPath()
      g.ellipse(rnd() * s, rnd() * s, 20 + rnd() * 60, 10 + rnd() * 40, rnd() * 3, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = 'rgba(60,62,66,0.75)'
    for (const k of [0, s / 2]) {
      g.fillRect(k, 0, 2, s)
      g.fillRect(0, k, s, 2)
    }
  }, { repeat: true })
}

/** Ribbed steel siding (the hall's outside and its doors): vertical ribs every 0.25 m, 1 m to the tile. */
function sidingTex() {
  return canvasTex(128, 32, (g, w, h) => {
    for (let x = 0; x < w; x++) {
      const k = (x % 32) / 32
      const v = 150 + Math.round(70 * Math.sin(k * Math.PI) ** 2) - (k < 0.12 ? 50 : 0)
      g.fillStyle = `rgb(${v},${v},${v})`
      g.fillRect(x, 0, 1, h)
    }
  }, { repeat: true })
}

/** Frost: a fine crust of white crystals, nearly white (the material tints it). */
function frostTex() {
  const rnd = random(83)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#d8dde3'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 2200; i++) {
      const v = 200 + rnd() * 55
      g.fillStyle = `rgba(${v},${v + 2},${v + 6},0.6)`
      const x = rnd() * w
      const y = rnd() * w
      const r = 0.6 + rnd() * 2.2
      g.fillRect(x, y, r, r)
    }
    g.strokeStyle = 'rgba(255,255,255,0.5)'
    g.lineWidth = 1
    for (let i = 0; i < 160; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const a = rnd() * Math.PI
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6)
      g.stroke()
    }
  }, { repeat: true })
}

/** A soft round puff (mist, steam, smoke). */
function puffTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.62)')
    grd.addColorStop(0.7, 'rgba(255,255,255,0.18)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
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

/** A pipe's path through points (Vector3), its corners rounded by `bend` metres. */
function pipePath(points, bend) {
  const path = new THREE.CurvePath()
  let prev = points[0].clone()
  for (let i = 1; i < points.length; i++) {
    const p = points[i]
    if (i < points.length - 1) {
      const a = p.clone().sub(points[i - 1])
      const b = points[i + 1].clone().sub(p)
      const r = Math.min(bend, a.length() / 2, b.length() / 2)
      const c0 = p.clone().addScaledVector(a.normalize(), -r)
      const c1 = p.clone().addScaledVector(b.normalize(), r)
      if (c0.distanceTo(prev) > 1e-4) path.add(new THREE.LineCurve3(prev, c0))
      path.add(new THREE.QuadraticBezierCurve3(c0, p.clone(), c1))
      prev = c1
    } else path.add(new THREE.LineCurve3(prev, p.clone()))
  }
  return path
}

/**
 * Soft billboards facing the eye, `max` of them in one draw call: the scene sets each one's place, size,
 * colour and opacity every frame (set), then how many are shown (count). `additive` for glows.
 */
export function puffCloud(max, { additive = false, map } = {}) {
  const base = new THREE.PlaneGeometry(1, 1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.index = base.index
  geo.setAttribute('position', base.attributes.position)
  geo.setAttribute('uv', base.attributes.uv)
  const pos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3)
  const scl = new THREE.InstancedBufferAttribute(new Float32Array(max), 1)
  const col = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4)
  for (const a of [pos, scl, col]) a.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('iPos', pos)
  geo.setAttribute('iScale', scl)
  geo.setAttribute('iColor', col)
  geo.instanceCount = 0
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: null } }]),
    fog: true,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader: /* glsl */ `
      attribute vec3 iPos;
      attribute float iScale;
      attribute vec4 iColor;
      varying vec2 vUv;
      varying vec4 vColor;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vColor = iColor;
        vec4 mvPosition = modelViewMatrix * vec4(iPos, 1.0);
        mvPosition.xy += position.xy * iScale;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      varying vec2 vUv;
      varying vec4 vColor;
      #include <fog_pars_fragment>
      void main() {
        float a = texture2D(map, vUv).a * vColor.a;
        if (a < 0.004) discard;
        gl_FragColor = vec4(vColor.rgb, a);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
  mat.uniforms.map.value = map
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.raycast = () => {}
  mesh.renderOrder = 4
  return {
    mesh,
    set(i, x, y, z, size, r, g, b, a) {
      pos.setXYZ(i, x, y, z)
      scl.setX(i, size)
      col.setXYZW(i, r, g, b, a)
    },
    set count(n) {
      geo.instanceCount = Math.min(n, max)
      pos.needsUpdate = true
      scl.needsUpdate = true
      col.needsUpdate = true
    },
    dispose() {
      geo.dispose()
      base.dispose()
      mat.dispose()
    },
  }
}

/**
 * The cold laboratory and its yard. `door`: { at (x of its middle), width, height } in the north wall;
 * `yard`: { x0, x1, depth } (the fenced apron outside, depth metres north of the wall). `glow`: the
 * direction (x, z) of the sunset's last light.
 */
export function coldLabStage({ light = false, x0 = -8, x1 = 8, z0 = -5, z1 = 7, h = 6, door = { at: 0, width: 6, height: 4.6 }, yard = { x0: -12, x1: 14, depth: 24 }, glow = [-0.45, -1] } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const T = 0.3 // the walls' thickness
  const yz0 = z0 - yard.depth

  // ---- materials ----
  const blocks = blockTextures(light)
  blocks.map.repeat.set(1 / blocks.size[0], 1 / blocks.size[1])
  textures.push(blocks.map)
  // painted flat (a normal map of the joints banded the walls in rows under the strip lights)
  const wallUpper = new THREE.MeshStandardMaterial({ map: blocks.map, color: '#76838f', roughness: 0.88 })
  const wallLower = new THREE.MeshStandardMaterial({ map: blocks.map, color: '#3a5062', roughness: 0.7 })
  const concrete = concreteTex(light)
  concrete.repeat.set(1 / 4, 1 / 4)
  textures.push(concrete)
  const floorMat = new THREE.MeshStandardMaterial({ map: concrete, color: '#7f858c', roughness: 0.82 })
  const apronMat = new THREE.MeshStandardMaterial({ map: concrete, color: '#6c7078', roughness: 0.92 })
  const siding = sidingTex()
  siding.repeat.set(1, 1)
  textures.push(siding)
  const sidingMat = new THREE.MeshStandardMaterial({ map: siding, color: '#55606e', roughness: 0.6, metalness: 0.35 })
  const ft = frostTex()
  ft.repeat.set(2, 2)
  textures.push(ft)
  const frost = new THREE.MeshStandardMaterial({ map: ft, color: '#c6d2de', roughness: 0.95, emissive: '#7d97b3', emissiveIntensity: 0.16 })
  const mats = {
    steel: new THREE.MeshStandardMaterial({ color: '#9aa3ad', roughness: 0.32, metalness: 0.85 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f36', roughness: 0.7, metalness: 0.4 }),
    paint: new THREE.MeshStandardMaterial({ color: '#c94a3c', roughness: 0.45, metalness: 0.2 }),
    copper: new THREE.MeshStandardMaterial({ color: '#b8703f', roughness: 0.35, metalness: 0.9 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#1d2024', roughness: 0.85 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#d9a62a', roughness: 0.6 }),
    bench: new THREE.MeshStandardMaterial({ color: '#4a5560', roughness: 0.55, metalness: 0.3 }),
  }

  // ---- the hall's floor ----
  {
    const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0)
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (x1 - x0), uv.getY(i) * (z1 - z0))
    const f = new THREE.Mesh(geo, floorMat)
    f.rotation.x = -Math.PI / 2
    f.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
    group.add(f)
  }

  // ---- the walls: a dark band below 1.2 m, pale paint above; the north wall round the doors ----
  const DADO = 1.2
  const wall = (a0, a1, y0, y1, x, z, rotY) => {
    const lo = Math.min(y1, DADO)
    if (y0 < DADO) {
      const m = new THREE.Mesh(wallPiece(a0, a1, y0, lo), wallLower)
      m.position.set(x, 0, z)
      m.rotation.y = rotY
      group.add(m)
    }
    if (y1 > DADO) {
      const m = new THREE.Mesh(wallPiece(a0, a1, Math.max(y0, DADO), y1), wallUpper)
      m.position.set(x, 0, z)
      m.rotation.y = rotY
      group.add(m)
    }
  }
  const dl = door.at - door.width / 2
  const dr = door.at + door.width / 2
  wall(x0, dl, 0, h, 0, z0, 0)
  wall(dr, x1, 0, h, 0, z0, 0)
  wall(dl, dr, door.height, h, 0, z0, 0)
  wall(-x1, -x0, 0, h, 0, z1, Math.PI)
  wall(-z1, -z0, 0, h, x0, 0, Math.PI / 2)
  wall(z0, z1, 0, h, x1, 0, -Math.PI / 2)
  // a rubber kick strip along the foot of the walls
  const strip = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.03), mats.rubber)
    m.position.set(x, 0.06, z)
    m.rotation.y = rotY
    group.add(m)
  }
  strip(dl - x0, (x0 + dl) / 2, z0 + 0.015, 0)
  strip(x1 - dr, (dr + x1) / 2, z0 + 0.015, 0)
  strip(x1 - x0, (x0 + x1) / 2, z1 - 0.015, 0)
  strip(z1 - z0, x0 + 0.015, (z0 + z1) / 2, Math.PI / 2)
  strip(z1 - z0, x1 - 0.015, (z0 + z1) / 2, Math.PI / 2)
  // the doorway's jambs and lintel (the wall's thickness), steel-edged
  for (const x of [dl, dr]) {
    const j = new THREE.Mesh(new THREE.BoxGeometry(0.12, door.height, T), mats.dark)
    j.position.set(x + (x === dl ? -0.06 : 0.06), door.height / 2, z0 - T / 2)
    group.add(j)
  }
  {
    const l = new THREE.Mesh(new THREE.BoxGeometry(door.width + 0.24, 0.12, T), mats.dark)
    l.position.set(door.at, door.height + 0.06, z0 - T / 2)
    group.add(l)
    // a hazard stripe on the threshold
    const sill = new THREE.Mesh(new THREE.BoxGeometry(door.width, 0.012, T + 0.3), mats.yellow)
    sill.position.set(door.at, 0.006, z0 - T / 2)
    group.add(sill)
  }

  // ---- the ceiling: dark panels, steel trusses, strip lights ----
  {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mats.dark)
    c.rotation.x = Math.PI / 2
    c.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
    group.add(c)
    const stripMat = new THREE.MeshStandardMaterial({ color: '#eef5ff', emissive: '#dbe9ff', emissiveIntensity: 1.6 })
    for (let z = z0 + 2; z < z1 - 0.5; z += 3) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.4, 0.16), mats.dark)
      b.position.set((x0 + x1) / 2, h - 0.2, z)
      group.add(b)
      for (const x of [x0 + 3.2, (x0 + x1) / 2, x1 - 3.2]) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.12), stripMat)
        lamp.position.set(x, h - 0.43, z)
        group.add(lamp)
      }
    }
  }
  // cool white light from the strips (a few real lights for many lamps)
  const lights = [
    [x0 + 3.4, z0 + 3.2, 1],
    [x1 - 3.4, z0 + 3.2, 1],
    [(x0 + x1) / 2, z1 - 2.5, 0.8],
  ]
  for (const [x, z, k] of lights) {
    const p = new THREE.PointLight('#e4eeff', (light ? 26 : 30) * k, 13, 1.6)
    p.position.set(x, h - 0.7, z)
    group.add(p)
  }

  // ---- frosted pipes along the west wall, from the corner to the north wall ----
  const pipes = []
  function pipeRun(points, { r = 0.06, mat = frost, bend = 0.3 } = {}) {
    const path = pipePath(points.map(p => (p.isVector3 ? p : new THREE.Vector3(...p))), bend)
    const geo = new THREE.TubeGeometry(path, Math.max(8, Math.round(path.getLength() * 6)), r, 10, false)
    geos.push(geo)
    const m = new THREE.Mesh(geo, mat)
    group.add(m)
    pipes.push(m)
    return m
  }
  for (const [y, r] of [[4.5, 0.07], [4.85, 0.05]]) {
    pipeRun([[x0 + 0.3, y, z1 - 0.4], [x0 + 0.3, y, z0 + 0.3], [door.at - door.width / 2 - 0.4, y, z0 + 0.3]], { r })
  }
  for (let z = z0 + 1; z < z1; z += 2.2) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.06), mats.dark)
    b.position.set(x0 + 0.17, 4.42, z)
    group.add(b)
  }

  // ---- the doors: two ribbed steel leaves slid open along the outside of the north wall ----
  {
    const leafW = door.width / 2 + 0.25
    for (const s of [-1, 1]) {
      const geo = new THREE.BoxGeometry(leafW, door.height + 0.15, 0.1)
      const uv = geo.attributes.uv
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * leafW * 1.2, uv.getY(i))
      const leaf = new THREE.Mesh(geo, sidingMat)
      const cx = s < 0 ? dl - leafW / 2 + 0.1 : dr + leafW / 2 - 0.1
      leaf.position.set(cx, (door.height + 0.15) / 2, z0 - T - 0.08)
      group.add(leaf)
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(door.width * 2 + 1, 0.14, 0.14), mats.dark)
    rail.position.set(door.at, door.height + 0.3, z0 - T - 0.1)
    group.add(rail)
  }

  // ---- the hall from outside: ribbed siding, a flat roof's edge ----
  {
    const out = (w, hh, x, z, rotY) => {
      const geo = new THREE.PlaneGeometry(w, hh)
      const uv = geo.attributes.uv
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * 1.2, uv.getY(i))
      const m = new THREE.Mesh(geo, sidingMat)
      m.position.set(x, hh / 2, z)
      m.rotation.y = rotY
      group.add(m)
    }
    const H = h + 0.6
    const zo = z0 - T
    // the north face round the doorway
    {
      const w1 = dl - (x0 - T)
      const w2 = x1 + T - dr
      out(w1, H, x0 - T + w1 / 2, zo, Math.PI)
      out(w2, H, dr + w2 / 2, zo, Math.PI)
      const top = new THREE.Mesh(new THREE.PlaneGeometry(door.width, H - door.height), sidingMat)
      top.position.set(door.at, door.height + (H - door.height) / 2, zo)
      top.rotation.y = Math.PI
      group.add(top)
    }
    out(z1 - zo + T, H, x0 - T, (zo + z1 + T) / 2, -Math.PI / 2)
    out(z1 - zo + T, H, x1 + T, (zo + z1 + T) / 2, Math.PI / 2)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 2 * T + 0.2, 0.3, 0.3), mats.dark)
    cap.position.set((x0 + x1) / 2, H, zo - 0.05)
    group.add(cap)
    // a lamp over the doorway, warm against the dusk
    const lampMat = new THREE.MeshStandardMaterial({ color: '#fff0d0', emissive: '#ffd59a', emissiveIntensity: 2.4 })
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.25), lampMat)
    lamp.position.set(door.at, door.height + 0.75, zo - 0.2)
    group.add(lamp)
  }

  // ---- the yard: a concrete apron inside a low fence ----
  {
    const w = yard.x1 - yard.x0
    const d = yard.depth
    const geo = new THREE.PlaneGeometry(w, d)
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w, uv.getY(i) * d)
    const a = new THREE.Mesh(geo, apronMat)
    a.rotation.x = -Math.PI / 2
    a.position.set((yard.x0 + yard.x1) / 2, 0.002, z0 - T - d / 2 + T / 2)
    group.add(a)
    // the fence: posts and three wires, on the yard's three open sides
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6)
    const posts = []
    const run = (ax, az, bx, bz) => {
      const len = Math.hypot(bx - ax, bz - az)
      const n = Math.max(1, Math.round(len / 3))
      for (let i = 0; i <= n; i++) posts.push([ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n])
      for (const y of [0.45, 0.85, 1.22]) {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 4), mats.steel)
        wire.position.set((ax + bx) / 2, y, (az + bz) / 2)
        wire.rotation.z = Math.PI / 2
        wire.rotation.y = -Math.atan2(bz - az, bx - ax)
        group.add(wire)
      }
    }
    const zw = z0 - T
    run(x0 - T, zw, yard.x0, zw)
    run(yard.x0, zw, yard.x0, yz0)
    run(yard.x0, yz0, yard.x1, yz0)
    run(yard.x1, yz0, yard.x1, zw)
    run(yard.x1, zw, x1 + T, zw)
    const inst = new THREE.InstancedMesh(postGeo, mats.dark, posts.length)
    const m = new THREE.Matrix4()
    posts.forEach(([x, z], i) => inst.setMatrixAt(i, m.makeTranslation(x, 0.65, z)))
    group.add(inst)
  }

  // ---- the land beyond: dark scrub, far hills, the dusk sky ----
  {
    const land = new THREE.Mesh(new THREE.CircleGeometry(290, 48), new THREE.MeshStandardMaterial({ color: '#2b2c36', roughness: 1 }))
    land.rotation.x = -Math.PI / 2
    land.position.y = -0.02
    group.add(land)
    // far hills: a ring of dark ridges against the glow
    const rnd = random(5)
    const N = 96
    const R = 260
    const pos = []
    const idx = []
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      const hh = 7 + 10 * Math.abs(Math.sin(a * 3.1 + 1)) * (0.6 + 0.4 * rnd()) + 5 * Math.sin(a * 11 + 2) ** 2
      pos.push(Math.cos(a) * R, -1, Math.sin(a) * R, Math.cos(a) * R, hh, Math.sin(a) * R)
      if (i < N) {
        const k = i * 2
        // wound so the faces look inward
        idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const hills = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#0d1126', side: THREE.DoubleSide, fog: false }))
    group.add(hills)
  }
  const glowDir = new THREE.Vector3(glow[0], 0, glow[1]).normalize()
  const skyU = { uGlow: { value: glowDir }, uTime: { value: 0 } }
  {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(300, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: skyU,
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uGlow; uniform float uTime;
          varying vec3 vDir;
          float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
          void main() {
            vec3 d = normalize(vDir);
            float h = max(d.y, 0.0);
            // the picture's navy above, a lighter band near the horizon
            vec3 zen = vec3(0.035, 0.05, 0.14);
            vec3 hor = vec3(0.2, 0.2, 0.38);
            vec3 c = mix(hor, zen, pow(h, 0.45));
            // the sunset's last glow, low on one side: orange at the horizon, rose above it
            float s = max(dot(normalize(vec3(d.x, 0.0, d.z)), uGlow), 0.0);
            float low = exp(-h * 9.0);
            c += vec3(1.0, 0.45, 0.16) * pow(s, 6.0) * low * 0.9;
            c += vec3(0.55, 0.25, 0.38) * pow(s, 2.0) * exp(-h * 4.0) * 0.35;
            // the first stars, high and away from the glow: small round points
            vec3 q = floor(d * 420.0);
            float n = hash(q);
            vec3 f = fract(d * 420.0) - 0.5;
            float star = step(0.9965, n) * (0.5 + 0.5 * hash(q + 7.0)) * smoothstep(0.42, 0.08, length(f));
            float tw = 0.75 + 0.25 * sin(uTime * (1.0 + 3.0 * hash(q + 3.0)) + n * 50.0);
            c += vec3(star * tw) * smoothstep(0.12, 0.45, h) * (1.0 - 0.7 * pow(s, 3.0)) * 1.3;
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    )
    sky.renderOrder = -10
    group.add(sky)
  }
  // dusk light: the sky's blue from above, a low warm light from the glow, faint
  group.add(new THREE.HemisphereLight('#5d6a9c', '#1c1a22', light ? 0.9 : 0.75))
  const dusk = new THREE.DirectionalLight('#ff9a66', 0.55)
  dusk.position.set(glowDir.x * 50, 8, glowDir.z * 50)
  group.add(dusk)

  // ---- cold mist from a point: it spills over a rim, sinks and spreads on the floor ----
  const puffMap = puffTex()
  textures.push(puffMap)
  const mists = []
  /** Mist breathing from (x, y, z): `rate` how strongly (0 stops it), `spread` how far it spreads on the
   *  floor (m), `floor` the height it settles on. Returns { group, set rate }. */
  function mist({ x, y, z, count = 26, spread = 0.9, floor = 0, size = 0.32, rate = 1, seed = 1 }) {
    const n = light ? Math.ceil(count / 2) : count
    const cloud = puffCloud(n, { map: puffMap })
    group.add(cloud.mesh)
    const rnd = random(seed)
    const parts = Array.from({ length: n }, () => ({ ph: rnd(), a: rnd() * Math.PI * 2, v: 0.5 + rnd() * 0.5, life: 3 + rnd() * 2.5 }))
    const m = { x, y, z, rate, cloud, parts, spread, floor, size }
    mists.push(m)
    return {
      group: cloud.mesh,
      get rate() {
        return m.rate
      },
      set rate(r) {
        m.rate = r
      },
      move(nx, ny, nz) {
        m.x = nx
        m.y = ny
        m.z = nz
      },
    }
  }
  function updateMists(t) {
    for (const m of mists) {
      let k = 0
      if (m.rate > 0.01) {
        const drop = Math.max(0, m.y - m.floor)
        for (const p of m.parts) {
          const s = ((t / p.life + p.ph) % 1) * p.life
          const f = s / p.life
          // over the rim, then down (cold mist is heavier than the air), then spreading along the floor
          const out = Math.min(1, s * 0.6) * 0.12 + f * m.spread * p.v
          const fall = Math.min(drop, 0.5 * 0.9 * s * s)
          const px = m.x + Math.cos(p.a) * out
          const pz = m.z + Math.sin(p.a) * out
          const py = m.y - fall + 0.04 + (fall >= drop ? 0.06 * f : 0)
          const a = Math.sin(Math.PI * f) * 0.3 * m.rate
          m.cloud.set(k++, px, py, pz, m.size * (0.5 + 1.4 * f), 0.86, 0.9, 0.96, a)
        }
      }
      m.cloud.count = k
    }
  }

  // ---- what can be walked: the hall, the doorway, the yard ----
  const solids = roomWalls(x0, x1, z0, z1, [{ side: 'n', at: door.at, width: door.width }], T)
  {
    const zw = z0 - T
    solids.push(
      box((yard.x0 + x0 - T) / 2, zw - 0.15, x0 - T - yard.x0, 0.3),
      box((x1 + T + yard.x1) / 2, zw - 0.15, yard.x1 - x1 - T, 0.3),
      box(yard.x0 - 0.15, (zw + yz0) / 2, 0.3, zw - yz0),
      box(yard.x1 + 0.15, (zw + yz0) / 2, 0.3, zw - yz0),
      box((yard.x0 + yard.x1) / 2, yz0 - 0.15, yard.x1 - yard.x0, 0.3),
    )
  }

  return {
    group,
    mats,
    frost,
    wallUpper,
    pipeRun,
    mist,
    puffs: (max, opts = {}) => puffCloud(max, { map: puffMap, ...opts }),
    puffMap,
    solids,
    env: {
      background: new THREE.Color('#141632'),
      fog: new THREE.Fog('#232546', 70, 320),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
      fov: 62,
      far: 700,
    },
    cameraBounds: { minX: yard.x0 + 0.4, maxX: yard.x1 - 0.4, minY: 0.35, maxY: h - 0.4, minZ: yz0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      skyU.uTime.value = t
      updateMists(t)
    },
    dispose() {
      textures.forEach(t => t.dispose())
      geos.forEach(g => g.dispose())
      for (const m of mists) m.cloud.dispose()
    },
  }
}
