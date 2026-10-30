// A doorway board (docs/knowledge/hall-boards.md, "Doorways"): one of a hall's boards that leads into the
// element's places reached through a picture instead of an arch. The user (2026-10-30): the Periodic Videos
// lab is entered through a board in the hall, like stepping into a picture, and other such themes will join
// it there; the arches stay for the wings. One door fills the board; more share it as tiles.
import * as THREE from 'three'
import { pictureBoard } from '../common/props.js'

const FONT = 'Outfit, Nunito, sans-serif'

/** What each kind of door shows, drawn in a box (x, y, w, h) of the board's canvas. */
const ART = {
  // the element's Periodic Videos film: its tile, the series' name, a play button
  videos(g, x, y, w, h, el, door) {
    const s = Math.min(w / 1000, h / 560)
    const ox = x + (w - 1000 * s) / 2
    const oy = y + (h - 560 * s) / 2
    const X = v => ox + v * s
    const Y = v => oy + v * s
    g.fillStyle = '#f7f3e8'
    g.fillRect(X(40), Y(70), 300 * s, 340 * s)
    g.fillStyle = '#1d2a5c'
    g.textAlign = 'left'
    g.font = `700 ${54 * s}px ${FONT}`
    g.fillText(String(el.z), X(66), Y(135))
    g.textAlign = 'center'
    g.font = `700 ${170 * s}px ${FONT}`
    g.fillText(el.symbol, X(190), Y(320))
    g.textAlign = 'left'
    g.fillStyle = '#ffffff'
    g.font = `700 ${78 * s}px ${FONT}`
    g.fillText('Periodic', X(400), Y(180))
    g.fillText('Videos', X(400), Y(265))
    g.fillStyle = door.color
    g.beginPath()
    g.arc(X(480), Y(370), 58 * s, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#0b1030'
    g.beginPath()
    g.moveTo(X(460), Y(336))
    g.lineTo(X(460), Y(404))
    g.lineTo(X(518), Y(370))
    g.closePath()
    g.fill()
    // a strip of film along the bottom: this is a door into a film
    g.fillStyle = '#2a2f4a'
    g.fillRect(X(40), Y(470), 920 * s, 64 * s)
    g.fillStyle = '#0b1030'
    for (let i = 0; i < 18; i++) g.fillRect(X(56 + i * 51), Y(482), 26 * s, 14 * s)
    for (let i = 0; i < 18; i++) g.fillRect(X(56 + i * 51), Y(508), 26 * s, 14 * s)
  },
}

function draw(g, W, H, el, doors) {
  const grd = g.createRadialGradient(W / 2, H * 0.42, 40, W / 2, H * 0.42, W * 0.75)
  grd.addColorStop(0, '#22307a')
  grd.addColorStop(1, '#060a20')
  g.fillStyle = grd
  g.fillRect(0, 0, W, H)
  // a few stars: the board opens somewhere else
  for (let i = 0; i < 90; i++) {
    const a = Math.sin(i * 12.9898) * 43758.5453
    const b = Math.sin(i * 78.233) * 12345.678
    g.fillStyle = `rgba(255,255,255,${0.25 + (a - Math.floor(a)) * 0.5})`
    g.fillRect((a - Math.floor(a)) * W, (b - Math.floor(b)) * H * 0.78, 2, 2)
  }
  // the doors in a grid over the top 78% (the caption band covers the rest)
  const cols = Math.ceil(Math.sqrt(doors.length))
  const rows = Math.ceil(doors.length / cols)
  const cw = W / cols
  const ch = (H * 0.78) / rows
  doors.forEach((d, i) => {
    const x = (i % cols) * cw
    const y = Math.floor(i / cols) * ch
    const pad = doors.length > 1 ? 30 : 60
    if (ART[d.id]) ART[d.id](g, x + pad, y + pad, cw - 2 * pad, ch - 2 * pad, el, d)
    else {
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      g.font = `700 64px ${FONT}`
      g.fillText(d.title, x + cw / 2, y + ch / 2)
    }
  })
}

/** The board: { el, doors: [{ id, title, color }], title, color, width, height }. */
export function doorwayBoard({ el, doors, title, color, width, height }) {
  const W = 1200
  const H = 800
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  draw(g, W, H, el, doors)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  // drawn again once the page's fonts are in (a canvas draws in a fallback font before)
  document.fonts?.load?.(`700 60px ${FONT}`).then(() => {
    draw(g, W, H, el, doors)
    tex.needsUpdate = true
  }, () => {})
  return pictureBoard({ texture: tex, title, color, width, height })
}
