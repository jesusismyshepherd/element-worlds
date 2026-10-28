// A font of bent glass tubes: every glyph is the centre line of the tube, as strokes (polylines and
// arcs) on a grid where capitals stand 6 units tall on the baseline. Capitals, the Portuguese, Polish
// (Ą Ć Ę Ł Ń Ó Ś Ź Ż) and German (Ä Ö Ü; ß is written SS) accented capitals, digits, a few marks, and the
// lowercase e, r, n for the symbols He, Ne, Ar, Kr, Xe, Rn.
// Pure (no three.js): neonTube.js sweeps a tube along the strokes, and the tests read it.

/** Points along an ellipse arc from a0 to a1 (degrees, either direction). */
export function arc(cx, cy, rx, ry, a0, a1) {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 10))
  const out = []
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)])
  }
  return out
}

const open = pts => ({ pts, closed: false })
const loop = pts => ({ pts: pts.slice(0, -1), closed: true }) // an arc of 360 degrees, its last point dropped
const dot = (x, y, r = 0.32) => loop(arc(x, y, r, r, 0, 360))

const P_BOWL = [[0, 0], [0, 6], [2.3, 6], ...arc(2.3, 4.45, 1.6, 1.55, 90, -90), [0, 2.9]]

const BASE = {
  A: { w: 4.4, s: [open([[0, 0], [2.2, 6], [4.4, 0]]), open([[0.85, 2.2], [3.55, 2.2]])] },
  B: {
    w: 4,
    s: [
      open([[0, 0], [0, 6], [2.25, 6], ...arc(2.25, 4.55, 1.45, 1.45, 90, -90), [0, 3.1]]),
      open([[0, 3.1], [2.4, 3.1], ...arc(2.4, 1.55, 1.6, 1.55, 90, -90), [0, 0]]),
    ],
  },
  C: { w: 4, s: [open(arc(2.2, 3, 2.2, 3, 42, 318))] },
  D: { w: 4.2, s: [loop([[0, 0], [0, 6], [1.6, 6], ...arc(1.6, 3, 2.6, 3, 90, -90), [0, 0]])] },
  E: { w: 3.6, s: [open([[3.6, 6], [0, 6], [0, 0], [3.6, 0]]), open([[0, 3.1], [2.9, 3.1]])] },
  F: { w: 3.6, s: [open([[3.6, 6], [0, 6], [0, 0]]), open([[0, 3.1], [2.9, 3.1]])] },
  G: { w: 4.4, s: [open([...arc(2.2, 3, 2.2, 3, 45, 360), [2.5, 3]])] },
  H: { w: 4, s: [open([[0, 0], [0, 6]]), open([[4, 0], [4, 6]]), open([[0, 3.1], [4, 3.1]])] },
  I: { w: 0, s: [open([[0, 0], [0, 6]])] },
  J: { w: 3.4, s: [open([[3.4, 6], [3.4, 1.7], ...arc(1.7, 1.7, 1.7, 1.7, 0, -180)])] },
  K: { w: 3.9, s: [open([[0, 0], [0, 6]]), open([[3.8, 6], [0, 2.3]]), open([[1.35, 3.55], [3.9, 0]])] },
  L: { w: 3.4, s: [open([[0, 6], [0, 0], [3.4, 0]])] },
  M: { w: 5, s: [open([[0, 0], [0, 6], [2.5, 2], [5, 6], [5, 0]])] },
  N: { w: 4, s: [open([[0, 0], [0, 6], [4, 0], [4, 6]])] },
  O: { w: 4.4, s: [loop(arc(2.2, 3, 2.2, 3, 90, 450))] },
  P: { w: 3.9, s: [open(P_BOWL)] },
  Q: { w: 4.4, s: [loop(arc(2.2, 3, 2.2, 3, 90, 450)), open([[2.7, 1.5], [4.5, -0.3]])] },
  R: { w: 4, s: [open(P_BOWL), open([[2, 2.9], [4, 0]])] },
  S: { w: 4, s: [open([...arc(2, 4.5, 1.9, 1.5, 15, 270), ...arc(2, 1.5, 2, 1.5, 90, -165).slice(1)])] },
  T: { w: 4.2, s: [open([[0, 6], [4.2, 6]]), open([[2.1, 6], [2.1, 0]])] },
  U: { w: 4, s: [open([[0, 6], [0, 2], ...arc(2, 2, 2, 2, 180, 360), [4, 6]])] },
  V: { w: 4.4, s: [open([[0, 6], [2.2, 0], [4.4, 6]])] },
  W: { w: 5.6, s: [open([[0, 6], [1.3, 0], [2.8, 4.4], [4.3, 0], [5.6, 6]])] },
  X: { w: 4.2, s: [open([[0, 6], [4.2, 0]]), open([[4.2, 6], [0, 0]])] },
  Y: { w: 4.4, s: [open([[0, 6], [2.2, 3]]), open([[4.4, 6], [2.2, 3], [2.2, 0]])] },
  Z: { w: 4, s: [open([[0, 6], [4, 6], [0, 0], [4, 0]])] },
  0: { w: 3.8, s: [loop(arc(1.9, 3, 1.9, 3, 90, 450))] },
  1: { w: 2, s: [open([[0.3, 4.6], [2, 6], [2, 0]])] },
  2: { w: 3.9, s: [open([...arc(1.95, 4.15, 1.85, 1.85, 160, -30), [0, 0], [3.9, 0]])] },
  3: { w: 3.85, s: [open([...arc(1.9, 4.55, 1.75, 1.45, 155, -90), ...arc(1.9, 1.6, 1.95, 1.6, 90, -155)])] },
  4: { w: 4.2, s: [open([[3.2, 0], [3.2, 6], [0, 1.8], [4.2, 1.8]])] },
  5: { w: 3.9, s: [open([[3.7, 6], [0.5, 6], ...arc(1.95, 1.95, 1.95, 1.95, 125, -160)])] },
  6: { w: 3.95, s: [open([...arc(2.1, 3, 1.95, 3, 70, 180), ...arc(2, 1.95, 1.95, 1.95, 180, 540)])] },
  7: { w: 3.9, s: [open([[0, 6], [3.9, 6], [1.3, 0]])] },
  8: { w: 3.9, s: [loop(arc(1.95, 4.55, 1.6, 1.45, -90, 270)), loop(arc(1.95, 1.55, 1.95, 1.55, 90, 450))] },
  9: { w: 3.9, s: [open([...arc(1.95, 4.05, 1.95, 1.95, 0, 360), ...arc(1.85, 3, 2.05, 3, 0, -100)])] },
  e: { w: 3.6, s: [open([[0.05, 1.9], [3.6, 1.9], ...arc(1.8, 1.9, 1.8, 1.9, 0, 315).slice(1)])] },
  r: { w: 3, s: [open([[0, 0], [0, 3.8]]), open(arc(1.9, 1.9, 1.9, 1.9, 180, 55))] },
  n: { w: 3.5, s: [open([[0, 0], [0, 3.8]]), open([...arc(1.75, 2, 1.75, 1.8, 180, 0), [3.5, 0]])] },
  ' ': { w: 1.3, s: [] },
  '-': { w: 2.6, s: [open([[0, 2.8], [2.6, 2.8]])] },
  '.': { w: 0.64, s: [dot(0.32, 0.36)] },
  '!': { w: 0.64, s: [open([[0.32, 6], [0.32, 1.9]]), dot(0.32, 0.36)] },
  '?': { w: 3.6, s: [open([...arc(1.8, 4.3, 1.8, 1.7, 160, -60), [1.8, 1.9]]), dot(1.8, 0.36)] },
  "'": { w: 0.45, s: [open([[0.35, 6], [0.15, 4.6]])] },
  '+': { w: 3.4, s: [open([[0, 3], [3.4, 3]]), open([[1.7, 1.3], [1.7, 4.7]])] },
}

