"""Every element's hall, every panel in it, all four languages and both depths: opens all 118 halls one after
the other (in one page, as a player walking from cube to cube), uses every station and the specimen case,
talks to the Atomling, and checks what each says for words that went wrong ("undefined", "NaN", "null",
an unfilled {{template}}, "[object"). Console errors fail the run. Start the dev server first (port 5310).

    python tools/halls_probe.py            all 118
    python tools/halls_probe.py Fe U Og    some
"""
import argparse
import json
import re
import sys
import time

from pathlib import Path

from playwright.sync_api import sync_playwright

DATA = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'elements.json'

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
BAD = re.compile(r'undefined|NaN|\bnull\b|\[object|\{\{|\}\}')
# German "null" is zero ("nahezu null Wärmeausdehnung")
BAD_DE = re.compile(r'undefined|NaN|\[object|\{\{|\}\}')

# what the page does for one hall: every interactable used, at both depths and in every language,
# each panel's text gathered; the Atomling's greeting and facts too
COLLECT = """async () => {
  const ew = window.__ew
  const out = []
  const text = p => !p ? '' : [p.title, p.kicker, ...(p.blocks || []).map(b => [b.p, b.big, b.small, ...(b.rows || []).flat(), ...(b.list || []), b.link && b.link.label].filter(x => x != null).join(' | '))].join(' || ')
  for (const lang of ['pt-pt', 'en', 'pl', 'de']) {
    await ew.i18n.changeLanguage(lang)
    for (const level of ['explorer', 'scientist']) {
      ew.store.set({ level })
      for (const it of ew.world.interactables || []) {
        ew.store.set({ panel: null, speech: null })
        try { it.onUse && it.onUse() } catch (e) { out.push({ lang, level, id: it.id, error: String(e) }) ; continue }
        const s = ew.store.get()
        out.push({ lang, level, id: it.id, text: text(s.panel) + ' ## ' + ((s.speech && s.speech.text) || '') + ' ## ' + (it.label || '') })
      }
      for (let i = 0; i < 3; i++) {
        try { ew.world.talk && ew.world.talk() } catch (e) { out.push({ lang, level, id: 'talk', error: String(e) }) }
        const s = ew.store.get()
        out.push({ lang, level, id: 'talk', text: (s.speech && s.speech.text) || '' })
      }
    }
  }
  ew.store.set({ panel: null, speech: null })
  return out
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('symbols', nargs='*')
    ap.add_argument('--port', type=int, default=5310)
    a = ap.parse_args()

    errors = []
    problems = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        page = b.new_page(viewport={'width': 1280, 'height': 720})
        where = {'at': 'plaza'}
        page.on('console', lambda m: m.type == 'error' and errors.append(f"{where['at']}: {m.text[:300]}"))
        page.on('pageerror', lambda e: errors.append(f"{where['at']}: {str(e)[:300]}"))
        page.goto(f'http://localhost:{a.port}/?lang=pt-pt')
        page.wait_for_function(READY, timeout=60000)
        symbols = a.symbols or [e['symbol'] for e in json.loads(DATA.read_text(encoding='utf-8'))]
        t0 = time.time()
        panels = 0
        for s in symbols:
            where['at'] = str(s)
            page.evaluate(f"() => window.__ew.go('/e/{s}')")
            sym = None
            for _ in range(300):
                w = page.evaluate("() => { const s = window.__ew.store.get(); return !s.fading && s.world && s.world.kind === 'atrium' ? s.world.symbol : null }")
                if w == s:
                    sym = w
                    break
                time.sleep(0.1)
            if not sym:
                problems.append(f'{s}: the hall did not arrive')
                continue
            where['at'] = sym
            time.sleep(0.3)
            for r in page.evaluate(COLLECT):
                panels += 1
                if 'error' in r:
                    problems.append(f"{sym} {r['lang']} {r['level']} {r['id']}: {r['error']}")
                elif (BAD_DE if r['lang'] == 'de' else BAD).search(r['text']):
                    m = (BAD_DE if r['lang'] == 'de' else BAD).search(r['text'])
                    i = m.start()
                    problems.append(f"{sym} {r['lang']} {r['level']} {r['id']}: ...{r['text'][max(0, i - 80):i + 40]}...")
            print(f'{sym} ok ({time.time() - t0:.0f} s)', flush=True)
        b.close()
    print(f'{len(symbols)} halls, {panels} panels and lines read in {time.time() - t0:.0f} s')
    for x in problems:
        print('PROBLEM', x)
    for e in errors:
        print('console error:', e)
    sys.exit(1 if problems or errors else 0)


if __name__ == '__main__':
    main()
