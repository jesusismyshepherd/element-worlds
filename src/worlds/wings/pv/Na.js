// Sodium's Periodic Videos room: the five scenes of its film (docs/pv/Na.md) as stations. The oil tin
// (cut a slice, watch it tarnish), the courtyard bowl (three lumps, the flame, the bang, the indicator), the
// salt window (it cracks at right angles; the lattice inside), the salt lamp, the professor's card.
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

export function stations({ ctx, root, el, lang, E, W, ex, say, panel, light }) {
  const level = () => ctx.level()
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  // the numbers in the words, from the game's data
  const vars = {
    melt: num(el.melt - 273.15, 1, lang),
    density: num(el.density, 2, lang),
    ie: num(el.ie[0] * 96.485, 0, lang),
  }
  const paras = list => list.map(p => ({ p: fill(p, vars) }))

  // the oil tin, in the fume cupboard
  const tin = oilTin()
  put(root, tin, SPOTS.bench)
  ex.add({
    id: 'tin',
    x: SPOTS.bench.at.x,
    z: SPOTS.bench.at.z,
    radius: 1.6,
    label: E.tin.label,
    verb: () => (tin.busy ? E.tin.cutting : E.tin.cut),
    act: () => {
      if (!tin.act()) return false
      play('tap')
      return at(E.tin.says, level())
    },
    panelDelay: 2.6,
    panel: panel({ id: 'tin', title: E.tin.title, parts: ['tin'], blocks: lv => paras(E.tin.panel[depth(lv)]) }),
  })

  // the courtyard bowl, on the red bench
  let next = 'medium'
  let fizzIn = 0
  const bowl = courtyardBowl({
    light,
    on: {
      splash: () => play('tap'),
      flame: () => {
        say(at(E.bowl.says.flame, level()))
        play('pop')
      },
      bang: () => {
        say(at(E.bowl.says.bang, level()))
        play('bang')
      },
      pop: () => play('pop'),
      done: size => size === 'small' && say(at(E.bowl.says.small, level())),
    },
  })
  put(root, bowl, SPOTS.yard)
  const drop = size => {
    if (!bowl.drop(size)) {
      say(W.busy)
      return false
    }
    next = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length]
    return true
  }
  ex.add({
    id: 'bowl',
    x: SPOTS.yard.at.x,
    z: SPOTS.yard.at.z,
    radius: 1.8,
    label: () => E.bowl.label[next],
    verb: E.bowl.drop,
    act: () => (drop(next) ? null : false),
    panelDelay: 1.4,
    panel: panel({
      id: 'bowl',
      title: E.bowl.title,
      parts: ['bowl', 'bang'],
      extra: { bang: E.bowl.buttons.bang },
      blocks: lv => [
        ...paras(E.bowl.panel[depth(lv)]),
        {
          buttons: [
            ...SIZES.map(s => ({ label: E.bowl.buttons[s], onClick: () => drop(s) })),
            {
              label: E.bowl.buttons.indicator,
              onClick: () => {
                if (bowl.indicator()) say(at(E.bowl.says.pink, level()))
              },
            },
          ],
        },
        { p: W.never },
      ],
    }),
  })

  // the salt window, on the desk
  const win = saltWindow({ light })
  put(root, win, SPOTS.deskA, 1.7)
  ex.add({
    id: 'window',
    x: SPOTS.deskA.at.x,
    z: SPOTS.deskA.at.z,
    radius: 1.45,
    label: E.window.label,
    verb: () => (win.cracked ? E.window.again : E.window.crack),
    act: () => {
      if (win.act() !== 'crack') return null
      play('crack')
      return at(E.window.says, level())
    },
    panelDelay: 2.0,
    panel: panel({ id: 'window', title: E.window.title, parts: ['window'], blocks: lv => paras(E.window.panel[depth(lv)]) }),
  })

  // the salt lamp, on the side table
  const lamp = saltLamp({ light })
  put(root, lamp, SPOTS.side)
  ex.add({
    id: 'lamp',
    x: SPOTS.side.at.x,
    z: SPOTS.side.at.z,
    radius: 1.45,
    label: E.lamp.label,
    verb: () => (lamp.on ? E.lamp.off : E.lamp.on),
    act: () => {
      lamp.act()
      play('tap')
      return null
    },
    panelDelay: 0.6,
    panel: panel({ id: 'lamp', title: E.lamp.title, parts: ['lamp'], blocks: lv => paras(E.lamp.panel[depth(lv)]) }),
  })

  // the professor's card, on the desk
  const card = noteCard({ big: 'Na', small: 'Ena' })
  put(root, card, SPOTS.deskB)
  ex.add({
    id: 'note',
    x: SPOTS.deskB.at.x,
    z: SPOTS.deskB.at.z,
    radius: 1.35,
    label: E.note.label,
    verb: E.note.read,
    panel: panel({ id: 'note', title: E.note.title, parts: ['note'], blocks: lv => paras(E.note.panel[depth(lv)]) }),
  })

  return {
    parts: { tin, bowl, win, lamp, card },
    update(dt, t, camera, viewHeight) {
      tin.update(dt)
      bowl.update(dt, t, camera, viewHeight)
      win.update(dt, t)
      lamp.update(dt)
      // the hiss while a lump skates
      fizzIn -= dt
      if (bowl.busy && fizzIn <= 0) {
        play('fizz')
        fizzIn = 0.65
      }
    },
  }
}
