// GET /api/chapter?v=NLT&ch=PSA.19: a whole chapter for the verse panels' "Read the whole chapter"
// (docs/knowledge/scripture.md), as { v, ch, verses: [{ n, text }], poem }. Fetched live from the
// publisher's licensed source when someone asks, and kept only in the CDN's cache: the YouVersion developer
// API when the app key is set (YVP_APP_KEY, every translation whose licence is accepted), else Tyndale's
// NLT API (anonymous, the NLT only). Where neither has it the answer is empty ({ verses: [], away: true },
// not a 404, which browsers log as an error) and cached only an hour: the panel then links to the Bible App.
import { YV, nltChapter, youVersionChapter } from './_bible.js'

export default async function handler(req, res) {
  const v = String(req.query?.v ?? '')
  const ch = String(req.query?.ch ?? '')
  const m = /^([1-3A-Z]{3})\.(\d{1,3})$/.exec(ch)
  if (!(v in YV) || !m) return res.status(400).json({ error: 'v (a translation) and ch (BOOK.chapter) please' })
  try {
    const out = (await youVersionChapter(v, m[1], m[2], process.env.YVP_APP_KEY)) ?? (v === 'NLT' ? await nltChapter(m[1], m[2]) : null)
    if (!out) {
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600')
      return res.status(200).json({ v, ch, verses: [], away: true })
    }
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800')
    return res.status(200).json({ v, ch, ...out })
  } catch (e) {
    return res.status(502).json({ error: String(e?.message ?? e) })
  }
}
