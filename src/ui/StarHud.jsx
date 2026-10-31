/* eslint-disable react/prop-types */
// The Star Forge's HUD (/stars, docs/knowledge/star-forge.md), at the edges so the star keeps the middle
// (docs/knowledge/hud-layout.md): the places, the sliders (the star's mass and its life; the neutron rain)
// and the path on the chart or the binding curve on the left; what is happening and the next tap in a card
// at the top; the missions and the table of what was made on the right. An upright phone has the card at
// the top and a bar at the bottom whose tools open above it; a phone on its side, a column each side.
// The words come from the world's state (worlds/stars/card.js), so a change of language or level shows at
// once; every step is also a tap on the 3D (the world's own taps), the HUD's sliders the smooth ones.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { useCover, useViewport } from './layout.js'
import { M_MIN, M_MAX, ageAt, phasesOf } from '../worlds/stars/life.js'
import { wordsOf, at, sunsText, timeKid, timeSci, MISSIONS } from '../worlds/stars/words.js'
import { cardOf } from '../worlds/stars/card.js'
import { LAYER, LABEL, layersOf } from '../worlds/stars/layers.js'
import StarTable from './StarTable.jsx'
import NeutronPath from './NeutronPath.jsx'
import BindingCurve from './BindingCurve.jsx'

const PLACE_ICON = { star: '☀️', slow: '🐢', rapid: '💥' }
const LOG = Math.log(M_MAX / M_MIN)
const massOf = v => M_MIN * Math.exp((v / 1000) * LOG)
const sliderOf = m => Math.round((Math.log(m / M_MIN) / LOG) * 1000)
const PHASE_MARK = { h: 'H', rg: 'H', he: 'He', agb: 'He', c: 'C', ne: 'Ne', o: 'O', si: 'Si' }

/** A slider with its label and value: above it, or beside it on a phone (the HUD may not grow tall). */
function Slider({ label, value, compact, children }) {
  if (compact) return (
    <label className="flex items-center gap-2">
      <span className="w-[5.5rem] shrink-0 leading-tight text-[10px] font-bold"><span className="block opacity-80">{label}</span><span className="block truncate">{value}</span></span>
      <span className="flex-1 min-w-0">{children}</span>
    </label>
  )
  return (
    <label className="block">
      <div className="flex justify-between text-[11px] font-bold gap-2"><span>{label}</span><span className="truncate">{value}</span></div>
      {children}
    </label>
  )
}

