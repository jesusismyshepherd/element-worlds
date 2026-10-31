// The family studio's two calls (supabase/ew_004_studio.sql; docs/knowledge/update-dashboard.md), as the
// signed-in account (src/net/config.js carries its session). Both answer null signed out.
import { rpc } from './config.js'

/** What the account may read: its own ideas, notes and verdicts with Claude's answers; an admin, everyone's. */
export const listStudio = () => rpc('ew_studio_list', {})

/** Send an idea (text), a note (about an item id, or the studio when item is empty) or a verdict (an item
 *  id and first, later or no). Answers the row kept, or { error }. */
export const postStudio = (kind, { item = '', text = '', value = null } = {}) =>
  rpc('ew_studio_post', { p_kind: kind, p_item: item ?? '', p_text: text ?? '', p_value: value })
