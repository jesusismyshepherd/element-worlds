// Silicon's picture "What are the Earth and Moon made of?" as a room (docs/knowledge/picture-rooms.md): a
// viewing deck floating in space beside the Earth, cut open with its layers in true proportion, the Moon
// at its true size beside it and a massive star far off. Three things to do: send a light from the surface
// to the centre (a lens shows the atoms wherever it is, as the picture's magnifier does); bring the Moon's
// rocks to a case and compare their oxygen with the Earth's; watch silicon being made in a star and
// scattered into the cloud the Sun and the planets grew from. All three are shared in a room
// (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, random, hdr, standingScreen } from '../../../wings/noble/kit.js'
import { spaceStage } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { element } from '../../../../data/elements.js'
import { EARTH_WORDS } from './earth.words.js'

export const WORDS = EARTH_WORDS

const TAU = Math.PI * 2
const R_KM = 6371
// the bottom of each layer, km: crust, upper mantle, transition zone, lower mantle, outer core, inner core
const BOUNDS = [35, 410, 660, 2890, 5150, 6371]
// where "Go deeper" stops: inside each layer in turn, the last at the centre
const STOPS = [20, 220, 535, 1700, 4000, 6371]
const layerAt = d => (d < 0.5 ? -1 : BOUNDS.findIndex(b => d <= b + 1e-6))
// the slider moves faster through the deep, thick layers than through the thin ones near the top
const SLIDE = 1.6
const depthOf = p => R_KM * Math.pow(clamp(p), SLIDE)
const posOf = d => Math.pow(clamp(d / R_KM), 1 / SLIDE)

const COL = {
  Si: element('Si')?.cpk ?? '#f0c8a0',
  O: '#f2302b',
  Mg: element('Mg')?.cpk ?? '#8aff00',
  Fe: element('Fe')?.cpk ?? '#e06633',
  Ni: element('Ni')?.cpk ?? '#50d050',
}

// where things float, round a deck of radius 9 (the visitor arrives at z 4.6, facing -z)
const DECK = 9
const EARTH = new THREE.Vector3(0, 3.2, -15.2)
const ER = 5.0
const MOON = new THREE.Vector3(9.6, 6.4, -14.5)
const MR = ER * (1737.4 / 6371) // the Moon at its true size beside the Earth
const STAR = new THREE.Vector3(-14.5, 5.3, -10.8)
const RS = 2.6
const K = RS / 2 // the star's story is drawn at the star's size
const LENS = new THREE.Vector3(-6.7, 1.5, -12.0)
const LR = 1.15

// ---- the Earth's face: land, sea, ice and clouds on an equirectangular map ----

// rough coastlines, [lon, lat, ...]
const LAND = [
  // North America
  [-166, 68, -156, 71, -140, 70, -128, 70, -115, 68, -100, 68, -95, 72, -82, 70, -80, 64, -92, 62, -94, 58, -88, 56, -82, 55, -79, 52, -78, 58, -76, 62, -66, 59, -62, 56, -56, 52, -60, 47, -66, 45, -70, 42, -74, 40, -76, 35, -81, 31, -80, 26, -82, 25, -83, 29, -89, 30, -94, 29, -97, 26, -97, 21, -94, 18, -91, 19, -90, 21, -87, 21, -88, 16, -84, 15, -83, 10, -79, 8, -80, 7, -85, 10, -88, 13, -92, 14, -96, 16, -105, 20, -106, 23, -110, 24, -112, 29, -115, 31, -117, 32, -120, 34, -124, 40, -124, 46, -125, 50, -131, 55, -137, 58, -146, 61, -152, 59, -158, 57, -164, 55, -160, 58, -163, 61, -165, 63, -163, 66],
  // the Arctic islands, Baffin Island, Greenland, Iceland
  [-122, 72, -100, 74, -82, 74, -70, 78, -88, 81, -112, 78],
  [-80, 64, -64, 66, -68, 71, -80, 73, -90, 69],
  [-73, 78, -60, 82, -35, 83, -20, 80, -18, 76, -22, 70, -30, 68, -40, 65, -44, 60, -50, 62, -53, 66, -55, 70, -60, 76],
  [-24, 64, -22, 66, -15, 66.5, -13, 65, -18, 63.5],
  // Cuba
  [-85, 22, -80, 23, -74, 20, -78, 20],
  // South America
  [-78, 8, -72, 12, -64, 11, -60, 8, -52, 5, -50, 0, -44, -2, -35, -6, -38, -13, -40, -20, -44, -23, -48, -26, -49, -29, -53, -34, -57, -36, -58, -39, -62, -39, -65, -42, -66, -47, -68, -50, -70, -53, -68, -55, -72, -54, -75, -50, -74, -44, -73, -38, -71, -30, -70, -18, -76, -14, -80, -6, -81, -3, -80, 1, -78, 4],
  // Africa, Madagascar
  [-17, 21, -16, 15, -12, 8, -8, 4, -2, 5, 5, 6, 9, 4, 10, 1, 9, -1, 12, -6, 13, -12, 12, -17, 15, -26, 18, -33, 20, -35, 26, -34, 32, -28, 33, -25, 36, -20, 40, -15, 40, -10, 39, -5, 42, -1, 46, 2, 51, 11, 44, 11, 43, 12, 38, 18, 35, 24, 33, 28, 32, 31, 25, 32, 20, 31, 15, 32, 10, 34, 10, 37, 3, 37, -2, 35, -6, 36, -10, 31, -13, 27, -16, 24],
  [44, -25, 47, -25, 50, -15, 49, -12, 44, -17, 43, -22],
  // Eurasia
  [-10, 36, -9, 43, -2, 44, -5, 48, -2, 49, 2, 51, 5, 53, 8, 57, 12, 56, 10, 59, 5, 58, 5, 62, 14, 68, 20, 70, 26, 71, 33, 70, 41, 67, 45, 68, 53, 68, 60, 70, 68, 73, 80, 73, 87, 75, 100, 78, 113, 74, 125, 73, 140, 72, 160, 70, 180, 69, 180, 65, 172, 60, 163, 59, 162, 56, 156, 51, 155, 57, 141, 59, 135, 55, 141, 52, 141, 47, 135, 43, 129, 41, 129, 35, 126, 35, 125, 39, 121, 40, 122, 37, 120, 35, 122, 30, 120, 26, 116, 22, 110, 21, 108, 18, 109, 12, 106, 9, 103, 10, 101, 13, 100, 8, 104, 1, 101, 3, 98, 8, 98, 16, 94, 17, 92, 22, 88, 22, 86, 20, 80, 15, 80, 10, 77, 8, 73, 17, 72, 21, 67, 25, 57, 25, 56, 27, 50, 30, 48, 30, 51, 24, 56, 26, 59, 22, 55, 17, 45, 13, 43, 13, 39, 21, 35, 28, 34, 31, 36, 36, 27, 37, 26, 40, 23, 38, 22, 37, 20, 40, 18, 40, 16, 38, 15, 40, 12, 42, 9, 44, 3, 43, -1, 38, -6, 36],
  // Britain, Ireland, Japan, the islands of South-East Asia, Australia, New Zealand
  [-5, 50, 1, 51, 2, 53, -1, 55, -2, 57, -4, 58.5, -6, 57, -5, 55, -3, 54, -5, 52],
  [-10, 52, -6, 52, -6, 55, -8, 55, -10, 54],
  [130, 31, 135, 34, 140, 35, 141, 38, 142, 40, 141, 42, 145, 44, 141, 45, 140, 42, 139, 38, 136, 36, 132, 35],
  [95, 5, 98, 4, 104, -2, 106, -6, 102, -4, 97, 2],
  [109, 2, 112, 3, 117, 7, 119, 5, 116, 0, 116, -4, 110, -3],
  [105, -6, 114, -7, 114, -8.5, 105, -7],
  [131, -1, 138, -2, 145, -5, 150, -10, 143, -9, 138, -8, 134, -4],
  [120, 18, 122, 18, 124, 12, 126, 8, 122, 7, 121, 12],
  [114, -22, 115, -34, 118, -35, 124, -34, 131, -31, 135, -35, 138, -35, 140, -38, 146, -39, 150, -37, 153, -31, 153, -25, 150, -22, 146, -19, 145, -15, 142, -11, 141, -17, 137, -16, 136, -12, 131, -11, 129, -15, 126, -14, 122, -17, 120, -20],
  [172, -34, 175, -37, 178, -38, 176, -41, 172, -41],
  [172, -41, 174, -41, 171, -44, 167, -46, 169, -44],
]
// inland seas painted back over the land: the Black Sea and the Caspian (ellipses), the Baltic, the Red Sea
const SEAS = [[34, 43.5, 7, 2.6], [50.5, 41.5, 2.6, 5.2]]
const BALTIC = [10, 54, 14, 54, 21, 55, 21, 57, 24, 57, 23, 59, 30, 60, 22, 61, 21, 64, 25, 66, 22, 66, 17, 62, 19, 60, 16, 56, 12, 56]
const ANTARCTICA = [-180, -90, -180, -66, -150, -75, -120, -73, -100, -72, -75, -70, -60, -64, -57, -63, -62, -66, -60, -72, -40, -78, -20, -72, 0, -70, 30, -69, 60, -67, 90, -66, 120, -66, 150, -68, 165, -72, 170, -77, 180, -78, 180, -90]
// deserts and high plateaus (lon, lat, half-widths in degrees, colour)
const DRY = [
  [10, 23, 22, 8, '#c9a865'], [47, 23, 9, 7, '#c9a865'], [132, -25, 12, 7, '#b88a52'], [103, 43, 12, 4, '#a89060'],
  [22, -23, 5, 4, '#b69a62'], [-112, 33, 6, 4, '#b08a5a'], [88, 33, 10, 4, '#8a7a5a'], [62, 42, 8, 5, '#b09a6a'],
]

