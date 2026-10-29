"""The usage recording (src/net/telemetry.js, docs/knowledge/usage-data.md) from end to end: marks a
browser as a throwaway device (?who=probe-xxxx&track=1), walks the plaza, a hall, the lab, sends, reads
the events back through the dashboard's function and checks what arrived (start, enter/leave with time,
selection, a panel and its reading time, talk, a fact); then an anonymous visit, which must arrive without
a device; then forgets the probe device and its events. Needs the dashboard password in EW_DASH_PASS.
Dev server on 5310.

    EW_DASH_PASS=... python tools/usage_probe.py
"""
import json
import os
import secrets
import sys
import time
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
    tag = 'probe-' + secrets.token_hex(3)
    fails = []
    visits = []

    def check(what, ok, detail=''):
        print(f'{what:60} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', headless=True, args=['--use-angle=d3d11'])
        ctx = b.new_context(viewport={'width': 1280, 'height': 720})
        page = ctx.new_page()
        page.goto(f'http://localhost:5310/?track=1&who={tag}&lang=en')
        page.wait_for_function(READY, timeout=90000)
        page.wait_for_function('() => window.__ewTelemetry && window.__ewTelemetry.device()', timeout=20000)
        check('the ?who= tag is taken out of the address', 'who=' not in page.url, page.url)
        device = page.evaluate('() => __ewTelemetry.device()')
        visits.append(page.evaluate('() => __ewTelemetry.visit()'))
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
        page.evaluate('() => __ewTelemetry.flush()')
        page.wait_for_timeout(2500)
        events = rpc('ew_admin', {'p_pass': pw, 'p_action': 'events', 'p_args': {'who': tag, 'since': '2026-01-01T00:00:00Z'}})
        kinds = [e['kind'] for e in events]
        print('   kinds:', ' '.join(kinds))
        for k in ['start', 'enter', 'leave', 'sel', 'fact', 'panel', 'pclose', 'talk']:
            check(f'a marked device sends "{k}"', k in kinds)
        leave = next((e for e in events if e['kind'] == 'leave'), None)
        check('leaving a world says how long it was open and how long active', bool(leave and leave['data'].get('ms', 0) > 0 and 'act' in leave['data']), str(leave and leave['data']))
        check('every event of the marked device carries its id and tag', all(e['device'] == device and e['label'] == tag for e in events))
        devs = rpc('ew_admin', {'p_pass': pw, 'p_action': 'devices'})
        mine = next((d for d in devs if d['id'] == device), None)
        check('the dashboard lists the device with its tag, kind and browser', bool(mine and mine['label'] == tag and mine['kind'] and mine['browser']), str(mine))
        # retag on the dashboard: the device learns its new tag on its next visit
        rpc('ew_admin', {'p_pass': pw, 'p_action': 'retag', 'p_args': {'device': device, 'label': tag + 'b'}})
        page.goto('http://localhost:5310/?track=1&lang=en')
        page.wait_for_function(READY, timeout=90000)
        page.wait_for_timeout(2500)
        visits.append(page.evaluate('() => __ewTelemetry.visit()'))
        check('a retagged device takes its new tag', page.evaluate("() => localStorage.getItem('ew-who')") == tag + 'b')
        # unmarked on the dashboard: the device forgets it was marked
        rpc('ew_admin', {'p_pass': pw, 'p_action': 'remove', 'p_args': {'device': device}})
        page.goto('http://localhost:5310/?track=1&lang=en')
        page.wait_for_function(READY, timeout=90000)
        page.wait_for_timeout(2500)
        visits.append(page.evaluate('() => __ewTelemetry.visit()'))
        page.evaluate('() => __ewTelemetry.flush()')
        page.wait_for_timeout(1500)
        check('a device unmarked on the dashboard forgets its id', page.evaluate("() => localStorage.getItem('ew-device')") is None)
        ctx.close()

        # an anonymous visit: no device id, nothing kept in the browser
        ctx = b.new_context(viewport={'width': 1280, 'height': 720})
        page = ctx.new_page()
        page.goto('http://localhost:5310/?track=1&lang=en')
        page.wait_for_function(READY, timeout=90000)
        page.wait_for_function('() => window.__ewTelemetry', timeout=20000)
        visit = page.evaluate('() => __ewTelemetry.visit()')
        visits.append(visit)
        page.evaluate('() => __ew.world.select(8)')
        page.wait_for_timeout(500)
        stored = page.evaluate('() => Object.keys(localStorage).filter(k => k.startsWith("ew-device") || k.startsWith("ew-queue"))')
        check('an anonymous visit keeps nothing of the recording in the browser', not stored, str(stored))
        page.evaluate('() => __ewTelemetry.flush()')
        page.wait_for_timeout(2500)
        anon = rpc('ew_admin', {'p_pass': pw, 'p_action': 'events', 'p_args': {'who': 'anon', 'since': '2026-01-01T00:00:00Z'}})
        mine = [e for e in anon if e['visit'] == visit]
        check('an anonymous visit arrives without a device', bool(mine) and all(e['device'] is None for e in mine), f'{len(mine)} events')
        ctx.close()
        b.close()

    # leave nothing behind: the probe device and its events, the anonymous visit
    rpc('ew_admin', {'p_pass': pw, 'p_action': 'forget', 'p_args': {'device': device}})
    for v in visits:
        rpc('ew_admin', {'p_pass': pw, 'p_action': 'forget_visit', 'p_args': {'visit': v}})
    print(f'the probe device and its {len(visits)} visits forgotten')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
