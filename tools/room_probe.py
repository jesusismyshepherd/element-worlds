"""Playing together (src/net/room.js, docs/knowledge/multiplayer.md) with three people at once, each in
their own browser (one of them a phone): Ana starts a room from the 👥 sheet, Bob opens its link and
gives his name, Cid types the code. Then: everyone sees the three; Bob follows Ana into carbon's hall
and each sees the other's Atomling there (and Ana's moves); Ana calls everyone and Cid, on the table,
goes there with the note's button; an emote floats over Ana for Bob; in the Molecule Lab the three
build one water molecule together (Ana adds the oxygen, Bob and Cid each join a hydrogen to it) and all
three see H2O made; Ana leaves and the lab goes on with Bob as its host; Cid leaves the room. The room
runs on the family Supabase project's realtime channels. Dev server on 5310.

    python tools/room_probe.py
    python tools/room_probe.py --base https://element-worlds.vercel.app
"""
import argparse
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    fails = []
    errors = []

    def check(what, ok, detail=''):
        print(f'{what:66} {"ok" if ok else "WRONG"} {detail}')
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

        # Ana starts a room from the sheet
        ana.goto(f'{a.base}/?lang=en')
        ana.wait_for_function(READY, timeout=90000)
        ana.click('[data-room-button]')
        ana.fill('[data-room-name]', 'Ana')
        ana.click('[data-room-start]')
        check('Ana starts a room', wait(ana, "() => __ewRoom.status === 'on'"))
        code = ana.evaluate('() => __ewRoom.code')
        print('   room', code)

        # Bob opens the link: asked for his name first
        bob.goto(f'{a.base}/?room={code}&lang=en')
        bob.wait_for_function(READY, timeout=90000)
        check('the link opens the sheet asking for a name', wait(bob, '() => !!document.querySelector("[data-room-name]")', 8000))
        bob.fill('[data-room-name]', 'Bob')
        bob.click('[data-room-join]')
        # Cid types the code
        cid.goto(f'{a.base}/?lang=en')
        cid.wait_for_function(READY, timeout=90000)
        cid.click('[data-room-button]')
        cid.fill('[data-room-name]', 'Cid')
        cid.fill('[data-room-code]', code.lower())
        cid.click('[data-room-join]')
        for n, pg in people.items():
            check(f'{n} sees all three in the room', wait(pg, '() => __ewRoom.members.length === 3', 20000), str(pg.evaluate('() => __ewRoom.members.map(m => m.name)')))
        # two who join together may first pick the same colour: the later one takes another
        wait(ana, '() => new Set(__ewRoom.members.map(m => m.color)).size === 3', 5000)
        colors = ana.evaluate('() => __ewRoom.members.map(m => m.color)')
        check('everyone has a colour of their own', len(set(colors)) == 3, str(colors))
        check('Ana is told Bob and Cid joined', wait(ana, '() => document.querySelectorAll("[data-room-note]").length > 0', 5000))

        # Bob follows Ana into carbon's hall
        bob.click('[data-room-button]') if not bob.query_selector('[data-room-sheet]') else None
        ana_id = ana.evaluate('() => __ewRoom.me.id')
        bob.click(f'[data-room-follow="{ana_id}"]')
        ana.evaluate("() => __ew.go('/e/C')")
        check('Bob follows Ana into the hall', wait(bob, "() => location.pathname === '/e/C' && !__ew.store.get().fading", 30000))
        ana.wait_for_function("() => __ew.store.get().world?.symbol === 'C' && !__ew.store.get().fading", timeout=30000)
        ana.evaluate('() => __ew.teleport(2, 1, 0)')
        bob_id = bob.evaluate('() => __ewRoom.me.id')
        check("Bob sees Ana's Atomling in the hall", wait(bob, f"() => __ew.others && __ew.others.avatars.has('{ana_id}')", 15000))
        check("Ana sees Bob's Atomling", wait(ana, f"() => __ew.others && __ew.others.avatars.has('{bob_id}')", 15000))
        ana.evaluate('() => __ew.teleport(-3, -2, 1)')
        check("Ana's move shows on Bob's screen", wait(bob, f"() => {{ const h = __ew.others.avatars.get('{ana_id}').holder.position; return Math.hypot(h.x + 3, h.z + 2) < 0.3 }}", 8000))

        # Ana calls everyone: Cid (on the table) goes there from the note
        ana.evaluate('() => __ew.others.callHere()')
        check('Cid gets the call with a Go button', wait(cid, '() => [...document.querySelectorAll("[data-room-note] button")].length > 0', 8000))
        cid.click('[data-room-note] button')
        check('Cid goes to the hall', wait(cid, "() => location.pathname === '/e/C' && !__ew.store.get().fading", 30000))
        cpos = cid.evaluate('() => [__ew.player.pos.x, __ew.player.pos.z]')
        check('and lands beside Ana', abs(cpos[0] + 3 - 1.2) < 1.5 and abs(cpos[1] + 2 - 1.2) < 1.5, str(cpos))

        # an emote
        ana.evaluate("() => __ew.others.sendEmote('👋')")
        check("Ana's emote floats over her Atomling on Bob's screen", wait(bob, '() => __ew.others.emotes.length > 0', 5000))

        # the lab, together
        for pg in (ana, bob, cid):
            pg.evaluate("() => __ew.go('/lab')")
        for n, pg in people.items():
            pg.wait_for_function("() => __ew.store.get().world?.kind === 'lab' && !__ew.store.get().fading", timeout=30000)
        time.sleep(2.5)
        for n, pg in people.items():
            print('   ', n, 'sees', pg.evaluate('() => __ewRoom.members.map(m => m.name + ":" + m.path).join(", ")'), '| status', pg.evaluate('() => __ewRoom.status'), '| trail', pg.evaluate('() => JSON.stringify(__ewRoom.trail)'))
        ana.evaluate("() => __ew.world.add('O')")
        check('Bob and Cid see the oxygen Ana added', all(wait(pg, '() => __ew.world.molecule().atoms.length === 1', 8000) for pg in (bob, cid)))
        bob.evaluate('() => __ew.world.tap(0)')
        bob.evaluate("() => __ew.world.add('H')")
        wait(ana, '() => __ew.world.molecule().atoms.length === 2', 8000)
        cid.wait_for_function('() => __ew.world.molecule().atoms.length === 2', timeout=8000)
        cid.evaluate("() => { const i = __ew.world.molecule().atoms.findIndex(a => a.el === 'O'); __ew.world.tap(i) }")
        cid.evaluate("() => __ew.world.add('H')")
        for n, pg in people.items():
            print('   ', n, pg.evaluate('() => JSON.stringify(__ew.world.together())'), pg.evaluate('() => __ew.world.molecule().atoms.map(a => a.el + "@" + a.id).join(" ")'))
        for n, pg in people.items():
            check(f'{n} sees water made together', wait(pg, "() => __ew.store.get().lab?.formula === 'H2O' && __ew.store.get().lab?.complete", 10000), str(pg.evaluate('() => __ew.store.get().lab && __ew.store.get().lab.formula')))
        names = ana.evaluate('() => (__ew.store.get().lab.together || []).map(m => m.name)')
        check('the lab card names the others building with Ana', sorted(names) == ['Bob', 'Cid'], str(names))
        ids = [pg.evaluate('() => __ew.world.molecule().atoms.map(a => a.id).join()') for pg in (ana, bob, cid)]
        check('the three hold the same molecule, atom for atom', len(set(ids)) == 1, ids[0])

        # Ana leaves: the lab goes on with Bob as host
        ana.evaluate('() => __ewRoom.leave()')
        # (a leave usually shows within seconds; the realtime presence can take longer now and then)
        check('Bob and Cid see Ana go', all(wait(pg, '() => __ewRoom.members.length === 2', 30000) for pg in (bob, cid)))
        time.sleep(1)
        cid.evaluate("() => __ew.world.add('C')")
        check('the lab goes on without Ana (Bob hosts)', all(wait(pg, '() => __ew.world.molecule().atoms.length === 4', 8000) for pg in (bob, cid)))

        cid.evaluate('() => __ewRoom.leave()')
        check('Bob is told Cid left and is alone', wait(bob, '() => __ewRoom.members.length === 1', 30000))
        if fails:
            for n, pg in people.items():
                try:
                    print('   trail', n, pg.evaluate('() => __ewRoom.me && __ewRoom.me.id'), pg.evaluate('() => JSON.stringify(__ewRoom.trail)'))
                    print('   realtime', n, pg.evaluate('() => JSON.stringify(window.__ewRealtimeLog || [])')[:1500])
                except Exception as err:
                    print('   trail', n, 'unreadable', err)
        b.close()
    for e in errors:
        print('console error:', e)
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
