// Sodium's picture "Sodium 90 km above your head" as a room (docs/knowledge/picture-rooms.md): the picture's
// observatory on its mountain, made a place to stand on. A dry desert summit at night like Cerro Paranal
// (stages/summit.js): a big telescope in its opened dome with a laser launcher on its top ring, a clear sky
// crowded with stars, the Milky Way, a faint glow of the sodium layer low over the far ranges, a sea of
// clouds in the west. Three things to do, each step chosen by tapping its thing (the user, 2026-10-30:
// pressing E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel,
// whose buttons (and a slider for the air's turbulence) do the same:
// - the laser guide star: tap the launcher on the telescope and a 589 nm beam climbs to the sodium layer,
//   where the atoms glow into a star (a short streak as long as the layer is thick, seen from the side); a
//   scale stands beside it in the sky, 0 to 110 km at 0.8 m a kilometre, the layer's band from 80 to 105 km,
//   a plane crossing at 10 km. Tap it again to switch it off;
// - taking the twinkle out: the telescope's camera on a screen shows a star blurred and twinkling; tap the
//   deformable mirror (its thin face cut open on its actuators) and, while the laser star is lit, it ripples
//   to undo the air and the star sharpens into a point with its first diffraction ring. A slider sets the
//   turbulence (the seeing, for the Scientist). Without the laser there is nothing to measure the air by;
// - where the sodium comes from: tap anywhere in the sky and a shooting star comes down there, burning out
//   in the layer and leaving a puff of glowing sodium (new violet atoms in the layer); the panel's meteor
//   shower sends a dozen from one radiant; tap comet Hale-Bopp and its three tails are named, the sodium
//   one glowing.
// All four are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<thing>.tap(...) does what a tap does, for the probes; parts.rayTo(point) aims a real tap.
//
// Facts (checked 2026-10-30): the layer 80 to 105 km, peak near 90 km, a few thousand atoms per cm3, a
// column of about 4e9 atoms per cm2 (Wikipedia "Sodium layer"); first seen by Vesto Slipher in 1929 (the
// D lines in the night sky's glow); meteoroids enter at 11 to 72 km/s and ablate at about 70 to 120 km,
// dust input estimates vary widely (tens of tonnes a day in many recent ones); the excited Na 3p state
// lives about 16 ns; ESO's 4LGSF on Yepun (UT4): four 22 W lasers; Yepun's deformable secondary mirror:
// 1.12 m, about 2 mm thick (ESO gives 1.96 to 2.2 mm), 1170 actuators, up to about 1000 times a second
// (ESO ann16078, potw1307a); Babcock 1953 (adaptive optics), Foy and Labeyrie 1985 (laser guide stars);
// Hale-Bopp's sodium tail: Cremonese et al. 1997 (ApJ 490, L199), CoCAM images from La Palma on 16 to 22
// April 1997, measured to about 7 degrees (IAUC 6631: to the frame's edge, more than 6.5 degrees), driven
// by radiation pressure through resonance fluorescence. The tails here are drawn smaller than the sky's
// scale would make them, to fit the view; the scale beside the beam is the one true to itself.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, screen, hdr, num } from '../../../wings/noble/kit.js'
import { summitStage } from '../../stages/summit.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { SPACE_WORDS } from './space.words.js'

export const WORDS = SPACE_WORDS

const TAU = Math.PI * 2
const K = 0.8 // metres in the room for each kilometre of height in the sky (the scale beside the beam)
const PEAK = 90 * K // the sodium layer's peak, about 90 km
const RC = 16000 // the layer's curve: it sinks toward the far horizon, as the real one does over the Earth
const layerY = (x, z) => PEAK - (x * x + z * z) / (2 * RC)
const NA = '#ab5cf2' // sodium, violet, as the hall's pictures draw its atoms
const GLOW = '#ffb21e' // sodium's own light, 589 nm
const R = 13 // the summit's walkable circle

// ---- where things stand (metres; the spawn looks north, along -z, at the dome) ----
const SPAWN = { x: 1.5, z: 6.2 }
const BACK = { x: 1.5, z: 9.7 }
const CHORD = 10.6
const STAND = { x: -1.8, z: 5.6 }
const HOST = { x: 3.8, z: 4.9 }
const DOME = { x: -3.6, z: -4.6, r: 2.9, h: 2.0, floor: 0.5 }
const AIM = { az: -0.5, el: 0.66 } // the telescope: radians east of north (west is negative), elevation
const LSPOT = { x: -2.2, z: 1.0 }
const DESK = { x: 4.9, z: -2.4 }
const AOSPOT = { x: 3.4, z: 0.7 }
const LOOK = { x: 8.2, z: -6.9 } // the sky watch at the north-east edge
const COMET = { az: 0.8, el: 0.4, d: 470 }
const RADIANT = { az: 1.05, el: 1.0 } // where a meteor shower seems to come from

/** A direction from an azimuth (radians east of north, -z) and an elevation. */
const dirOf = (az, el) => new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el))
const v3 = (x, y, z) => new THREE.Vector3(x, y, z)
const faceTo = (o, x, z) => (o.rotation.y = Math.atan2(x - o.position.x, z - o.position.z))

/** Where a ray from `o` along `d` meets the sodium layer (`off` metres above its peak's surface). */
function hitLayer(o, d, off = 0) {
  const a = (d.x * d.x + d.z * d.z) / (2 * RC)
  const b = d.y + (o.x * d.x + o.z * d.z) / RC
  const c = o.y - PEAK - off + (o.x * o.x + o.z * o.z) / (2 * RC)
  let t
  if (a < 1e-9) t = b > 1e-6 ? -c / b : 900
  else {
    const disc = b * b - 4 * a * c
    t = disc < 0 ? 900 : (-b + Math.sqrt(disc)) / (2 * a)
  }
  if (!(t > 0) || t > 1300) t = Math.min(1300, Math.max(30, t || 900))
  return o.clone().addScaledVector(d, t)
}

/** A rod from a to b (Vector3s). */
function rod(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat)
  m.position.copy(a).addScaledVector(d, 0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
  return m
}

/** A gaussian number (Box-Muller). */
const gauss = (rnd = Math.random) => Math.sqrt(-2 * Math.log(1 - rnd() * 0.999)) * Math.cos(TAU * rnd())

