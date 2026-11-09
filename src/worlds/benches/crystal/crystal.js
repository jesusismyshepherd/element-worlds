// Growing Crystals: a bench of the Molecule Lab (/lab/crystal; registry.js BENCHES). The lab makes an
// ionic compound as two Atomlings held by a thread; in a real crystal there are no molecules: every ion
// sits among ions of the other charge. Here a glass dish of salt water (or a hot melt) on the lab's table:
// ions drift in it, and when the water evaporates (the melt cools) they stack into a crystal, ion by ion,
// on a thread: a perfect cube when slow, a hopper crystal (hollow, stepped faces) when fast, with salt
// boats floating on fast-drying brine. Tap an ion: its neighbours light up. A grain of real salt beside it
// says how many ions that is. docs/knowledge/crystal.md; the folder's README maps the files.
//
// Shared in a room (docs/knowledge/multiplayer.md): the dish (compound, speed, seed, how long it has been
// growing). The growth is a pure function of those (grow.js, plan.js), so everyone's crystal grows the
// same, ion for ion. Taps, the camera, the small ions and the grain stay each one's own.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { element } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { makeText } from '../../../engine/text.js'
import { nightSky } from '../../common/sky.js'
import { skyVerse } from '../../common/verse.js'
import { markFound, isFound } from '../../../engine/progress.js'
import { play } from '../../../audio/sound.js'
import { room } from '../../../net/room.js'
import { track } from '../../../net/telemetry.js'
import { COMPOUND, COMPOUNDS, STRUCTURES, CATION, ANION, IONS, radiusOf, chargeText, grainCount } from './lattice.js'
import { Crystal, capacity } from './grow.js'
import { planDish, grown, remaining, FINDS, cleanDish } from './plan.js'
import { makeDish } from './dish.js'

const TOP = 0.5 // the table's top
const PM = 3.3e-4 // metres of the scene per picometre: the crystals are drawn at one scale
const HANG = 0.86 // the thread crystal's middle above the dish's floor (higher for a big one)
const COLOR = { [CATION]: '#ff8f2e', [ANION]: '#3ea6ff' } // cations warm, anions cool (the lab's charges)
const GLOW = { [CATION]: '#ff7a1a', [ANION]: '#1f72ff' }
const SMALL = 0.4 // the ions' size when shrunk to see inside
const FLIGHT = 0.6 // seconds an ion takes from the water to its place

