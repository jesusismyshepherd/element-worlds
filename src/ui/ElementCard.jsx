/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FAMILY, nameOf } from '../data/elements.js'
import { temperature, density, num, config, LANG_TAG } from './format.js'
import { WINGS } from '../worlds/registry.js'
import { loadContent, contentCached } from '../content/index.js'
import { pick } from '../content/stations.js'

// which fact each element's card was on, so coming back to an element goes on from there
const AT = new Map()

/** What the element's Atomling says when asked to "tell me something" (its facts), one at a time:
 *  the arrows, a click on the text or T go through them (the user, 2026-10-28: the card said only
 *  how many protons and electrons, which the number already says). Every fact sits in the same grid
 *  cell, so the card keeps the height of the longest and the arrows stay where they are. */
function Facts({ el, lang, level, color, touch }) {
  const { t } = useTranslation()
  const [, redraw] = useState(0)
  const words = contentCached(el.symbol)
  useEffect(() => {
    if (!contentCached(el.symbol)) loadContent(el.symbol).then(() => redraw(n => n + 1))
  }, [el.symbol])
  const facts = pick(words?.facts, lang, level) ?? []
  const n = facts.length
  const i = (AT.get(el.symbol) ?? 0) % Math.max(n, 1)
  const go = step => {
    AT.set(el.symbol, (i + step + n) % n)
    redraw(k => k + 1)
  }
  useEffect(() => {
    if (n < 2) return undefined
    const onKey = e => {
      if (e.code !== 'KeyT' || e.repeat || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)) return
      go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  if (!n) return null
  const arrow = 'w-8 h-7 rounded-lg text-base leading-none hover:bg-white/10 active:scale-95 transition'
  return (
    <div data-facts className="mt-2 rounded-xl bg-white/5 border-l-2" style={{ borderColor: color }}>
      <button type="button" data-fact="text" onClick={() => go(1)} className="grid w-full text-left px-2.5 pt-1.5 text-sm" aria-live="polite">
        {facts.map((f, k) => (
          <span key={k} className={`[grid-area:1/1] ${k === i ? '' : 'invisible'}`} aria-hidden={k !== i}>{f}</span>
        ))}
      </button>
      <div className="flex items-center gap-0.5 pl-2.5 pr-1 pb-0.5 text-xs">
        <span className="mr-auto opacity-70">💬 {t('card.facts')}</span>
        {n > 1 && (
          <>
            <button type="button" data-fact="prev" onClick={() => go(-1)} aria-label={t('card.prevFact')} title={t('card.prevFact')} className={arrow}>‹</button>
            <span data-fact="count" className="opacity-70 tabular-nums">{i + 1} / {n}</span>
            <button type="button" data-fact="next" onClick={() => go(1)} aria-label={t('card.nextFact')} title={touch ? t('card.nextFact') : `${t('card.nextFact')} (T)`} className={arrow}>›</button>
          </>
        )}
      </div>
    </div>
  )
}

/** An element's card on the plaza: the tile as on a printed table and what matters at each level.
 *  compact (a phone): the tile, the name and "Step inside" in one strip; the rest a tap away. */
export default function ElementCard({ el, level, selected, onEnter, touch, compact = false }) {
  const [more, setMore] = useState(false)
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const tag = LANG_TAG[lang] ?? lang
  const color = FAMILY[el.family].color
  const state = el.state ? t(el.statePredicted ? 'state.at20Predicted' : 'state.at20', { state: t(`state.${el.state}`) }) : null
  const sci = level === 'scientist'
  if (compact) return (
    <div data-card className="glass rounded-2xl p-2 shadow-2xl text-left w-full">
      <div className="flex gap-2.5 items-center">
        <div
          className="shrink-0 w-14 h-14 rounded-xl flex flex-col justify-between p-1 font-display"
          style={{ background: `linear-gradient(160deg, ${color}55, ${color}18)`, border: `2px solid ${color}` }}
        >
          <div className="text-[10px] leading-none opacity-90">{el.z}</div>
          <div className="text-2xl font-bold leading-none text-center">{el.symbol}</div>
          <div className="text-[9px] leading-none text-center opacity-80">{num(el.mass, tag, 4)}</div>
        </div>
        <button type="button" onClick={() => setMore(m => !m)} className="min-w-0 flex-1 text-left" aria-expanded={more}>
          <div className="font-display text-xl font-bold leading-tight truncate">{nameOf(el, lang)} <span className="text-xs opacity-60 align-middle">{more ? '▴' : '▾'}</span></div>
          <div className="text-xs font-bold truncate" style={{ color }}>{t(`family.${el.family}`)}{state ? <span className="text-white/80 font-normal"> · {state}</span> : null}</div>
        </button>
        {selected && (
          <button
            type="button"
            onClick={onEnter}
            className="shrink-0 font-display font-bold text-base px-3 py-2 rounded-xl text-[#0b0f24] shadow-lg active:scale-95 transition"
            style={{ background: color }}
          >
            {t('card.enter')} ▶
          </button>
        )}
      </div>
      {more && (
        <div className="mt-2 max-h-[30vh] overflow-y-auto">
          {el.radioactive && <div className="text-xs text-lime-300">☢ {t('card.radioactive')}</div>}
          {WINGS[el.symbol] && <div className="text-xs text-amber-300">★ {t('card.worlds', { count: WINGS[el.symbol].length })}</div>}
          {!sci && <Facts el={el} lang={lang} level={level} color={color} touch={touch} />}
          {sci && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13px] mt-1">
              <dt className="opacity-70">{t('card.mass')}</dt><dd>{num(el.mass, tag, 6)} u</dd>
              <dt className="opacity-70">{t('card.config')}</dt><dd>{config(el.config)}</dd>
              <dt className="opacity-70">{t('card.group')} · {t('card.period')} · {t('card.block')}</dt>
              <dd>{el.group ?? '–'} · {el.period} · {el.block}</dd>
              <dt className="opacity-70">{t('card.en')}</dt><dd>{el.en ?? '?'}</dd>
              <dt className="opacity-70">{t('card.melt')}</dt><dd>{temperature(el.melt, level, tag)}</dd>
              <dt className="opacity-70">{t('card.boil')}</dt><dd>{temperature(el.boil, level, tag)}</dd>
              <dt className="opacity-70">{t('card.density')}</dt><dd>{density(el, tag)}</dd>
              <dt className="opacity-70">{t('card.discovered')}</dt><dd>{el.ancient ? t('card.ancient') : el.discovered ?? '?'}</dd>
            </dl>
          )}
        </div>
      )}
    </div>
  )
  return (
    <div data-card className="glass rounded-2xl p-3 sm:p-4 w-[min(92vw,22rem)] shadow-2xl text-left">
      <div className="flex gap-3 items-stretch">
        <div
          className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex flex-col justify-between p-1.5 font-display"
          style={{ background: `linear-gradient(160deg, ${color}55, ${color}18)`, border: `2px solid ${color}` }}
        >
          <div className="text-xs sm:text-sm leading-none opacity-90">{el.z}</div>
          <div className="text-4xl sm:text-5xl font-bold leading-none text-center">{el.symbol}</div>
          <div className="text-[10px] sm:text-xs leading-none text-center opacity-80">{num(el.mass, tag, 5)}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-2xl sm:text-3xl font-bold leading-tight truncate">{nameOf(el, lang)}</div>
          <div className="text-sm font-bold" style={{ color }}>{t(`family.${el.family}`)}</div>
          {state && <div className="text-sm opacity-90 mt-0.5">{state}</div>}
          {el.radioactive && <div className="text-xs mt-0.5 text-lime-300">☢ {t('card.radioactive')}</div>}
          {WINGS[el.symbol] && <div className="text-xs mt-0.5 text-amber-300">★ {t('card.worlds', { count: WINGS[el.symbol].length })}</div>}
        </div>
      </div>
      {!sci && <Facts el={el} lang={lang} level={level} color={color} touch={touch} />}
      {sci && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13px] mt-2">
          <dt className="opacity-70">{t('card.mass')}</dt><dd>{num(el.mass, tag, 6)} u</dd>
          <dt className="opacity-70">{t('card.config')}</dt><dd>{config(el.config)}</dd>
          <dt className="opacity-70">{t('card.group')} · {t('card.period')} · {t('card.block')}</dt>
          <dd>{el.group ?? '–'} · {el.period} · {el.block}</dd>
          <dt className="opacity-70">{t('card.en')}</dt><dd>{el.en ?? '?'}</dd>
          <dt className="opacity-70">{t('card.melt')}</dt><dd>{temperature(el.melt, level, tag)}</dd>
          <dt className="opacity-70">{t('card.boil')}</dt><dd>{temperature(el.boil, level, tag)}</dd>
          <dt className="opacity-70">{t('card.density')}</dt><dd>{density(el, tag)}</dd>
          <dt className="opacity-70">{t('card.discovered')}</dt><dd>{el.ancient ? t('card.ancient') : el.discovered ?? '?'}</dd>
        </dl>
      )}
      {selected && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onEnter}
            className="font-display font-bold text-lg px-5 py-2 rounded-xl text-[#0b0f24] shadow-lg active:scale-95 transition"
            style={{ background: color }}
          >
            {t('card.enter')} ▶
          </button>
          <span className="text-xs opacity-70 leading-tight">{t(touch ? 'card.tapAgain' : 'card.clickAgain')}</span>
        </div>
      )}
    </div>
  )
}
