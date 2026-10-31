/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { nuclide, commonestN, nuclideSymbol } from '../chem/nucleus.js'
import { MISSIONS, describe, decayText, reactionText, isotopeName, halfLifeText, noteText, BEAM_NAMES, BEAM_SYMBOLS } from '../worlds/forge/words.js'
import { BEAMS } from '../chem/nucleus.js'
import { CODES } from '../i18n/langs.js'
import NuclideChart from './NuclideChart.jsx'
import { useCover, useViewport } from './layout.js'

const DOT = { p: '#ff5a55', n: '#b9c6dc', e: '#a8ecff' }
const TONE = { info: 'opacity-90', good: 'text-emerald-300', warn: 'text-amber-200', bad: 'text-rose-300' }
const CHIP = {
  stable: 'bg-emerald-400/20 text-emerald-200', radioactive: 'bg-amber-400/20 text-amber-200', instant: 'bg-rose-500/25 text-rose-200',
  unmeasured: 'bg-amber-400/15 text-amber-100', unknown: 'bg-rose-500/20 text-rose-200', neutron: 'bg-amber-400/20 text-amber-200',
  neutrons: 'bg-rose-500/25 text-rose-200', empty: 'bg-white/10',
}

/** A button that repeats while held, faster and faster: big atoms need many particles. */
function Repeat({ onFire, children, className, label }) {
  const timer = useRef(null)
  const stop = () => {
    clearTimeout(timer.current)
    timer.current = null
  }
  const start = e => {
    if (e.button > 0) return
    e.preventDefault()
    onFire()
    let delay = 380
    const loop = () => {
      onFire()
      delay = Math.max(40, delay * 0.78)
      timer.current = setTimeout(loop, delay)
    }
    timer.current = setTimeout(loop, delay)
  }
  useEffect(() => stop, [])
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onFire())}
      onContextMenu={e => e.preventDefault()}
      className={className}
      style={{ touchAction: 'none' }}
    >
      {children}
    </button>
  )
}

// accents optional, as in Search.jsx: NFD splits them off; the Polish l with a stroke (\u0142) is a
// letter of its own, so it folds to l by hand
const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\u0142/g, 'l')

/** Finds an element by symbol, number or name (in any of the site's languages, accents optional), or
 *  the first whose name starts so (the page's language first). */
function findElement(q, lang) {
  const s = fold(q.trim())
  if (!s) return null
  const names = e => [nameOf(e, lang), ...CODES.map(c => e.name[c])].filter(Boolean).map(fold)
  const exact = ELEMENTS.find(e => e.symbol.toLowerCase() === s || String(e.z) === s || names(e).includes(s))
  return exact ?? ELEMENTS.find(e => fold(nameOf(e, lang)).startsWith(s)) ?? ELEMENTS.find(e => names(e).some(n => n.startsWith(s)))
}

/** The Atom Forge's HUD, at the edges so the atom has the middle (docs/knowledge/hud-layout.md): the
 *  particles (a column on the left; a bar at the bottom of an upright phone), what the atom is and
 *  the celebration (a card at the top; on a phone on its side, down the right), the missions, the
 *  chart, the finder and the beam (right and bottom; on a phone they open from the tool buttons). */
