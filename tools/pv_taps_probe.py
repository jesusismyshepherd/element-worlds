"""The Periodic Videos labs worked by hand (src/worlds/wings/pv/, docs/knowledge/periodic-videos.md): every
step of a station is chosen by tapping its thing (the user, 2026-10-30), the prompt names the next tap, and E
opens the station's panel. For each station of a lab: walk up, press E (the panel and the station view), then
tap through its steps with real taps (a ray from the eye through the thing, as the engine sends a click),
checking for each that the hand shows over the thing, that the step happened (the station's shared state
changed), and what the prompt says next; a screenshot after each (tools/shots/pvtap_<lab>_<station>_<n>.png).

    py -3.11 tools/pv_taps_probe.py [--lab Na|Si|both] [--port 5310] [--phone] [--lang en] [--level scientist]
                                   [--only tin,bowl] [--first]
"""
import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).with_name('shots')
PI = 3.141592653589793

# per lab: each station's id (its exhibit and its shared state), where to stand (x, z, yaw), and the taps:
# (thing in parts.at, its argument or None, a condition to wait for afterwards)
IDLE = {
    'tin': '!p.tin.busy', 'bowl': '!p.bowl.busy', 'lump': '!p.lump.busy', 'chips': '!p.line.busy',
    'turbo': '!p.turbo.busy',
}
LABS = {
    'Na': [
        ('tin', (-5.4, 0.75, PI / 2), [('tin', None), ('knife', None), ('knife', None)]),
        ('bowl', (0, -7.25, 0), [('lump', 'medium'), ('lump', 'large'), ('indicator', None)]),
        ('window', (5.0, -1.55, -PI / 2), [('window', None), ('window', None)]),
        ('lamp', (5.1, 2.65, -PI / 2), [('lamp', None), ('lamp', None)]),
    ],
    'Si': [
        ('lump', (-5.4, 0.75, PI / 2), [('bottle', None), ('lump', None)]),
        ('chips', (-5.4, 2.6, PI / 2), [('wafer', None), ('tester', None), ('pc', None), ('carrier', 'big')]),
        ('wafer', (5.0, -1.55, -PI / 2), [('stand', None), ('disc', None)]),
        ('turbo', (0, -7.25, 0), [('pedal', None)]),
        ('minerals', (5.1, 2.65, -PI / 2), [('mineral', 'mica'), ('mineral', 'garnet')]),
    ],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lab', default='both')
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default=None)
    ap.add_argument('--phone', action='store_true')
    ap.add_argument('--lang', default='en')
    ap.add_argument('--level', default=None, help='explorer or scientist')
    ap.add_argument('--only', default='')
    ap.add_argument('--first', action='store_true', help='first person instead of the station view')
    a = ap.parse_args()
    # the prompts in Portuguese, Polish and German: a Windows console's code page cannot print them all
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    OUT.mkdir(exist_ok=True)
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    only = {s for s in a.only.split(',') if s}
    labs = ['Na', 'Si'] if a.lab == 'both' else [a.lab]
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:64} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        w, h = (390, 844) if a.phone else (1600, 900)
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2 if a.phone else 1,
                            has_touch=a.phone, is_mobile=a.phone)
        page = ctx.new_page()
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text[:300]))
        page.on('pageerror', lambda e: errors.append(str(e)[:300]))
        if a.level:
            page.add_init_script(f"try {{ localStorage.setItem('ew-level', '{a.level}') }} catch (e) {{}}")
        tag = ('phone_' if a.phone else '') + (a.level[:3] + '_' if a.level else '') + (a.lang + '_' if a.lang != 'en' else '')
        for lab in labs:
            page.goto(f'{base}/e/{lab}/videos?lang={a.lang}')
            page.wait_for_function('window.__ew && window.__ew.world && window.__ew.world.parts && !window.__ew.store.get().fading', timeout=90000)
            time.sleep(2)
            if a.first:
                page.evaluate("() => __ew.setMode('first')")
            for sid, (x, z, yaw), taps in LABS[lab]:
                if only and sid not in only:
                    continue
                page.evaluate(f'() => {{ __ew.store.set({{ panel: null }}); __ew.teleport({x}, {z}, {yaw}, 0.1) }}')
                time.sleep(1.2)
                near = page.evaluate('() => __ew.player.near?.id')
                check(f'{lab} {sid}: the station is offered', near == sid, str(near))
                hint0 = page.evaluate('() => __ew.store.get().prompt?.verb')
                print(f'   prompt: {hint0}')
                page.evaluate('() => __ew.player.use()')
                time.sleep(2.2)
                check(f'{lab} {sid}: E opens its panel', bool(page.evaluate('() => __ew.store.get().panel')))
                page.screenshot(path=str(OUT / f'pvtap_{tag}{lab}_{sid}_0.png'))
                for n, (thing, arg) in enumerate(taps, 1):
                    argjs = 'undefined' if arg is None else json.dumps(arg)
                    label = f'{lab} {sid}: tap {thing}{" " + arg if arg else ""}'
                    before = page.evaluate(f"() => JSON.stringify(__ew.world.shared['{sid}'].get())")
                    hand = page.evaluate(f'() => {{ const p = __ew.world.parts; return __ew.world.pointAt(p.rayTo(p.at.{thing}({argjs}))) }}')
                    check(f'{label}: the hand shows', hand)
                    page.evaluate(f'() => {{ const p = __ew.world.parts; __ew.world.onTap(p.rayTo(p.at.{thing}({argjs}))) }}')
                    time.sleep(0.5)
                    after = page.evaluate(f"() => JSON.stringify(__ew.world.shared['{sid}'].get())")
                    check(f'{label}: the step happened', after != before, f'{before} -> {after}')
                    page.screenshot(path=str(OUT / f'pvtap_{tag}{lab}_{sid}_{n}a.png'))
                    idle = IDLE.get(sid)
                    if idle:
                        try:
                            page.wait_for_function(f'() => {{ const p = __ew.world.parts; return {idle} }}', timeout=90000, polling=50)
                        except Exception:
                            check(f'{label}: it ends', False)
                    time.sleep(0.8)
                    page.screenshot(path=str(OUT / f'pvtap_{tag}{lab}_{sid}_{n}.png'))
                    print(f'   prompt: {page.evaluate("() => __ew.store.get().prompt?.verb")}')
                found = page.evaluate(f"() => __ew.player.near?.found")
                check(f'{lab} {sid}: found', bool(found))
        b.close()
    for e in errors:
        print('console:', e)
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
