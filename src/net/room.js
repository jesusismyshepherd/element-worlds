// Rooms: playing together (the user, 2026-10-29: "more than two family members can enjoy at a time";
// docs/knowledge/multiplayer.md). A room is a short code (ABCD); whoever has the code or the link
// (?room=ABCD) is in. It runs on the family Supabase project's realtime channels: presence says who is
// in the room and where (the page they are on, what they have selected), broadcast carries the rest
// (where each walker stands, calls, emotes, the shared lab's molecule). Nothing is stored: a room lives
// as long as someone is in it. No chat and no matchmaking: only people the code was given to.
// Presence is for who is in the room only: the realtime service closes the channel of anyone who
// updates their presence often ("Client presence rate limit exceeded"), so where each one is and what
// they picked goes by broadcast ("here"), and when someone joins, everyone tells them.
import { supabase } from './config.js'
import { track } from './telemetry.js'

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const COLORS = ['#ffb347', '#7fd4ff', '#8be37a', '#ff7bac', '#c3a6ff', '#ffd166', '#4fd1c5', '#ff8a5c']
const NAME = 'ew-name'
const ROOM = 'ew-room'

const safe = f => {
  try {
    return f()
  } catch {
    return null
  }
}
const randomId = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => (b % 36).toString(36)).join('')

export const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(4)), b => ALPHABET[b % ALPHABET.length]).join('')
export const cleanCode = s => String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
export const savedName = () => safe(() => localStorage.getItem(NAME)) ?? ''
export const roomLink = code => `${location.origin}/?room=${code}`

class Room {
  constructor() {
    this.channel = null
    this.client = null
    this.me = null
    this.members = []
    this.code = null
    this.listeners = new Map()
    this.store = null
    this.go = null // navigate to a path (set by the Explore page)
    this.following = null
    this.followTo = null
    this.trackTimer = null
    this.known = new Set()
    this.gone = new Map() // members who said goodbye: id -> when (presence can take a while to drop them)
    this.trail = [] // the last changes of the connection, for the probes: [ms, what]
    // what each member last said about themselves by broadcast ("here": where they are, what they
    // picked), newer than their presence, which is updated rarely (see the top)
    this.said = new Map()
    this.lastTrack = 0
    this.dirty = false
    this.watchdog = null
  }

  /** The store to report into, and how to go somewhere (the page's navigate). */
  bind({ store, go }) {
    this.store = store
    this.go = go
    this.report()
  }

  /** Am I in a room? (not `on`: that name is the listener below) */
  get active() {
    return !!this.channel
  }

  /** Join (or start) a room; a reload of the same tab comes back into it. */
  async join(code, name) {
    code = cleanCode(code)
    if (!code) return
    if (this.channel) await this.leave()
    name = String(name ?? '').trim().slice(0, 20) || 'Explorer'
    safe(() => localStorage.setItem(NAME, name))
    this.code = code
    this.me = { id: randomId(8), name, color: null, at: Date.now(), path: location.pathname, since: Date.now() }
    this.status = 'connecting'
    this.report()
    this.client = await supabase()
    const ok = await this.connect()
    if (!ok) return
    safe(() => sessionStorage.setItem(ROOM, code))
    track('room', { op: 'join' })
    // a channel can drop without a word (a phone switching to a call, a weak network): look every few
    // seconds, and when the page is shown again, and connect again if it has
    clearInterval(this.watchdog)
    this.watchdog = setInterval(() => this.check(), 5000)
    if (!this.onShow) {
      this.onShow = () => document.visibilityState === 'visible' && this.check()
      document.addEventListener('visibilitychange', this.onShow)
    }
  }

