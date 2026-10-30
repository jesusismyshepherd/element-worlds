"""Shared world objects (src/net/shared.js, docs/knowledge/multiplayer.md "Shared world objects"): three
people in one room, Ana and Cid on computers, Bob on a phone, in neon's sign workshop (/e/Ne/signs).
Ana lets the balloons go, fills a tube, lights her name; Bob turns the spectroscope and fires the atom:
each change plays on the other's screen (the balloons rise there, the tube is filled there), while the
panels and the Atomling's words stay with the one who did it. Cid comes in late and finds the workshop
as it stands (the balloons up under the ceiling, the word on the wall), without anything replayed.
Ana ties the balloons back: they come back for all. Helium's workshop, another world, keeps its own.
Screenshots in tools/shots/shared/.

With --world <path>, any world: Ana uses every exhibit in turn (the Atomling and the --skip ones aside),
and after each one Bob's shared states must match hers (numbers within 2, for times like the balloons'
flight); then Cid walks in late and must find them all as Ana has them. Exhibits whose use changed nothing
shared are listed (a panel only, or one still to wire). More things for Ana to do in a world (a button in a
panel), each followed by the same comparison: tools/shared_steps/<area>.json, {"<path>": ["<js>", ...]},
all read (or one file with --steps).

    py -3.11 tools/shared_probe.py [--base http://localhost:5317]
    py -3.11 tools/shared_probe.py --world /e/C/allotropes [--skip a,b] [--base ...]
"""
import argparse
import json
import pathlib
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && window.__ew.world.shared && !window.__ew.store.get().fading'
OUT = pathlib.Path(__file__).parent / 'shots' / 'shared'
WORKSHOP = '/e/Ne/signs'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    ap.add_argument('--world', help='check any world: every exhibit used, the states compared')
    ap.add_argument('--skip', default='', help='exhibit ids not to use (comma separated)')
    ap.add_argument('--steps', help='a JSON file: {path: [js, ...]}, more things for Ana to do (default: tools/shared_steps/*.json)')
    a = ap.parse_args()
    if a.world:
        return generic(a)
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:72} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def wait(page, js, timeout=15000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

    use = lambda page, it: page.evaluate(f"() => __ew.world.interactables.find(i => i.id === '{it}').onUse()")
    state = lambda page, part: page.evaluate(f"() => __ew.world.shared['{part}'].get()")

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        people = {}
        for name, phone in (('Ana', False), ('Bob', True), ('Cid', False)):
            ctx = b.new_context(**({'viewport': {'width': 412, 'height': 800}, 'is_mobile': True, 'has_touch': True} if phone else {'viewport': {'width': 1280, 'height': 720}}))
            page = ctx.new_page()
            page.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
            page.on('console', lambda m, n=name: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
            people[name] = page
        ana, bob, cid = people['Ana'], people['Bob'], people['Cid']

        # Ana starts a room in the workshop; Bob joins it there; Cid joins in helium's
        ana.goto(f'{a.base}{WORKSHOP}?lang=en')
        ana.wait_for_function(READY, timeout=90000)
        ana.click('[data-room-button]')
        ana.fill('[data-room-name]', 'Ana')
        ana.click('[data-room-start]')
        check('Ana starts a room', wait(ana, "() => __ewRoom.status === 'on'"))
        code = ana.evaluate('() => __ewRoom.code')
        ana.click('[data-room-button]')
        for pg, n, path in ((bob, 'Bob', WORKSHOP), (cid, 'Cid', '/e/He/signs')):
            pg.goto(f'{a.base}{path}?lang=en')
            pg.wait_for_function(READY, timeout=90000)
            pg.click('[data-room-button]')
            pg.fill('[data-room-name]', n)
            pg.fill('[data-room-code]', code)
            pg.click('[data-room-join]')
        for n, pg in people.items():
            check(f'{n} sees all three in the room', wait(pg, '() => __ewRoom.members.length === 3', 20000))
        for pg in (bob, cid):
            if pg.query_selector('[data-room-sheet]'):
                pg.click('[data-room-button]')
        check("Bob's workshop keeps step with Ana's", wait(bob, '() => __ewShared.started && !__ewShared.pending', 8000))

        # the balloons: Ana lets them go, they rise on Bob's screen; the words are Ana's only
        bob.evaluate('() => __ew.store.set({ speech: null, panel: null })')
        bob.evaluate('() => __ew.teleport(0, 1.2, 0, 0.35)')
        use(ana, 'balloons')
        check("Ana's balloons fly", state(ana, 'balloons')['free'] is True)
        check("Bob's balloons are let go too", wait(bob, "() => __ew.world.shared.balloons.get().free"))
        time.sleep(2.5)
        ys = bob.evaluate("() => __ew.world.parts.balloons.heights")
        check("on Bob's screen the helium balloon rose, the xenon one fell", ys[0] > 1.9 and ys[-1] < 1.0, json.dumps([round(y, 2) for y in ys]))
        bob.screenshot(path=str(OUT / 'bob_balloons.png'))
        speech = bob.evaluate('() => __ew.store.get().speech')
        check("Bob gets no words or panel from Ana's balloons", not speech and not bob.evaluate('() => __ew.store.get().panel'), str(speech)[:80])
        check("Bob's prompt would now tie them back", bob.evaluate("() => __ew.world.interactables.find(i => i.id === 'balloons').verb") == ana.evaluate("() => __ew.world.interactables.find(i => i.id === 'balloons').verb"))

        # the bench: Ana fills the next tube; Bob's bench fills the same tube, its animation playing
        use(ana, 'bench')
        check("Bob's bench is filling too", wait(bob, '() => __ew.world.parts.bench.busy', 5000))
        check("Bob's bench lights the same tube", wait(bob, f"() => !__ew.world.parts.bench.busy && JSON.stringify(__ew.world.shared.bench.get()) === '{json.dumps(state(ana, 'bench'), separators=(',', ':'))}'", 8000), json.dumps(state(bob, 'bench')))

        # the name: Ana lights ARTUR in argon; Bob's wall lights it letter by letter
        use(ana, 'name')
        ana.wait_for_selector('.glass input', timeout=5000)
        ana.fill('.glass input', 'Artur')
        ana.keyboard.press('Enter')
        check("Bob's wall says ARTUR", wait(bob, "() => __ew.world.shared.name.get().text === 'ARTUR'"))
        check("Bob's wall lights it letter by letter", wait(bob, '() => __ew.world.parts.wall.lighting', 3000) or bob.evaluate("() => __ew.world.parts.wall.sign.count") > 0)
        check("Ana's word is not saved into Bob's own", bob.evaluate("() => localStorage.getItem('ew-neon-name:Ne')") is None)

        # Bob turns the spectroscope and fires the atom: Ana's follow
        use(bob, 'spectrum')
        g = state(bob, 'spectrum')['gas']
        check("Ana's spectroscope shows Bob's gas", wait(ana, f"() => __ew.world.shared.spectrum.get().gas === '{g}'"), g)
        use(bob, 'atom')
        check("Ana's atom fires too", wait(ana, '() => __ew.world.parts.atom.busy', 4000))
        use(bob, 'radon')
        check("Ana's Geiger counter clicks too", wait(ana, '() => __ew.world.parts.radon.busy', 4000))
        use(ana, 'history')
        check("Bob's history board lights its first sign", wait(bob, '() => __ew.world.shared.history.get().lit === 1'))

        # helium's workshop is another world: Cid's there kept their own
        check("Cid's helium workshop kept its balloons", state(cid, 'balloons')['free'] is False)

        # Cid walks into neon's workshop late: everything as it stands, nothing replayed
        time.sleep(3)
        cid.evaluate(f"() => __ew.go('{WORKSHOP}')")
        cid.wait_for_function(f"() => location.pathname === '{WORKSHOP}' && {READY.replace('window.', '')}", timeout=30000)
        check("Cid's workshop takes the room's", wait(cid, '() => __ewShared.started && !__ewShared.pending', 8000))
        time.sleep(0.5)
        for part in ('bench', 'name', 'history', 'spectrum'):
            check(f'Cid finds the {part} as Ana has it', state(cid, part) == state(ana, part), f'{json.dumps(state(cid, part))} vs {json.dumps(state(ana, part))}')
        bal = state(cid, 'balloons')
        check("Cid finds the balloons let go, flown for seconds", bal['free'] and bal['age'] > 3, json.dumps(bal))
        ys = cid.evaluate("() => __ew.world.parts.balloons.heights")
        check('at once up under the ceiling (helium) and on the floor (xenon)', ys[0] > 4.5 and ys[-1] < 0.4, json.dumps([round(y, 2) for y in ys]))
        check('nothing replayed for Cid (the bench idle, the wall lit)', not cid.evaluate('() => __ew.world.parts.bench.busy') and not cid.evaluate('() => __ew.world.parts.wall.lighting'))
        cid.evaluate('() => __ew.teleport(0, 2.5, 0, 0.45)')
        time.sleep(1)
        cid.screenshot(path=str(OUT / 'cid_late.png'))

        # Ana ties them back: they come back for everyone
        use(ana, 'balloons')
        for n, pg in (('Bob', bob), ('Cid', cid)):
            check(f"{n}'s balloons come back to the table", wait(pg, '() => !__ew.world.shared.balloons.get().free'))

        if fails:
            for n, pg in people.items():
                print(n, 'trail', json.dumps(pg.evaluate('() => __ewRoom.trail.slice(-14)')))
        b.close()

    for e in errors:
        print('console:', e)
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails else 0)


# every shared state of the world on show, and a comparison that lets times differ a little
ALL = '() => Object.fromEntries(Object.entries(__ew.world.shared || {}).map(([k, p]) => [k, p.get()]))'
SAME = """(a, b) => {
  const same = (x, y) => typeof x === 'number' && typeof y === 'number' ? Math.abs(x - y) <= 2
    : Array.isArray(x) ? Array.isArray(y) && x.length === y.length && x.every((v, i) => same(v, y[i]))
    : x && typeof x === 'object' ? !!y && typeof y === 'object' && Object.keys({ ...x, ...y }).every(k => same(x[k], y[k]))
    : x === y
  return same(a, b)
}"""


def generic(a):
    path = a.world
    skip = {s for s in a.skip.split(',') if s} | {'host'}
    files = [pathlib.Path(a.steps)] if a.steps else sorted((pathlib.Path(__file__).parent / 'shared_steps').glob('*.json'))
    steps = [s for f in files for s in json.loads(f.read_text(encoding='utf-8')).get(path, [])]
    fails, errors, quiet = [], [], []

    def check(what, ok, detail=''):
        print(f'{what:72} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def in_step(page, timeout=8000):
        want = json.dumps(ana.evaluate(ALL))
        try:
            page.wait_for_function(f'() => ({SAME})(({ALL})(), {want})', timeout=timeout)
            return True, ''
        except Exception:
            return False, f'{json.dumps(page.evaluate(ALL))[:200]} vs {want[:200]}'

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        people = {}
        for name in ('Ana', 'Bob', 'Cid'):
            page = b.new_context(viewport={'width': 1280, 'height': 720}).new_page()
            page.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
            page.on('console', lambda m, n=name: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
            people[name] = page
        ana, bob, cid = people['Ana'], people['Bob'], people['Cid']
        ready = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
        ana.goto(f'{a.base}{path}?lang=en')
        ana.wait_for_function(ready, timeout=90000)
        ana.click('[data-room-button]')
        ana.fill('[data-room-name]', 'Ana')
        ana.click('[data-room-start]')
        ana.wait_for_function("() => __ewRoom.status === 'on'", timeout=20000)
        code = ana.evaluate('() => __ewRoom.code')
        ana.click('[data-room-button]')
        for pg, n, at in ((bob, 'Bob', path), (cid, 'Cid', '/')):
            pg.goto(f'{a.base}{at}?lang=en')
            pg.wait_for_function(ready, timeout=90000)
            pg.click('[data-room-button]')
            pg.fill('[data-room-name]', n)
            pg.fill('[data-room-code]', code)
            pg.click('[data-room-join]')
        for n, pg in people.items():
            pg.wait_for_function('() => __ewRoom.members.length === 3', timeout=20000)
            if pg.query_selector('[data-room-sheet]'):
                pg.click('[data-room-button]')
        parts = ana.evaluate('() => Object.keys(__ew.world.shared || {})')
        check(f'{path} shares things', bool(parts), ', '.join(parts))
        if not parts:
            b.close()
            sys.exit(1)
        bob.wait_for_function('() => __ewShared.started && !__ewShared.pending', timeout=8000)
        ok, d = in_step(bob)
        check("Bob's world starts as Ana's", ok, d)

        ids = ana.evaluate('() => __ew.world.interactables.map(i => i.id)')
        todo = [('use', i) for i in ids if i not in skip] + [('step', s) for s in steps]
        for kind, what in todo:
            before = ana.evaluate(ALL)
            if kind == 'use':
                ana.evaluate(f"() => __ew.world.interactables.find(i => i.id === '{what}').onUse()")
            else:
                ana.evaluate(what)
            time.sleep(0.4)
            if ana.evaluate('() => !!__ew.store.get().overlay'):
                ana.keyboard.press('Escape')
            time.sleep(0.6)
            after = ana.evaluate(ALL)
            changed = [k for k in parts if json.dumps(before.get(k)) != json.dumps(after.get(k))]
            label = what if kind == 'use' else f'step {what[:40]}'
            if not changed:
                quiet.append(label)
                continue
            ok, d = in_step(bob)
            check(f"{label}: Bob's {', '.join(changed)} in step", ok, d)
            # the panel stays Ana's
            check(f'{label}: no panel opened for Bob', not bob.evaluate('() => __ew.store.get().panel'))
            time.sleep(2.5)

        bob.screenshot(path=str(OUT / f"bob_{path.strip('/').replace('/', '_')}.png"))
        cid.evaluate(f"() => __ew.go('{path}')")
        cid.wait_for_function(f"() => location.pathname === '{path}' && __ew.world && __ew.world.shared && !__ew.store.get().fading", timeout=30000)
        cid.wait_for_function('() => __ewShared.started && !__ewShared.pending', timeout=8000)
        time.sleep(0.5)
        ok, d = in_step(cid)
        check('Cid comes in late and finds it all as Ana has it', ok, d)
        if fails:
            for n, pg in people.items():
                print(n, 'trail', json.dumps(pg.evaluate('() => __ewRoom.trail.slice(-14)')))
        b.close()

    if quiet:
        print('\nused, nothing shared changed (a panel only, or still to wire):', ', '.join(quiet))
    for e in errors:
        print('console:', e)
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
