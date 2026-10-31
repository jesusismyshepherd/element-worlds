// Oxygen's second wing, fire: a round stone chamber, dark and warm, lit by a campfire in the middle,
// smoke rising to an opening in the dome where the moonlight comes in. Round the fire, the fire
// triangle (take away fuel, heat or oxygen and the fire dies; put it back and it lights again); on
// stone benches round the walls, the candle under a jar, the glowing splint test, methane burning atom
// by atom, and rust as a slow burning. Contract: docs/knowledge/adding-a-wing.md. Each step is a tap on
// the thing it is about (a side's post, the jar, the splint, the molecules, the tubes); E opens the
// station's panel, whose buttons do the same. In a room, everyone
// in the chamber shares its things (`shared` below, src/net/shared.js); panels and words stay each one's
// own, and so does the flare of the fire when this visitor's own oxygen Atomling comes close.
import { decimalOf } from '../../../i18n/langs.js'
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { box, circle } from '../../../engine/collide.js'
import { atriumPath } from '../../registry.js'
import { FIRE_WORDS } from './fireWords.js'
import { fireCave, CAVE } from './fireCave.js'
import { campfire } from './flame.js'
import { fireTriangle, SIDES } from './fireTriangle.js'
import { candleJar, splintTest, methaneStage, rustTubes } from './fireBenches.js'
import { exhibitSet, onLevel, at, chem, within } from './kit.js'
import { tapTargets } from '../../common/taps.js'
import { verseStone } from '../../common/verse.js'

const COLOR = '#ff9a4d'

