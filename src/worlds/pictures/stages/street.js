// A stage for picture rooms (docs/knowledge/picture-rooms.md): a small street at night. A road with its
// kerbs and markings, a pavement each side, terraced houses behind low garden walls (doors, windows, some
// of them lit, roofs and chimneys), a dark starry sky, and the street closed at both ends by planters and
// bollards, so the room is walked inside x0..x1 between the garden walls. Big surfaces mid-toned, since
// pale ones bloom to white.
//
// The street's own lamps are lit colour by colour, in the shader: each lamp's light is a share of sodium's
// yellow (589 nm), of neon's red (the glow a sodium lamp starts with) and of white. A surface under each
// share looks as bright as it reflects at that colour: its reflectance near 589 nm and near 640 nm is
// estimated from its colour with Smits' smooth spectra (B. Smits, "An RGB-to-spectrum conversion for
// reflectances", 1999), so under sodium light a red car looks mid-grey, a green leaf dark grey, a blue ball
// almost black and a yellow sign bright, all in sodium's one colour; white light shows their own colours.
// The scene sets up to three lamps (`lamps.set(i, { pos, na, ne, white })`) and makes its things with `paint`, so
// they are lit the same way. A material made by `paint` ignores three's point lights (the scene may add
// some for what is not painted, such as the Atomling) and sees the night sky's faint fill without
// colour, as the eye's rods do by moonlight; only the lamps bring colour, and only what their light has.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'

/** Where the street's parts are (metres). The road runs along x; the far side is at -z. */
export const STREET = {
  x0: -10.5, // the planters closing the street
  x1: 10.5,
  farFront: -8.2, // the house fronts
  farWall: -5.8, // the garden walls, the pavement's back
  farKerb: -3.6,
  nearKerb: 2.8,
  nearWall: 5.2,
  nearFront: 7.6,
  kerb: 0.12, // the pavements' height
  centre: -0.4, // the road's middle line
  len: 28, // how far the street goes on each way, into the fog
}

// The colours of the lamps' light, linear and scaled to a luminance of 1, so a share of 1 of any of them
// is as bright: sodium's deep yellow, neon's red-pink, a cool white LED.
const lum1 = hex => {
  const c = new THREE.Color(hex)
  return c.multiplyScalar(1 / (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b))
}
export const LIGHT = { na: lum1('#ffcf33'), ne: lum1('#ff4a5e'), white: lum1('#f4f6ff') }

const N_LAMPS = 3