/** Marks over (or under, or through) a capital, drawn about its middle `c`; `w` the capital's width (a
 *  narrow I gets narrower marks, so they stay inside the space between letters), `base` the capital. */
const MARKS = {
  acute: c => [open([[c - 0.4, 6.75], [c + 0.55, 7.75]])],
  grave: c => [open([[c - 0.55, 7.75], [c + 0.4, 6.75]])],
  circ: (c, w) => {
    const k = w < 1 ? 0.55 : 1
    return [open([[c - k, 6.75], [c, 7.7], [c + k, 6.75]])]
  },
  tilde: c => [open([[c - 1.1, 6.85], [c - 0.55, 7.45], [c, 7.1], [c + 0.55, 6.8], [c + 1.1, 7.4]])],
  dots: (c, w) => {
    const k = w < 1 ? 0.5 : 0.8
    return [dot(c - k, 7.2, 0.24), dot(c + k, 7.2, 0.24)]
  },
  cedilla: c => [open([[c, 0], [c, -0.55], [c + 0.55, -0.75], [c + 0.4, -1.35], [c - 0.4, -1.45]])],
  // Polish: the ogonek hangs from A's right foot (from E's bottom bar, near its end), bulges left and
  // ends in a tail to the right
  ogonek: (c, w, base) => {
    const x = base === 'A' ? w : w - 0.6
    return [open([[x, 0], ...arc(x + 0.55, -0.55, 0.85, 0.85, 165, 275)])]
  },
  // Ł: a slash rising through the stem, a little above the middle
  stroke: () => [open([[-0.75, 2.45], [1.25, 3.85]])],
  // Ż: one dot over the middle
  dot: c => [dot(c, 7.25, 0.3)],
}
const ACCENTED = {
  Á: ['A', 'acute'], À: ['A', 'grave'], Â: ['A', 'circ'], Ã: ['A', 'tilde'], Ä: ['A', 'dots'],
  É: ['E', 'acute'], È: ['E', 'grave'], Ê: ['E', 'circ'], Ë: ['E', 'dots'],
  Í: ['I', 'acute'], Ì: ['I', 'grave'], Î: ['I', 'circ'], Ï: ['I', 'dots'],
  Ó: ['O', 'acute'], Ò: ['O', 'grave'], Ô: ['O', 'circ'], Õ: ['O', 'tilde'], Ö: ['O', 'dots'],
  Ú: ['U', 'acute'], Ù: ['U', 'grave'], Û: ['U', 'circ'], Ü: ['U', 'dots'],
  Ç: ['C', 'cedilla'], Ñ: ['N', 'tilde'],
  // Polish (Ó above)
  Ą: ['A', 'ogonek'], Ę: ['E', 'ogonek'], Ł: ['L', 'stroke'], Ż: ['Z', 'dot'],
  Ć: ['C', 'acute'], Ń: ['N', 'acute'], Ś: ['S', 'acute'], Ź: ['Z', 'acute'],
}

