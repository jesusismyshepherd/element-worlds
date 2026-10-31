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
import { wallPanel, pictureBoard, arch, canvasTexture, portalMaterial } from '../common/props.js'
import { loadBoards, boardArt } from '../../content/boards/index.js'
import { factFileTexture } from './factFile.js'
import { doorwayBoard } from './doors.js'
import { hasRoom } from '../pictures/index.js'
import { track } from '../../net/telemetry.js'
import { inLang } from '../../i18n/langs.js'
import { roomWalls, box, circle } from '../../engine/collide.js'
import { markFound, isFound, countFound } from '../../engine/progress.js'
import { makeText } from '../../engine/text.js'
import { verseStone } from '../common/verse.js'
import { hallPassage } from '../../content/scripture/index.js'
import { wingsOf, plazaPath, wingPath, atriumPath, pictureRoomId } from '../registry.js'

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
// with picture boards the fact file hangs beside the way out (on the right as you face the door; the
// user, 2026-10-29) and the pictures on these, in their order: beside the north arch, the east wall,
// the west wall, north left, the way out's other side
const FACT_SPOT = 'family'
const BOARD_SPOTS = ['atom', 'found', 'uses', 'discovery', 'state', 'identity', 'isotopes']
// as big as the wall allows between the arch's light strip and the corner's (3:2, the pictures' shape)
const BOARD = { width: 4, height: 2.67 }

// where each wall's door is, which way its arch faces, and where its trigger sits
const SIDES = {
  n: { x: 0, z: -HALF, rot: 0, trigger: [0, -HALF - 0.45], stop: [0, -HALF - 1.1, 4.2, 0.6] },
  e: { x: HALF, z: 0, rot: -Math.PI / 2, trigger: [HALF + 0.45, 0], stop: [HALF + 1.1, 0, 0.6, 4.2] },
  w: { x: -HALF, z: 0, rot: Math.PI / 2, trigger: [-HALF - 0.45, 0], stop: [-HALF - 1.1, 0, 0.6, 4.2] },
  s: { x: 0, z: HALF, rot: Math.PI, trigger: [0, HALF + 0.45], stop: [0, HALF + 1.1, 4.2, 0.6] },
}

const WORDS = {
  en: { back: 'Back to the table', soon: 'Being built', talk: 'Talk to', read: 'Read', look: 'Look at', theAtom: 'the atom', hall: 'hall', real: 'What it looks like', sample: 'the real thing', facts: 'Fact file', explore: 'Explore', stepIn: 'Step in', doorways: 'Doorways' },
  'pt-pt': { back: 'Voltar à tabela', soon: 'Em construção', talk: 'Falar com', read: 'Ler', look: 'Ver', theAtom: 'o átomo', hall: 'salão', real: 'Como é na realidade', sample: 'a amostra', facts: 'Ficha técnica', explore: 'Explorar', stepIn: 'Entrar', doorways: 'Portas' },
  // the prompt reads "verb: label": a label in the case its verb takes (Zobacz: prawdziwą próbkę), the
  // Atomling's name in the nominative (Porozmawiaj: Węgiel)
  pl: { back: 'Do układu okresowego', soon: 'W budowie', talk: 'Porozmawiaj', read: 'Przeczytaj', look: 'Zobacz', theAtom: 'atom', hall: 'sala', real: 'Jak wygląda naprawdę', sample: 'prawdziwą próbkę', facts: 'Metryczka', explore: 'Odkryj', stepIn: 'Wejdź', doorways: 'Przejścia' },
  de: { back: 'Zum Periodensystem', soon: 'Im Bau', talk: 'Sprich mit', read: 'Lies', look: 'Betrachte', theAtom: 'das Atom', hall: 'Halle', real: 'So sieht es wirklich aus', sample: 'die echte Probe', facts: 'Steckbrief', explore: 'Entdecke', stepIn: 'Hineingehen', doorways: 'Durchgänge' },
}

