// Germanium's picture "How do satellites catch sunlight?" as a room (docs/knowledge/picture-rooms.md): a
// satellite clean room (the cleanroom stage), three benches, each worked by touching its things; E opens the
// station's panel, whose sliders and buttons do the same:
// - the sun simulator: tap the satellite (its wing unfolds panel by panel), the big lamp (it lights), the
//   filter wheel (full sunshine, blue, red, infrared) or slide the lamp's brightness. A board of four bars
//   shows the current each of the three layers would make and the whole cell's, which is the smallest of
//   the three (they are in series): one colour alone leaves a layer dark and the cell stops;
// - the sandwich: a cell cut open, three layers (GaInP, GaInAs, germanium) like floors. Slide the colour of
//   the light (300 to 1900 nm): the beam stops in the first layer whose gap it beats, a spark and a freed
//   electron there, the extra energy as rising warmth; beyond 1800 nm it goes through. Tap a layer for its
//   story; tap the join and a lens shows the atoms of the two crystals (germanium fits like a zipper),
//   tap the lens and silicon is put underneath (it does not fit);
// - how far from the Sun: a model solar system on a bench, a little satellite on a rail. Slide the distance
//   or tap a planet: the meter shows the sunlight (1361 W/m2 at 1 AU, falling as 1/d2) and an example wing's
//   power; a pyramid of light widens; tap Mars and a model rover of Spirit and Opportunity's kind appears.
// All three are shared in a room (src/net/shared.js). parts.<station>.tap(...) and parts.tap(name) do what a
// tap does, for the probes; parts.rayTo(point) aims a real tap.
//
// Facts (checked 2026-11-09): the cell's layers, gaps (1.9, 1.4, 0.67 eV), cut-offs (650, 890, 1800 nm) and
// lattice constants (GaAs 0.56533, Ge 0.56579, Si 0.54310 nm) are the board's own (src/content/boards/Ge.js);
// E = 1239.84 / lambda(nm) eV; the solar constant 1361 W/m2 at 1 AU (149.6 million km), the inverse square
// law: Venus 0.723 AU 2604, Mars 1.524 AU 586, Jupiter 5.203 AU 50 W/m2; the example wing's 10 m2 and
// efficiency 0.30 are illustrative; the currents (15.5 mA/cm2 for the top two layers, 22 for germanium, 2.6 V:
// 15.5 x 2.6 / 136.1 = 29.6%) are illustrative round numbers in that spirit, flagged on the screens' panel
// (the germanium junction makes more current than the top two, so it never limits: true of the
// GaInP/GaInAs/Ge design); Spirit and Opportunity landed in January 2004 on GaInP2/GaAs/Ge arrays (NASA MER
// press kit: up to about 140 W for about four hours a sol at the start), Opportunity's last contact was in
// June 2018 (planned for 90 sols); Mars's irradiance 490 to 715 W/m2 over its year (NASA fact sheet range).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, num, standingScreen, screen } from '../../../wings/noble/kit.js'
import { cleanroomStage } from '../../stages/cleanroom.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { SPACE_WORDS } from './space.words.js'

export const WORDS = SPACE_WORDS

const TAU = Math.PI * 2
const WHITE = new THREE.Color('#ffffff')
const DULL = new THREE.Color('#8a3a2a')
const SPARK = new THREE.Color('#fff0b8')
const FILTERS = ['all', 'blue', 'red', 'ir']
const BASE = [15.5, 15.5, 22] // mA/cm2 each layer would make in full sunshine (illustrative)
const SHARE = { all: [1, 1, 1], blue: [0.55, 0, 0], red: [0, 0.6, 0], ir: [0, 0, 0.55] }
const VOLTS = 2.6
const AM0 = 136.1 // mW/cm2
const GAPS = { top: 1.9, mid: 1.4, ge: 0.67 }
const S0 = 1361 // W/m2 at 1 AU
const PLANETS = { venus: 0.723, earth: 1, mars: 1.524, jupiter: 5.203 }

/** A number in groups of three digits (a space in the decimal-comma languages). */
const grp = (v, lang) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ')

/** An invisible box the tap ray still hits (thin things need one). */
const hitBox = (w, h, d, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  return m
}
const hitSphere = (r, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  return m
}

/** The colour of light of that wavelength (nm); ultraviolet and infrared get a colour of their own. */
function wavelengthColor(nm) {
  const w = clamp(nm, 380, 750)
  let r = 0
  let g = 0
  let b = 0
  if (w < 440) [r, g, b] = [-(w - 440) / 60, 0, 1]
  else if (w < 490) [r, g, b] = [0, (w - 440) / 50, 1]
  else if (w < 510) [r, g, b] = [0, 1, -(w - 510) / 20]
  else if (w < 580) [r, g, b] = [(w - 510) / 70, 1, 0]
  else if (w < 645) [r, g, b] = [1, -(w - 645) / 65, 0]
  else [r, g, b] = [1, 0, 0]
  const f = w < 420 ? 0.5 + (0.5 * (w - 380)) / 40 : w > 700 ? 0.5 + (0.5 * (750 - w)) / 50 : 1
  return new THREE.Color(r * f, g * f, b * f)
}
const colourKey = nm => (nm < 380 ? 'uv' : nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : nm < 750 ? 'red' : 'ir')
const layerOf = nm => (nm < 650 ? 'top' : nm < 890 ? 'mid' : nm <= 1800 ? 'ge' : 'through')

/** Draws a ball with a highlight (an atom). */
function atom(g, x, y, r, c, hi = 'rgba(255,255,255,0.6)') {
  g.fillStyle = c
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fill()
  g.fillStyle = hi
  g.beginPath()
  g.arc(x - r * 0.3, y - r * 0.3, r * 0.38, 0, TAU)
  g.fill()
}

