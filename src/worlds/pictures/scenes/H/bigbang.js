// Hydrogen's picture "What were the very first atoms?" as a room (docs/knowledge/picture-rooms.md): the
// picture's horn made into a tunnel through the young universe (stages/youngcosmos.js). You arrive at its
// narrow, hot end in a glowing fog of protons, electrons and light, the picture's frame behind you, and
// walk on a glass walkway toward its wide mouth, where a lawn floats under today's night sky. Walking on is
// going forward in time. Three things to do, each step chosen by tapping its thing (the user, 2026-10-30:
// pressing E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel,
// whose buttons (and a slider) do the same:
// - the first three minutes (a bay near the start): the cosmic recipe on a tray, 14 protons and 2 neutrons
//   (one neutron to seven protons when the making began, about 3 minutes in). Tap a neutron: it joins a
//   proton (deuterium); tap a deuteron: the two make helium-4; tap the balance: 12 lone protons against one
//   helium nucleus, 75% hydrogen and 25% helium by weight, 12 of 13 nuclei (92%) hydrogen by number. The
//   clock is a slider: before 3 minutes light smashes every deuteron apart again; past 13 minutes a free
//   neutron has turned into a proton (half-life about 10 minutes, as many as half of them gone); after
//   20 minutes it is too cold for deuterons to join;
// - the cooling (the middle of the tunnel): a brass time rail from 3 minutes to 380,000 years (tap it, or
//   its knob for the next mark, or the slider), the fog's colour following the temperature. Free protons
//   (red, the Atom Forge's colour) and electrons (cyan) dart about, and light bounces from electron to
//   electron in zigzags. Helium catches its electrons by itself, first; below about 4000 K a tap on a proton
//   (or an electron) has the nearest free electron caught onto its ring: a hydrogen atom. Before that the
//   light knocks the electron off again. Once 8 of the 12 are caught, the rest follow, the fog clears and
//   the light flies straight down the tunnel and out of its mouth;
// - the pigeon horn (the terrace, today): the Holmdel horn antenna on its turntable, a receiver with a
//   needle and a chart, a board. Tap the horn: a hiss nobody could explain; tap the turntable (or the
//   slider) to point it elsewhere: the same hiss from everywhere; tap the pigeons in its mouth: they fly
//   off, the droppings go, the hiss stays; tap the board: the orange light of 380,000 years stretches about
//   1100 times into microwaves at 2.7 K.
// Kept apart from the Star Forge and carbon's stars (fusion in stars) and the Atom Forge (free building):
// here only the universe's own recipe. Shared in a room (src/net/shared.js): the time and the atoms caught,
// the tray, the horn; the words, panels and discoveries stay each one's. parts.<exhibit>.tap(...) does what
// a tap does, for the probes; parts.rayTo(p) aims a real tap.
// Times and temperatures: the standard model with Planck 2018's numbers (13.8 billion years; 3 minutes at
// about 10^9 K; 4000 K near 220,000 years; 3000 K near 380,000 years), the Friedmann equation integrated
// once (radiation, matter, a cosmological constant) and kept here as a table (TEMP).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, hdr, fill } from '../../../wings/noble/kit.js'
import { youngCosmosStage, fogColour } from '../../stages/youngcosmos.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { BIGBANG_WORDS } from './bigbang.words.js'

export const WORDS = BIGBANG_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// the Atom Forge's colours: protons, neutrons, electrons; helium's warm glow; the atoms' rings
const PROTON = '#ff5a55'
const NEUTRON = '#b9c6dc'
const ELECTRON = '#a8ecff'
const HELIUM = '#fff1c4'
const RING = '#bfe9ff'

// ---- the walk (metres; the spawn looks along -z, down the horn toward today) ----
const AXIS_Y = 1.4
const WALK = { width: 4, z0: 15.9 }
const BAY = { side: -1, z0: 4.6, z1: 9.8, depth: 2.6 }
const TERRACE = { z: -23.5, r: 8 }
const OPEN = { side: 1, z0: -7.4, z1: -0.8 }

// ---- the cooling: the time rail, the gauge above it, the chamber of particles beyond ----
const RAIL = { x: 2.0, y: 1.0, z0: -1.2, z1: -7.0 }
const GAUGE = { x: 2.75, y: 2.85, z: -4.1, w: 1.5, h: 0.85 } // a scoreboard over the chamber, tilted down
const CH = { x0: 2.75, x1: 5.9, y0: 0.4, y1: 3.7, z0: -8.0, z1: -0.3 }
const NP = 12 // protons to catch electrons (the same on every device: the room shares which are caught)
const NE = NP + 2 // and a helium nucleus's two
const REST = 8 // caught by hand, then the rest follow
const YEAR = 3.15576e7
// temperature (log10 K) by time (log10 s): Planck 2018's model, from 3 minutes to 380,000 years
const TEMP = [[2.248, 9.0], [3.378, 8.4354], [5.378, 7.4354], [7.377, 6.4354], [9.373, 5.4355], [10.407, 4.9126], [11.334, 4.4355], [11.753, 4.2137], [12.078, 4.0376], [12.305, 3.9127], [12.446, 3.8336], [12.617, 3.7367], [12.739, 3.6662], [12.833, 3.6118], [12.939, 3.5497], [13.029, 3.4965], [13.079, 3.4728]]
const T0 = 180 // 3 minutes
const T_LOG = 1e5 * YEAR // the rail is logarithmic up to 100,000 years, then even to 380,000
const T1 = 3.8e5 * YEAR
const LOG_PART = 0.7
/** Seconds since the Big Bang at a place on the rail (0..1). */
const timeAt = s => (s <= LOG_PART ? 10 ** (Math.log10(T0) + (s / LOG_PART) * (Math.log10(T_LOG) - Math.log10(T0))) : T_LOG + ((s - LOG_PART) / (1 - LOG_PART)) * (T1 - T_LOG))
/** The place on the rail of a time (s). */
const placeOf = t => (t <= T_LOG ? (LOG_PART * (Math.log10(t) - Math.log10(T0))) / (Math.log10(T_LOG) - Math.log10(T0)) : LOG_PART + ((1 - LOG_PART) * (t - T_LOG)) / (T1 - T_LOG))
/** The temperature (K) at a time (s). */
function tempAt(t) {
  const l = Math.log10(t)
  if (l <= TEMP[0][0]) return 10 ** TEMP[0][1]
  for (let i = 1; i < TEMP.length; i++) {
    if (l <= TEMP[i][0]) {
      const [a, ta] = TEMP[i - 1]
      const [b, tb] = TEMP[i]
      return 10 ** (ta + ((l - a) / (b - a)) * (tb - ta))
    }
  }
  return 10 ** TEMP[TEMP.length - 1][1]
}
const S_CATCH = placeOf(10 ** 12.078) // about 4000 K: hydrogen's electrons stay caught from here on
const S_HE1 = placeOf(18000 * YEAR) // helium's first electron (about 16,000 K)
const S_HE2 = placeOf(90000 * YEAR) // and its second (about 7000 K)
// the rail's marks: 3 minutes, a year, 1000 years, 100,000 years, 380,000 years
const MARKS = [0, placeOf(YEAR), placeOf(1000 * YEAR), LOG_PART, 1]

// ---- the first three minutes: the tray, its balance and its card ----
const TRAY = { x: -3.1, z: 8.1, top: 0.98, r: 0.62 }
const BAL = { x: -3.1, z: 5.7, y: 1.32, arm: 0.55 }
const CARD = { x: -4.38, z: 7.1, y: 1.62, w: 2.0, h: 1.15 }
const MIN_HOT = 3 // deuterium survives the light from about 3 minutes
const MIN_DECAY = 13 // one half-life (about 10 minutes) after the start: one of the two free neutrons is gone
const MIN_COLD = 20 // too cold for deuterons to join

// ---- the pigeon horn, on the terrace ----
const HOLM = { x: 0.3, z: -28.0, r: 2.25 }
// the receiver's desk and the board stand either side of the way to the horn, turned to the visitor
const DESK = { x: -1.6, z: -25.0, rot: 0.3 }
const BOARD = { x: 1.85, z: -25.1, w: 1.6, h: 0.9, rot: -0.32 }

