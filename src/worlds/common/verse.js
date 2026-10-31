// A Bible passage written into a world (src/content/scripture/, docs/knowledge/scripture.md): its words in
// warm light, a poem line by line, the reference and the translation under them, on a standing stone, a
// wall plaque, a wall or in a sky. It follows the level while it stands (Explorer quotes an easy
// translation, Scientist a closer one); a new language builds the world again, and the words with it.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../engine/text.js'
import { verseOf, versePanel, readVerb, chapterOf, chapterPanel } from '../../content/scripture/index.js'
import { chapterState } from '../../content/scripture/chapter.js'

/** The passage `id` as a block of text `width` metres wide, its top at the group's origin, facing +z; a
 *  longer translation is made smaller to stay within `maxHeight` (metres), and with `middle` the block
 *  is centred in that height. Returns { group, open(), hits(raycaster), interactable(spot, focus),
 *  dispose }. */
export function verseText(ctx, id, {
  width = 5, size = 0.24, maxHeight = Infinity, color = '#ffe2a6', citeColor = '#ffc96b', align = 'center',
  lineHeight = 1.3, middle = false, opacity = 1,
} = {}) {
  const group = new THREE.Group()
  const block = new THREE.Group() // scaled to fit
  group.add(block)
  const lang = ctx.lang()
  const anchorX = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center'
  const body = makeText('', { font: 'medium', size, color, maxWidth: width, anchorX, anchorY: 'top', align, lineHeight, opacity })
  const cite = makeText('', { font: 'display', size: size * 0.72, color: citeColor, anchorX, anchorY: 'top', opacity })
  block.add(body, cite)
  // the reference sits under however many lines the words take, and the whole is kept within maxHeight
  body.addEventListener('synccomplete', () => {
    const b = body.textRenderInfo?.blockBounds
    if (!b) return
    cite.position.y = b[1] - size * 0.55
    const tall = -b[1] + size * 1.3
    const k = tall > maxHeight ? maxHeight / tall : 1
    block.scale.setScalar(k)
    block.position.y = middle ? -(maxHeight - tall * k) / 2 : 0
  })
  let level = null
  const write = l => {
    if (l === level) return
    level = l
    const v = verseOf(id, lang, l)
    if (!v) return
    body.text = v.text
    cite.text = v.label
    body.sync()
    cite.sync()
  }
  write(ctx.level())
  const off = ctx.store.subscribe(s => write(s.level))
  // the passage's panel, and from it the whole chapter (fetched when asked: chapter.js); each is written
  // again when the level changes, so the chapter follows the translation the level quotes
  const passage = l => versePanel(id, lang, l, { onChapter: () => ctx.showPanel(chapter) })
  const chapter = l => {
    const c = chapterOf(id, lang, l)
    const state = chapterState(c, () => {
      if (ctx.store.get().panel?.make === chapter) ctx.showPanel(chapter)
    })
    return chapterPanel(c, lang, state, { onBack: () => ctx.showPanel(passage) })
  }
  const open = () => ctx.showPanel(passage)
  return {
    group,
    open,
    /** Whether a ray (a THREE.Raycaster) meets the words: an orbiting world's tap on its sky. */
    hits: caster => caster.intersectObject(block, true).length > 0,
    /** What the world lists among its interactables to read it in a panel: standing at `spot`
     *  ({ x, z, radius }), the prompt says "Read: Psalm 19:1"; `focus` frames the words. */
    interactable(spot, focus) {
      return {
        id: `verse-${id}`,
        x: spot.x,
        z: spot.z,
        radius: spot.radius ?? 1.4,
        get label() { return verseOf(id, lang, ctx.level())?.cite ?? '' },
        verb: readVerb(lang),
        focus,
        onUse: open,
      }
    },
    dispose() {
      off()
      body.dispose()
      cite.dispose()
    },
  }
}

const STONES = {
  // a dark tablet framed in gold (the halls, the night worlds)
  night: { face: '#16163a', glow: '#141238', frame: '#ffd166', base: '#1b2250', ink: '#ffe2a6', cite: '#ffc96b', shine: 0.55 },
  // slate in daylight (the garden, the sky deck)
  day: { face: '#2f3640', glow: '#000000', frame: '#c9b48a', base: '#8c8478', ink: '#fff3d6', cite: '#ffd98a', shine: 0.15 },
}

/** The framed tablet with the passage on its face, its bottom edge at the group's origin, facing +z
 *  (`frame` a colour of the world's own, the fire chamber's embers). */
