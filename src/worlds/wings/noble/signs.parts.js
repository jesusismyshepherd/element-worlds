// The name wall, the history board and the balloons.
// - The name wall: the visitor's word bent in tubing across the north wall, lit letter by letter in the
//   gas they choose; below it the sign-maker's desk with the full-size pattern of the word on paper.
// - The history board: a black board in the north-east corner with three signs lit in turn, 1898 (in
//   krypton's white: liquid air), 1910 (in neon's red: Claude's tubes) and TODAY (in the colours of
//   coated tubes: argon, mercury and a phosphor).
// - The balloons: one of each sign gas on a round table; let go, they rise or fall at the speed the
//   physics gives (nobleData.js balloonOf: buoyancy, weight and the drag of the air).
// Each is built in a frame whose +z points to the visitor.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { play } from '../../../audio/sound.js'
import { neonSign } from './neonTube.js'
import { layoutText } from './tubeFont.js'
import { SIGN_GASES, glowOf, balloonOf, stepBalloon } from './nobleData.js'
import { canvasTex, screen, standingScreen, damp, random } from './kit.js'

// ---------------------------------------------------------------------------------------------------
/** The word on the north wall and the desk below it. The wall's frame: z = 0 is the wall. */
export function nameWall({ mats, words, light, text, color, maxWidth = 10.4 }) {
  const group = new THREE.Group()
  const sign = neonSign({ text, cap: 0.95, radius: 0.025, light, color, postMat: mats.dark, standoff: 0.08, maxWidth })
  sign.group.position.set(0, 2.9, 0)
  group.add(sign.group)
  // a dark rail under the word, where the electrode housings would be
  const rail = new THREE.Mesh(new RoundedBoxGeometry(1, 0.08, 0.06, 2, 0.02), mats.dark)
  rail.position.set(0, 2.72, 0.04)
  group.add(rail)
  const glowLight = new THREE.PointLight(color, 0, 9, 2)
  glowLight.position.set(0, 3.3, 1.4)
  group.add(glowLight)

  // the desk: a slanted drawing table with the pattern of the word, a screen beside it
  const desk = new THREE.Group()
  const top = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.05, 1.0, 2, 0.02), mats.top)
  top.rotation.x = 0.32
  top.position.set(0, 0.95, 0)
  desk.add(top)
  for (const lx of [-0.92, 0.92]) {
    for (const lz of [-0.4, 0.4]) {
      const h = lz < 0 ? 1.08 : 0.8
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.05), mats.dark)
      leg.position.set(lx, h / 2, lz)
      desk.add(leg)
    }
  }
  const patternTex = canvasTex(1024, 512)
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), new THREE.MeshBasicMaterial({ map: patternTex, color: '#6f6b62' }))
  paper.rotation.x = -Math.PI / 2 + 0.32
  paper.position.set(0, 0.978, 0.008)
  desk.add(paper)
  const drawPattern = word => {
    patternTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#efe9da'
      g.fillRect(0, 0, w, h)
      // a grid, as on a sign-maker's paper
      g.strokeStyle = 'rgba(80, 110, 160, 0.25)'
      g.lineWidth = 1
      for (let x = 0; x < w; x += 32) {
        g.beginPath()
        g.moveTo(x, 0)
        g.lineTo(x, h)
        g.stroke()
      }
      for (let y = 0; y < h; y += 32) {
        g.beginPath()
        g.moveTo(0, y)
        g.lineTo(w, y)
        g.stroke()
      }
      const lay = layoutText(word || ' ')
      const span = Math.max(lay.width, 1)
      const s = Math.min((w - 120) / span, (h - 160) / 7.5)
      const ox = (w - span * s) / 2
      const oy = h / 2 + 3 * s
      g.strokeStyle = '#1e2433'
      g.lineWidth = Math.max(3, s * 0.32)
      g.lineCap = 'round'
      g.lineJoin = 'round'
      for (const gl of lay.glyphs) {
        for (const st of gl.strokes) {
          g.beginPath()
          st.pts.forEach(([x, y], i) => (i ? g.lineTo(ox + x * s, oy - y * s) : g.moveTo(ox + x * s, oy - y * s)))
          if (st.closed) g.closePath()
          g.stroke()
        }
      }
    })
  }
  drawPattern(text)
  desk.position.set(0, 0, 2.05)
  group.add(desk)
  const scr = standingScreen({ width: 1.55, height: 0.62, color: '#ff8a5c', title: words.title, line: '', titleSize: 0.1, lineSize: 0.06 }, { top: 1.4, tilt: 0.3, mat: mats.dark })
  scr.group.position.set(-2.1, 0, 2.0)
  scr.group.rotation.y = 0.5
  group.add(scr.group)

  // lighting the word letter by letter: each glyph flickers, then holds
  let want = 1
  let litAt = null // seconds since the lighting started
  const rnd = random(5)
  const flick = []
  const setRail = () => {
    rail.scale.x = Math.max(0.3, sign.width + 0.3)
  }
  setRail()
  for (let i = 0; i < sign.count; i++) sign.setGlow(i, 1)

  return {
    group,
    screen: scr,
    sign,
    get lighting() {
      return litAt !== null
    },
    /** A new word, still dark glass (while it is typed). */
    preview(word) {
      sign.setText(word)
      setRail()
      sign.setAll(0)
      want = 0
      litAt = null
      drawPattern(word)
    },
    /** Light the word in a colour, letter by letter. */
    light(word, c) {
      sign.setText(word)
      setRail()
      sign.setColor(c)
      glowLight.color.set(c)
      sign.setAll(0)
      drawPattern(word)
      want = 1
      litAt = 0
      flick.length = 0
    },
    /** The word as it was, lit at once (a preview closed without lighting). */
    restore(word, c) {
      sign.setText(word)
      setRail()
      sign.setColor(c)
      glowLight.color.set(c)
      sign.setAll(1)
      drawPattern(word)
      want = 1
      litAt = null
    },
    refresh(line) {
      scr.set({ line })
    },
    update(dt, t) {
      if (litAt !== null) {
        litAt += dt
        let done = true
        for (let i = 0; i < sign.count; i++) {
          const start = i * 0.16
          const age = litAt - start
          if (age < 0) {
            sign.setGlow(i, 0)
            done = false
          } else if (age < 0.35) {
            flick[i] = (flick[i] ?? 0) + dt
            if (flick[i] > 0.05) {
              flick[i] = 0
              sign.setGlow(i, rnd() < 0.55 ? 1 : 0.15)
            }
            done = false
          } else sign.setGlow(i, 1)
        }
        if (done) litAt = null
      }
      let lit = 0
      for (let i = 0; i < sign.count; i++) lit += sign.glow(i)
      const k = sign.count ? lit / sign.count : 0
      glowLight.intensity = want ? k * (light ? 9 : 7) * (0.98 + 0.02 * Math.sin(t * 60)) : 0
    },
  }
}

