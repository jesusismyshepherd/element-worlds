"""The treasure hunts, played through in a browser (docs/knowledge/hunts.md): the dock's button and the sheet,
a track started, each clue reached the way a player reaches it (the hall entered by its address, the
walker put in front of the exhibit and E pressed: a picture is stepped into and its room opens, a board or a
case opens its panel, so the store's `panelFrom` is the exhibit's own; a wing walked into), the card moving
on with what the place shows, the hints (the family and row, then the element), the page reloaded in the
middle (the hunt goes on at its clue, kept on the device), the hunt left and taken up again from the sheet,
the end (the time, the badge) and the passport's badge. Screenshots of each step go to tools/shots/hunts/.

    py -3.11 tools/hunt_probe.py --port 5329                 every track on a computer (English), "At home" on
                                                              an upright phone (Polish), "Records" begun on a
                                                              phone on its side (German)
    py -3.11 tools/hunt_probe.py --only computer --track records --lang pt-pt
    py -3.11 tools/hunt_probe.py --level scientist

Run browser probes through the machine's lock when other sessions are busy:
    python "D:/Family/Artur/pokemon images/blender/arena/tools/heavy.py" hunts -- py -3.11 tools/hunt_probe.py --port 5329

The exit code is 1 when a check fails or the console had errors.
"""
import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).with_name('shots') / 'hunts'
ELEMENTS = json.loads((Path(__file__).resolve().parent.parent / 'src' / 'data' / 'elements.json').read_text(encoding='utf-8'))
SCREENS = {
    'computer': dict(viewport={'width': 1440, 'height': 900}, device_scale_factor=1),
    'phone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, has_touch=True, is_mobile=True),
    'side': dict(viewport={'width': 844, 'height': 390}, device_scale_factor=2, has_touch=True, is_mobile=True),
}
# what each screen plays: (language, tracks, how many clues of the last one: None for all)
PLAN = {
    'computer': ('en', ['discoverers', 'home', 'records'], None),
    'phone': ('pl', ['home'], None),
    'side': ('de', ['records'], 3),
}
READY = '() => window.__ew && window.__ew.world && !window.__ew.store.get().fading && !!window.__ewHunts'
KEY = "(() => { const s = window.__ew.store.get(); return s.world && !s.fading ? [s.world.kind, s.world.symbol, s.world.wing].filter(Boolean).join(':') : null })()"

failures = []


def check(ok, what):
    print(('  ok   ' if ok else '  FAIL ') + what, flush=True)
    if not ok:
        failures.append(what)
    return ok


def path_of(w):
    """The address of a world key: atrium:Fe -> /e/Fe, wing:C:allotropes -> /e/C/allotropes, lab -> /lab."""
    parts = w.split(':')
    if parts[0] == 'atrium':
        return f'/e/{parts[1]}'
    if parts[0] == 'wing':
        return f'/e/{parts[1]}/{parts[2]}'
    return '/' if w == 'plaza' else f'/{w}'


def wait_world(page, key, timeout=90):
    t0 = time.time()
    while time.time() - t0 < timeout:
        if page.evaluate(f'() => {KEY}') == key:
            return True
        time.sleep(0.15)
    return False


def go(page, w):
    page.evaluate(f"() => window.__ew.go('{path_of(w)}')")
    return wait_world(page, w)


def step_of(page, track):
    return page.evaluate(f"() => window.__ewHunts.state.tracks['{track}']?.step ?? null")


def use_exhibit(page, panel):
    """Stand in front of an exhibit facing it, wait for its prompt, press E (the engine's use)."""
    found = page.evaluate(
        """(id) => {
          const it = (__ew.world.interactables || []).find(x => x.id === id)
          if (!it) return false
          const f = it.focus || { x: 0, z: 0 }
          __ew.teleport(it.x, it.z, Math.atan2(-(f.x - it.x), -(f.z - it.z)))
          return true
        }""",
        panel,
    )
    if not found:
        return False
    for _ in range(60):
        if page.evaluate(f"() => window.__ew.store.get().prompt?.id === '{panel}'"):
            break
        time.sleep(0.05)
    page.evaluate('() => window.__ew.use()')
    return True


def unfold(page, sel):
    """The card, or its chip (an upright phone's hall: the Atomling's greeting took the top) tapped open."""
    page.wait_for_selector(f'{sel}, [data-hunt-chip]', timeout=10000)
    time.sleep(1.2)  # (a hall's greeting comes 0.9 s after it opens)
    if not page.query_selector(sel):
        page.click('[data-hunt-chip]')
    page.wait_for_selector(sel, timeout=5000)


def reach(page, clue):
    """Go where a clue leads, as a player does. Returns the world key the clue is found in."""
    if not go(page, clue['w']):
        return None
    panel = clue.get('panel')
    if not panel:
        return clue['w']
    if not use_exhibit(page, panel):
        return None
    if panel.startswith('board:'):
        # stepping into the picture: the view dives, then the picture's room opens
        sym = clue['w'].split(':')[1]
        t0 = time.time()
        while time.time() - t0 < 90:
            k = page.evaluate(f'() => {KEY}')
            if k and k.startswith(f'wing:{sym}:'):
                return k
            time.sleep(0.15)
        return None
    for _ in range(40):
        if page.evaluate('() => !!window.__ew.store.get().panel'):
            return clue['w']
        time.sleep(0.05)
    return None


