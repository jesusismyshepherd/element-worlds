/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { nuclide, commonestN, nuclideSymbol } from '../chem/nucleus.js'
import { MISSIONS, describe, decayText, isotopeName, halfLifeText, noteText } from '../worlds/forge/words.js'
import NuclideChart from './NuclideChart.jsx'

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

/** True on a narrow (upright phone) screen, kept up to date. */
function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return narrow
}

/** Finds an element by symbol, number or name (either language), or the first whose name starts so. */
function findElement(q) {
  const s = q.trim().toLowerCase()
  if (!s) return null
  const exact = ELEMENTS.find(e => e.symbol.toLowerCase() === s || String(e.z) === s || nameOf(e, 'en').toLowerCase() === s || nameOf(e, 'pt-pt').toLowerCase() === s)
  return exact ?? ELEMENTS.find(e => nameOf(e, 'en').toLowerCase().startsWith(s) || nameOf(e, 'pt-pt').toLowerCase().startsWith(s))
}

/** The Atom Forge's HUD: the particles, what the atom is, the missions, the chart of nuclides. */
export default function ForgeHud({ engine }) {
  const { t, i18n } = useTranslation()
  const f = useStore(store, s => s.forge)
  const party = useStore(store, s => s.forgeCelebrate)
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const world = engine?.world
  const narrow = useNarrow()
  const [missionsOpen, setMissionsOpen] = useState(!narrow)
  const [more, setMore] = useState(!narrow)
  const [chart, setChart] = useState(false)
  const [hint, setHint] = useState(null)
  const [query, setQuery] = useState('')
  const [finding, setFinding] = useState(false)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ forgeCelebrate: null }), 6000)
    return () => clearTimeout(id)
  }, [party])
  if (!f) return null

  const { Z, N, E } = f
  const nuc = nuclide(Z, N)
  const lines = describe({ Z, N, E, nuc, common: Z ? commonestN(Z) : 0, held: f.held, note: f.note }, lang, level)
  const event = f.event ? decayText(f.event, lang) : null
  const sym = nuclideSymbol(Z, N, E)
  const title = Z ? isotopeName(Z, N, lang) : N === 1 ? t('forge.aNeutron') : N > 1 ? t('forge.neutronsAlone', { count: N }) : t('forge.nothing')
  const half = nuc.t ? halfLifeText(nuc.t, lang) : null
  const chip = t(`forge.kind.${nuc.kind === 'unknown' && !nuc.side ? 'notMade' : nuc.kind}`)
  const lonely = Z === 0 && f.note ? noteText(f.note, lang, level) : null
  const go = e => {
    e.preventDefault()
    const el = findElement(query)
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
  const particle = ([k, count]) => (
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
        autoFocus={narrow}
      />
      <button type="submit" className="rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-bold">{t('forge.go')}</button>
    </form>
  )
  const missions = (
    <div className="glass rounded-2xl p-2.5 w-[min(80vw,16rem)] pointer-events-auto max-h-[45vh] overflow-y-auto">
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

  return (
    <>
      {/* the particles: a column on the left, or a bar at the bottom of an upright phone */}
      {narrow ? (
        <div className="absolute inset-x-0 bottom-0 p-2 flex flex-col gap-1.5 pointer-events-none">
          {finding && <div className="flex justify-center">{finder}</div>}
          {missionsOpen && <div className="flex justify-end">{missions}</div>}
          <div className="flex flex-wrap gap-1 justify-center pointer-events-auto text-[11px] font-bold">
            {quick}
            <button type="button" className={btn} onClick={() => setMissionsOpen(o => !o)}>🏆 {f.done.length}/{MISSIONS.length}</button>
            <button type="button" className={`${btn} ${chart ? 'bg-white/25' : ''}`} onClick={() => setChart(c => !c)} aria-label={t('forge.chart')}>🗺️</button>
            <button type="button" className={`${btn} ${finding ? 'bg-white/25' : ''}`} onClick={() => setFinding(x => !x)} aria-label={t('forge.find')}>🔎</button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pointer-events-auto">{[['p', Z], ['n', N], ['e', E]].map(particle)}</div>
        </div>
      ) : (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto w-44">
          {[['p', Z], ['n', N], ['e', E]].map(particle)}
          <div className="glass rounded-2xl p-1.5 grid grid-cols-2 gap-1 text-xs font-bold">{quick}</div>
        </div>
      )}

      {/* what the atom is */}
      <div className="absolute inset-x-0 top-14 sm:top-16 flex justify-center pointer-events-none px-2">
        <div className="glass rounded-2xl px-3 sm:px-4 py-2 text-center w-full max-w-lg pointer-events-auto">
          <div className="flex items-baseline justify-center gap-2.5 flex-wrap">
            {sym && <span className="font-display text-3xl sm:text-4xl font-bold leading-none">{sym}</span>}
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
      </div>

      {/* the missions and the chart (on a phone they open from the bottom bar) */}
      {!narrow && (
        <div className="absolute right-3 top-36 flex flex-col gap-2 items-end pointer-events-none">
          {missions}
          <button type="button" onClick={() => setChart(c => !c)} className="glass rounded-xl px-3 py-1.5 text-xs font-bold pointer-events-auto hover:bg-white/10">
            🗺️ {t('forge.chart')}
          </button>
        </div>
      )}

      {chart && (
        <div className={`absolute glass rounded-2xl p-3 pointer-events-auto ${narrow ? 'inset-x-2 top-14 max-h-[70vh] overflow-y-auto' : 'right-3 bottom-20 w-[24rem]'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="font-display font-bold">{t('forge.chart')}</div>
            <button type="button" onClick={() => setChart(false)} className="rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
          </div>
          <div className="text-xs opacity-80 mb-2">{t(level === 'scientist' ? 'forge.chartSci' : 'forge.chartKid')}</div>
          <NuclideChart Z={Z} N={N} onPick={(z, n) => world?.set?.(z, n, z)} />
        </div>
      )}

      {!narrow && <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none px-2">{finder}</div>}

      {party && (
        <div className={`absolute inset-x-0 flex justify-center pointer-events-none px-2 ${narrow ? 'bottom-48' : 'bottom-16'}`}>
          <div className="glass rounded-3xl px-6 py-4 text-center shadow-2xl animate-[pulse_1.2s_ease-in-out_2] border-amber-300/60">
            <div className="text-3xl">🎉</div>
            <div className="font-display text-sm font-bold opacity-80 mt-1">{t('forge.missionDone')}</div>
            <div className="font-display text-2xl font-bold text-amber-300">{party.name}</div>
          </div>
        </div>
      )}
    </>
  )
}
