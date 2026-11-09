// Germanium's picture "How can a camera see heat?" as a room (docs/knowledge/picture-rooms.md): a fire
// brigade's training house at night (stages/smokehouse.js). A yard in front of a scorched concrete house
// whose ground floor is a furnished living room, cut open to the yard; a fire engine with slow blue
// beacons; at the yard's right edge a wood, and a fox at its edge, almost invisible in the dark.
// Three things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed
// steps felt passive); the prompt names the next tap, E opens the station's panel, whose buttons (and
// sliders) do the same:
// - See through smoke: a thermal camera on a tripod and its big screen. Tap the smoke machine (or slide
//   the smoke up): the room fills, and the screen's eye view goes grey. Tap the camera: the screen shows
//   the room by temperature (the 8 to 14 micrometre camera), and a training dummy under the table and a
//   cat in its basket stand out; tap them on the screen or in the room to find them (and the radiator,
//   the window, the sofa, to read their temperatures). Tap the fox in the wood: the camera swings to the
//   wood, where the eye sees nothing and the heat view shows a fox sitting in the ferns.
// - The lens bench: a hot kettle at the far end, a heat camera at the near end, a filter wheel between
//   them with three windows: ordinary glass, germanium, and nothing. Tap a window to turn it into the
//   beam. The screen shows what the eye sees and what the heat camera sees side by side. Glass is a wall
//   to infrared; germanium a dark mirror to the eye and a clear window to the camera, until it is heated
//   (tap the heater clip on its mount, or slide its temperature): above about 100 degrees it fades, near
//   200 it is almost opaque, and the hot window glows itself.
// - Hotter shines shorter: a hot plate on a counter, a dial (or a slider) from 0 to 1000 degrees, a heat
//   camera beside it and a screen that draws the camera's picture and Planck's curve with the peak found
//   by Wien's law; three things to put the plate's temperature to (ice, a hand, a kettle).
// All three are shared in a room (src/net/shared.js): the camera as { heat, smoke, view }, the bench as
// { win, geT, heater }, the plate as its temperature; the words, panels and finds stay each one's.
// parts.<thing> does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, smooth, num, fill, standingScreen, random } from '../../../wings/noble/kit.js'
import { smokehouseStage, ROOM, WOOD } from '../../stages/smokehouse.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { HEAT_WORDS } from './heat.words.js'

export const WORDS = HEAT_WORDS

const TAU = Math.PI * 2
const R = ROOM

// ---- where things stand (metres; the spawn in the yard looks along -z at the house) ----
const SPAWN = { x: 0.2, z: 5.6 }
const BACK = { x: 0.2, z: 8.4 }
const STAND = { x: -3.4, z: 5.2 }
const HOST = { x: 2.2, z: 3.6 }
const CAM1 = { x: -0.7, z: -2.4, y: 1.28 } // station 1: the tripod
const SCREEN1 = { x: 1.5, z: -2.0 }
const MACHINE = { x: -2.35, z: -5.35 }
const DUMMY = { x: -0.45, z: -8.0 }
const CAT = { x: R.basket.x, z: R.basket.z }
const FOX = WOOD.fox
const BENCH = { x: -4.6, zc: -2.2, len: 2.6, top: 0.9, rot: Math.PI / 3 } // station 2: the table, turned so the beam runs left and away; its parts are in the table's own frame (beam along -z)
const BEAM_Y = 1.15
const WHEEL = { z: 0, y: 1.45, r: 0.46, slot: 0.3 }
const KETTLE = { z: -1.05 }
const BCAM = { z: 1.0 }
const SCREEN2 = { x: -5.8, z: -3.7 }
const COUNTER = { x: 6.7, z: -2.9, w: 2.1, d: 0.8, top: 0.9 } // station 3
const PLATE = { x: 6.1, z: -2.9 }
const SCREEN3 = { x: 6.3, z: -3.6 }
const AT = { cam: { x: 0.2, z: 1.0 }, bench: { x: -5.0, z: 0.8 }, plate: { x: 6.0, z: 0.7 } }

// ---- physics ----
const C2 = 14387.77 // hc/k, micrometre kelvin
const WIEN = 2897.77 // micrometre kelvin
const K0 = 273.15
const planck = (um, K) => um ** -5 / (Math.exp(C2 / (um * K)) - 1)
const peakUm = K => WIEN / K
/** The share of a body's light that falls between a and b micrometres. */
function bandShare(K, a, b) {
  const N = 900
  const lo = Math.log(0.1)
  const hi = Math.log(400)
  let all = 0
  let part = 0
  for (let i = 0; i < N; i++) {
    const l = Math.exp(lo + ((i + 0.5) / N) * (hi - lo))
    const v = planck(l, K) * l // per ln wavelength
    all += v
    if (l >= a && l <= b) part += v
  }
  return part / all
}
/** Germanium's transmission through a coated window of the bench at its temperature (the share of the
 *  light of 8 to 14 micrometres that gets through): clear to about 100 C, almost opaque by about 200 C. */
const GE_T20 = 0.92
const geTau = T => GE_T20 * (1 - smooth(95, 205, T))
/** Radiance mixed from two temperatures (C): a kelvin^4 blend, near enough for a picture. */
const mixT = (a, b, wa) => (wa * (a + K0) ** 4 + (1 - wa) * (b + K0) ** 4) ** 0.25 - K0

// ---- the heat palette (an "ironbow"): cold dark blue to purple, red, orange, yellow, white ----
const STOPS = [[0, [4, 2, 30]], [0.15, [40, 6, 96]], [0.3, [112, 10, 122]], [0.45, [190, 36, 86]], [0.6, [238, 92, 30]], [0.75, [253, 160, 16]], [0.88, [255, 226, 84]], [1, [255, 255, 236]]]
function ironbow(k) {
  k = clamp(k)
  for (let i = 1; i < STOPS.length; i++) {
    if (k <= STOPS[i][0]) {
      const [k0, c0] = STOPS[i - 1]
      const [k1, c1] = STOPS[i]
      const f = (k - k0) / (k1 - k0)
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * f))
    }
  }
  return STOPS[STOPS.length - 1][1]
}
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
/** The colour of a thing at temperature T (C) on a scale from lo to hi. */
const heatCol = (T, lo, hi, a = 1) => rgb(ironbow((T - lo) / (hi - lo)), a)
/** The glow of a blackbody at T (C) to the eye: nothing below the Draper point, then dull red to orange. */
const GLOW_STOPS = [[0, [150, 14, 0]], [0.4, [225, 40, 6]], [0.75, [255, 110, 22]], [1, [255, 165, 60]]]
function glowOf(T) {
  const g = smooth(480, 560, T) * 0.35 + smooth(560, 1000, T) * 0.65
  const u = clamp((T - 525) / 475)
  let c = GLOW_STOPS[GLOW_STOPS.length - 1][1]
  for (let i = 1; i < GLOW_STOPS.length; i++) {
    if (u <= GLOW_STOPS[i][0]) {
      const [k0, c0] = GLOW_STOPS[i - 1]
      const [k1, c1] = GLOW_STOPS[i]
      c = c0.map((v, j) => v + (c1[j] - v) * ((u - k0) / (k1 - k0)))
      break
    }
  }
  return { k: g, color: new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255) }
}

// ---- the germanium lens: a dark grey mirror, drawn (a real mirror would show only the yard) ----
function geFaceTex() {
  return canvasTex(256, 256, (g, s) => {
    const grad = g.createRadialGradient(s * 0.4, s * 0.36, s * 0.02, s * 0.5, s * 0.5, s * 0.5)
    for (const [o, col] of [[0, '#5a6272'], [0.45, '#2c323e'], [0.85, '#191d26'], [1, '#101318']]) grad.addColorStop(o, col)
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
    g.lineWidth = s * 0.035
    g.strokeStyle = 'rgba(130,110,190,0.28)'
    g.beginPath()
    g.arc(s * 0.52, s * 0.54, s * 0.36, 0, TAU)
    g.stroke()
    g.strokeStyle = 'rgba(110,180,150,0.16)'
    g.beginPath()
    g.arc(s * 0.5, s * 0.5, s * 0.42, 0.4, 2.6)
    g.stroke()
    g.strokeStyle = 'rgba(205,214,228,0.55)'
    g.lineWidth = s * 0.04
    g.lineCap = 'round'
    g.beginPath()
    g.arc(s * 0.5, s * 0.5, s * 0.33, Math.PI * 1.08, Math.PI * 1.42)
    g.stroke()
  })
}

