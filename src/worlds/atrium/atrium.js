// The atrium: what every cube opens into, the same for all 118 elements so they can be compared by
// walking through them, built from the element's data. A 16 m hall behind a 3 m door (bigger on the
// inside): the big atom over its projector in the middle, the periodic table inlaid in the floor with
// this element's tile glowing, eight stations on the walls, arches to the element's wings (closed
// ones say "being built"), the way back to the plaza behind you, and the element's Atomling.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { ELEMENTS, FAMILY, element, nameOf, cellOf } from '../../data/elements.js'
import { createAtomling } from '../../characters/atomling.js'
import { bigAtom } from './atom.js'
import { specimen } from './specimen.js'
import { appearanceOf } from '../../data/appearance.js'
import { stationsOf, greetingOf, pick, contentOf } from '../../content/stations.js'
import { loadContent } from '../../content/index.js'
import { wallPanel, arch, canvasTexture, portalMaterial } from '../common/props.js'
import { roomWalls, box, circle } from '../../engine/collide.js'
import { markFound, isFound, countFound } from '../../engine/progress.js'
import { makeText } from '../../engine/text.js'
import { wingsOf, plazaPath, wingPath } from '../registry.js'

const HALF = 8
const HEIGHT = 12
const DOOR = { width: 3.6, height: 4.4 }

// stations on the walls: the first two face you as you come in
const SPOTS = {
  identity: { x: -4.8, z: -HALF, rot: 0 },
  atom: { x: 4.8, z: -HALF, rot: 0 },
  discovery: { x: -HALF, z: -4.8, rot: Math.PI / 2 },
  state: { x: -HALF, z: 4.8, rot: Math.PI / 2 },
  found: { x: HALF, z: -4.8, rot: -Math.PI / 2 },
  uses: { x: HALF, z: 4.8, rot: -Math.PI / 2 },
  family: { x: -4.8, z: HALF, rot: Math.PI },
  isotopes: { x: 4.8, z: HALF, rot: Math.PI },
}

// where each wall's door is, which way its arch faces, and where its trigger sits
const SIDES = {
  n: { x: 0, z: -HALF, rot: 0, trigger: [0, -HALF - 0.45], stop: [0, -HALF - 1.1, 4.2, 0.6] },
  e: { x: HALF, z: 0, rot: -Math.PI / 2, trigger: [HALF + 0.45, 0], stop: [HALF + 1.1, 0, 0.6, 4.2] },
  w: { x: -HALF, z: 0, rot: Math.PI / 2, trigger: [-HALF - 0.45, 0], stop: [-HALF - 1.1, 0, 0.6, 4.2] },
  s: { x: 0, z: HALF, rot: Math.PI, trigger: [0, HALF + 0.45], stop: [0, HALF + 1.1, 4.2, 0.6] },
}

const WORDS = {
  en: { back: 'Back to the table', soon: 'Being built', talk: 'Talk to', read: 'Read', look: 'Look at', theAtom: 'the atom', hall: 'hall', real: 'What it looks like', sample: 'the real thing' },
  'pt-pt': { back: 'Voltar à tabela', soon: 'Em construção', talk: 'Falar com', read: 'Ler', look: 'Ver', theAtom: 'o átomo', hall: 'salão', real: 'Como é na realidade', sample: 'a amostra' },
}

