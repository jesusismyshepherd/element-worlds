// Iron's picture "Can a magnet pull iron from cereal?" as a room (docs/knowledge/picture-rooms.md): the
// picture's breakfast table seen from the size of a mouse, everything twenty times its size (stages/table.js):
// the blue bowl of flakes is a pond, the cereal box a tower block, the glass of orange juice a tower, and the
// morning sun comes in through a window as big as the sky. Three things to do, each step chosen by tapping
// its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next
// tap, E opens the station's panel, whose buttons and slider do the same:
// - the magnet and the bowl: a red horseshoe magnet hangs on a thread from a spoon laid across a pepper mill
//   like a crane. Tap the flakes to crush them (whole, broken, crumbs, a mush), tap the magnet to stir it
//   through the milk: black specks leap up and cling to its poles, and a counter on the cereal box gives the
//   iron pulled out, in milligrams of the bowl's 4 mg. Whole flakes give up little, a mush much more (why the
//   real experiment says crush). Tap the box for a fresh bowl;
// - the stomach flask: tap the flask and the crane swings the magnet over its funnel, the funnel's edge
//   scrapes the specks off, they fall into the acid and fizz: hydrogen bubbles, the iron gone into the liquid
//   as Fe2+ (a pale green, made stronger to be seen). A pH slider: at pH 7 nothing, the lower the faster.
//   The picture's green lens beside it: tap it for each step, two H+ meet an iron atom, it gives each an
//   electron, H2 bubbles off and the Fe2+ swims away;
// - the gut's gate: six foods round a plate (steak, egg, wholemeal bread, a bowl of flakes, lentils,
//   spinach), each with its iron; tap them onto the plate, tap the plate (or the fork) to eat. Iron dots fly
//   to the gut's wall and only a few pass its gate (haem iron from the steak best, spinach's hardly). Tap the
//   orange juice to drink it with the meal (more plant iron passes), the tea (less). A board shows the day:
//   eaten, let in, and the loop behind the wall, about 20 to 25 mg a day taken back from old red cells.
// Not sodium's kitchen (acid on baking soda: carbon dioxide; here acid on iron metal: hydrogen), not carbon's
// body of jars, not oxygen's breath (no oxygen carried here). All shared in a room (src/net/shared.js); the
// words, panels and discoveries stay each one's. parts.<exhibit>.tap(...) does what a tap does, for probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill, num, screen, standingScreen } from '../../../wings/noble/kit.js'
import { tableStage, cm } from '../../stages/table.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { CEREAL_WORDS } from './cereal.words.js'

export const WORDS = CEREAL_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const now = () => performance.now() / 1000
const r3 = v => Math.round(v * 1000) / 1000

// ---- where things stand (metres; the spawn at z = 3.8 looks along -z, into the picture) ----
const BOWL = { x: 0, z: -3.4, r: cm(8.5), h: cm(7) }
const MILK_Y = 1.0
const BOX = { x: -0.4, z: -7.4, w: cm(20), h: cm(32), d: cm(7) }
// the chopping board to stand on in front of the bowl (4 cm thick: its top at 0.8 m), its sugar-cube stair
const CB = { x: 0, z: 0.15, w: 4.4, d: 3.1, h: cm(4) }
const MILL = { x: 2.6, z: -5.4, h: cm(23) }
const JIB_Y = MILL.h + 0.12
const R = Math.hypot(BOWL.x - MILL.x, BOWL.z - MILL.z)
const FLASK = { x: 2 * MILL.x - BOWL.x, z: BOWL.z, r: cm(4.2), cy: 1.0 }
const NECK = { r: 0.26, y0: 1.72, y1: 2.5 }
const FUNNEL = { top: 3.0, r: 0.52, low: 2.55 }
const FILL_Y = FLASK.cy + FLASK.r * 0.32
const LENS = { x: 7.4, y: 2.2, z: -2.7, r: 1.0 }
const PH_SIGN = { x: 3.55, z: -2.5 }
const PLATE = { x: -6.6, z: -3.2, r: cm(12) }
const WALL_Z = -6.6
const LOOP = { x: -8.4, y: 2.95, z: -7.7, r: 1.0 }
const BOARD = { x: -4.75, y: 2.7, z: -7.5 }
const OJ = { x: -10.1, z: -5.5 }
const TEA = { x: -3.2, z: -5.6 }
// the crane's angles: over the bowl and over the flask
const A_BOWL = Math.atan2(BOWL.z - MILL.z, BOWL.x - MILL.x)
// at rest the crane parks the magnet beside the bowl, so it hides neither the milk nor the counter
const A_REST = A_BOWL - 0.62
const A_FLASK = Math.atan2(FLASK.z - MILL.z, FLASK.x - MILL.x)
// the magnet: its top on the thread, its poles MH below; poles' bottoms at rest, dipped, over the funnel
const MH = 1.3
const REST = JIB_Y - (2.05 + MH)
const DIP = JIB_Y - (0.93 + MH)
const HIGH = JIB_Y - (3.25 + MH)
const SCRAPE = JIB_Y - (3.04 + MH)

// ---- the model's numbers (the words say they are a model) ----
const SERVING = 4.0 // mg of iron added to the bowl's 30 g of flakes
const FREE = [0.1, 0.35, 0.6, 0.8] // the share a magnet can reach: whole, broken, crumbs, a mush
const CATCH = 0.55 // the share of what it can reach that one stir catches
/** How fast the specks dissolve (per second, sped up a lot) at a pH: ten times the acid, about three times
 *  faster; nothing at 7. */
const rateAt = pH => (pH >= 7 ? 0 : 0.16 * Math.pow(10, -(pH - 1) / 2) * Math.min(1, (7 - pH) / 1.5))
// absorption: haem about 25%, non-haem about 8% (NIH: 15 to 35%, 2 to 20%); vitamin C about x2.5, tea x0.4
const HAEM = 0.25
const PLANT = 0.08
const WITH_OJ = 2.5
const WITH_TEA = 0.4
// the foods (mg of iron a portion, how much of it is haem, how much its own make-up lets through), on the
// table at either side of the plate (an angle round it: 90 is toward the visitor), and the same way on it
const FOODS = [
  { id: 'steak', mg: 2.5, haem: 1.0, k: 1, arc: 120 },
  { id: 'egg', mg: 0.9, haem: 0, k: 0.6, arc: 155 },
  { id: 'bread', mg: 0.8, haem: 0, k: 0.6, arc: 190 },
  { id: 'cereal', mg: 4.0, haem: 0, k: 1, arc: 60 },
  { id: 'lentils', mg: 3.3, haem: 0, k: 1, arc: 25 },
  { id: 'spinach', mg: 3.6, haem: 0, k: 0.3, arc: -10 },
]
const absorbedOf = (f, oj, tea) => f.haem * HAEM + (f.mg - f.haem) * PLANT * f.k * (oj ? WITH_OJ : 1) * (tea ? WITH_TEA : 1)

const label = (text, size, color = '#ffffff', opts = {}) => makeText(text, { size, color, outlineWidth: size * 0.14, outlineColor: '#10161f', ...opts })

/** A symbol with its charge raised beside it (formulaText would take "Fe2+"'s 2 for a subscript). */
function ion(sym, charge, size, color) {
  const g = new THREE.Group()
  const a = makeText(sym, { size, color, anchorX: 'right', outlineWidth: size * 0.12, outlineColor: '#0b0f24' })
  g.add(a)
  if (charge) {
    const q = makeText(charge, { size: size * 0.62, color, anchorX: 'left', outlineWidth: size * 0.08, outlineColor: '#0b0f24' })
    q.position.set(size * 0.05, size * 0.36, 0)
    g.add(q)
  }
  return g
}

