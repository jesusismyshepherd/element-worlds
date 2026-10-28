/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { ELEMENTS, FAMILY, nameOf } from '../data/elements.js'
import { loadContent } from '../content/index.js'
import { makeQuestion, cluesFor, points } from '../game/quiz.js'
import { play } from '../audio/sound.js'
import { useCover, useViewport } from './layout.js'

const ROUND = 10
const BEST = 'ew-quiz-best'
// an element's name inside a sentence: lower case (helium, hélio, hel), but German nouns keep their capital
const CAPITAL_NOUNS = new Set(['de'])
const inSentence = (el, lang) => (CAPITAL_NOUNS.has(lang) ? nameOf(el, lang) : nameOf(el, lang).toLowerCase())

function readBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST) ?? '{}')
  } catch {
    return {}
  }
}

/** "Who am I?": ten mystery elements a round, told by clues; the plaza flies to each answer. It sits
 *  down the left side (across the top of an upright phone), and the table moves into the rest. */
export default function QuizHud({ select, overview, onClose }) {
  const { t, i18n } = useTranslation()
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const [round, setRound] = useState({ n: 0, score: 0, right: 0, asked: [] })
  const [q, setQ] = useState(null)
  const [shown, setShown] = useState(1)
  const [picked, setPicked] = useState(null)
  const [best, setBest] = useState(readBest)
  const { portrait } = useViewport()
  // the box is there from the start, so the first overview already fits the table beside it
  const box = useRef(null)
  useCover(box, portrait ? 'top' : 'left')

  const next = async (asked = round.asked) => {
    const nq = makeQuestion(level, Math.random, asked)
    const content = await loadContent(ELEMENTS[nq.answer - 1].symbol)
    setQ({ ...nq, content, level })
    setShown(1)
    setPicked(null)
    select(null)
    overview()
  }
  useEffect(() => {
    next([])
    // a change of level starts a new round (the elements asked about change)
  }, [level]) // eslint-disable-line react-hooks/exhaustive-deps

  const place = portrait
    ? { left: '0.5rem', right: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: '48vh' }
    : { left: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', width: 'min(24rem, 44vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }
  const frame = body => (
    <div ref={box} className="absolute glass rounded-2xl p-3 sm:p-4 pointer-events-auto shadow-2xl overflow-y-auto overscroll-contain" style={place}>
      {body}
    </div>
  )
  if (!q) return frame(<div className="font-display text-lg font-bold">❓ {t('quiz.title')}</div>)
  const el = ELEMENTS[q.answer - 1]
  const clues = cluesFor(q, q.content, lang, q.level, t(`families.${el.family}`))
  const done = picked != null
  const right = picked === q.answer
  const over = done && round.n >= ROUND
  const worth = points(shown, clues.length)

  const pick = z => {
    if (done) return
    setPicked(z)
    const ok = z === q.answer
    const gained = ok ? worth : 0
    const r = { n: round.n + 1, score: round.score + gained, right: round.right + (ok ? 1 : 0), asked: [...round.asked, q.answer] }
    setRound(r)
    play(ok ? 'celebrate' : 'part')
    select(q.answer)
    if (r.n >= ROUND && r.score > (best[q.level] ?? 0)) {
      const b = { ...best, [q.level]: r.score }
      setBest(b)
      try {
        localStorage.setItem(BEST, JSON.stringify(b))
      } catch {
        // storage blocked: the record lasts this visit
      }
    }
  }
  const again = () => {
    setRound({ n: 0, score: 0, right: 0, asked: [] })
    next([])
  }

  return frame(
      <>
        <div className="flex items-center gap-2">
          <div className="font-display text-lg font-bold whitespace-nowrap">❓ {t('quiz.title')}</div>
          <div className="text-xs opacity-80 ml-auto text-right">{t('quiz.progress', { n: Math.min(ROUND, round.n + (done ? 0 : 1)), of: ROUND })} · {t('quiz.score', { count: round.score })}</div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
        </div>

        <ol className="mt-2 space-y-1.5 text-[14px] leading-snug">
          {clues.slice(0, shown).map((c, i) => (
            <li key={i} className={`flex gap-2 ${i === shown - 1 && !done ? 'text-amber-100' : 'opacity-90'}`}>
              <span className="font-bold opacity-60">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
        {!done && shown < clues.length && (
          <button type="button" onClick={() => setShown(s => s + 1)} className="mt-2 text-xs font-bold rounded-lg px-2.5 py-1 bg-white/10 hover:bg-white/20">
            ＋ {t('quiz.clue')} <span className="opacity-70">({t('quiz.worth', { count: points(shown + 1, clues.length) })})</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          {q.options.map(z => {
            const e = ELEMENTS[z - 1]
            const color = FAMILY[e.family].color
            const state = !done ? '' : z === q.answer ? 'ring-2 ring-emerald-300 bg-emerald-400/20' : z === picked ? 'ring-2 ring-rose-400 bg-rose-500/20' : 'opacity-50'
            return (
              <button
                key={z}
                type="button"
                onClick={() => pick(z)}
                disabled={done}
                className={`rounded-xl px-3 py-2 text-left bg-white/5 hover:bg-white/10 transition flex items-center gap-2 ${state}`}
              >
                <span className="font-display text-2xl font-bold w-10 text-center" style={{ color }}>{e.symbol}</span>
                <span className="text-sm leading-tight">{nameOf(e, lang)}</span>
              </button>
            )
          })}
        </div>

        {!done && <div className="text-xs opacity-70 mt-2">{t('quiz.now', { count: worth })}</div>}
        {done && (
          <div className="mt-3">
            <div className={`font-bold ${right ? 'text-emerald-300' : 'text-rose-300'}`}>
              {right ? t('quiz.right', { count: worth }) : t('quiz.wrong', { name: inSentence(el, lang) })}
            </div>
            {over ? (
              <div className="mt-2">
                <div className="text-sm">{t('quiz.end', { score: round.score, right: round.right, of: ROUND })}</div>
                <div className="text-xs opacity-80">{t('quiz.best', { count: best[q.level] ?? round.score })}</div>
                <button type="button" onClick={again} className="mt-2 rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3 py-1.5 hover:bg-amber-300">{t('quiz.again')}</button>
              </div>
            ) : (
              <button type="button" onClick={() => next()} className="mt-2 rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3 py-1.5 hover:bg-amber-300">{t('quiz.next')} →</button>
            )}
          </div>
        )}
      </>,
  )
}
