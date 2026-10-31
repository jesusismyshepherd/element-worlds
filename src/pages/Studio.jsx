/* eslint-disable react/prop-types */
// The family studio (/studio; docs/knowledge/update-dashboard.md, "The family studio"): the game's
// backlog (docs/studio/backlog.json, built into the page, so a change goes live with the next deploy) for
// anyone with the link, and, signed in with a game account (src/net/account.js, the 👤 sheet), ideas,
// notes and verdicts sent to Claude, each kept with its account (ew_studio_notes through
// src/net/studio.js; supabase/ew_004_studio.sql). Claude answers them in its sessions and the answers
// show under each one. An admin (the user) sees everyone's, with their names; the others their own.
// The page's words follow the game's language (studio.* in the locale files); the backlog's own texts
// are English. A plain page like /stats and /passport: the middle-of-screen rule is for the 3D views.
// Sections and threads: src/studio/model.js. Checked by tools/studio_probe.py.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import backlog from '../../docs/studio/backlog.json'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { AccountSheet } from '../ui/AccountHud.jsx'
import { useNoAutoFullscreen } from '../ui/fullscreen.js'
import { LANGS } from '../i18n/langs.js'
import { listStudio, postStudio } from '../net/studio.js'
import { sections, whose, canVote, threadOf, newestFirst, myVerdict, unanswered, problemOf, dayOf, momentOf, millions, VERDICTS } from '../studio/model.js'

const DATA = sections(backlog)
const KIND = Object.fromEntries(backlog.kinds.map(k => [k.id, k]))
const ITEM = Object.fromEntries(backlog.items.map(i => [i.id, i]))
const WAIT = Object.fromEntries((backlog.waiting ?? []).map(w => [w.id, w]))
const titleOf = id => ITEM[id]?.title ?? WAIT[id]?.title ?? id
const FEED = 8 // what was sent: this many, then "Show all"
// the backlog links to the live site; on the site itself (or a preview, the dev server) stay on it
const here = link => (String(link ?? '').startsWith(backlog.play) ? link.slice(backlog.play.length) || '/' : link)

const MUTED = 'text-[#8f98bf]'
const SOFT = 'text-[#b8c0e0]'
const PRIMARY = 'inline-flex items-center justify-center gap-2 min-h-12 rounded-xl px-5 font-bold bg-sky-300 text-[#0b0f24] hover:bg-sky-200 disabled:opacity-50'
const PLAIN = 'inline-flex items-center justify-center gap-1.5 min-h-11 rounded-xl px-3.5 font-bold border border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300'
const VERDICT_ICON = { first: '⬆️', later: '⏳', no: '✋' }

const Studio_ = createContext(null)
const useStudio = () => useContext(Studio_)

const itemFromHash = () => {
  const m = /^#i-(.+)$/.exec(typeof location === 'undefined' ? '' : location.hash)
  const id = m ? decodeURIComponent(m[1]) : null
  return id && (ITEM[id] || WAIT[id]) ? id : null
}

/** What the signed-in account sent (and, for an admin, everyone), read again when the page comes back
 *  on screen; null while signed out or loading. */
function useRows(me) {
  const [rows, setRows] = useState(null)
  const [failed, setFailed] = useState(false)
  const who = useRef(null)
  const id = me?.id ?? null
  const load = useCallback(async () => {
    who.current = id
    if (!id) {
      setRows(null)
      return
    }
    try {
      const r = await listStudio()
      if (who.current !== id) return
      setRows(Array.isArray(r) ? r : [])
      setFailed(false)
    } catch {
      if (who.current === id) setFailed(true)
    }
  }, [id])
  useEffect(() => {
    load()
    const back = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', back)
    return () => document.removeEventListener('visibilitychange', back)
  }, [load])
  const add = useCallback(row => setRows(rs => [...(rs ?? []).filter(r => r.id !== row.id), row]), [])
  return { rows, failed, load, add }
}