/** A soft round puff (steam, a plume). */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0.9)')
    grd.addColorStop(0.5, 'rgba(255,255,255,0.35)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

// ---- screen 1: the room (or the wood) as the camera shows it ----
const CW = 1024
const CH = 640
const IMG = { x: 24, y: 80, w: 976, h: 470 }
const SC1 = IMG.w / (R.x1 - R.x0) // pixels a metre
const px = x => IMG.x + (x - R.x0) * SC1
const py = y => IMG.y + IMG.h - y * SC1
const sx = m => m * SC1
const ROOM_SCALE = [10, 50] // the heat colours of the room, C
const WOOD_SCALE = [0, 30]

// everything in the room the camera can see, back to front: its drawing and its temperature (C)
const rrect = (g, x, y, w, h, r = 4) => {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
}
const ITEMS = [
  { id: 'wall', T: 19, eye: '#6e6455', box: [R.x0, 0, R.x1, R.h], draw: (g, f) => (g.fillStyle = f, g.fillRect(px(R.x0), py(R.h), sx(R.x1 - R.x0), sx(R.h))) },
  { id: 'bookcase', T: 18, eye: '#4a3626', box: [R.bookcase.x - R.bookcase.w / 2, 0, R.bookcase.x + R.bookcase.w / 2, R.bookcase.y1], draw: (g, f, o) => {
    const b = R.bookcase
    g.fillStyle = f
    g.fillRect(px(b.x - b.w / 2), py(b.y1), sx(b.w), sx(b.y1))
    if (o.mode === 'eye') {
      for (let r = 0; r < 4; r++) {
        g.fillStyle = ['#5a2a2a', '#2a3a5a', '#3a5a3a', '#7a6a2a'][r]
        g.fillRect(px(b.x - b.w / 2) + 4, py(0.2 + r * 0.42 + 0.3), sx(b.w) - 8, sx(0.3))
      }
    }
  } },
  { id: 'window', T: 7, eye: '#14203a', box: [R.window.x - R.window.w / 2, R.window.y0, R.window.x + R.window.w / 2, R.window.y1], draw: (g, f, o) => {
    const w = R.window
    g.fillStyle = f
    g.fillRect(px(w.x - w.w / 2), py(w.y1), sx(w.w), sx(w.y1 - w.y0))
    g.strokeStyle = o.mode === 'eye' ? '#9aa0a8' : 'rgba(0,0,0,0.35)'
    g.lineWidth = 4
    g.strokeRect(px(w.x - w.w / 2), py(w.y1), sx(w.w), sx(w.y1 - w.y0))
    g.beginPath()
    g.moveTo(px(w.x), py(w.y1))
    g.lineTo(px(w.x), py(w.y0))
    g.moveTo(px(w.x - w.w / 2), py((w.y0 + w.y1) / 2))
    g.lineTo(px(w.x + w.w / 2), py((w.y0 + w.y1) / 2))
    g.stroke()
  } },
  { id: 'radiator', T: 58, eye: '#80868c', box: [R.radiator.x - R.radiator.w / 2, R.radiator.y0, R.radiator.x + R.radiator.w / 2, R.radiator.y1], draw: (g, f, o) => {
    const r = R.radiator
    g.fillStyle = f
    for (let i = 0; i < 10; i++) g.fillRect(px(r.x - r.w / 2) + i * (sx(r.w) / 10) + 2, py(r.y1), sx(r.w) / 10 - 4, sx(r.y1 - r.y0))
  } },
  { id: 'sofa', T: 21, eye: '#2e3a46', box: [R.sofa.x - R.sofa.w / 2, 0, R.sofa.x + R.sofa.w / 2, R.sofa.top], draw: (g, f) => {
    const s = R.sofa
    g.fillStyle = f
    rrect(g, px(s.x - s.w / 2), py(s.top), sx(s.w), sx(s.top - 0.12), 10)
    g.fill()
    rrect(g, px(s.x - s.w / 2 - 0.02), py(0.62), sx(0.24), sx(0.62), 8)
    g.fill()
    rrect(g, px(s.x + s.w / 2 - 0.22), py(0.62), sx(0.24), sx(0.62), 8)
    g.fill()
  } },
  { id: 'table', T: 20, eye: '#4a3322', box: [R.table.x - R.table.w / 2, 0, R.table.x + R.table.w / 2, R.table.top], draw: (g, f) => {
    const t = R.table
    g.fillStyle = f
    g.fillRect(px(t.x - t.w / 2), py(t.top), sx(t.w), sx(0.06))
    for (const s of [-1, 1]) g.fillRect(px(t.x + s * (t.w / 2 - 0.08)) - sx(0.035), py(t.top - 0.06), sx(0.07), sx(t.top - 0.06))
  } },
  { id: 'chair', T: 20, eye: '#4a3322', box: [R.table.x - 1.5, 0, R.table.x - 1.1, 0.95], draw: (g, f) => {
    g.fillStyle = f
    for (const cx of [R.table.x - 1.3, R.table.x + 1.2]) {
      g.fillRect(px(cx - 0.21), py(0.47), sx(0.42), sx(0.05))
      g.fillRect(px(cx - 0.21), py(0.95), sx(0.04), sx(0.5))
      for (const s of [-1, 1]) g.fillRect(px(cx + s * 0.18) - sx(0.02), py(0.45), sx(0.04), sx(0.45))
    }
  } },
  { id: 'lamp', T: 55, eye: '#ffdca0', box: [R.lamp.x - 0.3, 2.3, R.lamp.x + 0.3, 2.7], draw: (g, f, o) => {
    g.fillStyle = f
    g.beginPath()
    g.moveTo(px(R.lamp.x - 0.26), py(R.lamp.y + 0.22))
    g.lineTo(px(R.lamp.x + 0.26), py(R.lamp.y + 0.22))
    g.lineTo(px(R.lamp.x + 0.1), py(R.lamp.y + 0.02))
    g.lineTo(px(R.lamp.x - 0.1), py(R.lamp.y + 0.02))
    g.closePath()
    g.fill()
    g.beginPath()
    g.arc(px(R.lamp.x), py(R.lamp.y - 0.05), sx(0.08), 0, TAU)
    g.fill()
  } },
  { id: 'dummy', T: 35, eye: '#6a5a3a', find: true, box: [DUMMY.x - 0.8, 0, DUMMY.x + 0.7, 0.3], draw: (g, f) => {
    g.fillStyle = f
    g.beginPath()
    g.arc(px(DUMMY.x - 0.66), py(0.15), sx(0.11), 0, TAU)
    g.fill()
    rrect(g, px(DUMMY.x - 0.55), py(0.28), sx(0.52), sx(0.26), 14)
    g.fill()
    rrect(g, px(DUMMY.x - 0.05), py(0.22), sx(0.72), sx(0.2), 12)
    g.fill()
    rrect(g, px(DUMMY.x - 0.5), py(0.12), sx(0.4), sx(0.07), 6)
    g.fill()
  } },
  { id: 'basket', T: 20, eye: '#5a4630', box: [CAT.x - 0.36, 0, CAT.x + 0.36, 0.2], draw: (g, f) => {
    g.fillStyle = f
    rrect(g, px(CAT.x - 0.36), py(0.2), sx(0.72), sx(0.2), 10)
    g.fill()
  } },
  { id: 'cat', T: 33, eye: '#5e5a56', find: true, box: [CAT.x - 0.3, 0.12, CAT.x + 0.36, 0.44], draw: (g, f) => {
    g.fillStyle = f
    g.beginPath()
    g.ellipse(px(CAT.x - 0.02), py(0.27), sx(0.28), sx(0.15), 0, 0, TAU)
    g.fill()
    g.beginPath()
    g.arc(px(CAT.x + 0.22), py(0.31), sx(0.1), 0, TAU)
    g.fill()
    for (const s of [-1, 1]) {
      g.beginPath()
      g.moveTo(px(CAT.x + 0.22 + s * 0.09), py(0.37))
      g.lineTo(px(CAT.x + 0.22 + s * 0.04), py(0.46))
      g.lineTo(px(CAT.x + 0.22 + s * 0.015), py(0.38))
      g.fill()
    }
    g.lineWidth = sx(0.05)
    g.strokeStyle = f
    g.lineCap = 'round'
    g.beginPath()
    g.arc(px(CAT.x - 0.2), py(0.2), sx(0.12), Math.PI * 0.4, Math.PI * 1.5)
    g.stroke()
  } },
]
const FOX_ITEM = { id: 'fox', T: 20, find: true }
const itemOf = id => ITEMS.find(i => i.id === id) ?? (id === 'fox' ? FOX_ITEM : null)

/** The thing under a point of the screen's image (pixels), top of the list first. */
function roomItemAt(x, y) {
  const wx = R.x0 + (x - IMG.x) / SC1
  const wy = (IMG.y + IMG.h - y) / SC1
  for (let i = ITEMS.length - 1; i >= 1; i--) {
    const [x0, y0, x1, y1] = ITEMS[i].box
    if (wx >= x0 && wx <= x1 && wy >= y0 && wy <= y1) return ITEMS[i].id
  }
  return null
}

/** The wood at night as the camera sees it: spruces, a bank of ferns and a log, a fox sitting among them. */
const FOXPX = { x: 640, y: 456 }
function drawWood(g, o) {
  const heat = o.mode === 'heat'
  const rnd = random(8)
  const col = (Tc, eye, a = 1) => (heat ? heatCol(Tc, WOOD_SCALE[0], WOOD_SCALE[1], a) : eye)
  g.fillStyle = col(-15, '#04060e')
  g.fillRect(IMG.x, IMG.y, IMG.w, IMG.h)
  if (!heat) {
    // a thin moon, and the sky's faint glow low down
    const grd = g.createLinearGradient(0, IMG.y, 0, IMG.y + IMG.h)
    grd.addColorStop(0, '#05081a')
    grd.addColorStop(1, '#0d1226')
    g.fillStyle = grd
    g.fillRect(IMG.x, IMG.y, IMG.w, IMG.h)
    g.strokeStyle = '#cfd8f0'
    g.lineWidth = 5
    g.beginPath()
    g.arc(880, 150, 26, Math.PI * 0.7, Math.PI * 1.4)
    g.stroke()
  }
  // spruces
  for (let i = 0; i < 17; i++) {
    const x = IMG.x + 20 + (i / 16) * (IMG.w - 40) + (rnd() - 0.5) * 30
    const h = 190 + rnd() * 150
    const w = 40 + rnd() * 34
    g.fillStyle = col(2 + rnd() * 2, rnd() < 0.5 ? '#08120f' : '#0a1612')
    for (let k = 0; k < 3; k++) {
      g.beginPath()
      g.moveTo(x, IMG.y + IMG.h - 90 - h + k * h * 0.2)
      g.lineTo(x - w * (0.55 + k * 0.22), IMG.y + IMG.h - 90 - h * (0.55 - k * 0.2))
      g.lineTo(x + w * (0.55 + k * 0.22), IMG.y + IMG.h - 90 - h * (0.55 - k * 0.2))
      g.closePath()
      g.fill()
    }
  }
  // the ground and the ferns
  g.fillStyle = col(5, '#0a120c')
  g.fillRect(IMG.x, IMG.y + IMG.h - 100, IMG.w, 100)
  g.strokeStyle = col(6, '#0d1d10')
  g.lineWidth = 3
  for (let i = 0; i < 90; i++) {
    const x = IMG.x + rnd() * IMG.w
    const y = IMG.y + IMG.h - 20 - rnd() * 80
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + (rnd() - 0.5) * 50, y - 30, x + (rnd() - 0.5) * 80, y - 10 - rnd() * 24)
    g.stroke()
  }
  // the fox, sitting among the ferns, looking at us
  const fx = FOXPX.x
  const fy = FOXPX.y
  const f = heat ? heatCol(FOX_ITEM.T, WOOD_SCALE[0], WOOD_SCALE[1]) : 'rgba(34,22,14,0.55)'
  if (heat) {
    g.shadowColor = heatCol(FOX_ITEM.T, WOOD_SCALE[0], WOOD_SCALE[1], 0.8)
    g.shadowBlur = 26
  }
  g.fillStyle = f
  g.beginPath()
  g.ellipse(fx, fy - 34, 34, 56, 0, 0, TAU) // body, sitting upright
  g.fill()
  g.beginPath()
  g.ellipse(fx + 54, fy - 18, 58, 20, -0.35, 0, TAU) // the bushy tail, curled round
  g.fill()
  g.beginPath()
  g.moveTo(fx - 26, fy - 96) // a head wider at the cheeks, narrowing to a pointed snout
  g.quadraticCurveTo(fx - 28, fy - 74, fx, fy - 58)
  g.quadraticCurveTo(fx + 28, fy - 74, fx + 26, fy - 96)
  g.quadraticCurveTo(fx, fy - 108, fx - 26, fy - 96)
  g.fill()
  for (const s of [-1, 1]) {
    g.beginPath() // tall pointed ears
    g.moveTo(fx + s * 25, fy - 98)
    g.lineTo(fx + s * 20, fy - 140)
    g.lineTo(fx + s * 5, fy - 104)
    g.fill()
  }
  g.shadowBlur = 0
  // ferns in front, hiding its legs
  g.strokeStyle = col(6, '#112614')
  g.lineWidth = 4
  for (let i = 0; i < 60; i++) {
    const x = fx - 130 + rnd() * 270
    const y = IMG.y + IMG.h - 4 - rnd() * 22
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + (rnd() - 0.5) * 40, y - 40, x + (rnd() - 0.5) * 70, y - 24 - rnd() * 30)
    g.stroke()
  }
}

/** The room's picture, eye or heat. */
function drawRoom(g, o) {
  const heat = o.mode === 'heat'
  for (const it of ITEMS) {
    const f = heat ? heatCol(it.T, ROOM_SCALE[0], ROOM_SCALE[1]) : it.eye
    if (heat && it.T > 40) {
      g.shadowColor = heatCol(it.T, ROOM_SCALE[0], ROOM_SCALE[1], 0.75)
      g.shadowBlur = 18
    } else if (heat && it.find) {
      g.shadowColor = heatCol(it.T, ROOM_SCALE[0], ROOM_SCALE[1], 0.6)
      g.shadowBlur = 16
    }
    // a lit room to the eye: the floor lighter than the walls, furniture dimmer
    if (!heat && it.id === 'wall') {
      const grd = g.createLinearGradient(0, IMG.y, 0, IMG.y + IMG.h)
      grd.addColorStop(0, '#4a4234')
      grd.addColorStop(0.6, '#8a7c66')
      grd.addColorStop(1, '#6b5a40')
      it.draw(g, grd, o)
    } else it.draw(g, f, o)
    g.shadowBlur = 0
  }
  // the floor boards, where the walls meet the floor
  g.fillStyle = heat ? heatCol(19, ROOM_SCALE[0], ROOM_SCALE[1]) : '#5a4430'
  g.fillRect(IMG.x, py(0.05), IMG.w, sx(0.05))
}

/** A thermal readout box round a found thing: corners and its temperature. */
function bracket(g, pix, label, color) {
  const [X0, Y0, X1, Y1] = pix
  g.strokeStyle = color
  g.lineWidth = 3
  const L = 16
  for (const [x, y, dx, dy] of [[X0, Y0, 1, 1], [X1, Y0, -1, 1], [X0, Y1, 1, -1], [X1, Y1, -1, -1]]) {
    g.beginPath()
    g.moveTo(x, y + dy * L)
    g.lineTo(x, y)
    g.lineTo(x + dx * L, y)
    g.stroke()
  }
  g.font = '700 26px Outfit, sans-serif'
  g.textAlign = 'left'
  g.textBaseline = 'bottom'
  const w = g.measureText(label).width + 12
  g.fillStyle = 'rgba(5,6,15,0.82)'
  g.fillRect(X0, Math.max(IMG.y + 2, Y0 - 30), w, 28)
  g.fillStyle = color
  g.fillText(label, X0 + 6, Math.max(IMG.y + 2, Y0 - 30) + 26)
}

/** Text that shrinks to fit a width: `size` is the largest. */
function fit(g, text, x, y, maxW, size, weight = 700) {
  let sz = size
  g.font = `${weight} ${sz}px Outfit, sans-serif`
  while (g.measureText(text).width > maxW && sz > 12) g.font = `${weight} ${(sz -= 1)}px Outfit, sans-serif`
  g.fillText(text, x, y)
}

