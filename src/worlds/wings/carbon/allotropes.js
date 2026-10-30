// Carbon's first wing, "Diamond, graphite and company": a gallery 24 m by 47 m under a 10 m ceiling
// whose floor is graphene (the honeycomb drawn exactly, 0.5 m per ångström). Along the left wall,
// graphene: peeled off graphite with sticky tape, then seen as a physicist (its Dirac cones), a chemist
// (sp² and π), an engineer (a transistor that cannot switch off) and a materials scientist (the 1 m²
// hammock holding a cat), and the frontier (twisted bilayer graphene, the magic-angle moiré). Along the
// right wall: graphite's sliding sheets, the giant pencil, the diamond lattice and a ray-traced
// brilliant, the press that makes diamond. Down the middle, a nanotube tunnel leads into a C60 dome,
// with a football beside it. Every exhibit used once is a discovery. In a room, everyone in the gallery
// shares its exhibits (`shared` below, src/net/shared.js); panels, words and discoveries stay each one's.
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { roomWalls, box, circle } from '../../../engine/collide.js'
import { markFound, isFound, countFound } from '../../../engine/progress.js'
import { makeText } from '../../../engine/text.js'
import { atriumPath } from '../../registry.js'
import { standSign, spotLamp, beam, refreshPrompt, promptSync, happening, onLevel, pick, glowMat, keepPlayerInView } from './kit.js'
import { sparkleEnv } from './gem.js'
import {
  ACCENT, grapheneFloor, hallShell, diamondModel, brilliantGem, graphiteModel, giantPencil, nanotubeTunnel, c60Dome,
  football as footballModel, diamondPress,
} from './allotropes.parts.js'
import { peelStack, diracBands, piOrbitals, grapheneTransistor, hammockCat, moireDisc, bandBoard } from './graphene.parts.js'
import { wordsFor } from './allotropes.words.js'
import { plinth } from './kit.js'

const ROOM = { x0: -12, x1: 12, z0: -42, z1: 5, h: 10 }
const FLOOR_SCALE = 0.5 // metres per ångström
const DOME = { x: 0, z: -33.5, r: 4.6 }

// where each exhibit stands (its model), its lectern, and where the walker uses it
const WEST = -7.3
const EAST = 7.3
const LAYOUT = {
  graphene: { at: [WEST, -3.2], sign: [-5.5, -0.6], use: [-4.4, -2.6] },
  physics: { at: [WEST, -9.6], sign: [-5.2, -6.9], use: [-4.3, -9.0] },
  chemistry: { at: [WEST, -15.4], sign: [-5.6, -13.3], use: [-4.4, -15.0] },
  electronics: { at: [WEST, -21.4], sign: [-5.6, -19.0], use: [-4.5, -21.2] },
  materials: { at: [-6.0, -27.2], sign: [-5.0, -24.6], use: [-3.9, -27.4] },
  moire: { at: [-8.7, -37.0], sign: [-10.4, -32.0], use: [-6.7, -32.8] },
  graphite: { at: [EAST, -3.2], sign: [5.5, -0.6], use: [4.4, -2.6] },
  pencil: { at: [7.2, -8.4], sign: [5.1, -5.6], use: [4.3, -8.2] },
  diamond: { at: [7.6, -16.2], sign: [5.3, -13.9], use: [4.3, -15.8] },
  brilliant: { at: [5.0, -19.8], sign: [3.4, -21.3], use: [3.6, -19.6] },
  press: { at: [7.7, -25.4], sign: [5.0, -22.6], use: [4.5, -25.4] },
  football: { at: [EAST, -33.4], sign: [5.2, -30.6], use: [5.3, -32.6] },
  nanotube: { sign: [-2.9, -18.2], use: [0, -18.0] },
  fullerene: { sign: [0, -35.2], use: [0, -32.2] },
}
const ORDER = ['graphene', 'physics', 'chemistry', 'electronics', 'materials', 'moire', 'graphite', 'pencil', 'diamond', 'brilliant', 'press', 'nanotube', 'fullerene', 'football']

