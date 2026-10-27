// The pieces of the allotropes gallery, each a builder returning { group, update(dt, t), ...actions }:
// the graphene floor (a shader: the honeycomb drawn exactly at 0.5 m per ångström), the hall, the
// diamond lattice, the brilliant, graphite's sliding sheets, the giant pencil, the nanotube tunnel, the
// C60 dome, the football, the sticky-tape station and the diamond press.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { ballStick, glowMat, plinth, taperedTube, easeInOut, easeOut, smooth, clamp, paint, nearFade } from './kit.js'
import { diamondCluster, graphiteStack, inHexagon, nanotube, c60, brilliant, cuboOctahedron, GRAPHENE, norm, add, mul } from './structures.js'
import { facetGeometry, gemMaterial, gemMesh, glints } from './gem.js'
import { HONEY_GLSL } from './honeycomb.js'

export const ACCENT = '#7fd4ff'
const GOLD = '#ffd166'

// ---------------------------------------------------------------- the floor
const FLOOR_GLSL = /* glsl */ `
  ${HONEY_GLSL}
  vec3 grapheneGlow(vec2 xz) {
    vec2 ink = honeyInk(xz, uBond, 0.035, 0.12);
    vec2 h = honey(xz, uBond);
    float px = length(fwidth(xz)) / uBond;
    float far = smoothstep(0.05, 0.22, px);
    float halo = mix(exp(-h.y * h.y * 22.0) + exp(-h.x * h.x * 260.0) * 0.5, 0.14, far);
    float wave = 0.72 + 0.28 * sin(xz.x * 0.29 + uTime * 0.45) * sin(xz.y * 0.21 - uTime * 0.33);
    float r = length(xz - uRipple.xy);
    float age = uTime - uRipple.z;
    float ripple = age > 0.0 ? uRipple.w * exp(-pow(r - age * 7.5, 2.0) * 0.5) * exp(-age * 0.15) : 0.0;
    vec3 c = uLine * (ink.x * 0.3 + halo * 0.08) + uNode * ink.y * 0.5;
    return c * (wave + ripple * 2.6);
  }
`

