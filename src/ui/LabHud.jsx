/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { element, nameOf } from '../data/elements.js'
import { handsOf, parseFormula } from '../chem/build.js'

const PALETTE = ['H', 'C', 'N', 'O', 'F', 'Cl', 'S']
const COLOR = { H: '#f4f6fb', C: '#5a5f68', N: '#3a5cf5', O: '#f2302b', F: '#90e050', Cl: '#1ff01f', S: '#ffd21f' }

/** A formula with real subscripts: CO2 -> CO₂. */
export function Formula({ text }) {
  return <span>{[...text.matchAll(/([A-Z][a-z]?|\(|\))|(\d+)/g)].map((m, i) => (m[2] ? <sub key={i}>{m[2]}</sub> : <span key={i}>{m[1]}</span>))}</span>
}

/** The Molecule Lab's HUD: the palette, what is on the table, the missions, the celebration. */
export default function LabHud({ engine }) {
  const { t, i18n } = useTranslation()
  const lab = useStore(store, s => s.lab)
  const party = useStore(store, s => s.labCelebrate)
  const [hint, setHint] = useState(null)
  // on a small screen the missions fold into a button, so the molecule stays in view
  const [open, setOpen] = useState(() => window.innerWidth >= 640)
  const lang = i18n.resolvedLanguage
  const world = engine?.world
  useEffect(() => {
    if (!party) return undefined
    const id = setTimeout(() => store.set({ labCelebrate: null }), 6500)
    return () => clearTimeout(id)
  }, [party])
  if (!lab) return null

  const recipe = show => {
    const n = {}
    for (const a of parseFormula(show)) n[a.el] = (n[a.el] ?? 0) + 1
    return Object.entries(n).map(([el, k]) => `${k} × ${nameOf(element(el), lang)}`).join(', ')
  }
  const done = lab.missions.filter(m => m.done).length

  return (
    <>
      <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 pointer-events-auto">
        {PALETTE.map(s => (
          <button
            key={s}
            type="button"
            title={`${nameOf(element(s), lang)}: ${t('lab.hands', { count: handsOf(s) })}`}
            onClick={() => world?.add?.(s)}
            className="glass w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center hover:bg-white/10 active:scale-95 transition"
          >
            <span className="font-display text-xl font-bold" style={{ color: COLOR[s] }}>{s}</span>
            <span className="text-[10px] opacity-80 leading-none">{'✋'.repeat(handsOf(s))}</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 top-14 sm:top-16 flex justify-center pointer-events-none px-2">
        <div className="glass rounded-2xl px-4 py-2 text-center max-w-md">
          {lab.count === 0 ? (
            <div className="text-sm">{t('lab.start')}</div>
          ) : (
            <>
              <div className="font-display text-2xl font-bold"><Formula text={lab.formula} /></div>
              <div className="text-sm">
                {lab.name ? <span className="font-bold text-amber-300">{lab.name}</span> : null}
                {lab.name && !lab.complete ? <span> · </span> : null}
                {lab.complete ? (lab.name ? null : <span>{t('lab.stable')}</span>) : <span>{t('lab.free', { count: lab.free })}</span>}
              </div>
              {lab.fact && lab.complete && <div className="text-[13px] opacity-90 mt-1">{lab.fact}</div>}
            </>
          )}
        </div>
      </div>

      <div className="absolute right-2 sm:right-3 top-48 sm:top-32 glass rounded-2xl p-3 w-[min(60vw,15rem)] pointer-events-auto max-h-[55vh] overflow-y-auto">
        <button type="button" onClick={() => setOpen(o => !o)} className="font-display font-bold text-sm w-full text-left flex items-center justify-between gap-2">
          <span>{t('lab.missions')} · {done}/{lab.missions.length}</span>
          <span className="opacity-60">{open ? '▴' : '▾'}</span>
        </button>
        {open && <ul className="space-y-0.5 text-[13px] mt-1">
          {lab.missions.map(m => (
            <li key={m.show}>
              <button type="button" onClick={() => setHint(hint === m.show ? null : m.show)} className="w-full text-left flex items-center gap-1.5 rounded px-1 hover:bg-white/10">
                <span className={m.done ? 'text-emerald-300' : 'opacity-50'}>{m.done ? '✔' : '○'}</span>
                <span className="font-bold"><Formula text={m.show} /></span>
                <span className="opacity-80 truncate">{m.name}</span>
              </button>
              {hint === m.show && (
                <div className="pl-6 text-xs opacity-90 pb-1">
                  {recipe(m.show)}
                  {m.done && <button type="button" className="ml-2 underline" onClick={() => world?.demo?.(m.show)}>{t('lab.show')}</button>}
                </div>
              )}
            </li>
          ))}
        </ul>}
      </div>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 pointer-events-none">
        <button type="button" disabled={!lab.selected} onClick={() => world?.removeSelected?.()} className="glass rounded-xl px-3 py-1.5 text-sm font-bold pointer-events-auto disabled:opacity-40">
          {t('lab.remove')}{lab.selected ? ` ${lab.selected}` : ''}
        </button>
        <button type="button" onClick={() => world?.clear?.()} className="glass rounded-xl px-3 py-1.5 text-sm font-bold pointer-events-auto">{t('lab.clear')}</button>
      </div>

      <div className="absolute inset-x-0 bottom-14 text-center text-xs opacity-70 px-4 pointer-events-none hidden sm:block">{t('lab.help')}</div>

      {party && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass rounded-3xl px-6 py-5 text-center shadow-2xl animate-[pulse_1.2s_ease-in-out_2] border-amber-300/60">
            <div className="text-4xl">🎉</div>
            <div className="font-display text-2xl font-bold mt-1">{t('lab.made', { name: party.name })}</div>
            <div className="font-display text-3xl font-bold text-amber-300"><Formula text={party.show} /></div>
          </div>
        </div>
      )}
    </>
  )
}
