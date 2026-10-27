// The scientist's corner and the atom.
// - The spectroscope (against the east wall): a discharge tube in its holder, a brass collimator, a
//   glass prism, and a fan of coloured rays from the prism to a big screen on the wall, where the gas's
//   lines stand at their wavelengths (NIST) under the Sun's row from the eclipse of 1868: hydrogen's
//   lines and a yellow line nobody knew. Helium's 587.6 nm line falls exactly under it.
// - The atom (the north-west corner): the visitor's gas as Bohr's rings with every electron, the outer
//   ring full; a free electron flies in, knocks an outer electron up to a higher level, it falls back
//   and a photon flies out in the colour of one of the gas's lines; beside it, the energy ladder with
//   the real levels (NIST) of that line.
// Both are built in a frame whose +z points to the visitor.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { element } from '../../../data/elements.js'
import { play } from '../../../audio/sound.js'
import { LINES, SUN_1868, LADDER, levelsEV, glowOf, wavelengthRGB, lineBrightness, colourKey, eyeWeight } from './nobleData.js'
import { canvasTex, screen, damp, clamp, smooth, hdr, num, fill } from './kit.js'
import { drawScale, nmX } from './spectrumCanvas.js'
import { glowNorm } from './neonTube.js'

const lin = new THREE.Color()
/** A wavelength's colour in linear light, times k (above 1 for the bloom). */
const nmColor = (nm, k = 1) => {
  const [r, g, b] = wavelengthRGB(nm)
  return lin.setRGB(r, g, b, THREE.SRGBColorSpace).multiplyScalar(k)
}

/** Quads with vertex colours in one geometry, rewritten when the lines change (additive glow). */
function quadBatch(max) {
  const pos = new Float32Array(max * 6 * 3)
  const col = new Float32Array(max * 6 * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage))
  geo.setDrawRange(0, 0)
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  let n = 0
  return {
    mesh,
    begin() {
      n = 0
    },
    /** A quad from corners a, b, c, d (each [x, y, z]), colours ca at a and b, cb at c and d. */
    quad(a, b, c, d, ca, cb) {
      if (n >= max) return
      const P = [a, b, c, a, c, d]
      const C = [ca, ca, cb, ca, cb, cb]
      for (let k = 0; k < 6; k++) {
        pos.set(P[k], (n * 6 + k) * 3)
        col.set(C[k], (n * 6 + k) * 3)
      }
      n++
    },
    end() {
      geo.setDrawRange(0, n * 6)
      geo.attributes.position.needsUpdate = true
      geo.attributes.color.needsUpdate = true
      geo.computeBoundingSphere()
    },
  }
}

