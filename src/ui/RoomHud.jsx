/* eslint-disable react/prop-types */
// Playing together (docs/knowledge/multiplayer.md): the top bar's 👥 button opens the room sheet (start
// a room or join one by its code; who is in it and where, go there, follow, call everyone here, emotes,
// share the link, leave). Short notes pop up under the bar on the right: who joined or left, who came or
// went where I am, who is calling everyone (with a button to go there).
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { room, newCode, cleanCode, savedName, roomLink } from '../net/room.js'
import { element, nameOf } from '../data/elements.js'
import { targetFrom } from '../worlds/registry.js'
import { duel } from '../net/duel.js'

const BTN = 'glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10'
const EMOTES = ['👋', '👍', '😮', '😂', '❓', '🎉']

/** Where a path is, in words, with its icon ("🏛 Carbon", "🧪 Molecule Lab"). */
export function whereOf(path, t, lang) {
  if (!path) return `❔ ${t('room.where.elsewhere')}`
  const [p] = path.split('?')
  if (p === '/passport' || p === '/atomlings' || p === '/stats') return `❔ ${t('room.where.elsewhere')}`
  const target = targetFrom(p)
  if (target.kind === 'lab') return `🧪 ${t('hud.lab')}`
  if (target.kind === 'forge') return `⚛️ ${t('hud.forge')}`
  if (target.kind === 'plaza') return `🔲 ${t('room.where.plaza')}`
  const el = element(target.symbol)
  if (target.kind === 'atrium') return `🏛 ${nameOf(el, lang)}`
  return `🚪 ${t(`wings.${el.symbol}.${target.wing}.title`)} (${nameOf(el, lang)})`
}

