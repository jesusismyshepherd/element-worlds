// Carbon's second wing, "The carbon of life": a garden under a geodesic glass dome, in daylight, with a
// big tree in the middle that breathes (CO2 molecules drift into its crown and O2 drifts out while the
// sun shines; a dial turns day into night and photosynthesis stops). Round the ring path: "you are 18%
// carbon" (a figure filled by the body's mass fractions), five molecules of chains and rings (methane,
// ethane, ethanol, benzene, glucose), the carbon-14 clock with a mammoth's thigh bone, and the carbon
// cycle on a table. Every exhibit used once is a discovery. In a room, everyone in the garden shares its
// exhibits (`shared` below, src/net/shared.js); panels, words and discoveries stay each one's.
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { circle, box } from '../../../engine/collide.js'
import { markFound, isFound, countFound } from '../../../engine/progress.js'
import { formulaText, makeText } from '../../../engine/text.js'
import { MOLECULES } from '../../../chem/molecules.js'
import { atriumPath } from '../../registry.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { standSign, refreshPrompt, promptSync, happening, onLevel, pick, glowMat, equation, keepPlayerInView } from './kit.js'
import { ethane, ethanol, glucose } from './structures.js'
import { buildTree, breathing } from './tree.js'
import { GREEN, skyDome, glassDome, garden, gardenLamps, dayNightDial, carbonPerson, moleculePedestal, c14Clock, cycleTable, butterflies } from './life.parts.js'
import { wordsFor } from './life.words.js'

const DOME_R = 17
const DROP = 1.6
const RING = [7.6, 9.4]
const at = (r, deg) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)]
const facing = (x, z) => Math.atan2(-x, -z) // a group facing +z turned toward the middle

const PLACES = {
  dial: { at: [-7.0, 2.7], use: [-7.7, 1.6], sign: [-8.4, 4.2] },
  tree: { use: [-3.4, -0.4], sign: [-5.2, -2.7] },
  body: { at: at(12.2, 225), use: at(9.9, 225), sign: at(10.7, 239) },
  c14: { at: at(12.4, 135), use: at(9.9, 135), sign: at(10.7, 120) },
  cycle: { at: at(12.0, 45), use: at(9.9, 45), sign: at(10.7, 60) },
  mol: { sign: at(10.7, 270) },
}
const MOLS = [
  { id: 'methane', deg: 284, mol: () => MOLECULES.CH4, scale: 0.42 },
  { id: 'ethane', deg: 296.5, mol: ethane, scale: 0.36 },
  { id: 'ethanol', deg: 309, mol: ethanol, scale: 0.33 },
  { id: 'benzene', deg: 321.5, mol: () => MOLECULES.C6H6, scale: 0.28 },
  { id: 'glucose', deg: 334, mol: glucose, scale: 0.24 },
]
const ORDER = ['tree', 'night', 'body', ...MOLS.map(m => m.id), 'c14', 'cycle']

