// The family dashboard's building blocks (/stats): section cards, stat tiles, tables and three small
// charts drawn in plain HTML (columns over time, horizontal bars, stacked bars). The marks follow the
// data-viz rules the page was built with: bars at most 24 px thick with a 4 px rounded end and a square
// base, 2 px gaps of the surface between touching marks, hairline grid, text in text colours (never the
// series colour), a tooltip on hover and on focus (a tap on a phone), and a table view for every chart.
// Colours: the categorical blue and orange of the data-viz palette's dark steps, checked against this
// page's navy surface (both pass the colour-blind and contrast checks); status red only for errors.
import { Fragment, useCallback, useRef, useState } from 'react'

export const INK = { primary: '#eef2ff', secondary: '#b8c0e0', muted: '#8f98bf' }
export const SERIES = { blue: '#3987e5', orange: '#d95926', rest: 'rgba(143, 152, 191, 0.45)' }
export const CHROME = { grid: 'rgba(160, 190, 255, 0.12)', base: 'rgba(160, 190, 255, 0.38)', tip: '#1a2250' }
export const STATUS = { critical: '#d03b3b' }
export const BUTTON = 'rounded-lg px-2.5 py-1 text-xs font-bold border border-white/15 hover:bg-white/10 disabled:opacity-50 whitespace-nowrap'

/** A section of the page: a title, one line of what it suggests, the content; with `table`, a button
 *  that swaps the chart for its table. */
export function Card({ id, title, reading, table, children, className = '' }) {
  const [asTable, setAsTable] = useState(false)
  return (
    <section id={id} data-section={id} className={`glass rounded-2xl p-4 sm:p-5 min-w-0 scroll-mt-4 ${className}`}>
      <div className="flex items-start gap-3">
        <h2 className="font-display text-lg font-bold flex-1 min-w-0">{title}</h2>
        {table && (
          <button type="button" className={BUTTON} onClick={() => setAsTable(t => !t)} aria-pressed={asTable}>
            {asTable ? 'Chart' : 'Table'}
          </button>
        )}
      </div>
      {reading && (
        <p className="text-sm mt-1 mb-3" style={{ color: INK.secondary }} data-reading>
          {reading}
        </p>
      )}
      {asTable && table ? table() : children}
    </section>
  )
}

/** A stat tile: label, value, an optional line under it. */
export function Kpi({ label, value, sub }) {
  return (
    <div className="glass rounded-xl px-3 py-2.5 min-w-0" data-kpi={label}>
      <div className="text-xs" style={{ color: INK.secondary }}>{label}</div>
      <div className="text-2xl font-bold leading-tight mt-0.5 truncate">{value}</div>
      {sub && <div className="text-xs mt-0.5 truncate" style={{ color: INK.muted }}>{sub}</div>}
    </div>
  )
}

