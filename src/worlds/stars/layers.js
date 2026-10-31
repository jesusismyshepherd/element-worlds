// A star's layers, the onion drawn on the Star Forge's cut faces (stars.js) and listed in its HUD
// (ui/StarHud.jsx): what each layer is made of, its colour, the symbols written on it.

// the layers' colours, by what they are made of
export const LAYER = {
  H: '#c4512a', He: '#ffc93f', CO: '#ff4f93', ONeMg: '#9a68ff', OMg: '#4f74ff', SiS: '#22c9a8', FeNi: '#8e98ae',
}
// the symbols written on each layer
export const LABEL = { H: 'H', He: 'He', CO: 'C O', ONeMg: 'O Ne Mg', OMg: 'O Mg', SiS: 'Si S', FeNi: 'Fe Ni' }
// an old giant's helium shell on the cut face (between these radii: a tap there goes to the slow capture)
export const AGB_SHELL = [0.2, 0.3]

/** The star's layers from the middle out at a phase ({ k: layer kind, r: outer radius 0..1, burn }).
 *  Not to scale: the cores are drawn far bigger than they are (a red giant's core is a few thousandths of
 *  its radius), so that each layer can be seen and read. */
export function layersOf(phase, f, lit) {
  if (!lit) return [{ k: 'H', r: 1, burn: false }]
  switch (phase) {
    case 'h': return [{ k: 'He', r: 0.06 + 0.2 * f, burn: false }, { k: 'H', r: 0.42, burn: true }, { k: 'H', r: 1, burn: false }]
    case 'rg': return [{ k: 'He', r: 0.2, burn: false }, { k: 'H', r: 0.28, burn: true }, { k: 'H', r: 1, burn: false }]
    case 'he': return [{ k: 'CO', r: 0.08 + 0.14 * f, burn: false }, { k: 'He', r: 0.34, burn: true }, { k: 'H', r: 0.43, burn: true }, { k: 'H', r: 1, burn: false }]
    case 'agb': return [{ k: 'CO', r: AGB_SHELL[0], burn: false }, { k: 'He', r: AGB_SHELL[1], burn: true }, { k: 'H', r: 0.38, burn: true }, { k: 'H', r: 1, burn: false }]
    case 'c': return [{ k: 'ONeMg', r: 0.08 + 0.1 * f, burn: false }, { k: 'CO', r: 0.3, burn: true }, { k: 'He', r: 0.48, burn: false }, { k: 'H', r: 1, burn: false }]
    case 'ne': return [{ k: 'OMg', r: 0.08 + 0.07 * f, burn: false }, { k: 'ONeMg', r: 0.25, burn: true }, { k: 'CO', r: 0.37, burn: false }, { k: 'He', r: 0.52, burn: false }, { k: 'H', r: 1, burn: false }]
    case 'o': return [{ k: 'SiS', r: 0.08 + 0.06 * f, burn: false }, { k: 'OMg', r: 0.22, burn: true }, { k: 'ONeMg', r: 0.31, burn: false }, { k: 'CO', r: 0.41, burn: false }, { k: 'He', r: 0.55, burn: false }, { k: 'H', r: 1, burn: false }]
    case 'si': return [{ k: 'FeNi', r: 0.07 + 0.05 * f, burn: false }, { k: 'SiS', r: 0.2, burn: true }, { k: 'OMg', r: 0.28, burn: false }, { k: 'ONeMg', r: 0.36, burn: false }, { k: 'CO', r: 0.44, burn: false }, { k: 'He', r: 0.57, burn: false }, { k: 'H', r: 1, burn: false }]
    default: return [{ k: 'H', r: 1, burn: false }]
  }
}
