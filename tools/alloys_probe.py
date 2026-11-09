"""The Alloy Forge (/lab/alloys) worked by hand, the way a player does it: with a mouse on a computer and
a finger on a phone, it taps an Atomling (one lump in), holds one (lumps keep coming), drags across one
(the view turns, nothing is thrown), taps the crucible (it pours: the ingot is the mix, the bronze is a
discovery), taps the hammer (a strike), and on pure copper and cast iron checks what the strikes did (the
rows slip; the ingot cracks). Every language, both depths: the card names the alloy, no hole in any text.
Screenshots in tools/shots/alloys/. docs/knowledge/alloys.md.

    py -3.11 tools/alloys_probe.py [--port 5322] [--base https://element-worlds.vercel.app]

Build into a scratch folder and preview it on its own port while other agents edit files
(CLAUDE.md, "Working traps").
"""
import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

# the cards carry emoji and every language's letters: print them whatever the console's code page
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUT = Path(__file__).with_name('shots') / 'alloys'
READY = 'window.__ew && window.__ew.world && window.__ew.world.points && !window.__ew.store.get().fading'
HOLES = ('undefined', 'NaN', '[object', '{{', '${')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5322)
    ap.add_argument('--base', default=None)
    a = ap.parse_args()
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:66} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])

        def open_page(lang='en', level='explorer', phone=False):
            ctx = b.new_context(viewport={'width': 390, 'height': 844} if phone else {'width': 1440, 'height': 860},
                                device_scale_factor=2 if phone else 1, has_touch=phone, is_mobile=phone)
            page = ctx.new_page()
            page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.add_init_script(f"try {{ localStorage.clear(); localStorage.setItem('ew-level', '{level}') }} catch (e) {{}}")
            page.goto(f'{base}/lab/alloys?lang={lang}')
            page.wait_for_function(READY, timeout=90000)
            time.sleep(2.5)
            return page

        state = lambda page: page.evaluate('() => JSON.parse(JSON.stringify(__ew.world.state()))')
        pts = lambda page: page.evaluate('() => __ew.world.points()')

        # ---- a computer, with a mouse ----
        page = open_page()
        pt = pts(page)
        x, y = pt['metals']['Cu']
        page.mouse.click(x, y)
        time.sleep(0.3)
        check('a click on the copper Atomling throws one lump in', state(page)['crucible']['mix'] == {'Cu': 1}, json.dumps(state(page)['crucible']['mix']))
        x, y = pt['metals']['Sn']
        page.mouse.move(x, y)
        page.mouse.down()
        time.sleep(1.3)
        page.mouse.up()
        tin = state(page)['crucible']['mix'].get('Sn', 0)
        check('holding the tin Atomling keeps throwing', tin >= 4, f'{tin} lumps')
        before = state(page)['crucible']['mix']
        x, y = pt['metals']['Zn']
        page.mouse.move(x, y)
        page.mouse.down()
        page.mouse.move(x + 120, y - 30, steps=8)
        page.mouse.up()
        time.sleep(0.3)
        check('a drag that starts on an Atomling turns the view, throws nothing', state(page)['crucible']['mix'] == before)
        page.evaluate("() => __ew.world.empty()")
        for _ in range(8):
            page.mouse.click(*pts(page)['metals']['Cu'])
            time.sleep(0.12)
        page.mouse.click(*pts(page)['metals']['Sn'])
        time.sleep(0.8)
        card = page.inner_text('[data-alloys-crucible]')
        check('eight copper and one tin: the card names bronze', 'Bronze' in card, card.replace('\n', ' | ')[:90])
        page.screenshot(path=str(OUT / 'bronze_mixed.png'))
        page.mouse.click(*pts(page)['crucible'])
        time.sleep(0.4)
        check('a click on the crucible pours', state(page)['pouring'])
        time.sleep(4.2)
        s = state(page)
        check('the ingot is the bronze', s['ingotInfo'].get('id') == 'bronze' and s['crucible']['mix'] == {}, json.dumps(s['ingot']))
        check('bronze is a discovery', page.evaluate("() => JSON.parse(localStorage.getItem('ew-found') || '[]').includes('bench:alloys:bronze')"))
        page.mouse.click(*pts(page)['anvil'])
        time.sleep(1.4)
        s = state(page)
        check('a click on the anvil strikes', s['ingot']['strikes'] == 1 and s['last'] and s['last']['kind'] == 'jam', json.dumps(s['last']))
        strike = page.inner_text('[data-alloys-strike]')
        check('the card says what the strike did', 'tin' in strike.lower(), strike[:80])
        page.screenshot(path=str(OUT / 'bronze_struck.png'))
        page.evaluate("() => { __ew.world.empty(); __ew.world.drop('Cu') }")
        page.mouse.click(*pts(page)['crucible'])
        time.sleep(4.4)
        for _ in range(3):
            page.mouse.click(*pts(page)['anvil'])
            time.sleep(1.1)
        s = state(page)
        check('pure copper: its rows slip', s['last']['kind'] == 'slip' and any(v != 0 for v in s['shifts']), json.dumps(s['shifts']))
        page.evaluate("() => __ew.world.recipe('castIron')")
        time.sleep(1.4)
        page.mouse.click(*pts(page)['crucible'])
        time.sleep(4.4)
        page.mouse.click(*pts(page)['anvil'])
        time.sleep(1.6)
        s = state(page)
        check('cast iron cracks', s['cracked'] and s['last']['kind'] == 'crack')
        found = page.evaluate("() => JSON.parse(localStorage.getItem('ew-found') || '[]').filter(k => k.startsWith('bench:alloys:'))")
        check('discoveries: bronze, the first strike, cast iron, the crack', {'bench:alloys:bronze', 'bench:alloys:strike', 'bench:alloys:castIron', 'bench:alloys:crack'} <= set(found), ', '.join(found))
        page.screenshot(path=str(OUT / 'cast_iron.png'))
        # the bench is the player's own: come back to it and the cracked ingot is still on the anvil
        page.evaluate("() => __ew.go('/lab')")
        page.wait_for_function("() => location.pathname === '/lab' && __ew.world && !__ew.store.get().fading", timeout=60000)
        page.evaluate("() => __ew.go('/lab/alloys')")
        page.wait_for_function(READY, timeout=60000)
        time.sleep(1.5)
        s = state(page)
        check('back at the bench: the cracked cast iron is still there', s['ingotInfo'].get('id') == 'castIron' and s['cracked'], json.dumps(s['ingot']))
        page.context.close()

        # ---- light mode (phones, weak computers): fewer particles, the same bench ----
        page = open_page(lang='en')
        page.goto(f'{base}/lab/alloys?lang=en&light=1')
        page.wait_for_function(READY, timeout=90000)
        time.sleep(2)
        page.evaluate("() => { __ew.world.recipe('stainless'); }")
        time.sleep(1.2)
        page.evaluate("() => __ew.world.pour()")
        time.sleep(4.2)
        page.evaluate("() => __ew.world.strike()")
        time.sleep(1.5)
        check('light mode: stainless steel poured and struck', state(page)['ingotInfo'].get('id') == 'stainless' and state(page)['ingot']['strikes'] == 1)
        page.screenshot(path=str(OUT / 'light.png'))
        page.context.close()

        # ---- a phone, with a finger ----
        page = open_page(lang='pt-pt', phone=True)
        page.touchscreen.tap(*pts(page)['metals']['Au'])
        time.sleep(0.3)
        check('a tap on the gold Atomling (phone) throws one lump in', state(page)['crucible']['mix'] == {'Au': 1}, json.dumps(state(page)['crucible']['mix']))
        page.touchscreen.tap(*pts(page)['crucible'])
        time.sleep(4.4)
        check('a tap on the crucible (phone) pours', state(page)['ingotInfo'].get('el') == 'Au')
        page.touchscreen.tap(*pts(page)['anvil'])
        time.sleep(1.4)
        check('a tap on the anvil (phone) strikes', state(page)['ingot']['strikes'] == 1)
        page.screenshot(path=str(OUT / 'phone_gold.png'))
        page.context.close()

        # ---- every language, both depths: the words with no holes ----
        for lang in ('pt-pt', 'en', 'pl', 'de'):
            for level in ('explorer', 'scientist'):
                page = open_page(lang=lang, level=level)
                for alloy in ('bronze', 'steel', 'solder', 'gold18'):
                    page.evaluate(f"() => __ew.world.recipe('{alloy}')")
                    time.sleep(0.3)
                    page.evaluate("() => __ew.world.pour()")
                    time.sleep(3.9)
                    page.evaluate("() => __ew.world.strike()")
                    time.sleep(0.9)
                    text = page.inner_text('[data-alloys-crucible]') + ' ' + page.inner_text('[data-alloys-ingot]')
                    holes = [h for h in HOLES if h in text]
                    check(f'{lang} {level} {alloy}: words with no holes, no em dash', not holes and '—' not in text, ','.join(holes))
                page.screenshot(path=str(OUT / f'{lang}_{level}.png'))
                page.context.close()
        b.close()

    for e in errors:
        print('console:', e[:300])
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
