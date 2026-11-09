// Silver's picture "What is behind a mirror?" as a room (docs/knowledge/picture-rooms.md): inside the dome of
// the 100-inch Hooker telescope on Mount Wilson, a night in the 1920s (the dome stage). The great mirror is
// out of the telescope for its new coat. Three stations, each worked by touching its things; E opens the
// station's panel, whose sliders and buttons do the same:
// - silvering the mirror: tap the acid jar (the old, tarnished coat washes off, bare glass), the reducer jar
//   and the silver jar (silver nitrate in ammonia: both are needed, in either order) and a film of silver
//   grows over the glass while swabs keep the liquids moving (a minutes slider; a reflectance meter climbs
//   to 95%); tap the little dish and all the silver of one coat is gathered into a cube about 1 cm across;
// - which metal shines best: a bench of five mirrors (speculum metal, tin and mercury, aluminium, silver,
//   gold) and a reflectometer on a rail: tap a mirror and the lamp's beam bounces off it into the meter; a
//   slider for the colour of the light (violet to red, with ultraviolet and infrared at Scientist level);
//   tap the jar of foul air and the silver tarnishes;
// - find another galaxy (Hubble, 1923): tap the telescope (the dome turns, the slit finds Andromeda, a
//   45-minute exposure builds on a glass plate), tap the plate (it goes on the light box beside an older
//   one), tap the three spots marked N: two are novae, one is a variable star (N crossed out, VAR! written
//   in red), its light curve draws itself over 31.4 days, and a period slider turns its pulse into its
//   true brightness and its distance (1925's numbers or today's).
// All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, num, screen, standingScreen, random } from '../../../wings/noble/kit.js'
import { domeStage, domeTelescope, silverCap } from '../../stages/dome.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { MIRROR_WORDS } from './mirror.words.js'

export const WORDS = MIRROR_WORDS

const TAU = Math.PI * 2
const SILVER = '#c3cad6'

/** A number in groups of three digits and the language's decimal mark. */
const grp = (v, digits, lang) => {
  const [i, f] = Math.abs(v).toFixed(digits).split('.')
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ')
  return (v < 0 ? '−' : '') + g + (f ? (lang === 'en' ? '.' : ',') + f : '')
}
/** A value rounded to two significant figures. */
const sig2 = v => {
  if (v <= 0) return 0
  const p = 10 ** (Math.floor(Math.log10(v)) - 1)
  return Math.round(v / p) * p
}

// ---- silvering: the film ----
const AREA = Math.PI * 1.27 * 1.27 // m2, the 100-inch (2.54 m) disc
const FILM_MAX = 254 // nm, Porter: about 1/100 000 inch
const MINUTES = 5
const filmNm = m => (FILM_MAX * (1 - Math.exp(-m / 1.4))) / (1 - Math.exp(-MINUTES / 1.4))
/** A film's reflectance: glass 4%, rising to silver's 95% (an illustrative curve: light stops passing at about 100 nm). */
const filmR = nm => 0.04 + 0.91 * (1 - Math.exp(-nm / 30))
const cubeCm = nm => Math.cbrt(AREA * 1e4 * nm * 1e-7) // cm: area (cm2) times thickness (cm)
const cubeG = nm => AREA * 1e4 * nm * 1e-7 * 10.501

// ---- the metals: reflectance at normal incidence by wavelength (nm), smooth approximations of coating
// makers' published curves (about plus or minus 3 points, speculum and the amalgam only roughly) ----
const CURVES = {
  speculum: [[250, 0.4], [300, 0.46], [400, 0.55], [500, 0.6], [600, 0.64], [700, 0.67], [800, 0.69], [1000, 0.72], [1100, 0.74]],
  amalgam: [[250, 0.5], [300, 0.57], [400, 0.65], [500, 0.69], [600, 0.7], [700, 0.71], [800, 0.72], [1000, 0.74], [1100, 0.74]],
  aluminium: [[250, 0.91], [300, 0.92], [400, 0.925], [500, 0.915], [600, 0.91], [700, 0.895], [750, 0.88], [800, 0.86], [850, 0.86], [900, 0.89], [1000, 0.94], [1100, 0.95]],
  silver: [[250, 0.25], [280, 0.2], [300, 0.15], [310, 0.08], [316, 0.04], [325, 0.1], [335, 0.3], [350, 0.6], [370, 0.8], [400, 0.9], [450, 0.95], [500, 0.97], [600, 0.98], [700, 0.985], [800, 0.985], [1000, 0.99], [1100, 0.99]],
  gold: [[250, 0.3], [300, 0.31], [350, 0.33], [400, 0.38], [450, 0.38], [480, 0.42], [500, 0.47], [520, 0.56], [540, 0.74], [560, 0.84], [600, 0.92], [650, 0.95], [700, 0.97], [800, 0.98], [1000, 0.98], [1100, 0.98]],
}
const METALS = ['speculum', 'amalgam', 'aluminium', 'silver', 'gold']
const METAL_COLOR = { speculum: '#d6b99a', amalgam: '#aeb7c4', aluminium: '#d3d8e0', silver: '#f2f3f7', gold: '#f0b83a' }
const CHART_COLOR = { speculum: '#e0a070', amalgam: '#8fb0d8', aluminium: '#7fe0e8', silver: '#f4f6fa', gold: '#ffc93a' }
const sample = (pts, nm) => {
  if (nm <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (nm <= pts[i][0]) {
      const [a, ra] = pts[i - 1]
      const [b, rb] = pts[i]
      const t = (nm - a) / (b - a)
      return ra + (rb - ra) * t * t * (3 - 2 * t)
    }
  }
  return pts[pts.length - 1][1]
}
/** What a metal sends back at a wavelength; silver's falls as it tarnishes (more in the blue). */
const reflectance = (metal, nm, tarn = 0) => {
  const r = sample(CURVES[metal], nm)
  if (metal !== 'silver' || tarn <= 0) return r
  const blue = clamp((650 - nm) / 250)
  return r * (1 - tarn * (0.55 + 0.25 * blue))
}
/** Light's colour from its wavelength (a standard approximation), dim into the ultraviolet and infrared. */
const wlColor = nm => {
  let r = 0
  let g = 0
  let b = 0
  if (nm < 440) { r = clamp((440 - nm) / 60); b = 1 } else if (nm < 490) { g = (nm - 440) / 50; b = 1 } else if (nm < 510) { g = 1; b = (510 - nm) / 20 } else if (nm < 580) { r = (nm - 510) / 70; g = 1 } else if (nm < 645) { r = 1; g = (645 - nm) / 65 } else r = 1
  const f = nm < 420 ? clamp(0.3 + (0.7 * (nm - 380)) / 40, 0.3, 1) : nm > 700 ? clamp(0.3 + (0.7 * (780 - nm)) / 80, 0.3, 1) : 1
  return new THREE.Color(r * f, g * f, b * f)
}
const visible = nm => nm >= 380 && nm <= 780

// ---- the galaxy hunt ----
const ANDROMEDA_AZ = 0.95
const TARGET_ALT = 1.0
const SPOTS = [
  { x: 0.3, y: 0.3, nova: true, b: 0.42 },
  { x: 0.7, y: 0.62, nova: true, b: 0.36 },
  { x: 0.56, y: 0.2, nova: false, b: 0.32 }, // the variable star, on the older plate too, but fainter
]
const EXPO_MAX = 45 // minutes (plate H335H)
const PERIOD = 31.4
const M_APP = 19.16 // the star's apparent brightness: a round number chosen so both published distances come out
const cepheidM = (p, old) => -2.43 * (Math.log10(p) - 1) - 4.05 + (old ? 2.15 : 0)
const lumSuns = M => 10 ** (0.4 * (4.83 - M))
const distLy = M => 10 ** ((M_APP - M + 5) / 5) * 3.2616

