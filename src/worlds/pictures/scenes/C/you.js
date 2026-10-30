// Carbon's picture "What are you made of?" as a room (docs/knowledge/picture-rooms.md): you step into the
// picture's child and stand inside a body, shrunk smaller than a cell (stages/body.js in the picture's deep
// violet, no ions), with the picture's three things made into places. Each step is chosen by tapping its
// thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap,
// E opens the station's panel, whose buttons (and a slider where something varies smoothly) do the same:
// - the recipe of you: the picture's glowing child, standing on a bathroom scale, and in front of it seven
//   jars of the body's elements by mass (oxygen 65%, carbon 18%, hydrogen 10%, nitrogen 3%, calcium 1.5%,
//   phosphorus 1%, the rest 1.5%), each jar's volume in proportion to its share. A weight slider (20 to
//   80 kg) fills them for a body of that weight and the kilograms change; tap a jar and its atoms fly into
//   the child, where its element lights up: the water (oxygen, hydrogen), the muscles, brain and hair
//   (carbon, nitrogen), the bones (calcium, phosphorus), the blood and hair (iron, sulfur). Unlike the life
//   wing's banded figure ("you are 18% carbon"), this one shows where, not how much;
// - the DNA zipper: eight base pairs of a double helix at 1 Å = 0.1 m, backbones of deoxyribose rings
//   (four carbons and an oxygen, C5' outside) and phosphates, the bases as flat rings (purines A, G two,
//   pyrimidines T, C one) joined by hydrogen bonds (two for A-T, three for G-C). Tap the zipper (helicase):
//   the helix untwists, the fork climbs, nucleotides floating behind dock onto each half (A with T, G with C),
//   the two daughters twist up; tap again and the copy leaves for a new cell. Tap a grey carbon in a sugar
//   ring: its four bonds glow, numbered, its hydrogens appear and the Atomling names them;
// - your food becomes you: a slice of bread on a plate, a cell (membrane, nucleus, two mitochondria, a
//   ribosome) and your breath. Tap the bread: a starch chain and a protein chain come out and break into
//   four glucose rings and six amino acids. Tap a glucose: it goes into a mitochondrion, sparks, and leaves
//   as six CO2 that rise into your breath; tap the amino acids: the ribosome strings them into a growing
//   protein. Tap the breath to breathe out; a slider says how hard you move (rest about 0.1 g of carbon a
//   minute for a grown-up, running about ten times as much).
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, at, clamp, lerp, damp, random, num, fill } from '../../../wings/noble/kit.js'
import { bodyStage, softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { YOU_WORDS } from './you.words.js'

export const WORDS = YOU_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const UP = V3(0, 1, 0)
const RECIPE_C = '#ff9fb2'
const DNA_C = '#7fd8ff'
const FOOD_C = '#ffc56b'
const GOLD = '#ffd166'
// the game's atom colours (src/chem/ballAndStick.js; the rest as elements.json gives them)
const ATOM = { H: '#f4f6fb', C: '#42464e', N: '#3a5cf5', O: '#f2302b', P: '#ff8000', Ca: '#3ddc2a', S: '#ffd84d', K: '#8f40d4', Na: '#ab5cf2', Cl: '#1ff01f', Mg: '#8aff00', Fe: '#e06633' }

// ---- where things are (metres; the spawn at z = 6.4 looks along -z, into the picture) ----
const FIG = { x: 0, z: -6.6 } // the child on its scale
const RECIPE_AT = { x: 0, z: -2.0 } // where the visitor stands for the recipe
const DNA_AT = { x: -6.2, z: -2.0 } // the helix's axis (seen past the easel from the spawn)
const FOOD = { cell: V3(7.3, 1.55, -0.2), cellR: 1.35, bread: V3(4.95, 0, -2.25), cloud: V3(6.5, 3.55, 1.75) }

// ---- immediate drawing: many balls or sticks in one draw call, put again each frame ----

const tmpM = new THREE.Matrix4()
const tmpQ = new THREE.Quaternion()
const tmpV = V3(0, 0, 0)
const tmpS = V3(1, 1, 1)
const tmpC = new THREE.Color()

/** An instanced mesh drawn like a list: begin(), put(...) what shows this frame, end(). */
function batch(geo, mat, max) {
  const mesh = new THREE.InstancedMesh(geo, mat, max)
  mesh.frustumCulled = false
  mesh.setColorAt(0, new THREE.Color('#ffffff'))
  mesh.count = 0
  let n = 0
  const tag = []
  return {
    mesh,
    tag,
    begin() {
      n = 0
    },
    /** A matrix (and a colour); `t` is kept for raycast hits (instanceId -> t). */
    put(m, color, t = null) {
      if (n >= max) return -1
      mesh.setMatrixAt(n, m)
      if (color) mesh.setColorAt(n, color)
      tag[n] = t
      return n++
    },
    ball(p, r, color, t = null) {
      tmpM.makeScale(r, r, r).setPosition(p)
      return this.put(tmpM, color, t)
    },
    stick(a, b, r, color) {
      tmpV.subVectors(b, a)
      const len = tmpV.length()
      if (len < 1e-5) return -1
      tmpQ.setFromUnitVectors(UP, tmpV.multiplyScalar(1 / len))
      tmpV.addVectors(a, b).multiplyScalar(0.5)
      tmpS.set(r, len, r)
      tmpM.compose(tmpV, tmpQ, tmpS)
      return this.put(tmpM, color)
    },
    end() {
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      // (a raycast tests the bounding sphere first, kept from its first use: made again when needed)
      mesh.boundingSphere = null
    },
    dispose() {
      mesh.dispose()
    },
  }
}

/** Taps on an instanced mesh of balls, tested as spheres (fast: no triangles; hit.instanceId as usual). */
function sphereCast(mesh) {
  const m = new THREE.Matrix4()
  const sphere = new THREE.Sphere()
  const at = V3(0, 0, 0)
  mesh.raycast = (raycaster, hits) => {
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, m)
      m.premultiply(mesh.matrixWorld)
      sphere.center.setFromMatrixPosition(m)
      sphere.radius = Math.cbrt(Math.abs(m.determinant()))
      if (!raycaster.ray.intersectSphere(sphere, at)) continue
      const distance = raycaster.ray.origin.distanceTo(at)
      if (distance >= raycaster.near && distance <= raycaster.far) hits.push({ distance, point: at.clone(), object: mesh, instanceId: i })
    }
  }
}

/** A word on a dark rounded card (facing +z), in a station's colour. */
function cardText(text, color, { size = 0.13, maxWidth = 2.2, font = 'display' } = {}) {
  const g = new THREE.Group()
  const t = makeText(text, { size, color, maxWidth, font, outlineWidth: size * 0.06, outlineColor: '#160d2a' })
  g.add(t)
  return { group: g, text: t }
}

// ---- the child: the picture's figure in metres (feet at y = 0, 1 tall; scaled to the weight) ----

// the picture's shapes (tools/boards/C/you.py), from pixels to a figure 1 tall
const LIMBS = [
  // [ax, ay, bx, by, r]: upper arm, forearm, thigh, shin (left; the right is mirrored)
  [-0.1, 0.682, -0.234, 0.586, 0.036],
  [-0.234, 0.586, -0.318, 0.716, 0.033],
  [-0.0575, 0.452, -0.103, 0.245, 0.048],
  [-0.103, 0.245, -0.123, 0.065, 0.04],
]

function capsule(a, b, r, seg = 14) {
  const d = b.clone().sub(a)
  const geo = new THREE.CapsuleGeometry(r, Math.max(0.001, d.length()), 6, seg)
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()))
  geo.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  return geo
}
function ellipsoid(c, rx, ry, rz, seg = 20) {
  const geo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  geo.scale(rx, ry, rz)
  geo.translate(c.x, c.y, c.z)
  return geo
}

/** The figure's outside (k = 1) or an inner copy (k < 1: the same shapes, thinner). */
function bodyShapes(k, seg) {
  const out = [
    ellipsoid(V3(0, 0.874, 0), 0.126 * k, 0.126 * k, 0.12 * k, seg + 8),
    capsule(V3(0, 0.77, 0), V3(0, 0.69, 0), 0.04 * k, seg),
  ]
  const torso = capsule(V3(0, 0.525, 0), V3(0, 0.607, 0), 0.115 * k, seg + 6)
  torso.scale(1, 1, 0.68)
  out.push(torso)
  for (const s of [-1, 1]) {
    for (const [ax, ay, bx, by, r] of LIMBS) out.push(capsule(V3(ax * s, ay, 0), V3(bx * s, by, 0), r * k, seg))
    out.push(ellipsoid(V3(-0.326 * s, 0.738, 0), 0.044 * k, 0.044 * k, 0.044 * k, seg))
    out.push(ellipsoid(V3(-0.13 * s, 0.032, 0.03), 0.05 * k, 0.032 * k, 0.085 * k, seg))
  }
  return out
}

function childFigure({ light }) {
  const seg = light ? 10 : 16
  const group = new THREE.Group()
  // the glass skin: a depth pass first (only its nearest surface shows), then a glowing rim, so the
  // overlapping limbs do not show their insides; the parts inside are drawn before both
  const skinGeo = mergeGeometries(bodyShapes(1, seg))
  const depthPass = new THREE.Mesh(skinGeo, new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true, depthWrite: true }))
  depthPass.renderOrder = 2
  const skinU = { uRim: { value: new THREE.Color('#ffe0ea') }, uFill: { value: new THREE.Color(RECIPE_C) }, uFillA: { value: 0.4 }, uGlow: { value: 1 } }
  const skinMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthFunc: THREE.LessEqualDepth,
    uniforms: skinU,
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim; uniform vec3 uFill; uniform float uFillA; uniform float uGlow;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
        vec3 c = mix(uFill, uRim * (1.0 + 0.9 * uGlow), f);
        gl_FragColor = vec4(c, uFillA + (0.9 - uFillA) * f);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const skin = new THREE.Mesh(skinGeo, skinMat)
  skin.renderOrder = 3
  group.add(depthPass, skin)

  // the face, as in the picture: eyes, a smile, pink cheeks (just outside the skin, so they show)
  const faceMat = new THREE.MeshBasicMaterial({ color: '#1b2250' })
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), faceMat)
    eye.scale.set(0.013, 0.019, 0.006)
    eye.position.set(0.04 * s, 0.884, 0.122)
    const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.018, 16), new THREE.MeshBasicMaterial({ color: '#ff7a9a', transparent: true, opacity: 0.6 }))
    cheek.scale.set(1, 0.6, 1)
    cheek.position.set(0.07 * s, 0.858, 0.112)
    cheek.rotation.y = 0.55 * s
    group.add(eye, cheek)
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.006, 6, 18, Math.PI), faceMat)
  smile.rotation.z = Math.PI
  smile.position.set(0, 0.86, 0.12)
  smile.rotation.x = -0.25
  group.add(smile)

  // what lights up inside: water, muscles, brain, hair, bones, blood
  const parts = {}
  const partMat = () => new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.5, roughness: 0.5, transparent: true, opacity: 0, depthWrite: true })
  const addPart = (name, geos) => {
    const mesh = new THREE.Mesh(mergeGeometries(geos), partMat())
    mesh.renderOrder = 1
    mesh.visible = false
    group.add(mesh)
    parts[name] = { mesh, k: 0, target: 0 }
  }
  addPart('water', bodyShapes(0.84, seg))
  const muscles = []
  for (const s of [-1, 1]) for (const [ax, ay, bx, by, r] of LIMBS) muscles.push(capsule(V3(ax * s, ay, 0.004), V3(bx * s, by, 0.004), r * 0.72, seg))
  {
    // chest and belly muscles, a little forward in the torso
    for (const s of [-1, 1]) muscles.push(ellipsoid(V3(0.05 * s, 0.645, 0.035), 0.05, 0.04, 0.03, seg))
    for (const y of [0.56, 0.5, 0.445]) for (const s of [-1, 1]) muscles.push(ellipsoid(V3(0.025 * s, y, 0.04), 0.022, 0.026, 0.02, seg))
  }
  addPart('muscles', muscles)
  addPart('brain', [ellipsoid(V3(0, 0.9, -0.01), 0.088, 0.066, 0.082, seg + 4)])
  {
    // the picture's tuft of hair, and a few more strands
    const tufts = []
    const strand = (pts, r) => tufts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), 16, r, 6, false))
    strand([[-0.015, 0.99, 0], [-0.008, 1.03, 0], [0.03, 1.04, 0], [0.047, 1.01, 0]], 0.011)
    strand([[-0.06, 0.975, 0.02], [-0.07, 1.01, 0.02], [-0.045, 1.025, 0.02]], 0.007)
    strand([[0.06, 0.975, -0.02], [0.075, 1.005, -0.02], [0.06, 1.02, -0.03]], 0.007)
    addPart('hair', tufts)
  }
  {
    const bones = [ellipsoid(V3(0, 0.89, -0.01), 0.088, 0.09, 0.085, seg + 4), capsule(V3(0, 0.44, -0.03), V3(0, 0.79, -0.03), 0.014, 8), capsule(V3(-0.1, 0.716, -0.01), V3(0.1, 0.716, -0.01), 0.01, 8)]
    for (const [y, rr] of [[0.69, 0.07], [0.655, 0.085], [0.62, 0.09], [0.585, 0.085]]) {
      const rib = new THREE.TorusGeometry(rr, 0.008, 6, 24, TAU * 0.86)
      rib.rotateX(Math.PI / 2)
      rib.rotateY(Math.PI / 2 + TAU * 0.07)
      rib.scale(1, 1, 0.62)
      rib.translate(0, y, -0.005)
      bones.push(rib)
    }
    const pelvis = new THREE.TorusGeometry(0.06, 0.016, 6, 22)
    pelvis.rotateX(Math.PI / 2 - 0.3)
    pelvis.scale(1, 1, 0.65)
    pelvis.translate(0, 0.43, 0)
    bones.push(pelvis)
    for (const s of [-1, 1]) {
      LIMBS.forEach(([ax, ay, bx, by], i) => bones.push(capsule(V3(ax * s, ay, 0), V3(bx * s, by, 0), i < 2 ? 0.011 : 0.016, 8)))
      bones.push(ellipsoid(V3(-0.326 * s, 0.738, 0), 0.022, 0.026, 0.02, 10))
      bones.push(capsule(V3(-0.125 * s, 0.05, -0.01), V3(-0.135 * s, 0.025, 0.08), 0.012, 8))
    }
    addPart('bones', bones)
  }
  {
    // the heart and the vessels: up to the head, out along both arms and down both legs
    const blood = [ellipsoid(V3(0.025, 0.63, 0.03), 0.034, 0.038, 0.03, seg)]
    const tube = pts => blood.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), 24, 0.0075, 6, false))
    tube([[0.02, 0.64, 0.02], [0.01, 0.72, 0.01], [0.0, 0.8, 0.02], [0.03, 0.88, 0.05], [0.0, 0.94, 0.05]])
    for (const s of [-1, 1]) {
      tube([[0.02, 0.64, 0.02], [0.1 * s, 0.68, 0.01], [0.234 * s, 0.59, 0.012], [0.318 * s, 0.716, 0.012], [0.33 * s, 0.75, 0.02]])
      tube([[0.02, 0.6, 0.02], [0.0, 0.5, 0.03], [0.06 * s, 0.45, 0.02], [0.103 * s, 0.245, 0.02], [0.123 * s, 0.07, 0.02], [0.13 * s, 0.035, 0.08]])
    }
    addPart('blood', blood)
  }
  return { group, parts, skinU }
}