export function grapheneFloor({ width, depth, cx, cz, bond }) {
  const uniforms = {
    uTime: { value: 0 },
    uBond: { value: bond },
    uLine: { value: new THREE.Color('#4cc3ff') },
    uNode: { value: new THREE.Color('#d9f5ff') },
    uRipple: { value: new THREE.Vector4(0, 0, -100, 0) },
  }
  const mat = new THREE.MeshStandardMaterial({ color: '#070b1e', roughness: 0.26, metalness: 0.55, envMapIntensity: 0.8 })
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, uniforms)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWorldP = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vWorldP;
        uniform float uTime; uniform float uBond; uniform vec3 uLine; uniform vec3 uNode; uniform vec4 uRipple;
        ${FLOOR_GLSL}`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += grapheneGlow(vWorldP.xz);')
  }
  mat.customProgramCacheKey = () => 'carbon-graphene-floor'
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.set(cx, 0, cz)
  return {
    mesh,
    update(t) {
      uniforms.uTime.value = t
    },
    ripple(x, z, t, strength = 1) {
      uniforms.uRipple.value.set(x, z, t, strength)
    },
  }
}

// ---------------------------------------------------------------- the hall
export function hallShell({ x0, x1, z0, z1, h, light }) {
  const g = new THREE.Group()
  const wallMat = new THREE.MeshStandardMaterial({ color: '#111a40', roughness: 0.8, metalness: 0.15 })
  const pilMat = new THREE.MeshStandardMaterial({ color: '#19224d', roughness: 0.5, metalness: 0.35 })
  const strip = glowMat(ACCENT, 0.95)
  const t = 0.6
  const W = x1 - x0
  const D = z1 - z0
  const box = (w, hh, d, x, y, z, mat = wallMat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mat)
    m.position.set(x, y, z)
    g.add(m)
    return m
  }
  box(t, h, D + 2 * t, x0 - t / 2, h / 2, (z0 + z1) / 2)
  box(t, h, D + 2 * t, x1 + t / 2, h / 2, (z0 + z1) / 2)
  box(W, h, t, (x0 + x1) / 2, h / 2, z0 - t / 2)
  box(W, h, t, (x0 + x1) / 2, h / 2, z1 + t / 2)
  // pilasters every 5 m with a light strip down their face
  for (let z = z1 - 4; z > z0 + 1; z -= 5) {
    for (const side of [-1, 1]) {
      const x = side < 0 ? x0 : x1
      box(0.36, h - 1.3, 0.7, x - side * 0.18, (h - 1.3) / 2, z, pilMat)
      box(0.04, h - 2.6, 0.07, x - side * 0.375, (h - 1.3) / 2 + 0.15, z, strip)
    }
  }
  // the cornice and the skirting: two lines of light round the hall
  for (const y of [h - 1.3, 0.05]) {
    const s = y > 1 ? 0.05 : 0.035
    box(s, s, D, x0 + s / 2, y, (z0 + z1) / 2, strip)
    box(s, s, D, x1 - s / 2, y, (z0 + z1) / 2, strip)
    box(W, s, s, (x0 + x1) / 2, y, z0 + s / 2, strip)
  }
  // the ceiling: dark, with hexagonal coffers glowing softly (graphene again, overhead)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: '#0a0f2b', roughness: 0.9 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  g.add(ceil)
  const hexR = 1.05
  const sx = 2.05
  const sz = sx * (Math.sqrt(3) / 2)
  const cells = []
  for (let row = 0; z1 - 1 - row * sz > z0 + 1; row++) {
    for (let x = x0 + 1.2 + (row % 2) * (sx / 2); x < x1 - 1; x += sx) cells.push([x, z1 - 1 - row * sz])
  }
  const coffer = new THREE.InstancedMesh(new THREE.CylinderGeometry(hexR * 0.86, hexR * 0.86, 0.06, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), cells.length)
  const m = new THREE.Matrix4()
  const c = new THREE.Color()
  cells.forEach(([x, z], i) => {
    coffer.setMatrixAt(i, m.makeRotationY(Math.PI / 6).setPosition(x, h - 0.05, z))
    const k = 0.025 + 0.025 * Math.sin(x * 0.7 + z * 0.4) ** 2
    coffer.setColorAt(i, c.setRGB(k * 0.75, k * 0.95, k * 1.6))
  })
  g.add(coffer)
  return g
}

// ---------------------------------------------------------------- materials for lattices
const pearl = (light, glow = 0.16, color = '#eaf4ff') => new THREE.MeshPhysicalMaterial({
  color, roughness: 0.18, metalness: 0.05, clearcoat: light ? 0 : 1, clearcoatRoughness: 0.1, emissive: ACCENT, emissiveIntensity: glow,
})

// ---------------------------------------------------------------- diamond
/** The diamond lattice (two cells each way round an atom), turning slowly; show() lights the middle
 *  atom, its four bonds and the tetrahedron they point to. */
export function diamondModel({ scale = 0.34, light }) {
  const { atoms, bonds } = diamondCluster()
  const pts = atoms.map(p => p.map(v => v * scale))
  const bs = ballStick({ atoms: pts, bonds, atomR: 0.078, bondR: 0.02, atomMat: pearl(light, 0.04, '#dfe9f7'), bondMat: glowMat('#7fd0ff', 0.7), seg: light ? 12 : 20 })
  const turn = new THREE.Group()
  const model = new THREE.Group()
  model.rotation.set(0.42, 0, 0.3)
  model.add(bs.group)
  turn.add(model)
  // the highlight
  const ci = atoms.findIndex(p => p.every(v => Math.abs(v) < 1e-9))
  const nb = bonds.filter(b => b.includes(ci)).map(b => (b[0] === ci ? b[1] : b[0]))
  const goldMat = glowMat(GOLD, 2.2, { transparent: true, opacity: 0 })
  const hl = new THREE.Group()
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), goldMat)
  hl.add(core)
  const c0 = new THREE.Vector3(...pts[ci])
  for (const j of nb) {
    const p = new THREE.Vector3(...pts[j])
    const d = p.clone().sub(c0)
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, d.length(), 12), goldMat)
    stick.position.copy(c0).addScaledVector(d, 0.5)
    stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), goldMat)
    halo.position.copy(p)
    hl.add(stick, halo)
  }
  const tetra = new THREE.BufferGeometry().setFromPoints(nb.flatMap((_, k) => {
    const others = nb.filter((__, m) => m !== k).map(j => new THREE.Vector3(...pts[j]))
    return others
  }))
  tetra.computeVertexNormals()
  const faceMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  hl.add(new THREE.Mesh(tetra, faceMat))
  const edgePts = []
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) edgePts.push(new THREE.Vector3(...pts[nb[a]]), new THREE.Vector3(...pts[nb[b]]))
  const edgeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 })
  hl.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(edgePts), edgeMat))
  model.add(hl)
  let lit = 0
  let litFor = 0
  return {
    group: turn,
    update(dt) {
      turn.rotation.y += dt * (litFor > 0 ? 0.08 : 0.16)
      litFor = Math.max(0, litFor - dt)
      lit += ((litFor > 0 ? 1 : 0) - lit) * Math.min(1, dt * 3)
      goldMat.opacity = lit
      faceMat.opacity = lit * 0.22
      edgeMat.opacity = lit * 0.9
      hl.visible = lit > 0.01
    },
    show(seconds = 9) {
      litFor = seconds
    },
  }
}

// ---------------------------------------------------------------- the brilliant
export function brilliantGem({ env, light, radius = 0.3 }) {
  const b = brilliant()
  const gem = gemMesh(facetGeometry(b.facets), gemMaterial({ planes: b.planes, env, light, gain: 2.4 }))
  gem.scale.setScalar(radius)
  const crown = []
  for (const f of b.facets) for (const p of f.pts) if (p[1] >= -1e-6 && !crown.some(q => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 1e-6)) crown.push(p)
  const sparkle = glints(crown, { count: light ? 3 : 5, size: 0.55 })
  gem.add(sparkle.group)
  const group = new THREE.Group()
  // a slender column of dark stone with a metal cradle under the stone
  const stone = new THREE.MeshPhysicalMaterial({ color: '#121a3c', roughness: 0.2, clearcoat: light ? 0 : 0.8 })
  const metal = new THREE.MeshStandardMaterial({ color: '#8d97c4', roughness: 0.25, metalness: 1 })
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 1.0, 32), stone)
  column.position.y = 0.5
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.08, 32), metal)
  cap.position.y = 1.04
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 6, 64), glowMat(ACCENT, 2.2))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 1.08
  group.add(column, cap, ring)
  const holder = new THREE.Group()
  holder.position.y = 1.08 + radius * 0.92 + 0.08
  holder.add(gem)
  group.add(holder)
  let flash = 0
  return {
    group,
    update(dt, t) {
      gem.rotation.y += dt * (0.35 + flash * 1.5)
      gem.rotation.x = 0.18 + Math.sin(t * 0.4) * 0.06
      holder.position.y = 1.08 + radius * 0.92 + 0.08 + Math.sin(t * 0.9) * 0.025
      flash = Math.max(0, flash - dt * 0.5)
      gem.material.uniforms.uFlash.value = flash * 0.5
      sparkle.update(dt, 1 + flash * 3)
    },
    flash() {
      flash = 1
    },
  }
}

// ---------------------------------------------------------------- graphite
/** Four graphene sheets stacked ABAB, 3.35 Å apart; slide(true) shears them like a deck of cards
 *  (each one lattice vector further than the one below), slide(false) stacks them back. */
export function graphiteModel({ scale = 0.26, light }) {
  const layers = graphiteStack(4, inHexagon(6.4))
  const group = new THREE.Group()
  const atomMat = new THREE.MeshPhysicalMaterial({ color: '#59606e', roughness: 0.28, metalness: 0.6, clearcoat: light ? 0 : 0.6, emissive: ACCENT, emissiveIntensity: 0.12 })
  const bondMat = glowMat('#79d0ff', 1.15)
  const plateMat = new THREE.MeshBasicMaterial({ color: '#2a6fae', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  const sheets = []
  const a = GRAPHENE.a * scale
  layers.forEach((L, k) => {
    // flake x runs along -z in the world (the way the sheets slide), flake y along x
    const pts = L.atoms.map(p => [p[1] * scale, 0, -p[0] * scale])
    const bs = ballStick({ atoms: pts, bonds: L.bonds, atomR: 0.075, bondR: 0.022, atomMat, bondMat, seg: light ? 10 : 16 })
    const sheet = new THREE.Group()
    sheet.add(bs.group)
    const plate = new THREE.Mesh(new THREE.CircleGeometry(6.9 * scale, 6), plateMat)
    plate.rotation.x = -Math.PI / 2
    plate.rotation.z = Math.PI / 6
    plate.position.y = -0.005
    sheet.add(plate)
    sheet.position.y = k * GRAPHENE.layer * scale
    group.add(sheet)
    sheets.push(sheet)
  })
  let from = 0
  let to = 0
  let t = 1
  let shift = 0
  return {
    group,
    height: 3 * GRAPHENE.layer * scale,
    update(dt) {
      if (t < 1) {
        t = Math.min(1, t + dt / 2.2)
        shift = from + (to - from) * easeInOut(t)
      }
      sheets.forEach((s, k) => {
        s.position.z = -shift * k * a
        s.position.y = k * GRAPHENE.layer * scale + Math.sin(t * Math.PI) * 0.02 * k
      })
    },
    slide(on) {
      from = shift
      to = on ? 1 : 0
      t = 0
    },
    get slid() {
      return to > 0.5
    },
  }
}

// ---------------------------------------------------------------- the giant pencil
/** A pencil 4.6 m long, its sharpened end cut from a hexagonal body (the paint ends in six scallops),
 *  writing a hexagon on the floor, leaning along `aim` (radians about y; 0 leans toward +x). Its
 *  group stands at the middle of the hexagon it draws. */
export function giantPencil({ light, side = 1.15, lean = 0.8, aim = Math.PI / 2, label: words = 'HB' }) {
  const group = new THREE.Group()
  const inR = 0.16 // across flats 0.32 m
  const R = inR / Math.cos(Math.PI / 6)
  const cone = 0.62
  const lead = 0.13
  const bodyLen = 3.35
  const off = Math.PI / 6 // flat faces centred at 30° + k·60° (one faces local -z)
  const sector = Math.PI / 3
  const hexR = phi => {
    const d = phi - off
    return inR / Math.cos(d - Math.round(d / sector) * sector)
  }
  const paintC = new THREE.Color('#f2b51c')
  const woodC = new THREE.Color('#e3bf8a')
  const leadC = new THREE.Color('#2b2e35')
  // the sharpened end: rings from the tip up, each the circle of the cone cut by the hexagon
  const N = light ? 36 : 72
  const rings = light ? 16 : 28
  const pos = []
  const col = []
  const idx = []
  for (let i = 0; i <= rings; i++) {
    const y = (i / rings) * cone
    const r = (R * y) / cone
    for (let j = 0; j <= N; j++) {
      const phi = (j / N) * Math.PI * 2
      const hr = hexR(phi)
      const rr = Math.min(r, hr)
      pos.push(Math.cos(phi) * rr, y, Math.sin(phi) * rr)
      const c = r < hr - 1e-4 ? (y < lead ? leadC : woodC) : paintC
      col.push(c.r, c.g, c.b)
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < N; j++) {
      const a = i * (N + 1) + j
      const b = a + N + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const tipGeo = new THREE.BufferGeometry()
  tipGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  tipGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  tipGeo.setIndex(idx)
  tipGeo.computeVertexNormals()
  const tipMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05, clearcoat: light ? 0 : 0.5, clearcoatRoughness: 0.4, side: THREE.DoubleSide })
  const pencil = new THREE.Group()
  pencil.add(new THREE.Mesh(tipGeo, tipMat))
  // the body: a hexagonal prism with sharp edges, corners where the tip's hexagon has them
  const bp = []
  const bn = []
  for (let k = 0; k < 6; k++) {
    const c0 = off + (k - 0.5) * sector
    const c1 = off + (k + 0.5) * sector
    const nx = Math.cos(off + k * sector)
    const nz = Math.sin(off + k * sector)
    const p0 = [Math.cos(c0) * R, Math.sin(c0) * R]
    const p1 = [Math.cos(c1) * R, Math.sin(c1) * R]
    const y0 = cone
    const y1 = cone + bodyLen
    const quad = [[p0, y0], [p1, y0], [p1, y1], [p0, y0], [p1, y1], [p0, y1]]
    for (const [[x, z], y] of quad) {
      bp.push(x, y, z)
      bn.push(nx, 0, nz)
    }
  }
  const bodyGeo = new THREE.BufferGeometry()
  bodyGeo.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3))
  bodyGeo.setAttribute('normal', new THREE.Float32BufferAttribute(bn, 3))
  const paintMat = new THREE.MeshPhysicalMaterial({ color: paintC, roughness: 0.3, clearcoat: light ? 0 : 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide })
  pencil.add(new THREE.Mesh(bodyGeo, paintMat))
  const ferMat = new THREE.MeshStandardMaterial({ color: '#c9ced8', roughness: 0.22, metalness: 1 })
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.02, 0.24, 40), ferMat)
  ferrule.position.y = cone + bodyLen + 0.12
  pencil.add(ferrule)
  for (const dy of [0.04, 0.09, 0.15, 0.2]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R * 1.03, 0.008, 6, 40), ferMat)
    rib.rotation.x = Math.PI / 2
    rib.position.y = cone + bodyLen + dy
    pencil.add(rib)
  }
  const eraser = new THREE.Mesh(new THREE.CapsuleGeometry(R * 0.96, 0.12, 6, 32), new THREE.MeshStandardMaterial({ color: '#e98e9c', roughness: 0.85 }))
  eraser.position.y = cone + bodyLen + 0.24 + 0.1
  pencil.add(eraser)
  // its words, printed along the face that looks at the walkway (local -z, turned by `aim`)
  const label = makeText(words, { size: 0.13, color: '#4a3200' })
  label.position.set(0, cone + bodyLen * 0.55, -(inR + 0.004))
  label.rotation.set(0, Math.PI, Math.PI / 2)
  pencil.add(label)
  pencil.traverse(o => (o.castShadow = true))
  pencil.rotation.z = -lean // leans toward local +x
  const turn = new THREE.Group()
  turn.rotation.y = aim
  turn.add(pencil)
  const holder = new THREE.Group()
  holder.add(turn)
  group.add(holder)

  // the line it writes: a ribbon round a hexagon (the drawing reveals it)
  const corners = []
  for (let k = 0; k <= 6; k++) {
    const a = Math.PI / 2 + (k * Math.PI) / 3
    corners.push(new THREE.Vector3(Math.cos(a) * side, 0, Math.sin(a) * side))
  }
  const path = []
  const per = 24
  for (let k = 0; k < 6; k++) for (let i = 0; i < per; i++) path.push(corners[k].clone().lerp(corners[k + 1], i / per))
  path.push(corners[6].clone())
  const w = 0.055
  const rp = []
  const ri = []
  path.forEach((p, i) => {
    const nxt = path[Math.min(path.length - 1, i + 1)]
    const prv = path[Math.max(0, i - 1)]
    const d = nxt.clone().sub(prv).normalize()
    const nrm = new THREE.Vector3(-d.z, 0, d.x)
    const wob = w * (0.85 + 0.15 * Math.sin(i * 1.7))
    rp.push(p.x + nrm.x * wob, 0.004, p.z + nrm.z * wob, p.x - nrm.x * wob, 0.004, p.z - nrm.z * wob)
    if (i < path.length - 1) ri.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
  })
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3))
  lineGeo.setIndex(ri)
  lineGeo.computeVertexNormals()
  const lineMat = new THREE.MeshStandardMaterial({ color: '#30343c', roughness: 0.42, metalness: 0.7, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide })
  const line = new THREE.Mesh(lineGeo, lineMat)
  group.add(line)
  const total = ri.length
  const tipAt = u => {
    const f = clamp(u, 0, 1) * (path.length - 1)
    const i = Math.floor(f)
    return path[Math.min(i, path.length - 1)].clone().lerp(path[Math.min(i + 1, path.length - 1)], f - i)
  }
  let drawing = -1
  let onDone = null
  const place = (u, lift = 0) => {
    const p = tipAt(u)
    holder.position.set(p.x, lift, p.z)
  }
  place(0)
  return {
    group,
    update(dt, t) {
      if (drawing >= 0) {
        drawing += dt / 5.5
        const u = clamp(drawing, 0, 1)
        place(u, 0)
        holder.rotation.y = Math.sin(t * 9) * 0.015
        line.geometry.setDrawRange(0, Math.floor(u * (path.length - 1)) * 6)
        if (drawing >= 1) {
          drawing = -1
          line.geometry.setDrawRange(0, total)
          onDone?.()
        }
      } else {
        holder.position.y = 0.03 + Math.sin(t * 1.3) * 0.025
        holder.rotation.y = 0
      }
    },
    draw(done) {
      if (drawing >= 0) return false
      onDone = done
      drawing = 0
      line.geometry.setDrawRange(0, 0)
      return true
    },
  }
}

// ---------------------------------------------------------------- the nanotube tunnel
/** A (6,6) armchair nanotube at the floor's scale, along -z from `z0`, its axis `axisY` above the
 *  floor and its seam hidden under it. pulse() sends light along it (it conducts). */
export function nanotubeTunnel({ scale = 0.5, axisY = 1.2, z0 = 0, light }) {
  const tube = nanotube(6, 6, 8)
  const R = tube.radius * scale
  // turn the tube so that an atom row is not right at the bottom, then drop what is under the floor
  const rot = Math.PI / 12
  const world = tube.atoms.map(([x, y, z]) => {
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    return [(x * c - y * s) * scale, (x * s + y * c) * scale + axisY, z0 - z * scale]
  })
  const keep = world.map(p => p[1] > -0.35)
  const map = []
  const atoms = []
  world.forEach((p, i) => {
    if (keep[i]) {
      map[i] = atoms.length
      atoms.push(p)
    }
  })
  const bonds = tube.bonds.filter(([i, j]) => keep[i] && keep[j]).map(([i, j]) => [map[i], map[j]])
  const pulse = { uPulse: { value: new THREE.Vector3(1e3, 1.2, 0) }, uPulseColor: { value: new THREE.Color('#bff0ff') } }
  const withPulse = mat => {
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, pulse)
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uPulse;\nvarying float vPulse;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec4 ip = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #else
            vec4 ip = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #endif
          vPulse = uPulse.z * exp(-pow((ip.z - uPulse.x) / uPulse.y, 2.0));`)
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uPulseColor;\nvarying float vPulse;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += uPulseColor * vPulse;')
    }
    mat.customProgramCacheKey = () => 'carbon-tube-pulse'
    return mat
  }
  const bs = ballStick({
    atoms, bonds, atomR: 0.11, bondR: 0.035,
    atomMat: nearFade(withPulse(pearl(light, 0.06, '#d6e6f5'))), bondMat: nearFade(withPulse(glowMat('#4fb9f5', 0.62))), seg: light ? 10 : 16,
  })
  const group = new THREE.Group()
  group.add(bs.group)
  // a soft glow on the floor inside and rings of light at both mouths
  const L = tube.length * scale
  for (const z of [z0, z0 - L]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.02, 0.03, 8, 96), glowMat('#9fe3ff', 1.2))
    ring.position.set(0, axisY, z)
    group.add(ring)
  }
  let front = -1
  let strength = 0
  return {
    group,
    radius: R,
    length: L,
    axisY,
    update(dt, t) {
      if (front >= 0) {
        front += dt * 9
        strength = 1.5
        if (front > L + 6) front = -1
        pulse.uPulse.value.set(z0 - front, 1.1, strength)
      } else {
        // an idle shimmer runs along it now and then
        const cyc = (t * 0.22) % 1
        pulse.uPulse.value.set(z0 + 3 - cyc * (L + 6), 1.6, 0.22)
      }
    },
    pulse() {
      front = 0
    },
  }
}

