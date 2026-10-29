// The family's Supabase project (pokemon-site's), where Element Worlds keeps its usage data and runs its
// rooms (docs/knowledge/usage-data.md, docs/knowledge/multiplayer.md). The publishable key is meant to be
// in the page: with it a visitor reaches only the ew_ functions and the room channels, never a table.
export const SUPABASE_URL = 'https://kawvqpvntdgehigwvfao.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_XjLWqFaE6h9ENP_Glh5gnQ_jDzbnMs9'

/** Call one of the ew_ functions (PostgREST RPC). */
export async function rpc(fn, args, { keepalive = false } = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    keepalive,
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  if (!r.ok) throw new Error(`${fn}: ${r.status}`)
  return r.json()
}

/** The Supabase client, loaded only when it is needed (the rooms, the dashboard). */
let client = null
export async function supabase() {
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js')
    client = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return client
}
