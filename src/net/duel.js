// The quiz duel over a room (the rules: src/game/duel.js; docs/knowledge/multiplayer.md). One player,
// the referee (who started it, or the next one when they leave), runs the rules four times a second and
// sends the state (duel-state, with a version); the others send what they do (duel-act) and show the
// state they get. A newcomer asks for it (duel-hello). Each one shows the clues in their own language;
// the referee's count of clues sets the points. The referee's side is src/net/referee.js, which the
// forge's race (src/net/race.js) runs on too.
import { Refereed } from './referee.js'
import { room } from './room.js'
import { track } from './telemetry.js'
import { newDuel, act, tick, again, present } from '../game/duel.js'
import { makeQuestion, cluesFor } from '../game/quiz.js'
import { loadContent } from '../content/index.js'
import { ELEMENTS } from '../data/elements.js'

class DuelLink extends Refereed {
  constructor() {
    super('duel', {
      // "Play again" is the referee's to say
      act: (s, from, a, now) => (a.t === 'again' ? (from === s.ref ? again(s, now) : s) : act(s, from, a, now)),
      present,
      // the next referee: the first seated, then the first in line, then whoever has been in the room longest
      heirs: (s, list) => [...s.seats, ...s.line, ...list.map(m => m.id)],
    })
    this.store = null
    this.t = k => k
    this.lang = () => 'en'
    this.ready = null // the next question, prepared ahead: { q, total }
    this.preparing = false
    this.hidden = false
  }

  /** The store to report into, and the words (the clue count is the referee's language's). */
  bind({ store, t, lang }) {
    this.store = store
    this.t = t
    this.lang = lang
    this.report()
  }

  /** Start a duel in my room (I take the first seat). */
  start(level) {
    if (!room.active) return
    this.hidden = false
    this.ready = null
    track('duel', { op: 'start', n: room.members.length })
    const s = newDuel(room.me.id, level, Date.now())
    this.s = s
    this.prepare([])
    this.begin(s)
  }

  do(a) {
    if (!this.s) return
    if (a.t === 'pick') track('duel', { op: 'pick', ok: a.z === this.s.q?.answer })
    super.do(a)
  }

  /** A watcher closes the duel's window (it comes back when the next duel starts). */
  hide(h = true) {
    this.hidden = h
    this.report()
  }

  fresh(s) {
    this.hidden = false
    room.emit('duel-new', { from: s.ref, id: s.id })
  }

  /** Get the next question ready (its clues need the element's own words, loaded on demand). */
  async prepare(avoid) {
    if (this.preparing || !this.s) return
    this.preparing = true
    try {
      const level = this.s.level
      const q = makeQuestion(level, Math.random, avoid)
      const el = ELEMENTS[q.answer - 1]
      const content = await loadContent(el.symbol)
      const total = cluesFor(q, content, this.lang(), level, this.t(`families.${el.family}`)).length
      this.ready = { q, total }
    } finally {
      this.preparing = false
    }
  }

  /** The referee's tick: the rules, with the next question taken when it is ready. */
  step(now) {
    const asked = this.s.asked ?? []
    const take = avoid => {
      const r = this.ready
      if (!r || avoid.includes(r.q.answer)) {
        this.prepare(avoid)
        return null
      }
      this.ready = null
      return r
    }
    const next = tick(this.s, now, take)
    if (!this.ready && !this.preparing && (next.phase === 'asking' || next.phase === 'reveal' || next.phase === 'waiting')) this.prepare(next.asked ?? asked)
    return next
  }

  report() {
    this.store?.set({ duel: this.s && !this.hidden ? this.s : null, duelLive: !!this.s })
  }
}

export const duel = new DuelLink()
if (typeof window !== 'undefined') window.__ewDuel = duel // for the probes
