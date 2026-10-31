// The forge's race over a room (the rules: src/game/race.js; the goals: src/worlds/forge/goals.js;
// docs/knowledge/multiplayer.md, "The forge's race"). Run like the quiz duel (src/net/referee.js): the
// one who started it referees, everyone else sends what they do. Each racer tells how far they are a few
// times a second (`at`, lazy: the referee sends the board with its next tick); the first `done` wins.
// Loaded with the forge; the room's notes see a new race from its first state (RoomHud.jsx).
import { Refereed } from './referee.js'
import { room } from './room.js'
import { track } from './telemetry.js'
import { newRace, act, tick, present } from '../game/race.js'

const FORGE = '/forge'

class RaceLink extends Refereed {
  constructor() {
    super('race', {
      act,
      tick,
      present,
      // the next referee: the racers in the order they came, then anyone in the forge (where this runs)
      heirs: (s, list) => [...s.order, ...list.filter(m => m.path === FORGE).map(m => m.id)],
      done: s => s.phase === 'done',
      lazy: a => a.t === 'at',
    })
    this.store = null
    this.watchers = new Set()
    this.skew = 0 // the referee's clock minus mine (the countdown and the time shown follow the referee's)
  }

  publish() {
    if (this.s) this.s = { ...this.s, sent: Date.now() }
    super.publish()
  }

  receive(s) {
    if (s?.sent) this.skew = s.sent - Date.now()
    super.receive(s)
  }

  bind(store) {
    this.store = store
    this.report()
  }

  /** Start a race to mission `goal` with everyone in the forge. */
  start(goal) {
    if (!room.active || !room.me) return
    const ids = room.members.filter(m => m.path === FORGE || m.id === room.me.id).map(m => m.id)
    track('race', { op: 'start', goal, n: ids.length })
    this.begin(newRace(room.me.id, goal, ids, Date.now()))
  }

  /** Am I racing in the race on show? */
  racing() {
    return !!this.s && !!room.me && this.s.order.includes(room.me.id) && (this.s.phase === 'racing' || this.s.phase === 'over')
  }

  /** Called with the state whenever it changes (the forge switches between the shared atom and mine). */
  watch(fn) {
    this.watchers.add(fn)
    return () => this.watchers.delete(fn)
  }

  report() {
    if (this.mine()) this.skew = 0
    this.store?.set({ forgeRace: this.s, forgeRaceSkew: this.skew })
    for (const fn of this.watchers) {
      try {
        fn(this.s)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export const race = new RaceLink()
if (typeof window !== 'undefined') window.__ewRace = race // for the probes
