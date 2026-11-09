// The Atom Forge's electrons as clouds (the ☁ view; the user's Sooner, 2026-11-09: "in the Atom Forge, each
// electron you add settles into its cloud in the filling order, and the rule breakers move one over"). The
// room inside the atom draws the clouds (src/worlds/atom/cloud.js, views.js); here they sit round the
// forge's atom: the whole atom's subshells from its configuration (an ion's too, src/chem/orbitals.js
// ionOf) as thin bubbles on the forge's rings (views.js ringedAtomView: the forge's nucleus is drawn far too
// big for true sizes; the room inside the atom has them), and each new electron's subshell lit for a moment,
// its orbitals with electrons bright, the free ones faint. The forge calls sync(Z, E, radii) after every
// change and render() before each frame is drawn; report() is what the HUD shows (cloudWords.js words it).
import * as THREE from 'three'
import { electronCloud } from '../atom/cloud.js'
import { orbitalView, ringedAtomView, ringRadius, photoOf, toRoom, BLOCK, YAW } from '../atom/views.js'
import { ionOf, finder, random } from '../../chem/orbitals.js'
import { element } from '../../data/elements.js'

const FOCUS_S = 2.6 // a new electron's cloud is lit this long, then the whole atom comes back
const UP = new THREE.Vector3(0, 1, 0)

