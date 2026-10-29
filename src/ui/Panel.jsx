/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCover, useViewport } from './layout.js'

/** How wide the side sheet is (the prompt on a touch screen stands left of it). */
export const sheetWidth = short => (short ? 'min(22rem, 38vw)' : 'min(26rem, 42vw)')

/** A slider an exhibit gives the visitor: { label, min, max, step, value, onInput(v), format(v),
 *  live() }; live() is read each frame while it is not being dragged, so the slider follows the
 *  exhibit when it moves by itself (gliding to the magic angle). */
function Slider({ s, color }) {
  const [v, setV] = useState(s.value)
  const dragging = useRef(false)
  useEffect(() => {
    if (!s.live) return undefined
    let id
    const tick = () => {
      if (!dragging.current) {
        const now = s.live()
        setV(old => (Math.abs(old - now) > 1e-6 ? now : old))
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [s])
  const let_go = () => {
    dragging.current = false
  }
  return (
    <label className="block rounded-xl bg-white/5 px-3 py-2">
      <div className="flex justify-between items-baseline gap-2 text-sm">
        <span className="font-bold">{s.label}</span>
        <span className="font-display font-bold text-base tabular-nums" style={{ color }}>{s.format ? s.format(v) : v}</span>
      </div>
      <input
        type="range"
        min={s.min}
        max={s.max}
        step={s.step ?? 'any'}
        value={v}
        onPointerDown={() => {
          dragging.current = true
        }}
        onPointerUp={let_go}
        onPointerCancel={let_go}
        onBlur={let_go}
        onChange={e => {
          const x = Number(e.target.value)
          setV(x)
          s.onInput(x)
        }}
        className="w-full mt-1 h-8 accent-amber-300"
        aria-label={s.label}
      />
    </label>
  )
}

/** What a station or an exhibit tells, opened by using it. A world sets store.panel to
 *  { title, kicker?, color?, blocks: [{ p }, { big, small? }, { rows: [[label, value]] }, { list: [] },
 *  { link: { to, label } }, { slider }, { buttons: [{ label, onClick }] }, { h } (a section's heading),
 *  { img, alt, crop } (a picture; crop: the share of its height shown, from the top)] }. It never sits in the middle (docs/knowledge/hud-layout.md): a sheet
 *  down the right side, or across the top of an upright phone, and the world's centre moves into the
 *  part left free. */
export default function Panel({ panel, onClose }) {
  const { t } = useTranslation()
  const { portrait, short } = useViewport()
  const box = useRef(null)
  useCover(box, portrait ? 'top' : 'right')
  const place = portrait
    ? { left: '0.5rem', right: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: 'min(40vh, calc(100vh - var(--bar) - 11rem))' }
    : { right: '0.75rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)', width: sheetWidth(short) }
  return (
    <div
      ref={box}
      className="absolute glass rounded-2xl overflow-y-auto pointer-events-auto shadow-2xl overscroll-contain"
      style={{ ...place, borderColor: panel.color ? `${panel.color}88` : undefined }}
    >
      <div className="sticky top-0 flex items-start justify-between gap-2 px-4 pt-3 pb-2 bg-[#10163a]/90 backdrop-blur">
        <div className="min-w-0">
          {panel.kicker && <div className="text-xs font-bold uppercase tracking-wide" style={{ color: panel.color }}>{panel.kicker}</div>}
          <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">{panel.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 rounded-lg px-2 py-1 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-3 text-[15px] leading-relaxed">
        {panel.blocks.map((b, i) => {
          if (b.p) return <p key={i}>{b.p}</p>
          if (b.h) return <h3 key={i} className="font-display text-lg font-bold leading-tight mt-2 -mb-1" style={{ color: panel.color }}>{b.h}</h3>
          if (b.img) return <img key={i} src={b.img} alt={b.alt ?? ''} className="w-full rounded-xl object-cover object-top" style={b.crop ? { aspectRatio: `3 / ${2 * b.crop}` } : undefined} />
          if (b.big) return (
            <div key={i} className="rounded-xl bg-white/5 p-3 text-center">
              <div className="font-display text-3xl font-bold" style={{ color: panel.color }}>{b.big}</div>
              {b.small && <div className="text-sm opacity-80">{b.small}</div>}
            </div>
          )
          if (b.rows) return (
            <dl key={i} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              {b.rows.map(([k, v]) => [<dt key={`${k}k`} className="opacity-70">{k}</dt>, <dd key={`${k}v`}>{v}</dd>])}
            </dl>
          )
          if (b.link) return (
            <Link key={i} to={b.link.to} onClick={onClose} className="self-start rounded-xl px-3 py-1.5 text-sm font-bold bg-white/10 hover:bg-white/20" style={{ color: panel.color }}>
              {b.link.label} →
            </Link>
          )
          if (b.slider) return <Slider key={`${i}-${b.slider.label}`} s={b.slider} color={panel.color} />
          if (b.buttons) return (
            <div key={i} className="flex flex-wrap gap-2">
              {b.buttons.map(x => (
                <button key={x.label} type="button" onClick={x.onClick} className="rounded-xl px-3 py-1.5 text-sm font-bold bg-white/10 hover:bg-white/20 active:scale-95 transition" style={x.accent ? { color: panel.color } : undefined}>
                  {x.label}
                </button>
              ))}
            </div>
          )
          if (b.list) return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {b.list.map(x => <li key={x}>{x}</li>)}
            </ul>
          )
          return null
        })}
      </div>
    </div>
  )
}
