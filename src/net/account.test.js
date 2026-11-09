import { test } from 'node:test'
import assert from 'node:assert/strict'
import { usernameProblem, toEmail, inviteFrom } from './account.js'

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

test("an invite is read from the Pokémon site's link, from this site's, or alone", () => {
  const tok = '0123456789abcdef0123456789abcdef'
  assert.equal(inviteFrom(`https://pokemon-site.vercel.app/signup?invite=${tok}`), tok)
  assert.equal(inviteFrom(`https://element-worlds.vercel.app/?invite=${tok.toUpperCase()}`), tok)
  assert.equal(inviteFrom(`  ${tok} `), tok)
  assert.equal(inviteFrom('https://example.com/?invite=123'), null)
  assert.equal(inviteFrom(`${tok}0`), null) // 33 characters: not a token
  assert.equal(inviteFrom(''), null)
  assert.equal(inviteFrom(null), null)
})
