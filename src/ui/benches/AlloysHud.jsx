/* eslint-disable react/prop-types */
// The HUD of the lab's bench "The Alloy Forge" (/lab/alloys; the world: src/worlds/benches/alloys/), at the
// edges so the bench keeps the middle (docs/knowledge/hud-layout.md): the crucible's card at the top (the
// mix by mass, by atoms for the Scientist, what it will make, the next step, the celebration), the ingot's
// card and the alloy book on the right (an upright phone: sheets over a bar of buttons at the bottom; a
// phone on its side: a column on the right). Every word from the bench's words.js.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../engine/store.js'
import { store } from '../../state.js'
import { useCover, useViewport } from '../layout.js'
import { ION, ALLOY, PURE_HARD } from '../../worlds/benches/alloys/mix.js'
import { element } from '../../data/elements.js'
import { words, pct, nameOfMix, titleOfMix, factOf, recipeText, hardnessText, meltText, crucibleLine, strikeText } from '../../worlds/benches/alloys/words.js'

const CARBON = '#aab1bd'
const colorOf = el => (el === 'C' ? CARBON : ION[el] ?? '#cccccc')
const order = f => Object.entries(f).sort((a, b) => b[1] - a[1])

/** A bar of the mix, each metal its share, with the shares written under it. */
function MixBar({ f, label, thin, lang }) {
  const parts = order(f)
  return (
    <div className="w-full">
      {label && <div className="text-[10px] uppercase tracking-wide opacity-60 text-left">{label}</div>}
      <div className={`flex w-full overflow-hidden rounded-full bg-white/10 ${thin ? 'h-2' : 'h-3.5'}`}>
        {parts.map(([el, v]) => (
          <div key={el} style={{ width: `${Math.max(v * 100, 1.2)}%`, background: colorOf(el), boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35)` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-0.5 text-[12px] leading-tight">
        {parts.map(([el, v]) => (
          <span key={el} className="inline-flex items-center gap-1 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colorOf(el), boxShadow: `0 0 6px ${colorOf(el)}` }} />
            <span className="font-bold">{el}</span>
            <span className="opacity-85 tabular-nums">{pct(v, lang)}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** A round swatch of a metal's colour, shining. */
const Swatch = ({ look, size = 'w-6 h-6' }) => (
  <span className={`${size} rounded-full shrink-0 inline-block`} style={{ background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${look} 38%, ${look} 62%, #1b1f2c 100%)`, boxShadow: `0 0 10px ${look}88` }} />
)

export default function AlloysHud({ engine }) {
  const { i18n } = useTranslation()
  const a = useStore(store, s => s.alloys)
  const party = useStore(store, s => s.alloysParty)
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const W = words(lang)
  const sci = level === 'scientist'
  const world = engine?.world
  const vp = useViewport()
  const narrow = vp.narrow
  const side = vp.short && !vp.narrow
  const [bookOpen, setBookOpen] = useState(() => !(window.innerWidth < 640 || window.innerHeight < 520))
  const [sheet, setSheet] = useState(null) // an upright phone: 'ingot' or 'book'
  const [hint, setHint] = useState(null)
  const [more, setMore] = useState(false)
  const topRef = useRef(null)
  const rightRef = useRef(null)
  const bottomRef = useRef(null)
  useCover(topRef, 'top', !!a && !side)
  useCover(rightRef, 'right', !!a && !narrow)
  useCover(bottomRef, 'bottom', !!a && narrow)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ alloysParty: null }), 6500)
    return () => clearTimeout(id)
  }, [party])
  if (!a) return null

  const c = a.crucible
  const g = a.ingot
  const done = a.book.filter(b => b.done).length
  const naming = c.info.kind === 'alloy' || c.info.kind === 'gold' || c.info.kind === 'pure'
  const line = a.note ? W.line[a.note]?.[sci ? 'sci' : 'kid'] : crucibleLine(c.info, { full: c.full, lang, level })
  const partyText = !party ? null : party.kind === 'made' ? `🎉 ${W.made(nameOfMix(party.info, lang, level))}` : party.kind === 'crack' ? `💥 ${W.crackedParty}` : `⚒️ ${W.firstStrike}`
  const btn = 'rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition px-2.5 py-1 text-xs font-bold disabled:opacity-40'
  const hot = 'rounded-xl bg-amber-400 text-[#1a1030] hover:bg-amber-300 active:scale-95 transition px-3 py-1 text-xs font-bold disabled:opacity-40'
  const canPour = c.info.kind !== 'empty' && c.info.kind !== 'carbon' && !a.pouring

  const crucibleCard = (
    <div data-alloys-crucible className={`glass rounded-2xl px-3 sm:px-4 py-2 pointer-events-auto w-full ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`}>
      {partyText && <div className="font-display font-bold text-amber-300 leading-tight mb-1 text-center">{partyText}</div>}
      {a.together?.length > 0 && (
        <div data-alloys-together className="text-xs font-bold mb-1">
          👥 {W.ui.together}:{' '}
          {a.together.map((m, i) => <span key={i} style={{ color: m.color }}>{i ? ', ' : ''}{m.name}</span>)}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="font-display font-bold text-sm sm:text-base whitespace-nowrap">🔥 {W.ui.crucible}</span>
        {naming && (
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="opacity-60 text-xs">→</span>
            <Swatch look={c.look} size="w-4 h-4" />
            <span className="font-display font-bold text-amber-200 truncate">{titleOfMix(c.info, lang, level)}</span>
          </span>
        )}
        {sci && c.lumps + (c.mix.C ?? 0) > 0 && <span className="ml-auto text-[11px] opacity-70 whitespace-nowrap tabular-nums">{W.ui.lumps(c.lumps + (c.mix.C ?? 0), c.grams)}</span>}
      </div>
      {Object.keys(c.info.w).length > 0 && c.info.kind !== 'carbon' && (
        <div className="mt-1 space-y-1">
          <MixBar f={c.info.w} label={sci ? W.ui.byMass : null} lang={lang} />
          {sci && Object.keys(c.info.x).length > 1 && <MixBar f={c.info.x} label={W.ui.byAtoms} thin lang={lang} />}
        </div>
      )}
      <div className={`text-[13px] mt-1 leading-snug ${a.note ? 'text-amber-200' : 'opacity-90'} ${vp.compact ? 'line-clamp-3' : ''}`}>{line}</div>
      <div className="flex gap-1.5 mt-1.5 justify-end">
        <button type="button" className={hot} disabled={!canPour} onClick={() => world?.pour?.()}>⤵ {W.ui.pour}</button>
        <button type="button" className={btn} disabled={c.info.kind === 'empty'} onClick={() => world?.empty?.()}>{W.ui.empty}</button>
      </div>
    </div>
  )

  const info = g.info
  const base = info.kind === 'alloy' ? ALLOY[info.id].base : null
  const hard = hardnessText(g.hard, lang, level)
  const melt = sci ? meltText(g.melt, lang) : null
  const strike = strikeText(g.last, info, lang, level)
  const fact = factOf(info, lang, level)
  const pureLine = sci && base ? W.pureLine(titleOfMix({ kind: 'pure', el: base }, lang, level), `${PURE_HARD[base].v} ${PURE_HARD[base].s}`, Math.round(element(base).melt - 273.15)) : null
  const ingotCard = (
    <div data-alloys-ingot className="glass rounded-2xl p-3 pointer-events-auto w-full">
      <div className="text-[11px] uppercase tracking-wide opacity-60">⚒️ {W.ui.anvil}</div>
      <div className="flex items-center gap-2 mt-0.5">
        <Swatch look={g.look} />
        <span className="font-display font-bold text-lg leading-tight">{titleOfMix(info, lang, level)}</span>
      </div>
      {sci && Object.keys(info.w).length > 1 && <div className="mt-1"><MixBar f={info.w} thin lang={lang} /></div>}
      {strike ? <div data-alloys-strike className="mt-1.5 text-[13px] font-bold text-amber-200 leading-snug">{strike}</div>
        : !g.strikes && <div className="mt-1.5 text-[13px] opacity-80 leading-snug">{W.line.strikeIt[sci ? 'sci' : 'kid']}</div>}
      <div className="mt-1.5 space-y-0.5 text-[13px] leading-snug">
        {hard && <div><span className="opacity-70">{W.ui.hardness}: </span><span className="font-bold">{hard}</span></div>}
        {melt && <div><span className="opacity-70">{W.ui.melts}: </span><span className="font-bold">{melt}</span></div>}
        {pureLine && <div className="opacity-75 text-[12px]">{pureLine}</div>}
      </div>
      {fact && (
        <button type="button" onClick={() => setMore(m => !m)} className={`mt-1.5 w-full text-left text-[13px] opacity-90 leading-snug ${more ? '' : 'line-clamp-3'}`}>{fact}</button>
      )}
      {/* (an upright phone has Strike in its bar) */}
      {!narrow && <div className="flex justify-end mt-1.5">
        <button type="button" className={hot} disabled={a.pouring} onClick={() => world?.strike?.()}>🔨 {W.ui.strike}</button>
      </div>}
    </div>
  )

  const book = (
    <div data-alloys-book className="glass rounded-2xl p-2.5 pointer-events-auto w-full">
      <button type="button" onClick={() => setBookOpen(o => !o)} className="font-display font-bold text-sm w-full text-left flex items-center justify-between gap-2">
        <span>📖 {W.ui.book} · {done}/{a.book.length}</span>
        <span className="opacity-60">{bookOpen ? '▴' : '▾'}</span>
      </button>
      {bookOpen && (
        <ul className="space-y-0.5 text-[13px] mt-1">
          {a.book.map(b => (
            <li key={b.id}>
              <button type="button" onClick={() => setHint(hint === b.id ? null : b.id)} className="w-full text-left flex items-center gap-1.5 rounded px-1 hover:bg-white/10">
                <span className={b.done ? 'text-emerald-300' : 'opacity-50'}>{b.done ? '✔' : '○'}</span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ALLOY[b.id].look ?? '#e8bd52' }} />
                <span className={`truncate ${b.done ? 'font-bold' : ''}`}>{W.alloy[b.id].name.charAt(0).toUpperCase() + W.alloy[b.id].name.slice(1)}</span>
              </button>
              {hint === b.id && (
                <div className="pl-6 text-xs opacity-90 pb-1">
                  {recipeText(b.id, lang, level)}
                  {b.done && <button type="button" className="ml-2 underline" onClick={() => world?.recipe?.(b.id)}>{W.ui.fill}</button>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  // an upright phone: the crucible at the top; the ingot or the book as a sheet over a bar at the bottom
  if (narrow) return (
    <>
      <div ref={topRef} className="absolute inset-x-2 top-[calc(var(--bar)+0.25rem)] flex flex-col pointer-events-none">{crucibleCard}</div>
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 p-2 flex flex-col gap-1.5 pointer-events-none">
        {sheet && <div className="max-h-[36vh] overflow-y-auto overscroll-contain rounded-2xl pointer-events-auto">{sheet === 'book' ? book : ingotCard}</div>}
        <div className="flex gap-1.5 justify-center pointer-events-auto">
          <button type="button" className={`glass ${btn} ${sheet === 'ingot' ? 'bg-white/25' : ''}`} onClick={() => setSheet(s => (s === 'ingot' ? null : 'ingot'))}>
            <span className="inline-flex items-center gap-1"><Swatch look={g.look} size="w-3.5 h-3.5" /> {titleOfMix(info, lang, 'explorer')}</span>
          </button>
          <button type="button" className={`glass ${btn} ${sheet === 'book' ? 'bg-white/25' : ''}`} onClick={() => { setSheet(s => (s === 'book' ? null : 'book')); setBookOpen(true) }}>📖 {done}/{a.book.length}</button>
          <button type="button" className={hot} disabled={a.pouring} onClick={() => world?.strike?.()}>🔨 {W.ui.strike}</button>
        </div>
      </div>
    </>
  )

  // a phone on its side: everything in a column on the right
  if (side) return (
    <div ref={rightRef} className="absolute right-1.5 top-[calc(var(--bar)+0.25rem)] flex flex-col gap-1.5 overflow-y-auto overscroll-contain pointer-events-auto" style={{ width: 'min(19rem, 40vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }}>
      {crucibleCard}
      {ingotCard}
      {book}
    </div>
  )

  // a computer: the crucible at the top, the ingot and the book on the right
  return (
    <>
      <div className="absolute inset-x-0 top-[calc(var(--bar)+0.25rem)] flex justify-center pointer-events-none px-2">
        <div ref={topRef} style={{ width: 'min(30rem, calc(100vw - 38rem))', minWidth: '17rem' }}>{crucibleCard}</div>
      </div>
      <div ref={rightRef} className="absolute right-3 top-[calc(var(--bar)+0.25rem)] flex flex-col gap-2 pointer-events-none w-[min(80vw,17.5rem)] overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - var(--bar) - 3.5rem)' }}>
        {ingotCard}
        {book}
      </div>
    </>
  )
}
