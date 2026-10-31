// The diamond press's runs for the gallery (the rules: src/game/press.js; docs/knowledge/press.md): alone,
// the rules run here every frame; in a room, through the room's referee (src/net/press.js), so everyone at
// the press plays the same run and, two or more, each keeps the job they took.
import { room } from '../../../net/room.js'
import { pressLink } from '../../../net/press.js'
import * as R from '../../../game/press.js'

/** onEnd(run): a run has ended (once each, the same on every screen). */
export function pressRun({ onEnd }) {
  let local = null
  let ended = null
  const linked = () => room.active && !!room.me
  const me = () => (linked() ? room.me.id : 'me')
  const end = s => {
    if (!s || s.phase !== 'done' || s.id === ended) return
    ended = s.id
    onEnd(s)
  }
  const off = pressLink.watch(end)
  return {
    /** The run on now (null when none). */
    get s() {
      return linked() ? pressLink.s : local
    },
    me,
    /** The time on the run's clock (the referee's, in a room). */
    now: () => Date.now() + (linked() ? pressLink.skew : 0),
    start() {
      if (this.s) return
      if (linked()) pressLink.start()
      else local = R.newRun('me', ['me'], Date.now())
    },
    /** A job done: 'ok'; when it is not mine, { holder } (who has it, or null: I have the other job);
     *  false with no run on. */
    use(job, a) {
      const s = this.s
      if (!s || s.phase !== 'run') return false
      if (!R.may(s, me(), job)) return { holder: R.holder(s, me(), job) }
      if (linked()) pressLink.do(a)
      else local = R.act(local, 'me', a, Date.now())
      return 'ok'
    },
    pump() {
      return this.use('pump', { t: 'pump' })
    },
    heat(p) {
      return this.use('heat', { t: 'heat', p })
    },
    /** Alone, the run goes on every frame. */
    update() {
      if (!local) return
      local = R.tick(local, Date.now())
      if (local.phase === 'done') {
        const s = local
        local = null
        end(s)
      }
    },
    dispose() {
      off()
    },
  }
}
