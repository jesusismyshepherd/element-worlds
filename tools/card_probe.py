"""The plaza's element card tells the Atomling's facts ("Tell me something") and goes through them
(the user, 2026-10-28): selects every element in Explorer, in all four languages, on a computer and on a
phone (where the card opens with a tap on the name), and checks that a fact shows, that the arrow, a
click on the text and T each move to the next one (the counter with it), that the arrows stay where they
are from fact to fact, and that no fact has words gone wrong. Screenshots of a few cards in
tools/shots/card/. Console errors fail the run. Start the dev server first (port 5310).

    python tools/card_probe.py              all 118
    python tools/card_probe.py Es C O       some
    python tools/card_probe.py --base https://element-worlds.vercel.app
"""
import argparse
import json
import os
import re
import sys
import time

from pathlib import Path

from playwright.sync_api import sync_playwright

DATA = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'elements.json'
SHOTS = os.path.join(os.path.dirname(__file__), 'shots', 'card')
READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
BAD = re.compile(r'undefined|NaN|\bnull\b|\[object|\{\{|\}\}')
BAD_DE = re.compile(r'undefined|NaN|\[object|\{\{|\}\}')
SCREENS = {'computer': (1280, 720, False), 'phone': (412, 780, True)}
LANGS = ['en', 'pt-pt', 'pl', 'de']
SHOOT = {'Es', 'C', 'O'}

# the card's facts block as the page shows it: the fact on show, the counter, where the next arrow is
STATE = """() => {
  const box = document.querySelector('[data-facts]')
  if (!box) return null
  const shown = [...box.querySelectorAll('[data-fact=text] > span')].filter(s => getComputedStyle(s).visibility !== 'hidden')
  const next = box.querySelector('[data-fact=next]')
  const r = next ? next.getBoundingClientRect() : null
  return {
    text: shown.map(s => s.textContent).join(' | '),
    shown: shown.length,
    count: box.querySelector('[data-fact=count]')?.textContent ?? '',
    next: r ? [Math.round(r.x), Math.round(r.y)] : null,
  }
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('symbols', nargs='*')
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    os.makedirs(SHOTS, exist_ok=True)
    els = json.loads(DATA.read_text(encoding='utf-8'))
    pick = [e for e in els if not a.symbols or e['symbol'] in a.symbols]

    problems, errors = [], []
    checked = 0
    t0 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        for screen, (w, h, touch) in SCREENS.items():
            for lang in LANGS:
                ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=touch)
                page = ctx.new_page()
                where = {'at': f'{screen} {lang}'}
                page.on('console', lambda m: m.type == 'error' and errors.append(f"{where['at']}: {m.text[:300]}"))
                page.on('pageerror', lambda e: errors.append(f"{where['at']}: {str(e)[:300]}"))
                page.goto(f'{a.base}/?lang={lang}')
                page.wait_for_function(READY, timeout=60000)
                page.evaluate("() => window.__ew.store.set({ level: 'explorer' })")
                bad = BAD_DE if lang == 'de' else BAD
                for e in pick:
                    sym = e['symbol']
                    where['at'] = f'{screen} {lang} {sym}'
                    page.evaluate(f"() => window.__ew.world.select({e['z']})")
                    if touch:
                        # the phone's card is one strip; its name opens the rest
                        page.wait_for_selector('[data-card] button[aria-expanded]', timeout=5000)
                        if page.get_attribute('[data-card] button[aria-expanded]', 'aria-expanded') != 'true':
                            page.click('[data-card] button[aria-expanded]')
                    try:
                        page.wait_for_selector('[data-facts]', timeout=8000)
                    except Exception:
                        problems.append(f'{where["at"]}: no facts on the card')
                        continue
                    s0 = page.evaluate(STATE)
                    n = int(s0['count'].split('/')[-1]) if '/' in s0['count'] else 1
                    seen = [s0]
                    if s0['shown'] != 1 or not s0['text'].strip():
                        problems.append(f'{where["at"]}: {s0["shown"]} facts on show')
                    if n < 3:
                        problems.append(f'{where["at"]}: only {n} facts')
                    if n > 1:
                        # the arrow, a click on the text and T (not on a phone: no keys)
                        moves = [('arrow', lambda: page.click('[data-facts] [data-fact=next]')),
                                 ('text', lambda: page.click('[data-facts] [data-fact=text]'))]
                        if not touch:
                            moves.append(('T', lambda: page.keyboard.press('t')))
                        for how, move in moves:
                            before = seen[-1]
                            move()
                            page.wait_for_timeout(30)
                            s = page.evaluate(STATE)
                            want = int(before['count'].split('/')[0]) % n + 1
                            if int(s['count'].split('/')[0]) != want or s['text'] == before['text']:
                                problems.append(f'{where["at"]}: {how} did not go on ({before["count"]} to {s["count"]})')
                            if s['next'] != before['next']:
                                problems.append(f'{where["at"]}: the next arrow moved {before["next"]} to {s["next"]} ({how})')
                            seen.append(s)
                        page.click('[data-facts] [data-fact=prev]')
                        page.wait_for_timeout(30)
                        s = page.evaluate(STATE)
                        if s['text'] != seen[-2]['text']:
                            problems.append(f'{where["at"]}: the back arrow did not go back')
                    for s in seen:
                        m = bad.search(s['text'])
                        if m:
                            problems.append(f'{where["at"]}: ...{s["text"][max(0, m.start() - 60):m.start() + 30]}...')
                    if sym in SHOOT:
                        page.screenshot(path=os.path.join(SHOTS, f'{screen}_{lang}_{sym}.png'))
                    checked += 1
                print(f'{screen} {lang}: {len(pick)} cards ({time.time() - t0:.0f} s)', flush=True)
                ctx.close()
        b.close()
    print(f'{checked} cards checked in {time.time() - t0:.0f} s')
    for x in problems:
        print('PROBLEM', x)
    for x in errors:
        print('console error:', x)
    sys.exit(1 if problems or errors else 0)


if __name__ == '__main__':
    main()
