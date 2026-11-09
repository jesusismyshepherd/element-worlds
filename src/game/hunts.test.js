// The treasure hunts (game/hunts.js, content/hunts.js; docs/knowledge/hunts.md): every clue's words in the
// four languages at both depths, without dashes and without giving its element away; every place a hunt
// needs is really in the game (so these tests fail when one goes away); and the completion logic, pure.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { element } from '../data/elements.js'
import { WINGS } from '../worlds/registry.js'
import { mask } from './quiz.js'
import {
  TRACKS, trackOf, HUNTS_PATH, placeOf, keysOfPlace, keysOfTarget, reaches, targetElement, targetKind, hintsOf,
  normalHunts, progressOf, currentClue, startTrack, stopHunt, addTime, advance, mergeHunts, finishedTracks,
} from './hunts.js'
import { TRACK_WORDS, CLUE_WORDS, huntText } from '../content/hunts.js'
import en from '../i18n/locales/en.json' with { type: 'json' }
import pt from '../i18n/locales/pt-pt.json' with { type: 'json' }
import pl from '../i18n/locales/pl.json' with { type: 'json' }
import de from '../i18n/locales/de.json' with { type: 'json' }

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(HERE, '..')
const LANGS = ['en', 'pt-pt', 'pl', 'de']
const LOCALES = { en, 'pt-pt': pt, pl, de }
const DASH = /—|\s–\s/

