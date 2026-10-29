"""The table together (src/engine/others.js plazaMarks, docs/knowledge/multiplayer.md) and the plaza's dock
(src/ui/PlazaHud.jsx): three people in one room on the 3D table, Ana and Cid on computers, Bob on a phone.
Ana and Bob pick carbon, Cid oxygen: each sees the others' Atomlings standing on the cubes they picked
(two side by side on carbon, beside Ana's own), with a ring and a name, and a change of pick moves them.
The dock: Trends is there in both depths; on the phone a drawer opens over a selected element's card (the
card steps aside) and a new pick brings the card back. Screenshots in tools/shots/plaza_room/.

    python tools/plaza_room_probe.py [--base http://localhost:5317]
"""
import argparse
import pathlib
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'
OUT = pathlib.Path(__file__).parent / 'shots' / 'plaza_room'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:70} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def wait(page, js, timeout=20000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

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

        ana.goto(f'{a.base}/?lang=en')
        ana.wait_for_function(READY, timeout=90000)
        # the dock: Trends in the Explorer depth too
        ana.evaluate("() => { localStorage.removeItem('ew-level') }")
        check('Trends is in the dock (Explorer)', wait(ana, '() => !!document.querySelector("[aria-label=Trends]")', 5000), ana.evaluate('() => __ew.store.get().level'))
        ana.click('[data-room-button]')
        ana.fill('[data-room-name]', 'Ana')
        ana.click('[data-room-start]')
        check('Ana starts a room', wait(ana, "() => __ewRoom.status === 'on'"))
        code = ana.evaluate('() => __ewRoom.code')
        ana.click('[data-room-button]')  # the sheet closes, the table in view
        for pg, n in ((bob, 'Bob'), (cid, 'Cid')):
            pg.goto(f'{a.base}/?lang=en')
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

        ids = {n: pg.evaluate('() => __ewRoom.me.id') for n, pg in people.items()}
        ana.evaluate('() => __ew.world.select(6)')
        bob.evaluate('() => __ew.world.select(6)')
        cid.evaluate('() => __ew.world.select(8)')
        seat = lambda who, z: f"() => {{ const g = __ew.others && __ew.others.marks.get('{ids[who]}'); return !!g && g.z === {z} && !!g.av }}"
        check("Ana sees Bob's Atomling on carbon", wait(ana, seat('Bob', 6), 15000))
        check("Ana sees Cid's Atomling on oxygen", wait(ana, seat('Cid', 8), 15000))
        check("Bob sees Ana's on carbon and Cid's on oxygen", wait(bob, seat('Ana', 6), 15000) and wait(bob, seat('Cid', 8), 15000))
        check("Cid sees Ana's and Bob's on carbon", wait(cid, seat('Ana', 6), 15000) and wait(cid, seat('Bob', 6), 15000))
        time.sleep(1.5)
        # Bob's stands beside Ana's own, not inside it; both on carbon's top
        d = ana.evaluate(f"""() => {{
          const g = __ew.others.marks.get('{ids['Bob']}').holder.position, s = __ew.world.cubeSeat(6)
          return [Math.hypot(g.x - s.x, g.z - s.z), g.y - s.y]
        }}""")
        check("on Ana's screen Bob's stands beside hers", d[0] > 1.0 and abs(d[1]) < 0.2, str(d))
        d = cid.evaluate(f"""() => {{
          const a = __ew.others.marks.get('{ids['Ana']}').holder.position, b = __ew.others.marks.get('{ids['Bob']}').holder.position
          return Math.hypot(a.x - b.x, a.z - b.z)
        }}""")
        check("on Cid's screen Ana's and Bob's stand side by side", d > 1.0, f'{d:.2f}')
        ana.evaluate('() => __ew.world.overview()')
        time.sleep(2.5)
        ana.screenshot(path=str(OUT / 'ana_overview.png'))
        cid.evaluate('() => __ew.world.select(6)')  # Cid comes over to carbon: the three on one cube
        time.sleep(2.5)
        cid.screenshot(path=str(OUT / 'cid_carbon.png'))
        check("Cid's pick moves Cid's Atomling on Ana's screen", wait(ana, seat('Cid', 6), 15000))
        time.sleep(1.5)
        ana.evaluate('() => __ew.world.select(6)')
        time.sleep(2.5)
        ana.screenshot(path=str(OUT / 'ana_carbon.png'))

        # the phone's dock with a card up: the drawer opens, the card steps aside, a new pick brings it back
        bob.evaluate('() => __ew.world.select(26)')
        wait(bob, '() => __ew.store.get().selected === 26', 5000)
        time.sleep(1)
        bob.screenshot(path=str(OUT / 'bob_card.png'))
        for label in ('Families', 'Trends', 'Time machine'):
            bob.click(f'[aria-label="{label}"]')
            ok = wait(bob, f'() => [...document.querySelectorAll(".glass")].some(d => d.textContent.trim().startsWith("{label}") && d.getBoundingClientRect().height > 40)', 4000)
            check(f'phone: {label} opens with an element selected', ok)
            bob.screenshot(path=str(OUT / f'bob_{label.split()[0].lower()}.png'))
            bob.click(f'[aria-label="{label}"]')
        bob.click('[aria-label="Families"]')
        bob.evaluate('() => __ew.world.select(29)')
        check('phone: a new pick closes the drawer, its card shows', wait(bob, '() => ![...document.querySelectorAll(".glass")].some(d => d.textContent.trim().startsWith("Families") && d.getBoundingClientRect().height > 40)', 4000))
        bob.screenshot(path=str(OUT / 'bob_newpick.png'))

        ana.evaluate('() => __ewRoom.leave()')
        check("Bob and Cid see Ana's Atomling go with her", wait(bob, f"() => !__ew.others.marks.has('{ids['Ana']}')", 30000) and wait(cid, f"() => !__ew.others.marks.has('{ids['Ana']}')", 30000))
        for pg in (bob, cid):
            pg.evaluate('() => __ewRoom.leave()')
        b.close()

    for e in errors[:10]:
        print('   error:', e)
    print('shots in', OUT)
    print('FAILED: ' + ', '.join(fails) if fails else 'all checks passed')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
