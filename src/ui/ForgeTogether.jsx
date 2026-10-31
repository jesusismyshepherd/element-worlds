/* eslint-disable react/prop-types */
// The Atom Forge in a room (docs/knowledge/atom-forge.md, "Together"; docs/knowledge/multiplayer.md):
// the line of who builds with me and what each has just done, the race's picker (one of the missions)
// and its board (each racer's atom and how far they are toward the goal: protons, neutrons, electrons,
// then what to do with it), with what I can do (join, watch, race again, back to building together).
// Pieces placed by ForgeHud.jsx in its columns, at the edges like the rest.
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { race } from '../net/race.js'
import { nuclideSymbol } from '../chem/nucleus.js'
import { isotopeName, BEAM_NAMES, BEAM_SYMBOLS } from '../worlds/forge/words.js'
import { RACES, progress } from '../worlds/forge/goals.js'
import { standings } from '../game/race.js'

const DOT = { p: '#ff5a55', n: '#b9c6dc', e: '#a8ecff' }
const BTN = 'rounded-lg px-2.5 py-1 text-xs font-bold active:scale-95 transition'

/** m:ss */
const clockText = ms => {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** What one of the others just did, in words. */
function feedText(x, t, lang) {
  if (x.k) return `${x.n > 0 ? '+' : '−'}${t(`forge.feed.${x.k}`, { count: Math.abs(x.n) })}`
  if (x.t === 'decay') return `⏩ ${t('forge.decay')}`
  if (x.t === 'fire') return `🚀 ${BEAM_NAMES[lang]?.[x.beam] ?? BEAM_NAMES.en[x.beam] ?? x.beam}`
  if (x.t === 'neutral') return t('forge.neutral')
  if (x.t === 'hold') return `🧲 ${x.h ? t('forge.hold') : t('forge.feed.release')}`
  if (!x.Z && !x.N) return t('forge.clear')
  return x.Z ? isotopeName(x.Z, x.N, lang) : t('forge.neutronsAlone', { count: x.N })
}

/** Who builds with me and what they have just done; the race button. */
export function Together({ f, onRace, picking, compact = false, button = true }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const live = useStore(store, s => s.forgeRace)
  const tg = f.together
  if (!tg) return null
  return (
    <div data-forge-together className={`glass rounded-2xl pointer-events-auto ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-xs font-bold`}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 truncate">
          {tg.peers.length > 0 ? (
            <>
              👥 {t('room.labTogether', { names: '' })}
              {tg.peers.map((m, i) => (
                <span key={m.id} style={{ color: m.color }}>{i ? ', ' : ''}{m.name}</span>
              ))}
            </>
          ) : (
            <span className="opacity-75">👥 {t('room.alone')}</span>
          )}
        </div>
        {!live && button && (
          <button type="button" data-race-open onClick={onRace} className={`${BTN} shrink-0 ${picking ? 'bg-amber-400 text-[#1a1030]' : 'bg-white/15 hover:bg-white/25'}`}>
            🏁 {t('forge.race.button')}
          </button>
        )}
      </div>
      {tg.feed.length > 0 && (
        <ul data-forge-feed className="mt-0.5 space-y-0.5">
          {tg.feed.slice(compact ? -1 : -3).map(x => (
            <li key={x.id} className="truncate font-normal">
              <span className="font-bold" style={{ color: x.color }}>{x.name}</span>: {feedText(x, t, lang)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** The missions to race to: one tap starts it for everyone in the forge. */
export function RacePicker({ onClose, className = '' }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  return (
    <div data-race-picker className={`glass rounded-2xl p-2.5 pointer-events-auto overflow-y-auto overscroll-contain ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-display font-bold text-sm">🏁 {t('forge.race.pick')}</div>
        <button type="button" onClick={onClose} className="rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
      </div>
      <div className="text-xs opacity-80 my-1">{t('forge.race.pickHint')}</div>
      <ul className="space-y-0.5 text-[13px]">
        {RACES.map(m => (
          <li key={m.id}>
            <button
              type="button"
              data-race-goal={m.id}
              onClick={() => {
                race.start(m.id)
                onClose()
              }}
              className="w-full text-left rounded px-1.5 py-0.5 hover:bg-amber-400/25 truncate"
            >
              {m.name[lang] ?? m.name.en}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** What a racer still needs: a dot for each kind with how many to add (or take away), then the step. */
function Needs({ need, then, built, hold }) {
  const chips = Object.entries(need).filter(([, n]) => n !== 0)
  return (
    <span className="flex items-center gap-1.5 tabular-nums">
      {!built && chips.map(([k, n]) => (
        <span key={k} className="flex items-center gap-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: DOT[k] }} />
          {n > 0 ? `+${n}` : `−${-n}`}
        </span>
      ))}
      {(built || !chips.length) && !then && <span className="text-emerald-300">✓</span>}
      {then && <span className={built ? 'text-amber-200' : 'opacity-50'}>→ {then === 'decay' || then === 'chain' ? '⏩' : `${hold ? '🧲' : ''}🚀 ${BEAM_SYMBOLS[then] ?? then}`}</span>}
    </span>
  )
}

/** The race's board: the goal, the countdown or the clock, every racer's progress, the winner. Compact
 *  (a phone): no hint lines, "End the race" a ✕ in the header; onDecay: a Decay button in my row (on
 *  an upright phone the board stands where the card with its Decay button was). */
export function RaceBoard({ className = '', compact = false, onDecay = null }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const s = useStore(store, x => x.forgeRace)
  const skew = useStore(store, x => x.forgeRaceSkew) ?? 0
  const info = useStore(store, x => x.room)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!s) return undefined
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [s])
  if (!s) return null
  const me = info?.me
  const members = info?.members ?? []
  const who = id => members.find(m => m.id === id)
  const mission = RACES.find(m => m.id === s.goal)
  const at = now + skew
  const racer = s.order.includes(me)
  const watchers = members.filter(m => !s.order.includes(m.id) && m.path === '/forge')
  const ending = (s.phase === 'ready' || s.phase === 'racing') && s.ref === me
  const status = s.phase === 'ready'
    ? t('forge.race.ready', { n: Math.max(1, Math.ceil((s.until - at) / 1000)) })
    : s.phase === 'racing'
      ? t('forge.race.racing', { t: clockText(at - s.start) })
      : s.winner
        ? (s.winner === me ? t('forge.race.youWin', { t: clockText(s.time) }) : t('forge.race.wins', { name: who(s.winner)?.name ?? '…', t: clockText(s.time) }))
        : t('forge.race.timeUp')
  return (
    <div data-race={s.phase} className={`glass rounded-2xl p-2.5 pointer-events-auto overflow-y-auto overscroll-contain ${s.phase === 'over' && s.winner ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''} ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-display font-bold text-sm truncate">🏁 {mission ? (mission.name[lang] ?? mission.name.en) : s.goal}</div>
        <div data-race-status className={`text-xs font-bold whitespace-nowrap ${s.phase === 'over' ? 'text-amber-300' : ''}`}>{status}</div>
        {compact && ending && <button type="button" data-race-end onClick={() => race.do({ t: 'stop' })} className="rounded-lg px-1.5 text-sm hover:bg-white/10 self-center" aria-label={t('forge.race.end')} title={t('forge.race.end')}>✕</button>}
      </div>
      {mission && !compact && <div className="text-[11px] opacity-80 leading-snug mt-0.5 line-clamp-2">{mission.hint[lang] ?? mission.hint.en}</div>}
      <ul className="mt-1.5 space-y-1">
        {standings(s).map(id => {
          const m = who(id)
          const a = s.at[id] ?? {}
          const pr = progress(s.goal, a)
          const done = id === s.winner || a.done
          return (
            <li key={id} data-race-row={id} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m?.color ?? '#999' }} />
                <span className="font-bold truncate">{m?.name ?? '…'}{id === me ? ` (${t('forge.race.you')})` : ''}</span>
                {done && <span>🏆</span>}
                <span className="ml-auto font-display font-bold">{a.a && (a.a[0] || a.a[1]) ? nuclideSymbol(a.a[0], a.a[1], a.a[2]) : ''}</span>
                {id === me && onDecay && (
                  <button type="button" data-race-decay onClick={onDecay} className="rounded-full bg-amber-400 text-[#1a1030] font-bold text-[11px] px-2 py-0.5 active:scale-95">⏩ {t('forge.decay')}</button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.round((done ? 1 : pr.p) * 100)}%`, background: m?.color ?? '#999' }} />
                </div>
                {s.phase !== 'ready' && <Needs {...pr} />}
              </div>
            </li>
          )
        })}
      </ul>
      {watchers.length > 0 && <div className="text-[11px] opacity-75 mt-1 truncate">{t('forge.race.watching', { names: watchers.map(m => m.name).join(', ') })}</div>}
      {racer && s.phase === 'racing' && !compact && <div className="text-[11px] opacity-75 mt-1">{t('forge.race.own')}</div>}
      {(s.phase === 'ready' || s.phase === 'over' || (ending && !compact)) && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {s.phase === 'ready' && racer && <button type="button" data-race-watch onClick={() => race.do({ t: 'leave' })} className={`${BTN} bg-white/10 hover:bg-white/20`}>{t('forge.race.watch')}</button>}
          {s.phase === 'ready' && !racer && <button type="button" data-race-join onClick={() => race.do({ t: 'join' })} className={`${BTN} bg-amber-400 text-[#1a1030] hover:bg-amber-300`}>{t('forge.race.join')}</button>}
          {s.phase === 'over' && <button type="button" data-race-again onClick={() => race.do({ t: 'again' })} className={`${BTN} bg-amber-400 text-[#1a1030] hover:bg-amber-300`}>🏁 {t('forge.race.again')}</button>}
          {s.phase === 'over' && <button type="button" data-race-back onClick={() => race.do({ t: 'stop' })} className={`${BTN} bg-white/15 hover:bg-white/25`}>👥 {t('forge.race.back')}</button>}
          {ending && !compact && <button type="button" data-race-end onClick={() => race.do({ t: 'stop' })} className={`${BTN} bg-white/10 hover:bg-white/20 ml-auto`}>{t('forge.race.end')}</button>}
        </div>
      )}
    </div>
  )
}