  /** Open the room's channel and say who I am; every time it (re)connects, say it again (the
   *  realtime service forgets who is in a channel when the connection drops). */
  async connect() {
    const code = this.code
    const ch = this.client.channel(`ew-room-${code}`, { config: { broadcast: { self: false }, presence: { key: this.me.id } } })
    this.channel = ch
    this.lost = 0
    ch.on('presence', { event: 'sync' }, () => this.sync())
    ch.on('broadcast', { event: '*' }, ({ event, payload }) => {
      if (event === 'bye') return this.bye(payload.from)
      if (event === 'here') {
        const was = this.said.get(payload.from)
        if (!was || (payload.t ?? 0) >= (was.t ?? 0)) this.said.set(payload.from, payload)
        return this.sync()
      }
      return this.emit(event, payload)
    })
    let first = true
    const ok = await new Promise(resolve => {
      const t = setTimeout(() => resolve(false), 12000)
      ch.subscribe((s, err) => {
        this.note(`${s}${err ? ` ${err.message ?? err}` : ''}${this.channel !== ch ? ' (old)' : ''}`)
        if (this.channel !== ch) return
        if (s === 'SUBSCRIBED') {
          clearTimeout(t)
          if (first) resolve(true)
          else if (this.me.color) ch.track(this.me)
          first = false
          this.status = 'on'
          this.report()
        } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') {
          this.status = 'trouble'
          this.report()
        }
      })
    })
    if (this.channel !== ch) return false
    if (!ok) {
      this.status = 'trouble'
      this.report()
      return false
    }
    // a colour nobody in the room wears yet (kept when connecting again)
    if (!this.me.color) {
      const taken = new Set(Object.values(ch.presenceState()).map(m => m.at(-1)?.color))
      this.me.color = COLORS.find(c => !taken.has(c)) ?? COLORS[Math.floor(Math.random() * COLORS.length)]
    }
    this.lastTrack = Date.now()
    await ch.track(this.me)
    this.status = 'on'
    this.report()
    return true
  }

  /** The watchdog: a channel that is not joined for two looks in a row is opened again. */
  async check() {
    const ch = this.channel
    if (!ch || this.reconnecting) return
    if (ch.state === 'joined') {
      this.lost = 0
      // presence brought up to date now and then, for whoever joins next (never often: see the top)
      if (this.dirty && Date.now() - this.lastTrack > 30000 && this.me?.color) {
        this.dirty = false
        this.retrack()
      }
      return
    }
    this.lost = (this.lost ?? 0) + 1
    this.note(`watchdog: ${ch.state}`)
    if (this.lost < 2 && document.visibilityState === 'visible') return
    this.reconnecting = true
    try {
      await this.client.removeChannel(ch).catch(() => {})
      if (this.channel === ch) await this.connect()
    } finally {
      this.reconnecting = false
    }
  }

  note(what) {
    this.trail.push([Math.round(performance.now()), what])
    if (this.trail.length > 30) this.trail.shift()
  }

  retrack() {
    this.lastTrack = Date.now()
    this.channel?.track(this.me).then(r => r !== 'ok' && this.note(`track: ${r}`), () => this.note('track failed'))
  }

  /** Someone said goodbye: out of the list at once (their presence may linger for a while). */
  bye(id) {
    if (!id) return
    this.gone.set(id, Date.now())
    this.sync()
  }

  async leave() {
    const ch = this.channel
    clearInterval(this.watchdog)
    this.watchdog = null
    if (ch && this.me) {
      try {
        ch.send({ type: 'broadcast', event: 'bye', payload: { from: this.me.id } })
      } catch {
        // gone already
      }
    }
    this.channel = null
    this.members = []
    this.code = null
    this.following = null
    this.known = new Set()
    this.status = 'off'
    safe(() => sessionStorage.removeItem(ROOM))
    if (ch) {
      track('room', { op: 'leave' })
      try {
        // closing the channel takes me out of everyone's list at once (untracking first took seconds)
        await this.client.removeChannel(ch)
      } catch {
        // already gone
      }
    }
    this.report()
    this.emit('members', [])
  }

  /** The room this tab was in before a reload, or the one in the address (?room=). */
  rejoinCode() {
    const fromUrl = cleanCode(new URLSearchParams(location.search).get('room'))
    return fromUrl || safe(() => sessionStorage.getItem(ROOM)) || null
  }

  /** Change what the others see of me (where I am, what I have selected). */
  update(patch) {
    if (!this.me) return
    this.me = { ...this.me, ...patch, t: Date.now() }
    if (!this.channel) return
    this.dirty = true
    this.tell()
  }

  /** Say where I am and what I have picked, to everyone (by broadcast). */
  tell() {
    const { id, ...me } = this.me
    this.send('here', me)
  }

  send(event, payload = {}) {
    if (!this.channel || this.status !== 'on') return
    this.channel.send({ type: 'broadcast', event, payload: { ...payload, from: this.me.id } })
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event).add(fn)
    return () => this.listeners.get(event)?.delete(fn)
  }

  emit(event, payload) {
    for (const fn of this.listeners.get(event) ?? []) {
      try {
        fn(payload)
      } catch (err) {
        console.error(err)
      }
    }
  }

  member(id) {
    return this.members.find(m => m.id === id) ?? null
  }

  others() {
    return this.members.filter(m => m.id !== this.me?.id)
  }

  /** Follow someone: go wherever they go (until I go somewhere myself). */
  follow(id) {
    this.following = id
    this.report()
    this.chase()
  }

  /** Where I am now (the Explore page tells, after each world change). */
  arrived(path) {
    // a move of my own (not one made to follow) stops the following
    if (this.following && this.followTo !== path) this.following = null
    this.followTo = null
    this.update({ path, since: Date.now() })
    this.report()
  }

  chase() {
    const m = this.following && this.member(this.following)
    if (!m) return
    if (m.path && m.path !== location.pathname && this.followTo !== m.path) {
      this.followTo = m.path
      this.go?.(m.path)
    }
  }

  sync() {
    const state = this.channel?.presenceState() ?? {}
    for (const [id, at] of this.gone) if (Date.now() - at > 60000) this.gone.delete(id)
    const list = Object.values(state)
      .map(metas => metas.at(-1))
      .filter(m => m && !this.gone.has(m.id))
      .map(m => {
        // myself: as I am now (my own presence comes back late, and only through the server)
        if (m.id === this.me?.id) return { ...m, ...this.me }
        const said = this.said.get(m.id)
        if (!said || (said.t ?? 0) <= (m.t ?? 0)) return m
        const { from, t, ...rest } = said
        return { ...m, ...rest, t }
      })
      .sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1))
    // two who joined together may have picked the same colour: the later one takes another
    const me = list.find(m => m.id === this.me?.id)
    if (me && list.some(m => m.id !== me.id && m.color === me.color && m.at < me.at)) {
      const taken = new Set(list.filter(m => m.id !== me.id).map(m => m.color))
      this.update({ color: COLORS.find(c => !taken.has(c)) ?? me.color })
      this.retrack()
    }
    const before = this.known
    const now = new Set(list.map(m => m.id))
    const newcomer = list.some(m => !before.has(m.id) && m.id !== this.me?.id)
    for (const m of list) if (!before.has(m.id) && m.id !== this.me?.id && before.size) this.emit('joined', m)
    if (newcomer && this.status === 'on') this.tell()
    for (const id of before) if (!now.has(id)) this.emit('left', this.members.find(m => m.id === id))
    this.known = now
    for (const id of this.said.keys()) if (!now.has(id)) this.said.delete(id)
    this.members = list
    if (this.following && !now.has(this.following)) this.following = null
    this.report()
    this.emit('members', list)
    this.chase()
  }

  report() {
    this.store?.set({
      room: this.code
        ? { code: this.code, status: this.status, me: this.me?.id ?? null, following: this.following, members: this.members }
        : null,
    })
  }
}

export const room = new Room()
if (typeof window !== 'undefined') window.__ewRoom = room // for the probes
