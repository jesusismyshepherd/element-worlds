// The electron map: a glass board standing in the cloud, drawn on a canvas. Its rows are the shells (the
// first at the bottom, as energy climbs), its columns the shapes (s, p, d, f, in their blocks' colours);
// each subshell is a key with its name, its electron count and Hund's boxes (an arrow for each electron,
// up and down for a pair, the empty boxes faint). A tap on a key's name shows that subshell, on a box that
// one orbital, on "All" every electron; the key shown glows. hit(uv) says what a tap at a point means.
import * as THREE from 'three'
import { BLOCK } from './views.js'

const W = 1024
const PX_PER_M = 470
const BOX = 34
const PITCH = 39
const NAME_W = 70
const PAD = 12
const ROW_H = 96
const HEAD = 118
const FOOT = 66

const rgba = (hex, a) => {
  const c = new THREE.Color(hex)
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function arrow(g, x, y0, y1, w) {
  const dir = Math.sign(y1 - y0)
  g.beginPath()
  g.moveTo(x, y0)
  g.lineTo(x, y1)
  g.moveTo(x - w, y1 - dir * w * 1.1)
  g.lineTo(x, y1)
  g.lineTo(x + w, y1 - dir * w * 1.1)
  g.stroke()
}

/** "4f" with its count raised small after it ("4f" then "14"), from x; returns the width drawn. */
function nameWithCount(g, name, count, x, y, size) {
  g.font = `700 ${size}px Outfit, system-ui, sans-serif`
  g.fillText(name, x, y)
  const w = g.measureText(name).width
  if (count == null) return w
  g.font = `700 ${Math.round(size * 0.58)}px Outfit, system-ui, sans-serif`
  g.fillText(String(count), x + w + 2, y - size * 0.42)
  return w + 2 + g.measureText(String(count)).width
}

/** The board for an element's electrons (`info` from electronsOf). `words`: { title, all(z), hint, config }. */
export function electronBoard({ info, words, color }) {
  const present = ['s', 'p', 'd', 'f'].filter(l => info.subs.some(s => s.l === l))
  const keyW = l => NAME_W + PITCH * (2 * ['s', 'p', 'd', 'f'].indexOf(l) + 1) + PAD * 2 - (PITCH - BOX)
  const widths = present.map(keyW)
  const gap = 14
  const used = widths.reduce((a, b) => a + b, 0) + gap * (present.length - 1)
  const left = Math.max(28, (W - used) / 2)
  const colX = {}
  present.reduce((x, l, i) => ((colX[l] = x), x + widths[i] + gap), left)
  const H = HEAD + info.shells * ROW_H + FOOT
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const width = W / PX_PER_M
  const height = H / PX_PER_M

  // where each thing is on the canvas, for taps
  const keys = info.subs.map(s => {
    const y = HEAD + (info.shells - s.n) * ROW_H + 10
    const x = colX[s.l]
    const w = keyW(s.l)
    const h = ROW_H - 20
    return {
      sub: s,
      x, y, w, h,
      boxes: s.orbitals.map((o, m) => ({ m, x: x + PAD + NAME_W + m * PITCH, y: y + h - BOX - 12, w: BOX, h: BOX })),
    }
  })
  const allKey = { x: W - 28 - 330, y: 24, w: 330, h: 70 }

  function draw(sel, level) {
    g.clearRect(0, 0, W, H)
    // the glass: dark, clear enough to see the cloud through
    roundRect(g, 4, 4, W - 8, H - 8, 34)
    g.fillStyle = 'rgba(8, 12, 34, 0.62)'
    g.fill()
    g.lineWidth = 5
    g.strokeStyle = rgba(color, 0.9)
    g.shadowColor = rgba(color, 0.9)
    g.shadowBlur = 18
    g.stroke()
    g.shadowBlur = 0
    // the title
    g.fillStyle = '#ffffff'
    g.textBaseline = 'alphabetic'
    g.font = '700 46px Outfit, system-ui, sans-serif'
    g.fillText(words.title, 32, 78)
    // "All the electrons"
    const allOn = sel.sub === 'all'
    roundRect(g, allKey.x, allKey.y, allKey.w, allKey.h, 22)
    g.fillStyle = allOn ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)'
    g.fill()
    g.lineWidth = allOn ? 5 : 2.5
    g.strokeStyle = allOn ? '#ffffff' : 'rgba(255,255,255,0.55)'
    if (allOn) {
      g.shadowColor = '#ffffff'
      g.shadowBlur = 20
    }
    g.stroke()
    g.shadowBlur = 0
    // a little atom drawn by its label
    const cx = allKey.x + 42
    const cy = allKey.y + allKey.h / 2
    g.strokeStyle = 'rgba(255,255,255,0.85)'
    g.lineWidth = 2.5
    for (const a of [0, Math.PI / 3, -Math.PI / 3]) {
      g.beginPath()
      g.ellipse(cx, cy, 22, 8, a, 0, Math.PI * 2)
      g.stroke()
    }
    g.fillStyle = '#ff7b7b'
    g.beginPath()
    g.arc(cx, cy, 5, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#ffffff'
    g.font = '700 30px Outfit, system-ui, sans-serif'
    g.fillText(words.all, allKey.x + 78, allKey.y + 46, allKey.w - 90)
    // the shells' numbers down the left, where the keys leave room
    if (left >= 96) {
      g.font = '600 24px Outfit, system-ui, sans-serif'
      g.fillStyle = 'rgba(200,215,255,0.5)'
      for (let n = 1; n <= info.shells; n++) g.fillText(`n = ${n}`, left - 86, HEAD + (info.shells - n) * ROW_H + ROW_H / 2 + 8)
    }
    // the keys
    for (const k of keys) {
      const s = k.sub
      const on = sel.sub === s.id
      const col = BLOCK[s.l]
      roundRect(g, k.x, k.y, k.w, k.h, 18)
      g.fillStyle = rgba(col, on ? 0.42 : 0.14)
      g.fill()
      g.lineWidth = on ? 5 : 2.5
      g.strokeStyle = on ? '#ffffff' : rgba(col, 0.85)
      if (on) {
        g.shadowColor = col
        g.shadowBlur = 24
      }
      g.stroke()
      g.shadowBlur = 0
      g.fillStyle = '#ffffff'
      nameWithCount(g, s.id, s.count, k.x + PAD, k.y + 44, 36)
      // Hund's boxes
      for (const b of k.boxes) {
        const e = s.boxes[b.m]
        const one = on && sel.m === b.m
        roundRect(g, b.x, b.y, b.w, b.h, 7)
        g.fillStyle = one ? 'rgba(255,255,255,0.4)' : e ? rgba(col, 0.32) : 'rgba(255,255,255,0.04)'
        g.fill()
        g.lineWidth = one ? 4 : 2
        g.strokeStyle = one ? '#ffffff' : e ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)'
        g.stroke()
        g.strokeStyle = '#ffffff'
        g.lineWidth = 3
        if (e >= 1) arrow(g, b.x + (e === 2 ? b.w * 0.32 : b.w / 2), b.y + b.h - 6, b.y + 6, 6)
        if (e === 2) arrow(g, b.x + b.w * 0.68, b.y + 6, b.y + b.h - 6, 6)
      }
      // the orbitals' little names above the boxes, in Scientist
      if (level === 'scientist' && s.lq > 0) {
        g.font = '600 15px Outfit, system-ui, sans-serif'
        g.fillStyle = 'rgba(255,255,255,0.72)'
        for (const b of k.boxes) {
          const t = s.orbitals[b.m].sub
          const tw = Math.min(g.measureText(t).width, PITCH + 4)
          g.fillText(t, b.x + b.w / 2 - tw / 2, b.y - 6, PITCH + 4)
        }
      }
    }
    // the foot: the configuration in Scientist, what to tap in Explorer
    g.fillStyle = 'rgba(225,232,255,0.85)'
    g.font = '600 28px Outfit, system-ui, sans-serif'
    const footY = H - 26
    if (level === 'scientist') {
      let x = 32
      g.fillText(words.config, x, footY)
      x += g.measureText(words.config).width + 14
      for (const s of info.subs) {
        g.fillStyle = BLOCK[s.l]
        x += nameWithCount(g, s.id, s.count, x, footY, 28) + 12
        if (x > W - 60) break
      }
    } else {
      g.fillText(words.hint, 32, footY, W - 64)
    }
    tex.needsUpdate = true
  }

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
  )
  mesh.renderOrder = 6
  const group = new THREE.Group()
  group.add(mesh)

  /** What a tap at uv means: { sub: 'all' } | { sub: id } | { sub: id, m } | null. */
  function hit(uv) {
    if (!uv) return null
    const x = uv.x * W
    const y = (1 - uv.y) * H
    const inside = r => x >= r.x - 4 && x <= r.x + r.w + 4 && y >= r.y - 4 && y <= r.y + r.h + 4
    if (inside(allKey)) return { sub: 'all', m: null }
    for (const k of keys) {
      for (const b of k.boxes) if (inside(b)) return { sub: k.sub.id, m: b.m }
      if (inside(k)) return { sub: k.sub.id, m: null }
    }
    return null
  }

  /** Where a key's name (m null), one of its boxes, or "All" (sub 'all') is on the board, as uv (probes). */
  function uvOf({ sub, m = null }) {
    let r = allKey
    if (sub !== 'all') {
      const k = keys.find(x => x.sub.id === sub)
      if (!k) return null
      r = m == null ? { x: k.x + PAD, y: k.y + 8, w: NAME_W - 10, h: 44 } : k.boxes[m]
    }
    return { x: (r.x + r.w / 2) / W, y: 1 - (r.y + r.h / 2) / H }
  }

  return {
    group,
    mesh,
    width,
    height,
    draw,
    hit,
    uvOf,
    dispose() {
      tex.dispose()
      mesh.geometry.dispose()
      mesh.material.dispose()
    },
  }
}
