"""The diamond press for two (docs/knowledge/press.md): two people in a room, Ana on a computer in English,
Bob on a phone in Polish, both in carbon's gallery.

Ana starts the press; Bob's press runs the same run (the referee's). Ana pumps and so takes the pump; Bob
turns the heater and so takes the heater; Ana's turn of the heater and Bob's stroke of the pump are refused
(each keeps the job they took). The run grows a diamond and ends with the same diamond on both screens,
the press open on it, the result panel on both. Then Bob leaves the gallery: Ana, alone at the press, works
both jobs in a new run. Screenshots in tools/shots/press_duo/. Probe rooms are named PRB... (their rows in
ew_room_world can be cleared, multiplayer.md).

    py -3.11 tools/press_duo_probe.py [--base http://localhost:5310]
"""
import argparse
import pathlib
import random
import sys
import time

from playwright.sync_api import sync_playwright

READY = 'window.__ew && window.__ew.world && window.__ew.world.shared && !window.__ew.store.get().fading'
OUT = pathlib.Path(__file__).parent / 'shots' / 'press_duo'
GALLERY = '/e/C/allotropes'
RUN = '__ewPress.s'


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

    def wait(page, js, timeout=12000):
        try:
            page.wait_for_function(js, timeout=timeout)
            return True
        except Exception:
            return False

    def shot(page, name):
        page.screenshot(path=str(OUT / f'{name}.png'))

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11', '--ignore-gpu-blocklist'])
        people = {}
        for name, phone, lang in (('Ana', False, 'en'), ('Bob', True, 'pl')):
            ctx = b.new_context(**({'viewport': {'width': 412, 'height': 820}, 'is_mobile': True, 'has_touch': True, 'device_scale_factor': 2} if phone else {'viewport': {'width': 1440, 'height': 860}}))
            page = ctx.new_page()
            page.on('pageerror', lambda e, n=name: errors.append(f'{n}: {str(e)[:200]}'))
            page.on('console', lambda m, n=name: m.type == 'error' and errors.append(f'{n}: {m.text[:200]}'))
            page.goto(f'{a.base}{GALLERY}?lang={lang}')
            page.wait_for_function(READY, timeout=90000)
            people[name] = page
        ana, bob = people['Ana'], people['Bob']
        code = 'PRB' + ''.join(random.choice('ABCDEFGHJKMNPQRSTUVWXYZ') for _ in range(3))
        for n, pg in people.items():
            pg.evaluate(f"() => __ewRoom.join('{code}', '{n}')")
        for n, pg in people.items():
            check(f'{n} sees both in the room', wait(pg, '() => __ewRoom.members.length === 2', 20000))
            check(f'{n} sees both in the gallery', wait(pg, f"() => __ewRoom.members.filter(m => m.path === '{GALLERY}').length === 2", 12000))
        # both stand at the press: Ana at the pump, Bob at the heater
        ana.evaluate('() => { __ew.setMode("first"); __ew.teleport(4.8, -26.5, -Math.PI / 2, 0.1) }')
        bob.evaluate('() => { __ew.setMode("first"); __ew.teleport(4.8, -24.2, -Math.PI / 2, 0.1) }')
        time.sleep(1.5)

        ana.evaluate("() => __ew.world.parts.tap.press('start')")
        check("Ana's press runs", wait(ana, f"() => {RUN}?.phase === 'run'", 4000))
        check("Bob's press runs the same run", wait(bob, f"() => {RUN}?.phase === 'run' && {RUN}.id === '{ana.evaluate(f'() => {RUN}.id')}'", 4000))
        check('two at the press: together', wait(ana, f'() => {RUN}?.players.length === 2', 4000))
        time.sleep(2.2)  # the press closes
        ana.evaluate("() => { window.__pump = setInterval(() => __ew.world.parts.tap.press('pump'), 520) }")
        time.sleep(1.2)
        bob.evaluate("() => __ew.world.parts.tap.press('heat', 0.78)")
        check('Ana has the pump', wait(ana, f"() => {RUN}?.roles.pump === __ewRoom.me.id", 4000))
        check('Bob has the heater', wait(bob, f"() => {RUN}?.roles.heat === __ewRoom.me.id && Math.abs({RUN}.power - 0.78) < 0.01", 4000))
        ana.evaluate("() => __ew.world.parts.tap.press('heat', 0.2)")
        time.sleep(1.0)
        check("Ana's turn of the heater is refused (Bob's job)", wait(ana, f'() => Math.abs({RUN}.power - 0.78) < 0.01', 2000), str(ana.evaluate(f'() => {RUN}.power')))
        check('and Ana is told who has it', wait(ana, "() => /Bob/.test(__ew.store.get().speech?.text || '')", 2000))
        before = bob.evaluate(f'() => {RUN}.pumps')
        bob.evaluate("() => { __ew.world.parts.tap.press('pump'); __ew.world.parts.tap.press('pump') }")
        time.sleep(0.6)
        check("Bob's strokes are refused (Ana's job)", bob.evaluate(f'() => __ewPress.s.pumps') - before <= 2, '(Ana pumps meanwhile)')
        check('and Bob is told, in Polish', wait(bob, "() => /Ana/.test(__ew.store.get().speech?.text || '') && /zadanie/.test(__ew.store.get().speech?.text || '')", 2000))
        time.sleep(10)
        shot(ana, 'ana_running')
        shot(bob, 'bob_running_phone_pl')
        check('the diamond grows', wait(ana, f'() => {RUN}?.ct > 0.05', 15000), str(ana.evaluate(f'() => {RUN}?.ct')))
        check('Ana\'s and Bob\'s presses show the same', abs(ana.evaluate(f'() => {RUN}.ct') - bob.evaluate(f'() => {RUN}.ct')) < 0.1)
        # to the end of the run
        check('the run ends', wait(ana, "() => __ew.world.parts.press.actions.phase === 'open'", 45000))
        ana.evaluate('() => clearInterval(window.__pump)')
        check("Bob's press opens too", wait(bob, "() => __ew.world.parts.press.actions.phase === 'open'", 6000))
        cta = ana.evaluate("() => __ew.world.parts.press.actions.state().open")
        ctb = bob.evaluate("() => __ew.world.parts.press.actions.state().open")
        check('the same diamond on both screens', cta == ctb and cta is not None and cta > 0.05, f'{cta} / {ctb}')
        check('the result panel on both', wait(ana, "() => __ew.store.get().panel?.exhibit === 'press'", 5000) and wait(bob, "() => __ew.store.get().panel?.exhibit === 'press'", 5000))
        check("Ana's says they made it together", wait(ana, "() => /Together/.test(__ew.store.get().panel?.title || '')", 2000), ana.evaluate("() => __ew.store.get().panel?.title"))
        time.sleep(1)
        shot(ana, 'ana_diamond')
        shot(bob, 'bob_diamond_phone_pl')

        # Bob leaves the gallery: Ana is alone at the press and works both jobs
        bob.evaluate("() => __ew.go('/e/C')")
        check('Bob has left the gallery', wait(ana, f"() => __ewRoom.members.filter(m => m.path === '{GALLERY}').length === 1", 12000))
        ana.evaluate("() => __ew.store.set({ panel: null })")
        ana.evaluate("() => __ew.world.parts.tap.press('start')")
        check('a new run, Ana alone', wait(ana, f"() => {RUN}?.phase === 'run' && {RUN}.players.length === 1", 5000))
        ana.evaluate("() => { __ew.world.parts.tap.press('pump'); __ew.world.parts.tap.press('heat', 0.7) }")
        check('alone, Ana works the heater too', wait(ana, f'() => Math.abs({RUN}.power - 0.7) < 0.01 && {RUN}.pumps >= 1', 3000))
        shot(ana, 'ana_alone')
        b.close()

    print()
    for e in errors:
        print('console:', e)
    if fails or errors:
        print(f'{len(fails)} wrong, {len(errors)} console errors')
        sys.exit(1)
    print('all right')


if __name__ == '__main__':
    main()
