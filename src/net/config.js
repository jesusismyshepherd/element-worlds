// The family's Supabase project (pokemon-site's), where Element Worlds keeps its accounts' progress, its
// usage data and runs its rooms (docs/knowledge/accounts.md, usage-data.md, multiplayer.md). The
// publishable key is meant to be in the page: with it a visitor reaches only the ew_ functions and the
// room channels, never a table. Signed in, the calls carry the account's session, and the functions
// know who is asking.
export const SUPABASE_URL = 'https://kawvqpvntdgehigwvfao.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_XjLWqFaE6h9ENP_Glh5gnQ_jDzbnMs9'
// where the client keeps a signed-in session on this device (Supabase's own name for it)
export const SESSION_KEY = 'sb-kawvqpvntdgehigwvfao-auth-token'

let token = null
/** The signed-in account's access token (src/net/account.js keeps it current), or null. */
export const setToken = t => {
  token = t ?? null
}
export const signedIn = () => !!token

/** Call one of the ew_ functions (PostgREST RPC), as the signed-in account when there is one. */
export async function rpc(fn, args, { keepalive = false } = {}) {
  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', keepalive, headers, body: JSON.stringify(args) })
  if (!r.ok) throw new Error(`${fn}: ${r.status}`)
  return r.json()
}

/** The Supabase client (accounts, rooms), loaded only when it is needed: a visitor who never signed in
 *  and never joins a room does not download it. */
let client = null
export async function supabase() {
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js')
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: SESSION_KEY },
      // the realtime service's own words when it closes or refuses something, kept for the probes
      realtime: {
        logger: (kind, msg, data) => {
          if (!/phx_close|phx_error|system|error|close/i.test(`${kind} ${msg} ${JSON.stringify(data ?? '').slice(0, 300)}`)) return
          const log = (window.__ewRealtimeLog ??= [])
          log.push(`${Math.round(performance.now())} ${kind} ${msg} ${JSON.stringify(data ?? '').slice(0, 300)}`)
          if (log.length > 40) log.shift()
        },
      },
    })
  }
  return client
}