export async function build(ctx) {
  const el = element('C')
  const lang = ctx.lang()
  const W = wordsFor(lang)
  const light = ctx.light
  const root = new THREE.Group()
  root.name = 'wing-C-allotropes'
  const updates = []
  const timers = []
  const later = (s, fn) => timers.push({ at: s, fn })
  let now = 0
  const env = sparkleEnv()
  // tell the others in the room's same gallery that this visitor changed something (src/net/shared.js);
  // the moiré's slider at most seven times a second, its last turn always sent
  const share = id => ctx.share?.(id)
  let moireSoon = false
  const shareMoire = () => {
    if (moireSoon) return
    moireSoon = true
    later(0.15, () => {
      moireSoon = false
      share('moire')
    })
  }

  // ---- the hall and its graphene floor
  const floor = grapheneFloor({ width: ROOM.x1 - ROOM.x0, depth: ROOM.z1 - ROOM.z0, cx: 0, cz: (ROOM.z0 + ROOM.z1) / 2, bond: 1.42 * FLOOR_SCALE })
  root.add(floor.mesh, hallShell({ ...ROOM, light }))
  updates.push((dt, t) => floor.update(t))
  const big = makeText('C', { size: 2.3, color: new THREE.Color(ACCENT).multiplyScalar(1.6) })
  big.position.set(0, 8.55, ROOM.z0 + 0.32)
  const motto = makeText(W.wall, { size: 0.55, color: '#dbe9ff', maxWidth: 14 })
  motto.position.set(0, 6.95, ROOM.z0 + 0.32)
  root.add(big, motto)

  // ---- light: a dark gallery with lamps over the exhibits
  root.add(new THREE.HemisphereLight('#a9c4ff', '#0b1030', light ? 1.4 : 0.85))
  const key = new THREE.DirectionalLight('#dfe8ff', light ? 0.9 : 0.5)
  key.position.set(-6, 12, 8)
  root.add(key, key.target)
  const lamp = (x, z, ty = 1.2, intensity = 240, color = '#eaf4ff') => {
    if (light) {
      const b = beam({ top: 0.14, bottom: 1.4, height: ROOM.h - 0.35 - ty, opacity: 0.035 })
      b.position.set(x, ROOM.h - 0.35, z)
      root.add(b)
      return
    }
    spotLamp(root, { x, y: ROOM.h - 0.35, z, tx: x, ty, tz: z, color, intensity, angle: 0.24, penumbra: 0.7, beamOpacity: 0.045 })
  }

  // ---- the exhibits
  const signs = {}
  const sign = (id, opts = {}) => {
    const [x, z] = LAYOUT[id].sign
    const s = standSign({ color: ACCENT, ...opts })
    s.group.position.set(x, 0, z)
    s.group.rotation.y = x < 0 ? 0.85 : -0.85
    if (id === 'nanotube') s.group.rotation.y = 0.5
    if (id === 'fullerene') s.group.rotation.y = 0
    root.add(s.group)
    signs[id] = s
    return s
  }
  const at = (id, obj, rotY = 0) => {
    const [x, z] = LAYOUT[id].at
    obj.position.set(x, 0, z)
    obj.rotation.y = rotY
    root.add(obj)
  }

  // graphene: peel the top sheet off graphite
  const peel = peelStack({ light, onFree: () => floor.ripple(LAYOUT.graphene.at[0], LAYOUT.graphene.at[1], now, 1) })
  at('graphene', peel.group)
  updates.push((dt, t) => peel.update(dt, t))
  lamp(...LAYOUT.graphene.at, 2.2)
  // physics: the Dirac cones
  const bands = diracBands({ light })
  at('physics', bands.group)
  updates.push((dt, t) => bands.update(dt, t))
  // chemistry: sp² and π
  const orbitals = piOrbitals({ light })
  at('chemistry', orbitals.group)
  updates.push(dt => orbitals.update(dt))
  // electronics: the transistor, its knob toward the walkway
  const transistor = grapheneTransistor({ light, words: () => W })
  at('electronics', transistor.group, Math.PI / 2)
  updates.push((dt, t) => transistor.update(dt, t))
  // materials: the hammock and the cat
  const hammock = hammockCat({ light, words: () => W })
  at('materials', hammock.group, Math.PI / 2)
  updates.push((dt, t) => hammock.update(dt, t))
  lamp(...LAYOUT.materials.at, 0.8, 200, '#fff1dc')
  // frontier: the moiré
  // the pattern's period at an angle, in nm (a = 0.246 nm)
  const moireNm = deg => (0.246 / (2 * Math.sin((deg * Math.PI) / 360))).toFixed(1).replace('.', W.decimal)
  const moire = moireDisc({ label: deg => W.signLine.readout(deg, deg < 0.05 ? '' : moireNm(deg)) })
  at('moire', moire.group, 0.48)
  // beside it, between it and the west wall, turned to where the visitor stands: the electrons' bands
  const board = bandBoard({ words: lv => W.board[lv === 'scientist' ? 'sci' : 'kid'], decimal: W.decimal })
  const BOARD = { x: -10.9, z: -34.4 }
  board.group.position.set(BOARD.x, 0, BOARD.z)
  board.group.rotation.y = Math.atan2(LAYOUT.moire.use[0] - BOARD.x, LAYOUT.moire.use[1] - BOARD.z)
  root.add(board.group)
  let magicSaid = -99
  updates.push((dt, t) => {
    // the visitor holds the sheet while its panel is open
    if (moire.hold(ctx.store.get().panel?.exhibit === 'moire')) share('moire')
    moire.update(dt, t)
    board.update(t, moire.angle, ctx.level())
    // reaching the magic angle by hand: the Atomling says what happens there
    if (Math.abs(moire.angle - 1.1) < 0.015 && ctx.store.get().panel?.exhibit === 'moire' && t - magicSaid > 25) {
      magicSaid = t
      say(W.say.moire(moireNm(1.1)))
    }
  })
  // graphite
  const gr = graphiteModel({ light })
  const grBase = plinth({ radius: 1.6, height: 0.7, light })
  at('graphite', grBase)
  gr.group.position.set(EAST, 0.95, -3.2)
  root.add(gr.group)
  updates.push(dt => gr.update(dt))
  lamp(EAST, -3.2, 1.6)
  // the pencil, inside a ring of stanchions
  const pencil = giantPencil({ light, label: `HB  ·  ${W.graphiteWord}  ·  C` })
  at('pencil', pencil.group)
  updates.push((dt, t) => pencil.update(dt, t))
  lamp(7.2, -9.6, 0.5, 220, '#fff4e2')
  const [px, pz] = LAYOUT.pencil.at
  const ringC = [px + 0.2, pz - 1.6]
  const ringR = 3.0
  const postMat = new THREE.MeshStandardMaterial({ color: '#2b3358', metalness: 0.85, roughness: 0.3 })
  const ropeMat = glowMat(ACCENT, 1.6)
  const posts = []
  for (let k = 0; k < 9; k++) {
    const a = Math.PI * 0.62 + (k / 8) * Math.PI * 0.76 // the walkway side of the ring
    posts.push(new THREE.Vector3(ringC[0] + Math.cos(a) * ringR, 0, ringC[1] + Math.sin(a) * ringR))
  }
  posts.forEach((p, k) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.92, 12), postMat)
    post.position.set(p.x, 0.46, p.z)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), ropeMat)
    cap.position.set(p.x, 0.94, p.z)
    root.add(post, cap)
    if (k > 0) {
      const q = posts[k - 1]
      const mid = p.clone().add(q).multiplyScalar(0.5)
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(q.x, 0.88, q.z), new THREE.Vector3(mid.x, 0.7, mid.z), new THREE.Vector3(p.x, 0.88, p.z))
      root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.012, 6), ropeMat))
    }
  })
  // diamond and the brilliant
  const dia = diamondModel({ light })
  const diaBase = plinth({ radius: 1.5, height: 0.7, light })
  at('diamond', diaBase)
  dia.group.position.set(7.6, 2.35, -16.2)
  root.add(dia.group)
  updates.push(dt => dia.update(dt))
  lamp(7.6, -16.2, 2.3, 160)
  const gem = brilliantGem({ env, light })
  at('brilliant', gem.group)
  updates.push((dt, t) => gem.update(dt, t))
  // the press, its console toward the walkway
  const press = diamondPress({ light, env, words: () => W })
  at('press', press.group, Math.PI)
  updates.push((dt, t) => press.update(dt, t))
  lamp(7.7, -25.4, 1.4, 260)
  // the football beside the dome
  const ball = footballModel({ light })
  at('football', ball.group)
  updates.push(dt => ball.update(dt))
  lamp(EAST, -33.4, 1.2, 220, '#fff6ea')

  // ---- the nanotube leads into the C60 dome
  const dome = c60Dome({ radius: DOME.r, light, words: () => W })
  dome.group.position.set(DOME.x, 0, DOME.z)
  root.add(dome.group)
  updates.push((dt, t) => dome.update(dt, t))
  const tubeLen = 8 * 2.4595 * FLOOR_SCALE
  const tubeSouth = DOME.z + dome.doorPlane + tubeLen + 0.05
  const tube = nanotubeTunnel({ scale: FLOOR_SCALE, axisY: 1.2, z0: tubeSouth, light })
  root.add(tube.group)
  updates.push((dt, t) => tube.update(dt, t))

  // ---- the stations: a lectern each, its words at the level of the moment
  const marks = () => ORDER.forEach(id => signs[id].setRead(isFound(`C:allotropes:${id}`)))
  for (const id of ORDER) {
    const words = W.ex[id]
    sign(id, { title: words.sign.title, line: pick(words.sign, ctx.level()) })
  }
  marks()
  let moireLine = null
  const writeSigns = level => {
    for (const id of ORDER) signs[id].set({ title: W.ex[id].sign.title, line: id === 'moire' && moireLine ? moireLine : pick(W.ex[id].sign, level) })
  }

  // ---- what the walker can do
  const keys = ORDER.map(id => `C:allotropes:${id}`)
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  const found = id => {
    if (markFound(`C:allotropes:${id}`)) signs[id].setRead(true)
    report()
  }
  const panel = id => {
    const p = W.ex[id].panel
    ctx.showPanel(level => ({ title: p.title, kicker: W.kicker, color: ACCENT, blocks: level === 'scientist' ? p.sci : p.kid }))
  }
  const say = text => ctx.store.set({ speech: { text, who: nameOf(el, lang), color: ACCENT } })
  // the things that only happen, shared as counts (kit.js happening)
  const once = {
    physics: happening(() => bands.pulse()),
    chemistry: happening(() => orbitals.show()),
    materials: happening(() => hammock.nudge()),
    pencil: happening(() => pencil.draw(null)),
    diamond: happening(() => dia.show()),
    brilliant: happening(() => gem.flash()),
    nanotube: happening(() => tube.pulse()),
    fullerene: happening(() => dome.count()),
    football: happening(() => ball.kick()),
  }
  const did = id => {
    once[id].did()
    share(id)
  }
  const interactables = []
  const add = (id, onUse, extra = {}) => {
    const [x, z] = LAYOUT[id].use
    const it = { id, x, z, radius: 2.0, label: W.ex[id]?.label ?? '', verb: W.ex[id]?.verb ?? '', onUse: () => onUse(it), ...extra }
    interactables.push(it)
    return it
  }
  // the words follow the stack and the sheets, whoever moved them (a getter each)
  const wordsFrom = (it, get) => Object.defineProperties(it, { label: { get: () => get().label, configurable: true }, verb: { get: () => get().verb, configurable: true } })
  const peelIt = add('graphene', it => {
    const r = peel.use()
    if (r) share('graphene')
    refreshPrompt(ctx, it)
    if (r === 'peel') {
      found('graphene')
      later(3.4, () => panel('graphene'))
    } else if (r === 'back') say(W.say.peelBack)
  })
  wordsFrom(peelIt, () => (peel.out ? { label: W.ex.graphene.labelBack, verb: W.ex.graphene.verbBack } : W.ex.graphene))
  add('physics', () => {
    bands.pulse()
    did('physics')
    found('physics')
    later(1.6, () => panel('physics'))
  })
  add('chemistry', () => {
    orbitals.show()
    did('chemistry')
    found('chemistry')
    later(1.8, () => panel('chemistry'))
  })
  add('electronics', () => {
    const first = !isFound('C:allotropes:electronics')
    if (!transistor.use(mode => say(W.say.transistor[mode]))) return
    share('electronics')
    found('electronics')
    if (first) later(0.8, () => panel('electronics'))
  })
  add('materials', () => {
    hammock.nudge()
    did('materials')
    found('materials')
    later(1.4, () => panel('materials'))
  })
  // the top sheet turns by itself; E hands it to the visitor: a panel with a slider for the twist, the
  // magic angle, the ring size, and what it all means (the sheet waits while the panel is open)
  const twistOf = s => moire.MAX * s * s
  const sliderOf = deg => Math.sqrt(deg / moire.MAX)
  const ringsOf = s => 0.5 * Math.pow(16, s)
  const moirePanel = level => {
    const p = W.ex.moire.panel
    const c = W.moireControls
    return {
      title: p.title,
      kicker: W.kicker,
      color: ACCENT,
      exhibit: 'moire',
      blocks: [
        { p: pick(c.hint, level) },
        { slider: { label: c.twist, min: 0, max: 1, step: 0.0005, value: sliderOf(moire.angle), live: () => sliderOf(moire.angle), format: s => `${twistOf(s).toFixed(2).replace('.', W.decimal)}°`, onInput: s => (moire.setAngle(twistOf(s)), shareMoire()) } },
        { buttons: [{ label: c.magic, accent: true, onClick: () => (moire.magic(), share('moire')) }, { label: c.auto, onClick: () => (moire.release(), share('moire')) }] },
        { slider: { label: c.rings, min: 0, max: 1, step: 0.005, value: Math.log(moire.rings / 0.5) / Math.log(16), format: s => `×${ringsOf(s).toFixed(1).replace('.', W.decimal)}`, onInput: s => (moire.setRings(ringsOf(s)), shareMoire()) } },
        ...(level === 'scientist' ? p.sci : p.kid),
      ],
    }
  }
  add('moire', () => {
    found('moire')
    if (moire.hold(true)) share('moire')
    ctx.showPanel(moirePanel)
  })
  const grIt = add('graphite', it => {
    const out = !gr.slid
    gr.slide(out)
    share('graphite')
    refreshPrompt(ctx, it)
    if (out) {
      found('graphite')
      later(2.3, () => panel('graphite'))
    } else say(W.say.slideBack)
  })
  wordsFrom(grIt, () => ({ label: W.ex.graphite.label, verb: gr.slid ? W.ex.graphite.verbBack : W.ex.graphite.verb }))
  add('pencil', () => {
    if (!pencil.draw(() => panel('pencil'))) return
    did('pencil')
    found('pencil')
  })
  add('diamond', () => {
    dia.show()
    did('diamond')
    found('diamond')
    later(1.5, () => panel('diamond'))
  })
  add('brilliant', () => {
    gem.flash()
    did('brilliant')
    found('brilliant')
    later(1.3, () => panel('brilliant'))
  }, { radius: 1.7 })
  const pressIt = add('press', it => {
    const step = press.actions.step
    if (!press.actions.use()) return
    share('press')
    refreshPrompt(ctx, it)
    const seconds = [1.4, 3.6, 3.8, 3.2, 1.2][step]
    later(seconds + 0.05, () => {
      refreshPrompt(ctx, it)
      if (step < 3) say(W.press.say[step])
      if (step === 3) {
        found('press')
        panel('press')
      }
    })
  }, { radius: 2.2 })
  // the press's words follow its step, whoever works it
  wordsFrom(pressIt, () => (press.actions.busy ? { label: W.press.working, verb: W.press.wait } : W.press.steps[press.actions.step]))
  add('nanotube', () => {
    tube.pulse()
    did('nanotube')
    found('nanotube')
    later(1.6, () => panel('nanotube'))
  }, { radius: 1.7 })
  add('fullerene', () => {
    dome.count()
    did('fullerene')
    found('fullerene')
    later(11.5, () => panel('fullerene'))
  }, { radius: 1.8 })
  add('football', () => {
    ball.kick()
    did('football')
    found('football')
    later(2.2, () => panel('football'))
  })
  const greeting = () => pick(W.greeting, ctx.level())
  interactables.push({
    id: 'host',
    get x() { return ctx.engine.player.npc?.x ?? 99 },
    get z() { return ctx.engine.player.npc?.z ?? 99 },
    radius: 2.2,
    label: nameOf(el, lang),
    verb: W.talkTo,
    onUse: () => say(greeting()),
  })
  updates.push(promptSync(ctx, interactables))

  // ---- what everyone in a room's same gallery shares (src/net/shared.js): set(state, live), live when
  // someone has just done it (it plays here), else a newcomer's view at once
  const part = piece => ({ get: () => piece.state(), set: (s, live) => piece.setState(s, live) })
  const shared = {
    graphene: part(peel),
    electronics: part(transistor),
    moire: part(moire),
    graphite: part(gr),
    press: part(press.actions),
    ...once,
  }

  // ---- solids: the walls, the exhibits, the tunnel's sides, the dome's ring with its door
  const solids = roomWalls(ROOM.x0, ROOM.x1, ROOM.z0, ROOM.z1, [], 1)
  const c = (id, r, y1 = 50) => solids.push(circle(LAYOUT[id].at[0], LAYOUT[id].at[1], r, { y1 }))
  c('graphene', 1.35)
  c('physics', 1.8)
  c('chemistry', 1.35)
  solids.push(box(WEST, -21.4, 1.45, 2.45))
  c('materials', 1.45)
  solids.push(circle(-8.7, -37.0, 1.1))
  c('graphite', 1.65)
  solids.push(circle(ringC[0], ringC[1], ringR))
  c('diamond', 1.55)
  c('brilliant', 0.36)
  solids.push(box(7.7, -25.4, 1.6, 2.7), box(6.35, -26.65, 0.5, 1.0))
  c('football', 0.66)
  for (const id of ORDER) solids.push(circle(LAYOUT[id].sign[0], LAYOUT[id].sign[1], 0.3))
  solids.push(box(BOARD.x, BOARD.z, 2.3, 0.35, { rot: board.group.rotation.y }))
  const tubeNorth = tubeSouth - tubeLen
  for (const s of [-1, 1]) solids.push(box(s * 1.95, (tubeSouth + tubeNorth) / 2, 0.7, tubeLen))
  // the dome: a ring of short walls on its floor circle, open at the door (|x| < 1.15)
  const fr = dome.floorRadius
  const segs = 36
  for (let k = 0; k < segs; k++) {
    const a0 = (k / segs) * Math.PI * 2
    const a1 = ((k + 1) / segs) * Math.PI * 2
    const am = (a0 + a1) / 2
    const x = DOME.x + Math.sin(am) * fr
    const z = DOME.z + Math.cos(am) * fr
    if (Math.cos(am) > 0 && Math.abs(Math.sin(am) * fr) < 1.25) continue
    solids.push(box(x, z, 2 * fr * Math.sin(Math.PI / segs) + 0.08, 0.35, { rot: am }))
  }

  // ---- the way back
  const exit = arch({ width: 3.6, height: 4.4, color: ACCENT, label: W.back, portal: 'swirl' })
  exit.group.position.set(0, 0, ROOM.z1 - 0.2)
  exit.group.rotation.y = Math.PI
  root.add(exit.group)
  updates.push((dt, t) => exit.update(t))
  const doors = [{ x: 0, z: ROOM.z1 - 0.7, radius: 0.9, to: atriumPath('C') }]

  // ---- carbon's Atomling
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)

  // ---- the third-person camera stays on the player's side of the tube's and the dome's walls (looking
  // at a player inside through a wall of bars, or from outside at one inside), but the tube's two ends
  // and the dome's door are open: the camera follows through them. The player's camera eases to where
  // this allows (player.js, world.cameraClear); it used to be set here after the easing, every frame,
  // and as the Atomling went in or out of the tube the camera jumped to its back and out again.
  const inTube = (x, z) => Math.abs(x) < 2.1 && z < tubeSouth && z > tubeNorth
  const inDome = (x, z) => Math.hypot(x - DOME.x, z - DOME.z) < dome.floorRadius - 0.15
  const cameraClear = (from, to) => {
    const steps = 24
    let px = from.x
    let pz = from.z
    let tube = inTube(px, pz)
    let inside = inDome(px, pz)
    for (let i = 1; i <= steps; i++) {
      const u = i / steps
      const x = from.x + (to.x - from.x) * u
      const z = from.z + (to.z - from.z) * u
      const t = inTube(x, z)
      const d = inDome(x, z)
      // into or out of the tube through its side (an end is open: both points within its width)
      const throughSide = t !== tube && !(Math.abs(px) < 2.1 && Math.abs(x) < 2.1)
      // into or out of the dome other than through its door (south, |x| < 1.15)
      const mx = (px + x) / 2
      const mz = (pz + z) / 2
      const throughWall = d !== inside && !(mz > DOME.z && Math.abs(mx - DOME.x) < 1.15)
      if (throughSide || throughWall) return (i - 1) / steps
      px = x
      pz = z
      tube = t
      inside = d
    }
    return 1
  }

  let unsubscribe = null
  return {
    mode: 'walk',
    root,
    title: ctx.t('wings.C.allotropes.title'),
    env: { background: new THREE.Color('#060a1c'), fog: new THREE.Fog('#060a1c', 32, 90), exposure: 1.0, envIntensity: 0.35, bloom: { strength: 0.6, radius: 0.5, threshold: 0.8 }, fov: 62 },
    spawn: { x: 0, z: 0.9, yaw: 0 },
    hostSpot: { x: 2.0, z: -0.4, yaw: 2.4 },
    cameraPitchMax: 0.5,
    cameraClear,
    avatar,
    solids,
    cameraBounds: { minX: ROOM.x0 + 0.4, maxX: ROOM.x1 - 0.4, minY: 0.3, maxY: ROOM.h - 0.4, minZ: ROOM.z0 + 0.4, maxZ: ROOM.z1 - 0.4 },
    interactables,
    doors,
    shared,
    // for the probes in tools/ (__ew.world.parts.press.actions.step and so on)
    parts: { peel, transistor, moire, gr, press, pencil, dome, ball },
    refresh() {
      marks()
      report()
    },
    attach() {
      report()
      unsubscribe = onLevel(ctx, writeSigns)
      later(0.9, () => say(greeting()))
    },
    detach() {
      unsubscribe?.()
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      now = t
      for (let i = timers.length - 1; i >= 0; i--) {
        timers[i].at -= dt
        if (timers[i].at <= 0) {
          const fn = timers[i].fn
          timers.splice(i, 1)
          fn()
        }
      }
      for (const u of updates) u(dt, t)
      keepPlayerInView(ctx, avatar)
    },
    dispose() {
      timers.length = 0
      env.dispose()
    },
  }
}
