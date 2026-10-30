// Showpieces: an element's own exhibit in its specimen case, in place of the generic form, where a
// generic form cannot say what the element is like (the user, 2026-10-29: the case's samples were
// "often generic polyhedra"; Carbon and Oxygen first). Each is built at the generic sample's size
// (about 0.6 m across on the turntable, before the case scales it) and returns { group, update(t) }.
import * as THREE from 'three'
import { edgeGlass, canvasTexture } from '../common/props.js'

const rnd = seed => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

/** A rounded lump (coal, a rock): a sphere pushed in and out by smooth waves, so it has bulges and
 *  hollows but no corners (random bumps per corner made a crumpled polyhedron). */
function lump(r, rand, squash = 0.7) {
  const g = new THREE.SphereGeometry(r, 48, 32)
  const p = g.attributes.position
  const w = Array.from({ length: 4 }, () => [rand() * 6, rand() * 6, rand() * 6, 2 + rand() * 3])
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i)
    const n = v.clone().normalize()
    let k = 1
    for (const [a, b, c, f] of w) k += 0.09 * Math.sin(n.x * f + a) * Math.sin(n.y * f + b) * Math.sin(n.z * f + c)
    v.multiplyScalar(k)
    p.setXYZ(i, v.x, v.y * squash, v.z)
  }
  g.computeVertexNormals()
  return g
}

/** A soft round spot, for fog and glints. */
let softTex = null
function softSpot() {
  if (softTex) return softTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.45)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  softTex = new THREE.CanvasTexture(c)
  return softTex
}

/** A four-pointed star glint, for the diamond's sparkle. */
let starTex = null
function star() {
  if (starTex) return starTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  g.translate(32, 32)
  for (const [w, l] of [[3, 30], [2, 18]]) {
    for (let k = 0; k < 2; k++) {
      const grad = g.createLinearGradient(-l, 0, l, 0)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(0.5, 'rgba(255,255,255,1)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grad
      g.fillRect(-l, -w / 2, 2 * l, w)
      g.rotate(Math.PI / 2)
    }
    g.rotate(Math.PI / 4)
  }
  const dot = g.createRadialGradient(0, 0, 0, 0, 0, 8)
  dot.addColorStop(0, 'rgba(255,255,255,1)')
  dot.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = dot
  g.fillRect(-8, -8, 16, 16)
  starTex = new THREE.CanvasTexture(c)
  return starTex
}

/** A cut diamond, girdle radius r: a crown with its flat table over a pointed pavilion, every facet
 *  its own shade of white and ice blue (as a diamond reads at a glance; real refraction only showed the
 *  bright hall behind it). */
function brilliant(r) {
  const profile = [[0, -0.7], [1, 0], [1, 0.05], [0.66, 0.3], [0, 0.3]]
  const g = new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x * r, y * r)), 10).toNonIndexed()
  g.computeVertexNormals()
  const shades = ['#ffffff', '#c9ecff', '#8fd0f5', '#eef9ff', '#5fb4e8', '#b4e2ff'].map(c => new THREE.Color(c))
  const colors = []
  const tris = g.attributes.position.count / 3
  for (let f = 0; f < tris; f++) {
    const c = shades[(f * 7 + Math.floor(f / 2) * 3) % shades.length]
    for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b)
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return g
}

