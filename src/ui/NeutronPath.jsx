/* eslint-disable react/prop-types */
// The way a nucleus takes on the chart of nuclides (the Star Forge's slow and rapid captures,
// docs/knowledge/star-forge.md): every known nucleus from iron to plutonium, stable ones white, the path
// so far a line (gold for the slow capture, violet for the rapid), the nucleus now ringed; for the
// Scientist, the magic numbers. The whole chart, coloured by half-life, is the Atom Forge's (NuclideChart).
import { useEffect, useMemo, useRef } from 'react'
import { isotopesOf } from '../chem/nucleus.js'
import { sRun, rPath, rProducts, SEED } from '../worlds/stars/neutrons.js'

const N0 = 24
const N1 = 160
const Z0 = 22
const Z1 = 96
const W = 272
const H = 160

export default function NeutronPath({ kind, Z, N, k = 0, done = false, scientist = false }) {
  const ref = useRef(null)
  const sPath = useMemo(() => [{ Z: SEED.Z, N: SEED.N }, ...sRun(SEED.Z, SEED.N, 170)], [])
  const rp = useMemo(() => rPath(), [])
  const products = useMemo(() => rProducts(rp), [rp])
  useEffect(() => {
    const c = ref.current
    const g = c.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    c.width = W * dpr
    c.height = H * dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    const px = n => ((n - N0) / (N1 - N0)) * W
    const py = z => H - ((z - Z0) / (Z1 - Z0)) * H
    g.fillStyle = '#0b0f24'
    g.fillRect(0, 0, W, H)
    if (scientist) {
      g.strokeStyle = 'rgba(255,255,255,0.18)'
      g.setLineDash([3, 3])
      g.beginPath()
      for (const n of [50, 82, 126]) {
        g.moveTo(px(n), 0)
        g.lineTo(px(n), H)
      }
      for (const z of [28, 50, 82]) {
        g.moveTo(0, py(z))
        g.lineTo(W, py(z))
      }
      g.stroke()
      g.setLineDash([])
    }
    const cw = W / (N1 - N0) + 0.3
    const ch = H / (Z1 - Z0) + 0.3
    for (let z = Z0; z <= Z1; z++) {
      for (const [A, half] of isotopesOf(z)) {
        const n = A - z
        if (n < N0 || n > N1) continue
        g.fillStyle = half === null ? '#f5f7ff' : '#323a66'
        g.fillRect(px(n), py(z) - ch, cw, ch)
      }
    }
    const line = (pts, color) => {
      g.strokeStyle = color
      g.lineWidth = 1.6
      g.beginPath()
      pts.forEach((p, i) => (i ? g.lineTo(px(p.N) + cw / 2, py(p.Z) - ch / 2) : g.moveTo(px(p.N) + cw / 2, py(p.Z) - ch / 2)))
      g.stroke()
    }
    let now = { Z, N }
    if (kind === 'slow') {
      const i = sPath.findIndex(p => p.Z === Z && p.N === N)
      line(sPath.slice(0, i < 0 ? 1 : i + 1), '#ffd166')
    } else {
      line(rp.slice(0, k + 1), '#c58cff')
      now = rp[k]
      if (done) {
        g.fillStyle = '#ffd166'
        for (const p of products) {
          g.globalAlpha = 0.35
          g.strokeStyle = '#c58cff'
          g.beginPath()
          g.moveTo(px(p.from.N) + cw / 2, py(p.from.Z) - ch / 2)
          g.lineTo(px(p.to.N) + cw / 2, py(p.to.Z) - ch / 2)
          g.stroke()
          g.globalAlpha = 1
          g.fillRect(px(p.to.N) - 0.5, py(p.to.Z) - ch - 0.5, cw + 1, ch + 1)
        }
      }
    }
    if (now) {
      g.strokeStyle = '#ffffff'
      g.lineWidth = 1.5
      g.beginPath()
      g.arc(px(now.N) + cw / 2, py(now.Z) - ch / 2, 4.5, 0, Math.PI * 2)
      g.stroke()
    }
  }, [kind, Z, N, k, done, scientist, sPath, rp, products])
  return <canvas ref={ref} className="w-full rounded-lg" style={{ aspectRatio: `${W} / ${H}` }} data-neutron-path />
}
