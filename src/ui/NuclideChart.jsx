/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ELEMENTS } from '../data/elements.js'
import { loadChart, isotopesOf } from '../chem/nucleus.js'

// how long a nucleus lasts, as a colour (stable white; long-lived red to short-lived blue)
const BANDS = [
  ['stable', '#f5f7ff'], ['years', '#ff6b4a'], ['hours', '#ffa94d'], ['seconds', '#ffe066'],
  ['ms', '#69db7c'], ['fast', '#4dabf7'], ['instant', '#b197fc'], ['unmeasured', '#6b7280'],
]
const COLOR = Object.fromEntries(BANDS)
export function band(t) {
  if (t === null) return 'stable'
  if (t < 0) return 'unmeasured'
  if (t < 1e-12) return 'instant'
  if (t < 1e-3) return 'fast'
  if (t < 1) return 'ms'
  if (t < 1e3) return 'seconds'
  if (t < 1e7) return 'hours'
  return 'years'
}

const MAXN = 180
const MAXZ = 118
const CELL = 2 // the whole chart: a pixel pair per nuclide
const ZOOM = 24 // the close-up: cells big enough to tap and to read
const SPAN = { n: 6, z: 3 } // the close-up shows N +- 6, Z +- 3

/** The chart of nuclides: every known nucleus by protons (up) and neutrons (across), coloured by how
 *  long it lasts, the forge's atom marked; a close-up around it with names; a tap jumps there. */
export default function NuclideChart({ Z, N, onPick }) {
  const { t } = useTranslation()
  const full = useRef(null)
  const near = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    loadChart().then(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!ready) return
    const c = full.current
    const g = c.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    c.width = MAXN * CELL * dpr
    c.height = (MAXZ + 1) * CELL * dpr
    g.scale(dpr, dpr)
    g.fillStyle = '#0b0f24'
    g.fillRect(0, 0, MAXN * CELL, (MAXZ + 1) * CELL)
    for (let z = 1; z <= MAXZ; z++) {
      for (const [A, half] of isotopesOf(z)) {
        const n = A - z
        if (n >= MAXN) continue
        g.fillStyle = COLOR[band(half)]
        g.fillRect(n * CELL, (MAXZ - z) * CELL, CELL, CELL)
      }
    }
    // the forge's atom: a crosshair
    g.strokeStyle = 'rgba(255,209,102,0.55)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(0, (MAXZ - Z) * CELL + 1)
    g.lineTo(MAXN * CELL, (MAXZ - Z) * CELL + 1)
    g.moveTo(N * CELL + 1, 0)
    g.lineTo(N * CELL + 1, (MAXZ + 1) * CELL)
    g.stroke()
    g.strokeStyle = '#ffd166'
    g.lineWidth = 2
    g.strokeRect(N * CELL - 3, (MAXZ - Z) * CELL - 3, CELL + 6, CELL + 6)
  }, [ready, Z, N])

  useEffect(() => {
    if (!ready) return
    const c = near.current
    const g = c.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = (SPAN.n * 2 + 1) * ZOOM
    const h = (SPAN.z * 2 + 1) * ZOOM
    c.width = w * dpr
    c.height = h * dpr
    g.scale(dpr, dpr)
    g.fillStyle = '#0b0f24'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let dz = -SPAN.z; dz <= SPAN.z; dz++) {
      const z = Z + dz
      if (z < 1 || z > MAXZ) continue
      const list = isotopesOf(z)
      for (let dn = -SPAN.n; dn <= SPAN.n; dn++) {
        const n = N + dn
        const hit = list.find(x => x[0] === z + n)
        if (!hit) continue
        const x = (dn + SPAN.n) * ZOOM
        const y = (SPAN.z - dz) * ZOOM
        g.fillStyle = COLOR[band(hit[1])]
        g.fillRect(x + 1, y + 1, ZOOM - 2, ZOOM - 2)
        g.fillStyle = band(hit[1]) === 'unmeasured' || band(hit[1]) === 'fast' || band(hit[1]) === 'instant' ? '#ffffff' : '#10142e'
        g.font = 'bold 8px Nunito, sans-serif'
        g.fillText(ELEMENTS[z - 1].symbol, x + ZOOM / 2, y + ZOOM / 2 - 4)
        g.font = '7px Nunito, sans-serif'
        g.fillText(String(z + n), x + ZOOM / 2, y + ZOOM / 2 + 5)
      }
    }
    g.strokeStyle = '#ffd166'
    g.lineWidth = 2
    g.strokeRect(SPAN.n * ZOOM, SPAN.z * ZOOM, ZOOM, ZOOM)
  }, [ready, Z, N])

  // a tap on the whole chart jumps to the nearest known nucleus; on the close-up, to that cell
  const pickFull = e => {
    const r = full.current.getBoundingClientRect()
    const n0 = ((e.clientX - r.left) / r.width) * MAXN
    const z0 = MAXZ - ((e.clientY - r.top) / r.height) * (MAXZ + 1)
    let best = null
    let bd = Infinity
    for (let z = Math.max(1, Math.round(z0) - 4); z <= Math.min(MAXZ, Math.round(z0) + 4); z++) {
      for (const [A] of isotopesOf(z)) {
        const d = (A - z - n0) ** 2 + (z - z0) ** 2
        if (d < bd) {
          bd = d
          best = [z, A - z]
        }
      }
    }
    if (best) onPick(best[0], best[1])
  }
  const pickNear = e => {
    const r = near.current.getBoundingClientRect()
    const dn = Math.floor(((e.clientX - r.left) / r.width) * (SPAN.n * 2 + 1)) - SPAN.n
    const dz = SPAN.z - Math.floor(((e.clientY - r.top) / r.height) * (SPAN.z * 2 + 1))
    const z = Z + dz
    const n = N + dn
    if (z >= 1 && z <= MAXZ && isotopesOf(z).some(x => x[0] === z + n)) onPick(z, n)
  }

  return (
    <div className="flex flex-col gap-2">
      <canvas ref={near} onClick={pickNear} className="w-full rounded-lg cursor-pointer" style={{ aspectRatio: `${SPAN.n * 2 + 1} / ${SPAN.z * 2 + 1}` }} />
      <div className="relative">
        <canvas ref={full} onClick={pickFull} className="w-full rounded-lg cursor-crosshair" style={{ aspectRatio: `${MAXN} / ${MAXZ + 1}`, imageRendering: 'pixelated' }} />
        <div className="absolute left-1 top-1 text-[10px] opacity-70">↑ {t('forge.chartZ')}</div>
        <div className="absolute right-1 bottom-1 text-[10px] opacity-70">{t('forge.chartN')} →</div>
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px]">
        {BANDS.map(([k, c]) => (
          <span key={k} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            {t(`forge.band.${k}`)}
          </span>
        ))}
      </div>
    </div>
  )
}
