// Reactions: a bench of the Molecule Lab (/lab/reactions; registry.js BENCHES). A long bench of light with
// two sides, before and after, and an arrow between. Pick a reaction (the HUD); it starts with one molecule
// of each kind, unbalanced. Tap a molecule to add another of it, its − to take one away; the HUD counts each
// element's atoms on both sides, green when they match. Balanced, tap the arrow: the molecules on the left
// let go of each other's hands, and the very same atoms (each one an Atomling you can follow) fly over the
// arrow into the places waiting on the right (the products, drawn as glowing outlines until then) and join
// hands there: nothing lost, nothing made. The energy is the real ΔH of the equation as written: an
// exothermic reaction flashes in its flame's colour and warms the bench; an endothermic one needs its
// energy switched on first (the sun lamp for photosynthesis, the burner for limestone, the battery for
// splitting water). docs/knowledge/reactions.md; the chemistry in chemistry.js, the words in words.js.
// Shared in a room (net/shared.js): the reaction, the coefficients, the switch, the water's state and each
// run, played on everyone's bench. Discoveries bench:reactions:<id>, each reaction balanced and run.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { element } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { traitsOf } from '../../../characters/traits.js'
import { makeText, formulaText } from '../../../engine/text.js'
import { nightSky } from '../../common/sky.js'
import { skyVerse } from '../../common/verse.js'
import { markFound, isFound } from '../../../engine/progress.js'
import { play } from '../../../audio/sound.js'
import { room } from '../../../net/room.js'
import { track } from '../../../net/telemetry.js'
import * as C from './chemistry.js'
import { say, molName } from './words.js'

const TOP = 0.62 // the bench's top
const MAXS = 1 // the Atomlings' largest size on the bench (the lab's); a crowded bench shrinks them
const HERE = '/lab/reactions'
// the run's timeline (s): the molecules shake, their hands let go, the atoms fly (staggered), each lands
const T_BREAK = 0.75
const T_FLY = 1.15
const FLIGHT = 1.15
const BACK = { BREAK: 0.2, FLY: 0.45, FLIGHT: 0.85 }
const SOURCE_COLOR = { light: '#ffd76a', heat: '#ff8a3d', power: '#8fd8ff' }

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const ease = u => u * u * (3 - 2 * u)

