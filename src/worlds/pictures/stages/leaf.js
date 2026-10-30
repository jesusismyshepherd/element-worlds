// A stage for picture rooms (docs/knowledge/picture-rooms.md): inside a leaf, shrunk smaller than its cells,
// standing in the air spaces of its spongy layer on the inside of the leaf's lower skin. Overhead, the
// palisade cells hang from the upper skin like organ pipes, packed with chloroplasts that glow as the
// sunlight comes through them; round about, the rounded spongy cells with air between them; a vein
// crossing at the back, water glowing along it; underfoot the lower skin's jigsaw cells, with holes where
// the scene puts its stomata (`holes`). `setSun(k)`, 0 dark to 1 full sun: the light, the shafts between
// the palisade cells, the glow of every chloroplast, the haze. Surfaces are mid-toned (pale ones bloom
// to white). Walking inside a circle of `radius`; `cells` are spongy cells standing in it ([x, z, r]).
// Also `lumpyGeometry(seed)` (a cell's rounded, uneven shape) and `chloroTexture(seed, opts)` (a cell
// wall with chloroplasts behind it, and their glow) for the scene's own cells.
import * as THREE from 'three'
import { canvasTex, random, lerp } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'
import { circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2
export const LEAF = { ceiling: 10.45, palisade: 5.8 }

/** A cell's shape: a sphere made uneven by a few broad waves (normals recomputed). */
export function lumpyGeometry(seed, { detail = 28, bump = 1 } = {}) {
  const rnd = random(seed)
  const geo = new THREE.SphereGeometry(1, detail, Math.round(detail * 0.65))
  const waves = Array.from({ length: 5 }, () => ({
    d: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
    f: 1.2 + rnd() * 2.2,
    p: rnd() * TAU,
    a: (0.035 + rnd() * 0.06) * bump,
  }))
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    let k = 1
    for (const w of waves) k += w.a * Math.sin(v.dot(w.d) * w.f * Math.PI + w.p)
    p.setXYZ(i, v.x * k, v.y * k, v.z * k)
  }
  geo.computeVertexNormals()
  return geo
}

/** A cell wall with chloroplasts pressed against it: { map, glow } (the glow: the chloroplasts alone, for
 *  emissiveMap). Seamless, so it repeats. */
