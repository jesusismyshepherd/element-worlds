// Oxygen's second wing, fire: a round stone chamber, dark and warm, lit by a campfire in the middle,
// smoke rising to an opening in the dome where the moonlight comes in. Round the fire, the fire
// triangle (take away fuel, heat or oxygen and the fire dies; put it back and it lights again); on
// stone benches round the walls, the candle under a jar, the glowing splint test, methane burning atom
// by atom, and rust as a slow burning. Contract: docs/knowledge/adding-a-wing.md. In a room, everyone
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
import { exhibitSet, onLevel, at, chem } from './kit.js'

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
  const ex = exhibitSet(ctx, { wing: 'fire', color: COLOR, who, busy: lv => at(W.busy, lv) })

  // the fire triangle: three posts, one discovery
  const triPanel = lv => ({ title: W.triangle.title, kicker: W.kicker, color: COLOR, blocks: W.triangle.panel[depth(lv)] })
  for (const id of SIDES) {
    const s = tri.sides[id]
    ex.add({
      id: `triangle-${id}`,
      find: 'triangle',
      x: s.spot.x,
      z: s.spot.y,
      radius: 1.3,
      label: W.triangle.sides[id],
      verb: () => (tri.sides[id].on ? W.triangle.verbs.take : W.triangle.verbs.give),
      act: () => {
        const r = tri.toggle(id)
        if (!r) return false
        share('triangle')
        if (r === 'take') return at(W.triangle.says[id], level())
        if (tri.complete) return at(W.triangle.says.back, level())
        return at(W.triangle.says.missing, level()) + tri.missing().map(m => W.triangle.missingNames[m]).join(', ')
      },
      panel: triPanel,
    })
  }

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
  ex.add({
    id: 'candle',
    x: candleSpot.x,
    z: candleSpot.z,
    radius: 1.5,
    screen: candle.screen,
    label: W.candle.label,
    verb: () => (candle.down ? W.candle.verbs.lift : W.candle.verbs.cover),
    act: () => {
      const r = candle.toggle()
      share('candle')
      return at(W.candle.says[r], level())
    },
    panel: lv => ({ title: W.candle.title, kicker: W.kicker, color: '#ffc35a', blocks: W.candle.panel[depth(lv)] }),
  })

  // the glowing splint (north-west)
  const splint = splintTest({ stoneMat, words: W.splint, level, light })
  const splintAt = stand(splint.group, -40, 7.7)
  benchSolids(splintAt, 1.5, 1.4, 0.35)
  updates.push((dt, t) => splint.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => splint.refresh())
  const splintSpot = splintAt.at(0, 1.55)
  ex.add({
    id: 'splint',
    x: splintSpot.x,
    z: splintSpot.z,
    radius: 1.5,
    screen: splint.screen,
    label: W.splint.label,
    verb: W.splint.verb,
    act: () => {
      if (!splint.start()) return false
      share('splint')
      return at(W.splint.says, level())
    },
    panel: lv => ({ title: W.splint.title, kicker: W.kicker, color: '#ffb070', blocks: W.splint.panel[depth(lv)] }),
  })

  // methane burning (north-east)
  const methane = methaneStage({ stoneMat, words: W.methane, level, light })
  const methaneAt = stand(methane.group, 40, 7.7)
  benchSolids(methaneAt, 1.7, 1.6, 0.45)
  updates.push((dt, t) => methane.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => methane.refresh())
  const methaneSpot = methaneAt.at(0, 1.6)
  ex.add({
    id: 'methane',
    x: methaneSpot.x,
    z: methaneSpot.z,
    radius: 1.6,
    screen: methane.screen,
    label: W.methane.label,
    verb: () => (methane.state === 'after' ? W.methane.verbs.again : W.methane.verbs.burn),
    act: () => {
      const r = methane.act()
      if (!r) return false
      share('methane')
      return at(W.methane.says[r], level())
    },
    panel: lv => ({ title: W.methane.title, kicker: W.kicker, color: '#7fa8ff', blocks: W.methane.panel[depth(lv)] }),
  })

  // rust (east)
  const rust = rustTubes({ stoneMat, words: W.rust, level, light })
  const rustAt = stand(rust.group, 90, 7.7)
  benchSolids(rustAt, 1.6, 1.45, 0.35)
  updates.push((dt, t) => rust.update(dt, t))
  refreshers.push(() => rust.refresh())
  const rustSpot = rustAt.at(0, 1.55)
  ex.add({
    id: 'rust',
    x: rustSpot.x,
    z: rustSpot.z,
    radius: 1.5,
    screen: rust.screen,
    label: W.rust.label,
    verb: () => (rust.rusted ? W.rust.verbs.reset : W.rust.verbs.run),
    act: () => {
      const r = rust.act()
      if (!r) return false
      share('rust')
      return at(W.rust.says[r], level())
    },
    panel: lv => ({ title: W.rust.title, kicker: W.kicker, color: '#e0703a', blocks: W.rust.panel[depth(lv)] }),
  })

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
    interactables: [...ex.list, host],
    doors,
    talk,
    shared,
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
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      ex.sync()
    },
    dispose() {},
  }
}
