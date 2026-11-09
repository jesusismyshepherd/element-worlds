/* eslint-disable react/prop-types */
// The HUD of the lab's bench "Growing Crystals" (/lab/crystal; worlds/benches/crystal/), at the edges so
// the dish has the middle (docs/knowledge/hud-layout.md): the compounds (a column on the left; a strip at
// the bottom of an upright phone), what the dish is doing and the moment a crystal is done (a card at the
// top), the speed, the buttons and what there is to read (a card on the right; on an upright phone the
// controls at the bottom and the reading in the top card). docs/knowledge/crystal.md.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../engine/store.js'
import { store } from '../../state.js'
import { useCover, useViewport } from '../layout.js'
import { COMPOUNDS, COMPOUND } from '../../worlds/benches/crystal/lattice.js'
import { FINDS } from '../../worlds/benches/crystal/plan.js'
import { ui, sub, ionSym, ionOne, num, lengthText, compoundName, statusText, partyText, aboutText, tapText, grainText, findName, complicatedText } from '../../worlds/benches/crystal/words.js'

const WARM = '#ffb45e'
const COOL = '#7fd0ff'

export default function CrystalHud({ engine }) {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const level = useStore(store, s => s.level)
  const k = useStore(store, s => s.crystal)
  const party = useStore(store, s => s.crystalCelebrate)
  const world = engine?.world
  const vp = useViewport()
  const narrow = vp.narrow
  const side = vp.short && !vp.narrow
  const [speed, setSpeed] = useState(null) // the slider while it is being moved
  const [aboutOpen, setAboutOpen] = useState(() => !(window.innerWidth < 640 || window.innerHeight < 520))
  const [foundOpen, setFoundOpen] = useState(false)
  const [seedAt, setSeedAt] = useState(0)
  const leftRef = useRef(null)
  const topRef = useRef(null)
  const rightRef = useRef(null)
  const bottomRef = useRef(null)
  useCover(leftRef, 'left', !!k && !narrow)
  useCover(topRef, 'top', !!k && !side)
  useCover(rightRef, 'right', !!k && !narrow)
  useCover(bottomRef, 'bottom', !!k && narrow)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ crystalCelebrate: null }), 7000)
    return () => clearTimeout(id)
  }, [party])
  // the slider: the speed is set when the hand lets go (each change starts a new dish)
  useEffect(() => {
    if (speed == null || !k || Math.abs(speed - k.s) < 0.005) return undefined
    const id = setTimeout(() => {
      world?.setSpeed?.(speed)
      setSpeed(null)
    }, 450)
    return () => clearTimeout(id)
  }, [speed]) // eslint-disable-line react-hooks/exhaustive-deps
  // the moment the seed crystal appears: told for a few seconds
  const phase = k?.phase
  const prev = useRef(phase)
  useEffect(() => {
    if (prev.current === 'drift' && phase === 'grow') setSeedAt(Date.now())
    prev.current = phase
  }, [phase])
  const [, tick] = useState(0)
  useEffect(() => {
    if (!seedAt) return undefined
    const id = setTimeout(() => tick(x => x + 1), 3200)
    return () => clearTimeout(id)
  }, [seedAt])
  if (!k) return null

  const W = ui(lang)
  const cmp = COMPOUND[k.c]
  const medium = cmp.medium
  const s = speed ?? k.s
  const found = k.found.length
  const btn = 'rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition px-2 py-1.5 text-[12px] font-bold disabled:opacity-40'

  // the top card's line: what the dish is doing, or the moment
  const seeding = seedAt && Date.now() - seedAt < 3000 && phase === 'grow'
  let line
  if (party) line = partyText(party.kind, party.c, lang, level)
  else if (phase === 'waiting' || phase === 'drift') line = statusText(phase, k.c, lang, level)
  else if (seeding) line = statusText('seed', k.c, lang, level)
  else if (phase === 'done') line = partyText(k.habit, k.c, lang, level)
  else line = null

  const title = (
    <div className={`font-display font-bold leading-tight ${side || narrow ? 'text-base' : 'text-xl'}`}>
      <span>{sub(k.c)}</span>
      <span className="text-amber-300 font-bold text-[0.8em]"> · {compoundName(k.c, lang)}</span>
    </div>
  )
  const count = (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="opacity-80">{W.ionsIn}:</span>
      <span className="font-display font-bold tabular-nums">{num(k.count, lang)}</span>
      <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden min-w-[3rem]">
        <span className="block h-full bg-gradient-to-r from-sky-300 to-amber-300" style={{ width: `${Math.round(k.progress * 100)}%` }} />
      </span>
    </div>
  )
  const legend = (
    <div className="flex gap-2 text-[11px] font-bold flex-wrap">
      {[[cmp.cation, WARM], [cmp.anion, COOL]].map(([sym, color]) => (
        <span key={sym} className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
          <span style={{ color }}>{ionSym(sym)}</span>
          {!narrow && <span className="opacity-80 font-normal">{ionOne(sym, lang)}</span>}
        </span>
      ))}
    </div>
  )

  // what there is to read: the grain, a tapped ion, or about this crystal
  const zoom = k.zoom
  const reading = zoom ? (
    <div data-crystal-grain className="text-[13px] leading-snug">
      <div className="text-[11px] opacity-75 mb-0.5">{W.zooming}: <b className="tabular-nums">{lengthText(zoom.across * Math.pow(zoom.times, zoom.share), lang)}</b></div>
      {zoom.share > 0.98 && <div>{grainText(zoom, k.c, lang, level)}</div>}
      <button type="button" className={`${btn} mt-1.5`} onClick={() => world?.zoomBack?.()}>↩ {W.back}</button>
    </div>
  ) : k.tap ? (
    <div data-crystal-tap className="text-[13px] leading-snug">
      <div className="flex items-start gap-2">
        <span className="font-display font-bold text-lg leading-none" style={{ color: k.tap.kind === 0 ? WARM : COOL }}>{ionSym(k.tap.sym)}</span>
        <span className="flex-1">{tapText(k.tap, k.c, lang, level)}</span>
        <button type="button" aria-label={W.close} className="opacity-70 hover:opacity-100 px-1" onClick={() => world?.clearTap?.()}>✕</button>
      </div>
    </div>
  ) : null
  const about = aboutText(k.c, lang, level)
  const aboutBlock = (
    <div className="text-[12.5px] leading-snug">
      <button type="button" onClick={() => setAboutOpen(o => !o)} className="w-full text-left font-bold text-[12px] flex items-center justify-between">
        <span>ⓘ {W.about}</span>
        <span className="opacity-60">{aboutOpen ? '▴' : '▾'}</span>
      </button>
      {aboutOpen && (
        <div data-crystal-about className="mt-1 space-y-1 opacity-95">
          <p>{about.structure}</p>
          <p>{about.medium}</p>
          <p className="text-[11px] opacity-70">{complicatedText(lang, level)}</p>
        </div>
      )}
    </div>
  )
  const foundBlock = (
    <div className="text-[12px]">
      <button type="button" onClick={() => setFoundOpen(o => !o)} className="w-full text-left font-bold flex items-center justify-between">
        <span>✦ {W.found} · {found}/{FINDS.length}</span>
        <span className="opacity-60">{foundOpen ? '▴' : '▾'}</span>
      </button>
      {foundOpen && (
        <ul className="mt-1 grid grid-cols-1 gap-0.5">
          {FINDS.map(f => (
            <li key={f} className="flex items-center gap-1.5">
              <span className={k.found.includes(f) ? 'text-emerald-300' : 'opacity-50'}>{k.found.includes(f) ? '✔' : '○'}</span>
              {/* (a found one keeps its text readable: never struck through) */}
              <span className={k.found.includes(f) ? 'opacity-70' : ''}>{findName(f, lang)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const slider = (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[12px] font-bold">
        <span>{medium === 'water' ? '💧' : '🔥'} {W.speed[medium]}</span>
        <span className="opacity-80 font-normal">{s < 0.3 ? W.slow[medium] : s > 0.66 ? W.fast[medium] : '·'}</span>
      </div>
      <input
        type="range" min="0" max="100" value={Math.round(s * 100)}
        onChange={e => setSpeed(Number(e.target.value) / 100)}
        className="w-full accent-amber-300" data-crystal-speed aria-label={W.speed[medium]}
      />
      <div className="flex justify-between text-[10px] opacity-70"><span>{W.slow[medium]}</span><span>{W.fast[medium]}</span></div>
    </div>
  )
  const buttons = (
    <div className="flex gap-1.5 flex-wrap">
      <button type="button" className={btn} onClick={() => world?.regrow?.()} title={W.newDish}>🔄{vp.compact ? '' : ` ${W.newDish}`}</button>
      <button type="button" className={`${btn} ${k.inside ? 'bg-sky-400/40 hover:bg-sky-400/50' : ''}`} onClick={() => world?.setInside?.(!k.inside)} title={k.inside ? W.fullSize : W.inside} data-crystal-inside>
        🔍{vp.compact ? '' : ` ${k.inside ? W.fullSize : W.inside}`}
      </button>
      <button type="button" className={btn} disabled={!k.count} onClick={() => (zoom ? world?.zoomBack?.() : world?.zoomOut?.())} title={W.grain} data-crystal-zoom>🔭{vp.compact ? '' : ` ${W.grain}`}</button>
    </div>
  )
  const picker = (cls, itemCls) => (
    <div className={cls}>
      {COMPOUNDS.map(c => {
        const on = c.id === k.c
        const done = k.grownAll.find(g => g.c === c.id)?.done
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => world?.pick?.(c.id)}
            title={`${compoundName(c.id, lang)} · ${W.from[c.medium]}`}
            data-crystal-pick={c.id}
            className={`${itemCls} relative flex flex-col items-center justify-center rounded-xl font-display font-bold transition active:scale-95 ${on ? 'bg-amber-300/30 ring-1 ring-amber-300/80' : 'bg-white/5 hover:bg-white/15'}`}
          >
            <span className="leading-none">{sub(c.id)}</span>
            <span className="text-[9px] leading-none mt-0.5 opacity-80">{c.medium === 'water' ? '💧' : '🔥'}{done ? <span className="text-emerald-300"> ✔</span> : null}</span>
          </button>
        )
      })}
    </div>
  )
  const together = k.together?.length > 0 && (
    <div data-crystal-together className="text-[11px] font-bold">
      👥 {W.together}{k.together.map((m, i) => <span key={i} style={{ color: m.color }}>{i ? ', ' : ''}{m.name}</span>)}
    </div>
  )

  // ---- an upright phone: the card at the top (what there is to read too), the controls at the bottom ----
  if (narrow) {
    return (
      <>
        <div className="absolute inset-x-0 top-[calc(var(--bar)+0.25rem)] px-2 flex justify-center pointer-events-none">
          <div ref={topRef} className={`glass rounded-2xl px-3 py-2 w-full max-w-[28rem] pointer-events-auto overflow-y-auto max-h-[40vh] ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`}>
            {title}
            {together}
            {k.by && <div className="text-[11px] opacity-75">{W.by(k.by)}</div>}
            {reading ? <div className="mt-1">{reading}</div> : (
              <>
                {line && <div className={`text-[13px] leading-snug mt-0.5 ${party ? 'text-amber-200 font-bold' : ''}`}>{party && '🎉 '}{line}</div>}
                {(phase === 'grow' || phase === 'done') && <div className="mt-1">{count}</div>}
                {aboutOpen && <div className="mt-1 space-y-1 text-[12px] leading-snug opacity-90"><p>{about.structure}</p><p>{about.medium}</p></div>}
              </>
            )}
          </div>
        </div>
        <div ref={bottomRef} className="absolute inset-x-0 bottom-1.5 px-2 flex flex-col gap-1.5 pointer-events-none">
          {picker('flex gap-1 overflow-x-auto pointer-events-auto pb-0.5', 'shrink-0 w-12 h-11 text-[15px] glass')}
          <div className="glass rounded-2xl px-2.5 py-1.5 flex items-center gap-2 pointer-events-auto">
            <div className="flex-1 min-w-0">{slider}</div>
            {buttons}
            <button type="button" className={`${btn} ${aboutOpen ? 'bg-sky-400/40' : ''}`} onClick={() => setAboutOpen(o => !o)} aria-label={W.about}>ⓘ</button>
          </div>
        </div>
      </>
    )
  }

  // ---- a phone on its side: the compounds in a narrow column on the left, all the rest down the right
  // (the screen is too low for a card at the top) ----
  if (side) {
    return (
      <>
        <div ref={leftRef} className="absolute left-1.5 top-[calc(var(--bar)+0.25rem)] bottom-1.5 glass rounded-2xl p-1 pointer-events-auto overflow-y-auto w-[5.7rem]">
          {picker('grid grid-cols-2 gap-1', 'h-8 text-[12px]')}
        </div>
        <div ref={rightRef} data-crystal-card className={`absolute right-1.5 top-[calc(var(--bar)+0.25rem)] bottom-1.5 w-[13.5rem] glass rounded-2xl p-2 pointer-events-auto overflow-y-auto flex flex-col gap-1.5 ${party ? 'border-amber-300/70' : ''}`}>
          {title}
          {together}
          {k.by && <div className="text-[11px] opacity-75">{W.by(k.by)}</div>}
          {reading ?? (
            <>
              {line && <div className={`text-[12px] leading-snug line-clamp-3 ${party ? 'text-amber-200 font-bold' : ''}`}>{party && '🎉 '}{line}</div>}
              {(phase === 'grow' || phase === 'done') && count}
            </>
          )}
          {slider}
          {buttons}
          {!reading && <div className="border-t border-white/10 pt-1.5">{aboutBlock}</div>}
          <div className="border-t border-white/10 pt-1.5">{foundBlock}</div>
        </div>
      </>
    )
  }

  // ---- a computer ----
  return (
    <>
      <div ref={leftRef} className="absolute left-3 top-1/2 -translate-y-1/2 glass rounded-2xl p-2 pointer-events-auto w-[10.5rem]">
        <div className="text-[12px] font-bold mb-1 px-0.5">🧂 {W.compounds}</div>
        {picker('grid grid-cols-3 gap-1', 'h-11 text-[15px]')}
        <div className="mt-2 px-0.5">{legend}</div>
      </div>

      <div className="absolute top-[calc(var(--bar)+0.25rem)] flex pointer-events-none inset-x-0 justify-center px-2">
        <div ref={topRef} data-crystal-card className={`glass rounded-2xl px-4 py-2 pointer-events-auto ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`} style={{ maxWidth: 'min(30rem, 42vw)' }}>
          {title}
          {together}
          {k.by && <div className="text-[11px] opacity-75">{W.by(k.by)}</div>}
          {line && <div className={`text-[13px] leading-snug mt-0.5 ${party ? 'text-amber-200 font-bold' : ''}`}>{party && '🎉 '}{line}</div>}
          {phase === 'waiting' && (
            <button type="button" onClick={() => world?.start?.()} className="mt-1.5 rounded-full bg-sky-400/25 hover:bg-sky-400/40 px-3 py-1 text-[12px] font-bold animate-pulse" data-crystal-start>
              👆 {W.tapStart[medium]}
            </button>
          )}
          {(phase === 'grow' || phase === 'done') && <div className="mt-1">{count}</div>}
        </div>
      </div>

      <div ref={rightRef} className="absolute right-2 sm:right-3 glass rounded-2xl p-3 pointer-events-auto overflow-y-auto flex flex-col gap-2.5 top-[calc(var(--bar)+0.75rem)] w-[18rem] max-h-[calc(100vh-var(--bar)-4.5rem)]">
        {slider}
        {buttons}
        {reading && <div className="border-t border-white/10 pt-2">{reading}</div>}
        {!reading && <div className="border-t border-white/10 pt-2">{aboutBlock}</div>}
        <div className="border-t border-white/10 pt-2">{foundBlock}</div>
      </div>

      <div className="absolute inset-x-0 bottom-3 text-center text-xs opacity-70 px-4 pointer-events-none">{W.help}</div>
    </>
  )
}