const capital = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/** The 👥 button and its sheet. */
export function RoomButton({ engine, compact }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const info = useStore(store, s => s.room)
  const [open, setOpen] = useState(false)
  const me = useStore(store, s => s.account)
  const [name, setName] = useState(() => savedName() || capital(me?.username ?? ''))
  useEffect(() => {
    if (me?.username && !name) setName(capital(me.username))
  }, [me?.username]) // eslint-disable-line react-hooks/exhaustive-deps
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  // a link with ?room= opens the sheet to ask for a name, unless one is known (then it joins at once)
  useEffect(() => {
    const again = room.rejoinCode()
    if (!again || room.active) return
    if (savedName()) room.join(again, savedName())
    else {
      setCode(again)
      setOpen(true)
    }
  }, [])
  useEffect(() => {
    const close = e => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [])

  const inRoom = !!info
  const n = info?.members?.length ?? 0
  const start = () => {
    if (!name.trim()) return
    room.join(newCode(), name)
  }
  const join = () => {
    if (!name.trim() || cleanCode(code).length < 4) return
    room.join(code, name)
  }
  const share = async () => {
    const url = roomLink(info.code)
    try {
      if (navigator.share) await navigator.share({ title: t('room.title'), text: t('room.shareText', { code: info.code }), url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // the share sheet was closed
    }
  }

  return (
    <div className="relative flex">
      <button
        type="button"
        data-room-button
        onClick={() => setOpen(o => !o)}
        className={`${BTN} ${open ? 'bg-white/15' : ''} ${inRoom ? 'ring-1 ring-emerald-300/70' : ''}`}
        title={t('room.title')}
        aria-expanded={open}
      >
        👥{inRoom ? <span className="ml-1">{n}</span> : !compact && <span className="hidden 2xl:inline ml-1">{t('room.together')}</span>}
      </button>
      {open && (
        <div data-room-sheet className="absolute right-0 top-full mt-1.5 glass rounded-xl p-3 w-[min(20rem,calc(100vw-1rem))] z-20 max-h-[calc(100vh-5rem)] overflow-y-auto text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="font-display font-bold text-base">👥 {t('room.title')}</div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-0.5 hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
          </div>
          {!inRoom ? (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-[13px] opacity-85 leading-snug">{t('room.intro')}</p>
              <label className="text-xs opacity-80">
                {t('room.name')}
                <input data-room-name value={name} maxLength={20} onChange={e => setName(e.target.value)} className="mt-0.5 w-full rounded-lg bg-white/10 px-2.5 py-1.5 text-sm outline-none focus:ring-1 ring-white/50" />
              </label>
              <button type="button" data-room-start onClick={start} disabled={!name.trim()} className="rounded-xl px-3 py-2 font-bold bg-emerald-300 text-[#0b0f24] disabled:opacity-40">
                {t('room.start')}
              </button>
              <div className="flex gap-1.5 items-end">
                <label className="text-xs opacity-80 flex-1">
                  {t('room.code')}
                  <input data-room-code value={code} onChange={e => setCode(cleanCode(e.target.value))} onKeyDown={e => e.key === 'Enter' && join()} placeholder="ABCD" className="mt-0.5 w-full rounded-lg bg-white/10 px-2.5 py-1.5 text-sm font-display tracking-[0.3em] uppercase outline-none focus:ring-1 ring-white/50" />
                </label>
                <button type="button" data-room-join onClick={join} disabled={!name.trim() || cleanCode(code).length < 4} className="rounded-xl px-3 py-1.5 font-bold bg-white/15 hover:bg-white/25 disabled:opacity-40">
                  {t('room.join')}
                </button>
              </div>
            </div>
          ) : (
            <RoomInside info={info} engine={engine} t={t} lang={lang} share={share} copied={copied} />
          )}
        </div>
      )}
    </div>
  )
}

function RoomInside({ info, engine, t, lang, share, copied }) {
  const here = typeof location !== 'undefined' ? location.pathname : '/'
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div data-room-code-shown className="font-display text-2xl font-bold tracking-[0.25em]">{info.code}</div>
        <button type="button" onClick={share} className="ml-auto rounded-lg px-2.5 py-1 text-xs font-bold bg-white/15 hover:bg-white/25">
          🔗 {copied ? t('room.copied') : t('room.share')}
        </button>
      </div>
      {info.status === 'connecting' && <div className="text-xs opacity-75">{t('room.connecting')}</div>}
      {info.status === 'trouble' && <div className="text-xs text-amber-300">{t('room.trouble')}</div>}
      <ul data-room-members className="flex flex-col gap-1">
        {info.members.map(m => {
          const me = m.id === info.me
          const away = m.path && m.path !== here
          return (
            <li key={m.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: m.color ?? '#fff' }} />
              <div className="min-w-0 flex-1">
                <div className="font-bold leading-tight truncate">{m.name}{me && <span className="font-normal opacity-60"> ({t('room.you')})</span>}</div>
                <div className="text-[11px] opacity-75 truncate">{whereOf(m.path, t, lang)}</div>
              </div>
              {!me && away && (
                <button type="button" onClick={() => room.go?.(m.path)} className="rounded-lg px-2 py-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 whitespace-nowrap">
                  {t('room.goThere')}
                </button>
              )}
              {!me && (
                <button
                  type="button"
                  data-room-follow={m.id}
                  onClick={() => room.follow(info.following === m.id ? null : m.id)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-bold whitespace-nowrap ${info.following === m.id ? 'bg-emerald-300 text-[#0b0f24]' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {info.following === m.id ? t('room.following') : t('room.follow')}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {info.members.length < 2 && info.status === 'on' && <div className="text-xs opacity-75">{t('room.alone')}</div>}
      <div className="flex flex-wrap gap-1">
        {EMOTES.map(e => (
          <button key={e} type="button" onClick={() => engine?.others?.sendEmote(e)} className="rounded-lg w-9 h-9 text-lg hover:bg-white/15 bg-white/5" aria-label={e}>
            {e}
          </button>
        ))}
      </div>
      <button type="button" data-room-call onClick={() => engine?.others?.callHere()} className="rounded-xl px-3 py-2 font-bold bg-white/15 hover:bg-white/25">
        📣 {t('room.call')}
      </button>
      <button type="button" data-room-leave onClick={() => room.leave()} className="rounded-xl px-3 py-1.5 text-xs font-bold opacity-80 hover:bg-white/10">
        {t('room.leave')}
      </button>
    </div>
  )
}

/** The room's short notes, under the bar on the right; a call carries a button to go there. */
export function RoomToasts({ engine }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const [notes, setNotes] = useState([])
  useEffect(() => {
    const add = (text, extra = {}) => {
      const id = Math.random().toString(36).slice(2)
      setNotes(list => [...list.slice(-3), { id, text, ...extra }])
      setTimeout(() => setNotes(list => list.filter(n => n.id !== id)), extra.call ? 12000 : 6000)
    }
    const paths = new Map()
    const offs = [
      room.on('joined', m => add(t('room.joined', { name: m.name }), { color: m.color })),
      room.on('left', m => m && add(t('room.left', { name: m.name }), { color: m.color })),
      room.on('call', p => {
        const m = room.member(p.from)
        if (!m) return
        add(`📣 ${m.name}: ${whereOf(p.path, t, lang)}`, { color: m.color, call: p.path !== location.pathname ? p : null })
      }),
      room.on('duel-new', p => {
        const m = room.member(p.from)
        if (!m || p.from === room.me?.id) return
        add(`⚔️ ${t('duel.started', { name: m.name })}`, { color: m.color, call: location.pathname !== '/' ? { path: '/', duel: true } : null })
      }),
      room.on('emote', p => {
        const m = room.member(p.from)
        // in a walking world the emote floats over the Atomling; elsewhere it shows here
        if (m && (engine?.world?.mode !== 'walk' || m.path !== location.pathname)) add(`${m.name} ${p.e}`, { color: m.color })
      }),
      room.on('members', list => {
        const here = location.pathname
        for (const m of list) {
          const was = paths.get(m.id)
          paths.set(m.id, m.path)
          if (m.id === room.me?.id || was === undefined || was === m.path) continue
          // only comings and goings where I am (five people moving about would bury the screen)
          if (m.path === here || was === here) add(`${m.name} → ${whereOf(m.path, t, lang)}`, { color: m.color })
        }
      }),
    ]
    return () => offs.forEach(off => off())
  }, [t, lang, engine])
  if (!notes.length) return null
  return (
    <div className="absolute right-2 sm:right-3 flex flex-col items-end gap-1 pointer-events-none" style={{ top: 'calc(var(--bar) + 0.25rem)' }}>
      {notes.map(n => (
        <div key={n.id} data-room-note className="glass rounded-xl px-3 py-1.5 text-xs font-bold pointer-events-auto flex items-center gap-2 max-w-[18rem]" style={{ borderColor: n.color ? `${n.color}aa` : undefined }}>
          <span className="truncate">{n.text}</span>
          {n.call && (
            <button type="button" onClick={() => (n.call.duel ? (duel.hide(false), room.go?.('/')) : engine?.others?.answer(n.call))} className="rounded-lg px-2 py-0.5 bg-white/20 hover:bg-white/30">
              {t('room.go')}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
