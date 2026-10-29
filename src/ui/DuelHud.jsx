/* eslint-disable react/prop-types */
// The quiz duel's window on the plaza (the rules: src/game/duel.js; the room link: src/net/duel.js).
// Two seats with names, colours and scores; the clues in my language as they come; the four answers
// (for the two seated); the answer and who got it; under it, who watches and who waits, and what I can
// do: take a free seat, wait in line, ask a seated player to swap, give my seat, answer a swap request.
// Where the solo quiz is (down the left; across the top of an upright phone).
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { ELEMENTS, FAMILY, nameOf } from '../data/elements.js'
import { loadContent } from '../content/index.js'
import { cluesFor, points } from '../game/quiz.js'
import { duel } from '../net/duel.js'
import { room } from '../net/room.js'
import { ROUNDS, CLUE_MS } from '../game/duel.js'
import { useCover, useViewport } from './layout.js'
import { play } from '../audio/sound.js'

// (a coloured button takes BASE, not BTN: with two background classes on one button the wrong one won)
const BASE = 'rounded-lg px-2.5 py-1 text-xs font-bold active:scale-95 transition'
const BTN = `${BASE} bg-white/10 hover:bg-white/20`
const CAPITAL_NOUNS = new Set(['de'])

export default function DuelHud({ select, overview }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const s = useStore(store, x => x.duel)
  const info = useStore(store, x => x.room)
  const { portrait } = useViewport()
  const box = useRef(null)
  useCover(box, portrait ? 'top' : 'left')
  const [clues, setClues] = useState([])
  const [now, setNow] = useState(Date.now())
  const me = info?.me
  const members = info?.members ?? []
  const who = id => members.find(m => m.id === id)
  const nameOfId = id => who(id)?.name ?? '…'

  // the clues in my language, for the question on show
  const qKey = s?.q ? `${s.q.answer}-${s.q.seed}` : null
  useEffect(() => {
    if (!s?.q) return setClues([])
    let live = true
    const el = ELEMENTS[s.q.answer - 1]
    loadContent(el.symbol).then(content => live && setClues(cluesFor(s.q, content, lang, s.level, t(`families.${el.family}`))))
    select(null)
    overview()
    return () => {
      live = false
    }
  }, [qKey, lang]) // eslint-disable-line react-hooks/exhaustive-deps
  // the answer shown: the plaza flies to it, with a sound for the one who got it
  useEffect(() => {
    if (s?.phase !== 'reveal' || !s.q) return
    select(s.q.answer)
    play(s.winner === me ? 'celebrate' : s.winner ? 'tap' : 'part')
  }, [s?.phase, qKey]) // eslint-disable-line react-hooks/exhaustive-deps
  // the countdown to the next clue
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  if (!s) return null
  const mySeat = s.seats.indexOf(me)
  const inLine = s.line.includes(me)
  const el = s.q ? ELEMENTS[s.q.answer - 1] : null
  const shownClues = clues.slice(0, Math.max(1, Math.min(s.shown, clues.length)))
  const myAnswer = s.answers?.[me]
  const canPick = s.phase === 'asking' && mySeat >= 0 && myAnswer == null
  const worth = s.total ? points(s.shown, s.total) : 0
  const nextIn = s.phase === 'asking' && s.shown < s.total ? Math.max(0, Math.ceil((CLUE_MS - (now - s.since)) / 1000)) : null
  const watchers = members.filter(m => !s.seats.includes(m.id) && !s.line.includes(m.id))
  const askForMe = s.ask && s.seats[s.ask.seat] === me
  const place = portrait
    ? { left: '0.5rem', right: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: '52vh' }
    : { left: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', width: 'min(24rem, 44vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }
  const inSentence = e => (CAPITAL_NOUNS.has(lang) ? nameOf(e, lang) : nameOf(e, lang).toLowerCase())

  return (
    <div ref={box} data-duel className="absolute glass rounded-2xl p-3 sm:p-4 pointer-events-auto shadow-2xl overflow-y-auto overscroll-contain" style={place}>
      <div className="flex items-center gap-2">
        <div className="font-display text-lg font-bold whitespace-nowrap">⚔️ {t('duel.title')}</div>
        {s.round > 0 && <div className="text-xs opacity-80 ml-auto">{t('duel.round', { n: s.round, of: ROUNDS })}</div>}
        <button type="button" onClick={() => (duel.mine() ? duel.end() : duel.hide())} className="rounded-lg px-2 py-0.5 text-sm hover:bg-white/10 ml-auto" aria-label={t('hud.close')} title={duel.mine() ? t('duel.end') : t('hud.close')}>✕</button>
      </div>

      {/* the two seats */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {s.seats.map((id, k) => {
          const m = id && who(id)
          const answered = id && s.answers?.[id] != null
          const right = answered && s.answers[id] === s.q?.answer
          return (
            <div key={k} data-duel-seat={k} className="rounded-xl bg-white/5 px-2.5 py-2 min-w-0" style={{ boxShadow: m ? `inset 0 0 0 2px ${m.color}aa` : undefined }}>
              {id ? (
                <>
                  <div className="font-bold truncate text-sm" style={{ color: m?.color }}>
                    {nameOfId(id)}{id === me && <span className="opacity-60 font-normal"> ({t('room.you')})</span>}
                  </div>
                  <div className="font-display text-2xl font-bold leading-none mt-0.5">
                    {s.scores?.[id] ?? 0}
                    {answered && <span className={`text-base ml-1 ${right ? 'text-emerald-300' : 'text-rose-300'}`}>{right ? '✓' : '✗'}</span>}
                  </div>
                  {mySeat < 0 && !s.ask && (
                    <button type="button" data-duel-ask={k} onClick={() => duel.do({ t: 'ask', seat: k })} className={`${BTN} mt-1.5`}>{t('duel.swapWith', { name: nameOfId(id) })}</button>
                  )}
                </>
              ) : (
                <>
                  <div className="text-sm opacity-75">{t('duel.freeSeat')}</div>
                  {mySeat < 0 && <button type="button" data-duel-sit={k} onClick={() => duel.do({ t: 'sit', seat: k })} className={`${BASE} mt-1.5 bg-emerald-300 text-[#0b0f24] hover:bg-emerald-200`}>{t('duel.sit')}</button>}
                </>
              )}
            </div>
          )
        })}
      </div>

      {askForMe && (
        <div data-duel-asked className="mt-2 rounded-xl bg-amber-300/15 px-2.5 py-2 text-sm">
          <div className="font-bold">{t('duel.asks', { name: nameOfId(s.ask.from) })}</div>
          <div className="flex gap-1.5 mt-1.5">
            <button type="button" data-duel-let onClick={() => duel.do({ t: 'answer', yes: true })} className={`${BASE} bg-amber-300 text-[#0b0f24] hover:bg-amber-200`}>{t('duel.letThem')}</button>
            <button type="button" onClick={() => duel.do({ t: 'answer', yes: false })} className={BTN}>{t('duel.keep')}</button>
          </div>
        </div>
      )}
      {s.ask && s.ask.from === me && <div className="mt-2 text-xs opacity-80">{t('duel.asked', { name: nameOfId(s.seats[s.ask.seat]) })}</div>}

      {/* the question */}
      {s.phase === 'waiting' && <div className="mt-3 text-sm opacity-85">{s.seats.every(Boolean) ? t('duel.starting') : t('duel.waiting')}</div>}
      {s.q && (s.phase === 'asking' || s.phase === 'reveal') && (
        <>
          <ol className="mt-2 space-y-1.5 text-[14px] leading-snug">
            {shownClues.map((c, i) => (
              <li key={i} className={`flex gap-2 ${i === shownClues.length - 1 && s.phase === 'asking' ? 'text-amber-100' : 'opacity-90'}`}>
                <span className="font-bold opacity-60">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
          {s.phase === 'asking' && (
            <div className="text-xs opacity-70 mt-1.5">
              {t('quiz.now', { count: worth })}{nextIn != null && <span> · ＋ {nextIn}s</span>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {s.q.options.map(z => {
              const e = ELEMENTS[z - 1]
              const color = FAMILY[e.family].color
              const reveal = s.phase === 'reveal'
              const mine = myAnswer === z
              const look = reveal ? (z === s.q.answer ? 'ring-2 ring-emerald-300 bg-emerald-400/20' : mine ? 'ring-2 ring-rose-400 bg-rose-500/20' : 'opacity-50') : mine ? 'ring-2 ring-rose-400 bg-rose-500/20' : ''
              return (
                <button
                  key={z}
                  type="button"
                  data-duel-option={z}
                  onClick={() => canPick && duel.do({ t: 'pick', z })}
                  disabled={!canPick}
                  className={`rounded-xl px-3 py-2 text-left bg-white/5 transition flex items-center gap-2 ${canPick ? 'hover:bg-white/10' : 'cursor-default'} ${look}`}
                >
                  <span className="font-display text-2xl font-bold w-10 text-center" style={{ color }}>{e.symbol}</span>
                  <span className="text-sm leading-tight">{nameOf(e, lang)}</span>
                </button>
              )
            })}
          </div>
          {mySeat >= 0 && myAnswer != null && myAnswer !== s.q.answer && s.phase === 'asking' && <div className="text-xs text-rose-300 mt-1.5">{t('duel.locked')}</div>}
          {s.phase === 'reveal' && (
            <div data-duel-result className={`mt-2 font-bold ${s.winner ? 'text-emerald-300' : 'text-rose-300'}`}>
              {s.winner ? t('duel.gotIt', { name: nameOfId(s.winner), count: points(Math.max(1, s.shown), s.total) }) : t('duel.nobody', { name: inSentence(el) })}
            </div>
          )}
        </>
      )}
      {s.phase === 'over' && (
        <div className="mt-3">
          <div data-duel-over className="font-display text-xl font-bold text-amber-300">{s.winner ? t('duel.wins', { name: nameOfId(s.winner) }) : t('duel.draw')}</div>
          {duel.mine() && <button type="button" data-duel-again onClick={() => duel.do({ t: 'again' })} className="mt-2 rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3 py-1.5 hover:bg-amber-300">{t('duel.again')}</button>}
        </div>
      )}

      {/* who watches, who waits, and what I can do */}
      <div className="mt-3 pt-2 border-t border-white/10 text-xs flex flex-col gap-1.5">
        {s.line.length > 0 && (
          <div>
            <span className="opacity-70">{t('duel.line')}: </span>
            {s.line.map((id, i) => <span key={id} style={{ color: who(id)?.color }}>{i ? ', ' : ''}{i + 1}. {nameOfId(id)}</span>)}
          </div>
        )}
        {watchers.length > 0 && (
          <div>
            <span className="opacity-70">{t('duel.watching')}: </span>
            {watchers.map((m, i) => <span key={m.id} style={{ color: m.color }}>{i ? ', ' : ''}{m.name}</span>)}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {mySeat < 0 && !inLine && <button type="button" data-duel-line onClick={() => duel.do({ t: 'line' })} className={BTN}>🙋 {t('duel.wantToPlay')}</button>}
          {inLine && <button type="button" onClick={() => duel.do({ t: 'unline' })} className={BTN}>{t('duel.leaveLine')}</button>}
          {mySeat >= 0 && <button type="button" data-duel-give onClick={() => duel.do({ t: 'give' })} className={BTN}>{t('duel.give')}</button>}
        </div>
      </div>
    </div>
  )
}
