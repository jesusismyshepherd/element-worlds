// Breathing: two glass columns, the air you breathe in and the air you breathe out, each filled with its
// gases stacked in proportion (nitrogen, oxygen, carbon dioxide, argon), and a pair of glass lungs
// between them that breathe. Using it takes a breath: oxygen flows from the left column into the
// lungs, carbon dioxide out to the right one. In: 21% O2 and 0.04% CO2; out: about 16% and 4%.
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
    columns[side] = { col, bands, values: Object.fromEntries(GAS.map(g => [g.id, g[side]])), labels: {} }
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
  // molecules on the move: O2 in (red pairs), CO2 out (dark, red ends)
  const n = light ? 10 : 22
  const rnd = random(5)
  const o2Mat = new THREE.MeshStandardMaterial({ color: '#f2302b', emissive: '#f2302b', emissiveIntensity: 0.4, roughness: 0.3 })
  const cMat = new THREE.MeshStandardMaterial({ color: '#42464e', roughness: 0.3 })
  const atomGeo = new THREE.SphereGeometry(0.03, 12, 8)
  const movers = []
  for (let i = 0; i < n; i++) {
    const kind = i % 2 ? 'co2' : 'o2'
    const g = new THREE.Group()
    if (kind === 'o2') {
      for (const s of [-1, 1]) {
        const a = new THREE.Mesh(atomGeo, o2Mat)
        a.position.x = s * 0.032
        g.add(a)
      }
    } else {
      const c = new THREE.Mesh(atomGeo, cMat)
      g.add(c)
      for (const s of [-1, 1]) {
        const a = new THREE.Mesh(atomGeo, o2Mat)
        a.position.x = s * 0.06
        a.scale.setScalar(0.9)
        g.add(a)
      }
    }
    g.visible = false
    group.add(g)
    movers.push({ g, kind, t: -1, delay: 0, path: null, spin: new THREE.Vector3(rnd(), rnd(), rnd()) })
  }
  const pathFor = kind => {
    const from = kind === 'o2' ? new THREE.Vector3(-1.0, H0 + 1.6 + rnd() * 0.12, 0) : new THREE.Vector3(0, H0 + 1.3, 0)
    const to = kind === 'o2' ? new THREE.Vector3((rnd() - 0.5) * 0.3, H0 + 1.3, 0.05) : new THREE.Vector3(1.0, H0 + 1.62 + rnd() * 0.1, 0)
    const mid = from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 0.35, 0.15))
    return new THREE.QuadraticBezierCurve3(from, mid, to)
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

  let breath = -1
  return {
    group,
    screen: scr,
    get busy() {
      return breath >= 0
    },
    start() {
      if (breath >= 0) return false
      breath = 0
      movers.forEach((m, i) => {
        m.t = 0
        m.delay = (m.kind === 'o2' ? 0 : 1.6) + (i % 11) * 0.12
        m.path = pathFor(m.kind)
      })
      return true
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t) {
      // a calm breath every 4 s; a deep one while the exhibit runs
      const deep = breath >= 0 ? Math.sin(Math.min(1, breath / 3.6) * Math.PI) : 0
      const s = 1 + Math.sin(t * 1.6) * 0.04 + deep * 0.18
      for (const l of lobes) l.scale.set(0.85 * s, 1.25 * s, 0.7 * s)
      if (breath >= 0) {
        breath += dt
        if (breath > 4.6) breath = -1
      }
      for (const m of movers) {
        if (m.t < 0) continue
        m.t += dt
        const k = (m.t - m.delay) / 1.4
        m.g.visible = k > 0 && k < 1
        if (k > 0 && k < 1) {
          m.path.getPoint(k, m.g.position)
          m.g.rotation.set(t * m.spin.x * 3, t * m.spin.y * 3, 0)
          m.g.scale.setScalar(Math.sin(k * Math.PI) * 0.6 + 0.6)
        }
        if (k >= 1) m.t = -1
      }
    },
  }
}