// the stations every hall without pictures has: the ids stations.js makes (read from its source: the module
// itself needs Vite's glob to load)
const STATIONS = [...readFileSync(path.join(SRC, 'content/stations.js'), 'utf8').matchAll(/make\('(\w+)'/g)].map(m => m[1])
const boardsOf = async symbol => {
  const file = path.join(SRC, 'content/boards', `${symbol}.js`)
  return existsSync(file) ? (await import(`../content/boards/${symbol}.js`)).default : null
}
const roomOf = (symbol, id) => existsSync(path.join(SRC, 'worlds/pictures/scenes', symbol, `${id}.js`))

test('stations.js is read right (eight stations)', () => {
  assert.deepEqual(STATIONS.sort(), ['atom', 'discovery', 'family', 'found', 'identity', 'isotopes', 'state', 'uses'])
})

test('three tracks of six or seven clues, in order, each clue somewhere new', () => {
  assert.ok(TRACKS.length >= 3)
  assert.equal(new Set(TRACKS.map(t => t.id)).size, TRACKS.length, 'track ids differ')
  for (const tr of TRACKS) {
    assert.ok(tr.clues.length >= 6 && tr.clues.length <= 7, `${tr.id}: ${tr.clues.length} clues`)
    assert.equal(new Set(tr.clues.map(c => c.id)).size, tr.clues.length, `${tr.id}: clue ids differ`)
    assert.ok(tr.icon, `${tr.id}: an icon`)
    // hunts start on the plaza: a first clue there would be found at once
    assert.notEqual(tr.clues[0].w, 'plaza', `${tr.id}: the first clue is not on the plaza`)
    // a clue in the world the last one was found in would be found at once too
    tr.clues.forEach((c, i) => i > 0 && assert.notEqual(c.w, tr.clues[i - 1].w, `${tr.id}: ${c.id} is somewhere new`))
  }
  // the history track goes in the order things happened
  const years = trackOf('discoverers').clues.map(c => c.year)
  assert.deepEqual(years, [...years].sort((a, b) => a - b))
})

test('every place a hunt needs is in the game', async () => {
  for (const tr of TRACKS) {
    for (const c of tr.clues) {
      const where = `${tr.id}.${c.id} (${c.w}${c.panel ? ` > ${c.panel}` : ''})`
      let m
      if ((m = /^atrium:([A-Z][a-z]?)$/.exec(c.w))) {
        const el = element(m[1])
        assert.ok(el && el.symbol === m[1], `${where}: a real element`)
        const boards = await boardsOf(el.symbol)
        if (!c.panel) continue
        if (c.panel.startsWith('board:')) {
          const id = c.panel.slice(6)
          const b = boards?.find(x => x.id === id && !x.doors)
          assert.ok(b, `${where}: ${el.symbol}'s hall has the picture ${id} (src/content/boards/${el.symbol}.js)`)
          // stepping into the picture is how it is found (its room: picture-rooms.md); a picture without a
          // room opens its panel there, which reaches it too
          assert.ok(keysOfTarget(c).includes(`atrium:${el.symbol}>board:${id}`))
          if (roomOf(el.symbol, id)) assert.ok(keysOfTarget(c).some(k => k.startsWith(`wing:${el.symbol}:`)), `${where}: reached by its room`)
        } else if (c.panel === 'facts') {
          assert.ok(boards, `${where}: a fact file hangs only in a hall with pictures`)
        } else if (c.panel === 'look') {
          // every hall has its specimen case
        } else {
          assert.ok(STATIONS.includes(c.panel), `${where}: a station stations.js makes`)
          assert.ok(!boards, `${where}: a hall with pictures has its stations in the fact file, not on the walls`)
        }
      } else if ((m = /^wing:([A-Z][a-z]?):([\w-]+)$/.exec(c.w))) {
        const inWings = (WINGS[m[1]] ?? []).some(w => w.id === m[2])
        assert.ok(inWings || roomOf(m[1], m[2]), `${where}: a wing in registry.js WINGS, or a picture's room`)
        assert.ok(!c.panel, `${where}: a wing's exhibits are not checked here: the wing itself is the place`)
      } else {
        assert.ok(['lab', 'forge', 'stars', 'plaza'].includes(c.w), `${where}: a world`)
        assert.ok(!c.panel, `${where}: no exhibit there opens a panel the walker reads`)
      }
    }
  }
})

test('every track and clue has its words in four languages at both depths, without dashes', () => {
  for (const tr of TRACKS) {
    const w = TRACK_WORDS[tr.id]
    assert.ok(w, `${tr.id}: words`)
    for (const lang of LANGS) {
      assert.ok(w.title[lang]?.trim(), `${tr.id}: title in ${lang}`)
      assert.ok(!DASH.test(w.title[lang]), `${tr.id}: title in ${lang}`)
      for (const d of ['kid', 'sci']) {
        const s = w.about[lang]?.[d]
        assert.ok(s?.trim(), `${tr.id}: about, ${lang} ${d}`)
        assert.ok(!DASH.test(s), `${tr.id} (${lang} ${d}): no em dash or dash as a pause: ${s}`)
      }
    }
    for (const c of tr.clues) {
      const words = CLUE_WORDS[`${tr.id}.${c.id}`]
      assert.ok(words, `${tr.id}.${c.id}: words`)
      for (const part of ['riddle', 'found']) {
        for (const lang of LANGS) {
          for (const d of ['kid', 'sci']) {
            const s = words[part]?.[lang]?.[d]
            const where = `${tr.id}.${c.id} ${part} (${lang} ${d})`
            assert.ok(s?.trim(), `${where}: present`)
            assert.ok(!DASH.test(s), `${where}: no em dash or dash as a pause: ${s}`)
            assert.ok(s.length <= 420, `${where}: short enough for the card (${s.length})`)
          }
        }
      }
    }
  }
  const clues = new Set(TRACKS.flatMap(tr => tr.clues.map(c => `${tr.id}.${c.id}`)))
  for (const k of Object.keys(CLUE_WORDS)) assert.ok(clues.has(k), `${k}: a clue of a track`)
  assert.equal(huntText(CLUE_WORDS['records.coldest'].riddle, 'xx', 'scientist'), CLUE_WORDS['records.coldest'].riddle.en.sci)
})

test('a riddle names the thing, never the element (its name, declined or in compounds, or its symbol)', () => {
  for (const tr of TRACKS) {
    for (const c of tr.clues) {
      const el = targetElement(c)
      if (!el) continue
      for (const lang of LANGS) {
        for (const d of ['kid', 'sci']) {
          const s = CLUE_WORDS[`${tr.id}.${c.id}`].riddle[lang][d]
          assert.equal(mask(s, el, lang), s, `${tr.id}.${c.id} riddle (${lang} ${d}) gives ${el.symbol} away`)
        }
      }
    }
  }
})

test('the HUD words: a hunts block in every language, the keys of English, without dashes', () => {
  const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]))
  const base = k => k.replace(/_(zero|one|two|few|many|other)$/, '')
  const want = new Set(flat(en.hunts).map(([k]) => base(k)))
  for (const lang of LANGS) {
    const block = LOCALES[lang].hunts
    assert.ok(block, `${lang}: hunts`)
    const have = flat(block)
    assert.deepEqual(new Set(have.map(([k]) => base(k))), want, `${lang}: the same keys as English`)
    for (const [k, v] of have) assert.ok(typeof v === 'string' && v.trim() && !DASH.test(v), `${lang} hunts.${k}: ${v}`)
    for (const tr of TRACKS) {
      const b = LOCALES[lang].passport.badge[`hunt-${tr.id}`]
      assert.ok(b?.icon && b?.name && b?.how, `${lang}: the badge of ${tr.id}`)
    }
  }
  // the hints' places and the clue's "where" for every kind of target
  for (const kind of ['picture', 'facts', 'look', 'station', 'wing', 'hall']) {
    assert.ok(en.hunts.where[kind], `where.${kind}`)
    assert.ok(en.hunts.hint[kind], `hint.${kind}`)
  }
})