export async function build({ ctx, root, E, W, ex, say, light, lang, level, depth, clickable, color }) {
  const share = id => ctx.share?.(id)
  const refreshPanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const updates = []
  const textures = []
  const glow = glowTexture(128)
  textures.push(glow)
  const ps = lv => list => list[depth(lv)].map(p => ({ p }))

  const stage = summitStage({
    radius: R,
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    chord: CHORD,
    gaps: [[-1.05, -0.35]],
    airglow: '#62b07a',
    glow: 0.7,
    milky: { az: 2.3, el: 0.95, tilt: 0.35 },
    paths: [
      [[BACK.x, BACK.z], [SPAWN.x, SPAWN.z], [1.2, 3.2], [LSPOT.x + 0.6, LSPOT.z + 0.4]],
      [[1.2, 3.2], [AOSPOT.x, AOSPOT.z]],
      [[AOSPOT.x, AOSPOT.z], [6.4, -3.0], [LOOK.x - 0.4, LOOK.z + 0.6]],
    ],
    clearings: [[DOME.x, DOME.z, DOME.r + 1.3], [SPAWN.x, SPAWN.z, 1.3], [DESK.x - 0.7, DESK.z + 0.7, 2.0], [LOOK.x + 0.4, LOOK.z - 0.5, 1.8], [STAND.x, STAND.z, 1.0]],
    lamps: [[0.1, 3.5], [2.7, 2.9], [-3.9, 0.7], [6.6, -3.4], [5.9, 4.4], [-5.6, 3.2]],
  })
  root.add(stage.group)
  const solids = stage.solids

  const M = {
    white: new THREE.MeshStandardMaterial({ color: '#cfd5df', roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f3e', roughness: 0.7, metalness: 0.3 }),
    blue: new THREE.MeshStandardMaterial({ color: '#33467e', roughness: 0.45, metalness: 0.45 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8a93a6', roughness: 0.35, metalness: 0.7 }),
    mirror: new THREE.MeshStandardMaterial({ color: '#c8d4f0', roughness: 0.12, metalness: 0.9, emissive: '#3b4a7a', emissiveIntensity: 0.35 }),
    red: new THREE.MeshStandardMaterial({ color: '#ff3b2a', emissive: '#ff2a1a', emissiveIntensity: 2.0 }),
  }

  // =====================================================================================
  // The telescope in its opened dome
  // =====================================================================================
  const dome = new THREE.Group()
  dome.position.set(DOME.x, 0, DOME.z)
  root.add(dome)
  solids.push(circle(DOME.x, DOME.z, DOME.r + 0.15))
  // the drum: white panels, a door facing the way in, a red lamp over it
  const panels = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#e6e9ef'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(70,80,100,0.45)'
    g.lineWidth = 2
    for (let i = 0; i <= 16; i++) {
      g.beginPath()
      g.moveTo((i / 16) * w, 0)
      g.lineTo((i / 16) * w, h)
      g.stroke()
    }
    g.fillStyle = 'rgba(70,80,100,0.25)'
    g.fillRect(0, h * 0.5 - 1, w, 2)
  }, { repeat: true })
  panels.repeat.set(2, 1)
  textures.push(panels)
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(DOME.r, DOME.r, DOME.h, 56, 1, true), new THREE.MeshStandardMaterial({ map: panels, roughness: 0.6, metalness: 0.15, side: THREE.DoubleSide }))
  drum.position.y = DOME.h / 2
  const lip = new THREE.Mesh(new THREE.TorusGeometry(DOME.r, 0.07, 8, 64), M.steel)
  lip.rotation.x = Math.PI / 2
  lip.position.y = DOME.h
  const inside = new THREE.Mesh(new THREE.CircleGeometry(DOME.r - 0.02, 40), M.dark)
  inside.rotation.x = -Math.PI / 2
  inside.position.y = DOME.floor
  dome.add(drum, lip, inside)
  const door = new THREE.Mesh(new RoundedBoxGeometry(1.0, 1.75, 0.14, 2, 0.03), M.dark)
  const southYaw = Math.atan2(LSPOT.x - DOME.x, LSPOT.z - DOME.z)
  door.position.set(Math.sin(southYaw) * DOME.r, 0.88, Math.cos(southYaw) * DOME.r)
  door.rotation.y = southYaw
  const doorLamp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.1), M.red)
  doorLamp.position.set(Math.sin(southYaw) * (DOME.r + 0.08), 1.9, Math.cos(southYaw) * (DOME.r + 0.08))
  doorLamp.rotation.y = southYaw
  dome.add(door, doorLamp)
  // the dome, opened: its two halves hinged at the rim, folded out to east and west
  const OPEN = 1.42
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group()
    hinge.position.set(s * DOME.r, DOME.h, 0)
    const shell = new THREE.Mesh(new THREE.SphereGeometry(DOME.r + 0.04, 40, 14, s > 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI, 0, Math.PI / 2), M.white)
    shell.position.x = -s * DOME.r
    const rim = new THREE.Mesh(new THREE.TorusGeometry(DOME.r + 0.04, 0.05, 6, 40, Math.PI), M.steel)
    rim.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2
    rim.position.x = -s * DOME.r
    hinge.add(shell, rim)
    hinge.rotation.z = -s * OPEN
    dome.add(hinge)
  }
  // the mount: a pier, a turntable and a fork, turned to the telescope's azimuth
  const mount = new THREE.Group()
  mount.position.set(0, DOME.floor, 0)
  mount.rotation.y = -AIM.az
  dome.add(mount)
  const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 1.0, 24), M.blue)
  pier.position.y = 0.5
  const turn = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.3, 32), M.blue)
  turn.position.y = 1.15
  mount.add(pier, turn)
  const PIVOT = 2.4 // above the floor
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new RoundedBoxGeometry(0.32, PIVOT - 1.0, 0.8, 2, 0.05), M.blue)
    arm.position.set(s * 1.32, 1.3 + (PIVOT - 1.3) / 2, 0)
    const bearing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 20), M.steel)
    bearing.rotation.z = Math.PI / 2
    bearing.position.set(s * 1.32, PIVOT, 0)
    mount.add(arm, bearing)
  }
  // the tube, pointing along its own -z, tilted up to the elevation
  const tube = new THREE.Group()
  tube.position.y = PIVOT
  tube.rotation.x = AIM.el
  mount.add(tube)
  const cell = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.5, 40), M.blue)
  cell.rotation.x = Math.PI / 2
  cell.position.z = 1.3
  const primary = new THREE.Mesh(new THREE.CircleGeometry(0.95, 40), M.mirror)
  primary.rotation.y = Math.PI
  primary.position.z = 1.04
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2.5, 16), M.steel)
  axle.rotation.z = Math.PI / 2
  const ringMid = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.085, 8, 40), M.blue)
  ringMid.position.z = 0.35
  const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.08, 8, 40), M.blue)
  ringTop.position.z = -3.3
  const ringTop2 = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 8, 40), M.blue)
  ringTop2.position.z = -2.95
  tube.add(cell, primary, axle, ringMid, ringTop, ringTop2)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    const b = a + (i % 2 ? -1 : 1) * (TAU / 16)
    tube.add(rod(v3(Math.cos(a) * 1.04, Math.sin(a) * 1.04, 0.35), v3(Math.cos(b) * 0.9, Math.sin(b) * 0.9, -2.95), 0.035, M.steel))
  }
  const secondary = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 20), M.dark)
  secondary.rotation.x = Math.PI / 2
  secondary.position.z = -3.15
  tube.add(secondary)
  for (let i = 0; i < 4; i++) {
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.2), M.steel)
    const a = (i / 4) * TAU + Math.PI / 4
    vane.position.set(Math.cos(a) * 0.6, Math.sin(a) * 0.6, -3.2)
    vane.rotation.z = a
    tube.add(vane)
  }
  // the laser launcher, riding on the top ring like a little telescope beside the big one, its laser in the
  // box behind it; its lens glows faintly orange so it can be found, brightly while it shines
  const launcher = new THREE.Group()
  launcher.position.set(0, 1.18, -2.98)
  tube.add(launcher)
  const lBody = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 1.0, 24), M.white)
  lBody.rotation.x = Math.PI / 2
  lBody.position.z = -0.1
  const lensMat = new THREE.MeshBasicMaterial({ color: hdr(GLOW, 0.6), toneMapped: false })
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), lensMat)
  lens.rotation.y = Math.PI
  lens.position.z = -0.61
  const lRingMat = new THREE.MeshStandardMaterial({ color: GLOW, emissive: GLOW, emissiveIntensity: 1.0, roughness: 0.4 })
  const lRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 28), lRingMat)
  lRing.position.z = -0.6
  const lBox = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.44, 0.85, 2, 0.05), M.white)
  lBox.position.set(0, 0.05, 0.85)
  const lStripe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.6), lRingMat)
  lStripe.position.set(0, 0.2, 0.85)
  const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 1.4), M.blue)
  lFoot.position.set(0, -0.2, 0.3)
  // an easy thing to hit from the ground
  const lHit = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  lHit.position.z = 0.2
  launcher.add(lBody, lens, lRing, lBox, lStripe, lFoot, lHit)
  const laserLight = new THREE.PointLight(GLOW, 0, 7, 2)
  laserLight.position.set(0, 0.3, -0.9)
  launcher.add(laserLight)

  root.updateMatrixWorld(true)
  const AIMDIR = dirOf(AIM.az, AIM.el)
  const L0 = lens.getWorldPosition(new THREE.Vector3())
  const STAR = hitLayer(L0, AIMDIR)
  const TOP = hitLayer(L0, AIMDIR, 18 * K)

  // =====================================================================================
  // 1. The laser guide star
  // =====================================================================================
  // the sodium layer: a thin shell glowing faintly orange, brighter toward the horizon where the eye looks
  // through more of it (and where the laser's star and the meteors' puffs light it)
  const PUFFS = 8
  const layerMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
    uniforms: {
      uColor: { value: new THREE.Color(GLOW) },
      uBase: { value: 0.0042 },
      uCentre: { value: v3(0, PEAK - RC, 0) },
      uSpot: { value: STAR.clone() },
      uSpotK: { value: 0 },
      uPuffs: { value: Array.from({ length: PUFFS }, () => new THREE.Vector4(0, -999, 0, 0)) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uBase; uniform vec3 uCentre; uniform vec3 uSpot; uniform float uSpotK;
      uniform vec4 uPuffs[${PUFFS}];
      varying vec3 vW;
      void main() {
        vec3 n = normalize(vW - uCentre);
        vec3 v = normalize(vW - cameraPosition);
        float mu = abs(dot(n, v));
        float path = min(1.0 / max(mu, 0.02), 12.0);
        float r = length(vW.xz);
        float edge = 1.0 - smoothstep(700.0, 1350.0, r);
        float a = uBase * path * edge;
        a += uSpotK * exp(-pow(length(vW - uSpot) / 9.0, 2.0)) * 0.55;
        for (int i = 0; i < ${PUFFS}; i++) a += uPuffs[i].w * exp(-pow(length(vW - uPuffs[i].xyz) / 11.0, 2.0)) * 0.45;
        gl_FragColor = vec4(uColor, a);
      }`,
  })
  const layerGeo = new THREE.PlaneGeometry(2800, 2800, 70, 70)
  layerGeo.rotateX(-Math.PI / 2)
  {
    const p = layerGeo.attributes.position
    for (let i = 0; i < p.count; i++) p.setY(i, layerY(p.getX(i), p.getZ(i)))
    layerGeo.computeBoundingSphere()
  }
  const layer = new THREE.Mesh(layerGeo, layerMat)
  layer.renderOrder = -5
  layer.frustumCulled = false
  root.add(layer)

  // the sodium atoms in it: violet, as sodium is drawn in the halls; near the laser's star they glow
  const rndA = random(589)
  const NBASE = light ? 100 : 190
  const atomPos = []
  for (let i = 0; i < NBASE; i++) {
    let x, z
    if (i < 36) {
      // a cluster round where the laser meets the layer
      x = STAR.x + gauss(rndA) * 7
      z = STAR.z + gauss(rndA) * 7
    } else {
      const a = (rndA() - 0.5) * 3.6
      const d = 30 + Math.pow(rndA(), 0.8) * 360
      x = SPAWN.x + Math.sin(a) * d
      z = SPAWN.z - Math.cos(a) * d
    }
    atomPos.push(x, layerY(x, z) + clamp(gauss(rndA) * 5 * K, -10 * K, 15 * K), z)
  }
  const atomGeo = new THREE.BufferGeometry()
  atomGeo.setAttribute('position', new THREE.Float32BufferAttribute(atomPos, 3))
  const atomCol = new Float32Array(NBASE * 3)
  atomGeo.setAttribute('color', new THREE.BufferAttribute(atomCol, 3))
  const violet = new THREE.Color(NA)
  const lit = hdr(GLOW, 2.2)
  const atomMat = new THREE.PointsMaterial({ size: 1.5, map: glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, sizeAttenuation: true })
  const atoms = new THREE.Points(atomGeo, atomMat)
  atoms.frustumCulled = false
  root.add(atoms)
  const nearStar = []
  for (let i = 0; i < NBASE; i++) {
    const d = Math.hypot(atomPos[i * 3] - STAR.x, atomPos[i * 3 + 1] - STAR.y, atomPos[i * 3 + 2] - STAR.z)
    nearStar.push(clamp(1 - d / 12))
  }
  const tw = Float32Array.from({ length: NBASE }, () => rndA() * 100)

  // the beam: bright low down where the air is thick and scatters it, a faint thread higher up, and
  // glowing again where it crosses the sodium layer
  const beamMat = (radius, alpha) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: { uColor: { value: hdr(GLOW, 1.2) }, uK: { value: 0 }, uFront: { value: 0 }, uA: { value: alpha } },
      vertexShader: /* glsl */ `
        varying vec3 vW;
        void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform float uK; uniform float uFront; uniform float uA;
        varying vec3 vW;
        void main() {
          float h = vW.y;
          if (h > uFront) discard;
          float air = 0.85 * exp(-h / 18.0) + 0.08;
          float na = exp(-pow((h - ${PEAK.toFixed(1)}) / ${(6 * K).toFixed(2)}, 2.0)) * 1.8;
          gl_FragColor = vec4(uColor * (1.0 + na), (air + na) * uK * uA);
        }`,
    })
  const beamLen = L0.distanceTo(TOP)
  const beams = [
    [0.06, 1.0],
    [0.2, 0.2],
  ].map(([radius, alpha]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, beamLen, 10, 1, true), beamMat(radius, alpha))
    m.position.copy(L0).lerp(TOP, 0.5)
    m.quaternion.setFromUnitVectors(v3(0, 1, 0), AIMDIR)
    m.frustumCulled = false
    root.add(m)
    return m
  })
  // the star: a glow and four rays, as the picture draws it
  const spikes = canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w)
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const grd = g.createLinearGradient(w / 2 - dx * w / 2, w / 2 - dy * w / 2, w / 2 + dx * w / 2, w / 2 + dy * w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,0)')
      grd.addColorStop(0.5, 'rgba(255,255,255,1)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      if (dx) g.fillRect(0, w / 2 - 2, w, 4)
      else g.fillRect(w / 2 - 2, 0, 4, w)
    }
  })
  textures.push(spikes)
  const starGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ffd27a', 2.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  starGlow.position.copy(STAR)
  starGlow.scale.setScalar(8.5)
  const starRays = new THREE.Sprite(new THREE.SpriteMaterial({ map: spikes, color: hdr('#fff0c0', 2.0), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  starRays.position.copy(STAR)
  starRays.scale.setScalar(15)
  root.add(starGlow, starRays)

  // the scale beside the star: 0 to 110 km, the layer's band, planes at 10 km
  const view = v3(STAR.x - SPAWN.x, 0, STAR.z - SPAWN.z).normalize()
  const right = v3(-view.z, 0, view.x)
  const RULER = STAR.clone().addScaledVector(right, 12)
  const ruler = new THREE.Group()
  ruler.position.set(RULER.x, 0, RULER.z)
  faceTo(ruler, SPAWN.x, SPAWN.z)
  root.add(ruler)
  const rulerMat = new THREE.MeshBasicMaterial({ color: hdr('#cfe0ff', 1.1), transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false })
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 110 * K).translate(0, 55 * K, 0), rulerMat)
  ruler.add(bar)
  const rulerTexts = []
  for (let km = 0; km <= 110; km += 10) {
    const big = km % 50 === 0 || km === 90 || km === 10
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(big ? 2.6 : 1.6, 0.3).translate(big ? 1.3 : 0.8, 0, 0), rulerMat)
    tick.position.y = km * K
    ruler.add(tick)
    const word = km === 10 ? `  ${E.laser.sign.planes}` : ''
    const t = makeText(`${km} km${word}`, { size: km === 90 ? 3.0 : 2.3, color: km === 90 ? hdr(GLOW, 1.3) : '#dfe8ff', anchorX: 'left', anchorY: 'middle', outlineWidth: 0.12, outlineColor: '#05061a' })
    t.position.set(3.2, km * K, 0)
    ruler.add(t)
    rulerTexts.push(t)
  }
  // the layer's band on the scale: a glowing stretch from 80 to 105 km, brightest at its peak near 90 km
  const bandTex = canvasTex(8, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0)
    // bottom of the texture = 80 km, top = 105 km; the peak near 90 km (0.4 of the way)
    grd.addColorStop(0, 'rgba(255,178,30,0)')
    grd.addColorStop(0.4, 'rgba(255,190,60,1)')
    grd.addColorStop(1, 'rgba(255,178,30,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(bandTex)
  const bandMat = new THREE.MeshBasicMaterial({ map: bandTex, color: hdr(GLOW, 1.0), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })
  const band = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 25 * K).translate(0, (80 + 12.5) * K, 0.05), bandMat)
  ruler.add(band)
  const bandText = makeText(E.laser.sign.band, { size: 1.8, color: hdr(GLOW, 1.1), anchorX: 'left', anchorY: 'middle', outlineWidth: 0.1, outlineColor: '#05061a' })
  bandText.position.set(3.2, 83.6 * K, 0)
  ruler.add(bandText)
  rulerTexts.push(bandText)
  // the layer's name, on its own line under "90 km" (short lines, so the words fit beside a phone's panel)
  const layerText = makeText(E.laser.sign.layer, { size: 2.1, color: hdr(GLOW, 1.3), anchorX: 'left', anchorY: 'middle', outlineWidth: 0.1, outlineColor: '#05061a' })
  layerText.position.set(3.2, 86.6 * K, 0)
  ruler.add(layerText)
  rulerTexts.push(layerText)

  // a plane crossing at 10 km, its lights blinking
  const plane = new THREE.Group()
  {
    const body = new THREE.MeshStandardMaterial({ color: '#9aa3b8', roughness: 0.5, metalness: 0.4, emissive: '#2a3048', emissiveIntensity: 0.6 })
    const fus = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 6.2, 12), body)
    fus.rotation.z = Math.PI / 2
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), body)
    nose.position.x = 3.1
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 6.8), body)
    wing.position.x = 0.3
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 2.4), body)
    tail.position.x = -2.8
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.06), body)
    fin.position.set(-2.8, 0.6, 0)
    plane.add(fus, nose, wing, tail, fin)
  }
  const navMat = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, fog: false })
  const navRed = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), navMat(hdr('#ff3030', 3)))
  navRed.position.set(0.3, 0, -3.45)
  const navGreen = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), navMat(hdr('#30ff60', 3)))
  navGreen.position.set(0.3, 0, 3.45)
  const strobeMat = navMat(hdr('#ffffff', 4))
  const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), strobeMat)
  strobe.position.set(-3.1, 1.25, 0)
  plane.add(navRed, navGreen, strobe)
  plane.rotation.y = Math.atan2(-right.z, right.x)
  root.add(plane)
  const away = view.clone()

  let laserOn = false
  let beamK = 0 // the beam's light (0..1)
  let front = 0 // how high the beam's light has climbed (world y)
  let starK = 0 // the guide star's light
  let rulerK = 0
  const laserPanel = lv => ({
    title: E.laser.title,
    color,
    blocks: [{ buttons: [{ label: laserOn ? E.laser.off : E.laser.on, accent: true, onClick: () => tapLaser() }] }, ...ps(lv)(E.laser.panel)],
  })
  const setLaser = (v, live) => {
    laserOn = !!v
    if (!live) {
      beamK = laserOn ? 1 : 0
      front = laserOn ? TOP.y + 1 : 0
      starK = laserOn ? 1 : 0
    } else play(laserOn ? 'beam' : 'part')
    refreshPanel(laserPanel)
    refreshPanel(aoPanel)
  }
  function tapLaser() {
    setLaser(!laserOn, true)
    share('laser')
    ex.discover('laser', laserPanel, 3.2)
    say(at(laserOn ? E.laser.says.on : E.laser.says.off, level()))
  }
  // the station: in front of the dome's door, the view up along the beam, a little toward the scale so its
  // words fit beside a panel on an upright phone
  const focusAt = L0.clone().lerp(STAR, 0.32).addScaledVector(right, 5)
  ex.add({
    id: 'laser',
    manual: true,
    x: LSPOT.x,
    z: LSPOT.z,
    radius: 2.3,
    label: E.laser.label,
    verb: () => (laserOn ? E.laser.tapOff : E.laser.tap),
    focus: { x: focusAt.x, y: focusAt.y, z: focusAt.z, size: 10 },
    act: () => ctx.showPanel(laserPanel),
  })
  clickable(launcher, () => tapLaser(), { reach: 17 })

  updates.push((dt, t) => {
    beamK = damp(beamK, laserOn ? 1 : 0, laserOn ? 4 : 9, dt)
    if (laserOn) front = Math.min(TOP.y + 1, Math.max(front, L0.y) + dt * 110)
    else if (beamK < 0.01) front = 0
    const reached = laserOn && front >= STAR.y
    starK = damp(starK, reached ? 1 : 0, reached ? 2.6 : 10, dt)
    for (const m of beams) {
      m.material.uniforms.uK.value = beamK
      m.material.uniforms.uFront.value = laserOn ? front : TOP.y + 1
    }
    beams.forEach(m => (m.visible = beamK > 0.003))
    lensMat.color.copy(hdr(GLOW, 0.6 + 2.4 * beamK))
    lRingMat.emissiveIntensity = 1.0 + 1.6 * beamK + (laserOn ? 0 : 0.35 * Math.sin(t * 2.4))
    laserLight.intensity = 2.5 * beamK
    const flick = 0.92 + 0.08 * Math.sin(t * 17) * Math.sin(t * 5.3)
    starGlow.material.opacity = starK * flick
    starRays.material.opacity = starK * 0.85
    starRays.material.rotation = 0.06 * Math.sin(t * 0.5)
    starGlow.visible = starRays.visible = starK > 0.005
    layerMat.uniforms.uSpotK.value = starK
    // the scale shows with the beam
    rulerK = damp(rulerK, laserOn ? 1 : 0, 2.5, dt)
    ruler.visible = rulerK > 0.01
    rulerMat.opacity = 0.8 * rulerK
    bandMat.opacity = 0.95 * rulerK
    for (const tx of rulerTexts) {
      tx.fillOpacity = rulerK
      tx.outlineOpacity = rulerK
    }
    // the plane, crossing behind the scale every 40 seconds
    const u = ((t / 40) % 1) * 2 - 1
    plane.position.copy(RULER).addScaledVector(right, u * 55).addScaledVector(away, 14)
    plane.position.y = 10 * K
    plane.visible = rulerK > 0.05
    strobe.visible = (t % 1.3) < 0.09
    // the atoms near the star glow while it is lit
    for (let i = 0; i < NBASE; i++) {
      const w = 0.75 + 0.25 * Math.sin(t * 1.3 + tw[i])
      const k = nearStar[i] * starK
      atomCol[i * 3] = lerp(violet.r * w, lit.r, k)
      atomCol[i * 3 + 1] = lerp(violet.g * w, lit.g, k)
      atomCol[i * 3 + 2] = lerp(violet.b * w, lit.b, k)
    }
    atomGeo.attributes.color.needsUpdate = true
  })

  // =====================================================================================
  // 2. Taking the twinkle out: the camera's screen and the deformable mirror
  // =====================================================================================
  const desk = new THREE.Group()
  desk.position.set(DESK.x, 0, DESK.z)
  faceTo(desk, AOSPOT.x, AOSPOT.z)
  root.add(desk)
  solids.push(box(DESK.x, DESK.z, 2.1, 1.0, { rot: desk.rotation.y }))
  const top = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.08, 0.85, 2, 0.03), M.dark)
  top.position.y = 0.8
  desk.add(top)
  for (const [x, z] of [[-0.92, -0.36], [0.92, -0.36], [-0.92, 0.36], [0.92, 0.36]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.06), M.steel)
    leg.position.set(x, 0.4, z)
    desk.add(leg)
  }
  // the screen: the telescope's camera, a star as it sees it
  const scr = screen({ width: 1.5, height: 1.28, color, title: E.ao.screen.title, line: '', titleSize: 0.085, glow: 0.55 })
  scr.group.position.set(0.25, 1.62, -0.2)
  scr.group.rotation.x = -0.06
  desk.add(scr.group)
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.08), M.steel)
  stem.position.set(0.25, 0.98, -0.24)
  desk.add(stem)
  const IMG = 256
  const img = canvasTex(IMG, IMG, (g, w) => {
    g.fillStyle = '#03040c'
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false })
  textures.push(img)
  const imgPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.88), new THREE.MeshBasicMaterial({ map: img, toneMapped: false }))
  imgPlane.position.set(0, -0.05, 0.002)
  scr.content.add(imgPlane)
  const status = makeText(E.ao.screen.off, { size: 0.065, color: '#d2dbff', anchorY: 'middle' })
  status.position.set(0, -0.56, 0.004)
  scr.content.add(status)
  const setStatus = s => {
    if (status.text !== s) {
      status.text = s
      status.sync()
    }
  }
  // the deformable mirror: a thin mirror on a bed of actuators, cut open at the front to show them,
  // tilted toward the visitor on its pedestal
  const ped = new THREE.Group()
  ped.position.set(-1.6, 0, 0.45)
  desk.add(ped)
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.95, 20), M.blue)
  column.position.y = 0.475
  ped.add(column)
  const dm = new THREE.Group()
  dm.position.y = 1.02
  dm.rotation.x = 0.62
  ped.add(dm)
  const MR = 0.5
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(MR + 0.06, MR + 0.06, 0.06, 40), M.dark)
  dm.add(plate)
  // the actuators, on a hexagonal grid
  const acts = []
  for (let j = -9; j <= 9; j++) {
    for (let i = -9; i <= 9; i++) {
      const x = (i + (j % 2 ? 0.5 : 0)) * 0.066
      const z = j * 0.066 * 0.866
      if (Math.hypot(x, z) < MR - 0.03) acts.push([x, z])
    }
  }
  const actGeo = new THREE.CylinderGeometry(0.013, 0.013, 1, 6).translate(0, 0.5, 0)
  const actMat = new THREE.MeshStandardMaterial({ color: '#d29a52', roughness: 0.35, metalness: 0.7, emissive: '#3a2008', emissiveIntensity: 0.6 })
  const actMesh = new THREE.InstancedMesh(actGeo, actMat, acts.length)
  dm.add(actMesh)
  const GAP = 0.2 // from the plate up to the mirror's back
  // the mirror's face: a polar grid with a wedge cut out toward the visitor (+z)
  const RINGS = 12
  const SEGS = 60
  const CUT = 0.5
  const mPos = []
  const mIdx = []
  for (let i = 0; i <= RINGS; i++) {
    const r = (i / RINGS) * MR
    for (let j = 0; j <= SEGS; j++) {
      const a = CUT + (j / SEGS) * (TAU - 2 * CUT)
      mPos.push(Math.sin(a) * r, GAP, Math.cos(a) * r)
    }
  }
  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < SEGS; j++) {
      const a = i * (SEGS + 1) + j
      const b = a + SEGS + 1
      mIdx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  const mGeo = new THREE.BufferGeometry()
  mGeo.setAttribute('position', new THREE.Float32BufferAttribute(mPos, 3))
  const mCol = new Float32Array((mPos.length / 3) * 3)
  mGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 3))
  mGeo.setIndex(mIdx)
  mGeo.computeVertexNormals()
  const mirrorMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.22, metalness: 0.55, emissive: '#26315c', emissiveIntensity: 0.45, side: THREE.DoubleSide })
  const face = new THREE.Mesh(mGeo, mirrorMat)
  dm.add(face)
  const rimDM = new THREE.Mesh(new THREE.TorusGeometry(MR, 0.018, 6, 48, TAU - 2 * CUT), M.steel)
  rimDM.rotation.x = Math.PI / 2
  rimDM.rotation.z = -(Math.PI / 2 - CUT)
  rimDM.position.y = GAP
  dm.add(rimDM)
  const dmHit = new THREE.Mesh(new THREE.CylinderGeometry(MR + 0.1, MR + 0.1, 0.5, 16), new THREE.MeshBasicMaterial({ visible: false }))
  dmHit.position.y = 0.15
  dm.add(dmHit)
  const dmLabel = makeText(E.ao.screen.mirror, { size: 0.07, color: '#e8eeff', anchorY: 'middle', outlineWidth: 0.006, outlineColor: '#0b0f22' })
  dmLabel.position.set(0, 0.72, 0.31)
  ped.add(dmLabel)
  // a dim work light over it, so its ripples catch the light
  const work = new THREE.PointLight('#ffe6d0', 2.2, 3.5, 2)
  work.position.set(-1.6, 2.0, 1.1)
  desk.add(work)

  let aoOn = false
  let turb = 0.45
  let turbShown = turb
  let aoK = 0
  const seeing = v => 0.4 + 1.6 * v
  const airWord = v => (v < 0.34 ? E.ao.calm : v < 0.67 ? E.ao.wavy : E.ao.rough)
  const aoPanel = lv => ({
    title: E.ao.title,
    color,
    blocks: [
      {
        slider: {
          label: E.ao.slider,
          min: 0,
          max: 1,
          step: 0.01,
          value: turb,
          live: () => turb,
          format: v => (lv === 'scientist' ? `${num(seeing(v), 1, lang)}″` : airWord(v)),
          onInput: v => setTurb(v),
        },
      },
      { buttons: [{ label: aoOn ? E.ao.off : E.ao.on, accent: true, onClick: () => tapMirror() }] },
      ...ps(lv)(E.ao.panel),
    ],
  })
  const setAO = (v, live) => {
    aoOn = !!v
    if (!live) aoK = aoOn && laserOn ? 1 : 0
    else play(aoOn ? 'join' : 'part')
    refreshPanel(aoPanel)
  }
  function tapMirror() {
    setAO(!aoOn, true)
    share('ao')
    ex.discover('ao', aoPanel, 3.0)
    say(at(!aoOn ? E.ao.says.off : laserOn ? E.ao.says.on : E.ao.says.wait, level()))
  }
  let turbSend = null
  function setTurb(v, now = false) {
    turb = clamp(Math.round(Number(v) * 100) / 100)
    ex.discover('ao')
    if (now) {
      share('ao')
      return
    }
    if (!turbSend) {
      turbSend = setTimeout(() => {
        turbSend = null
        share('ao')
      }, 250)
    }
  }
  desk.updateMatrixWorld(true)
  const deskFocus = desk.localToWorld(v3(-0.7, 1.25, 0))
  ex.add({
    id: 'ao',
    manual: true,
    x: AOSPOT.x,
    z: AOSPOT.z,
    radius: 2.2,
    label: E.ao.label,
    verb: () => (!aoOn ? E.ao.tap : !laserOn ? E.ao.laserFirst : E.ao.slide),
    screens: [scr],
    focus: { x: deskFocus.x, y: deskFocus.y, z: deskFocus.z, size: 2.7 },
    act: () => ctx.showPanel(aoPanel),
  })
  clickable(dm, () => tapMirror())
  clickable(scr.group, () => tapMirror())

  // the speckles of the twinkling star, drifting
  const speck = Array.from({ length: 16 }, () => ({ x: gauss(), y: gauss(), tx: gauss(), ty: gauss(), b: 0.4 + Math.random() * 0.6 }))
  let reTarget = 0
  let drawAt = 0
  const blob = (g, x, y, r, a, rgb = '255,232,205') => {
    if (a <= 0.004 || r <= 0.3) return
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, `rgba(${rgb},${Math.min(1, a)})`)
    grd.addColorStop(1, `rgba(${rgb},0)`)
    g.fillStyle = grd
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  const drawImage = t =>
    img.userData.redraw((g, w) => {
      g.globalCompositeOperation = 'source-over'
      g.fillStyle = '#03040c'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = 'rgba(111,140,255,0.22)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(w / 2, 12)
      g.lineTo(w / 2, w / 2 - 22)
      g.moveTo(w / 2, w / 2 + 22)
      g.lineTo(w / 2, w - 12)
      g.moveTo(12, w / 2)
      g.lineTo(w / 2 - 22, w / 2)
      g.moveTo(w / 2 + 22, w / 2)
      g.lineTo(w - 12, w / 2)
      g.stroke()
      g.globalCompositeOperation = 'lighter'
      const k = aoK
      const s = (9 + 34 * turbShown) * (1 - 0.92 * k)
      const wob = (1 - k) * (4 + 16 * turbShown)
      const cx = w / 2 + (Math.sin(t * 2.3) * 0.6 + Math.sin(t * 5.1 + 1) * 0.4) * wob
      const cy = w / 2 + (Math.cos(t * 1.9) * 0.6 + Math.sin(t * 4.3 + 2) * 0.4) * wob
      const twk = 1 - (1 - k) * (0.2 + 0.35 * turbShown) * (0.5 + 0.5 * Math.sin(t * 13 + 3 * Math.sin(t * 7)))
      blob(g, cx, cy, s * 2.0 + 8, 0.2 * twk * (1 - 0.6 * k))
      for (const p of speck) blob(g, cx + p.x * s, cy + p.y * s, 4 + 3.5 * (1 - k), p.b * 0.55 * (1 - k) * twk)
      if (k > 0.01) {
        blob(g, w / 2, w / 2, 8, 0.9 * k)
        blob(g, w / 2, w / 2, 3.5, 1.0 * k, '255,255,255')
        g.strokeStyle = `rgba(255,232,205,${0.22 * k})`
        g.lineWidth = 2
        g.beginPath()
        g.arc(w / 2, w / 2, 12, 0, TAU)
        g.stroke()
      }
    })
  const o = new THREE.Object3D()
  const field = (x, z, t, sp) =>
    (Math.sin(x * 7.3 + t * 3.1 * sp) * Math.cos(z * 6.1 - t * 2.3 * sp) * 0.5 +
      Math.sin(x * 11 - z * 9 + t * 4.7 * sp) * 0.3 +
      Math.cos(z * 13 + x * 5 - t * 5.9 * sp) * 0.2)
  const cHigh = new THREE.Color('#ffd28a')
  const cMid = new THREE.Color('#c9d3f5')
  const cLow = new THREE.Color('#4f68d0')
  const ct = new THREE.Color()
  let shaped = -1
  updates.push((dt, t) => {
    const want = aoOn && starK > 0.8 ? 1 : 0
    aoK = damp(aoK, want, want ? 2.2 : 5, dt)
    turbShown = damp(turbShown, turb, 4, dt)
    // the speckles wander faster in rougher air
    reTarget -= dt
    if (reTarget <= 0) {
      reTarget = 0.12 - 0.07 * turbShown
      for (const p of speck) if (Math.random() < 0.35) {
        p.tx = gauss()
        p.ty = gauss()
      }
    }
    const rate = 4 + 10 * turbShown
    for (const p of speck) {
      p.x = damp(p.x, p.tx, rate, dt)
      p.y = damp(p.y, p.ty, rate, dt)
    }
    drawAt -= dt
    if (drawAt <= 0) {
      drawAt = 1 / 30
      drawImage(t)
    }
    setStatus(!aoOn ? E.ao.screen.off : aoK < 0.5 && !laserOn ? E.ao.screen.wait : E.ao.screen.on)
    // the mirror: still while off, rippling against the air while it works
    const amp = 0.04 * aoK * (0.35 + 0.9 * turbShown)
    if (amp > 0.0004 || shaped !== 0) {
      shaped = amp > 0.0004 ? 1 : 0
      const sp = 0.8 + 1.4 * turbShown
      const p = mGeo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const z = p.getZ(i)
        const f = shaped ? field(x, z, t, sp) : 0
        p.setY(i, GAP + 0.02 + amp * f)
        if (f >= 0) ct.copy(cMid).lerp(cHigh, f * aoK)
        else ct.copy(cMid).lerp(cLow, -f * aoK)
        mCol[i * 3] = ct.r
        mCol[i * 3 + 1] = ct.g
        mCol[i * 3 + 2] = ct.b
      }
      p.needsUpdate = true
      mGeo.attributes.color.needsUpdate = true
      mGeo.computeVertexNormals()
      acts.forEach(([x, z], i) => {
        o.position.set(x, 0.03, z)
        o.rotation.set(0, 0, 0)
        o.scale.set(1, GAP - 0.03 + 0.004 + amp * (shaped ? field(x, z, t, sp) : 0), 1)
        o.updateMatrix()
        actMesh.setMatrixAt(i, o.matrix)
      })
      actMesh.instanceMatrix.needsUpdate = true
    }
  })

  // =====================================================================================
  // 3. Where the sodium comes from: shooting stars into the layer, and comet Hale-Bopp
  // =====================================================================================
  // deck chairs at the sky watch, facing the comet
  const canvasMat = new THREE.MeshStandardMaterial({ color: '#3b4f8a', roughness: 0.9 })
  for (const s of [-1, 1]) {
    const chair = new THREE.Group()
    // side by side, across the way the comet is
    const cx = LOOK.x + 0.4 + Math.cos(COMET.az) * s * 0.9
    const cz = LOOK.z - 0.5 + Math.sin(COMET.az) * s * 0.9
    chair.position.set(cx, 0, cz)
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.9), canvasMat)
    seat.position.set(0, 0.42, 0.15)
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.9), canvasMat)
    back.position.set(0, 0.75, -0.55)
    back.rotation.x = 0.85
    chair.add(seat, back)
    for (const [x, z] of [[-0.28, 0.5], [0.28, 0.5], [-0.28, -0.85], [0.28, -0.85]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6), M.steel)
      leg.position.set(x, 0.21, z)
      chair.add(leg)
    }
    root.add(chair)
    // its +z (the sitter's feet) toward the comet
    chair.lookAt(cx + Math.sin(COMET.az), 0, cz - Math.cos(COMET.az))
    solids.push(circle(cx, cz, 0.55))
  }

  // the comet: a bright head, a curved white dust tail, a straight blue ion tail and between them the
  // narrow yellow sodium tail; all on a plane facing the summit
  const comet = new THREE.Group()
  comet.position.copy(dirOf(COMET.az, COMET.el).multiplyScalar(COMET.d))
  comet.lookAt(0, 2, 0)
  root.add(comet)
  const tailTex = (stops, soft = 0.5) =>
    canvasTex(256, 64, (g, w, h) => {
      g.clearRect(0, 0, w, h)
      const along = g.createLinearGradient(0, 0, w, 0)
      for (const [s, c] of stops) along.addColorStop(s, c)
      g.fillStyle = along
      g.fillRect(0, 0, w, h)
      // soft edges across
      g.globalCompositeOperation = 'destination-in'
      const acrossG = g.createLinearGradient(0, 0, 0, h)
      acrossG.addColorStop(0, 'rgba(0,0,0,0)')
      acrossG.addColorStop(soft, 'rgba(0,0,0,1)')
      acrossG.addColorStop(1 - soft, 'rgba(0,0,0,1)')
      acrossG.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = acrossG
      g.fillRect(0, 0, w, h)
    })
  const ionTex = tailTex([[0, 'rgba(170,215,255,1)'], [0.4, 'rgba(90,150,255,0.6)'], [1, 'rgba(60,110,255,0)']], 0.45)
  const naTex = tailTex([[0, 'rgba(255,236,140,1)'], [0.5, 'rgba(255,190,50,0.7)'], [1, 'rgba(255,178,30,0)']], 0.42)
  const dustTex = tailTex([[0, 'rgba(255,250,235,0.95)'], [0.45, 'rgba(255,240,215,0.4)'], [1, 'rgba(255,236,210,0)']], 0.35)
  textures.push(ionTex, naTex, dustTex)
  const tailMat = (map, k) => new THREE.MeshBasicMaterial({ map, color: hdr('#ffffff', k), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide, toneMapped: false })
  // a tail along local +x from the head, `ang` radians from the right, curving by `bend`, widening
  const tailGeo = (len, w0, w1, bend = 0) => {
    const g = new THREE.PlaneGeometry(len, 1, 24, 1)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const u = (p.getX(i) + len / 2) / len
      const across = p.getY(i)
      p.setXY(i, u * len, across * lerp(w0, w1, u) + bend * u * u * len)
    }
    return g
  }
  const D2R = Math.PI / 180
  const PER_DEG = (COMET.d * Math.PI) / 180 // metres per degree at the comet's distance
  const TAILS = {
    dust: { ang: 184 * D2R, len: 11 * PER_DEG, w0: 4, w1: 30, bend: -0.12, map: dustTex, k: 0.85 },
    ion: { ang: 146 * D2R, len: 14 * PER_DEG, w0: 2.5, w1: 9, bend: 0, map: ionTex, k: 1.3 },
    sodium: { ang: 163 * D2R, len: 7 * PER_DEG, w0: 1.6, w1: 4.0, bend: 0, map: naTex, k: 1.8 },
  }
  for (const [id, T] of Object.entries(TAILS)) {
    T.mat = tailMat(T.map, T.k)
    const m = new THREE.Mesh(tailGeo(T.len, T.w0, T.w1, T.bend), T.mat)
    m.rotation.z = T.ang
    m.position.z = id === 'sodium' ? 0.3 : 0
    comet.add(m)
    T.mesh = m
  }
  const coma = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#dff0ff', 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  coma.scale.setScalar(26)
  const nucleus = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ffffff', 3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  nucleus.scale.setScalar(7)
  nucleus.position.z = 0.5
  comet.add(coma, nucleus)
  // the names, at the tails' ends
  const tailTexts = []
  const nameAt = (text, ang, d, c, dy = 0) => {
    const t = makeText(text, { size: 10, color: c, anchorX: 'center', anchorY: 'middle', outlineWidth: 0.6, outlineColor: '#05061a' })
    t.position.set(Math.cos(ang) * d, Math.sin(ang) * d + dy, 1)
    t.visible = false
    comet.add(t)
    tailTexts.push(t)
    return t
  }
  nameAt(E.sky.tails.ion, TAILS.ion.ang, TAILS.ion.len + 22, '#bcd8ff', 6)
  nameAt(E.sky.tails.sodium, TAILS.sodium.ang, TAILS.sodium.len + 34, hdr(GLOW, 1.3), 4)
  nameAt(E.sky.tails.dust, TAILS.dust.ang + 0.08, TAILS.dust.len + 6, '#fff4e0', -30)
  nameAt(E.sky.tails.name, -Math.PI / 2, 26, '#e8eeff')
  const cometHit = new THREE.Mesh(new THREE.PlaneGeometry(170, 80), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }))
  cometHit.position.set(-62, 12, 0)
  comet.add(cometHit)

  // the sky to tap: a sphere inside the stars, hit only above the horizon
  const skyHit = new THREE.Mesh(new THREE.SphereGeometry(640, 24, 12), new THREE.MeshBasicMaterial({ visible: false, side: THREE.BackSide }))
  root.add(skyHit)

  // shooting stars: a head and a fading trail, burning out in the layer; a puff of glowing sodium left
  // where each one ends, which fades into new violet atoms
  const NMET = 24
  const metPos = new Float32Array(NMET * 4 * 3)
  const metA = new Float32Array(NMET * 4)
  const metIdx = []
  for (let i = 0; i < NMET; i++) metIdx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3)
  const metGeo = new THREE.BufferGeometry()
  metGeo.setAttribute('position', new THREE.BufferAttribute(metPos, 3))
  metGeo.setAttribute('aA', new THREE.BufferAttribute(metA, 1))
  metGeo.setIndex(metIdx)
  const trails = new THREE.Mesh(
    metGeo,
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
      uniforms: { uColor: { value: hdr('#fff3d8', 1.6) } },
      vertexShader: /* glsl */ `
        attribute float aA; varying float vA;
        void main() { vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; varying float vA;
        void main() { gl_FragColor = vec4(uColor, vA); }`,
    }),
  )
  trails.frustumCulled = false
  root.add(trails)
  const heads = Array.from({ length: NMET }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#fff8e8', 2.5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.visible = false
    root.add(s)
    return s
  })
  const meteors = [] // { a, b, delay, dur, t, slot, puffed }
  const NPUFF = 12
  const puffs = Array.from({ length: NPUFF }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr(GLOW, 1.4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.visible = false
    root.add(s)
    return { s, t: 99, at: new THREE.Vector3() }
  })
  let puffNext = 0
  // the new atoms from the puffs (a ring of slots: the oldest go first)
  const NNEW = light ? 90 : 200
  const newPos = new Float32Array(NNEW * 3).fill(-9999)
  const newCol = new Float32Array(NNEW * 3)
  const newBorn = new Float32Array(NNEW).fill(-999)
  const newGeo = new THREE.BufferGeometry()
  newGeo.setAttribute('position', new THREE.BufferAttribute(newPos, 3))
  newGeo.setAttribute('color', new THREE.BufferAttribute(newCol, 3))
  const newAtoms = new THREE.Points(newGeo, atomMat)
  newAtoms.frustumCulled = false
  root.add(newAtoms)
  let newNext = 0
  let clock = 0
  const freeSlot = () => {
    for (let i = 0; i < NMET; i++) if (!meteors.some(m => m.slot === i)) return i
    return -1
  }
  const launch = (a, b, delay = 0, dur = 0.8) => {
    const slot = freeSlot()
    if (slot < 0) return
    meteors.push({ a, b, delay, dur, t: 0, slot, puffed: false })
  }
  const puffAt = (p, seed) => {
    const P = puffs[puffNext]
    puffNext = (puffNext + 1) % NPUFF
    P.t = 0
    P.at.copy(p)
    P.s.position.copy(p)
    P.s.visible = true
    const r = random(seed)
    for (let i = 0; i < 6; i++) {
      newPos.set([p.x + gauss(r) * 2.5, p.y + gauss(r) * 1.2, p.z + gauss(r) * 2.5], newNext * 3)
      newBorn[newNext] = clock
      newNext = (newNext + 1) % NNEW
    }
    newGeo.attributes.position.needsUpdate = true
  }
  /** One shooting star ending at P (seeded, so every screen in a room draws the same one). */
  const meteorTo = (P, seed) => {
    const r = random(seed)
    const az = r() * TAU
    const dir = v3(Math.sin(az), -(0.35 + r() * 0.3), -Math.cos(az)).normalize()
    launch(P.clone().addScaledVector(dir, -(38 + r() * 18)), P.clone(), 0, 0.65 + r() * 0.3)
  }
  /** A shower: a dozen from one radiant, spread over five seconds (seeded the same way). */
  const showerOf = seed => {
    const r = random(seed)
    const rad = dirOf(RADIANT.az, RADIANT.el)
    const from = v3(SPAWN.x, 2, SPAWN.z)
    for (let i = 0; i < 12; i++) {
      const az = (r() - 0.5) * 2.6
      const el = 0.3 + r() * 0.75
      const P = hitLayer(from, dirOf(az, el), (r() - 0.5) * 6 * K)
      launch(P.clone().addScaledVector(rad, 34 + r() * 26), P, i * 0.42 + r() * 0.3, 0.55 + r() * 0.35)
    }
  }
  let skyN = 0
  let skyAt = null
  let skyShower = false
  let tails = false
  let tailsK = 0
  const skyPanel = lv => ({
    title: E.sky.title,
    color,
    blocks: [
      { buttons: [{ label: E.sky.shower, accent: true, onClick: () => shower() }, { label: tails ? E.sky.hideTails : E.sky.showTails, onClick: () => tapComet() }] },
      ...ps(lv)(E.sky.panel),
    ],
  })
  const round1 = p => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10, Math.round(p.z * 10) / 10]
  /** A tap in the sky in direction `d` from the camera: a shooting star comes down there. */
  function skyTap(d) {
    const P = hitLayer(ctx.camera.position.clone(), d.clone().normalize())
    skyN += 1
    skyAt = round1(P)
    skyShower = false
    meteorTo(v3(...skyAt), skyN * 7919 + 13)
    play('fizz', { order: 0.7 })
    share('sky')
    ex.discover('sky', skyPanel, 3.4)
    say(at(E.sky.says.meteor, level()))
  }
  function shower() {
    if (meteors.length > 3) return say(at(W.busy, level()))
    skyN += 1
    skyAt = null
    skyShower = true
    showerOf(skyN * 104729 + 7)
    play('select')
    share('sky')
    ex.discover('sky', skyPanel, 5.0)
    say(at(E.sky.says.shower, level()))
  }
  const cometPanelRefresh = () => refreshPanel(skyPanel)
  const setTails = (v, live) => {
    tails = !!v
    if (!live) tailsK = tails ? 1 : 0
    else play(tails ? 'select' : 'tap')
    cometPanelRefresh()
  }
  function tapComet() {
    setTails(!tails, true)
    share('comet')
    ex.discover('sky', skyPanel, 3.4)
    say(at(tails ? E.sky.says.comet : E.sky.says.hide, level()))
  }
  ex.add({
    id: 'sky',
    manual: true,
    x: LOOK.x,
    z: LOOK.z,
    radius: 2.4,
    label: E.sky.label,
    verb: () => (skyN === 0 ? E.sky.tapSky : !tails ? E.sky.tapComet : E.sky.tapSky),
    focus: { x: comet.position.x * 0.5, y: comet.position.y * 0.5, z: comet.position.z * 0.5, size: 60 },
    act: () => ctx.showPanel(skyPanel),
  })
  clickable(cometHit, () => tapComet(), { reach: 2000 })
  clickable(skyHit, hit => skyTap(hit.point.clone().sub(ctx.camera.position)), { reach: 2000, accept: h => h.point.y > 30 })

  const side = new THREE.Vector3()
  const seg = new THREE.Vector3()
  const toCam = new THREE.Vector3()
  const head = new THREE.Vector3()
  const tail = new THREE.Vector3()
  updates.push((dt, t) => {
    clock = t
    metA.fill(0)
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]
      m.t += dt
      const s = (m.t - m.delay) / m.dur
      const hd = heads[m.slot]
      if (s < 0) {
        hd.visible = false
        continue
      }
      if (s >= 1 && !m.puffed) {
        m.puffed = true
        puffAt(m.b, Math.round(m.b.x * 31 + m.b.z * 17))
      }
      if (s > 1.35) {
        hd.visible = false
        meteors.splice(i, 1)
        continue
      }
      const kh = Math.min(1, s)
      const kt = clamp(s - 0.4)
      head.copy(m.a).lerp(m.b, kh)
      tail.copy(m.a).lerp(m.b, Math.min(kt, kh))
      seg.subVectors(head, tail)
      toCam.subVectors(ctx.camera.position, head)
      side.crossVectors(seg, toCam).normalize()
      const fade = s > 1 ? 1 - (s - 1) / 0.35 : 1
      const wH = 0.45
      const wT = 0.05
      const j = m.slot * 4
      metPos.set([tail.x + side.x * wT, tail.y + side.y * wT, tail.z + side.z * wT], j * 3)
      metPos.set([tail.x - side.x * wT, tail.y - side.y * wT, tail.z - side.z * wT], (j + 1) * 3)
      metPos.set([head.x + side.x * wH, head.y + side.y * wH, head.z + side.z * wH], (j + 2) * 3)
      metPos.set([head.x - side.x * wH, head.y - side.y * wH, head.z - side.z * wH], (j + 3) * 3)
      metA[j] = metA[j + 1] = 0
      metA[j + 2] = metA[j + 3] = 0.9 * fade
      hd.visible = s < 1.05
      hd.position.copy(head)
      hd.scale.setScalar(s < 1 ? 3.2 : 3.2 + (s - 1) * 30)
      hd.material.opacity = s < 1 ? 1 : Math.max(0, 1 - (s - 1) / 0.08)
    }
    metGeo.attributes.position.needsUpdate = true
    metGeo.attributes.aA.needsUpdate = true
    // the puffs: a flash of sodium glow spreading and fading
    const U = layerMat.uniforms.uPuffs.value
    // the newest puffs light the layer (the shader takes the PUFFS most recent)
    const order = puffs.map((p, i) => i).sort((a, b) => puffs[a].t - puffs[b].t)
    for (const p of puffs) {
      p.t += dt
      const k = p.t < 0.15 ? p.t / 0.15 : Math.max(0, 1 - (p.t - 0.15) / 14)
      p.s.material.opacity = k * 0.9
      p.s.scale.setScalar(3 + 6 * ease(clamp(p.t / 5)))
      p.s.visible = k > 0.003
    }
    for (let n = 0; n < PUFFS; n++) {
      const p = puffs[order[n]]
      const k = p ? (p.t < 0.15 ? p.t / 0.15 : Math.max(0, 1 - (p.t - 0.15) / 14)) : 0
      if (p) U[n].set(p.at.x, p.at.y, p.at.z, k)
    }
    // the new atoms: glowing orange at first, then sodium's violet
    for (let i = 0; i < NNEW; i++) {
      const age = t - newBorn[i]
      const k = clamp(1 - age / 12)
      const w = 0.75 + 0.25 * Math.sin(t * 1.3 + i)
      newCol[i * 3] = lerp(violet.r * w, lit.r, k)
      newCol[i * 3 + 1] = lerp(violet.g * w, lit.g, k)
      newCol[i * 3 + 2] = lerp(violet.b * w, lit.b, k)
    }
    newGeo.attributes.color.needsUpdate = true
    // the comet: its names, and the sodium tail glowing while they show
    tailsK = damp(tailsK, tails ? 1 : 0, 3, dt)
    for (const tx of tailTexts) {
      tx.visible = tailsK > 0.01
      tx.fillOpacity = tailsK
      tx.outlineOpacity = tailsK
    }
    TAILS.sodium.mat.color.copy(hdr('#ffffff', TAILS.sodium.k * (1 + tailsK * (0.5 + 0.4 * Math.sin(t * 3)))))
    TAILS.ion.mat.color.copy(hdr('#ffffff', TAILS.ion.k * (1 - 0.3 * tailsK)))
    TAILS.dust.mat.color.copy(hdr('#ffffff', TAILS.dust.k * (1 - 0.3 * tailsK)))
  })

  updates.push((dt, t) => stage.update(t))

  const toWorld = o3 => o3.getWorldPosition(new THREE.Vector3())
  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    cameraPitchMax: 0.45,
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0.18 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      laser: {
        tap: () => tapLaser(),
        at: () => toWorld(lens),
        star: () => STAR.clone(),
        get on() {
          return laserOn
        },
        get star() {
          return starK
        },
      },
      ao: {
        tap: () => tapMirror(),
        turb: v => setTurb(v, true),
        at: () => toWorld(face),
        screenAt: () => toWorld(scr.group),
        get on() {
          return aoOn
        },
        get sharp() {
          return aoK
        },
      },
      sky: {
        // a tap in the sky at azimuth az (radians east of north) and elevation el, as seen from the camera
        tap: (az = 0, el = 0.6) => skyTap(dirOf(az, el)),
        shower: () => shower(),
        at: (az = 0, el = 0.6) => ctx.camera.position.clone().addScaledVector(dirOf(az, el), 300),
        get n() {
          return skyN
        },
        get flying() {
          return meteors.length
        },
      },
      comet: {
        tap: () => tapComet(),
        at: () => comet.position.clone(),
        get tails() {
          return tails
        },
      },
    },
    panels: { laser: laserPanel, ao: aoPanel, sky: skyPanel },
    shared: {
      laser: { get: () => ({ on: laserOn }), set: (s, live) => setLaser(!!s?.on, live) },
      ao: {
        get: () => ({ on: aoOn, turb }),
        set: (s, live) => {
          const tv = Number(s?.turb)
          if (Number.isFinite(tv)) turb = clamp(Math.round(tv * 100) / 100)
          if (!!s?.on !== aoOn) setAO(!!s?.on, live)
          else refreshPanel(aoPanel)
        },
      },
      sky: {
        get: () => ({ n: skyN, at: skyAt, shower: skyShower }),
        set: (s, live) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const atP = Array.isArray(s?.at) && s.at.length === 3 && s.at.every(Number.isFinite) ? s.at.map(Number) : null
          const sh = !!s?.shower
          // someone else's shooting star (or shower) just now: it comes down here too
          if (live && n > skyN) {
            if (sh) showerOf(n * 104729 + 7)
            else if (atP) meteorTo(v3(...atP), n * 7919 + 13)
          }
          skyN = n
          skyAt = atP
          skyShower = sh
        },
      },
      comet: { get: () => ({ tails }), set: (s, live) => setTails(!!s?.tails, live) },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      clearTimeout(turbSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
