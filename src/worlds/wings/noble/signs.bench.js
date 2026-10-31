// The filling bench (against the west wall) and the radon box at its end.
// - The bench: five glass tubes on the wall, each bent into its gas's symbol (He, Ne, Ar, Kr, Xe), a
//   glass manifold with a flask of each gas, a vacuum pump, a pressure gauge in millibar and a
//   high-voltage transformer. Filling one is three steps, each its own tap (the user, 2026-10-30): the
//   pump empties the line (the gauge falls to 0), a gas's flask lets that gas into its tube (up to about
//   10 mbar), the high-voltage box lights it (it flickers alight in its colour). Out of order nothing
//   happens and the world says why (air still in, no gas yet); with none waiting, the box switches the
//   lit tubes off. `hits` are the things to tap.
// - The radon box: a lead cabinet with a lead-glass window and the radiation sign; inside, a sealed
//   ampoule and a tube bent as "Rn" that is never lit. A Geiger counter clicks when tapped. On the wall,
//   radon's lines as scientists measured them in sealed tubes.
// Both are built in a frame whose z = 0 is the wall and +z points into the room.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { play } from '../../../audio/sound.js'
import { neonSign } from './neonTube.js'
import { SIGN_GASES, glowOf } from './nobleData.js'
import { canvasTex, screen, damp, clamp, hdr, random } from './kit.js'
import { drawLines, drawScale, gasLines } from './spectrumCanvas.js'

const TOP = 0.955 // the bench top's height
const SPACING = 0.92
const symbolX = i => (i - 2) * SPACING

/** A dial face: 0 to 20 mbar on 225 degrees, then "air" pinned at the end. */
function gaugeFace(words) {
  return canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#f2ecdc'
    g.beginPath()
    g.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2)
    g.fill()
    const ang = v => Math.PI * 0.75 + (v / 20) * Math.PI * 1.25 // canvas angles: clockwise from +x
    g.strokeStyle = '#2a2a2a'
    g.fillStyle = '#2a2a2a'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = '700 24px Outfit, sans-serif'
    for (let v = 0; v <= 20; v++) {
      const a = ang(v)
      const r0 = s / 2 - (v % 5 ? 26 : 36)
      g.lineWidth = v % 5 ? 2 : 4
      g.beginPath()
      g.moveTo(s / 2 + Math.cos(a) * r0, s / 2 + Math.sin(a) * r0)
      g.lineTo(s / 2 + Math.cos(a) * (s / 2 - 14), s / 2 + Math.sin(a) * (s / 2 - 14))
      g.stroke()
      if (v % 5 === 0) g.fillText(String(v), s / 2 + Math.cos(a) * (s / 2 - 56), s / 2 + Math.sin(a) * (s / 2 - 56))
    }
    // the stop for air (far off the scale: 1013 mbar)
    const aa = Math.PI * 0.75 + Math.PI * 1.45
    g.fillStyle = '#b3261e'
    g.beginPath()
    g.arc(s / 2 + Math.cos(aa) * (s / 2 - 22), s / 2 + Math.sin(aa) * (s / 2 - 22), 7, 0, Math.PI * 2)
    g.fill()
    g.font = '700 20px Outfit, sans-serif'
    g.fillText(words.air, s / 2 + Math.cos(aa) * (s / 2 - 52), s / 2 + Math.sin(aa) * (s / 2 - 52))
    g.fillStyle = '#2a2a2a'
    g.font = '700 26px Outfit, sans-serif'
    g.fillText('mbar', s / 2, s / 2 + 52)
  })
}

