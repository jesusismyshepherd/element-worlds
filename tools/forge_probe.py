"""The Atom Forge with every element: builds each one's commonest isotope, decays it up to four times,
makes an ion or two, and reads the HUD's text (both languages, both depths) for words gone wrong
("undefined", "NaN", "null", an unfilled {{template}}). Console errors fail the run. Also the odd
cases: nothing, one neutron, two neutrons, an electron with no proton, too many electrons, a nucleus
far past the drip lines. Start the dev server first (port 5310).

    python tools/forge_probe.py           all 118
    python tools/forge_probe.py 6 92 118  some (atomic numbers)
"""
import argparse
import re
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && window.__ew.world.goTo && !window.__ew.store.get().fading'
BAD = re.compile(r'undefined|NaN|\bnull\b|\[object|\{\{|\}\}')
HUD = "() => [...document.querySelectorAll('.glass')].map(e => e.innerText).join(' | ')"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('z', nargs='*', type=int)
    ap.add_argument('--port', type=int, default=5310)
    a = ap.parse_args()
    errors = []
    problems = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': 1280, 'height': 800})
        where = {'at': 'start'}
        page.on('console', lambda m: m.type == 'error' and errors.append(f"{where['at']}: {m.text[:300]}"))
        page.on('pageerror', lambda e: errors.append(f"{where['at']}: {str(e)[:300]}"))
        page.goto(f'http://localhost:{a.port}/forge?lang=pt-pt')
        page.wait_for_function(READY, timeout=60000)
        # hold: nothing decays by itself while the probe reads
        page.evaluate('() => __ew.world.setHeld(true)')

        def look(label):
            for lang in ('pt-pt', 'en'):
                page.evaluate(f"() => __ew.i18n.changeLanguage('{lang}')")
                for level in ('explorer', 'scientist'):
                    page.evaluate(f"() => __ew.store.set({{ level: '{level}' }})")
                    page.wait_for_timeout(30)
                    text = page.evaluate(HUD)
                    m = BAD.search(text)
                    if m:
                        i = m.start()
                        problems.append(f'{label} {lang} {level}: ...{text[max(0, i - 80):i + 40]}...')

        odd = [
            ('nothing', '__ew.world.set(0, 0, 0)'), ('one neutron', '__ew.world.set(0, 1, 0)'),
            ('two neutrons', '__ew.world.set(0, 2, 0)'), ('electron without proton', "__ew.world.add('e')"),
            ('hydride', "__ew.world.set(1, 0, 2)"), ('neon anion', "__ew.world.set(10, 10, 10); __ew.world.add('e')"),
            ('too many electrons', "__ew.world.set(8, 8, 11); __ew.world.add('e')"),
            ('neutron rich carbon', '__ew.world.set(6, 30, 6)'), ('proton rich carbon', '__ew.world.set(6, 0, 6)'),
            ('oganesson 295', '__ew.world.set(118, 177, 118)'), ('bare uranium', '__ew.world.set(92, 146, 0)'),
        ]
        for label, js in odd:
            where['at'] = label
            page.evaluate(f'() => {{ {js} }}')
            look(label)
            if page.evaluate('() => __ew.store.get().forge.canDecay'):
                page.evaluate('() => __ew.world.decay()')
                look(label + ' decayed')
        t0 = time.time()
        for z in a.z or range(1, 119):
            where['at'] = f'Z={z}'
            page.evaluate(f'() => __ew.world.goTo({z})')
            look(f'Z={z}')
            for k in range(4):
                if not page.evaluate('() => __ew.store.get().forge.canDecay'):
                    break
                page.evaluate('() => __ew.world.decay()')
                look(f'Z={z} decay {k + 1}')
            page.evaluate(f'() => __ew.world.goTo({z})')
            page.evaluate("() => { __ew.world.remove('e'); __ew.world.remove('e') }")
            look(f'Z={z} cation')
        b.close()
    print(f'forge read in {time.time() - t0:.0f} s')
    for x in problems:
        print('PROBLEM', x)
    for e in errors:
        print('console error:', e)
    sys.exit(1 if problems or errors else 0)


if __name__ == '__main__':
    main()