/** A table; `align` 'r' right-aligns a column (numbers, in tabular figures). */
export function Table({ head, rows, align = [], empty = 'Nothing to show.' }) {
  if (!rows.length) return <p className="text-sm" style={{ color: INK.muted }}>{empty}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className={`font-bold text-xs px-1.5 py-1 whitespace-nowrap ${align[i] === 'r' ? 'text-right' : 'text-left'}`} style={{ color: INK.muted }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, j) => (
            <tr key={j} style={{ borderTop: `1px solid ${CHROME.grid}` }}>
              {r.map((c, i) => (
                <td key={i} className={`px-1.5 py-1 align-top ${align[i] === 'r' ? 'text-right tabular-nums whitespace-nowrap' : ''}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** One tooltip per chart: the value first, then what it is. A mark gets it on hover (mouse) and on
 *  focus (keyboard, or a tap on a touch screen). */
function useTip() {
  const box = useRef(null)
  const [tip, setTip] = useState(null)
  const show = useCallback((el, lines) => {
    const b = box.current?.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (!b) return
    setTip({ x: r.left + r.width / 2 - b.left, y: r.top - b.top, w: b.width, lines })
  }, [])
  const hide = useCallback(() => setTip(null), [])
  const on = lines => ({
    tabIndex: 0,
    'aria-label': lines.join(', '),
    onPointerEnter: e => e.pointerType === 'mouse' && show(e.currentTarget, lines),
    onPointerLeave: e => e.pointerType === 'mouse' && hide(),
    onFocus: e => show(e.currentTarget, lines),
    onBlur: hide,
  })
  const view = tip && (
    <div
      role="status"
      className="absolute z-20 pointer-events-none rounded-lg px-2.5 py-1.5 text-xs shadow-xl"
      style={{ left: Math.min(Math.max(tip.x, 70), Math.max(70, tip.w - 70)), top: tip.y - 6, transform: 'translate(-50%, -100%)', background: CHROME.tip, border: `1px solid ${CHROME.base}`, whiteSpace: 'nowrap' }}
    >
      {tip.lines.map((l, i) => (
        <div key={i} className={i === 0 ? 'font-bold' : ''} style={{ color: i === 0 ? INK.primary : INK.secondary }}>
          {l}
        </div>
      ))}
    </div>
  )
  return { box, on, view }
}

/** A legend: a swatch the shape of the mark and its name. */
export function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2" style={{ color: INK.secondary }}>
      {items.map(it => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}

/** Columns over time (one series: one colour). `value(b)` the height, `axis(max)` a round top for the
 *  axis, `fmt` the axis and tooltip numbers, `tip(b)` the tooltip's lines, `label(b)` the time under
 *  every `every`-th column (only when `xLabels`). */
export function Columns({ buckets, value, axis, fmt, tip, label, every = 1, xLabels = true, height = 96, color = SERIES.blue, name }) {
  const t = useTip()
  const top = axis(Math.max(0, ...buckets.map(value)))
  const ticks = [0, top / 2, top]
  return (
    <div ref={t.box} className="relative" data-chart={name}>
      <div className="flex">
        <div className="relative w-12 shrink-0 text-[10px] tabular-nums" style={{ height, color: INK.muted }}>
          {ticks.map(k => (
            <div key={k} className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: `${(1 - k / top) * 100}%` }}>
              {k === 0 ? '0' : fmt(k)}
            </div>
          ))}
        </div>
        <div className="relative flex-1 min-w-0" style={{ height }}>
          {ticks.map(k => (
            <div key={k} className="absolute inset-x-0" style={{ top: `${(1 - k / top) * 100}%`, borderTop: `1px solid ${k === 0 ? CHROME.base : CHROME.grid}` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {buckets.map((b, i) => {
              const v = value(b)
              return (
                <div key={i} className="relative flex-1 min-w-0 h-full flex items-end justify-center rounded-sm outline-none hover:bg-white/5 focus-visible:bg-white/10" {...t.on(tip(b))}>
                  {v > 0 && <div data-bar style={{ height: `${Math.max(1.5, (v / top) * 100)}%`, width: '100%', maxWidth: 24, background: color, borderRadius: '4px 4px 0 0' }} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {xLabels && (
        <div className="flex ml-12 mt-1 gap-[2px] text-[10px]" style={{ color: INK.muted }}>
          {buckets.map((b, i) => (
            <div key={i} className="flex-1 min-w-0 flex justify-center whitespace-nowrap">
              {i % every === 0 ? label(b) : ''}
            </div>
          ))}
        </div>
      )}
      {t.view}
    </div>
  )
}

// a bar chart's columns: the names (at most a third of a phone's width), the bars, the values
const columns = nameWidth => `minmax(0, min(${nameWidth}, 36%)) minmax(0, 1fr) auto`

/** Horizontal bars from one baseline, one row each (one series: one colour), the value at the right.
 *  rows: [{ key, name, value, label, tip: [lines] }] */
export function BarRows({ rows, color = SERIES.blue, nameWidth = '12rem', name }) {
  const t = useTip()
  const top = Math.max(1e-9, ...rows.map(r => r.value))
  return (
    <div ref={t.box} className="relative grid items-center gap-x-2" style={{ gridTemplateColumns: columns(nameWidth) }} data-chart={name}>
      {rows.map(r => (
        <Fragment key={r.key}>
          <div className="truncate text-sm py-0.5" title={r.name}>{r.name}</div>
          <div className="relative h-6 flex items-center rounded outline-none hover:bg-white/5 focus-visible:bg-white/10" {...t.on(r.tip)}>
            <div data-bar style={{ width: `${(r.value / top) * 100}%`, minWidth: r.value > 0 ? 3 : 0, height: 12, background: color, borderRadius: '0 4px 4px 0' }} />
          </div>
          <div className="text-xs whitespace-nowrap tabular-nums text-right" style={{ color: INK.secondary }}>{r.label}</div>
        </Fragment>
      ))}
      {t.view}
    </div>
  )
}

/** Horizontal stacked bars: the parts of each row side by side with 2 px gaps, all rows on one scale.
 *  series: [{ key, color, label }], rows: [{ key, name, values: { [key]: n }, label, tip(seriesKey) }] */
export function StackRows({ rows, series, nameWidth = '12rem', name }) {
  const t = useTip()
  const total = r => series.reduce((a, s) => a + (r.values[s.key] ?? 0), 0)
  const top = Math.max(1, ...rows.map(total))
  return (
    <div ref={t.box} className="relative grid items-center gap-x-2" style={{ gridTemplateColumns: columns(nameWidth) }} data-chart={name}>
      {rows.map(r => (
        <Fragment key={r.key}>
          <div className="truncate text-sm py-0.5" title={r.name}>{r.name}</div>
          <div className="h-6 flex items-center">
            <div className="flex items-center gap-[2px] h-3" style={{ width: `${(total(r) / top) * 100}%`, minWidth: 3 }}>
              {series.map((s, i) => {
                const v = r.values[s.key] ?? 0
                if (!v) return null
                const last = series.slice(i + 1).every(x => !(r.values[x.key] ?? 0))
                return <div key={s.key} data-bar={s.key} className="h-full outline-none focus-visible:ring-2 ring-white/60" style={{ flex: `${v} 0 0`, minWidth: 3, background: s.color, borderRadius: last ? '0 4px 4px 0' : 0 }} {...t.on(r.tip(s.key))} />
              })}
            </div>
          </div>
          <div className="text-xs whitespace-nowrap tabular-nums text-right" style={{ color: INK.secondary }}>{r.label}</div>
        </Fragment>
      ))}
      {t.view}
    </div>
  )
}

/** A small label with a mark, for the guesses' tones and a device's state (a word, never colour alone). */
export function Chip({ mark, markColor, children, color = INK.secondary, title }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap border border-white/15" style={{ color }} title={title}>
      {mark && (
        <span aria-hidden="true" style={markColor ? { color: markColor } : undefined}>
          {mark}
        </span>
      )}
      {children}
    </span>
  )
}