/** A soft round glow. */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A cornflake: a thin curled disc with a ragged edge, toasted darker toward it (radius 1). */
function flakeGeometry() {
  const SEG = 16
  const RINGS = 3
  const inner = new THREE.Color('#e2ae58')
  const outer = new THREE.Color('#a85f26')
  const pos = [0, 0, 0]
  const col = [inner.r, inner.g, inner.b]
  const curl = (x, z) => 0.32 * x * x - 0.12 * z * z + 0.05 * Math.sin(3 * x + 2 * z)
  for (let r = 1; r <= RINGS; r++) {
    for (let i = 0; i < SEG; i++) {
      const a = (i / SEG) * TAU
      const edge = 1 + 0.16 * Math.sin(3 * a + 0.7) + 0.09 * Math.sin(5 * a + 2.1) + 0.05 * Math.sin(9 * a + 1)
      const rr = (r / RINGS) * edge
      const x = Math.cos(a) * rr
      const z = Math.sin(a) * rr
      pos.push(x, curl(x, z), z)
      const c = inner.clone().lerp(outer, Math.pow(r / RINGS, 2.2))
      col.push(c.r, c.g, c.b)
    }
  }
  const idx = []
  for (let i = 0; i < SEG; i++) idx.push(0, 1 + i, 1 + ((i + 1) % SEG))
  for (let r = 1; r < RINGS; r++) {
    const a0 = 1 + (r - 1) * SEG
    const a1 = 1 + r * SEG
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG
      idx.push(a0 + i, a1 + i, a0 + j, a0 + j, a1 + i, a1 + j)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/** A lumpy little ball (a speck of iron powder, a lentil when squashed). */
function lumpGeometry(seed = 1, detail = 0) {
  const g = new THREE.IcosahedronGeometry(1, detail)
  const p = g.attributes.position
  const rnd = random(seed)
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).multiplyScalar(0.8 + rnd() * 0.4)
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, light, level, color, lang, clickable }) {
  const stage = tableStage({
    light,
    clear: [[BOWL.x, BOWL.z, 2.3], [PLATE.x, PLATE.z, 2.8], [FLASK.x, FLASK.z, 1.4], [MILL.x, MILL.z, 0.9], [BOX.x, BOX.z, 2.6]],
  })
  root.add(stage.group)
  const P = stage.props
  const M = stage.mats
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const n1 = v => num(v, 1, lang)
  const n2 = v => num(v, 2, lang)
  const glow = softTex()
  textures.push(glow)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const dummy = new THREE.Object3D()
  const tmp = new THREE.Vector3()
  const flakeGeo = flakeGeometry()
  const flakeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.68, side: THREE.DoubleSide })
  const ironMat = new THREE.MeshStandardMaterial({ color: '#2b2b30', roughness: 0.45, metalness: 0.7, envMap: M.steel.envMap, envMapIntensity: 0.6 })
  const speckGeo = lumpGeometry(5)

  // ======== 1. the magnet and the bowl ========
  const bowl = P.bowl({ r: BOWL.r, h: BOWL.h })
  bowl.group.position.set(BOWL.x, 0, BOWL.z)
  root.add(bowl.group)
  solids.push(circle(BOWL.x, BOWL.z, BOWL.r + 0.05))
  const MILK_R = bowl.innerR(MILK_Y)
  // a chopping board in front of the bowl, with a stair of sugar cubes: from up there a mouse sees into the
  // bowl (the station view keeps to a child's eye height, and the rim is as high as that)
  {
    const grain = canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#b98a58'
      g.fillRect(0, 0, w, h)
      const rnd = random(14)
      for (let i = 0; i < 40; i++) {
        const y = rnd() * h
        g.strokeStyle = rnd() < 0.5 ? 'rgba(90,50,20,0.18)' : 'rgba(255,230,190,0.12)'
        g.lineWidth = 1 + rnd() * 2
        g.beginPath()
        g.moveTo(0, y)
        g.bezierCurveTo(w / 3, y + (rnd() - 0.5) * 10, (2 * w) / 3, y + (rnd() - 0.5) * 10, w, y)
        g.stroke()
      }
      // knife marks
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = 'rgba(70,40,18,0.22)'
        g.lineWidth = 1.5
        const x = rnd() * w
        const y = rnd() * h
        const a = rnd() * Math.PI
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30)
        g.stroke()
      }
    })
    textures.push(grain)
    const cb = new THREE.Mesh(new RoundedBoxGeometry(CB.w, CB.h, CB.d, 3, 0.12), [
      new THREE.MeshStandardMaterial({ color: '#a8784a', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: '#a8784a', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ map: grain, roughness: 0.65 }),
      new THREE.MeshStandardMaterial({ color: '#a8784a', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: '#a8784a', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: '#a8784a', roughness: 0.7 }),
    ])
    cb.position.set(CB.x, CB.h / 2, CB.z)
    cb.castShadow = !light
    cb.receiveShadow = !light
    root.add(cb)
    solids.push(box(CB.x, CB.z, CB.w, CB.d, { y1: CB.h }))
    // the stair: a row of single cubes, then a row of two
    const sugarMat = new THREE.MeshStandardMaterial({ color: '#d6d3cb', roughness: 0.95 })
    const cube = new RoundedBoxGeometry(0.3, 0.3, 0.3, 2, 0.035)
    const front = CB.z + CB.d / 2
    for (let i = 0; i < 6; i++) {
      const x = CB.x + (i - 2.5) * 0.31
      for (const [z, n] of [[front + 0.15, 2], [front + 0.45, 1]]) {
        for (let k = 0; k < n; k++) {
          const c = new THREE.Mesh(cube, sugarMat)
          c.position.set(x + (Math.sin(i * 7 + k) * 0.015), 0.15 + k * 0.3, z)
          c.rotation.y = Math.sin(i * 3 + k * 5) * 0.06
          c.castShadow = !light
          c.receiveShadow = !light
          root.add(c)
        }
      }
    }
    solids.push(box(CB.x, front + 0.15, 1.9, 0.3, { y1: 0.6 }), box(CB.x, front + 0.45, 1.9, 0.3, { y1: 0.3 }))
  }
  const milkColors = ['#d9cfbb', '#d2c1a0', '#c4aa82', '#b3946a'].map(c => new THREE.Color(c))
  const milkMat = new THREE.MeshStandardMaterial({ color: milkColors[0].clone(), roughness: 0.32 })
  const milk = new THREE.Mesh(new THREE.CircleGeometry(MILK_R, 64).rotateX(-Math.PI / 2), milkMat)
  milk.position.set(BOWL.x, MILK_Y, BOWL.z)
  milk.receiveShadow = !light
  root.add(milk)
  // something to tap: the flakes are many and thin, so a disc over the milk takes the taps
  const flakeHit = new THREE.Mesh(new THREE.CylinderGeometry(MILK_R, MILK_R, 0.5, 32), ghost)
  flakeHit.position.set(BOWL.x, MILK_Y + 0.2, BOWL.z)
  root.add(flakeHit)
  const LEVELS = [
    { n: 34, s: [0.3, 0.38], heap: 0.32 },
    { n: 72, s: [0.19, 0.25], heap: 0.22 },
    { n: 150, s: [0.1, 0.14], heap: 0.12 },
    { n: light ? 160 : 240, s: [0.045, 0.075], heap: 0.04 },
  ]
  const MAXF = Math.max(...LEVELS.map(l => l.n))
  const flakes = new THREE.InstancedMesh(flakeGeo, flakeMat, MAXF)
  flakes.castShadow = !light
  flakes.frustumCulled = false
  root.add(flakes)
  const flakeBase = []
  function layFlakes(lvl, seed) {
    const L = LEVELS[lvl]
    const rnd = random(1 + seed * 97 + lvl * 13)
    flakeBase.length = 0
    for (let i = 0; i < L.n; i++) {
      const s = L.s[0] + rnd() * (L.s[1] - L.s[0])
      const rr = Math.sqrt(rnd()) * (MILK_R - s * 0.9)
      const a = rnd() * TAU
      const y = MILK_Y + 0.02 + L.heap * Math.max(0, 1 - rr / MILK_R) * (0.4 + rnd() * 0.8)
      flakeBase.push({ x: BOWL.x + Math.cos(a) * rr, y, z: BOWL.z + Math.sin(a) * rr, rx: (rnd() - 0.5) * 1.1, ry: rnd() * TAU, rz: (rnd() - 0.5) * 1.1, s, sy: s * (0.8 + rnd() * 0.4), tone: 0.82 + rnd() * 0.3 })
    }
    flakes.count = L.n
    flakeBase.forEach((f, i) => flakes.setColorAt(i, new THREE.Color().setScalar(f.tone)))
    if (flakes.instanceColor) flakes.instanceColor.needsUpdate = true
    poseFlakes(0)
  }
  function poseFlakes(jump) {
    flakeBase.forEach((f, i) => {
      dummy.position.set(f.x, f.y + jump * (0.3 + (i % 5) * 0.06), f.z)
      dummy.rotation.set(f.rx + jump * 0.8, f.ry, f.rz)
      dummy.scale.set(f.s, f.sy, f.s)
      dummy.updateMatrix()
      flakes.setMatrixAt(i, dummy.matrix)
    })
    flakes.instanceMatrix.needsUpdate = true
  }

  // the cereal box behind the bowl, a tower block with the counter on its front
  const box3 = P.box({
    ...BOX,
    front: (g, w, h) => drawBoxFront(g, w, h, E.bowl.box),
    side: (g, w, h) => drawBoxSide(g, w, h, E.bowl.box, n1(SERVING)),
  })
  box3.group.position.set(BOX.x, 0, BOX.z)
  root.add(box3.group)
  solids.push(box(BOX.x, BOX.z, BOX.w + 0.1, BOX.d + 0.1))
  const counter = screen({ width: 2.9, height: 1.25, color, title: E.bowl.signs.caught, line: '', titleSize: 0.17, lineSize: 0.2 })
  counter.group.position.set(BOX.x, 4.35, BOX.z + BOX.d / 2 + 0.06)
  root.add(counter.group)
  const barBack = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.16), new THREE.MeshBasicMaterial({ color: '#1d2756' }))
  barBack.position.set(0, -0.42, 0.01)
  const barFill = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.16).translate(0.5, 0, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.3), toneMapped: false }))
  barFill.position.set(-1.25, -0.42, 0.02)
  counter.content.add(barBack, barFill)

  // the crane: a pepper mill, a long spoon turning on its top, a sugar cube at the handle's end, a thread
  {
    const pts = [[0, 0], [0.55, 0], [0.56, 0.12], [0.5, 0.3], [0.42, 0.9], [0.4, 1.6], [0.47, 2.6], [0.5, 3.3], [0.47, 3.75], [0.5, 3.85], [0.48, 4.05], [0.36, 4.25], [0.2, 4.4], [0.22, 4.5], [0.12, MILL.h], [0, MILL.h]]
    const mill = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 40), new THREE.MeshStandardMaterial({ color: '#5c3a22', roughness: 0.38 }))
    mill.position.set(MILL.x, 0, MILL.z)
    mill.castShadow = !light
    mill.receiveShadow = !light
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.035, 8, 40), M.steel)
    ring.rotation.x = Math.PI / 2
    ring.position.set(MILL.x, 3.8, MILL.z)
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12), M.steel)
    pin.position.set(MILL.x, MILL.h + 0.06, MILL.z)
    root.add(mill, ring, pin)
    solids.push(circle(MILL.x, MILL.z, 0.6))
  }
  const jib = new THREE.Group()
  jib.position.set(MILL.x, JIB_Y, MILL.z)
  root.add(jib)
  const spoon = P.spoon({ length: cm(23) })
  spoon.group.position.x = R
  jib.add(spoon.group)
  const sugar = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.32, 0.32, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#d9d6cf', roughness: 0.95 }))
  sugar.position.set(R - spoon.length + spoon.bowlLength * 0.62, 0.2, 0)
  sugar.castShadow = !light
  jib.add(sugar)
  const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1, 6).translate(0, -0.5, 0), new THREE.MeshStandardMaterial({ color: '#e0d6c2', roughness: 0.9 }))
  root.add(thread)

  // the magnet: a red horseshoe with silver poles, as the picture's; specks of iron grow on its poles
  const magnet = new THREE.Group()
  root.add(magnet)
  const LEG = { x: 0.42, w: 0.36, d: 0.3 }
  const TIP_H = 0.3
  {
    const sh = new THREE.Shape()
    const ro = LEG.x + LEG.w / 2
    const ri = LEG.x - LEG.w / 2
    const cy = -ro
    const leg0 = -MH + TIP_H
    sh.moveTo(ro, leg0)
    sh.lineTo(ro, cy)
    sh.absarc(0, cy, ro, 0, Math.PI, false)
    sh.lineTo(-ro, leg0)
    sh.lineTo(-ri, leg0)
    sh.lineTo(-ri, cy)
    sh.absarc(0, cy, ri, Math.PI, 0, true)
    sh.lineTo(ri, leg0)
    sh.closePath()
    const geo = new THREE.ExtrudeGeometry(sh, { depth: LEG.d, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 })
    geo.translate(0, 0, -LEG.d / 2)
    const red = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#d8282c', roughness: 0.32, metalness: 0.1 }))
    red.castShadow = !light
    magnet.add(red)
    for (const s of [-1, 1]) {
      const tip = new THREE.Mesh(new RoundedBoxGeometry(LEG.w + 0.06, TIP_H, LEG.d + 0.06, 2, 0.03), M.steel)
      tip.position.set(s * LEG.x, -MH + TIP_H / 2, 0)
      tip.castShadow = !light
      magnet.add(tip)
    }
    // the hook the thread is tied to
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 6, 16), M.steel)
    eye.position.y = 0.02
    magnet.add(eye)
  }
  const magnetHit = new THREE.Mesh(new THREE.BoxGeometry(1.5, MH + 0.4, 0.7), ghost)
  magnetHit.position.y = -MH / 2 - 0.05
  magnet.add(magnetHit)
  // the specks on the poles: little chains standing out of the faces, filled in as the load grows
  const MAXS = light ? 260 : 420
  const specks = new THREE.InstancedMesh(speckGeo, ironMat, MAXS)
  specks.count = 0
  specks.frustumCulled = false
  specks.raycast = () => {}
  magnet.add(specks)
  const speckSpots = []
  {
    const rnd = random(77)
    const base = []
    const chains = Math.ceil(MAXS / 2.4)
    for (let c = 0; c < chains; c++) {
      const s = rnd() < 0.5 ? -1 : 1
      const face = rnd()
      let p
      let n
      const u = rnd() - 0.5
      const v = rnd() - 0.5
      // the field is strongest at the pole's bottom edges: more specks there
      const edge = k => Math.sign(k) * Math.pow(Math.abs(k) * 2, 0.45) * 0.5
      if (face < 0.6) {
        p = new THREE.Vector3(s * LEG.x + edge(u) * (LEG.w + 0.06), -MH, edge(v) * (LEG.d + 0.06))
        n = new THREE.Vector3(0, -1, 0)
      } else {
        const which = Math.floor(rnd() * 4)
        const y = -MH + Math.pow(rnd(), 1.8) * TIP_H * 0.9
        if (which < 2) {
          p = new THREE.Vector3(s * LEG.x + (which ? 1 : -1) * (LEG.w / 2 + 0.03), y, u * LEG.d)
          n = new THREE.Vector3(which ? 1 : -1, 0, 0)
        } else {
          p = new THREE.Vector3(s * LEG.x + u * LEG.w, y, (which === 3 ? 1 : -1) * (LEG.d / 2 + 0.03))
          n = new THREE.Vector3(0, 0, which === 3 ? 1 : -1)
        }
      }
      const len = 1 + Math.floor(rnd() * 4)
      base.push({ p, n, len, size: 0.022 + rnd() * 0.02, seed: rnd() })
    }
    for (let k = 0; k < 4 && speckSpots.length < MAXS; k++) {
      for (const b of base) {
        if (k >= b.len || speckSpots.length >= MAXS) continue
        const step = b.size * 1.5
        const q = b.p.clone().addScaledVector(b.n, b.size * 0.6 + k * step)
        q.x += (b.seed - 0.5) * 0.02 * k
        speckSpots.push({ p: q, s: b.size * (1 - k * 0.12), r: b.seed * TAU + k })
      }
    }
  }
  let specksShown = -1
  function showSpecks(n) {
    n = clamp(Math.round(n), 0, speckSpots.length)
    if (n === specksShown) return
    specksShown = n
    for (let i = 0; i < n; i++) {
      const s = speckSpots[i]
      dummy.position.copy(s.p)
      dummy.rotation.set(s.r, s.r * 1.7, s.r * 0.3)
      dummy.scale.setScalar(s.s)
      dummy.updateMatrix()
      specks.setMatrixAt(i, dummy.matrix)
    }
    specks.count = n
    specks.instanceMatrix.needsUpdate = true
  }
  const specksFor = mg => (mg <= 0 ? 0 : Math.max(6, speckSpots.length * (1 - Math.exp(-mg / 1.1))))

  // specks in flight: up from the milk to the poles, or down from the poles into the funnel
  const FLY = light ? 40 : 70
  const flyers = new THREE.InstancedMesh(speckGeo, ironMat, FLY)
  flyers.count = 0
  flyers.frustumCulled = false
  flyers.raycast = () => {}
  root.add(flyers)
  const flights = []

  // the crane's state, and the bowl's
  const crane = { a: A_REST, drop: REST }
  const B = { crush: 0, caught: 0, load: 0, sweeps: 0, drops: 0, fresh: 0 }
  let anim = null // { kind: 'sweep' | 'drop', t, from, to, mine, got }
  let crushJump = 0
  let shownLoad = 0 // what the specks show (it trails the load while they fly)
  const tipAt = (a, out = new THREE.Vector3()) => out.set(MILL.x + Math.cos(a) * R, JIB_Y, MILL.z + Math.sin(a) * R)
  function poseCrane() {
    jib.rotation.y = -crane.a
    const tip = tipAt(crane.a, tmp)
    magnet.position.set(tip.x, JIB_Y - crane.drop, tip.z)
    thread.position.set(tip.x, JIB_Y - 0.02, tip.z)
    thread.scale.y = Math.max(0.01, crane.drop - 0.04)
  }
  const poleWorld = (i, out = new THREE.Vector3()) => out.copy(speckSpots[i % speckSpots.length].p).applyMatrix4(magnet.matrixWorld)
  const remaining = () => Math.max(0, SERVING * FREE[B.crush] - B.caught)
  const busyBowl = () => !!anim
  function updateCounter(mg = B.caught) {
    counter.set({ line: fill(E.bowl.signs.of, { mg: n2(mg), total: n1(SERVING) }) })
    barFill.scale.x = Math.max(0.001, 2.5 * clamp(mg / SERVING))
  }

  const bowlPanel = lv => ({
    title: E.bowl.title,
    color,
    blocks: [
      { rows: [[E.bowl.signs.caught, fill(E.bowl.signs.of, { mg: n2(B.caught), total: n1(SERVING) })]] },
      {
        buttons: [
          { label: E.bowl.buttons.crush, onClick: () => bowlStep('crush') },
          { label: E.bowl.buttons.sweep, onClick: () => bowlStep('sweep') },
          { label: E.bowl.buttons.fresh, onClick: () => bowlStep('fresh') },
        ],
      },
      ...E.bowl.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  function startSweep(mine, got) {
    anim = { kind: 'sweep', t: 0, mine, got, from: B.load - got }
    play('select')
  }
  function startDrop(mine, load) {
    anim = { kind: 'drop', t: 0, mine, load }
    play('select')
  }
  // a visitor's step: a tap on the flakes (crush), the magnet (stir), the box (a fresh bowl), the flask (drop)
  function bowlStep(what) {
    const lv = level()
    if (what === 'crush') {
      if (B.crush >= 3) return say(at(E.bowl.says.mush, lv))
      B.crush++
      layFlakes(B.crush, B.fresh)
      milkMat.color.copy(milkColors[B.crush])
      crushJump = 1
      play('crack')
      say(at(E.bowl.says.crush[B.crush - 1], lv))
      share('bowl')
      return
    }
    if (what === 'sweep') {
      if (busyBowl()) return say(at(W.busy, lv))
      const got = Math.round(remaining() * CATCH * 100) / 100
      B.caught = r3(B.caught + got)
      B.load = r3(B.load + got)
      B.sweeps++
      startSweep(true, got)
      share('bowl')
      return
    }
    if (what === 'fresh') {
      if (busyBowl()) return say(at(W.busy, lv))
      B.fresh++
      B.crush = 0
      B.caught = 0
      layFlakes(0, B.fresh)
      milkMat.color.copy(milkColors[0])
      crushJump = 1
      play('pop')
      updateCounter()
      say(at(E.bowl.says.fresh, lv))
      share('bowl')
      return
    }
    if (what === 'drop') {
      if (busyBowl()) return say(at(W.busy, lv))
      if (B.load <= 0) return say(at(E.flask.says.empty, lv))
      const load = B.load
      B.load = 0
      B.drops++
      flaskAdd(load)
      startDrop(true, load)
      share('bowl')
      share('flask')
    }
  }
  clickable(flakeHit, () => bowlStep('crush'), { reach: 5, when: () => !busyBowl() })
  clickable(magnet, () => bowlStep('sweep'), { reach: 6, when: () => !busyBowl() })
  clickable(box3.group, () => bowlStep('fresh'), { reach: 9, when: () => !busyBowl() })
  clickable(counter.group, () => bowlStep('fresh'), { reach: 9, when: () => !busyBowl() })
  ex.add({
    id: 'bowl',
    x: BOWL.x,
    z: -0.5,
    radius: 2.0,
    manual: true,
    label: E.bowl.label,
    verb: () => {
      if (anim) return E.bowl.hints.busy
      if (!B.sweeps && !B.crush) return E.bowl.hints.crush
      if (B.load > 0 && !B.drops) return E.bowl.hints.flask
      if (remaining() < 0.08) return B.crush < 3 ? E.bowl.hints.more : E.bowl.hints.fresh
      if (B.crush < 3 && B.sweeps) return E.bowl.hints.more
      return E.bowl.hints.sweep
    },
    focus: { x: BOWL.x - 0.25, y: 1.75, z: BOWL.z - 1.3, size: 3.3, width: 4.4 },
    screens: [counter],
    act: () => ctx.showPanel(bowlPanel),
  })

  // the bowl's animation: the stir (down, round, up) and the drop (up, over, scrape, back)
  updates.push((dt, t) => {
    if (crushJump > 0) {
      crushJump = Math.max(0, crushJump - dt / 0.45)
      poseFlakes(Math.sin((1 - crushJump) * Math.PI) * 0.6 * crushJump)
    }
    if (anim?.kind === 'sweep') {
      anim.t += dt
      const k = anim.t
      // over the bowl, down into the mush, round and round, up, and back to its place beside the bowl
      const over = span(0, 0.7, k) - span(4.4, 5.1, k)
      const stir = k > 1.5 && k < 3.6 ? Math.sin(span(1.5, 3.6, k) * TAU * 1.5) * 0.14 : 0
      crane.a = lerp(A_REST, A_BOWL, over) + stir
      crane.drop = lerp(REST, DIP, span(0.7, 1.5, k)) - (DIP - REST) * span(3.6, 4.4, k)
      // the specks leap up while the poles are in the mush
      if (k > 1.5 && k < 3.5 && anim.got > 0) {
        const want = Math.ceil((anim.got / 0.04) * dt * 2)
        for (let i = 0; i < want && flights.length < FLY; i++) {
          const target = Math.floor(Math.random() * Math.max(1, specksFor(B.load)))
          const from = magnet.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 1.4))
          from.y = MILK_Y + 0.01
          flights.push({ kind: 'up', t: 0, dur: 0.35 + Math.random() * 0.2, from, target })
        }
        shownLoad = lerp(anim.from, B.load, span(1.5, 3.5, k))
      }
      if (k >= 5.1) {
        const mine = anim.mine
        const got = anim.got
        anim = null
        crane.a = A_REST
        crane.drop = REST
        shownLoad = B.load
        updateCounter()
        if (ctx.store.get().panel?.title === E.bowl.title) ctx.showPanel(bowlPanel)
        if (mine) {
          const lv = level()
          const line = got < 0.05 ? (B.crush < 3 ? E.bowl.says.little : E.bowl.says.empty) : E.bowl.says.sweep
          say(fill(at(line, lv), { got: n2(got), mg: n2(B.caught) }))
          if (got >= 0.05) ex.discover('bowl', bowlPanel, 1.2)
        }
      }
      // the counter climbs as the specks land
      if (anim && k > 1.5) updateCounter(B.caught - (B.load - shownLoad))
    } else if (anim?.kind === 'drop') {
      anim.t += dt
      const k = anim.t
      // up, over to the flask, down onto the funnel's rim and across it, up, back to its place
      const up = span(0, 0.5, k) - span(4.5, 5.1, k)
      const over = span(0.4, 1.8, k) - span(3.4, 4.8, k)
      const scrape = span(1.8, 2.2, k) - span(3.1, 3.4, k)
      crane.drop = lerp(REST, HIGH, up) + (SCRAPE - HIGH) * scrape
      crane.a = lerp(A_REST, A_FLASK, over) + 0.07 * Math.sin(span(2.2, 3.1, k) * Math.PI)
      if (k > 2.15 && k < 3.1) {
        shownLoad = anim.load * (1 - span(2.15, 3.1, k))
        const want = Math.ceil(anim.load * 30 * dt)
        for (let i = 0; i < want && flights.length < FLY; i++) {
          const from = poleWorld(Math.floor(Math.random() * Math.max(1, specksShown)), new THREE.Vector3())
          flights.push({ kind: 'down', t: 0, dur: 1.1 + Math.random() * 0.3, from, slot: Math.floor(Math.random() * HEAP) })
        }
      }
      if (k > 3.1) shownLoad = 0
      // the first specks reach the acid: it fizzes
      if (k > 3.3 && !anim.said) {
        anim.said = true
        if (anim.mine) {
          say(at(E.flask.says.drop, level()))
          ex.discover('flask', flaskPanel, 2.6)
        }
      }
      if (k >= 5.1) {
        anim = null
        crane.a = A_REST
        crane.drop = REST
        shownLoad = B.load
      }
    }
    poseCrane()
    magnet.updateMatrixWorld()
    showSpecks(specksFor(shownLoad))
    // the flights
    let n = 0
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]
      f.t += dt / f.dur
      if (f.t >= 1) {
        flights.splice(i, 1)
        continue
      }
    }
    for (const f of flights) {
      if (f.kind === 'up') {
        const to = poleWorld(f.target, tmp)
        const k = ease(f.t)
        dummy.position.lerpVectors(f.from, to, k)
        dummy.position.y += Math.sin(f.t * Math.PI) * 0.15
      } else {
        // off the pole, into the funnel, down the neck, onto the heap at the bottom
        const heap = heapSpots[f.slot]
        const k = f.t
        if (k < 0.3) {
          const q = k / 0.3
          dummy.position.set(lerp(f.from.x, FLASK.x + (f.from.x - FLASK.x) * 0.5, q), f.from.y - q * q * (f.from.y - FUNNEL.top + 0.15), lerp(f.from.z, FLASK.z + (f.from.z - FLASK.z) * 0.5, q))
        } else if (k < 0.55) {
          const q = (k - 0.3) / 0.25
          dummy.position.set(lerp(FLASK.x + (f.from.x - FLASK.x) * 0.5, FLASK.x, q), lerp(FUNNEL.top - 0.15, FUNNEL.low, q), lerp(FLASK.z + (f.from.z - FLASK.z) * 0.5, FLASK.z, q))
        } else {
          const q = (k - 0.55) / 0.45
          dummy.position.set(lerp(FLASK.x, heap.x, q), lerp(FUNNEL.low, heap.y, q * q), lerp(FLASK.z, heap.z, q))
        }
      }
      dummy.rotation.set(f.t * 9, f.t * 7, 0)
      dummy.scale.setScalar(0.03)
      dummy.updateMatrix()
      flyers.setMatrixAt(n++, dummy.matrix)
    }
    flyers.count = n
    flyers.instanceMatrix.needsUpdate = true
  })
  const bowlState = () => ({ crush: B.crush, caught: B.caught, load: B.load, sweeps: B.sweeps, drops: B.drops, fresh: B.fresh })
  function bowlSet(s, live) {
    if (!s) return
    const crush = clamp(Math.round(Number(s.crush) || 0), 0, 3)
    const fresh = Math.max(0, Math.round(Number(s.fresh) || 0))
    const sweeps = Math.max(0, Math.round(Number(s.sweeps) || 0))
    const drops = Math.max(0, Math.round(Number(s.drops) || 0))
    const caught = clamp(Number(s.caught) || 0, 0, SERVING)
    const load = clamp(Number(s.load) || 0, 0, SERVING * 4)
    const newFlakes = crush !== B.crush || fresh !== B.fresh
    const swept = live && sweeps > B.sweeps && load > B.load
    const dropped = live && drops > B.drops && B.load > 0
    const was = B.load
    Object.assign(B, { crush, fresh, sweeps, drops, caught, load })
    if (newFlakes) {
      layFlakes(B.crush, B.fresh)
      milkMat.color.copy(milkColors[B.crush])
      if (live) {
        crushJump = 1
        play('crack')
      }
    }
    if (swept && !anim) startSweep(false, load - was)
    else if (dropped && !anim) startDrop(false, was)
    else if (!live) {
      anim = null
      crane.a = A_REST
      crane.drop = REST
      shownLoad = B.load
      flights.length = 0
    }
    if (!anim) shownLoad = B.load
    updateCounter()
  }

  // ======== 2. the stomach flask and the lens ========
  // a cork ring, a round flask, its acid, a funnel in its neck
  {
    const cork = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.12, 10, 32), new THREE.MeshStandardMaterial({ color: '#a77a4c', roughness: 0.95 }))
    cork.rotation.x = Math.PI / 2
    cork.position.set(FLASK.x, 0.12, FLASK.z)
    cork.castShadow = !light
    root.add(cork)
  }
  const flaskGroup = new THREE.Group()
  flaskGroup.position.set(FLASK.x, 0, FLASK.z)
  root.add(flaskGroup)
  const glassMat = new THREE.MeshStandardMaterial({ color: '#e6f4f6', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.2, depthWrite: false })
  const glassBack = glassMat.clone()
  glassBack.side = THREE.BackSide
  glassBack.opacity = 0.12
  {
    const fr = FLASK.r
    // the bulb and the neck as one turned shape
    const pts = []
    const a0 = Math.asin(NECK.r / fr)
    for (let i = 0; i <= 28; i++) {
      const a = Math.PI - (Math.PI - a0) * (i / 28)
      pts.push([Math.max(0.001, fr * Math.sin(a)), FLASK.cy - fr * Math.cos(a)])
    }
    pts.push([NECK.r, NECK.y1], [NECK.r + 0.05, NECK.y1 + 0.02], [NECK.r + 0.05, NECK.y1 + 0.06])
    const geo = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 48)
    const back = new THREE.Mesh(geo, glassBack)
    back.renderOrder = 2
    const front = new THREE.Mesh(geo, glassMat)
    front.renderOrder = 4
    flaskGroup.add(back, front)
    // the funnel: a glass cone and its stem down the neck
    const fpts = [[0.06, FUNNEL.low - 0.45], [0.07, FUNNEL.low], [FUNNEL.r * 0.3, FUNNEL.low + 0.12], [FUNNEL.r, FUNNEL.top], [FUNNEL.r + 0.03, FUNNEL.top + 0.01]]
    const fgeo = new THREE.LatheGeometry(fpts.map(([x, y]) => new THREE.Vector2(x, y)), 40)
    const funnel = new THREE.Mesh(fgeo, glassMat.clone())
    funnel.material.side = THREE.DoubleSide
    funnel.material.opacity = 0.26
    funnel.renderOrder = 4
    flaskGroup.add(funnel)
  }
  // the acid: the bulb's lower part, and its surface
  const acidMat = new THREE.MeshStandardMaterial({ color: '#9fcbe0', roughness: 0.08, transparent: true, opacity: 0.34, depthWrite: false })
  const acidTop = new THREE.Color('#9fcbe0')
  const acidGreen = new THREE.Color('#6fd07e')
  {
    const ri = FLASK.r - 0.03
    const cosTop = (FILL_Y - FLASK.cy) / ri
    const theta = Math.acos(clamp(cosTop, -1, 1))
    const body = new THREE.Mesh(new THREE.SphereGeometry(ri, 40, 20, 0, TAU, theta, Math.PI - theta), acidMat)
    body.position.y = FLASK.cy
    body.renderOrder = 3
    const surf = new THREE.Mesh(new THREE.CircleGeometry(ri * Math.sin(theta), 40).rotateX(-Math.PI / 2), acidMat)
    surf.position.y = FILL_Y
    surf.renderOrder = 3
    flaskGroup.add(body, surf)
  }
  const flaskHit = new THREE.Mesh(new THREE.SphereGeometry(FLASK.r + 0.1, 16, 12), ghost)
  flaskHit.position.y = FLASK.cy + 0.25
  flaskHit.scale.y = 1.6
  flaskGroup.add(flaskHit)
  solids.push(circle(FLASK.x, FLASK.z, FLASK.r + 0.08))
  // the specks lying at the bottom (a little heap), and the hydrogen bubbles
  const HEAP = 140
  const heapSpots = []
  {
    const rnd = random(19)
    const ri = FLASK.r - 0.03
    for (let i = 0; i < HEAP; i++) {
      const rr = Math.sqrt(rnd()) * 0.32 * (0.4 + 0.6 * (i / HEAP))
      const a = rnd() * TAU
      const x = Math.cos(a) * rr
      const z = Math.sin(a) * rr
      const y = FLASK.cy - Math.sqrt(ri * ri - rr * rr) + 0.03 + (1 - rr / 0.32) * 0.05 * rnd()
      heapSpots.push(new THREE.Vector3(FLASK.x + x, y, FLASK.z + z))
    }
  }
  const heap = new THREE.InstancedMesh(speckGeo, ironMat, HEAP)
  heap.count = 0
  heap.frustumCulled = false
  heap.raycast = () => {}
  heap.renderOrder = 3
  root.add(heap)
  const BUB = light ? 50 : 110
  const bubPos = new Float32Array(BUB * 3)
  const bubGeo = new THREE.BufferGeometry()
  bubGeo.setAttribute('position', new THREE.BufferAttribute(bubPos, 3))
  const bubbles = new THREE.Points(bubGeo, new THREE.PointsMaterial({ color: '#f4fbff', map: glow, size: 0.07, transparent: true, opacity: 0.9, depthWrite: false }))
  bubbles.frustumCulled = false
  bubbles.raycast = () => {}
  bubbles.renderOrder = 5
  root.add(bubbles)
  const bub = Array.from({ length: BUB }, () => ({ on: false, x: 0, y: 0, z: 0, v: 0, w: Math.random() * TAU }))
  for (let i = 0; i < BUB; i++) bubPos[i * 3 + 1] = -5

  // the flask's iron: a snapshot (solid and dissolved at a moment) and the wall-clock time since
  const F = { s0: 0, g0: 0, pH: 2, t0: now(), drops: 0 }
  const fSolid = () => {
    const v = F.s0 * Math.exp(-rateAt(F.pH) * (now() - F.t0))
    return v < 0.004 ? 0 : v
  }
  const fGone = () => F.g0 + F.s0 - fSolid()
  const snap = () => {
    const s = fSolid()
    const g = fGone()
    Object.assign(F, { s0: s, g0: g, t0: now() })
  }
  let incoming = 0 // mg falling through the funnel, not on the heap yet
  function flaskAdd(mg) {
    snap()
    F.s0 = r3(F.s0 + mg)
    F.drops++
    incoming = mg
  }
  let phSend = null
  function setPH(v, now_ = false) {
    const pH = clamp(Math.round(Number(v) * 10) / 10, 1, 7)
    if (pH === F.pH) return
    const was = F.pH
    snap()
    F.pH = pH
    updatePHSign()
    if (now_) {
      const lv = level()
      if (fSolid() > 0) say(fill(at(pH >= 6.5 ? E.flask.says.water : pH < was ? E.flask.says.faster : E.flask.says.slower, lv), { ph: n1(pH), h: hConc(pH) }))
      share('flask')
    } else if (!phSend) {
      phSend = setTimeout(() => {
        phSend = null
        share('flask')
      }, 250)
    }
  }
  const hConc = pH => {
    const h = Math.pow(10, -pH)
    if (h >= 0.001) return num(h, h >= 0.01 ? 2 : 3, lang)
    const e = Math.floor(Math.log10(h) + 1e-9)
    const sup = String(e).replace(/[-0-9]/g, c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)])
    return `${num(h / Math.pow(10, e), 1, lang)} × 10${sup}`
  }

  // the pH sign beside the flask, with an indicator strip
  const phSign = standingScreen({ width: 1.5, height: 0.92, color, title: '', line: '', titleSize: 0.16, lineSize: 0.1 }, { top: 1.55, tilt: 0.28, mat: M.steel })
  phSign.group.position.set(PH_SIGN.x, 0, PH_SIGN.z)
  phSign.group.rotation.y = Math.atan2(5.3 - PH_SIGN.x, -0.6 - PH_SIGN.z)
  root.add(phSign.group)
  solids.push(circle(PH_SIGN.x, PH_SIGN.z, 0.3))
  const strip = canvasTex(256, 16, (g, w, h) => {
    const cols = ['#e2333a', '#ef5a2a', '#f58c26', '#f5b52a', '#efd93a', '#b6d23c', '#5cb848']
    const grd = g.createLinearGradient(0, 0, w, 0)
    cols.forEach((c, i) => grd.addColorStop(i / (cols.length - 1), c))
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(strip)
  const stripMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.09), new THREE.MeshBasicMaterial({ map: strip, toneMapped: false }))
  stripMesh.position.set(0, -0.3, 0.01)
  const stripMark = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.17), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }))
  stripMark.position.set(0, -0.3, 0.02)
  phSign.content.add(stripMesh, stripMark)
  let goneShown = -1
  function updatePHSign() {
    const kind = F.pH >= 6.5 ? E.flask.signs.water : F.pH <= 3.5 ? E.flask.signs.acid : E.flask.signs.weak
    phSign.set({ title: fill(E.flask.signs.ph, { ph: n1(F.pH) }), line: `${kind}\n${fill(E.flask.signs.gone, { mg: n2(fGone()) })}` })
    stripMark.position.x = -0.6 + 1.2 * ((F.pH - 1) / 6)
    goneShown = Math.round(fGone() * 100)
  }
  updatePHSign()

  // the lens (the picture's): an iron surface in acid, step by step
  const lens = new THREE.Group()
  lens.position.set(LENS.x, 0, LENS.z)
  lens.rotation.y = Math.atan2(5.3 - LENS.x, -0.6 - LENS.z)
  root.add(lens)
  const lensFace = new THREE.Group()
  lensFace.position.y = LENS.y
  // the atoms' sizes were laid out for a lens of 0.85 m: the face is scaled to the lens
  const lensK = LENS.r / 0.85
  lens.add(lensFace)
  {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.06, 12, 64), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }))
    const back = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 64), new THREE.MeshStandardMaterial({ color: '#0f1838', emissive: '#16244f', emissiveIntensity: 0.7, roughness: 0.6 }))
    back.position.z = -0.03
    // the water above the metal, a little lighter
    const water = new THREE.Mesh(new THREE.CircleGeometry(LENS.r * 0.98, 64, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#1f3a66', transparent: true, opacity: 0.6 }))
    water.position.z = -0.02
    water.position.y = -0.1
    water.scale.y = 1
    const shineMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12, depthWrite: false })
    const shine = new THREE.Mesh(new THREE.RingGeometry(LENS.r * 0.7, LENS.r * 0.8, 32, 1, 1.9, 0.9), shineMat)
    shine.position.z = 0.12
    lensFace.add(rim, back, water, shine)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, LENS.y - LENS.r, 12), M.steel)
    stem.position.y = (LENS.y - LENS.r) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 0.08, 32), M.steel)
    foot.position.y = 0.04
    lens.add(stem, foot)
    solids.push(circle(LENS.x, LENS.z, 0.5))
  }
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LENS.r + 0.06, 32), ghost)
  lensHit.position.z = 0.05
  lensFace.add(lensHit)
  const lensInner = new THREE.Group()
  lensInner.scale.setScalar(lensK)
  lensFace.add(lensInner)
  // its atoms: iron in rows at the bottom, two H+ above
  const ballGeo = new THREE.SphereGeometry(1, 20, 14)
  const feMat = new THREE.MeshStandardMaterial({ color: '#e06633', roughness: 0.35, emissive: '#5a1e08', emissiveIntensity: 0.35 })
  const feIonMat = new THREE.MeshStandardMaterial({ color: '#e07a44', roughness: 0.35, emissive: '#2f9a4a', emissiveIntensity: 0.55 })
  const hMat = new THREE.MeshStandardMaterial({ color: '#f2f4fa', roughness: 0.3, emissive: '#5a6070', emissiveIntensity: 0.3 })
  const AR = 0.085
  const metal = []
  for (const [y, xs] of [[-0.12, [-0.36, -0.18, 0.18, 0.36]], [-0.28, [-0.45, -0.27, -0.09, 0.09, 0.27, 0.45]], [-0.44, [-0.36, -0.18, 0, 0.18, 0.36]], [-0.6, [-0.18, 0, 0.18]]]) {
    for (const x of xs) {
      const m = new THREE.Mesh(ballGeo, feMat)
      m.scale.setScalar(AR)
      m.position.set(x, y, 0.06)
      lensInner.add(m)
      metal.push(m)
    }
  }
  const feAtom = new THREE.Mesh(ballGeo, feMat)
  feAtom.scale.setScalar(AR)
  lensInner.add(feAtom)
  const feGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#7dffa0', transparent: true, opacity: 0, depthWrite: false }))
  feGlow.scale.setScalar(0.42)
  lensInner.add(feGlow)
  const hAtoms = [0, 1].map(() => {
    const m = new THREE.Mesh(ballGeo, hMat)
    m.scale.setScalar(AR * 0.62)
    lensInner.add(m)
    return m
  })
  const electrons = [0, 1].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#ffe066').multiplyScalar(1.6), transparent: true, depthWrite: false }))
    s.scale.setScalar(0.09)
    s.visible = false
    lensInner.add(s)
    return s
  })
  const feLabel = ion('Fe', '', 0.1, '#ffe1d0')
  const feIonLabel = ion('Fe', '2+', 0.1, '#bfffd0')
  const hLabels = [0, 1].map(() => ion('H', '+', 0.085, '#ffffff'))
  const h2Label = formulaText('H2', { size: 0.1, color: '#ffffff' })
  const eLabel = makeText('e−', { size: 0.08, color: '#ffe066', outlineWidth: 0.01, outlineColor: '#0b0f24' })
  for (const l of [feLabel, feIonLabel, ...hLabels, h2Label, eLabel]) {
    l.position.z = 0.16
    lensInner.add(l)
  }
  const L = { step: 0, t: 9 }
  const H_START = [new THREE.Vector3(-0.42, 0.36, 0.08), new THREE.Vector3(0.4, 0.46, 0.08)]
  const H_NEAR = [new THREE.Vector3(-0.15, 0.04, 0.08), new THREE.Vector3(0.15, 0.04, 0.08)]
  const FE_HOME = new THREE.Vector3(0, -0.12, 0.06)
  function poseLens(dt) {
    L.t += dt
    const k = span(0, 1.2, L.t)
    const s = L.step
    // the H atoms
    hAtoms.forEach((h, i) => {
      if (s === 0) h.position.copy(H_START[i]).add(new THREE.Vector3(Math.sin(L.t * 1.3 + i * 2) * 0.03, Math.cos(L.t * 1.1 + i) * 0.03, 0))
      else if (s === 1) h.position.lerpVectors(H_START[i], H_NEAR[i], k)
      else if (s === 2) h.position.copy(H_NEAR[i])
      else {
        const pair = new THREE.Vector3(i ? 0.055 : -0.055, 0, 0)
        h.position.lerpVectors(H_NEAR[i], new THREE.Vector3(0.12, 0.62, 0.08).add(pair), k)
      }
      h.visible = !(s === 3 && L.t > 1.6)
    })
    // the electrons hop from the iron atom to each H+
    electrons.forEach((e, i) => {
      e.visible = s === 2 && L.t < 1.3
      if (e.visible) {
        const q = span(0.1, 0.9, L.t)
        e.position.lerpVectors(FE_HOME.clone().add(new THREE.Vector3(i ? 0.05 : -0.05, 0.05, 0.06)), H_NEAR[i].clone().setZ(0.14), q)
        e.position.y += Math.sin(q * Math.PI) * 0.12
      }
    })
    // the iron atom: home, then (an ion) off into the water
    const ionNow = s >= 2 && !(s === 2 && L.t < 0.8)
    feAtom.material = ionNow ? feIonMat : feMat
    if (s === 3) feAtom.position.lerpVectors(FE_HOME, new THREE.Vector3(-0.38, 0.3, 0.06), k)
    else feAtom.position.copy(FE_HOME)
    feAtom.visible = !(s === 3 && L.t > 2.2)
    feGlow.position.copy(feAtom.position)
    feGlow.material.opacity = ionNow && feAtom.visible ? 0.55 : 0
    feLabel.visible = !ionNow
    feIonLabel.visible = ionNow && feAtom.visible
    feLabel.position.set(FE_HOME.x + 0.1, FE_HOME.y + 0.12, 0.16)
    feIonLabel.position.set(feAtom.position.x + 0.12, feAtom.position.y + 0.12, 0.16)
    hLabels.forEach((l, i) => {
      l.visible = s < 2 || (s === 2 && L.t < 0.8)
      l.position.set(hAtoms[i].position.x + 0.06, hAtoms[i].position.y + 0.08, 0.16)
    })
    h2Label.visible = s === 3 && L.t > 0.4 && L.t < 1.6
    h2Label.position.set(hAtoms[0].position.x + 0.2, hAtoms[0].position.y + 0.04, 0.16)
    eLabel.visible = s === 2 && L.t < 1.3
    eLabel.position.set(0.0, 0.16, 0.16)
  }
  updates.push(dt => poseLens(dt))
  function lensStep(liveFx = true) {
    L.step = (L.step + 1) % 4
    L.t = liveFx ? 0 : 9
    play(L.step === 2 ? 'electron' : L.step === 3 ? 'pop' : 'tap')
  }

  const flaskPanel = lv => ({
    title: E.flask.title,
    color,
    blocks: [
      {
        slider: {
          label: E.flask.slider,
          min: 1,
          max: 7,
          step: 0.1,
          value: F.pH,
          onInput: v => setPH(v),
          format: v => fill(E.flask.signs.ph, { ph: n1(v) }),
          live: () => F.pH,
        },
      },
      {
        buttons: [
          { label: E.flask.buttons.drop, onClick: () => bowlStep('drop') },
          { label: E.flask.buttons.lens, onClick: () => flaskStep('lens') },
          { label: E.flask.buttons.stomach, onClick: () => setPH(2, true) },
          { label: E.flask.buttons.water, onClick: () => setPH(7, true) },
        ],
      },
      ...E.flask.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  function flaskStep(what) {
    const lv = level()
    if (what === 'flask') {
      if (B.load > 0) return bowlStep('drop')
      if (fSolid() > 0) return say(at(F.pH >= 6.5 ? E.flask.says.water : E.flask.says.fizz, lv))
      return say(at(F.drops ? E.flask.says.done : E.flask.says.empty, lv))
    }
    if (what === 'lens') {
      lensStep(true)
      say(at(E.flask.lens[L.step], lv))
      ex.discover('flask', flaskPanel, 2.5)
      share('lens')
    }
  }
  clickable(flaskHit, () => flaskStep('flask'), { reach: 6, when: () => !busyBowl() })
  clickable(lensHit, () => flaskStep('lens'), { reach: 6 })
  clickable(phSign.group, () => ctx.showPanel(flaskPanel), { reach: 5 })
  ex.add({
    id: 'flask',
    x: 5.3,
    z: -0.7,
    radius: 2.2,
    manual: true,
    label: E.flask.label,
    verb: () => {
      if (anim?.kind === 'drop') return E.flask.hints.busy
      if (B.load > 0) return E.flask.hints.drop
      const s = fSolid()
      if (s > 0 && F.pH >= 6.5) return E.flask.hints.water
      if (s > 0) return E.flask.hints.fizz
      return F.drops ? E.flask.hints.done : E.flask.hints.none
    },
    focus: { x: 6.3, y: 1.75, z: -3.1, size: 3.5, width: 4.8 },
    screens: [phSign],
    act: () => ctx.showPanel(flaskPanel),
  })
  // the flask over time: the heap shrinks, bubbles rise, the acid turns pale green
  let fizzSound = 0
  updates.push((dt, t) => {
    const solid = fSolid()
    if (incoming > 0 && !(anim?.kind === 'drop')) incoming = 0
    if (anim?.kind === 'drop') incoming = anim.load * (1 - span(2.4, 4.0, anim.t))
    const onHeap = Math.max(0, solid - incoming)
    const n = Math.min(HEAP, Math.round(onHeap * 40 + (onHeap > 0 ? 3 : 0)))
    if (heap.count !== n) {
      for (let i = 0; i < n; i++) {
        dummy.position.copy(heapSpots[i])
        dummy.rotation.set(i, i * 1.3, i * 0.7)
        dummy.scale.setScalar(0.022 + (i % 4) * 0.004)
        dummy.updateMatrix()
        heap.setMatrixAt(i, dummy.matrix)
      }
      heap.count = n
      heap.instanceMatrix.needsUpdate = true
    }
    const rate = onHeap > 0 ? rateAt(F.pH) * onHeap : 0
    const want = clamp(rate * 700, 0, BUB)
    let active = 0
    for (let i = 0; i < BUB; i++) {
      const b = bub[i]
      if (!b.on && active < want && n > 0 && Math.random() < dt * 6) {
        const h = heapSpots[Math.floor(Math.random() * n)]
        Object.assign(b, { on: true, x: h.x, y: h.y + 0.02, z: h.z, v: 0.35 + Math.random() * 0.3 })
      }
      if (b.on) {
        active++
        b.y += b.v * dt
        b.w += dt * 6
        if (b.y > FILL_Y - 0.02) b.on = false
      }
      bubPos[i * 3] = b.on ? b.x + Math.sin(b.w) * 0.02 : 0
      bubPos[i * 3 + 1] = b.on ? b.y : -5
      bubPos[i * 3 + 2] = b.on ? b.z : 0
    }
    bubGeo.attributes.position.needsUpdate = true
    if (rate > 0.01 && (fizzSound -= dt) < 0) {
      fizzSound = 1.6
      play('fizz', { order: clamp(rate * 8, 0.3, 1.2) })
    }
    // the acid's green: Fe2+ (its real colour in so little is too faint to see; stronger here)
    acidMat.color.copy(acidTop).lerp(acidGreen, 1 - Math.exp(-fGone() / 1.4))
    if (Math.round(fGone() * 100) !== goneShown) updatePHSign()
  })
  const flaskState = () => ({ solid: r3(fSolid()), gone: r3(fGone()), pH: F.pH, drops: F.drops })
  function flaskSet(s, live, ago = 0) {
    if (!s) return
    const pH = clamp(Number(s.pH) || 2, 1, 7)
    F.pH = Math.round(pH * 10) / 10
    F.s0 = clamp(Number(s.solid) || 0, 0, 50)
    F.g0 = clamp(Number(s.gone) || 0, 0, 500)
    F.t0 = now() - Math.max(0, Number(ago) || 0)
    F.drops = Math.max(0, Math.round(Number(s.drops) || 0))
    if (!live) incoming = 0
    updatePHSign()
  }

  // ======== 3. the gut's gate ========
  const plate = P.plate({ r: PLATE.r })
  plate.group.position.set(PLATE.x, 0, PLATE.z)
  root.add(plate.group)
  solids.push(circle(PLATE.x, PLATE.z, PLATE.r * 0.95))
  const fork = P.fork()
  fork.group.position.set(PLATE.x + PLATE.r + 0.55, 0, PLATE.z + 0.2)
  fork.group.rotation.y = Math.PI / 2 + 0.08
  root.add(fork.group)
  const forkHit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, fork.length), ghost)
  forkHit.position.set(fork.group.position.x, 0.2, fork.group.position.z)
  root.add(forkHit)
  // the foods, each a group with something easy to tap and its tag
  const foodMats = {
    steak: new THREE.MeshStandardMaterial({ color: '#7a3a22', roughness: 0.62 }),
    fat: new THREE.MeshStandardMaterial({ color: '#d8b48c', roughness: 0.6 }),
    egg: new THREE.MeshStandardMaterial({ color: '#cfa77c', roughness: 0.5 }),
    crust: new THREE.MeshStandardMaterial({ color: '#8a5228', roughness: 0.8 }),
    lentil: new THREE.MeshStandardMaterial({ color: '#9c5530', roughness: 0.55 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#3f8a3a', roughness: 0.55, side: THREE.DoubleSide }),
    rib: new THREE.MeshStandardMaterial({ color: '#8cc77a', roughness: 0.6 }),
  }
  const crumbTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#c99d64'
    g.fillRect(0, 0, w, h)
    const rnd = random(4)
    for (let i = 0; i < 500; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(90,50,20,0.35)' : 'rgba(255,235,200,0.25)'
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 1 + rnd() * 3, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
  crumbTex.repeat.set(0.6, 0.6)
  textures.push(crumbTex)
  foodMats.crumb = new THREE.MeshStandardMaterial({ map: crumbTex, roughness: 0.85 })
  const searTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#80402a'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(30,12,6,0.75)'
    g.lineWidth = 12
    for (let i = -4; i < 8; i++) {
      g.beginPath()
      g.moveTo(i * 48, 0)
      g.lineTo(i * 48 + 160, h)
      g.stroke()
    }
  }, { repeat: true })
  searTex.repeat.set(0.7, 0.7)
  textures.push(searTex)
  foodMats.seared = new THREE.MeshStandardMaterial({ map: searTex, roughness: 0.6 })
  function makeFood(id) {
    const g = new THREE.Group()
    let hit
    if (id === 'steak') {
      const s = new THREE.Shape()
      const pts = [[0.9, 0], [0.75, 0.5], [0.2, 0.62], [-0.5, 0.55], [-0.9, 0.2], [-0.85, -0.35], [-0.3, -0.6], [0.4, -0.58], [0.85, -0.35]]
      s.moveTo(...pts[0])
      for (let i = 1; i <= pts.length; i++) {
        const a = pts[i % pts.length]
        const b = pts[(i - 1) % pts.length]
        s.quadraticCurveTo(b[0] * 1.05, b[1] * 1.05, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
      }
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 3, curveSegments: 10 })
      geo.rotateX(-Math.PI / 2)
      const m = new THREE.Mesh(geo, [foodMats.seared, foodMats.steak])
      m.position.y = 0.07
      // a rim of fat along one side
      const fat = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 8, 20, 1.6), foodMats.fat)
      fat.rotation.x = Math.PI / 2
      fat.position.set(0.1, 0.18, 0.05)
      fat.rotation.z = -0.4
      g.add(m, fat)
      hit = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.6, 1.4), ghost)
      hit.position.y = 0.3
    } else if (id === 'egg') {
      const e = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), foodMats.egg)
      // an egg's shape: a little narrower at one end
      const p = e.geometry.attributes.position
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i)
        const k = 1 - 0.12 * y
        p.setX(i, p.getX(i) * k)
        p.setZ(i, p.getZ(i) * k)
      }
      e.geometry.computeVertexNormals()
      e.scale.set(0.44, 0.57, 0.44)
      e.rotation.z = Math.PI / 2 - 0.25
      e.position.y = 0.44
      g.add(e)
      hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 1.0), ghost)
      hit.position.y = 0.45
    } else if (id === 'bread') {
      const s = new THREE.Shape()
      s.moveTo(-0.72, -0.75)
      s.lineTo(0.72, -0.75)
      s.lineTo(0.75, 0.25)
      s.bezierCurveTo(1.05, 0.45, 0.95, 0.95, 0.45, 0.9)
      s.bezierCurveTo(0.2, 1.05, -0.2, 1.05, -0.45, 0.9)
      s.bezierCurveTo(-0.95, 0.95, -1.05, 0.45, -0.75, 0.25)
      s.closePath()
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.05, bevelSegments: 2, curveSegments: 12 })
      geo.rotateX(-Math.PI / 2)
      const m = new THREE.Mesh(geo, [foodMats.crumb, foodMats.crust])
      m.position.y = 0.03
      m.scale.setScalar(0.85)
      g.add(m)
      hit = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.7), ghost)
      hit.position.y = 0.2
    } else if (id === 'cereal') {
      const rnd = random(8)
      for (let i = 0; i < 9; i++) {
        const f = new THREE.Mesh(flakeGeo, flakeMat)
        const a = rnd() * TAU
        const rr = rnd() * 0.45
        f.position.set(Math.cos(a) * rr, 0.06 + (0.45 - rr) * 0.5 * rnd(), Math.sin(a) * rr)
        f.rotation.set((rnd() - 0.5) * 1.4, rnd() * TAU, (rnd() - 0.5) * 1.4)
        f.scale.setScalar(0.3 + rnd() * 0.06)
        g.add(f)
      }
      hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.3), ghost)
      hit.position.y = 0.25
    } else if (id === 'lentils') {
      const dish = P.plate({ r: cm(4.2), color: '#e2dac8' })
      g.add(dish.group)
      const N = light ? 70 : 130
      const lent = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6), foodMats.lentil, N)
      const rnd = random(12)
      for (let i = 0; i < N; i++) {
        const rr = Math.sqrt(rnd()) * 0.5
        const a = rnd() * TAU
        dummy.position.set(Math.cos(a) * rr, dish.top + 0.04 + (0.5 - rr) * 0.45 * rnd(), Math.sin(a) * rr)
        dummy.rotation.set((rnd() - 0.5) * 1.5, 0, (rnd() - 0.5) * 1.5)
        dummy.scale.set(0.085, 0.035, 0.085)
        dummy.updateMatrix()
        lent.setMatrixAt(i, dummy.matrix)
      }
      lent.castShadow = !light
      g.add(lent)
      hit = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.6, 16), ghost)
      hit.position.y = 0.25
    } else if (id === 'spinach') {
      const s = new THREE.Shape()
      s.moveTo(0, -0.5)
      s.bezierCurveTo(0.42, -0.3, 0.45, 0.35, 0, 0.75)
      s.bezierCurveTo(-0.45, 0.35, -0.42, -0.3, 0, -0.5)
      const geo = new THREE.ShapeGeometry(s, 10)
      // a leaf curls a little along its middle
      const p = geo.attributes.position
      for (let i = 0; i < p.count; i++) p.setZ(i, 0.18 * p.getX(i) * p.getX(i) + 0.04 * Math.sin(p.getY(i) * 3))
      geo.computeVertexNormals()
      geo.rotateX(-Math.PI / 2)
      for (const [a, x, z] of [[0.2, -0.15, 0.1], [1.9, 0.25, -0.05], [-1.3, 0.05, -0.25]]) {
        const leaf = new THREE.Mesh(geo, foodMats.leaf)
        leaf.position.set(x, 0.05 + Math.abs(a) * 0.02, z)
        leaf.rotation.y = a
        leaf.scale.setScalar(0.95)
        leaf.castShadow = !light
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 1.15, 6), foodMats.rib)
        rib.rotation.x = Math.PI / 2
        rib.position.set(0, 0.03, -0.1)
        leaf.add(rib)
        g.add(leaf)
      }
      hit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), ghost)
      hit.position.y = 0.2
    }
    g.traverse(o => o.isMesh && o.material !== ghost && (o.castShadow = !light))
    g.add(hit)
    return g
  }
  const arcAt = deg => new THREE.Vector3(PLATE.x + Math.cos((deg * Math.PI) / 180) * 3.45, 0, PLATE.z + Math.sin((deg * Math.PI) / 180) * 3.45)
  const slotAt = deg => new THREE.Vector3(PLATE.x + Math.cos((deg * Math.PI) / 180) * 1.45, plate.top, PLATE.z + Math.sin((deg * Math.PI) / 180) * 1.45)
  const foods = FOODS.map(f => {
    const g = makeFood(f.id)
    const home = arcAt(f.arc)
    const slot = slotAt(f.arc)
    g.position.copy(home)
    g.rotation.y = (f.arc - 90) * 0.004
    root.add(g)
    const words = E.gate.foods[f.id]
    const tag = new THREE.Group()
    const nameT = label(words.name, 0.11, '#ffffff', { maxWidth: 1.8 })
    const mgT = label(`${n1(f.mg)} mg`, 0.14, '#ffd8a8')
    mgT.position.y = -0.16
    tag.add(nameT, mgT)
    tag.position.set(home.x, f.id === 'egg' ? 1.3 : 0.95, home.z + 0.1)
    root.add(tag)
    return { ...f, g, home, slot, tag, on: false, hop: null, gone: 0 }
  })
  // the drinks: the glass of orange juice (a tower), the cup of tea; a glowing ring when one goes with the meal
  const ojGlass = P.tumbler()
  ojGlass.group.position.set(OJ.x, 0, OJ.z)
  root.add(ojGlass.group)
  solids.push(circle(OJ.x, OJ.z, ojGlass.r + 0.05))
  const ojHit = new THREE.Mesh(new THREE.CylinderGeometry(ojGlass.r + 0.1, ojGlass.r + 0.1, ojGlass.height, 16), ghost)
  ojHit.position.set(OJ.x, ojGlass.height / 2, OJ.z)
  root.add(ojHit)
  const teaCup = P.cup({ r: cm(3.2), h: cm(5.6) })
  teaCup.group.position.set(TEA.x, 0, TEA.z)
  teaCup.group.rotation.y = -0.6
  root.add(teaCup.group)
  solids.push(circle(TEA.x, TEA.z, teaCup.r * 1.6))
  const teaHit = new THREE.Mesh(new THREE.CylinderGeometry(teaCup.r * 1.3, teaCup.r * 1.7, teaCup.top + 0.2, 16), ghost)
  teaHit.position.set(TEA.x, (teaCup.top + 0.2) / 2, TEA.z)
  root.add(teaHit)
  const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.4), transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  const ojRing = new THREE.Mesh(new THREE.RingGeometry(ojGlass.r + 0.12, ojGlass.r + 0.24, 48).rotateX(-Math.PI / 2), ringMat)
  ojRing.position.set(OJ.x, 0.02, OJ.z)
  const teaRingMat = ringMat.clone()
  const teaRing = new THREE.Mesh(new THREE.RingGeometry(teaCup.r * 1.85, teaCup.r * 1.85 + 0.12, 48).rotateX(-Math.PI / 2), teaRingMat)
  teaRing.position.set(TEA.x, 0.02, TEA.z)
  root.add(ojRing, teaRing)
  const withOj = label(E.gate.signs.with, 0.16, '#ffffff')
  withOj.position.set(OJ.x - 0.25, ojGlass.height + 0.42, OJ.z)
  const withTea = label(E.gate.signs.with, 0.16, '#ffffff')
  withTea.position.set(TEA.x, teaCup.top + 0.42, TEA.z)
  root.add(withOj, withTea)
  const ojName = label(E.gate.signs.oj, 0.13, '#ffd8a8')
  ojName.position.set(OJ.x - 0.25, ojGlass.height + 0.62, OJ.z)
  const teaName = label(E.gate.signs.tea, 0.13, '#ffd8a8')
  teaName.position.set(TEA.x, teaCup.top + 0.62, TEA.z)
  root.add(ojName, teaName)
  // steam over the tea while it goes with the meal
  const STEAM = light ? 8 : 16
  const steam = Array.from({ length: STEAM }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }))
    s.userData.seed = i / STEAM
    root.add(s)
    return s
  })

  // the gut's wall: a row of cells (its lining is one cell thick), the gate in the middle, its counter
  const cellMat = new THREE.MeshStandardMaterial({ color: '#e08a98', roughness: 0.55, emissive: '#3a0f18', emissiveIntensity: 0.15, transparent: true, opacity: 0.88 })
  const nucMat = new THREE.MeshStandardMaterial({ color: '#7a3c8c', roughness: 0.5 })
  const CELLS = 7
  const fingerGeo = new THREE.CapsuleGeometry(0.025, 0.1, 3, 6)
  const fingerMat = new THREE.MeshStandardMaterial({ color: '#f4b2bd', roughness: 0.8 })
  {
    const geo = new RoundedBoxGeometry(0.5, 1.15, 0.42, 3, 0.16)
    const nucGeo = new THREE.SphereGeometry(0.12, 14, 10)
    for (let i = 0; i < CELLS; i++) {
      if (i === 3) continue
      const c = new THREE.Mesh(geo, cellMat)
      c.position.set(PLATE.x + (i - 3) * 0.55, 0.6, WALL_Z)
      c.castShadow = !light
      root.add(c)
      const nuc = new THREE.Mesh(nucGeo, nucMat)
      nuc.position.set(c.position.x, 0.42, WALL_Z + 0.12)
      nuc.scale.set(1, 1.3, 0.8)
      root.add(nuc)
      // the brush border on top, toward the food: a row of tiny fingers
      for (let j = 0; j < 5; j++) {
        const v = new THREE.Mesh(fingerGeo, fingerMat)
        v.position.set(c.position.x - 0.18 + j * 0.09, 1.24, WALL_Z + 0.08)
        root.add(v)
      }
    }
    solids.push(box(PLATE.x, WALL_Z, CELLS * 0.55, 0.5))
  }
  const gateMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8, roughness: 0.4 })
  {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 24, Math.PI), gateMat)
    arch.position.set(PLATE.x, 0.95, WALL_Z)
    root.add(arch)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8), gateMat)
      post.position.set(PLATE.x + s * 0.24, 0.475, WALL_Z)
      root.add(post)
    }
  }
  const wallLabel = label(E.gate.signs.wall, 0.17, '#ffffff', { maxWidth: 3 })
  wallLabel.position.set(PLATE.x + 1.6, 1.55, WALL_Z + 0.1)
  root.add(wallLabel)
  // the loop behind the wall: iron going round, old red cells taken apart by cleaner cells
  const loopGroup = new THREE.Group()
  loopGroup.position.set(LOOP.x, LOOP.y, LOOP.z)
  root.add(loopGroup)
  {
    const track = new THREE.Mesh(new THREE.TorusGeometry(LOOP.r, 0.045, 8, 64), new THREE.MeshStandardMaterial({ color: '#c46a5a', emissive: '#c46a5a', emissiveIntensity: 0.4, roughness: 0.5 }))
    loopGroup.add(track)
    // a red cell (a dimpled disc) at the top, a cleaner cell (a macrophage) at the bottom
    const rbc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.1, 10, 24), new THREE.MeshStandardMaterial({ color: '#d0302c', roughness: 0.45 }))
    rbc.position.set(0, LOOP.r, 0.05)
    const rbcMid = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20), rbc.material)
    rbcMid.rotation.x = Math.PI / 2
    rbcMid.position.copy(rbc.position)
    const mac = new THREE.Mesh(lumpGeometry(3, 2), new THREE.MeshStandardMaterial({ color: '#9b72d4', roughness: 0.55 }))
    mac.scale.setScalar(0.34)
    mac.position.set(0, -LOOP.r, 0.05)
    loopGroup.add(rbc, rbcMid, mac)
    const t1 = label(E.gate.signs.loop, 0.18, '#ffffff')
    t1.position.set(0, LOOP.r + 0.5, 0.1)
    const t2 = label(E.gate.signs.loopSub, 0.13, '#ffd8a8', { maxWidth: 2.6 })
    t2.position.set(0, LOOP.r + 0.3, 0.1)
    const t3 = label(E.gate.signs.cleaner, 0.12, '#e6d8ff')
    t3.position.set(0.68, -LOOP.r - 0.05, 0.1)
    const t4 = label(E.gate.signs.red, 0.12, '#ffd0d0')
    t4.position.set(0.72, LOOP.r - 0.02, 0.1)
    loopGroup.add(t1, t2, t3, t4)
  }
  const LOOPN = light ? 28 : 46
  const loopDots = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: '#f2a03c', emissive: '#a85410', emissiveIntensity: 0.5, roughness: 0.4 }), LOOPN)
  loopDots.frustumCulled = false
  loopDots.raycast = () => {}
  loopGroup.add(loopDots)
  const loopHit = new THREE.Mesh(new THREE.CylinderGeometry(LOOP.r + 0.25, LOOP.r + 0.25, 0.3, 24), ghost)
  loopHit.rotation.x = Math.PI / 2
  loopGroup.add(loopHit)
  // the day's board: eaten, let in, used again
  const board = screen({ width: 3.0, height: 1.9, color, title: E.gate.board.title, line: '', titleSize: 0.18 })
  board.group.position.set(BOARD.x, BOARD.y, BOARD.z)
  board.group.rotation.y = -0.12
  root.add(board.group)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, BOARD.y - 0.95, 10), M.steel)
    post.position.set(BOARD.x, (BOARD.y - 0.95) / 2, BOARD.z - 0.08)
    root.add(post)
  }
  const barsTex = canvasTex(1024, 512, null)
  textures.push(barsTex)
  const bars = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4), new THREE.MeshBasicMaterial({ map: barsTex, transparent: true, toneMapped: false }))
  bars.position.set(0, -0.2, 0.01)
  board.content.add(bars)
  // the iron of a meal: dots flying from the plate to the wall, a few through the gate
  const DOTS = 200
  const dotMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4, emissive: '#5a2a08', emissiveIntensity: 0.4 }), DOTS)
  dotMesh.count = 0
  dotMesh.frustumCulled = false
  dotMesh.raycast = () => {}
  root.add(dotMesh)
  const HAEM_C = new THREE.Color('#d8402c')
  const PLANT_C = new THREE.Color('#f2a03c')
  for (let i = 0; i < DOTS; i++) dotMesh.setColorAt(i, PLANT_C)

  const G = { plate: [], oj: 0, tea: 0, eaten: 0, letIn: 0, meals: 0 }
  let meal = null // { t, dots: [...], mine, eaten, absorbed }
  let letShown = 0
  const gateLabel = label('', 0.2, '#d8ffc0')
  gateLabel.position.set(PLATE.x, 1.45, WALL_Z + 0.2)
  root.add(gateLabel)
  function drawBars() {
    const lv = level()
    barsTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      const max = 25
      const x0 = 300
      const x1 = w - 40
      const X = v => x0 + ((x1 - x0) * clamp(v, 0, max)) / max
      const rows = [
        [E.gate.board.eaten, G.eaten, '#f2a03c', `${n1(G.eaten)} mg`],
        [E.gate.board.letIn, letShown, color, `${n2(letShown)} mg`],
        [E.gate.board.used, 22.5, '#d8504a', E.gate.board.usedValue],
      ]
      g.font = '700 54px Outfit, Nunito, sans-serif'
      g.textBaseline = 'middle'
      rows.forEach(([name, v, c, txt], i) => {
        const y = 90 + i * 140
        g.fillStyle = '#d2dbff'
        g.textAlign = 'right'
        g.fillText(name, x0 - 24, y)
        g.fillStyle = 'rgba(40,52,110,0.9)'
        g.fillRect(x0, y - 30, x1 - x0, 60)
        if (i === 2) {
          // used again: 20 to 25 mg a day, a band
          g.fillStyle = c
          g.fillRect(x0, y - 30, X(20) - x0, 60)
          g.fillStyle = 'rgba(216,80,74,0.45)'
          g.fillRect(X(20), y - 30, X(25) - X(20), 60)
        } else {
          g.fillStyle = c
          g.fillRect(x0, y - 30, Math.max(0, X(v) - x0), 60)
        }
        g.fillStyle = '#ffffff'
        g.textAlign = 'left'
        g.font = '700 46px Outfit, Nunito, sans-serif'
        const tx = i === 2 ? x0 + 16 : Math.min(X(v) + 14, x1 - 260)
        g.fillText(txt, tx, y + 1)
        g.font = '700 54px Outfit, Nunito, sans-serif'
      })
      // the day's need eaten (8 mg, ages 9 to 13), and what the body needs to let in (1 to 2 mg)
      g.strokeStyle = '#ffffff'
      g.lineWidth = 6
      g.beginPath()
      g.moveTo(X(8), 90 - 44)
      g.lineTo(X(8), 90 + 44)
      g.stroke()
      g.fillStyle = 'rgba(255,255,255,0.25)'
      g.fillRect(X(1), 230 - 38, X(2) - X(1), 76)
      g.font = '600 36px Outfit, Nunito, sans-serif'
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      g.fillText(fill(at(E.gate.board.need, lv), { mg: 8 }), X(8), 90 - 52 + 0)
      g.textAlign = 'left'
      g.fillText(at(E.gate.board.needIn, lv), X(2) + 10, 230 + 52)
    })
  }
  function updateGateSign() {
    gateLabel.text = fill(E.gate.signs.letIn, { mg: n2(letShown) })
    gateLabel.sync()
    drawBars()
  }
  function placeFoods(instant) {
    for (const f of foods) {
      const on = G.plate.includes(f.id)
      if (on === f.on && !instant) continue
      f.on = on
      const to = on ? f.slot : f.home
      if (instant) {
        f.hop = null
        f.g.position.copy(to)
        f.g.scale.setScalar(on ? 0.8 : 1)
      } else f.hop = { t: 0, from: f.g.position.clone(), to, s0: f.g.scale.x, s1: on ? 0.8 : 1 }
      f.g.visible = true
      f.gone = 0
    }
  }
  const gatePanel = lv => ({
    title: E.gate.title,
    color,
    blocks: [
      { rows: [[E.gate.board.eaten, `${n1(G.eaten)} mg`], [E.gate.board.letIn, `${n2(G.letIn)} mg`]] },
      { buttons: FOODS.map(f => ({ label: fill(G.plate.includes(f.id) ? E.gate.buttons.remove : E.gate.buttons.add, { food: E.gate.foods[f.id].name }), onClick: () => gateStep(f.id) })) },
      {
        buttons: [
          { label: E.gate.buttons.eat, onClick: () => gateStep('eat') },
          { label: G.oj ? E.gate.buttons.ojOff : E.gate.buttons.oj, onClick: () => gateStep('oj') },
          { label: G.tea ? E.gate.buttons.teaOff : E.gate.buttons.tea, onClick: () => gateStep('tea') },
          { label: E.gate.buttons.day, onClick: () => gateStep('day') },
        ],
      },
      ...E.gate.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const refreshGatePanel = () => {
    if (ctx.store.get().panel?.title === E.gate.title) ctx.showPanel(gatePanel)
  }
  function startMeal(ids, oj, tea, mine) {
    const dots = []
    let eaten = 0
    let absorbed = 0
    for (const id of ids) {
      const f = FOODS.find(q => q.id === id)
      const slot = foods.find(q => q.id === id).slot
      eaten += f.mg
      const a = absorbedOf(f, oj, tea)
      absorbed += a
      const nHaem = Math.round(f.haem * 10)
      const nAll = Math.round(f.mg * 10)
      const pass = Math.round(a * 10)
      // the haem dots get through first, in their share
      const haemPass = Math.min(nHaem, Math.round(f.haem * HAEM * 10))
      for (let i = 0; i < nAll && dots.length < DOTS; i++) {
        const haem = i < nHaem
        const through = haem ? i < haemPass : i - nHaem < pass - haemPass
        dots.push({ from: slot.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.2, (Math.random() - 0.5) * 0.6)), haem, through, delay: 0.3 + Math.random() * 1.6, side: (Math.random() - 0.5) * 2 })
      }
    }
    meal = { t: 0, dots, mine, eaten, absorbed, counted: 0 }
    dots.forEach((d, i) => dotMesh.setColorAt(i, d.haem ? HAEM_C : PLANT_C))
    if (dotMesh.instanceColor) dotMesh.instanceColor.needsUpdate = true
    for (const f of foods) if (ids.includes(f.id)) f.gone = 0.0001
    play('select')
  }
  // a visitor's step: a tap on a food (onto the plate or back), the plate or the fork (eat), a drink, the loop
  function gateStep(what) {
    const lv = level()
    const f = FOODS.find(q => q.id === what)
    if (f) {
      if (meal) return say(at(W.busy, lv))
      const on = G.plate.includes(f.id)
      G.plate = on ? G.plate.filter(id => id !== f.id) : [...G.plate, f.id]
      placeFoods(false)
      play(on ? 'part' : 'join')
      const kind = f.haem ? E.gate.kinds.meat : E.gate.kinds.plant
      say(fill(at(on ? E.gate.says.remove : E.gate.says.add, lv), { food: E.gate.foods[f.id].name, mg: n1(f.mg), kind: at(kind, lv) }))
      refreshGatePanel()
      share('gate')
      return
    }
    if (what === 'eat') {
      if (meal) return say(at(W.busy, lv))
      if (!G.plate.length) return say(at(E.gate.says.empty, lv))
      const ids = [...G.plate]
      const eaten = ids.reduce((s, id) => s + FOODS.find(q => q.id === id).mg, 0)
      const absorbed = ids.reduce((s, id) => s + absorbedOf(FOODS.find(q => q.id === id), G.oj, G.tea), 0)
      startMeal(ids, G.oj, G.tea, true)
      G.plate = []
      G.meals++
      G.eaten = r3(G.eaten + eaten)
      G.letIn = r3(G.letIn + absorbed)
      refreshGatePanel()
      share('gate')
      return
    }
    if (what === 'oj' || what === 'tea') {
      if (meal) return say(at(W.busy, lv))
      G[what] = G[what] ? 0 : 1
      play(G[what] ? 'join' : 'part')
      say(at(what === 'oj' ? (G.oj ? E.gate.says.oj : E.gate.says.ojOff) : G.tea ? E.gate.says.tea : E.gate.says.teaOff, lv))
      refreshGatePanel()
      share('gate')
      return
    }
    if (what === 'day') {
      if (meal) return say(at(W.busy, lv))
      G.eaten = 0
      G.letIn = 0
      letShown = 0
      updateGateSign()
      say(at(E.gate.says.day, lv))
      refreshGatePanel()
      share('gate')
      return
    }
    if (what === 'loop') {
      loopFlash = 1
      play('select')
      say(at(E.gate.says.loop, lv))
    }
  }
  let loopFlash = 0
  for (const f of foods) clickable(f.g, () => gateStep(f.id), { reach: 6, when: () => !meal && !(f.gone > 0) })
  clickable(plate.group, () => gateStep('eat'), { reach: 7, when: () => !meal })
  clickable(forkHit, () => gateStep('eat'), { reach: 7, when: () => !meal })
  clickable(ojHit, () => gateStep('oj'), { reach: 9, when: () => !meal })
  clickable(teaHit, () => gateStep('tea'), { reach: 9, when: () => !meal })
  clickable(loopHit, () => gateStep('loop'), { reach: 11 })
  ex.add({
    id: 'gate',
    x: PLATE.x,
    z: 2.3,
    radius: 2.4,
    manual: true,
    label: E.gate.label,
    verb: () => {
      if (meal) return E.gate.hints.busy
      if (G.plate.length) return E.gate.hints.eat
      return G.meals ? E.gate.hints.again : E.gate.hints.food
    },
    focus: { x: PLATE.x, y: 1.6, z: -4.6, size: 3.8, width: 5.4 },
    screens: [board],
    act: () => ctx.showPanel(gatePanel),
  })
  updates.push((dt, t) => {
    // the foods hop onto the plate and back
    for (const f of foods) {
      if (f.hop) {
        f.hop.t += dt / 0.55
        const k = ease(Math.min(1, f.hop.t))
        f.g.position.lerpVectors(f.hop.from, f.hop.to, k)
        f.g.position.y += Math.sin(Math.min(1, f.hop.t) * Math.PI) * 0.9
        f.g.scale.setScalar(lerp(f.hop.s0, f.hop.s1, k))
        if (f.hop.t >= 1) f.hop = null
      }
      if (f.gone > 0) {
        // eaten: it shrinks away, and comes back to its place on the table after the meal
        f.gone += dt
        f.g.scale.setScalar(0.8 * (1 - span(0, 0.6, f.gone)))
        if (f.gone > 0.7 && !meal) {
          f.gone = 0
          f.on = false
          f.g.position.copy(f.home)
          f.hop = { t: 0, from: f.home.clone(), to: f.home, s0: 0.05, s1: 1 }
        }
      }
      f.tag.visible = !f.on && !(f.gone > 0)
    }
    // the meal's dots: up from the plate, over to the wall; through the gate up to the loop, or turned away
    let n = 0
    if (meal) {
      meal.t += dt
      const gate = new THREE.Vector3(PLATE.x, 0.45, WALL_Z + 0.35)
      for (const d of meal.dots) {
        const k = meal.t - d.delay
        if (k < 0) {
          tmp.copy(d.from)
        } else if (k < 1.1) {
          const q = ease(k / 1.1)
          const to = gate.clone().add(new THREE.Vector3(d.side * (d.through ? 0.15 : 1.8), 0, 0))
          tmp.lerpVectors(d.from, to, q)
          tmp.y += Math.sin(q * Math.PI) * 1.4
        } else if (d.through) {
          const q = (k - 1.1) / 1.3
          if (q > 1) continue
          if (q < 0.35) tmp.set(PLATE.x + d.side * 0.15 * (1 - q / 0.35), 0.45, lerp(WALL_Z + 0.35, WALL_Z - 0.5, q / 0.35))
          else {
            const a = -Math.PI / 2 - (q - 0.35) / 0.65 * 0.8
            const into = new THREE.Vector3(LOOP.x + Math.cos(a) * LOOP.r, LOOP.y + Math.sin(a) * LOOP.r, LOOP.z)
            tmp.lerpVectors(new THREE.Vector3(PLATE.x, 0.45, WALL_Z - 0.5), into, ease((q - 0.35) / 0.65))
          }
          if (q > 0.98 && !d.counted) {
            d.counted = true
            meal.counted++
          }
        } else {
          // turned away: they bump the wall and roll off along it, fading out (out with the rest)
          const q = (k - 1.1) / 1.4
          if (q > 1) continue
          tmp.set(PLATE.x + d.side * 1.8 + (d.side > 0 ? 1 : -1) * q * 2.4, 0.45 * (1 - q) + 0.1, WALL_Z + 0.35 + Math.sin(q * Math.PI) * 0.5)
        }
        dummy.position.copy(tmp)
        dummy.scale.setScalar(d.haem ? 0.085 : 0.07)
        dummy.updateMatrix()
        dotMesh.setMatrixAt(n, dummy.matrix)
        dotMesh.setColorAt(n, d.haem ? HAEM_C : PLANT_C)
        n++
      }
      const target = G.letIn - (meal.absorbed - meal.absorbed * (meal.counted / Math.max(1, meal.dots.filter(d => d.through).length)))
      if (Math.abs(target - letShown) > 0.004) {
        letShown = target
        updateGateSign()
      }
      if (meal.t > 4.6) {
        const mine = meal.mine
        const m = meal
        meal = null
        letShown = G.letIn
        updateGateSign()
        if (mine) {
          const lv = level()
          say(fill(at(E.gate.says.eat, lv), { eaten: n1(m.eaten), in: n2(m.absorbed), pct: Math.round((100 * m.absorbed) / Math.max(0.01, m.eaten)) }))
          ex.discover('gate', gatePanel, 1.0)
        }
      }
    }
    dotMesh.count = n
    dotMesh.instanceMatrix.needsUpdate = true
    if (dotMesh.instanceColor) dotMesh.instanceColor.needsUpdate = true
    // the loop turns; a flash when tapped
    loopFlash = Math.max(0, loopFlash - dt / 1.5)
    for (let i = 0; i < LOOPN; i++) {
      const a = (i / LOOPN) * TAU - t * 0.25
      dummy.position.set(Math.cos(a) * LOOP.r, Math.sin(a) * LOOP.r, 0.06)
      dummy.scale.setScalar(0.055 * (1 + loopFlash * 0.6))
      dummy.updateMatrix()
      loopDots.setMatrixAt(i, dummy.matrix)
    }
    loopDots.instanceMatrix.needsUpdate = true
    // the drinks' rings and the tea's steam
    ringMat.opacity = damp(ringMat.opacity, G.oj ? 0.85 : 0, 6, dt)
    teaRingMat.opacity = damp(teaRingMat.opacity, G.tea ? 0.85 : 0, 6, dt)
    withOj.visible = !!G.oj
    withTea.visible = !!G.tea
    for (const s of steam) {
      const q = (t * 0.25 + s.userData.seed) % 1
      s.position.set(TEA.x + Math.sin(q * 9 + s.userData.seed * 20) * 0.15, teaCup.top + 0.05 + q * 1.4, TEA.z + Math.cos(q * 7) * 0.1)
      s.scale.setScalar(0.25 + q * 0.5)
      s.material.opacity = G.tea ? 0.32 * Math.sin(q * Math.PI) : 0
    }
  })
  const gateState = () => ({ plate: [...G.plate], oj: G.oj, tea: G.tea, eaten: G.eaten, letIn: G.letIn, meals: G.meals })
  function gateSet(s, live) {
    if (!s) return
    const ids = Array.isArray(s.plate) ? s.plate.filter(id => FOODS.some(f => f.id === id)) : []
    const meals = Math.max(0, Math.round(Number(s.meals) || 0))
    const ate = live && meals > G.meals && G.plate.length > 0 && !meal
    if (ate) startMeal([...G.plate], G.oj, G.tea, false)
    G.plate = [...new Set(ids)]
    G.oj = s.oj ? 1 : 0
    G.tea = s.tea ? 1 : 0
    G.meals = meals
    G.eaten = clamp(Number(s.eaten) || 0, 0, 999)
    G.letIn = clamp(Number(s.letIn) || 0, 0, 999)
    if (!ate) placeFoods(!live)
    if (!meal) letShown = G.letIn
    updateGateSign()
  }

  // the strip along the table's front edge is out of bounds, except the way to the frame: the camera is kept
  // in front of the frame (cameraBounds.maxZ), so a walker beyond it had the camera inside the Atomling
  solids.push(box(-6.4, 5.35, 9.2, 0.4), box(6.4, 5.35, 9.2, 0.4))

  // ---- arrival ----
  layFlakes(0, 0)
  poseCrane()
  updateCounter()
  updateGateSign()
  updates.push((dt, t) => stage.update(t))

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.9 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 3.8, yaw: 0 },
    hostSpot: { x: -2.4, z: 2.6, yaw: Math.atan2(-2.4, -1.2) },
    back: { x: 0, z: 6.6, rot: Math.PI },
    stand: { x: 3.3, z: 2.5, rot: Math.atan2(-3.3, 1.3) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      bowl: {
        tap: what => bowlStep(what), // 'crush' (the flakes), 'sweep' (the magnet), 'fresh' (the box), 'drop' (the flask)
        get state() { return bowlState() },
        get busy() { return busyBowl() },
        flakesAt: () => new THREE.Vector3(BOWL.x, MILK_Y + 0.1, BOWL.z),
        magnetAt: () => magnet.position.clone().add(new THREE.Vector3(0, -MH / 2, 0)),
        boxAt: () => new THREE.Vector3(BOX.x, 2.0, BOX.z + BOX.d / 2),
      },
      flask: {
        tap: what => (what === 'drop' ? bowlStep('drop') : flaskStep(what)), // 'flask', 'lens'; or 'drop' (the panel)
        ph: v => setPH(v, true), // the panel's slider
        get state() { return flaskState() },
        get lens() { return L.step },
        flaskAt: () => new THREE.Vector3(FLASK.x, FLASK.cy, FLASK.z),
        lensAt: () => lensFace.getWorldPosition(new THREE.Vector3()),
      },
      gate: {
        tap: what => gateStep(what), // a food's id, 'eat' (the plate or the fork), 'oj', 'tea', 'day', 'loop'
        get state() { return gateState() },
        foodAt: id => foods.find(f => f.id === id)?.g.position.clone().add(new THREE.Vector3(0, 0.3, 0)),
        plateAt: () => new THREE.Vector3(PLATE.x - PLATE.r * 0.85, 0.1, PLATE.z),
        ojAt: () => new THREE.Vector3(OJ.x, 1.5, OJ.z),
        teaAt: () => new THREE.Vector3(TEA.x, 0.8, TEA.z),
        loopAt: () => new THREE.Vector3(LOOP.x, LOOP.y, LOOP.z),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { bowl: bowlPanel, flask: flaskPanel, gate: gatePanel },
    shared: {
      bowl: { get: bowlState, set: (s, live) => bowlSet(s, live) },
      flask: { get: flaskState, set: (s, live, ago) => flaskSet(s, live, ago) },
      lens: {
        get: () => ({ step: L.step }),
        set: (s, live) => {
          const step = clamp(Math.round(Number(s?.step) || 0), 0, 3)
          if (step === L.step) return
          L.step = step
          L.t = live ? 0 : 9
          if (live) play(step === 2 ? 'electron' : step === 3 ? 'pop' : 'tap')
        },
      },
      gate: { get: gateState, set: (s, live) => gateSet(s, live) },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (phSend) clearTimeout(phSend)
      for (const tx of textures) tx.dispose()
    },
  }
}

