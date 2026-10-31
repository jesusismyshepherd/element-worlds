// A stage for picture rooms (docs/knowledge/picture-rooms.md): a railway line through flat fields at night,
// as iron's `rails` picture shows it. A starry navy sky, low dark hills far off, tracks running straight to
// both horizons on their ballast beds (timber sleepers, flat-bottom rails of the real shape: a long-welded
// line, and an old jointed one with a fishplate every 18 m), a line of telegraph poles with their wires,
// floodlight masts lighting a work site, far signals glowing red and green. The scene places its own
// things; `cuts` leave a stretch of a rail out so the scene can lay its own pieces there (a weld).
// `railTrain()` makes a train to run along a track (the scene moves it; `axles` for the joints' clacks).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random } from '../../wings/noble/kit.js'

export const GAUGE = 1.435
// from a track's centre line to the middle of each rail's head (the heads' inner edges are the gauge apart)
export const RAIL_HALF = GAUGE / 2 + 0.036
export const BALLAST_TOP = 0.26
export const RAIL_BASE = 0.315
export const RAIL_H = 0.172
export const RAIL_TOP = RAIL_BASE + RAIL_H
export const JOINT = 18 // an old rail's length (m)
export const SLEEPERS = 0.65 // sleeper spacing (m), centre to centre

/** A flat-bottom rail's cross-section (about UIC 60: 172 mm tall, a 150 mm foot, a 72 mm head), its foot's
 *  bottom at y = 0; `k` scales it about its middle (a weld's collar is a fatter copy). */
export function railShape(k = 1, { headOnly = false, noHead = false } = {}) {
  const s = new THREE.Shape()
  const P = headOnly
    ? [[0.036, 0.122], [0.036, 0.166], [0.031, 0.172], [-0.031, 0.172], [-0.036, 0.166], [-0.036, 0.122]]
    : noHead
      ? [[-0.075, 0], [0.075, 0], [0.075, 0.011], [0.013, 0.03], [0.0085, 0.042], [0.0085, 0.124], [-0.0085, 0.124], [-0.0085, 0.042], [-0.013, 0.03], [-0.075, 0.011]]
      : [
          [-0.075, 0], [0.075, 0], [0.075, 0.011], [0.013, 0.03], [0.0085, 0.042], [0.0085, 0.118], [0.03, 0.126], [0.036, 0.134],
          [0.036, 0.166], [0.031, 0.172], [-0.031, 0.172], [-0.036, 0.166], [-0.036, 0.134], [-0.03, 0.126], [-0.0085, 0.118],
          [-0.0085, 0.042], [-0.013, 0.03], [-0.075, 0.011],
        ]
  const cy = 0.086
  P.forEach(([x, y], i) => (i ? s.lineTo(x * k, cy + (y - cy) * k) : s.moveTo(x * k, cy + (y - cy) * k)))
  s.closePath()
  return s
}

/** A rail `length` metres long along +z from z = 0 (its foot at y = 0). */
export function railGeometry(length, k = 1, opts) {
  return new THREE.ExtrudeGeometry(railShape(k, opts), { depth: length, bevelEnabled: false, curveSegments: 1 })
}

/** The materials of the line, shared by the stage and the scene's own pieces. */
export function railMaterials() {
  return {
    rail: new THREE.MeshStandardMaterial({ color: '#6c717b', metalness: 0.7, roughness: 0.42 }),
    oldRail: new THREE.MeshStandardMaterial({ color: '#5e4c42', metalness: 0.35, roughness: 0.78 }),
    // the running band on top of the head, polished by the wheels: it catches the light as in the picture
    // (not too shiny: under a floodlight a mirror-like band bloomed into white dashes)
    band: new THREE.MeshStandardMaterial({ color: '#9aa4b4', emissive: '#6d7a94', emissiveIntensity: 0.22, metalness: 0.35, roughness: 0.6 }),
    sleeper: new THREE.MeshStandardMaterial({ color: '#4a3a30', roughness: 0.92 }),
    plate: new THREE.MeshStandardMaterial({ color: '#2c2e33', metalness: 0.5, roughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2e3c', metalness: 0.3, roughness: 0.7 }),
  }
}

/** Gravel: grey stones of many sizes (a repeating texture, about 2 m across). */
function gravelTexture(seed = 3, base = '#3c404c') {
  return canvasTex(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = base
      g.fillRect(0, 0, w, h)
      const rnd = random(seed)
      for (let i = 0; i < 2600; i++) {
        const v = 40 + rnd() * 70
        const x = rnd() * w
        const y = rnd() * h
        const r = 1 + rnd() * 3.2
        g.fillStyle = `rgba(${v + 6},${v + 6},${v + 16},${0.5 + rnd() * 0.5})`
        g.beginPath()
        g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * 3, 0, Math.PI * 2)
        g.fill()
        // the same stone again across the edge, so the tile repeats without a seam
        if (x < 4 || y < 4) {
          g.beginPath()
          g.ellipse(x + (x < 4 ? w : 0), y + (y < 4 ? h : 0), r, r * 0.8, 0, 0, Math.PI * 2)
          g.fill()
        }
      }
    },
    { repeat: true },
  )
}

