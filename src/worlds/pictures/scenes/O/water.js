// Oxygen's picture "Water is mostly oxygen" as a room (docs/knowledge/picture-rooms.md): the great hall of a
// wooden bathhouse at the edge of a frozen lake on a winter afternoon (stages/bathhouse.js), a deep wooden
// bath steaming inside, and through the big window the lake: the ice on top, the water and its fish below.
// Three things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed
// steps felt passive); the prompt names the next tap, E opens the station's panel, whose buttons and sliders
// do the same:
// - the great balance (the picture's golden balance): tap the bath and its water rises out as a ball and
//   comes apart, the oxygen in one red globe onto one pan, the hydrogen in two white globes onto the other
//   (twice the volume as gases, equal volumes holding equal numbers of molecules), and the oxygen's pan sinks.
//   A slider for how much water (a glass, a bucket, the bath, an Olympic pool) changes the weights on the
//   plates. Beside it the real way: a battery (Volta's pile) and Hofmann's three glass tubes; tap the pile
//   and hydrogen bubbles up twice as fast as oxygen; tap the tubes to let the gas out. Tap the balance to
//   put the water back;
// - the bent molecule: water molecules about two billion times bigger, to walk among. Tap the big one to
//   see its charges and its 104.5°; tap the balloon and it is rubbed on the wool and held by the thin stream
//   from the tap, which bends towards it (by charge induced in the water, not by dipoles turning: the
//   words say so); tap the salt and a grain of it comes apart among the molecules, waters turning their
//   oxygen sides to each sodium ion and their hydrogen sides to each chloride ion and carrying them off;
// - the frozen lake: a slider (or the thermometer outside, tapped for the next weeks) takes the air through
//   a winter; the lake mixes down to 4 °C, then keeps its coldest water on top, freezes from the top, and
//   the fish keep to the 4 °C water near the bottom (three readings on a line through the ice). Tap the
//   ice, or the model by the window, and the molecules of a drop of water lock into ice's open hexagons
//   (each molecule with exactly two hydrogens, by the ice rules), taking 9% more room; a snowflake grows on
//   the glass. Tap the model again to melt it.
// Not the fire wing's splint or the hydrogen pop, not the body's recipe (carbon's room), not the sea's salt
// (sodium's room): water itself. All shared in a room (src/net/shared.js); the words, panels and discoveries
// stay each one's. parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill, num, screen } from '../../../wings/noble/kit.js'
import { bathhouseStage } from '../../stages/bathhouse.js'
import { ionCloud, softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { WATER_WORDS } from './water.words.js'

export const WORDS = WATER_WORDS

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const BAL_C = '#f2c14e'
const MOL_C = '#ff8a7a'
const ICE_C = '#8fdcff'
// the game's atom colours (CPK, as chem/ballAndStick.js): oxygen red, hydrogen white
const RED = '#f2302b'
const WHITE = '#f4f6fb'
const HALF = (104.5 / 2) * DEG

// where things stand
const WL = 1.4 // the lake's level outside the window
const STAND1 = { x: 2.0, z: -1.0 }
const BAL = { x: 6.7, z: -0.6, pivot: 3.75, half: 1.65, drop: 2.2, max: 0.26 }
const BATH = { x: 5.0, z: -0.6, rx: 0.43, rz: 0.8, h: 0.62, water: 0.5 }
const VOLT = { x: 4.8, z: -2.95 }
const STAND2 = { x: -1.5, z: 0.3 }
const GARDEN = { x: -5.6, z: -0.4, r: 1.6, y0: 0.8, y1: 2.8 }
const FEAT = V3(-4.4, 1.8, -0.95)
const BASIN = { x: -3.85, z: 1.75 }
const WOOL = { x: -4.8, z: 2.6 }
const CRYSTAL = V3(GARDEN.x, 1.75, GARDEN.z)
const STAND3 = { x: -0.1, z: -4.2 }
const MODEL = { x: 1.55, z: -5.9 }
const facing = (from, to) => Math.atan2(to.x - from.x, to.z - from.z)

// the amounts the balance takes apart (litres, at 1 kg per litre)
const AMOUNTS = ['glass', 'bucket', 'bath', 'pool']
const LITRES = { glass: 0.25, bucket: 10, bath: 150, pool: 2.5e6 }
const M_O = 15.999 / 18.015
const M_H = 2.016 / 18.015
const MOLAR_VOL = 0.024055 // m³ per mole of gas at 20 °C and 1 atm

// ---- small pieces ----

/** Words drawn in 3D, with a dark edge so they read against wood, water and snow. */
const label = (text, size, color = '#ffffff', opts = {}) => makeText(text, { size, color, outlineWidth: size * 0.14, outlineColor: '#10161f', ...opts })

/** Water molecules as two instanced meshes (one ball per oxygen, two per molecule for the hydrogens).
 *  set(i, o, h1, h2, s): the oxygen at o, the hydrogens at h1 and h2, balls scaled by s (0 hides it). */
function moleculeSet(max, { rO, rH, mats, seg = 18 }) {
  const ball = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  const o = new THREE.InstancedMesh(ball, mats.O, max)
  const h = new THREE.InstancedMesh(ball, mats.H, max * 2)
  for (const m of [o, h]) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  }
  const mx = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const sc = new THREE.Vector3()
  return {
    group: [o, h],
    set(i, po, h1, h2, s = 1) {
      mx.compose(po, q, sc.setScalar(Math.max(1e-4, rO * s)))
      o.setMatrixAt(i, mx)
      mx.compose(h1, q, sc.setScalar(Math.max(1e-4, rH * s)))
      h.setMatrixAt(i * 2, mx)
      mx.compose(h2, q, sc.setScalar(Math.max(1e-4, rH * s)))
      h.setMatrixAt(i * 2 + 1, mx)
    },
    done() {
      o.instanceMatrix.needsUpdate = true
      h.instanceMatrix.needsUpdate = true
    },
    dispose: () => ball.dispose(),
  }
}

/** The hydrogens of a molecule at `o`, turned by `q`, its bisector along the turned +y, bonds `d` long. */
const H1 = new THREE.Vector3()
const H2 = new THREE.Vector3()
function hydrogens(o, q, d) {
  H1.set(Math.sin(HALF) * d, Math.cos(HALF) * d, 0).applyQuaternion(q).add(o)
  H2.set(-Math.sin(HALF) * d, Math.cos(HALF) * d, 0).applyQuaternion(q).add(o)
  return [H1, H2]
}

/** A turn that points +y along `dir`, rolled by `roll` about it. */
const YUP = new THREE.Vector3(0, 1, 0)
function pointY(dir, roll, out = new THREE.Quaternion()) {
  out.setFromUnitVectors(YUP, dir)
  return out.premultiply(new THREE.Quaternion().setFromAxisAngle(dir, roll))
}

/**
 * A patch of ice Ih, its c axis along z (so its open hexagonal channels face whoever looks along z): two
 * puckered bilayers of a honeycomb (O–O 2.76 Å). The hydrogens follow the ice rules (two on every oxygen,
 * one on every O–O bond): every bond, and every bond that would leave the patch, is walked once by
 * Hierholzer's algorithm, and each oxygen keeps the hydrogens on the bonds walked away from it (an
 * Eulerian circuit enters and leaves each oxygen twice). Returns positions in ångström.
 */
function iceLattice({ halfW = 7.0, halfH = 5.3, layers = 2 } = {}) {
  const S = 2.61 // the honeycomb's side seen along c (a / √3, a = 4.52 Å)
  const C = 7.36
  const a1 = [Math.sqrt(3) * S, 0]
  const a2 = [(Math.sqrt(3) * S) / 2, 1.5 * S]
  const key = (i, j, t, k) => `${i},${j},${t},${k}`
  const site = (i, j, t) => [i * a1[0] + j * a2[0], j * a2[1] + (t ? S : 0) - S / 2]
  const zOf = (t, k) => k * (C / 2) + ((k % 2 === 0) === (t === 0) ? 0 : C / 8)
  const atoms = []
  const idx = new Map()
  for (let k = 0; k < layers; k++)
    for (let i = -6; i <= 6; i++)
      for (let j = -5; j <= 5; j++)
        for (const t of [0, 1]) {
          const [x, y] = site(i, j, t)
          if (Math.abs(x) > halfW || Math.abs(y) > halfH) continue
          idx.set(key(i, j, t, k), atoms.length)
          atoms.push({ i, j, t, k, p: V3(x, y, zOf(t, k)), h: [] })
        }
  const nbrs = a => {
    const { i, j, t, k } = a
    const flat = t === 0 ? [[i, j, 1], [i, j - 1, 1], [i + 1, j - 1, 1]] : [[i, j, 0], [i, j + 1, 0], [i - 1, j + 1, 0]]
    const lower = (k % 2 === 0) === (t === 0)
    return [...flat.map(([ii, jj, tt]) => [ii, jj, tt, k]), [i, j, t, lower ? k - 1 : k + 1]].map(([ii, jj, tt, kk]) => ({ key: key(ii, jj, tt, kk), p: V3(...site(ii, jj, tt), zOf(tt, kk)) }))
  }
  const V = atoms.length
  const edges = []
  const seen = new Set()
  atoms.forEach((a, u) => {
    for (const n of nbrs(a)) {
      const v = idx.get(n.key)
      if (v === undefined) edges.push({ u, v: V, dir: n.p.clone().sub(a.p) })
      else {
        const ek = u < v ? `${u}-${v}` : `${v}-${u}`
        if (seen.has(ek)) continue
        seen.add(ek)
        edges.push({ u, v, dir: n.p.clone().sub(a.p) })
      }
    }
  })
  const adj = Array.from({ length: V + 1 }, () => [])
  edges.forEach((e, n) => {
    adj[e.u].push(n)
    adj[e.v].push(n)
  })
  const used = new Array(edges.length).fill(false)
  const ptr = new Array(V + 1).fill(0)
  const stack = [V]
  while (stack.length) {
    const v = stack[stack.length - 1]
    while (ptr[v] < adj[v].length && used[adj[v][ptr[v]]]) ptr[v]++
    if (ptr[v] >= adj[v].length) {
      stack.pop()
      continue
    }
    const n = adj[v][ptr[v]]
    used[n] = true
    const e = edges[n]
    const from = e.u === v ? e.u : e.v
    const to = e.u === v ? e.v : e.u
    // the hydrogen sits on the oxygen the walk left, pointing along the bond
    if (from < V) atoms[from].h.push({ dir: (from === e.u ? e.dir.clone() : e.dir.clone().negate()).normalize(), to: to < V ? to : -1 })
    stack.push(to)
  }
  return atoms
}

/** A knitted jumper's texture: rows of little V stitches. */
function knitTex(color) {
  const c = new THREE.Color(color)
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = `#${c.getHexString()}`
    g.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 8) {
      for (let x = 0; x < w; x += 8) {
        g.strokeStyle = `#${c.clone().offsetHSL(0, 0, 0.08).getHexString()}`
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x + 4, y + 7)
        g.lineTo(x + 8, y)
        g.stroke()
      }
    }
  }, { repeat: true })
}

/** A perch's side: green-gold, darker back, dark bars across. */
function perchTex() {
  return canvasTex(128, 64, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#3f5a2c')
    grd.addColorStop(0.5, '#a7a34e')
    grd.addColorStop(1, '#e8e2c0')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(30,40,20,0.7)'
    for (let i = 0; i < 6; i++) {
      g.beginPath()
      g.ellipse(22 + i * 16, h * 0.35, 4, h * 0.3, 0, 0, TAU)
      g.fill()
    }
  })
}