function earthTexture(w) {
  return canvasTex(w, w / 2, (g, W, H) => {
    const X = lon => ((lon + 180) / 360) * W
    const Y = lat => ((90 - lat) / 180) * H
    const sea = g.createLinearGradient(0, 0, 0, H)
    sea.addColorStop(0, '#1b4a86')
    sea.addColorStop(0.3, '#2a72c6')
    sea.addColorStop(0.5, '#3184d8')
    sea.addColorStop(0.7, '#2a72c6')
    sea.addColorStop(1, '#1b4a86')
    g.fillStyle = sea
    g.fillRect(0, 0, W, H)
    const path = pts => {
      g.beginPath()
      for (let i = 0; i < pts.length; i += 2) g[i ? 'lineTo' : 'moveTo'](X(pts[i]), Y(pts[i + 1]))
      g.closePath()
    }
    const blob = (lon, lat, rx, ry, fill) => {
      g.fillStyle = fill
      g.beginPath()
      g.ellipse(X(lon), Y(lat), (rx / 360) * W, (ry / 180) * H, 0, 0, TAU)
      g.fill()
    }
    // shallow water round the coasts
    g.lineJoin = 'round'
    g.strokeStyle = 'rgba(110,190,240,0.45)'
    g.lineWidth = W / 220
    for (const pts of LAND) {
      path(pts)
      g.stroke()
    }
    g.fillStyle = '#3d8a3a'
    for (const pts of LAND) {
      path(pts)
      g.fill()
    }
    // what grows or does not: painted inside the coasts only
    g.save()
    g.beginPath()
    for (const pts of LAND) {
      for (let i = 0; i < pts.length; i += 2) g[i ? 'lineTo' : 'moveTo'](X(pts[i]), Y(pts[i + 1]))
      g.closePath()
    }
    g.clip()
    // the far north and south of the land: tundra, darker forest
    const band = g.createLinearGradient(0, 0, 0, H)
    band.addColorStop(0.1, 'rgba(120,130,90,0.6)')
    band.addColorStop(0.25, 'rgba(30,90,40,0.35)')
    band.addColorStop(0.42, 'rgba(0,0,0,0)')
    band.addColorStop(0.55, 'rgba(20,110,40,0.3)')
    band.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = band
    g.fillRect(0, 0, W, H)
    for (const [lon, lat, rx, ry, c] of DRY) {
      g.globalAlpha = 0.85
      blob(lon, lat, rx, ry, c)
      g.globalAlpha = 0.4
      blob(lon, lat, rx * 1.35, ry * 1.35, c)
    }
    g.globalAlpha = 1
    g.restore()
    // the inland seas
    for (const [lon, lat, rx, ry] of SEAS) blob(lon, lat, rx, ry, '#2a72c6')
    g.fillStyle = '#2a6cbc'
    path(BALTIC)
    g.fill()
    g.strokeStyle = '#2a72c6'
    g.lineWidth = W / 500
    g.beginPath()
    g.moveTo(X(33), Y(28))
    g.lineTo(X(43), Y(13))
    g.stroke()
    // ice: Greenland's cap, Antarctica, the Arctic sea ice
    g.fillStyle = '#eef3fb'
    path(ANTARCTICA)
    g.fill()
    path([-70, 78, -58, 81, -35, 82, -24, 79, -24, 74, -32, 69, -42, 64, -48, 66, -53, 70, -58, 76])
    g.fill()
    g.globalAlpha = 0.85
    g.fillRect(0, 0, W, Y(84))
    g.globalAlpha = 1
    // grain, so nothing looks flat close up
    const rnd = random(4)
    for (let i = 0; i < W * 3; i++) {
      const v = rnd() < 0.5 ? 0 : 255
      g.fillStyle = `rgba(${v},${v},${v},${0.03 + rnd() * 0.05})`
      g.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2)
    }
    // clouds: soft streaks, more along the equator and in the stormy middle latitudes
    for (let i = 0; i < 110; i++) {
      const lat = [0, 8, -8, 45, -48, 58, -60][i % 7] + (rnd() - 0.5) * 16
      const lon = rnd() * 360 - 180
      const rx = 4 + rnd() * 14
      g.globalAlpha = 0.18 + rnd() * 0.22
      blob(lon, lat, rx, 1 + rnd() * 2.6, '#ffffff')
    }
    g.globalAlpha = 1
  })
}

/** A sphere with the octant x, y, z > 0 cut away (its segments meet the cut planes exactly). */
function cutSphere(r, ws, hs) {
  const geo = new THREE.SphereGeometry(r, ws, hs)
  const p = geo.attributes.position
  const idx = geo.index.array
  const keep = []
  for (let i = 0; i < idx.length; i += 3) {
    let x = 0
    let y = 0
    let z = 0
    for (let k = 0; k < 3; k++) {
      x += p.getX(idx[i + k])
      y += p.getY(idx[i + k])
      z += p.getZ(idx[i + k])
    }
    if (x > 1e-4 && y > 1e-4 && z > 1e-4) continue
    keep.push(idx[i], idx[i + 1], idx[i + 2])
  }
  geo.setIndex(keep)
  return geo
}

/** The cut's faces: a quarter disc, its centre at the bottom-left corner, the layers by radius. With
 *  `glow`, only what glows (the hot core brightly, the mantle faintly). */
function cutTexture(w, glow) {
  return canvasTex(w, w, g => {
    g.clearRect(0, 0, w, w)
    const cx = 0
    const cy = w
    const fr = d => (1 - d / R_KM) * w
    const quarter = (r, fill) => {
      g.fillStyle = fill
      g.beginPath()
      g.moveTo(cx, cy)
      g.arc(cx, cy, r, -Math.PI / 2, 0)
      g.closePath()
      g.fill()
    }
    const rad = (r0, r1, stops) => {
      const grd = g.createRadialGradient(cx, cy, r0, cx, cy, r1)
      for (const [k, c] of stops) grd.addColorStop(k, c)
      return grd
    }
    if (glow) {
      quarter(w, '#000000')
      quarter(fr(35), 'rgba(40,60,10,1)')
      quarter(fr(2890), rad(fr(5150), fr(2890), [[0, '#ffb040'], [1, '#c84a10']]))
      quarter(fr(5150), rad(0, fr(5150), [[0, '#fff4c0'], [1, '#ffcc40']]))
      return
    }
    quarter(w, '#7a5536')
    quarter(fr(35), rad(fr(410), fr(35), [[0, '#8cc23a'], [1, '#a8d850']]))
    quarter(fr(410), rad(fr(660), fr(410), [[0, '#4a9a6a'], [1, '#5aa874']]))
    quarter(fr(660), rad(fr(2890), fr(660), [[0, '#6a5a2c'], [0.25, '#5a6a2a'], [1, '#4f7a2a']]))
    quarter(fr(2890), rad(fr(5150), fr(2890), [[0, '#ffb04a'], [1, '#e0661a']]))
    quarter(fr(5150), rad(0, fr(5150), [[0, '#fff0b0'], [0.7, '#ffd04a'], [1, '#f0a828']]))
    // grains of olivine in the upper mantle and the transition zone, coarser grains below
    const rnd = random(14)
    const fleck = (d0, d1, n, size, colours) => {
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 0.5
        const r = fr(d1) + rnd() * (fr(d0) - fr(d1))
        g.fillStyle = colours[(rnd() * colours.length) | 0]
        g.globalAlpha = 0.55
        g.beginPath()
        g.arc(cx + Math.sin(a) * r, cy - Math.cos(a) * r, size * (0.5 + rnd()), 0, TAU)
        g.fill()
      }
      g.globalAlpha = 1
    }
    fleck(35, 410, 220, w / 300, ['#c8e85a', '#5a8a20', '#b0d84a', '#3a5a14'])
    fleck(410, 660, 160, w / 340, ['#7ad0a0', '#2a6a4a', '#9ae0b0'])
    fleck(660, 2890, 700, w / 260, ['#7a8a3a', '#3a4a1a', '#8a7a3a', '#5a6a2a'])
    // the liquid outer core: swirls
    g.strokeStyle = 'rgba(255,220,140,0.35)'
    g.lineWidth = w / 260
    for (let i = 0; i < 14; i++) {
      const r = fr(5150) + 0.08 * w + rnd() * (fr(2890) - fr(5150) - 0.16 * w)
      const a0 = rnd() * 1.2
      g.beginPath()
      g.arc(cx, cy, r, -Math.PI / 2 + a0, -Math.PI / 2 + a0 + 0.2 + rnd() * 0.3)
      g.stroke()
    }
    // the boundaries
    g.strokeStyle = 'rgba(20,24,12,0.7)'
    g.lineWidth = w / 400
    for (const d of [35, 410, 660, 2890, 5150]) {
      g.beginPath()
      g.arc(cx, cy, fr(d), -Math.PI / 2, 0)
      g.stroke()
    }
  })
}

// ---- the Moon: highlands, the dark maria of the near side, craters ----

const MARIA = [
  [-57, 18, 22, 26], [-45, 0, 14, 14], [-16, 33, 16, 11], [17, 28, 9, 8], [31, 8, 12, 9], [59, 17, 7, 6], [51, -8, 7, 10],
  [35, -15, 5, 5], [-17, -21, 10, 8], [-39, -24, 5, 5], [0, 56, 30, 4], [4, 13, 4, 3], [-31, 7, 7, 5], [-23, -10, 5, 4], [147, 27, 4, 4],
]
// the six Apollo landing sites (lat, lon east)
const APOLLO = { 11: [0.674, 23.473], 12: [-3.012, -23.422], 14: [-3.645, -17.471], 15: [26.132, 3.634], 16: [-8.973, 15.5], 17: [20.191, 30.772] }