export async function build(ctx) {
  const el = element('C')
  const lang = ctx.lang()
  const W = wordsFor(lang)
  const light = ctx.light
  const shadows = !light
  const root = new THREE.Group()
  root.name = 'wing-C-life'
  const updates = []
  const timers = []
  const later = (s, fn) => timers.push({ at: s, fn })
  // tell the others in the room's same garden that this visitor changed something (src/net/shared.js)
  const share = id => ctx.share?.(id)

  // ---- sky, dome, garden
  const sky = skyDome()
  root.add(sky.mesh)
  const dome = glassDome({ radius: DOME_R, drop: DROP, light })
  root.add(dome.group)
  const spokeAt = (deg, r0, r1, width) => {
    const [x, z] = at((r0 + r1) / 2, deg)
    return { x, z, width, length: r1 - r0, angle: -((deg * Math.PI) / 180) - Math.PI / 2 }
  }
  const spokes = [
    spokeAt(180, RING[1] - 0.1, 14.6, 2.6),
    spokeAt(225, RING[1] - 0.1, 10.6, 2.0),
    spokeAt(135, RING[1] - 0.1, 10.4, 2.0),
    spokeAt(45, RING[1] - 0.1, 10.6, 2.0),
    ...MOLS.map(m => spokeAt(m.deg, RING[1] - 0.1, 10.9, 1.5)),
  ]
  const inSpoke = (x, z) => spokes.some(sp => {
    const dx = x - sp.x
    const dz = z - sp.z
    const a = -sp.angle - Math.PI / 2
    const along = dx * Math.cos(a) + dz * Math.sin(a)
    const across = -dx * Math.sin(a) + dz * Math.cos(a)
    return Math.abs(along) < sp.length / 2 + 0.2 && Math.abs(across) < sp.width / 2 + 0.2
  })
  const blocked = [
    [0, 0, 1.6], [...PLACES.body.at, 1.4], [...PLACES.c14.at, 2.8], [...PLACES.cycle.at, 2.3], [...PLACES.dial.at, 0.7],
    ...MOLS.map(m => [...at(11.6, m.deg), 0.6]),
  ]
  const keepOut = (x, z) => inSpoke(x, z) || blocked.some(([bx, bz, r]) => Math.hypot(x - bx, z - bz) < r)
  const lawn = garden({ radius: dome.floorRadius, ringIn: RING[0], ringOut: RING[1], spokes, keepOut, light, shadows })
  root.add(lawn.group)
  updates.push((dt, t) => lawn.update(t))
  const lampSpots = [22, 82, 112, 152, 208, 258, 352].map(d => at(9.75, d))
  const flutter = butterflies({ count: 12, radius: dome.floorRadius - 1.2, light })
  root.add(flutter.group)
  updates.push((dt, t) => {
    flutter.group.visible = nightK < 0.6 // they rest at night
    if (flutter.group.visible) flutter.update(t)
  })
  const lamps = gardenLamps({ spots: lampSpots, light })
  root.add(lamps.group)

  // ---- light: the sun (it casts shadows on computers), the sky's bounce, the moon at night
  const sun = new THREE.DirectionalLight('#fff1d6', 2.1)
  sun.position.set(14, 22, 9)
  sun.target.position.set(0, 0, 0)
  if (shadows) {
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    const c = sun.shadow.camera
    c.left = -19
    c.right = 19
    c.top = 19
    c.bottom = -19
    c.near = 2
    c.far = 70
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
  }
  root.add(sun, sun.target)
  const hemi = new THREE.HemisphereLight('#d6ecff', '#4c6b34', 0.9)
  root.add(hemi)
  const daySun = new THREE.Color('#fff1d6')
  const moonCol = new THREE.Color('#9fb3ff')
  const dayHemiSky = new THREE.Color('#d6ecff')
  const nightHemiSky = new THREE.Color('#3a4a80')
  const fog = new THREE.Fog('#cfe2f2', 60, 220)
  const dayFog = new THREE.Color('#cfe2f2')
  const nightFog = new THREE.Color('#0b1228')

  // ---- the tree and its breath
  const tree = buildTree({ light, shadows })
  root.add(tree.group)
  updates.push((dt, t) => tree.update(t))
  const breath = breathing({ crown: tree.crown, count: light ? 8 : 16, light })
  root.add(breath.group)
  updates.push(dt => breath.update(dt))
  // the equation of photosynthesis, under the crown
  const eqPlate = new THREE.Group()
  eqPlate.position.set(-4.4, 3.05, 0)
  eqPlate.rotation.y = -Math.PI / 2
  const plateFace = new THREE.Mesh(new RoundedBoxGeometry(4.4, 0.78, 0.06, 3, 0.06), new THREE.MeshStandardMaterial({ color: '#0d1433', roughness: 0.35, metalness: 0.2, emissive: '#0f1a44', emissiveIntensity: 0.6, transparent: true, opacity: 0.82 }))
  const plateEdge = new THREE.Mesh(new RoundedBoxGeometry(4.46, 0.84, 0.04, 3, 0.06), glowMat(GREEN, 0.9))
  plateEdge.position.z = -0.02
  const eq = equation([{ n: 6, f: 'CO2' }, '+', { n: 6, f: 'H2O' }, '>', { t: W.light }, { f: 'C6H12O6' }, '+', { n: 6, f: 'O2' }], { size: 0.26, color: '#ffffff', arrowColor: '#ffd166' })
  eq.position.z = 0.05
  eqPlate.add(plateEdge, plateFace, eq)
  root.add(eqPlate)
  for (const s of [-1, 1]) {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.6, 4), new THREE.MeshStandardMaterial({ color: '#c9ced8', metalness: 1, roughness: 0.3 }))
    wire.position.set(-4.4, 3.05 + 0.39 + 0.8, s * 2.0)
    root.add(wire)
  }

  // ---- the day/night dial
  const dial = dayNightDial({ light })
  dial.group.position.set(...[PLACES.dial.at[0], 0, PLACES.dial.at[1]])
  dial.group.rotation.y = -Math.PI / 2 + 0.25
  root.add(dial.group)
  let nightK = 0
  updates.push(dt => {
    nightK = dial.update(dt)
    const day = 1 - nightK
    sky.uniforms.uNight.value = nightK
    sun.intensity = 2.1 * day + 0.32 * nightK
    sun.color.copy(daySun).lerp(moonCol, nightK)
    hemi.intensity = 0.9 * day + 0.3 * nightK
    hemi.color.copy(dayHemiSky).lerp(nightHemiSky, nightK)
    fog.color.copy(dayFog).lerp(nightFog, nightK)
    lamps.setNight(smoothNight(nightK))
    breath.setDay(day)
    ctx.scene.environmentIntensity = 0.7 * (1 - 0.8 * nightK)
  })
  const smoothNight = k => Math.max(0, Math.min(1, (k - 0.3) / 0.6))
  updates.push((dt, t) => (sky.uniforms.uTime.value = t))

  // ---- "you are 18% carbon"
  const person = carbonPerson({ light, words: () => W })
  person.group.position.set(PLACES.body.at[0], 0, PLACES.body.at[1])
  person.group.rotation.y = facing(...PLACES.body.at)
  root.add(person.group)
  updates.push((dt, t) => person.update(dt, t))

  // ---- chains and rings
  const pedestals = {}
  for (const m of MOLS) {
    const [x, z] = at(11.6, m.deg)
    const p = moleculePedestal({ mol: m.mol(), scale: m.scale, name: W.ex[m.id].name, light })
    p.group.position.set(x, 0, z)
    p.group.rotation.y = facing(x, z)
    const f = formulaText(W.ex[m.id].formula, { size: 0.16, color: '#ffe8a3' })
    f.position.set(0, 2.45, 0)
    p.group.add(f)
    root.add(p.group)
    updates.push((dt, t) => p.update(dt, t))
    pedestals[m.id] = p
  }

  // ---- carbon-14
  const clock = c14Clock({ light, words: () => W })
  clock.group.position.set(PLACES.c14.at[0], 0, PLACES.c14.at[1])
  clock.group.rotation.y = facing(...PLACES.c14.at)
  root.add(clock.group)
  updates.push((dt, t) => clock.update(dt, t))

  // ---- the carbon cycle
  const cycle = cycleTable({ light, words: () => W })
  cycle.group.position.set(PLACES.cycle.at[0], 0, PLACES.cycle.at[1])
  cycle.group.rotation.y = facing(...PLACES.cycle.at)
  root.add(cycle.group)
  const camQ = new THREE.Quaternion()
  const parentQ = new THREE.Quaternion()
  updates.push((dt, t) => {
    // the labels face the camera (in the table's own frame)
    parentQ.copy(cycle.group.quaternion).invert()
    camQ.copy(ctx.camera.quaternion).premultiply(parentQ)
    cycle.update(dt, t, camQ)
  })

  // ---- the lecterns
  const signs = {}
  const sign = (id, [x, z], words) => {
    const s = standSign({ color: GREEN, title: words.title, line: pick(words, ctx.level()) })
    s.group.position.set(x, 0, z)
    s.group.rotation.y = facing(x, z)
    root.add(s.group)
    signs[id] = { s, words }
  }
  sign('tree', PLACES.tree.sign, W.ex.tree.sign)
  signs.tree.s.group.rotation.y = -Math.PI / 2 - 0.55
  sign('night', PLACES.dial.sign, W.ex.night.sign)
  signs.night.s.group.rotation.y = -Math.PI / 2 + 0.6
  sign('body', PLACES.body.sign, W.ex.body.sign)
  sign('c14', PLACES.c14.sign, W.ex.c14.sign)
  sign('cycle', PLACES.cycle.sign, W.ex.cycle.sign)
  sign('mol', PLACES.mol.sign, W.molSign)
  const writeSigns = level => {
    for (const { s, words } of Object.values(signs)) s.set({ title: words.title, line: pick(words, level) })
    cycle.setLevel(level)
  }

  // ---- discoveries and what the walker can do
  const keys = ORDER.map(id => `C:life:${id}`)
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  const found = id => {
    if (markFound(`C:life:${id}`)) {
      const sid = MOLS.some(m => m.id === id) ? 'mol' : id
      if (signs[sid] && (sid !== 'mol' || MOLS.every(m => isFound(`C:life:${m.id}`)))) signs[sid].s.setRead(true)
    }
    report()
  }
  const marks = () => {
    for (const [id, { s }] of Object.entries(signs)) {
      if (id === 'mol') s.setRead(MOLS.every(m => isFound(`C:life:${m.id}`)))
      else s.setRead(isFound(`C:life:${id}`))
    }
  }
  marks()
  const panel = id => {
    const p = W.ex[id].panel
    ctx.showPanel(level => ({ title: p.title, kicker: W.kicker, color: GREEN, blocks: level === 'scientist' ? p.sci : p.kid }))
  }
  const say = text => ctx.store.set({ speech: { text, who: nameOf(el, lang), color: GREEN } })
  // the things that only happen, shared as counts (kit.js happening)
  const once = {
    body: happening(() => person.refill()),
    cycle: happening(() => cycle.burst()),
    ...Object.fromEntries(MOLS.map(m => [m.id, happening(() => pedestals[m.id].spin())])),
  }
  const did = id => {
    once[id].did()
    share(id)
  }
  const interactables = []
  const add = (id, [x, z], radius, onUse, label = W.ex[id]?.label, verb = W.ex[id]?.verb) => {
    const it = { id, x, z, radius, label, verb, onUse: () => onUse(it) }
    interactables.push(it)
    return it
  }
  add('tree', PLACES.tree.use, 2.3, () => {
    found('tree')
    later(0.4, () => panel('tree'))
  })
  const nightIt = add('night', PLACES.dial.use, 1.5, it => {
    const night = dial.toggle()
    share('night')
    found('night')
    refreshPrompt(ctx, it)
    later(1.2, () => say(night ? W.say.night : W.say.day))
  }, W.ex.night.label)
  // the dial's verb follows the sky, whoever turned it
  Object.defineProperty(nightIt, 'verb', { get: () => (dial.night ? W.verbs.day : W.verbs.night), configurable: true })
  add('body', PLACES.body.use, 1.9, () => {
    person.refill()
    did('body')
    found('body')
    later(5.4, () => panel('body'))
  })
  for (const m of MOLS) {
    add(m.id, at(10.2, m.deg), 1.25, () => {
      pedestals[m.id].spin()
      did(m.id)
      found(m.id)
      later(0.9, () => panel(m.id))
    })
  }
  add('c14', PLACES.c14.use, 1.9, () => {
    const r = clock.advance()
    if (!r) return
    share('c14')
    found('c14')
    const line = W.say.c14(r.halvings, W.fmt(r.years), r.left)
    if (r.halvings === 4) later(1.7, () => panel('c14'))
    else later(1.7, () => say(line))
  })
  add('cycle', PLACES.cycle.use, 1.9, () => {
    cycle.burst()
    did('cycle')
    found('cycle')
    later(1.0, () => panel('cycle'))
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

  // ---- what everyone in a room's same garden shares (src/net/shared.js): set(state, live), live when
  // someone has just done it (it plays here), else a newcomer's view at once. The tree's panel is only
  // read: nothing of it to share.
  const shared = {
    night: { get: () => dial.state(), set: (s, live) => dial.setState(s, live) },
    c14: { get: () => clock.state(), set: (s, live) => clock.setState(s, live) },
    ...once,
  }

  // ---- solids: the glass wall, the trunk, the exhibits
  const solids = []
  const segs = 40
  const wallR = dome.floorRadius - 0.35
  for (let k = 0; k < segs; k++) {
    const a = ((k + 0.5) / segs) * Math.PI * 2
    solids.push(box(Math.cos(a) * (wallR + 0.25), Math.sin(a) * (wallR + 0.25), 0.5, 2 * (wallR + 0.25) * Math.sin(Math.PI / segs) + 0.1, { rot: -a }))
  }
  solids.push(circle(0, 0, 0.95))
  solids.push(circle(...PLACES.body.at, 1.0))
  solids.push(circle(...PLACES.c14.at, 2.05))
  solids.push(circle(...PLACES.cycle.at, 1.65))
  solids.push(circle(...PLACES.dial.at, 0.45))
  for (const m of MOLS) solids.push(circle(...at(11.6, m.deg), 0.45))
  for (const { s } of Object.values(signs)) solids.push(circle(s.group.position.x, s.group.position.z, 0.3))

  // ---- the way back: a garden gate on the west side
  const gate = arch({ width: 3.6, height: 4.4, color: GREEN, label: W.back, portal: 'swirl' })
  gate.group.position.set(-15.3, 0, 0)
  gate.group.rotation.y = Math.PI / 2
  root.add(gate.group)
  updates.push((dt, t) => gate.update(t))
  const doors = [{ x: -15.2, z: 0, radius: 0.9, to: atriumPath('C') }]
  solids.push(box(-15.75, 0, 0.6, 4.2))

  // ---- the third-person camera stays inside the round dome (the engine's bounds are a box): how much
  // of the way from the player to where the camera wants to be lies inside. The player's camera eases
  // to it (player.js, world.cameraClear), so it never jumps.
  const cameraClear = (from, to) => {
    const max = dome.floorRadius - 0.7
    if (Math.hypot(to.x, to.z) <= max) return 1
    const dx = to.x - from.x
    const dz = to.z - from.z
    // the largest t in [0, 1] with |from + (to - from) t| (on the ground plane) = max
    const a = dx * dx + dz * dz
    const b = 2 * (from.x * dx + from.z * dz)
    const c = from.x * from.x + from.z * from.z - max * max
    const disc = b * b - 4 * a * c
    if (a < 1e-6 || disc < 0) return 1
    return Math.max(0, Math.min(1, (-b + Math.sqrt(disc)) / (2 * a)))
  }

  // ---- carbon's Atomling
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)
  if (shadows) avatar.root.traverse(o => o.isMesh && (o.castShadow = true))

  let unsubscribe = null
  return {
    mode: 'walk',
    root,
    title: ctx.t('wings.C.life.title'),
    env: { background: new THREE.Color('#bcd8f0'), fog, exposure: 0.92, envIntensity: 0.7, bloom: { strength: 0.32, radius: 0.5, threshold: 0.93 }, fov: 62, shadows: true },
    cameraPitchMax: 0.6,
    cameraClear,
    spawn: { x: -11.9, z: 0, yaw: -Math.PI / 2 },
    hostSpot: { x: -10.6, z: 2.0, yaw: -Math.PI / 2 - 0.9 },
    avatar,
    solids,
    cameraBounds: { minX: -14.9, maxX: 16.2, minY: 0.65, maxY: 13.5, minZ: -16.2, maxZ: 16.2 },
    interactables,
    doors,
    shared,
    // for the probes in tools/
    parts: { dial, clock, person, cycle, pedestals },
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
    },
  }
}
