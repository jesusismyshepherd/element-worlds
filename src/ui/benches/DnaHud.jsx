/* eslint-disable react/prop-types */
// The HUD of the lab's bench "Building DNA" (/lab/dna; docs/knowledge/dna.md), at the edges so the helix
// has the middle (docs/knowledge/hud-layout.md): the tray of the four bases (a column on the left; a row at
// the bottom of an upright phone; a little grid on a phone on its side): each slot is a clear button that
// the world draws its base's real molecule into ([data-dna-slot]); the card at the top (the two strands'
// letters, what just happened, a find's celebration); the finds and the facts (a side sheet, a top sheet on
// an upright phone); undo, clear, copy and the twist (the bottom). Words: worlds/benches/dna/words.js.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../engine/store.js'
import { store } from '../../state.js'
import { useCover, useViewport } from '../layout.js'
import { Formula } from '../LabHud.jsx'
import { say, findText, num, WORDS } from '../../worlds/benches/dna/words.js'
import { BASES, FINDS, complement, TWIST } from '../../worlds/benches/dna/bases.js'

const LETTER = { A: '#ffb547', T: '#ff5d8f', G: '#3ddc97', C: '#4cc3ff' }
const SHOW = { A: 'C5H5N5', T: 'C5H6N2O2', G: 'C5H5N5O', C: 'C4H5N3O' }
const RAIL = ['#ffbf3a', '#3aa6ff']

/** The two strands, letter under letter, the hydrogen bonds between them as dots (two or three). */
function Strands({ seq, sci, small }) {
  const box = useRef(null)
  // the newest letter stays in view
  useEffect(() => {
    if (box.current) box.current.scrollLeft = box.current.scrollWidth
  }, [seq])
  if (!seq) return null
  const size = small ? 'text-[13px] w-[0.9rem]' : 'text-[17px] w-[1.15rem]'
  return (
    <div className="flex items-stretch justify-center gap-1 mt-1" data-dna-strands>
      {sci && <div className={`flex flex-col justify-between font-bold ${small ? 'text-[10px]' : 'text-[11px]'} leading-none py-[2px]`}><span style={{ color: RAIL[0] }}>5′</span><span style={{ color: RAIL[1] }}>3′</span></div>}
      <div ref={box} className="flex overflow-x-auto max-w-full" style={{ scrollbarWidth: 'none' }}>
        {[...seq].map((b, k) => {
          const p = complement(b)
          const dots = b === 'A' || b === 'T' ? 2 : 3
          return (
            <div key={k} className={`flex flex-col items-center shrink-0 font-display font-bold leading-none ${size}`}>
              <span style={{ color: LETTER[b] }}>{b}</span>
              <span className="flex gap-[1px] my-[3px]" aria-hidden>
                {Array.from({ length: dots }, (_, i) => <span key={i} className="block w-[2px] h-[5px] rounded-full bg-cyan-100/80" />)}
              </span>
              <span style={{ color: LETTER[p] }}>{p}</span>
            </div>
          )
        })}
      </div>
      {sci && <div className={`flex flex-col justify-between font-bold ${small ? 'text-[10px]' : 'text-[11px]'} leading-none py-[2px]`}><span style={{ color: RAIL[0] }}>3′</span><span style={{ color: RAIL[1] }}>5′</span></div>}
    </div>
  )
}

