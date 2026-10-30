// The state of a world's things, kept and shared (the user, 2026-10-30: "I release the balloons in the
// neon chamber, all the players in the room see it too and share its state"; and "the room holds the
// state even when empty"). Every world has two states, each saved: the player's own (alone: kept on the
// device and in the account's progress, src/engine/progress.js) and each room's (in a room: everyone in
// the same world sees the same and each change as it happens, and the room keeps it in the family
// Supabase project while nobody is there, supabase/ew_003_room_worlds.sql). A room's world starts as the
// world is built, never from anyone's own. What opens to be read (a panel, a story, a video, the
// Atomling's words) and the discoveries stay each one's own. docs/knowledge/multiplayer.md, "Shared
// world objects".
//
// A world lists what it shares in `shared` (in what build returns): id -> { get, set }. get() is the
// thing's state now (small, plain JSON); set(state, live, ago) makes it so: live, someone has just
// changed it (play the change: the balloons rise, the tube is filled); not live, the world as it stands
// (no animation, no sound), its state taken `ago` seconds before (run forward what unfolds over time).
// Something that only happens (the Geiger counter clicking) is a count in the state. The world calls
// ctx.share(id) right after its own visitor changed one.
//
// In a room, each thing's state carries a version (v) that counts up across the room and who wrote it
// (by); the higher (v, by) wins everywhere, in the room's store too. Coming into a world, the room's
// store gives what was left there and anyone already in it answers (w-hello, w-state) with what may not
// have reached the store yet. Changes go as w-set, and to the store at most every PUT_MS.
import { room as theRoom } from './room.js'
import { rpc } from './config.js'
import { worldState, keepWorldState } from '../engine/progress.js'

export const PUT_MS = 700

/** Is a's (v, by) newer than b's? The version first, then who wrote it, so every player picks the same. */
export const newer = (a, b) => !b || a.v > b.v || (a.v === b.v && String(a.by ?? '') > String(b.by ?? ''))

// each room's worlds, kept while nobody is in them
const roomStore = {
  load: (code, path) => rpc('ew_room_world_get', { p_code: code, p_path: path }),
  put: (code, path, part, v, by, s, keepalive = false) =>
    rpc('ew_room_world_put', { p_code: code, p_path: path, p_part: part, p_v: v, p_by: by, p_s: s }, { keepalive }),
}
// the player's own
const ownStore = { load: worldState, keep: keepWorldState }

export class SharedWorld {
  constructor(room, { wait = (ms, fn) => setTimeout(fn, ms), cancel = t => clearTimeout(t), store = roomStore, own = ownStore, now = () => Date.now() } = {}) {
    this.room = room
    this.wait = wait
    this.cancel = cancel
    this.store = store
    this.own = own
    this.now = now
    this.w = null
    this.path = null
    this.mode = null // 'own' (alone) or 'room'
    this.code = null
    this.defaults = {} // every thing's state as the world was built: where a room's world starts
    this.marks = {} // in a room: id -> { v, by }, the version of each thing's state on show
    this.met = new Set() // the others in this world I have swapped states with
    this.dirty = new Set() // changed things still to go to the room's store
    this.putTimer = null
    this.touched = false // alone: something of mine changed (or was saved before), to keep
    this.onLive = null // (id, from): someone else's change has just played here (the engine's note)
    room.on('w-set', p => this.here(p) && this.take(p, true))
    room.on('w-state', p => this.here(p) && this.takeAll(p))
    room.on('w-hello', p => this.here(p) && this.hello())
    room.on('members', () => this.start() || this.meet())
  }

  /** The things the world on show shares (null: none, or no world). */
  get parts() {
    return this.w?.shared ?? null
  }

  /** Every thing's state now. */
  all() {
    const out = {}
    for (const [id, part] of Object.entries(this.parts ?? {})) {
      try {
        out[id] = part.get()
      } catch (err) {
        console.error(err)
      }
    }
    return out
  }

  /** A message about the world I am in, in the room (and from someone I now know is in it). */
  here(p) {
    if (!this.w || this.mode !== 'room' || p.p !== this.path) return false
    if (p.from) this.met.add(p.from)
    return true
  }

  /** A world came on show at this address. */
  enter(w, path) {
    this.leave()
    // a world that shares nothing (a hall: its exhibits open panels, take you somewhere or talk) has
    // nothing to keep or send
    if (!w?.shared || !Object.keys(w.shared).length) return
    this.w = w
    this.path = path
    this.defaults = this.all()
    this.start()
  }

  leave() {
    this.keep()
    this.cancel(this.putTimer)
    this.putTimer = null
    this.w = null
    this.path = null
    this.mode = null
    this.code = null
    this.defaults = {}
    this.marks = {}
    this.met = new Set()
    this.dirty = new Set()
    this.touched = false
  }

  /** Save what has not been saved (leaving the world, the page going): my own, or the room's last changes. */
  keep() {
    if (this.mode === 'own' && this.touched) this.own.keep(this.path, this.all())
    if (this.mode === 'room') this.flush(true)
  }

  /** My own world alone, the room's in a room: on coming in, and when a room is joined or left while
   *  here. Returns whether it switched. */
  start() {
    if (!this.w) return false
    const r = this.room
    if (r.active && r.code && r.me) {
      if (this.mode === 'room' && this.code === r.code) return false
      this.toRoom()
      return true
    }
    if (r.active || this.mode === 'own') return false
    this.toOwn()
    return true
  }

