// The neon sign workshop (A oficina do néon): one wing shared by the noble gases, reached from the halls
// of helium, neon, argon, krypton, xenon and radon (/e/<Symbol>/signs). A brick workshop at night lit
// by its own tubes. West: the filling bench (fill five tubes bent as He, Ne, Ar, Kr, Xe and light them)
// and, at its end, radon's lead box. North: your name in neon across the wall, with the sign-maker's
// desk; in the corners the atom (why they glow, why they are noble) and the history board (1898, 1910,
// today). East: the spectroscope, every gas's lines (NIST) under the Sun's 1868 line that was helium.
// In the middle, five balloons to let go. The visitor's gas starts everything, and the arch leads back
// to its hall. Contract: docs/knowledge/adding-a-wing.md.
import { tagOf } from '../../../i18n/langs.js'
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { roomWalls, box, circle } from '../../../engine/collide.js'
import { atriumPath } from '../../registry.js'
import { SIGNS_WORDS } from './signs.words.js'
import { GASES, SIGN_GASES, glowOf, densityOf, AIR_DENSITY, BALLOON, LADDER, levelsEV } from './nobleData.js'
import { sanitizeName, tubeLength, layoutText } from './tubeFont.js'
import { neonSign } from './neonTube.js'
import { at, fill, num, exhibitSet, onLevel, fontsReady } from './kit.js'
import { workshopRoom, ROOM, DOOR } from './signs.room.js'
import { fillingBench, radonBox } from './signs.bench.js'
import { spectroscope, atomDisplay } from './signs.optics.js'
import { nameWall, historyBoard, balloonRack } from './signs.parts.js'
import { nameOverlay } from './nameOverlay.js'

// the name written on the wall, kept per room: a room starts with its own gas's name until a name is
// written there (one key for all six rooms showed NÉON in every room once it was lit in neon's)
const nameKey = sym => `ew-neon-name:${sym}`
const loadName = sym => {
  try {
    const v = JSON.parse(localStorage.getItem(nameKey(sym)) ?? 'null')
    return v && typeof v.text === 'string' && SIGN_GASES.includes(v.gas) ? { text: sanitizeName(v.text).trim(), gas: v.gas } : null
  } catch {
    return null
  }
}
const saveName = (sym, v) => {
  try {
    localStorage.setItem(nameKey(sym), JSON.stringify(v))
  } catch {
    // storage blocked: kept for this visit
  }
}

/** Puts a part on a wall or a spot: position, turn, and a function from its frame to the room's. */
function place(root, obj, x, z, rotY) {
  obj.position.set(x, 0, z)
  obj.rotation.y = rotY
  root.add(obj)
  const c = Math.cos(rotY)
  const s = Math.sin(rotY)
  return (lx, lz) => ({ x: x + lx * c + lz * s, z: z - lx * s + lz * c })
}