// ---- the logic ----

const store = (world, extra = {}) => ({ fading: false, world, panel: null, panelFrom: null, ...extra })
const hall = symbol => ({ kind: 'atrium', symbol, wing: null })
const wing = (symbol, id) => ({ kind: 'wing', symbol, wing: id })

test('where the player is, from the store', () => {
  assert.deepEqual(placeOf(store(hall('Na'))), { w: 'atrium:Na', panel: null })
  assert.deepEqual(placeOf(store(hall('O'), { panel: { title: 'x' }, panelFrom: 'facts' })), { w: 'atrium:O', panel: 'facts' })
  // a panel closed keeps its exhibit's id in the store: it no longer counts
  assert.deepEqual(placeOf(store(hall('O'), { panelFrom: 'facts' })), { w: 'atrium:O', panel: null })
  assert.deepEqual(placeOf(store({ kind: 'plaza', symbol: null, wing: null })), { w: 'plaza', panel: null })
  assert.deepEqual(placeOf(store(wing('C', 'allotropes'))), { w: 'wing:C:allotropes', panel: null })
  // between worlds (the fade) nothing counts yet
  assert.equal(placeOf(store(hall('Na'), { fading: true })), null)
  assert.equal(placeOf(store(null)), null)
  assert.deepEqual(keysOfPlace({ w: 'atrium:O', panel: 'facts' }), ['atrium:O', 'atrium:O>facts'])
})

test('a target is reached by its world, its exhibit, or a picture by its room', () => {
  const davy = { w: 'atrium:Na', panel: 'board:davy' }
  assert.ok(reaches(davy, { w: 'wing:Na:davy', panel: null }), 'stepping into the picture')
  assert.ok(reaches(davy, { w: 'atrium:Na', panel: 'board:davy' }), 'its panel, were it one')
  assert.ok(!reaches(davy, { w: 'atrium:Na', panel: null }), 'the hall alone is not the picture')
  assert.ok(!reaches(davy, { w: 'wing:Na:salt', panel: null }), 'another picture')
  // oxygen's fire picture hangs beside its fire wing: its room is fire-picture
  assert.deepEqual(keysOfTarget({ w: 'atrium:O', panel: 'board:fire' }), ['atrium:O>board:fire', 'wing:O:fire-picture'])
  const state = { w: 'atrium:He', panel: 'state' }
  assert.ok(reaches(state, { w: 'atrium:He', panel: 'state' }))
  assert.ok(!reaches(state, { w: 'atrium:He', panel: 'look' }))
  assert.ok(!reaches(state, { w: 'atrium:Ne', panel: 'state' }))
  // a world alone: anywhere in it, with any panel open
  assert.ok(reaches({ w: 'wing:C:allotropes' }, { w: 'wing:C:allotropes', panel: 'diamond' }))
  assert.ok(reaches({ w: 'lab' }, { w: 'lab', panel: null }))
  assert.ok(!reaches({ w: 'lab' }, null))
})