export async function build(ctx) {
  const el = element('O')
  const lang = ctx.lang()
  const W = FIRE_WORDS[lang] ?? FIRE_WORDS.en
  const who = nameOf(el, lang)
  const light = ctx.light
  const root = new THREE.Group()
  root.name = 'wing-O-fire'
  const updates = []
  // tell the others in the room's same world that this visitor changed something
  const share = id => ctx.share?.(id)
  const level = () => ctx.level()
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const refreshers = []

  // ---- the chamber ----
  const cave = fireCave({ light })
  root.add(cave.group)
  updates.push((dt, t) => cave.update(dt, t, ctx.camera, ctx.renderer))
  const stoneMat = cave.stoneMat

  // ---- the campfire and the triangle round it ----
  const fire = campfire({ light, stoneMat })
  root.add(fire.group)
  const tri = fireTriangle({ fire, stoneMat, words: W.triangle, level })
  root.add(tri.group)
  updates.push((dt, t) => tri.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => tri.refresh())
  // oxygen feeds a fire: the oxygen Atomling close to it makes it flare (not under the lid)
  let boost = 0
  updates.push((dt, t) => {
    const p = ctx.engine.player
    const at = p.mode === 'third' ? p.pos : p.npc ?? p.pos
    const near = Math.hypot(at.x, at.z) < 2.3 && tri.sides.oxygen.on ? 1 : 0
    boost += (near - boost) * Math.min(1, dt * 2)
    fire.update(dt, t, ctx.camera, ctx.renderer, boost)
  })

  const solids = []
  // the boulders round the walkable part (open to the south, where the arch is)
  const segs = 48
  for (let i = 0; i < segs; i++) {
    const a = ((i + 0.5) / segs) * Math.PI * 2
    if (Math.min(a, Math.PI * 2 - a) < 0.2) continue // the opening for the arch (south, +z)
    const x = Math.sin(a) * (CAVE.walk + 0.25)
    const z = Math.cos(a) * (CAVE.walk + 0.25)
    const chord = 2 * (CAVE.walk + 0.6) * Math.sin(Math.PI / segs) + 0.3
    solids.push(box(x, z, chord, 0.8, { rot: a }))
  }
  solids.push(circle(0, 0, 1.15, { y1: 0.5 }))
  for (const id of SIDES) {
    const s = tri.sides[id]
    solids.push(circle(s.post.position.x, s.post.position.z, 0.26))
  }

  // ---- the arch back to oxygen's hall, behind the spawn ----
  const back = arch({ width: 3.6, height: 4.4, color: '#5aa9ff', label: W.back, portal: 'swirl' })
  const archZ = CAVE.walk + 0.15
  back.group.position.set(0, 0, archZ)
  back.group.rotation.y = Math.PI
  root.add(back.group)
  updates.push((dt, t) => back.update(t))
  solids.push(box(0, archZ + 0.8, 4.6, 0.6))
  const doors = [{ x: 0, z: archZ + 0.25, radius: 0.85, to: atriumPath('O') }]

  // ---- exhibits ----
  // Every step is chosen by tapping the thing it is about (the user, 2026-10-30: E pressed again and
  // again felt passive): the prompt names the next tap, E opens the station's panel, whose buttons (and
  // the rust's slider) do the same. common/taps.js finds what was tapped.
  const ex = exhibitSet(ctx, { wing: 'fire', color: COLOR, who, busy: lv => at(W.busy, lv) })
  const taps = tapTargets(ctx)
  const clickable = taps.clickable
  // a far station's things are not raycast every frame
  const near = (x, z, d = 7) => () => within(ctx, x, z, d)
  const panels = {}
  const worldOf = obj => obj.getWorldPosition(new THREE.Vector3())

  // the fire triangle: three posts, one discovery; tap a side's post (or its glowing bar) to take that
  // side away, again to put it back
  const triStep = id => {
    const r = tri.toggle(id)
    if (!r) return void ex.sayBusy()
    share('triangle')
    const lv = level()
    if (r === 'take') ex.say(at(W.triangle.says[id], lv))
    else if (tri.complete) ex.say(at(W.triangle.says.back, lv))
    else ex.say(at(W.triangle.says.missing, lv) + tri.missing().map(m => W.triangle.missingNames[m]).join(', '))
    ex.discover(`triangle-${id}`, 3.5)
    for (const side of SIDES) ex.refreshPanel(`triangle-${side}`)
  }
  const triPanel = lv => ({
    title: W.triangle.title,
    kicker: W.kicker,
    color: COLOR,
    blocks: [
      { buttons: SIDES.map(id => ({ label: `${tri.sides[id].on ? W.triangle.verbs.take : W.triangle.verbs.give}: ${W.triangle.sides[id]}`, accent: !tri.sides[id].on, onClick: () => triStep(id) })) },
      ...W.triangle.panel[depth(lv)],
    ],
  })
  for (const id of SIDES) {
    const s = tri.sides[id]
    // the station view: the side's post and the fire behind it
    const look = s.mid.clone().addScaledVector(s.n, 0.1)
    panels[`triangle-${id}`] = ex.add({
      id: `triangle-${id}`,
      find: 'triangle',
      x: s.spot.x,
      z: s.spot.y,
      radius: 1.3,
      label: W.triangle.sides[id],
      verb: () => (tri.sides[id].on ? W.triangle.hints.take : W.triangle.hints.give),
      manual: true,
      focus: { x: look.x, y: 0.75, z: look.y, size: 2.4 },
      panel: triPanel,
    }).make
    clickable(s.post, () => triStep(id), { when: near(s.post.position.x, s.post.position.z) })
    clickable(s.bar, () => triStep(id), { when: near(s.post.position.x, s.post.position.z) })
  }

  // a stone north of the campfire, between the benches, framed in embers: the bush that burned and was
  // not burned up (src/content/scripture/)
  const verse = verseStone(ctx, 'fire', { frame: '#ff9a4d' })
  verse.group.position.set(0, 0, -7.9)
  root.add(verse.group)
  solids.push(box(0, -7.9, 1.9, 0.75))

  /** Puts a bench at an azimuth (degrees from north toward east) and distance, facing the fire. */
  const stand = (obj, az, dist) => {
    const a = (az * Math.PI) / 180
    const x = Math.sin(a) * dist
    const z = -Math.cos(a) * dist
    obj.position.set(x, 0, z)
    obj.rotation.y = Math.atan2(-x, -z)
    root.add(obj)
    const rot = obj.rotation.y
    return {
      x,
      z,
      rot,
      at: (lx, lz) => ({ x: x + lx * Math.cos(rot) + lz * Math.sin(rot), z: z - lx * Math.sin(rot) + lz * Math.cos(rot) }),
    }
  }
  const benchSolids = (b, w, scrX, scrZ) => {
    solids.push(box(b.x, b.z, w + 0.1, 0.95, { rot: b.rot }))
    const s = b.at(scrX, scrZ)
    solids.push(circle(s.x, s.z, 0.4))
  }

  // the candle under the jar (west)
  const candle = candleJar({ stoneMat, words: W.candle, level, light, decimal: decimalOf(lang) })
  const candleAt = stand(candle.group, -90, 7.7)
  benchSolids(candleAt, 1.6, 1.45, 0.35)
  updates.push((dt, t) => candle.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => candle.refresh())
  // the flame going out under someone else's jar is theirs to hear about
  candle.onOut = mine => {
    if (mine && ctx.engine.world?.root === root && !ctx.store.get().panel) ctx.store.set({ speech: { text: at(W.candle.says.out, level()), who, color: COLOR } })
  }
  const candleSpot = candleAt.at(0, 1.55)
  // tap the jar (or the candle) to cover the candle, again to lift the jar
  const candleStep = () => {
    const r = candle.toggle()
    share('candle')
    ex.say(at(W.candle.says[r], level()))
    // the first time, the panel after the flame has gone out (about nine seconds under the jar)
    ex.discover('candle', r === 'cover' ? 10 : 2)
    ex.refreshPanel('candle')
  }
  const candleFocus = candleAt.at(0.55, 0.15)
  panels.candle = ex.add({
    id: 'candle',
    x: candleSpot.x,
    z: candleSpot.z,
    radius: 1.5,
    screen: candle.screen,
    label: W.candle.label,
    verb: () => (candle.down ? W.candle.hints.lift : W.candle.hints.cover),
    manual: true,
    focus: { x: candleFocus.x, y: 1.3, z: candleFocus.z, size: 2.1 },
    panel: lv => ({
      title: W.candle.title,
      kicker: W.kicker,
      color: '#ffc35a',
      blocks: [{ buttons: [{ label: candle.down ? W.candle.verbs.lift : W.candle.verbs.cover, onClick: candleStep }] }, ...W.candle.panel[depth(lv)]],
    }),
  }).make
  for (const thing of candle.things) clickable(thing, candleStep, { when: near(candleAt.x, candleAt.z) })

  // the glowing splint (north-west)
  const splint = splintTest({ stoneMat, words: W.splint, level, light })
  const splintAt = stand(splint.group, -40, 7.7)
  benchSolids(splintAt, 1.5, 1.4, 0.35)
  updates.push((dt, t) => splint.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => splint.refresh())
  const splintSpot = splintAt.at(0, 1.55)
  // tap the glowing splint (or the tube) to put it into the oxygen
  const splintStep = () => {
    if (!splint.start()) return void ex.sayBusy()
    share('splint')
    ex.say(at(W.splint.says, level()))
    ex.discover('splint', 7.8)
  }
  const splintFocus = splintAt.at(0.55, 0.15)
  panels.splint = ex.add({
    id: 'splint',
    x: splintSpot.x,
    z: splintSpot.z,
    radius: 1.5,
    screen: splint.screen,
    label: W.splint.label,
    verb: W.splint.hint,
    manual: true,
    focus: { x: splintFocus.x, y: 1.35, z: splintFocus.z, size: 2.1 },
    panel: lv => ({
      title: W.splint.title,
      kicker: W.kicker,
      color: '#ffb070',
      blocks: [{ buttons: [{ label: W.splint.verb, onClick: splintStep }] }, ...W.splint.panel[depth(lv)]],
    }),
  }).make
  for (const thing of splint.things) clickable(thing, splintStep, { when: near(splintAt.x, splintAt.z) })

  // methane burning (north-east)
  const methane = methaneStage({ stoneMat, words: W.methane, level, light })
  const methaneAt = stand(methane.group, 40, 7.7)
  benchSolids(methaneAt, 1.7, 1.6, 0.45)
  updates.push((dt, t) => methane.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => methane.refresh())
  const methaneSpot = methaneAt.at(0, 1.6)
  // tap the molecules (or the gas ring) to burn them, again to set them up again
  const methaneStep = () => {
    const r = methane.act()
    if (!r) return void ex.sayBusy()
    share('methane')
    ex.say(at(W.methane.says[r], level()))
    ex.discover('methane', 4)
    ex.refreshPanel('methane')
  }
  const methaneFocus = methaneAt.at(0.55, 0.15)
  panels.methane = ex.add({
    id: 'methane',
    x: methaneSpot.x,
    z: methaneSpot.z,
    radius: 1.6,
    screen: methane.screen,
    label: W.methane.label,
    verb: () => (methane.state === 'after' || methane.state === 'burning' ? W.methane.hints.again : W.methane.hints.burn),
    manual: true,
    focus: { x: methaneFocus.x, y: 1.55, z: methaneFocus.z, size: 2.6 },
    panel: lv => ({
      title: W.methane.title,
      kicker: W.kicker,
      color: '#7fa8ff',
      blocks: [{ buttons: [{ label: methane.state === 'after' ? W.methane.verbs.again : W.methane.verbs.burn, onClick: methaneStep }] }, ...W.methane.panel[depth(lv)]],
    }),
  }).make
  for (const thing of methane.things) clickable(thing, methaneStep, { when: near(methaneAt.x, methaneAt.z) })

  // rust (east)
  const rust = rustTubes({ stoneMat, words: W.rust, level, light })
  const rustAt = stand(rust.group, 90, 7.7)
  benchSolids(rustAt, 1.6, 1.45, 0.35)
  updates.push((dt, t) => rust.update(dt, t))
  refreshers.push(() => rust.refresh())
  const rustSpot = rustAt.at(0, 1.55)
  // tap the tubes to run the week on (at its end, new nails); the panel's slider stops it at any day
  const rustStep = step => {
    const r = step === 'reset' ? rust.reset() : step === 'run' && !rust.busy && rust.day >= 7 ? (rust.reset(), rust.act()) : rust.act()
    if (!r) return void ex.sayBusy()
    share('rust')
    ex.say(at(W.rust.says[r], level()))
    ex.discover('rust', r === 'run' ? 8.5 : 1.5)
  }
  // the slider moves many times a second: the others get it a few times a second, and where it stopped
  let rustSend = null
  const rustDay = d => {
    rust.setDay(d)
    ex.discover('rust')
    if (!rustSend) {
      rustSend = setTimeout(() => {
        rustSend = null
        share('rust')
      }, 250)
    }
  }
  const rustFocus = rustAt.at(0.55, 0.15)
  panels.rust = ex.add({
    id: 'rust',
    x: rustSpot.x,
    z: rustSpot.z,
    radius: 1.5,
    screen: rust.screen,
    label: W.rust.label,
    verb: () => (rust.busy || rust.day >= 7 ? W.rust.hints.reset : rust.day > 0 ? W.rust.hints.rest : W.rust.hints.run),
    manual: true,
    focus: { x: rustFocus.x, y: 1.3, z: rustFocus.z, size: 2.1 },
    panel: lv => ({
      title: W.rust.title,
      kicker: W.kicker,
      color: '#e0703a',
      blocks: [
        { buttons: [{ label: W.rust.verbs.run, onClick: () => rustStep('run') }, { label: W.rust.verbs.reset, onClick: () => rustStep('reset') }] },
        { slider: { label: W.rust.slider, min: 0, max: 7, step: 0.1, value: rust.day, onInput: rustDay, format: v => W.rust.day(Math.floor(v + 1e-6)), live: () => rust.day } },
        ...W.rust.panel[depth(lv)],
      ],
    }),
  }).make
  for (const thing of rust.things) clickable(thing, () => rustStep('tap'), { when: near(rustAt.x, rustAt.z) })

  // an open panel's buttons follow its station, whoever changed it (someone else in the room too), and
  // the methane's when its burning ends
  const sides = () => SIDES.map(id => (tri.sides[id].on ? 1 : 0)).join('')
  for (const id of SIDES) ex.watch(`triangle-${id}`, sides)
  ex.watch('candle', () => candle.down)
  ex.watch('methane', () => methane.state === 'after')

  // ---- the oxygen Atomling ----
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)

  root.traverse(o => {
    if (o.isMesh && o.material?.isMeshStandardMaterial && !o.material.transparent) o.receiveShadow = true
  })

  // talking to the Atomling (T, the talk button, or E next to it in first person): hints and facts in turn
  let said = 0
  const talk = () => {
    const lines = [at(W.greet, level()), ...W.talk[depth(level())]]
    said = (said + 1) % lines.length
    ctx.store.set({ panel: null, speech: { text: chem(lines[said]), who, color: COLOR } })
  }
  const host = {
    id: 'host',
    get x() {
      return ctx.engine.player.npc?.x ?? 99
    },
    get z() {
      return ctx.engine.player.npc?.z ?? 99
    },
    radius: 2.0,
    label: who,
    verb: W.talkTo,
    onUse: talk,
  }

  // ---- what everyone in a room's same chamber shares (src/net/shared.js) ----
  // set(state, live): live, someone has just done it (it plays here); else a newcomer's view at once
  const shared = {
    triangle: { get: () => tri.state(), set: (s, live) => tri.setState(s, live) },
    // what unfolds over time has gone on since its state was taken (ago seconds)
    candle: { get: () => candle.state(), set: (s, live, ago) => candle.setState({ ...s, age: (Number(s.age) || 0) + ago }, live) },
    splint: { get: () => splint.state(), set: (s, live, ago) => splint.setState({ ...s, run: s.run >= 0 ? s.run + ago : s.run }, live) },
    methane: { get: () => methane.shared(), set: (s, live) => methane.setShared(s, live) },
    rust: { get: () => rust.state(), set: (s, live, ago) => rust.setState({ ...s, run: s.run >= 0 ? s.run + ago : s.run }, live) },
  }

  let unsub = null
  // the passage: a tap on it opens it too
  clickable(verse.group, () => verse.open())

  return {
    mode: 'walk',
    root,
    title: ctx.t('wings.O.fire.title'),
    env: {
      background: new THREE.Color('#050307'),
      fog: new THREE.Fog('#0d0806', 9, 32),
      exposure: 1.2,
      envIntensity: 0.12,
      bloom: { strength: 0.42, radius: 0.4, threshold: 1.05 }, // above the screens' text, under the fire
      fov: 62,
      shadows: true,
    },
    spawn: { x: 0, z: archZ - 2.4, yaw: 0 },
    hostSpot: { x: 1.7, z: archZ - 3.6, yaw: Math.atan2(1.7, -1.2) },
    avatar,
    solids,
    // inside the dome, and in front of the arch (its portal would fill the view from behind)
    cameraBounds: { minX: -9.4, maxX: 9.4, minY: 0.4, maxY: 8, minZ: -9.4, maxZ: archZ - 0.6 },
    // a little upward look, to the opening in the dome and the moonlight
    cameraPitchMax: 0.45,
    interactables: [...ex.list, host, verse.interactable()],
    doors,
    talk,
    shared,
    // the things to tap (common/taps.js)
    pointAt: taps.pointAt,
    onTap: taps.onTap,
    // for the probes in tools/: each station's taps by name, where its things are, its panel
    parts: {
      triangle: { tap: id => triStep(id), get state() { return tri.state() }, at: id => worldOf(tri.sides[id].post).setY(0.7) },
      candle: { tap: () => candleStep(), get down() { return candle.down }, get o2() { return candle.o2 }, at: thing => worldOf(thing === 'candle' ? candle.things[1] : candle.things[0]) },
      splint: { tap: () => splintStep(), get busy() { return splint.busy }, at: () => splint.splint.localToWorld(new THREE.Vector3(0, 0.24, 0)) },
      methane: { tap: () => methaneStep(), get stage() { return methane.state }, get busy() { return methane.busy }, at: () => worldOf(methane.stage) },
      rust: { tap: step => rustStep(step ?? 'tap'), day: d => rustDay(d), get busy() { return rust.busy }, get dayNow() { return rust.day }, at: () => worldOf(rust.things[0]) },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), new THREE.Vector3(p.x, p.y, p.z).sub(ctx.camera.position).normalize()),
    },
    panels,
    refresh: () => ex.refresh(),
    attach() {
      ex.report()
      unsub = onLevel(ctx.store, () => refreshers.forEach(f => f()))
      setTimeout(() => {
        if (ctx.engine.world?.root === root) ctx.store.set({ speech: { text: chem(at(W.greet, ctx.level())), who, color: COLOR } })
      }, 900)
    },
    detach() {
      unsub?.()
      clearTimeout(rustSend)
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      ex.sync()
    },
    dispose() {
      verse.dispose()
    },
  }
}
