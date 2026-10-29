// The face of a hall's fact file (docs/knowledge/hall-boards.md): a picture drawn from the element's
// data, so every element can have one: its tile as on the table, its atom with every shell and
// electron, how many protons, neutrons and electrons, and four tiles with an icon each (melts, boils,
// density, discovered). 3:2 like the picture boards; the bottom strip stays calm for the caption.
// The user, 2026-10-29: "make it more interestingly looking".
import * as THREE from 'three'
import { FAMILY, nameOf } from '../../data/elements.js'
import { nucleus } from '../../chem/atom.js'
import { temperature, density, num, LANG_TAG } from '../../ui/format.js'

const W = 1500
const H = 1000
const DISPLAY = 'Outfit, system-ui, sans-serif'
const BODY = 'Nunito, system-ui, sans-serif'
const STATE_ICON = { solid: '🧊', liquid: '💧', gas: '💨' }

const round = (g, x, y, w, h, r) => {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

const ball = (g, x, y, r, color) => {
  const grad = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.25, color)
  grad.addColorStop(1, new THREE.Color(color).multiplyScalar(0.45).getStyle())
  g.fillStyle = grad
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fill()
}

/** Text shrunk until it fits `max` pixels wide. */
const fit = (g, text, weight, size, family, max) => {
  let s = size
  do {
    g.font = `${weight} ${s}px ${family}`
    s -= 2
  } while (g.measureText(text).width > max && s > 10)
}

