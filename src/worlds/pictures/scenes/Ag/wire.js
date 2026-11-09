// Silver's picture "Can a rock grow silver hair?" as a room (docs/knowledge/picture-rooms.md): the King's Mine at
// Kongsberg in Norway, from its hillside at dusk into the long gallery (stages/mine.js). Silver atoms are the
// pictures' grey balls, sulfur yellow, polished silver a drawn matcap. Three stations, each worked by tapping its
// things:
// - "The ox's find" (the clearing, the picture's top): tap the ox, it butts the rock (a flake falls, a glint
//   shows); tap the glint: a lump of black ore with silver curls goes up in a child's hand. A year slider from 1623
//   to 1958 fills the valley with houses, shaft houses and waterwheels (windows glow), and a board counts the
//   silver and the depth (only the ends are records, between them a smooth curve) and tells the known dates.
// - "Fire against the rock" (the gallery's end face): tap the logs (they stack against the rock), tap the torch
//   (the fire burns for a model weekend, Friday to Monday, sped up: the face glows, cracks, smoke rises into
//   the loft), tap the hammer and pick (the loosened rock falls; the face moves on 12.5 cm). A slider sets how
//   many weekends' fires (0 to 12) and a board turns it into centimetres (10 to 15 cm a fire).
// - "Grow silver hair" (the forge chamber, the picture's lens): tap the bellows (150 degrees hotter each time) or
//   drag the temperature, tap the rake to rake the coals out. A lump of silver sulfide (enlarged) on the hearth:
//   above about 177 C its silver ions run through the sulfur (the lens), above about 450 C they gather at the
//   roots of curls and push them out, at about 830 C it melts and the curls are lost. Tap a curl in the calcite vein
//   in the wall: the Atomling tells why nobody knows yet whether nature grew them hot or slowly in the cold.
// Facts, sources and what is a model: the head of wire.words.js. All three stations are shared in a room.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, num, clamp, lerp, smooth, damp, random } from '../../../wings/noble/kit.js'
import { mineStage, Z_END, HALF, CHAMBER, WALL_H, profile } from '../../stages/mine.js'
import { makeText } from '../../../../engine/text.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { WIRE_WORDS } from './wire.words.js'

export const WORDS = WIRE_WORDS

const TAU = Math.PI * 2
const ORANGE = '#ff9f43'
const SILVER = '#b4bcc8'
const SULFUR = '#f0c23a'

// ---- the sulfide's story as numbers ----
const T_ROOM = 20
const T_MAX = 850
const T_ARG = 177 // acanthite becomes argentite (the board's figure; sources give 173 to 180)
const T_GROW = 450 // wires start to push out (in a flame, 450 to 700 C)
const T_MELT = 830 // silver sulfide melts (sources give 825 to 836)
const MM_FULL = 8 // a full curl in the model, in mm
const MM_HALF_HOUR = 3 // growth at 650 C and above, mm per half an hour
const MIN_PER_S = 6 // the model: 30 minutes pass in 5 seconds
const growthK = T => smooth(T_GROW, 650, T) // 0..1
const phaseOf = T => (T >= T_MELT ? 'melt' : T >= T_GROW ? 'grow' : T >= T_ARG ? 'argentite' : 'acanthite')
// years
const Y0 = 1623
const Y1 = 1958
const sOf = y => clamp((y - Y0) / (Y1 - Y0))
const tonnesAt = y => (y >= Y1 ? 1350 : Math.round((1350 * Math.pow(sOf(y), 1.3)) / 10) * 10)
const depthAt = y => (y >= Y1 ? 1068 : Math.round((1068 * Math.pow(sOf(y), 0.8)) / 10) * 10)
const MILE = [1623, 1624, 1770, 1890, 1958]
const mileAt = y => MILE.filter(m => y >= m).pop() ?? 1623
// the fire's weekend
const BURN = 15 // seconds of a model weekend, Friday evening to Monday morning
const FIRES_MAX = 12
const CM_FIRE = 12.5 // the middle of 10 to 15 cm

const minus = s => s.replace(/^-/, '−')

