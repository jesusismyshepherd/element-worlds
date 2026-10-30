"""The sound opens with the first touch or key after a page load (src/audio/sound.js): browsers hold
sound until the player does something, and a finger's pointerdown does not count (only its lift does),
which once left the music silent on a phone until another world was entered (the user, 2026-10-29).
Loads the plaza on a phone (a real tap) and on a computer (a real click, then a key alone), and checks
that the sound runs and the plaza's music bed plays. Then the bed itself: the context asks for the larger
buffer (20 ms; with 10 the music crackled on the user's phone, 2026-10-30), and every bed, made offline as
an 80 s loop, comes back to where it started (no click at the seam). The page is read through the DevTools protocol
(no user gesture: Playwright's own evaluate counts as one). Dev server on 5310, or --base.

    python tools/sound_probe.py [--base http://localhost:5310]
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:5310'
SEAM = '''async kind => {
  const PRE = 1, LOOP = 80
  const buf = await window.__ewSound.renderBed(kind)
  const d = buf.getChannelData(0), r = buf.sampleRate, start = PRE * r, end = (PRE + LOOP) * r
  const most = (from, to) => { let m = 0; for (let i = from; i < to; i++) m = Math.max(m, Math.abs(d[i + 1] - d[i])); return m }
  let peak = 0
  for (let i = start; i < start + r; i++) peak = Math.max(peak, Math.abs(d[i]))
  // the step from the loop's last sample to its first, the steepest step of the wave itself, and of the fade
  const seam = Math.abs(d[start] - d[end - 1])
  return { seam: +seam.toExponential(2), step: +most(start, start + r).toExponential(2), fade: +most(end - r / 20 - 1, end - 1).toExponential(2), peak: +peak.toFixed(4) }
}'''
READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    base = sys.argv[sys.argv.index('--base') + 1] if '--base' in sys.argv else BASE
    fails = []

    def check(what, ok, detail=''):
        print(f'{what:60} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--autoplay-policy=user-gesture-required'])

        def run(name, ctx_opts, act):
            c = b.new_context(**ctx_opts)
            page = c.new_page()
            cdp = c.new_cdp_session(page)

            def read(expr):
                r = cdp.send('Runtime.evaluate', {'expression': f'JSON.stringify({expr})', 'returnByValue': True})
                return json.loads(r['result'].get('value') or 'null')

            page.goto(f'{base}/?lang=en')
            page.wait_for_function(READY, timeout=90000, polling=500)
            before = read('window.__ewSound.state()')
            check(f'{name}: no sound before the player does anything', before['ctx'] in (None, 'suspended'), str(before))
            act(page)
            page.wait_for_timeout(1500)
            after = read('window.__ewSound.state()')
            check(f'{name}: the sound runs and the music bed plays', after['ctx'] == 'running' and after['playing'] and after['want'] == 'plaza', str(after))
            check(f'{name}: the larger buffer (20 ms)', (after.get('buffer') or 0) >= 0.015, f"{after.get('buffer')} s, late buffers {after.get('late')}")
            c.close()

        vp = {'width': 1280, 'height': 720}
        run('phone, one tap', {'viewport': {'width': 390, 'height': 844}, 'has_touch': True, 'is_mobile': True}, lambda pg: pg.touchscreen.tap(30, 600))
        run('computer, one click', {'viewport': vp}, lambda pg: pg.mouse.click(40, 600))
        run('computer, one key', {'viewport': vp}, lambda pg: pg.keyboard.press('ArrowLeft'))
        page = b.new_page()
        page.goto(f'{base}/?lang=en')
        page.wait_for_function('window.__ewSound', timeout=90000, polling=500)
        for kind in ['plaza', 'atrium', 'lab', 'wing', 'forge']:
            # the loop's end runs on into its start: no step there (or in the fade before it) steeper than the wave's own
            s = page.evaluate(SEAM, kind)
            check(f'the {kind} bed loops without a seam', s['seam'] <= s['step'] and s['fade'] <= s['step'] * 1.05 and s['peak'] > 0.01, json.dumps(s))
        b.close()
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
