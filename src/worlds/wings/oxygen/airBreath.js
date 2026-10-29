// Breathing: two glass columns, the air you breathe in and the air you breathe out, each filled with its
// gases stacked in proportion (nitrogen, oxygen, carbon dioxide, argon), and a pair of glass lungs
// between them that breathe. Using it starts the breathing, using it again holds the breath (the user,
// 2026-10-29: one breath was over before the breath out was seen; it should go on while it is on). Each
// breath: in, the lungs swell and the air streams into them through the windpipe, every gas from its own
// band of the left column; out, they empty and it streams back to the bands of the right one, with a
// little less oxygen and a carbon dioxide in its place. In: 21% O2 and 0.04% CO2; out: about 16% and 4%.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { standingScreen, glowMat, hdr, glass, label, damp, random, equation } from './kit.js'

const GAS = [
  { id: 'N2', color: '#3a5cf5', in: 78, out: 78 },
  { id: 'O2', color: '#f2302b', in: 21, out: 16 },
  { id: 'CO2', color: '#5b6b62', in: 0.04, out: 4 },
  { id: 'Ar', color: '#80d1e3', in: 0.93, out: 0.93 },
]

export function breathExhibit({ color, light, words, level }) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.3, 1.1, 3, 0.08), white)
  plinth.position.y = 0.15
  plinth.castShadow = plinth.receiveShadow = true
  const seam = new THREE.Mesh(new RoundedBoxGeometry(2.94, 0.03, 1.14, 2, 0.01), glowMat(color, 1.5))
  seam.position.y = 0.26
  group.add(plinth, seam)
  const H0 = 0.3
  const CH = 1.7 // the columns' height: 100% of the air
  const R = 0.3
  const columns = {}
  for (const [side, x] of [['in', -1.0], ['out', 1.0]]) {
    const col = new THREE.Group()
    col.position.set(x, 0, 0)
    group.add(col)
    // the bands, one per gas, stacked from the bottom
    const bands = {}
    for (const g of GAS) {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(R - 0.03, R - 0.03, 1, 40),
        new THREE.MeshStandardMaterial({ color: g.color, roughness: 0.3, transparent: true, opacity: 0.72, emissive: g.color, emissiveIntensity: 0.25 }),
      )
      col.add(m)
      bands[g.id] = m
    }
    const geo = new THREE.CylinderGeometry(R, R, CH + 0.06, 48, 1, true)
    const back = new THREE.Mesh(geo, glass({ opacity: 0.03, edge: 0.3, side: THREE.BackSide }))
    const front = new THREE.Mesh(geo, glass({ opacity: 0.04, edge: 0.6 }))
    back.position.y = front.position.y = H0 + CH / 2
    back.renderOrder = 1
    front.renderOrder = 5
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.04, R + 0.04, 0.06, 48), white)
    cap.position.y = H0 + CH + 0.06
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.022, 8, 48), glowMat(color, 1.6))
    ring.rotation.x = Math.PI / 2
    ring.position.y = H0 + CH + 0.02
    col.add(back, front, cap, ring)
    const title = label(side === 'in' ? words.in : words.out, { size: 0.11, color: '#ffffff' })
    title.position.set(0, H0 + CH + 0.28, 0)
    col.add(title)
    columns[side] = { col, bands, values: Object.fromEntries(GAS.map(g => [g.id, g[side]])), labels: {}, range: {} }
  }
  // labels beside each column: the gas and its share
  const pct = v => (v < 0.1 ? words.trace : `${Math.round(v)}%`)
  for (const side of ['in', 'out']) {
    const c = columns[side]
    for (const g of GAS) {
      if (g.id === 'Ar') continue
      const t = label('', { size: 0.075, color: g.id === 'CO2' ? '#c5d6cc' : g.color === '#3a5cf5' ? '#a9b8ff' : '#ff9a90', anchorX: side === 'in' ? 'right' : 'left' })
      t.position.set(side === 'in' ? -R - 0.06 : R + 0.06, 0, 0.05)
      c.col.add(t)
      c.labels[g.id] = t
    }
  }
  const layout = () => {
    for (const side of ['in', 'out']) {
      const c = columns[side]
      let y = H0
      for (const g of GAS) {
        const h = Math.max(0.004, (c.values[g.id] / 100) * CH)
        const m = c.bands[g.id]
        m.scale.y = h
        m.position.y = y + h / 2
        c.range[g.id] = [y, y + h]
        const lab = c.labels[g.id]
        if (lab) {
          lab.position.y = Math.min(H0 + CH - 0.05, y + Math.max(h, 0.07) / 2)
          const text = `${words.gas[g.id]}: ${pct(c.values[g.id])}`
          if (lab.text !== text) {
            lab.text = text
            lab.sync()
          }
        }
        y += h
      }
    }
  }
  layout()

  // the lungs: two glass lobes on a windpipe, breathing
  const lungs = new THREE.Group()
  lungs.position.set(0, H0 + 1.3, 0)
  group.add(lungs)
  const lobeMat = new THREE.MeshPhysicalMaterial({
    color: '#ff8fa0', roughness: 0.25, transparent: true, opacity: 0.55, emissive: '#ff5a74', emissiveIntensity: 0.25, clearcoat: 1, depthWrite: false,
  })
  const lobes = []
  for (const s of [-1, 1]) {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 24), lobeMat)
    lobe.scale.set(0.85, 1.25, 0.7)
    lobe.position.set(s * 0.21, -0.06, 0)
    lobe.renderOrder = 4
    lungs.add(lobe)
    lobes.push(lobe)
  }
  const pipeMat = new THREE.MeshStandardMaterial({ color: '#f3d3d8', roughness: 0.4 })
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.42, 16), pipeMat)
  pipe.position.y = 0.33
  lungs.add(pipe)
  for (const s of [-1, 1]) {
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.2, 12), pipeMat)
    br.position.set(s * 0.08, 0.1, 0)
    br.rotation.z = s * 0.7
    lungs.add(br)
  }
  // the air on the move, every gas of it (the user, 2026-10-29: not only the carbon dioxide going out),
  // in proportion but with the nitrogen thinned so it does not crowd the rest: a breath in brings 16
  // nitrogen and 8 oxygen (and an argon every other breath); a breath out takes back the 16 nitrogen, 6
  // oxygen (the body kept about a quarter) and 2 carbon dioxide in their place
  const BREATH = {
    in: { N2: 16, O2: 8, CO2: 0, Ar: 1 },
    out: { N2: 16, O2: 6, CO2: 2, Ar: 1 },
  }
  const rnd = random(5)
  const atomMat = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, roughness: 0.3 })
  const MAT = { N: atomMat('#4d6bff'), O: atomMat('#f2302b'), C: new THREE.MeshStandardMaterial({ color: '#42464e', roughness: 0.3 }), Ar: atomMat('#80d1e3') }
  const atomGeo = new THREE.SphereGeometry(0.03, 12, 8)
  // each molecule's atoms: element and offset along its axis
  const SHAPE = { N2: [['N', -0.028], ['N', 0.028]], O2: [['O', -0.032], ['O', 0.032]], CO2: [['C', 0], ['O', -0.06], ['O', 0.06]], Ar: [['Ar', 0]] }
  const pool = {}
  for (const g of GAS) {
    pool[g.id] = []
    const n = Math.max(BREATH.in[g.id], BREATH.out[g.id])
    for (let i = 0; i < n; i++) {
      const m = new THREE.Group()
      for (const [e, x] of SHAPE[g.id]) {
        const a = new THREE.Mesh(atomGeo, MAT[e])
        a.position.x = x
        if (e === 'Ar') a.scale.setScalar(1.35)
        m.add(a)
      }
      m.visible = false
      group.add(m)
      pool[g.id].push({ g: m, t: -1, delay: 0, path: null, spin: new THREE.Vector3(rnd(), rnd(), rnd()) })
    }
  }
  const movers = Object.values(pool).flat()
  const PIPE = new THREE.Vector3(0, H0 + 1.3 + 0.56, 0) // the windpipe's mouth
  /** A molecule's way between its gas's band in a column and a lobe, through the windpipe. */
  const pathFor = (gas, dir) => {
    const sx = dir === 'in' ? -1 : 1
    const [y0, y1] = columns[dir].range[gas]
    const y = y0 + (y1 - y0) * (0.2 + 0.6 * rnd())
    const band = new THREE.Vector3(sx * (1.0 + (rnd() - 0.5) * 0.25), y, (rnd() - 0.5) * 0.25)
    const side = new THREE.Vector3(sx * 0.66, y + 0.08, 0.1 + rnd() * 0.06)
    const over = new THREE.Vector3(sx * 0.32, PIPE.y + 0.16 + rnd() * 0.06, 0.06)
    const lobe = new THREE.Vector3((rnd() < 0.5 ? -1 : 1) * (0.14 + rnd() * 0.12), H0 + 1.22 + (rnd() - 0.5) * 0.22, (rnd() - 0.5) * 0.12)
    const pts = [band, side, over, PIPE.clone(), lobe]
    return new THREE.CatmullRomCurve3(dir === 'in' ? pts : pts.reverse(), false, 'centripetal')
  }

  // the screen in front
  // a low console in front, so the columns and the lungs stand clear above it
  const scr = standingScreen(
    { width: 1.8, height: 1.0, color, title: words.title, big: '', small: '', smallY: -0.2 },
    { top: 0.86, tilt: 0.62 },
  )
  scr.group.position.set(0, 0, 0.95)
  group.add(scr.group)
  const eq = equation([{ text: '21%' }, 0.02, 'O2', 0.12, 'arrow', 0.12, { text: '16%' }, 0.02, 'O2'], { size: 0.16, gap: 0.04 })
  eq.position.y = 0.12
  scr.content.add(eq)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  // one breath: in (IN s), a moment full, out (OUT s), a moment empty
  const IN = 3.5
  const OUT_AT = 4.0
  const OUT = 3.5
  const CYCLE = 8.2
  const FLY = 1.6 // a molecule's flight, all within its half of the breath
  const ease = x => x * x * (3 - 2 * x)
  const fullness = p => (p < IN ? ease(p / IN) : p < OUT_AT ? 1 : p < OUT_AT + OUT ? 1 - ease((p - OUT_AT) / OUT) : 0)
  let breaths = 0
  /** Send one breath's molecules, in or out, mixed in one stream. */
  const launch = dir => {
    const list = []
    for (const g of GAS) {
      const n = g.id === 'Ar' && breaths % 2 ? 0 : BREATH[dir][g.id]
      for (let i = 0; i < n; i++) list.push({ gas: g.id, m: pool[g.id][i], r: rnd() })
    }
    list.sort((a, b) => a.r - b.r)
    list.forEach(({ gas, m }, i) => {
      m.t = 0
      m.delay = (i / list.length) * (IN - FLY - 0.1) + rnd() * 0.1
      m.path = pathFor(gas, dir)
    })
  }
  let on = false
  let phase = -1 // seconds into the breath; -1: still
  return {
    group,
    screen: scr,
    get on() {
      return on
    },
    /** Start breathing, or hold the breath (the breath under way finishes first). Returns whether it is on. */
    toggle() {
      on = !on
      if (on && phase < 0) {
        phase = 0
        launch('in')
      }
      return on
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t) {
      // a calm swell while still; deep breaths while it is on
      const deep = phase >= 0 ? fullness(phase) : 0
      const s = 1 + (phase >= 0 ? 0 : Math.sin(t * 1.6) * 0.04) + deep * 0.2
      for (const l of lobes) l.scale.set(0.85 * s, 1.25 * s, 0.7 * s)
      if (phase >= 0) {
        const before = phase
        phase += dt
        if (before < OUT_AT && phase >= OUT_AT) launch('out')
        if (phase >= CYCLE) {
          breaths++
          phase = on ? phase - CYCLE : -1
          if (on) launch('in')
        }
      }
      for (const m of movers) {
        if (m.t < 0) continue
        m.t += dt
        const k = (m.t - m.delay) / FLY
        m.g.visible = k > 0 && k < 1
        if (k > 0 && k < 1) {
          m.path.getPointAt(k, m.g.position)
          m.g.rotation.set(t * m.spin.x * 3, t * m.spin.y * 3, 0)
          // grows out of its band (or the lungs) and fades into the other end
          m.g.scale.setScalar(Math.min(1, k / 0.12, (1 - k) / 0.12))
        }
        if (k >= 1) m.t = -1
      }
    },
  }
}