export async function build({ ctx, root, lang, E, ex, say, later, light, color, level, depth, clickable }) {
  const stage = mineStage({ light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const own = []
  const keep = o => (own.push(o), o)
  const updates = []
  const paras = list => list.map(p => ({ p }))
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, ...o }))
  const edgeOf = c => std(c, { emissive: c, emissiveIntensity: 1.0, roughness: 0.4 })
  const dark = std('#1b1d24', { metalness: 0.4 })
  const hitBox = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), keep(new THREE.MeshBasicMaterial({ visible: false })))
    m.position.set(x, y, z)
    return m
  }
  const hitSphere = (r, x, y, z) => {
    const m = new THREE.Mesh(keep(new THREE.SphereGeometry(r, 10, 8)), keep(new THREE.MeshBasicMaterial({ visible: false })))
    m.position.set(x, y, z)
    return m
  }
  const font = (wt, px, f = 'Outfit') => `${wt} ${px}px ${f}, sans-serif`
  const lv = () => depth(level())
  const fmtN = (v, d = 0) => minus(num(v, d, lang))
  const sliding = {}
  const slid = id => {
    if (sliding[id]) return
    sliding[id] = true
    later(0.2, () => {
      sliding[id] = false
      share(id)
    })
  }
  const soft = keep(
    canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.45, 'rgba(255,255,255,0.4)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  const flameTex = keep(
    canvasTex(64, 96, (g, w, h) => {
      const grd = g.createRadialGradient(w / 2, h * 0.62, 2, w / 2, h * 0.62, w * 0.5)
      grd.addColorStop(0, 'rgba(255,240,170,1)')
      grd.addColorStop(0.35, 'rgba(255,160,60,0.8)')
      grd.addColorStop(1, 'rgba(255,90,20,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
    }),
  )

  /** A board in the atrium's look: a canvas picture in a glowing frame, facing +z. */
  function board({ w, h, cw, ch, edge, y = 0, legs = 0 }) {
    const g = new THREE.Group()
    const t = keep(canvasTex(cw, ch, null, { mipmaps: false }))
    g.add(mk(keep(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.025)), edgeOf(edge), 0, y, -0.02))
    g.add(mk(keep(new THREE.PlaneGeometry(w, h)), keep(new THREE.MeshBasicMaterial({ map: t, toneMapped: false })), 0, y, 0.015))
    if (legs) for (const s of [-1, 1]) g.add(mk(keep(new THREE.CylinderGeometry(0.035, 0.04, legs, 8)), dark, s * (w / 2 - 0.25), legs / 2, -0.06))
    return { group: g, tex: t, draw: fn => t.userData.redraw(fn) }
  }
  const place = (obj, x, z, rot, y = 0) => {
    obj.position.set(x, y, z)
    obj.rotation.y = rot
    root.add(obj)
    return obj
  }

  // ---- silver: a drawn matcap, as the showpiece's ----
  const silverCap = keep(
    canvasTex(256, 256, g => {
      const base = g.createLinearGradient(0, 0, 0, 256)
      for (const [o, col] of [[0, '#b0b7c2'], [0.38, '#7e8693'], [0.62, '#454a55'], [0.82, '#2b2e36'], [1, '#444853']]) base.addColorStop(o, col)
      g.fillStyle = base
      g.fillRect(0, 0, 256, 256)
      const rim = g.createRadialGradient(128, 128, 92, 128, 128, 128)
      rim.addColorStop(0, 'rgba(206,212,222,0)')
      rim.addColorStop(1, 'rgba(206,212,222,0.5)')
      g.fillStyle = rim
      g.fillRect(0, 0, 256, 256)
      for (const [x, y, r, a] of [[86, 72, 30, 0.9], [176, 92, 18, 0.8], [140, 44, 11, 0.7], [62, 150, 10, 0.5]]) {
        const w = g.createRadialGradient(x, y, 0, x, y, r)
        w.addColorStop(0, `rgba(244,246,250,${a})`)
        w.addColorStop(1, 'rgba(214,220,230,0)')
        g.fillStyle = w
        g.fillRect(x - r, y - r, 2 * r, 2 * r)
      }
    }),
  )
  const silverMat = keep(new THREE.MeshMatcapMaterial({ matcap: silverCap, color: '#f2f3f6' }))
  const atomAg = keep(new THREE.MeshMatcapMaterial({ matcap: silverCap, color: '#e4e8f0' }))
  const sulfurMat = std(SULFUR, { emissive: '#8a6a10', emissiveIntensity: 0.55, roughness: 0.45 })

  /** A silver wire that ends in a curl: a tube along a curve, drawn up to `frac` of its length. */
  function curlWire(seed, h, r, tube = 0.014, segs = 90) {
    const rn = random(seed)
    const lean = (rn() - 0.5) * 0.9
    const sway = (rn() - 0.5) * 0.6
    const pts = []
    for (let i = 0; i <= 6; i++) {
      const t = i / 6
      pts.push(new THREE.Vector3(Math.sin(t * 3 + seed) * sway * h * 0.12 + lean * t * h * 0.35, t * h * 0.82, Math.cos(t * 2.3 + seed) * sway * h * 0.1))
    }
    const top = pts[pts.length - 1].clone()
    const dir = lean >= 0 ? 1 : -1
    const cx = top.x + dir * r
    for (let i = 1; i <= 20; i++) {
      const a = (i / 20) * Math.PI * 2.6
      const rr = r * (1 - 0.62 * (i / 20))
      pts.push(new THREE.Vector3(cx - dir * rr * Math.cos(a) * (rr / r < 1 ? 1 : 1) - dir * 0, top.y + rr * Math.sin(a), top.z + 0.02 * i))
    }
    const geo = keep(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), segs, tube, 6))
    const per = 6 * 6
    const mesh = new THREE.Mesh(geo, silverMat)
    mesh.frustumCulled = false
    const set = f => {
      const n = Math.floor(clamp(f) * segs)
      geo.setDrawRange(0, n * per)
      mesh.visible = n > 0
    }
    set(1)
    return { mesh, set, segs }
  }
  const oreMat = std('#26262c', { roughness: 0.78, flatShading: true })
  /** A lump of black ore with a few static curls. */
  function oreLump(r, seed, curls = 3) {
    const g = new THREE.Group()
    const geo = keep(new THREE.IcosahedronGeometry(r, 1))
    const rn = random(seed)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (rn() - 0.5) * 0.35
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.78, p.getZ(i) * k)
    }
    geo.computeVertexNormals()
    g.add(new THREE.Mesh(geo, oreMat))
    for (let i = 0; i < curls; i++) {
      const w = curlWire(seed + i * 7, r * (1.4 + i * 0.3), r * 0.5, r * 0.07, 40)
      w.mesh.position.set((i - 1) * r * 0.5, r * 0.45, ((i * 3) % 2 - 0.5) * r * 0.4)
      g.add(w.mesh)
    }
    return g
  }

  // =======================================================================================================
  // state of all three stations
  // =======================================================================================================
  // 1: the ox
  let oxSt = 0 // 0 nothing yet, 1 the ox has butted (glint), 2 the ore is taken
  let year = Y0
  let slidYear = false
  // 2: the fire
  let fireSt = 0 // 0 logs in the pile, 1 stacked, 2 burning, 3 cooled and cracked
  let fires = 0
  let burnT = -1
  let slidFires = false
  // 3: the forge
  let Ttarget = T_ROOM
  let Tnow = T_ROOM
  let melt = 0
  let touchedHot = false
  let usedRake = false
  let tappedCurl = false
  const NW = 5
  const wire = Array.from({ length: NW }, () => 0) // each curl's length, 0..1 of MM_FULL
  const wireSpeed = [1, 0.85, 1.15, 0.92, 1.07]

  // =======================================================================================================
  // station 1: the ox's find, in the clearing
  // =======================================================================================================
  const ROCK = new THREE.Vector3(6.0, 0, 8.8)
  const OXP = new THREE.Vector3(3.55, 0, 7.4)
  const toRock = Math.atan2(ROCK.z - OXP.z, ROCK.x - OXP.x)
  const rockMat = std('#6c6a70', { roughness: 0.95, flatShading: true })
  const rockG = new THREE.Group()
  rockG.position.copy(ROCK)
  root.add(rockG)
  const boulder = (r, seed) => {
    const geo = keep(new THREE.IcosahedronGeometry(r, 1))
    const rn = random(seed)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (rn() - 0.5) * 0.28
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.85, p.getZ(i) * k)
    }
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, rockMat)
  }
  for (const [x, y, z, r, s] of [[0, 0.6, 0, 1.1, 3], [1.0, 0.4, 0.5, 0.8, 5], [-0.7, 0.3, 0.9, 0.7, 8], [0.3, 1.3, -0.3, 0.75, 11], [-0.9, 0.35, -0.8, 0.65, 14]]) {
    const b = boulder(r, s)
    b.position.set(x, y, z)
    rockG.add(b)
  }
  solids.push(circle(ROCK.x, ROCK.z, 1.5))
  const glintDir = new THREE.Vector3(-0.75, 0.5, -0.42).normalize()
  const glintAt = new THREE.Vector3(ROCK.x, 0.6, ROCK.z).addScaledVector(glintDir, 1.12)
  // a stand of little rock flakes: one falls when the ox butts
  const flake = mk(keep(new THREE.BoxGeometry(0.24, 0.07, 0.17)), rockMat)
  flake.visible = false
  root.add(flake)
  const flakeV = new THREE.Vector3()
  let flakeLive = 0 // 0 none, 1 falling, 2 down
  // the glint
  const glintTex = keep(
    canvasTex(128, 128, (g, w) => {
      g.translate(w / 2, w / 2)
      const grd = g.createRadialGradient(0, 0, 0, 0, 0, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.25, 'rgba(255,250,230,0.6)')
      grd.addColorStop(1, 'rgba(255,240,200,0)')
      g.fillStyle = grd
      g.fillRect(-w / 2, -w / 2, w, w)
      g.fillStyle = '#ffffff'
      for (const [lx, ly] of [[1, 0.1], [0.1, 1]]) {
        g.beginPath()
        g.moveTo(-lx * 60, -ly * 60 + 0)
        g.lineTo(0, -ly * 4 - lx * 4)
        g.lineTo(lx * 60, ly * 60)
        g.lineTo(0, ly * 4 + lx * 4)
        g.closePath()
        g.fill()
      }
    }),
  )
  const glint = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: glintTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })))
  glint.position.copy(glintAt).addScaledVector(glintDir, 0.08)
  glint.visible = false
  glint.scale.setScalar(0.5)
  root.add(glint)
  const glintHit = new THREE.Group()
  glintHit.add(hitSphere(0.38, 0, 0, 0))
  glintHit.position.copy(glint.position)
  glintHit.visible = false
  root.add(glintHit)

  // the ox, facing +x in its own frame
  const ox = new THREE.Group()
  const oxCoat = std('#4a3626', { roughness: 0.9 })
  const oxLight = std('#7b5f45', { roughness: 0.9 })
  const hornMat = std('#ddd3b8', { roughness: 0.6 })
  const oxBody = mk(keep(new THREE.CapsuleGeometry(0.4, 0.95, 6, 14)), oxCoat, 0, 1.0, 0)
  oxBody.rotation.z = Math.PI / 2
  ox.add(oxBody)
  ox.add(mk(keep(new THREE.SphereGeometry(0.43, 14, 10)), oxCoat, -0.55, 1.02, 0))
  ox.add(mk(keep(new THREE.SphereGeometry(0.3, 12, 8)), oxLight, 0.15, 0.82, 0.3))
  for (const [x, z] of [[0.58, 0.2], [0.58, -0.2], [-0.55, 0.22], [-0.55, -0.22]]) {
    const leg = mk(keep(new THREE.CylinderGeometry(0.07, 0.06, 0.78, 8)), oxCoat, x, 0.39, z)
    ox.add(leg)
    ox.add(mk(keep(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 8)), dark, x, 0.05, z))
  }
  const oxHead = new THREE.Group()
  oxHead.position.set(0.82, 1.1, 0)
  oxHead.add(mk(keep(new RoundedBoxGeometry(0.5, 0.34, 0.34, 2, 0.08)), oxCoat, 0.25, -0.05, 0))
  oxHead.add(mk(keep(new RoundedBoxGeometry(0.2, 0.2, 0.28, 2, 0.06)), oxLight, 0.52, -0.1, 0))
  for (const s of [-1, 1]) {
    const horn = mk(keep(new THREE.TorusGeometry(0.26, 0.032, 6, 14, Math.PI * 0.85)), hornMat, 0.12, 0.08, s * 0.2)
    horn.rotation.set(s * 0.55, 0, 0.35)
    horn.rotation.order = 'ZXY'
    oxHead.add(horn)
    oxHead.add(mk(keep(new THREE.SphereGeometry(0.02, 6, 4)), dark, 0.42, 0.04, s * 0.13))
  }
  ox.add(oxHead)
  ox.add(mk(keep(new THREE.CylinderGeometry(0.02, 0.03, 0.55, 6)), oxCoat, -0.98, 0.8, 0))
  ox.add(hitBox(2.0, 1.4, 0.9, 0.1, 0.75, 0))
  place(ox, OXP.x, OXP.z, -toRock)
  clickable(ox, () => tapOx(), { when: () => oxSt === 0, reach: 9 })
  solids.push(circle(OXP.x - 0.3, OXP.z - 0.1, 0.55))

  // the two children (Helga and Jacob, as the town tells it): a bundle of simple shapes
  function child(skin, coat, hat, h = 1.2) {
    const g = new THREE.Group()
    g.add(mk(keep(new THREE.CylinderGeometry(0.15, 0.17, h * 0.42, 10)), std(coat), 0, h * 0.5, 0))
    g.add(mk(keep(new THREE.CylinderGeometry(0.08, 0.08, h * 0.3, 8)), std('#2d2a30'), 0.05, h * 0.15, 0.07))
    g.add(mk(keep(new THREE.CylinderGeometry(0.08, 0.08, h * 0.3, 8)), std('#2d2a30'), -0.05, h * 0.15, -0.07))
    g.add(mk(keep(new THREE.SphereGeometry(0.12, 12, 10)), std(skin), 0, h * 0.82, 0))
    g.add(mk(keep(new THREE.SphereGeometry(0.13, 12, 8, 0, TAU, 0, Math.PI * 0.55)), std(hat), 0, h * 0.84, 0))
    const arm = new THREE.Group()
    arm.position.set(0, h * 0.7, 0.17)
    arm.add(mk(keep(new THREE.CylinderGeometry(0.045, 0.04, 0.36, 6)), std(coat), 0, -0.17, 0))
    g.add(arm)
    const arm2 = new THREE.Group()
    arm2.position.set(0, h * 0.7, -0.17)
    arm2.add(mk(keep(new THREE.CylinderGeometry(0.045, 0.04, 0.36, 6)), std(coat), 0, -0.17, 0))
    g.add(arm2)
    return { g, arm, arm2 }
  }
  const c1 = child('#e2b896', '#8a3b3b', '#c9b48a', 1.25) // Helga, with a staff
  const c2 = child('#d8ad8a', '#3d5f8c', '#4a3a2a', 1.1) // Jacob
  const CH = [new THREE.Vector3(3.35, 0, 9.5), new THREE.Vector3(2.8, 0, 9.85)]
  for (const [c, p] of [[c1, CH[0]], [c2, CH[1]]]) {
    place(c.g, p.x, p.z, -Math.atan2(ROCK.z - p.z, ROCK.x - p.x))
    c.arm.rotation.z = 0.1
    solids.push(circle(p.x, p.z, 0.25))
  }
  const staff = mk(keep(new THREE.CylinderGeometry(0.018, 0.022, 1.7, 6)), std('#6b4a32'), 0.12, 0.85, 0.26)
  staff.rotation.z = 0.08
  c1.g.add(staff)
  c1.arm.rotation.x = 0
  // the ore lump held up
  const lump = oreLump(0.13, 21, 3)
  lump.visible = false
  root.add(lump)
  const lumpFrom = new THREE.Vector3()
  const handAt = () => new THREE.Vector3(CH[0].x + 0.1, 1.55, CH[0].z - 0.35)
  let lumpT = -1
  let butt = -1
  const outDir = new THREE.Vector3(Math.cos(toRock), 0, Math.sin(toRock))

  // the year board, on the clearing's edge by the valley
  const yb = board({ w: 2.5, h: 1.55, cw: 1024, ch: 636, edge: ORANGE, y: 2.0, legs: 2.0 })
  const YB = { x: 5.2, z: 11.3 }
  place(yb.group, YB.x, YB.z, Math.atan2(1.0 - YB.x, 8.0 - YB.z))
  solids.push(circle(YB.x, YB.z, 0.9))
  let ybKey = ''
  function drawYear() {
    const W = E.ox.board
    const t = tonnesAt(year)
    const d = depthAt(year)
    const ev = E.ox.events[`e${mileAt(year)}`]
    yb.draw((g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#1c1a3a')
      grd.addColorStop(1, '#0e1030')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'alphabetic'
      g.textAlign = 'left'
      g.fillStyle = '#ffc07a'
      g.font = font(700, 44)
      g.fillText(W.title, 40, 62)
      g.fillStyle = '#ffffff'
      g.font = font(700, 150)
      g.fillText(String(Math.round(year)), 40, 205)
      g.font = font(600, 28, 'Nunito')
      g.fillStyle = '#c9d1ee'
      g.fillText(`${W.silver}: ${year >= Y1 ? '' : W.about + ' '}${fmtN(t)} t`, 40, 262)
      g.fillText(`${W.depth}: ${year >= Y1 ? '' : W.about + ' '}${fmtN(d)} m`, 40, 302)
      // the depth gauge: a shaft down the right
      const gx = w - 120
      const g0 = 40
      const g1 = 320
      g.fillStyle = 'rgba(255,255,255,0.1)'
      g.fillRect(gx - 14, g0, 28, g1 - g0)
      g.fillStyle = '#ffb067'
      g.fillRect(gx - 14, g0, 28, ((g1 - g0) * d) / 1068)
      g.fillStyle = '#ffffff'
      g.fillRect(gx - 26, g0 + ((g1 - g0) * d) / 1068 - 3, 52, 6)
      g.font = font(600, 22, 'Nunito')
      g.textAlign = 'center'
      g.fillText('0', gx, g0 - 8)
      g.fillText('1068 m', gx, g1 + 28)
      // the dates of the story, as a strip; the latest one is told
      const x0 = 50
      const x1 = w - 210
      const yy = 372
      g.strokeStyle = 'rgba(255,255,255,0.25)'
      g.lineWidth = 4
      g.beginPath()
      g.moveTo(x0, yy)
      g.lineTo(x1, yy)
      g.stroke()
      for (const m of MILE) {
        const x = x0 + ((m - Y0) / (Y1 - Y0)) * (x1 - x0)
        g.fillStyle = year >= m ? '#ffc07a' : 'rgba(255,255,255,0.3)'
        g.beginPath()
        g.arc(x, yy, m === mileAt(year) ? 13 : 8, 0, TAU)
        g.fill()
      }
      const now = x0 + ((clamp(year, Y0, Y1) - Y0) / (Y1 - Y0)) * (x1 - x0)
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.moveTo(now, yy - 16)
      g.lineTo(now - 9, yy - 34)
      g.lineTo(now + 9, yy - 34)
      g.fill()
      g.fillStyle = '#e6ebff'
      g.font = font(600, 31, 'Nunito')
      g.textAlign = 'left'
      wrap(g, `${mileAt(year)}: ${at(ev, level())}`, 40, 440, w - 80, 40)
      if (lv() === 'sci') {
        g.fillStyle = '#8ea0d4'
        g.font = font(600, 24, 'Nunito')
        wrap(g, W.model, 40, h - 56, w - 80, 30)
      }
    })
  }
  function wrap(g, text, x, y, maxW, lh) {
    const words = String(text).split(' ')
    let line = ''
    let yy = y
    for (const wd of words) {
      const test = line ? `${line} ${wd}` : wd
      if (g.measureText(test).width > maxW && line) {
        g.fillText(line, x, yy)
        line = wd
        yy += lh
      } else line = test
    }
    g.fillText(line, x, yy)
  }

  function setYear(y, fromSlider = false) {
    year = clamp(Math.round(y), Y0, Y1)
    stage.town.setYear(year)
    if (fromSlider) slidYear = true
    ybKey = ''
  }
  function tapOx() {
    if (oxSt > 0 || butt >= 0) return
    butt = 0
    play('tap')
    say(at(E.ox.says.butt, level()))
    share('ox')
  }
  function tapGlint() {
    if (oxSt !== 1) return
    oxSt = 2
    lumpT = 0
    lump.visible = true
    lump.position.copy(glint.position)
    lumpFrom.copy(glint.position)
    glint.visible = false
    glintHit.visible = false
    play('discover')
    say(at(E.ox.says.take, level()))
    ex.discover('ox', oxPanel, 3.2)
    share('ox')
  }
  clickable(glintHit, () => tapGlint(), { when: () => oxSt === 1, reach: 9 })
  const milestone = y => {
    setYear(y, true)
    play('select')
    say(at(E.ox.events[`e${mileAt(y)}`], level()))
    if (oxSt >= 1) ex.discover('ox', oxPanel, 3.2)
    slid('ox')
  }
  const oxPanel = l => ({
    title: E.ox.title,
    color: ORANGE,
    blocks: [
      ...paras(E.ox.panel[depth(l)]),
      { p: E.ox.tip },
      {
        slider: {
          label: E.ox.slider,
          min: Y0,
          max: Y1,
          step: 1,
          value: year,
          onInput: v => {
            setYear(v, true)
            slid('ox')
            if (oxSt >= 1) ex.discover('ox', oxPanel, 3.2)
          },
          format: v => String(Math.round(v)),
          live: () => year,
        },
      },
      {
        buttons: [
          { label: E.ox.buttons.butt, onClick: () => (oxSt === 0 ? tapOx() : tapGlint()) },
          ...MILE.slice(1).map(m => ({ label: String(m), onClick: () => milestone(m) })),
        ],
      },
    ],
  })
  ex.add({
    id: 'ox',
    x: -0.3,
    z: 8.3,
    radius: 3.6,
    manual: true,
    label: E.ox.label,
    verb: () => (oxSt === 0 ? E.ox.verbOx : oxSt === 1 ? E.ox.verbGlint : E.ox.verbYear),
    focus: { x: 4.9, y: 1.2, z: 8.9, size: 4.4, width: 6.0 },
    act: () => ctx.showPanel(oxPanel),
  })
  const oxState = () => ({ st: oxSt, y: year })
  const oxSet = (s, liveSet) => {
    const st = Number(s?.st) || 0
    const y = Number(s?.y)
    if (Number.isFinite(y) && y !== year) setYear(y)
    if (st > oxSt) {
      if (liveSet && oxSt === 0 && butt < 0) {
        butt = 0
        play('tap')
      }
      if (st >= 1 && !(liveSet && oxSt === 0)) showButted()
      if (st === 2) {
        oxSt = 2
        lump.visible = true
        glint.visible = false
        glintHit.visible = false
        lumpT = liveSet ? 0 : 99
        lump.position.copy(handAt())
      }
    }
  }
  function showButted() {
    oxSt = Math.max(oxSt, 1)
    glint.visible = oxSt === 1
    glintHit.visible = oxSt === 1
  }

  // =======================================================================================================
  // station 2: fire against the rock, at the gallery's end
  // =======================================================================================================
  const FACE0 = Z_END
  const faceZ = () => stage.endFace.position.z
  const woodMat = stage.mats.wood
  // the log pile (left wall) and the stack against the face: one instanced set of 40 split logs
  const NLOG = 40
  const logGeo = keep(new THREE.CylinderGeometry(0.085, 0.085, 1.15, 7))
  logGeo.rotateZ(Math.PI / 2)
  const logMat = std('#8a6a48', { roughness: 0.9 })
  const logs = new THREE.InstancedMesh(logGeo, logMat, NLOG)
  logs.frustumCulled = false
  root.add(logs)
  const logPile = []
  const logStack = []
  {
    const rn = random(9)
    for (let i = 0; i < NLOG; i++) {
      // pile: layers along the left wall at z -16.4
      const layer = Math.floor(i / 8)
      const k = i % 8
      logPile.push(new THREE.Vector3(-1.75 + (k % 2) * 0.12, 0.09 + layer * 0.17, -15.3 + (Math.floor(k / 2) - 1.5) * 0.19 + (rn() - 0.5) * 0.03))
      // stack: rows against the face, x -1.5..1.5, six layers
      const row = Math.floor(i / 10)
      const col = i % 10
      logStack.push(new THREE.Vector3(-1.35 + col * 0.3 + (row % 2) * 0.08, 0.1 + row * 0.19, 0.4 + (row % 2) * 0.05))
    }
  }
  const logK = new Array(NLOG).fill(0) // 0 in the pile, 1 in the stack
  let logDrive = -1 // seconds into the move (0.. )
  let logTarget = 0
  const logAge = new Array(NLOG).fill(0)
  const m4 = new THREE.Matrix4()
  const qq = new THREE.Quaternion()
  const vv = new THREE.Vector3()
  const ss = new THREE.Vector3()
  const logChar = new THREE.Color()
  function setLogs(burn) {
    for (let i = 0; i < NLOG; i++) {
      const k = smooth(0, 1, logK[i])
      const a = logPile[i]
      const b = logStack[i]
      const arc = Math.sin(k * Math.PI) * 0.7
      vv.set(lerp(a.x, b.x, k), lerp(a.y, b.y + 0.0, k) + arc, lerp(a.z, faceZ() + b.z, k))
      const spin = (1 - k) * 0.3 * Math.sin(i * 1.7)
      qq.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, spin * (k < 1 ? 1 : 0))
      // as it burns the log shrinks to an ember
      const sh = lerp(1, 0.45, burn)
      ss.set(1, sh, sh)
      m4.compose(vv, qq, ss)
      logs.setMatrixAt(i, m4)
      logChar.set('#8a6a48').lerp(new THREE.Color('#1c1612'), burn)
      logs.setColorAt(i, logChar)
    }
    logs.instanceMatrix.needsUpdate = true
    if (logs.instanceColor) logs.instanceColor.needsUpdate = true
  }
  setLogs(0)
  const logHit = hitBox(1.0, 0.8, 1.0, -1.7, 0.4, -15.3)
  root.add(logHit)
  const stackHit = hitBox(3.2, 1.3, 0.8, 0, 0.65, FACE0 + 0.4)
  root.add(stackHit)
  solids.push(circle(-1.75, -15.3, 0.55))

  // the torch on an iron stand
  const torch = new THREE.Group()
  torch.add(mk(keep(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 14)), dark, 0, 0.025, 0))
  torch.add(mk(keep(new THREE.CylinderGeometry(0.03, 0.04, 1.2, 8)), dark, 0, 0.6, 0))
  const torchStick = new THREE.Group()
  torchStick.add(mk(keep(new THREE.CylinderGeometry(0.025, 0.03, 0.9, 6)), std('#5a4030'), 0, 0.45, 0))
  torchStick.add(mk(keep(new THREE.CylinderGeometry(0.06, 0.04, 0.2, 8)), std('#2a2018'), 0, 0.95, 0))
  const torchFlame = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })))
  torchFlame.scale.set(0.34, 0.5, 1)
  torchFlame.position.set(0, 1.18, 0)
  torchStick.add(torchFlame)
  torchStick.position.set(0, 0.25, 0)
  torch.add(torchStick)
  torch.add(hitBox(0.55, 1.5, 0.55, 0, 0.8, 0))
  const TORCH = { x: 1.7, z: -16.7 }
  place(torch, TORCH.x, TORCH.z, 0)
  solids.push(circle(TORCH.x, TORCH.z, 0.28))
  const torchHome = new THREE.Vector3(TORCH.x, 0.25, TORCH.z)
  let torchT = -1

  // the hammer and pick on a low rack
  const tools = new THREE.Group()
  tools.add(mk(keep(new RoundedBoxGeometry(0.9, 0.5, 0.4, 2, 0.04)), std('#4a3624'), 0, 0.25, 0))
  const hammer = new THREE.Group()
  hammer.add(mk(keep(new THREE.CylinderGeometry(0.02, 0.025, 0.7, 6)), std('#6b4a32'), 0, 0, 0))
  hammer.add(mk(keep(new THREE.BoxGeometry(0.22, 0.1, 0.1)), ironMat(), 0, 0.33, 0))
  hammer.position.set(-0.15, 0.56, 0.02)
  hammer.rotation.z = 1.5
  const pick = new THREE.Group()
  pick.add(mk(keep(new THREE.CylinderGeometry(0.02, 0.025, 0.85, 6)), std('#6b4a32'), 0, 0, 0))
  const pickHead = mk(keep(new THREE.BoxGeometry(0.5, 0.05, 0.05)), ironMat(), 0, 0.4, 0)
  pick.add(pickHead)
  pick.position.set(0.18, 0.56, -0.03)
  pick.rotation.z = 1.35
  tools.add(hammer, pick)
  tools.add(hitBox(1.0, 0.6, 0.5, 0, 0.5, 0))
  const TOOLS = { x: 1.95, z: -15.0 }
  place(tools, TOOLS.x, TOOLS.z, -0.35)
  solids.push(circle(TOOLS.x, TOOLS.z, 0.5))
  function ironMat() {
    return stage.mats.iron
  }
  let toolT = -1

  // flames, smoke (sprites) and a light on the stack
  const flames = Array.from({ length: light ? 18 : 34 }, () => {
    const s = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })))
    s.visible = false
    root.add(s)
    return { s, life: -1, x: 0, z: 0, wait: Math.random() * 1.2 }
  })
  const smokes = Array.from({ length: light ? 16 : 30 }, () => {
    const s = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: soft, transparent: true, depthWrite: false, color: '#6a645e', opacity: 0 })))
    s.visible = false
    root.add(s)
    return { s, life: -1, v: new THREE.Vector3(), seed: Math.random() * 10 }
  })
  const fireLight = new THREE.PointLight('#ff7a30', 0, 12, 2)
  root.add(fireLight)
  let power = 0 // the fire's strength 0..1
  let heat = 0 // the face's glow 0..1
  let crack = 0 // the cracks 0..1

  // the face's glow and cracks: overlays on the end face (own outline), moving with it
  const outlineEnd = profile(Z_END, 34, 0.1).map(([x, y]) => new THREE.Vector2(x, y))
  const overlayGeo = keep(new THREE.ShapeGeometry(new THREE.Shape(outlineEnd), 1))
  {
    const p = overlayGeo.attributes.position
    const uv = overlayGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + HALF) / (2 * HALF), p.getY(i) / 4.2)
  }
  const heatTex = keep(
    canvasTex(256, 256, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w * 0.86, 4, w / 2, w * 0.86, w * 0.62)
      grd.addColorStop(0, 'rgba(255,200,90,1)')
      grd.addColorStop(0.3, 'rgba(255,110,30,0.75)')
      grd.addColorStop(1, 'rgba(180,40,10,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  const heatPlane = new THREE.Mesh(overlayGeo, keep(new THREE.MeshBasicMaterial({ map: heatTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })))
  heatPlane.position.z = 0.03
  stage.endFace.add(heatPlane)
  const crackTex = keep(
    canvasTex(512, 512, g => {
      const rn = random(41)
      g.lineCap = 'round'
      const branch = (x, y, a, len, wd, d) => {
        if (len < 14 || d > 4) return
        const x2 = x + Math.cos(a) * len
        const y2 = y + Math.sin(a) * len
        g.strokeStyle = 'rgba(14,10,8,0.95)'
        g.lineWidth = wd
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x2, y2)
        g.stroke()
        branch(x2, y2, a + (rn() - 0.5) * 0.9, len * (0.6 + rn() * 0.25), wd * 0.7, d + 1)
        if (rn() < 0.7) branch(x2, y2, a + (rn() - 0.5) * 2.2, len * 0.55, wd * 0.6, d + 1)
      }
      for (let i = 0; i < 9; i++) branch(60 + rn() * 390, 470 - rn() * 80, -Math.PI / 2 + (rn() - 0.5) * 1.2, 70 + rn() * 50, 6, 0)
      // flaking plates: arcs
      g.strokeStyle = 'rgba(14,10,8,0.8)'
      g.lineWidth = 4
      for (let i = 0; i < 8; i++) {
        g.beginPath()
        g.arc(80 + rn() * 350, 120 + rn() * 300, 30 + rn() * 50, rn() * 3, rn() * 3 + 2)
        g.stroke()
      }
    }),
  )
  const crackPlane = new THREE.Mesh(overlayGeo, keep(new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, opacity: 0, depthWrite: false })))
  crackPlane.position.z = 0.02
  stage.endFace.add(crackPlane)

  // chunks that fall when the rock comes away, and the heap they leave
  const chunks = Array.from({ length: 16 }, () => {
    const m = mk(keep(new THREE.IcosahedronGeometry(0.1 + Math.random() * 0.1, 0)), std('#55535a', { flatShading: true, roughness: 0.95 }))
    m.visible = false
    root.add(m)
    return { m, v: new THREE.Vector3(), spin: new THREE.Vector3(), life: -1 }
  })
  const NHEAP = 40
  const heapGeo = keep(new THREE.IcosahedronGeometry(0.13, 0))
  const heap = new THREE.InstancedMesh(heapGeo, std('#5a5860', { flatShading: true, roughness: 0.95 }), NHEAP)
  heap.frustumCulled = false
  {
    const rn = random(77)
    for (let i = 0; i < NHEAP; i++) {
      const r = 0.55 * Math.sqrt(rn())
      const a = rn() * TAU
      const hy = Math.max(0.05, 0.5 - r) * 0.7
      qq.setFromEuler(new THREE.Euler(rn() * 3, rn() * 3, rn() * 3))
      m4.compose(new THREE.Vector3(2.0 + Math.cos(a) * r, hy, -17.3 + Math.sin(a) * r), qq, ss.setScalar(0.6 + rn() * 0.9))
      heap.setMatrixAt(i, m4)
    }
    heap.count = 0
  }
  root.add(heap)

  // the ruler board on the left wall
  const fb = board({ w: 1.6, h: 0.97, cw: 1024, ch: 621, edge: '#ffb067', y: 1.9, legs: 1.9 })
  {
    const x = -1.05
    const z = -17.5
    place(fb.group, x, z, Math.atan2(0 - x, -14.4 - z))
    solids.push(circle(x, z, 0.5))
  }
  let fbKey = ''
  const DAYS = ['fri', 'sat', 'sun', 'mon']
  function drawFire() {
    const W = E.fire.board
    const cm = fires * CM_FIRE
    fb.draw((g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#2a1810')
      grd.addColorStop(1, '#150e0b')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'alphabetic'
      g.textAlign = 'left'
      g.fillStyle = '#ffb067'
      g.font = font(700, 44)
      g.fillText(W.title, 40, 62)
      // the weekend: four days, a bar filled while the fire burns
      const x0 = 50
      const x1 = w - 50
      const y = 140
      const prog = fireSt === 2 ? clamp(burnT / BURN) : fireSt === 3 ? 1 : 0
      g.fillStyle = 'rgba(255,255,255,0.1)'
      g.fillRect(x0, y - 18, x1 - x0, 36)
      g.fillStyle = '#ff8a3c'
      g.fillRect(x0, y - 18, (x1 - x0) * prog, 36)
      g.font = font(600, 26, 'Nunito')
      g.fillStyle = '#ffe2c0'
      DAYS.forEach((d, i) => {
        g.textAlign = i === 0 ? 'left' : i === 3 ? 'right' : 'center'
        const x = i === 0 ? x0 : i === 3 ? x1 : x0 + ((i + 0.5) / 4) * (x1 - x0)
        g.fillText(W.days[d], x, y + 56)
      })
      g.textAlign = 'left'
      g.fillStyle = '#ffffff'
      g.font = font(700, 74)
      g.fillText(`${fmtN(fires)}`, 40, 270)
      const nw = g.measureText(`${fmtN(fires)}`).width
      g.font = font(600, 30, 'Nunito')
      g.fillStyle = '#e8cdb0'
      g.fillText(W.fires, 60 + nw, 266)
      // the ruler: 0 to 150 cm, the advance filled, the 10 to 15 cm a fire as a lighter band
      const rx0 = 50
      const rx1 = w - 50
      const ry = 380
      const xOf = v => rx0 + (clamp(v, 0, 150) / 150) * (rx1 - rx0)
      g.fillStyle = 'rgba(255,255,255,0.1)'
      g.fillRect(rx0, ry - 22, rx1 - rx0, 44)
      g.fillStyle = 'rgba(255,200,140,0.45)'
      g.fillRect(xOf(fires * 10), ry - 22, xOf(fires * 15) - xOf(fires * 10), 44)
      g.fillStyle = '#ff8a3c'
      g.fillRect(rx0, ry - 22, xOf(cm) - rx0, 44)
      g.fillStyle = '#ffe2c0'
      for (let c = 0; c <= 150; c += 25) {
        g.fillRect(xOf(c) - 1.5, ry + 26, 3, 14)
        g.font = font(600, 22, 'Nunito')
        g.textAlign = c === 0 ? 'left' : c === 150 ? 'right' : 'center'
        g.fillText(c ? `${c}` : '0 cm', xOf(c), ry + 66)
      }
      g.textAlign = 'left'
      g.fillStyle = '#ffffff'
      g.font = font(700, 40)
      g.fillText(`${W.advance}: ${fmtN(cm, cm % 1 ? 1 : 0)} cm`, 40, 330)
      g.fillStyle = '#e8cdb0'
      g.font = font(600, 28, 'Nunito')
      wrap(g, lv() === 'sci' ? W.sci : W.kid, 40, 500, w - 80, 36)
    })
  }

  function stackLogs() {
    if (fireSt !== 0 || logDrive >= 0) return
    logDrive = 0
    logTarget = 1
    play('tap')
    say(at(E.fire.says.logs, level()))
    ex.discover('fire', firePanel, 3.5)
    share('fire')
  }
  function lightTorch() {
    if (fireSt !== 1 || torchT >= 0) return
    torchT = 0
    play('tap')
    say(at(E.fire.says.torch, level()))
    share('fire')
  }
  function startBurn(age = 0) {
    fireSt = 2
    burnT = age
    for (const f of flames) f.life = -1
  }
  function strikeFace() {
    if (fireSt !== 3 || toolT >= 0) return
    if (crack < 0.9) return
    toolT = 0
    play('tap')
    say(at(E.fire.says.tools, level()))
    share('fire')
  }
  function afterStrike() {
    // the loosened rock comes away: chunks fall, the face moves on, the logs go back to the pile
    for (const c of chunks) {
      c.life = 0
      c.m.visible = true
      c.m.position.set((Math.random() - 0.5) * 3.2, 0.4 + Math.random() * 2.2, faceZ() + 0.25)
      c.v.set((Math.random() - 0.5) * 0.8, Math.random() * 0.8, 0.5 + Math.random() * 1.2)
      c.spin.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
    }
    setFires(Math.min(FIRES_MAX, fires + 1), true)
    fireSt = 0
    burnT = -1
    crack = 0
    logTarget = 0
    for (let i = 0; i < NLOG; i++) logK[i] = 0
    setLogs(0)
    power = 0
    ex.discover('fire', firePanel, 3.5)
    if (fires >= FIRES_MAX) say(at(E.fire.says.enough, level()))
    share('fire')
  }
  let facePos = 0
  function setFires(n, fromHand = false) {
    fires = clamp(Math.round(n), 0, FIRES_MAX)
    heap.count = Math.min(NHEAP, fires * 3)
    fbKey = ''
    if (!fromHand) slidFires = true
  }
  const firePanel = l => ({
    title: E.fire.title,
    color: '#ffb067',
    blocks: [
      ...paras(E.fire.panel[depth(l)]),
      { p: E.fire.tip },
      {
        slider: {
          label: E.fire.slider,
          min: 0,
          max: FIRES_MAX,
          step: 1,
          value: fires,
          onInput: v => {
            setFires(v)
            slid('fire')
            const w = fires
            if (w === FIRES_MAX) say(at(E.fire.says.enough, level()))
            ex.discover('fire', firePanel, 3.5)
          },
          format: v => `${Math.round(v)} (${fmtN(Math.round(v) * CM_FIRE, Math.round(v) * CM_FIRE % 1 ? 1 : 0)} cm)`,
          live: () => fires,
        },
      },
      {
        buttons: [
          { label: E.fire.buttons.logs, onClick: () => stackLogs() },
          { label: E.fire.buttons.torch, onClick: () => lightTorch() },
          { label: E.fire.buttons.tools, onClick: () => strikeFace() },
        ],
      },
    ],
  })
  clickable(logHit, () => stackLogs(), { when: () => fireSt === 0, reach: 7 })
  clickable(torch, () => lightTorch(), { when: () => fireSt === 1, reach: 7 })
  clickable(tools, () => strikeFace(), { when: () => fireSt === 3 && crack >= 0.9, reach: 7 })
  ex.add({
    id: 'fire',
    x: 0,
    z: -14.3,
    radius: 3.2,
    manual: true,
    label: E.fire.label,
    verb: () => (fireSt === 0 ? E.fire.verbLogs : fireSt === 1 ? E.fire.verbTorch : fireSt === 2 ? E.fire.verbWait : crack >= 0.9 ? E.fire.verbTools : E.fire.verbWait),
    focus: { x: -0.2, y: 1.3, z: -18.2, size: 4.0, width: 4.4 },
    act: () => ctx.showPanel(firePanel),
  })
  const fireState = () => ({ st: fireSt, n: fires, age: fireSt === 2 ? Math.round(burnT * 10) / 10 : 0 })
  const fireSet = (s, liveSet, ago = 0) => {
    const st = Number(s?.st) || 0
    const n = Number(s?.n) || 0
    if (n !== fires) {
      setFires(n, true)
      facePos = fires * 0.125
    }
    if (st === fireSt) {
      if (st === 2 && Number.isFinite(Number(s.age))) burnT = Number(s.age) + (liveSet ? 0 : ago)
      return
    }
    if (st === 1 && fireSt === 0) {
      if (liveSet) {
        logDrive = 0
        logTarget = 1
        play('tap')
      } else {
        fireSt = 1
        logK.fill(1)
        setLogs(0)
      }
      return
    }
    if (st === 2) {
      if (fireSt === 0) {
        logK.fill(1)
        setLogs(0)
      }
      startBurn((Number(s.age) || 0) + (liveSet ? 0 : ago))
      return
    }
    if (st === 3) {
      logK.fill(1)
      fireSt = 3
      burnT = BURN
      crack = 1
      heat = 0
      power = 0
      setLogs(1)
      return
    }
    if (st === 0) {
      // the rock came away (or a latecomer finds the pile)
      fireSt = 0
      burnT = -1
      crack = 0
      power = 0
      heat = 0
      logK.fill(0)
      setLogs(0)
    }
  }

  // =======================================================================================================
  // station 3: the forge in the chamber, the lens, the vein
  // =======================================================================================================
  const FZ = -11.2
  const FX = 2.8
  const wallXat = (y, z = FZ) => stage.wallX('r', z, y)
  // the forge: a stone block with a shallow fire pit, facing the visitor (+z)
  const forge = new THREE.Group()
  const stoneM = std('#6d6a68', { roughness: 0.95, flatShading: true })
  forge.add(mk(keep(new RoundedBoxGeometry(1.5, 0.85, 1.15, 2, 0.06)), stoneM, 0, 0.425, 0))
  forge.add(mk(keep(new RoundedBoxGeometry(1.62, 0.12, 1.27, 2, 0.04)), std('#4a4846', { roughness: 0.9 }), 0, 0.88, 0))
  const coalsMat = keep(new THREE.MeshStandardMaterial({ color: '#241812', emissive: '#ff5a1a', emissiveIntensity: 0, roughness: 0.9 }))
  const coals = mk(keep(new THREE.CylinderGeometry(0.62, 0.55, 0.08, 20)), coalsMat, 0, 0.96, 0)
  forge.add(coals)
  // a grate of iron bars round the coals' edge
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * TAU
    const bar = mk(keep(new THREE.BoxGeometry(0.05, 0.12, 0.05)), dark, Math.cos(a) * 0.66, 1.0, Math.sin(a) * 0.66)
    forge.add(bar)
  }
  // the dish the lump rests on
  forge.add(mk(keep(new THREE.CylinderGeometry(0.34, 0.3, 0.05, 18)), dark, 0, 1.02, 0))
  forge.add(hitBox(1.5, 0.5, 1.2, 0, 1.1, 0))
  place(forge, FX, FZ, 0)
  solids.push(box(FX, FZ, 1.55, 1.2, { rot: 0 }))
  // a sooty stone chimney behind the forge, up into the roof
  {
    const hood = new THREE.Group()
    hood.add(mk(keep(new RoundedBoxGeometry(1.9, 1.1, 0.7, 2, 0.05)), std('#2a2724', { roughness: 1 }), 0, 0, 0))
    hood.add(mk(keep(new RoundedBoxGeometry(1.3, 2.6, 0.55, 2, 0.05)), std('#1f1d1b', { roughness: 1 }), 0, 1.6, 0))
    place(hood, FX, FZ - 0.85, 0, 1.7)
    solids.push(box(FX, FZ - 0.85, 1.9, 0.7))
  }
  // the lump: black silver sulfide on the dish, enlarged, with five growing curls
  const lumpG = new THREE.Group()
  const lumpGeo = keep(new THREE.IcosahedronGeometry(0.2, 2))
  {
    const rn = random(55)
    const p = lumpGeo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (rn() - 0.5) * 0.22
      p.setXYZ(i, p.getX(i) * k * 1.15, p.getY(i) * k * 0.7, p.getZ(i) * k)
    }
    lumpGeo.computeVertexNormals()
  }
  const lumpMat = keep(new THREE.MeshStandardMaterial({ color: '#202026', roughness: 0.7, flatShading: true, emissive: '#ff5a1a', emissiveIntensity: 0 }))
  const lumpMesh = new THREE.Mesh(lumpGeo, lumpMat)
  lumpMesh.position.y = 0.13
  lumpG.add(lumpMesh)
  const wires = []
  for (let i = 0; i < NW; i++) {
    const a = (i / NW) * TAU + 0.6
    const w = curlWire(31 + i * 5, 0.5 + (i % 3) * 0.07, 0.1 + (i % 2) * 0.02, 0.02, 100)
    w.mesh.position.set(Math.cos(a) * 0.12, 0.2, Math.sin(a) * 0.12)
    w.mesh.rotation.y = -a * 0.5 + (i % 2 ? 0.4 : -0.4)
    w.set(0)
    lumpG.add(w.mesh)
    wires.push(w)
  }
  lumpG.add(hitSphere(0.3, 0, 0.2, 0))
  lumpG.position.set(FX, 1.04, FZ)
  root.add(lumpG)
  const lumpHitMesh = lumpG
  const forgeLight = new THREE.PointLight('#ff7a30', 0, 9, 2)
  forgeLight.position.set(FX, 1.4, FZ + 0.75)
  root.add(forgeLight)

  // the bellows, beside the forge
  const bellows = new THREE.Group()
  const bellowsTop = new THREE.Group()
  bellowsTop.add(mk(keep(new RoundedBoxGeometry(0.62, 0.05, 0.9, 2, 0.02)), std('#6b4a32'), 0, 0, 0))
  const handle = mk(keep(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 6)), dark, 0, 0.0, 0.5)
  handle.rotation.x = Math.PI / 2
  bellowsTop.add(handle)
  bellows.add(mk(keep(new RoundedBoxGeometry(0.62, 0.05, 0.9, 2, 0.02)), std('#6b4a32'), 0, 0.1, 0))
  const skin = mk(keep(new THREE.BoxGeometry(0.58, 0.3, 0.8)), std('#5a3a28', { roughness: 0.95 }), 0, 0.3, 0)
  bellows.add(skin)
  bellowsTop.position.set(0, 0.46, 0)
  bellows.add(bellowsTop)
  bellows.add(hitBox(0.8, 0.7, 1.1, 0, 0.3, 0.1))
  const BE = { x: FX + 1.45, z: FZ + 0.45 }
  place(bellows, BE.x, BE.z, 1.2, 0.34)
  // legs
  for (const [lx, lz] of [[-0.25, -0.35], [0.25, -0.35], [-0.25, 0.35], [0.25, 0.35]]) {
    const leg = mk(keep(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6)), std('#5a4030'), BE.x + lx, 0.17, BE.z + lz)
    root.add(leg)
  }
  solids.push(circle(BE.x, BE.z, 0.5))
  let bellowsT = -1
  // (a short dark pipe from the bellows to the coals)
  const pipe = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.03, 0.03, 1, 6)), dark)
  {
    const ax = new THREE.Vector3(BE.x - 0.3, 0.7, BE.z - 0.1)
    const bx = new THREE.Vector3(FX + 0.5, 0.96, FZ + 0.2)
    pipe.position.copy(ax).add(bx).multiplyScalar(0.5)
    pipe.scale.y = ax.distanceTo(bx)
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bx.clone().sub(ax).normalize())
    root.add(pipe)
  }

  // the rake, leaning on the forge's left side
  const rake = new THREE.Group()
  rake.add(mk(keep(new THREE.CylinderGeometry(0.02, 0.025, 1.9, 6)), std('#6b4a32'), 0, 0.95, 0))
  rake.add(mk(keep(new THREE.BoxGeometry(0.5, 0.05, 0.04)), dark, 0, 0.02, 0.0))
  rake.add(hitBox(0.7, 2.0, 0.5, 0, 0.95, 0))
  const RK = { x: FX - 1.05, z: FZ + 0.45 }
  const rakeLean = new THREE.Group()
  rakeLean.position.set(RK.x, 0.03, RK.z)
  rakeLean.rotation.z = -0.2
  rakeLean.add(rake)
  root.add(rakeLean)
  solids.push(circle(RK.x, RK.z, 0.25))
  let rakeT = -1

  // the lens on a swing arm from the wall, above the forge: the picture's close-up
  const LENS_R = 0.9
  const lensG = new THREE.Group()
  lensG.add(mk(keep(new THREE.CircleGeometry(LENS_R, 48)), keep(new THREE.MeshStandardMaterial({ color: '#10163a', emissive: '#0d1233', emissiveIntensity: 0.9, roughness: 0.5 })), 0, 0, 0))
  lensG.add(mk(keep(new THREE.TorusGeometry(LENS_R + 0.03, 0.05, 10, 56)), edgeOf(ORANGE), 0, 0, 0.02))
  const LX = FX
  const LY = 3.0
  place(lensG, LX, FZ + 0.25, 0, LY)
  {
    // hung from the roof on two rods
    const top = stage.ceilingAt(FZ) - 0.25
    for (const dx of [-0.45, 0.45]) {
      const y0 = LY + Math.sqrt(LENS_R * LENS_R - dx * dx)
      const rod = mk(keep(new THREE.CylinderGeometry(0.015, 0.015, top - y0, 6)), dark, LX + dx, (top + y0) / 2, FZ + 0.25)
      root.add(rod)
    }
  }
  // atoms on a hex lattice below the interface, a column of silver rising from its middle
  const AX = 0.17
  const AY = 0.15
  const Y_IF = -0.02 // the interface (the lump's top)
  const sites = []
  for (let j = 0; j < 6; j++) {
    const y = Y_IF - 0.1 - j * AY
    for (let i = -6; i <= 6; i++) {
      const x = (i + 0.5 * (j & 1)) * AX
      if (Math.hypot(x, y) < LENS_R - 0.12) sites.push({ x, y, sp: (i + j) % 2 ? 'S' : 'Ag', ph: Math.random() * 40, ph2: Math.random() * 40 })
    }
  }
  const sS = sites.filter(s => s.sp === 'S')
  const sAg = sites.filter(s => s.sp === 'Ag')
  const NC = 8
  const NF = 6
  const sMesh = new THREE.InstancedMesh(keep(new THREE.SphereGeometry(0.078, 14, 10)), sulfurMat, sS.length)
  const aMesh = new THREE.InstancedMesh(keep(new THREE.SphereGeometry(0.068, 14, 10)), atomAg, sAg.length + NC + NF)
  for (const m of [sMesh, aMesh]) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.position.z = 0.07
    lensG.add(m)
  }
  sS.forEach((s, i) => {
    m4.makeTranslation(s.x, s.y, 0)
    sMesh.setMatrixAt(i, m4)
  })
  let colOff = 0
  let colTarget = 0
  const flyers = Array.from({ length: NF }, () => ({ t: -1, from: 0, a: new THREE.Vector2(), b: new THREE.Vector2() }))
  const srcState = sAg.map(() => ({ gone: -1 })) // seconds since it left (it returns fresh after a while)
  let arrivals = 0
  const COL_Y0 = Y_IF + 0.1
  const lensTx = (text, size, x, y, c = '#dfe6ff') => {
    const t = makeText(text, { font: 'body', size, color: c, maxWidth: size < 0.07 ? 0.62 : 1.5 })
    t.position.set(x, y, 0.12)
    lensG.add(t)
    return t
  }
  const lensLabels = {
    sulfide: lensTx(E.hair.lens.sulfide, 0.075, 0, -LENS_R - 0.14, '#ffe9a8'),
    wire: lensTx(E.hair.lens.wire, 0.07, 0.34, 0.5, '#e9edf7'),
    ion: lensTx(E.hair.lens.root, 0.06, -0.48, 0.42, '#ffd9a0'),
  }
  // an arrow beside the column
  {
    const arrow = new THREE.Group()
    const am = std('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.4 })
    arrow.add(mk(keep(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6)), am, 0, 0, 0))
    arrow.add(mk(keep(new THREE.ConeGeometry(0.04, 0.09, 8)), am, 0, 0.25, 0))
    arrow.position.set(0.3, 0.2, 0.09)
    lensG.add(arrow)
  }
  const temp = { sparkle: 0 }
  function stepLens(dt, t) {
    const T = Tnow
    const gk = growthK(T)
    const melting = melt > 0.02
    const amp = melting ? 0.06 : T < T_ARG ? 0.004 + 0.008 * (T / T_ARG) : 0.03 + 0.03 * smooth(T_ARG, T_GROW, T)
    const wander = T >= T_ARG
    let ia = 0
    // arrivals: silver atoms near the column's foot leave their place and run to its root
    arrivals += dt * 2.4 * gk * (1 - melt)
    while (arrivals >= 1) {
      arrivals -= 1
      const f = flyers.find(fl => fl.t < 0)
      if (!f) break
      let best = -1
      let bd = 9
      sAg.forEach((s, i) => {
        if (srcState[i].gone >= 0) return
        const d = Math.hypot(s.x, s.y - Y_IF) + Math.random() * 0.25
        if (d < bd) {
          bd = d
          best = i
        }
      })
      if (best < 0) break
      srcState[best].gone = 0
      f.t = 0
      f.from = best
      f.a.set(sAg[best].x, sAg[best].y)
    }
    sAg.forEach((s, i) => {
      const st = srcState[i]
      let vis = 1
      if (st.gone >= 0) {
        st.gone += dt
        vis = st.gone < 0.4 ? clamp(1 - st.gone / 0.3) : st.gone > 1.6 ? clamp((st.gone - 1.6) / 0.5) : 0
        if (st.gone > 2.1) st.gone = -1
      }
      const wx = wander ? Math.sin(t * 1.6 + s.ph) * amp + Math.sin(t * 0.7 + s.ph2) * amp * 0.7 : Math.sin(t * 9 + s.ph) * amp
      const wy = wander ? Math.sin(t * 1.3 + s.ph2) * amp * 0.8 + Math.cos(t * 0.6 + s.ph) * amp * 0.5 : Math.sin(t * 8 + s.ph2) * amp
      m4.compose(vv.set(s.x + wx, s.y + wy, 0), qq.identity(), ss.setScalar(Math.max(0.001, vis)))
      aMesh.setMatrixAt(ia++, m4)
    })
    // the column: atoms in a line, shifted up as silver arrives
    colOff = damp(colOff, colTarget, 5, dt)
    const span = NC * AY
    for (let k = 0; k < NC; k++) {
      const y = COL_Y0 + ((k * AY + colOff) % span)
      const up = y < LENS_R - 0.16 ? smooth(COL_Y0, COL_Y0 + 0.08, y) : 0
      m4.compose(vv.set(Math.sin(t * 2 + k) * 0.004, y, 0), qq.identity(), ss.setScalar(Math.max(0.001, up)))
      aMesh.setMatrixAt(ia++, m4)
    }
    // the flyers' runs
    for (const f of flyers) {
      let sc = 0.001
      if (f.t >= 0) {
        f.t += dt / 0.9
        const k = clamp(f.t)
        const x = lerp(f.a.x, 0, k) + Math.sin(k * Math.PI) * 0.1 * Math.sign(f.a.x || 1)
        const y = lerp(f.a.y, COL_Y0 - 0.02, k) - Math.sin(k * Math.PI) * 0.06
        vv.set(x, y, 0.02)
        sc = 1
        if (f.t >= 1) {
          f.t = -1
          colTarget += AY
          sc = 0.001
          if (colTarget > 1000) colTarget -= 1000
        }
      } else vv.set(0, 0, 0)
      m4.compose(vv, qq.identity(), ss.setScalar(sc))
      aMesh.setMatrixAt(ia++, m4)
    }
    aMesh.instanceMatrix.needsUpdate = true
    // the sulfur lattice trembles a little
    sS.forEach((s, i) => {
      const a = melting ? 0.04 : T >= T_ARG ? 0.006 : 0.003
      m4.compose(vv.set(s.x + Math.sin(t * 7 + s.ph) * a, s.y + Math.sin(t * 6 + s.ph2) * a, 0), qq.identity(), ss.setScalar(1))
      sMesh.setMatrixAt(i, m4)
    })
    sMesh.instanceMatrix.needsUpdate = true
    temp.sparkle = gk
  }

  // the plate under the lens: temperature, the phase, the length of the longest curl
  const plate = board({ w: 1.3, h: 0.36, cw: 1024, ch: 284, edge: ORANGE })
  place(plate.group, FX, FZ + 0.62, 0, 0.46)
  let plateKey = ''
  const mmNow = () => Math.max(...wire) * MM_FULL * (1 - smooth(0, 0.6, melt))
  function drawPlate() {
    const W = E.hair.plate
    const ph = phaseOf(Tnow)
    const c = ph === 'melt' ? '#ff6a3a' : ph === 'grow' ? '#8cf0a8' : ph === 'argentite' ? '#ffd36a' : '#bcd0ff'
    plate.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'alphabetic'
      g.textAlign = 'left'
      g.fillStyle = '#ffffff'
      g.font = font(700, 112)
      g.fillText(`${Math.round(Tnow)} °C`, 36, 118)
      g.fillStyle = c
      g.font = font(700, 46)
      g.fillText(W[ph], 400, 70)
      g.fillStyle = '#c9d1ee'
      g.font = font(600, 36, 'Nunito')
      g.fillText(`${W.wire}: ${fmtN(mmNow(), 1)} mm`, 400, 118)
      // the thermometer bar with the thresholds
      const x0 = 36
      const x1 = w - 36
      const y = 200
      const xOf = v => x0 + (clamp(v, 0, T_MAX) / T_MAX) * (x1 - x0)
      g.fillStyle = 'rgba(255,255,255,0.1)'
      g.fillRect(x0, y - 14, x1 - x0, 28)
      const bar = g.createLinearGradient(x0, 0, x1, 0)
      bar.addColorStop(0, '#6a8cff')
      bar.addColorStop(0.5, '#ffd36a')
      bar.addColorStop(1, '#ff5a2a')
      g.fillStyle = bar
      g.fillRect(x0, y - 14, xOf(Tnow) - x0, 28)
      g.fillStyle = '#ffffff'
      for (const v of [T_ARG, T_GROW, T_MELT]) g.fillRect(xOf(v) - 2, y - 24, 4, 48)
      g.fillStyle = '#aab6e6'
      g.font = font(600, 28, 'Nunito')
      g.textAlign = 'center'
      for (const [v, s] of [[T_ARG, '177'], [T_GROW, '450'], [T_MELT, '830']]) g.fillText(s, xOf(v), y + 58)
    })
  }

  // the vein in the right wall (calcite) and its curls
  // the vein: a bulge of rock on the left wall (a pillar the miners left) with a pale calcite vein across its face
  const PX = -1.6
  const PZ = -11.4
  const PW = 1.9
  const PH = 2.7
  const PD = 1.1
  const FACE = PZ + PD / 2
  {
    const geo = keep(new RoundedBoxGeometry(PW, PH, PD, 6, 0.14))
    const rn = random(19)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (rn() - 0.5) * 0.04
      p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k)
    }
    geo.computeVertexNormals()
    const pillar = mk(geo, std('#76737a', { roughness: 0.95, flatShading: true }), PX, PH / 2, PZ)
    root.add(pillar)
    solids.push(box(PX, PZ, PW + 0.1, PD + 0.1))
    // the vein: a ribbon on the face, from low left to high right
    const n = 16
    const pos = []
    const idx = []
    const veinAt = k => ({ x: lerp(PX - 0.7, PX + 0.55, k) + 0.12 * Math.sin(k * 5), y: lerp(0.18, PH - 0.12, k) })
    for (let i = 0; i <= n; i++) {
      const k = i / n
      const v = veinAt(k)
      const wd = 0.2 + 0.07 * Math.sin(k * 9)
      pos.push(v.x - wd, v.y, FACE + 0.015, v.x + wd, v.y, FACE + 0.015)
    }
    for (let i = 0; i < n; i++) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3)
    const vg = keep(new THREE.BufferGeometry())
    vg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    vg.setIndex(idx)
    vg.computeVertexNormals()
    root.add(new THREE.Mesh(vg, new THREE.MeshStandardMaterial({ color: '#b5ab96', roughness: 0.8, side: THREE.DoubleSide })))
    // little pale crystals in it
    const rc = random(12)
    const cm = new THREE.InstancedMesh(keep(new THREE.OctahedronGeometry(0.035, 0)), std('#ece4d0', { roughness: 0.35, flatShading: true }), 46)
    for (let i = 0; i < 46; i++) {
      const v = veinAt(rc())
      m4.compose(vv.set(v.x + (rc() - 0.5) * 0.36, v.y + (rc() - 0.5) * 0.1, FACE + 0.03), qq.setFromEuler(new THREE.Euler(rc() * 3, rc() * 3, rc() * 3)), ss.setScalar(0.6 + rc() * 1.3))
      cm.setMatrixAt(i, m4)
    }
    cm.raycast = () => {}
    root.add(cm)
  }
  const veinCurls = new THREE.Group()
  root.add(veinCurls)
  for (const [k, h, sd] of [[0.28, 0.5, 3], [0.55, 0.6, 8], [0.82, 0.46, 14]]) {
    const v = { x: lerp(PX - 0.7, PX + 0.55, k) + 0.12 * Math.sin(k * 5), y: lerp(0.18, PH - 0.12, k) }
    const w = curlWire(sd * 3, h, h * 0.3, 0.02, 80)
    const g = new THREE.Group()
    g.position.set(v.x, v.y, FACE + 0.02)
    g.rotation.x = 0.5 // leaning out of the rock toward the visitor
    g.add(w.mesh)
    g.add(hitSphere(0.24, 0, h * 0.5, 0))
    veinCurls.add(g)
  }
  // the plaque of ideas, on a stand between the pillar and the forge
  const ideas = board({ w: 1.3, h: 0.82, cw: 768, ch: 484, edge: ORANGE, y: 1.25, legs: 1.25 })
  {
    const x = 1.2
    const z = -10.0
    place(ideas.group, x, z, Math.atan2(1.2 - x, -7.2 - z))
    solids.push(circle(x, z, 0.5))
  }
  let idea = 0
  let ideasKey = ''
  function drawIdeas() {
    const W = E.hair.ideas
    ideas.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'alphabetic'
      g.textAlign = 'left'
      g.fillStyle = '#ffc07a'
      let ts = 40
      g.font = font(700, ts)
      while (g.measureText(W.title).width > w - 60 && ts > 20) g.font = font(700, --ts)
      g.fillText(W.title, 30, 56)
      const rows = [W.hot, W.cool, W.unknown]
      rows.forEach((r, i) => {
        const y0 = 90 + i * 118
        const on = idea === i + 1 || (i === 2 && idea === 0 && tappedCurl)
        g.fillStyle = on ? 'rgba(255,176,103,0.28)' : 'rgba(255,255,255,0.07)'
        g.fillRect(24, y0, w - 48, 104)
        g.fillStyle = '#ffffff'
        g.font = font(700, 32)
        g.fillText(r.head, 40, y0 + 40)
        g.fillStyle = '#c9d1ee'
        g.font = font(600, 25, 'Nunito')
        wrap(g, r.line, 40, y0 + 78, w - 80, 28)
      })
    })
  }

  // ---- the forge's doings ----
  function setT(v, fromSlider = false) {
    Ttarget = clamp(v, T_ROOM, T_MAX)
    if (Ttarget > T_ARG) touchedHot = true
    plateKey = ''
    if (fromSlider) slid('hair')
  }
  const spokenPhase = { v: 'acanthite' }
  function sayPhase(force = false) {
    const ph = phaseOf(Ttarget)
    if (!force && ph === spokenPhase.v) return
    spokenPhase.v = ph
    say(at(E.hair.says[ph], level()))
  }
  function tapBellows() {
    bellowsT = 0
    play('tap')
    const next = Ttarget >= T_MAX ? T_MAX : Math.min(T_MAX, Ttarget + 150)
    setT(next)
    sayPhase(true)
    ex.discover('hair', hairPanel, 3.5)
    share('hair')
  }
  function tapRake() {
    rakeT = 0
    usedRake = true
    play('select')
    setT(T_ROOM)
    say(at(E.hair.says.rake, level()))
    ex.discover('hair', hairPanel, 3.5)
    share('hair')
  }
  function newLump() {
    melt = 0
    wire.fill(0)
    play('select')
    say(at(E.hair.says.fresh, level()))
    share('hair')
  }
  function tapLump() {
    if (melt > 0.3) newLump()
    else say(at(Tnow >= T_GROW ? E.hair.says.lumpHot : E.hair.says.lump, level()))
  }
  function tapCurl() {
    tappedCurl = true
    idea = (idea % 3) + 1
    ideasKey = ''
    play('discover')
    say(at(E.hair.says[`idea${idea}`], level()))
    ex.discover('hair', hairPanel, 3.5)
    share('hair')
  }
  const hairPanel = l => ({
    title: E.hair.title,
    color: ORANGE,
    blocks: [
      ...paras(E.hair.panel[depth(l)]),
      { p: E.hair.tip },
      {
        slider: {
          label: E.hair.slider,
          min: T_ROOM,
          max: T_MAX,
          step: 5,
          value: Ttarget,
          onInput: v => {
            setT(v, true)
            sayPhaseLater()
            ex.discover('hair', hairPanel, 3.5)
          },
          format: v => `${Math.round(v)} °C`,
          live: () => Ttarget,
        },
      },
      {
        buttons: [
          { label: E.hair.buttons.hotter, onClick: () => tapBellows() },
          { label: E.hair.buttons.cooler, onClick: () => tapRake() },
          { label: E.hair.buttons.fresh, onClick: () => newLump() },
          { label: E.hair.buttons.vein, onClick: () => tapCurl() },
        ],
      },
    ],
  })
  let phaseTimer = null
  function sayPhaseLater() {
    phaseTimer = 0.9
  }
  clickable(bellows, () => tapBellows(), { reach: 7 })
  clickable(rakeLean, () => tapRake(), { reach: 8 })
  clickable(lumpHitMesh, () => tapLump(), { reach: 7 })
  clickable(veinCurls, () => tapCurl(), { reach: 9 })
  ex.add({
    id: 'hair',
    x: 1.2,
    z: -7.4,
    radius: 3.4,
    manual: true,
    label: E.hair.label,
    verb: () => (!touchedHot ? E.hair.verbBellows : !tappedCurl ? E.hair.verbVein : Ttarget >= T_MAX || melt > 0.3 ? E.hair.verbRake : E.hair.verbBellows),
    focus: { x: 1.1, y: 1.6, z: FZ, size: 3.8, width: 6.2 },
    act: () => ctx.showPanel(hairPanel),
  })
  const hairState = () => ({ T: Math.round(Ttarget / 5) * 5, m: Math.round(melt * 20) / 20, w: Math.round((wire.reduce((a, b) => a + b, 0) / NW) * 50) / 50, idea })
  const hairSet = (s, liveSet) => {
    const v = Number(s?.T)
    if (Number.isFinite(v) && v !== Ttarget) {
      Ttarget = clamp(v, T_ROOM, T_MAX)
      if (liveSet && v > Tnow) bellowsT = 0
      if (Ttarget > T_ARG) touchedHot = true
    }
    const m = Number(s?.m)
    const w = Number(s?.w)
    if (!liveSet || Number.isFinite(m)) {
      if (Number.isFinite(m)) melt = clamp(m)
      if (Number.isFinite(w)) for (let i = 0; i < NW; i++) wire[i] = clamp(w * wireSpeed[i])
    } else if (Number.isFinite(m) && m < melt) melt = clamp(m)
    if (Number.isFinite(w) && w === 0) wire.fill(0)
    if (Number.isFinite(Number(s?.idea)) && Number(s.idea) !== idea) {
      idea = Number(s.idea)
      ideasKey = ''
    }
    plateKey = ''
  }

  // =======================================================================================================
  // frame by frame
  // =======================================================================================================
  let drawT = 0
  let lastLevel = level()
  const ember = new THREE.Color()
  const camPos = new THREE.Vector3()
  updates.push((dt, t) => {
    const p = ctx.engine?.player?.pos
    if (p) stage.setInside(smooth(2.6, -2.2, p.z))
    // --- station 1
    if (butt >= 0) {
      butt += dt
      const lunge = butt < 0.45 ? smooth(0, 0.45, butt) : butt < 0.75 ? 1 : 1 - smooth(0.75, 1.7, butt)
      const dip = butt < 0.4 ? smooth(0, 0.4, butt) : butt < 1.5 ? 1 - smooth(1.0, 1.7, butt) * 0 : 0
      ox.position.set(OXP.x + outDir.x * lunge * 0.5, 0, OXP.z + outDir.z * lunge * 0.5)
      oxHead.rotation.z = -0.55 * smooth(0, 0.35, butt) * (butt < 1.3 ? 1 : 1 - smooth(1.3, 1.9, butt))
      void dip
      if (butt > 0.46 && flakeLive === 0) {
        flakeLive = 1
        flake.visible = true
        flake.position.copy(glintAt)
        flakeV.copy(glintDir).multiplyScalar(1.4)
        flakeV.y += 1.8
        rockG.position.y = 0.02
        play('discover')
        showButted()
        say(at(E.ox.says.glint, level()))
      }
      if (butt > 1.9) {
        butt = -1
        ox.position.set(OXP.x, 0, OXP.z)
        oxHead.rotation.z = 0
      }
    }
    if (flakeLive === 1) {
      flakeV.y -= 9.8 * dt
      flake.position.addScaledVector(flakeV, dt)
      flake.rotation.x += dt * 5
      flake.rotation.z += dt * 3
      if (flake.position.y < 0.05) {
        flake.position.y = 0.05
        flakeLive = 2
      }
    }
    rockG.position.y = damp(rockG.position.y, 0, 8, dt)
    if (glint.visible) {
      glint.scale.setScalar(0.5 + 0.12 * Math.sin(t * 5))
      glint.material.rotation = Math.sin(t * 1.5) * 0.3
    }
    if (lumpT >= 0) {
      lumpT += dt
      const to = handAt()
      const k = smooth(0, 1.2, lumpT)
      lump.position.lerpVectors(lumpFrom, to, k)
      lump.position.y += Math.sin(k * Math.PI) * 0.4
      lump.rotation.y += dt * 1.2
      c1.arm.rotation.z = lerp(0.1, 2.6, smooth(0.3, 1.2, lumpT))
      if (lumpT >= 99) lump.position.copy(to)
      if (lumpT >= 1.2) {
        lump.position.copy(to).y += Math.sin(t * 2) * 0.02
        c1.arm.rotation.z = 2.6
      }
    }
    // --- station 2
    if (logDrive >= 0) {
      logDrive += dt
      let done = true
      for (let i = 0; i < NLOG; i++) {
        const wait = i * 0.02
        logK[i] = clamp((logDrive - wait) / 0.9)
        if (logK[i] < 1) done = false
      }
      setLogs(0)
      if (done) {
        logDrive = -1
        fireSt = 1
        fbKey = ''
      }
    }
    if (torchT >= 0) {
      torchT += dt
      const k = torchT < 0.9 ? smooth(0, 0.9, torchT) : torchT < 1.5 ? 1 : 1 - smooth(1.5, 2.3, torchT)
      const target = new THREE.Vector3(0, 0.3, faceZ() + 0.55)
      torchStick.position.set(lerp(0, target.x - TORCH.x, k), lerp(0.25, target.y, k), lerp(0, target.z - TORCH.z, k))
      torchStick.rotation.x = -0.9 * k
      if (torchT > 1.2 && fireSt === 1) startBurn(0)
      if (torchT > 2.4) {
        torchT = -1
        torchStick.position.set(0, 0.25, 0)
        torchStick.rotation.x = 0
      }
    }
    torchFlame.scale.set(0.3 + 0.05 * Math.sin(t * 12), 0.46 + 0.07 * Math.sin(t * 9 + 1), 1)
    if (toolT >= 0) {
      toolT += dt
      const k = toolT < 0.6 ? smooth(0, 0.6, toolT) : toolT < 2.0 ? 1 : 1 - smooth(2.0, 2.6, toolT)
      hammer.position.set(lerp(-0.15, 0, k) + (1 - k) * 0, 0.56 + k * 0.7, lerp(0.02, 0, k))
      const strike = toolT > 0.6 && toolT < 2.0 ? Math.abs(Math.sin((toolT - 0.6) * 7)) : 0
      // hammer and pick swing at the face from their rack: shown as lifting and knocking
      hammer.position.y = 0.56 + k * (0.7 + strike * 0.25)
      pick.position.y = 0.56 + k * (0.55 + (1 - strike) * 0.2)
      stage.group.position.x = toolT > 0.6 && toolT < 2.0 ? Math.sin(toolT * 60) * 0.004 : 0
      if (toolT > 1.9 && fireSt === 3) afterStrike()
      if (toolT > 2.7) {
        toolT = -1
        hammer.position.set(-0.15, 0.56, 0.02)
        pick.position.set(0.18, 0.56, -0.03)
        stage.group.position.x = 0
      }
    }
    // the burn
    if (fireSt === 2) {
      burnT += dt
      const u = burnT / BURN
      power = u < 0.2 ? smooth(0, 0.2, u) : u < 0.55 ? 1 : 1 - smooth(0.55, 0.9, u)
      heat = damp(heat, power, 2, dt)
      crack = clamp((u - 0.15) / 0.75)
      setLogs(clamp(u * 1.2))
      if (burnT >= BURN) {
        fireSt = 3
        crack = 1
        power = 0
        say(at(E.fire.says.cooled, level()))
        fbKey = ''
      }
      fbKey = ''
    } else if (fireSt === 3) {
      heat = damp(heat, 0, 1.2, dt)
      power = 0
    } else {
      heat = damp(heat, 0, 4, dt)
    }
    heatPlane.material.opacity = heat * 0.9
    crackPlane.material.opacity = clamp(crack) * 0.85
    heatPlane.visible = heat > 0.01
    crackPlane.visible = crack > 0.01
    facePos = damp(facePos, fires * 0.125, 3, dt)
    stage.setAdvance(facePos)
    // the face's overlays follow it (children of the end face); the logs and light too
    fireLight.position.set(0, 1.0, faceZ() + 1.5)
    fireLight.intensity = power * (6 + Math.sin(t * 11) * 1.2 + Math.sin(t * 17) * 0.8) + heat * 1.5
    // flames: born along the stack while the fire burns
    for (const f of flames) {
      if (f.life < 0) {
        if (power > 0.05) {
          f.wait -= dt
          if (f.wait <= 0 && Math.random() < power) {
            f.life = 0
            f.x = (Math.random() - 0.5) * 2.7
            f.z = faceZ() + 0.55 + Math.random() * 0.3
            f.wait = 0.05 + Math.random() * 0.15
            f.s.visible = true
          }
        } else f.s.visible = false
        continue
      }
      f.life += dt / (0.55 + Math.random() * 0.001)
      const k = f.life
      const rise = 0.25 + k * (0.55 + 0.7 * power)
      f.s.position.set(f.x + Math.sin(t * 5 + f.x * 3) * 0.05, rise, f.z)
      const sc = (0.5 + 0.35 * Math.sin(Math.min(1, k) * Math.PI)) * (0.55 + 0.7 * power)
      f.s.scale.set(sc * 0.8, sc * 1.25, 1)
      f.s.material.opacity = clamp(1 - k) * clamp(power * 1.5)
      if (k >= 1) {
        f.life = -1
        f.s.visible = false
      }
    }
    // smoke: rises to the loft and goes through its gaps
    for (const s of smokes) {
      if (s.life < 0) {
        if (power > 0.1 && Math.random() < dt * 14 * power) {
          s.life = 0
          s.s.visible = true
          s.s.position.set((Math.random() - 0.5) * 2.4, 0.9, faceZ() + 0.6 + Math.random() * 0.4)
          s.v.set((Math.random() - 0.5) * 0.15, 0.55 + Math.random() * 0.35, 0.1 + Math.random() * 0.25)
        }
        continue
      }
      s.life += dt
      s.s.position.addScaledVector(s.v, dt)
      s.s.position.x += Math.sin(t * 0.8 + s.seed) * dt * 0.1
      const sc = 0.6 + s.life * 0.7
      s.s.scale.set(sc, sc, 1)
      const y = s.s.position.y
      const fade = clamp((stage.loftY - 0.1 - y) / 0.5)
      s.s.material.opacity = Math.min(clamp(s.life / 0.5), fade) * 0.34
      if (y > stage.loftY || s.life > 7) {
        s.life = -1
        s.s.visible = false
      }
    }
    // the falling chunks
    for (const c of chunks) {
      if (c.life < 0) continue
      c.life += dt
      c.v.y -= 9.8 * dt
      c.m.position.addScaledVector(c.v, dt)
      c.m.rotation.x += c.spin.x * dt
      c.m.rotation.y += c.spin.y * dt
      if (c.m.position.y < 0.1) {
        c.m.position.y = 0.1
        c.v.set(c.v.x * 0.3, 0, c.v.z * 0.3)
        c.spin.multiplyScalar(0.2)
      }
      if (c.life > 3.2) {
        c.life = -1
        c.m.visible = false
      }
    }
    // --- station 3
    Tnow = damp(Tnow, Ttarget, 1.4, dt)
    if (Math.abs(Tnow - Ttarget) < 0.3) Tnow = Ttarget
    const gk = growthK(Tnow)
    if (Tnow >= T_MELT) melt = clamp(melt + dt * 0.18)
    for (let i = 0; i < NW; i++) {
      const rate = (MM_HALF_HOUR / 30) * MIN_PER_S * gk * wireSpeed[i] // mm per second
      if (melt < 0.02) wire[i] = clamp(wire[i] + (rate / MM_FULL) * dt)
      wires[i].set(wire[i] * (1 - smooth(0, 0.6, melt)))
    }
    const hot = clamp((Tnow - 120) / 700)
    coalsMat.emissiveIntensity = Tnow > 80 ? 0.4 + hot * 2.2 + (Tnow > 80 ? Math.sin(t * 9) * 0.06 : 0) : 0
    lumpMat.emissiveIntensity = clamp((Tnow - 400) / 500) * 0.55 * (1 - melt * 0.3)
    lumpMesh.scale.set(1 + melt * 0.5, 1 - melt * 0.6, 1 + melt * 0.5)
    if (melt > 0.02) lumpMat.color.set('#3a2c26').lerp(ember.set('#ff8a3c'), melt * 0.6)
    else lumpMat.color.set('#202026')
    forgeLight.intensity = clamp((Tnow - 100) / 750) * 4.2 + (Tnow > 150 ? Math.sin(t * 8) * 0.15 : 0)
    if (bellowsT >= 0) {
      bellowsT += dt
      const k = Math.sin(clamp(bellowsT / 0.6) * Math.PI)
      bellowsTop.position.y = 0.46 - k * 0.2
      skin.scale.y = 1 - k * 0.6
      skin.position.y = 0.3 - k * 0.09
      if (bellowsT > 0.7) bellowsT = -1
    }
    if (rakeT >= 0) {
      rakeT += dt
      const k = Math.sin(clamp(rakeT / 1.2) * Math.PI)
      rakeLean.rotation.z = -0.2 - k * 0.7
      rakeLean.position.x = RK.x + k * 0.45
      if (rakeT > 1.3) {
        rakeT = -1
        rakeLean.rotation.z = -0.2
        rakeLean.position.x = RK.x
      }
    }
    if (phaseTimer !== null) {
      phaseTimer -= dt
      if (phaseTimer <= 0) {
        phaseTimer = null
        sayPhase()
      }
    }
    stepLens(dt, t)
    // the boards, a few times a second
    drawT += dt
    const lvNow = level()
    const fk = `${Math.round(Tnow)}|${Math.round(mmNow() * 10)}|${lvNow}`
    if (fk !== plateKey) {
      plateKey = fk
      drawPlate()
    }
    const yk = `${year}|${lvNow}`
    if (yk !== ybKey) {
      ybKey = yk
      drawYear()
    }
    const bk = `${fires}|${fireSt}|${Math.round(clamp(burnT / BURN) * 40)}|${lvNow}`
    if (bk !== fbKey) {
      fbKey = bk
      drawFire()
    }
    const ik = `${idea}|${tappedCurl}|${lvNow}`
    if (ik !== ideasKey) {
      ideasKey = ik
      drawIdeas()
    }
    lastLevel = lvNow
    drawT = 0
  })
  setYear(Y0)
  drawYear()
  drawFire()
  drawPlate()
  drawIdeas()

  const rayTo = (v, from = null) => {
    const cam = ctx.camera.position
    return new THREE.Ray(from ?? cam.clone(), v.clone().sub(from ?? cam).normalize())
  }
  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 15.5 },
    cameraPitchMax: 0.5,
    spawn: { x: 0, z: 13.0, yaw: 0 },
    hostSpot: { x: -1.8, z: 12.4, yaw: 0.5 },
    back: { x: 0, z: 16.4, rot: Math.PI },
    stand: { x: -3.6, z: 11.6, rot: 0.9 },
    parts: {
      stage,
      rayTo,
      ox: {
        tap: what => (what === 'glint' ? tapGlint() : tapOx()),
        slide: y => {
          setYear(y, true)
          slid('ox')
        },
        moment: y => milestone(y),
        glintAt: () => glint.position.clone(),
        oxAt: () => new THREE.Vector3(OXP.x, 1.0, OXP.z),
        get state() {
          return { oxSt, year }
        },
      },
      fire: {
        tap: what => (what === 'torch' ? lightTorch() : what === 'tools' ? strikeFace() : stackLogs()),
        setN: n => setFires(n),
        skip: () => {
          if (fireSt === 2) burnT = BURN - 0.05
        },
        logsAt: () => new THREE.Vector3(-1.7, 0.4, -15.3),
        torchAt: () => new THREE.Vector3(TORCH.x, 0.9, TORCH.z),
        toolsAt: () => new THREE.Vector3(TOOLS.x, 0.5, TOOLS.z),
        get state() {
          return { fireSt, fires, burnT, crack, heat }
        },
      },
      hair: {
        tap: what => (what === 'rake' ? tapRake() : what === 'curl' ? tapCurl() : what === 'lump' ? tapLump() : tapBellows()),
        setT: v => setT(v, true),
        settle: () => {
          Tnow = Ttarget
        },
        grow: s => {
          const n = Math.max(1, Math.round(s * 60))
          for (let i = 0; i < n; i++) updates[0](1 / 60, i / 60)
        },
        bellowsAt: () => new THREE.Vector3(BE.x, 0.7, BE.z),
        rakeAt: () => new THREE.Vector3(rakeLean.position.x, 1.0, rakeLean.position.z),
        lumpAt: () => new THREE.Vector3(FX, 1.25, FZ),
        curlAt: () => veinCurls.children[0].localToWorld(new THREE.Vector3(0, 0.15, 0)),
        get state() {
          return { Tnow, Ttarget, melt, mm: mmNow(), wire: [...wire] }
        },
      },
    },
    panels: { ox: oxPanel, fire: firePanel, hair: hairPanel },
    shared: {
      ox: { get: oxState, set: oxSet },
      fire: { get: fireState, set: fireSet },
      hair: { get: hairState, set: hairSet },
    },
    attach() {
      stage.town.setYear(year)
    },
    update(dt, t) {
      stage.update(dt, t)
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const o of own) o.dispose?.()
    },
  }
}
