// Krypton's picture "Is kryptonite real?" as a room (docs/knowledge/picture-rooms.md): a natural history
// museum's mineral gallery at night (stages/gallery.js), one bay dressed as the picture's comic page. Three
// stations, each worked by tapping its things:
// - "Same recipe?" (the picture's two halves): the film prop's label on a comic board and jadarite's on a real
//   one, seven element tiles each: tap a tile and it lights on both (all but fluorine, which jadarite lacks);
//   tap lithium and a battery fills; tap the glowing crystals (a stage lamp flickers behind them) or jadarite
//   (a lens shows it white and earthy).
// - "Real krypton" (the picture's flask): a flask of krypton on a stand over a Dewar of liquid nitrogen; tap
//   the flask for a lens on its atoms, tap the Dewar to dip it (the temperature holds while a state changes),
//   or drag the temperature from -196 to -140 C: solid below -157.4 C, liquid for 4 degrees, gas above.
// - "What krypton really does to people": a diving bell with a diver; a pressure slider (1 to 5 bar, a depth
//   gauge to 40 m) and the krypton bottle: half krypton, half air at 1 bar is narcotic like air at 4 bar.
// All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, lerp, damp, smooth, random } from '../../../wings/noble/kit.js'
import { galleryStage, lumpGeometry } from '../../stages/gallery.js'
import { ease } from '../../kit.js'
import { makeText } from '../../../../engine/text.js'
import { element, nameOf } from '../../../../data/elements.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { KRYPTONITE_WORDS } from './kryptonite.words.js'

export const WORDS = KRYPTONITE_WORDS

const TAU = Math.PI * 2
const Z0 = -6 // the back wall

// the recipe: the film label's elements, in the label's order (CPK colours); jadarite has all but the last
const TILES = [
  { sym: 'Na', c: '#ab5cf2' },
  { sym: 'Li', c: '#cc80ff' },
  { sym: 'B', c: '#ffb5b5' },
  { sym: 'Si', c: '#f0c8a0' },
  { sym: 'O', c: '#ff4a4a' },
  { sym: 'H', c: '#f2f2f2' },
  { sym: 'F', c: '#90e050' },
]
const LI = 1
const FL = 6

// krypton's states at one atmosphere (src/data/elements.json: 115.79 K and 119.93 K)
const MELT = 115.79 - 273.15
const BOIL = 119.93 - 273.15
const T_MIN = -196
const T_MAX = -140
const T_START = T_MAX

const GREEN = '#5cf27a'