export default function StarHud({ engine }) {
  const { i18n } = useTranslation()
  const s = useStore(store, x => x.stars)
  const party = useStore(store, x => x.starsCelebrate)
  const level = useStore(store, x => x.level)
  const lang = i18n.resolvedLanguage
  const vp = useViewport()
  const narrow = vp.narrow
  const side = vp.short && !vp.narrow
  const world = engine?.world
  const [missionsOpen, setMissionsOpen] = useState(() => window.innerHeight > 860 && window.innerWidth > 1100)
  const [hint, setHint] = useState(null)
  const [more, setMore] = useState(false)
  const [tool, setTool] = useState(null) // phones: 'missions', 'table', 'chart'
  const [view, setView] = useState('made')
  const [curve, setCurve] = useState(false)
  const leftRef = useRef(null)
  const topRef = useRef(null)
  const rightRef = useRef(null)
  const bottomRef = useRef(null)
  useCover(leftRef, 'left', !!s && !narrow)
  useCover(topRef, 'top', !!s && !side)
  useCover(rightRef, 'right', !!s && !narrow)
  useCover(bottomRef, 'bottom', !!s && narrow)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ starsCelebrate: null }), 6000)
    return () => clearTimeout(id)
  }, [party])
  useEffect(() => setMore(false), [s?.place, s?.i, s?.end?.kind])
  if (!s) return null

  const W = wordsOf(lang)
  const sci = level === 'scientist'
  const card = cardOf(s, lang, level)
  const pickView = v => {
    setView(v)
    if (v === 'origins') world?.origins?.()
  }
  const btn = 'rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition px-2 py-1.5'

  const places = (
    <div className={`flex ${narrow || side ? 'flex-row' : 'flex-col'} gap-1`} role="group">
      {['star', 'slow', 'rapid'].map(p => (
        <button
          key={p}
          type="button"
          data-star-place={p}
          title={W.placeTip[p]}
          onClick={() => world?.go?.(p)}
          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold text-left flex items-center gap-1.5 ${s.place === p ? 'bg-white text-[#0b0f24]' : 'bg-white/10 hover:bg-white/20'} ${narrow || side ? (s.place === p ? 'flex-1 min-w-0 justify-center' : 'shrink-0 justify-center') : ''}`}
        >
          <span aria-hidden>{PLACE_ICON[p]}</span>
          {(!(narrow || side) || s.place === p) && <span className="truncate">{W.place[p]}</span>}
        </button>
      ))}
    </div>
  )

  // the sliders of the place on show
  const ph = phasesOf(s.m)
  const age = s.lit ? ageAt(s.m, s.i, s.f) : 0
  const compact = narrow || side
  const ageText = s.lit ? `${compact ? '' : `${W.age}: `}${age < 1 ? '0' : sci ? timeSci(age, lang) : timeKid(age, lang)}` : W.phase.proto
  const controls = s.place === 'star' ? (
    <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-1.5'}`}>
      <Slider label={W.mass} value={sunsText(s.m, lang)} compact={compact}>
        <input type="range" min="0" max="1000" value={sliderOf(s.m)} onChange={e => world?.setMass?.(massOf(Number(e.target.value)))} className="w-full accent-amber-300" data-star-mass aria-label={W.mass} />
      </Slider>
      <Slider label={compact && s.lit ? W.age : W.life} value={ageText} compact={compact}>
        <input type="range" min="0" max="1000" value={Math.round(s.x * 1000)} onChange={e => world?.setLife?.(Number(e.target.value) / 1000)} className="w-full accent-amber-300" data-star-life aria-label={W.life} />
        <div className="flex gap-[2px]" aria-hidden>
          {ph.map((p, k) => (
            <span key={k} className={`flex-1 text-center text-[9px] font-bold rounded-sm ${s.lit && k === s.i && !s.end ? 'bg-amber-300 text-[#1a1030]' : s.lit && k < s.i ? 'bg-white/25' : 'bg-white/10 opacity-70'}`} title={W.phase[p.id]}>{PHASE_MARK[p.id]}</span>
          ))}
        </div>
      </Slider>
      {s.lit && !s.end && !compact && (
        // the onion on the cut faces, from the core out (the burning layers flame)
        <div className="flex flex-wrap gap-[3px] items-center" data-star-layers>
          <span className="text-[10px] opacity-75 mr-0.5">{W.core} →</span>
          {layersOf(ph[s.i]?.id, s.f, true).filter((L, k, all) => !(k === all.length - 1 && all[k - 1]?.k === 'H')).map((L, k) => (
            <span key={k} className="rounded px-1 text-[10px] font-bold leading-4" style={{ background: LAYER[L.k], color: L.k === 'He' || L.k === 'SiS' ? '#10142e' : '#ffffff' }}>
              {L.burn ? '🔥' : ''}{LABEL[L.k]}
            </span>
          ))}
        </div>
      )}
    </div>
  ) : s.place === 'slow' ? (
    <div className="flex flex-col gap-1.5">
      <Slider label={W.rate} value={s.slow.rate > 0 ? W.rateOn : W.rateOff} compact={compact}>
        <input type="range" min="0" max="100" value={Math.round(s.slow.rate * 100)} onChange={e => world?.setRate?.(Number(e.target.value) / 100)} className="w-full accent-amber-300" data-star-rate aria-label={W.rate} />
      </Slider>
      <button type="button" className={`${btn} text-[11px] font-bold`} onClick={() => world?.slowReset?.()}>{W.restart}</button>
    </div>
  ) : null

  const chart = s.place === 'slow' || s.place === 'rapid' ? (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] font-bold">{W.chart}</div>
      <NeutronPath kind={s.place} Z={s.slow.Z} N={s.slow.N} k={s.rapid.k} done={s.rapid.phase === 'decay' || s.rapid.phase === 'done'} scientist={sci} />
      <div className="text-[10px] opacity-75 leading-snug">{sci ? W.chartSci : W.chartKid}</div>
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] font-bold">{W.binding.title}</div>
      <BindingCurve axis={W.binding.axis} mass={W.binding.mass} />
      <div className="text-[10px] opacity-80 leading-snug">{at(W.binding, level)}</div>
    </div>
  )

  const missions = (
    <div className="glass rounded-2xl p-2.5 pointer-events-auto">
      <button type="button" onClick={() => setMissionsOpen(o => !o)} className="font-display font-bold text-sm w-full text-left flex items-center justify-between gap-2">
        <span>{W.missions} · {s.done.length}/{MISSIONS.length}</span>
        <span className="opacity-60">{missionsOpen ? '▴' : '▾'}</span>
      </button>
      {missionsOpen && (
        <ul className="space-y-0.5 text-[13px] mt-1">
          {MISSIONS.map(ms => {
            const done = s.done.includes(ms.id)
            return (
              <li key={ms.id}>
                <button type="button" onClick={() => setHint(hint === ms.id ? null : ms.id)} className="w-full text-left flex items-center gap-1.5 rounded px-1 hover:bg-white/10">
                  <span className={done ? 'text-emerald-300' : 'opacity-50'}>{done ? '✔' : '○'}</span>
                  <span className="truncate">{ms.name[lang] ?? ms.name.en}</span>
                </button>
                {hint === ms.id && <div className="pl-6 text-xs opacity-90 pb-1">{ms.hint[lang] ?? ms.hint.en}</div>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
  const table = (
    <div className="glass rounded-2xl p-2.5 pointer-events-auto">
      <StarTable made={s.made} newly={s.newly} view={view} lang={lang} level={level} onView={pickView} />
    </div>
  )

  // what is happening, and the next tap
  const cardBox = (
    <div className={`glass rounded-2xl px-3 sm:px-4 py-2 pointer-events-auto w-full ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`} data-star-card>
      {party && <div className={`font-display font-bold text-amber-300 leading-tight mb-1 text-center ${compact ? "text-sm" : ""}`}>🎉 {W.missionDone} <span className="whitespace-nowrap">{party.name}</span></div>}
      <div className="flex items-baseline justify-center gap-2 flex-wrap text-center">
        {card.symbol && <span className={`font-display font-bold leading-none ${side ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>{card.symbol}</span>}
        <span className="font-display text-base sm:text-lg font-bold leading-tight">{card.title}</span>
      </div>
      <div className="mt-1 text-[13px] text-amber-200 font-bold text-center" data-star-prompt>👉 {card.prompt}</div>
      <button type="button" onClick={() => setMore(m => !m)} className="w-full text-left mt-1">
        <ul className={`space-y-0.5 text-[13px] leading-snug ${more ? '' : 'line-clamp-2'}`}>
          {card.lines.map((l, k) => <li key={k} className={k ? 'opacity-85' : ''}>{l}</li>)}
        </ul>
        {!more && <span className="text-xs opacity-60">{W.more}</span>}
      </button>
      {more && card.sub && <div className="text-xs opacity-75 mt-1">{card.sub}</div>}
      {card.link && (!compact || more) && (
        <Link to={card.link.to} className="block mt-1 text-xs font-bold text-sky-300 hover:underline">🔭 {card.link.label}</Link>
      )}
    </div>
  )

  const tools = [
    <button key="missions" type="button" className={`${btn} ${tool === 'missions' ? 'bg-white/25' : ''}`} onClick={() => setTool(x => (x === 'missions' ? null : 'missions'))}>🏆 {s.done.length}/{MISSIONS.length}</button>,
    <button key="table" type="button" data-star-tool="table" className={`${btn} ${tool === 'table' ? 'bg-white/25' : ''}`} onClick={() => setTool(x => (x === 'table' ? null : 'table'))} aria-label={W.tools.table}>🧪 {s.made.length}</button>,
    <button key="chart" type="button" className={`${btn} ${tool === 'chart' ? 'bg-white/25' : ''}`} onClick={() => setTool(x => (x === 'chart' ? null : 'chart'))} aria-label={s.place === 'star' ? W.tools.curve : W.tools.chart}>{s.place === 'star' ? '📈' : '🗺️'}</button>,
  ]
  const opened = tool === 'missions' ? missions : tool === 'table' ? table : tool === 'chart' ? <div className="glass rounded-2xl p-2.5 pointer-events-auto">{chart}</div> : null

  // an upright phone: the card at the top, a bar at the bottom (places, sliders, tools), a tool above it
  if (narrow) return (
    <>
      <div ref={topRef} className="absolute inset-x-2 top-[calc(var(--bar)+0.25rem)] flex flex-col pointer-events-none">{cardBox}</div>
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 p-2 flex flex-col gap-1.5 pointer-events-none">
        {opened && <div className="max-h-[36vh] overflow-y-auto overscroll-contain rounded-2xl pointer-events-auto">{opened}</div>}
        <div className="glass rounded-2xl p-1.5 flex flex-col gap-1.5 pointer-events-auto">
          {controls}
          <div className="flex gap-1 items-center">
            <div className="flex-1 min-w-0">{places}</div>
            <div className="flex gap-1 text-[11px] font-bold shrink-0">{tools}</div>
          </div>
        </div>
      </div>
    </>
  )

  // a phone on its side: the places, the sliders and the tools down the left, the card (or the tool
  // opened) down the right
  if (side) return (
    <>
      <div ref={leftRef} className="absolute left-1.5 top-[calc(var(--bar)+0.25rem)] w-[11.5rem] flex flex-col gap-1 overflow-y-auto pointer-events-auto" style={{ maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }}>
        <div className="glass rounded-xl p-1.5 flex flex-col gap-1.5">
          {places}
          {controls}
        </div>
        <div className="glass rounded-xl p-1 grid grid-cols-3 gap-1 text-[11px] font-bold">{tools}</div>
      </div>
      <div ref={rightRef} className="absolute right-1.5 top-[calc(var(--bar)+0.25rem)] flex flex-col gap-1.5 overflow-y-auto overscroll-contain pointer-events-auto" style={{ width: 'min(16rem, 33vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }}>
        {opened ?? cardBox}
      </div>
    </>
  )

  // a computer or a tablet
  return (
    <>
      <div ref={leftRef} className="absolute left-3 top-[calc(var(--bar)+0.5rem)] w-64 flex flex-col gap-2 pointer-events-auto overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - var(--bar) - 1rem)' }}>
        <div className="glass rounded-2xl p-2 flex flex-col gap-2">
          {places}
          {controls}
        </div>
        {(s.place !== 'star' || curve) && <div className="glass rounded-2xl p-2.5">{chart}</div>}
        {s.place === 'star' && (
          <button type="button" onClick={() => setCurve(c => !c)} className={`glass rounded-xl px-3 py-1.5 text-xs font-bold text-left hover:bg-white/10 ${curve ? 'bg-white/20' : ''}`}>{curve ? "✕" : "📈"} {W.binding.title}</button>
        )}
      </div>
      <div className="absolute inset-x-0 top-[calc(var(--bar)+0.25rem)] flex justify-center pointer-events-none px-2">
        <div ref={topRef} style={{ width: 'min(32rem, calc(100vw - 36rem))', minWidth: '16rem' }}>{cardBox}</div>
      </div>
      <div ref={rightRef} className="absolute right-3 top-[calc(var(--bar)+0.25rem)] w-[17rem] flex flex-col gap-2 pointer-events-none overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - var(--bar) - 1rem)' }}>
        {missions}
        {table}
      </div>
    </>
  )
}