function moonTexture(w) {
  return canvasTex(w, w / 2, (g, W, H) => {
    const X = lon => ((lon + 180) / 360) * W
    const Y = lat => ((90 - lat) / 180) * H
    g.fillStyle = '#aeb2ba'
    g.fillRect(0, 0, W, H)
    const rnd = random(1969)
    for (let i = 0; i < W * 4; i++) {
      const v = 120 + rnd() * 90
      g.fillStyle = `rgba(${v},${v + 2},${v + 8},${0.12 + rnd() * 0.18})`
      g.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 3, 1 + rnd() * 3)
    }
    for (const [lon, lat, rx, ry] of MARIA) {
      for (const [k, a] of [[1.15, 0.25], [1, 0.6], [0.8, 0.5]]) {
        g.fillStyle = `rgba(78,83,94,${a})`
        g.beginPath()
        g.ellipse(X(lon), Y(lat), ((rx * k) / 360) * W, ((ry * k) / 180) * H, 0, 0, TAU)
        g.fill()
      }
    }
    const crater = (lon, lat, r, bright = 0) => {
      const x = X(lon)
      const y = Y(lat)
      const rr = (r / 360) * W
      g.fillStyle = 'rgba(70,74,84,0.55)'
      g.beginPath()
      g.arc(x + rr * 0.12, y + rr * 0.12, rr, 0, TAU)
      g.fill()
      g.fillStyle = `rgba(${200 + bright * 40},${202 + bright * 40},${208 + bright * 40},0.75)`
      g.beginPath()
      g.arc(x, y, rr * 0.86, 0, TAU)
      g.fill()
      g.fillStyle = 'rgba(120,124,134,0.6)'
      g.beginPath()
      g.arc(x + rr * 0.08, y + rr * 0.08, rr * 0.62, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 260; i++) crater(rnd() * 360 - 180, (rnd() - 0.5) * 160, 0.4 + rnd() * rnd() * 3)
    // Tycho and its rays, Copernicus, Kepler
    g.strokeStyle = 'rgba(235,238,245,0.3)'
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU + rnd() * 0.2
      const len = 12 + rnd() * 30
      g.lineWidth = 1 + rnd() * 2
      g.beginPath()
      g.moveTo(X(-11), Y(-43))
      g.lineTo(X(-11 + Math.cos(a) * len * 1.3), Y(-43 + Math.sin(a) * len))
      g.stroke()
    }
    crater(-11, -43, 2.2, 1)
    crater(-20, 10, 2.6, 1)
    crater(-38, 8, 1.4, 1)
  })
}

/** A point on a sphere of radius r at a latitude and an east longitude (degrees), in the sphere's own
 *  coordinates (three.js's sphere maps longitude 0 to +x). */
function onSphere(lat, lon, r) {
  const p = THREE.MathUtils.degToRad(lat)
  const l = THREE.MathUtils.degToRad(lon)
  return new THREE.Vector3(r * Math.cos(p) * Math.cos(l), r * Math.sin(p), -r * Math.cos(p) * Math.sin(l))
}

/** A lumpy rock (non-indexed: every corner moves by its own direction, so shared corners stay together). */
function rockGeometry(seed) {
  const geo = new THREE.IcosahedronGeometry(1, 2)
  const rnd = random(seed)
  const k = [rnd() * 9, rnd() * 9, rnd() * 9]
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize()
    const n = 1 + 0.2 * Math.sin(v.x * 3 + k[0]) * Math.sin(v.y * 4 + k[1]) * Math.sin(v.z * 3.5 + k[2]) + 0.07 * Math.sin(v.x * 8 + v.y * 6 + k[2])
    p.setXYZ(i, v.x * n * 1.2, v.y * n * 0.8, v.z * n)
  }
  geo.computeVertexNormals()
  return geo
}

// ---- the lens: atoms as they are at each depth (lens coordinates, metres, facing +z) ----

function lensLayout(layer) {
  const out = []
  const R = LR - 0.05
  const add = (x, y, r, el) => {
    if (Math.hypot(x, y) + r < R) out.push({ x, y, r, c: new THREE.Color(COL[el]) })
  }
  const span = 5
  if (layer <= 0) {
    // the crust: silicon and oxygen in a framework, every oxygen shared by two silicons (as in quartz)
    const a = 0.32
    const sx = Math.sqrt(3) * a
    for (let j = -span; j <= span; j++) {
      for (let i = -span; i <= span; i++) {
        const x = i * sx + (j % 2 ? sx / 2 : 0)
        const y = j * 1.5 * a
        add(x, y, 0.1, 'Si')
        add(x, y + a, 0.1, 'Si')
        add(x, y + a / 2, 0.072, 'O')
        add(x - sx / 4, y - a / 4, 0.072, 'O')
        add(x + sx / 4, y - a / 4, 0.072, 'O')
      }
    }
  } else if (layer === 1 || layer === 2) {
    // olivine: separate SiO4 tetrahedra (seen from above, the fourth oxygen on top), magnesium and some
    // iron between them; in the transition zone the same atoms packed tighter
    const k = layer === 2 ? 0.8 : 1
    const sx = 0.62 * k
    const sy = 0.54 * k
    for (let j = -span; j <= span; j++) {
      for (let i = -span; i <= span; i++) {
        const x = i * sx + (j % 2 ? sx / 2 : 0)
        const y = j * sy
        const turn = j % 2 ? Math.PI : 0
        add(x, y, 0.1 * (0.6 + 0.4 * k), 'Si')
        for (let q = 0; q < 3; q++) {
          const a = Math.PI / 2 + turn + (q * TAU) / 3
          add(x + Math.cos(a) * 0.19 * k, y + Math.sin(a) * 0.19 * k, 0.085 * (0.7 + 0.3 * k), 'O')
        }
        add(x + sx / 2, y + 0.05 * k, 0.1 * (0.7 + 0.3 * k), (i * 3 + j * 5 + 40) % 7 === 0 ? 'Fe' : 'Mg')
      }
    }
  } else if (layer === 3) {
    // bridgmanite: each silicon among six oxygens (four seen round it), magnesium in the gaps
    const s = 0.4
    for (let j = -span; j <= span; j++) {
      for (let i = -span; i <= span; i++) {
        const x = i * s - s / 4
        const y = j * s - s / 4
        add(x, y, 0.095, 'Si')
        add(x + s / 2, y, 0.072, 'O')
        add(x, y + s / 2, 0.072, 'O')
        add(x + s / 2, y + s / 2, 0.1, (i + j * 3 + 40) % 7 === 0 ? 'Fe' : 'Mg')
      }
    }
  } else {
    // the core: iron with some nickel, packed close; jumbled in the liquid outer core
    const s = layer === 4 ? 0.3 : 0.27
    const rnd = random(layer * 7 + 1)
    for (let j = -span - 2; j <= span + 2; j++) {
      for (let i = -span - 2; i <= span + 2; i++) {
        const jit = layer === 4 ? 0.07 : 0
        const x = i * s + (j % 2 ? s / 2 : 0) + (rnd() - 0.5) * jit
        const y = j * s * 0.866 + (rnd() - 0.5) * jit
        add(x, y, 0.12, rnd() < 0.1 ? 'Ni' : 'Fe')
      }
    }
  }
  return out
}

// ---- the star's story, in seconds ----

