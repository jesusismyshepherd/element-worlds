/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { FAMILIES, element } from '../data/elements.js'
import { TRENDS, SCALE_CSS } from '../worlds/plaza/layout.js'
import { num, LANG_TAG } from './format.js'
import ElementCard from './ElementCard.jsx'
import Search from './Search.jsx'
import QuizHud from './QuizHud.jsx'

const touchScreen = () => window.matchMedia?.('(pointer: coarse)').matches

/** The plaza's HUD: the families (hover or tap to light one), the card of the cube under the pointer
 *  or selected, and for the scientist the trends (cubes as bars). */
export default function PlazaHud({ engine }) {
  const { t, i18n } = useTranslation()
  const hover = useStore(store, s => s.hover)
  const selected = useStore(store, s => s.selected)
  const focus = useStore(store, s => s.familyFocus)
  const trend = useStore(store, s => s.trend)
  const range = useStore(store, s => s.trendRange)
  const level = useStore(store, s => s.level)
  const year = useStore(store, s => s.year)
  const knownCount = useStore(store, s => s.knownCount)
  const [playing, setPlaying] = useState(false)
  const [quiz, setQuiz] = useState(false)
  const timer = useRef(null)
  // play: the years run from the first discoveries to today, about twelve seconds
  useEffect(() => {
    if (!playing) return undefined
    timer.current = setInterval(() => {
      const y = store.get().year ?? 1600
      const next = y < 1700 ? y + 25 : y + 4
      if (next >= 2026) {
        setPlaying(false)
        engine?.world?.setYear?.(2026)
      } else engine?.world?.setYear?.(next)
    }, 60)
    return () => clearInterval(timer.current)
  }, [playing, engine])
  const world = () => (engine?.world?.mode === 'orbit' ? engine.world : null)
  const shown = selected ?? hover
  const el = shown ? element(shown) : null
  const touch = touchScreen()
  const tag = LANG_TAG[i18n.resolvedLanguage] ?? 'en'

  return (
    <>
      <div className="absolute left-2 sm:left-3 top-[4.25rem] sm:top-[4.5rem]">
        <Search onPick={z => world()?.select(z)} />
      </div>
      <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 flex flex-col gap-2 items-start pointer-events-none">
        {!quiz && (
          <button type="button" onClick={() => setQuiz(true)} className="glass rounded-xl px-3 py-1.5 text-sm font-bold pointer-events-auto hover:bg-white/10">
            ❓ {t('quiz.start')}
          </button>
        )}
        {level === 'scientist' && (
          <div className="glass rounded-xl p-2 pointer-events-auto max-w-[min(92vw,26rem)]">
            <div className="text-xs font-bold opacity-80 mb-1">{t('trends.title')}</div>
            <div className="flex flex-wrap gap-1">
              {[null, ...TRENDS.map(tr => tr.id)].map(id => (
                <button
                  key={id ?? 'off'}
                  type="button"
                  onClick={() => world()?.setTrend(id)}
                  className={`text-xs px-2 py-1 rounded-lg border ${trend === id ? 'bg-white text-[#0b0f24] border-white' : 'border-white/25 hover:bg-white/10'}`}
                >
                  {id ? t(`trends.${id}.name`) : t('trends.off')}
                </button>
              ))}
            </div>
            {trend && range && (
              <div className="mt-2">
                <div className="h-2 rounded" style={{ background: SCALE_CSS }} />
                <div className="flex justify-between text-[11px] opacity-80 mt-0.5">
                  <span>{trend === 'year' ? t('card.ancient') : num(range.lo, tag, 3)}</span>
                  <span>{t(`trends.${trend}.unit`)}{range.log ? ' (log)' : ''}</span>
                  <span>{num(range.hi, tag, 4)}</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="glass rounded-xl p-2 pointer-events-auto w-[min(92vw,22rem)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (year == null) {
                  world()?.setYear(1600)
                  setPlaying(true)
                } else setPlaying(p => !p)
              }}
              className="text-xs font-bold px-2 py-1 rounded-lg border border-white/25 hover:bg-white/10 whitespace-nowrap"
            >
              {playing ? '⏸' : '▶'} {t('time.title')}
            </button>
            {year != null && (
              <>
                <input
                  type="range" min={1600} max={2026} value={year}
                  onChange={e => { setPlaying(false); world()?.setYear(Number(e.target.value)) }}
                  className="flex-1 min-w-0 accent-sky-300"
                  aria-label={t('time.year')}
                />
                <button type="button" onClick={() => { setPlaying(false); world()?.setYear(null) }} className="text-xs opacity-70 hover:opacity-100" aria-label={t('hud.close')}>✕</button>
              </>
            )}
          </div>
          {year != null && (
            <div className="text-xs mt-1 opacity-90">{t('time.status', { year, count: knownCount })}</div>
          )}
        </div>
        <div className="glass rounded-xl p-2 pointer-events-auto hidden sm:block">
          <div className="text-xs font-bold opacity-80 mb-1">{t('hud.families')}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {FAMILIES.map(f => (
              <button
                key={f.id}
                type="button"
                onMouseEnter={() => world()?.focusFamily(f.id)}
                onMouseLeave={() => world()?.focusFamily(null)}
                onClick={() => world()?.focusFamily(focus === f.id ? null : f.id)}
                className={`flex items-center gap-1.5 text-xs text-left rounded px-1 ${focus === f.id ? 'bg-white/15' : ''}`}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                {t(`families.${f.id}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {quiz && (
        <QuizHud
          select={z => world()?.select(z)}
          overview={() => world()?.overview?.()}
          onClose={() => {
            setQuiz(false)
            world()?.select(null)
          }}
        />
      )}

      {el && (
        <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 pointer-events-auto">
          <ElementCard el={el} level={level} selected={selected === el.z} touch={touch} onEnter={() => world()?.enterSelected()} />
        </div>
      )}

      {!el && (
        <div className="absolute right-4 bottom-4 text-xs opacity-60 pointer-events-none hidden sm:block">
          {t(touch ? 'hud.plazaHelpTouch' : 'hud.plazaHelp')}
        </div>
      )}
    </>
  )
}