/** An invisible box the tap ray still hits (thin things need one). */
const hitBox = (w, h, d, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  return m
}
/** A thin beam between two points (a unit cylinder stretched). */
const beamGeo = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true)
const setBeam = (m, a, b, r = 0.006) => {
  const d = new THREE.Vector3().subVectors(b, a)
  const len = Math.max(0.001, d.length())
  m.position.copy(a).addScaledVector(d, 0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
  m.scale.set(r, len, r)
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, lang, color, clickable }) {
  const stage = domeStage({ light, andromeda: { az: ANDROMEDA_AZ, alt: TARGET_ALT } })
  root.add(stage.group)
  const tel = domeTelescope({ mats: stage.mats, light })
  root.add(tel.group)
  const solids = [...stage.solids, ...tel.solids]
  const mats = stage.mats
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const tex = t => (textures.push(t), t)
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = list => list.map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const pending = {}
  const shareSoon = id => {
    if (pending[id]) return
    pending[id] = true
    later(0.15, () => {
      pending[id] = false
      share(id)
    })
  }
  const settleTimers = {}
  const settleSay = (id, fn) => {
    settleTimers[id] = { t: 0.9, fn }
  }
  const stationGroup = (x, z, rot) => {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.rotation.y = rot
    root.add(g)
    return g
  }
  /** A station's solid, from its local frame (x right, z toward the visitor). */
  const solidAt = (g, lx, lz, w, d, y1 = 50) => {
    const p = g.localToWorld(new THREE.Vector3(lx, 0, lz))
    solids.push(box(p.x, p.z, w, d, { rot: g.rotation.y, y1 }))
  }
  const worldAt = (g, x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))
  const small = (text, o = {}) => makeText(text, { font: 'body', size: 0.05, color: '#e8e0d0', maxWidth: 0.4, anchorY: 'middle', ...o })
  const bench = (g, cx, cz, w, d, h = 0.9) => {
    const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.07, d, 2, 0.015), mats.wood)
    top.position.set(cx, h - 0.035, cz)
    g.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.07, 0.08), mats.iron)
        leg.position.set(cx + sx * (w / 2 - 0.1), (h - 0.07) / 2, cz + sz * (d / 2 - 0.1))
        g.add(leg)
      }
    }
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, 0.03, d - 0.2), mats.wood)
    shelf.position.set(cx, 0.25, cz)
    g.add(shelf)
  }

  // =================================================================================================
  // Station 1: silvering the mirror
  // =================================================================================================
  const S1 = stationGroup(-4.6, -0.3, 0.35)
  const DISC = { x: -1.5, y: 0.95, z: 0, tilt: -0.96, r: 1.27, t: 0.33 }
  const discG = new THREE.Group()
  discG.position.set(DISC.x, DISC.y, DISC.z)
  discG.rotation.x = DISC.tilt
  S1.add(discG)
  const glassEdge = new THREE.Mesh(
    new THREE.CylinderGeometry(DISC.r, DISC.r, DISC.t, 64).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#6c8f86', roughness: 0.25, metalness: 0.1 }),
  )
  discG.add(glassEdge)
  const FACE = light ? 384 : 512
  const faceTex = tex(canvasTex(FACE, FACE, null, { mipmaps: false }))
  const faceMat = new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false })
  const face = new THREE.Mesh(new THREE.CircleGeometry(DISC.r - 0.005, 64), faceMat)
  face.position.z = DISC.t / 2 + 0.004
  discG.add(face)
  // the cradle: a steel ring round the glass at the lower rim, trunnions and two uprights, a plinth
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(DISC.r + 0.04, 0.045, 8, 64, Math.PI * 1.1), mats.steel)
    ring.rotation.z = Math.PI * 1.45
    discG.add(ring)
    for (const s of [-1, 1]) {
      const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.34, 10), mats.steel)
      stub.rotation.z = Math.PI / 2
      stub.position.x = s * (DISC.r + 0.16)
      discG.add(stub)
      const up = new THREE.Mesh(new RoundedBoxGeometry(0.16, DISC.y + 0.1, 0.5, 2, 0.03), mats.iron)
      up.position.set(DISC.x + s * (DISC.r + 0.3), (DISC.y + 0.1) / 2, DISC.z)
      S1.add(up)
      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.1, 1.5, 2, 0.03), mats.iron)
      foot.position.set(DISC.x + s * (DISC.r + 0.3), 0.05, DISC.z)
      S1.add(foot)
    }
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(2 * DISC.r + 1.0, 0.1, 1.9, 2, 0.03), mats.wood)
    plinth.position.set(DISC.x, 0.05, DISC.z + 0.1)
    S1.add(plinth)
  }
  discG.add(hitBox(2 * DISC.r, 2 * DISC.r, 0.5, 0, 0, 0.2))
  solidAt(S1, DISC.x, DISC.z + 0.1, 2.9, 2.0, 1.1)

  // the old coat (dull, patchy, brownish-violet) and the dome as a mirror sees it
  const tarnishCv = document.createElement('canvas')
  tarnishCv.width = tarnishCv.height = FACE
  {
    const g = tarnishCv.getContext('2d')
    const rnd = random(77)
    g.fillStyle = '#4b4136'
    g.fillRect(0, 0, FACE, FACE)
    for (let i = 0; i < 900; i++) {
      const hue = rnd()
      g.fillStyle = hue < 0.4 ? `rgba(98,76,96,${0.1 + rnd() * 0.25})` : hue < 0.75 ? `rgba(120,96,64,${0.1 + rnd() * 0.25})` : `rgba(40,34,36,${0.1 + rnd() * 0.3})`
      g.beginPath()
      g.arc(rnd() * FACE, rnd() * FACE, 6 + rnd() * 34, 0, TAU)
      g.fill()
    }
    g.fillStyle = 'rgba(200,190,170,0.35)'
    for (let i = 0; i < 160; i++) g.fillRect(rnd() * FACE, rnd() * FACE, 1 + rnd() * 3, 1 + rnd() * 3)
  }
  const reflCv = document.createElement('canvas')
  reflCv.width = reflCv.height = FACE
  {
    const g = reflCv.getContext('2d')
    const R = FACE / 2
    const bg = g.createRadialGradient(R, R, 0, R, R, R)
    bg.addColorStop(0, '#d2d8e2')
    bg.addColorStop(0.7, '#98a0ae')
    bg.addColorStop(1, '#5c6370')
    g.fillStyle = bg
    g.fillRect(0, 0, FACE, FACE)
    // the ribs, rings and lamps of the dome overhead
    g.strokeStyle = 'rgba(40,44,54,0.45)'
    g.lineWidth = 3
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * TAU
      g.beginPath()
      g.moveTo(R, R)
      g.lineTo(R + Math.cos(a) * R, R + Math.sin(a) * R)
      g.stroke()
    }
    for (const k of [0.3, 0.55, 0.8]) {
      g.beginPath()
      g.arc(R, R, R * k, 0, TAU)
      g.stroke()
    }
    // the slit: a wedge of night sky with stars and the galaxy
    g.save()
    g.beginPath()
    g.moveTo(R, R)
    g.arc(R, R, R, -Math.PI / 2 - 0.2, -Math.PI / 2 + 0.2)
    g.closePath()
    g.clip()
    const sk = g.createLinearGradient(0, R, 0, 0)
    sk.addColorStop(0, '#22346e')
    sk.addColorStop(1, '#3a5cb0')
    g.fillStyle = sk
    g.fillRect(0, 0, FACE, FACE)
    const rnd = random(5)
    g.fillStyle = '#ffffff'
    for (let i = 0; i < 90; i++) g.fillRect(R - 90 + rnd() * 180, rnd() * R, 1 + rnd() * 2, 1 + rnd() * 2)
    g.translate(R + 10, R * 0.48)
    g.rotate(0.5)
    g.scale(1, 0.32)
    const ga = g.createRadialGradient(0, 0, 0, 0, 0, 70)
    ga.addColorStop(0, 'rgba(255,244,225,1)')
    ga.addColorStop(0.3, 'rgba(230,226,240,0.7)')
    ga.addColorStop(1, 'rgba(160,170,230,0)')
    g.fillStyle = ga
    g.fillRect(-80, -80, 160, 160)
    g.restore()
    // the lamps on the wall
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * TAU
      const gl = g.createRadialGradient(R + Math.cos(a) * R * 0.86, R + Math.sin(a) * R * 0.86, 0, R + Math.cos(a) * R * 0.86, R + Math.sin(a) * R * 0.86, 26)
      gl.addColorStop(0, 'rgba(255,220,160,1)')
      gl.addColorStop(1, 'rgba(255,200,120,0)')
      g.fillStyle = gl
      g.fillRect(R + Math.cos(a) * R * 0.86 - 26, R + Math.sin(a) * R * 0.86 - 26, 52, 52)
    }
  }
  const filmCv = document.createElement('canvas')
  filmCv.width = filmCv.height = FACE
  const smooth01 = v => {
    const t = clamp(v)
    return t * t * (3 - 2 * t)
  }
  /** Draws the disc's face: bare glass, the old coat, a wet sheen, the new film growing from the middle. */
  const drawFace = (oldK, fK, wet) => {
    faceTex.userData.redraw(g => {
      const R = FACE / 2
      g.save()
      g.beginPath()
      g.arc(R, R, R, 0, TAU)
      g.clip()
      const bg = g.createRadialGradient(R * 0.7, R * 0.5, 0, R, R, R)
      bg.addColorStop(0, '#2f5a56')
      bg.addColorStop(1, '#122a2a')
      g.fillStyle = bg
      g.fillRect(0, 0, FACE, FACE)
      if (oldK > 0.01) {
        g.globalAlpha = oldK
        g.drawImage(tarnishCv, 0, 0)
        g.globalAlpha = 1
      }
      if (fK > 0.005) {
        const f = filmCv.getContext('2d')
        f.clearRect(0, 0, FACE, FACE)
        // brown when thin (light passes), silver when thick, the dome in it as the film thickens
        const k = smooth01(fK * 1.6)
        const cr = Math.round(lerp(150, 200, k))
        const cg = Math.round(lerp(106, 206, k))
        const cb = Math.round(lerp(64, 214, k))
        f.fillStyle = `rgba(${cr},${cg},${cb},${0.2 + 0.75 * smooth01(fK * 2)})`
        f.fillRect(0, 0, FACE, FACE)
        f.globalAlpha = smooth01((fK - 0.25) / 0.75)
        f.drawImage(reflCv, 0, 0)
        f.globalAlpha = 1
        // growing out from the middle, softly
        const cov = clamp(fK * 2.2)
        f.globalCompositeOperation = 'destination-in'
        const m = f.createRadialGradient(R, R, 0, R, R, R * (0.05 + 1.1 * cov))
        m.addColorStop(0, 'rgba(0,0,0,1)')
        m.addColorStop(Math.max(0.01, 0.78), 'rgba(0,0,0,1)')
        m.addColorStop(1, 'rgba(0,0,0,0)')
        f.fillStyle = m
        f.fillRect(0, 0, FACE, FACE)
        f.globalCompositeOperation = 'source-over'
        g.drawImage(filmCv, 0, 0)
      }
      if (wet > 0.01) {
        g.fillStyle = `rgba(200,236,226,${0.13 * wet})`
        g.fillRect(0, 0, FACE, FACE)
        g.fillStyle = `rgba(255,255,255,${0.2 * wet})`
        g.beginPath()
        g.ellipse(R * 0.62, R * 0.45, R * 0.28, R * 0.06, -0.5, 0, TAU)
        g.fill()
      }
      g.restore()
      g.strokeStyle = 'rgba(20,30,30,0.9)'
      g.lineWidth = 6
      g.beginPath()
      g.arc(R, R, R - 3, 0, TAU)
      g.stroke()
    })
  }

  // the bench: three jars, the little dish; the swabs on the disc
  bench(S1, 1.45, 0.5, 2.1, 0.8)
  solidAt(S1, 1.45, 0.5, 2.2, 0.9, 1.0)
  const JARS = {
    acid: { x: 0.85, liquid: '#d9e47a', name: () => E.silver.jars.acid },
    reducer: { x: 1.35, liquid: '#e6b7c9', name: () => E.silver.jars.reducer },
    silver: { x: 1.85, liquid: '#e8eef2', name: () => E.silver.jars.silver },
  }
  const jarY = 0.9
  const jarPos = id => new THREE.Vector3(JARS[id].x, jarY, 0.55)
  for (const [id, j] of Object.entries(JARS)) {
    const g = new THREE.Group()
    g.position.copy(jarPos(id))
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 20), new THREE.MeshStandardMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.3, roughness: 0.08, depthWrite: false }))
    body.position.y = 0.17
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.24, 20), new THREE.MeshStandardMaterial({ color: j.liquid, roughness: 0.2, emissive: j.liquid, emissiveIntensity: 0.22 }))
    liquid.position.y = 0.13
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.07, 16), new THREE.MeshStandardMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.4, roughness: 0.1, depthWrite: false }))
    neck.position.y = 0.375
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, 0.07, 14), new THREE.MeshStandardMaterial({ color: '#9a7448', roughness: 0.9 }))
    cork.position.y = 0.44
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.12), mats.paper)
    label.position.set(0, 0.17, 0.133)
    const longest = Math.max(...j.name().split(' ').map(w => w.length))
    const text = makeText(j.name(), { font: 'body', size: Math.min(0.032, 0.21 / (longest * 0.56)), color: '#2a2018', maxWidth: 0.22, anchorY: 'middle' })
    text.position.set(0, 0.17, 0.136)
    g.add(body, liquid, neck, cork, label, text)
    g.add(hitBox(0.3, 0.55, 0.3, 0, 0.25, 0))
    S1.add(g)
    j.group = g
  }
  // the dish with its silver cube and a sugar cube beside it (both drawn 8 times too big)
  const DISH = new THREE.Group()
  DISH.position.set(2.3, 0.9, 0.7)
  S1.add(DISH)
  const dishMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.05, 28), new THREE.MeshStandardMaterial({ color: '#e2ddd0', roughness: 0.4 }))
  dishMesh.position.y = 0.025
  DISH.add(dishMesh)
  DISH.add(hitBox(0.5, 0.3, 0.5, 0, 0.12, 0))
  const cubeMat = new THREE.MeshMatcapMaterial({ matcap: silverCap(), color: '#f2f3f6' })
  const silverCube = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.06), cubeMat)
  const sugarCube = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.08), new THREE.MeshStandardMaterial({ color: '#f0ece2', roughness: 0.95 }))
  silverCube.visible = sugarCube.visible = false
  DISH.add(silverCube, sugarCube)
  const SUGAR_CM = 1.6
  const BIG = 8
  // the swabs
  const swabs = [0, 1].map(() => {
    const g = new THREE.Group()
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.5, 8), mats.wood)
    stick.rotation.z = Math.PI / 2
    stick.position.x = 0.75
    const wad = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshStandardMaterial({ color: '#e8e2d0', roughness: 1 }))
    g.add(stick, wad)
    g.scale.setScalar(0.001)
    discG.add(g)
    return g
  })
  // the pouring stream
  const stream = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthWrite: false }))
  stream.visible = false
  S1.add(stream)

  // the reflectance meter (a screen behind the jars)
  const meter = standingScreen({ width: 2.3, height: 1.2, color: SILVER, title: E.silver.meter, line: '', titleSize: 0.12, lineSize: 0.095 }, { top: 1.95, tilt: 0.2, mat: mats.dark })
  meter.group.position.set(1.45, 0, -0.3)
  S1.add(meter.group)
  const barTex = tex(canvasTex(256, 64, null, { mipmaps: false }))
  const barPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.25), new THREE.MeshBasicMaterial({ map: barTex, toneMapped: false }))
  barPlane.position.set(0, -0.4, 0.003)
  meter.content.add(barPlane)
  let barDrawn = ''
  const drawBar = r => {
    const key = r.toFixed(3)
    if (key === barDrawn) return
    barDrawn = key
    barTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1030'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#26305e'
      g.fillRect(6, 18, w - 12, 28)
      const grd = g.createLinearGradient(6, 0, w - 6, 0)
      grd.addColorStop(0, '#6b7694')
      grd.addColorStop(1, '#f4f6fa')
      g.fillStyle = grd
      g.fillRect(6, 18, (w - 12) * r, 28)
      g.fillStyle = '#ffd166'
      g.fillRect(6 + (w - 12) * 0.95 - 1, 8, 3, 48)
      g.font = '700 14px Outfit'
      g.textAlign = 'center'
      g.fillText('95%', 6 + (w - 12) * 0.95, 62)
    })
  }

  // state
  const F = { acid: false, red: false, ag: false, m: 0, mT: 0, oldK: 1, wet: 0, cube: false, cubeK: 0, said: 0, pour: null, done: false, swabK: 0 }
  const ready = () => F.acid && F.red && F.ag
  const nmNow = () => filmNm(F.m)
  const rNow = () => filmR(nmNow())
  const silverHint = () => {
    const H = E.silver.hints
    if (!F.acid) return H.acid
    if (!F.red || !F.ag) return !F.red ? H.reducer : H.silver
    if (F.m < MINUTES - 0.02) return H.watch
    return F.cube ? H.done : H.dish
  }
  const silverVars = () => {
    const nm = nmNow()
    return {
      nm: num(nm, 0, lang),
      r: num(rNow() * 100, 0, lang),
      cm: num(cubeCm(nm), 1, lang),
      g: num(cubeG(nm), 0, lang),
      area: num(AREA, 2, lang),
      cm3: num(AREA * 1e4 * nm * 1e-7, 1, lang),
      sugar: num(SUGAR_CM, 1, lang),
    }
  }
  const silverPanel = lv => ({
    title: E.silver.title,
    color,
    blocks: [
      ...paras(E.silver.panel[depth(lv)]),
      { p: E.silver.tip },
      {
        slider: {
          label: E.silver.minutes,
          min: 0,
          max: MINUTES,
          step: 0.05,
          value: F.m,
          onInput: v => {
            if (!ready()) {
              settleSay('silver', () => say(at(E.silver.says.nofilm, level())))
              return
            }
            F.m = v
            F.mT = v
            shareSoon('silver')
            settleSay('silver', filmWords)
          },
          format: v => `${num(v, 1, lang)} min`,
          live: () => F.m,
        },
      },
      {
        buttons: [
          { label: E.silver.buttons.acid, onClick: () => tapJar('acid') },
          { label: E.silver.buttons.reducer, onClick: () => tapJar('reducer') },
          { label: E.silver.buttons.silver, onClick: () => tapJar('silver') },
          { label: E.silver.buttons.dish, onClick: () => tapDish() },
        ],
      },
    ],
  })
  const filmWords = () => {
    if (!ready()) return
    const v = silverVars()
    const key = F.m < 0.05 ? 'start' : F.m < 1.2 ? 'haze' : F.m < MINUTES - 0.05 ? 'shine' : 'done'
    say(fill(at(E.silver.says[key], level()), v))
  }
  const startFilm = () => {
    F.mT = MINUTES
    F.done = false
    say(fill(at(E.silver.says.film, level()), silverVars()))
  }
  // a jar pours: it lifts, goes over the disc, tips, comes home (the effect lands mid-pour)
  const POUR = 2.8
  const tapJar = id => {
    if (F.pour) return
    if (id === 'silver' && F.m >= MINUTES - 0.02 && ready()) {
      say(at(E.silver.says.again, level()))
      return
    }
    F.pour = { id, t: 0, landed: false }
    play('tap')
    share('silver')
  }
  const landJar = id => {
    if (id === 'acid') {
      const had = F.red || F.ag || F.m > 0.05
      F.acid = true
      F.red = F.ag = false
      F.mT = F.m = 0
      F.cube = false
      F.done = false
      say(at(had ? E.silver.says.strip : E.silver.says.acid, level()))
      F.wet = 1
    } else if (id === 'reducer') {
      F.red = true
      F.wet = 1
      if (!F.acid) say(at(E.silver.says.dirty, level()))
      else if (F.ag) startFilm()
      else say(at(E.silver.says.reducer, level()))
    } else {
      F.ag = true
      F.wet = 1
      if (!F.acid) say(at(E.silver.says.dirty, level()))
      else if (F.red) startFilm()
      else say(at(E.silver.says.silverAlone, level()))
    }
    share('silver')
    refresh(silverPanel)
  }
  const tapDish = () => {
    if (F.m < 0.2) {
      say(at(E.silver.says.dishEmpty, level()))
      return
    }
    F.cube = !F.cube
    play(F.cube ? 'select' : 'tap')
    if (F.cube) say(fill(at(E.silver.says.dish, level()), silverVars()))
    share('silver')
  }
  ex.add({
    id: 'silver',
    x: -3.4,
    z: 3.0,
    radius: 2.5,
    label: E.silver.label,
    verb: silverHint,
    manual: true,
    focus: { ...(() => { const p = worldAt(S1, 0.4, 1.1, 0); return { x: p.x, y: p.y, z: p.z } })(), size: 4.4, width: 5.6 },
    act: () => ctx.showPanel(silverPanel),
  })
  clickable(discG, () => {
    play('tap')
    ctx.showPanel(silverPanel)
  }, { reach: 7 })
  for (const id of Object.keys(JARS)) clickable(JARS[id].group, () => tapJar(id), { reach: 7, when: () => !F.pour || F.pour.id !== id })
  clickable(DISH, tapDish, { reach: 7 })

  let faceWait = 0
  let faceKey = ''
  let streamOn = false
  updates.push((dt, t) => {
    // the minutes run toward their target
    if (Math.abs(F.m - F.mT) > 1e-4) F.m += Math.sign(F.mT - F.m) * Math.min(Math.abs(F.mT - F.m), 0.7 * dt)
    F.swabK = damp(F.swabK, Math.abs(F.m - F.mT) > 0.01 && ready() ? 1 : 0, 3, dt)
    if (F.m >= MINUTES - 0.02 && ready() && !F.done) {
      F.done = true
      say(fill(at(E.silver.says.done, level()), silverVars()))
      findOnce('silver', silverPanel, 3)
      play('discover')
    }
    // the old coat goes with the acid
    F.oldK = damp(F.oldK, F.acid ? 0 : 1, 1.6, dt)
    if (F.acid && F.oldK < 0.02) F.oldK = 0
    const wetT = F.acid || F.red || F.ag ? (F.m >= MINUTES - 0.02 ? 0.15 : 1) : 0
    F.wet = damp(F.wet, wetT, 1.2, dt)
    F.cubeK = damp(F.cubeK, F.cube ? 1 : 0, 6, dt)
    // the pouring jar
    if (F.pour) {
      const p = F.pour
      p.t += dt
      const j = JARS[p.id]
      const home = jarPos(p.id)
      const over = new THREE.Vector3(DISC.x + 0.55, 1.85, 0.25)
      const k = p.t / POUR
      const goK = ease(clamp(k / 0.3))
      const backK = ease(clamp((k - 0.78) / 0.22))
      const tip = ease(clamp((k - 0.3) / 0.15)) * (1 - ease(clamp((k - 0.68) / 0.1)))
      const pos = new THREE.Vector3().lerpVectors(home, over, goK * (1 - backK))
      pos.y += 0.35 * Math.sin(Math.PI * goK * (1 - backK)) * (backK > 0 ? 0 : 1)
      j.group.position.copy(pos)
      const a = 1.95 * tip
      j.group.rotation.z = a
      // the stream from the mouth down onto the glass
      const mouth = new THREE.Vector3(pos.x - Math.sin(a) * 0.45, pos.y + Math.cos(a) * 0.45, pos.z)
      streamOn = tip > 0.7
      stream.visible = streamOn
      if (streamOn) {
        const yFace = DISC.y + 0.135 - 0.695 * (mouth.z - 0.094)
        setBeam(stream, mouth, new THREE.Vector3(mouth.x, yFace, mouth.z), 0.012)
        stream.material.color.set(j.liquid)
      }
      if (!p.landed && k > 0.45) {
        p.landed = true
        landJar(p.id)
      }
      if (p.t >= POUR) {
        j.group.position.copy(home)
        j.group.rotation.z = 0
        stream.visible = false
        F.pour = null
      }
    }
    // swabs sweep the face while the film grows
    swabs.forEach((s, i) => {
      s.scale.setScalar(Math.max(0.001, F.swabK))
      const ph = t * (1.4 + i * 0.3) + i * 2.1
      const sx = Math.cos(ph) * (0.6 - 0.1 * i)
      const sy = Math.sin(ph * 0.8) * 0.55
      s.position.set(sx, sy, DISC.t / 2 + 0.09)
      s.rotation.z = (i ? Math.PI : 0) + Math.sin(ph) * 0.35
      s.rotation.y = 0
    })
    // the silver cube in its dish, and the sugar cube beside it
    {
      const nm = nmNow()
      const s = (cubeCm(nm) / 100) * BIG
      const sg = (SUGAR_CM / 100) * BIG
      silverCube.visible = sugarCube.visible = F.cubeK > 0.02
      silverCube.scale.setScalar(Math.max(0.001, s * F.cubeK))
      silverCube.position.set(-0.05, 0.05 + (s * F.cubeK) / 2, 0)
      sugarCube.scale.setScalar(Math.max(0.001, sg * F.cubeK))
      sugarCube.position.set(0.1 + sg / 2, 0.05 + (sg * F.cubeK) / 2, 0.02)
      dishMesh.scale.set(1 + 0.3 * F.cubeK, 1, 1 + 0.3 * F.cubeK)
    }
    // the face and the meter, a few times a second
    faceWait -= dt
    if (faceWait <= 0) {
      faceWait = 1 / 12
      const fK = clamp((rNow() - 0.04) / 0.91) * (ready() || F.m > 0.01 ? 1 : 0)
      const key = `${F.oldK.toFixed(2)}|${fK.toFixed(3)}|${F.wet.toFixed(2)}|${F.swabK > 0.05 ? Math.round(t * 6) : 0}`
      if (key !== faceKey) {
        faceKey = key
        drawFace(F.oldK, fK, F.wet)
      }
      drawBar(F.m > 0.01 ? rNow() : 0.04)
      const v = silverVars()
      meter.set({ line: fill(at(E.silver.meterLine, level()), v) + (F.cube ? '\n' + fill(at(E.silver.cubeLine, level()), v) : '') })
    }
  })
  drawFace(1, 0, 0)

  // =================================================================================================
  // Station 2: which metal shines best?
  // =================================================================================================
  const S2 = stationGroup(5.4, 1.6, -0.63)
  bench(S2, 0, 0, 4.8, 0.9)
  solidAt(S2, 0, 0, 4.9, 1.0, 1.0)
  const MX = i => -1.7 + 0.85 * i
  const MY = 1.45
  const TILT = 0.63
  // a mirror's face: a room's light in it (a lamp, a window, a dark floor), tinted by the metal
  const sheenTex = tex(canvasTex(128, 128, (g, w) => {
    const bg = g.createLinearGradient(0, 0, w, w)
    bg.addColorStop(0, '#ffffff')
    bg.addColorStop(0.55, '#c9ced6')
    bg.addColorStop(1, '#7c828e')
    g.fillStyle = bg
    g.fillRect(0, 0, w, w)
    g.fillStyle = 'rgba(40,44,52,0.55)'
    g.fillRect(0, w * 0.66, w, w * 0.34)
    g.fillStyle = 'rgba(255,255,255,0.95)'
    g.fillRect(w * 0.18, w * 0.16, w * 0.3, w * 0.24)
    const gl = g.createRadialGradient(w * 0.72, w * 0.3, 0, w * 0.72, w * 0.3, w * 0.2)
    gl.addColorStop(0, 'rgba(255,240,210,1)')
    gl.addColorStop(1, 'rgba(255,240,210,0)')
    g.fillStyle = gl
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false }))
  const SHEEN = { speculum: 0.62, amalgam: 0.7, aluminium: 0.92, silver: 1, gold: 0.95 }
  const mirrorGroups = METALS.map((metal, i) => {
    const g = new THREE.Group()
    g.position.set(MX(i), MY, 0)
    g.rotation.x = TILT
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.04, 40).rotateX(Math.PI / 2),
      [mats.dark, new THREE.MeshBasicMaterial({ map: sheenTex, color: new THREE.Color(METAL_COLOR[metal]).multiplyScalar(SHEEN[metal]), toneMapped: false }), mats.dark],
    )
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.018, 8, 40), mats.brass)
    ring.position.z = 0.012
    g.add(disc, ring)
    g.add(hitBox(0.6, 0.6, 0.3, 0, 0, 0.12))
    S2.add(g)
    // the post and foot, and the card in front
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, MY - 0.9 - 0.2, 8), mats.iron)
    post.position.set(MX(i), 0.9 + (MY - 0.9 - 0.2) / 2, -0.06)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.04, 14), mats.iron)
    foot.position.set(MX(i), 0.92, -0.06)
    S2.add(post, foot)
    const card = new THREE.Group()
    card.position.set(MX(i), 0.9, 0.3)
    card.rotation.x = -0.55
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.2, 0.02, 2, 0.008), mats.dark)
    plate.position.y = 0.1
    card.add(plate)
    const [a, b] = E.metals.cards[metal].split('\n')
    const t1 = makeText(a, { size: 0.05, color: '#ffd166', maxWidth: 0.58, anchorY: 'middle' })
    t1.position.set(0, 0.135, 0.012)
    const t2 = makeText(b, { font: 'body', size: 0.036, color: '#e8e0d0', maxWidth: 0.58, anchorY: 'middle' })
    t2.position.set(0, 0.06, 0.012)
    card.add(t1, t2)
    S2.add(card)
    return g
  })
  // the glow where the beam lands
  const spot = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  spot.position.z = 0.03
  spot.raycast = () => {}
  mirrorGroups[0].add(spot)
  // the reflectometer: a rail along the bench and a head on it with a lamp and a detector
  const HZ = 0.58
  const HY = 1.1
  const rail = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.03, 0.1), mats.steel)
  rail.position.set(0, 0.915, HZ)
  S2.add(rail)
  const head = new THREE.Group()
  head.position.set(MX(2), 0, HZ)
  S2.add(head)
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff0d4', emissive: '#ffd890', emissiveIntensity: 0.3, roughness: 0.4 })
  const lampLens = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16).rotateX(Math.PI / 2), lampMat)
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#1c4a38', emissive: '#4cffa0', emissiveIntensity: 0.05, roughness: 0.4 })
  const eyeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16).rotateX(Math.PI / 2), eyeMat)
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.13, 0.16, 3, 0.02), mats.dark)
    body.position.y = HY
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.1, HY - 0.93, 0.1), mats.iron)
    col.position.y = 0.93 + (HY - 0.93) / 2 - 0.08
    lampLens.position.set(-0.12, HY, -0.1)
    eyeLens.position.set(0.12, HY, -0.1)
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12).rotateX(Math.PI / 2), mats.brass)
    hood.position.set(-0.12, HY, -0.07)
    const hood2 = hood.clone()
    hood2.position.x = 0.12
    head.add(body, col, lampLens, eyeLens, hood, hood2)
    head.add(hitBox(0.5, 0.3, 0.3, 0, HY, 0))
  }
  const beamMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const beamOutMat = beamMat.clone()
  const beamIn = new THREE.Mesh(beamGeo, beamMat)
  const beamOut = new THREE.Mesh(beamGeo, beamOutMat)
  beamIn.raycast = beamOut.raycast = () => {}
  S2.add(beamIn, beamOut)
  // the chart over the bench: every metal's curve, the light's colour, the reading
  const chart = screen({ width: 3.9, height: 1.25, color: SILVER, title: '', line: '' })
  chart.group.position.set(0, 2.72, -0.5)
  chart.group.rotation.x = 0.1
  S2.add(chart.group)
  for (const s of [-1, 1]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8), mats.iron)
    pole.position.set(s * 2.1, 1.7, -0.58)
    S2.add(pole)
  }
  const CW = 1024
  const CH = 330
  const chartTex = tex(canvasTex(CW, CH, null, { mipmaps: false }))
  const chartPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.78, 3.78 * (CH / CW)), new THREE.MeshBasicMaterial({ map: chartTex, toneMapped: false }))
  chartPlane.position.z = 0.003
  chart.content.add(chartPlane)
  // the jar of foul air, and the wisp it sends to the silver
  const foul = new THREE.Group()
  foul.position.set(MX(2) + 0.425, 0.9, 0.3)
  S2.add(foul)
  const foulLid = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, 0.07, 14), new THREE.MeshStandardMaterial({ color: '#9a7448', roughness: 0.9 }))
  foulLid.position.y = 0.44
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 20), new THREE.MeshStandardMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.3, roughness: 0.08, depthWrite: false }))
    body.position.y = 0.17
    const gas = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.3, 20), new THREE.MeshBasicMaterial({ color: '#b8c250', transparent: true, opacity: 0.4, depthWrite: false }))
    gas.position.y = 0.17
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.07, 16), new THREE.MeshStandardMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.4, roughness: 0.1, depthWrite: false }))
    neck.position.y = 0.375
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.09), mats.paper)
    label.position.set(0, 0.17, 0.133)
    const text = makeText(E.metals.foulLabel, { font: 'body', size: 0.034, color: '#2a2018', maxWidth: 0.19, anchorY: 'middle' })
    text.position.set(0, 0.17, 0.136)
    foul.add(body, gas, neck, foulLid, label, text)
    foul.add(hitBox(0.3, 0.55, 0.3, 0, 0.25, 0))
  }
  const WISPS = 26
  const wispPos = new Float32Array(WISPS * 3)
  const wispGeo = new THREE.BufferGeometry()
  wispGeo.setAttribute('position', new THREE.BufferAttribute(wispPos, 3))
  const dotTex = tex(canvasTex(32, 32, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const wispMat = new THREE.PointsMaterial({ color: '#c8d060', size: 0.11, map: dotTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
  const wisps = new THREE.Points(wispGeo, wispMat)
  wisps.frustumCulled = false
  wisps.raycast = () => {}
  S2.add(wisps)

  const Wm = { sel: -1, nm: 550, slid: false, tarn: 0, tarnT: 0, k: 0, head: MX(2), tried: new Set(), drawn: '', gas: 0 }
  const silverIx = METALS.indexOf('silver')
  const rOf = (i, nm = Wm.nm) => reflectance(METALS[i], nm, i === silverIx ? Wm.tarn : 0)
  const bandOf = nm => {
    if (nm < 380) return 'uv'
    if (nm < 440) return 'violet'
    if (nm < 490) return 'blue'
    if (nm < 565) return 'green'
    if (nm < 590) return 'yellow'
    if (nm < 625) return 'orange'
    if (nm <= 780) return 'red'
    return 'ir'
  }
  const metalsHint = () => {
    const H = E.metals.hints
    if (Wm.sel < 0) return H.mirror
    if (!Wm.slid) return H.slide
    if (Wm.tarnT < 0.5) return H.foul
    if (Wm.sel !== silverIx) return H.again
    return H.slide
  }
  const metalsPanel = lv => {
    const sci = lv === 'scientist'
    return {
      title: E.metals.title,
      color,
      blocks: [
        ...paras(E.metals.panel[depth(lv)]),
        { p: E.metals.tip },
        {
          slider: {
            label: E.metals.wave,
            min: sci ? 250 : 380,
            max: sci ? 1000 : 780,
            step: 5,
            value: clamp(Wm.nm, sci ? 250 : 380, sci ? 1000 : 780),
            onInput: v => {
              Wm.nm = v
              Wm.slid = true
              shareSoon('metals')
              settleSay('metals', slideWords)
            },
            format: v => `${num(v, 0, lang)} nm`,
            live: () => clamp(Wm.nm, sci ? 250 : 380, sci ? 1000 : 780),
          },
        },
        {
          buttons: [
            { label: E.metals.buttons.foul, onClick: () => tapFoul(true) },
            { label: E.metals.buttons.fresh, onClick: () => tapFoul(false) },
            ...METALS.map((m, i) => ({ label: E.metals.names[m], onClick: () => tapMirror(i) })),
          ],
        },
      ],
    }
  }
  const slideWords = () => {
    const pct = i => num(rOf(i) * 100, 0, lang)
    say(fill(at(E.metals.says.slide, level()), { nm: num(Wm.nm, 0, lang), band: E.metals.bands[bandOf(Wm.nm)], ag: pct(3), al: pct(2), au: pct(4), sp: pct(0) }))
  }
  const tapMirror = i => {
    Wm.sel = i
    Wm.tried.add(i)
    play('beam')
    say(at(E.metals.says[METALS[i]], level()))
    shareSoon('metals')
    if (Wm.tried.size >= 3) findOnce('metals', metalsPanel, 3)
    refresh(metalsPanel)
  }
  const tapFoul = on => {
    if (on === undefined) on = Wm.tarnT < 0.5
    if (on === Wm.tarnT > 0.5) {
      if (on) say(fill(at(E.metals.says.tarnished, level()), { r: num(rOf(silverIx) * 100, 0, lang) }))
      return
    }
    Wm.tarnT = on ? 1 : 0
    play(on ? 'select' : 'discover')
    Wm.gas = on ? 4.5 : 0
    if (on) {
      say(at(E.metals.says.foul, level()))
      Wm.sel = silverIx
      Wm.tried.add(silverIx)
      later(5, () => Wm.tarnT > 0.5 && say(fill(at(E.metals.says.tarnished, level()), { r: num(rOf(silverIx) * 100, 0, lang) })))
      findOnce('metals', metalsPanel, 6.5)
    } else say(at(E.metals.says.fresh, level()))
    shareSoon('metals')
  }
  const focus2 = worldAt(S2, 0, 1.6, 0.2)
  ex.add({
    id: 'metals',
    x: 3.2,
    z: 4.6,
    radius: 2.5,
    label: E.metals.label,
    verb: metalsHint,
    manual: true,
    focus: { x: focus2.x, y: focus2.y, z: focus2.z, size: 3.6, width: 5.4 },
    act: () => ctx.showPanel(metalsPanel),
  })
  mirrorGroups.forEach((g, i) => clickable(g, () => tapMirror(i), { reach: 8 }))
  clickable(foul, () => tapFoul(), { reach: 8 })
  clickable(head, () => {
    play('tap')
    ctx.showPanel(metalsPanel)
  }, { reach: 8 })

  const drawChart = () => {
    const sci = level() === 'scientist'
    const lo = sci ? 250 : 380
    const hi = sci ? 1000 : 780
    const key = [Wm.sel, Math.round(Wm.nm / 5), Math.round(Wm.tarn * 40), sci, lang].join('|')
    if (key === Wm.drawn) return
    Wm.drawn = key
    chartTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const X0 = 70
      const X1 = w - 24
      const Y0 = 78
      const Y1 = h - 62
      const px = nm => X0 + ((clamp(nm, lo, hi) - lo) / (hi - lo)) * (X1 - X0)
      const py = r => Y1 - r * (Y1 - Y0)
      g.font = '600 22px Nunito'
      g.textAlign = 'right'
      g.textBaseline = 'middle'
      for (const r of [0, 0.25, 0.5, 0.75, 1]) {
        g.strokeStyle = 'rgba(160,176,230,0.22)'
        g.lineWidth = 1
        g.beginPath()
        g.moveTo(X0, py(r))
        g.lineTo(X1, py(r))
        g.stroke()
        g.fillStyle = '#9fb0e0'
        g.fillText(`${Math.round(r * 100)}`, X0 - 10, py(r))
      }
      // the colour strip under the axis, and its ticks
      for (let x = X0; x < X1; x += 2) {
        const nm = lo + ((x - X0) / (X1 - X0)) * (hi - lo)
        const c = wlColor(nm)
        const vis = visible(nm) ? 1 : 0.28
        g.fillStyle = `rgb(${Math.round(c.r * 255 * vis)},${Math.round(c.g * 255 * vis)},${Math.round(c.b * 255 * vis)})`
        g.fillRect(x, Y1 + 6, 2, 12)
      }
      g.textAlign = 'center'
      g.fillStyle = '#9fb0e0'
      g.font = '600 20px Nunito'
      for (let nm = Math.ceil(lo / 100) * 100; nm <= hi; nm += 100) g.fillText(String(nm), px(nm), Y1 + 34)
      g.textAlign = 'right'
      g.fillText(E.metals.chart.axis, X1, Y1 + 52)
      // the curves
      METALS.forEach((m, i) => {
        const on = i === Wm.sel
        g.strokeStyle = CHART_COLOR[m]
        g.globalAlpha = Wm.sel < 0 ? 0.85 : on ? 1 : 0.38
        g.lineWidth = on ? 6 : 3
        g.beginPath()
        for (let x = 0; x <= 120; x++) {
          const nm = lo + (x / 120) * (hi - lo)
          const yy = py(rOf(i, nm))
          if (x) g.lineTo(px(nm), yy)
          else g.moveTo(px(nm), yy)
        }
        g.stroke()
        g.globalAlpha = 1
      })
      // the light's colour, a line down the chart and a dot on the chosen curve
      const c = wlColor(Wm.nm)
      g.strokeStyle = `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`
      g.lineWidth = 3
      g.setLineDash([8, 6])
      g.beginPath()
      g.moveTo(px(Wm.nm), Y0 - 14)
      g.lineTo(px(Wm.nm), Y1 + 6)
      g.stroke()
      g.setLineDash([])
      if (Wm.sel >= 0) {
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(px(Wm.nm), py(rOf(Wm.sel)), 9, 0, TAU)
        g.fill()
      }
      // the title and the reading
      g.textAlign = 'left'
      g.fillStyle = '#ffd166'
      g.font = '700 30px Outfit'
      g.fillText(E.metals.chart.title, X0, 30)
      g.textAlign = 'right'
      g.fillStyle = Wm.sel < 0 ? '#9fb0e0' : '#ffffff'
      g.font = '700 38px Outfit'
      g.fillText(Wm.sel < 0 ? E.metals.chart.none : fill(E.metals.chart.read, { name: E.metals.names[METALS[Wm.sel]], r: num(rOf(Wm.sel) * 100, 0, lang) }), X1, 34)
      g.font = '600 20px Nunito'
      g.fillStyle = '#9fb0e0'
      g.fillText(`${num(Wm.nm, 0, lang)} nm, ${E.metals.bands[bandOf(Wm.nm)]}`, X1, 62)
    })
  }

  const tmpA = new THREE.Vector3()
  const tmpB = new THREE.Vector3()
  const tmpC = new THREE.Vector3()
  const silverColor = new THREE.Color(METAL_COLOR.silver)
  const tarnColor = new THREE.Color('#3a342e')
  let chartWait = 0
  updates.push((dt, t) => {
    Wm.tarn = damp(Wm.tarn, Wm.tarnT, 0.55, dt)
    if (Math.abs(Wm.tarn - Wm.tarnT) < 0.004) Wm.tarn = Wm.tarnT
    Wm.gas = Math.max(0, Wm.gas - dt)
    const on = Wm.sel >= 0
    Wm.k = damp(Wm.k, on ? 1 : 0, 6, dt)
    if (on) Wm.head = damp(Wm.head, MX(Wm.sel), 5, dt)
    head.position.x = Wm.head
    // the silver mirror darkens as it tarnishes
    mirrorGroups[silverIx].children[0].material[1].color.copy(silverColor).lerp(tarnColor, Wm.tarn * 0.92)
    // the beam: lamp to the mirror's middle, and on to the detector
    if (on) {
      const col = wlColor(Wm.nm)
      const arrived = Math.abs(Wm.head - MX(Wm.sel)) < 0.06
      const k = Wm.k * (arrived ? 1 : 0)
      const vis = visible(Wm.nm) ? 1 : 0.55
      beamMat.color.copy(col)
      beamOutMat.color.copy(col)
      beamMat.opacity = 0.9 * k * vis
      const r = rOf(Wm.sel)
      beamOutMat.opacity = (0.08 + 0.92 * r) * k * vis
      tmpA.set(Wm.head - 0.12, HY, HZ - 0.1)
      tmpC.set(Wm.head + 0.12, HY, HZ - 0.1)
      tmpB.set(MX(Wm.sel), MY, 0.03)
      setBeam(beamIn, tmpA, tmpB)
      setBeam(beamOut, tmpB, tmpC, 0.006 + 0.01 * r)
      lampMat.emissive.copy(col)
      lampMat.emissiveIntensity = 0.4 + 2.2 * k
      eyeMat.emissiveIntensity = 0.05 + 2.6 * r * k * vis
      // the glow on the mirror
      if (spot.parent !== mirrorGroups[Wm.sel]) mirrorGroups[Wm.sel].add(spot)
      spot.material.color.copy(col)
      spot.material.opacity = (0.15 + 0.85 * r) * k * 0.9
    } else {
      beamMat.opacity = beamOutMat.opacity = 0
      spot.material.opacity = 0
    }
    // the foul air's wisp, from the jar's mouth to the silver
    {
      const live = Wm.gas > 0 || (Wm.tarnT > 0.5 && Wm.tarn < 0.97)
      wispMat.opacity = damp(wispMat.opacity, live ? 0.7 : 0, 3, dt)
      foulLid.position.y = lerp(foulLid.position.y, live ? 0.62 : 0.44, 0.15)
      foulLid.rotation.z = live ? 0.5 : 0
      const mouth = tmpA.set(foul.position.x, foul.position.y + 0.45, foul.position.z)
      const tgt = tmpB.set(MX(silverIx), MY - 0.1, 0.1)
      for (let i = 0; i < WISPS; i++) {
        const u = (t * 0.28 + i / WISPS) % 1
        const wob = Math.sin(t * 2 + i * 2.3) * 0.05
        wispPos[i * 3] = lerp(mouth.x, tgt.x, u) + wob
        wispPos[i * 3 + 1] = lerp(mouth.y, tgt.y, u) + Math.sin(u * Math.PI) * 0.12 + wob
        wispPos[i * 3 + 2] = lerp(mouth.z, tgt.z, u) + Math.cos(t * 1.7 + i) * 0.04
      }
      wispGeo.attributes.position.needsUpdate = true
    }
    chartWait -= dt
    if (chartWait <= 0) {
      chartWait = 1 / 10
      drawChart()
    }
  })
  drawChart()


  // =================================================================================================
  // Station 3: find another galaxy (Hubble, 1923)
  // =================================================================================================
  const S3 = stationGroup(-0.2, 3.3, 0)
  // the sky of one plate: the same stars every time, the three marked ones apart
  const starRnd = random(1923)
  const STARS = Array.from({ length: 150 }, () => ({ x: 0.04 + starRnd() * 0.92, y: 0.04 + starRnd() * 0.92, b: 0.12 + 0.88 * starRnd() ** 2.5 }))
  const limit = ex => 1 - 0.85 * Math.sqrt(clamp(ex))
  const seen = (b, minutes) => b >= limit(minutes / EXPO_MAX)
  /** One plate drawn in a square at (ox, oy) of side S: 'holder' is the live view (white stars on black), 'new' and
   *  'old' are negatives on the light box (dark stars on the film), the old one with the older sky. */
  const drawPlate = (g, ox, oy, S, kind, minutes, o = {}) => {
    const neg = kind !== 'holder'
    g.save()
    g.beginPath()
    g.rect(ox, oy, S, S)
    g.clip()
    g.fillStyle = neg ? '#cdcdbd' : '#04050d'
    g.fillRect(ox, oy, S, S)
    const ink = neg ? '16,16,20' : '255,255,255'
    const ex = kind === 'old' ? 1 : clamp(minutes / EXPO_MAX)
    // the galaxy's own glow, an ellipse across the middle
    g.save()
    g.translate(ox + S * 0.5, oy + S * 0.5)
    g.rotate(0.55)
    g.scale(1, 0.3)
    const gl = g.createRadialGradient(0, 0, 0, 0, 0, S * 0.36)
    gl.addColorStop(0, `rgba(${ink},${0.7 * ex})`)
    gl.addColorStop(0.3, `rgba(${ink},${0.3 * ex})`)
    gl.addColorStop(1, `rgba(${ink},0)`)
    g.fillStyle = gl
    g.fillRect(-S, -S, 2 * S, 2 * S)
    g.restore()
    const dotAt = (x, y, b) => {
      const r = (1.4 + 4.2 * b) * (S / 472) * (0.55 + 0.45 * ex)
      const cx = ox + x * S
      const cy = oy + y * S
      const sg = g.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8)
      sg.addColorStop(0, `rgba(${ink},0.95)`)
      sg.addColorStop(0.5, `rgba(${ink},0.6)`)
      sg.addColorStop(1, `rgba(${ink},0)`)
      g.fillStyle = sg
      g.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4)
    }
    const mins = kind === 'old' ? EXPO_MAX : minutes
    for (const s of STARS) if (seen(s.b, mins)) dotAt(s.x, s.y, s.b)
    SPOTS.forEach((sp, i) => {
      const there = kind === 'new' || kind === 'holder' ? true : !sp.nova
      const b = kind === 'old' ? sp.b * 0.55 : sp.b
      if (there && seen(b, mins)) dotAt(sp.x, sp.y, Math.max(b, 0.5))
    })
    g.restore()
    if (!neg || kind !== 'new') return
    // the three marks beside the stars, and what the visitor found
    g.font = `700 ${Math.round(S * 0.075)}px Outfit`
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    SPOTS.forEach((sp, i) => {
      if (!seen(sp.b, minutes)) return
      const lx = ox + (sp.x + 0.035) * S
      const ly = oy + (sp.y - 0.05) * S
      g.fillStyle = '#7a1c1c'
      g.fillText('N', lx, ly)
      if (!sp.nova && o.varF) {
        g.strokeStyle = '#b01414'
        g.lineWidth = Math.max(2, S * 0.01)
        g.beginPath()
        g.moveTo(lx - 2, ly + S * 0.045)
        g.lineTo(lx + S * 0.06, ly - S * 0.045)
        g.stroke()
        g.fillStyle = '#b01414'
        g.font = `700 ${Math.round(S * 0.065)}px Outfit`
        g.fillText('VAR!', lx + S * 0.07, ly - S * 0.005)
        g.font = `700 ${Math.round(S * 0.075)}px Outfit`
      }
    })
  }
  const dashedRing = (g, x, y, r, color, w) => {
    g.strokeStyle = color
    g.lineWidth = w
    g.setLineDash([7, 6])
    g.beginPath()
    g.arc(x, y, r, 0, TAU)
    g.stroke()
    g.setLineDash([])
  }

  // the desk with the light box
  const desk = new THREE.Group()
  desk.position.set(0.5, 0, 0)
  S3.add(desk)
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.07, 1.0, 2, 0.015), mats.wood)
    top.position.y = 0.93
    desk.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), mats.iron)
        leg.position.set(sx * 0.95, 0.45, sz * 0.4)
        desk.add(leg)
      }
    }
  }
  solidAt(S3, 0.5, 0, 2.2, 1.1, 1.0)
  const LB = new THREE.Group()
  LB.position.set(0.5, 1.1, 0.0)
  LB.rotation.x = -0.5
  S3.add(LB)
  const LW = 1.7
  const LH = LW * (540 / 1024)
  const housing = new THREE.Mesh(new RoundedBoxGeometry(LW + 0.14, LH + 0.14, 0.12, 2, 0.02), mats.iron)
  housing.position.z = -0.07
  LB.add(housing)
  const lbTex = tex(canvasTex(1024, 540, null, { mipmaps: false }))
  const lbPlane = new THREE.Mesh(new THREE.PlaneGeometry(LW, LH), new THREE.MeshBasicMaterial({ map: lbTex, toneMapped: false }))
  LB.add(lbPlane)
  // the plate holder on its stand: the exposure as it builds
  const holder = new THREE.Group()
  holder.position.set(-1.1, 0, 0.15)
  S3.add(holder)
  const holdTex = tex(canvasTex(256, 256, null, { mipmaps: false }))
  {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.25, 10), mats.iron)
    col.position.y = 0.65
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.06, 20), mats.iron)
    foot.position.y = 0.03
    holder.add(col, foot)
    const fr = new THREE.Group()
    fr.position.y = 1.55
    const f = (w, h, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), mats.wood)
      m.position.set(x, y, 0)
      fr.add(m)
    }
    f(0.84, 0.07, 0, 0.385)
    f(0.84, 0.07, 0, -0.385)
    f(0.07, 0.84, -0.385, 0)
    f(0.07, 0.84, 0.385, 0)
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: holdTex, toneMapped: false }))
    pl.position.z = 0.04
    fr.add(pl)
    fr.add(hitBox(0.9, 0.9, 0.2, 0, 0, 0.05))
    holder.add(fr)
    const t = makeText(E.galaxy.holder, { size: 0.085, color: '#ffd166', maxWidth: 0.9, anchorY: 'middle' })
    t.position.set(0, 1.05, 0.07)
    holder.add(t)
    holder.userData.frame = fr
  }
  solidAt(S3, -1.1, 0.15, 0.7, 0.7, 2.0)
  // the star's light curve and the distance, on two boards behind the desk
  const curveBoard = standingScreen({ width: 1.6, height: 1.15, color: SILVER, title: E.galaxy.boards.curve, line: '', titleSize: 0.085, lineSize: 0.05 }, { top: 2.15, tilt: 0.12, mat: mats.dark })
  curveBoard.group.position.set(-0.2, 0, -0.85)
  S3.add(curveBoard.group)
  const curveTex = tex(canvasTex(512, 256, null, { mipmaps: false }))
  const curvePlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: curveTex, toneMapped: false }))
  curvePlane.position.set(0, -0.16, 0.003)
  curveBoard.content.add(curvePlane)
  const distBoard = standingScreen({ width: 1.7, height: 1.15, color: SILVER, title: E.galaxy.boards.dist, line: '', titleSize: 0.095, lineSize: 0.088 }, { top: 2.15, tilt: 0.12, mat: mats.dark })
  distBoard.group.position.set(1.45, 0, -0.85)
  S3.add(distBoard.group)

  const A = { aimed: false, expo: 0, expoT: 0, az: 0, plate: false, checked: [false, false, false], varF: false, curveOn: false, days: 0, period: PERIOD, today: false, blink: 0, expoSaid: false, started: false, lbKey: '', holdKey: '', curveKey: '' }
  const spotsReady = () => SPOTS.every(sp => seen(sp.b, A.expo))
  const galaxyHint = () => {
    const H = E.galaxy.hints
    if (!A.aimed) return H.scope
    if (A.expo < EXPO_MAX - 0.1 && !A.plate) return H.wait
    if (!A.plate) return H.plate
    if (!A.varF) return H.spots
    return H.slide
  }
  const galVars = () => {
    const M = cepheidM(A.period, !A.today)
    return {
      p: num(A.period, A.period % 1 ? 1 : 0, lang),
      M: num(M, 1, lang),
      l: grp(sig2(lumSuns(M)), 0, lang),
      d: grp(sig2(distLy(M)), 0, lang),
    }
  }
  const galaxyPanel = lv => ({
    title: E.galaxy.title,
    color,
    blocks: [
      ...paras(E.galaxy.panel[depth(lv)]),
      { p: E.galaxy.tip },
      {
        slider: {
          label: E.galaxy.expo,
          min: 0,
          max: EXPO_MAX,
          step: 1,
          value: Math.round(A.expo),
          onInput: v => {
            if (!A.aimed) {
              settleSay('galaxy', () => say(at(E.galaxy.says.noScope, level())))
              return
            }
            A.expo = A.expoT = v
            shareSoon('galaxy')
          },
          format: v => `${num(v, 0, lang)} min`,
          live: () => Math.round(A.expo),
        },
      },
      {
        slider: {
          label: E.galaxy.period,
          min: 3,
          max: 60,
          step: 0.1,
          value: A.period,
          onInput: v => {
            A.period = v
            shareSoon('galaxy')
            settleSay('galaxy2', periodWords)
          },
          format: v => `${num(v, 1, lang)} d`,
          live: () => A.period,
        },
      },
      {
        buttons: [
          { label: E.galaxy.buttons.scope, onClick: () => tapScope() },
          { label: E.galaxy.buttons.plate, onClick: () => tapPlate() },
          { label: E.galaxy.buttons.spot, onClick: () => tapNextSpot() },
          { label: E.galaxy.buttons.scale, onClick: () => tapScale() },
        ],
      },
    ],
  })
  const periodWords = () => say(fill(at(E.galaxy.says.slide, level()), galVars()))
  const tapScope = () => {
    A.aimed = !A.aimed
    play('beam')
    if (A.aimed) {
      say(at(E.galaxy.says.point, level()))
    } else {
      A.started = false
      say(at(E.galaxy.says.away, level()))
    }
    shareSoon('galaxy')
  }
  const tapPlate = () => {
    if (A.expo < 1) {
      say(at(E.galaxy.says.noPlate, level()))
      return
    }
    A.plate = !A.plate
    play(A.plate ? 'select' : 'tap')
    if (A.plate) say(at(E.galaxy.says.plateOn, level()))
    shareSoon('galaxy')
    refresh(galaxyPanel)
  }
  const tapSpot = i => {
    if (!A.plate) {
      tapPlate()
      return
    }
    if (!seen(SPOTS[i].b, A.expo)) {
      say(at(E.galaxy.says.faint, level()))
      return
    }
    if (SPOTS[i].nova) {
      A.checked[i] = true
      play('tap')
      say(at(E.galaxy.says.nova, level()))
    } else {
      play('discover')
      if (!A.varF) {
        A.varF = true
        A.checked[i] = true
        A.blink = 3
        say(at(E.galaxy.says.var, level()))
        later(3.6, () => {
          A.curveOn = true
          A.days = 0
          say(at(E.galaxy.says.curve, level()))
        })
        findOnce('galaxy', galaxyPanel, 9)
      } else {
        A.blink = 2
        say(at(E.galaxy.says.var, level()))
      }
    }
    shareSoon('galaxy')
  }
  const tapNextSpot = () => {
    const i = A.checked.findIndex(c => !c)
    tapSpot(i < 0 ? 2 : i)
  }
  const tapScale = () => {
    A.today = !A.today
    play('select')
    say(at(A.today ? E.galaxy.says.now : E.galaxy.says.old, level()))
    shareSoon('galaxy')
  }
  const focus3 = worldAt(S3, 0.4, 1.4, 0)
  ex.add({
    id: 'galaxy',
    x: 0.2,
    z: 5.8,
    radius: 2.5,
    label: E.galaxy.label,
    verb: galaxyHint,
    manual: true,
    focus: { x: focus3.x, y: focus3.y, z: focus3.z, size: 3.4, width: 3.8 },
    act: () => ctx.showPanel(galaxyPanel),
  })
  clickable(tel.group, tapScope, { reach: 14 })
  clickable(holder.userData.frame, tapPlate, { reach: 9 })
  // a tap on the light box counts only on one of the three marked stars of the new plate
  const nearSpot = h => {
    if (!h.uv) return -1
    const cx = h.uv.x * 1024
    const cy = (1 - h.uv.y) * 540
    let best = -1
    SPOTS.forEach((sp, i) => {
      const d = Math.hypot((cx - (532 + sp.x * 472)) / 472, (cy - (34 + sp.y * 472)) / 472)
      if (d < 0.075) best = i
    })
    return best
  }
  clickable(lbPlane, h => tapSpot(Math.max(0, nearSpot(h))), { reach: 8, when: () => A.plate, accept: h => nearSpot(h) >= 0 })
  clickable(desk, () => tapPlate(), { reach: 8, when: () => !A.plate && A.expo >= 1 })
  clickable(distBoard.group, tapScale, { reach: 8 })

  const drawLightBox = (t) => {
    const phase = A.blink > 0 ? Math.floor(t * 4) % 2 : 0
    const key = [Math.round(A.expo), A.plate, A.checked.join(), A.varF, A.blink > 0 ? phase : -1, lang].join('|')
    if (key === A.lbKey) return
    A.lbKey = key
    lbTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#e8e6d6'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#b8b6a4'
      g.fillRect(0, 0, w, 6)
      g.fillRect(0, 0, 6, h)
      g.fillRect(w - 6, 0, 6, h)
      g.fillRect(0, h - 6, w, 6)
      drawPlate(g, 20, 34, 472, 'old', EXPO_MAX)
      g.font = '700 22px Outfit'
      g.textAlign = 'center'
      g.fillStyle = '#3a3a32'
      g.fillText(E.galaxy.plates.older, 20 + 236, 26)
      if (A.plate) {
        drawPlate(g, 532, 34, 472, 'new', A.expo, { varF: A.varF })
        g.fillText(E.galaxy.plates.now, 532 + 236, 26)
        // what was found: a dashed ring on the older plate where a nova should have been, the variable ringed on both
        SPOTS.forEach((sp, i) => {
          if (!A.checked[i]) return
          if (sp.nova) dashedRing(g, 20 + sp.x * 472, 34 + sp.y * 472, 22, '#1a6a50', 4)
          else {
            const on = A.blink > 0 ? phase === 0 : true
            if (on) {
              dashedRing(g, 20 + sp.x * 472, 34 + sp.y * 472, 20, '#b01414', 4)
              dashedRing(g, 532 + sp.x * 472, 34 + sp.y * 472, 20, '#b01414', 4)
            }
          }
        })
      } else {
        g.strokeStyle = '#8a8874'
        g.lineWidth = 4
        g.setLineDash([14, 10])
        g.strokeRect(532, 34, 472, 472)
        g.setLineDash([])
      }
    })
  }
  const drawHolder = () => {
    const key = `${Math.round(A.expo * 2)}`
    if (key === A.holdKey) return
    A.holdKey = key
    holdTex.userData.redraw((g, w) => drawPlate(g, 0, 0, w, 'holder', A.expo))
  }
  const cepheid = d => {
    // brightness 0..1 over a cycle: a quick rise to the peak at 18% of the period, a slow fall
    const ph = (((d / PERIOD) % 1) + 1) % 1
    return ph < 0.18 ? 0.12 + 0.88 * (ph / 0.18) : 0.12 + 0.88 * Math.exp(-(ph - 0.18) * 3.4) * (1 - (ph - 0.18) * 0.12)
  }
  const drawCurve = () => {
    const key = `${Math.round(A.days * 2)}|${A.curveOn}|${lang}`
    if (key === A.curveKey) return
    A.curveKey = key
    curveTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const X0 = 40
      const X1 = w - 16
      const Y0 = 22
      const Y1 = h - 34
      const px = d => X0 + (d / 64) * (X1 - X0)
      const py = b => Y1 - b * (Y1 - Y0 - 10)
      g.strokeStyle = 'rgba(160,176,230,0.35)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(X0, Y0)
      g.lineTo(X0, Y1)
      g.lineTo(X1, Y1)
      g.stroke()
      g.fillStyle = '#9fb0e0'
      g.font = '600 20px Nunito'
      g.textAlign = 'center'
      for (const d of [0, 20, 40]) g.fillText(String(d), px(d), Y1 + 22)
      g.textAlign = 'right'
      g.fillText(E.galaxy.curveAxis, X1, Y1 + 22)
      if (!A.curveOn) {
        g.textAlign = 'center'
        g.fillStyle = '#6b7aa8'
        g.font = '700 54px Outfit'
        g.fillText('?', w / 2, h / 2)
        return
      }
      g.fillStyle = '#ffd9a0'
      for (let d = 0; d <= A.days; d += 0.8) {
        g.beginPath()
        g.arc(px(d), py(cepheid(d)), 4.2, 0, TAU)
        g.fill()
      }
      // the period between two peaks
      const p0 = 0.18 * PERIOD
      const p1 = p0 + PERIOD
      if (A.days >= p1) {
        g.strokeStyle = '#ffd166'
        g.lineWidth = 3
        g.beginPath()
        g.moveTo(px(p0), py(1) - 12)
        g.lineTo(px(p1), py(1) - 12)
        g.moveTo(px(p0), py(1) - 20)
        g.lineTo(px(p0), py(1) - 4)
        g.moveTo(px(p1), py(1) - 20)
        g.lineTo(px(p1), py(1) - 4)
        g.stroke()
        g.fillStyle = '#ffd166'
        g.textAlign = 'center'
        g.font = '700 26px Outfit'
        g.fillText(`${num(PERIOD, 1, lang)} ${E.galaxy.days}`, px((p0 + p1) / 2), py(1) + 12)
      }
    })
  }

  let boardWait = 0
  updates.push((dt, t) => {
    // the dome and the telescope turn to Andromeda, then the exposure runs
    const target = A.aimed ? ANDROMEDA_AZ : 0
    A.az = damp(A.az, target, 1.1, dt)
    if (Math.abs(A.az - target) < 0.004) A.az = target
    const k = clamp(A.az / ANDROMEDA_AZ)
    stage.setDomeAz(A.az)
    tel.aim(A.az, lerp(0.7, TARGET_ALT, k))
    const arrived = A.aimed && A.az === ANDROMEDA_AZ
    if (arrived && !A.started && A.expo < EXPO_MAX - 0.1) {
      A.started = true
      A.expoT = EXPO_MAX
    }
    if (A.expo < A.expoT) A.expo = Math.min(A.expoT, A.expo + 5.6 * dt)
    else if (A.expo > A.expoT) A.expo = A.expoT
    if (A.expo >= EXPO_MAX - 0.1 && !A.expoSaid && A.aimed) {
      A.expoSaid = true
      say(at(E.galaxy.says.expoDone, level()))
      play('discover')
    }
    if (A.expo < 5) A.expoSaid = false
    A.blink = Math.max(0, A.blink - dt)
    if (A.curveOn && A.days < 64) A.days = Math.min(64, A.days + 8.5 * dt)
    // the plates and boards, a few times a second
    boardWait -= dt
    if (boardWait <= 0) {
      boardWait = 1 / 10
      drawLightBox(t)
      drawHolder()
      drawCurve()
      const v = galVars()
      distBoard.set({ line: A.varF ? fill(at(E.galaxy.board, level()), v) : '?' })
    }
  })
  drawLightBox(0)
  drawHolder()
  drawCurve()


  updates.push(dt => {
    for (const [id, s] of Object.entries(settleTimers)) {
      if (!s) continue
      s.t -= dt
      if (s.t <= 0) {
        settleTimers[id] = null
        s.fn()
      }
    }
  })

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.9 },
    spawn: { x: 0, z: 6.5, yaw: 0 },
    hostSpot: { x: 2.0, z: 6.3, yaw: Math.atan2(2.0, -0.8) },
    back: { x: 0, z: 9.4, rot: Math.PI },
    stand: { x: -3.6, z: 7.3, rot: 0.6 },
    panels: { silver: silverPanel, metals: metalsPanel, galaxy: galaxyPanel },
    parts: {
      tap: name =>
        ({
          acid: () => tapJar('acid'),
          reducer: () => tapJar('reducer'),
          silver: () => tapJar('silver'),
          dish: tapDish,
          scope: tapScope,
          plate: tapPlate,
          scale: tapScale,
          spot0: () => tapSpot(0),
          spot1: () => tapSpot(1),
          spot2: () => tapSpot(2),
          foul: () => tapFoul(),
          fresh: () => tapFoul(false),
          ...Object.fromEntries(METALS.map((m, i) => ['mirror:' + m, () => tapMirror(i)])),
        })[name]?.(),
      galaxy: {
        get aimed() {
          return A.aimed
        },
        get expo() {
          return A.expo
        },
        get plate() {
          return A.plate
        },
        get checked() {
          return A.checked
        },
        get varF() {
          return A.varF
        },
        get days() {
          return A.days
        },
        get period() {
          return A.period
        },
        get today() {
          return A.today
        },
        at: name => ({
          scope: tel.group.localToWorld(tel.centre.clone()),
          holder: worldAt(S3, -1.1, 1.55, 0.2),
          spot0: LB.localToWorld(new THREE.Vector3((SPOTS[0].x - 0.5) * 0.0 + ((532 + SPOTS[0].x * 472) / 1024 - 0.5) * LW, (0.5 - (34 + SPOTS[0].y * 472) / 540) * LH, 0.01)),
          spot1: LB.localToWorld(new THREE.Vector3(((532 + SPOTS[1].x * 472) / 1024 - 0.5) * LW, (0.5 - (34 + SPOTS[1].y * 472) / 540) * LH, 0.01)),
          spot2: LB.localToWorld(new THREE.Vector3(((532 + SPOTS[2].x * 472) / 1024 - 0.5) * LW, (0.5 - (34 + SPOTS[2].y * 472) / 540) * LH, 0.01)),
        })[name],
      },
      metals: {
        get sel() {
          return Wm.sel
        },
        get nm() {
          return Wm.nm
        },
        get tarn() {
          return Wm.tarn
        },
        get r() {
          return Wm.sel >= 0 ? rOf(Wm.sel) : null
        },
        at: name => ({ foul: worldAt(S2, MX(2) + 0.425, 1.1, 0.3), head: worldAt(S2, Wm.head, HY, HZ), ...Object.fromEntries(METALS.map((m, i) => [m, worldAt(S2, MX(i), MY, 0.1)])) })[name],
      },
      silver: {
        get acid() {
          return F.acid
        },
        get red() {
          return F.red
        },
        get ag() {
          return F.ag
        },
        get m() {
          return F.m
        },
        get r() {
          return rNow()
        },
        get cube() {
          return F.cube
        },
        get pouring() {
          return !!F.pour
        },
        at: name => ({ disc: worldAt(S1, DISC.x, DISC.y, 0.2), acid: worldAt(S1, JARS.acid.x, 1.1, 0.55), reducer: worldAt(S1, JARS.reducer.x, 1.1, 0.55), silver: worldAt(S1, JARS.silver.x, 1.1, 0.55), dish: worldAt(S1, 2.3, 1.0, 0.7) })[name],
      },
    },
    shared: {
      galaxy: {
        get: () => ({ aimed: A.aimed, expo: Math.round(A.expoT), plate: A.plate, checked: [...A.checked], varF: A.varF, period: Math.round(A.period * 10) / 10, today: A.today }),
        set: (s, live) => {
          A.aimed = !!s?.aimed
          A.expoT = clamp(Number(s?.expo) || 0, 0, EXPO_MAX)
          A.plate = !!s?.plate
          A.checked = [0, 1, 2].map(i => !!s?.checked?.[i])
          const was = A.varF
          A.varF = !!s?.varF
          A.period = clamp(Number(s?.period) || PERIOD, 3, 60)
          A.today = !!s?.today
          if (!live) {
            A.expo = A.expoT
            A.az = A.aimed ? ANDROMEDA_AZ : 0
            A.curveOn = A.varF
            A.days = A.varF ? 64 : 0
            A.started = A.aimed
          } else if (A.varF && !was) {
            A.curveOn = true
            A.days = 0
          } else if (!A.varF) A.curveOn = false
        },
      },
      metals: {
        get: () => ({ sel: Wm.sel, nm: Math.round(Wm.nm), tarn: Wm.tarnT > 0.5 }),
        set: (s, live) => {
          Wm.sel = clamp(Math.round(Number(s?.sel)), -1, 4)
          if (!Number.isFinite(Wm.sel)) Wm.sel = -1
          Wm.nm = clamp(Number(s?.nm) || 550, 250, 1000)
          Wm.tarnT = s?.tarn ? 1 : 0
          if (!live) {
            Wm.tarn = Wm.tarnT
            Wm.k = Wm.sel >= 0 ? 1 : 0
            if (Wm.sel >= 0) Wm.head = MX(Wm.sel)
          }
        },
      },
      silver: {
        get: () => ({ acid: F.acid, red: F.red, ag: F.ag, m: Math.round(F.mT * 100) / 100, cube: F.cube }),
        set: (s, live) => {
          F.acid = !!s?.acid
          F.red = !!s?.red
          F.ag = !!s?.ag
          F.mT = clamp(Number(s?.m) || 0, 0, MINUTES)
          F.cube = !!s?.cube
          if (!live) {
            F.m = F.mT
            F.oldK = F.acid ? 0 : 1
            F.cubeK = F.cube ? 1 : 0
            F.wet = F.acid || F.red || F.ag ? 1 : 0
            F.done = F.m >= MINUTES - 0.02
          }
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      stage.update(t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
