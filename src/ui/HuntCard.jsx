/* eslint-disable react/prop-types */
// The clue that follows the player while a treasure hunt is on (game/hunts.js; docs/knowledge/hunts.md), in
// every world: a small card under the top bar at the right edge, folded to a chip at will, never in the
// middle (hud-layout.md). Beside a side sheet it stands left of it on a computer; on a phone it takes turns
// with what else wants that edge (a panel, the Atomling's bubble across an upright phone, the plaza's card
// of an element, a sheet): the last one asked for is shown, and its chip waits where nothing else is (by the
// stick's top on an upright phone's walking worlds). In the lab and the forges, whose own panels fill every
// edge, the chip sits in the top bar (Hud.jsx) and the card opens only when asked for. A clue found shows
// what the place holds, then the next riddle; the last one, the hunt's time and its badge.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { element, nameOf } from '../data/elements.js'
import { stationsOf } from '../content/stations.js'
import { loadBoards } from '../content/boards/index.js'
import { inLang } from '../i18n/langs.js'
import { HINT_AFTER_MS, currentClue, hintsOf, targetKind, trackOf } from '../game/hunts.js'
import { hunts, useHunts, useHuntWords } from './useHunts.js'
import { useViewport } from './layout.js'
import { sheetWidth } from './Panel.jsx'
import VerseLine from './VerseLine.jsx'

const BTN = 'rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3 py-1.5 hover:bg-amber-300 active:scale-95 transition'
const SOFT = 'rounded-xl bg-white/10 font-bold text-sm px-3 py-1.5 hover:bg-white/20 active:scale-95 transition'
const FEMININE_PT = new Set(['Ag', 'Pt']) // a prata, a platina (stations.js)

/** An element's name inside a sentence: lower case (German nouns keep their capital), with its article in
 *  Portuguese ("é o ferro"). */
export function nameInText(el, lang) {
  const n = nameOf(el, lang)
  if (lang === 'de') return n
  if (lang === 'pt-pt') return `${FEMININE_PT.has(el.symbol) ? 'a' : 'o'} ${n.toLowerCase()}`
  return n.toLowerCase()
}

/** A year of the history track: 1807, or c. 1323 BC. */
export const yearLabel = (y, t) => (y < 0 ? t('hunts.bc', { y: -y }) : String(y))

/** How long a hunt took. */
export function duration(ms, t) {
  if (!(ms >= 60000)) return t('hunts.time.under')
  const min = Math.round(ms / 60000)
  return min < 60 ? t('hunts.time.min', { count: min }) : t('hunts.time.hm', { h: Math.floor(min / 60), m: min % 60 })
}

/** A station's title in a hall (the same in every hall: "What it is for"). */
function stationTitle(id, lang, level) {
  return stationsOf(element('C'), { lang, level, familyName: '' }).find(s => s.id === id)?.title ?? id
}

/** Where to look, in a line: the kind of place, never which element's. */
export function whereOf(clue, t, lang, level) {
  const kind = targetKind(clue)
  if (kind === 'station') return t('hunts.where.station', { title: stationTitle(clue.panel, lang, level) })
  if (['picture', 'facts', 'look', 'wing', 'hall'].includes(kind)) return t(`hunts.where.${kind}`)
  return t('hunts.where.place', { name: kind === 'plaza' ? t('hud.table') : t(`hud.${kind}`) })
}

/** The title of the place a name hint points at (a picture's, a station's, a wing's), loaded as needed. */
function usePlaceTitle(h, lang, level, t) {
  const [boardTitle, setBoardTitle] = useState(null)
  const symbol = h?.symbol
  const board = h?.place === 'picture' ? h.panel.slice(6) : null
  useEffect(() => {
    setBoardTitle(null)
    if (!board) return undefined
    let live = true
    loadBoards(symbol).then(list => {
      const b = list?.find(x => x.id === board)
      if (live) setBoardTitle(b ? inLang(b.title, lang) : board)
    }, () => {})
    return () => {
      live = false
    }
  }, [symbol, board, lang])
  if (!h || h.kind !== 'name') return null
  if (h.place === 'picture') return boardTitle ?? '…'
  if (h.place === 'station') return stationTitle(h.panel, lang, level)
  if (h.place === 'wing') return t([`wings.${h.symbol}.${h.wing}.title`, `wings.any.${h.wing}.title`])
  return null
}

