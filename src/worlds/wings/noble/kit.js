// Pieces the neon sign workshop shares: small maths, canvas textures, screens in the atrium's look (dark
// navy faces, glowing edges in the exhibit's colour, gold once discovered), words at the reader's depth,
// and the exhibits' rules (use, discover, tell). Discoveries are kept under the gas whose hall the
// visitor came from ("Ne:signs:bench"), so the passport counts them for that gas.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { markFound, countFound, isFound } from '../../../engine/progress.js'

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const damp = (from, to, rate, dt) => to + (from - to) * Math.exp(-rate * dt)
/** A colour pushed above 1 (glows stay bright under tone mapping and feed the bloom). */
export const hdr = (c, k = 1) => new THREE.Color(c).multiplyScalar(k)

/** A seeded random generator (mulberry32). */
export function random(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A canvas texture, draw(ctx2d, w, h); redraw(fn) draws it again. */
export function canvasTex(w, h, draw, { srgb = true, repeat = false, mipmaps = true } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  draw?.(g, w, h)
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.generateMipmaps = mipmaps
  if (!mipmaps) t.minFilter = THREE.LinearFilter
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.userData.redraw = fn => {
    fn(g, w, h)
    t.needsUpdate = true
  }
  return t
}

/** The page's fonts, ready for drawing on canvases (a canvas draws in a fallback font otherwise). */
export async function fontsReady() {
  if (typeof document === 'undefined' || !document.fonts?.load) return
  const wait = Promise.all(['700 40px Outfit', '500 40px Outfit', '700 40px Nunito'].map(f => document.fonts.load(f)))
  await Promise.race([wait, new Promise(r => setTimeout(r, 1500))]).catch(() => {})
}

// ---- words ----

/** Text at the reader's depth from { kid, sci } (or a plain string). */
export const at = (entry, level) => (entry == null ? '' : typeof entry === 'string' ? entry : (level === 'scientist' ? entry.sci : null) ?? entry.kid ?? entry.sci)
/** "{gas} glows" with { gas: 'neon' }: the placeholders filled. */
export const fill = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
/** A number written the language's way (a comma in Portuguese). */
export const num = (v, digits, lang) => {
  // rounded half up (0.1785 is stored as 0.17849999... and toFixed alone would give 0.178)
  const f = 10 ** digits
  const s = (Math.round(v * f + 1e-7) / f).toFixed(digits)
  return lang === 'pt-pt' ? s.replace('.', ',') : s
}

// ---- materials ----

export const glowMat = (color, k = 1.4, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: k, roughness: 0.4, ...extra })

// ---- screens ----

const NAVY = new THREE.Color('#0d1233')
const GOLD = new THREE.Color('#ffd166')

/** A screen in the atrium's look: a dark navy face in a glowing frame (faces +z, centred), a title and
 *  a line or two; `content` holds anything else. set({ title, line }) changes the words; setRead(true)
 *  turns the frame gold (discovered). */
export function screen({ width = 2, height = 0.9, color = '#ff8a5c', title = '', line = '', titleSize = 0.13, lineSize = 0.075, depth = 0.07, glow = 1 } = {}) {
  const group = new THREE.Group()
  const base = new THREE.Color(color)
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1 * glow, roughness: 0.4, metalness: 0.2 })
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.08, height + 0.08, depth * 0.7, 3, 0.035), edgeMat)
  const face = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, 3, 0.03),
    new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.35, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.65 * glow }),
  )
  face.position.z = depth * 0.25
  group.add(edge, face)
  const z = depth * 0.75 + 0.004
  // a long title is made smaller rather than wrapped (Outfit bold runs about 0.56 of its size a letter)
  const fit = (text, size) => Math.min(size, (width - 0.24) / Math.max(1, String(text).length * 0.56))
  const t = makeText(title, { size: fit(title, titleSize), color: hdr(color, 1.05), maxWidth: width - 0.2, anchorY: 'top' })
  t.position.set(0, height / 2 - 0.07, z)
  const l = makeText(line, { font: 'body', size: lineSize, color: '#d2dbff', maxWidth: width - 0.22, anchorY: 'top', lineHeight: 1.2 })
  l.position.set(0, height / 2 - 0.1 - titleSize * 1.15, z)
  const content = new THREE.Group()
  content.position.z = z
  group.add(t, l, content)
  const sync = (text, value) => {
    if (value == null || text.text === value) return
    text.text = value
    text.sync()
  }
  return {
    group,
    content,
    width,
    height,
    front: z,
    texts: { title: t, line: l },
    set({ title: tt, line: ll } = {}) {
      if (tt != null) t.fontSize = fit(tt, titleSize)
      sync(t, tt)
      sync(l, ll)
    },
    setRead(read) {
      edgeMat.color.copy(read ? GOLD : base)
      edgeMat.emissive.copy(read ? GOLD : base)
    },
  }
}

