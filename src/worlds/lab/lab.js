// The Molecule Lab: Atomlings join hands to make molecules. Pick atoms from the palette (the HUD),
// tap two atoms to join a hand of each (again for a double bond, again for a triple), tap a bond to
// let one hand go. The molecule takes its real shape by itself (chem/layout.js); when every hand is
// held it is complete, and a molecule the lab knows is named (chem/build.js), with a fact, and kept
// in the player's collection. The seed of the molecule games (docs/design.md).
// A metal joined to a non-metal hands its electrons over (one flies across): the two become ions, held by
// a glowing thread of attraction instead of hands, their charges floating above them (salt, NaCl).
// Together (docs/knowledge/multiplayer.md): everyone in my room who is in the lab builds the same
// molecule. Its atoms have ids that stay put while it changes; each player picks atoms for themselves
// (a ring in their colour shows what each has picked), and every change is an operation (add, join,
// part, remove, clear, demo) applied by one of them, the host (the one in the lab longest), who sends
// the molecule to the others. Each molecule sent carries a version that counts up across the room;
// everyone takes any newer one, whoever sent it, so a change of host (someone arriving or leaving at
// the same moment) cannot leave anyone behind: a new host first asks for the latest molecule, and an
// old one's late copy is simply older. Alone, I am my own host.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { element, nameOf } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { join, unjoin, removeAtom, freeHands, formulaOf, complete, recognise, MISSIONS, lonePairs, ionicBond, ionCharges, isMetal } from '../../chem/build.js'
import { makeText } from '../../engine/text.js'
import { relax, level } from '../../chem/layout.js'
import { nightSky } from '../common/sky.js'
import { markFound, isFound } from '../../engine/progress.js'
import { MOLECULE_FACTS } from '../../content/molecules.js'
import { pick } from '../../content/stations.js'
import { play, ambience } from '../../audio/sound.js'
import { room } from '../../net/room.js'
import { track } from '../../net/telemetry.js'

const BOND = 2.3 // metres between bonded Atomlings' centres
const LIFT = 1.9 // the molecule floats this high over the table
const SCALE = 1 // Atomlings at the table, at their own size (the point is to see them hold hands)

