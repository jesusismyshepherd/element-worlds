/* eslint-disable react/prop-types */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import DailyHud, { Flame } from './DailyHud.jsx'
import HuntHud from './HuntHud.jsx'
import { useDaily } from './useDaily.js'
import { useHunts } from './useHunts.js'
import { currentClue } from '../game/hunts.js'
import { duel } from '../net/duel.js'
import { useCover, useViewport } from './layout.js'
import { track } from '../net/telemetry.js'

// (a little narrower on a phone, so the dock keeps to one row there in every language)
const DOCK = 'glass rounded-xl px-2 sm:px-2.5 py-1.5 text-sm font-bold pointer-events-auto hover:bg-white/10 whitespace-nowrap'

/** The plaza's HUD, at the edges so the table stays in view (docs/knowledge/hud-layout.md): a dock
 *  of tools at the bottom left (today's element with the streak's flame, the quiz, the treasure hunts,
 *  find, the families, the time machine, the trends), each opening its drawer above it, one at a time,
 *  none open at the start; the card of the cube under the pointer or selected at the bottom right (a strip
 *  across the bottom of an upright phone). On a phone the card and a drawer take turns: the last one asked
 *  for is shown (the hunt's clue card too). Today's element, the quiz and the hunts are sheets down the left
 *  side (across the top of a phone). */