/** Screen 1: v = { mode, view, smoke, t, marks, level, lang, E }. */
function drawView1(g, v) {
  const E = v.E
  g.save()
  g.fillStyle = '#05060f'
  g.fillRect(0, 0, CW, CH)
  g.textBaseline = 'alphabetic'
  g.textAlign = 'left'
  g.fillStyle = v.mode === 'heat' ? '#ffb347' : '#cfe1ff'
  fit(g, v.mode === 'heat' ? E.screen.heat : E.screen.eye, IMG.x, 52, 640, 40)
  g.textAlign = 'right'
  g.fillStyle = '#9aa6d6'
  fit(g, v.view === 'wood' ? E.screen.wood : E.screen.room, IMG.x + IMG.w, 50, 260, 28, 600)
  // the picture
  g.save()
  g.beginPath()
  g.rect(IMG.x, IMG.y, IMG.w, IMG.h)
  g.clip()
  if (v.view === 'wood') drawWood(g, v)
  else drawRoom(g, v)
  const s = v.view === 'wood' ? 0 : v.smoke
  if (s > 0.01) {
    const eye = v.mode === 'eye'
    if (eye) {
      // smoke to the eye: a grey veil that thickens, with drifting billows
      g.fillStyle = `rgba(150,148,146,${Math.min(0.97, Math.pow(s, 0.8) * 1.05)})`
      g.fillRect(IMG.x, IMG.y, IMG.w, IMG.h)
      const rnd = random(3)
      for (let i = 0; i < 26; i++) {
        const x = IMG.x + ((rnd() * IMG.w + v.t * (6 + rnd() * 14)) % (IMG.w + 240)) - 120
        const y = IMG.y + rnd() * IMG.h
        const r = 90 + rnd() * 140
        const grd = g.createRadialGradient(x, y, 0, x, y, r)
        grd.addColorStop(0, `rgba(205,203,200,${0.34 * s})`)
        grd.addColorStop(1, 'rgba(205,203,200,0)')
        g.fillStyle = grd
        g.fillRect(x - r, y - r, 2 * r, 2 * r)
      }
    } else {
      // long infrared waves slip between the smoke's specks: the picture dims only a little
      g.fillStyle = `rgba(40,10,70,${0.07 * s})`
      g.fillRect(IMG.x, IMG.y, IMG.w, IMG.h)
    }
  }
  if (v.mode === 'heat') {
    // the sensor's fine grain
    const rnd = random(Math.floor(v.t * 6))
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(255,255,255,${0.03 + rnd() * 0.05})`
      g.fillRect(IMG.x + rnd() * IMG.w, IMG.y + rnd() * IMG.h, 2, 2)
    }
  }
  g.restore()
  g.strokeStyle = v.mode === 'heat' ? '#ffb347' : '#5a6fa8'
  g.lineWidth = 3
  g.strokeRect(IMG.x, IMG.y, IMG.w, IMG.h)
  // readouts on what has been found or asked about
  if (v.mode === 'heat') {
    for (const id of v.marks) {
      if (id === 'fox') {
        if (v.view === 'wood') bracket(g, [FOXPX.x - 64, FOXPX.y - 146, FOXPX.x + 108, FOXPX.y + 6], `${E.names.fox} ${num(FOX_ITEM.T, 0, v.lang)} °C`, '#7cf7a0')
        continue
      }
      if (v.view === 'wood') continue
      const it = itemOf(id)
      const [bx0, by0, bx1, by1] = it.box
      bracket(g, [px(bx0) - 6, py(by1) - 6, px(bx1) + 6, py(by0) + 6], `${E.names[id]} ${num(it.T, 0, v.lang)} °C`, it.find ? '#7cf7a0' : '#ffe9a8')
    }
  }
  // the footer: the scale (heat) or a line of words
  g.textBaseline = 'alphabetic'
  if (v.mode === 'heat') {
    const [lo, hi] = v.view === 'wood' ? WOOD_SCALE : ROOM_SCALE
    const bx = IMG.x
    const by = 568
    const bw = 360
    for (let i = 0; i < bw; i++) {
      g.fillStyle = rgb(ironbow(i / bw))
      g.fillRect(bx + i, by, 1.4, 22)
    }
    g.strokeStyle = '#c9d4ff'
    g.lineWidth = 2
    g.strokeRect(bx, by, bw, 22)
    g.fillStyle = '#c9d4ff'
    g.font = '600 24px Outfit, sans-serif'
    g.textAlign = 'left'
    g.fillText(`${num(lo, 0, v.lang)} °C`, bx, by + 50)
    g.textAlign = 'right'
    g.fillText(`${num(hi, 0, v.lang)} °C`, bx + bw, by + 50)
    g.textAlign = 'left'
    g.fillStyle = '#ffe9a8'
    g.font = '700 28px Outfit, sans-serif'
    fit(g, at(E.screen.captionHeat, v.level), bx + bw + 30, by + 18, IMG.x + IMG.w - (bx + bw + 30), 28)
    if (v.level === 'scientist') {
      g.fillStyle = '#9aa6d6'
      fit(g, E.screen.band, bx + bw + 30, by + 52, IMG.x + IMG.w - (bx + bw + 30), 22, 600)
    }
  } else {
    g.fillStyle = '#cfe1ff'
    g.textAlign = 'left'
    fit(g, at(v.view === 'wood' ? E.screen.captionEyeWood : s > 0.55 ? E.screen.captionEyeSmoke : E.screen.captionEye, v.level), IMG.x, 592, IMG.w, 32)
  }
  g.restore()
}

// ---- screen 2: the bench, seen by the eye and by the heat camera ----
const C2W = 1024
const C2H = 520
const PANE = { w: 480, h: 360, y: 84, ax: 240, ay: 168, ar: 138 }
const KETTLE_T = 90
const BENCH_SCALE = [10, 140]

/** A kettle in a pane (centred at cx, base at by): drawn with `f` for its body, `h` for its handle and lid. */
function kettlePath(g, cx, by, s) {
  g.beginPath()
  g.moveTo(cx - 62 * s, by)
  g.lineTo(cx + 62 * s, by)
  g.lineTo(cx + 50 * s, by - 112 * s)
  g.quadraticCurveTo(cx, by - 126 * s, cx - 50 * s, by - 112 * s)
  g.closePath()
}
function drawKettle(g, cx, by, s, body, accent, steam) {
  g.fillStyle = body
  kettlePath(g, cx, by, s)
  g.fill()
  g.beginPath() // spout
  g.moveTo(cx + 54 * s, by - 90 * s)
  g.lineTo(cx + 96 * s, by - 112 * s)
  g.lineTo(cx + 100 * s, by - 104 * s)
  g.lineTo(cx + 58 * s, by - 62 * s)
  g.closePath()
  g.fill()
  g.strokeStyle = accent
  g.lineWidth = 11 * s
  g.lineCap = 'round'
  g.beginPath() // handle
  g.moveTo(cx - 48 * s, by - 106 * s)
  g.bezierCurveTo(cx - 110 * s, by - 112 * s, cx - 108 * s, by - 28 * s, cx - 58 * s, by - 24 * s)
  g.stroke()
  g.fillStyle = accent
  g.beginPath()
  g.arc(cx, by - 128 * s, 9 * s, 0, TAU)
  g.fill()
  if (steam) {
    g.strokeStyle = steam
    g.lineWidth = 7 * s
    for (const dx of [-8, 12]) {
      g.beginPath()
      g.moveTo(cx + 98 * s + dx * s * 0.2, by - 116 * s)
      g.bezierCurveTo(cx + (92 + dx) * s, by - 150 * s, cx + (112 + dx) * s, by - 160 * s, cx + (100 + dx) * s, by - 190 * s)
      g.stroke()
    }
  }
}

/** One pane of screen 2 at (x0, PANE.y): `heat` or `eye`. */
function drawPane(g, x0, heat, o) {
  const P = PANE
  const [lo, hi] = BENCH_SCALE
  g.save()
  g.translate(x0, P.y)
  g.beginPath()
  g.rect(0, 0, P.w, P.h)
  g.clip()
  // the wheel's face round the window, the bench behind
  g.fillStyle = heat ? heatCol(21, lo, hi) : '#1a1d24'
  g.fillRect(0, 0, P.w, P.h)
  if (!heat) {
    g.fillStyle = '#242830'
    g.beginPath()
    g.arc(P.ax, P.ay, P.ar + 26, 0, TAU)
    g.fill()
  } else {
    g.fillStyle = heatCol(22, lo, hi)
    g.beginPath()
    g.arc(P.ax, P.ay, P.ar + 26, 0, TAU)
    g.fill()
  }
  // the window
  g.save()
  g.beginPath()
  g.arc(P.ax, P.ay, P.ar, 0, TAU)
  g.clip()
  const kettleScene = (kT, tint) => {
    g.fillStyle = heat ? heatCol(20, lo, hi) : '#181b22'
    g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
    if (heat) {
      // the kettle is hot: its halo, its steam a little less
      g.shadowColor = heatCol(kT, lo, hi, 0.8)
      g.shadowBlur = 30
      drawKettle(g, P.ax - 14, P.ay + 108, 1.35, heatCol(kT, lo, hi), heatCol(kT - 20, lo, hi), heatCol(kT * 0.55, lo, hi, 0.9))
      g.shadowBlur = 0
    } else {
      drawKettle(g, P.ax - 14, P.ay + 108, 1.35, '#aeb6bf', '#20242a', 'rgba(220,230,240,0.5)')
      const grd = g.createLinearGradient(P.ax - 80, 0, P.ax + 40, 0)
      grd.addColorStop(0, 'rgba(255,255,255,0.18)')
      grd.addColorStop(0.3, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(P.ax - 80, P.ay - 60, 120, 168)
    }
    if (tint) {
      g.fillStyle = tint
      g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
    }
  }
  const win = o.win
  if (win === 'open') kettleScene(KETTLE_T)
  else if (win === 'glass') {
    if (!heat) {
      kettleScene(KETTLE_T, 'rgba(180,225,235,0.14)')
      g.fillStyle = 'rgba(255,255,255,0.12)'
      g.beginPath()
      g.moveTo(P.ax - P.ar, P.ay - 30)
      g.lineTo(P.ax - P.ar + 80, P.ay - P.ar)
      g.lineTo(P.ax - P.ar + 130, P.ay - P.ar)
      g.lineTo(P.ax - P.ar, P.ay + 40)
      g.fill()
    } else {
      // glass is a wall to long infrared: only the glass itself, at room temperature, shows
      g.fillStyle = heatCol(22, lo, hi)
      g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
      const grd = g.createRadialGradient(P.ax - 40, P.ay - 40, 0, P.ax - 40, P.ay - 40, 150)
      grd.addColorStop(0, heatCol(26, lo, hi, 0.5))
      grd.addColorStop(1, heatCol(22, lo, hi, 0))
      g.fillStyle = grd
      g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
    }
  } else if (!heat) {
    // germanium to the eye: a dark grey mirror
    const grad = g.createRadialGradient(P.ax - 40, P.ay - 50, 6, P.ax, P.ay, P.ar)
    for (const [k, c] of [[0, '#5a6272'], [0.45, '#2c323e'], [0.85, '#191d26'], [1, '#101318']]) grad.addColorStop(k, c)
    g.fillStyle = grad
    g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
    g.strokeStyle = 'rgba(130,110,190,0.3)'
    g.lineWidth = 14
    g.beginPath()
    g.arc(P.ax + 6, P.ay + 8, P.ar * 0.7, 0, TAU)
    g.stroke()
    g.strokeStyle = 'rgba(205,214,228,0.5)'
    g.lineWidth = 9
    g.lineCap = 'round'
    g.beginPath()
    g.arc(P.ax, P.ay, P.ar * 0.62, Math.PI * 1.08, Math.PI * 1.42)
    g.stroke()
  } else {
    // germanium to the heat camera: the kettle through it (less of it as the window warms), and the
    // window's own glow as it fills with free electrons
    const tau = geTau(o.geT)
    const kT = mixT(KETTLE_T, o.geT, tau / GE_T20)
    kettleScene(kT)
    const own = clamp(1 - tau / GE_T20)
    if (own > 0.01) {
      g.fillStyle = heatCol(mixT(o.geT, kT, own), lo, hi, own)
      g.fillRect(P.ax - P.ar, P.ay - P.ar, 2 * P.ar, 2 * P.ar)
    }
  }
  g.restore()
  // the window's rim
  g.strokeStyle = heat ? heatCol(o.win === 'ge' && o.geT > 90 ? Math.min(o.geT, 130) * 0.55 : 24, lo, hi) : '#4a505c'
  g.lineWidth = 8
  g.beginPath()
  g.arc(P.ax, P.ay, P.ar + 4, 0, TAU)
  g.stroke()
  if (heat) {
    // sensor grain
    const rnd = random(Math.floor(o.t * 6) + 5)
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(255,255,255,${0.03 + rnd() * 0.05})`
      g.fillRect(rnd() * P.w, rnd() * P.h, 2, 2)
    }
  }
  g.restore()
  g.strokeStyle = heat ? '#ffb347' : '#5a6fa8'
  g.lineWidth = 3
  g.strokeRect(x0, P.y, P.w, P.h)
}