export async function build(ctx) {
  const { camera, canvas, store, light } = ctx
  const lang = ctx.lang()
  const level = () => ctx.level()
  const root = new THREE.Group()
  root.name = 'bench-reactions'

  // ---- the room: the lab's night under the stars, a long bench of light ----
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
  const verse = skyVerse(ctx, 'reactions', { at: [0, TOP + 3.6, -12], width: 6.2, size: 0.28, opacity: 0.7 })
  root.add(verse.group)
  // the floor fades into the night at its edge (a hard rim read as a grey dome behind the long bench)
  const floorTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.9)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  })()
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#0e1430', roughness: 0.5, metalness: 0.3, alphaMap: floorTex, transparent: true, depthWrite: false }))
  floor.rotation.x = -Math.PI / 2
  root.add(floor)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 1.3))
  const key = new THREE.DirectionalLight('#fff4e6', 1.6)
  key.position.set(4, 9, 6)
  root.add(key)

  const benchG = new THREE.Group()
  root.add(benchG)
  const molG = new THREE.Group()
  root.add(molG)
  const labelG = new THREE.Group()
  root.add(labelG)
  const fxG = new THREE.Group()
  root.add(fxG)

  const benchMat = new THREE.MeshStandardMaterial({ color: '#18204a', roughness: 0.35, metalness: 0.5 })
  const rimMat = new THREE.MeshStandardMaterial({ color: '#7fd4ff', emissive: '#7fd4ff', emissiveIntensity: 1.4 })
  const padMat = { L: new THREE.MeshBasicMaterial({ color: '#2b4a9c', transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }) }
  padMat.R = padMat.L.clone()
  padMat.R.color.set('#3b3a9c')
  const halfMat = { L: padMat.L.clone(), R: padMat.R.clone() }
  halfMat.L.opacity = 0.22
  halfMat.R.opacity = 0.22
  const midMat = halfMat.L.clone()
  midMat.color.set('#4a3f9c')
  midMat.opacity = 0.14
  const RIM = new THREE.Color('#7fd4ff')

  // where things go: 'wide' (a computer, a phone on its side: before on the left, after on the right) or
  // 'tall' (an upright phone: a bench in two tiers, before on a raised shelf at the back, after in front,
  // the arrow pointing down from one to the other; on one level the tall molecules in front hid the back row)
  let tall = false
  let geo = null
  const SH = 2.3 // the shelf's height over the bench (tall)
  const geometry = () => (tall
    ? {
      slabs: [{ x0: -3.9, x1: 3.9, z0: -0.5, z1: 4.4, top: TOP }, { x0: -3.9, x1: 3.9, z0: -4.7, z1: -0.5, top: TOP + SH }],
      L: { cx: 0, cz: -2.65, y: SH, width: 7.2, depth: 2.6, labelZ: -0.95 },
      R: { cx: 0, cz: 2.2, y: 0, width: 7.2, depth: 2.6, labelZ: 3.95 },
      halves: { L: { x: 0, z: -2.6, w: 7.4, d: 3.8, y: SH }, R: { x: 0, z: 2.3, w: 7.4, d: 3.6, y: 0 } },
      mid: { x: 0, z: 0, w: 7.4, d: 0.9 },
      arrow: { at: V3(0, TOP + 0.85, 0.05), rot: [0, -Math.PI / 2, -0.5] },
      sideLabel: { L: V3(-2.4, TOP + SH - 0.42, -0.47), R: V3(-2.4, TOP - 0.3, 4.42) },
    }
    : {
      slabs: [{ x0: -8.2, x1: 8.2, z0: -2.2, z1: 2.2, top: TOP }],
      L: { cx: -4.45, cz: -0.45, y: 0, width: 6.7, depth: 3.0, labelZ: 1.72 },
      R: { cx: 4.45, cz: -0.45, y: 0, width: 6.7, depth: 3.0, labelZ: 1.72 },
      halves: { L: { x: -4.45, z: 0, w: 7.1, d: 3.9, y: 0 }, R: { x: 4.45, z: 0, w: 7.1, d: 3.9, y: 0 } },
      mid: { x: 0, z: 0, w: 1.8, d: 3.9 },
      arrow: { at: V3(0, TOP + 0.55, -0.2), rot: [0, 0, 0] },
      sideLabel: { L: V3(-4.45, TOP - 0.3, 2.22), R: V3(4.45, TOP - 0.3, 2.22) },
    })

  // ---- the bench: a slab of night with a rim of light (two, one behind and above the other, upright) ----
  let benchParts = []
  const buildBench = () => {
    for (const m of benchParts) {
      benchG.remove(m)
      m.geometry?.dispose()
    }
    benchParts = []
    for (const sl of geo.slabs) {
      const w = sl.x1 - sl.x0
      const d = sl.z1 - sl.z0
      const slab = new THREE.Mesh(new RoundedBoxGeometry(w, sl.top, d, 4, 0.12), benchMat)
      slab.position.set((sl.x0 + sl.x1) / 2, sl.top / 2, (sl.z0 + sl.z1) / 2)
      // the rim of light round its top
      const cx = (sl.x0 + sl.x1) / 2
      const cz = (sl.z0 + sl.z1) / 2
      const hw = w / 2 - 0.06
      const hd = d / 2 - 0.06
      const rr = 0.3
      const pts = []
      const corner = (x, z, a0) => {
        for (let i = 0; i <= 8; i++) {
          const a = a0 + (i / 8) * (Math.PI / 2)
          pts.push(V3(cx + x + Math.cos(a) * rr, sl.top + 0.01, cz + z + Math.sin(a) * rr))
        }
      }
      corner(hw - rr, hd - rr, 0)
      corner(-hw + rr, hd - rr, Math.PI / 2)
      corner(-hw + rr, -hd + rr, Math.PI)
      corner(hw - rr, -hd + rr, Math.PI * 1.5)
      const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 200, 0.045, 8, true), rimMat)
      benchParts.push(slab, rim)
    }
    // each half's soft glow, and the arrow's stretch between them
    const plane = (r, mat, y) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), mat)
      m.rotation.x = -Math.PI / 2
      m.position.set(r.x, y, r.z)
      return m
    }
    benchParts.push(plane(geo.halves.L, halfMat.L, TOP + geo.halves.L.y + 0.005), plane(geo.halves.R, halfMat.R, TOP + geo.halves.R.y + 0.005), plane(geo.mid, midMat, TOP + 0.004))
    for (const m of benchParts) benchG.add(m)
  }

  // the arrow between the sides: tap it to run the reaction
  const arrowMat = new THREE.MeshStandardMaterial({ color: '#9fb4ff', emissive: '#7f9cff', emissiveIntensity: 0.5, roughness: 0.4 })
  const arrow = new THREE.Group()
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.13, 0.13), arrowMat)
  shaft.position.x = -0.2
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.5, 24), arrowMat)
  head.rotation.z = -Math.PI / 2
  head.position.x = 0.55
  const arrowHit = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 1.1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }))
  arrowHit.position.x = 0.1
  arrowHit.userData.tap = { kind: 'run' }
  arrow.add(shaft, head, arrowHit)
  root.add(arrow)
  const arrowGlow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 14), new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  arrowGlow.scale.set(1.4, 0.45, 0.45)
  arrow.add(arrowGlow)

  // ---- the energy sources (only the reaction that needs one shows it) ----
  const sources = {}
  const tapOf = kind => ({ kind })
  {
    // the sun lamp: a little sun on a stalk, its light pouring down onto the left side when on
    const g = new THREE.Group()
    const sunMat = new THREE.MeshStandardMaterial({ color: '#6b5a2a', emissive: '#ffd76a', emissiveIntensity: 0.15, roughness: 0.5 })
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 20), sunMat)
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 14), new THREE.MeshBasicMaterial({ color: '#ffd76a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    const rays = new THREE.Group()
    for (let i = 0; i < 12; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 8), sunMat)
      const a = (i / 12) * Math.PI * 2
      ray.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0)
      ray.rotation.z = a - Math.PI / 2
      rays.add(ray)
    }
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.7, 40, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe8a0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
    beam.position.y = -1.45
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 8), arrowHit.material)
    hit.userData.tap = tapOf('source')
    g.add(sun, halo, rays, beam, hit)
    let lamp = null
    if (!light) {
      lamp = new THREE.PointLight('#ffd76a', 0, 9, 1.6)
      lamp.position.y = -0.6
      g.add(lamp)
    }
    sources.light = {
      g, hit,
      set(level, t) {
        sunMat.emissiveIntensity = 0.15 + level * 2.6
        sunMat.color.set(level > 0.05 ? '#ffe9a8' : '#6b5a2a')
        halo.material.opacity = level * (0.22 + Math.sin(t * 3) * 0.04)
        beam.material.opacity = level * 0.07
        rays.rotation.z = t * 0.3
        if (lamp) lamp.intensity = level * 14
      },
    }
  }
  {
    // the burner: a ring of flames under the left side's molecule, as in a lime kiln
    const g = new THREE.Group()
    const metal = new THREE.MeshStandardMaterial({ color: '#59607a', metalness: 0.8, roughness: 0.35 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.07, 10, 48), metal)
    ring.rotation.x = Math.PI / 2
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.14, 20), new THREE.MeshStandardMaterial({ color: '#d2423c', roughness: 0.4 }))
    knob.position.set(1.05, 0.07, 0.25)
    const flames = []
    const flameMat = new THREE.MeshBasicMaterial({ color: '#ff8a3d', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const innerMat = new THREE.MeshBasicMaterial({ color: '#7fb4ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const n = light ? 8 : 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.6, 10), flameMat)
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 8), innerMat)
      f.position.set(Math.cos(a) * 0.75, 0.3, Math.sin(a) * 0.75)
      inner.position.set(Math.cos(a) * 0.75, 0.13, Math.sin(a) * 0.75)
      g.add(f, inner)
      flames.push({ f, a, k: i })
    }
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16), arrowHit.material)
    hit.position.y = 0.3
    hit.userData.tap = tapOf('source')
    g.add(ring, knob, hit)
    let glow = null
    if (!light) {
      glow = new THREE.PointLight('#ff8a3d', 0, 6, 1.6)
      glow.position.y = 0.6
      g.add(glow)
    }
    sources.heat = {
      g, hit,
      set(level, t) {
        flameMat.opacity = level * 0.75
        innerMat.opacity = level * 0.85
        for (const fl of flames) fl.f.scale.set(1, 0.4 + level * (0.8 + Math.sin(t * 13 + fl.k * 1.7) * 0.25 + Math.sin(t * 7.1 + fl.k) * 0.15), 1)
        knob.rotation.y = level * 1.4
        if (glow) glow.intensity = level * (7 + Math.sin(t * 11) * 1.2)
      },
    }
  }
  {
    // the battery: a cell with its two electrodes standing in the water, sparks and bubbles when connected
    const g = new THREE.Group()
    const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.0, 28), new THREE.MeshStandardMaterial({ color: '#2a2f3a', metalness: 0.4, roughness: 0.4 }))
    cell.rotation.z = Math.PI / 2
    cell.position.y = 0.31
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.305, 0.4, 28), new THREE.MeshStandardMaterial({ color: '#ffc23d', metalness: 0.5, roughness: 0.35 }))
    band.rotation.z = Math.PI / 2
    band.position.set(0.3, 0.31, 0)
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), new THREE.MeshStandardMaterial({ color: '#c8ccd8', metalness: 0.9, roughness: 0.2 }))
    tip.rotation.z = Math.PI / 2
    tip.position.set(0.56, 0.31, 0)
    const sparkMat = new THREE.MeshBasicMaterial({ color: '#bfe8ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const sparks = []
    for (let i = 0; i < (light ? 3 : 6); i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), sparkMat)
      g.add(s)
      sparks.push(s)
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.9), arrowHit.material)
    hit.position.y = 0.35
    hit.userData.tap = tapOf('source')
    g.add(cell, band, tip, hit)
    sources.power = {
      g, hit,
      set(level, t) {
        band.material.emissive.set('#8fd8ff')
        band.material.emissiveIntensity = level * (0.5 + Math.sin(t * 9) * 0.2)
        sparkMat.opacity = level * 0.95
        sparks.forEach((s, i) => {
          const a = t * 6 + i * 2.3
          s.position.set(0.62 + Math.sin(a * 1.7) * 0.12, 0.31 + Math.cos(a * 2.1) * 0.14, Math.sin(a) * 0.14)
          s.scale.setScalar(0.6 + Math.abs(Math.sin(a * 3.3)) * 0.8)
        })
      },
    }
  }
  for (const s of Object.values(sources)) {
    s.g.visible = false
    s.level = 0
    root.add(s.g)
  }
  const placeSources = () => {
    const L = geo.L
    sources.light.g.position.set(tall ? -2.9 : L.cx - 1.6, TOP + L.y + (tall ? 2.0 : 3.1), tall ? L.cz - 0.6 : -1.1)
    sources.heat.g.position.set(L.cx, TOP + L.y + 0.01, L.cz)
    sources.power.g.position.set(tall ? -3.7 : L.cx - L.width / 2 + 0.75, TOP + L.y, tall ? L.cz + 0.9 : L.cz + 0.95)
  }

  // ---- what happened: the flash, the embers, the warm bench ----

  let flashLight = null
  if (!light) {
    flashLight = new THREE.PointLight('#ffd166', 0, 14, 1.5)
    fxG.add(flashLight)
  }
  const EMBERS = light ? 40 : 90
  const emberPos = new Float32Array(EMBERS * 3)
  const emberGeo = new THREE.BufferGeometry()
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
  const sparkTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.3, 'rgba(255,255,255,0.6)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  // the burst of light as it happens (a soft sprite: a sphere's rim read as a glass dome), and the pool of
  // warmth (or of the energy taken in) on the bench under the new molecules
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: '#ffd166', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  flash.visible = false
  fxG.add(flash)
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: sparkTex, color: '#ffd166', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  pool.rotation.x = -Math.PI / 2
  pool.visible = false
  fxG.add(pool)
  const emberMat = new THREE.PointsMaterial({ color: '#ffb35a', map: sparkTex, size: light ? 0.3 : 0.22, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const embers = new THREE.Points(emberGeo, emberMat)
  embers.frustumCulled = false
  fxG.add(embers)
  const emberVel = new Float32Array(EMBERS * 3)
  let fx = null // { kind: 'exo' | 'endo', t0, color, strength }

  // ---- shared pieces of the molecules ----
  const handGeo = new THREE.SphereGeometry(0.13, 16, 12)
  const armGeo = new THREE.CapsuleGeometry(0.065, 1, 4, 10)
  const claspMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#a8ecff', emissiveIntensity: 0.9 })
  const ionMat = new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
  const ghostGeo = new THREE.SphereGeometry(1, 18, 12)
  const ghostStickGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 6)
  const ghostStickMat = new THREE.MeshBasicMaterial({ color: '#cfe0ff', transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false })
  const ghostMats = {}
  const ghostMat = el => (ghostMats[el] ??= new THREE.MeshBasicMaterial({ color: traitsOf(element(el)).body, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }))
  const placeArm = (m, from, to, r = 0.055) => {
    const d = to.clone().sub(from)
    const len = Math.max(0.01, d.length() - r * 2)
    m.position.copy(from).add(to).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
    m.scale.set(1, len, 1)
  }

  // ---- state ----
  let R = C.REACTIONS[0]
  let k = C.start(R)
  let phase = 'before' // 'before', 'running' (to after), 'after', 'returning' (to before)
  let runs = 0
  let on = false // the energy source switched on
  let water = 'l'
  let note = null
  let clock = 0
  let S = MAXS // the Atomlings' size the layout wants
  let Sv = MAXS // and as shown, easing to it (a molecule added: everything shrinks a little, smoothly)
  let lay = null // { L: { blocks, lift: [] }, R: ... }
  let layN = 0 // counts the layouts (the camera's fit follows them)
  const arranged = new Map()
  let anim = null // a run or a return under way
  let lastBalanced = false
  let celebrate = null

  // the molecules: real ones (Atomlings holding hands) and ghosts (the places waiting)
  // real[side][s] = [copy], copy = { side, s, c, f, atoms: [actor], bonds: [bond], formed }
  // ghosts[side][s] = [ghost], ghost = { group, f, side, s, c, fade, want }
  let real = { L: [], R: [] }
  let ghosts = { L: [], R: [] }
  let free = [] // atoms between molecules during a run
  let seq = 0
  const countOf = (side, s) => k[C.indexOf(R, side, s)]
  const formulas = side => (side === 'L' ? R.left : R.right)

  // ---- the layout ----
  const relayout = () => {
    const sizes = side => formulas(side).map(f => C.footprint(f))
    const counts = side => formulas(side).map((_, s) => countOf(side, s))
    const opts = side => ({ width: geo[side].width, depth: geo[side].depth, gap: 0.45, plus: 0.75, maxScale: MAXS })
    // one search per side, then the larger side again at the smaller scale (remembered: a tap and its undo
    // cost nothing the second time)
    const arrange = (side, o) => {
      const key = `${tall}:${formulas(side).join(',')}:${counts(side).join(',')}:${o.maxScale}`
      if (!arranged.has(key)) arranged.set(key, C.arrange(sizes(side), counts(side), o))
      return arranged.get(key)
    }
    const first = { L: arrange('L', opts('L')), R: arrange('R', opts('R')) }
    const scale = Math.min(first.L.scale, first.R.scale)
    lay = {}
    layN++
    for (const side of ['L', 'R']) {
      const res = first[side].scale <= scale + 1e-9 ? first[side] : arrange(side, { ...opts(side), maxScale: scale })
      lay[side] = { blocks: res.blocks, lift: sizes(side).map(sz => (sz.h / 2) * scale + 0.22) }
    }
    S = scale
  }
  /** Where copy c of species s on a side has its centre. */
  const centreOf = (side, s, c) => {
    const b = lay[side].blocks[s]
    const cell = b?.cells[c] ?? b?.cells.at(-1) ?? [0, 0, 0]
    const g = geo[side]
    return V3(g.cx + cell[0], TOP + g.y + lay[side].lift[s] + cell[1], g.cz + cell[2])
  }
  /** Where atom a of a molecule centred at p stands. */
  const atomAt = (f, a, p) => {
    const q = C.shapeOf(f)[a]
    return V3(p.x + q[0] * Sv, p.y + q[1] * Sv, p.z + q[2] * Sv)
  }

  // ---- Atomlings ----
  const newAtom = (el, at, pop = true) => {
    const a = createAtomling(element(el), { light, arms: false, hoop: false })
    const holder = new THREE.Group()
    holder.add(a.root)
    molG.add(holder)
    if (pop) a.poof()
    return { id: ++seq, el, a, holder, cur: at.clone(), r: C.bodyRadius(el), fly: null, drift: null, copy: null, idx: 0 }
  }
  // materials let go wait in the trash until no shader compile is under way: three.js polls the materials of
  // a compile in progress, and one disposed under it ("reading 'isReady'") left a latecomer's bench loading
  // for ever (the room's state came in while the engine was still warming the bench's shaders)
  const trash = []
  const dropAtom = actor => {
    molG.remove(actor.holder)
    actor.holder.traverse(o => o.isMesh && o.geometry?.dispose())
    for (const m of Object.values(actor.a.mats)) if (m?.dispose) trash.push(m)
  }

  // ---- bonds: arms from each atom meeting at a glowing clasp (the lab's), or an ionic thread ----
  const makeBond = (A, B, order, ionic) => {
    const b = { A, B, order, ionic, g: 0, want: 1, parts: [] }
    if (ionic) {
      b.link = new THREE.Mesh(armGeo, ionMat)
      molG.add(b.link)
    } else {
      for (let n = 0; n < order; n++) {
        const p = { armA: new THREE.Mesh(armGeo, A.a.mats.hand), armB: new THREE.Mesh(armGeo, B.a.mats.hand), clasp: new THREE.Mesh(handGeo, claspMat), k: n }
        molG.add(p.armA, p.armB, p.clasp)
        b.parts.push(p)
      }
    }
    return b
  }
  const dropBond = b => {
    if (b.link) molG.remove(b.link)
    for (const p of b.parts) molG.remove(p.armA, p.armB, p.clasp)
  }
  const bondsFor = cp => {
    const g = C.MOLECULES[cp.f]
    return g.bonds.map(bd => makeBond(cp.atoms[bd[0]], cp.atoms[bd[1]], bd[2], C.isIonic(g, bd)))
  }

  // ---- copies ----
  const newCopy = (side, s, c, pop = true) => {
    const f = formulas(side)[s]
    const p = centreOf(side, s, c)
    const cp = { side, s, c, f, atoms: [], bonds: [], formed: true, ph: s * 1.7 + c * 0.9 }
    cp.atoms = C.MOLECULES[f].atoms.map((el, a) => {
      const actor = newAtom(el, atomAt(f, a, p), pop)
      actor.copy = cp
      actor.idx = a
      return actor
    })
    cp.bonds = bondsFor(cp)
    if (!pop) for (const b of cp.bonds) b.g = 1
    return cp
  }
  const dropCopy = cp => {
    for (const b of cp.bonds) dropBond(b)
    for (const a of cp.atoms) a && dropAtom(a)
  }
  const newGhost = (side, s, c) => {
    const f = formulas(side)[s]
    const g = C.MOLECULES[f]
    const group = new THREE.Group()
    const spheres = g.atoms.map(el => {
      const m = new THREE.Mesh(ghostGeo, ghostMat(el))
      group.add(m)
      return m
    })
    const sticks = g.bonds.map(() => {
      const m = new THREE.Mesh(ghostStickGeo, ghostStickMat)
      group.add(m)
      return m
    })
    molG.add(group)
    return { group, spheres, sticks, f, side, s, c, fade: 0, want: 1 }
  }
  const dropGhost = gh => {
    molG.remove(gh.group)
  }

  /** Make the bench show k: the real side's molecules and the other side's ghosts, as many as k says.
   *  pop: new ones pop in (someone just added them). */
  const sync = (pop = true) => {
    relayout()
    const realSide = phase === 'after' ? 'R' : 'L'
    for (const side of ['L', 'R']) {
      const list = formulas(side)
      const isReal = side === realSide
      // a side's lists by species, kept where they still fit
      const want = list.map((_, s) => countOf(side, s))
      const keepReal = real[side].length === list.length ? real[side] : (real[side].flat().forEach(dropCopy), list.map(() => []))
      const keepGhost = ghosts[side].length === list.length ? ghosts[side] : (ghosts[side].flat().forEach(dropGhost), list.map(() => []))
      if (isReal) {
        keepGhost.flat().forEach(gh => (gh.want = 0))
        keepReal.forEach((copies, s) => {
          while (copies.length > want[s]) dropCopy(copies.pop())
          while (copies.length < want[s]) copies.push(newCopy(side, s, copies.length, pop))
        })
      } else {
        keepReal.flat().forEach(dropCopy)
        keepReal.forEach(cs => (cs.length = 0))
        keepGhost.forEach((gs, s) => {
          while (gs.filter(g => g.want).length > want[s]) {
            const g = [...gs].reverse().find(x => x.want)
            g.want = 0
          }
          const live = gs.filter(g => g.want)
          while (live.length < want[s]) {
            const g = newGhost(side, s, live.length)
            gs.push(g)
            live.push(g)
          }
          live.forEach((g, c) => (g.c = c))
        })
      }
      real[side] = keepReal
      ghosts[side] = keepGhost
    }
  }

  /** Clear everything and stand the bench as ph says, at once (a newcomer, a saved state, a new reaction). */
  const stand = ph => {
    if (anim) {
      anim.dest.flat().forEach(dropCopy)
      for (const cp of anim.leaving) cp.bonds.forEach(dropBond)
    }
    anim = null
    for (const side of ['L', 'R']) {
      real[side].flat().forEach(dropCopy)
      ghosts[side].flat().forEach(dropGhost)
      real[side] = []
      ghosts[side] = []
    }
    free.forEach(dropAtom)
    free = []
    phase = ph
    sync(false)
    Sv = S
    for (const side of ['L', 'R']) for (const g of ghosts[side].flat()) g.fade = g.want
    labels()
  }

  // ---- the words on the bench: each species' number, formula and name, its −, the + signs ----
  let labelParts = [] // { side, s, coef, formula, name, state, minus, hit, pad, plus }
  let sideWords = []
  const clearLabels = () => {
    for (const l of labelParts) {
      for (const m of [l.coef, l.formula, l.name, l.state, l.minus, l.hit, l.pad, l.plus]) {
        if (!m) continue
        labelG.remove(m)
        m.traverse?.(o => {
          if (o.dispose) o.dispose()
          else if (o.isMesh) {
            o.geometry?.dispose()
            if (o.material !== hitMat && o.material !== padMat.L && o.material !== padMat.R && o.material?.dispose) trash.push(o.material)
          }
        })
      }
    }
    labelParts = []
    for (const w of sideWords) {
      labelG.remove(w.kid, w.sci)
      w.kid.dispose()
      w.sci.dispose()
    }
    sideWords = []
  }
  const minusMat = new THREE.MeshBasicMaterial({ color: '#ff7a8a', transparent: true, opacity: 0.85 })
  const minusRing = new THREE.MeshBasicMaterial({ color: '#ffd0d6', transparent: true, opacity: 0.9 })
  const hitMat = arrowHit.material
  const SIZE = () => (tall ? 0.36 : 0.34)
  const widthOf = (f, size) => [...f.matchAll(/([A-Z][a-z]?)|(\d+)/g)].reduce((w, m) => w + (m[1] ? size * (m[1].length > 1 ? 1.05 : 0.66) : size * 0.42 * m[2].length), 0)
  const labels = () => {
    clearLabels()
    const size = SIZE()
    for (const side of ['L', 'R']) {
      formulas(side).forEach((f, s) => {
        const formula = formulaText(f, { size, color: '#ffffff' })
        const coef = makeText(String(countOf(side, s)), { size: size * 1.25, color: '#ffd166', outlineWidth: 0.015, outlineColor: '#0b0f24' })
        const name = makeText(molName(f, lang, 'explorer'), { font: 'body', size: size * 0.46, color: '#cfe0ff' })
        const state = makeText(`(${C.stateOf(f, water)})`, { font: 'body', size: size * 0.5, color: '#cfe0ff' })
        const minus = new THREE.Group()
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.17, 28), minusMat.clone())
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.17, 0.2, 28), minusRing.clone())
        const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.045), new THREE.MeshBasicMaterial({ color: '#0b0f24' }))
        bar.position.z = 0.001
        const mhit = new THREE.Mesh(new THREE.CircleGeometry(0.3, 12), hitMat)
        minus.add(disc, ring, bar, mhit)
        mhit.userData.tap = { kind: 'minus', side, s }
        const hit = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), hitMat)
        hit.userData.tap = { kind: 'add', side, s }
        const pad = new THREE.Mesh(new THREE.CircleGeometry(1, 40), padMat[side])
        pad.rotation.x = -Math.PI / 2
        const l = { side, s, f, coef, formula, name, state, minus, hit, pad, w: widthOf(f, size) }
        if (s > 0) l.plus = makeText('+', { size: size * 1.1, color: '#cfe0ff' })
        for (const m of [coef, formula, name, state, minus, hit, pad, l.plus]) m && labelG.add(m)
        labelParts.push(l)
      })
      const kid = makeText(say(lang, 'explorer', `side.${side}`).toUpperCase(), { size: 0.2, color: '#9fb4ff' })
      const sci = makeText(say(lang, 'scientist', `side.${side}`).toUpperCase(), { size: 0.2, color: '#9fb4ff' })
      labelG.add(kid, sci)
      sideWords.push({ side, kid, sci })
    }
    placeLabels()
  }
  const placeLabels = () => {
    if (!lay) return
    const size = SIZE()
    for (const l of labelParts) {
      const b = lay[l.side].blocks[l.s]
      const g = geo[l.side]
      if (!b) continue
      const cx = g.cx + (b.x0 + b.x1) / 2
      const y = TOP + g.y + 0.5
      const z = g.labelZ
      // the number, the formula, the minus in a row
      const coefW = size * 0.8
      const total = coefW + 0.1 + l.w + 0.14 + 0.36
      const x0 = cx - total / 2
      l.coef.position.set(x0 + coefW / 2, y + 0.02, z)
      l.formula.position.set(x0 + coefW + 0.1 + l.w / 2, y, z)
      l.minus.position.set(x0 + coefW + 0.1 + l.w + 0.14 + 0.18, y, z)
      l.name.position.set(x0 + coefW + 0.1 + l.w / 2, y - size * 1.0, z)
      l.state.position.set(x0 + coefW + 0.1 + l.w / 2, y - size * 0.95, z)
      if (l.plus) {
        const prev = lay[l.side].blocks[l.s - 1]
        l.plus.position.set(g.cx + (prev.x1 + b.x0) / 2, y + 0.02, z)
      }
      // the tap that adds one: the whole block, over its molecules, and the pad under them
      const depth = geo[l.side].depth + 0.3
      const height = (lay[l.side].lift[l.s] - 0.22) * 2 + 0.9
      l.hit.scale.set(Math.max(0.9, b.x1 - b.x0 + 0.2), height, depth)
      l.hit.position.set(cx, TOP + g.y + height / 2, g.cz)
      l.pad.scale.set(Math.max(0.6, (b.x1 - b.x0) / 2 + 0.25), Math.max(0.5, geo[l.side].depth / 2), 1)
      l.pad.position.set(cx, TOP + g.y + 0.008, g.cz)
    }
    for (const w of sideWords) {
      const p = geo.sideLabel[w.side]
      w.kid.position.copy(p)
      w.sci.position.copy(p)
    }
  }
  const setCoefs = () => {
    for (const l of labelParts) {
      const t = String(countOf(l.side, l.s))
      if (l.coef.text !== t) {
        l.coef.text = t
        l.coef.sync()
      }
      if (l.state.text !== `(${C.stateOf(l.f, water)})`) {
        l.state.text = `(${C.stateOf(l.f, water)})`
        l.state.sync()
      }
    }
  }

  // ---- what the HUD shows ----
  const peers = () => (room.active ? room.members.filter(m => m.path === HERE) : [])
  const together = () => peers().length > 1 || undefined
  const report = () => {
    const balanced = C.isBalanced(R, k)
    store.set({
      reactions: {
        id: R.id,
        list: C.REACTIONS.map(r => ({ id: r.id, icon: r.icon, done: isFound(`bench:reactions:${r.id}`) })),
        left: R.left, right: R.right, k: [...k],
        tally: C.tally(R, k),
        balanced,
        divisor: C.divisor(k),
        phase,
        needs: R.needs ?? null,
        on,
        water,
        waterChoice: C.waterChoice(R),
        dH: C.enthalpy(R, k, water),
        litres: balanced ? C.boilLitres(C.enthalpy(R, k, water)) : null,
        canAdd: C.speciesOf(R).map((_, i) => C.canAdd(R, k, i)),
        canRemove: C.speciesOf(R).map((_, i) => C.canRemove(R, k, i)),
        note,
        together: peers().filter(m => m.id !== room.me?.id).map(m => ({ name: m.name, color: m.color })),
        celebrate,
      },
    })
  }

  // ---- the runs ----
  /** Move the atoms of one side's molecules into the other side's places (to: 'R' runs it, 'L' goes back).
   *  Every atom keeps being the same Atomling: it lets go, flies, and takes a place of its own element. */
  const transfer = (to, mine) => {
    const from = to === 'R' ? 'L' : 'R'
    const T = to === 'R' ? { BREAK: T_BREAK, FLY: T_FLY, FLIGHT } : BACK
    const t0 = clock
    relayout()
    // the places waiting: copies with no atoms yet
    const dest = formulas(to).map((f, s) => Array.from({ length: countOf(to, s) }, (_, c) => ({ side: to, s, c, f, atoms: [], bonds: [], formed: false, arrived: 0, ph: s * 1.7 + c * 0.9 })))
    const leaving = real[from].flat()
    const fromList = leaving.flatMap(cp => cp.atoms.map(a => ({ id: a.id, el: a.el, x: tall ? a.cur.x + a.cur.z * 0.01 : a.cur.x, f: cp.f })))
    const toList = dest.flat().flatMap(cp => C.MOLECULES[cp.f].atoms.map((el, a) => {
      const p = atomAt(cp.f, a, centreOf(to, cp.s, cp.c))
      return { id: `${cp.s}.${cp.c}.${a}`, el, x: tall ? p.x + p.z * 0.01 : p.x, f: cp.f }
    }))
    const pairs = C.pairAtoms(fromList, toList, to === 'R' ? R.prefer : [])
    const actors = new Map(leaving.flatMap(cp => cp.atoms).map(a => [a.id, a]))
    const n = pairs.length
    const spread = Math.min(1.1, n * 0.035)
    pairs.forEach(([aid, slot], i) => {
      const actor = actors.get(aid)
      const [s, c, a] = slot.split('.').map(Number)
      actor.fly = { t0: t0 + T.FLY + (spread * i) / Math.max(1, n - 1), dur: T.FLIGHT * (0.9 + ((i * 37) % 10) / 50), to: dest[s][c], a, from: null, h: 0.9 + ((i * 53) % 7) * 0.1 + (tall ? 0.4 : 0) }
    })
    // the molecules leaving let go at the break, one after another
    leaving.forEach((cp, i) => (cp.breakAt = t0 + T.BREAK + (i % 6) * 0.05))
    anim = { to, from, t0, dest, leaving, mine, T, sounds: 0, done: false }
    phase = to === 'R' ? 'running' : 'returning'
    // the ghosts of where they leave from take their place when they have gone; the ghosts they fill fade as
    // each molecule forms
    ghosts[from].flat().forEach(dropGhost)
    ghosts[from] = formulas(from).map((_, s) => Array.from({ length: countOf(from, s) }, (_, c) => {
      const g = newGhost(from, s, c)
      g.fade = 0
      g.want = 0
      g.appearAt = t0 + T.FLY
      return g
    }))
    play('fly')
  }

  const finish = () => {
    const a = anim
    anim = null
    for (const cp of a.leaving) cp.bonds.forEach(dropBond)
    real[a.from] = formulas(a.from).map(() => [])
    real[a.to] = a.dest
    for (const g of ghosts[a.to].flat()) g.want = 0
    phase = a.to === 'R' ? 'after' : 'before'
    if (a.to === 'R') {
      const dH = C.enthalpy(R, k, water) ?? C.baseEnthalpy(R, water)
      const strength = Math.max(0.35, Math.min(1, Math.log10(Math.abs(dH)) / 3.4))
      if (dH < 0) {
        fx = { kind: 'exo', t0: clock, color: new THREE.Color(R.flame ?? '#ffd166'), strength }
        startEmbers()
        play('release', { order: strength > 0.85 ? 3 : strength > 0.6 ? 2 : 1 })
      } else {
        fx = { kind: 'endo', t0: clock, color: new THREE.Color(SOURCE_COLOR[R.needs] ?? '#ffd76a'), strength }
        play('absorb')
      }
      if (a.mine) {
        const id = `bench:reactions:${R.id}`
        if (markFound(id)) {
          celebrate = { id: R.id, at: performance.now() }
          setTimeout(() => play('celebrate'), 500)
          track('bench', { id: 'reactions', op: 'found', r: R.id, together: together() })
        }
      }
    }
    report()
  }

  // sparks of heat rising off the new molecules (born at their atoms, so they come from what was made)
  const startEmbers = () => {
    const atoms = real.R.flat().flatMap(cp => cp.atoms).filter(Boolean)
    const g = geo.R
    for (let i = 0; i < EMBERS; i++) {
      const a = atoms.length ? atoms[(i * 7) % atoms.length].cur : V3(g.cx, TOP + g.y + 0.8, g.cz)
      emberPos[i * 3] = a.x + (Math.random() - 0.5) * 0.7
      emberPos[i * 3 + 1] = a.y + (Math.random() - 0.5) * 0.5
      emberPos[i * 3 + 2] = a.z + (Math.random() - 0.5) * 0.7
      emberVel[i * 3] = (Math.random() - 0.5) * 0.25
      emberVel[i * 3 + 1] = 0.25 + Math.random() * 0.6
      emberVel[i * 3 + 2] = (Math.random() - 0.5) * 0.25
    }
    emberGeo.attributes.position.needsUpdate = true
  }

  /** Jump a run or a return to its end (someone else changed the bench meanwhile). */
  const settle = () => {
    if (!anim) return
    const to = anim.to
    stand(to === 'R' ? 'after' : 'before')
  }

  // ---- what the player does ----
  const tell = n => {
    note = n
    report()
  }
  const busy = () => phase === 'running' || phase === 'returning'
  const choose = (id, mine = true) => {
    const r = C.REACTION[id]
    if (!r) return
    R = r
    k = C.start(R)
    on = false
    note = null
    celebrate = null
    fx = null
    lastBalanced = C.isBalanced(R, k)
    // a new reaction's words on the bench, its source in its place
    for (const [kind, s] of Object.entries(sources)) s.g.visible = kind === R.needs
    stand('before')
    if (mine) {
      play('select')
      track('bench', { id: 'reactions', op: 'pick', r: R.id, together: together() })
      ctx.share('bench')
    }
    report()
  }
  const changeK = (i, d, mine = true) => {
    if (busy()) return
    if (phase === 'after') return tell('locked')
    if (d > 0 && !C.canAdd(R, k, i)) return tell(k[i] >= C.MAX_K ? 'most' : 'full')
    if (d < 0 && !C.canRemove(R, k, i)) return
    k = k.map((x, j) => (j === i ? x + d : x))
    note = null
    sync(true)
    placeLabels()
    setCoefs()
    play(d > 0 ? 'join' : 'part')
    const balanced = C.isBalanced(R, k)
    if (balanced && !lastBalanced) setTimeout(() => play('right'), 150)
    lastBalanced = balanced
    if (mine) {
      track('bench', { id: 'reactions', op: d > 0 ? 'add' : 'remove', r: R.id, f: C.speciesOf(R)[i], together: together() })
      ctx.share('bench')
    }
    report()
  }
  const add = i => changeK(i, 1)
  const remove = i => changeK(i, -1)
  const ready = () => phase === 'before' && C.isBalanced(R, k) && (!R.needs || on)
  const run = () => {
    if (busy()) return
    if (phase === 'after') return again()
    if (!C.isBalanced(R, k)) {
      play('wrong')
      return tell('unbalanced')
    }
    if (R.needs && !on) {
      play('wrong')
      return tell('needs')
    }
    note = null
    celebrate = null
    runs += 1
    transfer('R', true)
    track('bench', { id: 'reactions', op: 'run', r: R.id, m: C.multipleOf(R, k), together: together() })
    ctx.share('bench')
    report()
  }
  const again = () => {
    if (phase !== 'after') return
    note = null
    celebrate = null
    fx = null
    transfer('L', true)
    track('bench', { id: 'reactions', op: 'again', r: R.id, together: together() })
    ctx.share('bench')
    report()
  }
  const next = () => {
    const i = C.REACTIONS.indexOf(R)
    choose(C.REACTIONS[(i + 1) % C.REACTIONS.length].id)
  }
  const toggleSource = () => {
    if (!R.needs || busy()) return
    on = !on
    note = null
    play(on ? 'select' : 'tap')
    track('bench', { id: 'reactions', op: 'source', r: R.id, on, together: together() })
    ctx.share('bench')
    report()
  }
  const setWater = w => {
    if (!C.waterChoice(R) || (w !== 'l' && w !== 'g') || w === water) return
    water = w
    setCoefs()
    play('tap')
    track('bench', { id: 'reactions', op: 'water', r: R.id, w, together: together() })
    ctx.share('bench')
    report()
  }
  /** For probes and screenshots: the coefficients of the answer (times m). */
  const solve = (m = 1) => {
    if (busy()) return
    if (phase === 'after') stand('before')
    k = R.answer.map(x => x * m)
    sync(true)
    placeLabels()
    setCoefs()
    lastBalanced = C.isBalanced(R, k)
    ctx.share('bench')
    report()
  }

  // ---- shared with the room (net/shared.js) ----
  const shared = {
    bench: {
      get: () => ({
        r: R.id, k: [...k],
        // a run under way is where it goes
        ph: phase === 'running' || phase === 'after' ? 'after' : 'before',
        n: runs, on, w: water,
      }),
      set(s, live) {
        const c = C.clean(s)
        settle()
        if (c.r !== R.id) choose(c.r, false)
        on = c.on
        water = c.w
        const same = c.k.every((x, i) => x === k[i])
        if (!same) {
          if (phase === 'after') {
            k = c.k
            stand('before')
          } else if (live) {
            k = c.k
            sync(true)
            placeLabels()
            play('join')
          } else {
            k = c.k
            stand('before')
          }
        }
        lastBalanced = C.isBalanced(R, k)
        if (c.ph === 'after' && phase === 'before') {
          if (live && c.n > runs) transfer('R', false)
          else stand('after')
        } else if (c.ph === 'before' && phase === 'after') {
          if (live) transfer('L', false)
          else stand('before')
        }
        runs = c.n
        setCoefs()
        report()
      },
    },
  }

  // ---- taps ----
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 4
  controls.maxDistance = 40
  controls.maxPolarAngle = 1.48
  controls.minPolarAngle = 0.2
  controls.minAzimuthAngle = -1.1
  controls.maxAzimuthAngle = 1.1
  const ray = new THREE.Raycaster()
  const tapTargets = () => [
    arrowHit,
    ...labelParts.flatMap(l => (l.minus.visible ? [l.minus.children.at(-1), l.hit] : [l.hit])),
    ...Object.values(sources).filter(s => s.g.visible).map(s => s.hit),
  ]
  const hitAt = e => {
    const r = canvas.getBoundingClientRect()
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera)
    const hits = ray.intersectObjects(tapTargets(), false)
    // the minus and the sources before the big boxes they sit beside
    const order = { minus: 0, source: 1, run: 2, add: 3 }
    hits.sort((a, b) => (order[a.object.userData.tap.kind] - order[b.object.userData.tap.kind]) || a.distance - b.distance)
    return hits[0]?.object.userData.tap ?? null
  }
  const doTap = tap => {
    if (tap.kind === 'run') return run()
    if (tap.kind === 'source') return toggleSource()
    const i = C.indexOf(R, tap.side, tap.s)
    if (tap.kind === 'minus') return remove(i)
    if (tap.kind === 'add') return add(i)
  }
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
    const tap = hitAt(e)
    if (tap) return doTap(tap)
    if (verse.hits(ray)) verse.open()
  }
  let hoverAt = 0
  const onMove = e => {
    if (e.pointerType !== 'mouse' || down) return
    const now = performance.now()
    if (now - hoverAt < 60) return
    hoverAt = now
    canvas.style.cursor = hitAt(e) ? 'pointer' : ''
  }

  // ---- the camera: the whole bench in the part of the screen the HUD leaves free ----
  const view = () => (tall ? { target: V3(0, TOP + 1.4, 0.2), up: 0.5 } : { target: V3(0, TOP + 0.95, 0.1), up: 0.5 })
  // the distance at which the whole bench (its corners, the molecules over it, the sun lamp) fits the free
  // part of the screen, seen from the default direction; found by projecting them
  const fitCam = new THREE.PerspectiveCamera()
  let fitted = { key: '', d: 14 }
  const want = () => {
    const free = ctx.engine.freeShare()
    const key = `${camera.aspect.toFixed(3)}:${free.w.toFixed(3)}:${free.h.toFixed(3)}:${tall}:${R.needs}:${layN}`
    if (key === fitted.key) return fitted.d
    const v = view()
    const pts = []
    for (const sl of geo.slabs) for (const x of [sl.x0, sl.x1]) for (const z of [sl.z0, sl.z1]) for (const y of [0, sl.top]) pts.push(V3(x, y, z))
    // the molecules' tops (a stadium of rows stands high)
    for (const side of ['L', 'R']) {
      lay[side].blocks.forEach((b, i) => {
        const h = C.footprint(formulas(side)[i]).h * S
        for (const c of b.cells) for (const x of [b.x0, b.x1]) pts.push(V3(geo[side].cx + x, TOP + geo[side].y + lay[side].lift[i] + c[1] + h / 2 + 0.2, geo[side].cz + c[2]))
      })
    }
    if (R.needs === 'light') pts.push(sources.light.g.position.clone().add(V3(0, 1.2, 0)))
    fitCam.fov = camera.fov
    fitCam.aspect = camera.aspect
    fitCam.near = 0.1
    fitCam.far = 300
    fitCam.updateProjectionMatrix()
    const dir = V3(0, Math.sin(v.up), Math.cos(v.up))
    const fits = d => {
      fitCam.position.copy(v.target).addScaledVector(dir, d)
      fitCam.lookAt(v.target)
      fitCam.updateMatrixWorld()
      return pts.every(p => {
        const q = p.clone().project(fitCam)
        return Math.abs(q.x) <= free.w * 0.94 && Math.abs(q.y) <= free.h * 0.9 && q.z < 1
      })
    }
    let lo = 3
    let hi = 90
    for (let it = 0; it < 26; it++) {
      const mid = (lo + hi) / 2
      if (fits(mid)) hi = mid
      else lo = mid
    }
    fitted = { key, d: hi }
    return hi
  }
  let fitFrames = 0
  const placeCamera = () => {
    fitFrames = 90
    const v = view()
    controls.target.copy(v.target)
    const d = want()
    camera.position.set(v.target.x, v.target.y + Math.sin(v.up) * d, v.target.z + Math.cos(v.up) * d)
    camera.lookAt(v.target)
  }
  const orient = () => {
    const t = (canvas.clientWidth || 1) / (canvas.clientHeight || 1) < 0.85
    if (t === tall && geo) return false
    tall = t
    geo = geometry()
    buildBench()
    placeSources()
    arrow.position.copy(geo.arrow.at)
    // the passage in the sky: up on the right over a wide bench (the card has the top's middle), behind it upright
    // (smaller over an upright phone's bench, right of the sun lamp, under where the card reaches)
    verse.group.position.set(...(tall ? [1.7, TOP + SH + 2.15, -11] : [8.4, TOP + 2.9, -9.5]))
    verse.group.scale.setScalar(tall ? 0.8 : 1)
    arrow.rotation.set(...geo.arrow.rot)
    return true
  }

  // ---- every frame ----
  const tmp = V3()
  const shake = V3()
  const update = (dt, t) => {
    clock = t
    verse.face()
    sky.userData.update(t)
    if (orient()) {
      stand(phase === 'running' ? 'after' : phase === 'returning' ? 'before' : phase)
      placeCamera()
    }
    controls.update()
    if (trash.length && !ctx.engine.compiles?.size) trash.splice(0).forEach(m => m.dispose())
    Sv += (S - Sv) * Math.min(1, dt * 4)
    const sci = level() === 'scientist'
    const running = phase === 'running'

    // the run: hands let go, atoms fly, molecules form
    if (anim) {
      for (const cp of anim.leaving) {
        if (cp.broken || clock < cp.breakAt) continue
        cp.broken = true
        for (const b of cp.bonds) b.want = 0
        if (anim.sounds < 5) {
          play('part')
          anim.sounds++
        }
        // each atom bounces a little away from the others of its molecule
        const mid = cp.atoms.reduce((s, a) => s.add(a.cur), V3()).multiplyScalar(1 / cp.atoms.length)
        for (const a of cp.atoms) {
          const out = a.cur.clone().sub(mid)
          if (out.lengthSq() < 1e-4) out.set(Math.sin(a.id), 0.5, Math.cos(a.id))
          a.drift = out.normalize().multiplyScalar(0.35 + Sv * 0.2)
          a.copy = null
          free.push(a)
        }
        cp.atoms = []
      }
      for (const g of ghosts[anim.from].flat()) if (g.appearAt && clock >= g.appearAt) g.want = 1
    }
    let flying = 0
    free = free.filter(a => {
      if (!a.fly) return true
      if (clock < a.fly.t0) return true
      flying++
      if (!a.fly.from) a.fly.from = a.cur.clone()
      const u = Math.min(1, (clock - a.fly.t0) / a.fly.dur)
      const to = atomAt(a.fly.to.f, a.fly.a, centreOf(a.fly.to.side, a.fly.to.s, a.fly.to.c))
      const e = ease(u)
      a.cur.lerpVectors(a.fly.from, to, e)
      a.cur.y += Math.sin(u * Math.PI) * a.fly.h
      if (u < 1) return true
      // landed: a place of its own element in the new molecule
      const cp = a.fly.to
      cp.atoms[a.fly.a] = a
      a.copy = cp
      a.idx = a.fly.a
      a.fly = null
      a.drift = null
      a.a.hop()
      cp.arrived++
      if (cp.arrived === C.MOLECULES[cp.f].atoms.length) {
        cp.formed = true
        cp.bonds = bondsFor(cp)
        const gh = ghosts[cp.side][cp.s]?.[cp.c]
        if (gh) gh.want = 0
        if (anim && anim.sounds < 10) {
          play('join', { order: 1 + (cp.s % 3) })
          anim.sounds++
        }
        if (anim) anim.lastForm = clock
      }
      return false
    })
    if (anim && !free.length && anim.dest.flat().every(cp => cp.formed) && clock - (anim.lastForm ?? 0) > 0.45) finish()

    // the Atomlings: each where its molecule holds it (breathing, bobbing), or drifting, or in flight
    const camPos = camera.position
    const all = [...real.L.flat(), ...real.R.flat(), ...(anim ? anim.dest.flat() : [])]
    const place = (a, p) => {
      const H = a.a.body.height
      a.holder.scale.setScalar(Sv)
      a.holder.position.set(p.x, p.y - (H * 0.5 + a.a.body.hover) * Sv, p.z)
      a.holder.rotation.y = Math.atan2(camPos.x - p.x, camPos.z - p.z)
    }
    for (const cp of all) {
      if (!cp.atoms.length) continue
      const ctr = centreOf(cp.side, cp.s, cp.c)
      ctr.y += Math.sin(t * 1.3 + cp.ph) * 0.04
      // shaking before the hands let go (energy coming in)
      const shaking = anim && anim.leaving.includes(cp) && !cp.broken
      const amp = shaking ? Math.min(1, (clock - anim.t0) / Math.max(0.1, anim.T.BREAK)) * 0.06 : 0
      cp.atoms.forEach((a, i) => {
        if (!a) return
        const goal = atomAt(cp.f, i, ctr)
        if (amp) goal.add(shake.set(Math.sin(t * 41 + a.id) * amp, Math.cos(t * 37 + a.id * 1.3) * amp, Math.sin(t * 29 + a.id * 0.7) * amp))
        a.cur.lerp(goal, 1 - Math.exp(-dt * (shaking ? 14 : 7)))
        place(a, a.cur)
        a.a.update(dt, t, { speed: 0 })
      })
    }
    for (const a of free) {
      if (!a.fly || clock < a.fly.t0) {
        if (a.drift) {
          a.cur.addScaledVector(a.drift, dt * 1.6)
          a.drift.multiplyScalar(Math.exp(-dt * 3))
        }
        a.cur.y += Math.sin(t * 5 + a.id) * 0.002
      }
      place(a, a.cur)
      a.a.update(dt, t, { speed: a.fly && clock >= a.fly.t0 ? 1.2 : 0 })
    }

    // the bonds: arms reach out and meet at the clasp (growing in, letting go)
    const bonds = []
    for (const cp of new Set([...all, ...(anim ? anim.leaving : [])])) {
      cp.bonds = cp.bonds.filter(b => {
        b.g += (b.want - b.g) * Math.min(1, dt * (b.want ? 5 : 9))
        if (!b.want && b.g < 0.03) {
          dropBond(b)
          return false
        }
        bonds.push(b)
        return true
      })
    }
    for (const b of bonds) {
      if (!b.A || !b.B) continue
      const A = b.A.cur
      const B = b.B.cur
      const dir = B.clone().sub(A)
      const len = dir.length()
      if (len < 1e-4) continue
      dir.normalize()
      const rA = b.A.r * Sv * 0.95
      const rB = b.B.r * Sv * 0.95
      if (b.ionic) {
        placeArm(b.link, A.clone().addScaledVector(dir, rA * 0.8), B.clone().addScaledVector(dir, -rB * 0.8))
        const w = (0.9 + b.order * 0.35) * (1 + Math.sin(t * 4 + b.A.id) * 0.15) * Sv * b.g
        b.link.scale.x = w
        b.link.scale.z = w
        continue
      }
      let side = tmp.crossVectors(dir, camPos.clone().sub(A).normalize())
      if (side.lengthSq() < 1e-6) side.set(0, 1, 0)
      side = side.normalize().clone()
      for (const p of b.parts) {
        const off = (p.k - (b.order - 1) / 2) * 0.22 * Sv
        const mid = A.clone().add(B).multiplyScalar(0.5).addScaledVector(side, off)
        const a0 = A.clone().addScaledVector(dir, rA).addScaledVector(side, off)
        const b0 = B.clone().addScaledVector(dir, -rB).addScaledVector(side, off)
        placeArm(p.armA, a0, a0.clone().lerp(mid, b.g))
        placeArm(p.armB, b0, b0.clone().lerp(mid, b.g))
        p.armA.scale.x = p.armA.scale.z = p.armB.scale.x = p.armB.scale.z = Sv
        p.clasp.position.copy(mid)
        p.clasp.scale.setScalar(Sv * Math.max(0.01, b.g) * (1 + Math.sin(t * 3 + b.A.id) * 0.08))
      }
    }

    // the ghosts: the places waiting, glowing softly; they fade as their molecule forms
    for (const side of ['L', 'R']) {
      ghosts[side] = ghosts[side].map(list => list.filter(g => {
        g.fade += (g.want - g.fade) * Math.min(1, dt * 4)
        if (!g.want && g.fade < 0.02 && !g.appearAt) {
          dropGhost(g)
          return false
        }
        if (g.appearAt && g.want) g.appearAt = 0
        const ctr = centreOf(g.side, g.s, g.c)
        ctr.y += Math.sin(t * 1.3 + g.s * 1.7 + g.c * 0.9) * 0.04
        const shape = C.shapeOf(g.f)
        const pulse = 0.85 + Math.sin(t * 2.2 + g.c) * 0.08
        g.group.visible = g.fade > 0.02
        g.spheres.forEach((m, i) => {
          m.position.set(ctr.x + shape[i][0] * Sv, ctr.y + shape[i][1] * Sv, ctr.z + shape[i][2] * Sv)
          m.scale.setScalar(C.bodyRadius(C.MOLECULES[g.f].atoms[i]) * Sv * 0.8 * g.fade * pulse)
        })
        C.MOLECULES[g.f].bonds.forEach(([a, b], i) => {
          const pa = g.spheres[a].position
          const pb = g.spheres[b].position
          const st = g.sticks[i]
          st.position.copy(pa).add(pb).multiplyScalar(0.5)
          st.quaternion.setFromUnitVectors(V3(0, 1, 0), tmp.copy(pb).sub(pa).normalize())
          st.scale.set(Sv * g.fade, pa.distanceTo(pb), Sv * g.fade)
        })
        return true
      }))
    }

    // the words on the bench face the player; the Explorer reads names, the Scientist states
    for (const l of labelParts) {
      for (const m of [l.coef, l.formula, l.name, l.state, l.minus, l.plus]) if (m) m.quaternion.copy(camera.quaternion)
      l.name.visible = !sci
      l.state.visible = sci
      const can = phase === 'before' && C.canRemove(R, k, C.indexOf(R, l.side, l.s))
      l.minus.visible = phase === 'before'
      l.minus.scale.setScalar(can ? 1 : 0.8)
      l.minus.children[0].material.opacity = can ? 0.9 : 0.22
      l.minus.children[1].material.opacity = can ? 0.9 : 0.22
    }
    for (const w of sideWords) {
      w.kid.visible = !sci
      w.sci.visible = sci
      w.kid.quaternion.identity()
      w.sci.quaternion.identity()
    }
    // the coefficient numbers blink green for a moment when they balance
    const balanced = C.isBalanced(R, k)

    // the arrow: dim until balanced, then it glows and beckons; white-hot while it runs
    const go = ready()
    const heat = running ? 1 : 0
    arrowMat.emissive.set(running ? '#ffffff' : go ? '#ffd166' : balanced ? '#ffb86b' : '#7f9cff')
    arrowMat.emissiveIntensity = running ? 2.2 : go ? 1.1 + Math.sin(t * 4) * 0.5 : 0.35
    arrowGlow.material.opacity = running ? 0.35 : go ? 0.12 + Math.sin(t * 4) * 0.08 : 0
    const s = go ? 1 + Math.sin(t * 4) * 0.06 : 1
    arrow.scale.setScalar(s)
    arrow.position.y = geo.arrow.at.y + (go ? Math.sin(t * 2) * 0.05 : 0) + heat * 0.05

    // the energy source
    for (const [kind, src] of Object.entries(sources)) {
      if (!src.g.visible) continue
      const want = kind === R.needs && on ? (running && clock - (anim?.t0 ?? 0) < T_FLY + 0.5 ? 1.5 : 1) : 0
      src.level += (want - src.level) * Math.min(1, dt * 4)
      src.set(src.level, t)
    }

    // what it gave out or took in
    const tf = fx ? clock - fx.t0 : 99
    if (fx && fx.kind === 'exo') {
      const g = geo.R
      flash.visible = tf < 0.9
      if (flash.visible) {
        flash.material.color.copy(fx.color)
        flash.position.set(g.cx, TOP + g.y + 1.0, g.cz + 0.4)
        const f = tf / 0.9
        flash.scale.set(g.width * (0.5 + f * 0.9), 3.2 * (0.5 + f * 0.6), 1)
        flash.material.opacity = Math.pow(1 - f, 1.6) * 0.95 * fx.strength
      }
      if (flashLight) {
        flashLight.color.copy(fx.color)
        flashLight.position.set(g.cx, TOP + g.y + 1.6, g.cz + 1)
        flashLight.intensity = Math.max(0, 1 - tf / 2.2) * 40 * fx.strength
      }
      // the bench warms under the new molecules, in the flame's colour, and cools again
      const warm = Math.max(0, 1 - tf / 9) * fx.strength
      pool.visible = warm > 0.01
      pool.material.color.copy(fx.color).lerp(new THREE.Color('#ff9a3d'), 0.35)
      pool.material.opacity = warm * 0.75
      pool.position.set(g.cx, TOP + g.y + 0.02, g.cz)
      pool.scale.set(g.width * 1.15, g.depth * 1.5, 1)
      rimMat.emissive.copy(RIM).lerp(fx.color, warm * 0.5)
      emberMat.color.set('#ffb35a').lerp(fx.color, 0.25)
      emberMat.opacity = Math.min(1, tf * 4) * Math.max(0, 1 - tf / 2.4) * 0.9
      if (tf < 3.4) {
        for (let i = 0; i < EMBERS; i++) {
          emberPos[i * 3] += emberVel[i * 3] * dt
          emberPos[i * 3 + 1] += emberVel[i * 3 + 1] * dt
          emberPos[i * 3 + 2] += emberVel[i * 3 + 2] * dt
          emberVel[i * 3] += Math.sin(t * 3 + i) * dt * 0.3
        }
        emberGeo.attributes.position.needsUpdate = true
      }
    } else {
      flash.visible = false
      pool.visible = false
      emberMat.opacity = 0
      if (flashLight) flashLight.intensity = 0
      rimMat.emissive.copy(RIM)
    }
    if (fx && fx.kind === 'endo') {
      // the energy taken in glows in the new molecules a while (stored in their bonds)
      const glow = Math.max(0, 1 - tf / 4) * fx.strength
      claspMat.emissive.copy(new THREE.Color('#a8ecff')).lerp(fx.color, glow)
      claspMat.emissiveIntensity = 0.9 + glow * 2.5
      const g = geo.R
      pool.visible = glow > 0.01
      pool.material.color.copy(fx.color)
      pool.material.opacity = glow * 0.6
      pool.position.set(g.cx, TOP + g.y + 0.02, g.cz)
      pool.scale.set(g.width * 1.15, g.depth * 1.5, 1)
    } else {
      claspMat.emissive.set('#a8ecff')
      claspMat.emissiveIntensity = running ? 1.4 : 0.9
    }
    // the left side's glow follows the source while it is on
    const src = R.needs ? sources[R.needs] : null
    halfMat.L.color.set('#2b4a9c')
    if (src) halfMat.L.color.lerp(new THREE.Color(SOURCE_COLOR[R.needs]), Math.min(1, src.level) * 0.35)
    halfMat.L.opacity = 0.22 + (src ? Math.min(1, src.level) * 0.1 : 0)

    // keep the bench framed in the part of the screen left free (closely while the HUD settles at the start)
    const d = camera.position.distanceTo(controls.target)
    const w = want()
    if (fitFrames > 0) fitFrames--
    if (fitFrames > 0 || d < w * 0.75 || d > w * 1.5) camera.position.sub(controls.target).setLength(d + (w - d) * Math.min(1, dt * (fitFrames > 0 ? 6 : 2))).add(controls.target)
  }

  const attach = () => {
    if (orient()) stand(phase)
    placeCamera()
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointermove', onMove)
    report()
  }
  const detach = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointermove', onMove)
    canvas.style.cursor = ''
    controls.dispose()
    store.set({ reactions: null })
  }

  // build once so a saved state can be put back before the first frame (the keeper calls set at enter)
  orient()
  choose(R.id, false)

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
    // what the HUD (and the probes) do
    pick: id => !busy() && choose(id),
    add,
    remove,
    run,
    again,
    next,
    toggleSource,
    setWater,
    solve,
    answer: () => [...R.answer],
    clearNote: () => tell(null),
    clearCelebrate: () => {
      celebrate = null
      report()
    },
    state: () => {
      const atoms = [...real.L.flat(), ...real.R.flat(), ...(anim ? anim.dest.flat() : [])].flatMap(cp => cp.atoms).filter(Boolean).concat(free)
      // every Atomling on the bench (each once), by element: the same before and after a run
      const els = [...new Set(atoms)].map(a => a.el).sort().join('')
      return { r: R.id, k: [...k], phase, runs, on, water, S, atoms: new Set(atoms).size, els, ids: [...new Set(atoms)].map(a => a.id).sort((x, y) => x - y).join(',') }
    },
    /** For probes: where a thing to tap is on the screen (CSS px): 'arrow', 'source', 'add:L:0', 'minus:R:1'. */
    screenOf(what) {
      const [kind, side, s] = what.split(':')
      const o = kind === 'arrow' ? arrowHit : kind === 'source' ? sources[R.needs]?.hit : labelParts.find(l => l.side === side && l.s === Number(s))?.[kind === 'minus' ? 'minus' : 'hit']
      if (!o) return null
      const p = o.getWorldPosition(V3()).project(camera)
      const r = canvas.getBoundingClientRect()
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height }
    },
    // the shared probe's steps, one by one (an orbit world: no walking)
    interactables: [
      { id: 'add-first', onUse: () => add(0) },
      { id: 'add-product', onUse: () => add(R.left.length) },
      { id: 'remove-first', onUse: () => remove(0) },
      { id: 'pick-methane', onUse: () => choose('methane') },
      { id: 'solve', onUse: () => solve() },
      { id: 'water', onUse: () => setWater(water === 'l' ? 'g' : 'l') },
      { id: 'run', onUse: () => run() },
      { id: 'again', onUse: () => again() },
    ],
    dispose() {
      trash.splice(0).forEach(m => m.dispose())
      verse.dispose()
      clearLabels()
    },
  }
}
