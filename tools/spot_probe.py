"""A reload puts the walker back where they stood (src/engine/engine.js keepSpot; the user, 2026-10-29:
a refresh threw him back to the start of the room). In Carbon's hall and in Oxygen's air wing: walk
somewhere, reload, and the walker stands there, facing the same way; then leave and come back through
the door, and the walker arrives at the door as usual (only the first world after a load goes back).
On the table: turn and zoom the view, pick an element, light a trend, reload: the same view, pick and
trend come back.
Dev server on 5310, or --base.

    python tools/spot_probe.py [--base http://localhost:5310]
"""
import math
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:5310'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    base = sys.argv[sys.argv.index('--base') + 1] if '--base' in sys.argv else BASE
    fails = []

    def check(what, ok, detail=''):
        print(f'{what:62} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])
        page = b.new_page(viewport={'width': 1280, 'height': 720})
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))

        def at(path):
            page.wait_for_function(f"() => window.__ew && __ew.world && location.pathname === '{path}' && !__ew.store.get().fading", timeout=90000)
            page.wait_for_timeout(800)

        where = lambda: page.evaluate('() => ({ x: __ew.player.pos.x, z: __ew.player.pos.z, yaw: __ew.player.yaw })')
        for path, (x, z, yaw) in [('/e/C', (3.1, -2.4, 1.1)), ('/e/O/air', (-4.0, 3.0, -2.0))]:
            page.goto(f'{base}{path}?lang=en')
            at(path)
            door = where()
            page.evaluate(f'() => __ew.teleport({x}, {z}, {yaw}, 0)')
            page.wait_for_timeout(1800)
            stood = where()
            page.reload()
            at(path)
            back = where()
            d = math.hypot(back['x'] - stood['x'], back['z'] - stood['z'])
            check(f'{path}: a reload puts the walker back where they stood', d < 0.05 and abs(back['yaw'] - stood['yaw']) < 0.01, f'{d:.3f} m off, yaw {back["yaw"]:.2f}')
            page.evaluate("() => __ew.go('/')")
            at('/')
            page.evaluate(f"() => __ew.go('{path}')")
            at(path)
            again = where()
            d = math.hypot(again['x'] - door['x'], again['z'] - door['z'])
            check(f'{path}: coming back later arrives at the door again', d < 0.3, f'{d:.2f} m from the door')
        page.goto(f'{base}/?lang=en')
        at('/')
        page.evaluate('() => { __ew.world.select(26); __ew.world.setTrend("radius") }')
        page.wait_for_timeout(1500)
        # the player's own view: turned and nearer, away from where a pick flies to
        page.evaluate('() => __ew.camera.position.set(-30, 22, 40)')
        page.wait_for_timeout(1500)
        view = lambda: page.evaluate('() => ({ cam: __ew.camera.position.toArray(), sel: __ew.store.get().selected, trend: __ew.store.get().trend })')
        before = view()
        page.reload()
        at('/')
        after = view()
        d = math.dist(before['cam'], after['cam'])
        check('the table: a reload keeps the view', d < 0.1, f'{d:.3f} off, {after["cam"]}')
        check('the table: and the element picked and the trend', after['sel'] == 26 and after['trend'] == 'radius', f'{after["sel"]} {after["trend"]}')
        check('nothing throws', not errs, str(errs))
        b.close()
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