// ---------------------------------------------------------------------------------------------------
/** The spectroscope. `gases` are the tubes it holds, in order; it starts with `start`. */
export function spectroscope({ mats, words, level, light, lang, gases, start, nameOf }) {
  const group = new THREE.Group()
  // the big screen on the wall, drawn on a canvas, lines added on top as glowing quads
  const SW = 4.6
  const SH = 2.0
  const CW = 2048
  const CH = Math.round((CW * SH) / SW)
  const frame = screen({ width: SW + 0.06, height: SH + 0.06, color: '#9ad0ff', title: '', line: '' })
  frame.group.position.set(0, 2.35, 0.04)
  group.add(frame.group)
  const L = { x: 250, w: CW - 310, sunY: 150, sunH: 120, gasY: 340, gasH: 190, scaleY: 540 }
  const tex = canvasTex(CW, CH)
  const board = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: tex }))
  board.position.z = 0.002
  frame.content.add(board)
  const toLocal = (px, py) => [(px / CW - 0.5) * SW, (0.5 - py / CH) * SH]
  const lines = quadBatch(48)
  lines.mesh.position.z = 0.006
  lines.mesh.renderOrder = 6
  frame.content.add(lines.mesh)

  // the table, the tube in its holder, the collimator and the prism
  const tTop = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.06, 0.72, 2, 0.02), mats.top)
  tTop.position.set(-0.35, 0.9, 1.2)
  group.add(tTop)
  for (const lx of [-1.3, 0.6]) {
    for (const lz of [0.9, 1.5]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.87, 0.05), mats.dark)
      leg.position.set(lx, 0.435, lz)
      group.add(leg)
    }
  }
  const T = 0.93 // the table top
  const holder = new THREE.Group()
  const hBox = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.12, 0.16, 2, 0.02), mats.black)
  hBox.position.y = 0.06
  const clampTop = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.05), mats.metal)
  clampTop.position.y = 0.5
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8), mats.metal)
  post.position.set(0, 0.32, -0.05)
  const tubeMat = new THREE.MeshStandardMaterial({ color: '#d8dce6', roughness: 0.2, emissive: '#ffffff', emissiveIntensity: light ? 1.6 : 3 })
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.3, 10), tubeMat)
  tube.position.y = 0.32
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), tubeMat)
  bulb.position.y = 0.2
  holder.add(hBox, clampTop, post, tube, bulb)
  holder.position.set(-1.25, T, 1.2)
  group.add(holder)
  const tubeLight = light ? null : new THREE.PointLight('#ffffff', 1.2, 2.6, 2)
  if (tubeLight) {
    tubeLight.position.set(-1.25, T + 0.35, 1.35)
    group.add(tubeLight)
  }
  const colli = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.45, 14), mats.brass)
  colli.rotation.z = Math.PI / 2
  colli.position.set(-0.86, T + 0.13, 1.2)
  group.add(colli)
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.06, 20), mats.dark)
  stand.position.set(-0.4, T + 0.03, 1.2)
  group.add(stand)
  const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.14, 3), new THREE.MeshStandardMaterial({ color: '#dff0ff', roughness: 0.05, transparent: true, opacity: 0.45, depthWrite: false }))
  prism.position.set(-0.4, T + 0.13, 1.2)
  prism.renderOrder = 5
  group.add(prism)
  const P0 = [-0.4, T + 0.13, 1.2]
  // the white beam from the tube to the prism, and the fan of colours to the wall
  const rays = quadBatch(52)
  rays.mesh.renderOrder = 7
  group.add(rays.mesh)

  // the drawing
  let index = Math.max(0, gases.indexOf(start))
  let sym = gases[index]
  let pulse = 0
  const draw = () => {
    const sci = level() === 'scientist'
    tex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1030'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      // the title: the gas, in its colour
      g.font = '700 74px Outfit, sans-serif'
      g.textAlign = 'left'
      g.fillStyle = glowOf(sym)
      g.fillText(`${nameOf(sym)}`, L.x, 72)
      const tw = g.measureText(`${nameOf(sym)}`).width
      g.font = '700 40px Nunito, sans-serif'
      g.fillStyle = '#c9d4ff'
      g.fillText(sci ? `${sym} I  ·  ${LINES[sym].length} ${lang === 'pt-pt' ? 'riscas' : 'lines'}` : words.screen.kid, L.x + tw + 40, 78)
      // the two bands and their names
      g.fillStyle = '#04050c'
      g.fillRect(L.x, L.sunY, L.w, L.sunH)
      g.fillRect(L.x, L.gasY, L.w, L.gasH)
      g.font = '700 38px Outfit, sans-serif'
      g.textAlign = 'right'
      g.fillStyle = '#ffd98a'
      g.fillText(words.sun, L.x - 24, L.sunY + L.sunH / 2)
      g.fillStyle = glowOf(sym)
      g.fillText(nameOf(sym), L.x - 24, L.gasY + L.gasH / 2)
      // the mystery mark over the Sun's yellow line
      const d3 = nmX(587.56, L.x, L.w)
      g.textAlign = 'center'
      g.fillStyle = '#ffe28a'
      g.font = '700 46px Outfit, sans-serif'
      g.fillText(sym === 'He' ? 'D3' : '?', d3, L.sunY - 30)
      if (sci) {
        // hydrogen's lines named
        g.font = '700 26px Outfit, sans-serif'
        g.fillStyle = '#c9d4ff'
        for (const [nm, , mystery] of SUN_1868) if (!mystery) g.fillText(`H ${num(nm, 1, lang)}`, nmX(nm, L.x, L.w), L.sunY - 22)
      }
      if (sym === 'He') {
        // the match: a gold dashed line from the Sun's line down to helium's
        g.strokeStyle = '#ffd166'
        g.lineWidth = 4
        g.setLineDash([14, 10])
        g.beginPath()
        g.moveTo(d3, L.sunY + L.sunH + 4)
        g.lineTo(d3, L.gasY - 4)
        g.stroke()
        g.setLineDash([])
        g.font = '700 44px Outfit, sans-serif'
        g.fillStyle = '#ffd166'
        g.textAlign = 'left'
        g.fillText(words.match, d3 + 26, (L.sunY + L.sunH + L.gasY) / 2 + 2)
      }
      drawScale(g, { x: L.x, y: L.scaleY, w: L.w, size: 30, rainbow: 12, unit: 'nm' })
      // the strongest lines named, for the scientist
      if (sci) {
        const strongest = [...LINES[sym]].sort((a, b) => b[1] - a[1]).slice(0, 4)
        g.font = '700 26px Outfit, sans-serif'
        g.fillStyle = '#ffffff'
        g.textAlign = 'center'
        let last = -1e9
        for (const [nm] of strongest.sort((a, b) => a[0] - b[0])) {
          const x = nmX(nm, L.x, L.w)
          if (x - last < 90) continue
          g.fillText(num(nm, 1, lang), x, L.gasY + 22)
          last = x
        }
      }
      g.font = '700 34px Nunito, sans-serif'
      g.fillStyle = '#aab6e8'
      g.textAlign = 'left'
      g.fillText(sci ? words.footer.sci : words.footer.kid, L.x, h - 50)
    })
    // the lines themselves, glowing
    lines.begin()
    const bar = (nm, b, y, hgt, k) => {
      const [x0] = toLocal(nmX(nm, L.x, L.w), 0)
      const [, yTop] = toLocal(0, y)
      const [, yBot] = toLocal(0, y + hgt)
      const wdt = 0.006 + 0.008 * b
      const c = nmColor(nm, (0.6 + 1.9 * b) * k).toArray()
      lines.quad([x0 - wdt, yBot, 0], [x0 + wdt, yBot, 0], [x0 + wdt, yTop, 0], [x0 - wdt, yTop, 0], c, c)
    }
    for (const [nm, b] of SUN_1868) bar(nm, b, L.sunY + 6, L.sunH - 12, 1)
    for (const [nm, I] of LINES[sym]) bar(nm, lineBrightness(sym, I) * eyeWeight(nm), L.gasY + 6, L.gasH - 12, 1)
    lines.end()
    // the rays: white from the tube into the prism, then each colour to its place on the wall
    rays.begin()
    const white = new THREE.Color(glowOf(sym)).multiplyScalar(0.9).toArray()
    rays.quad([-1.2, P0[1] - 0.008, P0[2]], [-1.2, P0[1] + 0.008, P0[2]], [P0[0], P0[1] + 0.006, P0[2]], [P0[0], P0[1] - 0.006, P0[2]], white, white)
    for (const [nm, I] of LINES[sym]) {
      const b = lineBrightness(sym, I) * eyeWeight(nm)
      const [x] = toLocal(nmX(nm, L.x, L.w), 0)
      const [, y] = toLocal(0, L.gasY + L.gasH / 2)
      const wy = 2.35 + y
      const c0 = nmColor(nm, 0.5 * b).toArray()
      const c1 = nmColor(nm, 0.12 * b).toArray()
      const w0 = 0.004
      const w1 = 0.016
      rays.quad([P0[0], P0[1] - w0, P0[2]], [P0[0], P0[1] + w0, P0[2]], [x, wy + w1 * 4, 0.07], [x, wy - w1 * 4, 0.07], c0, c1)
    }
    rays.end()
    tubeMat.emissive.set(glowOf(sym))
    if (tubeLight) tubeLight.color.set(glowOf(sym))
  }
  draw()

  return {
    group,
    screen: frame,
    get gas() {
      return sym
    },
    get next() {
      return gases[(index + 1) % gases.length]
    },
    /** The next tube into the holder. */
    act() {
      index = (index + 1) % gases.length
      sym = gases[index]
      pulse = 1
      play('select')
      draw()
      return sym
    },
    /** Show this gas's tube (the first use shows the one the visitor came with). */
    show(s) {
      const i = gases.indexOf(s)
      if (i < 0) return
      index = i
      sym = s
      draw()
    },
    refresh: draw,
    update(dt, t) {
      pulse = damp(pulse, 0, 3, dt)
      prism.rotation.y = Math.sin(t * 0.4) * 0.05
      rays.mesh.material.opacity = 0.75 + 0.25 * Math.sin(t * 3) * 0.2 + pulse * 0.4
      tubeMat.emissiveIntensity = (light ? 1.6 : 3) * (0.96 + 0.04 * Math.sin(t * 40))
    },
  }
}