/** A yellow sign with a black symbol: the high-voltage bolt or the radiation trefoil, and a word. */
function warningSign(kind, word) {
  return canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#ffd21f'
    g.fillRect(0, 0, s, s)
    g.fillStyle = '#111'
    g.strokeStyle = '#111'
    if (kind === 'bolt') {
      g.lineWidth = 12
      g.lineJoin = 'round'
      g.beginPath()
      g.moveTo(s / 2, 26)
      g.lineTo(s - 34, s - 66)
      g.lineTo(34, s - 66)
      g.closePath()
      g.stroke()
      g.beginPath()
      g.moveTo(s / 2 + 12, 70)
      g.lineTo(s / 2 - 20, 130)
      g.lineTo(s / 2 + 6, 130)
      g.lineTo(s / 2 - 12, 170)
      g.lineTo(s / 2 + 26, 116)
      g.lineTo(s / 2, 116)
      g.closePath()
      g.fill()
    } else {
      const cx = s / 2
      const cy = 104
      for (let k = 0; k < 3; k++) {
        const a = -Math.PI / 2 + (k * Math.PI * 2) / 3
        g.beginPath()
        g.moveTo(cx + Math.cos(a - 0.52) * 24, cy + Math.sin(a - 0.52) * 24)
        g.arc(cx, cy, 78, a - 0.52, a + 0.52)
        g.arc(cx, cy, 24, a + 0.52, a - 0.52, true)
        g.closePath()
        g.fill()
      }
      g.beginPath()
      g.arc(cx, cy, 15, 0, Math.PI * 2)
      g.fill()
    }
    g.font = `700 ${word.length > 10 ? 26 : 30}px Outfit, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(word, s / 2, s - 30)
  })
}

// ---------------------------------------------------------------------------------------------------
/** The filling bench. `start` is the gas whose hall the visitor came from (its tube is filled first). */
export function fillingBench({ mats, words, level, light, start }) {
  const group = new THREE.Group()
  // the bench
  const top = new THREE.Mesh(new RoundedBoxGeometry(4.7, 0.07, 0.85, 2, 0.02), mats.top)
  top.position.set(0, TOP - 0.035, 0.45)
  group.add(top)
  const shelf = new THREE.Mesh(new RoundedBoxGeometry(4.5, 0.04, 0.7, 2, 0.015), mats.top)
  shelf.position.set(0, 0.25, 0.45)
  group.add(shelf)
  for (const lx of [-2.25, 2.25]) {
    for (const lz of [0.09, 0.81]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, TOP - 0.07, 0.06), mats.dark)
      leg.position.set(lx, (TOP - 0.07) / 2, lz)
      group.add(leg)
    }
  }

  // the five tubes, bent into the symbols, on the wall
  const tubes = SIGN_GASES.map((sym, i) => {
    const sign = neonSign({ text: sym, cap: 0.46, radius: 0.014, light, color: glowOf(sym), postMat: mats.dark })
    sign.group.position.set(symbolX(i), 1.5, 0)
    group.add(sign.group)
    return { sym, sign, k: 0, want: 0, flick: 0 }
  })

  // the manifold, the stems up to the tubes, a flask of each gas, the valves
  const manifoldY = 1.2
  const manifoldZ = 0.17
  const glassTube = (len, r) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mats.glass)
  const manifold = glassTube(4.3, 0.013)
  manifold.rotation.z = Math.PI / 2
  manifold.position.set(0, manifoldY, manifoldZ)
  manifold.renderOrder = 3
  group.add(manifold)
  const valves = []
  const flasks = []
  SIGN_GASES.forEach((sym, i) => {
    const x = symbolX(i)
    const stem = glassTube(0.34, 0.006)
    stem.position.set(x - 0.32, manifoldY + 0.17, manifoldZ * 0.5)
    stem.renderOrder = 3
    group.add(stem)
    // the flask on the bench below the manifold, its neck reaching up to it
    const flask = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 14), mats.glass)
    flask.position.set(x, TOP + 0.085, manifoldZ + 0.12)
    flask.renderOrder = 3
    const neck = glassTube(0.09, 0.022)
    neck.position.set(x, TOP + 0.21, manifoldZ + 0.12)
    neck.renderOrder = 3
    // a faint glow of the gas inside, so the flask reads as full
    const inside = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), new THREE.MeshBasicMaterial({ color: hdr(glowOf(sym), 0.35), transparent: true, opacity: 0.35, depthWrite: false }))
    inside.position.copy(flask.position)
    group.add(inside, flask, neck)
    const tag = makeText(sym, { size: 0.05, color: '#1a1a22' })
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.07), mats.paper)
    label.position.set(x, TOP + 0.085, manifoldZ + 0.12 + 0.088)
    tag.position.set(x, TOP + 0.085, manifoldZ + 0.12 + 0.09)
    group.add(label, tag)
    flasks.push(inside)
    // the valve between flask and manifold: a brass tap that turns
    const tap = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.05, 10), mats.brass)
    body.rotation.x = Math.PI / 2
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.016), mats.brass)
    handle.position.z = 0.03
    tap.add(body, handle)
    tap.position.set(x + 0.08, manifoldY, manifoldZ + 0.03)
    group.add(tap)
    valves.push(handle)
  })

  // the vacuum pump under the south end, with its spinning wheel and a hose up to the manifold
  const pump = new THREE.Group()
  const pumpBody = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.32, 0.34, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#2f5a46', roughness: 0.45, metalness: 0.4 }))
  pumpBody.position.y = 0.43
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 18), mats.dark)
  motor.rotation.z = Math.PI / 2
  motor.position.set(0.0, 0.7, 0)
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 20), mats.metal)
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(-0.27, 0.43, 0)
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.2, 0.02), mats.dark)
  spoke.position.x = -0.02
  wheel.add(spoke)
  pump.add(pumpBody, motor, wheel)
  pump.position.set(-1.75, 0, 0.5)
  group.add(pump)
  const hose = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.75, 0.62, 0.42), new THREE.Vector3(-1.95, 0.75, 0.25), new THREE.Vector3(-2.18, 0.98, 0.17), new THREE.Vector3(-2.15, manifoldY, manifoldZ),
    ]), 20, 0.018, 8),
    mats.black,
  )
  group.add(hose)

  // the gauge on a post at the north end of the bench
  const gauge = new THREE.Group()
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.12, 40), new THREE.MeshBasicMaterial({ map: gaugeFace(words) }))
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.012, 8, 40), mats.brass)
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.1, 0.004), new THREE.MeshBasicMaterial({ color: '#b3261e' }))
  needle.geometry.translate(0, 0.04, 0)
  needle.position.z = 0.006
  gauge.add(face, bezel, needle)
  gauge.position.set(2.0, 1.32, 0.42)
  gauge.rotation.x = -0.2
  const gaugePost = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.37, 8), mats.brass)
  gaugePost.position.set(2.0, TOP + 0.18, 0.4)
  group.add(gauge, gaugePost)
  const needleAt = mbar => {
    // 0..20 mbar over 225 degrees from the lower left; above 20 it rests on the air stop
    const v = Math.min(mbar, 23.2)
    const a = Math.PI * 0.75 + (v / 20) * Math.PI * 1.25
    needle.rotation.z = -a - Math.PI / 2
  }

  // the high-voltage transformer on the floor at the north end, its pilot lamp and its cables
  const hv = new THREE.Group()
  const hvBox = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.34, 0.32, 2, 0.03), mats.black)
  hvBox.position.y = 0.17
  const hvSign = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), new THREE.MeshBasicMaterial({ map: warningSign('bolt', words.hv) }))
  hvSign.position.set(0, 0.19, 0.162)
  const pilotMat = new THREE.MeshStandardMaterial({ color: '#3a0d0d', emissive: '#ff2a1a', emissiveIntensity: 0 })
  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), pilotMat)
  pilot.position.set(0.15, 0.36, 0.1)
  hv.add(hvBox, hvSign, pilot)
  hv.position.set(1.75, 0, 0.55)
  group.add(hv)
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.75, 0.34, 0.45), new THREE.Vector3(2.3, 0.5, 0.2), new THREE.Vector3(2.32, 1.4, 0.03), new THREE.Vector3(2.3, 2.12, 0.03), new THREE.Vector3(1.9, 2.15, 0.03),
    ]), 24, 0.012, 6),
    mats.black,
  )
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 4.2, 6), mats.black)
  rail.rotation.z = Math.PI / 2
  rail.position.set(-0.2, 2.15, 0.03)
  group.add(cable, rail)

  // the bench's screen on the wall above the tubes
  const scr = screen({ width: 3.2, height: 0.62, color: '#ff8a5c', title: words.title, line: '', titleSize: 0.15, lineSize: 0.07 })
  scr.group.position.set(0, 2.62, 0.05)
  group.add(scr.group)

  // the light of the lit tubes on the bench and the wall
  const glow = new THREE.PointLight('#ffffff', 0, 6, 2)
  glow.position.set(0, 1.75, 0.7)
  group.add(glow)
  const mix = new THREE.Color()

  // things to tap (the user, 2026-10-30: each step chosen by touching its thing): the pump, each gas's
  // flask and the tube bent as its symbol, the high-voltage box. Invisible boxes a little larger than the
  // things, so a finger finds them.
  const hitMat = new THREE.MeshBasicMaterial({ visible: false })
  const hitBox = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), hitMat)
    m.position.set(x, y, z)
    group.add(m)
    return m
  }
  const hits = {
    pump: hitBox(0.66, 0.62, 0.5, -1.75, 0.5, 0.5),
    hv: hitBox(0.56, 0.5, 0.46, 1.75, 0.24, 0.55),
    flasks: SIGN_GASES.map((s, i) => hitBox(0.3, 0.36, 0.34, symbolX(i), TOP + 0.15, manifoldZ + 0.12)),
    tubes: SIGN_GASES.map((s, i) => hitBox(0.86, 0.62, 0.14, symbolX(i), 1.75, 0.06)),
  }

  // state: what the line (the manifold and the unlit tubes) holds: 'air' at rest, 'empty' once pumped,
  // or a gas let in and waiting for the high voltage; and the tubes lit. Each step is its own tap: pump,
  // a gas, the high voltage (the screen above says so); the animation of a step runs by itself.
  const order = [...SIGN_GASES]
  while (order[0] !== (SIGN_GASES.includes(start) ? start : 'He')) order.push(order.shift())
  let phase = 'idle' // 'pump' | 'fill' | 'spark' while a step plays
  let phaseT = 0
  let current = null // the gas being let in or lit
  let line = 'air'
  let mbar = 30 // resting on the air stop
  let wheelSpin = 0
  let mine = true // the step playing was this visitor's (not someone else's in the room)
  const valveTurn = SIGN_GASES.map(() => 0)
  const rnd = random(7)
  const isGas = s => SIGN_GASES.includes(s)
  const tubeOf = s => tubes[SIGN_GASES.indexOf(s)]
  const litNow = () => SIGN_GASES.filter((s, i) => tubes[i].want === 1 || (phase === 'spark' && s === current))
  const restOf = l => (l === 'air' ? 30 : l === 'empty' ? 0 : 10)
  const begin = (p, gas = null, own = true) => {
    phase = p
    phaseT = 0
    current = gas
    mine = own
  }
  const allOff = () => {
    for (const t of tubes) t.want = 0
    play('part')
  }
  const api = {
    group,
    screen: scr,
    light: glow,
    hits,
    onLit: null,
    get busy() {
      return phase !== 'idle'
    },
    /** What the line holds: 'air', 'empty' (pumped) or the gas waiting for the voltage. */
    get line() {
      return line
    },
    /** The next tube to light, in the visitor's order (their gas first), for the probes. */
    get next() {
      return order.find(s => tubeOf(s).want === 0) ?? null
    },
    get lit() {
      return tubes.filter(t => t.want === 1).length
    },
    isLit: s => tubeOf(s)?.want === 1,
    get current() {
      return current
    },
    /** The pump: empties the line and any gas waiting in it. false while a step plays. */
    pump() {
      if (phase !== 'idle') return false
      line = 'empty'
      begin('pump')
      play('tap')
      return 'pumped'
    },
    /** A gas's flask (or its tube): lets that gas into its tube, once the air is out. Returns what
     *  happened: 'filled', or why not ('air': pump first; 'waiting': another gas waits for the voltage;
     *  'lit': that tube already glows), false while a step plays. */
    fill(gas) {
      if (phase !== 'idle') return false
      if (!isGas(gas)) return 'air'
      if (tubeOf(gas).want === 1) return 'lit'
      if (line === 'air') return 'air'
      if (isGas(line)) return line === gas ? 'filled' : 'waiting'
      line = gas
      begin('fill', gas)
      play('tap')
      return 'filled'
    },
    /** The high-voltage box: lights the gas waiting in its tube; with none waiting, switches the lit
     *  tubes off; with none lit, nothing glows ('air': no glow at air pressure; 'empty': no gas). */
    power() {
      if (phase !== 'idle') return false
      if (isGas(line)) {
        const gas = line
        line = 'air'
        begin('spark', gas)
        play('select')
        return 'lit'
      }
      if (api.lit) {
        allOff()
        return 'off'
      }
      play('tap')
      return line
    },
    /** For the probes and shared_probe's workshop scenario: the step the prompt names next. */
    act() {
      if (phase !== 'idle') return false
      if (isGas(line)) return api.power()
      if (line === 'empty') return api.next ? api.fill(api.next) : api.power()
      return api.next ? api.pump() : api.power()
    },
    /** The tubes lit (and the one lighting) and what the line holds, for the others in a room
     *  (src/net/shared.js). */
    state() {
      return { lit: litNow(), line }
    },
    /** Someone else's bench: their step plays here as it happens (onLit hears it is not mine); a
     *  newcomer's, or a step missed while another played, is shown at once. */
    setState({ lit = [], line: ln = 'air' } = {}, live = false) {
      const want = new Set((Array.isArray(lit) ? lit : []).filter(isGas))
      const to = ln === 'empty' || isGas(ln) ? ln : 'air'
      const have = new Set(litNow())
      const added = [...want].filter(s => !have.has(s))
      const gone = [...have].filter(s => !want.has(s))
      if (!added.length && !gone.length && to === line) return
      if (live && phase === 'idle') {
        const same = !added.length && !gone.length
        if (same && to === 'empty') {
          line = 'empty'
          begin('pump', null, false)
          play('tap')
          return
        }
        if (same && isGas(to) && line === 'empty' && tubeOf(to).want === 0) {
          line = to
          begin('fill', to, false)
          play('tap')
          return
        }
        if (added.length === 1 && !gone.length && added[0] === line && to === 'air') {
          line = 'air'
          begin('spark', added[0], false)
          play('select')
          return
        }
        if (!want.size && have.size && to === line) return void allOff()
      }
      begin('idle', null)
      line = to
      mbar = restOf(to)
      valveTurn.fill(0)
      for (const tube of tubes) {
        tube.want = want.has(tube.sym) ? 1 : 0
        tube.k = tube.want
      }
    },
    refresh() {
      scr.set({ line: level() === 'scientist' ? words.screen.sci : words.screen.kid })
    },
    update(dt, t) {
      phaseT += dt
      const i = current ? SIGN_GASES.indexOf(current) : -1
      if (phase === 'pump') {
        mbar = damp(mbar, 0, 4, dt)
        wheelSpin += dt * 22
        if (phaseT > 1.3) begin('idle')
      } else if (phase === 'fill') {
        // the flask's tap opens, the gas goes in up to about 10 mbar, the tap closes
        mbar = damp(mbar, 10, 3.5, dt)
        valveTurn[i] = phaseT < 0.5 ? clamp(phaseT / 0.3) : clamp(1 - (phaseT - 0.5) / 0.4)
        if (phaseT > 0.9) {
          valveTurn[i] = 0
          begin('idle')
        }
      } else if (phase === 'spark') {
        const tube = tubes[i]
        tube.flick += dt
        if (tube.flick > 0.06) {
          tube.flick = 0
          tube.k = phaseT < 0.7 ? (rnd() < 0.5 ? 0.15 + rnd() * 0.4 : 1) : 1
        }
        if (phaseT > 0.9) {
          tube.k = 1
          tube.want = 1
          phase = 'idle'
          phaseT = 0
          const sym = current
          current = null
          api.onLit?.(sym, mine)
        }
      } else mbar = damp(mbar, restOf(line), 1.2, dt)
      wheel.rotation.x = wheelSpin
      needleAt(mbar)
      pilotMat.emissiveIntensity = phase === 'spark' ? 3 : api.lit ? 1.6 : 0
      SIGN_GASES.forEach((_, j) => {
        valves[j].rotation.z = valveTurn[j] * Math.PI / 2
      })
      // the tubes: lit ones glow steadily (a faint shimmer), switched-off ones fade out
      let r = 0
      let g = 0
      let b = 0
      let n = 0
      tubes.forEach((tube, j) => {
        if (!(phase === 'spark' && j === i)) tube.k = damp(tube.k, tube.want, tube.want ? 8 : 5, dt)
        const shimmer = tube.want ? 0.97 + 0.03 * Math.sin(t * 50 + j * 7) : 1
        tube.sign.setAll(tube.k * shimmer)
        if (tube.k > 0.01) {
          mix.set(glowOf(tube.sym))
          r += mix.r * tube.k
          g += mix.g * tube.k
          b += mix.b * tube.k
          n += tube.k
        }
      })
      if (n > 0) glow.color.setRGB(r / n, g / n, b / n)
      glow.intensity = n * (light ? 2.2 : 1.6)
    },
  }
  api.refresh()
  needleAt(mbar)
  return api
}

// ---------------------------------------------------------------------------------------------------
/** The radon box: lead cabinet, lead-glass window, the radiation sign, a Geiger counter and a screen
 *  with radon's lines. */
export function radonBox({ mats, words, line, light }) {
  const group = new THREE.Group()
  // the table
  const tTop = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.06, 0.7, 2, 0.02), mats.top)
  tTop.position.set(0, 0.8, 0.4)
  group.add(tTop)
  for (const lx of [-0.52, 0.52]) {
    for (const lz of [0.1, 0.7]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.77, 0.05), mats.dark)
      leg.position.set(lx, 0.385, lz)
      group.add(leg)
    }
  }
  // the cabinet: thick lead walls (grey), the window of lead glass in front
  const lead = new THREE.MeshStandardMaterial({ color: '#5d6068', roughness: 0.55, metalness: 0.65 })
  const cab = new THREE.Group()
  const W = 0.66
  const H = 0.5
  const D = 0.46
  const wall = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lead)
    m.position.set(x, y, z)
    cab.add(m)
  }
  wall(W, 0.06, D, 0, H - 0.03, 0)
  wall(W, 0.06, D, 0, 0.03, 0)
  wall(0.07, H, D, -W / 2 + 0.035, H / 2, 0)
  wall(0.07, H, D, W / 2 - 0.035, H / 2, 0)
  wall(W, H, 0.07, 0, H / 2, -D / 2 + 0.035)
  // the frame round the window
  wall(W, 0.07, 0.05, 0, H - 0.035, D / 2 - 0.025)
  wall(W, 0.07, 0.05, 0, 0.035, D / 2 - 0.025)
  const leadGlass = new THREE.Mesh(new THREE.BoxGeometry(W - 0.14, H - 0.14, 0.045), new THREE.MeshStandardMaterial({ color: '#e0c98a', roughness: 0.06, transparent: true, opacity: 0.32, depthWrite: false }))
  leadGlass.position.set(0, H / 2, D / 2 - 0.03)
  leadGlass.renderOrder = 4
  cab.add(leadGlass)
  // inside: a sealed ampoule and the tube bent as Rn, never lit
  const amp = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.12, 6, 12), mats.glass)
  amp.position.set(0.17, 0.16, 0.02)
  amp.renderOrder = 3
  cab.add(amp)
  const rn = neonSign({ text: 'Rn', cap: 0.17, radius: 0.007, light, color: glowOf('Rn'), postMat: mats.dark, standoff: 0.03 })
  rn.group.position.set(-0.07, 0.17, -D / 2 + 0.07)
  cab.add(rn.group)
  cab.position.set(-0.15, 0.83, 0.38)
  group.add(cab)
  // the radiation sign standing on top
  const signMat = new THREE.MeshBasicMaterial({ map: warningSign('trefoil', words.sign), color: new THREE.Color(1, 1, 1) })
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), signMat)
  sign.position.set(-0.15, 0.83 + H + 0.17, 0.5)
  sign.rotation.x = -0.12
  group.add(sign)
  // the Geiger counter: a box with a dial and a red lamp, its probe on a cable
  const geiger = new THREE.Group()
  const gBox = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.12, 0.15, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#c9a23a', roughness: 0.5, metalness: 0.2 }))
  gBox.position.y = 0.06
  const dial = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.07), mats.paper)
  dial.position.set(-0.02, 0.07, 0.076)
  const gNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.05, 0.002), mats.black)
  gNeedle.geometry.translate(0, 0.022, 0)
  gNeedle.position.set(-0.02, 0.045, 0.078)
  const ledMat = new THREE.MeshStandardMaterial({ color: '#400', emissive: '#ff2020', emissiveIntensity: 0 })
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), ledMat)
  led.position.set(0.07, 0.09, 0.076)
  const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 12), mats.metal)
  probe.rotation.z = Math.PI / 2
  probe.position.set(-0.05, 0.02, 0.15)
  geiger.add(gBox, dial, gNeedle, led, probe)
  geiger.position.set(0.38, 0.83, 0.48)
  geiger.rotation.y = -0.35
  group.add(geiger)

  // the screen on the wall: radon's lines
  const scr = screen({ width: 1.7, height: 0.86, color: '#ff6f86', title: words.title, line: '', titleSize: 0.1, lineSize: 0.055 })
  scr.group.position.set(-0.05, 2.3, 0.05)
  group.add(scr.group)
  const bandTex = canvasTex(1024, 300, (g, w, h) => {
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#ffb0be'
    g.font = '700 34px Outfit, sans-serif'
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.fillText(words.lines, 40, 18)
    drawLines(g, gasLines('Rn'), { x: 40, y: 70, w: w - 80, h: 110, width: 5 })
    drawScale(g, { x: 40, y: 186, w: w - 80, size: 24, rainbow: 8 })
  })
  const band = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.44), new THREE.MeshBasicMaterial({ map: bandTex }))
  band.position.set(0, -0.15, 0.002)
  scr.content.add(band)

  // things to tap: the Geiger counter (a box round it and its probe, larger than the counter, so a finger
  // finds it) and the lead cabinet
  const geigerHit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.4), new THREE.MeshBasicMaterial({ visible: false }))
  geigerHit.position.set(0.38, 0.95, 0.5)
  group.add(geigerHit)

  let clicks = 0
  let count = 0 // measurements made, for the others in a room
  let nextClick = 0
  let flash = 0
  let swing = 0
  const rnd = random(31)
  const api = {
    group,
    screen: scr,
    hits: { geiger: geigerHit, cabinet: cab },
    get busy() {
      return clicks > 0
    },
    measure() {
      if (clicks > 0) return false
      clicks = 22
      nextClick = 0
      count++
      return true
    },
    state() {
      return { n: count }
    },
    /** Someone else measured: the counter clicks here too. */
    setState({ n = 0 } = {}, live = false) {
      if (live && n !== count && clicks === 0) api.measure()
      count = n
    },
    refresh() {
      scr.set({ line: line() })
    },
    update(dt) {
      if (clicks > 0) {
        nextClick -= dt
        if (nextClick <= 0) {
          clicks--
          // random, like real decays: exponential waiting times
          nextClick = -Math.log(1 - rnd() * 0.95) * 0.11
          flash = 1
          play('tap')
        }
        swing = damp(swing, 0.55 + 0.25 * Math.sin(clicks * 1.7), 6, dt)
      } else swing = damp(swing, 0.08, 2, dt)
      flash = damp(flash, 0, 18, dt)
      ledMat.emissiveIntensity = flash * 4
      gNeedle.rotation.z = 0.8 - swing * 1.6
      // the sign brightens a little with each click (not enough to bloom over the screen)
      const k = 0.85 + (clicks > 0 ? 0.15 + 0.12 * flash : 0)
      signMat.color.setScalar(k)
    },
  }
  return api
}
