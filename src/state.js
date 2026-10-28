// The one store the engine and the HUD share (see engine/store.js).
import { createStore, savedLevel } from './engine/store.js'

export const store = createStore({
  world: null,
  title: null,
  fading: true,
  error: null,
  light: false,
  hover: null,
  selected: null,
  familyFocus: null,
  trend: null,
  year: null,
  knownCount: 118,
  trendRange: null,
  prompt: null,
  panel: null,
  panelFrom: null, // the id of the exhibit the open panel tells about
  overlay: false, // a world's own window is open (the neon name): the prompt waits
  mode: 'third',
  speech: null,
  discoveries: null,
  level: savedLevel(),
})
