"""The family dashboard (/stats: src/pages/Stats.jsx, src/stats/, docs/knowledge/usage-data.md) from end
to end with synthetic data. Makes a throwaway account (probe_dash_xxxx, the pokemon-site's kind:
docs/knowledge/accounts.md) and logs, as that account, two visits that use every kind of event the game
sends (and one the dashboard does not know); opens the dashboard on the dev server, checks that a wrong
password is refused and keeps nothing, logs in, filters to the probe and checks every section with that
data (people, days, places, halls, panels, quick exits, never entered, plaza, quiz, forge, settings,
errors, other events, the timeline in plain words, a tooltip, a table view), forgetting a visit and the
account's history, with no console errors; screenshots on a computer (1280x800) and a phone (412x800)
in tools/shots/stats/. Whatever happens, it deletes the account and its visits at the end.
(Until 2026-10-29 it marked a device with a ?who= tag; accounts replaced the tags.)
Needs the dashboard password in EW_DASH_PASS (never printed). Dev server on 5310.

    EW_DASH_PASS=... py -3.11 tools/stats_probe.py [--port 5310]
"""
import argparse
import json
import os
import secrets
import sys
import time
import urllib.request
import uuid  # noqa: F401 (the visits)
from datetime import datetime, timedelta, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = 'https://kawvqpvntdgehigwvfao.supabase.co'
KEY = 'sb_publishable_XjLWqFaE6h9ENP_Glh5gnQ_jDzbnMs9'
SHOTS = Path(__file__).resolve().parent / 'shots' / 'stats'


