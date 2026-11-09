// Silver's picture "How were photos made before phones?" as a room (docs/knowledge/picture-rooms.md): a
// photographer's studio and, through a curtained door, a darkroom (stages/darkroom.js). The darkroom is the
// picture's own place (brick wall, the red safelight, the enlarger and its three trays, prints on a line);
// the studio is where Daguerre's plate and the silver bromide crystal live. Three things to do, each step
// chosen by tapping its thing (the user, 2026-10-30; the prompt names the next tap, E opens the panel whose
// buttons and sliders do the same):
// - the plate (studio, west): a silvered copper plate goes to the iodine box (it turns golden yellow), into
//   the wooden camera (the exposure slider, from seconds to twenty minutes: a little puppet bear sits for
//   its portrait and wiggles more the longer it takes; the plaster bust beside it never moves), over the
//   mercury (the picture comes up out of nothing), into the hypo (the yellow goes) and onto an easel, where
//   tilting it swaps positive and negative (a daguerreotype is a mirror);
// - the crystal (studio, east): a crystal of silver bromide as big as a table. Tap the blue lamp: one photon
//   frees an electron from a bromide ion, the electron wanders to a speck on the surface, a silver ion
//   joins it and becomes an atom (Gurney and Mott, 1938). Four atoms and the speck lights up. Tap the
//   developer and the whole crystal turns into black silver (a gain of about a billion). A strip of film on
//   the wall shows, from a light slider, how many grains turn black (a Poisson count against four) and so
//   the greys of a picture;
// - the darkroom bench: the enlarger shines a cat's negative onto paper (a slider for the seconds: pale,
//   good or dark), then the trays in any order (developer, stop bath, fixer, wash; the minutes run ten
//   times faster) and the line with its pegs. The white light switch is the trap: any paper not yet fixed
//   goes grey under it, which is also what an unfixed print does in daylight.
// All three are shared in a room (src/net/shared.js). parts.<exhibit>.tap(...) does what a tap does, for the
// probes. The sitter is a bear because a person cannot sit still for minutes; no real person's words or face.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, random, fill, num, smooth, screen, standingScreen } from '../../../wings/noble/kit.js'
import { darkroomStage, DARKROOM } from '../../stages/darkroom.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { PHOTO_WORDS } from './photo.words.js'

export const WORDS = PHOTO_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const Q = v => Math.round(v * 100) / 100
// the direction (yaw of an object that faces +z) from a point to another
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z)

// ---- where things stand (metres; the spawn at z = 4.6 looks along -z, at the darkroom's door) ----
const D = DARKROOM
// station 1, the plate: bench along the partition, the camera and the chair on the west side
const B1 = { z: 0.15, top: 0.9 }
const SPOT = { stack: -6.5, iodine: -5.35, mercury: -4.2, hypo: -3.05, easel: -1.9 }
const CAM = { x: -3.8, z: 4.7 }
const CHAIR = { x: -6.4, z: 4.5 }
const BUST = { x: -6.5, z: 5.95 }
const PLATE = { w: 0.36, h: 0.46, t: 0.014 }
// station 2, the crystal: east side
const CR = { x: 4.9, y: 1.75, z: 2.3 }
const LAMP = { x: 2.5, z: 3.9, y: 1.7 }
const DEVTABLE = { x: 6.8, z: 4.4, top: 0.8 }
const STRIP = { x: D.x1 - 0.12, y: 1.75, z: 2.3, w: 3.2, h: 1.3 }
const SP = 0.3 // spacing of the crystal's ions
// station 3, the bench in the darkroom
const B3 = { x0: -3.8, x1: 3.8, z0: -11.9, z1: -10.35, top: 0.9 }
const TRAY = { dev: -1.4, stop: -0.45, fix: 0.5, wash: 1.45, z: -11.0, w: 0.85, d: 0.62, lift: 0.1, tilt: 0.32 }
const ENL = { x: -3.1, z: -11.05 }
const SLOTS = Array.from({ length: 7 }, (_, i) => -2.7 + i * 0.9)
const LINE = { y: 2.78, z: -11.65 }
const PAPER = { w: 0.5, h: 0.375 }
const THREE_STEPS = ['dev', 'stop', 'fix', 'wash']

// ---- pictures drawn on canvases ----

let matcapTex = null
/** Polished silver as a drawn matcap (a flat face still shows a mirror's sheen as it turns). */
function silverMatcap() {
  if (matcapTex) return matcapTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 128)
  for (const [o, col] of [[0, '#e6eaf0'], [0.45, '#aab1bc'], [0.6, '#5d636e'], [1, '#8e95a0']]) base.addColorStop(o, col)
  g.fillStyle = base
  g.fillRect(0, 0, 128, 128)
  const w = g.createRadialGradient(46, 40, 0, 46, 40, 40)
  w.addColorStop(0, 'rgba(255,255,255,0.85)')
  w.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = w
  g.fillRect(0, 0, 128, 128)
  matcapTex = new THREE.CanvasTexture(c)
  matcapTex.colorSpace = THREE.SRGBColorSpace
  matcapTex.userData.shared = true
  return matcapTex
}

/** The studio's painted backdrop: a balustrade, two columns, a garden fading to a pale sky. */
function drawBackdrop(g, w, h) {
  const sky = g.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#9db4c8')
  sky.addColorStop(0.55, '#d8d2b8')
  sky.addColorStop(1, '#7c8a64')
  g.fillStyle = sky
  g.fillRect(0, 0, w, h)
  const rnd = random(4)
  g.fillStyle = '#5f7a55'
  for (let i = 0; i < 26; i++) {
    g.beginPath()
    g.arc(rnd() * w, h * (0.52 + rnd() * 0.12), 20 + rnd() * 34, 0, TAU)
    g.fill()
  }
  g.fillStyle = '#c9c0a4'
  g.fillRect(0, h * 0.7, w, h * 0.06)
  g.fillStyle = '#b3a98c'
  for (let x = 12; x < w; x += 34) g.fillRect(x, h * 0.76, 14, h * 0.14)
  g.fillStyle = '#c9c0a4'
  g.fillRect(0, h * 0.9, w, h * 0.1)
  for (const x of [0.1, 0.9]) {
    g.fillStyle = '#cfc7ae'
    g.fillRect(w * x - 22, 0, 44, h * 0.9)
    g.fillStyle = '#aaa088'
    for (let k = 0; k < 4; k++) g.fillRect(w * x - 22 + k * 11, 0, 3, h * 0.9)
    g.fillStyle = '#d9d1b8'
    g.fillRect(w * x - 34, 0, 68, 24)
  }
  const drape = g.createLinearGradient(0, 0, w, 0)
  drape.addColorStop(0, 'rgba(110,40,50,0.75)')
  drape.addColorStop(0.12, 'rgba(110,40,50,0)')
  drape.addColorStop(0.88, 'rgba(110,40,50,0)')
  drape.addColorStop(1, 'rgba(110,40,50,0.75)')
  g.fillStyle = drape
  g.fillRect(0, 0, w, h)
}

/** The daguerreotype's picture as lightness (0 dark, 1 bright) on a canvas: the backdrop, the plaster bust
 *  (still, always sharp) and the bear on its chair (ghosted by how far it moved during the exposure). */
function drawScene(g, w, h, wiggle) {
  const grey = v => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`
  const bg = g.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, grey(0.66))
  bg.addColorStop(0.7, grey(0.5))
  bg.addColorStop(1, grey(0.3))
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  for (const x of [8, w - 36]) {
    g.fillStyle = grey(0.76)
    g.fillRect(x, 0, 28, h * 0.8)
    g.fillStyle = grey(0.6)
    g.fillRect(x + 4, 0, 4, h * 0.8)
  }
  g.fillStyle = grey(0.55)
  g.fillRect(0, h * 0.7, w, 8)
  g.fillStyle = grey(0.42)
  for (let x = 6; x < w; x += 22) g.fillRect(x, h * 0.74, 9, 36)
  // the plaster bust on its pedestal (left: on the camera's left)
  g.fillStyle = grey(0.8)
  g.fillRect(24, h * 0.66, 40, h * 0.34)
  g.fillStyle = grey(0.9)
  g.beginPath()
  g.ellipse(44, h * 0.5, 17, 24, 0, 0, TAU)
  g.fill()
  g.beginPath()
  g.ellipse(44, h * 0.64, 29, 14, 0, 0, TAU)
  g.fill()
  g.fillStyle = grey(0.6)
  g.fillRect(36, h * 0.48, 5, 3)
  g.fillRect(48, h * 0.48, 5, 3)
  g.fillRect(41, h * 0.55, 6, 2)
  // the chair back and the bear (right)
  g.fillStyle = grey(0.2)
  g.fillRect(w * 0.52, h * 0.3, w * 0.42, h * 0.7)
  const bear = (dx, dy, a) => {
    g.globalAlpha = a
    g.fillStyle = grey(0.46)
    g.beginPath()
    g.ellipse(w * 0.72 + dx, h * 0.8 + dy, 26, 34, 0, 0, TAU)
    g.fill()
    g.fillStyle = grey(0.56)
    g.beginPath()
    g.arc(w * 0.72 + dx, h * 0.52 + dy, 23, 0, TAU)
    g.arc(w * 0.72 + dx - 19, h * 0.52 + dy - 19, 8, 0, TAU)
    g.arc(w * 0.72 + dx + 19, h * 0.52 + dy - 19, 8, 0, TAU)
    g.fill()
    g.fillStyle = grey(0.74)
    g.beginPath()
    g.ellipse(w * 0.72 + dx, h * 0.57 + dy, 10, 7.5, 0, 0, TAU)
    g.fill()
    g.fillStyle = grey(0.08)
    g.beginPath()
    g.arc(w * 0.72 + dx - 8, h * 0.5 + dy, 2.6, 0, TAU)
    g.arc(w * 0.72 + dx + 8, h * 0.5 + dy, 2.6, 0, TAU)
    g.arc(w * 0.72 + dx, h * 0.55 + dy, 2.4, 0, TAU)
    g.fill()
    g.globalAlpha = 1
  }
  // motion blur by ghosts: the more it moved, the fainter the sharp bear and the more the copies
  const sharp = wiggle < 1.5 ? 1 : Math.max(0.2, 1 - wiggle / 18)
  const copies = 9
  if (sharp < 1) for (let i = 0; i < copies; i++) bear(((i / (copies - 1)) * 2 - 1) * wiggle, ((i / (copies - 1)) * 2 - 1) * wiggle * 0.25, ((1 - sharp) * 1.7) / copies)
  bear(0, 0, sharp)
}

/** Redraw the plate's two overlays for an exposure of `expo` seconds: the picture as a positive and as a
 *  negative, drawn with an opacity for how much light the plate had (and flatter when over-exposed). */
function paintPlate(pos, neg, expo) {
  const w = 192
  const h = 240
  const tmp = document.createElement('canvas')
  tmp.width = w
  tmp.height = h
  const t = tmp.getContext('2d')
  drawScene(t, w, h, clamp(expo / 45, 0.4, 28) * 0.6)
  const src = t.getImageData(0, 0, w, h).data
  const v = 1 - Math.exp(-expo / 90)
  const burn = smooth(480, 1200, expo)
  const alpha = Math.round(255 * v * (1 - 0.45 * burn) * 0.94)
  for (const [tex, invert] of [[pos, false], [neg, true]]) {
    tex.userData.redraw(g => {
      const img = g.createImageData(w, h)
      for (let i = 0; i < w * h; i++) {
        let y = src[i * 4] / 255
        y = Math.min(1, y * (1 + 0.5 * burn))
        if (invert) y = 1 - y
        img.data[i * 4] = y * 240
        img.data[i * 4 + 1] = y * 245
        img.data[i * 4 + 2] = y * 255
        img.data[i * 4 + 3] = alpha
      }
      g.putImageData(img, 0, 0)
    })
  }
}

const CAT = { w: 256, h: 192 }
/** The darkroom's cat (the picture's own): a sitting cat against a bright wall and a dark window. */
function drawCat(g, w, h) {
  const grey = v => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`
  const bg = g.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, grey(0.9))
  bg.addColorStop(1, grey(0.74))
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  // the window: dark panes in a pale frame, a sill
  g.fillStyle = grey(0.28)
  g.fillRect(150, 18, 84, 100)
  g.fillStyle = grey(0.82)
  g.fillRect(188, 18, 5, 100)
  g.fillRect(150, 64, 84, 5)
  g.fillStyle = grey(0.5)
  g.fillRect(0, 150, w, 42)
  g.fillStyle = grey(0.62)
  g.fillRect(0, 148, w, 5)
  // the cat: a dark pear of a body, a round head, ears, a curling tail
  g.fillStyle = grey(0.1)
  g.beginPath()
  g.ellipse(86, 124, 40, 46, 0, 0, TAU)
  g.fill()
  g.beginPath()
  g.arc(86, 66, 29, 0, TAU)
  g.fill()
  g.beginPath()
  g.moveTo(62, 52)
  g.lineTo(60, 26)
  g.lineTo(80, 42)
  g.fill()
  g.beginPath()
  g.moveTo(110, 52)
  g.lineTo(112, 26)
  g.lineTo(92, 42)
  g.fill()
  g.strokeStyle = grey(0.1)
  g.lineCap = 'round'
  g.lineWidth = 13
  g.beginPath()
  g.moveTo(120, 150)
  g.bezierCurveTo(168, 156, 178, 132, 160, 118)
  g.stroke()
  // a paler chest, bright eyes, fur and whiskers
  g.fillStyle = grey(0.3)
  g.beginPath()
  g.ellipse(86, 108, 15, 24, 0, 0, TAU)
  g.fill()
  g.fillStyle = grey(0.96)
  for (const x of [75, 97]) {
    g.beginPath()
    g.ellipse(x, 64, 6.5, 8, 0, 0, TAU)
    g.fill()
  }
  g.fillStyle = grey(0.05)
  for (const x of [75, 97]) g.fillRect(x - 1, 57, 2.4, 14)
  g.strokeStyle = grey(0.78)
  g.lineWidth = 1.3
  for (const s of [-1, 1]) {
    for (const dy of [-3, 2, 7]) {
      g.beginPath()
      g.moveTo(86 + s * 12, 78 + dy * 0.5)
      g.lineTo(86 + s * 42, 78 + dy)
      g.stroke()
    }
  }
  g.strokeStyle = grey(0.26)
  g.lineWidth = 2
  for (let i = 0; i < 9; i++) {
    g.beginPath()
    g.moveTo(52 + i * 8, 100)
    g.lineTo(48 + i * 9, 146)
    g.stroke()
  }
}
let catLight = null
/** The cat's lightness as a Float32Array (and its negative's transmission for the enlarger's card). */
function catPixels() {
  if (catLight) return catLight
  const c = document.createElement('canvas')
  c.width = CAT.w
  c.height = CAT.h
  const g = c.getContext('2d')
  drawCat(g, CAT.w, CAT.h)
  const d = g.getImageData(0, 0, CAT.w, CAT.h).data
  catLight = new Float32Array(CAT.w * CAT.h)
  for (let i = 0; i < catLight.length; i++) catLight[i] = d[i * 4] / 255
  return catLight
}
/** The print's lightness for an exposure of `secs` under the enlarger: bright parts of the scene are dense in
 *  the negative, so little light reaches the paper there; lightness falls off exponentially with the light
 *  (E0 = 4 gives a full range at about 12 s). */
