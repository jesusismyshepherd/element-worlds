// Radon's picture "Why do people air their cellars?" as a room (docs/knowledge/picture-rooms.md): a granite house
// in the Beira on a frosty winter night, cut open like a doll's house from the roof to the granite under it
// (stages/stonehouse.js). Radon atoms (the radon pictures' teal balls) rise out of the granite through the soil;
// how many come in, and how many stay, follows a small model of the house (illustrative numbers, said so in the
// Scientist panel). Three stations, each step chosen by tapping its thing (the user's rule); E opens the panel,
// whose buttons and slider do the same:
// - "The house breathes" (from the yard): tap the window (radon floats out, the level falls), the extractor hood
//   (the house is sucked harder: the level rises), the cellar trapdoor, the stove, the thermometer, or drag the
//   outside temperature: the warmer inside than outside, the harder the house pulls soil air in at the slab's
//   cracks (the stack effect; orange arrows at the eaves). The monitor on the sideboard shows the level.
// - "The detector kit" (at the sideboard): tap the detector, it opens on its plastic chip and a lens shows radon
//   atoms decaying and their alpha particles scratching it; drag the months (0 to 3) and the tracks gather; tap the
//   envelope: the lab etches the chip in hot sodium hydroxide; tap the microscope to count the pits: the house's
//   average goes on the scale board against Portugal's 300 and the WHO's 100.
// - "The fix" (from the yard, by the cellar): tap each crack in the slab to seal it (a trowel lays a bead: the
//   level drops somewhat), tap the fan on the pipe outside (or the pipe in the cellar): the sump under the slab
//   is sucked, the radon goes up the pipe and out above the roof, and the level falls close to outdoors.
// All three are shared in a room (src/net/shared.js). parts.<station>.* does what each tap does, for the probes.
// Sources: the head of cellar.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, damp, random } from '../../../wings/noble/kit.js'
import { stonehouseStage } from '../../stages/stonehouse.js'
import { ease } from '../../kit.js'
import { makeText } from '../../../../engine/text.js'
import { play } from '../../../../audio/sound.js'
import { CELLAR_WORDS } from './cellar.words.js'

export const WORDS = CELLAR_WORDS

const TAU = Math.PI * 2
const RN = '#3cc3d6'
const RN_GLOW = '#6ff0ff'
const GOLD = '#ffd25e'
const now = () => performance.now() / 1000

// ---- the model: how hard the house pulls, and the radon levels it settles at (illustrative) ----
const T_MIN = -5
const T_MAX = 20
const T_START = -2
const T_HEATED = 20
/** The stack effect's pull at the cellar floor (Pa), for 2.4 m of indoor air: dp = 0.0342 P h (1/To - 1/Ti). */
const stack = (tout, tin) => 3465 * 2.4 * (1 / (tout + 273.15) - 1 / (tin + 273.15))
/** Indoor temperature the house settles at: heated by the stove, or a few degrees above outdoors without it. */
const tinOf = s => (s.stove ? T_HEATED : Math.min(T_HEATED, s.tout + 4))
/** The model: the pull at the floor, the cellar's and the living room's levels (Bq/m3). */
function levels(s, tin = tinOf(s)) {
  const st = stack(s.tout, tin)
  const dp = st * (s.win ? 0.35 : 1) + (s.hood ? (s.win ? 0.4 : 2.0) : 0)
  const open = s.cracks.filter(Boolean).length / 3
  // sealed cracks leave the hidden gaps (pipe entries, wall joints): sealing alone helps only a little (US EPA)
  const leak = 0.7 + 0.3 * open
  const under = s.fan ? dp - 30 : dp
  const adv = Math.max(0, under) * leak
  const diff = s.fan ? 0.02 : 0.15
  const S = 500 * (diff + adv)
  const cellar = 10 + S / (s.win ? 1.0 : 0.5)
  const room = 10 + (cellar - 10) * (s.door ? 0.3 : 0.15) * (s.win ? 0.25 : 1)
  return { pull: dp, cellar, room }
}

// ---- where things are (the stage's measures; the cut is z = 0) ----
const CRACKS = [-2.1, -0.85, 0.4]
const CRACK_LEN = 1.45
const SUMP = { x: -3.0, y: -2.36 }
const PIPE_X = -4.27
const PIPE_R = 0.075
const PIPE_TURN = -0.55
const PIPE_TOP = 4.3
const FAN_Y = 0.85
const PIPE = [[SUMP.x, SUMP.y], [SUMP.x, PIPE_TURN], [PIPE_X, PIPE_TURN], [PIPE_X, PIPE_TOP]]
const PIPE_LEN = PIPE.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - PIPE[i][0], p[1] - PIPE[i][1]), 0)
const pipeAt = u => {
  let d = u * PIPE_LEN
  for (let i = 1; i < PIPE.length; i++) {
    const a = PIPE[i - 1]
    const b = PIPE[i]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (d <= l) return [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l]
    d -= l
  }
  return PIPE[PIPE.length - 1]
}
// the detector kit on the sideboard (it stands against the left wall; things face +x)
const KIT = { x: -3.33, y: 0.88, z: -1.62 }
const ENVELOPE = { x: -3.47, z: -2.05 }
const MONITOR = { x: -3.36, z: -2.47 }
const LENS = { x: -3.1, y: 1.68, z: -1.98, r: 0.38 }
const SCALE = { x: -3.58, y: 1.62, z: -3.0, w: 0.42, h: 1.15 }
const THERMO = { x: 3.62, y: 1.32, z: 3.5 }
// pits a lab finds for a 3-month exposure at a level of `bq`: one drawn for every 30 Bq·month/m3
const PITS_PER = 30
const MAX_PITS = 140

