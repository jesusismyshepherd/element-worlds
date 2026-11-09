// The Alloy Forge: a bench of the Molecule Lab (/lab/alloys; registry.js BENCHES, docs/knowledge/alloys.md).
// The lab says two metals do not hold hands, because in a metal the electrons wander among all the atoms;
// this bench keeps that promise. A smithy at the lab under the stars: the metals' Atomlings stand round the
// table, each holding a lump of its metal; tap one and it throws the lump into the crucible (hold it to
// throw more). The crucible's card (AlloysHud.jsx) shows the mix by mass (and by atoms for the Scientist)
// and names it when it falls in a real alloy's range. Tap the crucible: it lifts out of the fire, pours, and
// an ingot of the alloy glows on the anvil (a celebration and a discovery the first time). Over the bench,
// inside the metal: the ingot's atoms to scale in a sea of electrons. Tap the hammer: in a pure metal the
// rows slip one place (the metal bends, the ingot dents deep and spreads), in an alloy the misfit atoms jam
// them (a shallow dent), and cast iron cracks.
// Shared in a room (net/shared.js): the crucible (its mix, and each lump thrown, a count) and the ingot (its
// mix, which pour it is, how many strikes): everyone sees each throw, pour and strike.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { element } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { makeText } from '../../../engine/text.js'
import { nightSky } from '../../common/sky.js'
import { skyVerse } from '../../common/verse.js'
import { markFound, isFound, countFound } from '../../../engine/progress.js'
import { play } from '../../../audio/sound.js'
import { room } from '../../../net/room.js'
import { track } from '../../../net/telemetry.js'
import {
  PALETTE, LOOK, cleanMix, identify, propertiesOf, lookOf, pourable, roomFor, lumpsIn, gramsOf, slabOf, strikeOf,
  shiftsAfter, mixSeed, dentOf, rng, BOOK, ALLOY, MAX_LUMPS,
} from './mix.js'
import { buildSmithy } from './smithy.js'
import { buildSlab } from './slab.js'
import { words, pct } from './words.js'

const HERE = '/lab/alloys'
const KEYS = [...BOOK.map(id => `bench:alloys:${id}`), 'bench:alloys:strike', 'bench:alloys:crack']
const FIRST = { mix: { Cu: 1 }, cast: 0, strikes: 0 } // the ingot on the anvil as the bench is built: pure copper
const SLAB_AT = new THREE.Vector3(0, 2.5, -1.15)
const ARC = { r: 3.15, from: -1.02, to: 1.02, scale: 0.42 }

const sameMix = (a, b) => PALETTE.every(el => (a[el] ?? 0) === (b[el] ?? 0))
const whole = (v, max = 1e6) => (Number.isFinite(v) ? Math.max(0, Math.min(max, Math.floor(v))) : 0)