function draw(g, el, { lang, t }) {
  const tag = LANG_TAG[lang] ?? lang
  const color = FAMILY[el.family].color
  const c = new THREE.Color(color)
  const dark = c.clone().multiplyScalar(0.28).getStyle()
  g.clearRect(0, 0, W, H)

  // the background: the family's colour into the hall's navy, with a faint honeycomb
  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, dark)
  bg.addColorStop(0.55, '#141a44')
  bg.addColorStop(1, '#0b0f24')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  g.strokeStyle = 'rgba(255,255,255,0.045)'
  g.lineWidth = 2
  const hr = 38
  for (let row = 0; row * hr * 1.5 < H + hr; row++) {
    for (let col = 0; col * hr * Math.sqrt(3) < W + hr; col++) {
      const x = col * hr * Math.sqrt(3) + (row % 2) * hr * Math.sqrt(3) / 2
      const y = row * hr * 1.5
      g.beginPath()
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + (k * Math.PI) / 3
        g[k ? 'lineTo' : 'moveTo'](x + hr * Math.cos(a), y + hr * Math.sin(a))
      }
      g.closePath()
      g.stroke()
    }
  }
  // a glow behind the atom
  const glow = g.createRadialGradient(830, 330, 10, 830, 330, 380)
  glow.addColorStop(0, c.clone().multiplyScalar(0.55).getStyle())
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = glow
  g.fillRect(400, 0, 900, 760)

  // ---- the tile, as on the table ----
  const tx = 70
  const ty = 70
  const ts = 400
  g.save()
  g.shadowColor = color
  g.shadowBlur = 40
  round(g, tx, ty, ts, ts, 42)
  const tileFill = g.createLinearGradient(tx, ty, tx + ts, ty + ts)
  tileFill.addColorStop(0, c.clone().multiplyScalar(0.62).getStyle())
  tileFill.addColorStop(1, c.clone().multiplyScalar(0.2).getStyle())
  g.fillStyle = tileFill
  g.fill()
  g.restore()
  g.lineWidth = 10
  g.strokeStyle = color
  round(g, tx, ty, ts, ts, 42)
  g.stroke()
  g.fillStyle = '#ffffff'
  g.textBaseline = 'top'
  g.textAlign = 'left'
  g.font = `600 60px ${DISPLAY}`
  g.fillText(String(el.z), tx + 32, ty + 26)
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `700 ${el.symbol.length > 2 ? 150 : 190}px ${DISPLAY}`
  g.fillText(el.symbol, tx + ts / 2, ty + ts * 0.5)
  fit(g, nameOf(el, lang), 600, 50, DISPLAY, ts - 50)
  g.fillText(nameOf(el, lang), tx + ts / 2, ty + ts * 0.79)
  g.globalAlpha = 0.85
  g.font = `500 36px ${DISPLAY}`
  g.fillText(num(el.mass, tag, 5), tx + ts / 2, ty + ts * 0.91)
  g.globalAlpha = 1

  // the family and the state, as chips under the tile
  const chips = [
    { ball: color, text: t(`families.${el.family}`) },
    el.state && { icon: STATE_ICON[el.state], text: t(`state.${el.state}`) },
  ].filter(Boolean)
  let cy = ty + ts + 46
  for (const chip of chips) {
    g.font = `700 38px ${BODY}`
    const w = Math.min(ts, g.measureText(chip.text).width + 110)
    round(g, tx, cy, w, 76, 38)
    g.fillStyle = 'rgba(255,255,255,0.1)'
    g.fill()
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    if (chip.ball) ball(g, tx + 44, cy + 38, 16, chip.ball)
    else {
      // a colour emoji takes the fill's transparency: draw it opaque
      g.fillStyle = '#ffffff'
      g.font = `36px ${BODY}`
      g.fillText(chip.icon, tx + 26, cy + 40)
    }
    g.fillStyle = '#ffffff'
    fit(g, chip.text, 700, 38, BODY, w - 100)
    g.fillText(chip.text.charAt(0).toUpperCase() + chip.text.slice(1), tx + 84, cy + 40)
    cy += 96
  }

  // ---- the atom: nucleus, shells, electrons ----
  const ax = 830
  const ay = 330
  const shells = el.shells ?? []
  const rMax = 270
  const rMin = shells.length > 4 ? 70 : 90
  const step = shells.length > 1 ? (rMax - rMin) / (shells.length - 1) : 0
  shells.forEach((n, i) => {
    const r = rMin + i * step
    g.strokeStyle = 'rgba(160,200,255,0.35)'
    g.lineWidth = 3
    g.beginPath()
    g.arc(ax, ay, r, 0, Math.PI * 2)
    g.stroke()
    const er = Math.max(5, Math.min(13, (2 * Math.PI * r) / n / 3))
    for (let k = 0; k < n; k++) {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / n + i * 0.4
      ball(g, ax + r * Math.cos(a), ay + r * Math.sin(a), er, '#5fd8ff')
    }
  })
  // the nucleus: a little cluster of protons and neutrons (a few dozen at most, it is a picture)
  const nuc = nucleus(el)
  const shown = Math.min(nuc.protons + nuc.neutrons, 40)
  const pShare = nuc.protons / (nuc.protons + nuc.neutrons)
  const nr = shown > 20 ? 11 : 15
  for (let k = shown - 1; k >= 0; k--) {
    const a = k * 2.39996
    const d = Math.sqrt(k) * nr * 0.95
    ball(g, ax + d * Math.cos(a), ay + d * Math.sin(a), nr, (k * pShare) % 1 < pShare ? '#ff5a5a' : '#9aa6b8')
  }

  // ---- protons, neutrons, electrons ----
  const rows = [
    ['#ff5a5a', `${nuc.protons} p⁺`],
    ['#9aa6b8', `${nuc.neutrons} n`],
    ['#5fd8ff', `${el.z} e⁻`],
  ]
  rows.forEach(([col, text], i) => {
    const y = 140 + i * 110
    ball(g, 1185, y, 26, col)
    g.fillStyle = '#ffffff'
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.font = `700 64px ${DISPLAY}`
    g.fillText(text, 1232, y + 2)
  })

  // ---- four tiles: melts, boils, density, discovered ----
  const stats = [
    ['🌡️', t('card.melt'), temperature(el.melt, 'explorer', tag)],
    ['♨️', t('card.boil'), temperature(el.boil, 'explorer', tag)],
    ['⚖️', t('card.density'), density(el, tag)],
    ['🔍', t('card.discovered'), el.ancient ? t('card.ancient') : String(el.discovered ?? '?')],
  ]
  // one row of four tiles under the atom, wide enough for the values
  const tw = 214
  const th = 150
  stats.forEach(([icon, label, value], i) => {
    const x = 560 + i * (tw + 18)
    const y = 628
    round(g, x, y, tw, th, 26)
    g.fillStyle = 'rgba(255,255,255,0.09)'
    g.fill()
    g.lineWidth = 3
    g.strokeStyle = c.clone().multiplyScalar(0.8).getStyle()
    g.stroke()
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = `44px ${BODY}`
    g.fillStyle = '#ffffff'
    g.fillText(icon, x + tw / 2, y + 36)
    g.globalAlpha = 0.8
    fit(g, label, 600, 26, BODY, tw - 20)
    g.fillText(label, x + tw / 2, y + 80)
    g.globalAlpha = 1
    // a long value ("Known since ancient times") goes on two lines
    g.font = `700 34px ${DISPLAY}`
    const space = value.indexOf(' ', Math.floor(value.length / 2) - 4)
    if (g.measureText(value).width > tw - 20 && space > 0) {
      const lines = [value.slice(0, space), value.slice(space + 1)]
      fit(g, lines.reduce((a, b) => (a.length > b.length ? a : b)), 700, 28, DISPLAY, tw - 20)
      g.fillText(lines[0], x + tw / 2, y + 106)
      g.fillText(lines[1], x + tw / 2, y + 134)
    } else {
      fit(g, value, 700, 34, DISPLAY, tw - 20)
      g.fillText(value, x + tw / 2, y + 118)
    }
  })
}

/** The fact file's face as a texture, drawn again once the page's fonts have loaded. */
export function factFileTexture(el, { lang, t }) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const paint = () => {
    draw(g, el, { lang, t })
    tex.needsUpdate = true
  }
  paint()
  if (document.fonts) Promise.all([document.fonts.load(`700 40px ${DISPLAY}`), document.fonts.load(`700 40px ${BODY}`)]).then(paint, () => {})
  return tex
}