/** A screen raised on a slim post and tilted back toward the reader; `group` is the whole stand. */
export function standingScreen(opts, { top = 1.45, tilt = 0.25, mat } = {}) {
  const s = screen(opts)
  const group = new THREE.Group()
  const legH = top - (s.height / 2) * Math.cos(tilt)
  const leg = new THREE.Mesh(new RoundedBoxGeometry(0.12, legH, 0.1, 2, 0.03), mat)
  leg.position.set(0, legH / 2, -0.1)
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.05, 24), mat)
  foot.position.set(0, 0.025, -0.1)
  s.group.position.set(0, top, 0)
  s.group.rotation.x = -tilt
  group.add(leg, foot, s.group)
  return { ...s, panel: s.group, group }
}

// ---- exhibits: use, discover, tell ----

/** The rules every exhibit follows. Using one does its action (act returns false while it is busy, a
 *  string for the Atomling to say, or nothing). The first use counts a discovery (`<prefix>:<find>`)
 *  and opens the exhibit's panel after `panelDelay` seconds, so the action is seen first; so does the
 *  first use after the level changed. Later uses let the Atomling say its line instead. */
export function exhibitSet(ctx, { prefix, color, who, busy, later }) {
  const keys = []
  const list = []
  const shown = {}
  const marks = {}
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  const refreshPrompt = it => {
    if (ctx.engine?.player?.near === it) ctx.store.set({ prompt: { id: it.id, label: it.label, verb: it.verb } })
  }
  const say = (text, c = color) => {
    if (text) ctx.store.set({ speech: { text, who, color: c } })
  }
  /** Count a find by hand (an exhibit whose doing ends later): returns whether it was new, and opens
   *  `panel` after `delay` seconds the first time. */
  function discover(find, panel, delay = 0) {
    const key = `${prefix}:${find}`
    const first = markFound(key)
    if (first) for (const s of marks[key] ?? []) s.setRead(true)
    report()
    if (first && panel) later(delay, () => ctx.showPanel(panel))
    return first
  }
  function add({ id, find = id, x, z, radius = 1.6, label, verb, act, panel, screens = [], panelDelay = 0, sayColor = null, manual = false }) {
    const key = `${prefix}:${find}`
    if (!keys.includes(key)) keys.push(key)
    for (const s of screens) {
      ;(marks[key] ??= []).push(s)
      s.setRead(isFound(key))
    }
    if (manual) {
      // its action does everything itself (and calls discover when the find is made)
      const it = {
        id,
        x,
        z,
        radius,
        get label() {
          return typeof label === 'function' ? label() : label
        },
        get verb() {
          return typeof verb === 'function' ? verb() : verb
        },
        onUse: () => act(),
      }
      list.push(it)
      return it
    }
    const it = {
      id,
      x,
      z,
      radius,
      get label() {
        return typeof label === 'function' ? label() : label
      },
      get verb() {
        return typeof verb === 'function' ? verb() : verb
      },
      onUse() {
        const level = ctx.level()
        const result = act ? act() : null
        if (result === false) {
          say(busy?.(level))
          return
        }
        const first = markFound(key)
        if (first) for (const s of marks[key] ?? []) s.setRead(true)
        const line = typeof result === 'string' ? result : null
        if (!act || first || shown[id] !== level) {
          shown[id] = level
          const open = () => {
            if (!ctx.engine.world?.interactables?.includes(it)) return
            // walked away while the action played: the next use opens it instead
            if (panelDelay > 0 && ctx.engine.player?.near !== it) {
              shown[id] = null
              return
            }
            ctx.showPanel(panel)
          }
          if (line) say(line, sayColor?.() ?? color)
          if (panelDelay > 0) later(panelDelay, open)
          else open()
        } else say(line, sayColor?.() ?? color)
        report()
        refreshPrompt(it)
      },
    }
    list.push(it)
    return it
  }
  let lastVerb = null
  let lastLabel = null
  let lastNear = null
  /** Every frame: keeps the prompt right when an exhibit's state changes by itself. */
  const sync = () => {
    const near = ctx.engine?.player?.near
    if (!near || !list.includes(near)) {
      lastNear = null
      return
    }
    const v = near.verb
    const l = near.label
    if (near !== lastNear) {
      lastNear = near
      lastVerb = v
      lastLabel = l
      return
    }
    if (v !== lastVerb || l !== lastLabel) {
      lastVerb = v
      lastLabel = l
      refreshPrompt(near)
    }
  }
  return { add, list, keys, report, refreshPrompt, sync, say, discover }
}

/** Calls fn(level) whenever the reader switches between Explorer and Scientist. Returns the unsubscribe. */
export function onLevel(store, fn) {
  let last = store.get().level
  return store.subscribe(s => {
    if (s.level !== last) {
      last = s.level
      fn(last)
    }
  })
}
