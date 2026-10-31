// Sodium's Periodic Videos room: the five scenes of its film (docs/pv/Na.md) as stations. The oil tin
// (lift the rod out, cut a slice, watch it tarnish), the courtyard bowl (three lumps, the flame, the bang, the
// indicator), the salt window (it cracks at right angles; the lattice inside), the salt lamp, the professor's
// card. Each step is chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt
// passive): the tin, the knife, a lump, the indicator bottle, the window, the lamp's switch; the prompt names
// the next tap, and E opens the station's panel, whose buttons do the same. In a room the tin, the bowl, the
// window and the lamp are shared (`shared` below, src/net/shared.js); the words, the panels and the film
// stay each one's own. parts.tap.<thing>() does what a tap on it does, parts.at.<thing>() gives a point to
// aim a real tap at (for the probes).
import * as THREE from 'three'
import { at, fill, num } from '../noble/kit.js'
import { play } from '../../../audio/sound.js'
import { SPOTS } from './lab.js'
import { oilTin, courtyardBowl, saltWindow, saltLamp, noteCard } from './apparatus.js'
import { NA_WORDS } from './Na.words.js'

export const WORDS = NA_WORDS
/** The room's colour: sodium's flame (589 nm). */
export const COLOR = '#ffb21e'

/** The film's chapters for the screen: each station's part, and the big lump of "take two". */
export const chapters = E => [
  { label: E.tin.title, part: 'tin' },
  { label: E.bowl.title, part: 'bowl' },
  { label: E.window.title, part: 'window' },
  { label: E.lamp.title, part: 'lamp' },
  { label: E.bowl.buttons.bang.replace(/\s*\(\{t\}\)/, ''), part: 'bang' },
  { label: E.note.title, part: 'note' },
]

const put = (root, part, spot, scale = 1) => {
  part.group.scale.setScalar(scale)
  part.group.position.set(spot.x, spot.y, spot.z)
  part.group.rotation.y = spot.face
  root.add(part.group)
}
const SIZES = ['small', 'medium', 'large']
// how near the visitor must stand to tap a station's things (m)
const REACH = 3.5

