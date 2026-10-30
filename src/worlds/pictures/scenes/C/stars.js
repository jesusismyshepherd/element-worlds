// Carbon's picture "Made inside a giant star" as a room (docs/knowledge/picture-rooms.md): the space deck
// floating beside a red giant (stages/giant.js), the giant filling the sky on the left as in the picture,
// and the picture's magnifier standing on the deck: a round lens onto the star's core, a cone of light
// joining it to the spot on the giant it shows. Three things to do, each step chosen by tapping its thing
// (the user, 2026-10-30), the prompt naming the next tap, E opening the station's panel, whose buttons
// (and a slider) do the same:
// - the triple-alpha catch, in the lens: tap it and two helium-4 nuclei (two red protons, two grey
//   neutrons each) collide into a beryllium-8, which falls apart again almost at once (half-life 82
//   attoseconds); tap again quickly and a third helium flies in: if it arrives before the beryllium-8
//   breaks, carbon-12 flashes into being and gives off gamma rays. The beryllium's life is drawn from
//   its real exponential decay (each try's from a number shared in the room), slowed down 10^16 times:
//   one second here is 100 attoseconds (the Scientist's clock in the lens says so);
// - Hoyle's ladder, on the right: carbon-12's energy levels (the ground state, 4.44 MeV, three helium-4 at
//   7.27, beryllium-8 + helium-4 at 7.37, the Hoyle state at 7.654 MeV). The energy of the incoming helium
//   is a slider (or a tap on the rail); tap the helium gun to fire sixteen at that energy: near 288 keV
//   (the Hoyle state) most are caught, elsewhere almost none. Each burst is a point on the chart, so the
//   peak comes out of the visitor's own tries. Hoyle's notebook on a lectern: each tap turns a page of the
//   history (the 1953 prediction, Whaling's team at Caltech finding the level at 7.68 MeV the same year,
//   Fowler's Nobel Prize of 1983 without Hoyle, and how the story is told and disputed). The peak is drawn
//   far wider than the real one (less than 10 eV), so it can be found with a slider;
// - carbon into space, on the left: tap the giant and it grows old (bigger, redder, sootier); tap it again
//   and it puffs its outer layers away as a glowing planetary nebula round a white dwarf, carbon atoms
//   (dark grey) and soot drifting out across the deck; tap the dark cloud they gather in and it falls into
//   a young sun, a disc and planets; tap the blue planet: "the carbon in you". Then a tap starts again.
// Kept apart from the Atom Forge (it builds and decays nuclei; its beam fires alphas at a held
// beryllium-8) and from the star forge to come (fusion star by star up to iron): this room is the one story
// of carbon's birth. Silicon's earth room has a massive star that explodes; this one is a red giant that
// dies gently. All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay
// each one's. parts.<exhibit>.tap(...) does what a tap does, for the probes; parts.rayTo(p) aims a real one.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, hdr, fill, num, screen, standingScreen } from '../../../wings/noble/kit.js'
import { giantStage, NOISE } from '../../stages/giant.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { STARS_WORDS } from './stars.words.js'

export const WORDS = STARS_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// colours: the picture's protons and neutrons, helium's glow, carbon's dark grey
const PROTON = '#e5484d'
const NEUTRON = '#97a3bd'
const HELIUM = '#fff1c4'
const CARBON = '#5c5d66'
const CATCH_C = '#ffb347'
const LADDER_C = '#ffd166'
const STAR_C = '#ff7a5a'

// where things are, round a deck of radius 9 (the visitor arrives at z 4.6, facing -z)
const DECK = 9
const GIANT = V3(-62, 14, -80)
const RG = 40
const LENS = V3(-0.9, 2.0, -6.4)
const LR = 1.35
const LENS_SPOT = { x: -0.7, z: -3.0 }
const LAD = { x: 5.6, z: -4.0 }
const LAD_ROT = Math.atan2(2.0 - LAD.x, -0.8 - LAD.z)
const STAR_SPOT = { x: -5.9, z: -0.7 }
const NEW = V3(9, 12, -30) // where the young sun forms: in the open sky between the lens and the ladder

// ---- the triple-alpha catch (seconds of the slowed clock: 1 s here = 100 attoseconds) ----
const AS_PER_S = 100
const HALF_LIFE = 0.82 // beryllium-8: 8.19e-17 s (src/data/nuclides.json) = 82 attoseconds
const TAU_BE = HALF_LIFE / Math.LN2
const T_MEET = 0.55 // the two helium nuclei fly together
const FLY3 = 0.3 // the third one's flight
const SHOW_MADE = 3.2
const SHOW_LOST = 2.0
/** How long the n-th beryllium-8 lives (s on the slowed clock): its real exponential decay (median 0.82 s,
 *  the half-life), drawn from the try's number, so the same for everyone in a room. The very first one
 *  lives at least 1.4 s, so a newcomer sees how the catch goes before the dice are fair. */
const lifeOf = n => {
  const r = random(n * 7919 + 17)
  r()
  r()
  return Math.max(n === 1 ? 1.4 : 0.12, -TAU_BE * Math.log(1 - r() * 0.999))
}
/** A try's outcome from its number and when the third was sent: { made, at } (seconds since the fire). */
function outcome(n, third) {
  const L = lifeOf(n)
  const breaks = T_MEET + L
  if (third >= T_MEET && third + FLY3 <= breaks) return { made: true, at: third + FLY3 }
  return { made: false, at: breaks, late: third >= 0 }
}

// ---- Hoyle's ladder: carbon-12's levels (MeV) and the incoming helium's energy (keV above 8Be + 4He) ----
const LEVEL = { ground: 0, first: 4.439, three: 7.275, pair: 7.367, hoyle: 7.654, guess: 7.7 }
const RES = Math.round((LEVEL.hoyle - LEVEL.pair) * 1000) // 287 keV
const E_MAX = 650
const WIDTH = 14 // keV, the half-width drawn (the real one is less than 10 eV)
const BURST = 16
const SPACING = 0.14
const FLIGHT = 0.6
const BURST_T = BURST * SPACING + FLIGHT + 1.0
/** The chance that a helium at energy e (keV) is caught (drawn wide enough to find with a slider). */
const chance = e => 0.03 + 0.92 / (1 + ((e - RES) / WIDTH) ** 2)
/** Which of the n-th burst's heliums are caught at energy e (the same for everyone in a room). */
const caughtOf = (n, e) => {
  const rnd = random(n * 104729 + 3)
  return Array.from({ length: BURST }, () => rnd() < chance(e))
}
/** A level's height on the ladder (m): the low levels squeezed, the levels near the helium magnified. */
const rungY = mev => (mev < 6 ? 0.55 + (mev / 4.439) * 0.45 : 1.35 + ((mev - 7.2) / 0.8) * 2.0)
const eAtY = y => clamp(((y - 1.35) / 2.0) * 0.8 + 7.2 - LEVEL.pair, 0, E_MAX / 1000) * 1000

// ---- carbon into space: the giant's steps ----
const STEPS = ['giant', 'old', 'nebula', 'cloud', 'you']
const T_OLD = 4.0 // growing old
const T_PUFF = 3.0 // the outer layers leave, the giant's light goes out
const T_DRIFT = 16 // the carbon gathers in the dark cloud
const T_FORM = 9 // the cloud falls into a young sun, a disc and planets
const T_BACK = 3.5 // a new giant fades in (starting again)