function hintText(h, title, { t, lang, level }) {
  if (h.kind === 'family') {
    const fam = t(`families.${h.family}`)
    return level === 'scientist'
      ? t('hunts.hint.familySci', { family: fam, period: h.period })
      : t('hunts.hint.family', { family: lang === 'de' ? fam : fam.toLowerCase(), period: h.period })
  }
  if (h.kind === 'place') return t('hunts.hint.place', { name: h.w === 'plaza' ? t('hud.table') : t(`hud.${h.w}`) })
  return t(`hunts.hint.${h.place}`, { name: nameInText(element(h.symbol), lang), title })
}

/** The hints of the clue on show: a button 30 s after it came, then the family and row, then (the
 *  Explorer) the element and its place. */
function Hints({ cur, hintAt, ctx }) {
  const { t, level } = ctx
  const [shown, setShown] = useState(0)
  const [, redraw] = useState(0)
  useEffect(() => setShown(0), [cur.track.id, cur.step, level])
  const wait = HINT_AFTER_MS - (Date.now() - hintAt)
  useEffect(() => {
    if (wait <= 0) return undefined
    const id = setTimeout(() => redraw(n => n + 1), wait + 50)
    return () => clearTimeout(id)
  }, [wait > 0, hintAt]) // eslint-disable-line react-hooks/exhaustive-deps
  const list = hintsOf(cur.clue, level)
  const title = usePlaceTitle(list[1], ctx.lang, level, t)
  return (
    <div className="mt-1.5">
      {list.slice(0, shown).map((h, i) => (
        <p key={i} data-hunt-hint-text={i + 1} className="mt-1 text-[13px] leading-snug text-amber-100">💡 {hintText(h, title, ctx)}</p>
      ))}
      {shown < list.length && (
        <button
          type="button"
          data-hunt-hint
          disabled={wait > 0}
          title={wait > 0 ? t('hunts.hint.wait') : undefined}
          onClick={() => {
            setShown(s => s + 1)
            hunts.hint(shown + 1)
          }}
          className={`mt-1.5 rounded-lg px-2.5 py-1 text-[12px] font-bold transition ${wait > 0 ? 'bg-white/5 opacity-40' : 'bg-amber-300/20 text-amber-100 hover:bg-amber-300/30 ew-pop'}`}
        >
          💡 {shown ? t('hunts.hint.more') : t('hunts.hint.button')}
        </button>
      )}
    </div>
  )
}

/** One mark per clue: found, the one to find now (when the hunt is on or was left there), still to come (the
 *  history track by its years). */
