// Carbon's picture "The carbon in the sky" as a room (docs/knowledge/picture-rooms.md): a mountain observatory
// high above the clouds, Mauna Loa in Hawaii, where the air's CO2 has been measured since 1958 (the summit
// stage, stages/summit.js, at night: dark cinder, red path lamps, a sea of clouds below on every side, the
// Milky Way, Maunakea's domes far to the north). Three things to do, each step chosen by tapping its thing
// (the user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E opens
// the station's panel, whose buttons and slider do the same:
// - the window in time: a hut's window looks 300 million years back into a Carboniferous swamp forest
//   (giant club mosses, Sigillaria, Calamites, a tree fern, a griffinfly) beside a shallow sea; a cut
//   through the ground under it shows the peat. Tap a giant club moss and it falls into the swamp (the peat
//   thickens), tap the sea and plankton snow down into the mud; the time dial (a slider) presses time: sand
//   and mud bury the swamp, the peat is squeezed into brown coal and then coal, the sea mud into black shale
//   that gives oil and gas, trapped under a dome; tap the seam and a block of coal comes out onto a stand,
//   tap the oil and a flask of it;
// - the Keeling curve: the observatory's wall carries the record from March 1958 on, NOAA's monthly means
//   (below); tap the analyser and air from the tower's intake runs down to it while the curve is drawn to
//   today; tap the little tree for one year up close (leaves out, the line dips; leaves fall, it comes
//   back); tap the ice core for the line at about 280 ppm before factories. A slider goes through the years;
// - the blanket: a model of the ground glowing with infrared under a glass column of air. Tap the chimney:
//   burning coal sends a CO2 molecule up; CO2 catches the heat light, wobbles (its bend) and sends it on in
//   any direction, part of it back down; tap a CO2 to watch a catch, a nitrogen or oxygen pair to watch the
//   light pass; a thermometer warms a little with each CO2. Tap the wind turbine or the solar panels (the
//   chimney stops) or the trees (one takes a CO2 back). A slider sets the CO2.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes; parts.rayTo(point) aims a real tap.
//
// Facts (checked 2026-10-30): Mauna Loa Observatory 3397 m; Keeling's record from March 1958 (315.71 ppm);
// NOAA's annual mean for 2025 427.35 ppm; May 2026 432.34 (NOAA), 432.0 (Scripps); the seasonal cycle about
// 5 to 6 ppm, highest in May, lowest in September or October; about 280 ppm before the industrial era (Law
// Dome); the Carboniferous 358.9 to 298.9 million years ago (ICS); CO2's bend at 667 cm-1 (about 15 µm). The
// diorama's trees are drawn smaller than life (the real ones stood 30 m and more), the griffinfly at its size.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, clamp, lerp, damp, random, hdr, num } from '../../../wings/noble/kit.js'
import { summitStage } from '../../stages/summit.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { SKY_WORDS } from './sky.words.js'

export const WORDS = SKY_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// CO2 at Mauna Loa, monthly means in ppm (NOAA GML, co2_mm_mlo.txt of 9 October 2026; March 1958 to April
// 1974 measured by Scripps; a few early months filled in by NOAA): [year, first month, values...]
const DATA = [
  [1958, 3, 315.71, 317.45, 317.51, 317.27, 315.87, 314.93, 313.21, 312.42, 313.33, 314.67],
  [1959, 1, 315.58, 316.49, 316.65, 317.72, 318.29, 318.15, 316.54, 314.80, 313.84, 313.33, 314.81, 315.58],
  [1960, 1, 316.43, 316.98, 317.58, 319.03, 320.03, 319.58, 318.18, 315.90, 314.17, 313.83, 315.00, 316.19],
  [1961, 1, 316.89, 317.70, 318.54, 319.48, 320.58, 319.77, 318.56, 316.79, 314.99, 315.31, 316.10, 317.01],
  [1962, 1, 317.94, 318.55, 319.68, 320.57, 321.02, 320.62, 319.61, 317.40, 316.24, 315.42, 316.69, 317.70],
  [1963, 1, 318.74, 319.07, 319.86, 321.38, 322.24, 321.49, 319.74, 317.77, 316.21, 315.99, 317.07, 318.35],
  [1964, 1, 319.57, 320.04, 320.75, 321.84, 322.25, 321.89, 320.44, 318.69, 316.71, 316.87, 317.68, 318.71],
  [1965, 1, 319.44, 320.44, 320.89, 322.14, 322.17, 321.87, 321.21, 318.87, 317.82, 317.30, 318.87, 319.42],
  [1966, 1, 320.62, 321.60, 322.39, 323.70, 324.08, 323.75, 322.37, 320.36, 318.64, 318.10, 319.78, 321.02],
  [1967, 1, 322.33, 322.50, 323.03, 324.41, 325.00, 324.09, 322.54, 320.92, 319.25, 319.39, 320.73, 321.96],
  [1968, 1, 322.57, 323.15, 323.89, 325.02, 325.57, 325.36, 324.14, 322.11, 320.33, 320.25, 321.32, 322.89],
  [1969, 1, 324.00, 324.41, 325.63, 326.66, 327.38, 326.71, 325.88, 323.66, 322.38, 321.78, 322.85, 324.11],
  [1970, 1, 325.06, 325.99, 326.93, 328.13, 328.08, 327.67, 326.34, 324.68, 323.10, 323.06, 324.01, 325.13],
  [1971, 1, 326.17, 326.69, 327.18, 327.78, 328.93, 328.57, 327.36, 325.43, 323.36, 323.56, 324.80, 326.01],
  [1972, 1, 326.77, 327.63, 327.75, 329.72, 330.07, 329.09, 328.04, 326.32, 324.84, 325.20, 326.50, 327.55],
  [1973, 1, 328.55, 329.57, 330.30, 331.50, 332.48, 332.07, 330.87, 329.31, 327.52, 327.19, 328.17, 328.65],
  [1974, 1, 329.36, 330.71, 331.49, 332.65, 333.19, 332.20, 331.07, 329.15, 327.33, 327.28, 328.31, 329.58],
  [1975, 1, 330.73, 331.46, 331.94, 333.11, 333.95, 333.42, 331.97, 329.95, 328.49, 328.36, 329.38, 330.77],
  [1976, 1, 331.56, 332.74, 333.36, 334.74, 334.72, 333.97, 333.08, 330.68, 328.96, 328.72, 330.16, 331.62],
  [1977, 1, 332.68, 333.17, 334.96, 336.14, 336.93, 336.17, 334.89, 332.56, 331.29, 331.28, 332.46, 333.60],
  [1978, 1, 334.94, 335.26, 336.66, 337.69, 338.02, 338.01, 336.50, 334.42, 332.36, 332.45, 333.76, 334.91],
  [1979, 1, 336.14, 336.69, 338.27, 338.82, 339.24, 339.26, 337.54, 335.72, 333.97, 334.24, 335.32, 336.81],
  [1980, 1, 337.90, 338.34, 340.07, 340.93, 341.45, 341.36, 339.45, 337.67, 336.25, 336.14, 337.30, 338.29],
  [1981, 1, 339.29, 340.55, 341.63, 342.60, 343.04, 342.54, 340.82, 338.48, 336.95, 337.05, 338.58, 339.91],
  [1982, 1, 340.93, 341.76, 342.78, 343.96, 344.77, 343.88, 342.42, 340.24, 338.37, 338.41, 339.44, 340.78],
  [1983, 1, 341.57, 342.78, 343.37, 345.40, 346.14, 345.76, 344.32, 342.51, 340.46, 340.53, 341.79, 343.20],
  [1984, 1, 344.21, 344.92, 345.68, 347.37, 347.77, 347.16, 345.79, 343.74, 341.59, 341.86, 343.31, 345.00],
  [1985, 1, 345.48, 346.41, 347.91, 348.66, 349.28, 348.65, 346.90, 345.26, 343.47, 343.35, 344.73, 346.12],
  [1986, 1, 346.78, 347.48, 348.25, 349.86, 350.52, 349.98, 348.25, 346.17, 345.48, 344.82, 346.22, 347.48],
  [1987, 1, 348.73, 348.92, 349.81, 351.40, 352.15, 351.58, 350.21, 348.20, 346.66, 346.72, 348.08, 349.28],
  [1988, 1, 350.51, 351.70, 352.50, 353.67, 354.35, 353.88, 352.80, 350.49, 348.97, 349.37, 350.42, 351.62],
  [1989, 1, 353.07, 353.43, 354.08, 355.72, 355.95, 355.44, 354.05, 351.84, 350.09, 350.33, 351.55, 352.91],
  [1990, 1, 353.86, 355.10, 355.75, 356.38, 357.38, 356.39, 354.89, 353.06, 351.38, 351.69, 353.14, 354.41],
  [1991, 1, 354.93, 355.82, 357.33, 358.77, 359.23, 358.23, 356.30, 353.97, 352.34, 352.43, 353.89, 355.21],
  [1992, 1, 356.34, 357.21, 357.97, 359.22, 359.71, 359.44, 357.15, 354.99, 353.01, 353.40, 354.42, 355.68],
  [1993, 1, 357.10, 357.42, 358.59, 359.39, 360.30, 359.64, 357.45, 355.76, 354.14, 354.23, 355.53, 357.03],
  [1994, 1, 358.36, 359.04, 360.11, 361.36, 361.78, 360.94, 359.51, 357.59, 355.86, 356.21, 357.65, 359.10],
  [1995, 1, 360.04, 361.00, 361.98, 363.44, 363.83, 363.33, 361.78, 359.33, 358.32, 358.14, 359.61, 360.82],
  [1996, 1, 362.20, 363.36, 364.28, 364.69, 365.25, 365.06, 363.69, 361.55, 359.69, 359.72, 361.04, 362.39],
  [1997, 1, 363.24, 364.21, 364.65, 366.49, 366.77, 365.73, 364.46, 362.40, 360.44, 360.97, 362.65, 364.51],
  [1998, 1, 365.39, 366.10, 367.36, 368.79, 369.56, 369.13, 367.98, 366.10, 364.16, 364.54, 365.67, 367.30],
  [1999, 1, 368.35, 369.28, 369.84, 371.15, 371.12, 370.46, 369.61, 367.06, 364.95, 365.52, 366.88, 368.26],
  [2000, 1, 369.45, 369.71, 370.75, 371.98, 371.75, 371.87, 370.02, 368.27, 367.15, 367.18, 368.53, 369.83],
  [2001, 1, 370.76, 371.69, 372.63, 373.55, 374.03, 373.40, 371.68, 369.78, 368.34, 368.61, 369.94, 371.42],
  [2002, 1, 372.70, 373.37, 374.30, 375.19, 375.93, 375.69, 374.16, 372.03, 370.92, 370.73, 372.43, 373.98],
  [2003, 1, 375.07, 375.82, 376.64, 377.92, 378.78, 378.46, 376.88, 374.57, 373.34, 373.31, 374.84, 376.17],
  [2004, 1, 377.17, 378.05, 379.06, 380.54, 380.80, 379.87, 377.65, 376.17, 374.43, 374.63, 376.33, 377.68],
  [2005, 1, 378.63, 379.91, 380.95, 382.48, 382.64, 382.40, 380.93, 378.93, 376.89, 377.19, 378.54, 380.31],
  [2006, 1, 381.58, 382.40, 382.86, 384.80, 385.22, 384.24, 382.65, 380.60, 379.04, 379.33, 380.35, 382.02],
  [2007, 1, 383.10, 384.12, 384.81, 386.73, 386.78, 386.33, 384.73, 382.24, 381.20, 381.37, 382.70, 384.19],
  [2008, 1, 385.78, 386.06, 386.28, 387.33, 388.78, 387.99, 386.62, 384.32, 383.41, 383.22, 384.41, 385.79],
  [2009, 1, 387.17, 387.70, 389.04, 389.76, 390.36, 389.70, 388.24, 386.29, 384.95, 384.64, 386.23, 387.63],
  [2010, 1, 388.91, 390.41, 391.37, 392.67, 393.21, 392.38, 390.41, 388.54, 387.03, 387.43, 388.87, 389.99],
  [2011, 1, 391.50, 392.05, 392.80, 393.44, 394.41, 393.95, 392.72, 390.33, 389.28, 389.19, 390.48, 392.06],
  [2012, 1, 393.31, 394.04, 394.59, 396.38, 396.93, 395.91, 394.56, 392.59, 391.32, 391.27, 393.20, 394.57],
  [2013, 1, 395.78, 397.03, 397.66, 398.64, 400.02, 398.81, 397.51, 395.39, 393.72, 393.90, 395.36, 397.03],
  [2014, 1, 398.04, 398.27, 399.91, 401.51, 401.96, 401.43, 399.27, 397.18, 395.54, 396.16, 397.40, 399.08],
  [2015, 1, 400.18, 400.55, 401.74, 403.35, 404.15, 402.97, 401.46, 399.11, 397.82, 398.49, 400.27, 402.06],
  [2016, 1, 402.73, 404.25, 405.06, 407.60, 407.90, 406.99, 404.59, 402.45, 401.23, 401.79, 403.72, 404.64],
  [2017, 1, 406.36, 406.66, 407.54, 409.22, 409.89, 409.08, 407.33, 405.32, 403.57, 403.82, 405.31, 407.00],
  [2018, 1, 408.15, 408.52, 409.59, 410.45, 411.44, 410.99, 408.90, 407.16, 405.71, 406.19, 408.21, 409.27],
  [2019, 1, 411.03, 411.96, 412.18, 413.54, 414.86, 414.15, 411.96, 410.17, 408.76, 408.74, 410.47, 411.97],
  [2020, 1, 413.59, 414.32, 414.72, 416.42, 417.28, 416.58, 414.58, 412.75, 411.50, 411.49, 413.10, 414.23],
  [2021, 1, 415.49, 416.72, 417.61, 419.01, 419.09, 418.93, 416.90, 414.42, 413.26, 413.90, 414.97, 416.67],
  [2022, 1, 418.13, 419.24, 418.76, 420.19, 420.97, 420.94, 418.85, 417.15, 415.91, 415.74, 417.47, 418.99],
  [2023, 1, 419.48, 420.31, 420.99, 423.35, 424.00, 423.68, 421.83, 419.68, 418.50, 418.82, 420.46, 421.86],
  [2024, 1, 422.80, 424.55, 425.38, 426.51, 426.90, 426.91, 425.55, 422.99, 422.03, 422.38, 423.85, 425.40],
  [2025, 1, 426.65, 427.09, 428.15, 429.64, 430.51, 429.61, 427.87, 425.48, 424.37, 424.87, 426.46, 427.49],
  [2026, 1, 428.62, 429.35, 430.15, 431.12, 432.34, 431.43, 429.13, 427.55, 426.07],
]
const MONTHS = DATA.flatMap(([y, m0, ...vals]) => vals.map((v, i) => ({ y, m: m0 + i - 1, v })))
const NM = MONTHS.length
const LAST = NM - 1
/** The month index of `year` (decimal, 1958.17 = March 1958). */
const indexOf = year => clamp(Math.round((year - 1958) * 12) - 2, 0, LAST)
const yearOf = i => 1958 + (i + 2) / 12
/** The mean of the year of month i, over its months drawn so far (a whole year: NOAA's annual mean). */
function meanSoFar(i) {
  const y = MONTHS[i].y
  let s = 0
  let n = 0
  for (let k = i; k >= 0 && MONTHS[k].y === y; k--) {
    s += MONTHS[k].v
    n++
  }
  return s / n
}
/** The twelve months of the last whole year drawn by month i (1959 at least). */
function wholeYear(i) {
  let y = MONTHS[i].y - (MONTHS[i].m === 11 ? 0 : 1)
  y = clamp(y, 1959, 2025)
  return { y, v: MONTHS.filter(p => p.y === y).map(p => p.v) }
}

// the game's colours for atoms (CPK, as chem/ballAndStick.js): carbon dark grey, oxygen red, nitrogen blue
const C_COL = '#42464e'
const O_COL = '#f2302b'
const N_COL = '#3a5cf5'
const IR = '#ff5a3c' // heat light, drawn red (it is invisible)
const SUN = '#ffd75a'

// ---- where things stand (metres; the spawn looks north, along -z, at the observatory) ----
const R = 14
const SPAWN = { x: 0.6, z: 7.6 }
const BACK = { x: 0.6, z: 10.7 }
const CHORD = 11.7
const STAND = { x: -2.4, z: 7.0 }
const HOST = { x: 3.1, z: 6.5 }
const WIN = { x: -6.6, z: -1.0 } // the window in time: its hut, the window facing FSPOT
const FSPOT = { x: -3.2, z: 1.4 }
const LAB = { x: 0.6, z: -9.0, w: 10, d: 4.4, h: 4.4 } // the observatory, its chart on the south face
const CSPOT = { x: 0.6, z: -2.5 }
const TOWER = { x: 3.4, z: -12.3, h: 17 }
const BL = { x: 7.6, z: -0.6 } // the blanket model
const BSPOT = { x: 4.5, z: 2.1 }
const faceTo = (o, x, z) => (o.rotation.y = Math.atan2(x - o.position.x, z - o.position.z))