// Smits' seven spectra (white, cyan, magenta, yellow, red, green, blue) at 589 nm and at 640 nm,
// interpolated from his ten bins between 380 and 720 nm
const GLSL = /* glsl */ `
uniform vec3 uLampPos[ ${N_LAMPS} ];
uniform vec3 uLampNa[ ${N_LAMPS} ];
uniform vec3 uLampNe[ ${N_LAMPS} ];
uniform vec3 uLampWhite[ ${N_LAMPS} ];
uniform float uGloss;
varying vec3 vSWorld;
// a reflectance at one wavelength from a linear RGB colour, by Smits' white, cyan, magenta, yellow,
// red, green and blue spectra there
float smitsAt( vec3 c, float W, float C, float M, float Y, float R, float G, float B ) {
  float v;
  if ( c.r <= c.g && c.r <= c.b ) {
    v = c.r * W;
    if ( c.g <= c.b ) v += ( c.g - c.r ) * C + ( c.b - c.g ) * B;
    else v += ( c.b - c.r ) * C + ( c.g - c.b ) * G;
  } else if ( c.g <= c.r && c.g <= c.b ) {
    v = c.g * W;
    if ( c.r <= c.b ) v += ( c.r - c.g ) * M + ( c.b - c.r ) * B;
    else v += ( c.b - c.g ) * M + ( c.r - c.b ) * R;
  } else {
    v = c.b * W;
    if ( c.r <= c.g ) v += ( c.r - c.b ) * Y + ( c.g - c.r ) * G;
    else v += ( c.g - c.b ) * Y + ( c.r - c.g ) * R;
  }
  return v;
}
`
const LIGHTING = /* glsl */ `
{
  // the street lamps, colour by colour: sodium's 589 nm, neon's red, white
  vec3 sN = inverseTransformDirection( normal, viewMatrix );
  vec3 sV = normalize( cameraPosition - vSWorld );
  vec3 alb = diffuseColor.rgb;
  // the night's own faint light (the sky's fill): by it alone the eye sees with its rods, which see no
  // colour, so it lights everything grey, a little blue
  float night = dot( reflectedLight.indirectDiffuse, vec3( 0.2126, 0.7152, 0.0722 ) );
  reflectedLight.indirectDiffuse = night * vec3( 0.78, 0.9, 1.3 );
  float r589 = smitsAt( alb, 1.0, 0.5515, 0.4667, 0.9998, 0.4429, 0.5322, 0.0002 );
  float r640 = smitsAt( alb, 1.0, 0.0183, 0.9808, 0.9634, 0.9936, 0.0201, 0.0324 );
  for ( int i = 0; i < ${N_LAMPS}; i ++ ) {
    vec3 sL = uLampPos[ i ] - vSWorld;
    float d2 = dot( sL, sL );
    sL *= inversesqrt( d2 );
    // the lantern sends nothing up and little sideways at its own height; its reflector throws more
    // light out than straight down, along the street
    float c = sL.y;
    float shape = smoothstep( 0.0, 0.35, c ) * ( 0.55 + 0.9 * ( 1.0 - c * c ) );
    // (softened within a couple of metres, as a lantern is no point: a post beside it is not blown out)
    float e = shape / ( d2 + 4.0 );
    float ndl = max( dot( sN, sL ), 0.0 );
    reflectedLight.directDiffuse += e * ndl * ( uLampNa[ i ] * r589 + uLampNe[ i ] * r640 + uLampWhite[ i ] * alb );
    if ( uGloss > 0.0 ) {
      float sp = pow( max( dot( sN, normalize( sL + sV ) ), 0.0 ), 60.0 ) * uGloss * ndl;
      reflectedLight.directSpecular += e * sp * ( uLampNa[ i ] + uLampNe[ i ] + uLampWhite[ i ] );
    }
  }
}
`
const WORLD = /* glsl */ `
vec4 sWorld = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
  sWorld = instanceMatrix * sWorld;
#endif
vSWorld = ( modelMatrix * sWorld ).xyz;
`
// three's own point lights left out of a painted material (its point-light loop never runs)
const NO_POINTS = () => THREE.ShaderChunk.lights_fragment_begin.replace('#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )', '#if 0')

/** The lamps' shared uniforms and the painted materials that read them. */
function streetLighting() {
  const U = {
    uLampPos: { value: Array.from({ length: N_LAMPS }, () => new THREE.Vector3(0, -100, 0)) },
    uLampNa: { value: Array.from({ length: N_LAMPS }, () => new THREE.Color(0, 0, 0)) },
    uLampNe: { value: Array.from({ length: N_LAMPS }, () => new THREE.Color(0, 0, 0)) },
    uLampWhite: { value: Array.from({ length: N_LAMPS }, () => new THREE.Color(0, 0, 0)) },
  }
  const patch = (shader, gloss) => {
    Object.assign(shader.uniforms, U, { uGloss: gloss })
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'varying vec3 vSWorld;\nvoid main() {')
      .replace('#include <project_vertex>', `#include <project_vertex>\n${WORLD}`)
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `${GLSL}\nvoid main() {`)
      .replace('#include <lights_fragment_begin>', NO_POINTS())
      .replace('#include <aomap_fragment>', `${LIGHTING}\n#include <aomap_fragment>`)
  }
  /** A material lit by the street lamps colour by colour (`gloss`: a highlight of the lamps' own colour,
   *  for paint and glass). Any MeshStandardMaterial option besides. */
  function paint(color = '#ffffff', { gloss = 0, ...opts } = {}) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts })
    const g = { value: gloss }
    m.userData.gloss = g
    m.onBeforeCompile = shader => patch(shader, g)
    m.customProgramCacheKey = () => 'ew-street-lamps-1'
    return m
  }
  /** Lamp i: where it is, and how much of each colour it gives (0 to a few). */
  function set(i, { pos, na = 0, ne = 0, white = 0 }) {
    if (pos) U.uLampPos.value[i].copy(pos)
    U.uLampNa.value[i].copy(LIGHT.na).multiplyScalar(na)
    U.uLampNe.value[i].copy(LIGHT.ne).multiplyScalar(ne)
    U.uLampWhite.value[i].copy(LIGHT.white).multiplyScalar(white)
  }
  return { paint, set }
}