export function Steps({ track, step, t, years = false, current = true }) {
  return (
    <div className="flex flex-wrap items-center gap-1" data-hunt-steps>
      {track.clues.map((c, i) => {
        const look = i < step ? 'bg-amber-400 text-[#1a1030]' : i === step && current ? 'ring-2 ring-amber-300 bg-white/10' : 'bg-white/10 opacity-60'
        return years && c.year != null ? (
          <span key={c.id} className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-tight ${look}`}>{yearLabel(c.year, t)}</span>
        ) : (
          <span key={c.id} className={`w-2.5 h-2.5 rounded-full ${look}`} />
        )
      })}
    </div>
  )
}

/** The riddle of the clue to find now: where to look, its hints. */
export function Riddle({ cur, hintAt, ctx, words }) {
  const { t, lang, level } = ctx
  const w = words?.CLUE_WORDS[`${cur.track.id}.${cur.clue.id}`]
  return (
    <div data-hunt-clue={`${cur.track.id}.${cur.clue.id}`}>
      <div className="text-[11px] font-bold uppercase tracking-wide opacity-75">
        {t('hunts.progress', { n: cur.step + 1, of: cur.track.clues.length })}
        {cur.clue.year != null && <span className="text-amber-200"> · {yearLabel(cur.clue.year, t)}</span>}
      </div>
      <p data-hunt-riddle className="mt-0.5 text-[14px] leading-snug">{w ? words.huntText(w.riddle, lang, level) : '…'}</p>
      <p className="mt-1 text-[12px] leading-snug opacity-80">📍 {whereOf(cur.clue, t, lang, level)}</p>
      <Hints cur={cur} hintAt={hintAt} ctx={ctx} />
    </div>
  )
}

/** The folded card: the hunt's progress; a clue just found makes it pop. */
export function HuntChip({ style, className = '', onOpen }) {
  const { t } = useTranslation()
  const { state, news } = useHunts()
  const cur = currentClue(state)
  const end = news?.kind === 'done'
  if (!cur && !end) return null
  const fresh = news && !news.seen
  const tr = trackOf(cur?.track.id ?? news.track)
  return (
    <button
      type="button"
      data-hunt-chip
      onClick={onOpen ?? (() => hunts.setOpen(true))}
      style={style}
      className={`glass rounded-xl px-2.5 py-1.5 text-xs font-bold pointer-events-auto hover:bg-white/10 whitespace-nowrap ${fresh ? 'ring-2 ring-emerald-300 ew-pop' : ''} ${className}`}
      aria-label={t('hunts.show')}
      title={t('hunts.show')}
    >
      🗺️ {end ? '🏆' : `${fresh ? '✓ ' : ''}${tr.icon} ${cur.step + 1}/${cur.track.clues.length}`}
    </button>
  )
}

/** The card, mounted in every world by Hud.jsx. */
export default function HuntCard() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const navigate = useNavigate()
  const { state, news, open, hintAt } = useHunts()
  const words = useHuntWords()
  const world = useStore(store, s => s.world)
  const panel = useStore(store, s => s.panel)
  const speech = useStore(store, s => s.speech)
  const level = useStore(store, s => s.level)
  const sheet = useStore(store, s => s.plazaSheet)
  const selected = useStore(store, s => s.selected)
  const vp = useViewport()
  const ctx = { t, lang, level }

  const cur = currentClue(state)
  const end = news?.kind === 'done' ? news : null
  const kind = world?.kind
  const plaza = kind === 'plaza'
  const tool = kind === 'lab' || kind === 'forge' || kind === 'stars' || kind === 'bench'
  const walking = !!world && !plaza && !tool
  const sideSheet = walking && !!panel && !vp.portrait
  const fresh = !!news && !news.seen

  // the lab and the forges fill every edge with their own: there the clue waits folded until asked for
  useEffect(() => {
    if (tool) hunts.setOpen(false)
  }, [tool])
  // a phone's plaza: a new pick brings the element's card back (the cube's card and this one take turns)
  useEffect(() => {
    if (vp.compact && plaza && selected != null) hunts.setOpen(false)
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps
  // across an upright phone the Atomling's bubble and the card take turns: a new line from the Atomling folds
  // the card, but a clue just found goes first (the player did that last)
  useEffect(() => {
    if (!(vp.portrait && walking && speech && open)) return
    if (fresh) store.set({ speech: null })
    else hunts.setOpen(false)
  }, [speech]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (vp.portrait && walking && fresh && open && store.get().speech) store.set({ speech: null })
  }, [news]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!cur && !end) return null
  // the hunts' own sheet is open: it shows the clue itself
  if (plaza && sheet === 'hunts') return null

  // what else holds the edge the card would take
  const topSheet = vp.portrait && ((walking && !!panel) || (plaza && !!sheet))
  const blocked = topSheet || (vp.compact && sideSheet) || (vp.portrait && walking && !!speech)
  const shown = open && !blocked

  const unfold = () => {
    // on a phone the card is the last one asked for: what held its edge makes way
    if (vp.compact && walking) store.set(vp.portrait ? { panel: null, speech: null } : { panel: null })
    hunts.setOpen(true)
  }

  if (!shown) {
    if (tool || (topSheet && !(vp.portrait && walking))) return null // (the bar's chip; or a sheet over the top)
    // where the chip waits: by the stick's top on an upright phone's walking worlds, else under the bar at the
    // right (left of a side sheet)
    const style = vp.portrait && walking
      ? { left: '0.75rem', bottom: vp.short ? '8rem' : '9.5rem' }
      : { right: sideSheet ? `calc(${sheetWidth(vp.short)} + 1.25rem)` : '0.5rem', top: 'calc(var(--bar) + 0.25rem)' }
    return (
      <div className="absolute pointer-events-none" style={style}>
        <HuntChip onOpen={unfold} />
      </div>
    )
  }

  const top = 'calc(var(--bar) + 0.25rem)'
  const place = vp.portrait
    ? { left: '0.5rem', right: '0.5rem', top, maxHeight: 'calc((100vh - var(--bar)) * 0.3)' }
    : sideSheet
      ? { right: `calc(${sheetWidth(vp.short)} + 1.25rem)`, top, width: 'min(15rem, 22vw)', maxHeight: 'calc(100vh - var(--bar) - 5rem)' }
      : {
          right: '0.5rem',
          top,
          width: vp.short ? 'min(15rem, 30vw)' : 'min(20rem, 28vw)',
          // (on the plaza the element's card stands at the bottom right)
          maxHeight: vp.short ? 'calc(100vh - var(--bar) - 3.75rem)' : plaza ? 'calc(100vh - var(--bar) - 21rem)' : 'calc(100vh - var(--bar) - 5rem)',
        }

  const id = cur?.track.id ?? end.track
  const tr = trackOf(id)
  const tw = words?.TRACK_WORDS[id]
  const foundOf = n => {
    const w = words?.CLUE_WORDS[`${n.track}.${n.clue.id}`]
    return w ? words.huntText(w.found, lang, level) : '…'
  }

  let body
  if (end) {
    body = (
      <div data-hunt-done>
        <div className="mt-1 font-display text-lg font-bold text-amber-200 ew-pop">🏆 {t('hunts.finished')}</div>
        <p className="mt-1 text-[13px] leading-snug">{foundOf(end)}</p>
        <p className="mt-2 text-sm font-bold" data-hunt-time>⏱ {t('hunts.took', { time: duration(end.spent, t) })}</p>
        {end.newBest && <p className="text-sm font-bold text-emerald-200">✨ {t('hunts.newBest')}</p>}
        {end.first && <p className="mt-1 text-sm font-bold text-amber-100" data-hunt-badge>{t(`passport.badge.hunt-${id}.icon`)} {t('hunts.badge', { name: t(`passport.badge.hunt-${id}.name`) })}</p>}
        <div className="flex flex-wrap gap-2 mt-2.5">
          <button type="button" data-hunt-more className={BTN} onClick={() => { hunts.seen(); navigate('/?hunts') }}>🗺️ {t('hunts.more')}</button>
          <button type="button" data-hunt-close className={SOFT} onClick={() => hunts.seen()}>{t('hunts.close')}</button>
        </div>
        {/* a hunt's end: God's privilege to conceal, the king's to discover (krypton's passage, the hidden one) */}
        <VerseLine id="Kr" className="mt-2.5 text-[12px]" />
      </div>
    )
  } else if (fresh && news.kind === 'clue') {
    body = (
      <div data-hunt-found={`${news.track}.${news.clue.id}`}>
        <div className="mt-1 font-display font-bold text-emerald-300 ew-pop">✓ {t('hunts.found')}</div>
        <p className="mt-0.5 text-[13px] leading-snug">{foundOf(news)}</p>
        <button type="button" data-hunt-next className={`${BTN} mt-2`} onClick={() => hunts.seen()}>{t('hunts.next')} →</button>
      </div>
    )
  } else {
    body = (
      <div className="mt-1">
        <Riddle cur={cur} hintAt={hintAt} ctx={ctx} words={words} />
        <button type="button" data-hunt-stop onClick={() => hunts.stop()} className="mt-2 text-[11px] opacity-60 hover:opacity-100 underline">{t('hunts.stop')}</button>
      </div>
    )
  }

  return (
    <div
      data-hunt-card={id}
      data-hunt-step={cur ? cur.step : tr.clues.length}
      className="absolute glass rounded-2xl p-2.5 sm:p-3 pointer-events-auto shadow-2xl overflow-y-auto overscroll-contain z-20"
      style={{ ...place, borderColor: fresh ? 'rgba(110,231,183,0.7)' : undefined }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base leading-none" aria-hidden="true">{tr.icon}</span>
        <span className="font-display text-sm font-bold truncate min-w-0">{tw ? inLang(tw.title, lang) : ''}</span>
        <button type="button" onClick={() => (end ? hunts.seen() : hunts.setOpen(false))} className="ml-auto shrink-0 rounded-lg px-1.5 py-0.5 text-sm hover:bg-white/10" aria-label={end ? t('hunts.close') : t('hunts.fold')} title={end ? t('hunts.close') : t('hunts.fold')}>
          {end ? '✕' : '▴'}
        </button>
      </div>
      <div className="mt-1">
        <Steps track={tr} step={cur ? cur.step : tr.clues.length} t={t} />
      </div>
      {body}
    </div>
  )
}
