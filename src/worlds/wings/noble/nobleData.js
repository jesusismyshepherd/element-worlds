// The numbers the neon sign workshop shows, in one place (no three.js here, so the tests read them).
//
// Spectral lines: NIST Atomic Spectra Database (A. Kramida, Yu. Ralchenko, J. Reader and the NIST ASD
// Team, https://physics.nist.gov/asd, lines form), retrieved 2026-10-27, checked against the NIST
// Handbook of Basic Atomic Spectroscopic Data (strong lines). Observed wavelengths in air, in nm, with
// the database's relative intensities. Each gas's intensities come from its own sources and scale, so
// they compare only within one gas. Only the neutral atoms (He I, Ne I, Ar I, Kr I, Xe I, Rn I), which
// is what a low-pressure glow discharge such as a sign tube shows, between 380 and 750 nm; components
// of one multiplet closer than 0.1 nm are given once. Neon: every line of intensity 10000 or more;
// argon and krypton 100 or more; xenon 150 or more; helium and radon their ten strongest.
import { element } from '../../../data/elements.js'
import { traitsOf } from '../../../characters/traits.js'

/** The noble gases of the workshop, in the order of the table. */
export const GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']
/** The ones that go into signs: radon is radioactive and never does. */
export const SIGN_GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe']

/** The colour a gas glows in a tube: its Atomling's body colour (DISCHARGE in characters/traits.js),
 *  so the tubes and the Atomlings always agree. */
export const glowOf = sym => traitsOf(element(sym)).body

/** [wavelength in air (nm), NIST relative intensity] for each gas, by wavelength. */
export const LINES = {
  He: [[388.86, 500], [396.47, 20], [402.62, 50], [447.15, 200], [471.31, 30], [501.57, 100], [587.56, 500], [667.82, 100], [706.52, 200], [728.13, 50]],
  Ne: [
    [453.78, 10000], [470.44, 15000], [470.89, 12000], [471.01, 10000], [471.21, 15000], [471.53, 15000], [478.89, 10000],
    [482.73, 10000], [488.49, 10000], [495.70, 10000], [534.11, 10000], [540.06, 20000], [585.25, 20000], [588.19, 10000],
    [603.00, 10000], [607.43, 10000], [614.31, 10000], [616.36, 10000], [621.73, 10000], [626.65, 10000], [633.44, 10000],
    [638.30, 10000], [640.22, 20000], [650.65, 15000], [659.90, 10000], [692.95, 100000], [702.40, 34000], [703.24, 85000],
    [705.91, 10000], [717.39, 77000], [724.52, 77000], [743.89, 60000], [748.89, 32000],
  ],
  Ar: [
    [415.86, 400], [419.07, 100], [419.83, 200], [420.07, 400], [425.94, 200], [426.63, 100], [427.22, 150], [430.01, 100],
    [433.36, 100], [451.07, 100], [667.73, 100], [675.28, 150], [687.13, 150], [696.54, 10000], [703.03, 150], [706.72, 10000],
    [714.70, 1000], [727.29, 2000], [737.21, 200], [738.40, 10000],
  ],
  Kr: [
    [427.40, 1000], [428.30, 100], [431.86, 400], [431.96, 1000], [435.14, 100], [436.26, 500], [437.61, 800], [440.00, 200],
    [442.52, 100], [445.39, 600], [446.37, 800], [450.24, 600], [556.22, 500], [557.03, 2000], [564.96, 100], [583.29, 100],
    [587.09, 3000], [642.10, 100], [645.63, 200], [690.47, 100], [722.41, 100], [748.69, 100],
  ],
  Xe: [
    [396.75, 200], [419.35, 150], [473.42, 600], [479.26, 150], [480.70, 500], [482.97, 400], [484.33, 300], [491.65, 500],
    [492.32, 500], [502.83, 200], [582.39, 300], [617.83, 150], [618.24, 300], [631.81, 500], [646.97, 300], [647.28, 150],
    [650.42, 200], [666.89, 150], [672.80, 200], [682.73, 200], [688.22, 300], [711.96, 500], [739.38, 150],
  ],
  Rn: [[430.78, 80], [434.96, 100], [443.50, 40], [445.93, 50], [450.85, 50], [457.77, 50], [460.94, 50], [705.54, 200], [726.81, 100], [745.00, 300]],
}

/** What astronomers saw at the edge of the Sun in the eclipse of 18 August 1868: hydrogen's lines
 *  (H I, NIST: H-alpha 656.28, H-beta 486.13, H-gamma 434.05 nm) and a yellow line nobody knew, D3,
 *  which is helium's 587.56 nm. [nm, brightness 0..1, mystery] */
export const SUN_1868 = [[434.05, 0.45], [486.13, 0.7], [587.56, 0.85, true], [656.28, 1]]
/** Sodium's D lines (Na I, NIST), the yellow pair D3 sits next to. */
export const SODIUM_D = [588.99, 589.59]

/** The lines on the "why they glow" ladder: lower and upper energy levels in cm^-1 (NIST ASD). The
 *  photon's energy is the difference: E = hc/lambda. */
