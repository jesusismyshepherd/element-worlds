// Sound, made in the browser (no files): one audio context, buses (ambience, effects, interface,
// voices) into a gentle limiter, a mute switch kept on the device. As in pokemon-site's arena
// (src/games/arena/audio/mixer.js): the context waits for the first tap or key (browsers hold sound
// until then) and goes quiet while the page is hidden.
//   play('select' | 'enter' | 'discover' | 'celebrate' | 'join' | 'part' | 'tap')
//   voice(text, { pitch })   an Atomling's babble, a blip per syllable, pitched by its size
//   ambience('plaza' | 'atrium' | 'lab' | 'wing' | null)
import { track } from '../net/telemetry.js'

const KEY = 'ew-sound'
let ctx = null
let master = null
const bus = {}
let muted = load()
let wantAmbience = null
let ambienceNodes = null
const listeners = new Set()

function load() {
  try {
    return localStorage.getItem(KEY) === 'off'
  } catch {
    return false
  }
}

export const isMuted = () => muted

export function setMuted(m) {
  muted = m
  try {
    localStorage.setItem(KEY, m ? 'off' : 'on')
  } catch {
    // storage blocked: for this visit only
  }
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.05)
  listeners.forEach(f => f(m))
}

export function onMuted(f) {
  listeners.add(f)
  return () => listeners.delete(f)
}

function start() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  // 'playback': the larger buffer (20 ms here, not 10). A phone drawing a 3D world is late now and then,
  // and every late buffer is a crackle (the user's phone, 2026-10-30; the arena found the same); a tap's
  // sound 10 ms later is not heard
  ctx = new AC({ latencyHint: 'playback' })
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -10
  limiter.ratio.value = 8
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.8
  master.connect(limiter).connect(ctx.destination)
  for (const [name, v] of [['ambience', 0.32], ['effects', 0.7], ['ui', 0.45], ['voice', 0.5]]) {
    bus[name] = ctx.createGain()
    bus[name].gain.value = v
    bus[name].connect(master)
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) {
      report()
      ctx.suspend()
    } else ctx.resume()
  })
  if (wantAmbience) ambience(wantAmbience)
}

// the first tap or key anywhere opens the sound. A finger's pointerdown does not give a page leave to
// play (only its lift does, or a mouse press, or a key): on an Android phone the sound stayed held after a
// reload until something else woke it (the user, 2026-10-29). So every one of these tries again until the
// sound really runs.
if (typeof window !== 'undefined') {
  const EVENTS = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']
  const done = () => EVENTS.forEach(e => window.removeEventListener(e, unlock, true))
  function unlock() {
    start()
    if (!ctx) return done()
    if (ctx.state === 'running') return done()
    ctx.resume().then(() => ctx.state === 'running' && done(), () => {})
  }
  EVENTS.forEach(e => window.addEventListener(e, unlock, { capture: true, passive: true }))
}

const ready = () => ctx && ctx.state === 'running' && !muted

/** The device's late buffers so far (each one a crackle), where the browser counts them (Chrome):
 *  n of them, ms of silence put in their place, s of sound played. */
function lateBuffers() {
  const p = ctx?.playoutStats
  if (p) return { n: p.fallbackFramesEvents, ms: Math.round(p.fallbackFramesDuration), s: Math.round(p.totalFramesDuration / 1000) }
  const b = ctx?.playbackStats
  if (b) return { n: b.underrunEvents, ms: Math.round(b.underrunDuration * 1000), s: Math.round(b.totalDuration) }
  return null
}

// the usage data gets the late buffers of each stretch of music (event 'sound', docs/knowledge/usage-data.md):
// how often the players' devices crackle, and in which kind of world
let reported = null
function report() {
  const now = lateBuffers()
  if (!now) return
  const last = reported ?? { n: 0, ms: 0, s: 0 }
  if (now.s - last.s < 5) return
  reported = now
  track('sound', { bed: wantAmbience, n: now.n - last.n, ms: now.ms - last.ms, s: now.s - last.s, buf: Math.round(ctx.baseLatency * 1000) })
}

// for the probes (tools/sound_probe.py, tools/audio_load.py): is the sound running, which bed is wanted, is
// one playing, the buffer (s) and the late buffers so far; renderBed to check a bed's loop
if (typeof window !== 'undefined') {
  window.__ewSound = {
    state: () => ({ ctx: ctx?.state ?? null, want: wantAmbience, playing: !!ambienceNodes, buffer: ctx?.baseLatency, late: lateBuffers() }),
    renderBed: (kind, seconds) => renderBed(kind, seconds),
  }
}

