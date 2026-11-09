/* eslint-disable react/prop-types */
// The HUD of the lab's bench "Reactions" (/lab/reactions; src/worlds/benches/reactions/), at the edges so the
// bench has the middle (docs/knowledge/hud-layout.md): the reactions to pick (a column on the left; a strip
// at the bottom of an upright phone), the reaction, its equation and what to do next (a card at the top),
// the atoms counted on both sides and the buttons (a bar at the bottom). Every word comes from the bench's
// words.js (four languages, both depths). docs/knowledge/reactions.md.
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../engine/store.js'
import { store } from '../../state.js'
import { element, nameOf } from '../../data/elements.js'
import { useCover, useViewport } from '../layout.js'
import { say, num } from '../../worlds/benches/reactions/words.js'
import { stateOf } from '../../worlds/benches/reactions/chemistry.js'

const COLOR = { H: '#f4f6fb', C: '#a3a9b4', N: '#7d95ff', O: '#ff6a5e', Na: '#c99bff', Cl: '#5ff05f', Fe: '#ff9a66', Ca: '#7dff5c' }
const colorOf = s => COLOR[s] ?? element(s)?.cpk ?? '#ffffff'

/** A formula with real subscripts: C6H12O6 -> C₆H₁₂O₆. */
function Formula({ text }) {
  return <span>{[...text.matchAll(/([A-Z][a-z]?|\(|\))|(\d+)/g)].map((m, i) => (m[2] ? <sub key={i}>{m[2]}</sub> : <span key={i}>{m[1]}</span>))}</span>
}

/** The equation as it stands: the player's numbers (the Scientist's without the ones, and with states). */
function Equation({ r, sci }) {
  const term = (f, kx, key) => (
    <span key={key} className="whitespace-nowrap">
      {(!sci || kx > 1) && <span className="text-amber-300">{kx}&thinsp;</span>}
      <Formula text={f} />
      {sci && <span className="text-[0.55em] opacity-75 align-baseline">({stateOf(f, r.water)})</span>}
    </span>
  )
  const side = (list, off) => list.map((f, s) => [s > 0 && <span key={`p${s}`} className="opacity-70"> + </span>, term(f, r.k[off + s], s)])
  return (
    <span>
      {side(r.left, 0)}
      <span className="text-sky-200"> → </span>
      {side(r.right, r.left.length)}
    </span>
  )
}