def rpc(fn, args, token=None):
    headers = {'apikey': KEY, 'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(f'{URL}/rest/v1/rpc/{fn}', data=json.dumps(args).encode(), method='POST', headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def sign_up(name, password):
    """A new account (the pokemon-site's kind): its id and access token."""
    req = urllib.request.Request(f'{URL}/auth/v1/signup', data=json.dumps({'email': f'{name}@pokemon-app.internal', 'password': password}).encode(),
                                 method='POST', headers={'apikey': KEY, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        out = json.loads(r.read())
    return out['user']['id'], out['access_token']


def visit_events(base, first):
    """Two visits' worth of what telemetry.js sends, as ew_log takes it ({at, k, p, d}); `first` adds the
    kinds the second does not repeat."""
    out = []

    def e(s, k, d=None, p='/'):
        out.append({'at': (base + timedelta(seconds=s)).isoformat(timespec='milliseconds').replace('+00:00', 'Z'), 'k': k, 'p': p, 'd': d})

    e(0, 'start', {'kind': 'phone', 'browser': 'Chrome on Android', 'w': 412, 'h': 915})
    e(1, 'enter', {'w': 'plaza'})
    e(5, 'sel', {'z': 6})
    e(8, 'fact', {'s': 'C', 'i': 1, 'n': 3})
    e(10, 'fact', {'s': 'C', 'i': 2, 'n': 3})
    e(12, 'drawer', {'id': 'find'})
    e(14, 'find', {'z': 8})
    e(20, 'leave', {'w': 'plaza', 'ms': 19000, 'act': 19000}, '/e/C')
    e(20, 'enter', {'w': 'atrium:C'}, '/e/C')
    e(30, 'panel', {'id': 'Fact file'}, '/e/C')
    e(30.001, 'pclose', {'id': 'Fact file', 'ms': 1}, '/e/C')
    e(30.001, 'panel', {'id': 'facts'}, '/e/C')
    e(75.001, 'pclose', {'id': 'facts', 'ms': 45000}, '/e/C')
    e(80, 'talk', {'w': 'C'}, '/e/C')
    e(85, 'talk', {'w': 'C'}, '/e/C')
    e(90, 'talk', {'w': 'C'}, '/e/C')
    e(100, 'panel', {'id': 'identity'}, '/e/C')
    e(101, 'pclose', {'id': 'identity', 'ms': 1000}, '/e/C')
    e(120, 'leave', {'w': 'atrium:C', 'ms': 100000, 'act': 90000}, '/e/C/allotropes')
    e(120, 'enter', {'w': 'wing:C:allotropes'}, '/e/C/allotropes')
    e(300, 'leave', {'w': 'wing:C:allotropes', 'ms': 180000, 'act': 150000}, '/e/C')
    e(300, 'enter', {'w': 'atrium:C'}, '/e/C')
    e(305, 'tile', {'from': 'C', 'to': 'O'}, '/e/C')
    e(306, 'leave', {'w': 'atrium:C', 'ms': 6000, 'act': 6000}, '/e/O')
    e(306, 'enter', {'w': 'atrium:O'}, '/e/O')
    e(320, 'leave', {'w': 'atrium:O', 'ms': 14000, 'act': 14000})
    e(320, 'enter', {'w': 'plaza'})
    if first:
        e(325, 'quizopen')
        e(340, 'quiz', {'z': 8, 'pick': 8, 'ok': True, 'clues': 2, 'of': 5, 'n': 1})
        e(355, 'quiz', {'z': 79, 'pick': 47, 'ok': False, 'clues': 5, 'of': 5, 'n': 2})
    e(360, 'leave', {'w': 'plaza', 'ms': 40000, 'act': 40000}, '/forge')
    e(360, 'enter', {'w': 'forge'}, '/forge')
    if first:
        e(365, 'forge', {'op': 'add', 'k': 'p', 'z': 0, 'n': 0, 'e': 0}, '/forge')
        e(366, 'forge', {'op': 'add', 'k': 'n', 'z': 1, 'n': 0, 'e': 0}, '/forge')
        e(367, 'forge', {'op': 'remove', 'k': 'n', 'z': 1, 'n': 1, 'e': 0}, '/forge')
        e(368, 'forge', {'op': 'add', 'k': 'e', 'z': 1, 'n': 0, 'e': 0}, '/forge')
        e(370, 'mission', {'id': 'forge:H'}, '/forge')
        e(372, 'forge', {'op': 'fire', 'beam': 'a', 'z': 1, 'n': 0}, '/forge')
    e(374, 'leave', {'w': 'forge', 'ms': 14000, 'act': 14000})
    e(374, 'enter', {'w': 'plaza'})
    if first:
        e(375, 'level', {'v': 'scientist'})
        e(376, 'view', {'v': 'first'})
        e(377, 'lang', {'v': 'pl'})
        e(380, 'err', {'m': 'probe error: the dashboard test', 's': 'probe.js:1'})
        e(385, 'room', {'op': 'join'})
        e(386, 'probezap', {'x': 1})
    e(390, 'hide')
    e(450, 'show')
    e(470, 'hide')
    return out


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser()
    ap.add_argument('--port', type=int, default=5310)
    args = ap.parse_args()
    pw = os.environ.get('EW_DASH_PASS')
    if not pw:
        sys.exit('set EW_DASH_PASS to the dashboard password')
    base = f'http://localhost:{args.port}'
    tag = 'probe_dash_' + secrets.token_hex(2)
    device = None
    visits = [str(uuid.uuid4()), str(uuid.uuid4())]
    fails = []
    SHOTS.mkdir(parents=True, exist_ok=True)

    def check(what, ok, detail=''):
        print(f'{what:66} {"ok" if ok else "WRONG"} {detail}')
        if not ok:
            fails.append(what)

    def admin(action, a=None):
        return rpc('ew_admin', {'p_pass': pw, 'p_action': action, 'p_args': a or {}})

    try:
        # ---- the throwaway account and its two visits ----
        device, token = sign_up(tag, 'pw-' + secrets.token_hex(6))
        me = rpc('ew_me', {}, token)
        check('the probe account is made', bool(me) and me.get('username') == tag, tag)
        now = datetime.now(timezone.utc)
        sent = 0
        for visit, (hours, first) in zip(visits, [(2, True), (26, False)]):
            evs = visit_events(now - timedelta(hours=hours), first)
            n = rpc('ew_log', {'p_visit': visit, 'p_events': evs}, token)
            sent += len(evs)
            check(f'ew_log took the {"first" if first else "second"} visit', n == len(evs), f'{n} of {len(evs)}')
        got = admin('events', {'who': tag, 'since': (now - timedelta(days=3)).isoformat()})
        check('the events read back through ew_admin', isinstance(got, list) and len(got) == sent, f'{len(got) if isinstance(got, list) else got} of {sent}')

        with sync_playwright() as p:
            b = p.chromium.launch(channel='msedge', headless=True)
            ctx = b.new_context(viewport={'width': 1280, 'height': 800})
            page = ctx.new_page()
            errors = []
            page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
            page.on('pageerror', lambda e: errors.append(str(e)))

            # ---- the gate: a wrong password is refused, and nothing is kept ----
            page.goto(f'{base}/stats')
            page.wait_for_selector('[data-gate] #dash-pass', timeout=60000)
            page.fill('#dash-pass', 'wrong-' + secrets.token_hex(4))
            t = time.time()
            page.click('[data-gate] button[type=submit]')
            page.wait_for_selector('[data-gate-error]', timeout=20000)
            check('a wrong password is refused', 'Wrong password' in page.inner_text('[data-gate-error]'), f'after {time.time() - t:.1f} s')
            check('a refused password is not kept', page.evaluate("() => localStorage.getItem('ew-dash-pass')") is None)
            check('no dashboard behind a wrong password', page.query_selector('[data-dashboard]') is None)

            # ---- in ----
            page.fill('#dash-pass', pw)
            page.click('[data-gate] button[type=submit]')
            page.wait_for_selector('[data-dashboard]', timeout=30000)
            check('the right password opens the dashboard and is kept on the device', bool(page.evaluate("() => localStorage.getItem('ew-dash-pass')")))
            row = f'[data-device="{device}"]'
            page.wait_for_selector(row, timeout=20000)
            text = page.inner_text(row)
            check('the people list shows the probe account', tag in text and 'phone' in text and 'Chrome on Android' in text and f'{sent} events' in text, ' / '.join(text.split('\n')[:3]))
            check('the account is shown as recording', 'recording' in text and 'recording off' not in text)

            # ---- filter to the probe ----
            page.click('[data-period="7"]')
            page.select_option('#dash-who', tag)
            page.wait_for_function(f"() => document.querySelector('[data-status]')?.textContent.startsWith('{sent} events')", timeout=30000)
            page.wait_for_function("() => !document.querySelector('[data-dashboard]').className.includes('opacity-60')", timeout=30000)
            check('filtered to the probe: all its events loaded', True, page.inner_text('[data-status]'))

            def section(sid):
                el = page.query_selector(f'[data-section="{sid}"]')
                return el.inner_text() if el else ''

            expect = {
                'summary': ['Visits', 'Active time', 'Panels read'],
                'suggests': ['Most of the active time', 'Never'],
                'days': ['2 visits on 2 of the 7 days'],
                'places': ["Carbon's wing", "Carbon's hall", 'The Atom Forge'],
                'quick': ['Left within 20 s', "Oxygen's hall", 'the Atom Forge'],
                'never': ['the Molecule Lab', 'neon sign workshop'],
                'halls': ['Carbon', 'Oxygen', 'boards'],
                'panels': ['The Fact file', '“Identity card”', 'Read (open 3 s or more)'],
                'plaza': ['Picked Carbon on the table twice', 'Found with the search: Oxygen'],
                'quiz': ['1 right (50%)', 'Missed: Gold'],
                'forge': ['A hydrogen atom', '3 added, 1 removed, 1 beam fired'],
                'tools': ['Search drawer', 'Switched to Scientist', 'Language changed to Polish'],
                'errors': ['probe error: the dashboard test', 'probe.js:1', tag],
                'others': ['probezap', 'room'],
                'timeline': ['2 visits in this period'],
            }
            for sid, words in expect.items():
                body = section(sid)
                missing = [w for w in words if w not in body]
                check(f'section "{sid}" shows the synthetic data', bool(body) and not missing, f'missing {missing}' if missing else '')
            tones = page.eval_on_selector_all('[data-signals] [data-tone]', 'els => els.map(e => e.dataset.tone)')
            check('"What it suggests" makes guesses of several kinds', len(set(tones)) >= 4, ' '.join(tones))
            bars = page.eval_on_selector_all('[data-chart="visits"] [data-bar]', 'els => els.length')
            check('the visits chart has a column on each of the two days', bars == 2, f'{bars} columns')
            stacks = page.eval_on_selector_all('[data-chart="panels"] [data-bar]', 'els => els.map(e => e.dataset.bar)')
            check('the panels chart stacks read and skimmed', 'read' in stacks and 'skimmed' in stacks, ' '.join(stacks))

            # a tooltip on a bar, and a chart's table
            page.hover('[data-chart="places"] [data-bar]')
            tip = page.wait_for_selector('[data-chart="places"] [role=status]', timeout=5000)
            check('a bar shows its tooltip on hover', 'active' in tip.inner_text(), tip.inner_text().replace('\n', ' / '))
            page.click('[data-section="days"] button[aria-pressed]')
            check("the days chart's table view", page.query_selector('[data-section="days"] table') is not None)
            page.click('[data-section="days"] button[aria-pressed]')

            # the timeline: two visits, the older one read in plain words
            items = page.query_selector_all('[data-visits] [data-visit]')
            check('the timeline lists both visits', len(items) == 2, f'{len(items)} visits')
            page.click(f'[data-visit="{visits[1]}"]')
            page.wait_for_selector(f'[data-visit="{visits[1]}"][aria-pressed="true"]')
            lines = page.inner_text('[data-lines]')
            words = ['opened the site on a phone', "entered Carbon's hall (1 min 40 s, 1 min 30 s active)", 'opened the Fact file for 45 s', "asked Carbon's Atomling to tell something, 3 times", "took the floor table to Oxygen's hall", 'put the page away for 1 min']
            missing = [w for w in words if w not in lines]
            check('a visit reads in plain words', not missing, f'missing {missing}' if missing else '')
            page.click(f'[data-visit="{visits[0]}"]')
            lines = page.inner_text('[data-lines]')
            words = ['quiz question 2: Silver (wrong, it was Gold)', 'completed the mission “A hydrogen atom”', 'error: probe error: the dashboard test', 'joined a room', 'probezap (x: 1)']
            missing = [w for w in words if w not in lines]
            check('the other visit too, with its quiz, mission, error and unknown kind', not missing, f'missing {missing}' if missing else '')
            bold = page.eval_on_selector_all('[data-lines] > li', """els => els.filter(e => Number(getComputedStyle(e.lastElementChild).fontWeight) >= 600)
                .map(e => e.lastElementChild.innerText).filter(t => !/^(entered|was in) /.test(t))""")
            check("only a world's entry is bold in the timeline", not bold, ' | '.join(bold[:3]))

            # ---- the other periods: today hour by hour, half a year week by week ----
            def shown(unit):
                # the days chart titled for the period, or (just after midnight, for today) nothing recorded
                page.wait_for_function(f"""() => {{
                    const h = document.querySelector('[data-section="days"] h2')
                    return (h && h.textContent.includes('{unit}')) || !!document.querySelector('[data-section="empty"]')
                }}""", timeout=30000)
                page.wait_for_function("() => !document.querySelector('[data-dashboard]').className.includes('opacity-60')", timeout=30000)

            for pid, unit in [('today', 'hour by hour'), ('180', 'week by week')]:
                page.click(f'[data-period="{pid}"]')
                shown(unit)
                days = section('days')
                labels = page.eval_on_selector_all('[data-chart="visits"] > div:nth-child(2) > div', 'els => els.map(e => e.textContent).filter(Boolean)')
                check(f'the period "{pid}" shows its chart ({unit})', unit in days or (pid == 'today' and bool(section('empty'))), ' '.join(labels) or 'nothing recorded today')
            page.click('[data-period="7"]')
            shown('day by day')

            # ---- what a person sees: a computer, then a phone ----
            page.mouse.move(5, 5)
            page.screenshot(path=str(SHOTS / 'computer.png'), full_page=True)
            phone = b.new_context(viewport={'width': 412, 'height': 800}, is_mobile=True, has_touch=True, device_scale_factor=1)
            ph = phone.new_page()
            ph.on('console', lambda m: m.type == 'error' and errors.append(m.text))
            ph.on('pageerror', lambda e: errors.append(str(e)))
            ph.goto(f'{base}/stats')
            ph.wait_for_selector('[data-gate] #dash-pass', timeout=60000)
            ph.screenshot(path=str(SHOTS / 'phone_gate.png'))
            ph.fill('#dash-pass', pw)
            ph.click('[data-gate] button[type=submit]')
            ph.wait_for_selector('[data-dashboard]', timeout=30000)
            ph.select_option('#dash-who', tag)
            ph.wait_for_function(f"() => document.querySelector('[data-status]')?.textContent.startsWith('{sent} events')", timeout=30000)
            ph.wait_for_function("() => !document.querySelector('[data-dashboard]').className.includes('opacity-60')", timeout=30000)
            wide = ph.evaluate('() => document.documentElement.scrollWidth - innerWidth')
            check('the phone page does not scroll sideways', wide <= 0, f'{wide} px too wide')
            ph.screenshot(path=str(SHOTS / 'phone.png'), full_page=True)
            phone.close()

            # ---- one visit forgotten from the timeline ----
            page.click(f'[data-visit="{visits[1]}"]')
            page.click('[data-forget-visit]')
            page.click('[data-forget-visit-yes]')
            page.wait_for_function('() => document.querySelectorAll("[data-visits] [data-visit]").length === 1', timeout=30000)
            left = admin('events', {'who': tag, 'since': (now - timedelta(days=3)).isoformat()})
            check('"Forget this visit" removes its events', isinstance(left, list) and left and all(x['visit'] == visits[0] for x in left), f'{len(left)} events left')

            # ---- forgetting the account's history (the account stays) ----
            page.click(f'{row} [data-forget]')
            page.wait_for_selector(f'{row} [data-confirm]', timeout=5000)
            check('Forget asks first', 'cannot be undone' in page.inner_text(f'{row} [data-confirm]'))
            page.click(f'{row} [data-forget-yes]')
            page.wait_for_function(f"() => /\\b0 events\\b/.test(document.querySelector('{row}')?.textContent || '')", timeout=30000)
            mine = next((d for d in admin('devices') if d['id'] == device), None)
            check('Forget the history removes its events and keeps the account', bool(mine) and int(mine['events']) == 0)

            # ---- out ----
            page.click('[data-logout]')
            page.wait_for_selector('[data-gate]', timeout=10000)
            check('Log out forgets the password on this device', page.evaluate("() => localStorage.getItem('ew-dash-pass')") is None)
            check('no console errors', not errors, ' | '.join(errors[:5]))
            b.close()
    finally:
        # leave nothing behind: the account (its events go with it) and both visits
        try:
            admin('forget_probe', {'username': tag})
            for v in visits:
                admin('forget_visit', {'visit': v})
            since = (datetime.now(timezone.utc) - timedelta(days=15)).isoformat()
            rest = [x for x in admin('events', {'since': since, 'limit': 50000}) if x['visit'] in visits]
            gone = not any(d['id'] == device for d in admin('devices'))
            print(f'cleanup: the probe account {"deleted" if gone else "STILL THERE"}, {len(rest)} of its events left')
            if rest or not gone:
                fails.append('cleanup')
        except Exception as e:  # the cleanup must be reported, never hide the result
            print('cleanup failed:', e)
            fails.append('cleanup')
    print(f'{len(fails)} wrong' if fails else 'all ok', f'(screenshots in {SHOTS})')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
