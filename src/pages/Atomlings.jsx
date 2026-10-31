import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ELEMENTS, element, nameOf } from '../data/elements.js'
import { Lineup } from '../characters/lineup.js'
import { explain } from '../characters/explain.js'
import { FAMILY } from '../data/elements.js'
import VerseLine from '../ui/VerseLine.jsx'

// The sets the page can show: each period, the two f-block series, and a few to compare.
const SETS = [
  { id: 'featured', symbols: ['H', 'He', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Fe', 'Cu', 'Au', 'Hg', 'Si', 'U', 'Og'] },
  ...[1, 2, 3, 4, 5, 6, 7].map(p => ({ id: `p${p}`, symbols: ELEMENTS.filter(e => e.period === p && e.block !== 'f').map(e => e.symbol) })),
  { id: 'lanthanides', symbols: ELEMENTS.filter(e => e.family === 'lanthanide').map(e => e.symbol) },
  { id: 'actinides', symbols: ELEMENTS.filter(e => e.family === 'actinide').map(e => e.symbol) },
  { id: 'g1', symbols: ELEMENTS.filter(e => e.group === 1).map(e => e.symbol) },
  { id: 'g17', symbols: ELEMENTS.filter(e => e.group === 17).map(e => e.symbol) },
  { id: 'g18', symbols: ELEMENTS.filter(e => e.group === 18).map(e => e.symbol) },
]

/** All 118 Atomlings, a set at a time, with how to read them. */
export default function Atomlings() {
  const { t, i18n } = useTranslation()
  const canvas = useRef(null)
  const stage = useRef(null)
  const [params, setParams] = useSearchParams()
  const [ready, setReady] = useState(false)
  const [chosen, setChosen] = useState(null)
  const [how, setHow] = useState(() => window.innerWidth >= 900)
  const down = useRef(null)
  const set = SETS.find(s => s.id === params.get('set')) ?? (params.get('only') ? { id: 'only', symbols: params.get('only').split(',') } : SETS[0])
  const lang = i18n.resolvedLanguage

  useEffect(() => {
    stage.current = new Lineup(canvas.current)
    setReady(true)
    return () => stage.current.dispose()
  }, [])

  useEffect(() => {
    if (!ready) return
    const els = set.symbols.map(s => element(s)).filter(Boolean)
    stage.current.show(els, el => `${el.symbol} · ${nameOf(el, lang)}`)
    setChosen(null)
  }, [ready, set.id, set.symbols.join(), lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // a click (not a drag) on an Atomling opens its card
  const onDown = e => {
    down.current = { x: e.clientX, y: e.clientY }
  }
  const onUp = e => {
    const d = down.current
    down.current = null
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return
    const i = stage.current.pick(e.clientX, e.clientY)
    if (i >= 0) setChosen(set.symbols[i])
  }
  const el = chosen ? element(chosen) : null

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas ref={canvas} className="world" onPointerDown={onDown} onPointerUp={onUp} />
      {el && (
        <div className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 glass rounded-2xl p-4 w-[min(94vw,23rem)] shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-bold" style={{ color: FAMILY[el.family].color }}>{t(`family.${el.family}`)}</div>
              <div className="font-display text-2xl font-bold leading-tight">{el.symbol} · {nameOf(el, lang)}</div>
            </div>
            <button type="button" onClick={() => setChosen(null)} className="rounded-lg px-2 py-1 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
          </div>
          <ul className="mt-2 space-y-1 text-[14px] leading-snug list-disc pl-4">
            {explain(el, lang).map(s => <li key={s}>{s}</li>)}
          </ul>
          <Link to={`/e/${el.symbol}`} className="inline-block mt-3 font-display font-bold px-4 py-1.5 rounded-xl text-[#0b0f24]" style={{ background: FAMILY[el.family].color }}>
            {t('card.enter')} ▶
          </Link>
        </div>
      )}
      <div className="absolute top-0 inset-x-0 p-2 sm:p-3 flex flex-wrap gap-2 items-start pointer-events-none">
        <div className="glass rounded-xl px-3 py-1.5 pointer-events-auto">
          <Link to="/" className="font-display font-bold hover:underline">← {t('hud.table')}</Link>
          <span className="opacity-60"> / </span>
          <span className="font-display font-bold">{t('atomlings.title')}</span>
        </div>
        <div className="glass rounded-xl p-1 flex flex-wrap gap-1 pointer-events-auto text-xs font-bold">
          {SETS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setParams({ set: s.id })}
              className={`px-2 py-1 rounded-lg ${set.id === s.id ? 'bg-white text-[#0b0f24]' : 'hover:bg-white/10'}`}
            >
              {t(`atomlings.sets.${s.id.replace(/^p\d$/, 'p')}`, { n: s.id.slice(1) })}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 glass rounded-xl p-3 max-w-[min(94vw,24rem)] text-[13px] leading-snug">
        <button type="button" onClick={() => setHow(h => !h)} className="font-display font-bold text-base w-full text-left flex justify-between gap-3">
          <span>{t('atomlings.howTitle')}</span><span className="opacity-60">{how ? '▾' : '▴'}</span>
        </button>
        {how && (
          <ul className="space-y-0.5 mt-1">
            {['hands', 'hoop', 'size', 'move', 'body', 'mark', 'look', 'story'].map(k => <li key={k}>{t(`atomlings.how.${k}`)}</li>)}
          </ul>
        )}
        {/* all 118 together: you created all things (src/content/scripture/) */}
        {how && <VerseLine id="atomlings" className="mt-2" />}
        {!how && <div className="text-xs opacity-70 mt-0.5">{t('atomlings.tap')}</div>}
      </div>
    </div>
  )
}