export async function build(ctx) {
  const { camera, canvas, store, light } = ctx
  const lang = ctx.lang()
  const root = new THREE.Group()
  root.name = 'lab'

  // the room: a round table of light under the stars
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
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
  const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshBasicMaterial({ color: '#2b4a9c', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }))
  glowDisc.rotation.x = -Math.PI / 2
  glowDisc.position.y = 0.51
  root.add(glowDisc)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 1.3))
  const key = new THREE.DirectionalLight('#fff4e6', 1.6)
  key.position.set(4, 9, 6)
  root.add(key)

  const molGroup = new THREE.Group()
  molGroup.position.y = LIFT
  root.add(molGroup)

  // ---- state ----
  // the molecule: atoms { el, id } and bonds [i, j, order]; an atom's id stays the same while the
  // molecule changes, so the players of a shared lab can name the atoms they mean
  let mol = { atoms: [], bonds: [] }
  let lay = { pos: [], extra: [] }
  let shown = [] // per atom: { atom, a, holder, cur: Vector3 }
  let selId = null // the atom I have picked (each player picks their own)
  const sel = () => (selId == null ? -1 : mol.atoms.findIndex(at => at.id === selId))
  const idOf = i => mol.atoms[i]?.id ?? null
  const me = () => room.me?.id ?? 'solo'
  let seq = 0
  const newId = () => `${me()}.${(++seq).toString(36)}`
  let bondMeshes = [] // { bond index, k, armA, armB, clasp }
  let freeMeshes = [] // per atom: [{ arm, hand, kind }]
  const handGeo = new THREE.SphereGeometry(0.13, 16, 12)
  const armGeo = new THREE.CapsuleGeometry(0.065, 1, 4, 10)
  const claspMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#a8ecff', emissiveIntensity: 0.9 })
  const loneMat = new THREE.MeshStandardMaterial({ color: '#a8ecff', emissive: '#a8ecff', emissiveIntensity: 1.2, transparent: true, opacity: 0.8 })
  // an ionic bond: a thread of attraction; the electron that went over; the ions' charges
  const ionMat = new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
  const flyMat = new THREE.MeshStandardMaterial({ color: '#a8ecff', emissive: '#a8ecff', emissiveIntensity: 2.4 })
  let transfers = [] // { from: atom, to: atom, start, mesh }
  let clock = 0
  let note = null
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.035, 8, 48), new THREE.MeshBasicMaterial({ color: '#ffd166' }))
  ring.visible = false
  molGroup.add(ring)
  const otherRings = []

  const relayout = steps => {
    lay = relax(mol, lay, { steps, bond: BOND })
  }

  // the Atomlings: one per atom, kept across changes (a new atom pops in)
  const syncAtoms = () => {
    const next = mol.atoms.map((at, i) => {
      const old = shown.find(s => s.atom.id === at.id)
      if (old) {
        old.atom = at
        return old
      }
      const a = createAtomling(element(at.el), { light, arms: false, hoop: false })
      const holder = new THREE.Group()
      holder.scale.setScalar(SCALE)
      holder.add(a.root)
      a.poof()
      molGroup.add(holder)
      const p = lay.pos[i] ?? [0, 0, 0]
      return { atom: at, a, holder, cur: new THREE.Vector3(...p) }
    })
    for (const s of shown) {
      if (!next.includes(s)) {
        molGroup.remove(s.holder)
        s.holder.traverse(o => o.isMesh && o.geometry?.dispose())
        if (s.charge) {
          molGroup.remove(s.charge)
          s.charge.dispose()
        }
      }
    }
    shown = next
    // the ions' charges, above their heads
    const q = ionCharges(mol)
    shown.forEach((s, i) => {
      const text = q[i] > 0 ? `${q[i] > 1 ? q[i] : ''}+` : q[i] < 0 ? `${q[i] < -1 ? -q[i] : ''}−` : ''
      if (text && !s.charge) {
        s.charge = makeText(text, { size: 0.34, color: q[i] > 0 ? '#ffb86b' : '#8fd8ff', outlineWidth: 0.02, outlineColor: '#0b0f24' })
        molGroup.add(s.charge)
      }
      if (s.charge) {
        s.charge.visible = !!text
        if (text && s.charge.text !== text) {
          s.charge.text = text
          s.charge.color = q[i] > 0 ? '#ffb86b' : '#8fd8ff'
          s.charge.sync()
        }
      }
    })
  }

  // bonds as held hands: an arm from each atom, meeting at a glowing clasp; free hands reach out
  const syncBonds = () => {
    for (const b of bondMeshes) for (const m of [b.armA, b.armB, b.clasp, b.link]) m && molGroup.remove(m)
    for (const list of freeMeshes) for (const f of list) for (const m of [f.arm, f.hand]) m && molGroup.remove(m)
    bondMeshes = []
    mol.bonds.forEach((bond, bi) => {
      const [i, j, order] = bond
      if (ionicBond(mol, bond)) {
        const link = new THREE.Mesh(armGeo, ionMat)
        link.userData.bond = bi
        molGroup.add(link)
        bondMeshes.push({ bi, i, j, k: 0, order, ionic: true, link })
        return
      }
      for (let k = 0; k < order; k++) {
        const armA = new THREE.Mesh(armGeo, shown[i].a.mats.hand)
        const armB = new THREE.Mesh(armGeo, shown[j].a.mats.hand)
        const clasp = new THREE.Mesh(handGeo, claspMat)
        for (const m of [armA, armB, clasp]) {
          m.userData.bond = bi
          molGroup.add(m)
        }
        bondMeshes.push({ bi, i, j, k, order, armA, armB, clasp })
      }
    })
    freeMeshes = mol.atoms.map((_, i) => (lay.extra[i] ?? []).map(e => {
      if (e.kind === 'lone') {
        const dots = new THREE.Group()
        for (const s of [-1, 1]) {
          const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), loneMat)
          d.position.x = s * 0.07
          dots.add(d)
        }
        molGroup.add(dots)
        return { kind: 'lone', hand: dots }
      }
      const arm = new THREE.Mesh(armGeo, shown[i].a.mats.hand)
      const hand = new THREE.Mesh(handGeo, shown[i].a.mats.hand)
      molGroup.add(arm, hand)
      return { kind: 'free', arm, hand }
    }))
  }

  const placeArm = (m, from, to, r = 0.055) => {
    const d = to.clone().sub(from)
    const len = Math.max(0.01, d.length() - r * 2)
    m.position.copy(from).add(to).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    m.scale.set(1, len, 1)
  }

  const bodyR = i => shown[i].a.body.radius * SCALE * 0.95

  // what the HUD shows
  const report = () => {
    const known = recognise(mol)
    const done = complete(mol)
    const free = mol.atoms.reduce((s, _, i) => s + Math.max(0, freeHands(mol, i)), 0)
    const facts = known ? MOLECULE_FACTS[known.show] : null
    const missions = MISSIONS.map(k => ({ show: k.show, name: k.name[lang] ?? k.name.en, done: isFound(`lab:${k.show}`) }))
    store.set({
      lab: {
        count: mol.atoms.length,
        formula: known?.show ?? formulaOf(mol),
        name: known ? known.name[lang] ?? known.name.en : null,
        complete: done,
        ionic: !!known?.ionic,
        note,
        free,
        pieces: mol.atoms.length > 1 && !mol.bonds.length ? 'apart' : null,
        selected: sel() >= 0 ? mol.atoms[sel()].el : null,
        together: peers().filter(m => m.id !== room.me?.id).map(m => ({ name: m.name, color: m.color })),
        fact: facts ? pick(facts, lang, ctx.level()) : null,
        missions,
      },
    })
    if (known && (done || known.charged) && markFound(`lab:${known.show}`)) {
      track('lab', { op: 'made', show: known.show, together: peers().length > 1 || undefined })
      play('celebrate')
      store.set({ labCelebrate: { show: known.show, name: known.name[lang] ?? known.name.en, at: performance.now() } })
      report()
    }
  }

  const changed = (steps = 160) => {
    syncAtoms()
    relayout(steps)
    // a long molecule (or a row of ions) lies level, across the view, not up and down into the table
    lay = level(lay)
    syncBonds()
    report()
  }

  // ---- what the HUD (and taps) do ----
  // when a metal joins a non-metal, its electron flies over to it (one per hand)
  const watch = (before, after) => {
    for (const bond of after.bonds) {
      if (!ionicBond(after, bond)) continue
      const [a, b, o] = bond
      const idA = after.atoms[a].id
      const idB = after.atoms[b].id
      const old = before.bonds.find(([x, y]) => {
        const ix = before.atoms[x]?.id
        const iy = before.atoms[y]?.id
        return (ix === idA && iy === idB) || (ix === idB && iy === idA)
      })
      if (old && old[2] >= o) continue
      const [m, x] = isMetal(after.atoms[a].el) ? [a, b] : [b, a]
      const mesh = new THREE.Mesh(handGeo, flyMat)
      molGroup.add(mesh)
      transfers.push({ from: after.atoms[m].id, to: after.atoms[x].id, start: clock, mesh })
      play('electron')
    }
  }

  /** An operation on the molecule, by player `by` (the host applies everyone's): the next molecule,
   *  what to tell the one who did it (note), the atom they now have picked (pick), the sound. */
  const apply = (op, by) => {
    const at = id => mol.atoms.findIndex(a => a.id === id)
    if (op.t === 'add') {
      const atoms = [...mol.atoms, { el: op.el, id: op.id }]
      let next = { atoms, bonds: mol.bonds }
      const i = atoms.length - 1
      const to = op.to != null ? at(op.to) : -1
      let note = null
      // joined at once to the picked atom when both have a free hand
      if (to >= 0) {
        const joined = join(next, to, i)
        if (joined) next = joined
        else if (isMetal(op.el) && isMetal(mol.atoms[to].el)) note = 'metals'
      }
      const pick = to < 0 || freeHands(next, to) === 0 ? op.id : op.to
      return { next, note, pick, fx: { sound: next.bonds.length > mol.bonds.length ? 'join' : 'tap' } }
    }
    if (op.t === 'join') {
      const a = at(op.a)
      const b = at(op.b)
      if (a < 0 || b < 0) return null
      const next = join(mol, a, b)
      if (!next) return { next: mol, note: isMetal(mol.atoms[a].el) && isMetal(mol.atoms[b].el) ? 'metals' : null, pick: op.b }
      const k = next.bonds.find(([x, y]) => (x === a && y === b) || (x === b && y === a))
      const pick = freeHands(next, b) > 0 ? op.b : freeHands(next, a) > 0 ? op.a : null
      return { next, note: null, pick, fx: { sound: 'join', order: k?.[2] ?? 1, steps: 120 } }
    }
    if (op.t === 'part') {
      const a = at(op.a)
      const b = at(op.b)
      const bi = mol.bonds.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a))
      if (bi < 0) return null
      const [i, j, order] = mol.bonds[bi]
      const next = order > 1 ? { atoms: mol.atoms, bonds: mol.bonds.map((bd, k) => (k === bi ? [i, j, order - 1] : bd)) } : unjoin(mol, i, j)
      return { next, fx: { sound: 'part', steps: 120 } }
    }
    if (op.t === 'remove') {
      const a = at(op.a)
      if (a < 0) return null
      return { next: removeAtom(mol, a), pick: null, fx: { steps: 120 } }
    }
    if (op.t === 'clear') return { next: { atoms: [], bonds: [] }, pick: null, fx: { steps: 1 } }
    if (op.t === 'demo') {
      const plan = DEMOS[op.show]
      if (!plan) return null
      let next = { atoms: plan.atoms.map((el, k) => ({ el, id: `${op.id}.${k}` })), bonds: [] }
      for (const [i, j] of plan.pairs) next = join(next, i, j) ?? next
      return { next, pick: null, fresh: true, fx: { steps: 500 } }
    }
    return null
  }

  /** Take a new molecule: keep each atom where it was (atoms matched by id), fly the electrons over,
   *  play the change's sound. */
  const commit = (next, fx = {}, fresh = false) => {
    const before = fresh ? { atoms: [], bonds: [] } : mol
    if (fresh) {
      for (const s of shown) molGroup.remove(s.holder)
      shown = []
      lay = { pos: [], extra: [] }
    } else {
      const was = new Map(mol.atoms.map((a, k) => [a.id, k]))
      lay = {
        pos: next.atoms.map(a => (was.has(a.id) ? lay.pos[was.get(a.id)] : undefined)),
        extra: next.atoms.map(a => (was.has(a.id) ? lay.extra[was.get(a.id)] : undefined)),
      }
    }
    watch(before, next)
    mol = next
    if (sel() < 0) selId = null
    if (fx.sound) play(fx.sound, fx.order ? { order: fx.order } : undefined)
    changed(fx.steps ?? 160)
  }

  // ---- together: the room's lab ----
  let version = 0 // the newest molecule's version seen in this room
  let from = null // who sent it
  let wasHost = null
  const here = '/lab'
  const peers = () => (room.active ? room.members.filter(m => m.path === here) : [])
  const host = () => {
    const list = peers()
    if (!room.active || !list.some(m => m.id === room.me?.id)) return room.me?.id ?? 'solo'
    return [...list].sort((a, b) => (a.since ?? 0) - (b.since ?? 0) || (a.id < b.id ? -1 : 1))[0].id
  }
  const hosting = () => !room.active || peers().length < 2 || host() === room.me?.id
  const publish = extra => {
    if (!room.active || peers().length < 2) return
    version += 1
    from = room.me?.id
    room.send('lab-state', { v: version, mol, ...extra })
  }
  const offs = []
  const listen = () => {
    offs.push(
      room.on('lab-op', p => {
        room.note(`lab-op ${p.op?.t} from ${p.from}${hosting() ? '' : ' (not host)'}`)
        if (!hosting()) return
        const r = apply(p.op, p.from)
        if (!r) return
        commit(r.next, r.fx, r.fresh)
        publish({ by: p.from, pick: r.pick, note: r.note ?? null, fx: r.fx, fresh: r.fresh })
      }),
      room.on('lab-state', p => {
        room.note(`lab-state v${p.v} from ${p.from} (have v${version})`)
        // a newer molecule, from whoever sent it (two at the same version: the host's)
        if (p.v < version || (p.v === version && (p.from === from || p.from !== host()))) return
        version = p.v
        from = p.from
        commit(p.mol, p.fx ?? {}, !!p.fresh)
        if (p.by === room.me?.id) {
          note = p.note ?? null
          if (p.pick !== undefined) selId = p.pick
          room.update({ labSel: selId })
        }
        report()
      }),
      // someone asks for the molecule: everyone who has one answers (the newest wins)
      room.on('lab-hello', () => {
        if (version > 0 || mol.atoms.length) room.send('lab-state', { v: version, mol })
      }),
      room.on('members', () => {
        const count = peers().length
        // someone came in: the host shows them the molecule
        if (count > lastCount && hosting()) publish({})
        lastCount = count
        // I have just become the host (the last one left): ask for the newest molecule first
        const h = host()
        if (h !== wasHost && h === room.me?.id && count > 1) room.send('lab-hello')
        wasHost = h
        report()
      }),
    )
  }
  let lastCount = 0

  /** Do an operation: alone or hosting, at once (and send the result); else ask the host. */
  const act = op => {
    track('lab', { op: op.t, el: op.el, show: op.show, together: peers().length > 1 || undefined })
    note = null
    if (!hosting()) {
      room.note(`send lab-op ${op.t} to ${host()}`)
      room.send('lab-op', { op })
      return
    }
    const r = apply(op, me())
    if (!r) return
    commit(r.next, r.fx, r.fresh)
    note = r.note ?? null
    if (r.pick !== undefined) selId = r.pick
    room.update({ labSel: selId })
    publish({ by: me(), pick: r.pick, note: r.note ?? null, fx: r.fx, fresh: r.fresh })
    report()
  }

  const pickAtom = id => {
    selId = id
    room.update({ labSel: selId })
    report()
  }

  const add = sym => act({ t: 'add', el: sym, id: newId(), to: selId })
  const tapAtom = i => {
    note = null
    const s = sel()
    if (s < 0 || s === i) return pickAtom(s === i ? null : idOf(i))
    act({ t: 'join', a: idOf(s), b: idOf(i) })
  }
  const tapBond = bi => {
    const [i, j] = mol.bonds[bi]
    act({ t: 'part', a: idOf(i), b: idOf(j) })
  }
  const removeSelected = () => {
    if (sel() < 0) return
    act({ t: 'remove', a: selId })
  }
  const clear = () => act({ t: 'clear' })
  /** Build a known molecule at once (a mission's "show me"), for the curious and for the probes. */
  const demo = show => act({ t: 'demo', show, id: newId() })

  // ---- picking and the camera ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 3
  controls.maxDistance = 30
  controls.maxPolarAngle = 1.5
  controls.target.set(0, LIFT, 0)
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
    const targets = [...shown.map(s => s.holder), ...bondMeshes.flatMap(b => [b.armA, b.armB, b.clasp, b.link].filter(Boolean))]
    const hit = ray.intersectObjects(targets, true)[0]
    if (!hit) {
      pickAtom(null)
      return
    }
    if (hit.object.userData.bond != null) {
      tapBond(hit.object.userData.bond)
      return
    }
    const i = shown.findIndex(s => {
      let o = hit.object
      while (o && o !== s.holder) o = o.parent
      return !!o
    })
    if (i >= 0) tapAtom(i)
  }

  const v = new THREE.Vector3()
  const update = (dt, t) => {
    clock = t
    sky.userData.update(t)
    controls.update()
    // keep relaxing gently: the molecule settles and breathes
    if (mol.atoms.length) relayout(3)
    let radius = 1
    shown.forEach((s, i) => {
      const p = lay.pos[i]
      if (!p) return
      s.cur.lerp(v.set(p[0], p[1], p[2]), 1 - Math.exp(-dt * 6))
      radius = Math.max(radius, s.cur.length() + 1)
      const H = s.a.body.height
      s.holder.position.set(s.cur.x, s.cur.y - (H * 0.5 + s.a.body.hover) * SCALE, s.cur.z)
      s.holder.rotation.y = Math.atan2(camera.position.x - s.cur.x, camera.position.z - s.cur.z)
      s.a.update(dt, t, { speed: 0 })
      if (s.charge?.visible) {
        // (above anything the Atomling wears on its head: sodium's salt cellar)
        s.charge.position.set(s.cur.x, s.cur.y + H * 0.5 * SCALE + 0.55, s.cur.z)
        s.charge.quaternion.copy(camera.quaternion)
      }
    })
    // electrons on their way from a metal to its partner
    transfers = transfers.filter(tr => {
      const f = (t - tr.start) / 0.7
      const a = shown.find(s => s.atom.id === tr.from)?.cur
      const b = shown.find(s => s.atom.id === tr.to)?.cur
      if (f >= 1 || !a || !b) {
        molGroup.remove(tr.mesh)
        return false
      }
      const e = f * f * (3 - 2 * f)
      tr.mesh.position.lerpVectors(a, b, e)
      tr.mesh.position.y += Math.sin(f * Math.PI) * 0.6
      tr.mesh.scale.setScalar(1.2 - f * 0.4)
      return true
    })
    for (const b of bondMeshes) {
      const A = shown[b.i]?.cur
      const B = shown[b.j]?.cur
      if (!A || !B) continue
      if (b.ionic) {
        // the attraction: a glowing thread between the two ions, thicker for higher charges
        const dir = B.clone().sub(A).normalize()
        placeArm(b.link, A.clone().addScaledVector(dir, bodyR(b.i) * 0.8), B.clone().addScaledVector(dir, -bodyR(b.j) * 0.8))
        const w = (0.9 + b.order * 0.35) * (1 + Math.sin(t * 4 + b.bi) * 0.15)
        b.link.scale.x = w
        b.link.scale.z = w
        continue
      }
      const dir = B.clone().sub(A).normalize()
      let side = new THREE.Vector3().crossVectors(dir, camera.position.clone().sub(A).normalize())
      if (side.lengthSq() < 1e-6) side = new THREE.Vector3(0, 1, 0)
      side.normalize()
      const off = (b.k - (b.order - 1) / 2) * 0.22
      const mid = A.clone().add(B).multiplyScalar(0.5).addScaledVector(side, off)
      const a0 = A.clone().addScaledVector(dir, bodyR(b.i)).addScaledVector(side, off)
      const b0 = B.clone().addScaledVector(dir, -bodyR(b.j)).addScaledVector(side, off)
      placeArm(b.armA, a0, mid)
      placeArm(b.armB, b0, mid)
      b.clasp.position.copy(mid)
      b.clasp.scale.setScalar(1 + Math.sin(t * 3 + b.bi) * 0.08)
    }
    freeMeshes.forEach((list, i) => {
      const A = shown[i]?.cur
      if (!A) return
      list.forEach((f, k) => {
        const e = lay.extra[i]?.[k]
        if (!e) return
        const dir = v.set(e.dir[0], e.dir[1], e.dir[2]).normalize().clone()
        const start = A.clone().addScaledVector(dir, bodyR(i))
        if (f.kind === 'lone') {
          f.hand.visible = ctx.level() === 'scientist'
          f.hand.position.copy(A).addScaledVector(dir, bodyR(i) + 0.18)
          f.hand.lookAt(camera.position)
          return
        }
        // a free hand reaches out, waving a little: it wants a friend
        const reach = 0.5 + Math.sin(t * 4 + i + k) * 0.05
        const end = start.clone().addScaledVector(dir, reach)
        placeArm(f.arm, start, end)
        f.hand.position.copy(end)
        f.hand.scale.setScalar(1 + Math.sin(t * 5 + k) * 0.12)
      })
    })
    const s = sel()
    if (s >= 0 && shown[s]) {
      ring.visible = true
      ring.material.color.set(room.active && peers().length > 1 ? room.member(room.me?.id)?.color ?? '#ffd166' : '#ffd166')
      ring.position.copy(shown[s].cur)
      ring.lookAt(camera.position)
      ring.scale.setScalar((bodyR(s) / 0.6) * (1 + Math.sin(t * 5) * 0.06))
    } else ring.visible = false
    // what each of the others has picked: a ring in their colour, a little wider than mine
    const picks = room.active ? peers().filter(m => m.id !== room.me?.id && m.labSel) : []
    while (otherRings.length < picks.length) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.03, 8, 48), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
      molGroup.add(r)
      otherRings.push(r)
    }
    otherRings.forEach((r, k) => {
      const m = picks[k]
      const i = m ? mol.atoms.findIndex(a => a.id === m.labSel) : -1
      r.visible = i >= 0 && !!shown[i]
      if (!r.visible) return
      r.material.color.set(m.color ?? '#ffffff')
      r.position.copy(shown[i].cur)
      r.lookAt(camera.position)
      r.scale.setScalar((bodyR(i) / 0.6) * (1.18 + k * 0.1))
    })
    // keep the whole molecule in view in the part of the screen the HUD leaves free (the view offset
    // centres it there), across too: an upright phone sees little from side to side, so the distance
    // also comes from the horizontal field of view
    const free = ctx.engine.freeShare()
    const tanAcross = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * free.w
    const want = Math.max(4.6, (radius * 2.3) / Math.max(0.5, free.h), (radius + 0.5) / tanAcross)
    const d = camera.position.distanceTo(controls.target)
    if (d < want * 0.8 || d > want * 1.6) camera.position.sub(controls.target).setLength(d + (want - d) * Math.min(1, dt * 2)).add(controls.target)
  }

  const attach = () => {
    camera.position.set(0, LIFT + 1.4, 5.2)
    controls.target.set(0, LIFT, 0)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    listen()
    // in a room where others may be building already: ask for their molecule
    if (room.active) room.send('lab-hello')
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    controls.dispose()
    offs.forEach(off => off())
    room.update({ labSel: null })
    store.set({ lab: null, labCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.6, bloom: { strength: 0.55, radius: 0.45, threshold: 0.8 }, fov: 50 },
    attach,
    refresh: () => report(),
    detach,
    update,
    add,
    removeSelected,
    clear,
    demo,
    lonePairsAt: i => lonePairs(mol, i),
    // for the probes (tools/room_probe.py): tap atom i, read the molecule
    tap: i => tapAtom(i),
    molecule: () => mol,
    together: () => ({ hosting: hosting(), host: host(), peers: peers().map(m => m.name), version }),
    dispose() {},
  }
}