def hints(page, shots, level, clue):
    """The hint button, at once for the probe: the family and row, then (Explorer) the element."""
    page.evaluate('() => window.__ewHunts.hintsNow()')
    page.wait_for_selector('[data-hunt-card] [data-hunt-hint]:not([disabled])', timeout=5000)
    page.click('[data-hunt-card] [data-hunt-hint]')
    first = page.inner_text('[data-hunt-card] [data-hunt-hint-text="1"]')
    sym = clue['w'].split(':')[1]
    names = list(next(e for e in ELEMENTS if e['symbol'] == sym)['name'].values())
    check(not any(n.lower() in first.lower() for n in names), f'the first hint names no element ({first.strip()[:80]})')
    shots('hint-1')
    if level == 'scientist':
        check(page.query_selector('[data-hunt-card] [data-hunt-hint]') is None, 'the Scientist gets one hint')
        return
    page.click('[data-hunt-card] [data-hunt-hint]')
    second = page.inner_text('[data-hunt-card] [data-hunt-hint-text="2"]')
    check(any(n.lower() in second.lower() for n in names), f'the second hint names the element ({second.strip()[:90]})')
    shots('hint-2')


def play_track(page, track, shots, level, limit=None, reload_at=None, leave_at=None):
    tracks = {t['id']: t for t in page.evaluate('() => window.__ewHunts.tracks')}
    clues = tracks[track]['clues']
    last = len(clues) if limit is None else limit
    # from the plaza's sheet
    if not go(page, 'plaza'):
        check(False, 'back on the plaza')
        return
    time.sleep(0.6)
    page.click('[data-hunts-open]')
    page.wait_for_selector('[data-hunts] [data-hunt-track]', timeout=10000)
    time.sleep(0.6)
    check(len(page.query_selector_all('[data-hunts] [data-hunt-track]')) >= 3, 'the sheet lists the tracks')
    shots(f'{track}-sheet')
    page.click(f'[data-hunt-start="{track}"]')
    page.wait_for_selector(f'[data-hunt-card="{track}"] [data-hunt-riddle]', timeout=10000)
    time.sleep(0.5)
    check(page.evaluate(f"() => window.__ewHunts.state.on === '{track}'") and step_of(page, track) == 0, f'{track}: started at its first clue, the card shows it')
    check(page.query_selector('[data-hunts]') is None, 'the sheet closed to let the player go')
    shots(f'{track}-start')
    for i, clue in enumerate(clues[:last]):
        if i == 1:
            hints(page, shots, level, clue)
        where = reach(page, clue)
        if not check(where is not None, f'{track} {i + 1}: reached {clue["w"]}{" > " + clue["panel"] if clue.get("panel") else ""}'):
            return
        done = i == len(clues) - 1
        sel = '[data-hunt-done]' if done else f'[data-hunt-found="{track}.{clue["id"]}"]'
        t0 = time.time()
        while time.time() - t0 < 8 and step_of(page, track) != i + 1:
            time.sleep(0.1)
        if not check(step_of(page, track) == i + 1, f'{track} {i + 1}: the hunt moved on ({where})'):
            shots(f'{track}-{i + 1}-missing')
            return
        time.sleep(0.5)
        if not page.query_selector(sel) and page.evaluate('() => !!window.__ew.store.get().panel'):
            # an upright phone: the exhibit's panel holds the top, the chip says a clue was found, the card waits
            check(page.query_selector('[data-hunt-chip]') is not None, f'{track} {i + 1}: a panel over the top, the chip says it was found')
            shots(f'{track}-{i + 1}-chip')
            page.evaluate('() => window.__ew.store.set({ panel: null })')
        try:
            page.wait_for_selector(sel, timeout=8000)
            time.sleep(0.9)
        except Exception:  # noqa: BLE001 (say what the page had)
            check(False, f'{track} {i + 1}: the card shows what was found ({where})')
            shots(f'{track}-{i + 1}-missing')
            return
        if i < 2 or done:
            shots(f'{track}-{i + 1}-found')
        if done:
            break
        # the same place again does nothing (only the next clue counts)
        page.evaluate("() => window.__ew.store.set({ panel: null })")
        time.sleep(0.4)
        check(step_of(page, track) == i + 1, f'{track} {i + 1}: nothing more here')
        page.click('[data-hunt-card] [data-hunt-next]')
        page.wait_for_selector(f'[data-hunt-clue="{track}.{clues[i + 1]["id"]}"]', timeout=5000)
        if i == 0:
            shots(f'{track}-next')
        if reload_at is not None and i + 1 == reload_at:
            kept = page.evaluate("() => JSON.parse(localStorage.getItem('ew-world:/hunts') || 'null')")
            check(bool(kept) and kept['parts']['tracks'][track]['step'] == i + 1, f'the device keeps the hunt at clue {i + 2} ({kept and kept["parts"]["tracks"][track]})')
            page.reload()
            page.wait_for_function(READY, timeout=90000)
            time.sleep(1.2)
            check(page.evaluate(f"() => window.__ewHunts.state.on === '{track}'") and step_of(page, track) == i + 1, 'after a reload the hunt goes on at its clue')
            unfold(page, f'[data-hunt-card="{track}"][data-hunt-step="{i + 1}"]')
            shots(f'{track}-reloaded')
        if leave_at is not None and i + 1 == leave_at:
            page.click('[data-hunt-card] [data-hunt-stop]')
            time.sleep(0.4)
            check(page.evaluate('() => window.__ewHunts.state.on') is None and page.query_selector('[data-hunt-card]') is None, 'the hunt left: the card is gone')
            go(page, 'plaza')
            time.sleep(0.6)
            page.click('[data-hunts-open]')
            page.wait_for_selector(f'[data-hunt-start="{track}"]', timeout=10000)
            time.sleep(0.4)
            shots(f'{track}-left')
            page.click(f'[data-hunt-start="{track}"]')
            page.wait_for_selector(f'[data-hunt-card="{track}"][data-hunt-step="{i + 1}"]', timeout=10000)
            check(True, 'taken up again from the sheet, at the same clue')
    if limit is not None:
        return
    time.sleep(0.8)
    shots(f'{track}-done')
    st = page.evaluate(f"() => window.__ewHunts.state.tracks['{track}']")
    check(st['done'] == 1 and st['step'] == len(clues) and page.evaluate('() => window.__ewHunts.state.on') is None, f'{track}: finished once, the hunt over ({st})')
    check(page.query_selector('[data-hunt-done] [data-hunt-time]') is not None, 'the end tells the time it took')
    check(page.query_selector('[data-hunt-done] [data-hunt-badge]') is not None, 'and the new badge')
    page.click('[data-hunt-done] [data-hunt-close]')
    time.sleep(0.4)
    check(page.query_selector('[data-hunt-card]') is None, 'closed, the card is gone')


