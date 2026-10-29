// The halls' picture boards (docs/knowledge/hall-boards.md): src/content/boards/<Symbol>.js, loaded with
// the hall. An element with boards gets one fact file (all its stations in one panel) and seven
// pictures on its walls; the others keep the eight text stations.
const MODULES = import.meta.glob('./[A-Z]*.js')

/** An element's picture boards (null when it has none yet). */
export async function loadBoards(symbol) {
  const key = `./${symbol}.js`
  if (!(key in MODULES)) return null
  return (await MODULES[key]()).default
}

/** Where a board's picture is (public/boards/<Symbol>/<id>.svg). */
export const boardArt = (symbol, id) => `${import.meta.env.BASE_URL}boards/${symbol}/${id}.svg`