/** A tone with an envelope: freq (Hz), dur (s), type, gain, when (s from now), bus. */
function tone(freq, dur, { type = 'sine', gain = 0.3, when = 0, to = null, attack = 0.005, out = 'effects', detune = 0 } = {}) {
  const t0 = ctx.currentTime + when
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  o.detune.value = detune
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(bus[out])
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

/** A bell: a sine and a quieter inharmonic partial, long decay. */
function bell(freq, when = 0, gain = 0.22, out = 'effects') {
  tone(freq, 1.4, { gain, when, out })
  tone(freq * 2.76, 0.6, { gain: gain * 0.25, when, out })
  tone(freq * 5.4, 0.25, { gain: gain * 0.08, when, out })
}

/** A burst of filtered noise sweeping from one frequency to another (whooshes). */
function whoosh(from, to, dur, gain = 0.25, when = 0) {
  const t0 = ctx.currentTime + when
  const len = Math.ceil(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 1.2
  f.frequency.setValueAtTime(from, t0)
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(bus.effects)
  src.start(t0)
}

const NOTE = n => 440 * Math.pow(2, (n - 69) / 12)

/** A short sound for something that happened. */
export function play(kind, { order = 1 } = {}) {
  if (!ready()) return
  if (kind === 'tap') tone(880, 0.06, { gain: 0.12, out: 'ui' })
  else if (kind === 'select') {
    tone(NOTE(76), 0.12, { gain: 0.14, out: 'ui' })
    tone(NOTE(83), 0.16, { gain: 0.12, when: 0.06, out: 'ui' })
  } else if (kind === 'enter') {
    whoosh(2400, 300, 0.9, 0.22)
    for (const [i, n] of [72, 76, 79].entries()) tone(NOTE(n), 1.1, { gain: 0.07, when: 0.25 + i * 0.04, attack: 0.08 })
  } else if (kind === 'discover') [84, 88, 91, 96].forEach((n, i) => bell(NOTE(n), i * 0.09, 0.14))
  else if (kind === 'celebrate') {
    ;[72, 76, 79, 84].forEach((n, i) => tone(NOTE(n), 0.35, { type: 'triangle', gain: 0.16, when: i * 0.1 }))
    ;[88, 91, 96, 100].forEach((n, i) => bell(NOTE(n), 0.45 + i * 0.07, 0.12))
  } else if (kind === 'join') {
    // a pop for each hand taken, higher for a double or triple bond
    tone(NOTE(67 + order * 5), 0.14, { type: 'triangle', gain: 0.22, to: NOTE(72 + order * 5) })
  } else if (kind === 'part') tone(NOTE(74), 0.18, { type: 'triangle', gain: 0.16, to: NOTE(62) })
  // a satellite's radio beacon (silicon's solar picture room: Vanguard 1)
  else if (kind === 'beep') tone(NOTE(81), 0.12, { type: 'square', gain: 0.05 })
  // the Atom Forge: a particle joins (a proton rings higher than a neutron, an electron chirps)
  else if (kind === 'proton') tone(NOTE(67), 0.13, { type: 'triangle', gain: 0.2, to: NOTE(72) })
  else if (kind === 'neutron') tone(NOTE(60), 0.13, { type: 'triangle', gain: 0.17, to: NOTE(62) })
  else if (kind === 'electron') tone(NOTE(86), 0.09, { gain: 0.11, to: NOTE(93), out: 'ui' })
  else if (kind === 'beam') {
    // a particle accelerator's rising whine
    whoosh(300, 3600, 0.75, 0.2)
    tone(NOTE(55), 0.7, { type: 'sawtooth', gain: 0.05, to: NOTE(79) })
  } else if (kind === 'fizz') {
    // a lump of metal hissing on water (order: how hard)
    whoosh(5600, 3000, 0.7, 0.045 * order)
  } else if (kind === 'pop') {
    tone(NOTE(50), 0.14, { gain: 0.3, to: NOTE(36) })
    whoosh(2800, 500, 0.2, 0.16)
  } else if (kind === 'bang') {
    tone(NOTE(31), 0.8, { gain: 0.65, to: NOTE(22) })
    whoosh(3200, 160, 1.1, 0.55)
  } else if (kind === 'crack') {
    for (let i = 0; i < 5; i++) tone(2300 + Math.random() * 1800, 0.012, { type: 'square', gain: 0.1, when: i * 0.06 + Math.random() * 0.03 })
  } else if (kind === 'decay') {
    // a Geiger counter's clicks and a whoosh; heavier for alpha, fission and clusters (order 2)
    for (let i = 0; i < 6; i++) tone(1900 + Math.random() * 600, 0.012, { type: 'square', gain: 0.12, when: i * 0.035 + Math.random() * 0.02, out: 'effects' })
    whoosh(order > 1 ? 1800 : 3400, order > 1 ? 220 : 500, order > 1 ? 0.8 : 0.5, order > 1 ? 0.26 : 0.18, 0.05)
    if (order > 1) tone(NOTE(40), 0.5, { type: 'sine', gain: 0.25, to: NOTE(33), when: 0.04 })
  }
}

/** An Atomling talking: a blip per syllable, pitched by its size (big atoms speak low). */
export function voice(text, { pitch = 1 } = {}) {
  if (!ready()) return
  const syllables = Math.min(18, Math.max(3, Math.round((text.match(/[aeiouáéíóúâêôãõà]/gi)?.length ?? 6) / 2.2)))
  const base = 380 * pitch
  for (let i = 0; i < syllables; i++) {
    const f = base * (1 + Math.sin(i * 2.1) * 0.12 + (i === syllables - 1 ? 0.15 : 0))
    tone(f, 0.075, { type: 'triangle', gain: 0.12, when: i * 0.085, to: f * 1.08, out: 'voice' })
  }
}

// a quiet bed of sound for each kind of world: slow, soft chords with a gentle swell
const BEDS = {
  plaza: [48, 55, 62, 67],
  atrium: [50, 57, 62, 66],
  lab: [53, 60, 64, 69],
  wing: [45, 52, 57, 64],
  forge: [46, 53, 58, 65],
}

// Each bed is made once, offline, as an 80 s loop, and played from that buffer: the audio thread then
// plays one stream instead of sixteen oscillators and their swells every 2.7 ms. Made live, the bed
// crackled on the user's phone while it drew the 3D world (2026-10-30). Every tone and every swell turns
// a whole number of times in the loop (its frequency rounded to 1/80 Hz, a tenth of a cent at most), so the loop
// has no seam; the second before it lets the filter settle. The bed is under 900 Hz, so half the usual
// sample rate is plenty (7.8 MB a bed; the last two are kept).
const LOOP = 80
const PRE = 1
const RATE = 24000
const beds = new Map()
let bedTurn = 0
const whole = f => Math.round(f * LOOP) / LOOP

function renderBed(kind, seconds = PRE + LOOP) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext
  const off = new OAC(1, Math.round(seconds * RATE), RATE)
  const filter = off.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900
  filter.connect(off.destination)
  for (const [i, n] of BEDS[kind].entries()) {
    for (const [j, cents] of [-6, 6].entries()) {
      const o = off.createOscillator()
      o.type = i === 0 ? 'sine' : 'triangle'
      o.frequency.value = whole(NOTE(n) * Math.pow(2, cents / 1200))
      const og = off.createGain()
      og.gain.value = (i === 0 ? 0.16 : 0.07) / 2
      // each voice swells slowly on its own (once in 7 to 20 s)
      const lfo = off.createOscillator()
      lfo.frequency.value = (4 + 2 * i + j) / LOOP
      const depth = off.createGain()
      depth.gain.value = og.gain.value * 0.8
      lfo.connect(depth).connect(og.gain)
      o.connect(og).connect(filter)
      o.start()
      lfo.start()
    }
  }
  return new Promise((done, fail) => {
    off.oncomplete = e => done(e.renderedBuffer)
    off.startRendering()?.catch?.(fail)
  }).then(buffer => {
    // what is left of a seam (the tones' 32-bit frequencies drift a thousandth of a turn in 80 s): the
    // loop's last 50 ms fade into the 50 ms before its start, so its end runs on into its start
    const d = buffer.getChannelData(0)
    const n = RATE / 20
    const start = PRE * RATE
    const end = (PRE + LOOP) * RATE
    for (let m = 0; m < n; m++) d[end - n + m] += (d[start - n + m] - d[end - n + m]) * (m / n)
    return buffer
  })
}

function bed(kind) {
  let made = beds.get(kind)
  if (made) beds.delete(kind)
  else {
    try {
      made = renderBed(kind)
    } catch (e) {
      made = Promise.reject(e) // no offline audio here: no bed
    }
    made.catch(() => beds.get(kind) === made && beds.delete(kind))
  }
  beds.set(kind, made)
  if (beds.size > 2) beds.delete(beds.keys().next().value)
  return made
}

/** Start the ambience of a kind of world (null: none). Crossfades from the last one. */
export function ambience(kind) {
  if (ctx && kind !== wantAmbience) report()
  wantAmbience = kind
  // a bed is made without the player's leave to play: ready by the first tap
  if (!ctx) return void (BEDS[kind] && bed(kind))
  const old = ambienceNodes
  if (old) {
    old.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.6)
    setTimeout(() => old.stop(), 3000)
  }
  ambienceNodes = null
  const turn = ++bedTurn
  if (!kind || !BEDS[kind]) return
  bed(kind).then(
    buffer => {
      if (turn !== bedTurn) return
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.loop = true
      src.loopStart = PRE
      src.loopEnd = PRE + LOOP
      const g = ctx.createGain()
      g.gain.value = 0.0001
      g.gain.setTargetAtTime(0.5, ctx.currentTime, 1.5)
      src.connect(g).connect(bus.ambience)
      // each visit comes in somewhere else in the loop
      src.start(ctx.currentTime, PRE + Math.random() * LOOP)
      ambienceNodes = { gain: g, stop: () => src.stop() }
    },
    () => {},
  )
}
