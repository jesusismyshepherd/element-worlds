// The Periodic Videos room (/e/<Symbol>/videos), one module for every element that has one
// (docs/knowledge/periodic-videos.md): the lab and courtyard of lab.js, the element's film on the screen by the
// courtyard door, and the element's stations (<Symbol>.js), each with "Watch this part": the film opens in the
// station's own panel at the moment its experiment starts, beside the buttons that do it. Contract:
// docs/knowledge/adding-a-wing.md. In a room, everyone in the same lab shares its experiments (each
// <Symbol>.js's `shared`, src/net/shared.js); the film, the panels and the words stay each one's own.
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { box, circle } from '../../../engine/collide.js'
import { atriumPath } from '../../registry.js'
import { at, fill, exhibitSet, onLevel, fontsReady } from '../noble/kit.js'
import { labRoom, LAB, SPOTS, DOORS } from './lab.js'
import { videoScreen } from './apparatus.js'
import { professor } from './professor.js'
import { PV_WORDS } from './pv.words.js'
import { VIDEOS, ROOMS, embedUrl, watchUrl, clock } from './videos.js'

const STATIONS = { Na: () => import('./Na.js'), Si: () => import('./Si.js') }

export async function build(ctx, target) {
  const sym = ROOMS.includes(target?.symbol) ? target.symbol : 'Na'
  const el = element(sym)
  const video = VIDEOS[sym]
  const mod = await STATIONS[sym]()
  const lang = PV_WORDS[ctx.lang()] && mod.WORDS[ctx.lang()] ? ctx.lang() : 'en'
  const W = PV_WORDS[lang]
  const E = mod.WORDS[lang]
  const forms = E.forms
  const light = ctx.light
  const level = () => ctx.level()
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const COLOR = mod.COLOR
  const who = nameOf(el, lang)
  const root = new THREE.Group()
  root.name = `wing-${sym}-videos`
  const timers = []
  const later = (s, fn) => timers.push({ at: s, fn })
  const here = () => ctx.engine.world?.root === root
  await fontsReady()

  const room = labRoom({ light })
  root.add(room.group)
  const solids = room.solids

  const ex = exhibitSet(ctx, { prefix: `${sym}:videos`, color: COLOR, who, busy: () => W.busy, later })
  const say = (text, c = COLOR) => {
    if (here() && text) ctx.store.set({ speech: { text, who, color: c } })
  }

  // the film in a panel: YouTube's player from a moment, the credit, the same moment on YouTube
  const credit = fill(W.credit, { year: video.year })
  const filmTitle = fill(W.screen.title, forms)
  const film = start => [
    { video: { src: embedUrl(video.id, start), title: filmTitle, credit } },
    { href: { url: watchUrl(video.id, start), label: W.youtube } },
  ]

  /** A station's panel: its words and buttons, and a button per part of the film it comes from (the first
   *  "Watch this part", the others with their own label); the film opens on top, at that part. */
  const watching = {}
  const panels = {} // each station's panel, by its id (for the probes: __ew.showPanel(__ew.world.panels.bowl))
  const panel = ({ id, title, parts, extra = {}, blocks }) => {
    const make = lv => {
      const on = watching[id]
      const watchButtons = parts.map((p, i) => ({
        label: on === p ? W.hide : fill(i === 0 ? W.watch : extra[p], { t: clock(video.parts[p]) }),
        accent: true,
        onClick: () => {
          watching[id] = watching[id] === p ? null : p
          ctx.showPanel(make)
        },
      }))
      return {
        title,
        kicker: W.kicker,
        color: COLOR,
        blocks: [...(on ? film(video.parts[on]) : []), ...blocks(lv), { buttons: watchButtons }],
      }
    }
    panels[id] = make
    return make
  }

  // the element's stations
  const st = mod.stations({ ctx, root, el, lang, E, W, ex, say, panel, light })

  // the screen on the north wall: the whole film, and a chapter per experiment
  const screen = videoScreen({ name: nameOf(el, lang), symbol: sym, Z: el.z, line: W.screen.line, color: COLOR })
  screen.group.position.set(SPOTS.screen.x, SPOTS.screen.y, SPOTS.screen.z + 0.04)
  root.add(screen.group)
  let from = 0
  const screenPanel = lv => ({
    title: filmTitle,
    kicker: W.kicker,
    color: COLOR,
    blocks: [
      ...film(from),
      ...W.screenPanel[depth(lv)].map(p => ({ p: fill(p, forms) })),
      { h: W.chapters },
      {
        buttons: mod.chapters(E).map(c => ({
          label: `${clock(video.parts[c.part])}  ${c.label}`,
          onClick: () => {
            from = video.parts[c.part]
            ctx.showPanel(screenPanel)
          },
        })),
      },
    ],
  })
  ex.add({ id: 'screen', x: SPOTS.screen.at.x, z: SPOTS.screen.at.z, radius: 1.8, label: W.screen.label, verb: W.screen.verb, panel: screenPanel, focus: { x: SPOTS.screen.x, y: SPOTS.screen.y, z: SPOTS.screen.z, size: 1.6 } })

  // the professor in his corner: his own remarks from the film, one at a time, each with its moment
  let prof = null
  if (E.prof && video.prof) {
    prof = professor({ light })
    prof.group.position.set(SPOTS.prof.x, 0, SPOTS.prof.z)
    prof.group.rotation.y = SPOTS.prof.face
    root.add(prof.group)
    solids.push(circle(SPOTS.prof.x, SPOTS.prof.z, 0.35))
    let line = -1
    let watchingProf = false
    const profPanel = () => {
      const t = video.prof[line]
      return {
        title: E.prof.name,
        kicker: W.kicker,
        color: COLOR,
        blocks: [
          ...(watchingProf ? film(t) : []),
          { p: E.prof.lines[line] },
          {
            buttons: [
              {
                label: watchingProf ? W.hide : fill(E.prof.watch, { t: clock(t) }),
                accent: true,
                onClick: () => {
                  watchingProf = !watchingProf
                  ctx.showPanel(profPanel)
                },
              },
              { label: E.prof.next, onClick: () => sayNext() },
            ],
          },
          { p: E.prof.note },
        ],
      }
    }
    const sayNext = () => {
      line = (line + 1) % E.prof.lines.length
      watchingProf = false
      prof.gesture()
      ctx.showPanel(profPanel)
    }
    ex.add({
      id: 'prof',
      x: SPOTS.prof.at.x,
      z: SPOTS.prof.at.z,
      radius: 1.7,
      label: E.prof.name,
      verb: E.prof.verb,
      manual: true,
      focus: { x: SPOTS.prof.x, y: 1.5, z: SPOTS.prof.z, size: 1.9 },
      act: () => {
        sayNext()
        ex.discover('prof')
      },
    })
  }

  // the arch back to the element's hall, behind the spawn
  const back = arch({ width: 3.4, height: 3.1, color: COLOR, label: fill(W.back, forms), portal: 'swirl' })
  back.group.position.set(0, 0, LAB.z1 - 0.1)
  back.group.rotation.y = Math.PI
  root.add(back.group)
  solids.push(box(0, LAB.z1 + 0.55, DOORS.south + 0.4, 0.6))
  const doors = [{ x: 0, z: LAB.z1 - 0.35, radius: 0.85, to: atriumPath(sym) }]

  // the element's Atomling, greeting and telling
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)
  let said = 0
  const talk = () => {
    const lines = [at(E.greet, level()), ...E.talk[depth(level())]]
    said = (said + 1) % lines.length
    ctx.store.set({ panel: null, speech: { text: lines[said], who, color: COLOR } })
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

  const size = new THREE.Vector2()
  let unsub = null
  return {
    mode: 'walk',
    root,
    title: ctx.t(`wings.${sym}.videos.title`),
    env: {
      background: new THREE.Color('#c9d3dd'),
      fog: new THREE.Fog('#c9d3dd', 26, 60),
      exposure: 0.95,
      envIntensity: 0.4,
      bloom: { strength: 0.5, radius: 0.5, threshold: 1.0 },
      fov: 62,
    },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: 1.7, z: 3.3, yaw: Math.atan2(1.7, -1.3) },
    avatar,
    solids,
    cameraBounds: { minX: LAB.x0 + 0.3, maxX: LAB.x1 - 0.3, minY: 0.4, maxY: LAB.h - 0.3, minZ: -12.2, maxZ: LAB.z1 - 0.5 },
    cameraPitchMax: 0.4,
    interactables: [...ex.list, host],
    doors,
    talk,
    // for the probes in tools/ (__ew.world.parts.bowl.busy and so on)
    parts: st.parts,
    panels,
    shared: st.shared,
    refresh: () => ex.refresh(),
    attach() {
      ex.report()
      unsub = onLevel(ctx.store, () => {})
      later(0.9, () => say(at(E.greet, level())))
    },
    detach() {
      unsub?.()
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
      back.update(t)
      prof?.update(dt, t, ctx.engine.player.pos)
      ctx.renderer.getDrawingBufferSize(size)
      st.update(dt, t, ctx.camera, size.y)
      ex.sync()
    },
  }
}
