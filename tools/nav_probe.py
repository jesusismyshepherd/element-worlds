"""Walking and looking in the halls and wings (the user's notes of 2026-10-28; docs/knowledge/walking.md):
first person turns on A/D like the character; the character's view can look up past where the floor
stopped it; a floating Atomling (helium) is framed, not left at the top of the screen; the camera moves
smoothly as carbon walks into the nanotube and out (no jumps); an open panel follows a change of level;
a second exhibit near an open panel is offered and E switches to it; two fingers pinch the camera
nearer; no jump button on a touch screen. Start the dev server first (port 5310).

    python tools/nav_probe.py
    python tools/nav_probe.py --base https://element-worlds.vercel.app   (the tube on the live site)
"""
import argparse
import sys

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default='')
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    base = a.base or f'http://localhost:{a.port}'
    fails = []
    errors = []

    def check(what, ok, detail=''):
        print(f'{what:62} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def open_page(ctx, path):
        page = ctx.new_page()
        page.on('pageerror', lambda e: errors.append(f'{path}: {str(e)[:200]}'))
        page.on('console', lambda m: m.type == 'error' and errors.append(f'{path}: {m.text[:200]}'))
        page.goto(f'{base}{path}?lang=en')
        page.wait_for_function(READY, timeout=90000)
        page.wait_for_timeout(800)
        return page

    def hold(page, key, seconds):
        page.keyboard.down(key)
        page.wait_for_timeout(int(seconds * 1000))
        page.keyboard.up(key)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        desk = b.new_context(viewport={'width': 1280, 'height': 720})
        phone = b.new_context(viewport={'width': 800, 'height': 380}, is_mobile=True, has_touch=True, device_scale_factor=2)

        if 'first' in a.only or not a.only:
            page = open_page(desk, '/e/C')
            page.evaluate("() => __ew.setMode('first')")
            page.wait_for_timeout(300)
            before = page.evaluate('() => ({ x: __ew.player.pos.x, z: __ew.player.pos.z, yaw: __ew.player.yaw })')
            hold(page, 'KeyD', 0.6)
            after = page.evaluate('() => ({ x: __ew.player.pos.x, z: __ew.player.pos.z, yaw: __ew.player.yaw })')
            moved = ((after['x'] - before['x']) ** 2 + (after['z'] - before['z']) ** 2) ** 0.5
            check('first person: D turns', after['yaw'] < before['yaw'] - 0.4, f"(yaw {before['yaw']:.2f} -> {after['yaw']:.2f})")
            check('first person: D does not step sideways', moved < 0.05, f'(moved {moved:.2f} m)')
            page.close()

        if 'look' in a.only or not a.only:
            page = open_page(desk, '/e/C')
            page.mouse.move(640, 300)
            page.mouse.down()
            for i in range(30):
                page.mouse.move(640, 300 - (i + 1) * 9)
            page.mouse.up()
            page.wait_for_timeout(400)
            up = page.evaluate('() => { const v = new __ew.camera.position.constructor(); __ew.camera.getWorldDirection(v); return v.y }')
            check('character: a long drag up looks up', up > 0.35, f'(view direction up {up:.2f}; was about 0.1 at most)')
            page.close()
            # helium floats 1.38 m up: its body is framed near the middle, not at the top
            for ctx, name in ((desk, 'computer'), (phone, 'phone')):
                page = open_page(ctx, '/e/He')
                y = page.evaluate("""() => {
                  const p = __ew.player, v = p.camTarget.clone().project(__ew.camera)
                  return { y: v.y, d: __ew.camera.position.distanceTo(p.camTarget) }
                }""")
                check(f'helium on a {name}: its body near the middle of the view', abs(y['y']) < 0.3, f"(screen y {y['y']:.2f}, camera {y['d']:.1f} m away)")
                page.close()

        if 'tube' in a.only or not a.only:
            for ctx, name in ((desk, 'computer'), (phone, 'phone')):
                page = open_page(ctx, '/e/C/allotropes')
                trace = []
                # in from the hall (north), then out from inside the tube (south); each walk starts once
                # the camera has settled after the probe put the walker there
                for z, yaw in ((-14.0, 0), (-25.0, 3.14159)):
                    page.evaluate(f'() => __ew.teleport(0, {z}, {yaw}, 0)')
                    page.wait_for_timeout(1500)
                    page.evaluate("""() => {
                      window.__trace = []
                      const tick = () => {
                        const c = __ew.camera.position, q = __ew.player.pos
                        window.__trace.push([c.x, c.y, c.z, q.x, q.z])
                        window.__raf = requestAnimationFrame(tick)
                      }
                      tick()
                    }""")
                    hold(page, 'KeyW', 7)
                    trace += [page.evaluate('() => { cancelAnimationFrame(window.__raf); return window.__trace }')]
                worst = 0
                jumps = 0
                for run in trace:
                    for i in range(1, len(run)):
                        c0, c1 = run[i - 1], run[i]
                        cam = ((c1[0] - c0[0]) ** 2 + (c1[1] - c0[1]) ** 2 + (c1[2] - c0[2]) ** 2) ** 0.5
                        walk = ((c1[3] - c0[3]) ** 2 + (c1[4] - c0[4]) ** 2) ** 0.5
                        extra = cam - walk
                        worst = max(worst, extra)
                        if extra > 0.15:
                            jumps += 1
                span = f"z {trace[0][0][4]:.1f} to {trace[0][-1][4]:.1f}, then {trace[1][0][4]:.1f} to {trace[1][-1][4]:.1f}"
                check(f'nanotube on a {name}: the camera never jumps', jumps == 0, f'(frames with a jump: {jumps}, worst {worst:.2f} m beyond the walk; {span})')
                page.close()

        if 'panel' in a.only or not a.only:
            page = open_page(desk, '/e/C')
            # two stations close together
            pair = page.evaluate("""() => {
              const list = __ew.world.interactables.filter(i => i.onUse && !/arch|door/i.test(i.id))
              let best = null
              for (const a of list) for (const b of list) {
                if (a === b) continue
                const d = Math.hypot(a.x - b.x, a.z - b.z)
                if (d > 1.2 && (!best || d < best.d)) best = { a: a.id, b: b.id, d }
              }
              return best
            }""")
            page.evaluate(f"() => {{ const it = __ew.world.interactables.find(i => i.id === '{pair['a']}'); __ew.teleport(it.x, it.z) }}")
            page.wait_for_timeout(300)
            page.keyboard.press('KeyE')
            page.wait_for_timeout(300)
            kid = page.evaluate('() => JSON.stringify(__ew.store.get().panel?.blocks)')
            page.evaluate("() => __ew.store.set({ level: 'scientist' })")
            page.wait_for_timeout(200)
            sci = page.evaluate('() => JSON.stringify(__ew.store.get().panel?.blocks)')
            check('an open panel follows a change of level', kid and sci and kid != sci)
            page.evaluate("() => __ew.store.set({ level: 'explorer' })")
            # walk to the neighbour: still offered, E switches
            page.evaluate(f"() => {{ const it = __ew.world.interactables.find(i => i.id === '{pair['b']}'); __ew.teleport(it.x, it.z) }}")
            page.wait_for_timeout(400)
            s = page.evaluate('() => { const s = __ew.store.get(); return { prompt: s.prompt?.id, from: s.panelFrom, open: !!s.panel } }')
            shown = page.locator('kbd', has_text='E').count()
            check('a neighbour exhibit is offered beside the open panel', s['open'] and s['prompt'] == pair['b'] and shown > 0, f"({pair['a']} open, {s['prompt']} offered, {pair['d']:.1f} m apart)")
            page.keyboard.press('KeyE')
            page.wait_for_timeout(300)
            s = page.evaluate('() => { const s = __ew.store.get(); return { from: s.panelFrom, open: !!s.panel } }')
            check('E switches the panel to the neighbour', s['open'] and s['from'] == pair['b'], f"(panel from {s['from']})")
            page.keyboard.press('KeyE')
            page.wait_for_timeout(200)
            check('E again closes it', not page.evaluate('() => !!__ew.store.get().panel'))
            page.close()

        if 'touch' in a.only or not a.only:
            page = open_page(phone, '/e/C')
            check('no jump button on a touch screen', page.get_by_role('button', name='Jump').count() == 0)
            before = page.evaluate('() => __ew.player.camDist')
            cdp = page.context.new_cdp_session(page)

            def touch(kind, pts):
                cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [{'x': x, 'y': y, 'id': i} for i, (x, y) in enumerate(pts)]})

            touch('touchStart', [(380, 200), (420, 200)])
            for k in range(1, 11):
                touch('touchMove', [(380 - k * 12, 200), (420 + k * 12, 200)])
                page.wait_for_timeout(20)
            touch('touchEnd', [])
            page.wait_for_timeout(300)
            after = page.evaluate('() => __ew.player.camDist')
            check('two fingers apart bring the camera nearer', after < before * 0.8, f'({before:.1f} -> {after:.1f} m)')
            page.close()
        b.close()
    for e in errors:
        print('console error:', e)
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