// ---------------------------------------------------------------- the C60 dome
/** C60 drawn `radius` m across its atoms, sunk into the floor so that one hexagon, facing +z with an
 *  edge flat at the bottom, is a doorway 0.5 m above its lower edge. Faces are faint glass: pentagons
 *  gold, hexagons blue. count() lights them one by one. */
export function c60Dome({ radius = 4.6, light, words }) {
  const c = c60()
  const S = radius / Math.hypot(...c.atoms[0])
  // turn a hexagon to face +z
  const door = c.hexagons[0]
  const centroid = ring => ring.reduce((s, i) => add(s, c.atoms[i]), [0, 0, 0]).map(v => v / ring.length)
  const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(...norm(centroid(door))), new THREE.Vector3(0, 0, 1))
  let P = c.atoms.map(p => new THREE.Vector3(...p).applyQuaternion(q1))
  // then about z, so that its lowest edge lies flat at the bottom
  let best = null
  for (let k = 0; k < 6; k++) {
    const m = P[door[k]].clone().add(P[door[(k + 1) % 6]]).multiplyScalar(0.5)
    if (!best || m.y < best.y) best = m
  }
  const spin = -Math.PI / 2 - Math.atan2(best.y, best.x)
  P = P.map(p => p.applyAxisAngle(new THREE.Vector3(0, 0, 1), spin).multiplyScalar(S))
  const bottom = Math.min(...door.map(i => P[i].y))
  const lift = -0.5 - bottom // the door's lower edge 0.5 m under the floor
  const atoms = P.map(p => [p.x, p.y + lift, p.z])
  const doorPlane = P[door[0]].z // all six corners of the door share this z
  const centre = new THREE.Vector3(0, lift, 0)
  const group = new THREE.Group()
  const atomMat = nearFade(pearl(light, 0.07, '#efe9df'))
  const bondMat = nearFade(glowMat('#5cc4ff', 0.75))
  const bs = ballStick({
    atoms, bonds: c.bonds, atomR: 0.2, bondR: 0.065, atomMat, bondMat, seg: light ? 12 : 20, doubles: true,
    side: (i, j, a, b) => new THREE.Vector3().crossVectors(b.clone().sub(a), a.clone().add(b).multiplyScalar(0.5).sub(centre)),
  })
  group.add(bs.group)
  // the glass faces
  const faces = [...c.pentagons.map(r => ({ r, kind: 0 })), ...c.hexagons.map(r => ({ r, kind: 1 }))]
  const pos = []
  const nrm = []
  const face = []
  const kind = []
  faces.forEach((f, fi) => {
    const pts = f.r.map(i => new THREE.Vector3(...atoms[i]))
    const mid = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length)
    const out = mid.clone().sub(centre).normalize()
    for (let k = 0; k < pts.length; k++) {
      for (const p of [mid, pts[k], pts[(k + 1) % pts.length]]) {
        // pull each pane in from the bonds a little
        const q = p === mid ? p : p.clone().lerp(mid, 0.06)
        pos.push(q.x, q.y, q.z)
        nrm.push(out.x, out.y, out.z)
        face.push(fi)
        kind.push(f.kind)
      }
    }
  })
  const paneGeo = new THREE.BufferGeometry()
  paneGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  paneGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3))
  paneGeo.setAttribute('aFace', new THREE.Float32BufferAttribute(face, 1))
  paneGeo.setAttribute('aKind', new THREE.Float32BufferAttribute(kind, 1))
  const lit = new Array(32).fill(0)
  const paneMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uLit: { value: lit }, uPent: { value: new THREE.Color('#ffb84a') }, uHex: { value: new THREE.Color('#4fb8ff') }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aFace; attribute float aKind;
      uniform float uLit[32];
      varying float vLit; varying float vKind; varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main() {
        vLit = uLit[int(aFace + 0.5)];
        vKind = aKind;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uPent; uniform vec3 uHex; uniform float uTime;
      varying float vLit; varying float vKind; varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main() {
        vec3 base = vKind < 0.5 ? uPent : uHex;
        float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5);
        float a = (vKind < 0.5 ? 0.075 : 0.035) + fr * 0.09 + vLit * 0.5;
        float shimmer = 0.85 + 0.15 * sin(vW.y * 2.0 + uTime * 0.8);
        gl_FragColor = vec4(base * a * shimmer, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const panes = new THREE.Mesh(paneGeo, paneMat)
  panes.renderOrder = 4
  group.add(panes)
  // a dais in the middle and the counter over it
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.18, 0.1, 64), new THREE.MeshPhysicalMaterial({ color: '#141c40', roughness: 0.2, clearcoat: 0.8 }))
  dais.position.y = 0.05
  const daisRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.02, 6, 96), glowMat(GOLD, 2))
  daisRing.rotation.x = Math.PI / 2
  daisRing.position.y = 0.1
  group.add(dais, daisRing)
  const counter = makeText('C60', { size: 0.62, color: '#ffffff' })
  counter.position.set(0, 2.55, 0.3)
  const subText = makeText('', { size: 0.26, color: GOLD, font: 'medium' })
  subText.position.set(0, 2.05, 0.3)
  group.add(counter, subText)
  const domeLight = new THREE.PointLight('#ffe2a8', light ? 0 : 6, 9, 2)
  domeLight.position.set(0, 3.2, 0)
  group.add(domeLight)
  // the count: pentagons one by one, then hexagons, then the totals
  let tl = -1
  let shown = ''
  const say = (big, small) => {
    if (shown === big + small) return
    shown = big + small
    counter.text = big
    counter.sync()
    subText.text = small
    subText.sync()
  }
  const pentDelay = 0.42
  const hexDelay = 0.26
  const pentEnd = 12 * pentDelay
  const hexEnd = pentEnd + 0.8 + 20 * hexDelay
  return {
    group,
    doorPlane,
    floorRadius: Math.sqrt(Math.max(0, radius * radius - lift * lift)),
    lift,
    update(dt, t) {
      paneMat.uniforms.uTime.value = t
      const W = words()
      if (tl >= 0) {
        tl += dt
        for (let i = 0; i < 32; i++) {
          const on = i < 12 ? tl > i * pentDelay && tl < hexEnd + 2.5 : tl > pentEnd + 0.8 + (i - 12) * hexDelay && tl < hexEnd + 2.5
          lit[i] += ((on ? 1 : 0) - lit[i]) * Math.min(1, dt * 6)
        }
        if (tl < pentEnd + 0.4) say(String(Math.min(12, Math.floor(tl / pentDelay) + 1)), W.pentagons)
        else if (tl < pentEnd + 0.8) say('12', W.pentagons)
        else if (tl < hexEnd) say(String(Math.min(20, Math.floor((tl - pentEnd - 0.8) / hexDelay) + 1)), W.hexagons)
        else say('60 · 90', W.totals)
        if (tl > hexEnd + 6) {
          tl = -1
          say('C60', '')
        }
      } else {
        for (let i = 0; i < 32; i++) lit[i] *= Math.exp(-dt * 2)
      }
      counter.position.y = 2.55 + Math.sin(t * 1.2) * 0.05
    },
    count() {
      tl = 0
      shown = ''
    },
  }
}