export async function build(ctx) {
  const { camera, canvas, store, light } = ctx
  const lang = ctx.lang()
  const W = words(lang)
  const root = new THREE.Group()
  root.name = 'bench-alloys'

  // ---- the place: the lab's night, its round table of light ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
  // the passage in the empty sky over the furnace, clear of the case and the crucible's card (on a screen
  // too narrow for it there, over the case)
  const VERSE_WIDE = new THREE.Vector3(-5.6, 5.0, -8.5)
  const VERSE_NARROW = new THREE.Vector3(0, 6.5, -1.6)
  const verse = skyVerse(ctx, 'alloys', { at: VERSE_WIDE.toArray(), width: 5.2, size: 0.27, opacity: 0.75 })
  root.add(verse.group)
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#0e1430', roughness: 0.5, metalness: 0.3 }))
  floor.rotation.x = -Math.PI / 2
  root.add(floor)
  const table = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.5, 64), new THREE.MeshStandardMaterial({ color: '#18204a', roughness: 0.35, metalness: 0.5 }))
  table.position.y = 0.25
  root.add(table)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.06, 8, 96), new THREE.MeshStandardMaterial({ color: '#7fd4ff', emissive: '#7fd4ff', emissiveIntensity: 1.4 }))
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.5
  root.add(rim)
  const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshBasicMaterial({ color: '#2b4a9c', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }))
  glowDisc.rotation.x = -Math.PI / 2
  glowDisc.position.y = 0.51
  root.add(glowDisc)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 1.1))
  const key = new THREE.DirectionalLight('#fff4e6', 1.4)
  key.position.set(4, 9, 6)
  root.add(key)

  // ---- the smithy and the case over it ----
  const smithy = buildSmithy({ light })
  root.add(smithy.group)
  const slabView = buildSlab({ light, words: { inside: W.ui.inside, slip: W.ui.slip, sea: W.ui.sea }, level: () => ctx.level() })
  slabView.group.position.copy(SLAB_AT)
  root.add(slabView.group)

  // ---- the metals' Atomlings round the front of the table, each with a lump of its metal ----
  const lumpGeo = new THREE.DodecahedronGeometry(0.075, 0)
  const lumpMats = Object.fromEntries(PALETTE.map(el => [el, new THREE.MeshStandardMaterial({ color: LOOK[el], metalness: el === 'C' ? 0.05 : 1, roughness: el === 'C' ? 0.85 : 0.3, emissive: '#000000' })]))
  const crew = PALETTE.map((el, i) => {
    const a = createAtomling(element(el), { light, hoop: false })
    const holder = new THREE.Group()
    const ang = ARC.from + ((ARC.to - ARC.from) * i) / (PALETTE.length - 1)
    holder.position.set(Math.sin(ang) * ARC.r, 0.5, Math.cos(ang) * ARC.r)
    holder.scale.setScalar(ARC.scale)
    holder.add(a.root)
    root.add(holder)
    const lump = new THREE.Mesh(lumpGeo, lumpMats[el])
    lump.scale.setScalar(el === 'C' ? 0.7 : 1)
    root.add(lump)
    const label = makeText(nameOfEl(el), { size: 0.1, color: '#dfe8ff', font: 'body', outlineWidth: 0.006, outlineColor: '#0b0f24' })
    label.rotation.x = -Math.PI / 2.6
    label.position.set(Math.sin(ang) * (ARC.r + 0.36), 0.53, Math.cos(ang) * (ARC.r + 0.36))
    label.rotation.order = 'YXZ'
    label.rotation.y = ang
    root.add(label)
    return { el, a, holder, lump, label, ang, back: 0 }
  })
  function nameOfEl(el) {
    const n = element(el).name[lang] ?? element(el).name.en
    return n
  }

  // ---- state ----
  let crucible = { mix: {}, drops: 0, last: null }
  let ingot = { ...FIRST }
  let ingotInfo = identify(ingot.mix)
  let slab = slabOf(ingot.mix, { seed: mixSeed(ingot.mix, ingot.cast) })
  let shifts = new Array(slab.rows).fill(0)
  let cracked = null
  let lastStrike = null // { kind, plane, dir, by, misfit } as the HUD tells it
  let note = null
  let clock = 0
  const flights = [] // lumps in the air: { mesh, from, to, t, el }
  const timers = [] // { at, fn }
  const later = (s, fn) => timers.push({ at: clock + s, fn })

  const peers = () => (room.active ? room.members.filter(m => m.path === HERE) : [])
  const legendOf = s => {
    const counts = {}
    for (const x of s.sites) counts[x.el] = (counts[x.el] ?? 0) + 1
    const named = el => ({ el, name: lang === 'de' ? nameOfEl(el) : nameOfEl(el).toLowerCase() })
    const list = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([el]) => named(el))
    if (s.gaps.length) list.push(named('C'))
    return list
  }

  // ---- what the HUD shows ----
  const report = () => {
    const info = identify(crucible.mix)
    const props = propertiesOf(ingotInfo)
    const found = countFound(KEYS)
    store.set({
      discoveries: { found, total: KEYS.length },
      alloys: {
        crucible: { mix: crucible.mix, info, look: lookOf(info), lumps: lumpsIn(crucible.mix), grams: gramsOf(crucible.mix), full: lumpsIn(crucible.mix) >= MAX_LUMPS },
        ingot: { mix: ingot.mix, info: ingotInfo, look: lookOf(ingotInfo), hard: props.hard, melt: props.melt, strikes: ingot.strikes, cracked: !!cracked, last: lastStrike },
        book: BOOK.map(id => ({ id, done: isFound(`bench:alloys:${id}`) })),
        together: peers().filter(m => m.id !== room.me?.id).map(m => ({ name: m.name, color: m.color })),
        pouring: smithy.pouring(),
        note,
      },
    })
  }
  const party = p => store.set({ alloysParty: { ...p, at: performance.now() } })

  // ---- the crucible ----
  const showCrucible = () => {
    const info = identify(crucible.mix)
    const fill = Math.min(1, lumpsIn(crucible.mix) / MAX_LUMPS) * 0.85 + (lumpsIn(crucible.mix) ? 0.15 : 0)
    smithy.setMelt(lookOf(info.kind === 'carbon' ? { kind: 'empty' } : info), info.kind === 'carbon' ? 0 : fill, { carbon: info.floating ?? 0, alone: info.kind === 'carbon' })
  }

  /** A lump flies from its Atomling into the crucible; it lands with a splash. */
  const fly = el => {
    const c = crew.find(x => x.el === el)
    if (!c) return
    const mesh = new THREE.Mesh(lumpGeo, lumpMats[el])
    mesh.scale.copy(c.lump.scale)
    root.add(mesh)
    flights.push({ mesh, from: c.lump.position.clone(), t: 0, el })
    c.a.hop()
    c.back = 0.35
    c.lump.visible = false
    play('tap')
  }

  /** A whole mix thrown in, lump after lump (at most eight of each: the rest are there at once). */
  const flyAll = mix => {
    const order = Object.entries(mix).flatMap(([el, n]) => new Array(Math.min(n, 8)).fill(el))
    order.forEach((el, k) => later(k * 0.11, () => fly(el)))
  }

  /** Throw a lump of `el` in (mine: this player's tap). */
  const drop = el => {
    if (!PALETTE.includes(el)) return false
    note = null
    if (!roomFor(crucible.mix, el)) {
      note = 'full'
      report()
      return false
    }
    crucible = { mix: { ...crucible.mix, [el]: (crucible.mix[el] ?? 0) + 1 }, drops: crucible.drops + 1, last: el }
    fly(el)
    showCrucible()
    ctx.share('crucible')
    track('bench', { id: 'alloys', op: 'drop', el, together: peers().length > 1 || undefined })
    report()
    return true
  }

  const empty = () => {
    if (!Object.keys(crucible.mix).length) return
    crucible = { mix: {}, drops: crucible.drops, last: null }
    note = null
    smithy.splash(0.4)
    play('part')
    showCrucible()
    ctx.share('crucible')
    track('bench', { id: 'alloys', op: 'empty' })
    report()
  }

  /** Fill the crucible with an alloy's recipe (the book's "fill"), its lumps thrown one after another. */
  const recipe = id => {
    const a = ALLOY[id]
    if (!a) return
    crucible = { mix: { ...a.recipe }, drops: crucible.drops + 1, last: null }
    note = null
    flyAll(a.recipe)
    showCrucible()
    ctx.share('crucible')
    track('bench', { id: 'alloys', op: 'recipe', alloy: id })
    report()
  }

  // ---- the ingot: cast, rebuilt as it stands, struck ----
  /** The ingot as it stands: its slab, the rows' shifts and the crack after its strikes, the dents. */
  const rebuild = ({ hotNow = 0 } = {}) => {
    ingotInfo = identify(ingot.mix)
    slab = slabOf(ingot.mix, { seed: mixSeed(ingot.mix, ingot.cast) })
    const after = shiftsAfter(slab, ingot.strikes)
    shifts = after.shifts
    cracked = after.cracked
    slabView.show(slab, { shifts, cracked, names: legendOf(slab) })
    // the dents and the flattening, struck again without a sound
    smithy.resetIngot(lookOf(ingotInfo), { hotNow })
    const hv = propertiesOf(ingotInfo).hard?.v ?? null
    const replay = new Array(slab.rows).fill(0)
    for (let k = 1; k <= ingot.strikes; k++) {
      const s = strikeOf(slab, k, replay)
      if (s.kind === 'crack') {
        smithy.crack(false)
        break
      }
      dentAt(k, hv)
      if (s.kind === 'slip') {
        for (let r = s.plane; r < slab.rows; r++) replay[r] += s.dir
        smithy.flatten(0.965)
      }
    }
  }
  const dentAt = (k, hv) => {
    const r = rng((slab.seed ^ Math.imul(k, 0x85ebca6b)) >>> 0)
    smithy.dent((r() - 0.5) * 0.34, (r() - 0.5) * 0.08, dentOf(hv))
  }

  /** Pour the crucible into a new ingot (mine: this player's tap; then the celebration is mine). */
  const pour = () => {
    note = null
    const info = identify(crucible.mix)
    if (!pourable(info)) {
      note = info.kind === 'carbon' ? 'carbonAlone' : 'nothing'
      play('wrong')
      report()
      return false
    }
    if (smithy.pouring()) return false
    const mix = { ...info.melt }
    ingot = { mix, cast: ingot.cast + 1, strikes: 0 }
    crucible = { mix: {}, drops: crucible.drops, last: null }
    ctx.share('crucible')
    ctx.share('ingot')
    track('bench', { id: 'alloys', op: 'pour', alloy: info.id ?? info.kind, together: peers().length > 1 || undefined })
    cast({ animate: true, mine: true })
    return true
  }
  /** Show the new ingot: poured (the crucible flies, the stream, the glow) or at once. */
  const cast = ({ animate, mine = false, ago = 0 }) => {
    lastStrike = null
    const look = lookOf(identify(ingot.mix))
    if (!animate) {
      rebuild({ hotNow: Math.max(0, 1 - ago / 6) })
      showCrucible()
      report()
      return
    }
    play('pour')
    showCrucible()
    smithy.pour(look, {
      onCast: () => {
        rebuild({ hotNow: 1 })
        play('sizzle')
        const info = ingotInfo
        if (mine && info.kind === 'alloy' && markFound(`bench:alloys:${info.id}`)) {
          play('celebrate')
          party({ kind: 'made', info })
          track('bench', { id: 'alloys', op: 'made', alloy: info.id })
        }
        report()
      },
      onDone: () => report(),
    })
    report()
  }

  /** The atoms that pinned a jam on `plane`, and the element to blame. */
  const pinnedOn = plane => {
    const sites = []
    const gaps = []
    const tally = {}
    slab.sites.forEach((s, i) => {
      if ((s.row === plane - 1 || s.row === plane) && s.el !== slab.host) {
        sites.push(i)
        tally[s.el] = (tally[s.el] ?? 0) + Math.abs(s.r - 0.5) + 0.01
      }
    })
    slab.gaps.forEach((g, i) => {
      if (g.below >= plane - 2 && g.below <= plane) gaps.push(i)
    })
    const by = gaps.length ? 'C' : Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    const site = by && by !== 'C' ? slab.sites.find(s => s.el === by) : null
    const misfit = site ? `${site.r >= 0.5 ? '+' : '−'}${pct(Math.abs(site.r / 0.5 - 1), lang)}` : ''
    return { sites, gaps, by, misfit }
  }

  /** Strike the ingot (mine: this player's tap). */
  const strike = ({ mine = true } = {}) => {
    if (mine && (smithy.swinging() || smithy.pouring())) return false
    note = null
    const k = ingot.strikes + 1
    ingot = { ...ingot, strikes: Math.min(500, k) }
    if (mine) {
      ctx.share('ingot')
      track('bench', { id: 'alloys', op: 'strike', alloy: ingotInfo.id ?? ingotInfo.kind })
    }
    const wasCracked = !!cracked
    const s = wasCracked ? { kind: 'broken' } : strikeOf(slab, k, shifts)
    const hv = propertiesOf(ingotInfo).hard?.v ?? null
    smithy.strike(at => {
      if (s.kind === 'broken') {
        play('tap')
        lastStrike = { kind: 'broken' }
        report()
        return
      }
      const hard = hv == null ? 2 : hv < 15 ? 0 : hv < 50 ? 1 : hv < 150 ? 2 : 3
      if (s.kind === 'crack') {
        play('crack')
        play('anvil', { order: 3 })
        smithy.crack(true)
        smithy.burst(at, light ? 18 : 40, { up: 2, spread: 1.8 })
        slabView.strike(s, pinnedOn(s.plane))
        cracked = s
        lastStrike = { kind: 'crack', plane: s.plane }
        if (mine && markFound('bench:alloys:crack')) {
          play('celebrate')
          party({ kind: 'crack' })
        }
      } else {
        const pin = s.kind === 'jam' ? pinnedOn(s.plane) : { sites: [], gaps: [], by: null, misfit: '' }
        play(ingotInfo.id === 'bell' ? 'ring' : 'anvil', { order: s.kind === 'jam' ? Math.max(2, hard) : hard })
        smithy.burst(at, (light ? 6 : 12) + hard * (light ? 3 : 6))
        dentAt(k, hv)
        if (s.kind === 'slip') {
          for (let r = s.plane; r < slab.rows; r++) shifts[r] += s.dir
          smithy.flatten(0.965)
        }
        slabView.strike(s, pin)
        lastStrike = { kind: s.kind, plane: s.plane, by: pin.by, misfit: pin.misfit }
      }
      if (mine && markFound('bench:alloys:strike')) party({ kind: 'strike' })
      report()
    })
    return true
  }

  // ---- shared with the room (net/shared.js) ----
  const shared = {
    crucible: {
      get: () => ({ mix: crucible.mix, drops: crucible.drops, last: crucible.last }),
      set(s, live) {
        const mix = cleanMix(s?.mix)
        const drops = whole(s?.drops)
        const last = PALETTE.includes(s?.last) ? s.last : null
        const before = crucible.drops
        const thrown = live && drops > before && last && lumpsIn(mix) + (mix.C ?? 0) > 0
        crucible = { mix, drops, last }
        if (thrown) fly(last)
        // filled from the book: its lumps fly in one after another here too
        else if (live && drops > before && !last && Object.keys(mix).length) flyAll(mix)
        showCrucible()
        report()
      },
    },
    ingot: {
      get: () => ({ mix: ingot.mix, cast: ingot.cast, strikes: ingot.strikes }),
      set(s, live, ago = 0) {
        const mix = cleanMix(s?.mix)
        if (!pourable(identify(mix))) return
        const castN = whole(s?.cast)
        const strikes = whole(s?.strikes, 500)
        if (castN !== ingot.cast || !sameMix(mix, ingot.mix)) {
          ingot = { mix, cast: castN, strikes: live ? 0 : strikes }
          cast({ animate: !!live, ago })
          if (live && strikes > 0) {
            ingot.strikes = strikes
            rebuild()
          }
          return
        }
        if (live && strikes === ingot.strikes + 1) {
          strike({ mine: false })
          return
        }
        if (strikes !== ingot.strikes) {
          ingot = { ...ingot, strikes }
          lastStrike = null
          rebuild()
          report()
        }
      },
    },
  }

  // ---- taps: an Atomling (held: more), the crucible, the hammer and anvil, the case, the verse ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 4
  controls.maxDistance = 24
  controls.maxPolarAngle = 1.45
  controls.target.set(0, 1.4, -0.3)
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const castRay = e => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    return ray
  }
  const crewHit = o => crew.find(c => {
    let p = o
    while (p && p !== c.holder && p !== c.lump) p = p.parent
    return !!p
  })
  const targets = () => [...crew.flatMap(c => [c.holder, c.lump]), ...smithy.crucibleTargets, ...smithy.anvilTargets, slabView.hit]
  const what = e => {
    const hit = castRay(e).intersectObjects(targets(), true)[0]
    if (!hit) return verse.hits(ray) ? { kind: 'verse' } : null
    const c = crewHit(hit.object)
    if (c) return { kind: 'metal', el: c.el }
    if (smithy.crucibleTargets.includes(hit.object)) return { kind: 'crucible' }
    if (hit.object === slabView.hit) return { kind: 'anvil' }
    return { kind: 'anvil' }
  }
  let down = null
  let holding = null // { el, next, every }
  const onDown = e => {
    if (e.button > 0) return
    down = { x: e.clientX, y: e.clientY, at: clock, on: what(e) }
    if (down.on?.kind === 'metal') holding = { el: down.on.el, next: clock + 0.45, every: 0.17, thrown: 0 }
  }
  const onMove = e => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) {
      holding = null
      down.moved = true
    }
    if (!down && e.pointerType === 'mouse') {
      const w = what(e)
      canvas.style.cursor = w ? 'pointer' : ''
    }
  }
  const onUp = e => {
    const d = down
    const held = holding
    down = null
    holding = null
    if (!d || d.moved || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return
    const on = d.on
    if (!on) return
    if (on.kind === 'metal') {
      if (!held?.thrown) drop(on.el)
      return
    }
    if (on.kind === 'crucible') pour()
    else if (on.kind === 'anvil') strike()
    else if (on.kind === 'verse') verse.open()
  }
  const onCancel = () => {
    down = null
    holding = null
  }

  // ---- every frame ----
  const v = new THREE.Vector3()
  const update = (dt, t) => {
    clock = t
    verse.group.position.copy(camera.aspect < 1.25 ? VERSE_NARROW : VERSE_WIDE)
    verse.face()
    sky.userData.update(t)
    controls.update()
    for (let i = timers.length - 1; i >= 0; i--) if (timers[i].at <= t) timers.splice(i, 1)[0].fn()
    if (holding && down && !down.moved && t >= holding.next) {
      if (drop(holding.el)) holding.thrown += 1
      else holding = null
      if (holding) {
        holding.every = Math.max(0.08, holding.every * 0.85)
        holding.next = t + holding.every
      }
    }
    smithy.update(dt, t)
    slabView.update(dt, t, camera, SLAB_AT)
    // the crew: facing the camera, each lump held at its belly (back again a moment after a throw)
    for (const c of crew) {
      c.holder.rotation.y = Math.atan2(camera.position.x - c.holder.position.x, camera.position.z - c.holder.position.z)
      c.a.update(dt, t, { speed: 0 })
      const H = c.a.body.height * ARC.scale
      v.set(Math.sin(c.holder.rotation.y), 0, Math.cos(c.holder.rotation.y))
      c.lump.position.copy(c.holder.position).addScaledVector(v, c.a.body.radius * ARC.scale * 1.25)
      c.lump.position.y = 0.5 + H * 0.42 + Math.sin(t * 2 + c.ang * 5) * 0.012
      c.lump.rotation.y = t * 0.6 + c.ang
      if (c.back > 0) {
        c.back -= dt
        if (c.back <= 0) c.lump.visible = true
      }
    }
    // lumps in the air: an arc to the crucible, a splash where they land
    const into = smithy.meltPoint()
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]
      f.t += dt / 0.62
      const k = Math.min(1, f.t)
      f.mesh.position.lerpVectors(f.from, into, k)
      f.mesh.position.y += Math.sin(k * Math.PI) * (1.3 + f.from.distanceTo(into) * 0.12)
      f.mesh.rotation.x += dt * 9
      f.mesh.rotation.z += dt * 6
      if (k >= 1) {
        root.remove(f.mesh)
        flights.splice(i, 1)
        smithy.splash(f.el === 'C' ? 0.4 : 1)
        play(f.el === 'C' ? 'fizz' : 'plop', { order: 1 })
      }
    }
    // keep the bench in the part of the screen the HUD leaves free (the engine centres it there): the
    // furnace, the anvil and the case across, the case's title up
    const free = ctx.engine.freeShare()
    const tanUp = Math.tan((camera.fov * Math.PI) / 360)
    // (an upright screen holds the crew's ends and the furnace's rim; a wide one a little air round them)
    const across = (camera.aspect < 0.8 ? 3.85 : 3.55) / (tanUp * camera.aspect * Math.max(0.35, free.w))
    const up = 2.75 / (tanUp * Math.max(0.35, free.h))
    const want = Math.max(6.2, across, up)
    const dist = camera.position.distanceTo(controls.target)
    if (dist < want * 0.96 || dist > want * 1.5) camera.position.sub(controls.target).setLength(dist + (want - dist) * Math.min(1, dt * 2)).add(controls.target)
  }

  const attach = () => {
    // an upright phone looks down from higher, so the table fills the height the screen has
    camera.position.set(0, camera.aspect < 0.8 ? 7.2 : 3.6, 8.8)
    controls.target.set(0, 1.4, -0.3)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onCancel)
    rebuild()
    showCrucible()
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onCancel)
    canvas.style.cursor = ''
    controls.dispose()
    store.set({ alloys: null, alloysParty: null, discoveries: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.6, bloom: { strength: 0.55, radius: 0.45, threshold: 0.8 }, fov: 50 },
    attach,
    detach,
    update,
    refresh: () => report(),
    shared,
    drop,
    pour,
    strike: () => strike({ mine: true }),
    empty,
    recipe,
    /** For the probes: the crucible, the ingot, the slab's rows and the last strike. */
    /** For the probes (tools/alloys_probe.py): where on the canvas (CSS pixels) each thing to tap is. */
    points: () => {
      const r = canvas.getBoundingClientRect()
      const at = p => {
        const q = p.clone().project(camera)
        return [Math.round(((q.x + 1) / 2) * r.width), Math.round(((1 - q.y) / 2) * r.height)]
      }
      return {
        metals: Object.fromEntries(crew.map(c => [c.el, at(c.holder.position.clone().add(new THREE.Vector3(0, c.a.body.height * ARC.scale * 0.55, 0)))])),
        crucible: at(smithy.crucible.position.clone().add(new THREE.Vector3(0, 0.3, 0))),
        anvil: at(smithy.ingotTop()),
        slab: at(SLAB_AT),
      }
    },
    state: () => ({ crucible, ingot, info: identify(crucible.mix), ingotInfo, shifts: [...shifts], cracked: !!cracked, last: lastStrike, pouring: smithy.pouring(), swinging: smithy.swinging() }),
    // what the shared probe uses, one by one (tools/shared_steps/alloys.json has more)
    interactables: [
      ...PALETTE.map(el => ({ id: `drop-${el}`, onUse: () => drop(el) })),
      { id: 'pour', onUse: () => pour() },
      { id: 'strike', onUse: () => strike({ mine: true }), get found() { return isFound('bench:alloys:strike') } },
      { id: 'empty', onUse: () => empty() },
    ],
    dispose() {
      verse.dispose()
      smithy.dispose()
      slabView.dispose()
      for (const c of crew) c.label.dispose()
    },
  }
}