export default function Studio() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const me = useStore(store, s => s.account)
  const { rows, failed, load, add } = useRows(me)
  const [accountOpen, setAccountOpen] = useState(false)
  const [open, setOpen] = useState(itemFromHash)
  useNoAutoFullscreen()

  useEffect(() => {
    const before = document.title
    document.title = t('studio.docTitle')
    return () => {
      document.title = before
    }
  }, [t, lang])
  // signing in from the sheet closes it: the page's own inputs are what come next
  const was = useRef(me?.id)
  useEffect(() => {
    if (!was.current && me?.id) setAccountOpen(false)
    was.current = me?.id
  }, [me?.id])
  useEffect(() => {
    const change = () => setOpen(itemFromHash())
    addEventListener('hashchange', change)
    return () => removeEventListener('hashchange', change)
  }, [])

  const openItem = useCallback(id => {
    setOpen(id)
    try {
      history.replaceState(history.state, '', `#i-${encodeURIComponent(id)}`)
    } catch {
      // the address keeps its hash
    }
  }, [])
  const closeItem = useCallback(() => {
    setOpen(null)
    try {
      history.replaceState(history.state, '', location.pathname + location.search)
    } catch {
      // as above
    }
  }, [])
  /** Post an idea, a note or a verdict: null when it went through, else a key of studio.errors. */
  const send = useCallback(
    async (kind, args) => {
      try {
        const r = await postStudio(kind, args)
        const problem = problemOf(r)
        if (!problem) {
          add(r)
          load()
        }
        return problem
      } catch {
        return 'failed'
      }
    },
    [add, load],
  )
  const ctx = useMemo(() => ({ me, rows, failed, send, openItem, signIn: () => setAccountOpen(true), lang }), [me, rows, failed, send, openItem, lang])

  return (
    <Studio_.Provider value={ctx}>
      <div data-studio className="min-h-full text-[#eef2ff]" style={{ background: '#0b0f24', backgroundImage: 'radial-gradient(110% 520px at 50% 0%, #1b2860 0%, transparent 70%)', backgroundRepeat: 'no-repeat', colorScheme: 'dark' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16 sm:pt-6 flex flex-col gap-10">
          <Header />
          <Tell />
          <Section id="building" title={t('studio.building.title')} hint={t('studio.building.hint')}>
            <Queue items={DATA.building} none={t('studio.building.none')} />
          </Section>
          <Section id="next" title={t('studio.next.title')} hint={t('studio.next.hint')}>
            <Queue items={DATA.next} numbered none={t('studio.next.none')} />
          </Section>
          <Section id="waiting" title={t('studio.waiting.title')} hint={t('studio.waiting.hint')}>
            <Waiting />
          </Section>
          <Section id="ideas" title={t('studio.ideas.title')} hint={t('studio.ideas.hint')}>
            <Ideas />
          </Section>
          <Section id="built" title={t('studio.built.title')} hint={t('studio.built.hint')}>
            <Built />
          </Section>
          <Section id="decided" title={t('studio.decided.title')} hint={t('studio.decided.hint')}>
            <Decided />
          </Section>
          <footer className={`text-sm ${MUTED} border-t border-white/10 pt-4 max-w-3xl`}>{t('studio.footer', { date: dayOf(backlog.updated, lang) })}</footer>
        </div>
        {open && <ItemSheet key={open} id={open} onClose={closeItem} />}
        {accountOpen && (
          // the game's own account sheet (src/ui/AccountHud.jsx), near the top right of the screen
          <div className="fixed inset-0 z-50" style={{ '--bar': '0.5rem' }}>
            <button type="button" aria-label={t('hud.close')} tabIndex={-1} className="absolute inset-0 bg-[#040712]/60 cursor-default" onClick={() => setAccountOpen(false)} />
            <AccountSheet onClose={() => setAccountOpen(false)} />
          </div>
        )}
      </div>
    </Studio_.Provider>
  )
}

function Header() {
  const { t } = useTranslation()
  const { me, lang, signIn } = useStudio()
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Link to="/" className="glass rounded-xl px-3.5 min-h-11 inline-flex items-center font-display font-bold hover:bg-white/10 shrink-0">← {t('studio.play')}</Link>
        <button type="button" data-account-open onClick={signIn} className={`glass rounded-xl px-3.5 min-h-11 font-bold hover:bg-white/10 min-w-0 truncate ${me ? 'ring-1 ring-sky-300/70' : ''}`}>
          👤 {me ? me.username : t('studio.signIn')}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <p className={`text-xs uppercase tracking-[0.14em] ${MUTED}`}>{t('app.title')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">💡 {t('studio.title')}</h1>
          <p className={`mt-2 text-base sm:text-lg ${SOFT} max-w-2xl`}>{t('studio.tagline')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <LangPicker />
          {lang !== 'en' && <p className={`text-xs ${MUTED} max-w-md`} data-english-note>{t('studio.english')}</p>}
        </div>
      </div>
    </header>
  )
}

/** The four languages, as in the game's top bar. */
function LangPicker() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  return (
    <div className="glass rounded-xl p-1 flex text-xs font-bold" role="group" aria-label={t('hud.language')}>
      {LANGS.map(l => (
        <button key={l.code} type="button" data-lang={l.code} lang={l.tag} title={l.name} aria-pressed={lang === l.code} onClick={() => i18n.changeLanguage(l.code)} className={`min-w-9 min-h-9 px-2 rounded-lg ${lang === l.code ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}>
          {l.label}
        </button>
      ))}
    </div>
  )
}

function Section({ id, title, hint, children }) {
  return (
    <section aria-labelledby={`h-${id}`} data-section={id} className="flex flex-col gap-3 min-w-0">
      <div>
        <h2 id={`h-${id}`} className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
        {hint && <p className={`${SOFT} max-w-3xl mt-0.5`}>{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function SignInPrompt({ text, hint, big }) {
  const { signIn } = useStudio()
  return (
    <div className="flex flex-col gap-2 items-start">
      <button type="button" data-signin onClick={signIn} className={`${PRIMARY} ${big ? 'text-lg px-6 min-h-14' : ''}`}>
        👤 {text}
      </button>
      {hint && <p className={`text-sm ${SOFT} max-w-xl`}>{hint}</p>}
    </div>
  )
}

/** Tell Claude: an idea or a message, then what was sent and Claude's answers. */
function Tell() {
  const { t } = useTranslation()
  const { me } = useStudio()
  return (
    <section aria-labelledby="h-tell" data-section="tell" className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <h2 id="h-tell" className="font-display text-2xl sm:text-3xl font-bold">{t('studio.tell.title')}</h2>
        <p className={`${SOFT} max-w-2xl mt-0.5`}>{t('studio.tell.hint')}</p>
      </div>
      {me ? (
        <>
          <TellForm />
          <Sent />
        </>
      ) : (
        <SignInPrompt big text={t('studio.tell.signIn')} hint={t('studio.tell.signInHint')} />
      )}
    </section>
  )
}

function TellForm() {
  const { t } = useTranslation()
  const { send } = useStudio()
  const [kind, setKind] = useState('idea')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const submit = async e => {
    e.preventDefault()
    if (busy) return
    if (!text.trim()) {
      setStatus(t('studio.errors.empty'))
      return
    }
    setBusy(true)
    setStatus(t('studio.tell.sending'))
    const problem = await send(kind, { text: text.trim() })
    setBusy(false)
    setStatus(problem ? t(`studio.errors.${problem}`) : t('studio.tell.sent'))
    if (!problem) setText('')
  }
  return (
    <form onSubmit={submit} data-tell-form className="flex flex-col gap-3" noValidate>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('studio.tell.what')}>
        {[['idea', '💡', t('studio.tell.idea')], ['note', '💬', t('studio.tell.message')]].map(([k, icon, label]) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} data-tell-kind={k} onClick={() => setKind(k)} className={`min-h-11 rounded-xl px-4 font-bold border ${kind === k ? 'bg-white text-[#0b0f24] border-white' : 'border-white/20 hover:bg-white/10'}`}>
            {icon} {label}
          </button>
        ))}
      </div>
      <label className="sr-only" htmlFor="tell-text">{t('studio.tell.label')}</label>
      <textarea id="tell-text" data-tell-text rows={4} maxLength={4000} value={text} onChange={e => setText(e.target.value)} placeholder={kind === 'idea' ? t('studio.tell.ideaHolder') : t('studio.tell.messageHolder')} className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-base leading-relaxed outline-none focus:border-sky-300 placeholder:text-[#8f98bf] resize-y" />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" data-tell-send disabled={busy} className={`${PRIMARY} text-lg px-6`}>
          {busy ? t('studio.tell.sending') : `${t('studio.tell.send')} ➜`}
        </button>
        <p role="status" data-tell-status className={`text-sm ${SOFT} min-w-0`}>{status}</p>
      </div>
    </form>
  )
}

/** Everything the account sent (an admin: everyone), newest first, each with Claude's answer. */
function Sent() {
  const { t } = useTranslation()
  const { me, rows, failed } = useStudio()
  const [all, setAll] = useState(false)
  const list = newestFirst(rows)
  const shown = all ? list : list.slice(0, FEED)
  const waiting = unanswered(rows)
  return (
    <div className="flex flex-col gap-1 border-t border-white/10 pt-4" data-sent>
      <h3 className="font-display text-xl font-bold">{me.admin ? t('studio.sent.everyone') : t('studio.sent.mine')}</h3>
      {me.admin && <p className={`text-sm ${MUTED}`} data-admin-note>{t('studio.sent.everyoneHint')}</p>}
      {rows == null ? (
        <p className={`text-sm ${MUTED}`}>{failed ? t('studio.sent.failed') : t('studio.sent.loading')}</p>
      ) : list.length === 0 ? (
        <p className={`text-sm ${MUTED}`}>{t('studio.sent.none')}</p>
      ) : (
        <>
          <p className={`text-sm ${waiting ? 'text-amber-200' : 'text-emerald-300'}`} data-unanswered={waiting}>
            {waiting ? t('studio.sent.waiting', { count: waiting }) : t('studio.sent.allAnswered')}
          </p>
          <ol className="flex flex-col">
            {shown.map(r => (
              <Entry key={r.id} r={r} about />
            ))}
          </ol>
          {list.length > FEED && (
            <button type="button" onClick={() => setAll(a => !a)} className={`${PLAIN} self-start mt-1`}>
              {all ? t('studio.sent.fewer') : t('studio.sent.more', { n: list.length })}
            </button>
          )}
        </>
      )}
    </div>
  )
}

/** One thing sent: who, what, when, whether Claude answered, and the answer. */
function Entry({ r, about }) {
  const { t } = useTranslation()
  const { lang, openItem } = useStudio()
  const kind = r.kind === 'verdict' ? t('studio.entry.verdict') : r.kind === 'idea' ? t('studio.entry.idea') : t('studio.entry.note')
  const answered = !!r.replied_at
  return (
    <li data-entry={r.id} data-kind={r.kind} className="border-t border-white/10 first:border-t-0 py-3 flex flex-col gap-1.5">
      <p className={`text-xs ${SOFT} flex flex-wrap items-center gap-x-1.5 gap-y-1`}>
        <b className="text-sm text-white" data-entry-who>{r.username ?? '?'}</b>
        <span>· {kind} ·</span>
        <time dateTime={r.created_at}>{momentOf(r.created_at, lang)}</time>
        <span className={`ml-1 rounded-full border px-2 py-px ${answered ? 'border-emerald-300/60 text-emerald-300' : 'border-white/20'}`}>{answered ? t('studio.entry.answered') : t('studio.entry.waiting')}</span>
      </p>
      {about && r.item && (
        <button type="button" onClick={() => openItem(r.item)} className={`self-start text-left text-xs ${MUTED} underline decoration-white/20 underline-offset-2 hover:text-white`}>
          {t('studio.entry.about', { title: titleOf(r.item) })}
        </button>
      )}
      {r.kind === 'verdict' ? (
        <p className="font-bold" data-entry-text>
          {VERDICT_ICON[r.value]} {t('studio.entry.said', { v: t(`studio.verdict.${r.value}`) })}
        </p>
      ) : (
        <p className="whitespace-pre-wrap break-words" data-entry-text>{r.text}</p>
      )}
      {r.reply && (
        <div data-reply className="mt-1 rounded-xl bg-white/[0.07] border border-emerald-300/25 px-3 py-2">
          <p className={`text-xs ${SOFT}`}>
            <b className="text-emerald-300">{t('studio.entry.claude')}</b> · <time dateTime={r.replied_at}>{momentOf(r.replied_at, lang)}</time>
          </p>
          <p className="whitespace-pre-wrap break-words mt-0.5">{r.reply}</p>
        </div>
      )}
    </li>
  )
}

/** An idea as a tile of the periodic table: its colour is its kind's, its code a symbol. */
function Tile({ item, small, onOpen }) {
  const { t } = useTranslation()
  const { rows } = useStudio()
  const color = KIND[item.kind]?.color ?? '#9ba4c7'
  const sooner = myVerdict(rows, item.id) === 'first'
  const tag = item.status === 'idea' ? '' : t(`studio.status.${item.status}`)
  const El = onOpen ? 'button' : 'div'
  return (
    <El
      {...(onOpen ? { type: 'button', onClick: onOpen, 'data-open': item.id, 'aria-label': item.title } : { 'aria-hidden': true })}
      className={`relative flex flex-col justify-between gap-1 rounded-lg p-1.5 text-left text-[#0c1124] ${small ? 'w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 shrink-0' : 'w-full min-h-[6.5rem]'} ${onOpen ? 'transition hover:-translate-y-0.5' : ''} ${item.status === 'parked' ? 'opacity-50 saturate-50' : ''} ${sooner ? 'outline outline-2 outline-offset-2 outline-amber-300' : ''}`}
      style={{ background: color, boxShadow: `inset 0 0 0 1px rgb(0 0 0 / .09), 0 8px 22px -14px ${color}` }}
    >
      <span className="flex justify-between gap-1 text-[10px] font-bold leading-none">
        <span>{item.z ?? ''}</span>
        {!small && <span className="uppercase tracking-wide opacity-70 text-right">{tag}</span>}
      </span>
      <span className={`font-display font-bold leading-none ${small ? 'text-2xl sm:text-3xl' : 'text-3xl'}`}>{item.code}</span>
      {!small && <span className="text-[11px] font-bold leading-tight line-clamp-2 break-words">{item.title}</span>}
      {sooner && !small && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#1d1604] whitespace-nowrap">{t('studio.verdict.first')}</span>}
    </El>
  )
}

/** The verdict buttons: Sooner, Later, Not now (the account's last one is pressed). */
function Verdicts({ item }) {
  const { t } = useTranslation()
  const { rows, send } = useStudio()
  const mine = myVerdict(rows, item.id)
  const [busy, setBusy] = useState(null)
  const [status, setStatus] = useState(null)
  const pick = async v => {
    if (busy || v === mine) return
    setBusy(v)
    const problem = await send('verdict', { item: item.id, value: v })
    setBusy(null)
    setStatus(problem ? t(`studio.errors.${problem}`) : t('studio.verdict.saved', { v: t(`studio.verdict.${v}`) }))
  }
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('studio.verdict.ask')} data-verdicts={item.id}>
        {VERDICTS.map(v => {
          const on = mine === v
          const look = on ? (v === 'first' ? 'bg-amber-300 text-[#1d1604] border-amber-300' : 'bg-white/25 border-white/60') : 'border-white/20 hover:bg-white/10'
          return (
            <button key={v} type="button" data-verdict={v} aria-pressed={on} disabled={!!busy} onClick={() => pick(v)} className={`min-h-11 rounded-xl px-3.5 font-bold border disabled:opacity-60 ${look}`}>
              {VERDICT_ICON[v]} {t(`studio.verdict.${v}`)}
            </button>
          )
        })}
      </div>
      {status && <p role="status" data-verdict-status className={`text-sm ${SOFT}`}>{status}</p>}
    </div>
  )
}

/** Under an item: its verdicts and its notes, for a signed-in account. */
function Actions({ item }) {
  const { t } = useTranslation()
  const { me, rows, openItem } = useStudio()
  if (!me) return null
  const n = threadOf(rows, item.id).length
  return (
    <div className="flex flex-wrap items-start gap-2">
      {canVote(item) && <Verdicts item={item} />}
      <button type="button" data-notes={item.id} onClick={() => openItem(item.id)} className={PLAIN}>
        💬 {n ? t('studio.item.notesButton', { n }) : t('studio.item.addNote')}
      </button>
    </div>
  )
}

function Queue({ items, numbered, none }) {
  const { t } = useTranslation()
  const { lang, openItem } = useStudio()
  if (!items.length) return <p className={MUTED}>{none}</p>
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, n) => (
        <li key={item.id} data-queue={item.id} className="glass rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-start">
          <Tile item={item} small onOpen={() => openItem(item.id)} />
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <h3>
              <button type="button" onClick={() => openItem(item.id)} className="text-left font-display text-lg sm:text-xl font-bold leading-snug hover:underline underline-offset-4">
                {numbered && <span className={`${MUTED} mr-2`}>{n + 1}.</span>}
                {item.title}
              </button>
            </h3>
            <p className="break-words">{item.why || item.summary}</p>
            <p className={`text-xs ${MUTED}`}>
              {t(`studio.who.${whose(item)}`)} · {dayOf(item.date, lang)}
              {item.status === 'building' && <span className="text-amber-200 font-bold"> · {t('studio.status.building')}</span>}
            </p>
            <Actions item={item} />
          </div>
        </li>
      ))}
    </ol>
  )
}

function Waiting() {
  const { t } = useTranslation()
  const { me, rows, openItem } = useStudio()
  if (!DATA.waiting.length) return <p className={MUTED}>{t('studio.waiting.none')}</p>
  return (
    <ul className="flex flex-col gap-3">
      {DATA.waiting.map(w => {
        const n = threadOf(rows, w.id).length
        return (
          <li key={w.id} data-waiting={w.id} className="glass rounded-2xl p-4 flex flex-col gap-2">
            <h3 className="font-display text-lg font-bold leading-snug">
              {w.title}
              {w.optional && <span className={`ml-2 align-middle text-[11px] uppercase tracking-wider ${MUTED}`}>{t('studio.waiting.optional')}</span>}
            </h3>
            <p className={`${SOFT} break-words`}>{w.detail}</p>
            <div className="flex flex-wrap gap-2">
              {w.link && (
                <a href={here(w.link)} className={PLAIN}>
                  {t('studio.item.open')} ↗
                </a>
              )}
              {me && (
                <button type="button" data-notes={w.id} onClick={() => openItem(w.id)} className={PLAIN}>
                  💬 {n ? t('studio.item.notesButton', { n }) : t('studio.item.addNote')}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Ideas() {
  const { t } = useTranslation()
  const { openItem } = useStudio()
  const [filter, setFilter] = useState('all')
  const people = ['all', 'you', 'artur', 'claude'].filter(w => w === 'all' || DATA.ideas.some(g => g.items.some(i => whose(i) === w)))
  const groups = DATA.ideas.map(g => ({ ...g, items: g.items.filter(i => filter === 'all' || whose(i) === filter) })).filter(g => g.items.length)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('studio.ideas.whose')}>
        {people.map(w => (
          <button key={w} type="button" data-filter={w} aria-pressed={filter === w} onClick={() => setFilter(w)} className={`min-h-11 rounded-full px-4 font-bold border ${filter === w ? 'bg-white text-[#0b0f24] border-white' : 'border-white/20 hover:bg-white/10'}`}>
            {t(`studio.ideas.${w}`)}
          </button>
        ))}
      </div>
      {groups.length === 0 && <p className={MUTED}>{t('studio.ideas.none')}</p>}
      {groups.map(g => (
        <div key={g.kind.id} className="flex flex-col gap-2.5" data-kind={g.kind.id}>
          <h3 className="flex items-baseline gap-2 font-display text-lg font-bold">
            <span className="inline-block w-3 h-3 rounded-[3px] translate-y-px" style={{ background: g.kind.color }} />
            {g.kind.label}
            <span className={`text-sm font-normal ${MUTED}`}>{g.items.length}</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2.5">
            {g.items.map(item => (
              <Tile key={item.id} item={item} onOpen={() => openItem(item.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function tokenLine(tk, t, lang) {
  if (!tk) return t('studio.built.noTokens')
  return t('studio.built.tokens', { total: millions(tk.total, lang), written: millions(tk.output, lang, 2), count: tk.agents })
}

function Built() {
  const { t } = useTranslation()
  const { lang } = useStudio()
  return (
    <div className="flex flex-col gap-5">
      {DATA.tokens > 0 && <p className={`text-sm ${MUTED} max-w-3xl`}>{t('studio.built.tokensNote', { total: millions(DATA.tokens, lang) })}</p>}
      {DATA.built.map(d => (
        <div key={d.date} className="grid sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-5 gap-y-2" data-built-day={d.date}>
          <p className="font-display font-bold text-amber-200">
            <time dateTime={d.date}>{dayOf(d.date, lang)}</time>
          </p>
          <ul className="flex flex-col gap-3">
            {d.entries.map((b, i) => (
              <li key={i} className="break-words" data-built>
                <b>{b.title}</b> <span className={SOFT}>{b.what}</span>
                {b.link && (
                  <a href={here(b.link)} className="ml-1.5 whitespace-nowrap text-sky-300 underline decoration-sky-300/40 underline-offset-2">
                    {t('studio.built.open')} ↗
                  </a>
                )}
                <p className={`text-xs ${MUTED} mt-0.5`} data-tokens>{tokenLine(b.tokens, t, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Decided() {
  const { lang } = useStudio()
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {DATA.decisions.map(d => (
        <div key={`${d.date}-${d.title}`} className="glass rounded-2xl p-4 flex flex-col gap-1">
          <h3 className="font-display text-lg font-bold leading-snug">{d.title}</h3>
          <p className={SOFT}>{d.why}</p>
          <p className={`text-xs ${MUTED}`}>{dayOf(d.date, lang)}</p>
        </div>
      ))}
    </div>
  )
}

/** One item (or a waiting entry) in full, in a sheet: on the right on a computer, from the bottom on a
 *  phone. Its verdicts, its notes with Claude's answers, a note to send. */
function ItemSheet({ id, onClose }) {
  const { t } = useTranslation()
  const { me, rows, lang } = useStudio()
  const item = ITEM[id]
  const wait = WAIT[id]
  const close = useRef(null)
  useEffect(() => {
    const before = document.activeElement
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    close.current?.focus()
    const key = e => e.key === 'Escape' && onClose()
    addEventListener('keydown', key)
    return () => {
      root.style.overflow = overflow
      removeEventListener('keydown', key)
      before?.focus?.()
    }
  }, [onClose])
  const thread = threadOf(rows, id)
  const queued = item && (item.status === 'next' || item.status === 'building') && item.why
  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label={t('hud.close')} tabIndex={-1} className="absolute inset-0 bg-[#040712]/60 cursor-default" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        data-sheet={id}
        className="absolute inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:w-[30rem] sm:rounded-none sm:rounded-l-2xl sm:border-t-0 sm:border-l border-white/15 bg-[#10163a] shadow-2xl overflow-y-auto overscroll-contain p-4 sm:p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs uppercase tracking-[0.14em] ${MUTED}`}>{item ? KIND[item.kind]?.label : t('studio.waiting.title')}</p>
          <button ref={close} type="button" data-sheet-close onClick={onClose} className={PLAIN}>
            ✕ {t('hud.close')}
          </button>
        </div>
        <div className="flex gap-3 items-start">
          {item && <Tile item={item} small />}
          <div className="min-w-0">
            <h2 id="sheet-title" className="font-display text-2xl font-bold leading-tight">{item?.title ?? wait.title}</h2>
            {item && (
              <p className={`text-xs ${MUTED} mt-1`}>
                {[t(`studio.who.${whose(item)}`), dayOf(item.date, lang), t(`studio.status.${item.status}`)].join(' · ')}
              </p>
            )}
          </div>
        </div>
        <p className="text-[1.05rem] break-words">{item?.summary ?? wait.detail}</p>
        {queued && (
          <div className="rounded-xl bg-white/[0.07] px-3.5 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">{t('studio.item.why')}</p>
            <p className="break-words">{item.why}</p>
          </div>
        )}
        {item?.details?.length > 0 && (
          <ul className={`list-disc pl-5 flex flex-col gap-2 ${SOFT} break-words`}>
            {item.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
        {((item ?? wait).link || item?.doc) && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
            {(item ?? wait).link && (
              <a href={here((item ?? wait).link)} className={PLAIN}>
                {t('studio.item.open')} ↗
              </a>
            )}
            {item?.doc && (
              <span className={`text-sm ${MUTED} break-all`}>
                {t('studio.item.repo')} <code className="text-xs">{item.doc}</code>
              </span>
            )}
          </div>
        )}
        {me && canVote(item) && (
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <h3 className="font-display text-lg font-bold">{t('studio.verdict.ask')}</h3>
            <Verdicts item={item} />
          </div>
        )}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <h3 className="font-display text-lg font-bold">{t('studio.item.notes')}</h3>
          {me ? (
            <>
              {thread.length ? (
                <ol className="flex flex-col" data-thread={id}>
                  {thread.map(r => (
                    <Entry key={r.id} r={r} />
                  ))}
                </ol>
              ) : (
                <p className={`text-sm ${MUTED}`}>{rows == null ? t('studio.sent.loading') : t('studio.item.none')}</p>
              )}
              <NoteForm id={id} />
            </>
          ) : (
            <div className="pt-1">
              <SignInPrompt text={t('studio.item.signIn')} />
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

function NoteForm({ id }) {
  const { t } = useTranslation()
  const { send } = useStudio()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const submit = async e => {
    e.preventDefault()
    if (busy) return
    if (!text.trim()) {
      setStatus(t('studio.errors.empty'))
      return
    }
    setBusy(true)
    setStatus(t('studio.tell.sending'))
    const problem = await send('note', { item: id, text: text.trim() })
    setBusy(false)
    setStatus(problem ? t(`studio.errors.${problem}`) : t('studio.tell.sent'))
    if (!problem) setText('')
  }
  return (
    <form onSubmit={submit} data-note-form className="flex flex-col gap-2.5 mt-2" noValidate>
      <label className="sr-only" htmlFor="note-text">{t('studio.item.noteLabel')}</label>
      <textarea id="note-text" data-note-text rows={3} maxLength={4000} value={text} onChange={e => setText(e.target.value)} placeholder={t('studio.item.noteHolder')} className="w-full rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-base leading-relaxed outline-none focus:border-sky-300 placeholder:text-[#8f98bf] resize-y" />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" data-note-send disabled={busy} className={PRIMARY}>
          {busy ? t('studio.tell.sending') : t('studio.item.send')}
        </button>
        <p role="status" data-note-status className={`text-sm ${SOFT} min-w-0`}>{status}</p>
      </div>
    </form>
  )
}
