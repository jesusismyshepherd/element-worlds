// The family dashboard's one way to the data: the database function ew_admin
// (supabase/ew_001_usage.sql), every call with the dashboard password. The password is kept only in this
// browser's localStorage (ew-dash-pass) once a login worked, until Log out; it is never in the code or
// the repo. A wrong password comes back as { error: 'password' } after a 1.5 s wait.
import { rpc } from '../net/config.js'

const PASS = 'ew-dash-pass'
const FILTER = 'ew-dash-filter'

const safe = (f, fallback = null) => {
  try {
    return f()
  } catch {
    return fallback
  }
}

export const savedPass = () => safe(() => localStorage.getItem(PASS))
export const keepPass = p => safe(() => localStorage.setItem(PASS, p))
export const dropPass = () => safe(() => localStorage.removeItem(PASS))

/** The dashboard's last filter on this device (who, period). */
export const savedFilter = () => safe(() => JSON.parse(localStorage.getItem(FILTER) ?? '{}'), {}) ?? {}
export const keepFilter = f => safe(() => localStorage.setItem(FILTER, JSON.stringify(f)))

/** ew_admin(p_pass, p_action, p_args): check, devices, retag, remove, restore, forget, forget_visit,
 *  events (see the SQL). */
export const admin = (pass, action, args = {}) => rpc('ew_admin', { p_pass: pass, p_action: action, p_args: args })

/** A tag as the database keeps it (ew_tag): letters, digits, - and _, in lower case, at most 24. */
export const tagOf = s => String(s ?? '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().slice(0, 24)

/** Did the database refuse the password? */
export const refused = r => !!r && typeof r === 'object' && !Array.isArray(r) && r.error === 'password'