/** A glass jar for an element (base at y = 0), its lid in the element's colour. */
function jarMesh(R, H, color, M) {
  const g = new THREE.Group()
  const side = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 36, 1, true).translate(0, H / 2, 0), M.glass)
  side.renderOrder = 4
  const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.04, R * 1.06, 0.03, 36).translate(0, 0.015, 0), M.jarBase)
  const lid = new THREE.Mesh(new RoundedBoxGeometry(R * 2.15, 0.06, R * 2.15, 2, 0.025), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.4 }))
  lid.position.y = H + 0.03
  const knob = new THREE.Mesh(new THREE.SphereGeometry(Math.min(0.05, R * 0.35), 16, 10), lid.material)
  knob.position.y = H + 0.07
  g.add(side, base, lid, knob)
  return g
}

// ---- the DNA: a nucleotide's atoms on the right-hand strand (+1), its rung at y = 0, x from the axis ----
// (1 Å = 0.1 m: C1' to C1' across a pair 1.1 m, 0.36 m between pairs; the left strand is the same turned
// half round the axis that points at the visitor, so the strands run opposite ways)
const NUC_C = 0.75 // a nucleotide's own centre, along its rung
const RISE = 0.36
const BP = 8
const Y0 = 0.62
const TWIST = 0.628 // 36 degrees a pair
const D_SEP = 1.3 // how far each half moves out when unzipped
const NA = [
  ['C', 0.55, 0, 0], // 0 C1'
  ['C', 0.638, -0.122, 0], // 1 C2'
  ['C', 0.782, -0.075, 0], // 2 C3'
  ['C', 0.782, 0.075, 0], // 3 C4'
  ['O', 0.638, 0.122, 0], // 4 O4', the ring's oxygen
  ['C', 0.93, 0.13, 0], // 5 C5'
  ['O', 1.06, 0.2, 0], // 6 O5'
  ['P', 1.1, 0.335, 0], // 7 the phosphate
  ['O', 1.19, 0.37, 0.1], // 8
  ['O', 1.19, 0.37, -0.1], // 9
  ['O', 0.92, -0.1, 0], // 10 O3', joined to the phosphate of the next nucleotide along the strand
  ['N', 0.41, 0, 0], // 11 the base's nitrogen that holds the sugar
].map(([el, x, y, z]) => ({ el, p: V3(x - NUC_C, y, z) }))
const NB = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [3, 5], [5, 6], [6, 7], [7, 8], [7, 9], [2, 10], [0, 11]]
const RADIUS = { C: 0.058, O: 0.052, P: 0.068, N: 0.052, H: 0.036 }
// the sugar's carbons: C1', C2', C3', C4', C5' (atom indexes) and the directions of their hydrogens
const SUGAR_C = [0, 1, 2, 3, 5]
const HDIR = (() => {
  const z = V3(0, 0, 1)
  const ringC = V3(0.678 - NUC_C, 0, 0)
  const out = i => NA[i].p.clone().sub(ringC).setZ(0).normalize()
  const one = u => [u.clone().multiplyScalar(0.35).addScaledVector(z, 0.94).normalize()]
  const two = u => [1, -1].map(s => u.clone().multiplyScalar(0.5).addScaledVector(z, 0.87 * s).normalize())
  const c5 = (() => {
    const a = NA[3].p.clone().sub(NA[5].p).normalize()
    const b = NA[6].p.clone().sub(NA[5].p).normalize()
    return a.add(b).multiplyScalar(-1).normalize()
  })()
  return { 0: one(out(0)), 1: two(out(1)), 2: one(out(2)), 3: one(out(3)), 5: two(c5) }
})()
const C_H = 0.11
const BASE_C = { A: '#6fd35e', T: '#ff9a3c', G: '#ffd84d', C: '#4d7dff' }
const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' }
const SEQ = ['G', 'A', 'T', 'T', 'A', 'C', 'A', 'G'] // the left strand, bottom to top

/** A base as a flat ring (or two fused rings), lying in the rung's plane, from its nitrogen at x = 0.41
 *  toward the middle; in the nucleotide's own frame. */
function baseGeometry(purine) {
  const r = 0.12
  const poly = pts => pts.map(([x, y]) => new THREE.Vector2(x, y))
  const ngon = (cx, n, rr, a0) => Array.from({ length: n }, (_, i) => [cx + rr * Math.cos(a0 + (i * TAU) / n), rr * Math.sin(a0 + (i * TAU) / n)])
  let outer
  let holes
  if (!purine) {
    const c = 0.41 - r
    outer = ngon(c, 6, r, 0)
    holes = [ngon(c, 6, r * 0.58, 0)]
  } else {
    const R5 = r * 0.851
    const pc = 0.41 - R5
    const hc = pc - 1.554 * r
    const pent = ngon(pc, 5, R5, 0)
    const hex = ngon(hc, 6, r, Math.PI / 6)
    // round the outline: the pentagon's free corners, then the hexagon's
    outer = [pent[0], pent[1], hex[0], hex[1], hex[2], hex[3], hex[4], hex[5], pent[4]]
    holes = [ngon(pc, 5, R5 * 0.5, 0), ngon(hc, 6, r * 0.58, Math.PI / 6)]
  }
  const shape = new THREE.Shape(poly(outer))
  for (const h of holes) shape.holes.push(new THREE.Path(poly(h).reverse()))
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 4 })
  geo.rotateX(Math.PI / 2)
  geo.translate(-NUC_C, 0.0225, 0)
  return geo
}