function tablet(ctx, id, { width, height, look, size, frame: frameColor }) {
  const c = STONES[look] ?? STONES.night
  const group = new THREE.Group()
  const fc = frameColor ?? c.frame
  const frame = new THREE.Mesh(
    new RoundedBoxGeometry(width + 0.1, height + 0.1, 0.12, 3, 0.04),
    new THREE.MeshStandardMaterial({ color: fc, emissive: fc, emissiveIntensity: c.shine, roughness: 0.4, metalness: 0.5 }),
  )
  frame.position.y = height / 2 + 0.05
  const face = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.16, 3, 0.04),
    new THREE.MeshStandardMaterial({ color: c.face, roughness: 0.55, metalness: 0.15, emissive: c.glow, emissiveIntensity: 0.6 }),
  )
  face.position.set(0, height / 2 + 0.05, 0.02)
  group.add(frame, face)
  const pad = 0.14
  const words = verseText(ctx, id, { width: width - pad * 2, size, maxHeight: height - pad * 2, middle: true, color: c.ink, citeColor: c.cite, lineHeight: 1.28 })
  words.group.position.set(0, height + 0.05 - pad, 0.105)
  group.add(words.group)
  return { group, words, base: c.base }
}

/** What both kinds give the world: where to stand, and the reading spot with the view framing the words
 *  (`mid` the tablet's middle in the piece's own frame). */
function reader(group, words, mid, size) {
  return {
    group,
    /** A point `d` metres in front of the piece, in the world (once the group is placed). */
    front(d) {
      group.updateMatrixWorld()
      return new THREE.Vector3(0, 0, d).applyMatrix4(group.matrixWorld)
    },
    /** The reading spot `d` metres in front, with the view framing the tablet. */
    interactable(d = 1.7, radius = 1.4) {
      const at = this.front(d)
      const m = mid.clone().applyMatrix4(group.matrixWorld)
      return words.interactable({ x: at.x, z: at.z, radius }, { x: m.x, y: m.y, z: m.z, size })
    },
    open: words.open,
    dispose: words.dispose,
  }
}

/** The passage on a standing stone at reading height: a low plinth, a tablet leaning back a little, the
 *  words on its face (made smaller when a translation is long). Its front faces +z; stand at
 *  front(1.7) to read it. Returns { group, front(d), interactable(d, radius), open, dispose }. */
export function verseStone(ctx, id, { width = 2.0, height = 1.45, look = 'night', size = 0.085, frame } = {}) {
  const group = new THREE.Group()
  const t = tablet(ctx, id, { width, height, look, size, frame })
  const base = new THREE.Mesh(new RoundedBoxGeometry(width * 0.92, 0.26, 0.62, 2, 0.05), new THREE.MeshStandardMaterial({ color: t.base, roughness: 0.6, metalness: 0.3 }))
  base.position.y = 0.13
  t.group.position.y = 0.26
  t.group.rotation.x = -0.2 // leaning back, toward the reader's eyes
  group.add(base, t.group)
  return reader(group, t.words, new THREE.Vector3(0, 0.26 + height / 2, 0), height + 0.6)
}

/** The passage on a plaque hung on a wall, its middle `y` metres up; the group stands at the wall's face
 *  and faces into the room (+z). Returns what verseStone does. */
export function versePlaque(ctx, id, { width = 2.2, height = 1.5, y = 2.1, look = 'night', size = 0.09, frame } = {}) {
  const group = new THREE.Group()
  const t = tablet(ctx, id, { width, height, look, size, frame })
  t.group.position.set(0, y - height / 2 - 0.05, 0.07)
  group.add(t.group)
  return reader(group, t.words, new THREE.Vector3(0, y, 0), height + 0.6)
}

/** The passage written in an orbiting world's sky (the lab, the forges): faint words at `at` ([x, y, z],
 *  the top of the block), turned to the camera by face() each frame so they read from wherever the view
 *  has been turned. They show only where the screen leaves room (`fits()`; by default not on a phone held
 *  sideways, where they would be tiny and behind the panels); the world's tap asks hits(ray) and calls
 *  open(). Returns what verseText does, and face. */
export function skyVerse(ctx, id, { at, fits = () => ctx.canvas.clientHeight >= 500, ...opts }) {
  const v = verseText(ctx, id, { color: '#dfe6ff', citeColor: '#ffd98a', opacity: 0.85, ...opts })
  v.group.position.set(...at)
  const hits = v.hits
  v.hits = caster => v.group.visible && hits(caster)
  v.face = () => {
    v.group.visible = fits()
    v.group.quaternion.copy(ctx.camera.quaternion)
  }
  return v
}
