"""The anonymous usage recording (src/net/telemetry.js, docs/knowledge/usage-data.md) from end to end: a
visit that is not signed in walks the plaza, a hall, the lab, sends, and the events are read back
through the dashboard's function: start, enter/leave with the time open and active, a selection, a card
fact, a panel and its reading time, a talk, all without an account; nothing of the recording is kept in
the browser. Then the visit is forgotten. Signed-in recording, the switches and the move of a device's
progress into an account: tools/account_probe.py. Needs the dashboard password in EW_DASH_PASS. Dev
server on 5310.

    EW_DASH_PASS=... python tools/usage_probe.py
"""
import json
import os
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
    pw = os.environ.get('EW_DASH_PASS')
    if not pw:
        sys.exit('set EW_DASH_PASS to the dashboard password')
    fails = []
    visit = None

    def check(what, ok, detail=''):
        print(f'{what:60} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    try:
        with sync_playwright() as p:
            b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])
            page = b.new_context(viewport={'width': 1280, 'height': 720}).new_page()
            page.goto('http://localhost:5310/?track=1&lang=en')
            page.wait_for_function(READY, timeout=90000)
            page.wait_for_function('() => window.__ewTelemetry && window.__ewTelemetry.on()', timeout=20000)
            visit = page.evaluate('() => __ewTelemetry.visit()')
            page.evaluate('() => __ew.world.select(6)')
            page.wait_for_timeout(600)
            page.click('[data-facts] [data-fact=next]')
            page.evaluate("() => __ew.go('/e/C')")
            page.wait_for_function("() => __ew.store.get().world?.symbol === 'C' && !__ew.store.get().fading", timeout=60000)
            page.wait_for_timeout(1500)
            page.evaluate("() => __ew.world.interactables.find(i => i.id === 'facts').onUse()")
            page.wait_for_timeout(1200)
            page.evaluate('() => __ew.store.set({ panel: null })')
            page.evaluate('() => __ew.talk()')
            page.evaluate("() => __ew.go('/lab')")
            page.wait_for_function("() => __ew.store.get().world?.kind === 'lab' && !__ew.store.get().fading", timeout=60000)
            page.wait_for_timeout(800)
            stored = page.evaluate('() => Object.keys(localStorage).filter(k => /^ew-(device|who|queue|owner)/.test(k))')
            check('an anonymous visit keeps nothing of the recording in the browser', not stored, str(stored))
            page.evaluate('() => __ewTelemetry.flush()')
            page.wait_for_timeout(2500)
            b.close()
        evs = [e for e in rpc('ew_admin', {'p_pass': pw, 'p_action': 'events', 'p_args': {'who': 'anon', 'since': '2026-01-01T00:00:00Z'}}) if e['visit'] == visit]
        kinds = [e['kind'] for e in evs]
        print('   kinds:', ' '.join(kinds))
        for k in ['start', 'enter', 'leave', 'sel', 'fact', 'panel', 'pclose', 'talk']:
            check(f'an anonymous visit sends "{k}"', k in kinds)
        leave = next((e for e in evs if e['kind'] == 'leave'), None)
        check('leaving a world says how long it was open and how long active', bool(leave and leave['data'].get('ms', 0) > 0 and 0 <= leave['data'].get('act', -1) <= leave['data']['ms']), str(leave and leave['data']))
        check('it arrives without an account', bool(evs) and all(e['device'] is None and e['label'] is None for e in evs), f'{len(evs)} events')
    finally:
        if visit:
            rpc('ew_admin', {'p_pass': pw, 'p_action': 'forget_visit', 'p_args': {'visit': visit}})
            print('the probe visit forgotten')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