export async function build(ctx) {
  const { camera, canvas, store, light } = ctx
  const root = new THREE.Group()
  root.name = 'bench-crystal'

  // ---- the room: the lab's round table of light under the stars ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
  // (hidden when the camera has come close to the dish: it would stand huge behind the top bar)
  const verse = skyVerse(ctx, 'crystal', { at: [0, 4.6, -9], width: 8, size: 0.3, opacity: 0.75, fits: () => ctx.canvas.clientHeight >= 500 && camera.position.distanceTo(controls.target) > 3.8 })
  root.add(verse.group)
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#0e1430', roughness: 0.5, metalness: 0.3 }))
  floor.rotation.x = -Math.PI / 2
  root.add(floor)
  const table = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.5, 64), new THREE.MeshStandardMaterial({ color: '#18204a', roughness: 0.35, metalness: 0.5 }))
  table.position.y = 0.25
  root.add(table)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.06, 8, 96), new THREE.MeshStandardMaterial({ color: '#7fd4ff', emissive: '#7fd4ff', emissiveIntensity: 1.4 }))
  rim.rotation.x = Math.PI / 2
  rim.position.y = TOP
  root.add(rim)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 0.85))
  const key = new THREE.DirectionalLight('#fff4e6', 1.1)
  key.position.set(4, 9, 6)
  root.add(key)
  const back = new THREE.DirectionalLight('#9fc4ff', 0.5)
  back.position.set(-5, 4, -6)
  root.add(back)

  // the dish, its water or melt, the light from above, the thread (dish.js)
  const dish = makeDish({ light, top: TOP })
  root.add(dish.group)
  const FLOOR = dish.floorY

  // ---- materials for the ions ----
  const sphere = light ? new THREE.IcosahedronGeometry(1, 1) : new THREE.SphereGeometry(1, 18, 14)
  const ionMat = k => new THREE.MeshStandardMaterial({ color: COLOR[k], emissive: GLOW[k], emissiveIntensity: 0.14, roughness: 0.42, metalness: 0 })
  const mats = { [CATION]: ionMat(CATION), [ANION]: ionMat(ANION) }
  // the ions drifting in the water glow a little more: they are free
  const driftMats = { [CATION]: ionMat(CATION), [ANION]: ionMat(ANION) }
  driftMats[CATION].emissiveIntensity = 0.55
  driftMats[ANION].emissiveIntensity = 0.5
  const haloGeo = new THREE.SphereGeometry(1, 20, 14)
  // a glowing outline round an ion (bright at the sphere's edge, clear in its middle), seen through the others
  const haloMat = k => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(k === 'me' ? '#fff1c4' : COLOR[k]) }, uAmp: { value: k === 'me' ? 1.6 : 1.1 } },
    vertexShader: /* glsl */ `
      varying float vRim;
      void main() {
        vec3 n = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vRim = 1.0 - abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uAmp;
      varying float vRim;
      void main() { gl_FragColor = vec4(uColor * uAmp * (pow(vRim, 2.2) + 0.08), 1.0); }`,
  })
  const halos = { me: haloMat('me'), [CATION]: haloMat(CATION), [ANION]: haloMat(ANION) }
  const hugMat = new THREE.MeshBasicMaterial({ color: '#ffd76a', transparent: true, opacity: 0.95, depthWrite: false, depthTest: false })
  const hugGeo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true)
  const polyMat = new THREE.MeshBasicMaterial({ color: '#ffe08a', transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const polyEdge = new THREE.LineBasicMaterial({ color: '#ffe9b0', transparent: true, opacity: 0.7, depthTest: false })
  const flashMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })

  // ---- the state: the dish everyone in a room shares ----
  // c: the compound, s: the speed (0 slow to 1 fast), seed, age: seconds since it started (null: waiting
  // for a tap), by: who started it
  let dishState = { c: 'NaCl', s: 0.15, seed: 1, age: null, by: null }
  let plan = planDish(dishState.c, dishState.s, dishState.seed)
  let views = [] // per crystal of the plan: its model and its drawing
  let inside = false // the ions shrunk to see inside (mine)
  let tapped = null // { k, i }: the ion I tapped
  let celebrated = new Set() // crystal ids whose finish has been told
  let party = null
  let nucleated = false
  let lastClink = 0
  let glide = null // the camera gliding to a tapped ion (or back)
  let clinkTurn = 0
  let clock = 0
  const me = () => room.me?.id ?? 'solo'

  // ---- drifting ions: free in the water, Brownian ----
  const DRIFT = light ? 70 : 170 // of each kind
  const drift = {}
  const driftDummy = new THREE.Object3D()
  for (const k of [CATION, ANION]) {
    const mesh = new THREE.InstancedMesh(sphere, driftMats[k], DRIFT)
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    root.add(mesh)
    const p = new Float32Array(DRIFT * 3)
    const v = new Float32Array(DRIFT * 3)
    const born = new Float32Array(DRIFT)
    drift[k] = { mesh, p, v, born, r: 0.05 }
    for (let i = 0; i < DRIFT; i++) placeDrift(k, i, true)
  }
  /** A drifting ion somewhere in the liquid (born: it swells in, a new one dissolved from the walls). */
  function placeDrift(k, i, now = false) {
    const d = drift[k]
    const a = Math.random() * Math.PI * 2
    const rr = Math.sqrt(Math.random()) * (dish.radius - 0.12)
    d.p[i * 3] = Math.cos(a) * rr
    d.p[i * 3 + 1] = FLOOR + 0.08 + Math.random() * Math.max(0.1, dish.level - 0.16)
    d.p[i * 3 + 2] = Math.sin(a) * rr
    d.v[i * 3] = d.v[i * 3 + 1] = d.v[i * 3 + 2] = 0
    d.born[i] = now ? -10 : clock
  }

  // ---- the hosts: the compound's two Atomlings on the table ----
  let hosts = []
  const makeHosts = () => {
    for (const h of hosts) {
      root.remove(h.holder)
      h.charge.dispose()
    }
    const cmp = COMPOUND[dishState.c]
    hosts = [[cmp.cation, CATION, -1], [cmp.anion, ANION, 1]].map(([sym, k, side]) => {
      const a = createAtomling(element(sym), { light, hoop: false })
      const holder = new THREE.Group()
      holder.scale.setScalar(0.7)
      holder.position.set(side * 2.2, TOP, 2.55)
      holder.add(a.root)
      a.poof()
      const q = IONS[sym].q
      const charge = makeText(chargeText(q), { size: 0.3, color: COLOR[k], outlineWidth: 0.02, outlineColor: '#0b0f24' })
      charge.position.set(0, a.body.height + 0.5, 0)
      holder.add(charge)
      root.add(holder)
      return { sym, k, a, holder, charge }
    })
  }

  // ---- a crystal's drawing ----
  const flights = [] // { view, k, inst, from, to, t0 }
  const flashes = []
  const flashGeo = new THREE.SphereGeometry(1, 12, 8)
  function makeView(spec) {
    const cmp = COMPOUND[plan.compound]
    const S = STRUCTURES[cmp.structure]
    const model = new Crystal(spec.grow)
    const cap = capacity(spec.grow)
    const unit = (cmp.a / S.div) * PM
    const radius = [radiusOf(cmp, CATION) * PM, radiusOf(cmp, ANION) * PM]
    const group = new THREE.Group()
    group.rotation.y = spec.turn
    const meshes = [CATION, ANION].map(k => {
      const mesh = new THREE.InstancedMesh(sphere, mats[k], Math.max(1, cap[k]))
      mesh.count = 0
      mesh.frustumCulled = false
      mesh.userData.crystal = spec.id
      mesh.userData.kind = k
      group.add(mesh)
      return mesh
    })
    root.add(group)
    const view = {
      spec, model, cap, total: cap[0] + cap[1], unit, radius, group, meshes,
      shown: 0, // ions drawn
      inst: [[], []], // per kind: instance -> site index
      slot: [], // per site: its instance in its kind's mesh
      lowY: 0,
      done: false,
      // the thread crystal hangs high enough that, full grown, it clears the dish's floor
      hang: FLOOR + Math.max(HANG, spec.grow.size * unit + radius[1] + 0.06),
    }
    if (spec.mode === 'thread') dish.hang(view.hang)
    view.local = (i, out = new THREE.Vector3()) => {
      const s = model.sites[i]
      return out.set(s.x * unit, s.y * unit, s.z * unit)
    }
    views.push(view)
    return view
  }
  const m4 = new THREE.Matrix4()
  const q0 = new THREE.Quaternion()
  const sc = new THREE.Vector3()
  const pv = new THREE.Vector3()
  /** The size an ion is drawn at: its radius, shrunk when looking inside (or when another is tapped). */
  const ionScale = (view, i) => {
    const s = view.model.sites[i]
    let f = inside ? SMALL : 0.96
    if (tapped && tapped.focus) {
      const near = tapped.k === view.spec.id && (tapped.i === i || tapped.nb.includes(i))
      f = near ? 0.96 : SMALL * 0.8
    }
    return view.radius[s.kind] * f
  }
  const writeIon = (view, i, at) => {
    const s = view.model.sites[i]
    const r = ionScale(view, i)
    m4.compose(at ?? view.local(i, pv), q0, sc.set(r, r, r))
    view.meshes[s.kind].setMatrixAt(view.slot[i], m4)
    view.meshes[s.kind].instanceMatrix.needsUpdate = true
  }
  const rewriteAll = () => {
    for (const view of views) {
      for (let i = 0; i < view.shown; i++) {
        const f = flights.find(fl => fl.view === view && fl.i === i)
        if (!f) writeIon(view, i)
      }
    }
  }

  /** Show the view's ions up to n: from the water (live: flying in from a drifting ion) or at once. */
  function showUpTo(view, n, live) {
    const model = view.model
    const many = n - view.shown > 40
    for (let i = view.shown; i < n && i < model.sites.length; i++) {
      const s = model.sites[i]
      const mesh = view.meshes[s.kind]
      const slot = mesh.count
      mesh.count += 1
      view.slot[i] = slot
      view.inst[s.kind][slot] = i
      if (s.y < view.lowY) view.lowY = s.y
      if (live && !many) {
        // a drifting ion of its kind comes over and takes the place; a new one dissolves elsewhere
        const d = drift[s.kind]
        const j = Math.floor(Math.random() * d.mesh.count)
        const from = new THREE.Vector3(d.p[j * 3], d.p[j * 3 + 1], d.p[j * 3 + 2])
        if (!d.mesh.count || from.distanceTo(view.group.position) > 2.2) {
          from.set(Math.random() - 0.5, Math.random() * 0.6, Math.random() - 0.5).normalize().multiplyScalar(0.9).add(view.group.position)
        } else placeDrift(s.kind, j)
        view.group.worldToLocal(from)
        flights.push({ view, i, from, to: view.local(i), t0: clock })
        writeIon(view, i, from)
      } else writeIon(view, i)
    }
    view.shown = Math.min(n, model.sites.length)
    for (const mesh of view.meshes) mesh.boundingSphere = null
  }

  /** Where each crystal is: the thread's in the middle, floating boats at the surface, the floor's on it. */
  function placeView(view) {
    const { spec, group, unit, radius } = view
    const x = spec.at[0] * dish.radius
    const z = spec.at[1] * dish.radius
    if (spec.mode === 'thread') group.position.set(0, view.hang, 0)
    else if (spec.mode === 'boat') {
      // its top level at the surface, sinking as it grows (and resting on the floor once the water is low)
      const topY = view.shown ? view.model.R : 0
      group.position.set(x, Math.max(FLOOR + radius[1], dish.surface - topY * unit + radius[1] * 0.3), z)
    } else group.position.set(x, FLOOR + radius[1] - view.lowY * unit, z)
  }

  // ---- the dish's life: start, grow, finish ----
  const disposeViews = () => {
    for (const v of views) {
      root.remove(v.group)
      for (const m of v.meshes) m.dispose()
    }
    views = []
    flights.length = 0
  }
  /** Set the dish as the state says (a new compound, speed or seed: a fresh dish). */
  function setDish(next, live) {
    const fresh = next.c !== dishState.c || next.s !== dishState.s || next.seed !== dishState.seed || next.age == null || (dishState.age != null && next.age < dishState.age - 1)
    const newCompound = next.c !== dishState.c
    dishState = { ...next }
    if (fresh) {
      clearTap()
      disposeViews()
      plan = planDish(dishState.c, dishState.s, dishState.seed)
      for (const c of plan.crystals) makeView(c)
      celebrated = new Set()
      nucleated = false
      party = null
      dish.setMedium(COMPOUND[dishState.c].medium, dishState.s)
      if (newCompound || !hosts.length) makeHosts()
      if (live && dishState.age != null) play('enter')
    }
    // not live (a newcomer, a saved dish): what has grown is there at once, told as done already
    if (!live && dishState.age != null) {
      for (const v of views) {
        if (grown(v.spec, dishState.age) >= 1) celebrated.add(v.spec.id)
      }
      nucleated = dishState.age > plan.crystals[0].start
    }
    report(true)
  }

  /** Grow every crystal to where the dish's age says, within a time budget (ms) for this frame. */
  function advance(live, budget) {
    if (dishState.age == null) return
    const t0 = performance.now()
    for (const v of views) {
      const want = Math.min(v.total, Math.ceil(grown(v.spec, dishState.age) * v.total))
      while (v.model.sites.length < want && !v.model.full && performance.now() - t0 < budget) v.model.step()
      const n = Math.min(want, v.model.sites.length)
      if (n > v.shown) {
        if (v.spec.id === 0 && !nucleated && live) {
          nucleated = true
          play('nucleus')
          // the seed crystal: a soft flash where it forms, seen from across the room
          const fm = new THREE.Mesh(flashGeo, flashMat.clone())
          fm.userData = { t0: clock, r: v.unit * 3, life: 1.4 }
          v.group.add(fm)
          flashes.push(fm)
        }
        nucleated = true
        const before = v.shown
        showUpTo(v, n, live)
        if (live && v.shown > before && clock - lastClink > 0.09) {
          lastClink = clock
          play('clink', { order: clinkTurn++ })
        }
      }
      v.done = v.model.full || (grown(v.spec, dishState.age) >= 1 && v.shown >= v.model.sites.length && v.model.sites.length >= want)
      if (v.done && !celebrated.has(v.spec.id)) {
        celebrated.add(v.spec.id)
        if (v.spec.id === 0) finished(v)
      }
      placeView(v)
    }
  }

  /** The thread crystal is done: the moment (and the discoveries, for whoever started the dish). */
  function finished(v) {
    const mine = dishState.by === me()
    const kind = plan.habit
    party = { kind, c: plan.compound, at: performance.now(), mine }
    play('celebrate')
    for (const h of hosts) h.a.hop?.()
    if (mine) {
      markFound(`bench:crystal:${plan.compound}`)
      if (kind === 'perfect') markFound('bench:crystal:perfect')
      if (kind === 'hopper') markFound('bench:crystal:hopper')
      track('bench', { id: 'crystal', op: 'grown', c: plan.compound, habit: kind, together: peers().length > 1 || undefined })
    }
    store.set({ crystalCelebrate: { ...party } })
    report(true)
  }

  // ---- what I do (the HUD and taps) ----
  const newSeed = () => (Math.floor(Math.random() * 2 ** 31) ^ Date.now()) >>> 0
  const start = (c = dishState.c, s = dishState.s) => {
    const cmp = COMPOUND[c] ? c : 'NaCl'
    setDish({ c: cmp, s: Math.round(Math.min(1, Math.max(0, s)) * 100) / 100, seed: newSeed(), age: 0, by: me() }, true)
    track('bench', { id: 'crystal', op: 'grow', c: cmp, s: dishState.s, together: peers().length > 1 || undefined })
    ctx.share('dish')
  }
  const pick = c => {
    if (!COMPOUND[c]) return
    start(c, dishState.s)
  }
  const setSpeed = s => start(dishState.c, s)
  const regrow = () => start(dishState.c, dishState.s)
  const setInside = on => {
    inside = !!on
    rewriteAll()
    track('bench', { id: 'crystal', op: 'inside', on: inside })
    report(true)
  }

  // ---- tapping an ion: its neighbours light up ----
  const marks = new THREE.Group()
  marks.renderOrder = 20
  let marksOf = null
  function clearTap() {
    if (marksOf) marksOf.group.remove(marks)
    marks.traverse(o => {
      if (o.geometry && o.geometry !== haloGeo && o.geometry !== hugGeo) o.geometry.dispose()
    })
    marks.clear()
    marksOf = null
    const had = !!tapped
    tapped = null
    if (had) {
      rewriteAll()
      // and back to the dish's middle
      glide = { t0: clock, from: controls.target.clone(), to: focus.clone(), d0: camera.position.distanceTo(controls.target), d1: camera.position.distanceTo(controls.target) }
    }
  }
  function tapIon(k, i) {
    const view = views.find(v => v.spec.id === k)
    if (!view || i < 0 || i >= view.shown) return
    clearTap()
    const nb = view.model.neighboursOf(i, view.shown)
    tapped = { k, i, nb, focus: true }
    const s = view.model.sites[i]
    const at = view.local(i)
    const halo = new THREE.Mesh(haloGeo, halos.me)
    halo.position.copy(at)
    halo.scale.setScalar(view.radius[s.kind] * 1.3)
    halo.userData.pulse = view.radius[s.kind] * 1.3
    halo.renderOrder = 22
    marks.add(halo)
    const pts = []
    for (const j of nb) {
      const t = view.model.sites[j]
      const p = view.local(j)
      pts.push(p.clone())
      const h = new THREE.Mesh(haloGeo, halos[t.kind])
      h.position.copy(p)
      h.scale.setScalar(view.radius[t.kind] * 1.15)
      h.renderOrder = 22
      marks.add(h)
      // a hug: a glowing thread from the tapped ion to each neighbour (the lab's ionic bond)
      const hug = new THREE.Mesh(hugGeo, hugMat)
      const d = p.clone().sub(at)
      hug.position.copy(at).addScaledVector(d, 0.5)
      hug.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
      hug.scale.set(view.unit * 0.11, d.length(), view.unit * 0.11)
      hug.renderOrder = 21
      marks.add(hug)
    }
    // for the Scientist: the coordination polyhedron (octahedron, cube, tetrahedron)
    if (ctx.level() === 'scientist' && pts.length >= 4) {
      try {
        const geo = new ConvexGeometry(pts)
        const poly = new THREE.Mesh(geo, polyMat)
        poly.renderOrder = 19
        marks.add(poly)
        marks.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), polyEdge))
      } catch {
        // four points in one plane: no polyhedron
      }
    }
    view.group.add(marks)
    marksOf = view
    rewriteAll()
    // the camera glides towards the tapped ion, a little closer if it was far
    const to = view.group.localToWorld(at.clone())
    glide = { t0: clock, from: controls.target.clone(), to, d0: camera.position.distanceTo(controls.target), d1: Math.min(camera.position.distanceTo(controls.target), 3.4) }
    const host = hosts.find(h => h.k === s.kind)
    host?.a.wave?.()
    play('select')
    if (markFound('bench:crystal:neighbours')) track('bench', { id: 'crystal', op: 'neighbours', c: plan.compound })
    report(true)
  }

  // ---- the grain: how many ions in a real grain 0.3 mm across (mine) ----
  let zoom = null // { t0, back }
  const grainMat = new THREE.MeshPhysicalMaterial({ color: '#dfe6f2', roughness: 0.45, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35, transparent: true, opacity: 0, emissive: '#8fa8d8', emissiveIntensity: 0.04 })
  // on the way out: a cube ten times wider at each step (10 nm, 100 nm, 1 µm...), each coming in from far
  // away and shrinking past, so the zoom is felt (the HUD says how wide the view is)
  const tens = []
  const tenGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1))
  for (let k = 1; k <= 6; k++) {
    const m = new THREE.LineSegments(tenGeo, new THREE.LineBasicMaterial({ color: '#a8d8ff', transparent: true, opacity: 0, depthWrite: false }))
    m.visible = false
    m.userData.k = k
    root.add(m)
    tens.push(m)
  }
  const grain = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 3, 0.06), grainMat)
  grain.visible = false
  root.add(grain)
  const ZOOM_S = 5.5
  const zoomOut = () => {
    if (!views[0]?.shown) return
    zoom = { t0: clock, back: false }
    clearTap()
    play('enter')
    if (markFound('bench:crystal:grain')) track('bench', { id: 'crystal', op: 'grain', c: plan.compound })
    report(true)
  }
  const zoomBack = () => {
    if (!zoom) return
    zoom = { t0: clock, back: true, from: zoomShare() }
  }
  /** How far the zoom has gone: 0 (the crystal) to 1 (the grain). */
  function zoomShare() {
    if (!zoom) return 0
    const u = Math.min(1, (clock - zoom.t0) / (zoom.back ? 1.2 : ZOOM_S))
    const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
    return zoom.back ? zoom.from * (1 - e) : e
  }
  /** The crystal's edge (m) and how many times a 0.3 mm grain is wider. */
  function sizes() {
    const v = views[0]
    if (!v) return null
    const b = v.model.bounds(v.shown || 1)
    const cmp = COMPOUND[plan.compound]
    const S = STRUCTURES[cmp.structure]
    const across = Math.max(1, ...b.max.map((m, a) => m - b.min[a])) * (cmp.a / S.div) * 1e-12 + 2 * radiusOf(cmp, ANION) * 1e-12
    return { across, times: 0.3e-3 / across }
  }

  // ---- in a room: who is here ----
  const here = '/lab/crystal'
  const peers = () => (room.active ? room.members.filter(m => m.path === here) : [])

  // ---- what the HUD shows ----
  let lastReport = 0
  function report(force = false) {
    const now = performance.now()
    if (!force && now - lastReport < 160) return
    lastReport = now
    const v0 = views[0]
    const shown = views.reduce((s, v) => s + v.shown, 0)
    const phase = dishState.age == null ? 'waiting' : !v0?.shown ? 'drift' : views.every(v => v.done) ? 'done' : 'grow'
    let tap = null
    if (tapped) {
      const view = views.find(v => v.spec.id === tapped.k)
      const s = view?.model.sites[tapped.i]
      if (s) {
        const cmp = COMPOUND[plan.compound]
        tap = { kind: s.kind, sym: s.kind === CATION ? cmp.cation : cmp.anion, other: s.kind === CATION ? cmp.anion : cmp.cation, n: tapped.nb.length, cn: STRUCTURES[cmp.structure].cn[s.kind] }
      }
    }
    const z = sizes()
    const by = dishState.by && dishState.by !== me() ? room.member?.(dishState.by)?.name ?? null : null
    store.set({
      crystal: {
        c: plan.compound,
        s: dishState.s,
        water: plan.water,
        habit: plan.habit,
        phase,
        count: shown,
        crystals: views.filter(v => v.shown).length,
        progress: dishState.age == null ? 0 : Math.min(1, dishState.age / plan.end),
        tap,
        inside,
        zoom: zoom && !zoom.back ? { share: zoomShare(), across: z?.across ?? 0, times: z?.times ?? 0, ...grainCount(plan.compound) } : null,
        found: FINDS.filter(f => isFound(`bench:crystal:${f}`)),
        grownAll: COMPOUNDS.map(c => ({ c: c.id, done: isFound(`bench:crystal:${c.id}`) })),
        by,
        together: peers().filter(m => m.id !== room.me?.id).map(m => ({ name: m.name, color: m.color })),
      },
    })
  }

  // ---- picking and the camera ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 1.6
  controls.maxDistance = 22
  controls.maxPolarAngle = 1.48
  const focus = new THREE.Vector3(0, TOP + 0.95, 0)
  controls.target.copy(focus)
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
    tapRay(ray)
  }
  function tapRay(caster) {
    if (zoom) return
    const targets = views.flatMap(v => v.meshes.filter(m => m.count > 0))
    const hit = caster.intersectObjects(targets, false)[0]
    if (hit && hit.instanceId != null) {
      const k = hit.object.userData.crystal
      const view = views.find(v => v.spec.id === k)
      const i = view?.inst[hit.object.userData.kind][hit.instanceId]
      if (i != null) return tapIon(k, i)
    }
    // the hosts: a wave
    const host = hosts.find(h => caster.intersectObject(h.holder, true).length)
    if (host) {
      host.a.wave?.()
      play('tap')
      return
    }
    // the water or the dish: start it when it waits
    if (dishState.age == null && caster.intersectObjects(dish.tappable, false).length) {
      start()
      return
    }
    if (verse.hits(caster)) return verse.open()
    if (tapped) {
      clearTap()
      report(true)
    }
  }

  // the camera keeps the dish in the part of the screen the HUD leaves free: when the world opens (while
  // the HUD's covers settle) and when the screen turns, never while the player has come closer on purpose
  let fitAspect = 0
  let fitUntil = 0
  function fit(force = false) {
    if (!force && Math.abs(camera.aspect - fitAspect) < 0.02 && clock > fitUntil) return
    fitAspect = camera.aspect
    const free = ctx.engine.freeShare()
    const tanUp = Math.tan((camera.fov * Math.PI) / 360)
    const tanAcross = tanUp * camera.aspect * free.w
    const radius = 2.7
    const want = Math.max(4.6, (radius * 1.15) / (tanUp * Math.max(0.5, free.h)), (radius + 0.3) / tanAcross)
    const dir = camera.position.clone().sub(controls.target)
    if (dir.lengthSq() < 1e-6) dir.set(0, 0.42, 1)
    camera.position.copy(controls.target).add(dir.setLength(want))
  }

  // ---- every frame ----
  const tmp = new THREE.Vector3()
  const update = (dt, t) => {
    clock = t
    verse.face()
    sky.userData.update(t)
    if (glide) {
      const u = Math.min(1, (t - glide.t0) / 0.8)
      const e = u * u * (3 - 2 * u)
      const dir = camera.position.clone().sub(controls.target)
      controls.target.lerpVectors(glide.from, glide.to, e)
      camera.position.copy(controls.target).add(dir.setLength(glide.d0 + (glide.d1 - glide.d0) * e))
      if (u >= 1) glide = null
    }
    controls.update()
    fit()
    if (dishState.age != null) dishState.age += dt
    // the liquid: the level falls as it evaporates (the melt's glow fades as it cools)
    const left = dishState.age == null ? 1 : remaining(plan, dishState.age)
    dish.update(dt, t, { left, speed: dishState.s, growing: dishState.age != null && left > 0, waiting: dishState.age == null, camera })
    advance(true, 5)
    // ions on their way to their places
    for (let f = flights.length - 1; f >= 0; f--) {
      const fl = flights[f]
      const u = Math.min(1, (t - fl.t0) / FLIGHT)
      const e = 1 - Math.pow(1 - u, 3)
      tmp.lerpVectors(fl.from, fl.to, e)
      tmp.y += Math.sin(u * Math.PI) * fl.view.unit * 1.5
      if (fl.i < fl.view.shown) writeIon(fl.view, fl.i, u < 1 ? tmp : undefined)
      if (u >= 1) {
        flights.splice(f, 1)
        if (!light && flashes.length < 30) {
          const fm = new THREE.Mesh(flashGeo, flashMat.clone())
          fm.position.copy(fl.to)
          fm.userData = { t0: t, r: fl.view.radius[fl.view.model.sites[fl.i].kind] }
          fl.view.group.add(fm)
          flashes.push(fm)
        }
      }
    }
    for (let f = flashes.length - 1; f >= 0; f--) {
      const fm = flashes[f]
      const u = (t - fm.userData.t0) / (fm.userData.life ?? 0.35)
      if (u >= 1) {
        fm.parent?.remove(fm)
        fm.material.dispose()
        flashes.splice(f, 1)
        continue
      }
      fm.scale.setScalar(fm.userData.r * (1 + u * 1.4))
      fm.material.opacity = 0.7 * (1 - u)
    }
    // the drifting ions: a random walk (each step a small random kick, the speed damped), kept in the liquid
    const live = dishState.age == null ? 1 : Math.max(0.15, left)
    for (const k of [CATION, ANION]) {
      const d = drift[k]
      const want = Math.round(DRIFT * (0.25 + 0.75 * live))
      d.mesh.count = want
      const r = radiusOf(COMPOUND[dishState.c], k) * PM * 0.96
      const kick = 0.9 * Math.sqrt(Math.min(dt, 0.05))
      const damp = Math.exp(-dt * 2.5)
      const top = dish.surface - r
      for (let i = 0; i < want; i++) {
        const j = i * 3
        d.v[j] = d.v[j] * damp + (Math.random() - 0.5) * kick
        d.v[j + 1] = d.v[j + 1] * damp + (Math.random() - 0.5) * kick
        d.v[j + 2] = d.v[j + 2] * damp + (Math.random() - 0.5) * kick
        let x = d.p[j] + d.v[j] * dt
        let y = d.p[j + 1] + d.v[j + 1] * dt
        let z = d.p[j + 2] + d.v[j + 2] * dt
        const rr = Math.hypot(x, z)
        const lim = dish.radius - 0.1
        if (rr > lim) {
          x *= lim / rr
          z *= lim / rr
          d.v[j] *= -0.5
          d.v[j + 2] *= -0.5
        }
        if (y > top) {
          y = top
          d.v[j + 1] = -Math.abs(d.v[j + 1])
        }
        if (y < FLOOR + r) {
          y = FLOOR + r
          d.v[j + 1] = Math.abs(d.v[j + 1])
        }
        d.p[j] = x
        d.p[j + 1] = y
        d.p[j + 2] = z
        const grow = Math.min(1, (t - d.born[i]) / 0.5)
        driftDummy.position.set(x, y, z)
        driftDummy.scale.setScalar(r * grow * (inside ? 0.7 : 1))
        driftDummy.updateMatrix()
        d.mesh.setMatrixAt(i, driftDummy.matrix)
      }
      d.mesh.instanceMatrix.needsUpdate = true
      // hidden while zoomed out to the grain
      d.mesh.visible = !zoom || zoomShare() < 0.25
    }
    // the tapped ion breathes
    for (const o of marks.children) if (o.userData.pulse) o.scale.setScalar(o.userData.pulse * (1 + Math.sin(t * 5) * 0.08))
    // the hosts face the camera and breathe
    for (const h of hosts) {
      h.holder.rotation.y = Math.atan2(camera.position.x - h.holder.position.x, camera.position.z - h.holder.position.z)
      h.a.update(dt, t, { speed: 0 })
      h.charge.quaternion.copy(camera.quaternion)
      h.charge.quaternion.premultiply(tmpQ.copy(h.holder.quaternion).invert())
    }
    // the grain: the crystal shrinks away and a real grain comes in
    const zs = zoomShare()
    if (zoom || grain.visible) {
      const z = sizes()
      const v0 = views[0]
      const times = z?.times ?? 1
      const Z = Math.pow(times, zs)
      for (const v of views) {
        v.group.scale.setScalar(1 / Z)
        v.group.visible = zs < 0.92
      }
      dish.setFade(1 - Math.min(1, zs * 1.6) * 0.7)
      const edge = v0 ? (z.across / 1e-12) * PM : 1
      const g = (edge * times) / Z
      const middle = v0?.hang ?? FLOOR + HANG
      grain.visible = zs > 0.02 && g < 40
      grain.scale.setScalar(g)
      grain.position.set(0, middle, 0)
      grainMat.opacity = Math.min(1, Math.max(0, (zs - 0.45) / 0.35))
      grain.rotation.y = (v0?.spec.turn ?? 0) + t * 0.15
      for (const m of tens) {
        const size = (edge * 10 ** m.userData.k) / Z
        const on = zoom && !zoom.back && size > 0.05 && size < 12 && 10 ** m.userData.k < times
        m.visible = !!on
        if (!on) continue
        m.scale.setScalar(size)
        m.position.set(0, middle, 0)
        m.rotation.y = grain.rotation.y
        // brightest when about the crystal's size on screen, faint far off and when tiny
        const l = Math.log10(size / edge)
        m.material.opacity = 0.75 * Math.max(0, 1 - Math.abs(l) / 1.3)
      }
      if (zoom?.back && zs <= 0) {
        zoom = null
        grain.visible = false
        for (const m of tens) m.visible = false
        for (const v of views) {
          v.group.scale.setScalar(1)
          v.group.visible = true
        }
        dish.setFade(1)
      }
    }
    report()
  }
  const tmpQ = new THREE.Quaternion()

  const attach = () => {
    camera.position.set(0, TOP + 2.8, 5.6)
    controls.target.copy(focus)
    fitUntil = clock + 1.5
    fit(true)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    if (!hosts.length) makeHosts()
    report(true)
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    controls.dispose()
    store.set({ crystal: null, crystalCelebrate: null })
  }

  setDish({ ...dishState }, false)

  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.22, bloom: { strength: 0.5, radius: 0.45, threshold: 0.82 }, fov: 50 },
    attach,
    detach,
    update,
    refresh: () => report(true),
    // nothing to walk up to: everything here is tapped or in the HUD (tools/shared_probe.py reads this)
    interactables: [],
    // shared with the room (net/shared.js): the dish
    shared: {
      dish: {
        get: () => ({ ...dishState, age: dishState.age == null ? null : Math.round(dishState.age * 100) / 100 }),
        set: (st, live, ago = 0) => {
          const next = cleanDish(st)
          if (!next) return
          if (next.age != null) next.age += ago
          setDish(next, live)
          // a saved or a newcomer's dish: grow it to where it stands now, a few ms each frame
          if (!live) advance(false, 40)
        },
      },
    },
    // what the HUD (and the probes) do
    pick,
    setSpeed,
    regrow,
    start: () => start(),
    setInside,
    zoomOut,
    zoomBack,
    clearTap: () => {
      clearTap()
      report(true)
    },
    // for the probes: tap ion i of crystal k (or the most surrounded one shown), jump the dish ahead
    tapIon: (k = 0, i) => {
      const v = views.find(x => x.spec.id === k)
      if (!v) return false
      if (i == null || i === 'inside') {
        // the ion nearest the camera (one a finger would tap), or the nearest with all its neighbours
        const full = i === 'inside'
        let best = -1
        let bestD = Infinity
        const cam = v.group.worldToLocal(camera.position.clone())
        for (let j = 0; j < v.shown; j++) {
          if (full && v.model.neighboursOf(j, v.shown).length < STRUCTURES[v.model.structure].cn[v.model.sites[j].kind]) continue
          const d = v.local(j, pv).distanceTo(cam)
          if (d < bestD) {
            best = j
            bestD = d
          }
        }
        i = best
      }
      tapIon(k, i)
      return true
    },
    skip: (seconds = 1000) => {
      if (dishState.age == null) start()
      dishState.age += seconds
      advance(false, 2000)
      report(true)
    },
    /** For the probes: the camera at distance d from the dish's middle, `up` radians above the table's
     *  plane, `around` radians round from the front; `y` lifts the point looked at. */
    view: (d = 4, up = 0.5, around = 0, y = 0) => {
      controls.target.set(0, focus.y + y, 0)
      camera.position.set(Math.sin(around) * Math.cos(up) * d, focus.y + y + Math.sin(up) * d, Math.cos(around) * Math.cos(up) * d)
      fitAspect = camera.aspect
      fitUntil = 0
      controls.update()
    },
    /** For the probes: the crystals as drawn, one short text (how many ions and a hash of where each one
     *  is): two screens of a room must show the same. */
    fingerprint: () => views.map(v => {
      let h = 0
      for (let i = 0; i < v.shown; i++) {
        const t = v.model.sites[i]
        h = (Math.imul(h, 31) + ((t.x * 73856093) ^ (t.y * 19349663) ^ (t.z * 83492791))) | 0
      }
      return `${v.shown}:${h >>> 0}`
    }).join(' '),
    state: () => ({ ...dishState, plan: { habit: plan.habit, end: plan.end, crystals: plan.crystals.length }, shown: views.map(v => v.shown), done: views.map(v => v.done), tapped, inside, zoom: !!zoom }),
    dispose() {
      verse.dispose()
      disposeViews()
      for (const h of hosts) h.charge.dispose()
      dish.dispose()
    },
  }
}
