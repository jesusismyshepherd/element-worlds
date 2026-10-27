// Signatures: an object from each element's own story (look.js SIGNATURE), worn or carried, made of a
// few primitives and big enough to read at the size of the /atomlings cards. Where each one goes:
// - In a hand (kit.hand()): the left hand, or the only one; a four-handed one lifts it in an upper
//   hand. The object is turned upright again every frame, whatever the shoulder does, so it waves
//   with the hand without tipping over. A metal holds out an electron at its fingertips (on the outer
//   side of the fist: below it at rest, above it in a wave or on a raised hand), so in a metal's hand
//   the object sits a little inward and back, and rises from the fist: the electron stays clear.
// - On the head (kit.head()), round the body on its surface (kit.body with surf/normalAt), beside the
//   body (kit.beside(), for the noble gases, which have no hands) or under it (kit.under()).
// Without arms (the Molecule Lab draws its own bonds) the objects held in a hand, beside or under the
// body are left out; the ones on the head or worn on the body stay.
// Materials: only kinds every Atomling already compiles (standard, standard see-through, basic), so a
// signature adds no shader program; each colour is made once per Atomling (kit.solid, glow, clear).
import * as THREE from 'three'

const TAU = Math.PI * 2

// ---- geometry helpers (sizes in the units of the group they go in) ----

/** A coin-like disc facing forward (+z). */
const disc = (r, t, seg = 32) => new THREE.CylinderGeometry(r, r, t, seg).rotateX(Math.PI / 2)

/** Flat facets, as on a cut gem (no new shader: the normals do it). */
const faceted = geo => {
  const g = geo.index ? geo.toNonIndexed() : geo
  g.computeVertexNormals()
  return g
}

const lathe = (pts, seg = 24) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)

const tube = (pts, r, seg = 32, closed = false) =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => (p.isVector3 ? p : new THREE.Vector3(...p))), closed), seg, r, 6, closed)

/** A solid cut from a flat shape, centred on z (closed, so it shows from both sides). */
const extrude = (shape, depth, bevel = 0) => {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 18 })
  g.translate(0, 0, -depth / 2)
  return g
}

/** A drop: round below, pointed on top (water drops, flames). Its base is at y = 0. */
const teardrop = (r, h) => lathe([[0, 0], [r * 0.55, h * 0.03], [r * 0.88, h * 0.12], [r, h * 0.27], [r * 0.9, h * 0.42], [r * 0.62, h * 0.6], [r * 0.3, h * 0.8], [0, h]], 18)

const starShape = (ro, ri, n = 5) => {
  const s = new THREE.Shape()
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = Math.PI / 2 + (i * Math.PI) / n
    if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    else s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  s.closePath()
  return s
}

/** Points round a heart, about 2 * size wide, centred. */
const heartPoints = (size, n = 56) => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * TAU
  const x = 16 * Math.sin(t) ** 3
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return [(x * size) / 16, ((y + 2.5) * size) / 16, 0]
})

const heartShape = size => {
  const pts = heartPoints(size, 48)
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  return s
}

/** A crescent moon: a disc of radius R minus the same disc moved right by d. */
const crescentShape = (R, d) => {
  const s = new THREE.Shape()
  const y = Math.sqrt(R * R - (d * d) / 4)
  const th = Math.atan2(y, d / 2)
  s.absarc(0, 0, R, th, TAU - th, false)
  s.absarc(d, 0, R, Math.PI + th, Math.PI - th, true)
  return s
}

/** A pillow: a box puffed up in the middle. */
function pillowGeometry() {
  const geo = new THREE.BoxGeometry(1, 1, 1, 12, 2, 12)
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) {
    const f = (1 - Math.abs(2 * p.getX(i)) ** 3) * (1 - Math.abs(2 * p.getZ(i)) ** 3)
    p.setY(i, p.getY(i) * (0.18 + 0.82 * f))
  }
  geo.computeVertexNormals()
  return geo
}

/** A lumpy rock (the asteroid), the same every time. */
function rockGeometry(r) {
  const geo = new THREE.IcosahedronGeometry(r, 1)
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    // a bump that depends on the direction only, so shared corners stay together
    const k = 0.82 + 0.3 * (0.5 + 0.5 * Math.sin(v.x * 61 + v.y * 37 + v.z * 23))
    v.multiplyScalar(k)
    p.setXYZ(i, v.x, v.y, v.z)
  }
  return faceted(geo)
}

/** A gem cut as a brilliant: a crown on top, a pointed pavilion below. */
function gemGeometry(r) {
  const crown = new THREE.CylinderGeometry(r * 0.6, r, r * 0.42, 8, 1)
  crown.translate(0, r * 0.21, 0)
  const pavilion = new THREE.ConeGeometry(r, r * 0.95, 8, 1)
  pavilion.rotateX(Math.PI)
  pavilion.translate(0, -r * 0.475, 0)
  return [faceted(crown), faceted(pavilion)]
}

// ---- the kit: where things go, and the materials ----

function kitFor(kind, rig) {
  const { body, H, W, Hb, y0, surf, normalAt, onSurface, radiusAt, arms, armLen, armR, giving, withArms } = rig
  const updates = []
  const cache = new Map()
  const once = (key, make) => {
    if (!cache.has(key)) cache.set(key, make())
    return cache.get(key)
  }
  const tag = o => {
    o.userData.signature = kind
    return o
  }
  /** A group in `parent`; with `unit` its unit is the character's height (objects drawn at H = 1). */
  const group = (parent, unit = true) => {
    const g = tag(new THREE.Group())
    if (unit) g.scale.setScalar(H)
    parent.add(g)
    return g
  }
  const anchors = new Map()
  const free = arms.filter(a => !a.top)
  const pick = prefer => (free.length === 4 ? (prefer === 'low' ? free[3] : free[1]) : free.find(a => a.side > 0) ?? free[0])

  const kit = {
    kind, H, W, Hb, y0, top: y0 + Hb, wr: W / H, body, updates, surf, normalAt, onSurface, radiusAt, group,
    // objects that float free of the body (beside it, round it) only come with arms (not in the lab)
    loose: withArms,
    on: fn => updates.push(fn),
    /** Glossy toy plastic, paint or metal. */
    solid: (color, { metal = 0, rough = 0.32, glow = 0 } = {}) => once(`s${color}|${metal}|${rough}|${glow}`, () => new THREE.MeshStandardMaterial({
      color, metalness: metal, roughness: rough, emissive: glow ? color : '#000000', emissiveIntensity: glow,
    })),
    /** Something that gives light (bloom makes it glow). */
    glow: (color, intensity = 1.8) => once(`g${color}|${intensity}`, () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 })),
    /** Glass, water, mist. */
    clear: (color, opacity = 0.35, glow = 0) => once(`c${color}|${opacity}|${glow}`, () => new THREE.MeshStandardMaterial({
      color, transparent: true, opacity, roughness: 0.06, metalness: 0.1, depthWrite: false, emissive: color, emissiveIntensity: glow,
    })),
    /** Thin lines (a string, a fishing line). */
    line: color => once(`l${color}`, () => new THREE.MeshBasicMaterial({ color })),
    add(parent, geo, mat, p = null, r = null, s = null) {
      const m = tag(new THREE.Mesh(geo, mat))
      if (p) m.position.set(p[0], p[1], p[2])
      if (r) m.rotation.set(r[0], r[1], r[2])
      if (s != null) {
        if (typeof s === 'number') m.scale.setScalar(s)
        else m.scale.set(s[0], s[1], s[2])
      }
      if (mat.transparent) m.userData.noShadow = true
      parent.add(m)
      return m
    },
    /** A thin rod from point a to point b. */
    rod(parent, a, b, r, mat) {
      const from = new THREE.Vector3(...a)
      const d = new THREE.Vector3(...b).sub(from)
      const m = kit.add(parent, new THREE.CylinderGeometry(r, r, d.length(), 6), mat)
      m.position.copy(from).addScaledVector(d, 0.5)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
      return m
    },
    /** The fist of the holding hand, kept upright; null without arms. Its unit is `size` times the
     *  character's height (things in hands are drawn larger than life, to read on the cards); its
     *  userData says the side (+1 the left hand, -1 the right) and whether it is raised (a four-handed
     *  one's upper hand). `prefer: 'low'` takes a four-handed one's lower hand. */
    hand({ prefer = 'high', size = 1.5, inset = null } = {}) {
      if (!withArms || !free.length) return null
      const a = pick(prefer)
      if (!anchors.has(a)) {
        const anchor = tag(new THREE.Group())
        anchor.position.set(0, -armLen - armR, 0)
        a.swing.add(anchor)
        // undo the shoulder's turn (z, then the forward tilt): what the hand holds stands upright
        const upright = () => anchor.rotation.set(-a.pivot.rotation.x, 0, -a.pivot.rotation.z, 'ZYX')
        upright()
        updates.push(upright)
        anchors.set(a, anchor)
      }
      const unit = group(anchors.get(a), false)
      unit.scale.setScalar(H * size)
      // a metal holds out an electron on the outer side of its fist (below it at rest, above it in a
      // wave or on a raised hand): the object sits inward and back of it; a one-handed metal waves
      // with what it holds, so further in
      const inward = inset ?? (giving ? (free.length === 1 ? 0.11 : 0.055) : 0)
      unit.position.set(-a.side * inward * H, 0, giving ? -0.04 * H : 0)
      Object.assign(unit.userData, { hand: true, side: a.side, raised: free.length === 4 && !a.lower })
      return unit
    },
    /** The wrist of the holding hand (turns with the arm; the arm runs along -y). */
    wrist() {
      if (!withArms || !free.length) return null
      const a = pick('low')
      const g = group(a.swing)
      g.position.set(0, -armLen * 0.78, 0)
      g.userData.side = a.side
      return g
    },
    /** On top of the head (units of H). */
    head() {
      const g = group(body)
      g.position.set(0, y0 + Hb, 0)
      return g
    },
    /** Beside the body on the free side (+x, the character's left), at a height fraction; units of H. */
    beside(yf, gap = 0.12) {
      if (!withArms) return null
      const g = group(body)
      g.position.set(radiusAt(yf) * W + gap * H, y0 + yf * Hb, 0)
      return g
    },
    /** Under the body (a floater sits on it); units of H. */
    under() {
      if (!withArms) return null
      const g = group(body)
      g.position.set(0, y0, 0)
      return g
    },
  }
  return kit
}

// ---- the objects ----

/** A flag on a pole in the hand; stripes listed left to right as seen from the front. */
function flag(k, stripes, { vertical = false, sun = null, cross = null } = {}) {
  // the pole goes through the fist (a thin pole passes the held-out electron)
  const g = k.hand({ size: 1.15, inset: 0 })
  if (!g) return
  const s = g.userData.side
  k.add(g, new THREE.CylinderGeometry(0.012, 0.012, 0.54, 8), k.solid('#59606e', { metal: 0.8, rough: 0.3 }), [0, 0.21, 0])
  k.add(g, new THREE.SphereGeometry(0.022, 10, 8), k.solid('#f2c14e', { metal: 1, rough: 0.25 }), [0, 0.49, 0])
  const cloth = k.group(g, false)
  cloth.position.set(0, 0.37, 0)
  const w = 0.3
  const h = 0.19
  const d = 0.012
  const n = stripes.length
  // the cloth flies outward from the pole; the front always reads in the flag's own order
  const x0 = s > 0 ? 0 : -w
  stripes.forEach((c, i) => {
    if (vertical) k.add(cloth, new THREE.BoxGeometry(w / n, h, d), k.solid(c, { rough: 0.6 }), [x0 + (w / n) * (i + 0.5), 0, 0])
    else k.add(cloth, new THREE.BoxGeometry(w, h / n, d), k.solid(c, { rough: 0.6 }), [x0 + w / 2, h / 2 - (h / n) * (i + 0.5), 0])
  })
  if (sun) k.add(cloth, disc(h * 0.3, d * 1.7, 28), k.solid(sun, { rough: 0.5 }), [x0 + w / 2, 0, 0])
  if (cross) {
    // a Nordic cross, its upright nearer the hoist (as the flag's front shows it)
    k.add(cloth, new THREE.BoxGeometry(w * 0.13, h, d * 1.6), k.solid(cross, { rough: 0.5 }), [x0 + w * 0.36, 0, 0])
    k.add(cloth, new THREE.BoxGeometry(w, h * 0.2, d * 1.6), k.solid(cross, { rough: 0.5 }), [x0 + w / 2, 0, 0])
  }
  k.on((dt, t) => (cloth.rotation.y = s * Math.sin(t * 2.4) * 0.22))
}