export default function DnaHud({ engine }) {
  const { t, i18n } = useTranslation()
  const dna = useStore(store, s => s.dna)
  const party = useStore(store, s => s.dnaCelebrate)
  const level = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const world = engine?.world
  const vp = useViewport()
  const narrow = vp.narrow
  const side = vp.short && !vp.narrow
  const sci = level === 'scientist'
  const [info, setInfo] = useState(() => !(window.innerWidth < 640 || window.innerHeight < 520))
  const [fact, setFact] = useState(0)
  const [more, setMore] = useState(false)
  const trayRef = useRef(null)
  const cardRef = useRef(null)
  const infoRef = useRef(null)
  const barRef = useRef(null)
  useCover(trayRef, narrow ? 'bottom' : 'left', !!dna)
  useCover(cardRef, 'top', !!dna && !side)
  useCover(infoRef, narrow ? 'top' : 'right', !!dna && info)
  useCover(barRef, side ? 'right' : 'bottom', !!dna)
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ dnaCelebrate: null }), 6500)
    return () => clearTimeout(id)
  }, [party])
  if (!dna) return null

  const W = WORDS[lang] ?? WORDS.en
  const s = (key, vars) => say(key, lang, level, vars)
  const m = dna.measure
  const busy = dna.phase === 'copying'
  const status = s('status', { n: m.n, hb: m.hbonds, nm: num(m.nm, lang), turns: num(m.turns, lang), gc: m.gc })
  const ev = dna.event
  const eventText = !ev ? null : ev.kind === 'pair' ? s('pair', { b: ev.b, p: ev.p }) : s(ev.kind)
  const message = dna.n === 0 && (!ev || ev.kind === 'cleared' || ev.kind === 'undo') ? s('start') : eventText ?? s('start')
  const found = findText(party?.id ?? 'at', lang, level)
  const facts = W.facts[sci ? 'sci' : 'kid']
  const glass = `glass rounded-xl ${side ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} font-bold pointer-events-auto disabled:opacity-40`
  const slot = narrow ? 'w-[4.6rem] h-[5rem]' : side ? 'w-[3.6rem] h-[3.6rem]' : 'w-[5.8rem] h-[6.4rem]'

  const tray = (
    <div ref={trayRef} data-dna-tray className={narrow
      ? 'absolute inset-x-0 bottom-[6.6rem] flex justify-center gap-2 px-2 pointer-events-none'
      : side
        ? 'absolute left-1.5 top-[calc(var(--bar)+0.25rem)] grid grid-cols-2 gap-1 pointer-events-none'
        : 'absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none'}
    >
      {!narrow && !side && <div className="text-[11px] font-bold opacity-80 text-center">{s('tray')}</div>}
      {BASES.map(b => (
        <button
          key={b}
          type="button"
          data-dna-slot={b}
          disabled={busy}
          onClick={() => world?.add?.(b)}
          title={`${W.name[b]} · ${sci ? W.family[b] : W.holds(complement(b))}`}
          aria-label={`${b}: ${W.name[b]}`}
          className={`${slot} relative rounded-2xl pointer-events-auto transition active:scale-95 disabled:opacity-50 hover:bg-white/5`}
          style={{ border: `1.5px solid ${LETTER[b]}66`, background: `radial-gradient(circle at 50% 42%, ${LETTER[b]}1f, transparent 70%)`, boxShadow: `0 0 18px ${LETTER[b]}22 inset` }}
        >
          <span className="absolute inset-x-0 bottom-0.5 flex flex-col items-center leading-none">
            <span className={`font-display font-bold ${side ? 'text-sm' : 'text-lg'}`} style={{ color: LETTER[b], textShadow: '0 0 6px #0b0f24' }}>{b}</span>
            {!side && <span className="text-[9.5px] opacity-90 mt-[1px]" style={{ textShadow: '0 0 4px #0b0f24' }}>{narrow ? W.name[b] : sci ? <Formula text={SHOW[b]} /> : W.name[b]}</span>}
          </span>
        </button>
      ))}
    </div>
  )

  const strands = <Strands seq={dna.seq} sci={sci} small={vp.compact} />
  // the card: across the top; on a phone on its side, at the top of the right-hand column
  const cardBox = (
    <div ref={side ? null : cardRef} data-dna-card className={`glass rounded-2xl ${side ? 'px-2.5 py-1.5 min-h-0 overflow-y-auto' : 'px-4 py-2'} text-center pointer-events-auto min-w-0 ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`} style={{ maxWidth: side || narrow ? '100%' : '30rem' }}>
        {party && <div className="font-display font-bold text-amber-300 leading-tight mb-0.5">🎉 {found.title}</div>}
        {dna.together?.length > 0 && (
          <div data-dna-together className="text-xs font-bold mb-0.5">
            👥 {t('room.labTogether', { names: '' })}
            {dna.together.map((p, i) => <span key={i} style={{ color: p.color }}>{i ? ', ' : ''}{p.name}</span>)}
          </div>
        )}
        {dna.n > 0 && <div className="text-[12px] font-bold opacity-90">{status}</div>}
        {strands}
        <button type="button" onClick={() => setMore(o => !o)} className={`w-full text-[13px] opacity-95 mt-1 leading-snug ${vp.compact && !more ? (side ? 'line-clamp-2' : 'line-clamp-2') : ''}`} data-dna-message>
          {party ? found.text : message}
        </button>
        {sci && dna.n > 0 && !vp.compact && (
          <div className="text-[11px] opacity-75 mt-0.5">Chargaff: A {m.counts.A} = T {m.counts.T} · G {m.counts.G} = C {m.counts.C}</div>
        )}
    </div>
  )
  const card = side ? null : (
    <div className="absolute top-[calc(var(--bar)+0.25rem)] flex pointer-events-none inset-x-0 justify-center px-2">{cardBox}</div>
  )

  const sheet = info && (
    <div ref={infoRef} data-dna-info className={`absolute glass rounded-2xl p-3 pointer-events-auto overflow-y-auto ${narrow
      ? 'inset-x-2 top-[calc(var(--bar)+0.25rem)] max-h-[40vh] z-10'
      : side
        ? 'right-[12.75rem] top-[calc(var(--bar)+0.25rem)] w-[min(40vw,15rem)] max-h-[calc(100vh-var(--bar)-0.75rem)]'
        : 'right-3 top-32 w-[min(70vw,16rem)] max-h-[58vh]'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-display font-bold text-sm">✦ {W.finds} · {dna.found.length}/{dna.total}</div>
        <button type="button" onClick={() => setInfo(false)} className="opacity-70 text-sm px-1" aria-label="close">✕</button>
      </div>
      <ul className="mt-1 space-y-0.5 text-[13px]">
        {FINDS.map(id => {
          const f = findText(id, lang, level)
          const got = dna.found.includes(id)
          return (
            <li key={id} className="flex items-start gap-1.5" data-dna-find={id}>
              <span className={got ? 'text-emerald-300' : 'opacity-50'}>{got ? '✔' : '○'}</span>
              <span className={got ? '' : 'opacity-60'}>{f.title}</span>
            </li>
          )
        })}
      </ul>
      <div className="mt-2 font-display font-bold text-sm">{s('about')}</div>
      {sci && (
        <table className="w-full text-[12px] mt-1">
          <tbody>
            {W.numbers.map(([k, v]) => (
              <tr key={k}><td className="opacity-80 pr-2 align-top">{k}</td><td className="text-right font-bold whitespace-nowrap">{v}</td></tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-1.5 text-[12.5px] leading-snug min-h-[3.2rem]">{facts[fact % facts.length]}</div>
      <div className="flex items-center justify-between mt-1 text-sm">
        <button type="button" className="px-2 opacity-80" onClick={() => setFact(f => (f + facts.length - 1) % facts.length)} aria-label="previous">‹</button>
        <span className="text-[11px] opacity-60">{(fact % facts.length) + 1}/{facts.length}</span>
        <button type="button" className="px-2 opacity-80" onClick={() => setFact(f => (f + 1) % facts.length)} aria-label="next">›</button>
      </div>
    </div>
  )

  const copyLabel = dna.phase === 'copied' ? W.keepBtn : s('copyBtn')
  const twistValue = sci ? `${num(dna.twist * TWIST, lang)}°` : dna.twist > 0.6 ? W.helix : dna.twist < 0.4 ? W.ladder : '…'
  const slider = (
    <label className={`glass rounded-xl ${side ? 'px-2 py-0.5 gap-1.5 w-full shrink-0' : 'px-3 py-1 gap-2 w-[min(92vw,22rem)]'} pointer-events-auto flex items-center`}>
      <span className="text-[11px] font-bold shrink-0">{s('twist')}</span>
      {!side && <span className="text-[10px] opacity-70 shrink-0">{W.ladder}</span>}
      <input type="range" min="0" max="100" value={Math.round(dna.twist * 100)} onChange={e => world?.setTwist?.(Number(e.target.value) / 100)} className="flex-1 min-w-0 accent-amber-300" data-dna-twist aria-label={s('twist')} />
      {!side && <span className="text-[10px] opacity-70 shrink-0">{W.helix}</span>}
      <span className="text-[11px] font-bold w-[3.2rem] text-right shrink-0">{twistValue}</span>
    </label>
  )
  const buttons = (
    <>
      <button type="button" disabled={!dna.n || busy} onClick={() => world?.undo?.()} className={glass} data-dna-undo>{W.undoBtn}</button>
      <button type="button" disabled={!dna.n} onClick={() => world?.clear?.()} className={glass} data-dna-clear>{W.clearBtn}</button>
      <button type="button" disabled={busy || dna.n < 1} onClick={() => world?.copy?.()} className={`${glass} ${dna.n >= 3 && dna.phase === 'build' ? 'border-emerald-300/60 text-emerald-200' : ''}`} data-dna-copy>🧬 {copyLabel}</button>
      {!info && <button type="button" onClick={() => setInfo(true)} className={glass} data-dna-open>✦ {dna.found.length}/{dna.total}</button>}
    </>
  )
  const bar = side ? (
    <div ref={barRef} className="absolute right-1.5 top-[calc(var(--bar)+0.25rem)] bottom-1.5 w-[12rem] flex flex-col gap-1 justify-between pointer-events-none">
      {cardBox}
      <div className="grid grid-cols-2 gap-1 shrink-0">{buttons}</div>
      {slider}
    </div>
  ) : (
    <div ref={barRef} className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-1.5 px-2 pointer-events-none">
      <div className="flex gap-2 flex-wrap justify-center">{buttons}</div>
      {slider}
    </div>
  )

  return (
    <>
      {tray}
      {card}
      {sheet}
      {bar}
      {!vp.compact && <div className="absolute inset-x-0 bottom-[5.6rem] text-center text-xs opacity-70 px-4 pointer-events-none">{s('help')}</div>}
    </>
  )
}
