"""A new version while the page stays open (src/engine/release.js watchUpdates, the installed app above all,
which has no reload button): builds the site, opens it on a computer and a phone, builds it again over
the first (a new build number in /version.json), brings the pages back on screen and checks that each
offers the new version ("Reload"), that the phone's ☰ menu has Reload at any time, and that Reload
brings in the new build (and the offer goes). Builds into a scratch folder and serves it on --port.

    python tools/update_probe.py [--port 5318]
"""
import argparse
import pathlib
import subprocess
import sys
import tempfile
import time
import urllib.request

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
OUT = ROOT / 'tools' / 'shots' / 'update'


def build(out):
    subprocess.run(f'npx vite build --outDir "{out}" --emptyOutDir', cwd=ROOT, shell=True, check=True, capture_output=True)
    return (pathlib.Path(out) / 'version.json').read_text()


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5318)
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:66} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def wait(page, js, timeout=10000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

    out = tempfile.mkdtemp(prefix='ew-update-')
    first = build(out)
    base = f'http://localhost:{a.port}'
    server = subprocess.Popen(f'npx vite preview --outDir "{out}" --port {a.port} --strictPort', cwd=ROOT, shell=True)
    try:
        for _ in range(60):
            try:
                urllib.request.urlopen(base + '/version.json', timeout=1)
                break
            except Exception:
                time.sleep(0.5)
        with sync_playwright() as p:
            b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
            pages = {}
            for name, phone in (('computer', False), ('phone', True)):
                ctx = b.new_context(**({'viewport': {'width': 412, 'height': 800}, 'is_mobile': True, 'has_touch': True} if phone else {'viewport': {'width': 1280, 'height': 720}}))
                pg = ctx.new_page()
                pg.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
                pg.goto(f'{base}/?lang=en')
                pg.wait_for_function(READY, timeout=90000)
                pages[name] = pg
            phone = pages['phone']
            phone.click('[aria-label="Menu"]')
            check("the phone's menu has Reload", wait(phone, '() => !!document.querySelector("[data-reload]")', 4000))
            phone.click('[aria-label="Menu"]')
            for n, pg in pages.items():
                pg.evaluate("() => window.dispatchEvent(new Event('focus'))")
            asked = time.time()
            time.sleep(2)
            for n, pg in pages.items():
                check(f'{n}: no offer while the build is the same', not pg.query_selector('[data-update]'))

            second = build(out)
            check('the second build has a new number', second != first, f'{first} -> {second}')
            # a check within 30 s of the last one is skipped
            time.sleep(max(0, 31 - (time.time() - asked)))
            for n, pg in pages.items():
                pg.evaluate("() => document.dispatchEvent(new Event('visibilitychange'))")
            for n, pg in pages.items():
                check(f'{n}: offers the new version on coming back', wait(pg, '() => !!document.querySelector("[data-update]")', 8000))
                pg.screenshot(path=str(OUT / f'{n}_offer.png'))
            phone.click('[data-update] [data-reload]')
            phone.wait_for_function(READY, timeout=90000)
            time.sleep(1)
            phone.evaluate("() => window.dispatchEvent(new Event('focus'))")
            time.sleep(2)
            check('phone: Reload brings in the new build, the offer goes', not phone.query_selector('[data-update]'))
            phone.screenshot(path=str(OUT / 'phone_after.png'))
            b.close()
    finally:
        subprocess.run(f'taskkill /PID {server.pid} /T /F', shell=True, capture_output=True)
    for e in errors[:10]:
        print('   error:', e)
    print('shots in', OUT)
    print('FAILED: ' + ', '.join(fails) if fails else 'all checks passed')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
