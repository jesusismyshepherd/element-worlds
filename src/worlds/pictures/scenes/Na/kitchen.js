// Sodium's picture "What makes a cake rise?" as a room (docs/knowledge/picture-rooms.md): the picture's
// kitchen made into a place on a baking morning (stages/kitchen.js in daylight: blue tiles with a flower in
// each, a tiled floor, the sun coming in through the window over the sink, the oven and the fridge on the
// east wall). Three things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E
// through fixed steps felt passive), in the visitor's own order; the prompt names the next thing to tap, E
// opens the station's panel, whose buttons (and a slider for the heat) do the same:
// - the fizz test, by the sink: tap a glass (vinegar, lemon juice, water) to choose it, then a jar (baking
//   soda or baking powder) to spoon some in. The acids fizz with carbon dioxide and the foam spills over the
//   tray; soda in water does nothing; baking powder fizzes even in water (its own dry acid). The panel keeps
//   what was found;
// - two cakes, by the oven: tap a tin to choose it, the yoghurt or the soda to add some, the oven to bake
//   both (through its glass door one rises, the other stays flat), a cake to cut a slice and see its crumb
//   (a sponge of bubbles, or tight and heavy, or yellowish with soda alone), the mixer for new batter;
// - heat alone, on the west counter: a test tube of soda over a spirit burner, its gas led into limewater.
//   A temperature slider (or a tap on the burner): above about 80 °C the soda breaks down by itself, drops
//   of water gather at the cool end, the limewater turns milky; then a pinch of fresh soda and a pinch from
//   the tube in red cabbage juice: blue for the soda, green for the sodium carbonate left (the soapy taste of
//   too much soda). Chosen over the salt shaker: it finishes the baking soda's story, the salt is another
//   picture's (the salt pans).
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { kitchenStage, TOP } from '../../stages/kitchen.js'
import { ease, motes } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText } from '../../../../engine/text.js'
import { KITCHEN_WORDS } from './kitchen.words.js'

export const WORDS = KITCHEN_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const FIZZ_C = '#ffd25e'
const CAKE_C = '#ff9e5e'
const HEAT_C = '#7fb8ff'
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)

// ---- small pieces ----

function softDot() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.45, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A paper label on the tiles (facing +z), its edge in the station's colour, sized to its word. */
function wallSign(word, color, M, { size = 0.045, maxWidth = 0.5 } = {}) {
  const g = new THREE.Group()
  const edgeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const edge = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.01), edgeMat)
  const board = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.016), M.card)
  board.position.z = 0.004
  const text = makeText(word, { size, color: '#3a2412', anchorX: 'center', anchorY: 'middle', maxWidth, lineHeight: 1.05 })
  text.position.z = 0.014
  g.add(edge, board, text)
  const fit = (w, h) => {
    board.scale.set(w + size * 1.1, h + size * 0.9, 1)
    edge.scale.set(w + size * 1.1 + 0.022, h + size * 0.9 + 0.022, 1)
  }
  fit(Math.min(maxWidth, word.length * size * 0.56), size)
  text.addEventListener('synccomplete', () => {
    const b = text.textRenderInfo?.blockBounds
    if (b) fit(b[2] - b[0], b[3] - b[1])
  })
  return { group: g, text, fit }
}

/** An open glass (its base on y = 0): the side, a thick bottom. */
function glassCup(M, { r0, r1, h }) {
  const g = new THREE.Group()
  const side = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 32, 1, true).translate(0, h / 2, 0), M.glass)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r0, r0, 0.012, 32).translate(0, 0.006, 0), M.glass)
  side.renderOrder = 3
  base.renderOrder = 3
  g.add(side, base)
  return g
}

/** The liquid in a glass, from its bottom up to `level`. */
function liquidIn(mat, { r0, r1, h }, level) {
  const rAt = y => lerp(r0, r1, y / h) * 0.93
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rAt(level), rAt(0.012), level - 0.012, 28).translate(0, 0.012 + (level - 0.012) / 2, 0), mat)
  m.renderOrder = 2
  return m
}

/** A glass jar of powder with a coloured lid (its base on y = 0); the lid is its own group, to lift. */
function powderJar(M, { r = 0.066, h = 0.17, fill = 0.11, lid }) {
  const g = new THREE.Group()
  g.add(glassCup(M, { r0: r, r1: r, h }))
  const powder = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, fill, 28).translate(0, 0.012 + fill / 2, 0), M.powder)
  // a little heap on top of the powder
  const heap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.88, 24, 8, 0, TAU, 0, Math.PI / 2).scale(1, 0.22, 1), M.powder)
  heap.position.y = 0.012 + fill
  g.add(powder, heap)
  const cap = new THREE.Group()
  cap.position.y = h
  const lidMat = new THREE.MeshStandardMaterial({ color: lid, roughness: 0.45 })
  const top = new THREE.Mesh(new RoundedBoxGeometry(r * 2.15, 0.034, r * 2.15, 2, 0.012), lidMat)
  top.position.y = 0.017
  cap.add(top)
  g.add(cap)
  return { group: g, cap, mouth: h }
}

/** A teaspoon: its bowl at the origin, the handle along +x; a heap of powder in the bowl. */
function teaspoon(M) {
  const g = new THREE.Group()
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.026, 18, 8, 0, TAU, Math.PI / 2, Math.PI / 2).scale(1.25, 0.45, 0.9), M.steel)
  const handle = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.007, 0.016, 2, 0.003), M.steel)
  handle.position.set(0.1, 0.008, 0)
  handle.rotation.z = 0.12
  const heap = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 6, 0, TAU, 0, Math.PI / 2).scale(1.2, 0.55, 0.85), M.powder)
  heap.position.y = -0.002
  g.add(bowl, handle, heap)
  return { group: g, heap }
}

// ---- the cake: a lathe of its outline, cut into the cake left and a slice that comes out ----

const WEDGE = 1.0 // the slice's angle, radians

/** A cake of radius R and height 1 (scaled to its height): the whole cake, the cake with a slice cut out,
 *  the slice (in its own pivot, to move out), the cut faces showing the crumb. */
function cakeMesh(R, crustMat, crumbMat) {
  const prof = [[0, 0], [R * 0.97, 0], [R, 0.03], [R, 0.74], [R * 0.97, 0.84], [R * 0.88, 0.92], [R * 0.7, 0.975], [R * 0.4, 0.997], [0, 1]].map(([x, y]) => new THREE.Vector2(x, y))
  const faceGeo = (() => {
    const geo = new THREE.ShapeGeometry(new THREE.Shape(prof), 4)
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / R, p.getY(i))
    return geo
  })()
  const face = phi => {
    const m = new THREE.Mesh(faceGeo, crumbMat)
    m.rotation.y = phi - Math.PI / 2
    return m
  }
  const group = new THREE.Group()
  const whole = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), crustMat)
  const rest = new THREE.Group()
  rest.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48, WEDGE / 2, TAU - WEDGE), crustMat), face(WEDGE / 2), face(-WEDGE / 2))
  const pivot = new THREE.Group()
  const slice = new THREE.Group()
  slice.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 10, -WEDGE / 2, WEDGE), crustMat), face(WEDGE / 2), face(-WEDGE / 2))
  pivot.add(slice)
  group.add(whole, rest, pivot)
  rest.visible = false
  pivot.visible = false
  // where the slice's middle starts (its centroid, about two thirds out), for placing it on its plate
  const mid = V3(0, 0, R * 0.62)
  return { group, whole, rest, pivot, slice, mid }
}

/** The crumb seen on a cut face: a sponge of round holes (open), tight and small (dense), or yellowish. */
function crumbTexture(kind) {
  const rnd = random(kind === 'open' ? 21 : kind === 'dense' ? 22 : 23)
  return canvasTex(256, 256, (g, w, h) => {
    const base = kind === 'open' ? '#e8c987' : kind === 'dense' ? '#cfa868' : '#d9c255'
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    const n = kind === 'open' ? 170 : kind === 'dense' ? 260 : 110
    for (let i = 0; i < n; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const r = kind === 'open' ? 3 + rnd() ** 2 * 15 : kind === 'dense' ? 0.8 + rnd() * 2.2 : 2 + rnd() ** 2 * 9
      g.fillStyle = kind === 'soapy' ? 'rgba(120,96,20,0.55)' : 'rgba(130,86,34,0.55)'
      g.beginPath()
      g.ellipse(x, y, r, r * (0.8 + rnd() * 0.3), rnd() * 3, 0, TAU)
      g.fill()
      // the lit lower rim of each hole
      g.strokeStyle = 'rgba(255,240,200,0.35)'
      g.lineWidth = Math.max(0.6, r * 0.18)
      g.beginPath()
      g.arc(x, y, r, 0.2, Math.PI - 0.2)
      g.stroke()
    }
    // the crust round the edge of the face (u = 1 is the outside, v = 1 the top)
    g.fillStyle = 'rgba(150,84,30,0.9)'
    g.fillRect(w - 8, 0, 8, h)
    g.fillRect(0, 0, w, 7)
  })
}

/** The crust, light grey to be tinted by the cake's colour (batter, golden, yellowish): darker where the
 *  oven browns it most (the bottom, the rim of the top), speckled on top. Along v: 0 the bottom, 1 the
 *  middle of the top (the lathe's outline). */