export function forgeClouds(ctx, { center }) {
  const cloud = electronCloud({ renderer: ctx.renderer, camera: ctx.camera, light: ctx.light, radius: 9, center, yaw: YAW, outside: true })
  const infos = new Map()
  const infoOf = (Z, E) => {
    const k = `${Z}:${E}`
    if (!infos.has(k)) infos.set(k, ionOf(element(Z), E))
    return infos.get(k)
  }
  let on = true
  let info = null
  let Zc = 0
  let Ec = 0
  let radii = [1]
  const tables = new Map() // `${Z}:${E}:${radii}` -> the whole atom's view (its table a texture: kept few)
  let atomShown = null
  let lit = null // { sub, m } shown instead of the whole atom: a new electron's subshell, or the player's pick
  let litUntil = Infinity // a new electron's light goes out by itself; a pick stays
  let change = null // the last change: { kind: 'add' | 'remove', id, first, pairs, before }
  let landing = null // where the newest electron lands (atom-local metres)
  let now = 0
  const moteSeries = (Math.random() * 2 ** 31) >>> 0

  const subOf = id => info?.subs.find(s => s.id === id)
  // a subshell lit: its skin (where its electrons are nine times in ten) reaching a quarter past its bubble,
  // so the clouds keep their order: 1s small round the nucleus, the outer ones big
  const viewOf = sel => {
    const sub = subOf(sel.sub)
    if (!sub) return atomShown
    return orbitalView(sub, sel.m, { reach: ringRadius(sub, radii) * 1.25 })
  }
  const wholeOf = (Z, E) => {
    const k = `${Z}:${E}:${radii.join(',')}`
    if (!tables.has(k)) {
      if (tables.size >= 24) {
        const [old, v] = tables.entries().next().value
        if (v !== atomShown) {
          v.table.dispose()
          tables.delete(old)
        }
      }
      tables.set(k, ringedAtomView(info, radii))
    }
    return tables.get(k)
  }
  // the sparks: for a subshell lit, where its electron might be (Born's rule, as in the room); for the whole
  // atom, each subshell's own spread drawn round its bubble (its distance from the nucleus squeezed toward the
  // bubble, as the bubbles are)
  const motesFor = v => {
    if (v.mode === 1) {
      cloud.setMotes(i => {
        const ph = photoOf(v, info, moteSeries, i)
        return { p: ph.p, color: ph.color.multiplyScalar(0.55) }
      }, v.scale, 1)
      return
    }
    const rand = random(moteSeries)
    const subs = info.subs
    const total = subs.reduce((a, s) => a + s.count, 0)
    const finders = new Map()
    cloud.setMotes(() => {
      let u = rand() * total
      const sub = subs.find(s => (u -= s.count) <= 0) ?? subs[subs.length - 1]
      if (!finders.has(sub.id)) finders.set(sub.id, finder(sub.orbitals.find(o => o.electrons) ?? sub.orbitals[0], sub.zh, rand))
      const [x, y, z] = finders.get(sub.id)()
      const r = Math.hypot(x, y, z) || 1e-6
      const k = (ringRadius(sub, radii) * Math.pow(r / sub.peak, 0.3)) / r
      return { p: toRoom(x * k, y * k, z * k), color: new THREE.Color(BLOCK[sub.l]).multiplyScalar(0.7) }
    }, 1, 0.8)
  }
  const showNow = (instant = false) => {
    if (!info) return
    const v = lit ? viewOf(lit) : atomShown
    cloud.show(v, { instant })
    motesFor(v)
  }

  /** What changed from the last configuration to this one, one electron at a time. */
  const diff = (before, after, Z, E) => {
    if (!before || !after) return null
    const was = Object.fromEntries(before.subs.map(s => [s.id, s.count]))
    const is = Object.fromEntries(after.subs.map(s => [s.id, s.count]))
    if (E === Ec + 1) {
      const id = Object.keys(is).find(k => is[k] > (was[k] ?? 0))
      if (!id) return null
      const sub = after.subs.find(s => s.id === id)
      const k = sub.boxes.length
      // an ion filling d (or f) while the neutral atom's outer s is still empty: 3d before 4s
      let before = null
      if (E < Z && (sub.l === 'd' || sub.l === 'f')) {
        const outerS = `${sub.n + (sub.l === 'd' ? 1 : 2)}s`
        const neutral = infoOf(Z, Z)
        if (neutral.subs.some(s => s.id === outerS) && !is[outerS]) before = { inner: id, outer: outerS }
      }
      return { kind: 'add', id, first: !was[id], pairs: sub.l !== 's' && is[id] === k + 1, before }
    }
    if (E === Ec - 1) {
      const id = Object.keys(was).find(k => (is[k] ?? 0) < was[k])
      return id ? { kind: 'remove', id } : null
    }
    return null
  }

  return {
    group: cloud.group,
    get on() {
      return on
    },
    /** The view on or off (the forge's ☁ / ◎ button). */
    setOn(v) {
      on = !!v
      cloud.group.visible = on && !!info
      if (on) showNow(true)
    },
    /** After any change to the atom: its electrons' clouds, and the newest one's lit. `rings` are the
     *  forge's rings' radii (metres, the first shell first): each subshell's bubble goes on its own. */
    sync(Z, E, rings) {
      const next = Z >= 1 && E >= 1 ? infoOf(Z, E) : null
      const sameAtom = Z === Zc
      change = sameAtom ? diff(info, next, Z, E) : null
      if (rings.length) radii = rings
      info = next
      Zc = Z
      Ec = E
      landing = null
      cloud.group.visible = on && !!info
      if (!info) {
        lit = null
        change = null
        return
      }
      atomShown = wholeOf(Z, E)
      if (change?.kind === 'add') {
        lit = { sub: change.id, m: null }
        litUntil = now + FOCUS_S
        // where it lands: a place its cloud holds, drawn by Born's rule like the room's photos
        const v = viewOf(lit)
        const ph = photoOf(v, info, moteSeries + E, 0)
        landing = ph.p.applyAxisAngle(UP, YAW).multiplyScalar(v.scale)
      } else if (lit && !subOf(lit.sub)) lit = null
      else if (litUntil !== Infinity) lit = null
      if (on) showNow()
    },
    /** The HUD's map: a subshell ({ sub, m }) shown until another pick, or 'all' for the whole atom. */
    pick(sel) {
      if (!info) return
      lit = sel && sel.sub !== 'all' && subOf(sel.sub) ? { sub: sel.sub, m: sel.m ?? null } : null
      litUntil = Infinity
      if (on) showNow()
    },
    /** Where the newest electron lands, atom-local (null: no landing to show). */
    landing: () => landing,
    report() {
      if (!info) return { on, e: 0 }
      return {
        on,
        z: info.z,
        e: info.e,
        shells: info.shells,
        unpaired: info.unpaired,
        exception: info.exception,
        predicted: info.predicted,
        change,
        sel: lit ?? { sub: 'all', m: null },
        subs: info.subs.map(s => ({ id: s.id, n: s.n, l: s.l, count: s.count, boxes: s.boxes, zeff: s.zeff, names: s.orbitals.map(o => o.sub) })),
      }
    },
    /** Each frame: a new electron's light goes out after a while (returns true when the HUD should know). */
    update(dt, t) {
      now = t
      cloud.update(dt, t)
      if (lit && now > litUntil) {
        lit = null
        litUntil = Infinity
        if (on) showNow()
        return true
      }
      return false
    },
    render() {
      if (on && info) cloud.render()
    },
    warm: () => cloud.warm(),
    dispose() {
      cloud.dispose()
      for (const v of tables.values()) v.table.dispose()
      tables.clear()
    },
  }
}
