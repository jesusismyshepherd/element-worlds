// Two exhibits about the O2 molecule itself.
// - O2 up close: a big O2 (double bond) turning over a projector, beside a screen with its Lewis
//   picture. Using it shows its twelve outer electrons (four shared in the bond, eight at home in pairs);
//   at the Scientist depth also the truth the Lewis picture hides: two electrons unpaired, one in each
//   of two pi* orbitals, with parallel spins (why O2 is magnetic).
// - The magnet: a horseshoe magnet lying on a stand, its poles close together. Liquid oxygen poured from
//   a flask is caught between the poles and hangs there, steaming, until it boils away; liquid nitrogen
//   (press again) falls straight through into the dish below.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { standingScreen, glowMat, hdr, softDot, Particles, glass, damp, ease, clamp, smooth } from './kit.js'

const RED = '#f2302b'
const E_COLOR = '#a8ecff'

/** The big O2 and its Lewis screen. Faces +z (the reader stands in front). */
export function o2UpClose({ color, light, words, level }) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  // the projector
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.42, 48), white)
  base.position.y = 0.21
  base.castShadow = base.receiveShadow = true
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.72, 48), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 }))
  lens.rotation.x = -Math.PI / 2
  lens.position.y = 0.425
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.035, 8, 64), glowMat(color, 1.8))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.43
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.72, 1.3, 40, 1, true),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  )
  beam.position.y = 1.08
  group.add(base, lens, ring, beam)

  // the molecule: 1 metre per angstrom (bond 121 pm)
  const mol = new THREE.Group()
  mol.position.y = 1.95
  group.add(mol)
  const spin = new THREE.Group()
  mol.add(spin)
  const d = 1.21
  const atomR = 0.36
  const oMat = light
    ? new THREE.MeshStandardMaterial({ color: RED, roughness: 0.3, emissive: RED, emissiveIntensity: 0.05 })
    : new THREE.MeshPhysicalMaterial({ color: RED, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12, emissive: RED, emissiveIntensity: 0.05 })
  const atoms = [-1, 1].map(s => {
    const a = new THREE.Mesh(new THREE.SphereGeometry(atomR, 48, 32), oMat)
    a.position.x = (s * d) / 2
    a.castShadow = true
    spin.add(a)
    return a
  })
  const stickMat = new THREE.MeshPhysicalMaterial({ color: '#e9eef7', roughness: 0.3, clearcoat: 0.6 })
  for (const off of [-0.085, 0.085]) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, d - atomR * 1.4, 16), stickMat)
    st.rotation.z = Math.PI / 2
    st.position.y = off
    st.castShadow = true
    spin.add(st)
  }
  // the electrons of the Lewis picture: 4 lone pairs (top and outer side of each atom) and 2 bonding pairs
  const eMat = new THREE.MeshStandardMaterial({ color: E_COLOR, emissive: E_COLOR, emissiveIntensity: 2.2, transparent: true, opacity: 0 })
  const eGeo = new THREE.SphereGeometry(0.05, 16, 12)
  const lewis = new THREE.Group()
  spin.add(lewis)
  const pair = (x, y, z, axis) => {
    for (const s of [-1, 1]) {
      const e = new THREE.Mesh(eGeo, eMat)
      e.position.set(x, y, z).addScaledVector(axis, s * 0.075)
      lewis.add(e)
    }
  }
  const X = new THREE.Vector3(1, 0, 0)
  const Y = new THREE.Vector3(0, 1, 0)
  for (const s of [-1, 1]) {
    const cx = (s * d) / 2
    pair(cx, atomR + 0.16, 0, X) // on top
    pair(cx + s * (atomR + 0.16), 0, 0, Y) // on the outer side
  }
  pair(0, 0.21, 0, X) // the double bond's two pairs, above and below the sticks
  pair(0, -0.21, 0, X)

  // Scientist: the two pi* orbitals (four lobes each, a node between the atoms), one electron in each,
  // spins parallel (the arrows)
  const pis = new THREE.Group()
  spin.add(pis)
  const lobeGeo = new THREE.SphereGeometry(1, 24, 16)
  // the two phases of each orbital, blue and orange; normal blending, so they read against a bright sky
  const lobeMats = ['#3d8bff', '#ff8a2a'].map(c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.45, roughness: 0.4, transparent: true, opacity: 0, depthWrite: false }))
  const piElectrons = []
  const arrowMat = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2), transparent: true, opacity: 0 })
  ;[[Y, 0], [new THREE.Vector3(0, 0, 1), 1]].forEach(([dir, k]) => {
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const lobe = new THREE.Mesh(lobeGeo, lobeMats[(sx * sy > 0 ? 0 : 1)])
        lobe.scale.set(0.2, 0.34, 0.2)
        lobe.position.set((sx * d) / 2 + sx * 0.06, 0, 0).addScaledVector(dir, sy * 0.48)
        lobe.quaternion.setFromUnitVectors(Y, dir)
        pis.add(lobe)
      }
    }
    // its one electron and a spin arrow, both pointing the same way
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffe9a8', emissiveIntensity: 3, transparent: true, opacity: 0 }))
    e.position.set(-d / 2 - 0.06 + k * d * 1.12, 0, 0).addScaledVector(dir, 0.5)
    const arrow = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), arrowMat)
    shaft.position.y = 0.1
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 12), arrowMat)
    head.position.y = 0.23
    arrow.add(shaft, head)
    arrow.position.copy(e.position).add(new THREE.Vector3(0.11, -0.13, 0))
    pis.add(e, arrow)
    piElectrons.push(e)
  })

  // the Lewis screen, to the reader's right, turned a little toward them
  const scr = standingScreen(
    { width: 2.0, height: 1.25, color, title: words.label, big: '', small: '', smallY: -0.42 },
    { top: 1.55, tilt: 0.18 },
  )
  scr.group.position.set(1.85, 0, 0.55)
  scr.group.rotation.y = -0.45
  group.add(scr.group)
  // the picture: O=O with two lone pairs on each O
  const pic = new THREE.Group()
  pic.position.y = 0.06
  scr.content.add(pic)
  const letterCol = hdr('#ffffff', 1.3)
  const dotMat = new THREE.MeshBasicMaterial({ color: hdr(E_COLOR, 1.5) })
  const barMat = new THREE.MeshBasicMaterial({ color: letterCol })
  for (const s of [-1, 1]) {
    const o = makeText('O', { size: 0.34, color: letterCol })
    o.position.x = s * 0.33
    pic.add(o)
  }
  for (const y of [-0.045, 0.045]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.026, 0.01), barMat)
    bar.position.y = y
    pic.add(bar)
  }
  const dotGeo = new THREE.CircleGeometry(0.024, 16)
  const picDots = []
  const dot = (x, y) => {
    const m = new THREE.Mesh(dotGeo, dotMat)
    m.position.set(x, y, 0.005)
    pic.add(m)
    picDots.push(m)
  }
  for (const s of [-1, 1]) {
    dot(s * 0.33 - 0.045, 0.24)
    dot(s * 0.33 + 0.045, 0.24)
    dot(s * 0.56, 0.045)
    dot(s * 0.56, -0.045)
  }
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  let shown = 0
  let target = 0
  return {
    group,
    screen: scr,
    get showing() {
      return target > 0
    },
    toggle() {
      target = target > 0 ? 0 : 1
      return target > 0
    },
    /** The electrons shown or not, for the others in a room (src/net/shared.js). */
    state() {
      return { show: target > 0 }
    },
    /** Someone else showed or hid them: they fade here too; a newcomer's at once. */
    setState({ show = false } = {}, live = false) {
      target = show ? 1 : 0
      if (!live) shown = target
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t) {
      spin.rotation.y = t * 0.35
      mol.rotation.z = Math.sin(t * 0.4) * 0.12
      mol.position.y = 1.95 + Math.sin(t * 1.1) * 0.05
      shown = damp(shown, target, 3, dt)
      eMat.opacity = shown
      const sci = level() === 'scientist'
      const pi = sci ? shown : 0
      for (const m of lobeMats) m.opacity = pi * 0.4
      arrowMat.opacity = pi
      for (const e of piElectrons) e.material.opacity = pi
      // the pairs breathe a little so they read as electrons, not beads
      lewis.children.forEach((e, i) => e.scale.setScalar(1 + Math.sin(t * 5 + i) * 0.12 * shown))
      for (const p of picDots) p.scale.setScalar(1 + shown * (0.35 + Math.sin(t * 5) * 0.15))
      atoms.forEach(a => (a.material.emissiveIntensity = 0.05 + shown * 0.08))
    },
  }
}

