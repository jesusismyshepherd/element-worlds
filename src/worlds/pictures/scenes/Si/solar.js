// Silicon's picture "How does sunlight become electricity?" as a room (docs/knowledge/picture-rooms.md):
// the picture's grassy hilltop in the evening, the sun low over the hills. Three things to do, all shared in
// a room (src/net/shared.js):
// - the panel and the sun: move the sun across the sky with the slider in the panel (E, or a tap on the
//   sun, opens it) and tap the cloud to pass it over the sun; the light on the panel (the cosine of the
//   angle between the sun and its face, and the air a low sun crosses) sets the meter, the electrons
//   running in the wires and the bulb;
// - inside a solar cell: one cell cut open and made giant, inside the picture's magnifier ring: tap one of
//   four lamps (infrared, red, green, blue) to fire its photon; above the band gap each frees one electron,
//   which the junction pushes up, round the wire through a little bulb and back to fill a hole; blue's
//   extra energy glows as heat; infrared passes through;
// - Vanguard 1: tap the rocket or its pad to launch it; it rises to a globe overhead, goes round on its
//   real orbit's shape (Kepler's equation) and beeps; tap it up there to hear its radio. Its real size
//   stands by the pad, beside a grapefruit.
// Each step is chosen by touching its thing (the user's rule, docs/knowledge/adding-a-wing.md "Look and
// feel"); E opens the station's panel, whose slider and buttons do the same.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, num, hdr, standingScreen } from '../../../wings/noble/kit.js'
import { meadowStage } from '../../stages/meadow.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { SOLAR_WORDS } from './solar.words.js'

export const WORDS = SOLAR_WORDS

const TAU = Math.PI * 2
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const UP = V(0, 1, 0)

// ---- the sun and the panel's light ----

// the panel faces F (and up); the sun's path is a great circle from sunrise (G, behind the visitor's left)
// over the panel's noon direction (58° up) to sunset (-G, ahead and to the right: the left of the screen
// is the Atomling's speech, and a sun there was hidden under it)
const F = V(0.9, 0, 0.44).normalize()
const G = V(-F.z, 0, F.x)
const NOON = THREE.MathUtils.degToRad(58)
const M = F.clone().multiplyScalar(Math.cos(NOON)).add(V(0, Math.sin(NOON), 0))
const TILT = THREE.MathUtils.degToRad(40)
const N = F.clone().multiplyScalar(Math.sin(TILT)).add(V(0, Math.cos(TILT), 0))
const EFF = 0.21
// where the sun starts (u: 0 sunrise, 0.5 noon, 1 sunset, 1.5 midnight): low in the evening, as the picture has it
const START = 0.875

const wrap2 = u => ((u % 2) + 2) % 2
/** The direction toward the sun at time u (0 to 2 for a day and a night). */
const sunDirAt = (u, out = V(0, 0, 0)) => out.copy(G).multiplyScalar(Math.cos(Math.PI * u)).addScaledVector(M, Math.sin(Math.PI * u))
/** The share of the light a sun at height sinE keeps after crossing the air (Meinel's air-mass rule, 1 overhead). */
const air = sinE => (sinE <= 0.005 ? 0 : Math.pow(0.7, Math.pow(1 / sinE, 0.678) - 1))
/** Sunlight on the panel, W/m²: 1000 face-on overhead, times the cosine, the air, a cloud's fifth. */
const lightOn = (dir, cloud) => 1000 * Math.max(0, dir.dot(N)) * air(dir.y) * (1 - 0.8 * cloud)
/** The time of day u as a clock (6:00 at sunrise, 18:00 at sunset), to five minutes. */
const clock = u => {
  const m = Math.round(((6 + 12 * wrap2(u)) * 60) / 5) * 5
  const h = Math.floor(m / 60) % 24
  return `${h}:${String(m % 60).padStart(2, '0')}`
}

// ---- inside the cell ----

const ORDER = ['red', 'green', 'blue', 'ir']
const EV = { ir: 0.95, red: 1.91, green: 2.34, blue: 2.76 }
const GAP = 1.12
const HEX = { red: '#ff4436', green: '#40e070', blue: '#4b86ff', ir: '#a0204a' }
const CYCLES = { ir: 1.6, red: 3.1, green: 3.8, blue: 4.5 }
// how deep each colour is caught (the cell's y; not to scale); each colour's lamp, in the spectrum's order
// (long waves to short), and where under it the n-th photon lands (the same on every screen)
const ABS = { red: 0.74, green: 1.06, blue: 1.4 }
const LX = { ir: -0.96, red: -0.32, green: 0.32, blue: 0.96 }
const XO = [-0.1, 0.12, 0.02, -0.14, 0.08, -0.04]

/** A wavy line on a see-through canvas (a photon, a ray of light). */
const waveTex = cycles =>
  canvasTex(64, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.strokeStyle = '#ffffff'
    g.lineWidth = 7
    g.lineCap = 'round'
    g.beginPath()
    for (let y = 0; y <= h; y += 4) {
      const x = w / 2 + Math.sin((y / h) * cycles * TAU) * w * 0.3
      if (y === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
  })

/** Vanguard 1 at `s` times its real size: an aluminium ball 16.5 cm across, six aerials 30 cm long, six
 *  small solar cells on its body. */
function vanguardModel(s, mats) {
  const g = new THREE.Group()
  const r = 0.0825 * s
  g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mats.alu))
  const turn = new THREE.Euler(0.5, 0.3, 0.2)
  const rod = new THREE.CylinderGeometry(Math.max(0.0025, 0.0022 * s), Math.max(0.0025, 0.0022 * s), 0.3 * s, 5)
  for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
    const dir = V(...d).applyEuler(turn)
    const a = new THREE.Mesh(rod, mats.alu)
    a.position.copy(dir).multiplyScalar(r + 0.15 * s)
    a.quaternion.setFromUnitVectors(UP, dir)
    g.add(a)
  }
  const cellGeo = new THREE.BoxGeometry(0.024 * s, 0.024 * s, 0.004 * s)
  for (const d of [[1, 1, 1], [-1, -1, 1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, -1]]) {
    const dir = V(...d).normalize().applyEuler(turn)
    const c = new THREE.Mesh(cellGeo, mats.cellBlue)
    c.position.copy(dir).multiplyScalar(r * 0.98)
    c.lookAt(c.position.clone().multiplyScalar(2))
    g.add(c)
  }
  return g
}

/** The Earth's map (equirectangular): the real coastlines (Natural Earth, as oxygen's globe has them),
 *  the great deserts, the ice. */