  /** Every thing back as the world was built (between my own world and a room's). */
  reset() {
    for (const [id, s] of Object.entries(this.defaults)) this.set(id, s, false, 0)
  }

  set(id, s, live, ago) {
    try {
      this.parts?.[id]?.set(s ?? {}, live, Math.max(0, Number(ago) || 0))
    } catch (err) {
      console.error(err)
    }
  }

  toOwn() {
    if (this.mode === 'room') {
      this.flush(true)
      this.reset()
    }
    this.mode = 'own'
    this.code = null
    this.marks = {}
    this.met = new Set()
    const saved = this.own.load(this.path)
    this.touched = !!saved
    if (!saved?.parts) return
    const ago = Number.isFinite(saved.at) ? (this.now() - saved.at) / 1000 : 0
    for (const [id, s] of Object.entries(saved.parts)) if (this.parts[id] && s && typeof s === 'object') this.set(id, s, false, ago)
  }

  toRoom() {
    const r = this.room
    if (this.mode === 'own') {
      this.keep()
      this.reset()
    } else if (this.mode === 'room') {
      this.flush(true)
      this.reset()
    }
    this.mode = 'room'
    this.code = r.code
    this.marks = Object.fromEntries(Object.keys(this.parts).map(id => [id, { v: 0, by: '' }]))
    this.met = new Set()
    this.dirty = new Set()
    // what the room left here, and from anyone already here what may not have reached the store yet
    const at = { w: this.w, code: this.code }
    this.note('load')
    Promise.resolve()
      .then(() => this.store.load(at.code, this.path))
      .then(rows => {
        if (this.w !== at.w || this.code !== at.code || !Array.isArray(rows)) return
        const n = rows.filter(row => row && this.take({ id: row.part, v: row.v, by: row.by, s: row.s }, false, row.ago)).length
        this.note(`store: ${n} of ${rows.length} taken`)
      })
      .catch(() => this.note('store unreachable'))
    if (r.others().length) r.send('w-hello', { p: this.path })
  }

  /** Someone in this world I have not swapped states with (a member list that came late): send mine. */
  meet() {
    if (this.mode !== 'room') return
    const there = this.room.others().filter(m => m.path === this.path)
    for (const id of this.met) if (!there.some(m => m.id === id)) this.met.delete(id)
    const fresh = there.filter(m => !this.met.has(m.id))
    if (!fresh.length) return
    for (const m of fresh) this.met.add(m.id)
    this.hello()
  }

  /** The things changed in this room's world, with their versions (the untouched are the same for all). */
  snapshot() {
    const out = {}
    for (const [id, part] of Object.entries(this.parts ?? {})) {
      const m = this.marks[id]
      if (!m || m.v < 1) continue
      try {
        out[id] = { ...m, s: part.get() }
      } catch (err) {
        console.error(err)
      }
    }
    return out
  }

  /** My visitor changed a thing: kept as mine alone; in a room, everyone in this world gets it and the
   *  room keeps it. */
  changed(id) {
    const r = this.room
    const part = this.parts?.[id]
    if (!part) return
    if (this.mode === 'own') {
      this.touched = true
      this.own.keep(this.path, this.all())
      return
    }
    if (this.mode !== 'room' || !r.me) return
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
    this.dirty.add(id)
    this.putTimer ??= this.wait(PUT_MS, () => this.flush())
  }

  /** The changed things to the room's store (their state now, under their version). */
  flush(now = false) {
    this.cancel(this.putTimer)
    this.putTimer = null
    if (!this.code || !this.dirty.size) return
    for (const id of this.dirty) {
      const m = this.marks[id]
      const part = this.parts?.[id]
      if (!m || m.v < 1 || !part) continue
      let s
      try {
        s = part.get()
      } catch {
        continue
      }
      Promise.resolve()
        .then(() => this.store.put(this.code, this.path, id, m.v, m.by, s, now))
        .catch(() => this.note(`store refused ${id}`))
    }
    this.dirty.clear()
  }

  /** A thing's state from someone else (or the room's store): shown if it is newer than mine. */
  take(p, live, ago = 0) {
    const part = this.parts?.[p.id]
    if (!part || !Number.isFinite(p.v) || !newer(p, this.marks[p.id])) return false
    this.marks[p.id] = { v: p.v, by: String(p.by ?? '') }
    if (live) this.note(`set ${p.id} v${p.v}`)
    this.set(p.id, p.s, live, ago)
    if (live) this.onLive?.(p.id, p.from)
    return true
  }

  takeAll(p) {
    const n = Object.entries(p.parts ?? {}).filter(([id, e]) => e && this.take({ ...e, id }, false)).length
    this.note(`state from ${p.from}: ${n} taken`)
  }

  /** Someone came in and asks (or I met someone late): what changed here, from me. */
  hello() {
    const parts = this.snapshot()
    if (Object.keys(parts).length) this.room.send('w-state', { p: this.path, parts })
  }

  note(what) {
    this.room.note?.(`shared: ${what}`)
  }
}

export const shared = new SharedWorld(theRoom)
if (typeof window !== 'undefined') window.__ewShared = shared // for the probes
