// Silicon's picture "Is your cake mould made of silicon?" as a room (docs/knowledge/picture-rooms.md): the
// picture's kitchen made into a place, at night, the tiles mauve, the counters wooden. Three things to do:
// - the bendy muffin tray beside a piece of real silicon: bend each (the tray twists, its muffins pop out
//   and it springs back; the silicon snaps like glass), then the tray goes into the hot oven and the
//   freezer and comes out still bendy;
// - the bouncing putty: throw it (it bounces), pull it slowly (a long string), pull it fast (it snaps clean),
//   leave it (it sags into a puddle, sped up);
// - the picture's magnifier come to life: a giant silicone chain, -Si-O-Si-O- with two methyl groups on each
//   silicon, that wiggles more the warmer it is, freezes stiff below its glass transition (about -125 °C)
//   and still holds together at 250 °C.
// All three are shared in a room (src/net/shared.js): the tray and the putty as the last thing done, its
// count and how long ago (what unfolds runs on by `ago`); the chain as its temperature.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { kitchenStage, TOP } from '../../stages/kitchen.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { element } from '../../../../data/elements.js'
import { SILICONE_WORDS } from './silicone.words.js'

export const WORDS = SILICONE_WORDS

const TAU = Math.PI * 2
const G = 9.8
const PINK = '#ff6fa8'
const BLUE = '#5aa9ff'
const BEIGE = '#f0c8a0'

// ---- shared bits: a soft dot, a minus sign that is a real one ----

function softDot() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.45, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}
/** A temperature as people write it: a real minus sign, a space before °C. */
const degrees = v => `${v < 0 ? '−' : ''}${Math.abs(Math.round(v))} °C`

// ---- the muffin tray: a strip of three cups that bends, twists and springs back ----

const TRAY = { L: 0.7, W: 0.27, CUPS: [-0.215, 0, 0.215], RT: 0.094, RB: 0.07, DEPTH: 0.085 }

function trayMaterials() {
  // the sheet's three holes, cut out of a white mask (the material's colour shows through)
  const holes = canvasTex(1024, 400, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(150,60,95,0.45)'
    g.lineWidth = 16
    g.strokeRect(8, 8, w - 16, h - 16)
    for (const cx of TRAY.CUPS) {
      const x = (cx / TRAY.L + 0.5) * w
      const r = (TRAY.RT / TRAY.L) * w
      g.strokeStyle = 'rgba(150,60,95,0.4)'
      g.lineWidth = 12
      g.beginPath()
      g.arc(x, h / 2, r + 8, 0, TAU)
      g.stroke()
      g.globalCompositeOperation = 'destination-out'
      g.beginPath()
      g.arc(x, h / 2, r, 0, TAU)
      g.fill()
      g.globalCompositeOperation = 'source-over'
    }
  })
  // a muffin's top: golden brown, chocolate chips, a shine
  const crumb = canvasTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#d9a05a')
    grd.addColorStop(1, '#a9682f')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    const rnd = random(5)
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(120,64,26,${0.15 + rnd() * 0.3})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h, 1 + rnd() * 4, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 14; i++) {
      g.fillStyle = '#3d1f10'
      g.beginPath()
      g.ellipse(rnd() * w, 10 + rnd() * (h - 30), 4 + rnd() * 3, 3 + rnd() * 2, rnd() * 3, 0, TAU)
      g.fill()
    }
  })
  const pink = new THREE.Color('#de4f8b')
  return {
    textures: [holes, crumb],
    pink,
    frosty: new THREE.Color('#f0cfe0'),
    sheet: new THREE.MeshStandardMaterial({ color: pink.clone(), map: holes, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5 }),
    cup: new THREE.MeshStandardMaterial({ color: pink.clone(), side: THREE.DoubleSide, roughness: 0.5 }),
    top: new THREE.MeshStandardMaterial({ map: crumb, roughness: 0.8 }),
    cake: new THREE.MeshStandardMaterial({ color: '#c98b4a', roughness: 0.85 }),
  }
}

/** A fluted cup, open at the top, its rim at y = 0. */
function cupGeometry(rt, rb, depth, flutes = 14) {
  const geo = new THREE.CylinderGeometry(rt, rb, depth, 56, 3, true)
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const z = p.getZ(i)
    const k = 1 + 0.05 * Math.cos(Math.atan2(z, x) * flutes)
    p.setXYZ(i, x * k, p.getY(i) - depth / 2, z * k)
  }
  geo.computeVertexNormals()
  return geo
}

function muffinTray(M) {
  const { L, W, CUPS, RT, RB, DEPTH } = TRAY
  const group = new THREE.Group() // its origin: the middle of the sheet
  const NX = 56
  const NZ = 6
  const nv = (NX + 1) * (NZ + 1)
  const pos = new Float32Array(nv * 3)
  const uv = new Float32Array(nv * 2)
  const bx = new Float32Array(nv)
  const bz = new Float32Array(nv)
  for (let j = 0; j <= NZ; j++) {
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i
      bx[k] = -L / 2 + (L * i) / NX
      bz[k] = -W / 2 + (W * j) / NZ
      uv[k * 2] = i / NX
      uv[k * 2 + 1] = j / NZ
    }
  }
  const idx = []
  for (let j = 0; j < NZ; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i
      const c = a + NX + 1
      idx.push(a, c, a + 1, a + 1, c, c + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setIndex(idx)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  const sheet = new THREE.Mesh(geo, M.sheet)
  sheet.frustumCulled = false
  group.add(sheet)

  const cupGeo = cupGeometry(RT, RB, DEPTH)
  const bottomGeo = new THREE.CircleGeometry(RB * 1.02, 32).rotateX(-Math.PI / 2).translate(0, -DEPTH, 0)
  const domeGeo = new THREE.SphereGeometry(RT * 1.14, 28, 12, 0, TAU, 0, Math.PI / 2).scale(1, 0.72, 1)
  const cakeGeo = cupGeometry(RT * 0.95, RB * 0.95, DEPTH * 0.97)
  const cups = CUPS.map(x => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(cupGeo, M.cup), new THREE.Mesh(bottomGeo, M.cup))
    group.add(g)
    return { x, g }
  })
  const muffins = CUPS.map((_, i) => {
    const g = new THREE.Group()
    const dome = new THREE.Mesh(domeGeo, M.top)
    dome.rotation.y = i * 2.1
    g.add(dome, new THREE.Mesh(cakeGeo, M.cake))
    group.add(g)
    return g
  })

  // the frame of the bent strip at x: the point, its tangent T, its up N and its side B
  const P = new THREE.Vector3()
  const T = new THREE.Vector3()
  const N = new THREE.Vector3()
  const B = new THREE.Vector3()
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const spinQ = new THREE.Quaternion()
  const Z = new THREE.Vector3(0, 0, 1)
  const upright = new THREE.Quaternion()
  const frameAt = (x, kappa, tau) => {
    const a = kappa * x
    if (Math.abs(kappa) < 1e-4) P.set(x, (kappa * x * x) / 2, 0)
    else P.set(Math.sin(a) / kappa, (1 - Math.cos(a)) / kappa, 0)
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    const ph = tau * x
    const cp = Math.cos(ph)
    const sp = Math.sin(ph)
    T.set(ca, sa, 0)
    N.set(-sa * cp, ca * cp, sp)
    B.set(sa * sp, -ca * sp, cp)
  }
  /** Bend by kappa (1/m: the ends rise), twist by tau (rad/m); muffins hopped up by hops[i] metres. */
  function pose(kappa = 0, tau = 0, hops = [0, 0, 0], spin = 0) {
    for (let k = 0; k < nv; k++) {
      frameAt(bx[k], kappa, tau)
      pos[k * 3] = P.x + B.x * bz[k]
      pos[k * 3 + 1] = P.y + B.y * bz[k]
      pos[k * 3 + 2] = P.z + B.z * bz[k]
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    cups.forEach((c, i) => {
      frameAt(c.x, kappa, tau)
      m.makeBasis(T, N, B)
      q.setFromRotationMatrix(m)
      c.g.position.copy(P)
      c.g.quaternion.copy(q)
      const h = hops[i]
      const mf = muffins[i]
      mf.position.set(P.x, P.y + h, P.z)
      // in the air a muffin turns upright and tumbles a little
      const up = clamp(h / 0.08)
      mf.quaternion.copy(q).slerp(upright, up)
      spinQ.setFromAxisAngle(Z, spin * (i - 1) * up)
      mf.quaternion.premultiply(spinQ)
    })
  }
  pose()
  return { group, pose, dispose: () => geo.dispose() }
}