const T_OPEN = 1.2 // the star opens: its layers like an onion
const T_FUSE = 4.0 // oxygen burns into silicon until then
const T_BANG = 4.5 // the core collapses and the star explodes
const T_GATHER = 8.2 // the silicon drifts into a cloud
const T_DISC = 10.6 // the cloud falls into a spinning disc, a young Sun and planets
const T_FORMED = 14.0 // the story is told (using it again before then: busy)
const T_FADE = 19.0
const T_END = 20.5
// the onion's layers (outer radius, a share of the star's) and their elements
const ONION = [
  ['H', 0.95, '#ff9a5a'],
  ['He', 0.7, '#ffd77a'],
  ['C', 0.52, '#a9a6b8'],
  ['O', 0.38, '#ff6a5e'],
  ['Si', 0.24, COL.Si],
  ['Fe', 0.11, '#c8743c'],
]
const FUSIONS = 10

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable }) {
  const stage = spaceStage({ radius: DECK, light, pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1 })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const glowSprite = (c, size, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: c, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(size)
    return s
  }
  const metal = new THREE.MeshStandardMaterial({ color: '#39436a', roughness: 0.5, metalness: 0.3 })
  const panelOf = (title, panel, extra = []) => lv => ({
    title,
    color,
    blocks: [...(typeof extra === 'function' ? extra(lv) : extra), ...panel[lv === 'scientist' ? 'sci' : 'kid'].map(p => ({ p }))],
  })
  const label = (text, size, c = '#e8eeff', opts = {}) => makeText(text, { size, color: c, anchorX: 'center', anchorY: 'middle', ...opts })

  // ================= the Earth, cut open =================
  const earth = new THREE.Group()
  earth.position.copy(EARTH)
  // the cut's corner (the local +x+y+z octant) faces the deck, and its +y edge points up
  {
    const w = new THREE.Vector3(0, 2.0, -2).sub(EARTH).normalize()
    const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), w).normalize()
    const up = new THREE.Vector3().crossVectors(w, side).normalize()
    const dL = new THREE.Vector3(1, 1, 1).normalize()
    const yL = new THREE.Vector3(0, 1, 0).addScaledVector(dL, -1 / Math.sqrt(3)).normalize()
    const L = new THREE.Matrix4().makeBasis(dL, yL, new THREE.Vector3().crossVectors(dL, yL))
    const Wm = new THREE.Matrix4().makeBasis(w, up, new THREE.Vector3().crossVectors(w, up))
    earth.quaternion.setFromRotationMatrix(Wm.multiply(L.transpose()))
  }
  root.add(earth)
  const earthTurnBack = earth.quaternion.clone().invert()
  const surfTex = earthTexture(light ? 1024 : 2048)
  surfTex.wrapS = THREE.RepeatWrapping
  surfTex.offset.x = 0.12
  const faceTex = cutTexture(light ? 512 : 1024, false)
  const faceGlow = cutTexture(light ? 256 : 512, true)
  textures.push(surfTex, faceTex, faceGlow)
  const surface = new THREE.Mesh(cutSphere(ER, 96, 48), new THREE.MeshStandardMaterial({ map: surfTex, roughness: 0.75, metalness: 0 }))
  const earthBody = new THREE.Group()
  earth.add(earthBody)
  earthBody.add(surface)
  const faces = []
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, emissive: '#ffffff', emissiveMap: faceGlow, emissiveIntensity: 1.0, roughness: 0.85, side: THREE.DoubleSide, alphaTest: 0.5 })
  const faceGeo = new THREE.PlaneGeometry(ER, ER).translate(ER / 2, ER / 2, 0)
  for (const [rx, ry] of [[0, 0], [0, -Math.PI / 2], [Math.PI / 2, 0]]) {
    const f = new THREE.Mesh(faceGeo, faceMat)
    f.rotation.set(rx, ry, 0)
    earthBody.add(f)
    faces.push(f)
  }
  // the air: a thin blue glow round the rim, brighter on the day side
  const air = new THREE.Mesh(
    new THREE.SphereGeometry(ER * 1.035, 64, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#5aa8ff') }, uSun: { value: stage.sunDir } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform vec3 uSun;
        varying vec3 vN; varying vec3 vV;
        void main() {
          float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
          float day = 0.3 + 0.7 * smoothstep(-0.35, 0.45, dot(vN, uSun));
          gl_FragColor = vec4(uColor * f * day * 1.5, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  air.position.copy(EARTH)
  root.add(air)

  // the light that goes down: from the surface along the cut's upright edge to the centre
  const OFF = 0.13 // just in front of the edge, in the open octant
  const probeMat = new THREE.MeshBasicMaterial({ color: hdr('#8ff6ff', 2.2), toneMapped: false })
  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), probeMat)
  const halo = glowSprite('#8ff6ff', 1.3, 0.9)
  // a ring round it, dark-edged, so it shows even against the glowing core
  const probeRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 40), new THREE.MeshBasicMaterial({ color: hdr('#8ff6ff', 1.6), toneMapped: false, depthTest: false, transparent: true }))
  probeRing.renderOrder = 6
  const probeEdge = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 8, 40), new THREE.MeshBasicMaterial({ color: '#06121c', depthTest: false, transparent: true, opacity: 0.8 }))
  probeEdge.renderOrder = 5
  probe.add(halo, probeEdge, probeRing)
  const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 8).translate(0, -0.5, 0), new THREE.MeshBasicMaterial({ color: hdr('#8ff6ff', 1.4), transparent: true, opacity: 0.8, toneMapped: false }))
  thread.position.set(OFF, ER + 0.05, OFF)
  earth.add(probe, thread)
  const depthTag = label('0 km', 0.32, '#dff9ff', { anchorX: 'left', outlineWidth: 0.06, outlineColor: '#03080e', depthTest: false })
  depthTag.renderOrder = 7
  // an outlined text is drawn by two derived materials: the base material carries "never hidden" to both
  // (makeText's depthTest reaches only one, and the tag's tail went behind the cut)
  depthTag.material = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false })
  root.add(depthTag)
  // toward the deck from the Earth (the open corner looks this way), and to its right
  const facing = new THREE.Vector3(0, 2.0, -2).sub(EARTH).normalize()
  const rightOf = new THREE.Vector3().crossVectors(facing, new THREE.Vector3(0, 1, 0)).normalize().negate()
  // the console at the deck's edge: the layer and the depth
  const readout = standingScreen({ width: 1.8, height: 0.62, color, title: E.layers.surface, line: '0 km', titleSize: 0.16, lineSize: 0.1 }, { top: 1.12, tilt: 0.5, mat: metal })
  readout.group.position.set(3.1, 0, -7.0)
  readout.group.rotation.y = Math.atan2(0.4 - 3.1, -4.0 + 7.0)
  root.add(readout.group)
  solids.push(circle(3.1, -7.1, 0.35))

  // the lens: what the light sees, atom by atom
  const lens = new THREE.Group()
  lens.position.copy(LENS)
  lens.lookAt(0, 1.6, -4)
  root.add(lens)
  const backing = new THREE.Mesh(new THREE.CircleGeometry(LR, 64), new THREE.MeshBasicMaterial({ color: '#0b1a10', transparent: true, opacity: 0.88 }))
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(LR, 0.06, 10, 80), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, roughness: 0.4 }))
  lens.add(backing, lensRim)
  const LAYOUTS = [0, 1, 2, 3, 4, 5].map(l => lensLayout(l))
  const MAXA = Math.max(...LAYOUTS.map(l => l.length))
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05, emissive: '#2a2a2a' }), MAXA)
  atoms.position.z = 0.1
  atoms.frustumCulled = false
  lens.add(atoms)
  const lensTitle = label(E.layers.surface, 0.24, hdr(color, 1.2))
  lensTitle.position.set(0, LR + 0.32, 0.05)
  const lensSub = label('', 0.15, '#d8e4c8')
  lensSub.position.set(0, -LR - 0.25, 0.05)
  lens.add(lensTitle, lensSub)
  // the key: which ball is which element
  ;['Si', 'O', 'Mg', 'Fe', 'Ni'].forEach((el, i) => {
    const y = 0.6 - i * 0.3
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), new THREE.MeshStandardMaterial({ color: COL[el], roughness: 0.4, emissive: '#2a2a2a' }))
    ball.position.set(LR + 0.3, y, 0.05)
    const t = label(el, 0.15, '#e8eeff', { anchorX: 'left' })
    t.position.set(LR + 0.45, y, 0.05)
    lens.add(ball, t)
  })
  // the beam from the light to the lens, as the picture's magnifier has
  const RING = 40
  const beamPos = new Float32Array((RING + 1) * 3)
  const beamGeo = new THREE.BufferGeometry()
  beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPos, 3))
  const beamIdx = []
  for (let i = 0; i < RING; i++) beamIdx.push(0, 1 + i, 1 + ((i + 1) % RING))
  beamGeo.setIndex(beamIdx)
  const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
  beam.frustumCulled = false
  root.add(beam)

  // lens atoms: each eases from where it was to where the new layer puts it
  const cur = Array.from({ length: MAXA }, () => ({ x: 0, y: 0, r: 0, c: new THREE.Color('#000000') }))
  const from = cur.map(a => ({ ...a, c: a.c.clone() }))
  let to = cur.map(a => ({ ...a, c: a.c.clone() }))
  let morph = 1
  let lensLayer = null
  const showLayer = layer => {
    if (layer === lensLayer) return
    lensLayer = layer
    const list = LAYOUTS[Math.max(0, layer)]
    for (let i = 0; i < MAXA; i++) {
      from[i] = { x: cur[i].x, y: cur[i].y, r: cur[i].r, c: cur[i].c.clone() }
      const n = list[i]
      to[i] = n ? { ...n, phase: i * 1.7 } : { x: cur[i].x, y: cur[i].y, r: 0, c: cur[i].c.clone(), phase: 0 }
      if (cur[i].r < 0.001 && n) from[i] = { x: n.x, y: n.y, r: 0, c: n.c.clone() }
    }
    morph = 0
    const name = layer < 0 ? E.layers.names[0] : E.layers.names[layer]
    lensTitle.text = name
    lensTitle.sync()
    lensSub.text = E.layers.minerals[Math.max(0, layer)]
    lensSub.sync()
  }
  const om = new THREE.Object3D()
  updates.push((dt, t) => {
    morph = Math.min(1, morph + dt / 0.8)
    const k = ease(morph)
    const liquid = lensLayer === 4
    for (let i = 0; i < MAXA; i++) {
      const a = from[i]
      const b = to[i]
      const c = cur[i]
      c.x = lerp(a.x, b.x, k)
      c.y = lerp(a.y, b.y, k)
      c.r = lerp(a.r, b.r, k)
      c.c.copy(a.c).lerp(b.c, k)
      let x = c.x
      let y = c.y
      if (liquid) {
        x += Math.sin(t * 1.7 + b.phase) * 0.045
        y += Math.cos(t * 1.3 + b.phase * 1.3) * 0.045
      } else if (lensLayer === 5) {
        x += Math.sin(t * 9 + b.phase) * 0.006
      }
      om.position.set(x, y, 0)
      om.scale.setScalar(Math.max(0.0001, c.r))
      om.updateMatrix()
      atoms.setMatrixAt(i, om.matrix)
      atoms.setColorAt(i, c.c)
    }
    atoms.instanceMatrix.needsUpdate = true
    if (atoms.instanceColor) atoms.instanceColor.needsUpdate = true
  })

  // the depth: the target (shared) and where the light is now
  let target = 0
  let depth = 0
  let mine = false
  let changedAt = 0
  let saidLayer = -1
  let shown = { km: -1, layer: -2, at: 0 }
  const lineFor = d => (layerAt(d) < 0 ? at(E.earth.surface, level()) : at(E.earth.at[layerAt(d)], level()))
  const setTarget = (d, own) => {
    target = clamp(d, 0, R_KM)
    mine = own
    changedAt = 0
  }
  // the slider moves many times a second: the others get it a few times a second, and where it stopped
  let sliding = false
  const slid = () => {
    if (sliding) return
    sliding = true
    later(0.2, () => {
      sliding = false
      share('earth')
    })
  }
  const earthPanel = panelOf(E.earth.title, E.earth.panel, lv => [
    {
      slider: {
        label: E.earth.depth,
        min: 0,
        max: 1,
        step: 0.001,
        value: posOf(target),
        onInput: v => {
          setTarget(depthOf(v), true)
          slid()
        },
        format: v => {
          const d = depthOf(v)
          return `${Math.round(d)} km · ${d < 0.5 ? E.layers.surface : E.layers.names[layerAt(d)]}`
        },
        live: () => posOf(target),
      },
    },
    {
      buttons: [
        { label: E.earth.down, onClick: () => goTo(target >= R_KM - 1 ? 0 : (STOPS.find(s => s > target + 1) ?? R_KM)) },
        { label: E.earth.up, onClick: () => goTo(0) },
      ],
    },
    { rows: E.layers.names.map((n, i) => [n, E.earth.rows[lv === 'scientist' ? 'sci' : 'kid'][i]]) },
  ])
  ex.add({
    id: 'earth',
    x: 0,
    z: -6.4,
    radius: 2.1,
    label: E.earth.label,
    verb: E.earth.tap,
    panel: earthPanel,
    screens: [readout],
    // the whole Earth and the lens in view: the eye backs off behind the visitor
    focus: { x: -1.2, y: 4.0, z: -15.2, size: 13.5 },
  })
  /** Send the light to a depth (km): a tap on the cut, a button, a probe. */
  const goTo = d => {
    setTarget(d, true)
    saidLayer = layerAt(target)
    share('earth')
    play(target < 0.5 ? 'tap' : 'select')
    say(lineFor(target))
    ex.discover('earth', earthPanel, 1.0)
  }
  // worked by hand: a tap on a layer of the cut sends the light there, a tap on the surface brings it up
  clickable(
    earthBody,
    hit => {
      if (!faces.includes(hit.object)) return goTo(0)
      const r = earth.worldToLocal(hit.point.clone()).length()
      // a face is a square: past the quarter disc it is clear, nothing to tap
      if (r <= ER) goTo(clamp((1 - r / ER) * R_KM, 0, R_KM))
    },
    { reach: 17 },
  )
  const tmp = new THREE.Vector3()
  const ringPt = new THREE.Vector3()
  updates.push((dt, t) => {
    // the light glides there: quickly over a long way, gently at the end
    const diff = target - depth
    if (Math.abs(diff) > 0.01) {
      const step = Math.max(Math.abs(diff) * (1 - Math.exp(-2.6 * dt)), Math.min(Math.abs(diff), 350 * dt))
      depth += Math.sign(diff) * step
    }
    const y = ER * (1 - depth / R_KM)
    probe.position.set(OFF, y, OFF)
    halo.material.opacity = 0.75 + Math.sin(t * 4) * 0.15
    thread.scale.y = Math.max(0.001, ER + 0.05 - y)
    probe.getWorldPosition(tmp)
    depthTag.position.copy(tmp).addScaledVector(facing, 0.8).addScaledVector(rightOf, 0.45)
    depthTag.quaternion.copy(ctx.camera.quaternion)
    // the ring faces the eye (it hangs on the turned Earth: undo its turn)
    probeRing.quaternion.copy(earthTurnBack).multiply(ctx.camera.quaternion)
    probeEdge.quaternion.copy(probeRing.quaternion)
    // the words follow at most ten times a second
    shown.at += dt
    const km = Math.round(depth)
    const ly = layerAt(depth)
    if (shown.at > 0.1 && (km !== shown.km || ly !== shown.layer)) {
      shown = { km, layer: ly, at: 0 }
      depthTag.text = `${km} km`
      depthTag.sync()
      readout.set({ title: ly < 0 ? E.layers.surface : E.layers.names[ly], line: ly < 0 ? `${km} km` : `${km} km · ${E.layers.minerals[ly]}` })
    }
    showLayer(ly)
    // the beam: from the light to the lens's rim
    beamPos[0] = tmp.x
    beamPos[1] = tmp.y
    beamPos[2] = tmp.z
    lens.updateMatrixWorld()
    for (let i = 0; i < RING; i++) {
      const a = (i / RING) * TAU
      ringPt.set(Math.cos(a) * LR, Math.sin(a) * LR, 0).applyMatrix4(lens.matrixWorld)
      beamPos.set([ringPt.x, ringPt.y, ringPt.z], 3 + i * 3)
    }
    beamGeo.attributes.position.needsUpdate = true
    // my own sliding: once it rests in a new layer, the Atomling says what is there
    changedAt += dt
    const tl = layerAt(target)
    if (mine && changedAt > 0.6 && tl !== saidLayer) {
      saidLayer = tl
      say(lineFor(target))
    }
  })

  // ================= the Moon and its rocks =================
  const moonTex = moonTexture(light ? 1024 : 2048)
  textures.push(moonTex)
  const moon = new THREE.Mesh(new THREE.SphereGeometry(MR, 64, 32), new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.95 }))
  moon.position.copy(MOON)
  // its near side faces the Earth, as the real Moon's always does
  const toEarth = EARTH.clone().sub(MOON)
  moon.rotation.y = Math.atan2(-toEarth.z, toEarth.x)
  root.add(moon)
  const siteMat = new THREE.MeshBasicMaterial({ color: hdr('#ffe9a8', 2.4), toneMapped: false })
  for (const [lat, lon] of Object.values(APOLLO)) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), siteMat)
    s.position.copy(onSphere(lat, lon, MR * 1.004))
    moon.add(s)
  }
  moon.updateMatrixWorld()
  const siteWorld = n => moon.localToWorld(onSphere(APOLLO[n][0], APOLLO[n][1], MR))

  // the case on the deck
  const CASE = { x: 6.5, z: -5.5 }
  const caseRot = Math.atan2(4.8 - CASE.x, -3.6 - CASE.z)
  const cabinet = new THREE.Group()
  cabinet.position.set(CASE.x, 0, CASE.z)
  cabinet.rotation.y = caseRot
  root.add(cabinet)
  const pedestal = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.95, 0.85, 3, 0.05), metal)
  pedestal.position.y = 0.475
  cabinet.add(pedestal)
  const caseGlow = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3, roughness: 0.4 })
  const strip = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.04, 0.04), caseGlow)
  strip.position.set(0, 0.93, 0.43)
  cabinet.add(strip)
  const glass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.62, 0.76), new THREE.MeshStandardMaterial({ color: '#bfe6ff', transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false }))
  glass.position.y = 0.95 + 0.31
  const edgeMat = new THREE.LineBasicMaterial({ color: hdr('#bfe6ff', 1.2), transparent: true, opacity: 0.6 })
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), edgeMat)
  edges.position.copy(glass.position)
  cabinet.add(glass, edges)
  const SLOT_X = [-0.72, 0, 0.72]
  const cradleMat = new THREE.MeshStandardMaterial({ color: '#202842', roughness: 0.6 })
  for (const [i, x] of SLOT_X.entries()) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 28), cradleMat)
    c.position.set(x, 0.975, 0)
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.012, 6, 40), caseGlow)
    r.rotation.x = Math.PI / 2
    r.position.set(x, 1.0, 0)
    const t = label(E.moon.rocks[i], 0.085, '#dfe6ff')
    t.position.set(x, 0.74, 0.43)
    cabinet.add(c, r, t)
  }
  // its name on its front, low, so nothing stands between the Moon and the case
  const caseTitle = label(E.moon.label, 0.13, hdr(color, 1.1))
  caseTitle.position.set(0, 0.47, 0.43)
  const caseLine = label(E.moon.sign, 0.075, '#c9d3f0')
  caseLine.position.set(0, 0.31, 0.43)
  cabinet.add(caseTitle, caseLine)
  // found: the case's glow turns gold, as a screen's frame does
  const caseBase = new THREE.Color(color)
  const gold = new THREE.Color('#ffd166')
  const sign = {
    setRead(r) {
      caseGlow.color.copy(r ? gold : caseBase)
      caseGlow.emissive.copy(r ? gold : caseBase)
    },
  }
  solids.push(box(CASE.x, CASE.z, 2.4, 0.95, { rot: caseRot }))
  // "the same oxygen": a band of light over the three rocks once they are compared
  const matchMat = new THREE.MeshBasicMaterial({ color: hdr('#9ff0c0', 1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  const match = new THREE.Group()
  const matchLegs = SLOT_X.map(x => {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.36, 0.025), matchMat)
    v.position.set(x, 1.37, 0)
    match.add(v)
    return v
  })
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.03, 0.03), matchMat)
  bar.position.set(0, 1.56, 0)
  const matchText = label(E.moon.match, 0.12, '#bfffd8')
  matchText.position.set(0, 1.68, 0)
  match.add(bar, matchText)
  cabinet.add(match)

  // the rocks: dark basalt, pale anorthosite, green mantle rock from the Earth
  const rockMats = [
    new THREE.MeshStandardMaterial({ color: '#232428', roughness: 1, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: '#ebe7dc', roughness: 0.9, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: '#6f8f3a', roughness: 0.85, flatShading: true }),
  ]
  const rocks = rockMats.map((m, i) => {
    const r = new THREE.Mesh(rockGeometry(11 + i * 7), m)
    r.scale.setScalar(0.15)
    r.visible = false
    root.add(r)
    return r
  })
  const slotWorld = i => cabinet.localToWorld(new THREE.Vector3(SLOT_X[i], 1.11, 0))
  cabinet.updateMatrixWorld()
  earth.updateMatrixWorld()
  // where each comes from: Apollo 11's sea, Apollo 16's highlands, the Earth's upper mantle (on the cut)
  const origin = i => (i === 0 ? siteWorld(11) : i === 1 ? siteWorld(16) : earth.localToWorld(new THREE.Vector3(ER * 0.68, ER * 0.68, 0.05)))
  const trailMat = new THREE.MeshBasicMaterial({ color: hdr('#fff1d0', 1.5), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  const TRAIL = 14
  const trail = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), trailMat, TRAIL * 3)
  trail.frustumCulled = false
  trail.count = 0
  root.add(trail)
  // in the case: [basalt, anorthosite, the Earth's rock]; each flies from where it was picked
  const have = [false, false, false]
  const picked = [null, null, null]
  let flight = null // { dir: 'in', i, from, t } | { dir: 'out', which: [i...], t }
  const FLY = 2.4
  const curve = (a, b, k, lift) => {
    const mid = a.clone().add(b).multiplyScalar(0.5)
    mid.y += lift
    const u = 1 - k
    return a.clone().multiplyScalar(u * u).add(mid.multiplyScalar(2 * u * k)).add(b.clone().multiplyScalar(k * k))
  }
  const place = () => {
    rocks.forEach((r, i) => {
      r.visible = have[i]
      r.scale.setScalar(0.15)
      if (r.visible) r.position.copy(slotWorld(i))
      r.rotation.set(0.3, i * 1.3, 0)
    })
  }
  const startIn = (i, from) => {
    picked[i] = from ?? origin(i)
    flight = { dir: 'in', i, from: picked[i], t: 0 }
    play('beam')
  }
  const startOut = () => {
    flight = { dir: 'out', which: [0, 1, 2].filter(i => have[i]), t: 0 }
    play('tap')
  }
  // what the case holds once the rock in flight lands (what a share sends)
  const moonState = () => {
    const s = have.slice()
    if (flight?.dir === 'in') s[flight.i] = true
    if (flight?.dir === 'out') s.fill(false)
    return s
  }
  const moonPanel = panelOf(E.moon.title, E.moon.panel, [
    {
      buttons: [
        { label: E.moon.dark, onClick: () => moonStep('sea') },
        { label: E.moon.pale, onClick: () => moonStep('high') },
        { label: E.moon.compare, onClick: () => moonStep('case') },
        { label: E.moon.back, onClick: () => moonStep('back') },
      ],
    },
  ])
  const saysFor = [E.moon.says.basalt, E.moon.says.anorthosite, E.moon.says.earth]
  /** A step with the Moon's rocks: 'sea' or 'high' brings that rock (from `from`, where the Moon was
   *  tapped), 'case' compares with the Earth's rock or, all compared, puts them back, 'back' puts them back. */
  const moonStep = (kind, from) => {
    if (flight) {
      say(at(W.busy, level()))
      return false
    }
    const s = moonState()
    let i = kind === 'sea' ? 0 : kind === 'high' ? 1 : null
    if (kind === 'case') i = !s[2] && (s[0] || s[1]) ? 2 : s.some(Boolean) ? -1 : null
    if (kind === 'back') i = s.some(Boolean) ? -1 : null
    if (i === null) {
      say(at(E.moon.hint, level()))
      return false
    }
    if (i === -1) {
      startOut()
      say(at(E.moon.says.back, level()))
    } else if (s[i]) {
      // already in the case: what it is, again
      say(at(saysFor[i], level()))
      return true
    } else {
      startIn(i, from)
      say(at(saysFor[i], level()))
    }
    share('moon')
    ex.discover('moon', moonPanel, 2.8)
    return true
  }
  const moonVerb = () => {
    const s = moonState()
    if (!s[0] && !s[1]) return E.moon.tapMoon
    if (!s[0]) return E.moon.tapSea
    if (!s[1]) return E.moon.tapHigh
    return s[2] ? E.moon.tapBack : E.moon.tapCompare
  }
  ex.add({
    id: 'moon',
    x: 4.8,
    z: -3.6,
    radius: 1.8,
    label: E.moon.label,
    verb: moonVerb,
    panel: moonPanel,
    screens: [sign],
    focus: { x: 8.9, y: 3.0, z: -9.8, size: 3 },
  })
  // worked by hand: a dark sea of the Moon gives basalt, the bright highlands anorthosite; the case
  // compares, then puts them back
  const inSea = uv => {
    const lon = uv.x * 360 - 180
    const lat = uv.y * 180 - 90
    return MARIA.some(([l, b, rx, ry]) => ((lon - l) / rx) ** 2 + ((lat - b) / ry) ** 2 <= 1)
  }
  clickable(moon, hit => moonStep(hit.uv && inSea(hit.uv) ? 'sea' : 'high', hit.point.clone()), { reach: 17 })
  clickable(cabinet, () => moonStep('case'), { reach: 6 })
  const ot = new THREE.Object3D()
  updates.push((dt, t) => {
    let n = 0
    const trailAt = (pos, k) => {
      for (let j = 0; j < TRAIL && n < TRAIL * 3; j++) {
        const kk = k - j * 0.012
        if (kk <= 0) break
        ot.position.copy(pos(kk))
        ot.scale.setScalar(0.07 * (1 - j / TRAIL))
        ot.updateMatrix()
        trail.setMatrixAt(n++, ot.matrix)
      }
    }
    if (flight) {
      flight.t += dt
      const k = ease(Math.min(1, flight.t / FLY))
      const along = Math.min(1, flight.t / FLY)
      if (flight.dir === 'in') {
        const i = flight.i
        const a = flight.from
        const b = slotWorld(i)
        const lift = i === 2 ? 2.5 : 3.5
        rocks[i].visible = true
        rocks[i].position.copy(curve(a, b, k, lift))
        rocks[i].rotation.set(t * 2, t * 1.4, 0)
        rocks[i].scale.setScalar(0.15 * (0.4 + 0.6 * Math.min(1, flight.t * 2)))
        trailAt(kk => curve(a, b, ease(kk), lift), along)
        if (flight.t >= FLY) {
          have[i] = true
          flight = null
          place()
          play(have[2] ? 'discover' : 'tap')
        }
      } else {
        for (const i of flight.which) {
          const a = slotWorld(i)
          const b = picked[i] ?? origin(i)
          const lift = i === 2 ? 2.5 : 3.5
          rocks[i].visible = true
          rocks[i].position.copy(curve(a, b, k, lift))
          rocks[i].scale.setScalar(0.15 * (1 - 0.7 * k))
          trailAt(kk => curve(a, b, ease(kk), lift), along)
        }
        if (flight.t >= FLY) {
          have.fill(false)
          flight = null
          place()
        }
      }
    }
    trail.count = n
    trail.instanceMatrix.needsUpdate = true
    // the rocks in the case turn slowly, so they can be seen all round
    rocks.forEach((r, i) => {
      if (!flight && r.visible) r.rotation.y = t * 0.4 + i * 1.3
    })
    // the band of light over the rocks compared with the Earth's
    const want = !flight && have[2] ? 1 : 0
    matchMat.opacity += (want * (0.75 + Math.sin(t * 3) * 0.15) - matchMat.opacity) * Math.min(1, dt * 4)
    match.visible = matchMat.opacity > 0.01
    matchLegs.forEach((leg, i) => (leg.visible = have[i]))
    matchText.fillOpacity = matchMat.opacity / 0.9
  })
  place()

  // ================= the star where silicon was made =================
  const starGroup = new THREE.Group()
  starGroup.position.copy(STAR)
  root.add(starGroup)
  const starTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#ff9a50'
    g.fillRect(0, 0, w, h)
    const rnd = random(7)
    for (let i = 0; i < 900; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(255,${200 + rnd() * 55},${120 + rnd() * 80},0.35)` : `rgba(${180 + rnd() * 60},70,30,0.3)`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 2 + rnd() * 6, 0, TAU)
      g.fill()
    }
  })
  textures.push(starTex)
  const envelopeMat = new THREE.MeshBasicMaterial({ map: starTex, color: hdr('#ffffff', 1.5), transparent: true, opacity: 1, toneMapped: true })
  const envelope = new THREE.Mesh(new THREE.SphereGeometry(RS, 48, 24), envelopeMat)
  envelope.renderOrder = 3
  starGroup.add(envelope)
  const corona = glowSprite('#ff8a40', RS * 5.5, 0.85)
  corona.renderOrder = 4
  starGroup.add(corona)
  // the onion: the star's layers seen in cross-section, always facing the visitor
  const onion = new THREE.Group()
  starGroup.add(onion)
  const onionMats = []
  ONION.forEach(([sym, r, c], i) => {
    const m = new THREE.MeshBasicMaterial({ color: hdr(c, 1.15), transparent: true, opacity: 0, depthWrite: false })
    onionMats.push(m)
    const d = new THREE.Mesh(new THREE.CircleGeometry(r * RS, 64), m)
    d.position.z = i * 0.004
    d.renderOrder = 1
    onion.add(d)
    const inner = ONION[i + 1]?.[1] ?? 0
    const t = label(sym, 0.25 * K, '#1a0c20', { outlineWidth: 0.014, outlineColor: '#fff4e0' })
    t.position.set(0, ((r + inner) / 2) * RS, 0.03)
    t.renderOrder = 2
    onion.add(t)
    onionMats.push(t)
  })
  // the fusions: two oxygens meet and become a silicon (and a helium flies off)
  const fuseMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial({ toneMapped: false }), FUSIONS * 4)
  fuseMesh.frustumCulled = false
  fuseMesh.position.z = 0.05
  fuseMesh.renderOrder = 2
  onion.add(fuseMesh)
  const rOmid = ((ONION[3][1] + ONION[4][1]) / 2) * RS
  const rSimid = ((ONION[4][1] + ONION[5][1]) / 2) * RS
  const FUSE = Array.from({ length: FUSIONS }, (_, e) => ({ t0: T_OPEN + 0.15 + e * 0.25, a: Math.PI / 2 + 0.8 + (e * (TAU - 1.6)) / (FUSIONS - 1) }))
  const cO = new THREE.Color(hdr(COL.O, 1.2))
  const cSi = new THREE.Color(hdr(COL.Si, 1.3))
  const cHe = new THREE.Color(hdr('#ffffff', 1.6))

  // the explosion: a flash, a ring of hot gas, silicon flying out
  const flashMat = new THREE.MeshBasicMaterial({ color: hdr('#fff6e0', 3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), flashMat)
  starGroup.add(flash)
  const shockMat = new THREE.MeshBasicMaterial({ color: hdr('#ff9aa8', 1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  const shock = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 8, 120), shockMat)
  starGroup.add(shock)
  const nova = new THREE.PointLight('#ffd8b0', 0, 70, 1.4)
  starGroup.add(nova)
  const NE = light ? 70 : 150
  const rnd = random(28)
  const SILICON = Array.from({ length: NE }, () => {
    const z = rnd() * 2 - 1
    const f = rnd() * TAU
    const s = Math.sqrt(1 - z * z)
    const dir = new THREE.Vector3(s * Math.cos(f), z * 0.8, s * Math.sin(f)).normalize()
    const cr = Math.cbrt(rnd())
    const cz = rnd() * 2 - 1
    const cf = rnd() * TAU
    const cs = Math.sqrt(1 - cz * cz)
    const rho = (0.75 + 2.5 * Math.sqrt(rnd())) * K
    return {
      dir,
      v: (2.0 + rnd() * 1.4) * K,
      cloud: new THREE.Vector3(cs * Math.cos(cf) * 2.6 * cr, cz * 1.5 * cr, cs * Math.sin(cf) * 2.6 * cr).multiplyScalar(K),
      rho,
      phi: rnd() * TAU,
      w: 1.25 / Math.pow(rho / K, 1.5),
      dy: (rnd() - 0.5) * 0.14 * K,
    }
  })
  const siMat = new THREE.MeshStandardMaterial({ color: COL.Si, emissive: COL.Si, emissiveIntensity: 0.55, roughness: 0.4 })
  const siMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), siMat, NE)
  siMesh.frustumCulled = false
  starGroup.add(siMesh)
  const streakMat = new THREE.MeshBasicMaterial({ color: hdr(COL.Si, 1.3), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  const streaks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.002, 1, 6).translate(0, -0.5, 0), streakMat, NE)
  streaks.frustumCulled = false
  starGroup.add(streaks)
  const remnant = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: hdr('#cfe6ff', 3), toneMapped: false }))
  starGroup.add(remnant)
  // the cloud of gas and dust, and the disc it falls into
  const gas = ['#6a4a9a', '#9a5a70', '#4a5a9a', '#8a6a5a', '#5a4a8a', '#9a6a8a', '#6a5a7a'].map((c, i) => {
    const s = glowSprite(c, (4.5 + (i % 3)) * K, 0)
    const a = (i / 7) * TAU
    s.userData.at = new THREE.Vector3(Math.cos(a) * 1.4, ((i % 3) - 1) * 0.6, Math.sin(a) * 1.4).multiplyScalar(K)
    starGroup.add(s)
    return s
  })
  const disc = new THREE.Group()
  {
    // tilted toward the deck, so it is seen as an open ellipse
    const view = new THREE.Vector3(-4.8, 1.4, -3.6).sub(STAR).normalize()
    const up = new THREE.Vector3(0, 1, 0).addScaledVector(view, -view.y).normalize()
    const n = view.clone().multiplyScalar(Math.cos(1.1)).addScaledVector(up, Math.sin(1.1)).normalize()
    disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
  }
  starGroup.add(disc)
  const dustTex = canvasTex(256, 256, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, w * 0.08, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,220,160,0.9)')
    grd.addColorStop(0.3, 'rgba(200,140,90,0.55)')
    grd.addColorStop(0.7, 'rgba(140,90,110,0.25)')
    grd.addColorStop(1, 'rgba(80,60,100,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  textures.push(dustTex)
  const dustMat = new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const dust = new THREE.Mesh(new THREE.CircleGeometry(3.6 * K, 64), dustMat)
  dust.rotation.x = -Math.PI / 2
  disc.add(dust)
  const sunMat = new THREE.MeshBasicMaterial({ color: hdr('#fff0b8', 2.6), toneMapped: false })
  const youngSun = new THREE.Mesh(new THREE.SphereGeometry(0.5 * K, 28, 16), sunMat)
  const sunGlow = glowSprite('#ffd27a', 3.2, 0)
  youngSun.add(sunGlow)
  disc.add(youngSun)
  const PLANETS = [
    { rho: 1.15, size: 0.16, c: '#a39b8f' },
    { rho: 1.6, size: 0.24, c: '#d9b778' },
    { rho: 2.15, size: 0.26, c: '#3f86d6' },
    { rho: 2.9, size: 0.19, c: '#c1643a' },
  ].map(p => ({ ...p, rho: p.rho * K, size: p.size * K })).map((p, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshStandardMaterial({ color: p.c, roughness: 0.8, emissive: p.c, emissiveIntensity: 0.25 }))
    disc.add(m)
    return { ...p, mesh: m, phi: i * 2.1 + 0.4, w: 1.25 / Math.pow(p.rho / K, 1.5) }
  })
  for (const s of SILICON) s.into = PLANETS.find(p => Math.abs(p.rho - s.rho) < 0.2 * K) ?? null

  let plays = 0
  let playing = false
  let T = 0
  let starMine = false
  const cues = [
    [T_BANG + 0.15, 'boom'],
    [T_GATHER, 'cloud'],
    [T_DISC + 0.7, 'disc'],
  ]
  const startStar = (t0, own) => {
    playing = true
    T = t0
    starMine = own
  }
  const starSign = standingScreen({ width: 1.6, height: 0.55, color, title: E.star.label, line: E.star.sign, titleSize: 0.15, lineSize: 0.09 }, { top: 1.1, tilt: 0.5, mat: metal })
  // beside the station, out of the way to the star, turned to the deck's middle
  starSign.group.position.set(-7.3, 0, -1.9)
  starSign.group.rotation.y = Math.atan2(7.3, 1.9 + 1.0)
  root.add(starSign.group)
  solids.push(circle(-7.3, -2.0, 0.35))
  /** Make silicon: the star's story from the start (a tap on the star, its panel's button, a probe). */
  const makeSilicon = () => {
    if (playing && T < T_FORMED) {
      say(at(W.busy, level()))
      return false
    }
    plays++
    startStar(0, true)
    play('beam')
    share('star')
    say(at(E.star.says.start, level()))
    ex.discover('star', starPanel, T_FORMED + 0.5)
    return true
  }
  const starPanel = panelOf(E.star.title, E.star.panel, [{ buttons: [{ label: E.star.make, onClick: makeSilicon }] }])
  ex.add({
    id: 'star',
    x: -4.8,
    z: -3.6,
    radius: 1.8,
    label: E.star.label,
    verb: E.star.tap,
    panel: starPanel,
    screens: [starSign],
    focus: { x: -13.4, y: 4.4, z: -10.4, size: 11 },
  })
  // worked by hand: tap the star (or, once the story is told, the place where it was)
  const starHit = new THREE.Mesh(new THREE.SphereGeometry(RS * 1.15, 16, 10), new THREE.MeshBasicMaterial({ visible: false }))
  starGroup.add(starHit)
  clickable(starHit, makeSilicon, { when: () => !(playing && T < T_FORMED), reach: 20 })

  const os = new THREE.Object3D()
  const p = new THREE.Vector3()
  const q = new THREE.Vector3()
  // a body on its orbit in the disc: in the disc's own coordinates, and in the star's
  const orbit = (s, tt) => {
    const a = s.phi + s.w * tt
    return new THREE.Vector3(Math.cos(a) * s.rho, s.dy ?? 0, Math.sin(a) * s.rho)
  }
  const discLocal = (s, tt) => orbit(s, tt).applyQuaternion(disc.quaternion)
  const poseStar = (dt, t) => {
    const camQ = ctx.camera.quaternion
    onion.quaternion.copy(camQ)
    shock.quaternion.copy(camQ)
    const idle = !playing
    const k = x => clamp(x)
    // the star itself
    let envOpacity = 1
    let envScale = 1
    let coronaK = 1
    if (!idle) {
      if (T < T_FUSE) envOpacity = 1 - 0.78 * ease(k(T / T_OPEN))
      else if (T < T_BANG) {
        envOpacity = 0.22 + 0.4 * ease(k((T - T_FUSE) / 0.5))
        envScale = 1 - 0.45 * ease(k((T - T_FUSE) / 0.5))
      } else if (T < T_FADE + 0.5) envOpacity = 0
      else {
        const b = ease(k((T - T_FADE - 0.5) / 1.0))
        envOpacity = b
        envScale = b
      }
      coronaK = T < T_BANG ? 1 - 0.4 * ease(k(T / T_OPEN)) : T < T_FADE + 0.5 ? 0 : ease(k((T - T_FADE - 0.5) / 1.0))
    }
    envelopeMat.opacity = envOpacity
    envelope.visible = envOpacity > 0.01
    envelope.scale.setScalar(Math.max(0.001, envScale * (1 + Math.sin(t * 1.3) * 0.012)))
    envelope.rotation.y = t * 0.05
    corona.material.opacity = 0.85 * coronaK
    corona.scale.setScalar(RS * 5.5 * envScale * (1 + Math.sin(t * 2.1) * 0.03))
    // the onion
    const onionK = idle ? 0 : T < T_BANG ? ease(k((T - 0.2) / T_OPEN)) * (T > T_FUSE ? 1 - ease(k((T - T_FUSE - 0.25) / 0.25)) : 1) : 0
    onion.visible = onionK > 0.01
    onion.scale.setScalar(T > T_FUSE && T < T_BANG ? 1 - 0.5 * ease(k((T - T_FUSE) / 0.5)) : 1)
    onionMats.forEach((m, i) => {
      if (m.isMaterial) m.opacity = onionK * 0.95
      else m.fillOpacity = onionK
    })
    // the fusions
    let n = 0
    if (onion.visible) {
      for (const f of FUSE) {
        const u = T - f.t0
        if (u < 0) continue
        if (u < 0.45) {
          const kk = ease(u / 0.45)
          for (const s of [-1, 1]) {
            const a = f.a + s * 0.45 * (1 - kk)
            os.position.set(Math.cos(a) * rOmid, Math.sin(a) * rOmid, 0)
            os.scale.setScalar(0.085 * K)
            os.updateMatrix()
            fuseMesh.setMatrixAt(n, os.matrix)
            fuseMesh.setColorAt(n++, cO)
          }
        } else {
          const kk = ease(clamp((u - 0.45) / 0.55))
          const r = lerp(rOmid, rSimid, kk)
          os.position.set(Math.cos(f.a) * r, Math.sin(f.a) * r, 0.01)
          os.scale.setScalar(0.1 * K * Math.min(1, (u - 0.45) * 6))
          os.updateMatrix()
          fuseMesh.setMatrixAt(n, os.matrix)
          fuseMesh.setColorAt(n++, cSi)
          if (u < 1.1) {
            const hr = rOmid + (u - 0.45) * 1.6 * K
            os.position.set(Math.cos(f.a) * hr, Math.sin(f.a) * hr, 0.02)
            os.scale.setScalar(0.05 * K * (1 - (u - 0.45) / 0.65))
            os.updateMatrix()
            fuseMesh.setMatrixAt(n, os.matrix)
            fuseMesh.setColorAt(n++, cHe)
          }
        }
      }
    }
    fuseMesh.count = n
    fuseMesh.instanceMatrix.needsUpdate = true
    if (fuseMesh.instanceColor) fuseMesh.instanceColor.needsUpdate = true
    // the flash and the ring
    const ub = T - T_BANG
    const bang = !idle && ub >= 0
    flashMat.opacity = bang && ub < 0.9 ? 1 - ub / 0.9 : 0
    flash.visible = flashMat.opacity > 0.01
    flash.scale.setScalar((0.6 + Math.max(0, ub) * 7) * K)
    shockMat.opacity = bang && ub < 3.8 ? 0.9 * (1 - ub / 3.8) : 0
    shock.visible = shockMat.opacity > 0.01
    shock.scale.setScalar((1 + Math.max(0, ub) * 2.2) * K)
    nova.intensity = bang && ub < 1.6 ? 90 * Math.pow(1 - ub / 1.6, 2) : 0
    remnant.visible = bang && ub < 5
    // the silicon
    const fadeK = !idle && T > T_FADE ? 1 - ease(k((T - T_FADE) / 1.0)) : 1
    let sn = 0
    let tn = 0
    if (bang && T < T_END) {
      const ue = Math.max(0, ub)
      for (const s of SILICON) {
        const dist = s.v * 1.6 * (1 - Math.exp(-ue / 1.6))
        p.copy(s.dir).multiplyScalar(dist)
        let size = 0.12 * K
        if (T > T_GATHER) {
          const g = ease(k((T - T_GATHER) / (T_DISC - T_GATHER)))
          p.lerp(s.cloud, g)
          size = (0.12 - 0.02 * g) * K
        }
        if (T > T_DISC) {
          const d = ease(k((T - T_DISC) / 2.0))
          q.copy(discLocal(s, T - T_DISC))
          p.lerp(q, d)
          if (s.into) size *= 1 - ease(k((T - T_DISC - 1.8) / 1.6))
        }
        size *= fadeK * Math.min(1, ue * 5)
        if (size < 0.004) continue
        os.position.copy(p)
        os.scale.setScalar(size)
        os.updateMatrix()
        siMesh.setMatrixAt(sn++, os.matrix)
        // a streak behind each while it flies fast
        const speed = s.v * Math.exp(-ue / 1.6)
        if (T < T_GATHER && speed > 0.25) {
          os.position.copy(p)
          os.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), s.dir)
          os.scale.set(1, speed * 0.55, 1)
          os.updateMatrix()
          streaks.setMatrixAt(tn++, os.matrix)
          os.quaternion.identity()
        }
      }
    }
    siMesh.count = sn
    siMesh.instanceMatrix.needsUpdate = true
    streaks.count = tn
    streaks.instanceMatrix.needsUpdate = true
    // the gas: gathering, then falling into the disc
    const gasK = idle ? 0 : clamp((T - T_GATHER + 0.8) / 1.6) * (T > T_DISC ? 1 - 0.7 * ease(k((T - T_DISC) / 2.5)) : 1) * fadeK
    gas.forEach((s, i) => {
      s.material.opacity = 0.5 * gasK
      s.visible = gasK > 0.01
      const shrink = T > T_DISC ? 1 - 0.55 * ease(k((T - T_DISC) / 2.5)) : 1
      s.position.copy(s.userData.at).multiplyScalar(shrink)
      s.material.rotation = t * 0.05 * (i % 2 ? 1 : -1)
    })
    // the disc, the young Sun, the planets
    const discK = idle ? 0 : ease(k((T - T_DISC) / 1.8)) * fadeK
    dustMat.opacity = 0.85 * discK
    dust.visible = discK > 0.01
    dust.rotation.z = -t * 0.15
    const sunK = idle ? 0 : ease(k((T - T_DISC - 0.4) / 1.6)) * fadeK
    youngSun.visible = sunK > 0.01
    youngSun.scale.setScalar(Math.max(0.001, sunK))
    sunGlow.material.opacity = 0.9 * sunK
    for (const pl of PLANETS) {
      const g = idle ? 0 : ease(k((T - T_DISC - 1.6) / 2.0)) * fadeK
      pl.mesh.visible = g > 0.01
      pl.mesh.scale.setScalar(Math.max(0.001, pl.size * g))
      pl.mesh.position.copy(orbit(pl, Math.max(0, T - T_DISC)))
    }
  }
  updates.push((dt, t) => {
    if (playing) {
      const before = T
      T += dt
      if (before < T_BANG && T >= T_BANG) play('bang')
      if (starMine) for (const [c, key] of cues) if (before < c && T >= c) say(at(E.star.says[key], level()))
      if (T >= T_END) {
        playing = false
        T = 0
      }
    }
    poseStar(dt, t)
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 7.9 },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: 2.4, z: 3.6, yaw: Math.atan2(2.4, -1.0) },
    back: { x: 0, z: 8.4, rot: Math.PI },
    stand: { x: -2.6, z: 2.6, rot: Math.atan2(2.6, 2.0) },
    parts: {
      earth: {
        get target() {
          return target
        },
        get depth() {
          return depth
        },
        get layer() {
          return layerAt(depth)
        },
      },
      moon: {
        get rocks() {
          return have.slice()
        },
        get busy() {
          return !!flight
        },
      },
      star: {
        get playing() {
          return playing
        },
        get t() {
          return T
        },
      },
      // what each tap does, for the probes (shot.py cannot move the mouse)
      tap: {
        earth: d => goTo(Number(d) || 0),
        moon: region => moonStep(region === 'sea' ? 'sea' : 'high'),
        case: () => moonStep('case'),
        star: () => makeSilicon(),
      },
    },
    panels: { earth: earthPanel, moon: moonPanel, star: starPanel },
    shared: {
      earth: {
        get: () => ({ depth: Math.round(target) }),
        set: (s, live) => {
          setTarget(Number(s?.depth) || 0, false)
          saidLayer = layerAt(target)
          if (!live) depth = target
        },
      },
      moon: {
        get: () => ({ rocks: moonState() }),
        set: (s, live) => {
          const want = [0, 1, 2].map(i => !!(Array.isArray(s?.rocks) && s.rocks[i]))
          const cur = moonState()
          const added = [0, 1, 2].filter(i => want[i] && !cur[i])
          const kept = [0, 1, 2].every(i => !cur[i] || want[i])
          if (live && !flight && added.length === 1 && kept) startIn(added[0])
          else if (live && !flight && !want.some(Boolean) && cur.some(Boolean)) startOut()
          else {
            flight = null
            want.forEach((v, i) => (have[i] = v))
            place()
          }
        },
      },
      star: {
        get: () => ({ n: plays, t: playing ? Math.round(T * 10) / 10 : -1 }),
        set: (s, live, ago = 0) => {
          plays = Math.max(0, Math.round(Number(s?.n) || 0))
          const t0 = Number(s?.t)
          if (Number.isFinite(t0) && t0 >= 0 && t0 + ago < T_END) startStar(t0 + ago, false)
          else {
            playing = false
            T = 0
          }
        },
      },
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
