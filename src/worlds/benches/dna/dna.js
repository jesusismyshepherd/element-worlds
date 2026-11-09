// Building DNA: a bench of the Molecule Lab (/lab/dna; registry.js BENCHES; docs/knowledge/dna.md).
// The four bases wait in a tray at the edge of the view (A, T, G, C, each its real molecule, drawn where the
// HUD keeps their slots: [data-dna-slot]); a tap on one sends a nucleotide (base, sugar, phosphate) flying to
// the 3' end of the strand, and its partner flies in from its own slot and pairs with it by hydrogen bonds
// (glowing threads between the very atoms: two for A-T, three for G-C). The pairs stack into the
// right-handed B-DNA helix, every atom where 3DNA's B-DNA model puts it (bases.js), and a slider untwists it
// into a ladder. A tap on the helix copies it: the fork runs along, the halves part, new nucleotides pair
// with each, and two helices stand side by side, each one old strand (gold or blue) and one new (green).
// Shared in a room (net/shared.js, part 'bench': the letters, the twist, the copy and how far it has gone);
// discoveries bench:dna:<find> (bases.js FINDS).
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { nightSky } from '../../common/sky.js'
import { skyVerse } from '../../common/verse.js'
import { makeText } from '../../../engine/text.js'
import { coverId, setCover } from '../../../engine/covers.js'
import { markFound, isFound } from '../../../engine/progress.js'
import { play } from '../../../audio/sound.js'
import { room } from '../../../net/room.js'
import { track } from '../../../net/telemetry.js'
import { nucleotide, freeBase, hbonds, complement, cleanSeq, measure, copyAt, copyLength, TWIST, RISE, MAX_PAIRS, BASES, RINGS, FINDS, hbondCount } from './bases.js'

const S = 0.09 // metres per ångström
const LIFT = 2.35 // the helix's axis over the floor (the table's top is at 0.5)
const DEG = Math.PI / 180
const FLY = 0.75 // seconds a nucleotide flies from the tray to its place
const SEP = 1.3 // metres from the middle to each copy's axis
const HERE = '/lab/dna'
const ELEMENT = { H: '#f2f5fb', C: '#9aa3b5', N: '#5a7bff', O: '#ff4d40', P: '#ff9f3a' }
const RADIUS = { H: 0.26, C: 0.4, N: 0.38, O: 0.37, P: 0.5 } // ångström, as drawn
export const LETTER = { A: '#ffb547', T: '#ff5d8f', G: '#3ddc97', C: '#4cc3ff' }
// the strands' backbones: the first strand gold, its partner blue, a strand made in a copy green
const RAIL = { 0: '#ffbf3a', 1: '#3aa6ff', new: '#c77dff' }
const MAX_ATOMS = 26 // per nucleotide (guanine: 22 heavy atoms and 4 hydrogens)
const MAX_STICKS = 30

const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))