export const LADDER = {
  He: [{ nm: 587.56, lo: 169086.764, hi: 186101.546 }, { nm: 667.82, lo: 171134.894, hi: 186104.964 }, { nm: 447.15, lo: 169086.764, hi: 191444.478 }],
  Ne: [{ nm: 640.22, lo: 134041.84, hi: 149657.039 }, { nm: 585.25, lo: 135888.717, hi: 152970.733 }, { nm: 703.24, lo: 134041.84, hi: 148257.79 }],
  Ar: [{ nm: 696.54, lo: 93143.76, hi: 107496.417 }, { nm: 420.07, lo: 93143.76, hi: 116942.754 }, { nm: 738.4, lo: 93750.598, hi: 107289.7 }],
  Kr: [{ nm: 587.09, lo: 80916.768, hi: 97945.166 }, { nm: 557.03, lo: 79971.742, hi: 97919.147 }, { nm: 427.4, lo: 79971.742, hi: 103362.612 }],
  Xe: [{ nm: 473.42, lo: 68045.156, hi: 89162.356 }, { nm: 480.7, lo: 68045.156, hi: 88842.256 }, { nm: 711.96, lo: 78403.061, hi: 92444.927 }],
  Rn: [{ nm: 745.0, lo: 54620.35, hi: 68039.48 }, { nm: 705.54, lo: 54620.35, hi: 68789.93 }, { nm: 434.96, lo: 54620.35, hi: 77604.53 }],
}
/** 1 cm^-1 in electronvolts (hc). */
export const CM_TO_EV = 1.239841984e-4
/** The refractive index of air for visible light (wavelengths in air are shorter by this). */
export const N_AIR = 1.000277

/** A ladder line in electronvolts: { lo, hi, photon }. */
export const levelsEV = l => ({ lo: l.lo * CM_TO_EV, hi: l.hi * CM_TO_EV, photon: (l.hi - l.lo) * CM_TO_EV })

// ---- density and balloons ----

/** Dry air at 0 °C and 1 atm (g/L); the gases' densities in elements.json are at the same conditions. */
export const AIR_DENSITY = 1.293
/** Molar mass of dry air (g/mol). */
export const AIR_MOLAR = 28.96
/** A gas's density in g/L (elements.json keeps g/cm³). */
export const densityOf = sym => element(sym).density * 1000

/** A party balloon: 11.5 L (28 cm across), its rubber 2.5 g. */
export const BALLOON = { litres: 11.5, skin: 2.5, drag: 0.47 }
const G = 9.81

/** A balloon of `sym` in still air: its mass (kg, with the air it drags along), the net upward force
 *  (N) and its terminal speed (m/s, positive up). */
export function balloonOf(sym) {
  const V = BALLOON.litres / 1000
  const rhoAir = AIR_DENSITY // kg/m³ is g/L
  const rhoGas = densityOf(sym)
  const r = Math.cbrt((3 * V) / (4 * Math.PI))
  const area = Math.PI * r * r
  const mass = rhoGas * V + BALLOON.skin / 1000 + 0.5 * rhoAir * V // gas, rubber, the air moved with it
  const force = ((rhoAir - rhoGas) * V - BALLOON.skin / 1000) * G
  const k = 0.5 * rhoAir * BALLOON.drag * area
  const terminal = Math.sign(force) * Math.sqrt(Math.abs(force) / k)
  return { mass, force, terminal, k, radius: r }
}

/** One step of a balloon's flight: v (m/s, up) after dt seconds. */
export function stepBalloon(b, v, dt) {
  const a = (b.force - b.k * v * Math.abs(v)) / b.mass
  return v + a * dt
}

// ---- light and colour ----

/** A wavelength (nm) as an sRGB colour [r, g, b] in 0..1, dimmer toward the ends of the visible range
 *  (the usual approximation, after Dan Bruton). */
export function wavelengthRGB(nm) {
  let r = 0
  let g = 0
  let b = 0
  if (nm >= 380 && nm < 440) {
    r = (440 - nm) / 60
    b = 1
  } else if (nm >= 440 && nm < 490) {
    g = (nm - 440) / 50
    b = 1
  } else if (nm >= 490 && nm < 510) {
    g = 1
    b = (510 - nm) / 20
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / 70
    g = 1
  } else if (nm >= 580 && nm < 645) {
    r = 1
    g = (645 - nm) / 65
  } else if (nm >= 645 && nm <= 780) r = 1
  let k = 0
  if (nm >= 380 && nm < 420) k = 0.3 + (0.7 * (nm - 380)) / 40
  else if (nm >= 420 && nm <= 700) k = 1
  else if (nm > 700 && nm <= 780) k = 0.3 + (0.7 * (780 - nm)) / 80
  const c = v => (v > 0 ? Math.pow(v * k, 0.8) : 0)
  return [c(r), c(g), c(b)]
}

/** The name of a wavelength's colour, for words: violet, blue, blue-green, green, yellow, orange, red. */
export function colourKey(nm) {
  if (nm < 450) return 'violet'
  if (nm < 495) return 'blue'
  if (nm < 520) return 'cyan'
  if (nm < 565) return 'green'
  if (nm < 590) return 'yellow'
  if (nm < 625) return 'orange'
  return 'red'
}

/** How bright a line looks to the eye at its wavelength, gently (0.2..1): the eye hardly sees below
 *  about 420 nm or above about 700 nm, so a near-ultraviolet or deep-red line looks dimmer than a
 *  yellow one of the same intensity. (Much gentler than the photopic curve, so every line still shows.) */
export function eyeWeight(nm) {
  if (nm < 450) return Math.max(0.2, 0.3 + (0.7 * (nm - 400)) / 50)
  if (nm > 650) return Math.max(0.25, 1 - (0.65 * (nm - 650)) / 70)
  return 1
}

/** A line's brightness on the spectroscope (0.25..1): the log of its intensity against the gas's
 *  strongest, so faint lines still show. */
export function lineBrightness(sym, intensity) {
  const max = Math.max(...LINES[sym].map(l => l[1]))
  const min = Math.min(...LINES[sym].map(l => l[1]))
  if (max === min) return 1
  const k = (Math.log(intensity) - Math.log(min)) / (Math.log(max) - Math.log(min))
  return 0.25 + 0.75 * Math.max(0, Math.min(1, k))
}