function printTexture(secs) {
  const P = catPixels()
  return canvasTex(CAT.w, CAT.h, (g, w, h) => {
    const img = g.createImageData(w, h)
    for (let i = 0; i < w * h; i++) {
      const T = clamp(1 - P[i] * 0.95, 0.04, 0.96)
      const L = Math.exp((-secs * T) / 4)
      const x = i % w
      const y = (i / w) | 0
      const edge = x < 5 || y < 5 || x >= w - 5 || y >= h - 5
      const v = edge ? 1 : L
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v * 255
      img.data[i * 4 + 3] = 255
    }
    g.putImageData(img, 0, 0)
  }, { mipmaps: false })
}
/** The cat's negative: what the enlarger's lamp sends through (bright where the scene was dark). */
function negativeTexture() {
  const P = catPixels()
  return canvasTex(CAT.w, CAT.h, (g, w, h) => {
    const img = g.createImageData(w, h)
    for (let i = 0; i < w * h; i++) {
      const v = clamp(1 - P[i] * 0.95, 0.04, 0.96)
      img.data[i * 4] = v * 255
      img.data[i * 4 + 1] = v * 252
      img.data[i * 4 + 2] = v * 245
      img.data[i * 4 + 3] = 255
    }
    g.putImageData(img, 0, 0)
  }, { mipmaps: false })
}
/** Small prints for the line (as lightness): a mountain and a sun, a house, a sailing boat. */
function drawKeepsake(kind) {
  return canvasTex(128, 96, (g, w, h) => {
    const grey = v => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`
    g.fillStyle = grey(0.86)
    g.fillRect(0, 0, w, h)
    g.fillStyle = grey(0.26)
    if (kind === 0) {
      g.beginPath()
      g.moveTo(8, 84)
      g.lineTo(44, 36)
      g.lineTo(66, 62)
      g.lineTo(88, 28)
      g.lineTo(122, 84)
      g.fill()
      g.fillStyle = grey(0.99)
      g.beginPath()
      g.arc(98, 22, 9, 0, TAU)
      g.fill()
    } else if (kind === 1) {
      g.fillRect(34, 46, 60, 38)
      g.beginPath()
      g.moveTo(26, 48)
      g.lineTo(64, 18)
      g.lineTo(102, 48)
      g.fill()
      g.fillStyle = grey(0.8)
      g.fillRect(56, 60, 14, 24)
    } else {
      g.fillRect(10, 70, 108, 16)
      g.beginPath()
      g.moveTo(60, 14)
      g.lineTo(60, 66)
      g.lineTo(88, 66)
      g.fill()
      g.beginPath()
      g.moveTo(54, 24)
      g.lineTo(54, 66)
      g.lineTo(34, 66)
      g.fill()
    }
  }, { mipmaps: false })
}

/** A piece of film seen close: grains as squares, black where a grain took four photons or more (a Poisson
 *  count with mean L, seeded so everyone sees the same), beside a wedge of greys for L = 0.5 to 12. */
const WEDGE = [0.5, 1, 2, 3, 4, 6, 8, 12]
const shareBlack = L => 1 - Math.exp(-L) * (1 + L + (L * L) / 2 + (L * L * L) / 6)
function paintStrip(g, w, h, L, words, lang) {
  g.fillStyle = '#16131a'
  g.fillRect(0, 0, w, h)
  const gx = 64
  const gy = 34
  const cell = 9
  const ox = 24
  const oy = 70
  const rnd = random(77)
  // a grain's photons: Poisson from a fixed uniform each, so the slider moves a grain's count smoothly
  for (let j = 0; j < gy; j++) {
    for (let i = 0; i < gx; i++) {
      const u = rnd()
      // the count k with P(N <= k) >= u
      let k = 0
      let p = Math.exp(-L)
      let cum = p
      while (cum < u && k < 30) {
        k++
        p *= L / k
        cum += p
      }
      const black = k >= 4
      const v = black ? 22 : 206
      g.fillStyle = `rgb(${v},${v - 6},${v - 14})`
      g.fillRect(ox + i * cell, oy + j * cell, cell - 2, cell - 2)
    }
  }
  const pct = Math.round(shareBlack(L) * 100)
  g.fillStyle = '#ffd9d4'
  g.font = '700 40px Outfit, sans-serif'
  g.textBaseline = 'alphabetic'
  g.fillText(words.title, ox, 52)
  g.font = '700 34px Nunito, sans-serif'
  g.fillStyle = '#e7e3ea'
  g.fillText(fill(words.share, { p: `${pct}%` }), ox, h - 14)
  // the wedge: eight greys, the one nearest L ringed
  const wx = ox + gx * cell + 44
  g.font = '700 22px Nunito, sans-serif'
  let nearest = 0
  WEDGE.forEach((v, i) => {
    if (Math.abs(v - L) < Math.abs(WEDGE[nearest] - L)) nearest = i
  })
  WEDGE.forEach((v, i) => {
    const y = oy + i * 36
    const grey = Math.round(212 * (1 - shareBlack(v)) + 22 * shareBlack(v))
    g.fillStyle = `rgb(${grey},${grey - 4},${grey - 10})`
    g.fillRect(wx, y, 74, 30)
    g.fillStyle = '#e7e3ea'
    g.fillText(num(v, v < 1 ? 1 : 0, lang), wx + 88, y + 23)
    if (i === nearest) {
      g.strokeStyle = '#ff5f6d'
      g.lineWidth = 4
      g.strokeRect(wx - 5, y - 4, 84, 38)
    }
  })
}

// ---- small builders ----

let dotTex = null
function softDot() {
  if (dotTex) return dotTex
  dotTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  dotTex.userData.shared = true
  return dotTex
}

/** Fumes rising from a box: points drifting up in a short column, fading in while `on`. */
function vapour({ color, n = 26, x, y, z, rx = 0.2, rz = 0.16, rise = 0.5, size = 0.09 }) {
  const pos = new Float32Array(n * 3)
  const seed = Array.from({ length: n }, (_, i) => [Math.random(), Math.random(), i / n])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ color, size, map: softDot(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.raycast = () => {}
  let k = 0
  return {
    points,
    update(t, dt, on) {
      k = damp(k, on ? 1 : 0, 2, dt)
      mat.opacity = 0.5 * k
      points.visible = k > 0.02
      for (let i = 0; i < n; i++) {
        const [a, b, c] = seed[i]
        const u = (t * 0.18 + c) % 1
        pos[i * 3] = x + (a - 0.5) * 2 * rx + Math.sin(t + c * 9) * 0.03
        pos[i * 3 + 1] = y + u * rise
        pos[i * 3 + 2] = z + (b - 0.5) * 2 * rz
      }
      geo.attributes.position.needsUpdate = true
    },
  }
}

/** A tray: floor and four low walls (so what lies in it shows), with a translucent liquid. */
function tray({ w, d, h, liquid, level = 0.6, alpha = 0.6, mat }) {
  const g = new THREE.Group()
  const t = 0.02
  const part = (sx, sy, sz, px, py, pz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat)
    m.position.set(px, py, pz)
    g.add(m)
  }
  part(w, t, d, 0, t / 2, 0)
  part(w, h, t, 0, h / 2, d / 2 - t / 2)
  part(w, h, t, 0, h / 2, -d / 2 + t / 2)
  part(t, h, d, w / 2 - t / 2, h / 2, 0)
  part(t, h, d, -w / 2 + t / 2, h / 2, 0)
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * t, d - 2 * t), new THREE.MeshStandardMaterial({ color: liquid, transparent: true, opacity: alpha, roughness: 0.2, depthWrite: false }))
  surface.rotation.x = -Math.PI / 2
  surface.position.y = h * level + t
  g.add(surface)
  return { group: g, surface }
}

/** A box with a hinged lid and an open top under it (so a plate inside shows while the lid is up). */
function hingedBox({ w, h, d, body, lid, feet = 0 }) {
  const g = new THREE.Group()
  const t = 0.025
  const part = (sx, sy, sz, px, py, pz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), body)
    m.position.set(px, feet + py, pz)
    g.add(m)
  }
  part(w, t, d, 0, t / 2, 0)
  part(w, h, t, 0, h / 2, d / 2 - t / 2)
  part(w, h, t, 0, h / 2, -d / 2 + t / 2)
  part(t, h, d, w / 2 - t / 2, h / 2, 0)
  part(t, h, d, -w / 2 + t / 2, h / 2, 0)
  const pivot = new THREE.Group()
  pivot.position.set(0, feet + h, -d / 2)
  const l = new THREE.Mesh(new RoundedBoxGeometry(w + 0.02, 0.035, d + 0.02, 2, 0.01), lid)
  l.position.set(0, 0.0175, d / 2)
  pivot.add(l)
  g.add(pivot)
  return { group: g, setOpen: k => (pivot.rotation.x = -1.35 * k) }
}

/** A stick between two points. */
function stick(a, b, r, mat) {
  const len = a.distanceTo(b)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize())
  return m
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, light, level, clickable, color, lang }) {
  const stage = darkroomStage({ light, sign: E.sign })
  root.add(stage.group)
  const solids = stage.solids
  const mats = stage.mats
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const keep = t => (textures.push(t), t)
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (arr, lv) => arr[depthOf(lv)].map(p => ({ p }))
  const tell = (entry, vars) => say(fill(at(entry, level()), vars))
  const timeText = s => (s < 90 ? `${Math.round(s)} s` : `${num(s / 60, 1, lang)} min`)
  let mine = false // the last change was this visitor's (only then the Atomling tells what happens)
  const add = (geo, mat, x, y, z, parent = root) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d)
  const label = (text, { size = 0.09, c = '#f1e6d6', maxWidth = 1 } = {}) => makeText(text, { size, color: c, maxWidth })
  // a dark back for a standing board, so its glowing edge is not a pink slab seen from behind
  const backing = (panel, w, h) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: '#1b1822', roughness: 0.8 }))
    m.rotation.y = Math.PI
    m.position.z = -0.03
    panel.add(m)
  }
  // a place card on the bench: a dark plaque with the name, nearly upright so a standing eye reads it
  const flatLabel = (text, x, y, z, size = 0.085) => {
    const card = new THREE.Group()
    const w = Math.max(0.5, Math.min(0.8, text.length * size * 0.62 + 0.12))
    const plaque = new THREE.Mesh(new RoundedBoxGeometry(w, size * 1.9, 0.02, 2, 0.008), new THREE.MeshStandardMaterial({ color: '#1b1822', roughness: 0.6 }))
    card.add(plaque)
    const t = label(text, { size, c: '#ffe3df', maxWidth: w })
    t.position.z = 0.013
    card.add(t)
    card.rotation.x = -0.28
    card.position.set(x, y + size * 0.95 + 0.03, z - 0.0)
    root.add(card)
    return card
  }
  const silver = new THREE.MeshMatcapMaterial({ matcap: silverMatcap(), color: '#ffffff' })

  // =====================================================================================
  // 1. THE PLATE: Daguerre's silvered copper, the iodine box, the camera, mercury, hypo
  // =====================================================================================
  // the painted backdrop on the west wall, a rug under the chair
  const back = keep(canvasTex(512, 404, drawBackdrop))
  const backdrop = add(new THREE.PlaneGeometry(3.6, 3.1), new THREE.MeshStandardMaterial({ map: back, roughness: 0.95 }), D.x0 + 0.04, 1.7, 4.95)
  backdrop.rotation.y = Math.PI / 2
  add(B(0.06, 3.3, 0.08), mats.darkwood, D.x0 + 0.06, 1.65, 3.12)
  add(B(0.06, 3.3, 0.08), mats.darkwood, D.x0 + 0.06, 1.65, 6.78)
  const rug = add(new THREE.PlaneGeometry(2.6, 2.4), new THREE.MeshStandardMaterial({ color: '#6a3a38', roughness: 1 }), -5.9, 0.012, 4.9)
  rug.rotation.x = -Math.PI / 2

  // the chair (facing +x) with the sitter, a puppet bear whose head wiggles while the plate is exposed
  const chair = new THREE.Group()
  chair.position.set(CHAIR.x, 0, CHAIR.z)
  chair.rotation.y = Math.PI / 2
  root.add(chair)
  const seatMat = new THREE.MeshStandardMaterial({ color: '#6a2c36', roughness: 0.9 })
  add(B(0.54, 0.07, 0.52), seatMat, 0, 0.46, 0, chair)
  add(B(0.54, 0.72, 0.05), mats.wood, 0, 0.85, -0.26, chair)
  for (const [x, z] of [[-0.24, -0.23], [0.24, -0.23], [-0.24, 0.23], [0.24, 0.23]]) add(new THREE.CylinderGeometry(0.025, 0.03, 0.44, 8), mats.wood, x, 0.22, z, chair)
  for (const s of [-1, 1]) add(B(0.05, 0.05, 0.46), mats.wood, s * 0.29, 0.68, 0, chair)
  const bearMat = new THREE.MeshStandardMaterial({ color: '#a8743c', roughness: 0.95 })
  const snoutMat = new THREE.MeshStandardMaterial({ color: '#dcb982', roughness: 0.95 })
  const dark = new THREE.MeshStandardMaterial({ color: '#15110f', roughness: 0.6 })
  const bear = new THREE.Group()
  bear.position.set(0, 0.5, 0.02)
  chair.add(bear)
  const bearBody = add(new THREE.SphereGeometry(0.16, 20, 14), bearMat, 0, 0.17, 0, bear)
  bearBody.scale.set(1, 1.15, 0.9)
  for (const s of [-1, 1]) {
    add(new THREE.SphereGeometry(0.055, 12, 8), bearMat, s * 0.17, 0.2, 0.06, bear)
    add(new THREE.SphereGeometry(0.06, 12, 8), bearMat, s * 0.1, 0.03, 0.12, bear)
  }
  const head = new THREE.Group()
  head.position.set(0, 0.4, 0.02)
  bear.add(head)
  add(new THREE.SphereGeometry(0.12, 20, 14), bearMat, 0, 0.06, 0, head)
  for (const s of [-1, 1]) {
    add(new THREE.SphereGeometry(0.045, 10, 8), bearMat, s * 0.09, 0.15, -0.01, head)
    add(new THREE.SphereGeometry(0.015, 8, 6), dark, s * 0.045, 0.09, 0.105, head)
  }
  add(new THREE.SphereGeometry(0.05, 12, 10), snoutMat, 0, 0.035, 0.1, head)
  add(new THREE.SphereGeometry(0.014, 8, 6), dark, 0, 0.05, 0.145, head)
  solids.push(circle(CHAIR.x, CHAIR.z, 0.42))

  // the plaster bust on its pedestal: it never moves, so it is always sharp
  const bust = new THREE.Group()
  bust.position.set(BUST.x, 0, BUST.z)
  root.add(bust)
  const plaster = new THREE.MeshStandardMaterial({ color: '#d9d1bf', roughness: 0.85 })
  add(B(0.34, 0.95, 0.34), plaster, 0, 0.475, 0, bust)
  add(B(0.4, 0.05, 0.4), plaster, 0, 0.97, 0, bust)
  const shoulders = add(new THREE.SphereGeometry(0.2, 18, 12), plaster, 0, 1.08, 0, bust)
  shoulders.scale.set(1, 0.6, 1.2)
  const bustHead = add(new THREE.SphereGeometry(0.13, 18, 14), plaster, 0, 1.33, 0, bust)
  bustHead.scale.set(0.9, 1.2, 1)
  solids.push(circle(BUST.x, BUST.z, 0.3))

  // the camera, on a tripod, lens towards the chair (along -x)
  const cam = new THREE.Group()
  cam.position.set(CAM.x, 0, CAM.z)
  cam.rotation.y = -Math.PI / 2
  root.add(cam)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU
    cam.add(stick(V3(0, 1.2, 0), V3(Math.sin(a) * 0.6, 0, Math.cos(a) * 0.6), 0.02, mats.wood))
  }
  add(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 16), mats.brass, 0, 1.19, 0, cam)
  add(B(0.44, 0.4, 0.36), mats.darkwood, 0, 1.42, -0.12, cam)
  add(B(0.34, 0.3, 0.3), mats.wood, 0, 1.42, 0.2, cam)
  const lensTube = add(new THREE.CylinderGeometry(0.08, 0.09, 0.18, 20), mats.brass, 0, 1.42, 0.43, cam)
  lensTube.rotation.x = Math.PI / 2
  add(new THREE.TorusGeometry(0.09, 0.012, 8, 20), mats.brass, 0, 1.42, 0.52, cam)
  add(B(0.47, 0.1, 0.4), mats.velvet, 0, 1.67, -0.12, cam)
  const capPivot = new THREE.Group()
  capPivot.position.set(0, 1.42 + 0.11, 0.54)
  cam.add(capPivot)
  const cap = add(new THREE.CylinderGeometry(0.105, 0.105, 0.03, 20), mats.rubber, 0, -0.11, 0, capPivot)
  cap.rotation.x = Math.PI / 2
  solids.push(circle(CAM.x, CAM.z, 0.55))

  // the bench along the partition: new plates, the iodine box, the mercury box, the hypo dish, the easel
  add(new RoundedBoxGeometry(5.9, 0.06, 0.85, 2, 0.01), mats.wood, -4.4, B1.top - 0.03, B1.z)
  for (const x of [-7.15, -1.65]) for (const z of [B1.z - 0.35, B1.z + 0.35]) add(B(0.07, B1.top - 0.06, 0.07), mats.darkwood, x, (B1.top - 0.06) / 2, z)
  solids.push(box(-4.4, B1.z, 5.9, 0.85))
  for (let i = 0; i < 3; i++) add(B(PLATE.w, 0.012, PLATE.h), silver, SPOT.stack, B1.top + 0.006 + i * 0.015, B1.z)
  const stackHit = add(B(0.48, 0.1, 0.56), new THREE.MeshBasicMaterial({ visible: false }), SPOT.stack, B1.top + 0.05, B1.z)
  flatLabel(E.labels.plates, SPOT.stack, B1.top + 0.004, B1.z + 0.39)
  const iodineBox = hingedBox({ w: 0.74, h: 0.24, d: 0.58, body: mats.wood, lid: mats.darkwood })
  iodineBox.group.position.set(SPOT.iodine, B1.top, B1.z)
  root.add(iodineBox.group)
  const dish = add(new THREE.CylinderGeometry(0.12, 0.1, 0.03, 18), new THREE.MeshStandardMaterial({ color: '#2a1a34', roughness: 0.5, metalness: 0.3 }), 0, 0.045, 0, iodineBox.group)
  void dish
  flatLabel(E.labels.iodine, SPOT.iodine, B1.top + 0.004, B1.z + 0.39)
  const steelBox = new THREE.MeshStandardMaterial({ color: '#7f8790', roughness: 0.45, metalness: 0.6 })
  const mercBox = hingedBox({ w: 0.74, h: 0.24, d: 0.58, body: steelBox, lid: steelBox, feet: 0.14 })
  mercBox.group.position.set(SPOT.mercury, B1.top, B1.z)
  root.add(mercBox.group)
  for (const [x, z] of [[-0.27, -0.2], [0.27, -0.2], [-0.27, 0.2], [0.27, 0.2]]) add(B(0.04, 0.14, 0.04), mats.darkwood, x, 0.07, z, mercBox.group)
  const spirit = add(new THREE.CylinderGeometry(0.05, 0.06, 0.07, 14), new THREE.MeshStandardMaterial({ color: '#c8d8d8', transparent: true, opacity: 0.6, roughness: 0.2 }), 0, 0.035, 0, mercBox.group)
  void spirit
  const flameMat = new THREE.MeshBasicMaterial({ color: '#ffb347', toneMapped: false })
  const flame = add(new THREE.ConeGeometry(0.03, 0.09, 10), flameMat, 0, 0.115, 0, mercBox.group)
  flatLabel(E.labels.mercury, SPOT.mercury, B1.top + 0.004, B1.z + 0.39)
  // the warning on the mercury box: a yellow triangle with a mark
  const tri = new THREE.Shape()
  tri.moveTo(0, 0.1)
  tri.lineTo(-0.09, -0.06)
  tri.lineTo(0.09, -0.06)
  tri.closePath()
  const warn = new THREE.Mesh(new THREE.ShapeGeometry(tri), new THREE.MeshBasicMaterial({ color: '#ffcf3a', toneMapped: false }))
  root.add(warn)
  warn.position.set(SPOT.mercury, B1.top + 0.29, B1.z + 0.255)
  const mark = label('!', { size: 0.1, c: '#241a10' })
  mark.position.set(SPOT.mercury, B1.top + 0.285, B1.z + 0.258)
  root.add(mark)
  const poison = label(E.labels.poison, { size: 0.05, c: '#ffcf3a' })
  poison.position.set(SPOT.mercury, B1.top + 0.17, B1.z + 0.255)
  root.add(poison)
  const hypoTray = tray({ w: 0.62, d: 0.5, h: 0.07, liquid: '#9cc2d4', level: 0.7, alpha: 0.55, mat: new THREE.MeshStandardMaterial({ color: '#d8d8d4', roughness: 0.4 }) })
  hypoTray.group.position.set(SPOT.hypo, B1.top, B1.z)
  root.add(hypoTray.group)
  flatLabel(E.labels.hypo, SPOT.hypo, B1.top + 0.004, B1.z + 0.39)
  // the easel the finished plate stands on
  const easel = new THREE.Group()
  easel.position.set(SPOT.easel, B1.top, B1.z)
  root.add(easel)
  add(B(0.7, 0.04, 0.34), mats.wood, 0, 0.02, 0, easel)
  add(B(0.6, 0.035, 0.08), mats.darkwood, 0, 0.14, 0.05, easel)
  easel.add(stick(V3(-0.12, 0.04, -0.1), V3(-0.08, 0.78, -0.04), 0.014, mats.darkwood))
  easel.add(stick(V3(0.12, 0.04, -0.1), V3(0.08, 0.78, -0.04), 0.014, mats.darkwood))

  const fumes = {
    iodine: vapour({ color: '#a040c0', x: SPOT.iodine, y: B1.top + 0.2, z: B1.z, rise: 0.4 }),
    mercury: vapour({ color: '#c9d3dc', x: SPOT.mercury, y: B1.top + 0.4, z: B1.z, rise: 0.4 }),
  }
  root.add(fumes.iodine.points, fumes.mercury.points)

  // the plate: a mirror of polished silver with the picture's two overlays (positive, negative)
  const plate = new THREE.Group()
  root.add(plate)
  const plateMat = new THREE.MeshMatcapMaterial({ matcap: silverMatcap(), color: '#ffffff' })
  plate.add(new THREE.Mesh(B(PLATE.w, PLATE.h, PLATE.t), plateMat))
  const posTex = keep(canvasTex(192, 240, null, { mipmaps: false }))
  const negTex = keep(canvasTex(192, 240, null, { mipmaps: false }))
  const overlay = tex => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(PLATE.w * 0.92, PLATE.h * 0.92), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }))
    m.position.z = PLATE.t / 2 + 0.001
    plate.add(m)
    return m
  }
  const posOverlay = overlay(posTex)
  const negOverlay = overlay(negTex)
  const frameMat = mats.brass
  for (const [w, h, x, y] of [[PLATE.w + 0.02, 0.012, 0, PLATE.h / 2], [PLATE.w + 0.02, 0.012, 0, -PLATE.h / 2], [0.012, PLATE.h, PLATE.w / 2, 0], [0.012, PLATE.h, -PLATE.w / 2, 0]]) add(B(w, h, PLATE.t + 0.006), frameMat, x, y, 0, plate)

  // where it is, how far it got, what it shows
  const S1 = { stage: 0, where: 'stack', expo: 0, tilt: 0, v: 0.45, shot: null }
  const expoSec = v => 10 * Math.pow(120, v)
  const quality = e => (e < 60 ? 'faint' : e <= 300 ? 'good' : e <= 720 ? 'blurry' : 'burnt')
  const POSE = where => {
    const top = B1.top
    switch (where) {
      case 'iodine': return { x: SPOT.iodine, y: top + 0.262, z: B1.z, rx: -Math.PI / 2, ry: 0 }
      case 'camera': return { x: CAM.x + 0.12, y: 1.42, z: CAM.z, rx: 0, ry: -Math.PI / 2 }
      case 'mercury': return { x: SPOT.mercury, y: top + 0.14 + 0.262, z: B1.z, rx: -Math.PI / 2, ry: 0 }
      case 'hypo': return { x: SPOT.hypo, y: top + 0.075, z: B1.z, rx: -Math.PI / 2, ry: 0 }
      case 'easel': return { x: SPOT.easel, y: top + 0.52, z: B1.z, rx: 0.2 - 0.7 * S1.tilt, ry: 0 }
      default: return { x: SPOT.stack, y: top + 0.05, z: B1.z, rx: -Math.PI / 2, ry: 0 }
    }
  }
  const start = POSE('stack')
  plate.position.set(start.x, start.y, start.z)
  plate.rotation.set(start.rx, 0, 0)
  const WHITE = new THREE.Color('#ffffff')
  const GOLDY = new THREE.Color('#f0c24a')
  const view = { tint: 0, img: 0, tilt: 0, lidI: 0, lidM: 0, cap: 0, fid: 0, painted: -1 }
  // the exposure's clock hangs on the partition above the bench, facing the studio
  const expoBoard = screen({ width: 1.6, height: 0.6, color, title: E.plate.board.title, line: '', titleSize: 0.13, lineSize: 0.2 })
  expoBoard.group.position.set(-4.4, 2.15, -0.28)
  root.add(expoBoard.group)
  let boardLine = ''
  const setBoard = line => {
    if (line !== boardLine) {
      boardLine = line
      expoBoard.set({ line })
    }
  }
  const stage1Verb = () => {
    const lv = level()
    if (S1.shot) return at(E.plate.says.wait, lv)
    return [E.plate.hints.iodine, E.plate.hints.camera, E.plate.hints.mercury, E.plate.hints.hypo, E.plate.hints.show][S1.stage]
  }
  const repaint = () => {
    if (S1.stage >= 3 && S1.expo > 0 && view.painted !== S1.expo) {
      view.painted = S1.expo
      paintPlate(posTex, negTex, S1.expo)
    }
  }
  const sayQuality = () => {
    if (mine) tell(E.plate.says[quality(S1.expo)], { t: timeText(S1.expo) })
  }

  function plateStep(what) {
    const lv = level()
    if (S1.shot) {
      say(at(E.plate.says.wait, lv))
      return false
    }
    mine = true
    const hint = () => say(stage1Verb())
    switch (what) {
      case 'iodine':
        if (S1.stage !== 0) return hint()
        S1.where = 'iodine'
        S1.stage = 1
        play('select')
        tell(E.plate.says.iodine)
        break
      case 'camera':
        ex.discover('camera', plPanel, 2.4)
        if (S1.stage === 0) return tell(E.plate.says.bare)
        if (S1.stage !== 1) return hint()
        S1.where = 'camera'
        S1.stage = 2
        S1.expo = Math.round(expoSec(S1.v))
        S1.shot = { t: 0, dur: 3.2, expo: S1.expo }
        play('shutter')
        tell(E.plate.says.shoot, { t: timeText(S1.expo) })
        break
      case 'mercury':
        if (S1.stage < 2) return tell(E.plate.says.early)
        if (S1.stage !== 2) return hint()
        S1.where = 'mercury'
        S1.stage = 3
        repaint()
        play('select')
        tell(E.plate.says.mercury)
        later(3.2, sayQuality)
        break
      case 'hypo':
        if (S1.stage < 3) return tell(E.plate.says.hypoEarly)
        if (S1.stage !== 3) return hint()
        S1.where = 'hypo'
        S1.stage = 4
        play('tap')
        tell(E.plate.says.hypo)
        break
      case 'tilt':
        if (S1.stage !== 4) return hint()
        if (S1.where !== 'easel') S1.where = 'easel'
        else {
          S1.tilt = 1 - S1.tilt
          tell(S1.tilt ? E.plate.says.tiltNeg : E.plate.says.tiltPos)
        }
        play('tap')
        break
      case 'fresh':
        S1.stage = 0
        S1.where = 'stack'
        S1.tilt = 0
        S1.expo = 0
        play('tap')
        tell(E.plate.says.fresh)
        break
      case 'next':
        return plateStep(['iodine', 'camera', 'mercury', 'hypo', 'tilt'][S1.stage])
      default:
        return false
    }
    ex.discover('plate', plPanel, 2.4)
    share('plate')
    return true
  }
  const plPanel = lv => ({
    title: E.plate.title,
    color,
    blocks: [
      { slider: { label: E.plate.slider, min: 0, max: 1, step: 0.01, value: S1.v, onInput: v => setV(v), format: v => timeText(expoSec(v)), live: () => S1.v } },
      {
        buttons: ['next', 'iodine', 'camera', 'mercury', 'hypo', 'tilt', 'fresh'].map(k => ({ label: E.plate.buttons[k], onClick: () => plateStep(k) })),
      },
      ...paras(E.plate.panel, lv),
    ],
  })
  let vSend = null
  function setV(v) {
    S1.v = clamp(Number(v) || 0, 0, 1)
    if (!vSend) {
      vSend = setTimeout(() => {
        vSend = null
        share('plate')
      }, 250)
    }
  }
  ex.add({
    id: 'plate',
    x: -4.4,
    z: 2.1,
    radius: 2.6,
    manual: true,
    label: E.plate.label,
    verb: stage1Verb,
    screens: [expoBoard],
    focus: { x: -4.4, y: 1.15, z: 0.2, size: 3.0, width: 6.4 },
    act: () => ctx.showPanel(plPanel),
  })
  ex.add({
    id: 'camera',
    x: -5.0,
    z: 3.3,
    radius: 2.1,
    manual: true,
    label: E.labels.camera,
    verb: stage1Verb,
    focus: { x: -5.1, y: 1.1, z: 4.7, size: 3.6, width: 5.8 },
    act: () => ctx.showPanel(plPanel),
  })
  const plateState = () => ({ stage: S1.stage, where: S1.where, expo: S1.expo, tilt: S1.tilt, v: Q(S1.v) })
  const plateSet = s => {
    S1.stage = clamp(Math.round(Number(s?.stage) || 0), 0, 4)
    S1.where = ['stack', 'iodine', 'camera', 'mercury', 'hypo', 'easel'].includes(s?.where) ? s.where : 'stack'
    S1.expo = Math.max(0, Math.round(Number(s?.expo) || 0))
    S1.tilt = s?.tilt ? 1 : 0
    S1.v = clamp(Number(s?.v) || 0, 0, 1)
    S1.shot = null
    mine = false
    repaint()
  }
  clickable(iodineBox.group, () => plateStep('iodine'), { reach: 5.5 })
  clickable(cam, () => plateStep('camera'), { reach: 5.5 })
  clickable(mercBox.group, () => plateStep('mercury'), { reach: 5.5 })
  clickable(hypoTray.group, () => plateStep('hypo'), { reach: 5.5 })
  clickable(plate, () => (S1.stage === 4 ? plateStep('tilt') : say(stage1Verb())), { reach: 5.5, when: () => plate.visible })
  clickable(stackHit, () => (S1.where === 'stack' ? say(stage1Verb()) : plateStep('fresh')), { reach: 5.5 })

  updates.push((dt, t) => {
    if (S1.shot) {
      S1.shot.t += dt
      setBoard(timeText(S1.shot.expo * clamp(S1.shot.t / (S1.shot.dur - 0.6))))
      if (S1.shot.t >= S1.shot.dur) S1.shot = null
    } else if (!S1.shot) setBoard(timeText(expoSec(S1.v)))
    // the cap, the bear's wiggle (more the longer the exposure), the lids and fumes
    view.cap = damp(view.cap, S1.shot ? 1 : 0, 8, dt)
    capPivot.rotation.x = -1.5 * view.cap
    const amp = S1.shot ? clamp(S1.shot.expo / 600, 0.05, 1) * 0.6 : 0
    view.fid = damp(view.fid, amp, 4, dt)
    head.rotation.y = view.fid * (Math.sin(t * 5.3) + 0.6 * Math.sin(t * 8.9))
    head.rotation.z = view.fid * 0.5 * Math.sin(t * 6.1)
    bear.rotation.z = view.fid * 0.12 * Math.sin(t * 4.1)
    view.lidI = damp(view.lidI, S1.where === 'iodine' ? 1 : 0, 4, dt)
    view.lidM = damp(view.lidM, S1.where === 'mercury' ? 1 : 0, 4, dt)
    iodineBox.setOpen(view.lidI)
    mercBox.setOpen(view.lidM)
    flame.visible = S1.where === 'mercury'
    flame.scale.y = 1 + Math.sin(t * 17) * 0.15
    fumes.iodine.update(t, dt, S1.where === 'iodine')
    fumes.mercury.update(t, dt, S1.where === 'mercury')
    // the plate glides to where it is, in an arc, turning as it goes
    const goal = POSE(S1.where)
    const dist = Math.hypot(goal.x - plate.position.x, goal.y - plate.position.y, goal.z - plate.position.z)
    const lift = clamp(dist * 0.5, 0, 0.5)
    plate.position.x = damp(plate.position.x, goal.x, 3.2, dt)
    plate.position.y = damp(plate.position.y, goal.y + lift, 3.2, dt)
    plate.position.z = damp(plate.position.z, goal.z, 3.2, dt)
    plate.rotation.x = damp(plate.rotation.x, goal.rx, 3.2, dt)
    plate.rotation.y = damp(plate.rotation.y, goal.ry, 3.2, dt)
    plate.visible = !(S1.where === 'camera' && dist < 0.06 && Math.abs(plate.position.y - goal.y) < 0.06)
    // iodine turns it golden, the hypo clears the yellow; mercury brings up the picture
    view.tint = damp(view.tint, S1.stage === 0 ? 0 : S1.stage < 4 ? 1 : 0.12, 1.1, dt)
    plateMat.color.lerpColors(WHITE, GOLDY, view.tint)
    plate.scale.setScalar(damp(plate.scale.x, S1.where === 'easel' ? 1.45 : 1, 3, dt))
    view.img = damp(view.img, S1.stage >= 3 ? 1 : 0, 0.8, dt)
    view.tilt = damp(view.tilt, S1.tilt, 3, dt)
    const mix = smooth(0.15, 0.85, view.tilt)
    posOverlay.material.opacity = view.img * (1 - mix)
    negOverlay.material.opacity = view.img * mix
    posOverlay.visible = posOverlay.material.opacity > 0.01
    negOverlay.visible = negOverlay.material.opacity > 0.01
  })

  // =====================================================================================
  // 2. THE CRYSTAL: silver bromide as big as a table, the blue lamp, the developer, a piece of film
  // =====================================================================================
  const spot2 = V3(4.6, 0, 5.0)
  const G = { n: 0, dev: false, L: 3 }
  const crystal = new THREE.Group()
  crystal.position.set(CR.x, CR.y, CR.z)
  root.add(crystal)
  add(B(0.9, CR.y - 0.84, 0.9), mats.wood, CR.x, (CR.y - 0.84) / 2, CR.z)
  add(B(1.2, 0.08, 1.2), mats.darkwood, CR.x, CR.y - 0.84 + 0.04, CR.z)
  solids.push(circle(CR.x, CR.z, 0.7))
  const gelatin = add(B(1.75, 1.75, 1.75), new THREE.MeshStandardMaterial({ color: '#e2a950', transparent: true, opacity: 0.13, roughness: 0.15, depthWrite: false }), 0, 0, 0, crystal)
  // the ions: Ag+ and Br- on a cubic checkerboard (the rock-salt structure), 5 by 5 by 5
  const agPos = []
  const brPos = []
  const agAt = new Map()
  const brAt = new Map()
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      for (let k = -2; k <= 2; k++) {
        const p = V3(i * SP, j * SP, k * SP)
        if ((i + j + k) % 2 === 0) {
          agAt.set(`${i},${j},${k}`, agPos.length)
          agPos.push(p)
        } else {
          brAt.set(`${i},${j},${k}`, brPos.length)
          brPos.push(p)
        }
      }
    }
  }
  const agMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, metalness: 0.2, emissive: '#1a1e26' }), agPos.length)
  const brMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.115, 16, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35, metalness: 0.1, emissive: '#2a0a06' }), brPos.length)
  agMesh.frustumCulled = brMesh.frustumCulled = false
  crystal.add(agMesh, brMesh)
  const agS = agPos.map(() => 1)
  const brS = brPos.map(() => 1)
  const agDev = agPos.map(() => 0) // how far development has got at each ion (0 to 1)
  const brDev = brPos.map(() => 0)
  const agOff = agPos.map(() => V3(0, 0, 0)) // an ion on its way to the speck
  const SILVER = new THREE.Color('#b4bcc8')
  const BROMIDE = new THREE.Color('#b8402e')
  const BLACK = new THREE.Color('#26262c')
  const tmpC = new THREE.Color()
  const dummy = new THREE.Object3D()
  const SPECK = V3(0.3, -0.3, 0.8)
  const SPECK_ATOMS = [V3(0, 0, 0), V3(0.115, 0.02, 0.03), V3(0.055, 0.11, 0.03), V3(0.055, 0.045, 0.11)].map(o => o.add(SPECK))
  const delay = pos => clamp(pos.distanceTo(SPECK) / 1.6)
  const agDelay = agPos.map(delay)
  const brDelay = brPos.map(delay)
  const HITS = [[-2, 1], [-1, -2], [0, 1], [1, 0]].map(([i, j]) => brAt.get(`${i},${j},2`))
  const DONORS = [[2, -2], [0, -2], [2, 0], [1, -1]].map(([i, j]) => agAt.get(`${i},${j},2`))
  const writeIons = () => {
    agPos.forEach((p, i) => {
      dummy.position.copy(p).add(agOff[i])
      dummy.scale.setScalar(Math.max(0.0001, agS[i] * (1 + 0.3 * agDev[i])))
      dummy.updateMatrix()
      agMesh.setMatrixAt(i, dummy.matrix)
    })
    brPos.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.scale.setScalar(Math.max(0.0001, brS[i] * (1 - 0.8 * brDev[i])))
      dummy.updateMatrix()
      brMesh.setMatrixAt(i, dummy.matrix)
    })
    agMesh.instanceMatrix.needsUpdate = true
    brMesh.instanceMatrix.needsUpdate = true
  }
  // development sweeps out from the speck: silver ions turn black and swell, bromide ions leave
  const colourIons = devP => {
    agPos.forEach((_, i) => {
      const k = devP > 0 ? clamp((devP - agDelay[i] * 0.6) / 0.4) : 0
      agDev[i] = k
      agMesh.setColorAt(i, tmpC.copy(SILVER).lerp(BLACK, k))
    })
    brPos.forEach((_, i) => {
      brDev[i] = devP > 0 ? clamp((devP - brDelay[i] * 0.6) / 0.4) : 0
    })
    agMesh.instanceColor.needsUpdate = true
  }
  brPos.forEach((_, i) => brMesh.setColorAt(i, BROMIDE))
  // the speck: four silver atoms that appear one by one, a ring that marks the place
  const speckMat = new THREE.MeshStandardMaterial({ color: '#f4f6fa', roughness: 0.2, metalness: 0.3, emissive: '#aab0bc', emissiveIntensity: 0.6 })
  const speckAtoms = SPECK_ATOMS.map(p => add(new THREE.SphereGeometry(0.062, 16, 12), speckMat, p.x, p.y, p.z, crystal))
  const ring = add(new THREE.TorusGeometry(0.17, 0.008, 8, 28), new THREE.MeshBasicMaterial({ color: '#ff5f6d', transparent: true, opacity: 0.6, toneMapped: false }), SPECK.x + 0.05, SPECK.y + 0.05, SPECK.z + 0.02, crystal)
  const glow = add(new THREE.SphereGeometry(0.3, 18, 14), new THREE.MeshBasicMaterial({ color: '#ff9fb0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), SPECK.x + 0.05, SPECK.y + 0.05, SPECK.z + 0.04, crystal)
  glow.raycast = () => {}
  ring.raycast = () => {}
  // the bromine atoms that leave the crystal for the gelatin
  const brOutMat = new THREE.MeshStandardMaterial({ color: '#d46a3c', roughness: 0.4, emissive: '#5a1c08', emissiveIntensity: 0.5 })
  const brOuts = HITS.map(() => add(new THREE.SphereGeometry(0.075, 14, 10), brOutMat, 0, 0, 0, crystal))
  const brFinal = HITS.map((h, n) => {
    const p = brPos[h]
    return V3(p.x * 1.1, p.y * 1.1 + 0.05, 0.8 + (n % 2) * 0.04)
  })
  // the photon, its beam, the wandering electron and its trail
  const photon = add(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshBasicMaterial({ color: '#7fb4ff', toneMapped: false }), 0, 0, 0)
  const photonHalo = add(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshBasicMaterial({ color: '#4f90ff', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 0, 0, 0)
  const beam = add(new THREE.CylinderGeometry(0.012, 0.012, 1, 6), new THREE.MeshBasicMaterial({ color: '#7fb4ff', transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 0, 0, 0)
  const electron = add(new THREE.SphereGeometry(0.055, 12, 8), new THREE.MeshBasicMaterial({ color: '#d8ecff', toneMapped: false }), 0, 0, 0, crystal)
  const TRAIL = 22
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: '#9fd0ff', transparent: true, opacity: 0.8, toneMapped: false }))
  trail.frustumCulled = false
  crystal.add(trail)
  for (const m of [photon, photonHalo, beam, electron, trail]) {
    m.visible = false
    m.raycast = () => {}
  }
  const stretch = (mesh, a, b) => {
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.scale.set(1, a.distanceTo(b), 1)
    mesh.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize())
  }
  const lampHead = V3(LAMP.x + 0.05, LAMP.y, LAMP.z - 0.05)
  const toWorld = p => p.clone().add(crystal.position)
  // the wandering path of electron n: random-looking but the same for everyone
  const rnd = random(11)
  const paths = HITS.map((h, n) => {
    const a = brPos[h].clone()
    const pts = [a]
    for (let s = 1; s <= 6; s++) pts.push(a.clone().lerp(SPECK_ATOMS[n], s / 7).add(V3((rnd() - 0.5) * 0.45, (rnd() - 0.5) * 0.45, -rnd() * 0.3)))
    pts.push(SPECK_ATOMS[n].clone())
    return new THREE.CatmullRomCurve3(pts)
  })

  let ev = null // the event under way: { n, t, dur, extra }
  let pour = null // the developer being poured: { t, dur, effect }
  let devP = G.dev ? 1 : 0
  /** The crystal as it stands once events 0 .. count-1 are over. */
  function finalize(count) {
    for (let n = 0; n < 4; n++) {
      const done = n < count
      brS[HITS[n]] = done ? 0 : 1
      agS[DONORS[n]] = done ? 0 : 1
      agOff[DONORS[n]].set(0, 0, 0)
      speckAtoms[n].visible = done
      speckAtoms[n].scale.setScalar(1)
      brOuts[n].visible = done
      brOuts[n].position.copy(brFinal[n])
    }
    writeIons()
  }
  colourIons(0)
  finalize(0)

  // the lamp on its stand, aimed at the crystal's front face
  add(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 20), mats.darkwood, LAMP.x, 0.025, LAMP.z)
  add(new THREE.CylinderGeometry(0.025, 0.03, LAMP.y, 8), mats.steel, LAMP.x, LAMP.y / 2, LAMP.z)
  const lampHeadG = new THREE.Group()
  lampHeadG.position.set(LAMP.x, LAMP.y, LAMP.z)
  root.add(lampHeadG)
  add(new RoundedBoxGeometry(0.34, 0.26, 0.3, 3, 0.04), mats.paint, 0, 0, 0.05, lampHeadG)
  const lensMat = new THREE.MeshStandardMaterial({ color: '#7fb0ff', emissive: '#4f86ff', emissiveIntensity: 1.2, roughness: 0.2 })
  const lampLens = add(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 20), lensMat, 0, 0, -0.12, lampHeadG)
  lampLens.rotation.x = Math.PI / 2
  lampHeadG.lookAt(CR.x, CR.y, CR.z)
  const lampHit = add(new THREE.SphereGeometry(0.4, 10, 8), new THREE.MeshBasicMaterial({ visible: false }), LAMP.x, LAMP.y, LAMP.z)
  const lampText = label(E.labels.lamp, { size: 0.11, c: '#9fc4ff', maxWidth: 1.4 })
  lampText.position.set(LAMP.x, LAMP.y + 0.42, LAMP.z)
  root.add(lampText)
  solids.push(circle(LAMP.x, LAMP.z, 0.28))
  // the legend: silver ions and bromide ions
  for (const [i, text, col] of [[0, E.labels.ag, '#b4bcc8'], [1, E.labels.br, '#b8402e']]) {
    const lx = CR.x - 0.55 + i * 1.1
    const ball = add(new THREE.SphereGeometry(i ? 0.08 : 0.06, 14, 10), new THREE.MeshStandardMaterial({ color: col, roughness: 0.35 }), lx - 0.15, 0.09, CR.z + 0.62)
    void ball
    const t = label(text, { size: 0.09, maxWidth: 0.5 })
    t.rotation.x = -Math.PI / 2
    t.position.set(lx + 0.08, 0.013, CR.z + 0.62)
    root.add(t)
  }
  void gelatin

  // the board that counts the atoms in the speck
  const speckBoard = standingScreen({ width: 1.7, height: 0.8, color, title: E.grain.board.title, line: E.grain.board.none, titleSize: 0.1, lineSize: 0.12 }, { top: 1.25, tilt: 0.3, mat: mats.darkwood })
  speckBoard.group.position.set(3.35, 0, 2.7)
  speckBoard.group.rotation.y = faceTo(V3(3.35, 0, 2.7), spot2)
  backing(speckBoard.panel, 1.78, 0.88)
  root.add(speckBoard.group)
  solids.push(circle(3.35, 2.7, 0.3))
  let speckLine = ''
  const boardLine2 = () => {
    const B2 = E.grain.board
    const line = G.dev ? B2.done : G.n >= 4 ? B2.ready : G.n === 0 ? B2.none : fill(B2.counting, { n: G.n })
    if (line !== speckLine) {
      speckLine = line
      speckBoard.set({ line })
    }
  }

  // the developer: a bottle on a little table that pours over the crystal
  add(B(0.7, 0.05, 0.6), mats.wood, DEVTABLE.x, DEVTABLE.top - 0.025, DEVTABLE.z)
  for (const [dx, dz] of [[-0.3, -0.25], [0.3, -0.25], [-0.3, 0.25], [0.3, 0.25]]) add(B(0.05, DEVTABLE.top - 0.05, 0.05), mats.darkwood, DEVTABLE.x + dx, (DEVTABLE.top - 0.05) / 2, DEVTABLE.z + dz)
  solids.push(box(DEVTABLE.x, DEVTABLE.z, 0.7, 0.6))
  const bottle = new THREE.Group()
  const REST = V3(DEVTABLE.x, DEVTABLE.top + 0.2, DEVTABLE.z)
  bottle.position.copy(REST)
  root.add(bottle)
  const amber = new THREE.MeshStandardMaterial({ color: '#8a4a14', roughness: 0.25, transparent: true, opacity: 0.92 })
  add(new THREE.CylinderGeometry(0.09, 0.095, 0.3, 18), amber, 0, 0, 0, bottle)
  add(new THREE.CylinderGeometry(0.035, 0.07, 0.1, 14), amber, 0, 0.2, 0, bottle)
  add(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), mats.rubber, 0, 0.265, 0, bottle)
  const bottleLabel = add(new THREE.CylinderGeometry(0.096, 0.096, 0.12, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#e8dcc0', roughness: 0.9, side: THREE.DoubleSide }), 0, -0.02, 0, bottle)
  void bottleLabel
  const bottleHit = add(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 8), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.05, 0, bottle)
  void bottleHit
  const devText = label(E.labels.developer, { size: 0.09, maxWidth: 0.9 })
  devText.rotation.x = -Math.PI / 2
  devText.position.set(DEVTABLE.x, DEVTABLE.top + 0.003, DEVTABLE.z + 0.2)
  root.add(devText)
  const stream = add(new THREE.CylinderGeometry(0.014, 0.014, 1, 8), new THREE.MeshStandardMaterial({ color: '#a8641e', transparent: true, opacity: 0.85, roughness: 0.1 }), 0, 0, 0)
  stream.visible = false
  stream.raycast = () => {}
  const POUR_AT = V3(CR.x + 0.45, CR.y + 1.2, CR.z + 0.25)

  // the film on the wall: grains at the slider's light, a wedge of greys
  const stripTex = keep(canvasTex(1024, 416, (g, w, h) => paintStrip(g, w, h, G.L, E.grain.strip, lang), { mipmaps: false }))
  const strip = new THREE.Group()
  strip.position.set(STRIP.x, STRIP.y, STRIP.z)
  strip.rotation.y = -Math.PI / 2
  root.add(strip)
  const stripPlane = add(new THREE.PlaneGeometry(STRIP.w, STRIP.h), new THREE.MeshBasicMaterial({ map: stripTex, toneMapped: false }), 0, 0, 0.0, strip)
  for (const [w, h, x, y] of [[STRIP.w + 0.16, 0.08, 0, STRIP.h / 2 + 0.04], [STRIP.w + 0.16, 0.08, 0, -STRIP.h / 2 - 0.04], [0.08, STRIP.h, STRIP.w / 2 + 0.04, 0], [0.08, STRIP.h, -STRIP.w / 2 - 0.04, 0]]) add(B(w, h, 0.06), mats.darkwood, x, y, -0.01, strip)
  const redrawStrip = () => stripTex.userData.redraw((g, w, h) => paintStrip(g, w, h, G.L, E.grain.strip, lang))

  // ---- what a visitor does ----
  const gVerb = () => {
    const H = E.grain.hints
    if (ev || pour) return H.wait
    if (G.dev) return H.done
    if (G.n >= 4) return H.ready
    return G.n === 0 ? H.lamp : fill(H.more, { n: G.n })
  }
  const gBusy = () => {
    if (ev || pour) {
      say(at(E.plate.says.wait, level()))
      return true
    }
    return false
  }
  function startEvent(n, extra) {
    ev = { n, t: 0, dur: extra ? 1.0 : 3.0, extra }
    finalize(Math.min(n, 4))
    play('beam')
  }
  function startPour(effect, now) {
    pour = { t: 0, dur: 3.6, effect, started: false }
    if (now) pour.t = 0
    play('tap')
  }
  function grainStep(what) {
    mine = true
    switch (what) {
      case 'photon': {
        if (gBusy()) return false
        if (G.dev) return say(gVerb())
        const n = G.n
        G.n += 1
        const extra = n >= 4
        startEvent(n, extra)
        if (n === 0) tell(E.grain.says.photon1)
        else if (extra) tell(E.grain.says.more)
        else tell(E.grain.says.photon, { n })
        if (n === 3) later(3.0, () => mine && tell(E.grain.says.ready))
        break
      }
      case 'develop':
        if (gBusy()) return false
        if (G.dev) return say(gVerb())
        if (G.n < 4) {
          startPour(false)
          later(1.8, () => mine && tell(E.grain.says.nothing))
        } else {
          G.dev = true
          startPour(true)
          later(3.0, () => mine && tell(E.grain.says.developed))
        }
        break
      case 'fresh':
        if (gBusy()) return false
        G.n = 0
        G.dev = false
        devP = 0
        colourIons(0)
        finalize(0)
        play('tap')
        tell(E.grain.says.fresh)
        break
      case 'strip': {
        const next = [0.5, 1, 2, 4, 6, 8, 12].find(v => v > G.L + 0.01) ?? 0.5
        setL(next, true)
        play('tap')
        tell(E.grain.says.levelKid, { n: num(G.L, 1, lang), p: `${Math.round(shareBlack(G.L) * 100)}%` })
        break
      }
      default:
        return false
    }
    ex.discover('grain', gPanel, 2.4)
    share('grain')
    return true
  }
  let lSend = null
  function setL(v, now) {
    const L = clamp(Math.round((Number(v) || 0) * 2) / 2, 0, 12)
    if (L === G.L) return
    G.L = L
    redrawStrip()
    ex.discover('grain', gPanel, 2.4)
    if (now) share('grain')
    else if (!lSend) {
      lSend = setTimeout(() => {
        lSend = null
        share('grain')
      }, 250)
    }
  }
  const gPanel = lv => ({
    title: E.grain.title,
    color,
    blocks: [
      { slider: { label: E.grain.slider, min: 0, max: 12, step: 0.5, value: G.L, onInput: v => setL(v), format: v => fill(E.grain.slideFormat, { n: num(v, 1, lang) }), live: () => G.L } },
      { buttons: ['photon', 'develop', 'fresh', 'strip'].map(k => ({ label: E.grain.buttons[k], onClick: () => grainStep(k) })) },
      ...paras(E.grain.panel, lv),
    ],
  })
  ex.add({
    id: 'grain',
    x: 4.6,
    z: 4.9,
    radius: 3.4,
    manual: true,
    label: E.grain.label,
    verb: gVerb,
    screens: [speckBoard],
    focus: { x: CR.x, y: 1.6, z: CR.z, size: 3.6, width: 5.4 },
    act: () => ctx.showPanel(gPanel),
  })
  clickable(lampHit, () => grainStep('photon'), { reach: 6 })
  clickable(bottle, () => grainStep('develop'), { reach: 6 })
  clickable(crystal, () => (G.dev ? grainStep('fresh') : say(gVerb())), { reach: 6, when: () => !ev })
  clickable(stripPlane, () => grainStep('strip'), { reach: 6.5 })
  const grainState = () => ({ n: G.n, dev: G.dev ? 1 : 0, L: G.L })
  const grainSet = (s, live) => {
    const n = clamp(Math.round(Number(s?.n) || 0), 0, 99)
    const dev = !!s?.dev
    const L = clamp(Number(s?.L) || 0, 0, 12)
    const grew = n === G.n + 1
    const wasN = G.n
    const wasDev = G.dev
    G.n = n
    G.dev = dev
    mine = false
    if (L !== G.L) {
      G.L = L
      redrawStrip()
    }
    ev = null
    if (live && grew && !dev) startEvent(wasN, wasN >= 4)
    else finalize(Math.min(n, 4))
    if (dev && !wasDev) {
      if (live) {
        devP = 0
        startPour(true)
      } else devP = 1
    } else if (!dev) {
      devP = 0
      colourIons(0)
      finalize(Math.min(n, 4))
    }
    if (!live) pour = null
  }

  updates.push((dt, t) => {
    // the photon's journey, the electron's wander, the silver ion's hop
    let frameDirty = false
    if (ev) {
      ev.t += dt
      const n = Math.min(ev.n, 3)
      const hitW = toWorld(brPos[HITS[n]])
      const k = ev.t
      const lens = ev.extra ? toWorld(SPECK) : hitW
      lensMat.emissiveIntensity = 1.2 + 2.5 * Math.max(0, 1 - k * 3)
      const flying = k < 0.7
      photon.visible = photonHalo.visible = flying
      beam.visible = k < 0.5
      if (flying) {
        photon.position.lerpVectors(lampHead, lens, span(0, 0.7, k))
        photonHalo.position.copy(photon.position)
        stretch(beam, lampHead, photon.position)
      }
      if (!ev.extra) {
        // the bromide ion gives up its electron: it shrinks, a bromine atom leaves for the gelatin
        const gone = span(0.7, 1.0, k)
        brS[HITS[n]] = 1 - gone
        frameDirty = true
        const out = brOuts[n]
        out.visible = k > 0.7
        out.position.lerpVectors(brPos[HITS[n]], brFinal[n], span(0.8, 1.9, k))
        out.scale.setScalar(0.4 + 0.6 * span(0.7, 1.2, k))
        // the electron wanders from the bromide to the speck
        const walk = span(0.9, 2.2, k)
        electron.visible = trail.visible = k > 0.9 && k < 2.3
        if (electron.visible) {
          const curve = paths[n]
          electron.position.copy(curve.getPoint(walk))
          const arr = trailGeo.attributes.position.array
          for (let i = 0; i < TRAIL; i++) {
            const p = curve.getPoint(clamp(walk - (i / TRAIL) * 0.35))
            arr[i * 3] = p.x
            arr[i * 3 + 1] = p.y
            arr[i * 3 + 2] = p.z
          }
          trailGeo.attributes.position.needsUpdate = true
          electron.scale.setScalar(1 + 0.3 * Math.sin(t * 30))
        }
        // a silver ion creeps up and becomes a silver atom
        const hop = span(2.2, 2.85, k)
        const donor = DONORS[n]
        const a = speckAtoms[n]
        a.visible = k > 2.2
        if (a.visible) a.scale.setScalar(Math.max(0.05, hop))
        agOff[donor].copy(SPECK_ATOMS[n]).sub(agPos[donor]).multiplyScalar(hop)
        agS[donor] = k < 2.85 ? 1 : 0
        frameDirty = true
      }
      if (ev.t >= ev.dur) {
        electron.visible = trail.visible = photon.visible = photonHalo.visible = beam.visible = false
        const done = ev.n + 1
        ev = null
        finalize(Math.min(done, 4))
        frameDirty = true
        lensMat.emissiveIntensity = 1.2
      }
    }
    // the developer: the bottle comes over, tips, pours; the crystal turns black from the speck outwards
    if (pour) {
      pour.t += dt
      const k = pour.t
      const go = span(0, 0.9, k)
      const back = span(2.5, 3.5, k)
      const q = go * (1 - back)
      bottle.position.lerpVectors(REST, POUR_AT, q)
      bottle.position.y += Math.sin(Math.PI * q) * 0.25
      bottle.rotation.z = 1.9 * span(0.7, 1.2, k) * (1 - span(2.3, 2.6, k))
      const pouring = k > 1.1 && k < 2.5
      stream.visible = pouring
      if (pouring) {
        bottle.updateMatrixWorld()
        const spout = bottle.localToWorld(V3(0, 0.28, 0))
        stretch(stream, spout, V3(CR.x + 0.4, CR.y + 0.78, CR.z + 0.2))
      }
      if (pour.effect && k > 1.3 && devP < 1) devP = Math.min(1, (k - 1.3) / 2.6)
      if (pour.effect && k > 3.9) devP = 1
      if (k >= pour.dur) {
        pour = null
        bottle.position.copy(REST)
        bottle.rotation.z = 0
        stream.visible = false
        if (G.dev) devP = 1
      }
    }
    if (G.dev || devP > 0) {
      colourIons(devP)
      speckMat.color.copy(new THREE.Color('#f4f6fa').lerp(BLACK, clamp((devP - 0.1) / 0.4)))
      speckMat.emissiveIntensity = 0.6 * (1 - devP)
      frameDirty = true
    } else if (speckMat.emissiveIntensity !== 0.6) {
      speckMat.color.set('#f4f6fa')
      speckMat.emissiveIntensity = 0.6
    }
    if (frameDirty) writeIons()
    // the marked speck lights up at four atoms; the ring marks the place until then
    const count = ev ? ev.n : G.n
    const ready = count >= 4 && !G.dev
    glow.material.opacity = damp(glow.material.opacity, ready ? 0.35 + 0.12 * Math.sin(t * 4) : 0, 6, dt)
    ring.material.opacity = (count >= 4 ? 0 : 0.35 + 0.25 * Math.sin(t * 3)) * (G.dev ? 0 : 1)
    boardLine2()
  })

  // =====================================================================================
  // 3. THE DARKROOM BENCH: the enlarger, the trays, the line, the white light
  // =====================================================================================
  const spot3 = V3(0.2, 0, -8.6)
  const top3 = B3.top
  const zc3 = (B3.z0 + B3.z1) / 2
  add(new RoundedBoxGeometry(B3.x1 - B3.x0, 0.06, B3.z1 - B3.z0, 2, 0.01), mats.wood, 0, top3 - 0.03, zc3)
  for (const x of [B3.x0 + 0.1, B3.x1 - 0.1]) for (const z of [B3.z0 + 0.1, B3.z1 - 0.1]) add(B(0.08, top3 - 0.06, 0.08), mats.darkwood, x, (top3 - 0.06) / 2, z)
  solids.push(box(0, zc3, B3.x1 - B3.x0, B3.z1 - B3.z0))

  // the enlarger: a baseboard with the paper's easel, a column, a head with the negative, a lens
  const baseboard = add(B(0.82, 0.04, 0.72), mats.rubber, ENL.x, top3 + 0.02, ENL.z)
  for (const [w, d, x, z] of [[0.54, 0.03, 0, 0.2], [0.54, 0.03, 0, -0.2], [0.03, 0.4, 0.26, 0], [0.03, 0.4, -0.26, 0]]) add(B(w, 0.012, d), mats.rubber, ENL.x + x, top3 + 0.046, ENL.z + z)
  const enlarger = new THREE.Group()
  root.add(enlarger)
  add(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 10), mats.steel, ENL.x, top3 + 0.8, ENL.z - 0.6, enlarger)
  add(B(0.07, 0.07, 0.62), mats.steel, ENL.x, 2.25, ENL.z - 0.3, enlarger)
  add(new RoundedBoxGeometry(0.46, 0.4, 0.46, 3, 0.04), mats.paint, ENL.x, 2.25, ENL.z, enlarger)
  const bellows = add(new THREE.CylinderGeometry(0.16, 0.08, 0.22, 12, 4), mats.rubber, ENL.x, 1.94, ENL.z, enlarger)
  void bellows
  add(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 16), mats.steel, ENL.x, 1.78, ENL.z, enlarger)
  const lensGlass = add(new THREE.CircleGeometry(0.055, 16), new THREE.MeshBasicMaterial({ color: '#fff4dc', toneMapped: false }), ENL.x, 1.73, ENL.z, enlarger)
  lensGlass.rotation.x = Math.PI / 2
  lensGlass.visible = false
  // the negative in its window on the head
  const negTexture = keep(negativeTexture())
  const negCard = add(new THREE.PlaneGeometry(0.32, 0.24), new THREE.MeshBasicMaterial({ map: negTexture, toneMapped: false, color: '#c9b9b0' }), ENL.x, 2.25, ENL.z + 0.232, enlarger)
  void negCard
  solids.push(circle(ENL.x, ENL.z - 0.2, 0.55))
  // the light of the exposure: a cone to the paper, the cat's negative thrown onto it, a lamp on the bench
  const cone = add(new THREE.CylinderGeometry(0.07, 0.3, 0.74, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff4dc', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }), ENL.x, (1.73 + top3 + 0.05) / 2, ENL.z)
  cone.raycast = () => {}
  const projected = add(new THREE.PlaneGeometry(PAPER.w, PAPER.h), new THREE.MeshBasicMaterial({ map: negTexture, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), ENL.x, top3 + 0.052, ENL.z)
  projected.rotation.x = -Math.PI / 2
  projected.raycast = () => {}
  const enlLight = new THREE.PointLight('#fff1dc', 0, 3.5, 2)
  enlLight.position.set(ENL.x, 1.55, ENL.z + 0.1)
  root.add(enlLight)

  // the four trays, each its own colour (the picture's olive, teal and purple), a label on the wall
  const TRAYS = { dev: '#6e6a2a', stop: '#2f6d72', fix: '#5a4a78', wash: '#3c5a8a' }
  const LIQUID = { dev: '#8a5a26', stop: '#a8c2b8', fix: '#b8c4d4', wash: '#6a9ac4' }
  const trays = {}
  for (const k of THREE_STEPS) {
    const t = tray({ w: TRAY.w, d: TRAY.d, h: 0.07, liquid: LIQUID[k], level: 0.8, alpha: 0.62, mat: new THREE.MeshStandardMaterial({ color: TRAYS[k], roughness: 0.55 }) })
    t.group.position.set(TRAY[k], top3 + TRAY.lift, TRAY.z)
    t.group.rotation.x = TRAY.tilt // leaning towards the visitor, so the bath can be seen from a standing eye
    root.add(t.group)
    add(B(TRAY.w * 0.9, TRAY.lift + 0.04, 0.3), mats.darkwood, TRAY[k], top3 + (TRAY.lift + 0.04) / 2, TRAY.z - 0.12)
    trays[k] = t
    const name = label(E.labels[k], { size: 0.1, c: '#ffcfc6', maxWidth: 0.9 })
    name.position.set(TRAY[k], 1.4, B3.z0 + 0.03)
    root.add(name)
  }

  // the drying line: a wire with pegs; the picture's three prints, and room for four of the visitor's
  const wire = add(new THREE.CylinderGeometry(0.008, 0.008, 6.8, 6), mats.steel, 0, LINE.y, LINE.z)
  wire.rotation.z = Math.PI / 2
  for (const s of [-1, 1]) root.add(stick(V3(s * 3.4, LINE.y, LINE.z), V3(s * 3.4, LINE.y + 0.15, B3.z0 - 0.05), 0.012, mats.steel))
  const lineHit = add(new THREE.PlaneGeometry(6.8, 0.8), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }), 0, LINE.y - 0.3, LINE.z - 0.06)
  void lineHit

  // paper: the picture's lightness, developed as far as `dp`, fogged as far as `fog`, seen by the room's light
  const lightC = { value: new THREE.Vector3(0.85, 0.32, 0.28) }
  const blank = keep(canvasTex(4, 4, (g, w) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false }))
  const paperMat = tex => new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, dp: { value: 0 }, fog: { value: 0 }, lightC },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float dp; uniform float fog; uniform vec3 lightC;
      varying vec2 vUv;
      void main() {
        float L = texture2D(map, vUv).r;
        float img = mix(1.0, L, dp) * mix(1.0, 0.38, fog);
        gl_FragColor = vec4(vec3(img) * vec3(0.97, 0.95, 0.9) * lightC, 1.0);
      }`,
    side: THREE.DoubleSide,
  })
  const makePaper = tex => {
    const mat = paperMat(tex)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PAPER.w, PAPER.h), mat)
    root.add(mesh)
    return { mesh, mat }
  }
  const pegMat = new THREE.MeshStandardMaterial({ color: '#b08a58', roughness: 0.8 })
  const PRINT_Y = LINE.y - 0.04 - PAPER.h / 2
  const hangPose = slot => ({ x: SLOTS[slot], y: PRINT_Y, z: LINE.z + 0.03, rx: 0 })
  const peg = slot => add(B(0.05, 0.1, 0.05), pegMat, SLOTS[slot], LINE.y - 0.02, LINE.z + 0.03)
  const keepsakes = [0, 1, 2].map(kind => {
    const p = makePaper(keep(drawKeepsake(kind)))
    const slot = 1 + kind * 2
    const pose = hangPose(slot)
    p.mesh.position.set(pose.x, pose.y, pose.z)
    p.mat.uniforms.dp.value = 1
    peg(slot)
    return p
  })
  void keepsakes

  // the sheet in the easel, and the prints made so far
  const texCache = new Map()
  const texFor = e => {
    const key = Math.round(e)
    if (!texCache.has(key)) texCache.set(key, keep(printTexture(key)))
    return texCache.get(key)
  }
  const EASEL = { x: ENL.x, y: top3 + 0.047, z: ENL.z, rx: -Math.PI / 2 }
  const newSheet = () => {
    const p = makePaper(blank)
    p.mesh.position.set(EASEL.x, EASEL.y + 0.15, EASEL.z)
    p.mesh.rotation.x = EASEL.rx
    return { ...p, st: { w: 'easel', e: 0, dp: 0, sp: 0, fp: 0, wp: 0, fog: 0 } }
  }
  let cur = newSheet()
  const hung = [] // { slot, mesh, mat, peg, st: { e, dp, fx, wx, fog } }
  let hungSeq = 0
  const VSLOTS = [0, 2, 4, 6]
  const P = { secs: 10, white: 0 }
  let whiteK = 0
  let exposing = null // { t, dur, secs }
  let litK = 0
  let told = { fog: false }
  const paperPose = (w, slot) => (w === 'easel' ? EASEL : w === 'line' ? hangPose(slot) : { x: TRAY[w], y: top3 + TRAY.lift + 0.088, z: TRAY.z + 0.026, rx: -Math.PI / 2 + TRAY.tilt })
  const glide = (mesh, pose, dt, rate = 3.2) => {
    const dist = Math.hypot(pose.x - mesh.position.x, pose.y - mesh.position.y, pose.z - mesh.position.z)
    const lift = clamp(dist * 0.4, 0, 0.35)
    mesh.position.x = damp(mesh.position.x, pose.x, rate, dt)
    mesh.position.y = damp(mesh.position.y, pose.y + lift, rate, dt)
    mesh.position.z = damp(mesh.position.z, pose.z, rate, dt)
    mesh.rotation.x = damp(mesh.rotation.x, pose.rx, rate, dt)
  }
  const fixed = st => (st.fx !== undefined ? !!st.fx : st.fp >= 1)

  // the clock above the trays: the bath, and the minutes it has had (they run ten times faster here)
  const clock = standingScreen({ width: 1.2, height: 0.5, color, title: E.print.board.idle, line: '', titleSize: 0.1, lineSize: 0.2 }, { top: 1.0, tilt: 0.25, mat: mats.darkwood })
  clock.group.position.set(3.05, top3, -11.55)
  backing(clock.panel, 1.18, 0.48)
  root.add(clock.group)
  const clockNote = label(E.print.board.speed, { size: 0.065, c: '#ffcfc6', maxWidth: 1.2 })
  clockNote.position.set(3.05, top3 + 0.28, -11.2)
  root.add(clockNote)
  let clockTitle = ''
  let clockLine = ''
  const setClock = (title, line) => {
    if (title !== clockTitle || line !== clockLine) {
      clockTitle = title
      clockLine = line
      clock.set({ title, line })
    }
  }
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

  // the white light's switch, on a little post
  const sw = new THREE.Group()
  sw.position.set(3.45, top3, -10.75)
  root.add(sw)
  add(new RoundedBoxGeometry(0.24, 0.32, 0.12, 2, 0.02), mats.paint, 0, 0.16, 0, sw)
  const lever = add(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8), mats.steel, 0, 0.17, 0.08, sw)
  lever.rotation.x = Math.PI / 2
  const knob = add(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshStandardMaterial({ color: '#f4efe4', emissive: '#aaa', emissiveIntensity: 0.4 }), 0, 0.17, 0.14, sw)
  void knob
  const swText = label(E.labels.white, { size: 0.1, c: '#ffcfc6', maxWidth: 0.9 })
  swText.position.set(3.45, top3 + 0.46, -10.75)
  root.add(swText)

  // ---- what a visitor does ----
  const printVerb = () => {
    const H = E.print.hints
    const c = cur.st
    if (exposing) return at(E.plate.says.wait, level())
    if (c.fog >= 0.5) return H.fresh
    if (c.e <= 0) return c.w === 'easel' ? H.expose : H.fresh
    return { easel: H.done, dev: H.stop, stop: H.fix, fix: H.wash, wash: H.hang }[c.w] ?? H.dev
  }
  const toneOf = e => (e < 6 ? 'pale' : e <= 24 ? 'good' : 'dark')
  const exposedSafe = () => cur.st.e > 0 && cur.st.fp < 1
  function startExpose(secs) {
    exposing = { t: 0, dur: clamp(secs * 0.1, 1.2, 3.6), secs }
    play('shutter')
  }
  function hang() {
    const c = cur
    const slot = VSLOTS[hungSeq % VSLOTS.length]
    hungSeq++
    const old = hung.findIndex(h => h.slot === slot)
    if (old >= 0) {
      root.remove(hung[old].mesh, hung[old].peg)
      hung[old].mat.dispose()
      hung.splice(old, 1)
    }
    c.st.w = 'line'
    hung.push({ slot, mesh: c.mesh, mat: c.mat, peg: peg(slot), st: { e: c.st.e, dp: c.st.dp, fx: c.st.fp >= 1 ? 1 : 0, wx: c.st.wp >= 1 ? 1 : 0, fog: c.st.fog } })
    cur = newSheet()
    told = { fog: false }
    return hung[hung.length - 1]
  }
  function printStep(what) {
    mine = true
    const c = cur.st
    if (exposing) {
      say(at(E.plate.says.wait, level()))
      return false
    }
    const S = E.print.says
    switch (what) {
      case 'expose':
        if (c.w !== 'easel') return tell(S.needNew)
        if (c.e > 0) return tell(S.already)
        c.e = Math.max(1, Math.round(P.secs))
        cur.mat.uniforms.map.value = texFor(c.e)
        startExpose(c.e)
        tell(S[toneOf(c.e)], { n: c.e })
        break
      case 'dev':
      case 'stop':
      case 'fix':
      case 'wash':
        if (c.e <= 0) return say(printVerb())
        if (c.w === 'dev' && what !== 'dev' && c.dp < 0.6) later(0.4, () => mine && tell(S.early))
        c.w = what
        play('tap')
        tell(S[what])
        break
      case 'hang': {
        if (c.e <= 0) return tell(S.hangNothing)
        const raw = c.fp < 1
        const unwashed = !raw && c.wp < 1
        hang()
        play('select')
        tell(raw ? S.hangRaw : unwashed ? S.hangUnwashed : S.hang)
        break
      }
      case 'light':
        P.white = P.white ? 0 : 1
        play('tap')
        if (P.white) tell(exposedSafe() ? S.fog : S.white)
        else tell(S.red)
        break
      case 'fresh':
        root.remove(cur.mesh)
        cur.mat.dispose()
        cur = newSheet()
        told = { fog: false }
        play('tap')
        tell(S.fresh)
        break
      case 'next':
        // the sheet itself: on to its next step
        if (c.w === 'easel') return printStep(c.e > 0 ? 'dev' : 'expose')
        return printStep({ dev: 'stop', stop: 'fix', fix: 'wash', wash: 'hang' }[c.w])
      default:
        return false
    }
    ex.discover('print', prPanel, 2.4)
    share('print')
    return true
  }
  let sSend = null
  function setSecs(v) {
    P.secs = clamp(Math.round(Number(v) || 1), 1, 40)
    if (!sSend) {
      sSend = setTimeout(() => {
        sSend = null
        share('print')
      }, 250)
    }
  }
  const prPanel = lv => ({
    title: E.print.title,
    color,
    blocks: [
      { slider: { label: E.print.slider, min: 1, max: 40, step: 1, value: P.secs, onInput: v => setSecs(v), format: v => fill(E.print.slideFormat, { n: Math.round(v) }), live: () => P.secs } },
      { buttons: ['expose', 'dev', 'stop', 'fix', 'wash', 'hang', 'light', 'fresh'].map(k => ({ label: E.print.buttons[k], onClick: () => printStep(k) })) },
      ...paras(E.print.panel, lv),
    ],
  })
  ex.add({
    id: 'print',
    x: 0.2,
    z: -8.8,
    radius: 3.8,
    manual: true,
    label: E.print.label,
    verb: printVerb,
    screens: [clock],
    focus: { x: -0.4, y: 1.3, z: -11.0, size: 4.1, width: 7.6 },
    act: () => ctx.showPanel(prPanel),
  })
  clickable(enlarger, () => printStep('expose'), { reach: 7.5 })
  clickable(baseboard, () => printStep('fresh'), { reach: 7.5 })
  for (const k of THREE_STEPS) clickable(trays[k].group, () => printStep(k), { reach: 7.5 })
  clickable(lineHit, () => printStep('hang'), { reach: 7.5 })
  clickable(sw, () => printStep('light'), { reach: 7.5 })
  const paperTap = () => printStep('next')
  // the sheet in play is a clickable that follows `cur`
  const curProxy = new THREE.Group()
  root.add(curProxy)
  const curHit = add(new THREE.PlaneGeometry(PAPER.w, PAPER.h), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }), 0, 0, 0, curProxy)
  void curHit
  clickable(curProxy, paperTap, { reach: 7.5 })

  const printState = () => ({
    white: P.white,
    secs: P.secs,
    cur: { w: cur.st.w, e: cur.st.e, dp: Q(cur.st.dp), sp: Q(cur.st.sp), fp: Q(cur.st.fp), wp: Q(cur.st.wp), fog: Q(cur.st.fog) },
    hung: hung.map(h => ({ slot: h.slot, e: h.st.e, dp: Q(h.st.dp), fx: h.st.fx, wx: h.st.wx, fog: Q(h.st.fog) })),
    seq: hungSeq,
  })
  const printSet = (s, live) => {
    mine = false
    P.white = s?.white ? 1 : 0
    P.secs = clamp(Math.round(Number(s?.secs) || 10), 1, 40)
    const c = s?.cur ?? {}
    const was = cur.st.e
    cur.st.w = ['easel', ...THREE_STEPS].includes(c.w) ? c.w : 'easel'
    cur.st.e = Math.max(0, Math.round(Number(c.e) || 0))
    for (const k of ['dp', 'sp', 'fp', 'wp', 'fog']) cur.st[k] = clamp(Number(c[k]) || 0, 0, 1)
    cur.mat.uniforms.map.value = cur.st.e > 0 ? texFor(cur.st.e) : blank
    if (live && was === 0 && cur.st.e > 0) startExpose(cur.st.e)
    const list = Array.isArray(s?.hung) ? s.hung.slice(0, 4) : []
    const sameSlots = list.length === hung.length && list.every((h, i) => h.slot === hung[i].slot && h.e === hung[i].st.e)
    if (!sameSlots) {
      for (const h of hung) {
        root.remove(h.mesh, h.peg)
        h.mat.dispose()
      }
      hung.length = 0
      for (const h of list) {
        const slot = VSLOTS.includes(h.slot) ? h.slot : 0
        const p = makePaper(texFor(Math.max(1, Number(h.e) || 1)))
        const pose = hangPose(slot)
        p.mesh.position.set(pose.x, pose.y, pose.z)
        hung.push({ slot, ...p, peg: peg(slot), st: { e: Math.round(h.e), dp: 0, fx: 0, wx: 0, fog: 0 } })
      }
    }
    list.forEach((h, i) => Object.assign(hung[i].st, { dp: clamp(Number(h.dp) || 0, 0, 1), fx: h.fx ? 1 : 0, wx: h.wx ? 1 : 0, fog: clamp(Number(h.fog) || 0, 0, 1) }))
    hungSeq = Math.max(0, Math.round(Number(s?.seq) || 0))
  }

  updates.push((dt, t) => {
    // the white light, and the paper's colour in it
    whiteK = damp(whiteK, P.white, 6, dt)
    stage.setWhite(whiteK)
    lightC.value.set(0.85, 0.32, 0.28).lerp(V3(1.05, 1.02, 0.98), whiteK)
    lever.rotation.x = Math.PI / 2 + (P.white ? -0.5 : 0.5)
    knob.position.y = P.white ? 0.2 : 0.14
    // the exposure: the lamp lit while the seconds run
    let lit = 0
    if (exposing) {
      exposing.t += dt
      lit = exposing.t < exposing.dur ? 1 : 0
      if (exposing.t >= exposing.dur) exposing = null
    }
    litK = damp(litK, lit, 14, dt)
    cone.material.opacity = 0.2 * litK
    projected.material.opacity = 0.85 * litK
    projected.visible = litK > 0.02 && cur.st.w === 'easel'
    lensGlass.visible = litK > 0.05
    enlLight.intensity = 7 * litK
    // the sheet in play, its baths, fogging
    const c = cur.st
    if (c.e > 0) {
      if (c.w === 'dev') c.dp = Math.min(1, c.dp + dt / 6)
      if (c.w === 'stop') c.sp = Math.min(1, c.sp + dt / 3)
      if (c.w === 'fix') c.fp = Math.min(1, c.fp + dt / 12)
      if (c.w === 'wash') c.wp = Math.min(1, c.wp + dt / 18)
    }
    if (whiteK > 0.5) {
      if (c.fp < 1) c.fog = Math.min(1, c.fog + dt / 5)
      for (const h of hung) if (!h.st.fx) h.st.fog = Math.min(1, h.st.fog + dt / 5)
      if (c.fog > 0.25 && !told.fog && mine && c.e > 0) {
        told.fog = true
        tell(E.print.says.fog)
      }
    }
    cur.mat.uniforms.dp.value = c.dp
    cur.mat.uniforms.fog.value = c.fog
    glide(cur.mesh, paperPose(c.w), dt)
    curProxy.position.copy(cur.mesh.position)
    curProxy.rotation.copy(cur.mesh.rotation)
    for (const h of hung) {
      h.mat.uniforms.dp.value = h.st.dp
      h.mat.uniforms.fog.value = h.st.fog
      glide(h.mesh, hangPose(h.slot), dt)
    }
    // the clock
    const B3t = E.print.board
    if (exposing) setClock(B3t.easel, `${num(exposing.secs * clamp(exposing.t / exposing.dur), 0, lang)} s`)
    else if (c.e > 0 && c.w !== 'easel') {
      const sec = { dev: c.dp * 6, stop: c.sp * 3, fix: c.fp * 12, wash: c.wp * 18 }[c.w] * 10
      setClock(B3t[c.w], mmss(sec))
    } else setClock(B3t.idle, '')
  })

  updates.push((dt, t) => {
    stage.update(t)
  })

  // the eye stays in the room its walker is in: the partition between studio and darkroom is no place for a camera
  const inDark = () => (ctx.engine?.player?.pos?.z ?? 5) < D.zp
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: {
      minX: stage.cameraBounds.minX,
      maxX: stage.cameraBounds.maxX,
      minY: stage.cameraBounds.minY,
      maxY: stage.cameraBounds.maxY,
      get minZ() { return inDark() ? stage.cameraBounds.minZ : D.zp + 0.5 },
      get maxZ() { return inDark() ? D.zp - 0.5 : 6.4 },
    },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: -1.8, z: 5.3, yaw: Math.atan2(-1.8, 0.7) },
    back: { x: 0, z: 7.25, rot: Math.PI },
    stand: { x: 2.3, z: 6.1, rot: Math.atan2(-2.3, -1.5) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      rayTo,
      plate: {
        tap: what => plateStep(what), // 'iodine' 'camera' 'mercury' 'hypo' 'tilt' 'fresh' 'next'
        setExposure: v => setV(v),
        get state() { return plateState() },
        get shooting() { return !!S1.shot },
        at: what => ({
          iodine: V3(SPOT.iodine, B1.top + 0.2, B1.z),
          camera: V3(CAM.x, 1.42, CAM.z),
          mercury: V3(SPOT.mercury, B1.top + 0.25, B1.z),
          hypo: V3(SPOT.hypo, B1.top + 0.07, B1.z),
          stack: V3(SPOT.stack, B1.top + 0.05, B1.z),
          plate: plate.position.clone(),
        })[what],
      },
      grain: {
        tap: what => grainStep(what), // 'photon' 'develop' 'fresh' 'strip'
        setLight: v => setL(v, true),
        get state() { return grainState() },
        get busy() { return !!(ev || pour) },
        at: what => ({
          lamp: V3(LAMP.x, LAMP.y, LAMP.z),
          bottle: bottle.position.clone(),
          strip: V3(STRIP.x - 0.05, STRIP.y, STRIP.z),
          crystal: V3(CR.x, CR.y, CR.z + 0.7),
        })[what],
      },
      print: {
        tap: what => printStep(what), // 'expose' 'dev' 'stop' 'fix' 'wash' 'hang' 'light' 'fresh' 'next'
        setSeconds: v => setSecs(v),
        get state() { return printState() },
        get busy() { return !!exposing },
        at: what => ({
          enlarger: V3(ENL.x, 2.0, ENL.z - 0.05),
          dev: V3(TRAY.dev, top3 + 0.05, TRAY.z),
          stop: V3(TRAY.stop, top3 + 0.05, TRAY.z),
          fix: V3(TRAY.fix, top3 + 0.05, TRAY.z),
          wash: V3(TRAY.wash, top3 + 0.05, TRAY.z),
          line: V3(0, LINE.y - 0.3, LINE.z - 0.05),
          light: V3(3.45, top3 + 0.2, -10.75),
          paper: cur.mesh.position.clone(),
          baseboard: V3(ENL.x + 0.34, top3 + 0.04, ENL.z + 0.3),
        })[what],
      },
    },
    panels: { plate: plPanel, grain: gPanel, print: prPanel },
    shared: {
      plate: { get: plateState, set: plateSet },
      grain: { get: grainState, set: grainSet },
      print: { get: printState, set: printSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (vSend) clearTimeout(vSend)
      if (lSend) clearTimeout(lSend)
      if (sSend) clearTimeout(sSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