test('what kind of place, and the hints: family and row, then (Explorer) the element', () => {
  assert.equal(targetKind({ w: 'atrium:Na', panel: 'board:davy' }), 'picture')
  assert.equal(targetKind({ w: 'atrium:O', panel: 'facts' }), 'facts')
  assert.equal(targetKind({ w: 'atrium:Hg', panel: 'look' }), 'look')
  assert.equal(targetKind({ w: 'atrium:He', panel: 'state' }), 'station')
  assert.equal(targetKind({ w: 'atrium:He' }), 'hall')
  assert.equal(targetKind({ w: 'wing:C:allotropes' }), 'wing')
  assert.equal(targetKind({ w: 'lab' }), 'lab')
  assert.equal(targetElement({ w: 'wing:C:allotropes' }).symbol, 'C')
  assert.equal(targetElement({ w: 'forge' }), null)
  const kr = { w: 'atrium:Kr', panel: 'board:hidden' }
  assert.deepEqual(hintsOf(kr, 'scientist'), [{ kind: 'family', family: 'noble-gas', period: 4 }])
  assert.deepEqual(hintsOf(kr, 'explorer')[1], { kind: 'name', symbol: 'Kr', place: 'picture', panel: 'board:hidden', wing: null })
  assert.equal(hintsOf({ w: 'wing:C:allotropes' }, 'explorer')[1].wing, 'allotropes')
  assert.deepEqual(hintsOf({ w: 'lab' }, 'explorer'), [{ kind: 'place', w: 'lab' }])
  // every clue of every track has its hints, the family one first and never the name
  for (const tr of TRACKS) for (const c of tr.clues) {
    const h = hintsOf(c, 'scientist')
    assert.equal(h.length, 1, `${tr.id}.${c.id}`)
    assert.equal(h[0].kind, 'family')
    assert.equal(hintsOf(c, 'explorer').length, 2)
  }
})

test('a hunt in order: only the clue to find now counts, the last one finishes it with its time', () => {
  const tr = trackOf('records')
  let s = startTrack(normalHunts(null), 'records', 1000)
  assert.equal(s.on, 'records')
  assert.equal(currentClue(s).clue.id, 'lightest')
  assert.deepEqual(progressOf(s, 'records'), { step: 0, of: 7, started: true, finished: false, done: 0, best: null, last: null, on: true })
  // the third clue's place does nothing while the first is to be found
  let r = advance(s, { w: 'wing:C:allotropes', panel: null }, 2000)
  assert.equal(r.event, null)
  assert.equal(r.state, s)
  // the first one: stepping into hydrogen's Big Bang picture
  r = advance(s, { w: 'wing:H:bigbang', panel: null }, 3000)
  assert.deepEqual(r.event, { kind: 'clue', track: 'records', step: 0, clue: tr.clues[0] })
  s = r.state
  assert.equal(s.tracks.records.step, 1)
  assert.equal(s.tracks.records.at, 3000)
  // the same place again counts no more
  assert.equal(advance(s, { w: 'wing:H:bigbang', panel: null }, 3100).event, null)
  // helium's hall alone is not its station
  assert.equal(advance(s, { w: 'atrium:He', panel: null }, 3200).event, null)
  s = advance(s, { w: 'atrium:He', panel: 'state' }, 4000).state
  s = addTime(s, 60000)
  for (const [i, p] of [[2, { w: 'wing:C:allotropes', panel: null }], [3, { w: 'atrium:O', panel: 'facts' }], [4, { w: 'atrium:Os', panel: 'state' }], [5, { w: 'atrium:Hg', panel: 'look' }]]) {
    r = advance(s, p, 5000 + i)
    assert.equal(r.event?.kind, 'clue', `clue ${i}`)
    s = r.state
  }
  s = addTime(s, 30000)
  r = advance(s, { w: 'atrium:Og', panel: 'identity' }, 9000)
  assert.equal(r.event.kind, 'done')
  assert.equal(r.event.spent, 90000)
  s = r.state
  assert.equal(s.on, null, 'the hunt is over')
  assert.deepEqual(progressOf(s, 'records'), { step: 7, of: 7, started: true, finished: true, done: 1, best: 90000, last: 90000, on: false })
  assert.deepEqual(finishedTracks(s), ['records'])
  assert.equal(advance(s, { w: 'atrium:Og', panel: 'identity' }, 9100).event, null, 'nothing on: nothing happens')
  // played again: from the first clue, the finish and the best time kept; a faster run is the new best
  s = startTrack(s, 'records', 10000)
  assert.equal(s.tracks.records.step, 0)
  assert.equal(s.tracks.records.done, 1)
  assert.equal(s.tracks.records.best, 90000)
  s = addTime(s, 1000)
  for (const c of tr.clues) s = advance(s, keysOfTarget(c).at(-1).includes('>') ? { w: c.w, panel: c.panel } : { w: keysOfTarget(c).at(-1), panel: null }, 11000).state
  assert.equal(s.tracks.records.done, 2)
  assert.equal(s.tracks.records.best, 1000)
  assert.equal(s.tracks.records.last, 1000)
})

