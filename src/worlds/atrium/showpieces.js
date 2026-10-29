// Showpieces: an element's own exhibit in its specimen case, in place of the generic form, where a
// generic form cannot say what the element is like (the user, 2026-10-29: the case's samples were
// "often generic polyhedra"; Carbon and Oxygen first). Each is built at the generic sample's size
// (about 0.6 m across on the turntable, before the case scales it) and returns { group, update(t) }.
import * as THREE from 'three'
import { edgeGlass } from '../common/props.js'

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

export const SHOWPIECES = { C: carbon, O: oxygen }