// ---- a piece of real silicon: a polished bar cut from a crystal; it snaps, it never bends ----

function siliconBar(M) {
  const L = 0.5
  const H = 0.06
  const D = 0.17
  const group = new THREE.Group() // its origin: the middle of its bottom, on the worktop
  const whole = new THREE.Mesh(new RoundedBoxGeometry(L, H, D, 2, 0.006), M.silicon)
  whole.position.y = H / 2
  group.add(whole)
  const halfGeo = new THREE.BoxGeometry(L / 2, H, D)
  const halves = [-1, 1].map(s => {
    const pivot = new THREE.Group()
    const m = new THREE.Mesh(halfGeo, M.silicon)
    m.position.set((s * L) / 4, H / 2, 0)
    pivot.add(m)
    pivot.visible = false
    group.add(pivot)
    return pivot
  })
  const shardGeo = new THREE.TetrahedronGeometry(0.018)
  const shards = Array.from({ length: 8 }, () => {
    const s = new THREE.Mesh(shardGeo, M.silicon)
    s.visible = false
    group.add(s)
    return s
  })
  /** The snap at `a` seconds (seeded by n, so every player sees the same pieces fly). */
  function pose(a, n) {
    const rest = a < 0 || a >= SNAP_T
    whole.visible = rest || a < 0.75 || a > 2.75
    whole.scale.setScalar(rest || a < 0.75 ? 1 : Math.max(0.001, ease((a - 2.75) / 0.6)))
    // straining: held up and trembling, not bending at all
    const strain = !rest && a < 0.75
    whole.position.set(0, H / 2 + (strain ? 0.035 * ease(a / 0.25) : 0), 0)
    whole.rotation.z = strain ? Math.sin(a * 70) * 0.006 * ease(a / 0.5) : 0
    const broken = !rest && a >= 0.75 && a < 2.9
    const u = a - 0.75
    const fade = broken ? 1 - ease((a - 2.3) / 0.5) : 0
    halves.forEach((p, i) => {
      const s = i === 0 ? -1 : 1
      p.visible = broken && fade > 0.01
      if (!p.visible) return
      // split, fly apart a little, drop back onto the worktop and settle tilted
      const y = Math.max(0, 0.035 + 0.55 * u - 0.5 * G * u * u)
      p.position.set(s * (0.012 + 0.05 * ease(u / 0.25)), y, 0)
      p.rotation.set(0, 0, s * (0.32 * ease(u / 0.12) * (1 - ease((u - 0.15) / 0.3)) + 0.06 * ease(u / 0.4)))
      p.scale.setScalar(Math.max(0.001, fade))
    })
    const rnd = random(1000 + n * 7)
    shards.forEach(sh => {
      const vx = (rnd() - 0.5) * 1.2
      const vy = 0.9 + rnd() * 0.8
      const vz = (rnd() - 0.5) * 0.7
      const spin = (rnd() - 0.5) * 30
      sh.visible = broken && fade > 0.01
      if (!sh.visible) return
      const tl = (2 * vy) / G // when it lands
      const tt = Math.min(u, tl)
      sh.position.set(vx * tt, Math.max(0.01, H + vy * tt - 0.5 * G * tt * tt), vz * tt)
      sh.rotation.set(spin * tt, spin * 0.7 * tt, 0)
      sh.scale.setScalar(Math.max(0.001, fade))
    })
  }
  return { group, pose, L }
}
const SNAP_T = 3.4

/** A little sign on the tiles with a word on it (facing +z), its edge in the word's colour. */
function wallSign(word, color, M) {
  const g = new THREE.Group()
  const edge = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.15, 0.012, 2, 0.02), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
  const board = new THREE.Mesh(new RoundedBoxGeometry(0.43, 0.12, 0.02, 2, 0.016), M.card)
  board.position.z = 0.004
  const text = makeText(word, { size: 0.07, color, anchorX: 'center', anchorY: 'middle', maxWidth: 0.4 })
  text.position.z = 0.016
  g.add(edge, board, text)
  return g
}

// ---- the bouncing putty: one blob whose every vertex is placed each frame ----

const PR = 0.12 // its radius as a ball
const PUTTY_BUSY = { ball: 0, throw: 2.75, slow: 4.0, fast: 1.2, leave: 0 }
const HOPS = [0.8, 0.5, 0.3, 0.16, 0.07]
const HOP_T = HOPS.map(h => 2 * Math.sqrt((2 * h) / G))
const HOP_AT = HOP_T.reduce((acc, t, i) => (acc.push((acc[i - 1] ?? 0) + (i ? HOP_T[i - 1] : 0)), acc), [])

