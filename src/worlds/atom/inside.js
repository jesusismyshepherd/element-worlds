// Inside the atom (/e/<Symbol>/atom): the room behind every hall's big atom, for all 118 elements
// (docs/knowledge/inside-the-atom.md). The atom is blown up until its electron cloud is a room you walk
// through: a glass floor through the nucleus, the clouds all round and under it, drawn from quantum
// mechanics (src/chem/orbitals.js, cloud.js). Three things to do: the electron map (choose the whole atom,
// a subshell or one orbital; slide to shrink towards the nucleus), the electron camera (each photo finds
// the electron somewhere new; many photos draw the cloud), and the nucleus, drawn to scale. The arch
// behind you goes back to the hall, in front of its atom. Contract: docs/knowledge/adding-a-wing.md.
import * as THREE from 'three'
import { element, nameOf, FAMILY } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { nucleus as nucleusOf } from '../../chem/atom.js'
import { electronsOf, nucleusFm, A0_PM, MADELUNG, nodesOf } from '../../chem/orbitals.js'
import { markFound, countFound, isFound } from '../../engine/progress.js'
import { circle } from '../../engine/collide.js'
import { play } from '../../audio/sound.js'
import { atriumPath } from '../registry.js'
import { arch } from '../common/props.js'
import { tapTargets } from '../common/taps.js'
import { verseStone } from '../common/verse.js'
import { packBall } from '../common/pack.js'
import { ringWall } from '../pictures/kit.js'
import { fontsReady } from '../wings/noble/kit.js'
import { electronCloud } from './cloud.js'
import { electronBoard } from './board.js'
import { electronCamera } from './camera.js'
import { atomView, orbitalView, photoOf, maxZoomOf, BLOCK, YAW } from './views.js'
import { wordsFor, say as pickSay, num, sci10, length, sizeWords, configText, shortConfig } from './words.js'

export const ROOM_ID = 'atom'
const CENTER = new THREE.Vector3(0, 1.75, 0)
const FLOOR_R = 13.5
const A0_M = A0_PM * 1e-12

