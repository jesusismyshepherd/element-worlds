// Corrections to the isotope data (mendeleev's, from NUBASE), shared by the elements' data
// (scripts/build-elements.mjs) and the chart of nuclides (scripts/build-nuclides.mjs).

/** Seconds in each half-life unit the sources use (a Julian year, as NUBASE). */
export const SECONDS = {
  ysec: 1e-24, zsec: 1e-21, asec: 1e-18, fsec: 1e-15, psec: 1e-12, nsec: 1e-9, usec: 1e-6, msec: 1e-3, sec: 1,
  minute: 60, hour: 3600, day: 86400, year: 3.15576e7, kyear: 3.15576e10, Myear: 3.15576e13, Gyear: 3.15576e16,
  Tyear: 3.15576e19, Pyear: 3.15576e22, Eyear: 3.15576e25, Zyear: 3.15576e28, Yyear: 3.15576e31,
}

/** Isotopes claimed but never confirmed (Wikipedia's "Isotopes of" pages, 2025): left out. */
export const UNCONFIRMED = new Set(['Nh-290', 'Cn-286', 'Ds-282', 'Fl-290', 'Og-295'])

/** Newer half-lives: the superheavies (Wikipedia's "Isotopes of" pages, 2025); samarium-146
 *  measured again in 2024 (92 million years; the 68 of 2012 was retracted in 2023). Hs-271 is missing
 *  from the source and is added (alpha decay). */
export const HALF = {
  'Sm-146': [92, 'Myear'],
  'Lr-266': [11, 'hour'], 'Rf-267': [48, 'minute'], 'Db-268': [16, 'hour'], 'Sg-269': [13, 'minute'],
  'Bh-270': [2.4, 'minute'], 'Mt-277': [5, 'msec'], 'Hs-271': [46, 'sec'],
}
export const ADDED_MODES = { 'Hs-271': ['A'] }

/** { halfLife, halfLifeUnit, halfLifeSeconds } of a fixed half-life. */
export const half = ([v, u]) => ({ halfLife: v, halfLifeUnit: u, halfLifeSeconds: v * SECONDS[u] })