function puttyBlob(M) {
  const group = new THREE.Group() // on the worktop; local x runs along the wall
  const geo = new THREE.SphereGeometry(1, 48, 32) // its poles along y: the axis it stretches along
  const attr = geo.attributes.position
  attr.setUsage(THREE.DynamicDrawUsage)
  const base = attr.array.slice()
  const pos = attr.array
  const target = new Float32Array(pos.length)
  const from = new Float32Array(pos.length)
  const n = attr.count
  const mesh = new THREE.Mesh(geo, M.putty)
  mesh.frustumCulled = false
  group.add(mesh)
  // its shadow on the worktop (it bounces: a shadow tells how high)
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 32).rotateX(-Math.PI / 2), M.shadow)
  shadow.position.y = 0.003
  group.add(shadow)
  // two oven gloves that pull it
  const mitts = [-1, 1].map(s => {
    const g = new THREE.Group()
    const hand = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.1, 6, 14), M.mitt)
    hand.rotation.z = Math.PI / 2
    hand.scale.set(1, 1, 0.75)
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.05, 4, 10), M.mitt)
    thumb.position.set(-s * 0.03, -0.02, 0.06)
    thumb.rotation.set(0.6, 0, s * 0.9)
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 20), M.cuff)
    cuff.rotation.z = Math.PI / 2
    cuff.position.x = s * 0.105
    g.add(hand, thumb, cuff)
    g.visible = false
    group.add(g)
    return g
  })

  const writeEllipsoid = (rx, ry, rz, flat) => {
    for (let i = 0; i < n; i++) {
      const u = base[i * 3]
      const v = base[i * 3 + 1]
      const w = base[i * 3 + 2]
      target[i * 3] = rx * v
      target[i * 3 + 1] = ry * flat + (u > 0 ? ry * u : ry * flat * u)
      target[i * 3 + 2] = rz * w
    }
  }
  // a strand lying on the worktop: end bulbs Rb, a neck rn between, L long
  const writeStrand = (L, Rb, rn, flat) => {
    const half = L / 2
    const capStart = Math.max(0, half - Rb)
    const blend = Math.min(capStart, Rb * 1.5)
    for (let i = 0; i < n; i++) {
      const u = base[i * 3]
      const v = base[i * 3 + 1]
      const w = base[i * 3 + 2]
      const X = v * half
      const ax = Math.abs(X)
      let r
      if (ax >= capStart) r = Math.sqrt(Math.max(0, Rb * Rb - (ax - capStart) ** 2))
      else {
        const k = blend > 0 ? clamp((ax - (capStart - blend)) / blend) : 1
        r = lerp(rn, Rb, k * k * (3 - 2 * k))
      }
      const rho = Math.hypot(u, w)
      const uu = rho > 1e-6 ? u / rho : 0
      const ww = rho > 1e-6 ? w / rho : 0
      target[i * 3] = X
      target[i * 3 + 1] = r * flat + r * uu * (uu > 0 ? 1 : flat)
      target[i * 3 + 2] = r * ww
    }
  }
  // two halves, snapped clean: a flat face each, `gap` from the middle
  const writeHalves = (gap, Rh, Dh, flat) => {
    for (let i = 0; i < n; i++) {
      const u = base[i * 3]
      const v = base[i * 3 + 1]
      const w = base[i * 3 + 2]
      const t = Math.abs(v)
      const sg = Math.sign(v)
      let X
      let r
      if (t < 0.12) {
        // folded onto the axis, out of sight
        X = sg * gap
        r = 0
      } else if (t < 0.25) {
        // the clean, flat face of the break
        X = sg * gap
        r = (Rh * (t - 0.12)) / 0.13
      } else {
        const ph = ((t - 0.25) / 0.75) * (Math.PI / 2)
        X = sg * (gap + Dh * Math.sin(ph))
        r = Rh * Math.cos(ph)
      }
      const rho = Math.hypot(u, w)
      const uu = rho > 1e-6 ? u / rho : 0
      const ww = rho > 1e-6 ? w / rho : 0
      target[i * 3] = X
      target[i * 3 + 1] = Rh * flat + r * uu * (uu > 0 ? 1 : flat)
      target[i * 3 + 2] = r * ww
    }
  }
  const V0 = (4 / 3) * Math.PI * PR ** 3
  /** The shape for `mode` at `a` seconds into it; returns { lift, mitt, mx, impact (hop index landed) }. */
  function shape(mode, a) {
    const out = { lift: 0, mitt: 0, mx: 0, hop: -1 }
    if (mode === 'throw') {
      let i = HOP_AT.findIndex((s, j) => a >= s && a < s + HOP_T[j])
      if (i < 0) {
        writeEllipsoid(PR * 1.02, PR * 0.94, PR * 1.02, 0.75)
        out.hop = HOPS.length
        return out
      }
      const tau = a - HOP_AT[i]
      const v0 = Math.sqrt(2 * G * HOPS[i])
      out.lift = Math.max(0, v0 * tau - 0.5 * G * tau * tau)
      out.hop = i
      // squashed for a moment at each landing
      const d = Math.min(tau, HOP_T[i] - tau)
      const k = d < 0.06 ? (1 - d / 0.06) * (i === 0 && tau < 0.06 ? 0.3 : 1) * (1 - i * 0.15) : 0
      writeEllipsoid(PR * (1.02 + 0.3 * k), PR * (0.94 - 0.38 * k), PR * (1.02 + 0.3 * k), 0.75)
      return out
    }
    if (mode === 'leave') {
      const k = ease(a / 9)
      const s = 1 + 1.35 * k
      writeEllipsoid(PR * 1.02 * s, (PR * 0.94) / (s * s), PR * 1.02 * s, lerp(0.75, 0.35, k))
      return out
    }
    if (mode === 'slow') {
      const k = ease((a - 0.3) / 3.2)
      const L = 2 * PR + k * (1.0 - 2 * PR)
      const Rb = PR * (1 - 0.32 * k)
      const Ln = Math.max(1e-3, L - 2 * Rb)
      const rn = clamp(Math.sqrt(Math.max(0, V0 - (4 / 3) * Math.PI * Rb ** 3) / (Math.PI * Ln)), 0.012, Rb)
      writeStrand(L, Rb, rn, 0.85)
      out.mitt = ease(a / 0.3) * (1 - ease((a - 3.6) / 0.35))
      out.mx = L / 2 + 0.06
      return out
    }
    if (mode === 'fast') {
      if (a < 0.42) {
        const k = ease((a - 0.25) / 0.17)
        writeStrand(2 * PR + k * 1.5 * PR, PR * (1 - 0.12 * k), lerp(PR, 0.42 * PR, k), 0.85)
        out.mx = PR + k * 0.75 * PR + 0.06
      } else {
        const gap = 0.02 + 0.2 * ease((a - 0.42) / 0.25)
        writeHalves(gap, PR * 0.9, PR * 0.92, 0.85)
        out.mx = gap + PR * 0.92 + 0.06
      }
      out.mitt = ease(a / 0.25) * (1 - ease((a - 0.8) / 0.3))
      return out
    }
    writeEllipsoid(PR * 1.02, PR * 0.94, PR * 1.02, 0.75)
    return out
  }
  let blendFrom = -99
  return {
    group,
    /** keep what is on screen now, to ease from it into the next shape */
    hold(now) {
      from.set(pos)
      blendFrom = now
    },
    show(mode, a, now) {
      const s = shape(mode, a)
      const w = ease((now - blendFrom) / 0.35)
      if (w >= 1) pos.set(target)
      else for (let i = 0; i < pos.length; i++) pos[i] = from[i] + (target[i] - from[i]) * w
      attr.needsUpdate = true
      geo.computeVertexNormals()
      mesh.position.y = s.lift
      // the shadow: smaller and fainter the higher it flies
      const spread = mode === 'leave' ? 1 + 1.35 * ease(a / 9) : mode === 'slow' || mode === 'fast' ? 1.4 : 1
      shadow.scale.setScalar(PR * 1.15 * spread * (1 - Math.min(0.5, s.lift)))
      M.shadow.opacity = 0.42 * (1 - Math.min(0.7, s.lift))
      mitts.forEach((mt, i) => {
        mt.visible = s.mitt > 0.01
        if (!mt.visible) return
        const side = i === 0 ? -1 : 1
        mt.position.set(side * s.mx, PR * 0.8, 0)
        mt.scale.setScalar(Math.max(0.001, s.mitt))
      })
      return s
    },
    dispose: () => geo.dispose(),
  }
}

