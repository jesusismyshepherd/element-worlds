// Krypton's picture "How long is a metre, really?" as a room (docs/knowledge/picture-rooms.md): a length
// laboratory like the BIPM's at Sèvres around 1960 (the metrology stage): granite tables on stone piers,
// a vault door, windows onto the park at dusk. Three tables, three metres, each worked by touching its
// things; E opens the station's panel, whose slider and buttons do the same:
// - 1889, the old metre: tap the case (the lid opens), tap the bar (a microscope swings over its line and
//   the screen shows the fine engraved line), tap the X-shaped end (the section lights, the line lies in
//   its neutral plane), tap the thermometer to open the panel's temperature slider: the platinum-iridium
//   bar grows 8.6 micrometres for every degree (drawn 150 times too big on the table; the microscope
//   screen is true to size);
// - 1960, counting waves: tap the cold bath (liquid nitrogen at its triple point, 63 K: the lamp frosts),
//   tap the lamp (krypton-86's orange-red line), tap the motor (or slide the mirror in the panel) and the
//   rings in a Michelson interferometer sweep past while a counter counts the waves: a whole metre of
//   travel is 1,650,763.73 of them, and the carriage meets the second line of a copy of the bar;
// - 1983, light's own ruler: tap the laser, a pulse crosses a metre (slowed a billion times: 3.34 s, the
//   clock in nanoseconds), tap the Earth or slide the time (1 ns to 1 s) and light's path winds round the
//   globe, seven and a half times in a second.
// All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, num, standingScreen } from '../../../wings/noble/kit.js'
import { metrologyStage } from '../../stages/metrology.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { METRE_WORDS } from './metre.words.js'

export const WORDS = METRE_WORDS

const TAU = Math.PI * 2
const TOP = 0.92 // the tables' top
const WAVES = 1650763.73 // krypton-86 wavelengths in a metre (11th CGPM, 1960)
const ALPHA = 8.6e-6 // platinum-iridium (90/10): growth per kelvin and metre
const EXAG = 150 // the bar's growth is drawn this many times too big
const C = 299792458 // m/s
const EARTH = 40075017 // the equator, m
const GLOW = '#ff7a3c'
const ORANGE = '#ff6a2a'

/** A number in groups of three digits and the language's decimal mark (the BIPM's way, a space between). */
const grp = (v, digits, lang) => {
  const [i, f] = Math.abs(v).toFixed(digits).split('.')
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : ' ')
  return (v < 0 ? '−' : '') + g + (f ? (lang === 'en' ? '.' : ',') + f : '')
}

/** The Earth's map (equirectangular): the real coastlines, as silicon's solar room draws it. */
function earthTexture() {
  return canvasTex(1024, 512, (g, w, h) => {
    const X = lon => ((lon + 180) / 360) * w
    const Y = lat => ((90 - lat) / 180) * h
    g.fillStyle = '#1d5596'
    g.fillRect(0, 0, w, h)
    const land = new Path2D()
    for (const ring of LAND) {
      let lon = ring[0]
      let lat = ring[1]
      land.moveTo(X(lon / 5), Y(lat / 5))
      for (let i = 2; i < ring.length; i += 2) {
        lon += ring[i]
        lat += ring[i + 1]
        land.lineTo(X(lon / 5), Y(lat / 5))
      }
      land.closePath()
    }
    g.fillStyle = '#4c8a3a'
    g.fill(land, 'evenodd')
    g.fillStyle = '#c4d2da'
    g.fillRect(0, Y(90), w, Y(74) - Y(90))
    g.fillRect(0, Y(-64), w, Y(-90) - Y(-64))
  })
}

/** The bar's X-shaped section (Tresca's), s = half its width. */
function xShape(s) {
  const P = [[-1, 1], [-0.55, 1], [-0.28, 0.38], [0.28, 0.38], [0.55, 1], [1, 1], [1, 0.8], [0.36, 0.06], [0.36, -0.06], [1, -0.8], [1, -1], [0.55, -1], [0.28, -0.38], [-0.28, -0.38], [-0.55, -1], [-1, -1], [-1, -0.8], [-0.36, -0.06], [-0.36, 0.06], [-1, 0.8]]
  const sh = new THREE.Shape()
  P.forEach(([x, y], i) => (i ? sh.lineTo(x * s, y * s) : sh.moveTo(x * s, y * s)))
  sh.closePath()
  return sh
}
/** A bar of that section, `len` long from x = 0 to x = len. */
const xBar = (len, s) => new THREE.ExtrudeGeometry(xShape(s), { depth: len, bevelEnabled: false }).rotateY(Math.PI / 2)

/** An invisible box the tap ray still hits (thin things need one). */
const hitBox = (w, h, d, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  return m
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, lang, color, clickable }) {
  const X0 = -9.5
  const X1 = 9.5
  const Z0 = -7.5
  const Z1 = 9.2
  const C1 = { x: -5.2, z: -0.6 }
  const C2 = { x: 0, z: -3.4 }
  const C3 = { x: 5.2, z: -0.6 }
  const stage = metrologyStage({ x0: X0, x1: X1, z0: Z0, z1: Z1, light, lamps: [{ x: C1.x, z: C1.z + 0.2 }, { x: C2.x, z: C2.z + 0.2, intensity: 8 }, { x: C3.x, z: C3.z + 0.2 }, { x: 0, z: 3, optional: true, intensity: 5 }] })
  root.add(stage.group)
  const solids = stage.solids
  const mats = stage.mats
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const tex = t => (textures.push(t), t)
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = list => list.map(p => ({ p }))
  // a panel already open is written again when what it shows changed
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still there. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  // a slider moves many times a second: the others get it a few times a second, and where it stopped
  const pending = {}
  const shareSoon = id => {
    if (pending[id]) return
    pending[id] = true
    later(0.15, () => {
      pending[id] = false
      share(id)
    })
  }
  // what the Atomling says once a slider has rested
  const settleTimers = {}
  const settleSay = (id, fn) => {
    settleTimers[id] = { t: 0.9, fn }
  }

  // shared materials (few kinds, so few shaders to compile)
  const barMat = new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.34, metalness: 0.55 })
  const lineMat = new THREE.MeshStandardMaterial({ color: ORANGE, emissive: ORANGE, emissiveIntensity: 1.3, roughness: 0.5 })
  const dotMat = new THREE.MeshBasicMaterial({ color: '#ffb48a' })

  const station = (c, w, d) => {
    const g = new THREE.Group()
    g.position.set(c.x, 0, c.z)
    root.add(g)
    g.add(stage.granite(w, d, TOP))
    solids.push(box(c.x, c.z, w, d, { y1: TOP }))
    return g
  }
  /** A brass card on the table's front edge: the year and the station's name. */
  const plaque = (g, x, z, year, name) => {
    const card = new THREE.Group()
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.17, 0.014, 2, 0.006), mats.dark)
    card.add(plate)
    const y = makeText(year, { size: 0.07, color: '#ffd166', maxWidth: 0.7, anchorY: 'middle' })
    y.position.set(0, 0.035, 0.009)
    const n = makeText(name, { font: 'body', size: 0.04, color: '#e8e0d0', maxWidth: 0.72, anchorY: 'middle' })
    n.position.set(0, -0.043, 0.009)
    card.add(y, n)
    card.position.set(x, TOP + 0.085, z)
    card.rotation.x = -0.5
    g.add(card)
  }
  const worldAt = (g, x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))

  // =================================================================================================
  // 1889: the old metre
  // =================================================================================================
  const t1 = station(C1, 3.2, 0.9)
  plaque(t1, -1.12, 0.42, '1889', E.bar.label)
  const CASE = { w: 1.3, d: 0.34, h: 0.1 }
  const BL = -0.51 // the bar's left end
  const REF_L = BL + 0.01 // the two reference ticks, a metre apart
  const REF_R = REF_L + 1
  const S1 = 0.03 // the bar's section is drawn 3 cm across (the real one is 2 cm: not to scale)
  const CUSHION = 0.05
