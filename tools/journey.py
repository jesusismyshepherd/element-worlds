"""A whole visit, the way a player makes it: the plaza, a cube selected and entered, a station read in
the atrium, through every wing's door and back, out to the plaza again. Checks that each world
arrives, times each move, and fails on console errors. Run with the dev server up (port 5310).

    python tools/journey.py C O
    python tools/journey.py C --phone
"""
import argparse
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def arrive(page, kind, symbol=None, wing=None, timeout=30):
    t0 = time.time()
    while time.time() - t0 < timeout:
        w = page.evaluate('() => window.__ew && window.__ew.store.get().world')
        fading = page.evaluate('() => window.__ew && window.__ew.store.get().fading')
        if w and not fading and w['kind'] == kind and (symbol is None or w['symbol'] == symbol) and (wing is None or w['wing'] == wing):
            return time.time() - t0
        time.sleep(0.1)
    raise SystemExit(f'did not arrive in {kind} {symbol or ""} {wing or ""}')


def walk_into(page, door):
    """Step into a door's trigger (doors open by walking into them; the walk there is not tested)."""
    page.evaluate(f"() => {{ const d = {door}; __ew.teleport(d.x, d.z) }}")
    time.sleep(0.4)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('symbols', nargs='*', default=['C', 'O'])
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--phone', action='store_true')
    a = ap.parse_args()
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        ctx = b.new_context(viewport={'width': 390, 'height': 844} if a.phone else {'width': 1400, 'height': 820},
                            has_touch=a.phone, is_mobile=a.phone, device_scale_factor=2 if a.phone else 1)
        page = ctx.new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(f'http://localhost:{a.port}/?lang=pt-pt')
        page.wait_for_function(READY, timeout=60000)
        print(f'plaza ready')
        for sym in a.symbols:
            page.evaluate(f"() => {{ const el = {{C: 6, O: 8}}['{sym}'] ?? null; if (el) __ew.world.select(el) }}")
            time.sleep(1.2)
            page.evaluate('() => __ew.world.enterSelected()')
            print(f'{sym}: atrium in {arrive(page, "atrium", sym):.2f} s')
            time.sleep(1.0)
            found = page.evaluate('() => __ew.store.get().discoveries')
            page.evaluate("() => __ew.world.interactables.find(i => i.id === 'identity').onUse()")
            panel = page.evaluate('() => __ew.store.get().panel && __ew.store.get().panel.title')
            page.evaluate('() => __ew.store.set({ panel: null })')
            print(f'  discoveries {found}, panel "{panel}"')
            doors = page.evaluate('() => __ew.world.doors.map(d => ({ x: d.x, z: d.z, to: d.to }))')
            for d in doors:
                if not d['to'].startswith(f'/e/{sym}/'):
                    continue
                wing = d['to'].split('/')[-1]
                walk_into(page, f"{{x: {d['x']}, z: {d['z']}}}")
                print(f'  wing {wing} in {arrive(page, "wing", sym, wing):.2f} s, title "{page.evaluate("() => __ew.store.get().title")}"')
                time.sleep(1.5)
                back = page.evaluate("() => __ew.world.doors.find(d => d.to === '/e/" + sym + "')")
                if not back:
                    raise SystemExit(f'wing {wing} has no door back to the atrium')
                walk_into(page, f"{{x: {back['x']}, z: {back['z']}}}")
                print(f'  back in the atrium in {arrive(page, "atrium", sym):.2f} s')
                time.sleep(1.0)
            out = page.evaluate("() => __ew.world.doors.find(d => d.to.startsWith('/?at='))")
            walk_into(page, f"{{x: {out['x']}, z: {out['z']}}}")
            print(f'  out to the plaza in {arrive(page, "plaza"):.2f} s, selected {page.evaluate("() => __ew.store.get().selected")}')
            time.sleep(1.8)
        b.close()
    for e in errors:
        print('console error:', e[:300])
    print('OK' if not errors else f'{len(errors)} console errors')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
