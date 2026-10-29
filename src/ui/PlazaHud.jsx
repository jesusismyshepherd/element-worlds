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
import DuelHud from './DuelHud.jsx'
import { duel } from '../net/duel.js'
import { useCover, useViewport } from './layout.js'
import { track } from '../net/telemetry.js'

const DOCK = 'glass rounded-xl px-2.5 py-1.5 text-sm font-bold pointer-events-auto hover:bg-white/10 whitespace-nowrap'

/** The plaza's HUD, at the edges so the table stays in view (docs/knowledge/hud-layout.md): a dock
 *  of tools at the bottom left (the quiz, find, the families, the time machine, the scientist's
 *  trends), each opening its drawer above it, one at a time, none open at the start; the card of the cube under the pointer or selected at the bottom right
 *  (a strip across the bottom of an upright phone). */
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
  const vp = useViewport()
  const [playing, setPlaying] = useState(false)
  const [quiz, setQuiz] = useState(false)
  const [open, setOpen] = useState(null)
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
  useEffect(() => {
    if (level !== 'scientist' && open === 'trends') setOpen(null)
  }, [level, open])
  const world = () => (engine?.world?.mode === 'orbit' ? engine.world : null)
  const shown = selected ?? hover
  const el = shown ? element(shown) : null
  const tag = LANG_TAG[i18n.resolvedLanguage] ?? 'en'
  const toggle = id => setOpen(o => {
    if (o !== id) track('drawer', { id })
    return o === id ? null : id
  })
  // on a phone the card and a drawer would share the bottom: the card wins while it is up, and the
  // quiz names its own answers
  // the quiz as a duel in a room (src/net/duel.js): it takes the quiz's place
  const duelOn = useStore(store, s => s.duel)
  const duelLive = useStore(store, s => s.duelLive)
  const together = useStore(store, s => (s.room?.members?.length ?? 0) > 1)
  const inQuiz = quiz || !!duelOn
  const cardUp = !!el && !(vp.compact && inQuiz)
  const drawer = inQuiz || (vp.compact && cardUp) ? null : open

  // what the drawer and the card cover moves the table's centre into the part left free
  const drawerRef = useRef(null)
  const cardRef = useRef(null)
  const dockRef = useRef(null)
  useCover(dockRef, 'bottom', vp.short && !quiz)
  useCover(drawerRef, vp.portrait ? 'bottom' : 'left', vp.compact && !!drawer)
  useCover(cardRef, vp.portrait && vp.compact ? 'bottom' : 'right', cardUp && selected != null)

  const families = (
    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
      {FAMILIES.map(f => (
        <button
          key={f.id}
          type="button"
          onMouseEnter={() => world()?.focusFamily(f.id)}
          onMouseLeave={() => world()?.focusFamily(null)}
          onClick={() => world()?.focusFamily(focus === f.id ? null : f.id)}
          className={`flex items-center gap-1.5 text-xs text-left rounded px-1 py-0.5 ${focus === f.id ? 'bg-white/15' : ''}`}
        >
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
          {t(`families.${f.id}`)}
        </button>
      ))}
    </div>
  )
  const scale = trend && range && (
    <div>
      <div className="h-2 rounded" style={{ background: SCALE_CSS }} />
      <div className="flex justify-between gap-2 text-[11px] opacity-80 mt-0.5">
        <span>{trend === 'year' ? t('card.ancient') : num(range.lo, tag, 3)}</span>
        <span className="truncate">{t(`trends.${trend}.unit`)}{range.log ? ' (log)' : ''}</span>
        <span>{num(range.hi, tag, 4)}</span>
      </div>
    </div>
  )
  const trends = (
    <>
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
      {scale && <div className="mt-2">{scale}</div>}
    </>
  )
  const time = (
    <>
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
      {year != null && <div className="text-xs mt-1 opacity-90">{t('time.status', { year, count: knownCount })}</div>}
    </>
  )
  const DRAWERS = {
    find: [t('hud.find'), <Search key="s" wide onPick={z => { track('find', { z }); world()?.select(z); setOpen(null) }} />],
    families: [t('hud.families'), families],
    time: [t('time.title'), time],
    trends: [t('trends.title'), trends],
  }
  const tools = [
    vp.compact && ['find', '🔎', t('hud.find')],
    ['families', '🎨', t('hud.families')],
    ['time', '⏳', year != null ? String(year) : t('time.title')],
    level === 'scientist' && ['trends', '📊', t('trends.title')],
  ].filter(Boolean)

  return (
    <>
      {!vp.compact && !quiz && (
        <div className="absolute left-3 top-[calc(var(--bar)+0.25rem)]">
          <Search onPick={z => world()?.select(z)} />
        </div>
      )}

      {!quiz && (
        <div className={`absolute flex flex-col gap-2 items-start pointer-events-none ${vp.short ? 'left-1.5 bottom-1.5' : 'left-2 bottom-2 sm:left-3 sm:bottom-3'}`}>
          {drawer && (
            <div
              ref={drawerRef}
              className="glass rounded-xl p-2 pointer-events-auto overflow-y-auto"
              style={{ width: vp.compact && !vp.portrait ? 'min(22rem, 40vw)' : 'min(calc(100vw - 1rem), 24rem)', maxHeight: 'calc(100vh - var(--bar) - 3.75rem)' }}
            >
              <div className="text-xs font-bold opacity-80 mb-1">{DRAWERS[drawer][0]}</div>
              {DRAWERS[drawer][1]}
            </div>
          )}
          {trend && drawer !== 'trends' && scale && !(vp.compact && cardUp) && (
            <div className="glass rounded-xl px-2 py-1.5 w-56 pointer-events-auto">{scale}</div>
          )}
          <div ref={dockRef} className="flex gap-1.5 flex-wrap">
            <button type="button" onClick={() => { track('quizopen'); duel.hide(); setQuiz(true) }} className={DOCK}>
              ❓ {t('quiz.start')}
            </button>
            {(together || duelLive) && (
              <button type="button" data-duel-start onClick={() => { setQuiz(false); if (duelLive) duel.hide(false); else duel.start(level) }} className={DOCK}>
                ⚔️ {t('duel.start')}
              </button>
            )}
            {tools.map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={`${DOCK} ${open === id && drawer ? 'bg-white/20' : ''} ${(id === 'time' && year != null) || (id === 'trends' && trend) ? 'border-sky-300/70' : ''}`}
                aria-label={label}
                aria-expanded={open === id}
                title={label}
              >
                {icon}{(!vp.compact || (id === 'time' && year != null)) && <span className="ml-1 font-normal">{label}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {duelOn && <DuelHud select={z => world()?.select(z)} overview={() => world()?.overview?.()} />}
      {quiz && !duelOn && (
        <QuizHud
          select={z => world()?.select(z)}
          overview={() => world()?.overview?.()}
          onClose={() => {
            setQuiz(false)
            world()?.select(null)
          }}
        />
      )}

      {cardUp && (
        <div
          ref={cardRef}
          className={`absolute pointer-events-auto ${vp.compact ? (vp.portrait ? 'inset-x-2 bottom-[3.25rem]' : 'right-1.5 bottom-1.5') : 'right-3 bottom-3 sm:right-4 sm:bottom-4'}`}
          style={vp.compact && !vp.portrait ? { width: 'min(22rem, 40vw)' } : undefined}
        >
          <ElementCard el={el} level={level} selected={selected === el.z} touch={vp.touch} compact={vp.compact} onEnter={() => world()?.enterSelected()} />
        </div>
      )}

      {!el && !vp.compact && (
        <div className="absolute right-4 bottom-4 text-xs opacity-60 pointer-events-none">
          {t(vp.touch ? 'hud.plazaHelpTouch' : 'hud.plazaHelp')}
        </div>
      )}
    </>
  )
}