// ---- the chain: polydimethylsiloxane, -[Si(CH3)2-O]n-, its atoms in the game's colours ----

const TG = -125 // its glass transition, °C
const T_MIN = -150
const T_MAX = 250
// bond lengths (ångström) and angles: Si-O 1.64, Si-C 1.87, C-H 1.09; Si-O-Si about 143°, O-Si-O about 110°
const SI_O = 1.64
const SI_C = 1.87
const C_H = 1.09
const ANG_O = (143 * Math.PI) / 180
const ANG_SI = (110 * Math.PI) / 180
const TET = (109.47 * Math.PI) / 180

/** NeRF: the next atom D from A, B, C, its bond r to C, angle th at C and dihedral ph about B-C. */
function nerf(A, B, C, r, th, ph, out) {
  const bcx = C[0] - B[0]
  const bcy = C[1] - B[1]
  const bcz = C[2] - B[2]
  const bl = Math.hypot(bcx, bcy, bcz)
  const ux = bcx / bl
  const uy = bcy / bl
  const uz = bcz / bl
  const abx = B[0] - A[0]
  const aby = B[1] - A[1]
  const abz = B[2] - A[2]
  let nx = aby * uz - abz * uy
  let ny = abz * ux - abx * uz
  let nz = abx * uy - aby * ux
  const nl = Math.hypot(nx, ny, nz) || 1
  nx /= nl
  ny /= nl
  nz /= nl
  const mx = ny * uz - nz * uy
  const my = nz * ux - nx * uz
  const mz = nx * uy - ny * ux
  const dx = -r * Math.cos(th)
  const dy = r * Math.sin(th) * Math.cos(ph)
  const dz = r * Math.sin(th) * Math.sin(ph)
  out[0] = C[0] + ux * dx + mx * dy + nx * dz
  out[1] = C[1] + uy * dx + my * dy + ny * dz
  out[2] = C[2] + uz * dx + mz * dy + nz * dz
  return out
}

