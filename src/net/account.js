// Accounts (the user, 2026-10-29; docs/knowledge/accounts.md): the family Supabase project's own, the
// pokemon-site's, so one login works on both sites: a username and a password (the address behind it is
// <username>@pokemon-app.internal; no real e-mail), the profile made by the database's trigger.
// Signed in, the player's progress (discoveries, quiz records, neon names: src/engine/progress.js) lives
// in the account and follows them to any device; what a device gathered before anyone signed in on it is
// moved into the first account that does (Artur's phone), and a sign-out empties the device for the
// next player. What is played is recorded under the account unless its switch is off.
import { supabase, setToken, rpc, SESSION_KEY } from './config.js'
import { snapshot, adopt, clearProgress, hasProgress, onProgress } from '../engine/progress.js'
import { setAccount, waitFor, track } from './telemetry.js'

const OWNER = 'ew-owner' // the account the progress kept on this device belongs to
const RESERVED = ['admin', 'administrator', 'root', 'moderator', 'support', 'staff', 'official', 'pokemon_official', 'nintendo', 'gamefreak', 'creatures']

const safe = (f, fallback = null) => {
  try {
    return f()
  } catch {
    return fallback
  }
}

export const toEmail = username => `${String(username).toLowerCase().trim()}@pokemon-app.internal`

/** What is wrong with a new username (a key of account.errors), or null. The pokemon-site's rules. */
export function usernameProblem(name) {
  const n = String(name ?? '').trim()
  if (n.length < 3 || n.length > 20) return 'length'
  if (!/^[a-zA-Z0-9_]+$/.test(n)) return 'chars'
  if (RESERVED.some(w => n.toLowerCase().includes(w))) return 'reserved'
  return null
}

/** A sign-in or sign-up error, as a key of account.errors. */
function problemOf(error) {
  const m = String(error?.message ?? error ?? '')
  if (/already registered|already exists/i.test(m)) return 'taken'
  if (/invalid login|invalid credentials/i.test(m)) return 'wrong'
  if (/password/i.test(m) && /least|short|weak/i.test(m)) return 'weak'
  if (/rate limit|too many/i.test(m)) return 'busy'
  return 'failed'
}

class Account {
  constructor() {
    this.store = null
    this.client = null
    this.user = null // the account's id
    this.username = null
    this.admin = false
    this.tracking = true
    this.moved = null // what came over from this device at the first sign-in: { found, quiz }
    this.saving = null
    this.saved = ''
    this.timer = null
  }

  /** At the start: a device that was signed in before comes back signed in (the client is loaded only then). */
  start(store) {
    this.store = store
    const had = !!safe(() => localStorage.getItem(SESSION_KEY))
    const check = had ? this.init() : Promise.resolve()
    waitFor(check)
    if (!had) setAccount(null)
    this.report()
    return check
  }

  async init() {
    if (this.client) return
    this.client = await supabase()
    this.client.auth.onAuthStateChange((_event, session) => {
      // (no awaiting in here: the client holds a lock while it calls this)
      setTimeout(() => this.apply(session), 0)
    })
    const { data } = await this.client.auth.getSession()
    await this.apply(data.session)
  }

  /** A session came or went (sign-in, sign-out, a refreshed token, another tab). */
  async apply(session) {
    setToken(session?.access_token ?? null)
    const id = session?.user?.id ?? null
    if (id === this.user) return
    this.user = id
    if (!id) {
      this.username = null
      this.admin = false
      this.report()
      setAccount(null)
      return
    }
    const me = await rpc('ew_me', {}).catch(() => null)
    if (this.user !== id) return
    this.username = me?.username ?? session.user.email?.split('@')[0] ?? '?'
    this.admin = !!me?.admin
    this.tracking = me?.tracking !== false
    setAccount({ username: this.username, tracking: this.tracking })
    await this.arrive(me?.progress ?? {})
    this.report()
    track('account', { op: 'in' })
  }

  /** Signed in on this device: the device's progress and the account's become one. */
  async arrive(theirs) {
    const owner = safe(() => localStorage.getItem(OWNER))
    // someone else's leftovers (a sign-out should have cleared them): not theirs to keep
    if (owner && owner !== this.user) clearProgress()
    const mine = snapshot()
    const first = !owner && hasProgress(mine)
    const merged = await rpc('ew_save_progress', { p: mine, p_first: first }).catch(() => null)
    adopt(merged ?? theirs)
    safe(() => localStorage.setItem(OWNER, this.user))
    if (first) {
      this.moved = { found: mine.found.length, quiz: Math.max(0, ...Object.values(mine.quiz)) }
      track('account', { op: 'moved', found: mine.found.length })
    }
    this.saved = JSON.stringify(snapshot())
    this.watch()
  }

  /** Keep the account up to date: soon after each discovery, every 15 s for the rest (quiz records,
   *  neon names), and when the page is hidden. */
  watch() {
    if (this.timer) return
    onProgress(() => {
      clearTimeout(this.soon)
      this.soon = setTimeout(() => this.save(), 2000)
    })
    this.timer = setInterval(() => this.save(), 15000)
    addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && this.save())
  }

  async save() {
    if (!this.user || this.saving) return this.saving
    const now = JSON.stringify(snapshot())
    if (now === this.saved) return null
    const user = this.user
    this.saving = rpc('ew_save_progress', { p: JSON.parse(now), p_first: false })
      .then(merged => {
        if (merged && this.user === user) {
          adopt(merged)
          this.saved = JSON.stringify(snapshot())
        }
      })
      .catch(() => {})
      .finally(() => {
        this.saving = null
      })
    return this.saving
  }

  async signIn(username, password) {
    await this.init()
    const { error } = await this.client.auth.signInWithPassword({ email: toEmail(username), password })
    if (error) throw new Error(problemOf(error))
  }

  async signUp(username, password) {
    const problem = usernameProblem(username)
    if (problem) throw new Error(problem)
    if (String(password ?? '').length < 6) throw new Error('weak')
    await this.init()
    const { data: taken } = await this.client.rpc('username_exists', { candidate: username.trim() })
    if (taken) throw new Error('taken')
    const { data, error } = await this.client.auth.signUp({ email: toEmail(username), password })
    if (error) throw new Error(problemOf(error))
    if (!data.session) throw new Error('failed')
    track('account', { op: 'new' })
  }

  /** Sign out: the account keeps the progress, the device is emptied for the next player. */
  async signOut() {
    await this.save()
    track('account', { op: 'out' })
    clearProgress()
    safe(() => localStorage.removeItem(OWNER))
    this.moved = null
    await this.client?.auth.signOut()
  }

  /** The account's switch: record what I play (on every device). */
  async setTracking(v) {
    this.tracking = !!v
    setAccount({ username: this.username, tracking: this.tracking })
    this.report()
    await rpc('ew_set_tracking', { p_on: this.tracking }).catch(() => {})
  }

  report() {
    this.store?.set({
      account: this.user ? { id: this.user, username: this.username, admin: this.admin, tracking: this.tracking, moved: this.moved } : null,
    })
  }
}

export const account = new Account()
if (typeof window !== 'undefined') window.__ewAccount = account // for the probes