// ---------------------------------------------------------------- the football
/** A classic 32-panel ball: each panel of the truncated icosahedron puffed out onto the sphere, with
 *  sunken seams; pentagons black, hexagons white. kick() makes it hop and spin. */
export function football({ radius = 0.5, light }) {
  const c = c60()
  const k = light ? 4 : 7
  const pos = []
  const col = []
  const idx = []
  const black = new THREE.Color('#151515')
  const white = new THREE.Color('#f3f3f0')
  const faces = [...c.pentagons.map(r => [r, black]), ...c.hexagons.map(r => [r, white])]
  for (const [ringIdx, color] of faces) {
    const pts = ringIdx.map(i => c.atoms[i])
    const mid = pts.reduce((s, p) => add(s, p), [0, 0, 0]).map(v => v / pts.length)
    const local = new Map()
    const vert = (p, a) => {
      const key = p.map(v => Math.round(v * 1e5)).join(',')
      if (local.has(key)) return local.get(key)
      const seam = 1 - smooth(clamp(a / 0.22, 0, 1))
      const r = radius * (1 - 0.03 * seam - 0.012 * (1 - a) * (1 - a))
      const d = norm(p)
      pos.push(d[0] * r, d[1] * r, d[2] * r)
      col.push(color.r, color.g, color.b)
      local.set(key, pos.length / 3 - 1)
      return pos.length / 3 - 1
    }
    for (let e = 0; e < pts.length; e++) {
      const A = pts[e]
      const B = pts[(e + 1) % pts.length]
      const grid = []
      for (let i = 0; i <= k; i++) {
        grid[i] = []
        for (let j = 0; j <= k - i; j++) {
          const b = i / k
          const cc = j / k
          const a = 1 - b - cc
          const p = add(add(mul(mid, a), mul(A, b)), mul(B, cc))
          grid[i][j] = vert(p, a)
        }
      }
      for (let i = 0; i < k; i++) {
        for (let j = 0; j < k - i; j++) {
          idx.push(grid[i][j], grid[i + 1][j], grid[i][j + 1])
          if (j < k - i - 1) idx.push(grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1])
        }
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  // the winding of each fan triangle depends on the ring's direction: make all faces face outward
  const n = geo.getAttribute('normal')
  const p = geo.getAttribute('position')
  let inward = 0
  for (let i = 0; i < p.count; i++) if (n.getX(i) * p.getX(i) + n.getY(i) * p.getY(i) + n.getZ(i) * p.getZ(i) < 0) inward++
  if (inward > p.count / 2) {
    const ix = geo.getIndex().array
    for (let i = 0; i < ix.length; i += 3) [ix[i + 1], ix[i + 2]] = [ix[i + 2], ix[i + 1]]
    geo.computeVertexNormals()
  }
  const ball = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: light ? 0 : 0.7, clearcoatRoughness: 0.3 }))
  ball.castShadow = true
  const group = new THREE.Group()
  const base = plinth({ radius: 0.62, height: 0.75, light })
  group.add(base)
  const cradle = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 10, 40), new THREE.MeshStandardMaterial({ color: '#9aa4cf', metalness: 1, roughness: 0.25 }))
  cradle.rotation.x = Math.PI / 2
  cradle.position.y = 0.79
  group.add(cradle)
  const holder = new THREE.Group()
  const rest = 0.79 + Math.sqrt(radius * radius - 0.26 * 0.26) - 0.02
  holder.position.y = rest
  holder.add(ball)
  group.add(holder)
  let hop = -1
  return {
    group,
    update(dt) {
      if (hop >= 0) {
        hop += dt
        const T = 1.5
        const h = hop < T ? Math.sin((hop / T) * Math.PI) * 1.4 : Math.abs(Math.sin(((hop - T) / 0.5) * Math.PI)) * 0.18 * Math.max(0, 1 - (hop - T) / 0.5)
        holder.position.y = rest + h
        ball.rotation.x += dt * (hop < T ? 7 : 2)
        ball.rotation.z += dt * (hop < T ? 2.5 : 0.5)
        if (hop > T + 0.5) {
          hop = -1
          holder.position.y = rest
        }
      } else ball.rotation.y += dt * 0.25
    },
    kick() {
      if (hop < 0) hop = 0
    },
  }
}

