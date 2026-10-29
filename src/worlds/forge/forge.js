// The Atom Forge (/forge, /forge?z=Fe): build an atom from protons, neutrons and electrons. The protons
// make the element (its Atomling pops up beside the atom), the neutrons its isotope, the electrons its
// charge. The chart of nuclides (chem/nucleus.js) says whether the nucleus holds together; an unstable
// one trembles and decays before your eyes (alpha, beta, fission...), down whole decay chains.
// Words: words.js; the HUD: ui/ForgeHud.jsx; the plan: docs/knowledge/atom-forge.md.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { element } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { nightSky } from '../common/sky.js'
import { packBall } from '../common/pack.js'
import { loadChart, nuclide, decay, commonestN, ionShells, modeFamily, collide, BEAMS } from '../../chem/nucleus.js'
import { markFound, isFound } from '../../engine/progress.js'
import { track } from '../../net/telemetry.js'
import { play, ambience } from '../../audio/sound.js'
import { MISSIONS } from './words.js'

const LIFT = 2.8 // the atom's centre above the floor
const NR = 0.17 // a nucleon's radius, in metres
const CAP = { p: 118, n: 180 }
const COLOR = { p: '#ff5a55', n: '#b9c6dc', e: '#a8ecff', positron: '#ffb3e6', neutrino: '#fff3c4' }
const SPEEDS = [1.3, 0.95, 0.75, 0.62, 0.53, 0.47, 0.42]

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

  // where a particle enters: from the HUD's buttons, on the left of the screen (or at the bottom of an
  // upright phone)
  const ENTRY = { p: [0.32, -0.66], n: [0.04, 0], e: [-0.24, 0.66] }
  const entry = (kind, into) => {
    const [y, x] = ENTRY[kind]
    const v = (camera.aspect < 1 ? new THREE.Vector3(x, -1.05, 0.5) : new THREE.Vector3(-1.05, y, 0.5)).unproject(camera)
    const dir = v.sub(camera.position).normalize()
    const p = camera.position.clone().addScaledVector(dir, camera.position.distanceTo(atom.getWorldPosition(new THREE.Vector3())) * 0.8)
    return into.worldToLocal(p)
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

  const addNucleon = (kind, from) => {
    nucleons.push({ kind, pos: from ? from.clone() : new THREE.Vector3(), target: new THREE.Vector3(), seed: Math.random() * 100 })
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
        Z, N, E, held: heldByPlayer, note,
        event: lastEvent,
        canDecay: !!decay(Z, N),
        done: MISSIONS.filter(m => isFound(`forge:${m.id}`)).map(m => m.id),
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

  const changed = ({ byPlayer = true, ev = null } = {}) => {
    if (byPlayer) {
      lastTouch = clock
      chainOrigin = null
      lastEvent = null
    }
    lastChange = clock
    relayout()
    shells = syncShells()
    if (byPlayer) showAtomling(Z)
    checkMissions(ev)
    report()
  }

  // ---- what the HUD (and the probes) do ----
  const add = kind => {
    note = null
    track('forge', { op: 'add', k: kind, z: Z, n: N, e: E })
    if (kind === 'p') {
      if (Z >= CAP.p) return
      Z++
      addNucleon('p', entry('p', core))
      play('proton')
    } else if (kind === 'n') {
      if (N >= CAP.n) return
      N++
      addNucleon('n', entry('n', core))
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
      eFly = { index: E - 1, from: entry('e', atom), start: clock }
      if (E > Z && !(element(Z).ea > 0)) {
        note = 'noExtra'
        ejectAt = clock + 1.1
      } else if (E - Z >= 2) note = 'crystalOnly'
      play('electron')
    }
    changed()
  }
  const remove = kind => {
    note = null
    track('forge', { op: 'remove', k: kind, z: Z, n: N, e: E })
    const out = new THREE.Vector3(-1, 0.3, 0.4).normalize()
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
    changed()
  }
  /** Set the whole atom at once (the chart, the element finder, the missions' "show me"). */
  const set = (z, n, e = z) => {
    note = null
    Z = Math.max(0, Math.min(CAP.p, z))
    N = Math.max(0, Math.min(CAP.n, n))
    E = Z === 0 ? 0 : Math.max(0, Math.min(Z + 3, e))
    nucleons.length = 0
    for (let i = 0; i < Z; i++) addNucleon('p', null)
    for (let i = 0; i < N; i++) addNucleon('n', null)
    nucleons.sort(() => Math.random() - 0.5)
    flash = 0.6
    play('select')
    changed()
    // spread out from the middle
    for (const x of nucleons) x.pos.copy(x.target).multiplyScalar(0.15)
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
  }
  const commonest = () => {
    if (Z === 0) return
    set(Z, commonestN(Z), E)
  }
  const clear = () => set(0, 0, 0)
  let heldByPlayer = false
  const setHeld = h => {
    held = h
    heldByPlayer = h
    report()
  }

  // flying things: lost nucleons, decay products
  const launch = (list, dir, speed, together = false) => {
    if (!list.length) return
    const group = new THREE.Group()
    const centre = new THREE.Vector3()
    for (const x of list) centre.add(core.localToWorld(x.pos.clone()))
    centre.multiplyScalar(1 / list.length)
    group.position.copy(centre)
    for (const x of list) {
      const m = new THREE.Mesh(nGeo, mat[x.kind])
      m.position.copy(core.localToWorld(x.pos.clone()).sub(centre))
      if (together) m.position.multiplyScalar(0.75)
      group.add(m)
    }
    root.add(group)
    flyers.push({ obj: group, vel: dir.clone().multiplyScalar(speed), age: 0, life: 2.2, spin: together ? 3 : 0 })
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

  /** One decay, by the nucleus's strongest mode. */
  const decayNow = () => {
    const d = decay(Z, N)
    return d ? transform(d) : false
  }

  // ---- the beam: a nucleus fired at the one on the table ----
  let incoming = null // { c: collide's answer, from, beam, at }
  const fire = beam => {
    if (incoming || !BEAMS[beam]) return
    track('forge', { op: 'fire', beam, z: Z, n: N })
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
    const charge = Z - E
    // its nucleons fly in from the left together; on arrival they are the compound nucleus
    const start = entry('n', core)
    const spread = NR * Math.cbrt(bz + bn) * 1.2
    for (let i = 0; i < bz + bn; i++) {
      const off = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(spread * 2)
      addNucleon(i < bz ? 'p' : 'n', start.clone().add(off))
    }
    Z += bz
    N += bn
    // the atom keeps the charge it had (a neutral target stays neutral); a beam particle fired at an
    // empty table is a bare nucleus
    E = Z === bz && N === bn ? 0 : Math.max(0, Math.min(Z + 3, Z - charge))
    incoming = { c, from, beam, at: clock + 0.8 }
    held = true // the compound waits for the beam to arrive
    play('beam')
    lastTouch = clock
    changed({ byPlayer: false })
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
  const update = (dt, t) => {
    clock = t
    sky.userData.update(t)
    controls.update()
    const nuc = nuclide(Z, N)

    // decay on its own when it cannot last
    const wait = autoWait(nuc)
    if (wait != null && t - lastTouch > 1.6 && t - lastChange > wait) decayNow()
    if (ejectAt != null && t > ejectAt) {
      ejectAt = null
      if (E > Z && !(element(Z)?.ea > 0)) {
        E--
        shoot('electron', randomDir(), 6)
        play('part')
        changed({ byPlayer: false })
      }
    }
    if (incoming && t >= incoming.at) {
      const { c, from, beam } = incoming
      incoming = null
      held = heldByPlayer
      lastTouch = t // what the beam made stays on show a moment before it decays
      transform({ mode: c.famous ? 'reaction' : 'fusion', Z: c.result.Z, N: c.result.N, emitted: c.out, fragment: c.fragment }, { reaction: true, from, beam, famous: c.famous })
    }
    if (pendingLing && t >= pendingLing.at) {
      showAtomling(pendingLing.Z)
      pendingLing = null
    }

    // the nucleus: each nucleon glides to its place and trembles if the nucleus cannot last
    let amp = tremble(nuc)
    if (wait != null && t - lastTouch > 1.6) amp *= 1 + Math.min(2, (t - lastChange) / wait) * 0.8
    const counts = { p: 0, n: 0 }
    for (const x of nucleons) {
      x.pos.lerp(x.target, 1 - Math.exp(-dt * 7))
      v.copy(x.pos)
      if (amp) v.add(new THREE.Vector3(Math.sin(t * 31 + x.seed), Math.sin(t * 27 + x.seed * 1.7), Math.sin(t * 35 + x.seed * 2.3)).multiplyScalar(amp))
      tmp.compose(v, q, one)
      im[x.kind].setMatrixAt(counts[x.kind]++, tmp)
    }
    for (const k of ['p', 'n']) {
      im[k].count = counts[k]
      im[k].instanceMatrix.needsUpdate = true
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

  const attach = () => {
    // from the front, a little above: the shells show as open rings
    controls.target.set(0.8, LIFT + 0.5, 0)
    camera.position.set(1.6, LIFT + 3.4, 6.2)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    const start = target?.z && element(target.z)
    if (start) goTo(start.z)
    else changed({ byPlayer: false })
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    controls.dispose()
    store.set({ forge: null, forgeCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#090620'), exposure: 1.05, envIntensity: 0.55, bloom: { strength: 0.6, radius: 0.45, threshold: 0.78 }, fov: 50 },
    attach,
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
    fire,
    /** For the probes: the nucleons' kinds and where they are. */
    nucleons: () => nucleons.map(x => ({ kind: x.kind, pos: x.pos.toArray(), target: x.target.toArray() })),
    retarget: t => {
      if (t?.z && element(t.z)) goTo(t.z)
    },
    dispose() {},
  }
}
