// The diamond press over a room (the rules: src/game/press.js; docs/knowledge/press.md). Run like the
// forge's race (src/net/referee.js): whoever starts the press referees, everyone at the press sends what
// they do (a stroke of the pump, the heater's power) and sees the referee's run four times a second.
// A newcomer to the gallery asks for a run on; the referee's leaving hands it to the next at the press.
import { Refereed } from './referee.js'
import { room } from './room.js'
import { track } from './telemetry.js'
import { newRun, act, tick, present } from '../game/press.js'

export const PRESS_PATH = '/e/C/allotropes'
const atPress = () => room.members.filter(m => m.path === PRESS_PATH).map(m => m.id)

class PressLink extends Refereed {
  constructor() {
    super('press', {
      act,
      tick,
      // who is at the press: the room's members in the gallery
      present: (s, ids) => present(s, ids.filter(id => atPress().includes(id))),
      heirs: (s, list) => [...s.players, ...list.filter(m => m.path === PRESS_PATH).map(m => m.id)],
      done: s => s.phase === 'done',
      // strokes come several a second: the state goes with the next tick
      lazy: a => a.t === 'pump',
    })
    this.watchers = new Set()
    this.skew = 0 // the referee's clock minus mine (the time left follows the referee's)
  }

  publish() {
    if (this.s) this.s = { ...this.s, sent: Date.now() }
    super.publish()
  }

  receive(s) {
    if (s?.sent) this.skew = s.sent - Date.now()
    // the last state of a run closes it at once (referee.js): tell the gallery its end first
    if (s?.phase === 'done' && (!this.s || s.id === this.s.id)) this.tell(s)
    super.receive(s)
  }

  /** Start a run with everyone in the gallery. */
  start() {
    if (!room.active || !room.me) return
    const ids = [room.me.id, ...atPress()]
    track('press', { op: 'start', n: new Set(ids).size })
    this.begin(newRun(room.me.id, ids, Date.now()))
  }

  /** Called with the run whenever it changes (null when none is on). */
  watch(fn) {
    this.watchers.add(fn)
    return () => this.watchers.delete(fn)
  }

  tell(s) {
    for (const fn of this.watchers) {
      try {
        fn(s)
      } catch (err) {
        console.error(err)
      }
    }
  }

  report() {
    if (this.mine()) this.skew = 0
    this.tell(this.s)
  }
}

export const pressLink = new PressLink()
if (typeof window !== 'undefined') window.__ewPress = pressLink // for the probes