/** A mars-rover-like model, about 0.32 m long (a Spirit or Opportunity of the same family). */
function roverModel(mats) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.07, 0.2, 2, 0.01), mats.foil)
  body.position.y = 0.11
  g.add(body)
  const deckMat = new THREE.MeshStandardMaterial({ color: '#1a2a63', roughness: 0.4, metalness: 0.3 })
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.2), deckMat)
  deck.position.y = 0.152
  g.add(deck)
  for (const s of [-1, 1]) {
    for (const z of [-0.09, 0, 0.09]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 14), mats.dark)
      w.rotation.z = Math.PI / 2
      w.position.set(s * 0.115, 0.03, z)
      g.add(w)
    }
    const rocker = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.22), mats.steel)
    rocker.position.set(s * 0.098, 0.06, 0)
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.06, 0.012), mats.steel)
    strut.position.set(s * 0.098, 0.085, 0)
    g.add(rocker, strut)
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8), mats.steel)
  mast.position.set(0.05, 0.23, -0.07)
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.03, 0.03, 2, 0.008), mats.dark)
  head.position.set(0.05, 0.31, -0.07)
  g.add(mast, head)
  return g
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, lang, color, clickable }) {
  const X0 = -10
  const X1 = 10
  const Z0 = -9
  const Z1 = 8
  const stage = cleanroomStage({ x0: X0, x1: X1, z0: Z0, z1: Z1, h: 7, light })
  root.add(stage.group)
  stage.signs.set(E.signs)
  const solids = stage.solids
  const mats = stage.mats
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const tex = t => (textures.push(t), t)
  const geos = []
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
  const glow = tex(glowTexture(128))
  const font = '700 22px Outfit, Nunito, sans-serif'
  const fontSmall = '600 17px Outfit, Nunito, sans-serif'
  const worldAt = (g, x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))

  // =================================================================================================
  // the sun simulator
  // =================================================================================================
  const C1 = { x: -6.2, z: -3.2 }
  const g1 = new THREE.Group()
  g1.position.set(C1.x, 0, C1.z)
  root.add(g1)
  const N = 4
  const PW = 0.75
  const PH = 1.4
  const HINGE = { x: -1.3, y: 1.3 }
  const B1 = { open: false, lamp: false, f: 0, b: 1, tried: false, openK: 0, lampK: 0, wheel: 0, cur: [0, 0, 0], cell: 0, said: 1 }

  // the satellite on its cradle
  const sat = new THREE.Group()
  sat.position.set(-1.8, 0, 0)
  g1.add(sat)
  {
    for (const z of [-0.45, 0.45]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.78, 0.1), mats.steel)
      leg.position.set(0, 0.39, z)
      const foot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.2), mats.dark)
      foot.position.set(0, 0.035, z)
      sat.add(leg, foot)
    }
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.0, 1.0, 1.2, 3, 0.05), mats.foil)
    body.position.y = 1.4
    sat.add(body)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.14, 1.22), mats.dark)
    strip.position.y = 1.0
    sat.add(strip)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), mats.steel)
    mast.position.set(0.15, 2.1, 0)
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.03, 0.1, 22), mats.plastic)
    dish.position.set(0.15, 2.36, 0)
    dish.rotation.z = -0.35
    sat.add(mast, dish)
    // the thin red tag every spacecraft carries until the day it flies
    const tag = new THREE.Group()
    const tagPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.09), new THREE.MeshStandardMaterial({ color: '#a8281f', roughness: 0.8, side: THREE.DoubleSide }))
    const tagText = makeText(E.signs.flight, { size: 0.03, color: '#f2e8e0', maxWidth: 0.36 })
    tagText.position.z = 0.003
    tag.add(tagPlate, tagText)
    tag.position.set(-0.18, 0.88, 0.62)
    tag.rotation.x = -0.05
    sat.add(tag)
    sat.add(hitBox(1.1, 1.2, 1.3, 0, 1.4, 0))
  }
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: '#33dd77' }))
  led.position.set(0.3, 1.62, 0.61)
  sat.add(led)

  // the wing: four panels folded against the satellite's side, unfolding outwards
  const cellTex = tex(canvasTex(96, 180, (g, w, h) => {
    g.fillStyle = '#0f1740'
    g.fillRect(0, 0, w, h)
    const cw = w / 4
    const ch = h / 8
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const grd = g.createLinearGradient(i * cw, j * ch, (i + 1) * cw, (j + 1) * ch)
        grd.addColorStop(0, '#26337a')
        grd.addColorStop(1, '#141c52')
        g.fillStyle = grd
        g.fillRect(i * cw + 2, j * ch + 2, cw - 4, ch - 4)
        g.fillStyle = 'rgba(150,170,230,0.25)'
        for (let k = 1; k < 4; k++) g.fillRect(i * cw + 2 + (k * (cw - 4)) / 4, j * ch + 2, 1, ch - 4)
      }
    }
  }))
  const cellFront = new THREE.MeshStandardMaterial({ map: cellTex, emissiveMap: cellTex, emissive: '#8fb0ff', emissiveIntensity: 0, roughness: 0.35, metalness: 0.3 })
  const wing = new THREE.Group()
  wing.position.set(HINGE.x, HINGE.y, 0)
  g1.add(wing)
  const panels = []
  for (let k = 0; k < N; k++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, 0.03), [mats.steel, mats.steel, mats.steel, mats.steel, cellFront, mats.plastic])
    wing.add(m)
    panels.push(m)
  }
  const wingHit = hitBox(N * PW, PH, 0.2, (N * PW) / 2, PH / 2, 0)
  wing.add(wingHit)
  const poseWing = K => {
    wing.rotation.x = -0.6 * ease(K)
    for (let k = 0; k < N; k++) {
      const s = N - 1 - k // the outermost leaves first
      const p = ease(clamp(K * (N + 1) - s))
      panels[k].position.set(lerp(0.05 + k * 0.05, (k + 0.5) * PW, p), PH / 2, 0)
      panels[k].rotation.y = lerp(Math.PI / 2, 0, p)
    }
    wingHit.scale.x = Math.max(0.05, ease(K))
    wingHit.position.x = (N * PW * wingHit.scale.x) / 2
  }

  // the big lamp, hung from the ceiling, its filter wheel in front of the lens
  const WHEEL_Z = 1.05 // the filter wheel hangs this far in front of the lamp, in the beam
  const lampPos = new THREE.Vector3(0.2, 3.0, 1.45)
  const wingMid = new THREE.Vector3(0.45, 1.9, -0.45)
  const lamp = new THREE.Group()
  lamp.position.copy(lampPos)
  g1.add(lamp)
  const lampLight = light ? null : new THREE.PointLight('#ffe6b8', 0, 9, 2)
  {
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.7, 28).rotateX(Math.PI / 2), mats.steel)
    const rimR = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.04, 8, 28), mats.dark)
    rimR.position.z = 0.35
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.3, 14).rotateX(Math.PI / 2), mats.dark)
    back.position.z = -0.5
    lamp.add(housing, rimR, back)
    for (const sx of [-1, 1]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 7 - lampPos.y, 6), mats.dark)
      cable.position.set(sx * 0.3, (7 - lampPos.y) / 2, -0.1)
      lamp.add(cable)
    }
    if (lampLight) {
      lampLight.position.set(0, 0, 0.6)
      lamp.add(lampLight)
    }
  }
  const lensMat = new THREE.MeshStandardMaterial({ color: '#3a3224', emissive: '#ffe6b0', emissiveIntensity: 0, roughness: 0.3 })
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.32, 28), lensMat)
  lens.position.z = 0.361
  lamp.add(lens)
  const wheel = new THREE.Group()
  wheel.position.set(0, -0.22, WHEEL_Z)
  lamp.add(wheel)
  const WIN = [
    { c: '#ffe7b0', o: 0.55 },
    { c: '#3f6bff', o: 0.7 },
    { c: '#ff3328', o: 0.7 },
    { c: '#1a0808', o: 0.95 },
  ]
  const winMats = WIN.map(w => new THREE.MeshStandardMaterial({ color: w.c, emissive: w.c, emissiveIntensity: 0, transparent: true, opacity: w.o, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false }))
  {
    // a disc with four round holes, a coloured filter in each
    const shape = new THREE.Shape()
    shape.absarc(0, 0, 0.42, 0, TAU, false)
    WIN.forEach((w, k) => {
      const a = Math.PI / 2 + (k * Math.PI) / 2
      const hole = new THREE.Path()
      hole.absarc(Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0.15, 0, TAU, true)
      shape.holes.push(hole)
    })
    const discGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false, curveSegments: 28 }).translate(0, 0, -0.0175)
    geos.push(discGeo)
    wheel.add(new THREE.Mesh(discGeo, mats.dark))
    WIN.forEach((w, k) => {
      const a = Math.PI / 2 + (k * Math.PI) / 2
      const win = new THREE.Mesh(new THREE.CircleGeometry(0.15, 22), winMats[k])
      win.position.set(Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.016, 8, 22), mats.steel)
      ring.position.copy(win.position)
      wheel.add(win, ring)
    })
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 10).rotateX(Math.PI / 2), mats.steel)
    hub.position.z = 0.03
    wheel.add(hub)
    wheel.add(hitSphere(0.46, 0, 0, 0))
    for (const sx of [-1, 1]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, WHEEL_Z - 0.3, 6).rotateX(Math.PI / 2), mats.steel)
      rod.position.set(sx * 0.42, -0.22, (WHEEL_Z + 0.3) / 2)
      lamp.add(rod)
    }
  }
  // aim the lamp at the wing (lookAt works in the world: the lamp's parent is not turned)
  lamp.lookAt(C1.x + wingMid.x, wingMid.y, C1.z + wingMid.z)
  // the beam: a soft cone from the window to the wing
  const beamLen = lampPos.clone().sub(wingMid).length() - WHEEL_Z - 0.1
  const beamMat = new THREE.MeshBasicMaterial({ color: '#ffe9b0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const beamGeo = new THREE.CylinderGeometry(0.75, 0.15, beamLen, 28, 1, true).rotateX(Math.PI / 2).translate(0, 0, beamLen / 2)
  const beamAMat = beamMat.clone()
  const beamAGeo = new THREE.CylinderGeometry(0.15, 0.3, WHEEL_Z - 0.36, 24, 1, true).rotateX(Math.PI / 2).translate(0, 0, (WHEEL_Z - 0.36) / 2)
  geos.push(beamGeo, beamAGeo)
  const beam1 = new THREE.Mesh(beamGeo, beamMat)
  beam1.position.set(0, 0, WHEEL_Z)
  const beam1A = new THREE.Mesh(beamAGeo, beamAMat)
  beam1A.position.set(0, 0, 0.36)
  beam1.raycast = beam1A.raycast = () => {}
  lamp.add(beam1, beam1A)
  const BEAM_COLORS = ['#ffe9b0', '#4d79ff', '#ff4034', '#5a1414']
  const EMIT_COLORS = ['#a8c0ff', '#4d79ff', '#ff6a5a', '#5a2222']

  // the board of bars
  const board1 = standingScreen({ width: 1.5, height: 1.1, color, title: E.sim.screen, line: '', titleSize: 0.1, lineSize: 0.056 }, { top: 0.85, tilt: 0.38, mat: mats.dark })
  board1.group.position.set(0.75, 0, 1.25)
  board1.group.rotation.y = -0.12
  g1.add(board1.group)
  const barTex = tex(canvasTex(512, 300, null, { mipmaps: false }))
  const barPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.7), new THREE.MeshBasicMaterial({ map: barTex, toneMapped: false }))
  barPlane.position.set(0, -0.2, 0.003)
  board1.content.add(barPlane)
  let barKey = ''
  const BAR_COL = ['#8a6bff', '#d9693c', '#6fa4a0', '#ffc93a']
  const drawBars = (vals, cell, lit) => {
    const key = [...vals, cell, lit].map(v => (typeof v === 'number' ? v.toFixed(1) : v)).join('|')
    if (key === barKey) return
    barKey = key
    barTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0f1a4a'
      g.fillRect(0, 0, w, h)
      const base = 230
      const k = 190 / 24
      g.font = fontSmall
      g.fillStyle = '#9fb4ff'
      g.textAlign = 'left'
      g.fillText(E.sim.unit, 14, 22)
      g.strokeStyle = 'rgba(160,180,255,0.25)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(10, base)
      g.lineTo(w - 10, base)
      g.stroke()
      const names = [E.sim.bars.top, E.sim.bars.mid, E.sim.bars.ge, E.sim.bars.cell]
      const all = [...vals, cell]
      all.forEach((v, i) => {
        const x = 34 + i * 118
        const bh = Math.max(2, v * k)
        g.fillStyle = BAR_COL[i]
        g.fillRect(x, base - bh, 84, bh)
        g.fillStyle = 'rgba(255,255,255,0.18)'
        g.fillRect(x, base - bh, 8, bh)
        g.font = font
        g.textAlign = 'center'
        g.fillStyle = '#e8eeff'
        g.fillText(num(v, 1, lang), x + 42, base - bh - 8)
        g.font = fontSmall
        g.fillStyle = '#c4d0ff'
        g.fillText(names[i], x + 42, base + 28)
      })
      // the chain: the cell makes only the smallest of the three
      if (lit) {
        const y = base - Math.min(...vals) * k
        g.strokeStyle = '#ffc93a'
        g.setLineDash([8, 6])
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(26, y)
        g.lineTo(34 + 3 * 118 + 84, y)
        g.stroke()
        g.setLineDash([])
      }
    })
  }
  const filterName = () => E.sim.filters[FILTERS[B1.f]]
  // the currents the layers would make: with the lamp's and the wing's own motion (`anim`) or at rest
  const curNow = (anim = true) => {
    const lit = anim ? B1.lampK * ease(B1.openLin ?? 0) : B1.lamp && B1.open ? 1 : 0
    const sh = SHARE[FILTERS[B1.f]]
    return BASE.map((b, i) => b * sh[i] * lit * B1.b)
  }
  const cellOf = c => Math.min(...c)
  const lines1 = () => {
    if (!B1.lamp) return at(E.sim.reading.dark, level())
    if (!B1.open) return at(E.sim.reading.folded, level())
    const cell = cellOf(curNow())
    const head = `${filterName()}`
    if (cell < 0.4) return `${head}\n${at(E.sim.reading.stuck, level())}`
    return `${head}\n${fill(at(E.sim.reading.run, level()), { p: num(((cell * VOLTS) / AM0) * 100 / B1.b, 0, lang) })}`
  }
  const simHint = () => {
    const H = E.sim.hints
    if (!B1.open) return H.sat
    if (!B1.lamp) return H.lamp
    if (!B1.tried) return H.wheel
    return B1.f !== 0 ? H.more : H.done
  }
  const simPanel = lv => ({
    title: E.sim.title,
    color,
    blocks: [
      ...paras(E.sim.panel[depth(lv)]),
      { p: E.sim.tip },
      {
        slider: {
          label: E.sim.brightness,
          min: 5,
          max: 100,
          step: 5,
          value: Math.round(B1.b * 100),
          onInput: v => {
            B1.b = v / 100
            shareSoon('sim')
            settleSay('sim', () => say(fill(at(E.sim.says.bright, level()), { b: Math.round(B1.b * 100) })))
          },
          format: v => `${Math.round(v)}%`,
          live: () => B1.b * 100,
        },
      },
      {
        buttons: [
          { label: E.sim.buttons.sat, onClick: () => tapSat() },
          { label: E.sim.buttons.lamp, onClick: () => tapLamp() },
          { label: E.sim.buttons.wheel, onClick: () => tapWheel() },
        ],
      },
    ],
  })
  const sayFilter = () => {
    if (!B1.lamp) return
    if (!B1.open) return say(at(E.sim.says.noWing, level()))
    say(at(E.sim.says[FILTERS[B1.f]], level()))
  }
  const tapSat = () => {
    B1.open = !B1.open
    play('tap')
    say(at(B1.open ? E.sim.says.unfold : E.sim.says.fold, level()))
    if (B1.open && B1.lamp) later(2.4, sayFilter)
    share('sim')
  }
  const tapLamp = () => {
    B1.lamp = !B1.lamp
    play('select')
    if (B1.lamp) {
      say(at(B1.open ? E.sim.says.lampOn : E.sim.says.noWing, level()))
      if (B1.open) later(3.2, sayFilter)
    } else say(at(E.sim.says.lampOff, level()))
    share('sim')
  }
  const tapWheel = () => {
    B1.f = (B1.f + 1) % FILTERS.length
    play('select')
    sayFilter()
    if (B1.lamp && B1.open) {
      B1.tried = true
      findOnce('sim', simPanel, 3)
    }
    share('sim')
    refresh(simPanel)
  }
  ex.add({
    id: 'sim',
    x: C1.x + 0.6,
    z: C1.z + 3.1,
    radius: 2.6,
    label: E.sim.label,
    verb: simHint,
    manual: true,
    screens: [board1],
    focus: { x: C1.x - 0.3, y: 1.45, z: C1.z - 0.1, size: 4.4, width: 4.4 },
    act: () => ctx.showPanel(simPanel),
  })
  clickable(sat, tapSat, { reach: 6.5 })
  clickable(wingHit, tapSat, { reach: 6.5 })
  clickable(wheel, tapWheel, { reach: 7 })
  clickable(lamp, tapLamp, { reach: 7, accept: h => !wheel.children.includes(h.object) && h.object.parent !== wheel })
  solids.push(box(C1.x - 1.8, C1.z, 1.1, 1.3), circle(C1.x + 0.75, C1.z + 1.25, 0.3))

  let barWait = 0
  const winColor = new THREE.Color()
  updates.push((dt, t) => {
    // the wing opens over about three seconds: a linear walk, eased inside poseWing
    B1.openLin = clamp((B1.openLin ?? 0) + (B1.open ? dt : -dt) / 3.4)
    poseWing(B1.openLin)
    B1.lampK = damp(B1.lampK, B1.lamp ? 1 : 0, 3, dt)
    B1.wheel = damp(B1.wheel, B1.f, 5, dt)
    wheel.rotation.z = -B1.wheel * (Math.PI / 2)
    const lit = B1.lampK * ease(B1.openLin)
    lensMat.emissiveIntensity = 0.9 * B1.lampK
    for (let k = 0; k < 4; k++) winMats[k].emissiveIntensity = 0.55 * B1.lampK * clamp(1 - Math.abs(B1.wheel - k) * 1.2)
    beamMat.opacity = 0.17 * B1.lampK * (0.35 + 0.65 * B1.b) * (FILTERS[B1.f] === 'ir' ? 0.45 : 1)
    beamMat.color.set(BEAM_COLORS[B1.f])
    beam1.visible = beam1A.visible = B1.lampK > 0.02
    beamAMat.opacity = 0.17 * B1.lampK * (0.35 + 0.65 * B1.b)
    if (lampLight) lampLight.intensity = 5 * B1.lampK * (0.3 + 0.7 * B1.b)
    // the wing's cells glow a little in the light that suits them
    cellFront.emissive.set(EMIT_COLORS[B1.f])
    cellFront.emissiveIntensity = 0.55 * lit * (0.3 + 0.7 * B1.b) * (B1.f === 3 ? 0.4 : 1)
    // the currents the layers make, and the cell's
    const target = curNow()
    for (let i = 0; i < 3; i++) B1.cur[i] = damp(B1.cur[i], target[i], 5, dt)
    B1.cell = damp(B1.cell, cellOf(target), 5, dt)
    led.material.color.set(B1.cell > 0.6 ? '#33dd77' : B1.lamp ? '#dd4433' : '#2a3a2e')
    barWait -= dt
    if (barWait <= 0) {
      barWait = 0.1
      drawBars(B1.cur, B1.cell, B1.lamp && B1.open)
      board1.set({ line: lines1() })
    }
  })

  // =================================================================================================
  // the sandwich
  // =================================================================================================
  const C2 = { x: 0.5, z: -3.4 }
  const g2 = new THREE.Group()
  g2.position.set(C2.x, 0, C2.z)
  root.add(g2)
  const S2 = { nm: 520, lens: 'off', lensK: 0, tappedLayer: false, slid: false, siTried: false, layerIx: 0 }
  const CW = 2.2 // the cell block's width (x) and depth (z)
  const CD = 0.9
  const FRONT = CD / 2
  const LAYERS = [
    { id: 'ge', y0: 0.42, y1: 1.22, base: '#4f6f6d', dot: '#8fc7c1', r: 9, rows: 4 },
    { id: 'mid', y0: 1.25, y1: 1.65, base: '#7e4128', dot: '#d9825a', r: 6, rows: 2 },
    { id: 'top', y0: 1.68, y1: 1.98, base: '#5b45b0', dot: '#a99bff', r: 5, rows: 2 },
  ]
  const FORMULA = { top: 'GaInP', mid: 'GaInAs', ge: 'Ge' }
  const layerMesh = {}
  const layerGlow = {}
  // the plinth and the metal back
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(CW + 0.2, 0.3, CD + 0.2, 2, 0.03), mats.dark)
    plinth.position.y = 0.15
    const backC = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.12, CD), new THREE.MeshStandardMaterial({ color: '#b08a3e', roughness: 0.35, metalness: 0.7 }))
    backC.position.y = 0.36
    g2.add(plinth, backC)
    const jm = new THREE.MeshStandardMaterial({ color: '#c8cdd4', roughness: 0.3, metalness: 0.6 })
    for (const y of [1.235, 1.665]) {
      const tj = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.035, CD), jm)
      tj.position.y = y
      g2.add(tj)
    }
  }
  const PXM = 200
  for (const L of LAYERS) {
    const hgt = L.y1 - L.y0
    const ft = tex(canvasTex(Math.round(CW * PXM), Math.round(hgt * PXM), (g, w, h) => {
      g.fillStyle = L.base
      g.fillRect(0, 0, w, h)
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, 'rgba(255,255,255,0.12)')
      grd.addColorStop(1, 'rgba(0,0,0,0.18)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      const sp = h / L.rows
      for (let j = 0; j < L.rows; j++) {
        for (let x = (j % 2) * (sp / 2) + sp / 2; x < w; x += sp * 1.1) atom(g, x, sp * (j + 0.5), L.r * (w / (CW * PXM)), L.dot, 'rgba(255,255,255,0.4)')
      }
      // the label on its left, on a dark pill
      const txt = `${E.sandwich.names[L.id]}`
      const sub = `${FORMULA[L.id]}, ${num(GAPS[L.id], GAPS[L.id] === 0.67 ? 2 : 1, lang)} eV`
      const fs = Math.min(21, h * 0.3)
      g.font = `700 ${fs}px Outfit, Nunito, sans-serif`
      const tw = Math.max(g.measureText(txt).width, g.measureText(sub).width) + 26
      g.fillStyle = 'rgba(10,14,34,0.72)'
      g.beginPath()
      g.roundRect(10, h / 2 - fs * 1.15, tw, fs * 2.3, 10)
      g.fill()
      g.fillStyle = '#f2f5ff'
      g.textAlign = 'left'
      g.fillText(txt, 22, h / 2 - fs * 0.12)
      g.font = `600 ${fs * 0.82}px Outfit, Nunito, sans-serif`
      g.fillStyle = '#cdd8ff'
      g.fillText(sub, 22, h / 2 + fs * 0.92)
    }, { mipmaps: false }))
    const sideMat = new THREE.MeshStandardMaterial({ color: L.base, roughness: 0.55, emissive: L.dot, emissiveIntensity: 0 })
    const faceMat = new THREE.MeshStandardMaterial({ map: ft, roughness: 0.5, emissive: L.dot, emissiveMap: ft, emissiveIntensity: 0 })
    const m = new THREE.Mesh(new THREE.BoxGeometry(CW, hgt, CD), [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat])
    m.position.y = (L.y0 + L.y1) / 2
    g2.add(m)
    layerMesh[L.id] = m
    layerGlow[L.id] = [sideMat, faceMat]
  }
  // the top: a thin glass cover and silver contact fingers
  {
    const cover = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.05, CD), new THREE.MeshStandardMaterial({ color: '#5a7ac0', transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.2 }))
    cover.position.y = 2.005
    g2.add(cover)
    for (let i = -4; i <= 4; i++) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, CD), mats.steel)
      f.position.set(i * 0.3, 2.04, 0)
      g2.add(f)
    }
  }
  // the join between the middle layer and the germanium, glowing until it is looked at
  const joinMat = new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffc93a', emissiveIntensity: 0.6, roughness: 0.4 })
  const joinLine = new THREE.Mesh(new THREE.BoxGeometry(CW + 0.02, 0.025, 0.02), joinMat)
  joinLine.position.set(0, 1.235, FRONT + 0.012)
  g2.add(joinLine)
  const joinHit = hitBox(CW, 0.16, 0.14, 0, 1.235, FRONT + 0.04)
  g2.add(joinHit)

  // the lens on its stand, in front of the join
  const LENS = { x: 0.7, y: 1.25, z: FRONT + 0.55 }
  const lensG = new THREE.Group()
  lensG.position.set(LENS.x, 0, LENS.z)
  g2.add(lensG)
  const lensTex = tex(canvasTex(512, 512, null, { mipmaps: false }))
  let lensDrawn = ''
  const drawLens = mode => {
    if (mode === lensDrawn || mode === 'off') return
    lensDrawn = mode
    lensTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.save()
      g.beginPath()
      g.arc(w / 2, h / 2, w / 2 - 4, 0, TAU)
      g.clip()
      g.fillStyle = '#0b1424'
      g.fillRect(0, 0, w, h)
      const si = mode === 'si'
      const cols = 25
      const S = 19
      const ratio = si ? 0.5431 / 0.56533 : 0.56579 / 0.56533
      const yTop = 188
      const yBot = 318
      g.lineWidth = 3
      for (let i = 0; i < cols; i++) {
        const xt = w / 2 + (i - 12) * S
        const xb = w / 2 + (i - 12) * S * ratio
        const off = Math.abs(xb - xt)
        const broken = off > 0.3 * S
        g.strokeStyle = broken ? '#ff5a4a' : '#8fe0a8'
        g.setLineDash(broken ? [4, 6] : [])
        g.beginPath()
        g.moveTo(xt, yTop + 10)
        g.lineTo(xb, yBot - 10)
        g.stroke()
      }
      g.setLineDash([])
      for (let i = 0; i < cols; i++) {
        const xt = w / 2 + (i - 12) * S
        atom(g, xt, yTop, 8, i % 2 ? '#a070d8' : '#e0a040')
        const xb = w / 2 + (i - 12) * S * ratio
        atom(g, xb, yBot, 8 * (si ? 0.9 : 1), si ? '#97a6c4' : '#6fa4a0')
      }
      g.font = '700 28px Outfit, Nunito, sans-serif'
      g.textAlign = 'center'
      g.fillStyle = '#d6c8ff'
      g.fillText('GaAs  0.5653 nm', w / 2, 100)
      g.fillStyle = si ? '#c9d4ee' : '#a9ddd6'
      g.fillText(si ? 'Si  0.5431 nm' : 'Ge  0.5658 nm', w / 2, 400)
      const verdict = si ? E.sandwich.lensFit.bad : E.sandwich.lensFit.ok
      let vs = 26
      g.font = `700 ${vs}px Outfit, Nunito, sans-serif`
      while (g.measureText(verdict).width > 330 && vs > 14) {
        vs -= 1
        g.font = `700 ${vs}px Outfit, Nunito, sans-serif`
      }
      g.fillStyle = si ? '#ff8a7a' : '#8fe0a8'
      g.fillText(verdict, w / 2, 444)
      g.restore()
    })
  }
  const lensDisc = new THREE.Mesh(new THREE.CircleGeometry(0.44, 40), new THREE.MeshBasicMaterial({ map: lensTex, transparent: true, toneMapped: false, side: THREE.DoubleSide }))
  lensDisc.position.set(0, LENS.y, 0)
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.032, 10, 40), mats.steel)
  lensRim.position.copy(lensDisc.position)
  const lensPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, LENS.y - 0.46, 10), mats.steel)
  lensPost.position.set(0, (LENS.y - 0.46) / 2, 0)
  const lensFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.04, 20), mats.dark)
  lensFoot.position.y = 0.02
  lensG.add(lensDisc, lensRim, lensPost, lensFoot)
  lensG.rotation.y = -0.18
  const lensHit = new THREE.Group()
  lensHit.add(hitSphere(0.44, LENS.x, LENS.y, LENS.z))
  lensHit.position.set(0, 0, 0)
  g2.add(lensHit)

  // the lamp of the beam, hung from the ceiling, and the beam with its bead, spark, electron and warmth
  const BX = 0.12
  const LAMP_Y = 3.0
  {
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.3, 0.34, 2, 0.04), mats.steel)
    head.position.set(BX, LAMP_Y + 0.16, 0.2)
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.1, 14), mats.dark)
    nozzle.position.set(BX, LAMP_Y - 0.04, 0.2)
    g2.add(head, nozzle)
    for (const sx of [-1, 1]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 7 - LAMP_Y - 0.3, 6), mats.dark)
      cable.position.set(BX + sx * 0.18, LAMP_Y + 0.3 + (7 - LAMP_Y - 0.3) / 2, 0.2)
      g2.add(cable)
    }
  }
  const BZ = FRONT + 0.06
  const beamSolid = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1, 0.055), new THREE.MeshBasicMaterial({ color: '#4d79ff', transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }))
  const dashTex = tex(canvasTex(8, 32, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#fff'
    g.fillRect(0, 0, w, h * 0.5)
  }, { repeat: true, srgb: false }))
  const beamDash = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1, 0.055), new THREE.MeshBasicMaterial({ color: '#c8322e', alphaMap: dashTex, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }))
  g2.add(beamSolid, beamDash)
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9 }))
  g2.add(bead)
  const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#fff0b8', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  g2.add(spark)
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: '#58a8ff' }))
  const electronHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#58a8ff', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
  electronHalo.scale.setScalar(0.22)
  electron.add(electronHalo)
  g2.add(electron)
  const HEAT = 40
  const heatPos = new Float32Array(HEAT * 3)
  const heatGeo = new THREE.BufferGeometry()
  heatGeo.setAttribute('position', new THREE.BufferAttribute(heatPos, 3))
  const heat = new THREE.Points(heatGeo, new THREE.PointsMaterial({ color: '#ff9a4a', size: 0.075, map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }))
  heat.frustumCulled = false
  heat.raycast = () => {}
  g2.add(heat)
  const SPARK_Y = { top: 1.83, mid: 1.45, ge: 0.82, through: 0.45 }
  const reading2 = () => {
    const nm = S2.nm
    const key = layerOf(nm)
    const ev = 1239.84 / nm
    const extra = key === 'through' ? 0 : Math.max(0, ev - GAPS[key])
    return fill(at(E.sandwich.reading[key], level()), { colour: E.colours[colourKey(nm)], nm: Math.round(nm), ev: num(ev, 2, lang), extra: num(extra, 2, lang) })
  }
  const screen2 = standingScreen({ width: 1.2, height: 0.95, color, title: E.sandwich.screen, line: '', titleSize: 0.085, lineSize: 0.064 }, { top: 1.2, tilt: 0.25, mat: mats.dark })
  screen2.group.position.set(-1.8, 0, 0.55)
  screen2.group.rotation.y = 0.4
  g2.add(screen2.group)
  solids.push(box(C2.x, C2.z, CW + 0.3, CD + 0.3), circle(C2.x - 1.8, C2.z + 0.55, 0.3), circle(C2.x + LENS.x, C2.z + LENS.z, 0.28))
  const sandHint = () => {
    const H = E.sandwich.hints
    if (!S2.tappedLayer) return H.layer
    if (S2.lens === 'off' && !S2.siTried) return H.join
    if (S2.lens === 'ge' && !S2.siTried) return H.lens
    if (!S2.slid) return H.slide
    return H.more
  }
  const sandPanel = lv => ({
    title: E.sandwich.title,
    color,
    blocks: [
      ...paras(E.sandwich.panel[depth(lv)]),
      { p: E.sandwich.tip },
      {
        slider: {
          label: E.sandwich.wavelength,
          min: 300,
          max: 1900,
          step: 5,
          value: S2.nm,
          onInput: v => {
            S2.nm = v
            S2.slid = true
            findOnce('sandwich', sandPanel, 3)
            shareSoon('sandwich')
          },
          format: v => {
            const k = layerOf(v)
            return `${Math.round(v)} nm · ${num(1239.84 / v, 2, lang)} eV · ${k === 'through' ? '' : FORMULA[k]}`.replace(/ · $/, '')
          },
          live: () => S2.nm,
        },
      },
      {
        buttons: [
          { label: E.sandwich.buttons.layer, onClick: () => tapLayer() },
          { label: E.sandwich.buttons.join, onClick: () => tapJoin() },
          { label: E.sandwich.buttons.lens, onClick: () => tapLens() },
        ],
      },
    ],
  })
  const LAYER_ORDER = ['top', 'mid', 'ge']
  const tapLayer = id => {
    const k = id ?? LAYER_ORDER[S2.layerIx++ % 3]
    S2.layerFlash = { id: k, t: 1.2 }
    S2.tappedLayer = true
    play('tap')
    say(at(E.sandwich.says[k], level()))
    findOnce('sandwich', sandPanel, 3.5)
  }
  const setLens = mode => {
    S2.lens = mode
    if (mode !== 'off') drawLens(mode)
    share('sandwich')
  }
  const tapJoin = () => {
    play('select')
    if (S2.lens === 'off') {
      setLens('ge')
      say(at(E.sandwich.says.lensOn, level()))
      findOnce('sandwich', sandPanel, 4)
    } else {
      setLens('off')
      say(at(E.sandwich.says.lensOff, level()))
    }
  }
  const tapLens = () => {
    if (S2.lens === 'off') return tapJoin()
    play('select')
    const si = S2.lens === 'ge'
    if (si) S2.siTried = true
    setLens(si ? 'si' : 'ge')
    say(at(si ? E.sandwich.says.si : E.sandwich.says.ge2, level()))
    findOnce('sandwich', sandPanel, 4)
    refresh(sandPanel)
  }
  ex.add({
    id: 'sandwich',
    x: C2.x - 0.3,
    z: C2.z + 3.3,
    radius: 2.5,
    label: E.sandwich.label,
    verb: sandHint,
    manual: true,
    screens: [screen2],
    focus: { x: C2.x - 0.55, y: 1.3, z: C2.z, size: 3.7, width: 3.9 },
    act: () => ctx.showPanel(sandPanel),
  })
  for (const L of LAYERS) clickable(layerMesh[L.id], () => tapLayer(L.id), { reach: 6.5 })
  clickable(joinHit, tapJoin, { reach: 6.5 })
  clickable(lensHit, tapLens, { reach: 6.5, when: () => S2.lens !== 'off' })
  // when the lens is away, its ring still takes a tap (it is the stand's)
  clickable(lensRim, tapJoin, { reach: 6.5, when: () => S2.lens === 'off' })

  let readWait = 0
  let beamShown = -1
  updates.push((dt, t) => {
    S2.lensK = damp(S2.lensK, S2.lens === 'off' ? 0 : 1, 6, dt)
    lensDisc.visible = S2.lensK > 0.02
    lensDisc.scale.setScalar(Math.max(0.01, S2.lensK))
    joinMat.emissiveIntensity = S2.lens === 'off' ? 0.55 + 0.35 * Math.sin(t * 3) : 1.0
    // the beam
    const nm = S2.nm
    const key = layerOf(nm)
    const sy = SPARK_Y[key]
    const visible = nm >= 380 && nm <= 750
    const top = LAMP_Y - 0.1
    const len = top - sy
    const c = nm < 380 ? new THREE.Color('#9a6bff') : nm > 750 ? new THREE.Color('#d0382f') : wavelengthColor(nm).multiplyScalar(1.15)
    for (const b of [beamSolid, beamDash]) {
      b.scale.y = len
      b.position.set(BX, sy + len / 2, BZ)
      b.material.color.copy(c)
    }
    beamSolid.visible = visible
    beamDash.visible = !visible
    if (beamShown !== len) {
      beamShown = len
      dashTex.repeat.set(1, len * 7)
      dashTex.needsUpdate = true
    }
    // a bead of light runs down the beam; each arrival flashes the spark
    const ph = (t * 1.1) % 1
    bead.position.set(BX, top - len * ph, BZ + 0.01)
    bead.material.color.copy(c).lerp(WHITE, 0.35)
    const flash = clamp(1 - ph * 1.6)
    spark.position.set(BX, sy, BZ + 0.05)
    spark.scale.setScalar(0.22 + 0.34 * flash + 0.05 * Math.sin(t * 9))
    spark.material.color.copy(key === 'through' ? DULL : SPARK)
    spark.material.opacity = key === 'through' ? 0.5 : 0.9
    electron.visible = key !== 'through'
    electron.position.set(BX + Math.cos(t * 3.2) * 0.14, sy + 0.06 + Math.sin(t * 3.2) * 0.1, BZ + 0.06)
    // warmth: the energy above the gap, as little orange dots rising off the spark
    const extra = key === 'through' ? 0 : Math.max(0, 1239.84 / nm - GAPS[key])
    const n = key === 'through' ? 6 : Math.min(HEAT, Math.round(3 + extra * 11))
    heatGeo.setDrawRange(0, n)
    for (let i = 0; i < HEAT; i++) {
      const u = (t * 0.45 + i / HEAT) % 1
      heatPos[i * 3] = BX + Math.sin(i * 12.9 + t * 1.3) * 0.09 + Math.sin(u * 8 + i) * 0.04 + (i % 2 ? 0.06 : -0.06) * u * 2
      heatPos[i * 3 + 1] = sy + 0.04 + u * 0.4
      heatPos[i * 3 + 2] = BZ + 0.07
    }
    heatGeo.attributes.position.needsUpdate = true
    heat.material.color.set(key === 'through' ? '#8a4a3a' : '#ff9a4a')
    // a tapped layer glows for a moment
    if (S2.layerFlash) {
      S2.layerFlash.t -= dt
      if (S2.layerFlash.t <= 0) S2.layerFlash = null
    }
    for (const L of LAYERS) {
      const on = S2.layerFlash?.id === L.id ? 0.5 * (0.6 + 0.4 * Math.sin(t * 10)) : key === L.id ? 0.14 + 0.06 * Math.sin(t * 4) : 0
      for (const m of layerGlow[L.id]) m.emissiveIntensity = on
    }
    readWait -= dt
    if (readWait <= 0) {
      readWait = 0.12
      const r = reading2()
      screen2.set({ line: r })
    }
  })

  // =================================================================================================
  // how far from the Sun
  // =================================================================================================
  const AU = 0.55 // metres of rail to the AU
  const SUN = { x: 4.45, y: 1.15, z: -4.8 }
  const TABLE = { x0: 4.05, x1: 7.8, z: -5.1, d: 1.0, top: 0.92 }
  const g3 = new THREE.Group()
  root.add(g3)
  const D = { d: 1, dT: 1, rover: false, roverK: 0, said: 1, tapped: false, slid: false, roverTapped: false }
  const benchMat = new THREE.MeshStandardMaterial({ color: '#4a5866', roughness: 0.55 })
  {
    const w = TABLE.x1 - TABLE.x0
    const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.07, TABLE.d, 2, 0.02), benchMat)
    top.position.set((TABLE.x0 + TABLE.x1) / 2, TABLE.top - 0.035, TABLE.z)
    g3.add(top)
    for (const x of [TABLE.x0 + 0.3, TABLE.x1 - 0.3, (TABLE.x0 + TABLE.x1) / 2]) {
      for (const dz of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, TABLE.top - 0.07, 0.07), mats.steel)
        leg.position.set(x, (TABLE.top - 0.07) / 2, TABLE.z + dz)
        g3.add(leg)
      }
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, 0.025, 0.1), mats.steel)
    rail.position.set((TABLE.x0 + TABLE.x1) / 2, TABLE.top + 0.012, SUN.z)
    g3.add(rail)
    // a ruler of astronomical units along the front edge: a tick at each AU, a longer one every 5
    for (let i = 0; i <= 5; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.004, i % 5 === 0 ? 0.1 : 0.06), mats.yellow)
      tick.position.set(SUN.x + i * AU, TABLE.top + 0.003, TABLE.z + 0.42)
      g3.add(tick)
      const lab = makeText(`${i}`, { size: 0.07, color: '#e8d58a', anchorY: 'top' })
      lab.rotation.x = -Math.PI / 2
      lab.position.set(SUN.x + i * AU, TABLE.top + 0.004, TABLE.z + 0.34)
      g3.add(lab)
    }
    const auLab = makeText('AU', { size: 0.07, color: '#e8d58a', anchorX: 'left', anchorY: 'top' })
    auLab.rotation.x = -Math.PI / 2
    auLab.position.set(SUN.x + 5 * AU + 0.12, TABLE.top + 0.004, TABLE.z + 0.34)
    g3.add(auLab)
    solids.push(box((TABLE.x0 + TABLE.x1) / 2, TABLE.z, w, TABLE.d))
  }
  // the Sun on a stalk, and the planets hung from a bar above
  const sunMat = new THREE.MeshBasicMaterial({ color: '#ffd77a' })
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), sunMat)
  sunBall.position.set(SUN.x, SUN.y, SUN.z)
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffb84a', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
  sunGlow.position.copy(sunBall.position)
  sunGlow.scale.setScalar(1.1)
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, SUN.y - TABLE.top, 8), mats.steel)
  stalk.position.set(SUN.x, TABLE.top + (SUN.y - TABLE.top) / 2, SUN.z)
  g3.add(sunBall, sunGlow, stalk)
  const sunLab = makeText(E.distance.planets.sun, { size: 0.09, color: '#ffe3a0', outlineWidth: 0.012, outlineColor: '#0c1428' })
  sunLab.position.set(SUN.x, SUN.y + 0.36, SUN.z + 0.05)
  g3.add(sunLab)
  const BAR_Y = 2.2
  const barRail = new THREE.Mesh(new THREE.BoxGeometry(TABLE.x1 - TABLE.x0 - 0.4, 0.05, 0.05), mats.steel)
  barRail.position.set((TABLE.x0 + TABLE.x1) / 2 + 0.1, BAR_Y, SUN.z)
  g3.add(barRail)
  const jupTex = tex(canvasTex(64, 64, (g, w, h) => {
    const bands = ['#d8b78a', '#b68a5e', '#e6d3b0', '#a8774e', '#d9bc92', '#b88f66', '#e2cca6', '#c09a70']
    bands.forEach((c, i) => {
      g.fillStyle = c
      g.fillRect(0, (i * h) / bands.length, w, h / bands.length + 1)
    })
  }))
  const PLANET_SPEC = {
    venus: { r: 0.06, c: '#dcbf7c', y: 1.55, lab: 0.14 },
    earth: { r: 0.065, c: '#3a74c4', y: 1.55, lab: 0.32 },
    mars: { r: 0.045, c: '#c1633a', y: 1.55, lab: 0.14 },
    jupiter: { r: 0.2, c: '#ffffff', map: jupTex, y: 1.5, lab: 0.14 },
  }
  const planetObj = {}
  for (const [id, sp] of Object.entries(PLANET_SPEC)) {
    const x = SUN.x + PLANETS[id] * AU
    const grp3 = new THREE.Group()
    grp3.position.set(x, sp.y, SUN.z)
    const ball = new THREE.Mesh(new THREE.SphereGeometry(sp.r, 24, 18), new THREE.MeshStandardMaterial({ color: sp.c, map: sp.map ?? null, roughness: 0.8 }))
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, BAR_Y - sp.y - sp.r, 6), mats.steel)
    rod.position.y = (BAR_Y - sp.y + sp.r) / 2
    const lab = makeText(E.distance.planets[id], { size: 0.085, color: '#e4efff', outlineWidth: 0.012, outlineColor: '#0c1428' })
    lab.position.set(0, BAR_Y - sp.y - sp.lab, 0.03)
    grp3.add(ball, rod, lab, hitSphere(Math.max(0.17, sp.r + 0.06)))
    g3.add(grp3)
    planetObj[id] = grp3
  }
  // Mars has a patch of rust-red ground on the bench's right end, where the rover stands
  const PATCH = { x: SUN.x + PLANETS.mars * AU, z: -3.7 }
  const PL_H = 0.66 // the plinth in front of the bench, so the carriage never hides the rover
  const patchTex = tex(canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#9a5436'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(60,28,16,0.25)' : 'rgba(210,140,90,0.22)'
      g.beginPath()
      g.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 0, TAU)
      g.fill()
    }
  }))
  const patch = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.35, 0.03, 30), new THREE.MeshStandardMaterial({ map: patchTex, roughness: 1 }))
  patch.position.set(PATCH.x, PL_H + 0.015, PATCH.z)
  const plinth3 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, PL_H, 28), benchMat)
  plinth3.position.set(PATCH.x, PL_H / 2, PATCH.z)
  g3.add(patch, plinth3)
  solids.push(circle(PATCH.x, PATCH.z, 0.42))
  const rover = roverModel(mats)
  rover.position.set(PATCH.x, PL_H + 0.03, PATCH.z)
  rover.rotation.y = 0.5
  rover.visible = false
  g3.add(rover)
  const roverLab = makeText(E.distance.rover, { size: 0.075, color: '#f2dcc0', maxWidth: 1.3, outlineWidth: 0.012, outlineColor: '#0c1428' })
  roverLab.position.set(PATCH.x, PL_H + 0.62, PATCH.z + 0.1)
  roverLab.visible = false
  g3.add(roverLab)
  const roverHit = hitBox(0.5, 0.4, 0.5, PATCH.x, PL_H + 0.22, PATCH.z)
  g3.add(roverHit)

  // the little satellite on its carriage, and the pyramid of light that widens with the distance
  const carriage = new THREE.Group()
  g3.add(carriage)
  {
    const car = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.05, 0.2, 2, 0.01), mats.dark)
    car.position.y = TABLE.top + 0.045
    const wheels = [-0.1, 0.1].flatMap(x => [-1, 1].map(s => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 10), mats.steel)
      w.rotation.x = Math.PI / 2
      w.position.set(x, TABLE.top + 0.025, s * 0.1)
      return w
    }))
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.12, 0.12, 2, 0.01), mats.foil)
    body.position.set(0.04, TABLE.top + 0.13, 0)
    // cells face the Sun (-x): the material of the -x face is index 1
    const cellsM = new THREE.MeshStandardMaterial({ map: cellTex, roughness: 0.4, metalness: 0.3 })
    const wingP = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.28, 0.28), [mats.steel, cellsM, mats.steel, mats.steel, mats.steel, mats.steel])
    wingP.position.set(-0.04, SUN.y, 0)
    const mastW = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, SUN.y - TABLE.top - 0.07, 6), mats.steel)
    mastW.position.set(-0.04, TABLE.top + 0.07 + (SUN.y - TABLE.top - 0.07) / 2, 0)
    carriage.add(car, body, wingP, mastW, ...wheels)
    carriage.add(hitBox(0.36, 0.5, 0.34, 0, SUN.y - 0.1, 0))
  }
  const pyrPos = new Float32Array(5 * 3)
  const pyrGeo = new THREE.BufferGeometry()
  pyrGeo.setAttribute('position', new THREE.BufferAttribute(pyrPos, 3))
  pyrGeo.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1])
  const pyrMat = new THREE.MeshBasicMaterial({ color: '#ffd77a', transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const pyr = new THREE.Mesh(pyrGeo, pyrMat)
  pyr.frustumCulled = false
  pyr.raycast = () => {}
  const edgeIdx = [0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 2, 3, 3, 4, 4, 1]
  const edgeGeo = new THREE.BufferGeometry()
  edgeGeo.setAttribute('position', pyrGeo.attributes.position)
  edgeGeo.setIndex(edgeIdx)
  const pyrEdges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: '#ffd77a', transparent: true, opacity: 0.35, depthWrite: false }))
  pyrEdges.frustumCulled = false
  g3.add(pyr, pyrEdges)

  // the meter hangs from the ceiling over the inner planets, tipped towards the visitor
  const meter = screen({ width: 1.9, height: 1.05, color, title: E.distance.screen, line: '', titleSize: 0.11, lineSize: 0.085 })
  const MY = 2.95
  meter.group.position.set(SUN.x + 1.15, MY, -4.7)
  meter.group.rotation.x = 0.28
  g3.add(meter.group)
  for (const sx of [-0.8, 0.8]) {
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 7 - MY - 0.6, 6), mats.dark)
    cable.position.set(SUN.x + 1.15 + sx, MY + 0.6 + (7 - MY - 0.6) / 2, -4.7)
    g3.add(cable)
  }
  const vars3 = () => {
    const d = D.d
    const w = S0 / (d * d)
    const p = 0.3 * w * 10
    const pw = p >= 1000 ? `${num(p / 1000, 1, lang)} kW` : `${grp(p, lang)} W`
    const kk = 100 / (d * d)
    return { d: num(d, 2, lang), w: grp(w, lang), p: pw, k: `${num(kk, kk < 10 ? 1 : 0, lang)}%` }
  }
  const distHint = () => {
    const H = E.distance.hints
    if (!D.tapped) return H.planet
    if (!D.slid) return H.slide
    if (D.d > 1.4 && D.d < 1.65 && !D.roverTapped) return H.rover
    return H.more
  }
  const distPanel = lv => ({
    title: E.distance.title,
    color,
    blocks: [
      ...paras(E.distance.panel[depth(lv)]),
      { p: E.distance.tip },
      {
        slider: {
          label: E.distance.distance,
          min: 0.6,
          max: 5.5,
          step: 0.01,
          value: D.dT,
          onInput: v => {
            D.dT = v
            D.slid = true
            findOnce('distance', distPanel, 3)
            shareSoon('distance')
            settleSay('distance', () => {
              if (Object.values(PLANETS).some(a => Math.abs(a - D.dT) < 0.08)) return
              say(fill(at(E.distance.says.slide, level()), { ...vars3(), d: num(D.dT, 2, lang), w: grp(S0 / (D.dT * D.dT), lang) }))
            })
          },
          format: v => `${num(v, 2, lang)} AU`,
          live: () => D.dT,
        },
      },
      { buttons: [{ label: E.distance.buttons.rover, onClick: () => tapMars() }] },
    ],
  })
  const goTo = id => {
    D.dT = PLANETS[id]
    D.tapped = true
    play('select')
    say(at(E.distance.says[id], level()))
    findOnce('distance', distPanel, 5)
    share('distance')
    refresh(distPanel)
  }
  const tapMars = () => {
    D.rover = true
    D.roverTapped = false
    goTo('mars')
  }
  const tapRover = () => {
    if (!D.rover) return tapMars()
    D.roverTapped = true
    play('tap')
    say(at(E.distance.says.rover, level()))
    share('distance')
  }
  ex.add({
    id: 'distance',
    x: 5.9,
    z: -2.3,
    radius: 2.7,
    label: E.distance.label,
    verb: distHint,
    manual: true,
    screens: [meter],
    focus: { x: 5.95, y: 1.7, z: -5.0, size: 4.4, width: 4.2 },
    act: () => ctx.showPanel(distPanel),
  })
  for (const id of Object.keys(PLANETS)) clickable(planetObj[id], () => (id === 'mars' ? tapMars() : goTo(id)), { reach: 8 })
  clickable(roverHit, tapRover, { reach: 8, when: () => D.rover })

  let meterWait = 0
  let pyrKey = ''
  updates.push((dt, t) => {
    D.d = damp(D.d, D.dT, 5, dt)
    D.roverK = damp(D.roverK, D.rover ? 1 : 0, 4, dt)
    rover.visible = D.roverK > 0.03
    roverLab.visible = D.roverK > 0.6
    rover.scale.setScalar(Math.max(0.01, D.roverK) * 1.3)
    roverHit.visible = true
    carriage.position.x = SUN.x + D.d * AU + 0.04
    carriage.position.z = SUN.z
    // the pyramid: from the Sun to a square at the carriage whose side grows with the distance
    const key = D.d.toFixed(3)
    if (key !== pyrKey) {
      pyrKey = key
      const xa = SUN.x + 0.19
      const xb = carriage.position.x - 0.1
      const half = 0.14 * D.d
      pyrPos.set([xa, SUN.y, SUN.z, xb, SUN.y - half, SUN.z - half, xb, SUN.y - half, SUN.z + half, xb, SUN.y + half, SUN.z + half, xb, SUN.y + half, SUN.z - half])
      pyrGeo.attributes.position.needsUpdate = true
      const f = ease(clamp((D.d - 0.9) / 0.3))
      pyrMat.opacity = 0.11 * f
      pyrEdges.material.opacity = 0.4 * f
      pyr.visible = pyrEdges.visible = f > 0.01
    }
    sunGlow.scale.setScalar(1.1 + 0.05 * Math.sin(t * 1.7))
    meterWait -= dt
    if (meterWait <= 0) {
      meterWait = 0.12
      meter.set({ line: fill(at(E.distance.reading, level()), vars3()) })
    }
  })

  // the pending "settle" sayings
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

  // the room's own corner of the clean room: a wall of crates at the back left, so the bay is not empty
  {
    const crateMat = new THREE.MeshStandardMaterial({ color: '#4a5b52', roughness: 0.8 })
    for (const [x, z, w, d, h] of [[-8.9, -8.2, 1.6, 1.2, 1.3], [-7.2, -8.3, 1.4, 1.0, 0.9]]) {
      const c = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.04), crateMat)
      c.position.set(x, h / 2, z)
      root.add(c)
      solids.push(box(x, z, w, d))
    }
  }

  const pos = (name, g, p) => worldAt(g, p[0], p[1], p[2])
  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: Z1 - 0.9 },
    spawn: { x: 0.5, z: 4.8, yaw: 0 },
    hostSpot: { x: 2.4, z: 3.8, yaw: Math.atan2(2.4 - 0.5, -0.8) },
    back: { x: 0, z: Z1 - 0.4, rot: Math.PI },
    stand: { x: -3.8, z: 5.0, rot: 0.75 },
    panels: { sim: simPanel, sandwich: sandPanel, distance: distPanel },
    parts: {
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      // what a tap does, for the probes (a real tap is `world.onTap(__ew.rayAt({ x, y }))`)
      tap: name =>
        ({
          sat: tapSat,
          lamp: tapLamp,
          wheel: tapWheel,
          top: () => tapLayer('top'),
          mid: () => tapLayer('mid'),
          ge: () => tapLayer('ge'),
          join: tapJoin,
          lens: tapLens,
          venus: () => goTo('venus'),
          earth: () => goTo('earth'),
          mars: tapMars,
          jupiter: () => goTo('jupiter'),
          rover: tapRover,
        })[name]?.(),
      at: name =>
        ({
          sat: pos(name, sat, [0, 1.4, 0.62]),
          lamp: pos(name, lamp, [0, 0.15, 0.2]),
          wheel: pos(name, wheel, [0, 0, 0.05]),
          top: pos(name, g2, [0.4, 1.83, FRONT]),
          mid: pos(name, g2, [0.4, 1.45, FRONT]),
          ge: pos(name, g2, [0.4, 0.82, FRONT]),
          join: pos(name, g2, [-0.5, 1.235, FRONT + 0.05]),
          lens: pos(name, g2, [LENS.x, LENS.y, LENS.z]),
          venus: planetObj.venus.getWorldPosition(new THREE.Vector3()),
          earth: planetObj.earth.getWorldPosition(new THREE.Vector3()),
          mars: planetObj.mars.getWorldPosition(new THREE.Vector3()),
          jupiter: planetObj.jupiter.getWorldPosition(new THREE.Vector3()),
          rover: pos(name, g3, [PATCH.x, PL_H + 0.2, PATCH.z]),
        })[name],
      sim: {
        get open() {
          return B1.open
        },
        get lamp() {
          return B1.lamp
        },
        get filter() {
          return FILTERS[B1.f]
        },
        get b() {
          return B1.b
        },
        get cur() {
          return curNow(false)
        },
        get cell() {
          return cellOf(curNow(false))
        },
      },
      sandwich: {
        get nm() {
          return S2.nm
        },
        get lens() {
          return S2.lens
        },
        get layer() {
          return layerOf(S2.nm)
        },
        set: nm => {
          S2.nm = nm
          S2.slid = true
          share('sandwich')
        },
      },
      distance: {
        get d() {
          return D.dT
        },
        get rover() {
          return D.rover
        },
        get w() {
          return S0 / (D.dT * D.dT)
        },
        set: d => {
          D.dT = d
          D.slid = true
          share('distance')
        },
      },
    },
    shared: {
      sim: {
        get: () => ({ open: B1.open, lamp: B1.lamp, f: B1.f, b: Math.round(B1.b * 100) / 100 }),
        set: (s, live) => {
          B1.open = !!s?.open
          B1.lamp = !!s?.lamp
          B1.f = clamp(Math.round(Number(s?.f) || 0), 0, 3)
          B1.b = clamp(Number(s?.b) || 1, 0.05, 1)
          if (B1.lamp && B1.open) B1.tried = B1.tried || B1.f !== 0
          if (!live) {
            B1.openLin = B1.open ? 1 : 0
            B1.lampK = B1.lamp ? 1 : 0
            B1.wheel = B1.f
            B1.cur = curNow(false)
            B1.cell = cellOf(B1.cur)
          }
        },
      },
      sandwich: {
        get: () => ({ nm: Math.round(S2.nm), lens: S2.lens }),
        set: (s, live) => {
          S2.nm = clamp(Number(s?.nm) || 520, 300, 1900)
          const lens = ['off', 'ge', 'si'].includes(s?.lens) ? s.lens : 'off'
          S2.lens = lens
          if (lens !== 'off') drawLens(lens)
          if (!live) S2.lensK = lens === 'off' ? 0 : 1
        },
      },
      distance: {
        get: () => ({ d: Math.round(D.dT * 100) / 100, rover: D.rover }),
        set: (s, live) => {
          D.dT = clamp(Number(s?.d) || 1, 0.6, 5.5)
          D.rover = !!s?.rover
          if (!live) {
            D.d = D.dT
            D.roverK = D.rover ? 1 : 0
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
      for (const ge of geos) ge.dispose()
    },
  }
}