/** Every glyph: { w (width in units), s: [{ pts, closed }] }. */
export const GLYPHS = { ...BASE }
for (const [ch, [base, mark]] of Object.entries(ACCENTED)) {
  const g = BASE[base]
  GLYPHS[ch] = { w: g.w, s: [...g.s, ...MARKS[mark](g.w / 2, g.w, base)] }
}

/** The space between letters, in units. */
export const SPACING = 1.5
/** How many characters a name may have on the wall. */
export const NAME_MAX = 12

/** A name as the wall can write it: capitals, letters with no glyph turned into their plain letter,
 *  anything else dropped, spaces squeezed, at most NAME_MAX characters. German ß becomes SS (the
 *  upper case does that), and so does the capital ẞ. */
export function sanitizeName(text, max = NAME_MAX) {
  let out = ''
  for (const ch of String(text ?? '').toLocaleUpperCase('pt-PT').replace(/ẞ/g, 'SS')) {
    if (GLYPHS[ch] && ch !== 'e' && ch !== 'r' && ch !== 'n') out += ch
    else {
      const plain = ch.normalize('NFD').replace(/[̀-ͯ]/g, '')
      if (plain.length === 1 && GLYPHS[plain] && /[A-Z]/.test(plain)) out += plain
    }
  }
  return out.replace(/\s+/g, ' ').replace(/^ /, '').slice(0, max)
}

/** Lays out a text: every glyph's strokes moved into place. Returns { glyphs: [{ ch, x, w, strokes }],
 *  width, top, bottom } in units (capitals 6 tall; marks reach about 7.8, the cedilla and the ogonek
 *  about -1.5). */
export function layoutText(text) {
  const glyphs = []
  let x = 0
  let top = 6
  let bottom = 0
  for (const ch of String(text)) {
    const g = GLYPHS[ch]
    if (!g) continue
    const strokes = g.s.map(st => ({ closed: st.closed, pts: st.pts.map(([px, py]) => [px + x, py]) }))
    for (const st of strokes) {
      for (const [, py] of st.pts) {
        top = Math.max(top, py)
        bottom = Math.min(bottom, py)
      }
    }
    glyphs.push({ ch, x, w: g.w, strokes })
    x += g.w + SPACING
  }
  return { glyphs, width: Math.max(0, x - SPACING), top, bottom }
}

/** The length of tube a text takes, in units (for the sign-maker's numbers). */
export function tubeLength(text) {
  let len = 0
  for (const g of layoutText(text).glyphs) {
    for (const st of g.strokes) {
      const p = st.pts
      for (let i = 1; i < p.length; i++) len += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])
      if (st.closed && p.length > 2) len += Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1])
    }
  }
  return len
}