/** Screen 2: v = { win, geT, level, lang, t, E }. */
function drawView2(g, v) {
  const E = v.E
  g.save()
  g.fillStyle = '#05060f'
  g.fillRect(0, 0, C2W, C2H)
  g.textBaseline = 'alphabetic'
  g.textAlign = 'left'
  g.fillStyle = '#cfe1ff'
  fit(g, E.screen.eye, 20, 56, 470, 38)
  g.fillStyle = '#ffb347'
  fit(g, E.screen.heat, 524, 56, 470, 38)
  drawPane(g, 20, false, v)
  drawPane(g, 524, true, v)
  // the heat pane's scale and readout, the captions
  const [lo, hi] = BENCH_SCALE
  const by = PANE.y + PANE.h + 14
  for (let i = 0; i < 220; i++) {
    g.fillStyle = rgb(ironbow(i / 220))
    g.fillRect(524 + i * 1.0, by, 1.4, 14)
  }
  g.fillStyle = '#c9d4ff'
  g.font = '600 20px Outfit, sans-serif'
  g.textAlign = 'left'
  g.fillText(`${num(lo, 0, v.lang)} °C`, 524, by + 38)
  g.textAlign = 'right'
  g.fillText(`${num(hi, 0, v.lang)} °C`, 524 + 220, by + 38)
  const winName = E.windows[v.win]
  g.textAlign = 'left'
  g.fillStyle = '#ffe9a8'
  g.font = '700 26px Outfit, sans-serif'
  const geLine = v.win === 'ge' ? ` ${num(v.geT, 0, v.lang)} °C` : ''
  fit(g, `${winName}${geLine}`, 764, by + 14, 240, 26)
  if (v.level === 'scientist' && v.win === 'ge') {
    g.fillStyle = '#9aa6d6'
    g.font = '600 20px Outfit, sans-serif'
    fit(g, `${E.screen.passes} ${num(Math.round(geTau(v.geT) * 100), 0, v.lang)} %`, 764, by + 40, 240, 20, 600)
  }
  // what each sees, in words
  g.font = '700 26px Outfit, sans-serif'
  g.fillStyle = '#cfe1ff'
  g.textAlign = 'left'
  fit(g, at(E.screen.eyeSees[v.win], v.level), 20, by + 28, 470, 26)
  g.fillStyle = '#ffb347'
  const key = v.win === 'ge' && v.geT > 150 ? 'geHot' : v.win === 'ge' && v.geT > 100 ? 'geWarm' : v.win
  fit(g, at(E.screen.heatSees[key], v.level), 524, by + 76, 470, 24, 600)
  g.restore()
}

// ---- screen 3: the plate under the heat camera, and its light by wavelength ----
const PL_SCALE = [0, 1000]
const plK = T => Math.sqrt(clamp((T - PL_SCALE[0]) / (PL_SCALE[1] - PL_SCALE[0])))
const plCol = (T, a = 1) => rgb(ironbow(plK(T)), a)
const REFS = { ice: 0, hand: 37, kettle: 100 }
const CH3 = { x0: 430, x1: 990, yb: 380, yt: 130, um0: 0.3, um1: 30 }
const umX = um => CH3.x0 + ((Math.log(um) - Math.log(CH3.um0)) / (Math.log(CH3.um1) - Math.log(CH3.um0))) * (CH3.x1 - CH3.x0)