/** The horseshoe magnet with its flask, the liquid oxygen bridge and the dish below. Faces +z. */
export function magnetBench({ color, light, words, level }) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  const dark = new THREE.MeshStandardMaterial({ color: '#c3cbd8', roughness: 0.45, metalness: 0.25 })
  // the bench
  const top = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.08, 1.25, 3, 0.03), white)
  top.position.y = 0.92
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.88, 1.05, 3, 0.06), dark)
  body.position.y = 0.44
  const seam = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.025, 1.27, 2, 0.01), glowMat(color, 1.6))
  seam.position.y = 0.875
  group.add(top, body, seam)
  group.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true))

  // everything on the bench sits in a rig drawn 1.6 times life size, scaled about the bench top
  const rig = new THREE.Group()
  rig.scale.setScalar(1.6)
  rig.position.set(0, 0.96 - 0.96 * 1.6, 0.08)
  group.add(rig)
  // the magnet, lying flat on a post: its bend at the back, its poles toward the reader
  const magnet = new THREE.Group()
  magnet.position.set(0, 1.32, -0.05)
  rig.add(magnet)
  const red = new THREE.MeshPhysicalMaterial({ color: '#d7262b', roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 })
  const steel = new THREE.MeshStandardMaterial({ color: '#d9dee6', roughness: 0.22, metalness: 1 })
  const thick = 0.13
  const inner = 0.16
  const bend = new THREE.Mesh(new THREE.TorusGeometry(inner + thick / 2, thick / 2, 20, 40, Math.PI), red)
  bend.rotation.x = -Math.PI / 2 // the half ring's arc turns to -z: the bend at the back
  bend.scale.z = 1.2 // (local z is height once turned) as tall as the legs
  bend.position.z = -0.12
  magnet.add(bend)
  const legLen = 0.34
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new RoundedBoxGeometry(thick, thick * 1.2, legLen, 3, 0.03), red)
    leg.position.set(s * (inner + thick / 2), 0, -0.12 + legLen / 2)
    magnet.add(leg)
    // the pole piece: a steel block bent in toward the other pole
    const pole = new THREE.Mesh(new RoundedBoxGeometry(0.17, thick * 1.2, 0.12, 3, 0.02), steel)
    pole.position.set(s * 0.15, 0, -0.12 + legLen + 0.06)
    magnet.add(pole)
  }
  const label = makeText('N', { size: 0.06, color: hdr('#ffffff', 1.2) })
  label.position.set(-(inner + thick / 2), thick * 0.61, 0.05)
  label.rotation.x = -Math.PI / 2
  const labelS = makeText('S', { size: 0.06, color: hdr('#ffffff', 1.2) })
  labelS.position.set(inner + thick / 2, thick * 0.61, 0.05)
  labelS.rotation.x = -Math.PI / 2
  magnet.add(label, labelS)
  const gapZ = -0.12 + legLen + 0.06 // where the poles face each other (gap 0.13 wide in x)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.36, 16), steel)
  post.position.set(0, 1.12, -0.25)
  rig.add(post)
  magnet.traverse(o => o.isMesh && (o.castShadow = true))

  // the dish under the gap
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.035, 40, 1, true), glass({ opacity: 0.12, edge: 0.7, side: THREE.DoubleSide }))
  dish.position.set(0, 0.98, gapZ - 0.05)
  dish.renderOrder = 5
  const dishFloor = new THREE.Mesh(new THREE.CircleGeometry(0.15, 40), new THREE.MeshStandardMaterial({ color: '#dfe6ee', roughness: 0.15, metalness: 0.1 }))
  dishFloor.rotation.x = -Math.PI / 2
  dishFloor.position.set(0, 0.966, gapZ - 0.05)
  rig.add(dish, dishFloor)

  // the flask on its arm, hanging over the gap
  const arm = new THREE.Group()
  arm.position.set(0.42, 0.96, gapZ - 0.05 - 0.12)
  rig.add(arm)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.95, 12), steel)
  mast.position.y = 0.475
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 12), steel)
  boom.rotation.z = Math.PI / 2
  boom.position.set(-0.25, 0.92, 0)
  arm.add(mast, boom)
  const flaskPivot = new THREE.Group()
  flaskPivot.position.set(-0.47, 0.82, 0.12)
  arm.add(flaskPivot)
  const flask = new THREE.Group()
  flaskPivot.add(flask)
  const flaskBody = new THREE.Mesh(
    new THREE.LatheGeometry([new THREE.Vector2(0, -0.14), new THREE.Vector2(0.075, -0.14), new THREE.Vector2(0.085, -0.11), new THREE.Vector2(0.085, 0.08), new THREE.Vector2(0.05, 0.12), new THREE.Vector2(0.045, 0.16), new THREE.Vector2(0.052, 0.165)], 32),
    steel,
  )
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.05, 32), new THREE.MeshStandardMaterial({ color: '#3b78c4', roughness: 0.4, metalness: 0.3 }))
  band.position.y = -0.02
  flask.add(flaskBody, band)
  flask.traverse(o => o.isMesh && (o.castShadow = true))
  const lip = new THREE.Vector3(0, 0.165, 0)

  // the pour, the bridge between the poles, the puddle in the dish. Liquid oxygen is pale blue;
  // liquid nitrogen is colourless, so its stream is drawn bright and silvery, with mist round it
  const loxColor = new THREE.Color('#9fd2ff')
  const ln2Color = new THREE.Color('#eef6ff')
  const liquid = new THREE.MeshPhysicalMaterial({ color: loxColor, roughness: 0.05, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.88, emissive: loxColor, emissiveIntensity: 0.15, envMapIntensity: 1.6 })
  const streamMat = new THREE.MeshPhysicalMaterial({ color: loxColor, roughness: 0.04, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.92, emissive: loxColor, emissiveIntensity: 0.3, envMapIntensity: 2.2 })
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.022, 1, 14, 1, true), streamMat)
  stream.visible = false
  stream.renderOrder = 7
  rig.add(stream)
  const bridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.07, 8, 20), liquid)
  bridge.rotation.z = Math.PI / 2
  bridge.position.set(0, 1.32, gapZ - 0.05)
  bridge.scale.setScalar(0.001)
  rig.add(bridge)
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.13, 32), liquid)
  puddle.rotation.x = -Math.PI / 2
  puddle.position.set(0, 0.972, gapZ - 0.05)
  puddle.scale.setScalar(0.001)
  rig.add(puddle)
  const frost = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, transparent: true, opacity: 0 })
  for (const s of [-1, 1]) {
    const f = new THREE.Mesh(new RoundedBoxGeometry(0.02, thick * 1.25, 0.125, 2, 0.008), frost)
    f.position.set(s * 0.068, 0, gapZ)
    magnet.add(f)
  }
  // vapour: wisps that rise (k 1) and cold fog that sinks and rolls along the bench (k 2)
  const vapour = new Particles(light ? 50 : 150, { map: softDot(64), additive: false, renderOrder: 6 })
  // drops running down the stream, a splash where it lands, the fizz of a boiling puddle
  const drops = new Particles(light ? 30 : 80, { map: softDot(32, 0, true), additive: false, renderOrder: 8 })
  rig.add(vapour.points, drops.points)
  const BENCH = 0.96 // the bench top, in the rig's frame (the rig is scaled about it)
  const DISH = 0.975
  const cx = 0
  const cz = gapZ - 0.05
  const rnd = Math.random
  const wisp = (x, y, z, spread) => vapour.spawn({
    x: x + (rnd() - 0.5) * spread, y, z: z + (rnd() - 0.5) * spread,
    vx: (rnd() - 0.5) * 0.05, vy: 0.04 + rnd() * 0.06, vz: (rnd() - 0.5) * 0.05,
    life: 1.8 + rnd() * 1.3, size: 0.06, alpha: 0, r: 1, g: 1, b: 1, k: 1,
  })
  const fog = (x, y, z, reach) => {
    const a = rnd() * Math.PI * 2
    const s = reach * (0.5 + rnd() * 0.5)
    vapour.spawn({
      x: x + Math.cos(a) * 0.05, y, z: z + Math.sin(a) * 0.05,
      vx: Math.cos(a) * s, vy: -0.04 - rnd() * 0.04, vz: Math.sin(a) * s,
      life: 2.4 + rnd() * 1.6, size: 0.08, alpha: 0, r: 0.96, g: 0.98, b: 1, k: 2,
    })
  }

  // the screen beside the bench
  const scr = standingScreen(
    { width: 2.0, height: 1.15, color, title: words.title, big: '−183 °C', small: '', bigSize: 0.3, bigY: 0.06, smallY: -0.22 },
    { top: 1.62, tilt: 0.2 },
  )
  scr.group.position.set(-1.6, 0, 0.45)
  scr.group.rotation.y = 0.5
  group.add(scr.group)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  // the show: pour (tilt), the stream falls, LOX gathers in the gap and stays, or LN2 runs through
  let show = null
  let next = 'lox'
  let pours = 0 // for the others in a room
  let bridgeFill = 0 // 0..1, how much liquid oxygen hangs between the poles
  let puddleFill = 0
  const world = new THREE.Vector3()
  const dropColor = new THREE.Color()
  const api = {
    group,
    screen: scr,
    get next() {
      return next
    },
    get busy() {
      return !!show
    },
    pour() {
      if (show) return false
      pours++
      show = { kind: next, t: 0 }
      const c = next === 'lox' ? loxColor : ln2Color
      for (const m of [liquid, streamMat]) {
        m.color.copy(c)
        m.emissive.copy(c)
      }
      liquid.opacity = next === 'lox' ? 0.9 : 0.78
      liquid.emissiveIntensity = next === 'lox' ? 0.15 : 0.35
      streamMat.emissiveIntensity = next === 'lox' ? 0.3 : 0.55
      dropColor.copy(c).multiplyScalar(next === 'lox' ? 1.05 : 1.25)
      next = next === 'lox' ? 'ln2' : 'lox'
      return show.kind
    },
    /** How many pours and which liquid comes next, for the others in a room (src/net/shared.js). */
    state() {
      return { n: pours, next }
    },
    /** Someone else poured: the same liquid pours here (live); a newcomer gets what comes next. */
    setState({ n = 0, next: nx = 'lox' } = {}, live = false) {
      const after = nx === 'ln2' ? 'ln2' : 'lox'
      if (live && n !== pours && !show) {
        next = after === 'lox' ? 'ln2' : 'lox'
        api.pour()
      }
      pours = n
      next = after
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t0, camera, renderer) {
      let tilt = 0
      let streamOn = false
      let fill = bridgeFill
      let pud = puddleFill
      const lox = show?.kind === 'lox'
      if (show) {
        show.t += dt
        const t = show.t
        tilt = smooth(0, 0.6, t) * (1 - smooth(2.6, 3.2, t))
        streamOn = t > 0.55 && t < 2.8
        if (lox) {
          if (t > 0.8 && t < 2.9) fill = Math.min(1, fill + dt * 0.55)
          if (t > 8) fill = Math.max(0, fill - dt * 0.26)
          if (t > 0.8 && fill > 0.05 && rnd() < dt * 22 * fill) wisp(cx, 1.37, cz, 0.12)
          frost.opacity = damp(frost.opacity, t < 10 ? 0.85 : 0, 1.5, dt)
          if (t > 12 && fill <= 0.001) show = null
        } else {
          if (t > 0.9 && t < 3) pud = Math.min(1, pud + dt * 0.6)
          if (t > 3) pud = Math.max(0, pud - dt * 0.25)
          // it boils hard: heavy cold fog rolls over the dish and along the bench, wisps rise
          if (t > 0.9 && pud > 0.04) {
            if (rnd() < dt * 40 * pud) fog(cx, DISH + 0.02, cz, 0.16 + pud * 0.12)
            if (rnd() < dt * 14 * pud) wisp(cx, DISH + 0.03, cz, 0.18)
            // the fizz on its surface
            if (rnd() < dt * 50 * pud) {
              const a = rnd() * Math.PI * 2
              const r = Math.sqrt(rnd()) * 0.12 * pud
              drops.spawn({ x: cx + Math.cos(a) * r, y: DISH + 0.004, z: cz + Math.sin(a) * r, vy: 0.08, life: 0.18, size: 0.012, alpha: 0.9, r: 1.3, g: 1.35, b: 1.4 })
            }
          }
          if (t > 7.5 && pud <= 0.001) show = null
        }
      }
      flask.rotation.z = tilt * 1.9
      bridgeFill = fill
      puddleFill = pud
      // the bridge fills the gap first (its length), then swells; it shrinks the same way as it boils
      const swell = Math.max(0.001, Math.min(1, fill * 1.4))
      bridge.scale.set(Math.max(0.001, Math.min(1, fill * 2)), swell, swell)
      puddle.scale.setScalar(Math.max(0.001, pud))
      stream.visible = streamOn
      if (streamOn) {
        flask.updateWorldMatrix(true, false)
        world.copy(lip).applyMatrix4(flask.matrixWorld)
        rig.worldToLocal(world)
        // from the flask's lip down to the gap (oxygen stops there) or the dish (nitrogen runs through)
        const bottom = lox ? 1.36 : DISH
        const dx = world.x - cx
        const dy = Math.max(0.02, world.y - 0.01 - bottom)
        const len = Math.hypot(dx, dy)
        stream.position.set(cx + dx / 2, bottom + dy / 2, cz)
        stream.scale.set(1, len, 1)
        stream.rotation.z = -Math.atan2(dx, dy)
        // drops sliding down it show the flow; a splash where it lands; nitrogen trails mist all the way
        const speed = 1.6
        for (let i = 0; i < (light ? 1 : 3); i++) {
          if (rnd() < dt * 30) {
            const u = rnd() * 0.3
            drops.spawn({
              x: world.x - dx * u + (rnd() - 0.5) * 0.012, y: world.y - dy * u, z: cz + (rnd() - 0.5) * 0.012,
              vx: (-dx / len) * speed, vy: (-dy / len) * speed, vz: 0,
              life: (len * (1 - u)) / speed, size: 0.016 + rnd() * 0.01, alpha: 0.95, r: dropColor.r, g: dropColor.g, b: dropColor.b,
            })
          }
        }
        if (rnd() < dt * 24) {
          drops.spawn({ x: cx, y: bottom + 0.01, z: cz, vx: (rnd() - 0.5) * 0.5, vy: 0.3 + rnd() * 0.4, vz: (rnd() - 0.5) * 0.5, life: 0.35, size: 0.012, alpha: 0.9, r: dropColor.r, g: dropColor.g, b: dropColor.b, k: 1 })
        }
        if (!lox && rnd() < dt * 18) {
          const u = rnd()
          wisp(world.x - dx * u, world.y - dy * u, cz, 0.05)
        }
      }
      vapour.step(dt, (p, d, k) => {
        if (p.k === 2) {
          // cold, heavy: it settles on the bench, spreads and slows
          if (p.y < BENCH + 0.025) {
            p.y = BENCH + 0.025
            p.vy = 0
          }
          p.vx *= 1 - d * 0.6
          p.vz *= 1 - d * 0.6
          p.size = 0.08 + k * 0.34
          p.alpha = Math.sin(Math.min(1, k * 1.4) * Math.PI) * 0.5
        } else {
          p.size = 0.06 + k * 0.26
          p.alpha = Math.sin(k * Math.PI) * 0.42
          p.vx += (rnd() - 0.5) * d * 0.1
        }
      }, camera, renderer)
      drops.step(dt, (p, d) => {
        if (p.k === 1) p.vy -= 3 * d
      }, camera, renderer)
    },
  }
  return api
}
