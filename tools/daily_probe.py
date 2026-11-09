"""Today's element, played through in a browser (docs/knowledge/daily.md): the dock's flame, the start, every
step of the lesson answered (one wrong on purpose, so it comes back at the end), the end with the streak
at 1, tomorrow's mystery guessed, what the device kept (ew-daily), and after a reload the flame lit. Then
a player with a week behind them (a day kept by a freeze) and the passport's streak tile. Screenshots of
each step on a computer, an upright phone and a phone on its side go to tools/shots/daily/.

    py -3.11 tools/daily_probe.py                       (the dev server, port 5310)
    py -3.11 tools/daily_probe.py --port 5317           (a separate build: npx vite preview --outDir ... --port 5317)
    py -3.11 tools/daily_probe.py --only computer --lang pl --level scientist

The exit code is 1 when a check fails or the console had errors.
"""
import argparse
import datetime
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).with_name('shots') / 'daily'
SCREENS = {
    'computer': dict(viewport={'width': 1600, 'height': 900}, device_scale_factor=1),
    'phone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, has_touch=True, is_mobile=True),
    'side': dict(viewport={'width': 844, 'height': 390}, device_scale_factor=2, has_touch=True, is_mobile=True),
}
WORLD = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'

failures = []


def check(ok, what):
    print(('  ok   ' if ok else '  FAIL ') + what)
    if not ok:
        failures.append(what)


def today():
    return datetime.date.today().isoformat()


def history():
    """Six days done before today, the third one missed (a freeze keeps the streak)."""
    t = datetime.date.today()
    days = {}
    for back in (7, 6, 4, 3, 2, 1):
        d = (t - datetime.timedelta(days=back)).isoformat()
        days[d] = {'s': 'C', 'r': 6 if back % 2 else 5, 'n': 6, 'at': 1}
    boxes = {'Fe': {'b': 1, 'd': (t - datetime.timedelta(days=1)).isoformat(), 'at': 1}, 'O': {'b': 2, 'd': t.isoformat(), 'at': 1}}
    return {'days': days, 'boxes': boxes, 'guess': {}}


def play_lesson(page, shots, wrong_once=True):
    """Answers every step; the second one wrong first. Returns the kinds asked, in order."""
    kinds = []
    page.click('[data-daily-begin]')
    page.wait_for_selector('[data-daily-step]', timeout=20000)
    made_wrong = False
    for i in range(30):
        if page.query_selector('[data-daily-done]'):
            break
        step = page.wait_for_selector('[data-daily-step]', timeout=10000)
        kind = step.get_attribute('data-daily-step')
        answer = step.get_attribute('data-answer')
        kinds.append(kind)
        time.sleep(0.4)
        if i < 3 or kind not in kinds[:-1]:
            shots(f'step{i}-{kind}')
        if kind == 'find':
            if i == 0:
                # a wrong cell first: it shakes and says what it was
                wrong = '1' if answer != '1' else '2'
                page.click(f'[data-daily-table] [data-z="{wrong}"]')
                time.sleep(0.3)
                shots('step0-find-wrong')
            page.click(f'[data-daily-table] [data-z="{answer}"]')
        else:
            if wrong_once and not made_wrong and i == 1:
                other = [o.get_attribute('data-option') for o in page.query_selector_all('[data-option]') if o.get_attribute('data-option') != answer]
                page.click(f'[data-option="{other[0]}"]')
                made_wrong = True
            else:
                page.click(f'[data-option="{answer}"]')
        page.wait_for_selector('[data-daily-next]', timeout=5000)
        time.sleep(0.6)
        if i < 3 or kind not in kinds[:-1]:
            shots(f'step{i}-{kind}-answered')
        page.click('[data-daily-next]')
        time.sleep(0.5)
    page.wait_for_selector('[data-daily-done]', timeout=10000)
    return kinds