// ---- textures ----

/** Old bricks in stretcher bond: 0.9 m by 0.9 m of wall (4 bricks a row, 12 courses). */
function brickTex(light) {
  const s = light ? 128 : 256
  const rnd = random(23)
  return canvasTex(s, s, (g, w, h) => {
    g.fillStyle = '#6e665c'
    g.fillRect(0, 0, w, h)
    const rows = 12
    const bh = h / rows
    const bw = w / 4
    const j = Math.max(1, s / 110)
    for (let r = 0; r < rows; r++) {
      const shift = r % 2 ? bw / 2 : 0
      for (let c = -1; c < 5; c++) {
        const v = 0.78 + rnd() * 0.32
        const burnt = rnd() < 0.12 ? 0.7 : 1
        g.fillStyle = `rgb(${150 * v * burnt},${74 * v * burnt},${56 * v * burnt})`
        g.fillRect(c * bw + shift + j, r * bh + j, bw - 2 * j, bh - 2 * j)
      }
    }
    for (let i = 0; i < s * 6; i++) {
      g.fillStyle = `rgba(${rnd() < 0.5 ? '40,30,26' : '190,150,120'},${0.08 + rnd() * 0.12})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** Paving slabs 0.6 m square, a 1.2 m tile. */
function paveTex(light) {
  const s = light ? 128 : 256
  const rnd = random(41)
  return canvasTex(s, s, (g, w, h) => {
    g.fillStyle = '#4e4c48'
    g.fillRect(0, 0, w, h)
    const j = Math.max(1, s / 120)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const v = 112 + rnd() * 22
        g.fillStyle = `rgb(${v + 4},${v + 2},${v - 4})`
        g.fillRect(c * (w / 2) + j, r * (h / 2) + j, w / 2 - 2 * j, h / 2 - 2 * j)
      }
    }
    for (let i = 0; i < s * 10; i++) {
      const v = 70 + rnd() * 90
      g.fillStyle = `rgba(${v},${v},${v - 6},${0.1 + rnd() * 0.15})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** Asphalt, a 2 m tile: dark grey with lighter stones. */
function roadTex(light) {
  const s = light ? 128 : 256
  const rnd = random(7)
  return canvasTex(s, s, (g, w, h) => {
    g.fillStyle = '#4a4a4e'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < s * 14; i++) {
      const v = 40 + rnd() * 70
      g.fillStyle = `rgba(${v},${v},${v + 4},${0.25 + rnd() * 0.35})`
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.5, 1 + rnd() * 1.5)
    }
  }, { repeat: true })
}

/** Curtains half drawn across a lit window. */
function curtainTex() {
  return canvasTex(64, 64, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#f2c27a')
    grd.addColorStop(1, '#d99a52')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(120,52,30,0.85)'
    g.fillRect(0, 0, w * 0.22, h)
    g.fillRect(w * 0.78, 0, w * 0.22, h)
    g.fillStyle = 'rgba(80,30,20,0.35)'
    for (const x of [0.06, 0.13, 0.84, 0.92]) g.fillRect(x * w, 0, 2, h)
  })
}

// ---- geometry ----

/** A plane (facing +z) with UVs in metres over a tile of `tile` metres. */
function metrePlane(w, h, tile = 1) {
  const geo = new THREE.PlaneGeometry(w, h)
  const uv = geo.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * h) / tile)
  return geo
}
/** A box whose faces have UVs in metres (for brick). */
function metreBox(w, h, d, tile = 0.9) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const uv = geo.attributes.uv
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
  for (let i = 0; i < uv.count; i++) {
    const [a, b] = dims[Math.floor(i / 4)]
    uv.setXY(i, (uv.getX(i) * a) / tile, (uv.getY(i) * b) / tile)
  }
  return geo
}
/** One colour on every vertex (for the materials that take vertex colours). */
function tint(geo, hex) {
  const c = new THREE.Color(hex)
  const n = geo.attributes.position.count
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3)
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3))
  return geo
}