// ---- Carbon: its three faces, a diamond, graphite and coal ----
function carbon({ light }) {
  const group = new THREE.Group()
  const rand = rnd(612)
  const updates = []

  // the diamond, raised on a clear stand, turning on its own
  const diamondMat = light
    ? new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.15, roughness: 0.05, emissive: '#1d3550', flatShading: true })
    : new THREE.MeshPhysicalMaterial({
      vertexColors: true, metalness: 0.15, roughness: 0.04, emissive: '#1d3550', flatShading: true, clearcoat: 1,
      iridescence: 0.5, iridescenceIOR: 2.4, iridescenceThicknessRange: [250, 700],
    })
  const diamond = new THREE.Mesh(brilliant(0.16), diamondMat)
  diamond.position.set(0, 0.46, 0)
  diamond.rotation.x = 0.25
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.07, 0.36, 24),
    new THREE.MeshPhysicalMaterial({ color: '#cfe3ff', transparent: true, opacity: 0.35, roughness: 0.05 }),
  )
  stand.position.set(0, 0.18, 0)
  group.add(diamond, stand)
  // glints that come and go on its facets
  const glints = []
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: star(), color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(0.12)
    group.add(s)
    glints.push({ s, phase: rand() * 10, speed: 0.6 + rand() * 0.8, a: rand() * Math.PI * 2, y: rand() })
  }
  updates.push(t => {
    diamond.rotation.y = t * 0.9
    diamond.rotation.x = 0.25 + Math.sin(t * 0.7) * 0.1
    for (const g of glints) {
      const k = Math.max(0, Math.sin(t * g.speed * 2 + g.phase))
      g.s.material.opacity = k ** 6
      if (k < 0.02) {
        g.a = (g.a + 2.1) % (Math.PI * 2)
        g.y = (g.y + 0.37) % 1
      }
      const rr = 0.1 + g.y * 0.06
      g.s.position.set(Math.cos(g.a) * rr, 0.46 + 0.04 - g.y * 0.07, Math.sin(g.a) * rr + 0.04)
    }
  })

  // graphite: a stack of thin, shiny grey hexagonal flakes, slipping a little off each other
  const graphiteMat = new THREE.MeshStandardMaterial({ color: '#4a4e55', metalness: 0.65, roughness: 0.3, flatShading: true })
  const stack = new THREE.Group()
  for (let i = 0; i < 9; i++) {
    const flake = new THREE.Mesh(new THREE.CylinderGeometry(0.15 - i * 0.004, 0.15 - i * 0.004, 0.016, 6), graphiteMat)
    flake.position.set((rand() - 0.5) * 0.035 + i * 0.004, 0.008 + i * 0.019, (rand() - 0.5) * 0.03)
    flake.rotation.y = (rand() - 0.5) * 0.3
    stack.add(flake)
  }
  // the top flake slides off: graphite's layers slip (why a pencil writes)
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.014, 6), graphiteMat)
  stack.add(top)
  updates.push(t => {
    const k = (Math.sin(t * 0.8) + 1) / 2
    top.position.set(0.04 + k * 0.08, 0.008 + 9 * 0.019, 0)
  })
  stack.position.set(-0.3, 0, 0.12)
  group.add(stack)

  // a lump of coal: black, craggy, a dull sheen
  const coal = new THREE.Mesh(lump(0.13, rand, 0.72), new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.45, metalness: 0.35 }))
  coal.position.set(0.3, 0.085, 0.1)
  group.add(coal)

  return { group, update: t => updates.forEach(u => u(t)) }
}

