// The family on today's element (docs/knowledge/daily.md, "The family"; supabase/ew_006_family.sql): for a
// signed-in member, every member's name and the days each did the lesson since a day; null for anyone else.
// Who is family is the admin's choice (the family dashboard's People).
import { rpc, signedIn } from './config.js'

export async function familyDays(since) {
  if (!signedIn()) return null
  const r = await rpc('ew_family_days', { p_since: since }).catch(() => null)
  return Array.isArray(r) ? r : null
}
