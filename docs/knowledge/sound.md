# Sound

All of it is `src/audio/sound.js`, made in the browser (no sound files): one audio context, buses
(ambience 0.32, effects 0.7, ui 0.45, voice 0.5) into a master (0.8) and a gentle limiter, a mute switch
kept on the device (`ew-sound`). Short sounds (`play`), the Atomlings' babble (`voice`) and a music bed
for each kind of world (`ambience`: plaza, atrium, lab, wing, forge; the engine picks it with the world).

- **Leave to play.** Browsers hold sound until the player does something. The first tap's lift, click
  or key opens it (a finger's pointerdown does not count on a real phone: the music stayed silent after a
  reload on the user's phone, 2026-10-29). The context is suspended while the page is hidden.
- **The buffer.** The context asks for `latencyHint: 'playback'`, 20 ms buffers, not the 10 ms of
  `'interactive'`. A phone drawing the 3D world is late now and then, and each late buffer is a crackle;
  a tap's sound 10 ms later is not heard (the arena in pokemon-site found the same).
- **The beds are loops made offline.** Each bed (four notes, each as two tones 12 cents apart, each tone
  swelling on its own, through a 900 Hz low-pass) is rendered once with an `OfflineAudioContext` as an
  80 s loop at 24 kHz (7.8 MB; the last two kept) and played from that buffer. Rendering takes about
  0.5 s on this computer, on its own thread, and starts as soon as a world wants its bed (no leave to play
  is needed for it), so the music is ready by the first tap. Every tone and every swell turns a whole
  number of times in the loop (frequencies rounded to 1/80 Hz, a tenth of a cent at most; the swells
  4/80 to 11/80 Hz, once in 7 to 20 s), and the loop's last 50 ms fade into the 50 ms before its start,
  so the seam has no click. Each visit comes in at a random place in the loop.

## The crackle on the phone (2026-10-30)

The user: "background music crackles on the phone (didn't notice this crackling on PC)". The bed had been
16 live oscillators (eight tones, eight swells) and their gains, worked out every 2.7 ms on the audio
thread, with 10 ms buffers. Measured on this computer with `tools/audio_load.py` (the same hall, the same
trace, no per-node tracing):

| | before | after |
|---|---|---|
| one quantum (128 samples), mean / p99 | 0.079 / 0.433 ms | 0.022 / 0.106 ms |
| the worst device buffer, against its time | 2.05 of 10 ms | 1.35 of 20 ms |

A phone has about a third of this computer's speed and draws the world at the same time; the margin
is now about three times what it was. Not yet heard on the phone itself (it was not reachable that day):
the usage data's `sound` events show it (below).

## Traps

- **No live oscillator beds.** Anything that sounds for long (a drone, a bed, a hum) is rendered offline
  into a buffer and looped, the way `renderBed` does. Live nodes cost the audio thread every quantum;
  short sounds (`tone`, `bell`, `whoosh`) are fine live.
- **A loop must be whole.** A tone that does not turn a whole number of times in its loop clicks at the
  seam: round its frequency to 1/length Hz, and set the frequency itself (a `detune` moves it off again).
  The 32-bit frequencies still drift a little; the fade before the seam takes that.
- **A buffer of another sample rate is resampled by straight lines** (Chrome), which leaves images of
  the sound mirrored at the buffer's rate. The beds are under 900 Hz at 24 kHz: their images sit above
  22 kHz. Something bright needs the context's own rate.

## Checking

- `python tools/sound_probe.py [--base ...]`: sound opens with a tap, a click or a key alone; the bed
  plays; the buffer is 20 ms; every bed loops without a seam (no step at the seam or in its fade steeper
  than the wave's own).
- `python tools/audio_load.py [path] [--base ...] [--nodes]`: the context (buffer, late buffers so far)
  and the audio thread's work per quantum and per device buffer, from the browser's trace.
- `window.__ewSound.state()` on any page (the phone too, `tools/phone.py ... --steps "js:..."`): running
  or not, the bed, the buffer, and `late`: the device's late buffers so far (`n`, `ms` of silence put in
  their place, `s` played), where the browser counts them (Chrome: `playbackStats`, later
  `playoutStats`). One late buffer as the context opens is normal.
- The usage data (`usage-data.md`): event `sound` with each stretch of music's late buffers, at each
  change of bed and when the page is hidden. A phone's `n` over its `s` says whether it still crackles.
