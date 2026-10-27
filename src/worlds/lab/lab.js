// The Molecule Lab: Atomlings join hands to make molecules. Pick atoms from the palette (the HUD),
// tap two atoms to join a hand of each (again for a double bond, again for a triple), tap a bond to
// let one hand go. The molecule takes its real shape by itself (chem/layout.js); when every hand is
// held it is complete, and a molecule the lab knows is named (chem/build.js), with a fact, and kept
// in the player's collection. The seed of the molecule games (docs/design.md).
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { element, nameOf } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling-next.js'
import { join, unjoin, removeAtom, freeHands, formulaOf, complete, recognise, MISSIONS, lonePairs } from '../../chem/build.js'
import { relax } from '../../chem/layout.js'
import { nightSky } from '../common/sky.js'
import { markFound, isFound } from '../../engine/progress.js'
import { MOLECULE_FACTS } from '../../content/molecules.js'
import { pick } from '../../content/stations.js'

const BOND = 1.7 // metres between bonded Atomlings' centres
const LIFT = 2.2 // the molecule floats this high over the table
const SCALE = 0.62 // Atomlings at the table are smaller than in their halls

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
  let mol = { atoms: [], bonds: [] }
  let lay = { pos: [], extra: [] }
  let shown = [] // per atom: { a, holder, cur: Vector3 }
  let selected = -1
  let bondMeshes = [] // { bond index, k, armA, armB, clasp }
  let freeMeshes = [] // per atom: [{ arm, hand, kind }]
  const handGeo = new THREE.SphereGeometry(0.11, 14, 10)
  const armGeo = new THREE.CapsuleGeometry(0.055, 1, 4, 8)
  const claspMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#a8ecff', emissiveIntensity: 0.9 })
  const loneMat = new THREE.MeshStandardMaterial({ color: '#a8ecff', emissive: '#a8ecff', emissiveIntensity: 1.2, transparent: true, opacity: 0.8 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.035, 8, 48), new THREE.MeshBasicMaterial({ color: '#ffd166' }))
  ring.visible = false
  molGroup.add(ring)

  const relayout = steps => {
    lay = relax(mol, lay, { steps, bond: BOND })
  }

  // the Atomlings: one per atom, kept across changes (a new atom pops in)
  const syncAtoms = () => {
    const next = mol.atoms.map((at, i) => {
      const old = shown.find(s => s.atom === at)
      if (old) return old
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
      }
    }
    shown = next
  }

  // bonds as held hands: an arm from each atom, meeting at a glowing clasp; free hands reach out
  const syncBonds = () => {
    for (const b of bondMeshes) for (const m of [b.armA, b.armB, b.clasp]) molGroup.remove(m)
    for (const list of freeMeshes) for (const f of list) for (const m of [f.arm, f.hand]) m && molGroup.remove(m)
    bondMeshes = []
    mol.bonds.forEach(([i, j, order], bi) => {
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
        free,
        pieces: mol.atoms.length > 1 && !mol.bonds.length ? 'apart' : null,
        selected: selected >= 0 ? mol.atoms[selected].el : null,
        fact: facts ? pick(facts, lang, ctx.level()) : null,
        missions,
      },
    })
    if (known && (done || known.charged) && markFound(`lab:${known.show}`)) {
      store.set({ labCelebrate: { show: known.show, name: known.name[lang] ?? known.name.en, at: performance.now() } })
      report()
    }
  }

  const changed = (steps = 160) => {
    syncAtoms()
    relayout(steps)
    syncBonds()
    report()
  }

  // ---- what the HUD (and taps) do ----
  const add = sym => {
    const atoms = [...mol.atoms, { el: sym }]
    let next = { atoms, bonds: mol.bonds }
    const i = atoms.length - 1
    // joined at once to the selected atom when both have a free hand
    if (selected >= 0) next = join(next, selected, i) ?? next
    mol = next
    if (selected < 0 || freeHands(mol, selected) === 0) selected = i
    changed()
  }
  const tapAtom = i => {
    if (selected < 0 || selected === i) {
      selected = selected === i ? -1 : i
    } else {
      const next = join(mol, selected, i)
      if (next) {
        mol = next
        selected = freeHands(mol, i) > 0 ? i : freeHands(mol, selected) > 0 ? selected : -1
        changed(120)
        return
      }
      selected = i
    }
    report()
  }
  const tapBond = bi => {
    const [i, j, order] = mol.bonds[bi]
    if (order > 1) mol = { atoms: mol.atoms, bonds: mol.bonds.map((b, k) => (k === bi ? [i, j, order - 1] : b)) }
    else mol = unjoin(mol, i, j)
    changed(120)
  }
  const removeSelected = () => {
    if (selected < 0) return
    mol = removeAtom(mol, selected)
    lay = { pos: lay.pos.filter((_, k) => k !== selected), extra: lay.extra.filter((_, k) => k !== selected) }
    selected = -1
    changed(120)
  }
  const clear = () => {
    mol = { atoms: [], bonds: [] }
    lay = { pos: [], extra: [] }
    selected = -1
    changed(1)
  }
  /** Build a known molecule at once (a mission's "show me"), for the curious and for the probes. */
  const demo = show => {
    const plan = DEMOS[show]
    if (!plan) return
    clear()
    mol = { atoms: plan.atoms.map(el => ({ el })), bonds: [] }
    for (const [i, j] of plan.pairs) mol = join(mol, i, j) ?? mol
    changed(500)
  }

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
    const targets = [...shown.map(s => s.holder), ...bondMeshes.flatMap(b => [b.armA, b.armB, b.clasp])]
    const hit = ray.intersectObjects(targets, true)[0]
    if (!hit) {
      selected = -1
      report()
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
    })
    for (const b of bondMeshes) {
      const A = shown[b.i]?.cur
      const B = shown[b.j]?.cur
      if (!A || !B) continue
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
    if (selected >= 0 && shown[selected]) {
      ring.visible = true
      ring.position.copy(shown[selected].cur)
      ring.lookAt(camera.position)
      ring.scale.setScalar((bodyR(selected) / 0.6) * (1 + Math.sin(t * 5) * 0.06))
    } else ring.visible = false
    // keep the whole molecule in view
    const want = Math.max(7, radius * 3.2)
    const d = camera.position.distanceTo(controls.target)
    if (d < want * 0.8 || d > want * 1.6) camera.position.sub(controls.target).setLength(d + (want - d) * Math.min(1, dt * 2)).add(controls.target)
  }

  const attach = () => {
    camera.position.set(0, LIFT + 3.2, 9)
    controls.target.set(0, LIFT, 0)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    controls.dispose()
    store.set({ lab: null, labCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.6, bloom: { strength: 0.55, radius: 0.45, threshold: 0.8 }, fov: 50 },
    attach,
    detach,
    update,
    add,
    removeSelected,
    clear,
    demo,
    lonePairsAt: i => lonePairs(mol, i),
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
}