/** Fields at night: dark grass in long furrowed strips (a repeating texture, 16 m across). */
function fieldTexture() {
  return canvasTex(
    512,
    512,
    (g, w, h) => {
      g.fillStyle = '#16202a'
      g.fillRect(0, 0, w, h)
      const rnd = random(17)
      // furrows across
      for (let y = 0; y < h; y += 16) {
        g.fillStyle = `rgba(10,16,22,${0.35 + rnd() * 0.2})`
        g.fillRect(0, y, w, 5)
      }
      for (let i = 0; i < 9000; i++) {
        const v = rnd()
        g.fillStyle = v < 0.5 ? `rgba(26,44,46,${0.35 + rnd() * 0.4})` : `rgba(44,62,66,${0.2 + rnd() * 0.3})`
        g.fillRect(rnd() * w, rnd() * h, 1.5 + rnd() * 2, 3 + rnd() * 5)
      }
    },
    { repeat: true },
  )
}

/**
 * tracks: [{ x, jointed }] straight lines along z (centre x); length: how far each runs either way (m);
 * cuts: [{ track, side (-1 the rail on the -x side, 1 the other), z0, z1 }] stretches of rail left out for
 * the scene's own pieces; poles: x of the telegraph line (null for none); floods: [{ x, z, h, aim: [x, y, z],
 * intensity }] floodlight masts; signals: [{ x, z, color }] far lamps; sky: colours for nightSky.
 */