export async function build({ ctx, root, el, lang, E, W, ex, say, later, light, color, level, depth, clickable }) {
  const stage = galleryStage({ light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const own = []
  const keep = o => (own.push(o), o)
  const paras = list => list.map(p => ({ p }))
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o }))
  const text = (s, o) => makeText(s, o)
  /** A text that follows a function of the state (words that change with the language level, numbers). */
  const live = (obj, fn) =>
    updates.push(() => {
      const s = fn()
      if (obj.text !== s) {
        obj.text = s
        obj.sync()
      }
    })
  /** A round soft glow, for mist and haze. */
  const soft = keep(
    canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.5, 'rgba(255,255,255,0.4)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  /** An invisible hit shape inside a visible group (the ray still hits it). */
  const hitBox = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), keep(new THREE.MeshBasicMaterial({ visible: false })))
    m.position.set(x, y, z)
    return m
  }

  // ---- the gallery: cases along the walls, two benches, and the comic bay at the back ----
  stage.bay({ w: 9, focus: [0.28, 0.6] })
  for (const [x, z, rot, kind, seed] of [
    [-5.6, -5.35, 0, 'amethyst', 3],
    [5.6, -5.35, 0, 'azurite', 5],
    [-12.2, 1.2, Math.PI / 2, 'copper', 7],
    [-12.2, 4.4, Math.PI / 2, 'quartz', 2],
    [-12.2, 7.4, Math.PI / 2, 'sulphur', 9],
    [12.2, 1.2, -Math.PI / 2, 'malachite', 4],
    [12.2, 4.4, -Math.PI / 2, 'rose', 6],
    [12.2, 7.4, -Math.PI / 2, 'amethyst', 8],
  ]) {
    stage.specimenCase(x, z, { rot, kind, seed })
  }
  stage.bench(-3.6, 1.9)
  stage.bench(3.6, 1.9)

  // ==== station 1: the comic bay ====
  const lit = TILES.map(() => false)
  const tileK = TILES.map(() => 0) // how lit each tile shows
  const noF = { k: 0 } // the "no fluorine" shake
  let lensOn = false
  let lensK = 0
  let bat = 0
  let batT = 0
  let flick = 0
  let allSaid = false

  const BOARD_Y = 2.55
  const ROCK = { x: -2.1, z: -4.3 }
  const PLINTH = { x: 2.0, z: -4.3 }

  // the green crystals on their rock, glowing, with the starburst behind them
  const crystals = new THREE.Group()
  crystals.position.set(ROCK.x, 0, ROCK.z)
  const rock = mk(keep(lumpGeometry(4, { detail: 2, bump: 0.24, squash: 0.55 })), std('#4a3d36', { roughness: 0.95, flatShading: true, emissive: '#1a1410', emissiveIntensity: 0.6 }), 0, 0.12, 0)
  rock.scale.set(0.95, 0.42, 0.7)
  crystals.add(rock)
  const crystalMat = keep(new THREE.MeshStandardMaterial({ color: '#2fd964', emissive: '#0f9a35', emissiveIntensity: 0.85, roughness: 0.25, transparent: true, opacity: 0.93, flatShading: true }))
  const prism = (r, h) => {
    const g = new THREE.Group()
    const body = mk(keep(new THREE.CylinderGeometry(r * 0.88, r, h, 6)), crystalMat, 0, h / 2, 0)
    const tip = mk(keep(new THREE.ConeGeometry(r * 0.88, r * 2.2, 6)), crystalMat, 0, h + r * 1.1, 0)
    g.add(body, tip)
    return g
  }
  for (const [x, z, r, h, lean, turn] of [
    [0.0, 0.0, 0.11, 1.15, 0.0, 0.2],
    [-0.38, 0.05, 0.085, 0.8, 0.42, 0.9],
    [0.4, 0.0, 0.09, 0.85, -0.4, 0.5],
    [-0.7, 0.08, 0.065, 0.5, 0.78, 0.1],
    [0.72, 0.1, 0.07, 0.55, -0.74, 0.7],
    [0.15, -0.28, 0.07, 0.6, 0.16, 0.4],
    [-0.2, 0.3, 0.07, 0.5, -0.3, 0.3],
  ]) {
    const p = prism(r, h)
    p.position.set(x, 0.12, z)
    p.rotation.set(z > 0.2 ? 0.3 : -0.1, turn, -lean)
    crystals.add(p)
  }
  crystals.add(hitBox(1.7, 1.4, 1.0, 0, 0.7, 0))
  root.add(crystals)
  solids.push(circle(ROCK.x, ROCK.z, 0.9))
  const burstTex = keep(
    canvasTex(512, 512, g => {
      const rnd = random(8)
      g.translate(256, 256)
      g.beginPath()
      const n = 22
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * TAU
        const r = i % 2 ? 90 + rnd() * 40 : 190 + rnd() * 62
        g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      }
      g.closePath()
      const grd = g.createRadialGradient(0, 0, 0, 0, 0, 250)
      grd.addColorStop(0, 'rgba(190,255,190,0.95)')
      grd.addColorStop(0.5, 'rgba(70,225,110,0.7)')
      grd.addColorStop(1, 'rgba(40,190,80,0.35)')
      g.fillStyle = grd
      g.fill()
    }),
  )
  const burstMat = keep(new THREE.MeshBasicMaterial({ map: burstTex, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
  const burst = mk(keep(new THREE.PlaneGeometry(4.0, 4.0)), burstMat, ROCK.x, 1.55, Z0 + 0.05)
  root.add(burst)
  const green = new THREE.PointLight('#46e872', light ? 1.4 : 2.6, 6.5, 1.6)
  green.position.set(ROCK.x, 1.5, ROCK.z + 0.9)
  root.add(green)

  // the stage lamp behind them (what the Atomling points out): its lens lights when the crystals flicker
  const lamp = new THREE.Group()
  const stool = mk(keep(new THREE.BoxGeometry(0.34, 0.5, 0.3)), stage.mats.woodDark, 0, 0.25, 0)
  const lampBody = mk(keep(new THREE.CylinderGeometry(0.1, 0.13, 0.28, 16)), std('#3a3d44', { metalness: 0.5 }))
  lampBody.rotation.x = Math.PI / 2
  const lampLensMat = keep(new THREE.MeshStandardMaterial({ color: '#7a6a3e', emissive: '#ffd98a', emissiveIntensity: 0.1, roughness: 0.3 }))
  const lampLens = mk(keep(new THREE.CircleGeometry(0.1, 16)), lampLensMat, 0, 0, 0.145)
  const lampPivot = new THREE.Group()
  lampPivot.add(lampBody, lampLens)
  lamp.add(stool, lampPivot)
  lamp.position.set(-1.15, 0, -4.85)
  lampPivot.position.y = 0.66
  lampPivot.rotation.y = Math.atan2(ROCK.x - -1.15, ROCK.z - -4.85) // aimed at the crystals
  lampPivot.rotation.x = 0.05
  root.add(lamp)
  solids.push(circle(-1.15, -4.85, 0.25))

  // a cape on a stand: only a plain red cloth, no figure and no emblem
  const capeStand = new THREE.Group()
  capeStand.add(mk(keep(new THREE.CylinderGeometry(0.28, 0.32, 0.06, 24)), stage.mats.woodDark, 0, 0.03, 0))
  capeStand.add(mk(keep(new THREE.CylinderGeometry(0.02, 0.025, 1.7, 8)), stage.mats.brass, 0, 0.9, 0))
  const hanger = mk(keep(new THREE.CylinderGeometry(0.018, 0.018, 0.62, 8)), stage.mats.brass, 0, 1.68, 0)
  hanger.rotation.z = Math.PI / 2
  capeStand.add(hanger)
  // a plain wooden shoulder form to hang it on (no figure, no emblem)
  const shoulders = mk(keep(new THREE.SphereGeometry(1, 16, 10)), std('#b99a6b', { roughness: 0.7 }), 0, 1.7, 0)
  shoulders.scale.set(0.3, 0.085, 0.11)
  capeStand.add(shoulders, mk(keep(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 10)), std('#b99a6b', { roughness: 0.7 }), 0, 1.79, 0))
  const capeGeo = keep(new THREE.PlaneGeometry(0.86, 1.25, 12, 14))
  {
    const p = capeGeo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i) // -0.625 (hem) .. 0.625 (shoulders)
      const hang = (0.625 - y) / 1.25
      p.setZ(i, Math.sin(x * 9) * 0.04 * hang + hang * 0.08 - 0.02)
      p.setX(i, x * (1 + hang * 0.45))
      p.setY(i, y - 0.04 * Math.abs(x) * hang)
    }
    capeGeo.computeVertexNormals()
  }
  const cape = mk(capeGeo, std('#8d1f2b', { side: THREE.DoubleSide, roughness: 0.85 }), 0, 1.08, 0)
  capeStand.add(cape)
  capeStand.position.set(-3.8, 0, -3.3)
  capeStand.rotation.y = 0.35
  root.add(capeStand)
  solids.push(circle(-3.8, -3.3, 0.3))

  // the real side: jadarite on its plinth under a glass dome
  const plinth = new THREE.Group()
  plinth.add(mk(keep(new RoundedBoxGeometry(0.95, 0.92, 0.75, 2, 0.02)), std('#3a3150', { roughness: 0.7 }), 0, 0.46, 0))
  plinth.add(mk(keep(new THREE.BoxGeometry(0.98, 0.04, 0.78)), stage.mats.brass, 0, 0.78, 0))
  plinth.add(mk(keep(new THREE.BoxGeometry(1.08, 0.05, 0.86)), std('#2a2240', { roughness: 0.6 }), 0, 0.945, 0))
  plinth.position.set(PLINTH.x, 0, PLINTH.z)
  root.add(plinth)
  solids.push(box(PLINTH.x, PLINTH.z, 1.1, 0.88))
  const grainTex = keep(
    canvasTex(512, 512, g => {
      const rnd = random(31)
      g.fillStyle = '#d9d4c7'
      g.fillRect(0, 0, 512, 512)
      for (let i = 0; i < 2600; i++) {
        const v = 170 + Math.round(rnd() * 80)
        g.fillStyle = `rgb(${v},${v - 4},${v - 14})`
        g.beginPath()
        g.arc(rnd() * 512, rnd() * 512, 1 + rnd() * 5, 0, TAU)
        g.fill()
      }
      for (let i = 0; i < 140; i++) {
        g.fillStyle = `rgba(90,84,74,${0.2 + rnd() * 0.3})`
        g.beginPath()
        g.ellipse(rnd() * 512, rnd() * 512, 2 + rnd() * 5, 1 + rnd() * 3, rnd() * 3, 0, TAU)
        g.fill()
      }
    }),
  )
  const jad = new THREE.Group()
  const lump = mk(keep(lumpGeometry(12, { detail: 3, bump: 0.2, squash: 0.62 })), keep(new THREE.MeshStandardMaterial({ map: grainTex, color: '#f1ede2', roughness: 0.95, emissive: '#8a867a', emissiveIntensity: 0.7 })), 0, 0.075, 0)
  lump.scale.set(0.4, 0.4, 0.3)
  const domePts = [new THREE.Vector2(0.48, 0)]
  for (let i = 0; i <= 12; i++) domePts.push(new THREE.Vector2(0.48 * Math.cos((i / 12) * (Math.PI / 2)), 0.3 + 0.38 * Math.sin((i / 12) * (Math.PI / 2))))
  const dome = mk(keep(new THREE.LatheGeometry(domePts, 32)), stage.mats.glass, 0, 0, 0)
  jad.add(lump, dome, mk(keep(new THREE.TorusGeometry(0.48, 0.015, 6, 32)), stage.mats.brass, 0, 0.0, 0))
  jad.children[2].rotation.x = Math.PI / 2
  jad.position.set(PLINTH.x, 0.97, PLINTH.z)
  jad.add(hitBox(1.0, 0.8, 0.8, 0, 0.38, 0))
  root.add(jad)
  const jadLight = new THREE.PointLight('#dfe8ff', light ? 0.7 : 1.3, 4.5, 1.8)
  jadLight.position.set(PLINTH.x - 0.3, 2.2, PLINTH.z + 1.2)
  root.add(jadLight)

  // the lens on jadarite: a close view of its white, earthy grain
  const lens = new THREE.Group()
  lens.add(mk(keep(new THREE.CircleGeometry(0.5, 40)), keep(new THREE.MeshBasicMaterial({ map: grainTex, toneMapped: false })), 0, 0, 0.0))
  lens.add(mk(keep(new THREE.TorusGeometry(0.5, 0.035, 8, 48)), stage.mats.brass, 0, 0, 0.0))
  const lensCap = text(E.recipe.lens, { size: 0.085, color: '#f3efe6', anchorY: 'top', outlineWidth: 0.006, outlineColor: '#0a0c18' })
  lensCap.position.set(0, -0.58, 0.01)
  lens.add(lensCap)
  lens.position.set(3.85, 1.75, -4.0)
  lens.rotation.y = -0.4
  lens.visible = false
  root.add(lens)

  // lithium's battery: it fills when lithium is tapped
  const battery = new THREE.Group()
  battery.add(mk(keep(new RoundedBoxGeometry(0.5, 1.05, 0.22, 3, 0.04)), std('#1b2030', { metalness: 0.4 }), 0, 0.525, 0))
  battery.add(mk(keep(new THREE.BoxGeometry(0.2, 0.07, 0.1)), stage.mats.brass, 0, 1.085, 0))
  const fillMat = keep(new THREE.MeshStandardMaterial({ color: '#58e08a', emissive: '#22b055', emissiveIntensity: 1.1, roughness: 0.3 }))
  const batFill = mk(keep(new THREE.BoxGeometry(0.36, 0.86, 0.02)), fillMat, 0, 0, 0.115)
  battery.add(batFill)
  const batText = text('Li', { size: 0.16, color: '#ffffff', outlineWidth: 0.008, outlineColor: '#0a2a14' })
  batText.position.set(0, 0.52, 0.135)
  battery.add(batText)
  const batCap = text(E.recipe.battery, { size: 0.08, color: '#cfe0ff', anchorY: 'top' })
  batCap.position.set(0, -0.05, 0.12)
  battery.add(batCap)
  battery.position.set(4.35, 0, -4.9)
  battery.rotation.y = -0.2
  root.add(battery)
  solids.push(circle(4.35, -4.9, 0.35))

  // the two label boards: the comic's and the real one's, a title, a line and seven tiles each
  const NAVY = new THREE.Color('#0d1233')
  const tileDark = new THREE.Color('#1a2147')
  const tilesOf = []
  function board(x, edge, title, sub) {
    const g = new THREE.Group()
    const edgeMat = keep(new THREE.MeshStandardMaterial({ color: edge, emissive: edge, emissiveIntensity: 1.0, roughness: 0.4 }))
    g.add(mk(keep(new RoundedBoxGeometry(2.88, 1.18, 0.05, 3, 0.03)), edgeMat, 0, 0, 0))
    g.add(mk(keep(new RoundedBoxGeometry(2.8, 1.1, 0.07, 3, 0.03)), keep(new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.35, emissive: '#10173f', emissiveIntensity: 0.65 })), 0, 0, 0.012))
    const t = text(title, { size: 0.2, color: edge, anchorY: 'top', maxWidth: 2.6 })
    t.position.set(0, 0.5, 0.06)
    const s = text(sub, { font: 'body', size: 0.095, color: '#d2dbff', anchorY: 'top', maxWidth: 2.6 })
    s.position.set(0, 0.26, 0.06)
    g.add(t, s)
    const row = []
    TILES.forEach((tl, i) => {
      const m = keep(new THREE.MeshStandardMaterial({ color: tileDark, emissive: '#000000', roughness: 0.4 }))
      const tile = new THREE.Mesh(keep(new RoundedBoxGeometry(0.3, 0.3, 0.06, 2, 0.02)), m)
      const px = (i - 3) * 0.385
      tile.position.set(px, -0.2, 0.08)
      const label = text(tl.sym, { size: 0.15, color: tl.c, outlineWidth: 0.004, outlineColor: '#0a0c18' })
      label.position.set(0, 0, 0.035)
      tile.add(label)
      g.add(tile)
      row.push({ tile, m, label, base: px })
    })
    g.position.set(x, BOARD_Y, Z0 + 0.1)
    root.add(g)
    tilesOf.push(row)
    return g
  }
  board(ROCK.x, GREEN, E.recipe.comic.title, E.recipe.comic.sub)
  board(PLINTH.x, '#b9c8ff', E.recipe.real.title, E.recipe.real.sub)
  const noFText = text(E.recipe.noF, { size: 0.075, color: '#ff8a8a', anchorY: 'top' })
  noFText.position.set(0, -0.14, 0.04)
  tilesOf[1][FL].tile.add(noFText)

  const maskOf = () => lit.reduce((m, v, i) => m | (v ? 1 << i : 0), 0)
  const sharedCount = () => lit.filter((v, i) => v && i !== FL).length
  const recipePanel = lv => ({
    title: E.recipe.title,
    color: GREEN,
    blocks: [
      ...paras(E.recipe.panel[depth(lv)]),
      { p: E.recipe.tip },
      {
        buttons: [
          { label: E.recipe.buttons.all, onClick: () => lightAll() },
          { label: E.recipe.buttons.crystals, onClick: () => tapCrystals() },
          { label: E.recipe.buttons.jadarite, onClick: () => tapJadarite() },
          { label: E.recipe.buttons.battery, onClick: () => tapTile(LI) },
        ],
      },
    ],
  })
  const nameLine = i => {
    const sym = TILES[i].sym
    return fill(at(E.recipe.says.tile, level()), { name: nameOf(element(sym), lang), sym })
  }
  /** Light a tile (live: by a visitor here, with its sound and words; else a state arriving). */
  function lightTile(i, live_) {
    if (lit[i]) return false
    lit[i] = true
    if (live_) play('select')
    return true
  }
  function tapTile(i) {
    const fresh = i === FL ? false : lightTile(i, true)
    if (i === FL) {
      lightTile(FL, false) // the comic's own fluorine tile lights; jadarite's shakes
      noF.k = 1
      play('tap')
    }
    if (i === LI) {
      bat = 0.04
      batT = 1
    }
    let line
    if (i === FL) line = at(E.recipe.says.fluorine, level())
    else if (i === LI) line = at(E.recipe.says.lithium, level())
    else line = nameLine(i)
    if (sharedCount() === TILES.length - 1 && fresh && !allSaid) {
      allSaid = true
      line = at(E.recipe.says.all, level())
    }
    say(line)
    ex.discover('recipe', recipePanel, 3.2)
    share('recipe')
  }
  const lightAll = () => {
    TILES.forEach((_, i) => i !== FL && lightTile(i, false))
    bat = 0.04
    batT = 1
    allSaid = true
    play('select')
    say(at(E.recipe.says.all, level()))
    ex.discover('recipe', recipePanel, 3.2)
    share('recipe')
  }
  function tapCrystals() {
    flick = 3
    play('beam')
    say(at(E.recipe.says.crystals, level()))
    ex.discover('recipe', recipePanel, 3.5)
    share('recipe')
  }
  function tapJadarite() {
    lensOn = !lensOn
    play('select')
    if (lensOn) say(at(E.recipe.says.jadarite, level()))
    ex.discover('recipe', recipePanel, 3.5)
    share('recipe')
  }
  tilesOf.forEach(row => row.forEach((r, i) => clickable(r.tile, () => tapTile(i), { reach: 7 })))
  clickable(crystals, tapCrystals, { reach: 7 })
  clickable(jad, tapJadarite, { reach: 7 })
  clickable(lens, tapJadarite, { when: () => lensK > 0.5, reach: 7 })
  clickable(battery, () => tapTile(LI), { reach: 7 })
  ex.add({
    id: 'recipe',
    x: 0,
    z: -2.2,
    radius: 3.0,
    manual: true,
    label: E.recipe.label,
    verb: E.recipe.verb,
    focus: { x: 0.3, y: 1.75, z: -4.6, size: 5.2, width: 8.2 },
    act: () => ctx.showPanel(recipePanel),
  })
  updates.push((dt, t) => {
    flick = Math.max(0, flick - dt)
    const fl = flick > 0 ? 0.55 + 0.45 * Math.sin(t * 38) * Math.sin(t * 23 + 1) : 1
    const on = flick > 0 ? clamp(0.5 + fl * 0.5) : 1
    crystalMat.emissiveIntensity = (0.85 + Math.sin(t * 1.6) * 0.1) * (flick > 0 ? 0.25 + on * 1.1 : 1)
    green.intensity = (light ? 1.4 : 2.6) * (flick > 0 ? 0.3 + on : 0.95 + Math.sin(t * 1.6) * 0.05)
    burstMat.opacity = 0.5 * (flick > 0 ? 0.35 + on * 0.8 : 1)
    lampLensMat.emissiveIntensity = flick > 0 ? 0.6 + on * 1.6 : 0.08
    cape.rotation.z = Math.sin(t * 0.9) * 0.02
    // the tiles: lit by taps, fluorine's slot on the real board shakes
    tilesOf.forEach((row, b) =>
      row.forEach((r, i) => {
        const goal = lit[i] && !(b === 1 && i === FL) ? 1 : 0
        tileK[i] = damp(tileK[i], goal, 7, dt)
        const k = b === 1 && i === FL ? 0 : tileK[i]
        r.m.color.lerpColors(tileDark, new THREE.Color(TILES[i].c), k * 0.92)
        r.m.emissive.set(TILES[i].c).multiplyScalar(k * 0.5)
        r.label.color = k > 0.5 ? '#10142c' : TILES[i].c
        r.tile.scale.setScalar(1 + k * 0.06)
        r.tile.position.x = r.base + (b === 1 && i === FL ? Math.sin(t * 60) * 0.025 * noF.k : 0)
        if (b === 1 && i === FL) r.m.emissive.set('#ff3030').multiplyScalar(noF.k * 0.5)
      }),
    )
    noF.k = Math.max(0, noF.k - dt * 1.6)
    bat = damp(bat, batT, 1.1, dt)
    batFill.scale.y = Math.max(0.01, bat)
    batFill.position.y = 0.1 + 0.43 * Math.max(0.01, bat)
    fillMat.emissiveIntensity = 0.6 + bat * 0.8
    lensK = damp(lensK, lensOn ? 1 : 0, 6, dt)
    lens.visible = lensK > 0.02
    lens.scale.setScalar(Math.max(0.01, lensK))
    lens.position.y = 1.75 + Math.sin(t * 1.3) * 0.03
  })
  const recipeState = () => ({ lit: maskOf(), bat: batT > 0.5 ? 1 : 0, lens: lensOn ? 1 : 0 })
  const recipeSet = (s, liveSet) => {
    const m = Number(s?.lit) || 0
    TILES.forEach((_, i) => {
      const want = !!(m & (1 << i))
      if (want && !lit[i]) lightTile(i, liveSet)
      if (!want && lit[i]) lit[i] = false
    })
    if (s?.bat) {
      if (batT < 0.5) bat = 0.04
      batT = 1
    } else {
      batT = 0
      bat = 0
    }
    lensOn = !!s?.lens
  }

  // ==== station 2: the flask and the Dewar ====
  const FX = 9.8
  const FZ = -4.6
  const FLASK_UP = 1.75 // the clamp's height, flask out
  const FLASK_DOWN = 1.1 // and with the bulb in the nitrogen
  let T = T_START
  let manual = false
  let dipped = false
  let dipK = 0
  let hold = 0
  let flaskLens = false
  let flaskLensK = 0
  let lastSlide = -9
  let spokenState = 'gas'
  const stateOf = v => (v <= MELT ? 'solid' : v <= BOIL ? 'liquid' : 'gas')

  const rig = new THREE.Group()
  rig.position.set(FX, 0, FZ)
  root.add(rig)
  const steel = std('#aab4bf', { metalness: 0.75, roughness: 0.35 })
  // the retort stand
  rig.add(mk(keep(new THREE.BoxGeometry(0.7, 0.05, 0.4)), steel, -0.95, 0.025, 0))
  rig.add(mk(keep(new THREE.CylinderGeometry(0.018, 0.018, 2.3, 8)), steel, -1.1, 1.15, 0))
  solids.push(circle(FX - 1.0, FZ, 0.4))
  // the clamp, sliding on the pole: an arm out over the Dewar and a ring on the flask's neck
  const clamp_ = new THREE.Group()
  const arm = mk(keep(new THREE.CylinderGeometry(0.012, 0.012, 1.1, 8)), steel, -0.55, 0, 0)
  arm.rotation.z = Math.PI / 2
  clamp_.add(arm, mk(keep(new THREE.BoxGeometry(0.07, 0.07, 0.07)), steel, -1.1, 0, 0))
  const ring = mk(keep(new THREE.TorusGeometry(0.052, 0.01, 6, 20)), steel)
  ring.rotation.x = Math.PI / 2
  clamp_.add(ring)
  rig.add(clamp_)
  // the flask: a glass bulb and neck, krypton in it as a haze of atoms, a pool of liquid, white crystals
  const flask = new THREE.Group()
  const glassMat = keep(new THREE.MeshStandardMaterial({ color: '#d6ecff', transparent: true, opacity: 0.2, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide }))
  const bulb = mk(keep(new THREE.SphereGeometry(0.17, 32, 20)), glassMat)
  const neck = mk(keep(new THREE.CylinderGeometry(0.042, 0.048, 0.3, 14, 1, true)), glassMat, 0, 0.27, 0)
  const lip = mk(keep(new THREE.TorusGeometry(0.044, 0.007, 6, 16)), glassMat, 0, 0.42, 0)
  lip.rotation.x = Math.PI / 2
  flask.add(bulb, neck, lip)
  const liquidMat = keep(new THREE.MeshStandardMaterial({ color: '#a9d8f2', emissive: '#4a86a8', emissiveIntensity: 0.55, transparent: true, opacity: 0.7, roughness: 0.2 }))
  const liquid = new THREE.Group()
  liquid.add(mk(keep(new THREE.SphereGeometry(0.158, 24, 12, 0, TAU, Math.PI / 2, Math.PI / 2)), liquidMat))
  const surf = mk(keep(new THREE.CircleGeometry(0.158, 24)), liquidMat)
  surf.rotation.x = -Math.PI / 2
  liquid.add(surf)
  liquid.position.y = -0.0
  flask.add(liquid)
  const xtalMat = keep(new THREE.MeshStandardMaterial({ color: '#f4f8ff', emissive: '#a9bcd8', emissiveIntensity: 0.55, roughness: 0.3, flatShading: true }))
  const XT = light ? 26 : 44
  const xtals = new THREE.InstancedMesh(keep(new THREE.OctahedronGeometry(1)), xtalMat, XT)
  const xr = random(41)
  const xo = new THREE.Object3D()
  const xBase = []
  for (let i = 0; i < XT; i++) {
    const a = xr() * TAU
    const rr = Math.sqrt(xr()) * 0.135
    const y = -0.03 - xr() * 0.115
    xBase.push({ x: Math.cos(a) * rr, y: y * (1 - rr * 2.2), z: Math.sin(a) * rr, s: 0.016 + xr() * 0.022, r: xr() * 3 })
  }
  flask.add(xtals)
  xtals.frustumCulled = false
  // gas atoms: a few faint dots bouncing in the bulb
  const GAS = light ? 14 : 24
  const gasPos = new Float32Array(GAS * 3)
  const gasVel = Array.from({ length: GAS }, () => [(xr() - 0.5) * 2, (xr() - 0.5) * 2, (xr() - 0.5) * 2])
  for (let i = 0; i < GAS; i++) gasPos.set([(xr() - 0.5) * 0.2, (xr() - 0.5) * 0.2, (xr() - 0.5) * 0.2], i * 3)
  const gasGeo = keep(new THREE.BufferGeometry())
  gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3))
  const gasMat = keep(new THREE.PointsMaterial({ color: '#8fe3f2', size: 0.04, map: soft, transparent: true, opacity: 0.85, depthWrite: false }))
  const gasPts = new THREE.Points(gasGeo, gasMat)
  gasPts.frustumCulled = false
  gasPts.raycast = () => {}
  flask.add(gasPts)
  flask.add(hitBox(0.42, 0.78, 0.42, 0, 0.18, 0))
  rig.add(flask)
  // the Dewar: a steel vessel with a wide mouth and a window cut in its front (the bulb is seen going in),
  // liquid nitrogen in it to near the top, mist over it, a little sign beside it
  const dewar = new THREE.Group()
  dewar.add(mk(keep(new THREE.CylinderGeometry(0.32, 0.3, 0.95, 36, 1, true, 0.62, TAU - 1.24)), std('#b9c2cc', { metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide }), 0, 0.475, 0))
  dewar.add(mk(keep(new THREE.CircleGeometry(0.3, 28)), steel, 0, 0.01, 0))
  const rim = mk(keep(new THREE.TorusGeometry(0.31, 0.022, 8, 36)), steel, 0, 0.95, 0)
  rim.rotation.x = Math.PI / 2
  dewar.add(rim)
  const nitroMat = keep(new THREE.MeshStandardMaterial({ color: '#a8d4f0', emissive: '#4d90bd', emissiveIntensity: 0.7, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.55, depthWrite: false }))
  const nitro = mk(keep(new THREE.CircleGeometry(0.29, 28)), nitroMat, 0, 0.72, 0)
  nitro.rotation.x = -Math.PI / 2
  dewar.add(nitro, mk(keep(new THREE.CylinderGeometry(0.29, 0.29, 0.7, 28, 1, true)), nitroMat, 0, 0.36, 0))
  const sign = new THREE.Group()
  sign.add(mk(keep(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6)), steel, 0, 0.25, 0))
  sign.add(mk(keep(new RoundedBoxGeometry(0.62, 0.3, 0.03, 2, 0.01)), std('#0f1530', { emissive: '#10173f', emissiveIntensity: 0.6 }), 0, 0.62, 0))
  const dewarLabel = text(E.flask.dewar, { size: 0.075, color: '#e6f4ff', maxWidth: 0.55 })
  dewarLabel.position.set(0, 0.68, 0.02)
  const dewarT = text('-196 °C', { size: 0.08, color: '#9fd8ff' })
  dewarT.position.set(0, 0.57, 0.02)
  sign.add(dewarLabel, dewarT)
  sign.position.set(0.72, 0, 0.2)
  dewar.add(sign)
  dewar.add(hitBox(0.7, 1.0, 0.7, 0, 0.5, 0))
  rig.add(dewar)
  solids.push(circle(FX, FZ, 0.42))
  const MIST = light ? 5 : 9
  const mist = Array.from({ length: MIST }, (_, i) => {
    const s = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: soft, color: '#dff0ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })))
    s.raycast = () => {}
    s.userData = { ph: i / MIST, dx: (xr() - 0.5) * 0.3, dz: (xr() - 0.5) * 0.3 }
    rig.add(s)
    return s
  })
  const flaskLight = new THREE.PointLight('#cfe4ff', light ? 0.9 : 1.6, 6, 1.6)
  flaskLight.position.set(FX - 1.0, 2.3, FZ + 1.3)
  root.add(flaskLight)
  // the thermometer with its three bands
  const TH = { x: FX - 3.5, z: FZ + 0.05, y0: 0.55, y1: 2.15 }
  const therm = new THREE.Group()
  therm.position.set(TH.x, 0, TH.z)
  root.add(therm)
  const Tspan = T_MAX - T_MIN
  const yOf = v => TH.y0 + ((clamp(v, T_MIN, T_MAX) - T_MIN) / Tspan) * (TH.y1 - TH.y0)
  therm.add(mk(keep(new RoundedBoxGeometry(0.95, TH.y1 - TH.y0 + 0.75, 0.06, 2, 0.02)), std('#0f1530', { roughness: 0.4, emissive: '#10173f', emissiveIntensity: 0.6 }), -0.02, (TH.y0 + TH.y1) / 2 + 0.1, -0.03))
  const band = (v0, v1, c, name) => {
    const y0 = yOf(v0)
    const y1 = yOf(v1)
    const m = mk(keep(new THREE.BoxGeometry(0.14, y1 - y0, 0.03)), keep(new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.55, roughness: 0.4 })), -0.02, (y0 + y1) / 2, 0.005)
    therm.add(m)
    return m
  }
  band(T_MIN, MELT, '#dbe9ff')
  band(MELT, BOIL, '#5fb8f5')
  band(BOIL, T_MAX, '#a98cf0')
  const thermWord = (s, v0, v1, c) => {
    const t = text(s, { font: 'body', size: 0.075, color: c, anchorX: 'right', maxWidth: 0.4 })
    t.position.set(-0.1, (yOf(v0) + yOf(v1)) / 2 + 0.0, 0.02)
    therm.add(t)
  }
  thermWord(E.flask.states.solid, T_MIN, MELT, '#dbe9ff')
  thermWord(E.flask.states.liquid, MELT - 0.8, BOIL + 0.8, '#8fd0ff')
  thermWord(E.flask.states.gas, BOIL, T_MAX, '#c9b8ff')
  for (const [v, s] of [[T_MIN, '-196'], [MELT, '-157.4'], [BOIL, '-153.2'], [T_MAX, '-140']]) {
    const t = text(s, { size: 0.055, color: '#9fb0d8', anchorX: 'left' })
    t.position.set(0.1, yOf(v) + (v === BOIL ? 0.035 : v === MELT ? -0.035 : 0), 0.02)
    therm.add(t)
    therm.add(mk(keep(new THREE.BoxGeometry(0.06, 0.008, 0.02)), std('#9fb0d8'), 0.05, yOf(v), 0.01))
  }
  const needle = new THREE.Group()
  const red = keep(new THREE.MeshBasicMaterial({ color: '#ff6a4a', toneMapped: false }))
  needle.add(mk(keep(new THREE.BoxGeometry(0.3, 0.014, 0.012)), red, 0, 0, 0.03))
  needle.add(mk(keep(new THREE.SphereGeometry(0.035, 12, 8)), red, 0, 0, 0.03))
  therm.add(needle)
  const needleText = text('', { size: 0.1, color: '#ffd2c8', anchorY: 'bottom', outlineWidth: 0.005, outlineColor: '#0a0c18' })
  needleText.position.set(0, TH.y1 + 0.13, 0.04)
  therm.add(needleText)
  const thermTitle = text(E.flask.temp, { font: 'body', size: 0.075, color: '#d2dbff', maxWidth: 0.9, anchorY: 'bottom' })
  thermTitle.position.set(0, TH.y1 + 0.3, 0.04)
  therm.add(thermTitle)
  solids.push(circle(TH.x, TH.z, 0.4))
  // the lens on the atoms, in the picture's round frame
  const FL_LENS = { x: FX - 2.0, y: 1.6, z: FZ + 0.5 }
  const flens = new THREE.Group()
  flens.add(mk(keep(new THREE.CircleGeometry(0.6, 48)), keep(new THREE.MeshBasicMaterial({ color: '#0a1633', toneMapped: false })), 0, 0, -0.005))
  flens.add(mk(keep(new THREE.TorusGeometry(0.6, 0.04, 8, 56)), keep(new THREE.MeshStandardMaterial({ color: '#8fd3e8', emissive: '#4ab0cf', emissiveIntensity: 0.9, roughness: 0.35 })), 0, 0, 0))
  const atomMat = keep(new THREE.MeshStandardMaterial({ color: '#4fb6cf', emissive: '#1d7189', emissiveIntensity: 0.8, roughness: 0.25 }))
  const NA = 36
  const atoms = new THREE.InstancedMesh(keep(new THREE.SphereGeometry(1, 16, 10)), atomMat, NA)
  atoms.frustumCulled = false
  flens.add(atoms)
  const lensWord = text('', { font: 'body', size: 0.085, color: '#d9efff', anchorY: 'top', maxWidth: 1.4, outlineWidth: 0.006, outlineColor: '#0a0c18' })
  lensWord.position.set(0, -0.7, 0.01)
  flens.add(lensWord)
  flens.position.set(FL_LENS.x, FL_LENS.y, FL_LENS.z)
  flens.rotation.y = 0.35
  flens.visible = false
  flens.add(hitBox(1.3, 1.3, 0.1, 0, 0, 0))
  root.add(flens)
  // each atom's three homes: a hexagonal layer (solid), a loose clump (liquid), a flight through the disc (gas)
  const AR = 0.047
  const solidAt = []
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) solidAt.push([(c - 2.5 + (r % 2 ? 0.5 : 0)) * AR * 2.15, (r - 2.5) * AR * 2.15 * 0.866])
  const liqJit = Array.from({ length: NA }, () => [(xr() - 0.5) * 0.045, (xr() - 0.5) * 0.045, xr() * TAU])
  const flyPos = Array.from({ length: NA }, () => [(xr() - 0.5) * 0.9, (xr() - 0.5) * 0.9])
  const flyVel = Array.from({ length: NA }, () => {
    const a = xr() * TAU
    return [Math.cos(a), Math.sin(a)]
  })
  const wSol = { v: 0 }
  const wLiq = { v: 0 }
  const wGas = { v: 1 }
  const ao = new THREE.Object3D()
  const poseAtoms = (dt, t) => {
    const st = stateOf(T)
    const speed = 0.5 * Math.sqrt(Math.max(0.05, (T + 273.15) / 293)) // metres a second at the lens' scale, from sqrt(T)
    wSol.v = damp(wSol.v, st === 'solid' ? 1 : 0, 4, dt)
    wLiq.v = damp(wLiq.v, st === 'liquid' ? 1 : 0, 4, dt)
    wGas.v = damp(wGas.v, st === 'gas' ? 1 : 0, 4, dt)
    const tot = wSol.v + wLiq.v + wGas.v || 1
    const cold = clamp((T + 273.15) / 293) // how warm: the jiggle of a solid and a liquid grows with it
    for (let i = 0; i < NA; i++) {
      const f = flyPos[i]
      const v = flyVel[i]
      f[0] += v[0] * speed * dt * 0.55
      f[1] += v[1] * speed * dt * 0.55
      if (Math.hypot(f[0], f[1]) > 0.52) {
        const nx = f[0] / Math.hypot(f[0], f[1])
        const ny = f[1] / Math.hypot(f[0], f[1])
        const d = v[0] * nx + v[1] * ny
        v[0] -= 2 * d * nx
        v[1] -= 2 * d * ny
        f[0] = nx * 0.51
        f[1] = ny * 0.51
      }
      const [sx, sy] = solidAt[i]
      const jig = 0.004 + 0.012 * cold
      const sxj = sx + Math.sin(t * 17 + i * 1.7) * jig
      const syj = sy + Math.cos(t * 15 + i * 2.3) * jig
      const lj = liqJit[i]
      const lx = sx * 1.09 + lj[0] + Math.sin(t * 2.1 + lj[2]) * 0.03
      const ly = sy * 1.09 + lj[1] + Math.cos(t * 1.7 + lj[2] * 1.3) * 0.03
      const x = (sxj * wSol.v + lx * wLiq.v + f[0] * wGas.v) / tot
      const y = (syj * wSol.v + ly * wLiq.v + f[1] * wGas.v) / tot
      ao.position.set(x, y, 0.05)
      ao.scale.setScalar(AR)
      ao.updateMatrix()
      atoms.setMatrixAt(i, ao.matrix)
    }
    atoms.instanceMatrix.needsUpdate = true
  }
  // steps
  const flaskPanel = lv => ({
    title: E.flask.title,
    color: '#8fd0ff',
    blocks: [
      ...paras(E.flask.panel[depth(lv)]),
      { p: E.flask.tip },
      {
        slider: {
          label: E.flask.temp,
          min: T_MIN,
          max: T_MAX,
          step: 0.1,
          value: T,
          onInput: v => {
            T = v
            manual = true
            hold = 0
            lastSlide = performance.now() / 1000
            slid()
          },
          format: v => `${num(v, 1, lang)} °C`,
          live: () => T,
        },
      },
      {
        buttons: [
          { label: E.flask.buttons.lens, onClick: () => tapFlask() },
          { label: dipped ? E.flask.buttons.lift : E.flask.buttons.dip, onClick: () => tapDewar() },
        ],
      },
    ],
  })
  let sliding = false
  const slid = () => {
    if (sliding) return
    sliding = true
    later(0.2, () => {
      sliding = false
      share('flask')
    })
  }
  function tapFlask() {
    flaskLens = !flaskLens
    play('select')
    if (flaskLens) say(at(E.flask.says.lens, level()))
    ex.discover('flask', flaskPanel, 3.5)
    share('flask')
  }
  function tapDewar() {
    dipped = !dipped
    manual = false
    play(dipped ? 'beam' : 'tap')
    if (dipped && !flaskLens) flaskLens = true
    say(at(dipped ? E.flask.says.dip : E.flask.says.lift, level()))
    ex.discover('flask', flaskPanel, 4)
    share('flask')
  }
  clickable(flask, tapFlask, { reach: 7 })
  clickable(dewar, tapDewar, { reach: 7 })
  clickable(flens, tapFlask, { when: () => flaskLensK > 0.5, reach: 7 })
  ex.add({
    id: 'flask',
    x: FX - 0.2,
    z: -2.3,
    radius: 2.5,
    manual: true,
    label: E.flask.label,
    verb: () => (!flaskLens ? E.flask.verbLens : !dipped && T > -190 ? E.flask.verbDip : E.flask.verbSlide),
    focus: { x: FX - 1.7, y: 1.3, z: FZ, size: 4.2, width: 5.8 },
    act: () => ctx.showPanel(flaskPanel),
  })
  live(needleText, () => `${num(T, 1, lang)} °C`)
  live(lensWord, () => E.flask.lens[stateOf(T)])
  const tmpC = new THREE.Color()
  updates.push((dt, t) => {
    dipK = damp(dipK, dipped ? 1 : 0, 1.4, dt)
    // the clamp slides on the pole: the arm's far end is the pole, the ring holds the neck (x = 0)
    const armY = lerp(FLASK_UP, FLASK_DOWN, ease(dipK))
    clamp_.position.y = armY
    flask.position.set(0, armY - 0.3, 0)
    // the temperature: cooling once the bulb is in, warming when it is out; it holds while a state changes
    if (!manual) {
      const target = dipped ? (dipK > 0.9 ? T_MIN : T) : T_MAX
      const dir = Math.sign(target - T)
      if (hold > 0) hold -= dt
      else if (dir) {
        const rate = dir < 0 ? 7 : 5
        let nT = T + dir * rate * dt
        if (dir * (target - nT) < 0) nT = target
        for (const b of [BOIL, MELT]) {
          if ((T - b) * (nT - b) < 0) {
            nT = b
            hold = 1.4
            break
          }
        }
        T = nT
      }
    }
    const st = stateOf(T)
    // the Atomling says what the flask has become, once the temperature rests
    const now = performance.now() / 1000
    if (st !== spokenState && now - lastSlide > 0.7) {
      spokenState = st
      say(at(E.flask.says[st], level()))
    }
    // what is in the bulb
    const solidK = damp(xtals.userData.k ?? 0, st === 'solid' ? 1 : 0, 2.2, dt)
    xtals.userData.k = solidK
    const liqK = damp(liquid.userData.k ?? 0, st === 'liquid' ? 1 : st === 'solid' ? 0.35 : 0, 2.5, dt)
    liquid.userData.k = liqK
    liquid.visible = liqK > 0.02
    liquid.scale.set(1, Math.max(0.01, liqK), 1)
    liquidMat.opacity = 0.7 * clamp(liqK * 1.4)
    xtals.visible = solidK > 0.02
    for (let i = 0; i < XT; i++) {
      const b = xBase[i]
      xo.position.set(b.x, b.y, b.z)
      xo.rotation.set(b.r, b.r * 2, b.r * 0.5)
      xo.scale.setScalar(b.s * solidK * 1.5)
      xo.updateMatrix()
      xtals.setMatrixAt(i, xo.matrix)
    }
    xtals.instanceMatrix.needsUpdate = true
    gasMat.opacity = 0.85 * (st === 'gas' ? 1 : 0.15)
    const sp = 0.16 * Math.sqrt(Math.max(0.05, (T + 273.15) / 293))
    for (let i = 0; i < GAS; i++) {
      const v = gasVel[i]
      for (let k = 0; k < 3; k++) {
        gasPos[i * 3 + k] += v[k] * sp * dt
        if (Math.abs(gasPos[i * 3 + k]) > 0.14) v[k] = -Math.abs(v[k]) * Math.sign(gasPos[i * 3 + k])
      }
    }
    gasGeo.attributes.position.needsUpdate = true
    // frost on the glass as it chills
    const chill = clamp((-T - 120) / 76)
    tmpC.set('#d6ecff').lerp(new THREE.Color('#f2f8ff'), chill)
    glassMat.color.copy(tmpC)
    glassMat.opacity = 0.2 + chill * 0.12
    // the thermometer's needle and the lens
    needle.position.set(0.0, yOf(T), 0.0)
    flaskLensK = damp(flaskLensK, flaskLens ? 1 : 0, 6, dt)
    flens.visible = flaskLensK > 0.02
    flens.scale.setScalar(Math.max(0.01, flaskLensK))
    if (flens.visible) poseAtoms(dt, t)
    // the mist over the Dewar
    mist.forEach(s => {
      const u = (t * 0.18 + s.userData.ph) % 1
      s.position.set(s.userData.dx * u * 2, 0.97 + u * 0.55, s.userData.dz * u * 2)
      s.scale.setScalar(0.22 + u * 0.4)
      s.material.opacity = 0.2 * Math.sin(u * Math.PI)
    })
    nitro.material.emissiveIntensity = 0.6 + Math.sin(t * 2.7) * 0.08
  })
  const flaskState = () => ({ dip: dipped ? 1 : 0, man: manual ? 1 : 0, T: Math.round(T * 10) / 10, lens: flaskLens ? 1 : 0 })
  const flaskSet = s => {
    dipped = !!s?.dip
    manual = !!s?.man
    flaskLens = !!s?.lens
    const v = Number(s?.T)
    if (Number.isFinite(v)) T = clamp(v, T_MIN, T_MAX)
    hold = 0
    spokenState = stateOf(T)
    if (dipped) dipK = Math.max(dipK, 0.0)
  }

  // ==== station 3: the diving bell ====
  const CX = -9.4
  const CZ = -4.3
  let P = 1
  let kr = false
  let bell = false // the pressure has been tried
  let zoneSaid = 0
  let lastP = -9
  const bellRoot = new THREE.Group()
  bellRoot.position.set(CX, 0, CZ)
  root.add(bellRoot)
  bellRoot.add(mk(keep(new THREE.CylinderGeometry(1.0, 1.05, 0.22, 40)), steel, 0, 0.11, 0))
  const cglass = mk(keep(new THREE.CylinderGeometry(0.85, 0.85, 2.0, 40, 1, true)), keep(new THREE.MeshStandardMaterial({ color: '#cfe6ff', transparent: true, opacity: 0.14, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide })), 0, 1.22, 0)
  bellRoot.add(cglass)
  const gasTint = mk(keep(new THREE.CylinderGeometry(0.83, 0.83, 1.96, 32, 1, true)), keep(new THREE.MeshBasicMaterial({ color: '#46e07a', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })), 0, 1.22, 0)
  gasTint.raycast = () => {}
  bellRoot.add(gasTint)
  const topCap = mk(keep(new THREE.SphereGeometry(0.85, 32, 12, 0, TAU, 0, Math.PI / 2)), cglass.material, 0, 2.22, 0)
  topCap.scale.y = 0.45
  bellRoot.add(topCap)
  for (const y of [0.22, 2.22]) {
    const r = mk(keep(new THREE.TorusGeometry(0.85, 0.04, 8, 40)), stage.mats.brass, 0, y, 0)
    r.rotation.x = Math.PI / 2
    bellRoot.add(r)
  }
  for (const a of [0, 1, 2, 3]) bellRoot.add(mk(keep(new THREE.CylinderGeometry(0.025, 0.025, 2.0, 6)), stage.mats.brass, Math.cos((a / 4) * TAU + 0.4) * 0.85, 1.22, Math.sin((a / 4) * TAU + 0.4) * 0.85))
  bellRoot.add(hitBox(1.8, 2.5, 1.8, 0, 1.3, 0))
  const bellLight = new THREE.PointLight('#fff0d6', light ? 0.9 : 1.7, 6, 1.5)
  bellLight.position.set(0.0, 1.9, 0.5)
  bellRoot.add(bellLight)
  solids.push(circle(CX, CZ, 1.05))
  // the diver inside, facing the visitor
  const diver = new THREE.Group()
  const suit = std('#3f7df0', { roughness: 0.6, emissive: '#10285a', emissiveIntensity: 0.7 })
  const fins = std('#f0b429', { roughness: 0.6 })
  const legL = mk(keep(new THREE.CapsuleGeometry(0.08, 0.5, 4, 10)), suit, -0.11, 0.42, 0)
  const legR = mk(keep(new THREE.CapsuleGeometry(0.08, 0.5, 4, 10)), suit, 0.11, 0.42, 0)
  const torso = mk(keep(new THREE.CapsuleGeometry(0.19, 0.42, 4, 12)), suit, 0, 1.0, 0)
  const armL = mk(keep(new THREE.CapsuleGeometry(0.06, 0.4, 4, 8)), suit, -0.3, 1.0, 0.04)
  const armR = mk(keep(new THREE.CapsuleGeometry(0.06, 0.4, 4, 8)), suit, 0.3, 1.0, 0.04)
  armL.rotation.z = 0.25
  armR.rotation.z = -0.25
  const head = new THREE.Group()
  head.add(mk(keep(new THREE.SphereGeometry(0.17, 20, 14)), std('#e8c29f', { roughness: 0.7 })))
  const mask = mk(keep(new THREE.SphereGeometry(0.15, 20, 12, 0, TAU, 0.2, 1.0)), keep(new THREE.MeshStandardMaterial({ color: '#12263a', roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85 })), 0, 0, 0.03)
  mask.rotation.x = 1.15
  const maskFrame = mk(keep(new THREE.TorusGeometry(0.115, 0.02, 6, 20)), std('#101820'), 0, -0.01, 0.15)
  head.add(mask, maskFrame)
  head.position.set(0, 1.5, 0)
  const tank = mk(keep(new THREE.CylinderGeometry(0.09, 0.09, 0.6, 14)), std('#e9c52a', { metalness: 0.3 }), 0, 1.05, -0.26)
  const footL = mk(keep(new THREE.BoxGeometry(0.13, 0.04, 0.3)), fins, -0.11, 0.04, 0.1)
  const footR = mk(keep(new THREE.BoxGeometry(0.13, 0.04, 0.3)), fins, 0.11, 0.04, 0.1)
  diver.add(legL, legR, torso, armL, armR, head, tank, footL, footR)
  diver.position.set(0, 0.22, 0.0)
  bellRoot.add(diver)
  // breath bubbles from the diver's mouth
  const BUB = light ? 8 : 14
  const bubbles = new THREE.InstancedMesh(keep(new THREE.SphereGeometry(1, 10, 8)), keep(new THREE.MeshStandardMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.55, roughness: 0.1 })), BUB)
  bubbles.frustumCulled = false
  bubbles.raycast = () => {}
  bellRoot.add(bubbles)
  const bubS = Array.from({ length: BUB }, (_, i) => ({ y: 1.7 + (i / BUB) * 0.5, ph: xr() * TAU, v: 0.25 + xr() * 0.2, x: (xr() - 0.5) * 0.1 }))
  // the thought bubble: a cloud with a sum in it; it wobbles with the narcosis
  const thought = new THREE.Group()
  const cloudMat = keep(new THREE.MeshBasicMaterial({ color: '#aeb8de', toneMapped: false }))
  for (const [x, y, r] of [[-0.45, 0, 0.3], [0.0, 0.1, 0.38], [0.46, 0, 0.3], [-0.2, -0.12, 0.28], [0.22, -0.12, 0.28]]) {
    const c = mk(keep(new THREE.CircleGeometry(r, 24)), cloudMat, x, y, 0)
    thought.add(c)
  }
  thought.add(mk(keep(new THREE.CircleGeometry(0.1, 14)), cloudMat, -0.12, -0.55, 0), mk(keep(new THREE.CircleGeometry(0.06, 12)), cloudMat, -0.02, -0.75, 0))
  const sum = text('2 + 2 = 4', { size: 0.2, color: '#0c1030', maxWidth: 1.3 })
  sum.position.set(0, 0.02, 0.01)
  thought.add(sum)
  thought.position.set(CX, 3.3, CZ + 0.3)
  root.add(thought)
  // the depth gauge: white needle the real depth, orange needle what it feels like
  const GAUGE = { x: CX + 2.0, z: CZ + 0.3 }
  const gauge = new THREE.Group()
  gauge.position.set(GAUGE.x, 0, GAUGE.z)
  gauge.rotation.y = 0.28
  root.add(gauge)
  gauge.add(mk(keep(new THREE.CylinderGeometry(0.035, 0.05, 1.15, 10)), steel, 0, 0.58, -0.08))
  gauge.add(mk(keep(new THREE.CylinderGeometry(0.2, 0.22, 0.06, 20)), steel, 0, 0.03, -0.08))
  const dialTex = keep(
    canvasTex(512, 512, g => {
      g.translate(256, 256)
      g.fillStyle = '#0b1230'
      g.beginPath()
      g.arc(0, 0, 250, 0, TAU)
      g.fill()
      const A0 = (-225 * Math.PI) / 180
      const SPAN = (270 * Math.PI) / 180
      // zones: clear (green), narcosis from 30 m (amber), deep (red)
      for (const [a, b, c] of [[0, 30, '#2f8f5a'], [30, 40, '#d99a2b']]) {
        g.strokeStyle = c
        g.lineWidth = 16
        g.beginPath()
        g.arc(0, 0, 214, A0 + (a / 40) * SPAN, A0 + (b / 40) * SPAN)
        g.stroke()
      }
      g.fillStyle = '#e8eeff'
      g.strokeStyle = '#e8eeff'
      g.font = '700 38px Outfit, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      for (let d = 0; d <= 40; d += 5) {
        const a = A0 + (d / 40) * SPAN
        const big = d % 10 === 0
        g.lineWidth = big ? 6 : 3
        g.beginPath()
        g.moveTo(Math.cos(a) * (big ? 176 : 188), Math.sin(a) * (big ? 176 : 188))
        g.lineTo(Math.cos(a) * 200, Math.sin(a) * 200)
        g.stroke()
        if (big) g.fillText(String(d), Math.cos(a) * 140, Math.sin(a) * 140)
      }
      g.font = '700 34px Outfit, sans-serif'
      g.fillStyle = '#9fb0d8'
      g.fillText(E.chamber.gauge.unit, 0, 96)
    }),
  )
  const dialFace = new THREE.Group()
  dialFace.add(mk(keep(new THREE.CircleGeometry(0.34, 40)), keep(new THREE.MeshBasicMaterial({ map: dialTex, toneMapped: false })), 0, 0, 0))
  dialFace.add(mk(keep(new THREE.TorusGeometry(0.34, 0.025, 8, 40)), stage.mats.brass, 0, 0, 0))
  const needleMat = c => keep(new THREE.MeshBasicMaterial({ color: c, toneMapped: false }))
  const pivotR = new THREE.Group()
  pivotR.add(mk(keep(new THREE.BoxGeometry(0.014, 0.27, 0.01)), needleMat('#ffffff'), 0, 0.12, 0.01))
  const pivotF = new THREE.Group()
  pivotF.add(mk(keep(new THREE.BoxGeometry(0.02, 0.3, 0.01)), needleMat('#ff9a2e'), 0, 0.13, 0.016))
  dialFace.add(pivotF, pivotR, mk(keep(new THREE.CircleGeometry(0.03, 12)), needleMat('#cfd8f0'), 0, 0, 0.02))
  dialFace.position.set(0, 1.4, 0)
  dialFace.rotation.x = -0.25
  gauge.add(dialFace)
  const gTexts = new THREE.Group()
  gTexts.position.set(0, 1.4, 0.0)
  const lReal = text(E.chamber.gauge.real, { font: 'body', size: 0.07, color: '#ffffff', anchorY: 'top', maxWidth: 0.9, outlineWidth: 0.004, outlineColor: '#0a0c18' })
  lReal.position.set(0, -0.4, 0.05)
  const lFeel = text(E.chamber.gauge.feels, { font: 'body', size: 0.07, color: '#ff9a2e', anchorY: 'top', maxWidth: 0.9, outlineWidth: 0.004, outlineColor: '#0a0c18' })
  lFeel.position.set(0, -0.5, 0.05)
  const lBar = text('1.0 bar', { size: 0.1, color: '#cfe0ff', anchorY: 'bottom', outlineWidth: 0.005, outlineColor: '#0a0c18' })
  lBar.position.set(0, 0.42, 0.05)
  gTexts.add(lReal, lFeel, lBar)
  gauge.add(gTexts)
  solids.push(circle(GAUGE.x, GAUGE.z - 0.08, 0.28))
  // the krypton bottle, and its pipe to the bell
  const BOT = { x: CX - 1.95, z: CZ + 0.1 }
  const bottle = new THREE.Group()
  bottle.position.set(BOT.x, 0, BOT.z)
  const bottleMat = keep(new THREE.MeshStandardMaterial({ color: '#25808c', roughness: 0.4, metalness: 0.4 }))
  bottle.add(mk(keep(new THREE.CylinderGeometry(0.17, 0.17, 1.05, 24)), bottleMat, 0, 0.55, 0))
  bottle.add(mk(keep(new THREE.SphereGeometry(0.17, 24, 10, 0, TAU, 0, Math.PI / 2)), bottleMat, 0, 1.075, 0))
  bottle.add(mk(keep(new THREE.CylinderGeometry(0.045, 0.06, 0.12, 12)), stage.mats.brass, 0, 1.3, 0))
  const wheelMat = keep(new THREE.MeshStandardMaterial({ color: '#cc3a2f', roughness: 0.5, emissive: '#000000' }))
  const wheel = mk(keep(new THREE.TorusGeometry(0.075, 0.016, 6, 16)), wheelMat, 0, 1.39, 0)
  wheel.rotation.x = Math.PI / 2
  bottle.add(wheel)
  const bottleSym = text('Kr', { size: 0.2, color: '#ffffff', outlineWidth: 0.008, outlineColor: '#06323a' })
  bottleSym.position.set(0, 0.62, 0.175)
  bottle.add(bottleSym)
  const bottleCap = text(E.chamber.bottle, { font: 'body', size: 0.065, color: '#bfeaf0', anchorY: 'top', maxWidth: 0.8, outlineWidth: 0.004, outlineColor: '#06161a' })
  bottleCap.position.set(0, 0.25, 0.18)
  bottle.add(bottleCap)
  bottle.add(hitBox(0.55, 1.6, 0.55, 0, 0.8, 0))
  root.add(bottle)
  solids.push(circle(BOT.x, BOT.z, 0.3))
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(BOT.x, 1.3, BOT.z),
    new THREE.Vector3(BOT.x, 1.6, BOT.z - 0.1),
    new THREE.Vector3(CX - 1.2, 1.5, CZ - 0.2),
    new THREE.Vector3(CX - 1.0, 0.5, CZ - 0.15),
    new THREE.Vector3(CX - 0.95, 0.15, CZ - 0.05),
  ])
  const pipeMat = keep(new THREE.MeshStandardMaterial({ color: '#3b4048', roughness: 0.4, metalness: 0.5, emissive: '#000000' }))
  root.add(mk(keep(new THREE.TubeGeometry(pipeCurve, 28, 0.022, 8, false)), pipeMat))

  // the numbers: the air's pressure, the narcotic equivalent in bars and metres of air, how giddy
  const eqBar = () => (kr ? P * (0.5 * 7 + 0.5) : P)
  const depthOf = bar => (bar - 1) * 10
  const narc = () => smooth(2.2, 5.0, eqBar())
  const zoneOf = () => (eqBar() < 3.3 ? 0 : eqBar() < 4.8 ? 1 : 2)
  const sumOf = n => (n < 0.22 ? '2 + 2 = 4' : n < 0.5 ? '2 + 2 = 4 ?' : n < 0.88 ? '2 + 2 = 5 ?' : '2 + 2 = 7 ~')
  const chamberPanel = lv => ({
    title: E.chamber.title,
    color: '#7fe6a0',
    blocks: [
      ...paras(E.chamber.panel[depth(lv)]),
      { p: E.chamber.tip },
      {
        slider: {
          label: E.chamber.pressure,
          min: 1,
          max: 5,
          step: 0.05,
          value: P,
          onInput: v => {
            P = v
            bell = true
            lastP = performance.now() / 1000
            slidP()
          },
          format: v => `${num(v, 1, lang)} bar (${Math.round(depthOf(v))} m)`,
          live: () => P,
        },
      },
      {
        buttons: [{ label: kr ? E.chamber.buttons.off : E.chamber.buttons.on, onClick: () => tapBottle() }],
      },
    ],
  })
  let slidingP = false
  const slidP = () => {
    if (slidingP) return
    slidingP = true
    later(0.2, () => {
      slidingP = false
      share('chamber')
    })
  }
  function tapBell() {
    bell = true
    play('select')
    if (!ex.discover('chamber', chamberPanel, 0.2)) ctx.showPanel(chamberPanel)
    say(at(E.chamber.says.calm, level()))
    share('chamber')
  }
  function tapBottle() {
    kr = !kr
    bell = true
    play(kr ? 'beam' : 'tap')
    zoneSaid = zoneOf()
    say(at(kr ? E.chamber.says.kr : E.chamber.says.krOff, level()))
    ex.discover('chamber', chamberPanel, 3.5)
    share('chamber')
  }
  clickable(bellRoot, tapBell, { reach: 7 })
  clickable(bottle, tapBottle, { reach: 7 })
  ex.add({
    id: 'chamber',
    x: CX + 0.3,
    z: -2.2,
    radius: 2.6,
    manual: true,
    label: E.chamber.label,
    verb: () => (bell ? E.chamber.verbBottle : E.chamber.verbBell),
    focus: { x: CX + 0.1, y: 1.55, z: CZ, size: 4.4, width: 5.6 },
    act: () => ctx.showPanel(chamberPanel),
  })
  live(lBar, () => `${num(P, 1, lang)} bar`)
  live(sum, () => sumOf(narc()))
  let needleR = 0
  let needleF = 0
  const bo = new THREE.Object3D()
  updates.push((dt, t) => {
    const n = narc()
    const dR = depthOf(P)
    const dF = depthOf(eqBar())
    needleR = damp(needleR, dR, 5, dt)
    needleF = damp(needleF, dF, 5, dt)
    // the pointer's rest is straight up (angle 0 = up): the dial starts at -135 degrees from up
    pivotR.rotation.z = -(((clamp(needleR, 0, 42) / 40) * 270 - 135) * Math.PI) / 180
    pivotF.rotation.z = -(((clamp(needleF, 0, 42) / 40) * 270 - 135) * Math.PI) / 180
    // the diver sways, the head lolls, the thought bubble wobbles
    const sway = Math.sin(t * 1.4) * 0.22 * n
    diver.rotation.z = sway * 0.5
    diver.rotation.x = Math.sin(t * 0.9 + 1) * 0.12 * n
    head.rotation.z = Math.sin(t * 2.1) * 0.35 * n
    head.rotation.x = Math.sin(t * 1.3) * 0.2 * n
    armL.rotation.z = 0.25 + Math.sin(t * 2.3) * 0.5 * n
    armR.rotation.z = -0.25 - Math.sin(t * 2.0 + 1) * 0.5 * n
    thought.rotation.z = Math.sin(t * 2.6) * 0.14 * n
    thought.position.y = 3.3 + Math.sin(t * 1.9) * 0.05 + Math.sin(t * 5) * 0.03 * n
    sum.rotation.z = Math.sin(t * 6.1) * 0.12 * n
    thought.scale.setScalar(1 + Math.sin(t * 3.3) * 0.04 * n)
    // breath bubbles, smaller at depth
    const size = 0.035 / Math.cbrt(Math.max(1, P))
    bubS.forEach((b, i) => {
      b.y += b.v * dt
      if (b.y > 2.2) b.y = 1.55
      bo.position.set(b.x + Math.sin(t * 2 + b.ph) * 0.05, b.y, 0.2)
      bo.scale.setScalar(size * (0.8 + (b.y - 1.55) * 0.4))
      bo.updateMatrix()
      bubbles.setMatrixAt(i, bo.matrix)
    })
    bubbles.instanceMatrix.needsUpdate = true
    // the krypton: a green haze in the bell, the pipe and the bottle's valve glow
    const k = kr ? 1 : 0
    gasTint.material.opacity = damp(gasTint.material.opacity, k * 0.16, 2.5, dt)
    const kk = damp(pipeMat.userData.k ?? 0, k, 3, dt)
    pipeMat.userData.k = kk
    pipeMat.emissive.set('#2ee06a').multiplyScalar(kk)
    wheelMat.emissive.set('#ff5a3f').multiplyScalar(kk * 0.7)
    wheel.rotation.z = kk * 1.6
    // the Atomling remarks when the slider comes to rest in a new zone
    const now = performance.now() / 1000
    if (bell && now - lastP > 0.7 && lastP > 0) {
      const z = zoneOf()
      if (z !== zoneSaid) {
        zoneSaid = z
        say(at(z === 0 ? E.chamber.says.calm : z === 1 ? E.chamber.says.narc : E.chamber.says.deep, level()))
      }
    }
  })
  const chamberState = () => ({ p: Math.round(P * 20) / 20, kr: kr ? 1 : 0 })
  const chamberSet = (s, liveSet) => {
    const v = Number(s?.p)
    if (Number.isFinite(v)) P = clamp(v, 1, 5)
    kr = !!s?.kr
    zoneSaid = zoneOf()
    if (liveSet) bell = true
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 9.0 },
    spawn: { x: 0, z: 5.2, yaw: 0 },
    hostSpot: { x: 1.8, z: 4.4, yaw: Math.atan2(1.8, -0.8) },
    back: { x: 0, z: 9.5, rot: Math.PI },
    stand: { x: -4.8, z: 2.8, rot: Math.atan2(4.8, 2.4) },
    parts: {
      recipe: {
        tile: i => tapTile(i),
        crystals: () => tapCrystals(),
        jadarite: () => tapJadarite(),
        all: () => lightAll(),
        get lit() { return maskOf() },
        get lens() { return lensOn },
        get battery() { return batT },
        get flicker() { return flick },
      },
      flask: {
        flask: () => tapFlask(),
        dewar: () => tapDewar(),
        setT: v => { T = clamp(v, T_MIN, T_MAX); manual = true; hold = 0; lastSlide = performance.now() / 1000 },
        get T() { return T },
        get state() { return stateOf(T) },
        get dipped() { return dipped },
        get lens() { return flaskLens },
      },
      chamber: {
        bell: () => tapBell(),
        bottle: () => tapBottle(),
        setP: v => { P = clamp(v, 1, 5); bell = true; lastP = performance.now() / 1000 },
        get P() { return P },
        get kr() { return kr },
        get narc() { return narc() },
      },
    },
    panels: { recipe: recipePanel, flask: flaskPanel, chamber: chamberPanel },
    shared: {
      recipe: { get: recipeState, set: recipeSet },
      flask: { get: flaskState, set: flaskSet },
      chamber: { get: chamberState, set: chamberSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const o of own) o.dispose?.()
    },
  }
}