// ---- Oxygen: liquid oxygen boiling in a glass flask, and a magnet holding a drop of it ----
function oxygen({ light }) {
  const group = new THREE.Group()
  const rand = rnd(808)
  const updates = []
  const LOX = '#3f8cff'
  // the flask and what happens in it, smaller than the case so the magnet shows beside it
  const dewar = new THREE.Group()
  dewar.position.set(-0.14, 0, -0.08)
  dewar.scale.setScalar(0.72)
  group.add(dewar)

  // a double-walled glass flask (a dewar)
  // glass that shows at its edges only: a transmissive flask hid what was inside, a milky one fogged it
  const glassMat = edgeGlass({ color: '#e6f2ff', edge: 0.6, base: 0.03 })
  const wall = [[0.15, 0], [0.17, 0.005], [0.18, 0.03], [0.18, 0.44], [0.19, 0.46], [0.16, 0.46], [0.155, 0.44], [0.155, 0.03], [0.0, 0.025]]
  const flask = new THREE.Mesh(new THREE.LatheGeometry(wall.map(([x, y]) => new THREE.Vector2(x, y)), 48), glassMat)
  const fx = 0
  flask.position.set(fx, 0, 0)
  // the pale blue liquid, a little lit from within so it reads in the dim case
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.3, 40),
    new THREE.MeshPhysicalMaterial({ color: LOX, roughness: 0.12, clearcoat: 0.6, emissive: LOX, emissiveIntensity: 0.22 }),
  )
  liquid.position.set(fx, 0.18, 0)
  dewar.add(liquid, flask)
  // bubbles rising through it: it boils at -183 °C, so in a warm room it boils all the time
  const bubbleMat = new THREE.MeshBasicMaterial({ color: '#e8f4ff', transparent: true, opacity: 0.8 })
  const bubbles = []
  for (let i = 0; i < 14; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.008 + rand() * 0.008, 8, 6), bubbleMat)
    dewar.add(b)
    bubbles.push({ b, x: (rand() - 0.5) * 0.22, z: (rand() - 0.5) * 0.22, phase: rand(), speed: 0.5 + rand() * 0.6 })
  }
  // cold fog spilling over the rim and sinking down the side
  const fog = []
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softSpot(), color: '#eef6ff', transparent: true, depthWrite: false, opacity: 0 }))
    dewar.add(s)
    fog.push({ s, phase: rand(), a: rand() * Math.PI * 2, speed: 0.12 + rand() * 0.1 })
  }
  updates.push(t => {
    for (const b of bubbles) {
      const k = (t * b.speed + b.phase) % 1
      b.b.position.set(fx + b.x * (1 - k * 0.3), 0.04 + k * 0.24, b.z * (1 - k * 0.3))
      b.b.visible = k < 0.96
    }
    for (const f of fog) {
      const k = (t * f.speed + f.phase) % 1
      // up out of the flask, over the rim, then down the outside, spreading and fading
      const out = Math.min(1, k * 2.2)
      const r = 0.12 + out * 0.1
      const y = k < 0.4 ? 0.44 + k * 0.2 : 0.52 - (k - 0.4) * 0.6
      f.s.position.set(fx + Math.cos(f.a) * r, y, Math.sin(f.a) * r)
      f.s.scale.setScalar(0.07 + k * 0.1)
      f.s.material.opacity = Math.sin(k * Math.PI) * 0.3
    }
  })

  // a horseshoe magnet with a drop of liquid oxygen held between its poles (oxygen is paramagnetic)
  const magnet = new THREE.Group()
  const red = new THREE.MeshStandardMaterial({ color: '#d8323c', roughness: 0.35, metalness: 0.2 })
  const steel = new THREE.MeshStandardMaterial({ color: '#d7dde6', roughness: 0.2, metalness: 1 })
  const bend = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.03, 16, 32, Math.PI), red)
  bend.position.y = 0.2
  magnet.add(bend)
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.06), red)
    leg.position.set(side * 0.075, 0.15, 0)
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.05, 0.062), steel)
    pole.position.set(side * 0.075, 0.075, 0)
    magnet.add(leg, pole)
  }
  // the drop bridging the poles
  const drop = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 24, 16),
    new THREE.MeshPhysicalMaterial({ color: LOX, roughness: 0.08, clearcoat: 0.6, emissive: LOX, emissiveIntensity: 0.25 }),
  )
  drop.scale.set(1.25, 0.8, 0.8)
  drop.position.set(0, 0.07, 0)
  magnet.add(drop)
  updates.push(t => drop.scale.set(1.25 + Math.sin(t * 3.1) * 0.04, 0.8 - Math.sin(t * 3.1) * 0.03, 0.8))
  magnet.position.set(0.2, 0.03, 0.13)
  magnet.scale.setScalar(1.25)
  magnet.rotation.y = -0.35
  // a small dark stand under the magnet
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), new THREE.MeshStandardMaterial({ color: '#2a3160', roughness: 0.5 }))
  block.position.set(0.2, 0.015, 0.13)
  block.scale.setScalar(1.25)
  block.rotation.y = -0.35
  group.add(block, magnet)

  return { group, update: t => updates.forEach(u => u(t)) }
}

/** A lump cut through by the plane x = c: the part on one side kept, what lay over the plane pressed onto
 *  it, so it has one flat face. keep -1 keeps x < c (the face looks along +x), 1 keeps x > c (the slice
 *  that came off; its face looks along -x). Group 0 is the lump's outside, group 1 the flat face (the
 *  same lump from the same seed on both sides gives a piece and the slice cut from it). */
