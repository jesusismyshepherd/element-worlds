import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ELEMENTS, element, nameOf } from '../data/elements.js'
import { Lineup } from '../characters/lineup.js'

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
  }, [ready, set.id, set.symbols.join(), lang]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas ref={canvas} className="world" />
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
        <div className="font-display font-bold text-base mb-1">{t('atomlings.howTitle')}</div>
        <ul className="space-y-0.5">
          {['hands', 'hoop', 'size', 'move', 'body', 'mark'].map(k => <li key={k}>{t(`atomlings.how.${k}`)}</li>)}
        </ul>
      </div>
    </div>
  )
}
