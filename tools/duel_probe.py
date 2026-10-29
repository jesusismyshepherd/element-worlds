"""The quiz duel in a room (src/game/duel.js, src/net/duel.js, src/ui/DuelHud.jsx; docs/knowledge/
multiplayer.md) with three players, one a phone: Ana starts a duel from the plaza's dock, Bob and Cid
see it; Bob takes the free seat and the game starts; the clues come to all three, the answers only for
the two seated; Bob answers wrong (locked out), Ana right (she scores, all see who got it); Cid, watching,
asks to swap with Bob and Bob lets him; Ana and Cid play to the end, the winner shows; the rematch keeps
the winner and gives the other seat to Bob, first in line; Ana (the referee) leaves mid-game and the
duel goes on with someone else running it. Run against a separate build when others edit files.

    python tools/duel_probe.py [--base http://localhost:5317]
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

    def wait(page, js, timeout=15000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

    S = '__ewDuel.s'
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        people = {}
        for name, phone in (('Ana', False), ('Bob', False), ('Cid', True)):
            ctx = b.new_context(**({'viewport': {'width': 412, 'height': 820}, 'is_mobile': True, 'has_touch': True} if phone else {'viewport': {'width': 1280, 'height': 760}}))
            page = ctx.new_page()
            page.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
            page.on('console', lambda m, n=name: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
            page.goto(f'{a.base}/?lang=en')
            page.wait_for_function(READY, timeout=90000)
            people[name] = page
        ana, bob, cid = people['Ana'], people['Bob'], people['Cid']
        code = 'D' + str(int(time.time()) % 1000).zfill(3)
        for n, pg in people.items():
            pg.evaluate(f"() => __ewRoom.join('{code}', '{n}')")
        for n, pg in people.items():
            wait(pg, '() => __ewRoom.members.length === 3', 20000)
        ids = {n: pg.evaluate('() => __ewRoom.me.id') for n, pg in people.items()}

        # Ana starts a duel
        check('the dock offers a duel in a room', wait(ana, '() => !!document.querySelector("[data-duel-start]")', 8000))
        ana.click('[data-duel-start]')
        for n in ('Bob', 'Cid'):
            check(f'{n} sees the duel', wait(people[n], '() => !!document.querySelector("[data-duel]")', 10000))
        bob.click('[data-duel-sit="1"]')
        check('Bob takes the free seat; the game starts for everyone', all(wait(pg, f"() => {S} && {S}.phase === 'asking'", 15000) for pg in people.values()))
        check('the clues show for the watcher too', wait(cid, '() => document.querySelectorAll("[data-duel] ol li").length >= 1', 8000))
        check("the watcher's answers are off", cid.evaluate('() => [...document.querySelectorAll("[data-duel-option]")].every(b => b.disabled)'))

        # Bob wrong, Ana right
        answer = ana.evaluate(f'() => {S}.q.answer')
        wrong = ana.evaluate(f'() => {S}.q.options.find(z => z !== {S}.q.answer)')
        bob.click(f'[data-duel-option="{wrong}"]')
        check('a wrong answer locks Bob out', wait(bob, f"() => {S}.answers['{ids['Bob']}'] === {wrong}", 8000))
        ana.click(f'[data-duel-option="{answer}"]')
        check('Ana answers right and scores', wait(cid, f"() => {S}.winner === '{ids['Ana']}' && {S}.scores['{ids['Ana']}'] > 0", 8000))
        check('everyone sees who got it', all(wait(pg, '() => /Ana got it/.test(document.querySelector("[data-duel-result]")?.textContent || "")', 6000) for pg in people.values()))

        # Cid asks to swap with Bob; Bob lets him
        cid.click('[data-duel-ask="1"]')
        check('Bob is asked to swap', wait(bob, '() => !!document.querySelector("[data-duel-let]")', 8000))
        bob.click('[data-duel-let]')
        check('Cid takes the seat, Bob waits in line', wait(ana, f"() => {S}.seats[1] === '{ids['Cid']}' && {S}.line[0] === '{ids['Bob']}'", 8000))

        # play to the end: the seated one answers right as each question comes
        deadline = time.time() + 120
        turn = 0
        while time.time() < deadline:
            st = ana.evaluate(f'() => {S} && [{S}.phase, {S}.round, {S}.q && {S}.q.answer, JSON.stringify({S}.answers)]')
            if not st or st[0] == 'over':
                break
            if st[0] == 'asking' and st[3] == '{}':
                who = ana if turn % 2 == 0 else cid
                who.click(f'[data-duel-option="{st[2]}"]')
                turn += 1
            time.sleep(0.6)
        check('five questions, then the winner shows', wait(bob, '() => !!document.querySelector("[data-duel-over]")', 20000), str(ana.evaluate(f'() => {S} && {S}.scores')))
        winner = ana.evaluate(f'() => {S}.winner')
        ana.click('[data-duel-again]')
        check('the rematch: the winner stays, Bob takes the other seat', wait(ana, f"() => {S}.phase !== 'over' && {S}.seats.includes('{winner}') && {S}.seats.includes('{ids['Bob']}')", 8000), str(ana.evaluate(f'() => {S}.seats')))

        # the referee leaves: the duel goes on
        wait(cid, f"() => {S}.phase === 'asking'", 15000)
        ana.evaluate('() => __ewRoom.leave()')
        check('the duel goes on with another referee', wait(bob, f"() => {S} && {S}.ref !== '{ids['Ana']}'", 30000), str(bob.evaluate(f'() => {S} && {S}.ref')))
        check('and a free seat waits for the next player', wait(bob, f"() => {S}.seats.includes(null) || !{S}.seats.includes('{ids['Ana']}')", 10000))
        b.close()
    for e in errors:
        print('console error:', e)
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