def run(p, base, screen, lang, level, errors):
    print(f'{screen}:')
    b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
    ctx = b.new_context(**SCREENS[screen])
    if level:
        ctx.add_init_script(f"try {{ localStorage.setItem('ew-level', '{level}') }} catch (e) {{}}")
    page = ctx.new_page()
    page.on('console', lambda m: m.type == 'error' and errors.append(f'{screen}: {m.text}'))
    page.on('pageerror', lambda e: errors.append(f'{screen}: {e}'))
    (OUT / screen).mkdir(parents=True, exist_ok=True)

    def shots(name):
        page.screenshot(path=str(OUT / screen / f'{name}.png'))

    page.goto(f'{base}/?lang={lang}')
    page.wait_for_function(WORLD, timeout=60000)
    time.sleep(2)
    dock = page.wait_for_selector('[data-daily-open]', timeout=10000)
    check('0' in dock.inner_text(), 'the dock shows the flame at 0 before the first lesson')
    shots('plaza')
    dock.click()
    page.wait_for_selector('[data-daily-begin]', timeout=10000)
    time.sleep(0.8)
    shots('start')
    kinds = play_lesson(page, shots)
    print('  asked:', ' '.join(kinds))
    check(kinds[0] == 'find', 'the lesson opens with finding the element in the table')
    check(len(kinds) >= 7, f'{len(kinds)} steps: six and the missed one again')
    check(kinds[-1] == kinds[1], 'the one answered wrong came back at the end')
    time.sleep(1.2)
    shots('done')
    streak = page.inner_text('[data-daily-done] [data-daily-streak]')
    check(streak.strip() == '1', f'the streak is 1 after the first lesson ({streak!r})')
    kept = page.evaluate("JSON.parse(localStorage.getItem('ew-daily') || 'null')")
    day = kept and kept.get('days', {}).get(today())
    check(bool(day) and day.get('n', 0) >= 6, f'the device kept today ({day})')
    check(bool(kept) and len(kept.get('boxes', {})) >= 2, 'the elements asked about went into their boxes')
    guess = page.query_selector('[data-guess]')
    check(guess is not None, "tomorrow's mystery offers four to guess from")
    if guess:
        guess.click()
        time.sleep(0.5)
        shots('mystery-guessed')
        kept = page.evaluate("JSON.parse(localStorage.getItem('ew-daily') || 'null')")
        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        check(tomorrow in kept.get('guess', {}), 'the guess is kept for tomorrow')
    page.reload()
    page.wait_for_function(WORLD, timeout=60000)
    time.sleep(1.5)
    dock = page.wait_for_selector('[data-daily-open]', timeout=10000)
    check('1' in dock.inner_text() and dock.query_selector('.ew-flame') is not None, 'after a reload the dock shows 1 and the flame is lit')
    shots('plaza-after')
    dock.click()
    page.wait_for_selector('[data-daily-practice]', timeout=10000)
    time.sleep(0.6)
    shots('reopened')
    check(page.query_selector('[data-daily-begin]') is None, 'done for today: no second lesson, practice instead')

    # a player with a week behind them: a day kept by a freeze, two elements waiting to be gone over
    ctx2 = b.new_context(**SCREENS[screen])
    ctx2.add_init_script(f"try {{ if (!sessionStorage.getItem('seeded')) {{ localStorage.setItem('ew-daily', {json.dumps(json.dumps(history()))}); sessionStorage.setItem('seeded', '1') }} {f'localStorage.setItem(`ew-level`, `{level}`);' if level else ''} }} catch (e) {{}}")
    page2 = ctx2.new_page()
    page2.on('pageerror', lambda e: errors.append(f'{screen} (week): {e}'))
    page2.goto(f'{base}/?lang={lang}')
    page2.wait_for_function(WORLD, timeout=60000)
    time.sleep(1.5)
    page2.click('[data-daily-open]')
    page2.wait_for_selector('[data-daily-begin]', timeout=10000)
    time.sleep(0.8)
    page2.screenshot(path=str(OUT / screen / 'week-start.png'))
    streak = page2.inner_text('[data-daily-streak]')
    check(streak.strip() == '6', f'six days done with one kept by a freeze: a streak of 6 ({streak!r})')
    states = page2.eval_on_selector_all('[data-daily-week] [data-state]', 'els => els.map(e => e.dataset.state)')
    check('frozen' in states or datetime.date.today().weekday() < 5, f'the week shows the frozen day ({states})')
    kinds = play_lesson(page2, lambda n: None, wrong_once=False)
    time.sleep(1)
    page2.screenshot(path=str(OUT / screen / 'week-done.png'))
    streak = page2.inner_text('[data-daily-done] [data-daily-streak]')
    check(streak.strip() == '7', f'the seventh day: a streak of 7 ({streak!r})')
    text = page2.inner_text('[data-daily-done]')
    check('❄️' in text, 'the seventh day earns a freeze')
    page2.goto(f'{base}/passport?lang={lang}')
    page2.wait_for_selector('[data-passport-streak]', timeout=30000)
    time.sleep(0.8)
    page2.screenshot(path=str(OUT / screen / 'passport.png'))
    check('7' in page2.inner_text('[data-passport-streak]'), "the passport's tile shows the streak")
    page2.click('[data-passport-streak]')
    page2.wait_for_function(WORLD, timeout=60000)
    page2.wait_for_selector('[data-daily]', timeout=10000)
    check(True, "the passport's tile opens today's element on the plaza")
    b.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default=None)
    ap.add_argument('--lang', default='en')
    ap.add_argument('--level', default=None)
    ap.add_argument('--only', default=None, help='computer, phone or side')
    a = ap.parse_args()
    base = (a.base or f'http://localhost:{a.port}').rstrip('/')
    errors = []
    with sync_playwright() as p:
        for screen in [a.only] if a.only else SCREENS:
            try:
                run(p, base, screen, a.lang, a.level, errors)
            except Exception as e:  # a step that never came: say which, go on with the next screen
                check(False, f'{screen}: {str(e).splitlines()[0]}')
    for e in errors:
        print('console error:', e[:300])
    print(f'{len(failures)} failed' if failures else 'all checks passed')
    sys.exit(1 if failures or errors else 0)


if __name__ == '__main__':
    main()
