// The neon sign workshop (A oficina do néon): one wing shared by the noble gases, reached from the halls
// of helium, neon, argon, krypton, xenon and radon (/e/<Symbol>/signs). A brick workshop at night lit
// by its own tubes. West: the filling bench (fill five tubes bent as He, Ne, Ar, Kr, Xe and light them)
// and, at its end, radon's lead box. North: your name in neon across the wall, with the sign-maker's
// desk; in the corners the atom (why they glow, why they are noble) and the history board (1898, 1910,
// today). East: the spectroscope, every gas's lines (NIST) under the Sun's 1868 line that was helium.
// In the middle, five balloons to let go. The visitor's gas starts everything, and the arch leads back
// to its hall. Every step is a tap on its thing, and E opens a station's panel whose buttons do the
// same ("the exhibits and their rules" below). Contract: docs/knowledge/adding-a-wing.md. In a room,
// everyone in the same workshop shares its things (the tubes, the word, the balloons...: `shared`
// below, src/net/shared.js); the panels, the Atomling's words and the discoveries stay each one's own.
import { tagOf } from '../../../i18n/langs.js'
import * as THREE from 'three'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { roomWalls, box, circle } from '../../../engine/collide.js'
import { atriumPath } from '../../registry.js'
import { SIGNS_WORDS } from './signs.words.js'
import { GASES, SIGN_GASES, glowOf, densityOf, AIR_DENSITY, BALLOON, LADDER, levelsEV, balloonOf } from './nobleData.js'
import { sanitizeName, tubeLength, layoutText } from './tubeFont.js'
import { neonSign } from './neonTube.js'
import { at, fill, num, exhibitSet, onLevel, fontsReady } from './kit.js'
import { workshopRoom, ROOM, DOOR } from './signs.room.js'
import { fillingBench, radonBox } from './signs.bench.js'
import { spectroscope, atomDisplay } from './signs.optics.js'
import { nameWall, historyBoard, balloonRack } from './signs.parts.js'
import { nameOverlay } from './nameOverlay.js'
import { tapTargets } from '../../common/taps.js'

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
  // a gas's name inside a sentence: lowercase, or as written where the language capitalises nouns (German)
  const gasName = s => (W.nameCase === 'keep' ? nameOf(element(s), lang) : nameOf(element(s), lang).toLocaleLowerCase(tagOf(lang)))
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
  // tell the others in the room's same workshop that this visitor changed something
  const share = id => ctx.share?.(id)
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
  // Each step is chosen by tapping the thing it is about (the user, 2026-10-30: pressing E again and again
  // through fixed steps felt passive): the pump, a gas's flask, the high-voltage box; the Geiger counter;
  // the word on the wall; the atom and the colours of its ladder; the board's signs; a tube in the
  // spectroscope's rack; a balloon or the table. The prompt names the next tap; E opens the station's
  // panel, whose buttons do the same steps (keyboards, probes). The first step of a station counts its
  // discovery and opens its panel a moment later, while the visitor is still there.
  const ex = exhibitSet(ctx, { prefix: `${sym}:signs`, color: COLOR, who, busy: lv => at(W.busy, lv), later })
  const say = (text, c = COLOR) => {
    if (here() && text) ctx.store.set({ speech: { text, who, color: c } })
  }
  const panelOf = (title, blocks, color = COLOR) => ({ title, kicker: W.kicker, color, blocks })
  const taps = tapTargets(ctx)
  const clickable = taps.clickable
  const me = () => ctx.engine.player.pos
  const near = (spot, r) => Math.hypot(me().x - spot.x, me().z - spot.z) < r
  /** A find counted; its panel opens `delay` seconds later, if the visitor is still at that station and
   *  reads nothing else. */
  const discover = (find, panel, delay, spot) => {
    const first = ex.discover(find)
    if (first && panel) later(delay, () => near(spot, 4) && !ctx.store.get().panel && ctx.showPanel(panel))
    return first
  }
  const busy = () => say(at(W.busy, level()))
  const isGas = s => SIGN_GASES.includes(s)

  // the filling bench (west wall)
  const B = W.bench
  const bench = fillingBench({ mats, words: B, level, light, start: sym })
  const benchAt = place(root, bench.group, x0, -2.7, Math.PI / 2)
  updates.push((dt, t) => bench.update(dt, t))
  refreshers.push(() => bench.refresh())
  solids.push(box(x0 + 0.45, -2.7, 0.9, 4.75))
  const benchSpot = benchAt(0, 2.5)
  const benchPanel = lv => panelOf(B.title, [
    {
      buttons: [
        { label: B.buttons.pump, onClick: () => benchStep('pump') },
        ...SIGN_GASES.map(s => ({ label: GasName(s), onClick: () => benchStep(s) })),
        { label: B.buttons.hv, onClick: () => benchStep('hv') },
      ],
    },
    ...B.panel[depth(lv)],
  ])
  bench.onLit = (gas, mine) => {
    // someone else's tube lights here too, without the words
    if (!mine) return
    say(at(B.says[gas], level()), glowOf(gas))
    discover('bench', benchPanel, 2.2, benchSpot)
    if (bench.lit === SIGN_GASES.length) later(2.6, () => say(at(B.says.all, level())))
  }
  /** A step at the bench: 'pump', 'hv', or a gas (its flask or its tube tapped). */
  function benchStep(what) {
    const lv = level()
    if (what === 'pump') {
      if (!bench.pump()) return busy()
      share('bench')
      return say(at(B.steps.pumped, lv))
    }
    if (what === 'hv') {
      const r = bench.power()
      if (!r) return busy()
      // a tube lighting speaks when it glows (onLit)
      if (r === 'lit') return share('bench')
      if (r === 'off') {
        share('bench')
        return say(at(B.says.off, lv))
      }
      return say(at(r === 'air' ? B.steps.noAir : B.steps.noGas, lv))
    }
    const r = bench.fill(what)
    if (!r) return busy()
    if (r === 'filled') {
      if (bench.busy) share('bench')
      return say(fill(at(B.steps.filled, lv), { gas: gasName(what), Gas: GasName(what) }), glowOf(what))
    }
    if (r === 'lit') return say(at(B.says[what], lv), glowOf(what))
    if (r === 'waiting') return say(fill(at(B.steps.waiting, lv), { gas: gasName(bench.line) }), glowOf(bench.line))
    return say(at(B.steps.needPump, lv))
  }
  clickable(bench.hits.pump, () => benchStep('pump'))
  clickable(bench.hits.hv, () => benchStep('hv'))
  SIGN_GASES.forEach((s, i) => {
    clickable(bench.hits.flasks[i], () => benchStep(s))
    clickable(bench.hits.tubes[i], () => benchStep(s))
  })
  ex.add({
    id: 'bench',
    x: benchSpot.x,
    z: benchSpot.z,
    radius: 1.9,
    screens: [bench.screen],
    manual: true,
    label: B.label,
    verb: () => {
      if (bench.busy) return B.hints.wait
      if (isGas(bench.line)) return B.hints.hv
      if (bench.line === 'empty') return B.hints.gas
      return bench.lit === SIGN_GASES.length ? B.hints.off : B.hints.pump
    },
    // across an upright phone the five tubes, the pump and the high-voltage box just fit
    focus: { ...benchAt(0, 0.35), y: 1.55, size: 3.0, width: 3.4 },
    act: () => ctx.showPanel(benchPanel),
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
  const radonPanel = lv => {
    const measureIt = { buttons: [{ label: W.radon.button, onClick: () => measure() }] }
    if (depth(lv) === 'kid') return panelOf(W.radon.title, [measureIt, ...W.radon.panel.kid], glowOf('Rn'))
    const R = W.radon.rows
    const V = W.radon.values
    return panelOf(W.radon.title, [
      measureIt,
      { rows: [[R.isotope, V.isotope], [R.half, fill(V.half, { half })], [R.decay, V.decay], [R.density, fill(V.density, { density: rnDensity })]] },
      ...W.radon.panel.sci.map(b => ({ p: fill(b.p, { half: num(rnHalf, 1, lang) }) })),
    ], glowOf('Rn'))
  }
  function measure() {
    if (!radon.measure()) return busy()
    share('radon')
    say(at(W.radon.says, level()), glowOf('Rn'))
    discover('radon', radonPanel, 1.6, radonSpot)
  }
  clickable(radon.hits.geiger, measure)
  clickable(radon.hits.cabinet, measure)
  ex.add({
    id: 'radon',
    x: radonSpot.x,
    z: radonSpot.z,
    radius: 1.45,
    screens: [radon.screen],
    manual: true,
    label: W.radon.label,
    verb: W.radon.verb,
    focus: { ...radonAt(0, 0.4), y: 1.55, size: 2.2 },
    act: () => ctx.showPanel(radonPanel),
  })

  // the name on the north wall and the desk below it: each gas's workshop starts with its own gas's
  // name, in its own light (radon's name in neon's), until a word is written there; the word written is
  // kept as the workshop's state (`shared` below: the player's own alone, the room's in a room; one key
  // for all six workshops once showed NÉON in every one). The word, the desk or its screen tapped (or E)
  // opens the little window to write a word.
  let current = { text: sanitizeName(GasName(sym)), gas: isGas(sym) ? sym : 'Ne' }
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
        wall.light(word, glowOf(gas))
        share('name')
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
  const writing = { when: () => !overlay?.isOpen, reach: 6 }
  clickable(wall.hits.word, openOverlay, writing)
  clickable(wall.hits.desk, openOverlay, writing)
  clickable(wall.hits.screen, openOverlay, writing)
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
  const A = W.atom
  const atom = atomDisplay({ mats, words: { ...A, colours: W.colours }, level, light, lang, sym, nameOf: GasName })
  const atomAt = place(root, atom.group, -5.6, -10.3, Math.PI / 4)
  updates.push((dt, t) => atom.update(dt, t))
  refreshers.push(() => atom.refresh(at(A.screen, level())))
  solids.push(circle(-5.6, -10.3, 0.75))
  const ladderPost = atomAt(...atom.ladderAt)
  solids.push(circle(ladderPost.x, ladderPost.z, 0.32))
  const atomSpot = atomAt(0.3, 3.1)
  const atomPanel = lv => {
    const shoot = {
      buttons: [
        { label: A.button, onClick: () => fireAtom() },
        ...LADDER[sym].map((l, k) => ({ label: `${num(l.nm, 1, lang)} nm`, onClick: () => pickLine(k) })),
      ],
    }
    if (depth(lv) === 'kid') return panelOf(A.title, [shoot, ...A.panel.kid])
    const l = LADDER[sym][atom.chosen]
    const ev = levelsEV(l)
    return panelOf(A.title, [
      shoot,
      ...A.panel.sci,
      { p: `${A.ionTitle}:` },
      { rows: GASES.map(s => [GasName(s), `${num(element(s).ie[0], 2, lang)} eV`]) },
      { p: fill(A.line, { Gas: GasName(sym), nm: num(l.nm, 1, lang), hi: num(ev.hi, 2, lang), lo: num(ev.lo, 2, lang), photon: num(ev.photon, 2, lang) }) },
    ])
  }
  /** An electron fired at the atom (the atom tapped): it gives the line chosen on the ladder. */
  function fireAtom() {
    if (!atom.fire()) return busy()
    share('atom')
    later(1.5, () => say(atom.words(fill(at(A.says, level()), { Gas: GasName(sym) }))))
    discover('atom', atomPanel, 3.3, atomSpot)
  }
  /** A colour tapped on the ladder: that line chosen, and an electron fired to give it. */
  function pickLine(k) {
    if (atom.busy) return busy()
    if (!atom.choose(k)) return
    fireAtom()
  }
  clickable(atom.hits.atom, fireAtom)
  clickable(atom.hits.plinth, fireAtom)
  clickable(atom.hits.ladder, hit => pickLine(atom.chipAt(hit)), { accept: hit => atom.chipAt(hit) >= 0 })
  ex.add({
    id: 'atom',
    x: atomSpot.x,
    z: atomSpot.z,
    radius: 1.8,
    screens: [atom.screen],
    manual: true,
    label: () => fill(A.label, { gas: gasName(sym) }),
    verb: () => (atom.shots ? A.hints.colour : A.hints.fire),
    focus: { ...atomAt(0.85, 0), y: 2.1, size: 2.7, width: 4.0 },
    act: () => ctx.showPanel(atomPanel),
  })

  // the history board (north-east corner): its three signs lit in the visitor's own order
  const H = W.history
  const history = historyBoard({ mats, words: H, light })
  const historyAt = place(root, history.group, 5.6, -10.3, -Math.PI / 4)
  updates.push(dt => history.update(dt))
  refreshers.push(() => history.refresh(at(H.screen, level())))
  solids.push(box(5.6, -10.3, 2.8, 0.6, { rot: -Math.PI / 4 }))
  const historySpot = historyAt(0, 3.1)
  const yearOf = key => (key === 'today' ? H.today : key)
  const historyPanel = lv => {
    const signs = {
      buttons: [
        ...history.rows.map(r => ({ label: yearOf(r.key), onClick: () => lightSign(r.key) })),
        { label: H.buttons.off, onClick: () => signsOff() },
      ],
    }
    if (depth(lv) === 'kid') return panelOf(H.title, [signs, ...H.panel.kid])
    const boil = s => num(element(s).boil, 2, lang)
    const [rows, boils, today] = H.panel.sci
    return panelOf(H.title, [signs, rows, { p: fill(boils.p, { Ne: boil('Ne'), Ar: boil('Ar'), Kr: boil('Kr'), Xe: boil('Xe'), N: boil('N'), O: boil('O') }) }, today])
  }
  /** A sign tapped: a dark one lights and tells its year; a lit one tells it again. */
  function lightSign(key) {
    const r = history.light(key)
    if (!r) return busy()
    say(at(H.steps[key], level()))
    if (r === 'again') return
    share('history')
    if (!history.next) later(5, () => say(at(H.all, level())))
    discover('history', historyPanel, 2.4, historySpot)
  }
  function signsOff() {
    if (!history.off()) return
    share('history')
    say(at(H.off, level()))
  }
  for (const { key, hit } of history.hits) clickable(hit, () => lightSign(key))
  ex.add({
    id: 'history',
    x: historySpot.x,
    z: historySpot.z,
    radius: 1.8,
    screens: [history.screen],
    manual: true,
    label: H.label,
    verb: () => (history.next ? fill(H.hints.next, { year: yearOf(history.next) }) : H.hints.all),
    focus: { ...historyAt(0, 0), y: 2.45, size: 3.7 },
    act: () => ctx.showPanel(historyPanel),
  })

  // the spectroscope (east wall): a tube tapped in its rack goes into the holder
  const S = W.spectrum
  const spec = spectroscope({ mats, words: S, level, light, lang, gases: SIGN_GASES, start: isGas(sym) ? sym : 'He', nameOf: GasName })
  const specAt = place(root, spec.group, x1, -2.9, -Math.PI / 2)
  updates.push((dt, t) => spec.update(dt, t))
  refreshers.push(() => spec.refresh())
  solids.push(box(x1 - 1.2, -3.25, 0.8, 2.2))
  const specSpot = specAt(0.3, 2.9)
  const specPanel = lv => panelOf(S.title, [{ buttons: SIGN_GASES.map(s => ({ label: GasName(s), onClick: () => pickTube(s) })) }, ...S.panel[depth(lv)]], '#9ad0ff')
  function pickTube(s) {
    const g = spec.pick(s)
    if (!g) return
    share('spectrum')
    say(at(S.says[g], level()), glowOf(g))
    discover('spectrum', specPanel, 1.2, specSpot)
  }
  for (const { sym: s, hit } of spec.rack) clickable(hit, () => pickTube(s), { when: () => spec.gas !== s })
  ex.add({
    id: 'spectrum',
    x: specSpot.x,
    z: specSpot.z,
    radius: 1.8,
    screens: [spec.screen],
    manual: true,
    label: S.label,
    verb: S.verb,
    focus: { ...specAt(-0.15, 0.75), y: 1.75, size: 2.6, width: 4.8 },
    act: () => ctx.showPanel(specPanel),
  })

  // the balloons (the middle of the room): one tapped goes (or comes back); the table, all at once
  const BL = W.balloons
  const lift = s => (AIR_DENSITY - densityOf(s))
  const balloons = balloonRack({ mats, words: BL, light, ceiling: h })
  place(root, balloons.group, 0, -3.6, 0)
  updates.push((dt, t) => balloons.update(dt, t))
  refreshers.push(() => balloons.refresh(at(BL.screen, level())))
  solids.push(circle(0, -3.6, 0.66), circle(1.53, -4.05, 0.32))
  const balloonsSpot = { x: 0, z: -2.0 }
  const balloonsPanel = lv => {
    const tries = {
      buttons: [
        ...SIGN_GASES.map(s => ({ label: GasName(s), onClick: () => balloonTap(s) })),
        { label: BL.buttons.all, onClick: () => balloonsAll('go') },
        { label: BL.buttons.back, onClick: () => balloonsAll('back') },
      ],
    }
    if (depth(lv) === 'kid') return panelOf(BL.title, [tries, ...BL.panel.kid], '#7fd4ff')
    const rows = [...GASES.map(s => [GasName(s), densityOf(s)]), [BL.air, AIR_DENSITY]]
      .sort((a, b) => a[1] - b[1])
      .map(([k, v]) => [k, `${num(v, v < 1 ? 3 : v < 9 ? 3 : 2, lang)} g/L`])
    const liftG = s => num(lift(s) * BALLOON.litres, 1, lang)
    return panelOf(BL.title, [
      tries,
      { p: `${BL.densities} (${BL.at}):` },
      { rows },
      ...BL.panel.sci.map(b => ({ p: fill(b.p, { liftHe: liftG('He'), liftNe: liftG('Ne') }) })),
    ], '#7fd4ff')
  }
  /** One balloon tapped: a tied one is let go and says how it flies; a flying one comes back. */
  function balloonTap(s) {
    const r = balloons.one(s)
    if (!r) return busy()
    share('balloons')
    if (r !== 'go') return
    const speed = num(Math.abs(balloonOf(s).terminal), 1, lang)
    say(fill(at(BL.one[s], level()), { rho: num(densityOf(s), 3, lang), air: num(AIR_DENSITY, 3, lang), speed }), glowOf(s))
    discover('balloons', balloonsPanel, 3.0, balloonsSpot)
  }
  /** All five at once: 'go' lets every tied one go, 'back' ties every flying one; the table toggles. */
  function balloonsAll(want = balloons.free ? 'back' : 'go') {
    const r = want === 'back' ? balloons.tie() : balloons.all()
    if (!r) return
    share('balloons')
    if (r === 'back') return say(at(BL.back, level()))
    say(fill(at(BL.says, level()), { He: num(lift('He'), 2, lang), Ne: num(lift('Ne'), 2, lang) }))
    discover('balloons', balloonsPanel, 3.0, balloonsSpot)
  }
  for (const { sym: s, hit } of balloons.hits.balloons) clickable(hit, () => balloonTap(s), { reach: 6 })
  clickable(balloons.hits.table, () => balloonsAll())
  ex.add({
    id: 'balloons',
    x: balloonsSpot.x,
    z: balloonsSpot.z,
    radius: 1.5,
    screens: [balloons.screen],
    manual: true,
    label: BL.label,
    verb: () => (balloons.allFree ? BL.hints.back : BL.hints.go),
    // the whole height of the room, to see them fly up to the ceiling or fall to the floor; at eye height,
    // so that backing off to fit it keeps the eye up (a focus above the eye drew it down to the floor)
    focus: { x: 0, y: 1.5, z: -3.6, size: 6.0, width: 3.4 },
    act: () => ctx.showPanel(balloonsPanel),
  })

  /** What a tap does, for the probes (shot.py cannot move the mouse): tap(id) does the step the prompt
   *  names next; tap(id, what) taps a given thing (a gas's flask, 'pump', 'hv'; a line's number; a
   *  sign's key or 'off'; a gas's tube in the rack; a gas's balloon). */
  const tapStep = (id, what) => {
    if (id === 'bench') {
      if (what) return benchStep(what)
      const l = bench.line
      return benchStep(isGas(l) ? 'hv' : l === 'empty' ? (bench.next ?? 'hv') : bench.next ? 'pump' : 'hv')
    }
    if (id === 'radon') return measure()
    if (id === 'name') return openOverlay()
    if (id === 'atom') return what == null ? fireAtom() : pickLine(Number(what))
    if (id === 'history') return what === 'off' ? signsOff() : what ? lightSign(what) : history.next ? lightSign(history.next) : signsOff()
    if (id === 'spectrum') return pickTube(what ?? spec.next)
    if (id === 'balloons') return what ? balloonTap(what) : balloonsAll()
    return undefined
  }
  const worldAt = o => o.getWorldPosition(new THREE.Vector3())
  const thingAt = {
    pump: () => worldAt(bench.hits.pump),
    hv: () => worldAt(bench.hits.hv),
    flask: s => worldAt(bench.hits.flasks[SIGN_GASES.indexOf(s)]),
    tube: s => worldAt(bench.hits.tubes[SIGN_GASES.indexOf(s)]),
    geiger: () => worldAt(radon.hits.geiger),
    word: () => worldAt(wall.hits.word),
    desk: () => worldAt(wall.hits.desk).setY(1.0),
    atom: () => worldAt(atom.hits.atom),
    chip: k => atom.chipPoint(k),
    sign: key => worldAt(history.hits.find(x => x.key === key).hit),
    rack: s => worldAt(spec.rack.find(x => x.sym === s).hit),
    balloon: s => worldAt(balloons.hits.balloons.find(x => x.sym === s).hit),
    table: () => worldAt(balloons.hits.table).setY(0.7),
  }

  // ---- the arch back to the gas's hall, behind the spawn ----
  // (inside a sentence the name is lowercase where the language says so; after a colon it is a label and
  // keeps its capital: "Powrót do sali: Neon")
  const backName = /:\s*\{gas\}$/.test(W.back) ? GasName(sym) : gasName(sym)
  const back = arch({ width: 3.6, height: 4.4, color: COLOR, label: fill(W.back, { gas: backName }), portal: 'swirl' })
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

  // ---- the workshop's state: the player's own alone, the room's in a room (src/net/shared.js) ----
  // set(state, live, ago): live, someone has just done it (it plays here); else as it stands, taken ago
  // seconds before
  const shared = {
    bench: { get: () => bench.state(), set: (s, live) => bench.setState(s, live) },
    radon: { get: () => radon.state(), set: (s, live) => radon.setState(s, live) },
    // the word on the wall (a room's word is the room's, mine stays mine); while I type, the wall keeps
    // my preview and shows the other's word when the window closes
    name: {
      get: () => ({ text: current.text, gas: current.gas }),
      set: (s, live) => {
        const text = sanitizeName(s.text ?? '').trim()
        const gas = SIGN_GASES.includes(s.gas) ? s.gas : current.gas
        if (!text || (text === current.text && gas === current.gas)) return
        current = { text, gas }
        if (overlay?.isOpen) return
        if (live) wall.light(text, glowOf(gas))
        else wall.restore(text, glowOf(gas))
      },
    },
    atom: { get: () => atom.state(), set: (s, live) => atom.setState(s, live) },
    history: { get: () => history.state(), set: (s, live) => history.setState(s, live) },
    spectrum: { get: () => spec.state(), set: (s, live) => spec.setState(s, live) },
    // each balloon's flight runs on by the time gone by (ago)
    balloons: { get: () => balloons.state(), set: (s, live, ago) => balloons.setState(s, live, ago) },
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
    shared,
    // things worked by hand (common/taps.js): the hand over what can be tapped, a tap does its step
    pointAt: taps.pointAt,
    onTap: taps.onTap,
    // for the probes in tools/ (__ew.world.parts.bench.lit, parts.tap('bench', 'pump'), and so on): the
    // pieces, what a tap does, where the things to tap stand, a ray to one as a tap would cast it
    parts: {
      bench,
      radon,
      wall,
      atom,
      history,
      spec,
      balloons,
      tap: tapStep,
      at: thingAt,
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    // the stations' panels (E opens them), for the probes: __ew.showPanel(__ew.world.panels.bench)
    panels: { bench: benchPanel, radon: radonPanel, atom: atomPanel, history: historyPanel, spectrum: specPanel, balloons: balloonsPanel },
    refresh: () => ex.refresh(),
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