export async function build(ctx) {
  const { camera, canvas, store, light } = ctx
  const root = new THREE.Group()
  root.name = 'bench-dna'

  // ---- the room: the lab's round table of light under the stars ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
  // the passage stands in the sky's free corner: top left between the tray and the card, or under the card
  // on an upright phone (placeVerse); not on a phone on its side (no room, as in the lab)
  const verse = skyVerse(ctx, 'dna', { at: [0, 8, -16], width: 8, size: 0.3, opacity: 0.8 })
  const verseCover = coverId()
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
  const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshBasicMaterial({ color: '#2b4a9c', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }))
  glowDisc.rotation.x = -Math.PI / 2
  glowDisc.position.y = 0.51
  root.add(glowDisc)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 1.3))
  const key = new THREE.DirectionalLight('#fff4e6', 1.7)
  key.position.set(4, 9, 6)
  root.add(key)
  const fill = new THREE.DirectionalLight('#9fc4ff', 0.6)
  fill.position.set(-6, 3, -4)
  root.add(fill)

  // ---- what everything is drawn with ----
  const seg = light ? 10 : 18
  const sphereGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  const stickGeo = new THREE.CylinderGeometry(1, 1, 1, light ? 6 : 10, 1)
  const beadGeo = new THREE.SphereGeometry(1, 8, 6)
  const atomMat = light
    ? new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.05 })
    : new THREE.MeshPhysicalMaterial({ roughness: 0.28, metalness: 0.02, clearcoat: 0.7, clearcoatRoughness: 0.25 })
  const stickMat = new THREE.MeshStandardMaterial({ color: '#cfd7ea', roughness: 0.45 })
  const beadMat = new THREE.MeshBasicMaterial({ color: '#d4f8ff', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  const slabMat = Object.fromEntries(BASES.map(b => [b, new THREE.MeshStandardMaterial({
    color: LETTER[b], emissive: LETTER[b], emissiveIntensity: 0.6, roughness: 0.4, transparent: true, opacity: 0.85, side: THREE.DoubleSide,
  })]))
  const railMat = Object.fromEntries(Object.entries(RAIL).map(([k, c]) => [k, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.42, roughness: 0.35 })]))
  const colorOf = el => new THREE.Color(ELEMENT[el] ?? '#c0c6d6')
  const COLORS = Object.fromEntries(Object.keys(ELEMENT).map(el => [el, colorOf(el)]))

  // the slabs: each base's rings filled, flat in its plane, one shape per base and strand
  const slabGeo = {}
  const slabOf = (b, strand) => {
    const key = `${b}${strand}`
    if (slabGeo[key]) return slabGeo[key]
    const nuc = nucleotide(b, strand)
    const geos = RINGS[b].map(ring => {
      const pts = ring.map(name => nuc.atoms[nuc.index[name]].p)
      const shape = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1])))
      const g = new THREE.ExtrudeGeometry(shape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.16, bevelSegments: light ? 1 : 3, curveSegments: 4 })
      g.translate(0, 0, -0.18)
      return g
    })
    slabGeo[key] = geos
    return geos
  }

  // ---- the stage: an orientation (the axis across a wide screen, upright on a phone) and two duplexes ----
  const orient = new THREE.Group()
  orient.position.y = LIFT
  root.add(orient)
  const duplexes = [0, 1].map(d => {
    const group = new THREE.Group()
    group.name = `duplex-${d}`
    orient.add(group)
    const cap = MAX_PAIRS * 2
    const atoms = new THREE.InstancedMesh(sphereGeo, atomMat, cap * MAX_ATOMS)
    const sticks = new THREE.InstancedMesh(stickGeo, stickMat, cap * MAX_STICKS)
    const beads = new THREE.InstancedMesh(beadGeo, beadMat, MAX_PAIRS * 3 * 2 * 5)
    for (const m of [atoms, sticks, beads]) {
      m.count = 0
      m.frustumCulled = false
      group.add(m)
    }
    atoms.setColorAt(0, COLORS.C)
    const rails = { 0: null, 1: null }
    return { d, group, atoms, sticks, beads, rails, slots: [], spin: 0, pos: 0 }
  })

  // ---- the state ----
  let seq = '' // the first strand's letters, 5' -> 3'
  let twist = 1 // 0 a ladder, 1 the B-DNA helix
  let copyStart = null // when the copy began (clock), or null
  let clock = 0
  let views = [] // the nucleotides on show
  let pairs = [] // per base pair: its eased { angle, z }
  let zc = 0 // the middle of the helix (Å), eased
  let events = [] // [{ at, fn }] things due later (bonds forming, sounds)
  let event = null // what the HUD tells: { kind, b, p, at }
  let celebrate = null
  let dirty = true
  let spin = 0
  let upright = false
  let fxBurst = null

  const copying = () => copyStart != null
  const copyAge = () => (copyStart == null ? 0 : clock - copyStart)
  const copyDone = () => copying() && copyAge() >= copyLength(seq.length)
  const phase = () => (!copying() ? 'build' : copyDone() ? 'copied' : 'copying')

  // ---- the tray: the four free bases, drawn in the HUD's slots ----
  const tray = BASES.map((b, i) => {
    const mol = freeBase(b)
    const r = Math.max(...mol.atoms.map(a => Math.hypot(a.p[0], a.p[1]))) + 0.4
    const group = new THREE.Group()
    group.visible = false
    root.add(group)
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color: LETTER[b], transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false }))
    disc.renderOrder = 20
    group.add(disc)
    const mat = atomMat.clone()
    mat.depthTest = false
    const sMat = stickMat.clone()
    sMat.depthTest = false
    const atoms = new THREE.InstancedMesh(sphereGeo, mat, mol.atoms.length)
    const sticks = new THREE.InstancedMesh(stickGeo, sMat, mol.bonds.reduce((s, [, , o]) => s + o, 0))
    atoms.renderOrder = 22
    sticks.renderOrder = 21
    group.add(sticks, atoms)
    const m = new THREE.Matrix4()
    mol.atoms.forEach((a, k) => {
      m.makeScale(RADIUS[a.el] * 0.9, RADIUS[a.el] * 0.9, RADIUS[a.el] * 0.9).setPosition(...a.p)
      atoms.setMatrixAt(k, m)
      atoms.setColorAt(k, COLORS[a.el])
    })
    let s = 0
    const q = new THREE.Quaternion()
    for (const [x, y, o] of mol.bonds) {
      const A = new THREE.Vector3(...mol.atoms[x].p)
      const B = new THREE.Vector3(...mol.atoms[y].p)
      const dir = B.clone().sub(A)
      const len = dir.length()
      dir.normalize()
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      const side = new THREE.Vector3(-dir.y, dir.x, 0)
      for (let k = 0; k < o; k++) {
        const off = o === 1 ? 0 : (k - 0.5) * 0.26
        const mid = A.clone().add(B).multiplyScalar(0.5).addScaledVector(side, off)
        m.compose(mid, q, new THREE.Vector3(0.1, len, 0.1))
        sticks.setMatrixAt(s++, m)
      }
    }
    return { b, i, mol, r, group, disc, atoms, sticks, pressed: -10, rect: null }
  })
  const fwd = new THREE.Vector3()
  const tmpV = new THREE.Vector3()
  /** A point of the page (CSS px) at `d` metres in front of the camera, in the world. */
  const screenPoint = (x, y, d, out = new THREE.Vector3()) => {
    const r = canvas.getBoundingClientRect()
    tmpV.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1, 0.5).unproject(camera).sub(camera.position)
    camera.getWorldDirection(fwd)
    return out.copy(camera.position).addScaledVector(tmpV, d / tmpV.dot(fwd))
  }
  const TRAY_D = 2.2
  let slotsAt = 0
  const placeTray = t => {
    // the HUD's slots (re-read a few times a second: the layout moves with the screen)
    if (t - slotsAt > 0.25 || tray.some(s => !s.rect)) {
      slotsAt = t
      for (const s of tray) {
        const el = document.querySelector(`[data-dna-slot="${s.b}"]`)
        s.rect = el ? el.getBoundingClientRect() : null
      }
    }
    const h = canvas.clientHeight || 1
    const perPx = (2 * TRAY_D * Math.tan((camera.fov * DEG) / 2)) / h
    const busy = copying() && !copyDone()
    for (const s of tray) {
      const r = s.rect
      s.group.visible = !!r && r.width > 4
      if (!s.group.visible) continue
      screenPoint(r.left + r.width / 2, r.top + r.height * 0.37, TRAY_D, s.group.position)
      const px = Math.min(r.width, r.height * 0.86) * 0.33
      const press = Math.max(0, 1 - (t - s.pressed) / 0.35)
      const k = (px * perPx) / s.r
      s.group.scale.setScalar(k * (1 + Math.sin(press * Math.PI) * 0.22) * (busy || seq.length >= MAX_PAIRS ? 0.86 : 1))
      // face the camera, the pairing edge (frame -y) towards the helix: right from a column, up from a row
      const row = tray.filter(o => o.rect).every(o => Math.abs(o.rect.top - r.top) < 4)
      s.group.quaternion.copy(camera.quaternion)
      s.group.rotateZ(row ? Math.PI : Math.PI / 2)
      s.group.rotateY(Math.sin(t * 0.7 + s.i * 1.7) * 0.32)
      s.group.rotateX(Math.sin(t * 0.5 + s.i) * 0.12)
      s.disc.scale.setScalar(s.r * 1.12)
      s.disc.material.opacity = (busy ? 0.05 : 0.12) + press * 0.35 + Math.sin(t * 2 + s.i) * 0.025
    }
  }
  /** Where a nucleotide coming from a letter's slot starts, in the duplex's space. */
  const fromSlot = (b, d) => {
    const s = tray.find(x => x.b === b)
    const w = s?.rect ? screenPoint(s.rect.left + s.rect.width / 2, s.rect.top + s.rect.height * 0.43, TRAY_D + 1.2) : camera.position.clone().add(new THREE.Vector3(0, -2, -3))
    duplexes[d].group.updateWorldMatrix(true, false)
    return duplexes[d].group.worldToLocal(w)
  }

  // ---- the nucleotides on show ----
  let viewSeq = 0
  /** A nucleotide: its base, strand (0 the first, 1 the partner), pair k, duplex, role ('old' or 'new');
   *  `at` when it starts flying (null: already in place), from its letter's slot. */
  const newView = (base, strand, k, d, role, at = null) => {
    const nuc = nucleotide(base, strand)
    const c = nuc.atoms.reduce((s, a) => s.add(new THREE.Vector3(...a.p)), new THREE.Vector3()).multiplyScalar(1 / nuc.atoms.length)
    const v = { id: ++viewSeq, base, strand, k, d, role, at, from: null, spin: new THREE.Quaternion(), nuc, c, leaving: null, away: null, M: new THREE.Matrix4(), last: null, slot: -1, slabs: [], letter: null }
    if (at != null) {
      v.from = fromSlot(base, d)
      v.spin.setFromEuler(new THREE.Euler(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 6))
    }
    // its slot in the duplex's instanced meshes
    const used = new Set(views.filter(o => o.d === d && !o.gone).map(o => o.slot))
    let s = 0
    while (used.has(s)) s++
    v.slot = s
    for (const g of slabOf(base, strand)) {
      const mesh = new THREE.Mesh(g, slabMat[base])
      mesh.matrixAutoUpdate = false
      mesh.userData.view = v
      duplexes[d].group.add(mesh)
      v.slabs.push(mesh)
    }
    views.push(v)
    dirty = true
    return v
  }
  const dropView = v => {
    v.gone = true
    for (const m of v.slabs) m.parent?.remove(m)
    if (v.letter) {
      v.letter.parent?.remove(v.letter)
      v.letter.dispose()
    }
    clearSlot(v)
  }
  const ZERO = new THREE.Matrix4().makeScale(0, 0, 0)
  const clearSlot = v => {
    const D = duplexes[v.d]
    for (let i = 0; i < MAX_ATOMS; i++) if (v.slot * MAX_ATOMS + i < D.atoms.count) D.atoms.setMatrixAt(v.slot * MAX_ATOMS + i, ZERO)
    for (let i = 0; i < MAX_STICKS; i++) if (v.slot * MAX_STICKS + i < D.sticks.count) D.sticks.setMatrixAt(v.slot * MAX_STICKS + i, ZERO)
    D.atoms.instanceMatrix.needsUpdate = true
    D.sticks.instanceMatrix.needsUpdate = true
  }
  const leave = (v, delay = 0) => {
    if (v.leaving != null) return
    v.leaving = clock + delay
    v.away = v.c.clone().multiplyScalar(S).add(new THREE.Vector3((Math.random() - 0.5) * 3, 4 + Math.random() * 2, (Math.random() - 0.5) * 3))
    v.spin.setFromEuler(new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3))
  }

  // ---- placing: each pair's frame, eased; each nucleotide's matrix ----
  const target = k => ({ angle: k * TWIST * twist, z: k * (RISE + (1 - twist) * RISE * 0.85) })
  const syncPairs = () => {
    while (pairs.length < seq.length) {
      const k = pairs.length
      const prev = pairs[k - 1]
      // a new pair comes in level with the last (a rung of the ladder), then twists into place
      pairs.push(prev ? { angle: prev.angle, z: prev.z + RISE } : { ...target(0) })
    }
    pairs.length = seq.length
  }
  const easePairs = dt => {
    const k = 1 - Math.exp(-dt * 3.2)
    let moved = false
    pairs.forEach((p, i) => {
      const t = target(i)
      const da = t.angle - p.angle
      const dz = t.z - p.z
      if (Math.abs(da) > 0.01 || Math.abs(dz) > 0.001) {
        p.angle += da * k
        p.z += dz * k
        moved = true
      }
    })
    const n = seq.length
    const want = n ? target(n - 1).z / 2 : 0
    if (Math.abs(want - zc) > 0.001) {
      zc += (want - zc) * k
      moved = true
    }
    return moved
  }

  const mA = new THREE.Matrix4()
  const mB = new THREE.Matrix4()
  const qA = new THREE.Quaternion()
  const vA = new THREE.Vector3()
  const vB = new THREE.Vector3()
  const ONE = new THREE.Quaternion()
  /** A nucleotide's matrix in its duplex now (ångström in, metres out); false while it is not there yet. */
  const placeView = v => {
    const p = pairs[v.k]
    if (!p) return false
    // its place in the pair's frame: up the axis and turned
    mA.makeRotationZ(p.angle * DEG).scale(vA.set(S, S, S)).setPosition(0, 0, (p.z - zc) * S)
    // in a copy, the halves of a pair not yet opened still stand in the middle
    if (copying()) {
      const c = copyAt(copyAge(), seq.length)
      const shut = 1 - ease(c.open(v.k))
      const D = duplexes[v.d]
      // the duplex stands at its place (orient y); undo it for the part still shut, in the duplex's frame
      vB.set(0, -D.pos * shut, 0).applyAxisAngle(vA.set(0, 0, 1), -D.spin)
      mA.elements[12] += vB.x
      mA.elements[13] += vB.y
      mA.elements[14] += vB.z
    }
    if (v.at != null) {
      const e = ease((clock - v.at) / FLY)
      if (clock < v.at) return false
      if (e < 1) {
        // flying in from its slot: from the slot's point, tumbling, small, onto its place
        const c1 = vB.copy(v.c).applyMatrix4(mA)
        const pos = vA.copy(v.from).lerp(c1, e)
        pos.z += Math.sin(e * Math.PI) * 0.4
        qA.copy(v.spin).slerp(ONE, e)
        const sc = 0.45 + 0.55 * e
        mB.compose(pos, qA, new THREE.Vector3(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-c1.x, -c1.y, -c1.z))
        v.M.multiplyMatrices(mB, mA)
        v.flying = true
        return true
      }
      v.at = null
      v.flying = false
      v.landed = clock
    }
    if (v.leaving != null && clock >= v.leaving) {
      const e = ease((clock - v.leaving) / 0.8)
      const c1 = vB.copy(v.c).applyMatrix4(mA)
      const pos = vA.copy(c1).lerp(v.away, e)
      qA.copy(ONE).slerp(v.spin, e)
      const sc = Math.max(0.001, 1 - e)
      mB.compose(pos, qA, new THREE.Vector3(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-c1.x, -c1.y, -c1.z))
      v.M.multiplyMatrices(mB, mA)
      if (e >= 1) v.done = true
      return true
    }
    v.M.copy(mA)
    return true
  }

  const level = () => (ctx.level() === 'scientist' ? 'sci' : 'kid')
  let drawnLevel = null
  const stickQ = new THREE.Quaternion()
  const UP = new THREE.Vector3(0, 1, 0)
  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const mS = new THREE.Matrix4()
  /** Write a nucleotide's atoms and bonds into its duplex's instances. */
  const drawView = v => {
    const D = duplexes[v.d]
    const sci = level() === 'sci'
    const shown = !!v.M && !v.hidden
    v.nuc.atoms.forEach((a, i) => {
      const slot = v.slot * MAX_ATOMS + i
      if (!shown) return D.atoms.setMatrixAt(slot, ZERO)
      // the Explorer sees the bases and the backbone's phosphorus; the Scientist every atom
      const backbone = a.part !== 'base'
      const r = (RADIUS[a.el] ?? 0.4) * (sci ? 1 : backbone ? (a.el === 'P' ? 1.1 : 0) : 0.7)
      pA.set(...a.p).applyMatrix4(v.M)
      const sc = v.M.getMaxScaleOnAxis()
      mS.makeScale(r * sc, r * sc, r * sc).setPosition(pA)
      D.atoms.setMatrixAt(slot, mS)
      D.atoms.setColorAt(slot, COLORS[a.el])
    })
    for (let i = v.nuc.atoms.length; i < MAX_ATOMS; i++) D.atoms.setMatrixAt(v.slot * MAX_ATOMS + i, ZERO)
    let s = 0
    const sc = v.M.getMaxScaleOnAxis()
    for (const [i, j] of v.nuc.bonds) {
      const slot = v.slot * MAX_STICKS + s++
      const ai = v.nuc.atoms[i]
      const aj = v.nuc.atoms[j]
      const backbone = ai.part !== 'base' || aj.part !== 'base'
      if (!shown || (!sci && backbone)) {
        D.sticks.setMatrixAt(slot, ZERO)
        continue
      }
      pA.set(...ai.p).applyMatrix4(v.M)
      pB.set(...aj.p).applyMatrix4(v.M)
      const dir = vB.copy(pB).sub(pA)
      const len = dir.length()
      stickQ.setFromUnitVectors(UP, dir.normalize())
      const r = (sci ? 0.12 : 0.1) * sc
      mS.compose(pA.add(pB).multiplyScalar(0.5), stickQ, vA.set(r, len, r))
      D.sticks.setMatrixAt(slot, mS)
    }
    for (; s < MAX_STICKS; s++) D.sticks.setMatrixAt(v.slot * MAX_STICKS + s, ZERO)
    for (const m of v.slabs) {
      m.visible = shown
      m.matrix.copy(v.M)
      m.matrixWorldNeedsUpdate = true
    }
    m4dirty(D)
  }
  const m4dirty = D => {
    D.atoms.instanceMatrix.needsUpdate = true
    D.sticks.instanceMatrix.needsUpdate = true
    if (D.atoms.instanceColor) D.atoms.instanceColor.needsUpdate = true
  }
  const restyle = () => {
    const sci = level() === 'sci'
    for (const b of BASES) {
      slabMat[b].opacity = sci ? 0.32 : 0.88
      slabMat[b].emissiveIntensity = sci ? 0.35 : 0.65
    }
    drawnLevel = level()
    dirty = true
  }

  // a point of an atom of a view, in a duplex's space (for the hydrogen bonds, which may cross duplexes)
  const atomIn = (v, name, d, out) => {
    out.set(...v.nuc.atoms[v.nuc.index[name]].p).applyMatrix4(v.M)
    if (v.d !== d) {
      duplexes[v.d].group.updateMatrix()
      duplexes[d].group.updateMatrix()
      out.applyMatrix4(duplexes[v.d].group.matrix).applyMatrix4(new THREE.Matrix4().copy(duplexes[d].group.matrix).invert())
    }
    return out
  }
  /** The hydrogen bonds on show: between the two nucleotides of each pair, each with how far it has
   *  formed (0..1), drawn in the duplex of the first. */
  const bondsNow = () => {
    const out = []
    const byPair = new Map()
    for (const v of views) {
      if (v.gone || v.leaving != null || v.flying || !v.M || v.hidden) continue
      const key = `${v.k}`
      if (!byPair.has(key)) byPair.set(key, [])
      byPair.get(key).push(v)
    }
    const c = copying() ? copyAt(copyAge(), seq.length) : null
    for (const list of byPair.values()) {
      for (const a of list.filter(x => x.strand === 0)) {
        for (const b of list.filter(x => x.strand === 1)) {
          // which partners hold hands: before a copy the two old strands; in a copy, old with new
          let f
          if (!c) {
            if (a.d !== b.d) continue
            f = Math.min(1, (clock - Math.max(a.landed ?? -9, b.landed ?? -9)) / 0.45)
          } else if (a.role === 'old' && b.role === 'old') f = 1 - ease(c.open(a.k) * 4)
          else if (a.d === b.d) f = Math.min(1, (clock - Math.max(a.landed ?? -9, b.landed ?? -9)) / 0.45)
          else continue
          if (f > 0.01) out.push({ a, b, f })
        }
      }
    }
    return out
  }
  const drawBonds = t => {
    const counts = [0, 0]
    for (const { a, b, f } of bondsNow()) {
      const D = duplexes[a.d]
      hbonds(a.base).forEach((hb, j) => {
        // each bond forms in turn
        const g = Math.max(0, Math.min(1, f * hbondCount(a.base) - j))
        if (g <= 0) return
        const don = hb.donor.strand === 0 ? a : b
        const acc = hb.acceptor.strand === 0 ? a : b
        atomIn(don, hb.donor.h, a.d, pA)
        atomIn(acc, hb.acceptor.atom, a.d, pB)
        for (let k = 1; k <= 3; k++) {
          const i = counts[a.d]++
          const x = k / 4
          vA.copy(pA).lerp(pB, x)
          const r = 0.34 * S * g * (1 + 0.25 * Math.sin(t * 6 + k + j * 2))
          mS.makeScale(r, r, r).setPosition(vA)
          D.beads.setMatrixAt(i, mS)
        }
      })
    }
    duplexes.forEach((D, d) => {
      D.beads.count = counts[d]
      D.beads.instanceMatrix.needsUpdate = true
    })
  }

  // the backbones: a glowing rail through each strand's phosphorus atoms
  const drawRails = () => {
    // (through the phosphorus atoms only: in a ladder the O3' would hook off the end)
    for (const D of duplexes) {
      for (const strand of [0, 1]) {
        if (D.rails[strand]) {
          D.group.remove(D.rails[strand])
          D.rails[strand].geometry.dispose()
          D.rails[strand] = null
        }
        const list = views.filter(v => v.d === D.d && v.strand === strand && !v.gone && v.leaving == null && !v.flying && v.M && !v.hidden).sort((x, y) => x.k - y.k)
        if (list.length < 2) continue
        // runs of neighbouring pairs (a gap: the copy has not reached it yet)
        const pts = []
        let lastK = null
        for (const v of strand === 0 ? list : [...list].reverse()) {
          if (lastK != null && Math.abs(v.k - lastK) !== 1) break
          pts.push(new THREE.Vector3(...v.nuc.atoms[v.nuc.index.P].p).applyMatrix4(v.M))
          lastK = v.k
        }
        if (pts.length < 2) continue
        const curve = new THREE.CatmullRomCurve3(pts)
        const sci = level() === 'sci'
        const geo = new THREE.TubeGeometry(curve, Math.max(8, pts.length * (light ? 6 : 10)), (sci ? 0.24 : 0.5) * S, light ? 6 : 10, false)
        const role = list[0].role === 'new' ? 'new' : strand
        const mesh = new THREE.Mesh(geo, railMat[role])
        mesh.userData.rail = true
        D.group.add(mesh)
        D.rails[strand] = mesh
      }
    }
  }

  // the letters: the strand read 5' -> 3' along one side of the helix, its partner along the other
  const letters = new THREE.Group()
  orient.add(letters)
  let letterMeshes = []
  const syncLetters = () => {
    for (const m of letterMeshes) {
      letters.remove(m)
      m.dispose()
    }
    letterMeshes = []
    ;[...seq].forEach((b, k) => {
      for (const [strand, base] of [[0, b], [1, complement(b)]]) {
        const t = makeText(base, { size: 0.25, color: LETTER[base], outlineWidth: 0.025, outlineColor: '#0b0f24' })
        t.userData = { k, strand }
        letters.add(t)
        letterMeshes.push(t)
      }
    })
    const ends = level() === 'sci'
    if (ends && seq.length) {
      for (const [strand, label, k] of [[0, "5'", -1], [0, "3'", seq.length], [1, "3'", -1], [1, "5'", seq.length]]) {
        // (the 3D fonts have no prime: a plain apostrophe)
        const t = makeText(label, { size: 0.24, color: strand ? RAIL[1] : RAIL[0], outlineWidth: 0.02, outlineColor: '#0b0f24' })
        t.userData = { k, strand, end: true }
        letters.add(t)
        letterMeshes.push(t)
      }
    }
  }
  const placeLetters = () => {
    const show = !copying() || copyAge() < 0.6
    letters.visible = show && seq.length > 0
    if (!letters.visible) return
    const side = 1.18 // metres from the axis
    const inv = new THREE.Quaternion()
    orient.getWorldQuaternion(inv).invert()
    for (const t of letterMeshes) {
      const { k, strand } = t.userData
      const p = pairs[Math.max(0, Math.min(pairs.length - 1, k))]
      const z = ((p ? p.z : 0) + (k < 0 ? -RISE * 1.2 : k >= pairs.length ? RISE * 1.2 : 0) - zc) * S
      t.position.set(0, strand ? -side : side, z)
      t.quaternion.copy(inv).multiply(camera.quaternion)
      // the newest letter pops
      const v = views.find(o => o.k === k && o.strand === strand && !o.gone)
      const age = v?.landed != null ? clock - v.landed : v?.at != null ? -1 : 9
      const sc = age < 0 ? 0 : 1 + Math.max(0, 0.6 - age) * 0.8
      t.scale.setScalar(sc)
    }
  }

  // a burst of sparks for a find
  const burst = () => {
    if (fxBurst) {
      orient.remove(fxBurst.points)
      fxBurst.points.geometry.dispose()
    }
    const n = light ? 70 : 220
    const pos = new Float32Array(n * 3)
    const vel = []
    const half = Math.max(1, (seq.length * RISE * S) / 2)
    for (let i = 0; i < n; i++) {
      const z = (Math.random() * 2 - 1) * half
      const a = Math.random() * Math.PI * 2
      pos.set([Math.cos(a) * 0.9, Math.sin(a) * 0.9, z], i * 3)
      vel.push([Math.cos(a) * (1 + Math.random() * 2), Math.sin(a) * (1 + Math.random() * 2), (Math.random() - 0.5)])
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const colors = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) colors.set(new THREE.Color(LETTER[BASES[i % 4]]).toArray(), i * 3)
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }))
    orient.add(points)
    fxBurst = { points, vel, start: clock }
  }
  const stepBurst = dt => {
    if (!fxBurst) return
    const age = clock - fxBurst.start
    const a = fxBurst.points.geometry.attributes.position
    for (let i = 0; i < a.count; i++) {
      const v = fxBurst.vel[i]
      a.setXYZ(i, a.getX(i) + v[0] * dt, a.getY(i) + v[1] * dt, a.getZ(i) + v[2] * dt)
      v[0] *= 0.97
      v[1] *= 0.97
    }
    a.needsUpdate = true
    fxBurst.points.material.opacity = Math.max(0, 1 - age / 1.6)
    if (age > 1.6) {
      orient.remove(fxBurst.points)
      fxBurst.points.geometry.dispose()
      fxBurst.points.material.dispose()
      fxBurst = null
    }
  }

  // ---- what happens: building, undoing, copying ----
  const at = (delay, fn) => events.push({ at: clock + delay, fn })
  /** The pair k comes in: the first strand's nucleotide from its slot, the partner from its own; their
   *  hydrogen bonds click shut one by one (live: someone has just done it), or all at once. */
  const addPair = (k, b, live) => {
    if (live) {
      newView(b, 0, k, 0, 'old', clock)
      newView(complement(b), 1, k, 0, 'old', clock + 0.35)
      play('tap')
      for (let j = 0; j < hbondCount(b); j++) at(0.35 + FLY + 0.05 + j * 0.15, () => play('join', { order: j + 1 }))
    } else {
      for (const v of [newView(b, 0, k, 0, 'old'), newView(complement(b), 1, k, 0, 'old')]) v.landed = clock - 9
    }
  }
  /** Show the bench as the state says, at once (a newcomer, a saved state, a jump). */
  const rebuild = () => {
    for (const v of views) dropView(v)
    views = []
    pairs = []
    syncPairs()
    pairs.forEach((p, k) => Object.assign(p, target(k)))
    zc = seq.length ? target(seq.length - 1).z / 2 : 0
    for (const D of duplexes) {
      D.pos = 0
      D.group.position.set(0, 0, 0)
    }
    ;[...seq].forEach((b, k) => addPair(k, b, false))
    if (copying()) startCopyViews(false)
    syncLetters()
    dirty = true
  }
  /** The copy's nucleotides: the old strands each to their own duplex, a new partner for each half due
   *  when the fork opens its pair. */
  const startCopyViews = live => {
    const n = seq.length
    for (const D of duplexes) D.spin = spin
    duplexes[0].pos = SEP
    duplexes[1].pos = -SEP
    for (const v of views) if (!v.gone && v.strand === 1) {
      // the partner strand moves to the second duplex, where it stands as it did
      for (const m of v.slabs) duplexes[1].group.add(m)
      clearSlot(v)
      v.d = 1
      const used = new Set(views.filter(o => o !== v && o.d === 1 && !o.gone).map(o => o.slot))
      let s = 0
      while (used.has(s)) s++
      v.slot = s
    }
    ;[...seq].forEach((b, k) => {
      // when its pair opens, a new nucleotide flies to each half (a newcomer sees those due already landed)
      const due = copyStart + 0.4 + k * 0.32 + 0.25
      const a = newView(complement(b), 1, k, 0, 'new', due)
      const c = newView(b, 0, k, 1, 'new', due + 0.12)
      for (const v of [a, c]) if (!live && due + FLY < clock) {
        v.at = null
        v.landed = due + FLY
      }
    })
    if (live) {
      play('zip')
      for (let k = 0; k < n; k += 3) at(0.4 + k * 0.32, () => play('tap'))
      at(copyLength(n) - 0.2, () => play('celebrate'))
    }
    syncLetters()
    dirty = true
  }
  /** Back to one helix: the second copy floats away, the first goes to the middle. */
  const collapse = live => {
    for (const v of views) {
      if (v.gone) continue
      if (v.d === 1) {
        if (live) leave(v, Math.random() * 0.3)
        else dropView(v)
      } else if (v.role === 'new') v.role = 'old'
    }
    if (!live) views = views.filter(v => !v.gone)
    copyStart = null
    duplexes[0].pos = 0
    syncLetters()
    dirty = true
  }

  // ---- the HUD ----
  const peers = () => (room.active ? room.members.filter(m => m.path === HERE) : [])
  const report = () => {
    const m = measure(seq)
    store.set({
      dna: {
        seq,
        n: seq.length,
        max: MAX_PAIRS,
        phase: phase(),
        twist,
        measure: m,
        event,
        found: FINDS.filter(f => isFound(`bench:dna:${f}`)),
        total: FINDS.length,
        together: peers().filter(p => p.id !== room.me?.id).map(p => ({ name: p.name, color: p.color })),
      },
    })
  }
  const found = id => {
    if (!markFound(`bench:dna:${id}`)) return
    track('bench', { id: 'dna', op: 'found', find: id })
    celebrate = { id, at: performance.now() }
    store.set({ dnaCelebrate: celebrate })
    burst()
  }
  const checkFinds = () => {
    if (/[AT]/.test(seq)) found('at')
    if (/[GC]/.test(seq)) found('gc')
    if (seq.includes('ATG')) found('atg')
    if (seq.length >= 11 && twist >= 0.9) found('turn')
    if (copyDone()) found('copy')
  }
  let reportedPhase = null

  // ---- shared with the room (net/shared.js): the letters, the twist, the copy ----
  const getState = () => ({ seq, twist: Math.round(twist * 100) / 100, copy: copying() ? { age: Math.round(copyAge() * 100) / 100 } : null })
  const setState = (s, live, ago = 0) => {
    const next = cleanSeq(s?.seq)
    const tw = Number.isFinite(s?.twist) ? Math.max(0, Math.min(1, s.twist)) : 1
    const copy = s?.copy && Number.isFinite(s.copy.age) && next.length >= 3 ? Math.max(0, s.copy.age + (ago || 0)) : null
    twist = tw
    // the letters: one more, one fewer, or none (played as if done here), else the whole bench at once
    if (next !== seq) {
      if (copying()) collapse(live)
      if (live && next.length === seq.length + 1 && next.startsWith(seq)) {
        seq = next
        syncPairs()
        addPair(seq.length - 1, seq[seq.length - 1], true)
        event = { kind: 'pair', b: seq[seq.length - 1], p: complement(seq[seq.length - 1]), at: clock }
        syncLetters()
      } else if (live && next.length === seq.length - 1 && seq.startsWith(next)) {
        undoLocal()
      } else if (live && !next) clearLocal()
      else {
        seq = next
        rebuild()
      }
    }
    if (copy != null && !copying()) {
      copyStart = clock - copy
      if (live) event = { kind: 'copying', at: clock }
      startCopyViews(live && copy < 1)
    } else if (copy == null && copying()) {
      collapse(live)
      if (live) event = { kind: 'joined', at: clock }
    }
    dirty = true
    report()
    checkFinds()
  }
  const shared = { bench: { get: getState, set: setState } }

  // ---- the operations (mine: done here, then told to the room) ----
  const undoLocal = () => {
    const k = seq.length - 1
    for (const v of views) if (!v.gone && v.k === k) leave(v)
    seq = seq.slice(0, -1)
    event = { kind: 'undo', at: clock }
    at(0.85, () => {
      syncPairs()
      dirty = true
    })
    play('part')
    syncLetters()
  }
  const clearLocal = () => {
    views.forEach((v, i) => leave(v, (i % 12) * 0.03))
    seq = ''
    event = { kind: 'cleared', at: clock }
    at(1.2, () => {
      syncPairs()
      dirty = true
    })
    play('part')
    syncLetters()
  }
  const mine = op => {
    track('bench', { id: 'dna', ...op, n: seq.length, together: peers().length > 1 || undefined })
    ctx.share('bench')
    report()
    checkFinds()
  }
  const add = b => {
    if (!BASES.includes(b)) return
    const s = tray.find(x => x.b === b)
    if (s) s.pressed = clock
    if (copying() && !copyDone()) return
    if (seq.length >= MAX_PAIRS) {
      event = { kind: 'full', at: clock }
      play('wrong')
      return report()
    }
    if (copying()) collapse(true)
    seq += b
    syncPairs()
    addPair(seq.length - 1, b, true)
    event = { kind: 'pair', b, p: complement(b), at: clock }
    syncLetters()
    mine({ op: 'add', b })
  }
  const undo = () => {
    if (copying() && !copyDone()) return
    if (copying()) collapse(true)
    if (!seq.length) return
    undoLocal()
    mine({ op: 'undo' })
  }
  const clear = () => {
    if (copying()) collapse(true)
    if (!seq.length) return
    clearLocal()
    mine({ op: 'clear' })
  }
  const copy = () => {
    if (copying()) {
      if (!copyDone()) return
      collapse(true)
      event = { kind: 'joined', at: clock }
      play('part')
      return mine({ op: 'keep' })
    }
    if (seq.length < 3) {
      event = { kind: 'needMore', at: clock }
      play('wrong')
      return report()
    }
    copyStart = clock
    event = { kind: 'copying', at: clock }
    startCopyViews(true)
    mine({ op: 'copy' })
  }
  let twistSent = 0
  const setTwist = x => {
    const v = Math.max(0, Math.min(1, Number(x)))
    if (!Number.isFinite(v)) return
    twist = v
    dirty = true
    // a slider sends a few times a second, its last value always (adding-a-wing.md)
    if (clock - twistSent > 0.25) {
      twistSent = clock
      ctx.share('bench')
    } else at(0.3, () => ctx.share('bench'))
    report()
    checkFinds()
  }

  // ---- the camera and taps ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 2.5
  controls.maxDistance = 24
  controls.maxPolarAngle = 1.62
  controls.target.set(0, LIFT, 0)
  const ray = new THREE.Raycaster()
  let down = null
  const onDown = e => {
    down = { x: e.clientX, y: e.clientY }
  }
  const helixHit = r => {
    const targets = []
    for (const D of duplexes) {
      if (D.atoms.count) {
        D.atoms.computeBoundingSphere()
        targets.push(D.atoms)
      }
      for (const s of [0, 1]) if (D.rails[s]) targets.push(D.rails[s])
    }
    for (const v of views) if (!v.gone) targets.push(...v.slabs)
    return r.intersectObjects(targets, false)[0] ?? null
  }
  const onUp = e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) {
      down = null
      return
    }
    down = null
    const r = canvas.getBoundingClientRect()
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
    if (seq.length && helixHit(ray)) return copy()
    if (verse.hits(ray)) verse.open()
  }

  // the axis lies across a wide screen and stands up on an upright one (reading top to bottom)
  // (turned 20 degrees about the vertical on a wide screen, so the rungs show a little of their faces)
  const qWide = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -20 * DEG).multiply(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))))
  const qTall = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0)))
  const frame = dt => {
    const free = ctx.engine.freeShare()
    const w = (canvas.clientWidth || 1) * free.w
    const h = (canvas.clientHeight || 1) * free.h
    // (by the screen's way up: on an upright phone the strip the verse takes must not lay the helix down)
    upright = (canvas.clientWidth || 1) < (canvas.clientHeight || 1) * 0.9 && w / h < 1.6
    orient.quaternion.slerp(upright ? qTall : qWide, 1 - Math.exp(-dt * 4))
    const half = Math.max(1.2, ((seq.length ? target(seq.length - 1).z : 0) * S) / 2 + 0.6)
    const across = copying() ? SEP + 1.2 : 1.45
    const [halfW, halfH] = upright ? [across, half] : [half, across]
    // an upright helix stands clear of the table
    const wantY = upright ? Math.max(LIFT, half + 0.9) : LIFT + (copying() ? 0.55 : 0)
    orient.position.y += (wantY - orient.position.y) * Math.min(1, dt * 3)
    controls.target.y += (orient.position.y - controls.target.y) * Math.min(1, dt * 3)
    const tanV = Math.tan((camera.fov * DEG) / 2)
    const tanH = tanV * camera.aspect
    // (the yaw shortens the helix across the view a little)
    const want = Math.max(4, (halfH * 1.12) / (tanV * free.h), (halfW * (upright ? 1.05 : 0.98)) / (tanH * free.w)) + 0.4
    const d = camera.position.distanceTo(controls.target)
    if (d < want * 0.94 || d > want * 1.4) camera.position.sub(controls.target).setLength(d + (want - d) * Math.min(1, dt * 2)).add(controls.target)
  }

  // the passage in the sky's free corner: between the tray and the card, under the top bar
  const placeVerse = () => {
    const card = document.querySelector('[data-dna-card]')?.getBoundingClientRect()
    const trayBox = document.querySelector('[data-dna-tray]')?.getBoundingClientRect()
    const r = canvas.getBoundingClientRect()
    if (!verse.group.visible || !card || !trayBox) {
      verse.group.visible = false
      return setCover(verseCover, null)
    }
    const D = 16
    const perPx = (2 * D * Math.tan((camera.fov * DEG) / 2)) / (r.height || 1)
    // the words' height as written (8 m wide), once troika has laid them out
    const block = verse.group.children[0]
    const b = block?.children[0]?.textRenderInfo?.blockBounds
    const tall = b ? (-b[1] + 0.3 * 1.3) * block.scale.y : 3
    if (r.width < 640) {
      // an upright phone: across the top, under the card; it covers that strip, so the helix keeps below
      const w = r.width - 40
      // (no taller than a fifth of the screen)
      const k = Math.min((w * perPx) / 8, (r.height * 0.2 * perPx) / tall)
      const y = card.bottom + 10
      screenPoint(r.left + r.width / 2, y, D, verse.group.position)
      verse.group.scale.setScalar(k)
      return setCover(verseCover, { side: 'top', size: y - r.top + (tall * k) / perPx + 8 })
    }
    setCover(verseCover, null)
    const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar')) || 56
    const left = r.left + 20
    const right = card.left - 20
    const room = Math.min(trayBox.top - 8, r.top + r.height * 0.42) - (top + 12)
    const w = right - left
    verse.group.visible = w > 220 && room > 70
    if (!verse.group.visible) return
    // scaled to the corner's width, and no taller than its height
    const k = Math.min((w * perPx) / 8, (room * perPx) / tall)
    screenPoint(left + w / 2, top + 12, D, verse.group.position)
    verse.group.scale.setScalar(k)
  }

  let reportAt = 0
  const update = (dt, t) => {
    clock = t
    verse.face()
    placeVerse()
    sky.userData.update(t)
    controls.update()
    frame(dt)
    placeTray(t)
    // things due
    if (events.length) {
      const due = events.filter(e => e.at <= clock)
      events = events.filter(e => e.at > clock)
      for (const e of due) e.fn()
    }
    if (level() !== drawnLevel) {
      restyle()
      syncLetters()
    }
    // the duplexes: each turns slowly about its own axis (not while copying); a copy stands at its place
    const busy = copying() && !copyDone()
    for (const D of duplexes) {
      if (!busy) D.spin += dt * 0.16
      D.group.rotation.z = D.spin
      const off = D.pos
      D.group.position.y += (off - D.group.position.y) * (busy ? 1 : Math.min(1, dt * 2.5))
    }
    spin = duplexes[0].spin
    let moved = easePairs(dt) || dirty || busy
    // anything flying or leaving moves
    if (views.some(v => v.at != null || v.leaving != null)) moved = true
    if (moved) {
      for (const v of views) {
        if (v.gone) continue
        v.hidden = !placeView(v)
        drawView(v)
      }
      for (const v of views) if (v.done && !v.gone) dropView(v)
      views = views.filter(v => !v.gone)
      for (const D of duplexes) {
        const top = Math.max(0, ...views.filter(v => v.d === D.d).map(v => v.slot + 1))
        D.atoms.count = top * MAX_ATOMS
        D.sticks.count = top * MAX_STICKS
      }
      drawRails()
      dirty = false
    }
    drawBonds(t)
    placeLetters()
    stepBurst(dt)
    // the copy's phases reach the HUD as they come
    const ph = phase()
    if (ph !== reportedPhase) {
      reportedPhase = ph
      if (ph === 'copied') {
        event = { kind: 'copied', at: clock }
        checkFinds()
      }
      report()
    } else if (t - reportAt > 1) {
      reportAt = t
      report()
    }
    beadMat.opacity = 0.75 + Math.sin(t * 3) * 0.2
  }

  const offs = []
  const attach = () => {
    camera.position.set(0, LIFT + 1.6, 7.5)
    controls.target.set(0, LIFT, 0)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    offs.push(room.on('members', () => report()))
    restyle()
    event = null
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    setCover(verseCover, null)
    controls.dispose()
    offs.forEach(off => off())
    store.set({ dna: null, dnaCelebrate: null })
  }

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.6, bloom: { strength: 0.6, radius: 0.45, threshold: 0.78 }, fov: 50 },
    attach,
    detach,
    update,
    refresh: () => report(),
    shared,
    // what the shared probe uses, one by one (an orbit world: no walking; tools/shared_steps/dna.json has
    // the rest): the four letters and a tap on the helix
    interactables: [
      ...BASES.map(b => ({ id: `base-${b}`, onUse: () => add(b) })),
      { id: 'helix', onUse: () => (seq.length ? copy() : null) },
    ],
    // what the HUD and the probes use (tools/shared_steps/dna.json, tools/dna_probe.py)
    add,
    undo,
    clear,
    copy,
    setTwist,
    tapHelix: () => (seq.length ? copy() : null),
    state: () => ({ ...getState(), phase: phase(), views: views.length, upright }),
    dispose() {
      verse.dispose()
      for (const m of letterMeshes) m.dispose()
      for (const g of Object.values(slabGeo).flat()) g.dispose()
      for (const D of duplexes) for (const s of [0, 1]) D.rails[s]?.geometry.dispose()
      sphereGeo.dispose()
      stickGeo.dispose()
      beadGeo.dispose()
    },
  }
}
