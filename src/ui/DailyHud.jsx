/* eslint-disable react/prop-types */
// Today's element (game/daily.js; docs/knowledge/daily.md): a sheet down the left side (across the top of an
// upright phone), like "Who am I?". It opens on the streak and its week; the lesson finds the day's
// element in the table, asks three things about it and two about elements met before, then the ones
// missed once more; its end lights the flame and gives tomorrow's mystery element to guess and the way
// into the element's hall. The table behind flies to each answer and its Atomling pops up on the cube.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { ELEMENTS, FAMILY, cellOf, nameOf } from '../data/elements.js'
import { loadContent, contentCached } from '../content/index.js'
import { pick } from '../content/stations.js'
import { cluesFor, mask } from '../game/quiz.js'
import {
  weekOf, makeLesson, lessonNeeds, mysteryFor, finishLesson, guessMystery, metFrom, dueOn, isMilestone, streakOf, addDays, elementOfDay,
} from '../game/daily.js'
import { dailyState, keepDaily, foundKeys } from '../engine/progress.js'
import { valenceElectrons } from '../chem/atom.js'
import { temperature, density, num, config, LANG_TAG } from './format.js'
import { play } from '../audio/sound.js'
import { track } from '../net/telemetry.js'
import { useCover, useViewport } from './layout.js'
import { useDaily } from './useDaily.js'
import VerseLine from './VerseLine.jsx'

const STATE_ICON = { solid: '🧊', liquid: '💧', gas: '💨' }
const BTN = 'rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3.5 py-1.5 hover:bg-amber-300 active:scale-95 transition'
const SOFT = 'rounded-xl bg-white/10 font-bold text-sm px-3 py-1.5 hover:bg-white/20 active:scale-95 transition'
const el = z => ELEMENTS[z - 1]

/** The flame: lit when today's lesson is done, grey while it waits. */
export function Flame({ on, className = 'text-3xl' }) {
  return <span className={`inline-block ${className} ${on ? 'ew-flame' : 'grayscale opacity-60'}`} aria-hidden="true">🔥</span>
}