// ---------------------------------------------------------------- the diamond press
function dialTexture(max, step, unit, red) {
  return paint(256, 256, (g, w) => {
    const c = w / 2
    const grad = g.createRadialGradient(c, c, 10, c, c, c)
    grad.addColorStop(0, '#16204a')
    grad.addColorStop(1, '#0a0f27')
    g.fillStyle = grad
    g.beginPath()
    g.arc(c, c, c - 2, 0, Math.PI * 2)
    g.fill()
    const a0 = Math.PI * 0.75
    const span = Math.PI * 1.5
    // the red zone
    g.strokeStyle = 'rgba(255,90,70,0.85)'
    g.lineWidth = 10
    g.beginPath()
    g.arc(c, c, c - 26, a0 + span * (red / max), a0 + span)
    g.stroke()
    g.strokeStyle = '#dfe7ff'
    g.fillStyle = '#dfe7ff'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = 'bold 22px sans-serif'
    const n = Math.round(max / step)
    for (let i = 0; i <= n * 5; i++) {
      const a = a0 + span * (i / (n * 5))
      const major = i % 5 === 0
      const r1 = c - 20
      const r2 = major ? c - 40 : c - 30
      g.lineWidth = major ? 4 : 2
      g.beginPath()
      g.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1)
      g.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2)
      g.stroke()
      if (major) {
        const v = (i / 5) * step
        g.fillText(String(v), c + Math.cos(a) * (c - 62), c + Math.sin(a) * (c - 62))
      }
    }
    g.font = 'bold 26px sans-serif'
    g.fillStyle = '#7fd4ff'
    g.fillText(unit, c, c + 52)
  })
}

