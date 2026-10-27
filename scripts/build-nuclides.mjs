// Builds src/data/nuclides.json, the chart of nuclides for the Atom Forge, from scripts/data/nuclides.json
// (export_nuclides.py: every known nuclide in the mendeleev package, from NUBASE), with the same isotope
// fixes as the elements' data (scripts/data/fixes.mjs).
// Run: npm run data:nuclides.
//
// The output: { "<Z>": [[A, t, abundance, modes], ...] } with
//   t          half-life in seconds (4 significant digits); null: stable; 0: falls apart at once (it only
//              sheds protons or neutrons, too fast to time); -1: not measured yet
//   abundance  % of the element's atoms in nature (0: none)
//   modes      its decay modes, strongest first, comma-separated (NUBASE codes: A alpha, B- beta minus,
//              B+ beta plus, EC electron capture, SF spontaneous fission, p, n, 2p, B-n...)
import { readFileSync, writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { UNCONFIRMED, HALF, ADDED_MODES, half } from './data/fixes.mjs'

const here = p => fileURLToPath(new URL(p, import.meta.url))
const raw = JSON.parse(readFileSync(here('./data/nuclides.json'), 'utf8'))
const SYMBOL = JSON.parse(readFileSync(here('../src/data/elements.json'), 'utf8')).map(e => e.symbol)
const DRIP = new Set(['p', 'n', '2p', '2n', '3p', '3n', '4n'])

const chart = {}
for (const r of raw) {
  if (r.z < 1 || r.z > 118) continue
  const key = `${SYMBOL[r.z - 1]}-${r.A}`
  if (UNCONFIRMED.has(key)) continue
  const fix = HALF[key] ? half(HALF[key]) : null
  const secs = fix ? fix.halfLifeSeconds : r.halfLifeSeconds
  const modes = r.modes.map(m => m.mode)
  let t
  if (secs != null) t = Number(secs.toPrecision(4))
  else if (r.abundance) t = null
  else if (modes.length && modes.every(m => DRIP.has(m))) t = 0
  else t = -1
  // a stable nuclide's modes are only allowed in theory, never seen (lead-206's alpha decay): left out
  ;(chart[r.z] ??= []).push([r.A, t, r.abundance ?? 0, t === null ? '' : modes.join(',')])
}
// nuclides the source lacks (fixes.mjs)
for (const [key, v] of Object.entries(HALF)) {
  const [sym, A] = key.split('-')
  const z = SYMBOL.indexOf(sym) + 1
  const list = (chart[z] ??= [])
  if (!list.some(n => n[0] === Number(A))) {
    list.push([Number(A), Number(half(v).halfLifeSeconds.toPrecision(4)), 0, (ADDED_MODES[key] ?? []).join(',')])
    list.sort((a, b) => a[0] - b[0])
  }
}

const missing = SYMBOL.filter((_, i) => !chart[i + 1])
if (missing.length) throw new Error(`no nuclides for ${missing.join(' ')}`)

const out = here('../src/data/nuclides.json')
const text = JSON.stringify(chart)
writeFileSync(`${out}.tmp`, text)
renameSync(`${out}.tmp`, out)
const count = Object.values(chart).reduce((s, l) => s + l.length, 0)
const stable = Object.values(chart).flat().filter(n => n[1] === null).length
console.log(`${count} nuclides (${stable} stable) -> src/data/nuclides.json (${(text.length / 1024).toFixed(1)} KB)`)
