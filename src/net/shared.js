// Shared world objects (the user, 2026-10-30: "I release the balloons in the neon chamber, all the
// players in the room see it too and share its state"). In a room, everyone in the same world sees the
// same state of its things and sees each change as it happens. What opens to be read (a panel, a story,
// a video, the Atomling's words) and the discoveries stay each one's own. docs/knowledge/multiplayer.md,
// "Shared world objects".
//
// A world lists what it shares in `shared` (in what build returns): id -> { get, set }. get() is the
// thing's state now (small, plain JSON); set(state, live) makes it so: live, someone has just changed it
// (play the change: the balloons rise, the tube is filled); not live, a newcomer takes the world as it
// stands (no animation, no sound). Something that only happens (the Geiger counter clicking) is a count
// in the state. The world calls ctx.share(id) right after its own visitor changed one.
//
// Who wins: each thing's state carries a version (v) that counts up across the room and who wrote it
// (by); the higher (v, by) wins everywhere, so everyone ends with the same. Anyone coming into a world
// while others are in the room asks (w-hello) and takes what those already there answer (w-state); if
// nobody answers within WAIT_MS it keeps its own and tells it, so two who came in together (following
// someone, answering a call) agree on one. Two who never met in this world (a late member list) swap
// theirs once. Changes go as w-set. Nothing is stored: a world's state lives while someone is in it.
import { room as theRoom } from './room.js'

export const WAIT_MS = 1500

/** Is a's (v, by) newer than b's? The version first, then who wrote it, so every player picks the same. */
export const newer = (a, b) => !b || a.v > b.v || (a.v === b.v && String(a.by ?? '') > String(b.by ?? ''))

export class SharedWorld {
  constructor(room, { wait = (ms, fn) => setTimeout(fn, ms), cancel = t => clearTimeout(t) } = {}) {
    this.room = room
    this.wait = wait
    this.cancel = cancel
    this.w = null
    this.path = null
    this.marks = {} // id -> { v, by }: the version of each thing's state on show here
    this.met = new Set() // the others in this world I have swapped states with
    this.started = false
    this.pending = false // asked, no answer yet
    this.timer = null
    room.on('w-set', p => this.here(p) && this.take(p, true))
    room.on('w-state', p => this.here(p) && this.takeAll(p))
    room.on('w-hello', p => this.here(p) && this.hello(p))
    room.on('members', () => this.start() || this.meet())
  }

  /** The things the world on show shares (null: none, or no world). */
  get parts() {
    return this.w?.shared ?? null
  }

  /** A message about the world I am in (and from someone I now know is in it). */
  here(p) {
    if (!this.w || !this.started || p.p !== this.path) return false
    if (p.from) this.met.add(p.from)
    return true
  }

  /** A world came on show at this address. */
  enter(w, path) {
    this.leave()
    if (!w?.shared) return
    this.w = w
    this.path = path
    this.start()
  }

  leave() {
    this.cancel(this.timer)
    this.timer = null
    this.w = null
    this.path = null
    this.marks = {}
    this.met = new Set()
    this.started = false
    this.pending = false
  }

  /** Begin keeping in step (the world came on show in a room, or the room was joined while in it);
   *  a room left stops it. Returns whether it began now. */
  start() {
    const r = this.room
    if (!this.w) return false
    if (!r.active) {
      if (this.started) this.leaveRoom()
      return false
    }
    if (this.started || r.status !== 'on' || !r.me) return false
    this.started = true
    const ids = Object.keys(this.parts)
    if (!r.others().length) {
      // alone in the room: what I have is the world's state
      for (const id of ids) this.marks[id] = { v: 0, by: r.me.id }
      return true
    }
    this.pending = true
    for (const id of ids) this.marks[id] = { v: -1, by: '' }
    this.note('hello')
    r.send('w-hello', { p: this.path })
    this.timer = this.wait(WAIT_MS, () => this.settle(true))
    return true
  }

  leaveRoom() {
    this.cancel(this.timer)
    this.timer = null
    this.marks = {}
    this.met = new Set()
    this.started = false
    this.pending = false
  }

  /** Someone in this world I have not swapped states with (a member list that came late): send mine. */
  meet() {
    const r = this.room
    if (!this.started || this.pending) return
    const there = r.others().filter(m => m.path === this.path)
    for (const id of this.met) if (!there.some(m => m.id === id)) this.met.delete(id)
    const fresh = there.filter(m => !this.met.has(m.id))
    if (!fresh.length) return
    for (const m of fresh) this.met.add(m.id)
    this.note(`meet ${fresh.map(m => m.id).join(' ')}`)
    r.send('w-hello', { p: this.path, parts: this.snapshot() })
  }

  /** No answer (or the first answer came): what is still unclaimed is mine. Told to the others when
   *  nobody answered, so two who came in together end with one state. */
  settle(timedOut = false) {
    if (!this.pending) return
    this.pending = false
    this.cancel(this.timer)
    this.timer = null
    const me = this.room.me?.id ?? ''
    for (const [id, m] of Object.entries(this.marks)) if (m.v < 0) this.marks[id] = { v: 0, by: timedOut ? me : '' }
    if (timedOut && this.room.others().length) {
      this.note('nobody answered: mine')
      this.room.send('w-state', { p: this.path, parts: this.snapshot() })
    }
  }

  /** Every thing's state and version, for someone who asks. */
  snapshot() {
    const out = {}
    for (const [id, part] of Object.entries(this.parts ?? {})) {
      const m = this.marks[id]
      if (!m || m.v < 0) continue
      try {
        out[id] = { ...m, s: part.get() }
      } catch (err) {
        console.error(err)
      }
    }
    return out
  }

  /** My visitor changed a thing: everyone in this world gets its new state. */
  changed(id) {
    const r = this.room
    const part = this.parts?.[id]
    if (!part || !this.started || !r.active || !r.me) return
    const mark = { v: Math.max(this.marks[id]?.v ?? 0, 0) + 1, by: r.me.id }
    this.marks[id] = mark
    let s
    try {
      s = part.get()
    } catch (err) {
      console.error(err)
      return
    }
    r.send('w-set', { p: this.path, id, ...mark, s })
  }

  /** A thing's state from someone else: shown if it is newer than mine. */
  take(p, live) {
    const part = this.parts?.[p.id]
    if (!part || !Number.isFinite(p.v) || !newer(p, this.marks[p.id])) return false
    this.marks[p.id] = { v: p.v, by: String(p.by ?? '') }
    if (live) this.note(`set ${p.id} v${p.v}`)
    try {
      part.set(p.s ?? {}, live)
    } catch (err) {
      console.error(err)
    }
    return true
  }

  takeAll(p) {
    const n = Object.entries(p.parts ?? {}).filter(([id, e]) => e && this.take({ ...e, id }, false)).length
    this.note(`state from ${p.from}: ${n} taken`)
    this.settle()
  }

  /** Someone came in and asks (or met me late and sent theirs): I answer with mine. */
  hello(p) {
    if (p.parts) this.takeAll(p)
    if (this.pending) return
    this.room.send('w-state', { p: this.path, parts: this.snapshot() })
  }

  note(what) {
    this.room.note?.(`shared: ${what}`)
  }
}

export const shared = new SharedWorld(theRoom)
if (typeof window !== 'undefined') window.__ewShared = shared // for the probes