// ---------------------------------------------------------------------------------------------------
/** The history board: three signs to light in turn. */
export function historyBoard({ mats, words, light }) {
  const group = new THREE.Group()
  const board = new THREE.Mesh(new RoundedBoxGeometry(2.7, 3.0, 0.08, 2, 0.03), mats.black)
  board.position.set(0, 2.15, 0)
  const frame = new THREE.Mesh(new RoundedBoxGeometry(2.8, 3.1, 0.05, 2, 0.02), mats.dark)
  frame.position.set(0, 2.15, -0.03)
  group.add(frame, board)
  for (const lx of [-1.1, 1.1]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.66, 0.5), mats.dark)
    foot.position.set(lx, 0.33, 0)
    group.add(foot)
  }
  const scr = screen({ width: 2.5, height: 0.52, color: '#ffd166', title: words.title, line: '', titleSize: 0.13, lineSize: 0.065 })
  scr.group.position.set(0, 3.95, 0.02)
  group.add(scr.group)
  // the three signs: 1898 in krypton's white, 1910 in neon's red, today in coated tubes' colours
  const COATED = ['#4fd2ff', '#7dff9a', '#ff7ad9', '#fff1a8', '#9b8cff']
  const rows = [
    { key: '1898', text: '1898', color: glowOf('Kr'), y: 3.02 },
    { key: '1910', text: '1910', color: glowOf('Ne'), y: 2.08 },
    { key: 'today', text: words.today, color: COATED[0], y: 1.14 },
  ]
  const signs = rows.map(row => {
    const s = neonSign({ text: row.text, cap: 0.42, radius: 0.014, light, color: row.color, postMat: mats.dark, standoff: 0.05, maxWidth: 2.3 })
    s.group.position.set(0, row.y, 0.04)
    group.add(s.group)
    if (row.key === 'today') for (let i = 0; i < s.count; i++) s.setGlyphColor(i, COATED[i % COATED.length])
    const cap = makeText(words.captions[row.key], { font: 'body', size: 0.075, color: '#c9d4ff', maxWidth: 2.4 })
    cap.position.set(0, row.y - 0.17, 0.05)
    group.add(cap)
    return { ...row, sign: s, k: 0, want: 0 }
  })
  const glowLight = new THREE.PointLight('#ffffff', 0, 6, 2)
  glowLight.position.set(0, 2.2, 1.2)
  group.add(glowLight)
  const mix = new THREE.Color()
  const one = new THREE.Color()
  const rnd = random(19)
  let flickT = 0
  let lighting = -1
  let lightingT = 0
  const api = {
    group,
    screen: scr,
    rows,
    /** The next sign to light (its key), or null when all are lit. */
    get next() {
      return signs.find(s => !s.want)?.key ?? null
    },
    get busy() {
      return lighting >= 0
    },
    act() {
      if (lighting >= 0) return false
      const i = signs.findIndex(s => !s.want)
      if (i < 0) {
        for (const s of signs) s.want = 0
        play('part')
        return 'off'
      }
      lighting = i
      lightingT = 0
      play('select')
      return signs[i].key
    },
    refresh(line) {
      scr.set({ line })
    },
    update(dt) {
      if (lighting >= 0) {
        lightingT += dt
        flickT += dt
        const s = signs[lighting]
        if (flickT > 0.06) {
          flickT = 0
          s.k = lightingT < 0.5 ? (rnd() < 0.5 ? 1 : 0.2) : 1
        }
        if (lightingT > 0.6) {
          s.want = 1
          s.k = 1
          lighting = -1
        }
      }
      // the board's light: the mix of the lit signs' colours (the last one alone tinted the others)
      let n = 0
      mix.setRGB(0, 0, 0)
      for (const [i, s] of signs.entries()) {
        if (i !== lighting) s.k = damp(s.k, s.want, s.want ? 8 : 5, dt)
        s.sign.setAll(s.k)
        n += s.k
        mix.add(one.set(s.color).multiplyScalar(s.k))
      }
      if (n > 0.01) glowLight.color.copy(mix.multiplyScalar(1 / n))
      glowLight.intensity = n * (light ? 2.4 : 1.8)
    },
  }
  return api
}