const Y_BAR = TOP + 0.031 + CUSHION + 0.036 + S1
  const caseG = new THREE.Group()
  caseG.position.set(0, TOP, 0)
  t1.add(caseG)
  {
    const wall = (w, h, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.wood)
      m.position.set(x, y, z)
      caseG.add(m)
    }
    wall(CASE.w, 0.03, CASE.d, 0, 0.015, 0)
    wall(CASE.w, CASE.h, 0.03, 0, CASE.h / 2, CASE.d / 2 - 0.015)
    wall(CASE.w, CASE.h, 0.03, 0, CASE.h / 2, -CASE.d / 2 + 0.015)
    wall(0.03, CASE.h, CASE.d, CASE.w / 2 - 0.015, CASE.h / 2, 0)
    wall(0.03, CASE.h, CASE.d, -CASE.w / 2 + 0.015, CASE.h / 2, 0)
    const velvet = new THREE.Mesh(new THREE.PlaneGeometry(CASE.w - 0.06, CASE.d - 0.06), mats.velvet)
    velvet.rotation.x = -Math.PI / 2
    velvet.position.y = 0.031
    caseG.add(velvet)
    // two rollers the bar rests on, and the reference ticks on the velvet beside it
    for (const x of [-0.29, 0.29]) {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.1, CUSHION, 0.2), mats.velvet)
      cushion.position.set(x, 0.031 + CUSHION / 2, 0)
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 14), mats.steel)
      roller.rotation.x = Math.PI / 2
      roller.position.set(x, 0.031 + CUSHION + 0.018, 0)
      caseG.add(cushion, roller)
    }
    for (const x of [REF_L, REF_R]) {
      // a brass index post by the bar, with a fine flag over where the line should be
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), mats.brass)
      post.position.set(x, 0.031 + 0.08, 0.12)
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.004, 0.09), mats.brass)
      flag.position.set(x, 0.031 + 0.16, 0.075)
      caseG.add(post, flag)
    }
  }
  const lidG = new THREE.Group()
  lidG.position.set(0, CASE.h, -CASE.d / 2)
  {
    const lid = new THREE.Mesh(new THREE.BoxGeometry(CASE.w, 0.03, CASE.d), mats.wood)
    lid.position.set(0, 0.015, CASE.d / 2)
    lidG.add(lid)
    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), mats.brass)
    clasp.position.set(0, 0.015, CASE.d - 0.01)
    lidG.add(clasp)
    caseG.add(lidG)
  }
  // the bar (its X-shaped end towards the viewer's right), and the two engraved lines
  const bar = new THREE.Group()
  bar.position.set(BL, Y_BAR, 0)
  t1.add(bar)
  const barMesh = new THREE.Mesh(xBar(1.02, S1), barMat)
  bar.add(barMesh)
  bar.add(hitBox(1.1, 0.12, 0.14, 0.51, 0.02, 0))
  const lineL = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.06), lineMat)
  const lineR = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.06), lineMat)
  lineL.position.set(REF_L, Y_BAR + S1 * 0.38 + 0.001, 0)
  lineR.position.set(REF_R, Y_BAR + S1 * 0.38 + 0.001, 0)
  t1.add(lineL, lineR)

  // the microscope: a column right of the case, an arm that swings over the bar's right end
  const scopeG = new THREE.Group()
  scopeG.position.set(0.95, TOP, 0)
  t1.add(scopeG)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.04, 20), mats.dark)
  base.position.y = 0.02
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.7, 12), mats.brass)
  column.position.y = 0.38
  scopeG.add(base, column)
  const arm = new THREE.Group()
  arm.position.y = 0.7
  scopeG.add(arm)
  const armBar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.035, 0.035), mats.brass)
  armBar.position.set(-0.22, 0, 0)
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.26, 16), mats.dark)
  tube.position.set(-0.45, -0.14, 0)
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 14), new THREE.MeshStandardMaterial({ color: '#cfe9ff', emissive: '#6aa6ff', emissiveIntensity: 0.6, roughness: 0.1 }))
  lens.position.set(-0.45, -0.28, 0)
  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.2, 12), mats.dark)
  eyepiece.position.set(-0.45, 0.07, 0)
  arm.add(armBar, tube, lens, eyepiece)
  // the light the objective sends down onto the line
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.03, 0.42 - 0.1, 14, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe2b0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))
  cone.position.set(-0.45, -0.28 - 0.16, 0)
  arm.add(cone)

  // the screen beside the case: the microscope's view, the line against the reference tick
  const scopeScreen = standingScreen({ width: 0.92, height: 0.78, color, title: E.bar.screen, line: '', titleSize: 0.075, lineSize: 0.055 }, { top: 0.5, tilt: 0.22, mat: mats.dark })
  scopeScreen.group.position.set(-1.12, TOP, 0.12)
  t1.add(scopeScreen.group)
  const scopeTex = tex(canvasTex(256, 128, null, { mipmaps: false }))
  const scopePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), new THREE.MeshBasicMaterial({ map: scopeTex, toneMapped: false }))
  scopePlane.position.set(0, -0.06, 0.003)
  scopeScreen.content.add(scopePlane)
  let scopeDrawn = null
  const drawScope = (on, off) => {
    const key = `${on}|${off.toFixed(1)}`
    if (key === scopeDrawn) return
    scopeDrawn = key
    scopeTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#10131c'
      g.fillRect(0, 0, w, h)
      if (!on) {
        g.fillStyle = '#4a5578'
        g.fillRect(w / 2 - 14, h / 2 - 2, 28, 4)
        return
      }
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#c4cad4')
      grd.addColorStop(0.5, '#e6eaf0')
      grd.addColorStop(1, '#b2b9c5')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      const px = um => w / 2 + um * (w / 2 / 400) // the field: 400 micrometres each side
      // fine scratches along the metal, the engraved line, its edges
      g.fillStyle = 'rgba(80,86,98,0.18)'
      for (let y = 6; y < h; y += 9) g.fillRect(0, y, w, 1)
      const x = px(clamp(off, -390, 390))
      g.fillStyle = '#2b2018'
      g.fillRect(x - 3, 0, 6, h)
      g.fillStyle = 'rgba(255,120,60,0.5)'
      g.fillRect(x - 1, 0, 2, h)
      // the reference tick: a cyan hairline with a mark at the top and the bottom
      g.fillStyle = '#17b4d6'
      g.fillRect(w / 2 - 1, 0, 2, h)
      g.fillRect(w / 2 - 7, 0, 14, 3)
      g.fillRect(w / 2 - 7, h - 3, 14, 3)
      // a ruler along the bottom: a tick every 100 micrometres
      g.fillStyle = '#262c3a'
      for (let um = -400; um <= 400; um += 100) g.fillRect(px(um) - 1, h - 14, 2, um === 0 ? 14 : 9)
    })
  }

  // the X-shaped end, made big, on a plinth: its section lights when tapped
  const xG = new THREE.Group()
  xG.position.set(1.38, TOP, 0.02)
  t1.add(xG)
  const xPlinth = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.05, 0.16, 2, 0.01), mats.dark)
  xPlinth.position.y = 0.025
  const xMat = new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.34, metalness: 0.55, emissive: '#ff6a2a', emissiveIntensity: 0 })
  const xBig = new THREE.Mesh(new THREE.ExtrudeGeometry(xShape(0.12), { depth: 0.1, bevelEnabled: false }).translate(0, 0, -0.05), xMat)
  xBig.position.y = 0.05 + 0.12
  const xBand = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.012, 0.105), new THREE.MeshBasicMaterial({ color: '#ffd9a8', transparent: true, opacity: 0 }))
  xBand.position.y = xBig.position.y
  xG.add(xPlinth, xBig, xBand)

  // the thermometer by the column
  const thermo = new THREE.Group()
  thermo.position.set(0.76, TOP, 0.3)
  t1.add(thermo)
  {
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.012), mats.wood)
    board.position.y = 0.27
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8), new THREE.MeshStandardMaterial({ color: '#dfe9f2', transparent: true, opacity: 0.55, roughness: 0.1 }))
    glass.position.set(0, 0.29, 0.012)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 8), new THREE.MeshBasicMaterial({ color: '#d63a2a' }))
    bulb.position.set(0, 0.075, 0.012)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.08), mats.wood)
    foot.position.y = 0.01
    thermo.add(board, glass, bulb, foot)
    thermo.add(hitBox(0.14, 0.56, 0.1, 0, 0.28, 0.04))
  }
  const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 1, 8), new THREE.MeshBasicMaterial({ color: '#d63a2a' }))
  mercury.position.set(0, 0.075, 0.012)
  thermo.add(mercury)

  // state
  const B = { lid: false, scope: false, x: false, T: 20, shown: 20, lidK: 0, scopeK: 0, xK: 0, said: 20 }
  const um = () => 1e6 * ALPHA * B.T // micrometres longer than a metre
  const umShown = () => 1e6 * ALPHA * B.shown
  const barHint = () => {
    const H = E.bar.hints
    if (!B.lid) return H.case
    if (!B.scope) return H.bar
    if (!B.x) return H.x
    return Math.abs(B.T - 20) < 1 ? H.temp : H.done
  }
  const barPanel = lv => ({
    title: E.bar.title,
    color,
    blocks: [
      ...paras(E.bar.panel[depth(lv)]),
      { p: E.bar.tip },
      {
        slider: {
          label: E.bar.temp,
          min: -10,
          max: 40,
          step: 0.5,
          value: B.T,
          onInput: v => {
            B.T = v
            shareSoon('bar')
            settleSay('bar', barWords)
          },
          format: v => `${num(v, 1, lang)} °C`,
          live: () => B.T,
        },
      },
      {
        buttons: [
          { label: E.bar.buttons.case, onClick: () => tapCase() },
          { label: E.bar.buttons.scope, onClick: () => tapBar() },
          { label: E.bar.buttons.x, onClick: () => tapX() },
        ],
      },
    ],
  })
  const barWords = () => {
    if (Math.abs(B.T - B.said) < 1) return
    B.said = B.T
    const key = B.T > 0.5 ? 'warm' : B.T < -0.5 ? 'cold' : 'zero'
    say(fill(at(E.bar.says[key], level()), { t: num(B.T, 0, lang), um: grp(Math.abs(Math.round(um())), 0, lang) }))
  }
  const setLid = v => {
    B.lid = v
    if (!v) B.scope = false
  }
  const tapCase = () => {
    setLid(!B.lid)
    play('select')
    say(at(B.lid ? E.bar.says.open : E.bar.says.close, level()))
    share('bar')
    refresh(barPanel)
  }
  const tapBar = () => {
    if (!B.lid) return
    B.scope = !B.scope
    play(B.scope ? 'beam' : 'tap')
    say(at(B.scope ? E.bar.says.scope : E.bar.says.away, level()))
    share('bar')
    if (B.scope) findOnce('bar', barPanel, 2.4)
  }
  const tapX = () => {
    B.x = !B.x
    play(B.x ? 'select' : 'tap')
    say(at(B.x ? E.bar.says.x : E.bar.says.xoff, level()))
    share('bar')
  }
  const tapThermo = () => {
    play('tap')
    ctx.showPanel(barPanel)
  }
  ex.add({
    id: 'bar',
    x: C1.x,
    z: C1.z + 1.7,
    radius: 2.3,
    label: E.bar.label,
    verb: barHint,
    manual: true,
    focus: { x: C1.x + 0.1, y: TOP + 0.25, z: C1.z, size: 2.8, width: 3.7 },
    act: () => ctx.showPanel(barPanel),
  })
  clickable(caseG, tapCase, { reach: 5.5 })
  clickable(bar, tapBar, { when: () => B.lid, reach: 5.5 })
  clickable(xG, tapX, { reach: 5.5 })
  clickable(thermo, tapThermo, { reach: 5.5 })

  const lineTmp = new THREE.Vector3()
  let scopeWait = 0
  updates.push((dt, t) => {
    B.lidK = damp(B.lidK, B.lid ? 1 : 0, 4, dt)
    B.scopeK = damp(B.scopeK, B.scope ? 1 : 0, 3.2, dt)
    B.xK = damp(B.xK, B.x ? 1 : 0, 4, dt)
    B.shown = damp(B.shown, B.T, 7, dt)
    lidG.rotation.x = -1.95 * ease(B.lidK)
    const e = ease(B.scopeK)
    arm.rotation.y = lerp(-Math.PI / 2, 0, e)
    // the arm lifts while it swings, over the open lid
    arm.position.y = 0.7 + 0.22 * Math.sin(Math.PI * clamp(e)) * (e > 0.001 && e < 0.999 ? 1 : 0)
    cone.material.opacity = 0.32 * clamp((e - 0.9) * 10)
    // the bar grows (drawn too big), its right line with it; the left end stays
    const k = 1 + 1e-6 * umShown() * EXAG
    barMesh.scale.x = (k + 0.02) / 1.02
    lineR.position.x = REF_L + k
    // the thermometer's column
    mercury.scale.y = Math.max(0.01, 0.06 + (0.32 * (B.shown + 10)) / 50)
    mercury.position.y = 0.075 + mercury.scale.y / 2
    // the X lights
    xMat.emissiveIntensity = 0.55 * B.xK * (0.85 + 0.15 * Math.sin(t * 3))
    xBand.material.opacity = 0.9 * B.xK
    lineMat.emissiveIntensity = 1.1 + 0.5 * Math.sin(t * 3) * B.scopeK
    // the screen and its reading, a few times a second
    scopeWait -= dt
    if (scopeWait <= 0) {
      scopeWait = 0.12
      drawScope(B.scope && B.lidK > 0.9, umShown())
      const v = Math.round(um())
      const key = v === 0 ? 'exact' : v > 0 ? 'long' : 'short'
      const line = fill(E.bar.reading[key], { t: num(B.T, 1, lang), um: grp(Math.abs(v), 0, lang) })
      scopeScreen.set({ line })
    }
  })

  // =================================================================================================
  // 1960: counting waves
  // =================================================================================================
  const t2 = station(C2, 3.4, 1.0)
  plaque(t2, -1.1, 0.45, '1960', E.waves.label)
  const BEAM_Y = TOP + 0.16
  const BS_X = -0.55
  const M0 = -0.25 // the moving mirror at the start of its metre
  const FIX_Z = 0.34 // the fixed mirror stands in front, the screens behind the bench
  // the cryostat: liquid nitrogen at its triple point round the krypton lamp
  const cryo = new THREE.Group()
  cryo.position.set(-1.4, TOP, -0.12)
  t2.add(cryo)
  const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.82, 28), mats.steel)
  flask.position.y = 0.41
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 28), mats.steel)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.82
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 20), mats.dark)
  neck.position.y = 0.85
  const frostTex = tex(canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w)
    for (let i = 0; i < 520; i++) {
      g.fillStyle = `rgba(225,238,250,${0.12 + Math.random() * 0.35})`
      const r = 2 + Math.random() * 5
      g.beginPath()
      g.arc(Math.random() * w, Math.random() * w, r, 0, TAU)
      g.fill()
    }
  }, { repeat: true }))
  frostTex.repeat.set(3, 2)
  const frostMat = new THREE.MeshStandardMaterial({ map: frostTex, transparent: true, opacity: 0, depthWrite: false, roughness: 0.9, color: '#dfeaf4' })
  const frost = new THREE.Mesh(new THREE.CylinderGeometry(0.176, 0.176, 0.82, 28, 1, true), frostMat)
  frost.position.y = 0.41
  cryo.add(flask, rim, neck, frost)
  cryo.add(hitBox(0.4, 0.95, 0.4, 0, 0.45, 0))
  const tempText = makeText('', { size: 0.07, color: '#bfe6ff', maxWidth: 0.3 })
  tempText.position.set(0, 0.55, 0.178)
  cryo.add(tempText)
  // the lamp: a brass head low on the flask, an orange-red window at its end
  const lampHead = new THREE.Group()
  lampHead.position.set(-1.4, 0, -0.12)
  t2.add(lampHead)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.1), mats.brass)
  head.position.set(0.28, BEAM_Y, 0)
  const lensMat = new THREE.MeshStandardMaterial({ color: '#7a2a14', emissive: ORANGE, emissiveIntensity: 0.05, roughness: 0.3 })
  const lampLens = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 18), lensMat)
  lampLens.rotation.z = Math.PI / 2
  lampLens.position.set(0.455, BEAM_Y, 0)
  lampHead.add(head, lampLens)
  lampHead.add(hitBox(0.4, 0.16, 0.16, 0.3, BEAM_Y, 0))
  const lampGlow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), new THREE.MeshBasicMaterial({ color: '#ff7a3a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  lampGlow.position.set(0.47, BEAM_Y, 0)
  lampHead.add(lampGlow)
  let lensX = -1.4 + 0.47 // where the beam starts, on the table

  // the interferometer: beam splitter, fixed mirror, the carriage's mirror on its rail
  const mirrorGeo = new THREE.BoxGeometry(0.012, 0.08, 0.08)
  const mirrorMat = new THREE.MeshStandardMaterial({ color: '#7d8694', roughness: 0.3, metalness: 0.6 })
  const bs = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: '#bfe0ff', transparent: true, opacity: 0.35, roughness: 0.05 }))
  bs.position.set(BS_X, BEAM_Y, 0)
  const bsPlate = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.08, 0.113), mirrorMat)
  bsPlate.position.copy(bs.position)
  bsPlate.rotation.y = Math.PI / 4
  const fixed = new THREE.Mesh(mirrorGeo, mirrorMat)
  fixed.rotation.y = Math.PI / 2
  fixed.position.set(BS_X, BEAM_Y, FIX_Z)
  const post = (x, z) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, BEAM_Y - TOP, 10), mats.dark)
    p.position.set(x, TOP + (BEAM_Y - TOP) / 2 - 0.04, z)
    t2.add(p)
  }
  post(BS_X, 0)
  post(BS_X, FIX_Z)
  t2.add(bs, bsPlate, fixed)
  // the rail, the lead screw and the carriage
  const rail = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.04, 0.12, 2, 0.01), mats.steel)
  rail.position.set(0.5, TOP + 0.02, 0)
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.5, 8), mats.brass)
  screw.rotation.z = Math.PI / 2
  screw.position.set(0.45, TOP + 0.06, -0.035)
  t2.add(rail, screw)
  const carriage = new THREE.Group()
  t2.add(carriage)
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.09, 0.14, 2, 0.01), mats.dark)
    body.position.set(0.1, TOP + 0.085, 0)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, BEAM_Y - TOP - 0.08, 8), mats.dark)
    stand.position.set(0, TOP + 0.08 + (BEAM_Y - TOP - 0.08) / 2, 0)
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat)
    mirror.position.set(0, BEAM_Y, 0)
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.004, 0.24), lineMat)
    needle.position.set(0, TOP + 0.14, 0.17)
    carriage.add(body, stand, mirror, needle)
  }
  const motor = new THREE.Group()
  motor.position.set(1.42, TOP, 0)
  t2.add(motor)
  {
    const mb = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.2, 0.22, 3, 0.02), mats.dark)
    mb.position.y = 0.1
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 20), mats.brass)
    wheel.position.set(-0.05, 0.1, 0.12)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), mats.brass)
    knob.position.set(-0.05, 0.175, 0.12)
    motor.add(mb, wheel, knob)
    motor.add(hitBox(0.36, 0.26, 0.28, 0, 0.12, 0.03))
    motor.userData.wheel = wheel
  }
  // the copy of the bar by the rail: its two lines a metre apart, the carriage's needle points at them
  {
    const trough = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.03, 0.12), mats.wood)
    trough.position.set(M0 + 0.5, TOP + 0.015, 0.2)
    const copy = new THREE.Mesh(xBar(1.02, 0.02), barMat)
    copy.position.set(M0 - 0.01, TOP + 0.03 + 0.02, 0.2)
    t2.add(trough, copy)
  }
  const copyL = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.04), lineMat)
  copyL.position.set(M0, TOP + 0.03 + 0.02 + 0.0085, 0.2)
  const copyR = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.04), lineMat.clone())
  copyR.position.set(M0 + 1, TOP + 0.03 + 0.02 + 0.0085, 0.2)
  t2.add(copyL, copyR)
  // light: thin glowing beams along the paths
  const beamMat = new THREE.MeshBasicMaterial({ color: '#ff7a3a', transparent: true, opacity: 0, depthWrite: false })
  const beamGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 1, 6, 1, true)
  const mkBeam = axis => {
    const m = new THREE.Mesh(beamGeo, beamMat)
    if (axis === 'x') m.rotation.z = Math.PI / 2
    else m.rotation.x = Math.PI / 2
    t2.add(m)
    return m
  }
  const beamIn = mkBeam('x') // lamp to the splitter
  const beamMove = mkBeam('x') // splitter to the moving mirror (and back)
  const beamFix = mkBeam('z') // splitter to the fixed mirror
  const beamOut = mkBeam('z') // splitter to the screen
  const setBeam = (m, axis, a, b, y = BEAM_Y, other = 0) => {
    const len = Math.max(0.001, Math.abs(b - a))
    m.scale.y = len
    if (axis === 'x') m.position.set((a + b) / 2, y, other)
    else m.position.set(other, y, (a + b) / 2)
  }
  // the screen of rings and the counter
  const ringScreen = standingScreen({ width: 0.8, height: 0.86, color, title: E.waves.screen, line: '', titleSize: 0.075, lineSize: 0.05 }, { top: 0.55, tilt: 0.25, mat: mats.dark })
  ringScreen.group.position.set(BS_X, TOP, -0.36)
  t2.add(ringScreen.group)
  const ringTex = tex(canvasTex(96, 96, null, { mipmaps: false }))
  const ringPlane = new THREE.Mesh(new THREE.CircleGeometry(0.28, 40), new THREE.MeshBasicMaterial({ map: ringTex, toneMapped: false }))
  ringPlane.position.set(0, -0.08, 0.003)
  ringScreen.content.add(ringPlane)
  const counter = standingScreen({ width: 1.1, height: 0.6, color, title: E.waves.counterTitle, line: '', titleSize: 0.075, lineSize: 0.062 }, { top: 0.38, tilt: 0.25, mat: mats.dark })
  counter.group.position.set(0.72, TOP, -0.36)
  t2.add(counter.group)
  const drawRings = (phase, contrast, on) => {
    ringTex.userData.redraw((g, w, h) => {
      const img = g.createImageData(w, h)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = (x + 0.5) / w - 0.5
          const dy = (y + 0.5) / h - 0.5
          const r2 = (dx * dx + dy * dy) * 4
          const i = (y * w + x) * 4
          const inside = r2 <= 1
          const I = on && inside ? 0.5 + 0.5 * contrast * Math.cos(TAU * (6 * r2 - phase)) : 0
          img.data[i] = 255 * I
          img.data[i + 1] = 105 * I
          img.data[i + 2] = 38 * I
          img.data[i + 3] = 255
        }
      }
      g.putImageData(img, 0, 0)
    })
  }

  const Wv = { cold: false, lamp: false, d: 0, dT: 0, coldK: 0, lampK: 0, K: 295, spd: 0, atEnd: false, drawn: '' }
  const coldTemp = 63.15 // nitrogen's triple point
  const fringes = () => 2 * Wv.d * WAVES // a fringe for every half wave of the mirror's travel
  const wavesHint = () => {
    const H = E.waves.hints
    if (!Wv.cold) return H.cryo
    if (!Wv.lamp) return H.lamp
    if (Math.abs(Wv.dT - Wv.d) > 0.0005) return H.watch
    return Wv.dT > 0.5 ? H.back : H.motor
  }
  const wavesPanel = lv => ({
    title: E.waves.title,
    color,
    blocks: [
      ...paras(E.waves.panel[depth(lv)]),
      { p: E.waves.tip },
      {
        slider: {
          label: E.waves.mirror,
          min: 0,
          max: 1,
          step: 0.001,
          value: Wv.d,
          onInput: v => {
            Wv.d = v
            Wv.dT = v
            shareSoon('waves')
          },
          format: v => `${num(v, 3, lang)} m`,
          live: () => Wv.d,
        },
      },
      {
        buttons: [
          { label: E.waves.buttons.cryo, onClick: () => tapCryo() },
          { label: E.waves.buttons.lamp, onClick: () => tapLamp() },
          { label: E.waves.buttons.motor, onClick: () => tapMotor() },
        ],
      },
    ],
  })
  const tapCryo = () => {
    Wv.cold = !Wv.cold
    play(Wv.cold ? 'beam' : 'tap')
    say(at(Wv.cold ? E.waves.says.cold : E.waves.says.warm, level()))
    share('waves')
  }
  const tapLamp = () => {
    Wv.lamp = !Wv.lamp
    play(Wv.lamp ? 'select' : 'tap')
    const s = Wv.lamp ? (Wv.cold ? E.waves.says.lamp : E.waves.says.lampWarm) : E.waves.says.lampOff
    say(at(s, level()))
    share('waves')
    if (Wv.lamp) findOnce('waves', wavesPanel, 2.2)
  }
  const tapMotor = () => {
    if (Math.abs(Wv.dT - Wv.d) > 0.0005) return
    Wv.dT = Wv.dT > 0.5 ? 0 : 1
    play('beam')
    say(at(Wv.dT > 0.5 ? E.waves.says.motor : E.waves.says.back, level()))
    share('waves')
  }
  ex.add({
    id: 'waves',
    x: C2.x,
    z: C2.z + 1.9,
    radius: 2.4,
    label: E.waves.label,
    verb: wavesHint,
    manual: true,
    focus: { x: C2.x + 0.0, y: TOP + 0.3, z: C2.z, size: 2.5, width: 3.6 },
    act: () => ctx.showPanel(wavesPanel),
  })
  clickable(cryo, tapCryo, { reach: 6.5 })
  clickable(lampHead, tapLamp, { reach: 6.5 })
  clickable(motor, tapMotor, { reach: 6.5 })
  clickable(carriage, tapMotor, { reach: 6.5 })

  let ringWait = 0
  let counterWait = 0
  let lastK = -1
  updates.push((dt, t) => {
    Wv.coldK = damp(Wv.coldK, Wv.cold ? 1 : 0, 0.9, dt)
    Wv.lampK = damp(Wv.lampK, Wv.lamp ? 1 : 0, 6, dt)
    Wv.K = lerp(295, coldTemp, ease(Wv.coldK))
    // the carriage runs to where it was sent
    const diff = Wv.dT - Wv.d
    const before = Wv.d
    if (Math.abs(diff) > 1e-6) Wv.d += Math.sign(diff) * Math.min(Math.abs(diff), 0.18 * dt)
    Wv.spd = damp(Wv.spd, Math.abs(Wv.d - before) / Math.max(dt, 1e-3), 8, dt)
    carriage.position.x = M0 + Wv.d
    motor.userData.wheel.rotation.z = (Wv.d * 40) % TAU
    // frost and the lamp
    frostMat.opacity = 0.9 * clamp(Wv.coldK * 1.3)
    flask.material.emissiveIntensity = 0
    lensMat.emissiveIntensity = 0.05 + 2.4 * Wv.lampK * (0.7 + 0.3 * Wv.coldK)
    lampGlow.material.opacity = 0.55 * Wv.lampK
    // the beams
    beamMat.opacity = 0.95 * Wv.lampK
    setBeam(beamIn, 'x', lensX, BS_X - 0.04)
    setBeam(beamMove, 'x', BS_X + 0.04, M0 + Wv.d - 0.006)
    setBeam(beamFix, 'z', 0.04, FIX_Z - 0.006, BEAM_Y, BS_X)
    setBeam(beamOut, 'z', -0.34, -0.04, BEAM_Y, BS_X)
    // the needle meets the second line at a whole metre
    const meet = Math.abs(Wv.d - 1) < 0.0015
    copyR.material.emissiveIntensity = meet ? 3.2 : 1.3
    if (meet && !Wv.atEnd && Wv.lamp) {
      Wv.atEnd = true
      play('discover')
      say(at(E.waves.says.end, level()))
    }
    if (Math.abs(Wv.d - 1) > 0.02) Wv.atEnd = false
    // the temperature on the flask, the rings, the counter
    const kk = Math.round(Wv.K * 2) / 2
    if (kk !== lastK) {
      lastK = kk
      tempText.text = `${num(kk, kk % 1 ? 1 : 0, lang)} K`
      tempText.sync()
    }
    ringWait -= dt
    if (ringWait <= 0) {
      ringWait = 1 / 24
      // the colder the atoms, the sharper the line: warm, the rings fade over long paths; fast, they blur
      const warmFn = 0.25 + 0.75 * Math.exp(-Wv.d / 0.25)
      const coldFn = 1 - 0.08 * Wv.d
      const contrast = lerp(warmFn, coldFn, ease(Wv.coldK)) * (1 - 0.85 * clamp(Wv.spd / 0.06))
      const phase = fringes() % 1
      const on = Wv.lampK > 0.5
      const key = `${on}|${phase.toFixed(3)}|${contrast.toFixed(2)}`
      if (key !== Wv.drawn) {
        Wv.drawn = key
        drawRings(phase, contrast, on)
      }
    }
    counterWait -= dt
    if (counterWait <= 0) {
      counterWait = 0.1
      const w = Wv.d * WAVES
      const line = fill(at(E.waves.counter, level()), { w: grp(w, 2, lang), f: grp(Math.round(fringes()), 0, lang) })
      counter.set({ line })
    }
  })

  // =================================================================================================
  // 1983: light's own ruler
  // =================================================================================================
  const t3 = station(C3, 3.6, 1.0)
  plaque(t3, -0.7, 0.45, '1983', E.light.label)
  const AP_X = -1.1 // the laser's aperture; the detector's face is a metre on
  const DET_X = AP_X + 1
  const trackTex = tex(canvasTex(512, 32, (g, w, h) => {
    g.fillStyle = '#2b2622'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#e9dcc0'
    for (let i = 0; i <= 10; i++) g.fillRect(Math.min(w - 3, i * (w / 10)), 0, i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 22 : 14)
  }))
  {
    const track = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.12), mats.dark)
    track.position.set(AP_X + 0.5, TOP + 0.015, 0)
    const ruler = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.07), new THREE.MeshBasicMaterial({ map: trackTex }))
    ruler.rotation.x = -Math.PI / 2
    ruler.position.set(AP_X + 0.5, TOP + 0.031, 0.02)
    t3.add(track, ruler)
    for (const [x, s] of [[AP_X, '0'], [DET_X, '1 m']]) {
      const lab = makeText(s, { size: 0.045, color: '#ffd166', maxWidth: 0.2 })
      lab.rotation.x = -Math.PI / 2
      lab.position.set(x, TOP + 0.034, 0.13)
      t3.add(lab)
    }
  }
  // the laser, a brass-ringed box with its aperture, and the detector, a small plate with an eye
  const laser = new THREE.Group()
  laser.position.set(AP_X - 0.17, TOP, 0)
  t3.add(laser)
  const laserMat = new THREE.MeshStandardMaterial({ color: '#ff4a2a', emissive: '#ff3a1a', emissiveIntensity: 0.3, roughness: 0.4 })
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.14, 0.14, 3, 0.02), mats.dark)
    body.position.y = 0.1
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.04, 18), mats.brass)
    ring.rotation.z = Math.PI / 2
    ring.position.set(0.17, 0.1, 0)
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16), laserMat)
    eye.rotation.z = Math.PI / 2
    eye.position.set(0.185, 0.1, 0)
    laser.add(body, ring, eye)
    laser.add(hitBox(0.4, 0.2, 0.2, 0.05, 0.1, 0))
  }
  const detMat = new THREE.MeshStandardMaterial({ color: '#1c4a38', emissive: '#4cffa0', emissiveIntensity: 0.05, roughness: 0.4 })
  {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.14, 0.14, 2, 0.01), mats.dark)
    plate.position.set(DET_X + 0.025, TOP + 0.1, 0)
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.01, 16), detMat)
    eye.rotation.z = Math.PI / 2
    eye.position.set(DET_X - 0.002, TOP + 0.1, 0)
    t3.add(plate, eye)
  }
  const PULSE_Y = TOP + 0.1
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.025, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffb08a' }))
  pulse.scale.set(3, 1.4, 1.4)
  const pulseGlow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshBasicMaterial({ color: '#ff5a2a', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
  pulse.add(pulseGlow)
  pulse.visible = false
  t3.add(pulse)
  // the clock: a dial that reads nanoseconds, slowed a billion times so one tick is a second
  const DIAL = new THREE.Group()
  DIAL.position.set(-0.55, TOP, -0.34)
  t3.add(DIAL)
  const NS_MAX = 4
  {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.5, 10), mats.brass)
    column.position.y = 0.25
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 20), mats.dark)
    foot.position.y = 0.015
    DIAL.add(column, foot)
    const face = tex(canvasTex(256, 256, (g, w) => {
      const c = w / 2
      g.fillStyle = '#12151f'
      g.beginPath()
      g.arc(c, c, c - 2, 0, TAU)
      g.fill()
      g.strokeStyle = '#e9dcc0'
      g.fillStyle = '#e9dcc0'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = '700 26px Outfit'
      for (let i = 0; i < NS_MAX * 5; i++) {
        const a = (i / (NS_MAX * 5)) * TAU - Math.PI / 2
        const major = i % 5 === 0
        g.lineWidth = major ? 4 : 2
        g.beginPath()
        g.moveTo(c + Math.cos(a) * (c - 12), c + Math.sin(a) * (c - 12))
        g.lineTo(c + Math.cos(a) * (c - (major ? 34 : 24)), c + Math.sin(a) * (c - (major ? 34 : 24)))
        g.stroke()
        if (major) g.fillText(String(i / 5), c + Math.cos(a) * (c - 56), c + Math.sin(a) * (c - 56))
      }
      g.font = '700 22px Outfit'
      g.fillStyle = '#ffd166'
      g.fillText('ns', c, c + 58)
    }))
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.25, 40), new THREE.MeshBasicMaterial({ map: face }))
    disc.position.set(0, 0.62, 0.0)
    const rimC = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.018, 8, 40), mats.brass)
    rimC.position.set(0, 0.62, 0)
    DIAL.add(disc, rimC)
    const slow = makeText(E.light.slow, { font: 'body', size: 0.034, color: '#ffd166', maxWidth: 0.5, anchorY: 'bottom' })
    slow.position.set(0, 0.9, 0.01)
    DIAL.add(slow)
  }
  const hand = new THREE.Group()
  hand.position.set(0, 0.62, 0.006)
  const handBar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.2, 0.004), new THREE.MeshBasicMaterial({ color: '#ff6a3c' }))
  handBar.position.y = 0.09
  hand.add(handBar)
  DIAL.add(hand)
  // the Earth and light's path round it
  const GLOBE = new THREE.Group()
  GLOBE.position.set(1.3, TOP, 0.0)
  t3.add(GLOBE)
  const RG = 0.4
  const GY = 0.64
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.04, 24), mats.dark)
    foot.position.y = 0.02
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, GY - 0.2, 10), mats.brass)
    col.position.y = 0.04 + (GY - 0.2) / 2
    GLOBE.add(foot, col)
  }
  const earth = new THREE.Mesh(new THREE.SphereGeometry(RG, 48, 32), new THREE.MeshStandardMaterial({ map: tex(earthTexture()), roughness: 0.85, emissive: '#0b2348', emissiveIntensity: 0.35 }))
  earth.position.y = GY
  earth.rotation.z = 0.41
  GLOBE.add(earth)
  const MAXDOTS = 1300
  const DPL = 150 // dots in a lap
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0085, 6, 4), dotMat, MAXDOTS)
  dots.frustumCulled = false
  dots.raycast = () => {}
  dots.count = 1
  const headDot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffe2c8' }))
  headDot.raycast = () => {}
  const pathG = new THREE.Group()
  pathG.position.y = GY
  pathG.add(dots, headDot)
  GLOBE.add(pathG)
  const dm = new THREE.Object3D()
  const place = (s, out) => {
    // a great circle round the Earth, turned a little more with every lap
    const a = TAU * s
    out.set(Math.cos(a), 0, Math.sin(a)).multiplyScalar(RG + 0.014)
    out.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.5)
    out.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.33 * s * TAU)
    return out
  }
  const tp = new THREE.Vector3()
  const setPath = laps => {
    const n = Math.min(MAXDOTS, Math.max(1, Math.ceil(laps * DPL)))
    dots.count = n
    for (let i = 0; i < n; i++) {
      place((i / DPL) % 1000, tp)
      dm.position.copy(tp)
      dm.updateMatrix()
      dots.setMatrixAt(i, dm.matrix)
    }
    dots.instanceMatrix.needsUpdate = true
    place(laps, headDot.position)
  }
  // the time and the distance board
  const board = standingScreen({ width: 1.1, height: 0.7, color, title: E.light.boardTitle, line: '', titleSize: 0.075, lineSize: 0.06 }, { top: 0.4, tilt: 0.25, mat: mats.dark })
  board.group.position.set(0.3, TOP, -0.38)
  t3.add(board.group)

  const L = { e: -1.5, n: 0, run: 0, running: false, ns: 0, lastN: 0 }
  const SLOW = 3.34 // seconds, for 3.34 ns
  const tOf = e => 10 ** e
  const fmtT = (v, lg) => {
    if (v < 1e-6) return `${num(v * 1e9, v * 1e9 < 10 ? 2 : 1, lg)} ns`
    if (v < 1e-3) return `${num(v * 1e6, v * 1e6 < 10 ? 2 : 1, lg)} µs`
    if (v < 1) return `${num(v * 1e3, v * 1e3 < 10 ? 2 : v * 1e3 < 100 ? 1 : 0, lg)} ms`
    return `${num(v, 0, lg)} s`
  }
  const fmtD = (m, lg) => {
    if (m < 1) return `${num(m, 2, lg)} m`
    if (m < 1000) return `${num(m, 0, lg)} m`
    return `${grp(Math.round(m / 1000), 0, lg)} km`
  }
  const lightVars = () => {
    const s = tOf(L.e)
    const d = C * s
    return { t: fmtT(s, lang), d: fmtD(d, lang), laps: num(d / EARTH, d / EARTH < 10 ? 2 : 1, lang) }
  }
  const lightHint = () => (L.n === 0 ? E.light.hints.laser : E.light.hints.slide)
  const lightPanel = lv => ({
    title: E.light.title,
    color,
    blocks: [
      ...paras(E.light.panel[depth(lv)]),
      { p: E.light.tip },
      {
        slider: {
          label: E.light.time,
          min: -9,
          max: 0,
          step: 0.01,
          value: L.e,
          onInput: v => {
            L.e = v
            shareSoon('light')
            settleSay('light', lightWords)
          },
          format: v => fmtT(tOf(v), lang),
          live: () => L.e,
        },
      },
      {
        buttons: [
          { label: E.light.buttons.laser, onClick: () => tapLaser() },
          { label: E.light.buttons.lap, onClick: () => tapGlobe() },
        ],
      },
    ],
  })
  const lightWords = () => {
    const d = C * tOf(L.e)
    const key = d / EARTH >= 0.5 ? 'slideLaps' : 'slide'
    say(fill(at(E.light.says[key], level()), lightVars()))
  }
  const firePulse = () => {
    L.running = true
    L.run = 0
    L.lastN = L.n
    play('beam')
  }
  const tapLaser = () => {
    if (L.running) return
    L.n++
    firePulse()
    say(at(E.light.says.pulse, level()))
    share('light')
    findOnce('light', lightPanel, SLOW + 0.8)
  }
  const tapGlobe = () => {
    L.e = Math.log10(EARTH / C)
    play('select')
    say(at(E.light.says.lap, level()))
    share('light')
    refresh(lightPanel)
    findOnce('light', lightPanel, 1.5)
  }
  ex.add({
    id: 'light',
    x: C3.x,
    z: C3.z + 1.7,
    radius: 2.3,
    label: E.light.label,
    verb: lightHint,
    manual: true,
    focus: { x: C3.x + 0.2, y: TOP + 0.35, z: C3.z, size: 2.6, width: 3.8 },
    act: () => ctx.showPanel(lightPanel),
  })
  clickable(laser, tapLaser, { reach: 6 })
  clickable(earth, tapGlobe, { reach: 6 })

  let lastE = null
  let boardWait = 0
  updates.push((dt, t) => {
    // the pulse crosses the metre, slowed a billion times; the clock's hand counts its nanoseconds
    if (L.running) {
      L.run += dt
      const k = clamp(L.run / SLOW)
      pulse.visible = true
      pulse.position.set(AP_X + 0.03 + k * (DET_X - AP_X - 0.06), PULSE_Y, 0)
      hand.rotation.z = -((k * (SLOW / 1)) / NS_MAX) * TAU
      if (k >= 1) {
        L.running = false
        pulse.visible = false
        detMat.emissiveIntensity = 2.4
        hand.rotation.z = -(3.34 / NS_MAX) * TAU
      }
    }
    detMat.emissiveIntensity = damp(detMat.emissiveIntensity, 0.05, 2.2, dt)
    laserMat.emissiveIntensity = L.running && L.run < 0.5 ? 2.6 : damp(laserMat.emissiveIntensity, 0.3, 4, dt)
    earth.rotation.y += dt * 0.08
    if (L.e !== lastE) {
      lastE = L.e
      setPath((C * tOf(L.e)) / EARTH)
    }
    boardWait -= dt
    if (boardWait <= 0) {
      boardWait = 0.12
      board.set({ line: fill(at(E.light.board, level()), lightVars()) })
    }
  })

  // the pulse seen on another screen (someone else fired the laser in the room)
  // =================================================================================================

  updates.push(dt => {
    for (const [id, s] of Object.entries(settleTimers)) {
      if (!s) continue
      s.t -= dt
      if (s.t <= 0) {
        settleTimers[id] = null
        s.fn()
      }
    }
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: Z1 - 0.9 },
    spawn: { x: 0, z: 4.8, yaw: 0 },
    hostSpot: { x: 1.6, z: 4.0, yaw: Math.atan2(1.6, -0.8) },
    back: { x: 0, z: Z1 - 0.4, rot: Math.PI },
    stand: { x: -2.6, z: 5.2, rot: 0.95 },
    panels: { bar: barPanel, waves: wavesPanel, light: lightPanel },
    parts: {
      // what a tap does, for the probes (a real tap is `world.onTap(__ew.rayAt({ x, y }))`)
      tap: name =>
        ({
          case: tapCase,
          bar: tapBar,
          x: tapX,
          thermo: tapThermo,
          cryo: tapCryo,
          lamp: tapLamp,
          motor: tapMotor,
          laser: tapLaser,
          globe: tapGlobe,
        })[name]?.(),
      bar: {
        get lid() {
          return B.lid
        },
        get scope() {
          return B.scope
        },
        get x() {
          return B.x
        },
        get T() {
          return B.T
        },
        get um() {
          return um()
        },
        at: name => ({ case: worldAt(t1, 0, TOP + 0.1, 0), bar: worldAt(t1, 0, Y_BAR + 0.03, 0), x: worldAt(t1, 1.38, TOP + 0.17, 0.08), thermo: worldAt(t1, 0.76, TOP + 0.3, 0.32) })[name],
      },
      waves: {
        get cold() {
          return Wv.cold
        },
        get lamp() {
          return Wv.lamp
        },
        get d() {
          return Wv.d
        },
        get dT() {
          return Wv.dT
        },
        get waves() {
          return Wv.d * WAVES
        },
        at: name => ({ cryo: worldAt(t2, -1.4, TOP + 0.3, 0.05), lamp: worldAt(t2, -1.0, BEAM_Y, -0.12), motor: worldAt(t2, 1.42, TOP + 0.12, 0.1) })[name],
      },
      light: {
        get e() {
          return L.e
        },
        get n() {
          return L.n
        },
        get running() {
          return L.running
        },
        at: name => ({ laser: worldAt(t3, AP_X - 0.17, TOP + 0.1, 0.07), globe: worldAt(t3, 1.3, TOP + GY, RG * 0.9) })[name],
      },
    },
    shared: {
      bar: {
        get: () => ({ lid: B.lid, scope: B.scope, x: B.x, t: Math.round(B.T * 10) / 10 }),
        set: (s, live) => {
          B.lid = !!s?.lid
          B.scope = B.lid && !!s?.scope
          B.x = !!s?.x
          B.T = clamp(Number(s?.t) || 0, -10, 40)
          B.said = B.T
          if (!live) {
            B.lidK = B.lid ? 1 : 0
            B.scopeK = B.scope ? 1 : 0
            B.xK = B.x ? 1 : 0
            B.shown = B.T
          }
        },
      },
      waves: {
        get: () => ({ cold: Wv.cold, lamp: Wv.lamp, d: Math.round(Wv.dT * 10000) / 10000 }),
        set: (s, live) => {
          Wv.cold = !!s?.cold
          Wv.lamp = !!s?.lamp
          const d = clamp(Number(s?.d) || 0, 0, 1)
          Wv.dT = d
          if (!live) {
            Wv.d = d
            Wv.coldK = Wv.cold ? 1 : 0
            Wv.lampK = Wv.lamp ? 1 : 0
          }
        },
      },
      light: {
        get: () => ({ e: Math.round(L.e * 100) / 100, n: L.n }),
        set: (s, live) => {
          L.e = clamp(Number(s?.e) || 0, -9, 0)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (live && n === L.n + 1 && !L.running) firePulse()
          L.n = n
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      stage.update(t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
