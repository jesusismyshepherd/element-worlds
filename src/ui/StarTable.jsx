/* eslint-disable react/prop-types */
// The Star Forge's periodic table (docs/knowledge/star-forge.md): every element made lights up in the
// colour of where it was made; the second view colours each element by where the Solar System's atoms of
// it came from (after Jennifer Johnson's chart, data/origins.js), with a body's elements by their sources.
import { ELEMENTS, cellOf, nameOf } from '../data/elements.js'
import { SOURCE, SOURCES, originOf, bodyBySource } from '../data/origins.js'
import { wordsOf, at, fill } from '../worlds/stars/words.js'

const DARK = new Set(['w', 'm', 'c', 'l'])

/** The tile's fill: made (one colour) or the origins (stacked shares, the biggest at the bottom). */
function fillOf(z, view, made) {
  if (view === 'made') {
    const src = made.get(z)
    return src ? { background: SOURCE[src].color, ink: DARK.has(src) ? '#10142e' : '#ffffff' } : { background: '#151b3e', ink: '#ffffff66' }
  }
  const parts = originOf(z)
  let acc = 0
  const stops = parts.map(p => {
    const from = acc
    acc += p.share * 100
    return `${SOURCE[p.id].color} ${from.toFixed(1)}% ${acc.toFixed(1)}%`
  })
  return { background: `linear-gradient(to top, ${stops.join(', ')})`, ink: DARK.has(parts[0].id) ? '#10142e' : '#ffffff' }
}

export default function StarTable({ made, newly = [], view, lang, level, onView }) {
  const W = wordsOf(lang)
  const map = new Map(made)
  const fresh = new Set(newly)
  const body = bodyBySource()
  const used = view === 'made' ? SOURCES.filter(s => [...map.values()].includes(s.id)) : SOURCES
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex rounded-lg bg-white/5 p-0.5 text-[11px] font-bold" role="group">
        {['made', 'origins'].map(v => (
          <button key={v} type="button" onClick={() => onView(v)} className={`flex-1 rounded-md px-1.5 py-1 ${view === v ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}>
            {W.table[v]}
          </button>
        ))}
      </div>
      <div className="grid gap-[1px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }} data-star-table>
        {ELEMENTS.map(el => {
          const { col, row } = cellOf(el)
          const f = fillOf(el.z, view, map)
          return (
            <div
              key={el.z}
              title={nameOf(el, lang)}
              className={`aspect-square rounded-[2px] flex items-center justify-center leading-none ${fresh.has(el.z) && view === 'made' ? 'ring-1 ring-white animate-pulse' : ''}`}
              style={{ gridColumn: col, gridRow: row, background: f.background, color: f.ink, fontSize: '6.5px', fontWeight: 700 }}
            >
              {el.symbol}
            </div>
          )
        })}
        <div style={{ gridColumn: '1 / 19', gridRow: 8, height: 3 }} />
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] leading-tight">
        {used.map(s => (
          <span key={s.id} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
            {W.sources[s.key]}
          </span>
        ))}
      </div>
      {view === 'made' ? (
        <div className="text-[11px] opacity-85 leading-snug">
          <span className="font-bold">{fill(W.table.count, { n: map.size })}</span> · {at({ kid: W.table.madeKid, sci: W.table.madeSci }, level)}
        </div>
      ) : (
        <>
          <div className="text-[11px] opacity-85 leading-snug">{at({ kid: W.table.originsKid, sci: W.table.originsSci }, level)}</div>
          <div className="text-[11px] font-bold mt-0.5">{W.table.body}</div>
          <div className="flex h-3 rounded overflow-hidden" data-star-body>
            {SOURCES.filter(s => body[s.id] > 0.05).map(s => (
              <div key={s.id} style={{ width: `${body[s.id]}%`, background: s.color }} title={`${W.sources[s.key]}: ${body[s.id].toFixed(1)} %`} />
            ))}
          </div>
          <div className="text-[11px] opacity-85 leading-snug">{at({ kid: W.table.bodyKid, sci: W.table.bodySci }, level)}</div>
        </>
      )}
    </div>
  )
}