function crustTexture() {
  const rnd = random(27)
  return canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, '#9a9a9a')
    grd.addColorStop(0.08, '#e6e6e6')
    grd.addColorStop(0.36, '#f2f2f2')
    grd.addColorStop(0.42, '#c8c8c8')
    grd.addColorStop(0.6, '#d6d6d6')
    grd.addColorStop(1, '#ffffff')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 260; i++) {
      const y = rnd() * h * 0.6
      g.fillStyle = `rgba(90,60,30,${0.08 + rnd() * 0.14})`
      g.fillRect(rnd() * w, y, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const stage = kitchenStage({
    light,
    time: 'morning',
    tiles: 'square',
    tile: '#4a7fa6',
    grout: '#36607e',
    floorStyle: 'tiles',
    floorTiles: ['#a8603f', '#bf9366'],
    wood: '#b98552',
    cabinet: '#c4964c',
    fridgeColor: '#c45a4c',
    ceilingColor: '#9c8f80',
    shade: '#2f7090',
    ovenLabel: '180 °C',
    runs: [
      ['n', -5.2, 4.4],
      ['e', -4.52, -1.96],
      ['e', -1.04, 6.8],
      ['w', -4.76, 6.8],
      ['s', -4.56, -1.9],
      ['s', 1.9, 4.56],
    ],
    uppers: [
      ['n', -4.9, -1.5],
      ['n', 1.5, 4.3],
      ['w', 1.4, 4.6],
    ],
    oven: { wall: 'e', at: -1.5 },
    fridge: { wall: 'e', at: -4.95 },
    window: { wall: 'n', at: 0, width: 2.3 },
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  let clock = 0
  const paras = list => list.map(p => ({ p }))
  // a panel already open is written again when what it shows changed (a choice, a result)
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still at
   *  that station (not at another one they walked to while it played out). */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  /** Something stood on the worktop: at `at` along `wall`, `out` from it, its local +z into the room. */
  const onTop = (obj, wall, atW, out, y = TOP) => {
    const p = stage.place(wall, atW, out)
    obj.position.set(p.x, y, p.z)
    obj.rotation.y = p.rot
    root.add(obj)
    return obj
  }
  const signOn = (word, color, wall, atW, y, opts) => {
    const s = wallSign(word, color, M, opts)
    onTop(s.group, wall, atW, 0.012, y)
    return s
  }

  const dotTex = softDot()
  textures.push(dotTex)
  const M = {
    glass: new THREE.MeshStandardMaterial({ color: '#eef6fb', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide }),
    powder: new THREE.MeshStandardMaterial({ color: '#dedad2', roughness: 1 }),
    card: new THREE.MeshStandardMaterial({ color: '#d6bf98', roughness: 0.85 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b3bbc4', roughness: 0.25, metalness: 0.85 }),
    tray: new THREE.MeshStandardMaterial({ color: '#6f7f8c', roughness: 0.35, metalness: 0.55 }),
    wood: new THREE.MeshStandardMaterial({ color: '#8a5a36', roughness: 0.75 }),
    foam: new THREE.MeshStandardMaterial({ color: '#e9dfcb', roughness: 0.95 }),
    bubble: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.6, depthWrite: false }),
    ring: new THREE.MeshBasicMaterial({ color: FIZZ_C, transparent: true, opacity: 0.85, depthWrite: false }),
    tin: new THREE.MeshStandardMaterial({ color: '#59606a', roughness: 0.35, metalness: 0.65, side: THREE.DoubleSide }),
    plate: new THREE.MeshStandardMaterial({ color: '#d9d3c9', roughness: 0.4 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2d36', roughness: 0.5 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#7a2c24', roughness: 0.8 }),
    drop: new THREE.MeshStandardMaterial({ color: '#dff2ff', roughness: 0.05, transparent: true, opacity: 0.75, depthWrite: false }),
    fog: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    grain: new THREE.MeshBasicMaterial({ color: '#f2efe8' }),
  }

  // ======== 1. the fizz test, on the counter beside the sink ========
  const FZ_AT = -2.1
  const LIQ = ['vinegar', 'lemon', 'water']
  const POW = ['soda', 'powder']
  const GL = { r0: 0.046, r1: 0.056, h: 0.165 }
  const LEVEL = 0.105
  const TRAY_Y = 0.022
  const tray = onTop(new THREE.Group(), 'n', FZ_AT, 0.3)
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.92, 0.02, 0.36, 2, 0.008), M.tray)
    base.position.y = 0.01
    tray.add(base)
    for (const [w, d, x, z] of [[0.92, 0.012, 0, 0.174], [0.92, 0.012, 0, -0.174], [0.012, 0.36, 0.454, 0], [0.012, 0.36, -0.454, 0]]) {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, d), M.tray)
      rim.position.set(x, 0.025, z)
      tray.add(rim)
    }
  }
  const liqMats = {
    vinegar: new THREE.MeshStandardMaterial({ color: '#c99a4e', roughness: 0.1, transparent: true, opacity: 0.72, depthWrite: false }),
    lemon: new THREE.MeshStandardMaterial({ color: '#e9cf45', roughness: 0.3, transparent: true, opacity: 0.88, depthWrite: false }),
    water: new THREE.MeshStandardMaterial({ color: '#9ccbe8', roughness: 0.05, transparent: true, opacity: 0.38, depthWrite: false }),
  }
  const GLX = { vinegar: -0.3, lemon: 0, water: 0.3 }
  const glasses = {}
  for (const k of LIQ) {
    const g = new THREE.Group()
    g.position.set(GLX[k], TRAY_Y, 0)
    g.add(glassCup(M, GL), liquidIn(liqMats[k], GL, LEVEL))
    tray.add(g)
    glasses[k] = g
  }
  // half a lemon and the vinegar's bottle, so the glasses read at a glance
  {
    // half a lemon, its cut face turned up toward the room
    const half = new THREE.Group()
    const peel = new THREE.Mesh(new THREE.SphereGeometry(0.042, 20, 10, 0, TAU, 0, Math.PI / 2).scale(1, 0.8, 1.15), new THREE.MeshStandardMaterial({ color: '#efc935', roughness: 0.6 }))
    const flesh = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20).scale(1, 1.15, 1).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#f6e27a', roughness: 0.5, side: THREE.DoubleSide }))
    flesh.position.y = -0.001
    half.add(peel, flesh)
    half.rotation.x = Math.PI + 0.6
    half.position.set(0.15, TRAY_Y + 0.036, -0.1)
    tray.add(half)
    const bottle = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.036, 0.2, 20).translate(0, 0.1, 0), new THREE.MeshStandardMaterial({ color: '#8a5a24', roughness: 0.15, transparent: true, opacity: 0.85 }))
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.07, 16).translate(0, 0.235, 0), body.material)
    const capB = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 12).translate(0, 0.28, 0), M.dark)
    bottle.add(body, neck, capB)
    // behind the tray, by the wall
    bottle.position.set(-0.4, 0, -0.24)
    tray.add(bottle)
  }
  // the jars, left of the tray
  // (close to the tray: an upright phone's station view is narrow)
  const JAR_AT = { soda: FZ_AT - 0.66, powder: FZ_AT - 1.0 }
  const jars = {
    soda: powderJar(M, { lid: '#e2722e' }),
    powder: powderJar(M, { lid: '#3d7fd1' }),
  }
  for (const k of POW) onTop(jars[k].group, 'n', JAR_AT[k], 0.3)
  // the words on the tiles over each thing (the middle ones higher, so neighbours never overlap)
  signOn(E.fizz.signs.vinegar, FIZZ_C, 'n', FZ_AT + GLX.vinegar, TOP + 0.36)
  signOn(E.fizz.signs.lemon, FIZZ_C, 'n', FZ_AT + GLX.lemon, TOP + 0.5)
  signOn(E.fizz.signs.water, FIZZ_C, 'n', FZ_AT + GLX.water, TOP + 0.36)
  signOn(E.fizz.signs.soda, '#e2722e', 'n', JAR_AT.soda, TOP + 0.36)
  signOn(E.fizz.signs.powder, '#3d7fd1', 'n', JAR_AT.powder, TOP + 0.5)
  // the spoon, lying in front of the jars
  const spoon = teaspoon(M)
  // (a big spoon: a teaspoon is lost at arm's length)
  spoon.group.scale.setScalar(1.5)
  root.add(spoon.group)
  const spoonRest = (() => {
    const p = stage.place('n', (JAR_AT.soda + JAR_AT.powder) / 2, 0.52)
    return { pos: V3(p.x, TOP + 0.006, p.z), rot: new THREE.Euler(0, 0.4, 0) }
  })()
  // the chosen glass: a glowing ring on the tray under it
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.064, 0.08, 40).rotateX(-Math.PI / 2), M.ring)
  ring.position.y = TRAY_Y + 0.002
  ring.visible = false
  tray.add(ring)
  // the foam (one set, moved to the glass that fizzes): a column in the glass, a dome over it, drips down
  // its side and a puddle on the tray; bubbles rising in the liquid; the powder falling in
  const foamTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#ece3d0'
    g.fillRect(0, 0, w, h)
    const rnd = random(31)
    for (let i = 0; i < 260; i++) {
      const r = 1.5 + rnd() * 6
      const x = rnd() * w
      const y = rnd() * h
      g.strokeStyle = `rgba(150,130,100,${0.15 + rnd() * 0.25})`
      g.lineWidth = 1.2
      g.beginPath()
      g.arc(x, y, r, 0, TAU)
      g.stroke()
      g.fillStyle = 'rgba(255,255,255,0.35)'
      g.beginPath()
      g.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, TAU)
      g.fill()
    }
  })
  foamTex.wrapS = foamTex.wrapT = THREE.RepeatWrapping
  textures.push(foamTex)
  M.foam.map = foamTex
  const foam = new THREE.Group()
  tray.add(foam)
  const column = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 28, 1, true).translate(0, 0.5, 0), M.foam)
  const domeGeo = new THREE.SphereGeometry(1, 28, 12, 0, TAU, 0, Math.PI / 2)
  {
    // bumps: a foam's top is lumpy
    const p = domeGeo.attributes.position
    const rnd = random(41)
    const bumps = Array.from({ length: 9 }, () => ({ a: rnd() * TAU, b: 0.3 + rnd() * 1.1, k: 0.06 + rnd() * 0.08 }))
    for (let i = 0; i < p.count; i++) {
      const v = V3(p.getX(i), p.getY(i), p.getZ(i))
      const az = Math.atan2(v.z, v.x)
      const el = Math.asin(clamp(v.y, -1, 1))
      let k = 1
      for (const b of bumps) k += b.k * Math.exp(-((Math.cos(az - b.a) - 1) ** 2 * 18 + (el - b.b) ** 2 * 6))
      p.setXYZ(i, v.x * k, v.y * k, v.z * k)
    }
    domeGeo.computeVertexNormals()
  }
  const dome = new THREE.Mesh(domeGeo, M.foam)
  const drips = Array.from({ length: 6 }, (_, i) => {
    const d = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 1, 4, 10).translate(0, -0.5, 0), M.foam)
    const a = (i / 6) * TAU + 0.3
    d.userData.a = a
    foam.add(d)
    return d
  })
  const puddle = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 8, 0, TAU, 0, Math.PI / 2), M.foam)
  foam.add(column, dome, puddle)
  foam.visible = false
  const BUB = light ? 24 : 48
  const bubbleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), M.bubble, BUB)
  bubbleMesh.count = 0
  bubbleMesh.frustumCulled = false
  bubbleMesh.renderOrder = 4
  tray.add(bubbleMesh)
  const GRAINS = 14
  const grains = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0045, 6, 4), M.grain, GRAINS)
  grains.frustumCulled = false
  grains.visible = false
  tray.add(grains)
  // the soda that only sinks and dissolves (in water)
  const sunk = new THREE.Mesh(new THREE.SphereGeometry(0.03, 18, 8, 0, TAU, 0, Math.PI / 2).scale(1, 0.35, 1), M.powder)
  sunk.visible = false
  tray.add(sunk)

  const FIZZ_K = { 'vinegar:soda': 1, 'lemon:soda': 0.92, 'water:soda': 0, 'water:powder': 0.55, 'vinegar:powder': 0.66, 'lemon:powder': 0.6 }
  const resultOf = key => (FIZZ_K[key] >= 0.85 ? 'big' : FIZZ_K[key] > 0 ? 'some' : 'none')
  const FIZZ_T = 8.5 // the whole of one spoonful: the spoon's trip, the fizz, the glass settling
  const R0 = 1.6 // when the powder reaches the liquid
  const F = { pick: null, last: null, n: 0, start: -99, tried: [], mine: false, sound: false, cue: 0, said: true }
  const fizzAge = () => clock - F.start
  const fizzBusy = () => !!F.last && fizzAge() < FIZZ_T
  const startFizz = (key, age, sound) => {
    F.last = key
    F.start = clock - age
    F.sound = sound
    F.cue = 0
    F.said = age > R0 + 0.6
    bubbles.length = 0
  }
  const bubbles = []
  const fizzPanel = lv => ({
    title: E.fizz.title,
    color: FIZZ_C,
    blocks: [
      ...paras(E.fizz.panel[depth(lv)]),
      { buttons: LIQ.map(k => ({ label: E.fizz.verbs[k], accent: F.pick === k, onClick: () => fizzStep(k) })) },
      { buttons: POW.map(k => ({ label: E.fizz.verbs[k], onClick: () => fizzStep(k) })) },
      ...(F.tried.length
        ? [{ h: E.fizz.found }, { rows: F.tried.map(key => [key.split(':').map(s => E.fizz.signs[s]).join(' + '), E.fizz.results[resultOf(key)]]) }]
        : []),
    ],
  })
  function fizzStep(step) {
    const lv = level()
    if (LIQ.includes(step)) {
      F.pick = step
      play('tap')
      say(at(E.fizz.picked[step], lv), FIZZ_C)
      share('fizz')
      refresh(fizzPanel)
      return
    }
    if (!POW.includes(step)) return
    if (!F.pick) return say(at(E.fizz.first, lv), FIZZ_C)
    if (fizzBusy()) return say(at(W.busy, lv))
    const key = `${F.pick}:${step}`
    F.n++
    F.mine = true
    if (!F.tried.includes(key)) F.tried.push(key)
    startFizz(key, 0, true)
    share('fizz')
    findOnce('fizz', fizzPanel, FIZZ_T - 1)
  }
  ex.add({
    id: 'fizz',
    x: FZ_AT - 0.2,
    z: stage.place('n', 0, 1.75).z,
    radius: 1.8,
    label: E.fizz.label,
    verb: () => {
      const H = E.fizz.hints
      if (!F.pick) return H.pick
      return POW.every(p => F.tried.includes(`${F.pick}:${p}`)) ? H.more : H.spoon
    },
    manual: true,
    focus: { x: FZ_AT - 0.4, y: TOP + 0.25, z: stage.place('n', 0, 0.3).z, size: 1.7 },
    act: () => ctx.showPanel(fizzPanel),
  })
  for (const k of LIQ) clickable(glasses[k], () => fizzStep(k))
  for (const k of POW) clickable(jars[k].group, () => fizzStep(k))

  // the spoon's trip: from its place to above the jar, in and out, over the glass, tipped, and back
  const sp = { pos: V3(0, 0, 0), q: new THREE.Quaternion() }
  const local = (obj, x, y, z) => {
    obj.updateWorldMatrix(true, false)
    return obj.localToWorld(V3(x, y, z))
  }
  const spoonAt = (a, jarK, liq) => {
    const jar = jars[jarK].group
    const glassTop = local(tray, GLX[liq], TRAY_Y + GL.h + 0.07, 0)
    const above = local(jar, 0, 0.3, 0)
    const inside = local(jar, 0, 0.15, 0)
    const pts = [spoonRest.pos, above, inside, above, glassTop]
    const times = [0, 0.35, 0.5, 0.65, 1.3]
    let pos
    if (a >= 1.3 && a < 1.6) pos = glassTop
    else if (a >= 1.6) pos = glassTop.clone().lerp(spoonRest.pos, span(1.6, 2.3, a))
    else {
      let i = times.findIndex((t, j) => a >= t && a < times[j + 1])
      if (i < 0) i = 0
      const u = ease((a - times[i]) / (times[i + 1] - times[i]))
      pos = pts[i].clone().lerp(pts[i + 1], u)
      if (i === 3) pos.y += Math.sin(Math.PI * u) * 0.08
    }
    sp.pos.copy(pos)
    // flat while carried, the handle toward the room; tipped over the glass
    const tip = a < 1.3 ? 0 : a < 1.45 ? span(1.3, 1.45, a) : a < 1.6 ? 1 : 1 - span(1.6, 1.9, a)
    const lying = 1 - span(0, 0.3, a) + span(1.9, 2.3, a)
    const e = new THREE.Euler(tip * 2.0, FZ_ROT - Math.PI / 2 + lying * 0.4, 0, 'YXZ')
    sp.q.setFromEuler(e)
    return tip
  }
  const FZ_ROT = stage.place('n', 0, 0).rot
  const grainSeeds = Array.from({ length: GRAINS }, (_, i) => {
    const r = random(500 + i)
    return { x: (r() - 0.5) * 0.03, z: (r() - 0.5) * 0.03, d: r() * 0.12 }
  })
  const dummy = new THREE.Object3D()
  const CUES = [[0.45, 'tap'], [1.4, 'part']]
  updates.push(dt => {
    const a = fizzAge()
    // (a boolean: three hides an object only when visible === false)
    const on = !!F.last && a < FIZZ_T
    const [liq, pow] = on ? F.last.split(':') : [null, null]
    const k = on ? FIZZ_K[F.last] ?? 0 : 0
    // the chosen glass's ring, breathing
    ring.visible = !!F.pick
    if (F.pick) {
      ring.position.x = GLX[F.pick]
      M.ring.opacity = 0.55 + Math.sin(clock * 3.2) * 0.3
    }
    // the spoon and the jar's lid
    for (const j of POW) jars[j].cap.position.set(0, jars[j].mouth, 0)
    for (const j of POW) jars[j].cap.rotation.set(0, 0, 0)
    if (on && a < 2.3) {
      spoonAt(a, pow, liq)
      spoon.group.position.copy(sp.pos)
      spoon.group.quaternion.copy(sp.q)
      spoon.heap.visible = a > 0.5 && a < 1.45
      const lift = span(0, 0.3, a) * (1 - span(0.6, 0.9, a))
      jars[pow].cap.position.set(0.09 * lift, jars[pow].mouth + 0.07 * lift, 0)
      jars[pow].cap.rotation.z = -0.9 * lift
    } else {
      spoon.group.position.copy(spoonRest.pos)
      spoon.group.rotation.copy(spoonRest.rot)
      spoon.group.rotation.y += FZ_ROT - Math.PI / 2
      spoon.heap.visible = false
    }
    if (on && F.sound) while (F.cue < CUES.length && a >= CUES[F.cue][0]) play(CUES[F.cue++][1])
    // the powder falling in
    grains.visible = on && a > 1.38 && a < 1.8
    if (grains.visible) {
      grainSeeds.forEach((s, i) => {
        const t = a - 1.38 - s.d * 0.4
        const y = Math.max(TRAY_Y + LEVEL, TRAY_Y + GL.h + 0.06 - 4.9 * Math.max(0, t) ** 2)
        dummy.position.set(GLX[liq] + s.x, y, s.z)
        dummy.scale.setScalar(t < 0 || y <= TRAY_Y + LEVEL + 0.001 ? 0.001 : 1)
        dummy.updateMatrix()
        grains.setMatrixAt(i, dummy.matrix)
      })
      grains.instanceMatrix.needsUpdate = true
    }
    // what happens in the glass
    const u = a - R0
    foam.visible = on && k > 0 && u > 0
    sunk.visible = on && k === 0 && u > 0
    if (sunk.visible) {
      sunk.position.set(GLX[liq], TRAY_Y + 0.013, 0)
      const s = span(0, 0.6, u) * (1 - span(2.5, 5.5, u))
      sunk.scale.setScalar(Math.max(0.001, s))
    }
    if (foam.visible) {
      foam.position.set(GLX[liq], TRAY_Y, 0)
      const grow = span(0, 0.9, u)
      const decay = span(2.8, 5.8, u)
      const top = LEVEL + k * (GL.h - LEVEL + 0.035 + 0.045 * k) * grow * (1 - 0.85 * decay)
      const inner = GL.r1 * 0.93
      const colTop = Math.min(top, GL.h)
      column.position.y = LEVEL
      column.scale.set(inner, Math.max(0.001, colTop - LEVEL), inner)
      const over = Math.max(0, top - GL.h)
      const domeR = over > 0 ? GL.r1 * (1 + 0.35 * clamp(over / 0.05)) : inner * 0.98
      dome.position.y = colTop
      dome.scale.set(domeR, Math.max(0.006, over > 0 ? over + 0.012 : 0.01 + (top - LEVEL) * 0.2), domeR)
      // spilling over: drips down the glass and a puddle on the tray (the strongest only)
      const spill = k >= 0.85 ? span(0.6, 1.6, u) * (1 - span(3.6, 6.2, u)) : 0
      drips.forEach((d, i) => {
        d.visible = spill > 0.02
        if (!d.visible) return
        const len = spill * (0.06 + ((i * 37) % 7) * 0.012)
        d.position.set(Math.cos(d.userData.a) * GL.r1 * 1.08, GL.h + 0.006, Math.sin(d.userData.a) * GL.r1 * 1.08)
        d.scale.set(1, len, 1)
      })
      const pud = k >= 0.85 ? span(1.0, 2.4, u) * (1 - span(4.5, 6.6, u)) : 0
      puddle.visible = pud > 0.02
      puddle.scale.set(0.1 * pud + 0.05, 0.012 * pud, 0.1 * pud + 0.05)
      puddle.position.y = 0.0
      // bubbles: many while it fizzes hard, fewer as it calms
      const rate = k * (u < 2.5 ? 70 : u < 4.6 ? 70 * (1 - (u - 2.5) / 2.1) : 0)
      if (bubbles.length < BUB && Math.random() < rate * dt) {
        const ang = Math.random() * TAU
        const rr = Math.sqrt(Math.random()) * GL.r0 * 0.8
        bubbles.push({ x: Math.cos(ang) * rr, z: Math.sin(ang) * rr, y: 0.016, v: 0.08 + Math.random() * 0.08, r: 0.0025 + Math.random() * 0.004 })
      }
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]
      b.y += b.v * dt
      if (!on || b.y > LEVEL) bubbles.splice(i, 1)
    }
    bubbleMesh.count = bubbles.length
    bubbles.forEach((b, i) => {
      dummy.position.set((liq ? GLX[liq] : 0) + b.x, TRAY_Y + b.y, b.z)
      dummy.scale.setScalar(b.r)
      dummy.updateMatrix()
      bubbleMesh.setMatrixAt(i, dummy.matrix)
    })
    bubbleMesh.instanceMatrix.needsUpdate = true
    // the Atomling tells whoever spooned it what happened, once it shows
    if (on && !F.said && u > 0.6) {
      F.said = true
      if (F.mine) say(at(E.fizz.says[F.last], level()), FIZZ_C)
      if (F.sound && k > 0) play('fizz')
      refresh(fizzPanel)
    }
  })

  // ======== 2. two cakes, between the fridge and the oven ========
  const CK = { mixer: -4.12, yog: -3.68, tins: [-3.25, -2.72], soda: -2.3 }
  const TIN = { R: 0.135, h: 0.065 }
  const RAW_H = 0.034
  const HEIGHT = { open: 0.135, soapy: 0.085, dense: 0.046 }
  const COLOR = { raw: new THREE.Color('#e8cc88'), open: new THREE.Color('#c98236'), soapy: new THREE.Color('#cfa336'), dense: new THREE.Color('#b5783c') }
  const crumbTex = { open: crumbTexture('open'), dense: crumbTexture('dense'), soapy: crumbTexture('soapy') }
  const crustTex = crustTexture()
  textures.push(...Object.values(crumbTex), crustTex)
  const PLATE_Z = 0.21 // the slice's plate, in front of its cake
  const tins = CK.tins.map((atW, i) => {
    const group = onTop(new THREE.Group(), 'e', atW, 0.3)
    const rest = { pos: group.position.clone(), quat: group.quaternion.clone() }
    const tinRing = new THREE.Mesh(new THREE.CylinderGeometry(TIN.R + 0.006, TIN.R + 0.004, TIN.h, 44, 1, true).translate(0, TIN.h / 2, 0), M.tin)
    const lip = new THREE.Mesh(new THREE.TorusGeometry(TIN.R + 0.007, 0.004, 6, 44).rotateX(Math.PI / 2), M.tin)
    lip.position.y = TIN.h
    const ringG = new THREE.Group()
    ringG.add(tinRing, lip)
    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(TIN.R + 0.012, TIN.R + 0.012, 0.006, 44).translate(0, 0.003, 0), M.tin)
    const crust = new THREE.MeshStandardMaterial({ color: COLOR.raw.clone(), map: crustTex, roughness: 0.55 })
    const crumb = new THREE.MeshStandardMaterial({ map: crumbTex.open, roughness: 0.9, side: THREE.DoubleSide })
    const cake = cakeMesh(TIN.R, crust, crumb)
    cake.group.position.y = 0.006
    // a plate for the slice, in front
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.012, 32).translate(0, 0.006, 0), M.plate)
    plate.position.set(0, 0, PLATE_Z)
    plate.visible = false
    // the yoghurt's dollop and the soda's heap on the batter, stirred in; bubbles when both are in
    const dollop = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 8).scale(1, 0.4, 1), new THREE.MeshStandardMaterial({ color: '#efe9de', roughness: 0.6, transparent: true }))
    const heap = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 6, 0, TAU, 0, Math.PI / 2).scale(1, 0.5, 1), M.powder)
    dollop.visible = heap.visible = false
    const fizz = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), M.bubble, 12)
    fizz.frustumCulled = false
    fizz.visible = false
    group.add(ringG, baseDisc, cake.group, plate, dollop, heap, fizz)
    return { group, rest, ringG, cake, crust, crumb, plate, dollop, heap, fizz, i }
  })
  // the cards on the tiles behind the tins: what is in each
  const tinCards = CK.tins.map(atW => signOn(E.cakes.signs.plain, CAKE_C, 'e', atW, TOP + 0.3, { size: 0.036, maxWidth: 0.3 }))
  // the yoghurt, the soda, the mixer
  const yog = onTop(new THREE.Group(), 'e', CK.yog, 0.36)
  {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.095, 28).translate(0, 0.0475, 0), new THREE.MeshStandardMaterial({ color: '#e6e0d3', roughness: 0.5 }))
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0545, 0.05, 0.035, 28, 1, true).translate(0, 0.05, 0), new THREE.MeshStandardMaterial({ color: '#3d6fb5', roughness: 0.5, side: THREE.DoubleSide }))
    const foil = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.006, 28).translate(0, 0.098, 0), M.steel)
    const inside = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#f1ece2', roughness: 0.6 }))
    inside.position.y = 0.09
    foil.position.set(0.05, 0.03, 0)
    foil.rotation.z = -1.2
    yog.add(pot, band, foil, inside)
  }
  const sodaJar = powderJar(M, { r: 0.055, h: 0.14, fill: 0.09, lid: '#e2722e' })
  onTop(sodaJar.group, 'e', CK.soda, 0.34)
  signOn(E.cakes.signs.yoghurt, CAKE_C, 'e', CK.yog, TOP + 0.52)
  signOn(E.fizz.signs.soda, '#e2722e', 'e', CK.soda, TOP + 0.52)
  const mixer = onTop(new THREE.Group(), 'e', CK.mixer, 0.32)
  const mixerMat = new THREE.MeshStandardMaterial({ color: '#6fb1a2', roughness: 0.35, metalness: 0.1 })
  const beater = new THREE.Group()
  const mixHead = new THREE.Group()
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.05, 0.3, 3, 0.02), mixerMat)
    base.position.set(0, 0.025, 0)
    const col = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.3, 0.11, 3, 0.03), mixerMat)
    col.position.set(0, 0.2, -0.1)
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.12, 0.32, 3, 0.05), mixerMat)
    head.position.set(0, 0.0, 0.07)
    mixHead.position.set(0, 0.38, -0.1)
    mixHead.add(head)
    const bowl = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.1, 0.04], [0.115, 0.12], [0.118, 0.13]].map(([x, y]) => new THREE.Vector2(x, y)), 36), new THREE.MeshStandardMaterial({ color: '#c2c9d1', roughness: 0.2, metalness: 0.85, side: THREE.DoubleSide }))
    bowl.position.set(0, 0.05, 0.07)
    const batter = new THREE.Mesh(new THREE.CircleGeometry(0.1, 28).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#e5c886', roughness: 0.5 }))
    batter.position.set(0, 0.15, 0.07)
    // the whisk: wire loops round a shaft, hanging from the head into the bowl
    for (let i = 0; i < 4; i++) {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0025, 4, 20).scale(1, 1.6, 1), M.steel)
      loop.rotation.y = (i * Math.PI) / 4
      loop.position.y = -0.06
      beater.add(loop)
    }
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 8), M.steel)
    shaft.position.y = 0.03
    beater.add(shaft)
    beater.position.set(0, 0.25, 0.07)
    mixer.add(base, col, mixHead, bowl, batter, beater)
  }
  // an inner light for the oven while it bakes, and the paths into it
  const ovenLight = new THREE.PointLight('#ffb070', 0, 1.4, 2)
  ovenLight.position.copy(stage.oven.inside).add(V3(-0.05, 0.32, 0))
  root.add(ovenLight)
  const ovenAlong = V3(1, 0, 0).applyQuaternion(stage.oven.group.quaternion)
  const paths = tins.map(t => {
    const off = (t.i ? 1 : -1) * 0.17
    const inside = stage.oven.inside.clone().addScaledVector(ovenAlong, off)
    const front = stage.oven.front.clone().addScaledVector(ovenAlong, off)
    front.y = inside.y + 0.12
    const up = t.rest.pos.clone().add(V3(-0.15, 0.25, 0))
    return new THREE.CatmullRomCurve3([t.rest.pos.clone(), up, front, inside], false, 'centripetal')
  })
  const ovenQuat = stage.oven.group.quaternion.clone()

  const BAKE_T = 9.4
  const MIX_T = 1.6
  const plainTins = () => [{ soda: 0, yog: 0 }, { soda: 0, yog: 0 }]
  // the tins, the chosen one, the phase; the last mix (and the baked cakes it cleared away, to show going)
  const C = { tins: plainTins(), sel: 0, phase: 'batter', cut: [0, 0], n: 0, start: -99, mixStart: -99, mixN: 0, mixBaked: false, prev: plainTins(), prevCut: [0, 0], cutStart: [-99, -99], addStart: [-99, -99], added: [null, null], mine: false, sound: false, said: true, cue: 0 }
  const BAKE_CUES = [[0.05, 'tap'], [1.95, 'tap'], [6.65, 'tap'], [8.55, 'tap']]
  /** New batter in both tins (after a bake, the cakes go first). */
  const startMix = (fromPhase, age) => {
    C.mixBaked = fromPhase === 'baked'
    C.prev = C.tins.map(t => ({ ...t }))
    C.prevCut = [...C.cut]
    C.mixStart = clock - age
    C.phase = 'batter'
    C.tins = plainTins()
    C.cut = [0, 0]
    C.sel = 0
    C.added = [null, null]
  }
  const kindOf = t => (t.soda && t.yog ? 'open' : t.soda ? 'soapy' : 'dense')
  const cakeAge = () => clock - C.start
  const baking = () => C.phase === 'baking' && cakeAge() < BAKE_T
  const mixing = () => clock - C.mixStart < MIX_T
  const writeCard = i => {
    const t = C.tins[i]
    const parts = [t.yog && E.cakes.signs.yoghurt, t.soda && E.cakes.signs.soda].filter(Boolean)
    const s = tinCards[i]
    const word = parts.length ? parts.join(' + ') : E.cakes.signs.plain
    if (s.text.text !== word) {
      s.text.text = word
      s.text.sync()
    }
  }
  const startBake = (age, sound) => {
    C.phase = 'baking'
    C.start = clock - age
    C.sound = sound
    C.said = age > BAKE_T - 0.5
    C.cue = BAKE_CUES.findIndex(([s]) => s >= age)
    if (C.cue < 0) C.cue = BAKE_CUES.length
  }
  const cakePanel = lv => ({
    title: E.cakes.title,
    color: CAKE_C,
    blocks: [
      ...paras(E.cakes.panel[depth(lv)]),
      { buttons: [['a', 0], ['b', 1]].map(([k, i]) => ({ label: E.cakes.verbs[k], accent: C.phase === 'batter' && C.sel === i, onClick: () => cakeStep(k) })) },
      { buttons: ['yoghurt', 'soda', 'bake'].map(k => ({ label: E.cakes.verbs[k], onClick: () => cakeStep(k === 'bake' ? 'oven' : k) })) },
      { buttons: [['cutA', 'a'], ['cutB', 'b'], ['mix', 'mixer']].map(([k, s]) => ({ label: E.cakes.verbs[k], onClick: () => cakeStep(s === 'mixer' ? s : `cut-${s}`) })) },
    ],
  })
  function cakeStep(step) {
    const lv = level()
    const busy = baking() || mixing()
    const tinIdx = step === 'a' ? 0 : step === 'b' ? 1 : -1
    if (tinIdx >= 0 && C.phase === 'baked') step = `cut-${step}`
    if (step === 'cut-a' || step === 'cut-b') {
      const i = step === 'cut-a' ? 0 : 1
      if (C.phase !== 'baked') return say(at(W.busy, lv))
      if (C.cut[i]) return
      C.cut[i] = 1
      C.cutStart[i] = clock
      C.n++
      play('part')
      const kind = kindOf(C.tins[i])
      say(at(E.cakes.says[kind === 'open' ? 'cutRisen' : kind === 'soapy' ? 'cutSoapy' : 'cutFlat'], lv), CAKE_C)
      share('cakes')
      return
    }
    if (busy) return say(at(W.busy, lv))
    if (step === 'mixer') {
      C.mixN++
      C.n++
      startMix(C.phase, 0)
      play('fizz')
      say(at(E.cakes.says.mix, lv), CAKE_C)
      share('cakes')
      refresh(cakePanel)
      return
    }
    if (C.phase === 'baked') return say(at(E.cakes.says.baked, lv), CAKE_C)
    if (tinIdx >= 0) {
      C.sel = tinIdx
      play('tap')
      say(at(E.cakes.says.pick, lv), CAKE_C)
      share('cakes')
      refresh(cakePanel)
      return
    }
    if (step === 'yoghurt' || step === 'soda') {
      const t = C.tins[C.sel]
      const key = step === 'yoghurt' ? 'yog' : 'soda'
      if (t[key]) return say(at(E.cakes.says.again, lv), CAKE_C)
      t[key] = 1
      C.added[C.sel] = key
      C.addStart[C.sel] = clock
      C.n++
      play('tap')
      say(at(E.cakes.says[t.soda && t.yog ? 'fizzing' : step], lv), CAKE_C)
      share('cakes')
      return
    }
    if (step === 'oven') {
      C.n++
      C.mine = true
      startBake(0, true)
      say(at(E.cakes.says.bake, lv), CAKE_C)
      share('cakes')
    }
  }
  ex.add({
    id: 'cakes',
    x: stage.place('e', -2.9, 1.9).x,
    z: -2.9,
    radius: 1.9,
    label: E.cakes.label,
    verb: () => {
      const H = E.cakes.hints
      if (C.phase === 'baking') return H.watch
      if (C.phase === 'baked') return C.cut[0] && C.cut[1] ? H.mix : H.cut
      return C.tins.some(t => t.soda || t.yog) ? H.bake : H.add
    },
    manual: true,
    focus: { x: stage.place('e', 0, 0.4).x, y: TOP + 0.3, z: -2.75, size: 2.2 },
    act: () => ctx.showPanel(cakePanel),
  })
  clickable(tins[0].group, () => cakeStep('a'))
  clickable(tins[1].group, () => cakeStep('b'))
  clickable(yog, () => cakeStep('yoghurt'))
  clickable(sodaJar.group, () => cakeStep('soda'))
  clickable(mixer, () => cakeStep('mixer'))
  clickable(stage.oven.group, () => cakeStep('oven'))

  const tmpC = new THREE.Color()
  const cakeTmp = V3(0, 0, 0)
  updates.push(dt => {
    const a = cakeAge()
    const bakingNow = C.phase === 'baking'
    if (bakingNow && a >= BAKE_T) {
      C.phase = 'baked'
      C.cut = [0, 0]
      if (!C.said) {
        C.said = true
        // (the find is the baker's, not everyone's in the room who watched)
        if (C.mine) {
          findOnce('cakes', cakePanel, 3)
          const kinds = C.tins.map(kindOf)
          say(at(E.cakes.says[kinds.includes('open') ? 'risen' : kinds.includes('soapy') ? 'soapy' : 'flat'], level()), CAKE_C)
        }
        if (C.sound) play('select')
      }
      refresh(cakePanel)
    }
    const on = C.phase === 'baking'
    if (on && C.sound) while (C.cue < BAKE_CUES.length && a >= BAKE_CUES[C.cue][0]) play(BAKE_CUES[C.cue++][1])
    // the oven door, its heat and light, the tins' trips in and out
    const door = on ? (a < 0.5 ? span(0, 0.5, a) : a < 1.6 ? 1 : a < 2.1 ? 1 - span(1.6, 2.1, a) : a < 6.6 ? 0 : a < 7.1 ? span(6.6, 7.1, a) : a < 8.3 ? 1 : 1 - span(8.3, 8.8, a)) : 0
    const heat = on ? span(1.8, 2.6, a) * (1 - span(6.2, 7.0, a)) : 0
    stage.oven.open(door)
    stage.oven.heat(heat)
    stage.oven.glass.opacity = 0.45 - 0.25 * span(1.9, 2.4, on ? a : 0)
    ovenLight.intensity = heat * 2.6
    const mixK = clock - C.mixStart
    // new batter after a bake: the baked cakes go first, then the rings come down and the batter fills in
    const fromBaked = C.mixBaked && mixK < MIX_T
    const old = fromBaked && mixK < 0.62
    const rise = old ? 1 : on ? span(2.2, 6.2, a) : C.phase === 'baked' ? 1 : 0
    tins.forEach((t, i) => {
      const tin = old ? C.prev[i] : C.tins[i]
      const kind = kindOf(tin)
      // where the tin is: on the worktop, or on its way in, in the oven, on its way out
      const go = on ? (a < 0.35 + i * 0.12 ? 0 : a < 1.55 ? span(0.35 + i * 0.12, 1.55, a) : a < 7.0 ? 1 : 1 - span(7.0 + i * 0.12, 8.2, a)) : 0
      if (go > 0) {
        paths[i].getPointAt(go, t.group.position)
        t.group.quaternion.copy(t.rest.quat).slerp(ovenQuat, span(0.2, 0.9, go))
      } else {
        t.group.position.copy(t.rest.pos)
        t.group.quaternion.copy(t.rest.quat)
      }
      // the cake: batter rising and browning in the oven
      const h = lerp(RAW_H, HEIGHT[kind], ease(rise))
      const cs = old ? 1 - span(0.05, 0.6, mixK) : fromBaked ? span(0.8, 1.4, mixK) : 1
      t.cake.group.scale.set(Math.max(0.001, cs), h, Math.max(0.001, cs))
      t.crust.color.copy(COLOR.raw).lerp(COLOR[kind], ease(rise))
      t.crust.roughness = lerp(0.45, 0.85, rise)
      // yoghurt makes the batter paler before it bakes
      if (rise < 1 && tin.yog) t.crust.color.lerp(tmpC.set('#efdcae'), 0.35 * (1 - rise))
      if (t.crumb.map !== crumbTex[kind]) {
        t.crumb.map = crumbTex[kind]
        t.crumb.needsUpdate = true
      }
      // the springform's ring lifts off once the cakes are out, and comes back with new batter
      const ringUp = on || C.phase === 'baked' ? span(8.5, 9.3, Math.min(a, BAKE_T)) : fromBaked ? 1 - span(0.45, 0.9, mixK) : 0
      t.ringG.position.y = ringUp * 0.16
      t.ringG.visible = ringUp < 0.98
      t.ringG.scale.setScalar(1 + ringUp * 0.05)
      // the slice: out onto its plate, turned to show its crumb
      const cut = old ? !!C.prevCut[i] : !!C.cut[i] && C.phase === 'baked'
      const cutK = old ? 1 : cut ? span(0, 0.9, clock - C.cutStart[i]) : 0
      t.cake.whole.visible = !cut
      t.cake.rest.visible = cut
      t.cake.pivot.visible = cut
      t.plate.visible = cut
      if (cut) {
        const turn = -(Math.PI / 2 + WEDGE / 2) * 0.85 * cutK
        t.cake.slice.rotation.y = turn
        const m = t.cake.mid.clone().applyAxisAngle(V3(0, 1, 0), turn)
        cakeTmp.set(0, 0, PLATE_Z).sub(m)
        const hh = Math.max(0.01, h)
        t.cake.pivot.position.set(cakeTmp.x * cutK, (0.012 / hh) * cutK + Math.sin(Math.PI * cutK) * (0.06 / hh), cakeTmp.z * cutK)
        t.plate.scale.setScalar(Math.max(0.001, (old ? cs : 1) * span(0, 0.4, old ? 1 : clock - C.cutStart[i])))
      }
      // what was just added, sitting on the batter and stirred in
      const addA = clock - C.addStart[i]
      const showAdd = C.phase === 'batter' && addA < 1.6
      t.dollop.visible = showAdd && C.added[i] === 'yog'
      t.heap.visible = showAdd && C.added[i] === 'soda'
      const sk = Math.max(0.001, span(0, 0.25, addA) * (1 - span(0.7, 1.5, addA)))
      t.dollop.position.set(0.02, 0.006 + RAW_H, -0.01)
      t.dollop.scale.setScalar(sk)
      t.heap.position.set(-0.02, 0.006 + RAW_H, 0.02)
      t.heap.scale.setScalar(sk)
      // soda and yoghurt together: little bubbles popping on the batter
      t.fizz.visible = C.phase === 'batter' && !!(tin.soda && tin.yog) && !mixing()
      if (t.fizz.visible) {
        for (let b = 0; b < 12; b++) {
          const ph = (clock * 0.7 + b * 0.37) % 1
          const ang = b * 2.4
          const rr = 0.02 + ((b * 0.29) % 1) * 0.09
          dummy.position.set(Math.cos(ang) * rr, 0.006 + RAW_H + 0.002, Math.sin(ang) * rr)
          dummy.scale.setScalar(0.001 + 0.007 * Math.sin(Math.PI * ph))
          dummy.updateMatrix()
          t.fizz.setMatrixAt(b, dummy.matrix)
        }
        t.fizz.instanceMatrix.needsUpdate = true
      }
      writeCard(i)
      // the chosen tin's card glows a little
      tinCards[i].group.position.y = TOP + 0.3 + (C.phase === 'batter' && C.sel === i ? 0.012 * (1 + Math.sin(clock * 3.2)) : 0)
    })
    // the mixer whirs: its whisk turns, the machine shivers
    const whir = mixing()
    beater.rotation.y += whir ? dt * 30 : 0
    mixer.position.x = stage.place('e', CK.mixer, 0.32).x + (whir ? Math.sin(clock * 90) * 0.0015 : 0)
  })

  // ======== 3. heat alone: soda in a test tube over a spirit burner, its gas into limewater ========
  const HT_AT = -0.85
  const rig = onTop(new THREE.Group(), 'w', HT_AT, 0, 0)
  // (local x runs along the wall, toward the north; local z out into the room)
  const Y = TOP
  const Z = 0.32
  const TUBE = { r: 0.022, closed: V3(0.07, Y + 0.215, Z), mouth: V3(-0.2, Y + 0.195, Z) }
  const tubeDir = TUBE.mouth.clone().sub(TUBE.closed)
  const tubeLen = tubeDir.length()
  tubeDir.normalize()
  const tubeQ = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), tubeDir)
  const tube = new THREE.Group()
  tube.position.copy(TUBE.closed)
  tube.quaternion.copy(tubeQ)
  rig.add(tube)
  {
    // in the tube's frame: y runs from the closed end (0) to the mouth (tubeLen)
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r, TUBE.r, tubeLen, 24, 1, true).translate(0, tubeLen / 2, 0), M.glass)
    const end = new THREE.Mesh(new THREE.SphereGeometry(TUBE.r, 24, 10, 0, TAU, Math.PI / 2, Math.PI / 2), M.glass)
    end.renderOrder = wall.renderOrder = 3
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * 1.05, TUBE.r * 0.9, 0.035, 18).translate(0, tubeLen + 0.006, 0), M.rubber)
    tube.add(wall, end, stopper)
  }
  // the soda in the closed end: a white drift along the bottom of the tube (in the tube's frame, -x is
  // down): a flattened rod lying low, and the rounded end filled
  const drift = new THREE.Group()
  const sodaIn = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * 0.85, TUBE.r * 0.85, 0.1, 18).translate(0, 0.05, 0), M.powder)
  const sodaEnd = new THREE.Mesh(new THREE.SphereGeometry(TUBE.r * 0.85, 16, 8), M.powder)
  drift.add(sodaIn, sodaEnd)
  drift.scale.set(0.55, 1, 1)
  drift.position.x = -TUBE.r * 0.38
  tube.add(drift)
  // the water that gathers at the cool end, as a mist on the glass and drops
  const fog = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * 0.96, TUBE.r * 0.96, 0.08, 18, 1, true).translate(0, tubeLen - 0.06, 0), M.fog)
  tube.add(fog)
  const DROPS = 14
  const drops = Array.from({ length: DROPS }, (_, i) => {
    const r = random(700 + i)
    const d = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), M.drop)
    const ang = (r() - 0.5) * 2.4 + Math.PI
    d.position.set(Math.sin(ang) * TUBE.r * 0.92, tubeLen - 0.1 + r() * 0.085, Math.cos(ang) * TUBE.r * 0.92)
    d.userData.size = 0.0028 + r() * 0.003
    d.visible = false
    tube.add(d)
    return d
  })
  // the delivery tube, from the stopper down into the limewater
  const LIME = { x: -0.42, r0: 0.04, r1: 0.046, h: 0.14, level: 0.1 }
  const mouthLocal = TUBE.mouth.clone().addScaledVector(tubeDir, 0.026)
  const delivery = new THREE.CatmullRomCurve3([mouthLocal, mouthLocal.clone().add(V3(-0.05, 0.03, 0)), V3(LIME.x + 0.03, Y + 0.24, Z), V3(LIME.x, Y + 0.2, Z), V3(LIME.x, Y + 0.025, Z)], false, 'centripetal')
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(delivery, 48, 0.005, 8), M.glass)
  pipe.renderOrder = 3
  rig.add(pipe)
  const limeGlass = glassCup(M, LIME)
  limeGlass.position.set(LIME.x, Y, Z)
  const limeMat = new THREE.MeshStandardMaterial({ color: '#cfe8ee', roughness: 0.1, transparent: true, opacity: 0.35, depthWrite: false })
  limeGlass.add(liquidIn(limeMat, LIME, LIME.level))
  rig.add(limeGlass)
  const limeBubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), M.bubble, 20)
  limeBubbles.count = 0
  limeBubbles.frustumCulled = false
  limeBubbles.renderOrder = 4
  rig.add(limeBubbles)
  const limeList = []
  // the spirit burner under the closed end: a squat glass pot of spirit, a brass cap, the wick, the flame
  const burner = new THREE.Group()
  burner.position.set(0.035, Y, Z)
  rig.add(burner)
  {
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 14).scale(1, 0.62, 1).translate(0, 0.037, 0), new THREE.MeshStandardMaterial({ color: '#b5d4dd', roughness: 0.1, transparent: true, opacity: 0.55 }))
    const spirit = new THREE.Mesh(new THREE.SphereGeometry(0.052, 20, 10, 0, TAU, Math.PI * 0.45, Math.PI * 0.55).scale(1, 0.62, 1).translate(0, 0.037, 0), new THREE.MeshStandardMaterial({ color: '#7fa7d6', roughness: 0.1, transparent: true, opacity: 0.6 }))
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.03, 16).translate(0, 0.085, 0), new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.35, metalness: 0.7 }))
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.016, 8).translate(0, 0.108, 0), M.dark)
    burner.add(pot, spirit, neck, wick)
  }
  // the flame: two soft cones, blue outside, paler in the middle, flickering; its size follows the heat
  const flameTex = canvasTex(64, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.6, 'rgba(255,255,255,0.6)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(flameTex)
  const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.1, 16, 1, true).translate(0, 0.05, 0), new THREE.MeshBasicMaterial({ color: '#3f6fe0', map: flameTex, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
  const flameInner = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.05, 12, 1, true).translate(0, 0.025, 0), new THREE.MeshBasicMaterial({ color: '#9fc0ff', map: flameTex, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
  const flame = new THREE.Group()
  flame.position.y = 0.115
  flame.add(flameOuter, flameInner)
  burner.add(flame)
  const flameLight = new THREE.PointLight('#7fa8ff', 0, 0.9, 2)
  flameLight.position.set(0, 0.16, 0)
  burner.add(flameLight)
  // the stand that holds the tube: a foot, a rod, a clamp round the tube
  {
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.014, 0.13, 2, 0.005), M.dark)
    foot.position.set(-0.07, Y + 0.007, 0.1)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.42, 10).translate(0, 0.21, 0), M.steel)
    rod.position.set(-0.07, Y, 0.08)
    const mid = TUBE.closed.clone().lerp(TUBE.mouth, 0.55)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, Z - 0.08, 8), M.steel)
    arm.rotation.x = Math.PI / 2
    arm.position.set(-0.07, mid.y, (Z + 0.08) / 2)
    const boss = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.03, 0.03, 2, 0.006), M.dark)
    boss.position.set(-0.07, mid.y, 0.08)
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(TUBE.r + 0.004, 0.005, 6, 20), M.steel)
    clamp.position.set(mid.x, mid.y, Z)
    clamp.quaternion.setFromUnitVectors(V3(0, 0, 1), tubeDir)
    rig.add(foot, rod, arm, boss, clamp)
  }
  // the thermometer's display on the tiles above
  const display = new THREE.Group()
  {
    const boxM = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.12, 0.03, 2, 0.012), new THREE.MeshStandardMaterial({ color: '#1f2433', roughness: 0.5 }))
    const edge = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.14, 0.02, 2, 0.014), new THREE.MeshStandardMaterial({ color: HEAT_C, roughness: 0.5, emissive: HEAT_C, emissiveIntensity: 0.25 }))
    edge.position.z = -0.006
    display.add(edge, boxM)
  }
  const reading = makeText('20 °C', { size: 0.075, color: '#cfe4ff', anchorX: 'center', anchorY: 'middle' })
  reading.position.z = 0.017
  display.add(reading)
  display.position.set(-0.07, Y + 0.56, 0.02)
  rig.add(display)
  // red cabbage juice in two small glasses, a jar of fresh soda, half a red cabbage
  const JG = { r0: 0.036, r1: 0.042, h: 0.1 }
  const JX = { fresh: 0.33, tube: 0.52 }
  const PURPLE = new THREE.Color('#4e1270')
  const BLUE = new THREE.Color('#1b3fb0')
  const GREEN = new THREE.Color('#14803a')
  const juice = {}
  for (const k of ['fresh', 'tube']) {
    const g = glassCup(M, JG)
    g.position.set(JX[k], Y, Z)
    const mat = new THREE.MeshStandardMaterial({ color: PURPLE.clone(), roughness: 0.15, transparent: true, opacity: 0.96, depthWrite: false })
    g.add(liquidIn(mat, JG, 0.072))
    rig.add(g)
    juice[k] = { group: g, mat }
  }
  const freshJar = powderJar(M, { r: 0.05, h: 0.13, fill: 0.08, lid: '#e2722e' })
  freshJar.group.position.set(0.74, Y, Z - 0.02)
  rig.add(freshJar.group)
  {
    const leafTex = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#5c2a74'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(235,220,245,0.85)'
      g.lineWidth = 3
      for (let i = 0; i < 9; i++) {
        g.beginPath()
        g.arc(w / 2, h / 2, 8 + i * 7, i * 0.7, i * 0.7 + 4.4)
        g.stroke()
      }
    })
    textures.push(leafTex)
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 12, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6b2f86', roughness: 0.6 }))
    // (the flat side of the half: facing -y, where the dome is open)
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ map: leafTex, roughness: 0.7 }))
    face.position.y = -0.001
    const half = new THREE.Group()
    half.add(cab, face)
    // its cut face, with the white veins, turned toward the room
    half.rotation.x = -(Math.PI / 2 + 0.35)
    half.position.set(0.95, Y + 0.072, 0.22)
    rig.add(half)
  }
  signOn(E.heat.signs.soda, '#e2722e', 'w', HT_AT - 0.74, TOP + 0.58)
  signOn(E.heat.signs.fresh, HEAT_C, 'w', HT_AT - JX.fresh, TOP + 0.3, { size: 0.038, maxWidth: 0.26 })
  signOn(E.heat.signs.tube, HEAT_C, 'w', HT_AT - JX.tube, TOP + 0.44, { size: 0.038, maxWidth: 0.26 })
  signOn(E.heat.signs.lime, HEAT_C, 'w', HT_AT - LIME.x, TOP + 0.36, { size: 0.04 })
  const pinch = new THREE.InstancedMesh(new THREE.SphereGeometry(0.004, 6, 4), M.grain, 10)
  pinch.frustumCulled = false
  pinch.visible = false
  rig.add(pinch)

  const H = { target: 20, shown: 20, c: 0, juice: { fresh: -1, tube: -1 }, juiceAt: { fresh: -99, tube: -99 }, n: 0, mine: false, zone: 'cool', said: {}, pinchAt: -99, pinchK: null }
  const T_MIN = 20
  const T_MAX = 250
  const rateAt = T => (T < 80 ? 0 : Math.pow(clamp((T - 80) / 120), 1.4))
  const heatPanel = lv => ({
    title: E.heat.title,
    color: HEAT_C,
    blocks: [
      {
        slider: {
          label: E.heat.temp,
          min: T_MIN,
          max: T_MAX,
          step: 1,
          value: H.target,
          onInput: v => {
            setTarget(v, false)
            ex.discover('heat')
          },
          format: v => `${Math.round(v)} °C`,
          live: () => H.target,
        },
      },
      { buttons: [{ label: H.target > T_MIN ? E.heat.verbs.out : E.heat.verbs.fire, onClick: () => heatStep('burner') }, { label: E.heat.verbs.fresh, onClick: () => heatStep('fresh') }, { label: E.heat.verbs.tube, onClick: () => heatStep('tube') }, { label: E.heat.verbs.refill, onClick: () => heatStep('jar') }] },
      ...paras(E.heat.panel[depth(lv)]),
    ],
  })
  // the slider moves many times a second: the others get it a few times a second, and where it stopped
  let heatSend = null
  function setTarget(v, now) {
    const wasLit = H.target > T_MIN
    H.target = clamp(Math.round(Number(v) || T_MIN), T_MIN, T_MAX)
    H.mine = true
    // the panel's burner button says "light" or "put out"
    if (wasLit !== H.target > T_MIN) refresh(heatPanel)
    if (now) {
      share('heat')
      return
    }
    if (!heatSend) {
      heatSend = setTimeout(() => {
        heatSend = null
        share('heat')
      }, 250)
    }
  }
  function heatStep(step) {
    const lv = level()
    if (step === 'burner') {
      const lit = H.target <= T_MIN
      setTarget(lit ? 200 : T_MIN, true)
      play(lit ? 'beam' : 'tap')
      say(at(E.heat.says[lit ? 'fire' : 'out'], lv), HEAT_C)
      findOnce('heat', heatPanel, 2.5)
      refresh(heatPanel)
      return
    }
    if (step === 'fresh' || step === 'tube') {
      H.juice[step] = step === 'fresh' ? 0 : Math.round(H.c * 100) / 100
      H.juiceAt[step] = clock
      H.pinchAt = clock
      H.pinchK = step
      H.n++
      play('tap')
      const line = step === 'fresh' ? 'fresh' : H.c >= 0.3 ? 'tubeGreen' : 'tubeSame'
      say(at(E.heat.says[line], lv), HEAT_C)
      share('heat')
      return
    }
    if (step === 'jar') {
      H.c = 0
      H.target = T_MIN
      H.shown = T_MIN
      H.juice = { fresh: -1, tube: -1 }
      H.said = {}
      H.n++
      limeList.length = 0
      play('select')
      say(at(E.heat.says.refill, lv), HEAT_C)
      share('heat')
      refresh(heatPanel)
    }
  }
  ex.add({
    id: 'heat',
    x: stage.place('w', 0, 1.85).x,
    z: HT_AT - 0.2,
    radius: 1.9,
    label: E.heat.label,
    verb: () => {
      const Hh = E.heat.hints
      if (H.c >= 0.6) return H.juice.tube >= 0.3 ? Hh.refill : Hh.test
      return H.target <= T_MIN ? Hh.fire : Hh.wait
    },
    manual: true,
    focus: { x: stage.place('w', 0, 0.3).x, y: TOP + 0.26, z: HT_AT - 0.12, size: 1.45 },
    act: () => ctx.showPanel(heatPanel),
  })
  clickable(burner, () => heatStep('burner'))
  clickable(tube, () => heatStep('burner'))
  clickable(juice.fresh.group, () => heatStep('fresh'))
  clickable(juice.tube.group, () => heatStep('tube'))
  clickable(freshJar.group, () => heatStep('jar'))
  let shownRead = 20
  updates.push(dt => {
    // the soda warms towards the burner's setting, and cools when it is out
    H.shown = damp(H.shown, H.target, H.target > H.shown ? 0.55 : 0.35, dt)
    if (Math.abs(H.shown - H.target) < 0.4) H.shown = H.target
    const T = H.shown
    const r = rateAt(T)
    const before = H.c
    H.c = Math.min(1, H.c + r * 0.085 * dt)
    // the Atomling tells what is happening, once each, to whoever set the heat
    const tell = key => {
      if (H.said[key]) return
      H.said[key] = true
      if (H.mine) say(at(E.heat.says[key], level()), HEAT_C)
    }
    if (T >= 82 && H.c < 0.95) tell('starts')
    if (T >= 195 && H.c < 0.95) tell('fast')
    if (H.c >= 1 && before < 1) tell('done')
    if (H.target > T_MIN && H.target < 80 && T > 40 && !H.said.cool && H.c < 0.05) tell('cool')
    // the flame
    const lit = H.target > T_MIN
    flame.visible = lit
    const fk = clamp((H.target - T_MIN) / (T_MAX - T_MIN))
    if (lit) {
      const fl = 1 + Math.sin(clock * 23) * 0.05 + Math.sin(clock * 37) * 0.04
      flame.scale.set(0.7 + 0.5 * fk, (0.5 + 1.1 * fk) * fl, 0.7 + 0.5 * fk)
    }
    flameLight.intensity = lit ? 0.06 + 0.14 * fk : 0
    // the soda, the water at the cool end, the limewater
    // (it loses 37 % of its mass: the drift settles a little)
    drift.scale.x = 0.55 * (1 - 0.25 * H.c)
    M.fog.opacity = 0.28 * clamp(H.c * 2.5) * (1 - 0.4 * clamp((T - 150) / 100))
    drops.forEach((d, i) => {
      const k = clamp((H.c - (i + 1) / (DROPS + 4)) * 6)
      d.visible = k > 0.01
      d.scale.setScalar(d.userData.size * Math.max(0.001, k))
    })
    const milk = ease(clamp(H.c / 0.35))
    limeMat.color.set('#cfe8ee').lerp(tmpC.set('#eeeeea'), milk)
    limeMat.opacity = 0.35 + 0.55 * milk
    // gas bubbling out of the delivery tube while the soda still gives it off
    const flow = r * (H.c < 1 ? 1 : 0)
    if (limeList.length < 20 && Math.random() < flow * dt * 18) {
      limeList.push({ x: (Math.random() - 0.5) * 0.008, z: (Math.random() - 0.5) * 0.008, y: 0.03, v: 0.1 + Math.random() * 0.06, r: 0.003 + Math.random() * 0.003 })
    }
    for (let i = limeList.length - 1; i >= 0; i--) {
      const b = limeList[i]
      b.y += b.v * dt
      b.x += (Math.random() - 0.5) * 0.002
      if (b.y > LIME.level) limeList.splice(i, 1)
    }
    limeBubbles.count = limeList.length
    limeList.forEach((b, i) => {
      dummy.position.set(LIME.x + b.x, Y + b.y, Z + b.z)
      dummy.scale.setScalar(b.r)
      dummy.updateMatrix()
      limeBubbles.setMatrixAt(i, dummy.matrix)
    })
    limeBubbles.instanceMatrix.needsUpdate = true
    // the cabbage juice: purple, then blue (soda) or green (sodium carbonate) as the pinch dissolves
    for (const k of ['fresh', 'tube']) {
      const v = H.juice[k]
      const s = v < 0 ? 0 : span(0.2, 1.1, clock - H.juiceAt[k])
      const target = v < 0 ? PURPLE : tmpC.copy(BLUE).lerp(GREEN, clamp((v - 0.15) / 0.6))
      juice[k].mat.color.copy(PURPLE).lerp(target, s)
    }
    // a pinch of powder falling into the cabbage juice
    const pa = clock - H.pinchAt
    pinch.visible = pa < 0.5 && !!H.pinchK
    if (pinch.visible) {
      for (let i = 0; i < 10; i++) {
        const t = pa - i * 0.02
        dummy.position.set(JX[H.pinchK] + ((i * 0.37) % 1 - 0.5) * 0.02, Y + 0.17 - 4.9 * Math.max(0, t) ** 2, Z + ((i * 0.61) % 1 - 0.5) * 0.02)
        dummy.scale.setScalar(t < 0 || dummy.position.y < Y + 0.072 ? 0.001 : 1)
        dummy.updateMatrix()
        pinch.setMatrixAt(i, dummy.matrix)
      }
      pinch.instanceMatrix.needsUpdate = true
    }
    // the thermometer
    const rd = Math.round(T)
    if (rd !== shownRead) {
      shownRead = rd
      reading.text = `${rd} °C`
      reading.color = T >= 80 ? '#ffd8a8' : '#cfe4ff'
      reading.sync()
    }
  })

  // ======== the rest of the kitchen: a baking morning ========
  {
    const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })
    // herbs in a pot on the window sill
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.11, 18).translate(0, 0.055, 0), mat('#b5603e'))
    const leaves = new THREE.Group()
    const leafM = mat('#4f8f3e')
    for (let i = 0; i < 9; i++) {
      const l = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8).scale(1, 0.7, 1), leafM)
      l.position.set(Math.cos(i * 2.4) * 0.045, 0.13 + (i % 3) * 0.035, Math.sin(i * 2.4) * 0.03)
      leaves.add(l)
    }
    const herbs = new THREE.Group()
    herbs.add(pot, leaves)
    herbs.position.set(0.72, 1.16, stage.place('n', 0, 0.07).z)
    root.add(herbs)
    // a bowl of lemons and oranges, a loaf on its board, the kettle
    const bowl = onTop(new THREE.Group(), 'n', 1.75, 0.32)
    bowl.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 10, 0, TAU, Math.PI / 2, Math.PI / 2).scale(1, 0.5, 1).translate(0, 0.075, 0), mat('#3f6f9a')))
    const fruit = [['#efc935', -0.05, 0.02], ['#e98a2a', 0.06, -0.03], ['#efc935', 0.0, 0.07], ['#e98a2a', -0.02, -0.07], ['#efc935', 0.07, 0.06]]
    fruit.forEach(([c, x, z], i) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12).scale(1, 0.92, c === '#efc935' ? 1.2 : 1), mat(c))
      f.position.set(x, 0.09 + (i > 2 ? 0.04 : 0), z)
      bowl.add(f)
    })
    const board = onTop(new THREE.Group(), 'n', 2.75, 0.3)
    const plank = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.025, 0.3, 2, 0.01), M.wood)
    plank.position.y = 0.0125
    const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.2, 6, 16).rotateZ(Math.PI / 2).scale(1, 0.75, 1), mat('#b9783a'))
    loaf.position.set(-0.04, 0.08, 0)
    board.add(plank, loaf)
    const kettle = onTop(new THREE.Group(), 'n', 3.75, 0.3)
    const kBody = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 14).scale(1, 0.95, 1).translate(0, 0.1, 0), mat('#d9573f'))
    const kLid = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.03, 16).translate(0, 0.2, 0), M.dark)
    const kSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.1, 10), mat('#d9573f'))
    kSpout.position.set(0.11, 0.13, 0)
    kSpout.rotation.z = -0.9
    kettle.add(kBody, kLid, kSpout)
    // an open shelf of jars over the cakes: flour, sugar, cocoa, oats, rice
    const shelf = onTop(new THREE.Group(), 'e', -3.2, 0, 1.62)
    const sPlank = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.03, 0.24, 2, 0.01), M.wood)
    sPlank.position.set(0, 0, 0.12)
    shelf.add(sPlank)
    ;[['#ece6da', -0.85], ['#f4f1ea', -0.45], ['#6a3f26', -0.05], ['#d3b58a', 0.35], ['#efeae0', 0.75]].forEach(([c, x], i) => {
      const j = new THREE.Group()
      j.add(glassCup(M, { r0: 0.06, r1: 0.06, h: 0.2 }))
      const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.13 + (i % 2) * 0.03, 20).translate(0, 0.012 + (0.13 + (i % 2) * 0.03) / 2, 0), mat(c))
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.03, 20).translate(0, 0.215, 0), M.wood)
      j.add(fill, lid)
      j.position.set(x, 0.015, 0.12)
      shelf.add(j)
    })
    // on the counters behind: a box of eggs, a rolling pin, a bag of flour
    const eggs = onTop(new THREE.Group(), 's', -3.2, 0.32)
    const eggBox = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.05, 0.12, 2, 0.01), mat('#a7a08f'))
    eggBox.position.y = 0.025
    eggs.add(eggBox)
    for (let i = 0; i < 6; i++) {
      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10).scale(1, 1.3, 1), mat('#e2c9a4'))
      egg.position.set(-0.125 + i * 0.05, 0.065, 0)
      eggs.add(egg)
    }
    const pin = onTop(new THREE.Group(), 's', -2.4, 0.3)
    const pinBody = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 16).rotateZ(Math.PI / 2), M.wood)
    pinBody.position.y = 0.03
    pin.add(pinBody)
    const flour = onTop(new THREE.Group(), 's', 2.6, 0.3)
    const bag = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.26, 0.1, 3, 0.03), mat('#cdbf9f'))
    bag.position.y = 0.13
    flour.add(bag)
    // dust drifting in the sunbeam
    const dust = motes({ count: 140, radius: 1.1, y0: 0.3, y1: 2.4, color: '#fff1cf', size: 0.022, opacity: 0.55, speed: 0.08, light })
    dust.group.position.set(0.55, 0, -3.5)
    root.add(dust.group)
    updates.push((dt, t) => dust.update(t))
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.85 },
    spawn: { x: 0, z: 2.9, yaw: 0 },
    hostSpot: { x: -1.8, z: 2.2, yaw: Math.atan2(-1.8, -0.7) },
    back: { x: 0, z: 6.3, rot: Math.PI },
    stand: { x: 2.3, z: 1.4, rot: Math.atan2(-2.3, 1.5) },
    parts: {
      fizz: {
        tap: thing => fizzStep(thing), // 'vinegar' | 'lemon' | 'water' (the glasses), 'soda' | 'powder' (the jars)
        get pick() { return F.pick },
        get last() { return F.last },
        get n() { return F.n },
        get busy() { return fizzBusy() },
        get tried() { return [...F.tried] },
        at: thing => (LIQ.includes(thing) ? glasses[thing] : jars[thing].group).localToWorld(V3(0, 0.1, 0)),
      },
      cakes: {
        tap: thing => cakeStep(thing), // 'a' | 'b' (the tins: choose, or cut when baked), 'yoghurt', 'soda', 'oven', 'mixer'
        get state() { return cakeState() },
        get busy() { return baking() || mixing() },
        at: thing => ({ a: tins[0].group, b: tins[1].group, yoghurt: yog, soda: sodaJar.group, mixer: mixer, oven: stage.oven.group })[thing].localToWorld(thing === 'oven' ? V3(0, 1.2, 0.7) : V3(0, 0.06, 0)),
      },
      heat: {
        tap: thing => heatStep(thing), // 'burner', 'fresh' | 'tube' (the cabbage juice), 'jar' (fresh soda)
        temp: v => setTarget(v, true), // the panel's slider
        get state() { return heatState() },
        at: thing => ({ burner, fresh: juice.fresh.group, tube: juice.tube.group, jar: freshJar.group })[thing].localToWorld(V3(0, 0.06, 0)),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { fizz: fizzPanel, cakes: cakePanel, heat: heatPanel },
    shared: {
      fizz: {
        get: () => ({ pick: F.pick, last: F.last, n: F.n, age: Math.min(30, Math.round(fizzAge() * 10) / 10), tried: [...F.tried] }),
        set: (s, live, ago = 0) => {
          F.pick = LIQ.includes(s?.pick) ? s.pick : null
          F.tried = (Array.isArray(s?.tried) ? s.tried : []).filter(k => k in FIZZ_K)
          F.n = Math.max(0, Math.round(Number(s?.n) || 0))
          F.mine = false
          const key = s?.last in FIZZ_K ? s.last : null
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 30)
          if (key) startFizz(key, age, !!live)
          else {
            F.last = null
            F.start = clock - 30
          }
          refresh(fizzPanel)
        },
      },
      cakes: { get: () => cakeState(), set: (s, live, ago = 0) => cakeSet(s, live, ago) },
      heat: { get: () => heatState(), set: (s, live, ago = 0) => heatSet(s, live, ago) },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (heatSend) clearTimeout(heatSend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }

  function cakeState() {
    return {
      tins: C.tins.map(t => [t.soda, t.yog]),
      sel: C.sel,
      phase: C.phase,
      cut: [...C.cut],
      n: C.n,
      mixN: C.mixN,
      age: Math.min(30, Math.round(cakeAge() * 10) / 10),
    }
  }
  function cakeSet(s, live, ago) {
    // someone made new batter: here too the cakes go and the batter fills in (shown at once if not live)
    const mixN = Math.max(0, Math.round(Number(s?.mixN) || 0))
    if (mixN !== C.mixN) startMix(C.phase, live ? 0 : 10)
    C.mixN = mixN
    const tinsIn = Array.isArray(s?.tins) ? s.tins : []
    const tinsNew = [0, 1].map(i => ({ soda: tinsIn[i]?.[0] ? 1 : 0, yog: tinsIn[i]?.[1] ? 1 : 0 }))
    // what was just added plays here, a spoon on the batter
    tinsNew.forEach((t, i) => {
      if (!live) return
      const key = t.yog && !C.tins[i].yog ? 'yog' : t.soda && !C.tins[i].soda ? 'soda' : null
      if (key) {
        C.added[i] = key
        C.addStart[i] = clock
      }
    })
    C.tins = tinsNew
    C.sel = s?.sel === 1 ? 1 : 0
    const cutIn = Array.isArray(s?.cut) ? s.cut : []
    const cutNew = [0, 1].map(i => (cutIn[i] ? 1 : 0))
    // a cut someone just made plays here; one made before shows as it stands
    cutNew.forEach((c, i) => {
      if (c && !C.cut[i]) C.cutStart[i] = live ? clock : clock - 5
    })
    C.cut = cutNew
    C.n = Math.max(0, Math.round(Number(s?.n) || 0))
    C.mine = false
    const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 30)
    const phase = ['batter', 'baking', 'baked'].includes(s?.phase) ? s.phase : 'batter'
    if (phase === 'baking' && age < BAKE_T) startBake(age, !!live)
    else if (phase === 'baking' || phase === 'baked') {
      C.phase = 'baked'
      C.start = clock - BAKE_T - 5
      C.said = true
    } else {
      C.phase = 'batter'
      C.start = clock - 30
    }
    if (!live) C.added = [null, null]
    refresh(cakePanel)
  }
  function heatState() {
    return {
      temp: H.target,
      c: Math.round(H.c * 100) / 100,
      juice: [H.juice.fresh, H.juice.tube],
      n: H.n,
    }
  }
  function heatSet(s, live, ago) {
    H.target = clamp(Math.round(Number(s?.temp) || T_MIN), T_MIN, T_MAX)
    if (!live) H.shown = H.target
    const c = clamp(Number(s?.c) || 0)
    // what unfolds runs on by how long ago the state was taken
    H.c = Math.min(1, c + rateAt(H.target) * 0.085 * clamp(Number(ago) || 0, 0, 60))
    const j = Array.isArray(s?.juice) ? s.juice : []
    const n = Math.max(0, Math.round(Number(s?.n) || 0))
    for (const [i, k] of [[0, 'fresh'], [1, 'tube']]) {
      const v = Number.isFinite(Number(j[i])) ? clamp(Number(j[i]), -1, 1) : -1
      if (v !== H.juice[k]) H.juiceAt[k] = live ? clock : clock - 5
      if (live && v >= 0 && v !== H.juice[k]) {
        H.pinchAt = clock
        H.pinchK = k
      }
      H.juice[k] = v
    }
    // fresh soda in the tube (someone started again): no bubbles left, the Atomling may tell it all again
    if (H.c < 0.01) {
      limeList.length = 0
      H.said = {}
    }
    H.n = n
    H.mine = false
    refresh(heatPanel)
  }
}