/** A planet floating over the palm, turning slowly. */
function planet(k, build) {
  const g = k.hand()
  if (!g) return
  const p = k.group(g, false)
  p.position.set(0, 0.17, 0)
  build(p)
  k.on((dt, t) => {
    p.rotation.y = t * 0.6
    p.position.y = 0.17 + Math.sin(t * 1.8) * 0.012
  })
}

const BUILD = {
  // ---- the first thirteen (2026-10-27) ----

  drop(k) {
    // hydrogen: a drop of water floating beside it (water is two hydrogens and an oxygen)
    const g = k.beside(0.85, 0.28)
    if (!g) return
    k.add(g, teardrop(0.1, 0.27), k.solid('#59b4ff', { rough: 0.05, glow: 0.12 }), [0, -0.12, 0])
    const y = g.position.y
    k.on((dt, t) => (g.position.y = y + Math.sin(t * 2.2) * 0.04 * k.H))
  },

  balloon(k) {
    // helium: a party balloon on a string, bobbing above (helium never bonds: it stays in the lab too)
    const { H, W, Hb, y0, top } = k
    const g = k.group(k.body, false)
    const pink = k.solid('#ff4f7a', { rough: 0.15 })
    k.add(g, new THREE.SphereGeometry(H * 0.2, 24, 18), pink, [W * 0.5, top + H * 0.75, -W * 0.1], null, [1, 1.15, 1])
    k.add(g, new THREE.ConeGeometry(H * 0.03, H * 0.05, 10), pink, [W * 0.5, top + H * 0.52, -W * 0.1], [Math.PI, 0, 0])
    const pts = [[W * 0.5, top + H * 0.5, -W * 0.1], [W * 0.42, top + H * 0.2, -W * 0.05], [W * 0.3, y0 + Hb * 0.6, 0]]
    k.add(g, tube(pts, H * 0.004, 16), k.line('#f2f2f2'))
    k.on((dt, t) => (g.rotation.z = Math.sin(t * 1.3) * 0.06))
  },

  battery(k) {
    // lithium: a battery (lithium-ion batteries power phones and electric cars)
    const g = k.hand()
    if (!g) return
    const steel = k.solid('#d3d8e0', { metal: 1, rough: 0.28 })
    k.add(g, new THREE.CylinderGeometry(0.054, 0.054, 0.2, 20), k.solid('#2d6cdf', { metal: 0.4, rough: 0.3 }), [0, 0.13, 0])
    k.add(g, new THREE.CylinderGeometry(0.055, 0.055, 0.05, 20), steel, [0, 0.21, 0])
    k.add(g, new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12), steel, [0, 0.245, 0])
    k.add(g, new THREE.CylinderGeometry(0.055, 0.055, 0.012, 20), steel, [0, 0.028, 0])
    // the + on its side
    const plus = k.solid('#f4f6fb', { rough: 0.4 })
    k.add(g, new THREE.BoxGeometry(0.036, 0.01, 0.01), plus, [0, 0.14, 0.054])
    k.add(g, new THREE.BoxGeometry(0.01, 0.036, 0.01), plus, [0, 0.14, 0.054])
  },

  salt(k) {
    // sodium: a salt shaker (table salt is sodium chloride)
    const g = k.hand()
    if (!g) return
    k.add(g, lathe([[0, 0.01], [0.052, 0.01], [0.058, 0.03], [0.053, 0.16], [0.047, 0.18], [0, 0.18]]), k.solid('#f2f5fb', { rough: 0.18 }))
    k.add(g, new THREE.SphereGeometry(0.05, 18, 10, 0, TAU, 0, Math.PI / 2), k.solid('#c9ced8', { metal: 1, rough: 0.25 }), [0, 0.175, 0])
    const hole = new THREE.SphereGeometry(0.008, 6, 4)
    for (const [x, z] of [[0, 0.028], [-0.021, 0.017], [0.021, 0.017], [0, 0.0]]) k.add(g, hole, k.solid('#2a2d36'), [x, 0.175 + Math.sqrt(0.05 ** 2 - x * x - z * z) - 0.002, z])
  },

  leaf(k) {
    // magnesium: a leaf on its head (a magnesium atom sits at the heart of every chlorophyll)
    const g = k.head()
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.quadraticCurveTo(0.12, 0.11, 0, 0.29)
    s.quadraticCurveTo(-0.12, 0.11, 0, 0)
    const leaf = k.group(g, false)
    leaf.position.set(0, -0.02, 0)
    leaf.rotation.set(-0.2, 0.5, 0.2)
    k.add(leaf, extrude(s, 0.014, 0.004), k.solid('#4cc94c', { rough: 0.45 }))
    k.add(leaf, new THREE.BoxGeometry(0.008, 0.22, 0.024), k.solid('#8be38b', { rough: 0.5 }), [0, 0.12, 0])
    k.on((dt, t) => (leaf.rotation.z = 0.2 + Math.sin(t * 2) * 0.08))
  },

  match(k) {
    // phosphorus: a burning match (the striking strip on the box is red phosphorus)
    const g = k.hand()
    if (!g) return
    k.add(g, new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), k.solid('#e9c99a', { rough: 0.6 }), [0, 0.09, 0])
    k.add(g, new THREE.SphereGeometry(0.03, 12, 10), k.solid('#c23b22', { rough: 0.5 }), [0, 0.25, 0], null, [1, 1.4, 1])
    const fire = k.add(g, teardrop(0.048, 0.15), k.glow('#ffa02a', 2), [0, 0.255, 0])
    const core = k.add(g, teardrop(0.025, 0.08), k.glow('#fff3b0', 2.4), [0, 0.262, 0.014])
    k.on((dt, t) => {
      const f = 1 + Math.sin(t * 17) * 0.08 + Math.sin(t * 11.3) * 0.06
      fire.scale.set(1 / f, f, 1 / f)
      core.scale.set(1, f, 1)
    })
  },

  banana(k) {
    // potassium: a banana (bananas are rich in potassium)
    const g = k.hand()
    if (!g) return
    // it curves inward, toward the head, clear of the electron held out on the outer side
    const s = -g.userData.side
    const pts = [[0, 0.03], [0.04, 0.11], [0.055, 0.2], [0.035, 0.29], [-0.015, 0.35]].map(([x, y]) => [x * s, y, 0])
    k.add(g, tube(pts, 0.04, 24), k.solid('#ffd93b', { rough: 0.45 }))
    for (const [x, y] of [pts[0], pts[4]]) k.add(g, new THREE.SphereGeometry(0.03, 10, 8), k.solid('#6b4a2a', { rough: 0.7 }), [x, y, 0])
  },

  bone(k) {
    // calcium: a bone (our bones and teeth are made with calcium)
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.position.set(0, 0.14, 0)
    b.rotation.z = -0.45 * g.userData.side
    const mat = k.solid('#f3ead6', { rough: 0.55 })
    k.add(b, new THREE.CylinderGeometry(0.03, 0.03, 0.26, 12), mat)
    for (const y of [-0.13, 0.13]) for (const x of [-0.032, 0.032]) k.add(b, new THREE.SphereGeometry(0.045, 12, 10), mat, [x, y, 0])
  },

  chip(k) {
    // silicon: a computer chip
    const g = k.hand()
    if (!g) return
    const c = k.group(g, false)
    c.position.set(0, 0.17, 0.02)
    c.rotation.set(-0.15, -0.25 * g.userData.side, 0)
    k.add(c, new THREE.BoxGeometry(0.2, 0.2, 0.03), k.solid('#1f2430', { rough: 0.35 }))
    k.add(c, new THREE.BoxGeometry(0.09, 0.09, 0.034), k.solid('#3a4150', { metal: 0.5, rough: 0.3 }))
    const pin = new THREE.BoxGeometry(0.016, 0.05, 0.01)
    const gold = k.solid('#d9b75a', { metal: 1, rough: 0.3 })
    for (let i = -2; i <= 2; i++) {
      for (const e of [-1, 1]) {
        k.add(c, pin, gold, [i * 0.036, e * 0.12, 0])
        k.add(c, pin, gold, [e * 0.12, i * 0.036, 0], [0, 0, Math.PI / 2])
      }
    }
  },

  magnet(k) {
    // iron: a horseshoe magnet with a nail it holds up (iron is magnetic)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const m = k.group(g, false)
    m.position.set(0, 0.12, -0.01)
    const red = k.solid('#e23b3b', { rough: 0.35 })
    const steel = k.solid('#d8dde6', { metal: 1, rough: 0.3 })
    k.add(m, new THREE.TorusGeometry(0.075, 0.032, 10, 24, Math.PI), red, null, [0, 0, Math.PI])
    for (const x of [-0.075, 0.075]) {
      k.add(m, new THREE.BoxGeometry(0.064, 0.11, 0.064), red, [x, 0.055, 0])
      k.add(m, new THREE.BoxGeometry(0.066, 0.045, 0.066), steel, [x, 0.132, 0])
    }
    // a nail stuck to the outer pole
    const nail = k.group(m, false)
    nail.position.set(0.075 * s, 0.155, 0)
    nail.rotation.z = -0.55 * s
    k.add(nail, new THREE.CylinderGeometry(0.009, 0.009, 0.12, 6), steel, [0, 0.06, 0])
    k.add(nail, new THREE.CylinderGeometry(0.02, 0.02, 0.008, 12), steel, [0, 0.12, 0])
  },

  coil(k) {
    // copper: a coil of copper wire round its middle (copper wires carry electricity)
    const { H, Hb, y0 } = k
    const pts = []
    for (let i = 0; i <= 120; i++) {
      const u = i / 120
      const a = u * TAU * 5
      const yf = 0.32 + u * 0.16
      const p0 = k.surf(yf, 0)
      const r = Math.hypot(p0.x, p0.z) + H * 0.02
      pts.push(new THREE.Vector3(Math.sin(a) * r, y0 + yf * Hb, Math.cos(a) * r))
    }
    k.add(k.body, tube(pts, H * 0.012, 400), k.solid('#e0864f', { metal: 1, rough: 0.25 }))
  },

  bulb(k) {
    // tungsten: a light bulb with a glowing filament (its best-known job); it takes the helmet's place
    const g = k.head()
    k.add(g, new THREE.CylinderGeometry(0.045, 0.05, 0.07, 16), k.solid('#b9bcc4', { metal: 1, rough: 0.3 }), [0, 0.03, 0])
    k.add(g, new THREE.SphereGeometry(0.1, 20, 16), k.clear('#fff2d0', 0.35, 0.45), [0, 0.14, 0])
    const fil = k.add(g, new THREE.TorusGeometry(0.03, 0.006, 6, 16, Math.PI * 1.4), k.glow('#ffb347', 1.6), [0, 0.14, 0])
    k.on((dt, t) => (fil.material.emissiveIntensity = 1.6 + Math.sin(t * 7) * 0.2))
  },

  crown(k) {
    // gold: a crown; it takes the helmet's place
    const g = k.head()
    const r = 0.3 * k.wr
    const gold = k.solid('#ffcc33', { metal: 1, rough: 0.2 })
    // the band: a ring with a thickness (closed, so it shows inside and out)
    k.add(g, lathe([[r, -0.09], [r * 1.07, -0.09], [r * 1.0, 0.01], [r * 0.93, 0.01], [r, -0.09]], 40), gold)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU
      k.add(g, new THREE.ConeGeometry(0.035, 0.1, 10), gold, [Math.sin(a) * r * 0.97, 0.05, Math.cos(a) * r * 0.97])
      k.add(g, new THREE.SphereGeometry(0.022, 10, 8), k.glow(i % 2 ? '#ff3355' : '#33aaff', 1.6), [Math.sin(a) * r * 1.07, -0.04, Math.cos(a) * r * 1.07])
    }
  },

  // ---- added 2026-10-28 ----

  mirror(k) {
    // beryllium: the James Webb Space Telescope's golden mirror (its segments are beryllium)
    const g = k.hand()
    if (!g) return
    const m = k.group(g, false)
    m.position.set(0, 0.17, 0.02)
    m.rotation.y = -0.2 * g.userData.side
    const hex = new THREE.CylinderGeometry(0.056, 0.056, 0.014, 6).rotateX(Math.PI / 2)
    const gold = k.solid('#f2c14e', { metal: 1, rough: 0.22 })
    k.add(m, hex, gold)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3
      k.add(m, hex, gold, [Math.cos(a) * 0.102, Math.sin(a) * 0.102, 0])
    }
    // the small mirror held out in front on three struts
    const strut = k.solid('#2a2d36', { rough: 0.5 })
    for (let i = 0; i < 3; i++) {
      const a = Math.PI / 2 + (i * TAU) / 3
      k.rod(m, [Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0.008], [0, 0, 0.11], 0.004, strut)
    }
    k.add(m, disc(0.02, 0.012, 12), k.solid('#2a2d36'), [0, 0, 0.11])
  },

  slime(k) {
    // boron: a blob of slime (borax, a boron compound, turns glue into slime)
    const g = k.hand()
    if (!g) return
    const green = k.solid('#57e05a', { rough: 0.1, glow: 0.12 })
    k.add(g, new THREE.SphereGeometry(0.1, 22, 16), green, [0, 0.08, 0.01], null, [1.15, 0.72, 1.05])
    k.add(g, new THREE.SphereGeometry(0.05, 16, 12), green, [0.03, 0.13, 0.02], null, [1, 0.8, 1])
    const drips = [-0.06, 0.055].map((x, i) => {
      const d = k.group(g, false)
      d.position.set(x, 0.05, 0.05)
      k.add(d, new THREE.CylinderGeometry(0.016, 0.02, 0.1, 10), green, [0, -0.05, 0])
      k.add(d, new THREE.SphereGeometry(0.024, 12, 10), green, [0, -0.1, 0])
      return { d, phase: i * 1.7 }
    })
    k.on((dt, t) => {
      for (const { d, phase } of drips) d.scale.y = 0.75 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.6 + phase))
    })
  },

  pencil(k) {
    // carbon: a pencil (its "lead" is graphite: carbon, like diamond)
    const g = k.hand()
    if (!g) return
    const p = k.group(g, false)
    p.position.set(0, 0.05, 0)
    p.rotation.z = -0.2 * g.userData.side
    k.add(p, new THREE.CylinderGeometry(0.032, 0.032, 0.3, 6), k.solid('#ffc83a', { rough: 0.4 }), [0, 0.05, 0])
    k.add(p, new THREE.CylinderGeometry(0.033, 0.033, 0.04, 16), k.solid('#c9ced8', { metal: 1, rough: 0.3 }), [0, -0.12, 0])
    k.add(p, new THREE.CylinderGeometry(0.031, 0.031, 0.045, 16), k.solid('#ff8fa3', { rough: 0.6 }), [0, -0.162, 0])
    k.add(p, new THREE.ConeGeometry(0.032, 0.075, 6), k.solid('#e8c9a0', { rough: 0.6 }), [0, 0.2375, 0])
    k.add(p, new THREE.ConeGeometry(0.012, 0.028, 6), k.solid('#2e323b', { metal: 0.5, rough: 0.35 }), [0, 0.2655, 0])
  },

  crisps(k) {
    // nitrogen: a bag of crisps (it is puffed up with nitrogen, which keeps the crisps fresh and
    // stops them breaking). A flask of liquid nitrogen was tried first: at card size its white fog
    // read as a mug of something foaming.
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.position.set(0, 0.16, 0.01)
    b.rotation.z = 0.15 * g.userData.side
    k.add(b, pillowGeometry().rotateX(Math.PI / 2), k.solid('#ffcf33', { rough: 0.35 }), null, null, [0.19, 0.27, 0.1])
    const seal = k.solid('#d8dde6', { metal: 0.7, rough: 0.3 })
    for (const y of [-0.135, 0.135]) k.add(b, new THREE.BoxGeometry(0.19, 0.026, 0.014), seal, [0, y, 0])
    k.add(b, disc(0.048, 0.012, 24), k.solid('#e8322e', { rough: 0.35 }), [0, 0.025, 0.046])
    const crisp = k.solid('#f0a83a', { rough: 0.5 })
    for (const [x, y, r] of [[-0.035, -0.06, 0.4], [0.03, -0.065, -0.5], [0, -0.09, 0.1]]) k.add(b, new THREE.SphereGeometry(0.022, 10, 8), crisp, [x, y, 0.04], [0, 0, r], [1.3, 0.8, 0.35])
  },

  fishbowl(k) {
    // oxygen: a fishbowl (fish breathe the oxygen dissolved in the water)
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.position.set(0, 0.15, 0.01)
    k.add(b, new THREE.SphereGeometry(0.125, 26, 18), k.clear('#dff1ff', 0.22))
    k.add(b, new THREE.SphereGeometry(0.114, 24, 16, 0, TAU, 0.85, Math.PI - 0.85), k.clear('#3d9cff', 0.38, 0.12))
    k.add(b, new THREE.TorusGeometry(0.078, 0.008, 8, 28).rotateX(Math.PI / 2), k.clear('#e8f6ff', 0.6), [0, 0.098, 0])
    const fish = k.group(b, false)
    const orange = k.solid('#ff8a1e', { rough: 0.35 })
    k.add(fish, new THREE.SphereGeometry(0.036, 14, 10), orange, [0.045, 0, 0], null, [1.4, 0.95, 0.7])
    k.add(fish, new THREE.ConeGeometry(0.028, 0.045, 8), orange, [-0.012, 0, 0], [0, 0, Math.PI / 2])
    k.add(fish, new THREE.SphereGeometry(0.007, 6, 4), k.solid('#141626'), [0.075, 0.01, 0.017])
    const bubble = k.clear('#ffffff', 0.7, 0.2)
    const bubbles = [0, 0.5].map(phase => ({ m: k.add(b, new THREE.SphereGeometry(0.012, 8, 6), bubble), phase }))
    k.on((dt, t) => {
      fish.rotation.y = -t * 1.1
      fish.position.y = Math.sin(t * 2.3) * 0.012 - 0.015
      for (const q of bubbles) {
        const u = (t * 0.5 + q.phase) % 1
        q.m.position.set(0.02 + Math.sin(t * 3 + q.phase * 9) * 0.006, -0.02 + u * 0.12, 0.03)
      }
    })
  },

  toothbrush(k) {
    // fluorine: a toothbrush with toothpaste (fluoride in toothpaste makes teeth stronger)
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.rotation.z = -0.15 * g.userData.side
    const blue = k.solid('#3fa9f5', { rough: 0.3 })
    k.add(b, new THREE.BoxGeometry(0.038, 0.3, 0.026), blue, [0, 0.09, 0])
    k.add(b, new THREE.BoxGeometry(0.045, 0.09, 0.022), blue, [0, 0.27, 0])
    k.add(b, new THREE.BoxGeometry(0.04, 0.085, 0.04), k.solid('#f4f6fb', { rough: 0.7 }), [0, 0.27, 0.03])
    k.add(b, new THREE.CapsuleGeometry(0.019, 0.07, 4, 10), k.solid('#ffffff', { rough: 0.3 }), [0, 0.27, 0.068])
    k.add(b, new THREE.CapsuleGeometry(0.008, 0.07, 4, 8), k.solid('#3fd1b5', { rough: 0.3 }), [0, 0.27, 0.085])
  },

  neonsign(k) {
    // neon: a glowing neon sign (a tube of neon glows red-orange)
    const g = k.beside(0.55, 0.26)
    if (!g) return
    k.add(g, new THREE.BoxGeometry(0.44, 0.4, 0.02), k.solid('#1b1f2e', { rough: 0.5 }), [0, 0, -0.03])
    const tubeMat = k.glow('#ff5a3c', 2.4)
    k.add(g, tube(heartPoints(0.15), 0.014, 96, true), tubeMat, [0, 0.0, 0])
    const y = g.position.y
    k.on((dt, t) => {
      g.position.y = y + Math.sin(t * 1.5) * 0.03 * k.H
      tubeMat.emissiveIntensity = Math.sin(t * 0.7) > 0.97 ? 0.6 : 2.4
    })
  },

  can(k) {
    // aluminium: a drink can (cans are aluminium, light and easy to recycle)
    const g = k.hand()
    if (!g) return
    const steel = k.solid('#d8dde6', { metal: 1, rough: 0.25 })
    k.add(g, new THREE.CylinderGeometry(0.062, 0.062, 0.19, 24), k.solid('#e8322e', { metal: 0.3, rough: 0.3 }), [0, 0.13, 0])
    k.add(g, new THREE.CylinderGeometry(0.0625, 0.0625, 0.035, 24), k.solid('#f4f6fb', { rough: 0.35 }), [0, 0.13, 0])
    k.add(g, new THREE.CylinderGeometry(0.052, 0.062, 0.022, 24), steel, [0, 0.236, 0])
    k.add(g, new THREE.CylinderGeometry(0.062, 0.054, 0.016, 24), steel, [0, 0.027, 0])
    k.add(g, new THREE.BoxGeometry(0.032, 0.006, 0.02), steel, [0, 0.249, 0.012])
  },

  egg(k) {
    // sulfur: a rotten egg (the stink is hydrogen sulfide, a sulfur compound)
    const g = k.hand()
    if (!g) return
    k.add(g, new THREE.SphereGeometry(0.075, 20, 16), k.solid('#efe4c8', { rough: 0.55 }), [0, 0.1, 0], null, [1, 1.3, 1])
    const stink = k.clear('#a6e04a', 0.85, 0.5)
    const lines = [-0.045, 0, 0.045].map((x, i) => {
      const l = k.group(g, false)
      l.position.set(x, 0.2, 0)
      const pts = Array.from({ length: 9 }, (_, j) => [Math.sin(j * 1.2 + i) * 0.018, j * 0.024, 0])
      k.add(l, tube(pts, 0.009, 24), stink)
      return { l, i }
    })
    k.on((dt, t) => {
      for (const { l, i } of lines) {
        const u = (t * 0.45 + i * 0.33) % 1
        l.position.y = 0.19 + u * 0.06
        l.scale.setScalar(0.6 + 0.5 * Math.sin(u * Math.PI))
        l.rotation.z = Math.sin(t * 2 + i) * 0.15
      }
    })
  },

  swimring(k) {
    // chlorine: a swim ring round its waist (swimming pools are kept clean with chlorine)
    const { H, W, Hb, y0 } = k
    const yf = 0.2
    const tubeR = H * 0.085
    const R = k.radiusAt(yf) * W + tubeR * 0.6
    const g = k.group(k.body, false)
    g.position.y = y0 + yf * Hb
    const n = 8
    for (let i = 0; i < n; i++) {
      k.add(g, new THREE.TorusGeometry(R, tubeR, 10, 6, TAU / n + 0.004).rotateZ((i * TAU) / n).rotateX(Math.PI / 2), k.solid(i % 2 ? '#f4f6fb' : '#ff3b3b', { rough: 0.25 }))
    }
    k.on((dt, t) => (g.rotation.y = t * 0.3))
  },

  pillow(k) {
    // argon: a pillow (argon's name means "lazy": it hardly ever reacts)
    const g = k.under()
    if (!g) return
    const p = k.group(g, false)
    p.position.set(0, -0.085, 0)
    p.rotation.y = 0.35
    const w = 0.85 * k.wr
    const d = 0.62 * k.wr
    // a mid lilac, not white: white would glare in the bloom and read as a slab
    k.add(p, pillowGeometry(), k.solid('#9d86d6', { rough: 0.85 }), null, null, [w, 0.24, d])
    const tassel = k.solid('#f2c14e', { metal: 0.6, rough: 0.3 })
    for (const x of [-1, 1]) for (const z of [-1, 1]) k.add(p, new THREE.SphereGeometry(0.03, 8, 6), tassel, [(x * w) / 2, 0, (z * d) / 2])
  },

  plane(k) {
    // titanium: a toy jet plane (titanium is strong and light: jet engines and planes are built with it)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const p = k.group(g, false)
    p.position.set(0, 0.16, 0.02)
    // nose up and a little outward, its top toward the viewer
    p.rotation.set(0.45, 0, -0.35 * s)
    const white = k.solid('#f4f6fb', { rough: 0.3 })
    const blue = k.solid('#2d6cdf', { rough: 0.3 })
    k.add(p, new THREE.CapsuleGeometry(0.03, 0.22, 6, 12), white)
    k.add(p, new THREE.BoxGeometry(0.34, 0.07, 0.012), blue, [0, 0.01, 0])
    k.add(p, new THREE.BoxGeometry(0.13, 0.04, 0.01), blue, [0, -0.13, 0])
    k.add(p, new THREE.BoxGeometry(0.01, 0.05, 0.06), blue, [0, -0.13, -0.03])
    k.add(p, new THREE.SphereGeometry(0.02, 10, 8), k.solid('#26407a', { rough: 0.1, metal: 0.3 }), [0, 0.08, 0.022], null, [1, 1.6, 1])
  },

  spanner(k) {
    // vanadium: a spanner (strong tools are chrome-vanadium steel, "Cr-V")
    const g = k.hand()
    if (!g) return
    const sp = k.group(g, false)
    sp.position.set(0, 0.08, 0.01)
    sp.rotation.z = -0.3 * g.userData.side
    const steel = k.solid('#d8dde6', { metal: 1, rough: 0.22 })
    k.add(sp, new THREE.BoxGeometry(0.042, 0.27, 0.016), steel)
    k.add(sp, new THREE.BoxGeometry(0.05, 0.11, 0.026), k.solid('#d23a3a', { rough: 0.5 }), [0, -0.04, 0])
    // open jaws at both ends, gaps facing out
    k.add(sp, new THREE.TorusGeometry(0.038, 0.016, 8, 20, TAU * 0.72), steel, [0, 0.17, 0], [0, 0, Math.PI / 2 + TAU * 0.14])
    k.add(sp, new THREE.TorusGeometry(0.032, 0.014, 8, 20, TAU * 0.72), steel, [0, -0.165, 0], [0, 0, -Math.PI / 2 + TAU * 0.14])
  },

  ruby(k) {
    // chromium: a ruby (a pinch of chromium makes rubies red; chromium's name means "colour")
    const g = k.hand()
    if (!g) return
    const gem = k.group(g, false)
    gem.position.set(0, 0.16, 0.02)
    gem.rotation.x = 0.25
    const red = k.solid('#d4103a', { rough: 0.06, metal: 0.15, glow: 0.35 })
    for (const geo of gemGeometry(0.095)) k.add(gem, geo, red)
    const glint = k.add(g, new THREE.SphereGeometry(0.014, 8, 6), k.glow('#ffffff', 2.5), [0.05, 0.21, 0.07])
    k.on((dt, t) => {
      gem.rotation.y = t * 0.7
      glint.scale.setScalar(Math.max(0.01, Math.sin(t * 2.3) ** 16 * 1.3))
    })
  },

  brush(k) {
    // cobalt: a paintbrush dipped in cobalt blue
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.rotation.z = -0.22 * g.userData.side
    k.add(b, new THREE.CylinderGeometry(0.016, 0.022, 0.25, 10), k.solid('#b5352a', { rough: 0.35 }), [0, 0.04, 0])
    k.add(b, new THREE.CylinderGeometry(0.026, 0.022, 0.05, 14), k.solid('#c9ced8', { metal: 1, rough: 0.3 }), [0, 0.19, 0])
    const blue = k.solid('#1f4fd8', { rough: 0.2, glow: 0.15 })
    k.add(b, lathe([[0, 0], [0.028, 0], [0.032, 0.035], [0.02, 0.08], [0, 0.105]], 16), blue, [0, 0.212, 0])
    const drop = k.add(b, teardrop(0.014, 0.034), blue, [0.0, 0.2, 0])
    k.on((dt, t) => {
      const u = (t * 0.5) % 1
      drop.position.set(0.012, 0.2 - u * 0.14, 0.03)
      drop.scale.setScalar(u < 0.85 ? 1 : 0.01)
    })
  },

  coin(k) {
    // nickel: a 1 euro coin (the 1 and 2 euro coins have nickel in them)
    const g = k.hand()
    if (!g) return
    const c = k.group(g, false)
    c.position.set(0, 0.15, 0.01)
    k.add(c, disc(0.1, 0.018, 40), k.solid('#e2b84a', { metal: 1, rough: 0.28 }))
    k.add(c, disc(0.068, 0.022, 36), k.solid('#dfe3ea', { metal: 1, rough: 0.22 }))
    const mark = k.solid('#aab1bd', { metal: 1, rough: 0.3 })
    k.add(c, new THREE.BoxGeometry(0.016, 0.075, 0.026), mark, [0.004, 0, 0])
    k.add(c, new THREE.BoxGeometry(0.03, 0.013, 0.026), mark, [-0.012, 0.028, 0], [0, 0, 0.6])
    k.on((dt, t) => (c.rotation.y = Math.sin(t * 1.2) * 0.35))
  },

  sunscreen(k) {
    // zinc: sun cream (zinc oxide in it blocks the sun's rays)
    const g = k.hand()
    if (!g) return
    const b = k.group(g, false)
    b.position.set(0, 0.012, 0)
    k.add(b, new THREE.CylinderGeometry(0.058, 0.06, 0.2, 22), k.solid('#f4f6fb', { rough: 0.3 }), [0, 0.11, 0], null, [1, 1, 0.62])
    k.add(b, new THREE.CylinderGeometry(0.045, 0.052, 0.05, 18), k.solid('#ff8a1e', { rough: 0.35 }), [0, 0.235, 0], null, [1, 1, 0.7])
    const sun = k.glow('#ffc935', 0.9)
    k.add(b, disc(0.03, 0.006, 20), sun, [0, 0.12, 0.038])
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8
      k.add(b, new THREE.BoxGeometry(0.008, 0.02, 0.005), sun, [Math.cos(a) * 0.045, 0.12 + Math.sin(a) * 0.045, 0.038], [0, 0, a - Math.PI / 2])
    }
  },

  melt(k) {
    // gallium: a cup of tea with a melting spoon (gallium melts at about 30 °C: a gallium spoon
    // droops in warm tea, the old trick of "the disappearing spoon")
    const g = k.hand()
    if (!g) return
    const s = -g.userData.side // the spoon droops inward, away from the electron the hand holds out
    const cup = k.solid('#2d6cdf', { rough: 0.3 })
    k.add(g, lathe([[0, 0.02], [0.06, 0.02], [0.072, 0.04], [0.078, 0.16], [0.07, 0.16], [0.066, 0.06], [0, 0.06]], 26), cup)
    // the handle on the other side, a C opening toward the cup
    k.add(g, new THREE.TorusGeometry(0.035, 0.012, 8, 18, Math.PI * 1.2), cup, [-0.08 * s, 0.1, 0], [0, 0, s > 0 ? Math.PI * 0.4 : -Math.PI * 0.6])
    k.add(g, new THREE.CylinderGeometry(0.068, 0.068, 0.01, 24), k.solid('#9a5a2a', { rough: 0.2 }), [0, 0.145, 0])
    // the spoon: in the tea, then bent over the rim and hanging down outside it, dripping
    const metal = k.solid('#f2f5fa', { metal: 1, rough: 0.08 })
    k.add(g, tube([[0.01 * s, 0.1, 0.01], [0.03 * s, 0.2, 0.01], [0.06 * s, 0.25, 0.01], [0.1 * s, 0.24, 0.01], [0.115 * s, 0.2, 0.01]], 0.013, 24), metal)
    k.add(g, new THREE.SphereGeometry(0.04, 18, 12), metal, [0.118 * s, 0.155, 0.01], null, [0.75, 1.2, 0.42])
    const drops = [0, 0.5].map(phase => ({ m: k.add(g, teardrop(0.014, 0.036), metal, null, [Math.PI, 0, 0]), phase }))
    k.on((dt, t) => {
      for (const d of drops) {
        const v = (t * 0.55 + d.phase) % 1
        d.m.position.set(0.12 * s, 0.11 - v * 0.2, 0.01)
        d.m.scale.setScalar(v < 0.85 ? 1 : 0.01)
      }
    })
  },

  'flag-de'(k) {
    // germanium: named after Germany, homeland of its discoverer
    flag(k, ['#1a1a1a', '#dd0000', '#ffce00'])
  },

  moon(k) {
    // selenium: a crescent Moon (Selene, the Moon; its neighbour tellurium is the Earth)
    const g = k.head()
    const m = k.group(g, false)
    m.position.set(0.32 * k.wr, 0.2, 0)
    k.add(m, extrude(crescentShape(0.12, 0.07), 0.03, 0.008), k.solid('#fff3b0', { rough: 0.5, glow: 0.55 }), null, [0, 0, -0.3])
    k.on((dt, t) => {
      m.position.y = 0.2 + Math.sin(t * 1.4) * 0.02
      m.rotation.y = Math.sin(t * 0.8) * 0.4
    })
  },

  earth(k) {
    // tellurium: the Earth (Tellus)
    planet(k, p => {
      k.add(p, new THREE.SphereGeometry(0.1, 26, 18), k.solid('#2f7de1', { rough: 0.35 }))
      const land = k.solid('#3fbf5f', { rough: 0.6 })
      // four green continents and two white poles, as patches of a slightly bigger sphere
      for (const [ph, pl, th, tl] of [[0.2, 1.0, 0.55, 0.8], [1.9, 0.9, 0.5, 1.2], [3.3, 1.4, 0.45, 0.7], [4.6, 0.6, 1.6, 0.5]]) {
        k.add(p, new THREE.SphereGeometry(0.102, 14, 10, ph, pl, th, tl), land)
      }
      const ice = k.solid('#f4f8ff', { rough: 0.5 })
      k.add(p, new THREE.SphereGeometry(0.103, 16, 6, 0, TAU, 0, 0.42), ice)
      k.add(p, new THREE.SphereGeometry(0.103, 16, 6, 0, TAU, Math.PI - 0.42, 0.42), ice)
    })
  },

  magnifier(k) {
    // krypton: a magnifying glass (krypton means "the hidden one": it hid in the air until 1898)
    const g = k.beside(0.5, 0.2)
    if (!g) return
    const m = k.group(g, false)
    m.rotation.z = -0.25
    k.add(m, disc(0.11, 0.012, 36), k.clear('#d8f0ff', 0.3, 0.15))
    k.add(m, new THREE.TorusGeometry(0.11, 0.015, 8, 40), k.solid('#2a2d36', { rough: 0.35 }))
    k.add(m, new THREE.CylinderGeometry(0.018, 0.024, 0.17, 10), k.solid('#7a4a2a', { rough: 0.45 }), [0, -0.205, 0])
    const y = g.position.y
    k.on((dt, t) => {
      g.position.y = y + Math.sin(t * 1.3) * 0.03 * k.H
      m.rotation.y = Math.sin(t * 0.9) * 0.5
    })
  },

  glowstar(k) {
    // strontium: a glow-in-the-dark star (they glow thanks to strontium aluminate)
    const g = k.hand()
    if (!g) return
    const mat = k.glow('#c6ff7a', 1.1)
    const star = k.add(g, extrude(starShape(0.115, 0.05), 0.03, 0.01), mat, [0, 0.18, 0.02])
    k.on((dt, t) => {
      star.rotation.y = Math.sin(t * 1.1) * 0.5
      mat.emissiveIntensity = 0.9 + Math.sin(t * 2.2) * 0.3
    })
  },

  firework(k) {
    // barium: a green firework bursting over its head (barium gives fireworks their green)
    const g = k.head()
    const burst = k.group(g, false)
    burst.position.set(0, 0.45, 0)
    const n = 16
    const mat = k.glow('#8dff6a', 2.6)
    const geo = new THREE.SphereGeometry(0.03, 8, 6)
    const sparks = Array.from({ length: n }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n
      const r = Math.sqrt(1 - y * y)
      const a = i * 2.399963
      return { m: k.add(burst, geo, mat), d: new THREE.Vector3(Math.cos(a) * r, y * 0.8, Math.sin(a) * r) }
    })
    k.on((dt, t) => {
      const u = (t * 0.55) % 1
      for (const s of sparks) {
        s.m.position.copy(s.d).multiplyScalar(0.03 + u * 0.24)
        s.m.position.y -= u * u * 0.08
        s.m.scale.setScalar(Math.max(0.01, 1.2 * (1 - u)))
      }
    })
  },

  rose(k) {
    // rhodium: a rose (rhodium's name means "rose", for the colour of its salts)
    const g = k.hand()
    if (!g) return
    const r = k.group(g, false)
    r.rotation.z = -0.12 * g.userData.side
    const green = k.solid('#2e8b3e', { rough: 0.5 })
    k.add(r, new THREE.CylinderGeometry(0.01, 0.012, 0.3, 8), green, [0, 0.07, 0])
    k.add(r, new THREE.SphereGeometry(0.04, 10, 8), green, [0.035 * g.userData.side, 0.1, 0], [0, 0, 0.8 * g.userData.side], [1, 0.4, 0.2])
    const pink = k.solid('#e8366e', { rough: 0.35 })
    k.add(r, new THREE.SphereGeometry(0.04, 14, 12), k.solid('#c2185b', { rough: 0.35 }), [0, 0.255, 0], null, [1, 1.15, 1])
    for (let i = 0; i < 5; i++) {
      const a = (i * TAU) / 5
      k.add(r, new THREE.SphereGeometry(0.042, 12, 10), pink, [Math.cos(a) * 0.03, 0.245, Math.sin(a) * 0.03], [0, -a, 0.5], [0.55, 1, 1])
    }
    for (let i = 0; i < 4; i++) {
      const a = (i * TAU) / 4 + 0.4
      k.add(r, new THREE.ConeGeometry(0.012, 0.04, 6), green, [Math.cos(a) * 0.022, 0.215, Math.sin(a) * 0.022], [Math.sin(a) * 1.9, 0, -Math.cos(a) * 1.9])
    }
  },

  car(k) {
    // palladium: a toy car (the palladium in catalytic converters cleans car fumes)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const c = k.group(g, false)
    c.position.set(0.0, 0.07, 0.02)
    c.rotation.y = 0.35 * s
    const red = k.solid('#e8322e', { metal: 0.3, rough: 0.25 })
    k.add(c, new THREE.BoxGeometry(0.27, 0.07, 0.13), red, [0, 0.055, 0])
    k.add(c, new THREE.BoxGeometry(0.14, 0.065, 0.118), red, [-0.02 * s, 0.12, 0])
    k.add(c, new THREE.BoxGeometry(0.145, 0.042, 0.122), k.solid('#2b3550', { rough: 0.1, metal: 0.4 }), [-0.02 * s, 0.123, 0])
    const wheel = disc(0.034, 0.03, 18)
    const tyre = k.solid('#1d1f25', { rough: 0.6 })
    for (const x of [-0.088, 0.088]) for (const z of [-0.066, 0.066]) k.add(c, wheel, tyre, [x, 0.024, z])
    const lamp = k.glow('#fff1a8', 1.4)
    for (const z of [-0.04, 0.04]) k.add(c, new THREE.BoxGeometry(0.008, 0.02, 0.026), lamp, [0.136 * s, 0.065, z])
  },

  medal(k) {
    // silver: an Olympic silver medal on its chest (silver medals are made of silver)
    const { H } = k
    const m = k.group(k.body, false)
    k.onSurface(m, 0.42, 0, H * 0.016)
    // the silver is darker at its rim and star, and the ribbon is a strong blue: it must show on a
    // silver body
    k.add(m, disc(H * 0.085, H * 0.018), k.solid('#f4f7fb', { metal: 1, rough: 0.12 }))
    k.add(m, new THREE.TorusGeometry(H * 0.085, H * 0.011, 8, 36), k.solid('#9aa3b2', { metal: 1, rough: 0.3 }))
    k.add(m, extrude(starShape(H * 0.042, H * 0.019), H * 0.024), k.solid('#8d96a6', { metal: 1, rough: 0.3 }))
    const ribbon = [k.solid('#2457e6', { rough: 0.5 }), k.solid('#e8322e', { rough: 0.5 })]
    for (const side of [-1, 1]) {
      // two cords side by side, blue and red, from the medal round the neck
      for (const [j, off] of [[0, -0.022], [1, 0.022]]) {
        const pts = []
        for (let i = 0; i <= 8; i++) {
          const u = i / 8
          const yf = 0.51 + u * 0.21
          const a = side * (0.05 + u * 0.95) + off * (1 - u * 0.5)
          pts.push(k.surf(yf, a).add(k.normalAt(yf, a).multiplyScalar(H * 0.018)))
        }
        k.add(k.body, tube(pts, H * 0.016, 18), ribbon[j])
      }
    }
  },

  phone(k) {
    // indium: a phone (touchscreens have a see-through layer of indium tin oxide)
    const g = k.hand()
    if (!g) return
    const p = k.group(g, false)
    p.position.set(0, 0.14, 0.02)
    p.rotation.set(-0.15, -0.3 * g.userData.side, 0)
    k.add(p, new THREE.BoxGeometry(0.12, 0.22, 0.018), k.solid('#1d1f25', { rough: 0.25 }))
    k.add(p, new THREE.BoxGeometry(0.104, 0.19, 0.004), k.glow('#4fb6ff', 0.75), [0, 0.0, 0.01])
    const icons = ['#ffd166', '#ff6b6b', '#6be38a', '#c58cff', '#ff9f43', '#ffffff']
    icons.forEach((c, i) => k.add(p, new THREE.BoxGeometry(0.024, 0.024, 0.004), k.glow(c, 1.1), [(i % 2 ? 0.024 : -0.024), 0.055 - Math.floor(i / 2) * 0.045, 0.013]))
  },

  soldier(k) {
    // tin: a toy tin soldier (tin melts easily, so toy soldiers were cast from it)
    const g = k.hand()
    if (!g) return
    const f = k.group(g, false)
    f.position.set(0, 0.03, 0)
    const navy = k.solid('#1f2f6b', { rough: 0.4 })
    const red = k.solid('#d2232a', { rough: 0.35 })
    for (const x of [-0.02, 0.02]) k.add(f, new THREE.CylinderGeometry(0.017, 0.017, 0.1, 8), navy, [x, 0.05, 0])
    k.add(f, new THREE.CylinderGeometry(0.038, 0.042, 0.1, 14), red, [0, 0.14, 0])
    k.add(f, new THREE.CylinderGeometry(0.0425, 0.0425, 0.014, 14), k.solid('#f4f6fb', { rough: 0.4 }), [0, 0.105, 0])
    for (const x of [-0.05, 0.05]) k.add(f, new THREE.CylinderGeometry(0.012, 0.012, 0.085, 8), red, [x, 0.135, 0])
    k.add(f, new THREE.SphereGeometry(0.028, 14, 10), k.solid('#f1c9a5', { rough: 0.5 }), [0, 0.215, 0])
    k.add(f, new THREE.CylinderGeometry(0.03, 0.028, 0.085, 14), k.solid('#16171c', { rough: 0.6 }), [0, 0.28, 0])
    k.add(f, new THREE.SphereGeometry(0.01, 8, 6), k.solid('#f2c14e', { metal: 1, rough: 0.3 }), [0, 0.27, 0.03])
  },

  flask(k) {
    // iodine: a flask of violet vapour (warm iodine turns into a violet vapour; its name means "violet")
    const g = k.hand()
    if (!g) return
    k.add(g, lathe([[0, 0], [0.095, 0], [0.1, 0.012], [0.045, 0.14], [0.032, 0.15], [0.032, 0.22], [0.038, 0.226], [0.03, 0.226]], 28), k.clear('#eef6ff', 0.25))
    k.add(g, lathe([[0, 0.006], [0.088, 0.006], [0.092, 0.016], [0.05, 0.12], [0, 0.12]], 24), k.clear('#8f3dff', 0.6, 0.45))
    const dark = k.solid('#2a2438', { metal: 0.6, rough: 0.3 })
    for (const [x, z] of [[-0.03, 0.01], [0.02, -0.02], [0.035, 0.03]]) k.add(g, new THREE.BoxGeometry(0.024, 0.016, 0.02), dark, [x, 0.015, z], [0.3, x * 20, 0])
    const vapour = k.clear('#a86bff', 0.5, 0.35)
    const wisps = [0, 0.33, 0.66].map(phase => ({ m: k.add(g, new THREE.SphereGeometry(0.03, 12, 10), vapour), phase }))
    k.on((dt, t) => {
      for (const w of wisps) {
        const u = (t * 0.4 + w.phase) % 1
        w.m.position.set(Math.sin(t * 2 + w.phase * 7) * 0.02, 0.22 + u * 0.13, 0)
        w.m.scale.setScalar(Math.max(0.01, (0.6 + u * 0.9) * (1 - Math.max(0, u - 0.75) * 4)))
      }
    })
  },

  probe(k) {
    // xenon: a space probe going round it, pushed by a blue xenon ion engine
    if (!k.loose) return
    const { H, W, Hb, y0 } = k
    const orbit = k.group(k.body, false)
    orbit.position.y = y0 + Hb * 0.44
    orbit.rotation.x = 0.12
    // it flies toward -z of the orbit as the orbit turns; its engine glows behind it (+z)
    const p = k.group(orbit, false)
    p.scale.setScalar(H * 2.1)
    p.position.set(k.radiusAt(0.44) * W + 0.34 * H, 0, 0)
    k.add(p, new THREE.BoxGeometry(0.075, 0.075, 0.095), k.solid('#e2b84a', { metal: 1, rough: 0.4 }))
    const panel = k.solid('#2a4fa8', { metal: 0.3, rough: 0.3 })
    for (const x of [-1, 1]) k.add(p, new THREE.BoxGeometry(0.16, 0.006, 0.06), panel, [x * 0.12, 0, 0])
    k.add(p, new THREE.SphereGeometry(0.035, 14, 8, 0, TAU, 0, Math.PI / 2), k.solid('#f4f6fb', { rough: 0.3 }), [0, 0.04, 0])
    k.add(p, new THREE.ConeGeometry(0.026, 0.13, 12), k.glow('#6fb4ff', 2.2), [0, 0, 0.11], [Math.PI / 2, 0, 0])
    k.on((dt, t) => (orbit.rotation.y = t * 0.7))
  },

  clock(k) {
    // caesium: an alarm clock (the second is defined by caesium atoms, in atomic clocks)
    const g = k.hand()
    if (!g) return
    const c = k.group(g, false)
    c.position.set(0, 0.17, 0.01)
    const gold = k.solid('#e2b84a', { metal: 1, rough: 0.25 })
    k.add(c, disc(0.1, 0.05, 32), gold)
    k.add(c, disc(0.084, 0.054, 32), k.solid('#f8f6ef', { rough: 0.5 }))
    const ink = k.solid('#1d1f25', { rough: 0.5 })
    for (let i = 0; i < 12; i += 3) {
      const a = (i / 12) * TAU
      k.add(c, new THREE.BoxGeometry(0.01, 0.018, 0.004), ink, [Math.sin(a) * 0.068, Math.cos(a) * 0.068, 0.028], [0, 0, -a])
    }
    const hour = k.group(c, false)
    hour.position.z = 0.029
    k.add(hour, new THREE.BoxGeometry(0.01, 0.045, 0.004), ink, [0, 0.02, 0])
    const minute = k.group(c, false)
    minute.position.z = 0.031
    k.add(minute, new THREE.BoxGeometry(0.007, 0.065, 0.004), ink, [0, 0.03, 0])
    for (const x of [-1, 1]) {
      k.add(c, new THREE.SphereGeometry(0.04, 16, 8, 0, TAU, 0, Math.PI / 2), gold, [x * 0.06, 0.088, 0], [0, 0, -x * 0.5])
      k.add(c, new THREE.SphereGeometry(0.014, 8, 6), gold, [x * 0.06, -0.09, 0])
    }
    k.on((dt, t) => {
      minute.rotation.z = -t * 1.5
      hour.rotation.z = -t * 0.125
    })
  },

  camera(k) {
    // lanthanum: a camera (good camera lenses are lanthanum glass, which bends light strongly)
    const g = k.hand()
    if (!g) return
    const c = k.group(g, false)
    c.position.set(0, 0.12, 0.02)
    c.rotation.y = -0.25 * g.userData.side
    k.add(c, new THREE.BoxGeometry(0.21, 0.12, 0.075), k.solid('#23262e', { rough: 0.4 }))
    const steel = k.solid('#c9ced8', { metal: 1, rough: 0.28 })
    k.add(c, new THREE.BoxGeometry(0.21, 0.026, 0.076), steel, [0, 0.07, 0])
    k.add(c, new THREE.BoxGeometry(0.06, 0.035, 0.05), k.solid('#23262e', { rough: 0.4 }), [0, 0.095, 0])
    k.add(c, disc(0.05, 0.075, 28), k.solid('#3a3f4b', { metal: 0.6, rough: 0.3 }), [0, -0.005, 0.07])
    k.add(c, disc(0.037, 0.006, 24), k.solid('#2a4a9a', { metal: 0.3, rough: 0.04, glow: 0.15 }), [0, -0.005, 0.108])
    k.add(c, new THREE.CylinderGeometry(0.012, 0.012, 0.014, 10), k.solid('#e8322e', { rough: 0.3 }), [0.07, 0.09, 0])
    const flash = k.glow('#ffffff', 0.4)
    k.add(c, new THREE.BoxGeometry(0.036, 0.018, 0.006), flash, [-0.065, 0.035, 0.04])
    k.on((dt, t) => (flash.emissiveIntensity = (t % 5) < 0.12 ? 4 : 0.4))
  },

  sparks(k) {
    // cerium: a lighter's flint striking sparks (the flint is cerium and iron)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const r = k.group(g, false)
    r.rotation.z = -0.45 * s
    k.add(r, new THREE.CylinderGeometry(0.024, 0.024, 0.08, 10), k.solid('#23262e', { rough: 0.5 }), [0, 0.02, 0])
    k.add(r, new THREE.CylinderGeometry(0.016, 0.016, 0.17, 10), k.solid('#6a707c', { metal: 0.8, rough: 0.35 }), [0, 0.14, 0])
    const mat = k.glow('#ffc040', 2.8)
    const geo = new THREE.SphereGeometry(0.016, 6, 5)
    const sparks = Array.from({ length: 16 }, (_, i) => ({ m: k.add(r, geo, mat), phase: i / 16, a: i * 2.4 }))
    k.on((dt, t) => {
      for (const p of sparks) {
        const u = (t * 0.8 + p.phase) % 1
        const sp = 0.2 + 0.1 * Math.sin(p.a * 3)
        p.m.position.set(Math.cos(p.a) * sp * u * 0.7 - s * u * 0.04, 0.23 + u * 0.14 - u * u * 0.3, Math.sin(p.a) * sp * u * 0.7)
        p.m.scale.setScalar(Math.max(0.01, 1.4 * (1 - u)))
      }
    })
  },

  headphones(k) {
    // neodymium: headphones (their tiny strong magnets are neodymium)
    const { H } = k
    const band = []
    const side = (s, from, to, n) => {
      for (let i = 0; i <= n; i++) {
        const yf = from + ((to - from) * i) / n
        band.push(k.surf(yf, (s * Math.PI) / 2).add(k.normalAt(yf, (s * Math.PI) / 2).multiplyScalar(H * 0.045)))
      }
    }
    side(-1, 0.74, 0.99, 8)
    side(1, 0.99, 0.74, 8)
    band.splice(9, 1)
    k.add(k.body, tube(band, H * 0.022, 40), k.solid('#22252e', { rough: 0.3 }))
    const red = k.solid('#e8322e', { metal: 0.3, rough: 0.3 })
    for (const s of [-1, 1]) {
      const cup = k.group(k.body, false)
      k.onSurface(cup, 0.72, (s * Math.PI) / 2, H * 0.03)
      k.add(cup, disc(H * 0.085, H * 0.055, 26), red)
      k.add(cup, disc(H * 0.06, H * 0.06, 22), k.solid('#22252e', { rough: 0.4 }), [0, 0, H * 0.008])
    }
  },

  torch(k) {
    // promethium: a burning torch (it is named after Prometheus, who stole fire from the gods)
    const g = k.hand()
    if (!g) return
    k.add(g, new THREE.CylinderGeometry(0.02, 0.016, 0.26, 10), k.solid('#8a5a2b', { rough: 0.6 }), [0, 0.06, 0])
    k.add(g, new THREE.CylinderGeometry(0.055, 0.03, 0.065, 16), k.solid('#d4a14a', { metal: 1, rough: 0.3 }), [0, 0.22, 0])
    const fire = k.add(g, teardrop(0.055, 0.17), k.glow('#ff8a2a', 2.2), [0, 0.235, 0])
    const core = k.add(g, teardrop(0.03, 0.09), k.glow('#fff1a8', 2.6), [0, 0.24, 0.01])
    k.on((dt, t) => {
      const f = 1 + Math.sin(t * 15) * 0.09 + Math.sin(t * 9.1) * 0.06
      fire.scale.set(1 / f, f, 1 / f)
      core.scale.set(1, f, 1)
    })
  },

  banknote(k) {
    // europium: a euro banknote (its marks glow under ultraviolet light; the red glow is europium)
    const g = k.hand({ size: 1.3 })
    if (!g) return
    const s = g.userData.side
    const n = k.group(g, false)
    n.position.set(0.05 * s, 0.13, 0.02)
    n.rotation.z = 0.25 * s
    k.add(n, new THREE.BoxGeometry(0.3, 0.15, 0.006), k.solid('#8dbbea', { rough: 0.7 }))
    k.add(n, new THREE.BoxGeometry(0.08, 0.11, 0.008), k.solid('#3f6fb5', { rough: 0.6 }), [-0.08 * s, 0, 0])
    const star = k.solid('#ffd84a', { rough: 0.4, glow: 0.3 })
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12
      k.add(n, new THREE.SphereGeometry(0.0065, 6, 4), star, [0.07 * s + Math.cos(a) * 0.035, Math.sin(a) * 0.035, 0.004])
    }
    const uv = k.glow('#ff4a3a', 1.6)
    k.add(n, new THREE.BoxGeometry(0.05, 0.026, 0.008), uv, [0.0, -0.045, 0])
    k.on((dt, t) => {
      n.rotation.y = Math.sin(t * 1.3) * 0.25
      uv.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.5
    })
  },

  dumbbell(k) {
    // osmium: a dumbbell (osmium is the densest element: a litre of it weighs 22.6 kg)
    const g = k.hand({ prefer: 'low' })
    if (!g) return
    // carried in a lower hand, the bar through the fist, held high enough to clear its electron, short
    // enough that the inner weight stays off the body
    const d = k.group(g, false)
    d.position.set(0, 0.1, 0)
    k.add(d, new THREE.CylinderGeometry(0.014, 0.014, 0.3, 10), k.solid('#9aa3b5', { metal: 1, rough: 0.25 }), null, [0, 0, Math.PI / 2])
    const plate = new THREE.CylinderGeometry(0.075, 0.075, 0.045, 24).rotateZ(Math.PI / 2)
    const black = k.solid('#2a2d36', { metal: 0.4, rough: 0.35 })
    for (const x of [-0.12, 0.12]) k.add(d, plate, black, [x, 0, 0])
    for (const x of [-0.09, 0.09]) k.add(d, new THREE.CylinderGeometry(0.026, 0.026, 0.02, 14).rotateZ(Math.PI / 2), k.solid('#c9ced8', { metal: 1, rough: 0.25 }), [x, 0, 0])
  },

  asteroid(k) {
    // iridium: an asteroid with a fiery tail going round its head (the iridium layer of the dinosaurs' end)
    const g = k.head()
    const orbit = k.group(g, false)
    orbit.position.y = 0.2
    orbit.rotation.x = 0.15
    const a = k.group(orbit, false)
    a.position.set(0.55 * k.wr, 0, 0)
    a.scale.setScalar(1.45)
    const rock = k.add(a, rockGeometry(0.06), k.solid('#8a7f72', { rough: 0.9 }))
    k.add(a, new THREE.SphereGeometry(0.075, 14, 10), k.clear('#ff7a2a', 0.3, 0.9))
    const tail = k.glow('#ff8a2e', 2.2)
    for (const [z, r] of [[0.07, 0.04], [0.12, 0.03], [0.16, 0.021], [0.195, 0.013]]) k.add(a, new THREE.SphereGeometry(r, 10, 8), tail, [0, 0, z])
    k.on((dt, t) => {
      orbit.rotation.y = t * 1.1
      rock.rotation.set(t * 1.7, t * 1.3, 0)
    })
  },

  ring(k) {
    // platinum: a ring with a diamond (platinum is a precious white metal for rings and jewels)
    const g = k.hand()
    if (!g) return
    const r = k.group(g, false)
    r.position.set(0, 0.11, 0.01)
    const pt = k.solid('#eceef2', { metal: 1, rough: 0.14 })
    k.add(r, new THREE.TorusGeometry(0.075, 0.02, 12, 40), pt)
    k.add(r, new THREE.CylinderGeometry(0.02, 0.03, 0.03, 8), pt, [0, 0.098, 0])
    const gem = k.group(r, false)
    gem.position.y = 0.155
    const ice = k.solid('#dff2ff', { metal: 0.2, rough: 0.02, glow: 0.35 })
    for (const geo of gemGeometry(0.062)) k.add(gem, geo, ice)
    const glint = k.add(r, new THREE.SphereGeometry(0.014, 8, 6), k.glow('#ffffff', 2.5), [0.035, 0.19, 0.045])
    k.on((dt, t) => {
      r.rotation.y = Math.sin(t * 0.9) * 0.4
      glint.scale.setScalar(Math.max(0.01, Math.sin(t * 2.1 + 1) ** 16 * 1.3))
    })
  },

  thermometer(k) {
    // mercury: a thermometer (old thermometers held mercury, the metal that is liquid)
    const g = k.hand()
    if (!g) return
    // a wall thermometer: a dark board (the silver column shows against it), white marks, the bulb
    const th = k.group(g, false)
    th.position.set(0, 0.02, 0.0)
    k.add(th, new THREE.BoxGeometry(0.08, 0.34, 0.018), k.solid('#1f2f6b', { rough: 0.4 }), [0, 0.15, 0])
    k.add(th, new THREE.CylinderGeometry(0.04, 0.04, 0.018, 20).rotateX(Math.PI / 2), k.solid('#1f2f6b', { rough: 0.4 }), [0, 0.32, 0])
    k.add(th, new THREE.CylinderGeometry(0.014, 0.014, 0.27, 10), k.clear('#e8f4ff', 0.5), [0, 0.175, 0.016])
    const silver = k.solid('#f2f5fa', { metal: 1, rough: 0.1 })
    k.add(th, new THREE.SphereGeometry(0.03, 16, 12), silver, [0, 0.04, 0.016])
    const col = k.add(th, new THREE.CylinderGeometry(0.0085, 0.0085, 1, 8), silver, [0, 0.04, 0.016])
    const ink = k.solid('#f4f6fb', { rough: 0.5 })
    for (let i = 0; i < 7; i++) k.add(th, new THREE.BoxGeometry(i % 2 ? 0.014 : 0.024, 0.005, 0.004), ink, [-0.026, 0.08 + i * 0.035, 0.011])
    k.on((dt, t) => {
      const h = 0.14 + Math.sin(t * 0.6) * 0.05
      col.scale.y = h
      col.position.y = 0.04 + h / 2
    })
  },

  fishing(k) {
    // lead: a fishing rod with a lead sinker (in Portuguese a sinker is a "chumbada", from chumbo)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const rod = k.group(g, false)
    rod.rotation.z = -0.22 * s
    k.add(rod, new THREE.CylinderGeometry(0.006, 0.012, 0.66, 8), k.solid('#2b2f3a', { rough: 0.35 }), [0, 0.27, 0])
    k.add(rod, new THREE.CylinderGeometry(0.019, 0.019, 0.11, 10), k.solid('#c9a46a', { rough: 0.6 }), [0, 0.0, 0])
    k.add(rod, new THREE.CylinderGeometry(0.03, 0.03, 0.018, 14).rotateZ(Math.PI / 2), k.solid('#c9ced8', { metal: 1, rough: 0.3 }), [0, 0.08, 0.03])
    // the tip, in the hand's upright frame: the line hangs straight down from it
    const tip = new THREE.Vector3(0, 0.6, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), rod.rotation.z)
    const hang = k.group(g, false)
    hang.position.copy(tip)
    const drop = 0.3
    k.add(hang, new THREE.CylinderGeometry(0.0022, 0.0022, drop, 4), k.line('#e8eef7'), [0, -drop / 2, 0])
    k.add(hang, new THREE.SphereGeometry(0.024, 12, 6, 0, TAU, 0, Math.PI / 2), k.solid('#ff3b3b', { rough: 0.3 }), [0, -0.17, 0])
    k.add(hang, new THREE.SphereGeometry(0.024, 12, 6, 0, TAU, Math.PI / 2, Math.PI / 2), k.solid('#f4f6fb', { rough: 0.3 }), [0, -0.17, 0])
    k.add(hang, teardrop(0.034, 0.085), k.solid('#8e96a5', { metal: 0.85, rough: 0.35 }), [0, -drop - 0.07, 0])
    k.add(hang, new THREE.TorusGeometry(0.016, 0.0035, 6, 14, Math.PI * 1.3), k.solid('#d8dde6', { metal: 1, rough: 0.3 }), [0.008, -drop - 0.085, 0], [0, 0, Math.PI * 0.85])
    k.on((dt, t) => (hang.rotation.z = Math.sin(t * 1.7) * 0.1))
  },

  crystal(k) {
    // bismuth: a rainbow crystal in little steps
    const g = k.hand()
    if (!g) return
    const c = k.group(g, false)
    c.position.set(0, 0.05, 0.01)
    c.rotation.set(0.3, Math.PI / 4, 0)
    const colours = ['#ff6fd2', '#ffc94d', '#4fd0ff', '#6ff0a0', '#b07cff']
    colours.forEach((col, i) => {
      const size = 0.21 - i * 0.042
      k.add(c, new THREE.BoxGeometry(size, 0.034, size), k.solid(col, { metal: 0.8, rough: 0.2 }), [0, 0.017 + i * 0.034, 0])
    })
    k.on((dt, t) => (c.rotation.y = Math.PI / 4 + Math.sin(t * 0.7) * 0.35))
  },

  'flag-pl'(k) {
    // polonium: named by Marie Curie after Poland, her homeland
    flag(k, ['#f4f6fb', '#dc143c'])
  },

  warning(k) {
    // radon: a radiation warning sign (radon is a radioactive gas that seeps into cellars)
    const g = k.beside(0.5, 0.2)
    if (!g) return
    const sign = k.group(g, false)
    const yellow = k.solid('#ffd21f', { rough: 0.4, glow: 0.12 })
    const black = k.solid('#1a1a1a', { rough: 0.5 })
    k.add(sign, disc(0.13, 0.016, 36), yellow)
    k.add(sign, new THREE.TorusGeometry(0.13, 0.009, 6, 40), black)
    for (const deg of [90, 210, 330]) {
      k.add(sign, new THREE.CylinderGeometry(0.108, 0.108, 0.02, 12, 1, false, (deg * Math.PI) / 180, Math.PI / 3).rotateX(Math.PI / 2), black)
    }
    k.add(sign, disc(0.032, 0.024, 20), yellow)
    k.add(sign, disc(0.021, 0.028, 16), black)
    const y = g.position.y
    k.on((dt, t) => {
      g.position.y = y + Math.sin(t * 1.2) * 0.025 * k.H
      sign.rotation.y = Math.sin(t * 0.8) * 0.5
    })
  },

  'flag-fr'(k) {
    // francium: named after France, where Marguerite Perey found it
    flag(k, ['#0055a4', '#f4f6fb', '#ef4135'], { vertical: true })
  },

  watch(k) {
    // radium: a wristwatch with glowing numbers (radium paint, before people learnt it was harmful)
    const g = k.wrist()
    if (!g) return
    const armR = 0.05
    k.add(g, new THREE.TorusGeometry(armR * 1.12, 0.018, 8, 22).rotateX(Math.PI / 2), k.solid('#3a2a20', { rough: 0.6 }))
    // an oversized face (it has to read on a card), its numbers and hands glowing green
    const face = k.group(g, false)
    face.position.set(0, 0, armR + 0.022)
    k.add(face, disc(0.12, 0.034, 30), k.solid('#d4a14a', { metal: 1, rough: 0.3 }))
    k.add(face, disc(0.102, 0.036, 28), k.solid('#151a2c', { rough: 0.5 }))
    const lume = k.glow('#9dff6a', 2.6)
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12
      k.add(face, new THREE.BoxGeometry(i % 3 ? 0.016 : 0.024, i % 3 ? 0.016 : 0.034, 0.006), lume, [Math.sin(a) * 0.08, Math.cos(a) * 0.08, 0.019], [0, 0, -a])
    }
    const hour = k.group(face, false)
    hour.position.z = 0.021
    k.add(hour, new THREE.BoxGeometry(0.016, 0.05, 0.004), lume, [0, 0.022, 0])
    const minute = k.group(face, false)
    minute.position.z = 0.023
    k.add(minute, new THREE.BoxGeometry(0.011, 0.072, 0.004), lume, [0, 0.032, 0])
    k.on((dt, t) => {
      minute.rotation.z = -t * 0.8
      hour.rotation.z = -t * 0.07
    })
  },

  hammer(k) {
    // thorium: a hammer (thorium is named after Thor, the Norse god of thunder)
    const g = k.hand()
    if (!g) return
    const h = k.group(g, false)
    h.rotation.z = -0.15 * g.userData.side
    k.add(h, new THREE.CylinderGeometry(0.02, 0.02, 0.28, 10), k.solid('#6b4226', { rough: 0.6 }), [0, 0.07, 0])
    k.add(h, new THREE.SphereGeometry(0.026, 10, 8), k.solid('#6b4226', { rough: 0.6 }), [0, -0.075, 0])
    const steel = k.solid('#aab3c2', { metal: 1, rough: 0.3 })
    k.add(h, new THREE.BoxGeometry(0.2, 0.11, 0.11), steel, [0, 0.25, 0])
    for (const x of [-0.105, 0.105]) k.add(h, new THREE.BoxGeometry(0.02, 0.125, 0.125), steel, [x, 0.25, 0])
  },

  uranus(k) {
    // uranium: the planet Uranus, which it is named after
    planet(k, p => {
      k.add(p, new THREE.SphereGeometry(0.085, 24, 16), k.solid('#9fe3ef', { rough: 0.45 }))
      k.add(p, new THREE.TorusGeometry(0.135, 0.0055, 6, 56), k.solid('#d6f5fa', { rough: 0.4, glow: 0.2 }), null, [0.25, 1.35, 0])
    })
  },

  neptune(k) {
    // neptunium: the planet Neptune, which comes after Uranus
    planet(k, p => {
      k.add(p, new THREE.SphereGeometry(0.085, 24, 16), k.solid('#3557d6', { rough: 0.4 }))
      k.add(p, new THREE.SphereGeometry(0.087, 24, 6, 0, TAU, 1.25, 0.32), k.solid('#2a46b0', { rough: 0.45 }))
      k.add(p, new THREE.SphereGeometry(0.024, 12, 8), k.solid('#1b2f80', { rough: 0.5 }), [0.022, -0.012, 0.079], null, [1.4, 0.8, 0.5])
      k.add(p, new THREE.SphereGeometry(0.016, 10, 6), k.solid('#eef2ff', { rough: 0.5 }), [-0.03, 0.035, 0.074], null, [1.8, 0.5, 0.5])
    })
  },

  pluto(k) {
    // plutonium: Pluto with its heart (plutonium powers space probes like New Horizons)
    planet(k, p => {
      k.add(p, new THREE.SphereGeometry(0.08, 24, 16), k.solid('#b98a64', { rough: 0.75 }))
      // its pale heart (Tombaugh Regio, the heart New Horizons saw), bent onto the sphere
      const heart = extrude(heartShape(0.04), 0.012)
      const pos = heart.attributes.position
      for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) - (pos.getX(i) ** 2 + pos.getY(i) ** 2) / (2 * 0.08))
      heart.computeVertexNormals()
      k.add(p, heart, k.solid('#fbf1e2', { rough: 0.6 }), [0, -0.006, 0.075])
    })
  },

  smoke(k) {
    // americium: a smoke alarm (many hold a speck of americium)
    const g = k.hand()
    if (!g) return
    const d = k.group(g, false)
    d.position.set(0, 0.15, 0.01)
    const white = k.solid('#f4f6fb', { rough: 0.35 })
    k.add(d, disc(0.105, 0.036, 36), white)
    k.add(d, new THREE.SphereGeometry(0.062, 24, 10, 0, TAU, 0, Math.PI / 2).rotateX(Math.PI / 2), white, [0, 0, 0.016])
    const vent = k.solid('#b9c0cc', { rough: 0.5 })
    k.add(d, new THREE.TorusGeometry(0.083, 0.006, 6, 36), vent, [0, 0, 0.018])
    k.add(d, new THREE.TorusGeometry(0.042, 0.005, 6, 28), vent, [0, 0, 0.068])
    const led = k.add(d, new THREE.SphereGeometry(0.016, 10, 8), k.glow('#ff3b3b', 2.6), [0.07, 0.05, 0.024])
    // a puff of smoke rising past it: what it is there to smell
    const smoke = k.clear('#8a8f9c', 0.45)
    const puffs = [0, 0.33, 0.66].map(phase => ({ m: k.add(g, new THREE.SphereGeometry(0.04, 12, 10), smoke), phase }))
    k.on((dt, t) => {
      led.scale.setScalar((t % 2) < 0.25 ? 1.25 : 0.6)
      for (const p of puffs) {
        const u = (t * 0.3 + p.phase) % 1
        p.m.position.set(-0.11 * g.userData.side + Math.sin(t + p.phase * 6) * 0.015, 0.06 + u * 0.28, 0.02)
        p.m.scale.setScalar(Math.max(0.01, (0.6 + u * 0.9) * (1 - Math.max(0, u - 0.75) * 4)))
      }
    })
  },

  hair(k) {
    // einsteinium: Einstein's wild white hair, bushy at the sides
    const { H } = k
    const white = k.solid('#f2f2f0', { rough: 0.9 })
    const tuft = new THREE.SphereGeometry(H * 0.06, 10, 8)
    const up = new THREE.Vector3(0, 1, 0)
    // rings of tufts round the sides and back (yf, angles from the front, how much they lean up)
    const rings = [
      [0.68, [1.2, 1.5, 1.8, 2.1, 2.4, 2.7], 0.15],
      [0.8, [1.05, 1.35, 1.65, 1.95, 2.25, 2.55, 2.8], 0.4],
      [0.91, [0.95, 1.35, 1.75, 2.15, 2.55], 0.8],
    ]
    let i = 0
    for (const [yf, angles, lean] of rings) {
      for (const a0 of angles) {
        for (const side of [-1, 1]) {
          const a = side * a0
          // clear of the face (front) and of the third arm rising from the back of the head
          if (Math.abs(Math.abs(a) - Math.PI) < 0.38) continue
          const nrm = k.normalAt(yf, a)
          const p = k.surf(yf, a).add(nrm.clone().multiplyScalar(H * 0.045))
          const dir = nrm.clone().add(new THREE.Vector3(0, lean + ((i * 0.61) % 1) * 0.35, 0)).normalize()
          const m = k.add(k.body, tuft, white, [p.x, p.y, p.z], null, [0.62, 1.55, 0.62])
          m.quaternion.setFromUnitVectors(up, dir)
          i++
        }
      }
    }
    // and a few standing up on top
    for (const [x, z] of [[-0.05, 0.02], [0.05, -0.03], [0, -0.07]]) {
      const m = k.add(k.body, tuft, white, [x * H, k.top + H * 0.02, z * H], null, [0.6, 1.4, 0.6])
      m.quaternion.setFromUnitVectors(up, new THREE.Vector3(x * 4, 1, z * 4).normalize())
    }
  },

  table(k) {
    // mendelevium: a little periodic table (it is named after Dmitri Mendeleev, who made it)
    const g = k.hand()
    if (!g) return
    const t = k.group(g, false)
    t.position.set(0, 0.18, 0.02)
    t.rotation.y = -0.2 * g.userData.side
    const u = 0.017
    const blocks = [
      [0, 1, 0, 7, '#ff6b6b'], [1, 2, 1, 7, '#ff6b6b'], [2, 12, 3, 7, '#5aa9ff'], [12, 18, 1, 7, '#ffd166'],
      [17, 18, 0, 1, '#ffd166'], [2.5, 16.5, 7.5, 9.5, '#6be38a'],
    ]
    for (const [x0, x1, r0, r1, c] of blocks) {
      const w = (x1 - x0) * u
      const h = (r1 - r0) * u
      k.add(t, new THREE.BoxGeometry(w - 0.003, h - 0.003, 0.02), k.solid(c, { rough: 0.45 }), [(x0 + x1) / 2 * u - 9 * u, -((r0 + r1) / 2) * u + 4.75 * u, 0])
    }
  },

  'flag-jp'(k) {
    // nihonium: named after Japan (Nihon), the first element found in Asia
    flag(k, ['#f4f6fb'], { sun: '#bc002d' })
  },

  goggles(k) {
    // praseodymium: glassblowers' goggles (didymium glass, praseodymium with neodymium, blocks the
    // dazzling yellow glow of hot glass)
    const g = k.hand()
    if (!g) return
    const o = k.group(g, false)
    o.position.set(0, 0.15, 0.02)
    o.rotation.set(0.1, -0.2 * g.userData.side, 0)
    const frame = k.solid('#2a2d36', { rough: 0.4 })
    const lens = k.solid('#86c45e', { metal: 0.3, rough: 0.05, glow: 0.2 })
    for (const x of [-0.06, 0.06]) {
      k.add(o, disc(0.05, 0.014, 24), lens, [x, 0, 0])
      k.add(o, new THREE.TorusGeometry(0.052, 0.011, 8, 28), frame, [x, 0, 0])
    }
    k.add(o, new THREE.BoxGeometry(0.03, 0.012, 0.012), frame, [0, 0.01, 0])
    k.add(o, new THREE.TorusGeometry(0.113, 0.009, 6, 28, Math.PI), k.solid('#6b4226', { rough: 0.6 }), null, [-Math.PI / 2, 0, 0])
  },

  turbine(k) {
    // dysprosium: a wind turbine (dysprosium keeps the magnets in wind turbines and electric cars
    // strong when they get hot)
    const g = k.hand()
    if (!g) return
    const white = k.solid('#f2f5fa', { rough: 0.35 })
    k.add(g, new THREE.CylinderGeometry(0.012, 0.022, 0.36, 10), white, [0, 0.17, 0])
    k.add(g, new THREE.BoxGeometry(0.045, 0.034, 0.075), white, [0, 0.36, 0])
    const rotor = k.group(g, false)
    rotor.position.set(0, 0.36, 0.045)
    k.add(rotor, new THREE.SphereGeometry(0.02, 10, 8), white)
    for (let i = 0; i < 3; i++) {
      const b = k.group(rotor, false)
      b.rotation.z = (i * TAU) / 3
      k.add(b, new THREE.BoxGeometry(0.026, 0.13, 0.008), white, [0, 0.075, 0], [0, 0.3, 0])
    }
    k.on((dt, t) => (rotor.rotation.z = -t * 2.2))
  },

  'flag-se'(k) {
    // ytterbium: named after Ytterby, a Swedish village that gave its name to four elements
    flag(k, ['#006aa7'], { cross: '#fecc02' })
  },

  eiffel(k) {
    // lutetium: the Eiffel Tower (lutetium is named after Lutetia, the Roman name of Paris)
    const g = k.hand()
    if (!g) return
    const iron = k.solid('#8a6a4a', { metal: 0.5, rough: 0.45 })
    const t = k.group(g, false)
    t.position.y = 0.03
    // four legs leaning in and rising into one spire, two platforms, an arch between the front legs
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2
      const pts = [[0.078, 0], [0.047, 0.09], [0.022, 0.2], [0.008, 0.3]].map(([r, y]) => [Math.cos(a) * r, y, Math.sin(a) * r])
      k.add(t, tube(pts, 0.009, 12), iron)
    }
    k.add(t, new THREE.BoxGeometry(0.1, 0.012, 0.1), iron, [0, 0.085, 0])
    k.add(t, new THREE.BoxGeometry(0.052, 0.01, 0.052), iron, [0, 0.19, 0])
    k.add(t, new THREE.CylinderGeometry(0.004, 0.012, 0.08, 6), iron, [0, 0.335, 0])
    k.add(t, new THREE.TorusGeometry(0.045, 0.006, 6, 16, Math.PI), iron, [0, 0.0, 0.055])
  },

  rover(k) {
    // curium: a Mars rover (a speck of curium on Mars rovers tells what the rocks there are made of)
    const g = k.hand()
    if (!g) return
    const s = g.userData.side
    const r = k.group(g, false)
    r.position.set(0, 0.07, 0.01)
    r.rotation.y = 0.5 * s
    const white = k.solid('#eceff4', { rough: 0.4 })
    const dark = k.solid('#2a2d36', { rough: 0.5 })
    k.add(r, new THREE.BoxGeometry(0.2, 0.06, 0.12), white, [0, 0.06, 0])
    k.add(r, new THREE.BoxGeometry(0.21, 0.012, 0.13), k.solid('#d4a14a', { metal: 1, rough: 0.35 }), [0, 0.095, 0])
    const wheel = new THREE.CylinderGeometry(0.026, 0.026, 0.024, 14).rotateX(Math.PI / 2)
    for (const x of [-0.075, 0, 0.075]) for (const z of [-0.075, 0.075]) k.add(r, wheel, dark, [x, 0.022, z])
    // the mast and its camera head (two lenses, like eyes), and a dish
    k.add(r, new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), white, [0.06, 0.16, 0.03])
    k.add(r, new THREE.BoxGeometry(0.065, 0.032, 0.035), white, [0.06, 0.23, 0.03])
    for (const x of [0.045, 0.075]) k.add(r, disc(0.009, 0.006, 10), dark, [x, 0.232, 0.049])
    k.add(r, new THREE.SphereGeometry(0.03, 14, 8, 0, TAU, 0, Math.PI / 2), white, [-0.06, 0.115, 0], [0.5, 0, 0])
  },

  nobel(k) {
    // nobelium: a Nobel Prize's gold medal (it is named after Alfred Nobel)
    const g = k.hand()
    if (!g) return
    const m = k.group(g, false)
    m.position.set(0, 0.17, 0.02)
    k.add(m, disc(0.09, 0.02, 36), k.solid('#f2c14e', { metal: 1, rough: 0.2 }))
    k.add(m, new THREE.TorusGeometry(0.09, 0.01, 8, 36), k.solid('#c99a2e', { metal: 1, rough: 0.3 }))
    // Nobel's head in relief, and the loop of ribbon it hangs from
    k.add(m, new THREE.SphereGeometry(0.042, 16, 12), k.solid('#d9a93a', { metal: 1, rough: 0.3 }), [0, 0.0, 0.008], null, [0.78, 1, 0.25])
    k.add(m, new THREE.TorusGeometry(0.05, 0.012, 6, 20, Math.PI * 1.3), k.solid('#2457e6', { rough: 0.5 }), [0, 0.1, 0], [0, 0, -Math.PI * 0.15])
  },

  sun(k) {
    // copernicium: the Sun with the Earth going round it (Copernicus said the Earth goes round the Sun)
    planet(k, p => {
      k.add(p, new THREE.SphereGeometry(0.08, 22, 16), k.glow('#ffcf3a', 1.6))
      const orbit = k.group(p, false)
      const earth = k.add(orbit, new THREE.SphereGeometry(0.028, 12, 10), k.solid('#2f7de1', { rough: 0.4 }), [0.15, 0, 0])
      k.add(earth, new THREE.SphereGeometry(0.0285, 10, 8, 0.4, 1.4, 0.6, 1.2), k.solid('#3fbf5f', { rough: 0.6 }))
      k.on((dt, t) => (orbit.rotation.y = t * 1.6))
    })
  },
}

/** Every kind of signature there is (look.js SIGNATURE uses these names). */
export const SIGNATURE_KINDS = Object.keys(BUILD)

/** The ones worn on the head or the body, which stay when the Atomling has no arms (the lab). */
export const WORN = new Set(['balloon', 'leaf', 'coil', 'bulb', 'crown', 'swimring', 'moon', 'firework', 'medal', 'headphones', 'asteroid', 'hair'])

/** Build an element's signature on its body; returns the update functions of the parts that move. */
export function buildSignature(kind, rig) {
  const build = BUILD[kind]
  if (!build) return []
  const k = kitFor(kind, rig)
  build(k)
  return k.updates
}
