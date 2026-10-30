// Sodium's picture "Why were old street lights yellow?" as a room (docs/knowledge/picture-rooms.md): the
// picture's street made into a place, at night (stages/street.js). The houses, the red car, the green
// tree, the blue ball, the flower bed, a bakery's yellow sign and washing on a line, under an old
// low-pressure sodium lamp, with a new white LED lamp across the road. The stage lights both lamps colour
// by colour in the shader, so under sodium light every surface keeps only its reflectance near 589 nm.
// Three things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E through
// fixed steps felt passive); the prompt names the next tap, E opens the station's panel, whose buttons
// (and a slider for the white light) do the same:
// - the sodium lamp: tap the switch on its post. The tube glows pink-red first (the neon that starts it),
//   then, as the sodium warms and turns into a gas, orange and a bright yellow; a clock on the post counts
//   the minutes, 30 times fast (a real lamp takes about 10). Tap again to switch it off;
// - colours that vanish: under the sodium lamp the street turns to yellow and grey. Tap the white LED (its
//   head or the switch on its post) or slide its light up, and the colours come back; tap the car, the
//   tree, the ball, the flowers, the sign or the washing to hear why each looks as it does;
// - the spectroscope on its tripod: tap it to look at the lamp it points at, and the screen beside it
//   shows the light taken apart: one yellow line from the sodium lamp (at Scientist level a close-up
//   splits it into 589.0 and 589.6 nm), neon's red lines while it starts, a whole rainbow from the LED.
//   Standing at it, tap a lamp to turn it there (a lamp that is off switches on).
// All three are shared in a room (src/net/shared.js): the sodium lamp as { on, m, w } (minutes on and its
// warmth, run on by `ago`), the LED as its level, the spectroscope as where it points; the words, panels
// and discoveries stay each one's. parts.<thing> does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, smooth, num, standingScreen, random } from '../../../wings/noble/kit.js'
import { LINES, SODIUM_D, wavelengthRGB, eyeWeight, lineBrightness } from '../../../wings/noble/nobleData.js'
import { nmX, drawScale, NM_MIN, NM_MAX } from '../../../wings/noble/spectrumCanvas.js'
import { streetStage, STREET, LIGHT } from '../../stages/street.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAMPS_WORDS } from './lamps.words.js'

export const WORDS = LAMPS_WORDS

const TAU = Math.PI * 2
const S = STREET
const K = S.kerb

// ---- where things stand (metres; the spawn on the road looks along -z at the far pavement) ----
const POST = { x: 0.6, z: -5.15, h: 4.1 }
const HEAD = new THREE.Vector3(1.9, 4.3, -5.15) // the sodium lantern's middle
const LAMP_B = { x: 7.8, z: 3.45, head: new THREE.Vector3(7.8, 4.3, 2.05) } // the near pavement's sodium lamp
const LED = { x: 4.4, z: 3.45, head: new THREE.Vector3(4.4, 5.75, 2.35) }
const CAR = { x: 4.1, z: -2.55 }
const TREE = { x: -6.1, z: -4.6 }
const BED = { x0: -4.5, x1: -1.7, z: -5.5, d: 0.56, h: 0.42 }
const WASH = { x0: -4.8, x1: -1.0, z: -7.05, y: 1.98 }
const BALL = { x: -0.75, z: -4.75, r: 0.21 }
const SCOPE = { x: -6.4, z: 0.9, y: 1.25 } // out on the road (the street is closed to traffic)
const SCREEN = { x: -7.5, z: 0.4 }
const SPAWN = { x: -0.8, z: 1.2 }
const BACK = { x: -0.8, z: 4.72 }
const STAND = { x: -3.5, z: 3.7 }
const HOST = { x: 1.3, z: 2.0 }
// the stations' spots: where the visitor stands to use each, off the garden walls (near a wall the
// third-person camera closes in on the Atomling)
const AT = { lamp: { x: 0.9, z: -1.2 }, colours: { x: 2.0, z: 0.35 }, scope: { x: -6.4, z: 1.95 } }

// ---- the sodium lamp's run-up: the clock runs 30 times fast; a real lamp takes about 10 minutes ----
const SPEED = 30
const RUNUP = 10 // lamp minutes from cold to full
const COOL = 8 // lamp minutes from full to cold, switched off
const DIAL = 15 // minutes round the dial
const NEON = 0.12 // the neon glow's share of the full sodium light
const I_NA = 36 // the lamps' strengths in the shader
const I_LED = 44

/** What the sodium lamp gives at warmth w (0 cold, 1 run up): sodium's yellow and neon's red. */
function lampOut(on, w) {
  if (!on) return { na: 0, ne: 0 }
  const na = Math.pow(smooth(0.05, 1, w), 1.5)
  const ne = NEON * (1 - smooth(0.2, 0.65, w))
  return { na, ne }
}

// ---- the spectroscope's screen: the light taken apart ----
const CW = 1024
const CH = 600
const BAND = { x: 50, y: 74, w: 924, h: 118 }
const ZOOM = { x: 50, y: 408, w: 924, h: 84, nm0: 586, nm1: 593 }
const css = ([r, g, b], k = 1) => `rgb(${Math.round(Math.min(1, r * k) * 255)},${Math.round(Math.min(1, g * k) * 255)},${Math.round(Math.min(1, b * k) * 255)})`
// a white LED: a blue chip's narrow peak near 450 nm and a phosphor's broad band from green to red
const ledSpd = nm => Math.exp(-(((nm - 450) / 11) ** 2) / 2) + 0.55 * Math.exp(-(((nm - 565) / 55) ** 2) / 2)
const NE_LINES = LINES.Ne.map(([nm, I]) => [nm, lineBrightness('Ne', I) * eyeWeight(nm)])

/** A bright line, glowing, at x across a band from y with height h. */
function bar(g, x, y, h, nm, b, width) {
  if (b <= 0.01) return
  const rgb = wavelengthRGB(nm)
  g.shadowColor = css(rgb)
  g.shadowBlur = width * 3
  g.globalAlpha = Math.min(1, 0.25 + 0.75 * b)
  g.fillStyle = css(rgb, 0.4 + 0.8 * b)
  g.fillRect(x - width / 2, y + 2, width, h - 4)
  g.globalAlpha = 1
  g.shadowBlur = 0
}

