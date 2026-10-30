// Which of a hall's pictures can be stepped into (docs/knowledge/picture-rooms.md): a picture has a room
// when its scene exists, scenes/<Symbol>/<board id>.js, so the file itself is the list. The user
// (2026-10-30): a picture on a wall always means you can step in; new pictures come with their rooms.
const SCENES = import.meta.glob(['./scenes/*/*.js', '!./scenes/*/*.words.js', '!./scenes/*/*.test.js'])

const keyOf = (symbol, id) => `./scenes/${symbol}/${id}.js`

/** Whether the board `id` of `symbol`'s hall opens on a room. */
export const hasRoom = (symbol, id) => keyOf(symbol, id) in SCENES

/** The scene module of a picture room (rejects when the picture has none). */
export function loadScene(symbol, id) {
  const load = SCENES[keyOf(symbol, id)]
  return load ? load() : Promise.reject(new Error(`no room behind ${symbol}'s picture ${id}`))
}