/** Collects geometry per material and merges each into one mesh (a whole terrace is a few draws). */
function batcher() {
  const lists = new Map()
  const tmp = new THREE.Matrix4()
  return {
    put(mat, geo, matrix, local) {
      const g = geo.index ? geo.toNonIndexed() : geo
      if (geo !== g) geo.dispose()
      if (local) g.applyMatrix4(local)
      if (matrix) g.applyMatrix4(tmp.copy(matrix))
      if (!lists.has(mat)) lists.set(mat, [])
      lists.get(mat).push(g)
    },
    build(group, geos) {
      for (const [mat, list] of lists) {
        const merged = mergeGeometries(list)
        for (const g of list) g.dispose()
        const mesh = new THREE.Mesh(merged, mat)
        group.add(mesh)
        geos.push(merged)
      }
      lists.clear()
    },
  }
}

const at = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z)

// the houses' colours: rendered walls in soft paint, front doors in strong colours
const RENDER = ['#bfae8e', '#8fa3b0', '#c49a8f', '#a3ad8a', '#c9b98f', '#9a8fae']
const DOORS = ['#b3202a', '#1d4fa8', '#1f7a3a', '#e0b21c', '#262a33', '#2a8c8c', '#7a2a6e', '#d8d2c4']
const FRAME = '#cfcabd'
const STONE = '#8e8980'

/**
 * The street. `shop`: x of a house on the far side whose ground floor is a shop built out over its front
 * garden (its fascia, for the scene's sign, comes back as `shop`). `light`: fewer stars, smaller
 * textures. `farLamps`: dim sodium lamps glowing down the street beyond the planters.
 */
