// One visit in plain words, for the dashboard's timeline (/stats): each line a thing done, with its time
// ("entered Carbon's hall (3 min, 2 min active)", "opened the Fact file for 45 s", "asked Carbon's
// Atomling 3 times"). Runs of the same small thing (talks, picks, card facts, forge clicks) fold into one
// line; a panel's open and close are one line; a stay's leave is said in its enter line.
import { dur, plural, list } from './format.js'
import { placeName, panelName, elementName, symbolOf, drawerName, levelName, viewName, langName, missionName, beamName, nuclideName } from './names.js'
import { placeOfPath, isRead } from './analyze.js'

const PARTICLE = { p: 'proton', n: 'neutron', e: 'electron' }
const an = word => (/^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`)
const str = v => (v == null ? '' : String(v))
const num = v => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : 0)

/** A small piece of data as text, for kinds the dashboard does not know (no more than a line). */
export function compact(data) {
  if (!data || typeof data !== 'object') return ''
  const s = Object.entries(data)
    .map(([k, v]) => `${k}: ${typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}`)
    .join(', ')
  return s.length > 120 ? `${s.slice(0, 119)}…` : s
}

/** The lines of a visit: [{ at, text, tone, head }]. `head` marks a world entered (the page sets it
 *  apart), tone 'error' an error, 'note' a remark about the recording itself. */
export function timelineOf(v) {
  const evs = v.events
  const lines = []
  const usedReadings = new Set()
  const entered = new Set()
  const said = new Set() // events already said in an earlier line (a show, with its hide)
  let fold = null // the line the next event of the same run is folded into
  const push = (e, text, extra = {}) => {
    const line = { at: e.at, text, tone: extra.tone ?? null, head: !!extra.head }
    lines.push(line)
    fold = extra.fold ? { key: extra.fold, line, state: extra.state } : null
    return line
  }
  // the enter that begins each stay (the closest to its start): a world rebuilt where it stood enters
  // again within a second, and those enters are part of the same stay
  const heads = new Map()
  for (const s of v.stays) {
    let best = -1
    evs.forEach((x, i) => {
      if (x.kind !== 'enter' || x.data.w !== s.w || Math.abs(x.at - s.start) > 1500) return
      if (best < 0 || Math.abs(x.at - s.start) < Math.abs(evs[best].at - s.start)) best = i
    })
    if (best >= 0) heads.set(best, s)
  }
  if (v.carried) lines.push({ at: evs[0].at, text: `${plural(v.carried, 'event')} from an earlier page load on this device, sent with this visit:`, tone: 'note', head: false })

  for (let i = 0; i < evs.length; i++) {
    const e = evs[i]
    const d = e.data
    const place = placeOfPath(e.path)
    if (i === v.carried && v.carried) lines.push({ at: e.at, text: 'This page load:', tone: 'note', head: false })
    switch (e.kind) {
      case 'start': {
        const where = place === 'plaza' ? '' : ` at ${placeName(place)}`
        const what = [str(d.browser), d.w && d.h ? `${num(d.w)}×${num(d.h)}` : '', d.app === true ? 'the home-screen app' : ''].filter(Boolean).join(', ')
        push(e, `opened the site${where} on ${an(str(d.kind) || 'device')}${what ? ` (${what})` : ''}`)
        break
      }
      case 'enter': {
        const w = str(d.w)
        const s = heads.get(i)
        if (!s && entered.has(w)) break // the same world rebuilt where it stood: one stay
        entered.add(w)
        const how = s ? ` (${dur(s.ms)}, ${dur(s.act)} active${s.est ? ', estimated: the page was closed or put away' : ''})` : ''
        push(e, `entered ${placeName(w)}${how}`, { head: true })
        break
      }
      case 'leave': {
        const w = str(d.w)
        // said in its enter line, unless the enter was before this period or this page load
        if (entered.has(w)) break
        entered.add(w)
        push(e, `was in ${placeName(w)} (${dur(num(d.ms))}, ${dur(num(d.act))} active) and left`, { head: true })
        break
      }
      case 'panel': {
        const id = str(d.id)
        const r = v.readings.find(x => !usedReadings.has(x) && x.id === id && Math.abs(x.at - e.at) <= 1500)
        if (!r) break // its id corrected a frame later (analyze.js FLICKER_MS)
        usedReadings.add(r)
        const name = panelName(id, r.place)
        if (r.est) push(e, `opened ${name}, still open when the visit ended (${dur(r.ms)} or more)`)
        else push(e, isRead(r) ? `opened ${name} for ${dur(r.ms)}` : `opened ${name} and closed it after ${dur(r.ms)}`)
        break
      }
      case 'pclose':
        break // said with its panel
      case 'talk': {
        const who = symbolOf(d.w) ? `${elementName(d.w)}'s Atomling` : 'the Atomling'
        if (fold?.key === `talk:${who}`) {
          fold.state.n++
          fold.line.text = `asked ${who} to tell something, ${fold.state.n} times`
        } else push(e, `asked ${who} to tell something`, { fold: `talk:${who}`, state: { n: 1 } })
        break
      }
      case 'sel': {
        const name = elementName(d.z)
        if (fold?.key === 'sel') {
          fold.state.names.push(name)
          const ns = fold.state.names
          fold.line.text = `picked ${ns.length > 6 ? `${ns.slice(0, 5).join(', ')} and ${ns.length - 5} more` : list(ns)} on the table`
        } else push(e, `picked ${name} on the table`, { fold: 'sel', state: { names: [name] } })
        break
      }
      case 'fact': {
        const s = str(d.s)
        const n = num(d.n)
        const at = num(d.i) + 1
        if (!s || !n) {
          push(e, 'clicked a fact on the plaza card')
          break
        }
        if (fold?.key === `fact:${s}`) {
          fold.state.k++
          fold.line.text = `clicked through ${fold.state.k} facts on ${elementName(s)}'s card (to fact ${at} of ${n})`
        } else push(e, `clicked to fact ${at} of ${n} on ${elementName(s)}'s card`, { fold: `fact:${s}`, state: { k: 1 } })
        break
      }
      case 'tile':
        push(e, d.to ? `took the floor table to ${placeName(`atrium:${symbolOf(d.to) ?? str(d.to)}`)}` : 'used the floor table')
        break
      case 'quizopen':
        push(e, 'opened the quiz “Who am I?”')
        break
      case 'quiz': {
        const clues = num(d.of) ? ` with ${num(d.clues)} of ${num(d.of)} clues shown` : ''
        const answer = d.ok === true ? `${elementName(d.z)} (right)` : `${elementName(d.pick)} (wrong, it was ${elementName(d.z)})`
        push(e, `quiz question ${num(d.n) || '?'}: ${answer}${clues}`)
        break
      }
      case 'drawer':
        push(e, `opened ${drawerName(str(d.id))}`)
        break
      case 'find':
        push(e, `searched and picked ${elementName(d.z)}`)
        break
      case 'forge': {
        const op = str(d.op)
        if (op === 'fire') {
          push(e, `fired ${an(beamName(str(d.beam)))} at ${nuclideName(d.z, d.n)}`)
          break
        }
        if (op !== 'add' && op !== 'remove') {
          push(e, `forge: ${compact(d)}`)
          break
        }
        // what is on the table after the click (the event says what was there before it)
        const k = str(d.k)
        const sign = op === 'add' ? 1 : -1
        const after = { z: num(d.z) + (k === 'p' ? sign : 0), n: num(d.n) + (k === 'n' ? sign : 0), e: num(d.e) + (k === 'e' ? sign : 0) }
        const state = fold?.key === 'forge' ? fold.state : { add: {}, remove: {} }
        state[op][k] = (state[op][k] ?? 0) + 1
        const says = ['add', 'remove'].map(o => {
          const parts = Object.entries(state[o]).map(([x, c]) => `${c === 1 ? an(PARTICLE[x] ?? x) : `${c} ${PARTICLE[x] ?? x}s`}`)
          return parts.length ? `${o === 'add' ? 'added' : 'removed'} ${list(parts)}` : ''
        })
        const text = `${says.filter(Boolean).join(', ')} in the forge (then ${nuclideName(after.z, after.n)}, ${plural(Math.max(0, after.e), 'electron')})`
        if (fold?.key === 'forge') fold.line.text = text
        else push(e, text, { fold: 'forge', state })
        break
      }
      case 'mission':
        push(e, `completed the mission “${missionName(d.id)}”`)
        break
      case 'level':
        push(e, `switched to ${levelName(d.v)}`)
        break
      case 'view':
        push(e, `switched to ${viewName(d.v)}`)
        break
      case 'lang':
        push(e, `changed the language to ${langName(d.v)}`)
        break
      case 'hide': {
        const j = evs.findIndex((x, k) => k > i && (x.kind === 'show' || x.kind === 'hide' || x.kind === 'start'))
        if (j > 0 && evs[j].kind === 'show') {
          push(e, `put the page away for ${dur(evs[j].at - e.at)}`)
          said.add(j)
        } else push(e, 'put the page away')
        break
      }
      case 'show':
        if (!said.has(i)) push(e, 'came back to the page')
        break
      case 'err':
        push(e, `error: ${str(d.m) || '(no message)'}${d.s ? ` (${str(d.s)})` : ''}`, { tone: 'error' })
        break
      case 'room': {
        const op = str(d.op)
        push(e, op === 'join' ? 'joined a room' : op === 'leave' ? 'left the room' : `room: ${compact(d)}`)
        break
      }
      default: {
        const more = compact(d)
        push(e, `${e.kind}${more ? ` (${more})` : ''}`)
      }
    }
  }
  return lines
}