export default function ForgeHud({ engine }) {
  const { t, i18n } = useTranslation()
  const f = useStore(store, s => s.forge)
  const party = useStore(store, s => s.forgeCelebrate)
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const world = engine?.world
  const vp = useViewport()
  const narrow = vp.narrow
  // a phone on its side: the particles down the left, the atom's card down the right
  const side = vp.short && !vp.narrow
  const [missionsOpen, setMissionsOpen] = useState(() => !(window.innerWidth < 640 || window.innerHeight < 520))
  // the card shows two lines of what the atom is until tapped (all of them stood a third of a laptop's
  // screen tall)
  const [more, setMore] = useState(false)
  const [chart, setChart] = useState(false)
  const [hint, setHint] = useState(null)
  const [query, setQuery] = useState('')
  const [finding, setFinding] = useState(false)
  const [beaming, setBeaming] = useState(false)
  const leftRef = useRef(null)
  const topRef = useRef(null)
  const rightRef = useRef(null)
  const bottomRef = useRef(null)
  useCover(leftRef, 'left', !!f && !narrow)
  useCover(topRef, 'top', !!f && !side)
  useCover(rightRef, 'right', !!f && !narrow)
  useCover(bottomRef, 'bottom', !!f && !side)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ forgeCelebrate: null }), 6000)
    return () => clearTimeout(id)
  }, [party])
  if (!f) return null

  const { Z, N, E } = f
  const nuc = nuclide(Z, N)
  const lines = describe({ Z, N, E, nuc, common: Z ? commonestN(Z) : 0, held: f.held, note: f.note }, lang, level)
  const event = !f.event ? null : f.event.mode === 'reaction' || f.event.mode === 'fusion' ? reactionText(f.event, lang) : decayText(f.event, lang)
  const sym = nuclideSymbol(Z, N, E)
  const title = Z ? isotopeName(Z, N, lang) : N === 1 ? t('forge.aNeutron') : N > 1 ? t('forge.neutronsAlone', { count: N }) : t('forge.nothing')
  const half = nuc.t ? halfLifeText(nuc.t, lang) : null
  const chip = t(`forge.kind.${nuc.kind === 'unknown' && !nuc.side ? 'notMade' : nuc.kind}`)
  const lonely = Z === 0 && f.note ? noteText(f.note, lang, level) : null
  const go = e => {
    e.preventDefault()
    const el = findElement(query, lang)
    if (el) {
      world?.goTo?.(el.z)
      setQuery('')
      setFinding(false)
    }
  }
  const btn = 'rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition px-2 py-1.5'
  const quick = [
    <button key="neutral" type="button" className={btn} onClick={() => world?.neutral?.()} title={t('forge.neutralTip')}>{t('forge.neutral')}</button>,
    <button key="common" type="button" className={btn} onClick={() => world?.commonest?.()} title={t('forge.commonestTip')}>{t('forge.commonest')}</button>,
    <button key="hold" type="button" className={`${btn} ${f.held ? 'bg-sky-400/40 hover:bg-sky-400/50' : ''}`} onClick={() => world?.setHeld?.(!f.held)} title={t('forge.holdTip')}>🧲 {t('forge.hold')}</button>,
    <button key="clear" type="button" className={btn} onClick={() => world?.clear?.()}>{t('forge.clear')}</button>,
  ]
  const particle = ([k, count]) => side ? (
    <div key={k} className="glass rounded-xl px-1.5 py-1 flex items-center gap-1.5 text-xs font-bold">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DOT[k], boxShadow: `0 0 8px ${DOT[k]}` }} />
      <span className="truncate flex-1">{t(`forge.${k}`)}</span>
      <span className="font-display text-base tabular-nums">{count}</span>
      <Repeat onFire={() => world?.remove?.(k)} label={`${t('forge.less')} ${t(`forge.${k}`)}`} className="w-7 h-7 rounded-lg bg-white/10 active:scale-95 text-base font-bold">−</Repeat>
      <Repeat onFire={() => world?.add?.(k)} label={`${t('forge.more')} ${t(`forge.${k}`)}`} className="w-7 h-7 rounded-lg bg-white/20 active:scale-95 text-base font-bold">+</Repeat>
    </div>
  ) : (
    <div key={k} className="glass rounded-2xl p-1.5 sm:p-2">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: DOT[k], boxShadow: `0 0 10px ${DOT[k]}` }} />
        <span className="truncate">{t(`forge.${k}`)}</span>
        <span className="ml-auto font-display text-base sm:text-lg tabular-nums">{count}</span>
      </div>
      <div className="flex gap-1.5 mt-1">
        <Repeat onFire={() => world?.remove?.(k)} label={`${t('forge.less')} ${t(`forge.${k}`)}`} className="flex-1 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 py-1 sm:py-1.5 text-lg font-bold">−</Repeat>
        <Repeat onFire={() => world?.add?.(k)} label={`${t('forge.more')} ${t(`forge.${k}`)}`} className="flex-1 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 py-1 sm:py-1.5 text-lg font-bold">+</Repeat>
      </div>
    </div>
  )
  const finder = (
    <form onSubmit={go} className="glass rounded-xl flex items-center gap-1 pl-3 pr-1 py-1 pointer-events-auto">
      <span aria-hidden>🔎</span>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('forge.find')}
        className="bg-transparent outline-none text-sm w-44 sm:w-56 placeholder:text-white/50"
        aria-label={t('forge.find')}
        autoFocus={vp.compact}
      />
      <button type="submit" className="rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-bold">{t('forge.go')}</button>
    </form>
  )
  const beams = (
    <div className="glass rounded-2xl p-1.5 pointer-events-auto">
      <div className="text-[11px] font-bold opacity-80 px-1 mb-1">🚀 {t('forge.beam')}</div>
      <div className="grid grid-cols-5 gap-1">
        {Object.keys(BEAMS).map(b => (
          <button
            key={b}
            type="button"
            onClick={() => world?.fire?.(b)}
            title={`${t('forge.fire')}: ${BEAM_NAMES[lang]?.[b] ?? BEAM_NAMES.en[b]}`}
            className="rounded-lg bg-white/10 hover:bg-amber-400/30 active:scale-95 py-1 text-[12px] font-bold"
          >
            {BEAM_SYMBOLS[b]}
          </button>
        ))}
      </div>
    </div>
  )
  const missions = (
    <div className={`glass rounded-2xl p-2.5 pointer-events-auto overflow-y-auto ${side ? 'w-full' : 'w-[min(80vw,16rem)]'} ${narrow ? 'max-h-[35vh]' : side ? '' : 'max-h-[45vh]'}`}>
      <button type="button" onClick={() => setMissionsOpen(o => !o)} className="font-display font-bold text-sm w-full text-left flex items-center justify-between gap-2">
        <span>{t('forge.missions')} · {f.done.length}/{MISSIONS.length}</span>
        <span className="opacity-60">{missionsOpen ? '▴' : '▾'}</span>
      </button>
      {missionsOpen && (
        <ul className="space-y-0.5 text-[13px] mt-1">
          {MISSIONS.map(m => {
            const done = f.done.includes(m.id)
            return (
              <li key={m.id}>
                <button type="button" onClick={() => setHint(hint === m.id ? null : m.id)} className="w-full text-left flex items-center gap-1.5 rounded px-1 hover:bg-white/10">
                  <span className={done ? 'text-emerald-300' : 'opacity-50'}>{done ? '✔' : '○'}</span>
                  <span className="truncate">{m.name[lang] ?? m.name.en}</span>
                </button>
                {hint === m.id && <div className="pl-6 text-xs opacity-90 pb-1">{m.hint[lang] ?? m.hint.en}</div>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

  // what the atom is (with the celebration of a mission done at its top)
  const card = (
    <div className={`glass rounded-2xl px-3 sm:px-4 py-2 text-center pointer-events-auto w-full ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`}>
      {party && (
        <div className="font-display font-bold text-amber-300 leading-tight mb-1">🎉 {t('forge.missionDone')} <span className="whitespace-nowrap">{party.name}</span></div>
      )}
      <div className="flex items-baseline justify-center gap-2.5 flex-wrap">
        {sym && <span className={`font-display font-bold leading-none ${side ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{sym}</span>}
        <span className="font-display text-base sm:text-lg font-bold">{title}</span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${CHIP[nuc.kind] ?? ''}`}>{chip}{half && nuc.kind !== 'instant' ? ` · ${half}` : ''}</span>
        {f.canDecay && (
          <button type="button" onClick={() => world?.decay?.()} className="rounded-full bg-amber-400 text-[#1a1030] font-bold text-xs px-3 py-1 hover:bg-amber-300 active:scale-95">
            ⏩ {half && nuc.kind === 'radioactive' && nuc.t > 3 ? t('forge.waitFor', { t: half }) : t('forge.decay')}
          </button>
        )}
      </div>
      {event && <div className="mt-1.5 text-[13px] text-amber-200 font-bold">{level === 'scientist' ? event.sci : event.kid}</div>}
      {lonely && <div className="mt-1 text-[13px] text-amber-200">{lonely}</div>}
      <button type="button" onClick={() => setMore(m => !m)} className="w-full text-left mt-1">
        <ul className={`space-y-0.5 text-[13px] leading-snug ${more ? '' : 'line-clamp-2'}`}>
          {lines.map((l, i) => <li key={i} className={TONE[l.tone]}>{l.text}</li>)}
        </ul>
        {!more && lines.length > 1 && <span className="text-xs opacity-60">{t('forge.moreText')}</span>}
      </button>
    </div>
  )
  const chartBox = (
    <div className="glass rounded-2xl p-3 pointer-events-auto">
      <div className="flex items-center justify-between mb-1.5">
        <div className="font-display font-bold">{t('forge.chart')}</div>
        <button type="button" onClick={() => setChart(false)} className="rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
      </div>
      <div className="text-xs opacity-80 mb-2">{t(level === 'scientist' ? 'forge.chartSci' : 'forge.chartKid')}</div>
      <NuclideChart Z={Z} N={N} onPick={(z, n) => world?.set?.(z, n, z)} />
    </div>
  )
  // on a phone the missions, the chart, the finder and the beam open from these
  const tools = [
    <button key="missions" type="button" className={`${btn} ${missionsOpen ? 'bg-white/25' : ''}`} onClick={() => setMissionsOpen(o => !o)}>🏆 {f.done.length}/{MISSIONS.length}</button>,
    <button key="chart" type="button" className={`${btn} ${chart ? 'bg-white/25' : ''}`} onClick={() => setChart(c => !c)} aria-label={t('forge.chart')}>🗺️</button>,
    <button key="find" type="button" className={`${btn} ${finding ? 'bg-white/25' : ''}`} onClick={() => setFinding(x => !x)} aria-label={t('forge.find')}>🔎</button>,
    <button key="beam" type="button" className={`${btn} ${beaming ? 'bg-white/25' : ''}`} onClick={() => setBeaming(x => !x)} aria-label={t('forge.beam')}>🚀</button>,
  ]

  // an upright phone: the card (or the chart) at the top, the particles and the tools in a bar at the
  // bottom
  if (narrow) return (
    <>
      <div ref={topRef} className="absolute inset-x-2 top-[calc(var(--bar)+0.25rem)] flex flex-col pointer-events-none">
        {chart ? <div className="max-h-[45vh] overflow-y-auto overscroll-contain pointer-events-auto rounded-2xl">{chartBox}</div> : card}
      </div>
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 p-2 flex flex-col gap-1.5 pointer-events-none">
        {finding && <div className="flex justify-center">{finder}</div>}
        {beaming && <div className="flex justify-center">{beams}</div>}
        {missionsOpen && <div className="flex justify-end">{missions}</div>}
        <div className="flex flex-wrap gap-1 justify-center pointer-events-auto text-[11px] font-bold">
          {quick}
          {tools}
        </div>
        <div className="grid grid-cols-3 gap-1.5 pointer-events-auto">{[['p', Z], ['n', N], ['e', E]].map(particle)}</div>
      </div>
    </>
  )

  // a phone on its side: the particles and the tools down the left, the card (or the tool opened)
  // down the right
  if (side) return (
    <>
      <div ref={leftRef} className="absolute left-1.5 top-[calc(var(--bar)+0.25rem)] bottom-1.5 w-[11.5rem] flex flex-col gap-1 overflow-y-auto pointer-events-auto">
        {[['p', Z], ['n', N], ['e', E]].map(particle)}
        <div className="glass rounded-xl p-1 grid grid-cols-2 gap-1 text-[11px] font-bold">
          {quick}
          {tools}
        </div>
      </div>
      <div ref={rightRef} className="absolute right-1.5 top-[calc(var(--bar)+0.25rem)] flex flex-col gap-1.5 overflow-y-auto overscroll-contain pointer-events-auto" style={{ width: 'min(18rem, 36vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }}>
        {chart ? chartBox : finding ? finder : beaming ? beams : missionsOpen ? missions : card}
      </div>
    </>
  )

  // a computer or a tablet: the particles on the left, the card at the top, the missions and the chart
  // on the right, the finder at the bottom
  return (
    <>
      <div ref={leftRef} className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto w-44">
        {[['p', Z], ['n', N], ['e', E]].map(particle)}
        <div className="glass rounded-2xl p-1.5 grid grid-cols-2 gap-1 text-xs font-bold">{quick}</div>
        {beams}
      </div>

      <div className="absolute inset-x-0 top-[calc(var(--bar)+0.25rem)] flex justify-center pointer-events-none px-2">
        <div ref={topRef} style={{ width: 'min(32rem, calc(100vw - 35rem))', minWidth: '16rem' }}>{card}</div>
      </div>

      <div ref={rightRef} className="absolute right-3 top-[calc(var(--bar)+0.25rem)] flex flex-col gap-2 items-end pointer-events-none" style={{ maxHeight: 'calc(100vh - var(--bar) - 4.5rem)' }}>
        {!chart && missions}
        <button type="button" onClick={() => setChart(c => !c)} className={`glass rounded-xl px-3 py-1.5 text-xs font-bold pointer-events-auto hover:bg-white/10 ${chart ? 'bg-white/20' : ''}`}>
          🗺️ {t('forge.chart')}
        </button>
        {chart && <div className="w-[24rem] max-h-[calc(100vh-var(--bar)-7rem)] overflow-y-auto overscroll-contain pointer-events-auto rounded-2xl">{chartBox}</div>}
        {/* fusion in stars, on top of this forge's physics (docs/knowledge/star-forge.md) */}
        <Link to="/stars" className="glass rounded-xl px-3 py-1.5 text-xs font-bold pointer-events-auto hover:bg-white/10">🌟 {t('hud.stars')}</Link>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none px-2">
        <div ref={bottomRef}>{finder}</div>
      </div>
    </>
  )
}