const FLOOR_VERT = /* glsl */ `
varying vec2 vXZ;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vXZ = w.xz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`
// the glass floor: faint rings every metre and a half and spokes, a bright rim, the cloud seen through it
const FLOOR_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uR;
varying vec2 vXZ;
void main() {
  float r = length(vXZ);
  if (r > uR) discard;
  float ring = abs(fract(r / 1.5 + 0.5) - 0.5) * 1.5;
  float line = 1.0 - smoothstep(0.0, fwidth(r) * 1.5 + 0.012, ring);
  float a = atan(vXZ.y, vXZ.x);
  float seg = 3.14159265 / 6.0;
  float sp = abs(fract(a / seg + 0.5) - 0.5) * seg * r;
  float spoke = (1.0 - smoothstep(0.0, fwidth(sp) * 1.5 + 0.01, sp)) * smoothstep(1.2, 3.0, r);
  float rim = smoothstep(uR - 0.3, uR - 0.03, r);
  float fade = 1.0 - smoothstep(uR * 0.5, uR, r) * 0.45;
  vec3 col = uColor * (line * 0.32 + spoke * 0.14) * fade + uColor * rim * 1.3 + vec3(0.012, 0.018, 0.045);
  gl_FragColor = vec4(col, 0.16 + line * 0.2 + rim * 0.55);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

const glowTexture = (() => {
  let tex = null
  return () => {
    if (tex) return tex
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.18, 'rgba(255,220,210,0.85)')
    grad.addColorStop(0.45, 'rgba(255,140,120,0.25)')
    grad.addColorStop(1, 'rgba(255,120,100,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
    tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }
})()

export async function build(ctx, target) {
  const el = element(target.symbol)
  const sym = el.symbol
  const lang = ctx.lang()
  const W = wordsFor(lang)
  const color = FAMILY[el.family].color
  const name = nameOf(el, lang)
  const inText = lang === 'de' ? name : name.toLowerCase()
  const info = electronsOf(el)
  const subById = id => info.subs.find(s => s.id === id)
  const root = new THREE.Group()
  root.name = `atom-${sym}`
  const updates = []
  const here = () => ctx.engine.world?.root === root
  const level = () => ctx.level()
  await fontsReady()

  // ---- what this visitor has found here ----
  const prefix = `${sym}:${ROOM_ID}`
  const blocks = ['s', 'p', 'd', 'f'].filter(l => info.subs.some(s => s.l === l))
  const maxZoom = maxZoomOf(info)
  const finds = [...blocks, 'photo', 'nucleus', ...(maxZoom > 1.5 ? ['core'] : [])]
  const keys = finds.map(f => `${prefix}:${f}`)
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  const discover = f => {
    const first = markFound(`${prefix}:${f}`)
    if (first) {
      play('discover')
      report()
    }
    return first
  }
  const speak = text => here() && text && ctx.store.set({ speech: { text, who: name, color } })

  // ---- the glass floor through the nucleus, its rim and rail ----
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(FLOOR_R, 96),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uR: { value: FLOOR_R } },
      vertexShader: FLOOR_VERT,
      fragmentShader: FLOOR_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.renderOrder = 2
  root.add(floor)
  const railMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3, roughness: 0.4 })
  const rail = new THREE.Mesh(new THREE.TorusGeometry(FLOOR_R + 0.05, 0.035, 8, 160), railMat)
  rail.rotation.x = Math.PI / 2
  rail.position.y = 0.95
  root.add(rail)
  const postGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.95, 6)
  const postMat = new THREE.MeshStandardMaterial({ color: '#8d9bd6', roughness: 0.3, metalness: 0.8 })
  const posts = new THREE.InstancedMesh(postGeo, postMat, 36)
  const m4 = new THREE.Matrix4()
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2
    posts.setMatrixAt(i, m4.makeTranslation(Math.cos(a) * (FLOOR_R + 0.05), 0.475, Math.sin(a) * (FLOOR_R + 0.05)))
  }
  root.add(posts)

  // ---- the cloud ----
  const cloud = electronCloud({ renderer: ctx.renderer, camera: ctx.camera, light: ctx.light, center: CENTER, yaw: YAW })
  root.add(cloud.group)

  // ---- the nucleus: a spark you can find, and the real thing to scale ----
  const { protons, neutrons } = nucleusOf(el)
  const A = protons + neutrons
  const rNucleusA0 = nucleusFm(A) * 1e-15 / A0_M
  const nucGroup = new THREE.Group()
  nucGroup.position.copy(CENTER)
  root.add(nucGroup)
  const ball = new THREE.Group()
  nucGroup.add(ball)
  {
    const pts = packBall(A, 1)
    const nucleonR = 1 / Math.cbrt(A) * 0.98
    const geo = new THREE.SphereGeometry(nucleonR, ctx.light ? 8 : 14, ctx.light ? 6 : 10)
    const share = protons / A
    for (const [want, col] of [[true, '#ff5a55'], [false, '#b9c6dc']]) {
      const mine = pts.filter((_, i) => Math.floor((i + 1) * share) > Math.floor(i * share) === want)
      if (!mine.length) continue
      const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.45, roughness: 0.35 }), mine.length)
      mine.forEach((p, i) => im.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)))
      ball.add(im)
    }
  }
  const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffffff', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  spark.renderOrder = 7
  nucGroup.add(spark)
  // a thread of light from the floor to the nucleus, so it can be found from anywhere
  const thread = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, CENTER.y, 6, 1, true),
    new THREE.MeshBasicMaterial({ color: '#ffb0a0', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  thread.position.set(0, CENTER.y / 2, 0)
  root.add(thread)
  const footRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 6, 48), new THREE.MeshBasicMaterial({ color: '#ffb0a0', transparent: true, opacity: 0.6 }))
  footRing.rotation.x = -Math.PI / 2
  footRing.position.y = 0.02
  root.add(footRing)
  let nucScale = 0.001
  let nucTarget = 0.001

  // ---- light: the clouds' own colour from the middle, a faint sky ----
  root.add(new THREE.HemisphereLight('#aab8ff', '#0b0f24', 0.55))
  const glow = new THREE.PointLight(color, 9, 30, 1.4)
  glow.position.copy(CENTER)
  root.add(glow)
  const glowTo = new THREE.Color(color)

  // ---- the electron map ----
  const board = electronBoard({ info, color, words: { title: W.board.title, all: W.board.all(el.z), hint: W.board.hint, config: W.board.config } })
  const boardSpot = { x: -3.9, z: 8.5 }
  const boardFaces = new THREE.Vector2(1.2, 12.4) // the board turns to face this point on the floor
  const boardRot = Math.atan2(boardFaces.x - boardSpot.x, boardFaces.y - boardSpot.z)
  board.group.position.set(boardSpot.x, 0.62 + board.height / 2, boardSpot.z)
  board.group.rotation.y = boardRot
  board.group.rotation.x = -0.08
  root.add(board.group)
  // its two legs
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.62 + board.height * 0.5, 8), postMat)
    leg.position.set(s * (board.width / 2 - 0.12), (0.62 + board.height * 0.5) / 2, 0)
    leg.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), boardRot)
    leg.position.x += boardSpot.x
    leg.position.z += boardSpot.z
    root.add(leg)
  }
  const boardFront = new THREE.Vector3(Math.sin(boardRot), 0, Math.cos(boardRot))

  // ---- the electron camera ----
  const camera = electronCamera({ color, light: ctx.light })
  const cameraSpot = { x: 3.7, z: 8.6 }
  camera.group.position.set(cameraSpot.x, 0, cameraSpot.z)
  root.add(camera.group)
  camera.group.updateMatrixWorld(true)
  camera.aim(CENTER)

  // ---- the way back: an arch behind the spawn ----
  const back = arch({ color, label: W.back, portal: 'stars', width: 3.2, height: 4.0 })
  back.group.position.set(0, 0, 13.25)
  back.group.rotation.y = Math.PI
  root.add(back.group)
  updates.push(t => back.update(t))
  const doors = [{ x: 0, z: 13.1, radius: 0.9, to: atriumPath(sym) }]

  // ---- the Bible passage ----
  const verse = verseStone(ctx, 'atom')
  verse.group.position.set(7.4, 0, 9.9)
  verse.group.rotation.y = -0.85
  root.add(verse.group)

  // ---- the element's Atomling ----
  const avatar = createAtomling(el, { light: ctx.light })
  root.add(avatar.root)

  // ---- what is shown: kept and shared in a room (sel, zoom, the photos' series and count, cloud hidden) ----
  const state = { sel: 'all', zoom: 1, seed: 1, shots: 0, hide: false }
  const parse = s => {
    if (s === 'all') return { sub: 'all', m: null }
    const [id, m] = String(s).split(':')
    const sub = subById(id)
    if (!sub) return null
    const mi = m == null ? null : Number(m)
    return { sub: id, m: mi != null && Number.isInteger(mi) && mi >= 0 && mi < sub.orbitals.length ? mi : null }
  }
  const selKey = s => (s.sub === 'all' ? 'all' : s.m == null ? s.sub : `${s.sub}:${s.m}`)
  let sel = { sub: 'all', m: null }
  const views = new Map()
  let atomShown = atomView(info, 1)
  const viewFor = s => {
    if (s.sub === 'all') return atomShown
    const k = selKey(s)
    if (!views.has(k)) views.set(k, orbitalView(subById(s.sub), s.m))
    return views.get(k)
  }
  let shown = 0 // photos drawn for this series
  let shownSeries = null
  const lastSaid = { photos: 0 }

  // the words about what is shown, at a depth
  const varsOf = s => {
    if (s.sub === 'all') return { z: el.z, name: inText }
    const sub = subById(s.sub)
    const nd = nodesOf(sub.n, sub.lq)
    const label = s.m == null ? sub.id : `${sub.id}${sub.orbitals[s.m].sub}`
    return { id: sub.id, n: sub.n, count: sub.count, zeff: num(sub.zeff, 2, lang), rn: nd.radial, an: nd.angular, e: s.m == null ? 0 : sub.boxes[s.m], label }
  }
  const aboutSel = (s, lv) => {
    if (s.sub === 'all') return pickSay(W.all, lv, varsOf(s))
    const sub = subById(s.sub)
    const v = varsOf(s)
    if (s.m != null) return pickSay(W.one, lv, v)
    const extra = sub.boxes.some(b => b === 0) ? ` ${pickSay(W.empty, lv)}` : ''
    return pickSay(W.sub[sub.l], lv, v) + extra
  }

  const tintOfSel = s => (s.sub === 'all' ? new THREE.Color(color) : new THREE.Color(BLOCK[subById(s.sub).l]))

  // the photos: the series drawn so far, more as the count goes up (a burst comes in over a second or two)
  const resetPhotos = () => {
    cloud.clearPhotos()
    shown = 0
    shownSeries = `${state.sel}|${state.seed}`
  }
  const drawPhotos = (upTo, flash) => {
    const view = viewFor(sel)
    while (shown < upTo) {
      const { p, color: c } = photoOf(view, info, state.seed, shown)
      cloud.photo(p, c, flash)
      shown++
    }
  }

  // the twinkling sparks of a view: where its electron might be, from a series of their own
  const moteSeries = (Math.random() * 2 ** 31) >>> 0
  const motesFor = v => {
    const sample = i => {
      const ph = photoOf(v, info, moteSeries, i)
      return { p: ph.p, color: ph.color.multiplyScalar(0.55) }
    }
    cloud.setMotes(sample, v.scale, v.mode === 0 ? 0.8 : 1)
  }

  function showSel({ instant = false } = {}) {
    const view = viewFor(sel)
    if (sel.sub === 'all') {
      atomShown = atomView(info, state.zoom)
      cloud.show(atomShown, { instant })
      motesFor(atomShown)
    } else {
      cloud.show(view, { instant })
      motesFor(view)
    }
    cloud.setFade(state.hide ? 0 : 1)
    board.draw(sel, level())
    glowTo.copy(tintOfSel(sel))
    nucTarget = rNucleusA0 * (sel.sub === 'all' ? atomShown.scale : view.scale)
  }

  /** Put a state in place: the visitor's own change, someone else's (live), or one coming back. */
  function apply(s, { live = false } = {}) {
    const next = parse(s.sel) ?? { sub: 'all', m: null }
    const zoom = Math.min(maxZoom, Math.max(1, Number(s.zoom) || 1))
    const changed = selKey(next) !== selKey(sel)
    state.sel = selKey(next)
    state.seed = Number.isFinite(s.seed) ? s.seed >>> 0 : 1
    state.shots = Math.max(0, Math.min(5000, Math.floor(Number(s.shots) || 0)))
    state.hide = !!s.hide
    const zoomChanged = Math.abs(zoom - state.zoom) > 1e-6
    state.zoom = zoom
    sel = next
    if (changed) showSel({ instant: !live })
    else {
      cloud.setFade(state.hide ? 0 : 1)
      if (zoomChanged && sel.sub === 'all') {
        atomShown = atomView(info, state.zoom)
        cloud.retune(atomShown)
        nucTarget = rNucleusA0 * atomShown.scale
        if (!live) nucScale = nucTarget
      }
    }
    if (`${state.sel}|${state.seed}` !== shownSeries || state.shots < shown) resetPhotos()
    // a newcomer or a state coming back sees the photos at once; a live change adds them in turn
    if (!live) drawPhotos(state.shots, false)
    if (!live && changed) nucScale = nucTarget
  }

  const share = () => ctx.share('cloud')

  // ---- the visitor's own actions ----
  function choose(next) {
    if (!next) return
    // "All" while all is shown: the Atomling tells it again, and the photos stay
    if (next.sub === 'all' && sel.sub === 'all') return speak(aboutSel(sel, level()))
    // the key shown, tapped again: its orbitals one by one, then all of them again
    if (next.sub !== 'all' && next.m == null && sel.sub === next.sub) {
      const k = subById(next.sub).orbitals.length
      next = { sub: next.sub, m: sel.m == null ? 0 : sel.m + 1 < k ? sel.m + 1 : null }
    }
    play('select')
    apply({ ...state, sel: selKey(next), shots: 0, seed: (Math.random() * 2 ** 31) >>> 0 }, { live: true })
    share()
    lastSaid.photos = 0
    speak(aboutSel(sel, level()))
    if (sel.sub !== 'all') discover(subById(sel.sub).l)
    refreshPanel()
  }

  let photosMine = false
  function photos(n) {
    if (!n) return
    photosMine = true
    state.shots = Math.min(5000, state.shots + n)
    camera.fire(ctx.engine.time)
    share()
    discover('photo')
    refreshPanel()
  }

  function setZoom(z) {
    if (sel.sub !== 'all') return
    apply({ ...state, zoom: z }, { live: true })
    if (state.zoom >= maxZoom * 0.75 && discover('core')) {
      const s1 = subById('1s')
      const outer = Math.max(...info.subs.map(s => s.peak))
      speak(pickSay(W.core, level(), { z: el.z, zeff: num(s1.zeff, 2, lang), pm: num(s1.peak * A0_PM, s1.peak * A0_PM < 10 ? 1 : 0, lang), ratio: Math.round(outer / s1.peak) }))
    }
    shareSoon()
  }
  // a slider sends a few times a second at most, and always its last value
  let shareTimer = null
  const shareSoon = () => {
    if (shareTimer) return
    shareTimer = setTimeout(() => {
      shareTimer = null
      share()
    }, 250)
  }

  // ---- the panels ----
  const magOf = () => sci10((sel.sub === 'all' ? atomShown.scale : viewFor(sel).scale) / A0_M, lang)
  const exceptionText = lv => {
    if (info.predicted) return pickSay(W.predicted, lv)
    const x = info.exception
    if (!x) return null
    return pickSay(W.exception, lv, { rule: configText(x.rule), real: configText(x.real), half: x.halfOrFull })
  }
  const order = info.subs.map(s => s.id).join(' ')
  const mapPanel = lv => {
    const sci = lv === 'scientist'
    const P = W.panel.map
    const blocksOut = [
      {
        orbitals: {
          shells: info.shells,
          subs: info.subs.map(s => ({ id: s.id, n: s.n, l: s.l, count: s.count, boxes: s.boxes, names: s.orbitals.map(o => o.sub) })),
          sel: { sub: sel.sub, m: sel.m },
          colors: BLOCK,
          all: W.board.all(el.z),
          sci,
          pick: x => choose(x),
        },
      },
      { p: aboutSel(sel, lv) },
    ]
    if (sci && sel.sub !== 'all') {
      const sub = subById(sel.sub)
      const nd = nodesOf(sub.n, sub.lq)
      blocksOut.push({
        rows: [
          [P.rows.shell, String(sub.n)],
          [P.rows.shape, `${sub.lq} (${sub.l})`],
          [P.rows.orbitals, String(sub.orbitals.length)],
          [P.rows.here, `${sub.count} / ${2 * sub.orbitals.length}`],
          [P.rows.nodes, P.nodes({ rn: nd.radial, an: nd.angular })],
          [P.rows.zeff, num(sub.zeff, 2, lang)],
        ],
      })
    }
    if (sci) blocksOut.push({ rows: [[P.rows.config, shortConfig(el.config)], [P.rows.order, order], [P.rows.unpaired, String(info.unpaired)]] })
    else blocksOut.push({ p: pickSay(P.unpaired, lv, { u: info.unpaired }) })
    const ex = exceptionText(lv)
    if (ex) blocksOut.push({ p: ex })
    if (sel.sub === 'all' && maxZoom > 1.5) {
      blocksOut.push({
        slider: {
          label: pickSay(W.zoom, lv),
          min: 0,
          max: 1,
          step: 0.001,
          value: Math.log(state.zoom) / Math.log(maxZoom),
          onInput: v => setZoom(Math.pow(maxZoom, v)),
          format: v => `×${Math.round(Math.pow(maxZoom, v))}`,
          live: () => Math.log(state.zoom) / Math.log(maxZoom),
        },
      })
    }
    if (sel.sub !== 'all') blocksOut.push({ buttons: [{ label: P.showAll, accent: true, onClick: () => choose({ sub: 'all', m: null }) }] })
    blocksOut.push({ p: pickSay(W.scale, lv, { mag: magOf() }) })
    if (sci) blocksOut.push({ p: P.model })
    return { title: P.title, kicker: `${sym} · ${name}`, color, blocks: blocksOut }
  }
  const cameraPanel = lv => {
    const P = W.panel.camera
    return {
      title: P.title,
      kicker: `${sym} · ${name}`,
      color,
      blocks: [
        { big: P.count(state.shots) },
        { p: pickSay(P.text, lv) },
        {
          buttons: [
            { label: P.take10, accent: true, onClick: () => photos(10) },
            { label: P.take100, accent: true, onClick: () => photos(100) },
            { label: state.hide ? P.show : P.hide, onClick: () => { apply({ ...state, hide: !state.hide }, { live: true }); share(); refreshPanel() } },
            { label: P.clear, onClick: () => { apply({ ...state, shots: 0, seed: (Math.random() * 2 ** 31) >>> 0 }, { live: true }); share(); refreshPanel() } },
          ],
        },
      ],
    }
  }
  const nucleusVars = () => {
    const d = 2 * nucTarget // the nucleus's diameter in the room, metres
    const R = el.radius?.atomic ?? el.radius?.covalent ?? null
    const rFm = nucleusFm(A)
    return {
      p: protons,
      nn: neutrons,
      size: sizeWords(d, lang),
      d: length(d, lang),
      r: num(rFm, 1, lang),
      R: R ?? '?',
      ratio: R ? Math.round((R * 1000) / rFm).toLocaleString(lang === 'pt-pt' ? 'pt-PT' : lang) : '?',
      share: num(100 * (1 - (el.z * 0.000548580) / el.mass), 2, lang),
    }
  }
  const nucleusPanel = lv => ({
    title: W.panel.nucleus.title,
    kicker: `${sym} · ${name}`,
    color,
    blocks: [{ p: pickSay(W.nucleus, lv, nucleusVars()) }, { p: pickSay(W.scale, lv, { mag: magOf() }) }],
  })
  const panels = { map: mapPanel, camera: cameraPanel, nucleus: nucleusPanel }
  // an open panel of this room is written again when what it shows changes
  function refreshPanel() {
    const open = ctx.store.get().panel?.make
    if (open && Object.values(panels).includes(open)) ctx.showPanel(open)
  }

  // ---- the things to use: E or the prompt's button, and taps on the things themselves ----
  const taps = tapTargets(ctx)
  taps.clickable(board.mesh, hit => choose(board.hit(hit.uv)), { accept: hit => !!board.hit(hit.uv), reach: 6 })
  taps.clickable(camera.group, () => photos(1), { reach: 5 })
  taps.clickable(nucGroup, () => openNucleus(), { reach: 9 })
  taps.clickable(verse.group, () => verse.open())
  const openNucleus = () => {
    ctx.showPanel(nucleusPanel)
    speak(pickSay(W.nucleus, level(), nucleusVars()))
    discover('nucleus')
  }
  const interactables = [
    {
      id: 'map',
      x: boardSpot.x + boardFront.x * 1.4,
      z: boardSpot.z + boardFront.z * 1.4,
      radius: 1.8,
      label: W.label.board,
      verb: W.verb.board,
      get found() {
        return blocks.every(b => isFound(`${prefix}:${b}`))
      },
      focus: { x: boardSpot.x, y: 0.62 + board.height / 2, z: boardSpot.z, size: Math.max(board.height, board.width * 0.7) + 0.4 },
      onUse: () => ctx.showPanel(mapPanel),
    },
    {
      id: 'camera',
      x: cameraSpot.x - 0.6,
      z: cameraSpot.z + 0.9,
      radius: 1.6,
      label: W.label.camera,
      verb: W.verb.camera,
      get found() {
        return isFound(`${prefix}:photo`)
      },
      onUse: () => {
        const first = !isFound(`${prefix}:photo`)
        photos(1)
        if (first) ctx.showPanel(cameraPanel)
      },
    },
    {
      id: 'nucleus',
      x: 0,
      z: 1.1,
      radius: 1.9,
      label: W.label.nucleus,
      verb: W.verb.look,
      get found() {
        return isFound(`${prefix}:nucleus`)
      },
      onUse: openNucleus,
    },
    verse.interactable(),
  ]
  // talking to the Atomling: what it says about what is shown, then its greeting again
  let said = 0
  const talk = () => {
    const lines = [aboutSel(sel, level()), pickSay(W.greet, level(), { z: el.z, name: inText, mag: magOf() }), exceptionText(level())].filter(Boolean)
    speak(lines[said++ % lines.length])
  }
  interactables.push({
    id: 'host',
    get x() {
      return ctx.engine.player.npc?.x ?? 99
    },
    get z() {
      return ctx.engine.player.npc?.z ?? 99
    },
    radius: 2.0,
    label: name,
    verb: W.verb.talk,
    onUse: talk,
  })

  const solids = [...ringWall(FLOOR_R + 0.15, 48), circle(0, 0, 0.45), circle(cameraSpot.x, cameraSpot.z, 0.45), circle(7.4, 9.9, 0.9)]
  {
    // the board's footprint: a thin line of posts
    for (let i = -2; i <= 2; i++) {
      const p = new THREE.Vector3((i / 2) * (board.width / 2 - 0.1), 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), boardRot)
      solids.push(circle(boardSpot.x + p.x, boardSpot.z + p.z, 0.18))
    }
  }

  showSel({ instant: true })
  nucScale = nucTarget
  let boardLevel = level()
  let panelAt = 0
  // the march's shader compiled ahead, so stepping in does not stall on it
  await cloud.warm().catch(() => {})

  return {
    mode: 'walk',
    root,
    title: W.title,
    env: { background: new THREE.Color('#02040b'), exposure: 1.0, envIntensity: 0.12, bloom: { strength: 0.45, radius: 0.5, threshold: 0.9 }, fov: 62 },
    spawn: { x: 0, z: 10.2, yaw: 0 },
    // the Atomling waits beside the way in, not between the visitor and the cloud
    hostSpot: { x: 2.4, z: 10.4, yaw: -Math.PI * 0.35 },
    avatar,
    solids,
    cameraBounds: { minX: -12.9, maxX: 12.9, minY: 0.3, maxY: 10, minZ: -12.9, maxZ: 12.7 },
    cameraPitchMax: 0.75,
    interactables,
    doors,
    talk,
    pointAt: taps.pointAt,
    onTap: taps.onTap,
    panels,
    // for the probes (tools/): the cloud (its uniforms), what is shown, and a way to choose it
    parts: { cloud, board, camera, nucleus: nucGroup },
    get sel() {
      return selKey(sel)
    },
    choose: s => choose(parse(s)),
    photos,
    setZoom,
    shared: {
      cloud: {
        get: () => ({ ...state }),
        set: (s, live) => {
          photosMine = false
          apply(s, { live })
        },
      },
    },
    refresh: report,
    attach() {
      report()
      setTimeout(() => speak(pickSay(W.greet, level(), { z: el.z, name: inText, mag: magOf() })), 900)
    },
    detach() {
      ctx.store.set({ speech: null, discoveries: null })
      if (shareTimer) clearTimeout(shareTimer)
    },
    update(dt, t) {
      for (const u of updates) u(t)
      cloud.update(dt, t)
      // the photos of a burst come in one after another, each with its flash
      if (shown < state.shots) {
        const rate = Math.max(14, (state.shots - shown) * 1.6)
        const before = shown
        drawPhotos(Math.min(state.shots, shown + Math.max(1, Math.round(rate * dt))), true)
        if (Math.floor(before / 3) !== Math.floor(shown / 3) || before === 0) play('shutter')
        camera.fire(t)
        // what the Atomling says as the dots draw the cloud (to the one who took them)
        if (photosMine) {
          if (before === 0) speak(pickSay(W.photo.first, level()))
          else if (shown >= 150 && lastSaid.photos < 150) speak(pickSay(W.photo.many, level()))
          else if (shown >= 30 && lastSaid.photos < 30) speak(pickSay(W.photo.some, level()))
        }
        lastSaid.photos = shown
        // the camera's panel counts along, a few times a second
        if (ctx.store.get().panel?.make === cameraPanel && t - panelAt > 0.2) {
          panelAt = t
          refreshPanel()
        }
      }
      camera.update(t)
      // the nucleus grows and shrinks with the view; its spark is a fixed size on the screen, fading when the
      // real thing is big enough to see
      nucScale += (nucTarget - nucScale) * Math.min(1, dt * 3)
      ball.scale.setScalar(Math.max(nucScale, 1e-4))
      ball.visible = nucScale > 0.003
      const camDist = ctx.camera.position.distanceTo(CENTER)
      const sparkSize = Math.max(0.12, camDist * 0.035) * (1 + Math.sin(t * 3.2) * 0.08)
      spark.scale.setScalar(sparkSize)
      spark.material.opacity = nucScale > 0.08 ? 0.35 : 0.95
      glow.color.lerp(glowTo, Math.min(1, dt * 2))
      if (level() !== boardLevel) {
        boardLevel = level()
        board.draw(sel, boardLevel)
      }
    },
    // drawn just before each frame, once the camera and the view's offset are set (engine.js)
    beforeRender() {
      cloud.render()
    },
    dispose() {
      cloud.dispose()
      board.dispose()
      verse.dispose()
    },
  }
}