// ---------------------------------------------------------------------------------------------------
/** The atom of the visitor's gas, its energy ladder, and the electron that makes it glow. */
export function atomDisplay({ mats, words, level, light, lang, sym, nameOf }) {
  const group = new THREE.Group()
  const el = element(sym)
  const color = glowOf(sym)
  // the plinth with a glowing rim
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.32, 40), mats.dark)
  base.position.y = 0.16
  const rimMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.018, 8, 60), rimMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.32
  group.add(base, rim)

  // the atom: rings and electrons in a plane facing the visitor
  const atom = new THREE.Group()
  atom.position.set(0, 2.05, 0)
  group.add(atom)
  const shells = el.shells
  const n = shells.length
  const radii = shells.map((_, k) => (n === 1 ? 0.55 : 0.2 + ((1.0 - 0.2) * k) / (n - 1)))
  const outerR = radii[n - 1]
  const ringMat = new THREE.MeshBasicMaterial({ color: '#7f95d8', transparent: true, opacity: 0.5, depthWrite: false })
  const outerRingMat = new THREE.MeshBasicMaterial({ color: hdr(color, 1.1), transparent: true, opacity: 0.85, depthWrite: false })
  radii.forEach((r, k) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, k === n - 1 ? 0.01 : 0.005, 6, 120), k === n - 1 ? outerRingMat : ringMat)
    atom.add(ring)
  })
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 14), new THREE.MeshStandardMaterial({ color: '#ff6a5c', emissive: '#ff5a4c', emissiveIntensity: 1.6 }))
  atom.add(nucleus)
  const innerCount = shells.slice(0, -1).reduce((a, b) => a + b, 0)
  const outerCount = shells[n - 1]
  const eGeo = new THREE.SphereGeometry(1, 12, 10)
  const inner = innerCount ? new THREE.InstancedMesh(eGeo, new THREE.MeshStandardMaterial({ color: '#a8ecff', emissive: '#a8ecff', emissiveIntensity: 1.8 }), innerCount) : null
  const outerMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.2 * glowNorm(new THREE.Color(color)) })
  const outer = new THREE.InstancedMesh(eGeo, outerMat, outerCount)
  if (inner) atom.add(inner)
  atom.add(outer)
  // the higher level the electron is knocked up to: a dotted ring
  const upR = outerR + 0.28
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.008, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false }), 72)
  const m4 = new THREE.Matrix4()
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    dots.setMatrixAt(i, m4.makeTranslation(Math.cos(a) * upR, Math.sin(a) * upR, 0))
  }
  atom.add(dots)
  // the jumping electron, the free electron that hits, and the photon
  const jumper = new THREE.Mesh(eGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: color, emissiveIntensity: 3 }))
  jumper.visible = false
  atom.add(jumper)
  const hitter = new THREE.Mesh(eGeo, new THREE.MeshStandardMaterial({ color: '#dff6ff', emissive: '#bfe8ff', emissiveIntensity: 3.5 }))
  hitter.scale.setScalar(0.035)
  hitter.visible = false
  atom.add(hitter)
  const wave = []
  for (let i = 0; i <= 80; i++) {
    const u = i / 80
    wave.push(new THREE.Vector3(Math.sin(u * Math.PI * 8) * 0.035 * Math.sin(u * Math.PI), 0, u * 0.55))
  }
  const photonMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const photon = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wave), 80, 0.009, 6), photonMat)
  photon.visible = false
  atom.add(photon)

  // the energy ladder on a screen beside the atom
  const lad = screen({ width: 1.35, height: 1.75, color, title: words.ladder.title, line: '', titleSize: 0.1 })
  lad.group.position.set(1.72, 2.05, -0.05)
  lad.group.rotation.y = -0.35
  group.add(lad.group)
  const ladPost = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.2, 0.08, 2, 0.02), mats.dark)
  ladPost.position.set(1.72, 0.6, -0.1)
  const ladFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.05, 24), mats.dark)
  ladFoot.position.set(1.72, 0.025, -0.1)
  group.add(ladPost, ladFoot)
  // the exhibit's own screen, over the atom
  const head = screen({ width: 2.4, height: 0.52, color, title: words.title, line: '', titleSize: 0.13, lineSize: 0.062 })
  head.group.position.set(0, 3.78, 0)
  group.add(head.group)
  const ladTex = canvasTex(512, 600)
  const ladBoard = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.41), new THREE.MeshBasicMaterial({ map: ladTex }))
  ladBoard.position.set(0, -0.11, 0.002)
  lad.content.add(ladBoard)
  const ion = el.ie?.[0] ?? 0
  let lineI = 0
  let shot = null // the line being shown
  const drawLadder = (stage = 0) => {
    const l = LADDER[sym][lineI]
    const ev = levelsEV(l)
    const sci = level() === 'scientist'
    ladTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1030'
      g.fillRect(0, 0, w, h)
      // the gas at the top; the rungs from the ground state up to the ionisation energy
      g.fillStyle = '#aab6e8'
      g.font = '700 26px Nunito, sans-serif'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.fillText(`${nameOf(sym)} · ${sym}`, 24, 26)
      const top = 92
      const bottom = h - 64
      const y = e => bottom - (e / (ion * 1.04)) * (bottom - top)
      const rung = (e, c, dash = false) => {
        g.strokeStyle = c
        g.lineWidth = 4
        g.setLineDash(dash ? [12, 8] : [])
        g.beginPath()
        g.moveTo(24, y(e))
        g.lineTo(262, y(e))
        g.stroke()
        g.setLineDash([])
      }
      const note = (text, x, yy, c, align = 'left', size = 24) => {
        g.fillStyle = c
        g.font = `700 ${size}px Outfit, sans-serif`
        g.textAlign = align
        g.textBaseline = 'middle'
        g.fillText(text, x, yy)
      }
      rung(0, '#c9d4ff')
      note(`0 eV · ${words.ladder.ground}`, 24, y(0) + 26, '#c9d4ff')
      rung(ion, '#8f9bd0', true)
      note(`${num(ion, 1, lang)} eV · ${words.ladder.ion}`, 24, y(ion) - 22, '#8f9bd0')
      rung(ev.hi, '#ffffff')
      rung(ev.lo, '#ffffff')
      if (sci) {
        note(`${num(ev.hi, 2, lang)} eV`, 272, y(ev.hi) - 4, '#ffffff')
        note(`${num(ev.lo, 2, lang)} eV`, 272, y(ev.lo) + 10, '#ffffff')
      }
      const arrow = (x, from, to, c) => {
        g.strokeStyle = c
        g.fillStyle = c
        g.lineWidth = 6
        g.beginPath()
        g.moveTo(x, y(from))
        g.lineTo(x, y(to))
        g.stroke()
        const dir = to > from ? 1 : -1
        g.beginPath()
        g.moveTo(x, y(to))
        g.lineTo(x - 12, y(to) + 20 * dir)
        g.lineTo(x + 12, y(to) + 20 * dir)
        g.closePath()
        g.fill()
      }
      if (stage >= 1) arrow(78, 0, ev.hi, '#bfe8ff')
      if (stage >= 2) {
        const [r, gg, b] = wavelengthRGB(l.nm)
        const c = `rgb(${Math.round(Math.min(1, r * 1.2) * 255)}, ${Math.round(Math.min(1, gg * 1.2) * 255)}, ${Math.round(Math.min(1, b * 1.2) * 255)})`
        arrow(186, ev.hi, ev.lo, c)
        // the photon's wavelength (and energy) under the lower rung, where the ladder is empty
        note(`${num(l.nm, 1, lang)} nm`, 186, y(ev.lo) + 40, c, 'center', 34)
        if (sci) note(`${num(ev.photon, 2, lang)} eV`, 186, y(ev.lo) + 78, c, 'center', 28)
      }
    })
  }
  drawLadder(0)

  // where each electron sits, turning slowly; the knocked one is index 0 of the outer ring
  const place = (t) => {
    let k = 0
    shells.forEach((count, s) => {
      const r = radii[s]
      const speed = 0.5 / Math.sqrt(s + 1)
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + t * speed + s * 0.4
        const size = s === n - 1 ? 0.04 : 0.024
        m4.makeScale(size, size, size).setPosition(Math.cos(a) * r, Math.sin(a) * r, 0)
        if (s === n - 1) {
          if (i === 0 && shot && shot.out) m4.makeScale(0.0001, 0.0001, 0.0001)
          outer.setMatrixAt(i, m4)
          if (i === 0 && shot) shot.home = a
        } else inner.setMatrixAt(k++, m4)
      }
    })
    outer.instanceMatrix.needsUpdate = true
    if (inner) inner.instanceMatrix.needsUpdate = true
  }

  let time = 0
  return {
    group,
    screen: head,
    ladder: lad,
    /** Where the ladder's post stands, in this frame (for the walls of the room). */
    ladderAt: [1.72, -0.1],
    get busy() {
      return !!shot
    },
    get line() {
      return LADDER[sym][lineI]
    },
    /** Fire a free electron at the atom; returns the line it will give, or false while busy. */
    fire() {
      if (shot) return false
      shot = { t: 0, out: false, home: 0, stage: 0 }
      play('tap')
      drawLadder(0)
      return LADDER[sym][lineI]
    },
    /** After a shot: the next of the gas's lines. */
    advance() {
      lineI = (lineI + 1) % LADDER[sym].length
    },
    refresh(line) {
      if (line != null) head.set({ line })
      drawLadder(shot ? shot.stage : 0)
    },
    words: (lineSay) => {
      const l = LADDER[sym][lineI]
      const ev = levelsEV(l)
      return fill(lineSay, { nm: num(l.nm, 1, lang), hi: num(ev.hi, 2, lang), lo: num(ev.lo, 2, lang), photon: num(ev.photon, 2, lang), colour: words.colours?.[colourKey(l.nm)] ?? '' })
    },
    update(dt, t) {
      time += dt
      place(time)
      rimMat.emissiveIntensity = 1.4 + 0.3 * Math.sin(t * 2)
      if (!shot) return
      shot.t += dt
      const s = shot.t
      const home = shot.home
      // the free electron flies in from the left and on past the atom
      const fly = clamp(s / 1.0)
      hitter.visible = s < 1.05
      const hx = -2.1 + fly * 3.3
      hitter.position.set(hx, outerR * 0.8 + (1 - fly) * 0.5 - fly * 0.6, 0.12)
      if (s > 0.55 && !shot.out) {
        shot.out = true
        shot.stage = 1
        drawLadder(1)
        play('join')
      }
      // the knocked electron: up to the dotted ring, a pause, back down
      if (shot.out) {
        const up = smooth(0.55, 0.8, s) * (1 - smooth(1.35, 1.55, s))
        const r = outerR + (upR - outerR) * up
        jumper.visible = s < 1.6
        jumper.position.set(Math.cos(home) * r, Math.sin(home) * r, 0)
        jumper.scale.setScalar(0.04 + 0.015 * up)
        dots.material.opacity = 0.35 + 0.5 * up
        if (s > 1.45 && shot.stage < 2) {
          shot.stage = 2
          drawLadder(2)
          photonMat.color.copy(nmColor(LADDER[sym][lineI].nm, 3))
          photon.visible = true
          play('select')
        }
      }
      // the photon flies out toward the visitor, a little wavy packet of light
      if (shot.stage >= 2) {
        const p = clamp((s - 1.45) / 1.5)
        photon.position.set(Math.cos(home) * outerR, Math.sin(home) * outerR + p * 0.3, p * 1.6)
        photon.rotation.x = -0.15
        photonMat.opacity = Math.sin(Math.min(1, p * 1.3) * Math.PI) * 0.95 + (p < 0.1 ? 0.6 : 0)
      }
      if (s > 3.05) {
        shot = null
        jumper.visible = false
        photon.visible = false
        dots.material.opacity = 0.35
      }
    },
  }
}