function cutLump(r, rand, squash, c, keep = -1) {
  const g = lump(r, rand, squash).toNonIndexed()
  const p = g.attributes.position
  const n = g.attributes.normal
  for (let i = 0; i < p.count; i++) if ((p.getX(i) - c) * keep < 0) p.setX(i, c)
  const outside = []
  const face = []
  for (let t = 0; t < p.count / 3; t++) {
    const onFace = [0, 1, 2].every(k => Math.abs(p.getX(t * 3 + k) - c) < 1e-6)
    ;(onFace ? face : outside).push(t)
  }
  const pos = []
  const nor = []
  const uv = []
  for (const t of outside) {
    for (let k = 0; k < 3; k++) {
      const i = t * 3 + k
      pos.push(p.getX(i), p.getY(i), p.getZ(i))
      nor.push(n.getX(i), n.getY(i), n.getZ(i))
      uv.push(0, 0)
    }
  }
  for (const t of face) {
    for (let k = 0; k < 3; k++) {
      const i = t * 3 + k
      pos.push(p.getX(i), p.getY(i), p.getZ(i))
      nor.push(-keep, 0, 0)
      uv.push(0.5 + p.getZ(i) / (2 * r), 0.5 + p.getY(i) / (2 * r))
    }
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  out.addGroup(0, outside.length * 3, 0)
  out.addGroup(outside.length * 3, face.length * 3, 1)
  g.dispose()
  return out
}

// ---- Sodium: lumps kept under oil in a glass jar, and a piece just cut on filter paper ----
function sodium() {
  const group = new THREE.Group()
  const updates = []
  // the outside of every lump: the dull white-grey crust that air and damp leave on it in seconds
  // (oxide, hydroxide, carbonate); a fresh cut: bright metal, as shiny as polished silver
  // (the case's lamp and the hall's bloom light things two or three times brighter than their colour, and
  // turn anything pale into a white blob: every colour here is dark, as Carbon's coal is)
  const crust = new THREE.MeshStandardMaterial({ color: '#414449', roughness: 1, metalness: 0 })
  // a bare metal face only mirrors the pink hall: polished silver is drawn into it (bands of light and
  // shade, as a mirror catches a room), lit a little from within so it reads in the dim case
  const silver = canvasTexture(128, (g, s) => {
    const grad = g.createLinearGradient(0, 0, s, s)
    for (const [o, c] of [[0, '#5d6470'], [0.22, '#c4cad3'], [0.34, '#7d8592'], [0.5, '#dfe4ea'], [0.6, '#959daa'], [0.8, '#cfd5dd'], [1, '#69717e']]) grad.addColorStop(o, c)
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
  })
  const fresh = new THREE.MeshStandardMaterial({ map: silver, emissiveMap: silver, emissive: '#ffffff', emissiveIntensity: 0.14, roughness: 0.2, metalness: 0.35 })
  const kept = new THREE.MeshStandardMaterial({ color: '#474c57', roughness: 0.4, metalness: 0.6 })

  // ---- the jar: lumps at the bottom, covered by oil, a screw cap, a label
  const jar = new THREE.Group()
  jar.position.set(-0.15, 0, -0.07)
  group.add(jar)
  const rand = rnd(1807)
  for (const [r, x, z, ry] of [[0.056, -0.04, 0.02, 0], [0.046, 0.05, 0.035, 1.3], [0.044, 0.02, -0.055, 2.2], [0.036, -0.02, -0.02, 0.6]]) {
    const m = new THREE.Mesh(lump(r, rand, 0.72), kept)
    m.position.set(x, 0.008 + r * 0.66 + (r < 0.04 ? 0.06 : 0), z)
    m.rotation.y = ry
    jar.add(m)
  }
  // the oil (mineral oil keeps air and water off the metal): pale amber, a surface at its top
  const OIL = 0.235
  const oilMat = new THREE.MeshStandardMaterial({ color: '#c9a85a', transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false })
  const oil = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, OIL - 0.008, 48, 1, true), oilMat)
  oil.position.y = 0.008 + (OIL - 0.008) / 2
  oil.renderOrder = 1
  const surface = new THREE.Mesh(
    new THREE.CircleGeometry(0.125, 48),
    new THREE.MeshStandardMaterial({ color: '#e8b84a', transparent: true, opacity: 0.3, roughness: 0.04, metalness: 0.2, depthWrite: false }),
  )
  surface.rotation.x = -Math.PI / 2
  surface.position.y = OIL
  surface.renderOrder = 1
  jar.add(oil, surface)
  // glass that shows at its edges only (a transmissive or milky glass hid or fogged what was inside)
  const wall = [[0, 0.004], [0.115, 0], [0.128, 0.008], [0.132, 0.03], [0.132, 0.3], [0.124, 0.322], [0.104, 0.33], [0.104, 0.352]]
  const glass = new THREE.Mesh(new THREE.LatheGeometry(wall.map(([x, y]) => new THREE.Vector2(x, y)), 48), edgeGlass({ color: '#eef6ff', edge: 0.6, base: 0.03 }))
  glass.renderOrder = 2
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.113, 0.113, 0.052, 40), new THREE.MeshStandardMaterial({ color: '#23408c', roughness: 0.45 }))
  cap.position.y = 0.376
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.113, 0.01, 40), cap.material)
  capTop.position.y = 0.407
  // a label round the jar over the oil: the symbol and the orange of a hazard sign
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1335, 0.1335, 0.06, 32, 1, true, -0.6, 1.2),
    new THREE.MeshStandardMaterial({
      roughness: 0.8,
      map: canvasTexture(128, (g, s) => {
        g.fillStyle = '#f6f1e4'
        g.fillRect(0, 0, s, s)
        g.fillStyle = '#ff8a1e'
        g.fillRect(0, 0, s, s * 0.14)
        g.fillRect(0, s * 0.86, s, s * 0.14)
        g.fillStyle = '#1d2a5c'
        g.font = `700 ${s * 0.55}px Outfit, Nunito, sans-serif`
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.save()
        g.scale(0.375, 1) // the band is 2.7 times wider than high: squeeze the letters so they keep their shape on it
        g.fillText('Na', s / 2 / 0.375, s * 0.52)
        g.restore()
      }),
    }),
  )
  label.position.y = 0.282
  jar.add(glass, cap, capTop, label)

  // ---- the tile, filter paper with an oily stain, the cut piece, the slice and the knife
  const bench = new THREE.Group()
  bench.position.set(0.15, 0, 0.1)
  bench.rotation.y = -0.4
  group.add(bench)
  const TOP = 0.018
  const tile = new THREE.Mesh(new THREE.BoxGeometry(0.32, TOP, 0.24), new THREE.MeshStandardMaterial({ color: '#6c717c', roughness: 0.35 }))
  tile.position.y = TOP / 2
  const paper = new THREE.Mesh(new THREE.CircleGeometry(0.105, 40), new THREE.MeshStandardMaterial({ color: '#8c897f', roughness: 1 }))
  paper.rotation.x = -Math.PI / 2
  paper.position.set(-0.01, TOP + 0.0006, 0.005)
  const stain = new THREE.Mesh(
    new THREE.CircleGeometry(0.058, 32),
    new THREE.MeshStandardMaterial({ color: '#6e5c2c', transparent: true, opacity: 0.5, roughness: 0.6, depthWrite: false }),
  )
  stain.rotation.x = -Math.PI / 2
  stain.position.set(-0.03, TOP + 0.0012, 0.01)
  bench.add(tile, paper, stain)

  // the piece, crusted all round, its new face turned out and a little up; the slice that came off it
  // propped beside it, its face turned the other way: as the table turns one of them always faces you
  // (a face on top showed only edge-on from where a visitor stands)
  const R = 0.08
  const piece = new THREE.Mesh(cutLump(R, rnd(23), 0.74, 0.03, -1), [crust, fresh])
  piece.rotation.y = -Math.PI / 2 // the face (+x) looks along +z
  const tilt = new THREE.Group()
  tilt.rotation.x = -0.35 // and a little up
  tilt.position.set(-0.045, TOP + R * 0.66, -0.02)
  tilt.add(piece)
  const slice = new THREE.Mesh(cutLump(R, rnd(23), 0.74, 0.03, 1), [crust, fresh])
  slice.rotation.y = -Math.PI / 2 // the face (-x) looks along -z
  const prop = new THREE.Group()
  prop.rotation.x = 0.45 // and a little up
  prop.position.set(0.095, TOP + R * 0.5, -0.03)
  prop.add(slice)
  bench.add(tilt, prop)

  // the knife it was cut with: a steel blade and a wooden handle
  const blade = new THREE.Shape()
  blade.moveTo(0, 0)
  blade.lineTo(0.1, 0)
  blade.lineTo(0.125, 0.017)
  blade.lineTo(0, 0.02)
  blade.closePath()
  const knife = new THREE.Group()
  const steel = new THREE.Mesh(
    new THREE.ExtrudeGeometry(blade, { depth: 0.002, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: '#dfe5ec', metalness: 1, roughness: 0.22 }),
  )
  steel.rotation.x = -Math.PI / 2
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.014, 0.022), new THREE.MeshStandardMaterial({ color: '#7a4a26', roughness: 0.7 }))
  handle.position.set(-0.04, 0.007, -0.01)
  knife.add(steel, handle)
  knife.position.set(-0.02, TOP + 0.001, -0.085)
  knife.rotation.y = 0.18
  bench.add(knife)

  // glints that come and go on the two bright faces
  const glints = []
  for (const [host, x, y, z] of [[piece, 0.034, 0.012, 0.018], [piece, 0.034, -0.016, -0.02], [slice, 0.026, 0.01, 0.01]]) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: star(), color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(0.07)
    s.position.set(x, y, z)
    host.add(s)
    glints.push({ s, phase: glints.length * 2.3, speed: 0.7 + glints.length * 0.2 })
  }
  updates.push(t => {
    for (const g of glints) g.s.material.opacity = Math.max(0, Math.sin(t * g.speed + g.phase)) ** 8
  })

  return { group, update: t => updates.forEach(u => u(t)) }
}