/** The screen's picture: v = { title, caption, src ('na' | 'led' | null), naVis, neVis, led, sci, zoom, lang }. */
function drawView(g, v) {
  g.save()
  g.fillStyle = '#05060f'
  g.fillRect(0, 0, CW, CH)
  g.textBaseline = 'alphabetic'
  g.fillStyle = '#ffd98a'
  g.font = '700 40px Outfit, sans-serif'
  g.textAlign = 'left'
  g.fillText(v.title, BAND.x, 50)
  // the band: dark, then the light
  g.fillStyle = '#010208'
  g.fillRect(BAND.x, BAND.y, BAND.w, BAND.h)
  g.globalCompositeOperation = 'lighter'
  if (v.src === 'led' && v.led > 0.01) {
    for (let px = 0; px < BAND.w; px++) {
      const nm = NM_MIN + (px / BAND.w) * (NM_MAX - NM_MIN)
      const k = Math.sqrt(ledSpd(nm) / 1.06) * eyeWeight(nm) * Math.sqrt(v.led)
      g.fillStyle = css(wavelengthRGB(nm), k * 1.15)
      g.fillRect(BAND.x + px, BAND.y + 3, 1.3, BAND.h - 6)
    }
  } else if (v.src === 'na') {
    for (const [nm, b] of NE_LINES) bar(g, nmX(nm, BAND.x, BAND.w), BAND.y, BAND.h, nm, b * v.neVis, 4)
    for (const nm of SODIUM_D) bar(g, nmX(nm, BAND.x, BAND.w), BAND.y, BAND.h, nm, Math.pow(v.naVis, 0.7), 6)
  }
  g.globalCompositeOperation = 'source-over'
  drawScale(g, { x: BAND.x, y: BAND.y + BAND.h + 4, w: BAND.w, size: 22 })
  // what it shows, in words
  g.fillStyle = '#ffffff'
  g.textAlign = 'center'
  g.font = `700 ${v.sci ? 38 : 50}px Outfit, sans-serif`
  g.fillText(v.caption, CW / 2, v.sci ? 330 : 380)
  if (v.sci) {
    // the close-up: 586 to 593 nm, where the two D lines stand apart
    const zx = nm => ZOOM.x + ((nm - ZOOM.nm0) / (ZOOM.nm1 - ZOOM.nm0)) * ZOOM.w
    g.fillStyle = '#c9d4ff'
    g.font = '600 26px Outfit, sans-serif'
    g.textAlign = 'left'
    g.fillText(v.zoom, ZOOM.x, ZOOM.y - 12)
    g.fillStyle = '#010208'
    g.fillRect(ZOOM.x, ZOOM.y, ZOOM.w, ZOOM.h)
    g.globalCompositeOperation = 'lighter'
    if (v.src === 'led' && v.led > 0.01) {
      for (let px = 0; px < ZOOM.w; px += 2) {
        const nm = ZOOM.nm0 + (px / ZOOM.w) * (ZOOM.nm1 - ZOOM.nm0)
        g.fillStyle = css(wavelengthRGB(nm), Math.sqrt(ledSpd(nm) / 1.06) * Math.sqrt(v.led) * 1.1)
        g.fillRect(ZOOM.x + px, ZOOM.y + 3, 2.2, ZOOM.h - 6)
      }
    } else if (v.src === 'na') {
      for (const [nm, b] of NE_LINES) if (nm > ZOOM.nm0 && nm < ZOOM.nm1) bar(g, zx(nm), ZOOM.y, ZOOM.h, nm, b * v.neVis, 9)
      // D2 a little brighter than D1
      SODIUM_D.forEach((nm, i) => bar(g, zx(nm), ZOOM.y, ZOOM.h, nm, Math.pow(v.naVis, 0.7) * (i ? 0.8 : 1), 10))
    }
    g.globalCompositeOperation = 'source-over'
    g.strokeStyle = '#c9d4ff'
    g.fillStyle = '#c9d4ff'
    g.lineWidth = 2
    g.font = '700 22px Outfit, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'top'
    for (let nm = ZOOM.nm0; nm <= ZOOM.nm1; nm++) {
      const x = zx(nm)
      g.beginPath()
      g.moveTo(x, ZOOM.y + ZOOM.h + 2)
      g.lineTo(x, ZOOM.y + ZOOM.h + 14)
      g.stroke()
      g.fillText(String(nm), x, ZOOM.y + ZOOM.h + 17)
    }
    // the D lines named, when they show
    if (v.src === 'na' && v.naVis > 0.05) {
      g.fillStyle = '#ffe9a8'
      g.font = '700 24px Outfit, sans-serif'
      g.textBaseline = 'bottom'
      SODIUM_D.forEach((nm, i) => {
        g.textAlign = i ? 'left' : 'right'
        g.fillText(`${num(nm, 1, v.lang)} nm`, zx(nm) + (i ? 14 : -14), ZOOM.y + 30)
      })
    }
  }
  g.restore()
}

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, level, depth, color, light, lang, clickable }) {
  const stage = streetStage({ light, pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1, shop: 5.8 })
  root.add(stage.group)
  const { paint } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const soft = softTex()
  textures.push(soft)
  const paras = list => list.map(p => ({ p }))
  const me = () => ctx.engine.player.pos
  const near = (spot, r) => Math.hypot(me().x - spot.x, me().z - spot.z) < r
  // a find counted; its panel opens a moment later, but only if the visitor is still at that station
  const discover = (find, panel, delay, spot) => {
    if (ex.discover(find) && panel) later(delay, () => near(spot, 7) && ctx.showPanel(panel))
  }

  // shared plain materials (painted: lit by the lamps colour by colour)
  const M = {
    green: paint('#2e4a40', { roughness: 0.55 }), // the old lamp post's paint
    galv: paint('#7d838a', { roughness: 0.45, metalness: 0.3 }), // the new post, galvanised
    dark: paint('#2a2d33', { roughness: 0.6 }),
    tyre: paint('#1c1c1f', { roughness: 0.9 }),
    chrome: paint('#a9adb2', { roughness: 0.3, gloss: 0.5 }),
    glass: paint('#1a2232', { roughness: 0.1, gloss: 0.9 }),
    wood: paint('#5b4030', { roughness: 0.85 }),
    soil: paint('#33261c', { roughness: 1 }),
    leaf: paint('#2f8a35', { roughness: 0.8, flatShading: true }),
    rope: paint('#d6d2c6', { roughness: 0.9 }),
    cream: paint('#e8e2d0', { roughness: 0.6 }),
  }
  // clear glass round the lamps' tubes, unlit (a light right beside it would blow it out to a blob)
  const jacket = new THREE.MeshBasicMaterial({ color: '#cfd8de', transparent: true, opacity: 0.1, depthWrite: false })

  // ======== the old sodium lamps: a green post, a curved arm, the long lantern of the picture ========
  // Two in this stretch of street, one each side, switched together (as a street's lamps are): the one on
  // the far pavement is the picture's, with the switch and the clock; the near one lights what faces you.
  const tubeMat = new THREE.MeshBasicMaterial({ color: '#000000' })
  const haloMat = new THREE.SpriteMaterial({ map: soft, color: '#000000', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  /** A post at (x, z) and its lantern at `head`, its arm reaching out along `rot` (0: +x, PI/2: -z). */
  function sodiumLamp(x, z, head, rot) {
    const post = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.1, POST.h, 14), M.green)
    shaft.position.y = K + POST.h / 2
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 1.0, 14), M.green)
    base.position.y = K + 0.5
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 20), M.green)
    collar.rotation.x = Math.PI / 2
    collar.position.y = K + 1.0
    post.add(shaft, base, collar)
    post.position.set(x, 0, z)
    root.add(post)
    solids.push(circle(x, z, 0.22))
    // the arm, curving from the top of the post out to the lantern's end
    const out = new THREE.Vector3(Math.cos(rot), 0, -Math.sin(rot))
    const reach = Math.hypot(head.x - x, head.z - z) - 0.66
    const top = POST.h + K
    const p = (along, y) => new THREE.Vector3(x, y, z).addScaledVector(out, along)
    const curve = new THREE.CubicBezierCurve3(p(0, top - 0.3), p(0, top + 0.3), p(0.3, head.y + 0.2), p(reach, head.y + 0.1))
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.045, 8, false), M.green))
    // the lantern: a long canopy, the U-shaped tube in its glass jacket, a clear bowl under it
    const lantern = new THREE.Group()
    const canopy = new THREE.Mesh(new RoundedBoxGeometry(1.36, 0.16, 0.48, 3, 0.07), M.green)
    canopy.position.y = 0.12
    const bowl = new THREE.Mesh(new RoundedBoxGeometry(1.28, 0.2, 0.42, 3, 0.08), jacket)
    bowl.position.y = -0.04
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 1.08, 18, 1, true).rotateZ(Math.PI / 2), jacket)
    outer.position.y = -0.02
    const tube = new THREE.Group()
    for (const tz of [-0.042, 0.042]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.98, 10).rotateZ(Math.PI / 2), tubeMat)
      leg.position.set(0, 0, tz)
      tube.add(leg)
    }
    const bend = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.024, 8, 14, Math.PI), tubeMat)
    bend.rotation.set(Math.PI / 2, 0, -Math.PI / 2)
    bend.position.x = 0.49
    tube.add(bend)
    tube.position.y = -0.02
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 14).rotateZ(Math.PI / 2), M.dark)
    cap.position.x = -0.62
    lantern.add(canopy, bowl, outer, tube, cap)
    lantern.position.copy(head)
    lantern.rotation.y = rot
    root.add(lantern)
    const halo = new THREE.Sprite(haloMat)
    halo.position.copy(head).add(new THREE.Vector3(0, -0.08, 0))
    halo.scale.set(1.9, 1.25, 1)
    root.add(halo)
    // its light for what the shader does not paint (the Atomling, the frame, the easel)
    const lightOf = new THREE.PointLight('#ffcf33', 0, 0, 2)
    lightOf.position.copy(head).add(new THREE.Vector3(0, -0.3, 0))
    root.add(lightOf)
    return { lantern, light: lightOf, pos: head.clone().add(new THREE.Vector3(0, -0.05, 0)) }
  }
  const lampA = sodiumLamp(POST.x, POST.z, HEAD, 0)
  const lampB = sodiumLamp(LAMP_B.x, LAMP_B.z, LAMP_B.head, Math.PI / 2)
  const lantern = lampA.lantern
  const NA_POS = lampA.pos

  // the switch box on the post, and above it the clock that counts the minutes since it was switched on
  const SW = { y: K + 1.2, z: POST.z + 0.12 }
  const switchBox = new THREE.Group()
  const lever = new THREE.Group()
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.36, 0.13, 2, 0.03), M.dark)
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.02), M.chrome)
    plate.position.z = 0.07
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.15, 8), M.chrome)
    handle.position.y = 0.075
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), paint('#c81e24', { roughness: 0.4, gloss: 0.4 }))
    knob.position.y = 0.15
    lever.add(handle, knob)
    lever.position.z = 0.08
    // something easy to tap round it
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.4), new THREE.MeshBasicMaterial({ visible: false }))
    switchBox.add(body, plate, lever, hit)
    switchBox.position.set(POST.x, SW.y, SW.z)
    root.add(switchBox)
  }
  const dialTex = canvasTex(256, 256, (g, w) => {
    const c = w / 2
    g.fillStyle = '#f1ead6'
    g.beginPath()
    g.arc(c, c, c - 4, 0, TAU)
    g.fill()
    g.strokeStyle = '#1c1c22'
    g.fillStyle = '#1c1c22'
    for (let m = 0; m < DIAL; m++) {
      const a = (m / DIAL) * TAU
      const big = m % 5 === 0
      g.lineWidth = big ? 6 : 3
      g.beginPath()
      g.moveTo(c + Math.sin(a) * (c - 14), c - Math.cos(a) * (c - 14))
      g.lineTo(c + Math.sin(a) * (c - (big ? 40 : 30)), c - Math.cos(a) * (c - (big ? 40 : 30)))
      g.stroke()
    }
    g.font = '700 38px Outfit, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (const m of [0, 5, 10]) {
      const a = (m / DIAL) * TAU
      g.fillText(String(m), c + Math.sin(a) * (c - 68), c - Math.cos(a) * (c - 68))
    }
    g.fillStyle = '#b8161c'
    g.font = '700 24px Outfit, sans-serif'
    g.fillText('×30', c, c - 27)
  })
  textures.push(dialTex)
  const clock = new THREE.Group()
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.13, 0.008).translate(0, 0.05, 0), paint('#b8161c'))
  {
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.17, 40), paint('#ffffff', { map: dialTex, emissive: '#ffffff', emissiveMap: dialTex, emissiveIntensity: 0.22, roughness: 0.5 }))
    face.position.z = 0.03
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 8, 40), M.dark)
    rim.position.z = 0.03
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 30).rotateX(Math.PI / 2), M.dark)
    hand.position.z = 0.04
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12).rotateX(Math.PI / 2), M.dark)
    hub.position.z = 0.045
    clock.add(back, face, rim, hand, hub)
    clock.position.set(POST.x, K + 1.78, POST.z + 0.13)
    root.add(clock)
  }
  // the minutes, written on the dial's lower half
  const readout = makeText('', { size: 0.042, color: '#1c1c22', anchorY: 'middle' })
  readout.position.set(0, -0.098, 0.046)
  clock.add(readout)

  // ---- the lamp's state: on or off, minutes since switched on, warmth ----
  const LAMP = { on: false, m: 0, w: 0 }
  let mineLamp = false
  let told = {}
  function advanceLamp(dtReal) {
    const dm = (dtReal * SPEED) / 60
    if (LAMP.on) {
      LAMP.m = Math.min(LAMP.m + dm, 600)
      LAMP.w = Math.min(1, LAMP.w + dm / RUNUP)
    } else LAMP.w = Math.max(0, LAMP.w - dm / COOL)
  }
  const out = () => lampOut(LAMP.on, LAMP.w)
  const lampPanel = lv => ({
    title: E.lamp.title,
    color,
    blocks: [{ buttons: [{ label: E.lamp.buttons.switch, onClick: () => lampStep() }] }, ...paras(E.lamp.panel[depth(lv)])],
  })
  function lampStep() {
    LAMP.on = !LAMP.on
    if (LAMP.on) LAMP.m = 0
    mineLamp = true
    told = {}
    play(LAMP.on ? 'select' : 'tap')
    say(at(E.lamp.says[LAMP.on ? 'on' : 'off'], level()))
    discover('lamp', lampPanel, 3.0, AT.lamp)
    share('lamp')
  }
  ex.add({
    id: 'lamp',
    x: AT.lamp.x,
    z: AT.lamp.z,
    radius: 1.9,
    manual: true,
    label: E.lamp.label,
    verb: () => E.lamp.hints[!LAMP.on ? 'off' : LAMP.w < 1 ? 'warm' : 'on'],
    focus: { x: 1.1, y: 2.5, z: POST.z, size: 4.6 },
    act: () => ctx.showPanel(lampPanel),
  })
  // the switch box, the post and the lantern switch it (but at the spectroscope a lamp is looked at)
  const atScope = () => near(AT.scope, 2.4)
  clickable(switchBox, () => lampStep())
  clickable(lantern, () => lampStep(), { when: () => !atScope(), reach: 9 })
  clickable(lampB.lantern, () => lampStep(), { when: () => !atScope(), reach: 9 })
  clickable(lantern, () => look('na', true), { when: atScope, reach: 14 })

  // ======== the new white LED lamp across the road ========
  const ledPanelMat = new THREE.MeshBasicMaterial({ color: '#000000' })
  const ledHaloMat = new THREE.SpriteMaterial({ map: soft, color: '#000000', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const ledHead = new THREE.Group()
  const ledBox = new THREE.Group()
  {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, LED.head.y - K + 0.15, 12), M.galv)
    shaft.position.set(LED.x, K + (LED.head.y - K + 0.15) / 2, LED.z)
    root.add(shaft)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, LED.z - LED.head.z - 0.2, 8).rotateX(Math.PI / 2), M.galv)
    arm.position.set(LED.x, LED.head.y + 0.12, (LED.z + LED.head.z) / 2 + 0.1)
    arm.rotation.x = -0.12
    root.add(arm)
    solids.push(circle(LED.x, LED.z, 0.2))
    // a slim modern head, its panel of LEDs underneath
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.09, 0.8, 2, 0.035), M.galv)
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.66).rotateX(Math.PI / 2), ledPanelMat)
    panel.position.y = -0.047
    ledHead.add(body, panel)
    ledHead.position.copy(LED.head)
    ledHead.rotation.x = 0.1
    root.add(ledHead)
    const halo = new THREE.Sprite(ledHaloMat)
    halo.position.copy(LED.head).add(new THREE.Vector3(0, -0.1, 0))
    halo.scale.set(2.6, 1.9, 1)
    root.add(halo)
    // its switch box, on the road side of the post
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.3, 0.1, 2, 0.025), M.dark)
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16).rotateY(Math.PI), paint('#ffffff', { emissive: '#bfe0ff', emissiveIntensity: 0 }))
    dot.position.z = -0.052
    dot.position.y = 0.07
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16).rotateX(Math.PI / 2), paint('#2a8c4a', { roughness: 0.4 }))
    btn.position.set(0, -0.04, -0.06)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.35), new THREE.MeshBasicMaterial({ visible: false }))
    ledBox.add(b, dot, btn, hit)
    ledBox.userData.dot = dot
    ledBox.position.set(LED.x, K + 1.2, LED.z - 0.11)
    root.add(ledBox)
  }
  const ledLight = new THREE.PointLight('#f4f6ff', 0, 0, 2)
  ledLight.position.copy(LED.head).add(new THREE.Vector3(0, -0.3, 0))
  root.add(ledLight)
  const LED_POS = LED.head.clone().add(new THREE.Vector3(0, -0.05, 0))
  const LIGHTS = { level: 0, last: 1 }
  let ledShown = 0

  // ======== the things of the picture: car, tree, ball, flowers, sign, washing ========
  // the red car, parked at the far kerb (a gloss of the lamps' own colour on its paint)
  const car = new THREE.Group()
  {
    const red = paint('#c41c1c', { roughness: 0.35, gloss: 0.9 })
    const body = new THREE.Mesh(new RoundedBoxGeometry(4.0, 0.64, 1.74, 3, 0.17), red)
    body.position.y = 0.64
    const profile = new THREE.Shape([new THREE.Vector2(-1.5, 0), new THREE.Vector2(0.9, 0), new THREE.Vector2(0.3, 0.54), new THREE.Vector2(-1.1, 0.54)])
    const cabin = new THREE.Mesh(new THREE.ExtrudeGeometry(profile, { depth: 1.5, bevelEnabled: false }).translate(0, 0, -0.75), M.glass)
    cabin.position.y = 0.95
    const roof = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.07, 1.54, 2, 0.03), red)
    roof.position.set(-0.4, 1.5, 0)
    // the pillars between the windows
    for (const [x0, x1] of [[-1.5, -1.1], [0.9, 0.3]]) {
      for (const z of [-0.74, 0.74]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.05), red)
        p.position.set((x0 + x1) / 2, 1.22, z)
        p.rotation.z = Math.atan2(x0 - x1, 0.54)
        car.add(p)
      }
    }
    for (const z of [-0.74, 0.74]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.54, 0.05), red)
      p.position.set(-0.35, 1.22, z)
      car.add(p)
    }
    car.add(body, cabin, roof)
    for (const x of [-1.3, 1.3]) {
      for (const z of [-0.8, 0.8]) {
        const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 22).rotateX(Math.PI / 2), M.tyre)
        tyre.position.set(x, 0.32, z)
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 16).rotateX(Math.PI / 2), M.chrome)
        hub.position.copy(tyre.position)
        car.add(tyre, hub)
      }
    }
    for (const z of [-0.58, 0.58]) {
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.14, 0.32, 1, 0.02), M.cream)
      head.position.set(2.0, 0.74, z)
      const tail = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.12, 0.3, 1, 0.02), paint('#7a0c10', { roughness: 0.3 }))
      tail.position.set(-2.0, 0.76, z)
      car.add(head, tail)
    }
    for (const x of [-2.02, 2.02]) {
      const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.14, 1.7, 2, 0.04), M.dark)
      bumper.position.set(x, 0.42, 0)
      car.add(bumper)
    }
    car.position.set(CAR.x, 0, CAR.z)
    root.add(car)
    solids.push(box(CAR.x, CAR.z, 4.15, 1.85))
  }
  // the green tree in its pit on the pavement
  const tree = new THREE.Group()
  {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, 2.7, 10), M.wood)
    trunk.position.y = K + 1.35
    const pit = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1).rotateX(-Math.PI / 2), M.soil)
    pit.position.y = K + 0.006
    tree.add(trunk, pit)
    const rnd = random(13)
    const blobs = [[0, 3.6, 0, 1.15], [-0.75, 3.15, 0.2, 0.85], [0.8, 3.2, -0.1, 0.9], [0.1, 4.25, 0.1, 0.85], [-0.3, 3.4, -0.6, 0.8], [0.4, 3.35, 0.65, 0.8]]
    for (const [x, y, z, r] of blobs) {
      const g = new THREE.IcosahedronGeometry(r, 1)
      const p = g.attributes.position
      for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (0.92 + rnd() * 0.16), p.getY(i) * (0.92 + rnd() * 0.16), p.getZ(i) * (0.92 + rnd() * 0.16))
      g.computeVertexNormals()
      const m = new THREE.Mesh(g, M.leaf)
      m.position.set(x, y + K, z)
      tree.add(m)
    }
    tree.position.set(TREE.x, 0, TREE.z)
    root.add(tree)
    solids.push(circle(TREE.x, TREE.z, 0.3))
  }
  // the blue ball with its white stripe
  const ballTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#1636b8'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#ecebe4'
    g.beginPath()
    for (let x = 0; x <= w; x += 4) g.lineTo(x, h * 0.5 + Math.sin((x / w) * TAU * 2) * h * 0.12 - h * 0.06)
    for (let x = w; x >= 0; x -= 4) g.lineTo(x, h * 0.5 + Math.sin((x / w) * TAU * 2) * h * 0.12 + h * 0.06)
    g.fill()
  })
  textures.push(ballTex)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL.r, 28, 18), paint('#ffffff', { map: ballTex, roughness: 0.35, gloss: 0.6 }))
  ball.position.set(BALL.x, K + BALL.r, BALL.z)
  ball.rotation.set(0.3, 0.5, 0.2)
  root.add(ball)
  solids.push(circle(BALL.x, BALL.z, BALL.r))
  // the flower bed: a raised planter against a garden wall, leaves and flowers of seven colours
  const bed = new THREE.Group()
  {
    const w = BED.x1 - BED.x0
    const planter = new THREE.Mesh(new THREE.BoxGeometry(w, BED.h, BED.d), paint('#7a4636', { roughness: 0.9 }))
    planter.position.y = K + BED.h / 2
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, BED.d - 0.1).rotateX(-Math.PI / 2), M.soil)
    soil.position.y = K + BED.h + 0.002
    bed.add(planter, soil)
    const rnd = random(31)
    const leafGeo = new THREE.IcosahedronGeometry(0.11, 0)
    const NL = light ? 22 : 40
    const leaves = new THREE.InstancedMesh(leafGeo, M.leaf, NL)
    const o = new THREE.Object3D()
    for (let i = 0; i < NL; i++) {
      o.position.set((rnd() - 0.5) * (w - 0.2), K + BED.h + 0.06 + rnd() * 0.08, (rnd() - 0.5) * (BED.d - 0.15))
      o.scale.set(1 + rnd() * 0.6, 0.6 + rnd() * 0.4, 1 + rnd() * 0.6)
      o.rotation.set(rnd(), rnd() * 6, rnd())
      o.updateMatrix()
      leaves.setMatrixAt(i, o.matrix)
    }
    const COLS = ['#d8222c', '#f2c21a', '#1f4fd0', '#ecebe2', '#e8649e', '#7432b4', '#ee761a']
    const NF = light ? 28 : 46
    const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 12, 8), paint('#ffffff', { roughness: 0.6 }), NF)
    const c = new THREE.Color()
    for (let i = 0; i < NF; i++) {
      o.position.set((rnd() - 0.5) * (w - 0.18), K + BED.h + 0.17 + rnd() * 0.12, (rnd() - 0.5) * (BED.d - 0.16))
      o.scale.set(1, 0.55, 1)
      o.rotation.set((rnd() - 0.5) * 0.6, 0, (rnd() - 0.5) * 0.6)
      o.updateMatrix()
      flowers.setMatrixAt(i, o.matrix)
      flowers.setColorAt(i, c.set(COLS[i % COLS.length]))
    }
    bed.add(leaves, flowers)
    bed.position.set((BED.x0 + BED.x1) / 2, 0, BED.z)
    root.add(bed)
    solids.push(box((BED.x0 + BED.x1) / 2, BED.z, w + 0.05, BED.d + 0.05))
  }
  // the bakery's yellow sign, red letters in a blue border, over the shop
  const sign = new THREE.Group()
  if (stage.shop) {
    const { x, z, y, w, h } = stage.shop
    const tex = canvasTex(1024, Math.round((1024 * h) / w), (g, cw, ch) => {
      g.fillStyle = '#1d3fa8'
      g.fillRect(0, 0, cw, ch)
      g.fillStyle = '#f4c41c'
      g.fillRect(14, 14, cw - 28, ch - 28)
      g.fillStyle = '#c41e24'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      let size = ch * 0.62
      g.font = `800 ${size}px Outfit, sans-serif`
      while (g.measureText(E.sign).width > cw * 0.86 && size > 20) g.font = `800 ${(size -= 4)}px Outfit, sans-serif`
      g.fillText(E.sign, cw / 2, ch * 0.54)
    })
    textures.push(tex)
    const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.1), M.dark)
    const front = new THREE.Mesh(new THREE.PlaneGeometry(w, h), paint('#ffffff', { map: tex, roughness: 0.55 }))
    front.position.z = 0.056
    sign.add(back, front)
    sign.position.set(x, y, z + 0.08)
    root.add(sign)
  }
  // the washing on a line in a front garden: red shirt, blue jeans, yellow towel, green dress, white sheet
  const wash = new THREE.Group()
  const pieces = []
  {
    for (const x of [WASH.x0, WASH.x1]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, WASH.y + 0.15 - K, 8), M.galv)
      p.position.set(x, K + (WASH.y + 0.15 - K) / 2, WASH.z)
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6).rotateX(Math.PI / 2), M.galv)
      bar.position.set(x, WASH.y + 0.04, WASH.z)
      wash.add(p, bar)
    }
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, WASH.x1 - WASH.x0, 6).rotateZ(Math.PI / 2), M.rope)
    rope.position.set((WASH.x0 + WASH.x1) / 2, WASH.y, WASH.z)
    wash.add(rope)
    const shirt = new THREE.Shape([[-0.22, 0], [-0.4, -0.06], [-0.46, -0.26], [-0.3, -0.3], [-0.24, -0.2], [-0.24, -0.68], [0.24, -0.68], [0.24, -0.2], [0.3, -0.3], [0.46, -0.26], [0.4, -0.06], [0.22, 0], [0.08, -0.06], [-0.08, -0.06]].map(([x, y]) => new THREE.Vector2(x, y)))
    const jeans = new THREE.Shape([[-0.26, 0], [0.26, 0], [0.28, -0.95], [0.06, -0.95], [0, -0.28], [-0.06, -0.95], [-0.28, -0.95]].map(([x, y]) => new THREE.Vector2(x, y)))
    const towel = new THREE.Shape([[-0.27, 0], [0.27, 0], [0.27, -0.78], [-0.27, -0.78]].map(([x, y]) => new THREE.Vector2(x, y)))
    const dress = new THREE.Shape([[-0.12, 0], [0.12, 0], [0.2, -0.3], [0.38, -0.98], [-0.38, -0.98], [-0.2, -0.3]].map(([x, y]) => new THREE.Vector2(x, y)))
    const sheet = new THREE.Shape([[-0.42, 0], [0.42, 0], [0.42, -1.02], [-0.42, -1.02]].map(([x, y]) => new THREE.Vector2(x, y)))
    const hang = [[shirt, '#cc2228', -4.35], [jeans, '#22408f', -3.6], [towel, '#f0c01c', -2.92], [dress, '#24924a', -2.25], [sheet, '#e6e4da', -1.48]]
    for (const [shape, col, x] of hang) {
      const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), paint(col, { side: THREE.DoubleSide, roughness: 0.9 }))
      const pivot = new THREE.Group()
      pivot.position.set(x, WASH.y - 0.01, WASH.z)
      pivot.add(m)
      wash.add(pivot)
      pieces.push({ pivot, phase: x * 1.7 })
    }
    root.add(wash)
  }
  updates.push((dt, t) => {
    for (const p of pieces) p.pivot.rotation.x = Math.sin(t * 0.9 + p.phase) * 0.06
  })

  // ---- colours that vanish: the white lamp and the things to ask about ----
  const lightNow = () => {
    const o = out()
    const na = o.na
    const led = LIGHTS.level * (I_LED / I_NA)
    if (na < 0.04 && led < 0.04) return 'dark'
    if (led < 0.25 * na) return 'na'
    if (na < 0.15 * led) return 'white'
    return 'both'
  }
  const coloursPanel = lv => ({
    title: E.colours.title,
    color,
    blocks: [
      {
        slider: {
          label: E.colours.slider,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(LIGHTS.level * 100),
          onInput: v => setLed(v / 100),
          format: v => `${Math.round(v)} %`,
          live: () => Math.round(LIGHTS.level * 100),
        },
      },
      { buttons: [{ label: E.colours.buttons.led, onClick: () => ledStep() }, { label: E.colours.buttons.na, onClick: () => lampStep() }] },
      ...paras(E.colours.panel[depth(lv)]),
    ],
  })
  function ledStep() {
    const on = LIGHTS.level < 0.02
    if (on) LIGHTS.level = LIGHTS.last > 0.05 ? LIGHTS.last : 1
    else {
      LIGHTS.last = LIGHTS.level
      LIGHTS.level = 0
    }
    play(on ? 'select' : 'tap')
    // white light alone shows the true colours; with the sodium lamp still on they come back yellowish
    say(at(E.colours.says[!on ? 'ledOff' : lightNow() === 'white' ? 'ledOn' : 'both'], level()))
    discover('colours', coloursPanel, 3.0, AT.colours)
    share('led')
  }
  // the slider sends a few times a second, the last value always
  let ledSend = null
  function setLed(v) {
    const was = LIGHTS.level
    LIGHTS.level = clamp(Number(v) || 0)
    if (LIGHTS.level > 0.05) LIGHTS.last = LIGHTS.level
    if ((was < 0.02) !== (LIGHTS.level < 0.02)) say(at(E.colours.says[LIGHTS.level < 0.02 ? 'ledOff' : lightNow() === 'white' ? 'ledOn' : 'both'], level()))
    ex.discover('colours')
    if (!ledSend) {
      ledSend = setTimeout(() => {
        ledSend = null
        share('led')
      }, 250)
    }
  }
  function thingTap(id) {
    const state = lightNow()
    const lv = level()
    if (state === 'dark' || state === 'both') say(at(E.colours.says[state], lv))
    else say(at(E.colours.things[id][state], lv))
    play('tap')
    discover('colours', coloursPanel, 4.0, AT.colours)
  }
  ex.add({
    id: 'colours',
    x: AT.colours.x,
    z: AT.colours.z,
    radius: 2.0,
    manual: true,
    label: E.colours.label,
    verb: () => E.colours.hints[LIGHTS.level < 0.02 ? (LAMP.on ? 'led' : 'lamp') : LAMP.on ? 'naOff' : 'things'],
    focus: { x: -0.6, y: 1.4, z: -4.6, size: 7.5 },
    act: () => ctx.showPanel(coloursPanel),
  })
  clickable(ledBox, () => ledStep(), { reach: 5 })
  clickable(ledHead, () => ledStep(), { when: () => !atScope(), reach: 9 })
  clickable(ledHead, () => look('led', true), { when: atScope, reach: 14 })
  const THINGS = { car, tree, ball, flowers: bed, sign, clothes: wash }
  for (const [id, thing] of Object.entries(THINGS)) clickable(thing, () => thingTap(id), { reach: 9 })

  // ======== the spectroscope on its tripod, and its screen ========
  const scope = new THREE.Group()
  const tubeG = new THREE.Group()
  tubeG.rotation.order = 'YXZ'
  {
    const brass = paint('#b8904a', { roughness: 0.35, metalness: 0.6, gloss: 0.6 })
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.4
      const foot = new THREE.Vector3(Math.cos(a) * 0.42, K, Math.sin(a) * 0.42)
      const top = new THREE.Vector3(0, SCOPE.y - 0.06, 0)
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, foot.distanceTo(top), 6), M.wood)
      leg.position.copy(foot).add(top).multiplyScalar(0.5)
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize())
      scope.add(leg)
    }
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), M.dark)
    head.position.y = SCOPE.y - 0.04
    scope.add(head)
    // the tube along -z of its group: slit end forward, eyepiece at the back
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 18).rotateX(Math.PI / 2), brass)
    const slit = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.05, 18).rotateX(Math.PI / 2), M.dark)
    slit.position.z = -0.26
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.08, 18).rotateX(Math.PI / 2), M.dark)
    eye.position.z = 0.28
    const prism = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.14), brass)
    prism.position.z = 0.08
    tubeG.add(body, slit, eye, prism)
    tubeG.position.y = SCOPE.y + 0.04
    scope.add(tubeG)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, SCOPE.y + 0.3, 10), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = (SCOPE.y + 0.3) / 2
    scope.add(hit)
    scope.position.set(SCOPE.x, 0, SCOPE.z)
    root.add(scope)
    solids.push(circle(SCOPE.x, SCOPE.z, 0.42))
  }
  const viewTex = canvasTex(CW, CH, null, { mipmaps: true })
  textures.push(viewTex)
  const scr = standingScreen({ width: 1.9, height: 1.3, color, title: E.scope.screen, line: '', titleSize: 0.1 }, { top: K + 1.5, tilt: 0.12, mat: M.dark })
  {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.76, (1.76 * CH) / CW), new THREE.MeshBasicMaterial({ map: viewTex, toneMapped: false }))
    plane.position.y = -0.08
    scr.content.add(plane)
    scr.group.position.set(SCREEN.x, 0, SCREEN.z)
    scr.group.rotation.y = Math.atan2(AT.scope.x - SCREEN.x, AT.scope.z - SCREEN.z)
    root.add(scr.group)
    solids.push(box(SCREEN.x, SCREEN.z, 0.5, 0.4))
  }
  const SC = { aim: 'na', open: false }
  const scopePanel = lv => ({
    title: E.scope.title,
    color,
    blocks: [{ buttons: [{ label: E.scope.buttons.na, onClick: () => look('na') }, { label: E.scope.buttons.led, onClick: () => look('led') }] }, ...paras(E.scope.panel[depth(lv)])],
  })
  /** What the spectroscope sees now, for its words and its screen. */
  const seen = () => {
    if (SC.aim === 'led') return LIGHTS.level < 0.02 ? 'off' : 'led'
    if (!LAMP.on) return 'off'
    return out().na < 0.3 ? 'neon' : 'na'
  }
  function look(which, byLamp = false) {
    SC.aim = which === 'led' ? 'led' : 'na'
    SC.open = true
    // tapped at the spectroscope, a lamp that is off switches on, to have something to look at
    if (byLamp && SC.aim === 'na' && !LAMP.on) lampStep()
    if (byLamp && SC.aim === 'led' && LIGHTS.level < 0.02) ledStep()
    say(at(E.scope.says[seen()], level()))
    play('tap')
    discover('scope', scopePanel, 3.0, AT.scope)
    share('scope')
  }
  const scopeTap = () => look(SC.open ? (SC.aim === 'na' ? 'led' : 'na') : SC.aim)
  ex.add({
    id: 'scope',
    x: AT.scope.x,
    z: AT.scope.z,
    radius: 1.6,
    manual: true,
    label: E.scope.label,
    verb: () => E.scope.hints[!SC.open ? 'look' : SC.aim === 'na' ? 'white' : 'sodium'],
    screens: [scr],
    focus: { x: (SCOPE.x + SCREEN.x) / 2, y: 1.45, z: SCREEN.z, size: 2.6 },
    act: () => ctx.showPanel(scopePanel),
  })
  clickable(scope, scopeTap)
  clickable(scr.group, scopeTap)
  let viewKey = ''
  const aimAt = { na: NA_POS, led: LED_POS }
  let yaw = 0
  let pitch = 0
  {
    const d = NA_POS.clone().sub(new THREE.Vector3(SCOPE.x, SCOPE.y, SCOPE.z))
    yaw = Math.atan2(-d.x, -d.z)
    pitch = Math.atan2(d.y, Math.hypot(d.x, d.z))
  }
  updates.push(dt => {
    const d = aimAt[SC.aim].clone().sub(new THREE.Vector3(SCOPE.x, SCOPE.y, SCOPE.z))
    yaw = damp(yaw, Math.atan2(-d.x, -d.z), 4, dt)
    pitch = damp(pitch, Math.atan2(d.y, Math.hypot(d.x, d.z)), 4, dt)
    tubeG.rotation.set(pitch, yaw, 0)
    // the screen, drawn again when what it shows has changed enough to see
    const lv = level()
    const o = out()
    const what = SC.open ? seen() : 'idle'
    const naVis = SC.aim === 'na' ? o.na : 0
    const neVis = SC.aim === 'na' ? clamp(o.ne / NEON) * (1 - 0.85 * o.na) : 0
    const key = `${what}|${SC.aim}|${Math.round(naVis * 16)}|${Math.round(neVis * 16)}|${Math.round(ledShown * 10)}|${lv}`
    if (key === viewKey) return
    viewKey = key
    const V = E.scope.view
    const title = what === 'idle' ? '' : E.scope.names[SC.aim]
    const caption = what === 'idle' ? V.idle : what === 'off' ? V.off : at(V[what], lv)
    viewTex.userData.redraw(g => drawView(g, { title, caption, src: what === 'idle' || what === 'off' ? null : SC.aim, naVis, neVis, led: ledShown, sci: lv === 'scientist' && what !== 'idle', zoom: V.zoom, lang }))
  })

  // ======== every frame: the lamps' light ========
  const tubeCol = new THREE.Color()
  const NA_SEEN = new THREE.Color('#ffb21e')
  const NE_SEEN = new THREE.Color('#ff3a5a')
  let shownMin = -1
  // the lever: up and a little forward when on, down when off
  const LEVER = { on: 0.35, off: Math.PI - 0.35 }
  let leverA = LEVER.off
  updates.push((dt, t) => {
    advanceLamp(dt)
    const o = out()
    // the run-up, told to whoever switched it on
    if (mineLamp && LAMP.on) {
      if (LAMP.w > 0.32 && !told.warm) {
        told.warm = true
        say(at(E.lamp.says.warm, level()))
      }
      if (LAMP.w >= 1 && !told.full) {
        told.full = true
        say(at(E.lamp.says.full, level()))
      }
    }
    // the tube's own glow: neon's pink first, sodium's yellow as it warms (above 1, so the bloom takes it)
    const neVis = clamp(o.ne / NEON)
    tubeCol.copy(NE_SEEN).multiplyScalar(1.35 * neVis * (1 - 0.8 * o.na)).add(NA_SEEN.clone().multiplyScalar(o.na > 0.003 ? 0.4 + 1.05 * Math.pow(o.na, 0.6) : 0))
    tubeMat.color.copy(tubeCol)
    haloMat.color.copy(NE_SEEN).multiplyScalar(0.3 * neVis).add(NA_SEEN.clone().multiplyScalar(0.24 * o.na))
    stage.lamps.set(0, { pos: lampA.pos, na: I_NA * o.na, ne: I_NA * o.ne })
    stage.lamps.set(2, { pos: lampB.pos, na: I_NA * o.na, ne: I_NA * o.ne })
    for (const l of [lampA, lampB]) {
      l.light.color.copy(LIGHT.na).multiplyScalar(o.na).add(LIGHT.ne.clone().multiplyScalar(o.ne))
      l.light.intensity = I_NA * 2.4
    }
    // the LED lights at once
    ledShown = damp(ledShown, LIGHTS.level, 12, dt)
    if (Math.abs(ledShown - LIGHTS.level) < 0.002) ledShown = LIGHTS.level
    stage.lamps.set(1, { pos: LED_POS, white: I_LED * ledShown })
    ledPanelMat.color.setRGB(1, 1, 1).multiplyScalar(ledShown > 0.001 ? 0.4 + 1.4 * ledShown : 0)
    ledHaloMat.color.setRGB(0.3, 0.32, 0.36).multiplyScalar(ledShown)
    ledLight.intensity = I_LED * 2.4 * ledShown
    ledBox.userData.dot.material.emissiveIntensity = ledShown > 0.02 ? 2 : 0
    // the switch's lever and the clock
    leverA = damp(leverA, LAMP.on ? LEVER.on : LEVER.off, 10, dt)
    lever.rotation.x = leverA
    const m = LAMP.on ? LAMP.m : 0
    // a stopwatch's hand: once round in 15 minutes, and on round again
    hand.rotation.z = -((m % DIAL) / DIAL) * TAU
    const whole = LAMP.on ? Math.floor(m) : -1
    if (whole !== shownMin) {
      shownMin = whole
      readout.text = LAMP.on ? `${whole} min` : ''
      readout.sync()
    }
  })
  updates.push((dt, t) => stage.update(t))

  // ---- shared with the room ----
  const lampState = () => ({ on: LAMP.on, m: Math.round(LAMP.m * 100) / 100, w: Math.round(LAMP.w * 1000) / 1000 })
  const lampSet = (s, liveSet, ago = 0) => {
    const on = !!s?.on
    if (liveSet && on !== LAMP.on) play(on ? 'select' : 'tap')
    LAMP.on = on
    LAMP.m = clamp(Number(s?.m) || 0, 0, 600)
    LAMP.w = clamp(Number(s?.w) || 0)
    // someone else's switch: the run-up is theirs to be told
    mineLamp = false
    told = { warm: true, full: true }
    for (let left = Math.min(Number(ago) || 0, 900); left > 0; left -= 0.5) advanceLamp(Math.min(0.5, left))
  }

  return {
    env: stage.env,
    solids,
    floor: stage.floor,
    cameraBounds: stage.cameraBounds,
    // the camera stays on the street's side of the frame (behind it, it would look through the swirl);
    // only there: along the rest of the pavement it may back off to the garden wall
    cameraClear(from, to) {
      const zf = BACK.z - 0.3
      if (to.z <= zf || from.z >= zf) return 1
      const k = (zf - from.z) / (to.z - from.z)
      const x = from.x + (to.x - from.x) * k
      const y = from.y + (to.y - from.y) * k
      return Math.abs(x - BACK.x) > 1.9 || y > 3.1 ? 1 : k
    },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes: what a tap on each thing does (shot.py cannot move the mouse), and where things are
    parts: {
      lamp: {
        tap: () => lampStep(), // the switch on the post
        // run the clock on (and tell the room, so everyone's lamp has run on alike)
        skip: minutes => {
          advanceLamp(((Number(minutes) || 0) * 60) / SPEED)
          share('lamp')
        },
        get state() { return lampState() },
      },
      led: {
        tap: () => ledStep(), // the white lamp or its switch
        set: v => setLed(v), // the panel's slider, 0..1
        get level() { return LIGHTS.level },
      },
      thing: id => thingTap(id), // 'car' | 'tree' | 'ball' | 'flowers' | 'sign' | 'clothes'
      scope: {
        tap: () => scopeTap(), // the spectroscope or its screen
        look: which => look(which, true), // a lamp tapped while standing at it: 'na' | 'led'
        get state() { return { ...SC, seen: seen() } },
      },
      light: () => lightNow(),
      at: {
        switch: () => switchBox.getWorldPosition(new THREE.Vector3()),
        lantern: () => HEAD.clone(),
        ledHead: () => LED.head.clone(),
        ledBox: () => ledBox.getWorldPosition(new THREE.Vector3()),
        car: () => car.getWorldPosition(new THREE.Vector3()).setY(0.8),
        ball: () => ball.getWorldPosition(new THREE.Vector3()),
        scope: () => tubeG.getWorldPosition(new THREE.Vector3()),
      },
      // a ray from the camera to a point, as a tap there would cast
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { lamp: lampPanel, colours: coloursPanel, scope: scopePanel },
    shared: {
      lamp: { get: lampState, set: lampSet },
      led: {
        get: () => ({ level: Math.round(LIGHTS.level * 100) / 100 }),
        set: s => {
          LIGHTS.level = clamp(Number(s?.level) || 0)
          if (LIGHTS.level > 0.05) LIGHTS.last = LIGHTS.level
        },
      },
      scope: {
        get: () => ({ aim: SC.aim, open: SC.open }),
        set: s => {
          SC.aim = s?.aim === 'led' ? 'led' : 'na'
          SC.open = !!s?.open
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