def run(p, base, screen, level, only_track, errors):
    lang, tracks, limit = PLAN[screen]
    lang = ARGS.lang or lang
    if only_track:
        tracks, limit = [only_track], None
    print(f'{screen} ({lang}):', flush=True)
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
    page.wait_for_function(READY, timeout=90000)
    time.sleep(1.5)
    check(page.query_selector('[data-hunts-open]') is not None, 'the dock has the hunts')
    shots('plaza')
    for n, track in enumerate(tracks):
        last = n == len(tracks) - 1
        play_track(page, track, shots, level, limit=limit if last else None, reload_at=3 if n == 0 else None, leave_at=4 if n == 0 else None)
    if screen != 'computer' or only_track:
        # a hunt on: the chip in the lab's bar (the lab's own panels fill its edges)
        if page.evaluate('() => window.__ewHunts.state.on') and go(page, 'lab'):
            time.sleep(1)
            check(page.query_selector('[data-hunt-chip]') is not None and page.query_selector('[data-hunt-card]') is None, 'in the lab the clue waits folded in the bar')
            shots('lab-chip')
            page.click('[data-hunt-chip]')
            time.sleep(0.5)
            check(page.query_selector('[data-hunt-card]') is not None, 'a tap unfolds it')
            shots('lab-card')
        b.close()
        return
    # the passport: the badges of the tracks finished
    page.goto(f'{base}/passport?lang={lang}')
    page.wait_for_selector('[data-badge="hunt-discoverers"]', timeout=30000)
    time.sleep(0.6)
    shots('passport')
    for track in tracks:
        check(page.query_selector(f'[data-badge="hunt-{track}"][data-got="1"]') is not None, f'the passport shows the badge of {track}')
    kept = page.evaluate("() => JSON.parse(localStorage.getItem('ew-world:/hunts') || 'null')")
    check(bool(kept) and all(kept['parts']['tracks'][t]['done'] == 1 for t in tracks), 'the device keeps every track finished (ew-world:/hunts)')
    print('  kept:', json.dumps(kept['parts'])[:300] if kept else None)
    b.close()


ARGS = None


def main():
    global ARGS
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    ap.add_argument('--base', default=None)
    ap.add_argument('--lang', default=None)
    ap.add_argument('--level', default=None)
    ap.add_argument('--only', default=None, help='computer, phone or side')
    ap.add_argument('--track', default=None, help='discoverers, home or records')
    ARGS = ap.parse_args()
    base = (ARGS.base or f'http://localhost:{ARGS.port}').rstrip('/')
    errors = []
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        for screen in [ARGS.only] if ARGS.only else SCREENS:
            try:
                run(p, base, screen, ARGS.level, ARGS.track, errors)
            except Exception as e:  # a step that never came: say which, go on with the next screen
                check(False, f'{screen}: {str(e).splitlines()[0]}')
    for e in errors:
        print('console error:', e[:300])
    print(f'{len(failures)} failed' if failures else 'all checks passed')
    sys.exit(1 if failures or errors else 0)


if __name__ == '__main__':
    main()
