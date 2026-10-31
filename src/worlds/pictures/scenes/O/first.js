// Oxygen's picture "The great oxygen surprise" as a room (docs/knowledge/picture-rooms.md): a shallow sea
// about 2.5 billion years ago (stages/shore.js): a tidal flat of wet sand and microbial mats, stromatolites
// in the warm shallows, bare red land, a volcano smoking far off, a hazy sky; no plants, no animals. Two
// cuts in time open in the rocky headlands on either side: the same rock today. Three things to do, each
// step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the
// prompt names the next tap, E opens the station's panel, whose buttons and slider do the same:
// - the first oxygen makers: a giant microscope over a chain of blue-green cells, cyanobacteria. Tap its
//   mirror and sunlight comes up through the lens: water molecules drift into the cells and bubbles of
//   oxygen rise out (a sunlight slider sets how fast). Tap the mud beside it and the lens looks into the
//   mud, where microbes that need no oxygen live: as the oxygen seeps down they move away, deeper. Tap the
//   green mat to look back;
// - the rusting sea: a glass case of ancient seawater with dissolved iron in it (invisible; tinted green at
//   Scientist level). Tap the microbes on top: a sunny season, they bloom, their oxygen meets the iron and
//   rust snows down into a red layer; tap again, a quiet season, a grey layer of silica. A slider for
//   millions of years piles thousands more layers on top, buries them into rock (the rust becomes dark
//   hematite, the silica red jasper), lifts them, and at today the cut in the right headland opens on
//   Karijini's gorge in Western Australia, the same bands as its walls;
// - stromatolites alive today: the cut in the left headland opens on Hamelin Pool in Shark Bay. Tap the
//   big stromatolite to cut it open (domed layers, a living mat on top), tap the cut face for a close look
//   (sticky microbes catching sand grains), and slide the years: it grows about 0.3 mm a year, so the ruler
//   beside it counts thousands of years for under a metre.
// Not the air wing's Great Oxidation exhibit (wings/oxygen/airGoe.js: stromatolites giving off oxygen, the
// curve of oxygen in the air): here, where the oxygen comes from, what it did to the iron and to the
// microbes that had no use for it, and how stromatolites grow today. All three are shared in a room
// (src/net/shared.js); the words, panels and discoveries stay each one's. parts.<station>.tap(...) does what
// a tap does, for the probes; parts.rayTo(point) aims a real tap.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, clamp, lerp, damp, random, hdr, standingScreen } from '../../../wings/noble/kit.js'
import { shoreStage, SEA_LEVEL, stromatoliteGeometry } from '../../stages/shore.js'
import { softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { FIRST_WORDS } from './first.words.js'

export const WORDS = FIRST_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- where things stand (metres; the spawn looks along -z, out to sea) ----
const Z0 = -2.2 // the shoreline's mean z
const SPAWN = { x: 0, z: 5.4 }
const BACK = { x: 0, z: 9.3 }
const STAND = { x: -2.5, z: 3.8 }
const HOST = { x: 2.4, z: 4.0 }
const LENS = { x: 0, z: -2.9 } // the microscope, its front toward S1
const S1 = { x: 0, z: -0.3 }
const CUT_R = { x: 7.0, z: -3.2 } // the right headland's cut (Karijini), toward S2
const S2 = { x: 3.8, z: 0.1 }
const CUT_L = { x: -7.0, z: -3.2 } // the left headland's cut (Hamelin Pool), toward S3
const S3 = { x: -4.7, z: -0.83 } // on the line from the cut to (-3.8, 0.1), nearer: the stromatolite is small
const C_MAKERS = '#62e0a0'
const C_SEA = '#ff8a5a'
const C_LIVING = '#f0c870'
const CUT = { w: 4.0, h: 3.0, y0: 0.16, depth: 7.2, rockW: 6.8, rockH: 6.1 }

/** A group standing at p, its +z toward `toward` (the visitor's right is its +x). */
function rigAt(p, toward) {
  const g = new THREE.Group()
  g.position.set(p.x, 0, p.z)
  g.rotation.y = Math.atan2(toward.x - p.x, toward.z - p.z)
  g.updateMatrixWorld(true)
  return g
}

/** Words drawn in 3D, with a dark edge so they read against the bright shore. */
const label = (text, size, color = '#ffffff', opts = {}) => makeText(text, { size, color, outlineWidth: size * 0.12, outlineColor: '#1d120c', ...opts })

// =====================================================================================
// A cut in time: a cliff with a ragged opening, glowing at its rim, and a box of today behind it
// =====================================================================================

function timeCut({ rockMat, boulders, color, sign, seed, light }) {
  const { w, h, y0, depth, rockW, rockH } = CUT
  const group = new THREE.Group()
  const rnd = random(seed)
  const hw = rockW / 2
  // the cliff's outline (a ragged top) and the cut through it
  const shape = new THREE.Shape()
  shape.moveTo(-hw, -0.8)
  shape.lineTo(hw, -0.8)
  for (let i = 1; i <= 6; i++) shape.lineTo(hw - rnd() * 0.35, (i / 6) * rockH * 0.86)
  for (let i = 0; i <= 10; i++) shape.lineTo(hw * 0.92 - (i / 10) * hw * 1.84, rockH - rnd() * 0.9 - (i % 3 === 1 ? 0.5 : 0))
  for (let i = 5; i >= 1; i--) shape.lineTo(-hw + rnd() * 0.35, (i / 6) * rockH * 0.84)
  shape.closePath()
  const rim = []
  const N = 64
  for (let i = 0; i < N; i++) {
    // round the opening (a rounded rectangle), each point pushed in or out a little: a ragged tear
    const a = (i / N) * TAU
    const cx = Math.cos(a)
    const cy = Math.sin(a)
    const k = 1 / Math.max(Math.abs(cx) / (w / 2), Math.abs(cy) / (h / 2))
    const sq = 0.82 * k + 0.18 * Math.min(w, h) / 2
    const j = 1 + (rnd() - 0.5) * 0.09 + (i % 2 ? 0.025 : -0.02)
    rim.push(new THREE.Vector2(cx * sq * j, y0 + h / 2 + cy * sq * j))
  }
  shape.holes.push(new THREE.Path(rim))
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 1, curveSegments: 2 })
  geo.translate(0, 0, -0.9)
  const uv = geo.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.32, uv.getY(i) * 0.32)
  const face = new THREE.Mesh(geo, rockMat)
  face.receiveShadow = true
  group.add(face)
  // the rock round the box behind (two-sided: with the diorama hidden, a closed cut must not see through it)
  const shellMat = rockMat.clone()
  shellMat.side = THREE.DoubleSide
  const iw = rockW - 1.2
  const ih = rockH - 0.9
  const back = -depth
  for (const [pw, ph, x, y, z, ry, rx] of [
    [depth, ih + 0.3, -hw + 0.2, ih / 2, (back - 0.9) / 2, -Math.PI / 2, 0],
    [depth, ih + 0.3, hw - 0.2, ih / 2, (back - 0.9) / 2, Math.PI / 2, 0],
    [rockW, depth, 0, ih + 0.2, (back - 0.9) / 2, 0, -Math.PI / 2],
    [rockW, ih + 0.3, 0, ih / 2, back - 0.15, Math.PI, 0],
  ]) {
    const g = new THREE.PlaneGeometry(pw, ph)
    const u = g.attributes.uv
    for (let i = 0; i < u.count; i++) u.setXY(i, (u.getX(i) * pw) / 3, (u.getY(i) * ph) / 3)
    const m = new THREE.Mesh(g, shellMat)
    m.position.set(x, y, z)
    m.rotation.set(rx, ry, 0)
    group.add(m)
  }
  // boulders over the edges, so the headland reads as a heap of rock (outside the box: never in the view)
  const r2 = random(seed + 7)
  for (let i = 0; i < 15; i++) {
    const b = new THREE.Mesh(boulders[i % boulders.length], rockMat)
    const side = i % 3
    const s = 1.1 + r2() * 1.3
    // a boulder of scale s reaches about 1.15 s from its centre: kept that far outside the walls
    if (side === 0) b.position.set(-hw + 0.2 - s * 0.75, ih * (0.15 + r2() * 0.75), back * (0.15 + r2() * 0.75))
    else if (side === 1) b.position.set(hw - 0.2 + s * 0.75, ih * (0.15 + r2() * 0.75), back * (0.15 + r2() * 0.75))
    else b.position.set((r2() - 0.5) * rockW * 0.9, ih + 0.2 + s * 0.45, back * (0.15 + r2() * 0.8))
    b.scale.set(s, s * 0.7, s)
    b.rotation.set(0, r2() * 3, 0)
    group.add(b)
  }
  // and some bulging out of the face, away from the cut and its sign, so the cliff is not a flat wall
  // (a boulder goes only where it fits: never in front of the opening)
  for (let i = 0; i < 12; i++) {
    const s = 0.5 + r2() * 0.6
    const x = (r2() - 0.5) * (rockW - 0.8)
    const y = 0.3 + r2() * (rockH - 1.2)
    const beside = Math.abs(x) > w / 2 + 0.25 + s * 0.65
    const above = y > y0 + h + 1.0 + s * 0.5
    if (!beside && !above) continue
    const b = new THREE.Mesh(boulders[(i + 1) % boulders.length], rockMat)
    // flattened, so nothing of it reaches through the face into the box
    b.position.set(x, y, -0.05)
    b.scale.set(s * 1.2, s, s * 0.45)
    b.rotation.set(0, 0, r2() * 3)
    group.add(b)
  }
  // a few at the foot of the face, either side of the cut
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(boulders[(i + (sx > 0 ? 1 : 0)) % boulders.length], rockMat)
      const s = 0.55 + r2() * 0.5
      b.position.set(sx * (w / 2 + 0.9 + i * 1.1 + r2() * 0.3), s * 0.25, 0.35 + r2() * 0.4)
      b.scale.set(s * 1.3, s * 0.8, s)
      b.rotation.set(0, r2() * 3, 0)
      b.castShadow = true
      group.add(b)
    }
  }

  // the rim: a glowing ragged line round the cut, sparks drifting off it
  const curve = new THREE.CatmullRomCurve3(rim.map(p => V3(p.x, p.y, 0.07)), true)
  const rimMat = new THREE.MeshBasicMaterial({ color: hdr(color, 1.6), toneMapped: false })
  const rimMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.045, 6, true), rimMat)
  group.add(rimMesh)
  const SP = light ? 24 : 60
  const spPos = new Float32Array(SP * 3)
  const spSeed = Array.from({ length: SP }, () => [r2(), r2(), r2()])
  const spGeo = new THREE.BufferGeometry()
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3))
  const spMat = new THREE.PointsMaterial({ color: hdr(color, 1.4), map: softGlow(), size: 0.09, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const sparks = new THREE.Points(spGeo, spMat)
  sparks.frustumCulled = false
  sparks.raycast = () => {}
  group.add(sparks)

  // the veil while it is closed: dark mist swirling, a seam of light down the middle
  const veilMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpen: { value: 1 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uStir: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uOpen; uniform float uTime; uniform vec3 uColor; uniform float uStir;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float a = atan(p.y, p.x);
        float r = length(p * vec2(1.0, 1.25));
        float swirl = sin(a * 3.0 + r * 14.0 - uTime * (0.6 + uStir * 2.0)) * 0.5 + 0.5;
        vec3 c = mix(vec3(0.08, 0.05, 0.06), uColor * 0.35, swirl * 0.5 * (0.4 + uStir));
        // the seam opening in the middle as time comes nearer
        float seam = exp(-abs(p.x) * (60.0 - 50.0 * uStir)) * (1.0 - smoothstep(0.35, 0.5, abs(p.y)));
        c += uColor * seam * 1.4;
        float alpha = (1.0 - uOpen) * (1.0 - smoothstep(0.44, 0.52, max(abs(p.x), abs(p.y) * 0.95)));
        gl_FragColor = vec4(c, alpha);
      }`,
  })
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.3, h + 0.3), veilMat)
  veil.position.set(0, y0 + h / 2, -0.45)
  veil.raycast = () => {}
  group.add(veil)

  const signText = label(sign, 0.24, '#ffffff', { maxWidth: rockW - 1 })
  signText.position.set(0, y0 + h + 0.42, 0.45)
  group.add(signText)

  // the diorama of today: everything inside x -iw/2..iw/2, y 0..ih, z -0.9..-depth
  const dio = new THREE.Group()
  group.add(dio)
  let open = 1
  return {
    group,
    dio,
    iw,
    ih,
    depth,
    signText,
    setOpen(k, stir = 0) {
      open = k
      veilMat.uniforms.uOpen.value = k
      veilMat.uniforms.uStir.value = stir
      veil.visible = k < 0.999
      // closed, it hides what is behind it (the sea's sheet is drawn after it otherwise)
      veilMat.depthWrite = k < 0.5
      dio.visible = k > 0.01
    },
    get open() {
      return open
    },
    update(t) {
      veilMat.uniforms.uTime.value = t
      const pulse = 0.75 + 0.25 * Math.sin(t * 2.1 + seed)
      rimMat.color.copy(hdr(color, (0.6 + open * 0.9) * pulse + 0.25))
      for (let i = 0; i < SP; i++) {
        const [u, v, s] = spSeed[i]
        const k = (u + t * (0.05 + s * 0.05)) % 1
        const p = curve.getPointAt(k)
        const life = (v + t * 0.4) % 1
        spPos[i * 3] = p.x * (1 + life * 0.08)
        spPos[i * 3 + 1] = p.y + life * 0.35
        spPos[i * 3 + 2] = 0.1 + life * 0.25
      }
      spGeo.attributes.position.needsUpdate = true
    },
  }
}

/** A banded rock surface: horizontal bands in `palette`, wavy, as the gorge's walls and the polished sample. */
function bandTexture({ seed, palette, px = 1024, w = 64, min = 3, max = 16 }) {
  const rnd = random(seed)
  return canvasTex(w, px, (g, cw, ch) => {
    let y = 0
    let k = 0
    while (y < ch) {
      const t = min + rnd() * (max - min)
      g.fillStyle = palette[k % palette.length][Math.floor(rnd() * palette[k % palette.length].length)]
      g.fillRect(0, y, cw, t + 1)
      y += t
      k++
    }
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,230,200'},${0.05 + rnd() * 0.08})`
      g.fillRect(rnd() * cw, rnd() * ch, 2 + rnd() * 8, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

// =====================================================================================
// The room
// =====================================================================================

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const paras = list => list.map(p => ({ p }))
  const sci = () => level() === 'scientist'
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  const syncText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const glow = softGlow()

  // ---- the stage: keep the stations' ground clear of mounds and mats ----
  // (the headlands: round their middles, 4 m behind their cuts)
  const mid = (c, s) => {
    const a = Math.atan2(s.x - c.x, s.z - c.z)
    return [c.x - Math.sin(a) * 4, c.z - Math.cos(a) * 4]
  }
  const clear = [[LENS.x, LENS.z, 1.8], [S1.x, S1.z, 1.6], [...mid(CUT_R, S2), 5.6], [...mid(CUT_L, S3), 5.6], [CUT_R.x, CUT_R.z, 2.5], [CUT_L.x, CUT_L.z, 2.5], [S2.x, S2.z, 1.6], [S3.x, S3.z, 1.6], [SPAWN.x, SPAWN.z, 1.5], [4.15, -4.36, 1.0], [8.36, -0.15, 0.6]]
  const stage = shoreStage({ light, z0: Z0, keep: (x, z, r) => clear.every(([cx, cz, cr]) => Math.hypot(x - cx, z - cz) > cr + r) })
  root.add(stage.group)
  const solids = stage.solids
  const gy = (x, z) => stage.groundAt(x, z)

  const M = {
    brass: new THREE.MeshStandardMaterial({ color: '#c9a24f', roughness: 0.35, metalness: 0.75 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2c2a30', roughness: 0.6, metalness: 0.4 }),
    edge: new THREE.MeshStandardMaterial({ color: '#4fd1c5', emissive: '#4fd1c5', emissiveIntensity: 0.9, roughness: 0.4, metalness: 0.2 }),
    glass: new THREE.MeshStandardMaterial({ color: '#e8fbff', transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1, depthWrite: false }),
    o: new THREE.MeshStandardMaterial({ color: '#e8302a', roughness: 0.35, emissive: '#5a0806', emissiveIntensity: 0.6 }),
    h: new THREE.MeshStandardMaterial({ color: '#f2f4f8', roughness: 0.4, emissive: '#30343c', emissiveIntensity: 0.4 }),
    bubble: new THREE.MeshStandardMaterial({ color: '#d6fff4', transparent: true, opacity: 0.3, roughness: 0.1, emissive: '#7fe8d0', emissiveIntensity: 0.25, depthWrite: false }),
  }
  const ball = new THREE.SphereGeometry(1, 14, 10)

  // =====================================================================================
  // 1. The first oxygen makers: a giant microscope over cyanobacteria
  // =====================================================================================
  const lens = rigAt(LENS, S1)
  root.add(lens)
  const LC = V3(0, 1.55, 0) // the lens's centre (local)
  const LR = 0.8
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LR, 0.06, 12, 72), M.brass)
    ring.position.copy(LC)
    lens.add(ring)
    // the yoke holding it, the post and the feet
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.62, 8), M.brass)
      arm.position.set(s * (LR + 0.06), LC.y - 0.3, 0)
      lens.add(arm)
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), M.brass)
      knob.position.set(s * (LR + 0.06), LC.y, 0)
      lens.add(knob)
    }
    const yoke = new THREE.Mesh(new THREE.TorusGeometry(LR + 0.06, 0.03, 8, 40, Math.PI), M.brass)
    yoke.rotation.z = Math.PI
    yoke.position.set(0, LC.y - 0.6, 0)
    yoke.scale.y = 0.18
    lens.add(yoke)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.62, 10), M.brass)
    post.position.set(0, 0.36, 0)
    lens.add(post)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.5
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.6, 8), M.brass)
      leg.position.set(Math.cos(a) * 0.22, 0.12, Math.sin(a) * 0.22)
      leg.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1)
      lens.add(leg)
    }
    const glassDisc = new THREE.Mesh(new THREE.CircleGeometry(LR, 48), M.glass)
    glassDisc.position.set(LC.x, LC.y, 0.04)
    glassDisc.raycast = () => {}
    lens.add(glassDisc)
    solids.push(circle(LENS.x, LENS.z, 0.45))
  }
  // the view inside: its own backgrounds, the cells and the mud, cross-faded
  const viewBackTex = canvasTex(256, 256, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.75, '#b8b8b8')
    grd.addColorStop(1, '#5a5a5a')
    g.fillStyle = grd
    g.fillRect(0, 0, s, s)
    const r = random(41)
    for (let i = 0; i < 120; i++) {
      g.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.15})`
      g.beginPath()
      g.arc(r() * s, r() * s, 1 + r() * 2.5, 0, TAU)
      g.fill()
    }
  })
  textures.push(viewBackTex)
  const backMat = new THREE.MeshBasicMaterial({ map: viewBackTex, color: '#1a6a6a' })
  const back = new THREE.Mesh(new THREE.CircleGeometry(LR - 0.01, 48), backMat)
  back.position.set(LC.x, LC.y, -0.16)
  lens.add(back)
  // sunlight through the specimen, a warm glow behind the cells
  const shineMat = new THREE.MeshBasicMaterial({ map: glow, color: hdr('#fff0b8', 1.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const shine = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), shineMat)
  shine.position.set(LC.x - 0.1, LC.y - 0.1, -0.14)
  shine.raycast = () => {}
  lens.add(shine)
  const matView = new THREE.Group()
  const mudView = new THREE.Group()
  for (const v of [matView, mudView]) {
    v.position.set(LC.x, LC.y, -0.06)
    lens.add(v)
  }
  // the filament: a chain of blue-green cells in a clear sheath
  const cellMat = new THREE.MeshStandardMaterial({ color: '#35a88c', roughness: 0.45, emissive: '#2bdc94', emissiveIntensity: 0.1 })
  const wallMat = new THREE.MeshStandardMaterial({ color: '#1f6a52', roughness: 0.5 })
  const CELLS = 7
  const cells = []
  for (let i = 0; i < CELLS; i++) {
    const x = (i - (CELLS - 1) / 2) * 0.165
    const y = -0.04 + 0.05 * Math.sin(i * 0.9)
    const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.07, 6, 14).rotateZ(Math.PI / 2), cellMat)
    c.position.set(x, y, 0)
    matView.add(c)
    cells.push(c)
    if (i > 0) {
      const sep = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 20).rotateY(Math.PI / 2), wallMat)
      sep.position.set(x - 0.0825, y - 0.025 * Math.cos(i * 0.9), 0)
      matView.add(sep)
    }
  }
  const sheath = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 1.12, 6, 16).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#b8f2df', transparent: true, opacity: 0.16, roughness: 0.2, depthWrite: false }))
  sheath.position.y = -0.03
  sheath.raycast = () => {}
  matView.add(sheath)
  // water molecules drifting in, oxygen bubbles rising out
  const WMAX = light ? 10 : 18
  const BMAX = light ? 10 : 16
  const wO = new THREE.InstancedMesh(ball, M.o, WMAX)
  const wH = new THREE.InstancedMesh(ball, M.h, WMAX * 2)
  const bO = new THREE.InstancedMesh(ball, M.o, BMAX * 2)
  const bB = new THREE.InstancedMesh(ball, M.bubble, BMAX)
  for (const m of [wO, wH, bO, bB]) {
    m.count = 0
    m.frustumCulled = false
    m.raycast = () => {}
    matView.add(m)
  }
  const waters = []
  const bubbles = []
  let waterClock = 0
  let o2Owed = 0
  // the labels in the lens (kid words or sci formulas)
  const lensLabels = []
  const twoLabels = (kid, formula, x, y, view, size = 0.065) => {
    // (wrapped: the lens is round, and some languages say it at length)
    const k = label(kid, size, '#ffffff', { maxWidth: 0.95 })
    k.position.set(x, y, 0.08)
    view.add(k)
    let s = null
    if (formula) {
      s = formulaText(formula, { size: size * 1.2, color: '#ffffff' })
      s.position.set(x, y, 0.08)
      view.add(s)
    }
    lensLabels.push({ k, s })
  }
  twoLabels(E.makers.signs.water, 'H2O', -0.42, -0.5, matView)
  twoLabels(E.makers.signs.oxygen, 'O2', 0.38, 0.52, matView)
  twoLabels(E.makers.signs.cells, null, 0, -0.2, matView, 0.06)

  // the mud: dark, grainy, microbes that need no oxygen
  const mudTex = canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#2a1d18'
    g.fillRect(0, 0, s, s)
    const r = random(61)
    for (let i = 0; i < 700; i++) {
      const v = r()
      g.fillStyle = v < 0.6 ? `rgba(70,52,40,${0.3 + r() * 0.4})` : v < 0.9 ? `rgba(20,14,12,${0.4 + r() * 0.4})` : 'rgba(120,96,70,0.4)'
      g.beginPath()
      g.ellipse(r() * s, r() * s, 2 + r() * 6, 1.5 + r() * 4, r() * 3, 0, TAU)
      g.fill()
    }
    // darker toward the bottom: deeper, no light, no oxygen
    const grd = g.createLinearGradient(0, 0, 0, s)
    grd.addColorStop(0, 'rgba(80,60,30,0.15)')
    grd.addColorStop(1, 'rgba(0,0,0,0.55)')
    g.fillStyle = grd
    g.fillRect(0, 0, s, s)
  })
  textures.push(mudTex)
  const mudBack = new THREE.Mesh(new THREE.CircleGeometry(LR - 0.02, 48), new THREE.MeshBasicMaterial({ map: mudTex }))
  mudBack.position.z = -0.09
  mudView.add(mudBack)
  const microbeMat = new THREE.MeshStandardMaterial({ color: '#9a7cb8', roughness: 0.5, emissive: '#3a2350', emissiveIntensity: 0.5 })
  const microbeMat2 = new THREE.MeshStandardMaterial({ color: '#7f8aa8', roughness: 0.5, emissive: '#232a40', emissiveIntensity: 0.5 })
  const microbes = []
  {
    const r = random(71)
    for (let i = 0; i < 13; i++) {
      const rod = i % 3 !== 2
      const m = new THREE.Mesh(rod ? new THREE.CapsuleGeometry(0.028, 0.08, 4, 10) : new THREE.SphereGeometry(0.038, 12, 8), rod ? microbeMat : microbeMat2)
      const a = r() * TAU
      const rr = Math.sqrt(r()) * 0.55
      const base = V3(Math.cos(a) * rr, -0.15 + Math.sin(a) * rr * 0.8, 0)
      m.position.copy(base)
      m.rotation.z = r() * TAU
      mudView.add(m)
      microbes.push({ m, base, ph: r() * TAU, y: base.y })
    }
  }
  const mudO2 = new THREE.InstancedMesh(ball, M.o, 16)
  mudO2.count = 0
  mudO2.frustumCulled = false
  mudO2.raycast = () => {}
  mudView.add(mudO2)
  const seeping = []
  twoLabels(E.makers.signs.anaerobes, null, 0, -0.6, mudView, 0.05)
  twoLabels(E.makers.signs.oxygen, 'O2', 0, 0.58, mudView)
  const mudOxLabel = lensLabels[lensLabels.length - 1]
  mudView.scale.setScalar(0.001)
  mudView.visible = false

  // the mirror below and behind the lens, as a microscope's: the Sun is behind the lens, so a mirror there,
  // tilted up to it, sends its light up through the cells toward the visitor (off to the side, clear of the post)
  const MIR = V3(0.62, 0.5, -0.7)
  const mirror = new THREE.Group()
  mirror.position.copy(MIR)
  lens.add(mirror)
  const mirrorFace = new THREE.MeshBasicMaterial({ color: '#4a5058' })
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), mirrorFace)
    disc.position.z = 0.016
    const backing = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.03, 32).rotateX(Math.PI / 2), M.brass)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 8), new THREE.MeshBasicMaterial({ visible: false }))
    mirror.add(disc, backing, hit)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, MIR.y, 8), M.brass)
    stem.position.set(MIR.x, MIR.y / 2, MIR.z)
    lens.add(stem)
    const fork = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.02, 6, 24, Math.PI), M.brass)
    fork.rotation.z = Math.PI
    fork.position.copy(MIR)
    lens.add(fork)
  }
  // the beam from the mirror up into the lens
  const beamMat = new THREE.MeshBasicMaterial({ map: glow, color: hdr('#fff2c0', 1.1), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.22, 1, 24, 1, true), beamMat)
  {
    const a = mirror.position
    const b = V3(LC.x, LC.y, -0.2)
    beam.position.copy(a).add(b).multiplyScalar(0.5)
    beam.scale.y = a.distanceTo(b)
    beam.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize())
  }
  beam.raycast = () => {}
  lens.add(beam)

  // the green mat the lens looks at, on a low stromatolite behind it, and the mud bank beside it
  const stromGeo = stromatoliteGeometry(24)
  const greenTex = canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#3b7a4c'
    g.fillRect(0, 0, s, s)
    const r = random(83)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '90,160,100' : '24,60,36'},${0.3 + r() * 0.4})`
      g.fillRect(r() * s, r() * s, 2 + r() * 4, 2 + r() * 4)
    }
  }, { repeat: true })
  textures.push(greenTex)
  const greenMat = new THREE.MeshStandardMaterial({ map: greenTex, roughness: 0.9, emissive: '#1d5a34', emissiveIntensity: 0.25 })
  const matMound = new THREE.Mesh(stromGeo, greenMat)
  {
    const p = lens.localToWorld(V3(1.15, 0, -0.55))
    const foot = gy(p.x, p.z)
    matMound.position.set(1.15, foot - 0.04, -0.55)
    matMound.scale.set(1.1, SEA_LEVEL - foot + 0.1, 0.9)
    lens.add(matMound)
    solids.push(circle(p.x, p.z, 0.5))
  }
  const mudTex2 = canvasTex(128, 256, (g, w, h) => {
    // a cut through the mat and the mud under it: green, then purple, then black
    const bands = [['#3e8a4e', 0.08], ['#6fa45a', 0.04], ['#a46a8a', 0.12], ['#6a4a5a', 0.1], ['#2c2424', 0.3], ['#171313', 0.36]]
    let y = 0
    for (const [c, k] of bands) {
      g.fillStyle = c
      g.fillRect(0, y, w, k * h + 1)
      y += k * h
    }
    const r = random(91)
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,240,220'},${0.06 + r() * 0.1})`
      g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2)
    }
  })
  textures.push(mudTex2)
  const mudBank = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.4, 0.6, 2, 0.04), [
    new THREE.MeshStandardMaterial({ map: mudTex2, roughness: 0.95 }),
    new THREE.MeshStandardMaterial({ map: mudTex2, roughness: 0.95 }),
    greenMat,
    new THREE.MeshStandardMaterial({ color: '#171313' }),
    new THREE.MeshStandardMaterial({ map: mudTex2, roughness: 0.95 }),
    new THREE.MeshStandardMaterial({ map: mudTex2, roughness: 0.95 }),
  ])
  {
    const p = lens.localToWorld(V3(-1.3, 0, 0.3))
    mudBank.position.set(-1.3, gy(p.x, p.z) + 0.16, 0.3)
    mudBank.rotation.y = 0.25
    mudBank.castShadow = true
    lens.add(mudBank)
    solids.push(circle(p.x, p.z, 0.5, { y1: 0.4 }))
    const t = label(E.makers.signs.mudBank, 0.11, '#ffffff')
    t.position.set(-1.3, mudBank.position.y + 0.36, 0.42)
    lens.add(t)
    const t2 = label(E.makers.signs.mat, 0.11, '#ffffff')
    t2.position.set(1.75, SEA_LEVEL + 0.3, -0.35)
    lens.add(t2)
    const t3 = label(E.makers.signs.mirror, 0.1, '#ffffff')
    t3.position.set(MIR.x + 0.1, MIR.y + 0.52, MIR.z + 0.1)
    lens.add(t3)
  }

  // ---- its state, its steps and its panel ----
  const MK = { sun: 0, shown: 0, view: 'mat', viewK: 0, mud: false, n: 0 }
  let sunSend = null
  function setSun(v, now) {
    MK.sun = clamp(Math.round(Number(v) * 100) / 100)
    if (now) return share('makers')
    if (!sunSend) {
      sunSend = setTimeout(() => {
        sunSend = null
        share('makers')
      }, 250)
    }
  }
  const makersHint = () => {
    const H = E.makers.hints
    if (MK.view === 'mud') return MK.sun < 0.3 ? H.sun : H.mat
    if (MK.sun < 0.3) return H.sun
    return MK.mud ? H.shade : H.mud
  }
  const makersPanel = l => ({
    title: E.makers.title,
    color: C_MAKERS,
    blocks: [
      { slider: { label: E.makers.sunLabel, min: 0, max: 1, step: 0.05, value: MK.sun, onInput: v => { setSun(v); findOnce('makers', makersPanel, 0) }, format: v => `${Math.round(v * 100)} %`, live: () => MK.sun } },
      { buttons: [
        { label: MK.sun >= 0.3 ? E.makers.verbs.shade : E.makers.verbs.sun, onClick: () => makersTap('mirror') },
        { label: MK.view === 'mud' ? E.makers.verbs.mat : E.makers.verbs.mud, onClick: () => makersTap(MK.view === 'mud' ? 'mat' : 'mud') },
      ] },
      ...paras(E.makers.panel[depth(l)]),
    ],
  })
  function makersTap(thing) {
    const l = level()
    MK.n++
    if (thing === 'mirror' || thing === 'cells') {
      if (thing === 'cells' && MK.view === 'mat' && MK.sun >= 0.3) {
        say(at(E.makers.says.mat, l), C_MAKERS)
        return
      }
      const on = MK.sun < 0.3
      MK.sun = on ? 1 : 0
      play(on ? 'select' : 'tap')
      share('makers')
      say(at(on ? (MK.view === 'mud' ? E.makers.says.mud : E.makers.says.sun) : E.makers.says.shade, l), C_MAKERS)
      findOnce('makers', makersPanel, 3)
    } else if (thing === 'mud') {
      MK.view = 'mud'
      MK.mud = true
      play('select')
      share('makers')
      say(at(MK.sun >= 0.3 ? E.makers.says.mud : E.makers.says.mudDark, l), C_MAKERS)
      findOnce('makers', makersPanel, 3)
    } else if (thing === 'mat') {
      MK.view = 'mat'
      play('tap')
      share('makers')
      say(at(E.makers.says.mat, l), C_MAKERS)
    }
    refresh(makersPanel)
  }
  ex.add({
    id: 'makers',
    x: S1.x,
    z: S1.z,
    radius: 2.0,
    label: E.makers.label,
    verb: makersHint,
    manual: true,
    focus: { x: LENS.x, y: 1.25, z: LENS.z, size: 2.2, width: 3.4 },
    act: () => ctx.showPanel(makersPanel),
  })
  clickable(mirror, () => makersTap('mirror'))
  for (const c of cells) clickable(c, () => makersTap('cells'), { when: () => MK.viewK < 0.5 })
  clickable(mudBank, () => makersTap('mud'))
  clickable(matMound, () => makersTap('mat'), { reach: 5 })
  clickable(mudBack, () => makersTap('mat'), { when: () => MK.viewK > 0.5 })

  const o = new THREE.Object3D()
  // lit: its face turned up to the Sun (it faces +z untilted); dark: turned down and away
  const tiltOn = new THREE.Euler(-1.2, 0, 0)
  const tiltOff = new THREE.Euler(0.5, 0, 0)
  updates.push((dt, t) => {
    MK.shown = damp(MK.shown, MK.sun, 3, dt)
    MK.viewK = damp(MK.viewK, MK.view === 'mud' ? 1 : 0, 3.2, dt)
    const s = MK.shown
    // the mirror turns to the Sun and lights up; the beam and the glow behind the cells
    mirror.rotation.x = lerp(tiltOff.x, tiltOn.x, s)
    mirrorFace.color.setRGB(lerp(0.26, 2.2, s), lerp(0.29, 2.05, s), lerp(0.33, 1.6, s))
    beamMat.opacity = 0.32 * s
    shineMat.opacity = 0.9 * s * (1 - MK.viewK * 0.6)
    cellMat.emissiveIntensity = 0.1 + 0.85 * s
    backMat.color.setRGB(lerp(0.07, 0.42, s), lerp(0.3, 0.52, s), lerp(0.32, 0.4, s))
    // the two views: the cells shrink away, then the mud comes up (and back)
    const k1 = ease(clamp(1 - MK.viewK * 2))
    const k2 = ease(clamp(MK.viewK * 2 - 1))
    matView.scale.setScalar(Math.max(0.001, k1))
    mudView.scale.setScalar(Math.max(0.001, k2))
    matView.visible = k1 > 0.01
    mudView.visible = k2 > 0.01
    for (const [i, c] of cells.entries()) c.position.y = -0.04 + 0.05 * Math.sin(i * 0.9) + Math.sin(t * 1.2 + i * 0.7) * 0.012
    // water molecules drift toward the cells while the light is on; each one taken in, half an O2 owed
    if (s > 0.15 && matView.visible) {
      waterClock += dt * s
      while (waterClock > 0.45 && waters.length < WMAX) {
        waterClock -= 0.45
        const a = Math.random() * TAU
        waters.push({ p: V3(Math.cos(a) * 0.62, -0.25 - Math.random() * 0.4, 0.02), cell: Math.floor(Math.random() * CELLS), spin: Math.random() * TAU })
      }
    }
    for (let i = waters.length - 1; i >= 0; i--) {
      const w = waters[i]
      const target = cells[w.cell].position
      const d = target.clone().sub(w.p)
      const dist = d.length()
      if (dist < 0.06 || s < 0.05) {
        waters.splice(i, 1)
        if (s >= 0.05) o2Owed += 0.5
        continue
      }
      w.p.addScaledVector(d.normalize(), dt * (0.12 + 0.18 * s))
      w.spin += dt * 2
    }
    while (o2Owed >= 1 && bubbles.length < BMAX) {
      o2Owed -= 1
      const c = cells[Math.floor(Math.random() * CELLS)].position
      bubbles.push({ p: V3(c.x, c.y + 0.07, 0.03), v: 0.1 + Math.random() * 0.08, ph: Math.random() * TAU, r: 0.05 })
    }
    if (bubbles.length >= BMAX) o2Owed = Math.min(o2Owed, 1)
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]
      b.p.y += b.v * dt
      b.p.x += Math.sin(t * 2 + b.ph) * dt * 0.05
      b.r = Math.min(0.075, b.r + dt * 0.01)
      if (Math.hypot(b.p.x, b.p.y) > LR - 0.06) bubbles.splice(i, 1)
    }
    wO.count = waters.length
    wH.count = waters.length * 2
    waters.forEach((w, i) => {
      o.position.copy(w.p)
      o.scale.setScalar(0.03)
      o.rotation.set(0, 0, 0)
      o.updateMatrix()
      wO.setMatrixAt(i, o.matrix)
      for (const [j, sx] of [[0, 1], [1, -1]]) {
        o.position.set(w.p.x + Math.cos(w.spin + sx * 0.9) * 0.034, w.p.y + Math.sin(w.spin + sx * 0.9) * 0.034, w.p.z)
        o.scale.setScalar(0.019)
        o.updateMatrix()
        wH.setMatrixAt(i * 2 + j, o.matrix)
      }
    })
    bB.count = bubbles.length
    bO.count = bubbles.length * 2
    bubbles.forEach((b, i) => {
      const edge = 1 - span(LR - 0.2, LR - 0.06, Math.hypot(b.p.x, b.p.y))
      o.position.copy(b.p)
      o.scale.setScalar(b.r * edge + 0.001)
      o.updateMatrix()
      bB.setMatrixAt(i, o.matrix)
      for (const [j, sx] of [[0, 1], [1, -1]]) {
        o.position.set(b.p.x + sx * 0.021 * edge, b.p.y, b.p.z + 0.01)
        o.scale.setScalar(0.022 * edge + 0.001)
        o.updateMatrix()
        bO.setMatrixAt(i * 2 + j, o.matrix)
      }
    })
    for (const m of [wO, wH, bB, bO]) m.instanceMatrix.needsUpdate = true
    // the mud: oxygen seeping down from the mat while the light is on, the microbes moving deeper
    const seep = s * (MK.view === 'mud' ? 1 : 0)
    if (seep > 0.3 && seeping.length < 8 && Math.random() < dt * 2.5) seeping.push({ p: V3((Math.random() - 0.5) * 0.9, 0.62, 0.03), spin: Math.random() * TAU })
    for (let i = seeping.length - 1; i >= 0; i--) {
      const q = seeping[i]
      q.p.y -= dt * 0.09
      q.spin += dt
      if (q.p.y < 0.05 || seep < 0.1) seeping.splice(i, 1)
    }
    mudO2.count = seeping.length * 2
    seeping.forEach((q, i) => {
      for (const [j, sx] of [[0, 1], [1, -1]]) {
        o.position.set(q.p.x + Math.cos(q.spin) * 0.022 * sx, q.p.y + Math.sin(q.spin) * 0.022 * sx, q.p.z)
        o.scale.setScalar(0.022)
        o.updateMatrix()
        mudO2.setMatrixAt(i * 2 + j, o.matrix)
      }
    })
    mudO2.instanceMatrix.needsUpdate = true
    const away = MK.shown * (MK.view === 'mud' ? 1 : 0.5)
    for (const mb of microbes) {
      // the oxygen comes from above: the microbes go down, into the dark, and squeeze together there
      const want = lerp(mb.base.y, -0.4 - (mb.base.y + 0.7) * 0.12, away)
      mb.y = damp(mb.y, want, 0.9, dt)
      mb.m.position.set(mb.base.x * (1 - away * 0.25) + Math.sin(t * 1.3 + mb.ph) * 0.02, mb.y + Math.cos(t * 1.7 + mb.ph) * 0.012, 0)
      mb.m.rotation.z += dt * 0.4 * Math.sin(mb.ph)
    }
  })

  // =====================================================================================
  // 2. The rusting sea: a glass case of ancient seawater; a cut in the right headland onto Karijini
  // =====================================================================================
  const rightCut = timeCut({ rockMat: stage.mats.rock, boulders: stage.boulders, color: '#4fd1c5', sign: E.sea.signs.cut, seed: 11, light })
  const rig2 = rigAt(CUT_R, S2)
  rig2.add(rightCut.group)
  root.add(rig2)
  // the headland is solid: its whole footprint
  {
    const c = rig2.localToWorld(V3(0, 0, -(CUT.depth + 0.9) / 2))
    solids.push(box(c.x, c.z, CUT.rockW, CUT.depth + 0.9, { rot: rig2.rotation.y }))
  }
  // --- Karijini today: a gorge of banded iron, stepped walls, a green pool ---
  const gorgeHits = []
  {
    const d = rightCut.dio
    const { iw, ih, depth: D } = rightCut
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(iw, D - 0.9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#4a2a20', roughness: 1 }))
    floor.position.set(0, 0.14, -(D + 0.9) / 2)
    d.add(floor)
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(iw, D - 1.8).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#2f7466', roughness: 0.08, metalness: 0.15, emissive: '#0d3c34', emissiveIntensity: 0.5 }))
    pool.position.set(0, 0.3, -1.8 - (D - 1.8) / 2)
    d.add(pool)
    // the stepped walls: thin layers of rock, each a slab sticking out by its own amount
    const PAL = ['#8e3420', '#a8452c', '#3d3438', '#2c2a2e', '#6b4a4a', '#b8653a', '#c79a72', '#5a2a24']
    const slab = new THREE.BoxGeometry(1, 1, 1)
    const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.85, color: '#ffffff' })
    const r = random(301)
    const layers = []
    for (const s of [-1, 1]) {
      let y = 0
      while (y < ih) {
        const t = 0.08 + r() * 0.24
        layers.push({ s, y, t, out: r() * 0.35 + (r() < 0.2 ? 0.25 : 0), c: PAL[Math.floor(r() * PAL.length)] })
        y += t
      }
    }
    const walls = new THREE.InstancedMesh(slab, wallMat, layers.length)
    const fx = iw / 2 - 0.15
    const bx = 0.95
    const z0 = -0.9
    const z1 = -D + 0.3
    const ob = new THREE.Object3D()
    const col = new THREE.Color()
    layers.forEach((L, k) => {
      const dx = L.s * (bx - fx)
      const dz = z1 - z0
      const len = Math.hypot(dx, dz) + 0.6
      const ang = Math.atan2(dx, dz)
      // the wall's line, and the slab pushed into the gorge by `out` (the lower ones more: a narrow slot)
      const mx = (L.s * (fx + bx)) / 2
      const ix = L.s * Math.cos(ang)
      const iz = -L.s * Math.sin(ang)
      const out = L.out + (1 - L.y / ih) * 0.35
      ob.position.set(mx + ix * (out - 0.5), L.y + L.t / 2, (z0 + z1) / 2 + iz * (out - 0.5))
      ob.rotation.set(0, ang, 0)
      ob.scale.set(1.0, L.t, len)
      ob.updateMatrix()
      walls.setMatrixAt(k, ob.matrix)
      col.set(L.c).multiplyScalar(0.85 + r() * 0.3)
      walls.setColorAt(k, col)
    })
    d.add(walls)
    gorgeHits.push(walls)
    // the far end: a painted bend of the gorge, sky in a slot above; the sky overhead
    const far = canvasTex(512, 640, (g, cw, ch) => {
      const sky = g.createLinearGradient(0, 0, 0, ch * 0.4)
      sky.addColorStop(0, '#3f86cf')
      sky.addColorStop(1, '#9cc8ea')
      g.fillStyle = sky
      g.fillRect(0, 0, cw, ch)
      // two walls receding to a bend, banded
      const rr = random(307)
      for (const s of [-1, 1]) {
        let y = 0
        while (y < ch) {
          const t = 6 + rr() * 16
          g.fillStyle = PAL[Math.floor(rr() * PAL.length)]
          const xIn = cw / 2 + s * (40 + (y / ch) * 30)
          g.beginPath()
          g.moveTo(s < 0 ? 0 : cw, y)
          g.lineTo(xIn, y)
          g.lineTo(xIn, y + t + 1)
          g.lineTo(s < 0 ? 0 : cw, y + t + 1)
          g.fill()
          y += t
        }
      }
      // the pool going on into the bend
      g.fillStyle = '#2b6a5e'
      g.fillRect(cw / 2 - 70, ch * 0.9, 140, ch * 0.1)
      // a haze of distance
      g.fillStyle = 'rgba(200,170,150,0.18)'
      g.fillRect(0, 0, cw, ch)
    })
    textures.push(far)
    const farWall = new THREE.Mesh(new THREE.PlaneGeometry(iw, ih), new THREE.MeshBasicMaterial({ map: far }))
    farWall.position.set(0, ih / 2, -D + 0.05)
    d.add(farWall)
    const skyTop = new THREE.Mesh(new THREE.PlaneGeometry(iw, D - 0.9).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#4c8fd2' }))
    skyTop.position.set(0, ih, -(D + 0.9) / 2)
    d.add(skyTop)
    // plants today: ferns by the pool, a white-trunked gum on a ledge
    const fern = new THREE.MeshStandardMaterial({ color: '#5f8f3a', roughness: 0.9 })
    for (const [x, z, s] of [[-1.2, -2.0, 0.35], [1.0, -2.6, 0.28], [-0.7, -4.6, 0.25], [0.6, -5.4, 0.22]]) {
      const f = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), fern)
      f.scale.set(s * 1.3, s * 0.7, s)
      f.position.set(x, 0.32, z)
      d.add(f)
    }
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 1.6, 8), new THREE.MeshStandardMaterial({ color: '#ece6da', roughness: 0.6 }))
    trunk.position.set(-0.75, 2.75, -5.4)
    trunk.rotation.z = 0.25
    d.add(trunk)
    for (const [x, y, s] of [[-0.95, 3.55, 0.42], [-0.55, 3.45, 0.32], [-1.15, 3.3, 0.3]]) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#7d9248', roughness: 0.9 }))
      crown.scale.set(s, s * 0.6, s)
      crown.position.set(x, y, -5.4)
      d.add(crown)
    }
  }

  // --- the glass case of ancient seawater, in front of the cut ---
  const case2 = new THREE.Group()
  case2.position.set(-2.7, 0, 1.0)
  case2.rotation.y = 0.35
  rig2.add(case2)
  rig2.updateMatrixWorld(true)
  const CW = 0.8
  const CD = 0.5
  const CB = 0.42 // the floor of the case (on its plinth)
  const CH = 1.55 // the water's height
  const STACK = 0.55 // the visitor's own layers fill this much at most
  {
    const p = case2.getWorldPosition(V3())
    const foot = gy(p.x, p.z)
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(CW + 0.3, CB - foot + 0.05, CD + 0.3, 2, 0.05), stage.mats.rock)
    plinth.position.y = (CB + foot) / 2 - 0.02
    plinth.castShadow = true
    case2.add(plinth)
    solids.push(circle(p.x, p.z, 0.65))
    // the frame's glowing edges (twelve bars) and the glass
    const e = 0.035
    const bars = []
    for (const y of [CB, CB + CH + 0.06]) {
      bars.push([CW + e, e, e, 0, y, -CD / 2], [CW + e, e, e, 0, y, CD / 2], [e, e, CD + e, -CW / 2, y, 0], [e, e, CD + e, CW / 2, y, 0])
    }
    for (const x of [-CW / 2, CW / 2]) for (const z of [-CD / 2, CD / 2]) bars.push([e, CH + 0.06, e, x, CB + (CH + 0.06) / 2, z])
    for (const [w, h, d, x, y, z] of bars) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.edge)
      m.position.set(x, y, z)
      case2.add(m)
    }
    const glassBox = new THREE.Mesh(new THREE.BoxGeometry(CW, CH + 0.06, CD), M.glass)
    glassBox.position.y = CB + (CH + 0.06) / 2
    glassBox.raycast = () => {}
    case2.add(glassBox)
  }
  const waterMat2 = new THREE.MeshStandardMaterial({ color: '#7cc6cf', transparent: true, opacity: 0.32, roughness: 0.1, depthWrite: false })
  const water2 = new THREE.Mesh(new THREE.BoxGeometry(CW - 0.02, CH, CD - 0.02), waterMat2)
  water2.position.y = CB + CH / 2
  water2.raycast = () => {}
  case2.add(water2)
  // the microbes on top: a green film that blooms bright in a sunny season
  const filmMat = new THREE.MeshStandardMaterial({ map: greenTex, color: '#9fd7a8', roughness: 0.8, emissive: '#3fdc7c', emissiveIntensity: 0.1 })
  const film = new THREE.Mesh(new THREE.BoxGeometry(CW - 0.03, 0.035, CD - 0.03), filmMat)
  film.position.y = CB + CH - 0.03
  case2.add(film)
  const microbesLabel = label(E.sea.signs.microbes, 0.08, '#ffffff')
  microbesLabel.position.set(0, CB + CH + 0.2, CD / 2)
  case2.add(microbesLabel)
  const ironKid = label(E.sea.signs.iron, 0.065, '#ffffff', { maxWidth: CW + 0.4 })
  ironKid.position.set(0, CB - 0.14, CD / 2 + 0.17)
  case2.add(ironKid)
  // Fe2+ with its charge raised (formulaText would take the 2 for a subscript)
  const ironSci = new THREE.Group()
  {
    const fe = makeText('Fe', { size: 0.1, color: '#a8ffc8', anchorX: 'right' })
    const q = makeText('2+', { size: 0.062, color: '#a8ffc8', anchorX: 'left' })
    q.position.set(0.006, 0.035, 0)
    ironSci.add(fe, q)
    ironSci.position.set(0.02, CB - 0.14, CD / 2 + 0.17)
  }
  case2.add(ironSci)
  // dissolved iron: green specks rising (shown at Scientist level only)
  const FE = light ? 24 : 50
  const fePos = new Float32Array(FE * 3)
  const feSeed = Array.from({ length: FE }, () => [Math.random(), Math.random(), Math.random()])
  const feGeo = new THREE.BufferGeometry()
  feGeo.setAttribute('position', new THREE.BufferAttribute(fePos, 3))
  const feDots = new THREE.Points(feGeo, new THREE.PointsMaterial({ color: hdr('#7dffb0', 1.1), map: glow, size: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  feDots.frustumCulled = false
  feDots.raycast = () => {}
  case2.add(feDots)
  // the layers: the visitor's own (one box each), and the millions of years piled on top
  const COL = {
    r: new THREE.Color('#b8552c'), g: new THREE.Color('#a8aaa2'),
    rRock: new THREE.Color('#3a3036'), gRock: new THREE.Color('#a4402a'),
  }
  const LMAX = 40
  const layerMat = new THREE.MeshStandardMaterial({ roughness: 0.8, color: '#ffffff' })
  const layerMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CW - 0.03, 1, CD - 0.03), layerMat, LMAX)
  layerMesh.count = 0
  // (made empty, its bounds would stay empty: never culled instead)
  layerMesh.frustumCulled = false
  layerMesh.raycast = () => {}
  case2.add(layerMesh)
  const sedTex = bandTexture({ seed: 401, palette: [['#b8552c', '#c4632f', '#a84a26'], ['#a8aaa2', '#9a9d96', '#b4b5ae']], min: 3, max: 9 })
  const rockTex = bandTexture({ seed: 401, palette: [['#3a3036', '#2c2a30', '#4a3c3c'], ['#a4402a', '#8e3420', '#b8653a', '#c9b8a8']], min: 3, max: 9 })
  textures.push(sedTex, rockTex)
  const pileSide = new THREE.MeshStandardMaterial({ map: sedTex, roughness: 0.8 })
  const pileTop = new THREE.MeshStandardMaterial({ color: '#8a5a40', roughness: 0.8 })
  const pile = new THREE.Mesh(new THREE.BoxGeometry(CW - 0.03, 1, CD - 0.03).translate(0, 0.5, 0), [pileSide, pileSide, pileTop, pileTop, pileSide, pileSide])
  pile.visible = false
  pile.raycast = () => {}
  case2.add(pile)
  // flakes of rust and silica snowing down
  const FMAX = light ? 40 : 90
  const flakeMat = new THREE.MeshStandardMaterial({ roughness: 0.7, color: '#ffffff', emissive: '#000000' })
  const flakes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.008, 0.024), flakeMat, FMAX)
  flakes.count = 0
  flakes.frustumCulled = false
  flakes.raycast = () => {}
  case2.add(flakes)
  const falling = []
  // the board beside the case
  const board = standingScreen({ width: 1.5, height: 0.72, color: C_SEA, title: E.sea.title, line: '', titleSize: 0.11, lineSize: 0.068 }, { top: 1.5, tilt: 0.2, mat: M.dark })
  board.group.position.set(3.1, 0, 1.25)
  board.group.rotation.y = -0.35
  rig2.add(board.group)
  rig2.updateMatrixWorld(true)
  {
    const p = board.group.getWorldPosition(V3())
    solids.push(circle(p.x, p.z, 0.35))
  }

  // ---- its state, its steps and its panel ----
  const SEA = { layers: '', time: 0, shown: 0, fall: null, n: 0, said: -1 }
  const FALL_T = 3.0
  const red = () => [...SEA.layers].filter(c => c === 'r').length
  const grey = () => SEA.layers.length - red()
  const nextKind = () => (SEA.layers.endsWith('r') ? 'g' : 'r')
  const myears = t => Math.round(2500 * t * t * t)
  const phaseOf = t => (t < 0.02 ? 'sea' : t < 0.29 ? 'laid' : t < 0.585 ? 'buried' : t < 0.985 ? 'lifted' : 'today')
  const timeFmt = v => (v < 0.005 ? E.sea.timeFmt.start : v >= 0.995 ? E.sea.timeFmt.today : fill(E.sea.timeFmt.later, { n: Math.max(2, myears(v)) }))
  const seaHint = () => {
    const H = E.sea.hints
    if (SEA.fall) return H.wait
    if (SEA.time >= 0.985) return H.gorge
    if (SEA.time > 0.02 || SEA.layers.length >= 8) return H.time
    return nextKind() === 'r' ? H.bloom : H.quiet
  }
  const seaPanel = l => ({
    title: E.sea.title,
    color: C_SEA,
    blocks: [
      { slider: { label: E.sea.timeLabel, min: 0, max: 1, step: 0.005, value: SEA.time, onInput: v => setTime(v), format: timeFmt, live: () => SEA.time } },
      { buttons: [
        { label: E.sea.verbs.bloom, onClick: () => seaStep('r') },
        { label: E.sea.verbs.quiet, onClick: () => seaStep('g') },
        { label: E.sea.verbs.again, onClick: () => seaStep('again') },
      ] },
      { rows: [[E.sea.rows.red, String(red())], [E.sea.rows.grey, String(grey())]] },
      ...paras(E.sea.panel[depth(l)]),
    ],
  })
  let timeSend = null
  function setTime(v, now) {
    if (SEA.fall) SEA.fall = null
    SEA.time = clamp(Math.round(Number(v) * 1000) / 1000)
    SEA.mine = true
    ex.discover('sea')
    const ph = phaseOf(SEA.time)
    if (ph !== 'sea' && ph !== SEA.said) {
      SEA.said = ph
      say(at(E.sea.says[ph], level()), C_SEA)
      if (ph === 'today') play('discover')
    }
    if (now) return share('sea')
    if (!timeSend) {
      timeSend = setTimeout(() => {
        timeSend = null
        share('sea')
      }, 250)
    }
  }
  function seaStep(kind) {
    const l = level()
    if (SEA.fall) return say(at(W.busy, l))
    SEA.n++
    if (kind === 'again') {
      SEA.layers = ''
      SEA.time = 0
      SEA.shown = 0
      SEA.said = -1
      play('pop')
      say(at(E.sea.says.again, l), C_SEA)
      share('sea')
      refresh(seaPanel)
      return
    }
    // a step at the sea's own time: back from the years first
    if (SEA.time > 0) {
      SEA.time = 0
      SEA.shown = 0
      SEA.said = -1
    }
    if (SEA.layers.length >= LMAX) SEA.layers = SEA.layers.slice(1)
    SEA.layers += kind
    SEA.fall = { kind, t: 0 }
    play(kind === 'r' ? 'select' : 'tap')
    share('sea')
    say(at(SEA.layers.length >= 8 && SEA.layers.length % 4 === 0 ? E.sea.says.full : kind === 'r' ? E.sea.says.bloom : E.sea.says.quiet, l), C_SEA)
    findOnce('sea', seaPanel, FALL_T + 0.4)
    refresh(seaPanel)
  }
  const seaTap = thing => {
    if (thing === 'gorge') {
      if (rightCut.open < 0.5) return say(at(E.sea.says.full, level()), C_SEA)
      play('select')
      return say(at(E.sea.says.gorge, level()), C_SEA)
    }
    if (SEA.time > 0.02 && !SEA.fall) return seaStep('again')
    return seaStep(nextKind())
  }
  ex.add({
    id: 'sea',
    x: S2.x,
    z: S2.z,
    radius: 2.0,
    label: E.sea.label,
    verb: seaHint,
    manual: true,
    screens: [board],
    focus: (() => {
      const p = rig2.localToWorld(V3(-1.1, 0, 0.7))
      return { x: p.x, y: 1.55, z: p.z, size: 4.2, width: 6.4 }
    })(),
    act: () => ctx.showPanel(seaPanel),
  })
  clickable(film, () => seaTap('microbes'), { reach: 5.5 })
  clickable(water2, () => seaTap('microbes'), { reach: 5.5 })
  // (the water's raycast is off: a box of the case's size takes the taps instead)
  {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(CW, CH, CD), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = CB + CH / 2
    case2.add(hit)
    clickable(hit, () => seaTap('microbes'), { reach: 5.5 })
  }
  clickable(gorgeHits[0], () => seaTap('gorge'), { reach: 12, when: () => rightCut.open > 0.5 })

  const ol = new THREE.Object3D()
  const cTmp = new THREE.Color()
  let lastLine = ''
  updates.push((dt, t) => {
    // time eases to the slider (quickly: it is the visitor's own hand)
    SEA.shown = damp(SEA.shown, SEA.time, 4, dt)
    const T = SEA.shown
    const pileK = span(0.02, 0.29, T)
    const rockK = span(0.3, 0.5, T)
    const todayK = span(0.9, 0.995, T)
    rightCut.setOpen(todayK, clamp(T / 0.9))
    // the fall of the newest layer
    let grow = 1
    if (SEA.fall) {
      SEA.fall.t += dt
      grow = span(0.35, 0.95, SEA.fall.t / FALL_T)
      if (SEA.fall.t >= FALL_T) SEA.fall = null
    }
    const n = SEA.layers.length
    const th = Math.min(0.045, STACK / Math.max(1, n))
    // squeezed by the years: the visitor's own layers pressed into the bottom
    const squeeze = lerp(1, 0.16 / Math.max(0.16, th * n), pileK)
    let y = CB
    layerMesh.count = n
    for (let i = 0; i < n; i++) {
      const k = SEA.layers[i]
      const h = th * squeeze * (i === n - 1 ? grow : 1)
      ol.position.set(0, y + h / 2, 0)
      ol.scale.set(1, Math.max(0.0005, h), 1)
      ol.updateMatrix()
      layerMesh.setMatrixAt(i, ol.matrix)
      cTmp.copy(k === 'r' ? COL.r : COL.g).lerp(k === 'r' ? COL.rRock : COL.gRock, rockK)
      if (k === 'g' && rockK > 0.5 && i % 3 === 2) cTmp.lerp(new THREE.Color('#c9b8a8'), (rockK - 0.5) * 2)
      cTmp.multiplyScalar(0.92 + ((i * 0.37) % 1) * 0.16)
      layerMesh.setColorAt(i, cTmp)
      y += h
    }
    layerMesh.instanceMatrix.needsUpdate = true
    if (layerMesh.instanceColor) layerMesh.instanceColor.needsUpdate = true
    // the pile of millions of years on top
    const pileH = pileK * (CB + CH - 0.06 - y)
    pile.visible = pileH > 0.005
    pile.position.y = y
    pile.scale.y = Math.max(0.001, pileH)
    pileSide.map = rockK > 0.5 ? rockTex : sedTex
    pileSide.map.repeat.set(1, Math.max(0.2, pileH / 0.3))
    pileTop.color.set(rockK > 0.5 ? '#3a3036' : '#8a5a40')
    // the sea goes when it turns to rock: the water, its microbes, its iron
    const wet = 1 - rockK
    waterMat2.opacity = 0.32 * wet
    water2.visible = wet > 0.02
    film.visible = wet > 0.02
    microbesLabel.visible = wet > 0.5
    const sciNow = sci()
    waterMat2.color.set(sciNow ? '#8fd4ae' : '#7cc6cf')
    ironKid.visible = !sciNow && wet > 0.5
    ironSci.visible = sciNow && wet > 0.5
    feDots.visible = sciNow && wet > 0.5
    // the bloom: the film glows in a sunny season while its layer falls
    const blooming = SEA.fall?.kind === 'r' ? span(0, 0.4, SEA.fall.t / FALL_T) * (1 - span(0.8, 1, SEA.fall.t / FALL_T)) : 0
    filmMat.emissiveIntensity = 0.1 + 1.1 * blooming
    filmMat.color.set(blooming > 0.05 ? '#b8f7c0' : SEA.fall?.kind === 'g' ? '#7e9a78' : '#9fd7a8')
    // flakes snowing from under the film onto the top of the stack
    if (SEA.fall && SEA.fall.t < FALL_T * 0.75 && falling.length < FMAX) {
      const rate = SEA.fall.kind === 'r' ? 40 : 30
      const want = Math.floor(rate * dt + Math.random())
      for (let i = 0; i < want && falling.length < FMAX; i++) {
        falling.push({ p: V3((Math.random() - 0.5) * (CW - 0.12), CB + CH - 0.08 - Math.random() * 0.12, (Math.random() - 0.5) * (CD - 0.12)), kind: SEA.fall.kind, v: 0.45 + Math.random() * 0.25, rot: Math.random() * TAU, ph: Math.random() * TAU, age: 0 })
      }
    }
    for (let i = falling.length - 1; i >= 0; i--) {
      const f = falling[i]
      f.age += dt
      f.p.y -= f.v * dt
      f.p.x += Math.sin(t * 2 + f.ph) * dt * 0.04
      f.rot += dt * 2.5
      if (f.p.y <= y + 0.005) falling.splice(i, 1)
    }
    flakes.count = falling.length
    falling.forEach((f, i) => {
      ol.position.copy(f.p)
      ol.rotation.set(f.rot, f.rot * 0.7, 0)
      ol.scale.setScalar(1)
      ol.updateMatrix()
      flakes.setMatrixAt(i, ol.matrix)
      // rust glints bright as it forms, then dulls
      cTmp.copy(f.kind === 'r' ? COL.r : COL.g).multiplyScalar(f.kind === 'r' ? 1 + Math.max(0, 1 - f.age * 2) * 1.5 : 1.1)
      flakes.setColorAt(i, cTmp)
    })
    ol.rotation.set(0, 0, 0)
    flakes.instanceMatrix.needsUpdate = true
    if (flakes.instanceColor) flakes.instanceColor.needsUpdate = true
    // iron(II) rising in the water (Scientist level)
    if (feDots.visible) {
      for (let i = 0; i < FE; i++) {
        const [a, b, c] = feSeed[i]
        const k = (b + t * (0.02 + c * 0.02)) % 1
        fePos[i * 3] = (a - 0.5) * (CW - 0.08)
        fePos[i * 3 + 1] = lerp(y + 0.03, CB + CH - 0.12, k)
        fePos[i * 3 + 2] = (c - 0.5) * (CD - 0.08)
      }
      feGeo.attributes.position.needsUpdate = true
    }
    // the board: the layers, or where the years have got to
    const ph = phaseOf(SEA.time)
    const line = ph === 'sea' ? `${fill(E.sea.board.layers, { r: red(), g: grey() })}\n${n ? '' : E.sea.board.sea}` : `${E.sea.board[ph]}\n${timeFmt(SEA.time)}`
    if (line !== lastLine) {
      lastLine = line
      board.set({ line })
    }
  })

  // =====================================================================================
  // 3. Stromatolites alive today: a cut in the left headland onto Hamelin Pool
  // =====================================================================================
  const leftCut = timeCut({ rockMat: stage.mats.rock, boulders: stage.boulders, color: '#4fd1c5', sign: E.living.signs.cut, seed: 23, light })
  const rig3 = rigAt(CUT_L, S3)
  rig3.add(leftCut.group)
  root.add(rig3)
  {
    const c = rig3.localToWorld(V3(0, 0, -(CUT.depth + 0.9) / 2))
    solids.push(box(c.x, c.z, CUT.rockW, CUT.depth + 0.9, { rot: rig3.rotation.y }))
  }
  const HEAD = { x: 0.45, z: -1.45, a: 0.4, H: 0.9, n: 2.4, layers: 26 }
  const YEARS = 3000 // at about 0.3 mm a year, 0.9 m
  const headParts = {}
  {
    const d = leftCut.dio
    const { iw, ih, depth: D } = leftCut
    // the sandy floor and the bay's shallow, clear water
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(iw, D - 0.9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#a8946e', roughness: 1 }))
    sand.position.set(0, 0.14, -(D + 0.9) / 2)
    d.add(sand)
    const bay = new THREE.Mesh(new THREE.PlaneGeometry(iw, D - 0.9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5ec4bd', transparent: true, opacity: 0.5, roughness: 0.12, metalness: 0.1, depthWrite: false }))
    bay.position.set(0, 0.38, -(D + 0.9) / 2)
    bay.renderOrder = 3
    d.add(bay)
    // the bay painted round the back: sea to a low red shore with a white shell beach, a blue sky
    const cyc = canvasTex(2048, 512, (g, cw, ch) => {
      const hz = ch * (1 - 1.45 / ih)
      const sky = g.createLinearGradient(0, 0, 0, hz)
      sky.addColorStop(0, '#3d7fc8')
      sky.addColorStop(0.75, '#8fc0e6')
      sky.addColorStop(1, '#d8e8f0')
      g.fillStyle = sky
      g.fillRect(0, 0, cw, hz)
      const sea = g.createLinearGradient(0, hz, 0, ch)
      sea.addColorStop(0, '#3f8fb8')
      sea.addColorStop(0.35, '#4fb4bc')
      sea.addColorStop(1, '#78d0c4')
      g.fillStyle = sea
      g.fillRect(0, hz, cw, ch - hz)
      // a low red shore on the right of the view (the canvas's left: the inside of the round wall)
      g.fillStyle = '#b05a34'
      g.beginPath()
      g.moveTo(0, hz - 26)
      for (let x = 0; x <= cw * 0.36; x += 20) g.lineTo(x, hz - 26 + (x / (cw * 0.36)) * 24 + Math.sin(x * 0.02) * 5)
      g.lineTo(cw * 0.36, hz + 2)
      g.lineTo(0, hz + 2)
      g.fill()
      g.fillStyle = '#efe8da'
      g.fillRect(0, hz - 2, cw * 0.36, 5)
      // a few clouds
      const rr = random(509)
      for (let i = 0; i < 9; i++) {
        const x = rr() * cw
        const y = rr() * hz * 0.6
        const gg = g.createRadialGradient(x, y, 0, x, y, 80)
        gg.addColorStop(0, 'rgba(255,255,255,0.7)')
        gg.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = gg
        g.save()
        g.scale(1, 0.35)
        g.fillRect(x - 90, y / 0.35 - 90, 180, 180)
        g.restore()
      }
    })
    textures.push(cyc)
    const R = 3.3
    const zc = -2.6
    const th0 = Math.acos(clamp((-0.9 - zc) / R, -1, 1))
    const round = new THREE.Mesh(new THREE.CylinderGeometry(R, R, ih, 64, 1, true, th0, TAU - 2 * th0), new THREE.MeshBasicMaterial({ map: cyc, side: THREE.BackSide }))
    round.position.set(0, ih / 2, zc)
    d.add(round)
    // (a square lid over the round wall, from the opening back: a disc reached out through the cliff's face)
    const top = new THREE.Mesh(new THREE.PlaneGeometry(2 * R, R - 0.9 - zc).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#3d7fc8' }))
    top.position.set(0, ih - 0.01, (-0.9 + zc - R) / 2)
    d.add(top)
    // stromatolites of today: dark, knobbly heads in rows, their tops out of the water at low tide
    const knobTex = canvasTex(256, 256, (g, s) => {
      g.fillStyle = '#4c4238'
      g.fillRect(0, 0, s, s)
      const r = random(521)
      for (let i = 0; i < 700; i++) {
        g.fillStyle = `rgba(${r() < 0.5 ? '25,20,16' : '110,96,78'},${0.25 + r() * 0.35})`
        g.beginPath()
        g.arc(r() * s, r() * s, 2 + r() * 6, 0, TAU)
        g.fill()
      }
    }, { repeat: true })
    textures.push(knobTex)
    const knobMat = new THREE.MeshStandardMaterial({ map: knobTex, roughness: 0.95 })
    headParts.knob = knobMat
    const r = random(531)
    const spots = []
    for (let i = 0; i < 60 && spots.length < 22; i++) {
      const x = (r() - 0.5) * 5.2
      const z = -2.3 - r() * 3.6
      if (Math.hypot(x, z - zc) > R - 0.4) continue
      if (Math.hypot(x - HEAD.x, z - HEAD.z) < 0.9) continue
      if (spots.some(s => Math.hypot(s[0] - x, s[1] - z) < 0.6)) continue
      spots.push([x, z, 0.35 + r() * 0.35, 0.3 + r() * 0.25])
    }
    const heads = new THREE.InstancedMesh(stromGeo, knobMat, spots.length)
    const ob = new THREE.Object3D()
    spots.forEach(([x, z, w, h], k) => {
      ob.position.set(x, 0.12, z)
      ob.scale.set(w, h, w * 0.9)
      ob.rotation.set(0, k, 0)
      ob.updateMatrix()
      heads.setMatrixAt(k, ob.matrix)
    })
    d.add(heads)
  }
  // --- the big one, to cut open: two halves of a superellipse column, the cut face between ---
  const head = new THREE.Group()
  head.position.set(HEAD.x, 0.12, HEAD.z)
  leftCut.dio.add(head)
  const prof = []
  for (let i = 0; i <= 28; i++) {
    const y = (i / 28) * HEAD.H
    prof.push(new THREE.Vector2(HEAD.a * Math.pow(Math.max(0, 1 - Math.pow(y / HEAD.H, HEAD.n)), 1 / HEAD.n) * (1 + 0.04 * Math.sin(i * 1.7)), y))
  }
  prof[prof.length - 1].x = 0
  const headTex = canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#4a4037'
    g.fillRect(0, 0, s, s)
    const r = random(541)
    for (let i = 0; i < 800; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '22,18,14' : '112,98,80'},${0.25 + r() * 0.35})`
      g.beginPath()
      g.arc(r() * s, r() * s, 2 + r() * 7, 0, TAU)
      g.fill()
    }
    // the living top: a darker, greener skin
    const grd = g.createLinearGradient(0, 0, 0, s * 0.25)
    grd.addColorStop(0, 'rgba(40,64,40,0.85)')
    grd.addColorStop(1, 'rgba(40,64,40,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, s, s * 0.25)
  })
  textures.push(headTex)
  const headMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.95, side: THREE.DoubleSide })
  const backHalf = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, Math.PI / 2, Math.PI), headMat)
  const frontHalf = new THREE.Group()
  const frontShell = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, -Math.PI / 2, Math.PI), headMat)
  frontHalf.add(frontShell)
  const shells = new THREE.Group()
  shells.add(backHalf)
  head.add(shells, frontHalf)
  // the cut face: laminae as the outlines of the column at each age, the living mat on top
  const faceU = { uG: { value: 1 }, uA: { value: HEAD.a }, uH: { value: HEAD.H }, uN: { value: HEAD.layers }, uExp: { value: HEAD.n } }
  const faceMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: faceU,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uG; uniform float uA; uniform float uH; uniform float uN; uniform float uExp;
      varying vec2 vP;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        float x = abs(vP.x) / uA;
        float y = max(vP.y, 0.0) / uH;
        float s = pow(pow(x, uExp) + pow(y, uExp), 1.0 / uExp);
        // a little waviness, as real laminae have
        s += 0.006 * sin(vP.x * 41.0 + vP.y * 9.0) + 0.004 * sin(vP.x * 97.0);
        if (s > uG) discard;
        float band = fract(s * uN);
        float dark = smoothstep(0.42, 0.6, band) * (1.0 - smoothstep(0.88, 0.99, band));
        vec3 sand = vec3(0.56, 0.46, 0.33);
        vec3 mat = vec3(0.2, 0.15, 0.11);
        vec3 c = mix(sand, mat, dark * 0.85);
        float g = hash(floor(vP * 180.0));
        c *= 0.82 + 0.3 * g;
        // the living mat on top: green-brown
        float top = smoothstep(uG - 0.035, uG - 0.012, s);
        c = mix(c, vec3(0.2, 0.38, 0.22), top);
        // the edge darker, as weathered rock
        c *= 1.0 - 0.35 * smoothstep(uG - 0.06, uG, s) * (1.0 - top);
        gl_FragColor = vec4(c * 0.9, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const face = new THREE.Mesh(new THREE.PlaneGeometry(HEAD.a * 2.2, HEAD.H * 1.02).translate(0, HEAD.H * 0.51, 0), faceMat)
  face.position.z = 0.002
  head.add(face)
  // the ruler beside it: years at about 0.3 mm a year
  {
    const ruler = new THREE.Group()
    ruler.position.set(HEAD.a + 0.28, 0, 0.1)
    head.add(ruler)
    const white = new THREE.MeshStandardMaterial({ color: '#f2efe6', roughness: 0.6, emissive: '#4a463c', emissiveIntensity: 0.4 })
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.02, 0.035), white)
    post.position.y = 0.51
    ruler.add(post)
    for (let i = 1; i <= 9; i++) {
      const big = i % 3 === 0
      const tick = new THREE.Mesh(new THREE.BoxGeometry(big ? 0.12 : 0.07, 0.012, 0.012), white)
      tick.position.set(-0.02, i * 0.1, 0.02)
      ruler.add(tick)
      if (big) {
        const t = label(fill(E.living.years, { y: String((i / 3) * 1000) }), 0.055, '#ffffff', { anchorX: 'left' })
        t.position.set(0.05, i * 0.1, 0.03)
        ruler.add(t)
      }
    }
  }
  // the close look: a magnifier beside it, drawn sand grains and the sticky threads of microbes
  const zoom = new THREE.Group()
  zoom.position.set(HEAD.x - 1.3, 1.3, HEAD.z + 0.25)
  zoom.rotation.y = 0.25
  leftCut.dio.add(zoom)
  {
    const tex = canvasTex(512, 512, (g, s) => {
      g.fillStyle = '#6b8a6a'
      g.fillRect(0, 0, s, s)
      const r = random(551)
      // sunlight from above: brighter at the top
      const sun = g.createLinearGradient(0, 0, 0, s)
      sun.addColorStop(0, 'rgba(255,250,210,0.55)')
      sun.addColorStop(0.5, 'rgba(255,250,210,0)')
      g.fillStyle = sun
      g.fillRect(0, 0, s, s)
      // grains of sand, lower down more of them, packed
      for (let i = 0; i < 70; i++) {
        const x = r() * s
        const y = s * 0.3 + r() * s * 0.75
        const rx = 18 + r() * 22
        const ry = rx * (0.6 + r() * 0.35)
        g.fillStyle = ['#e6d3a8', '#d8c08e', '#efe0bb', '#cdb27c'][Math.floor(r() * 4)]
        g.strokeStyle = 'rgba(80,60,30,0.6)'
        g.lineWidth = 2
        g.beginPath()
        g.ellipse(x, y, rx, ry, r() * 3, 0, TAU)
        g.fill()
        g.stroke()
        g.fillStyle = 'rgba(255,255,255,0.35)'
        g.beginPath()
        g.ellipse(x - rx * 0.3, y - ry * 0.35, rx * 0.3, ry * 0.2, 0, 0, TAU)
        g.fill()
      }
      // threads of cyanobacteria weaving over and between the grains, thicker toward the top
      for (let i = 0; i < 46; i++) {
        let x = r() * s
        let y = s * (0.05 + r() * 0.8)
        g.strokeStyle = r() < 0.5 ? '#2f7a4a' : '#3f9a5c'
        g.lineWidth = 4 + r() * 3
        g.lineCap = 'round'
        g.beginPath()
        g.moveTo(x, y)
        let a = r() * TAU
        for (let k = 0; k < 14; k++) {
          a += (r() - 0.5) * 0.9
          x += Math.cos(a) * 16
          y += Math.sin(a) * 10 - 2
          g.lineTo(x, y)
        }
        g.stroke()
        // the cells along it
        g.strokeStyle = 'rgba(20,50,30,0.6)'
        g.lineWidth = 1
      }
      // the sticky slime: a pale haze over the top
      const slime = g.createLinearGradient(0, 0, 0, s * 0.4)
      slime.addColorStop(0, 'rgba(150,210,160,0.35)')
      slime.addColorStop(1, 'rgba(150,210,160,0)')
      g.fillStyle = slime
      g.fillRect(0, 0, s, s * 0.4)
    })
    textures.push(tex)
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), new THREE.MeshBasicMaterial({ map: tex }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 10, 48), M.brass)
    zoom.add(disc, ring)
    const t1 = label(E.living.signs.mat, 0.06, '#ffffff')
    t1.position.set(0, 0.52, 0.02)
    const t2 = label(E.living.signs.sand, 0.06, '#ffffff')
    t2.position.set(0, -0.52, 0.02)
    zoom.add(t1, t2)
  }
  // a thin line from the magnifier to the top of the cut face
  const zoomLine = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 6), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 1.1) }))
  zoomLine.raycast = () => {}
  leftCut.dio.add(zoomLine)
  zoom.scale.setScalar(0.001)
  zoom.visible = false

  // ---- its state, its steps and its panel ----
  const LV = { cut: false, cutK: 0, years: YEARS, shown: YEARS, zoom: false, zoomK: 0, n: 0, look: false }
  const cmOf = y => Math.round(y * 0.03)
  const livingHint = () => {
    const H = E.living.hints
    if (!LV.cut) return H.cut
    if (!LV.look) return H.look
    if (LV.years >= YEARS - 1) return H.grow
    return H.close
  }
  const livingPanel = l => ({
    title: E.living.title,
    color: C_LIVING,
    blocks: [
      { slider: { label: E.living.yearsLabel, min: 0, max: YEARS, step: 50, value: LV.years, onInput: v => setYears(v), format: v => fill(E.living.yearsFmt, { y: String(Math.round(v)), cm: String(cmOf(v)) }), live: () => LV.years } },
      { buttons: [
        { label: LV.cut ? E.living.verbs.close : E.living.verbs.cut, onClick: () => livingTap('head') },
        { label: LV.zoom ? E.living.verbs.away : E.living.verbs.look, onClick: () => livingTap('face') },
      ] },
      { rows: [[E.living.rows.rate, E.living.rows.rateValue]] },
      ...paras(E.living.panel[depth(l)]),
    ],
  })
  let yearsSend = null
  let yearsSaid = null
  function setYears(v, now) {
    LV.years = clamp(Math.round(Number(v) / 50) * 50, 0, YEARS)
    ex.discover('living')
    // cutting it open shows the layers of the years
    if (!LV.cut) LV.cut = true
    const band = LV.years <= 300 ? 'young' : LV.years >= YEARS ? 'old' : null
    if (band && band !== yearsSaid) say(at(E.living.says[band], level()), C_LIVING)
    yearsSaid = band
    if (now) return share('living')
    if (!yearsSend) {
      yearsSend = setTimeout(() => {
        yearsSend = null
        share('living')
      }, 250)
    }
  }
  function livingTap(thing) {
    const l = level()
    LV.n++
    if (thing === 'face' && LV.cut) {
      LV.zoom = !LV.zoom
      if (LV.zoom) LV.look = true
      play(LV.zoom ? 'select' : 'tap')
      say(at(LV.zoom ? E.living.says.look : E.living.says.away, l), C_LIVING)
    } else {
      LV.cut = !LV.cut
      if (!LV.cut) LV.zoom = false
      play(LV.cut ? 'crack' : 'tap')
      say(at(LV.cut ? E.living.says.cut : E.living.says.close, l), C_LIVING)
      if (LV.cut) findOnce('living', livingPanel, 2.6)
    }
    share('living')
    refresh(livingPanel)
  }
  ex.add({
    id: 'living',
    x: S3.x,
    z: S3.z,
    radius: 2.0,
    label: E.living.label,
    verb: livingHint,
    manual: true,
    focus: (() => {
      const p = rig3.localToWorld(V3(-0.15, 0, -1.2))
      return { x: p.x, y: 0.85, z: p.z, size: 2.2, width: 3.2 }
    })(),
    act: () => ctx.showPanel(livingPanel),
  })
  clickable(face, () => livingTap('face'), { reach: 9, when: () => LV.cutK > 0.6 })
  clickable(shells, () => livingTap('head'), { reach: 9 })
  clickable(frontHalf, () => livingTap('head'), { reach: 9 })
  clickable(zoom, () => livingTap('face'), { reach: 9, when: () => LV.zoom })

  updates.push((dt, t) => {
    LV.cutK = damp(LV.cutK, LV.cut ? 1 : 0, 3, dt)
    LV.zoomK = damp(LV.zoomK, LV.zoom ? 1 : 0, 4, dt)
    LV.shown = damp(LV.shown, LV.years, 5, dt)
    const g = Math.max(0.03, LV.shown / YEARS)
    const k = ease(LV.cutK)
    // the near half swings away like a door; both halves grow with the years
    shells.scale.setScalar(g)
    frontHalf.scale.setScalar(g)
    frontHalf.position.set(-0.75 * k, 0, 0.45 * k)
    frontHalf.rotation.y = -1.1 * k
    faceU.uG.value = g
    face.visible = LV.cutK > 0.02
    const z = ease(LV.zoomK)
    zoom.scale.setScalar(Math.max(0.001, z))
    zoom.visible = z > 0.01
    // the line from the magnifier to the living top
    const a = zoom.position.clone()
    const b = V3(HEAD.x, 0.12 + HEAD.H * g - 0.02, HEAD.z + 0.01)
    zoomLine.visible = z > 0.5
    zoomLine.position.copy(a).add(b).multiplyScalar(0.5)
    zoomLine.scale.y = a.distanceTo(b) * 0.8
    zoomLine.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize())
  })

  // ---- the cuts' sparkle, the stage, the labels at each level ----
  leftCut.setOpen(1)
  updates.push((dt, t) => {
    leftCut.update(t)
    rightCut.update(t)
    stage.update(t)
    const s = sci()
    for (const { k, s: f } of lensLabels) {
      if (f) {
        k.visible = !s
        f.visible = s
      }
    }
    // (the mud's oxygen label shows only while the oxygen comes)
    mudOxLabel.k.visible = !s && MK.shown > 0.3
    if (mudOxLabel.s) mudOxLabel.s.visible = s && MK.shown > 0.3
  })

  const makersState = () => ({ sun: MK.sun, view: MK.view, n: MK.n })
  const seaState = () => ({ layers: SEA.layers, time: SEA.time, n: SEA.n })
  const livingState = () => ({ cut: LV.cut, years: LV.years, zoom: LV.zoom, n: LV.n })
  const worldOf = (obj, local = V3()) => obj.localToWorld(local.clone())

  return {
    env: stage.env,
    solids,
    floor: (x, z) => gy(x, z),
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.7 },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, -1.2) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z + 1 - STAND.z) },
    parts: {
      makers: {
        tap: thing => makersTap(thing), // 'mirror', 'cells', 'mud', 'mat'
        sun: v => setSun(v, true), // the panel's slider, 0 to 1
        get state() { return { ...makersState(), shown: MK.shown, waters: waters.length, bubbles: bubbles.length } },
        at: thing => ({ mirror: () => worldOf(mirror), mud: () => worldOf(mudBank, V3(0, 0.1, 0.25)), mat: () => worldOf(matMound, V3(0, 1, 0)), cells: () => worldOf(cells[3]) })[thing](),
      },
      sea: {
        tap: thing => seaTap(thing), // 'microbes', 'gorge'
        step: k => seaStep(k), // the panel's buttons: 'r', 'g', 'again'
        time: v => setTime(v, true), // the panel's slider, 0 to 1
        get state() { return { ...seaState(), busy: !!SEA.fall, open: rightCut.open } },
        at: thing => (thing === 'gorge' ? rig2.localToWorld(V3(0.4, 1.6, -2.2)) : worldOf(film)),
      },
      living: {
        tap: thing => livingTap(thing), // 'head', 'face'
        years: v => setYears(v, true), // the panel's slider, 0 to 3000
        get state() { return { ...livingState(), cutK: LV.cutK } },
        at: thing => (thing === 'face' ? worldOf(face, V3(0, HEAD.H * 0.5, 0)) : worldOf(shells, V3(0, HEAD.H * 0.5, 0))),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { makers: makersPanel, sea: seaPanel, living: livingPanel },
    shared: {
      makers: {
        get: makersState,
        set: (s, live) => {
          MK.sun = clamp(Number(s?.sun ?? 0))
          const view = s?.view === 'mud' ? 'mud' : 'mat'
          if (live && view !== MK.view) play('select')
          MK.view = view
          if (view === 'mud') MK.mud = true
          MK.n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (!live) {
            MK.shown = MK.sun
            MK.viewK = view === 'mud' ? 1 : 0
          }
          refresh(makersPanel)
        },
      },
      sea: {
        get: seaState,
        set: (s, live) => {
          const layers = String(s?.layers ?? '').replace(/[^rg]/g, '').slice(-LMAX)
          const time = clamp(Number(s?.time) || 0)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const added = layers.length === SEA.layers.length + 1 && layers.startsWith(SEA.layers) && time === 0
          if (live && added && !SEA.fall) {
            SEA.fall = { kind: layers.slice(-1), t: 0 }
            play(SEA.fall.kind === 'r' ? 'select' : 'tap')
          } else if (!live) SEA.fall = null
          SEA.layers = layers
          SEA.time = time
          SEA.n = n
          SEA.said = phaseOf(time)
          if (!live) SEA.shown = time
          refresh(seaPanel)
        },
      },
      living: {
        get: livingState,
        set: (s, live) => {
          const cut = !!s?.cut
          if (live && cut !== LV.cut) play(cut ? 'crack' : 'tap')
          LV.cut = cut
          LV.years = clamp(Math.round((Number(s?.years ?? YEARS)) / 50) * 50, 0, YEARS)
          LV.zoom = cut && !!s?.zoom
          LV.n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (!live) {
            LV.cutK = cut ? 1 : 0
            LV.zoomK = LV.zoom ? 1 : 0
            LV.shown = LV.years
          }
          refresh(livingPanel)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (sunSend) clearTimeout(sunSend)
      if (timeSend) clearTimeout(timeSend)
      if (yearsSend) clearTimeout(yearsSend)
      stage.dispose()
      stromGeo.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }
}
