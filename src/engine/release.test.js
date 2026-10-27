import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isStaleChunk } from './release.js'

test('stale chunks are told from other errors', () => {
  assert.ok(isStaleChunk(new TypeError('Failed to fetch dynamically imported module: https://x/assets/lab-1a2b.js')))
  assert.ok(isStaleChunk('Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html".'))
  assert.ok(isStaleChunk(new TypeError('Importing a module script failed.')))
  assert.ok(!isStaleChunk(new TypeError("Cannot read properties of undefined (reading 'x')")))
  assert.ok(!isStaleChunk(new Error('no wing signs for C')))
})
