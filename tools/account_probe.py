"""Accounts (src/net/account.js, docs/knowledge/accounts.md) from end to end, with a throwaway account
(probe_xxxx, the pokemon-site's kind): a device that gathered progress before anyone signed in on it
(discoveries, a quiz record, a neon name: as Artur's phone) creates an account and its progress moves
into it; a new discovery is saved to the account; what is played is recorded under the account; the
account's switch turns the recording off; signing out empties the device; another device signing in
gets the same progress back; a wrong password and a taken name are refused in words; the signed-out
switch stops the anonymous recording; an old ?who= link is cleaned out. Then the account is deleted
(ew_admin forget_probe). Needs the dashboard password in EW_DASH_PASS. Dev server on 5310.

    EW_DASH_PASS=... python tools/account_probe.py [--base http://localhost:5317]
"""
import argparse
import json
import os
import secrets
import sys
import urllib.request

from playwright.sync_api import sync_playwright

URL = 'https://kawvqpvntdgehigwvfao.supabase.co'
KEY = 'sb_publishable_XjLWqFaE6h9ENP_Glh5gnQ_jDzbnMs9'
READY = 'window.__ew && window.__ew.world && !window.__ew.store.get().fading'


def rpc(fn, args):
    req = urllib.request.Request(f'{URL}/rest/v1/rpc/{fn}', data=json.dumps(args).encode(), method='POST',
                                 headers={'apikey': KEY, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:5310')
    a = ap.parse_args()
    pw = os.environ.get('EW_DASH_PASS')
    if not pw:
        sys.exit('set EW_DASH_PASS to the dashboard password')
    name = 'probe_' + secrets.token_hex(3)
    password = 'pw-' + secrets.token_hex(6)
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

    def person():
        rows = rpc('ew_admin', {'p_pass': pw, 'p_action': 'devices'})
        return next((r for r in rows if r['label'] == name), None)

    def events():
        return rpc('ew_admin', {'p_pass': pw, 'p_action': 'events', 'p_args': {'who': name, 'since': '2026-01-01T00:00:00Z'}})

    try:
        with sync_playwright() as p:
            b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])

            def device():
                ctx = b.new_context(viewport={'width': 1280, 'height': 760})
                page = ctx.new_page()
                page.on('pageerror', lambda e: errors.append(str(e)[:200]))
                page.on('console', lambda m: m.type == 'error' and 'status of 400' not in m.text and errors.append(m.text[:200]))
                return ctx, page

            # a phone with progress from before (no account yet)
            ctx, page = device()
            page.goto(f'{a.base}/?track=1&lang=en&who=artur')
            page.wait_for_function(READY, timeout=90000)
            check('an old ?who= link is cleaned out of the address', 'who=' not in page.url, page.url)
            page.evaluate("""() => {
              localStorage.setItem('ew-found', JSON.stringify(['C:identity', 'O:facts', 'lab:H2O']))
              localStorage.setItem('ew-quiz-best', JSON.stringify({ explorer: 7 }))
              localStorage.setItem('ew-neon-name:Ne', 'ARTUR')
            }""")
            page.goto(f'{a.base}/?track=1&lang=en')
            page.wait_for_function(READY, timeout=90000)

            # wrong password, then a new account
            page.click('[data-account-button]')
            page.fill('[data-account-name]', name)
            page.fill('[data-account-password]', 'nope-nope')
            page.click('[data-account-submit]')
            check('a wrong name or password is refused in words', wait(page, '() => /Wrong name or password/.test(document.querySelector("[data-account-problem]")?.textContent || "")', 15000))
            page.click('[data-account-tab="up"]')
            page.fill('[data-account-password]', password)
            page.click('[data-account-submit]')
            check('a new account is made and signed in', wait(page, f"() => __ew.store.get().account?.username === '{name}'", 20000))
            check('the device says its discoveries moved into the account', wait(page, '() => !!document.querySelector("[data-account-moved]")', 10000))
            pr = person()
            check("the account holds the device's discoveries", bool(pr and pr['discoveries'] == 3), str(pr and pr['discoveries']))

            # a new discovery is saved to the account
            page.evaluate("() => __ew.go('/e/C')")
            page.wait_for_function("() => __ew.store.get().world?.symbol === 'C' && !__ew.store.get().fading", timeout=60000)
            page.wait_for_timeout(1200)
            page.evaluate("() => __ew.world.interactables.find(i => i.id === 'look').onUse()")
            page.wait_for_timeout(3500)
            pr = person()
            check('a new discovery is saved to the account', bool(pr and pr['discoveries'] == 4), str(pr and pr['discoveries']))

            # recorded under the account
            page.evaluate('() => __ewTelemetry.flush()')
            page.wait_for_timeout(2500)
            evs = events()
            check('what is played is recorded under the account', len(evs) > 3 and all(e['label'] == name for e in evs), f'{len(evs)} events')

            # the switch off: nothing more
            page.click('[data-account-button]') if not page.query_selector('[data-account-sheet]') else None
            page.click('[data-switch="tracking"]')
            page.wait_for_timeout(1500)
            n = len(events())
            page.evaluate("() => __ew.go('/')")
            page.wait_for_function(READY, timeout=60000)
            page.evaluate('() => __ew.world.select(26)')
            page.wait_for_timeout(500)
            page.evaluate('() => __ewTelemetry.flush()')
            page.wait_for_timeout(2000)
            pr = person()
            check("the account's switch stops the recording", len(events()) == n and pr and pr['removed'], f'{n} events, recording off: {pr and pr["removed"]}')
            page.click('[data-switch="tracking"]')  # back on, for the next device
            page.wait_for_timeout(1000)

            # signing out empties the device
            page.click('[data-account-out]')
            check('signing out empties the device', wait(page, "() => !__ew.store.get().account && JSON.parse(localStorage.getItem('ew-found') || '[]').length === 0 && !localStorage.getItem('ew-neon-name:Ne')", 10000))
            ctx.close()

            # another device: the progress comes back
            ctx, page = device()
            page.goto(f'{a.base}/?track=1&lang=en')
            page.wait_for_function(READY, timeout=90000)
            page.click('[data-account-button]')
            page.fill('[data-account-name]', name)
            page.fill('[data-account-password]', password)
            page.click('[data-account-submit]')
            check('another device signs in', wait(page, f"() => __ew.store.get().account?.username === '{name}'", 20000))
            back = page.evaluate("() => [JSON.parse(localStorage.getItem('ew-found') || '[]').length, JSON.parse(localStorage.getItem('ew-quiz-best') || '{}').explorer, localStorage.getItem('ew-neon-name:Ne')]")
            check('and gets the discoveries, the quiz record and the neon name back', back == [4, 7, 'ARTUR'], str(back))
            check('nothing "moved" from the empty device', not page.query_selector('[data-account-moved]'))
            page.click('[data-account-out]')
            wait(page, '() => !__ew.store.get().account', 10000)

            # a taken name
            page.click('[data-account-button]') if not page.query_selector('[data-account-sheet]') else None
            page.click('[data-account-tab="up"]')
            page.fill('[data-account-name]', name)
            page.fill('[data-account-password]', password)
            page.click('[data-account-submit]')
            check('a taken name is refused in words', wait(page, '() => /taken/.test(document.querySelector("[data-account-problem]")?.textContent || "")', 15000))

            # the signed-out switch
            page.click('[data-switch="device-tracking"]')
            check('the signed-out switch stops the anonymous recording', wait(page, '() => !__ewTelemetry.on()', 5000))
            page.click('[data-switch="device-tracking"]')
            ctx.close()
            b.close()
    finally:
        r = rpc('ew_admin', {'p_pass': pw, 'p_action': 'forget_probe', 'p_args': {'username': name}})
        print('the probe account deleted:', r)
    for e in errors:
        print('console error:', e)
    sys.exit(1 if fails or errors else 0)


if __name__ == '__main__':
    main()