/** The press: a steel frame with a hydraulic ram, tungsten-carbide anvils and a capsule; a console
 *  with a pressure gauge (GPa) and a temperature gauge (°C). Faces +x (the walkway). Steps: load,
 *  squeeze, heat, open; each returns false while the last one is still moving. */
export function diamondPress({ light, env, words }) {
  const group = new THREE.Group()
  const paintMat = new THREE.MeshPhysicalMaterial({ color: '#25365f', roughness: 0.42, metalness: 0.55, clearcoat: light ? 0 : 0.5, clearcoatRoughness: 0.3 })
  const chrome = new THREE.MeshStandardMaterial({ color: '#dde3f2', roughness: 0.12, metalness: 1 })
  const carbide = new THREE.MeshStandardMaterial({ color: '#5c6170', roughness: 0.3, metalness: 0.9 })
  const dark = new THREE.MeshStandardMaterial({ color: '#141a33', roughness: 0.6, metalness: 0.4 })
  const stripes = paint(256, 32, (g, w, h) => {
    g.fillStyle = '#f2c230'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#16161a'
    for (let x = -h; x < w + h; x += 32) {
      g.beginPath()
      g.moveTo(x, h)
      g.lineTo(x + 16, h)
      g.lineTo(x + 16 + h, 0)
      g.lineTo(x + h, 0)
      g.fill()
    }
  }, { repeat: [3, 1] })
  const add3 = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.castShadow = true
    group.add(m)
    return m
  }
  // the bed, the columns, the crosshead and the cylinder
  add3(new RoundedBoxGeometry(1.5, 0.82, 2.6, 3, 0.05), paintMat, 0, 0.41, 0)
  const band = add3(new THREE.BoxGeometry(0.02, 0.1, 2.5), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.5 }), 0.76, 0.72, 0)
  band.material.map.wrapS = THREE.RepeatWrapping
  for (const z of [-0.95, 0.95]) {
    add3(new THREE.CylinderGeometry(0.13, 0.13, 3.15, 32), chrome, 0, 0.82 + 3.15 / 2, z)
    add3(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32), carbide, 0, 0.88, z)
    add3(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32), carbide, 0, 3.92, z)
  }
  add3(new RoundedBoxGeometry(1.3, 0.72, 2.6, 3, 0.05), paintMat, 0, 4.3, 0)
  add3(new THREE.CylinderGeometry(0.46, 0.46, 0.9, 40), paintMat, 0, 5.1, 0)
  add3(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 40), carbide, 0, 5.58, 0)
  add3(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 40), carbide, 0, 4.68, 0)
  // a hose from the cylinder down to the pump
  const hose = new THREE.Mesh(taperedTube([
    new THREE.Vector3(-0.3, 5.2, 0.35), new THREE.Vector3(-0.75, 5.0, 0.8), new THREE.Vector3(-0.85, 3.0, 1.2),
    new THREE.Vector3(-0.8, 0.9, 1.35), new THREE.Vector3(-0.4, 0.25, 1.6),
  ], 0.05, 0.05, { radial: 10 }), new THREE.MeshStandardMaterial({ color: '#1a1c22', roughness: 0.6 }))
  group.add(hose)
  const pump = add3(new RoundedBoxGeometry(0.7, 0.5, 0.5, 2, 0.04), paintMat, -0.3, 0.25, 1.75)
  pump.material = paintMat
  // the moving ram with the upper anvil; the lower anvil and the capsule on the bed
  const ram = new THREE.Group()
  group.add(ram)
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 40), chrome)
  ram.add(rod)
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.13, 0.3, 40), carbide)
  ram.add(upper)
  const lower = add3(new THREE.CylinderGeometry(0.13, 0.28, 0.3, 40), carbide, 0, 0.97, 0)
  lower.castShadow = false
  const capMat = new THREE.MeshStandardMaterial({ color: '#d9cdb4', roughness: 0.75, emissive: '#ff6a1a', emissiveIntensity: 0 })
  const capsule = add3(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 32), capMat, 0, 1.2, 0)
  const heater = add3(new THREE.TorusGeometry(0.125, 0.015, 8, 40), new THREE.MeshStandardMaterial({ color: '#a05a2c', emissive: '#ff5a10', emissiveIntensity: 0, roughness: 0.5 }), 0, 1.2, 0)
  heater.rotation.x = Math.PI / 2
  const glow = new THREE.PointLight('#ff7a2a', 0, 6, 2)
  glow.position.set(0.4, 1.4, 0)
  group.add(glow)
  const restTop = 2.75 // the ram's lowest point at rest
  const pressTop = 1.28 // the anvil on the capsule
  let ramY = restTop
  const placeRam = y => {
    const top = 3.94
    const lenR = top - (y + 0.3)
    rod.scale.y = lenR
    rod.position.y = y + 0.3 + lenR / 2
    upper.position.y = y + 0.15
    ramY = y
  }
  placeRam(restTop)

  // the graphite and the diamond
  const graphite = add3(new THREE.CylinderGeometry(0.1, 0.1, 0.13, 6), new THREE.MeshStandardMaterial({ color: '#3a3e47', roughness: 0.3, metalness: 0.8 }), 0, 0, 0)
  const tray = new THREE.Vector3(1.32, 1.27, -1.22)
  graphite.position.copy(tray)
  const crystal = cuboOctahedron()
  const gemM = gemMesh(facetGeometry(crystal.facets), gemMaterial({ planes: crystal.planes, env, light, tint: '#fff3cf', gain: 2.6 }))
  gemM.scale.setScalar(0.15)
  const gemHolder = new THREE.Group()
  gemHolder.add(gemM)
  gemHolder.visible = false
  group.add(gemHolder)
  const corners = []
  for (const f of crystal.facets) for (const p of f.pts) corners.push(p)
  const sparkle = glints(corners, { count: 3, size: 0.9 })
  gemM.add(sparkle.group)

  // the console with the gauges, facing the walkway
  const consoleG = new THREE.Group()
  consoleG.position.set(1.35, 0, 1.25)
  group.add(consoleG)
  const stand = new THREE.Mesh(new RoundedBoxGeometry(0.42, 1.25, 0.9, 2, 0.04), paintMat)
  stand.position.y = 0.625
  consoleG.add(stand)
  const face = new THREE.Group()
  face.position.set(0.12, 1.5, 0)
  face.rotation.set(0, Math.PI / 2, 0)
  face.rotateX(-0.45)
  consoleG.add(face)
  const panel = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.8, 0.08, 3, 0.03), dark)
  face.add(panel)
  const edgeG = new THREE.Mesh(new RoundedBoxGeometry(1.29, 0.84, 0.05, 3, 0.03), glowMat(ACCENT, 1))
  edgeG.position.z = -0.02
  face.add(edgeG)
  const gauges = []
  const W = words()
  for (const [i, max, step, unit, red] of [[0, 8, 1, 'GPa', 6], [1, 2000, 500, '°C', 1500]]) {
    const x = i ? 0.3 : -0.3
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.24, 48), new THREE.MeshStandardMaterial({ map: dialTexture(max, step, unit, red), roughness: 0.4, emissive: '#ffffff', emissiveMap: null, emissiveIntensity: 0 }))
    dial.material.emissiveMap = dial.material.map
    dial.material.emissiveIntensity = 0.55
    dial.position.set(x, 0.07, 0.045)
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.018, 10, 48), chrome)
    bezel.position.copy(dial.position)
    const needle = new THREE.Group()
    needle.position.set(x, 0.07, 0.06)
    const nm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.19, 0.006), glowMat('#ff5a46', 2))
    nm.position.y = 0.085
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16), chrome)
    hub.rotation.x = Math.PI / 2
    needle.add(nm, hub)
    const read = makeText(i ? '20 °C' : '0,0 GPa', { size: 0.07, color: '#bff0ff' })
    read.position.set(x, -0.28, 0.05)
    face.add(dial, bezel, needle, read)
    gauges.push({ needle, read, max, value: i ? 20 : 0, shown: '', unit, i })
  }
  const title = makeText(W.pressTitle, { size: 0.06, color: ACCENT })
  title.position.set(0, 0.34, 0.05)
  face.add(title)
  const setGauge = (g, v, fmt) => {
    g.value = v
    g.needle.rotation.z = -(-Math.PI * 0.75 + Math.PI * 1.5 * (v / g.max)) - Math.PI / 2 + Math.PI
    const s = fmt(v)
    if (s !== g.shown) {
      g.shown = s
      g.read.text = s
      g.read.sync()
    }
  }
  const fmtP = v => `${v.toFixed(1).replace('.', W.decimal)} GPa`
  const fmtT = v => `${Math.round(v / 10) * 10} °C`
  setGauge(gauges[0], 0, fmtP)
  setGauge(gauges[1], 20, fmtT)
  // a pump lever on the console's side
  const lever = new THREE.Group()
  lever.position.set(0.05, 1.28, -0.5)
  consoleG.add(lever)
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12), chrome)
  arm.position.y = 0.3
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), glowMat('#ff5a46', 1.2))
  knob.position.y = 0.62
  lever.add(arm, knob)

  // ---- the steps
  let step = 0 // 0 ready to load, 1 loaded, 2 squeezed, 3 heated (diamond inside), 4 open with the diamond
  let busy = 0
  let anim = null
  const run = (seconds, fn, done) => {
    anim = { t: 0, seconds, fn, done }
    busy = seconds
  }
  const arc = (from, to, u, h) => from.clone().lerp(to, u).add(new THREE.Vector3(0, Math.sin(u * Math.PI) * h, 0))
  const capsuleTop = new THREE.Vector3(0, 1.36, 0)
  let gemShow = 0
  const actions = {
    get step() {
      return step
    },
    get busy() {
      return busy > 0
    },
    use() {
      if (busy > 0) return false
      if (step === 0) {
        run(1.4, u => {
          graphite.position.copy(arc(tray, capsuleTop, easeInOut(u), 0.5))
          graphite.rotation.y = u * 3
          lever.rotation.x = 0
        }, () => {
          graphite.visible = false
          step = 1
        })
      } else if (step === 1) {
        run(3.6, u => {
          const k = easeInOut(Math.min(1, u * 1.25))
          placeRam(restTop + (pressTop - restTop) * k)
          setGauge(gauges[0], 6 * smooth(clamp((u - 0.25) / 0.75, 0, 1)), fmtP)
          lever.rotation.x = Math.sin(u * Math.PI * 6) * 0.5
          group.position.y = u > 0.3 ? Math.sin(u * 160) * 0.003 : 0
        }, () => {
          group.position.y = 0
          lever.rotation.x = 0
          step = 2
        })
      } else if (step === 2) {
        run(3.8, u => {
          const k = smooth(clamp(u / 0.8, 0, 1))
          setGauge(gauges[1], 20 + 1480 * k, fmtT)
          capMat.emissiveIntensity = k * 2.4
          capMat.emissive.setHSL(0.05 + 0.06 * k, 1, 0.5)
          heater.material.emissiveIntensity = k * 3
          glow.intensity = light ? 0 : k * 9
        }, () => {
          step = 3
        })
      } else if (step === 3) {
        run(3.2, u => {
          const cool = smooth(clamp(u / 0.6, 0, 1))
          setGauge(gauges[1], 1500 - 1480 * cool, fmtT)
          setGauge(gauges[0], 6 * (1 - smooth(clamp(u / 0.45, 0, 1))), fmtP)
          capMat.emissiveIntensity = 2.4 * (1 - cool)
          heater.material.emissiveIntensity = 3 * (1 - cool)
          glow.intensity = light ? 0 : 9 * (1 - cool)
          placeRam(pressTop + (restTop - pressTop) * easeInOut(clamp((u - 0.2) / 0.6, 0, 1)))
          const rise = easeOut(clamp((u - 0.55) / 0.45, 0, 1))
          gemHolder.visible = u > 0.5
          gemHolder.position.set(0, 1.36 + rise * 0.3, 0)
          gemShow = rise
        }, () => {
          step = 4
        })
      } else {
        run(1.2, u => {
          gemHolder.scale.setScalar(1 - easeInOut(u))
        }, () => {
          gemHolder.visible = false
          gemHolder.scale.setScalar(1)
          graphite.visible = true
          graphite.position.copy(tray)
          gemShow = 0
          step = 0
        })
      }
      return true
    },
  }
  return {
    group,
    actions,
    update(dt, t) {
      if (anim) {
        anim.t = Math.min(anim.seconds, anim.t + dt)
        anim.fn(anim.t / anim.seconds)
        if (anim.t >= anim.seconds) {
          const done = anim.done
          anim = null
          busy = 0
          done?.()
        }
      }
      if (gemHolder.visible) {
        gemM.rotation.y += dt * 0.9
        gemHolder.position.y = 1.36 + gemShow * 0.3 + Math.sin(t * 1.6) * 0.02 * gemShow
        sparkle.update(dt, 1.5)
      }
      if (step === 3 && !anim) {
        // inside, hot and squeezed: the capsule breathes its glow
        capMat.emissiveIntensity = 2.2 + Math.sin(t * 5) * 0.25
      }
      void ramY
    },
  }
}