export function chloroTexture(seed, { w = 512, h = 256, count = 260, base = '#8bb96a', chl = '#3f8f2c', len = 10 } = {}) {
  const rnd = random(seed)
  const spots = Array.from({ length: count }, () => ({ x: rnd() * w, y: rnd() * h, a: rnd() * Math.PI, s: 0.7 + rnd() * 0.6, l: rnd() }))
  const draw = glow => (g) => {
    g.fillStyle = glow ? '#000000' : base
    g.fillRect(0, 0, w, h)
    if (!glow) {
      // the wall's own faint texture: soft lighter blotches
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(255,255,240,${0.03 + rnd() * 0.05})`
        g.beginPath()
        g.arc(rnd() * w, rnd() * h, 10 + rnd() * 30, 0, TAU)
        g.fill()
      }
    }
    for (const s of spots) {
      for (const dx of [-w, 0, w]) {
        for (const dy of [-h, 0, h]) {
          const x = s.x + dx
          const y = s.y + dy
          if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue
          const rx = len * s.s
          const ry = len * s.s * 0.55
          if (glow) {
            g.fillStyle = `rgba(150,255,110,${0.55 + s.l * 0.45})`
          } else {
            const grd = g.createRadialGradient(x - rx * 0.2, y - ry * 0.3, 1, x, y, rx)
            grd.addColorStop(0, '#8fd36a')
            grd.addColorStop(0.6, chl)
            grd.addColorStop(1, '#2a6a1f')
            g.fillStyle = grd
          }
          g.beginPath()
          g.ellipse(x, y, rx, ry, s.a, 0, TAU)
          g.fill()
        }
      }
    }
  }
  return { map: canvasTex(w, h, draw(false), { repeat: true }), glow: canvasTex(w, h, draw(true), { repeat: true }) }
}

/** The lower skin seen from inside: jigsaw-shaped cells (a Voronoi pattern with wavy borders), seamless. */
function jigsawTexture(seed, { size = 512, n = 7, base = '#7f9b70', seam = '#4b6643' } = {}) {
  const rnd = random(seed)
  const pts = Array.from({ length: n }, () => [rnd(), rnd(), (rnd() - 0.5) * 0.07])
  const cb = new THREE.Color(base)
  const cs = new THREE.Color(seam)
  const c = new THREE.Color()
  return canvasTex(size, size, (g, w) => {
    const img = g.createImageData(w, w)
    for (let y = 0; y < w; y++) {
      for (let x = 0; x < w; x++) {
        const u0 = x / w
        const v0 = y / w
        // the warp is periodic in the tile, so the pattern repeats without a seam
        const u = u0 + 0.03 * Math.sin(TAU * (4 * v0 + u0)) + 0.016 * Math.sin(TAU * (7 * u0 - 3 * v0))
        const v = v0 + 0.03 * Math.sin(TAU * (4 * u0 - v0)) + 0.016 * Math.sin(TAU * (6 * v0 + 2 * u0))
        let d1 = 9
        let d2 = 9
        let k = 0
        for (let i = 0; i < n; i++) {
          let dx = u - pts[i][0]
          let dy = v - pts[i][1]
          dx -= Math.round(dx)
          dy -= Math.round(dy)
          const d = dx * dx + dy * dy
          if (d < d1) {
            d2 = d1
            d1 = d
            k = i
          } else if (d < d2) d2 = d
        }
        const edge = Math.sqrt(d2) - Math.sqrt(d1)
        const s = Math.min(1, edge / 0.018)
        c.copy(cb).offsetHSL(0, 0, pts[k][2] - Math.sqrt(d1) * 0.12)
        c.lerp(cs, 1 - s * s)
        const o = (y * w + x) * 4
        img.data[o] = c.r * 255
        img.data[o + 1] = c.g * 255
        img.data[o + 2] = c.b * 255
        img.data[o + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true, srgb: false })
}

export function leafStage({ radius = 10, light = false, holes = [], cells = [], sun: sun0 = 1 } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const updates = []
  const rnd = random(53)
  const dummy = new THREE.Object3D()

  // ---- the haze all round: bright where the light comes from above, deep green below ----
  const SKY = {
    top: [new THREE.Color('#17302a'), new THREE.Color('#e0f59a')],
    mid: [new THREE.Color('#12301f'), new THREE.Color('#42803a')],
    low: [new THREE.Color('#08180e'), new THREE.Color('#1c3d1f')],
    fog: [new THREE.Color('#163323'), new THREE.Color('#3f7a34')],
  }
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uTop: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uLow: { value: new THREE.Color() } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uLow;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 c = h > 0.0 ? mix(uMid, uTop, pow(h, 0.75)) : mix(uMid, uLow, pow(-h, 0.5));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const dome = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), domeMat)
  group.add(dome)
  const fogColor = new THREE.Color()
  const fog = new THREE.Fog(fogColor, 12, 44)
  const background = new THREE.Color()

  // ---- the floor: the lower skin, holes where the stomata are ----
  const TILE = 9
  const floorTex = jigsawTexture(11)
  floorTex.repeat.set(1 / TILE, 1 / TILE)
  const shape = new THREE.Shape()
  shape.absarc(0, 0, 46, 0, TAU, false)
  for (const h of holes) {
    const hole = new THREE.Path()
    // (the shape's y is the world's -z once the floor is laid down; `rot` turns the hole as rotation.y
    // turns a group, rx along the group's x)
    hole.absellipse(h.x, -h.z, h.rx, h.rz, 0, TAU, true, h.rot ?? 0)
    shape.holes.push(hole)
  }
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 })
  const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape, 64), floorMat)
  floor.rotation.x = -Math.PI / 2
  group.add(floor)
  disposers.push(() => floorTex.dispose())

  // ---- the spongy cells: round about, a few overhead, and the ones standing among us ----
  const tex = chloroTexture(7)
  disposers.push(() => {
    tex.map.dispose()
    tex.glow.dispose()
  })
  const cellMat = new THREE.MeshStandardMaterial({ map: tex.map, emissiveMap: tex.glow, emissive: '#8cff5a', emissiveIntensity: 0.3, roughness: 0.55 })
  const shapes = [lumpyGeometry(3), lumpyGeometry(4), lumpyGeometry(5)]
  const placed = [[], [], []]
  const ringN = light ? 26 : 40
  for (let i = 0; i < ringN; i++) {
    const a = (i / ringN) * TAU + rnd() * 0.15
    const r = radius + 1.8 + rnd() * 9
    const s = 1.5 + rnd() * 1.4
    placed[i % 3].push({ x: Math.cos(a) * r, y: 0.4 + rnd() * 5.2, z: Math.sin(a) * r, sx: s, sy: s * (0.8 + rnd() * 0.4), sz: s * (0.85 + rnd() * 0.3), ry: rnd() * TAU })
  }
  // a second, farther ring, higher up: the spongy layer goes on into the haze
  for (let i = 0; i < (light ? 14 : 24); i++) {
    const a = rnd() * TAU
    const r = radius + 10 + rnd() * 12
    const s = 2.2 + rnd() * 1.8
    placed[i % 3].push({ x: Math.cos(a) * r, y: 1 + rnd() * 5, z: Math.sin(a) * r, sx: s, sy: s * 0.9, sz: s, ry: rnd() * TAU })
  }
  for (const [x, z, r] of cells) {
    placed[Math.floor(rnd() * 3)].push({ x, y: r * 0.85, z, sx: r, sy: r * 1.15, sz: r, ry: rnd() * TAU })
  }
  const solids = ringWall(radius)
  for (const [x, z, r] of cells) solids.push(circle(x, z, r * 0.95))
  placed.forEach((list, k) => {
    const m = new THREE.InstancedMesh(shapes[k], cellMat, list.length)
    list.forEach((c, i) => {
      dummy.position.set(c.x, c.y, c.z)
      dummy.rotation.set(0, c.ry, 0)
      dummy.scale.set(c.sx, c.sy, c.sz)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    group.add(m)
  })

  // ---- the palisade cells, hanging from the upper skin ----
  const ptex = chloroTexture(9, { w: 256, h: 512, count: 260, len: 9, base: '#82b862' })
  disposers.push(() => {
    ptex.map.dispose()
    ptex.glow.dispose()
  })
  ptex.map.repeat.set(2, 2)
  ptex.glow.repeat.set(2, 2)
  const palMat = new THREE.MeshStandardMaterial({ map: ptex.map, emissiveMap: ptex.glow, emissive: '#9dff6a', emissiveIntensity: 0.6, roughness: 0.6 })
  const PAL = { r: 0.74, len: 3.6 }
  const palGeo = new THREE.CapsuleGeometry(PAL.r, PAL.len, light ? 3 : 5, light ? 9 : 12)
  const sp = 1.62
  const R = light ? 17 : 25
  const cols = []
  const N = Math.ceil(R / sp) + 1
  for (let j = -N; j <= N; j++) {
    for (let i = -N; i <= N; i++) {
      const x = (i + (j & 1) * 0.5) * sp + (rnd() - 0.5) * 0.22
      const z = j * sp * 0.866 + (rnd() - 0.5) * 0.22
      if (Math.hypot(x, z) > R) continue
      cols.push({ x, z, y: LEAF.palisade + (PAL.len + 2 * PAL.r) / 2 + rnd() * 0.55, s: 0.88 + rnd() * 0.14, tx: (rnd() - 0.5) * 0.06, tz: (rnd() - 0.5) * 0.06 })
    }
  }
  const palisade = new THREE.InstancedMesh(palGeo, palMat, cols.length)
  cols.forEach((c, i) => {
    dummy.position.set(c.x, c.y, c.z)
    dummy.rotation.set(c.tx, rnd() * TAU, c.tz)
    dummy.scale.set(c.s, 1, c.s)
    dummy.updateMatrix()
    palisade.setMatrixAt(i, dummy.matrix)
  })
  group.add(palisade)

  // ---- the upper skin: the light coming through it, seen between the palisade cells ----
  const ceilMat = new THREE.MeshBasicMaterial({ color: '#f2ffc2', side: THREE.DoubleSide })
  const ceiling = new THREE.Mesh(new THREE.CircleGeometry(60, 48), ceilMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = LEAF.ceiling
  group.add(ceiling)

  // ---- shafts of sunlight between the palisade cells ----
  const shaftMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color('#fbffd6') }, uK: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uK;
      varying vec2 vUv;
      void main() {
        float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
        float along = smoothstep(0.0, 0.8, vUv.y);
        gl_FragColor = vec4(uColor, across * along * 0.13 * uK);
      }`,
  })
  const shafts = []
  const nShafts = light ? 5 : 10
  for (let i = 0; i < nShafts; i++) {
    const a = (i / nShafts) * TAU + 0.3
    const r = 3.5 + (i % 3) * 3.2
    const w = 0.7 + (i % 4) * 0.35
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, LEAF.palisade + 0.4).translate(0, (LEAF.palisade + 0.4) / 2, 0), shaftMat)
    m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r)
    m.rotation.z = 0.1
    group.add(m)
    shafts.push({ m, phase: i * 1.9 })
  }

  // ---- a vein at the back: the bundle sheath's cells round it, water glowing as it flows along ----
  const sheathTex = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#4d7f3c'
    g.fillRect(0, 0, w, h)
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 12; i++) {
        const x = (i + (row % 2) * 0.5) * (w / 12)
        const y = row * (h / 4)
        g.fillStyle = `rgb(${120 + (i * 7 + row * 13) % 30},${168 + (i * 5) % 24},${96 + (row * 11) % 20})`
        g.beginPath()
        g.roundRect(x + 3, y + 3, w / 12 - 6, h / 4 - 6, 10)
        g.fill()
      }
    }
  }, { repeat: true })
  const flowTex = canvasTex(256, 64, (g, w, h) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 18; i++) {
      const x = (i / 18) * w + (i % 3) * 5
      const y = ((i * 37) % 64)
      const grd = g.createLinearGradient(x, 0, x + 40, 0)
      grd.addColorStop(0, 'rgba(90,170,255,0)')
      grd.addColorStop(0.7, 'rgba(120,200,255,0.9)')
      grd.addColorStop(1, 'rgba(90,170,255,0)')
      g.fillStyle = grd
      g.fillRect(x, y, 40, 4)
    }
  }, { repeat: true })
  sheathTex.repeat.set(14, 3)
  flowTex.repeat.set(6, 1)
  disposers.push(() => {
    sheathTex.dispose()
    flowTex.dispose()
  })
  // (the water's glow kept faint: bright streaks far off in the haze read as lines across the screen)
  const veinMat = new THREE.MeshStandardMaterial({ map: sheathTex, emissiveMap: flowTex, emissive: '#7cc4ff', emissiveIntensity: 0.3, roughness: 0.6 })
  const vein = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 80, 28, 1, true), veinMat)
  vein.rotation.z = Math.PI / 2
  vein.position.set(0, 2.4, -radius - 4.5)
  group.add(vein)
  updates.push((t, dt) => {
    flowTex.offset.x -= dt * 0.12
  })

  // ---- specks drifting in the air spaces ----
  const specks = motes({ count: 450, radius: radius + 5, y0: 0.2, y1: 6, color: '#f6ffd8', size: 0.045, opacity: 0.5, speed: 0.08, light })
  group.add(specks.group)
  updates.push(t => specks.update(t))

  // ---- light: from above, through the leaf ----
  const hemi = new THREE.HemisphereLight('#eaffd2', '#3a5a32', 1)
  const sunLight = new THREE.DirectionalLight('#fff4d0', 1)
  sunLight.position.set(2, 14, 3)
  group.add(hemi, sunLight, sunLight.target)

  let sunK = -1
  const setSun = k => {
    if (Math.abs(k - sunK) < 1e-4) return
    sunK = k
    domeMat.uniforms.uTop.value.copy(SKY.top[0]).lerp(SKY.top[1], k)
    domeMat.uniforms.uMid.value.copy(SKY.mid[0]).lerp(SKY.mid[1], k)
    domeMat.uniforms.uLow.value.copy(SKY.low[0]).lerp(SKY.low[1], k)
    fogColor.copy(SKY.fog[0]).lerp(SKY.fog[1], k)
    fog.color.copy(fogColor)
    background.copy(fogColor)
    hemi.intensity = lerp(0.45, 0.85, k)
    sunLight.intensity = lerp(0.1, 1.25, k)
    ceilMat.color.set('#f2ffc2').multiplyScalar(lerp(0.12, 1.15, k))
    shaftMat.uniforms.uK.value = k
    palMat.emissiveIntensity = lerp(0.06, 0.55, k)
    cellMat.emissiveIntensity = lerp(0.04, 0.2, k)
  }
  setSun(sun0)

  let last = 0
  return {
    group,
    solids,
    env: {
      background,
      fog,
      exposure: 0.95,
      envIntensity: 0.2,
      bloom: { strength: 0.5, radius: 0.55, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 3.9, minZ: -radius - 1, maxZ: radius + 1 },
    cellMat,
    setSun,
    update(t, camera) {
      const dt = Math.min(0.1, Math.max(0, t - last))
      last = t
      for (const { m, phase } of shafts) {
        if (camera) m.rotation.y = Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z)
        m.rotation.z = 0.1 + Math.sin(t * 0.2 + phase) * 0.04
      }
      for (const u of updates) u(t, dt)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
