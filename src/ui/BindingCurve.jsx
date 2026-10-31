/* eslint-disable react/prop-types */
// "Why iron is the end" (the Star Forge, docs/knowledge/star-forge.md): binding energy per nucleon against
// the mass number, from src/data/binding.json (AME masses via mendeleev, scripts/data/export_binding.py).
// Fusing small nuclei climbs the curve, fission comes down it from the heavy side; nickel-62 and iron-56
// sit at the top. The mass number runs on a log scale, so the light nuclei's steep climb can be seen.
import BINDING from '../data/binding.json'

const W = 272
const H = 136
const PAD = { l: 20, r: 8, t: 8, b: 18 }
const A_MAX = 240
// [A, label, where the label goes: dx, dy, anchor]
const MARKS = [[4, 'He-4', 5, 10, 'start'], [12, 'C-12', 5, 11, 'start'], [16, 'O-16', -4, -6, 'end'], [56, 'Fe-56', 0, 12, 'middle'], [62, 'Ni-62', 4, -6, 'start'], [238, 'U-238', -3, 12, 'end']]

export default function BindingCurve({ axis, mass }) {
  const x = A => PAD.l + (Math.log(A) / Math.log(A_MAX)) * (W - PAD.l - PAD.r)
  const y = e => PAD.t + (1 - e / 9.5) * (H - PAD.t - PAD.b)
  const rows = BINDING.filter(r => r[0] >= 1 && r[0] <= A_MAX)
  const at = A => rows.find(r => r[0] === A)?.[2] ?? 0
  const d = rows.filter(r => r[0] > 1).map((r, i) => `${i ? 'L' : 'M'}${x(r[0]).toFixed(1)},${y(r[2]).toFixed(1)}`).join(' ')
  return (
    <div>
      <div className="text-[10px] opacity-75">{axis}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" data-binding-curve>
        <rect x="0" y="0" width={W} height={H} rx="8" fill="#0b0f24" />
        {[0, 3, 6, 9].map(e => (
          <g key={e}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(e)} y2={y(e)} stroke="rgba(255,255,255,0.08)" />
            <text x={PAD.l - 4} y={y(e) + 3} fontSize="8" fill="#ffffffaa" textAnchor="end">{e}</text>
          </g>
        ))}
        {[2, 10, 50].map(A => (
          <text key={A} x={x(A)} y={H - 6} fontSize="7" fill="#ffffff77" textAnchor="middle">{A}</text>
        ))}
        <rect x={x(48)} y={y(9.2)} width={x(76) - x(48)} height={y(8.4) - y(9.2)} fill="#ffd16626" rx="3" />
        <path d={d} fill="none" stroke="#ffd166" strokeWidth="1.6" />
        {MARKS.map(([A, label, dx, dy, anchor]) => (
          <g key={A}>
            <circle cx={x(A)} cy={y(at(A))} r="2.4" fill={A === 62 || A === 56 ? '#ffffff' : '#ffd166'} />
            <text x={x(A) + dx} y={y(at(A)) + dy} fontSize="8" fill="#ffffff" textAnchor={anchor}>{label}</text>
          </g>
        ))}
        <text x={W - PAD.r} y={H - 6} fontSize="7" fill="#ffffffaa" textAnchor="end">{mass} →</text>
      </svg>
    </div>
  )
}