export async function build(ctx, target, previous) {
  const el = element(target.symbol)
  await loadContent(el.symbol)
  const lang = ctx.lang()
  const W = WORDS[lang] ?? WORDS.en
  const color = FAMILY[el.family].color
  const tint = new THREE.Color(color)
  const root = new THREE.Group()
  root.name = `atrium-${el.symbol}`
  const updates = []

  // ---- the hall ----
  const floorTex = canvasTexture(1024, (g, s) => {
    g.fillStyle = '#161c40'
    g.fillRect(0, 0, s, s)
    g.strokeStyle = 'rgba(150,170,255,0.10)'
    g.lineWidth = 2
    for (let i = 0; i <= 16; i++) {
      const p = (i / 16) * s
      g.beginPath(); g.moveTo(p, 0); g.lineTo(p, s); g.stroke()
      g.beginPath(); g.moveTo(0, p); g.lineTo(s, p); g.stroke()
    }
    g.strokeStyle = color
    g.globalAlpha = 0.35
    g.lineWidth = 6
    for (const r of [2.9, 3.4]) {
      g.beginPath(); g.arc(s / 2, s / 2, (r / 16) * s, 0, Math.PI * 2); g.stroke()
    }
  })
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(HALF * 2, HALF * 2),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.28, metalness: 0.35, envMapIntensity: 0.5 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  root.add(floor)

  const wings = wingsOf(el.symbol)
  const openings = [{ side: 's', at: 0, width: DOOR.width }, ...wings.map(w => ({ side: w.side, at: 0, width: DOOR.width }))]
  const wallMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#353f78').lerp(tint, 0.12), roughness: 0.75, metalness: 0.05 })
  const wallT = 0.4
  // the walls, with a lintel over each doorway
  for (const s of roomWalls(-HALF, HALF, -HALF, HALF, openings, wallT)) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.hw * 2, HEIGHT, s.hd * 2), wallMat)
    m.position.set(s.x, HEIGHT / 2, s.z)
    root.add(m)
  }
  for (const o of openings) {
    const sd = SIDES[o.side]
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(DOOR.width + 0.1, HEIGHT - DOOR.height, wallT), wallMat)
    lintel.position.set(sd.x + Math.sign(sd.x) * wallT / 2, DOOR.height + (HEIGHT - DOOR.height) / 2, sd.z + Math.sign(sd.z) * wallT / 2)
    lintel.rotation.y = sd.rot
    root.add(lintel)
  }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2, HALF * 2), new THREE.MeshStandardMaterial({ color: '#10143a', roughness: 0.9 }))
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = HEIGHT
  root.add(ceiling)
  const glowMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.09, 8, 120), glowMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = HEIGHT - 0.05
  root.add(ring)
  // inside the ring the ceiling opens on a starry sky (the elements were made in stars)
  const oculus = new THREE.Mesh(new THREE.CircleGeometry(4.55, 64), portalMaterial('#9fb4ff', 'stars'))
  oculus.rotation.x = Math.PI / 2
  oculus.position.y = HEIGHT - 0.03
  root.add(oculus)
  updates.push(t => (oculus.material.uniforms.uTime.value = t))
  // light strips up the walls and along the floor, in the family's colour
  const stripGeo = new THREE.BoxGeometry(0.08, 6.5, 0.06)
  // between each arch and its panels, and in the corners
  for (const a of [-7.2, -2.75, 2.75, 7.2]) {
    for (const [x, z, rot] of [[a, -HALF + 0.03, 0], [a, HALF - 0.03, 0], [-HALF + 0.03, a, Math.PI / 2], [HALF - 0.03, a, Math.PI / 2]]) {
      const strip = new THREE.Mesh(stripGeo, glowMat)
      strip.position.set(x, 5.4 + 3.25, z)
      strip.rotation.y = rot
      root.add(strip)
    }
  }

  // ---- the periodic table in the floor, this element's tile glowing ----
  const tile = 0.3
  const pitch = 0.34
  const inlay = new THREE.InstancedMesh(new RoundedBoxGeometry(tile, 0.03, tile, 1, 0.04), new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.03 }), ELEMENTS.length)
  const m4 = new THREE.Matrix4()
  const mine = new THREE.Color('#ffffff')
  ELEMENTS.forEach((e, i) => {
    const { col, row } = cellOf(e)
    const x = (col - 9.5) * pitch
    const z = 5.2 + (row - 5.5) * pitch - (row >= 9 ? 0.6 * pitch : 0)
    inlay.setMatrixAt(i, m4.makeTranslation(x, 0.015, z))
    inlay.setColorAt(i, e.z === el.z ? mine : new THREE.Color(FAMILY[e.family].color).multiplyScalar(0.4))
  })
  root.add(inlay)
  const here = cellOf(el)
  const marker = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 32), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2 }))
  marker.rotation.x = -Math.PI / 2
  marker.position.set((here.col - 9.5) * pitch, 0.05, 5.2 + (here.row - 5.5) * pitch - (here.row >= 9 ? 0.6 * pitch : 0))
  root.add(marker)
  updates.push(t => marker.scale.setScalar(1 + Math.sin(t * 3) * 0.12))

  // ---- the atom over its projector ----
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.35, 0.32, 64),
    new THREE.MeshStandardMaterial({ color: '#1b2250', roughness: 0.3, metalness: 0.6 }),
  )
  pedestal.position.y = 0.16
  const lens = new THREE.Mesh(new THREE.CircleGeometry(1.7, 64), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, transparent: true, opacity: 0.6 }))
  lens.rotation.x = -Math.PI / 2
  lens.position.y = 0.33
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.7, 3.2, 48, 1, true),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  )
  beam.position.y = 1.95
  root.add(pedestal, lens, beam)
  const atom = bigAtom(el, { size: 2.5, accent: color, light: ctx.light })
  atom.root.position.y = 4.4
  root.add(atom.root)
  updates.push(t => atom.update(t))
  const atomLight = new THREE.PointLight(color, 18, 14, 1.6)
  atomLight.position.y = 4.4
  root.add(atomLight)

  // the element's name high on the far wall
  const banner = makeText(`${el.symbol} · ${nameOf(el, lang)} · ${el.z}`, { size: 0.9, color: '#ffffff', maxWidth: 14 })
  banner.position.set(0, 9.6, -HALF + 0.25)
  root.add(banner)

  // ---- the stations ----
  const level = ctx.level()
  const familyName = ctx.t(`families.${el.family}`)
  const stations = stationsOf(el, { lang, level, familyName })
  const keys = [...stations.map(s => `${el.symbol}:${s.id}`), `${el.symbol}:look`]
  const interactables = []
  const panels = {}
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  for (const st of stations) {
    const spot = SPOTS[st.id]
    const p = wallPanel({ title: st.title, big: st.teaser[0] ?? '', small: st.teaser[1] ?? '', color })
    p.group.position.set(spot.x, 2.05, spot.z)
    p.group.rotation.y = spot.rot
    p.group.translateZ(wallT / 2 + 0.06)
    root.add(p.group)
    p.setRead(isFound(`${el.symbol}:${st.id}`))
    panels[st.id] = p
    const front = new THREE.Vector3(0, 0, 1.9).applyAxisAngle(new THREE.Vector3(0, 1, 0), spot.rot)
    interactables.push({
      id: st.id,
      x: spot.x + front.x,
      z: spot.z + front.z,
      radius: 2.1,
      label: st.title,
      verb: W.read,
      onUse: () => {
        // panels are written when opened, so a change of level shows at once
        const fresh = stationsOf(el, { lang, level: ctx.level(), familyName }).find(s => s.id === st.id)
        ctx.store.set({ panel: fresh.panel() })
        if (markFound(`${el.symbol}:${st.id}`)) p.setRead(true)
        report()
      },
    })
  }
  interactables.push({
    id: 'atom',
    x: 0,
    z: 2.6,
    radius: 1.6,
    label: W.theAtom,
    verb: W.look,
    onUse: () => interactables.find(i => i.id === 'atom').open(),
    open: () => {
      const fresh = stationsOf(el, { lang, level: ctx.level(), familyName }).find(s => s.id === 'atom')
      ctx.store.set({ panel: fresh.panel() })
      if (markFound(`${el.symbol}:atom`)) panels.atom.setRead(true)
      report()
    },
  })

  // ---- the specimen case: what it looks like for real ----
  const look = appearanceOf(el)
  const lookText = look.look[lang] ?? look.look.en
  const caseSpot = { x: -4.3, z: 0.6 }
  const sample = specimen(el, look, { light: ctx.light, name: nameOf(el, lang) })
  sample.group.position.set(caseSpot.x, 0, caseSpot.z)
  sample.group.rotation.y = 0.45
  root.add(sample.group)
  updates.push(t => sample.update(t))
  interactables.push({
    id: 'look',
    x: caseSpot.x + 0.6,
    z: caseSpot.z + 1.4,
    radius: 1.7,
    label: W.sample,
    verb: W.look,
    onUse: () => {
      const state = stationsOf(el, { lang, level: ctx.level(), familyName }).find(s => s.id === 'state').panel()
      ctx.store.set({ panel: { title: W.real, kicker: `${el.symbol} · ${nameOf(el, lang)}`, color, blocks: [{ big: lookText.charAt(0).toUpperCase() + lookText.slice(1) }, state.blocks[1]] } })
      markFound(`${el.symbol}:look`)
      report()
    },
  })

  // ---- doors: the way out, the wings, closed arches where there are none yet ----
  const doors = []
  const solids = roomWalls(-HALF, HALF, -HALF, HALF, openings, wallT)
  const exit = arch({ ...DOOR, color: '#9fb4ff', label: W.back, portal: 'stars' })
  exit.group.position.set(SIDES.s.x, 0, SIDES.s.z)
  exit.group.rotation.y = SIDES.s.rot
  root.add(exit.group)
  updates.push(t => exit.update(t))
  doors.push({ x: SIDES.s.trigger[0], z: SIDES.s.trigger[1], radius: 0.9, to: plazaPath(el.symbol) })
  for (const side of ['n', 'e', 'w']) {
    const sd = SIDES[side]
    const wing = wings.find(w => w.side === side)
    const title = wing ? ctx.t(`wings.${el.symbol}.${wing.id}.title`) : W.soon
    const a = arch({ ...DOOR, color: wing?.color ?? '#59608a', label: title, closed: !wing })
    a.group.position.set(sd.x, 0, sd.z)
    a.group.rotation.y = sd.rot
    if (!wing) a.group.translateZ(wallT / 2)
    root.add(a.group)
    updates.push(t => a.update(t))
    if (wing) doors.push({ x: sd.trigger[0], z: sd.trigger[1], radius: 0.9, to: wingPath(el.symbol, wing.id) })
  }
  for (const o of openings) {
    const [x, z, w, d] = SIDES[o.side].stop
    solids.push(box(x, z, w, d))
  }
  solids.push(circle(0, 0, 2.3, { y1: 0.32 }), circle(caseSpot.x, caseSpot.z, 0.75))

  // where a player arrives: at the entrance, or in front of the arch of the wing it comes back from
  const back = previous?.kind === 'wing' && previous.symbol === el.symbol ? wings.find(w => w.id === previous.wing) : null
  const ARRIVE = { n: { x: 0, z: -5.2, yaw: Math.PI }, e: { x: 5.2, z: 0, yaw: Math.PI / 2 }, w: { x: -5.4, z: -1, yaw: -Math.PI / 2 } }
  const arrival = back ? ARRIVE[back.side] : { x: 0, z: 4.4, yaw: 0 }

  // ---- light ----
  root.add(new THREE.HemisphereLight('#e4eaff', '#262c55', 1.25))
  const sun = new THREE.DirectionalLight('#fff6ea', 1.4)
  sun.position.set(5, 12, 7)
  root.add(sun, sun.target)

  // ---- the element's Atomling ----
  const avatar = createAtomling(el, { light: ctx.light })
  root.add(avatar.root)
  const greeting = greetingOf(el, lang, level)
  // talking to the Atomling: its greeting, then its fun facts one after another
  let said = 1
  const talk = () => {
    const facts = pick(contentOf(el)?.facts, lang, ctx.level()) ?? []
    const lines = [greetingOf(el, lang, ctx.level()), ...facts]
    ctx.store.set({ speech: { text: lines[said % lines.length], who: nameOf(el, lang), color } })
    said++
  }
  interactables.push({
    id: 'host',
    get x() { return ctx.engine.player.npc?.x ?? 99 },
    get z() { return ctx.engine.player.npc?.z ?? 99 },
    radius: 2.2,
    label: nameOf(el, lang),
    verb: W.talk,
    onUse: talk,
  })

  return {
    mode: 'walk',
    root,
    env: { background: new THREE.Color('#0b0f24'), exposure: 1.05, envIntensity: 0.55, bloom: { strength: 0.6, radius: 0.5, threshold: 0.78 }, fov: 62 },
    spawn: arrival,
    hostSpot: { x: 2.6, z: 2.6, yaw: Math.PI * 0.85 },
    avatar,
    solids,
    cameraBounds: { minX: -HALF + 0.5, maxX: HALF - 0.5, minY: 0.4, maxY: HEIGHT - 0.6, minZ: -HALF + 0.5, maxZ: HALF - 0.5 },
    interactables,
    doors,
    talk,
    attach() {
      report()
      if (!back) setTimeout(() => ctx.store.set({ speech: { text: greeting, who: nameOf(el, lang), color } }), 900)
    },
    detach() {
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      for (const u of updates) u(t)
    },
    dispose() {
      floorTex.dispose()
    },
  }
}
