"""Full screen (src/ui/fullscreen.js): on a touch screen the first tap turns it on; the button turns it
off and then taps leave it off; the button turns it on again. On a computer nothing happens by itself
and the button turns it on. Start the dev server first (port 5310).

    python tools/fullscreen_probe.py
"""
import argparse
import sys

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
ON = '() => !!document.fullscreenElement'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    a = ap.parse_args()
    fails = []

    def expect(what, got, want):
        print(f'{what:58} {"ok" if got == want else "WRONG"} ({got})')
        if got != want:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        # a phone
        ctx = b.new_context(viewport={'width': 412, 'height': 780}, is_mobile=True, has_touch=True, device_scale_factor=2)
        page = ctx.new_page()
        page.goto(f'http://localhost:{a.port}/?lang=en')
        page.wait_for_function(READY, timeout=60000)
        expect('phone: not full screen before a touch', page.evaluate(ON), False)
        page.touchscreen.tap(200, 400)
        page.wait_for_timeout(500)
        expect('phone: the first tap turns it on', page.evaluate(ON), True)
        button = page.get_by_role('button', name='Leave full screen')
        button.tap()
        page.wait_for_timeout(500)
        expect('phone: the button turns it off', page.evaluate(ON), False)
        page.touchscreen.tap(200, 400)
        page.wait_for_timeout(500)
        expect('phone: after the button, a tap leaves it off', page.evaluate(ON), False)
        page.get_by_role('button', name='Full screen').tap()
        page.wait_for_timeout(500)
        expect('phone: the button turns it on again', page.evaluate(ON), True)
        ctx.close()
        # a computer
        ctx = b.new_context(viewport={'width': 1280, 'height': 720})
        page = ctx.new_page()
        page.goto(f'http://localhost:{a.port}/?lang=en')
        page.wait_for_function(READY, timeout=60000)
        page.mouse.click(640, 400)
        page.wait_for_timeout(400)
        expect('computer: a click does not turn it on', page.evaluate(ON), False)
        page.get_by_role('button', name='Full screen').click()
        page.wait_for_timeout(500)
        expect('computer: the button turns it on', page.evaluate(ON), True)
        ctx.close()
        b.close()
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