export function stations({ ctx, root, el, lang, E, W, ex, say, panel, light, clickable, reopen }) {
  const level = () => ctx.level()
  // tell the others in the room's same lab that this visitor changed something
  const share = id => ctx.share?.(id)
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  // the numbers in the words, from the game's data
  const vars = {
    melt: num(el.melt - 273.15, 1, lang),
    density: num(el.density, 2, lang),
    ie: num(el.ie[0] * 96.485, 0, lang),
  }
  const paras = list => list.map(p => ({ p: fill(p, vars) }))

  // ---- the oil tin, in the fume cupboard: tap the tin to lift the rod out, the knife to cut ----
  const tin = oilTin()
  put(root, tin, SPOTS.bench)
  const tinHint = () => {
    const h = E.tin.hints
    if (tin.busy) return h.watch
    if (tin.inTin) return h.lift
    return tin.short ? h.fresh : h.cut
  }
  const tinPanel = panel({
    id: 'tin',
    title: E.tin.title,
    parts: ['tin'],
    blocks: lv => [
      ...paras(E.tin.panel[depth(lv)]),
      { buttons: [{ label: E.tin.buttons.lift, onClick: () => liftRod() }, { label: E.tin.buttons.cut, onClick: () => cutRod() }] },
    ],
  })
  /** The tin: the rod comes out onto the paper (a new one once the last is used up). */
  function liftRod() {
    if (tin.busy) return say(W.busy)
    if (!tin.inTin && !tin.short) return say(tinHint())
    tin.lift()
    share('tin')
    play('tap')
    say(at(E.tin.says.lift, level()))
  }
  /** The knife: a slice off the rod's end, its fresh face shining, then dulling. */
  function cutRod() {
    if (tin.busy) return say(W.busy)
    if (tin.inTin || tin.short) return say(tinHint())
    tin.cut()
    share('tin')
    play('tap')
    say(at(E.tin.says.cut, level()))
    ex.discover('tin', tinPanel, 2.6)
  }
  ex.add({
    id: 'tin',
    x: SPOTS.bench.at.x,
    z: SPOTS.bench.at.z,
    radius: 1.6,
    manual: true,
    // wide enough on an upright phone for the tin and the knife on the paper
    focus: { x: SPOTS.bench.x + 0.1, y: SPOTS.bench.y + 0.12, z: SPOTS.bench.z + 0.35, size: 0.9, width: 1.1 },
    label: E.tin.label,
    verb: tinHint,
    act: () => ctx.showPanel(tinPanel),
  })
  clickable(tin.can, () => liftRod(), { reach: REACH })
  clickable(tin.rod, () => (tin.inTin ? liftRod() : cutRod()), { reach: REACH })
  clickable(tin.knife, () => cutRod(), { reach: REACH })

  // ---- the courtyard bowl, on the red bench: tap a lump to drop it in, the bottle for the indicator ----
  let next = 'medium'
  let fizzIn = 0
  // the lump in the bowl was this visitor's: someone else's flames and bangs here too, without the words
  let mine = true
  // the same for the drop of indicator
  let inkMine = true
  const bowl = courtyardBowl({
    light,
    on: {
      splash: () => play('tap'),
      flame: () => {
        if (mine) say(at(E.bowl.says.flame, level()))
        play('pop')
      },
      bang: () => {
        if (mine) say(at(E.bowl.says.bang, level()))
        play('bang')
      },
      pop: () => play('pop'),
      done: size => mine && size === 'small' && say(at(E.bowl.says.small, level())),
      pink: () => {
        play('tap')
        if (inkMine) say(at(E.bowl.says.pink, level()))
      },
    },
  })
  put(root, bowl, SPOTS.yard)
  const bowlHint = () => {
    const h = E.bowl.hints
    if (bowl.busy) return h.watch
    if (!bowl.used) return h.first
    if (bowl.pink) return h.again
    if (bowl.state().size === 'large') return h.indicator
    return h[next]
  }
  const bowlPanel = panel({
    id: 'bowl',
    title: E.bowl.title,
    parts: ['bowl', 'bang'],
    extra: { bang: E.bowl.buttons.bang },
    blocks: lv => [
      ...paras(E.bowl.panel[depth(lv)]),
      { buttons: [...SIZES.map(s => ({ label: E.bowl.buttons[s], onClick: () => drop(s) })), { label: E.bowl.buttons.indicator, onClick: () => addIndicator() }] },
      { p: W.never },
    ],
  })
  /** A lump on the tile: carried over the bowl and dropped in. */
  function drop(size) {
    if (!bowl.drop(size)) {
      say(W.busy)
      return false
    }
    mine = true
    next = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length]
    share('bowl')
    ex.discover('bowl', bowlPanel, 1.4)
    return true
  }
  /** The indicator bottle: a drop falls from the dropper, and the alkaline water turns pink. */
  function addIndicator() {
    if (bowl.busy) return say(W.busy)
    if (!bowl.used) return say(at(E.bowl.says.notyet, level()))
    if (bowl.pink) return say(at(E.bowl.says.pink, level()))
    bowl.indicator()
    inkMine = true
    share('bowl')
    play('tap')
  }
  ex.add({
    id: 'bowl',
    x: SPOTS.yard.at.x,
    z: SPOTS.yard.at.z,
    radius: 1.8,
    manual: true,
    focus: { x: SPOTS.yard.x, y: SPOTS.yard.y + 0.08, z: SPOTS.yard.z, size: 0.9, width: 1.2 },
    label: E.bowl.label,
    verb: bowlHint,
    act: () => ctx.showPanel(bowlPanel),
  })
  for (const s of SIZES) clickable(bowl.lumps[s], () => drop(s), { reach: REACH })
  clickable(bowl.bottle, () => addIndicator(), { reach: REACH })

  // ---- the salt window, on the desk: tap it to crack it, again for a new one ----
  const win = saltWindow({ light })
  put(root, win, SPOTS.deskA, 1.7)
  const winPanel = panel({
    id: 'window',
    title: E.window.title,
    parts: ['window'],
    blocks: lv => [...paras(E.window.panel[depth(lv)]), { buttons: [{ label: win.cracked ? E.window.again : E.window.crack, onClick: () => crackWindow() }] }],
  })
  function crackWindow() {
    const r = win.act()
    share('window')
    reopen(winPanel)
    if (r !== 'crack') return play('tap')
    play('crack')
    say(at(E.window.says, level()))
    ex.discover('window', winPanel, 2.0)
  }
  ex.add({
    id: 'window',
    x: SPOTS.deskA.at.x,
    z: SPOTS.deskA.at.z,
    radius: 1.45,
    manual: true,
    focus: { x: SPOTS.deskA.x, y: SPOTS.deskA.y + 0.35, z: SPOTS.deskA.z, size: 0.9 },
    label: E.window.label,
    verb: () => (win.cracked ? E.window.hints.again : E.window.hints.crack),
    act: () => ctx.showPanel(winPanel),
  })
  clickable(win.cell, () => crackWindow(), { reach: REACH })

  // ---- the salt lamp, on the side table: tap its switch (or the lamp) ----
  const lamp = saltLamp({ light })
  put(root, lamp, SPOTS.side)
  const lampPanel = panel({
    id: 'lamp',
    title: E.lamp.title,
    parts: ['lamp'],
    blocks: lv => [...paras(E.lamp.panel[depth(lv)]), { buttons: [{ label: lamp.on ? E.lamp.off : E.lamp.on, onClick: () => switchLamp() }] }],
  })
  function switchLamp() {
    lamp.act()
    share('lamp')
    play('tap')
    reopen(lampPanel)
    ex.discover('lamp', lampPanel, 0.6)
  }
  ex.add({
    id: 'lamp',
    x: SPOTS.side.at.x,
    z: SPOTS.side.at.z,
    radius: 1.45,
    manual: true,
    focus: { x: SPOTS.side.x, y: SPOTS.side.y + 0.2, z: SPOTS.side.z, size: 0.8 },
    label: E.lamp.label,
    verb: () => (lamp.on ? E.lamp.hints.off : E.lamp.hints.on),
    act: () => ctx.showPanel(lampPanel),
  })
  clickable(lamp.switcher, () => switchLamp(), { reach: REACH })
  clickable(lamp.rock, () => switchLamp(), { reach: REACH })

  // the professor's card, on the desk: only read
  const card = noteCard({ big: 'Na', small: 'Ena' })
  put(root, card, SPOTS.deskB)
  ex.add({
    id: 'note',
    x: SPOTS.deskB.at.x,
    z: SPOTS.deskB.at.z,
    radius: 1.35,
    focus: { x: SPOTS.deskB.x, y: SPOTS.deskB.y + 0.06, z: SPOTS.deskB.z, size: 0.5 },
    label: E.note.label,
    verb: E.note.read,
    panel: panel({ id: 'note', title: E.note.title, parts: ['note'], blocks: lv => paras(E.note.panel[depth(lv)]) }),
  })

  // what everyone in a room's same lab shares (src/net/shared.js): set(state, live), live when someone has
  // just done it (it plays here, with its sound), else a newcomer's view at once
  const shared = {
    tin: { get: () => tin.state(), set: (s, live) => tin.setState(s, live) && play('tap') },
    bowl: {
      get: () => ({ ...bowl.state(), next }),
      set: (s, live) => {
        if (SIZES.includes(s.next)) next = s.next
        const wasPink = bowl.pink
        if (bowl.setState(s, live)) mine = false
        if (!wasPink && bowl.pink) inkMine = false
      },
    },
    window: { get: () => win.state(), set: (s, live) => win.setState(s, live) && play('crack') },
    lamp: { get: () => lamp.state(), set: (s, live) => lamp.setState(s, live) && play('tap') },
  }

  // points to aim a real tap at: __ew.world.onTap(p.rayTo(p.at.knife())) with p = __ew.world.parts
  const point = (obj, x = 0, y = 0, z = 0) => obj.localToWorld(new THREE.Vector3(x, y, z))
  return {
    parts: {
      tin,
      bowl,
      win,
      lamp,
      card,
      // what a tap on each thing does
      tap: { tin: liftRod, knife: cutRod, lump: s => drop(s), indicator: addIndicator, window: crackWindow, lamp: switchLamp },
      at: {
        tin: () => point(tin.can, 0, 0.13, 0),
        rod: () => point(tin.rod, 0, 0.12, 0),
        knife: () => point(tin.knife, 0.03, 0, 0),
        lump: s => point(bowl.lumps[s]),
        indicator: () => point(bowl.bottle, 0, 0.04, 0),
        window: () => point(win.cell, 0.006, 0.1, 0),
        lamp: () => point(lamp.switcher, 0, 0.015, 0),
      },
    },
    shared,
    update(dt, t, camera, viewHeight) {
      tin.update(dt)
      bowl.update(dt, t, camera, viewHeight)
      win.update(dt, t)
      lamp.update(dt)
      // the hiss while a lump skates
      fizzIn -= dt
      if (bowl.fizzing && fizzIn <= 0) {
        play('fizz')
        fizzIn = 0.65
      }
    },
  }
}
