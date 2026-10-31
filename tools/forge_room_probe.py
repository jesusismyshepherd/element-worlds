"""The Atom Forge in a room (docs/knowledge/atom-forge.md "Together", docs/knowledge/multiplayer.md "The
forge together", "The forge's race"): three people, Ana on a computer in English, Bob on a phone in
Portuguese, Cid on a computer in German.

Building together: Ana adds protons while Bob adds neutrons at the same moment, and both count on every
table; the others' particles glow in their colour and a line names who did it; Ana, Bob and Cid each add
their share of helium-4 at once and the mission counts for all three; Ana makes carbon-14 and Bob decays
it: nitrogen-14 on every table, the carbon-14 mission for all three.

The race: Ana opens the picker and starts a race to helium-4; Cid chooses to watch; after the countdown
Ana's and Bob's tables are their own (empty) while Cid's still shows the room's atom, and Cid adds a
neutron to it; Bob's progress shows on Ana's board; Ana finishes first and everyone sees she won; "build
together again": every table shows the room's atom with Cid's neutron. A second race: Ana (the referee)
leaves the room at the start and the race goes on with Bob running it; Bob wins.

Screenshots of each moment, every screen, in tools/shots/forge_room/. Probe rooms are named PRB... (their
rows in ew_room_world can be cleared, multiplayer.md).

    py -3.11 tools/forge_room_probe.py [--base http://localhost:5310]
"""
import argparse
import json
import pathlib
import random
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && window.__ew.world.shared && !window.__ew.store.get().fading'
OUT = pathlib.Path(__file__).parent / 'shots' / 'forge_room'
IN_ROOM = "() => __ewShared.mode === 'room'"
TABLE = '() => __ew.world.table()'
S = '__ewRace.s'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    fails, errors = [], []

    def check(what, ok, detail=''):
        print(f'{what:74} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def wait(page, js, timeout=12000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

    def table(page):
        return page.evaluate(TABLE)

    def same_table(page, z, n, e, timeout=8000):
        return wait(page, f'() => {{ const t = __ew.world.table(); return t.Z === {z} && t.N === {n} && t.E === {e} }}', timeout)

    def at_once(pages_and_code, delay=600):
        """Each page runs its code at the same moment (one machine, one clock), before any word arrives."""
        when = ana.evaluate('() => Date.now()') + delay
        for pg, code in pages_and_code:
            pg.evaluate(f'() => setTimeout(() => {{ {code} }}, {when} - Date.now())')
        time.sleep(delay / 1000 + 0.2)

    def shot(page, name):
        page.screenshot(path=str(OUT / f'{name}.png'))

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        people = {}
        for name, phone, lang in (('Ana', False, 'en'), ('Bob', True, 'pt-pt'), ('Cid', False, 'de')):
            ctx = b.new_context(**({'viewport': {'width': 412, 'height': 820}, 'is_mobile': True, 'has_touch': True, 'device_scale_factor': 2} if phone else {'viewport': {'width': 1440, 'height': 860}}))
            page = ctx.new_page()
            page.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
            page.on('console', lambda m, n=name: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
            page.goto(f'{a.base}/forge?lang={lang}')
            page.wait_for_function(READY, timeout=90000)
            people[name] = page
        ana, bob, cid = people['Ana'], people['Bob'], people['Cid']
        code = 'PRB' + ''.join(random.choice('ABCDEFGHJKMNPQRSTUVWXYZ') for _ in range(3))
        for n, pg in people.items():
            pg.evaluate(f"() => __ewRoom.join('{code}', '{n}')")
        for n, pg in people.items():
            check(f'{n} sees all three in the room', wait(pg, '() => __ewRoom.members.length === 3', 20000))
            check(f"{n}'s forge is the room's", wait(pg, IN_ROOM, 8000))
        ids = {n: pg.evaluate('() => __ewRoom.me.id') for n, pg in people.items()}
        time.sleep(1.5)
        check("Ana's HUD says who builds with her", wait(ana, '() => /Bob/.test(document.querySelector("[data-forge-together]")?.textContent || "") && /Cid/.test(document.querySelector("[data-forge-together]")?.textContent || "")', 6000))

        # ---- building together ----
        at_once([(ana, "__ew.world.add('p'); __ew.world.add('p'); __ew.world.add('p')"), (bob, "__ew.world.add('n'); __ew.world.add('n'); __ew.world.add('n')")])
        check("on Bob's table Ana's protons glow in her colour", wait(bob, '() => __ew.world.table().glowing >= 3', 3000), json.dumps(table(bob)))
        check("a line on Bob's screen says what Ana did", wait(bob, '() => /Ana/.test(document.querySelector("[data-forge-feed]")?.textContent || "")', 3000))
        check("and on Cid's, what each did", wait(cid, '() => /Ana/.test(document.querySelector("[data-forge-feed]")?.textContent || "") && /Bob/.test(document.querySelector("[data-forge-feed]")?.textContent || "")', 3000))
        shot(bob, 'bob_together_phone_pt')
        shot(cid, 'cid_together_de')
        shot(ana, 'ana_together_en')
        for n, pg in people.items():
            check(f"{n}'s table: Ana's 3 protons and Bob's 3 neutrons, pressed at once", same_table(pg, 3, 3, 0), json.dumps(table(pg)))

        # helium-4, a share each at once: the mission for all three
        ana.evaluate('() => __ew.world.clear()')
        for pg in people.values():
            same_table(pg, 0, 0, 0)
        time.sleep(0.6)
        at_once([(ana, "__ew.world.add('p'); __ew.world.add('p')"), (bob, "__ew.world.add('n'); __ew.world.add('n')")])
        time.sleep(0.6)
        cid.evaluate("() => { __ew.world.add('e'); __ew.world.add('e') }")
        for n, pg in people.items():
            check(f"{n}'s table: helium-4, built by three", same_table(pg, 2, 2, 2), json.dumps(table(pg)))
            check(f'the helium-4 mission counts for {n}', wait(pg, "() => __ew.store.get().forge.done.includes('He4')", 5000))

        # carbon-14 made by Ana, decayed by Bob: nitrogen-14 everywhere, the mission for all
        ana.evaluate('() => __ew.world.set(6, 8, 6)')
        check("Bob's table: Ana's carbon-14", same_table(bob, 6, 8, 6))
        time.sleep(0.5)
        bob.evaluate('() => __ew.world.decay()')
        for n, pg in people.items():
            check(f"{n}'s table: nitrogen-14 from Bob's decay", same_table(pg, 7, 7, 7), json.dumps(table(pg)))
            check(f'the carbon-14 mission counts for {n}', wait(pg, "() => __ew.store.get().forge.done.includes('C14')", 5000))
        time.sleep(1.2)
        shot(ana, 'ana_decay_en')

        # Cid fires an alpha particle at the nitrogen-14: Rutherford's transmutation on every table
        cid.evaluate("() => __ew.world.fire('a')")
        for n, pg in people.items():
            check(f"{n}'s table: oxygen-17 from Cid's shot", same_table(pg, 8, 9, 8), json.dumps(table(pg)))
            check(f"Rutherford's transmutation counts for {n}", wait(pg, "() => __ew.store.get().forge.done.includes('transmute')", 5000))
        # a nucleus that cannot hold together falls apart once on every table (the one who made it runs
        # its decay; the others play it)
        ana.evaluate('() => __ew.world.clear()')
        time.sleep(0.8)
        ana.evaluate("() => { __ew.world.add('p'); __ew.world.add('p') }")
        time.sleep(4.5)
        for n, pg in people.items():
            check(f"{n}'s table: the helium-2 fell apart once, hydrogen-1 left", same_table(pg, 1, 0, 0, 3000), json.dumps(table(pg)))
        ana.evaluate('() => __ew.world.set(7, 7, 7)')
        for pg in people.values():
            same_table(pg, 7, 7, 7)
        time.sleep(0.8)

        # ---- the race ----
        ana.click('[data-race-open]')
        check('Ana sees the race picker', wait(ana, '() => !!document.querySelector("[data-race-picker]")', 4000))
        shot(ana, 'ana_picker_en')
        ana.click('[data-race-goal="He4"]')
        for n, pg in people.items():
            check(f'{n} sees the race board', wait(pg, '() => !!document.querySelector("[data-race]")', 8000))
        check('everyone in the forge races', wait(ana, f"() => {S} && {S}.order.length === 3", 4000))
        cid.click('[data-race-watch]')
        check('Cid chose to watch', wait(ana, f"() => {S}.order.length === 2 && !{S}.order.includes('{ids['Cid']}')", 6000))
        shot(bob, 'bob_ready_phone_pt')
        for n in ('Ana', 'Bob'):
            check(f"{n}'s table is their own, from nothing", wait(people[n], '() => __ew.world.table().racing && __ew.world.table().Z === 0 && __ew.world.table().N === 0', 15000), json.dumps(table(people[n])))
        check("Cid's table still shows the room's atom", not table(cid)['racing'] and same_table(cid, 7, 7, 7, 2000), json.dumps(table(cid)))
        check('no jumping in a race: the chart pick does nothing', ana.evaluate("() => { __ew.world.goTo('He'); return __ew.world.table().Z }") == 0)
        # Cid builds on while they race
        cid.evaluate("() => __ew.world.add('n')")
        check("Cid's neutron is on the room's atom", wait(cid, '() => __ew.world.table().N === 8', 3000))
        check("Ana's race table is not touched by it", table(ana)['Z'] == 0 and table(ana)['N'] == 0, json.dumps(table(ana)))
        bob.evaluate("() => { __ew.world.add('p'); __ew.world.add('p'); __ew.world.add('n') }")
        check("Bob's progress shows on Ana's board", wait(ana, f"() => ({S}.at['{ids['Bob']}'] || {{}}).p > 0.3", 6000), json.dumps(ana.evaluate(f"() => {S}.at")))
        time.sleep(0.6)
        shot(ana, 'ana_racing_en')
        shot(bob, 'bob_racing_phone_pt')
        shot(cid, 'cid_watching_de')
        ana.evaluate("() => { for (const k of ['p', 'p', 'n', 'n', 'e', 'e']) __ew.world.add(k) }")
        for n, pg in people.items():
            check(f'{n} sees Ana win', wait(pg, f"() => {S} && {S}.phase === 'over' && {S}.winner === '{ids['Ana']}'", 8000), str(pg.evaluate(f'() => {S} && [{S}.phase, {S}.winner]')))
        check("Bob's board says Ana won (in Portuguese)", wait(bob, '() => /Ana ganhou/.test(document.querySelector("[data-race-status]")?.textContent || "")', 4000), bob.evaluate('() => document.querySelector("[data-race-status]")?.textContent'))
        time.sleep(0.5)
        shot(ana, 'ana_won_en')
        shot(bob, 'bob_over_phone_pt')
        shot(cid, 'cid_over_de')
        bob.click('[data-race-back]')
        for n, pg in people.items():
            check(f"{n} is back on the room's atom, with Cid's neutron", wait(pg, '() => !__ew.world.table().racing', 8000) and same_table(pg, 7, 8, 7), json.dumps(table(pg)))
        check('the race is closed for all', all(wait(pg, f'() => !{S}', 6000) for pg in people.values()))
        time.sleep(1)
        shot(bob, 'bob_back_phone_pt')

        # ---- a second race: the referee leaves, the race goes on ----
        ana.evaluate("() => __ewRace.start('H')")
        check('a second race, everyone in it', wait(cid, f"() => {S} && {S}.order.length === 3", 6000))
        wait(bob, f"() => {S} && {S}.phase === 'racing'", 15000)
        ana.evaluate('() => __ewRoom.leave()')
        check('the race goes on with Bob or Cid running it', wait(bob, f"() => {S} && {S}.ref !== '{ids['Ana']}' && !{S}.order.includes('{ids['Ana']}')", 20000), str(bob.evaluate(f'() => {S} && [{S}.ref, {S}.order]')))
        bob.evaluate("() => { __ew.world.add('p'); __ew.world.add('e') }")
        check('Bob wins the second race', wait(cid, f"() => {S} && {S}.winner === '{ids['Bob']}'", 8000), str(cid.evaluate(f'() => {S} && [{S}.phase, {S}.winner]')))
        cid.click('[data-race-back]')
        check("Cid back on the room's atom", wait(cid, '() => !__ew.world.table().racing', 8000) and same_table(cid, 7, 8, 7), json.dumps(table(cid)))
        check("Ana, out of the room, has her own forge (fresh)", wait(ana, "() => __ewShared.mode === 'own' && __ew.world.table().Z === 0 && !__ew.world.table().racing", 8000), json.dumps(table(ana)))
        if fails:
            for n, pg in people.items():
                print(n, 'trail', json.dumps(pg.evaluate('() => __ewRoom.trail.slice(-14)')))
        b.close()

    for e in errors:
        print('console:', e)
    print(f'\n{len(fails)} wrong' if fails else '\nall ok')
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