// ---- food: a glucose ring (C1..C5 and its oxygen, C6 outside) in its own plane, facing +z ----
const GLU = (() => {
  const R = 0.11
  const ring = [30, -30, -90, -150, 150, 90].map(a => V3(Math.cos((a * Math.PI) / 180) * R, Math.sin((a * Math.PI) / 180) * R, 0))
  const outward = (p, d) => p.clone().normalize().multiplyScalar(R + d)
  const atoms = [
    { el: 'C', p: ring[0] }, // 0 C1
    { el: 'C', p: ring[1] }, // 1 C2
    { el: 'C', p: ring[2] }, // 2 C3
    { el: 'C', p: ring[3] }, // 3 C4
    { el: 'C', p: ring[4] }, // 4 C5
    { el: 'O', p: ring[5] }, // 5 the ring's oxygen
    { el: 'O', p: outward(ring[0], 0.14) }, // 6 O1
    { el: 'O', p: outward(ring[1], 0.14).add(V3(0, 0, 0.05)) }, // 7 O2
    { el: 'O', p: outward(ring[2], 0.14) }, // 8 O3
    { el: 'O', p: outward(ring[3], 0.14).add(V3(0, 0, -0.05)) }, // 9 O4
    { el: 'C', p: outward(ring[4], 0.15) }, // 10 C6
    { el: 'O', p: outward(ring[4], 0.15).add(V3(0.02, 0.14, 0)) }, // 11 O6
  ]
  const bonds = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [10, 11]]
  return { atoms, bonds }
})()
// an amino acid: N, the alpha carbon, the carboxyl carbon and its oxygen, a side chain (one ball)
const AMINO = {
  atoms: [
    { el: 'N', p: V3(-0.13, -0.03, 0) },
    { el: 'C', p: V3(0, 0.03, 0) },
    { el: 'C', p: V3(0.13, -0.03, 0) },
    { el: 'O', p: V3(0.16, -0.16, 0.02) },
    { el: 'R', p: V3(0.0, 0.17, 0.02) },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [1, 4]],
}
// the side chains of the bread's six (gluten is rich in glutamine and proline): colours of their atoms
const SIDE = [ATOM.C, ATOM.O, ATOM.C, ATOM.S, ATOM.N, ATOM.C]

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable, lang }) {
  const stage = bodyStage({ radius: 11, light, ions: false, top: '#1b1442', mid: '#3a2156', low: '#120b24', fog: '#2b1a48', floor: '#7a5690', seam: '#523669', cells: '#8a62a6' })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const textures = []
  let clock = 0
  const paras = list => list.map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` s the first time, if the visitor is still there. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && !ctx.store.get().panel && ctx.showPanel(panel))
  }
  const numOf = (v, d) => num(v, d, lang)
  const kgText = v => fill(E.recipe.kg, { v: v >= 10 ? numOf(v, 1) : v >= 1 ? numOf(v, 1) : numOf(v, 2) })
  const seg = light ? 10 : 16

  const M = {
    glass: new THREE.MeshStandardMaterial({ color: '#f2eaff', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),
    jarBase: new THREE.MeshStandardMaterial({ color: '#d9cdea', roughness: 0.3, metalness: 0.2 }),
    ball: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.32, metalness: 0.05 }),
    stick: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45 }),
    plinth: new THREE.MeshStandardMaterial({ color: '#4e3470', roughness: 0.55, metalness: 0.1 }),
    hit: new THREE.MeshBasicMaterial({ visible: false }),
  }
  const ballGeo = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  const stickGeo = new THREE.CylinderGeometry(1, 1, 1, light ? 6 : 8)
  const BOND = new THREE.Color('#e4e8f4')
  const GOLD_C = new THREE.Color(GOLD).multiplyScalar(1.6)
  const COL = Object.fromEntries(Object.entries(ATOM).map(([k, v]) => [k, new THREE.Color(v)]))

  // ======== 1. the recipe of you ========
  const ELS = [
    { k: 'O', pc: 65, color: ATOM.O },
    { k: 'C', pc: 18, color: ATOM.C },
    { k: 'H', pc: 10, color: ATOM.H },
    { k: 'N', pc: 3, color: ATOM.N },
    { k: 'Ca', pc: 1.5, color: ATOM.Ca },
    { k: 'P', pc: 1, color: ATOM.P },
    { k: 'rest', pc: 1.5, color: '#b58cff' },
  ]
  const ELK = ELS.map(e => e.k)
  // what lights up in the child for each jar, and in which colour (the rest: iron's blood, sulfur's hair)
  const SHOW = {
    O: { water: ATOM.O },
    C: { muscles: '#8d96aa', brain: '#8d96aa', hair: '#8d96aa' },
    H: { water: ATOM.H, muscles: ATOM.H, brain: ATOM.H, hair: ATOM.H },
    N: { muscles: ATOM.N, hair: ATOM.N },
    Ca: { bones: ATOM.Ca },
    P: { bones: ATOM.P },
    rest: { blood: ATOM.Fe, hair: ATOM.S },
  }
  const W_MIN = 20
  const W_MAX = 80
  const R = { w: 32, shown: 32, el: null, n: 0, at: -99, mine: false }

  // the scale, and the child on it
  // a round podium, so the child stands above the jars, and the bathroom scale on it
  const PODIUM = 0.42
  {
    const podium = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.18, PODIUM, 48), M.plinth)
    podium.position.set(FIG.x, PODIUM / 2, FIG.z)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.022, 6, 64), new THREE.MeshStandardMaterial({ color: RECIPE_C, emissive: RECIPE_C, emissiveIntensity: 1.1, roughness: 0.4 }))
    rim.rotation.x = Math.PI / 2
    rim.position.set(FIG.x, PODIUM, FIG.z)
    root.add(podium, rim)
  }
  const scaleG = new THREE.Group()
  scaleG.position.set(FIG.x, PODIUM, FIG.z)
  root.add(scaleG)
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.16, 1.15, 3, 0.06), new THREE.MeshStandardMaterial({ color: '#e9e2f2', roughness: 0.35, metalness: 0.15 }))
    body.position.y = 0.08
    const pad = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.02, 0.95, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#b7aac8', roughness: 0.8 }))
    pad.position.y = 0.165
    // the display, tilted up at the front edge
    const disp = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.24, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#141a2e', roughness: 0.4, emissive: '#0c1830', emissiveIntensity: 0.6 }))
    disp.position.set(0, 0.2, 0.62)
    disp.rotation.x = -0.5
    scaleG.add(body, pad, disp)
    solids.push(circle(FIG.x, FIG.z, 1.15))
  }
  const scaleText = makeText('32 kg', { size: 0.14, color: '#8dffb4', anchorX: 'center', anchorY: 'middle' })
  scaleText.position.set(0, 0.215, 0.65)
  scaleText.rotation.x = -0.5
  scaleG.add(scaleText)
  const child = childFigure({ light })
  child.group.position.set(FIG.x, PODIUM + 0.17, FIG.z)
  root.add(child.group)
  const figH = w => 3.3 * Math.cbrt(w / W_MAX)

  // the jars in an arc in front of the child, biggest on the left; each jar's volume in proportion to its share
  const ARC_R = 3.0
  const jars = []
  {
    const dims = ELS.map(e => {
      const s = Math.cbrt(e.pc / 65)
      return { R: 0.36 * s, H: 1.22 * s, rb: 0.05 * Math.sqrt(s) }
    })
    const GAP = 0.5
    const total = dims.reduce((t, d) => t + 2 * d.R, 0) + GAP * (dims.length - 1)
    let s = -total / 2
    ELS.forEach((e, i) => {
      const d = dims[i]
      s += d.R
      const ang = s / ARC_R
      s += d.R + GAP
      const x = FIG.x + Math.sin(ang) * ARC_R
      const z = FIG.z + Math.cos(ang) * ARC_R
      const g = new THREE.Group()
      g.position.set(x, 0, z)
      root.add(g)
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(d.R + 0.08, d.R + 0.12, 0.14, 36), M.plinth)
      plinth.position.y = 0.07
      const ringMat = new THREE.MeshStandardMaterial({ color: e.color, emissive: e.color, emissiveIntensity: 0.8, roughness: 0.4, transparent: true, opacity: 0.0 })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(d.R + 0.1, 0.018, 8, 48), ringMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.15
      const jar = jarMesh(d.R, d.H, e.color, M)
      jar.position.y = 0.14
      g.add(plinth, ring, jar)
      // a hit shape the size of the jar (its glass is thin)
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(d.R + 0.05, d.R + 0.05, d.H + 0.3, 12), M.hit)
      hit.position.y = 0.14 + (d.H + 0.3) / 2
      g.add(hit)
      solids.push(circle(x, z, d.R + 0.14))
      // its words over it, turned to where the visitor stands
      const label = new THREE.Group()
      label.position.set(0, 0.14 + d.H + 0.2 + (i >= 3 && i % 2 === 0 ? 0.26 : 0), 0)
      label.rotation.y = Math.atan2(RECIPE_AT.x - x, RECIPE_AT.z - z)
      const name = makeText(E.recipe.signs[e.k], { size: i < 3 ? 0.12 : 0.095, color: e.k === 'C' ? '#c9cfdd' : e.color, anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#160d2a', font: 'display' })
      name.position.y = 0.13
      const kg = makeText('', { size: i < 3 ? 0.11 : 0.085, color: '#ffffff', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.007, outlineColor: '#160d2a', font: 'medium' })
      label.add(name, kg)
      g.add(label)
      // the atoms inside: balls packed in layers, bottom up, a few jiggled
      const rnd = random(100 + i)
      const pts = []
      const inner = d.R - 0.012 - d.rb
      const dy = d.rb * 1.72
      const sp = d.rb * 2.04
      for (let y = 0.03 + d.rb, layer = 0; y < d.H - d.rb; y += dy, layer++) {
        const off = layer % 2 ? sp / 2 : 0
        const layerPts = []
        for (let gx = -inner - sp; gx <= inner + sp; gx += sp) {
          for (let gz = -inner - sp, row = 0; gz <= inner + sp; gz += sp * 0.866, row++) {
            const px = gx + (row % 2 ? sp / 2 : 0) + off
            const pz = gz + off * 0.5
            if (Math.hypot(px, pz) <= Math.max(inner, 0.001) + 1e-6) layerPts.push(V3(px + (rnd() - 0.5) * 0.006, 0.14 + y, pz + (rnd() - 0.5) * 0.006))
          }
        }
        if (!layerPts.length) layerPts.push(V3(0, 0.14 + y, 0))
        // the top layer fills in no order
        layerPts.sort(() => rnd() - 0.5)
        pts.push(...layerPts)
      }
      const mixC = e.k === 'rest' ? [['K', 0.36], ['S', 0.26], ['Na', 0.15], ['Cl', 0.15], ['Mg', 0.04], ['Fe', 0.04]] : null
      const colors = pts.map(() => {
        if (!mixC) return COL[e.k]
        let v = rnd()
        for (const [k, w] of mixC) if ((v -= w) <= 0) return COL[k]
        return COL.K
      })
      jars.push({ e, i, g, d, x, z, pts, colors, ringMat, kg, hit, shown: -1, top: 0.14 + d.H })
    })
  }
  const jarBalls = batch(ballGeo, M.ball, jars.reduce((t, j) => t + j.pts.length, 0))
  root.add(jarBalls.mesh)
  let jarFill = -1
  const drawJars = f => {
    jarBalls.begin()
    for (const j of jars) {
      const n = Math.round(f * j.pts.length)
      for (let i = 0; i < n; i++) jarBalls.ball(tmpV.copy(j.pts[i]).add(j.g.position), j.d.rb, j.colors[i])
    }
    jarBalls.end()
  }
  // the atoms that fly from a jar into the child
  const STREAM = 28
  const streamBalls = batch(ballGeo, M.ball, STREAM)
  root.add(streamBalls.mesh)
  const streamSeeds = Array.from({ length: STREAM }, (_, i) => {
    const r = random(900 + i)
    return { d: r() * 0.9, x: (r() - 0.5) * 0.5, y: r() * 0.8, z: (r() - 0.5) * 0.25, c: r() }
  })

  const recipeWords = () => {
    for (const j of jars) {
      const v = (R.shown * j.e.pc) / 100
      const t = kgText(v)
      if (j.kg.text !== t) {
        j.kg.text = t
        j.kg.sync()
      }
    }
    const st = `${Math.round(R.shown)} kg`
    if (scaleText.text !== st) {
      scaleText.text = st
      scaleText.sync()
    }
  }
  const recipePanel = lv => ({
    title: E.recipe.title,
    color: RECIPE_C,
    blocks: [
      {
        slider: {
          label: E.recipe.weight,
          min: W_MIN,
          max: W_MAX,
          step: 1,
          value: R.w,
          onInput: v => setWeight(v, false),
          format: v => `${Math.round(v)} kg`,
          live: () => R.w,
        },
      },
      ...paras(E.recipe.panel[depth(lv)]),
      { h: fill(E.recipe.found, { v: Math.round(R.w) }) },
      { rows: ELS.map(e => [E.recipe.signs[e.k], `${kgText((R.w * e.pc) / 100)} (${numOf(e.pc, e.pc % 1 ? 1 : 0)}%)`]) },
      ...(R.el ? [{ h: fill(E.recipe.where, { el: E.recipe.signs[R.el] }) }, { p: at(E.recipe.says[R.el], lv) }] : []),
      { buttons: ELS.map(e => ({ label: E.recipe.signs[e.k], accent: R.el === e.k, onClick: () => recipeStep(e.k) })) },
    ],
  })
  let weightSend = null
  function setWeight(v, now) {
    R.w = clamp(Math.round(Number(v) || 32), W_MIN, W_MAX)
    if (now) {
      share('recipe')
      return
    }
    if (!weightSend) {
      weightSend = setTimeout(() => {
        weightSend = null
        share('recipe')
        refresh(recipePanel)
      }, 250)
    }
  }
  function recipeStep(k) {
    if (k === 'scale') {
      play('tap')
      ctx.showPanel(recipePanel)
      return
    }
    if (!ELK.includes(k)) return
    R.el = k
    R.at = clock
    R.n++
    R.mine = true
    play('select')
    say(at(E.recipe.says[k], level()), RECIPE_C)
    share('recipe')
    refresh(recipePanel)
    findOnce('recipe', recipePanel, 4)
  }
  ex.add({
    id: 'recipe',
    x: RECIPE_AT.x,
    z: RECIPE_AT.z,
    radius: 2.0,
    label: E.recipe.label,
    verb: () => (R.el ? E.recipe.hints.more : E.recipe.hints.jar),
    manual: true,
    focus: { x: FIG.x, y: 1.75, z: FIG.z + 1.6, size: 5.8 },
    act: () => ctx.showPanel(recipePanel),
  })
  for (const j of jars) clickable(j.g, () => recipeStep(j.e.k), { reach: 6.5 })
  clickable(scaleG, () => recipeStep('scale'), { reach: 6.5 })
  clickable(child.group, () => recipeStep('scale'), { reach: 7 })

  const partColor = new THREE.Color()
  updates.push(dt => {
    // the weight: the jars fill, the child grows, the numbers follow
    R.shown = damp(R.shown, R.w, 6, dt)
    if (Math.abs(R.shown - R.w) < 0.05) R.shown = R.w
    const f = R.shown / W_MAX
    if (Math.abs(f - jarFill) > 0.002) {
      jarFill = f
      drawJars(f)
      recipeWords()
    }
    child.group.scale.setScalar(figH(R.shown))
    // the chosen jar glows; its atoms fly into the child, and its places in the child light up
    const a = clock - R.at
    for (const j of jars) {
      const on = R.el === j.e.k
      j.ringMat.opacity = damp(j.ringMat.opacity, on ? 0.95 : 0, 5, dt)
      j.ringMat.emissiveIntensity = 0.8 + (on ? 0.4 * Math.sin(clock * 4) : 0)
    }
    const show = R.el ? SHOW[R.el] : {}
    for (const [name, part] of Object.entries(child.parts)) {
      const target = show[name] && a > 0.7 ? 1 : 0
      if (show[name]) {
        partColor.set(show[name])
        part.mesh.material.color.copy(partColor)
        part.mesh.material.emissive.copy(partColor)
      }
      part.k = damp(part.k, target, target ? 2.6 : 6, dt)
      part.mesh.visible = part.k > 0.01
      part.mesh.material.opacity = part.k * (name === 'water' ? 0.62 : 0.92)
      part.mesh.material.emissiveIntensity = 0.35 + 0.2 * Math.sin(clock * 2.4)
    }
    const showing = R.el ? 1 : 0
    child.skinU.uFillA.value = damp(child.skinU.uFillA.value, showing ? 0.07 : 0.4, 3, dt)
    child.skinU.uGlow.value = 0.8 + 0.2 * Math.sin(clock * 1.7)
    // the stream
    streamBalls.begin()
    const jar = R.el && jars.find(j => j.e.k === R.el)
    if (jar && a < 2.4) {
      const from = V3(jar.x, jar.top + 0.1, jar.z)
      const k = figH(R.shown)
      streamSeeds.forEach((s, i) => {
        const u = clamp((a - s.d) / 1.1)
        if (u <= 0 || u >= 1) return
        const to = V3(FIG.x + s.x * k * 0.5, PODIUM + 0.17 + (0.35 + s.y * 0.5) * k, FIG.z + s.z * k * 0.4)
        const p = from.clone().lerp(to, ease(u))
        p.y += Math.sin(Math.PI * u) * 0.9
        const c = jar.colors[i % jar.colors.length]
        streamBalls.ball(p, Math.min(0.06, jar.d.rb * 1.1) * (1 - 0.4 * u), c)
      })
    }
    streamBalls.end()
  })

  // ======== 2. the DNA zipper ========
  const dnaG = new THREE.Group()
  dnaG.position.set(DNA_AT.x, 0, DNA_AT.z)
  // its rungs face the visitor coming from the room's middle (local +z points to +x)
  dnaG.rotation.y = Math.PI / 2
  root.add(dnaG)
  const COMP = SEQ.map(b => PAIR[b])
  // 32 nucleotides: the two strands, then the pieces for the copies (a new left strand, a new right one)
  const NUCS = [
    ...SEQ.map((b, i) => ({ base: b, s: -1, i })), // 0..7 the left strand (A)
    ...COMP.map((b, i) => ({ base: b, s: 1, i })), // 8..15 the right strand (B)
    ...SEQ.map((b, i) => ({ base: b, s: -1, i })), // 16..23 a new left strand (A'), pairs with B
    ...COMP.map((b, i) => ({ base: b, s: 1, i })), // 24..31 a new right strand (B'), pairs with A
  ]
  const atomsB = batch(ballGeo, M.ball, NUCS.length * NA.length + 4)
  const sticksB = batch(stickGeo, M.stick, NUCS.length * (NB.length + 1) + 8)
  const hitsB = batch(new THREE.SphereGeometry(1, 8, 6), M.hit, NUCS.length * SUGAR_C.length)
  const baseMats = Object.fromEntries(Object.entries(BASE_C).map(([k, c]) => [k, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.25, roughness: 0.45 })]))
  const purineGeo = baseGeometry(true)
  const pyrimidineGeo = baseGeometry(false)
  const basesB = Object.fromEntries(Object.keys(BASE_C).map(k => [k, batch(k === 'A' || k === 'G' ? purineGeo : pyrimidineGeo, baseMats[k], NUCS.filter(n => n.base === k).length)]))
  const hbondB = batch(stickGeo, new THREE.MeshBasicMaterial({ color: '#fff6d8' }), 24 * 3)
  dnaG.add(atomsB.mesh, sticksB.mesh, hitsB.mesh, hbondB.mesh, ...Object.values(basesB).map(b => b.mesh))
  // (a pointer over the helix tests some 400 balls: as spheres, not as their triangles)
  sphereCast(atomsB.mesh)
  sphereCast(hitsB.mesh)
  // the zipper: a glowing clamp that rides up the fork (the enzyme helicase)
  const zipper = new THREE.Group()
  {
    const mat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.9, roughness: 0.35, metalness: 0.3 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, 12, 40), mat)
    ring.rotation.x = Math.PI / 2
    const tab = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.32, 0.07, 2, 0.03), mat)
    tab.position.set(0, -0.2, 0.36)
    tab.rotation.x = 0.35
    const hole = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.02, 6, 16), new THREE.MeshStandardMaterial({ color: '#7a5a10', roughness: 0.5 }))
    hole.position.set(0, -0.28, 0.39)
    hole.rotation.x = 0.35
    // (a tap through the ring's hole should still find it: a solid hit shape round ring and tab)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.7, 12), M.hit)
    hit.position.y = -0.15
    zipper.add(ring, tab, hole, hit)
  }
  dnaG.add(zipper)
  // a chosen carbon glows in the helix, and a magnifier beside it shows it alone with its four hands as
  // they really point, to the corners of a tetrahedron, numbered, each partner in its own colour (the
  // ladder above is drawn flat for clarity; the magnifier has the true angles)
  const markGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow(), color: GOLD, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }))
  markGlow.scale.setScalar(0.6)
  markGlow.visible = false
  dnaG.add(markGlow)
  const PARTNERS = [['O', 'C', 'N', 'H'], ['C', 'C', 'H', 'H'], ['C', 'C', 'O', 'H'], ['C', 'O', 'C', 'H'], ['C', 'O', 'H', 'H']]
  const TETRA = [V3(1, 1, 1), V3(1, -1, -1), V3(-1, 1, -1), V3(-1, -1, 1)].map(v => v.normalize())
  const lens = new THREE.Group()
  lens.visible = false
  dnaG.add(lens)
  const lensMol = new THREE.Group()
  const lensLine = new THREE.Mesh(stickGeo, new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.7 }))
  dnaG.add(lensLine)
  lensLine.visible = false
  const lensBalls = []
  const lensNums = []
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.44, 48), new THREE.MeshBasicMaterial({ color: '#0d1233', transparent: true, opacity: 0.88, depthWrite: false }))
    disc.position.z = -0.2
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.022, 8, 64), new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 1.1, roughness: 0.4 }))
    rim.position.z = -0.2
    lens.add(disc, rim, lensMol)
    const centre = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: ATOM.C, emissive: GOLD, emissiveIntensity: 0.35, roughness: 0.35 }))
    centre.scale.setScalar(0.085)
    lensMol.add(centre)
    const bondMat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.5, roughness: 0.4 })
    TETRA.forEach((d, i) => {
      const end = d.clone().multiplyScalar(0.27)
      const bond = new THREE.Mesh(stickGeo, bondMat)
      bond.position.copy(end).multiplyScalar(0.5)
      bond.quaternion.setFromUnitVectors(UP, d)
      bond.scale.set(0.02, 0.27, 0.02)
      const ball = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35 }))
      ball.position.copy(end)
      lensMol.add(bond, ball)
      lensBalls.push(ball)
      const t = makeText(String(i + 1), { size: 0.11, color: GOLD, outlineWidth: 0.012, outlineColor: '#2a1a00', anchorX: 'center', anchorY: 'middle' })
      lens.add(t)
      lensNums.push({ t, d })
    })
  }
  const zipperWord = makeText(E.dna.signs.zipper, { size: 0.11, color: GOLD, outlineWidth: 0.01, outlineColor: '#2a1a00', anchorX: 'center', anchorY: 'top' })
  dnaG.add(zipperWord)
  // the legend: which letters are partners
  {
    const tex = canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = 'rgba(16,10,36,0.92)'
      g.beginPath()
      g.roundRect(4, 4, w - 8, h - 8, 26)
      g.fill()
      g.strokeStyle = DNA_C
      g.lineWidth = 5
      g.stroke()
      g.font = '700 44px Outfit, Nunito, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillStyle = DNA_C
      g.fillText(E.dna.signs.pairs, w / 2, 48)
      const chip = (x, y, b) => {
        g.fillStyle = BASE_C[b]
        g.beginPath()
        g.roundRect(x - 44, y - 34, 88, 68, 16)
        g.fill()
        g.fillStyle = '#1b1430'
        g.font = '800 52px Outfit, Nunito, sans-serif'
        g.fillText(b, x, y + 3)
      }
      for (const [y, a, b, n] of [[122, 'A', 'T', 2], [204, 'G', 'C', 3]]) {
        chip(150, y, a)
        chip(362, y, b)
        g.strokeStyle = '#fff6d8'
        g.lineWidth = 6
        for (let k = 0; k < n; k++) {
          const yy = y + (k - (n - 1) / 2) * 18
          g.setLineDash([12, 9])
          g.beginPath()
          g.moveTo(200, yy)
          g.lineTo(312, yy)
          g.stroke()
        }
        g.setLineDash([])
      }
    })
    textures.push(tex)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }))
    sign.position.set(-2.15, 1.25, 0.6)
    sign.rotation.y = 0.35
    dnaG.add(sign)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 1.02, 8), M.plinth)
    post.position.set(-2.15, 0.51, 0.55)
    dnaG.add(post)
  }
  // a round floor under the helix
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.12, 48), M.plinth)
    base.position.y = 0.06
    const ringMat = new THREE.MeshStandardMaterial({ color: DNA_C, emissive: DNA_C, emissiveIntensity: 1.0, roughness: 0.4 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.02, 6, 64), ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.12
    dnaG.add(base, ring)
    solids.push(circle(DNA_AT.x, DNA_AT.z, 1.45))
  }

  const DN = { phase: 'helix', start: -99, n: 0, away: 0, mark: null, markAt: -99, mine: false, said: true, sound: false, cue: 0 }
  const COPY_T = 7.6
  const AWAY_T = 2.8
  const dnaAge = () => clock - DN.start
  const dnaBusy = () => (DN.phase === 'copy' && dnaAge() < COPY_T) || (DN.phase === 'away' && dnaAge() < AWAY_T)
  /** Which nucleotides are which now: after every copy sent away, the new right strand stayed and the
   *  old one went back among the pieces (the same letters, so no one can tell). */
  const roles = () => {
    const sw = DN.away % 2 === 1
    const r = i => Array.from({ length: BP }, (_, k) => i + k)
    return { A: r(0), B: sw ? r(24) : r(8), A2: r(16), B2: sw ? r(8) : r(24) }
  }
  const pool = () => {
    const r = roles()
    return [...r.A2, ...r.B2]
  }
  // where each piece floats while it waits: behind the helix, slowly tumbling
  const homes = NUCS.map((_, n) => {
    const r = random(300 + n)
    const side = n % 2 ? 1 : -1
    return { p: V3(side * (1.9 + r() * 0.7), 0.8 + r() * 2.5, -0.5 - r() * 1.0), ph: r() * TAU, sp: 0.25 + r() * 0.25, e: new THREE.Euler(r() * TAU, r() * TAU, r() * TAU) }
  })
  const qPi = new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), Math.PI)
  /** A nucleotide in a ladder whose middle is at cx, its rung i, the ladder twisted by `tw` a pair. */
  const inLadder = (n, cx, tw, out) => {
    const nu = NUCS[n]
    const th = nu.i * tw
    out.q.setFromAxisAngle(UP, th)
    if (nu.s < 0) out.q.multiply(qPi)
    out.p.set(nu.s * NUC_C, 0, 0).applyAxisAngle(UP, th)
    out.p.x += cx
    out.p.y = Y0 + nu.i * RISE
    out.sc = 1
    return out
  }
  const drifting = (n, t, out) => {
    const h = homes[n]
    out.p.copy(h.p)
    out.p.x += Math.sin(t * h.sp + h.ph) * 0.12
    out.p.y += Math.sin(t * h.sp * 1.3 + h.ph * 2) * 0.1
    out.q.setFromEuler(new THREE.Euler(h.e.x + t * h.sp * 0.6, h.e.y + t * h.sp * 0.4, h.e.z))
    out.sc = 1
    return out
  }
  const frames = NUCS.map(() => ({ p: V3(0, 0, 0), q: new THREE.Quaternion(), sc: 1, free: true }))
  const tmpF = { p: V3(0, 0, 0), q: new THREE.Quaternion(), sc: 1 }
  /** Where every nucleotide is now, from the phase and its age. */
  function placeNucleotides(t) {
    const r = roles()
    const a = dnaAge()
    const isPool = new Set(pool())
    for (let n = 0; n < NUCS.length; n++) {
      const f = frames[n]
      const nu = NUCS[n]
      f.free = false
      const inA = r.A.includes(n)
      const inB = r.B.includes(n)
      if (DN.phase === 'helix' || (DN.phase === 'copy' && a < 0)) {
        if (inA || inB) inLadder(n, 0, TWIST, f)
        else {
          drifting(n, t, f)
          f.free = true
          f.sc = 0
        }
      } else if (DN.phase === 'copy' && a < COPY_T) {
        const tw0 = TWIST * (1 - span(0, 1.2, a))
        const tw1 = TWIST * span(6.0, 7.4, a)
        const sep = D_SEP * span(1.2 + nu.i * 0.45, 2.0 + nu.i * 0.45, a)
        const tw = a < 6 ? tw0 : tw1
        if (inA) inLadder(n, -sep, tw, f)
        else if (inB) inLadder(n, sep, tw, f)
        else {
          // a piece docks onto its half: B' onto the left strand's ladder, A' onto the right one's
          const k = span(1.7 + nu.i * 0.45, 2.7 + nu.i * 0.45, a)
          const cx = r.B2.includes(n) ? -D_SEP : D_SEP
          if (k <= 0) {
            drifting(n, t, f)
            f.free = true
            f.sc = span(0.1, 1.1, a)
          } else {
            drifting(n, t, tmpF)
            inLadder(n, cx, tw, f)
            f.p.lerpVectors(tmpF.p, f.p, k)
            f.q.slerpQuaternions(tmpF.q, f.q, k)
            f.free = k < 1
          }
        }
      } else if (DN.phase === 'copied' || DN.phase === 'copy') {
        if (inA || r.B2.includes(n)) inLadder(n, -D_SEP, TWIST, f)
        else inLadder(n, D_SEP, TWIST, f)
      } else {
        // the copy (the new left strand and the old right one) rises away; the other slides to the middle
        const goes = r.A2.includes(n) || inB
        if (goes) {
          inLadder(n, D_SEP, TWIST, f)
          const u = span(0, 2.2, a)
          f.p.y += u * 3.2
          f.p.z -= u * 1.5
          f.sc = 1 - span(0.8, 2.4, a)
        } else inLadder(n, -D_SEP * (1 - span(0.6, 2.2, a)), TWIST, f)
      }
      if (isPool.has(n) && DN.phase === 'helix') f.free = true
    }
  }
  const atomW = NUCS.map(() => NA.map(() => V3(0, 0, 0)))
  const mFrame = new THREE.Matrix4()
  const sc3 = V3(1, 1, 1)
  const hbondCol = new THREE.Color('#fff6d8')
  const markInfo = () => {
    if (!DN.mark) return null
    const [n, k] = DN.mark
    const ci = SUGAR_C[k]
    const near = NB.filter(([a, b]) => a === ci || b === ci).map(([a, b]) => (a === ci ? b : a))
    return { n, k, ci, near }
  }
  function drawDNA(t) {
    placeNucleotides(t)
    atomsB.begin()
    sticksB.begin()
    hitsB.begin()
    hbondB.begin()
    for (const b of Object.values(basesB)) b.begin()
    const mk = markInfo()
    for (let n = 0; n < NUCS.length; n++) {
      const f = frames[n]
      if (f.sc < 0.01) {
        atomW[n].forEach(v => v.set(0, -99, 0))
        continue
      }
      sc3.setScalar(f.sc)
      mFrame.compose(f.p, f.q, sc3)
      NA.forEach((a, i) => atomW[n][i].copy(a.p).applyMatrix4(mFrame))
      NA.forEach((a, i) => atomsB.ball(atomW[n][i], RADIUS[a.el] * f.sc, mk && mk.n === n && i === mk.ci ? GOLD_C : COL[a.el]))
      NB.forEach(([i, j]) => {
        const hot = mk && mk.n === n && (i === mk.ci || j === mk.ci)
        sticksB.stick(atomW[n][i], atomW[n][j], (hot ? 0.026 : 0.017) * f.sc, hot ? GOLD_C : BOND)
      })
      basesB[NUCS[n].base].put(mFrame, null)
      if (!f.free) SUGAR_C.forEach((ci, k) => hitsB.ball(atomW[n][ci], 0.1, null, [n, k]))
    }
    // the backbone's links, from each phosphate to the next nucleotide's O3' along the strand
    const r = roles()
    for (const strand of [r.A, r.B, r.A2, r.B2]) {
      for (const n of strand) {
        const nu = NUCS[n]
        const m = strand.find(o => NUCS[o].i === nu.i + nu.s)
        if (m == null || frames[n].free || frames[m].free || frames[n].sc < 0.5 || frames[m].sc < 0.5) continue
        // (in the twisted helix this link runs round with the twist, the strand's rail)
        sticksB.stick(atomW[n][7], atomW[m][10], 0.017 * frames[n].sc, BOND)
      }
    }
    // hydrogen bonds across every rung whose two bases face each other
    const pairs = []
    for (let i = 0; i < BP; i++) pairs.push([r.A[i], r.B[i]], [r.A[i], r.B2[i]], [r.A2[i], r.B[i]])
    for (const [p, q] of pairs) {
      const a = atomW[p][11]
      const b = atomW[q][11]
      if (frames[p].free || frames[q].free || a.distanceTo(b) > 0.86 || frames[p].sc < 0.9 || frames[q].sc < 0.9) continue
      const purL = NUCS[p].base === 'A' || NUCS[p].base === 'G'
      const nb = NUCS[p].base === 'G' || NUCS[p].base === 'C' ? 3 : 2
      // the gap lies nearer the pyrimidine's side
      const pyr = purL ? b : a
      const pur = purL ? a : b
      const dir = tmpV.subVectors(pur, pyr).normalize().clone()
      const mid = pyr.clone().addScaledVector(dir, 0.334)
      const side = dir.clone().cross(UP).normalize()
      for (let k = 0; k < nb; k++) {
        const off = (k - (nb - 1) / 2) * 0.075
        const c = mid.clone().addScaledVector(side, off)
        hbondB.stick(c.clone().addScaledVector(dir, -0.055), c.clone().addScaledVector(dir, 0.055), 0.009, hbondCol)
      }
    }
    // the chosen carbon's hydrogens and its four numbered hands
    markGlow.visible = !!mk
    lens.visible = !!mk
    lensLine.visible = !!mk
    if (mk) {
      const f = frames[mk.n]
      const c = atomW[mk.n][mk.ci]
      markGlow.position.copy(c)
      markGlow.material.opacity = 0.65 + 0.25 * Math.sin(clock * 4)
      for (const d of HDIR[mk.ci]) {
        const h = d.clone().applyQuaternion(f.q).multiplyScalar(C_H * 1.5 * f.sc).add(c)
        atomsB.ball(h, RADIUS.H, COL.H)
        sticksB.stick(c, h, 0.026, GOLD_C)
      }
      // the magnifier floats in front of the carbon, toward the visitor, and grows in
      const k = span(0, 0.5, clock - DN.markAt)
      lens.position.set(c.x + (c.x >= 0 ? 0.62 : -0.62), clamp(c.y + 0.3, 1.0, 3.2), 0.95)
      lens.scale.setScalar(Math.max(0.001, k))
      lensMol.rotation.y = clock * 0.6
      lensMol.rotation.x = 0.35
      PARTNERS[mk.k].forEach((el, i) => {
        lensBalls[i].material.color.copy(COL[el])
        lensBalls[i].scale.setScalar(el === 'H' ? 0.05 : 0.07)
      })
      lensMol.updateMatrix()
      lensNums.forEach(({ t: tt, d }) => tt.position.copy(d).multiplyScalar(0.34).applyMatrix4(lensMol.matrix).setZ(0.12))
      const rimAt = lens.position.clone().add(c.clone().sub(lens.position).normalize().multiplyScalar(0.44 * k))
      tmpV.subVectors(c, rimAt)
      const len = tmpV.length()
      lensLine.position.addVectors(c, rimAt).multiplyScalar(0.5)
      lensLine.quaternion.setFromUnitVectors(UP, tmpV.normalize())
      lensLine.scale.set(0.012, Math.max(0.001, len), 0.012)
    }
    // the zipper rides the fork, and waits under the helix
    const a = dnaAge()
    const zy = DN.phase === 'copy' && a < 6 ? Y0 - 0.18 + clamp((a - 1.0) / 0.45, 0, BP + 1) * RISE : Y0 - 0.18
    zipper.position.set(0, zy, 0)
    const zv = DN.phase === 'helix' ? 1 : DN.phase === 'copy' ? 1 - span(5.2, 5.9, a) : DN.phase === 'away' ? span(1.8, 2.6, a) : 0
    zipper.scale.setScalar(Math.max(0.001, zv * (1 + (DN.phase === 'helix' ? 0.06 * Math.sin(clock * 3) : 0))))
    zipper.visible = zv > 0.01
    zipper.rotation.y = DN.phase === 'copy' ? a * 5 : 0
    zipperWord.visible = DN.phase === 'helix'
    zipperWord.position.set(0.68, zy - 0.02, 0.4)
    atomsB.end()
    sticksB.end()
    hitsB.end()
    hbondB.end()
    for (const b of Object.values(basesB)) b.end()
  }

  const dnaPanel = lv => ({
    title: E.dna.title,
    color: DNA_C,
    blocks: [
      ...paras(E.dna.panel[depth(lv)]),
      {
        buttons: [
          { label: DN.phase === 'copied' ? E.dna.verbs.away : E.dna.verbs.unzip, onClick: () => dnaStep(DN.phase === 'copied' ? 'dna' : 'zipper') },
          { label: E.dna.verbs.carbon, onClick: () => dnaStep('carbon') },
        ],
      },
    ],
  })
  const DNA_CUES = BP
  function dnaStep(thing, hit) {
    const lv = level()
    if (thing === 'carbon') {
      // a sugar's carbon: the one tapped, or (from the panel) the next carbon of one nucleotide
      let mark = hit
      if (!mark) {
        const n = roles().A[3]
        const k = DN.mark && DN.mark[0] === n ? (DN.mark[1] + 1) % SUGAR_C.length : 0
        mark = [n, k]
      }
      if (dnaBusy()) return say(at(W.busy, lv))
      DN.mark = mark
      DN.markAt = clock
      DN.n++
      play('join', { order: 1 })
      say(at(E.dna.says[`C${[1, 2, 3, 4, 5][mark[1]]}`], lv), DNA_C)
      share('dna')
      findOnce('dna', dnaPanel, 3.5)
      return
    }
    if (dnaBusy()) return say(at(W.busy, lv))
    if (DN.phase === 'helix') {
      DN.phase = 'copy'
      DN.start = clock
      DN.mark = null
      DN.n++
      DN.mine = true
      DN.said = false
      DN.sound = true
      DN.cue = 0
      play('part')
      say(at(E.dna.says.unzip, lv), DNA_C)
      share('dna')
      refresh(dnaPanel)
      return
    }
    if (DN.phase === 'copied') {
      DN.phase = 'away'
      DN.start = clock
      DN.mark = null
      DN.n++
      DN.mine = true
      play('enter')
      say(at(E.dna.says.away, lv), DNA_C)
      share('dna')
      refresh(dnaPanel)
    }
  }
  ex.add({
    id: 'dna',
    x: -3.0,
    z: -1.5,
    radius: 1.9,
    label: E.dna.label,
    verb: () => {
      const H = E.dna.hints
      if (DN.phase === 'copy' || DN.phase === 'away') return H.watch
      if (DN.phase === 'copied') return H.away
      return DN.n > 0 && !DN.mark ? H.carbon : H.unzip
    },
    manual: true,
    focus: { x: DNA_AT.x + 0.2, y: 2.05, z: DNA_AT.z, size: 5.4 },
    act: () => ctx.showPanel(dnaPanel),
  })
  clickable(hitsB.mesh, hit => {
    const tg = hitsB.tag[hit.instanceId]
    if (tg) dnaStep('carbon', tg)
  }, { reach: 6 })
  clickable(zipper, () => dnaStep('zipper'), { reach: 6 })
  // (the atoms and bases: a tap on them unzips, or sends the copy away)
  clickable(atomsB.mesh, () => dnaStep('dna'), { reach: 6 })
  for (const b of Object.values(basesB)) clickable(b.mesh, () => dnaStep('dna'), { reach: 6 })
  updates.push((dt, t) => {
    const a = dnaAge()
    // sounds as the pieces dock, the end of a copy, the end of a parting
    if (DN.phase === 'copy') {
      if (DN.sound) while (DN.cue < DNA_CUES && a >= 2.7 + DN.cue * 0.45) {
        play('join', { order: 1 + (DN.cue % 3) })
        DN.cue++
      }
      if (a >= COPY_T) {
        DN.phase = 'copied'
        if (!DN.said) {
          DN.said = true
          if (DN.mine) {
            say(at(E.dna.says.copied, level()), DNA_C)
            findOnce('dna', dnaPanel, 3)
          }
          if (DN.sound) play('select')
        }
        refresh(dnaPanel)
      }
    } else if (DN.phase === 'away' && a >= AWAY_T) {
      DN.phase = 'helix'
      DN.away++
      refresh(dnaPanel)
    }
    drawDNA(t)
  })

  // ======== 3. your food becomes you ========
  const foodAtoms = batch(ballGeo, M.ball, 4 * 12 + 6 * 5 + 24 * 5 + 30 * 3 + 8)
  const foodSticks = batch(stickGeo, M.stick, 4 * 12 + 4 + 6 * 4 + 6 + 24 * 5 + 30 * 2 + 8)
  root.add(foodAtoms.mesh, foodSticks.mesh)
  // the table with the bread
  const table = new THREE.Group()
  table.position.copy(FOOD.bread)
  root.add(table)
  solids.push(circle(FOOD.bread.x, FOOD.bread.z, 0.6))
  const TABLE_Y = 0.92
  {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, TABLE_Y - 0.05, 24), M.plinth)
    leg.position.y = (TABLE_Y - 0.05) / 2
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 40), new THREE.MeshStandardMaterial({ color: '#6b4a8a', roughness: 0.5 }))
    top.position.y = TABLE_Y - 0.03
    table.add(leg, top)
  }
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.03, 40), new THREE.MeshStandardMaterial({ color: '#efe9e2', roughness: 0.35 }))
  plate.position.y = TABLE_Y + 0.015
  table.add(plate)
  // a slice of bread standing on the plate, turned to the visitor: crumb on its faces, crust round its edge
  const breadG = new THREE.Group()
  {
    const s = new THREE.Shape()
    const w = 0.27
    s.moveTo(-w, 0)
    s.lineTo(w, 0)
    s.lineTo(w, 0.36)
    s.bezierCurveTo(w + 0.1, 0.42, w + 0.06, 0.6, 0.12, 0.6)
    s.bezierCurveTo(0.06, 0.66, -0.06, 0.66, -0.12, 0.6)
    s.bezierCurveTo(-w - 0.06, 0.6, -w - 0.1, 0.42, -w, 0.36)
    s.lineTo(-w, 0)
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 16 })
    geo.translate(0, 0.015, -0.03)
    // the crumb's UVs from the shape's own x and y
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + 0.4) / 0.8, p.getY(i) / 0.7)
    const crumbTex = canvasTex(256, 256, (g, cw, ch) => {
      g.fillStyle = '#ecd29b'
      g.fillRect(0, 0, cw, ch)
      const rnd = random(77)
      for (let i = 0; i < 160; i++) {
        const r = 1.5 + rnd() ** 2 * 7
        g.fillStyle = `rgba(160,110,50,${0.25 + rnd() * 0.3})`
        g.beginPath()
        g.ellipse(rnd() * cw, rnd() * ch, r, r * (0.6 + rnd() * 0.5), rnd() * 3, 0, TAU)
        g.fill()
      }
    })
    textures.push(crumbTex)
    const slice = new THREE.Mesh(geo, [new THREE.MeshStandardMaterial({ map: crumbTex, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: '#9a5a26', roughness: 0.8 })])
    breadG.add(slice)
    breadG.position.set(0, TABLE_Y + 0.03, 0.05)
    // facing the visitor, who stands to the -x side
    breadG.rotation.y = -Math.PI / 2 + 0.35
    breadG.rotation.x = -0.12
  }
  table.add(breadG)
  const crumbsB = batch(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshStandardMaterial({ color: '#d9b77a', roughness: 0.9 }), 30)
  root.add(crumbsB.mesh)
  const crumbSeeds = Array.from({ length: 30 }, (_, i) => {
    const r = random(500 + i)
    return { x: (r() - 0.5) * 0.5, y: r() * 0.6, z: (r() - 0.5) * 0.1, vx: (r() - 0.5) * 0.8, vy: 0.6 + r() * 1.2, vz: (r() - 0.5) * 0.8, s: 0.012 + r() * 0.02 }
  })

  // the cell: a membrane you can see into, a nucleus, two mitochondria, a ribosome
  const cellG = new THREE.Group()
  cellG.position.copy(FOOD.cell)
  root.add(cellG)
  solids.push(circle(FOOD.cell.x, FOOD.cell.z, FOOD.cellR + 0.05))
  const membraneMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color('#ffb3d0') }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        vP = position;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uTime;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
        float speck = 0.5 + 0.5 * sin(vP.x * 40.0 + uTime) * sin(vP.y * 37.0) * sin(vP.z * 43.0 - uTime * 0.7);
        gl_FragColor = vec4(uColor * (0.8 + 0.8 * f), 0.06 + 0.55 * f + 0.05 * speck);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(FOOD.cellR, 48, 32), membraneMat)
  membrane.renderOrder = 5
  cellG.add(membrane)
  const cyto = new THREE.Mesh(new THREE.SphereGeometry(FOOD.cellR * 0.985, 32, 20), new THREE.MeshBasicMaterial({ color: '#7a2f6a', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.BackSide }))
  cellG.add(cyto)
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 20), new THREE.MeshStandardMaterial({ color: '#6a3fb5', emissive: '#2a1060', emissiveIntensity: 0.5, roughness: 0.5 }))
  nucleus.position.set(0.45, 0.05, 0.2)
  cellG.add(nucleus)
  const MITO = [V3(-0.45, -0.42, -0.55), V3(0.15, -0.5, 0.65)]
  const mitoMat = new THREE.MeshStandardMaterial({ color: '#ff8a6a', emissive: '#ff5a3a', emissiveIntensity: 0.25, roughness: 0.5 })
  const mitos = MITO.map((p, i) => {
    const g = new THREE.Group()
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.3, 8, 18), mitoMat)
    m.rotation.z = Math.PI / 2
    g.add(m)
    // its folds, seen through
    for (let k = -2; k <= 2; k++) {
      const fold = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 16, Math.PI), new THREE.MeshStandardMaterial({ color: '#ffd0b8', roughness: 0.5 }))
      fold.position.set(k * 0.075, 0, 0.0)
      fold.rotation.y = Math.PI / 2
      fold.rotation.z = k % 2 ? 0 : Math.PI
      g.add(fold)
    }
    g.position.copy(p)
    g.rotation.y = i ? 0.6 : -0.4
    cellG.add(g)
    return g
  })
  const RIBO = V3(-0.5, 0.62, 0.55)
  const ribo = new THREE.Group()
  {
    const mat = new THREE.MeshStandardMaterial({ color: '#7fe0c0', emissive: '#2fa080', emissiveIntensity: 0.4, roughness: 0.5 })
    const big = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), mat)
    const small = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), mat)
    small.position.set(0, 0.12, 0.02)
    ribo.add(big, small)
    ribo.position.copy(RIBO)
    cellG.add(ribo)
  }
  // a few more ribosomes as specks
  for (let i = 0; i < (light ? 8 : 18); i++) {
    const r = random(40 + i)
    const sp = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), ribo.children[0].material)
    const v = V3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(0.55 + r() * 0.6)
    sp.position.copy(v)
    cellG.add(sp)
  }
  // the breath: a soft cloud that swells and sighs at the breathing rate
  const cloudG = new THREE.Group()
  cloudG.position.copy(FOOD.cloud)
  root.add(cloudG)
  const puffMat = new THREE.MeshStandardMaterial({ color: '#f4eaff', emissive: '#8a76b8', emissiveIntensity: 0.35, roughness: 0.9, transparent: true, opacity: 0.32, depthWrite: false })
  const puffs = []
  for (const [x, y, z, s] of [[0, 0, 0, 0.42], [0.35, -0.05, 0.25, 0.32], [-0.35, -0.08, -0.2, 0.34], [0.05, 0.22, -0.3, 0.3], [-0.1, 0.15, 0.32, 0.28], [0.4, 0.1, -0.25, 0.26], [-0.42, 0.1, 0.18, 0.25]]) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), puffMat)
    p.position.set(x, y, z)
    p.scale.setScalar(s)
    p.renderOrder = 6
    cloudG.add(p)
    puffs.push({ m: p, s })
  }
  const cloudHit = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 8), M.hit)
  cloudG.add(cloudHit)
  const cloudSign = new THREE.Group()
  cloudSign.position.set(FOOD.cloud.x - 0.2, FOOD.cloud.y - 0.75, FOOD.cloud.z)
  cloudSign.rotation.y = -Math.PI / 2
  root.add(cloudSign)
  const cloudTitle = makeText(E.food.signs.cloud, { size: 0.15, color: '#e8dcff', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.01, outlineColor: '#160d2a' })
  cloudTitle.position.y = 0.02
  const cloudRate = makeText('', { size: 0.1, color: FOOD_C, anchorX: 'center', anchorY: 'top', outlineWidth: 0.008, outlineColor: '#160d2a', font: 'medium' })
  cloudSign.add(cloudTitle, cloudRate)
  // the names of things, small, facing the visitor
  const tag = (text, p, color = '#f2e8ff', size = 0.085) => {
    const t = makeText(text, { size, color, anchorX: 'center', anchorY: 'middle', outlineWidth: size * 0.09, outlineColor: '#160d2a', font: 'medium' })
    t.position.copy(p)
    t.rotation.y = -Math.PI / 2
    root.add(t)
    return t
  }
  tag(E.food.signs.mito, FOOD.cell.clone().add(MITO[0]).add(V3(-0.9, -0.28, 0)), '#ffb39a')
  tag(E.food.signs.ribo, FOOD.cell.clone().add(RIBO).add(V3(-0.95, 0.22, 0)), '#9ff0d4')
  const glucoseTag = tag(E.food.signs.glucose, V3(5.25, 2.45, -1.62), '#e6e9f2', 0.11)
  const aminoTag = tag(E.food.signs.amino, V3(5.25, 1.5, 1.45), '#cfd8ff', 0.11)

  // where the pieces wait (in front of the cell), and their way in
  const GL_WAIT = [V3(5.25, 2.08, -1.95), V3(5.25, 2.08, -1.29), V3(5.25, 1.5, -1.95), V3(5.25, 1.5, -1.29)]
  const AA_WAIT = Array.from({ length: 6 }, (_, k) => V3(5.25, 0.98 + (k % 2) * 0.22, 1.0 + k * 0.18))
  const qFace = new THREE.Quaternion().setFromAxisAngle(UP, -Math.PI / 2)
  const F = { bread: 1, gl: [0, 0, 0, 0], amino: 0, chain: 0, co2: 0, act: 0, n: 0, ev: null, start: -99, mine: false, said: true, sound: false, burned: 0, built: 0, breaths: 0 }
  const DIGEST_T = 4.6
  const BURN_T = 5.2
  const BUILD_T = 3.6
  const BREATHE_T = 1.8
  const DUR = { bread: DIGEST_T, glucose: BURN_T, amino: BUILD_T, breathe: BREATHE_T, slice: 0.8 }
  const evAge = () => clock - F.start
  const foodBusy = () => !!F.ev && evAge() < (DUR[F.ev.kind] ?? 0)
  // a breathing rate and the carbon breathed out a minute, for how hard you move (a grown-up: 0.1 g at
  // rest, about 0.4 walking, about 1.1 running; 12 to 40 breaths a minute)
  const gPerMin = act => 0.1 * (1 + 9 * act)
  const breathsPerMin = act => 12 + 28 * act
  const moveName = act => E.food.moves[act < 0.3 ? 'rest' : act < 0.7 ? 'walk' : 'run']
  const rateText = () => fill(E.food.perMin, { g: numOf(gPerMin(F.act), gPerMin(F.act) < 1 ? 1 : 1) })

  const foodPanel = lv => ({
    title: E.food.title,
    color: FOOD_C,
    blocks: [
      {
        slider: {
          label: E.food.move,
          min: 0,
          max: 1,
          step: 0.01,
          value: F.act,
          onInput: v => setAct(v, false),
          format: v => `${moveName(v)}: ${fill(E.food.perMin, { g: numOf(gPerMin(v), 1) })}`,
          live: () => F.act,
        },
      },
      ...paras(E.food.panel[depth(lv)]),
      {
        buttons: [
          { label: F.bread ? E.food.verbs.bread : E.food.verbs.slice, onClick: () => foodStep(F.bread ? 'bread' : 'plate') },
          { label: E.food.verbs.glucose, onClick: () => foodStep('glucose') },
          { label: E.food.verbs.amino, onClick: () => foodStep('amino') },
          { label: E.food.verbs.breathe, onClick: () => foodStep('breathe') },
        ],
      },
    ],
  })
  let actSend = null
  function setAct(v, now) {
    F.act = clamp(Number(v) || 0)
    if (now) {
      share('food')
      return
    }
    if (!actSend) {
      actSend = setTimeout(() => {
        actSend = null
        share('food')
      }, 250)
    }
  }
  const startEv = (kind, idx, age, sound, mine) => {
    F.ev = { kind, idx }
    F.start = clock - age
    F.sound = sound
    F.mine = mine
    F.said = age > (DUR[kind] ?? 0) - 0.3
  }
  function foodStep(thing, idx) {
    const lv = level()
    const S = E.food.says
    if (thing === 'breathe') {
      if (foodBusy()) return F.ev?.kind === 'breathe' ? undefined : say(at(W.busy, lv))
      const had = F.co2
      F.co2 = 0
      F.breaths++
      F.n++
      startEv('breathe', had, 0, true, true)
      play('fizz', { order: 2 })
      say(at(S.breathe, lv), FOOD_C)
      share('food')
      return
    }
    if (foodBusy()) return say(at(W.busy, lv))
    if (thing === 'bread' || thing === 'plate') {
      if (F.bread) {
        F.bread = 0
        F.gl = [1, 1, 1, 1]
        F.amino = 6
        F.n++
        startEv('bread', 0, 0, true, true)
        play('crack')
        say(at(S.bread, lv), FOOD_C)
        share('food')
        refresh(foodPanel)
        return
      }
      if (thing === 'plate' && (F.gl.some(Boolean) || F.amino)) return say(at(S.waiting, lv), FOOD_C)
      if (thing === 'plate') {
        F.bread = 1
        F.n++
        startEv('slice', 0, 0, true, true)
        play('tap')
        say(at(S.slice, lv), FOOD_C)
        share('food')
        refresh(foodPanel)
        return
      }
      return
    }
    if (thing === 'glucose') {
      const j = idx != null && F.gl[idx] ? idx : F.gl.findIndex(Boolean)
      if (j < 0) return say(at(F.bread ? S.first : S.empty, lv), FOOD_C)
      F.gl[j] = 0
      F.co2 = Math.min(24, F.co2 + 6)
      F.burned++
      F.n++
      startEv('glucose', j, 0, true, true)
      play('tap')
      say(at(S.glucose, lv), FOOD_C)
      share('food')
      return
    }
    if (thing === 'amino') {
      if (!F.amino) return say(at(F.bread ? S.first : S.noAmino, lv), FOOD_C)
      F.amino = 0
      // a protein of 18 is finished and goes to work; the next one starts afresh
      F.chain = F.chain >= CHAIN_MAX ? 6 : F.chain + 6
      F.built++
      F.n++
      startEv('amino', 0, 0, true, true)
      play('tap')
      say(at(S.amino, lv), FOOD_C)
      share('food')
    }
  }
  ex.add({
    id: 'food',
    x: 3.3,
    z: -0.6,
    radius: 1.9,
    label: E.food.label,
    verb: () => {
      const H = E.food.hints
      if (F.ev?.kind === 'bread' && foodBusy()) return H.wait
      if (F.bread) return H.bread
      if (F.gl.some(Boolean) || F.amino) return H.choose
      if (F.co2 > 0) return H.breathe
      return H.slice
    },
    manual: true,
    focus: { x: 6.0, y: 1.95, z: -0.45, size: 5.3 },
    act: () => ctx.showPanel(foodPanel),
  })
  // hit shapes for the waiting glucose rings and the amino acids (thin things)
  GL_WAIT.forEach((p, j) => {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), M.hit)
    h.position.copy(p)
    root.add(h)
    clickable(h, () => foodStep('glucose', j), { when: () => !!F.gl[j], reach: 5 })
  })
  const aaHit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 1.2), M.hit)
  aaHit.position.set(5.25, 1.08, 1.45)
  root.add(aaHit)
  clickable(aaHit, () => foodStep('amino'), { when: () => F.amino > 0, reach: 5 })
  clickable(breadG, () => foodStep('bread'), { reach: 5 })
  clickable(plate, () => foodStep('plate'), { reach: 5 })
  clickable(cloudG, () => foodStep('breathe'), { reach: 7 })

  // drawing the food's molecules
  const mol = (tpl, pos, q, s, color = null) => {
    const w = tpl.atoms.map(a => a.p.clone().multiplyScalar(s).applyQuaternion(q).add(pos))
    tpl.atoms.forEach((a, i) => foodAtoms.ball(w[i], (a.el === 'R' ? 0.05 : RADIUS[a.el] * 0.8) * s, a.el === 'R' ? color ?? COL.C : COL[a.el]))
    tpl.bonds.forEach(([i, j]) => foodSticks.stick(w[i], w[j], 0.014 * s, BOND))
    return w
  }
  const co2 = (p, q, s = 1) => {
    const d = V3(0.12 * s, 0, 0).applyQuaternion(q)
    const a = p.clone().add(d)
    const b = p.clone().sub(d)
    foodAtoms.ball(p, 0.048 * s, COL.C)
    foodAtoms.ball(a, 0.043 * s, COL.O)
    foodAtoms.ball(b, 0.043 * s, COL.O)
    foodSticks.stick(a, b, 0.016 * s, BOND)
  }
  const qTmp = new THREE.Quaternion()
  const spin = (t, k) => qTmp.setFromEuler(new THREE.Euler(t * 0.7 + k, t * 0.9 + k * 2, t * 0.4)).clone()
  // the protein: its backbone N, alpha carbon, carbon again, coiled as an alpha helix (3.6 residues a turn)
  // round an arc just inside the membrane on the visitor's side, from the ribosome up and over to the left
  const CHAIN_MAX = 18
  const ARC = { o: FOOD.cell.clone().add(V3(-0.5, 0, 0)), r: 0.82, a0: Math.atan2(RIBO.y, RIBO.z) }
  const backboneAt = s => {
    const th = ARC.a0 + (0.12 + 0.025 * s) / ARC.r
    const along = V3(0, Math.sin(th), Math.cos(th))
    const tangent = V3(0, Math.cos(th), -Math.sin(th))
    const side = along.clone().cross(tangent)
    const ph = s * (TAU / 10.8)
    return ARC.o.clone().addScaledVector(along, ARC.r + Math.cos(ph) * 0.055).addScaledVector(side, Math.sin(ph) * 0.055)
  }
  const sparksB = batch(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial({ color: '#fff3a0' }), 14)
  root.add(sparksB.mesh)
  let shownRate = ''
  updates.push((dt, t) => {
    const a = evAge()
    const ev = F.ev && a < (DUR[F.ev.kind] ?? 0) + 0.01 ? F.ev : null
    // the Atomling tells what came of it, once it shows
    if (F.ev && !F.said) {
      const k = F.ev.kind
      if ((k === 'glucose' && a > 4.2) || (k === 'amino' && a > 3.4)) {
        F.said = true
        if (F.mine) {
          say(at(E.food.says[k === 'glucose' ? 'burned' : 'built'], level()), FOOD_C)
          findOnce('food', foodPanel, 3.5)
        }
        if (F.sound) play('select')
      }
      if (k === 'bread' && a > DIGEST_T) F.said = true
    }
    if (F.sound && F.ev?.kind === 'glucose' && a > 2.2 && a - dt <= 2.2) play('pop')
    foodAtoms.begin()
    foodSticks.begin()
    crumbsB.begin()
    sparksB.begin()
    // the bread: whole, crumbling as it is eaten, or coming back as a new slice
    const digesting = ev?.kind === 'bread'
    const sliceIn = ev?.kind === 'slice' ? span(0, 0.8, a) : 1
    breadG.visible = !!F.bread || (digesting && a < 1.2)
    breadG.scale.setScalar(Math.max(0.001, digesting ? 1 - span(0.1, 1.1, a) : sliceIn))
    if (digesting && a < 2) {
      const base = FOOD.bread.clone().add(V3(0, TABLE_Y + 0.3, 0))
      for (const s of crumbSeeds) {
        const u = a - 0.1
        if (u < 0) continue
        const p = V3(base.x + s.x + s.vx * u, base.y + s.y * 0.5 + s.vy * u - 2.5 * u * u, base.z + s.z + s.vz * u)
        if (p.y < TABLE_Y) continue
        crumbsB.ball(p, s.s * (1 - span(1.2, 2, a)), null)
      }
    }
    // the starch chain and the protein chain out of the bread, then broken into pieces that wait
    const chainK = digesting ? span(0.6, 2.6, a) : 1
    const breakK = digesting ? span(3.0, 4.2, a) : 1
    const from = FOOD.bread.clone().add(V3(0.1, TABLE_Y + 0.45, 0.2))
    // glucose: in the starch chain (a staircase of rings, each joined to the next through an oxygen), then
    // waiting, then on its way into the cell, to the nearer mitochondrion
    const glW = GL_WAIT.map((w, j) => {
      let p
      let q = qFace
      if (digesting) {
        if (a < 0.6) return null
        const inChain = from.clone().add(V3(0, 0.27 * j, 0.42 * j + 0.2))
        p = from.clone().lerp(inChain, chainK).lerp(w, breakK)
      } else if (F.gl[j]) p = w.clone().add(V3(0, Math.sin(t * 1.3 + j) * 0.03, 0))
      else if (ev?.kind === 'glucose' && ev.idx === j && a < 2.2) {
        const to = FOOD.cell.clone().add(MITO[0])
        const u = span(0, 1.8, a)
        p = w.clone().lerp(to, u)
        p.y += Math.sin(Math.PI * u) * 0.25
        q = spin(t, j)
      } else return null
      const s = digesting && a < 1.2 ? span(0.6, 1.2, a) : ev?.kind === 'glucose' && ev.idx === j ? 1 - span(1.7, 2.2, a) * 0.5 : 1
      return mol(GLU, p, q, s)
    })
    // amino acids: in the bread's protein chain, then waiting, then one by one into the ribosome
    const ribo = FOOD.cell.clone().add(RIBO)
    const building = ev?.kind === 'amino'
    const aaW = AA_WAIT.map((w, k) => {
      let p
      let q = qFace
      if (digesting) {
        if (a < 0.6) return null
        const inChain = from.clone().add(V3(0, -0.1 + (k % 2) * 0.08, 1.1 + 0.22 * k))
        p = from.clone().lerp(inChain, chainK).lerp(w, breakK)
      } else if (F.amino) p = w.clone().add(V3(0, Math.sin(t * 1.5 + k * 1.3) * 0.025, 0))
      else if (building && a < k * 0.45 + 1.0) {
        const u = span(k * 0.45, k * 0.45 + 1.0, a)
        p = w.clone().lerp(ribo, u)
        p.y += Math.sin(Math.PI * u) * 0.2
        q = spin(t, k)
      } else return null
      return mol(AMINO, p, q, digesting && a < 1.2 ? span(0.6, 1.2, a) : 1, new THREE.Color(SIDE[k]))
    })
    // the links of both chains, while they are still chains: O1 to the next ring's C4, C to the next N
    if (digesting && a > 0.6 && breakK < 0.96) {
      for (let j = 0; j < 3; j++) if (glW[j] && glW[j + 1]) foodSticks.stick(glW[j][6], glW[j + 1][3], 0.014, BOND)
      for (let k = 0; k < 5; k++) if (aaW[k] && aaW[k + 1]) foodSticks.stick(aaW[k][2], aaW[k + 1][0], 0.014, BOND)
    }
    // the protein built so far, growing out of the ribosome
    const arrived = building ? clamp(Math.floor((a - 1.0) / 0.45) + 1, 0, 6) : 6
    const shown = F.chain - (building ? 6 - arrived : 0)
    let prev = null
    for (let k = 0; k < shown; k++) {
      for (let j = 0; j < 3; j++) {
        const p = backboneAt(3 * k + j)
        foodAtoms.ball(p, j === 0 ? 0.048 : 0.053, j === 0 ? COL.N : COL.C)
        if (prev) foodSticks.stick(prev, p, 0.013, BOND)
        prev = p
        if (j === 1) {
          // the side chain, pointing out of the coil
          const out = p.clone().sub(ARC.o).setX(0).normalize()
          const sc = p.clone().addScaledVector(out, 0.1).add(V3(-0.04, 0, 0))
          foodAtoms.ball(sc, 0.058, new THREE.Color(SIDE[k % 6]))
          foodSticks.stick(p, sc, 0.013, BOND)
        }
      }
    }
    // carbon dioxide: out of the mitochondrion and up into the breath, gathering there, breathed out
    const burning = ev?.kind === 'glucose'
    const breathing = ev?.kind === 'breathe'
    const flying = burning && a > 2.2 ? 6 : 0
    const inCloud = breathing ? 0 : burning ? F.co2 - 6 + (a > 4.8 ? 6 : 0) : F.co2
    for (let k = 0; k < Math.max(0, inCloud); k++) {
      const ang = k * 2.4 + t * 0.3
      const p = FOOD.cloud.clone().add(V3(Math.cos(ang) * (0.18 + (k % 4) * 0.08), Math.sin(k * 1.7 + t * 0.5) * 0.15, Math.sin(ang) * (0.18 + (k % 3) * 0.1)))
      co2(p, spin(t, k), 1.35)
    }
    if (flying && a < 4.8) {
      const src = FOOD.cell.clone().add(MITO[0])
      for (let k = 0; k < 6; k++) {
        const u = span(2.2 + k * 0.12, 4.8, a)
        const p = src.clone().lerp(FOOD.cloud, u)
        p.x += Math.sin(u * Math.PI) * -0.6
        p.z += Math.sin(u * Math.PI * 2 + k) * 0.25
        co2(p, spin(t, k + 10), 1)
      }
      // the energy it gave: sparks
      if (a < 3.2) {
        for (let k = 0; k < 12; k++) {
          const u = (a - 2.2) / 1.0
          const dir = V3(Math.cos(k * 2.1), Math.sin(k * 1.3) * 0.8, Math.sin(k * 2.1)).normalize()
          sparksB.ball(src.clone().addScaledVector(dir, 0.1 + u * 0.4), 0.025 * (1 - u), null)
        }
      }
    }
    if (breathing && a < BREATHE_T) {
      const n = Math.min(24, ev.idx)
      for (let k = 0; k < n; k++) {
        const ang = k * 2.4
        const u = span(0, BREATHE_T, a)
        const p = FOOD.cloud.clone().add(V3(-0.6 * u - 2.5 * u * u, 0.4 * u + Math.sin(k) * 0.2, Math.cos(ang) * (0.25 + u * 1.2)))
        co2(p, spin(t, k), 1 - u * 0.6)
      }
    }
    // the cloud breathes at the rate of how hard you move; a breath out blows it small for a moment
    const bpm = breathsPerMin(F.act)
    const ph = Math.sin(t * TAU * (bpm / 60))
    const blow = breathing ? Math.sin(Math.PI * span(0, BREATHE_T, a)) : 0
    puffs.forEach((p, i) => p.m.scale.setScalar(p.s * (1 + 0.08 * ph + 0.04 * Math.sin(t * 0.7 + i)) * (1 - 0.35 * blow)))
    puffMat.opacity = 0.3 + 0.05 * ph
    membraneMat.uniforms.uTime.value = t
    mitoMat.emissiveIntensity = 0.25 + 0.15 * F.act + (burning && a > 1.8 && a < 2.8 ? 1.2 * Math.sin(Math.PI * span(1.8, 2.8, a)) : 0)
    // the names follow what is there
    glucoseTag.visible = !digesting && F.gl.some(Boolean)
    aminoTag.visible = !digesting && F.amino > 0
    const rt = `${moveName(F.act)}: ${rateText()}`
    if (rt !== shownRate) {
      shownRate = rt
      cloudRate.text = rt
      cloudRate.sync()
    }
    foodAtoms.end()
    foodSticks.end()
    crumbsB.end()
    sparksB.end()
  })

  // the stations' names, high over each
  const title = (text, color, p, rotY) => {
    const c = cardText(text, color, { size: 0.24, maxWidth: 4 })
    c.group.position.copy(p)
    c.group.rotation.y = rotY
    root.add(c.group)
    return c
  }
  title(E.recipe.label, RECIPE_C, V3(FIG.x, 4.5, FIG.z - 0.3), 0)
  title(E.dna.label, DNA_C, V3(DNA_AT.x + 0.2, 4.35, DNA_AT.z), Math.PI / 2)
  title(E.food.label, FOOD_C, V3(FOOD.cell.x + 0.3, 3.6, FOOD.cell.z - 0.5), -Math.PI / 2)

  updates.push((dt, t) => stage.update(t))

  return {
    env: { ...stage.env, bloom: { strength: 0.55, radius: 0.55, threshold: 0.84 } },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 9.2 },
    spawn: { x: 0, z: 6.4, yaw: 0 },
    hostSpot: { x: 1.9, z: 5.5, yaw: Math.atan2(1.9, -0.9) },
    back: { x: 0, z: 9.85, rot: Math.PI },
    stand: { x: -2.8, z: 5.3, rot: Math.atan2(2.8, 1.1) },
    parts: {
      recipe: {
        tap: thing => recipeStep(thing), // 'O' | 'C' | 'H' | 'N' | 'Ca' | 'P' | 'rest' (the jars), 'scale'
        weight: v => {
          setWeight(v, true)
          refresh(recipePanel)
        },
        get state() {
          return { w: R.w, el: R.el, n: R.n }
        },
        at: k => (k === 'scale' ? V3(FIG.x, PODIUM + 0.25, FIG.z + 0.62) : (j => V3(j.x, j.top * 0.6, j.z))(jars.find(j => j.e.k === k))),
      },
      dna: {
        tap: thing => dnaStep(thing), // 'zipper' (unzip), 'dna' (unzip, or send the copy away), 'carbon'
        carbon: (n, k) => dnaStep('carbon', [n, k]), // a nucleotide (0..7 the left strand) and its carbon (0..4: C1' to C5')
        get state() {
          return { phase: DN.phase, n: DN.n, away: DN.away, mark: DN.mark, busy: dnaBusy() }
        },
        carbonAt: (n, k) => atomW[n][SUGAR_C[k]].clone().applyMatrix4(dnaG.matrixWorld),
        zipperAt: () => zipper.getWorldPosition(V3(0, 0, 0)),
      },
      food: {
        tap: (thing, idx) => foodStep(thing, idx), // 'bread', 'glucose' (idx 0..3), 'amino', 'breathe', 'plate'
        act: v => setAct(v, true),
        get state() {
          return foodState()
        },
        at: thing => ({ bread: FOOD.bread.clone().add(V3(0, TABLE_Y + 0.3, 0)), glucose: GL_WAIT[0], amino: aaHit.position, breathe: FOOD.cloud, plate: FOOD.bread.clone().add(V3(0, TABLE_Y, 0)) })[thing].clone(),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { recipe: recipePanel, dna: dnaPanel, food: foodPanel },
    shared: {
      recipe: {
        get: () => ({ w: R.w, el: R.el, n: R.n, age: Math.min(30, Math.round((clock - R.at) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          R.w = clamp(Math.round(Number(s?.w) || 32), W_MIN, W_MAX)
          if (!live) R.shown = R.w
          const el = ELK.includes(s?.el) ? s.el : null
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          // (the stream plays only in its first seconds, so a state taken long ago shows as it stands)
          R.at = clock - clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 30)
          R.el = el
          R.n = n
          R.mine = false
          refresh(recipePanel)
        },
      },
      dna: {
        get: () => ({ phase: DN.phase, n: DN.n, away: DN.away, mark: DN.mark, age: Math.min(30, Math.round(dnaAge() * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const away = Math.max(0, Math.round(Number(s?.away) || 0))
          const phase = ['helix', 'copy', 'copied', 'away'].includes(s?.phase) ? s.phase : 'helix'
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          DN.away = away
          DN.n = n
          DN.mine = false
          DN.start = clock - age
          if (phase === 'copy' && age < COPY_T) {
            DN.phase = 'copy'
            DN.start = clock - age
            DN.sound = !!live
            DN.cue = Math.max(0, Math.ceil((age - 2.7) / 0.45))
            DN.said = age > COPY_T - 0.3
          } else if (phase === 'copy' || phase === 'copied') {
            DN.phase = 'copied'
            DN.start = clock - Math.max(age, COPY_T)
            DN.said = true
          } else if (phase === 'away' && age < AWAY_T) {
            DN.phase = 'away'
            DN.start = clock - age
          } else if (phase === 'away') {
            // it finished elsewhere: the copy is gone (the count of copies sent away is one more)
            DN.phase = 'helix'
            DN.away = away + 1
          } else {
            DN.phase = 'helix'
          }
          const mk = Array.isArray(s?.mark) ? s.mark.map(v => Math.round(Number(v))) : null
          const mark = mk && mk[0] >= 0 && mk[0] < NUCS.length && mk[1] >= 0 && mk[1] < SUGAR_C.length ? mk : null
          if (String(mark) !== String(DN.mark)) DN.markAt = live ? clock : clock - 5
          DN.mark = mark
          refresh(dnaPanel)
        },
      },
      food: {
        get: () => foodState(),
        set: (s, live, ago = 0) => {
          F.bread = s?.bread ? 1 : 0
          F.gl = [0, 1, 2, 3].map(j => (Array.isArray(s?.gl) && s.gl[j] ? 1 : 0))
          F.amino = s?.amino ? 6 : 0
          F.chain = clamp(Math.round(Number(s?.chain) || 0), 0, CHAIN_MAX)
          F.co2 = clamp(Math.round(Number(s?.co2) || 0), 0, 24)
          F.act = clamp(Number(s?.act) || 0)
          F.n = Math.max(0, Math.round(Number(s?.n) || 0))
          F.burned = Math.max(0, Math.round(Number(s?.burned) || 0))
          F.built = Math.max(0, Math.round(Number(s?.built) || 0))
          F.breaths = Math.max(0, Math.round(Number(s?.breaths) || 0))
          const kind = ['bread', 'glucose', 'amino', 'breathe', 'slice'].includes(s?.ev?.kind) ? s.ev.kind : null
          const age = clamp((Number(s?.ev?.age) || 0) + (Number(ago) || 0), 0, 60)
          if (kind) startEv(kind, clamp(Math.round(Number(s.ev.idx) || 0), 0, 24), age, !!live, false)
          else F.ev = null
          refresh(foodPanel)
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (weightSend) clearTimeout(weightSend)
      if (actSend) clearTimeout(actSend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const b of [jarBalls, streamBalls, atomsB, sticksB, hitsB, hbondB, foodAtoms, foodSticks, crumbsB, sparksB, ...Object.values(basesB)]) b.dispose()
      disposers.forEach(f => f())
    },
  }

  function foodState() {
    return {
      bread: F.bread,
      gl: [...F.gl],
      amino: F.amino ? 1 : 0,
      chain: F.chain,
      co2: F.co2,
      act: Math.round(F.act * 100) / 100,
      n: F.n,
      burned: F.burned,
      built: F.built,
      breaths: F.breaths,
      ev: F.ev ? { kind: F.ev.kind, idx: F.ev.idx, age: Math.min(60, Math.round(evAge() * 10) / 10) } : null,
    }
  }
}
