import { test } from 'node:test'
import assert from 'node:assert/strict'
import { usernameProblem, toEmail } from './account.js'

test('names follow the pokemon-site rules: 3 to 20 letters, digits or _, no reserved words', () => {
  assert.equal(usernameProblem('artur'), null)
  assert.equal(usernameProblem('Artur_10'), null)
  assert.equal(usernameProblem('ab'), 'length')
  assert.equal(usernameProblem('a'.repeat(21)), 'length')
  assert.equal(usernameProblem('artur!'), 'chars')
  assert.equal(usernameProblem('Ártur'), 'chars')
  assert.equal(usernameProblem('the_admin'), 'reserved')
})

test('an account is the pokemon-site address for the name, in lower case', () => {
  assert.equal(toEmail(' Artur '), 'artur@pokemon-app.internal')
})
