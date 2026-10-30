// A picture room (/e/<Symbol>/<board id>), one module for every picture in every hall
// (docs/knowledge/picture-rooms.md). The user's son, on first seeing the halls' picture boards
// (2026-10-30): "How can I get inside these pictures?" A board with a scene (scenes/<Symbol>/<id>.js)
// is stepped into from the hall; inside are the scene the picture shows, its things to do, the picture's
// own story on an easel, the element's Atomling, and the picture's frame standing behind you as the way
// back. Contract: docs/knowledge/adding-a-wing.md; a scene builds its stage and things (pictures/README.md).
import * as THREE from 'three'
import { element, nameOf } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { circle } from '../../engine/collide.js'
import { markFound } from '../../engine/progress.js'
import { loadBoards, boardArt } from '../../content/boards/index.js'
import { pick } from '../../content/stations.js'
import { inLang } from '../../i18n/langs.js'
import { atriumPath, wingsOf, wingPath } from '../registry.js'
import { at, exhibitSet, fontsReady } from '../wings/noble/kit.js'
import { frameDoor, storyStand } from './kit.js'
import { loadScene } from './index.js'
import { PIC_WORDS } from './words.js'

export async function build(ctx, target) {
  const sym = target.symbol
  const id = target.wing
  const el = element(sym)
  const [scene, boards] = await Promise.all([loadScene(sym, id), loadBoards(sym)])
  const board = boards?.find(b => b.id === id)
  if (!board) throw new Error(`no picture ${id} in ${sym}'s hall`)
  const lang = scene.WORDS[ctx.lang()] ? ctx.lang() : 'en'
  const E = scene.WORDS[lang]
  const W = PIC_WORDS[lang] ?? PIC_WORDS.en
  const color = board.color
  const who = nameOf(el, lang)
  const level = () => ctx.level()
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const root = new THREE.Group()
  root.name = `picture-${sym}-${id}`
  const timers = []
  const later = (s, fn) => timers.push({ at: s, fn })
  const here = () => ctx.engine.world?.root === root
  await fontsReady()

  const ex = exhibitSet(ctx, { prefix: `${sym}:${id}`, color, who, busy: lv => at(W.busy, lv), later })
  const say = (text, c = color) => {
    if (here() && text) ctx.store.set({ speech: { text, who, color: c } })
  }

  // things worked by hand: a click or a tap on the thing itself does the step it is for (the user,
  // 2026-10-30: choosing the next step by touching the sand, the soda, the pot beats pressing E again
  // and again). clickable(object, onTap, { when, reach, accept }): `when()` says whether it can be used
  // now (the hand shows only then), `reach` how near the visitor must stand (m), `accept(hit)` which hits
  // count (the clear corner of a cut face is no place to tap).
  const clicks = []
  const caster = new THREE.Raycaster()
  const clickable = (object, onTap, { when = () => true, reach = 4.5, accept = null } = {}) => clicks.push({ object, onTap, when, reach, accept })
  const clickAt = ray => {
    if (!ray || !clicks.length) return null
    caster.ray.copy(ray)
    // sprites need the camera to be hit
    caster.camera = ctx.camera
    const p = ctx.engine.player.pos
    let best = null
    for (const c of clicks) {
      if (!c.object.visible || !c.when()) continue
      const hit = caster.intersectObject(c.object, true).find(h => !c.accept || c.accept(h))
      if (!hit || (best && hit.distance >= best.hit.distance)) continue
      if (Math.hypot(hit.point.x - p.x, hit.point.z - p.z) > c.reach) continue
      best = { c, hit }
    }
    return best
  }

  // the scene: its stage, light and things to do
  const st = await scene.build({ ctx, root, el, sym, lang, E, W, ex, say, later, light: ctx.light, color, level, depth, clickable })
  const solids = st.solids

  // the picture's frame behind the spawn: walking into it goes back to the hall, out in front of the picture
  const door = frameDoor({ color, label: W.back })
  door.group.position.set(st.back.x, 0, st.back.z)
  door.group.rotation.y = st.back.rot
  root.add(door.group)
  const side = new THREE.Vector3(1.5, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), st.back.rot)
  solids.push(circle(st.back.x + side.x, st.back.z + side.z, 0.25), circle(st.back.x - side.x, st.back.z - side.z, 0.25))
  const doors = [{ x: st.back.x, z: st.back.z, radius: 0.8, to: atriumPath(sym) }]

  // the easel with the picture: its story, as the hall's board told it
  const title = inLang(board.title, lang)
  const wing = board.wing && wingsOf(sym).find(w => w.id === board.wing)
  const stand = storyStand({ url: boardArt(sym, id), color })
  stand.group.position.set(st.stand.x, 0, st.stand.z)
  stand.group.rotation.y = st.stand.rot
  root.add(stand.group)
  solids.push(circle(st.stand.x, st.stand.z, 0.45))
  const story = lv => ({
    title,
    kicker: `${sym} · ${who}`,
    color,
    blocks: [
      { img: boardArt(sym, id), alt: title, crop: 0.8 },
      ...pick(board.story, lang, lv).map(p => ({ p })),
      wing && { link: { to: wingPath(sym, wing.id), label: ctx.t(`wings.${sym}.${wing.id}.title`) } },
    ].filter(Boolean),
  })
  const front = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), st.stand.rot)
  ex.add({
    id: 'story',
    x: st.stand.x + front.x * 0.9,
    z: st.stand.z + front.z * 0.9,
    radius: 1.4,
    label: W.story,
    verb: W.read,
    panel: story,
    screens: [stand],
    focus: { x: st.stand.x, y: 1.2, z: st.stand.z, size: 1.3 },
  })

  // the element's Atomling, greeting and telling
  const avatar = createAtomling(el, { light: ctx.light })
  root.add(avatar.root)
  let said = 0
  const talk = () => {
    const lines = [at(E.greet, level()), ...E.talk[depth(level())]]
    said = (said + 1) % lines.length
    ctx.store.set({ panel: null, speech: { text: lines[said], who, color } })
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

  return {
    mode: 'walk',
    root,
    title: E.title,
    env: st.env,
    spawn: st.spawn,
    hostSpot: st.hostSpot,
    avatar,
    solids,
    floor: st.floor,
    cameraBounds: st.cameraBounds,
    cameraClear: st.cameraClear,
    cameraPitchMax: st.cameraPitchMax,
    interactables: [...ex.list, host],
    doors,
    talk,
    pointAt: ray => !!clickAt(ray),
    onTap(ray) {
      const best = clickAt(ray)
      if (best) best.c.onTap(best.hit)
    },
    // for the probes in tools/ (__ew.world.parts, __ew.world.panels)
    parts: st.parts,
    panels: { story, ...st.panels },
    shared: st.shared,
    refresh: () => ex.refresh(),
    attach() {
      // stepping into the picture is exploring it: the hall counts its board as found
      markFound(`${sym}:board:${id}`)
      ex.report()
      later(0.9, () => say(at(E.greet, level())))
      st.attach?.()
    },
    detach() {
      st.detach?.()
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
      door.update(t)
      stand.update(t)
      st.update?.(dt, t)
      ex.sync()
    },
    dispose() {
      st.dispose?.()
      stand.dispose()
    },
  }
}
