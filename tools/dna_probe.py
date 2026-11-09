"""The lab's DNA bench (/lab/dna, docs/knowledge/dna.md): build a strand by its four letters, check that each
pair came with its partner (both strands' nucleotides on show), the letters reach the HUD, undo and clear,
the twist slider, a copy that ends with two helices, the finds kept, and no console errors. A computer and an
upright phone (the helix stands up there). Screenshots in tools/shots/dna/.

    py -3.11 tools/dna_probe.py [--base http://localhost:5324] [--lang en]
"""
import argparse
import os
import sys

from playwright.sync_api import sync_playwright

OUT = os.path.join(os.path.dirname(__file__), 'shots', 'dna')
READY = 'window.__ew && window.__ew.world && window.__ew.world.add && !window.__ew.store.get().fading'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5324')
    ap.add_argument('--lang', default='en')
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    problems = []
    errors = []

    def check(name, ok, detail=''):
        print(f'{name:58} {"ok" if ok else "PROBLEM"} {detail}')
        if not ok:
            problems.append(name)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        for screen, (w, h, touch) in {'computer': (1440, 900, False), 'phone': (390, 844, True)}.items():
            ctx = b.new_context(viewport={'width': w, 'height': h}, is_mobile=touch, has_touch=touch, device_scale_factor=2 if touch else 1)
            page = ctx.new_page()
            page.on('console', lambda m, s=screen: m.type == 'error' and errors.append(f'{s}: {m.text[:200]}'))
            page.on('pageerror', lambda e, s=screen: errors.append(f'{s}: {str(e)[:200]}'))
            page.goto(f'{a.base}/lab/dna?lang={a.lang}')
            page.wait_for_function(READY, timeout=60000)
            page.wait_for_timeout(1500)
            page.evaluate('() => __ew.world.clear()')
            page.wait_for_timeout(1500)
            # the tray's slots are there and the world draws into them
            slots = page.evaluate("() => [...document.querySelectorAll('[data-dna-slot]')].map(e => e.dataset.dnaSlot).join('')")
            check(f'{screen}: the tray has A, T, G and C', slots == 'ATGC', slots)
            # tap a slot itself (the HUD's button over the drawn molecule)
            page.locator('[data-dna-slot="A"]').click()
            page.wait_for_timeout(300)
            for letter in 'TGCGTA':
                page.evaluate(f"() => __ew.world.add('{letter}')")
                page.wait_for_timeout(120)
            page.wait_for_timeout(2500)
            s = page.evaluate('() => __ew.world.state()')
            check(f'{screen}: the strand reads ATGCGTA', s['seq'] == 'ATGCGTA', s['seq'])
            check(f'{screen}: two nucleotides a pair on show', s['views'] == 14, str(s['views']))
            check(f'{screen}: the helix stands up on an upright phone, lies across a computer', s['upright'] == (screen == 'phone'), str(s['upright']))
            hud = page.evaluate("() => document.querySelector('[data-dna-strands]')?.textContent || ''")
            check(f'{screen}: the card shows both strands', 'ATGCGTA' in hud and 'TACGCAT' in hud, hud[:40])
            page.screenshot(path=os.path.join(OUT, f'{screen}_built.png'))
            page.evaluate('() => __ew.world.undo()')
            page.wait_for_timeout(1300)
            s = page.evaluate('() => __ew.world.state()')
            check(f'{screen}: undo takes the last pair off', s['seq'] == 'ATGCGT' and s['views'] == 12, f"{s['seq']} {s['views']}")
            page.evaluate('() => __ew.world.setTwist(0)')
            page.wait_for_timeout(1500)
            page.screenshot(path=os.path.join(OUT, f'{screen}_ladder.png'))
            page.evaluate('() => __ew.world.setTwist(1)')
            page.evaluate('() => __ew.world.copy()')
            page.wait_for_timeout(1500)
            check(f'{screen}: a tap on copy starts it', page.evaluate('() => __ew.world.state().phase') == 'copying')
            page.wait_for_timeout(5500)
            s = page.evaluate('() => __ew.world.state()')
            check(f'{screen}: the copy ends with two helices (four strands)', s['phase'] == 'copied' and s['views'] == 24, f"{s['phase']} {s['views']}")
            page.screenshot(path=os.path.join(OUT, f'{screen}_copied.png'))
            found = page.evaluate("() => JSON.parse(localStorage.getItem('ew-found') || '[]').filter(k => k.startsWith('bench:dna:'))")
            check(f'{screen}: finds kept (a pair of each kind, the start signal, a copy)', all(f'bench:dna:{k}' in found for k in ['at', 'gc', 'atg', 'copy']), ','.join(found))
            page.evaluate('() => __ew.world.copy()')  # keep one
            page.wait_for_timeout(1200)
            s = page.evaluate('() => __ew.world.state()')
            check(f'{screen}: keep one goes back to one helix', s['phase'] == 'build' and s['views'] == 12, f"{s['phase']} {s['views']}")
            page.evaluate('() => __ew.world.clear()')
            page.wait_for_timeout(1600)
            check(f'{screen}: clear empties the bench', page.evaluate('() => __ew.world.state().views') == 0)
            ctx.close()
        b.close()
    for e in errors:
        print('console error:', e)
    print('all ok' if not problems and not errors else f'{len(problems)} problems, {len(errors)} console errors')
    sys.exit(1 if problems or errors else 0)


if __name__ == '__main__':
    main()