export default function PlazaHud({ engine }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { streak } = useDaily()
  const [daily, setDaily] = useState(false)
  // the treasure hunts' sheet (docs/knowledge/hunts.md); the clue card of the hunt on is Hud.jsx's
  const [huntsOpen, setHuntsOpen] = useState(false)
  const hunt = useHunts()
  const huntOn = !!currentClue(hunt.state)
  const huntCardUp = hunt.open && (huntOn || hunt.news?.kind === 'done')
  // /?daily opens today's element (the passport's streak links here), /?hunts the hunts (a hunt's end does)
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    if (!q.has('daily') && !q.has('hunts')) return
    if (q.has('daily')) setDaily(true)
    else setHuntsOpen(true)
    navigate('/', { replace: true })
  }, [location.search]) // eslint-disable-line react-hooks/exhaustive-deps
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
  // on a phone a new pick brings its card back over an open drawer
  useEffect(() => {
    if (vp.compact && selected != null) setOpen(null)
  }, [selected, vp.compact])
  const world = () => (engine?.world?.mode === 'orbit' ? engine.world : null)
  const shown = selected ?? hover
  const el = shown ? element(shown) : null
  const tag = LANG_TAG[i18n.resolvedLanguage] ?? 'en'
  const toggle = id => setOpen(o => {
    if (o !== id) track('drawer', { id })
    return o === id ? null : id
  })
  // on a phone the card and a drawer would share the bottom: an open drawer hides the card (the cube
  // stays selected) until another pick, and the quiz names its own answers
  // the quiz as a duel in a room (src/net/duel.js): it takes the quiz's place
  const duelOn = useStore(store, s => s.duel)
  const duelLive = useStore(store, s => s.duelLive)
  const together = useStore(store, s => (s.room?.members?.length ?? 0) > 1)
  const inQuiz = quiz || !!duelOn
  const sheet = quiz || daily || huntsOpen // a sheet down the left side takes the dock's place
  const drawer = inQuiz || daily || huntsOpen ? null : open
  // (during today's lesson the card would tell the answers: its family, its state, its number; on a phone
  // the hunt's clue card and this one take turns, HuntCard.jsx)
  const cardUp = !!el && !daily && !(vp.compact && (inQuiz || drawer || huntsOpen || huntCardUp))
  // which sheet is open, for the clue card (it makes way on an upright phone, and for the hunts' own)
  const sheetName = huntsOpen ? 'hunts' : daily ? 'daily' : inQuiz ? 'quiz' : null
  useEffect(() => {
    store.set({ plazaSheet: sheetName })
  }, [sheetName])
  useEffect(() => () => store.set({ plazaSheet: null }), [])

  // what the drawer and the card cover moves the table's centre into the part left free
  const drawerRef = useRef(null)
  const cardRef = useRef(null)
  const dockRef = useRef(null)
  useCover(dockRef, 'bottom', vp.short && !sheet)
  // the dock's height: an upright phone's card stands on it (the dock wraps to two rows in some languages:
  // 2026-11-09, with today's element in Portuguese, the card covered its first row and the flame)
  const [dockH, setDockH] = useState(40)
  useLayoutEffect(() => {
    const el = dockRef.current
    if (!el) return undefined
    const set = () => setDockH(el.offsetHeight || 40)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sheet])
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
    ['trends', '📊', t('trends.title')],
  ].filter(Boolean)

  const openDaily = () => {
    track('dailyopen', { done: streak.doneToday, streak: streak.streak })
    duel.hide()
    setQuiz(false)
    setHuntsOpen(false)
    setOpen(null)
    setDaily(true)
  }
  const openHunts = () => {
    track('huntopen', { on: huntOn })
    duel.hide()
    setQuiz(false)
    setDaily(false)
    setOpen(null)
    setHuntsOpen(true)
  }

  return (
    <>
      {!vp.compact && !sheet && (
        <div className="absolute left-3 top-[calc(var(--bar)+0.25rem)]">
          <Search onPick={z => world()?.select(z)} />
        </div>
      )}

      {!sheet && (
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
          <div ref={dockRef} className="flex gap-1 sm:gap-1.5 flex-wrap">
            {/* today's element: the streak's flame, grey with a dot while today's lesson waits */}
            <button
              type="button"
              data-daily-open
              onClick={openDaily}
              className={`${DOCK} relative ${streak.doneToday ? 'border-amber-300/60' : ''}`}
              aria-label={`${t('daily.dock')}: ${t('daily.streak', { count: streak.streak })}`}
              title={t('daily.streak', { count: streak.streak })}
            >
              <Flame on={streak.doneToday} className="text-base leading-none" /> {streak.streak}
              {!vp.compact && <span className="ml-1 font-normal">{t('daily.dock')}</span>}
              {!streak.doneToday && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ew-wait" aria-hidden="true" />}
            </button>
            {/* (an icon alone on an upright phone, like the tools beside it: with today's element and the hunts
                in the dock, its words took the dock to two rows on a 360 px phone in every language) */}
            <button
              type="button"
              onClick={() => { track('quizopen'); duel.hide(); setDaily(false); setHuntsOpen(false); setQuiz(true) }}
              className={DOCK}
              aria-label={t('quiz.start')}
              title={t('quiz.start')}
            >
              ❓{!vp.narrow && <span> {t('quiz.start')}</span>}
            </button>
            {/* the treasure hunts: a dot while one is on */}
            <button type="button" data-hunts-open onClick={openHunts} className={`${DOCK} relative`} aria-label={t('hunts.title')} title={t('hunts.title')}>
              🗺️{!vp.compact && <span className="ml-1 font-normal">{t('hunts.dock')}</span>}
              {huntOn && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden="true" />}
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
      {daily && !duelOn && (
        <DailyHud
          select={z => world()?.select(z)}
          overview={() => world()?.overview?.()}
          enter={symbol => {
            const z = element(symbol)?.z
            if (!z) return
            if (store.get().selected !== z) world()?.select(z)
            world()?.enterSelected()
          }}
          onClose={() => {
            setDaily(false)
            world()?.select(null)
          }}
        />
      )}
      {huntsOpen && !duelOn && (
        <HuntHud
          select={z => world()?.select(z)}
          overview={() => world()?.overview?.()}
          onClose={() => {
            setHuntsOpen(false)
            world()?.select(null)
          }}
        />
      )}
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
          className={`absolute pointer-events-auto ${vp.compact ? (vp.portrait ? 'inset-x-2' : 'right-1.5 bottom-1.5') : 'right-3 bottom-3 sm:right-4 sm:bottom-4'}`}
          style={vp.compact ? (vp.portrait ? { bottom: `${8 + dockH + 6}px` } : { width: 'min(22rem, 40vw)' }) : undefined}
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