export function streetStage({ light = false, pixelRatio = 1, shop = null, farLamps = true } = {}) {
  const S = STREET
  const group = new THREE.Group()
  const disposers = []
  const geos = []
  const textures = []
  const lighting = streetLighting()
  const { paint } = lighting

  // ---- materials (few kinds: they share one program) ----
  const bt = brickTex(light)
  const pt = paveTex(light)
  const rt = roadTex(light)
  const ct = curtainTex()
  textures.push(bt, pt, rt, ct)
  const M = {
    brick: paint('#ffffff', { map: bt, roughness: 0.92 }),
    pave: paint('#ffffff', { map: pt, roughness: 0.9 }),
    road: paint('#ffffff', { map: rt, roughness: 0.88 }),
    // anything painted one colour per part: walls, doors, frames, roofs, kerbs, lines
    paint: paint('#ffffff', { vertexColors: true, roughness: 0.8 }),
    glass: paint('#1b2236', { roughness: 0.12, gloss: 0.6 }),
    lit: new THREE.MeshBasicMaterial({ map: ct, color: '#d8c2a8' }),
  }
  const b = batcher()

  // ---- the ground: road, kerbs, pavements, front gardens ----
  const L = S.len
  {
    const roadW = S.nearKerb - S.farKerb
    const road = metrePlane(2 * L, roadW, 2).rotateX(-Math.PI / 2)
    b.put(M.road, road, at(0, 0, (S.farKerb + S.nearKerb) / 2))
    // the pavements
    for (const [z0, z1] of [[S.farWall, S.farKerb], [S.nearKerb, S.nearWall]]) {
      const p = metrePlane(2 * L, z1 - z0, 1.2).rotateX(-Math.PI / 2)
      b.put(M.pave, p, at(0, S.kerb, (z0 + z1) / 2))
    }
    // kerbstones
    for (const [z, s] of [[S.farKerb, -1], [S.nearKerb, 1]]) {
      b.put(M.paint, tint(new THREE.BoxGeometry(2 * L, S.kerb, 0.16), '#8a8780'), at(0, S.kerb / 2, z + s * 0.08))
    }
    // the white line down the middle, dashed, and yellow lines along the near kerb (no waiting)
    for (let x = -L + 1; x < L; x += 4.5) {
      b.put(M.paint, tint(new THREE.PlaneGeometry(2.4, 0.12).rotateX(-Math.PI / 2), '#cfcfc6'), at(x, 0.006, S.centre))
    }
    for (const dz of [0.25, 0.45]) {
      b.put(M.paint, tint(new THREE.PlaneGeometry(2 * L, 0.08).rotateX(-Math.PI / 2), '#d9a81c'), at(0, 0.006, S.nearKerb - dz))
    }
    // the gardens behind the walls: dark lawns
    for (const [z0, z1] of [[S.farFront, S.farWall], [S.nearWall, S.nearFront]]) {
      b.put(M.paint, tint(new THREE.PlaneGeometry(2 * L, z1 - z0).rotateX(-Math.PI / 2), '#2e4630'), at(0, S.kerb - 0.01, (z0 + z1) / 2))
    }
  }

  // ---- the houses: a terrace each side, 5.2 m to a house ----
  const HW = 5.2
  const EAVES = 5.6
  const RIDGE = 7.6
  const DEPTH = 7
  const rnd = random(5)
  let shopAt = null
  /** One house, its front at local z = 0 facing +z, centred on x = 0; `m` places it. */
  function house(m, i, { far }) {
    const brick = (i + (far ? 1 : 0)) % 2 === 0
    const wall = RENDER[Math.floor(rnd() * RENDER.length)]
    const door = DOORS[Math.floor(rnd() * DOORS.length)]
    const flip = i % 2 ? -1 : 1
    const isShop = far && shop != null && Math.abs(m.elements[12] - shop) < 0.1
    // the body (its sides and back, rarely seen) and its front
    b.put(M.paint, tint(new THREE.BoxGeometry(HW, EAVES, DEPTH), brick ? '#6e4034' : wall), m, at(0, EAVES / 2, -DEPTH / 2 - 0.02))
    if (brick) b.put(M.brick, metrePlane(HW, EAVES, 0.9), m, at(0, EAVES / 2, 0.005))
    else b.put(M.paint, tint(new THREE.PlaneGeometry(HW, EAVES), wall), m, at(0, EAVES / 2, 0.005))
    // the roof, slate, ridge along the street
    const shape = new THREE.Shape([new THREE.Vector2(-0.35, EAVES), new THREE.Vector2(DEPTH / 2, RIDGE), new THREE.Vector2(DEPTH + 0.35, EAVES)])
    const roof = new THREE.ExtrudeGeometry(shape, { depth: HW + 0.02, bevelEnabled: false }).rotateY(Math.PI / 2).translate(-HW / 2 - 0.01, 0, 0)
    b.put(M.paint, tint(roof, '#3c4048'), m)
    // a chimney on the party wall, with two pots
    b.put(M.brick, metreBox(0.62, 1.5, 0.9), m, at(HW / 2, RIDGE + 0.1, -DEPTH / 2))
    for (const dx of [-0.14, 0.14]) b.put(M.paint, tint(new THREE.CylinderGeometry(0.08, 0.1, 0.36, 8), '#8a4a32'), m, at(HW / 2 + dx, RIDGE + 1.03, -DEPTH / 2))
    // the windows: two upstairs, one down; a lit one now and then
    const win = (x, y, w, h) => {
      const on = rnd() < 0.3
      const glass = new THREE.PlaneGeometry(w - 0.1, h - 0.1)
      b.put(on ? M.lit : M.glass, glass, m, at(x, y + h / 2, 0.03))
      const f = 0.07
      for (const [bw, bh, bx, by] of [[w, f, 0, h - f / 2], [w, f, 0, f / 2], [f, h, -w / 2 + f / 2, h / 2], [f, h, w / 2 - f / 2, h / 2], [f * 0.7, h, 0, h / 2], [w, f * 0.7, 0, h * 0.68]]) {
        b.put(M.paint, tint(new THREE.BoxGeometry(bw, bh, 0.08), FRAME), m, at(x + bx, y + by, 0.06))
      }
      b.put(M.paint, tint(new THREE.BoxGeometry(w + 0.2, 0.08, 0.2), STONE), m, at(x, y - 0.04, 0.1))
      b.put(M.paint, tint(new THREE.BoxGeometry(w + 0.2, 0.16, 0.06), STONE), m, at(x, y + h + 0.08, 0.04))
    }
    win(-1.2, 3.35, 1.1, 1.35)
    win(1.2, 3.35, 1.1, 1.35)
    if (!isShop) {
      win(flip * 1.05, 0.95, 1.7, 1.45)
      // the front door: a colour of its own, a fanlight, a step, a brass knob
      const dx = -flip * 1.35
      b.put(M.paint, tint(new THREE.BoxGeometry(0.98, 2.1, 0.06), door), m, at(dx, 1.05 + 0.12, 0.04))
      for (const [bw, bh, bx, by] of [[1.2, 0.1, 0, 2.62], [0.1, 2.58, -0.55, 1.33], [0.1, 2.58, 0.55, 1.33], [1.0, 0.06, 0, 2.25]]) {
        b.put(M.paint, tint(new THREE.BoxGeometry(bw, bh, 0.09), FRAME), m, at(dx + bx, by, 0.05))
      }
      b.put(M.glass, new THREE.PlaneGeometry(0.98, 0.3), m, at(dx, 2.42, 0.035))
      b.put(M.paint, tint(new THREE.BoxGeometry(1.3, 0.16, 0.45), STONE), m, at(dx, 0.08 + 0.08, 0.2))
      b.put(M.paint, tint(new THREE.BoxGeometry(0.06, 0.06, 0.06), '#c8a24a'), m, at(dx + 0.35 * flip, 1.1, 0.1))
      // the path to it and the garden wall, with a gap for the gate
      const depth = far ? S.farWall - S.farFront : S.nearFront - S.nearWall
      b.put(M.pave, metrePlane(1.1, depth, 1.2).rotateX(-Math.PI / 2), m, at(dx, S.kerb + 0.004, depth / 2))
      const gap = [dx - 0.6, dx + 0.6]
      for (const [a0, a1] of [[-HW / 2, gap[0]], [gap[1], HW / 2]]) {
        b.put(M.brick, metreBox(a1 - a0, 0.72, 0.24), m, at((a0 + a1) / 2, S.kerb + 0.36, depth - 0.12))
        b.put(M.paint, tint(new THREE.BoxGeometry(a1 - a0, 0.07, 0.32), STONE), m, at((a0 + a1) / 2, S.kerb + 0.755, depth - 0.12))
      }
      for (const gx of gap) b.put(M.brick, metreBox(0.32, 0.95, 0.32), m, at(gx + (gx < dx ? -0.16 : 0.16), S.kerb + 0.47, depth - 0.12))
    } else {
      // the shop, built out over the front garden: one storey, a flat roof, a big window and a door
      const depth = S.farWall - S.farFront
      const SH = 3.7
      b.put(M.paint, tint(new THREE.BoxGeometry(HW, SH, depth), '#5a5148'), m, at(0, SH / 2, depth / 2))
      b.put(M.paint, tint(new THREE.BoxGeometry(HW + 0.1, 0.12, depth + 0.1), '#3a3a40'), m, at(0, SH + 0.06, depth / 2))
      // the window, dimly lit within, and the door
      b.put(M.lit, new THREE.PlaneGeometry(2.9, 1.9), m, at(-0.75, 0.5 + 0.95, depth + 0.01))
      b.put(M.paint, tint(new THREE.BoxGeometry(1.0, 2.3, 0.06), '#262a33'), m, at(1.75, 1.15 + 0.12, depth + 0.02))
      for (const [bw, bh, bx, by] of [[3.1, 0.1, -0.75, 2.45], [3.1, 0.5, -0.75, 0.25], [0.1, 2.5, -2.25, 1.25], [0.1, 2.5, 0.75, 1.25], [0.1, 2.5, 2.3, 1.25]]) {
        b.put(M.paint, tint(new THREE.BoxGeometry(bw, bh, 0.12), '#3a3530'), m, at(bx, by, depth + 0.04))
      }
      shopAt = { x: m.elements[12], z: S.farWall, y: 3.05, w: HW - 0.6, h: 0.72 }
    }
  }
  for (const [far, z] of [[true, S.farFront], [false, S.nearFront]]) {
    let i = far ? 0 : 1
    for (let x = -L + HW / 2; x < L; x += HW, i++) {
      const m = far ? at(x, 0, z) : at(x, 0, z).multiply(new THREE.Matrix4().makeRotationY(Math.PI))
      house(m, i, { far })
    }
  }

  // ---- the street closed at both ends: planters on the pavements, bollards across the road ----
  const shrub = paint('#2c5233', { roughness: 0.95, flatShading: true })
  for (const x of [S.x0 - 0.3, S.x1 + 0.3]) {
    for (const [z0, z1] of [[S.farWall, S.farKerb], [S.nearKerb, S.nearWall]]) {
      const zc = (z0 + z1) / 2
      b.put(M.paint, tint(new THREE.BoxGeometry(0.9, 0.62, z1 - z0 - 0.2), '#6a4a34'), at(x, S.kerb + 0.31, zc))
      for (let k = 0; k < 3; k++) {
        const bush = new THREE.IcosahedronGeometry(0.42, 0)
        bush.scale(1, 0.8, 1)
        b.put(shrub, bush, at(x + (k % 2 ? 0.1 : -0.1), S.kerb + 0.85, zc + (k - 1) * 0.62))
      }
    }
    for (let z = S.farKerb + 0.6; z < S.nearKerb - 0.3; z += 1.25) {
      b.put(M.paint, tint(new THREE.CylinderGeometry(0.1, 0.11, 0.95, 12), '#2a2c30'), at(x, 0.475, z))
      b.put(M.paint, tint(new THREE.CylinderGeometry(0.105, 0.105, 0.09, 12), '#d6d4cc'), at(x, 0.78, z))
    }
  }

  b.build(group, geos)

  // ---- far down the street: sodium lamps glowing in the fog ----
  if (farLamps) {
    const post = paint('#2c3a34', { roughness: 0.6 })
    const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb02a').multiplyScalar(1.6) })
    const halo = canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,190,80,0.55)')
      grd.addColorStop(1, 'rgba(255,170,40,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    })
    textures.push(halo)
    const haloMat = new THREE.SpriteMaterial({ map: halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true })
    for (const [x, z] of [[-17, S.farKerb - 0.45], [-24, S.nearKerb + 0.45], [17.5, S.nearKerb + 0.45], [24, S.farKerb - 0.45]]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 5.2, 8), post)
      p.position.set(x, 2.6, z)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.3), glow)
      head.position.set(x, 5.3, z + (z < 0 ? 0.5 : -0.5))
      const h = new THREE.Sprite(haloMat)
      h.position.copy(head.position)
      h.scale.setScalar(3)
      group.add(p, head, h)
    }
  }

  // ---- the sky, the moon's faint light, the fog ----
  const stars = nightSky({ radius: 400, stars: light ? 900 : 2000, top: '#04061a', mid: '#12153e', horizon: '#2a2650', pixelRatio })
  group.add(stars)
  // the sky's faint fill (painted things see it without colour, as the eye's rods would)
  group.add(new THREE.HemisphereLight('#4a5a8c', '#141216', light ? 0.6 : 0.5))

  // the walls round the walking space: the garden walls and the planters at the ends (the third-person
  // camera comes in front of them, so a station stands a few metres off them)
  const solids = [
    box(0, S.farWall - 0.15, 2 * L, 0.5),
    box(0, S.nearWall + 0.15, 2 * L, 0.5),
    box(S.x0 - 0.3, (S.farWall + S.nearWall) / 2, 1.0, S.nearWall - S.farWall),
    box(S.x1 + 0.3, (S.farWall + S.nearWall) / 2, 1.0, S.nearWall - S.farWall),
  ]
  const floor = (x, z) => (z <= S.farKerb || z >= S.nearKerb ? S.kerb : 0)

  disposers.push(() => {
    for (const t of textures) t.dispose()
    for (const g of geos) g.dispose()
  })
  return {
    group,
    solids,
    floor,
    paint,
    lamps: { set: lighting.set },
    shop: shopAt,
    env: {
      background: new THREE.Color('#070a1c'),
      fog: new THREE.Fog('#0d1028', 16, 60),
      exposure: 1.0,
      envIntensity: 0.08,
      bloom: { strength: 0.55, radius: 0.45, threshold: 0.9 },
      fov: 60,
    },
    cameraBounds: { minX: S.x0 + 0.3, maxX: S.x1 - 0.3, minY: 0.4, maxY: 8, minZ: S.farWall + 0.35, maxZ: S.nearWall - 0.35 },
    update(t) {
      stars.userData.update?.(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