function siloxaneChain({ nSi = 5, light = false }) {
  const NB = 2 * nSi + 1 // O, Si, O, ..., Si, O
  const bb = Array.from({ length: NB }, () => [0, 0, 0])
  // the backbone from its angles and dihedrals
  const build = (dihedral, angO, angSi) => {
    bb[0] = [0, 0, 0]
    bb[1] = [SI_O, 0, 0]
    const th1 = angSi(1)
    bb[2] = [SI_O - SI_O * Math.cos(th1), SI_O * Math.sin(th1), 0]
    for (let i = 3; i < NB; i++) nerf(bb[i - 3], bb[i - 2], bb[i - 1], SI_O, i % 2 === 1 ? angO(i - 1) : angSi(i - 1), dihedral(i), bb[i])
  }
  // the straightest conformation (the plain zigzag curls, the two angles differ): a search over the
  // two dihedrals, about Si-O and about O-Si bonds
  let best = { d: 0, a: Math.PI, b: Math.PI }
  for (let ia = 0; ia < 72; ia++) {
    for (let ib = 0; ib < 72; ib++) {
      const a = (ia / 72) * TAU
      const b = (ib / 72) * TAU
      build(i => (i % 2 ? a : b), () => ANG_O, () => ANG_SI)
      const d = Math.hypot(bb[NB - 2][0] - bb[1][0], bb[NB - 2][1] - bb[1][1], bb[NB - 2][2] - bb[1][2])
      // nearest to trans when two are as straight (the zigzag look of the picture)
      const score = d - 0.02 * (Math.abs(Math.cos(a) + 1) + Math.abs(Math.cos(b) + 1))
      if (score > best.d) best = { d: score, a, b }
    }
  }
  const restLen = best.d
  const rnd = random(77)
  const wig = Array.from({ length: NB }, () => ({ f1: 0.7 + rnd() * 0.8, f2: 1.3 + rnd() * 1.2, o1: rnd() * TAU, o2: rnd() * TAU, f3: 0.9 + rnd(), o3: rnd() * TAU }))
  const methylSpin = Array.from({ length: 2 * nSi }, () => ({ f: 1.5 + rnd() * 2, o: rnd() * TAU }))

  // drawn sizes as src/chem/ballAndStick.js draws them (ångström), its colours (silicon its own, beige)
  const COLORS = { Si: element('Si')?.cpk ?? BEIGE, O: '#f2302b', C: '#42464e', H: '#f4f6fb' }
  const RADII = { Si: 0.45, O: 0.37, C: 0.4, H: 0.28 }
  const counts = { Si: nSi, O: nSi + 1, C: 2 * nSi, H: 6 * nSi }
  const seg = light ? 12 : 22
  const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75))
  const mats = {}
  const meshes = {}
  const group = new THREE.Group()
  for (const el of ['Si', 'O', 'C', 'H']) {
    const c = new THREE.Color(COLORS[el])
    mats[el] = light
      ? new THREE.MeshStandardMaterial({ color: c, roughness: 0.32 })
      : new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2 })
    mats[el].userData.base = c.clone()
    meshes[el] = new THREE.InstancedMesh(sphere, mats[el], counts[el])
    meshes[el].frustumCulled = false
    group.add(meshes[el])
  }
  const NBOND = NB - 1 + 2 + 2 * nSi + 6 * nSi
  const stick = new THREE.CylinderGeometry(0.09, 0.09, 1, light ? 6 : 10)
  const bondMat = light
    ? new THREE.MeshStandardMaterial({ color: '#dfe5f2', roughness: 0.4 })
    : new THREE.MeshPhysicalMaterial({ color: '#dfe5f2', roughness: 0.4, clearcoat: 0.5 })
  const sticks = new THREE.InstancedMesh(stick, bondMat, NBOND)
  sticks.frustumCulled = false
  group.add(sticks)

  const V = THREE.Vector3
  const P = Array.from({ length: NB }, () => new V())
  const Cs = Array.from({ length: 2 * nSi }, () => new V())
  const Hs = Array.from({ length: 6 * nSi }, () => new V())
  const stubs = [new V(), new V()]
  const q = new THREE.Quaternion()
  const o = new THREE.Object3D()
  const UP = new V(0, 1, 0)
  const X = new V(1, 0, 0)
  const tmp = [0, 0, 0]
  const a1 = new V()
  const a2 = new V()
  const bis = new V()
  const nrm = new V()
  const ax = new V()
  const p1 = new V()
  const p2 = new V()
  const cen = new V()
  const e2e = new V()
  // the whole model turned so its end-to-end line lies along x, its zigzag flat (the methyls up and down)
  const layFlat = new THREE.Quaternion().setFromAxisAngle(X, -Math.PI / 2)

  /** Place every atom: `amp` how much the chain bends (rad), `ph` how far its wiggle has run. */
  function pose(amp, ph, scale) {
    build(
      i => (i % 2 ? best.a : best.b) + amp * (0.8 * Math.sin(ph * wig[i].f1 + wig[i].o1) + 0.45 * Math.sin(ph * wig[i].f2 + wig[i].o2)),
      i => ANG_O + amp * 0.22 * Math.sin(ph * wig[i].f3 + wig[i].o3),
      i => ANG_SI + amp * 0.05 * Math.sin(ph * wig[i].f3 + wig[i].o3),
    )
    for (let i = 0; i < NB; i++) P[i].set(bb[i][0], bb[i][1], bb[i][2])
    // centre on its middle, end-to-end along x
    cen.set(0, 0, 0)
    for (const p of P) cen.add(p)
    cen.multiplyScalar(1 / NB)
    e2e.subVectors(P[NB - 2], P[1]).normalize()
    q.setFromUnitVectors(e2e, X).premultiply(layFlat)
    for (const p of P) p.sub(cen).applyQuaternion(q)
    // the end stubs: the chain goes on beyond the lens
    for (const [k, i, j] of [[0, 0, 1], [1, NB - 1, NB - 2]]) stubs[k].subVectors(P[i], P[j]).normalize().multiplyScalar(SI_O * 0.9).add(P[i])
    // two methyls on each silicon, tetrahedral, away from its oxygens; three hydrogens on each, turning
    for (let s = 0; s < nSi; s++) {
      const si = P[2 * s + 1]
      a1.subVectors(P[2 * s], si).normalize()
      a2.subVectors(P[2 * s + 2], si).normalize()
      bis.addVectors(a1, a2).normalize().negate()
      nrm.crossVectors(a1, a2).normalize()
      for (let k = 0; k < 2; k++) {
        const c = Cs[2 * s + k]
        const half = TET / 2
        c.copy(bis).multiplyScalar(Math.cos(half)).addScaledVector(nrm, (k ? -1 : 1) * Math.sin(half)).normalize()
        ax.copy(c)
        c.multiplyScalar(SI_C).add(si)
        // a frame round the Si-C axis
        p1.copy(Math.abs(ax.y) < 0.9 ? UP : X).cross(ax).normalize()
        p2.crossVectors(ax, p1)
        const turn = methylSpin[2 * s + k].o + ph * methylSpin[2 * s + k].f
        for (let h = 0; h < 3; h++) {
          const ang = turn + (h * TAU) / 3
          Hs[(2 * s + k) * 3 + h]
            .copy(ax)
            .multiplyScalar(-Math.cos(TET))
            .addScaledVector(p1, Math.sin(TET) * Math.cos(ang))
            .addScaledVector(p2, Math.sin(TET) * Math.sin(ang))
            .multiplyScalar(C_H)
            .add(c)
        }
      }
    }
    // the instances
    const put = (mesh, i, p, r) => {
      o.position.copy(p).multiplyScalar(scale)
      o.quaternion.identity()
      o.scale.setScalar(r * scale)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
    }
    let iSi = 0
    let iO = 0
    P.forEach((p, i) => (i % 2 ? put(meshes.Si, iSi++, p, RADII.Si) : put(meshes.O, iO++, p, RADII.O)))
    Cs.forEach((p, i) => put(meshes.C, i, p, RADII.C))
    Hs.forEach((p, i) => put(meshes.H, i, p, RADII.H))
    let b = 0
    const bond = (a, c) => {
      p1.copy(a).multiplyScalar(scale)
      p2.copy(c).multiplyScalar(scale)
      ax.subVectors(p2, p1)
      const len = ax.length()
      o.position.addVectors(p1, p2).multiplyScalar(0.5)
      o.quaternion.setFromUnitVectors(UP, ax.normalize())
      o.scale.set(scale, len, scale)
      o.updateMatrix()
      sticks.setMatrixAt(b++, o.matrix)
    }
    for (let i = 0; i < NB - 1; i++) bond(P[i], P[i + 1])
    bond(P[0], stubs[0])
    bond(P[NB - 1], stubs[1])
    Cs.forEach((c, i) => bond(P[2 * Math.floor(i / 2) + 1], c))
    Hs.forEach((h, i) => bond(Cs[Math.floor(i / 3)], h))
    for (const m of Object.values(meshes)) m.instanceMatrix.needsUpdate = true
    sticks.instanceMatrix.needsUpdate = true
  }
  const ice = new THREE.Color('#d6ecff')
  const iceGlow = new THREE.Color('#5aa8ff')
  const hotGlow = new THREE.Color('#ff7a2a')
  /** Frost below the glass transition, a warm glow when hot. */
  function tint(frost, hot) {
    for (const m of Object.values(mats)) {
      m.color.copy(m.userData.base).lerp(ice, frost * 0.12)
      m.emissive.copy(frost > hot ? iceGlow : hotGlow)
      m.emissiveIntensity = Math.max(frost * 0.05, hot * 0.05)
    }
  }
  return { group, pose, tint, restLen, dispose: () => sphere.dispose() }
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth }) {
  const stage = kitchenStage({ light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  let clock = 0
  const paras = list => list.map(p => ({ p }))

  const TM = trayMaterials()
  textures.push(...TM.textures)
  const dotTex = softDot()
  textures.push(dotTex)
  const M = {
    silicon: new THREE.MeshStandardMaterial({ color: '#a6afc2', metalness: 0.7, roughness: 0.2, envMapIntensity: 2.6 }),
    card: new THREE.MeshStandardMaterial({ color: '#1f2340', roughness: 0.5 }),
    putty: new THREE.MeshStandardMaterial({ color: '#2f80e8', roughness: 0.22, metalness: 0 }),
    shadow: new THREE.MeshBasicMaterial({ color: '#000000', map: dotTex, transparent: true, opacity: 0.42, depthWrite: false }),
    mitt: new THREE.MeshStandardMaterial({ color: '#c8453b', roughness: 0.9 }),
    cuff: new THREE.MeshStandardMaterial({ color: '#b9a28f', roughness: 0.9 }),
    egg: new THREE.MeshStandardMaterial({ color: '#d6403a', roughness: 0.35, side: THREE.DoubleSide }),
    wood: new THREE.MeshStandardMaterial({ color: '#5b3a2a', roughness: 0.75 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.35, metalness: 0.7 }),
    rim: new THREE.MeshStandardMaterial({ color: PINK, emissive: PINK, emissiveIntensity: 0.7, roughness: 0.4 }),
    lens: new THREE.MeshBasicMaterial({ color: '#1b1f48', side: THREE.DoubleSide }),
    glare: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.22, depthWrite: false }),
    glass: new THREE.MeshStandardMaterial({ color: '#dfe7f2', roughness: 0.15, transparent: true, opacity: 0.35, depthWrite: false }),
    red: new THREE.MeshStandardMaterial({ color: '#e0302a', emissive: '#7a0a06', emissiveIntensity: 0.6, roughness: 0.4 }),
    tick: new THREE.MeshBasicMaterial({ color: '#cfd6e6' }),
    tickTg: new THREE.MeshBasicMaterial({ color: '#7cc4ff' }),
    mist: new THREE.PointsMaterial({ color: '#eaf6ff', size: 0.16, map: dotTex, transparent: true, opacity: 0, depthWrite: false }),
  }

  // ======== 1. silicon or silicone: the tray, the silicon, the oven and the freezer ========
  const AT_TRAY = -4.0
  const AT_BAR = -3.15
  const tray = muffinTray(TM)
  const trayRest = stage.place('w', AT_TRAY, 0.34)
  const REST = new THREE.Vector3(trayRest.x, TOP + TRAY.DEPTH, trayRest.z)
  tray.group.position.copy(REST)
  tray.group.rotation.y = trayRest.rot
  root.add(tray.group)
  disposers.push(tray.dispose)
  const bar = siliconBar(M)
  const barRest = stage.place('w', AT_BAR, 0.34)
  bar.group.position.set(barRest.x, TOP, barRest.z)
  bar.group.rotation.y = barRest.rot
  root.add(bar.group)
  // the two words on the tiles over them (high enough for the muffins' hop to pass below)
  for (const [word, color, atW] of [[E.tray.signs.silicone, '#ff8cc0', AT_TRAY], [E.tray.signs.silicon, '#c2d0ea', AT_BAR]]) {
    const c = wallSign(word, color, M)
    const p = stage.place('w', atW, 0.012)
    c.position.set(p.x, TOP + 0.62, p.z)
    c.rotation.y = p.rot
    root.add(c)
  }
  // the paths in and out: up off the worktop, across, and in
  const pathTo = (inside, front) => {
    const lift = new THREE.Vector3(REST.x + 0.5, REST.y + 0.35, REST.z)
    const before = new THREE.Vector3(front.x, Math.max(front.y, inside.y) + TRAY.DEPTH + 0.12, front.z)
    return new THREE.CatmullRomCurve3([REST.clone(), lift, before, new THREE.Vector3(inside.x, inside.y + TRAY.DEPTH, inside.z)], false, 'centripetal')
  }
  const toOven = pathTo(stage.oven.inside, stage.oven.front)
  const toFreezer = pathTo(stage.fridge.inside, stage.fridge.front)
  // cold mist puffing out of the freezer
  const MIST = light ? 16 : 40
  const mistPos = new Float32Array(MIST * 3)
  const mistGeo = new THREE.BufferGeometry()
  mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3))
  const mist = new THREE.Points(mistGeo, M.mist)
  mist.frustumCulled = false
  root.add(mist)
  const mistSeeds = Array.from({ length: MIST }, (_, i) => {
    const r = random(300 + i)
    return { vx: 0.25 + r() * 0.5, vy: -0.05 - r() * 0.2, vz: (r() - 0.5) * 0.7, y: (r() - 0.5) * 0.4, z: (r() - 0.5) * 0.6 }
  })
  const mistFrom = stage.fridge.inside.clone()

  const TRAY_T = { bend: 2.6, snap: SNAP_T, oven: 6.2, freeze: 6.2 }
  const TRAY_ORDER = ['bend', 'snap', 'oven', 'freeze']
  const CUES = { bend: [[0, 'part'], [0.55, 'pop']], snap: [[0.75, 'crack']], oven: [[0, 'tap'], [2.1, 'fizz'], [3.6, 'tap']], freeze: [[0, 'tap'], [3.6, 'fizz']] }
  let tLast = null
  let tN = 0
  let tStart = -30
  let tSound = false
  let tCue = 0
  const trayAge = () => clock - tStart
  const trayBusy = () => !!tLast && trayAge() < TRAY_T[tLast]
  const trayNext = () => TRAY_ORDER[(TRAY_ORDER.indexOf(tLast) + 1) % TRAY_ORDER.length]
  const startTray = (kind, age, sound) => {
    tLast = kind
    tStart = clock - age
    tSound = sound
    tCue = CUES[kind].findIndex(([s]) => s >= age)
    if (tCue < 0) tCue = CUES[kind].length
  }
  const trayDo = kind => {
    if (trayBusy()) return false
    tN++
    startTray(kind, 0, true)
    share('tray')
    return at(E.tray.says[kind], level())
  }
  const trayPanel = lv => ({
    title: E.tray.title,
    color: PINK,
    blocks: [
      ...paras(E.tray.panel[depth(lv)]),
      { buttons: TRAY_ORDER.map(k => ({ label: E.tray.verbs[k], onClick: () => say(trayDo(k) || at(W.busy, level())) })) },
    ],
  })
  ex.add({
    id: 'tray',
    x: stage.place('w', (AT_TRAY + AT_BAR) / 2, 1.85).x,
    z: (AT_TRAY + AT_BAR) / 2,
    radius: 1.9,
    label: E.tray.label,
    verb: () => E.tray.verbs[trayNext()],
    panel: trayPanel,
    panelDelay: 2.8,
    focus: { x: REST.x + 0.1, y: 1.3, z: (AT_TRAY + AT_BAR) / 2 - 0.3, size: 3.0 },
    act: () => trayDo(trayNext()),
  })
  const hops = [0, 0, 0]
  updates.push(() => {
    const kind = tLast
    const a = trayAge()
    const on = kind && a < TRAY_T[kind]
    if (on && tSound) {
      const cues = CUES[kind]
      while (tCue < cues.length && a >= cues[tCue][0]) play(cues[tCue++][1])
    }
    let kappa = 0
    let tau = 0
    let lift = 0
    let spin = 0
    let path = 0
    let door = 0
    let frost = 0
    let heat = 0
    hops.fill(0)
    if (on && kind === 'bend') {
      const K = 3.1
      kappa = a < 0.55 ? K * ease(a / 0.55) : a < 1.25 ? K : K * Math.exp(-(a - 1.25) * 4.2) * Math.cos((a - 1.25) * 11)
      tau = a > 0.45 && a < 1.25 ? 2.3 * Math.sin((Math.PI * (a - 0.45)) / 0.8) : 0
      lift = 0.14 * (ease(a / 0.4) - ease((a - 1.5) / 0.6))
      if (a > 0.55 && a < 1.75) {
        const u = (a - 0.55) / 1.2
        hops.fill(1.2 * u * (1 - u))
        spin = Math.sin(Math.PI * u) * 0.9
      }
    } else if (on && (kind === 'oven' || kind === 'freeze')) {
      door = a < 0.5 ? ease(a / 0.5) : a < 1.6 ? 1 : a < 2.1 ? 1 - ease((a - 1.6) / 0.5) : a < 3.6 ? 0 : a < 4.1 ? ease((a - 3.6) / 0.5) : a < 5.0 ? 1 : 1 - ease((a - 5.0) / 0.5)
      path = a < 0.4 ? 0 : a < 1.6 ? ease((a - 0.4) / 1.2) : a < 4.1 ? 1 : 1 - ease((a - 4.1) / 1.2)
      if (a > 5.3) kappa = 1.8 * Math.sin((Math.PI * (a - 5.3)) / 0.9)
      if (kind === 'oven' && a > 2.1 && a < 3.6) heat = Math.sin((Math.PI * (a - 2.1)) / 1.5)
      if (kind === 'freeze' && a > 4.1) frost = 1 - ease((a - 4.1) / 2.0)
    }
    stage.oven.open(kind === 'oven' && on ? door : 0)
    stage.oven.heat(heat)
    stage.fridge.open(kind === 'freeze' && on ? door : 0)
    if (path > 0) {
      ;(kind === 'oven' ? toOven : toFreezer).getPointAt(path, tray.group.position)
    } else tray.group.position.copy(REST)
    tray.group.position.y += lift
    TM.sheet.color.copy(TM.pink).lerp(TM.frosty, frost * 0.55)
    TM.cup.color.copy(TM.sheet.color)
    tray.pose(kappa, tau, hops, spin)
    // the silicon
    bar.pose(on && kind === 'snap' ? a : -1, tN)
    // the freezer's breath
    const ma = on && kind === 'freeze' ? a - 3.6 : -1
    mist.visible = ma > 0 && ma < 2.2
    if (mist.visible) {
      M.mist.opacity = 0.55 * (1 - ma / 2.2) * ease(ma / 0.2)
      mistSeeds.forEach((s, i) => {
        mistPos[i * 3] = mistFrom.x + 0.3 + s.vx * ma
        mistPos[i * 3 + 1] = mistFrom.y + 0.25 + s.y + s.vy * ma - 0.08 * ma * ma
        mistPos[i * 3 + 2] = mistFrom.z + s.z + s.vz * ma
      })
      mistGeo.attributes.position.needsUpdate = true
    }
  })

  // ======== 2. the bouncing putty ========
  const AT_PUTTY = -1.4
  const putty = puttyBlob(M)
  const pp = stage.place('e', AT_PUTTY, 0.36)
  putty.group.position.set(pp.x, TOP, pp.z)
  putty.group.rotation.y = pp.rot
  root.add(putty.group)
  disposers.push(putty.dispose)
  // the plastic egg it came in, open beside it
  {
    const shell = new THREE.SphereGeometry(0.075, 24, 12, 0, TAU, Math.PI / 2, Math.PI / 2).scale(1, 1.25, 1)
    const low = new THREE.Mesh(shell, M.egg)
    low.position.set(-0.74, 0.094, 0.02)
    const high = new THREE.Mesh(shell, M.egg)
    high.rotation.set(Math.PI - 0.5, 0, 0.3)
    high.position.set(-0.87, 0.06, -0.06)
    putty.group.add(low, high)
  }
  const PUTTY_ORDER = ['throw', 'slow', 'fast', 'leave']
  const PUTTY_CUES = { slow: [[0.3, 'part']], fast: [[0.42, 'pop']] }
  let pMode = 'ball'
  let pN = 0
  let pStart = 0
  let pSound = false
  let pHop = -1
  let pCue = 0
  const puttyAge = () => clock - pStart
  const puttyBusy = () => puttyAge() < PUTTY_BUSY[pMode]
  const puttyNext = () => PUTTY_ORDER[(PUTTY_ORDER.indexOf(pMode) + 1) % PUTTY_ORDER.length]
  const startPutty = (mode, age, sound, blend) => {
    if (blend) putty.hold(clock - age)
    pMode = mode
    pStart = clock - age
    pSound = sound
    pHop = -1
    pCue = 0
    while (pCue < (PUTTY_CUES[mode]?.length ?? 0) && PUTTY_CUES[mode][pCue][0] < age) pCue++
  }
  const puttyDo = mode => {
    if (puttyBusy()) return false
    pN++
    startPutty(mode, 0, true, true)
    share('putty')
    return at(E.putty.says[mode], level())
  }
  const puttyPanel = lv => ({
    title: E.putty.title,
    color: BLUE,
    blocks: [
      ...paras(E.putty.panel[depth(lv)]),
      { buttons: PUTTY_ORDER.map(k => ({ label: E.putty.verbs[k], onClick: () => say(puttyDo(k) || at(W.busy, level())) })) },
    ],
  })
  ex.add({
    id: 'putty',
    x: stage.place('e', AT_PUTTY, 1.85).x,
    z: AT_PUTTY,
    radius: 1.9,
    label: E.putty.label,
    verb: () => E.putty.verbs[puttyNext()],
    panel: puttyPanel,
    panelDelay: 2.6,
    focus: { x: pp.x - 0.05, y: TOP + 0.42, z: AT_PUTTY, size: 1.7 },
    act: () => puttyDo(puttyNext()),
  })
  updates.push(() => {
    const a = puttyAge()
    const s = putty.show(pMode, a, clock)
    if (!pSound) return
    if (pMode === 'throw' && s.hop !== pHop) {
      // a soft pop at every landing, quieter as it settles
      if (s.hop > 0 || (pHop >= 0 && s.hop === HOPS.length)) play('join', { order: Math.max(1, 3 - Math.min(s.hop, 3)) })
      pHop = s.hop
    }
    const cues = PUTTY_CUES[pMode]
    while (cues && pCue < cues.length && a >= cues[pCue][0]) play(cues[pCue++][1])
  })

  // ======== 3. the chain in the magnifier ========
  const MX = 0.2
  const MZ = -2.5
  const MY = 1.85
  const RING = 1.3
  const mag = new THREE.Group()
  mag.position.set(MX, 0, MZ)
  root.add(mag)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(RING, 0.085, 16, 96), M.rim)
  ring.position.y = MY
  const inner = new THREE.Mesh(new THREE.TorusGeometry(RING - 0.07, 0.02, 8, 96), M.brass)
  inner.position.y = MY
  const lens = new THREE.Mesh(new THREE.CircleGeometry(RING - 0.05, 64), M.lens)
  lens.position.set(0, MY, -0.5)
  const glare = new THREE.Mesh(new THREE.TorusGeometry(RING - 0.3, 0.035, 8, 40, 1.05), M.glare)
  glare.position.set(0, MY, -0.48)
  glare.rotation.z = 1.75
  mag.add(ring, inner, lens, glare)
  // a stand: two wooden posts holding the ring at its sides, on a long foot, brass pins
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, MY, 14), M.wood)
    post.position.set(s * (RING + 0.16), MY / 2, 0)
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 14), M.brass)
    pin.rotation.z = Math.PI / 2
    pin.position.set(s * (RING + 0.1), MY, 0)
    mag.add(post, pin)
  }
  const foot = new THREE.Mesh(new RoundedBoxGeometry(2 * RING + 0.7, 0.1, 0.62, 2, 0.04), M.wood)
  foot.position.y = 0.05
  mag.add(foot)
  solids.push(box(MX, MZ, 2 * RING + 0.7, 0.7, { y1: 3.3 }))
  // the chain itself, sized to fit the lens
  const chain = siloxaneChain({ nSi: 4, light })
  const CSCALE = (2 * RING - 0.5) / (chain.restLen + 2 * SI_O)
  chain.group.position.set(0, MY + 0.08, -0.05)
  mag.add(chain.group)
  disposers.push(chain.dispose)
  // the temperature, read in the lens under the chain, and a thermometer beside it
  const reading = makeText(degrees(20), { size: 0.2, color: '#ffffff', anchorX: 'center', anchorY: 'middle' })
  reading.position.set(0, MY - RING + 0.33, -0.3)
  mag.add(reading)
  const TH = { x: RING + 0.55, y0: 0.55, y1: 2.55 }
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, TH.y1 - TH.y0, 18, 1, true), M.glass)
  tube.position.set(TH.x, (TH.y0 + TH.y1) / 2, 0)
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 12), M.red)
  bulb.position.set(TH.x, TH.y0 - 0.04, 0)
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 12).translate(0, 0.5, 0), M.red)
  column.position.set(TH.x, TH.y0, 0)
  const thFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.06, 20), M.wood)
  thFoot.position.set(TH.x, 0.03, 0)
  const thPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, TH.y0 - 0.1, 8), M.wood)
  thPost.position.set(TH.x, (TH.y0 - 0.1) / 2 + 0.05, -0.02)
  mag.add(tube, bulb, column, thFoot, thPost)
  const yOf = T => TH.y0 + ((T - T_MIN) / (T_MAX - T_MIN)) * (TH.y1 - TH.y0)
  for (const T of [-100, 0, 100, 200]) {
    const tk = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.012, 0.012), M.tick)
    tk.position.set(TH.x - 0.075, yOf(T), 0.03)
    mag.add(tk)
  }
  const tgTick = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.014), M.tickTg)
  tgTick.position.set(TH.x - 0.04, yOf(TG), 0.04)
  mag.add(tgTick)
  solids.push(circle(MX + TH.x, MZ, 0.25))

  let target = 20
  let shown = 20
  let phase = 0
  let readingAt = 20
  let zone = 'room'
  const zoneOf = T => (T < TG ? 'freeze' : T >= 200 ? 'heat' : 'room')
  const PRESET = { freeze: -140, heat: 250, room: 20 }
  const chainNext = () => (target < TG ? 'heat' : target >= 200 ? 'room' : 'freeze')
  const setTemp = (v, live) => {
    target = clamp(Math.round(Number(v)), T_MIN, T_MAX)
    if (!Number.isFinite(target)) target = 20
    if (!live) shown = target
  }
  // the slider moves many times a second: the others get it a few times a second, and where it stopped
  let sliding = false
  const slid = () => {
    if (sliding) return
    sliding = true
    later(0.2, () => {
      sliding = false
      share('chain')
    })
  }
  const chainPanel = lv => ({
    title: E.chain.title,
    color: BEIGE,
    blocks: [
      ...paras(E.chain.panel[depth(lv)]),
      {
        slider: {
          label: E.chain.temp,
          min: T_MIN,
          max: T_MAX,
          step: 1,
          value: target,
          onInput: v => {
            setTemp(v, true)
            slid()
            const z = zoneOf(target)
            if (z !== zone) {
              zone = z
              say(at(E.chain.says[z], level()))
            }
          },
          format: degrees,
          live: () => target,
        },
      },
    ],
  })
  ex.add({
    id: 'chain',
    x: MX,
    z: MZ + 2.4,
    radius: 2.1,
    label: E.chain.label,
    verb: () => E.chain.verbs[chainNext()],
    panel: chainPanel,
    panelDelay: 1.8,
    focus: { x: MX, y: MY, z: MZ, size: 2.9 },
    act: () => {
      const next = chainNext()
      setTemp(PRESET[next], true)
      zone = zoneOf(target)
      play(next === 'freeze' ? 'part' : 'select')
      share('chain')
      return at(E.chain.says[next], level())
    },
  })
  const lensCold = new THREE.Color('#2a5a86')
  const lensRoom = new THREE.Color('#1b1f48')
  const lensHot = new THREE.Color('#5c2414')
  updates.push(dt => {
    shown = damp(shown, target, 1.6, dt)
    if (Math.abs(shown - target) < 0.3) shown = target
    const T = shown
    const warm = clamp((T - TG) / (T_MAX - TG))
    // below the glass transition nothing moves; above it, the warmer the faster and the wider
    const amp = 0.22 + 0.55 * warm ** 0.7
    const speed = T <= TG ? 0 : 0.22 + 2.6 * warm ** 0.8
    phase += speed * dt
    chain.pose(amp, phase, CSCALE)
    const frost = clamp((TG + 5 - T) / 20)
    const hot = clamp((T - 150) / 100)
    chain.tint(frost, hot)
    M.lens.color.copy(lensRoom).lerp(lensCold, frost).lerp(lensHot, hot)
    column.scale.y = Math.max(0.001, yOf(T) - TH.y0)
    const r = Math.round(T)
    if (r !== readingAt) {
      readingAt = r
      reading.text = degrees(r)
      reading.color = T < TG ? '#bfe4ff' : T > 150 ? '#ffd2a8' : '#ffffff'
      reading.sync()
    }
  })

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.85 },
    spawn: { x: 0, z: 2.9, yaw: 0 },
    hostSpot: { x: 1.8, z: 2.2, yaw: Math.atan2(1.8, -0.7) },
    back: { x: 0, z: 6.3, rot: Math.PI },
    stand: { x: -2.2, z: 1.3, rot: Math.atan2(2.2, 1.6) },
    parts: {
      tray: { get last() { return tLast }, get n() { return tN }, get busy() { return trayBusy() } },
      putty: { get mode() { return pMode }, get n() { return pN }, get busy() { return puttyBusy() } },
      chain: { get target() { return target }, get shown() { return shown } },
    },
    panels: { tray: trayPanel, putty: puttyPanel, chain: chainPanel },
    shared: {
      tray: {
        get: () => ({ last: tLast, n: tN, age: Math.min(30, Math.round(trayAge() * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const kind = TRAY_ORDER.includes(s?.last) ? s.last : null
          tN = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 30)
          if (kind) startTray(kind, age, !!live)
          else {
            tLast = null
            tStart = clock - 30
          }
        },
      },
      putty: {
        get: () => ({ mode: pMode, n: pN, age: Math.min(60, Math.round(puttyAge() * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const mode = PUTTY_ORDER.includes(s?.mode) ? s.mode : 'ball'
          pN = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          startPutty(mode, age, !!live, !!live)
        },
      },
      chain: {
        get: () => ({ temp: target }),
        set: (s, live) => {
          setTemp(s?.temp ?? 20, live)
          zone = zoneOf(target)
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
      mistGeo.dispose()
    },
  }
}
