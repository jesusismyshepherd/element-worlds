import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ELEMENTS } from './elements.js'

// The studio's backlog (docs/studio/backlog.json, docs/knowledge/update-dashboard.md): the page draws
// every idea as a periodic-table tile, so a tile's code is either its element's real symbol (with `z`)
// or a code that is no element's symbol.
const backlog = JSON.parse(readFileSync(new URL('../../docs/studio/backlog.json', import.meta.url), 'utf8'))
const BY_SYMBOL = Object.fromEntries(ELEMENTS.map(e => [e.symbol, e.z]))
const STATUSES = ['next', 'building', 'idea', 'parked', 'built']
const FROM = ['you', 'artur', 'claude']

test('every item is complete and its tile is true to the table', () => {
  const ids = new Set()
  const kinds = new Set(backlog.kinds.map(k => k.id))
  for (const it of backlog.items) {
    assert.ok(!ids.has(it.id), `${it.id}: twice`)
    ids.add(it.id)
    assert.ok(kinds.has(it.kind), `${it.id}: kind ${it.kind}`)
    assert.ok(STATUSES.includes(it.status), `${it.id}: status ${it.status}`)
    assert.ok(FROM.includes(it.from), `${it.id}: from ${it.from}`)
    assert.match(it.date, /^\d{4}-\d{2}-\d{2}$/, `${it.id}: date`)
    assert.ok(it.title && it.summary && it.code, `${it.id}: title, summary and code`)
    if (it.z != null) assert.equal(BY_SYMBOL[it.code], it.z, `${it.id}: ${it.code} is not element ${it.z}`)
    else assert.equal(BY_SYMBOL[it.code], undefined, `${it.id}: ${it.code} is a real element's symbol; give it z or another code`)
  }
})

test('the queue names items that wait to be built, each with its reason', () => {
  const byId = Object.fromEntries(backlog.items.map(i => [i.id, i]))
  assert.equal(new Set(backlog.next).size, backlog.next.length, 'an item twice in the queue')
  for (const id of backlog.next) {
    assert.ok(byId[id], `next: ${id} is not an item`)
    assert.ok(['next', 'building'].includes(byId[id].status), `next: ${id} is ${byId[id].status}`)
    assert.ok(byId[id].why, `next: ${id} has no why`)
  }
  for (const it of backlog.items.filter(i => i.status === 'next' || i.status === 'building')) {
    assert.ok(backlog.next.includes(it.id), `${it.id} is ${it.status} but not in the queue`)
  }
})

test('the words the user reads have no em dashes', () => {
  assert.ok(!JSON.stringify(backlog).includes(String.fromCharCode(0x2014)))
})