export async function build({ ctx, root, lang, E, ex, say, later, light, color, level, depth, clickable }) {
  const stage = stonehouseStage({ light })
  root.add(stage.group)
  const D = stage.dims
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const own = []
  const keep = o => (own.push(o), o)
  const paras = list => list.map(p => ({ p }))
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(keep(geo), mat)
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o }))
  const basic = (c, o = {}) => keep(new THREE.MeshBasicMaterial({ color: c, ...o }))
  const hidden = keep(new THREE.MeshBasicMaterial({ visible: false }))
  const hitBox = (w, h, d, x, y, z) => mk(new THREE.BoxGeometry(w, h, d), hidden, x, y, z)
  const text = (s, o) => makeText(s, o)
  const live = (obj, fn) =>
    updates.push(() => {
      const s = fn()
      if (obj.text !== s) {
        obj.text = s
        obj.sync()
      }
    })
  const deg = v => `${v < -0.5 ? '−' : ''}${num(Math.abs(v), 0, lang)} °C`
  const bq = v => num(Math.max(0, v), 0, lang)
  const plural = (forms, n) => {
    const whole = Math.abs(n - Math.round(n)) < 0.05
    const v = whole ? Math.round(n) : n
    const cat = new Intl.PluralRules(lang === 'pt-pt' ? 'pt-PT' : lang).select(v)
    return fill(forms[cat] ?? forms.other, { n: whole ? String(v) : num(v, 1, lang) })
  }
  /** If the station's panel is open, write it again (its numbers and buttons follow the state). */
  const refresh = maker => {
    if (ctx.store.get().panel?.make === maker) ctx.showPanel(maker)
  }

  // ======== the state ========
  const S = { tout: T_START, stove: 1, win: 0, hood: 0, door: 1, cracks: [1, 1, 1], fan: 0 }
  let tin = T_HEATED
  const shown = { ...levels(S) }
  const target = () => levels(S, tin)
  // what the house would settle at, for the detector (the same on every screen)
  const steady = () => levels(S).room

  // ======== the motes: radon atoms, teal balls with a soft halo ========
  const moteTex = keep(
    canvasTex(64, 64, (g, w) => {
      const c = w / 2
      const halo = g.createRadialGradient(c, c, 0, c, c, c)
      halo.addColorStop(0, 'rgba(111,240,255,0.55)')
      halo.addColorStop(0.45, 'rgba(111,240,255,0.18)')
      halo.addColorStop(1, 'rgba(111,240,255,0)')
      g.fillStyle = halo
      g.fillRect(0, 0, w, w)
      const r = w * 0.2
      const ball = g.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r)
      ball.addColorStop(0, '#d8fbff')
      ball.addColorStop(0.35, RN)
      ball.addColorStop(1, '#135a68')
      g.fillStyle = ball
      g.beginPath()
      g.arc(c, c, r, 0, TAU)
      g.fill()
    }),
  )
  const N = light ? 90 : 170
  const mPos = new Float32Array(N * 3)
  const mCol = new Float32Array(N * 4)
  const moteGeo = keep(new THREE.BufferGeometry())
  moteGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
  moteGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 4))
  const motePts = new THREE.Points(moteGeo, keep(new THREE.PointsMaterial({ size: 0.24, map: moteTex, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true })))
  motePts.frustumCulled = false
  motePts.raycast = () => {}
  root.add(motePts)
  const FREE = 0
  const SOIL = 1
  const CRACK = 2
  const CELLAR = 3
  const ROOM = 4
  const OUT = 5
  const SUMPED = 6
  const PIPED = 7
  const PUFF = 8
  const UP = 9
  const TOWIN = 10
  const mr = random(222)
  const M = Array.from({ length: N }, () => ({ s: FREE, x: 0, y: -10, z: 0, vx: 0, vy: 0, vz: 0, a: 0, fade: 0, life: 0, k: 0, u: 0 }))
  const spawn = (s, x, y, z) => {
    const m = M.find(q => q.s === FREE)
    if (!m) return null
    Object.assign(m, { s, x, y, z, vx: 0, vy: 0, vz: 0, a: 0, fade: 0, life: 10 + mr() * 9, k: 0, u: 0 })
    return m
  }
  const count = s => M.reduce((n, m) => n + (m.s === s && !m.fade ? 1 : 0), 0)
  const IX = D.IX
  const ZB = D.ZB
  let soilT = 0
  let regT = 0
  let extraT = 0
  /** Wander inside a box, softly turned back at its walls. */
  const wander = (m, dt, x0, x1, y0, y1, z0, z1, sp = 0.18) => {
    m.vx += (mr() - 0.5) * sp * dt * 6
    m.vy += (mr() - 0.5) * sp * dt * 6
    m.vz += (mr() - 0.5) * sp * dt * 6
    const back = 1.4 * dt
    if (m.x < x0) m.vx += back
    if (m.x > x1) m.vx -= back
    if (m.y < y0) m.vy += back
    if (m.y > y1) m.vy -= back
    if (m.z < z0) m.vz += back
    if (m.z > z1) m.vz -= back
    const v = Math.hypot(m.vx, m.vy, m.vz)
    if (v > sp) {
      m.vx *= sp / v
      m.vy *= sp / v
      m.vz *= sp / v
    }
    m.x += m.vx * dt
    m.y += m.vy * dt
    m.z += m.vz * dt
  }
  const toward = (m, dt, tx, ty, tz, sp) => {
    const dx = tx - m.x
    const dy = ty - m.y
    const dz = tz - m.z
    const d = Math.hypot(dx, dy, dz)
    if (d < sp * dt || d < 0.02) {
      m.x = tx
      m.y = ty
      m.z = tz
      return true
    }
    m.x += (dx / d) * sp * dt
    m.y += (dy / d) * sp * dt
    m.z += (dz / d) * sp * dt
    return false
  }
  const nearestCrack = x => {
    let best = -1
    let bd = 1e9
    CRACKS.forEach((cx, i) => {
      if (!S.cracks[i]) return
      const d = Math.abs(cx - x)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    return best
  }
  function stepMotes(dt, t) {
    const cellarWant = Math.min(light ? 24 : 46, Math.round(shown.cellar / 55))
    const roomWant = Math.min(light ? 20 : 38, Math.round(shown.room / 22))
    const nCellar = count(CELLAR) + count(CRACK)
    const nRoom = count(ROOM) + count(UP)
    const needIn = nCellar < cellarWant && shown.pull > 0.05 && !S.fan
    // soil gas rising out of the granite: along the whole cut, more under the house while it is pulling
    soilT += dt * ((light ? 0.9 : 1.6) + (needIn ? (light ? 1.4 : 2.6) : 0))
    while (soilT >= 1) {
      soilT -= 1
      const under = needIn || S.fan ? mr() < 0.75 : mr() < 0.5
      const x = under ? (mr() * 2 - 1) * (IX - 0.3) : (mr() < 0.5 ? -1 : 1) * (D.OX + 0.3 + mr() * 2.0)
      const m = spawn(SOIL, x, D.TRENCH.y + 0.15 + mr() * (D.ROCK - D.TRENCH.y - 0.2), 0.05)
      if (m) m.vy = 0.17 + mr() * 0.08
    }
    // keeping the rooms at the levels shown: the extra go (decay, mixing), the missing come in
    regT -= dt
    if (regT <= 0) {
      regT = 0.12
      if (nCellar > cellarWant + 1) {
        const m = M.find(q => q.s === CELLAR && !q.fade)
        if (m) m.fade = 1
      }
      if (nRoom > roomWant + 1) {
        const m = M.find(q => q.s === ROOM && !q.fade)
        if (m) {
          if (S.win) {
            m.s = TOWIN
          } else m.fade = 1
        }
      }
    }
    extraT -= dt
    if (extraT <= 0 && nRoom < roomWant) {
      extraT = 0.35
      if (S.door) {
        // up the cellar's stairs to the trapdoor
        const m = M.find(q => q.s === CELLAR && !q.fade)
        if (m) m.s = UP
        else spawn(ROOM, D.HOLE.x0 + 0.4, 0.3, (D.HOLE.z0 + D.HOLE.z1) / 2)
      } else if (mr() < 0.3) {
        // through the floorboards' gaps
        const m = spawn(ROOM, (mr() * 2 - 1) * (IX - 0.4), 0.15, ZB + 0.3 + mr() * (-ZB - 0.6))
        if (m) m.vy = 0.1
      }
    }
    // with every crack sealed, some still comes in by the hidden gaps (along the walls)
    if (needIn && !S.cracks.some(Boolean) && mr() < dt * 3) {
      spawn(CELLAR, (mr() < 0.5 ? -1 : 1) * (IX - 0.15), D.SLAB + 0.08, ZB + 0.4 + mr() * 3)
    }
    for (const m of M) {
      if (m.s === FREE) continue
      m.a = m.fade ? Math.max(0, m.a - dt * 1.6) : Math.min(1, m.a + dt * 1.8)
      if (m.fade && m.a <= 0) {
        m.s = FREE
        m.y = -10
        continue
      }
      if (m.s === SOIL) {
        m.y += m.vy * dt
        m.x += Math.sin(t * 1.3 + m.life * 3) * 0.05 * dt
        const underHouse = Math.abs(m.x) < IX - 0.05
        if (underHouse) {
          if (S.fan && m.y > D.ROCK - 0.1) m.s = SUMPED
          else if (m.y >= D.SLAB_B - 0.18) {
            const c = nearestCrack(m.x)
            if (needIn && c >= 0 && !m.fade) {
              m.s = CRACK
              m.k = c
            } else {
              m.vy = 0
              m.fade = 1
            }
          }
        } else if (m.y > -0.15) {
          m.vy = 0.1
          m.fade = 1
        }
      } else if (m.s === CRACK) {
        const cx = CRACKS[m.k]
        if (!S.cracks[m.k]) {
          m.fade = 1
          continue
        }
        if (Math.abs(m.x - cx) > 0.02 && m.y < D.SLAB_B) toward(m, dt, cx, D.SLAB_B - 0.08, 0.05, 0.6)
        else if (toward(m, dt, cx, D.SLAB + 0.12, -0.05, 0.35)) {
          m.s = CELLAR
          m.vz = -0.12
          m.vx = (mr() - 0.5) * 0.1
          m.life = 9 + mr() * 9
        }
      } else if (m.s === CELLAR) {
        wander(m, dt, -IX + 0.3, IX - 0.3, D.SLAB + 0.2, D.FLOOR_B - 0.35, ZB + 0.3, -0.3, 0.2)
        m.life -= dt
        if (m.life < 0 && !m.fade) {
          // a cellar atom goes (breaks apart, or is mixed away); with the fan on, down into the sump
          m.fade = 1
        }
      } else if (m.s === UP) {
        if (toward(m, dt, (D.HOLE.x0 + D.HOLE.x1) / 2, 0.35, (D.HOLE.z0 + D.HOLE.z1) / 2, 0.55)) {
          m.s = ROOM
          m.life = 9 + mr() * 9
          m.vy = 0.1
        }
      } else if (m.s === ROOM) {
        wander(m, dt, -IX + 0.3, IX - 0.3, 0.3, D.H - 0.3, ZB + 0.3, -0.35, 0.2)
        m.life -= dt
        if (m.life < 0 && !m.fade) {
          if (S.win && mr() < 0.6) m.s = TOWIN
          else m.fade = 1
        }
      } else if (m.s === TOWIN) {
        if (toward(m, dt, IX - 0.05, (D.WIN.y0 + D.WIN.y1) / 2 + (mr() - 0.5) * 0.3, (D.WIN.z0 + D.WIN.z1) / 2, 0.7)) {
          m.s = OUT
          m.vx = 0.45
          m.vy = 0.12
          m.vz = 0.08
          m.life = 3
        }
      } else if (m.s === OUT) {
        m.x += m.vx * dt
        m.y += m.vy * dt
        m.z += m.vz * dt
        m.life -= dt
        if (m.life < 1.2) m.fade = 1
      } else if (m.s === SUMPED) {
        if (!S.fan) {
          m.s = SOIL
          continue
        }
        // through the gravel under the slab to the sump
        const ty = Math.min(m.y + 0.2, SUMP.y)
        if (toward(m, dt, SUMP.x, Math.max(ty, Math.min(m.y, SUMP.y)), 0.05, 0.75) || Math.hypot(m.x - SUMP.x, m.y - SUMP.y) < 0.08) {
          m.s = PIPED
          m.u = 0
        }
      } else if (m.s === PIPED) {
        m.u += (1.5 / PIPE_LEN) * dt
        const [px, py] = pipeAt(Math.min(1, m.u))
        m.x = px
        m.y = py
        m.z = PIPE_Z - 0.03
        if (m.u >= 1) {
          m.s = PUFF
          m.vx = -0.35
          m.vy = 0.45
          m.vz = 0.1
          m.life = 3.2
        }
      } else if (m.s === PUFF) {
        m.x += m.vx * dt
        m.y += m.vy * dt
        m.z += m.vz * dt
        m.vy *= 1 - dt * 0.3
        m.life -= dt
        if (m.life < 1.4) m.fade = 1
      }
    }
    const cam = ctx.camera.position
    for (let i = 0; i < N; i++) {
      const m = M[i]
      mPos[i * 3] = m.x
      mPos[i * 3 + 1] = m.s === FREE ? -50 : m.y
      mPos[i * 3 + 2] = m.z
      // one right in front of the eye would fill the view: it fades there
      const near = Math.hypot(m.x - cam.x, m.y - cam.y, m.z - cam.z)
      const a = m.s === FREE ? 0 : m.a * clamp((near - 0.5) / 1.2)
      mCol[i * 4] = 1.5
      mCol[i * 4 + 1] = 1.5
      mCol[i * 4 + 2] = 1.5
      mCol[i * 4 + 3] = a
    }
    moteGeo.attributes.position.needsUpdate = true
    moteGeo.attributes.color.needsUpdate = true
  }
  // a few at the start, so the house is not empty on arrival
  for (let i = 0; i < (light ? 14 : 26); i++) {
    const m = spawn(CELLAR, (mr() * 2 - 1) * (IX - 0.4), D.SLAB + 0.3 + mr() * 1.4, ZB + 0.4 + mr() * 4)
    if (m) m.a = 1
  }
  for (let i = 0; i < (light ? 12 : 24); i++) {
    const m = spawn(ROOM, (mr() * 2 - 1) * (IX - 0.4), 0.4 + mr() * 1.9, ZB + 0.4 + mr() * 4)
    if (m) m.a = 1
  }
  for (let i = 0; i < (light ? 8 : 14); i++) {
    const m = spawn(SOIL, (mr() * 2 - 1) * 6.2, D.TRENCH.y + 0.2 + mr() * 1.8, 0.05)
    if (m) {
      m.a = 1
      m.vy = 0.17 + mr() * 0.08
    }
  }

  // ---- words on the cut: granite, soil ----
  for (const [s, y] of [[E.signs.granite, D.TRENCH.y + 0.4], [E.signs.soil, -1.0]]) {
    for (const x of [-5.4, 5.4]) {
      const tl = text(s, { size: 0.2, color: '#f2e9e0', outlineWidth: 0.012, outlineColor: '#1a1210', anchorX: 'center' })
      tl.position.set(x, y, 0.03)
      root.add(tl)
    }
  }

  // ======== station 1: the house breathes ========
  const stove = stage.stove
  const hood = stage.hood
  const win = stage.window
  const trap = stage.trapdoor
  let winK = 0
  let hoodK = 0
  let doorK = 1
  let stoveK = 1
  const tried = { window: false, hood: false, door: false, stove: false, temp: false }
  let lastTempSlide = -9
  let tempZone = 'frosty'
  const zoneOf = v => (v < 3 ? 'frosty' : v < 12 ? 'cool' : 'mild')

  // the outdoor thermometer, on the bridge's yard post
  const thermo = new THREE.Group()
  thermo.position.set(THERMO.x, THERMO.y, THERMO.z)
  root.add(thermo)
  thermo.add(mk(new RoundedBoxGeometry(0.2, 0.7, 0.04, 2, 0.02), std('#0f1530', { emissive: '#10173f', emissiveIntensity: 0.6 })))
  thermo.add(mk(new THREE.CylinderGeometry(0.016, 0.016, 0.5, 8), std('#e8eef8', { transparent: true, opacity: 0.6 }), 0, 0.02, 0.03))
  const bulbT = mk(new THREE.SphereGeometry(0.035, 12, 8), basic('#ff5a4a', { toneMapped: false }), 0, -0.25, 0.03)
  thermo.add(bulbT)
  const column = mk(new THREE.BoxGeometry(0.02, 1, 0.02), basic('#ff5a4a', { toneMapped: false }), 0, 0, 0.035)
  thermo.add(column)
  const tY = v => -0.23 + ((clamp(v, T_MIN, T_MAX) - T_MIN) / (T_MAX - T_MIN)) * 0.46
  for (const v of [-5, 0, 10, 20]) {
    thermo.add(mk(new THREE.BoxGeometry(0.04, 0.006, 0.01), basic('#9fb0d8'), -0.045, tY(v), 0.03))
  }
  const thermoNum = text('', { size: 0.1, color: '#ffd2c8', anchorY: 'bottom', outlineWidth: 0.006, outlineColor: '#0a0c18' })
  thermoNum.position.set(0, 0.38, 0.03)
  thermo.add(thermoNum)
  const thermoWord = text(E.signs.outside, { font: 'body', size: 0.06, color: '#cfe0ff', anchorY: 'top' })
  thermoWord.position.set(0, -0.31, 0.03)
  thermo.add(thermoWord)
  thermo.add(hitBox(0.3, 0.95, 0.15, 0, 0.05, 0))
  live(thermoNum, () => deg(S.tout))
  updates.push(() => {
    const top = tY(S.tout)
    const h = Math.max(0.01, top + 0.25)
    column.scale.y = h
    column.position.y = -0.25 + h / 2
  })

  // the warm air leaking out under the eaves, and the window's two streams: chevrons drifting along a path
  const chevGeo = keep(
    (() => {
      const s = new THREE.Shape()
      s.moveTo(-0.07, -0.09)
      s.lineTo(0.08, 0)
      s.lineTo(-0.07, 0.09)
      s.lineTo(-0.03, 0)
      s.closePath()
      return new THREE.ShapeGeometry(s)
    })(),
  )
  /** A stream of chevrons from a to b (in a plane facing +z unless `ry`), its strength set each frame. */
  function stream(a, b, c, { n = 4, speed = 0.5, size = 1, ry = 0 } = {}) {
    const g = new THREE.Group()
    const mat = basic(c, { transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    const items = Array.from({ length: n }, () => {
      const m = new THREE.Mesh(chevGeo, mat)
      m.scale.setScalar(size)
      m.raycast = () => {}
      g.add(m)
      return m
    })
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const dir = B.clone().sub(A)
    const ang = ry ? Math.atan2(dir.y, Math.hypot(dir.x, dir.z)) : Math.atan2(dir.y, dir.x)
    root.add(g)
    let k = 0
    return {
      set(v) {
        k = v
      },
      update(t) {
        mat.opacity = 0.85 * k
        g.visible = k > 0.01
        items.forEach((m, i) => {
          const u = (t * speed + i / n) % 1
          m.position.copy(A).lerp(B, u)
          m.rotation.set(0, ry, ang)
          m.scale.setScalar(size * Math.sin(u * Math.PI))
        })
      },
    }
  }
  const eaves = [
    stream([D.OX + 0.15, D.EAVE - 0.05, -0.25], [D.OX + 1.0, D.EAVE + 0.55, -0.25], '#ffa45a', { size: 1.4 }),
    stream([-D.OX - 0.25, D.EAVE - 0.05, -0.25], [-D.OX - 1.1, D.EAVE + 0.55, -0.25], '#ffa45a', { size: 1.4 }),
  ]
  const warmWord = text(E.signs.warm, { font: 'body', size: 0.12, color: '#ffc08a', anchorX: 'left', outlineWidth: 0.008, outlineColor: '#1a0f08' })
  warmWord.position.set(D.OX + 0.25, D.EAVE + 0.8, -0.2)
  root.add(warmWord)
  const winOut = stream([D.OX + 0.1, D.WIN.y1 - 0.25, (D.WIN.z0 + D.WIN.z1) / 2], [D.OX + 1.2, D.WIN.y1 + 0.2, -0.3], RN_GLOW, { size: 1.1 })
  const winIn = stream([D.OX + 1.2, D.WIN.y0 - 0.1, -0.3], [D.OX + 0.1, D.WIN.y0 + 0.25, (D.WIN.z0 + D.WIN.z1) / 2], '#b8d4ff', { size: 1.1 })
  const hoodAir = stream([D.COOKER.x, 2.3, D.COOKER.z + 0.05], [D.IX - 0.1, 2.3, D.COOKER.z + 0.05], '#dfe6f0', { size: 0.8, speed: 0.9 })
  updates.push((dt, t) => {
    const st = Math.max(0, stack(S.tout, tin))
    const k = clamp(st / 2.3) * (S.win ? 0.5 : 1)
    eaves.forEach(e => {
      e.set(k)
      e.update(t)
    })
    warmWord.fillOpacity = k
    warmWord.outlineOpacity = k
    warmWord.visible = k > 0.03
    winOut.set(winK)
    winOut.update(t)
    winIn.set(winK)
    winIn.update(t)
    hoodAir.set(hoodK)
    hoodAir.update(t)
  })

  const housePanel = lv => {
    const L = target()
    const B = E.house.buttons
    return {
      title: E.house.title,
      color: RN,
      blocks: [
        ...paras(E.house.panel[depth(lv)]),
        { big: `${bq(shown.room)} Bq/m³`, small: E.house.small },
        lv === 'scientist' && {
          rows: [
            [E.house.rows.inside, deg(tin)],
            [E.house.rows.outside, deg(S.tout)],
            [E.house.rows.pull, `${num(Math.max(0, L.pull), 1, lang)} Pa`],
            [E.house.rows.cellar, `${bq(shown.cellar)} Bq/m³`],
            [E.house.rows.room, `${bq(shown.room)} Bq/m³`],
          ],
        },
        { p: E.house.tip },
        {
          slider: {
            label: E.house.temp,
            min: T_MIN,
            max: T_MAX,
            step: 1,
            value: S.tout,
            onInput: v => setTemp(v, true),
            format: v => deg(v),
            live: () => S.tout,
          },
        },
        {
          buttons: [
            { label: S.win ? B.winShut : B.winOpen, onClick: () => tapWindow() },
            { label: S.hood ? B.hoodOff : B.hoodOn, onClick: () => tapHood() },
            { label: S.door ? B.doorShut : B.doorOpen, onClick: () => tapDoor() },
            { label: S.stove ? B.stoveOff : B.stoveOn, onClick: () => tapStove() },
          ],
        },
      ].filter(Boolean),
    }
  }
  const houseDone = (line, delay = 3.2) => {
    say(line)
    ex.discover('house', housePanel, delay)
    share('house')
    later(0.05, () => refresh(housePanel))
  }
  function tapWindow() {
    S.win = S.win ? 0 : 1
    tried.window = true
    play(S.win ? 'select' : 'tap')
    houseDone(at(S.win ? E.house.says.winOpen : E.house.says.winShut, level()))
    refresh(fixPanel)
  }
  function tapHood() {
    S.hood = S.hood ? 0 : 1
    tried.hood = true
    play(S.hood ? 'beam' : 'tap')
    houseDone(at(S.hood ? E.house.says.hoodOn : E.house.says.hoodOff, level()))
  }
  function tapDoor() {
    S.door = S.door ? 0 : 1
    tried.door = true
    play('tap')
    houseDone(at(S.door ? E.house.says.doorOpen : E.house.says.doorShut, level()))
  }
  function tapStove() {
    S.stove = S.stove ? 0 : 1
    tried.stove = true
    play(S.stove ? 'select' : 'tap')
    houseDone(at(S.stove ? E.house.says.stoveOn : E.house.says.stoveOff, level()))
  }
  let sliding = false
  function setTemp(v, byHand) {
    S.tout = clamp(Math.round(v), T_MIN, T_MAX)
    tried.temp = true
    lastTempSlide = now()
    if (byHand && !sliding) {
      sliding = true
      later(0.25, () => {
        sliding = false
        share('house')
      })
    }
  }
  function tapThermo() {
    // a frosty night, a cool one, a mild one
    const next = S.tout < 3 ? 8 : S.tout < 12 ? 16 : T_START
    setTemp(next, false)
    play('select')
    tempZone = zoneOf(S.tout)
    houseDone(at(E.house.says[tempZone], level()))
  }
  clickable(win.group, tapWindow, { reach: 12 })
  clickable(hood.group, tapHood, { reach: 12 })
  clickable(trap.group, tapDoor, { reach: 12 })
  clickable(stove.group, tapStove, { reach: 12 })
  clickable(thermo, tapThermo, { reach: 7 })
  ex.add({
    id: 'house',
    x: 0.4,
    z: 4.05,
    radius: 1.15,
    manual: true,
    label: E.house.label,
    // each thing tried in turn; the window and the extractor are shut again first, so the next change shows
    verb: () =>
      !tried.window || S.win
        ? E.house.verbWindow
        : !tried.hood || S.hood
          ? E.house.verbHood
          : !tried.door
            ? E.house.verbDoor
            : !tried.stove
              ? E.house.verbStove
              : !tried.temp
                ? E.house.verbTemp
                : E.house.verbMore,
    focus: { x: 0.4, y: -0.9, z: -1.6, size: 5.4, width: 6.0 },
    act: () => ctx.showPanel(housePanel),
  })
  updates.push((dt, t) => {
    // the house's own temperature follows the stove slowly
    tin = damp(tin, tinOf(S), 0.45, dt)
    const L = target()
    shown.room = damp(shown.room, L.room, 0.55, dt)
    shown.cellar = damp(shown.cellar, L.cellar, 0.55, dt)
    shown.pull = L.pull
    winK = damp(winK, S.win, 3, dt)
    hoodK = damp(hoodK, S.hood, 3, dt)
    doorK = damp(doorK, S.door, 3, dt)
    stoveK = damp(stoveK, S.stove, 2, dt)
    win.setOpen(ease(winK))
    trap.setOpen(ease(doorK))
    hood.setOn(hoodK)
    stove.setLit(stoveK)
    stage.setSmoke(stoveK)
    stage.setFrost(clamp((4 - S.tout) / 6) * 0.85)
    // the Atomling says what the night is like once the slider rests in a new zone
    if (tried.temp && now() - lastTempSlide > 0.8 && lastTempSlide > 0) {
      const z = zoneOf(S.tout)
      if (z !== tempZone) {
        tempZone = z
        say(at(E.house.says[z], level()))
        ex.discover('house', housePanel, 3)
      }
    }
  })
  // the panel's big number follows the monitor while it is open
  let panelT = 0
  updates.push((dt) => {
    panelT -= dt
    if (panelT > 0) return
    panelT = 0.6
    refresh(housePanel)
    refresh(fixPanel)
  })
  const houseState = () => ({ t: S.tout, st: S.stove, w: S.win, h: S.hood, d: S.door })
  const houseSet = (s, liveSet) => {
    const t = Number(s?.t)
    if (Number.isFinite(t)) S.tout = clamp(Math.round(t), T_MIN, T_MAX)
    tempZone = zoneOf(S.tout)
    const w = s?.w ? 1 : 0
    if (liveSet && w !== S.win) play('tap')
    S.win = w
    S.hood = s?.h ? 1 : 0
    S.door = s?.d ? 1 : 0
    S.stove = s?.st ? 1 : 0
    if (!liveSet) {
      tin = tinOf(S)
      winK = S.win
      hoodK = S.hood
      doorK = S.door
      stoveK = S.stove
    }
  }

  // ======== station 2: the detector kit ========
  const kit = { open: 0, months: 0, exp: 0, sent: 0, counted: 0 }
  let lidK = 0
  let labT = 99 // seconds since it was sent (the etching shown first)
  let countT = 99 // seconds since the count began
  let freshT = 99
  const avg = () => (kit.months > 0.01 ? kit.exp / kit.months : 0)
  const tracksOf = () => Math.min(MAX_PITS, Math.round(kit.exp / PITS_PER))
  // the detector: a dark base, a cream lid, a soft gold ring round it on the sideboard
  const det = new THREE.Group()
  det.position.set(KIT.x, KIT.y, KIT.z)
  root.add(det)
  const detBase = mk(new THREE.CylinderGeometry(0.06, 0.062, 0.03, 24), std('#2c3242', { roughness: 0.4 }), 0, 0.015, 0)
  det.add(detBase)
  const chip = mk(new THREE.BoxGeometry(0.045, 0.004, 0.045), std('#cfe8ff', { transparent: true, opacity: 0.85, roughness: 0.1, emissive: '#5a7aa0', emissiveIntensity: 0.3 }), 0, 0.032, 0)
  det.add(chip)
  const lidPivot = new THREE.Group()
  lidPivot.position.set(-0.06, 0.03, 0)
  const lid = new THREE.Group()
  lid.add(mk(new THREE.CylinderGeometry(0.06, 0.06, 0.018, 24), std('#e7e2d6', { roughness: 0.4 }), 0.06, 0.009, 0))
  lid.add(mk(new THREE.CylinderGeometry(0.024, 0.024, 0.02, 16), std('#2c3242'), 0.06, 0.012, 0))
  lidPivot.add(lid)
  det.add(lidPivot)
  const ringMat = basic(GOLD, { transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false })
  const ring = mk(new THREE.RingGeometry(0.075, 0.1, 32), ringMat, 0, 0.002, 0)
  ring.rotation.x = -Math.PI / 2
  det.add(ring)
  det.add(hitBox(0.24, 0.16, 0.24, 0, 0.06, 0))
  // the envelope, leaning on the wall
  const env = new THREE.Group()
  env.position.set(ENVELOPE.x, D.SIDEBOARD.h, ENVELOPE.z)
  root.add(env)
  const envTex = keep(
    canvasTex(256, 176, g => {
      g.fillStyle = '#f3efe4'
      g.fillRect(0, 0, 256, 176)
      g.strokeStyle = '#cfc6b2'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(0, 0)
      g.lineTo(128, 92)
      g.lineTo(256, 0)
      g.stroke()
      g.fillStyle = '#c84a3a'
      g.fillRect(196, 14, 44, 50)
      g.fillStyle = '#3a4a7a'
      g.font = '700 26px Outfit, sans-serif'
      g.textAlign = 'center'
      g.fillText(E.signs.toLab, 128, 146)
    }),
  )
  const envMesh = mk(new THREE.PlaneGeometry(0.22, 0.15), std('#ffffff', { map: envTex, roughness: 0.8 }), 0, 0.075, 0)
  envMesh.rotation.set(0, Math.PI / 2, 0)
  const envTilt = new THREE.Group()
  envTilt.rotation.z = 0.18
  envTilt.add(envMesh)
  env.add(envTilt)
  env.add(hitBox(0.12, 0.22, 0.28, 0.02, 0.09, 0))
  // the monitor: a little white box whose screen shows the living room's level and its temperature
  const mon = new THREE.Group()
  mon.position.set(MONITOR.x, D.SIDEBOARD.h, MONITOR.z)
  root.add(mon)
  const monBody = mk(new RoundedBoxGeometry(0.1, 0.17, 0.22, 2, 0.02), std('#eeeae2', { roughness: 0.35 }), 0, 0.085, 0)
  mon.add(monBody)
  const monTex = keep(canvasTex(256, 160, () => {}))
  const monScreen = mk(new THREE.PlaneGeometry(0.18, 0.112), basic('#ffffff', { map: monTex, toneMapped: false }), 0.051, 0.095, 0)
  monScreen.rotation.y = Math.PI / 2
  mon.add(monScreen)
  let monDrawn = ''
  function drawMonitor() {
    const v = bq(shown.room)
    const tt = deg(tin)
    const key = `${v}|${tt}`
    if (key === monDrawn) return
    monDrawn = key
    monTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1530'
      g.fillRect(0, 0, w, h)
      const r = shown.room
      g.fillStyle = r < 100 ? '#7fe0a0' : r < 300 ? '#ffd27a' : '#ffa07a'
      g.font = '700 74px Outfit, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.fillText(v, w / 2, 92)
      g.fillStyle = '#cfe0ff'
      g.font = '700 26px Outfit, sans-serif'
      g.fillText('Bq/m³', w / 2, 124)
      g.fillStyle = '#9fb0d8'
      g.font = '500 22px Outfit, sans-serif'
      g.fillText(`${E.house.inside} ${tt}`, w / 2, 152)
    })
  }
  let monT = 0
  updates.push(dt => {
    monT -= dt
    if (monT <= 0) {
      monT = 0.25
      drawMonitor()
    }
  })
  // the lens over the sideboard: inside the detector at home, the lab's etching and microscope afterwards
  const LW = light ? 256 : 512
  const lensTex = keep(canvasTex(LW, LW, () => {}, { mipmaps: false }))
  const lens = new THREE.Group()
  lens.position.set(LENS.x, LENS.y, LENS.z)
  lens.rotation.y = Math.PI / 2 + 0.2
  root.add(lens)
  lens.add(mk(new THREE.CircleGeometry(LENS.r, 48), basic('#ffffff', { map: lensTex, toneMapped: false })))
  lens.add(mk(new THREE.TorusGeometry(LENS.r, 0.025, 8, 56), std('#c9a45a', { metalness: 0.6, roughness: 0.35, emissive: '#5a4318', emissiveIntensity: 0.4 })))
  const lensCap = text('', { font: 'body', size: 0.055, color: '#e6f4ff', anchorY: 'top', maxWidth: 1.0, outlineWidth: 0.005, outlineColor: '#0a0c18' })
  lensCap.position.set(0, -LENS.r - 0.05, 0.01)
  lens.add(lensCap)
  lens.add(hitBox(LENS.r * 2, LENS.r * 2, 0.06, 0, 0, 0))
  let lensK = 0
  // the alphas flying in the lens: { x0, y0, x1, y1, t }
  const flights = []
  const lensAtoms = Array.from({ length: 7 }, (_, i) => ({ x: (mr() - 0.5) * 0.6, y: 0.1 + mr() * 0.45, vx: (mr() - 0.5) * 0.12, vy: (mr() - 0.5) * 0.12, ph: i }))
  let flightT = 0
  // where each track or pit lies on the chip, the same for everyone (a hash of its number)
  const hash = (j, k = 0) => {
    let h = (j * 374761393 + k * 668265263 + 2246822519) >>> 0
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  const lensMode = () => (!kit.sent ? 'home' : labT < 3.4 ? 'etch' : 'scope')
  function drawLens(t) {
    const W = LW
    const c = W / 2
    const R = W / 2
    lensTex.userData.redraw(g => {
      g.save()
      g.clearRect(0, 0, W, W)
      g.beginPath()
      g.arc(c, c, R, 0, TAU)
      g.clip()
      const mode = lensMode()
      const font = s => `700 ${Math.round(s * W)}px Outfit, sans-serif`
      if (mode === 'home') {
        // inside the detector, cut open: the dome of the lid, the chamber's air, the chip on the floor
        g.fillStyle = '#0d1636'
        g.fillRect(0, 0, W, W)
        const X = v => c + v * R
        const Y = v => c - v * R
        g.strokeStyle = '#e7e2d6'
        g.lineWidth = W * 0.03
        g.beginPath()
        g.ellipse(c, Y(-0.45), R * 0.82, R * 0.98, 0, Math.PI, 0)
        g.stroke()
        // the gap the gas comes in by
        g.strokeStyle = '#0d1636'
        g.lineWidth = W * 0.04
        g.beginPath()
        g.moveTo(X(-0.86), Y(-0.45))
        g.lineTo(X(-0.76), Y(-0.45))
        g.stroke()
        // the chip
        const cy = Y(-0.5)
        g.fillStyle = 'rgba(190,225,255,0.85)'
        g.fillRect(X(-0.55), cy, R * 1.1, R * 0.16)
        g.fillStyle = 'rgba(255,255,255,0.35)'
        g.fillRect(X(-0.55), cy, R * 1.1, R * 0.03)
        // the tracks: thin dark scratches going into the chip
        const n = tracksOf()
        g.strokeStyle = 'rgba(40,50,80,0.75)'
        g.lineWidth = Math.max(1, W * 0.004)
        for (let j = 0; j < n; j++) {
          const x = X(-0.52 + hash(j) * 1.04)
          const a = (hash(j, 1) - 0.5) * 1.2
          const l = R * (0.05 + hash(j, 2) * 0.07)
          g.beginPath()
          g.moveTo(x, cy)
          g.lineTo(x + Math.sin(a) * l, cy + Math.cos(a) * l)
          g.stroke()
        }
        // radon atoms drifting in the chamber
        for (const a of lensAtoms) {
          const x = X(a.x)
          const y = Y(a.y)
          const halo = g.createRadialGradient(x, y, 0, x, y, R * 0.12)
          halo.addColorStop(0, 'rgba(111,240,255,0.5)')
          halo.addColorStop(1, 'rgba(111,240,255,0)')
          g.fillStyle = halo
          g.fillRect(x - R * 0.12, y - R * 0.12, R * 0.24, R * 0.24)
          g.fillStyle = RN
          g.beginPath()
          g.arc(x, y, R * 0.045, 0, TAU)
          g.fill()
        }
        // alphas: a bright pair of protons and neutrons streaking to the chip
        for (const f of flights) {
          const u = clamp(f.t / 0.35)
          const x = X(f.x0 + (f.x1 - f.x0) * u)
          const y = Y(f.y0 + (f.y1 - f.y0) * u)
          g.strokeStyle = 'rgba(255,214,150,0.6)'
          g.lineWidth = W * 0.008
          g.beginPath()
          g.moveTo(X(f.x0 + (f.x1 - f.x0) * Math.max(0, u - 0.3)), Y(f.y0 + (f.y1 - f.y0) * Math.max(0, u - 0.3)))
          g.lineTo(x, y)
          g.stroke()
          for (const [dx, dy, col] of [[-1, -1, '#ff4d4d'], [1, -1, '#9aa3b8'], [-1, 1, '#9aa3b8'], [1, 1, '#ff4d4d']]) {
            g.fillStyle = col
            g.beginPath()
            g.arc(x + dx * W * 0.008, y + dy * W * 0.008, W * 0.01, 0, TAU)
            g.fill()
          }
          if (f.t < 0.12) {
            g.fillStyle = `rgba(255,255,220,${0.8 * (1 - f.t / 0.12)})`
            g.beginPath()
            g.arc(X(f.x0), Y(f.y0), W * 0.04, 0, TAU)
            g.fill()
          }
        }
        g.fillStyle = '#cfe0ff'
        g.font = font(0.05)
        g.textAlign = 'center'
        g.fillText(E.kit.lens.inside, c, Y(0.66))
        g.fillStyle = '#bfe0ff'
        g.font = font(0.05)
        g.fillText(E.kit.lens.chip, c, Y(-0.8))
        // the tracks are drawn, but in the plastic they are far too small to see
        g.fillStyle = 'rgba(207,224,255,0.75)'
        g.font = font(0.036)
        g.fillText(E.kit.lens.hidden, c, Y(-0.33))
      } else if (mode === 'etch') {
        // the lab: the chip in a beaker of hot sodium hydroxide on a hot plate, hours going by
        g.fillStyle = '#1a2440'
        g.fillRect(0, 0, W, W)
        const u = clamp(labT / 3.4)
        g.fillStyle = `rgba(255,${120 + 40 * Math.sin(t * 6)},60,0.9)`
        g.fillRect(c - R * 0.55, c + R * 0.55, R * 1.1, R * 0.1)
        g.fillStyle = '#3a3d44'
        g.fillRect(c - R * 0.6, c + R * 0.65, R * 1.2, R * 0.16)
        g.fillStyle = 'rgba(200,225,255,0.25)'
        g.fillRect(c - R * 0.42, c - R * 0.1, R * 0.84, R * 0.64)
        g.strokeStyle = '#dfefff'
        g.lineWidth = W * 0.012
        g.beginPath()
        g.moveTo(c - R * 0.46, c - R * 0.4)
        g.lineTo(c - R * 0.42, c + R * 0.55)
        g.lineTo(c + R * 0.42, c + R * 0.55)
        g.lineTo(c + R * 0.46, c - R * 0.4)
        g.stroke()
        // bubbles
        for (let j = 0; j < 10; j++) {
          const bx = c + (hash(j, 7) - 0.5) * R * 0.7
          const by = c + R * 0.5 - ((t * 0.5 + hash(j, 8)) % 1) * R * 0.6
          g.strokeStyle = 'rgba(230,245,255,0.7)'
          g.lineWidth = 2
          g.beginPath()
          g.arc(bx, by, R * 0.02, 0, TAU)
          g.stroke()
        }
        // the chip on its wire
        g.strokeStyle = '#c0c6d0'
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(c, c - R * 0.7)
        g.lineTo(c, c + R * 0.1)
        g.stroke()
        g.fillStyle = 'rgba(190,225,255,0.9)'
        g.fillRect(c - R * 0.12, c + R * 0.1, R * 0.24, R * 0.18)
        // a clock running through the hours
        const kx = c + R * 0.6
        const ky = c - R * 0.3
        g.fillStyle = '#f3efe4'
        g.beginPath()
        g.arc(kx, ky, R * 0.17, 0, TAU)
        g.fill()
        g.strokeStyle = '#1a2440'
        g.lineWidth = W * 0.01
        g.beginPath()
        g.moveTo(kx, ky)
        const ha = u * TAU * 4
        g.lineTo(kx + Math.sin(ha) * R * 0.12, ky - Math.cos(ha) * R * 0.12)
        g.stroke()
        g.fillStyle = '#ffd2a0'
        g.font = font(0.05)
        g.textAlign = 'center'
        g.fillText(E.kit.lens.etch, c, c - R * 0.66)
        g.fillStyle = '#cfe0ff'
        g.font = font(0.042)
        g.fillText(E.kit.lens.hours, kx, ky + R * 0.26)
      } else {
        // under the microscope: the chip's face lit from below, every track now a dark pit
        const grd = g.createRadialGradient(c, c, 0, c, c, R)
        grd.addColorStop(0, '#e8eef6')
        grd.addColorStop(0.85, '#c4cedc')
        grd.addColorStop(1, '#6a7488')
        g.fillStyle = grd
        g.fillRect(0, 0, W, W)
        const n = tracksOf()
        const done = kit.counted ? Math.min(n, Math.floor((countT / 2.4) * n)) : 0
        for (let j = 0; j < n; j++) {
          const rr = Math.sqrt(hash(j, 3)) * R * 0.82
          const a = hash(j, 4) * TAU
          const x = c + Math.cos(a) * rr
          const y = c + Math.sin(a) * rr
          const s = R * (0.03 + hash(j, 5) * 0.02)
          g.fillStyle = '#2a2f3e'
          g.beginPath()
          g.ellipse(x, y, s * (1 + hash(j, 6) * 0.6), s, hash(j, 1) * Math.PI, 0, TAU)
          g.fill()
          g.fillStyle = 'rgba(150,160,182,0.9)'
          g.beginPath()
          g.ellipse(x, y, s * 0.55 * (1 + hash(j, 6) * 0.6), s * 0.55, hash(j, 1) * Math.PI, 0, TAU)
          g.fill()
          g.fillStyle = 'rgba(245,248,255,0.95)'
          g.beginPath()
          g.arc(x, y, s * 0.16, 0, TAU)
          g.fill()
          if (j < done) {
            g.strokeStyle = '#2fb86a'
            g.lineWidth = W * 0.006
            g.beginPath()
            g.arc(x, y, s * 1.9, 0, TAU)
            g.stroke()
          }
        }
        if (!kit.counted) {
          g.fillStyle = 'rgba(13,22,54,0.75)'
          g.fillRect(c - R * 0.5, c + R * 0.62, R, R * 0.17)
          g.fillStyle = '#ffffff'
          g.font = font(0.055)
          g.textAlign = 'center'
          g.fillText(E.kit.lens.tap, c, c + R * 0.75)
        }
      }
      g.restore()
    })
  }
  const lensText = () => {
    const mode = lensMode()
    if (mode === 'home') return `${plural(E.kit.month, kit.months)} · ${fill(E.kit.lens.tracks, { n: tracksOf() })}`
    if (mode === 'etch') return E.kit.lens.etch
    if (!kit.counted) return E.kit.lens.field
    const n = Math.min(tracksOf(), Math.floor((countT / 2.4) * tracksOf()))
    return countT < 2.4 ? fill(E.kit.lens.counted, { n }) : `${fill(E.kit.lens.counted, { n: tracksOf() })}\n${fill(E.kit.lens.result, { bq: bq(avg()) })}`
  }
  live(lensCap, () => (lensK > 0.3 ? lensText() : ''))
  // the scale board on the wall: 0 to 1000 Bq/m3, the WHO's 100 and Portugal's 300, the house's average
  const scaleTex = keep(canvasTex(256, 704, () => {}))
  const scale = new THREE.Group()
  scale.position.set(SCALE.x, SCALE.y, SCALE.z)
  scale.rotation.y = Math.PI / 2
  root.add(scale)
  scale.add(mk(new RoundedBoxGeometry(SCALE.w + 0.05, SCALE.h + 0.05, 0.03, 2, 0.015), std(GOLD, { emissive: GOLD, emissiveIntensity: 0.35 })))
  scale.add(mk(new THREE.PlaneGeometry(SCALE.w, SCALE.h), basic('#ffffff', { map: scaleTex, toneMapped: false }), 0, 0, 0.017))
  scale.add(hitBox(SCALE.w, SCALE.h, 0.08, 0, 0, 0))
  let scaleDrawn = ''
  function drawScale() {
    const nowV = Math.round(shown.room / 10) * 10
    const res = kit.counted && countT >= 2.4 ? Math.round(avg()) : -1
    const key = `${nowV}|${res}`
    if (key === scaleDrawn) return
    scaleDrawn = key
    scaleTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const top = 70
      const bot = h - 40
      const yOf = v => bot - (clamp(v, 0, 1000) / 1000) * (bot - top)
      const bx = 70
      const bw = 34
      // calm colour bands: under 100, 100 to 300, above 300
      for (const [a, b, col] of [[0, 100, '#2f8f5a'], [100, 300, '#b88a2e'], [300, 1000, '#9a5a46']]) {
        g.fillStyle = col
        g.fillRect(bx, yOf(b), bw, yOf(a) - yOf(b))
      }
      g.fillStyle = '#e8eeff'
      g.font = '700 30px Outfit, sans-serif'
      g.textAlign = 'center'
      g.fillText(E.kit.scale.title, w / 2, 44)
      g.textAlign = 'left'
      g.font = '700 20px Outfit, sans-serif'
      for (const [v, s, col] of [[10, E.kit.scale.out, '#cfe0ff'], [100, E.kit.scale.who, '#9ff0c0'], [300, E.kit.scale.pt, '#ffd27a']]) {
        g.fillStyle = col
        g.fillRect(bx - 8, yOf(v) - 1.5, bw + 16, 3)
        g.fillText(s, bx + bw + 14, yOf(v) + 7)
      }
      g.fillStyle = '#9fb0d8'
      g.font = '500 18px Outfit, sans-serif'
      for (const v of [0, 500, 1000]) g.fillText(v === 1000 ? '1000+' : String(v), 8, yOf(v) + 6)
      // the monitor now: a small teal mark
      g.fillStyle = RN_GLOW
      g.beginPath()
      g.moveTo(bx - 4, yOf(nowV))
      g.lineTo(bx - 20, yOf(nowV) - 9)
      g.lineTo(bx - 20, yOf(nowV) + 9)
      g.fill()
      // the house's average, once counted
      if (res >= 0) {
        g.fillStyle = GOLD
        g.fillRect(bx - 6, yOf(res) - 4, bw + 12, 8)
        // its words above the marker, clear of the fixed lines' labels
        let ty = yOf(res) - 12
        for (const v of [10, 100, 300]) if (Math.abs(yOf(v) - ty - 24) < 34) ty = Math.min(ty, yOf(v) - 50)
        g.font = '700 24px Outfit, sans-serif'
        g.fillText(`${bq(res)}`, bx + bw + 14, ty)
        g.font = '500 18px Outfit, sans-serif'
        g.fillText(E.kit.scale.house, bx + bw + 14, ty + 24)
      }
      g.fillStyle = RN_GLOW
      g.font = '500 16px Outfit, sans-serif'
      g.fillText(E.kit.scale.now, 8, h - 12)
    })
  }
  let scaleT = 0
  updates.push(dt => {
    scaleT -= dt
    if (scaleT <= 0) {
      scaleT = 0.3
      drawScale()
    }
  })

  const kitPanel = lv => {
    const B = E.kit.buttons
    return {
      title: E.kit.title,
      color: GOLD,
      blocks: [
        ...paras(E.kit.panel[depth(lv)]),
        kit.counted && { big: `${bq(avg())} Bq/m³`, small: fill(E.kit.lens.counted, { n: tracksOf() }) },
        { p: E.kit.tip },
        !kit.sent && {
          slider: {
            label: E.kit.months,
            min: 0,
            max: 3,
            step: 0.1,
            value: kit.months,
            onInput: v => setMonths(v, true),
            format: v => plural(E.kit.month, v),
            live: () => kit.months,
          },
        },
        {
          buttons: [
            !kit.sent && { label: kit.open ? B.close : B.open, onClick: () => tapDetector() },
            !kit.sent && { label: B.send, onClick: () => tapEnvelope() },
            kit.sent && !kit.counted && { label: B.count, onClick: () => tapLens() },
            kit.sent && { label: B.again, onClick: () => newDetector(true) },
          ].filter(Boolean),
        },
      ].filter(Boolean),
    }
  }
  let kitSliding = false
  const kitDone = (line, delay = 3) => {
    say(line)
    ex.discover('kit', kitPanel, delay)
    share('kit')
    later(0.05, () => refresh(kitPanel))
  }
  function setMonths(v, byHand) {
    const m = clamp(Math.round(v * 100) / 100, 0, 3)
    if (kit.sent) return
    if (m > kit.months) kit.exp += steady() * (m - kit.months)
    else if (kit.months > 0) kit.exp *= m / kit.months
    kit.months = m
    if (byHand && !kitSliding) {
      kitSliding = true
      later(0.25, () => {
        kitSliding = false
        share('kit')
      })
    }
  }
  function tapDetector() {
    if (kit.sent) {
      newDetector(true)
      return
    }
    kit.open = kit.open ? 0 : 1
    play(kit.open ? 'select' : 'tap')
    kitDone(at(kit.open ? E.kit.says.open : E.kit.says.close, level()), 3.5)
  }
  function tapEnvelope() {
    if (kit.sent) return
    // it stays its three months first (the months run on to three at once)
    if (kit.months < 3) setMonths(3, false)
    kit.sent = 1
    kit.open = 0
    labT = 0
    play('beam')
    kitDone(at(E.kit.says.sent, level()), 4)
    later(3.6, () => {
      if (kit.sent && !kit.counted) say(at(E.kit.says.etched, level()))
    })
  }
  function tapLens() {
    if (!kit.sent) {
      tapDetector()
      return
    }
    if (kit.counted) return
    if (labT < 3.4) labT = 3.4
    kit.counted = 1
    countT = 0
    play('select')
    share('kit')
    later(2.6, () => {
      const v = avg()
      const which = v >= 300 ? 'high' : v >= 100 ? 'mid' : 'low'
      say(fill(at(E.kit.says[which], level()), { pits: plural(E.kit.pits, tracksOf()), bq: bq(v) }))
      play('discover')
      ex.discover('kit', kitPanel, 1.5)
      refresh(kitPanel)
    })
  }
  function newDetector(byHand) {
    Object.assign(kit, { open: 1, months: 0, exp: 0, sent: 0, counted: 0 })
    labT = 99
    countT = 99
    freshT = 0
    if (byHand) {
      play('select')
      kitDone(at(E.kit.says.again, level()), 3)
    }
  }
  clickable(det, tapDetector, { reach: 4.5 })
  clickable(env, tapEnvelope, { when: () => !kit.sent, reach: 4.5 })
  clickable(lens, tapLens, { when: () => lensK > 0.5, reach: 4.5 })
  ex.add({
    id: 'kit',
    x: -2.15,
    z: -1.95,
    radius: 1.5,
    manual: true,
    label: E.kit.label,
    verb: () => (!kit.open && !kit.sent ? E.kit.verbOpen : !kit.sent ? E.kit.verbSend : !kit.counted ? E.kit.verbCount : E.kit.verbAgain),
    focus: { x: -3.2, y: 1.36, z: -2.3, size: 2.0, width: 2.2 },
    act: () => ctx.showPanel(kitPanel),
  })
  let lensDrawT = 0
  updates.push((dt, t) => {
    labT += dt
    countT += dt
    freshT += dt
    const showLens = kit.open || kit.sent
    lensK = damp(lensK, showLens ? 1 : 0, 6, dt)
    lens.visible = lensK > 0.02
    lens.scale.setScalar(Math.max(0.01, lensK))
    lens.position.y = LENS.y + Math.sin(t * 1.2) * 0.02
    // the detector: the lid lifts while open; away at the lab once sent; a fresh one pops up
    lidK = damp(lidK, kit.open ? 1 : 0, 6, dt)
    lidPivot.rotation.z = lidK * 1.9
    det.visible = !kit.sent || !!kit.counted
    const pop = kit.counted ? clamp(countT * 2) : 1
    det.scale.setScalar(Math.max(0.01, ease(pop) * (freshT < 0.5 ? 0.6 + 0.4 * ease(freshT * 2) : 1)))
    env.visible = !kit.sent
    ringMat.opacity = 0.35 + 0.2 * Math.sin(t * 2.4)
    // the lens's own life: atoms drift, now and then one breaks apart and its alpha hits the chip
    if (lens.visible) {
      for (const a of lensAtoms) {
        a.x += a.vx * dt
        a.y += a.vy * dt
        if (Math.abs(a.x) > 0.6) a.vx = -Math.sign(a.x) * Math.abs(a.vx)
        if (a.y < 0.0 || a.y > 0.6) a.vy = -Math.sign(a.y - 0.3) * Math.abs(a.vy)
      }
      if (!kit.sent) {
        flightT -= dt
        if (flightT <= 0) {
          flightT = 0.7 + mr() * 0.6
          const a = lensAtoms[Math.floor(mr() * lensAtoms.length)]
          flights.push({ x0: a.x, y0: a.y, x1: clamp(a.x + (mr() - 0.5) * 0.3, -0.5, 0.5), y1: -0.5, t: 0 })
          a.x = -0.8
          a.y = -0.4
          a.vx = 0.1
          a.vy = 0.08
        }
      }
      for (let i = flights.length - 1; i >= 0; i--) {
        flights[i].t += dt
        if (flights[i].t > 0.4) flights.splice(i, 1)
      }
      lensDrawT -= dt
      if (lensDrawT <= 0) {
        lensDrawT = light ? 0.08 : 0.05
        drawLens(t)
      }
    }
  })
  const kitState = () => ({ o: kit.open, m: kit.months, e: Math.round(kit.exp), s: kit.sent, n: kit.counted })
  const kitSet = (s, liveSet) => {
    const sent = s?.s ? 1 : 0
    const counted = s?.n ? 1 : 0
    if (!sent && kit.sent) {
      freshT = liveSet ? 0 : 99
    }
    kit.open = s?.o ? 1 : 0
    const m = Number(s?.m)
    kit.months = Number.isFinite(m) ? clamp(m, 0, 3) : 0
    const e = Number(s?.e)
    kit.exp = Number.isFinite(e) ? Math.max(0, e) : 0
    if (sent && !kit.sent) labT = liveSet ? 0 : 99
    if (!sent) labT = 99
    if (counted && !kit.counted) countT = liveSet ? 0 : 99
    if (!counted) countT = 99
    kit.sent = sent
    kit.counted = counted
  }

  // ======== station 3: the fix ========
  // the cracks: a jagged line on the slab from its cut edge back, a notch through the slab's edge
  const crackMat = basic('#141012', { side: THREE.DoubleSide })
  const sealMat = std('#9a9690', { roughness: 0.6 })
  const crackPts = CRACKS.map((cx, i) => {
    const r = random(40 + i)
    const pts = []
    const n = 9
    for (let k = 0; k <= n; k++) {
      const z = -0.01 - (k / n) * CRACK_LEN
      pts.push(new THREE.Vector3(cx + (k ? (r() - 0.5) * 0.12 + Math.sin(k * 1.7 + i) * 0.04 : 0), D.SLAB + 0.004, z))
    }
    return pts
  })
  const seals = []
  const trowels = []
  const crackHits = []
  CRACKS.forEach((cx, i) => {
    const pts = crackPts[i]
    // the dark line, as a thin ribbon
    const pos = []
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k]
      const b = pts[k + 1]
      const w = 0.03 * (1 - k / pts.length) + 0.008
      pos.push(a.x - w, a.y, a.z, a.x + w, a.y, a.z, b.x - w, b.y, b.z, b.x - w, b.y, b.z, a.x + w, a.y, a.z, b.x + w, b.y, b.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    const line = new THREE.Mesh(keep(geo), crackMat)
    line.raycast = () => {}
    root.add(line)
    // the notch through the slab's cut edge
    const notch = new THREE.Shape()
    notch.moveTo(cx - 0.035, D.SLAB)
    notch.lineTo(cx + 0.035, D.SLAB)
    notch.lineTo(cx + 0.01, D.SLAB - 0.05)
    notch.lineTo(cx + 0.03, D.SLAB - 0.1)
    notch.lineTo(cx - 0.005, D.SLAB_B)
    notch.lineTo(cx - 0.03, D.SLAB_B)
    notch.lineTo(cx - 0.005, D.SLAB - 0.1)
    notch.lineTo(cx - 0.025, D.SLAB - 0.05)
    notch.closePath()
    const nm = mk(new THREE.ShapeGeometry(notch), crackMat, 0, 0, 0.004)
    root.add(nm)
    // the sealant: a grey bead laid along it, drawn as the trowel goes
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => p.clone().setY(p.y + 0.008))), 30, 0.022, 6, false)
    const bead = mk(tube, sealMat)
    bead.geometry.setDrawRange(0, 0)
    bead.raycast = () => {}
    root.add(bead)
    const patch = mk(new THREE.BoxGeometry(0.09, D.SLAB - D.SLAB_B, 0.02), sealMat, cx, (D.SLAB + D.SLAB_B) / 2, 0.006)
    patch.visible = false
    root.add(patch)
    seals.push({ bead, patch, k: 0, goal: 0, total: tube.index.count })
    // a trowel that runs along it while it is sealed
    const tr = new THREE.Group()
    const blade = new THREE.Shape()
    blade.moveTo(0, 0.0)
    blade.lineTo(0.07, -0.12)
    blade.lineTo(-0.07, -0.12)
    blade.closePath()
    const bm = mk(new THREE.ShapeGeometry(blade), std('#c8ccd4', { metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide }))
    bm.rotation.x = -Math.PI / 2 + 0.25
    tr.add(bm)
    const handle = mk(new THREE.CylinderGeometry(0.016, 0.02, 0.13, 8), std('#8a5a3a'), 0, 0.09, 0.03)
    handle.rotation.x = 0.6
    tr.add(handle)
    tr.visible = false
    root.add(tr)
    trowels.push(tr)
    // a hit shape over it (taps from the yard reach it through the cut)
    const hb = hitBox(0.42, 0.4, CRACK_LEN + 0.15, cx, D.SLAB + 0.1, -CRACK_LEN / 2 + 0.05)
    root.add(hb)
    crackHits.push(hb)
  })
  // the sump: a hollow in the gravel under the slab, seen in the cut
  {
    const s = mk(new THREE.CircleGeometry(1, 28, Math.PI, Math.PI), basic('#120c0e'), SUMP.x, D.SLAB_B, 0.006)
    s.scale.set(0.38, 0.28, 1)
    root.add(s)
    const rim = mk(new THREE.RingGeometry(0.92, 1, 28, 1, Math.PI, Math.PI), std('#6a6058', { roughness: 1 }), SUMP.x, D.SLAB_B, 0.007)
    rim.scale.set(0.4, 0.3, 1)
    root.add(rim)
  }
  // the pipe, in the cut: cut along its length, so whatever runs up it shows; the fan on it outside, open too
  const pipeOuter = std('#b4bccb', { metalness: 0.3, roughness: 0.45, emissive: '#3a4250', emissiveIntensity: 0.6 })
  const pipeInner = std('#7a8294', { side: THREE.BackSide, roughness: 0.8, emissive: '#262b36', emissiveIntensity: 0.6 })
  // (standing just in front of the cut, so its open half faces the visitor)
  const PIPE_Z = 0.08
  const pipe = new THREE.Group()
  pipe.position.z = PIPE_Z
  root.add(pipe)
  const halfPipe = (x0, y0, x1, y1) => {
    const len = Math.hypot(x1 - x0, y1 - y0)
    for (const mat of [pipeOuter, pipeInner]) {
      const g = new THREE.CylinderGeometry(PIPE_R, PIPE_R, len, 16, 1, true, Math.PI / 2, Math.PI)
      if (Math.abs(y1 - y0) < 1e-6) g.rotateZ(Math.PI / 2)
      g.translate((x0 + x1) / 2, (y0 + y1) / 2, 0)
      pipe.add(mk(g, mat))
    }
  }
  const elbow = (x, y) => {
    for (const mat of [pipeOuter, pipeInner]) pipe.add(mk(new THREE.SphereGeometry(PIPE_R, 16, 8, Math.PI, Math.PI), mat, x, y, 0))
  }
  for (let i = 1; i < PIPE.length; i++) halfPipe(PIPE[i - 1][0], PIPE[i - 1][1], PIPE[i][0], PIPE[i][1])
  elbow(SUMP.x, PIPE_TURN)
  elbow(PIPE_X, PIPE_TURN)
  // the rain cap at its top
  const cap = mk(new THREE.ConeGeometry(0.16, 0.1, 16), pipeOuter, PIPE_X, PIPE_TOP + 0.14, -0.04)
  pipe.add(cap)
  for (const dx of [-0.06, 0.06]) pipe.add(mk(new THREE.BoxGeometry(0.012, 0.1, 0.012), pipeOuter, PIPE_X + dx, PIPE_TOP + 0.05, -0.04))
  // the fan box on the pipe outside, cut open at the front: its blades and hub
  const fanBox = new THREE.Group()
  fanBox.position.set(PIPE_X, FAN_Y, -0.11)
  pipe.add(fanBox)
  const fanMat = std('#4a5264', { roughness: 0.5, side: THREE.DoubleSide, emissive: '#1c2230', emissiveIntensity: 0.6 })
  {
    const W = 0.44
    const Dd = 0.22
    fanBox.add(mk(new THREE.PlaneGeometry(W, W), fanMat, 0, 0, -Dd / 2))
    for (const s of [-1, 1]) {
      const side = mk(new THREE.PlaneGeometry(Dd, W), fanMat, s * W / 2, 0, 0)
      side.rotation.y = Math.PI / 2
      fanBox.add(side)
      const tb = mk(new THREE.PlaneGeometry(W, Dd), fanMat, 0, s * W / 2, 0)
      tb.rotation.x = Math.PI / 2
      fanBox.add(tb)
    }
    const shroud = mk(new THREE.TorusGeometry(0.17, 0.018, 8, 32), std('#232836'), 0, 0, 0.05)
    fanBox.add(shroud)
  }
  const rotor = new THREE.Group()
  rotor.position.z = 0.04
  fanBox.add(rotor)
  const bladeMat = std('#9aa3b8', { metalness: 0.4, roughness: 0.4, side: THREE.DoubleSide })
  for (let k = 0; k < 4; k++) {
    const b = mk(new THREE.CircleGeometry(1, 16), bladeMat)
    b.scale.set(0.085, 0.035, 1)
    const a = (k / 4) * TAU + 0.35
    b.position.set(Math.cos(a) * 0.085, Math.sin(a) * 0.085, 0)
    b.rotation.z = a
    rotor.add(b)
  }
  rotor.add(mk(new THREE.CircleGeometry(0.03, 16), std('#232836'), 0, 0, 0.002))
  const fanLed = mk(new THREE.SphereGeometry(0.018, 10, 8), basic('#3a4a3a'), 0.17, -0.17, 0.02)
  fanBox.add(fanLed)
  fanBox.add(hitBox(0.55, 0.55, 0.3, 0, 0, 0.02))
  // a hit shape for the pipe in the cellar (tapping it runs the fan too)
  const pipeHit = hitBox(0.3, PIPE_TURN - SUMP.y, 0.25, SUMP.x, (SUMP.y + PIPE_TURN) / 2, 0)
  pipe.add(pipeHit)
  let fanSpin = 0
  let calmSaid = false
  // the calm ending is said to whoever ran the fan, not to everyone in a room
  let calmMine = false
  let fanK = 0

  const fixPanel = lv => {
    const B = E.fix.buttons
    const H = E.house.buttons
    return {
      title: E.fix.title,
      color: '#8fe3b0',
      blocks: [
        ...paras(E.fix.panel[depth(lv)]),
        { big: `${bq(shown.room)} Bq/m³`, small: E.house.small },
        lv === 'scientist' && {
          rows: [
            [E.house.rows.pull, `${num(Math.max(0, target().pull), 1, lang)} Pa`],
            [E.house.rows.cellar, `${bq(shown.cellar)} Bq/m³`],
            [E.house.rows.room, `${bq(shown.room)} Bq/m³`],
          ],
        },
        { p: E.fix.tip },
        {
          buttons: [
            S.cracks.some(Boolean) && { label: B.seal, onClick: () => sealAll() },
            { label: S.fan ? B.fanOff : B.fanOn, onClick: () => tapFan() },
            { label: S.win ? H.winShut : H.winOpen, onClick: () => tapWindowFix() },
            (!S.cracks.every(Boolean) || S.fan) && { label: B.again, onClick: () => undoFix() },
          ].filter(Boolean),
        },
      ].filter(Boolean),
    }
  }
  const fixDone = (line, delay = 3.2) => {
    say(line)
    ex.discover('fix', fixPanel, delay)
    share('fix')
    later(0.05, () => refresh(fixPanel))
  }
  function seal(i, liveSeal) {
    if (!S.cracks[i]) return false
    S.cracks[i] = 0
    seals[i].goal = 1
    if (!liveSeal) seals[i].k = 1
    return true
  }
  function tapCrack(i) {
    if (!seal(i, true)) return
    play('select')
    fixDone(at(S.cracks.some(Boolean) ? E.fix.says.seal : E.fix.says.sealedAll, level()))
  }
  function sealAll() {
    let any = false
    CRACKS.forEach((_, i) => (any = seal(i, true) || any))
    if (!any) return
    play('select')
    fixDone(at(E.fix.says.sealedAll, level()))
  }
  function tapFan() {
    S.fan = S.fan ? 0 : 1
    calmMine = !!S.fan
    play(S.fan ? 'beam' : 'tap')
    fixDone(at(S.fan ? E.fix.says.fanOn : E.fix.says.fanOff, level()))
  }
  function tapWindowFix() {
    tapWindow()
    ex.discover('fix', fixPanel, 3.2)
  }
  function undoFix() {
    S.cracks = [1, 1, 1]
    seals.forEach(s => {
      s.goal = 0
      s.k = 0
    })
    S.fan = 0
    calmSaid = false
    play('tap')
    fixDone(at(E.fix.says.again, level()), 3)
  }
  crackHits.forEach((h, i) => clickable(h, () => tapCrack(i), { when: () => !!S.cracks[i], reach: 9 }))
  clickable(fanBox, tapFan, { reach: 9 })
  clickable(pipeHit, tapFan, { reach: 9 })
  ex.add({
    id: 'fix',
    x: -4.3,
    z: 4.05,
    radius: 1.15,
    manual: true,
    label: E.fix.label,
    verb: () => (S.cracks.some(Boolean) ? E.fix.verbCrack : !S.fan ? E.fix.verbFan : !tried.window ? E.fix.verbWindow : E.fix.verbMore),
    focus: { x: -2.6, y: -0.55, z: -0.5, size: 4.8, width: 5.2 },
    act: () => ctx.showPanel(fixPanel),
  })
  updates.push((dt, t) => {
    fanK = damp(fanK, S.fan, 2.5, dt)
    fanSpin += dt * 26 * fanK
    rotor.rotation.z = -fanSpin
    fanLed.material.color.set(S.fan ? '#5cf27a' : '#3a4a3a')
    seals.forEach((s, i) => {
      if (s.goal === 0) {
        s.k = 0
      } else if (s.k < 1) {
        s.k = Math.min(1, s.k + dt / 1.1)
      }
      const n = Math.floor((s.k * s.total) / 36) * 36
      s.bead.geometry.setDrawRange(0, s.goal ? (s.k >= 1 ? s.total : n) : 0)
      s.patch.visible = !!s.goal && s.k > 0.05
      const tr = trowels[i]
      tr.visible = s.goal === 1 && s.k > 0 && s.k < 1
      if (tr.visible) {
        const pts = crackPts[i]
        const p = pts[Math.min(pts.length - 1, Math.floor(s.k * (pts.length - 1)))]
        tr.position.set(p.x, D.SLAB + 0.04, p.z)
      }
    })
    // the calm ending, once the fan has brought the living room near outdoor levels
    if (S.fan && calmMine && !calmSaid && shown.room < 60) {
      calmSaid = true
      say(at(E.fix.says.calm, level()))
    }
  })
  const fixState = () => ({ c: S.cracks.reduce((m, v, i) => m | (v ? 0 : 1 << i), 0), f: S.fan })
  const fixSet = (s, liveSet) => {
    const mask = Number(s?.c) || 0
    CRACKS.forEach((_, i) => {
      const sealed = !!(mask & (1 << i))
      if (sealed && S.cracks[i]) seal(i, liveSet)
      if (!sealed && !S.cracks[i]) {
        S.cracks[i] = 1
        seals[i].goal = 0
        seals[i].k = 0
      }
    })
    S.fan = s?.f ? 1 : 0
    if (!liveSet) fanK = S.fan
  }

  updates.push((dt, t) => {
    stage.update(dt, t)
    stepMotes(Math.min(dt, 0.05), t)
  })

  return {
    env: stage.env,
    solids,
    floor: stage.floor,
    cameraBounds: stage.cameraBounds,
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 8.3, yaw: 0 },
    hostSpot: { x: -2.6, z: 7.6, yaw: Math.atan2(-2.6, 8) },
    back: { x: 0, z: 11.5, rot: Math.PI },
    stand: { x: 6.6, z: 7.3, rot: -1.25 },
    parts: {
      house: {
        window: () => tapWindow(),
        hood: () => tapHood(),
        door: () => tapDoor(),
        stove: () => tapStove(),
        thermometer: () => tapThermo(),
        setT: v => setTemp(v, true),
        get state() {
          return { ...S, cracks: [...S.cracks], tin }
        },
        get levels() {
          return { ...shown, target: target() }
        },
      },
      kit: {
        detector: () => tapDetector(),
        envelope: () => tapEnvelope(),
        microscope: () => tapLens(),
        setMonths: v => setMonths(v, true),
        fresh: () => newDetector(true),
        get state() {
          return { ...kit, avg: avg(), pits: tracksOf() }
        },
      },
      fix: {
        crack: i => tapCrack(i),
        seal: () => sealAll(),
        fan: () => tapFan(),
        undo: () => undoFix(),
        get state() {
          return { cracks: [...S.cracks], fan: S.fan }
        },
      },
    },
    panels: { house: housePanel, kit: kitPanel, fix: fixPanel },
    shared: {
      house: { get: houseState, set: houseSet },
      kit: { get: kitState, set: kitSet },
      fix: { get: fixState, set: fixSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const o of own) o.dispose?.()
    },
  }
}
