"""The sound opens with the first touch or key after a page load (src/audio/sound.js): browsers hold
sound until the player does something, and a finger's pointerdown does not count (only its lift does),
which once left the music silent on a phone until another world was entered (the user, 2026-10-29).
Loads the plaza on a phone (a real tap) and on a computer (a real click, then a key alone), and checks
that the sound runs and the plaza's music bed plays. The page is read through the DevTools protocol
(no user gesture: Playwright's own evaluate counts as one). Dev server on 5310, or --base.

    python tools/sound_probe.py [--base http://localhost:5310]
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:5310'
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
            c.close()

        vp = {'width': 1280, 'height': 720}
        run('phone, one tap', {'viewport': {'width': 390, 'height': 844}, 'has_touch': True, 'is_mobile': True}, lambda pg: pg.touchscreen.tap(30, 600))
        run('computer, one click', {'viewport': vp}, lambda pg: pg.mouse.click(40, 600))
        run('computer, one key', {'viewport': vp}, lambda pg: pg.keyboard.press('ArrowLeft'))
        b.close()
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
