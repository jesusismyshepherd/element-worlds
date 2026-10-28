"""The site on a real Android phone (or an Android emulator), driven from this computer: Chrome on the
phone is reached through adb (Android's debugging bridge, installed with `winget install
Google.PlatformTools`) and its DevTools socket, and Playwright drives it like any other browser. What a
headless browser cannot tell: the phone's own graphics chip (frame times), its real touch, its browser's
full screen, its screen. Screenshots land in tools/shots/phone/.

One-time on the phone (Android 11 or later, same Wi-Fi as this computer): Settings > About phone >
Software information > tap Build number seven times (Developer options appear); Developer options >
Wireless debugging on > Pair device with pairing code. Then:

    python tools/phone.py pair 192.168.1.23:41234 123456   the address and code the pairing screen shows
    python tools/phone.py connect 192.168.1.23:37755       the address on the Wireless debugging screen
    python tools/phone.py status                           the phone, its screen, Chrome's socket
    python tools/phone.py shot /e/C --steps "wait:2; shot:hall; tap:200,600; wait:1; shot:after"
    python tools/phone.py frames /e/C/allotropes --seconds 10   frame times on the phone's own chip

Steps: wait:<s>, js:<code>, shot:<name>, tap:<x>,<y>, drag:<x1>,<y1>,<x2>,<y2>[,<ms>] (CSS pixels).
--base picks the site (default: the live one); the dev server can be used from the phone when it listens
on the network (`npm run dev -- --host`) as http://<this computer's address>:5310. Turn Wireless debugging
off on the phone when done: it gives this computer control of the phone.
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

LIVE = 'https://element-worlds.vercel.app'
READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
PORT = 9222
OUT = os.path.join(os.path.dirname(__file__), 'shots', 'phone')


def adb_path():
    found = shutil.which('adb')
    if found:
        return found
    local = os.environ.get('LOCALAPPDATA', '')
    hits = glob.glob(os.path.join(local, 'Microsoft', 'WinGet', 'Packages', 'Google.PlatformTools*', 'platform-tools', 'adb.exe'))
    if hits:
        return hits[0]
    sys.exit('adb not found: winget install Google.PlatformTools')


def adb(*args, serial=None, check=True):
    cmd = [adb_path()] + (['-s', serial] if serial else []) + list(args)
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if check and r.returncode != 0:
        sys.exit(f'adb {" ".join(args)} failed: {(r.stderr or r.stdout).strip()}')
    return r.stdout.strip()


def devices():
    lines = adb('devices').splitlines()[1:]
    return [ln.split()[0] for ln in lines if ln.strip().endswith('device')]


def pick(serial):
    found = devices()
    if serial:
        if serial not in found:
            sys.exit(f'{serial} is not connected (connected: {", ".join(found) or "none"})')
        return serial
    if not found:
        sys.exit('No phone connected. On the phone: Developer options > Wireless debugging; then '
                 'python tools/phone.py pair <address> <code> and python tools/phone.py connect <address>.')
    if len(found) > 1:
        sys.exit(f'Several devices: pick one with --serial ({", ".join(found)})')
    return found[0]


def chrome_socket(serial):
    """Start Chrome on the phone if needed and forward its DevTools socket to localhost:PORT."""
    adb('shell', 'am', 'start', '-n', 'com.android.chrome/com.google.android.apps.chrome.Main', '-d', 'about:blank', serial=serial, check=False)
    time.sleep(1.5)
    adb('forward', f'tcp:{PORT}', 'localabstract:chrome_devtools_remote', serial=serial)
    for _ in range(10):
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/version', timeout=3) as r:
                return r.read().decode()
        except OSError:
            time.sleep(1)
    sys.exit('Chrome on the phone does not answer (is Chrome installed and opened once?)')


def open_page(p, serial, base, path):
    chrome_socket(serial)
    browser = p.chromium.connect_over_cdp(f'http://127.0.0.1:{PORT}')
    ctx = browser.contexts[0] if browser.contexts else browser.new_context()
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)[:300]))
    page.on('console', lambda m: m.type == 'error' and errors.append(m.text[:300]))
    page.goto(f'{base}{path}', timeout=120000)
    page.wait_for_function(READY, timeout=120000)
    return browser, page, errors


def touch(page, kind, pts):
    cdp = page.context.new_cdp_session(page)
    cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [{'x': x, 'y': y, 'id': i} for i, (x, y) in enumerate(pts)]})


def run_steps(page, steps, name):
    os.makedirs(OUT, exist_ok=True)
    steps = [s.strip() for s in steps.split(';') if s.strip()] or [f'shot:{name}']
    for s in steps:
        kind, _, arg = s.partition(':')
        if kind == 'wait':
            time.sleep(float(arg))
        elif kind == 'js':
            page.evaluate(arg)
        elif kind == 'tap':
            x, y = (float(v) for v in arg.split(','))
            page.touchscreen.tap(x, y)
        elif kind == 'drag':
            v = [float(n) for n in arg.split(',')]
            x1, y1, x2, y2 = v[:4]
            ms = v[4] if len(v) > 4 else 400
            n = max(4, int(ms / 16))
            touch(page, 'touchStart', [(x1, y1)])
            for i in range(1, n + 1):
                touch(page, 'touchMove', [(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n)])
                time.sleep(ms / 1000 / n)
            touch(page, 'touchEnd', [])
        elif kind == 'shot':
            path = os.path.join(OUT, f'{arg}.png')
            page.screenshot(path=path)
            print('shot', path)


FRAMES = """(seconds) => new Promise(done => {
  const d = []
  let last = performance.now()
  const end = last + seconds * 1000
  const tick = now => {
    d.push(now - last)
    last = now
    if (now < end) requestAnimationFrame(tick)
    else {
      d.sort((a, b) => a - b)
      const q = k => d[Math.min(d.length - 1, Math.floor(d.length * k))]
      const gl = __ew.renderer.getContext()
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      done({
        frames: d.length, median: q(0.5), p95: q(0.95), worst: d[d.length - 1],
        light: __ew.light, gpu: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : '?',
        screen: `${innerWidth}x${innerHeight} at ${devicePixelRatio}`, programs: __ew.renderer.info.programs.length,
      })
    }
  }
  requestAnimationFrame(tick)
})"""


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('command', choices=['pair', 'connect', 'status', 'shot', 'frames'])
    ap.add_argument('args', nargs='*')
    ap.add_argument('--serial', default=None)
    ap.add_argument('--base', default=LIVE)
    ap.add_argument('--steps', default='')
    ap.add_argument('--name', default='')
    ap.add_argument('--seconds', type=float, default=8)
    ap.add_argument('--lang', default='pt-pt')
    a = ap.parse_args()

    if a.command == 'pair':
        if len(a.args) != 2:
            sys.exit('pair <address:port> <code>')
        print(adb('pair', a.args[0], a.args[1]))
        return
    if a.command == 'connect':
        if len(a.args) != 1:
            sys.exit('connect <address:port>')
        print(adb('connect', a.args[0]))
        return
    serial = pick(a.serial)
    if a.command == 'status':
        model = adb('shell', 'getprop', 'ro.product.model', serial=serial)
        android = adb('shell', 'getprop', 'ro.build.version.release', serial=serial)
        size = adb('shell', 'wm', 'size', serial=serial)
        print(f'{serial}: {model}, Android {android}, {size}')
        version = chrome_socket(serial)
        print('Chrome:', version.split('"Browser":')[1].split(',')[0].strip() if '"Browser"' in version else 'answers')
        return
    path = a.args[0] if a.args else '/'
    sep = '&' if '?' in path else '?'
    with sync_playwright() as p:
        browser, page, errors = open_page(p, serial, a.base, f'{path}{sep}lang={a.lang}')
        time.sleep(1.5)
        if a.command == 'shot':
            run_steps(page, a.steps, a.name or (path.strip('/').replace('/', '_') or 'plaza'))
        else:
            if a.steps:
                run_steps(page, a.steps, a.name or 'frames')
            r = page.evaluate(FRAMES, a.seconds)
            print(f"{path}: {r['frames']} frames in {a.seconds:g} s; median {r['median']:.1f} ms, 95 % under {r['p95']:.1f} ms, "
                  f"worst {r['worst']:.0f} ms; light mode {r['light']}; {r['programs']} shader programs")
            print(f"  {r['gpu']}; screen {r['screen']}")
        page.close()
        browser.close()  # only the connection: Chrome on the phone stays open
    for e in errors:
        print('console error:', e)
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