/** The tray's 16 places: 14 protons and 2 neutrons, loosely scattered (the same on every screen). */
const TRAY_HOME = (() => {
  const out = []
  const ga = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < 16; i++) {
    const r = 0.47 * Math.sqrt((i + 0.6) / 16)
    const a = i * ga + 0.4
    out.push([Math.cos(a) * r, Math.sin(a) * r])
  }
  return out
})()
const N_IDX = [5, 11] // which of the places hold the neutrons
const PARTNER = [8, 3] // the proton each neutron joins (its nearest)

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const lang = ctx.lang()
  const tag = LOCALE[lang] ?? 'en-GB'
  const stage = youngCosmosStage({
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    axisY: AXIS_Y,
    walk: WALK,
    bays: [BAY],
    open: [OPEN],
    terrace: TERRACE,
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const glow = stage.glow
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const tmpV = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  const paras = (entry, lv) => entry[depth(lv)].map(p => ({ p }))
  const sending = {}
  /** Share an exhibit a little later (a slider sends a few times a second, its last value always). */
  const sendSoon = id => {
    if (sending[id]) return
    sending[id] = true
    later(0.25, () => {
      sending[id] = false
      share(id)
    })
  }
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })

  // ---- numbers and words in the reader's language ----
  const plural = new Intl.PluralRules(tag)
  const nf = (v, opts = {}) => new Intl.NumberFormat(tag, { useGrouping: 'min2', ...opts }).format(v)
  const sig2 = v => (v >= 10 ? Number(v.toPrecision(2)) : Math.round(v * 10) / 10)
  const unit = (u, v) => {
    const forms = E.units[u]
    return forms[plural.select(v)] ?? forms.other
  }
  /** "380,000 years", "40 minutes": a time since the Big Bang, two significant digits. */
  function timeText(t) {
    let v
    let u
    if (t >= YEAR) [v, u] = [t / YEAR, 'y']
    else if (t >= 86400) [v, u] = [t / 86400, 'd']
    else if (t >= 3600) [v, u] = [t / 3600, 'h']
    else [v, u] = [t / 60, 'min']
    const r = sig2(v)
    return `${nf(r, { maximumFractionDigits: 1 })} ${unit(u, r)}`
  }
  /** "1 billion K", "270 million K", "16,000 K". */
  function tempText(T) {
    if (T >= 9.5e8) {
      const r = sig2(T / 1e9)
      return `${nf(r, { maximumFractionDigits: 1 })} ${E.big.b[plural.select(r)] ?? E.big.b.other} K`
    }
    if (T >= 9.5e5) {
      const r = sig2(T / 1e6)
      return `${nf(r, { maximumFractionDigits: 1 })} ${E.big.m[plural.select(r)] ?? E.big.m.other} K`
    }
    return `${nf(Number(T.toPrecision(2)))} K`
  }
  /** A sign in 3D: plain text (the fonts have no special spaces: Intl's are replaced). */
  const sign = (text, size, { color: c = '#eaf2ff', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(String(text).replace(/[  ]/g, ' '), { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })
  /** A canvas screen in a dark frame, facing +z. */
  function screen(w, h, px = 1024, frame = '#2a3150') {
    const cw = px
    const ch = Math.round((px * h) / w)
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const edge = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.02), new THREE.MeshStandardMaterial({ color: frame, emissive: frame, emissiveIntensity: 0.25, roughness: 0.5, metalness: 0.4 }))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(edge, face)
    return { group, g: canvas.getContext('2d'), w: cw, h: ch, tex, face }
  }
  /** A line that shrinks until it fits (the four languages differ in length). */
  const fitText = (g, text, x, y, size, weight = 700, maxW = 400, font = 'Outfit') => {
    let s = size
    g.font = `${weight} ${s}px ${font}`
    while (s > 11 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px ${font}`
    g.fillText(text, x, y)
  }
  const dotAt = (g, x, y, r, c, ring = false) => {
    g.fillStyle = c
    g.beginPath()
    g.arc(x, y, r, 0, TAU)
    g.fill()
    if (ring) {
      g.strokeStyle = 'rgba(191,233,255,0.9)'
      g.lineWidth = 2
      g.beginPath()
      g.ellipse(x, y, r * 2.4, r * 1.3, -0.4, 0, TAU)
      g.stroke()
    }
  }

  // ---- materials ----
  const protonMat = new THREE.MeshStandardMaterial({ color: PROTON, emissive: PROTON, emissiveIntensity: 0.75, roughness: 0.35 })
  const neutronMat = new THREE.MeshStandardMaterial({ color: NEUTRON, emissive: '#5d6a82', emissiveIntensity: 0.55, roughness: 0.4 })
  const electronMat = new THREE.MeshStandardMaterial({ color: ELECTRON, emissive: '#6fd2ff', emissiveIntensity: 1.0, roughness: 0.3 })
  const ringMat = new THREE.MeshBasicMaterial({ color: RING, transparent: true, opacity: 0.75, depthWrite: false })
  const brass = new THREE.MeshStandardMaterial({ color: '#c8a052', emissive: '#4a3210', emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.85 })
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#2f3854', roughness: 0.45, metalness: 0.6 })
  const glowPoints = (n, c, size) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: glow, color: hdr(c, 1.1), size, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }))
    pts.frustumCulled = false
    pts.raycast = () => {}
    root.add(pts)
    return pts
  }

  // ======== light: wavy streaks, as the picture draws it ========
  const waveTex = canvasTex(256, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.strokeStyle = 'rgba(255,255,255,1)'
    g.lineWidth = 5
    g.shadowColor = 'rgba(255,255,255,0.9)'
    g.shadowBlur = 10
    g.beginPath()
    for (let x = 6; x <= w - 6; x += 2) {
      const k = (x - 6) / (w - 12)
      const fade = Math.sin(Math.PI * k) ** 0.6
      const y = h / 2 + Math.sin(k * TAU * 3) * (h * 0.26) * fade
      if (x === 6) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
  })
  textures.push(waveTex)
  const PH_CH = 16 // light in the cooling's chamber
  const PH_AMB = light ? 18 : 34 // light all through the horn (and out over the terrace when clear)
  const PH = PH_CH + PH_AMB + 2 // and two for the tray's too-hot flash
  const photonMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: waveTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    PH,
  )
  photonMesh.frustumCulled = false
  photonMesh.raycast = () => {}
  photonMesh.setColorAt(0, new THREE.Color())
  {
    const zero = new THREE.Matrix4().makeScale(0, 0, 0)
    for (let i = 0; i < PH; i++) photonMesh.setMatrixAt(i, zero)
  }
  root.add(photonMesh)
  const phAxis = new THREE.Vector3()
  const phSide = new THREE.Vector3()
  const phNorm = new THREE.Vector3()
  const phMat = new THREE.Matrix4()
  const phCol = new THREE.Color()
  /** Draw light number i at p heading along dir, len long, coloured c (alpha folded into the colour). */
  function drawPhoton(i, p, dir, len, c, a = 1) {
    phAxis.copy(dir).normalize()
    phNorm.copy(ctx.camera.position).sub(p).normalize()
    phSide.crossVectors(phNorm, phAxis)
    if (phSide.lengthSq() < 1e-6) phSide.set(0, 1, 0)
    phSide.normalize()
    phNorm.crossVectors(phAxis, phSide).normalize()
    phMat.makeBasis(phAxis.multiplyScalar(len), phSide.multiplyScalar(len * 0.16), phNorm)
    phMat.setPosition(p)
    photonMesh.setMatrixAt(i, phMat)
    photonMesh.setColorAt(i, phCol.copy(c).multiplyScalar(a))
  }
  const hidePhoton = i => {
    phMat.makeScale(0, 0, 0)
    photonMesh.setMatrixAt(i, phMat)
  }
  const randDir = (out = new THREE.Vector3()) => {
    do out.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
    while (out.lengthSq() > 1 || out.lengthSq() < 0.01)
    return out.normalize()
  }

  // ======== the first three minutes: the tray, the balance, the card ========
  const R = { c: MIN_HOT, n: [0, 0], w: 0 } // the clock (min); each neutron: 0 free, 1 deuteron, 2 decayed, 3 helium; weighed
  let recipeMine = false
  const heMade = () => R.n[0] === 3 && R.n[1] === 3
  const freeN = () => R.n.filter(v => v === 0).length
  const tray = new THREE.Group()
  tray.position.set(TRAY.x, 0, TRAY.z)
  root.add(tray)
  const trayTop = TRAY.top
  {
    const dishMat = new THREE.MeshStandardMaterial({ color: '#1d2744', emissive: '#0e1430', emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.3 })
    const r = TRAY.r
    const dish = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [r - 0.04, 0], [r, 0.02], [r + 0.02, 0.07], [r - 0.01, 0.075], [r - 0.05, 0.02], [0, 0.02]].map(([x, y]) => new THREE.Vector2(x, y)), 48), dishMat)
    dish.position.y = trayTop - 0.02
    const rimGlow = new THREE.Mesh(new THREE.TorusGeometry(r + 0.005, 0.012, 8, 64), new THREE.MeshStandardMaterial({ color: '#ff9e4a', emissive: '#ff9e4a', emissiveIntensity: 1.1 }))
    rimGlow.rotation.x = Math.PI / 2
    rimGlow.position.y = trayTop + 0.055
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, trayTop - 0.05, 16), darkMetal)
    stem.position.y = (trayTop - 0.05) / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.05, 32), darkMetal)
    foot.position.y = 0.025
    tray.add(dish, rimGlow, stem, foot)
    solids.push(circle(TRAY.x, TRAY.z, 0.42, { y1: 1.0 }))
  }
  const trayHit = new THREE.Mesh(new THREE.CylinderGeometry(TRAY.r + 0.08, 0.3, trayTop + 0.06, 24), ghost)
  trayHit.position.y = (trayTop + 0.06) / 2
  tray.add(trayHit)
  const ballGeo = new THREE.SphereGeometry(0.068, 20, 14)
  const hitGeo = new THREE.SphereGeometry(0.13, 10, 8)
  const balls = TRAY_HOME.map(([hx, hz], i) => {
    const isN = N_IDX.includes(i)
    const mesh = new THREE.Mesh(ballGeo, isN ? neutronMat : protonMat)
    const hit = new THREE.Mesh(hitGeo, ghost)
    hit.userData.i = i
    const home = V3(hx, trayTop + 0.09, hz)
    mesh.position.copy(home)
    hit.position.copy(home)
    tray.add(mesh, hit)
    return { i, isN, mesh, hit, home, seed: i * 1.7 + 0.3, pos: home.clone() }
  })
  const heGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr(HELIUM, 0.9), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  heGlow.scale.setScalar(0.42)
  tray.add(heGlow)
  const flashSp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#fff3d0', 1.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  tray.add(flashSp)
  let flash = null // { p (tray-local), t }
  const flashAt = p => {
    flash = { p: p.clone(), t: 0 }
  }
  // the deuterons' and helium's places: between each neutron and its proton; helium between the two
  const pairMid = k => balls[N_IDX[k]].home.clone().add(balls[PARTNER[k]].home).multiplyScalar(0.5)
  const HE_AT = pairMid(0).add(pairMid(1)).multiplyScalar(0.5)
  const TET = [V3(1, 1, 1), V3(1, -1, -1), V3(-1, 1, -1), V3(-1, -1, 1)].map(v => v.normalize().multiplyScalar(0.075))
  // a too-hot try: the neutron flies to its proton, sticks a moment, and light knocks it off
  let bounce = null // { k, t }
  // the decay of a neutron left alone: its electron shoots off
  const decayE = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), electronMat)
  decayE.visible = false
  tray.add(decayE)
  let decayAnim = null // { k, t, dir }

  // the balance: a post, a beam tilting along z, two pans hanging from its ends
  const balance = new THREE.Group()
  balance.position.set(BAL.x, 0, BAL.z)
  root.add(balance)
  const beam = new THREE.Group()
  beam.position.y = BAL.y
  const pans = []
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, BAL.y, 12), brass)
    post.position.y = BAL.y / 2
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.05, 24), darkMetal)
    base.position.y = 0.025
    const pivot = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.09, 4), brass)
    pivot.position.y = BAL.y - 0.02
    balance.add(post, base, pivot, beam)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, BAL.arm * 2 + 0.08), brass)
    beam.add(bar)
    const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.32, 0.012), brass)
    pointer.position.y = 0.17
    beam.add(pointer)
    for (const s of [1, -1]) {
      const pan = new THREE.Group()
      const dish = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.19, 0], [0.22, 0.04], [0.215, 0.045], [0.18, 0.008], [0, 0.008]].map(([x, y]) => new THREE.Vector2(x, y)), 32), brass)
      pan.add(dish)
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * TAU
        const str = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.4, 4), brass)
        str.position.set(Math.cos(a) * 0.1, 0.22, Math.sin(a) * 0.1)
        str.rotation.set(Math.sin(a) * 0.24, 0, -Math.cos(a) * 0.24)
        pan.add(str)
      }
      balance.add(pan)
      pans.push({ s, pan })
    }
    solids.push(circle(BAL.x, BAL.z, 0.3, { y1: 1.0 }))
    const hLabel = sign('H', 0.13, { color: '#ffb1ad' })
    const heLabel = sign('He', 0.13, { color: HELIUM })
    hLabel.position.set(0.05, BAL.y + 0.3, BAL.arm)
    heLabel.position.set(0.05, BAL.y + 0.3, -BAL.arm)
    hLabel.rotation.y = heLabel.rotation.y = Math.PI / 2
    balance.add(hLabel, heLabel)
  }
  const balanceHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, BAL.arm * 2 + 0.6), ghost)
  balanceHit.position.y = 0.95
  balance.add(balanceHit)
  let tilt = 0
  const panAt = (s, out = new THREE.Vector3()) => out.set(0, BAL.y - Math.sin(tilt) * BAL.arm * s - 0.4, Math.cos(tilt) * BAL.arm * s)
  // the heap on a pan (tray-local coordinates, so balls keep one parent): place j of n
  const heapSpot = (s, j) => {
    const p = panAt(s, new THREE.Vector3()).add(balance.position).sub(tray.position)
    // three layers: seven round the pan, five on them, the rest on top
    const [n, r, y, k] = j < 7 ? [7, 0.13, 0.075, j] : j < 12 ? [5, 0.075, 0.17, j - 7] : [3, 0.035, 0.26, j - 12]
    const a = (k / n) * TAU + y * 3
    return p.add(V3(Math.cos(a) * r, y, Math.sin(a) * r))
  }

  // the card: the clock (minutes since the Big Bang) and what is on the tray, then the weighing
  const card = screen(CARD.w, CARD.h, 1024)
  card.group.position.set(CARD.x, CARD.y, CARD.z)
  card.group.rotation.y = Math.PI / 2
  root.add(card.group)
  {
    const legH = CARD.y - CARD.h / 2
    for (const dz of [-0.75, 0.75]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, legH, 0.06), darkMetal)
      leg.position.set(CARD.x - 0.02, legH / 2, CARD.z + dz)
      root.add(leg)
    }
    solids.push(box(CARD.x, CARD.z, 0.3, CARD.w, { y1: 1.0 }))
  }
  let cardKey = ''
  function drawCard() {
    const lv = level()
    const key = JSON.stringify([R, lv])
    if (key === cardKey) return
    cardKey = key
    const { g, w, h } = card
    const C = E.recipe.card
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    // the clock: 0 to 24 minutes round a dial, too hot before 3, the recipe's window to 20, too cold after
    const cx = 230
    const cy = 255
    const rr = 160
    const ang = m => -Math.PI / 2 + (m / 24) * TAU
    const arc = (m0, m1, c) => {
      g.strokeStyle = c
      g.lineWidth = 26
      g.beginPath()
      g.arc(cx, cy, rr, ang(m0), ang(m1))
      g.stroke()
    }
    arc(0, MIN_HOT, '#e8604a')
    arc(MIN_HOT, MIN_COLD, '#ffb35c')
    arc(MIN_COLD, 24, '#5d6a8a')
    g.strokeStyle = 'rgba(160,200,255,0.75)'
    g.lineWidth = 3
    g.fillStyle = '#cfe0ff'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let m = 0; m < 24; m += 1) {
      const a = ang(m)
      const r0 = m % 5 === 0 ? rr - 40 : rr - 28
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)
      g.lineTo(cx + Math.cos(a) * (rr - 16), cy + Math.sin(a) * (rr - 16))
      g.stroke()
      if (m % 5 === 0) fitText(g, String(m), cx + Math.cos(a) * (rr - 62), cy + Math.sin(a) * (rr - 62), 28, 700, 60)
    }
    // the hand
    const a = ang(R.c)
    g.strokeStyle = '#ffffff'
    g.lineWidth = 8
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(cx, cy)
    g.lineTo(cx + Math.cos(a) * (rr - 30), cy + Math.sin(a) * (rr - 30))
    g.stroke()
    dotAt(g, cx, cy, 12, '#ffffff')
    g.fillStyle = '#ffd9a8'
    fitText(g, fill(C.clock, { m: nf(R.c, { maximumFractionDigits: 1 }) }), cx, cy + rr + 48, 46, 700, 300)
    g.fillStyle = '#9fb3e6'
    fitText(g, C.clockLabel, cx, h - 30, 26, 600, 420)
    // the tray, or what the weighing found
    const x0 = 480
    g.textAlign = 'left'
    if (!R.w) {
      g.fillStyle = '#ffd9a8'
      fitText(g, C.title, x0, 58, 44, 700, w - x0 - 30)
      const pFree = 14 - R.n.filter(v => v === 1).length - (heMade() ? 2 : 0) + R.n.filter(v => v === 2).length
      const rows = [
        [PROTON, null, fill(C.protons, { n: pFree })],
        [NEUTRON, null, fill(C.neutrons, { n: freeN() })],
        [PROTON, NEUTRON, fill(C.deuterons, { n: R.n.filter(v => v === 1).length })],
        [HELIUM, null, fill(C.helium, { n: heMade() ? 1 : 0 })],
      ]
      rows.forEach(([c1, c2, text], j) => {
        const y = 140 + j * 74
        dotAt(g, x0 + 22, y, 16, c1)
        if (c2) dotAt(g, x0 + 50, y, 16, c2)
        g.fillStyle = '#e6eeff'
        fitText(g, text, x0 + 82, y + 2, 34, 600, w - x0 - 110, 'Nunito')
      })
      g.fillStyle = '#9fb3e6'
      fitText(g, at(C.hint, lv), x0, h - 34, 26, 600, w - x0 - 30, 'Nunito')
    } else {
      // two pies: by weight and by number
      const he = heMade()
      const mass = he ? 0.25 : 0
      // hydrogen nuclei: every ball not in helium, a deuteron's two counted once
      const nH = 16 - (he ? 4 : 0) - R.n.filter(v => v === 1).length
      const nAll = nH + (he ? 1 : 0)
      const num = (nAll - nH) / nAll
      const pie = (px, share, title, big, small = null) => {
        const pr = 118
        g.fillStyle = '#e8604a'
        g.beginPath()
        g.moveTo(px, 300)
        g.arc(px, 300, pr, 0, TAU)
        g.fill()
        if (share > 0) {
          g.fillStyle = '#ffe2a0'
          g.beginPath()
          g.moveTo(px, 300)
          g.arc(px, 300, pr, -Math.PI / 2, -Math.PI / 2 + share * TAU)
          g.closePath()
          g.fill()
        }
        g.textAlign = 'center'
        g.fillStyle = '#ffd9a8'
        fitText(g, title, px, 140, 34, 700, 250)
        g.fillStyle = '#ffffff'
        fitText(g, big, px, 452, 32, 700, 260)
        if (small) {
          g.fillStyle = '#ffe2a0'
          fitText(g, small, px, 492, 30, 700, 260)
        }
      }
      pie(x0 + 120, mass, C.byMass, fill(C.massH, { h: nf(100 - mass * 100) }), fill(C.massHe, { he: nf(mass * 100) }))
      pie(x0 + 400, num, C.byNumber, fill(C.massH, { h: nf(Math.round(100 - num * 100)) }), fill(C.numberHe, { n: nH, total: nAll }))
      g.textAlign = 'left'
      g.fillStyle = '#9fb3e6'
      fitText(g, he ? at(C.done, lv) : at(C.noHe, lv), x0, h - 34, 26, 600, w - x0 - 30, 'Nunito')
      g.textAlign = 'center'
      g.fillStyle = '#ffd9a8'
      fitText(g, C.weighed, x0 + 260, 58, 40, 700, w - x0 - 40)
    }
    card.tex.needsUpdate = true
  }

  const recipePanel = lv => ({
    title: E.recipe.title,
    color: '#ff9e4a',
    blocks: [
      {
        slider: {
          label: E.recipe.slider,
          min: 1,
          max: 24,
          step: 0.5,
          value: R.c,
          onInput: v => setClock(v),
          format: v => fill(E.recipe.card.clock, { m: nf(Number(v), { maximumFractionDigits: 1 }) }),
          live: () => R.c,
        },
      },
      {
        buttons: [
          { label: E.recipe.buttons.join, onClick: () => recipeStep('neutron') },
          { label: E.recipe.buttons.fuse, onClick: () => recipeStep('deuteron') },
          { label: E.recipe.buttons.weigh, onClick: () => recipeStep('balance') },
          { label: E.recipe.buttons.reset, onClick: () => recipeStep('reset') },
        ],
      },
      ...paras(E.recipe.panel, lv),
    ],
  })
  const recipeChanged = () => {
    recipeMine = true
    ex.discover('recipe', recipePanel, 2.6)
    share('recipe')
  }
  /** A visitor's step at the tray: 'neutron' (a tap on a neutron; k which), 'deuteron', 'balance', 'reset'. */
  function recipeStep(what, k = null) {
    const lv = level()
    const S = E.recipe.says
    if (bounce) return say(at(W.busy, lv))
    if (what === 'tray') what = R.w ? 'reset' : freeN() ? 'neutron' : R.n.includes(1) && !heMade() ? 'deuteron' : 'balance'
    if (what === 'neutron') {
      if (R.w) return say(at(S.again, lv))
      if (k == null || R.n[k] !== 0) k = R.n.findIndex(v => v === 0)
      if (k < 0) return say(at(R.n.includes(1) && !heMade() ? S.toDeuteron : S.toBalance, lv))
      if (R.c < MIN_HOT) {
        // too early: light breaks every deuteron as it forms
        bounce = { k, t: 0 }
        play('join')
        later(0.75, () => play('crack'))
        say(at(S.hot, lv))
        recipeMine = true
        ex.discover('recipe', recipePanel, 3.2)
        return
      }
      R.n[k] = 1
      flashAt(pairMid(k))
      play('join')
      say(at(S.join, lv))
    } else if (what === 'deuteron') {
      if (R.w) return say(at(S.again, lv))
      const d = R.n.filter(v => v === 1).length
      if (d === 0) return say(at(heMade() ? S.toBalance : S.toNeutron, lv))
      if (d === 1) return say(at(R.n.includes(0) ? S.partner : S.lonely, lv))
      if (R.c > MIN_COLD) return say(at(S.cold, lv))
      R.n = [3, 3]
      flashAt(HE_AT)
      play('celebrate')
      say(at(S.fuse, lv))
    } else if (what === 'balance') {
      if (R.w) return say(at(heMade() ? S.weigh : S.weighNoHe, lv))
      if (freeN()) return say(at(S.notYet, lv))
      R.w = 1
      play('select')
      say(at(heMade() ? S.weigh : S.weighNoHe, lv))
    } else if (what === 'reset') {
      R.c = MIN_HOT
      R.n = [0, 0]
      R.w = 0
      play('tap')
      say(at(S.reset, lv))
    } else return
    recipeChanged()
  }
  /** The clock: past 13 minutes a free neutron has decayed into a proton (and stays one). */
  function setClock(v, now = false) {
    const c = clamp(Math.round(Number(v) * 2) / 2, 1, 24)
    if (c === R.c) return
    const was = R.c
    R.c = c
    const lv = level()
    if (was < MIN_DECAY && c >= MIN_DECAY && !R.w) {
      const k = R.n[1] === 0 ? 1 : R.n[0] === 0 ? 0 : -1
      if (k >= 0) {
        R.n[k] = 2
        startDecay(k)
        say(at(E.recipe.says.decay, lv))
      }
    }
    if (was <= MIN_COLD && c > MIN_COLD) say(at(E.recipe.says.late, lv))
    else if (was >= MIN_HOT && c < MIN_HOT) say(at(E.recipe.says.early, lv))
    recipeMine = true
    ex.discover('recipe', recipePanel, 2.6)
    if (now) share('recipe')
    else sendSoon('recipe')
  }
  function startDecay(k) {
    decayAnim = { k, t: 0, dir: V3(0.3, 1, Math.random() - 0.5).normalize() }
    play('decay')
  }
  balls.forEach(b => {
    if (b.isN) clickable(b.hit, () => recipeStep(R.n[N_IDX.indexOf(b.i)] === 1 ? 'deuteron' : 'neutron', N_IDX.indexOf(b.i)), { reach: 5 })
    else clickable(b.hit, () => recipeStep(PARTNER.includes(b.i) && R.n[PARTNER.indexOf(b.i)] === 1 ? 'deuteron' : 'tray'), { reach: 5 })
  })
  clickable(trayHit, () => recipeStep('tray'), { reach: 5 })
  clickable(balanceHit, () => recipeStep('balance'), { reach: 5.5 })
  clickable(card.face, () => ctx.showPanel(recipePanel), { reach: 6 })
  ex.add({
    id: 'recipe',
    x: -1.55,
    z: 7.1,
    radius: 2.4,
    manual: true,
    label: E.recipe.label,
    verb: () => {
      const h = E.recipe.hints
      if (R.w) return h.again
      if (R.c < MIN_HOT) return h.hot
      if (freeN() === 2) return h.neutron
      if (freeN() === 1) return h.other
      if (R.n.filter(v => v === 1).length === 2) return R.c > MIN_COLD ? h.cold : h.deuteron
      return h.balance
    },
    focus: focusOf(-3.55, 1.22, 7.05, 2.1, 3.5),
    act: () => ctx.showPanel(recipePanel),
  })
  const tmpHeap = new THREE.Vector3()
  updates.push((dt, t) => {
    // where each ball wants to be: home (jiggling with the heat), in its deuteron, in helium, or on a pan
    const he = heMade()
    let hj = 0
    const jig = 0.012 + 0.012 * clamp((24 - R.c) / 24)
    tilt = damp(tilt, R.w ? (he ? 0.17 : 0.3) : 0, 3, dt)
    for (const b of balls) {
      const k = b.isN ? N_IDX.indexOf(b.i) : PARTNER.indexOf(b.i)
      const st = k >= 0 ? R.n[k] : 0
      let want
      if (R.w && !(k >= 0 && st === 3)) want = heapSpot(1, hj++)
      else if (k >= 0 && st === 1) {
        const m = pairMid(k)
        const axis = balls[N_IDX[k]].home.clone().sub(balls[PARTNER[k]].home).normalize()
        want = m.addScaledVector(axis, b.isN ? 0.066 : -0.066)
      } else if (k >= 0 && st === 3) {
        const base = R.w ? panAt(-1, tmpHeap).add(balance.position).sub(tray.position).add(V3(0, 0.12, 0)) : HE_AT.clone()
        want = base.add(TET[b.isN ? k * 2 : k * 2 + 1])
      } else want = b.home.clone().add(V3(Math.sin(t * 7 + b.seed) * jig, Math.abs(Math.sin(t * 5.3 + b.seed * 2)) * jig, Math.cos(t * 6.1 + b.seed) * jig))
      // a too-hot try: the neutron flies to its proton and is knocked back
      if (bounce && b.isN && N_IDX.indexOf(b.i) === bounce.k) {
        const to = pairMid(bounce.k)
        const go = span(0, 0.35, bounce.t) * (1 - span(0.75, 1.05, bounce.t))
        want = b.home.clone().lerp(to, go)
      }
      b.pos.x = damp(b.pos.x, want.x, R.w ? 4 : 9, dt)
      b.pos.y = damp(b.pos.y, want.y, R.w ? 4 : 9, dt)
      b.pos.z = damp(b.pos.z, want.z, R.w ? 4 : 9, dt)
      b.mesh.position.copy(b.pos)
      b.hit.position.copy(b.pos)
      b.mesh.material = b.isN && st !== 2 ? neutronMat : protonMat
    }
    heGlow.material.opacity = damp(heGlow.material.opacity, he ? 0.75 : 0, 4, dt)
    if (he) heGlow.position.copy(balls[N_IDX[0]].pos).add(balls[N_IDX[1]].pos).multiplyScalar(0.5)
    if (bounce) {
      bounce.t += dt
      // the light that breaks it: a streak flying in to the deuteron
      const k = bounce.k
      const to = pairMid(k).add(tray.position)
      if (bounce.t > 0.45 && bounce.t < 0.8) {
        const u = (bounce.t - 0.45) / 0.3
        const from = to.clone().add(V3(0.9, 0.5, 0.6))
        drawPhoton(PH - 1, from.lerp(to, u), V3(-0.9, -0.5, -0.6), 0.35, phCol.set('#fff0c0'), 1.4)
      } else hidePhoton(PH - 1)
      if (bounce.t > 0.74 && !bounce.flashed) {
        bounce.flashed = true
        flashAt(pairMid(k))
      }
      if (bounce.t > 1.2) {
        bounce = null
        hidePhoton(PH - 1)
      }
    }
    if (flash) {
      flash.t += dt
      flashSp.position.copy(flash.p)
      flashSp.material.opacity = Math.max(0, 1 - flash.t / 0.5)
      flashSp.scale.setScalar(0.25 + flash.t * 0.9)
      if (flash.t > 0.5) flash = null
    } else flashSp.material.opacity = 0
    if (decayAnim) {
      decayAnim.t += dt
      const b = balls[N_IDX[decayAnim.k]]
      decayE.visible = decayAnim.t < 1.4
      decayE.position.copy(b.pos).addScaledVector(decayAnim.dir, decayAnim.t * 0.8)
      if (decayAnim.t > 1.4) decayAnim = null
    }
    // the balance's pans hang level from the tilted beam
    beam.rotation.x = tilt
    for (const { s, pan } of pans) pan.position.copy(panAt(s))
    drawCard()
  })
  const recipeSet = (s, liveSet) => {
    const c = clamp(Math.round(Number(s?.c) * 2) / 2 || MIN_HOT, 1, 24)
    const n = [0, 1].map(k => [0, 1, 2, 3].includes(s?.n?.[k]) ? s.n[k] : 0)
    const w = s?.w ? 1 : 0
    if (liveSet) {
      n.forEach((v, k) => {
        if (v === 2 && R.n[k] !== 2) startDecay(k)
        if (v === 1 && R.n[k] === 0) {
          flashAt(pairMid(k))
          play('join')
        }
      })
      if (n[0] === 3 && R.n[0] !== 3) {
        flashAt(HE_AT)
        play('celebrate')
      }
      if (w && !R.w) play('select')
    }
    R.c = c
    R.n = n
    R.w = w
    recipeMine = false
  }

  // ======== the cooling: the time rail, the gauge, the particles ========
  const C = { s: 0, m: 0 } // the place on the rail (0..1), and which of the 12 protons hold an electron (bits)
  let coolMine = false
  const caughtCount = () => {
    let n = 0
    for (let i = 0; i < NP; i++) if (C.m & (1 << i)) n++
    return n
  }
  const tNow = () => timeAt(C.s)
  const TNow = () => tempAt(tNow())
  const heWant = () => (C.s >= S_HE2 ? 2 : C.s >= S_HE1 ? 1 : 0)
  // the rail: a brass tube on posts, its marks, the band where it is cool enough, the knob
  const railZ = s => RAIL.z0 + s * (RAIL.z1 - RAIL.z0)
  const sAtZ = z => clamp((z - RAIL.z0) / (RAIL.z1 - RAIL.z0))
  {
    const len = Math.abs(RAIL.z1 - RAIL.z0) + 0.4
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, len, 12), brass)
    tube.rotation.x = Math.PI / 2
    tube.position.set(RAIL.x, RAIL.y, (RAIL.z0 + RAIL.z1) / 2)
    root.add(tube)
    for (const z of [RAIL.z0 - 0.15, (RAIL.z0 + RAIL.z1) / 2, RAIL.z1 + 0.15]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, RAIL.y, 10), brass)
      post.position.set(RAIL.x, RAIL.y / 2, z)
      root.add(post)
    }
    // the rest of the walkway's edge there: the rail's own barrier
    solids.push(box(RAIL.x, (OPEN.z0 + OPEN.z1) / 2, 0.14, OPEN.z1 - OPEN.z0, { y1: 1.0 }))
    for (const z of [OPEN.z0, OPEN.z1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, RAIL.y, 10), brass)
      post.position.set(RAIL.x, RAIL.y / 2, z)
      root.add(post)
    }
    // where it is cool enough for atoms: a cyan sleeve on the tube
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, Math.abs(railZ(1) - railZ(S_CATCH)), 12),
      new THREE.MeshStandardMaterial({ color: ELECTRON, emissive: ELECTRON, emissiveIntensity: 0.8, roughness: 0.3 }),
    )
    band.rotation.x = Math.PI / 2
    band.position.set(RAIL.x, RAIL.y, (railZ(1) + railZ(S_CATCH)) / 2)
    root.add(band)
    MARKS.forEach((s, j) => {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.025), brass)
      tick.position.set(RAIL.x, RAIL.y + 0.1, railZ(s))
      root.add(tick)
      const label = sign(E.cooling.marks[j], 0.07, { color: '#ffe0b0', maxWidth: 1.0 })
      label.position.set(RAIL.x - 0.02, RAIL.y + 0.24, railZ(s))
      label.rotation.y = -Math.PI / 2
      root.add(label)
    })
  }
  const knob = new THREE.Group()
  {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), brass)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.012, 8, 32), new THREE.MeshStandardMaterial({ color: '#ffb35c', emissive: '#ffb35c', emissiveIntensity: 1.4 }))
    ring.rotation.y = Math.PI / 2
    const knobHit = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 8), ghost)
    knob.add(ball, ring, knobHit)
    knob.position.set(RAIL.x, RAIL.y, railZ(0))
    root.add(knob)
  }
  const railHit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, Math.abs(RAIL.z1 - RAIL.z0) + 0.3), ghost)
  railHit.position.set(RAIL.x, RAIL.y + 0.05, (RAIL.z0 + RAIL.z1) / 2)
  root.add(railHit)
  let knobS = 0

  // the gauge over the rail: the time, the temperature (Scientist), the atoms made
  const gauge = screen(GAUGE.w, GAUGE.h, 1024)
  {
    const holder = new THREE.Group()
    holder.position.set(GAUGE.x, GAUGE.y, GAUGE.z)
    holder.rotation.y = -Math.PI / 2
    gauge.group.rotation.x = 0.22 // tilted down toward the walkway
    holder.add(gauge.group)
    root.add(holder)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, GAUGE.y - GAUGE.h / 2, 10), darkMetal)
    pole.position.set(GAUGE.x + 0.12, (GAUGE.y - GAUGE.h / 2) / 2, GAUGE.z)
    root.add(pole)
  }
  let gaugeKey = ''
  function drawGauge(nShown, heShown) {
    const lv = level()
    const T = TNow()
    const key = [Math.round(C.s * 1000), nShown, heShown, lv].join()
    if (key === gaugeKey) return
    gaugeKey = key
    const { g, w, h } = gauge
    const G = E.cooling.gauge
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillStyle = '#9fb3e6'
    fitText(g, G.since, 40, 52, 30, 600, w - 80, 'Nunito')
    g.fillStyle = '#ffffff'
    fitText(g, timeText(tNow()), 40, 118, 74, 700, w - 80)
    // the thermometer: from a billion kelvin (gold) to 3000 K (red), the marker where it is now
    const bx = 40
    const bw = w - 80
    const by = 205
    const grd = g.createLinearGradient(bx, 0, bx + bw, 0)
    for (const [k, T2] of [[0, 1e9], [0.3, 1e7], [0.55, 1e5], [0.8, 1e4], [1, 3000]]) grd.addColorStop(k, `#${fogColour(T2).getHexString(THREE.SRGBColorSpace)}`)
    g.fillStyle = grd
    g.fillRect(bx, by - 14, bw, 28)
    const kx = clamp((9 - Math.log10(T)) / (9 - Math.log10(2970)))
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.moveTo(bx + kx * bw, by - 18)
    g.lineTo(bx + kx * bw - 14, by - 40)
    g.lineTo(bx + kx * bw + 14, by - 40)
    g.fill()
    g.fillStyle = '#ffd9a8'
    g.textAlign = kx > 0.6 ? 'right' : 'left'
    const tLine = lv === 'scientist' ? fill(G.temp, { t: tempText(T) }) : T <= 4000 ? G.coolKid : G.hotKid
    fitText(g, tLine, kx > 0.6 ? w - 40 : 40, by + 50, 34, 700, w - 80, 'Nunito')
    // the atoms made: 12 hydrogen and 1 helium
    g.textAlign = 'left'
    g.fillStyle = '#9fb3e6'
    fitText(g, fill(G.atoms, { n: nShown + (heShown >= 2 ? 1 : 0), total: NP + 1 }), 40, 330, 34, 700, 520)
    for (let i = 0; i < NP + 1; i++) {
      const x = 70 + i * 70
      const y = 410
      if (i === NP) {
        dotAt(g, x, y, 15, heShown >= 2 ? '#ffe2a0' : '#8a7a55', heShown >= 2)
        continue
      }
      dotAt(g, x, y, 11, i < nShown ? PROTON : '#5c3a48', i < nShown)
    }
    g.fillStyle = '#9fb3e6'
    g.textAlign = 'right'
    const legend = `${G.legend}`
    fitText(g, legend, w - 40, 330, 26, 600, 440, 'Nunito')
    gauge.tex.needsUpdate = true
  }

  // ---- the particles ----
  const pGeo = new THREE.SphereGeometry(0.12, 22, 16)
  const eGeo = new THREE.SphereGeometry(0.055, 14, 10)
  const ringGeo = new THREE.TorusGeometry(0.34, 0.009, 6, 56)
  const chamberHits = new THREE.Group()
  root.add(chamberHits)
  const inBox = () => V3(CH.x0 + Math.random() * (CH.x1 - CH.x0), CH.y0 + Math.random() * (CH.y1 - CH.y0), CH.z0 + Math.random() * (CH.z1 - CH.z0))
  const protons = Array.from({ length: NP }, (_, i) => {
    const core = new THREE.Mesh(pGeo, protonMat)
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.visible = false
    ring.quaternion.setFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0))
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), ghost)
    hit.userData = { kind: 'p', i }
    root.add(core, ring)
    chamberHits.add(hit)
    const pos = inBox()
    return { i, core, ring, hit, pos, vel: randDir().multiplyScalar(0.5), e: -1, ringK: 0 }
  })
  // the helium nucleus: two protons, two neutrons
  const helium = (() => {
    const g = new THREE.Group()
    const small = new THREE.SphereGeometry(0.085, 16, 12)
    TET.forEach((v, k) => {
      const m = new THREE.Mesh(small, k % 2 ? neutronMat : protonMat)
      m.position.copy(v).multiplyScalar(1.15)
      g.add(m)
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.009, 6, 56), ringMat)
    ring.visible = false
    ring.quaternion.setFromEuler(new THREE.Euler(0.9, 0.3, 0))
    root.add(g, ring)
    return { g, ring, pos: inBox(), vel: randDir().multiplyScalar(0.3), held: [], ringK: 0 }
  })()
  const electrons = Array.from({ length: NE }, (_, j) => {
    const core = new THREE.Mesh(eGeo, electronMat)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), ghost)
    hit.userData = { kind: 'e', i: j }
    root.add(core)
    chamberHits.add(hit)
    return { j, core, hit, pos: inBox(), vel: randDir().multiplyScalar(1.2), owner: null, fly: null, phase: Math.random() * TAU }
  })
  const pGlow = glowPoints(NP + 1, PROTON, 0.7)
  const eGlow = glowPoints(NE, '#5fc8ff', 0.36)
  // owner: { p: i } a proton's, { he: k } helium's; fly: { from, t, kind: 'in' | 'out' | 'hot', dir }
  const isFreeE = e => !e.owner && !e.fly
  const freeElectrons = () => electrons.filter(isFreeE)
  /** An electron caught by proton i (or helium): flies onto its ring. `hot`: knocked off again at once. */
  function catchOnto(target, { hot = false } = {}) {
    const at = target === 'he' ? helium.pos : protons[target].pos
    let best = null
    let bestD = Infinity
    for (const e of electrons) {
      if (!isFreeE(e)) continue
      const d = e.pos.distanceTo(at)
      if (d < bestD) {
        bestD = d
        best = e
      }
    }
    if (!best) return null
    if (target === 'he') {
      best.owner = { he: helium.held.length }
      helium.held.push(best.j)
    } else {
      best.owner = { p: target }
      protons[target].e = best.j
    }
    best.fly = { from: best.pos.clone(), t: 0, kind: hot ? 'hot' : 'in' }
    return best
  }
  /** Proton i's (or helium's last) electron leaves: knocked off by light, or set free by the heat. */
  function release(target) {
    let e
    if (target === 'he') {
      const j = helium.held.pop()
      if (j == null) return
      e = electrons[j]
    } else {
      const p = protons[target]
      if (p.e < 0) return
      e = electrons[p.e]
      p.e = -1
    }
    e.owner = null
    e.fly = { from: e.pos.clone(), t: 0, kind: 'out', dir: randDir() }
  }
  // the rest of the hydrogen catching their electrons after the visitor's eighth: one after another
  let restQueue = []
  const ringSpot = (center, ring, phase, r, out) => {
    out.set(Math.cos(phase) * r, Math.sin(phase) * r, 0).applyQuaternion(ring.quaternion).add(center)
    return out
  }
  const coolPanel = lv => ({
    title: E.cooling.title,
    color: '#ff9e4a',
    blocks: [
      {
        slider: {
          label: E.cooling.slider,
          min: 0,
          max: 1000,
          step: 1,
          value: Math.round(C.s * 1000),
          onInput: v => setS(Number(v) / 1000),
          format: v => {
            const tt = timeAt(Number(v) / 1000)
            return lv === 'scientist' ? `${timeText(tt)} · ${tempText(tempAt(tt))}` : timeText(tt)
          },
          live: () => Math.round(C.s * 1000),
        },
      },
      {
        buttons: [
          { label: E.cooling.buttons.forward, onClick: () => coolStep('knob') },
          { label: E.cooling.buttons.catch, onClick: () => coolStep('proton') },
          { label: E.cooling.buttons.back, onClick: () => coolStep('back') },
        ],
      },
      ...paras(E.cooling.panel, lv),
    ],
  })
  const told = { ready: false, he1: false, he2: false }
  /** The time moves (the rail, the knob, the slider): helium follows by itself; too hot again breaks the atoms. */
  function setS(v, now = false) {
    const s = clamp(Math.round(Number(v) * 1000) / 1000)
    if (s === C.s) return
    const was = C.s
    C.s = s
    coolMine = true
    const lv = level()
    const Sy = E.cooling.says
    if (s < S_CATCH && C.m) {
      C.m = 0
      restQueue = []
      say(at(Sy.heat, lv))
    } else if (was < S_CATCH && s >= S_CATCH && !told.ready) {
      told.ready = true
      say(at(Sy.ready, lv))
    } else if (was < S_HE2 && s >= S_HE2 && !told.he2) {
      told.he2 = true
      say(at(Sy.he2, lv))
    } else if (was < S_HE1 && s >= S_HE1 && !told.he1) {
      told.he1 = true
      say(at(Sy.he1, lv))
    }
    if (s < S_HE1) told.he1 = told.he2 = told.ready = false
    ex.discover('cooling', coolPanel, 3)
    if (now) share('cooling')
    else sendSoon('cooling')
  }
  /** A visitor's step at the cooling: 'proton' (a tap on proton i, or the nearest free one), 'knob' (to the
   *  next mark), 'rail' (a place on it), 'back' (to 3 minutes). */
  function coolStep(what, arg = null) {
    const lv = level()
    const Sy = E.cooling.says
    if (what === 'knob') {
      if (C.s >= 0.999) return coolStep('back')
      const next = MARKS.find(m => m > C.s + 0.004) ?? 1
      play('tap')
      return setS(next, true)
    }
    if (what === 'rail') {
      play('tap')
      return setS(arg, true)
    }
    if (what === 'back') {
      play('tap')
      return setS(0, true)
    }
    if (what !== 'proton') return
    let i = arg
    if (i == null || C.m & (1 << i) || protons[i].e >= 0) {
      // the nearest free proton to the visitor
      const pl = ctx.engine.player.pos
      let bestD = Infinity
      i = -1
      protons.forEach(p => {
        const d = p.pos.distanceTo(pl)
        if (!(C.m & (1 << p.i)) && p.e < 0 && d < bestD) {
          bestD = d
          i = p.i
        }
      })
      if (i < 0) return say(at(caughtCount() >= NP ? Sy.clear : Sy.wait, lv))
    }
    if (C.s < S_CATCH) {
      // too hot: caught a moment, then knocked off by the light
      if (catchOnto(i, { hot: true })) play('electron')
      say(at(Sy.hot, lv))
      coolMine = true
      ex.discover('cooling', coolPanel, 3.4)
      return
    }
    C.m |= 1 << i
    catchOnto(i)
    play('electron')
    const n = caughtCount()
    if (n >= REST && n < NP) {
      // the rest catch theirs everywhere at once (in turn, to be seen)
      for (let k = 0; k < NP; k++) if (!(C.m & (1 << k))) restQueue.push({ i: k, wait: 0.35 + restQueue.length * 0.22 })
      for (const q of restQueue) C.m |= 1 << q.i
      // and time runs on to 380,000 years, when it was done everywhere
      C.s = 1
      say(at(Sy.rest, lv))
      later(restQueue.length * 0.22 + 1.6, () => coolMine && caughtCount() >= NP && say(at(Sy.clear, level())))
    } else say(fill(at(n === 1 ? Sy.caught : Sy.more, lv), { n }))
    coolMine = true
    ex.discover('cooling', coolPanel, 3.4)
    share('cooling')
  }
  clickable(chamberHits, h => {
    const u = h.object.userData
    if (u.kind === 'p') coolStep('proton', u.i)
    else {
      // an electron: the nearest free proton to it catches it
      const e = electrons[u.i]
      let best = -1
      let bestD = Infinity
      protons.forEach(p => {
        const d = p.pos.distanceTo(e.pos)
        if (!(C.m & (1 << p.i)) && p.e < 0 && d < bestD) {
          bestD = d
          best = p.i
        }
      })
      if (best >= 0) coolStep('proton', best)
    }
  }, {
    reach: 7.5,
    accept: h => {
      const u = h.object.userData
      return u.kind === 'p' ? !(C.m & (1 << u.i)) && protons[u.i].e < 0 : isFreeE(electrons[u.i])
    },
  })
  clickable(knob, () => coolStep('knob'), { reach: 5 })
  clickable(railHit, h => coolStep('rail', sAtZ(h.point.z)), { reach: 5 })
  ex.add({
    id: 'cooling',
    x: 0.55,
    z: -4.1,
    radius: 2.6,
    manual: true,
    label: E.cooling.label,
    verb: () => {
      const h = E.cooling.hints
      const n = caughtCount()
      if (n >= NP) return h.clear
      if (C.s < S_CATCH) return h.slide
      return fill(h.tap, { n })
    },
    focus: focusOf(3.3, 1.9, -4.1, 3.6, 4.4),
    act: () => ctx.showPanel(coolPanel),
  })

  // ---- the light ----
  const chamberPh = Array.from({ length: PH_CH }, () => ({ pos: inBox(), dir: randDir(), target: -1, left: 0.5 }))
  const ambPh = Array.from({ length: PH_AMB }, () => {
    const z = 14 - Math.random() * 28
    const r = stage.radiusAt(z) * Math.sqrt(Math.random()) * 0.8
    const a = Math.random() * TAU
    return { pos: V3(Math.cos(a) * r, AXIS_Y + Math.sin(a) * r, z), dir: randDir(), left: 0.5, out: 0 }
  })
  const field = { F: 1, col: new THREE.Color() }
  const lightCol = new THREE.Color()
  const HOT_LIGHT = new THREE.Color('#fff2c8')
  const COOL_LIGHT = new THREE.Color('#ffb26a')
  const STRETCHED = new THREE.Color('#a23a2a') // light out over the terrace, reddening on its way to microwaves
  /** The light's own colour at a temperature: pale gold when hottest, orange near 3000 K. */
  const lightColour = (T, out) => out.copy(COOL_LIGHT).lerp(HOT_LIGHT, clamp((Math.log10(T) - 3.47) / 3))

  let fogNow = 1
  let heShown = 0
  updates.push((dt, t) => {
    const T = TNow()
    const cool = C.s >= S_CATCH
    const speed = 0.35 + 1.3 * clamp((Math.log10(T) - 3.4) / 5.6)
    // hydrogen's electrons as the state says: caught where a bit is set, set free where it is not
    for (const p of protons) {
      const want = !!(C.m & (1 << p.i))
      const queued = restQueue.some(q => q.i === p.i)
      if (want && p.e < 0 && !queued) catchOnto(p.i)
      else if (!want && p.e >= 0 && electrons[p.e].fly?.kind !== 'hot') release(p.i)
    }
    for (let q = restQueue.length - 1; q >= 0; q--) {
      restQueue[q].wait -= dt
      if (restQueue[q].wait <= 0) {
        const i = restQueue[q].i
        restQueue.splice(q, 1)
        if (C.m & (1 << i) && protons[i].e < 0) {
          catchOnto(i)
          play('electron')
        }
      }
    }
    // helium's: by itself, first one, then two, as it cools
    const hw = heWant()
    if (helium.held.length < hw && freeElectrons().length) catchOnto('he')
    else if (helium.held.length > hw) release('he')
    // move the free ones about (slower as it cools), the atoms drift gently
    const bounds = (pos, vel, m) => {
      for (const [k, lo, hi] of [['x', CH.x0, CH.x1], ['y', CH.y0, CH.y1], ['z', CH.z0, CH.z1]]) {
        if (pos[k] < lo + m) vel[k] += (lo + m - pos[k]) * 6 * dt
        if (pos[k] > hi - m) vel[k] -= (pos[k] - hi + m) * 6 * dt
      }
      // keep clear of the gauge
      const gx = pos.x - GAUGE.x
      const gz = pos.z - GAUGE.z
      if (Math.abs(gz) < GAUGE.w / 2 + 0.3 && Math.abs(pos.y - GAUGE.y) < GAUGE.h / 2 + 0.3 && gx < 0.6) vel.x += 3 * dt
    }
    const wander = (pos, vel, vmax, k) => {
      vel.x += (Math.random() - 0.5) * k * dt
      vel.y += (Math.random() - 0.5) * k * dt
      vel.z += (Math.random() - 0.5) * k * dt
      const v = vel.length()
      if (v > vmax) vel.multiplyScalar(vmax / v)
      pos.addScaledVector(vel, dt)
    }
    let nShown = 0
    for (const p of protons) {
      const atom = p.e >= 0 && !electrons[p.e].fly
      wander(p.pos, p.vel, atom ? 0.22 : speed * 0.55, atom ? 0.6 : 3)
      bounds(p.pos, p.vel, 0.4)
      p.core.position.copy(p.pos)
      p.hit.position.copy(p.pos)
      p.ringK = damp(p.ringK, atom ? 1 : 0, 5, dt)
      p.ring.visible = p.ringK > 0.02
      p.ring.position.copy(p.pos)
      p.ring.scale.setScalar(0.4 + 0.6 * p.ringK)
      if (atom) nShown++
    }
    wander(helium.pos, helium.vel, helium.held.length ? 0.2 : speed * 0.4, 2)
    bounds(helium.pos, helium.vel, 0.5)
    helium.g.position.copy(helium.pos)
    helium.g.rotation.y += dt * 0.6
    const heHeld = helium.held.filter(j => !electrons[j].fly).length
    helium.ringK = damp(helium.ringK, heHeld ? 1 : 0, 5, dt)
    helium.ring.visible = helium.ringK > 0.02
    helium.ring.position.copy(helium.pos)
    helium.ring.scale.setScalar(0.4 + 0.6 * helium.ringK)
    heShown = heHeld
    for (const e of electrons) {
      if (e.fly) {
        const f = e.fly
        f.t += dt
        if (f.kind === 'out') {
          e.pos.addScaledVector(f.dir, dt * 2.4 * (1 - f.t / 0.8))
          if (f.t > 0.6) {
            e.vel.copy(f.dir).multiplyScalar(speed * 1.4)
            e.fly = null
          }
        } else {
          // into its ring; a hot one is knocked off after a moment
          const own = e.owner
          if (!own) {
            e.fly = null
            continue
          }
          const center = own.he != null ? helium.pos : protons[own.p].pos
          const ring = own.he != null ? helium.ring : protons[own.p].ring
          e.phase += dt * 5
          const spot = ringSpot(center, ring, e.phase + (own.he ?? 0) * Math.PI, own.he != null ? 0.3 : 0.34, tmpV)
          const k = span(0, 0.55, f.t)
          e.pos.copy(f.from).lerp(spot, k)
          if (f.kind === 'in' && f.t > 0.55) e.fly = null
          if (f.kind === 'hot' && f.t > 0.95) {
            // the light that knocks it off: a streak flying in
            const own2 = e.owner
            if (own2?.p != null) protons[own2.p].e = -1
            e.owner = null
            e.fly = { from: e.pos.clone(), t: 0, kind: 'out', dir: randDir() }
            hotHit = { at: e.pos.clone(), t: 0 }
            play('crack')
          }
        }
      } else if (e.owner) {
        const own = e.owner
        const center = own.he != null ? helium.pos : protons[own.p].pos
        const ring = own.he != null ? helium.ring : protons[own.p].ring
        e.phase += dt * 3.2
        ringSpot(center, ring, e.phase + (own.he ?? 0) * Math.PI, own.he != null ? 0.3 : 0.34, e.pos)
      } else {
        wander(e.pos, e.vel, speed * 1.25, 7)
        bounds(e.pos, e.vel, 0.3)
      }
      e.core.position.copy(e.pos)
      e.hit.position.copy(e.pos)
    }
    // glows
    {
      const pp = pGlow.geometry.attributes.position
      protons.forEach((p, i) => pp.setXYZ(i, p.pos.x, p.pos.y, p.pos.z))
      pp.setXYZ(NP, helium.pos.x, helium.pos.y, helium.pos.z)
      pp.needsUpdate = true
      const ep = eGlow.geometry.attributes.position
      electrons.forEach((e, j) => ep.setXYZ(j, e.pos.x, e.pos.y, e.pos.z))
      ep.needsUpdate = true
    }
    // the fog: thinner with every electron caught; its colour from the temperature
    const freeShare = freeElectrons().length / NE
    fogNow = damp(fogNow, freeShare <= 0.001 ? 0 : 0.25 + 0.75 * freeShare, 1.6, dt)
    stage.set({ temp: T, fog: fogNow })
    knobS = damp(knobS, C.s, 8, dt)
    knob.position.z = railZ(knobS)
    drawGauge(nShown, heShown)

    // the light in the chamber: from electron to electron while they are free, straight once caught
    lightColour(T, lightCol)
    const free = freeElectrons()
    const clear = free.length === 0
    chamberPh.forEach((ph, i) => {
      const step = dt * 3.2
      if (ph.target >= 0) {
        const e = electrons[ph.target]
        if (!isFreeE(e)) ph.target = -1
        else {
          ph.dir.copy(e.pos).sub(ph.pos)
          const d = ph.dir.length()
          ph.dir.normalize()
          if (d < step) {
            ph.pos.copy(e.pos)
            ph.target = -1
            ph.left = 0
          } else ph.pos.addScaledVector(ph.dir, step)
        }
      } else {
        ph.pos.addScaledVector(ph.dir, step)
        ph.left -= step
      }
      if (ph.target < 0 && ph.left <= 0) {
        // a bounce: on to another free electron nearby, or straight on
        const near = free.filter(e => e.pos.distanceTo(ph.pos) < 3.2)
        if (near.length && Math.random() < 0.35 + 0.65 * (free.length / NE)) {
          ph.target = near[(Math.random() * near.length) | 0].j
        } else {
          ph.target = -1
          if (clear) ph.dir.set((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08, -1).normalize()
          else randDir(ph.dir)
          ph.left = clear ? 99 : 0.6 + 4 * (1 - free.length / NE) ** 2
        }
      }
      if (clear) {
        // straight down the tunnel and out: begin again at the chamber's start
        if (ph.pos.z < CH.z0 - 3) {
          ph.pos.copy(inBox()).setZ(CH.z1 + Math.random() * 2)
          ph.dir.set((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08, -1).normalize()
          ph.left = 99
          ph.target = -1
        }
      } else if (ph.pos.x < CH.x0 - 0.5 || ph.pos.x > CH.x1 + 0.5 || ph.pos.y < CH.y0 - 0.3 || ph.pos.y > CH.y1 + 0.5 || ph.pos.z < CH.z0 - 0.5 || ph.pos.z > CH.z1 + 0.5) {
        ph.dir.copy(V3((CH.x0 + CH.x1) / 2, (CH.y0 + CH.y1) / 2, (CH.z0 + CH.z1) / 2).sub(ph.pos).normalize())
        ph.left = 1
        ph.target = -1
      }
      drawPhoton(i, ph.pos, ph.dir, 0.42, lightCol, 0.9)
    })
    // the light all through the horn: zigzag in thick fog, straight where it has cleared, and out of the
    // mouth over the terrace, stretching (redder, longer, fainter: on its way to becoming microwaves)
    ambPh.forEach((ph, k) => {
      const i = PH_CH + k
      stage.fieldAt(ph.pos.z, field)
      const F = field.F
      const step = dt * 3.0
      ph.pos.addScaledVector(ph.dir, step)
      ph.left -= step
      if (ph.pos.z < stage.mouthZ) ph.out += step
      if (ph.left <= 0 && ph.pos.z > stage.mouthZ) {
        if (F > 0.08) {
          randDir(ph.dir)
          ph.left = 0.5 + 6 * (1 - F) ** 2
        } else {
          ph.dir.set((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, -1).normalize()
          ph.left = 99
        }
      }
      const r = stage.radiusAt(ph.pos.z) * 0.9
      const off = Math.hypot(ph.pos.x, ph.pos.y - AXIS_Y)
      const gone = ph.out > 9 || (ph.pos.z > stage.mouthZ && (off > r || ph.pos.z > 15))
      if (gone) {
        // begin again somewhere in the horn: where the fog has cleared, flying on toward the mouth
        const z0 = fogNow < 0.05 ? -6 - Math.random() * 8 : 14 - Math.random() * 28
        const rr = stage.radiusAt(z0) * Math.sqrt(Math.random()) * 0.7
        const a = Math.random() * TAU
        ph.pos.set(Math.cos(a) * rr, AXIS_Y + Math.sin(a) * rr, z0)
        ph.out = 0
        ph.left = 0
        randDir(ph.dir)
      } else if (ph.pos.z > stage.mouthZ && off > r * 0.95) {
        ph.dir.x -= ph.pos.x * 0.2
        ph.dir.y -= (ph.pos.y - AXIS_Y) * 0.2
        ph.dir.normalize()
      }
      const stretch = clamp(ph.out / 9)
      lightColour(field.F > 0.5 ? 1e8 : T, phCol)
      phCol.lerp(STRETCHED, stretch * 0.8)
      drawPhoton(i, ph.pos, ph.dir, 0.42 * (1 + stretch * 3.5), phCol, 0.8 * (1 - stretch * 0.85))
    })
    if (hotHit) {
      hotHit.t += dt
      const from = hotHit.at.clone().add(V3(-0.9, 0.4, 0.5).multiplyScalar(1 - hotHit.t / 0.25))
      if (hotHit.t < 0.25) drawPhoton(PH - 2, from, V3(0.9, -0.4, -0.5), 0.4, phCol.set('#fff0c0'), 1.5)
      else {
        hidePhoton(PH - 2)
        hotHit = null
      }
    } else hidePhoton(PH - 2)
    photonMesh.instanceMatrix.needsUpdate = true
    if (photonMesh.instanceColor) photonMesh.instanceColor.needsUpdate = true
  })
  let hotHit = null
  const coolSet = (s, liveSet) => {
    const sv = clamp(Number(s?.s) || 0)
    const m = (Number(s?.m) | 0) & ((1 << NP) - 1)
    C.s = sv
    if (!liveSet) {
      knobS = sv
      restQueue = []
    }
    const added = m & ~C.m
    C.m = sv >= S_CATCH ? m : 0
    if (liveSet && added) play('electron')
    if (!liveSet) {
      // a newcomer: the atoms as they stand, no flights
      for (const p of protons) {
        const want = !!(C.m & (1 << p.i))
        if (want && p.e < 0) {
          const e = catchOnto(p.i)
          if (e) e.fly = null
        } else if (!want && p.e >= 0) {
          const e = electrons[p.e]
          p.e = -1
          e.owner = null
          e.fly = null
        }
        p.ringK = want ? 1 : 0
      }
      while (helium.held.length < heWant() && freeElectrons().length) {
        const e = catchOnto('he')
        if (e) e.fly = null
      }
      fogNow = caughtCount() >= NP && heWant() === 2 ? 0 : fogNow
    }
    coolMine = false
  }

  // ======== the pigeon horn, on the terrace ========
  const Hn = { on: 0, az: 0, p: 0, w: 0 } // the receiver on, where it points (degrees), the pigeons gone, stretches
  let hornMine = false
  const alu = new THREE.MeshStandardMaterial({ color: '#a7b0b9', roughness: 0.6, metalness: 0.5, side: THREE.DoubleSide, flatShading: true })
  const aluDark = new THREE.MeshStandardMaterial({ color: '#59626e', roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide })
  const steel = new THREE.MeshStandardMaterial({ color: '#4b5160', roughness: 0.5, metalness: 0.7 })
  const turn = new THREE.Group() // the turntable, turning with az
  turn.position.set(HOLM.x, 0, HOLM.z)
  root.add(turn)
  const EL = 0.6 // the aperture's elevation (rad)
  const AX_Y = 1.7 // the horn's axis height
  // the funnel runs along the turntable's local x, from the cab (X0, half-width A0) to the reflector box
  // (X1, half-width A1), the box BX long; turned about its axis, the box's open face looks up at EL
  const X0 = -1.9
  const X1 = 0.75
  const A0 = 0.18
  const A1 = 0.78
  const BX = 1.3
  const halfAt = x => (x < X1 ? A0 + ((A1 - A0) * (x - X0)) / (X1 - X0) : A1)
  const lowAt = x => AX_Y - halfAt(x) * (Math.cos(EL) + Math.sin(EL)) // the horn's lowest point there
  // the aperture's lower lip, where the pigeons sit (turntable coordinates)
  const LIP = { y: AX_Y + A1 * (Math.sin(EL) - Math.cos(EL)), z: A1 * (Math.sin(EL) + Math.cos(EL)) }
  const hornGroup = new THREE.Group() // turned about its own long axis (x) to the elevation
  hornGroup.position.y = AX_Y
  turn.add(hornGroup)
  const pigeons = new THREE.Group()
  let pigeonFly = null // { t }
  {
    // the track, fixed to the ground, and the platform that turns on it
    const track = new THREE.Mesh(new THREE.TorusGeometry(HOLM.r, 0.05, 8, 96), steel)
    track.rotation.x = Math.PI / 2
    track.position.set(HOLM.x, 0.05, HOLM.z)
    root.add(track)
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(HOLM.r - 0.1, HOLM.r - 0.1, 0.12, 48), new THREE.MeshStandardMaterial({ color: '#3a4150', roughness: 0.7, metalness: 0.3 }))
    deck.position.y = 0.12
    turn.add(deck)
    solids.push(circle(HOLM.x, HOLM.z, HOLM.r + 0.1, { y1: 1.0 }))
    // the horn: a square funnel from the cab (local -x) to the reflector box (local +x), its open face +z
    const quad = (pts, mat) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3))
      geo.setIndex([0, 1, 2, 0, 2, 3])
      geo.computeVertexNormals()
      return new THREE.Mesh(geo, mat)
    }
    const c0 = [[-A0, -A0], [A0, -A0], [A0, A0], [-A0, A0]]
    const c1 = [[-A1, -A1], [A1, -A1], [A1, A1], [-A1, A1]]
    for (let k = 0; k < 4; k++) {
      const a = c0[k]
      const b = c0[(k + 1) % 4]
      const c = c1[(k + 1) % 4]
      const d = c1[k]
      hornGroup.add(quad([[X0, a[0], a[1]], [X0, b[0], b[1]], [X1, c[0], c[1]], [X1, d[0], d[1]]], alu))
    }
    // ribs round the funnel
    for (let k = 1; k < 6; k++) {
      const x = X0 + ((X1 - X0) * k) / 6
      const a = A0 + ((A1 - A0) * k) / 6
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.04, a * 2 + 0.06, a * 2 + 0.06), aluDark)
      rib.position.x = x
      const inner = new THREE.Mesh(new THREE.BoxGeometry(0.05, a * 2 - 0.02, a * 2 - 0.02), alu)
      inner.position.x = x
      // a hollow frame: four bars rather than a block
      for (const [w, h, y, z] of [[0.04, 0.05, a + 0.02, 0], [0.04, 0.05, -a - 0.02, 0]]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, a * 2 + 0.09), aluDark)
        bar.position.set(x, y, z)
        hornGroup.add(bar)
      }
      for (const z of [a + 0.02, -a - 0.02]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, a * 2 + 0.09, 0.05), aluDark)
        bar.position.set(x, 0, z)
        hornGroup.add(bar)
      }
      rib.visible = inner.visible = false
    }
    // the reflector box at the wide end, open on its +z face (the aperture)
    const bw = A1 * 2
    const boxSide = (w, h, x, y, z, ry, rx = 0) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), alu)
      m.position.set(x, y, z)
      m.rotation.set(rx, ry, 0)
      hornGroup.add(m)
    }
    boxSide(bw, bw, X1 + BX, 0, 0, Math.PI / 2) // its far end
    boxSide(BX, bw, X1 + BX / 2, 0, -A1, 0) // the back
    boxSide(BX, bw, X1 + BX / 2, A1, 0, 0, Math.PI / 2) // the top
    boxSide(BX, bw, X1 + BX / 2, -A1, 0, 0, Math.PI / 2) // the bottom
    // the curved reflector inside, glinting: a quarter cylinder from the funnel's mouth to the aperture
    const refl = new THREE.Mesh(new THREE.CylinderGeometry(BX, BX, bw - 0.02, 24, 1, true, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#c9d2da', roughness: 0.25, metalness: 0.9, side: THREE.DoubleSide }))
    refl.rotation.x = Math.PI / 2
    refl.rotation.z = Math.PI
    refl.position.set(X1 + BX, 0, A1)
    hornGroup.add(refl)
    // the aperture's frame
    const frameMat = new THREE.MeshStandardMaterial({ color: '#d9dee3', roughness: 0.4, metalness: 0.5 })
    for (const [w, h, x, y] of [[BX + 0.08, 0.07, X1 + BX / 2, A1], [BX + 0.08, 0.07, X1 + BX / 2, -A1], [0.07, bw, X1 + 0.02, 0], [0.07, bw, X1 + BX, 0]]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), frameMat)
      f.position.set(x, y, A1)
      hornGroup.add(f)
    }
    hornGroup.rotation.x = -EL
    // the cab at the narrow end, where the receiver was (the horn, cab and all, turns on the track)
    const cabH = AX_Y + 0.25 - 0.18
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.95, cabH, 1.0, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#b9b2a2', roughness: 0.7 }))
    cab.position.set(X0 - 0.42, 0.18 + cabH / 2, 0)
    turn.add(cab)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 1.1), aluDark)
    roof.position.set(X0 - 0.42, 0.18 + cabH + 0.03, 0)
    turn.add(roof)
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), new THREE.MeshStandardMaterial({ color: '#ffd89a', emissive: '#ffbf66', emissiveIntensity: 0.9 }))
    win.position.set(X0 - 0.42, 1.25, 0.505)
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.95), aluDark)
    door.position.set(X0 - 0.42 + 0.48, 0.18 + 0.5, 0)
    door.rotation.y = Math.PI / 2
    turn.add(win, door)
    // its legs: trestles from the platform up to the horn
    for (const x of [-0.6, X1 + 0.65]) {
      const hgt = lowAt(x) - 0.18
      for (const z of [-0.5, 0.5]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, hgt, 0.08), steel)
        leg.position.set(x, 0.18 + hgt / 2, z)
        turn.add(leg)
      }
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.1), steel)
      cross.position.set(x, 0.18 + hgt, 0)
      turn.add(cross)
    }
    // the pigeons, on the aperture's lower lip, and what they left there
    const grey = new THREE.MeshStandardMaterial({ color: '#7d8492', roughness: 0.8 })
    const neck = new THREE.MeshStandardMaterial({ color: '#5f8f86', emissive: '#2a4a46', emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.3 })
    const dark = new THREE.MeshStandardMaterial({ color: '#3b3f48', roughness: 0.8 })
    const beakMat = new THREE.MeshStandardMaterial({ color: '#d9a07a', roughness: 0.6 })
    const bird = () => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), grey)
      body.scale.set(1.45, 0.9, 0.85)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), grey)
      head.position.set(0.17, 0.12, 0)
      const ring = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), neck)
      ring.scale.set(0.8, 0.9, 1)
      ring.position.set(0.12, 0.06, 0)
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.06, 6), beakMat)
      beak.rotation.z = -Math.PI / 2
      beak.position.set(0.24, 0.11, 0)
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.1), dark)
      tail.position.set(-0.2, 0.0, 0)
      tail.rotation.z = 0.25
      const wings = []
      for (const s of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.16), grey)
        wing.geometry.translate(0, 0, s * 0.08)
        wing.position.set(0, 0.04, s * 0.06)
        g.add(wing)
        wings.push({ wing, s })
      }
      g.add(body, head, ring, beak, tail)
      g.userData.wings = wings
      return g
    }
    // standing upright on the lip (the pigeons are not tilted with the horn)
    const b1 = bird()
    b1.scale.setScalar(1.25)
    b1.position.set(X1 + 0.38, LIP.y + 0.13, LIP.z - 0.12)
    b1.rotation.y = -0.6
    const b2 = bird()
    b2.scale.setScalar(1.25)
    b2.position.set(X1 + 0.92, LIP.y + 0.13, LIP.z - 0.16)
    b2.rotation.y = 2.5
    pigeons.add(b1, b2)
    // the droppings, on the lip and down the box's front
    const white = new THREE.MeshStandardMaterial({ color: '#eceee8', roughness: 0.9 })
    const drops = new THREE.Group()
    for (let k = 0; k < 16; k++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.03 + Math.random() * 0.03, 8, 6), white)
      d.scale.y = 0.35
      d.position.set(X1 + 0.1 + Math.random() * (BX - 0.2), LIP.y + 0.02, LIP.z - 0.05 - Math.random() * 0.35)
      drops.add(d)
    }
    pigeons.add(drops)
    pigeons.userData = { birds: [b1, b2], drops, home: [b1.position.clone(), b2.position.clone()] }
    turn.add(pigeons)
  }
  const hornHit = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.2, 2.2), ghost)
  hornHit.position.set(-0.2, AX_Y, 0.1)
  turn.add(hornHit)
  const pigeonHit = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 8), ghost)
  pigeonHit.position.set(X1 + BX / 2, LIP.y + 0.15, LIP.z + 0.15)
  turn.add(pigeonHit)
  const tableHit = new THREE.Mesh(new THREE.CylinderGeometry(HOLM.r + 0.2, HOLM.r + 0.2, 0.5, 32), ghost)
  tableHit.position.set(HOLM.x, 0.2, HOLM.z)
  root.add(tableHit)
  // a lamp over the terrace, so the horn reads at night
  {
    const lamp = new THREE.PointLight('#ffe7c4', 5, 18, 1.2)
    lamp.position.set(-1.2, 5.2, -22.8)
    root.add(lamp)
  }

  // the receiver's desk: a needle meter and a chart recorder, one screen
  const meter = screen(1.2, 0.68, 1024)
  {
    const deskG = new THREE.Group()
    deskG.position.set(DESK.x, 0, DESK.z)
    deskG.rotation.y = DESK.rot
    root.add(deskG)
    const desk = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.08, 0.7, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.7 }))
    desk.position.y = 0.78
    deskG.add(desk)
    for (const dx of [-0.6, 0.6]) {
      for (const dz of [-0.28, 0.28]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.76, 0.05), darkMetal)
        leg.position.set(dx, 0.38, dz)
        deskG.add(leg)
      }
    }
    meter.group.position.set(0, 1.2, -0.12)
    meter.group.rotation.x = -0.35
    deskG.add(meter.group)
    solids.push(box(DESK.x, DESK.z, 1.4, 0.75, { rot: DESK.rot, y1: 1.0 }))
  }
  // the board: the light stretched
  const board = screen(BOARD.w, BOARD.h, 1024)
  {
    const boardG = new THREE.Group()
    boardG.position.set(BOARD.x, 0, BOARD.z)
    boardG.rotation.y = BOARD.rot
    root.add(boardG)
    board.group.position.y = 1.45
    boardG.add(board.group)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.45 - BOARD.h / 2, 10), darkMetal)
    pole.position.set(0, (1.45 - BOARD.h / 2) / 2, -0.06)
    boardG.add(pole)
    solids.push(circle(BOARD.x, BOARD.z, 0.3, { y1: 1.0 }))
  }
  let azNow = 0
  let hiss = 0 // the needle's swing, a moment after a hiss
  let chart = [] // the chart recorder's trace
  let chartT = 0
  let waveT = -1 // seconds into the stretch (-1: never stretched; 99: shown stretched)
  const WAVE_T = 6
  const hornPanel = lv => ({
    title: E.horn.title,
    color: '#ff9e4a',
    blocks: [
      {
        slider: {
          label: E.horn.slider,
          min: 0,
          max: 355,
          step: 5,
          value: Hn.az,
          onInput: v => setAz(v),
          format: v => fill(E.horn.deg, { d: Math.round(Number(v)) }),
          live: () => Hn.az,
        },
      },
      {
        buttons: [
          { label: E.horn.buttons.listen, onClick: () => hornStep('horn') },
          { label: E.horn.buttons.turn, onClick: () => hornStep('table') },
          { label: E.horn.buttons.shoo, onClick: () => hornStep('pigeons') },
          { label: E.horn.buttons.stretch, onClick: () => hornStep('wave') },
        ],
      },
      ...paras(E.horn.panel, lv),
    ],
  })
  const hornChanged = (delay = 2.6) => {
    hornMine = true
    ex.discover('horn', hornPanel, delay)
    share('horn')
  }
  /** A visitor's step at the horn: 'horn' (listen), 'table' (turn it 45 degrees), 'pigeons', 'wave'. */
  function hornStep(what) {
    const lv = level()
    const S = E.horn.says
    if (what === 'horn') {
      const first = !Hn.on
      Hn.on = 1
      hiss = 1
      play('fizz', { order: 0.6 })
      say(at(first ? S.on : Hn.p ? S.still : S.again, lv))
    } else if (what === 'table') {
      Hn.az = (Hn.az + 45) % 360
      play('select')
      if (Hn.on) {
        hiss = 1
        later(1.2, () => play('fizz', { order: 0.5 }))
      }
      say(at(Hn.on ? S.turn : S.turnOff, lv))
    } else if (what === 'pigeons') {
      if (Hn.p) return say(at(S.gone, lv))
      Hn.p = 1
      pigeonFly = { t: 0 }
      play('pop')
      say(at(S.pigeons, lv))
      later(3.2, () => {
        if (!Hn.on) return
        hiss = 1
        play('fizz', { order: 0.5 })
        say(at(S.still, level()))
      })
    } else if (what === 'wave') {
      if (waveT >= 0 && waveT < WAVE_T) return say(at(W.busy, lv))
      Hn.w++
      waveT = 0
      play('beam')
      say(at(S.wave, lv))
      return hornChanged(WAVE_T + 0.6)
    } else return
    hornChanged()
  }
  function setAz(v, now = false) {
    const a = ((Math.round(Number(v) / 5) * 5) % 360 + 360) % 360
    if (a === Hn.az) return
    Hn.az = a
    hornMine = true
    if (Hn.on && Math.random() < 0.15) play('fizz', { order: 0.35 })
    if (Hn.on) hiss = Math.max(hiss, 0.6)
    ex.discover('horn', hornPanel, 2.6)
    if (now) share('horn')
    else sendSoon('horn')
  }
  clickable(pigeonHit, () => hornStep('pigeons'), { reach: 9, when: () => !Hn.p })
  clickable(hornHit, () => hornStep('horn'), { reach: 9 })
  clickable(tableHit, () => hornStep('table'), { reach: 9 })
  clickable(board.face, () => hornStep('wave'), { reach: 7 })
  clickable(meter.face, () => hornStep('horn'), { reach: 6 })
  ex.add({
    id: 'horn',
    x: 0,
    z: -21.9,
    radius: 3.0,
    manual: true,
    label: E.horn.label,
    verb: () => {
      const h = E.horn.hints
      if (!Hn.on) return h.listen
      if (Hn.az === 0) return h.turn
      if (!Hn.p) return h.pigeons
      if (!Hn.w) return h.wave
      return h.again
    },
    focus: focusOf(0.1, 1.55, -26.0, 3.4, 4.8),
    act: () => ctx.showPanel(hornPanel),
  })
  const meterLevel = () => (Hn.on ? (Hn.p ? 3.5 : 3.7) : 0)
  function drawMeter(dt) {
    const { g, w, h } = meter
    const M = E.horn.meter
    chartT += dt
    if (chartT > 0.08) {
      chartT = 0
      chart.push(meterLevel() + (Hn.on ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.12))
      if (chart.length > 120) chart.shift()
    } else return
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillStyle = '#ffd9a8'
    fitText(g, M.title, 30, 40, 34, 700, w - 60)
    // the needle meter: 0 to 6 K
    const cx = 230
    const cy = 400
    const rr = 170
    g.strokeStyle = '#cfe0ff'
    g.lineWidth = 4
    g.beginPath()
    g.arc(cx, cy, rr, Math.PI * 1.15, Math.PI * 1.85)
    g.stroke()
    g.fillStyle = '#cfe0ff'
    g.textAlign = 'center'
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI * 1.15 + (k / 6) * Math.PI * 0.7
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
      g.lineTo(cx + Math.cos(a) * (rr - 18), cy + Math.sin(a) * (rr - 18))
      g.stroke()
      fitText(g, String(k), cx + Math.cos(a) * (rr - 42), cy + Math.sin(a) * (rr - 42), 24, 700, 40)
    }
    const v = clamp((chart[chart.length - 1] ?? 0) / 6)
    const a = Math.PI * 1.15 + v * Math.PI * 0.7
    g.strokeStyle = '#ff8a5c'
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(cx, cy)
    g.lineTo(cx + Math.cos(a) * (rr - 10), cy + Math.sin(a) * (rr - 10))
    g.stroke()
    dotAt(g, cx, cy, 10, '#ff8a5c')
    g.fillStyle = '#9fb3e6'
    fitText(g, M.unit, cx, cy + 50, 26, 600, 340, 'Nunito')
    // the chart: paper scrolling under a pen
    const px = 450
    const pw = w - px - 30
    const py = 80
    const ph = h - py - 30
    g.fillStyle = '#efe9d8'
    g.fillRect(px, py, pw, ph)
    g.strokeStyle = 'rgba(120,140,170,0.35)'
    g.lineWidth = 1
    for (let k = 0; k <= 6; k++) {
      const y = py + ph - (k / 6) * ph
      g.beginPath()
      g.moveTo(px, y)
      g.lineTo(px + pw, y)
      g.stroke()
    }
    g.strokeStyle = '#c0392b'
    g.lineWidth = 3
    g.beginPath()
    chart.forEach((c, k) => {
      const x = px + (k / 119) * pw
      const y = py + ph - clamp(c / 6) * ph
      if (k === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    })
    g.stroke()
    g.fillStyle = '#5a5a6a'
    g.textAlign = 'left'
    fitText(g, Hn.on ? M.on : M.off, px + 12, py + 24, 24, 700, pw - 24, 'Nunito')
    meter.tex.needsUpdate = true
  }
  let boardKey = ''
  function drawBoard() {
    const lv = level()
    const k = waveT < 0 ? 0 : clamp(waveT / WAVE_T)
    const key = [Math.round(k * 200), lv, waveT < 0, k >= 1].join()
    if (key === boardKey) return
    boardKey = key
    const { g, w, h } = board
    const B = E.horn.board
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#ffd9a8'
    fitText(g, B.title, w / 2, 48, 44, 700, w - 60)
    // the wave: its wavelength on the board grows as the logarithm of the stretch (1 to 1100)
    const stretch = 1100 ** k
    const lam = 26 * (1 + k * 13)
    const c = new THREE.Color('#ffa24a').lerp(new THREE.Color('#d0392b'), span(0, 0.35, k)).lerp(new THREE.Color('#6a2a3a'), span(0.35, 0.7, k)).lerp(new THREE.Color('#7f8fd0'), span(0.7, 1, k))
    g.strokeStyle = `#${c.getHexString(THREE.SRGBColorSpace)}`
    g.lineWidth = 7
    g.shadowColor = g.strokeStyle
    g.shadowBlur = 12
    g.beginPath()
    for (let x = 40; x <= w - 40; x += 2) {
      const y = 200 + Math.sin(((x - 40) / lam) * TAU) * 52
      if (x === 40) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
    g.shadowBlur = 0
    g.fillStyle = '#ffffff'
    fitText(g, `× ${nf(Math.round(stretch))}`, w / 2, 315, 54, 700, 400)
    const T = 2970 / stretch
    g.fillStyle = '#ffd9a8'
    const temp = T >= 10 ? nf(Number(T.toPrecision(2))) : nf(Math.round(T * 10) / 10, { maximumFractionDigits: 1 })
    fitText(g, `${temp} K`, w / 2, 378, 36, 700, 300)
    g.textAlign = 'left'
    g.fillStyle = k < 0.02 ? '#ffd9a8' : '#9fb3e6'
    fitText(g, B.from, 40, 448, 28, 700, w / 2 - 60, 'Nunito')
    g.textAlign = 'right'
    g.fillStyle = k > 0.98 ? '#cfe0ff' : '#6f7fa8'
    fitText(g, B.to, w - 40, 448, 28, 700, w / 2 - 60, 'Nunito')
    g.textAlign = 'center'
    g.fillStyle = '#9fb3e6'
    fitText(g, waveT < 0 ? at(B.tap, lv) : at(B.after, lv), w / 2, 510, 26, 600, w - 80, 'Nunito')
    board.tex.needsUpdate = true
  }
  updates.push((dt, t) => {
    azNow = damp(azNow, Hn.az, 2.5, dt)
    // the shortest way round
    if (Math.abs(Hn.az - azNow) > 180) azNow += Hn.az > azNow ? 360 : -360
    turn.rotation.y = (-azNow * Math.PI) / 180
    hiss = Math.max(0, hiss - dt * 0.6)
    // the pigeons: off they go, flapping up and away; the droppings cleaned off
    const { birds, drops, home } = pigeons.userData
    if (pigeonFly) {
      pigeonFly.t += dt
      const u = pigeonFly.t
      birds.forEach((b, k) => {
        b.position.copy(home[k]).add(V3(u * (1.2 + k * 0.5), u * u * 0.9 + u * 0.6, u * 1.6))
        for (const { wing, s } of b.userData.wings) wing.rotation.x = s * Math.sin(t * 26 + k) * 0.9
      })
      drops.visible = u < 1.5
      if (u > 3) {
        pigeonFly = null
        pigeons.visible = false
      }
    } else if (Hn.p) pigeons.visible = false
    else {
      pigeons.visible = true
      drops.visible = true
      birds.forEach((b, k) => {
        b.position.copy(home[k])
        b.rotation.z = Math.sin(t * 1.7 + k * 2) * 0.05
        for (const { wing } of b.userData.wings) wing.rotation.x = 0
      })
    }
    if (waveT >= 0 && waveT < WAVE_T) waveT = Math.min(WAVE_T, waveT + dt)
    drawMeter(dt)
    drawBoard()
  })
  const hornSet = (s, liveSet) => {
    const az = ((Math.round(Number(s?.az) / 5) * 5) % 360 + 360) % 360 || 0
    const on = s?.on ? 1 : 0
    const p = s?.p ? 1 : 0
    const w = Math.max(0, Number(s?.w) | 0)
    if (liveSet) {
      if (on && (!Hn.on || az !== Hn.az)) {
        hiss = 1
        play('fizz', { order: 0.4 })
      }
      if (p && !Hn.p) pigeonFly = { t: 0 }
      if (w > Hn.w) waveT = 0
    } else {
      azNow = az
      pigeonFly = null
      waveT = w > 0 ? WAVE_T : -1
    }
    Object.assign(Hn, { on, az, p, w })
    hornMine = false
  }

  // ======== signs along the walk: 3 minutes, 380,000 years, today ========
  {
    const post = (x, z, text, rot) => {
      const g = new THREE.Group()
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 2.0, 10), darkMetal)
      pole.position.y = 1.0
      const plate = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.36, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#141a38', emissive: '#141a38', emissiveIntensity: 0.4, roughness: 0.5 }))
      plate.position.set(0, 2.05, 0)
      const label = sign(text, 0.17, { color: '#ffd9a8', maxWidth: 1.4 })
      label.position.set(0, 2.05, 0.04)
      const back = sign(text, 0.17, { color: '#ffd9a8', maxWidth: 1.4 })
      back.position.set(0, 2.05, -0.04)
      back.rotation.y = Math.PI
      g.add(pole, plate, label, back)
      g.position.set(x, 0, z)
      g.rotation.y = rot
      root.add(g)
      solids.push(circle(x, z, 0.12, { y1: 1.0 }))
    }
    post(-4.4, 9.55, E.signs.start, 0)
    post(2.25, -0.55, E.signs.cool, 0)
    post(2.6, -16.3, E.signs.today, 0)
    post(-2.75, -26.9, E.horn.plaque, 0.3)
  }

  updates.push((dt, t) => stage.update(t, ctx.camera))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 14.6 },
    cameraClear: stage.cameraClear,
    spawn: { x: 0, z: 12.6, yaw: 0 },
    hostSpot: { x: -1.05, z: 11.2, yaw: Math.atan2(1.05, -1.4) },
    back: { x: 0, z: 15.2, rot: Math.PI },
    stand: { x: 1.4, z: 10.4, rot: Math.atan2(-1.4, 2.2) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      cooling: {
        tap: (what = 'proton', arg) => coolStep(what, arg), // 'proton' (i, or the nearest free), 'knob', 'rail' (s), 'back'
        set: s => setS(s, true), // the panel's slider (0..1)
        get state() {
          return { s: C.s, m: C.m, caught: caughtCount(), T: Math.round(TNow()), fog: Math.round(fogNow * 100) / 100, he: helium.held.length }
        },
        protonAt: i => protons[i].pos.clone(),
        knobAt: () => knob.position.clone(),
        railAt: s => V3(RAIL.x, RAIL.y, railZ(s)),
        sCatch: S_CATCH,
      },
      recipe: {
        tap: (what, k) => recipeStep(what, k), // 'neutron' (k), 'deuteron', 'balance', 'tray', 'reset'
        set: c => setClock(c, true), // the clock (minutes)
        get state() {
          return { ...R, n: [...R.n] }
        },
        neutronAt: k => balls[N_IDX[k]].pos.clone().add(tray.position),
        balanceAt: () => V3(BAL.x, BAL.y, BAL.z),
        trayAt: () => V3(TRAY.x + TRAY.r * 0.8, TRAY.top, TRAY.z),
      },
      horn: {
        tap: what => hornStep(what), // 'horn', 'table', 'pigeons', 'wave'
        set: az => setAz(az, true), // where it points (degrees)
        get state() {
          return { ...Hn }
        },
        hornAt: () => V3(HOLM.x - 0.6, AX_Y, HOLM.z),
        pigeonsAt: () => pigeonHit.getWorldPosition(new THREE.Vector3()),
        boardAt: () => V3(BOARD.x, 1.45, BOARD.z),
        tableAt: () => V3(HOLM.x + HOLM.r * 0.7, 0.15, HOLM.z + HOLM.r * 0.7),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { recipe: recipePanel, cooling: coolPanel, horn: hornPanel },
    shared: {
      recipe: { get: () => ({ c: R.c, n: [...R.n], w: R.w }), set: recipeSet },
      cooling: { get: () => ({ s: C.s, m: C.m }), set: coolSet },
      horn: { get: () => ({ ...Hn }), set: hornSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