/** How polished blue-grey silicon looks, drawn once as a matcap: a soft window high on the left, a smaller
 *  one on the right, a dark floor below, a cool rim. A matcap needs no light and mirrors nothing (a metallic
 *  face only mirrored the pink hall, and the case's lamp blew pale things out); on flat facets each one shows
 *  the shade its angle gives it, so as the table turns the facets flash one by one, as the grains of a
 *  lump of silicon glitter. */
let siliconCap = null
function siliconMatcap() {
  if (siliconCap) return siliconCap
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 256)
  for (const [o, col] of [[0, '#6a7488'], [0.35, '#465062'], [0.62, '#2a303c'], [1, '#14171e']]) base.addColorStop(o, col)
  g.fillStyle = base
  g.fillRect(0, 0, 256, 256)
  // a cool rim round the edge (normals turned away from the viewer)
  const rim = g.createRadialGradient(128, 128, 96, 128, 128, 128)
  rim.addColorStop(0, 'rgba(150,170,205,0)')
  rim.addColorStop(1, 'rgba(150,170,205,0.45)')
  g.fillStyle = rim
  g.fillRect(0, 0, 256, 256)
  // the windows: bright, but small, so only a few facets catch them at a time
  for (const [x, y, r, a] of [[84, 70, 28, 0.85], [182, 96, 16, 0.75], [150, 46, 10, 0.6], [60, 150, 9, 0.45]]) {
    const w = g.createRadialGradient(x, y, 0, x, y, r)
    w.addColorStop(0, `rgba(235,242,255,${a})`)
    w.addColorStop(0.5, `rgba(190,205,230,${a * 0.6})`)
    w.addColorStop(1, 'rgba(190,205,230,0)')
    g.fillStyle = w
    g.fillRect(x - r, y - r, 2 * r, 2 * r)
  }
  siliconCap = new THREE.CanvasTexture(c)
  siliconCap.colorSpace = THREE.SRGBColorSpace
  return siliconCap
}