// the window (local metres: the opening x -2.2..2.2, y 0.45..3.85, the box behind it to z -6)
const WW = 4.4
const WY0 = 0.45
const WY1 = 3.85
const WL = 1.1 // the swamp's water (below a visitor's eye, so its surface shows)
const PEAT0 = 0.97 // the swamp floor
const SEAX = 0.5 // the sea begins (local x)
const MUD0 = 0.82 // the sea floor
const DOMEX = 1.3
const COALAT = -1.15 // where the block of coal is cut out

export async function build({ ctx, root, E, W, ex, say, light, lang, level, depth, clickable, color }) {
  const share = id => ctx.share?.(id)
  const refreshPanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const updates = []
  const textures = []
  const disposers = []
  const glow = glowTexture(128)
  textures.push(glow)
  const ps = lv => list => list[depth(lv)].map(p => ({ p }))
  const sci = () => level() === 'scientist'
  const syncText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }

  // =====================================================================================
  // The summit: Mauna Loa's flank above a sea of clouds, at night
  // =====================================================================================
  const stage = summitStage({
    radius: R,
    drop: 30,
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    chord: CHORD,
    airglow: '#5fae86',
    glow: 0.65,
    milky: { az: -2.2, el: 0.85, tilt: 0.5 },
    paths: [
      [[BACK.x, BACK.z], [SPAWN.x, SPAWN.z], [0.6, 4.0]],
      [[0.6, 4.0], [FSPOT.x, FSPOT.z]],
      [[0.6, 4.0], [CSPOT.x, CSPOT.z], [0.6, -6.4]],
      [[0.6, 4.0], [BSPOT.x, BSPOT.z]],
    ],
    clearings: [[SPAWN.x, SPAWN.z, 1.3], [FSPOT.x, FSPOT.z, 1.5], [CSPOT.x, CSPOT.z, 1.6], [BSPOT.x, BSPOT.z, 1.4], [STAND.x, STAND.z, 1.0], [BL.x, BL.z, 1.9]],
    lamps: [[-1.0, 4.6], [2.2, 4.6], [-2.0, 2.0], [2.9, 2.6], [-0.6, -1.0], [1.8, -1.0]],
  })
  root.add(stage.group)
  const solids = stage.solids

  // the sea of clouds on every side, far below (the trade winds' clouds stay under the summit)
  {
    const tex = canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#000000'
      g.fillRect(0, 0, w, w)
      const rnd = random(4211)
      for (let i = 0; i < 1100; i++) {
        const x = rnd() * w
        const y = rnd() * w
        const r = 10 + rnd() * 40
        const grd = g.createRadialGradient(x, y, 0, x, y, r)
        grd.addColorStop(0, `rgba(255,255,255,${0.06 + rnd() * 0.1})`)
        grd.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = grd
        g.fillRect(x - r, y - r, r * 2, r * 2)
      }
    }, { repeat: true })
    textures.push(tex)
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: false,
      uniforms: { uMap: { value: tex }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vW;
        void main() { vUv = uv * 7.0; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap; uniform float uTime;
        varying vec2 vUv; varying vec3 vW;
        void main() {
          float k = texture2D(uMap, vUv + vec2(uTime * 0.0015, 0.0)).r + texture2D(uMap, vUv * 0.41 + vec2(0.2, uTime * 0.001)).r;
          float r = length(vW.xz);
          float fade = smoothstep(70.0, 190.0, r) * (1.0 - smoothstep(1200.0, 1700.0, r));
          gl_FragColor = vec4(vec3(0.32, 0.35, 0.48), (0.4 + k * 0.85) * fade);
        }`,
    })
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(3600, 3600), mat)
    deck.rotation.x = -Math.PI / 2
    deck.position.y = -24
    deck.renderOrder = -4
    root.add(deck)
    updates.push((dt, t) => (mat.uniforms.uTime.value = t))
  }
  // Maunakea to the north, its summit domes catching the starlight, a red light on one
  {
    const mk = new THREE.Group()
    mk.position.set(-160, 0, -980)
    const shape = new THREE.Mesh(new THREE.CylinderGeometry(70, 620, 70, 48, 1, true), new THREE.MeshStandardMaterial({ color: '#211d30', roughness: 1, emissive: '#0d0b18', emissiveIntensity: 1, fog: false }))
    shape.position.y = -10
    mk.add(shape)
    const cap = new THREE.Mesh(new THREE.CircleGeometry(70, 32).rotateX(-Math.PI / 2), shape.material)
    cap.position.y = 25
    mk.add(cap)
    const domeMat = new THREE.MeshStandardMaterial({ color: '#cfd6e6', emissive: '#6a7398', emissiveIntensity: 1.2, roughness: 0.6, fog: false })
    for (const [x, z, r] of [[-38, 10, 5.6], [-18, -6, 7.0], [4, 8, 4.8], [22, -2, 6.2], [44, 12, 4.4], [-55, -8, 4.0]]) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8, 0, TAU, 0, Math.PI / 2), domeMat)
      d.position.set(x, 25, z)
      mk.add(d)
    }
    const red = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ff3a24', 2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    red.position.set(-18, 33, -6)
    red.scale.setScalar(6)
    mk.add(red)
    root.add(mk)
  }

  const M = {
    white: new THREE.MeshStandardMaterial({ color: '#d9dde6', roughness: 0.75, metalness: 0.05 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f3e', roughness: 0.7, metalness: 0.3 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8a93a6', roughness: 0.4, metalness: 0.7 }),
    navy: new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.4, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.6 }),
    edge: new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.4, metalness: 0.2 }),
    warm: new THREE.MeshStandardMaterial({ color: '#ffd9a0', emissive: '#ffb85a', emissiveIntensity: 1.1, roughness: 0.5 }),
  }
  const GOLD = new THREE.Color('#ffd166')
  const BASE = new THREE.Color(color)
  /** A frame that turns gold once its station is discovered (the kits' screens do the same). */
  const edgeOf = () => {
    const mat = M.edge.clone()
    // gold is brighter than the board's colour: a big frame glowing gold at full strength blooms over everything
    return {
      mat,
      setRead: r => {
        mat.color.copy(r ? GOLD : BASE)
        mat.emissive.copy(r ? GOLD : BASE)
        mat.emissiveIntensity = r ? 0.45 : 1.0
      },
    }
  }
  const panelTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#e4e7ee'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(70,80,100,0.35)'
    g.lineWidth = 2
    for (let i = 0; i <= 8; i++) {
      g.beginPath()
      g.moveTo((i / 8) * w, 0)
      g.lineTo((i / 8) * w, h)
      g.stroke()
    }
    g.fillStyle = 'rgba(70,80,100,0.18)'
    g.fillRect(0, h * 0.5 - 1, w, 2)
  }, { repeat: true })
  textures.push(panelTex)
  const wallMat = new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.7, metalness: 0.05 })
  /** A white panelled box (a wall), its texture in metres. */
  const wall = (w, h, d) => {
    const g = new THREE.BoxGeometry(w, h, d)
    const uv = g.attributes.uv
    const n = g.attributes.normal
    for (let i = 0; i < uv.count; i++) {
      const ax = Math.abs(n.getX(i))
      const az = Math.abs(n.getZ(i))
      const sx = ax > 0.5 ? d : az > 0.5 ? w : w
      const sy = Math.abs(n.getY(i)) > 0.5 ? d : h
      uv.setXY(i, (uv.getX(i) * sx) / 4, (uv.getY(i) * sy) / 2)
    }
    return new THREE.Mesh(g, wallMat)
  }

  // =====================================================================================
  // 1. The window in time: a Carboniferous swamp forest, and the ground under it
  // =====================================================================================
  const win = new THREE.Group()
  win.position.set(WIN.x, 0, WIN.z)
  faceTo(win, FSPOT.x, FSPOT.z)
  root.add(win)
  const HUT = { w: 5.8, d: 6.4, h: 5.6 }
  {
    // the hut round the window: a front with the opening, sides, back, roof
    const T = 0.25
    const parts = [
      [(HUT.w - WW) / 2, HUT.h, T, -(WW / 2 + (HUT.w - WW) / 4), HUT.h / 2, -T / 2],
      [(HUT.w - WW) / 2, HUT.h, T, WW / 2 + (HUT.w - WW) / 4, HUT.h / 2, -T / 2],
      [WW, WY0, T, 0, WY0 / 2, -T / 2],
      [WW, HUT.h - WY1, T, 0, (HUT.h + WY1) / 2, -T / 2],
      [T, HUT.h, HUT.d, -HUT.w / 2 + T / 2, HUT.h / 2, -HUT.d / 2],
      [T, HUT.h, HUT.d, HUT.w / 2 - T / 2, HUT.h / 2, -HUT.d / 2],
      [HUT.w, HUT.h, T, 0, HUT.h / 2, -HUT.d + T / 2],
      [HUT.w + 0.3, 0.2, HUT.d + 0.3, 0, HUT.h + 0.1, -HUT.d / 2],
    ]
    for (const [w, h, d, x, y, z] of parts) {
      const m = wall(w, h, d)
      m.position.set(x, y, z)
      win.add(m)
    }
    win.updateMatrixWorld(true)
    const c = win.localToWorld(V3(0, 0, -HUT.d / 2))
    solids.push(box(c.x, c.z, HUT.w + 0.2, HUT.d + 0.2, { rot: win.rotation.y }))
  }
  // the window's glowing frame (gold once found)
  const winEdge = edgeOf()
  {
    const t = 0.14
    for (const [w, h, x, y] of [
      [WW + 2 * t, t, 0, WY1 + t / 2],
      [WW + 2 * t, t, 0, WY0 - t / 2],
      [t, WY1 - WY0, -(WW + t) / 2, (WY0 + WY1) / 2],
      [t, WY1 - WY0, (WW + t) / 2, (WY0 + WY1) / 2],
    ]) {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.16, 2, 0.04), winEdge.mat)
      m.position.set(x, y, 0.04)
      win.add(m)
    }
  }

  // ---- the diorama: daylight 300 million years ago ----
  const dio = new THREE.Group()
  win.add(dio)
  // (a little inside the hut's walls: on their faces the paint and the panels fought)
  const IN = { x: HUT.w / 2 - 0.3, z0: -0.25, z1: -HUT.d + 0.3, top: HUT.h - 0.04 }
  // the painted distance: a hazy sky over the swamp forest, the open sea on the right
  const backdrop = canvasTex(1024, 512, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.72)
    sky.addColorStop(0, '#b9d2c8')
    sky.addColorStop(1, '#efe9cf')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    const sea = h * 0.7
    g.fillStyle = '#86aba2'
    g.fillRect(w * 0.72, sea, w * 0.28, h - sea)
    const rnd = random(305)
    // three layers of forest, paler with distance
    for (const [col, base, k, x1] of [['#a8bfa2', 0.66, 0.6, 0.76], ['#7f9f7a', 0.7, 0.8, 0.72], ['#5d7f58', 0.76, 1.0, 0.68]]) {
      g.fillStyle = col
      g.strokeStyle = col
      for (let i = 0; i < 26; i++) {
        const x = rnd() * w * x1
        const top = h * (base - (0.25 + rnd() * 0.3) * k)
        g.lineWidth = (3 + rnd() * 4) * k
        g.beginPath()
        g.moveTo(x, h * base + 10)
        g.lineTo(x, top)
        g.stroke()
        // a forked crown, the club mosses' kind
        for (const s of [-1, 1]) {
          g.lineWidth = 2 * k
          g.beginPath()
          g.moveTo(x, top)
          g.lineTo(x + s * 14 * k, top - 14 * k)
          g.stroke()
          g.beginPath()
          g.ellipse(x + s * 16 * k, top - 18 * k, 9 * k, 7 * k, 0, 0, TAU)
          g.fill()
        }
      }
      g.fillRect(0, h * base, w * (x1 + 0.03), h * (1 - base))
    }
    // mist low over the water
    const mist = g.createLinearGradient(0, h * 0.6, 0, h * 0.85)
    mist.addColorStop(0, 'rgba(240,238,220,0)')
    mist.addColorStop(0.5, 'rgba(240,238,220,0.55)')
    mist.addColorStop(1, 'rgba(240,238,220,0)')
    g.fillStyle = mist
    g.fillRect(0, h * 0.6, w, h * 0.25)
  })
  textures.push(backdrop)
  // (kept below white, so the bloom does not wash the swamp out)
  const paint = new THREE.MeshBasicMaterial({ map: backdrop, color: '#a9a9a9' })
  const paintSide = new THREE.MeshBasicMaterial({ map: backdrop, color: '#7d857c' })
  {
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2 * IN.x, IN.top), paint)
    back.position.set(0, IN.top / 2, IN.z1)
    dio.add(back)
    // the sides carry the same painting, a slice of it each, in the shade
    for (const s of [-1, 1]) {
      const g = new THREE.PlaneGeometry(IN.z0 - IN.z1, IN.top)
      const uv = g.attributes.uv
      for (let i = 0; i < uv.count; i++) uv.setX(i, s < 0 ? uv.getX(i) * 0.5 : 0.5 + uv.getX(i) * 0.5)
      const m = new THREE.Mesh(g, paintSide)
      m.rotation.y = -s * Math.PI / 2
      m.position.set(s * IN.x, IN.top / 2, (IN.z0 + IN.z1) / 2)
      dio.add(m)
    }
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * IN.x, IN.z0 - IN.z1), new THREE.MeshBasicMaterial({ color: '#7f948b' }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, IN.top, (IN.z0 + IN.z1) / 2)
    dio.add(ceil)
  }
  // the water: brown swamp on the left, the green sea on the right
  const waterTex = canvasTex(256, 64, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, '#3f4a2c')
    grd.addColorStop((SEAX + IN.x - 0.3) / (2 * IN.x), '#4a5a34')
    grd.addColorStop((SEAX + IN.x + 0.2) / (2 * IN.x), '#3f7f7a')
    grd.addColorStop(1, '#4f9a90')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(waterTex)
  const water = new THREE.Mesh(new THREE.PlaneGeometry(2 * IN.x, IN.z0 - IN.z1), new THREE.MeshStandardMaterial({ map: waterTex, roughness: 0.15, metalness: 0.1, emissive: '#26301c', emissiveIntensity: 0.5 }))
  water.rotation.x = -Math.PI / 2
  water.position.set(0, WL, (IN.z0 + IN.z1) / 2)
  dio.add(water)
  // a hit shape for the sea (its part of the water)
  const seaHit = new THREE.Mesh(new THREE.PlaneGeometry(IN.x - SEAX, IN.z0 - IN.z1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ visible: false }))
  seaHit.position.set((SEAX + IN.x) / 2, WL + 0.01, (IN.z0 + IN.z1) / 2)
  dio.add(seaHit)
  // plankton glinting in the sea
  const NPL = light ? 60 : 140
  const plPos = new Float32Array(NPL * 3)
  const plSeed = new Float32Array(NPL)
  {
    const rnd = random(77)
    for (let i = 0; i < NPL; i++) {
      plPos.set([SEAX + 0.15 + rnd() * (IN.x - SEAX - 0.2), WL + 0.02 + rnd() * 0.06, IN.z0 - 0.2 - rnd() * (IN.z0 - IN.z1 - 0.4)], i * 3)
      plSeed[i] = rnd() * 100
    }
  }
  const plGeo = new THREE.BufferGeometry()
  plGeo.setAttribute('position', new THREE.BufferAttribute(plPos, 3))
  const plMat = new THREE.PointsMaterial({ map: glow, color: hdr('#c8fff0', 1.4), size: 0.06, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const plankton = new THREE.Points(plGeo, plMat)
  plankton.raycast = () => {}
  dio.add(plankton)
  // mud hummocks with ferns, so the swamp has banks
  const mudMat = new THREE.MeshStandardMaterial({ color: '#4b3d2a', roughness: 1, emissive: '#1d160c', emissiveIntensity: 0.6 })
  const leafMat = new THREE.MeshStandardMaterial({ color: '#4e8a3a', roughness: 0.8, emissive: '#1d3a14', emissiveIntensity: 0.6, side: THREE.DoubleSide })
  const leafDark = new THREE.MeshStandardMaterial({ color: '#2f6a32', roughness: 0.8, emissive: '#123012', emissiveIntensity: 0.6, side: THREE.DoubleSide })
  {
    const rnd = random(12)
    for (const [x, z, r] of [[-1.7, -1.1, 0.7], [-0.6, -2.4, 0.8], [-1.9, -3.6, 0.9], [-0.3, -4.6, 0.7], [-0.9, -5.3, 0.8], [0.1, -1.3, 0.42]]) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8, 0, TAU, 0, Math.PI / 2), mudMat)
      h.scale.y = 0.22
      h.position.set(x, WL - 0.08, z)
      dio.add(h)
      for (let i = 0; i < 4; i++) {
        const f = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.5 + rnd() * 0.3, 4), i % 2 ? leafMat : leafDark)
        const a = rnd() * TAU
        f.position.set(x + Math.cos(a) * r * 0.45, WL + 0.2, z + Math.sin(a) * r * 0.45)
        f.rotation.set((rnd() - 0.5) * 1.2, 0, (rnd() - 0.5) * 1.2)
        dio.add(f)
      }
    }
  }
  // giant club mosses: tall trunks patterned with diamond leaf scars, forked crowns (Lepidodendron) or a
  // tuft of long leaves (Sigillaria)
  const barkTex = canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = '#4f5a3a'
    g.fillRect(0, 0, w, h)
    const n = 6
    const s = w / n
    for (let j = 0; j < (h / s) * 2 + 2; j++) {
      for (let i = 0; i < n + 1; i++) {
        const x = (i + (j % 2) * 0.5) * s
        const y = (j * s) / 2
        g.beginPath()
        g.moveTo(x, y - s * 0.48)
        g.lineTo(x + s * 0.36, y)
        g.lineTo(x, y + s * 0.48)
        g.lineTo(x - s * 0.36, y)
        g.closePath()
        g.fillStyle = '#6f7d4e'
        g.fill()
        g.strokeStyle = '#2f3722'
        g.lineWidth = 2
        g.stroke()
        g.fillStyle = '#3a4428'
        g.fillRect(x - 1.5, y - 2, 3, 4)
      }
    }
  }, { repeat: true })
  barkTex.repeat.set(1, 4)
  textures.push(barkTex)
  const barkMat = new THREE.MeshStandardMaterial({ map: barkTex, roughness: 0.9, emissive: '#1e2414', emissiveIntensity: 0.5 })
  const crownMat = new THREE.MeshStandardMaterial({ color: '#5f9a3e', roughness: 0.8, emissive: '#22401a', emissiveIntensity: 0.6 })
  const branch = (a, b, r) => {
    const d = new THREE.Vector3().subVectors(b, a)
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r, d.length(), 8), barkMat)
    m.position.copy(a).addScaledVector(d, 0.5)
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
    return m
  }
  const tuft = (p, len, dir = V3(0, 1, 0)) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(len * 0.32, len, 7), crownMat)
    m.position.copy(p).addScaledVector(dir, len * 0.35)
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize())
    return m
  }
  /** A club moss standing on the swamp floor at local (x, z): a group pivoting at its foot. */
  function clubMoss(x, z, h, r, kind) {
    const g = new THREE.Group()
    g.position.set(x, PEAT0, z)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.62, r, h, 12), barkMat)
    trunk.position.y = h / 2
    // flared roots (Stigmaria) at the foot
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + 0.4
      g.add(branch(V3(0, 0.25, 0), V3(Math.cos(a) * r * 2.6, -0.05, Math.sin(a) * r * 2.6), r * 0.35))
    }
    g.add(trunk)
    const top = V3(0, h, 0)
    if (kind === 'sigillaria') {
      g.add(tuft(top, 0.7))
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU
        g.add(tuft(top.clone().add(V3(0, -0.15, 0)), 0.55, V3(Math.cos(a), 0.9, Math.sin(a))))
      }
    } else {
      // twice-forked branches, each ending in a tuft of leaves
      for (const s of [-1, 1]) {
        const a1 = top.clone().add(V3(s * 0.45, 0.5, s * 0.1))
        g.add(branch(top, a1, r * 0.45))
        for (const u of [-1, 1]) {
          const a2 = a1.clone().add(V3(s * 0.22 + u * 0.18, 0.32, u * 0.22))
          g.add(branch(a1, a2, r * 0.28))
          g.add(tuft(a2, 0.42, a2.clone().sub(a1)))
        }
      }
    }
    // an easy thing to tap: its trunk, a little wider
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.6, r * 1.6, h, 8), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = h / 2
    g.add(hit)
    dio.add(g)
    return g
  }
  // the three to fell, and the fall each takes (the direction its top goes, local): across the view, so a
  // fallen trunk is seen lying (falling straight away it showed only its end), and inside the hut
  const GIANTS = [
    { g: clubMoss(-1.7, -1.45, 3.2, 0.16, 'lepido'), dir: V3(0.5, 0, -0.87) },
    { g: clubMoss(-0.45, -1.6, 3.3, 0.18, 'lepido'), dir: V3(-0.35, 0, -0.94) },
    { g: clubMoss(0.1, -1.3, 3.0, 0.15, 'sigillaria'), dir: V3(0.42, 0, -0.91) },
  ]
  // more of the forest, not to fell: thinner club mosses further back, horsetails (Calamites) and a tree fern
  clubMoss(0.0, -5.3, 3.0, 0.13, 'lepido')
  clubMoss(-1.3, -5.5, 3.2, 0.12, 'sigillaria')
  clubMoss(-2.2, -4.4, 2.9, 0.12, 'lepido')
  {
    const stemMat = new THREE.MeshStandardMaterial({ color: '#6e8a4a', roughness: 0.8, emissive: '#26331a', emissiveIntensity: 0.6 })
    const ringMat = new THREE.MeshStandardMaterial({ color: '#3c4a2a', roughness: 0.8 })
    for (const [x, z, h] of [[0.25, -3.0, 2.2], [-0.2, -4.2, 2.6], [-1.3, -3.4, 1.9]]) {
      const g = new THREE.Group()
      g.position.set(x, PEAT0, z)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, h, 8), stemMat)
      stem.position.y = h / 2
      g.add(stem)
      for (let y = 0.5; y < h; y += 0.32) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 10), ringMat)
        ring.rotation.x = Math.PI / 2
        ring.position.y = y
        g.add(ring)
        if (y > h * 0.35) {
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TAU + y
            const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.01, 0.34, 3), leafMat)
            nd.position.set(Math.cos(a) * 0.16, y + 0.06, Math.sin(a) * 0.16)
            nd.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1)
            g.add(nd)
          }
        }
      }
      dio.add(g)
    }
    // the tree fern (Psaronius): a trunk and a crown of arching fronds
    const fern = new THREE.Group()
    fern.position.set(-2.1, PEAT0, -2.9)
    const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.9, 10), new THREE.MeshStandardMaterial({ color: '#4a3a28', roughness: 1 }))
    ft.position.y = 0.95
    fern.add(ft)
    const frond = new THREE.PlaneGeometry(0.34, 1.3, 1, 6)
    {
      const p = frond.attributes.position
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i) + 0.65
        p.setZ(i, -0.25 * y * y)
        p.setX(i, p.getX(i) * (1 - (y / 1.3) * 0.8))
      }
      frond.translate(0, 0.65, 0)
      frond.computeVertexNormals()
    }
    for (let i = 0; i < 9; i++) {
      const f = new THREE.Mesh(frond, leafMat)
      f.position.y = 1.9
      f.rotation.set(0.9, (i / 9) * TAU, 0, 'YXZ')
      fern.add(f)
    }
    dio.add(fern)
  }
  // a griffinfly, Meganeura: wings about 65 cm across, the biggest flying insect known
  const fly = new THREE.Group()
  {
    const body = new THREE.MeshStandardMaterial({ color: '#2d4f6a', roughness: 0.4, metalness: 0.4, emissive: '#0d2233', emissiveIntensity: 0.6 })
    const abd = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.022, 0.32, 8), body)
    abd.rotation.x = Math.PI / 2
    abd.position.z = -0.12
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), body)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), body)
    head.position.z = 0.05
    fly.add(abd, thorax, head)
    const wingMat = new THREE.MeshStandardMaterial({ color: '#d8ecff', transparent: true, opacity: 0.45, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false })
    fly.userData.wings = []
    for (const s of [-1, 1]) {
      for (const [dz, len] of [[0.02, 0.32], [-0.04, 0.3]]) {
        const pivot = new THREE.Group()
        pivot.position.set(0, 0.02, dz)
        const w = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.06).translate(s * len / 2, 0, 0).rotateX(-Math.PI / 2), wingMat)
        pivot.add(w)
        pivot.userData.s = s
        fly.add(pivot)
        fly.userData.wings.push(pivot)
      }
    }
    dio.add(fly)
  }
  // the swamp's daylight (a warm lamp inside the hut, its light spilling a little out of the window)
  const dayLight = new THREE.PointLight('#fff2d6', 7, 9, 1.4)
  dayLight.position.set(0.2, 4.8, -2.8)
  win.add(dayLight)

  // ---- the cut through the ground, just behind the glass: drawn on a canvas ----
  const CW = 1024
  const CH = Math.round((CW * (WY1 - WY0)) / WW)
  const X = x => ((x + WW / 2) / WW) * CW
  const Y = y => ((WY1 - y) / (WY1 - WY0)) * CH
  const PX = CW / WW
  const F = { fallen: [false, false, false], plankton: 0, t: 0, coal: false, oil: false }
  let snow = 0 // plankton falling through the sea's cut (seconds left)
  const fallenN = () => F.fallen.filter(Boolean).length
  /** Where the layers are at time t (local metres). The cut follows the seam down as it is buried (it rises
   *  a little in the window while the surface climbs out of the top), so the coal stays in view. */
  function strata(t = F.t) {
    const e1 = span(0, 0.6, t)
    const follow = 0.22 * e1
    const th0 = 0.3 + 0.05 * fallenN()
    const th = th0 * lerp(1, 0.5, e1)
    const peatBot = PEAT0 - th0 + follow
    const peatTop = peatBot + th
    const mud0 = 0.2 + 0.03 * Math.min(3, F.plankton)
    const mudTh = mud0 * lerp(1, 0.5, e1)
    const mudBot = MUD0 - mud0 + follow
    const top = WL + (WY1 - WL) * span(0.02, 0.35, t)
    const sedTop = Math.max(peatTop, top - 0.15 * (1 - span(0, 0.06, t)))
    const dome = 0.34 * span(0.3, 0.7, t)
    const oilK = span(0.45, 0.8, t) * (0.6 + 0.4 * Math.min(3, F.plankton) / 3)
    return { e1, th, peatBot, peatTop, mudTh, mudBot, mudTop: mudBot + mudTh, top, sedTop, dome, oilK }
  }
  const domeAt = (x, k) => k * Math.exp(-(((x - DOMEX) / 0.5) ** 2)) * smoothX(x)
  /** The middle of the oil trap under the dome, in the sand over the black shale. */
  const oilY = st => st.mudTop + 0.2 + st.dome * 0.62
  const smoothX = x => span(SEAX - 0.35, SEAX + 0.15, x)
  const LAYERS = [
    [0.16, '#b39668'],
    [0.32, '#6e6a66'],
    [0.46, '#8f8473'],
    [0.62, '#a8a59a'],
    [0.86, '#b89a6a'],
    [1.05, '#76716b'],
    [1.3, '#9a8a70'],
    [1.5, '#b29a72'],
    [1.75, '#6f6b66'],
    [2.0, '#958a76'],
    [2.3, '#b5996c'],
    [2.6, '#7a746c'],
    [3.0, '#a08f72'],
  ]
  const secTex = canvasTex(CW, CH, null, { mipmaps: false })
  textures.push(secTex)
  const specks = (g, rnd, x0, x1, yf0, yf1, n, rgba) => {
    g.fillStyle = rgba
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0)
      const y0 = yf0(x)
      const y1 = yf1(x)
      if (y1 <= y0) continue
      g.fillRect(X(x), Y(y0 + rnd() * (y1 - y0)), 2 + rnd() * 2, 2)
    }
  }
  /** Fill between two lines y = lo(x) and y = hi(x) (local metres) from x0 to x1. */
  const band = (g, x0, x1, lo, hi, fillStyle) => {
    g.fillStyle = fillStyle
    g.beginPath()
    const n = 48
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n
      i ? g.lineTo(X(x), Y(hi(x))) : g.moveTo(X(x), Y(hi(x)))
    }
    for (let i = n; i >= 0; i--) {
      const x = x0 + ((x1 - x0) * i) / n
      g.lineTo(X(x), Y(lo(x)))
    }
    g.closePath()
    g.fill()
  }
  const label = (g, text, x, y, align = 'left', col = '#e6e6e6') => {
    g.font = '700 30px Outfit'
    g.textAlign = align
    g.textBaseline = 'middle'
    g.lineWidth = 6
    g.strokeStyle = 'rgba(10,12,24,0.85)'
    g.strokeText(text, X(x), Y(y))
    g.fillStyle = col
    g.fillText(text, X(x), Y(y))
  }
  const S = E.forest.sign
  let drawnKey = ''
  function drawSection(now) {
    const st = strata()
    const key = [F.t.toFixed(3), fallenN(), F.plankton, F.coal, F.oil, snow > 0 ? Math.floor(now * 12) : 0, lang].join()
    if (key === drawnKey) return
    drawnKey = key
    secTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      const rnd = random(9)
      const L = -WW / 2
      const Rr = WW / 2
      // what separates the swamp from the sea: a smooth step across x
      const sea = x => span(SEAX - 0.25, SEAX + 0.15, x)
      const peatTop = x => lerp(st.peatTop, st.mudTop, sea(x)) + domeAt(x, st.dome) * 0.5
      const peatBot = x => lerp(st.peatBot, st.mudBot, sea(x)) + domeAt(x, st.dome) * 0.4
      // the sea floor lies lower than the swamp's until the first sand covers both
      const sedSea = Math.max(st.mudTop, st.sedTop - (PEAT0 - MUD0) * (1 - span(0, 0.06, F.t)))
      const sedTop = x => Math.max(peatTop(x), lerp(st.sedTop, sedSea, sea(x)) + (st.sedTop < WY1 - 0.05 ? domeAt(x, st.dome) * 0.25 : 0))
      const base = () => WY0 - 0.05
      // the old rock under it all (light enough for the black coal to stand out on it)
      band(g, L, Rr, base, peatBot, '#7a7166')
      specks(g, rnd, L, Rr, base, peatBot, 600, 'rgba(40,34,28,0.45)')
      // the peat (or brown coal, or coal) on the left; the sea mud (black shale later) on the right
      const pc = st.e1 < 0.3 ? '#6b4a2b' : st.e1 < 0.75 ? '#43301f' : '#141418'
      band(g, L, SEAX + 0.1, peatBot, peatTop, pc)
      specks(g, rnd, L, SEAX, peatBot, peatTop, 400, st.e1 < 0.75 ? 'rgba(150,110,60,0.5)' : 'rgba(150,160,190,0.55)')
      if (st.e1 >= 0.75) {
        // coal's gleam: thin bright streaks along the seam
        g.strokeStyle = 'rgba(200,210,240,0.35)'
        g.lineWidth = 1.5
        for (let i = 0; i < 18; i++) {
          const x = L + 0.1 + rnd() * (SEAX - L - 0.3)
          const y = lerp(st.peatBot, st.peatTop, 0.25 + rnd() * 0.5)
          g.beginPath()
          g.moveTo(X(x), Y(y))
          g.lineTo(X(x + 0.08 + rnd() * 0.15), Y(y))
          g.stroke()
        }
      }
      const mc = st.e1 < 0.4 ? '#3f4a3e' : '#1d1f22'
      band(g, SEAX - 0.1, Rr, peatBot, peatTop, mc)
      // the plankton in the mud: specks, more for each fall of them
      specks(g, rnd, SEAX, Rr, peatBot, peatTop, 60 + 90 * Math.min(3, F.plankton), st.e1 < 0.4 ? 'rgba(200,255,230,0.7)' : 'rgba(120,130,110,0.45)')
      // the hole the block of coal left
      if (F.coal) {
        const cy = (st.peatBot + st.peatTop) / 2
        g.fillStyle = '#0a0a0c'
        g.fillRect(X(COALAT - 0.22), Y(st.peatTop + 0.02), 0.44 * PX, (st.peatTop - st.peatBot + 0.04) * PX)
        g.strokeStyle = 'rgba(255,209,102,0.6)'
        g.lineWidth = 2
        g.strokeRect(X(COALAT - 0.22), Y(cy + 0.12), 0.44 * PX, 0.24 * PX)
      }
      // the layers laid on top, as the swamp sinks and sand and mud bury it
      let lo = peatTop
      for (const [hgt, col] of LAYERS) {
        const hi = x => Math.min(sedTop(x), st.peatTop + hgt + domeAt(x, st.dome) * (0.25 + 0.5 * Math.exp(-hgt)) + 0.02 * Math.sin(x * 3 + hgt * 5))
        const prev = lo
        band(g, L, Rr, x => Math.min(prev(x), sedTop(x)), hi, col)
        specks(g, rnd, L, Rr, x => Math.min(prev(x), sedTop(x)), hi, 160, 'rgba(40,34,28,0.35)')
        lo = hi
      }
      band(g, L, Rr, x => Math.min(lo(x), sedTop(x)), sedTop, '#8c7f6c')
      // water over the swamp and the sea while they are there
      const waterTop = st.top
      if (waterTop > st.sedTop + 0.005) {
        band(g, L, SEAX, x => sedTop(x), () => waterTop, 'rgba(70,80,52,0.9)')
        band(g, SEAX - 0.1, Rr, x => sedTop(x), () => waterTop, 'rgba(60,120,116,0.9)')
        // plankton snow drifting down through the sea's cut
        if (snow > 0) {
          const k = 1 - snow / 2.4
          const r2 = random(31)
          g.fillStyle = 'rgba(210,255,240,0.95)'
          for (let i = 0; i < 70; i++) {
            const x = SEAX + 0.1 + r2() * (Rr - SEAX - 0.15)
            const y = waterTop - ((r2() + k * 1.4) % 1) * (waterTop - st.mudTop)
            g.fillRect(X(x), Y(y), 3, 3)
          }
        }
      }
      // today's soil and grass, once the cut reaches the top
      if (F.t > 0.97) {
        band(g, L, Rr, () => WY1 - 0.12, () => WY1 + 0.02, '#4a3a28')
        g.fillStyle = '#4f8a3a'
        for (let i = 0; i < 90; i++) {
          const x = L + rnd() * WW
          g.fillRect(X(x), Y(WY1 - 0.02), 3, 9)
        }
      }
      // oil and gas gathered under the dome
      if (st.oilK > 0.02) {
        const baseY = oilY(st)
        const k = st.oilK
        const r3 = random(58)
        // the oil-soaked sand under the dome: a dark lens, and the gas above it in the very top
        const lens = (rx, ry, y, fillStyle) => {
          g.fillStyle = fillStyle
          g.beginPath()
          g.ellipse(X(DOMEX), Y(y), rx * PX, ry * PX, 0, Math.PI, TAU)
          g.closePath()
          g.fill()
        }
        lens(0.5 * (0.55 + 0.45 * k), 0.2 * (0.55 + 0.45 * k), baseY - 0.08, `rgba(26,14,6,${0.9 * Math.min(1, k * 1.6)})`)
        if (k > 0.3) lens(0.28 * k, 0.08 * k, baseY + 0.04, 'rgba(205,230,250,0.9)')
        g.fillStyle = 'rgba(150,100,50,0.7)'
        for (let i = 0; i < 40 * k; i++) {
          const x = DOMEX + (r3() - 0.5) * 0.7 * k
          const y = baseY - 0.07 + r3() * 0.08
          g.fillRect(X(x), Y(y), 3, 3)
        }
        // droplets still on their way up from the shale
        if (k < 0.9) {
          g.fillStyle = 'rgba(30,18,10,0.95)'
          for (let i = 0; i < 18; i++) {
            const x = DOMEX + (r3() - 0.5) * 1.0
            const y = lerp(st.mudTop, baseY - 0.1, r3())
            g.beginPath()
            g.arc(X(x), Y(y), 3.5, 0, TAU)
            g.fill()
          }
        }
        if (F.oil) {
          g.fillStyle = 'rgba(12,8,4,0.95)'
          g.fillRect(X(DOMEX - 0.12), Y(baseY - 0.04), 0.24 * PX, 0.14 * PX)
        }
        if (k > 0.3) {
          label(g, S.oil, DOMEX - 0.56, baseY - 0.1, 'right', '#ffd9a0')
          label(g, S.gas, DOMEX, baseY + 0.22, 'center', '#d8ecff')
        }
      }
      // what each band is
      const peatWord = st.e1 < 0.3 ? S.peat : st.e1 < 0.75 ? S.brown : S.coal
      // (under its band, but never below the window's edge)
      label(g, peatWord, L + 0.08, Math.max(WY0 + 0.08, st.peatBot - 0.09), 'left', st.e1 < 0.75 ? '#ffd9a0' : '#e6e6e6')
      label(g, st.e1 < 0.4 ? S.sea : S.shale, Rr - 0.06, Math.max(WY0 + 0.08, st.mudBot - 0.08), 'right', '#cfe8dc')
      if (st.sedTop - st.peatTop > 0.75) label(g, S.rock, -0.6, st.peatTop + Math.min(1.2, (st.sedTop - st.peatTop) * 0.55), 'center')
    })
  }
  const secMat = new THREE.MeshBasicMaterial({ map: secTex, transparent: true })
  const section = new THREE.Mesh(new THREE.PlaneGeometry(WW, WY1 - WY0), secMat)
  section.position.set(0, (WY0 + WY1) / 2, -0.06)
  win.add(section)
  // highlights over what can be tapped next (the seam, the oil), pulsing
  const hiMat = new THREE.MeshBasicMaterial({ color: hdr('#ffd166', 1.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const seamHi = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hiMat)
  const oilHi = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hiMat)
  seamHi.position.z = oilHi.position.z = -0.04
  win.add(seamHi, oilHi)

  // the time dial: a console at the window's left, at hand height: how long ago, a bar from then to today,
  // and a wheel that turns with time
  const DIAL = { x: -2.8, z: 1.2 }
  const dial = new THREE.Group()
  dial.position.set(DIAL.x, 0, DIAL.z)
  dial.rotation.y = Math.atan2(-DIAL.x, 4.2 - DIAL.z)
  win.add(dial)
  const face = new THREE.Group()
  face.position.set(0, 1.08, 0.05)
  face.rotation.x = -0.62
  const wheel = new THREE.Group()
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.8, 1.0, 0.5, 2, 0.04), M.navy)
    body.position.y = 0.5
    dial.add(body)
    const plate = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.56, 0.06, 2, 0.03), M.navy)
    const rim = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.62, 0.04, 2, 0.03), winEdge.mat)
    rim.position.z = -0.025
    face.add(plate, rim)
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.018), new THREE.MeshBasicMaterial({ color: hdr('#9fb0ff', 1.0), toneMapped: false }))
    bar.position.set(0, -0.15, 0.032)
    face.add(bar)
    dial.add(face)
    // the wheel on the console's front
    wheel.position.set(0, 0.55, 0.26)
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 10, 32), winEdge.mat)
    wheel.add(tyre)
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.025), M.steel)
      spoke.rotation.z = (i / 4) * Math.PI
      wheel.add(spoke)
    }
    dial.add(wheel)
    win.updateMatrixWorld(true)
    const p = win.localToWorld(V3(DIAL.x, 0, DIAL.z))
    solids.push(circle(p.x, p.z, 0.5))
  }
  const dialText = makeText('', { size: 0.085, color: hdr(color, 1.05), anchorY: 'middle', maxWidth: 0.92 })
  dialText.position.set(0, 0.08, 0.035)
  face.add(dialText)
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), M.warm)
  knob.position.set(-0.4, -0.15, 0.04)
  face.add(knob)
  // the block of coal and the flask of oil, once lifted out, on a stand by the window
  const STANDX = 2.85
  const STANDZ = 1.05
  const standW = new THREE.Group()
  standW.position.set(STANDX, 0, STANDZ)
  win.add(standW)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.95, 20), M.navy)
    post.position.y = 0.475
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 24), winEdge.mat)
    top.position.y = 0.97
    // a dim lamp a metre over it, so the coal's facets catch some light
    const lamp = new THREE.PointLight('#ffe2c0', 1.6, 2.6, 2)
    lamp.position.set(0.1, 2.1, 0.5)
    standW.add(post, top, lamp)
    win.updateMatrixWorld(true)
    const p = win.localToWorld(V3(STANDX, 0, STANDZ))
    solids.push(circle(p.x, p.z, 0.42))
  }
  const coalGeo = new THREE.DodecahedronGeometry(0.17, 1)
  {
    const p = coalGeo.attributes.position
    const rnd = random(4)
    for (let i = 0; i < p.count; i++) {
      const k = 0.85 + rnd() * 0.3
      p.setXYZ(i, p.getX(i) * k * 1.25, p.getY(i) * k * 0.8, p.getZ(i) * k)
    }
    coalGeo.computeVertexNormals()
  }
  const coalBlock = new THREE.Mesh(coalGeo, new THREE.MeshStandardMaterial({ color: '#16171c', roughness: 0.28, metalness: 0.35, flatShading: true, emissive: '#06070a', emissiveIntensity: 1 }))
  coalBlock.visible = false
  win.add(coalBlock)
  const flask = new THREE.Group()
  {
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.2, 16), new THREE.MeshStandardMaterial({ color: '#cfe2ff', transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false }))
    glass.position.y = 0.1
    const oilIn = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.14, 16), new THREE.MeshStandardMaterial({ color: '#2a1608', roughness: 0.15, metalness: 0.2 }))
    oilIn.position.y = 0.075
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.1, 12), glass.material)
    neck.position.y = 0.24
    flask.add(glass, oilIn, neck)
  }
  flask.visible = false
  win.add(flask)
  const coalWord = makeText(S.coal, { size: 0.1, color: '#ffffff', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#0b0f22' })
  const oilWord = makeText(S.oil, { size: 0.1, color: '#ffffff', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#0b0f22' })
  coalWord.position.set(STANDX - 0.12, 1.42, STANDZ)
  oilWord.position.set(STANDX + 0.2, 1.42, STANDZ)
  coalWord.visible = oilWord.visible = false
  win.add(coalWord, oilWord)
  const REST = { coal: V3(STANDX - 0.12, 1.14, STANDZ), oil: V3(STANDX + 0.2, 0.995, STANDZ + 0.03) }
  let lift = null // { what, t, from }

  // ---- the window's steps ----
  const forestPanel = lv => ({
    title: E.forest.title,
    color,
    blocks: [
      { slider: { label: E.forest.slider, min: 0, max: 1, step: 0.005, value: F.t, live: () => F.t, format: v => agoWord(v), onInput: v => setTime(v) } },
      { buttons: [['tree', () => forestStep('tree')], ['sea', () => forestStep('sea')], ['coal', () => forestStep('coal')], ['oil', () => forestStep('oil')], ['back', () => setTime(0, true)]].map(([k, f]) => ({ label: E.forest.buttons[k], onClick: f })) },
      ...ps(lv)(E.forest.panel),
    ],
  })
  const agoWord = v => (v >= 0.995 ? S.today : fill(S.ago, { n: Math.max(1, Math.round(300 * (1 - v))) }))
  let forestMine = false
  const forestChanged = (delay = 2.6) => {
    forestMine = true
    ex.discover('forest', forestPanel, delay)
    share('forest')
  }
  const falls = [0, 0, 0] // each giant's fall, 0 standing to 1 down
  function forestStep(step, which) {
    const lv = level()
    if (step === 'tree') {
      if (F.t > 0.03) return say(at(E.forest.says.buried, lv))
      const i = which ?? F.fallen.findIndex(f => !f)
      if (i < 0 || F.fallen[i]) return say(at(i < 0 ? E.forest.says.trees : E.forest.says.fallen, lv))
      F.fallen[i] = true
      play('crack')
      say(at(fallenN() === 3 ? E.forest.says.trees : E.forest.says.tree, lv))
    } else if (step === 'sea') {
      if (F.t > 0.03) return say(at(E.forest.says.buried, lv))
      F.plankton = Math.min(9, F.plankton + 1)
      snow = 2.4
      play('fizz', { order: 1.2 })
      say(at(E.forest.says.sea, lv))
    } else if (step === 'coal') {
      if (F.t < 0.97) return say(at(E.forest.says.notYet, lv))
      if (F.coal) return say(at(E.forest.says.lift, lv))
      F.coal = true
      startLift('coal')
      play('select')
      say(at(E.forest.says.lift, lv))
    } else if (step === 'oil') {
      if (strata().oilK < 0.5) return say(at(E.forest.says.noOil, lv))
      if (F.oil) return say(at(E.forest.says.oilOut, lv))
      F.oil = true
      startLift('oil')
      play('select')
      say(at(E.forest.says.oilOut, lv))
    } else return
    forestChanged()
  }
  const startLift = what => {
    const st = strata()
    const from = what === 'coal' ? V3(COALAT, (st.peatBot + st.peatTop) / 2, -0.02) : V3(DOMEX, oilY(st), -0.02)
    lift = { what, t: 0, from }
  }
  // the time slider (sent a few times a second, the last always); the Atomling tells each stage once
  let timeSend = null
  let told = { brown: false, coal: false, oil: false, today: false, back: true }
  function setTime(v, now = false) {
    const before = F.t
    F.t = clamp(Math.round(Number(v) * 1000) / 1000)
    if (before > 0.03 && F.t <= 0.03 && forestMine) {
      say(at(E.forest.says.back, level()))
      told = { brown: false, coal: false, oil: false, today: false, back: true }
    }
    forestMine = true
    ex.discover('forest', forestPanel, 2.6)
    if (now) {
      share('forest')
      return
    }
    if (!timeSend) {
      timeSend = setTimeout(() => {
        timeSend = null
        share('forest')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(timeSend))
  const forestHint = () => {
    const H = E.forest.hints
    if (F.t <= 0.03 && fallenN() === 0) return H.tree
    if (F.t <= 0.03 && F.plankton === 0) return H.sea
    if (F.t < 0.97) return H.dial
    if (!F.coal) return H.coal
    if (!F.oil) return H.oil
    return H.back
  }
  win.updateMatrixWorld(true)
  const winFocus = win.localToWorld(V3(0, 2.0, 0.4))
  ex.add({
    id: 'forest',
    manual: true,
    x: FSPOT.x,
    z: FSPOT.z,
    radius: 2.3,
    label: E.forest.label,
    verb: forestHint,
    screens: [winEdge],
    focus: { x: winFocus.x, y: winFocus.y, z: winFocus.z, size: 6.2 },
    act: () => ctx.showPanel(forestPanel),
  })
  GIANTS.forEach((G, i) => clickable(G.g, () => forestStep('tree', i), { when: () => F.t <= 0.03, reach: 8 }))
  clickable(seaHit, () => forestStep('sea'), { when: () => F.t <= 0.03, reach: 8 })
  clickable(dial, () => {
    forestMine = true
    ex.discover('forest')
    play('tap')
    ctx.showPanel(forestPanel)
  }, { reach: 8 })
  /** Which part of the cut a point (local to the window) is on. */
  const regionAt = (x, y) => {
    const st = strata()
    if (y > st.top + 0.02) return null
    if (x < SEAX - 0.15 && Math.abs(y - (st.peatBot + st.peatTop) / 2) < st.th / 2 + 0.09) return 'coal'
    if (F.t <= 0.03 && x > SEAX && y > st.mudTop && y <= WL + 0.02) return 'sea'
    const baseY = oilY(st)
    if (st.oilK > 0.05 && Math.abs(x - DOMEX) < 0.55 && y > baseY - 0.25 && y < baseY + 0.3) return 'oil'
    return null
  }
  const localHit = h => win.worldToLocal(h.point.clone())
  clickable(section, h => {
    const p = localHit(h)
    const r = regionAt(p.x, p.y)
    if (r) forestStep(r)
  }, { reach: 8, accept: h => { const p = localHit(h); return !!regionAt(p.x, p.y) } })
  clickable(coalBlock, () => say(at(E.forest.says.lift, level())), { reach: 6 })
  clickable(flask, () => say(at(E.forest.says.oilOut, level())), { reach: 6 })

  updates.push((dt, t) => {
    // the giants fall (a quick topple), coming to rest leaning on the far bank, so the trunk lies above the
    // water where it can be seen (falling flat it vanished under the surface)
    GIANTS.forEach((G, i) => {
      falls[i] = F.fallen[i] ? Math.min(1, falls[i] + dt / 1.4) : 0
      const k = falls[i] < 1 ? falls[i] * falls[i] * falls[i] : 1
      const axis = V3(G.dir.z, 0, -G.dir.x).normalize()
      G.g.quaternion.setFromAxisAngle(axis, k * 1.3)
      G.g.position.y = PEAT0 - 0.04 * k
    })
    // the plankton glint; the snow falls
    plMat.opacity = 0.55 + 0.25 * Math.sin(t * 2.3)
    if (snow > 0) snow = Math.max(0, snow - dt)
    // the griffinfly's round over the swamp
    const a = t * 0.55
    fly.position.set(-0.55 + Math.cos(a) * 1.15, 2.6 + Math.sin(a * 2.3) * 0.25, -3.5 + Math.sin(a) * 0.75)
    fly.rotation.set(0, Math.atan2(-Math.sin(a) * 1.15, Math.cos(a) * 0.75), 0)
    for (const w of fly.userData.wings) w.rotation.z = w.userData.s * Math.sin(t * 38 + w.position.z * 40) * 0.45
    // the cut, the forest hidden once the cut covers it
    const st = strata()
    drawSection(t)
    dio.visible = st.top < WY1 - 0.01
    dayLight.intensity = dio.visible ? 7 : 0
    // the dial
    syncText(dialText, agoWord(F.t))
    knob.position.x = -0.4 + 0.8 * F.t
    wheel.rotation.z = -F.t * TAU * 3
    // the Atomling tells each stage once, to whoever moved time there
    if (forestMine) {
      const lv = level()
      const tell = (k, cond, words) => {
        if (cond && !told[k]) {
          told[k] = true
          say(at(words, lv))
        }
      }
      tell('brown', st.e1 >= 0.3 && st.e1 < 0.75, E.forest.says.brown)
      tell('coal', st.e1 >= 0.75 && F.t < 0.97, E.forest.says.coal)
      tell('oil', st.oilK > 0.5 && F.t < 0.97, E.forest.says.oil)
      tell('today', F.t >= 0.97, E.forest.says.today)
    }
    // the highlights: the seam once there is coal to lift, the oil once there is oil
    const pulse = 0.18 + 0.14 * Math.sin(t * 3.2)
    const seamOn = F.t >= 0.97 && !F.coal
    seamHi.visible = seamOn
    if (seamOn) {
      seamHi.scale.set(SEAX + WW / 2 - 0.2, st.th + 0.06, 1)
      seamHi.position.set((-WW / 2 + SEAX - 0.2) / 2, (st.peatBot + st.peatTop) / 2, -0.04)
    }
    const oilOn = st.oilK > 0.5 && F.coal && !F.oil
    oilHi.visible = oilOn
    if (oilOn) {
      oilHi.scale.set(1.0, 0.36, 1)
      oilHi.position.set(DOMEX, oilY(st) - 0.02, -0.04)
    }
    hiMat.opacity = pulse
    // the lifted things fly out to the stand
    if (lift) {
      lift.t += dt / 1.6
      const k = ease(Math.min(1, lift.t))
      const o = lift.what === 'coal' ? coalBlock : flask
      const to = REST[lift.what]
      o.visible = true
      o.position.lerpVectors(lift.from, to, k)
      o.position.z += Math.sin(k * Math.PI) * 0.9
      o.position.y += Math.sin(k * Math.PI) * 0.5
      o.rotation.y = k * TAU
      if (lift.t >= 1) {
        o.position.copy(to)
        lift = null
      }
    }
    coalWord.visible = F.coal && !(lift?.what === 'coal')
    oilWord.visible = F.oil && !(lift?.what === 'oil')
    if (F.coal && lift?.what !== 'coal') coalBlock.rotation.y += dt * 0.4
  })
  const showLifted = () => {
    coalBlock.visible = F.coal
    flask.visible = F.oil
    if (F.coal) coalBlock.position.copy(REST.coal)
    if (F.oil) flask.position.copy(REST.oil)
  }

  // =====================================================================================
  // 2. The Keeling curve on the observatory's wall
  // =====================================================================================
  const lab = new THREE.Group()
  lab.position.set(LAB.x, 0, LAB.z)
  root.add(lab)
  const FRONT = LAB.d / 2 // the south face, local z
  {
    const body = wall(LAB.w, LAB.h, LAB.d)
    body.position.y = LAB.h / 2
    lab.add(body)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(LAB.w + 0.3, 0.18, LAB.d + 0.3), M.dark)
    roof.position.y = LAB.h + 0.09
    lab.add(roof)
    solids.push(box(LAB.x, LAB.z, LAB.w + 0.2, LAB.d + 0.2))
    // a small dome and a weather mast on the roof
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 12, 0, TAU, 0, Math.PI / 2), M.white)
    dome.position.set(3.4, LAB.h + 0.18, -0.6)
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.5, 24), M.white)
    drum.position.set(3.4, LAB.h + 0.18 - 0.0, -0.6)
    dome.position.y += 0.25
    drum.position.y += 0.25 - 0.25 / 2 + 0.0
    lab.add(dome, drum)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8), M.steel)
    mast.position.set(-3.8, LAB.h + 1.6, -0.8)
    lab.add(mast)
    const cups = new THREE.Group()
    cups.position.set(-3.8, LAB.h + 3.25, -0.8)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 6), M.steel)
      arm.rotation.z = Math.PI / 2
      arm.position.set(Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18)
      arm.rotation.y = -a
      const cup = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 6, 0, TAU, 0, Math.PI / 2), M.white)
      cup.position.set(Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36)
      cup.rotation.z = Math.PI / 2
      cup.rotation.y = -a
      cups.add(arm, cup)
    }
    lab.add(cups)
    updates.push(dt => (cups.rotation.y += dt * 2.2))
    // warm windows at the ends, a door on the west side
    const glass = new THREE.MeshStandardMaterial({ color: '#3a3020', emissive: '#ffb35a', emissiveIntensity: 0.45, roughness: 0.3 })
    for (const x of [-4.1, 4.4]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.55), glass)
      w.position.set(x, 2.6, FRONT + 0.035)
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.71, 0.04), M.dark)
      frame.position.set(x, 2.6, FRONT)
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.02), M.dark)
      bar.position.set(x, 2.6, FRONT + 0.05)
      lab.add(frame, w, bar)
    }
    const door = new THREE.Mesh(new RoundedBoxGeometry(0.12, 2.0, 1.0, 2, 0.03), M.dark)
    door.position.set(-LAB.w / 2 - 0.05, 1.0, 0.6)
    lab.add(door)
    // the observatory's name over the chart
    const name = makeText('MAUNA LOA OBSERVATORY   3397 m', { size: 0.24, color: '#2a3550', anchorY: 'middle' })
    name.position.set(0, LAB.h - 0.3, FRONT + 0.02)
    lab.add(name)
  }
  // the tower behind, its intake high up where the air is clean; a red light on top
  const tower = new THREE.Group()
  tower.position.set(TOWER.x, 0, TOWER.z)
  root.add(tower)
  {
    const s = 0.5
    for (const [x, z] of [[-s, -s], [s, -s], [-s, s], [s, s]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, TOWER.h, 6), M.steel)
      post.position.set(x, TOWER.h / 2, z)
      tower.add(post)
    }
    const braceGeo = new THREE.CylinderGeometry(0.015, 0.015, Math.hypot(2 * s, 1.6), 4)
    const n = Math.floor(TOWER.h / 1.6)
    const braces = new THREE.InstancedMesh(braceGeo, M.steel, n * 4)
    const o = new THREE.Object3D()
    let k = 0
    for (let i = 0; i < n; i++) {
      for (let f = 0; f < 4; f++) {
        const a = (f / 4) * TAU
        o.position.set(Math.sin(a) * s, 0.8 + i * 1.6, Math.cos(a) * s)
        o.rotation.set(0, a, (i + f) % 2 ? Math.atan2(2 * s, 1.6) : -Math.atan2(2 * s, 1.6))
        o.updateMatrix()
        braces.setMatrixAt(k++, o.matrix)
      }
    }
    tower.add(braces)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 1.4), M.steel)
    deck.position.y = TOWER.h
    tower.add(deck)
    const intake = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 12, 1, true), M.white)
    intake.rotation.x = Math.PI
    intake.position.set(0.55, TOWER.h + 0.5, 0.55)
    tower.add(intake)
    const beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ff3a24', 2.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    beacon.position.y = TOWER.h + 0.45
    beacon.scale.setScalar(1.1)
    tower.add(beacon)
    updates.push((dt, t) => (beacon.material.opacity = t % 2 < 1 ? 1 : 0.15))
    solids.push(box(TOWER.x, TOWER.z, 1.3, 1.3))
  }

  // the chart: a dark screen in a glowing frame, the axes painted, the curve a ribbon drawn month by month
  const CHW = 5.6
  const CHH = 3.0
  const chart = new THREE.Group()
  chart.position.set(LAB.x, 2.15, LAB.z + FRONT + 0.06)
  root.add(chart)
  const chartEdge = edgeOf()
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(CHW + 0.14, CHH + 0.14, 0.06, 2, 0.025), chartEdge.mat)
    frame.position.z = -0.045
    chart.add(frame)
  }
  const P = { x0: -CHW / 2 + 0.62, x1: CHW / 2 - 0.22, y0: -CHH / 2 + 0.38, y1: CHH / 2 - 0.66, ya: 1955, yb: 2030, p0: 270, p1: 440 }
  const cx = year => P.x0 + ((year - P.ya) / (P.yb - P.ya)) * (P.x1 - P.x0)
  const cy = ppm => P.y0 + ((ppm - P.p0) / (P.p1 - P.p0)) * (P.y1 - P.y0)
  const BW = 1400
  const BH = Math.round((BW * CHH) / CHW)
  const bx = x => ((x + CHW / 2) / CHW) * BW
  const by = y => ((CHH / 2 - y) / CHH) * BH
  /** Text on a canvas with the digit after a letter set as a subscript (CO2 -> CO₂). */
  const chemText = (g, text, x, y, size, align = 'left') => {
    const parts = [...String(text).matchAll(/([A-Za-z])(\d)|./gu)].flatMap(m => (m[2] ? [[m[1], 0], [m[2], 1]] : [[m[0], 0]]))
    const width = parts.reduce((s, [c, sub]) => {
      g.font = `700 ${sub ? size * 0.66 : size}px Outfit`
      return s + g.measureText(c).width
    }, 0)
    let px = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x
    g.textAlign = 'left'
    for (const [c, sub] of parts) {
      g.font = `700 ${sub ? size * 0.66 : size}px Outfit`
      g.fillText(c, px, y + (sub ? size * 0.22 : 0))
      px += g.measureText(c).width
    }
  }
  const chartTex = canvasTex(BW, BH, (g, w, h) => {
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(150,170,255,0.16)'
    g.lineWidth = 2
    g.font = '700 26px Outfit'
    g.fillStyle = '#b8c4ff'
    g.textBaseline = 'middle'
    for (let p = 280; p <= 440; p += 20) {
      g.beginPath()
      g.moveTo(bx(P.x0), by(cy(p)))
      g.lineTo(bx(P.x1), by(cy(p)))
      g.stroke()
      g.textAlign = 'right'
      g.fillText(String(p), bx(P.x0) - 12, by(cy(p)))
    }
    for (let y = 1960; y <= 2020; y += 10) {
      g.beginPath()
      g.moveTo(bx(cx(y)), by(P.y0))
      g.lineTo(bx(cx(y)), by(P.y1))
      g.stroke()
      g.textAlign = 'center'
      g.fillText(String(y), bx(cx(y)), by(P.y0) + 24)
    }
    g.strokeStyle = 'rgba(190,205,255,0.6)'
    g.beginPath()
    g.moveTo(bx(P.x0), by(P.y1))
    g.lineTo(bx(P.x0), by(P.y0))
    g.lineTo(bx(P.x1), by(P.y0))
    g.stroke()
    g.fillStyle = hdrCss(color)
    g.textBaseline = 'alphabetic'
    chemText(g, E.curve.chart.title, bx(-CHW / 2 + 0.2), by(CHH / 2 - 0.26), 46)
    g.fillStyle = '#b8c4ff'
    g.font = '700 24px Outfit'
    g.textAlign = 'left'
    g.fillText(E.curve.chart.unit, bx(P.x0) + 8, by(P.y1) - 14)
    g.textAlign = 'right'
    g.fillStyle = 'rgba(184,196,255,0.7)'
    g.font = '500 20px Outfit'
    g.fillText(E.curve.chart.source, bx(P.x1), by(-CHH / 2 + 0.07))
  })
  function hdrCss(c) {
    return new THREE.Color(c).getStyle()
  }
  textures.push(chartTex)
  const board = new THREE.Mesh(new THREE.PlaneGeometry(CHW, CHH), new THREE.MeshBasicMaterial({ map: chartTex }))
  chart.add(board)
  // the curve: a ribbon through every month, shown up to the month drawn
  const ribbon = (() => {
    const pos = new Float32Array(NM * 2 * 3)
    const idx = []
    const wdt = 0.018
    for (let i = 0; i < NM; i++) {
      const a = MONTHS[Math.max(0, i - 1)]
      const b = MONTHS[Math.min(LAST, i + 1)]
      const dx = cx(yearOf(Math.min(LAST, i + 1))) - cx(yearOf(Math.max(0, i - 1)))
      const dy = cy(b.v) - cy(a.v)
      const l = Math.hypot(dx, dy) || 1
      const nx = (-dy / l) * wdt
      const ny = (dx / l) * wdt
      const x = cx(yearOf(i))
      const y = cy(MONTHS[i].v)
      pos.set([x + nx, y + ny, 0.012, x - nx, y - ny, 0.012], i * 6)
      if (i < LAST) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 2, i * 2 + 1, i * 2 + 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(idx)
    return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: hdr('#ff7a52', 1.35), toneMapped: false, side: THREE.DoubleSide }))
  })()
  chart.add(ribbon)
  const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ffd0b0', 2.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  dot.scale.setScalar(0.22)
  dot.raycast = () => {}
  chart.add(dot)
  // the year and its CO2, top right (kept below white: big white words bloom into a blur)
  const readout = makeText('', { size: 0.2, color: '#d9c2b4', anchorX: 'right', anchorY: 'middle' })
  readout.position.set(CHW / 2 - 0.24, CHH / 2 - 0.2, 0.02)
  chart.add(readout)
  // the line before factories, from the ice
  const iceLineTex = canvasTex(512, 16, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#ffffff'
    for (let x = 0; x < w; x += 24) g.fillRect(x, 4, 14, 8)
  })
  textures.push(iceLineTex)
  const iceMat = new THREE.MeshBasicMaterial({ map: iceLineTex, color: hdr('#7fd4ff', 1.3), transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  const iceLine = new THREE.Mesh(new THREE.PlaneGeometry(P.x1 - P.x0, 0.035), iceMat)
  iceLine.position.set((P.x0 + P.x1) / 2, cy(280), 0.01)
  iceLine.raycast = () => {}
  chart.add(iceLine)
  // one line in every language, ending before the inset
  const iceWord = makeText(E.curve.chart.before, { size: 0.1, color: '#9fe0ff', anchorX: 'left', anchorY: 'bottom', maxWidth: 2.85 })
  iceWord.position.set(P.x0 + 0.08, cy(280) + 0.05, 0.02)
  iceWord.fillOpacity = 0
  chart.add(iceWord)
  // one year up close (an inset in the empty corner under the curve)
  const IW = 1.72
  const IH = 0.86
  const insetTex = canvasTex(640, 336, null, { mipmaps: false })
  textures.push(insetTex)
  const insetMat = new THREE.MeshBasicMaterial({ map: insetTex, transparent: true, opacity: 0, depthWrite: false })
  const inset = new THREE.Mesh(new THREE.PlaneGeometry(IW, IH), insetMat)
  // under the curve's last twenty years and over the line of 280 ppm, clear of both
  inset.position.set(P.x1 - IW / 2 - 0.05, P.y0 + IH / 2 + 0.24, 0.02)
  inset.raycast = () => {}
  chart.add(inset)
  let insetKey = ''
  function drawInset(year, vals, cursor) {
    const key = `${year}|${cursor.toFixed(2)}|${lang}`
    if (key === insetKey) return
    insetKey = key
    insetTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = 'rgba(20,28,70,0.96)'
      g.strokeStyle = 'rgba(160,180,255,0.6)'
      g.lineWidth = 3
      g.beginPath()
      g.roundRect(2, 2, w - 4, h - 4, 16)
      g.fill()
      g.stroke()
      g.fillStyle = '#ffffff'
      g.textBaseline = 'middle'
      g.font = '700 30px Outfit'
      g.textAlign = 'left'
      g.fillText(`${E.curve.chart.year}: ${year}`, 22, 30)
      const lo = Math.min(...vals) - 0.6
      const hi = Math.max(...vals) + 0.6
      const ix = m => 50 + (m / 11) * (w - 100)
      const iy = v => h - 62 - ((v - lo) / (hi - lo)) * (h - 150)
      // summer (leaves out) and the rest
      g.fillStyle = 'rgba(80,190,90,0.18)'
      g.fillRect(ix(4) , 58, ix(8.5) - ix(4), h - 108)
      g.fillStyle = 'rgba(200,130,60,0.14)'
      g.fillRect(ix(8.5), 58, ix(11) - ix(8.5) + 20, h - 108)
      g.fillRect(ix(0) - 20, 58, ix(4) - ix(0) + 20, h - 108)
      g.strokeStyle = '#ff7a52'
      g.lineWidth = 5
      g.beginPath()
      vals.forEach((v, m) => (m ? g.lineTo(ix(m), iy(v)) : g.moveTo(ix(m), iy(v))))
      g.stroke()
      g.fillStyle = '#ffd0b0'
      vals.forEach((v, m) => {
        g.beginPath()
        g.arc(ix(m), iy(v), 5, 0, TAU)
        g.fill()
      })
      g.font = '700 24px Outfit'
      g.textAlign = 'center'
      E.curve.chart.months.forEach((mo, m) => {
        g.fillStyle = m >= 4 && m <= 8 ? '#9be28f' : '#e8b98a'
        g.fillText(mo, ix(m), h - 30)
      })
      g.font = '700 20px Outfit'
      g.fillStyle = '#bff0b4'
      chemText(g, E.curve.chart.summer, ix(6.2), 72, 20, 'center')
      g.fillStyle = '#f0c8a0'
      chemText(g, E.curve.chart.winter, ix(1.8), h - 84, 20, 'center')
      if (cursor >= 0) {
        const m = Math.min(11, cursor)
        const m0 = Math.floor(m)
        const v = lerp(vals[m0], vals[Math.min(11, m0 + 1)], m - m0)
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(ix(m), iy(v), 10, 0, TAU)
        g.fill()
      }
    })
  }

  // the analyser, right of the chart: air from the tower comes down a line into it
  const ANA = { x: LAB.x + 3.75, z: LAB.z + FRONT + 0.4 }
  const analyser = new THREE.Group()
  analyser.position.set(ANA.x, 0, ANA.z)
  root.add(analyser)
  const anaGlow = new THREE.MeshStandardMaterial({ color: '#5cff9a', emissive: '#2bff7a', emissiveIntensity: 0.6, roughness: 0.5 })
  const anaText = makeText('', { size: 0.1, color: '#b6ffcf', anchorY: 'middle' })
  {
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.9, 1.5, 0.6, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#b9bcc4', roughness: 0.6, metalness: 0.2 }))
    cab.position.y = 0.75
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.26), M.navy)
    scr.position.set(0, 1.18, 0.305)
    anaText.position.set(0, 1.18, 0.31)
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), anaGlow)
    lamp.position.set(0.32, 1.42, 0.3)
    // a strip-chart recorder window, as Keeling's had
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.36), new THREE.MeshStandardMaterial({ color: '#efe8d8', roughness: 0.8, emissive: '#3a352a', emissiveIntensity: 0.4 }))
    strip.position.set(0, 0.74, 0.305)
    const word = makeText(E.curve.chart.analyser, { size: 0.085, color: '#1d2335', anchorY: 'middle' })
    word.position.set(0, 0.4, 0.31)
    analyser.add(cab, scr, anaText, lamp, strip, word)
    solids.push(box(ANA.x, ANA.z, 1.0, 0.7))
  }
  // the sample line: from the intake down the tower, over the roof, down the wall into the analyser
  const linePath = new THREE.CatmullRomCurve3([
    V3(TOWER.x + 0.55, TOWER.h + 0.38, TOWER.z + 0.55),
    V3(TOWER.x + 0.55, TOWER.h - 1, TOWER.z + 0.55),
    V3(TOWER.x + 0.55, LAB.h + 0.5, TOWER.z + 0.55),
    V3(ANA.x - 0.05, LAB.h + 0.4, LAB.z - 0.8),
    V3(ANA.x, LAB.h + 0.3, LAB.z + FRONT + 0.1),
    V3(ANA.x, LAB.h - 0.6, LAB.z + FRONT + 0.15),
    V3(ANA.x, 1.6, ANA.z - 0.1),
  ], false, 'catmullrom', 0.1)
  {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(linePath, 140, 0.03, 6), new THREE.MeshStandardMaterial({ color: '#c9ccd4', roughness: 0.5 }))
    root.add(tube)
  }
  const puffs = Array.from({ length: 4 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#bfe8ff', 2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(0.35)
    s.visible = false
    s.raycast = () => {}
    root.add(s)
    return s
  })
  // the ice core, left of the chart: a metre of Antarctic ice on a cold case, its bubbles of old air
  const ICE = { x: LAB.x - 3.75, z: LAB.z + FRONT + 0.55 }
  const iceCase = new THREE.Group()
  iceCase.position.set(ICE.x, 0, ICE.z)
  root.add(iceCase)
  const iceGlow = new THREE.MeshStandardMaterial({ color: '#dff4ff', emissive: '#7fd4ff', emissiveIntensity: 0.25, transparent: true, opacity: 0.82, roughness: 0.15 })
  const bubbleMat = new THREE.PointsMaterial({ map: glow, color: hdr('#ffffff', 1.2), size: 0.035, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  {
    const chest = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.85, 0.75, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#e8eef6', roughness: 0.5 }))
    chest.position.y = 0.425
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.65), new THREE.MeshStandardMaterial({ color: '#9fd8ff', emissive: '#2a6a9a', emissiveIntensity: 0.6, transparent: true, opacity: 0.6 }))
    lid.position.y = 0.865
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 20), iceGlow)
    core.rotation.z = Math.PI / 2
    core.position.y = 0.98
    for (const x of [-0.35, 0.35]) {
      const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.18), M.dark)
      cradle.position.set(x, 0.91, 0)
      iceCase.add(cradle)
    }
    const bpos = []
    const rnd = random(280)
    for (let i = 0; i < 90; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * 0.05
      bpos.push(-0.45 + rnd() * 0.9, 0.98 + Math.sin(a) * r, Math.cos(a) * r)
    }
    const bg = new THREE.BufferGeometry()
    bg.setAttribute('position', new THREE.Float32BufferAttribute(bpos, 3))
    const bubbles = new THREE.Points(bg, bubbleMat)
    bubbles.raycast = () => {}
    const word = makeText(E.curve.chart.ice, { size: 0.085, color: '#1d2335', anchorY: 'middle' })
    word.position.set(0, 0.6, 0.38)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.5), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 1.0
    iceCase.add(chest, lid, core, bubbles, word, hit)
    iceCase.rotation.y = 0
    solids.push(box(ICE.x, ICE.z, 1.3, 0.85))
  }
  // the little tree in its pot, beside the analyser, that leafs out and loses its leaves in one year
  const TREE = { x: LAB.x + 5.2, z: LAB.z + FRONT + 1.5 }
  const tree = new THREE.Group()
  tree.position.set(TREE.x, 0, TREE.z)
  root.add(tree)
  const leafMatT = new THREE.MeshStandardMaterial({ color: '#5fae46', roughness: 0.8, emissive: '#1f4a16', emissiveIntensity: 0.5 })
  const leaves = []
  {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.6, 18), new THREE.MeshStandardMaterial({ color: '#8a4f32', roughness: 0.9 }))
    pot.position.y = 0.3
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.4, 18).rotateX(-Math.PI / 2), mudMat)
    soil.position.y = 0.58
    tree.add(pot, soil)
    const wood = new THREE.MeshStandardMaterial({ color: '#5a4030', roughness: 0.9 })
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 1.3, 8), wood)
    trunk.position.y = 1.2
    tree.add(trunk)
    const rnd = random(64)
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + rnd()
      const tip = V3(Math.cos(a) * 0.45, 1.75 + rnd() * 0.45, Math.sin(a) * 0.45)
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.025, tip.distanceTo(V3(0, 1.6, 0)), 5), wood)
      b.position.copy(tip).add(V3(0, 1.6, 0)).multiplyScalar(0.5)
      b.quaternion.setFromUnitVectors(V3(0, 1, 0), tip.clone().sub(V3(0, 1.6, 0)).normalize())
      tree.add(b)
      const l = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24 + rnd() * 0.08, 0), leafMatT)
      l.position.copy(tip)
      tree.add(l)
      leaves.push(l)
    }
    const top = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), leafMatT)
    top.position.set(0, 2.15, 0)
    tree.add(top)
    leaves.push(top)
    solids.push(circle(TREE.x, TREE.z, 0.45))
  }
  // little CO2 molecules going into the leaves (summer) and coming out of the soil (winter)
  const mini = new THREE.Group()
  tree.add(mini)
  const minis = []
  {
    const cm = new THREE.MeshStandardMaterial({ color: C_COL, roughness: 0.4, emissive: '#22252c', emissiveIntensity: 0.6 })
    const om = new THREE.MeshStandardMaterial({ color: O_COL, roughness: 0.4, emissive: '#5a0d0b', emissiveIntensity: 0.6 })
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group()
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), cm)
      g.add(c)
      for (const s of [-1, 1]) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), om)
        o.position.x = s * 0.06
        g.add(o)
      }
      g.visible = false
      mini.add(g)
      minis.push({ g, a: (i / 6) * TAU, ph: i / 6 })
    }
  }

  // ---- the curve's steps ----
  const RATE = 90 // months drawn a second while measuring
  // upto: the month drawn to; from: where a measuring run began (what is shared while it runs, so every
  // screen agrees and a latecomer runs on by the time since); year: the tree's years played (a count)
  const K = { upto: 0, from: 0, run: false, ice: false, year: 0 }
  let shown = 0 // the months shown (eases toward upto)
  let iceK = 0
  let yearT = -1 // the tree's year, 0 to 12 months, while it plays
  let curveMine = false
  const curvePanel = lv => ({
    title: E.curve.title,
    color,
    blocks: [
      { slider: { label: E.curve.slider, min: 1958.25, max: yearOf(LAST), step: 1 / 12, value: yearOf(K.upto), live: () => yearOf(Math.round(shown)), format: v => String(MONTHS[indexOf(v)].y), onInput: v => setYear(v) } },
      { buttons: [['measure', () => curveStep('analyser')], ['tree', () => curveStep('tree')], ['ice', () => curveStep('ice')], ['start', () => curveStep('start')]].map(([k, f]) => ({ label: E.curve.buttons[k], onClick: f })) },
      ...ps(lv)(E.curve.panel),
    ],
  })
  const curveChanged = (delay = 3) => {
    curveMine = true
    ex.discover('curve', curvePanel, delay)
    share('curve')
  }
  let saidToday = false
  function curveStep(step) {
    const lv = level()
    if (step === 'analyser') {
      if (K.upto >= LAST) {
        say(at(E.curve.says.today, lv))
        curveChanged()
        return
      }
      K.run = true
      K.from = Math.round(K.upto)
      K.upto = K.from
      saidToday = false
      play('beam')
      say(at(E.curve.says.measure, lv))
    } else if (step === 'tree') {
      if (yearT >= 0) return say(at(W.busy, lv))
      K.year++
      yearT = 0
      play('join')
      say(at(E.curve.says.tree, lv))
    } else if (step === 'ice') {
      K.ice = true
      play('electron')
      say(at(E.curve.says.ice, lv))
    } else if (step === 'start') {
      K.upto = 0
      K.run = false
      shown = 0
      say(at(E.curve.says.start, lv))
    } else return
    curveChanged()
  }
  let yearSend = null
  function setYear(v, now = false) {
    K.upto = indexOf(Number(v))
    K.run = false
    shown = K.upto
    curveMine = true
    ex.discover('curve', curvePanel, 3)
    if (now) {
      share('curve')
      return
    }
    if (!yearSend) {
      yearSend = setTimeout(() => {
        yearSend = null
        share('curve')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(yearSend))
  const curveHint = () => {
    const H = E.curve.hints
    if (K.run) return H.wait
    if (K.upto === 0) return H.analyser
    if (K.year === 0) return H.tree
    if (!K.ice) return H.ice
    return H.slide
  }
  ex.add({
    id: 'curve',
    manual: true,
    x: CSPOT.x,
    z: CSPOT.z,
    radius: 2.4,
    label: E.curve.label,
    verb: curveHint,
    screens: [chartEdge],
    focus: { x: LAB.x + 0.3, y: 1.75, z: LAB.z + FRONT, size: 7.4 },
    act: () => ctx.showPanel(curvePanel),
  })
  clickable(analyser, () => curveStep('analyser'), { reach: 8 })
  clickable(iceCase, () => curveStep('ice'), { reach: 8 })
  clickable(tree, () => curveStep('tree'), { reach: 8 })
  clickable(tower, () => curveStep('analyser'), { reach: 14 })

  const leafGreen = new THREE.Color('#5fae46')
  const leafAutumn = new THREE.Color('#d98a3a')
  updates.push((dt, t) => {
    if (K.run) {
      K.upto = Math.min(LAST, K.upto + RATE * dt)
      if (K.upto >= LAST) {
        K.upto = LAST
        K.run = false
        if (curveMine && !saidToday) {
          saidToday = true
          say(at(E.curve.says.today, level()))
        }
      }
      shown = K.upto
    } else shown = damp(shown, K.upto, 8, dt)
    const i = clamp(Math.round(shown), 0, LAST)
    ribbon.geometry.setDrawRange(0, Math.max(0, i) * 6)
    dot.position.set(cx(yearOf(i)), cy(MONTHS[i].v), 0.03)
    const mean = meanSoFar(i)
    syncText(readout, `${MONTHS[i].y}:  ${sci() ? num(mean, 2, lang) : Math.round(mean)} ppm`)
    syncText(anaText, `${num(MONTHS[i].v, 2, lang)} ppm`)
    anaGlow.emissiveIntensity = K.run ? 1.4 + Math.sin(t * 12) * 0.6 : 0.6
    // the air running down the line while measuring
    puffs.forEach((s, k) => {
      s.visible = K.run
      if (K.run) s.position.copy(linePath.getPointAt(((t * 0.45 + k / puffs.length) % 1)))
    })
    // the ice line
    iceK = damp(iceK, K.ice ? 1 : 0, 3, dt)
    iceMat.opacity = iceK
    iceWord.fillOpacity = iceK
    iceWord.visible = iceK > 0.01
    iceGlow.emissiveIntensity = 0.25 + (K.ice ? 0.35 + 0.15 * Math.sin(t * 2) : 0)
    bubbleMat.opacity = 0.6 + 0.4 * Math.sin(t * 3)
    // one year up close: the leaves, the little molecules, the cursor on the inset
    const yr = wholeYear(i)
    if (yearT >= 0) {
      yearT += dt * 2
      if (yearT >= 12.5) yearT = -1
    }
    const m = yearT >= 0 ? Math.min(12, yearT) : 6.5 // midsummer when not playing
    const grow = span(3.0, 4.5, m) * (1 - span(9.5, 10.8, m))
    const autumn = span(8.0, 9.3, m)
    for (const l of leaves) {
      l.scale.setScalar(Math.max(0.001, grow))
      l.visible = grow > 0.02
    }
    leafMatT.color.copy(leafGreen).lerp(leafAutumn, autumn)
    const into = m >= 4.5 && m <= 8.6
    minis.forEach(mo => {
      mo.g.visible = yearT >= 0
      if (!mo.g.visible) return
      const u = (t * 0.6 + mo.ph) % 1
      const from = into ? V3(Math.cos(mo.a) * 1.3, 2.6, Math.sin(mo.a) * 1.3) : V3(Math.cos(mo.a) * 0.2, 0.62, Math.sin(mo.a) * 0.2)
      const to = into ? V3(Math.cos(mo.a) * 0.3, 1.9, Math.sin(mo.a) * 0.3) : V3(Math.cos(mo.a) * 1.2, 2.6, Math.sin(mo.a) * 1.2)
      mo.g.position.lerpVectors(from, to, u)
      mo.g.rotation.set(t + mo.a, t * 0.7, 0)
    })
    const insetOn = K.year > 0
    insetMat.opacity = damp(insetMat.opacity, insetOn ? 1 : 0, 4, dt)
    inset.visible = insetMat.opacity > 0.01
    if (inset.visible) drawInset(yr.y, yr.v, yearT >= 0 ? Math.min(11, yearT) : -1)
  })

  // =====================================================================================
  // 3. The blanket: the ground's heat light under a column of air
  // =====================================================================================
  const bl = new THREE.Group()
  bl.position.set(BL.x, 0, BL.z)
  faceTo(bl, BSPOT.x, BSPOT.z)
  root.add(bl)
  const GY = 0.8 // the model ground
  const CR = 1.2 // the column's radius
  const CTOP = 4.2
  solids.push(circle(BL.x, BL.z, 1.45))
  const blEdge = edgeOf()
  {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.45, GY, 40), M.navy)
    plinth.position.y = GY / 2
    bl.add(plinth)
    for (const y of [GY, CTOP]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(CR + 0.04, 0.04, 8, 64), blEdge.mat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = y
      bl.add(ring)
    }
    // three posts, none in front of the visitor (local +z faces the station)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU - Math.PI / 2
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, CTOP - GY, 6), M.steel)
      post.position.set(Math.cos(a) * (CR + 0.04), (GY + CTOP) / 2, Math.sin(a) * (CR + 0.04))
      bl.add(post)
    }
    if (!light) {
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(CR, CR, CTOP - GY, 48, 1, true), new THREE.MeshStandardMaterial({ color: '#bcd4ff', transparent: true, opacity: 0.07, roughness: 0.05, metalness: 0.1, depthWrite: false, side: THREE.DoubleSide }))
      glass.position.y = (GY + CTOP) / 2
      glass.raycast = () => {}
      bl.add(glass)
    }
    const space = makeText(E.blanket.sign.space, { size: 0.16, color: '#cfe0ff', anchorY: 'bottom' })
    space.position.set(0, CTOP + 0.95, 0)
    bl.add(space)
  }
  // the ground: land, a bit of sea, the town; it glows faintly with the heat it gives off
  const groundTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#4b7a3a'
    g.fillRect(0, 0, w, w)
    const rnd = random(15)
    for (let i = 0; i < 500; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(40,80,30,0.5)' : 'rgba(120,150,70,0.4)'
      g.fillRect(rnd() * w, rnd() * w, 6, 6)
    }
    g.fillStyle = '#3a78a8'
    g.beginPath()
    g.ellipse(w * 0.82, w * 0.25, w * 0.3, w * 0.22, 0.4, 0, TAU)
    g.fill()
    g.strokeStyle = '#8a8478'
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(w * 0.1, w * 0.6)
    g.quadraticCurveTo(w * 0.5, w * 0.45, w * 0.9, w * 0.75)
    g.stroke()
  })
  textures.push(groundTex)
  const groundMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.9, emissive: '#ff3a1a', emissiveIntensity: 0.12 })
  const ground = new THREE.Mesh(new THREE.CircleGeometry(CR, 48).rotateX(-Math.PI / 2), groundMat)
  ground.position.y = GY + 0.005
  bl.add(ground)
  const heat = new THREE.PointLight('#ff4a2a', 0.8, 2.6, 2)
  heat.position.set(0, GY + 0.5, 0)
  bl.add(heat)
  // the coal power station and its chimney (back left)
  const plant = new THREE.Group()
  plant.position.set(-0.55, GY, -0.45)
  bl.add(plant)
  const chimneyTop = V3(0.1, 0.62, 0)
  {
    const hall = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.24), new THREE.MeshStandardMaterial({ color: '#7d7f88', roughness: 0.7 }))
    hall.position.y = 0.1
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.62, 12), new THREE.MeshStandardMaterial({ color: '#a3a6ae', roughness: 0.6 }))
    stack.position.set(0.1, 0.31, 0)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.037, 0.05, 12), new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.6 }))
    band.position.set(0.1, 0.55, 0)
    const pile = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.08, 10), new THREE.MeshStandardMaterial({ color: '#141418', roughness: 0.5 }))
    pile.position.set(-0.22, 0.04, 0.12)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.4), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.36
    plant.add(hall, stack, band, pile, hit)
  }
  // the wind turbine (back right) and the solar panels (front right)
  const turbine = new THREE.Group()
  turbine.position.set(0.4, GY, -0.6)
  bl.add(turbine)
  const rotor = new THREE.Group()
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.022, 0.75, 8), M.white)
    pole.position.y = 0.375
    rotor.position.set(0, 0.76, 0.03)
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.3, 0.008).translate(0, 0.15, 0), M.white)
      blade.rotation.z = (i / 3) * TAU
      rotor.add(blade)
    }
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), M.white)
    rotor.add(hub)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.1, 0.3), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.6
    turbine.add(pole, rotor, hit)
    turbine.rotation.y = -0.5
  }
  const solar = new THREE.Group()
  solar.position.set(0.25, GY, 0.55)
  bl.add(solar)
  const panelMat = new THREE.MeshStandardMaterial({ color: '#1d3f8a', roughness: 0.25, metalness: 0.5, emissive: '#16306a', emissiveIntensity: 0.4 })
  {
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.15), panelMat)
      p.position.set(-0.15 + (i % 2) * 0.3, 0.1, -0.1 + i * 0.13)
      p.rotation.x = -0.5
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 4), M.steel)
      leg.position.set(p.position.x, 0.05, p.position.z)
      solar.add(p, leg)
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.3, 0.5), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.12
    solar.add(hit)
  }
  // the forest (front left), a tree more for each one planted
  const forest = new THREE.Group()
  forest.position.set(-0.6, GY, 0.4)
  bl.add(forest)
  const pine = new THREE.MeshStandardMaterial({ color: '#2f7a3a', roughness: 0.8, emissive: '#0f2a12', emissiveIntensity: 0.5 })
  const trees = []
  {
    const spots = [[0, 0, 1], [0.16, 0.1, 0.8], [-0.14, 0.12, 0.85], [0.08, -0.16, 0.9], [-0.2, -0.08, 0.75], [0.24, -0.06, 0.7]]
    for (const [x, z, s] of spots) {
      const t = new THREE.Group()
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 8), pine)
      cone.position.y = 0.2
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.08, 5), mudMat)
      stem.position.y = 0.04
      t.add(cone, stem)
      t.position.set(x, 0, z)
      t.userData.s = s
      forest.add(t)
      trees.push(t)
    }
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.45, 10), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.22
    forest.add(hit)
  }
  // houses
  {
    const hm = new THREE.MeshStandardMaterial({ color: '#e8d8c0', roughness: 0.8 })
    const rm = new THREE.MeshStandardMaterial({ color: '#a8432e', roughness: 0.8 })
    for (const [x, z] of [[-0.05, -0.05], [0.12, 0.05], [-0.1, 0.18]]) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.08), hm)
      h.position.set(x, GY + 0.035, z)
      const r = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.05, 4), rm)
      r.position.set(x, GY + 0.095, z)
      r.rotation.y = Math.PI / 4
      bl.add(h, r)
    }
  }
  // the thermometer at the front: its red column rises a little with the CO2
  const thermo = new THREE.Group()
  // front right, clear of the line from the station to the turbine
  thermo.position.set(0.8, GY, 0.55)
  bl.add(thermo)
  const TH = 0.95
  const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 1, 10).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: hdr('#ff3b2a', 1.4), toneMapped: false }))
  {
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.16, TH + 0.2, 0.025, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#f2f4f8', roughness: 0.5, emissive: '#3a3f4a', emissiveIntensity: 0.5 }))
    back.position.set(0, 0.1 + (TH + 0.2) / 2, -0.05)
    const tubeT = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, TH, 12, 1, true), new THREE.MeshStandardMaterial({ color: '#e8f0ff', transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false }))
    tubeT.position.y = 0.16 + TH / 2
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), mercury.material)
    bulb.position.y = 0.12
    mercury.position.y = 0.14
    thermo.add(back, tubeT, bulb, mercury)
    for (let i = 1; i <= 7; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, 0.008), M.dark)
      tick.position.set(0.0, 0.16 + (i / 8) * TH, -0.03)
      tick.position.x = 0.055
      thermo.add(tick)
    }
    // on its left: a post of the column stands to its right
    const word = makeText(E.blanket.sign.warm, { size: 0.075, color: '#ffd0c0', anchorX: 'right', anchorY: 'middle', outlineWidth: 0.007, outlineColor: '#0b0f22' })
    word.position.set(-0.1, 0.16 + TH * 0.92, 0)
    thermo.add(word)
  }
  // the sun, a lamp over the column's back
  const sunLamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr(SUN, 2.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  sunLamp.position.set(-0.6, CTOP + 0.55, -0.7)
  sunLamp.scale.setScalar(0.7)
  sunLamp.raycast = () => {}
  bl.add(sunLamp)
  {
    const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new THREE.MeshBasicMaterial({ color: hdr(SUN, 1.6), toneMapped: false }))
    sunCore.position.copy(sunLamp.position)
    bl.add(sunCore)
    const w = makeText(E.blanket.sign.sun, { size: 0.1, color: '#ffe9a8', anchorX: 'right', anchorY: 'middle' })
    w.position.copy(sunLamp.position).add(V3(-0.2, 0, 0))
    bl.add(w)
    const irw = makeText(E.blanket.sign.ir, { size: 0.1, color: '#ffb0a0', anchorX: 'left', anchorY: 'middle', outlineWidth: 0.008, outlineColor: '#0b0f22' })
    irw.position.set(CR + 0.12, GY + 0.35, 0.3)
    irw.rotation.y = 0.5
    bl.add(irw)
  }
  // the legend: which pair is which, on a little stand at the front
  {
    const leg = new THREE.Group()
    leg.position.set(-CR - 0.5, 0, CR - 0.1)
    leg.rotation.y = 0.5
    bl.add(leg)
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.62, 0.05, 2, 0.02), M.navy)
    plate.position.y = 1.15
    plate.rotation.x = -0.3
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 6), M.steel)
    stem.position.y = 0.42
    leg.add(plate, stem)
    const rows = [[[N_COL, N_COL], 'N2', E.blanket.sign.n2], [[O_COL, O_COL], 'O2', E.blanket.sign.o2], [[O_COL, C_COL, O_COL], 'CO2', E.blanket.sign.co2]]
    rows.forEach(([cols, f, word], r) => {
      const row = new THREE.Group()
      row.position.set(-0.36, 0.2 - r * 0.18, 0.03)
      cols.forEach((c, k) => {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, emissive: c, emissiveIntensity: 0.25 }))
        s.position.x = k * 0.06
        row.add(s)
      })
      const ft = formulaText(f, { size: 0.07, color: '#ffffff' })
      ft.position.set(0.24, 0, 0)
      const wt = makeText(word, { size: 0.055, color: '#cdd6ff', anchorX: 'left', anchorY: 'middle' })
      wt.position.set(0.36, 0, 0)
      row.add(ft, wt)
      plate.add(row)
    })
    bl.updateMatrixWorld(true)
    const p = leg.getWorldPosition(new THREE.Vector3())
    solids.push(circle(p.x, p.z, 0.2))
  }

  // ---- the air: nitrogen and oxygen pairs, and CO2 molecules ----
  const NN2 = 16
  const NO2 = 5
  const NCO2 = 20
  const NMOL = NN2 + NO2 + NCO2
  const rndM = random(2026)
  const mols = []
  const randomSpot = (rnd = Math.random) => {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (CR - 0.22)
    return V3(Math.cos(a) * r, GY + 0.45 + rnd() * (CTOP - GY - 0.7), Math.sin(a) * r)
  }
  for (let i = 0; i < NMOL; i++) {
    const kind = i < NN2 ? 'n2' : i < NN2 + NO2 ? 'o2' : 'co2'
    mols.push({
      kind,
      home: randomSpot(rndM),
      pos: V3(0, 0, 0),
      ph: rndM() * 100,
      spin: V3(rndM() - 0.5, rndM() - 0.5, rndM() - 0.5).normalize(),
      q: new THREE.Quaternion(),
      on: kind !== 'co2',
      k: kind !== 'co2' ? 1 : 0, // how present (0 gone, 1 here)
      excite: 0, // seconds of wobbling left
      emitAt: -1, // re-emits when excite runs below this
      flight: null, // { from, to, t, out }
      mark: 0, // a ring shown after a tap
    })
  }
  const CO2S = mols.filter(m => m.kind === 'co2')
  const sphere = new THREE.SphereGeometry(1, 14, 10)
  const atomMat = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.1, emissive: c, emissiveIntensity: c === C_COL ? 0.35 : 0.22 })
  const nMesh = new THREE.InstancedMesh(sphere, atomMat(N_COL), NN2 * 2)
  const oMesh = new THREE.InstancedMesh(sphere, atomMat(O_COL), NO2 * 2 + NCO2 * 2)
  const cMesh = new THREE.InstancedMesh(sphere, atomMat(C_COL), NCO2)
  for (const m of [nMesh, oMesh, cMesh]) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(m.count * 3).fill(1), 3)
    bl.add(m)
  }
  // one invisible ball round each molecule, for taps
  const hitMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ visible: false }), NMOL)
  hitMesh.frustumCulled = false
  bl.add(hitMesh)
  const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#9fd0ff', 1.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  ring.scale.setScalar(0.6)
  ring.raycast = () => {}
  bl.add(ring)
  let ringOn = null // the molecule last tapped, and how long the ring stays
  let ringT = 0

  // ---- light: heat light (infrared, drawn red and wavy) rising from the ground; sunlight coming down ----
  const squiggle = canvasTex(256, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.lineCap = 'round'
    // the top half: a wave (heat light); the bottom half: a straight ray (sunlight)
    for (const [lw, a] of [[10, 0.25], [4, 1]]) {
      g.strokeStyle = `rgba(255,255,255,${a})`
      g.lineWidth = lw
      g.beginPath()
      for (let x = 8; x <= w - 8; x += 2) {
        const y = h * 0.25 + Math.sin((x / (w - 16)) * TAU * 3) * h * 0.13
        x === 8 ? g.moveTo(x, y) : g.lineTo(x, y)
      }
      g.stroke()
      g.beginPath()
      g.moveTo(8, h * 0.75)
      g.lineTo(w - 8, h * 0.75)
      g.stroke()
    }
  }, { mipmaps: false })
  textures.push(squiggle)
  const NPH = light ? 26 : 48
  const phPos = new Float32Array(NPH * 4 * 3)
  const phCol = new Float32Array(NPH * 4 * 3)
  const phUv = new Float32Array(NPH * 4 * 2)
  const phIdx = []
  for (let i = 0; i < NPH; i++) phIdx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3)
  const phGeo = new THREE.BufferGeometry()
  phGeo.setAttribute('position', new THREE.BufferAttribute(phPos, 3))
  phGeo.setAttribute('color', new THREE.BufferAttribute(phCol, 3))
  phGeo.setAttribute('uv', new THREE.BufferAttribute(phUv, 2))
  phGeo.setIndex(phIdx)
  const phMesh = new THREE.Mesh(phGeo, new THREE.MeshBasicMaterial({ map: squiggle, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }))
  phMesh.frustumCulled = false
  phMesh.raycast = () => {}
  bl.add(phMesh)
  const phs = Array.from({ length: NPH }, () => ({ live: false, sun: false, p: V3(0, 0, 0), d: V3(0, 1, 0), age: 0, from: null, target: null, fade: 1 }))
  const flashes = Array.from({ length: 8 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr(IR, 1.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.raycast = () => {}
    bl.add(s)
    return { s, t: 9 }
  })
  let flashNext = 0
  const flash = (p, c) => {
    const f = flashes[flashNext]
    flashNext = (flashNext + 1) % flashes.length
    f.t = 0
    f.s.position.copy(p)
    f.s.material.color.copy(hdr(c, 1.6))
  }
  const freePh = () => phs.find(p => !p.live)
  const emit = (p, d, { sun = false, from = null, target = null, speed } = {}) => {
    const ph = freePh()
    if (!ph) return null
    Object.assign(ph, { live: true, sun, age: 0, from, target, fade: 1, speed: speed ?? (sun ? 2.0 : 1.05) })
    ph.p.copy(p)
    ph.d.copy(d).normalize()
    return ph
  }
  const randomDir = () => {
    const u = Math.random() * 2 - 1
    const a = Math.random() * TAU
    const s = Math.sqrt(1 - u * u)
    return V3(Math.cos(a) * s, u, Math.sin(a) * s)
  }
  let irClock = 0
  let sunClock = 0

  // ---- the blanket's steps ----
  const B = { n: 8, clean: false, trees: 2, burns: 0 }
  const did = { burn: false, catch: false, pass: false, help: false }
  const smoke = Array.from({ length: 6 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#9a9aa4'), transparent: true, opacity: 0, depthWrite: false }))
    s.raycast = () => {}
    bl.add(s)
    return { s, t: 9 }
  })
  let smokeNext = 0
  let smokeClock = 0
  const puffSmoke = (big = false) => {
    const f = smoke[smokeNext]
    smokeNext = (smokeNext + 1) % smoke.length
    f.t = 0
    f.big = big
  }
  const chimneyWorld = () => plant.localToWorld(chimneyTop.clone())
  const toBl = p => bl.worldToLocal(p.clone())
  const thermoLevel = n => Math.log(1 + n / 4) / Math.log(6)
  let thermoK = thermoLevel(B.n)
  /** Bring the CO2 molecules present to n: new ones rise from the chimney, gone ones go to the forest (or fade). */
  function settleCO2(live, why = '') {
    let on = CO2S.filter(m => m.on).length
    while (on < B.n) {
      const m = CO2S.find(q => !q.on)
      m.on = true
      m.home = randomSpot()
      if (live && why === 'burn') {
        m.flight = { from: toBl(chimneyWorld()), to: m.home.clone(), t: 0, out: false }
        m.k = 1
      } else if (!live) m.k = 1
      on++
    }
    while (on > B.n) {
      const m = [...CO2S].reverse().find(q => q.on)
      m.on = false
      if (live && why === 'tree') m.flight = { from: m.pos.clone(), to: forest.position.clone().add(V3(0, 0.3, 0)), t: 0, out: true }
      else if (!live) m.k = 0
      on--
    }
  }
  settleCO2(false)
  const blanketPanel = lv => ({
    title: E.blanket.title,
    color,
    blocks: [
      { slider: { label: E.blanket.slider, min: 0, max: NCO2, step: 1, value: B.n, live: () => B.n, format: v => (lv === 'scientist' ? `${v}  (≈ ${v * 35} ppm)` : String(v)), onInput: v => setAmount(v) } },
      { buttons: [['burn', () => blanketStep('chimney')], ['clean', () => blanketStep('turbine')], ['tree', () => blanketStep('trees')], ['catch', () => blanketStep('co2')]].map(([k, f]) => ({ label: E.blanket.buttons[k], onClick: f })) },
      ...ps(lv)(E.blanket.panel),
    ],
  })
  const blanketChanged = (delay = 3) => {
    ex.discover('blanket', blanketPanel, delay)
    share('blanket')
  }
  /** Send a heat ray from the ground straight up through a molecule (caught if it is CO2). */
  function shine(m) {
    const p = m.pos.clone()
    const ph = emit(V3(p.x, GY + 0.02, p.z), V3(0, 1, 0), { target: m.kind === 'co2' ? m : null, speed: 2.4 })
    ringOn = m
    ringT = 2.2
    return ph
  }
  function blanketStep(step, mol) {
    const lv = level()
    const says = E.blanket.says
    if (step === 'chimney') {
      if (B.n >= NCO2) return say(at(says.full, lv))
      const wasClean = B.clean
      B.clean = false
      B.n++
      B.burns++
      did.burn = true
      settleCO2(true, 'burn')
      puffSmoke(true)
      play('pop')
      say(at(wasClean ? says.again : says.burn, lv))
    } else if (step === 'co2') {
      const free = CO2S.filter(q => q.on && q.k > 0.9 && q.excite <= 0 && !q.flight)
      const m = mol ?? free[Math.floor(Math.random() * free.length)]
      if (!m) return say(at(says.none, lv))
      did.catch = true
      shine(m)
      play('electron')
      say(at(says.catch, lv))
      ex.discover('blanket', blanketPanel, 3)
      return
    } else if (step === 'n2' || step === 'o2') {
      did.pass = true
      shine(mol ?? mols.find(q => q.kind === step))
      play('tap')
      say(at(says[step], lv))
      ex.discover('blanket', blanketPanel, 3)
      return
    } else if (step === 'turbine' || step === 'solar') {
      did.help = true
      if (B.clean) return say(at(says.already, lv))
      B.clean = true
      play('select')
      say(at(says.clean, lv))
    } else if (step === 'trees') {
      did.help = true
      if (B.trees >= 4) return say(at(says.forest, lv))
      if (B.n <= 0) return say(at(says.bare, lv))
      B.trees++
      B.n--
      settleCO2(true, 'tree')
      play('join')
      say(at(says.tree, lv))
    } else return
    blanketChanged()
  }
  let amountSend = null
  function setAmount(v, now = false) {
    B.n = clamp(Math.round(Number(v)), 0, NCO2)
    settleCO2(false)
    ex.discover('blanket', blanketPanel, 3)
    if (now) {
      share('blanket')
      return
    }
    if (!amountSend) {
      amountSend = setTimeout(() => {
        amountSend = null
        share('blanket')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(amountSend))
  const blanketHint = () => {
    const H = E.blanket.hints
    if (!did.burn) return H.chimney
    if (!did.catch) return H.co2
    if (!did.pass) return H.air
    if (!did.help) return H.help
    return H.slide
  }
  bl.updateMatrixWorld(true)
  ex.add({
    id: 'blanket',
    manual: true,
    x: BSPOT.x,
    z: BSPOT.z,
    radius: 2.3,
    label: E.blanket.label,
    verb: blanketHint,
    screens: [blEdge],
    focus: { x: BL.x, y: 2.25, z: BL.z, size: 5.0 },
    act: () => ctx.showPanel(blanketPanel),
  })
  clickable(plant, () => blanketStep('chimney'), { reach: 7 })
  clickable(turbine, () => blanketStep('turbine'), { reach: 7 })
  clickable(solar, () => blanketStep('solar'), { reach: 7 })
  clickable(forest, () => blanketStep('trees'), { reach: 7 })
  clickable(hitMesh, h => {
    const m = mols[h.instanceId]
    if (m) blanketStep(m.kind, m)
  }, { reach: 7, accept: h => { const m = mols[h.instanceId]; return !!m && (m.kind !== 'co2' || (m.on && m.k > 0.5)) } })

  const o3 = new THREE.Object3D()
  const tmp = V3(0, 0, 0)
  const axisX = V3(1, 0, 0)
  const toCam = V3(0, 0, 0)
  const side = V3(0, 0, 0)
  const head = V3(0, 0, 0)
  const tail = V3(0, 0, 0)
  const camLocal = V3(0, 0, 0)
  const white = new THREE.Color(1, 1, 1)
  const hot = new THREE.Color(2.2, 1.2, 1.0)
  const col = new THREE.Color()
  updates.push((dt, t) => {
    // the molecules drift about their homes, turning slowly; CO2 bends while it holds heat light
    let ni = 0
    let oi = 0
    let ci = 0
    mols.forEach((m, idx) => {
      if (m.flight) {
        m.flight.t += dt / (m.flight.out ? 1.4 : 1.8)
        const k = ease(Math.min(1, m.flight.t))
        m.pos.lerpVectors(m.flight.from, m.flight.to, k)
        if (!m.flight.out) m.pos.y += Math.sin(k * Math.PI) * 0.4
        if (m.flight.out) m.k = 1 - span(0.75, 1, m.flight.t)
        if (m.flight.t >= 1) {
          if (m.flight.out) m.k = 0
          m.flight = null
        }
      } else {
        if (m.kind === 'co2') m.k = damp(m.k, m.on ? 1 : 0, 3, dt)
        const ph = m.ph
        m.pos.set(m.home.x + Math.sin(t * 0.37 + ph) * 0.14, m.home.y + Math.sin(t * 0.29 + ph * 1.7) * 0.16, m.home.z + Math.cos(t * 0.33 + ph * 0.6) * 0.14)
      }
      m.q.setFromAxisAngle(m.spin, t * 0.5 + m.ph)
      // holding heat light: the bend, and a warm glow; then it lets the light go in a random direction
      if (m.excite > 0) {
        m.excite -= dt
        if (m.excite <= 0) {
          const d = randomDir()
          emit(m.pos.clone().addScaledVector(d, 0.12), d, { from: m })
        }
      }
      const vis = m.k > 0.02
      const s = (m.kind === 'co2' ? 0.075 : 0.07) * (vis ? Math.max(0.05, m.k) : 0)
      const bend = m.excite > 0 ? Math.sin(t * 28) * 0.05 : 0
      const glowK = m.excite > 0 ? 1 : 0
      col.copy(white).lerp(hot, glowK)
      const put = (mesh, i, lx, ly) => {
        tmp.set(lx, ly, 0).applyQuaternion(m.q).add(m.pos)
        o3.position.copy(tmp)
        o3.scale.setScalar(s)
        o3.updateMatrix()
        mesh.setMatrixAt(i, o3.matrix)
        mesh.setColorAt(i, col)
      }
      if (m.kind === 'n2') {
        put(nMesh, ni++, -0.06, 0)
        put(nMesh, ni++, 0.06, 0)
      } else if (m.kind === 'o2') {
        put(oMesh, oi++, -0.065, 0)
        put(oMesh, oi++, 0.065, 0)
      } else {
        put(cMesh, ci++, 0, -bend * 0.6)
        put(oMesh, oi++, -0.13, bend)
        put(oMesh, oi++, 0.13, bend)
      }
      o3.position.copy(m.pos)
      o3.scale.setScalar(vis && (m.kind !== 'co2' || m.on) ? 1 : 0.0001)
      o3.updateMatrix()
      hitMesh.setMatrixAt(idx, o3.matrix)
    })
    for (const mesh of [nMesh, oMesh, cMesh, hitMesh]) mesh.instanceMatrix.needsUpdate = true
    for (const mesh of [nMesh, oMesh, cMesh]) mesh.instanceColor.needsUpdate = true
    hitMesh.computeBoundingSphere()
    // the ring round the molecule tapped
    if (ringT > 0 && ringOn) {
      ringT -= dt
      ring.position.copy(ringOn.pos)
      ring.material.opacity = Math.min(1, ringT) * 0.8
      ring.scale.setScalar(0.55 + 0.08 * Math.sin(t * 6))
    } else ring.material.opacity = 0
    // new heat light from the ground, sunlight from the lamp
    irClock -= dt
    if (irClock <= 0) {
      irClock = light ? 0.32 : 0.2
      const a = Math.random() * TAU
      const r = Math.sqrt(Math.random()) * (CR - 0.2)
      const tilt = 0.35
      emit(V3(Math.cos(a) * r, GY + 0.02, Math.sin(a) * r), V3((Math.random() - 0.5) * tilt, 1, (Math.random() - 0.5) * tilt))
    }
    sunClock -= dt
    if (sunClock <= 0) {
      sunClock = 0.7
      const a = Math.random() * TAU
      const r = Math.sqrt(Math.random()) * (CR - 0.3)
      const to = V3(Math.cos(a) * r, GY, Math.sin(a) * r)
      emit(sunLamp.position.clone(), to.sub(sunLamp.position), { sun: true })
    }
    // move the light; CO2 catches heat light that comes near it
    camLocal.copy(bl.worldToLocal(ctx.camera.position.clone()))
    let k4 = 0
    phCol.fill(0)
    for (const ph of phs) {
      if (!ph.live) continue
      ph.age += dt
      ph.p.addScaledVector(ph.d, ph.speed * dt)
      const r = Math.hypot(ph.p.x, ph.p.z)
      if (!ph.sun) {
        // caught by a CO2 molecule: the one aimed at, or any it passes close by (not the one that just let it go)
        const near = ph.target ?? CO2S.find(m => m.on && m.k > 0.9 && !m.flight && m.excite <= 0 && m !== ph.from && m.pos.distanceToSquared(ph.p) < 0.04)
        if (near && near.pos.distanceToSquared(ph.p) < 0.03 && near.excite <= 0) {
          near.excite = 0.55
          ph.live = false
          continue
        }
        if (ph.target && ph.p.y > ph.target.pos.y + 0.3) ph.target = null
      }
      if (ph.p.y < GY && ph.age > 0.1) {
        flash(ph.p.clone().setY(GY + 0.02), ph.sun ? SUN : IR)
        ph.live = false
        continue
      }
      if (ph.p.y > CTOP + 1.2 || r > CR + 0.6 || ph.age > 9) {
        ph.live = false
        continue
      }
      // fading out once it has left the column (up to space, or out at the side)
      ph.fade = ph.p.y > CTOP ? 1 - (ph.p.y - CTOP) / 1.2 : r > CR ? 1 - (r - CR) / 0.6 : 1
      const len = ph.sun ? 0.34 : 0.26
      head.copy(ph.p)
      tail.copy(ph.p).addScaledVector(ph.d, -len)
      toCam.subVectors(camLocal, ph.p)
      side.crossVectors(ph.d, toCam).normalize().multiplyScalar(0.05)
      const j = k4 * 4
      phPos.set([tail.x - side.x, tail.y - side.y, tail.z - side.z], j * 3)
      phPos.set([tail.x + side.x, tail.y + side.y, tail.z + side.z], (j + 1) * 3)
      phPos.set([head.x - side.x, head.y - side.y, head.z - side.z], (j + 2) * 3)
      phPos.set([head.x + side.x, head.y + side.y, head.z + side.z], (j + 3) * 3)
      const v0 = ph.sun ? 0 : 0.5
      phUv.set([0, v0, 0, v0 + 0.5, 1, v0, 1, v0 + 0.5], j * 2)
      const c = ph.sun ? [1.4, 1.15, 0.45] : [1.5, 0.42, 0.28]
      const a = Math.min(1, ph.age * 6) * ph.fade
      for (let q = 0; q < 4; q++) phCol.set([c[0] * a, c[1] * a, c[2] * a], (j + q) * 3)
      k4++
    }
    phGeo.setDrawRange(0, k4 * 6)
    phGeo.attributes.position.needsUpdate = true
    phGeo.attributes.color.needsUpdate = true
    phGeo.attributes.uv.needsUpdate = true
    for (const f of flashes) {
      f.t += dt
      f.s.material.opacity = Math.max(0, 1 - f.t / 0.35) * 0.9
      f.s.scale.setScalar(0.12 + f.t * 0.5)
      f.s.visible = f.t < 0.35
    }
    // the chimney smokes unless wind and sun make the power
    smokeClock -= dt
    if (!B.clean && smokeClock <= 0) {
      smokeClock = 0.9
      puffSmoke(false)
    }
    const top = plant.position.clone().add(chimneyTop)
    for (const f of smoke) {
      f.t += dt
      const life = f.big ? 2.2 : 1.6
      f.s.visible = f.t < life
      if (!f.s.visible) continue
      const u = f.t / life
      f.s.position.copy(top).add(V3(u * 0.15, u * (f.big ? 0.8 : 0.45), 0))
      f.s.scale.setScalar((f.big ? 0.16 : 0.09) + u * (f.big ? 0.4 : 0.18))
      f.s.material.opacity = (1 - u) * (f.big ? 0.75 : 0.35)
    }
    // the turbine turns (fast on wind power), the panels gleam
    rotor.rotation.z -= dt * (B.clean ? 5 : 0.8)
    panelMat.emissiveIntensity = B.clean ? 0.9 + 0.3 * Math.sin(t * 3) : 0.35
    // the forest: two trees, and one more for each planted
    trees.forEach((tr, k) => {
      const want = k < B.trees ? 1 : 0
      const s = damp(tr.scale.x, want * tr.userData.s, 3, dt)
      tr.scale.setScalar(Math.max(0.001, s))
      tr.visible = s > 0.01
    })
    // the thermometer: a little warmer with each CO2, each one adding a little less (the logarithm)
    thermoK = damp(thermoK, thermoLevel(B.n), 1.2, dt)
    mercury.scale.y = 0.12 + thermoK * (TH - 0.2)
    groundMat.emissiveIntensity = 0.1 + 0.12 * thermoK + 0.03 * Math.sin(t * 2)
    heat.intensity = 0.5 + 0.8 * thermoK
  })

  updates.push((dt, t) => stage.update(t))

  const toWorld = (o, p = V3(0, 0, 0)) => o.localToWorld(p.clone())
  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    cameraPitchMax: 0.4,
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0.05 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      forest: {
        tap: (thing, i) => (thing === 'dial' ? ctx.showPanel(forestPanel) : forestStep(thing, i)), // 'tree' (i 0..2), 'sea', 'coal', 'oil'
        time: v => setTime(v, true),
        at: (thing, i = 0) => {
          win.updateMatrixWorld(true)
          const st = strata()
          if (thing === 'tree') return toWorld(GIANTS[i].g, V3(0, 1.2, 0))
          if (thing === 'sea') return toWorld(win, V3(1.6, WL, -1.0))
          if (thing === 'coal') return toWorld(win, V3(-0.8, (st.peatBot + st.peatTop) / 2, -0.06))
          if (thing === 'oil') return toWorld(win, V3(DOMEX, oilY(st), -0.06))
          return toWorld(dial)
        },
        get state() {
          return { ...F, fallen: [...F.fallen] }
        },
      },
      curve: {
        tap: thing => curveStep(thing), // 'analyser', 'tree', 'ice', 'start'
        year: v => setYear(v, true),
        at: thing => toWorld({ analyser, tree, ice: iceCase }[thing] ?? analyser, V3(0, 1.0, 0)),
        get state() {
          return { ...K, shown }
        },
      },
      blanket: {
        tap: thing => blanketStep(thing), // 'chimney', 'turbine', 'solar', 'trees', 'co2', 'n2', 'o2'
        amount: v => setAmount(v, true),
        at: thing => {
          bl.updateMatrixWorld(true)
          if (thing === 'chimney') return chimneyWorld()
          if (thing === 'co2' || thing === 'n2' || thing === 'o2') {
            const m = mols.find(q => q.kind === thing && (thing !== 'co2' || q.on))
            return m ? toWorld(bl, m.pos) : toWorld(bl, V3(0, 2, 0))
          }
          return toWorld({ turbine, solar, trees: forest }[thing] ?? plant, V3(0, 0.2, 0))
        },
        get state() {
          return { ...B, caught: mols.filter(m => m.excite > 0).length, light: phs.filter(p => p.live).length }
        },
      },
    },
    panels: { forest: forestPanel, curve: curvePanel, blanket: blanketPanel },
    shared: {
      forest: {
        get: () => ({ fallen: F.fallen.map(Boolean), plankton: F.plankton, t: F.t, coal: F.coal, oil: F.oil }),
        set: (s, live) => {
          const fl = Array.isArray(s?.fallen) ? s.fallen.slice(0, 3).map(Boolean) : [false, false, false]
          while (fl.length < 3) fl.push(false)
          const newlyDown = fl.some((f, i) => f && !F.fallen[i])
          F.fallen = fl
          if (!live) fl.forEach((f, i) => (falls[i] = f ? 1 : 0))
          else if (newlyDown) play('crack')
          const p = Math.max(0, Math.min(9, Math.round(Number(s?.plankton) || 0)))
          if (live && p > F.plankton) snow = 2.4
          F.plankton = p
          const tv = Number(s?.t)
          F.t = Number.isFinite(tv) ? clamp(tv) : 0
          const coal = !!s?.coal
          const oil = !!s?.oil
          if (live && coal && !F.coal) startLift('coal')
          if (live && oil && !F.oil) startLift('oil')
          F.coal = coal
          F.oil = oil
          if (!live) {
            lift = null
            showLifted()
          }
          if (!F.coal) coalBlock.visible = false
          if (!F.oil) flask.visible = false
          refreshPanel(forestPanel)
        },
      },
      curve: {
        get: () => ({ upto: K.run ? K.from : Math.round(K.upto), run: K.run, ice: K.ice, year: K.year }),
        set: (s, live, ago = 0) => {
          const from = clamp(Math.round(Number(s?.upto) || 0), 0, LAST)
          const run = !!s?.run
          // a run under way runs on by the time since the state was taken
          const up = run ? Math.min(LAST, from + RATE * Math.max(0, Number(ago) || 0)) : from
          K.from = from
          K.upto = up
          K.run = run && up < LAST
          if (!live || K.run) shown = K.upto
          K.ice = !!s?.ice
          if (!live) iceK = K.ice ? 1 : 0
          const yr = Math.max(0, Math.round(Number(s?.year) || 0))
          if (live && yr > K.year && yearT < 0) yearT = 0
          K.year = yr
          refreshPanel(curvePanel)
        },
      },
      blanket: {
        get: () => ({ n: B.n, clean: B.clean, trees: B.trees, burns: B.burns }),
        set: (s, live) => {
          const n = clamp(Math.round(Number(s?.n) || 0), 0, NCO2)
          const trees = clamp(Math.round(Number(s?.trees) || 0), 0, 4)
          const burns = Math.max(0, Math.round(Number(s?.burns) || 0))
          const why = live && burns > B.burns ? 'burn' : live && trees > B.trees ? 'tree' : ''
          if (why === 'burn') puffSmoke(true)
          B.n = n
          B.trees = trees
          B.burns = burns
          B.clean = !!s?.clean
          settleCO2(live && !!why, why)
          if (!live) thermoK = thermoLevel(B.n)
          refreshPanel(blanketPanel)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const f of disposers) f()
      for (const tx of textures) tx.dispose()
    },
  }
}