/** Monday to Sunday: a flame for a day done (a star for a perfect one), a snowflake for a day a freeze kept. */
export function Week({ days, today, tag }) {
  const fmt = new Intl.DateTimeFormat(tag, { weekday: 'narrow', timeZone: 'UTC' })
  const LOOK = {
    done: 'bg-amber-400/90 text-[#1a1030]',
    frozen: 'bg-sky-300/80 text-[#0b0f24]',
    missed: 'bg-white/5 text-white/40',
    today: 'ring-2 ring-amber-300/80 bg-white/10',
    coming: 'bg-white/5',
    none: 'bg-white/5',
  }
  return (
    <div className="flex gap-1.5" data-daily-week>
      {weekOf(days, today).map(d => (
        <div key={d.day} className="flex flex-col items-center gap-0.5 text-[10px]" data-state={d.state}>
          <span className={d.day === today ? 'font-bold text-amber-200' : 'opacity-60'}>{fmt.format(new Date(`${d.day}T12:00:00Z`))}</span>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${LOOK[d.state]} ${d.day === today && d.state === 'done' ? 'ring-2 ring-amber-200' : ''}`}>
            {d.state === 'done' ? (d.perfect ? '⭐' : '🔥') : d.state === 'frozen' ? '❄️' : d.state === 'missed' ? '·' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function Tile({ z, lang, small }) {
  const e = el(z)
  return (
    <span className="flex items-center gap-2 min-w-0">
      <span className={`font-display font-bold text-center shrink-0 ${small ? 'text-base w-7' : 'text-2xl w-10'}`} style={{ color: FAMILY[e.family].color }}>{e.symbol}</span>
      <span className="text-sm leading-tight truncate">{nameOf(e, lang)}</span>
    </span>
  )
}

/** Elements as small chips (the ones that miss you, the family, the ones woken up). */
function Chips({ list, lang, mark = '' }) {
  return (
    <span className="inline-flex flex-wrap gap-1 align-middle">
      {list.map(s => {
        const e = ELEMENTS.find(x => x.symbol === s)
        return (
          <span key={s} className="rounded-md px-1.5 py-0.5 text-[12px] font-bold bg-white/10" style={{ color: FAMILY[e.family].color }} title={nameOf(e, lang)}>
            {mark}{s}
          </span>
        )
      })}
    </span>
  )
}

/** The table to find an element in: every cell in its family's colour, with its symbol for the Explorer
 *  (the Scientist finds it by its place); a wrong cell shakes and says what it was. */
function MiniTable({ z, sci, found, wrong, glow, onTap }) {
  return (
    <div className="mt-2 grid gap-[2px] select-none" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }} data-daily-table>
      {ELEMENTS.map(e => {
        const { col, row } = cellOf(e)
        const color = FAMILY[e.family].color
        const hit = found && e.z === z
        const miss = wrong.includes(e.z)
        return (
          <button
            key={e.z}
            type="button"
            data-z={e.z}
            disabled={found}
            onClick={() => onTap(e.z)}
            aria-label={sci && !hit ? undefined : e.symbol}
            className={`aspect-square rounded-[3px] flex items-center justify-center font-bold leading-none text-[8px] min-[420px]:text-[9px] ${hit ? 'ew-pop' : ''} ${glow && e.z === z && !found ? 'animate-pulse ring-2 ring-white' : ''} ${miss ? 'ew-shake ring-1 ring-rose-400' : ''}`}
            style={{ gridColumn: col, gridRow: row, background: hit ? color : `${color}${sci ? '44' : '30'}`, color: hit ? '#0b0f24' : '#fff' }}
          >
            {sci && !hit ? '' : e.symbol}
          </button>
        )
      })}
      <div style={{ gridColumn: '1 / 19', gridRow: 8, height: 3 }} />
    </div>
  )
}

/** One of an element's uses (the i-th at the level), its name hidden. */
function useText(option, lang, level) {
  const [z, i] = option.split(':').map(Number)
  const list = pick(contentCached(el(z).symbol)?.uses, lang, level) ?? []
  return list.length ? mask(list[i % list.length], el(z), lang) : '?'
}

/** The clues of a "Who am I?" (the first two: a fact and a use, or what the data says). */
function cluesOf(step, lang, level, t) {
  const e = el(step.z)
  return cluesFor({ answer: step.z, seed: step.seed }, contentCached(e.symbol), lang, level, t(`families.${e.family}`)).slice(0, 2)
}

function optionLabel(step, o, { lang, level, t }) {
  switch (step.kind) {
    case 'state':
      return <span className="flex flex-col items-center"><span className="text-xl">{STATE_ICON[o]}</span>{t(`daily.opt.${o}`)}</span>
    case 'truth':
      return `${o === 'yes' ? '✓' : '✗'} ${t(`daily.opt.${o}`)}`
    case 'family':
      return (
        <span className="flex items-center gap-1.5 text-sm">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: FAMILY[o].color, boxShadow: `0 0 6px ${FAMILY[o].color}` }} />
          {t(`families.${o}`)}
        </span>
      )
    case 'protons':
      return <span className="font-display text-xl font-bold">{o}</span>
    case 'symbol':
      return <span className="font-display text-2xl font-bold">{o}</span>
    case 'use':
      return <span className="text-[13px] leading-snug">{useText(o, lang, level)}</span>
    case 'year':
      return <span className="text-sm">{t(`daily.opt.${o}`)}</span>
    case 'config':
      return <span className="text-[14px] tracking-wide">{config(el(o).config)}</span>
    default:
      return <Tile z={o} lang={lang} />
  }
}

const COLUMNS = { state: 'grid-cols-3', use: 'grid-cols-1', config: 'grid-cols-1' }

/** What the answer teaches, shown after it: the element's own words or what the data says. */
function Explain({ step, ctx, guess }) {
  const { lang, level, t, tag } = ctx
  const e = el(step.z)
  const words = contentCached(e.symbol)
  const text = key => pick(words?.[key], lang, level)
  const line = (s, k) => s && <p key={k} className="mt-1.5 text-[13px] leading-snug opacity-90">{s}</p>
  switch (step.kind) {
    case 'find': {
      const where = cellOf(e).row >= 9 ? t('daily.ex.foundF', { period: e.period }) : t('daily.ex.found', { period: e.period, group: e.group })
      if (!step.today) return line(where)
      return (
        <>
          {line(where)}
          <p className="mt-2 font-display font-bold text-amber-100">{t('daily.meet', { name: nameOf(e, lang) })}</p>
          {line(text('greeting'))}
          {guess != null && (
            <p className="mt-1.5 text-[13px] font-bold">{guess === e.z ? `✨ ${t('daily.guessRight')}` : t('daily.guessWrong', { name: nameOf(el(guess), lang) })}</p>
          )}
        </>
      )
    }
    case 'state':
      return line(text('stateNote'))
    case 'family': {
      const kin = ELEMENTS.filter(x => x.family === e.family)
        .sort((a, b) => Math.abs(a.period - e.period) + Math.abs((a.group ?? 3) - (e.group ?? 3)) - (Math.abs(b.period - e.period) + Math.abs((b.group ?? 3) - (e.group ?? 3))))
        .slice(0, 10)
        .sort((a, b) => a.z - b.z)
      return (
        <p className="mt-1.5 text-[13px] leading-snug">
          <span className="opacity-90">{t('daily.ex.family')} {t(`families.${e.family}`)} </span>
          <Chips list={kin.map(x => x.symbol)} lang={lang} />
        </p>
      )
    }
    case 'protons':
      return line(t('daily.ex.protons', { z: e.z }))
    case 'symbol':
      return line(text('nameOrigin'))
    case 'truth':
      if (step.fact === 'dense') return line(t('daily.ex.dense', { d: density(e, tag) }))
      if (step.fact === 'metal') return line(`${t('daily.ex.family')} ${t(`families.${e.family}`)}`)
      return line(text(step.fact === 'radio' ? 'isotopes' : 'discovery'))
    case 'year':
      return line(text('discovery'))
    case 'config':
      return line(t('daily.ex.valence', { n: valenceElectrons(e) }))
    case 'compare': {
      const [a, b] = step.options.map(el)
      const v = { mass: x => x.mass, melt: x => x.melt, en: x => x.en, radius: x => x.radius.atomic, density: x => x.density }[step.what]
      const show = {
        mass: x => `${num(x.mass, tag, 4)} u`,
        melt: x => temperature(x.melt, level, tag),
        en: x => num(x.en, tag, 3),
        radius: x => `${x.radius.atomic} pm`,
        density: x => density(x, tag),
      }[step.what]
      const [lo, hi] = a.z < b.z ? [a, b] : [b, a]
      // the rule of thumb, said only where this pair keeps it
      let rule = null
      if (step.what === 'mass') rule = v(hi) > v(lo) ? t('daily.ex.massUsual') : t('daily.ex.massOdd')
      if (step.what === 'radius') rule = lo.period === hi.period ? v(lo) > v(hi) && t('daily.ex.radiusRow') : v(hi) > v(lo) && t('daily.ex.radiusCol')
      if (step.what === 'en') rule = lo.period === hi.period ? v(hi) > v(lo) && t('daily.ex.enRow') : v(lo) > v(hi) && t('daily.ex.enCol')
      return (
        <>
          {line(`${nameOf(a, lang)}: ${show(a)} · ${nameOf(b, lang)}: ${show(b)}`, 'v')}
          {line(rule, 'r')}
        </>
      )
    }
    default:
      return null
  }
}

/** The question's words. */
function promptOf(step, { lang, level, t }) {
  const e = el(step.z)
  const name = nameOf(e, lang)
  const depth = level === 'scientist' ? 'sci' : 'kid'
  if (step.kind === 'find') return t(`daily.q.${step.today ? 'find' : 'findAgain'}.${depth}`, { name, symbol: e.symbol })
  if (step.kind === 'truth') return t(`daily.q.truth.${step.fact}`, { name })
  if (step.kind === 'compare') return t(`daily.q.compare.${step.what}`)
  if (step.kind === 'who') return t('daily.q.who')
  return t(`daily.q.${step.kind}`, { name })
}

/** Tomorrow's mystery element: two clues and four to choose from; the guess is kept for tomorrow. */
function Mystery({ ctx, state, today }) {
  const { lang, level, t } = ctx
  const m = mysteryFor(today, level)
  const [, redraw] = useState(0)
  const symbol = el(m.z).symbol
  useEffect(() => {
    if (!contentCached(symbol)) loadContent(symbol).then(() => redraw(n => n + 1))
  }, [symbol])
  const kept = state.guess[m.day]
  const clues = cluesFor({ answer: m.z, seed: m.seed }, contentCached(symbol), lang, level, t(`families.${el(m.z).family}`)).slice(0, 2)
  const guess = z => {
    keepDaily(guessMystery(dailyState(), m.day, z))
    play('select')
    track('daily', { op: 'guess', z })
  }
  return (
    <div className="mt-3 rounded-xl bg-white/5 p-2.5" data-daily-mystery>
      <div className="font-display font-bold">🔮 {t('daily.mystery')}</div>
      <ol className="mt-1 space-y-1 text-[13px] leading-snug">
        {clues.map((c, i) => (
          <li key={i} className="flex gap-2"><span className="font-bold opacity-60">{i + 1}.</span><span>{c}</span></li>
        ))}
      </ol>
      {kept ? (
        <div className="mt-2 text-sm font-bold text-amber-100">{t('daily.mysteryKept', { name: nameOf(el(kept), lang) })}</div>
      ) : (
        <>
          <div className="mt-2 text-xs opacity-80">{t('daily.mysteryAsk')}</div>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            {m.options.map(z => (
              <button key={z} type="button" data-guess={z} onClick={() => guess(z)} className="rounded-xl px-2.5 py-1.5 text-left bg-white/5 hover:bg-white/10 transition">
                <Tile z={z} lang={lang} small />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * The sheet. select(z) flies the table to an element (its Atomling pops up), overview() shows the whole
 * table, enter(symbol) walks into an element's hall, onClose() closes the sheet.
 */
export default function DailyHud({ select, overview, enter, onClose }) {
  const { t, i18n } = useTranslation()
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const tag = LANG_TAG[lang] ?? 'en'
  const ctx = { lang, level, t, tag }
  const { state, today, streak } = useDaily()
  const { portrait } = useViewport()
  const box = useRef(null)
  useCover(box, portrait ? 'top' : 'left')
  const feedback = useRef(null)

  const [phase, setPhase] = useState('start') // start, lesson, done
  const [lesson, setLesson] = useState(null)
  const [queue, setQueue] = useState([])
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])
  const [results, setResults] = useState({})
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // opened: the whole table beside the sheet (the cover is reported by now: useCover measures in a layout effect)
  useEffect(() => {
    select(null)
    overview()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // a new level starts again (the questions are another depth's)
  const firstLevel = useRef(level)
  useEffect(() => {
    if (level === firstLevel.current) return
    firstLevel.current = level
    setPhase('start')
    setLesson(null)
  }, [level])

  const step = phase === 'lesson' && lesson ? lesson.steps[queue[pos]] : null
  const again = !!step && queue.indexOf(step.id) < pos
  const done = step && (step.kind === 'find' ? picked === step.z : picked != null)

  // the table at each step: the whole of it while the element is to be found or named, or while its cube
  // up close would tell the answer (its symbol, its number, its family's glow); else the element
  useEffect(() => {
    if (!step) return
    const hidden = step.review || ['find', 'who', 'compare', 'symbol', 'protons', 'family'].includes(step.kind)
    if (hidden) {
      select(null)
      overview()
    } else if (store.get().selected !== step.z) select(step.z)
  }, [step?.id, pos, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (done) feedback.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
  }, [done])

  const begin = async practice => {
    if (loading) return
    setLoading(true)
    try {
      const kept = dailyState()
      const met = [...metFrom(foundKeys()), ...Object.values(kept.days).map(d => d.s)]
      const args = { day: today, level, boxes: kept.boxes, met, practice }
      // (a word file that does not come only leaves out the question that needed it)
      await Promise.all(lessonNeeds(args).map(s => loadContent(s).catch(() => null)))
      const l = makeLesson({ ...args, lang, contentOf: contentCached })
      setLesson(l)
      setQueue(l.steps.map(s => s.id))
      setPos(0)
      setPicked(null)
      setWrong([])
      setResults({})
      setSummary(null)
      setPhase('lesson')
      track('daily', { op: 'start', s: l.symbol, practice })
    } finally {
      setLoading(false)
    }
  }

  /** The first answer to each step counts; one missed comes back once at the end. */
  const record = ok => {
    if (step.id in results) return
    setResults(r => ({ ...r, [step.id]: { about: el(step.z).symbol, ok } }))
    // (the opening find is the day's welcome: it does not come back)
    if (!ok && !(step.today && step.kind === 'find')) setQueue(q => [...q, step.id])
    track('daily', { op: 'q', k: step.kind, z: step.z, ok, n: pos })
  }

  const answer = o => {
    if (!step || done) return
    const ok = o === step.answer
    setPicked(o)
    record(ok)
    play(ok ? 'right' : 'wrong')
    const show = step.kind === 'compare' || step.kind === 'who' ? step.answer : step.z
    if (store.get().selected !== show) select(show)
  }

  const tap = z => {
    if (!step || done) return
    if (z === step.z) {
      setPicked(z)
      record(wrong.length === 0)
      play('right')
      select(z)
    } else {
      setWrong(w => [...w.filter(x => x !== z), z])
      play('wrong')
    }
  }

  const finish = () => {
    const kept = dailyState()
    const before = streakOf(kept.days, today)
    const list = Object.values(results)
    const after = finishLesson(kept, { day: today, symbol: lesson.symbol, results: list, practice: lesson.practice })
    keepDaily(after)
    const now = streakOf(after.days, today)
    const right = list.filter(r => r.ok).length
    const counted = !lesson.practice && !before.doneToday
    const milestone = counted && isMilestone(now.streak)
    setSummary({
      practice: lesson.practice,
      counted,
      streak: now.streak,
      milestone,
      // (once: the day a streak passes the best of an earlier one)
      record: counted && before.best > before.streak && now.streak === before.best + 1,
      earned: counted && now.freezes > before.freezes,
      right,
      of: list.length,
      awake: lesson.reviews.filter(s => list.filter(r => r.about === s).every(r => r.ok)),
    })
    play(counted ? 'streak' : 'celebrate', { order: milestone ? 2 : 1 })
    track('daily', { op: 'done', s: lesson.symbol, r: right, n: list.length, streak: now.streak, practice: lesson.practice })
    select(lesson.z)
    setPhase('done')
  }

  const next = () => {
    if (!done) return
    if (pos + 1 < queue.length) {
      setPos(p => p + 1)
      setPicked(null)
      setWrong([])
    } else finish()
  }

  // keys: 1 to 4 pick, Enter or space goes on
  useEffect(() => {
    if (!step) return undefined
    const onKey = e => {
      if (e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)) return
      if (done && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        next()
      } else if (!done && step.options && /^[1-9]$/.test(e.key) && step.options[Number(e.key) - 1] !== undefined) answer(step.options[Number(e.key) - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const place = portrait
    ? { left: '0.5rem', right: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: '48vh' }
    : { left: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', width: 'min(26rem, 46vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }

  const header = (
    <div className="flex items-center gap-2">
      <div className="font-display text-lg font-bold whitespace-nowrap truncate">🔥 {lesson?.practice && phase !== 'start' ? t('daily.practiceTitle') : t('daily.title')}</div>
      {step && (
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden ml-1" aria-hidden="true">
          <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.round(((pos + (done ? 1 : 0)) / queue.length) * 100)}%` }} />
        </div>
      )}
      <button type="button" onClick={onClose} className="ml-auto rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
    </div>
  )

  const todays = elementOfDay(today)
  const sleepy = dueOn(state.boxes, today).filter(s => s !== todays && s !== elementOfDay(addDays(today, 1))).slice(0, 6)
  const recentLoss = streak.lost && streak.streak === 0 && streak.lost.on >= addDays(today, -7)

  let body
  if (phase === 'start' || !lesson) {
    body = (
      <>
        <div className="mt-2 flex items-center gap-3">
          <Flame on={streak.doneToday} className="text-5xl" />
          <div className="min-w-0">
            <div className="font-display text-3xl font-bold leading-none" data-daily-streak>{streak.streak}</div>
            <div className="text-sm opacity-90">{t('daily.streak', { count: streak.streak })}</div>
            {streak.best > streak.streak && <div className="text-xs opacity-70">{t('daily.best', { count: streak.best })}</div>}
          </div>
        </div>
        <div className="mt-2"><Week days={state.days} today={today} tag={tag} /></div>
        <div className="mt-2 text-xs opacity-85" title={t('daily.freezeHelp')}>
          ❄️ {streak.freezes ? t('daily.freezes', { count: streak.freezes }) : t('daily.noFreezes')}
          <span className="block opacity-70">{t('daily.freezeHelp')}</span>
        </div>
        {recentLoss && <div className="mt-2 text-sm">{t('daily.lost', { count: streak.lost.n })}</div>}
        {!streak.doneToday ? (
          <>
            {streak.streak > 0 && <div className="mt-2 text-sm font-bold text-amber-100">{t('daily.keep')}</div>}
            {!streak.streak && !recentLoss && <div className="mt-2 text-sm font-bold text-amber-100">{t('daily.noStreak')}</div>}
            <div className="mt-1 text-sm opacity-90">{t('daily.waiting')}</div>
            {state.guess[today] && <div className="mt-1 text-sm">🔮 {t('daily.yourGuess', { name: nameOf(el(state.guess[today]), lang) })}</div>}
            {sleepy.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="opacity-85">{t('daily.sleepy')} </span>
                <Chips list={sleepy} lang={lang} mark="😴 " />
              </div>
            )}
            <button type="button" data-daily-begin onClick={() => begin(false)} className={`${BTN} mt-3 w-full text-base py-2`} disabled={loading}>
              ▶ {t('daily.start')}
            </button>
          </>
        ) : (
          <>
            <div className="mt-2 text-sm font-bold text-emerald-200">✓ {t('daily.doneToday')}</div>
            <Mystery ctx={ctx} state={state} today={today} />
            <div className="flex flex-wrap gap-2 mt-3">
              <button type="button" data-daily-visit onClick={() => enter(todays)} className={BTN}>🏛 {t('daily.visit', { name: nameOf(ELEMENTS.find(e => e.symbol === todays), lang) })}</button>
              <button type="button" data-daily-practice onClick={() => begin(true)} className={SOFT} disabled={loading}>{t('daily.practice')}</button>
            </div>
          </>
        )}
      </>
    )
  } else if (phase === 'lesson' && step) {
    const right = done && (step.kind === 'find' ? !wrong.length : picked === step.answer)
    body = (
      <div data-daily-step={step.kind} data-answer={String(step.answer)}>
        {again && <div className="mt-2 inline-block rounded-md bg-amber-300/20 text-amber-100 text-[11px] font-bold px-2 py-0.5">↻ {t('daily.again')}</div>}
        <div className="mt-2 text-[15px] leading-snug font-bold">{promptOf(step, ctx)}</div>
        {step.kind === 'who' && (
          <ol className="mt-1.5 space-y-1 text-[14px] leading-snug">
            {cluesOf(step, lang, level, t).map((c, i) => (
              <li key={i} className="flex gap-2"><span className="font-bold opacity-60">{i + 1}.</span><span>{c}</span></li>
            ))}
          </ol>
        )}
        {step.kind === 'find' ? (
          <>
            <MiniTable z={step.z} sci={level === 'scientist'} found={done} wrong={wrong} glow={wrong.length >= (level === 'scientist' ? 3 : 2)} onTap={tap} />
            {!done && wrong.length > 0 && (
              <div className="mt-1.5 text-[13px]">
                <span className="text-rose-300 font-bold">✗ {el(wrong.at(-1)).symbol} · {nameOf(el(wrong.at(-1)), lang)}</span>
                <span className="opacity-85"> {wrong.length >= (level === 'scientist' ? 3 : 2) ? t('daily.glows') : t('daily.tryAgain')}</span>
              </div>
            )}
          </>
        ) : (
          <div className={`grid ${COLUMNS[step.kind] ?? 'grid-cols-2'} gap-2 mt-3`}>
            {step.options.map((o, i) => {
              const look = !done ? '' : o === step.answer ? 'ring-2 ring-emerald-300 bg-emerald-400/20' : o === picked ? 'ring-2 ring-rose-400 bg-rose-500/20' : 'opacity-45'
              return (
                <button
                  key={String(o)}
                  type="button"
                  data-option={String(o)}
                  onClick={() => answer(o)}
                  disabled={done}
                  className={`rounded-xl px-3 py-2 text-left bg-white/5 hover:bg-white/10 transition min-w-0 ${step.kind === 'state' ? 'text-center' : ''} ${look}`}
                  title={`${i + 1}`}
                >
                  {optionLabel(step, o, ctx)}
                </button>
              )
            })}
          </div>
        )}
        {done && (
          <div ref={feedback} className="mt-3">
            {!(step.today && step.kind === 'find') && (
              <div className={`font-bold ${right ? 'text-emerald-300' : 'text-rose-300'}`}>{right ? `✓ ${t('daily.right')}` : `✗ ${t('daily.wrong')}`}</div>
            )}
            <Explain step={step} ctx={ctx} guess={step.today && step.kind === 'find' ? state.guess[today] ?? null : null} />
            <button type="button" data-daily-next onClick={next} className={`${BTN} mt-3`}>{t('daily.next')} →</button>
          </div>
        )}
      </div>
    )
  } else if (phase === 'done' && summary) {
    body = (
      <div data-daily-done>
        <div className="mt-2 font-display text-xl font-bold">{summary.practice ? t('daily.practiceDone') : t('daily.finished')}</div>
        {!summary.practice && (
          <div className="mt-2 flex items-center gap-3">
            <Flame on className="text-5xl ew-pop" />
            <div className="min-w-0">
              <div className="font-display text-4xl font-bold leading-none ew-pop text-amber-200" data-daily-streak>{summary.streak}</div>
              <div className="text-sm">{t('daily.streak', { count: summary.streak })}</div>
            </div>
          </div>
        )}
        {summary.milestone && <div className="mt-2 font-bold text-amber-200">🎉 {t('daily.milestone', { n: summary.streak })}</div>}
        {summary.record && <div className="mt-1 font-bold text-amber-200">🏆 {t('daily.newRecord')}</div>}
        <div className="mt-2 text-sm">{t('daily.score', { right: summary.right, of: summary.of })}</div>
        {summary.right === summary.of && summary.of > 0 && <div className="text-sm font-bold text-emerald-200">⭐ {t('daily.perfect')}</div>}
        {summary.earned && <div className="mt-1 text-sm font-bold text-sky-200">❄️ {t('daily.earned')}</div>}
        {summary.awake.length > 0 && (
          <div className="mt-1.5 text-sm">
            <span className="opacity-85">{t('daily.awake')} </span>
            <Chips list={summary.awake} lang={lang} mark="😊 " />
          </div>
        )}
        {!summary.practice && <div className="mt-2"><Week days={state.days} today={today} tag={tag} /></div>}
        <Mystery ctx={ctx} state={state} today={today} />
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" data-daily-visit onClick={() => enter(lesson.symbol)} className={BTN}>🏛 {t('daily.visit', { name: nameOf(el(lesson.z), lang) })}</button>
          <button type="button" data-daily-practice onClick={() => begin(true)} className={SOFT} disabled={loading}>{t('daily.practice')}</button>
        </div>
        {/* every morning is new (src/content/scripture/) */}
        <VerseLine id="daily" className="mt-3 text-[13px]" />
      </div>
    )
  }

  return (
    <div ref={box} data-daily className="absolute glass rounded-2xl p-3 sm:p-4 pointer-events-auto shadow-2xl overflow-y-auto overscroll-contain" style={place}>
      {header}
      {body}
    </div>
  )
}