export function railwayStage({ light = false, pixelRatio = 1, tracks = [{ x: 0 }], length = 300, cuts = [], poles = -12, floods = [], signals = [], sky = {} } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const mats = railMaterials()
  // (the same length on a phone: a train running out to the horizon must not leave its rails)
  const L = length
  const o = new THREE.Object3D()

  // the sky: navy, a lighter glow low down, many stars (the picture's)
  const stars = nightSky({ radius: 700, stars: light ? 1100 : 2400, top: '#070d26', mid: '#16245a', horizon: '#2d3a7a', pixelRatio, ...sky })
  group.add(stars)

  // the fields, flat to the hills
  const fieldTex = fieldTexture()
  fieldTex.repeat.set(1800 / 16, 1800 / 16)
  disposers.push(() => fieldTex.dispose())
  const field = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800), new THREE.MeshStandardMaterial({ map: fieldTex, roughness: 1 }))
  field.rotation.x = -Math.PI / 2
  group.add(field)

  // low hills all round, far off (dark against the sky's glow, as in the picture)
  {
    const R0 = 330
    const SEG = light ? 96 : 160
    const rows = [0, 0.15, 0.4, 0.7, 1]
    const pos = []
    const idx = []
    const col = []
    const c0 = new THREE.Color('#121733')
    const c1 = new THREE.Color('#1a2046')
    const hash = n => {
      const s = Math.sin(n * 127.1) * 43758.5453
      return s - Math.floor(s)
    }
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j <= SEG; j++) {
        const a = (j / SEG) * Math.PI * 2
        const h = 9 + 9 * Math.sin(a * 3 + 0.7) + 6 * Math.sin(a * 7 + 2.1) + 7 * hash(Math.round(a * 9))
        const r = R0 + rows[i] * 140
        const lift = Math.sin(rows[i] * Math.PI) * h + (rows[i] > 0.5 ? h * 0.4 * (rows[i] - 0.5) : 0)
        pos.push(Math.cos(a) * r, lift - 1, Math.sin(a) * r)
        const c = c0.clone().lerp(c1, rows[i])
        col.push(c.r, c.g, c.b)
      }
    }
    const W = SEG + 1
    for (let i = 0; i < rows.length - 1; i++) {
      for (let j = 0; j < SEG; j++) {
        const a = i * W + j
        const b = (i + 1) * W + j
        idx.push(a, a + 1, b, b, a + 1, b + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const hills = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide }))
    group.add(hills)
  }

  // the lines: ballast beds, sleepers, rails
  const gravel = gravelTexture(5)
  disposers.push(() => gravel.dispose())
  const ballastMat = new THREE.MeshStandardMaterial({ map: gravel, color: '#9aa0ae', roughness: 1 })
  const sleeperGeo = new THREE.BoxGeometry(2.6, 0.15, 0.25)
  const plateGeo = new THREE.BoxGeometry(0.34, 0.016, 0.19)
  const joints = []
  for (const [ti, tr] of tracks.entries()) {
    // the bed: a long trapezoid of gravel (custom, so its texture runs in metres along and across)
    {
      const xs = [-2.25, -1.75, 1.75, 2.25]
      const ys = [0, BALLAST_TOP, BALLAST_TOP, 0]
      const us = [0, 0.55, 4.05, 4.6]
      const pos = []
      const uv = []
      for (const z of [-L, L]) for (let i = 0; i < 4; i++) {
        pos.push(tr.x + xs[i], ys[i], z)
        uv.push(us[i] / 2, z / 2)
      }
      const idx = []
      for (let i = 0; i < 3; i++) idx.push(i, i + 4, i + 1, i + 1, i + 4, i + 5)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
      geo.setIndex(idx)
      geo.computeVertexNormals()
      group.add(new THREE.Mesh(geo, ballastMat))
    }
    // timber sleepers, each a little different, with a baseplate under each rail; laid from z = 0, so the
    // cribs between them fall at whole multiples of SLEEPERS (a weld sits in a crib, never on a sleeper)
    const K0 = Math.ceil(-L / SLEEPERS)
    const N = Math.floor(L / SLEEPERS) - K0
    const sleepers = new THREE.InstancedMesh(sleeperGeo, mats.sleeper, N)
    const plates = new THREE.InstancedMesh(plateGeo, mats.plate, N * 2)
    const rnd = random(31 + ti)
    const tint = new THREE.Color()
    for (let i = 0; i < N; i++) {
      const z = (K0 + i + 0.5) * SLEEPERS
      o.position.set(tr.x + (rnd() - 0.5) * 0.04, BALLAST_TOP + 0.03, z)
      o.rotation.set(0, (rnd() - 0.5) * 0.02, 0)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      sleepers.setMatrixAt(i, o.matrix)
      tint.setScalar(0.8 + rnd() * 0.35)
      sleepers.setColorAt(i, tint)
      for (const s of [-1, 1]) {
        o.position.set(tr.x + s * RAIL_HALF, RAIL_BASE - 0.008, z)
        o.rotation.set(0, 0, 0)
        o.updateMatrix()
        plates.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), o.matrix)
      }
    }
    group.add(sleepers, plates)
    // the rails: long-welded ones run unbroken (but for the cuts); old ones in 18 m lengths
    for (const s of [-1, 1]) {
      const x = tr.x + s * RAIL_HALF
      const gaps = cuts.filter(c => c.track === ti && c.side === s).sort((a, b) => a.z0 - b.z0)
      const runs = []
      let from = -L
      for (const c of gaps) {
        if (c.z0 > from) runs.push([from, c.z0])
        from = Math.max(from, c.z1)
      }
      if (from < L) runs.push([from, L])
      const mat = tr.jointed ? mats.oldRail : mats.rail
      for (const [z0, z1] of runs) {
        if (tr.jointed) {
          // lengths with a few millimetres' gap at each joint
          for (let z = z0; z < z1 - 0.5; z += JOINT) {
            const len = Math.min(JOINT, z1 - z) - 0.008
            const m = new THREE.Mesh(railGeometry(len), mat)
            m.position.set(x, RAIL_BASE, z)
            group.add(m)
          }
        } else {
          const m = new THREE.Mesh(railGeometry(z1 - z0), mat)
          m.position.set(x, RAIL_BASE, z0)
          group.add(m)
        }
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.004, z1 - z0), mats.band)
        band.position.set(x, RAIL_TOP + 0.001, (z0 + z1) / 2)
        group.add(band)
      }
    }
    // an old line's joints: two fishplates bolted across each one
    if (tr.jointed) {
      const zs = []
      for (let z = -L + JOINT; z < L; z += JOINT) zs.push(z)
      joints.push({ track: ti, zs })
      const fish = new THREE.InstancedMesh(new THREE.BoxGeometry(0.022, 0.07, 0.6), mats.plate, zs.length * 4)
      const bolts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.03, 6).rotateZ(Math.PI / 2), mats.plate, zs.length * 16)
      let f = 0
      let b = 0
      for (const z of zs) {
        for (const s of [-1, 1]) {
          for (const side of [-1, 1]) {
            o.position.set(tr.x + s * RAIL_HALF + side * 0.02, RAIL_BASE + 0.08, z)
            o.rotation.set(0, 0, 0)
            o.updateMatrix()
            fish.setMatrixAt(f++, o.matrix)
            for (const dz of [-0.22, -0.08, 0.08, 0.22]) {
              o.position.set(tr.x + s * RAIL_HALF + side * 0.04, RAIL_BASE + 0.08, z + dz)
              o.updateMatrix()
              bolts.setMatrixAt(b++, o.matrix)
            }
          }
        }
      }
      group.add(fish, bolts)
    }
  }

  // the telegraph line beside the tracks: poles every 45 m, two wires sagging between them
  if (poles != null) {
    const SPAN = 45
    const zs = []
    for (let z = -L + 10; z < L; z += SPAN) zs.push(z)
    const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.14, 7.2, 7).translate(0, 3.6, 0), mats.dark, zs.length)
    const arm = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 0.1, 0.1), mats.dark, zs.length)
    zs.forEach((z, i) => {
      o.position.set(poles, 0, z)
      o.rotation.set(0, 0, 0)
      o.updateMatrix()
      pole.setMatrixAt(i, o.matrix)
      o.position.set(poles, 6.7, z)
      o.updateMatrix()
      arm.setMatrixAt(i, o.matrix)
    })
    group.add(pole, arm)
    const pts = []
    for (const dx of [-0.6, 0.6]) {
      for (let i = 0; i + 1 < zs.length; i++) {
        const K = 8
        for (let k = 0; k < K; k++) {
          const t0 = k / K
          const t1 = (k + 1) / K
          const y = t => 6.78 - 0.9 * 4 * t * (1 - t)
          pts.push(poles + dx, y(t0), zs[i] + SPAN * t0, poles + dx, y(t1), zs[i] + SPAN * t1)
        }
      }
    }
    const wg = new THREE.BufferGeometry()
    wg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    group.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: '#3a4260', transparent: true, opacity: 0.8 })))
  }

  // floodlight masts: a lamp head on a pole, a spotlight, a faint beam through the night air
  const beams = []
  for (const f of floods) {
    const h = f.h ?? 7
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, h, 8).translate(0, h / 2, 0), mats.dark)
    mast.position.set(f.x, 0, f.z)
    group.add(mast)
    const aim = new THREE.Vector3(...(f.aim ?? [0, 0, 0]))
    const head = new THREE.Group()
    head.position.set(f.x, h + 0.15, f.z)
    head.lookAt(aim)
    const box = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.36, 0.22, 2, 0.04), mats.dark)
    head.add(box)
    const lampMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#eef4ff', emissiveIntensity: 2.6 })
    for (const dx of [-0.32, 0, 0.32]) {
      const lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.24), lampMat)
      lamp.position.set(dx, 0, 0.115)
      head.add(lamp)
    }
    group.add(head)
    const spot = new THREE.SpotLight('#e6eeff', f.intensity ?? (light ? 60 : 70), f.reach ?? 34, f.angle ?? 0.62, 0.65, 1.3)
    spot.position.copy(head.position)
    spot.target.position.copy(aim)
    group.add(spot, spot.target)
    // the beam: an open cone fading away from the lamp
    const dir = aim.clone().sub(head.position)
    const len = Math.min(dir.length(), 14)
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uK: { value: f.beam ?? 0.12 } },
      vertexShader: /* glsl */ `
        varying float vT; varying vec3 vN; varying vec3 vV;
        void main() {
          vT = uv.y;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uK;
        varying float vT; varying vec3 vN; varying vec3 vV;
        void main() {
          float side = clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0);
          float a = uK * vT * vT * side;
          gl_FragColor = vec4(vec3(0.85, 0.9, 1.0) * a, a);
        }`,
    })
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.35, len * Math.tan((f.angle ?? 0.62) * 0.75), len, 24, 1, true).translate(0, -len / 2, 0), beamMat)
    cone.position.copy(head.position)
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize())
    cone.raycast = () => {}
    group.add(cone)
    beams.push(cone)
  }

  // far signals, glowing low over the tracks
  const glowTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.6)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  disposers.push(() => glowTex.dispose())
  for (const s of signals) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 6).translate(0, 1.6, 0), mats.dark)
    post.position.set(s.x, 0, s.z)
    const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(s.color).multiplyScalar(2.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    lamp.position.set(s.x, 3.1, s.z)
    lamp.scale.setScalar(1.6)
    lamp.raycast = () => {}
    group.add(post, lamp)
  }

  // the night's light: the sky's blue from above, the fields' dark below, a pale moon
  group.add(new THREE.HemisphereLight('#5a6cb8', '#10141f', 0.85))
  const moon = new THREE.DirectionalLight('#b9c4ff', 0.45)
  moon.position.set(-20, 30, 12)
  group.add(moon, moon.target)

  return {
    group,
    mats,
    ballastMat,
    joints,
    glowTex,
    gravelTexture,
    env: {
      background: new THREE.Color('#0a1030'),
      fog: new THREE.Fog('#1a2450', 60, 520),
      exposure: 1.0,
      envIntensity: 0.12,
      bloom: { strength: 0.7, radius: 0.55, threshold: 0.74 },
      fov: 60,
    },
    update(t) {
      stars.userData.update?.(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}

/** The side of a carriage: a pale body, a band of windows lit warm from inside, doors, a stripe in `color`
 *  (both the colour map and the glow map, `lit` for the windows). */
function carSide(color, lit) {
  return canvasTex(1024, 160, (g, w, h) => {
    g.fillStyle = lit ? '#000000' : '#d8dde6'
    g.fillRect(0, 0, w, h)
    if (!lit) {
      g.fillStyle = '#2b3140'
      g.fillRect(0, 0, w, 10)
      g.fillStyle = color
      g.fillRect(0, h - 40, w, 18)
      g.fillStyle = '#3a4152'
      g.fillRect(0, h - 22, w, 22)
    }
    // windows, between two pairs of doors
    for (let i = 0; i < 9; i++) {
      const x = 130 + i * 88
      if (i === 0 || i === 8) continue
      g.fillStyle = lit ? '#ffe2a0' : '#2a2f3c'
      g.fillRect(x, 36, 70, 50)
    }
    for (const x of [70, w - 120]) {
      g.fillStyle = lit ? '#000000' : '#9aa2b2'
      g.fillRect(x, 26, 52, h - 50)
      g.fillStyle = lit ? '#c8aa70' : '#2a2f3c'
      g.fillRect(x + 8, 34, 15, 40)
      g.fillRect(x + 29, 34, 15, 40)
    }
  })
}

/** A train of `cars` carriages, its front at z = 0 and its body running back along +z (it travels toward
 *  -z). `axles`: each axle's distance behind the front (m), for the joints. update(dt, speed) turns the
 *  wheels; setBump(k) jolts the bodies a few millimetres (the joints). */
export function railTrain({ cars = 3, color = '#5aa9ff', light = false } = {}) {
  const group = new THREE.Group()
  const CAR = 20
  const GAP = 0.8
  const W = 2.85
  const BODY0 = RAIL_TOP + 0.95
  const BODY1 = RAIL_TOP + 3.95
  const sideMap = carSide(color, false)
  const sideGlow = carSide(color, true)
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: sideMap, emissive: '#ffffff', emissiveMap: sideGlow, emissiveIntensity: 1.1, roughness: 0.5, metalness: 0.2 })
  const plainMat = new THREE.MeshStandardMaterial({ color: '#c9ced8', roughness: 0.55, metalness: 0.2 })
  const roofMat = new THREE.MeshStandardMaterial({ color: '#4a5060', roughness: 0.7 })
  const under = new THREE.MeshStandardMaterial({ color: '#20232b', roughness: 0.8, metalness: 0.3 })
  const wheelMat = new THREE.MeshStandardMaterial({ color: '#3a3d44', roughness: 0.5, metalness: 0.7 })
  const frontMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#141a28', roughness: 0.15, metalness: 0.6 })
  const headMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6dc', emissiveIntensity: 3 })
  const tailMat = new THREE.MeshStandardMaterial({ color: '#ff3020', emissive: '#ff2010', emissiveIntensity: 2.4 })
  const bodies = []
  const wheels = []
  const axles = []
  const wheelGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.12, light ? 12 : 18).rotateZ(Math.PI / 2)
  for (let c = 0; c < cars; c++) {
    const z0 = c * (CAR + GAP)
    const body = new THREE.Group()
    body.position.z = z0 + CAR / 2
    // sides carry the windows; front, back, top and bottom plain
    const box = new THREE.Mesh(new THREE.BoxGeometry(W, BODY1 - BODY0, CAR), [bodyMat, bodyMat, plainMat, under, plainMat, plainMat])
    box.position.y = (BODY0 + BODY1) / 2
    // (a box's side faces map u along z and v up: the side texture runs along the carriage as it should)
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(W / 2, W / 2, CAR - 0.2, 16, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2), roofMat)
    roof.scale.y = 0.2
    roof.position.y = BODY1
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(W - 0.3, 0.5, CAR - 7), under)
    skirt.position.y = BODY0 - 0.2
    body.add(box, roof, skirt)
    group.add(body)
    bodies.push(body)
    // the front car's nose: a sloped windscreen, headlamps; the last car's tail lamps
    if (c === 0) {
      const nose = new THREE.Mesh(new THREE.BoxGeometry(W, BODY1 - BODY0, 0.9), frontMat)
      nose.position.set(0, (BODY0 + BODY1) / 2, -CAR / 2 - 0.45)
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, 1.0), glassMat)
      screen.position.set(0, BODY1 - 0.9, -CAR / 2 - 0.91)
      screen.rotation.y = Math.PI
      body.add(nose, screen)
      for (const x of [-0.95, 0.95]) {
        const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.13, 12), headMat)
        lamp.position.set(x, BODY0 + 0.35, -CAR / 2 - 0.91)
        lamp.rotation.y = Math.PI
        body.add(lamp)
      }
    }
    if (c === cars - 1) {
      for (const x of [-0.95, 0.95]) {
        const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), tailMat)
        lamp.position.set(x, BODY0 + 0.35, CAR / 2 + 0.01)
        body.add(lamp)
      }
    }
    // two bogies, two axles each
    for (const bz of [3, CAR - 3]) {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(W - 0.6, 0.35, 3.2), under)
      frame.position.set(0, RAIL_TOP + 0.5, z0 + bz)
      group.add(frame)
      for (const az of [-1.25, 1.25]) {
        axles.push(z0 + bz + az)
        for (const s of [-1, 1]) {
          const wh = new THREE.Mesh(wheelGeo, wheelMat)
          wh.position.set(s * RAIL_HALF, RAIL_TOP + 0.46, z0 + bz + az)
          group.add(wh)
          wheels.push(wh)
        }
      }
    }
  }
  // the headlamps' glow in front and their light on the line
  const beam = new THREE.SpotLight('#fff2d8', light ? 0 : 40, 60, 0.4, 0.7, 1.4)
  beam.position.set(0, BODY0 + 0.4, -CAR / 2 - 1)
  beam.target.position.set(0, 0, -40)
  bodies[0].add(beam, beam.target)
  const length = cars * CAR + (cars - 1) * GAP
  let roll = 0
  return {
    group,
    length,
    axles,
    width: W,
    update(dt, speed) {
      roll += (speed * dt) / 0.46
      for (const w of wheels) w.rotation.x = -roll
    },
    setBump(k) {
      bodies.forEach((b, i) => (b.position.y = -0.012 * k * (i % 2 ? 0.7 : 1)))
    },
    dispose() {
      sideMap.dispose()
      sideGlow.dispose()
    },
  }
}