function earthTexture() {
  return canvasTex(1024, 512, (g, w, h) => {
    const X = lon => ((lon + 180) / 360) * w
    const Y = lat => ((90 - lat) / 180) * h
    g.fillStyle = '#1d5596'
    g.fillRect(0, 0, w, h)
    const land = new Path2D()
    for (const ring of LAND) {
      let lon = ring[0]
      let lat = ring[1]
      land.moveTo(X(lon / 5), Y(lat / 5))
      for (let i = 2; i < ring.length; i += 2) {
        lon += ring[i]
        lat += ring[i + 1]
        land.lineTo(X(lon / 5), Y(lat / 5))
      }
      land.closePath()
    }
    g.fillStyle = '#4c8a3a'
    g.fill(land, 'evenodd')
    g.save()
    g.clip(land, 'evenodd')
    // soft-edged, as deserts and ice shade off into the land round them
    g.filter = 'blur(5px)'
    g.fillStyle = '#b19a5f'
    for (const [a, b, c, d] of [[-17, 35, 15, 31], [35, 60, 14, 32], [55, 72, 24, 38], [56, 118, 37, 48], [114, 142, -32, -19], [-118, -102, 24, 36], [12, 25, -29, -17]]) {
      g.fillRect(X(a), Y(d), X(b) - X(a), Y(c) - Y(d))
    }
    g.fillStyle = '#c4d2da'
    g.fillRect(0, Y(90), w, Y(72) - Y(90))
    g.fillRect(0, Y(-62), w, Y(-90) - Y(-62))
    g.restore()
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, lang, color, clickable }) {
  const R = 12.5
  const stage = meadowStage({ radius: R, light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = list => list.map(p => ({ p }))
  const casts = (...groups) =>
    groups.forEach(gr =>
      gr.traverse(o => {
        if (o.isMesh && !o.material?.transparent && o.text === undefined) o.castShadow = true
      }),
    )
  const tex = t => (textures.push(t), t)

  // shared materials (few kinds, so few shaders to compile)
  const mats = {
    metal: new THREE.MeshStandardMaterial({ color: '#8d96a3', roughness: 0.45, metalness: 0.6 }),
    alu: new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.3, metalness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2f3647', roughness: 0.7, metalness: 0.2 }),
    white: new THREE.MeshStandardMaterial({ color: '#e4e7ec', roughness: 0.5 }),
    black: new THREE.MeshStandardMaterial({ color: '#25282e', roughness: 0.6 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d9a93a', roughness: 0.35, metalness: 0.65, emissive: '#5a3c08', emissiveIntensity: 0.35 }),
    cellBlue: new THREE.MeshStandardMaterial({ color: '#203f96', roughness: 0.3, metalness: 0.3, emissive: '#10245a', emissiveIntensity: 0.4 }),
    electron: new THREE.MeshStandardMaterial({ color: '#5cb8ff', emissive: '#5cb8ff', emissiveIntensity: 1.6, roughness: 0.4 }),
    hole: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.9, roughness: 0.4 }),
  }
  const glowTex = tex(
    canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.35, 'rgba(255,255,255,0.45)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  const glow = (c, opacity = 1) => new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })

  // ================= the panel and the sun =================
  const P = V(-3.4, 0, -1.0)
  const yawP = Math.atan2(F.x, F.z)
  const panelG = new THREE.Group()
  panelG.position.copy(P)
  panelG.rotation.y = yawP
  root.add(panelG)
  const plate = new THREE.Group()
  plate.position.set(0, 1.6, 0)
  plate.rotation.x = -(Math.PI / 2 - TILT)
  panelG.add(plate)
  // 60 cells in 10 by 6, each with its busbars and fine fingers, as the picture draws them
  const cellsTex = tex(
    canvasTex(1280, 768, (g, w, h) => {
      g.fillStyle = '#c3cbd8'
      g.fillRect(0, 0, w, h)
      const cw = w / 10
      const ch = h / 6
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 6; j++) {
          const x = i * cw + 4
          const y = j * ch + 4
          const ww = cw - 8
          const hh = ch - 8
          const grd = g.createLinearGradient(x, y, x + ww, y + hh)
          grd.addColorStop(0, '#3463c8')
          grd.addColorStop(1, '#1d3d92')
          g.fillStyle = grd
          g.fillRect(x, y, ww, hh)
          g.strokeStyle = 'rgba(200,215,255,0.32)'
          g.lineWidth = 1
          for (let k = 1; k < 16; k++) {
            const yy = y + (k / 16) * hh
            g.beginPath()
            g.moveTo(x, yy)
            g.lineTo(x + ww, yy)
            g.stroke()
          }
          g.fillStyle = 'rgba(225,232,245,0.85)'
          for (const f of [0.3, 0.7]) g.fillRect(x + f * ww - 2, y, 4, hh)
        }
      }
    }),
  )
  const faceMat = new THREE.MeshStandardMaterial({ map: cellsTex, roughness: 0.22, metalness: 0.2, emissive: '#ffffff', emissiveMap: cellsTex, emissiveIntensity: 0.12 })
  const face = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.16), faceMat)
  face.position.z = 0.012
  const frame = new THREE.Mesh(new RoundedBoxGeometry(3.74, 2.3, 0.08, 2, 0.025), mats.metal)
  frame.position.z = -0.03
  const jbox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.09), mats.dark)
  jbox.position.set(-1.3, -0.72, -0.11)
  plate.add(face, frame, jbox)
  // the stand: short legs in front, tall ones behind, a brace
  const leg = (x, z, h) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, h, 10), mats.metal)
    m.position.set(x, h / 2, z)
    panelG.add(m)
  }
  for (const x of [-1.45, 1.45]) {
    leg(x, 0.7, 0.99)
    leg(x, -0.7, 2.16)
  }
  const brace = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.06), mats.metal)
  brace.position.set(0, 0.9, -0.7)
  panelG.add(brace)
  solids.push(box(P.x, P.z, 3.9, 1.9, { rot: yawP }))

  // the meter, beside the panel, turned between the visitor at the panel and the middle of the hill
  const meter = standingScreen({ width: 1.5, height: 0.98, color, title: E.panel.meter, line: '', titleSize: 0.12, lineSize: 0.082 }, { top: 1.42, tilt: 0.22, mat: mats.metal })
  const MP = P.clone().addScaledVector(G, 4.15).addScaledVector(F, 0.35)
  meter.group.position.copy(MP)
  meter.group.rotation.y = Math.atan2(0 - MP.x, 2.5 - MP.z)
  root.add(meter.group)
  solids.push(circle(MP.x, MP.z, 0.32))
  const railMat = new THREE.MeshBasicMaterial({ color: '#232a55' })
  const bar = (y, c) => {
    const rail = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.06), railMat)
    rail.position.set(0, y, 0.001)
    const fillM = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.06).translate(0.62, 0, 0), new THREE.MeshBasicMaterial({ color: hdr(c, 1.25) }))
    fillM.position.set(-0.62, y, 0.003)
    meter.content.add(rail, fillM)
    return fillM
  }
  const lightBar = bar(-0.3, '#ffd15a')
  const powerBar = bar(-0.4, '#5ef08a')

  // the bulb on its post
  const B = P.clone().addScaledVector(G, 3.2).addScaledVector(F, -0.2)
  const bulbG = new THREE.Group()
  bulbG.position.copy(B)
  root.add(bulbG)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.5, 10), mats.metal)
  post.position.y = 0.75
  const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.24, 16), mats.alu)
  socket.position.y = 1.6
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#77736a', emissive: '#ffc85a', emissiveIntensity: 0.1, roughness: 0.2 })
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.12, 0.2, 20), bulbMat)
  neck.position.y = 1.81
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.32, 28, 20), bulbMat)
  glass.position.y = 2.12
  const halo = new THREE.Sprite(glow('#ffcf70', 0))
  halo.position.y = 2.12
  bulbG.add(post, socket, neck, glass, halo)
  const bulbLight = light ? null : new THREE.PointLight('#ffcf7a', 0, 7, 1.6)
  if (bulbLight) {
    bulbLight.position.y = 2.12
    bulbG.add(bulbLight)
  }
  solids.push(circle(B.x, B.z, 0.3))

  // two wires from the panel's junction box to the bulb, electrons running in them
  root.updateMatrixWorld(true)
  const J = plate.localToWorld(V(-1.3, -0.76, -0.12))
  const along = V(B.x - J.x, 0, B.z - J.z).normalize()
  const side = V(-along.z, 0, along.x)
  const wireCurve = off => {
    const o = (p, k = 1) => p.addScaledVector(side, off * k)
    return new THREE.CatmullRomCurve3([
      o(J.clone()),
      o(V(J.x, 0.45, J.z).addScaledVector(along, 0.05)),
      o(V(J.x, 0.04, J.z).addScaledVector(along, 0.35)),
      o(V(lerp(J.x, B.x, 0.5), 0.03, lerp(J.z, B.z, 0.5))),
      o(V(B.x, 0.04, B.z).addScaledVector(along, -0.25)),
      o(V(B.x, 0.3, B.z).addScaledVector(along, -0.08), 0.6),
      o(V(B.x, 1.5, B.z).addScaledVector(along, -0.06), 0.5),
    ])
  }
  const wires = [wireCurve(0.06), wireCurve(-0.06)]
  root.add(
    new THREE.Mesh(new THREE.TubeGeometry(wires[0], 90, 0.024, 6), new THREE.MeshStandardMaterial({ color: '#d4572b', roughness: 0.5 })),
    new THREE.Mesh(new THREE.TubeGeometry(wires[1], 90, 0.024, 6), mats.black),
  )
  const DOTS = 12
  const dotMat = new THREE.MeshStandardMaterial({ color: '#5cb8ff', emissive: '#5cb8ff', emissiveIntensity: 0.3, roughness: 0.4 })
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 10, 8), dotMat, DOTS * 2)
  dots.frustumCulled = false
  root.add(dots)

  // rays of sunlight falling on the panel: wavy ribbons from the sun, as the picture draws them
  const rayTex = tex(waveTex(3))
  rayTex.wrapT = THREE.RepeatWrapping
  rayTex.repeat.set(1, 2.5)
  const rayMat = new THREE.MeshBasicMaterial({ map: rayTex, color: hdr('#ffcf45', 1.1), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
  const rayGeo = new THREE.PlaneGeometry(0.34, 3.6).translate(0, 1.8, 0)
  const rays = [[-1.1, 0.4], [0.15, -0.35], [1.1, 0.45]].map(([x, y]) => {
    const m = new THREE.Mesh(rayGeo, rayMat)
    m.userData.at = plate.localToWorld(V(x, y, 0.05))
    m.frustumCulled = false
    root.add(m)
    return m
  })

  // the cloud that can be passed over the sun (the sky's own cloud material, tinted with the sky)
  const cloud = new THREE.Mesh(new THREE.PlaneGeometry(22, 10), stage.cloudMaterial)
  cloud.renderOrder = -4
  root.add(cloud)

  casts(panelG, meter.group, bulbG)

  // the sun's state: where it is (u), where it is going, the cloud
  let sunU = START
  let sunT = START
  let cloudOn = false
  let cloudK = 0
  const dirNow = sunDirAt(sunU)
  let lightNow = 0
  let powerNow = 0
  /** Which part of the day the time u is in (for the Atomling's words). */
  const partOf = u => {
    const w = wrap2(u)
    if (sunDirAt(w).y < 0.01) return 'night'
    return w < 0.33 ? 'morning' : w < 0.62 ? 'noon' : w < 0.86 ? 'afternoon' : 'evening'
  }
  /** The light and the electricity a time of day gives (for the Atomling's words). */
  const at_ = u => {
    const l = lightOn(sunDirAt(u), cloudOn ? 1 : 0)
    return { light: String(Math.round(l / 10) * 10), power: String(Math.round(l * EFF)) }
  }
  const sunLine = key => fill(at(E.panel.says[key], level()), at_(wrap2(sunT)))
  const setCloud = (v, mine) => {
    if (cloudOn === v) return false
    cloudOn = v
    if (mine) say(at(v ? E.panel.says.cloud : E.panel.says.clear, level()))
    return true
  }
  // the slider moves many times a second: the others get it a few times a second, and where it stopped;
  // once it rests in another part of the day, the Atomling says what the panel gets there
  let sliding = false
  let settle = 0
  let saidPart = partOf(START)
  const slid = () => {
    settle = 0.8
    if (sliding) return
    sliding = true
    later(0.15, () => {
      sliding = false
      share('sun')
    })
  }
  const tapCloud = () => {
    setCloud(!cloudOn, true)
    play('select')
    share('sun')
    ex.discover('panel', panelPanel, 1.2)
  }
  const tapSun = () => {
    if (!ex.discover('panel', panelPanel, 0)) ctx.showPanel(panelPanel)
  }
  const panelPanel = lv => ({
    title: E.panel.title,
    color,
    blocks: [
      ...paras(E.panel.panel[depth(lv)]),
      { p: E.panel.tip },
      {
        slider: {
          label: E.panel.time,
          min: 0,
          max: 1.995,
          step: 0.005,
          value: wrap2(sunU),
          onInput: v => {
            sunT = v
            sunU = v
            slid()
          },
          format: clock,
          live: () => wrap2(sunU),
        },
      },
      {
        buttons: [
          { label: E.panel.cloudOn, onClick: () => setCloud(true, true) && share('sun') },
          { label: E.panel.cloudOff, onClick: () => setCloud(false, true) && share('sun') },
        ],
      },
    ],
  })
  const X1 = P.clone().addScaledVector(F, 3.3)
  ex.add({
    id: 'panel',
    x: X1.x,
    z: X1.z,
    radius: 2.0,
    label: E.panel.label,
    verb: E.panel.move,
    screens: [meter],
    panel: panelPanel,
    focus: { x: P.x + G.x * 0.9, y: 1.5, z: P.z + G.z * 0.9, size: 5.4 },
  })
  // the cloud is tapped to pass it over the sun (or away again); the sun, to move it with the slider
  clickable(cloud, tapCloud, { reach: 90 })
  const sunPick = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 8), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }))
  root.add(sunPick)
  clickable(sunPick, tapSun, { when: () => dirNow.y > 0.02, reach: 90 })

  const dotObj = new THREE.Object3D()
  const rayBasis = new THREE.Matrix4()
  const tmpA = V(0, 0, 0)
  const tmpB = V(0, 0, 0)
  const tmpC = V(0, 0, 0)
  let flow = 0
  let meterWait = 0
  let meterText = ''
  updates.push((dt, t) => {
    // the sun glides to where it was sent (quickly when far), through the night after the evening
    const d = sunT - sunU
    if (Math.abs(d) > 1e-5) sunU += Math.sign(d) * Math.min(Math.abs(d), (0.25 + 2.2 * Math.abs(d)) * dt)
    if (sunU >= 2 && sunT >= 2) {
      sunU -= 2
      sunT -= 2
    } else if (sunU < 0 && sunT < 0) {
      sunU += 2
      sunT += 2
    }
    cloudK = damp(cloudK, cloudOn ? 1 : 0, 1.4, dt)
    sunDirAt(sunU, dirNow)
    stage.setSun(dirNow, { cloud: cloudK })
    lightNow = lightOn(dirNow, cloudK)
    powerNow = lightNow * EFF
    const kb = clamp(powerNow / 190)
    // the bulb
    bulbMat.emissiveIntensity = 0.05 + 2.4 * kb
    bulbMat.color.set(kb > 0.02 ? '#fff1c8' : '#77736a')
    halo.material.opacity = Math.min(1, kb * 1.6)
    halo.scale.setScalar(0.9 + 1.6 * Math.sqrt(kb))
    if (bulbLight) bulbLight.intensity = 5 * kb
    // the electrons in the wires, faster with more current
    flow += dt * (kb > 0.005 ? 0.04 + 0.3 * kb : 0)
    dotMat.emissiveIntensity = 0.25 + 1.8 * kb
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < DOTS; i++) {
        const p = (i / DOTS + flow) % 1
        wires[w].getPointAt(w === 0 ? p : 1 - p, dotObj.position)
        dotObj.updateMatrix()
        dots.setMatrixAt(w * DOTS + i, dotObj.matrix)
      }
    }
    dots.instanceMatrix.needsUpdate = true
    // the panel catches the light; the rays come from the sun's side
    faceMat.emissiveIntensity = 0.03 + 0.08 * (1 - stage.look.night) + 0.3 * clamp(lightNow / 950)
    rayMat.opacity = 0.55 * clamp(lightNow / 600) * clamp(dirNow.y * 6)
    // the studio light the engine gives every world fades with the daylight
    const scene = ctx.scene ?? ctx.engine?.scene
    if (scene) scene.environmentIntensity = stage.env.envIntensity * (0.2 + 0.8 * (1 - stage.look.night))
    rayTex.offset.y = (rayTex.offset.y + dt * 0.5) % 1
    const cam = ctx.camera
    for (const m of rays) {
      m.position.copy(m.userData.at)
      tmpA.copy(cam.position).sub(m.position)
      tmpA.addScaledVector(dirNow, -tmpA.dot(dirNow)).normalize()
      tmpB.crossVectors(dirNow, tmpA)
      rayBasis.makeBasis(tmpB, dirNow, tmpA)
      m.quaternion.setFromRotationMatrix(rayBasis)
      m.visible = rayMat.opacity > 0.01
    }
    // the cloud: beside the sun when the sky is clear, over it when brought
    tmpC.crossVectors(dirNow, UP).normalize()
    cloud.position.set(P.x, 1.6, P.z).addScaledVector(dirNow, 40).addScaledVector(tmpC, (1 - cloudK) * 17).addScaledVector(UP, (1 - cloudK) * 3)
    cloud.lookAt(P.x, 1.6, P.z)
    sunPick.position.set(P.x, 1.6, P.z).addScaledVector(dirNow, 47)
    if (settle > 0) {
      settle -= dt
      const part = partOf(sunT)
      if (settle <= 0 && part !== saidPart) {
        saidPart = part
        say(sunLine(part))
      }
    }
    // the meter, a few times a second
    meterWait -= dt
    lightBar.scale.x = Math.max(0.001, clamp(lightNow / 1000))
    powerBar.scale.x = Math.max(0.001, clamp(powerNow / 1000) * 4.5)
    if (meterWait <= 0) {
      meterWait = 0.2
      const voc = lightNow > 0.5 ? Math.max(0, 0.62 + 0.0257 * Math.log(lightNow / 1000)) : 0
      const lines = [fill(E.panel.light, { v: String(Math.round(lightNow / 5) * 5) }), fill(E.panel.power, { v: String(Math.round(powerNow)) })]
      if (level() === 'scientist') lines.push(fill(E.panel.volt, { v: num(voc, 2, lang) }))
      const text = lines.join('\n')
      if (text !== meterText) {
        meterText = text
        meter.set({ line: text })
      }
    }
  })

  // ================= inside a solar cell =================
  const S = V(5.0, 0, -2.2)
  const H = V(-5.5, 0, 5.2).normalize()
  const yawS = Math.atan2(H.x, H.z)
  const cellG = new THREE.Group()
  cellG.position.copy(S)
  cellG.rotation.y = yawS
  root.add(cellG)
  const Y0 = 0.36
  const Y1 = 2.4
  const CD = 0.8
  const FZ = CD / 2 + 0.03
  const PZ = FZ + 0.12
  const JY = 1.735
  const FINGERS = [-1.0, 0, 1.0]
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.28, 1.0, 2, 0.04), mats.dark)
  plinth.position.y = 0.14
  const back = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, CD), mats.alu)
  back.position.y = 0.32
  // the face: the n layer (blue) over the p layer (amber), the junction's band between, n and p in the margin
  const cellFace = tex(
    canvasTex(768, 522, (g, w, h) => {
      const Yc = y => ((Y1 - y) / (Y1 - Y0)) * h
      let grd = g.createLinearGradient(0, Yc(JY), 0, h)
      grd.addColorStop(0, '#99603f')
      grd.addColorStop(1, '#6e4029')
      g.fillStyle = grd
      g.fillRect(0, Yc(JY), w, h - Yc(JY))
      grd = g.createLinearGradient(0, 0, 0, Yc(JY))
      grd.addColorStop(0, '#24407c')
      grd.addColorStop(1, '#3758a6')
      g.fillStyle = grd
      g.fillRect(0, 0, w, Yc(JY))
      const b0 = Yc(1.98)
      const b1 = Yc(1.49)
      grd = g.createLinearGradient(0, b0, 0, b1)
      grd.addColorStop(0, 'rgba(255,240,215,0)')
      grd.addColorStop(0.25, 'rgba(255,240,215,0.16)')
      grd.addColorStop(0.75, 'rgba(255,240,215,0.16)')
      grd.addColorStop(1, 'rgba(255,240,215,0)')
      g.fillStyle = grd
      g.fillRect(0, b0, w, b1 - b0)
      g.setLineDash([12, 9])
      g.strokeStyle = 'rgba(255,226,150,0.75)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(0, Yc(JY))
      g.lineTo(w, Yc(JY))
      g.stroke()
      g.setLineDash([])
      g.font = '700 62px Outfit'
      g.textAlign = 'center'
      g.fillStyle = 'rgba(214,228,255,0.92)'
      g.fillText('n', 28, Yc(2.07) + 20)
      g.fillStyle = 'rgba(255,224,196,0.92)'
      g.fillText('p', 28, Yc(1.0) + 14)
      // the junction pushes electrons up: an arrow in the right margin
      const ax = w - 28
      g.strokeStyle = 'rgba(160,210,255,0.9)'
      g.fillStyle = 'rgba(160,210,255,0.9)'
      g.lineWidth = 6
      g.beginPath()
      g.moveTo(ax, b1 - 4)
      g.lineTo(ax, b0 + 24)
      g.stroke()
      g.beginPath()
      g.moveTo(ax - 14, b0 + 28)
      g.lineTo(ax + 14, b0 + 28)
      g.lineTo(ax, b0 + 4)
      g.closePath()
      g.fill()
    }),
  )
  const sideMat = new THREE.MeshStandardMaterial({ color: '#3a4152', roughness: 0.6, metalness: 0.25 })
  const arMat = new THREE.MeshStandardMaterial({ color: '#23439c', roughness: 0.3, metalness: 0.3 })
  const cellFaceMat = new THREE.MeshStandardMaterial({ map: cellFace, roughness: 0.6, emissive: '#ffffff', emissiveMap: cellFace, emissiveIntensity: 0.3 })
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, Y1 - Y0, CD), [sideMat, sideMat, arMat, sideMat, cellFaceMat, sideMat])
  body.position.y = (Y0 + Y1) / 2
  cellG.add(plinth, back, body)
  for (const x of FINGERS) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.045, CD), mats.alu)
    f.position.set(x, Y1 + 0.02, 0)
    cellG.add(f)
  }
  // the lattice on the face: silicon, with phosphorus above the border and boron below
  const COLS = 9
  const ROWS = 6
  const ax = i => -1.28 + 0.32 * i
  const ay = j => 0.58 + 0.33 * j
  const DOP = { '1,5': 'P', '6,5': 'P', '3,4': 'P+', '7,4': 'P+', '2,3': 'B-', '5,3': 'B-', '1,1': 'B', '6,0': 'B', '4,2': 'B' }
  const ATOM = { Si: '#c58d5b', P: '#a879ff', B: '#3fc49a' }
  const atomMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45, metalness: 0.1, emissive: '#2a2018', emissiveIntensity: 1 })
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.085, 16, 12), atomMat, COLS * ROWS)
  const bondMat = new THREE.MeshStandardMaterial({ color: '#9a8a78', roughness: 0.6 })
  const bonds = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 6), bondMat, (COLS - 1) * ROWS + COLS * (ROWS - 1))
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    let a = 0
    let b = 0
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        o.position.set(ax(i), ay(j), FZ)
        o.rotation.set(0, 0, 0)
        o.scale.setScalar(1)
        o.updateMatrix()
        atoms.setMatrixAt(a, o.matrix)
        const kind = (DOP[`${i},${j}`] ?? 'Si')[0]
        atoms.setColorAt(a++, col.set(kind === 'P' ? ATOM.P : kind === 'B' ? ATOM.B : ATOM.Si))
        if (i < COLS - 1) {
          o.position.set(ax(i) + 0.16, ay(j), FZ)
          o.rotation.set(0, 0, Math.PI / 2)
          o.scale.set(1, 0.32, 1)
          o.updateMatrix()
          bonds.setMatrixAt(b++, o.matrix)
        }
        if (j < ROWS - 1) {
          o.position.set(ax(i), ay(j) + 0.165, FZ)
          o.rotation.set(0, 0, 0)
          o.scale.set(1, 0.33, 1)
          o.updateMatrix()
          bonds.setMatrixAt(b++, o.matrix)
        }
      }
    }
  }
  cellG.add(atoms, bonds)
  // the fixed charges at the junction (P+ above, B− below), the free electrons by phosphorus, the holes by boron
  const elecGeo = new THREE.SphereGeometry(0.06, 14, 10)
  const holeGeo = new THREE.TorusGeometry(0.07, 0.014, 8, 24)
  const wander = []
  for (const [key, kind] of Object.entries(DOP)) {
    const [i, j] = key.split(',').map(Number)
    if (kind === 'P+' || kind === 'B-') {
      const sign = makeText(kind === 'P+' ? '+' : '−', { size: 0.2, color: kind === 'P+' ? '#ffd166' : '#9fd0ff' })
      sign.position.set(ax(i) + 0.13, ay(j) + 0.12, FZ + 0.1)
      cellG.add(sign)
    } else {
      const m = new THREE.Mesh(kind === 'P' ? elecGeo : holeGeo, kind === 'P' ? mats.electron : mats.hole)
      cellG.add(m)
      wander.push({ m, x: ax(i) + 0.16, y: ay(j) + (kind === 'P' ? -0.165 : 0.165), ph: i * 1.7 + j })
    }
  }
  // the wire round the outside, with a little bulb on it
  const WZ = FZ + 0.04
  const loop = new THREE.CurvePath()
  const corners = [V(1.48, Y1 + 0.05, WZ), V(1.85, Y1 + 0.05, WZ), V(1.85, Y0 - 0.04, WZ), V(1.48, Y0 - 0.04, WZ)]
  for (let i = 0; i < corners.length - 1; i++) loop.add(new THREE.LineCurve3(corners[i], corners[i + 1]))
  const copper = new THREE.MeshStandardMaterial({ color: '#c8733a', roughness: 0.4, metalness: 0.5 })
  cellG.add(new THREE.Mesh(new THREE.TubeGeometry(loop, 48, 0.026, 6), copper))
  const CB = V(1.85, 1.42, WZ)
  const smallBulbMat = new THREE.MeshStandardMaterial({ color: '#fff1c8', emissive: '#ffc85a', emissiveIntensity: 0.15, roughness: 0.25 })
  const smallBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), smallBulbMat)
  smallBulb.position.copy(CB)
  const smallHalo = new THREE.Sprite(glow('#ffcf70', 0))
  smallHalo.position.copy(CB)
  smallHalo.scale.setScalar(0.9)
  cellG.add(smallBulb, smallHalo)
  // the picture's magnifier: a gold ring behind the cell, stood in the grass by its handle, a lamp of
  // photons hanging from its top
  const RC = V(0, 2.15, -0.55)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.1, 12, 96), mats.gold)
  ring.position.copy(RC)
  const sheen = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.03, 6, 32, 0.9),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false }),
  )
  sheen.position.copy(RC)
  sheen.rotation.z = 2.0
  const ha = -0.7
  const h0 = V(RC.x + Math.cos(ha) * 2.1, RC.y + Math.sin(ha) * 2.1, RC.z)
  const h1 = V(RC.x + Math.cos(ha) * 3.25, Math.max(0.05, RC.y + Math.sin(ha) * 3.25), RC.z)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, h0.distanceTo(h1), 14), new THREE.MeshStandardMaterial({ color: '#5b3a22', roughness: 0.6 }))
  handle.position.lerpVectors(h0, h1, 0.5)
  handle.quaternion.setFromUnitVectors(UP, h1.clone().sub(h0).normalize())
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, PZ - RC.z + 0.03), mats.gold)
  bracket.position.set(0, RC.y + 2.05, (PZ + RC.z) / 2)
  const drop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.78, 0.06), mats.gold)
  drop.position.set(0, RC.y + 2.05 - 0.39, PZ)
  const lampBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.05, 0.05), mats.gold)
  lampBar.position.set(0, 3.42, PZ)
  cellG.add(ring, sheen, handle, bracket, drop, lampBar)
  // four lamps of light, one for each colour, hanging from the bar: tapping one fires its photon
  const LAMPS = {}
  const lensMats = {}
  const lampFlash = { ir: 0, red: 0, green: 0, blue: 0 }
  const lampGroups = {}
  const lampBody = new THREE.CylinderGeometry(0.11, 0.14, 0.28, 18)
  const lampBand = new THREE.CylinderGeometry(0.146, 0.146, 0.06, 18)
  const lensGeo = new THREE.CircleGeometry(0.1, 20)
  for (const c of ORDER) {
    const g = new THREE.Group()
    g.position.set(LX[c], 0, PZ)
    const body = new THREE.Mesh(lampBody, mats.dark)
    body.position.y = 3.24
    lensMats[c] = new THREE.MeshBasicMaterial({ color: hdr(HEX[c], c === 'ir' ? 1.0 : 1.5) })
    const band = new THREE.Mesh(lampBand, lensMats[c])
    band.position.y = 3.14
    const lens = new THREE.Mesh(lensGeo, lensMats[c])
    lens.rotation.x = Math.PI / 2
    lens.position.y = 3.095
    const hang = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.03), mats.gold)
    hang.position.y = 3.4
    g.add(body, band, lens, hang)
    if (c === 'ir') {
      const tagIR = makeText('IR', { size: 0.085, color: '#ffb3c8' })
      tagIR.position.set(0, 3.25, 0.13)
      g.add(tagIR)
    }
    cellG.add(g)
    lampGroups[c] = g
    LAMPS[c] = V(LX[c], 3.06, PZ)
  }
  // the legend, on a little stand to the left
  const L = E.cell.legend
  const legendTex = tex(
    canvasTex(512, 600, (g, w, h) => {
      g.fillStyle = '#0d1233'
      g.beginPath()
      g.roundRect(4, 4, w - 8, h - 8, 26)
      g.fill()
      g.strokeStyle = color
      g.lineWidth = 8
      g.stroke()
      g.fillStyle = color
      g.font = '700 46px Outfit'
      g.textAlign = 'left'
      g.fillText(L.title, 34, 72, w - 68)
      const rows = [
        ['dot', ATOM.Si, L.si], ['dot', ATOM.P, L.p], ['dot', ATOM.B, L.b], ['dot', '#5cb8ff', L.electron],
        ['ring', '#ffffff', L.hole], ['box', '#3758a6', L.n], ['box', '#99603f', L.pl],
      ]
      rows.forEach(([kind, c, text], k) => {
        const y = 128 + k * 64
        g.fillStyle = c
        g.strokeStyle = c
        if (kind === 'dot') {
          g.beginPath()
          g.arc(62, y, 19, 0, TAU)
          g.fill()
        } else if (kind === 'ring') {
          g.lineWidth = 5
          g.setLineDash([7, 6])
          g.beginPath()
          g.arc(62, y, 17, 0, TAU)
          g.stroke()
          g.setLineDash([])
        } else g.fillRect(40, y - 17, 44, 34)
        let size = 32
        g.font = `700 ${size}px Nunito`
        while (g.measureText(text).width > w - 140 && size > 18) g.font = `700 ${--size}px Nunito`
        g.fillStyle = '#e4ebff'
        g.fillText(text, 104, y + 11)
      })
    }),
  )
  const legend = new THREE.Group()
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.17), new THREE.MeshStandardMaterial({ map: legendTex, emissive: '#ffffff', emissiveMap: legendTex, emissiveIntensity: 0.55, roughness: 0.6 }))
  sign.position.y = 1.28
  const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.72, 8), mats.metal)
  signPost.position.set(0, 0.36, -0.02)
  legend.add(sign, signPost)
  legend.position.set(-2.4, 0, 0.45)
  legend.rotation.y = 0.4
  cellG.add(legend)
  // photons and electrons counted on the plinth
  let shots = 0
  let freed = 0
  let lastColor = 'red'
  const countText = makeText('', { font: 'body', size: 0.105, color: '#ffe7a8' })
  countText.position.set(0, 0.14, 0.505)
  cellG.add(countText)
  let countShown = ''
  casts(cellG)
  solids.push(box(S.x, S.z, 3.5, 1.15, { rot: yawS }))
  cellG.updateMatrixWorld(true)
  {
    const lp = cellG.localToWorld(V(-2.4, 0, 0.45))
    const hp = cellG.localToWorld(h1.clone())
    solids.push(circle(lp.x, lp.z, 0.25), circle(hp.x, hp.z, 0.22))
  }

  const photonGeo = new THREE.PlaneGeometry(0.17, 0.75)
  const photonMats = Object.fromEntries(
    ORDER.map(c => {
      const t = tex(waveTex(CYCLES[c]))
      return [c, new THREE.MeshBasicMaterial({ map: t, color: hdr(HEX[c], c === 'ir' ? 1.1 : 2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })]
    }),
  )
  const runs = []
  /** The wire's path for an electron that reached the top at finger xf and goes back to its hole at xa. */
  const pathFor = (xf, xa) => {
    const pts = [V(xf, Y1 + 0.05, PZ), V(1.48, Y1 + 0.05, PZ), V(1.85, Y1 + 0.05, PZ), V(1.85, Y0 - 0.04, PZ), V(xa, Y0 - 0.04, PZ), V(xa, 0.47, PZ)]
    const len = [0]
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + pts[i].distanceTo(pts[i - 1]))
    const total = len[len.length - 1]
    const bulbAt = (len[2] + (Y1 + 0.05 - CB.y)) / total
    return {
      bulbAt,
      at(s, out) {
        const d = clamp(s) * total
        let i = 1
        while (i < len.length - 1 && len[i] < d) i++
        const k = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])
        return out.lerpVectors(pts[i - 1], pts[i], clamp(k))
      },
    }
  }
  function startRun(c, k) {
    const L0 = LAMPS[c]
    const xa = LX[c] + XO[k % XO.length]
    const A = V(xa, c === 'ir' ? Y0 - 0.75 : ABS[c], PZ)
    const dir = A.clone().sub(L0)
    lampFlash[c] = 1
    const photon = new THREE.Mesh(photonGeo, photonMats[c])
    photon.rotation.z = Math.atan2(-dir.x, dir.y)
    photon.renderOrder = 2
    cellG.add(photon)
    const r = { c, t: 0, T1: dir.length() / 2.6, L: L0, A, photon, xa, ex: EV[c] - GAP, bulbHit: false }
    if (c !== 'ir') {
      r.xf = FINGERS.reduce((best, f) => (Math.abs(f - xa) < Math.abs(best - xa) ? f : best))
      r.path = pathFor(r.xf, xa)
      r.e = new THREE.Mesh(elecGeo, mats.electron)
      r.h = new THREE.Mesh(holeGeo, mats.hole)
      r.heat = new THREE.Sprite(glow('#ff7a2a', 0))
      r.flash = new THREE.Sprite(glow('#ffffff', 0))
      for (const o of [r.e, r.h, r.heat, r.flash]) {
        o.visible = false
        cellG.add(o)
      }
    }
    runs.push(r)
  }
  const endRun = r => {
    for (const o of [r.photon, r.e, r.h, r.heat, r.flash]) {
      if (!o) continue
      cellG.remove(o)
      if (o.isSprite) o.material.dispose()
    }
  }
  /** Fires a photon of colour c: false while four are still on their way. */
  const fire = c => {
    if (runs.length >= 4) return false
    startRun(c, shots)
    shots++
    if (c !== 'ir') freed++
    lastColor = c
    play('electron')
    return true
  }
  const fireMine = c => {
    if (!fire(c)) {
      say(at(W.busy, level()))
      return false
    }
    share('cell')
    later(1.0, () => say(at(E.cell.says[c], level())))
    ex.discover('cell', cellPanel, 2.8)
    return true
  }
  const cellPanel = lv => ({
    title: E.cell.title,
    color,
    blocks: [...paras(E.cell.panel[depth(lv)]), { buttons: ORDER.map(c => ({ label: at(E.cell.colors[c], lv), onClick: () => fireMine(c) })) }],
  })
  const X2 = S.clone().addScaledVector(H, 3.1)
  ex.add({
    id: 'cell',
    x: X2.x,
    z: X2.z,
    radius: 2.0,
    label: E.cell.label,
    verb: E.cell.tap,
    panel: cellPanel,
    focus: { x: S.x, y: 1.75, z: S.z, size: 4.6 },
  })
  for (const c of ORDER) clickable(lampGroups[c], () => fireMine(c))
  let cellBulbK = 0
  const tmpE = V(0, 0, 0)
  updates.push((dt, t) => {
    for (const c of ORDER) {
      lampFlash[c] = damp(lampFlash[c], 0, 3, dt)
      lensMats[c].color.set(HEX[c]).multiplyScalar((c === 'ir' ? 1.0 : 1.5) + 2.5 * lampFlash[c])
    }
    for (const w of wander) {
      w.m.position.set(w.x + Math.cos(t * 1.3 + w.ph) * 0.025, w.y + Math.sin(t * 1.7 + w.ph) * 0.025, PZ)
    }
    for (let i = runs.length - 1; i >= 0; i--) {
      const r = runs[i]
      r.t += dt
      const t1 = r.T1
      // the photon on its way (infrared shrinks away as it leaves through the bottom)
      if (r.t < t1) {
        r.photon.visible = true
        r.photon.position.lerpVectors(r.L, r.A, r.t / t1)
        if (r.c === 'ir') r.photon.scale.setScalar(clamp((r.photon.position.y - (Y0 - 0.75)) / 0.6, 0.02, 1))
      } else r.photon.visible = false
      if (r.c === 'ir') {
        if (r.t >= t1) {
          endRun(r)
          runs.splice(i, 1)
        }
        continue
      }
      const u = r.t - t1
      if (u < 0) continue
      if (!r.born) {
        r.born = true
        for (const o of [r.e, r.h, r.heat, r.flash]) o.visible = true
      }
      // the flash where it was caught, and the heat of the energy above the gap
      r.flash.position.copy(r.A)
      r.flash.scale.setScalar(0.35 + u * 1.2)
      r.flash.material.opacity = clamp(1 - u / 0.35)
      r.heat.position.copy(r.A)
      r.heat.scale.setScalar(0.3 + 0.55 * r.ex)
      r.heat.material.opacity = 0.9 * clamp(r.ex) * clamp(1 - u / 1.8)
      // the electron: shaking hot, drifting to the junction, pushed up to a finger, round the wire, home
      const top = V(r.xf, Y1 + 0.05, PZ)
      const mid = V(r.xa + 0.08, 1.48, PZ)
      if (u < 0.6) {
        const amp = 0.04 * r.ex * (1 - u / 0.6)
        r.e.position.set(r.A.x + Math.sin(r.t * 61) * amp, r.A.y + Math.cos(r.t * 47) * amp, PZ)
      } else if (u < 1.5) r.e.position.lerpVectors(r.A, mid, ease((u - 0.6) / 0.9))
      else if (u < 1.95) {
        const k = (u - 1.5) / 0.45
        r.e.position.lerpVectors(mid, top, k * k)
      } else {
        const s = (u - 1.95) / 2.05
        r.path.at(s, tmpE)
        r.e.position.copy(tmpE)
        if (!r.bulbHit && s >= r.path.bulbAt) {
          r.bulbHit = true
          cellBulbK = 1
          play('tap')
        }
      }
      // the hole sinks to the back contact meanwhile
      if (u < 0.6) r.h.position.copy(r.A)
      else r.h.position.set(r.xa, lerp(r.A.y, 0.47, ease((u - 0.6) / 3.4)), PZ)
      // they meet and are gone
      const fade = clamp(1 - (u - 4.0) / 0.4)
      r.e.scale.setScalar(Math.max(0.01, fade))
      r.h.scale.setScalar(Math.max(0.01, fade))
      if (u > 4.4) {
        endRun(r)
        runs.splice(i, 1)
      }
    }
    cellBulbK = damp(cellBulbK, 0, 2.2, dt)
    smallBulbMat.emissiveIntensity = 0.15 + 3.2 * cellBulbK
    smallHalo.material.opacity = cellBulbK
    const shown = fill(E.cell.count, { n: shots, e: freed })
    if (shown !== countShown) {
      countShown = shown
      countText.text = shown
      countText.sync()
    }
  })

  // ================= Vanguard 1 =================
  const VP = V(1.2, 0, -8.6)
  const GC = V(1.2, 5.8, -10.4)
  const RG = 1.2
  const FLIGHT = 4.2
  const PERIOD = 10
  // its first orbit, 654 by 3969 km above an Earth of radius 6371 km, made to the globe's size
  const RP = RG * (6371 + 654) / 6371
  const RA = RG * (6371 + 3969) / 6371
  const AX = (RP + RA) / 2
  const ECC = (RA - RP) / (RA + RP)
  const BX = AX * Math.sqrt(1 - ECC * ECC)
  const vgG = new THREE.Group()
  root.add(vgG)
  // the pad and its tower
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.2, 0.18, 32), new THREE.MeshStandardMaterial({ color: '#7d8088', roughness: 0.9 }))
  pad.position.set(VP.x, 0.09, VP.z)
  vgG.add(pad)
  const towerMat = new THREE.MeshStandardMaterial({ color: '#c4512d', roughness: 0.6, metalness: 0.3 })
  const tower = new THREE.Group()
  tower.position.set(VP.x + 0.75, 0.18, VP.z - 0.2)
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.7, 0.05), towerMat)
    p.position.set(x, 1.85, z)
    tower.add(p)
  }
  for (let k = 0; k < 6; k++) {
    for (const [x, z, w, d] of [[0, -0.2, 0.42, 0.04], [0, 0.2, 0.42, 0.04], [-0.2, 0, 0.04, 0.42], [0.2, 0, 0.04, 0.42]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), towerMat)
      b.position.set(x, 0.4 + k * 0.62, z)
      tower.add(b)
    }
  }
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), towerMat)
  arm.position.set(-0.42, 2.4, 0)
  tower.add(arm)
  vgG.add(tower)
  solids.push(circle(VP.x, VP.z, 1.15, { y1: 0.18 }), circle(VP.x + 0.75, VP.z - 0.2, 0.35))
  // the rocket: three stages, Vanguard 1 on top
  const stage1 = new THREE.Group()
  {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.7, 20), mats.white)
    c.position.y = 0.85
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.133, 0.133, 0.2, 20), mats.black)
    band.position.y = 1.1
    stage1.add(c, band)
    for (let k = 0; k < 4; k++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.34, 0.16), mats.black)
      const a = (k / 4) * TAU + Math.PI / 4
      fin.position.set(Math.cos(a) * 0.19, 0.2, Math.sin(a) * 0.19)
      fin.rotation.y = -a
      stage1.add(fin)
    }
  }
  const stage2 = new THREE.Group()
  {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.11, 0.9, 20), mats.white)
    c.position.y = 0.45
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.113, 0.113, 0.08, 20), mats.black)
    band.position.y = 0.06
    stage2.add(c, band)
  }
  const stage3 = new THREE.Group()
  {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.34, 16), mats.alu)
    c.position.y = 0.17
    stage3.add(c)
  }
  const sat = vanguardModel(2.2, mats)
  const SAT_ON_ROCKET = 0.6
  const stages = [
    { g: stage1, off: 0 },
    { g: stage2, off: 1.7 },
    { g: stage3, off: 2.6 },
  ]
  const NOSE = 3.08
  vgG.add(stage1, stage2, stage3, sat)
  const flameMat = new THREE.MeshBasicMaterial({ color: hdr('#ff9a3c', 2.2), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 14, 1, true).translate(0, -0.4, 0), flameMat)
  vgG.add(flame)
  const PUFFS = light ? 10 : 20
  const smoke = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshStandardMaterial({ color: '#c9ccd1', roughness: 1 }), PUFFS)
  smoke.frustumCulled = false
  vgG.add(smoke)
  // the globe overhead: the Earth turning on its tilted axis, a thin blue rim of air
  const axisG = new THREE.Group()
  axisG.position.copy(GC)
  axisG.rotation.z = THREE.MathUtils.degToRad(23.4)
  vgG.add(axisG)
  const earthTex = tex(earthTexture())
  const earth = new THREE.Mesh(new THREE.SphereGeometry(RG, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.85, emissive: '#0b2348', emissiveIntensity: 0.35 }))
  const rim = new THREE.Mesh(
    new THREE.SphereGeometry(RG * 1.06, 32, 20),
    new THREE.MeshBasicMaterial({ color: '#6fb6ff', transparent: true, opacity: 0.22, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  axisG.add(earth, rim)
  // the orbit: 34.25° to the equator, its plane leaning away from the visitor (so it is seen open, not
  // edge-on), its nearest point (perigee) on the pad's side, where the rocket brings it
  const orbitG = new THREE.Group()
  orbitG.position.copy(GC)
  {
    const axisW = UP.clone().applyAxisAngle(V(0, 0, 1), axisG.rotation.z)
    const away = V(0, 0, -1).addScaledVector(axisW, axisW.z).normalize()
    const n = axisW.clone().multiplyScalar(Math.cos(THREE.MathUtils.degToRad(34.25))).addScaledVector(away, Math.sin(THREE.MathUtils.degToRad(34.25)))
    const toPad = V(VP.x - 1.2, 0.2 - GC.y, VP.z + 1.6 - GC.z)
    const p = toPad.addScaledVector(n, -toPad.dot(n)).normalize()
    orbitG.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(p, n, p.clone().cross(n)))
  }
  vgG.add(orbitG)
  const orbitPts = []
  for (let k = 0; k <= 160; k++) {
    const E_ = (k / 160) * TAU
    orbitPts.push(V(AX * (Math.cos(E_) - ECC), 0, -BX * Math.sin(E_)))
  }
  const orbitMat = new THREE.LineBasicMaterial({ color: '#cfe3ff', transparent: true, opacity: 0, depthWrite: false })
  orbitG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts), orbitMat))
  root.updateMatrixWorld(true)
  /** Where something on the orbit is, `M` (mean anomaly) along it, scaled by k (the third stage's orbit). */
  const onOrbit = (Mm, out, k = 1) => {
    let Ek = Mm
    for (let i = 0; i < 6; i++) Ek -= (Ek - ECC * Math.sin(Ek) - Mm) / (1 - ECC * Math.cos(Ek))
    out.set(AX * k * (Math.cos(Ek) - ECC), 0, -BX * k * Math.sin(Ek))
    return orbitG.localToWorld(out)
  }
  const PP = onOrbit(0, V(0, 0, 0))
  const VD = onOrbit(0.02, V(0, 0, 0)).sub(PP).normalize()
  const N0 = V(VP.x, 0.18 + NOSE, VP.z)
  const N1 = N0.clone().add(V(0, 2.6, 0))
  const N2 = PP.clone().addScaledVector(VD, -2.2)
  const bez = (s, out) => {
    const a = 1 - s
    return out.set(0, 0, 0).addScaledVector(N0, a * a * a).addScaledVector(N1, 3 * a * a * s).addScaledVector(N2, 3 * a * s * s).addScaledVector(PP, s * s * s)
  }
  // the real size, by the pad: Vanguard 1 beside a grapefruit, on a little column
  const real = new THREE.Group()
  const RS = V(VP.x - 2.0, 0, VP.z + 1.6)
  real.position.copy(RS)
  real.rotation.y = Math.atan2(0 - RS.x, 2 - RS.z)
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 1.0, 20), mats.dark)
  column.position.y = 0.5
  const tiny = vanguardModel(1, mats)
  tiny.position.set(-0.07, 1.25, 0)
  const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 14), new THREE.MeshStandardMaterial({ color: '#f1a35c', roughness: 0.75 }))
  fruit.position.set(0.13, 1.065, 0.02)
  const tag = makeText(E.vanguard.real, { font: 'body', size: 0.075, color: '#ffe7a8', maxWidth: 0.9 })
  tag.position.set(0, 0.86, 0.26)
  real.add(column, tiny, fruit, tag)
  vgG.add(real)
  solids.push(circle(RS.x, RS.z, 0.3))
  casts(tower, stage1, stage2, stage3, real)
  // radio rings when it beeps
  const rings = [0, 1, 2].map(() => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.0, 48), new THREE.MeshBasicMaterial({ color: hdr('#9fd8ff', 1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
    m.visible = false
    vgG.add(m)
    return { m, t: 9 }
  })
  let launches = 0
  let age = 0
  let listenT = 0
  let beepT = 0
  let ringNext = 0
  let lastSep = 0
  const launch = () => {
    launches++
    age = 0
    lastSep = 0
    play('beam')
  }
  const launchMine = () => {
    launch()
    share('vanguard')
    later(FLIGHT + 0.5, () => say(at(E.vanguard.says.orbit, level())))
    return at(E.vanguard.says.launch, level())
  }
  const flyingNow = () => launches > 0 && age < FLIGHT
  const inOrbit = () => launches > 0 && age >= FLIGHT
  /** The rocket or its pad tapped: it lifts off (a new one, when one is already up). */
  const tapRocket = () => {
    if (flyingNow()) return say(at(W.busy, level()))
    say(launchMine())
    ex.discover('vanguard', vgPanel, 5.2)
  }
  /** Vanguard 1 tapped in orbit: its radio, loud for a while. */
  const tapSat = () => {
    if (!inOrbit()) return say(E.vanguard.tapRocket)
    listenT = 6
    beepT = 1.3
    say(at(E.vanguard.says.listen, level()))
    ex.discover('vanguard', vgPanel, 1.5)
  }
  const vgPanel = lv => ({
    title: E.vanguard.title,
    color,
    blocks: [
      ...paras(E.vanguard.panel[depth(lv)]),
      {
        buttons: [
          { label: E.vanguard.launch, onClick: tapRocket },
          { label: E.vanguard.listen, onClick: tapSat },
        ],
      },
    ],
  })
  const X3 = V(VP.x, 0, VP.z + 2.7)
  ex.add({
    id: 'vanguard',
    x: X3.x,
    z: X3.z,
    radius: 2.0,
    label: E.vanguard.label,
    verb: () => (inOrbit() ? E.vanguard.tapSat : E.vanguard.tapRocket),
    panel: vgPanel,
    focus: { x: VP.x, y: 3.2, z: VP.z - 0.8, size: 7.2 },
  })
  // the rocket on its pad (or the empty pad) launches; Vanguard 1 in orbit is listened to (a wider ball
  // round it to tap, as it is small up there)
  clickable(pad, tapRocket, { when: () => !flyingNow() })
  for (const st of [stage1, stage2, stage3]) clickable(st, tapRocket, { when: () => launches === 0 })
  clickable(sat, tapRocket, { when: () => launches === 0 })
  const satPick = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }))
  vgG.add(satPick)
  clickable(satPick, tapSat, { when: inOrbit, reach: 14 })
  const tmpV = V(0, 0, 0)
  const tmpT = V(0, 0, 0)
  const tmpQ = new THREE.Quaternion()
  const smokeObj = new THREE.Object3D()
  /** Everything of the launch follows from the time since it: the same on every screen. */
  const posed = { at: [], axis: [] }
  const SEP = [0.45, 0.8]
  updates.push((dt, t) => {
    earth.rotation.y += dt * 0.12
    if (launches > 0) age += dt
    const flying = launches > 0 && age < FLIGHT
    const up = launches > 0 && age >= FLIGHT
    // the rocket's nose along its path, the stages stacked under it
    let nose
    let axis
    let k = 0
    if (launches === 0 || age < 0.8) {
      nose = N0.clone()
      axis = UP.clone()
      if (launches > 0) nose.x += Math.sin(t * 70) * 0.008
    } else if (flying) {
      k = (age - 0.8) / (FLIGHT - 0.8)
      const s = k * k
      nose = bez(s, V(0, 0, 0))
      axis = bez(Math.min(1, s + 0.01), V(0, 0, 0)).sub(bez(Math.max(0, s - 0.01), tmpT)).normalize()
    }
    stages.forEach((st, i) => {
      const sepK = SEP[i] ?? 1
      const gone = launches > 0 && (up || k >= sepK)
      if (!gone && nose) {
        st.g.visible = true
        st.g.scale.setScalar(1)
        st.g.position.copy(nose).addScaledVector(axis, st.off - NOSE)
        st.g.quaternion.setFromUnitVectors(UP, axis)
        posed.at[i] = st.g.position.clone()
        posed.axis[i] = axis.clone()
      } else if (i === 2 && up) {
        // in orbit (below)
      } else if (i < 2 && launches > 0 && posed.at[i]) {
        // a spent stage falls away, turning, and is gone
        const since = age - (0.8 + sepK * (FLIGHT - 0.8))
        st.g.visible = since >= 0 && since < 1.6
        if (st.g.visible) {
          st.g.position.copy(posed.at[i]).addScaledVector(posed.axis[i], -0.4 * since).add(tmpV.set(0, -1.2 * since * since, 0))
          st.g.rotateX(dt * 1.5)
          st.g.scale.setScalar(Math.max(0.01, 1 - since / 1.6))
        }
        if (i + 1 > lastSep && since >= 0) {
          lastSep = i + 1
          play('pop')
        }
      } else st.g.visible = false
    })
    // in orbit: Vanguard 1 and its third stage go round, faster near the Earth (Kepler's second law)
    if (up) {
      const Mm = (TAU * (age - FLIGHT)) / PERIOD
      onOrbit(Mm, sat.position)
      sat.scale.setScalar(lerp(SAT_ON_ROCKET, 1, ease((age - FLIGHT) / 0.6)))
      sat.rotation.y += dt * 0.8
      sat.rotation.x += dt * 0.3
      stage3.visible = true
      stage3.scale.setScalar(1)
      onOrbit((TAU * (age - FLIGHT)) / (PERIOD * 1.05) - 0.18, stage3.position, 1.04)
      stage3.rotation.x += dt * 0.9
      stage3.rotation.z += dt * 0.5
    } else {
      sat.position.copy(nose ?? N0)
      sat.scale.setScalar(SAT_ON_ROCKET)
    }
    orbitMat.opacity = up ? 0.4 * clamp((age - FLIGHT) / 1.5) : 0
    satPick.position.copy(sat.position)
    // the flame and the smoke
    const burning = launches > 0 && age < FLIGHT
    flame.visible = burning
    if (burning && nose) {
      const live = [0, 1, 2].find(i => !(k >= (SEP[i] ?? 1))) ?? 2
      flame.position.copy(nose).addScaledVector(axis, stages[live].off - NOSE)
      flame.quaternion.setFromUnitVectors(UP, axis)
      flame.scale.set(1, clamp(age / 0.8, 0.2, 1) * (1 + Math.sin(t * 40) * 0.15), 1)
    }
    for (let i = 0; i < PUFFS; i++) {
      const born = 0.1 + i * 0.11
      const life = age - born
      if (launches === 0 || life < 0 || life > 2.8) {
        smokeObj.scale.setScalar(0.0001)
      } else {
        const s = Math.min(FLIGHT - 0.8, Math.max(0, born - 0.8)) / (FLIGHT - 0.8)
        const from = born < 0.8 ? N0.clone().add(tmpV.set(0, -NOSE, 0)) : bez(s * s, V(0, 0, 0)).addScaledVector(UP, -NOSE * 0.9)
        const a = i * 2.4
        smokeObj.position.copy(from).add(tmpV.set(Math.cos(a) * life * 0.5, Math.max(-from.y + 0.2, -life * 0.15), Math.sin(a) * life * 0.5))
        smokeObj.scale.setScalar((0.07 + life * 0.11) * clamp((2.8 - life) / 0.8))
      }
      smokeObj.updateMatrix()
      smoke.setMatrixAt(i, smokeObj.matrix)
    }
    smoke.instanceMatrix.needsUpdate = true
    // its radio: beeps and rings, loud after it reaches orbit, while listened to, or near the pad
    listenT = Math.max(0, listenT - dt)
    if (up && age > FLIGHT + 0.6) {
      beepT += dt
      if (beepT >= 1.3) {
        beepT = 0
        const r = rings[ringNext++ % rings.length]
        r.t = 0
        const pl = ctx.engine.player?.pos
        const near = pl && Math.hypot(pl.x - VP.x, pl.z - VP.z) < 7.5
        if (age - FLIGHT < 9 || listenT > 0 || near) play('beep')
      }
    }
    for (const r of rings) {
      r.t += dt
      r.m.visible = up && r.t < 1.2
      if (!r.m.visible) continue
      r.m.position.copy(sat.position)
      r.m.lookAt(ctx.camera.position)
      r.m.scale.setScalar(0.25 + r.t * 1.4)
      r.m.material.opacity = 0.8 * (1 - r.t / 1.2)
    }
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 11.0 },
    spawn: { x: 0, z: 7.4, yaw: 0 },
    hostSpot: { x: -2.3, z: 6.0, yaw: Math.atan2(-2.3, -1.4) },
    back: { x: 0, z: 11.6, rot: Math.PI },
    stand: { x: 5.6, z: 4.6, rot: Math.atan2(-5.6, 2.8) },
    panels: { panel: panelPanel, cell: cellPanel, vanguard: vgPanel },
    parts: {
      // for probes: a ray from the camera to a point (for __ew.world.onTap and pointAt, as a click casts)
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      sun: {
        cloudAt: () => cloud.position.clone(),
        sunAt: () => sunPick.position.clone(),
        get u() {
          return wrap2(sunU)
        },
        get target() {
          return wrap2(sunT)
        },
        get clock() {
          return clock(sunU)
        },
        get cloud() {
          return cloudOn
        },
        get light() {
          return lightNow
        },
        get power() {
          return powerNow
        },
      },
      cell: {
        lampAt: c => lampGroups[c].localToWorld(V(0, 3.18, 0)),
        get shots() {
          return shots
        },
        get freed() {
          return freed
        },
        get flying() {
          return runs.length
        },
      },
      vanguard: {
        rocketAt: () => stage1.position.clone().add(V(0, 0.9, 0)),
        padAt: () => V(VP.x + 0.6, 0.12, VP.z + 0.6),
        satAt: () => sat.position.clone(),
        get launches() {
          return launches
        },
        get age() {
          return age
        },
        get inOrbit() {
          return launches > 0 && age >= FLIGHT
        },
      },
    },
    shared: {
      sun: {
        get: () => ({ u: Math.round(wrap2(sunT) * 1000) / 1000, cloud: cloudOn }),
        set: (s, live) => {
          const u = wrap2(clamp(Number(s?.u) || 0, 0, 2))
          setCloud(!!s?.cloud, false)
          if (live) {
            // glide the short way round from where the sun is here
            const near = [u - 2, u, u + 2].reduce((a, b) => (Math.abs(b - sunU) < Math.abs(a - sunU) ? b : a))
            sunT = near
          } else {
            sunU = u
            sunT = u
            cloudK = cloudOn ? 1 : 0
          }
        },
      },
      cell: {
        get: () => ({ n: shots, c: lastColor, e: freed }),
        set: (s, live) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const e = clamp(Math.round(Number(s?.e) || 0), 0, n)
          const c = ORDER.includes(s?.c) ? s.c : 'red'
          if (live && n === shots + 1 && runs.length < 4) {
            startRun(c, shots)
            play('electron')
          }
          shots = n
          freed = e
          lastColor = c
        },
      },
      vanguard: {
        get: () => ({ n: launches, age: launches ? Math.round(age * 10) / 10 : 0 }),
        set: (s, live, ago) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const a = Math.max(0, Number(s?.age) || 0) + Math.max(0, Number(ago) || 0)
          if (n === 0) {
            launches = 0
            age = 0
            return
          }
          if (live && n > launches && a < 1.5) {
            launch()
            launches = n
            age = a
            return
          }
          launches = n
          age = a
          lastSep = 2
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const t of textures) t.dispose()
      for (const r of runs) endRun(r)
    },
  }
}
