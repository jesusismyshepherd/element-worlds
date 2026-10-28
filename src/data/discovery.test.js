import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS } from './elements.js'
import { discoverersOf, discoveryPlaceOf, DISCOVERY_TABLES } from './discovery.js'

const OTHERS = ['pt-pt', 'pl', 'de']

test('every place in the data is translated into every language', () => {
  for (const el of ELEMENTS.filter(e => e.discoveryPlace)) {
    for (const lang of OTHERS) assert.ok(DISCOVERY_TABLES.PLACES[el.discoveryPlace]?.[lang], `${el.symbol}: ${el.discoveryPlace} (${lang})`)
  }
})

test('discoverers with words besides names are translated; English is as the data says', () => {
  for (const el of ELEMENTS.filter(e => e.discoverers)) {
    assert.equal(discoverersOf(el, 'en'), el.discoverers)
    if (/ and |'s team|credit|U of Calif|with /.test(el.discoverers)) {
      for (const lang of OTHERS) assert.ok(DISCOVERY_TABLES.WHO[el.discoverers]?.[lang], `${el.symbol}: ${el.discoverers} (${lang})`)
    }
  }
  const po = ELEMENTS.find(e => e.symbol === 'Po')
  assert.equal(discoverersOf(po, 'de'), 'Pierre und Marie Curie')
  assert.equal(discoveryPlaceOf(po, 'pl'), 'Francja')
})