/** A broken chunk of polycrystalline silicon, about r across: rounded by smooth waves, knobbly with finer
 *  ones (functions of the direction, so faces that share a corner stay joined), broken flat by a few planes,
 *  one of them underneath so it sits on the table. Flat facets, each coloured by the grain it lies in (the
 *  nearest of a few random directions). */
function siliconChunk(r, rand) {
  // small facets (a coarse sphere's even triangles read as a geodesic ball, not a rock)
  const g = new THREE.IcosahedronGeometry(r, 4)
  const geo = g.index ? g.toNonIndexed() : g
  const p = geo.attributes.position
  const waves = Array.from({ length: 4 }, () => [rand() * 6, rand() * 6, rand() * 6, 2 + rand() * 3])
  const fine = Array.from({ length: 4 }, () => [rand() * 6, rand() * 6, rand() * 6, 14 + rand() * 8])
  // broken faces: one underneath, so it sits on the table, and five round its sides and top
  const cuts = [[new THREE.Vector3(0, -1, 0), 0.5]]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rand() * 0.8
    cuts.push([new THREE.Vector3(Math.cos(a), 0.2 + rand() * 0.7, Math.sin(a)).normalize(), 0.62 + rand() * 0.12])
  }
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = v.clone().normalize()
    let k = 1
    for (const [a, b, c, f] of waves) k += 0.13 * Math.sin(n.x * f + a) * Math.sin(n.y * f + b) * Math.sin(n.z * f + c)
    for (const [a, b, c, f] of fine) k += 0.035 * Math.sin(n.x * f + a) * Math.sin(n.y * f + b) * Math.sin(n.z * f + c)
    v.copy(n).multiplyScalar(r * k)
    v.set(v.x * 1.2, v.y * 0.75, v.z * 0.95)
    for (const [pn, d] of cuts) {
      const s = v.dot(pn)
      if (s > d * r) v.addScaledVector(pn, d * r - s)
    }
    p.setXYZ(i, v.x, v.y, v.z)
  }
  // grains: each face takes the shade of the grain its middle lies in (shades multiply the matcap)
  const seeds = Array.from({ length: 9 }, () => new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize())
  const shades = ['#ffffff', '#d6def0', '#bcc4d4', '#e6e2ee', '#a9b2c6', '#cfd8ff', '#9aa2b4', '#f0f2ff', '#b8c0dc'].map(c => new THREE.Color(c))
  const colors = []
  const m = new THREE.Vector3()
  for (let t = 0; t < p.count / 3; t++) {
    m.set(0, 0, 0)
    for (let k = 0; k < 3; k++) m.add(v.fromBufferAttribute(p, t * 3 + k))
    m.normalize()
    let best = 0
    seeds.forEach((s, i) => { if (s.dot(m) > seeds[best].dot(m)) best = i })
    const c = shades[best]
    for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

// ---- Silicon: a lump of polycrystalline silicon, and a piece of a single-crystal boule with a polished
// wafer sliced from it, standing in a holder (the lab shows a lump turned in the light and a wafer of chips;
// here the two kinds side by side: many crystals, and one) ----
function silicon() {
  const group = new THREE.Group()
  const updates = []
  const rand = rnd(1824)
  const cap = siliconMatcap()

  // the lump: grey-blue, its grains flashing as the table turns
  const R = 0.135
  const lumpMesh = new THREE.Mesh(siliconChunk(R, rand), new THREE.MeshMatcapMaterial({ matcap: cap, vertexColors: true, flatShading: true }))
  lumpMesh.position.set(-0.11, R * 0.5, 0.09) // its flat underside is at -0.5 R
  lumpMesh.rotation.y = 0.6
  group.add(lumpMesh)

  // a polished face: a grey mirror drawn into it (a real one only showed the pink hall), lit a little from
  // within, as sodium's cut face
  const mirror = canvasTexture(128, (g, s) => {
    const grad = g.createLinearGradient(0, 0, s, s * 0.8)
    for (const [o, c] of [[0, '#2c313c'], [0.2, '#8f9aad'], [0.3, '#3d4452'], [0.47, '#b9c3d3'], [0.55, '#59616f'], [0.78, '#9aa5b8'], [1, '#30353f']]) grad.addColorStop(o, c)
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
  })
  const face = new THREE.MeshStandardMaterial({ map: mirror, emissiveMap: mirror, emissive: '#ffffff', emissiveIntensity: 0.14, roughness: 0.25, metalness: 0.3 })

  // the boule: one crystal pulled from the melt, lying in a cradle at the back: the shoulder and the thin
  // neck of the seed at one end, sawn flat and polished at the other; smooth, so the matcap's windows slide
  // along it like a polished cylinder's (standing up it read as a bottle and hid the rest)
  const B = 0.075
  const profile = [[0, 0], [B - 0.004, 0], [B, 0.004], [B, 0.19], [B * 0.86, 0.222], [B * 0.5, 0.25], [0.015, 0.266], [0.01, 0.272], [0.01, 0.3], [0, 0.302]]
  const bouleMat = new THREE.MeshMatcapMaterial({ matcap: cap, color: '#e4e8f2' })
  const boule = new THREE.Group()
  boule.add(new THREE.Mesh(new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 64), bouleMat))
  // the faint ridges a crystal grown along <100> shows down its length, four of them
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.18, 0.004), bouleMat)
    ridge.position.set(Math.cos(a) * B, 0.097, Math.sin(a) * B)
    ridge.rotation.y = -a + Math.PI / 2
    boule.add(ridge)
  }
  const end = new THREE.Mesh(new THREE.CircleGeometry(B - 0.003, 48), face)
  end.rotation.x = Math.PI / 2 // faces -y: the sawn end
  end.position.y = -0.001
  boule.add(end)
  boule.rotation.z = -Math.PI / 2 // lying along x, the sawn end looking along -x
  const CR = 0.02
  boule.position.set(-0.13, CR + B * 0.92, -0.14)
  boule.rotation.y = 0.25
  group.add(boule)
  // the cradle: two dark blocks under it
  const cradleMat = new THREE.MeshStandardMaterial({ color: '#2a3160', roughness: 0.5 })
  for (const t of [0.06, 0.22]) {
    const blk = new THREE.Mesh(new THREE.BoxGeometry(0.04, CR + 0.03, 0.12), cradleMat)
    blk.position.set(-0.13 + Math.cos(0.25) * t, (CR + 0.03) / 2, -0.14 - Math.sin(0.25) * t)
    blk.rotation.y = 0.25
    group.add(blk)
  }

  // the wafer: a slice of the same crystal, with the flat that marks how its atoms are lined up, polished
  // to a grey mirror on both faces (the drawn mirror above), standing in a slotted holder at the front, so
  // its face looks out one way while the boule's sawn end looks out another
  const W = B
  const T = 0.005
  const flat = -0.93 * W
  const a0 = -Math.PI / 2 + Math.acos(-flat / W)
  const shape = new THREE.Shape()
  for (let i = 0; i <= 96; i++) {
    const a = a0 + (i / 96) * (Math.PI * 2 - 2 * (a0 + Math.PI / 2))
    if (i === 0) shape.moveTo(Math.cos(a) * W, Math.sin(a) * W)
    else shape.lineTo(Math.cos(a) * W, Math.sin(a) * W)
  }
  shape.closePath()
  const wg = new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false, curveSegments: 1 })
  wg.translate(0, 0, -T / 2)
  const wp = wg.attributes.position
  const wuv = wg.attributes.uv
  for (let i = 0; i < wp.count; i++) wuv.setXY(i, wp.getX(i) / (2 * W) + 0.5, wp.getY(i) / (2 * W) + 0.5)
  const edge = new THREE.MeshMatcapMaterial({ matcap: cap, color: '#c8cede' })
  const wafer = new THREE.Mesh(wg, [face, edge])
  const holder = new THREE.Group()
  const SLOT = 0.03
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.12, SLOT, 0.05), new THREE.MeshStandardMaterial({ color: '#2a3160', roughness: 0.5 }))
  block.position.y = SLOT / 2
  wafer.position.y = SLOT * 0.6 - flat
  wafer.rotation.x = -0.08
  holder.add(block, wafer)
  holder.position.set(0.12, 0, 0.17)
  holder.rotation.y = -0.35
  group.add(holder)

  // glints that come and go on the lump's facets
  const glints = []
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: star(), color: '#eef3ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(0.06)
    lumpMesh.add(s)
    glints.push({ s, phase: rand() * 10, speed: 0.5 + rand() * 0.7 })
  }
  const spot = () => {
    const n = new THREE.Vector3(rand() - 0.5, rand() * 0.8, rand() - 0.5).normalize()
    return new THREE.Vector3(n.x * R, n.y * R * 0.8, n.z * R)
  }
  for (const g of glints) g.s.position.copy(spot())
  updates.push(t => {
    for (const g of glints) {
      const k = Math.max(0, Math.sin(t * g.speed * 2 + g.phase))
      g.s.material.opacity = k ** 8
      if (k < 0.02) g.s.position.copy(spot())
    }
  })

  // a little bigger than the others' 0.6 m: three things share the table
  group.scale.setScalar(1.15)
  return { group, update: t => updates.forEach(u => u(t)) }
}

export const SHOWPIECES = { C: carbon, O: oxygen, Na: sodium, Si: silicon }
