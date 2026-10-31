// The Atom Forge (/forge, /forge?z=Fe): build an atom from protons, neutrons and electrons. The protons
// make the element (its Atomling pops up beside the atom), the neutrons its isotope, the electrons its
// charge. The chart of nuclides (chem/nucleus.js) says whether the nucleus holds together; an unstable
// one trembles and decays before your eyes (alpha, beta, fission...), down whole decay chains.
// Words: words.js; the HUD: ui/ForgeHud.jsx; the plan: docs/knowledge/atom-forge.md.
// In a room the atom is the room's (together.js: everyone's particles count, merged; shared through
// net/shared.js as `atom` and `hold`): each change plays on every screen, others' particles come in from
// the far side glowing in their colour, with their name. A race (net/race.js, game/race.js, goals.js)
// gives each racer an atom of their own until it is over. Alone, nothing of this runs.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { element } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { nightSky } from '../common/sky.js'
import { packBall } from '../common/pack.js'
import { makeText } from '../../engine/text.js'
import { loadChart, nuclide, decay, commonestN, ionShells, modeFamily, collide, BEAMS } from '../../chem/nucleus.js'
import { markFound, isFound } from '../../engine/progress.js'
import { track } from '../../net/telemetry.js'
import { room } from '../../net/room.js'
import { race } from '../../net/race.js'
import { shared as worlds } from '../../net/shared.js'
import { play, ambience } from '../../audio/sound.js'
import { MISSIONS } from './words.js'
import { fresh, atomOf, bump, rebase, merge, covers, changes, clean, canon, untouched } from './together.js'
import { progress } from './goals.js'

const LIFT = 2.8 // the atom's centre above the floor
const NR = 0.17 // a nucleon's radius, in metres
const CAP = { p: 118, n: 180 }
const COLOR = { p: '#ff5a55', n: '#b9c6dc', e: '#a8ecff', positron: '#ffb3e6', neutrino: '#fff3c4' }
const SPEEDS = [1.3, 0.95, 0.75, 0.62, 0.53, 0.47, 0.42]
const SHARE_S = 0.15 // in a room: my changes go out at most this often (held + buttons fire 25 a second)
const RACE_S = 0.35 // in a race: how often I tell how far I am
const LAG_S = 1.2 // what the last one to change the atom does by itself (a decay, an electron leaving), the others do only this much later
const TINT_S = 2.6 // someone else's particle glows in their colour this long
const FEED_S = 5 // a line of who did what stays this long

