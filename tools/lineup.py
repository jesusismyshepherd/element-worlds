"""Screenshots of the Atomlings page (tools/shots/atomlings-<set>.png).

    python tools/lineup.py featured p2 lanthanides
    python tools/lineup.py --only C,O,N,H --name bonders
"""
import argparse
import time

from playwright.sync_api import sync_playwright


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('sets', nargs='*', default=['featured'])
    ap.add_argument('--only', default='')
    ap.add_argument('--name', default='only')
    ap.add_argument('--lang', default='pt-pt')
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--size', default='1700x900')
    ap.add_argument('--wait', type=float, default=3)
    a = ap.parse_args()
    w, h = map(int, a.size.split('x'))
    jobs = [(f'set={s}', s) for s in a.sets] if not a.only else [(f'only={a.only}', a.name)]
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': w, 'height': h})
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        for query, name in jobs:
            page.goto(f'http://localhost:{a.port}/atomlings?{query}&lang={a.lang}')
            page.wait_for_function('window.__lineup && window.__lineup.members.length > 0', timeout=60000)
            time.sleep(a.wait)
            out = f'tools/shots/atomlings-{name}.png'
            page.screenshot(path=out)
            print('shot', out)
        b.close()
    for e in errors:
        print('console error:', e[:300])


if __name__ == '__main__':
    main()
