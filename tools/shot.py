"""Screenshots of the running site, for looking at what was made (headless Edge on the GPU, as the
pokemon arena's probes). Start the dev server first (npm run dev, port 5310).

    python tools/shot.py / --name plaza
    python tools/shot.py /e/C --name carbon --phone
    python tools/shot.py / --steps "wait:2; js:__ew.world.select(6); wait:1.5; shot:carbon-selected"

Steps (separated by ';'): wait:<seconds>, js:<code run in the page>, shot:<name>, key:<KeyCode>[*seconds held].
Shots go to tools/shots/<name>.png. Console errors are printed; the exit code is 1 if there were any.
Run it through the machine's heavy-job lock when other sessions render:
    python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" shot -- python tools/shot.py ...
"""
import argparse
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).with_name('shots')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('path', nargs='?', default='/')
    ap.add_argument('--name', default=None)
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--size', default='1600x900')
    ap.add_argument('--phone', action='store_true', help='an upright phone (390x844, touch)')
    ap.add_argument('--lang', default='pt-pt')
    ap.add_argument('--level', default=None, help='explorer or scientist')
    ap.add_argument('--wait', type=float, default=2.5, help='seconds after the world is shown')
    ap.add_argument('--steps', default='')
    ap.add_argument('--query', default='', help='extra query string, e.g. light=1')
    a = ap.parse_args()

    OUT.mkdir(exist_ok=True)
    w, h = (390, 844) if a.phone else map(int, a.size.split('x'))
    sep = '&' if '?' in a.path else '?'
    url = f'http://localhost:{a.port}{a.path}{sep}lang={a.lang}' + (f'&{a.query}' if a.query else '')
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2 if a.phone else 1,
                            has_touch=a.phone, is_mobile=a.phone)
        page = ctx.new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        if a.level:
            page.add_init_script(f"try {{ localStorage.setItem('ew-level', '{a.level}') }} catch (e) {{}}")
        page.goto(url)
        page.wait_for_function('window.__ew && window.__ew.world && !window.__ew.store.get().fading', timeout=60000)
        time.sleep(a.wait)
        name = a.name or (a.path.strip('/').replace('/', '_') or 'plaza')
        steps = [s.strip() for s in a.steps.split(';') if s.strip()]
        if not steps:
            steps = [f'shot:{name}']
        for s in steps:
            kind, _, arg = s.partition(':')
            if kind == 'wait':
                time.sleep(float(arg))
            elif kind == 'js':
                page.evaluate(arg)
            elif kind == 'key':
                key, _, held = arg.partition('*')
                page.keyboard.down(key)
                time.sleep(float(held or 0.1))
                page.keyboard.up(key)
            elif kind == 'shot':
                path = OUT / f'{arg}.png'
                page.screenshot(path=str(path))
                print(f'shot {path}')
        frames = page.evaluate('window.__ew.frames')
        print(f'frames drawn: {frames}')
        b.close()
    for e in errors:
        print('console error:', e[:400])
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