/** A snowflake: six arms, each with its side branches. */
function snowflakeTex() {
  return canvasTex(256, 256, (g, w) => {
    g.clearRect(0, 0, w, w)
    g.translate(w / 2, w / 2)
    g.strokeStyle = 'rgba(255,255,255,0.95)'
    g.lineCap = 'round'
    g.shadowColor = 'rgba(190,230,255,0.9)'
    g.shadowBlur = 6
    for (let k = 0; k < 6; k++) {
      g.save()
      g.rotate((k * Math.PI) / 3)
      g.lineWidth = 5
      g.beginPath()
      g.moveTo(0, 0)
      g.lineTo(0, -112)
      g.stroke()
      g.lineWidth = 3.5
      for (const [d, l] of [[34, 30], [62, 26], [88, 16]]) {
        for (const s of [-1, 1]) {
          g.beginPath()
          g.moveTo(0, -d)
          g.lineTo(s * l * 0.87, -d - l * 0.5)
          g.stroke()
        }
      }
      g.restore()
    }
    g.lineWidth = 3
    g.beginPath()
    for (let k = 0; k <= 6; k++) {
      const a = (k * Math.PI) / 3
      g.lineTo(Math.sin(a) * 18, -Math.cos(a) * 18)
    }
    g.stroke()
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable, lang }) {
  const stage = bathhouseStage({
    light,
    water: WL,
    lamps: [
      { x: 3.0, z: 2.2, light: true },
      { x: -3.0, z: 2.2, light: true },
      { x: 0, z: -2.2, light: true, intensity: 5 },
      { x: 3.4, z: -4.6 },
      { x: -3.4, z: -4.6 },
    ],
    benches: [
      { x: -5.6, z: 6.45, len: 3.2 },
      { x: 5.6, z: 6.45, len: 3.2 },
    ],
  })
  root.add(stage.group)
  const lake = stage.lake
  const Z0 = stage.window.z
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  let clock = 0
  const keep = t => (textures.push(t), t)
  const paras = list => list.map(p => ({ p }))
  const lv = () => level()
  const n1 = v => num(v, 1, lang)
  // a panel already open is written again when what it shows changed (a choice, a result)
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still at
   *  that station. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const dummy = new THREE.Object3D()
  const tmpC = new THREE.Color()

  const M = {
    wood: stage.mats.wood,
    dark: stage.mats.dark,
    iron: stage.mats.iron,
    gold: new THREE.MeshStandardMaterial({ color: '#d9a940', roughness: 0.28, metalness: 0.9, emissive: '#3a2800', emissiveIntensity: 0.3 }),
    O: new THREE.MeshStandardMaterial({ color: RED, roughness: 0.32, emissive: RED, emissiveIntensity: 0.16 }),
    H: new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.32, emissive: '#ffffff', emissiveIntensity: 0.08 }),
    glass: new THREE.MeshStandardMaterial({ color: '#eef6fb', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: '#7cc0dc', roughness: 0.08, metalness: 0.1, emissive: '#2c6f90', emissiveIntensity: 0.35, transparent: true, opacity: 0.85 }),
    hit: new THREE.MeshBasicMaterial({ visible: false }),
    copper: new THREE.MeshStandardMaterial({ color: '#c47a45', roughness: 0.35, metalness: 0.8 }),
    zinc: new THREE.MeshStandardMaterial({ color: '#a9b0b6', roughness: 0.4, metalness: 0.7 }),
    card: new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.9 }),
  }

  // ======== 1. the great balance, the bath, the battery and the tubes ========
  // -- the bath: an oval tub of staves with two iron hoops, steaming water --
  const staveTex = keep(canvasTex(256, 64, (g, w, h) => {
    const rnd = random(13)
    for (let i = 0; i < 16; i++) {
      const k = 0.85 + rnd() * 0.25
      g.fillStyle = `rgb(${Math.round(168 * k)},${Math.round(116 * k)},${Math.round(70 * k)})`
      g.fillRect((i * w) / 16, 0, w / 16, h)
      g.fillStyle = 'rgba(60,34,16,0.6)'
      g.fillRect((i * w) / 16, 0, 1.5, h)
    }
  }, { repeat: true }))
  const staveMat = new THREE.MeshStandardMaterial({ map: staveTex, roughness: 0.65, side: THREE.DoubleSide })
  const bath = new THREE.Group()
  bath.position.set(BATH.x, 0, BATH.z)
  root.add(bath)
  {
    const side = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.93, BATH.h, 48, 1, true).translate(0, BATH.h / 2, 0).scale(BATH.rx, 1, BATH.rz), staveMat)
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2).scale(BATH.rx * 0.93, 1, BATH.rz * 0.93), M.dark)
    bottom.position.y = 0.04
    bath.add(side, bottom)
    for (const [y, r] of [[0.14, 0.95], [0.5, 0.99]]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 56).rotateX(Math.PI / 2).scale(BATH.rx * r + 0.012, 1, BATH.rz * r + 0.012), M.iron)
      hoop.position.y = y
      bath.add(hoop)
    }
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 6, 56).rotateX(Math.PI / 2).scale(BATH.rx + 0.005, 1, BATH.rz + 0.005), M.wood)
    rim.position.y = BATH.h
    bath.add(rim)
    // a wooden step in front, a ladle hanging on the rim
    const step = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.16, 0.9, 2, 0.03), M.wood)
    step.position.set(-BATH.rx - 0.24, 0.08, 0)
    bath.add(step)
  }
  const bathWater = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2).scale(BATH.rx * 0.96, 1, BATH.rz * 0.96), M.water)
  bath.add(bathWater)
  solids.push(box(BATH.x - 0.12, BATH.z, 1.15, 1.75))
  // steam: soft puffs rising from the water while there is water
  const glow = softGlow()
  const steam = Array.from({ length: light ? 6 : 12 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#f4f8ff', transparent: true, depthWrite: false, opacity: 0 }))
    s.userData = { seed: i * 1.37, x: (random(40 + i)() - 0.5) * BATH.rx * 1.2, z: (random(80 + i)() - 0.5) * BATH.rz * 1.4 }
    s.raycast = () => {}
    bath.add(s)
    return s
  })

  // -- the balance: a plinth, a golden post, the beam, two pans hanging on chains --
  const balance = new THREE.Group()
  root.add(balance)
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.22, 1.3, 2, 0.05), M.dark)
    base.position.set(BAL.x, 0.11, BAL.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.46, 0.18, 32), M.gold)
    foot.position.set(BAL.x, 0.31, BAL.z)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, BAL.pivot - 0.4, 20), M.gold)
    post.position.set(BAL.x, 0.4 + (BAL.pivot - 0.4) / 2, BAL.z)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), M.gold)
    knob.position.set(BAL.x, BAL.pivot, BAL.z)
    balance.add(base, foot, post, knob)
  }
  const beam = new THREE.Group()
  beam.position.set(BAL.x, BAL.pivot, BAL.z)
  balance.add(beam)
  {
    const bar = new THREE.Mesh(new RoundedBoxGeometry(0.09, 0.11, BAL.half * 2 + 0.1, 2, 0.03), M.gold)
    beam.add(bar)
    for (const s of [-1, 1]) {
      const end = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), M.gold)
      end.position.z = s * BAL.half
      beam.add(end)
    }
    // the pointer on top, as in the picture
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 3).rotateX(Math.PI), M.gold)
    tip.position.y = 0.3
    beam.add(tip)
  }
  const PAN_R = 0.62
  const panGeo = new THREE.LatheGeometry([[0, 0], [0.4, 0.01], [0.56, 0.05], [PAN_R, 0.11], [PAN_R + 0.02, 0.12]].map(([x, y]) => new THREE.Vector2(x, y)), 40)
  const pans = [0, 1].map(() => {
    const g = new THREE.Group()
    const pan = new THREE.Mesh(panGeo, new THREE.MeshStandardMaterial({ color: '#d9a940', roughness: 0.3, metalness: 0.9, side: THREE.DoubleSide, emissive: '#3a2800', emissiveIntensity: 0.3 }))
    g.add(pan)
    // three chains from the beam's end to the rim
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + Math.PI / 2
      const rim = V3(Math.cos(a) * (PAN_R - 0.02), 0.11, Math.sin(a) * (PAN_R - 0.02))
      const top = V3(0, BAL.drop, 0)
      const len = top.distanceTo(rim)
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 5), M.gold)
      chain.position.copy(top).add(rim).multiplyScalar(0.5)
      chain.quaternion.setFromUnitVectors(YUP, top.clone().sub(rim).normalize())
      g.add(chain)
    }
    balance.add(g)
    return g
  })
  /** Where a pan hangs (0 the oxygen's, toward -z; 1 the hydrogen's) at a tilt (oxygen side down). */
  const panAt = (k, tilt, out = new THREE.Vector3()) => {
    const s = k === 0 ? -1 : 1
    return out.set(BAL.x, BAL.pivot + s * BAL.half * Math.sin(tilt) - BAL.drop, BAL.z + s * BAL.half * Math.cos(tilt))
  }
  solids.push(box(BAL.x, BAL.z, 1.6, 4.0))
  // the globes: one red for the oxygen, two white for the hydrogen, all the same size (equal volumes of gas
  // hold equal numbers of molecules: two H2 for every O2)
  const GLOBE_R = 0.28
  const globeGeo = new THREE.SphereGeometry(GLOBE_R, 32, 20)
  const gMat = {
    O: new THREE.MeshStandardMaterial({ color: RED, roughness: 0.22, emissive: RED, emissiveIntensity: 0.18 }),
    H: new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.22, emissive: '#ffffff', emissiveIntensity: 0.1 }),
  }
  const globes = [
    { m: new THREE.Mesh(globeGeo, gMat.O), pan: 0, off: V3(0, GLOBE_R + 0.06, 0), from: V3(0, 0.02, -0.2) },
    { m: new THREE.Mesh(globeGeo, gMat.H), pan: 1, off: V3(0, GLOBE_R + 0.06, -0.29), from: V3(0, 0.06, 0.12) },
    { m: new THREE.Mesh(globeGeo, gMat.H), pan: 1, off: V3(0, GLOBE_R + 0.06, 0.29), from: V3(0, -0.06, 0.32) },
  ]
  for (const g of globes) balance.add(g.m)
  // the water lifted out of the bath, as a ball
  const BALL_R = 0.36
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 32, 20), M.water)
  root.add(ball)
  const MERGE = V3(BATH.x, 2.45, BATH.z)
  const WATER_COL = new THREE.Color('#7cc0dc')
  const RED_COL = new THREE.Color(RED)
  const WHITE_COL = new THREE.Color(WHITE)
  // the plates: what the water is, and what each pan holds
  const amountPlate = screen({ width: 1.55, height: 0.42, color: BAL_C, title: '', line: '', titleSize: 0.12, lineSize: 0.075 })
  amountPlate.group.position.set(BAL.x - 0.16, 1.72, BAL.z)
  amountPlate.group.rotation.y = facing(BAL, STAND1)
  balance.add(amountPlate.group)
  const panPlates = [RED, '#dfe6f5'].map(c => {
    const p = screen({ width: 1.1, height: 0.4, color: c, title: '', line: '', titleSize: 0.11, lineSize: 0.08 })
    balance.add(p.group)
    return p
  })
  // a hit shape for the whole balance (the beam and chains are thin)
  const balHit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.9, 4.6), M.hit)
  balHit.position.set(BAL.x, 2.2, BAL.z)
  balance.add(balHit)

  // -- the battery and Hofmann's tubes, on a table by the bath --
  const volt = new THREE.Group()
  volt.position.set(VOLT.x, 0, VOLT.z)
  volt.rotation.y = facing(VOLT, STAND1)
  root.add(volt)
  const TOP = 0.8
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.05, 0.6, 2, 0.015), M.wood)
    top.position.y = TOP - 0.025
    volt.add(top)
    for (const [x, z] of [[-0.48, -0.24], [0.48, -0.24], [-0.48, 0.24], [0.48, 0.24]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, TOP - 0.05, 0.05), M.dark)
      leg.position.set(x, (TOP - 0.05) / 2, z)
      volt.add(leg)
    }
  }
  solids.push(circle(VOLT.x, VOLT.z, 0.62))
  const tubes = new THREE.Group()
  tubes.position.set(-0.12, TOP, 0)
  // (larger than a real one, about 1.35 times, so it reads from where the visitor stands)
  tubes.scale.setScalar(1.35)
  volt.add(tubes)
  const TUBE = { r: 0.024, y0: 0.12, y1: 0.74, dx: 0.11, gasO: 0.2, gasH: 0.4 }
  const tubeWater = {}
  {
    // the stand: a foot and a rod behind the tubes, clamps
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.2), M.iron)
    foot.position.set(0, 0.0125, -0.02)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 8), M.iron)
    rod.position.set(0, 0.5, -0.09)
    tubes.add(foot, rod)
    for (const y of [0.3, 0.62]) {
      const clamp_ = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.05), M.iron)
      clamp_.position.set(0, y, -0.06)
      tubes.add(clamp_)
    }
    // the three tubes: oxygen's on the left, the reservoir with its bulb in the middle, hydrogen's on the right
    for (const [k, x] of [['O', -TUBE.dx], ['H', TUBE.dx]]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r, TUBE.r, TUBE.y1 - TUBE.y0, 20, 1, true).translate(0, (TUBE.y0 + TUBE.y1) / 2, 0), M.glass)
      t.position.x = x
      t.renderOrder = 3
      const cock = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 10), M.gold)
      cock.position.set(x, TUBE.y1 + 0.03, 0)
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.008), M.gold)
      handle.position.set(x, TUBE.y1 + 0.04, 0)
      const electrode = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.004), new THREE.MeshStandardMaterial({ color: '#d7dbe0', roughness: 0.25, metalness: 0.9 }))
      electrode.position.set(x, TUBE.y0 + 0.07, 0)
      const w = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * 0.88, TUBE.r * 0.88, 1, 16).translate(0, 0.5, 0), M.water)
      w.position.set(x, TUBE.y0, 0)
      w.renderOrder = 2
      tubeWater[k] = w
      tubes.add(t, cock, handle, electrode, w)
    }
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.52, 14, 1, true).translate(0, TUBE.y0 + 0.26, 0), M.glass)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 14), M.glass)
    bulb.position.y = TUBE.y0 + 0.58
    const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, TUBE.dx * 2, 12).rotateZ(Math.PI / 2), M.glass)
    cross.position.y = TUBE.y0
    const crossW = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, TUBE.dx * 2, 12).rotateZ(Math.PI / 2), M.water)
    crossW.position.y = TUBE.y0
    const midW = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 1, 12).translate(0, 0.5, 0), M.water)
    midW.position.y = TUBE.y0
    tubeWater.mid = midW
    tubes.add(mid, bulb, cross, crossW, midW)
  }
  // the gas readings over the tubes, and the signs at the wires
  const voltLabels = {
    O: label('', 0.045, '#ff9a92', { anchorY: 'bottom', maxWidth: 0.5 }),
    H: label('', 0.045, '#ffffff', { anchorY: 'bottom', maxWidth: 0.5 }),
  }
  voltLabels.O.position.set(-TUBE.dx - 0.07, TUBE.y1 + 0.1, 0.03)
  voltLabels.H.position.set(TUBE.dx + 0.07, TUBE.y1 + 0.1, 0.03)
  tubes.add(voltLabels.O, voltLabels.H)
  for (const [x, s] of [[-TUBE.dx, '+'], [TUBE.dx, '−']]) {
    const t = label(s, 0.07, s === '+' ? '#ff9a92' : '#bfe0ff')
    t.position.set(x + (x < 0 ? -0.07 : 0.07), TUBE.y0 + 0.06, 0.03)
    tubes.add(t)
  }
  // bubbles rising from the wires
  const BUBS = light ? 30 : 60
  const bubMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.75, depthWrite: false }), BUBS)
  bubMesh.count = 0
  bubMesh.frustumCulled = false
  bubMesh.renderOrder = 4
  tubes.add(bubMesh)
  const bubbles = []
  // Volta's pile: copper, zinc and brine-soaked card, again and again, between three glass rods
  const pile = new THREE.Group()
  pile.position.set(0.32, TOP, 0.02)
  pile.scale.setScalar(1.35)
  volt.add(pile)
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.03, 0.16, 2, 0.01), M.wood)
    base.position.y = 0.015
    pile.add(base)
    const disc = new THREE.CylinderGeometry(0.048, 0.048, 1, 20)
    let y = 0.03
    for (let i = 0; i < 14; i++) {
      for (const [mat, th] of [[M.copper, 0.007], [M.zinc, 0.007], [M.card, 0.006]]) {
        const d = new THREE.Mesh(disc, mat)
        d.scale.y = th
        d.position.y = y + th / 2
        pile.add(d)
        y += th
      }
    }
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU
      const rodG = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, y + 0.04, 6), M.glass)
      rodG.position.set(Math.cos(a) * 0.062, (y + 0.04) / 2, Math.sin(a) * 0.062)
      pile.add(rodG)
    }
    const cap = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.025, 0.15, 2, 0.008), M.wood)
    cap.position.y = y + 0.045
    pile.add(cap)
    pile.userData.top = y + 0.06
    const hitP = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, y + 0.12, 10).translate(0, (y + 0.12) / 2, 0), M.hit)
    pile.add(hitP)
  }
  const pileLabel = label(E.balance.signs.pile, 0.045, '#ffe2a8', { anchorY: 'bottom', maxWidth: 0.6 })
  pileLabel.position.set(0, pile.userData.top + 0.06, 0)
  pile.add(pileLabel)
  // the switch: a little brass knife on the table, closed while the current runs
  const knife = new THREE.Group()
  knife.position.set(0.16, TOP + 0.02, 0.18)
  volt.add(knife)
  const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.008, 0.11).translate(0, 0, 0.055), M.gold)
  knife.add(knifeBlade)
  {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.16), M.dark)
    pad.position.set(0, -0.012, 0.05)
    knife.add(pad)
  }
  const spark = new THREE.PointLight('#ffd27a', 0, 0.6, 2)
  spark.position.set(0.16, TOP + 0.08, 0.28)
  volt.add(spark)
  // the wires: from the pile's top to the oxygen's wire (+), from its foot to the hydrogen's (−)
  {
    const wireMat = new THREE.MeshStandardMaterial({ color: '#b5653a', roughness: 0.4, metalness: 0.6 })
    const wire = pts => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.004, 5), wireMat)
    const VS = 1.35
    const pT = V3(0.32, TOP + pile.userData.top * VS + 0.02, 0.02)
    const eO = V3(-0.12 - TUBE.dx * VS, TOP + (TUBE.y0 - 0.02) * VS, 0.0)
    const eH = V3(-0.12 + TUBE.dx * VS, TOP + (TUBE.y0 - 0.02) * VS, 0.0)
    volt.add(wire([pT, V3(0.32, pT.y + 0.1, 0.08), V3(0.0, TOP + 0.3, 0.18), V3(eO.x, TOP + 0.05, 0.12), eO]))
    volt.add(wire([V3(0.24, TOP + 0.03, 0.02), V3(0.16, TOP + 0.015, 0.18), V3(0.04, TOP + 0.01, 0.12), V3(eH.x, TOP + 0.03, 0.08), eH]))
  }
  const tubesHit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.2), M.hit)
  tubesHit.position.set(0, 0.47, 0)
  tubes.add(tubesHit)

  // -- its state, its steps --
  const B = { split: false, amount: 2, n: 0, start: -99, live: false, mine: false, said: true }
  const SPLIT_T = 4.6
  const BACK_T = 4.0
  const age1 = () => clock - B.start
  const busy1 = () => B.live && age1() < (B.split ? SPLIT_T : BACK_T)
  const VR = 1 / 13 // the share of the tubes filled each second
  // f: how full of gas the tubes are (the state); shown: what the tubes show (it falls while they empty)
  const Vt = { on: false, f: 0, shown: 0, n: 0, mine: false, saidFull: true }
  const litres = () => LITRES[AMOUNTS[B.amount]]
  const fmtMass = kg => (kg < 1 ? `${Math.round(kg * 1000)} g` : kg < 10 ? `${n1(kg)} kg` : kg < 1000 ? `${Math.round(kg)} kg` : `${Math.round(kg / 1000)} t`)
  const fmtVol = m3 =>
    m3 < 1 ? `${Math.round(m3 * 1000)} ${E.balance.litre}` : m3 < 10 ? `${n1(m3)} m³` : m3 < 1e6 ? `${Math.round(m3)} m³` : `${fill(E.balance.million, { n: n1(m3 / 1e6) })} m³`
  const fmtLitres = l => (l < 1 ? `${num(l, 2, lang)} ${E.balance.litre}` : l < 1e6 ? `${Math.round(l)} ${E.balance.litre}` : `${fill(E.balance.million, { n: n1(l / 1e6) })} ${E.balance.litre}`)
  const weights = () => {
    const kg = litres()
    const mol = (kg * 1000) / 18.015
    return { kg, o: kg * M_O, h: kg * M_H, o2: (mol / 2) * MOLAR_VOL, h2: mol * MOLAR_VOL }
  }
  const balanceHint = () => {
    const H = E.balance.hints
    if (busy1()) return H.watch
    if (!B.split) return H.bath
    if (Vt.on) return H.running
    if (Vt.f >= 0.99) return H.empty
    if (Vt.n === 0) return H.volt
    return H.back
  }
  const balancePanel = l => {
    const w = weights()
    const sci = l === 'scientist'
    return {
      title: E.balance.title,
      color: BAL_C,
      blocks: [
        {
          slider: {
            label: E.balance.amount,
            min: 0,
            max: 3,
            step: 1,
            value: B.amount,
            onInput: v => {
              setAmount(v, false)
              ex.discover('balance')
            },
            format: v => E.balance.amounts[AMOUNTS[clamp(Math.round(v), 0, 3)]],
            live: () => B.amount,
          },
        },
        {
          rows: [
            [E.balance.rows.water, `${fmtLitres(w.kg)} · ${fmtMass(w.kg)}`],
            [E.balance.rows.oxygen, fmtMass(w.o)],
            [E.balance.rows.hydrogen, fmtMass(w.h)],
            ...(sci ? [[E.balance.rows.o2gas, fmtVol(w.o2)], [E.balance.rows.h2gas, fmtVol(w.h2)]] : []),
          ],
        },
        { buttons: [{ label: B.split ? E.balance.verbs.back : E.balance.verbs.split, onClick: () => balanceTap(B.split ? 'balance' : 'bath') }] },
        { buttons: [{ label: Vt.on ? E.balance.verbs.off : E.balance.verbs.on, onClick: () => balanceTap('pile') }, { label: E.balance.verbs.empty, onClick: () => balanceTap('tubes') }] },
        ...paras(E.balance.panel[depth(l)]),
        { h: E.balance.historyTitle },
        ...paras(E.balance.history[depth(l)]),
      ],
    }
  }
  let amountSend = null
  function setAmount(v, now) {
    const a = clamp(Math.round(Number(v) || 0), 0, 3)
    if (a === B.amount) return
    B.amount = a
    B.mine = true
    say(at(E.balance.says.amounts[AMOUNTS[a]], lv()), BAL_C)
    refresh(balancePanel)
    if (now) return share('balance')
    if (!amountSend) {
      amountSend = setTimeout(() => {
        amountSend = null
        share('balance')
      }, 250)
    }
  }
  function balanceTap(thing) {
    const l = lv()
    if (thing === 'bath' || thing === 'balance') {
      if (busy1()) return say(at(W.busy, l))
      if (thing === 'balance' && !B.split) return say(at(E.balance.says.first, l), BAL_C)
      B.split = !B.split
      B.n++
      B.start = clock
      B.live = true
      B.mine = true
      B.said = false
      play(B.split ? 'part' : 'join')
      share('balance')
      if (B.split) findOnce('balance', balancePanel, SPLIT_T)
      else say(at(E.balance.says.back, l), BAL_C)
      refresh(balancePanel)
      return
    }
    if (thing === 'pile') {
      if (Vt.shown > Vt.f + 0.05) return say(at(W.busy, l))
      if (!Vt.on && Vt.f >= 0.99) return say(at(E.balance.says.emptyFirst, l), BAL_C)
      Vt.on = !Vt.on
      Vt.n++
      Vt.mine = true
      Vt.saidFull = false
      play(Vt.on ? 'fizz' : 'tap')
      say(at(Vt.on ? E.balance.says.on : E.balance.says.off, l), BAL_C)
      share('volt')
      findOnce('balance', balancePanel, 3)
      refresh(balancePanel)
      return
    }
    if (thing === 'tubes') {
      if (Vt.f < 0.02) return say(at(Vt.on ? E.balance.says.on : E.balance.hints.volt, l), BAL_C)
      Vt.on = false
      Vt.f = 0
      Vt.n++
      Vt.mine = true
      play('fizz')
      say(at(E.balance.says.empty, l), BAL_C)
      share('volt')
      refresh(balancePanel)
    }
  }
  ex.add({
    id: 'balance',
    x: STAND1.x,
    z: STAND1.z,
    radius: 2.0,
    label: E.balance.label,
    verb: balanceHint,
    manual: true,
    focus: { x: 5.2, y: 1.7, z: -0.8, size: 3.4, width: 5.0 },
    act: () => ctx.showPanel(balancePanel),
  })
  clickable(bath, () => balanceTap(B.split ? 'balance' : 'bath'), { reach: 5 })
  clickable(balance, () => balanceTap('balance'), { reach: 6 })
  clickable(pile, () => balanceTap('pile'), { reach: 5 })
  clickable(knife, () => balanceTap('pile'), { reach: 5 })
  clickable(tubes, () => balanceTap('tubes'), { reach: 5 })

  const tiltNow = () => {
    const a = age1()
    if (!B.live) return B.split ? BAL.max : 0
    if (B.split) return BAL.max * span(3.2, 4.4, a)
    return BAL.max * (1 - span(0, 0.9, a))
  }
  const pA = new THREE.Vector3()
  const tmpV = new THREE.Vector3()
  updates.push(dt => {
    const a = age1()
    const anim = B.live && a < (B.split ? SPLIT_T : BACK_T)
    const tilt = tiltNow()
    beam.rotation.x = -tilt
    pans.forEach((p, k) => p.position.copy(panAt(k, tilt, pA)))
    // the bath's water, the ball, the globes
    let fillK = B.split ? 0 : 1
    let ballOn = false
    let ballY = MERGE.y
    let ballS = 1
    let globesOn = B.split
    let gk = 1 // the globes' colour: 0 water, 1 their own
    let toPan = 1 // 0 at the ball, 1 on the pans
    if (anim && B.split) {
      fillK = 1 - span(0.1, 1.1, a)
      ballOn = a < 1.9
      ballY = lerp(BATH.water, MERGE.y, span(0, 1.2, a))
      ballS = span(0, 0.5, a) * (1 - span(1.5, 1.9, a))
      globesOn = a >= 1.4
      gk = span(1.4, 1.9, a)
      toPan = span(1.9, 3.2, a)
    } else if (anim) {
      globesOn = a < 2.5
      toPan = 1 - span(0.9, 2.2, a)
      gk = 1 - span(2.0, 2.5, a)
      ballOn = a >= 2.3
      ballS = span(2.3, 2.6, a) * (1 - span(3.2, 3.8, a))
      ballY = lerp(MERGE.y, BATH.water, span(2.7, 3.7, a))
      fillK = span(2.9, 3.9, a)
    }
    bathWater.visible = fillK > 0.01
    bathWater.position.y = lerp(0.06, BATH.water, fillK)
    ball.visible = ballOn && ballS > 0.01
    ball.position.set(BATH.x, ballY, BATH.z)
    ball.scale.setScalar(Math.max(0.01, ballS))
    for (const [i, g] of globes.entries()) {
      g.m.visible = globesOn
      if (!globesOn) continue
      const from = tmpV.copy(MERGE).add(g.from)
      const to = panAt(g.pan, tilt, pA).add(g.off)
      g.m.position.copy(from).lerp(to, toPan)
      g.m.position.y += Math.sin(Math.PI * toPan) * 0.45
      g.m.scale.setScalar(lerp(0.55, 1, gk))
      if (i < 2) {
        const mat = gMat[i === 0 ? 'O' : 'H']
        mat.color.copy(WATER_COL).lerp(i === 0 ? RED_COL : WHITE_COL, gk)
      }
    }
    // the plates under the pans: what each holds (shown once it is weighed)
    const w = weights()
    const sci = lv() === 'scientist'
    const platesOn = B.split && (!anim || a > 4.0)
    panPlates.forEach((p, k) => {
      p.group.visible = platesOn
      if (!platesOn) return
      p.group.position.copy(panAt(k, tilt, pA)).add(tmpV.set(-0.15, -0.36, 0))
      p.group.rotation.y = facing({ x: p.group.position.x, z: p.group.position.z }, STAND1)
      const mass = fmtMass(k === 0 ? w.o : w.h)
      p.set({ title: k === 0 ? E.balance.signs.oxygen : E.balance.signs.hydrogen, line: sci ? `${mass} · ${fill(E.balance.signs.gas, { v: fmtVol(k === 0 ? w.o2 : w.h2) })}` : mass })
    })
    amountPlate.set({ title: E.balance.amounts[AMOUNTS[B.amount]], line: `${fmtLitres(w.kg)} · ${fmtMass(w.kg)}` })
    // the Atomling tells whoever split it what happened, once the pans have settled
    if (B.split && !B.said && a > SPLIT_T - 0.4) {
      B.said = true
      if (B.mine) say(at(E.balance.says.split, lv()), BAL_C)
    }
    // steam over the warm water
    for (const s of steam) {
      const u = ((clock * 0.18 + s.userData.seed) % 1 + 1) % 1
      s.position.set(s.userData.x + Math.sin(clock * 0.5 + s.userData.seed) * 0.05, bathWater.position.y + 0.05 + u * 0.9, s.userData.z)
      s.scale.setScalar(0.16 + u * 0.4)
      s.material.opacity = bathWater.visible ? Math.sin(Math.PI * u) * 0.16 * fillK : 0
    }
  })
  // the electrolysis: bubbles, the gas gathering at the tops, the reservoir rising
  updates.push(dt => {
    if (Vt.on) {
      Vt.f = Math.min(1, Vt.f + VR * dt)
      if (Vt.f >= 1) {
        Vt.on = false
        if (!Vt.saidFull) {
          Vt.saidFull = true
          if (Vt.mine) say(at(E.balance.says.full, lv()), BAL_C)
          refresh(balancePanel)
        }
      }
    }
    // the gas escapes in a second or so; while filling, the tubes show what there is
    Vt.shown = Vt.shown > Vt.f ? Math.max(Vt.f, damp(Vt.shown, Vt.f - 0.05, 2.5, dt)) : Vt.f
    const f = Vt.shown
    const lvO = TUBE.y1 - TUBE.gasO * f
    const lvH = TUBE.y1 - TUBE.gasH * f
    tubeWater.O.scale.y = lvO - TUBE.y0
    tubeWater.H.scale.y = lvH - TUBE.y0
    tubeWater.mid.scale.y = 0.52 + 0.1 * f
    knife.rotation.x = Vt.on ? 0 : -0.9
    spark.intensity = Vt.on ? 0.15 + Math.random() * 0.1 : 0
    // hydrogen comes off twice as fast as oxygen
    if (Vt.on && bubbles.length < BUBS) {
      for (const [k, rate] of [['O', 14], ['H', 28]]) {
        if (Math.random() < rate * dt) bubbles.push({ k, x: (k === 'O' ? -1 : 1) * TUBE.dx + (Math.random() - 0.5) * 0.02, y: TUBE.y0 + 0.05 + Math.random() * 0.05, z: (Math.random() - 0.5) * 0.02, v: 0.12 + Math.random() * 0.08, r: 0.003 + Math.random() * 0.003 })
      }
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]
      b.y += b.v * dt
      if (b.y > (b.k === 'O' ? lvO : lvH)) bubbles.splice(i, 1)
    }
    bubMesh.count = bubbles.length
    bubbles.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(b.r)
      dummy.updateMatrix()
      bubMesh.setMatrixAt(i, dummy.matrix)
    })
    bubMesh.instanceMatrix.needsUpdate = true
    const o = `${E.balance.signs.oxygen}\n${Math.round(f * 10)} ${E.balance.ml}`
    const h = `${E.balance.signs.hydrogen}\n${Math.round(f * 20)} ${E.balance.ml}`
    if (voltLabels.O.text !== o) {
      voltLabels.O.text = o
      voltLabels.O.sync()
    }
    if (voltLabels.H.text !== h) {
      voltLabels.H.text = h
      voltLabels.H.sync()
    }
  })

  // ======== 2. the bent molecule: giant molecules, the balloon and the stream, the salt ========
  const molMats = { O: M.O, H: M.H }
  const D_OH = 0.19
  const N_G = light ? 10 : 14
  const SHELLS = 48
  // the garden's own molecules fade back while a grain of salt is taken apart, so the wrapped ions stand out
  const fadeMats = { O: M.O.clone(), H: M.H.clone() }
  for (const m of Object.values(fadeMats)) m.transparent = true
  const mols = moleculeSet(N_G, { rO: 0.17, rH: 0.11, mats: fadeMats, seg: light ? 12 : 18 })
  const shells = moleculeSet(SHELLS, { rO: 0.17, rH: 0.11, mats: molMats, seg: light ? 12 : 18 })
  root.add(...mols.group, ...shells.group)
  // the floor under them glows a little: here everything is drawn about two billion times bigger
  {
    const ringTex = keep(canvasTex(256, 256, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, w * 0.1, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(90,184,255,0.10)')
      grd.addColorStop(0.82, 'rgba(90,184,255,0.22)')
      grd.addColorStop(0.92, 'rgba(160,220,255,0.75)')
      grd.addColorStop(1, 'rgba(90,184,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }))
    const disc = new THREE.Mesh(new THREE.CircleGeometry(GARDEN.r + 0.45, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false }))
    disc.position.set(GARDEN.x, 0.012, GARDEN.z)
    root.add(disc)
    // the sign: a little stand at the edge
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), M.dark)
    const board = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.3, 0.04, 2, 0.01), M.dark)
    const g = new THREE.Group()
    post.position.y = 0.45
    board.position.y = 0.95
    board.rotation.x = -0.3
    const t = label(E.molecule.signs.scale, 0.06, '#cfe9ff', { maxWidth: 0.82 })
    t.position.set(0, 0.957, 0.032)
    t.rotation.x = -0.3
    g.add(post, board, t)
    g.position.set(-3.35, 0, 0.95)
    g.rotation.y = facing({ x: -3.35, z: 0.95 }, STAND2)
    root.add(g)
    solids.push(circle(-3.35, 0.95, 0.15))
  }
  // the garden's molecules: scattered, drifting and tumbling, making way for whoever walks among them
  const rndG = random(271)
  const garden = []
  while (garden.length < N_G) {
    const a = rndG() * TAU
    const r = Math.sqrt(rndG()) * (GARDEN.r - 0.15)
    const p = V3(GARDEN.x + Math.cos(a) * r, GARDEN.y0 + rndG() * (GARDEN.y1 - GARDEN.y0), GARDEN.z + Math.sin(a) * r)
    if (p.distanceTo(CRYSTAL) < 0.75 || p.distanceTo(FEAT) < 0.8) continue
    if (garden.some(m => m.base.distanceTo(p) < 0.62)) continue
    garden.push({ base: p, ph: V3(rndG() * TAU, rndG() * TAU, rndG() * TAU), w: V3(0.2 + rndG() * 0.3, 0.2 + rndG() * 0.3, 0.2 + rndG() * 0.3), push: V3(), q: new THREE.Quaternion() })
  }
  const eul = new THREE.Euler()
  const gp = new THREE.Vector3()

  // the big molecule at the front: its angle, and its charges when tapped
  const feat = new THREE.Group()
  feat.position.copy(FEAT)
  root.add(feat)
  const FS = 1.6
  const featMol = new THREE.Group()
  feat.add(featMol)
  const fO = new THREE.Mesh(new THREE.SphereGeometry(0.17 * FS, 32, 22), M.O)
  featMol.add(fO)
  const fH = [1, -1].map(s => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.11 * FS, 24, 16), M.H)
    m.position.set(s * Math.sin(HALF) * D_OH * FS, -Math.cos(HALF) * D_OH * FS, 0)
    featMol.add(m)
    return m
  })
  {
    // the angle: a dotted arc between the two bonds, as in the picture, and its value
    const arcR = 0.36
    for (let k = 0; k <= 10; k++) {
      const a = -Math.PI / 2 - HALF + (k / 10) * HALF * 2
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
      d.position.set(Math.cos(a) * arcR, Math.sin(a) * arcR, 0.02)
      featMol.add(d)
    }
    const t = label(fill(E.molecule.signs.angle, { a: n1(104.5) }), 0.11, '#ffffff', { anchorY: 'top', outlineWidth: 0.012 })
    t.position.set(0, -0.6, 0.08)
    featMol.add(t)
  }
  // the charges: a minus by the oxygen, a plus by each hydrogen, and the shared electrons' cloud drawn
  // toward the oxygen
  const charges = new THREE.Group()
  featMol.add(charges)
  {
    const minus = label('−', 0.3, '#8fd0ff', { outlineWidth: 0.015 })
    minus.position.set(0, 0.17 * FS + 0.14, 0.12)
    charges.add(minus)
    for (const h of fH) {
      const p = label('+', 0.24, '#ff9a8e', { outlineWidth: 0.015 })
      p.position.copy(h.position).multiplyScalar(1.85)
      p.position.z = 0.12
      charges.add(p)
    }
    const cloud = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#7fc4ff', transparent: true, depthWrite: false, opacity: 0.5, blending: THREE.AdditiveBlending }))
    cloud.scale.setScalar(0.95)
    cloud.position.set(0, 0.05, 0)
    cloud.raycast = () => {}
    charges.add(cloud)
  }
  const featHit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8), M.hit)
  feat.add(featHit)

  // the washstand: a stone bowl, a brass tap over it, the thin stream; the balloon on its string; the salt
  const stand = new THREE.Group()
  stand.position.set(BASIN.x, 0, BASIN.z)
  root.add(stand)
  const STAND_TOP = 0.82
  {
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.8, STAND_TOP, 0.55, 2, 0.03), M.wood)
    cab.position.y = STAND_TOP / 2
    const bowl = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.18, 0.005], [0.25, 0.06], [0.27, 0.12], [0.26, 0.13]].map(([x, y]) => new THREE.Vector2(x, y)), 32), new THREE.MeshStandardMaterial({ color: '#c9c4ba', roughness: 0.5, side: THREE.DoubleSide }))
    bowl.position.y = STAND_TOP
    const bw = new THREE.Mesh(new THREE.CircleGeometry(0.23, 28).rotateX(-Math.PI / 2), M.water)
    bw.position.y = STAND_TOP + 0.08
    // the tap: a post at the back, an arm reaching over the bowl
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.7, 12), M.gold)
    post.position.set(0, STAND_TOP + 0.35, -0.24)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 10).rotateX(Math.PI / 2), M.gold)
    arm.position.set(0, STAND_TOP + 0.68, -0.13)
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.06, 10), M.gold)
    spout.position.set(0, STAND_TOP + 0.65, -0.01)
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 16).rotateX(Math.PI / 2), M.gold)
    wheel.position.set(0, STAND_TOP + 0.74, -0.24)
    stand.add(cab, bowl, bw, post, arm, spout, wheel)
  }
  stand.rotation.y = facing(BASIN, STAND2)
  stand.updateMatrixWorld(true)
  solids.push(box(BASIN.x, BASIN.z, 0.9, 0.9, { rot: stand.rotation.y }))
  const OUT = stand.localToWorld(V3(0, STAND_TOP + 0.62, -0.01))
  const POOL_Y = STAND_TOP + 0.08
  // which way the stream bends: across the view, toward the balloon (the visitor's left)
  const toStream = V3(BASIN.x - STAND2.x, 0, BASIN.z - STAND2.z).normalize()
  // (forward × up points to the visitor's right: the left is its opposite)
  const LEFT = new THREE.Vector3().crossVectors(toStream, YUP).negate()
  const flowTex = keep(canvasTex(64, 16, (g, w, h) => {
    g.fillStyle = '#cfefff'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 10; i++) {
      g.fillStyle = 'rgba(255,255,255,0.8)'
      g.fillRect((i * w) / 10, 0, 2, h)
    }
  }, { repeat: true }))
  flowTex.repeat.set(4, 1)
  const streamMat = new THREE.MeshStandardMaterial({ map: flowTex, color: '#d8f2ff', roughness: 0.05, emissive: '#4c9cc8', emissiveIntensity: 0.45, transparent: true, opacity: 0.88 })
  const streamMesh = new THREE.Mesh(new THREE.BufferGeometry(), streamMat)
  root.add(streamMesh)
  let streamBend = -1
  const setStream = k => {
    const q = Math.round(k * 40) / 40
    if (q === streamBend) return
    streamBend = q
    // bent most below the balloon's height, falling into the bowl beside the straight line
    const p0 = OUT.clone()
    const p1 = OUT.clone().setY(lerp(OUT.y, POOL_Y, 0.35)).addScaledVector(LEFT, 0.012 * q)
    const p2 = OUT.clone().setY(lerp(OUT.y, POOL_Y, 0.7)).addScaledVector(LEFT, 0.06 * q)
    const p3 = OUT.clone().setY(POOL_Y).addScaledVector(LEFT, 0.11 * q)
    streamMesh.geometry.dispose()
    streamMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p0, p1, p2, p3]), 24, 0.012, 6)
  }
  setStream(0)
  disposers.push(() => streamMesh.geometry.dispose())
  // the plus charges the balloon draws into the stream
  const streamPlus = [0.45, 0.62, 0.8].map(u => {
    const t = label('+', 0.06, '#ffb0a8')
    t.userData.u = u
    root.add(t)
    return t
  })
  // the coat stand with the woolly jumper
  const coat = new THREE.Group()
  coat.position.set(WOOL.x, 0, WOOL.z)
  coat.rotation.y = facing(WOOL, STAND2)
  root.add(coat)
  const knit = keep(knitTex('#3f6f9e'))
  knit.repeat.set(3, 3)
  const knitMat = new THREE.MeshStandardMaterial({ map: knit, roughness: 1 })
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.8, 10), M.dark)
    post.position.set(0, 0.9, -0.08)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.04, 20), M.dark)
    foot.position.set(0, 0.02, -0.08)
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 12, Math.PI), M.gold)
    hook.position.set(0, 1.72, -0.04)
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.56, 0.1, 3, 0.04), knitMat)
    body.position.set(0, 1.38, 0.0)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 16).rotateX(Math.PI / 2), knitMat)
    collar.position.set(0, 1.66, 0)
    const sleeves = [-1, 1].map(s => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.42, 4, 10), knitMat)
      m.position.set(s * 0.29, 1.36, 0.0)
      m.rotation.z = s * 0.12
      return m
    })
    const woolT = label(E.molecule.signs.wool, 0.06, '#ffffff')
    woolT.position.set(0, 1.0, 0.07)
    coat.add(post, foot, hook, body, collar, ...sleeves, woolT)
  }
  coat.updateMatrixWorld(true)
  solids.push(circle(WOOL.x, WOOL.z, 0.3))
  const RUB_AT = coat.localToWorld(V3(0, 1.38, 0.2))
  const RUB_X = V3(1, 0, 0).applyQuaternion(coat.quaternion)
  // the balloon: yellow, tied to the stand, its string to the knot
  const balloon = new THREE.Group()
  root.add(balloon)
  const BALLOON_R = 0.15
  const balloonMat = new THREE.MeshStandardMaterial({ color: '#ffcf3a', roughness: 0.25, emissive: '#7a5200', emissiveIntensity: 0.25 })
  {
    const b = new THREE.Mesh(new THREE.SphereGeometry(BALLOON_R, 28, 20).scale(1, 1.18, 1), balloonMat)
    const knot = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.04, 8).rotateX(Math.PI), balloonMat)
    knot.position.y = -BALLOON_R * 1.18 - 0.012
    balloon.add(b)
    balloon.add(knot)
  }
  const balloonMinus = [[-0.06, 0.07], [0.07, 0.03], [-0.02, -0.07], [0.05, -0.1]].map(([x, y]) => {
    const t = label('−', 0.07, '#9fd2ff')
    t.position.set(x, y, BALLOON_R + 0.01)
    balloon.add(t)
    return t
  })
  const KNOT = stand.localToWorld(V3(0.36, STAND_TOP, 0.2))
  const REST = KNOT.clone().add(V3(0, 0.75, 0))
  const NEAR = OUT.clone().setY(lerp(OUT.y, POOL_Y, 0.6)).addScaledVector(LEFT, 0.24)
  const stringGeo = new THREE.BufferGeometry().setFromPoints([KNOT, REST])
  const string = new THREE.Line(stringGeo, new THREE.LineBasicMaterial({ color: '#e8e2d0' }))
  string.raycast = () => {}
  root.add(string)
  // the salt cellar on the stand, and a pinch falling into the bowl
  const cellar = new THREE.Group()
  cellar.position.copy(stand.localToWorld(V3(-0.3, STAND_TOP, 0.12)))
  root.add(cellar)
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.11, 16).translate(0, 0.055, 0), M.glass)
    const saltIn = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 0.07, 16).translate(0, 0.036, 0), new THREE.MeshStandardMaterial({ color: '#f4f2ec', roughness: 1 }))
    const capS = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 8, 0, TAU, 0, Math.PI / 2), M.zinc)
    capS.position.y = 0.11
    const hitS = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 8).translate(0, 0.1, 0), M.hit)
    cellar.add(body, saltIn, capS, hitS)
    const t = label(E.molecule.signs.salt, 0.05, '#ffffff', { anchorY: 'bottom' })
    t.position.set(0, 0.17, 0)
    cellar.add(t)
  }
  const pinch = new THREE.InstancedMesh(new THREE.BoxGeometry(0.008, 0.008, 0.008), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 12)
  pinch.frustumCulled = false
  pinch.visible = false
  pinch.raycast = () => {}
  root.add(pinch)
  const BOWL = stand.localToWorld(V3(0, POOL_Y + 0.02, 0.02))

  // the salt grain, magnified among the molecules: a little cube of ions, then each carried off in its
  // shell of six waters (oxygen inward round Na+, hydrogen inward round Cl-)
  const ions = { Na: ionCloud('Na', 4), Cl: ionCloud('Cl', 4) }
  const ION_S = { Na: 0.4 / ions.Na.size, Cl: 0.72 / ions.Cl.size }
  for (const c of Object.values(ions)) {
    c.mesh.raycast = () => {}
    root.add(c.mesh)
    disposers.push(() => c.dispose())
  }
  const A_CELL = 0.56
  const salt = []
  {
    const rnd = random(77)
    const corners = []
    for (const ix of [-1, 1]) for (const iy of [-1, 1]) for (const iz of [-1, 1]) corners.push([ix, iy, iz])
    // leaving in turn: the top ones first, then round the cube
    const order = [7, 2, 4, 1, 6, 3, 5, 0]
    let na = 0
    let cl = 0
    for (const [n, ci] of order.entries()) {
      const [ix, iy, iz] = corners[ci]
      // rock salt: neighbours along every edge of the cube are of the other kind
      const kind = ((ix + iy + iz + 3) / 2) % 2 === 0 ? 'Na' : 'Cl'
      const off = V3(ix, iy, iz).multiplyScalar(A_CELL / 2)
      // (out to the sides, up and down, and back, but hardly toward the visitor, who stands toward +x)
      const out = V3(ix > 0 ? 0.3 : -1, iy * 0.8, iz * 1.35).normalize().multiplyScalar(1.95).add(V3((rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.3))
      const frame = new THREE.Quaternion()
      // each ion's six waters along the cube's axes: three face away from the grain and come first, three
      // face into it and join once the ion is out
      const dirs = [V3(ix, 0, 0), V3(0, iy, 0), V3(0, 0, iz), V3(-ix, 0, 0), V3(0, -iy, 0), V3(0, 0, -iz)].map(d => d.applyQuaternion(frame))
      salt.push({ kind, slot: kind === 'Na' ? na++ : cl++, off, out, t: 2.4 + n * 0.9, dirs, rolls: dirs.map(() => rnd() * TAU), startQ: dirs.map(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6))) })
    }
  }
  const SALT_T = 2.4 + 7 * 0.9 + 3.2
  const SALT_END = SALT_T + 8
  const SHELL_R = { Na: 0.5, Cl: 0.64 }
  const ionPos = (s, a, out = new THREE.Vector3()) => {
    const drop = 1 - span(0, 1.0, a)
    out.copy(CRYSTAL).add(s.off)
    out.y += drop * 1.1
    out.addScaledVector(s.out, span(s.t, s.t + 3.0, a) + span(SALT_T + 5, SALT_END, a) * 0.8)
    if (a > s.t + 3.0) out.y += Math.sin(clock * 0.9 + s.slot * 2 + (s.kind === 'Na' ? 0 : 1)) * 0.04
    return out
  }

  // -- its state, its steps --
  const Mo = { charges: false, balloon: 'rest', bn: 0, bStart: -99, bLive: false, salt: 0, sStart: -99, sLive: false, mine: false, tried: { model: false, balloon: false, salt: false }, saidSalt: true, saidBend: true }
  const RUB_T = 3.6
  const RET_T = 1.2
  const bAge = () => clock - Mo.bStart
  const sAge = () => clock - Mo.sStart
  const balloonBusy = () => Mo.bLive && bAge() < (Mo.balloon === 'stream' ? RUB_T : RET_T)
  const saltBusy = () => Mo.salt > 0 && Mo.sLive && sAge() < SALT_T
  const moleculeHint = () => {
    const H = E.molecule.hints
    if (balloonBusy() || saltBusy()) return H.wait
    if (!Mo.tried.model) return H.model
    if (!Mo.tried.balloon) return H.balloon
    if (!Mo.tried.salt) return H.salt
    return H.any
  }
  const moleculePanel = l => ({
    title: E.molecule.title,
    color: MOL_C,
    blocks: [
      {
        buttons: [
          { label: Mo.charges ? E.molecule.verbs.hide : E.molecule.verbs.charges, onClick: () => moleculeTap('model') },
          { label: Mo.balloon === 'stream' ? E.molecule.verbs.back : E.molecule.verbs.balloon, onClick: () => moleculeTap('balloon') },
          { label: E.molecule.verbs.salt, onClick: () => moleculeTap('salt') },
        ],
      },
      ...paras(E.molecule.panel[depth(l)]),
    ],
  })
  function moleculeTap(thing) {
    const l = lv()
    Mo.mine = true
    if (thing === 'model') {
      Mo.charges = !Mo.charges
      Mo.tried.model = true
      play(Mo.charges ? 'select' : 'tap')
      say(at(Mo.charges ? E.molecule.says.charges : E.molecule.says.hide, l), MOL_C)
      share('molecule')
      findOnce('molecule', moleculePanel, 6)
      refresh(moleculePanel)
      return
    }
    if (thing === 'balloon') {
      if (balloonBusy()) return say(at(W.busy, l))
      Mo.balloon = Mo.balloon === 'rest' ? 'stream' : 'rest'
      Mo.bn++
      Mo.bStart = clock
      Mo.bLive = true
      Mo.tried.balloon = true
      Mo.saidBend = Mo.balloon !== 'stream'
      play('tap')
      say(at(Mo.balloon === 'stream' ? E.molecule.says.rub : E.molecule.says.back, l), MOL_C)
      share('molecule')
      findOnce('molecule', moleculePanel, RUB_T + 4)
      refresh(moleculePanel)
      return
    }
    if (thing === 'salt') {
      if (saltBusy()) return say(at(W.busy, l))
      Mo.salt++
      Mo.sStart = clock
      Mo.sLive = true
      Mo.tried.salt = true
      Mo.saidSalt = false
      play('tap')
      say(at(E.molecule.says.salt, l), MOL_C)
      share('molecule')
      findOnce('molecule', moleculePanel, SALT_T)
    }
  }
  ex.add({
    id: 'molecule',
    x: STAND2.x,
    z: STAND2.z,
    radius: 2.0,
    label: E.molecule.label,
    verb: moleculeHint,
    manual: true,
    focus: { x: -4.7, y: 1.6, z: 0.3, size: 4.0, width: 5.0 },
    act: () => ctx.showPanel(moleculePanel),
  })
  clickable(feat, () => moleculeTap('model'), { reach: 5 })
  clickable(balloon, () => moleculeTap('balloon'), { reach: 5 })
  clickable(cellar, () => moleculeTap('salt'), { reach: 5 })

  const qTmp = new THREE.Quaternion()
  const qTmp2 = new THREE.Quaternion()
  const oPos = new THREE.Vector3()
  const iPos = new THREE.Vector3()
  const featBase = facing({ x: FEAT.x, z: FEAT.z }, STAND2)
  let chargeK = 0
  let bendK = 0
  updates.push(dt => {
    const player = ctx.engine.player?.pos
    // the garden: drifting, tumbling, stepping aside for the walker
    garden.forEach((m, i) => {
      gp.copy(m.base)
      gp.x += Math.sin(clock * m.w.x * 0.6 + m.ph.x) * 0.22
      gp.y += Math.sin(clock * m.w.y * 0.5 + m.ph.y) * 0.16
      gp.z += Math.cos(clock * m.w.z * 0.6 + m.ph.z) * 0.22
      if (player) {
        const dx = gp.x - player.x
        const dz = gp.z - player.z
        const d = Math.hypot(dx, dz)
        const want = d < 0.85 && gp.y < 2.1 ? (0.85 - d) * 1.2 : 0
        m.push.x = damp(m.push.x, d > 1e-3 ? (dx / d) * want : 0, 4, dt)
        m.push.z = damp(m.push.z, d > 1e-3 ? (dz / d) * want : 0, 4, dt)
        gp.add(m.push)
      }
      // and away from the salt and its wrapped ions while they are here
      if (Mo.salt > 0) {
        const d = gp.distanceTo(CRYSTAL)
        if (d < 1.0) gp.addScaledVector(tmpV.copy(gp).sub(CRYSTAL).normalize(), (1.0 - d) * 0.8)
        for (const s of salt) {
          const q = ionPos(s, Mo.sLive ? sAge() : SALT_END, iPos)
          const e = gp.distanceTo(q)
          if (e < 1.05) gp.addScaledVector(tmpV.copy(gp).sub(q).normalize(), (1.05 - e) * 0.9)
        }
      }
      eul.set(clock * m.w.x + m.ph.x, clock * m.w.y + m.ph.y, clock * m.w.z * 0.5 + m.ph.z)
      m.q.setFromEuler(eul)
      const [h1, h2] = hydrogens(gp, m.q, D_OH)
      mols.set(i, gp, h1, h2, 1)
    })
    // the salt and its shells
    const a = sAge()
    const on = Mo.salt > 0
    // (someone else's salt, or salt from before: already wrapped and wandered off)
    const sa = on ? (Mo.sLive ? a : SALT_END) : 0
    // after a while the wrapped ions wander off into the water and the garden comes back
    const gone = span(SALT_T + 5, SALT_END, sa)
    const wrap = on ? span(0.5, 1.5, sa) * (1 - gone) : 0
    for (const c of Object.values(ions)) c.count = on && gone < 1 ? 4 : 0
    salt.forEach((s, n) => {
      const p = ionPos(s, sa, iPos)
      if (on) ions[s.kind].set(s.slot, p, ION_S[s.kind] * lerp(0.3, 1, span(0, 0.6, sa)) * (1 - gone))
      s.dirs.forEach((d, j) => {
        const idx = n * 6 + j
        const outward = j < 3
        const t0 = outward ? s.t - 1.0 : s.t + 0.6
        const k = on ? span(t0, t0 + 1.0, sa) : 0
        if (k <= 0 || gone >= 1) return shells.set(idx, p, p, p, 0)
        const r = lerp(1.6, SHELL_R[s.kind], k)
        oPos.copy(p).addScaledVector(d, r)
        // round Na+ the oxygen faces in (the hydrogens out); round Cl- the hydrogens face in
        pointY(s.kind === 'Na' ? d : tmpV.copy(d).negate(), s.rolls[j], qTmp)
        qTmp2.copy(s.startQ[j]).slerp(qTmp, k)
        const [h1, h2] = hydrogens(oPos, qTmp2, D_OH)
        shells.set(idx, oPos, h1, h2, span(0, 0.25, k) * (1 - gone))
      })
    })
    mols.done()
    shells.done()
    fadeMats.O.opacity = fadeMats.H.opacity = 1 - 0.7 * wrap
    if (on && !Mo.saidSalt && sa > SALT_T) {
      Mo.saidSalt = true
      if (Mo.mine) say(at(E.molecule.says.done, lv()), MOL_C)
    }
    // the pinch falling into the bowl
    pinch.visible = on && Mo.sLive && a < 0.7
    if (pinch.visible) {
      for (let i = 0; i < 12; i++) {
        const t = a - i * 0.02
        dummy.position.copy(cellar.position).lerp(BOWL, clamp(t / 0.6))
        dummy.position.y += Math.sin(Math.PI * clamp(t / 0.6)) * 0.12 + ((i * 0.37) % 1 - 0.5) * 0.02
        dummy.scale.setScalar(t < 0 ? 0.001 : 1)
        dummy.updateMatrix()
        pinch.setMatrixAt(i, dummy.matrix)
      }
      pinch.instanceMatrix.needsUpdate = true
    }
    // the big molecule turns gently, its charges fading in and out
    featMol.rotation.y = featBase + Math.sin(clock * 0.5) * 0.35
    featMol.position.y = Math.sin(clock * 0.8) * 0.04
    chargeK = damp(chargeK, Mo.charges ? 1 : 0, 5, dt)
    charges.visible = chargeK > 0.02
    charges.scale.setScalar(Math.max(0.01, chargeK))
    // the balloon: to the wool, rubbed, held by the stream; or back on its string
    const b = bAge()
    const pos = balloon.position
    let charged = 0
    if (Mo.balloon === 'stream') {
      if (Mo.bLive && b < RUB_T) {
        if (b < 0.9) pos.copy(REST).lerp(RUB_AT, span(0, 0.9, b))
        else if (b < 2.4) pos.copy(RUB_AT).addScaledVector(RUB_X, Math.sin(((b - 0.9) / 1.5) * TAU * 4) * 0.12)
        else pos.copy(RUB_AT).lerp(NEAR, span(2.4, 3.4, b))
        charged = span(1.0, 2.2, b)
        if (b > 0.9 && b < 2.4 && Math.floor((b - 0.9) * 5.3) !== Math.floor((b - 0.9 - dt) * 5.3)) play('tap')
      } else {
        pos.copy(NEAR)
        charged = 1
      }
    } else {
      if (Mo.bLive && b < RET_T) pos.copy(NEAR).lerp(REST, span(0, RET_T, b))
      else pos.copy(REST)
      charged = Mo.bLive && b < RET_T ? 1 - span(0, RET_T, b) : 0
    }
    pos.y += Math.sin(clock * 1.3) * 0.015
    for (const t of balloonMinus) t.visible = charged > 0.5
    balloon.rotation.y = facing(pos, STAND2)
    // the string follows while it is tied; while carried it hangs from the balloon
    const sp = stringGeo.attributes.position
    const tied = pos.distanceTo(REST) < 0.05
    const end = tied ? KNOT : tmpV.copy(pos).add(V3(0, -0.45, 0))
    sp.setXYZ(0, end.x, end.y, end.z)
    sp.setXYZ(1, pos.x, pos.y - BALLOON_R * 1.18 - 0.03, pos.z)
    sp.needsUpdate = true
    // the stream bends toward the charged balloon when it is close
    const near = 1 - clamp((pos.distanceTo(NEAR) - 0.02) / 0.35)
    bendK = damp(bendK, near * charged, 3, dt)
    setStream(bendK)
    flowTex.offset.x -= dt * 2.5
    streamPlus.forEach(t => {
      t.visible = bendK > 0.4
      if (!t.visible) return
      const u = t.userData.u
      t.position.copy(OUT).setY(lerp(OUT.y, POOL_Y, u)).addScaledVector(LEFT, 0.11 * bendK * u * u + 0.035)
      t.lookAt(ctx.camera.position)
    })
    if (Mo.balloon === 'stream' && !Mo.saidBend && bendK > 0.6) {
      Mo.saidBend = true
      if (Mo.mine) say(at(E.molecule.says.bend, lv()), MOL_C)
    }
  })

  // ======== 3. the frozen lake: the air through a winter, the readings, the fish, the ice model ========
  // the thermometer outside: a round dial on a post driven into the lake bed beside the hole in the ice, facing
  // the window; the line with the three thermometers hangs from the post's arm into the hole
  const CHAIN = { x: -0.75, z: Z0 - 0.5 }
  const THERMO = V3(CHAIN.x - 0.42, 2.45, Z0 - 0.55)
  const thermo = new THREE.Group()
  thermo.position.copy(THERMO)
  root.add(thermo)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 2.45 + 0.6, 10), M.dark)
    post.position.set(CHAIN.x - 0.42, (2.45 - 0.6) / 2 + 0.02, Z0 - 0.62)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), M.dark)
    arm.position.set(CHAIN.x - 0.2, WL + 0.75, Z0 - 0.55)
    root.add(post, arm)
  }
  const T_MIN = -30
  const T_MAX = 40
  const angleOf = T => (0.75 - ((T - T_MIN) / (T_MAX - T_MIN)) * 1.5) * Math.PI
  {
    const face = keep(canvasTex(256, 256, (g, w) => {
      const c = w / 2
      g.fillStyle = '#f6f3ea'
      g.beginPath()
      g.arc(c, c, c - 4, 0, TAU)
      g.fill()
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      for (let T = T_MIN; T <= T_MAX; T += 2) {
        const a = angleOf(T)
        const major = T % 10 === 0
        const r0 = c - (major ? 34 : 24)
        g.strokeStyle = T < 0 ? '#2b5d9c' : '#a33b2a'
        g.lineWidth = major ? 4 : 2
        g.beginPath()
        g.moveTo(c + Math.cos(a) * r0, c - Math.sin(a) * r0)
        g.lineTo(c + Math.cos(a) * (c - 14), c - Math.sin(a) * (c - 14))
        g.stroke()
        if (major) {
          g.fillStyle = T < 0 ? '#2b5d9c' : '#a33b2a'
          g.font = '700 26px Outfit, Nunito, sans-serif'
          g.fillText(`${T < 0 ? '−' : ''}${Math.abs(T)}`, c + Math.cos(a) * (c - 60), c - Math.sin(a) * (c - 60))
        }
      }
      g.fillStyle = '#333'
      g.font = '700 30px Outfit, Nunito, sans-serif'
      g.fillText('°C', c, c + 52)
    }))
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.26, 40), new THREE.MeshStandardMaterial({ map: face, roughness: 0.6 }))
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.025, 8, 40), M.gold)
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.04, 32).rotateX(Math.PI / 2), M.dark)
    back.position.z = -0.025
    thermo.add(back, dial, rim)
  }
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.006).translate(0.08, 0, 0), new THREE.MeshStandardMaterial({ color: '#c0302a', roughness: 0.4 }))
  needle.position.z = 0.01
  thermo.add(needle)
  const thermoText = label('', 0.1, '#ffffff', { anchorY: 'top' })
  thermoText.position.set(0, -0.32, 0.02)
  thermo.add(thermoText)
  const thermoHit = new THREE.Mesh(new THREE.CircleGeometry(0.45, 12), M.hit)
  thermoHit.position.z = 0.05
  thermo.add(thermoHit)
  // the line through the hole in the ice, three thermometers on it, their readings inside on the glass
  const SENS_Y = [1.02, 0.66, 0.3]
  const chain = new THREE.Group()
  root.add(chain)
  const floatM = new THREE.Group()
  {
    const line = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, WL + 0.75 - 0.15, 5), new THREE.MeshStandardMaterial({ color: '#d8d0b8', roughness: 0.8 }))
    line.position.set(CHAIN.x, (WL + 0.75 + 0.15) / 2, CHAIN.z)
    chain.add(line)
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 8, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d8342a', roughness: 0.4 }))
    const bot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 8, 0, TAU, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#f4f4f0', roughness: 0.4 }))
    floatM.add(top, bot)
    floatM.position.set(CHAIN.x, WL, CHAIN.z)
    chain.add(floatM)
  }
  const sensors = SENS_Y.map(y => {
    const s = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.05, 4, 8), new THREE.MeshStandardMaterial({ color: '#f2c14e', roughness: 0.4, emissive: '#5a4000', emissiveIntensity: 0.3 }))
    s.position.set(CHAIN.x, y, CHAIN.z)
    chain.add(s)
    const t = label('', 0.075, '#ffffff', { anchorX: 'left' })
    t.position.set(CHAIN.x + 0.12, y, Z0 + 0.07)
    root.add(t)
    return { s, t }
  })
  // how thick the ice is, written on the glass beside its cut
  const iceTag = label('', 0.075, '#e8f6ff', { anchorX: 'left', anchorY: 'middle' })
  iceTag.position.set(0.35, WL, Z0 + 0.07)
  root.add(iceTag)
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#1d3a4d', roughness: 0.1 }))
  root.add(hole)
  // the fish: perch, keeping to where the water suits them
  const perch = keep(perchTex())
  const fishMat = new THREE.MeshStandardMaterial({ map: perch, roughness: 0.5 })
  const finMat = new THREE.MeshStandardMaterial({ color: '#d4552e', roughness: 0.6, side: THREE.DoubleSide })
  const darkFin = new THREE.MeshStandardMaterial({ color: '#2b3324', roughness: 0.6, side: THREE.DoubleSide })
  const rndF = random(303)
  const fishes = Array.from({ length: light ? 3 : 5 }, (_, i) => {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12).scale(0.15, 0.055, 0.035), fishMat)
    const tail = new THREE.Group()
    tail.position.x = -0.14
    const tf = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-0.09, 0.05), new THREE.Vector2(-0.07, 0), new THREE.Vector2(-0.09, -0.05)])), finMat)
    tail.add(tf)
    const dorsal = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-0.06, 0.04), new THREE.Vector2(0.02, 0.1), new THREE.Vector2(0.06, 0.045)])), darkFin)
    const belly = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0.0, -0.04), new THREE.Vector2(0.04, -0.08), new THREE.Vector2(0.06, -0.04)])), finMat)
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), new THREE.MeshBasicMaterial({ color: '#111111' }))
    eye.position.set(0.11, 0.012, 0.03)
    const eye2 = eye.clone()
    eye2.position.z = -0.03
    g.add(body, tail, dorsal, belly, eye, eye2)
    g.scale.setScalar(1.3)
    root.add(g)
    return { g, tail, cx: -2.6 + i * 1.3 + rndF() * 0.4, z: Z0 - 0.7 - rndF() * 1.6, amp: 0.8 + rndF() * 0.8, w: 0.18 + rndF() * 0.12, ph: rndF() * TAU, y: 0.5, yo: rndF() }
  })
  // arrows in the water: the cooled surface water sinking (only while the lake is above 4 °C)
  const arrowMat = new THREE.MeshBasicMaterial({ color: '#d4f0ff', transparent: true, opacity: 0.0, depthWrite: false })
  const arrows = Array.from({ length: light ? 4 : 7 }, (_, i) => {
    const g = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6).translate(0, 0.08, 0), arrowMat)
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 10).rotateX(Math.PI), arrowMat)
    g.add(shaft, head)
    g.userData = { x: -3.2 + i * (6.4 / 6), ph: i * 0.37 }
    g.position.z = Z0 - 0.35
    root.add(g)
    return g
  })
  // the model by the window: a drop of water magnified, which can be frozen into ice
  const plinth = new THREE.Group()
  plinth.position.set(MODEL.x, 0, MODEL.z)
  root.add(plinth)
  {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.7, 28), M.wood)
    p.position.y = 0.35
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 28), M.dark)
    top.position.y = 0.72
    plinth.add(p, top)
    const t = label(E.ice.signs.model, 0.065, '#e6f6ff', { maxWidth: 0.9 })
    t.position.set(0, 0.5, 0.0)
    const front = new THREE.Group()
    front.add(t)
    t.position.z = 0.49
    front.rotation.y = facing(MODEL, STAND3)
    plinth.add(front)
  }
  solids.push(circle(MODEL.x, MODEL.z, 0.55))
  const iceModel = new THREE.Group()
  iceModel.position.set(MODEL.x, 0.82, MODEL.z)
  iceModel.rotation.y = facing(MODEL, STAND3)
  root.add(iceModel)
  const ICE_S = 0.088 // metres per ångström
  const lat = iceLattice()
  const latLo = new THREE.Vector3(Infinity, Infinity, Infinity)
  const latHi = new THREE.Vector3(-Infinity, -Infinity, -Infinity)
  for (const a of lat) {
    a.p.multiplyScalar(ICE_S)
    latLo.min(a.p)
    latHi.max(a.p)
  }
  const MARGIN = 0.12
  const BOX = { w: latHi.x - latLo.x + 2 * MARGIN, h: latHi.y - latLo.y + 2 * MARGIN, d: latHi.z - latLo.z + 2 * MARGIN }
  // the lattice sits on the plinth (its lowest atoms a margin above), centred across and in depth
  const latShift = V3(-(latLo.x + latHi.x) / 2, -latLo.y + MARGIN, -(latLo.z + latHi.z) / 2)
  const iceO = lat.map(a => a.p.clone().add(latShift))
  const iceH = lat.map(a => a.h.map(h => a.p.clone().add(latShift).addScaledVector(h.dir, 0.96 * ICE_S)))
  const D_ICE = 0.96 * ICE_S
  // the same molecules as water: crowded at random into a box 0.917 as tall (the same mass, 9% less room)
  const WATER_H = BOX.h * (0.9167 / 0.9998)
  const rndW = random(919)
  const jumble = []
  while (jumble.length < lat.length) {
    const p = V3((rndW() - 0.5) * (BOX.w - 2 * MARGIN), MARGIN * 0.7 + rndW() * (WATER_H - 1.4 * MARGIN), (rndW() - 0.5) * (BOX.d - 2 * MARGIN))
    if (jumble.length < 400 && jumble.some(j => j.p.distanceTo(p) < 0.24) && rndW() < 0.97) continue
    jumble.push({ p, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rndW() * 6, rndW() * 6, rndW() * 6)), ph: rndW() * TAU })
  }
  const iceMols = moleculeSet(lat.length, { rO: 0.066, rH: 0.04, mats: molMats, seg: 14 })
  iceModel.add(...iceMols.group)
  // the hydrogen bonds: a thin stick from each hydrogen to the oxygen it points at
  const hb = []
  lat.forEach((a, i) => a.h.forEach((h, k) => h.to >= 0 && hb.push({ from: iceH[i][k], to: iceO[h.to] })))
  const hbMat = new THREE.MeshBasicMaterial({ color: '#bfe8ff', transparent: true, opacity: 0, depthWrite: false })
  const hbMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.009, 0.009, 1, 5), hbMat, hb.length)
  hbMesh.raycast = () => {}
  hb.forEach((b, i) => {
    const mid = b.from.clone().add(b.to).multiplyScalar(0.5)
    const dir = b.to.clone().sub(b.from)
    dummy.position.copy(mid)
    dummy.quaternion.setFromUnitVectors(YUP, dir.clone().normalize())
    dummy.scale.set(1, dir.length() * 0.8, 1)
    dummy.updateMatrix()
    hbMesh.setMatrixAt(i, dummy.matrix)
  })
  iceModel.add(hbMesh)
  // the box round it: as tall as the ice, or as the water
  const boxLines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(BOX.w, 1, BOX.d).translate(0, 0.5, 0)), new THREE.LineBasicMaterial({ color: '#9fdcff', transparent: true, opacity: 0.55 }))
  boxLines.raycast = () => {}
  iceModel.add(boxLines)
  const moreT = label(E.ice.signs.more, 0.07, '#bfe8ff', { anchorX: 'center', anchorY: 'bottom' })
  moreT.position.set(0, BOX.h + 0.05, BOX.d / 2)
  iceModel.add(moreT)
  const modelHit = new THREE.Mesh(new THREE.BoxGeometry(BOX.w + 0.2, BOX.h + 0.95, BOX.d + 0.3).translate(0, (BOX.h + 0.95) / 2 - 0.82, 0), M.hit)
  iceModel.add(modelHit)
  // the order the molecules lock in: from the bottom up, as ice grows from a cold side
  const rank = iceO.map((p, i) => ({ i, y: p.y + p.x * 0.15 })).sort((a, b) => a.y - b.y).map((r, n) => [r.i, n / (iceO.length - 1)])
  const rankOf = new Array(iceO.length)
  for (const [i, k] of rank) rankOf[i] = k
  // a snowflake growing on the glass, while the model is ice
  const flake = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: keep(snowflakeTex()), transparent: true, opacity: 0, depthWrite: false }))
  flake.position.set(-3.0, 3.0, Z0 - 0.035)
  flake.raycast = () => {}
  root.add(flake)

  // -- its state, its steps --
  const SEASON = [12, 6, 2, -2, -8, -15]
  const Lk = { air: -8, shown: -8, ice: 0, model: 'water', mStart: -99, mLive: false, n: 0, mine: false, phase: null, tried: { thermo: false, model: false } }
  const MODEL_T = 3.4
  const mAge = () => clock - Lk.mStart
  const modelBusy = () => Lk.mLive && mAge() < MODEL_T
  const phaseOf = A => (A >= 8 ? 'warm' : A >= 4 ? 'four' : A >= 0 ? 'cold' : A > -8 ? 'ice' : 'deep')
  const iceFor = A => (A < 0 ? 0.06 + clamp(-A / 20) * 0.44 : 0)
  const tempsOf = A => (A >= 4 ? [A, A, A] : A >= 0 ? [A, (A + 4) / 2, 4] : [0, 2, 4])
  const tempColor = T => (T <= 4 ? tmpC.set('#8cc4da').lerp(new THREE.Color('#3f7f9e'), clamp(T / 4)) : tmpC.set('#3f7f9e').lerp(new THREE.Color('#3e8a7e'), clamp((T - 4) / 8)))
  const fmtT = T => `${T < -0.05 ? '−' : ''}${num(Math.abs(T), 0, lang)} °C`
  const iceHint = () => {
    const H = E.ice.hints
    if (modelBusy()) return H.any
    if (!Lk.tried.thermo) return H.thermo
    if (!Lk.tried.model) return Lk.model === 'ice' ? H.melt : H.freeze
    return H.any
  }
  const icePanel = l => {
    const [top, , bot] = tempsOf(Lk.air)
    const th = iceFor(Lk.air)
    return {
      title: E.ice.title,
      color: ICE_C,
      blocks: [
        {
          slider: {
            label: E.ice.air,
            min: -20,
            max: 16,
            step: 1,
            value: Lk.air,
            onInput: v => {
              setAir(v, false)
              ex.discover('ice')
            },
            format: v => fmtT(Math.round(v)),
            live: () => Lk.air,
          },
        },
        { buttons: [{ label: E.ice.verbs.later, onClick: () => iceTap('thermo') }, { label: Lk.model === 'ice' ? E.ice.verbs.melt : E.ice.verbs.freeze, onClick: () => iceTap('model') }] },
        {
          rows: [
            [E.ice.rows.air, fmtT(Lk.air)],
            [E.ice.rows.ice, th > 0 ? `${Math.round(th * 100)} cm` : E.ice.rows.none],
            [E.ice.rows.top, fmtT(top)],
            [E.ice.rows.bottom, fmtT(bot)],
          ],
        },
        ...paras(E.ice.panel[depth(l)]),
      ],
    }
  }
  let airSend = null
  function setAir(v, now) {
    const A = clamp(Math.round(Number(v)), -20, 16)
    if (!Number.isFinite(A) || A === Lk.air) return
    Lk.air = A
    Lk.mine = true
    refresh(icePanel)
    if (now) return share('lake')
    if (!airSend) {
      airSend = setTimeout(() => {
        airSend = null
        share('lake')
      }, 250)
    }
  }
  function iceTap(thing) {
    const l = lv()
    if (thing === 'thermo') {
      const next = SEASON.find(T => T < Lk.air - 0.5)
      Lk.tried.thermo = true
      const A = next ?? SEASON[0]
      setAir(A, true)
      // the thermometer always tells the weeks it brings (the slider tells only a change of phase)
      Lk.phase = phaseOf(A)
      say(at(next === undefined ? E.ice.says.spring : E.ice.says[Lk.phase], l), ICE_C)
      play('tap')
      findOnce('ice', icePanel, 4)
      return
    }
    if (thing === 'model' || thing === 'ice') {
      if (modelBusy()) return say(at(W.busy, l))
      Lk.model = Lk.model === 'ice' ? 'water' : 'ice'
      Lk.mStart = clock
      Lk.mLive = true
      Lk.n++
      Lk.mine = true
      Lk.tried.model = true
      play(Lk.model === 'ice' ? 'crack' : 'part')
      say(at(Lk.model === 'ice' ? E.ice.says.freeze : E.ice.says.melt, l), ICE_C)
      share('lake')
      findOnce('ice', icePanel, MODEL_T + 3)
      refresh(icePanel)
    }
  }
  ex.add({
    id: 'ice',
    x: STAND3.x,
    z: STAND3.z,
    radius: 2.2,
    label: E.ice.label,
    verb: iceHint,
    manual: true,
    focus: { x: 0.35, y: 1.45, z: -6.4, size: 3.0, width: 5.2 },
    act: () => ctx.showPanel(icePanel),
  })
  clickable(thermo, () => iceTap('thermo'), { reach: 6 })
  clickable(iceModel, () => iceTap('model'), { reach: 5 })
  clickable(lake.slab, () => iceTap('ice'), { reach: 7, accept: h => h.point.z < Z0 - 0.03 })

  const lakeState = { top: new THREE.Color(), deep: new THREE.Color() }
  updates.push(dt => {
    // the lake follows the air, sped up: some weeks in a few seconds
    Lk.shown = damp(Lk.shown, Lk.air, 1.6, dt)
    if (Math.abs(Lk.shown - Lk.air) < 0.05) Lk.shown = Lk.air
    const A = Lk.shown
    Lk.ice = damp(Lk.ice, iceFor(Lk.air), 1.1, dt)
    if (Math.abs(Lk.ice - iceFor(Lk.air)) < 0.002) Lk.ice = iceFor(Lk.air)
    const [tTop, tMid, tBot] = tempsOf(A)
    lakeState.top.copy(tempColor(tTop))
    lakeState.deep.copy(tempColor(tBot)).lerp(tmpC.set('#071c2c'), 0.6)
    lake.set({ ice: Lk.ice, top: lakeState.top, deep: lakeState.deep })
    // the phase this weather brings, told once to whoever changed it
    const ph = phaseOf(Lk.air)
    if (ph !== Lk.phase) {
      const was = Lk.phase
      Lk.phase = ph
      if (was && Lk.mine) say(at(E.ice.says[ph], lv()), ICE_C)
      refresh(icePanel)
    }
    // the thermometer outside and the readings on the line
    needle.rotation.z = angleOf(A)
    const tt = fmtT(Math.round(A))
    if (thermoText.text !== tt) {
      thermoText.text = tt
      thermoText.sync()
    }
    const bottomOfIce = WL - lake.sub * Lk.ice
    const ys = [Math.min(SENS_Y[0], bottomOfIce - 0.08), SENS_Y[1], SENS_Y[2]]
    sensors.forEach(({ s, t }, i) => {
      s.position.y = ys[i]
      t.position.y = ys[i]
      const v = fmtT(Math.round([tTop, tMid, tBot][i]))
      if (t.text !== v) {
        t.text = v
        t.sync()
      }
    })
    floatM.position.y = Lk.ice > 0.01 ? WL + Lk.ice * (1 - lake.sub) + 0.02 : WL + Math.sin(clock * 1.2) * 0.01
    hole.visible = Lk.ice > 0.01
    iceTag.visible = Lk.ice > 0.02
    if (iceTag.visible) {
      iceTag.position.y = WL - lake.sub * Lk.ice * 0.5 + 0.02
      const it = fill(E.ice.signs.ice, { cm: Math.round(Lk.ice * 100) })
      if (iceTag.text !== it) {
        iceTag.text = it
        iceTag.sync()
      }
    }
    hole.position.set(CHAIN.x, WL + Lk.ice * (1 - lake.sub) + 0.004, CHAIN.z)
    // the fish keep to the 4 °C water near the bottom once the top is colder; in warm water they roam
    const low = A < 4 ? 1 : 1 - clamp((A - 4) / 4)
    fishes.forEach(f => {
      const yT = lerp(0.45 + f.yo * 0.65, 0.22 + f.yo * 0.28, low)
      f.y = damp(f.y, Math.min(yT, bottomOfIce - 0.2), 0.8, dt)
      const sp = low > 0.5 ? 0.55 : 1
      const ph = clock * f.w * sp + f.ph
      const x = f.cx + Math.sin(ph) * f.amp
      const vx = Math.cos(ph)
      f.g.position.set(x, f.y + Math.sin(clock * 0.7 + f.ph) * 0.02, f.z)
      f.g.rotation.y = vx >= 0 ? 0 : Math.PI
      f.tail.rotation.y = Math.sin(clock * (low > 0.5 ? 5 : 8) + f.ph) * 0.35
    })
    // the cooled surface water sinking, while the lake is above 4 °C
    const sink = A > 4.3 ? clamp((A - 4.3) / 2) : 0
    arrowMat.opacity = damp(arrowMat.opacity, sink * 0.7, 3, dt)
    arrows.forEach(g => {
      g.visible = arrowMat.opacity > 0.02
      const u = (clock * 0.22 + g.userData.ph) % 1
      g.position.set(g.userData.x, lerp(WL - 0.15, 0.35, u), Z0 - 0.35)
    })
    // the model: water's jumble, or ice's lattice; the box as tall as each
    const a = mAge()
    const toIce = Lk.model === 'ice'
    const run = Lk.mLive && a < MODEL_T
    let iceK = 0
    lat.forEach((_, i) => {
      const r = rankOf[i]
      // locking in from the bottom when freezing, coming loose from the top when melting
      const k = run ? (toIce ? span(0.2 + r * 1.6, 1.0 + r * 1.6, a) : 1 - span(0.2 + (1 - r) * 1.6, 1.0 + (1 - r) * 1.6, a)) : toIce ? 1 : 0
      iceK += k / lat.length
      const j = jumble[i]
      // the water's molecules jiggle and turn
      oPos.copy(j.p)
      oPos.x += Math.sin(clock * 2.1 + j.ph) * 0.02
      oPos.y += Math.sin(clock * 1.7 + j.ph * 2) * 0.02
      eul.set(clock * 0.6 + j.ph, clock * 0.5 + j.ph * 1.3, 0)
      qTmp.copy(j.q).multiply(qTmp2.setFromEuler(eul))
      const [wh1, wh2] = hydrogens(oPos, qTmp, D_ICE)
      const p = oPos.lerp(iceO[i], k)
      const h1 = wh1.lerp(iceH[i][0], k)
      const h2 = wh2.lerp(iceH[i][1], k)
      iceMols.set(i, p, h1, h2, 1)
    })
    iceMols.done()
    hbMat.opacity = span(0.75, 1, iceK) * 0.75
    hbMesh.visible = hbMat.opacity > 0.02
    boxLines.scale.y = lerp(WATER_H, BOX.h, iceK)
    moreT.visible = iceK > 0.95
    flake.material.opacity = iceK * 0.9
    flake.scale.setScalar(lerp(0.4, 1, iceK))
    flake.rotation.z = clock * 0.03
  })

  // ======== the rest of the hall: towels on the south wall, a bucket and ladle by the benches ========
  {
    const towelColors = ['#d9614c', '#efe6d2', '#4f86b5']
    towelColors.forEach((c, i) => {
      const t = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.72, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: c, roughness: 1 }))
      stage.onWall(t, 's', -1.4 + i * 0.6 + 4.6, 1.3, 0.05)
      const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8).rotateX(Math.PI / 2), M.dark)
      stage.onWall(peg, 's', -1.4 + i * 0.6 + 4.6, 1.7, 0.06)
    })
    const pail = new THREE.Group()
    const side = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.26, 20, 1, true).translate(0, 0.13, 0), staveMat)
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.012, 6, 24).rotateX(Math.PI / 2), M.iron)
    hoop.position.y = 0.2
    pail.add(side, hoop)
    pail.position.set(-4.6, 0.47, 6.45)
    root.add(pail)
  }

  updates.push((dt, t) => stage.update(t))

  const balanceState = () => ({ split: B.split, amount: B.amount, n: B.n, age: Math.min(30, Math.round(age1() * 10) / 10) })
  const voltState = () => ({ on: Vt.on, f: Math.round(Vt.f * 100) / 100, n: Vt.n })
  const moleculeState = () => ({ charges: Mo.charges, balloon: Mo.balloon, bn: Mo.bn, bAge: Math.min(30, Math.round(bAge() * 10) / 10), salt: Mo.salt, sAge: Math.min(30, Math.round(sAge() * 10) / 10) })
  const lakeShared = () => ({ air: Lk.air, model: Lk.model, n: Lk.n, age: Math.min(30, Math.round(mAge() * 10) / 10) })
  const ageIn = (s, k, ago) => clamp((Number(s?.[k]) || 0) + (Number(ago) || 0), 0, 30)

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.85 },
    spawn: { x: 0, z: 3.4, yaw: 0 },
    hostSpot: { x: 2.2, z: 2.6, yaw: Math.atan2(2.2, -1.2) },
    back: { x: 0, z: 6.4, rot: Math.PI },
    stand: { x: -2.4, z: 3.2, rot: Math.atan2(2.4, 1.4) },
    parts: {
      balance: {
        tap: thing => balanceTap(thing), // 'bath', 'balance', 'pile', 'tubes'
        amount: v => setAmount(v, true), // the panel's slider: 0 a glass, 1 a bucket, 2 the bath, 3 a pool
        get state() { return { ...balanceState(), volt: voltState(), busy: busy1() } },
        at: thing => ({ bath: () => V3(BATH.x, 0.5, BATH.z), balance: () => V3(BAL.x, 2.2, BAL.z), pile: () => pile.localToWorld(V3(0, 0.25, 0)), tubes: () => tubes.localToWorld(V3(0, 0.45, 0)) })[thing](),
      },
      molecule: {
        tap: thing => moleculeTap(thing), // 'model', 'balloon', 'salt'
        get state() { return { ...moleculeState(), busy: balloonBusy() || saltBusy() } },
        at: thing => ({ model: () => FEAT.clone(), balloon: () => balloon.position.clone(), salt: () => cellar.localToWorld(V3(0, 0.06, 0)) })[thing](),
      },
      ice: {
        tap: thing => iceTap(thing), // 'thermo', 'model', 'ice'
        air: v => setAir(v, true), // the panel's slider, −20 to 16 °C
        get state() { return { ...lakeShared(), shown: Lk.shown, ice: Lk.ice, busy: modelBusy() } },
        at: thing => ({ thermo: () => THERMO.clone(), model: () => iceModel.localToWorld(V3(0, 0.6, 0)), ice: () => V3(0.6, WL, Z0 - 2.5) })[thing](),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { balance: balancePanel, molecule: moleculePanel, ice: icePanel },
    shared: {
      balance: {
        get: balanceState,
        set: (s, live, ago = 0) => {
          const split = !!s?.split
          // a split or a putting back someone just made plays here; one made before shows as it stands
          if (split !== B.split) B.live = !!live
          else if (!live) B.live = false
          B.split = split
          B.start = clock - ageIn(s, 'age', ago)
          B.amount = clamp(Math.round(Number(s?.amount ?? 2)), 0, 3)
          B.n = Math.max(0, Math.round(Number(s?.n) || 0))
          B.mine = false
          B.said = true
          refresh(balancePanel)
        },
      },
      volt: {
        get: voltState,
        set: (s, live, ago = 0) => {
          const on = !!s?.on
          const f = clamp(Number(s?.f) || 0)
          Vt.on = on
          Vt.f = on ? Math.min(1, f + VR * clamp(Number(ago) || 0, 0, 60)) : f
          if (Vt.f >= 1) Vt.on = false
          Vt.n = Math.max(0, Math.round(Number(s?.n) || 0))
          Vt.mine = false
          Vt.saidFull = true
          // emptied by someone just now: the gas escapes here too; otherwise as it stands
          if (!live || Vt.f > Vt.shown) Vt.shown = Vt.f
          refresh(balancePanel)
        },
      },
      molecule: {
        get: moleculeState,
        set: (s, live, ago = 0) => {
          Mo.charges = !!s?.charges
          const balloonNow = s?.balloon === 'stream' ? 'stream' : 'rest'
          if (balloonNow !== Mo.balloon) Mo.bLive = !!live
          else if (!live) Mo.bLive = false
          Mo.balloon = balloonNow
          Mo.bn = Math.max(0, Math.round(Number(s?.bn) || 0))
          Mo.bStart = clock - ageIn(s, 'bAge', ago)
          const saltN = Math.max(0, Math.round(Number(s?.salt) || 0))
          if (saltN !== Mo.salt) Mo.sLive = !!live
          else if (!live) Mo.sLive = false
          Mo.salt = saltN
          Mo.sStart = clock - ageIn(s, 'sAge', ago)
          Mo.mine = false
          Mo.saidSalt = true
          Mo.saidBend = true
          refresh(moleculePanel)
        },
      },
      lake: {
        get: lakeShared,
        set: (s, live, ago = 0) => {
          const A = clamp(Math.round(Number(s?.air ?? -8)), -20, 16)
          Lk.air = Number.isFinite(A) ? A : -8
          if (!live) {
            Lk.shown = Lk.air
            Lk.ice = iceFor(Lk.air)
          }
          const model = s?.model === 'ice' ? 'ice' : 'water'
          if (model !== Lk.model) Lk.mLive = !!live
          else if (!live) Lk.mLive = false
          Lk.model = model
          Lk.n = Math.max(0, Math.round(Number(s?.n) || 0))
          Lk.mStart = clock - ageIn(s, 'age', ago)
          Lk.mine = false
          refresh(icePanel)
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (amountSend) clearTimeout(amountSend)
      if (airSend) clearTimeout(airSend)
      stage.dispose()
      mols.dispose()
      iceMols.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }
}