export async function build(ctx, target) {
  const sym = GASES.includes(target?.symbol) ? target.symbol : 'Ne'
  const el = element(sym)
  // the language's words, or English's where the wing has none yet
  const lang = SIGNS_WORDS[ctx.lang()] ? ctx.lang() : 'en'
  const W = SIGNS_WORDS[lang]
  const light = ctx.light
  const level = () => ctx.level()
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const gasName = s => nameOf(element(s), lang).toLocaleLowerCase(tagOf(lang))
  const GasName = s => nameOf(element(s), lang)
  const who = GasName(sym)
  const COLOR = glowOf(sym)
  const root = new THREE.Group()
  root.name = `wing-${sym}-signs`
  const updates = []
  const refreshers = []
  const timers = []
  const later = (s, fn) => timers.push({ at: s, fn })
  const here = () => ctx.engine.world?.root === root
  await fontsReady()

  // ---- the room ----
  // each gas's room is lit a little in its own colour (radon, which never goes into a sign, keeps
  // the workshop's warm light)
  const room = workshopRoom({ light, tint: sym === 'Rn' ? null : COLOR })
  root.add(room.group)
  updates.push((dt, t) => room.update(dt, t))
  const { mats } = room
  const { x0, x1, z0, z1, h } = ROOM
  const solids = roomWalls(x0, x1, z0, z1, [{ side: 's', at: 0, width: DOOR.width }], 1)
  // a shop sign by the door: open, in the room's own gas (neon's in radon's room)
  const open = neonSign({ text: W.open, cap: 0.3, radius: 0.012, light, color: glowOf(SIGN_GASES.includes(sym) ? sym : 'Ne'), postMat: mats.dark })
  open.setAll(1)
  open.group.position.set(-4.7, 2.75, z1)
  open.group.rotation.y = Math.PI
  root.add(open.group)

  // ---- the exhibits and their rules ----
  const ex = exhibitSet(ctx, { prefix: `${sym}:signs`, color: COLOR, who, busy: lv => at(W.busy, lv), later })
  const say = (text, c = COLOR) => {
    if (here() && text) ctx.store.set({ speech: { text, who, color: c } })
  }
  const panelOf = (title, blocks, color = COLOR) => ({ title, kicker: W.kicker, color, blocks })

  // the filling bench (west wall)
  const bench = fillingBench({ mats, words: W.bench, level, light, start: sym })
  const benchAt = place(root, bench.group, x0, -2.7, Math.PI / 2)
  updates.push((dt, t) => bench.update(dt, t))
  refreshers.push(() => bench.refresh())
  solids.push(box(x0 + 0.45, -2.7, 0.9, 4.75))
  bench.onLit = gas => {
    say(at(W.bench.says[gas], level()), glowOf(gas))
    if (bench.lit === SIGN_GASES.length) later(2.6, () => say(at(W.bench.says.all, level())))
  }
  const benchSpot = benchAt(0, 2.5)
  ex.add({
    id: 'bench',
    x: benchSpot.x,
    z: benchSpot.z,
    radius: 1.9,
    screens: [bench.screen],
    label: () => (bench.busy ? W.bench.labels.working : bench.next ? GasName(bench.next) : W.bench.labels.all),
    verb: () => (bench.busy ? W.bench.verbs.wait : bench.next ? W.bench.verbs.fill : W.bench.verbs.off),
    act: () => {
      const r = bench.act()
      if (r === 'off') return at(W.bench.says.off, level())
      return r ? null : false
    },
    panelDelay: 3.4,
    panel: lv => panelOf(W.bench.title, W.bench.panel[depth(lv)]),
  })

  // radon's lead box (the end of the bench)
  const rnHalf = element('Rn').isotopes.find(i => i.A === 222)?.halfLife ?? 3.8215 // days
  const half = num(rnHalf, 2, lang)
  const rnDensity = num(densityOf('Rn'), 2, lang)
  const radon = radonBox({ mats, words: W.radon, light, line: () => fill(at(W.radon.screen, level()), { half }) })
  const radonAt = place(root, radon.group, x0, -6.45, Math.PI / 2)
  updates.push(dt => radon.update(dt))
  refreshers.push(() => radon.refresh())
  solids.push(box(x0 + 0.42, -6.45, 0.84, 1.2))
  const radonSpot = radonAt(0, 1.95)
  ex.add({
    id: 'radon',
    x: radonSpot.x,
    z: radonSpot.z,
    radius: 1.45,
    screens: [radon.screen],
    label: W.radon.label,
    verb: W.radon.verb,
    act: () => (radon.measure() ? at(W.radon.says, level()) : false),
    panelDelay: 1.6,
    sayColor: () => glowOf('Rn'),
    panel: lv => {
      if (depth(lv) === 'kid') return panelOf(W.radon.title, W.radon.panel.kid, glowOf('Rn'))
      const R = W.radon.rows
      const V = W.radon.values
      return panelOf(W.radon.title, [
        { rows: [[R.isotope, V.isotope], [R.half, fill(V.half, { half })], [R.decay, V.decay], [R.density, fill(V.density, { density: rnDensity })]] },
        ...W.radon.panel.sci.map(b => ({ p: fill(b.p, { half: num(rnHalf, 1, lang) }) })),
      ], glowOf('Rn'))
    },
  })

  // the name on the north wall and the desk below it
  // the room's own gas's name, in its own light (radon's name in neon's)
  const saved = loadName(sym)
  const fallback = sanitizeName(GasName(sym))
  let current = saved?.text ? saved : { text: fallback, gas: SIGN_GASES.includes(sym) ? sym : 'Ne' }
  const wall = nameWall({ mats, words: W.name, light, text: current.text, color: glowOf(current.gas) })
  place(root, wall.group, 0, z0, 0)
  updates.push((dt, t) => wall.update(dt, t))
  refreshers.push(() => wall.refresh(at(W.name.screen, level())))
  solids.push(box(0, z0 + 2.05, 2.15, 1.15), circle(-2.1, z0 + 1.9, 0.35))
  let overlay = null
  const openOverlay = () => {
    ctx.store.set({ panel: null, speech: null, overlay: true })
    overlay ??= nameOverlay({
      parent: ctx.canvas.parentElement ?? document.body,
      words: W.name.overlay,
      gases: SIGN_GASES,
      glowOf,
      nameOf: GasName,
      onPreview: word => wall.preview(word),
      onClose: submitted => {
        ctx.store.set({ overlay: false })
        if (!submitted) wall.restore(current.text, glowOf(current.gas))
      },
      onSubmit: (word, gas) => {
        current = { text: word, gas }
        saveName(sym, current)
        wall.light(word, glowOf(gas))
        // the tube it took: its length in font units, at the scale the wall drew it
        const metres = num((tubeLength(word) * wall.sign.width) / Math.max(1e-6, layoutText(word).width), 1, lang)
        later(0.6 + word.length * 0.16, () => {
          const first = ex.discover('name', lv => panelOf(W.name.title, W.name.panel[depth(lv)], glowOf(gas)), 1.2)
          say(fill(at(W.name.says, level()), { word, gas: gasName(gas), metres }), glowOf(gas))
          if (first) ex.refreshPrompt(nameIt)
        })
      },
    })
    overlay.open({ text: current.text, gas: current.gas })
  }
  const nameIt = ex.add({
    id: 'name',
    x: 0,
    z: z0 + 3.55,
    radius: 1.7,
    screens: [wall.screen],
    label: W.name.label,
    verb: W.name.verb,
    manual: true,
    act: openOverlay,
  })

  // the atom (north-west corner, facing the room)
  const atom = atomDisplay({ mats, words: { ...W.atom, colours: W.colours }, level, light, lang, sym, nameOf: GasName })
  const atomAt = place(root, atom.group, -5.6, -10.3, Math.PI / 4)
  updates.push((dt, t) => atom.update(dt, t))
  refreshers.push(() => atom.refresh(at(W.atom.screen, level())))
  solids.push(circle(-5.6, -10.3, 0.75))
  const ladderPost = atomAt(...atom.ladderAt)
  solids.push(circle(ladderPost.x, ladderPost.z, 0.32))
  const atomSpot = atomAt(0.3, 3.1)
  ex.add({
    id: 'atom',
    x: atomSpot.x,
    z: atomSpot.z,
    radius: 1.8,
    screens: [atom.screen],
    label: () => fill(W.atom.label, { gas: gasName(sym) }),
    verb: W.atom.verb,
    act: () => {
      const l = atom.fire()
      if (!l) return false
      later(1.5, () => {
        say(atom.words(fill(at(W.atom.says, level()), { Gas: GasName(sym) })))
        atom.advance()
      })
      return null
    },
    panelDelay: 3.3,
    panel: lv => {
      if (depth(lv) === 'kid') return panelOf(W.atom.title, W.atom.panel.kid)
      const l = LADDER[sym][0]
      const ev = levelsEV(l)
      return panelOf(W.atom.title, [
        ...W.atom.panel.sci,
        { p: `${W.atom.ionTitle}:` },
        { rows: GASES.map(s => [GasName(s), `${num(element(s).ie[0], 2, lang)} eV`]) },
        { p: fill(W.atom.line, { Gas: GasName(sym), nm: num(l.nm, 1, lang), hi: num(ev.hi, 2, lang), lo: num(ev.lo, 2, lang), photon: num(ev.photon, 2, lang) }) },
      ])
    },
  })

  // the history board (north-east corner)
  const history = historyBoard({ mats, words: W.history, light })
  const historyAt = place(root, history.group, 5.6, -10.3, -Math.PI / 4)
  updates.push(dt => history.update(dt))
  refreshers.push(() => history.refresh(at(W.history.screen, level())))
  solids.push(box(5.6, -10.3, 2.8, 0.6, { rot: -Math.PI / 4 }))
  const historySpot = historyAt(0, 3.1)
  const yearOf = key => (key === 'today' ? W.history.today.toLocaleLowerCase(tagOf(lang)) : key)
  ex.add({
    id: 'history',
    x: historySpot.x,
    z: historySpot.z,
    radius: 1.8,
    screens: [history.screen],
    label: W.history.label,
    verb: () => (history.next ? fill(W.history.verbs.next, { year: yearOf(history.next) }) : W.history.verbs.off),
    act: () => {
      const r = history.act()
      if (!r) return false
      if (r === 'off') return at(W.history.off, level())
      if (r === 'today') later(2.2, () => say(at(W.history.all, level())))
      return at(W.history.steps[r], level())
    },
    panelDelay: 2.4,
    panel: lv => {
      if (depth(lv) === 'kid') return panelOf(W.history.title, W.history.panel.kid)
      const boil = s => num(element(s).boil, 2, lang)
      const [rows, boils, today] = W.history.panel.sci
      return panelOf(W.history.title, [rows, { p: fill(boils.p, { Ne: boil('Ne'), Ar: boil('Ar'), Kr: boil('Kr'), Xe: boil('Xe'), N: boil('N'), O: boil('O') }) }, today])
    },
  })

  // the spectroscope (east wall)
  const spec = spectroscope({ mats, words: W.spectrum, level, light, lang, gases: SIGN_GASES, start: SIGN_GASES.includes(sym) ? sym : 'He', nameOf: GasName })
  const specAt = place(root, spec.group, x1, -2.9, -Math.PI / 2)
  updates.push((dt, t) => spec.update(dt, t))
  refreshers.push(() => spec.refresh())
  solids.push(box(x1 - 1.2, -3.25, 0.8, 2.2))
  const specSpot = specAt(0.3, 2.9)
  ex.add({
    id: 'spectrum',
    x: specSpot.x,
    z: specSpot.z,
    radius: 1.8,
    screens: [spec.screen],
    label: W.spectrum.label,
    verb: () => fill(W.spectrum.verb, { gas: gasName(spec.next) }),
    act: () => {
      const g = spec.act()
      return at(W.spectrum.says[g], level())
    },
    sayColor: () => glowOf(spec.gas),
    panelDelay: 1.2,
    panel: lv => panelOf(W.spectrum.title, W.spectrum.panel[depth(lv)], '#9ad0ff'),
  })

  // the balloons (the middle of the room)
  const lift = s => (AIR_DENSITY - densityOf(s))
  const balloons = balloonRack({ mats, words: W.balloons, light, ceiling: h })
  place(root, balloons.group, 0, -3.6, 0)
  updates.push((dt, t) => balloons.update(dt, t))
  refreshers.push(() => balloons.refresh(at(W.balloons.screen, level())))
  solids.push(circle(0, -3.6, 0.66), circle(1.53, -4.05, 0.32))
  ex.add({
    id: 'balloons',
    x: 0,
    z: -2.0,
    radius: 1.5,
    screens: [balloons.screen],
    label: W.balloons.label,
    verb: () => (balloons.free ? W.balloons.verbs.back : W.balloons.verbs.go),
    act: () => {
      const r = balloons.act()
      if (!r) return false
      if (r === 'back') return at(W.balloons.back, level())
      return fill(at(W.balloons.says, level()), { He: num(lift('He'), 2, lang), Ne: num(lift('Ne'), 2, lang) })
    },
    panelDelay: 3.0,
    panel: lv => {
      if (depth(lv) === 'kid') return panelOf(W.balloons.title, W.balloons.panel.kid, '#7fd4ff')
      const rows = [...GASES.map(s => [GasName(s), densityOf(s)]), [W.balloons.air, AIR_DENSITY]]
        .sort((a, b) => a[1] - b[1])
        .map(([k, v]) => [k, `${num(v, v < 1 ? 3 : v < 9 ? 3 : 2, lang)} g/L`])
      const liftG = s => num(lift(s) * BALLOON.litres, 1, lang)
      return panelOf(W.balloons.title, [
        { p: `${W.balloons.densities} (${W.balloons.at}):` },
        { rows },
        ...W.balloons.panel.sci.map(b => ({ p: fill(b.p, { liftHe: liftG('He'), liftNe: liftG('Ne') }) })),
      ], '#7fd4ff')
    },
  })

  // ---- the arch back to the gas's hall, behind the spawn ----
  const back = arch({ width: 3.6, height: 4.4, color: COLOR, label: fill(W.back, { gas: gasName(sym) }), portal: 'swirl' })
  back.group.position.set(0, 0, z1 - 0.1)
  back.group.rotation.y = Math.PI
  root.add(back.group)
  updates.push((dt, t) => back.update(t))
  solids.push(box(0, z1 + 0.55, DOOR.width + 0.4, 0.6))
  const doors = [{ x: 0, z: z1 - 0.35, radius: 0.85, to: atriumPath(sym) }]
  // the glass-bender's table by the door
  solids.push(box(-5.3, 3.4, 0.86, 2.25))

  // ---- the gas's Atomling ----
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)

  // talking to it: the greeting, then hints and facts in turn
  let said = 0
  // each gas greets in its own words: its name, its colour, what it does
  const greet = () => at(sym === 'Rn' ? W.greetRadon : W.greetGas?.[sym] ?? W.greet, level())
  const talk = () => {
    const lines = [greet(), ...W.talk[depth(level())]]
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

  let unsub = null
  return {
    mode: 'walk',
    root,
    title: ctx.t(`wings.${sym}.signs.title`),
    env: {
      background: new THREE.Color('#06060b'),
      fog: new THREE.Fog('#06060b', 18, 40),
      exposure: 1.15,
      envIntensity: 0.16,
      bloom: { strength: 0.85, radius: 0.55, threshold: 1.0 },
      fov: 62,
    },
    spawn: { x: 0, z: z1 - 3.2, yaw: 0 },
    hostSpot: { x: 1.6, z: z1 - 4.4, yaw: Math.atan2(1.6, -1.2) },
    avatar,
    solids,
    cameraBounds: { minX: x0 + 0.35, maxX: x1 - 0.35, minY: 0.4, maxY: h - 0.45, minZ: z0 + 0.35, maxZ: z1 - 0.7 },
    cameraPitchMax: 0.5,
    interactables: [...ex.list, host],
    doors,
    talk,
    // for the probes in tools/ (__ew.world.parts.bench.lit and so on)
    parts: { bench, radon, wall, atom, history, spec, balloons },
    attach() {
      ex.report()
      refreshers.forEach(f => f())
      unsub = onLevel(ctx.store, () => refreshers.forEach(f => f()))
      later(0.9, () => say(greet()))
    },
    detach() {
      unsub?.()
      overlay?.dispose()
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
      ex.sync()
    },
    dispose() {
      timers.length = 0
      overlay?.dispose()
    },
  }
}