/** Every floor tile's number and symbol, faint, on one see-through sheet just over the tiles (this
 *  element's tile, lit white, in dark ink). */
function floorTableLabels(cells, el, tile) {
  const pad = tile / 2 + 0.03
  const x0 = Math.min(...cells.map(c => c.x)) - pad
  const x1 = Math.max(...cells.map(c => c.x)) + pad
  const z0 = Math.min(...cells.map(c => c.z)) - pad
  const z1 = Math.max(...cells.map(c => c.z)) + pad
  const perM = 340
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil((x1 - x0) * perM)
  canvas.height = Math.ceil((z1 - z0) * perM)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const font = 'Outfit, system-ui, sans-serif'
  const draw = () => {
    const g = canvas.getContext('2d')
    g.clearRect(0, 0, canvas.width, canvas.height)
    const s = tile * perM
    for (const { e, x, z } of cells) {
      const cx = (x - x0) * perM
      const cy = (z - z0) * perM
      const ink = e.z === el.z ? 'rgba(11,15,36,0.85)' : 'rgba(255,255,255,0.5)'
      g.fillStyle = ink
      g.textAlign = 'left'
      g.textBaseline = 'top'
      g.font = `500 ${Math.round(s * 0.2)}px ${font}`
      g.fillText(String(e.z), cx - s * 0.4, cy - s * 0.42)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = `700 ${Math.round(s * 0.42)}px ${font}`
      g.fillText(e.symbol, cx, cy + s * 0.08)
    }
    tex.needsUpdate = true
  }
  draw()
  document.fonts?.load(`700 40px ${font}`).then(draw, () => {})
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(x1 - x0, z1 - z0),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 }),
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.set((x0 + x1) / 2, 0.032, (z0 + z1) / 2)
  mesh.renderOrder = 1
  return { mesh, dispose: () => { tex.dispose(); mesh.geometry.dispose(); mesh.material.dispose() } }
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
  const disposers = []

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
  // the wings have arches; places reached through a doorway board (the Periodic Videos room) do not
  const arches = wings.filter(w => !w.board)
  const openings = [{ side: 's', at: 0, width: DOOR.width }, ...arches.map(w => ({ side: w.side, at: 0, width: DOOR.width }))]
  const wallMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#353f78').lerp(tint, 0.12), roughness: 0.75, metalness: 0.05 })
  const wallT = 0.4
  // the walls, with a lintel over each doorway
  for (const s of roomWalls(-HALF, HALF, -HALF, HALF, openings, wallT)) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.hw * 2, HEIGHT, s.hd * 2), wallMat)
    m.position.set(s.x, HEIGHT / 2, s.z)
    root.add(m)
  }
  // the doorways are square and the arches round at the top: the two corners above the arc are wall too
  // (the user, 2026-10-31: the doorway's corners showed dark above the portal)
  const corners = (() => {
    const r = DOOR.width / 2
    const post = DOOR.height - r
    const shapes = [-1, 1].map(s => {
      const sh = new THREE.Shape()
      sh.moveTo(s * r, post)
      sh.lineTo(s * r, DOOR.height)
      sh.lineTo(0, DOOR.height)
      sh.absarc(0, post, r, Math.PI / 2, s < 0 ? Math.PI : 0, s > 0)
      return sh
    })
    const g = new THREE.ExtrudeGeometry(shapes, { depth: wallT, bevelEnabled: false, curveSegments: 24 })
    g.translate(0, 0, -wallT)
    return g
  })()
  for (const o of openings) {
    const sd = SIDES[o.side]
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(DOOR.width + 0.1, HEIGHT - DOOR.height, wallT), wallMat)
    lintel.position.set(sd.x + Math.sign(sd.x) * wallT / 2, DOOR.height + (HEIGHT - DOOR.height) / 2, sd.z + Math.sign(sd.z) * wallT / 2)
    lintel.rotation.y = sd.rot
    root.add(lintel)
    const fill = new THREE.Mesh(corners, wallMat)
    fill.position.set(sd.x, 0, sd.z)
    fill.rotation.y = sd.rot
    root.add(fill)
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
  // each tile has its symbol and number, and a click (or a tap) on one goes to that element's hall
  // without the way back to the big table (the user, 2026-10-29); the mouse over a tile lights it
  const tile = 0.3
  const pitch = 0.34
  const inlay = new THREE.InstancedMesh(new RoundedBoxGeometry(tile, 0.03, tile, 1, 0.04), new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.03 }), ELEMENTS.length)
  const m4 = new THREE.Matrix4()
  const mine = new THREE.Color('#ffffff')
  const cells = ELEMENTS.map(e => {
    const { col, row } = cellOf(e)
    return { e, x: (col - 9.5) * pitch, z: 5.2 + (row - 5.5) * pitch - (row >= 9 ? 0.6 * pitch : 0) }
  })
  const dim = cells.map(({ e }) => (e.z === el.z ? mine : new THREE.Color(FAMILY[e.family].color).multiplyScalar(0.4)))
  cells.forEach((c, i) => {
    inlay.setMatrixAt(i, m4.makeTranslation(c.x, 0.015, c.z))
    inlay.setColorAt(i, dim[i])
  })
  root.add(inlay)
  const tableLabels = floorTableLabels(cells, el, tile)
  root.add(tableLabels.mesh)
  const here = cells.find(c => c.e.z === el.z)
  const marker = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 32), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2 }))
  marker.rotation.x = -Math.PI / 2
  marker.position.set(here.x, 0.05, here.z)
  root.add(marker)
  updates.push(t => marker.scale.setScalar(1 + Math.sin(t * 3) * 0.12))
  // the tile a ray from the camera meets (null for none, and for this element's own)
  const tableFloor = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.03)
  const hit = new THREE.Vector3()
  const tileAt = ray => {
    if (!ray || !ray.intersectPlane(tableFloor, hit)) return -1
    const i = cells.findIndex(c => Math.abs(hit.x - c.x) <= pitch / 2 && Math.abs(hit.z - c.z) <= pitch / 2)
    return i >= 0 && cells[i].e.z !== el.z ? i : -1
  }
  let lit = -1
  const lightTile = i => {
    if (i === lit) return
    if (lit >= 0) inlay.setColorAt(lit, dim[lit])
    if (i >= 0) inlay.setColorAt(i, new THREE.Color(FAMILY[cells[i].e.family].color).multiplyScalar(1.6))
    inlay.instanceColor.needsUpdate = true
    lit = i
  }

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
  const interactables = []
  const panels = {}
  // an element with picture boards: one fact file with what the eight stations tell, and seven
  // pictures (the user, 2026-10-29: the eight text boards were boring; Carbon and Oxygen first)
  const boards = await loadBoards(el.symbol)
  const keys = boards
    ? [`${el.symbol}:facts`, ...boards.filter(b => !b.doors).map(b => `${el.symbol}:board:${b.id}`), `${el.symbol}:look`]
    : [...stations.map(s => `${el.symbol}:${s.id}`), `${el.symbol}:look`]
  const report = () => ctx.store.set({ discoveries: { found: countFound(keys), total: keys.length } })
  const marks = [] // each redraws one read mark (the progress replaced at a sign-in)
  const doorways = {} // where you arrive coming back through a doorway board, by wing id
  const boardDoors = [] // doorway boards, for building their places ahead
  if (boards) {
    const spots = [SPOTS[FACT_SPOT], ...BOARD_SPOTS.map(id => SPOTS[id])]
    const factFile = level => {
      const all = stationsOf(el, { lang, level, familyName }).map(st => st.panel())
      return { title: W.facts, kicker: `${el.symbol} · ${nameOf(el, lang)}`, color, blocks: all.flatMap(p => [{ h: p.title }, ...p.blocks]) }
    }
    const items = [
      {
        id: 'facts',
        board: pictureBoard({ texture: factFileTexture(el, { lang, t: ctx.t }), title: W.facts, color, ...BOARD }),
        label: W.facts,
        verb: W.read,
        open: factFile,
      },
      ...boards.map(b => {
        if (b.doors) {
          // a doorway board: its doors lead into the element's places reached through a picture
          const ds = b.doors.map(id => wings.find(w => w.id === id)).filter(Boolean)
            .map(w => ({ id: w.id, title: ctx.t(`wings.${el.symbol}.${w.id}.title`), color: w.color, to: wingPath(el.symbol, w.id) }))
          const title = ds.length === 1 ? ds[0].title : W.doorways
          return { id: 'doors', doors: ds, board: doorwayBoard({ el, doors: ds, title, color: b.color, ...BOARD }), label: title, verb: W.stepIn }
        }
        const title = inLang(b.title, lang)
        const wing = b.wing && wings.find(w => w.id === b.wing)
        // a picture with a room behind it is stepped into (its story is told inside)
        const room = hasRoom(el.symbol, b.id) ? pictureRoomId(el.symbol, b.id) : null
        return {
          id: `board:${b.id}`,
          room,
          board: pictureBoard({ url: boardArt(el.symbol, b.id), title, color: b.color, ...BOARD }),
          label: title,
          verb: room ? W.stepIn : W.explore,
          open: level => ({
            title,
            kicker: `${el.symbol} · ${nameOf(el, lang)}`,
            color: b.color,
            blocks: [
              // the picture without its bottom strip, which is kept calm for the caption on the wall
              { img: boardArt(el.symbol, b.id), alt: title, crop: 0.8 },
              ...pick(b.story, lang, level).map(p => ({ p })),
              wing && { link: { to: wingPath(el.symbol, wing.id), label: ctx.t(`wings.${el.symbol}.${wing.id}.title`) } },
            ].filter(Boolean),
          }),
        }
      }),
    ]
    items.forEach((it, i) => {
      const spot = spots[i]
      it.board.group.position.set(spot.x, 2.2, spot.z)
      it.board.group.rotation.y = spot.rot
      it.board.group.translateZ(wallT / 2 + 0.06)
      root.add(it.board.group)
      if (it.board.update) updates.push(t => it.board.update(t))
      const key = `${el.symbol}:${it.id}`
      const front = new THREE.Vector3(0, 0, 1.9).applyAxisAngle(new THREE.Vector3(0, 1, 0), spot.rot)
      // where the station view looks: the board's middle (it frames the whole board)
      const focus = { x: spot.x + front.x * 0.12, y: 2.3, z: spot.z + front.z * 0.12, size: BOARD.height + 0.5 }
      if (it.doors) {
        // stepping in: the view flies into the picture, then the place it opens on
        const normal = front.clone().normalize()
        const centre = new THREE.Vector3(spot.x, 2.2, spot.z).addScaledVector(normal, wallT / 2 + 0.06)
        const go = d => ctx.engine.player.dive(centre, normal, () => ctx.go(d.to))
        for (const d of it.doors) {
          doorways[d.id] = { x: spot.x + front.x * 1.25, z: spot.z + front.z * 1.25, yaw: spot.rot + Math.PI }
          boardDoors.push({ x: spot.x + front.x, z: spot.z + front.z, wing: d.id })
        }
        interactables.push({
          id: it.id,
          x: spot.x + front.x,
          z: spot.z + front.z,
          radius: 2.1,
          label: it.label,
          verb: it.verb,
          focus,
          onUse: () => {
            if (it.doors.length === 1) return go(it.doors[0])
            ctx.showPanel(() => ({
              title: W.doorways,
              kicker: `${el.symbol} · ${nameOf(el, lang)}`,
              color: it.doors[0].color,
              blocks: [{ buttons: it.doors.map(d => ({ label: d.title, accent: true, onClick: () => go(d) })) }],
            }))
          },
        })
        return
      }
      const mark = () => it.board.setRead(isFound(key))
      mark()
      marks.push(mark)
      if (it.room) {
        // the picture's room: the view dives into the picture (the room counts the picture as read)
        const normal = front.clone().normalize()
        const centre = new THREE.Vector3(spot.x, 2.2, spot.z).addScaledVector(normal, wallT / 2 + 0.06)
        doorways[it.room] = { x: spot.x + front.x * 1.25, z: spot.z + front.z * 1.25, yaw: spot.rot + Math.PI }
        boardDoors.push({ x: spot.x + front.x, z: spot.z + front.z, wing: it.room })
        interactables.push({
          id: it.id,
          x: spot.x + front.x,
          z: spot.z + front.z,
          radius: 2.1,
          label: it.label,
          verb: it.verb,
          focus,
          onUse: () => ctx.engine.player.dive(centre, normal, () => ctx.go(wingPath(el.symbol, it.room))),
        })
        if (it.board.dispose) disposers.push(it.board.dispose)
        return
      }
      interactables.push({
        focus,
        id: it.id,
        x: spot.x + front.x,
        z: spot.z + front.z,
        radius: 2.1,
        label: it.label,
        verb: it.verb,
        onUse: () => {
          ctx.showPanel(it.open)
          if (markFound(key)) it.board.setRead(true)
          report()
        },
      })
      if (it.board.dispose) disposers.push(it.board.dispose)
    })
  }
  for (const st of boards ? [] : stations) {
    const spot = SPOTS[st.id]
    const p = wallPanel({ title: st.title, big: st.teaser[0] ?? '', small: st.teaser[1] ?? '', color })
    p.group.position.set(spot.x, 2.05, spot.z)
    p.group.rotation.y = spot.rot
    p.group.translateZ(wallT / 2 + 0.06)
    root.add(p.group)
    const mark = () => p.setRead(isFound(`${el.symbol}:${st.id}`))
    mark()
    marks.push(mark)
    panels[st.id] = p
    const front = new THREE.Vector3(0, 0, 1.9).applyAxisAngle(new THREE.Vector3(0, 1, 0), spot.rot)
    interactables.push({
      id: st.id,
      x: spot.x + front.x,
      z: spot.z + front.z,
      radius: 2.1,
      label: st.title,
      verb: W.read,
      focus: { x: spot.x + front.x * 0.12, y: 2.3, z: spot.z + front.z * 0.12, size: 3.0 },
      onUse: () => {
        // written for the level now, and again if the level changes while it is open
        ctx.showPanel(level => stationsOf(el, { lang, level, familyName }).find(s => s.id === st.id).panel())
        if (markFound(`${el.symbol}:${st.id}`)) p.setRead(true)
        report()
      },
    })
  }
  // the big atom itself opens the "Inside the atom" panel (its own id: the station is 'atom', and a
  // lookup by id found the station, which crashed)
  interactables.push({
    id: 'big-atom',
    x: 0,
    z: 2.6,
    radius: 1.6,
    label: W.theAtom,
    verb: W.look,
    onUse: () => {
      ctx.showPanel(level => stationsOf(el, { lang, level, familyName }).find(s => s.id === 'atom').panel())
      if (markFound(`${el.symbol}:atom`)) panels.atom?.setRead(true)
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
    x: caseSpot.x + 0.75,
    z: caseSpot.z + 1.85,
    radius: 1.7,
    label: W.sample,
    verb: W.look,
    focus: { x: caseSpot.x, y: 1.35, z: caseSpot.z, size: 1.7 },
    onUse: () => {
      ctx.showPanel(level => {
        const state = stationsOf(el, { lang, level, familyName }).find(s => s.id === 'state').panel()
        return { title: W.real, kicker: `${el.symbol} · ${nameOf(el, lang)}`, color, blocks: [{ big: lookText.charAt(0).toUpperCase() + lookText.slice(1) }, state.blocks[1]] }
      })
      markFound(`${el.symbol}:look`)
      report()
    },
  })

  // ---- the verse stone, the specimen case's twin across the hall: a Bible passage about this element
  // (its own, its name's or its family's: src/content/scripture/) ----
  const stoneSpot = { x: -caseSpot.x, z: caseSpot.z }
  const verse = verseStone(ctx, hallPassage(el))
  verse.group.position.set(stoneSpot.x, 0, stoneSpot.z)
  verse.group.rotation.y = -0.45
  root.add(verse.group)
  interactables.push(verse.interactable())

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
    const wing = arches.find(w => w.side === side)
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
  solids.push(circle(0, 0, 2.3, { y1: 0.32 }), circle(caseSpot.x, caseSpot.z, 1.1), box(stoneSpot.x, stoneSpot.z, 1.9, 0.75, { rot: -0.45 }))

  // where a player arrives: at the entrance, or in front of the arch of the wing it comes back from
  const backId = previous?.kind === 'wing' && previous.symbol === el.symbol ? previous.wing : null
  const back = backId ? wings.find(w => w.id === backId) : null
  const ARRIVE = { n: { x: 0, z: -5.2, yaw: Math.PI }, e: { x: 5.2, z: 0, yaw: Math.PI / 2 }, w: { x: -5.4, z: -1, yaw: -Math.PI / 2 } }
  // (or out of the doorway board or picture it went in by, facing the hall)
  const arrival = doorways[backId] ?? (back && !back.board ? ARRIVE[back.side] : { x: 0, z: 4.4, yaw: 0 })

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
    // the floor table's tiles (probes find them on the screen)
    tiles: cells.map(c => ({ symbol: c.e.symbol, x: c.x, z: c.z })),
    pointAt(ray) {
      lightTile(tileAt(ray))
      return lit >= 0
    },
    onTap(ray) {
      const i = tileAt(ray)
      if (i < 0) return
      lightTile(i)
      track('tile', { from: el.symbol, to: cells[i].e.symbol })
      ctx.go(atriumPath(cells[i].e.symbol))
    },
    refresh() {
      marks.forEach(f => f())
      report()
    },
    attach() {
      report()
      if (!back) setTimeout(() => ctx.store.set({ speech: { text: greeting, who: nameOf(el, lang), color } }), 900)
    },
    detach() {
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      for (const u of updates) u(t)
      // walking toward a wing's arch or a picture with a room: build the nearest place and compile its
      // shaders ahead. One place only: the engine keeps one built ahead and lets the last one go, so
      // asking for an arch and a picture in the same frame built both again every frame (oxygen's fire
      // picture hangs beside the fire wing's arch: the hall crawled and the picture never opened)
      const p = ctx.engine.player.pos
      let near = null
      let nearest = Infinity
      for (const d of doors) {
        if (!d.to.startsWith(`/e/${el.symbol}/`)) continue
        const dist = Math.hypot(d.x - p.x, d.z - p.z)
        if (dist < 7.5 && dist < nearest) [near, nearest] = [d.to.split('/').pop(), dist]
      }
      // the boards stand close together: only the nearest one's place is built ahead
      for (const d of boardDoors) {
        const dist = Math.hypot(d.x - p.x, d.z - p.z)
        if (dist < 5 && dist < nearest) [near, nearest] = [d.wing, dist]
      }
      if (near) ctx.engine.prewarm({ kind: 'wing', symbol: el.symbol, wing: near })
    },
    dispose() {
      floorTex.dispose()
      tableLabels.dispose()
      verse.dispose()
      for (const d of disposers) d()
    },
  }
}