/** Screen 3: v = { T, level, lang, t, E }. */
function drawView3(g, v) {
  const E = v.E
  const K = v.T + K0
  g.save()
  g.fillStyle = '#05060f'
  g.fillRect(0, 0, CW, CH)
  g.textBaseline = 'alphabetic'
  g.textAlign = 'left'
  g.fillStyle = '#ffb347'
  fit(g, E.screen.heat, 24, 52, 390, 38)
  g.fillStyle = '#cfe1ff'
  fit(g, E.screen.chart, CH3.x0, 52, 560, 38)
  // the camera's picture: the plate large, three things small beside it
  const pic = { x: 24, y: 84, w: 370, h: 300 }
  g.fillStyle = plCol(0)
  g.fillRect(pic.x, pic.y, pic.w, pic.h)
  const disc = (cx, cy, r, T) => {
    if (T > 50) {
      g.shadowColor = plCol(T, 0.85)
      g.shadowBlur = 36
    }
    g.fillStyle = plCol(T)
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.fill()
    g.shadowBlur = 0
  }
  disc(pic.x + 140, pic.y + 150, 105, v.T)
  g.strokeStyle = 'rgba(200,190,255,0.35)'
  g.lineWidth = 3
  g.beginPath()
  g.arc(pic.x + 140, pic.y + 150, 112, 0, TAU)
  g.stroke()
  const refs = ['ice', 'hand', 'kettle']
  refs.forEach((id, i) => {
    const cy = pic.y + 52 + i * 92
    disc(pic.x + 306, cy, 30, REFS[id])
    g.textAlign = 'center'
    g.fillStyle = plK(REFS[id]) > 0.5 ? '#05060f' : '#ffffff'
    g.font = '700 22px Outfit, sans-serif'
    g.fillText(num(REFS[id], 0, v.lang), pic.x + 306, cy + 8)
    g.fillStyle = '#ffffff'
    fit(g, E.refs[id], pic.x + 306, cy + 52, 100, 20, 600)
  })
  g.textAlign = 'center'
  g.fillStyle = '#05060f'
  g.font = '700 34px Outfit, sans-serif'
  g.fillStyle = v.T > 350 ? '#1a0800' : '#ffffff'
  g.fillText(`${num(Math.round(v.T), 0, v.lang)} °C`, pic.x + 140, pic.y + 162)
  g.strokeStyle = '#ffb347'
  g.lineWidth = 3
  g.strokeRect(pic.x, pic.y, pic.w, pic.h)
  // its scale (not linear: it is spread so cool things show too)
  for (let i = 0; i < pic.w; i++) {
    g.fillStyle = rgb(ironbow(i / pic.w))
    g.fillRect(pic.x + i, pic.y + pic.h + 12, 1.4, 16)
  }
  g.fillStyle = '#c9d4ff'
  g.font = '600 20px Outfit, sans-serif'
  g.textAlign = 'center'
  for (const T of [0, 100, 300]) g.fillText(num(T, 0, v.lang), pic.x + plK(T) * pic.w, pic.y + pic.h + 52)
  g.textAlign = 'right'
  g.fillText(`${num(1000, 0, v.lang)} °C`, pic.x + pic.w, pic.y + pic.h + 52)

  // the chart: relative brightness against wavelength (log), the visible band, the camera's band
  const { x0, x1, yb, yt } = CH3
  g.fillStyle = 'rgba(255,170,80,0.16)'
  g.fillRect(umX(8), yt - 10, umX(14) - umX(8), yb - yt + 10)
  g.fillStyle = '#ffb347'
  g.textAlign = 'center'
  fit(g, E.screen.cameraBand, (umX(8) + umX(14)) / 2, yt - 18, 300, 20, 600)
  for (let i = 0; i < 60; i++) {
    const um = 0.4 + (i / 60) * 0.3
    const hue = 270 - (i / 60) * 270
    g.fillStyle = `hsl(${hue},90%,55%)`
    g.fillRect(umX(um), yb - 14, Math.max(1.2, umX(um + 0.005) - umX(um)), 14)
  }
  g.fillStyle = '#e6eaff'
  g.fillText(E.screen.visible, umX(0.55), yb - 22)
  // Planck's curve, scaled to its own peak
  const peak = planck(peakUm(K), K)
  const col = plCol(Math.max(v.T, 60))
  g.beginPath()
  g.moveTo(x0, yb)
  for (let i = 0; i <= 220; i++) {
    const um = Math.exp(Math.log(CH3.um0) + (i / 220) * (Math.log(CH3.um1) - Math.log(CH3.um0)))
    const val = planck(um, K) / peak
    const x = umX(um)
    const y = yb - val * (yb - yt - 18)
    g.lineTo(x, y)
  }
  g.lineTo(x1, yb)
  g.closePath()
  g.fillStyle = plCol(Math.max(v.T, 60), 0.35)
  g.fill()
  g.strokeStyle = col
  g.lineWidth = 4
  g.stroke()
  // the axis
  g.strokeStyle = '#8c98c8'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(x0, yb + 1)
  g.lineTo(x1, yb + 1)
  g.stroke()
  g.fillStyle = '#c9d4ff'
  g.font = '600 20px Outfit, sans-serif'
  g.textAlign = 'center'
  for (const um of [0.5, 1, 2, 5, 10, 20]) {
    g.beginPath()
    g.moveTo(umX(um), yb + 1)
    g.lineTo(umX(um), yb + 10)
    g.stroke()
    g.fillText(num(um, um < 1 ? 1 : 0, v.lang), umX(um), yb + 32)
  }
  g.textAlign = 'right'
  g.fillText('µm', x1 + 2, yb + 56)
  // the peak: where it shines most
  const pu = peakUm(K)
  g.strokeStyle = '#ffe9a8'
  g.setLineDash([8, 7])
  g.lineWidth = 2.5
  g.beginPath()
  g.moveTo(umX(pu), yb)
  g.lineTo(umX(pu), yt + 6)
  g.stroke()
  g.setLineDash([])
  g.fillStyle = '#ffe9a8'
  g.beginPath()
  g.moveTo(umX(pu), yt + 22)
  g.lineTo(umX(pu) - 10, yt + 4)
  g.lineTo(umX(pu) + 10, yt + 4)
  g.fill()
  g.font = '700 30px Outfit, sans-serif'
  g.textAlign = umX(pu) > x1 - 120 ? 'right' : 'left'
  g.fillText(`${num(pu, 1, v.lang)} µm`, umX(pu) + (umX(pu) > x1 - 120 ? -16 : 16), yt + 36)

  // words under both
  g.textAlign = 'left'
  g.fillStyle = '#ffe9a8'
  g.font = '700 34px Outfit, sans-serif'
  fit(g, fill(E.screen.brightest, { um: num(pu, 1, v.lang), t: num(Math.round(v.T), 0, v.lang) }), 24, 506, 976, 34)
  g.fillStyle = '#e6eaff'
  const eyeLine = v.T >= 525 ? E.screen.eyeRed : E.screen.eyeNone
  fit(g, eyeLine, 24, 548, 976, 26, 600)
  if (v.level === 'scientist') {
    const share = bandShare(K, 8, 14)
    g.fillStyle = '#9aa6d6'
    fit(g, fill(E.screen.share, { p: num(Math.round(share * 100), 0, v.lang), k: num(Math.round(K), 0, v.lang) }), 24, 590, 976, 26, 600)
  } else {
    g.fillStyle = '#9aa6d6'
    fit(g, E.screen.shorter, 24, 590, 976, 26, 600)
  }
  g.restore()
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, level, depth, color, light, lang, clickable }) {
  const stage = smokehouseStage({ light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const geos = []
  const mats = []
  const paras = list => list.map(p => ({ p }))
  const me = () => ctx.engine.player.pos
  const near = (spot, r) => Math.hypot(me().x - spot.x, me().z - spot.z) < r
  const discover = (find, panel, delay, spot) => {
    if (ex.discover(find) && panel) later(delay, () => near(spot, 7) && ctx.showPanel(panel))
  }
  const std = (c, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, ...o })
    mats.push(m)
    return m
  }
  const G = g => (geos.push(g), g)
  const hitMat = new THREE.MeshBasicMaterial({ visible: false })
  const hitBox = (w, h, d, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(G(new THREE.BoxGeometry(w, h, d)), hitMat)
    m.position.set(x, y, z)
    return m
  }
  const soft = softTex()
  textures.push(soft)
  const geTex = geFaceTex()
  textures.push(geTex)
  const geFace = new THREE.MeshStandardMaterial({ map: geTex, emissiveMap: geTex, emissive: '#ffffff', emissiveIntensity: 0.14, roughness: 0.3, metalness: 0.2 })
  mats.push(geFace)
  const M = {
    black: std('#16181c', { roughness: 0.5 }),
    dark: std('#2a2d33'),
    steel: std('#9aa0a8', { roughness: 0.35, metalness: 0.7 }),
    yellow: std('#d6a419', { roughness: 0.5 }),
    wood: std('#6b4a32', { roughness: 0.8 }),
    top: std('#8a8f96', { roughness: 0.45, metalness: 0.3 }),
    orange: std('#d4561c'),
  }

  /** A thermal camera, its lens a germanium window (a dark mirror), looking along -z. */
  function thermalCamera() {
    const cam = new THREE.Group()
    const body = new THREE.Mesh(G(new RoundedBoxGeometry(0.17, 0.2, 0.24, 3, 0.03)), M.yellow)
    const bumper = new THREE.Mesh(G(new RoundedBoxGeometry(0.19, 0.22, 0.1, 3, 0.03)), M.black)
    bumper.position.z = 0.08
    const barrel = new THREE.Mesh(G(new THREE.CylinderGeometry(0.066, 0.07, 0.1, 22).rotateX(Math.PI / 2)), M.black)
    barrel.position.set(0, 0.01, -0.17)
    const face = new THREE.Mesh(G(new THREE.CircleGeometry(0.058, 28)), geFace)
    face.position.set(0, 0.01, -0.222)
    face.rotation.y = Math.PI
    const handle = new THREE.Mesh(G(new RoundedBoxGeometry(0.05, 0.05, 0.2, 2, 0.02)), M.black)
    handle.position.set(0, 0.125, 0)
    const lcd = new THREE.Mesh(G(new THREE.PlaneGeometry(0.12, 0.09)), new THREE.MeshBasicMaterial({ color: '#1a0e3a' }))
    lcd.position.set(0, 0.02, 0.131)
    cam.add(body, bumper, barrel, face, handle, lcd)
    return cam
  }
  /** A three-legged stand under a head at (x, y, z) (in `parent`), feet on the ground. */
  function tripod(parent, x, y, z, legMat = M.dark) {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.5
      const foot = new THREE.Vector3(x + Math.cos(a) * 0.45, 0, z + Math.sin(a) * 0.45)
      const top = new THREE.Vector3(x, y - 0.05, z)
      const leg = new THREE.Mesh(G(new THREE.CylinderGeometry(0.014, 0.02, foot.distanceTo(top), 6)), legMat)
      leg.position.copy(foot).add(top).multiplyScalar(0.5)
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize())
      parent.add(leg)
    }
    const head = new THREE.Mesh(G(new THREE.CylinderGeometry(0.045, 0.055, 0.07, 12)), M.black)
    head.position.set(x, y - 0.04, z)
    parent.add(head)
  }

  // ============================== station 1: see through smoke ==============================
  const CAMERA = { heat: false, smoke: 0, view: 'room', want: 0 }
  const FOUND = { dummy: false, cat: false, fox: false }
  const MARKS = [] // things asked about on the screen, in order
  const cam1 = new THREE.Group()
  const cam1Aim = new THREE.Group()
  {
    tripod(cam1, 0, CAM1.y, 0)
    const c = thermalCamera()
    cam1Aim.add(c)
    cam1Aim.position.y = CAM1.y + 0.1
    cam1Aim.rotation.order = 'YXZ'
    cam1.add(cam1Aim)
    cam1.add(hitBox(0.7, 0.5, 0.7, 0, CAM1.y + 0.1, 0), hitBox(0.5, CAM1.y, 0.5, 0, CAM1.y / 2, 0))
    cam1.position.set(CAM1.x, 0, CAM1.z)
    root.add(cam1)
    solids.push(circle(CAM1.x, CAM1.z, 0.45))
  }
  const aimYaw = { room: Math.atan2(-(DUMMY.x - CAM1.x), -(DUMMY.z - CAM1.z)), wood: Math.atan2(-(FOX.x - CAM1.x), -(FOX.z - CAM1.z)) }
  let yaw = aimYaw.room
  let pitch = -0.03

  // the screen
  const view1Tex = canvasTex(CW, CH, null, { mipmaps: true })
  textures.push(view1Tex)
  const scr1 = standingScreen({ width: 2.2, height: 1.58, color, title: E.sm.screenTitle, line: '', titleSize: 0.1 }, { top: 1.6, tilt: 0.12, mat: M.dark })
  const plane1 = new THREE.Mesh(G(new THREE.PlaneGeometry(2.04, (2.04 * CH) / CW)), new THREE.MeshBasicMaterial({ map: view1Tex, toneMapped: false }))
  plane1.position.y = -0.09
  scr1.content.add(plane1)
  scr1.group.position.set(SCREEN1.x, 0, SCREEN1.z)
  scr1.group.rotation.y = Math.atan2(AT.cam.x - SCREEN1.x, AT.cam.z - SCREEN1.z)
  root.add(scr1.group)
  solids.push(box(SCREEN1.x, SCREEN1.z, 0.7, 0.4))

  // the smoke machine on the sill
  const machine = new THREE.Group()
  const ledMat = new THREE.MeshStandardMaterial({ color: '#331100', emissive: '#ff6a1a', emissiveIntensity: 0 })
  mats.push(ledMat)
  {
    const body = new THREE.Mesh(G(new RoundedBoxGeometry(0.52, 0.28, 0.36, 3, 0.05)), M.black)
    body.position.y = 0.14
    const nozzle = new THREE.Mesh(G(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 12).rotateX(Math.PI / 2)), M.steel)
    nozzle.position.set(0.1, 0.17, -0.25)
    const led = new THREE.Mesh(G(new THREE.SphereGeometry(0.022, 10, 8)), ledMat)
    led.position.set(-0.15, 0.3, 0.1)
    const lid = new THREE.Mesh(G(new THREE.BoxGeometry(0.2, 0.012, 0.14)), M.steel)
    lid.position.set(-0.1, 0.286, 0)
    machine.add(body, nozzle, led, lid, hitBox(0.95, 0.7, 0.8, 0, 0.3, 0))
    machine.position.set(MACHINE.x, 0, MACHINE.z)
    machine.rotation.y = -0.2
    root.add(machine)
    solids.push(circle(MACHINE.x, MACHINE.z, 0.4))
  }
  // a plume out of the nozzle while it runs
  const plumeMat = new THREE.SpriteMaterial({ map: soft, color: '#c8c4be', transparent: true, depthWrite: false, opacity: 0 })
  mats.push(plumeMat)
  const plume = []
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(plumeMat)
    s.visible = false
    root.add(s)
    plume.push({ s, age: i / 7 })
  }

  // the dummy under the table
  const dummy = new THREE.Group()
  {
    const cloth = std('#b09560', { roughness: 0.95 })
    const strap = std('#c8451c', { roughness: 0.8 })
    const head = new THREE.Mesh(G(new THREE.SphereGeometry(0.11, 14, 10)), cloth)
    head.position.set(-0.66, 0.14, 0)
    const torso = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.12, 0.34, 6, 12).rotateZ(Math.PI / 2)), cloth)
    torso.position.set(-0.3, 0.15, 0)
    torso.scale.set(1, 0.95, 1.15)
    const band = new THREE.Mesh(G(new THREE.CylinderGeometry(0.125, 0.125, 0.06, 14).rotateZ(Math.PI / 2)), strap)
    band.position.set(-0.3, 0.15, 0)
    dummy.add(head, torso, band)
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.075, 0.55, 6, 10).rotateZ(Math.PI / 2)), cloth)
      leg.position.set(0.32, 0.1, s * 0.09)
      leg.rotation.y = s * 0.05
      const arm = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.05, 0.36, 6, 8).rotateZ(Math.PI / 2)), cloth)
      arm.position.set(-0.36, 0.1, s * 0.22)
      dummy.add(leg, arm)
    }
    dummy.add(hitBox(1.6, 0.4, 0.6, 0, 0.15, 0))
    dummy.position.set(DUMMY.x, 0.04, DUMMY.z)
    root.add(dummy)
  }
  // the cat in its basket
  const cat = new THREE.Group()
  {
    const basketM = std('#8a6a3e', { roughness: 0.9 })
    const ring = new THREE.Mesh(G(new THREE.TorusGeometry(R.basket.r, 0.035, 8, 24).rotateX(Math.PI / 2)), basketM)
    ring.position.y = R.basket.h
    const wall = new THREE.Mesh(G(new THREE.CylinderGeometry(R.basket.r, R.basket.r - 0.03, R.basket.h, 24, 1, true)), new THREE.MeshStandardMaterial({ color: '#8a6a3e', roughness: 0.9, side: THREE.DoubleSide }))
    wall.position.y = R.basket.h / 2
    const cushion = new THREE.Mesh(G(new THREE.CylinderGeometry(R.basket.r - 0.04, R.basket.r - 0.04, 0.05, 20)), std('#7a4d4a', { roughness: 1 }))
    cushion.position.y = 0.06
    const fur = std('#6c6864', { roughness: 1 })
    const body = new THREE.Mesh(G(new THREE.SphereGeometry(1, 16, 12)), fur)
    body.scale.set(0.26, 0.14, 0.2)
    body.position.set(-0.02, 0.2, 0)
    const head = new THREE.Mesh(G(new THREE.SphereGeometry(0.095, 14, 10)), fur)
    head.position.set(0.21, 0.24, 0.02)
    cat.add(ring, wall, cushion, body, head)
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(G(new THREE.ConeGeometry(0.035, 0.07, 6)), fur)
      ear.position.set(0.21, 0.33, s * 0.06 + 0.02)
      cat.add(ear)
    }
    const tail = new THREE.Mesh(G(new THREE.TorusGeometry(0.15, 0.035, 8, 16, Math.PI * 1.2)), fur)
    tail.position.set(-0.1, 0.17, 0)
    tail.rotation.set(Math.PI / 2, 0, 0.6)
    cat.add(tail, hitBox(0.8, 0.5, 0.8, 0, 0.25, 0))
    cat.position.set(CAT.x, 0.03, CAT.z)
    root.add(cat)
  }
  // the fox at the wood's edge: dark, hardly there
  const fox = new THREE.Group()
  {
    const fur = std('#33200f', { roughness: 1, emissive: '#080402', emissiveIntensity: 1 })
    const pale = std('#4a3a2a', { roughness: 1 })
    const body = new THREE.Mesh(G(new THREE.SphereGeometry(1, 14, 10)), fur)
    body.scale.set(0.2, 0.3, 0.2)
    body.position.set(0, 0.3, 0)
    const chest = new THREE.Mesh(G(new THREE.SphereGeometry(1, 12, 8)), pale)
    chest.scale.set(0.12, 0.18, 0.1)
    chest.position.set(0, 0.34, 0.14)
    const head = new THREE.Mesh(G(new THREE.SphereGeometry(0.1, 12, 10)), fur)
    head.position.set(0, 0.64, 0.05)
    const snout = new THREE.Mesh(G(new THREE.ConeGeometry(0.05, 0.16, 8).rotateX(Math.PI / 2)), fur)
    snout.position.set(0, 0.62, 0.17)
    fox.add(body, chest, head, snout)
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(G(new THREE.ConeGeometry(0.04, 0.12, 6)), fur)
      ear.position.set(s * 0.065, 0.76, 0.03)
      fox.add(ear)
    }
    const tail = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.07, 0.4, 6, 10).rotateZ(Math.PI / 2)), fur)
    tail.position.set(-0.3, 0.09, 0)
    tail.rotation.z = 0.12
    fox.add(tail, hitBox(0.9, 1.0, 0.9, 0, 0.45, 0))
    fox.position.set(FOX.x, 0, FOX.z)
    // sitting, facing the tripod
    fox.rotation.y = Math.atan2(CAM1.x - FOX.x, CAM1.z - FOX.z)
    root.add(fox)
  }

  const heatNow = () => CAMERA.heat
  const eyeBlind = () => CAMERA.view === 'room' && CAMERA.smoke > 0.55
  const cameraPanel = lv => ({
    title: E.sm.title,
    color,
    blocks: [
      {
        slider: {
          label: E.sm.slider,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(CAMERA.smoke * 100),
          onInput: v => setSmoke(v / 100),
          format: v => `${Math.round(v)} %`,
          live: () => Math.round(CAMERA.smoke * 100),
        },
      },
      {
        buttons: [
          { label: E.sm.buttons.machine, onClick: () => machineStep() },
          { label: E.sm.buttons.camera, onClick: () => cameraStep() },
          { label: E.sm.buttons.dummy, onClick: () => thingTap('dummy') },
          { label: E.sm.buttons.cat, onClick: () => thingTap('cat') },
          { label: E.sm.buttons.fox, onClick: () => foxStep() },
        ],
      },
      ...paras(E.sm.panel[depth(lv)]),
    ],
  })
  const nextHint = () => {
    if (CAMERA.view === 'room' && CAMERA.smoke < 0.3 && !CAMERA.heat) return 'smoke'
    if (!CAMERA.heat) return 'camera'
    if (!FOUND.dummy) return 'dummy'
    if (!FOUND.cat) return 'cat'
    if (!FOUND.fox) return 'fox'
    return 'done'
  }
  ex.add({
    id: 'smoke',
    x: AT.cam.x,
    z: AT.cam.z,
    radius: 2.0,
    manual: true,
    label: E.sm.label,
    verb: () => E.sm.hints[nextHint()],
    screens: [scr1],
    focus: { x: 0.6, y: 1.5, z: -2.4, size: 5.4, width: 4.6 },
    act: () => ctx.showPanel(cameraPanel),
  })
  const toSpot = () => discover('smoke', cameraPanel, 4.0, AT.cam)
  function setSmoke(k, byHand = true) {
    const was = CAMERA.smoke
    CAMERA.smoke = clamp(Number(k) || 0)
    CAMERA.want = CAMERA.smoke
    stage.smoke.set(CAMERA.smoke)
    if (byHand) {
      if ((was < 0.3) !== (CAMERA.smoke < 0.3) && CAMERA.smoke >= 0.3) say(at(E.sm.says.smokeOn, level()))
      ex.discover('smoke')
      scheduleShare('cam')
    }
  }
  let sendTimer = {}
  function scheduleShare(id) {
    if (sendTimer[id]) return
    sendTimer[id] = setTimeout(() => {
      sendTimer[id] = null
      share(id)
    }, 250)
  }
  function machineStep() {
    const on = CAMERA.smoke < 0.5
    CAMERA.want = on ? 0.9 : 0
    play(on ? 'select' : 'tap')
    say(at(E.sm.says[on ? 'machineOn' : 'machineOff'], level()))
    toSpot()
    share('cam')
  }
  function cameraStep() {
    CAMERA.heat = !CAMERA.heat
    play('select')
    let key
    if (CAMERA.heat) key = CAMERA.view === 'wood' ? 'heatWood' : CAMERA.smoke > 0.55 ? 'heatSmoke' : 'heatClear'
    else key = CAMERA.view === 'wood' ? 'eyeWood' : CAMERA.smoke > 0.55 ? 'eyeSmoke' : 'eyeClear'
    say(at(E.sm.says[key], level()))
    toSpot()
    share('cam')
  }
  /** Ask about a thing: the dummy, the cat, the radiator ... on the screen or in the room. */
  function thingTap(id) {
    CAMERA.view = 'room'
    const it = itemOf(id)
    if (!CAMERA.heat) {
      say(at(eyeBlind() ? E.sm.says.blind : E.sm.says.eyeThing, level()))
      play('tap')
      toSpot()
      share('cam')
      return
    }
    if (!MARKS.includes(id)) MARKS.push(id)
    play(it.find ? 'discover' : 'tap')
    const first = it.find && !FOUND[id]
    if (it.find) FOUND[id] = true
    const T = num(it.T, 0, lang)
    const line = E.sm.things[id] ?? E.sm.things.other
    say(fill(at(first && line.first ? line.first : line, level()), { t: T }))
    toSpot()
    share('cam')
  }
  function foxStep() {
    CAMERA.view = 'wood'
    play('select')
    if (!CAMERA.heat) {
      say(at(E.sm.says.woodEye, level()))
    } else {
      const first = !FOUND.fox
      FOUND.fox = true
      if (!MARKS.includes('fox')) MARKS.push('fox')
      play('discover')
      say(fill(at(first ? E.sm.things.fox.first : E.sm.things.fox.again, level()), { t: num(FOX_ITEM.T, 0, lang) }))
    }
    toSpot()
    share('cam')
  }
  function houseStep() {
    CAMERA.view = 'room'
    play('tap')
    toSpot()
    share('cam')
  }
  // taps: the camera, the machine, the dummy and cat in the room, the fox, the screen
  clickable(cam1, () => cameraStep(), { reach: 7 })
  clickable(machine, () => machineStep(), { reach: 8 })
  clickable(dummy, () => thingTap('dummy'), { reach: 12 })
  clickable(cat, () => thingTap('cat'), { reach: 12 })
  clickable(fox, () => foxStep(), { reach: 16 })
  const screenTap = hit => {
    if (!hit?.uv) return cameraStep()
    // the plane's uv to the image in pixels
    const X = hit.uv.x * CW
    const Y = (1 - hit.uv.y) * CH
    if (X < IMG.x || X > IMG.x + IMG.w || Y < IMG.y || Y > IMG.y + IMG.h) return cameraStep()
    if (CAMERA.view === 'wood') {
      if (Math.hypot(X - FOXPX.x, Y - (FOXPX.y - 60)) < 110) return foxStep()
      return houseStep()
    }
    const id = roomItemAt(X, Y)
    if (id) return thingTap(id)
    return cameraStep()
  }
  clickable(plane1, screenTap, { reach: 8 })
  clickable(scr1.group, () => cameraStep(), { reach: 8 })

  // the screen, redrawn when what it shows has changed enough to see
  let key1 = ''
  const view1 = lv => ({ mode: heatNow() ? 'heat' : 'eye', view: CAMERA.view, smoke: CAMERA.smoke, marks: MARKS, level: lv, lang, E: E.sm })
  updates.push((dt, t) => {
    // the machine runs the smoke up or down on its own
    if (Math.abs(CAMERA.want - CAMERA.smoke) > 0.002) {
      const rate = CAMERA.want > CAMERA.smoke ? 0.16 : 0.12
      const k = CAMERA.smoke + Math.sign(CAMERA.want - CAMERA.smoke) * rate * dt
      setSmokeAuto(k)
    }
    const on = CAMERA.want > 0.5
    ledMat.emissiveIntensity = on ? 2.4 : 0.15
    // the plume
    for (const p of plume) {
      p.s.visible = on && CAMERA.smoke < 0.85
      if (!p.s.visible) continue
      p.age = (p.age + dt * 0.5) % 1
      const a = p.age
      p.s.position.set(MACHINE.x + 0.05 - a * 0.1, 0.25 + a * 0.5, MACHINE.z - 0.4 - a * 0.9)
      const sc = 0.2 + a * 0.9
      p.s.scale.set(sc, sc, 1)
    }
    plumeMat.opacity = on ? 0.3 : 0
    // the camera swings between the room and the wood
    const want = aimYaw[CAMERA.view]
    let d = want - yaw
    d = Math.atan2(Math.sin(d), Math.cos(d))
    yaw += d * (1 - Math.exp(-3.5 * dt))
    cam1Aim.rotation.set(pitch, yaw, 0)
    const lv = level()
    const s = Math.round(CAMERA.smoke * 20)
    const bucket = CAMERA.smoke > 0.02 || heatNow() ? Math.floor(t * 4) : 0
    const key = `${heatNow()}|${CAMERA.view}|${s}|${bucket}|${MARKS.join()}|${lv}|${lang}`
    if (key === key1) return
    key1 = key
    view1Tex.userData.redraw(g => drawView1(g, { ...view1(lv), t }))
  })
  function setSmokeAuto(k) {
    CAMERA.smoke = clamp(k)
    stage.smoke.set(CAMERA.smoke)
    if (CAMERA.smoke >= 0.85 && CAMERA.want > 0 && !told.thick) {
      told.thick = true
      say(at(E.sm.says.thick, level()))
    }
    if (CAMERA.smoke <= 0.002) told.thick = false
  }
  const told = {}

  // ============================== station 2: the lens bench ==============================
  const BENCH_S = { win: 'open', geT: 20, heater: false }
  const SLOT = { glass: 0, ge: 1, open: 2 }
  const SEEN = { glass: false, ge: false, hot: false }
  const bench = new THREE.Group()
  bench.position.set(BENCH.x, 0, BENCH.zc)
  bench.rotation.y = BENCH.rot
  root.add(bench)
  {
    const top = new THREE.Mesh(G(new RoundedBoxGeometry(0.95, 0.06, BENCH.len, 2, 0.015)), M.wood)
    top.position.set(0, BENCH.top - 0.03, 0)
    bench.add(top)
    for (const sx_ of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(G(new THREE.BoxGeometry(0.07, BENCH.top - 0.06, 0.07)), M.dark)
        leg.position.set(sx_ * 0.4, (BENCH.top - 0.06) / 2, sz * (BENCH.len / 2 - 0.1))
        bench.add(leg)
      }
    }
    // a rail along the bench the parts sit on
    const rail = new THREE.Mesh(G(new THREE.BoxGeometry(0.07, 0.025, BENCH.len - 0.2)), M.steel)
    rail.position.set(0, BENCH.top + 0.012, 0)
    bench.add(rail)
    solids.push(box(BENCH.x, BENCH.zc, 1.0, BENCH.len, { rot: BENCH.rot }))
  }
  // the kettle at the far end, on a riser
  const kettle = new THREE.Group()
  const steamMat = new THREE.SpriteMaterial({ map: soft, color: '#dfe6ee', transparent: true, depthWrite: false, opacity: 0.1 })
  mats.push(steamMat)
  const steam = []
  {
    const riser = new THREE.Mesh(G(new THREE.BoxGeometry(0.4, 0.1, 0.4)), M.dark)
    riser.position.y = 0.05
    const chrome = std('#c4cad2', { roughness: 0.25, metalness: 0.9 })
    const body = new THREE.Mesh(G(new THREE.CylinderGeometry(0.1, 0.14, 0.26, 24)), chrome)
    body.position.y = 0.23
    const lidTop = new THREE.Mesh(G(new THREE.SphereGeometry(0.1, 16, 8, 0, TAU, 0, Math.PI / 2)), chrome)
    lidTop.position.y = 0.36
    const knob = new THREE.Mesh(G(new THREE.SphereGeometry(0.024, 10, 8)), M.black)
    knob.position.y = 0.455
    const spout = new THREE.Mesh(G(new THREE.CylinderGeometry(0.02, 0.04, 0.16, 8)), chrome)
    spout.position.set(0.15, 0.3, 0)
    spout.rotation.z = -1.0
    const handle = new THREE.Mesh(G(new THREE.TorusGeometry(0.1, 0.014, 8, 20, Math.PI)), M.black)
    handle.position.set(-0.12, 0.26, 0)
    handle.rotation.z = -Math.PI / 2 - 0.2
    kettle.add(riser, body, lidTop, knob, spout, handle, hitBox(0.5, 0.6, 0.5, 0, 0.3, 0))
    kettle.position.set(0, BENCH.top, KETTLE.z)
    kettle.rotation.y = -Math.PI / 2
    bench.add(kettle)
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Sprite(steamMat)
      bench.add(s)
      steam.push({ s, age: i / 5 })
    }
  }
  // the filter wheel: a disc on a post with three windows; the one at the bottom is in the beam
  const wheelStand = new THREE.Group()
  const wheel = new THREE.Group()
  const rings = {}
  const heaterGlow = new THREE.MeshStandardMaterial({ color: '#3a1a10', emissive: '#ff5a1a', emissiveIntensity: 0 })
  mats.push(heaterGlow)
  {
    const post = new THREE.Mesh(G(new THREE.CylinderGeometry(0.03, 0.04, WHEEL.y - BENCH.top, 10)), M.steel)
    post.position.set(0, (WHEEL.y - BENCH.top) / 2, 0)
    const foot = new THREE.Mesh(G(new THREE.CylinderGeometry(0.17, 0.2, 0.05, 20)), M.dark)
    foot.position.y = 0.025
    const hub = new THREE.Mesh(G(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16).rotateX(Math.PI / 2)), M.steel)
    hub.position.set(0, WHEEL.y - BENCH.top, 0)
    wheelStand.add(post, foot, hub)
    const shape = new THREE.Shape()
    shape.absarc(0, 0, WHEEL.r, 0, TAU, false)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU
      const hole = new THREE.Path()
      hole.absarc(-Math.sin(a) * WHEEL.slot, -Math.cos(a) * WHEEL.slot, 0.105, 0, TAU, true)
      shape.holes.push(hole)
    }
    const disc = new THREE.Mesh(G(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false, curveSegments: 36 }).translate(0, 0, -0.02)), std('#5a6068', { roughness: 0.45, metalness: 0.6 }))
    wheel.add(disc)
    const glassMat = new THREE.MeshStandardMaterial({ color: '#cfe8f0', transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0, side: THREE.DoubleSide, depthWrite: false })
    mats.push(glassMat)
    for (const id of ['glass', 'ge', 'open']) {
      const a = (SLOT[id] / 3) * TAU
      const g = new THREE.Group()
      const ring = new THREE.Mesh(G(new THREE.TorusGeometry(0.115, 0.022, 10, 28)), id === 'ge' ? M.black : M.dark)
      g.add(ring)
      if (id === 'glass') {
        const pane = new THREE.Mesh(G(new THREE.CircleGeometry(0.112, 28)), glassMat)
        g.add(pane)
      } else if (id === 'ge') {
        for (const s of [-1, 1]) {
          const f = new THREE.Mesh(G(new THREE.CircleGeometry(0.112, 28)), geFace)
          f.position.z = s * 0.006
          if (s < 0) f.rotation.y = Math.PI
          g.add(f)
        }
        // the heater: a clip on the mount, its element glowing when on
        const clip = new THREE.Mesh(G(new RoundedBoxGeometry(0.08, 0.05, 0.05, 2, 0.01)), M.steel)
        clip.position.set(0.13, 0.0, 0)
        const element = new THREE.Mesh(G(new THREE.BoxGeometry(0.05, 0.02, 0.054)), heaterGlow)
        element.position.set(0.13, 0.0, 0)
        g.add(clip, element)
      }
      // a short name under (on) the disc, beside the window
      const label = makeText(E.windows[id], { size: 0.036, color: '#e6eaff', maxWidth: 0.4 })
      label.position.set(0, -0.2, 0.03)
      g.add(label)
      g.add(hitBox(0.3, 0.3, 0.12, 0, 0, 0))
      // placed on the disc at its slot (slot 0 at the bottom)
      g.position.set(-Math.sin(a) * WHEEL.slot, -Math.cos(a) * WHEEL.slot, 0)
      g.rotation.z = -a
      wheel.add(g)
      rings[id] = g
    }
    wheel.position.set(0, WHEEL.y - BENCH.top, 0)
    wheelStand.add(wheel)
    wheelStand.position.set(0, BENCH.top, WHEEL.z)
    bench.add(wheelStand)
  }
  // the heat camera at the near end of the rail, looking down the beam
  const bcam = new THREE.Group()
  {
    const c = thermalCamera()
    c.position.set(0, 0.2, 0)
    bcam.add(c)
    const mount = new THREE.Mesh(G(new THREE.BoxGeometry(0.14, 0.1, 0.24)), M.dark)
    mount.position.set(0, 0.05, 0)
    bcam.add(mount)
    bcam.position.set(0, BEAM_Y - 0.21, BCAM.z)
    bench.add(bcam)
  }
  // the screen beside the bench
  const view2Tex = canvasTex(C2W, C2H, null, { mipmaps: true })
  textures.push(view2Tex)
  const scr2 = standingScreen({ width: 3.0, height: 1.66, color, title: E.bn.screenTitle, line: '', titleSize: 0.11 }, { top: 2.75, tilt: -0.1, mat: M.dark })
  const plane2 = new THREE.Mesh(G(new THREE.PlaneGeometry(2.84, (2.84 * C2H) / C2W)), new THREE.MeshBasicMaterial({ map: view2Tex, toneMapped: false }))
  plane2.position.y = -0.1
  scr2.content.add(plane2)
  scr2.group.position.set(SCREEN2.x, 0, SCREEN2.z)
  scr2.group.rotation.y = Math.atan2(AT.bench.x - SCREEN2.x, AT.bench.z - SCREEN2.z)
  root.add(scr2.group)
  solids.push(box(SCREEN2.x, SCREEN2.z, 0.7, 0.4))

  const benchPanel = lv => ({
    title: E.bn.title,
    color,
    blocks: [
      {
        slider: {
          label: E.bn.slider,
          min: 20,
          max: 220,
          step: 1,
          value: Math.round(BENCH_S.geT),
          onInput: v => setGeT(v),
          format: v => `${Math.round(v)} °C`,
          live: () => Math.round(BENCH_S.geT),
        },
      },
      {
        buttons: [
          { label: E.windows.glass, onClick: () => windowStep('glass') },
          { label: E.windows.ge, onClick: () => windowStep('ge') },
          { label: E.windows.open, onClick: () => windowStep('open') },
          { label: E.bn.buttons.heater, onClick: () => heaterStep() },
        ],
      },
      ...paras(E.bn.panel[depth(lv)]),
    ],
  })
  const benchHint = () => {
    if (!SEEN.glass) return 'glass'
    if (!SEEN.ge) return 'ge'
    if (!SEEN.hot) return 'heater'
    return 'any'
  }
  ex.add({
    id: 'bench',
    x: AT.bench.x,
    z: AT.bench.z,
    radius: 2.0,
    manual: true,
    label: E.bn.label,
    verb: () => E.bn.hints[benchHint()],
    screens: [scr2],
    focus: { x: -5.4, y: 1.6, z: -3.0, size: 4.4, width: 4.6 },
    act: () => ctx.showPanel(benchPanel),
  })
  const toBench = () => discover('bench', benchPanel, 4.0, AT.bench)
  function windowStep(id) {
    BENCH_S.win = id
    if (id === 'glass') SEEN.glass = true
    if (id === 'ge') SEEN.ge = true
    play('select')
    let key = id
    if (id === 'ge') key = BENCH_S.geT > 150 ? 'geHot' : BENCH_S.geT > 100 ? 'geWarm' : 'ge'
    say(at(E.bn.says[key], level()))
    toBench()
    share('bench')
  }
  function heaterStep() {
    BENCH_S.heater = !BENCH_S.heater
    play(BENCH_S.heater ? 'select' : 'tap')
    if (BENCH_S.heater) {
      BENCH_S.win = 'ge'
      SEEN.ge = true
    }
    say(at(E.bn.says[BENCH_S.heater ? 'heaterOn' : 'heaterOff'], level()))
    toBench()
    share('bench')
  }
  let hotTold = 0
  function setGeT(v) {
    BENCH_S.geT = clamp(Number(v) || 20, 20, 240)
    BENCH_S.heater = false
    if (BENCH_S.geT > 120) SEEN.hot = true
    if (BENCH_S.win !== 'ge') BENCH_S.win = 'ge'
    SEEN.ge = true
    ex.discover('bench')
    scheduleShare('bench')
  }
  const heaterWorld = () => rings.ge.localToWorld(new THREE.Vector3(0.13, 0, 0))
  const nearHeater = h => h.point.distanceTo(heaterWorld()) < 0.1
  clickable(rings.glass, () => windowStep('glass'), { reach: 6 })
  clickable(rings.open, () => windowStep('open'), { reach: 6 })
  clickable(rings.ge, () => windowStep('ge'), { reach: 6, accept: h => !nearHeater(h) })
  clickable(rings.ge, () => heaterStep(), { reach: 6, accept: nearHeater })
  clickable(kettle, () => {
    say(at(E.bn.says.kettle, level()))
    play('tap')
  }, { reach: 7 })

  let key2 = ''
  let wheelA = 0
  let wheelTarget = 0
  updates.push((dt, t) => {
    // the wheel turns its chosen window to the bottom (shortest way round)
    const goal = (SLOT[BENCH_S.win] / 3) * TAU
    let d = goal - wheelTarget
    wheelTarget += Math.atan2(Math.sin(d), Math.cos(d))
    d = wheelTarget - wheelA
    wheelA += d * (1 - Math.exp(-6 * dt))
    wheel.rotation.z = wheelA
    // the heater warms the germanium window, a window cools back to the room
    const goalT = BENCH_S.heater ? 240 : 20
    const rate = BENCH_S.heater ? 0.2 : 0.07
    BENCH_S.geT = goalT + (BENCH_S.geT - goalT) * Math.exp(-rate * dt)
    if (BENCH_S.heater && BENCH_S.geT > 232) BENCH_S.heater = BENCH_S.heater // holds there
    if (BENCH_S.geT > 120) SEEN.hot = true
    if (BENCH_S.heater && BENCH_S.win === 'ge' && BENCH_S.geT > 150 && !hotTold) {
      hotTold = 1
      say(at(E.bn.says.geHot, level()))
    }
    if (!BENCH_S.heater && BENCH_S.geT < 40) hotTold = 0
    heaterGlow.emissiveIntensity = BENCH_S.heater ? 2.4 : BENCH_S.geT > 60 ? 0.6 * smooth(60, 200, BENCH_S.geT) : 0
    // the germanium window itself, shown hot: a warm tint on the dark mirror
    geFace.emissive.setRGB(1, 1, 1).lerp(new THREE.Color('#ff7a2a'), smooth(100, 220, BENCH_S.geT))
    geFace.emissiveIntensity = 0.14 + 0.9 * smooth(140, 230, BENCH_S.geT)
    // the kettle's steam
    for (const s of steam) {
      s.age = (s.age + dt * 0.35) % 1
      s.s.position.set(0.06, BENCH.top + 0.5 + s.age * 0.4, KETTLE.z + 0.06)
      const sc = 0.1 + s.age * 0.3
      s.s.scale.set(sc, sc, 1)
    }
    const lv = level()
    const key = `${BENCH_S.win}|${Math.round(BENCH_S.geT / 2)}|${lv}|${lang}`
    if (key === key2) return
    key2 = key
    view2Tex.userData.redraw(g => drawView2(g, { win: BENCH_S.win, geT: BENCH_S.geT, level: lv, lang, t, E: { ...E.bn, windows: E.windows } }))
  })

  // ============================== station 3: hotter shines shorter ==============================
  const PL = { T: 20, want: 20 }
  const counter = new THREE.Group()
  const plateMat = new THREE.MeshStandardMaterial({ color: '#2b2d31', emissive: '#000000', emissiveIntensity: 0, roughness: 0.6 })
  mats.push(plateMat)
  const readout = makeText('20 °C', { size: 0.07, color: '#9affb0', anchorY: 'middle' })
  const dial = new THREE.Group()
  const iceBlock = new THREE.Group()
  const handBlock = new THREE.Group()
  const refKettle = new THREE.Group()
  {
    const topM = new THREE.Mesh(G(new THREE.BoxGeometry(COUNTER.w, 0.05, COUNTER.d)), M.top)
    topM.position.set(COUNTER.x, COUNTER.top - 0.025, COUNTER.z)
    const legs = new THREE.Mesh(G(new THREE.BoxGeometry(COUNTER.w - 0.1, COUNTER.top - 0.05, COUNTER.d - 0.1)), M.dark)
    legs.position.set(COUNTER.x, (COUNTER.top - 0.05) / 2, COUNTER.z)
    counter.add(topM, legs)
    // the hot plate: a ceramic disc in a steel case, a dial on the front
    const caseM = new THREE.Mesh(G(new RoundedBoxGeometry(0.5, 0.1, 0.5, 3, 0.03)), M.steel)
    caseM.position.set(PLATE.x, COUNTER.top + 0.05, PLATE.z)
    const disc = new THREE.Mesh(G(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 36)), plateMat)
    disc.position.set(PLATE.x, COUNTER.top + 0.112, PLATE.z)
    counter.add(caseM, disc)
    dial.add(new THREE.Mesh(G(new THREE.CylinderGeometry(0.045, 0.05, 0.04, 16).rotateX(Math.PI / 2)), M.black))
    const pointer = new THREE.Mesh(G(new THREE.BoxGeometry(0.01, 0.036, 0.012)), std('#ff8a2a', { emissive: '#ff6a1a', emissiveIntensity: 1 }))
    pointer.position.set(0, 0.026, 0.024)
    dial.add(pointer, hitBox(0.22, 0.22, 0.14, 0, 0, 0))
    dial.position.set(PLATE.x, COUNTER.top + 0.05, PLATE.z + 0.27)
    counter.add(dial)
    // a small display behind the plate
    const dBack = new THREE.Mesh(G(new THREE.BoxGeometry(0.34, 0.12, 0.03)), M.black)
    dBack.position.set(PLATE.x, COUNTER.top + 0.2, PLATE.z - 0.3)
    readout.position.set(PLATE.x, COUNTER.top + 0.2, PLATE.z - 0.282)
    counter.add(dBack, readout)
    // three things to put the plate's temperature to, along the back of the counter
    // ice: a clear cube, pale blue
    const iceM = new THREE.Mesh(G(new RoundedBoxGeometry(0.17, 0.17, 0.17, 3, 0.03)), new THREE.MeshStandardMaterial({ color: '#bfe6ff', transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0 }))
    iceM.position.y = 0.085
    iceBlock.add(iceM, hitBox(0.4, 0.4, 0.4, 0, 0.2, 0))
    iceBlock.position.set(COUNTER.x - 0.1, COUNTER.top, COUNTER.z + 0.1)
    // a hand: a palm and five fingers, flat on the counter (a warm one)
    const skin = std('#d9a07a', { roughness: 0.8 })
    const palm = new THREE.Mesh(G(new RoundedBoxGeometry(0.1, 0.03, 0.11, 2, 0.012)), skin)
    palm.position.set(0, 0.015, 0)
    handBlock.add(palm)
    for (let i = 0; i < 5; i++) {
      const f = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.0125, i === 0 ? 0.05 : 0.07 + (i === 2 ? 0.015 : 0), 4, 6)), skin)
      const a = (i - 2) * 0.22
      f.rotation.set(Math.PI / 2, 0, i === 0 ? -1.0 : -a)
      f.position.set(i === 0 ? 0.065 : (i - 2.4) * 0.024, 0.015, i === 0 ? -0.02 : -0.1)
      handBlock.add(f)
    }
    handBlock.add(hitBox(0.3, 0.2, 0.3, 0, 0.08, -0.04))
    handBlock.position.set(COUNTER.x + 0.35, COUNTER.top, COUNTER.z + 0.1)
    handBlock.rotation.y = -0.2
    // the small kettle
    const chrome = std('#c4cad2', { roughness: 0.25, metalness: 0.9 })
    const kb = new THREE.Mesh(G(new THREE.CylinderGeometry(0.06, 0.08, 0.15, 20)), chrome)
    kb.position.y = 0.075
    const kl = new THREE.Mesh(G(new THREE.SphereGeometry(0.06, 14, 8, 0, TAU, 0, Math.PI / 2)), chrome)
    kl.position.y = 0.15
    const ks = new THREE.Mesh(G(new THREE.CylinderGeometry(0.012, 0.024, 0.1, 8)), chrome)
    ks.position.set(0.09, 0.12, 0)
    ks.rotation.z = -1.0
    const kh = new THREE.Mesh(G(new THREE.TorusGeometry(0.06, 0.01, 8, 16, Math.PI)), M.black)
    kh.position.set(-0.07, 0.1, 0)
    kh.rotation.z = -Math.PI / 2 - 0.2
    refKettle.add(kb, kl, ks, kh, hitBox(0.3, 0.35, 0.3, 0, 0.17, 0))
    refKettle.position.set(COUNTER.x + 0.8, COUNTER.top, COUNTER.z + 0.1)
    counter.add(iceBlock, handBlock, refKettle)
    // little name cards in front of them
    for (const [id, x] of [['ice', COUNTER.x - 0.1], ['hand', COUNTER.x + 0.35], ['kettle', COUNTER.x + 0.8]]) {
      const t = makeText(E.refs[id], { size: 0.045, color: '#e6eaff', maxWidth: 0.4 })
      t.position.set(x, COUNTER.top + 0.002, COUNTER.z + 0.3)
      t.rotation.x = -Math.PI / 2
      counter.add(t)
    }
    root.add(counter)
    solids.push(box(COUNTER.x, COUNTER.z, COUNTER.w, COUNTER.d))
  }
  // the heat camera on a small tripod, looking at the plate
  const cam3 = new THREE.Group()
  {
    // on a little stand on the counter, left of the plate, looking at it
    const c = thermalCamera()
    c.position.y = 0.17
    const stand = new THREE.Mesh(G(new THREE.CylinderGeometry(0.02, 0.03, 0.12, 10)), M.dark)
    stand.position.y = 0.06
    const base = new THREE.Mesh(G(new THREE.CylinderGeometry(0.1, 0.11, 0.025, 16)), M.dark)
    base.position.y = 0.0125
    cam3.add(base, stand, c)
    cam3.position.set(PLATE.x - 0.6, COUNTER.top, PLATE.z + 0.15)
    cam3.rotation.y = Math.atan2(-0.6, 0.15)
    c.rotation.x = -0.12
    root.add(cam3)
  }
  const view3Tex = canvasTex(CW, CH, null, { mipmaps: true })
  textures.push(view3Tex)
  const scr3 = standingScreen({ width: 2.7, height: 1.92, color, title: E.pl.screenTitle, line: '', titleSize: 0.11 }, { top: 2.45, tilt: -0.1, mat: M.dark })
  const plane3 = new THREE.Mesh(G(new THREE.PlaneGeometry(2.5, (2.5 * CH) / CW)), new THREE.MeshBasicMaterial({ map: view3Tex, toneMapped: false }))
  plane3.position.y = -0.1
  scr3.content.add(plane3)
  scr3.group.position.set(SCREEN3.x, 0, SCREEN3.z)
  scr3.group.rotation.y = Math.atan2(AT.plate.x - SCREEN3.x, AT.plate.z - SCREEN3.z)
  root.add(scr3.group)
  solids.push(box(SCREEN3.x, SCREEN3.z, 0.7, 0.4))
  const DIAL_STEPS = [20, 100, 200, 300, 525, 700, 1000]
  const plateHint = () => {
    if (PL.want <= 25) return 'dial'
    if (!PLS.ref) return 'ref'
    return PL.want < 520 ? 'hotter' : 'any'
  }
  const PLS = { ref: false }
  const platePanel = lv => ({
    title: E.pl.title,
    color,
    blocks: [
      {
        slider: {
          label: E.pl.slider,
          min: 0,
          max: 1000,
          step: 5,
          value: Math.round(PL.want),
          onInput: v => setPlate(v, true),
          format: v => `${Math.round(v)} °C`,
          live: () => Math.round(PL.want),
        },
      },
      {
        buttons: [
          { label: E.pl.buttons.dial, onClick: () => dialStep() },
          { label: E.refs.ice, onClick: () => refStep('ice') },
          { label: E.refs.hand, onClick: () => refStep('hand') },
          { label: E.refs.kettle, onClick: () => refStep('kettle') },
        ],
      },
      ...paras(E.pl.panel[depth(lv)]),
    ],
  })
  ex.add({
    id: 'plate',
    x: AT.plate.x,
    z: AT.plate.z,
    radius: 2.0,
    manual: true,
    label: E.pl.label,
    verb: () => E.pl.hints[plateHint()],
    screens: [scr3],
    focus: { x: 6.2, y: 1.6, z: -3.0, size: 4.4, width: 4.4 },
    act: () => ctx.showPanel(platePanel),
  })
  const toPlate = () => discover('plate', platePanel, 4.0, AT.plate)
  const plateTell = (extra = '') => {
    const K = PL.want + K0
    return fill(at(E.pl.says.at, level()), { t: num(Math.round(PL.want), 0, lang), um: num(peakUm(K), 1, lang) }) + extra
  }
  function dialStep() {
    const i = DIAL_STEPS.findIndex(v => v > PL.want + 1)
    PL.want = i < 0 ? DIAL_STEPS[0] : DIAL_STEPS[i]
    play('select')
    let extra = ''
    if (PL.want === 525) extra = ' ' + at(E.pl.says.draper, level())
    if (PL.want === 1000) extra = ' ' + at(E.pl.says.top, level())
    say(plateTell(extra))
    toPlate()
    share('plate')
  }
  function refStep(id) {
    PL.want = REFS[id]
    PLS.ref = true
    play('select')
    say(fill(at(E.pl.says[id], level()), { t: num(REFS[id], 0, lang), um: num(peakUm(REFS[id] + K0), 1, lang) }))
    toPlate()
    share('plate')
  }
  function setPlate(v) {
    PL.want = clamp(Number(v) || 0, 0, 1000)
    ex.discover('plate')
    scheduleShare('plate')
  }
  clickable(dial, () => dialStep(), { reach: 6 })
  clickable(iceBlock, () => refStep('ice'), { reach: 6 })
  clickable(handBlock, () => refStep('hand'), { reach: 6 })
  clickable(refKettle, () => refStep('kettle'), { reach: 6 })
  clickable(plane3, () => dialStep(), { reach: 8 })
  let key3 = ''
  let lastRead = ''
  updates.push((dt, t) => {
    // the plate follows its dial: quick to warm, slower to cool
    const rate = PL.want > PL.T ? 1.3 : 0.9
    PL.T = PL.want + (PL.T - PL.want) * Math.exp(-rate * dt)
    if (Math.abs(PL.T - PL.want) < 0.3) PL.T = PL.want
    const g = glowOf(PL.T)
    plateMat.emissive.copy(g.color)
    plateMat.emissiveIntensity = g.k * 2.2
    plateMat.color.set('#2b2d31').lerp(new THREE.Color('#5a1a10'), smooth(300, 700, PL.T))
    const str = `${Math.round(PL.T)} °C`
    if (str !== lastRead) {
      lastRead = str
      readout.text = str
      readout.sync()
    }
    // the dial's turn follows the wanted temperature
    dial.rotation.z = -0.9 - (PL.want / 1000) * 4.6
    const lv = level()
    const key = `${Math.round(PL.T / 4)}|${lv}|${lang}`
    if (key === key3) return
    key3 = key
    view3Tex.userData.redraw(g2 => drawView3(g2, { T: PL.T, level: lv, lang, t, E: { ...E.pl, refs: E.refs } }))
  })

  // ============================== every frame ==============================
  updates.push((dt, t) => stage.update(t))

  // ---- shared with the room ----
  const camState = () => ({ heat: CAMERA.heat, smoke: Math.round(CAMERA.smoke * 100) / 100, want: CAMERA.want, view: CAMERA.view })
  const benchState = () => ({ win: BENCH_S.win, geT: Math.round(BENCH_S.geT * 10) / 10, heater: BENCH_S.heater })
  const plateState = () => ({ T: Math.round(PL.want) })

  return {
    env: stage.env,
    solids,
    cameraBounds: stage.cameraBounds,
    // the camera stays on the yard's side of the frame (behind it, it would look through the swirl)
    cameraClear(from, to) {
      const zf = BACK.z - 0.3
      if (to.z <= zf || from.z >= zf) return 1
      const k = (zf - from.z) / (to.z - from.z)
      const x = from.x + (to.x - from.x) * k
      const y = from.y + (to.y - from.y) * k
      return Math.abs(x - BACK.x) > 1.9 || y > 3.1 ? 1 : k
    },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    parts: {
      camera: {
        machine: () => machineStep(),
        heat: () => cameraStep(),
        tap: id => (id === 'fox' ? foxStep() : id === 'room' ? houseStep() : thingTap(id)), // 'dummy' | 'cat' | 'radiator' ...
        screen: (x, y) => screenTap({ uv: new THREE.Vector2(x / CW, 1 - y / CH) }),
        set: k => setSmoke(k),
        get state() { return { ...camState(), found: { ...FOUND }, marks: [...MARKS], hint: nextHint() } },
        // run the smoke up at once (for probes)
        skip: () => {
          CAMERA.smoke = CAMERA.want
          stage.smoke.set(CAMERA.smoke)
        },
      },
      bench: {
        tap: id => (id === 'heater' ? heaterStep() : windowStep(id)), // 'glass' | 'ge' | 'open' | 'heater'
        set: v => setGeT(v),
        // run the heater on (for probes), and tell the room
        skip: seconds => {
          const goal = BENCH_S.heater ? 240 : 20
          BENCH_S.geT = goal + (BENCH_S.geT - goal) * Math.exp(-(BENCH_S.heater ? 0.2 : 0.07) * (Number(seconds) || 0))
          share('bench')
        },
        get state() { return { ...benchState(), seen: { ...SEEN }, tau: geTau(BENCH_S.geT) } },
      },
      plate: {
        dial: () => dialStep(),
        ref: id => refStep(id), // 'ice' | 'hand' | 'kettle'
        set: v => setPlate(v),
        get state() { return { T: PL.T, want: PL.want } },
      },
      at: {
        camera: () => cam1.localToWorld(new THREE.Vector3(0, CAM1.y + 0.1, 0)),
        machine: () => machine.localToWorld(new THREE.Vector3(0, 0.3, 0)),
        dummy: () => dummy.localToWorld(new THREE.Vector3(-0.3, 0.15, 0)),
        cat: () => cat.localToWorld(new THREE.Vector3(0, 0.25, 0)),
        fox: () => fox.localToWorld(new THREE.Vector3(0, 0.5, 0)),
        glass: () => rings.glass.localToWorld(new THREE.Vector3(0, 0, 0)),
        ge: () => rings.ge.localToWorld(new THREE.Vector3(0, 0, 0)),
        open: () => rings.open.localToWorld(new THREE.Vector3(0, 0, 0)),
        heater: () => heaterWorld(),
        dial: () => dial.localToWorld(new THREE.Vector3(0, 0, 0)),
        ice: () => iceBlock.localToWorld(new THREE.Vector3(0, 0.1, 0)),
        hand: () => handBlock.localToWorld(new THREE.Vector3(0, 0.03, -0.04)),
        refKettle: () => refKettle.localToWorld(new THREE.Vector3(0, 0.1, 0)),
      },
      // a ray from the camera to a point, as a tap there would cast
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { smoke: cameraPanel, bench: benchPanel, plate: platePanel },
    shared: {
      cam: {
        get: camState,
        set: s => {
          CAMERA.heat = !!s?.heat
          CAMERA.view = s?.view === 'wood' ? 'wood' : 'room'
          CAMERA.want = clamp(Number(s?.want) || 0)
          CAMERA.smoke = clamp(Number(s?.smoke) || 0)
          stage.smoke.set(CAMERA.smoke)
        },
      },
      bench: {
        get: benchState,
        set: (s, liveSet, ago = 0) => {
          BENCH_S.win = ['glass', 'ge', 'open'].includes(s?.win) ? s.win : 'open'
          BENCH_S.heater = !!s?.heater
          BENCH_S.geT = clamp(Number(s?.geT) || 20, 20, 240)
          const goal = BENCH_S.heater ? 240 : 20
          const n = Math.min(Number(ago) || 0, 120)
          BENCH_S.geT = goal + (BENCH_S.geT - goal) * Math.exp(-(BENCH_S.heater ? 0.2 : 0.07) * n)
        },
      },
      plate: {
        get: plateState,
        set: s => {
          PL.want = clamp(Number(s?.T) || 0, 0, 1000)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const k of Object.values(sendTimer)) clearTimeout(k)
      for (const g of geos) g.dispose()
      for (const m of mats) m.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