// ---- the cereal box's print ----

/** The box's front: a sunny yellow, the name, a bowl of flakes, a spoon, "with iron". */
function drawBoxFront(g, w, h, words) {
  const grd = g.createLinearGradient(0, 0, 0, h)
  grd.addColorStop(0, '#f2b83c')
  grd.addColorStop(1, '#e08a2a')
  g.fillStyle = grd
  g.fillRect(0, 0, w, h)
  // a sun behind the name
  g.fillStyle = 'rgba(255,240,170,0.55)'
  g.beginPath()
  g.arc(w * 0.78, h * 0.12, w * 0.18, 0, TAU)
  g.fill()
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU
    g.strokeStyle = 'rgba(255,240,170,0.5)'
    g.lineWidth = 8
    g.beginPath()
    g.moveTo(w * 0.78 + Math.cos(a) * w * 0.21, h * 0.12 + Math.sin(a) * w * 0.21)
    g.lineTo(w * 0.78 + Math.cos(a) * w * 0.27, h * 0.12 + Math.sin(a) * w * 0.27)
    g.stroke()
  }
  g.fillStyle = '#b8261e'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `800 ${Math.round(w * 0.17)}px Outfit, Nunito, sans-serif`
  g.lineWidth = 10
  g.strokeStyle = '#fff4d8'
  g.strokeText(words.name, w / 2, h * 0.1)
  g.fillText(words.name, w / 2, h * 0.1)
  g.font = `700 ${Math.round(w * 0.06)}px Outfit, Nunito, sans-serif`
  g.fillStyle = '#5a2a10'
  g.fillText(words.sub, w / 2, h * 0.19)
  // a bowl of flakes near the bottom
  const by = h * 0.82
  g.fillStyle = '#2f6fd5'
  g.beginPath()
  g.ellipse(w / 2, by, w * 0.36, h * 0.07, 0, 0, Math.PI)
  g.fill()
  g.fillStyle = '#e6ddc8'
  g.beginPath()
  g.ellipse(w / 2, by, w * 0.36, h * 0.02, 0, 0, TAU)
  g.fill()
  const rnd = random(3)
  for (let i = 0; i < 26; i++) {
    g.fillStyle = rnd() < 0.5 ? '#e0a248' : '#c97e32'
    g.beginPath()
    g.ellipse(w / 2 + (rnd() - 0.5) * w * 0.6, by - h * 0.012 - rnd() * h * 0.04, 18 + rnd() * 12, 9 + rnd() * 6, rnd() * TAU, 0, TAU)
    g.fill()
  }
}

/** The box's side: the panel of what is in it (iron per bowl). */
function drawBoxSide(g, w, h, words, mg) {
  g.fillStyle = '#e9a43a'
  g.fillRect(0, 0, w, h)
  g.fillStyle = '#fbf3e2'
  g.fillRect(w * 0.08, h * 0.3, w * 0.84, h * 0.4)
  g.fillStyle = '#3a2410'
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  g.font = `800 ${Math.round(w * 0.11)}px Outfit, Nunito, sans-serif`
  g.fillText(words.facts, w * 0.13, h * 0.35)
  g.fillRect(w * 0.12, h * 0.38, w * 0.76, 4)
  g.font = `600 ${Math.round(w * 0.085)}px Outfit, Nunito, sans-serif`
  const lines = [[words.iron, `${mg} mg`], ...words.rows]
  lines.forEach(([a, b], i) => {
    const y = h * 0.43 + i * h * 0.05
    g.textAlign = 'left'
    g.fillText(a, w * 0.13, y)
    g.textAlign = 'right'
    g.fillText(b, w * 0.87, y)
  })
}
