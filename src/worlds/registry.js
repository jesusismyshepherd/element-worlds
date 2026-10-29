// Every world and where its code is (loaded on demand), and the address of each:
//   /                      the plaza (the table), ?at=C turns the view to carbon's cube
//   /e/C                   carbon's atrium
//   /e/C/allotropes        one of carbon's wings
//   /lab                   the Molecule Lab;  /forge (?z=Fe) the Atom Forge
// A new wing is one entry in WINGS and one module in wings/<element>/ (docs/knowledge/adding-a-wing.md).
import { element } from '../data/elements.js'

export const WINGS = {
  C: [
    { id: 'allotropes', side: 'n', color: '#7fd4ff', load: () => import('./wings/carbon/allotropes.js') },
    { id: 'life', side: 'e', color: '#8be37a', load: () => import('./wings/carbon/life.js') },
  ],
  O: [
    { id: 'air', side: 'n', color: '#8fd0ff', load: () => import('./wings/oxygen/air.js') },
    { id: 'fire', side: 'e', color: '#ff9a4d', load: () => import('./wings/oxygen/fire.js') },
  ],
  // the neon sign workshop, one wing shared by the noble gases (each arch in its gas's discharge colour)
  He: [{ id: 'signs', side: 'n', color: '#ffb38a', load: () => import('./wings/noble/signs.js') }],
  Ne: [{ id: 'signs', side: 'n', color: '#ff5a3c', load: () => import('./wings/noble/signs.js') }],
  Ar: [{ id: 'signs', side: 'n', color: '#c38bff', load: () => import('./wings/noble/signs.js') }],
  Kr: [{ id: 'signs', side: 'n', color: '#e8ddff', load: () => import('./wings/noble/signs.js') }],
  Xe: [{ id: 'signs', side: 'n', color: '#7ea8ff', load: () => import('./wings/noble/signs.js') }],
  Rn: [{ id: 'signs', side: 'n', color: '#ff6f86', load: () => import('./wings/noble/signs.js') }],
  // the Periodic Videos rooms: an element's film rebuilt as experiments to do (docs/knowledge/periodic-videos.md)
  Na: [{ id: 'videos', side: 'n', color: '#ffb21e', load: () => import('./wings/pv/room.js') }],
}

export const wingsOf = symbol => WINGS[symbol] ?? []

export function loadWorld(target) {
  if (target.kind === 'plaza') return import('./plaza/plaza.js')
  if (target.kind === 'lab') return import('./lab/lab.js')
  if (target.kind === 'forge') return import('./forge/forge.js')
  if (target.kind === 'atrium') return import('./atrium/atrium.js')
  const wing = wingsOf(target.symbol).find(w => w.id === target.wing)
  if (!wing) return Promise.reject(new Error(`no wing ${target.wing} for ${target.symbol}`))
  return wing.load()
}

/** Two targets with the same key are the same world (the plaza's ?at= only turns the view). */
export function worldKey(t) {
  return t.kind === 'plaza' || t.kind === 'lab' || t.kind === 'forge' ? t.kind : `${t.kind}:${t.symbol}:${t.wing ?? ''}`
}

export function targetFrom(pathname, search = '') {
  if (/^\/lab\/?$/.test(pathname)) return { kind: 'lab' }
  if (/^\/forge\/?$/.test(pathname)) {
    const z = new URLSearchParams(search).get('z')
    return { kind: 'forge', z: (z && element(z)?.symbol) || null }
  }
  const m = pathname.match(/^\/e\/([A-Za-z]{1,3})(?:\/([\w-]+))?\/?$/)
  const el = m && element(m[1])
  if (el) return m[2] ? { kind: 'wing', symbol: el.symbol, wing: m[2] } : { kind: 'atrium', symbol: el.symbol }
  const at = new URLSearchParams(search).get('at')
  return { kind: 'plaza', at: (at && element(at)?.symbol) || null }
}

export const atriumPath = symbol => `/e/${symbol}`
export const wingPath = (symbol, wing) => `/e/${symbol}/${wing}`
export const plazaPath = symbol => (symbol ? `/?at=${symbol}` : '/')
