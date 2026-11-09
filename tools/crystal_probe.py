"""The lab's crystal bench (/lab/crystal; docs/knowledge/crystal.md): two people in one room grow the same
crystal, ion for ion. Ana on a computer, Bob on a phone in light mode (fewer drifting ions, plainer spheres,
the same crystal). Ana starts a fast dish of table salt (a hopper and salt boats); when it has grown on both
screens, their crystals' fingerprints (how many ions, a hash of where each one is) must match. Then Ana picks
fluorite and Bob comes in late to a dish that was left growing: the same again. Console errors fail it.
Probe rooms are named PRB... (ew_room_world keeps them; they can be cleared). Shots in tools/shots/crystal/.

    py -3.11 tools/crystal_probe.py [--base http://localhost:5321]
"""
import argparse
import pathlib
import random
import sys
import time

from playwright.sync_api import sync_playwright

OUT = pathlib.Path(__file__).parent / 'shots' / 'crystal'
READY = 'window.__ew && window.__ew.world && window.__ew.world.fingerprint && !window.__ew.store.get().fading'
DONE = '() => __ew.world.state().age != null && __ew.world.state().done.every(Boolean)'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:64} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        ana = b.new_context(viewport={'width': 1280, 'height': 720}).new_page()
        bob = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, has_touch=True, is_mobile=True).new_page()
        for n, pg in (('Ana', ana), ('Bob', bob)):
            pg.on('pageerror', lambda e, n=n: errors.append(f'{n}: {str(e)[:200]}'))
            pg.on('console', lambda m, n=n: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
        code = 'PRB' + ''.join(random.choice('ABCDEFGHJKMNPQRSTUVWXYZ') for _ in range(3))

        def join(pg, name, query=''):
            pg.goto(f'{a.base}/lab/crystal?lang=en{query}')
            pg.wait_for_function(READY, timeout=90000)
            pg.click('[data-room-button]')
            pg.fill('[data-room-name]', name)
            pg.fill('[data-room-code]', code)
            pg.click('[data-room-start]' if name == 'Ana' else '[data-room-join]')
            pg.wait_for_function("() => __ewRoom.status === 'on' && __ewShared.mode === 'room'", timeout=20000)
            if pg.query_selector('[data-room-sheet]'):
                pg.click('[data-room-button]')

        join(ana, 'Ana')
        join(bob, 'Bob', '&light=1')
        for pg in (ana, bob):
            pg.wait_for_function('() => __ewRoom.members.length === 2', timeout=20000)
        time.sleep(1)
        check('Bob is in light mode', bob.evaluate('() => __ew.light') is True)

        # a fast dish of salt: the hopper on the thread and boats on the brine
        ana.evaluate('() => __ew.world.setSpeed(0.9)')
        bob.wait_for_function("() => __ew.world.state().age != null && __ew.world.state().s === 0.9", timeout=10000)
        check("Bob's dish starts with Ana's", True, bob.evaluate('() => JSON.stringify(__ew.world.shared.dish.get())')[:90])
        time.sleep(8)
        ana.screenshot(path=str(OUT / 'ana_growing.png'))
        bob.screenshot(path=str(OUT / 'bob_growing.png'))
        for pg in (ana, bob):
            pg.wait_for_function(DONE, timeout=60000)
        fa = ana.evaluate('() => __ew.world.fingerprint()')
        fb = bob.evaluate('() => __ew.world.fingerprint()')
        check('the same crystals, ion for ion (salt, fast)', fa == fb, f'{fa} | {fb}')
        check('a hopper with boats', ana.evaluate('() => __ew.world.state().plan.habit') == 'hopper' and ana.evaluate('() => __ew.world.state().plan.crystals') >= 2)
        ana.screenshot(path=str(OUT / 'ana_done.png'))
        bob.screenshot(path=str(OUT / 'bob_done.png'))

        # Bob leaves; Ana starts fluorite; Bob comes back while it grows and finds it as it stands
        bob.evaluate("() => __ew.go('/lab')")
        bob.wait_for_function("() => location.pathname === '/lab' && __ew.world && !__ew.store.get().fading", timeout=60000)
        ana.evaluate("() => { __ew.world.pick('CaF2') }")
        time.sleep(6)
        bob.evaluate("() => __ew.go('/lab/crystal')")
        bob.wait_for_function(f"() => location.pathname === '/lab/crystal' && {READY.replace('window.__ew.world.fingerprint', '__ew.world.fingerprint')}", timeout=60000)
        bob.wait_for_function("() => __ew.world.state().c === 'CaF2'", timeout=15000)
        for pg in (ana, bob):
            pg.wait_for_function(DONE, timeout=90000)
        fa = ana.evaluate('() => __ew.world.fingerprint()')
        fb = bob.evaluate('() => __ew.world.fingerprint()')
        check('a latecomer finds the same fluorite', fa == fb, f'{fa} | {fb}')
        # a tap stays one's own
        bob.evaluate("() => __ew.world.tapIon(0, 'inside')")
        time.sleep(0.6)
        check("Bob's tap is his alone", bob.evaluate('() => !!__ew.world.state().tapped') and not ana.evaluate('() => !!__ew.world.state().tapped'))
        bob.screenshot(path=str(OUT / 'bob_tap.png'))
        b.close()

    for e in errors:
        print('console:', e)
    check('no console errors', not errors)
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