export async function build(ctx, target) {
  await loadChart()
  const { camera, canvas, store, light } = ctx
  const lang = () => ctx.lang()
  const root = new THREE.Group()
  root.name = 'forge'

  // ---- the room: a round forge under the stars, its rim glowing like hot metal ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#2a1d4c' })
  root.add(sky)
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#100c26', roughness: 0.55, metalness: 0.3 }))
  floor.rotation.x = -Math.PI / 2
  root.add(floor)
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.4, 0.3, 72), new THREE.MeshStandardMaterial({ color: '#1b1640', roughness: 0.35, metalness: 0.55 }))
  plate.position.y = 0.15
  root.add(plate)
  const hot = new THREE.MeshStandardMaterial({ color: '#ff9a4d', emissive: '#ff8a3d', emissiveIntensity: 1.6 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(7.05, 0.07, 8, 128), hot)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.3
  root.add(rim)
  const glow = new THREE.Mesh(new THREE.CircleGeometry(6.6, 64), new THREE.MeshBasicMaterial({ color: '#5a2a7a', transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }))
  glow.rotation.x = -Math.PI / 2
  glow.position.y = 0.31
  root.add(glow)
  // where the atom is made: a beam of light from the plate and a floating ring under it
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, LIFT - 0.3, 40, 1, true), new THREE.MeshBasicMaterial({ color: '#8a5cff', transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
  beam.position.y = 0.3 + (LIFT - 0.3) / 2
  root.add(beam)
  const cradle = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 8, 64), hot)
  cradle.rotation.x = Math.PI / 2
  cradle.position.y = 0.34
  root.add(cradle)
  root.add(new THREE.HemisphereLight('#e6e2ff', '#21183f', 1.25))
  const key = new THREE.DirectionalLight('#fff1e0', 1.5)
  key.position.set(5, 10, 7)
  root.add(key)

  // ---- the atom ----
  const atom = new THREE.Group()
  atom.position.y = LIFT
  root.add(atom)
  const core = new THREE.Group()
  atom.add(core)
  const nGeo = new THREE.SphereGeometry(NR, light ? 10 : 16, light ? 8 : 12)
  const mat = {
    p: new THREE.MeshStandardMaterial({ color: COLOR.p, emissive: COLOR.p, emissiveIntensity: 0.55, roughness: 0.35 }),
    n: new THREE.MeshStandardMaterial({ color: COLOR.n, emissive: COLOR.n, emissiveIntensity: 0.3, roughness: 0.35 }),
    e: new THREE.MeshStandardMaterial({ color: COLOR.e, emissive: COLOR.e, emissiveIntensity: 2.2 }),
    positron: new THREE.MeshStandardMaterial({ color: COLOR.positron, emissive: COLOR.positron, emissiveIntensity: 2.2 }),
    neutrino: new THREE.MeshBasicMaterial({ color: COLOR.neutrino, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  }
  const im = { p: new THREE.InstancedMesh(nGeo, mat.p, CAP.p + 4), n: new THREE.InstancedMesh(nGeo, mat.n, CAP.n + 4) }
  for (const m of Object.values(im)) {
    m.count = 0
    m.frustumCulled = false
    core.add(m)
  }
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: COLOR.p, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }))
  atom.add(halo)
  // in a room: a glow in someone else's colour round each particle they have just added (one instance
  // always drawn, at no size, so its shader is ready before the first one comes)
  const glows = new THREE.InstancedMesh(new THREE.SphereGeometry(NR * 1.45, 12, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }), CAP.p + CAP.n + 8)
  glows.frustumCulled = false
  glows.setMatrixAt(0, new THREE.Matrix4().makeScale(0, 0, 0))
  glows.setColorAt(0, new THREE.Color('#000000'))
  glows.count = 1
  core.add(glows)
  // and their name by the atom, on their side, for a moment
  const names = new Map() // player -> { text, until }

  // electrons: one instanced mesh, placed on the shells each frame
  const eGeo = new THREE.SphereGeometry(0.085, 12, 10)
  const eIM = new THREE.InstancedMesh(eGeo, mat.e, 128)
  eIM.count = 0
  eIM.frustumCulled = false
  atom.add(eIM)
  const ringMat = new THREE.MeshBasicMaterial({ color: '#a9c4ff', transparent: true, opacity: 0.4, depthWrite: false })
  const outerRingMat = new THREE.MeshBasicMaterial({ color: '#7fe3ff', transparent: true, opacity: 0.75, depthWrite: false })
  const shellGroup = new THREE.Group()
  atom.add(shellGroup)
  let rings = [] // { r, m: Matrix4 (ring plane to atom), mesh }
  let ringsKey = ''

  // the element's Atomling, on a pedestal beside the atom
  const stage = new THREE.Group()
  root.add(stage)
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.5, 40), new THREE.MeshStandardMaterial({ color: '#241d52', roughness: 0.3, metalness: 0.5 }))
  pedestal.position.y = 0.55
  stage.add(pedestal)
  const pedRim = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.03, 6, 48), hot)
  pedRim.rotation.x = Math.PI / 2
  pedRim.position.y = 0.8
  stage.add(pedRim)
  let ling = null
  let lingZ = 0
  let pendingLing = null // { Z, at }

  // ---- state ----
  let Z = 0
  let N = 0
  let E = 0
  let held = false
  let note = null
  let lastEvent = null
  let chainOrigin = null
  let clock = 0
  let lastTouch = -10 // when the player last changed the particles
  let lastChange = 0 // when the atom last changed at all
  let ejectAt = null // an unwanted extra electron leaves at this time
  const nucleons = [] // { kind, pos, target, seed }
  const flyers = [] // decay products and lost particles: { obj, vel, age, life, spin }
  let eFly = null // { index, from, start }
  let flash = 0

  // ---- together (a room) ----
  let together = fresh(0, 0, 0) // the room's atom (together.js): what the table shows, unless I race
  let due = false // a change of mine still to go out
  let sentAt = -10
  let lastBy = null // who changed the room's atom last: they run its physics, the others wait LAG_S more
  let feed = [] // who did what, for the HUD: [{ id, by, name, color, k, n, t, beam, Z, N, h, at }]
  let feedCut = false // the atom was set anew since the last line: the next count starts a line of its own
  let pendingTarget = null // in a room, the element asked for in the address waits for the room's atom: { z, wait }
  // ---- a race (net/race.js): my own atom until it is over ----
  let racing = false
  let raceId = null
  let raceGoal = null
  let raceHeld = false
  let raceDue = false
  let raceSentAt = -10
  let raceDone = false
  const me = () => room.me?.id ?? 'me'
  /** Is the atom on my table the room's? (net/shared.js has switched to the room's world: before that,
   *  a change would be kept as my own) */
  const inRoom = () => room.active && !!room.me && !racing && worlds.mode === 'room'
  const colorOf = id => room.member(id)?.color ?? '#ffd166'
  const peersHere = () => (room.active ? room.members.filter(m => m.id !== room.me?.id && m.path === location.pathname) : [])

  // where a particle enters: from the HUD's buttons, on the left of the screen (or at the bottom of an
  // upright phone)
  const ENTRY = { p: [0.32, -0.66], n: [0.04, 0], e: [-0.24, 0.66] }
  const fromScreen = (sx, sy, into) => {
    const v = new THREE.Vector3(sx, sy, 0.5).unproject(camera)
    const dir = v.sub(camera.position).normalize()
    const p = camera.position.clone().addScaledVector(dir, camera.position.distanceTo(atom.getWorldPosition(new THREE.Vector3())) * 0.8)
    return into.worldToLocal(p)
  }
  const entry = (kind, into) => {
    const [y, x] = ENTRY[kind]
    return camera.aspect < 1 ? fromScreen(x, -1.05, into) : fromScreen(-1.05, y, into)
  }
  // someone else's particles come from the far side (the right; the top of an upright phone), each
  // player from a height of their own
  const SLOTS = [0.4, -0.3, 0.05, 0.7, -0.6]
  const remoteEntry = (by, kind, into) => {
    const slot = Math.max(0, peersHere().findIndex(m => m.id === by)) % SLOTS.length
    const k = { p: 0.08, n: 0, e: -0.08 }[kind] ?? 0
    return camera.aspect < 1 ? fromScreen(SLOTS[slot] + k, 1.05, into) : fromScreen(1.05, SLOTS[slot] + k, into)
  }

  const nucleusR = () => NR * Math.cbrt(Math.max(1, nucleons.length)) * 1.05

  // place every nucleon's target in a ball, protons and neutrons mixed evenly, each to the nearest free
  // slot of its kind (so adding one shuffles the others only a little)
  const relayout = () => {
    const total = nucleons.length
    if (!total) return
    const pts = packBall(total, nucleusR())
    const protons = nucleons.filter(x => x.kind === 'p').length
    const share = protons / total
    const free = { p: [], n: [] }
    pts.forEach((pt, i) => free[Math.floor((i + 1) * share) > Math.floor(i * share) ? 'p' : 'n'].push(pt))
    // the counts can differ by one through rounding: move a slot over
    while (free.p.length < protons) free.p.push(free.n.pop())
    while (free.p.length > protons) free.n.push(free.p.pop())
    for (const kind of ['p', 'n']) {
      const slots = free[kind]
      const list = nucleons.filter(x => x.kind === kind)
      list.sort((a, b) => b.pos.lengthSq() - a.pos.lengthSq())
      for (const x of list) {
        let best = 0
        let bd = Infinity
        slots.forEach((s, i) => {
          const d = s.distanceToSquared(x.pos)
          if (d < bd) {
            bd = d
            best = i
          }
        })
        x.target.copy(slots[best])
        slots.splice(best, 1)
      }
    }
  }

  const addNucleon = (kind, from, by = null) => {
    nucleons.push({
      kind, pos: from ? from.clone() : new THREE.Vector3(), target: new THREE.Vector3(), seed: Math.random() * 100,
      // someone else's: it glows in their colour for a moment
      ...(by ? { tint: new THREE.Color(colorOf(by)), until: clock + TINT_S } : {}),
    })
  }
  /** The nucleons of a kind nearest the surface toward dir (they leave first). */
  const outermost = (kind, count, dir) => nucleons
    .filter(x => x.kind === kind)
    .sort((a, b) => b.pos.dot(dir) - a.pos.dot(dir))
    .slice(0, count)
  const removeNucleons = list => {
    for (const x of list) nucleons.splice(nucleons.indexOf(x), 1)
  }

  // the shells: rings of their own tilt, rebuilt when their number or size changes
  const syncShells = () => {
    const shells = ionShells(Z, E)
    const inner = Math.max(nucleusR() * 2.4, 1.05)
    const radii = shells.map((_, k) => inner + k * 0.58)
    const k = `${shells.length}:${inner.toFixed(2)}`
    if (k !== ringsKey) {
      ringsKey = k
      for (const r of rings) {
        shellGroup.remove(r.mesh)
        r.mesh.geometry.dispose()
      }
      rings = radii.map((r, i) => {
        const outer = i === radii.length - 1
        const parent = new THREE.Object3D()
        parent.rotation.y = i * 1.3
        const plane = new THREE.Object3D()
        plane.rotation.x = Math.PI / 2 + (i % 2 ? 1 : -1) * Math.min(0.45, 0.16 + 0.05 * i)
        parent.add(plane)
        parent.updateMatrixWorld(true)
        const m = plane.matrixWorld.clone()
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, outer ? 0.035 : 0.022, 6, 160), outer ? outerRingMat : ringMat)
        mesh.matrixAutoUpdate = false
        mesh.matrix.copy(m)
        shellGroup.add(mesh)
        return { r, m, mesh }
      })
    } else {
      rings.forEach((r, i) => {
        r.mesh.material = i === rings.length - 1 ? outerRingMat : ringMat
      })
    }
    return shells
  }
  let shells = []
  const outerR = () => (rings.length ? rings[rings.length - 1].r : nucleusR() * 2)

  // ---- the Atomling ----
  const showAtomling = z => {
    if (z === lingZ) return
    if (ling) stage.remove(ling.root)
    ling = null
    lingZ = z
    if (z < 1) return
    ling = createAtomling(element(z), { light })
    ling.root.position.y = 0.8
    stage.add(ling.root)
    ling.poof?.()
  }

  // ---- what the HUD shows (it words it itself, so a change of language or level shows at once) ----
  const state = () => ({ Z, N, E, nuc: nuclide(Z, N), common: Z ? commonestN(Z) : 0, held, note })
  const report = () => {
    store.set({
      forge: {
        Z, N, E, held: racing ? raceHeld : heldByPlayer, note,
        event: lastEvent,
        canDecay: !!decay(Z, N),
        done: MISSIONS.filter(m => isFound(`forge:${m.id}`)).map(m => m.id),
        // in a room: who else is here, and what they have just done
        together: room.active ? { peers: peersHere().map(m => ({ id: m.id, name: m.name, color: m.color })), feed } : null,
        racing,
      },
    })
  }
  const checkMissions = ev => {
    const s = state()
    for (const m of MISSIONS) {
      if (!isFound(`forge:${m.id}`) && m.check(s, ev ?? null) && markFound(`forge:${m.id}`)) {
        track('mission', { id: `forge:${m.id}` })
        play('celebrate')
        store.set({ forgeCelebrate: { id: m.id, name: m.name[lang()] ?? m.name.en, at: performance.now() } })
      }
    }
  }

  // (missions: false for the room's atom as it stood when I came in: a mission counts for those there
  // when it was made)
  const changed = ({ byPlayer = true, ev = null, missions = true } = {}) => {
    if (byPlayer) {
      lastTouch = clock
      chainOrigin = null
      lastEvent = null
    }
    lastChange = clock
    relayout()
    shells = syncShells()
    if (byPlayer) showAtomling(Z)
    if (missions) checkMissions(ev)
    if (racing) raceCheck(ev)
    report()
  }

  // ---- what I change, into the room's atom (in a room; alone nothing is kept or sent) ----
  const sent = () => {
    lastBy = me()
    due = true
  }
  /** A particle I added (1) or took away (-1). */
  const record = (kind, sign) => {
    if (!inRoom()) return
    together = bump(together, me(), kind, sign, Date.now())
    sent()
  }
  /** I changed the whole atom (to `atom`, the table's by default): ev says how, for the others to play. */
  const rebaseMine = (ev, atom = { Z, N, E }) => {
    if (!inRoom()) return
    together = rebase(together, me(), atom, ev, chainOrigin ? [chainOrigin.Z, chainOrigin.N] : null, Date.now())
    feedCut = true
    sent()
  }

  // ---- a race: how far I am, and whether I am done ----
  const raceCheck = ev => {
    raceDue = true
    const s = race.s
    if (raceDone || !s || s.id !== raceId || s.phase !== 'racing') return
    const m = MISSIONS.find(x => x.id === raceGoal)
    if (m && m.check(state(), ev ?? null)) {
      raceDone = true
      race.do({ t: 'done', a: [Z, N, E] })
    }
  }
  const raceTell = () => {
    raceDue = false
    raceSentAt = clock
    const o = chainOrigin ? [chainOrigin.Z, chainOrigin.N] : null
    race.do({ t: 'at', a: [Z, N, E], o, p: progress(raceGoal, { a: [Z, N, E], o, done: raceDone }).p })
  }

  // ---- what the HUD (and the probes) do; `by`: someone else's change in the room, played here ----
  const add = (kind, { by = null } = {}) => {
    note = null
    if (!by) track('forge', { op: 'add', k: kind, z: Z, n: N, e: E })
    const from = (k, into) => (by ? remoteEntry(by, k, into) : entry(k, into))
    if (kind === 'p') {
      if (Z >= CAP.p) return
      Z++
      addNucleon('p', from('p', core), by)
      play('proton')
    } else if (kind === 'n') {
      if (N >= CAP.n) return
      N++
      addNucleon('n', from('n', core), by)
      play('neutron')
    } else {
      if (Z === 0) {
        note = 'noHold'
        play('part')
        return report()
      }
      if (E >= Z + 3) {
        note = 'tooMany'
        play('part')
        return report()
      }
      E++
      eFly = { index: E - 1, from: from('e', atom), start: clock }
      if (E > Z && !(element(Z).ea > 0)) {
        note = 'noExtra'
        // (the one who added it sends it away; the others only if their word does not come)
        ejectAt = clock + 1.1 + (by ? LAG_S : 0)
      } else if (E - Z >= 2) note = 'crystalOnly'
      play('electron')
    }
    if (!by) record(kind, 1)
    changed()
  }
  const remove = (kind, { by = null } = {}) => {
    note = null
    if (!by) track('forge', { op: 'remove', k: kind, z: Z, n: N, e: E })
    // (mine leave toward my buttons, someone else's toward their side)
    const out = new THREE.Vector3(by ? 1 : -1, 0.3, 0.4).normalize()
    if (kind === 'p' || kind === 'n') {
      if ((kind === 'p' ? Z : N) === 0) return
      const [x] = outermost(kind, 1, out)
      launch([x], out, 2.5)
      removeNucleons([x])
      if (kind === 'p') Z--
      else N--
      if (E > Z + 3 || Z === 0) E = Z === 0 ? 0 : Z + 3
    } else {
      if (E === 0) return
      E--
    }
    play('part')
    if (!by) record(kind, -1)
    changed()
  }
  /** The whole atom on the table at once, its nucleons spreading out from the middle (quiet: no sound,
   *  for the room's atom as it stands or a race's start). */
  const place = (z, n, e = z, { quiet = false, how = {} } = {}) => {
    note = null
    Z = Math.max(0, Math.min(CAP.p, z))
    N = Math.max(0, Math.min(CAP.n, n))
    E = Z === 0 ? 0 : Math.max(0, Math.min(Z + 3, e))
    nucleons.length = 0
    for (let i = 0; i < Z; i++) addNucleon('p', null)
    for (let i = 0; i < N; i++) addNucleon('n', null)
    nucleons.sort(() => Math.random() - 0.5)
    flash = quiet ? 0.2 : 0.6
    if (!quiet) play('select')
    changed(how)
    showAtomling(Z)
    // spread out from the middle
    for (const x of nucleons) x.pos.copy(x.target).multiplyScalar(0.15)
  }
  /** Set the whole atom at once (the chart, the element finder, the missions' "show me"). Not in a
   *  race: there each one builds it particle by particle. */
  const set = (z, n, e = z) => {
    if (racing) return
    place(z, n, e)
    rebaseMine({ t: 'set' })
  }
  const goTo = ref => {
    const el = element(ref)
    if (el) set(el.z, commonestN(el.z), el.z)
  }
  const neutral = () => {
    if (Z === 0 || E === Z) return
    note = null
    E = Z
    play('electron')
    changed()
    rebaseMine({ t: 'neutral' })
  }
  const commonest = () => {
    if (Z === 0) return
    set(Z, commonestN(Z), E)
  }
  const clear = () => {
    // (in a race, starting again is my own)
    if (racing) place(0, 0, 0)
    else set(0, 0, 0)
  }
  let heldByPlayer = false // the hold on the room's atom (or on mine, alone)
  let holdBy = '' // who set it, in a room
  const setHeld = h => {
    if (racing) raceHeld = h
    else {
      heldByPlayer = h
      if (inRoom()) {
        holdBy = me()
        lastBy = me()
        ctx.share('hold')
      }
    }
    held = incoming ? true : h
    report()
  }

  // flying things: lost nucleons, decay products
  const launch = (list, dir, speed, cluster = false) => {
    if (!list.length) return
    const group = new THREE.Group()
    const centre = new THREE.Vector3()
    for (const x of list) centre.add(core.localToWorld(x.pos.clone()))
    centre.multiplyScalar(1 / list.length)
    group.position.copy(centre)
    for (const x of list) {
      const m = new THREE.Mesh(nGeo, mat[x.kind])
      m.position.copy(core.localToWorld(x.pos.clone()).sub(centre))
      if (cluster) m.position.multiplyScalar(0.75)
      group.add(m)
    }
    root.add(group)
    flyers.push({ obj: group, vel: dir.clone().multiplyScalar(speed), age: 0, life: 2.2, spin: cluster ? 3 : 0 })
  }
  const shoot = (kind, dir, speed) => {
    const m = new THREE.Mesh(kind === 'electron' ? eGeo : nGeo, kind === 'electron' ? mat.e : kind === 'positron' ? mat.positron : mat.neutrino)
    if (kind === 'neutrino' || kind === 'antineutrino') m.scale.setScalar(0.35)
    if (kind === 'positron') m.scale.setScalar(0.55)
    m.position.copy(atom.getWorldPosition(new THREE.Vector3()))
    root.add(m)
    flyers.push({ obj: m, vel: dir.clone().multiplyScalar(speed), age: 0, life: 1.6, streak: true })
  }
  const randomDir = () => {
    // up and to the sides, never straight at the camera, so the eye can follow it
    const toCam = camera.position.clone().sub(atom.getWorldPosition(new THREE.Vector3())).setY(0).normalize()
    const side = new THREE.Vector3(-toCam.z, 0, toCam.x).multiplyScalar(Math.random() < 0.5 ? -1 : 1)
    return side.multiplyScalar(0.8).add(new THREE.Vector3(0, 0.45 + Math.random() * 0.4, 0)).addScaledVector(toCam, -0.3 + Math.random() * 0.4).normalize()
  }

  const NUCLEONS_OF = { alpha: [2, 2], proton: [1, 0], neutron: [0, 1], deuteron: [1, 1], triton: [1, 2] }

  /** Turn the nucleus into d ({ mode, Z, N, emitted, piece?, fragment?, cluster? }): what leaves flies
   *  away (nucleons taken from the side it leaves by, clusters together), what changes kind changes
   *  colour (beta decays), electrons and neutrinos shoot out. A decay or a beam's reaction. */
  const transform = (d, extra = {}) => {
    const before = { Z, N }
    const q = Z - E
    const dir = randomDir()
    const taken = new Set()
    const takeOut = (kind, n) => {
      const xs = nucleons.filter(x => x.kind === kind && !taken.has(x)).sort((a, b) => b.pos.dot(dir) - a.pos.dot(dir)).slice(0, n)
      xs.forEach(x => taken.add(x))
      return xs
    }
    let pOut = 0
    const leaving = []
    for (const k of d.emitted) {
      const c = k === 'fragment' ? (d.piece ?? d.fragment) : k === 'cluster' ? d.cluster : NUCLEONS_OF[k] ? { Z: NUCLEONS_OF[k][0], N: NUCLEONS_OF[k][1] } : null
      if (!c) continue
      leaving.push([...takeOut('p', c.Z), ...takeOut('n', c.N)])
      pOut += c.Z
    }
    // what is left turns into d's protons and neutrons: beta decays turn one kind into the other
    const flips = d.Z - Z + pOut
    nucleons.filter(x => x.kind === (flips > 0 ? 'n' : 'p') && !taken.has(x))
      .sort((a, b) => b.pos.dot(dir) - a.pos.dot(dir)).slice(0, Math.abs(flips))
      .forEach(x => {
        x.kind = flips > 0 ? 'p' : 'n'
      })
    leaving.forEach((list, i) => launch(list, i === 0 ? dir : randomDir(), list.length > 1 ? (d.mode === 'SF' || d.emitted[0] === 'fragment' ? 3.2 : 4.5) : 5, list.length > 1))
    removeNucleons([...taken])
    for (const k of d.emitted) {
      if (k === 'electron') shoot('electron', dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.4), 9)
      else if (k === 'positron') shoot('positron', dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.4), 9)
      else if (k === 'neutrino' || k === 'antineutrino') shoot('neutrino', dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.9), 14)
    }
    Z = d.Z
    N = d.N
    E = Z === 0 ? 0 : Math.max(0, Math.min(Z + 3, Z - q))
    if (extra.reaction) {
      chainOrigin = null
      lastEvent = { mode: d.mode, from: extra.from, to: { Z, N }, beam: extra.beam, famous: extra.famous, out: d.emitted }
    } else {
      chainOrigin ??= before
      lastEvent = { mode: d.mode, from: before, to: { Z, N }, origin: chainOrigin }
    }
    flash = 1
    note = null
    play('decay', { order: extra.reaction || ['alpha', 'fission', 'cluster'].includes(modeFamily(d.mode)) ? 2 : 1 })
    pendingLing = { Z, at: clock + 0.35 }
    changed({ byPlayer: false, ev: lastEvent })
    return true
  }

  /** One decay, by the nucleus's strongest mode (in a room, the room's atom's). */
  const decayNow = () => {
    const d = decay(Z, N)
    if (!d) return false
    const f = [Z, N, E]
    transform(d)
    rebaseMine({ t: 'decay', f })
    return true
  }
  const holdNow = () => (racing ? raceHeld : heldByPlayer)

  // ---- the beam: a nucleus fired at the one on the table (`by`: someone else's shot, played here) ----
  let incoming = null // { c: collide's answer, from, beam, at }
  const fire = (beam, { by = null } = {}) => {
    if (incoming || !BEAMS[beam]) return
    if (!by) track('forge', { op: 'fire', beam, z: Z, n: N })
    const [bz, bn] = BEAMS[beam]
    // nothing beyond oganesson (118) has ever been made: the forge says so instead of naming an
    // element that does not exist (zinc-70 at uranium would have made 122 and broken the names)
    if (Z + bz > 118) {
      note = 'beyond'
      play('part')
      return report()
    }
    const c = collide(Z, N, beam)
    const from = { Z, N }
    const f = [Z, N, E]
    const charge = Z - E
    // its nucleons fly in from the left together (someone else's from their side); on arrival they are
    // the compound nucleus
    const start = by ? remoteEntry(by, 'n', core) : entry('n', core)
    const spread = NR * Math.cbrt(bz + bn) * 1.2
    for (let i = 0; i < bz + bn; i++) {
      const off = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(spread * 2)
      addNucleon(i < bz ? 'p' : 'n', start.clone().add(off), by)
    }
    Z += bz
    N += bn
    // the atom keeps the charge it had (a neutral target stays neutral); a beam particle fired at an
    // empty table is a bare nucleus
    E = Z === bz && N === bn ? 0 : Math.max(0, Math.min(Z + 3, Z - charge))
    incoming = { c, from, beam, at: clock + 0.8 }
    held = true // the compound waits for the beam to arrive
    chainOrigin = null
    play('beam')
    lastTouch = clock
    changed({ byPlayer: false })
    if (!by) {
      // the others are told at once what it will make (the product, keeping the atom's charge), and play
      // the shot themselves
      const q = Z - E
      const rZ = c.result.Z
      rebaseMine({ t: 'fire', f, beam }, { Z: rZ, N: c.result.N, E: rZ === 0 ? 0 : Math.max(0, Math.min(rZ + 3, rZ - q)) })
    }
  }

  // ---- someone else's change to the room's atom, played on my table ----
  /** The table to `want` by the shortest way: a few particles off are added or taken quietly, more (or
   *  the room's atom as it stood when I came in) are set at once. */
  const conform = (want, { live = false } = {}) => {
    if (Z === want.Z && N === want.N && E === want.E) return false
    const far = Math.abs(want.Z - Z) + Math.abs(want.N - N)
    if (!live || far > 40) {
      place(want.Z, want.N, want.E, { quiet: !live, how: { byPlayer: live, missions: live } })
      return true
    }
    const out = new THREE.Vector3(1, 0.3, 0.4).normalize()
    for (const [kind, goal] of [['p', want.Z], ['n', want.N]]) {
      let have = kind === 'p' ? Z : N
      for (; have < goal; have++) addNucleon(kind, null)
      if (have > goal) removeNucleons(outermost(kind, have - goal, out))
    }
    Z = want.Z
    N = want.N
    E = want.E
    changed({ byPlayer: false, missions: live })
    showAtomling(Z)
    return true
  }
  /** A line for the HUD: who did what (counts of the same kind by the same one, close together and on
   *  the same atom, add up). */
  const tell = (by, what) => {
    const m = room.member(by)
    if (!m || by === room.me?.id) return
    const at = clock
    const last = feed.at(-1)
    if (what.k && !feedCut && last && last.by === by && last.k === what.k && at - last.at < 3 && Math.sign(last.n) === Math.sign(what.n)) {
      feed = [...feed.slice(0, -1), { ...last, n: last.n + what.n, at }]
    } else feed = [...feed.slice(-3), { id: `${by}-${at}-${Math.random().toString(36).slice(2, 6)}`, by, name: m.name, color: m.color, ...what, at }]
    feedCut = !what.k
    if (what.k) nameTag(by, m)
  }
  /** Their name by the atom, on their side, for a moment. */
  const nameTag = (by, m) => {
    let tag = names.get(by)
    if (!tag) {
      const text = makeText(m.name, { size: 0.3, color: m.color, outlineWidth: 0.025, outlineColor: '#120c2a', depthTest: false })
      text.renderOrder = 5
      root.add(text)
      tag = { text, until: 0 }
      names.set(by, tag)
    }
    tag.until = clock + 1.8
  }
  /** Each player's particles in the order they can go in (protons and neutrons first, electrons after). */
  const ORDER = ['p+', 'n+', 'e-', 'e+', 'n-', 'p-']
  const playCounts = list => {
    const sorted = [...list].sort((a, b) => ORDER.indexOf(`${a.k}${a.n > 0 ? '+' : '-'}`) - ORDER.indexOf(`${b.k}${b.n > 0 ? '+' : '-'}`))
    for (const c of sorted) {
      tell(c.by, { k: c.k, n: c.n })
      // (a burst bigger than this goes on at once, by conform)
      for (let i = 0; i < Math.min(30, Math.abs(c.n)); i++) (c.n > 0 ? add : remove)(c.k, { by: c.by })
    }
  }
  /** Someone set a new base: play how (their decay, their shot, their pick on the chart). */
  const replay = (after, want) => {
    const ev = after.ev ?? {}
    const f = ev.f ? { Z: ev.f[0], N: ev.f[1], E: ev.f[2] } : null
    // the table shows it already (my own decay got there first)
    if (Z === want.Z && N === want.N && E === want.E && ev.t !== 'fire') return
    if (incoming) {
      incoming = null
      held = holdNow()
    }
    if (ev.t === 'decay' && f) {
      conform(f, { live: true })
      chainOrigin = after.o ? { Z: after.o[0], N: after.o[1] } : null
      const d = decay(f.Z, f.N)
      if (d) transform(d)
    } else if (ev.t === 'fire' && f && BEAMS[ev.beam]) {
      conform(f, { live: true })
      fire(ev.beam, { by: after.by })
      // (the shot lands on the room's atom when it arrives)
      return
    } else if (ev.t === 'set') place(want.Z, want.N, want.E, { how: { byPlayer: true } })
    else if (ev.t === 'neutral') {
      E = want.E
      play('electron')
      changed()
    }
    conform(want, { live: true })
  }
  /** The room's atom changed (someone else, or the room's as it stands when I come in): my table follows,
   *  unless I am racing (then it waits for me). */
  const follow = (before, after, live) => {
    together = after
    if (racing) return
    const want = atomOf(after)
    if (!live) {
      incoming = null
      held = holdNow()
      lastBy = after.by || null
      conform(want)
      return
    }
    let ch = changes(before, after)
    if (ch.rebased && after.ev?.t === 'fold') {
      // a base that is the atom as it stood: only the counts on it are new
      conform({ Z: after.b[0], N: after.b[1], E: after.b[2] }, { live: true })
      ch = changes({ ...after, d: {} }, after)
    }
    if (ch.rebased) {
      lastBy = ch.by
      const ev = after.ev ?? {}
      tell(ch.by, { t: ev.t ?? 'set', beam: ev.beam, Z: want.Z, N: want.N })
      replay(after, want)
    } else {
      if (ch.list.length) lastBy = ch.list.at(-1).by
      playCounts(ch.list)
      conform(want, { live: true })
    }
  }

    // a nucleus that cannot last decays by itself once the player stops building (unless held)
  const autoWait = nuc => {
    if (held) return null
    if (nuc.kind === 'instant' || nuc.kind === 'neutrons') return 0.8
    if (nuc.kind === 'unknown' && nuc.side) return 0.8
    if (nuc.kind === 'radioactive' && nuc.t < 3) return 1 + nuc.t * 0.4
    return null
  }
  const tremble = nuc => {
    if (held) return 0.004
    if (nuc.kind === 'stable' || nuc.kind === 'empty') return 0
    if (nuc.kind === 'radioactive') return Math.min(0.08, Math.max(0.006, 0.0065 * (12 - Math.log10(nuc.t))))
    return 0.1
  }

  // ---- the camera ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 3
  controls.maxDistance = 40
  controls.maxPolarAngle = 1.52
  controls.target.set(0.6, LIFT - 0.2, 0)

  // taps on the 3D: the nucleus decays (when it can), the Atomling says hello
  const ray = new THREE.Raycaster()
  let down = null
  const onDown = e => {
    down = { x: e.clientX, y: e.clientY }
  }
  const onUp = e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) {
      down = null
      return
    }
    down = null
    const r = canvas.getBoundingClientRect()
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
    if (ling && ray.intersectObject(stage, true).length) {
      ling.poof?.()
      play('select')
    }
  }

  const tmp = new THREE.Matrix4()
  const v = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const one = new THREE.Vector3(1, 1, 1)
  const glowAt = new THREE.Matrix4()
  const scale = new THREE.Vector3()
  const tint = new THREE.Color()
  const up = new THREE.Vector3(0, 0.25, 0)
  const update = (dt, t) => {
    clock = t
    sky.userData.update(t)
    controls.update()
    const nuc = nuclide(Z, N)

    // decay on its own when it cannot last
    const wait = autoWait(nuc)
    // (in a room, by the one who changed it last; the others only if that one's word does not come)
    const lag = inRoom() && lastBy && lastBy !== me() ? LAG_S : 0
    if (wait != null && t - lastTouch > 1.6 + lag && t - lastChange > wait + lag) decayNow()
    if (ejectAt != null && t > ejectAt) {
      ejectAt = null
      if (E > Z && !(element(Z)?.ea > 0)) {
        E--
        shoot('electron', randomDir(), 6)
        play('part')
        changed({ byPlayer: false })
        record('e', -1)
      }
    }
    if (incoming && t >= incoming.at) {
      const { c, from, beam } = incoming
      incoming = null
      held = holdNow()
      lastTouch = t // what the beam made stays on show a moment before it decays
      transform({ mode: c.famous ? 'reaction' : 'fusion', Z: c.result.Z, N: c.result.N, emitted: c.out, fragment: c.fragment }, { reaction: true, from, beam, famous: c.famous })
      // (and on the room's atom: anything added while the shot flew)
      if (inRoom()) conform(atomOf(together), { live: true })
    }
    if (pendingLing && t >= pendingLing.at) {
      showAtomling(pendingLing.Z)
      pendingLing = null
    }

    // in a room: my changes go out (a few a second at most), the element the address asked for comes
    // once the room's atom is known, the lines of who did what fade
    if (due && t - sentAt > SHARE_S && room.active && worlds.mode === 'room') {
      due = false
      sentAt = t
      ctx.share('atom')
    }
    if (pendingTarget && (pendingTarget.wait -= dt) <= 0) {
      const z = pendingTarget.z
      pendingTarget = null
      // (an atom the others are building now stays; the room's left from before gives way)
      if (!racing && (untouched(together) || !peersHere().length)) goTo(z)
    }
    if (feed.length && t - feed[0].at > FEED_S) {
      feed = feed.filter(x => t - x.at <= FEED_S)
      report()
    }
    if (racing && raceDue && t - raceSentAt > RACE_S && race.s?.phase === 'racing') raceTell()

    // the nucleus: each nucleon glides to its place and trembles if the nucleus cannot last
    let amp = tremble(nuc)
    if (wait != null && t - lastTouch > 1.6) amp *= 1 + Math.min(2, (t - lastChange) / wait) * 0.8
    const counts = { p: 0, n: 0 }
    let g = 1
    for (const x of nucleons) {
      x.pos.lerp(x.target, 1 - Math.exp(-dt * 7))
      v.copy(x.pos)
      if (amp) v.add(new THREE.Vector3(Math.sin(t * 31 + x.seed), Math.sin(t * 27 + x.seed * 1.7), Math.sin(t * 35 + x.seed * 2.3)).multiplyScalar(amp))
      tmp.compose(v, q, one)
      im[x.kind].setMatrixAt(counts[x.kind]++, tmp)
      // someone else's, just come: a glow in their colour that fades into the particle
      if (x.tint) {
        const left = (x.until - t) / TINT_S
        if (left <= 0) x.tint = null
        else {
          glowAt.compose(v, q, scale.setScalar(0.8 + 0.35 * left))
          glows.setMatrixAt(g, glowAt)
          glows.setColorAt(g++, tint.copy(x.tint).multiplyScalar(0.7 * Math.min(1, left * 1.6)))
        }
      }
    }
    for (const k of ['p', 'n']) {
      im[k].count = counts[k]
      im[k].instanceMatrix.needsUpdate = true
    }
    glows.count = g
    glows.instanceMatrix.needsUpdate = true
    if (glows.instanceColor) glows.instanceColor.needsUpdate = true
    // their names, by the atom on their side, facing me
    for (const [by, tag] of names) {
      const left = tag.until - t
      tag.text.visible = left > 0
      if (left <= 0) continue
      const m = room.member(by)
      if (!m) {
        tag.until = 0
        continue
      }
      const from = remoteEntry(by, 'n', root)
      const centre = atom.getWorldPosition(v)
      tag.text.position.copy(centre).addScaledVector(from.sub(centre).normalize(), outerR() + 0.55).add(up)
      tag.text.quaternion.copy(camera.quaternion)
      tag.text.fillOpacity = Math.min(1, left / 0.5)
      tag.text.outlineOpacity = tag.text.fillOpacity
    }
    core.rotation.y = t * 0.22
    const R = nucleusR()
    halo.scale.setScalar(nucleons.length ? R * 1.7 : 0.001)
    flash = Math.max(0, flash - dt * 1.6)
    const unstable = nuc.kind !== 'stable' && nuc.kind !== 'empty'
    halo.material.color.set(unstable ? '#ffd166' : COLOR.p)
    halo.material.opacity = (unstable ? 0.1 + Math.sin(t * 9) * 0.04 : 0.07 + Math.sin(t * 2) * 0.02) + flash * 0.5

    // the electrons go round their shells
    let i = 0
    shells.forEach((count, k) => {
      const ring = rings[k]
      if (!ring) return
      for (let j = 0; j < count; j++) {
        const a = (j / count) * Math.PI * 2 + t * SPEEDS[Math.min(k, SPEEDS.length - 1)] + k
        v.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0).applyMatrix4(ring.m)
        if (eFly && eFly.index === i) {
          const f = Math.min(1, (t - eFly.start) / 0.55)
          if (f >= 1) eFly = null
          else v.lerpVectors(eFly.from, v, 1 - (1 - f) * (1 - f))
        }
        tmp.compose(v, q, one)
        eIM.setMatrixAt(i++, tmp)
      }
    })
    eIM.count = i
    eIM.instanceMatrix.needsUpdate = true

    // flyers
    for (let k = flyers.length - 1; k >= 0; k--) {
      const f = flyers[k]
      f.age += dt
      f.obj.position.addScaledVector(f.vel, dt)
      if (f.spin) f.obj.rotation.y += dt * f.spin
      if (f.streak) {
        f.obj.lookAt(f.obj.position.clone().add(f.vel))
        f.obj.scale.z = (f.obj.scale.x || 1) * 3
      }
      const fade = 1 - Math.max(0, (f.age - f.life * 0.6) / (f.life * 0.4))
      if (!f.streak) f.obj.scale.setScalar(Math.max(0.01, fade))
      if (f.age > f.life) {
        root.remove(f.obj)
        flyers.splice(k, 1)
      }
    }

    // the Atomling stands just outside the outer shell, a little toward the camera, facing it; beside a
    // big atom it grows, so it stays a character and not a speck
    const upright = camera.aspect < 1
    const big = upright ? 1 : Math.min(2.4, Math.max(1, outerR() / 2.2))
    // (on an upright phone there is no room beside the atom: it stands in front, lower right)
    const want = upright ? outerR() * 0.55 + 0.7 : Math.max(2.6, outerR() + 1.1 * big)
    stage.position.x += (want - stage.position.x) * (1 - Math.exp(-dt * 3))
    stage.position.z = upright ? outerR() + 1.2 * big : 1.1 * big
    stage.scale.setScalar(stage.scale.x + (big - stage.scale.x) * (1 - Math.exp(-dt * 3)))
    stage.rotation.y = Math.atan2(camera.position.x - stage.position.x, camera.position.z - stage.position.z)
    ling?.update(dt, t, { speed: 0 })

    // keep the atom and its Atomling big in the part of the screen the HUD leaves free (the view
    // offset centres the target there): far enough that both fit it, up and down and across
    const free = ctx.engine.freeShare()
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    const r = outerR() + 0.7
    const aimX = upright ? 0.2 : stage.position.x * 0.3
    const across = upright ? r : Math.max(r + aimX, stage.position.x + 0.8 * big - aimX)
    const dist = Math.max(6.4, 1.15 * Math.max(r / (tan * Math.max(0.35, free.h)), across / (tan * camera.aspect * Math.max(0.35, free.w))))
    controls.target.lerp(v.set(aimX, LIFT, upright ? outerR() * 0.3 : 0), 1 - Math.exp(-dt * 2))
    const d = camera.position.distanceTo(controls.target)
    if (d < dist * 0.8 || d > dist * 1.45) camera.position.sub(controls.target).setLength(d + (dist - d) * Math.min(1, dt * 2)).add(controls.target)
  }

  // ---- shared with the room (net/shared.js): the atom and the hold. My own alone: never sent, never
  // kept (the forge alone is as it always was) ----
  const shared = {
    atom: {
      get: () => canon(together),
      set(s, live) {
        const theirs = clean(s)
        if (!theirs) return
        // the world as built, untouched (a room joined or left here): just that
        if (untouched(theirs)) return follow(together, theirs, false)
        const merged = merge(together, theirs)
        // I have something they lack (we both changed it at once): mine goes out again, merged
        if (!covers(theirs, merged) && room.active) due = true
        follow(together, merged, live)
      },
    },
    hold: {
      get: () => ({ h: heldByPlayer, by: holdBy }),
      set(s, live) {
        const h = !!s.h
        holdBy = typeof s.by === 'string' ? s.by.slice(0, 24) : ''
        if (h === heldByPlayer) return
        heldByPlayer = h
        if (!racing && !incoming) held = h
        if (live) tell(holdBy, { t: 'hold', h })
        report()
      },
    },
  }

  // ---- a race (net/race.js): while it runs I build my own atom; then the room's comes back ----
  const onRace = s => {
    const mine = !!s && !!room.me && s.order.includes(room.me.id) && (s.phase === 'racing' || s.phase === 'over')
    if (mine && (!racing || s.id !== raceId)) startRacing(s)
    else if (!mine && racing) stopRacing()
    else report()
  }
  const startRacing = s => {
    racing = true
    raceId = s.id
    raceGoal = s.goal
    raceDone = false
    raceHeld = false
    held = false
    incoming = null
    ejectAt = null
    chainOrigin = null
    lastEvent = null
    // everyone starts from nothing
    place(0, 0, 0, { quiet: true, how: { byPlayer: false } })
    play('select')
    raceDue = true
  }
  const stopRacing = () => {
    racing = false
    raceId = null
    raceGoal = null
    incoming = null
    ejectAt = null
    chainOrigin = null
    lastEvent = null
    held = heldByPlayer
    const want = atomOf(together)
    place(want.Z, want.N, want.E, { how: { byPlayer: false, missions: false } })
  }
  let offRace = null
  let offMembers = null

  const attach = () => {
    // from the front, a little above: the shells show as open rings
    controls.target.set(0.8, LIFT + 0.5, 0)
    camera.position.set(1.6, LIFT + 3.4, 6.2)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    race.bind(store)
    offRace = race.watch(onRace)
    // who is here changes the HUD's line of who builds with me
    offMembers = room.on('members', () => report())
    const start = target?.z && element(target.z)
    // in a room, the room's atom first: the element asked for comes once it is known (net/shared.js
    // brings it from the room's store and from those here)
    if (start && room.active) pendingTarget = { z: start.z, wait: 1.5 }
    if (start && !room.active) goTo(start.z)
    else changed({ byPlayer: false })
    // a race on already? (whoever runs it answers)
    race.hello()
    onRace(race.s)
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    controls.dispose()
    // leaving the forge leaves the race
    if (race.s?.order.includes(room.me?.id)) race.do({ t: 'leave' })
    offRace?.()
    offMembers?.()
    for (const tag of names.values()) {
      root.remove(tag.text)
      tag.text.dispose()
    }
    names.clear()
    store.set({ forge: null, forgeCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#090620'), exposure: 1.05, envIntensity: 0.55, bloom: { strength: 0.6, radius: 0.45, threshold: 0.78 }, fov: 50 },
    attach,
    refresh: () => report(),
    detach,
    update,
    add,
    remove,
    set,
    goTo,
    neutral,
    commonest,
    clear,
    setHeld,
    decay: decayNow,
    fire: beam => fire(beam),
    shared,
    // what the shared probe uses, one by one (an orbit world: no walking; tools/shared_steps/forge.json
    // has the rest)
    interactables: [
      { id: 'proton', onUse: () => add('p') },
      { id: 'neutron', onUse: () => add('n') },
      { id: 'electron', onUse: () => add('e') },
      { id: 'hold', onUse: () => setHeld(!heldByPlayer) },
    ],
    /** For the probes: the nucleons' kinds and where they are; the atom on the table, the room's, and
     *  whether I race; how many of the particles on show glow in someone else's colour. */
    nucleons: () => nucleons.map(x => ({ kind: x.kind, pos: x.pos.toArray(), target: x.target.toArray() })),
    table: () => ({ Z, N, E, room: atomOf(together), racing, glowing: nucleons.filter(x => x.tint).length }),
    retarget: t => {
      if (t?.z && element(t.z)) goTo(t.z)
    },
    dispose() {},
  }
}