/** He-4: two protons and two neutrons on a tetrahedron (the picture's look). */
const TET = [V3(1, 1, 1), V3(1, -1, -1), V3(-1, 1, -1), V3(-1, -1, 1)].map(v => v.normalize())
/** C-12: twelve on an icosahedron, six protons and six neutrons, opposite ones of each kind. */
const ICO = (() => {
  const phi = (1 + Math.sqrt(5)) / 2
  const out = []
  for (const a of [-1, 1]) for (const b of [-phi, phi]) out.push(V3(0, a, b), V3(a, b, 0), V3(b, 0, a))
  return out.map(v => {
    const u = v.clone().normalize()
    return { v: u, p: u.x + u.y * 0.1 + u.z * 0.01 > 0 }
  })
})()

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const stage = giantStage({ radius: DECK, light, pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1, center: GIANT.toArray(), size: RG })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const lang = ctx.lang()
  const lvKey = () => depth(level())
  const paras = (list, lv) => list[depth(lv)].map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const near = (spot, r) => Math.hypot(ctx.engine.player.pos.x - spot.x, ctx.engine.player.pos.z - spot.z) < r
  const label = (text, size, c = '#eef2ff', opts = {}) => makeText(text, { size, color: c, anchorX: 'center', anchorY: 'middle', ...opts })
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const glowSprite = (c, size, opacity = 1, blending = THREE.AdditiveBlending) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: c, transparent: true, opacity, depthWrite: false, blending }))
    s.scale.setScalar(size)
    return s
  }
  const metal = new THREE.MeshStandardMaterial({ color: '#3a3448', roughness: 0.5, metalness: 0.3 })
  const GOLD = new THREE.Color('#ffd166')
  // words that follow the reader's depth (3D signs): set again when the level changes
  const relabels = []
  let shownLevel = null

  // ================= the lens onto the core: the triple-alpha catch =================
  const lens = new THREE.Group()
  lens.position.copy(LENS)
  lens.lookAt(0.0, 1.6, -2.2)
  root.add(lens)
  const plasma = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; varying vec2 vUv;
      ${NOISE}
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float n = fbm(vec3(p * 2.4, uTime * 0.12));
        float m = fbm(vec3(p * 5.5 + 4.0, -uTime * 0.2));
        // (linear colours: a pale gold middle, orange, then deep red at the rim, as the picture's lens)
        vec3 c = mix(vec3(0.85, 0.5, 0.17), vec3(0.62, 0.16, 0.035), smoothstep(0.0, 0.62, r));
        c = mix(c, vec3(0.12, 0.012, 0.02), smoothstep(0.62, 1.0, r));
        c *= 0.55 + 0.45 * n + 0.18 * m;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const face = new THREE.Mesh(new THREE.CircleGeometry(LR, 72), plasma)
  lens.add(face)
  const rimMat = new THREE.MeshStandardMaterial({ color: '#fff4d6', emissive: '#fff4d6', emissiveIntensity: 1.1, roughness: 0.4 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(LR, 0.07, 12, 96), rimMat)
  const ringMat = new THREE.MeshStandardMaterial({ color: CATCH_C, emissive: CATCH_C, emissiveIntensity: 1.3, roughness: 0.4 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(LR + 0.14, 0.03, 8, 96), ringMat)
  // a glint on the glass, as the picture's lens has
  const glint = new THREE.Mesh(
    new THREE.RingGeometry(LR * 0.78, LR * 0.84, 40, 1, Math.PI * 0.58, Math.PI * 0.32),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.28, depthWrite: false }),
  )
  glint.position.z = 0.2
  lens.add(rim, ring, glint)
  // the lens on its stand
  {
    const post = new THREE.Mesh(new RoundedBoxGeometry(0.16, LENS.y - LR, 0.16, 2, 0.04), metal)
    post.position.set(LENS.x, (LENS.y - LR) / 2, LENS.z - 0.2)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.08, 32), metal)
    foot.position.set(LENS.x, 0.04, LENS.z - 0.05)
    root.add(post, foot)
    solids.push(circle(LENS.x, LENS.z - 0.05, 0.55))
  }
  // found: the outer ring turns gold, as a screen's frame does
  const lensSign = {
    setRead(r) {
      ringMat.color.set(r ? GOLD : CATCH_C)
      ringMat.emissive.set(r ? GOLD : CATCH_C)
    },
  }
  // a soft light in front of the glass, a metre off, so the nuclei show their shape
  const lensLight = new THREE.PointLight('#fff0dc', 2.2, 5, 1.2)
  lensLight.position.set(0, 0.2, 1.4)
  lens.add(lensLight)
  // the nuclei: protons and neutrons, each kind one draw call
  const RN = 0.1
  const NMAX = 48
  const sphere = new THREE.SphereGeometry(1, 16, 12)
  const pMesh = new THREE.InstancedMesh(sphere, new THREE.MeshStandardMaterial({ color: PROTON, emissive: '#6a1418', emissiveIntensity: 0.9, roughness: 0.4 }), NMAX)
  const nMesh = new THREE.InstancedMesh(sphere, new THREE.MeshStandardMaterial({ color: NEUTRON, emissive: '#2c3346', emissiveIntensity: 0.9, roughness: 0.4 }), NMAX)
  for (const m of [pMesh, nMesh]) {
    m.frustumCulled = false
    m.count = 0
    lens.add(m)
  }
  // a glow under each helium on its way, and the flash and gamma rays of a carbon made
  const heGlow = [0, 1, 2].map(() => {
    const s = glowSprite('#ffffff', 0.55, 0)
    lens.add(s)
    return s
  })
  const burstTex = canvasTex(256, 256, (g, w) => {
    const c = w / 2
    const grd = g.createRadialGradient(c, c, 0, c, c, c)
    grd.addColorStop(0, 'rgba(255,255,240,1)')
    grd.addColorStop(0.3, 'rgba(255,240,190,0.85)')
    grd.addColorStop(1, 'rgba(255,200,120,0)')
    g.fillStyle = grd
    g.beginPath()
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * TAU
      const r = (k % 2 ? 0.3 : k % 4 === 2 ? 0.72 : 1) * c
      g[k ? 'lineTo' : 'moveTo'](c + Math.cos(a) * r, c + Math.sin(a) * r)
    }
    g.closePath()
    g.fill()
  })
  textures.push(burstTex)
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: burstTex, color: hdr('#fff6d8', 1.4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  flash.position.z = 0.05
  lens.add(flash)
  const gammaMat = new THREE.MeshBasicMaterial({ color: hdr('#fffbe0', 1.6), transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  const gammaGeo = (() => {
    const pts = []
    for (let i = 0; i <= 40; i++) {
      const k = i / 40
      pts.push(V3(k * 0.62, Math.sin(k * 9 * Math.PI) * 0.045, 0))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.012, 5, false)
  })()
  const gammas = [0.45, 2.55, 4.65].map(a => {
    const m = new THREE.Mesh(gammaGeo, gammaMat)
    m.rotation.z = a
    m.userData.dir = V3(Math.cos(a), Math.sin(a), 0)
    m.position.z = 0.1
    lens.add(m)
    return m
  })
  // the words: what it is (above), the tally (below), the Scientist's clock (beside)
  const coreTitle = label('', 0.14, hdr(CATCH_C, 1.15), { maxWidth: 2.7 })
  coreTitle.position.set(0, LR + 0.42, 0.05)
  coreTitle.anchorY = 'bottom'
  const status = label('', 0.13, '#ffffff', { outlineWidth: 0.012, outlineColor: '#3a0d08' })
  status.position.set(0, -0.5, 0.16)
  const tally = label('', 0.11, '#ffe9c8')
  tally.position.set(0, LR + 0.26, 0.05)
  const clockA = label('', 0.1, '#fff3d6', { anchorX: 'left' })
  const clockB = label('', 0.085, '#ffd9a8', { anchorX: 'left' })
  const clockC = label('', 0.075, '#e8c6a0', { anchorX: 'left' })
  clockA.position.set(LR + 0.28, 0.32, 0.05)
  clockB.position.set(LR + 0.28, 0.12, 0.05)
  clockC.position.set(LR + 0.28, -0.06, 0.05)
  lens.add(coreTitle, status, tally, clockA, clockB, clockC)
  relabels.push(lv => {
    setText(coreTitle, at(E.catch.signs.core, lv))
    const sci = lv === 'scientist'
    clockA.visible = clockB.visible = clockC.visible = sci
    setText(clockB, fill(E.catch.signs.half, { t: Math.round(AS_PER_S * HALF_LIFE) }))
    setText(clockC, E.catch.signs.scale)
  })

  // the cone of light from the spot on the giant the lens shows (the picture's zoom)
  const apexDir = LENS.clone().sub(GIANT).normalize()
  const apex = GIANT.clone().addScaledVector(apexDir, RG * 1.002)
  const coreMark = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.2, 48), new THREE.MeshBasicMaterial({ color: hdr('#fff6e0', 1.3), transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }))
  coreMark.position.copy(apex)
  coreMark.lookAt(LENS)
  root.add(coreMark)
  const CONE = 48
  const conePos = new Float32Array((CONE + 1) * 3)
  const coneGeo = new THREE.BufferGeometry()
  coneGeo.setAttribute('position', new THREE.BufferAttribute(conePos, 3))
  const coneIdx = []
  for (let i = 0; i < CONE; i++) coneIdx.push(0, 1 + i, 1 + ((i + 1) % CONE))
  coneGeo.setIndex(coneIdx)
  const coneMat = new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const cone = new THREE.Mesh(coneGeo, coneMat)
  cone.frustumCulled = false
  root.add(cone)
  {
    conePos.set(apex.toArray(), 0)
    lens.updateMatrixWorld()
    for (let i = 0; i < CONE; i++) {
      const a = (i / CONE) * TAU
      conePos.set(V3(Math.cos(a) * LR, Math.sin(a) * LR, 0).applyMatrix4(lens.matrixWorld).toArray(), 3 + i * 3)
    }
    coneGeo.computeBoundingSphere()
  }

  // the catch's state
  const C = { n: 0, start: -99, third: -1, made: 0, lost: 0, resolved: true, mine: false, said: true, sound: 0 }
  // the room's clock is wall time: a slow page (the engine caps a frame at 1/20 s) or a hidden one keeps
  // the same moments as everyone else's in a room
  const born = performance.now()
  const clock = () => (performance.now() - born) / 1000
  const age = () => clock() - C.start
  const result = () => outcome(C.n, C.third)
  const showFor = r => (r.made ? SHOW_MADE : SHOW_LOST)
  const catchBusy = () => C.n > 0 && age() < result().at + showFor(result())
  const phase = () => {
    if (!catchBusy()) return 'ready'
    const a = age()
    const r = result()
    if (a < T_MEET) return 'meet'
    if (a < r.at) return C.third >= 0 ? 'third' : 'be8'
    return r.made ? 'made' : 'lost'
  }
  const catchPanel = lv => ({
    title: E.catch.title,
    color: CATCH_C,
    blocks: [
      ...paras(E.catch.panel, lv),
      { buttons: [{ label: phase() === 'be8' ? E.catch.verbs.third : E.catch.verbs.fire, onClick: () => catchStep() }] },
      { rows: [[E.catch.made, String(C.made)], [E.catch.lost, String(C.lost)], ...(lv === 'scientist' ? E.catch.rows : [])] },
    ],
  })
  /** Start a try (n), `a` seconds in, the third sent at `third` (or -1). */
  const startTry = (n, a, third) => {
    C.n = n
    C.start = clock() - a
    C.third = third
    const r = result()
    C.resolved = a >= r.at
    C.said = a > 0.2
    C.sound = a > 0.2 ? 9 : 0
  }
  /** A tap on the lens: fire the first two, or send the third. */
  function catchStep() {
    const lv = level()
    const ph = phase()
    if (ph === 'ready') {
      C.mine = true
      startTry(C.n + 1, 0, -1)
      play('proton')
      say(at(E.catch.says.fire, lv), CATCH_C)
      share('catch')
      refresh(catchPanel)
      return true
    }
    if (ph === 'meet') return say(at(E.catch.says.early, lv), CATCH_C)
    if (ph === 'be8') {
      C.mine = true
      C.third = age()
      play('beam')
      share('catch')
      refresh(catchPanel)
      return true
    }
    say(at(W.busy, lv))
    return false
  }
  ex.add({
    id: 'catch',
    x: LENS_SPOT.x,
    z: LENS_SPOT.z,
    radius: 1.9,
    label: E.catch.label,
    verb: () => {
      const H = E.catch.hints
      const ph = phase()
      return ph === 'ready' ? H.fire : ph === 'be8' ? H.third : H.watch
    },
    manual: true,
    screens: [lensSign],
    focus: { x: LENS.x, y: LENS.y + 0.05, z: LENS.z, size: 4.3, width: 2.9 },
    act: () => ctx.showPanel(catchPanel),
  })
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LR + 0.2, 32), new THREE.MeshBasicMaterial({ visible: false }))
  lensHit.position.z = 0.25
  lens.add(lensHit)
  clickable(lensHit, () => catchStep(), { reach: 7.5 })

  // where each nucleon is: the third waits below, the first two come from the upper corners
  const MID = V3(0, 0.18, 0.12)
  const A0 = V3(-0.95, 0.62, 0.12)
  const B0 = V3(0.95, 0.62, 0.12)
  const C0 = V3(0, -0.98, 0.12)
  const tmpM = new THREE.Object3D()
  const tmpQ = new THREE.Quaternion()
  const tmpE = new THREE.Euler()
  let pn = 0
  let nn = 0
  const put = (p, isP, s = 1) => {
    const mesh = isP ? pMesh : nMesh
    const i = isP ? pn++ : nn++
    if (i >= NMAX) return
    tmpM.position.copy(p)
    tmpM.scale.setScalar(RN * s)
    tmpM.updateMatrix()
    mesh.setMatrixAt(i, tmpM.matrix)
  }
  const helium = (c, turn, s = 1) => {
    tmpQ.setFromEuler(tmpE.set(turn * 0.7, turn, 0))
    TET.forEach((v, i) => put(v.clone().applyQuaternion(tmpQ).multiplyScalar(RN * 1.18 * s).add(c), i % 2 === 0, s))
  }
  const carbon = (c, turn, s = 1) => {
    tmpQ.setFromEuler(tmpE.set(0.5 + turn * 0.4, turn, 0))
    const k = ((RN * 2) / 1.0515) * 0.95 * s
    for (const { v, p } of ICO) put(v.clone().applyQuaternion(tmpQ).multiplyScalar(k).add(c), p, s)
  }
  // helium nuclei drifting in the core behind the play, small (farther off)
  const DRIFT = (light ? [0, 1] : [0, 1, 2, 3]).map(i => ({ a: i * 1.7 + 0.4, b: i * 2.3 + 1.1, s: 0.12 + i * 0.03 }))
  const lerp3 = (a, b, k) => a.clone().lerp(b, k)
  const poseLens = (dt, t) => {
    pn = 0
    nn = 0
    for (const d of DRIFT) {
      // in front of the glass's plasma, inside its rim, kept off the middle where the play is
      const p = V3(Math.sin(t * d.s + d.a) * 0.85, Math.cos(t * d.s * 0.8 + d.b) * 0.8, 0.03)
      const off = V3(p.x - MID.x, p.y - MID.y, 0)
      if (off.length() < 0.6) p.copy(MID).addScaledVector(off.normalize(), 0.6).setZ(0.03)
      if (Math.hypot(p.x, p.y) > LR - 0.25) p.setLength(LR - 0.25).setZ(0.03)
      helium(p, t * 0.6 + d.a, 0.6)
    }
    const ph = phase()
    const a = age()
    const r = result()
    const spin = t * 1.2
    let say1 = ''
    heGlow.forEach(g => (g.material.opacity = 0))
    flash.material.opacity = 0
    gammaMat.opacity = 0
    if (ph === 'ready') {
      // the three wait, bobbing; they come back in after a try
      const back = C.n > 0 ? span(r.at + showFor(r), r.at + showFor(r) + 0.6, a) : 1
      const s = C.n > 0 && a < r.at + showFor(r) + 0.6 ? 0.3 + 0.7 * back : 1
      const bob = k => V3(0, Math.sin(t * 1.6 + k) * 0.03, 0)
      helium(A0.clone().add(bob(0)), spin, s)
      helium(B0.clone().add(bob(2)), -spin, s)
      helium(C0.clone().add(bob(4)), spin * 0.8, s)
    } else {
      // the first two: flying in, then joined as beryllium-8 until it breaks or the third arrives
      const k = span(0, T_MEET, a)
      const sep = RN * 1.28
      if (a < T_MEET) {
        helium(lerp3(A0, MID.clone().add(V3(-sep, 0, 0)), k), spin, 1)
        helium(lerp3(B0, MID.clone().add(V3(sep, 0, 0)), k), -spin, 1)
        heGlow[0].position.copy(lerp3(A0, MID, k))
        heGlow[1].position.copy(lerp3(B0, MID, k))
        heGlow[0].material.opacity = heGlow[1].material.opacity = 0.5
      } else if (a < r.at || !r.made) {
        const alive = a < r.at
        // beryllium-8: two helium clusters touching, trembling; after it breaks they fly apart
        const u = alive ? 0 : a - r.at
        const wob = alive ? Math.sin(t * 38) * 0.012 + Math.sin(t * 23) * 0.008 : 0
        const out = u * 1.4
        const turn = new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), Math.sin(t * 3) * 0.25)
        const offA = V3(-(sep + wob + out), 0.04 * u, 0).applyQuaternion(turn)
        const offB = V3(sep + wob + out, -0.04 * u, 0).applyQuaternion(turn)
        const fade = alive ? 1 : 1 - span(0.9, SHOW_LOST, u)
        if (fade > 0.02) {
          helium(MID.clone().add(offA), spin, fade)
          helium(MID.clone().add(offB), -spin, fade)
        }
        if (alive) say1 = at(E.catch.signs.be8, level())
        else if (u < 1.2) say1 = at(E.catch.signs.broke, level())
      }
      // the third: waiting, then on its way; it flies on through if it came too late
      if (C.third < 0) {
        if (!(r.made === false && a > r.at + 0.8)) helium(C0.clone().add(V3(0, Math.sin(t * 1.6) * 0.03, 0)), spin * 0.8, r.made === false && a > r.at ? 1 - span(r.at, r.at + 0.8, a) : 1)
      } else {
        const f = (a - C.third) / FLY3
        if (!r.made || f < 1) {
          const p = lerp3(C0, MID, Math.min(1.9, f))
          if (f < 2.2) {
            helium(p, spin * 0.8, 1 - span(1.4, 2.2, f))
            heGlow[2].position.copy(p)
            heGlow[2].material.opacity = 0.5 * (1 - span(1.2, 2.0, f))
          }
        }
      }
      // carbon-12, its flash and its gamma rays
      if (r.made && a >= r.at) {
        const u = a - r.at
        carbon(MID, t * 0.5, Math.min(1, 0.6 + u * 3))
        flash.position.set(MID.x, MID.y, 0.06)
        flash.material.opacity = 1 - span(0, 1.2, u)
        flash.scale.setScalar(0.7 + u * 1.4)
        gammaMat.opacity = 1 - span(0.6, 2.2, u)
        for (const gm of gammas) gm.position.copy(MID).addScaledVector(gm.userData.dir, 0.3 + u * 0.7).setZ(0.1)
        say1 = at(E.catch.signs.c12, level())
      }
    }
    pMesh.count = Math.min(NMAX, pn)
    nMesh.count = Math.min(NMAX, nn)
    pMesh.instanceMatrix.needsUpdate = true
    nMesh.instanceMatrix.needsUpdate = true
    // the status over the play, the Scientist's clock
    status.visible = !!say1
    if (say1) {
      setText(status, say1)
      status.fillOpacity = ph === 'be8' || ph === 'third' ? 0.75 + Math.sin(t * 20) * 0.25 : 1
    }
    if (level() === 'scientist') {
      const life = ph === 'be8' || ph === 'third' ? Math.max(0, a - T_MEET) : ph === 'lost' || ph === 'made' ? r.at - T_MEET : 0
      setText(clockA, fill(E.catch.signs.clock, { t: Math.round(life * AS_PER_S) }))
    }
    setText(tally, fill(E.catch.signs.tally, { made: C.made, lost: C.lost }))
  }
  updates.push((dt, t) => {
    plasma.uniforms.uTime.value = t
    // the try's moments: sounds, the Atomling's words, the count
    if (C.n > 0) {
      const a = age()
      const r = result()
      if (C.sound < 1 && a >= T_MEET) {
        C.sound = 1
        play('join', { order: 2 })
      }
      if (!C.resolved && a >= r.at) {
        C.resolved = true
        if (r.made) C.made++
        else C.lost++
        play(r.made ? 'discover' : 'part')
        if (C.mine && !C.said) {
          C.said = true
          say(at(r.made ? E.catch.says.made : r.late ? E.catch.says.late : E.catch.says.lost, level()), CATCH_C)
        }
        if (C.mine) ex.discover('catch', catchPanel, 1.6)
        refresh(catchPanel)
      }
    }
    poseLens(dt, t)
  })

  // ================= Hoyle's ladder =================
  const lad = new THREE.Group()
  lad.position.set(LAD.x, 0, LAD.z)
  lad.rotation.y = LAD_ROT
  root.add(lad)
  lad.updateMatrixWorld()
  const L = (x, y, z) => lad.localToWorld(V3(x, y, z))
  const railMat = new THREE.MeshStandardMaterial({ color: '#7a5a3a', emissive: '#ffb347', emissiveIntensity: 0.25, roughness: 0.5, metalness: 0.3 })
  for (const x of [-0.52, 0.52]) {
    const r = new THREE.Mesh(new RoundedBoxGeometry(0.06, 3.3, 0.06, 2, 0.02), railMat)
    r.position.set(x, 1.65, 0)
    lad.add(r)
  }
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.12, 0.6, 2, 0.04), metal)
    base.position.set(0, 0.06, 0)
    lad.add(base)
    // the break between the low levels and the magnified ones: a zigzag
    const zz = []
    for (let i = 0; i <= 8; i++) zz.push(V3(-0.5 + i * 0.125, 1.18 + (i % 2 ? 0.04 : -0.04), 0.04))
    lad.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(zz), new THREE.LineBasicMaterial({ color: '#c9b8a8', transparent: true, opacity: 0.7 })))
  }
  solids.push(box(LAD.x, LAD.z, 1.6, 0.7, { rot: LAD_ROT }))
  const rungMat = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9, roughness: 0.4 })
  const rung = (mev, c, dashed = false) => {
    const g = new THREE.Group()
    const m = rungMat(c)
    if (dashed) {
      for (let i = 0; i < 7; i++) {
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.04), m)
        d.position.set(-0.45 + i * 0.15, 0, 0)
        g.add(d)
      }
    } else g.add(new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.04, 0.05), m))
    g.position.set(0, rungY(mev), 0.02)
    lad.add(g)
    return { g, m }
  }
  const rungs = {
    ground: rung(LEVEL.ground, '#d8def8'),
    first: rung(LEVEL.first, '#b9c4ee'),
    three: rung(LEVEL.three, '#fff1c4', true),
    pair: rung(LEVEL.pair, '#ffe08a', true),
    hoyle: rung(LEVEL.hoyle, '#8a7a5a'),
  }
  const guess = rung(LEVEL.guess, LADDER_C, true)
  guess.g.position.z = 0.06
  guess.g.scale.set(0.9, 0.7, 1)
  // the levels' names, left of the ladder
  const rungText = {}
  for (const k of ['ground', 'first', 'three', 'pair', 'hoyle', 'guess']) {
    // dark-edged, so they read against the deck's glowing rim; Hoyle's guess just above his level's name
    const t = label('', 0.095, k === 'hoyle' || k === 'guess' ? hdr(LADDER_C, 1.1) : '#e8ecff', { anchorX: 'right', outlineWidth: 0.01, outlineColor: '#120a14' })
    const y = rungY(LEVEL[k]) + (k === 'guess' ? 0.1 : k === 'hoyle' ? -0.06 : k === 'three' ? -0.04 : k === 'pair' ? 0.04 : 0)
    t.position.set(-0.62, y, 0.03)
    lad.add(t)
    rungText[k] = t
  }
  const ladTitle = label('', 0.16, hdr(LADDER_C, 1.15), { maxWidth: 3.2 })
  ladTitle.position.set(0.35, 3.72, 0)
  lad.add(ladTitle)
  // the helium gun on its rail: its height is the energy of the helium it fires
  const railY0 = rungY(LEVEL.pair)
  const railY1 = rungY(LEVEL.pair + E_MAX / 1000)
  const yOfE = e => rungY(LEVEL.pair + e / 1000)
  const gunRail = new THREE.Mesh(new RoundedBoxGeometry(0.05, railY1 - railY0 + 0.2, 0.05, 2, 0.02), railMat)
  gunRail.position.set(1.38, (railY0 + railY1) / 2, -0.05)
  lad.add(gunRail)
  const railHit = new THREE.Mesh(new THREE.BoxGeometry(0.42, railY1 - railY0 + 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }))
  railHit.position.copy(gunRail.position)
  lad.add(railHit)
  const gun = new THREE.Group()
  const gunCore = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), new THREE.MeshBasicMaterial({ color: hdr(HELIUM, 1.5), toneMapped: false }))
  const gunRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 32), rungMat(CATCH_C))
  gunRing.rotation.y = Math.PI / 2
  const gunGlow = glowSprite(HELIUM, 0.6, 0.6)
  const gunHit = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  gun.add(gunCore, gunRing, gunGlow, gunHit)
  gun.position.set(1.38, railY0, 0.02)
  lad.add(gun)
  // the arrow from the gun to the ladder: the helium's energy, brighter the likelier a catch
  const arrowMat = new THREE.MeshBasicMaterial({ color: hdr(HELIUM, 1.1), transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false })
  const arrow = new THREE.Group()
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.025, 0.025), arrowMat)
  shaft.position.x = 0.95
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12), arrowMat)
  head.rotation.z = Math.PI / 2
  head.position.x = 0.58
  arrow.add(shaft, head)
  lad.add(arrow)
  const energyText = label('', 0.09, '#fff3d6')
  const caughtText = label('', 0.1, hdr(LADDER_C, 1.1), { anchorX: 'left' })
  lad.add(energyText, caughtText)
  // the burst: heliums flying along the arrow; a catch flashes and drops to carbon's ground state
  const flyMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshBasicMaterial({ color: hdr(HELIUM, 1.3), toneMapped: false }), BURST)
  const dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshStandardMaterial({ color: CARBON, emissive: '#26262c', roughness: 0.5 }), BURST)
  for (const m of [flyMesh, dropMesh]) {
    m.frustumCulled = false
    m.count = 0
    lad.add(m)
  }
  const catchFlash = glowSprite(LADDER_C, 0.5, 0)
  lad.add(catchFlash)

  // the chart: the visitor's own bursts, caught against energy
  const chartScreen = screen({ width: 1.55, height: 1.15, color: LADDER_C, title: '', line: '', titleSize: 0.1 })
  const chartStand = new THREE.Group()
  {
    const legH = 1.05
    const leg = new THREE.Mesh(new RoundedBoxGeometry(0.1, legH, 0.08, 2, 0.03), metal)
    leg.position.set(0, legH / 2, -0.08)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.05, 20), metal)
    foot.position.set(0, 0.025, -0.08)
    chartScreen.group.position.set(0, legH + 0.5, 0)
    chartScreen.group.rotation.x = -0.2
    chartStand.add(leg, foot, chartScreen.group)
  }
  chartStand.position.set(2.35, 0, 0.5)
  chartStand.rotation.y = -0.45
  lad.add(chartStand)
  {
    const p = L(2.35, 0, 0.5)
    solids.push(circle(p.x, p.z, 0.32))
  }
  const CW = 512
  const CH = 360
  const chartTex = canvasTex(CW, CH, null, { mipmaps: false })
  textures.push(chartTex)
  const chartFace = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.02), new THREE.MeshBasicMaterial({ map: chartTex, toneMapped: false }))
  chartFace.position.set(0, -0.02, 0.002)
  chartScreen.content.add(chartFace)

  // Hoyle's notebook on a lectern: each tap turns a page of the story
  const lectern = new THREE.Group()
  lectern.position.set(-2.45, 0, 0.6)
  lectern.rotation.y = 0.75
  lad.add(lectern)
  {
    const p = L(-2.45, 0, 0.6)
    solids.push(circle(p.x, p.z, 0.32))
    const wood = new THREE.MeshStandardMaterial({ color: '#5a3d2c', roughness: 0.7 })
    const col = new THREE.Mesh(new RoundedBoxGeometry(0.16, 1.0, 0.16, 2, 0.03), wood)
    col.position.y = 0.5
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.06, 0.4, 2, 0.02), wood)
    foot.position.y = 0.03
    const top = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.04, 0.44, 2, 0.015), wood)
    top.position.set(0, 1.04, 0)
    top.rotation.x = 0.42
    lectern.add(col, foot, top)
  }
  const PAGES = 4
  const pageTex = canvasTex(512, 320, null, { mipmaps: false })
  textures.push(pageTex)
  const book = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.35), new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: pageTex, emissiveIntensity: 0.35 }))
  book.position.set(0, 1.075, 0.01)
  book.rotation.x = -Math.PI / 2 + 0.42
  lectern.add(book)
  const bookHit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.55), new THREE.MeshBasicMaterial({ visible: false }))
  bookHit.position.set(0, 1.0, 0)
  lectern.add(bookHit)
  const bookSign = label('', 0.085, hdr(LADDER_C, 1.1))
  bookSign.position.set(0, 1.32, -0.12)
  lectern.add(bookSign)
  /** The notebook's pages: drawings only (no words in Hoyle's hand). */
  const drawPage = page => {
    pageTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#f3e7cc'
      g.fillRect(0, 0, w, h)
      g.fillStyle = 'rgba(120,90,50,0.25)'
      g.fillRect(w / 2 - 2, 0, 4, h)
      g.strokeStyle = 'rgba(150,120,80,0.25)'
      g.lineWidth = 1
      for (let y = 40; y < h; y += 26) {
        g.beginPath()
        g.moveTo(20, y)
        g.lineTo(w - 20, y)
        g.stroke()
      }
      g.strokeStyle = '#3a2a1c'
      g.fillStyle = '#3a2a1c'
      g.lineWidth = 4
      g.lineCap = 'round'
      const L2 = w / 2
      if (page <= 0) {
        // closed: the cover
        g.fillStyle = '#3d2a20'
        g.fillRect(0, 0, w, h)
        g.strokeStyle = '#c9a25a'
        g.strokeRect(24, 24, w - 48, h - 48)
        g.font = '700 46px Outfit'
        g.fillStyle = '#e6c27a'
        g.textAlign = 'center'
        g.fillText('1953', w / 2, h / 2 + 16)
        return
      }
      if (page === 1) {
        // the prediction: a ladder of levels with a step drawn in where carbon needs one
        for (const [y, d] of [[270, false], [200, false], [120, true], [96, false]]) {
          g.setLineDash(d ? [] : [10, 10])
          g.beginPath()
          g.moveTo(60, y)
          g.lineTo(200, y)
          g.stroke()
        }
        g.setLineDash([])
        g.strokeStyle = '#b5382a'
        g.beginPath()
        g.arc(130, 120, 34, 0, TAU)
        g.stroke()
        g.font = '700 70px Outfit'
        g.fillStyle = '#b5382a'
        g.fillText('?', 210, 140)
        // three helium nuclei joining
        for (const [x, y] of [[320, 110], [420, 110], [370, 190]]) {
          g.fillStyle = '#c0484a'
          g.beginPath()
          g.arc(x, y, 18, 0, TAU)
          g.fill()
        }
      } else if (page === 2) {
        // the measurement: a count against energy with a peak
        g.beginPath()
        g.moveTo(40, 280)
        g.lineTo(L2 - 20, 280)
        g.moveTo(40, 280)
        g.lineTo(40, 40)
        g.stroke()
        g.strokeStyle = '#2a4a8a'
        g.beginPath()
        for (let x = 40; x < L2 - 20; x += 4) {
          const y = 270 - 200 * Math.exp(-(((x - 150) / 14) ** 2)) - Math.sin(x * 0.3) * 4
          g[x === 40 ? 'moveTo' : 'lineTo'](x, y)
        }
        g.stroke()
        // the accelerator
        g.strokeStyle = '#3a2a1c'
        g.strokeRect(L2 + 70, 60, 70, 200)
        g.beginPath()
        g.arc(L2 + 105, 60, 35, Math.PI, 0)
        g.stroke()
      } else if (page === 3) {
        // a medal
        g.fillStyle = '#c9a25a'
        g.beginPath()
        g.arc(L2 / 2, 170, 70, 0, TAU)
        g.fill()
        g.strokeStyle = '#8a6a2a'
        g.beginPath()
        g.arc(L2 / 2, 170, 56, 0, TAU)
        g.stroke()
        g.fillStyle = '#5a7ab0'
        g.fillRect(L2 / 2 - 30, 40, 22, 70)
        g.fillStyle = '#b5382a'
        g.fillRect(L2 / 2 + 8, 40, 22, 70)
        g.font = '700 50px Outfit'
        g.fillStyle = '#3a2a1c'
        g.textAlign = 'center'
        g.fillText('1983', L2 + L2 / 2, 185)
      } else {
        // a star and a question: how the story is told
        g.fillStyle = '#e8a03a'
        g.beginPath()
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * TAU - Math.PI / 2
          const r = k % 2 ? 30 : 75
          g[k ? 'lineTo' : 'moveTo'](L2 / 2 + Math.cos(a) * r, 165 + Math.sin(a) * r)
        }
        g.closePath()
        g.fill()
        g.font = '700 110px Outfit'
        g.fillStyle = '#b5382a'
        g.textAlign = 'center'
        g.fillText('?', L2 + L2 / 2, 205)
      }
    })
  }

  // Hoyle's state: the energy (keV above beryllium-8 + helium-4), the bursts, the notebook's page
  const H = { e: 0, n: 0, start: -99, pts: [], page: 0, mine: false, sound: 0 }
  const burstAge = () => clock() - H.start
  const burstBusy = () => H.n > 0 && burstAge() < BURST_T
  const found = () => H.pts.some(([, c]) => c >= BURST / 2)
  let caught = []
  let burstE = 0
  const startBurst = (n, e, a) => {
    H.n = n
    burstE = e
    H.start = clock() - a
    caught = caughtOf(n, e)
    H.sound = a > 0.2 ? BURST : 0
  }
  const drawChart = () => {
    chartTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 64
      const y0 = h - 58
      const x1 = w - 22
      const y1 = 26
      const X = e => x0 + (e / E_MAX) * (x1 - x0)
      const Y = c => y0 - (c / BURST) * (y0 - y1)
      g.strokeStyle = 'rgba(200,210,255,0.18)'
      g.lineWidth = 1
      for (let c = 4; c <= BURST; c += 4) {
        g.beginPath()
        g.moveTo(x0, Y(c))
        g.lineTo(x1, Y(c))
        g.stroke()
      }
      g.strokeStyle = '#c8d0f0'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(x0, y1)
      g.lineTo(x0, y0)
      g.lineTo(x1, y0)
      g.stroke()
      g.fillStyle = '#c8d0f0'
      g.font = '600 22px Outfit'
      g.textAlign = 'center'
      const sci = level() === 'scientist'
      for (const e of [0, 200, 400, 600]) g.fillText(String(e), X(e), y0 + 26)
      g.fillText(sci ? E.hoyle.chart.xSci : E.hoyle.chart.x, (x0 + x1) / 2, y0 + 50)
      g.textAlign = 'right'
      for (const c of [0, 8, 16]) g.fillText(String(c), x0 - 10, Y(c) + 7)
      g.save()
      g.translate(20, (y0 + y1) / 2)
      g.rotate(-Math.PI / 2)
      g.textAlign = 'center'
      g.fillText(E.hoyle.chart.y, 0, 0)
      g.restore()
      // where the gun is now
      g.strokeStyle = 'rgba(255,241,196,0.5)'
      g.setLineDash([6, 6])
      g.beginPath()
      g.moveTo(X(H.e), y1)
      g.lineTo(X(H.e), y0)
      g.stroke()
      g.setLineDash([])
      // the tries, the newest brightest
      H.pts.forEach(([e, c], i) => {
        const k = (i + 1) / H.pts.length
        g.fillStyle = c >= BURST / 2 ? `rgba(255,209,102,${0.45 + 0.55 * k})` : `rgba(255,241,196,${0.35 + 0.6 * k})`
        g.beginPath()
        g.arc(X(e), Y(c), c >= BURST / 2 ? 9 : 7, 0, TAU)
        g.fill()
      })
    })
  }
  const chartTitle = () => chartScreen.set({ title: E.hoyle.chart.title })
  const setEnergy = (e, own) => {
    H.e = Math.round(clamp(e, 0, E_MAX))
    if (own) H.mine = true
    drawChart()
  }
  let sliding = false
  const slid = () => {
    if (sliding) return
    sliding = true
    later(0.25, () => {
      sliding = false
      share('hoyle')
    })
  }
  const hoylePanel = lv => ({
    title: E.hoyle.title,
    color: LADDER_C,
    blocks: [
      {
        slider: {
          label: E.hoyle.slider,
          min: 0,
          max: E_MAX,
          step: 1,
          value: H.e,
          onInput: v => {
            setEnergy(v, true)
            slid()
          },
          format: v => (lv === 'scientist' ? fill(E.hoyle.energySci, { e: Math.round(v), total: num(LEVEL.pair + v / 1000, 3, lang) }) : fill(E.hoyle.energy, { e: Math.round(v) })),
          live: () => H.e,
        },
      },
      { buttons: [{ label: E.hoyle.verbs.fire, onClick: () => hoyleStep('gun') }, { label: E.hoyle.verbs.page, onClick: () => hoyleStep('book') }] },
      ...paras(E.hoyle.panel, lv),
      ...(lv === 'scientist' ? [{ rows: E.hoyle.rows }] : []),
    ],
  })
  /** A tap on Hoyle's ladder: 'gun' fires a burst, 'book' turns the notebook's page, 'rail' (with an
   *  energy in keV) moves the gun there. */
  function hoyleStep(thing, e) {
    const lv = level()
    if (thing === 'rail') {
      setEnergy(e, true)
      play('tap')
      share('hoyle')
      refresh(hoylePanel)
      return true
    }
    if (thing === 'book') {
      H.page = (H.page % PAGES) + 1
      H.mine = true
      drawPage(H.page)
      play('select')
      say(at(E.hoyle.pages[H.page - 1], lv), LADDER_C)
      share('hoyle')
      ex.discover('hoyle', hoylePanel, 3.5)
      return true
    }
    if (burstBusy()) {
      say(at(W.busy, lv))
      return false
    }
    H.mine = true
    startBurst(H.n + 1, H.e, 0)
    play('beam')
    share('hoyle')
    return true
  }
  ex.add({
    id: 'hoyle',
    ...(() => {
      const p = L(0.4, 0, 2.7)
      return { x: p.x, z: p.z }
    })(),
    radius: 2.0,
    label: E.hoyle.label,
    verb: () => {
      const Hh = E.hoyle.hints
      if (burstBusy()) return Hh.watch
      if (!H.pts.length) return Hh.fire
      if (!found()) return Hh.slide
      return H.page < PAGES ? Hh.book : Hh.more
    },
    manual: true,
    screens: [chartScreen],
    focus: (() => {
      const p = L(0.1, 1.9, 0)
      return { x: p.x, y: p.y, z: p.z, size: 5.6, width: 3.75 }
    })(),
    act: () => ctx.showPanel(hoylePanel),
  })
  clickable(gunHit, () => hoyleStep('gun'), { reach: 5.5 })
  clickable(railHit, hit => hoyleStep('rail', eAtY(lad.worldToLocal(hit.point.clone()).y)), { reach: 5.5, accept: h => h.object === railHit })
  clickable(bookHit, () => hoyleStep('book'), { reach: 5.5 })
  relabels.push(lv => {
    const sci = lv === 'scientist'
    const S = E.hoyle.levels[sci ? 'sci' : 'kid']
    setText(rungText.ground, S.ground)
    setText(rungText.first, S.first)
    setText(rungText.three, S.three)
    setText(rungText.pair, S.pair)
    setText(ladTitle, at(E.hoyle.signs.title, lv))
    setText(bookSign, E.hoyle.signs.book)
    chartTitle()
    drawChart()
  })
  const ladTmp = new THREE.Object3D()
  let lastFound = null
  let lastPage = -1
  updates.push((dt, t) => {
    const lv = level()
    const sci = lv === 'scientist'
    const y = yOfE(H.e)
    gun.position.y = damp(gun.position.y, y, 10, dt)
    gunRing.rotation.x = t * 1.5
    const p = chance(H.e)
    arrow.position.y = gun.position.y
    arrowMat.opacity = 0.25 + 0.7 * p
    gunGlow.material.opacity = 0.35 + 0.5 * p + Math.sin(t * 5) * 0.05
    energyText.position.set(1.38, gun.position.y + 0.24, 0.02)
    setText(energyText, sci ? fill(E.hoyle.signs.energySci, { total: num(LEVEL.pair + H.e / 1000, 3, lang) }) : E.hoyle.signs.energy)
    // the Hoyle level: dim and unnamed until found (by a burst, or the notebook's second page)
    const isFound = found() || H.page >= 2
    if (isFound !== lastFound || H.page !== lastPage || shownLevel !== lv) {
      lastFound = isFound
      lastPage = H.page
      rungs.hoyle.m.color.set(isFound ? LADDER_C : '#8a7a5a')
      rungs.hoyle.m.emissive.set(isFound ? LADDER_C : '#3a3020')
      setText(rungText.hoyle, isFound ? at(E.hoyle.levels.hoyle, lv) : '?')
      guess.g.visible = H.page >= 1
      rungText.guess.visible = H.page >= 1
      setText(rungText.guess, at(E.hoyle.levels.guess, lv))
    }
    rungs.hoyle.m.emissiveIntensity = isFound ? 1.1 + Math.sin(t * 3) * 0.25 : 0.4
    // the burst
    let fn = 0
    let dn = 0
    let caughtSoFar = 0
    catchFlash.material.opacity = Math.max(0, catchFlash.material.opacity - dt * 3)
    if (H.n > 0 && burstAge() < BURST_T + 2) {
      const a = burstAge()
      const yb = yOfE(burstE)
      for (let i = 0; i < BURST; i++) {
        const u = (a - i * SPACING) / FLIGHT
        if (u < 0) continue
        if (u < 1) {
          ladTmp.position.set(lerp(1.3, 0.55, u), yb, 0.04)
          ladTmp.scale.setScalar(1)
        } else if (!caught[i]) {
          // not caught: it bounces off and fades
          const v = u - 1
          if (v > 0.8) continue
          ladTmp.position.set(0.55 + v * 0.9, yb + v * 0.3 * (i % 2 ? 1 : -1), 0.04 + v * 0.3)
          ladTmp.scale.setScalar(1 - v / 0.8)
        } else {
          caughtSoFar++
          // caught: a flash, then carbon falls down the ladder to its ground state
          const v = (u - 1) * FLIGHT
          if (v < 0.05 && v >= 0) {
            catchFlash.position.set(0.45, yb, 0.08)
            catchFlash.material.opacity = 0.95
          }
          const dy = Math.min(1, v / 0.9)
          if (a < BURST_T + 1.5) {
            ladTmp.position.set(0.3 - (i % 4) * 0.12, lerp(yb, rungY(0) + 0.08, ease(dy)), 0.07)
            ladTmp.scale.setScalar(1)
            ladTmp.updateMatrix()
            dropMesh.setMatrixAt(dn++, ladTmp.matrix)
          }
          continue
        }
        ladTmp.updateMatrix()
        flyMesh.setMatrixAt(fn++, ladTmp.matrix)
      }
      // the sound of each arrival (a catch rings)
      const arrived = Math.min(BURST, Math.floor(a / SPACING - FLIGHT / SPACING) + 1)
      while (H.sound < arrived && H.sound < BURST) {
        if (caught[H.sound]) play('join', { order: 1 })
        H.sound++
      }
      // the burst done: its point on the chart
      if (a >= BURST * SPACING + FLIGHT && H.pts.at(-1)?.[2] !== H.n) {
        const c = caught.filter(Boolean).length
        H.pts.push([burstE, c, H.n])
        if (H.pts.length > 12) H.pts.shift()
        drawChart()
        refresh(hoylePanel)
        if (H.mine) {
          const near1 = Math.abs(burstE - RES) <= WIDTH * 1.5
          say(at(c >= BURST / 2 ? E.hoyle.says.found : near1 ? E.hoyle.says.close : E.hoyle.says.miss, lv), LADDER_C)
          ex.discover('hoyle', hoylePanel, 1.4)
        }
      }
      caughtText.visible = true
      caughtText.position.set(0.62, yb - 0.14, 0.05)
      setText(caughtText, fill(E.hoyle.signs.caught, { c: caughtSoFar, n: BURST }))
    } else caughtText.visible = false
    flyMesh.count = fn
    dropMesh.count = dn
    flyMesh.instanceMatrix.needsUpdate = true
    dropMesh.instanceMatrix.needsUpdate = true
  })

  // ================= carbon into space: the giant grows old =================
  // back: the giant came back after a story told (it fades in, the young sun fades out)
  const S = { step: 0, start: -99, mine: false, said: 0, back: false }
  const stepAge = () => clock() - S.start
  // the white dwarf left behind
  const dwarf = new THREE.Group()
  dwarf.position.copy(GIANT)
  const dwarfCore = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), new THREE.MeshBasicMaterial({ color: hdr('#dfe9ff', 2.5), toneMapped: false }))
  const dwarfGlow = glowSprite('#bcd4ff', 9, 0)
  dwarf.add(dwarfCore, dwarfGlow)
  root.add(dwarf)
  // the planetary nebula: shells of glowing gas, brightest at their edges
  const shellMat = (c, k) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(c) }, uOpacity: { value: 0 }, uK: { value: k }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = normalize(cameraPosition - wp.xyz);
          vP = position;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform float uOpacity; uniform float uK; uniform float uTime;
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        ${NOISE}
        void main() {
          // clamped: a dot a hair over 1 made pow() of a negative number, a NaN the bloom spread into a
          // black square over the whole view
          float f = clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0);
          float clump = 0.45 + 0.9 * fbm(normalize(vP) * uK + uTime * 0.03);
          float a = max(0.0, (pow(f, 2.2) * 0.9 + 0.12) * clump * uOpacity);
          gl_FragColor = vec4(uColor * a, 1.0);
          #include <colorspace_fragment>
        }`,
    })
  const shells = [
    { c: '#ff4a5e', k: 3.0, r: 1.0 },
    { c: '#ff8a5a', k: 4.0, r: 0.82 },
    { c: '#3fd8c8', k: 5.0, r: 0.6 },
  ].map(s => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, light ? 32 : 56, light ? 20 : 36), shellMat(s.c, s.k))
    m.position.copy(GIANT)
    m.visible = false
    m.userData.r = s.r
    root.add(m)
    return m
  })
  const nebGlow = glowSprite('#4fd0c8', 60, 0)
  nebGlow.position.copy(GIANT)
  root.add(nebGlow)
  // carbon atoms (dark grey) and soot leaving: most drift away with the nebula, a stream comes past the
  // deck to the dark cloud where the young sun will form
  const NC = light ? 90 : 220
  const rnd = random(612)
  const randDir = () => {
    const z = rnd() * 2 - 1
    const f = rnd() * TAU
    const s = Math.sqrt(1 - z * z)
    return V3(s * Math.cos(f), z, s * Math.sin(f))
  }
  const toDeck = V3(0, 2, 0).sub(GIANT).normalize()
  const ATOMS = Array.from({ length: NC }, (_, i) => {
    const stream = i % 5 < 3
    // the rest leave every other way (never toward the deck: one passing the eye blacked the view out)
    let d = stream ? toDeck.clone().add(randDir().multiplyScalar(0.55)).normalize() : randDir()
    if (!stream && d.dot(toDeck) > 0.2) d.addScaledVector(toDeck, -2 * d.dot(toDeck)).normalize()
    const from = GIANT.clone().addScaledVector(d, RG * (0.9 + rnd() * 0.15))
    const cloud = NEW.clone().add(randDir().multiplyScalar(1.2 + rnd() * 2.6))
    // the stream passes in front of the deck, some of it close enough to see atom by atom
    const via = V3(-5 + (rnd() - 0.5) * 14, 4 + rnd() * 6, -15 + (rnd() - 0.5) * 7)
    return {
      stream,
      d,
      from,
      via,
      cloud,
      delay: rnd() * 5,
      dur: T_DRIFT - 6 + rnd() * 4,
      far: 30 + rnd() * 45,
      size: 0.14 + rnd() * 0.12,
      rho: 1.6 + rnd() * 4.2,
      phi: rnd() * TAU,
      lift: (rnd() - 0.5) * 0.3,
      spin: rnd() * TAU,
    }
  })
  const atomMat = new THREE.MeshStandardMaterial({ color: '#5a5c64', emissive: '#2a2b31', roughness: 0.55, metalness: 0.1 })
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 9), atomMat, NC)
  atomMesh.frustumCulled = false
  atomMesh.count = 0
  root.add(atomMesh)
  // soot: dark flecks, seen against the glowing gas
  const NS = light ? 160 : 420
  const sootPos = new Float32Array(NS * 3)
  const sootGeo = new THREE.BufferGeometry()
  sootGeo.setAttribute('position', new THREE.BufferAttribute(sootPos, 3))
  const sootMat = new THREE.PointsMaterial({ color: '#1a1512', size: 0.35, map: stage.glow, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true })
  const soot = new THREE.Points(sootGeo, sootMat)
  soot.frustumCulled = false
  soot.raycast = () => {}
  root.add(soot)
  const SOOT = Array.from({ length: NS }, () => ({ a: (rnd() * NC) | 0, off: randDir().multiplyScalar(0.6 + rnd() * 2.2) }))
  const carbonTag = label('', 0.9, '#d8dbe6', { outlineWidth: 0.06, outlineColor: '#1a0c10' })
  root.add(carbonTag)
  // the dark cloud, lit from behind by a faint red glow, and what it falls into
  const sysGroup = new THREE.Group()
  sysGroup.position.copy(NEW)
  root.add(sysGroup)
  const backGlow = glowSprite('#b04a6a', 26, 0)
  backGlow.position.set(2, 1, -6)
  backGlow.renderOrder = -2
  sysGroup.add(backGlow)
  const darkBlobs = [0, 1, 2, 3, 4].map(i => {
    const s = glowSprite('#140c0c', 9 + (i % 3) * 3, 0, THREE.NormalBlending)
    const a = (i / 5) * TAU
    s.userData.at = V3(Math.cos(a) * 2.2, Math.sin(a * 2) * 1.0, Math.sin(a) * 1.4)
    sysGroup.add(s)
    return s
  })
  const cloudHit = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 8), new THREE.MeshBasicMaterial({ visible: false }))
  sysGroup.add(cloudHit)
  const disc = new THREE.Group()
  {
    // tilted toward the deck, an open ellipse
    const view = V3(0, 1.6, 0).sub(NEW).normalize()
    const n = view.clone().multiplyScalar(Math.cos(1.05)).addScaledVector(V3(0, 1, 0), Math.sin(1.05)).normalize()
    disc.quaternion.setFromUnitVectors(V3(0, 1, 0), n)
  }
  sysGroup.add(disc)
  const dustTex = canvasTex(256, 256, (g, w) => {
    const c = w / 2
    const grd = g.createRadialGradient(c, c, w * 0.06, c, c, c)
    grd.addColorStop(0, 'rgba(255,220,160,0.9)')
    grd.addColorStop(0.3, 'rgba(210,140,90,0.55)')
    grd.addColorStop(0.65, 'rgba(150,90,100,0.3)')
    grd.addColorStop(1, 'rgba(80,60,100,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    // lanes where planets sweep the dust
    g.globalCompositeOperation = 'destination-out'
    for (const r of [0.36, 0.5, 0.66, 0.86]) {
      g.lineWidth = w * 0.018
      g.strokeStyle = 'rgba(0,0,0,0.55)'
      g.beginPath()
      g.arc(c, c, r * c, 0, TAU)
      g.stroke()
    }
  })
  textures.push(dustTex)
  const dustMat = new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const dust = new THREE.Mesh(new THREE.CircleGeometry(6.6, 64), dustMat)
  dust.rotation.x = -Math.PI / 2
  disc.add(dust)
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 16), new THREE.MeshBasicMaterial({ color: hdr('#fff0b8', 2.4), toneMapped: false }))
  const sunGlow = glowSprite('#ffd27a', 7, 0)
  sun.add(sunGlow)
  disc.add(sun)
  const sunLight = new THREE.PointLight('#ffe2b0', 0, 40, 1.2)
  disc.add(sunLight)
  const PLANETS = [
    { rho: 2.1, size: 0.18, c: '#a39b8f' },
    { rho: 2.9, size: 0.26, c: '#d9b778' },
    { rho: 3.85, size: 0.3, c: '#3f86d6', home: true },
    { rho: 5.4, size: 0.55, c: '#c9a070' },
  ].map((p, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: p.c, roughness: 0.8, emissive: p.c, emissiveIntensity: 0.2 }))
    disc.add(m)
    return { ...p, mesh: m, phi: i * 2.1 + 0.6, w: 0.7 / Math.pow(p.rho / 2, 1.5) }
  })
  const home = PLANETS.find(p => p.home)
  // the blue planet: a ring round it and the words, once tapped
  const homeHit = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 8), new THREE.MeshBasicMaterial({ visible: false }))
  home.mesh.add(homeHit)
  homeHit.scale.setScalar(1 / home.size)
  const homeRing = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.72, 48), new THREE.MeshBasicMaterial({ color: hdr('#9fe8ff', 1.6), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }))
  root.add(homeRing)
  const youTag = label('', 0.75, '#ffffff', { outlineWidth: 0.05, outlineColor: '#10223a' })
  const youSub = label('', 0.42, '#cfe8ff', { outlineWidth: 0.035, outlineColor: '#10223a', maxWidth: 12 })
  root.add(youTag, youSub)
  // the station's sign, at the deck's edge, turned to the deck's middle
  const starSign = standingScreen({ width: 1.7, height: 0.6, color: STAR_C, title: E.star.label, line: '', titleSize: 0.15, lineSize: 0.085 }, { top: 1.1, tilt: 0.5, mat: metal })
  // beside the station, behind it as seen from the giant (nothing between the visitor and the star)
  starSign.group.position.set(-8.0, 0, 2.5)
  starSign.group.rotation.y = Math.atan2(8.0, -2.5)
  root.add(starSign.group)
  solids.push(circle(-8.0, 2.4, 0.35))
  relabels.push(lv => starSign.set({ line: at(E.star.sign, lv) }))

  const starPanel = lv => ({
    title: E.star.title,
    color: STAR_C,
    blocks: [
      { buttons: [{ label: E.star.verbs[STEPS[S.step]], onClick: () => starStep(S.step === 4 ? 'again' : S.step <= 1 ? 'star' : S.step === 2 ? 'cloud' : 'planet') }] },
      ...paras(E.star.panel, lv),
    ],
  })
  const ready = () => {
    const a = stepAge()
    return S.step === 0 || (S.step === 1 && a > T_OLD * 0.6) || (S.step === 2 && a > T_DRIFT * 0.55) || (S.step === 3 && a > T_FORM * 0.75) || S.step === 4
  }
  const goStep = (step, a, live) => {
    S.back = step === 0 && (S.step === 4 || a < T_BACK)
    S.step = step
    S.start = clock() - a
    S.said = live ? 0 : 9
    if (live) play(step === 2 ? 'bang' : step === 0 ? 'enter' : step === 4 ? 'celebrate' : 'select')
  }
  /** A tap in the sky: 'star' (the giant, to make it old, then to puff it), 'cloud', 'planet', 'again'. */
  function starStep(thing) {
    const lv = level()
    const want = { star: S.step <= 1, cloud: S.step === 2, planet: S.step === 3, again: S.step === 4 }
    if (!want[thing]) return say(at(E.star.says.order, lv), STAR_C)
    if (!ready()) {
      say(at(W.busy, lv))
      return false
    }
    S.mine = true
    goStep(S.step === 4 ? 0 : S.step + 1, 0, true)
    share('star')
    refresh(starPanel)
    if (S.step === 4) ex.discover('star', starPanel, 3.0)
    return true
  }
  ex.add({
    id: 'star',
    x: STAR_SPOT.x,
    z: STAR_SPOT.z,
    radius: 1.9,
    label: E.star.label,
    verb: () => {
      const Hs = E.star.hints
      if (!ready()) return Hs.watch
      return Hs[STEPS[S.step]]
    },
    manual: true,
    screens: [starSign],
    // the eye goes to the giant, or to the young sun once the carbon gathers there
    focus: {
      get x() {
        return S.step >= 3 ? NEW.x * 0.5 + STAR_SPOT.x * 0.5 : STAR_SPOT.x + (GIANT.x - STAR_SPOT.x) * 0.3
      },
      get y() {
        return S.step >= 3 ? (NEW.y + 1.3) / 2 : 5.5
      },
      get z() {
        return S.step >= 3 ? NEW.z * 0.5 + STAR_SPOT.z * 0.5 : STAR_SPOT.z + (GIANT.z - STAR_SPOT.z) * 0.3
      },
      size: 9,
    },
    act: () => ctx.showPanel(starPanel),
  })
  const nearStar = () => near(STAR_SPOT, 8.5) && !near(LENS_SPOT, 2.4)
  clickable(stage.giant.body, () => starStep('star'), { when: () => S.step <= 1 && nearStar(), reach: 400 })
  clickable(cloudHit, () => starStep('cloud'), { when: () => S.step === 2, reach: 60 })
  clickable(homeHit, () => starStep('planet'), { when: () => S.step === 3, reach: 60 })
  const againHit = new THREE.Mesh(new THREE.SphereGeometry(14, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  dwarf.add(againHit)
  clickable(againHit, () => starStep('again'), { when: () => S.step === 4 && nearStar(), reach: 400 })
  clickable(sysGroup, () => starStep('again'), { when: () => S.step === 4, reach: 60, accept: h => h.object === cloudHit || h.object === homeHit })

  const tmpS = new THREE.Object3D()
  const WARM = stage.fill.color.clone()
  const COOL = new THREE.Color('#b8c4e0')
  const bez = (a, b, c, k) => {
    const u = 1 - k
    return a.clone().multiplyScalar(u * u).addScaledVector(b, 2 * u * k).addScaledVector(c, k * k)
  }
  const orbit = (o, tt) => {
    const a = o.phi + o.w * tt
    return V3(Math.cos(a) * o.rho, o.lift ?? 0, Math.sin(a) * o.rho)
  }
  const discWorld = (o, tt) => orbit(o, tt).applyQuaternion(disc.quaternion).add(NEW)
  const camQ = () => ctx.camera.quaternion
  const poseSky = (dt, t) => {
    const a = stepAge()
    const st = S.step
    // the giant: swelling and reddening as it grows old, then gone as its layers leave
    let scale = 1
    let heat = 0
    let glow = 1
    if (st === 1) {
      const k = span(0, T_OLD, a)
      scale = 1 + 0.18 * k
      heat = k
      // its pulses: the helium shell flaring every few seconds
      glow = 1 + 0.18 * k * Math.max(0, Math.sin(a * 1.8)) ** 6
    } else if (st === 2) {
      const k = span(0, T_PUFF, a)
      scale = 1.18 * (1 - k)
      heat = 1
      glow = 1 + 0.4 * (1 - k)
    } else if (st >= 3) scale = 0
    if (st === 0 && a < T_BACK && S.back) scale = span(0, T_BACK, a)
    stage.giant.set({ scale, heat, glow })
    const giantK = clamp(scale)
    // without the giant, the night's fill is grey-blue (the white dwarf's light is faint)
    stage.fill.color.copy(WARM).lerp(COOL, 1 - giantK)
    // the spot the lens shows stays on the giant's face as it swells
    coreMark.position.copy(GIANT).addScaledVector(apexDir, RG * Math.max(0.01, scale) * 1.002)
    conePos.set(coreMark.position.toArray(), 0)
    coneGeo.attributes.position.needsUpdate = true
    coreMark.material.opacity = 0.85 * giantK
    coneMat.opacity = 0.045 * giantK
    coreMark.visible = cone.visible = giantK > 0.05
    // the white dwarf
    const dw = st === 2 ? span(0.5, T_PUFF, a) : st >= 3 ? 1 : st === 0 && S.back ? 1 - span(0, T_BACK * 0.6, a) : 0
    dwarf.visible = dw > 0.01
    dwarfGlow.material.opacity = 0.9 * dw
    dwarfCore.scale.setScalar(Math.max(0.01, dw))
    // the nebula: the shells grow and fade over the steps after the puff
    const nebT = st === 2 ? a : st === 3 ? T_DRIFT + a : st === 4 ? T_DRIFT + T_FORM + a : -1
    const backFade = st === 0 && S.back ? 1 - span(0, T_BACK * 0.7, a) : 1
    for (const sh of shells) {
      const on = nebT >= 0 || (st === 0 && backFade > 0.01 && S.back)
      const tt = nebT >= 0 ? nebT : T_DRIFT + T_FORM + 10
      sh.visible = on
      if (!on) continue
      // it grows to well past the giant's old size, but stays clear of the deck (about 100 m off)
      const R = (RG * 1.02 + 30 * (1 - Math.exp(-tt / 7))) * sh.userData.r
      sh.scale.setScalar(R)
      sh.material.uniforms.uTime.value = t
      sh.material.uniforms.uOpacity.value = span(0, 2.5, tt) * (1 - 0.6 * span(10, 40, tt)) * backFade * 0.75
    }
    nebGlow.material.opacity = (nebT >= 0 ? span(0, 3, nebT) * (1 - 0.6 * span(10, 40, nebT)) * 0.35 : 0) * backFade
    nebGlow.scale.setScalar(70 + 40 * (1 - Math.exp(-Math.max(0, nebT) / 7)))
    // the carbon atoms and the soot
    let n = 0
    const atomPos = []
    const drift = st === 2 ? a : -1
    const form = st === 3 ? a : st === 4 ? T_FORM + a : -1
    const vanishing = st === 0 && S.back && a < T_BACK * 0.6
    const vanish = vanishing ? 1 - span(0, T_BACK * 0.6, a) : 1
    if (drift >= 0 || form >= 0 || vanishing) {
      for (const at0 of ATOMS) {
        let p
        let s = at0.size
        if (form >= 0 || vanishing) {
          if (!at0.stream) continue
          // into the disc: round the young sun, then into the planets
          const tt = form >= 0 ? form : T_FORM + 6
          const k = span(0, T_FORM * 0.6, tt)
          p = at0.cloud.clone().lerp(discWorld(at0, tt), k)
          s *= 0.55 * (1 - span(T_FORM * 0.5, T_FORM, tt) * 0.7) * vanish
        } else {
          const u = drift - at0.delay
          if (u < 0) continue
          if (at0.stream) {
            const k = clamp(u / at0.dur)
            p = bez(at0.from, at0.via, at0.cloud, ease(k))
            // arrived: it melts into the dark cloud
            s *= 1 - 0.45 * span(0.8, 1, k)
          } else {
            p = at0.from.clone().addScaledVector(at0.d, at0.far * (1 - Math.exp(-u / 6)))
            s *= 1 - span(8, 16, u)
          }
          s *= Math.min(1, u * 2)
        }
        if (s < 0.01) continue
        tmpS.position.copy(p)
        tmpS.scale.setScalar(s)
        tmpS.updateMatrix()
        atomMesh.setMatrixAt(n++, tmpS.matrix)
        atomPos.push(p)
      }
    }
    atomMesh.count = n
    atomMesh.instanceMatrix.needsUpdate = true
    const sootK = st === 2 ? span(0.5, 3, a) : st === 3 ? 1 - span(0, T_FORM * 0.6, a) : 0
    sootMat.opacity = 0.9 * sootK
    soot.visible = sootK > 0.01 && atomPos.length > 0
    if (soot.visible) {
      for (let i = 0; i < NS; i++) {
        const base = atomPos[SOOT[i].a % atomPos.length]
        sootPos.set([base.x + SOOT[i].off.x, base.y + SOOT[i].off.y, base.z + SOOT[i].off.z], i * 3)
      }
      sootGeo.attributes.position.needsUpdate = true
    }
    // the word "carbon" travelling with the stream
    const tagK = st === 2 ? span(2, 4, a) * (1 - span(T_DRIFT - 3, T_DRIFT, a)) : 0
    carbonTag.visible = tagK > 0.01
    if (carbonTag.visible) {
      const k = clamp((a - 3) / (T_DRIFT - 6))
      carbonTag.position.copy(bez(GIANT.clone().addScaledVector(toDeck, RG), V3(-5, 7, -15), NEW, ease(0.25 + k * 0.5))).add(V3(0, 1.8, 0))
      carbonTag.quaternion.copy(camQ())
      carbonTag.fillOpacity = tagK
      carbonTag.outlineOpacity = tagK
    }
    // the dark cloud: gathering as the carbon arrives, then falling into the disc
    const cloudK = st === 2 ? span(T_DRIFT * 0.3, T_DRIFT * 0.85, a) : st === 3 ? 1 - span(T_FORM * 0.2, T_FORM * 0.8, a) : 0
    const gone = st === 0 && S.back ? 1 - span(0, T_BACK * 0.6, a) : 1
    darkBlobs.forEach((b, i) => {
      b.material.opacity = 0.92 * cloudK
      b.visible = cloudK > 0.01
      const shrink = st === 3 ? 1 - 0.6 * span(0, T_FORM * 0.7, a) : 1
      b.position.copy(b.userData.at).multiplyScalar(shrink)
      b.material.rotation = t * 0.03 * (i % 2 ? 1 : -1)
    })
    backGlow.material.opacity = 0.55 * Math.max(cloudK, st >= 3 ? 0.5 * gone : 0)
    backGlow.visible = backGlow.material.opacity > 0.01
    // the young sun, its disc and planets
    const sysK = (st === 3 ? span(T_FORM * 0.25, T_FORM * 0.8, a) : st === 4 ? 1 : st === 0 && S.back ? gone : 0) * (st === 0 ? gone : 1)
    const sysT = st === 3 ? a : st === 4 ? T_FORM + a : T_FORM + 20
    sun.visible = sysK > 0.01
    sun.scale.setScalar(Math.max(0.01, sysK))
    sunGlow.material.opacity = 0.9 * sysK
    sunLight.intensity = 30 * sysK
    dustMat.opacity = 0.75 * (st === 3 ? span(T_FORM * 0.1, T_FORM * 0.6, a) : sysK)
    dust.visible = dustMat.opacity > 0.01
    dust.rotation.z = -t * 0.08
    for (const pl of PLANETS) {
      const g = st === 3 ? span(T_FORM * 0.55, T_FORM, a) : sysK
      pl.mesh.visible = g > 0.01
      pl.mesh.scale.setScalar(Math.max(0.001, pl.size * g))
      pl.mesh.position.copy(orbit(pl, sysT))
    }
    // the carbon in you
    const youK = st === 4 ? span(0.3, 1.5, a) : 0
    home.mesh.updateMatrixWorld()
    const hp = home.mesh.getWorldPosition(new THREE.Vector3())
    homeRing.position.copy(hp)
    homeRing.quaternion.copy(camQ())
    homeRing.material.opacity = youK * (0.75 + Math.sin(t * 3) * 0.2)
    homeRing.visible = youK > 0.01
    youTag.visible = youSub.visible = youK > 0.01
    if (youTag.visible) {
      youTag.position.copy(hp).add(V3(0, 1.7, 0))
      youTag.quaternion.copy(camQ())
      youSub.position.copy(hp).add(V3(0, 1.0, 0))
      youSub.quaternion.copy(camQ())
      youTag.fillOpacity = youTag.outlineOpacity = youK
      youSub.fillOpacity = youSub.outlineOpacity = youK
    }
  }
  updates.push((dt, t) => {
    // the Atomling tells each step as it unfolds (for whoever did it)
    if (S.mine && S.said < 1) {
      S.said = 1
      say(at(E.star.says[STEPS[S.step]], level()), STAR_C)
    }
    if (S.mine && S.step === 2 && S.said < 2 && stepAge() > T_DRIFT * 0.55) {
      S.said = 2
      say(at(E.star.says.gather, level()), STAR_C)
    }
    poseSky(dt, t)
  })
  relabels.push(lv => {
    setText(carbonTag, at(E.star.signs.carbon, lv))
    setText(youTag, E.star.signs.you)
    setText(youSub, at(E.star.signs.youSub, lv))
  })

  updates.push((dt, t) => {
    stage.update(t)
    const lv = level()
    if (lv !== shownLevel) {
      for (const f of relabels) f(lv)
      shownLevel = lv
    }
  })
  drawPage(0)
  drawChart()

  return {
    env: { ...stage.env, bloom: { strength: 0.55, radius: 0.5, threshold: 0.85 } },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 7.9 },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: 2.4, z: 3.4, yaw: Math.atan2(2.4, -1.0) },
    back: { x: 0, z: 8.4, rot: Math.PI },
    stand: { x: -2.9, z: 2.6, rot: Math.atan2(2.9, 2.0) },
    parts: {
      catch: {
        tap: () => catchStep(),
        get phase() {
          return phase()
        },
        get n() {
          return C.n
        },
        get made() {
          return C.made
        },
        get lost() {
          return C.lost
        },
        get life() {
          return lifeOf(C.n)
        },
        at: () => LENS.clone(),
      },
      hoyle: {
        tap: (thing, e) => hoyleStep(thing, e), // 'gun', 'book', 'rail' (with an energy in keV)
        energy: v => {
          setEnergy(v, true)
          share('hoyle')
        },
        get state() {
          return { e: H.e, n: H.n, page: H.page, pts: H.pts.map(p => p.slice(0, 2)), busy: burstBusy(), found: found() }
        },
        at: thing => (thing === 'book' ? bookHit : thing === 'rail' ? railHit : gunHit).getWorldPosition(new THREE.Vector3()),
      },
      star: {
        tap: thing => starStep(thing), // 'star', 'cloud', 'planet', 'again'
        get step() {
          return STEPS[S.step]
        },
        get ready() {
          return ready()
        },
        // the steps' moments run on by themselves; a probe may skip ahead
        skip: s => {
          S.start -= s
        },
        at: thing =>
          thing === 'star' ? GIANT.clone().addScaledVector(toDeck, RG * 0.9) : thing === 'planet' ? home.mesh.getWorldPosition(new THREE.Vector3()) : thing === 'again' ? GIANT.clone() : NEW.clone(),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { catch: catchPanel, hoyle: hoylePanel, star: starPanel },
    shared: {
      catch: {
        // done: whether this try's result is already in the counts
        get: () => ({ n: C.n, age: Math.min(30, Math.round(Math.max(0, age()) * 10) / 10), third: C.third < 0 ? -1 : Math.round(C.third * 100) / 100, done: C.resolved, made: C.made, lost: C.lost }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const third = Number(s?.third)
          C.made = Math.max(0, Math.round(Number(s?.made) || 0))
          C.lost = Math.max(0, Math.round(Number(s?.lost) || 0))
          C.mine = false
          if (n > 0) {
            startTry(n, clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60), Number.isFinite(third) && third >= 0 ? third : -1)
            // counted once: here when the result comes, if it was not yet counted there
            C.resolved = !!s?.done
          } else {
            C.n = 0
            C.resolved = true
          }
          if (!live) C.sound = 9
        },
      },
      hoyle: {
        get: () => ({ e: H.e, n: H.n, be: burstE, age: Math.min(30, Math.round(Math.max(0, burstAge()) * 10) / 10), page: H.page, pts: H.pts.map(p => [p[0], p[1]]) }),
        set: (s, live, ago = 0) => {
          H.e = Math.round(clamp(Number(s?.e) || 0, 0, E_MAX))
          const page = Math.round(clamp(Number(s?.page) || 0, 0, PAGES))
          if (page !== H.page) drawPage(page)
          H.page = page
          H.pts = (Array.isArray(s?.pts) ? s.pts : [])
            .filter(p => Array.isArray(p))
            .slice(-12)
            .map(p => [Math.round(clamp(Number(p[0]) || 0, 0, E_MAX)), Math.round(clamp(Number(p[1]) || 0, 0, BURST)), 0])
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const a = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          H.mine = false
          const be = Math.round(clamp(Number(s?.be) || 0, 0, E_MAX))
          if (n > 0) {
            // the last burst at its age, at the energy it was fired at (its point already on the chart
            // once it has landed)
            startBurst(n, be, a)
            if (a >= BURST * SPACING + FLIGHT && H.pts.length) H.pts.at(-1)[2] = n
            if (!live) H.sound = BURST
          } else {
            H.n = 0
            H.start = clock() - 99
            burstE = be
          }
          drawChart()
        },
      },
      star: {
        get: () => ({ step: S.step, age: Math.min(60, Math.round(Math.max(0, stepAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const step = Math.round(clamp(Number(s?.step) || 0, 0, STEPS.length - 1))
          const a = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 600)
          S.mine = false
          goStep(step, a, !!live && step !== S.step)
          S.said = 9
          // a new giant long since back: nothing left to fade in
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