test('a hunt left waits at its clue; another one can be played meanwhile', () => {
  let s = startTrack(normalHunts(null), 'home', 1)
  s = advance(s, { w: 'wing:Fe:cereal', panel: null }, 2).state
  s = addTime(s, 5000)
  s = stopHunt(s, 3)
  assert.equal(s.on, null)
  assert.equal(currentClue(s), null)
  assert.equal(advance(s, { w: 'wing:Na:salt', panel: null }, 4).event, null, 'a hunt left finds nothing')
  s = startTrack(s, 'discoverers', 5)
  s = advance(s, { w: 'wing:Fe:meteorite', panel: null }, 6).state
  assert.equal(s.tracks.home.step, 1, 'the other one waits')
  s = startTrack(s, 'home', 7)
  assert.equal(s.on, 'home')
  assert.equal(s.tracks.home.step, 1, 'and goes on where it was left')
  assert.equal(s.tracks.home.spent, 5000)
  assert.equal(currentClue(s).clue.id, 'salt')
  assert.equal(s.tracks.discoverers.step, 1)
  assert.equal(stopHunt(normalHunts(null), 9).at, 0, 'nothing on: nothing to leave')
})

test('the kept state: made safe, and two devices joined track by track', () => {
  assert.equal(HUNTS_PATH, '/hunts')
  assert.deepEqual(normalHunts(null), { on: null, at: 0, tracks: {} })
  const junk = normalHunts({ on: 'nope', at: 'x', tracks: { records: { step: 99, at: 5, done: -2, best: 0, spent: -1 }, nope: { step: 1 } } })
  assert.deepEqual(junk, { on: null, at: 0, tracks: { records: { step: 7, at: 5, start: 0, spent: 0, done: 0, best: null, last: null } } })
  // a finished track cannot be the one on
  assert.equal(normalHunts({ on: 'records', tracks: { records: { step: 7 } } }).on, null)
  // this device moved one track on, the account another: both kept
  const mine = { on: 'home', at: 50, tracks: { home: { step: 3, at: 50, start: 10, spent: 100, done: 0 }, records: { step: 1, at: 5, done: 1, best: 900 } } }
  const theirs = { on: 'records', at: 40, tracks: { records: { step: 4, at: 40, done: 0, best: 1200 }, discoverers: { step: 2, at: 30 } } }
  const m = mergeHunts(mine, theirs)
  assert.equal(m.on, 'home', 'the newer state says which is on')
  assert.equal(m.at, 50)
  assert.equal(m.tracks.home.step, 3)
  assert.equal(m.tracks.records.step, 4, 'the newer of each track')
  assert.equal(m.tracks.records.done, 1, 'finishes never lost')
  assert.equal(m.tracks.records.best, 900, 'the best time is the shorter')
  assert.equal(m.tracks.discoverers.step, 2)
  assert.deepEqual(mergeHunts(null, theirs), normalHunts(theirs))
  assert.deepEqual(mergeHunts(mine, null), normalHunts(mine))
})