// how to build each mission's molecule, for "show me" (atoms, then the hands joined in order)
const DEMOS = {
  H2: { atoms: ['H', 'H'], pairs: [[0, 1]] },
  H2O: { atoms: ['O', 'H', 'H'], pairs: [[0, 1], [0, 2]] },
  O2: { atoms: ['O', 'O'], pairs: [[0, 1], [0, 1]] },
  CO2: { atoms: ['C', 'O', 'O'], pairs: [[0, 1], [0, 1], [0, 2], [0, 2]] },
  CH4: { atoms: ['C', 'H', 'H', 'H', 'H'], pairs: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  NH3: { atoms: ['N', 'H', 'H', 'H'], pairs: [[0, 1], [0, 2], [0, 3]] },
  N2: { atoms: ['N', 'N'], pairs: [[0, 1], [0, 1], [0, 1]] },
  HCl: { atoms: ['H', 'Cl'], pairs: [[0, 1]] },
  C2H6: { atoms: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'], pairs: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7]] },
  C2H4: { atoms: ['C', 'C', 'H', 'H', 'H', 'H'], pairs: [[0, 1], [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]] },
  C2H5OH: { atoms: ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H'], pairs: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]] },
  C2H2: { atoms: ['C', 'C', 'H', 'H'], pairs: [[0, 1], [0, 1], [0, 1], [0, 2], [1, 3]] },
  NaCl: { atoms: ['Na', 'Cl'], pairs: [[0, 1]] },
  MgO: { atoms: ['Mg', 'O'], pairs: [[0, 1], [0, 1]] },
  CaCl2: { atoms: ['Ca', 'Cl', 'Cl'], pairs: [[0, 1], [0, 2]] },
}
