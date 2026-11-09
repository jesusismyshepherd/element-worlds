"""The lab's Reactions bench (/lab/reactions; docs/knowledge/reactions.md), played with real taps on a computer:
every reaction balanced by tapping its molecules (and once a minus), its energy switched on where it needs one
(the sun lamp, the burner, the battery: tapped), run by tapping the arrow. Checks that the tally follows each
tap, that a minus takes one away and the last one stays, that nine is the most, that an unbalanced bench and a
bench without its light do not run, that a run keeps every atom (the very same Atomlings, by id, before and
after: nothing lost, nothing made), that each run is a discovery, and that Again brings the atoms back.
Also once in light mode (?light=1). Console errors fail the run.

    py -3.11 tools/reactions_probe.py [--port 5323] [--lang en]
"""
import argparse
import json
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && window.__ew.world.state && !window.__ew.store.get().fading'
REACTIONS = ['hydrogen', 'water', 'methane', 'salt', 'ammonia', 'limestone', 'rust', 'ethanol', 'photosynthesis', 'respiration']


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5323)
    ap.add_argument('--base', default='')
    ap.add_argument('--lang', default='en')
    a = ap.parse_args()
    base = a.base or f'http://localhost:{a.port}'
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:70} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_context(viewport={'width': 1440, 'height': 900}).new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text[:300]))
        page.on('pageerror', lambda e: errors.append(str(e)[:300]))
        # (a fresh browser context: no discoveries yet)
        page.goto(f'{base}/lab/reactions?lang={a.lang}')
        page.wait_for_function(READY, timeout=60000)
        time.sleep(2.5)

        st = lambda: page.evaluate('() => __ew.world.state()')
        hud = lambda: page.evaluate('() => __ew.store.get().reactions')

        def tap(what):
            pt = page.evaluate(f"() => __ew.world.screenOf('{what}')")
            if not pt:
                raise RuntimeError(f'nothing to tap: {what}')
            page.mouse.click(pt['x'], pt['y'])
            time.sleep(0.35)

        def wait_phase(ph, timeout=15000):
            try:
                page.wait_for_function(f"() => __ew.world.state().phase === '{ph}'", timeout=timeout)
                return True
            except Exception:
                return False

        for rid in REACTIONS:
            page.evaluate(f"() => __ew.world.pick('{rid}')")
            time.sleep(1.2)
            r = hud()
            # the answer, from the bench's own chemistry (the probe taps toward it one molecule at a time)
            answer = page.evaluate("() => __ew.world.answer()")
            k = r['k']
            check(f'{rid}: starts with one of each', k == [1] * len(k), str(k))
            sides = [('L', s) for s in range(len(r['left']))] + [('R', s) for s in range(len(r['right']))]
            for i, (side, s) in enumerate(sides):
                for _ in range(answer[i] - 1):
                    tap(f'add:{side}:{s}')
            r = hud()
            check(f'{rid}: tapping the molecules balanced it', r['k'] == answer and r['balanced'], f"{r['k']} vs {answer}")
            check(f'{rid}: the tally agrees on every element', all(t['ok'] for t in r['tally']), json.dumps(r['tally']))
            if rid == 'hydrogen':
                # a minus takes one away (the tally follows), the last one stays, nine is the most
                tap('minus:L:0')
                r = hud()
                check('hydrogen: the minus takes one H2 away', r['k'][0] == 1 and not r['balanced'], str(r['k']))
                tap('minus:L:0')
                check('hydrogen: the last one stays', hud()['k'][0] == 1)
                tap('arrow')
                check('hydrogen: unbalanced, the arrow does not run it', st()['phase'] == 'before' and hud()['note'] == 'unbalanced')
                for _ in range(9):
                    tap('add:L:0')
                r = hud()
                check('hydrogen: nine is the most', r['k'][0] == 9 and r['note'] == 'most', str(r['k']))
                for _ in range(7):
                    tap('minus:L:0')
                check('hydrogen: back to the answer', hud()['k'] == answer)
            if r['needs']:
                tap('arrow')
                check(f'{rid}: without its {r["needs"]} it does not run', st()['phase'] == 'before' and hud()['note'] == 'needs')
                tap('source')
                check(f'{rid}: tapping the {r["needs"]} switches it on', hud()['on'])
            before = st()
            tap('arrow')
            check(f'{rid}: the arrow runs it', st()['phase'] == 'running')
            time.sleep(1.4)
            mid = st()
            check(f'{rid}: mid-run, every atom still there', mid['ids'] == before['ids'], f"{mid['atoms']} of {before['atoms']}")
            ok = wait_phase('after')
            after = st()
            check(f'{rid}: it ran', ok)
            check(f'{rid}: the very same atoms after (nothing lost, nothing made)', after['ids'] == before['ids'] and after['els'] == before['els'], f"{after['atoms']} atoms")
            r = hud()
            check(f'{rid}: a discovery', next(x for x in r['list'] if x['id'] == rid)['done'] and bool(r['celebrate']))
            check(f'{rid}: its energy is shown', r['dH'] is not None and page.locator('[data-reactions-status]').inner_text().strip() != '')
            page.click('[data-reactions-again]')
            ok = wait_phase('before')
            back = st()
            check(f'{rid}: Again brings the same atoms back', ok and back['ids'] == before['ids'])
            page.screenshot(path=f'tools/shots/reactions_probe_{rid}.png')

        r = hud()
        check('every reaction found', all(x['done'] for x in r['list']), f"{sum(x['done'] for x in r['list'])}/{len(r['list'])}")

        # light mode: the bench runs there too
        page.goto(f'{base}/lab/reactions?lang={a.lang}&light=1')
        page.wait_for_function(READY, timeout=60000)
        time.sleep(1.5)
        page.evaluate("() => { __ew.world.pick('methane'); __ew.world.solve() }")
        time.sleep(0.8)
        page.evaluate('() => __ew.world.run()')
        check('light mode: methane runs', wait_phase('after'))
        page.screenshot(path='tools/shots/reactions_probe_light.png')
        frames = page.evaluate('window.__ew.frames')
        print(f'frames drawn: {frames}')
        b.close()
    for e in errors:
        print('console error:', e)
    print(f'{len(fails)} wrong' if fails else 'all ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