export default function ReactionsHud({ engine }) {
  const { i18n } = useTranslation()
  const r = useStore(store, s => s.reactions)
  const levelNow = useStore(store, s => s.level)
  const lang = i18n.resolvedLanguage
  const level = levelNow === 'scientist' ? 'scientist' : 'explorer'
  const sci = level === 'scientist'
  const world = engine?.world
  const vp = useViewport()
  const narrow = vp.narrow
  const side = vp.short && !vp.narrow
  const [listOpen, setListOpen] = useState(() => !(window.innerWidth < 640 || window.innerHeight < 520))
  const [factOpen, setFactOpen] = useState(false)
  const listRef = useRef(null)
  const cardRef = useRef(null)
  const barRef = useRef(null)
  useCover(listRef, 'left', !!r && !narrow)
  useCover(cardRef, 'top', !!r)
  useCover(barRef, 'bottom', !!r)
  const w = (path, v) => say(lang, level, path, v)
  // a note (the bench is full, nine is the most) goes after a while; the celebration too
  useEffect(() => {
    if (!r?.note) return undefined
    const id = setTimeout(() => world?.clearNote?.(), 4500)
    return () => clearTimeout(id)
  }, [r?.note]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!r?.celebrate) return undefined
    const id = setTimeout(() => world?.clearCelebrate?.(), 8000)
    return () => clearTimeout(id)
  }, [r?.celebrate?.at]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setFactOpen(false), [r?.id, r?.phase])
  if (!r) return null

  const name = w(`reactions.${r.id}.name`)
  const found = r.list.filter(x => x.done).length
  const before = r.phase === 'before'
  const after = r.phase === 'after'
  const moving = r.phase === 'running' || r.phase === 'returning'
  const ready = before && r.balanced && (!r.needs || r.on)

  // what to do next, or what happened
  let status = null
  let tone = 'opacity-90'
  if (moving) status = w('running')
  else if (after) {
    const kJ = num(Math.abs(r.dH), lang)
    const dH = num(r.dH, lang, { digits: 1, plus: true })
    const litres = num(r.litres ?? 0, lang, { digits: 1 })
    status = r.dH < 0
      ? w('gave', { kJ, dH, litres, water: r.waterChoice ? say(lang, level, `water.${r.water}`) : '' })
      : w('took', { kJ, dH, litres, from: w(`from.${r.needs}`) })
    tone = r.dH < 0 ? 'text-amber-200' : 'text-sky-200'
  } else if (r.note === 'full' || r.note === 'most' || r.note === 'locked') {
    status = w(r.note)
    tone = 'text-amber-200'
  } else if (!r.balanced) {
    const off = r.tally.find(t => !t.ok)
    status = `${w('goal')} ${off ? w('off', { name: nameOf(element(off.el), lang), sym: off.el, left: off.left, right: off.right }) : ''}`
    tone = r.note === 'unbalanced' ? 'text-rose-200' : 'opacity-90'
  } else if (r.divisor > 1) {
    status = w('lowest', { d: r.divisor })
    tone = 'text-emerald-200'
  } else if (r.needs && !r.on) {
    status = w(`needs.${r.needs}`)
    tone = r.note === 'needs' ? 'text-rose-200' : 'text-amber-200'
  } else {
    status = w('balanced')
    tone = 'text-emerald-300'
  }
  // a balanced equation that is a multiple may still run (its energy is that many times)
  const party = r.celebrate && after

  return (
    <>
      {/* the reactions: a column on the left (icons only on a phone on its side), a strip on an upright phone */}
      {!narrow && (
        <div ref={listRef} data-reactions-list className={`absolute left-2 sm:left-3 glass rounded-2xl pointer-events-auto overflow-y-auto ${side ? 'top-[calc(var(--bar)+0.25rem)] bottom-1.5 p-1 w-[3.4rem]' : 'top-[calc(var(--bar)+0.5rem)] p-2.5 w-[14.5rem] max-h-[calc(100vh-var(--bar)-6rem)]'}`}>
          {!side && (
            <button type="button" onClick={() => setListOpen(o => !o)} className="font-display font-bold text-sm w-full text-left flex items-center justify-between gap-2 px-1">
              <span>{w('list')} · {found}/{r.list.length}</span>
              <span className="opacity-60">{listOpen ? '▴' : '▾'}</span>
            </button>
          )}
          {(listOpen || side) && <ul className={side ? 'space-y-1' : 'space-y-0.5 mt-1.5'}>
            {r.list.map(x => (
              <li key={x.id}>
                <button
                  type="button"
                  data-reaction={x.id}
                  title={say(lang, level, `reactions.${x.id}.name`)}
                  disabled={moving}
                  onClick={() => world?.pick?.(x.id)}
                  className={`w-full text-left flex items-center gap-2 rounded-xl ${side ? 'justify-center h-10 relative' : 'px-1.5 py-1'} ${x.id === r.id ? 'bg-white/15 ring-1 ring-sky-300/60' : 'hover:bg-white/10'} disabled:opacity-60`}
                >
                  <span className="text-lg leading-none">{x.icon}</span>
                  {!side && <span className="text-[13px] font-bold leading-tight min-w-0 flex-1">{say(lang, level, `reactions.${x.id}.name`)}</span>}
                  {x.done && <span className={`text-emerald-300 text-xs ${side ? 'absolute right-0.5 top-0' : ''}`}>✔</span>}
                </button>
              </li>
            ))}
          </ul>}
        </div>
      )}

      {/* the reaction and what to do: a card at the top */}
      <div className={`absolute top-[calc(var(--bar)+0.25rem)] flex pointer-events-none ${side ? 'left-[4.4rem] right-2 justify-start' : narrow ? 'inset-x-0 justify-center px-2' : 'left-[16rem] right-[1rem] justify-center'}`}>
        <div ref={cardRef} data-reactions-card className={`glass rounded-2xl px-4 py-2 text-center pointer-events-auto ${party ? 'border-amber-300/70 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : ''}`} style={{ maxWidth: side ? 'min(30rem, 60vw)' : '32rem' }}>
          {/* (on a phone the celebration takes the title's line, and what happened opens on a tap) */}
          {party && <div className="font-display font-bold text-amber-300 leading-tight mb-0.5">🎉 {w('made', { name })}</div>}
          {r.together?.length > 0 && (
            <div data-reactions-together className="text-xs font-bold mb-0.5">
              👥 {w('together')}
              {r.together.map((m, i) => <span key={i} style={{ color: m.color }}>{i ? ', ' : ''}{m.name}</span>)}
            </div>
          )}
          {!(party && vp.compact) && (
            <div className={`font-display font-bold leading-tight ${side ? 'text-sm' : 'text-[15px]'}`}>
              <span className="mr-1">{r.list.find(x => x.id === r.id)?.icon}</span>
              {name}
              {!side && <span className="font-normal opacity-75"> · {w(`reactions.${r.id}.tag`)}</span>}
            </div>
          )}
          <div data-reactions-equation className={`font-display font-bold leading-snug ${side ? 'text-lg' : narrow ? 'text-xl' : 'text-2xl'}`}>
            <Equation r={r} sci={sci} />
          </div>
          {after && vp.compact ? (
            <button type="button" data-reactions-status onClick={() => setFactOpen(o => !o)} className={`w-full text-[13px] leading-snug mt-0.5 ${tone} ${factOpen ? '' : side ? 'line-clamp-1' : 'line-clamp-2'}`}>
              {status}{!factOpen && <span className="opacity-70"> ⓘ</span>}
            </button>
          ) : (
            <div data-reactions-status className={`text-[13px] leading-snug mt-0.5 ${tone}`}>{status}</div>
          )}
          {after && (!vp.compact || factOpen) && (
            <button type="button" data-reactions-fact onClick={() => setFactOpen(o => !o)} className="w-full text-[12.5px] opacity-85 mt-1 leading-snug">
              {w(`reactions.${r.id}.fact`)}
            </button>
          )}
          {sci && r.waterChoice && (
            <div data-reactions-water className="flex items-center justify-center gap-1 text-[12px] mt-1">
              <span className="opacity-75">{w('water.label')}</span>
              {['l', 'g'].map(x => (
                <button key={x} type="button" disabled={moving} onClick={() => world?.setWater?.(x)} className={`rounded-full px-2 py-0.5 font-bold ${r.water === x ? 'bg-sky-300 text-[#0b0f24]' : 'bg-white/10 hover:bg-white/20'}`}>
                  {say(lang, level, `water.${x}`)} ({x})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* the atoms on both sides and the buttons: a bar at the bottom (the reactions' strip under it on an upright phone) */}
      <div ref={barRef} data-reactions-bar className={`absolute flex flex-col gap-1.5 pointer-events-none ${side ? 'right-1.5 bottom-1.5 items-end left-[4.4rem]' : narrow ? 'inset-x-0 bottom-2 px-2 items-stretch' : 'left-[16rem] right-[1rem] bottom-3 items-center'}`}>
        {!vp.compact && before && <div className="text-xs opacity-70 text-center">{w('help')}</div>}
        <div className={`flex items-center gap-1.5 flex-wrap ${narrow ? 'justify-center' : 'justify-center'}`}>
          <div data-reactions-tally className="glass rounded-2xl px-2 py-1 flex items-center gap-1 pointer-events-auto">
            <span className="text-[11px] opacity-70 px-1">{w('atoms')}</span>
            {r.tally.map(t => (
              <span
                key={t.el}
                title={`${nameOf(element(t.el), lang)}: ${w('off', { name: nameOf(element(t.el), lang), sym: t.el, left: t.left, right: t.right })}`}
                className={`rounded-xl px-1.5 py-0.5 flex items-center gap-1 text-[13px] font-bold ${t.ok ? 'bg-emerald-400/20 ring-1 ring-emerald-300/50' : 'bg-rose-500/20 ring-1 ring-rose-300/40'}`}
              >
                <span className="font-display" style={{ color: colorOf(t.el) }}>{t.el}</span>
                <span>{t.left}</span>
                <span className="opacity-60 text-[11px]">→</span>
                <span>{t.right}</span>
                <span className={t.ok ? 'text-emerald-300' : 'text-rose-300'}>{t.ok ? '✔' : '✗'}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {r.needs && before && (
              <button type="button" data-reactions-source onClick={() => world?.toggleSource?.()} className={`glass rounded-xl px-3 py-1.5 text-sm font-bold ${r.on ? 'border-amber-300/70 text-amber-200' : ''}`}>
                {{ light: '☀️', heat: '🔥', power: '🔋' }[r.needs]} {say(lang, level, `source.${r.needs}.${r.on ? 'on' : 'off'}`)}
              </button>
            )}
            {!after ? (
              <button
                type="button"
                data-reactions-run
                disabled={moving}
                onClick={() => world?.run?.()}
                className={`rounded-xl px-4 py-1.5 text-sm font-bold transition ${ready ? 'bg-amber-300 text-[#0b0f24] shadow-[0_0_18px_rgba(252,211,77,0.55)] animate-pulse' : 'glass opacity-80'}`}
              >
                ▶ {w('run')}
              </button>
            ) : (
              <>
                <button type="button" data-reactions-again onClick={() => world?.again?.()} className="glass rounded-xl px-3 py-1.5 text-sm font-bold">↺ {w('again')}</button>
                <button type="button" data-reactions-next onClick={() => world?.next?.()} className="rounded-xl px-3 py-1.5 text-sm font-bold bg-sky-300 text-[#0b0f24]">{w('next')} ▶</button>
              </>
            )}
          </div>
        </div>
        {narrow && (
          <div data-reactions-list className="flex gap-1 overflow-x-auto pointer-events-auto pb-0.5 justify-start">
            {r.list.map(x => (
              <button
                key={x.id}
                type="button"
                data-reaction={x.id}
                title={say(lang, level, `reactions.${x.id}.name`)}
                disabled={moving}
                onClick={() => world?.pick?.(x.id)}
                className={`glass shrink-0 w-11 h-11 rounded-xl flex items-center justify-center relative text-lg ${x.id === r.id ? 'ring-2 ring-sky-300/80' : ''} disabled:opacity-60`}
              >
                {x.icon}
                {x.done && <span className="absolute right-0.5 top-0 text-emerald-300 text-[10px]">✔</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
