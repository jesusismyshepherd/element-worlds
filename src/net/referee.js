// A game a room plays with one referee (docs/knowledge/multiplayer.md): the quiz duel (src/net/duel.js)
// and the forge's race (src/net/race.js). The game's rules are pure functions of its state (act, tick,
// present: src/game/duel.js, src/game/race.js). One player, the referee (who started it; when they leave,
// the first of the game's own heirs still in the room), runs them four times a second and sends the state
// (`<name>-state`, with a version v that counts up); the others send what they do (`<name>-act`) and show
// the newest state they get. A newcomer asks (`<name>-hello`); the referee closes it for all (`<name>-end`).
import { room } from './room.js'

export class Refereed {
  /**
   * rules: { act(s, id, a, now), tick(s, now), present(s, ids), heirs(s, members) (ids in order of
   * succession), done(s) (the game is over: close it), lazy(a) (an act whose state can wait for the next
   * tick: many come in a second) }.
   */
  constructor(name, rules) {
    this.name = name
    this.rules = rules
    this.s = null
    this.timer = null
    this.due = false
    this.helloSent = false
    room.on(`${name}-state`, p => this.receive(p.s))
    room.on(`${name}-act`, p => this.mine() && this.apply(p.from, p.a))
    room.on(`${name}-hello`, () => this.mine() && this.publish())
    room.on(`${name}-end`, p => {
      if (this.s && p.id === this.s.id) this.end(false)
    })
    room.on('members', list => this.members(list))
  }

  mine() {
    return !!this.s && this.s.ref === room.me?.id
  }

  /** A new game, run by me. */
  begin(s) {
    this.s = s
    this.publish()
    this.run()
  }

  /** Something I do: the referee does it at once, the others ask the referee. */
  do(a) {
    if (!this.s) return
    if (this.mine()) this.apply(room.me.id, a)
    else room.send(`${this.name}-act`, { a })
  }

  /** Is a game on? Ask (whoever runs it answers). */
  hello() {
    if (room.active) room.send(`${this.name}-hello`)
  }

  apply(from, a) {
    const next = this.rules.act(this.s, from, a, Date.now())
    if (next === this.s) return
    this.s = next
    if (this.rules.done?.(next)) return this.finish()
    // (many of these in a second: the state goes with the next tick)
    if (this.rules.lazy?.(a)) {
      this.due = true
      this.report()
    } else this.publish()
  }

  /** The game is over: its last state to everyone, then closed. */
  finish() {
    this.publish()
    this.end()
  }

  /** The referee closes the game for everyone. */
  end(tell = true) {
    if (tell && this.s && this.mine()) room.send(`${this.name}-end`, { id: this.s.id })
    clearInterval(this.timer)
    this.timer = null
    this.s = null
    this.due = false
    this.report()
  }

  receive(s) {
    if (!s) return
    const fresh = !this.s || s.id !== this.s.id
    if (!fresh && s.v <= this.s.v) return
    this.s = s
    if (fresh) this.fresh(s)
    if (this.rules.done?.(s)) return this.end(false)
    if (this.mine()) this.run()
    this.report()
  }

  /** A game I had not seen before (each game says what it does). */
  fresh() {}

  publish() {
    this.due = false
    room.send(`${this.name}-state`, { s: this.s })
    this.report()
  }

  /** People came or went: the referee takes out those who left; if the referee left, the first heir
   *  still here carries on with the last state they got. */
  members(list) {
    if (!this.s) {
      // just in a room: is a game on already? (whoever runs it answers)
      if (!list.length) this.helloSent = false
      else if (!this.helloSent && list.some(m => m.id === room.me?.id)) {
        this.helloSent = true
        this.hello()
      }
      return
    }
    const ids = list.map(m => m.id)
    if (!ids.length) return this.end(false)
    if (!ids.includes(this.s.ref)) {
      const next = this.rules.heirs(this.s, list).find(x => x && ids.includes(x))
      if (!next) return this.end(false)
      if (next !== room.me?.id) return
      this.s = { ...this.s, ref: next, v: this.s.v + 1 }
      this.run()
    }
    if (!this.mine()) return
    const kept = this.rules.present(this.s, ids)
    if (kept !== this.s) this.s = kept
    if (this.rules.done?.(this.s)) return this.finish()
    this.publish()
  }

  /** One tick of the rules (a game may do more in it: the duel prepares its questions). */
  step(now) {
    return this.rules.tick(this.s, now)
  }

  /** The referee's clock. */
  run() {
    if (this.timer) return
    this.timer = setInterval(() => {
      if (!this.s || !this.mine()) {
        clearInterval(this.timer)
        this.timer = null
        return
      }
      const next = this.step(Date.now())
      if (next !== this.s) {
        this.s = next
        if (this.rules.done?.(next)) return this.finish()
        this.publish()
      } else if (this.due) this.publish()
    }, 250)
  }

  report() {}
}
