"""The sound's work in the browser: the audio context's buffer (what its latency hint got) and how long
the audio thread takes to make each render quantum (128 samples, 2.7 ms at 48 kHz) while a world plays
its music bed, from the browser's own trace. Adapted from the arena's (pokemon images/blender/arena/
tools/audio_load.py) on 2026-10-30, when the music crackled on the user's phone and not on the computer.

    python tools/audio_load.py [path] [--base http://localhost:5310] [--seconds 6] [--nodes]

Clicks the page (the sound starts), waits for the bed, then traces the Web Audio categories. Prints the
context (sample rate, baseLatency: the buffer the hint got; outputLatency; playoutStats, the frames the
device had to fill with silence, where the browser has it) and each traced kind of work: count, mean,
99th percentile and longest, in ms. `RealtimeAudioDestinationHandler::Render` is one whole quantum; the
nodes' own lines show where it goes; `AudioOutputDevice::FireRenderCallback` is one device buffer
(several quanta). --nodes traces each node too (where the work goes; the tracing itself then adds a
good part of it, so compare runs made the same way). A late buffer is a crackle: a phone has about a third of this computer's speed, and
while it draws a 3D world the audio thread waits its turn. Probes run with `py -3.11`.
"""
import argparse
import collections
import json
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/')
    ap.add_argument('--base', default='http://localhost:5310')
    ap.add_argument('--seconds', type=float, default=6)
    ap.add_argument('--nodes', action='store_true')
    a = ap.parse_args()
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': 1280, 'height': 720})
        page.goto(f'{a.base}{a.path}?lang=en')
        page.wait_for_function(READY, timeout=120000, polling=500)
        page.mouse.click(40, 600)
        t = time.time()
        while time.time() - t < 20 and not page.evaluate('() => window.__ewSound.state().playing'):
            time.sleep(0.5)
        time.sleep(3)  # (the bed swells in)
        info = page.evaluate('() => window.__ewSound.state()')
        print(f'{a.path} on {a.base}: {json.dumps(info)}')
        cdp = page.context.new_cdp_session(page)
        events, done = [], []
        cdp.on('Tracing.dataCollected', lambda p: events.extend(p['value']))
        cdp.on('Tracing.tracingComplete', lambda p: done.append(1))
        cdp.send('Tracing.start', {'traceConfig': {'includedCategories': ['audio', 'webaudio', 'disabled-by-default-audio'] + (['disabled-by-default-webaudio.audionode'] if a.nodes else [])}})
        time.sleep(a.seconds)
        cdp.send('Tracing.end')
        t = time.time()
        while not done and time.time() - t < 30:
            time.sleep(0.2)
        print(f'after: {json.dumps(page.evaluate("() => window.__ewSound.state()"))}')
        b.close()
    by = collections.defaultdict(list)
    for e in events:
        if e.get('ph') == 'X' and 'dur' in e:
            by[e['name']].append(e['dur'] / 1000)
    for name, d in sorted(by.items(), key=lambda kv: -sum(kv[1]))[:14]:
        d.sort()
        print(f'  {name[:58]:58} n {len(d):6d}  mean {sum(d) / len(d):6.3f} ms  p99 {d[max(0, int(len(d) * 0.99) - 1)]:6.3f}  max {d[-1]:6.3f}')


if __name__ == '__main__':
    main()