// ---------------------------------------------------------------------------------------------------
/** The balloons on their round table. Let go, each flies by its own physics; tied, they come back. */
export function balloonRack({ mats, words, light, ceiling = 5.4 }) {
  const group = new THREE.Group()
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.72, 32), mats.wood)
  table.position.y = 0.36
  const rimMat = new THREE.MeshStandardMaterial({ color: '#7fd4ff', emissive: '#7fd4ff', emissiveIntensity: 1.2 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.555, 0.012, 6, 48), rimMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.72
  group.add(table, rim)
  const R = 0.14
  const ballGeo = new THREE.SphereGeometry(R, light ? 18 : 26, light ? 14 : 20)
  const knotGeo = new THREE.ConeGeometry(0.018, 0.035, 8)
  const stringGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 1, 4).translate(0, -0.5, 0)
  const stringMat = new THREE.MeshStandardMaterial({ color: '#e8e8e8', roughness: 0.8 })
  const rnd = random(41)
  const balloons = SIGN_GASES.map((sym, i) => {
    const a = (-0.95 + (i / 4) * 1.9)
    const tie = new THREE.Vector3(Math.sin(a) * 0.46, 0.73, Math.cos(a) * 0.46)
    const rest = new THREE.Vector3(Math.sin(a) * 0.62, 1.38 + (i % 2) * 0.16, Math.cos(a) * 0.62 + 0.05)
    const color = new THREE.Color(glowOf(sym))
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.05, emissive: color, emissiveIntensity: 0.18 })
    const ball = new THREE.Group()
    const body = new THREE.Mesh(ballGeo, mat)
    body.scale.set(1, 1.18, 1)
    const knot = new THREE.Mesh(knotGeo, mat)
    knot.position.y = -R * 1.18 - 0.012
    knot.rotation.x = Math.PI
    const label = makeText(sym, { size: 0.1, color: '#ffffff', outlineWidth: 0.008, outlineColor: '#0b1030' })
    label.position.set(0, 0.01, R + 0.004)
    ball.add(body, knot, label)
    ball.position.copy(rest)
    group.add(ball)
    const string = new THREE.Mesh(stringGeo, stringMat)
    group.add(string)
    return { sym, ball, string, tie, rest, phys: balloonOf(sym), y: rest.y, v: 0, drift: (rnd() - 0.5) * 0.18, x: rest.x, z: rest.z, sway: rnd() * 6 }
  })
  const up = new THREE.Vector3()
  const lookAt = (s, from, to) => {
    up.subVectors(from, to)
    const len = Math.max(0.001, up.length())
    s.position.copy(from)
    s.scale.set(1, len, 1)
    s.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), up.multiplyScalar(-1 / len))
  }
  // the screen stands beside the table, a little behind it, so it does not hide the balloons
  const scr = standingScreen({ width: 1.3, height: 0.56, color: '#7fd4ff', title: words.title, line: '', titleSize: 0.095, lineSize: 0.055 }, { top: 1.25, tilt: 0.3, mat: mats.dark })
  scr.group.position.set(1.5, 0, -0.35)
  scr.group.rotation.y = -0.3
  group.add(scr.group)

  let free = false
  let back = 0 // seconds of the way back to the table
  const top = ceiling - R * 1.18 - 0.02
  const bottom = R * 1.18 + 0.03
  const knotPos = new THREE.Vector3()
  return {
    group,
    screen: scr,
    get free() {
      return free
    },
    get busy() {
      return back > 0
    },
    act() {
      if (back > 0) return false
      if (!free) {
        free = true
        for (const b of balloons) {
          b.v = 0
          b.y = b.ball.position.y
          b.x = b.ball.position.x
          b.z = b.ball.position.z
        }
        play('select')
        return 'go'
      }
      free = false
      back = 1.4
      play('tap')
      return 'back'
    },
    update(dt, t) {
      for (const b of balloons) {
        if (free) {
          // the physics in small steps: buoyancy, weight and the drag of the air
          const steps = 4
          for (let k = 0; k < steps; k++) b.v = stepBalloon(b.phys, b.v, dt / steps)
          b.y += b.v * dt
          if (b.y > top) {
            b.y = top
            b.v = 0
          }
          if (b.y < bottom) {
            b.y = bottom
            b.v = Math.abs(b.v) > 0.6 ? -b.v * 0.25 : 0 // a little bounce on the planks
          }
          b.x += b.drift * dt * (b.y < top - 0.01 && b.y > bottom + 0.01 ? 1 : 0.2)
          b.ball.position.set(b.x, b.y, b.z)
          b.ball.rotation.z = Math.sin(t * 1.3 + b.sway) * 0.08
        } else {
          const k = back > 0 ? 1 - Math.exp(-dt * 4) : 1
          b.ball.position.lerp(b.rest, k)
          b.ball.position.y += Math.sin(t * 1.1 + b.sway) * 0.0015
          b.ball.rotation.z = Math.sin(t * 0.9 + b.sway) * 0.05
        }
        // the string: tied to the table, or hanging from the knot when free
        knotPos.set(0, -R * 1.18 - 0.03, 0).applyQuaternion(b.ball.quaternion).add(b.ball.position)
        if (free) {
          const hang = Math.min(0.62, knotPos.y - 0.004)
          lookAt(b.string, knotPos, knotPos.clone().add(new THREE.Vector3(0, -hang, 0)))
        } else lookAt(b.string, knotPos, b.tie)
      }
      if (back > 0) back = Math.max(0, back - dt)
      rimMat.emissiveIntensity = 1.0 + 0.2 * Math.sin(t * 2)
    },
    refresh(line) {
      scr.set({ line })
    },
  }
}
